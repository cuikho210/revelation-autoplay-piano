use std::fs;
use std::path::Path;

#[tauri::command]
pub fn rename(path: String, new_name: String) {
    let old_path = Path::new(&path);
    let new_path = Path::new(&old_path).parent().unwrap().join(new_name);

    fs::rename(old_path, new_path).unwrap();
}