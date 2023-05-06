import { emit } from '@tauri-apps/api/event'
import { invoke } from "@tauri-apps/api/tauri"
import { WebviewWindow } from "@tauri-apps/api/window"
import * as Tone from "tone"

const sampler = createPianoSampler()

export enum PlayStatus {
    Playing,
    Paused,
    Stopped
}

function createPianoSampler(piano?: Piano.Piano84Key) {
    if (!piano) piano = GeneratePiano(1, 7)
    const urls: { [key: string]: string } = {}

    for (let note of piano) {
        let note_name = note.key + note.octa
        let file_name = note_name + ".mp3"

        urls[note_name] = file_name
    }

    return new Tone.Sampler({
        urls,
        release: 1,
        baseUrl: "/piano_key/"
    }).toDestination()
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
    await Tone.loaded()
    sampler.triggerAttackRelease(note, 4)
}

export async function SavePiano(piano: Piano.Piano84Key) {
    await emit("piano_save", piano)
}

class Player {
    protected music: Music.Music
    protected time_loop: number
    protected current_beat_index: number = 0
    protected status: PlayStatus = PlayStatus.Stopped

    constructor(music: Music.Music) {
        this.music = music
        this.time_loop = 7500 / music.tempo // 60 * 1000 / (tempo * 8)
    }

    public Play() {
        this.status = PlayStatus.Playing
        this.loop()
    }

    public Pause() {
        this.status = PlayStatus.Paused
    }

    public Stop() {
        this.status = PlayStatus.Stopped
        this.current_beat_index = 0
    }

    public TogglePlay() {
        if (this.status == PlayStatus.Playing) this.Pause()
        else this.Play()
    }

    protected loop() {

    }
}

export class PianoPlayer extends Player {
    private piano: Piano.Piano84Key

    constructor(piano: Piano.Piano84Key, music: Music.Music) {
        super(music)
        this.piano = piano
    }

    loop() {
        if (this.status != PlayStatus.Playing) return
        
        if (this.current_beat_index >= this.music.data.length) {
            this.Stop()
            return
        }

        let points: Position[] = []

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

            points.push({
                x: piano_note.position.x,
                y: piano_note.position.y
            })
        }

        invoke("touch_tap", { points })
        this.current_beat_index += 1

        setTimeout(() => this.loop(), this.time_loop)
    }
}

export class PreviewPlayer extends Player {
    constructor(music: Music.Music) {
        super(music)
    }

    loop() {
        if (this.status != PlayStatus.Playing) return
        
        if (this.current_beat_index >= this.music.data.length) {
            this.Stop()
            return
        }

        for (let piano_key of this.music.data[this.current_beat_index]) {
            if (!piano_key) return
            PlaySound(piano_key)
        }

        this.current_beat_index += 1
        setTimeout(() => this.loop(), this.time_loop)
    }
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

export async function CreateMusicPreviewWindow(
    music_path: string,
    theme: 'light' | 'dark'
) {
    let url = "/pages/play_music/preview_music_controller.html"
        + `?path=${music_path}`
        + `&theme=${theme}`

    new WebviewWindow("play_music_controller", {
        url,
        title: "Preview Music",
        alwaysOnTop: false,
        resizable: false,
        width: 360,
        height: 200,
        center: true
    })
}