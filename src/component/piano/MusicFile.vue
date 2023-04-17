<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { confirm } from "@tauri-apps/api/dialog"
import { removeFile } from "@tauri-apps/api/fs"
import { CreateMusicControlWindow } from "../../util/piano"
import { GetPianoConfig } from "../../util/config_piano_key"

const prop = defineProps<{
    name: string
    path: string
}>()

const emit = defineEmits(["on:remove_file"])

const router = useRouter()
const music_el = ref<HTMLDivElement>()
const background = ref<HTMLDivElement>()
const context_menu = ref<HTMLDivElement>()

onMounted(() => {
    if (!music_el.value || !background.value || !context_menu.value) return

    background.value.addEventListener("click", closeContextMenu)
    music_el.value.addEventListener("contextmenu", openContextMenu)
})

function closeContextMenu() {
    if (!background.value || !context_menu.value) return

    background.value.style.visibility = "hidden"
    context_menu.value.style.visibility = "hidden"
    context_menu.value.style.opacity = "0"
}

function openContextMenu(event: MouseEvent) {
    event.preventDefault()
    if (!background.value || !context_menu.value) return

    let top = event.clientY
    let left = event.clientX
    let rect = context_menu.value.getBoundingClientRect()

    if (top + rect.height > window.innerHeight) top -= rect.height
    if (left + rect.width > window.innerWidth) left -= rect.width

    context_menu.value.style.top = top + "px"
    context_menu.value.style.left = left + "px"

    background.value.style.visibility = "initial"
    context_menu.value.style.visibility = "initial"
    context_menu.value.style.opacity = "1"
}

async function openPlayer() {
    try {
        await GetPianoConfig()
        await CreateMusicControlWindow(prop.path)
    }
    catch (e) {
        alert("Chưa có cấu hình phím")
    }

    closeContextMenu()
}

function openEditor() {
    router.push("/add-music?path=" + prop.path)
}

async function openRemovePopup() {
    closeContextMenu()

    let is_confirm = await confirm("Bạn có chắc muốn xóa tệp này không?")

    if (is_confirm) {
        await removeFile(prop.path)
        emit("on:remove_file")
    }
}

</script>

<template>
<div>
    <div ref="music_el" class="music" @click="openPlayer">
        {{ name }}
    </div>

    <div ref="background" class="background"></div>
    <div ref="context_menu" class="context-menu">
        <div class="btn" @click="openPlayer">Open</div>
        <div class="btn" @click="openEditor">Edit</div>
        <div class="btn" @click="openRemovePopup">Remove</div>
    </div>
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.music {
    background-color: rgba($color-primary-1, 0.1);
    color: var(--color-text-primary);
    padding: .7rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: color $transition-time, background-color $transition-time;

    &:hover {
        background-color: rgba($color-primary-2, 0.2);
    }
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
}

.context-menu {
    position: fixed;
    border: 1px solid rgba(var(--color-text-primary--rgb), 0.02);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 4px 4px 1rem rgba(var(--color-text-primary--rgb), 0.04);
    background-color: var(--color-bg-primary);
    visibility: hidden;
    opacity: 0;
    transition:
        visibility $transition-time,
        opacity $transition-time,
        background-color $transition-time;

    .btn {
        padding: .4rem .7rem;
        cursor: pointer;
        transition: background-color $transition-time--short;

        &:hover {
            background-color: rgba($color-primary-1, 0.4);
        }
    }
}
</style>