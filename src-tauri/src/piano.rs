use std::fs;
use tauri::Manager;

const FILE_CONFIG_PIANO_KEY: &str = "config_piano_key.json";

pub fn listen_piano_save(app: &mut tauri::App) {
    let handle = app.handle();
    let resource_path = app.path_resolver();

    let mut path_config_file = resource_path.app_config_dir().unwrap();
    fs::create_dir_all(&path_config_file).unwrap();

    path_config_file.push(FILE_CONFIG_PIANO_KEY);

    app.listen_global("piano_save", move |event| {
        let piano_data = event.payload().unwrap();

        handle.emit_all("piano_draw", piano_data).unwrap();
        fs::write(&path_config_file, piano_data).unwrap();
    });
}