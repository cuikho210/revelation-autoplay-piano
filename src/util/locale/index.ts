import en_US from "./en_US"
import vi_VN from "./vi_VN"

const locales: {[key: string]: Locale.Locale} = {
    en_US, vi_VN
}

class Locale {
    default_locale = locales.en_US
    current_locale = this.default_locale

    constructor() {
        this.loadLocaleSetting()
    }

    getDefaultLocale() {
        return this.default_locale
    }

    getCurrentLocale() {
        return this.current_locale
    }

    getLocaleList() {
        return locales
    }

    loadLocaleSetting(): boolean {
        let locale_key = localStorage.getItem("locale")
        this.current_locale.is_current_locale = true

        if (!locale_key) {
            console.error("Locale is not stored")
            return false
        } else {
            if (!locales[locale_key]) {
                console.error("Locale %s is undefined", locale_key)
                return false
            } else {
                this.current_locale.is_current_locale = false
                this.current_locale = locales[locale_key]
                this.current_locale.is_current_locale = true

                return true
            }
        }
    }

    setLocaleSetting(key: string) {
        localStorage.setItem("locale", key)
    }

    setLocale(key: string): boolean {
        if (!locales[key]) {
            return false
        } else {
            this.current_locale.is_current_locale = false
            this.current_locale = locales[key]
            this.current_locale.is_current_locale = true

            this.setLocaleSetting(key)
            
            return true
        }
    }
}

export default new Locale()