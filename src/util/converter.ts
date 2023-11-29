import { Midi } from "@tonejs/midi"
import { open } from "@tauri-apps/api/dialog"
import { readBinaryFile } from "@tauri-apps/api/fs"
import { type } from "@tauri-apps/api/os"
import { SaveMusic } from "./music"

function convertSharpNoteToFlatNote(key: string, octa: number): string {
    let result_key = key

    if (key == "C#") result_key = "Db"
    if (key == "D#") result_key = "Eb"
    if (key == "F#") result_key = "Gb"
    if (key == "G#") result_key = "Ab"
    if (key == "A#") result_key = "Bb"

    return result_key + octa
}

export async function GetFileNameFromPath(path: string): Promise<string> {
    let os_type = await type()
    let arr

    if (os_type == "Windows_NT") arr = path.split("\\")
    else arr = path.split("/")

    let music_name = arr[arr.length - 1].replace(".json", "").replace(".mid", "")

    return music_name
}

export async function ConvertMidiToJsonFromFile(output_dir?: string) {
    let file_path = await open({
        multiple: false,
        filters: [{
            name: "MIDI",
            extensions: ["mid"]
        }]
    })

    if (!file_path) throw new Error("File path is null")
    if (Array.isArray(file_path)) file_path = file_path[0]
    
    let midi_file = await readBinaryFile(file_path)
    let midi = new Midi(midi_file)
    
    let note_time = {
        quarter_note: midi.header.ppq,
        eighth_note: midi.header.ppq / 2,
        sixteenth_note: midi.header.ppq / 4,
        thirty_second_note: midi.header.ppq / 8 // 1 phần 32 của nốt trắng
    }

    let duration_in_thirty_second_note = Math.ceil(midi.durationTicks / note_time.thirty_second_note)
    let tempo = 120

    if (midi.header.tempos.length > 0 && midi.header.tempos[0].bpm) {
        tempo = Math.round(midi.header.tempos[0].bpm)
    }

    let music: Music.Music = {
        tempo,
        data: []
    }

    for (let i = 0; i < duration_in_thirty_second_note; i++) {
        music.data.push([])
    }

    for (let track of midi.tracks) {
        for (let note of track.notes) {
            let note_name = convertSharpNoteToFlatNote(note.pitch, note.octave)
            let index = Math.floor(note.ticks / note_time.thirty_second_note)

            music.data[index].push({
                name: note_name,
                duration_in_thirty_second_note: Math.floor(note.durationTicks / note_time.thirty_second_note),
            })
        }
    }

    let music_name = await GetFileNameFromPath(file_path)

    await SaveMusic(
        music_name,
        music,
        output_dir
    )
}