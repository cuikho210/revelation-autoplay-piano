<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { confirm } from "@tauri-apps/api/dialog"
import { removeFile, removeDir } from "@tauri-apps/api/fs"
import { invoke } from "@tauri-apps/api"
import { CreateMusicControlWindow } from "../../util/piano"
import { GetPianoConfig } from "../../util/config_piano_key"
import PrimaryDialog from "../layout/PrimaryDialog.vue"
import PrimaryButton from "../button/PrimaryButton.vue"
import PrimaryInput from "../input/PrimaryInput.vue"

const prop = defineProps<{
    type: "collection" | "music"
    name: string
    path: string
}>()

const emit = defineEmits(["on:remove", "on:rename"])

const router = useRouter()
const music_el = ref<HTMLDivElement>()
const background = ref<HTMLDivElement>()
const context_menu = ref<HTMLDivElement>()

onMounted(() => {
    if (!music_el.value || !background.value || !context_menu.value) return

    background.value.addEventListener("click", closeContextMenu)
    background.value.addEventListener("contextmenu", closeContextMenu)
    music_el.value.addEventListener("contextmenu", openContextMenu)
})

function closeContextMenu(event?: MouseEvent) {
    if (event) event.preventDefault()
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

function open() {
    if (prop.type === "music") openPlayer()
    else openCollection()
}

function openCollection() {
    router.push("/music?path=" + prop.path)
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
        if (prop.type == "collection") await removeDir(prop.path, { recursive: true })
        else await removeFile(prop.path)

        emit("on:remove")
    }
}

let rename = reactive({
    is_show: false,
    new_name: prop.name,

    Open() {
        closeContextMenu()
        rename.is_show = true
    },

    async Rename() {
        let new_name = rename.new_name
        if (prop.type == "music") new_name += ".json"

        await invoke("rename", {
            path: prop.path,
            newName: new_name
        })

        emit("on:rename")
        // rename.is_show = false
        // rename.new_name = prop.name
    }
})

</script>

<template>
<div>
    <div
        ref="music_el"
        @click="open"
        :class="{
            'entry': true,
            'music': type == 'music'
        }"
    >
        <span class="material-icons-round">{{ type == "music" ? "piano" : "folder" }}</span>
        <span class="text">{{ name }}</span>
    </div>

    <div ref="background" class="background"></div>
    <div ref="context_menu" class="context-menu">
        <div class="btn" @click="open">Open</div>
        <div class="btn" @click="openEditor" v-if="type === 'music'">Edit</div>
        <div class="btn" @click="rename.Open">Rename</div>
        <div class="btn" @click="openRemovePopup">Remove</div>
    </div>

    <Transition name="fade-in-fast">
        <PrimaryDialog
            title="Đổi Tên"
            v-model="rename.is_show"
            v-show="rename.is_show"
        >
            <PrimaryInput
                icon="tag"
                type="text"
                width="100%"
                placeholder="Tên mới"
                v-model="rename.new_name"
            />

            <PrimaryButton
                icon="drive_file_rename_outline"
                @click="rename.Rename"
            >Đổi Tên</PrimaryButton>
        </PrimaryDialog>
    </Transition>
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.entry {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: .5rem;
    cursor: pointer;
    border-radius: 4px;
    outline: 1px solid rgba(var(--color-text-primary--rgb), 0);
    background-color: rgba($color-primary-1, 0.77);
    color: var(--color-text-primary);
    transition:
        color $transition-time--short ease-out,
        background-color $transition-time--short ease-out,
        outline $transition-time--short ease-out;

    .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:hover {
        outline: 1px solid rgba(var(--color-text-primary--rgb), 0.4);
    }

    .material-icons-round {
        margin-right: .4rem;
        color: rgba(var(--color-text-primary--rgb), 0.7);
        transition: color $transition-time;
    }
}

.music {
    background-color: rgba($color-primary-1, 0.1);
    color: var(--color-text-primary);

    &:hover {
        background-color: rgba($color-primary-2, 0.2);
    }

    .material-icons-round {
        color: $color-primary-1;
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
    box-shadow: 4px 4px 1rem rgba(0, 0, 0, 0.04);
    background-color: var(--color-bg-primary);
    visibility: hidden;
    opacity: 0;
    transition:
        visibility $transition-time ease-out,
        opacity $transition-time ease-out,
        background-color $transition-time ease-out;

    .btn {
        padding: .4rem .7rem;
        cursor: pointer;
        transition: background-color $transition-time--short ease-out;

        &:hover {
            background-color: rgba($color-primary-1, 0.4);
        }
    }
}
</style>