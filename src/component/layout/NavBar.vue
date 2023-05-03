<script setup lang="ts">
import { reactive } from 'vue'
import { appWindow } from '@tauri-apps/api/window'
import { exit } from "@tauri-apps/api/process"
import { useRouter } from "vue-router"
import useLayoutStore from "../../store/layout.store"
import locale from "../../util/locale"
import PrimaryDialog from './PrimaryDialog.vue'

let route = useRouter()
let layoutStore = useLayoutStore()
let locale_list = locale.getLocaleList()

const changeLocale = reactive({
    is_show: false,

    Show() {
        changeLocale.is_show = true
    },

    Hide() {
        changeLocale.is_show = false
    },

    Change(locale: Locale.Locale) {
        if (locale.is_current_locale) return
        layoutStore.setLocale(locale.key)
        changeLocale.Hide()
    }
})

</script>

<template>
    <Transition name="fade-in-fast">
        <PrimaryDialog
            title="Select Language"
            v-model="changeLocale.is_show"
            v-show="changeLocale.is_show"
        >
            <div class="locale">
                <button
                    v-for="locale in locale_list"
                    :key="locale.key"
                    @click="changeLocale.Change(locale)"
                    :class="{
                        btn: true,
                        active: locale.is_current_locale
                    }"
                >
                    {{ locale.name }}
                </button>
            </div>
        </PrimaryDialog>
    </Transition>

    <section class="navbar" data-tauri-drag-region>
        <div data-tauri-drag-region class="left">
            <span @click="layoutStore.toggleMenu()" class="btn btn-open-menu material-icons-round" title="Open Menu">menu</span>
            <span @click="route.back()" class="btn btn-back material-icons-round" title="Back">arrow_back_ios_new</span>
            <span class="title">{{ layoutStore.document_title }}</span>
        </div>

        <div class="right">
            <span @click="layoutStore.toggleTheme()" class="btn material-icons-round" title="Toggle Theme">
                {{ layoutStore.theme_mode == "light" ? "light_mode" : "dark_mode" }}
            </span>
            
            <span @click="changeLocale.Show()" class="btn material-icons-round" title="Language">translate</span>
            <span @click="appWindow.minimize()" class="btn btn-minimize material-icons-round" title="Minimize">remove</span>
            <span @click="exit()" class="btn btn-close material-icons-round" title="Close">close</span>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.navbar {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(var(--color-bg-primary--rgb), 0.8);
    backdrop-filter: blur(7px);
    border-bottom: 1px solid rgba(var(--color-text-primary--rgb), 0.05);
    display: flex;
    justify-content: space-between;
    transition: background-color $transition-time, border-bottom $transition-time;
    user-select: none;
    z-index: 20;

    .btn {
        cursor: pointer;
        padding: .4rem .7rem;
        color: $color-primary-1;
        transition: background-color $transition-time ease-out;

        &:hover {
            background-color: rgba(var(--color-text-primary--rgb), 0.05);
        }
    }

    .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .title {
            pointer-events: none;
        }
    }

    .right {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;

        .btn {
            transition: 
                color $transition-time--short ease-out,
                background-color $transition-time--short ease-out;
        }

        .btn-close {
            color: rgb(214, 0, 0);

            &:hover {
                color: #fff;
                background-color: #ff746a;
            }
        }
    }
}

.locale {
    .btn {
        cursor: pointer;
        display: block;
        border: none;
        outline: none;
        width: 100%;
        padding: .7rem;
        margin: 4px;
        font-family: $font-family-primary;
        background-color: var(--color-bg-primary);
        color: var(--color-text-primary);
        border-radius: 4px;
        transition: background-color $transition-time ease-out;

        &:not(.active):hover {
            background-color: rgba($color-primary-1, 0.07);
        }
    }

    .active {
        cursor: default;
        background-color: rgba($color-primary-2, 0.4);
    }
}

@media screen and (max-width: $breakpoint-mobile) {
    .btn-open-menu {
        display: inline-block;
    }

    .btn-back {
        display: none;
    }
}

@media screen and (min-width: calc($breakpoint-mobile + 1px)) {
    .btn-open-menu {
        display: none;
    }

    .btn-back {
        display: inline-block;
    }
}
</style>