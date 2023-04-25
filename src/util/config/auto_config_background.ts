import { WebviewWindow } from "@tauri-apps/api/window"
import { GenerateAbsolutePianoKeys } from "../config_piano_key"
import { listen } from "@tauri-apps/api/event"
import type { PhysicalSize } from "@tauri-apps/api/window"
import "../../asset/scss/page/auto_config_background.scss"

interface CustomContext extends CanvasRenderingContext2D {
    ClearRect: () => void
}

main()

async function main() {
    const bg_window = WebviewWindow.getByLabel("auto_config_background")
    if (!bg_window) throw new Error("Cannot get window by label 'auto_config_background'")

    const bg_window_size = await bg_window.innerSize()
    const bg_window_position = await bg_window.innerPosition()
    let context = get2DContext(bg_window_size)

    listenEventFromBackend(context)

    let piano = GenerateAbsolutePianoKeys(bg_window_size, bg_window_position)
    drawPiano(context, piano)
}

function listenEventFromBackend(context: CustomContext) {
    listen<string>("piano_draw", event => {
        let piano: Piano.Piano84Key = JSON.parse(event.payload)
        drawPiano(context, piano)
    })
}

function drawPiano(context: CustomContext, piano: Piano.Piano84Key) {
    context.ClearRect()

    piano.forEach(piano_note => {
        drawDot(context, piano_note.position.x, piano_note.position.y)
    })
}

function get2DContext(bg_window_size: PhysicalSize): CustomContext {
    let canvas: HTMLCanvasElement = document.getElementById("main-canvas") as HTMLCanvasElement
    if (!canvas) throw new Error("Canvas is missed")

    canvas.width = bg_window_size.width
    canvas.height = bg_window_size.height

    let context = canvas.getContext("2d")
    if (!context) throw new Error("Cannot get context 2D")

    let custom_context: CustomContext = context as CustomContext

    custom_context.ClearRect = () => {
        custom_context.clearRect(0, 0, canvas.width, canvas.height)
    }

    return custom_context
}

function drawDot(
    context: CanvasRenderingContext2D,
    x: number, y: number,
    radius: number = 7,
    fill_color: string = "#ff907f",
    border_color: string = "#000",
    border_width: number = 3
) {
    context.beginPath()

    context.fillStyle = fill_color
    context.strokeStyle = border_color
    context.lineWidth = border_width

    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()

    context.closePath()
}