import { emit } from '@tauri-apps/api/event'
import { GenerateAbsolutePianoKeys } from "./config_piano_key"

// const piano = await GenerateAbsolutePianoKeys()

export async function PlaySound(key: string) {
    await emit("play_piano_note", key)
}

// export function PlayAutoClick(key: keyof Piano.Octaves, octa_number: number) {
//     let key_octa = "octa" + octa_number
//     let octa = piano[key_octa as keyof Piano.Piano24Key]


// }