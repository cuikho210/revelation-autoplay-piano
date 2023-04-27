// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod piano;
mod input;
mod util;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                use tauri::Manager;
                let window = app.get_window("main").unwrap();
                window_shadows::set_shadow(&window, true).unwrap();
            }
            
            input::init_touch_injection();
            piano::listen_piano_save(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            input::touch_tap,
            piano::play_note,
            util::rename
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
