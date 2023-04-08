import { WebviewWindow } from "@tauri-apps/api/window"
import type { PhysicalSize, PhysicalPosition } from "@tauri-apps/api/window"

// Tinh truc x
// Le ngoai cua dan: 0.6% moi ben
// Phim dan: 25 phim, trong do co 15 phim trang => Ti le moi phim trang = (100% - 1.2%) / 15 = 6.59%
// Moi quang 8 co 12 phim, trong do co 7 phim trang va 5 phim den
// Phim trang 1: 0.6% + (6.59% / 2)
// Phim trang 2 tro di: Phim trang 1 + 6.59%

function generateRelativePianoKeys(): Piano.Piano24Key {
    let default_y_position = 89
    let default_y_position_hash = 78

    let octa1: Piano.Octaves = {
        "C": { x: 0, y: 0 },
        "Db": { x: 0, y: 0 },
        "D": { x: 0, y: 0 },
        "Eb": { x: 0, y: 0 },
        "E": { x: 0, y: 0 },
        "F": { x: 0, y: 0 },
        "Gb": { x: 0, y: 0 },
        "G": { x: 0, y: 0 },
        "Ab": { x: 0, y: 0 },
        "A": { x: 0, y: 0 },
        "Bb": { x: 0, y: 0 },
        "B": { x: 0, y: 0 }
    }

    let octa2: Piano.Octaves = {
        "C": { x: 0, y: 0 },
        "Db": { x: 0, y: 0 },
        "D": { x: 0, y: 0 },
        "Eb": { x: 0, y: 0 },
        "E": { x: 0, y: 0 },
        "F": { x: 0, y: 0 },
        "Gb": { x: 0, y: 0 },
        "G": { x: 0, y: 0 },
        "Ab": { x: 0, y: 0 },
        "A": { x: 0, y: 0 },
        "Bb": { x: 0, y: 0 },
        "B": { x: 0, y: 0 }
    }

    let size = 6.59
    let i = 0
    let pre_white_key = "C"

    for (let key in octa1) {
        if (i == 0) {
            octa1["C"].x = 0.6 + (size / 2)
            octa1["C"].y = default_y_position
            i++
            continue
        }

        addKey(octa1, key)
    }

    i = 0

    for (let key in octa2) {
        if (i == 0) {
            octa2["C"].x = octa1["B"].x + size
            octa2["C"].y = default_y_position
            pre_white_key = "C"
            i++
            continue
        }

        addKey(octa2, key)
    }

    return {
        octa1, octa2
    }

    function addKey(octa: Piano.Octaves, key: string) {
        if (key.includes("b")) {
            octa[key as keyof Piano.Octaves].x = octa[pre_white_key as keyof Piano.Octaves].x + (size / 2)
            octa[key as keyof Piano.Octaves].y = default_y_position_hash
        } else {
            octa[key as keyof Piano.Octaves].x = octa[pre_white_key as keyof Piano.Octaves].x + size
            octa[key as keyof Piano.Octaves].y = default_y_position
            pre_white_key = key
        }

        i++
    }
}

export function GenerateAbsolutePianoKeys(
    window_size: PhysicalSize,
    window_position: PhysicalPosition
): Piano.Piano24Key {
    const piano = generateRelativePianoKeys()

    for (let key_octa in piano) {
        let octa = piano[key_octa as keyof Piano.Piano24Key]

        for (let key in octa) {
            let piano_key: Position = octa[key as keyof Piano.Octaves]

            piano_key.x = (piano_key.x * window_size.width / 100) + window_position.x
            piano_key.y = (piano_key.y * window_size.height / 100) + window_position.y
        }
    }

    return piano
}