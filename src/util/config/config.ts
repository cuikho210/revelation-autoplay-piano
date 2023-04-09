import { WebviewWindow } from "@tauri-apps/api/window"

export function CreateBackgroundConfigWindow(): Promise<WebviewWindow> {
    let name = "auto_config_background"

    let webview = new WebviewWindow(name, {
        url: "/pages/config/" + name + ".html",
        title: name,
        transparent: true,
        alwaysOnTop: true,
        decorations: false,
        skipTaskbar: true
    })

    return new Promise((resolve, reject) => {
        webview.once("tauri://created", () => {
            webview.setIgnoreCursorEvents(true)
            webview.maximize()
            webview.setResizable(false)

            resolve(webview)
        })

        webview.once("tauri://error", (e) => {
            reject(e)
        })
    })
}

export function CreateControllerConfigWindow(): Promise<WebviewWindow> {
    let webview = new WebviewWindow("auto_config_controller", {
        url: "/pages/config/auto_config_controller.html",
        title: "Bảng Điều Khiển - Cấu Hình Phím Piano",
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

export async function InitConfigWindow() {
    let background_window = await CreateBackgroundConfigWindow()
    let controller_window = await CreateControllerConfigWindow()

    controller_window.onCloseRequested(async () => {
        await background_window.close()
    })
}