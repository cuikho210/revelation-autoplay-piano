import { listen } from "@tauri-apps/api/event"
import { GetPianoConfig } from "../config_piano_key"
import { PianoPlayer } from "../piano"
import { GetMusicFromPath } from "../music"
import "../../asset/scss/page/play_music_controller.scss"

main()
async function main() {
    let path = new URLSearchParams(location.search).get("path")
    if (!path) throw new Error("Path is null")
    
    let piano = await GetPianoConfig()
    let music = await GetMusicFromPath(path)
    let player = new PianoPlayer(piano, music)
    
    document.getElementById("play_button")?.addEventListener("click", () => {
        player.Play()
    })

    await listen("toggle_play", () => {
        player.TogglePlay()
    })
}