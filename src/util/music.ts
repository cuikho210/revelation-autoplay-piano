import { documentDir, resolve } from "@tauri-apps/api/path"
import { exists, createDir, writeTextFile, readDir, readTextFile } from "@tauri-apps/api/fs"
import { GetFileNameFromPath } from "./converter"
import type { FileEntry } from "@tauri-apps/api/fs"

export async function GetMusicDir(): Promise<string> {
    let document_path = await documentDir()
    let music_dir_path = await resolve(document_path, "Revelation_Musics")

    return music_dir_path
}

export async function SaveMusic(music_name: string, music: Music.Music, output_dir?: string) {
    let file_name = music_name + ".json"
    let music_dir_path = output_dir || await GetMusicDir()
    let music_file_path = await resolve(music_dir_path, file_name)
    
    let is_music_dir_exist = await exists(music_dir_path)
    if (!is_music_dir_exist) {
        console.log("Directory does not exist. Start creating a new one.")
        await createDir(music_dir_path, { recursive: true })
    }

    await writeTextFile(music_file_path, JSON.stringify(music))
}

export async function ListAll(path?: string): Promise<FileEntry[]> {
    let music_dir_path: string

    if (path) music_dir_path = path
    else music_dir_path = await GetMusicDir()

    let is_music_dir_exist = await exists(music_dir_path)
    if (!is_music_dir_exist) {
        console.log("Directory does not exist. Start creating a new one.")
        await createDir(music_dir_path, { recursive: true })
    }

    let entries = await readDir(music_dir_path)
    return entries
}

export async function ListMusic(path?: string): Promise<FileEntry[]> {
    let entries = await ListAll(path)
    let musics = entries.filter(entry => entry.name && entry.name.endsWith(".json"))

    return musics
}

export async function ListCollection(path?: string): Promise<FileEntry[]> {
    let entries = await ListAll(path)
    let collections = entries.filter(entry => entry.children !== undefined)

    return collections
}

export async function ListMusicAndCollection(path?: string) {
    let entries = await ListAll(path)
    let collections = entries.filter(entry => entry.children !== undefined)
    let musics = entries.filter(entry => entry.name && entry.name.endsWith(".json"))

    return {
        collections,
        musics
    }
}

export async function GetMusicFromPath(music_path: string): Promise<Music.Music> {
    let content = await readTextFile(music_path)
    let music: Music.Music = JSON.parse(content)

    return music
}

export async function CreateCollection(collection_name: string, parent_dir?: string) {
    if (!parent_dir) parent_dir = await GetMusicDir()
    let new_path = await resolve(parent_dir, collection_name)

    await createDir(new_path)
}

export async function GetCollectionBreadcrumb(path?: string): Promise<FileEntry[]> {
    if (!path) return []

    let music_dir_path = await GetMusicDir()
    let current_path = path
    let breadcrumb: FileEntry[] = []
    
    while (current_path !== music_dir_path) {
        breadcrumb.push({
            name: await GetFileNameFromPath(current_path),
            path: current_path
        })

        current_path = await resolve(current_path, "..")
    }

    return breadcrumb.reverse()
}