import { WebviewWindow } from "@tauri-apps/api/window"

export function InitConfigWindow(name: "auto_config" | "manual_config"): WebviewWindow {
    const webview = new WebviewWindow(name, {
        url: "/config/" + name + ".html"
    })

    webview.once("tauri://created", () => {

    })

    webview.once("tauri://error", (e) => {
        console.error(e)
    })

    return webview
}