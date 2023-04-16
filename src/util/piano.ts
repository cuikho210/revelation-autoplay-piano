import { emit } from '@tauri-apps/api/event'
import { invoke } from "@tauri-apps/api/tauri"
import { documentDir, resolve } from "@tauri-apps/api/path"
import { writeTextFile, createDir, exists } from "@tauri-apps/api/fs"

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

export async function PlaySound(key: string) {
    await emit("piano_play_note", key)
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
        this.time_loop = 60 / music.tempo * 1000
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

    private loop() {
        if (!this.is_playing) return
        if (this.current_beat_index >= this.music.data.length) return

        this.music.data[this.current_beat_index].forEach(piano_key => {
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

            invoke("click_mouse_left", {
                x: piano_note.position.x,
                y: piano_note.position.y
            })
        })

        this.current_beat_index += 1

        setTimeout(() => this.loop(), this.time_loop)
    }
}

export async function SaveMusic(music_name: string, music: Music.Music) {
    let file_name = music_name.replaceAll(" ", "_") + ".json"
    let document_path = await documentDir()
    let music_dir_path = await resolve(document_path, "Revelation_Musics")
    let music_file_path = await resolve(music_dir_path, file_name)
    
    let is_music_dir_exist = await exists(music_dir_path)
    if (!is_music_dir_exist) await createDir(music_dir_path)

    await writeTextFile(music_file_path, JSON.stringify(music))
}