import { defineStore } from "pinia"
import { appWindow } from '@tauri-apps/api/window'
import locale from "../util/locale"

const useLayoutStore = defineStore("layout", {
    state() {
        return {
            document_key: '',
            document_title: '',
            is_menu_open: false,
            theme_mode: <"light" | "dark">("light"),
            locale: locale.getCurrentLocale()
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

        async setTitle(title_key?: string) {
            if (!title_key) title_key = this.document_key
            else this.document_key = title_key
            
            const title = this.locale.message[title_key as keyof Locale.Message] || ""

            this.document_title = title
            document.title = title
            await appWindow.setTitle(title)
        },

        setTheme() {
            document.documentElement.setAttribute("data-theme", this.theme_mode)
            localStorage.setItem("theme_mode", this.theme_mode)
        },

        setThemeToDefault() {
            let default_theme = localStorage.getItem("theme_mode")

            if (default_theme == "light" || default_theme == "dark") {
                this.theme_mode = default_theme
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.theme_mode == "dark"
            }

            this.setTheme()
        },

        setThemeToDark() {
            this.theme_mode = "dark"
            this.setTheme()
        },

        setThemeToLight() {
            this.theme_mode = "light"
            this.setTheme()
        },

        toggleTheme() {
            if (this.theme_mode == "dark") this.theme_mode = "light"
            else this.theme_mode = "dark"

            this.setTheme()
        },

        setLocale(key: string) {
            if (locale.setLocale(key)) {
                this.locale = locale.getCurrentLocale()
                this.setTitle()
            }
        }
    }
})

export default useLayoutStore