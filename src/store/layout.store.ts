import { defineStore } from "pinia"
import { appWindow } from '@tauri-apps/api/window'

const useLayoutStore = defineStore("layout", {
    state() {
        return {
            document_title: '',
            is_menu_open: false
        }
    },

    actions: {
        toggleMenu() {
            this.is_menu_open = !this.is_menu_open
        },

        closeMenu() {
            this.is_menu_open = false
        },

        openMenu() {
            this.is_menu_open = true
        },

        async setTitle(title: string) {
            this.document_title = title
            document.title = title
            await appWindow.setTitle(title)
        }
    }
})

export default useLayoutStore