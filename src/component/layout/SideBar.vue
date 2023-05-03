<script setup lang="ts">
import { ref, onMounted } from "vue"
import { getVersion } from "@tauri-apps/api/app"
import useLayoutStore from "../../store/layout.store"
import SidebarButton from "../button/SidebarButton.vue"

let layoutStore = useLayoutStore()
let message = () => layoutStore.locale.message
let app_version = ref("")

onMounted(async () => {
    app_version.value = await getVersion()
})

</script>

<template>
<section>
    <div
        @click="layoutStore.closeMenu()"
        :class="{
            bg: true,
            is_bg_close: !layoutStore.is_menu_open
        }"
    ></div>

    <div :class="{
        main: true,
        is_close: !layoutStore.is_menu_open
    }">
        <header data-tauri-drag-region>
            <div>
                <img class="icon" src="/icon-128x128.png" alt="icon">
                <h3>Revelation Autoplay Piano</h3>
                <p>Version {{ app_version }}</p>
                <p>Made by <a target="_blank" href="https://github.com/cuikho210">cuikho210</a></p>
                <small>Mã nguồn mở tại <a target="_blank" href="https://github.com/cuikho210/revelation-autoplay-piano">@cuikho210/revelation-autoplay-piano</a></small>
            </div>
        </header>

        <main>
            <div>
                <SidebarButton icon="home" href="/">{{ message().sidebar_button_home }}</SidebarButton>
                <SidebarButton icon="piano" href="/add-music">{{ message().sidebar_button_add_music }}</SidebarButton>
                <SidebarButton icon="piano" href="/music">{{ message().sidebar_button_list_music }}</SidebarButton>
                <SidebarButton icon="settings" href="/setting">{{ message().sidebar_button_setting }}</SidebarButton>
            </div>
        </main>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(var(--color-text-primary--rgb), 0.05);
    backdrop-filter: blur(4px);
    z-index: 30;
    transition: visibility $transition-time ease-out, opacity $transition-time ease-out;
}

.is_bg_close {
    visibility: hidden;
    opacity: 0;
}

.main {
    position: fixed;
    top: 0;
    left: 0;
    width: $sidebar-width;
    max-width: 90%;
    height: 100%;
    background-color: var(--color-bg-primary);
    border-right: 1px solid rgba(var(--color-text-primary--rgb), 0.05);
    user-select: none;
    z-index: 31;
    transition:
        visibility $transition-time ease-out,
        opacity $transition-time ease-out,
        left $transition-time ease-out,
        background-color $transition-time,
        border-right $transition-time;

    header {
        div {
            pointer-events: none;
            text-align: center;
            padding: .25rem;
            padding-bottom: 1rem;

            .icon {
                border-radius: 50%;
                width: 64px;
            }

            a {
                pointer-events: initial;
            }

            h3 {
                color: $color-primary-1;
                margin-bottom: .25rem;
            }

            p {
                color: rgba(var(--color-text-primary--rgb), 0.7);
                transition: color $transition-time;
            }

            small {
                color: rgba(var(--color-text-primary--rgb), 0.4);
                transition: color $transition-time;
            }
        }
    }
}

.is_close {
    left: -$sidebar-width;
    visibility: hidden;
    opacity: 0;
}

@media screen and (min-width: calc($breakpoint-mobile + 1px)) {
    .bg {
        display: none;
    }

    .is_close {
        left: 0;
        opacity: 1;
        visibility: visible;
    }
}
</style>