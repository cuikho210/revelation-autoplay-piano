use std::{collections::HashMap, thread, time::Duration};
use once_cell::sync::Lazy;
use crate::piano;
use windows::Win32::{
    Foundation::{
        RECT, HANDLE, HWND, POINT
    },
    UI::{
        Input::Pointer::{
            InitializeTouchInjection, InjectTouchInput,
            TOUCH_FEEDBACK_NONE,
            POINTER_TOUCH_INFO, POINTER_INFO,
            POINTER_FLAG_DOWN, POINTER_FLAG_UP,
            POINTER_FLAG_INRANGE, POINTER_FLAG_INCONTACT, POINTER_FLAG_UPDATE,
            POINTER_BUTTON_CHANGE_TYPE
        },
        WindowsAndMessaging::{
            PT_TOUCH, TOUCH_MASK_CONTACTAREA, TOUCH_MASK_ORIENTATION, TOUCH_MASK_PRESSURE,
        }
    }
};

const TOUCH_LENGTH: u32 = 88;
const INTERVAL_DURATION_IN_MS: u64 = 32;
static mut TOUCH_POINTERS: Lazy<HashMap<String, Touch>> = Lazy::new(|| HashMap::new());
static mut MUSIC_NOTES_QUEUE: Lazy<Vec<piano::MusicNote>> = Lazy::new(|| Vec::new());
static mut CURRENT_STATE: State = State::Idle;

enum State {
    Idle,
    Playing,
}

#[derive(Debug)]
enum TouchState {
    Queue,
    Update,
    Release,
}

#[derive(Debug)]
struct Touch {
    pointer: POINTER_TOUCH_INFO,
    state: TouchState,
}

impl Touch {
    fn new(id: u32, x: i32, y: i32) -> Self {
        Touch {
            pointer: new_pointer_touch_info(id, x, y),
            state: TouchState::Queue,
        }
    }

    fn inject_touch_input(&self) {
        unsafe {
            let is_ok = InjectTouchInput(&[self.pointer]).as_bool();
            if !is_ok {
                eprintln!("----------------------------------------");
                eprintln!("Inject touch {} failed!", self.pointer.pointerInfo.pointerId);
                eprintln!("State: {:?}", self.state);
                eprintln!("----------------------------------------");
            }
        }
    }

    fn touch_down(&mut self) {
        self.touch_release();

        self.state = TouchState::Update;
        self.pointer.pointerInfo.pointerFlags = POINTER_FLAG_INRANGE | POINTER_FLAG_INCONTACT | POINTER_FLAG_DOWN;
        self.inject_touch_input();
    }

    fn touch_hold(&mut self) {
        self.pointer.pointerInfo.pointerFlags = POINTER_FLAG_INRANGE | POINTER_FLAG_INCONTACT | POINTER_FLAG_UPDATE;
        self.inject_touch_input();
    }

    fn touch_release(&mut self) {
        self.state = TouchState::Release;
        self.pointer.pointerInfo.pointerFlags = POINTER_FLAG_UP;
        self.inject_touch_input();
    }
}

#[tauri::command]
pub fn inject_touch_notes(mut notes: Vec<piano::MusicNote>) {
    for note in notes.iter_mut() {
        note.duration_in_ms = 500;
        unsafe {
            TOUCH_POINTERS.get_mut(&note.name).unwrap().touch_down();
            MUSIC_NOTES_QUEUE.push(note.to_owned());
        }

        start_update_loop();
    }
}

pub fn init(app: &tauri::App) {
    init_touch_injection();
    init_touch_pointers(app);
    // init_event_listener(app);
}

fn init_touch_pointers(app: &tauri::App) {
    let path_resolver = app.path_resolver();
    let piano_config = piano::get_piano_config(&path_resolver);

    if let Some(piano_config) = piano_config {
        for (index, note) in piano_config.iter().enumerate() {
            let key = note.key.to_owned() + &note.octa.to_string();
            unsafe {
                TOUCH_POINTERS.insert(
                    key,
                    Touch::new(
                        index.try_into().unwrap(),
                        note.position.x,
                        note.position.y
                    ),
                );
            }
        }
    }
}

fn init_touch_injection() {
    unsafe {
        let result = InitializeTouchInjection(TOUCH_LENGTH, TOUCH_FEEDBACK_NONE).as_bool();
        println!("InitializeTouchInjection: {result}");
    }
}

// fn init_event_listener(app: &tauri::App) {
//     app.listen_global("autoplay_piano:play", |_event| {
//         start_update_loop();
//     });

//     app.listen_global("autoplay_piano:stop", |_event| {
//         unsafe {
//             CURRENT_STATE = State::Idle;
//         }
//     });
// }

fn new_pointer_touch_info(id: u32, x: i32, y: i32) -> POINTER_TOUCH_INFO {
    let margin = 2;
    let mut touch_info = POINTER_TOUCH_INFO::default();

    touch_info.touchMask = TOUCH_MASK_CONTACTAREA | TOUCH_MASK_ORIENTATION | TOUCH_MASK_PRESSURE;
    touch_info.rcContact = RECT { left: x - margin, top: y - margin, right: x + margin, bottom: y + margin };
    touch_info.orientation = 0;
    touch_info.pressure = 512;

    touch_info.pointerInfo = POINTER_INFO {
        pointerType: PT_TOUCH,
        pointerId: id,
        frameId: 0,
        pointerFlags: POINTER_FLAG_UP,
        sourceDevice: HANDLE::default(),
        hwndTarget: HWND::default(),
        ptPixelLocation: POINT { x, y },
        ptHimetricLocation: POINT::default(),
        ptPixelLocationRaw: POINT::default(),
        ptHimetricLocationRaw: POINT::default(),
        dwTime: 0,
        historyCount: 0,
        InputData: 0,
        dwKeyStates: 0,
        PerformanceCount: 0,
        ButtonChangeType: POINTER_BUTTON_CHANGE_TYPE::default()
    };
    
    touch_info
}

fn start_update_loop() {
    unsafe {
        match CURRENT_STATE {
            State::Idle => {
                CURRENT_STATE = State::Playing;
                generate_update_loop();
            },
            _ => ()
        }
    }
}

fn generate_update_loop() {
    thread::spawn(|| {
        println!("Spawned a thread");
        loop {
            unsafe {
                match CURRENT_STATE {
                    State::Idle => break,
                    _ => ()
                }

                if MUSIC_NOTES_QUEUE.len() == 0 {
                    break;
                }

                let mut note_length: u8 = 0;

                for note in MUSIC_NOTES_QUEUE.iter_mut() {
                    let touch = TOUCH_POINTERS.get_mut(&note.name).unwrap();

                    note.duration_in_ms -= INTERVAL_DURATION_IN_MS as isize;
                    if note.duration_in_ms <= 0 {
                        touch.touch_release();
                        break;
                    }

                    note_length += 1;

                    match touch.state {
                        TouchState::Queue => touch.touch_down(),
                        TouchState::Update => touch.touch_hold(),
                        TouchState::Release => touch.touch_release(),
                    }
                }

                if note_length == 0 {
                    MUSIC_NOTES_QUEUE.clear();
                    println!("Clear queue");
                    break;
                }
            }

            println!("Looping...");
            thread::sleep(Duration::from_millis(INTERVAL_DURATION_IN_MS));
        }

        unsafe {
            println!("Closed a thread");
            CURRENT_STATE = State::Idle;
        }
    });
}