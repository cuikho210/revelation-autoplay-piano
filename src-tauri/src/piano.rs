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

fn get_piano_config_dir_path(path_resolver: &PathResolver) -> PathBuf {
    path_resolver.app_config_dir().unwrap()
}

fn get_piano_config_file_path(path_resolver: &PathResolver) -> PathBuf {
    let mut path = get_piano_config_dir_path(path_resolver);
    path.push(FILE_CONFIG_PIANO_KEY);

    path
}

fn store_piano_config(path_resolver: &PathResolver, piano_config_data: &str) {
    let path_config_file = get_piano_config_file_path(path_resolver);
    fs::write(&path_config_file, piano_config_data).unwrap();
}

fn create_config_path(app: &tauri::App) {
    let path_resolver = app.path_resolver();
    let path_config_dir = get_piano_config_dir_path(&path_resolver);
    fs::create_dir_all(&path_config_dir).unwrap();
}

pub fn init(app: &tauri::App) {
    create_config_path(app);
    listen_piano_save(app);
}

pub fn get_piano_config(path_resolver: &PathResolver) -> Option<Vec<PianoNote>> {
    let path_config_file = get_piano_config_file_path(path_resolver);
    let data_in_string = fs::read_to_string(path_config_file).ok();

    if let Some(data) = data_in_string {
        let piano_config: Vec<PianoNote> = serde_json::from_str(&data).unwrap();
        Some(piano_config)
    } else {
        None
    }
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