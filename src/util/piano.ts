import { emit } from '@tauri-apps/api/event'

export async function PlaySound(key: string) {
    await emit("piano_play_note", key)
}

export async function SavePiano(piano: Piano.Piano24Key) {
    await emit("piano_save", piano)
}