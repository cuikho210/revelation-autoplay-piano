import { register } from '@tauri-apps/api/globalShortcut'

export async function registerShortcut() {
    await register('Ctrl+Alt+M', async () => {
        // PlaySound('C', 4)
    })
}