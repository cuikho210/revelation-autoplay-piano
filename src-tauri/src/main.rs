// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod piano;

use std::{thread, time};
use enigo::{Enigo, MouseControllable, MouseButton};

#[tauri::command]
fn click_mouse_left(x: i32, y: i32) {
    let mut enigo_control = Enigo::new();
    enigo_control.mouse_move_to(x, y);
    // enigo_control.mouse_down(MouseButton::Left);
    // thread::sleep(time::Duration::from_millis(5));
    // enigo_control.mouse_up(MouseButton::Left);
    enigo_control.mouse_click(MouseButton::Left);
    thread::sleep(time::Duration::from_millis(4));
}

#[tauri::command]
fn play_note(app_handle: tauri::AppHandle, note: &str) {
    let note_path = app_handle.path_resolver()
            .resolve_resource(format!("./piano_key/{}.mp3", note))
            .expect("failed to resolve resource dir");
    
    piano::play_note(note_path.to_path_buf());
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                use tauri::Manager;
                let window = app.get_window("main").unwrap();
                window_shadows::set_shadow(&window, true).unwrap();
            }
            
            piano::listen_piano_save(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            click_mouse_left,
            play_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
