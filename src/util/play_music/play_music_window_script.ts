import { GetPianoConfig } from "../config_piano_key"
import { PianoPlayer } from "../piano"

main()
async function main() {
    let piano = await GetPianoConfig()

    let music: Music.Music = {
        tempo: 60,
        data: [
            ["C4", "E4", "G4"],
            [],
            [],
            ["E5"],
            ["A5"],
            ["B5"],
            ["C6"]
        ]
    }

    let player = new PianoPlayer(piano, music)

    setTimeout(() => player.Play(), 3000)
}