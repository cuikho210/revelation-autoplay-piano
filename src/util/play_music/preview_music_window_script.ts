import locale from "../locale"
import { PreviewPlayer, PlayStatus } from "../piano"
import { GetMusicFromPath } from "../music"
import { GetFileNameFromPath } from "../converter"
import "../../asset/scss/page/preview_music_controller.scss"

const $ = document.querySelector.bind(document)

class Controller extends PreviewPlayer {
    play_btn = $("#play_btn") as HTMLButtonElement
    stop_btn = $("#stop_btn") as HTMLButtonElement
    tempo_status = $("#tempo_status") as HTMLParagraphElement
    beat_status = $("#beat_status") as HTMLParagraphElement
    time_status = $("#time_status") as HTMLParagraphElement
    progress_bar = $("#progress_bar") as HTMLDivElement
    progress_bar_progress = $("#progress_bar_progress") as HTMLDivElement
    beat_length = this.music.data.length
    display_time_length = this.getDisplayTime(this.beat_length * this.time_loop)

    constructor(music: Music.Music) {
        super(music)
        this.tempo_status.innerText = this.music.tempo + "bpm"

        this.createListener()
        this.onLoop()
    }

    public Play() {
        super.Play()
        this.play_btn.innerHTML = "pause"
    }

    public Pause() {
        super.Pause()
        this.play_btn.innerHTML = "play_arrow"
    }

    public Stop() {
        super.Stop()
        this.play_btn.innerHTML = "play_arrow"
        this.onLoop()
    }

    createListener() {
        this.play_btn.onclick = () => {
            if (this.status == PlayStatus.Playing) this.Pause()
            else this.Play()
        }

        this.stop_btn.onclick = () => {
            this.Stop()
        }

        this.progress_bar.addEventListener("click", (event) => this.setCurrentBeatIndex(event))
    }

    onLoop() {
        // this.updateBeatStatus()
        this.updateTimeStatus()
        this.updateProgressBarProgress()
    }

    updateBeatStatus() {
        this.beat_status.innerText = this.current_beat_index + "/" + this.beat_length
    }

    updateTimeStatus() {
        let display_current_time = this.getDisplayTime(this.current_beat_index * this.time_loop)
        this.time_status.innerText = display_current_time + "/" + this.display_time_length
    }

    updateProgressBarProgress() {
        let percent = this.current_beat_index / this.beat_length * 100
        this.progress_bar_progress.style.width = percent + "%"
    }

    getDisplayTime(time_in_millis: number) {
        let current_time_in_seconds = Math.round(time_in_millis / 1000)
        let current_time_in_minutes = 0

        if (current_time_in_seconds > 60) {
            current_time_in_minutes = Math.floor(current_time_in_seconds / 60)
            current_time_in_seconds = current_time_in_seconds % 60
        }

        return current_time_in_minutes + ":" + current_time_in_seconds
    }

    setCurrentBeatIndex(event: MouseEvent) {
        let progress_bar_rect = this.progress_bar.getBoundingClientRect()
        let mouse_x = event.clientX
        let percent = (mouse_x - progress_bar_rect.x) / progress_bar_rect.width * 100
        this.current_beat_index = Math.round(percent * this.beat_length / 100)
        this.onLoop()
    }
}

main()
async function main() {
    let { path, theme } = getURLQuery()
    setTheme(theme)
    
    let music = await GetMusicFromPath(path)
    let music_name = await GetFileNameFromPath(path)

    setTitle(music_name)

    new Controller(music)
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