use std::{fs, path::PathBuf};
use tauri::{Manager, PathResolver};
use serde::{Serialize, Deserialize};

const FILE_CONFIG_PIANO_KEY: &str = "config_piano_key.json";

#[derive(Serialize, Deserialize)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[derive(Serialize, Deserialize)]
pub struct PianoNote {
    pub key: String,
    pub octa: u8,
    pub position: Position,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct MusicNote {
    pub name: String,
    pub duration_in_thirty_second_note: u8,
    pub duration_in_ms: isize,
}

fn get_piano_config_path(path_resolver: &PathResolver) -> PathBuf {
    let mut path_config_file = path_resolver.app_config_dir().unwrap();
    path_config_file.push(FILE_CONFIG_PIANO_KEY);

    path_config_file
}

fn store_piano_config(path_resolver: &PathResolver, piano_config_data: &str) {
    let path_config_file = get_piano_config_path(path_resolver);

    fs::create_dir_all(&path_config_file).unwrap();
    fs::write(&path_config_file, piano_config_data).unwrap();
}

pub fn get_piano_config(path_resolver: &PathResolver) -> Vec<PianoNote> {
    let path_config_file = get_piano_config_path(path_resolver);
    let data_in_string = fs::read_to_string(path_config_file).unwrap();
    let piano_config: Vec<PianoNote> = serde_json::from_str(&data_in_string).unwrap();

    piano_config
}

pub fn listen_piano_save(app: &tauri::App) {
    let handle = app.handle();
    let path_resolver = app.path_resolver();

    app.listen_global("piano_save", move |event| {
        let piano_config_data = event.payload().unwrap();

        handle.emit_all("piano_draw", piano_config_data).unwrap();
        store_piano_config(&path_resolver, piano_config_data);
    });
}