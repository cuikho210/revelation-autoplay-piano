import { WebviewWindow } from "@tauri-apps/api/window"
import type { PhysicalSize, PhysicalPosition } from "@tauri-apps/api/window"
import { SavePiano } from "../piano"
import { GenerateAbsolutePianoKeys } from "../config_piano_key"
import "../../asset/scss/page/auto_config_controller.scss"

document.addEventListener("contextmenu", event => {
    event.preventDefault()
})

main()

async function main() {
    const bg_window = WebviewWindow.getByLabel("auto_config_background")
    if (!bg_window) throw new Error("Cannot get window by label 'auto_config_background'")

    const bg_window_size = await bg_window.innerSize()
    const bg_window_position = await bg_window.innerPosition()

    listenEvents(bg_window_size, bg_window_position)
}

function listenEvents(window_size: PhysicalSize, window_position: PhysicalPosition) {
    let savePiano = () => {
        let piano = GenerateAbsolutePianoKeys(window_size, window_position)
        console.log(window_size, window_position)
        SavePiano(piano)
    }

    listen("btn_decre_x_1", window_position, "x", -1, savePiano)
    listen("btn_incre_x_1", window_position, "x", 1, savePiano)
    listen("btn_decre_x_10", window_position, "x", -10, savePiano)
    listen("btn_incre_x_10", window_position, "x", 10, savePiano)

    listen("btn_decre_y_1", window_position, "y", -1, savePiano)
    listen("btn_incre_y_1", window_position, "y", 1, savePiano)
    listen("btn_decre_y_10", window_position, "y", -10, savePiano)
    listen("btn_incre_y_10", window_position, "y", 10, savePiano)

    listen("btn_decre_width_1", window_size, "width", -1, savePiano)
    listen("btn_incre_width_1", window_size, "width", 1, savePiano)
    listen("btn_decre_width_10", window_size, "width", -10, savePiano)
    listen("btn_incre_width_10", window_size, "width", 10, savePiano)

    listen("btn_decre_height_1", window_size, "height", -1, savePiano)
    listen("btn_incre_height_1", window_size, "height", 1, savePiano)
    listen("btn_decre_height_10", window_size, "height", -10, savePiano)
    listen("btn_incre_height_10", window_size, "height", 10, savePiano)
}

function listen(id: string, object: any, key: string, increment: number, callback: () => void) {
    let button = document.getElementById(id)
    if (!button) throw new Error("Element " + id + " is null")

    button.onclick = () => {
        object[key] += increment
        callback()
    }
}