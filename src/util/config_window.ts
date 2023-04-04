import { WebviewWindow } from "@tauri-apps/api/window"

export function createConfigWindow() {
    const configWindow = new WebviewWindow("config_window", {
        url: "/config",
        transparent: true,
        alwaysOnTop: true,
        fullscreen: true,
        resizable: false
    })

    configWindow.once('tauri://created', () => {
        
    })

    configWindow.once('tauri://error', (err) => {
        console.log(err)
    })
}