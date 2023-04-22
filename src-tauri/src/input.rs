// use std::thread;
use std::time::Duration;
use windows::Win32::{
    Foundation::{
        RECT, HANDLE, HWND, POINT
    },
    UI::{
        Input::Pointer::{
            InitializeTouchInjection, InjectTouchInput,
            TOUCH_FEEDBACK_NONE,
            POINTER_TOUCH_INFO, POINTER_INFO,
            POINTER_FLAGS,
            POINTER_FLAG_DOWN, POINTER_FLAG_UP, POINTER_FLAG_INRANGE, POINTER_FLAG_INCONTACT,
            POINTER_BUTTON_CHANGE_TYPE
        },
        WindowsAndMessaging::{
            PT_TOUCH, TOUCH_MASK_CONTACTAREA, TOUCH_MASK_ORIENTATION, TOUCH_MASK_PRESSURE,
        }
    }
};

const TOUCH_INJECT_MAX_COUNT: u32 = 256;
static mut POINTER_ID: u32 = 0;

fn new_pointer_touch_info(x: i32, y: i32, flags: POINTER_FLAGS) -> POINTER_TOUCH_INFO {
    let margin = 2;
    let mut touch_info = POINTER_TOUCH_INFO::default();

    touch_info.touchMask = TOUCH_MASK_CONTACTAREA|TOUCH_MASK_ORIENTATION|TOUCH_MASK_PRESSURE;
    touch_info.rcContact = RECT { left: x - margin, top: y - margin, right: x + margin, bottom: y + margin };
    touch_info.orientation = 90;
    touch_info.pressure = 1000;

    unsafe {
        touch_info.pointerInfo = POINTER_INFO {
            pointerType: PT_TOUCH,
            pointerId: POINTER_ID,
            frameId: 0,
            pointerFlags: flags,
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

        POINTER_ID += 1;
        if POINTER_ID > TOUCH_INJECT_MAX_COUNT {
            POINTER_ID = 0;
        }
    }
    
    touch_info
}

pub fn touch_tap(x: i32, y: i32, _duration: Duration) {
    // thread::spawn(move || {
        unsafe {
            let mut info = new_pointer_touch_info(x, y, POINTER_FLAG_DOWN | POINTER_FLAG_INRANGE | POINTER_FLAG_INCONTACT);
    
            InjectTouchInput(&[info]).as_bool();
            // let result_down = InjectTouchInput(&[info]).as_bool();
            // if result_down == false {
            //     println!("Error");
            // }
    
            info.pointerInfo.pointerFlags = POINTER_FLAG_UP;
            // thread::sleep(duration);
    
            InjectTouchInput(&[info]);
        }
    // });
}

pub fn init_touch_injection() {
    unsafe {
        InitializeTouchInjection(TOUCH_INJECT_MAX_COUNT, TOUCH_FEEDBACK_NONE);
    }
}