import { emit } from '@tauri-apps/api/event'
import { invoke } from "@tauri-apps/api/tauri"
import { documentDir, resolve } from "@tauri-apps/api/path"
import { writeTextFile, createDir, exists, readDir, readTextFile } from "@tauri-apps/api/fs"
import { WebviewWindow } from "@tauri-apps/api/window"
import type { FileEntry } from '@tauri-apps/api/fs'

async function getMusicDir(): Promise<string> {
    let document_path = await documentDir()
    let music_dir_path = await resolve(document_path, "Revelation_Musics")

    return music_dir_path
}

export function GeneratePiano(octa_start: number, length: number): Piano.Note[] {
    let octa_template: (keyof Piano.Octaves)[] = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
    let piano: Piano.Note[] = []

    for (let i = octa_start; i < octa_start + length; i++) {
        let octa: Piano.Note[] = []
        
        octa_template.forEach(note => {
            octa.push({
                octa: i,
                key: note,
                position: {x: 0, y: 0}
            })
        })

        piano.push(...octa)
    }

    return piano
}

export async function PlaySound(note: string) {
    await invoke("play_note", { note })
}

export async function SavePiano(piano: Piano.Piano84Key) {
    await emit("piano_save", piano)
}

export class PianoPlayer {
    private piano: Piano.Piano84Key
    private music: Music.Music
    private time_loop: number
    private current_beat_index: number = 0
    private is_playing: boolean = false

    constructor(piano: Piano.Piano84Key, music: Music.Music) {
        this.piano = piano
        this.music = music
        this.time_loop = 7500 / music.tempo // 60 * 1000 / (tempo * 8)
    }

    public Play() {
        this.is_playing = true
        this.loop()
    }

    public Pause() {
        this.is_playing = false
    }

    public Stop() {
        this.is_playing = false
        this.current_beat_index = 0
    }

    public TogglePlay() {
        if (this.is_playing) this.Stop()
        else this.Play()
    }

    private /*async*/ loop() {
        if (!this.is_playing) return
        
        if (this.current_beat_index >= this.music.data.length) {
            this.Stop()
            return
        }

        for (let piano_key of this.music.data[this.current_beat_index]) {
            if (!piano_key) return

            let octa: number
            let key_name: keyof Piano.Octaves

            if (piano_key.length == 2) {
                octa = Number(piano_key.at(1))
                key_name = piano_key.at(0) as keyof Piano.Octaves
            } else {
                octa = Number(piano_key.at(2))
                key_name = piano_key.slice(0, 2) as keyof Piano.Octaves
            }

            let piano_note = this.piano.find(note => note.key == key_name && note.octa == octa)
            if (!piano_note) return

            /*await*/ invoke("click_mouse_left", {
                x: piano_note.position.x,
                y: piano_note.position.y
            })
        }

        this.current_beat_index += 1

        setTimeout(() => this.loop(), this.time_loop)
    }
}

export async function SaveMusic(music_name: string, music: Music.Music) {
    let file_name = music_name.replaceAll(" ", "_") + ".json"
    let music_dir_path = await getMusicDir()
    let music_file_path = await resolve(music_dir_path, file_name)
    
    let is_music_dir_exist = await exists(music_dir_path)
    if (!is_music_dir_exist) await createDir(music_dir_path)

    await writeTextFile(music_file_path, JSON.stringify(music))
}

export async function ListMusic(): Promise<FileEntry[]> {
    let music_dir_path = await getMusicDir()

    let is_music_dir_exist = await exists(music_dir_path)
    if (!is_music_dir_exist) throw null

    let entries = await readDir(music_dir_path)
    return entries
}

export async function GetMusicFromPath(music_path: string): Promise<Music.Music> {
    let content = await readTextFile(music_path)
    let music: Music.Music = JSON.parse(content)

    return music
}

export async function CreateMusicControlWindow(music_path: string) {
    new WebviewWindow("play_music_controller", {
        url: "/pages/play_music/play_music_controller.html?path=" + music_path,
        title: "Play Music Controller",
        alwaysOnTop: true,
        resizable: false,
        width: 240,
        height: 240
    })
}