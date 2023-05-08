import { appConfigDir, resolve } from "@tauri-apps/api/path"
import { readTextFile } from "@tauri-apps/api/fs"
import type { PhysicalSize, PhysicalPosition } from "@tauri-apps/api/window"

// Tinh truc x
// Phim dan: 12x7 = 84 phim, trong do co 49 phim trang, 35 phim den => Ti le moi phim trang = 100% / 49 = 2.04%
// Moi quang 8 co 12 phim, trong do co 7 phim trang va 5 phim den
// Phim trang 1: 2.04% / 2 = 1.02%
// Phim trang 2 tro di: Phim trang 1 + 2.04%

function generateRelativePianoKeys(): Piano.Piano84Key {
    let default_y_position_white = 89
    let default_y_position_black = 78

    let piano_keys: (keyof Piano.Octaves)[] = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
    let size = 1.88

    function create_octa(octa: number, pre_key_position: Position): Piano.Note[] {
        // White key is 0, 2, 4, 5, 7, 9, 11
        // Black key is 1, 3, 6, 8, 10

        let notes: Piano.Note[] = []

        piano_keys.forEach((key, i) => {
            if (i == 0 || i == 2 || i == 4 || i == 5 || i == 7 || i == 9 || i == 11) {
                pre_key_position = {
                    x: pre_key_position.x + size,
                    y: default_y_position_white
                }

                notes.push({
                    key,
                    octa: octa,
                    position: pre_key_position
                })
            } else {
                notes.push({
                    key,
                    octa: octa,
                    position: {
                        x: pre_key_position.x + (size / 2),
                        y: default_y_position_black
                    }
                })
            }
        })

        return notes
    }

    let octa1 = create_octa(1, { x: size * 2, y: default_y_position_white })
    let octa2 = create_octa(2, octa1[octa1.length - 1].position)
    let octa3 = create_octa(3, octa2[octa1.length - 1].position)
    let octa4 = create_octa(4, octa3[octa1.length - 1].position)
    let octa5 = create_octa(5, octa4[octa1.length - 1].position)
    let octa6 = create_octa(6, octa5[octa1.length - 1].position)
    let octa7 = create_octa(7, octa6[octa1.length - 1].position)

    let note_A0: Piano.Note = {
        key: "A",
        octa: 0,
        position: {
            x: octa1[0].position.x - (size * 2),
            y: default_y_position_white
        }
    }

    let note_Bb0: Piano.Note = {
        key: "Bb",
        octa: 0,
        position: {
            x: octa1[0].position.x - (size * 1.5),
            y: default_y_position_black
        }
    }

    let note_B0: Piano.Note = {
        key: "B",
        octa: 0,
        position: {
            x: octa1[0].position.x - size,
            y: default_y_position_white
        }
    }

    let note_C8: Piano.Note = {
        key: "C",
        octa: 8,
        position: {
            x: octa7[octa7.length - 1].position.x + size,
            y: default_y_position_white
        }
    }

    return [
        note_A0, note_Bb0, note_B0,
        ...octa1, ...octa2, ...octa3, ...octa4, ...octa5, ...octa6, ...octa7,
        note_C8
    ]
}

export function GenerateAbsolutePianoKeys(
    window_size: PhysicalSize,
    window_position: PhysicalPosition
): Piano.Piano84Key {
    const piano = generateRelativePianoKeys()

    piano.forEach(piano_note => {
        piano_note.position.x = Math.round((piano_note.position.x * window_size.width / 100) + window_position.x)
        piano_note.position.y = Math.round((piano_note.position.y * window_size.height / 100) + window_position.y)
    })

    return piano
}

export async function GetPianoConfig(): Promise<Piano.Piano84Key> {
    let piano_config_file = await appConfigDir()
    piano_config_file = await resolve(piano_config_file, "config_piano_key.json")

    let config_in_text = await readTextFile(piano_config_file)
    let config: Piano.Piano84Key = JSON.parse(config_in_text)

    return config
}