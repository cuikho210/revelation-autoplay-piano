import { PreviewPlayer } from "../piano"
import { GetMusicFromPath } from "../music"
import { GetFileNameFromPath } from "../converter"
import "../../asset/scss/page/preview_music_controller.scss"

const $ = document.querySelector.bind(document)

main()
async function main() {
    let { path, theme } = getURLQuery()
    setTheme(theme)
    
    let music = await GetMusicFromPath(path)
    let music_name = await GetFileNameFromPath(path)

    setTitle(music_name)

    new PreviewPlayer(music, {
        play_btn: $("#play_btn") as HTMLButtonElement,
        stop_btn: $("#stop_btn") as HTMLButtonElement,
        tempo_status: $("#tempo_status") as HTMLParagraphElement,
        beat_status: $("#beat_status") as HTMLParagraphElement,
        time_status: $("#time_status") as HTMLParagraphElement,
        progress_bar: $("#progress_bar") as HTMLDivElement,
        progress_bar_progress: $("#progress_bar_progress") as HTMLDivElement
    })
}

function getURLQuery() {
    let url = new URLSearchParams(location.search)

    let path = url.get("path")
    if (!path) throw new Error("Path is null")

    let theme = url.get("theme")
    if (!theme) theme = "light"

    return { path, theme }
}

function setTheme(theme: string) {
    document.documentElement.setAttribute("data-theme", theme)
}

function setTitle(music_name: string) {
    let music_name_el = $("#music_name") as HTMLHeadingElement
    music_name_el.innerText = music_name
}