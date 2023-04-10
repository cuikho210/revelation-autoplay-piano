import { GetPianoConfig } from "../config_piano_key"
import { PianoPlayer } from "../piano"

main()
async function main() {
    let piano = await GetPianoConfig()

    let music: Music.Music = {
        tempo: 150,
        data: [
            ["C5"],
            ["D5"],
            ["E5"],
            ["C5"],
            ["G5"],
            [],
            [],
            ["E5"],
            ["D5"],
            [],
            ["G5"],
            [],
            ["D5"],
            [],
            ["C5"],
            ["A4"],
            ["E5"],
        ]
    }

    let player = new PianoPlayer(piano, music)

    setTimeout(() => player.Play(), 3000)
}