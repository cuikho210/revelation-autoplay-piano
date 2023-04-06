import { emit } from '@tauri-apps/api/event'
import { GenerateAbsolutePianoKeys } from "./config_piano_key"

// const piano = await GenerateAbsolutePianoKeys()

export async function PlaySound(key: keyof Piano.Octaves, octa_number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
    emit("play_piano_note", key + octa_number)
}

// export function PlayAutoClick(key: keyof Piano.Octaves, octa_number: number) {
//     let key_octa = "octa" + octa_number
//     let octa = piano[key_octa as keyof Piano.Piano24Key]


// }