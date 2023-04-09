import { WebviewWindow } from "@tauri-apps/api/window"

export function CreateBackgroundMusicWindow(): Promise<WebviewWindow> {
    let webview = new WebviewWindow("play_music_background", {
        url: "/play_music/play_music_background.html",
        title: "play_music_background",
        transparent: true,
        alwaysOnTop: true,
        decorations: false,
        skipTaskbar: true,
        fullscreen: true,
        resizable: false
    })

    return new Promise((resolve, reject) => {
        webview.once("tauri://created", () => {
            webview.setIgnoreCursorEvents(true)
            resolve(webview)
        })

        webview.once("tauri://error", (e) => {
            reject(e)
        })
    })
}

export function CreateControllerMusicWindow(): Promise<WebviewWindow> {
    let webview = new WebviewWindow("auto_config_controller", {
        url: "/play_music/play_music_controller.html",
        title: "Tự Động Chơi Nhạc",
        alwaysOnTop: true,
        resizable: false,
        width: 360,
        height: 360
    })

    return new Promise((resolve, reject) => {
        webview.once("tauri://created", () => {
            resolve(webview)
        })

        webview.once("tauri://error", (e) => {
            reject(e)
        })
    })
}

export async function InitMusicWindow() {
    let background_window = await CreateBackgroundMusicWindow()
    // let controller_window = await CreateControllerMusicWindow()

    // controller_window.onCloseRequested(async () => {
    //     await background_window.close()
    // })
}