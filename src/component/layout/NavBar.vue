<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { useRouter } from "vue-router"
import useLayoutStore from "../../store/layout.store"

let route = useRouter()
let layoutStore = useLayoutStore()

</script>

<template>
<section data-tauri-drag-region>
    <div data-tauri-drag-region class="left">
        <span @click="layoutStore.toggleMenu()" class="btn btn-open-menu material-icons-round" title="Open Menu">menu</span>
        <span @click="route.back()" class="btn btn-back material-icons-round" title="Back">arrow_back_ios_new</span>
        <span class="title">{{ layoutStore.document_title }}</span>
    </div>

    <div class="right">
        <span @click="layoutStore.toggleTheme()" class="btn material-icons-round" title="Toggle Theme">
            {{ layoutStore.theme_mode == "light" ? "light_mode" : "dark_mode" }}
        </span>

        <span @click="appWindow.minimize()" class="btn btn-minimize material-icons-round" title="Minimize">remove</span>
        <span @click="appWindow.close()" class="btn btn-close material-icons-round" title="Close">close</span>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

section {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(var(--color-bg-primary--rgb), 0.8);
    backdrop-filter: blur(7px);
    border-bottom: 1px solid rgba(var(--color-text-primary--rgb), 0.05);
    display: flex;
    justify-content: space-between;
    transition: background-color $transition-time;
    user-select: none;
    z-index: 20;

    .btn {
        cursor: pointer;
        padding: .25rem;
        margin: .25rem;
        border-radius: 50%;
        color: $color-primary-1;
        transition: background-color $transition-time;

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
        align-items: center;
        justify-content: flex-end;

        .btn {
            margin: 0;
            transition: color $transition-time, background-color $transition-time;
        }

        .btn-minimize {
            color: rgb(25, 226, 25);

            &:hover {
                color: #fff;
                background-color: rgb(151, 255, 151);
            }
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