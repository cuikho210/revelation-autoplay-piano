import { register } from '@tauri-apps/api/globalShortcut'
import { emit } from "@tauri-apps/api/event"

export async function registerShortcut() {
    await register('Alt+Ctrl+Space', async () => {
        await emit("toggle_play")
    })
}