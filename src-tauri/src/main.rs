// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod piano;

use std::{thread, time};
use tauri::Manager;
use enigo::{Enigo, MouseControllable, MouseButton};

#[tauri::command]
fn click_mouse_left(x: i32, y: i32) {
    let mut enigo_control = Enigo::new();
    enigo_control.mouse_move_to(x, y);
    enigo_control.mouse_down(MouseButton::Left);
    thread::sleep(time::Duration::from_millis(20));
    enigo_control.mouse_up(MouseButton::Left);
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                let window = app.get_window("main").unwrap();
                window_shadows::set_shadow(&window, true).unwrap();
            }
            
            piano::listen_piano_play_note(app);
            piano::listen_piano_save(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![click_mouse_left])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
