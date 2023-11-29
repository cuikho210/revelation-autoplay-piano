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

interface ControllerElements {
    play_btn: HTMLButtonElement
    stop_btn: HTMLButtonElement
    tempo_status: HTMLParagraphElement
    beat_status: HTMLParagraphElement
    time_status: HTMLParagraphElement
    progress_bar: HTMLDivElement
    progress_bar_progress: HTMLDivElement
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
    protected elements: ControllerElements
    protected beat_length: number
    protected display_time_length: string

    constructor(music: Music.Music, elements: ControllerElements) {
        this.music = music
        this.elements = elements
        this.time_loop = 7500 / music.tempo // 60 * 1000 / (tempo * 8)
        this.beat_length = this.music.data.length
        this.display_time_length = this.getDisplayTime(this.beat_length * this.time_loop)
        this.elements.tempo_status.innerText = this.music.tempo + "bpm"

        this.createListener()
        this.onLoop()
    }

    public Play() {
        this.elements.play_btn.innerText = "pause"
        this.status = PlayStatus.Playing
        this.loop()
    }

    public Pause() {
        this.elements.play_btn.innerText = "play_arrow"
        this.status = PlayStatus.Paused
    }

    public Stop() {
        this.elements.play_btn.innerText = "play_arrow"
        this.status = PlayStatus.Stopped
        this.current_beat_index = 0
        this.onLoop()
    }

    public TogglePlay() {
        if (this.status == PlayStatus.Playing) this.Pause()
        else this.Play()
    }

    protected loop() {}

    protected onLoop() {
        this.updateTimeStatus()
        this.updateProgressBarProgress()
    }

    protected createListener() {
        this.elements.play_btn.onclick = () => {
            if (this.status == PlayStatus.Playing) this.Pause()
            else this.Play()
        }

        this.elements.stop_btn.onclick = () => {
            this.Stop()
        }

        this.elements.progress_bar.addEventListener("click", (event) => this.setCurrentBeatIndex(event))
    }

    updateTimeStatus() {
        let display_current_time = this.getDisplayTime(this.current_beat_index * this.time_loop)
        this.elements.time_status.innerText = display_current_time + "/" + this.display_time_length
    }

    updateProgressBarProgress() {
        let percent = this.current_beat_index / this.beat_length * 100
        this.elements.progress_bar_progress.style.width = percent + "%"
    }

    getDisplayTime(time_in_millis: number) {
        let current_time_in_seconds = Math.round(time_in_millis / 1000)
        let current_time_in_minutes = 0

        if (current_time_in_seconds > 60) {
            current_time_in_minutes = Math.floor(current_time_in_seconds / 60)
            current_time_in_seconds = current_time_in_seconds % 60
        }

        return current_time_in_minutes + ":" + current_time_in_seconds
    }

    setCurrentBeatIndex(event: MouseEvent) {
        let progress_bar_rect = this.elements.progress_bar.getBoundingClientRect()
        let mouse_x = event.clientX
        let percent = (mouse_x - progress_bar_rect.x) / progress_bar_rect.width * 100
        this.current_beat_index = Math.round(percent * this.beat_length / 100)
        this.onLoop()
    }
}

export class PianoPlayer extends Player {
    private piano: Piano.Piano84Key

    constructor(piano: Piano.Piano84Key, music: Music.Music, elements: ControllerElements) {
        super(music, elements)
        this.piano = piano
    }

    loop() {
        if (this.status != PlayStatus.Playing) return
        
        if (this.current_beat_index >= this.music.data.length) {
            this.Stop()
            return
        }

        let notes: Music.Note[] = []

        for (let note of this.music.data[this.current_beat_index]) {
            if (!note) return

            note.duration_in_ms = this.time_loop * note.duration_in_thirty_second_note;
            notes.push(note)
        }

        invoke("inject_touch_notes", { notes })

        this.onLoop()
        this.current_beat_index += 1
        setTimeout(() => this.loop(), this.time_loop)
    }
}

export class PreviewPlayer extends Player {
    constructor(music: Music.Music, elements: ControllerElements) {
        super(music, elements)
    }

    protected loop() {
        if (this.status != PlayStatus.Playing) return
        
        if (this.current_beat_index >= this.music.data.length) {
            this.Stop()
            return
        }

        for (let piano_key of this.music.data[this.current_beat_index]) {
            if (!piano_key) return
            PlaySound(piano_key.name)
        }

        this.onLoop()
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
        width: 360,
        height: 200
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