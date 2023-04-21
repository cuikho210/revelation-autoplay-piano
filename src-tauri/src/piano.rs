use std::thread;
use std::fs;
use std::path::{PathBuf};
use tauri::Manager;
use soloud::{Soloud, audio, AudioExt, LoadExt};

const FILE_CONFIG_PIANO_KEY: &str = "config_piano_key.json";

pub fn play_note(note_path: PathBuf) {
    thread::spawn(move || {
        let sl = Soloud::default().unwrap();
        let mut wav = audio::Wav::default();

        wav.load(note_path).unwrap();
        sl.play(&wav);
        std::thread::sleep(std::time::Duration::from_secs(1));
    });
}

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