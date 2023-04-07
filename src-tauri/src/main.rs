// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod piano;

// use mouse_rs::{Mouse, types::keys::Keys};

// #[tauri::command]
// fn click_mouse_left(x: i32, y: i32) {
//     let mouse = Mouse::new();
//     mouse.move_to(x, y).expect("Unable to move mouse");
//     mouse.click(&Keys::LEFT).expect("Unable to click mouse left");
// }
 
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                let window = app.get_window("main").unwrap();
                window_shadows::set_shadow(&window, true).unwrap();
            }

            let resource_path = app.path_resolver();

            app.listen_global("play_piano_note", move |event| {
                let note: String = event.payload().unwrap().replace("\"", "");

                let note_path = resource_path
                    .resolve_resource(format!("./piano_key/{}.mp3", note))
                    .expect("failed to resolve resource dir");
            
                piano::play(note_path.to_path_buf());
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
