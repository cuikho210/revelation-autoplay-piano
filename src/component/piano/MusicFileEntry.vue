<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { confirm } from "@tauri-apps/api/dialog"
import { removeFile, removeDir } from "@tauri-apps/api/fs"
import { invoke } from "@tauri-apps/api"
import useLayoutStore from "../../store/layout.store"
import { CreateMusicControlWindow } from "../../util/piano"
import { GetPianoConfig } from "../../util/config_piano_key"
import PrimaryDialog from "../layout/PrimaryDialog.vue"
import PrimaryButton from "../button/PrimaryButton.vue"
import PrimaryInput from "../input/PrimaryInput.vue"
import ContextMenu from "../layout/ContextMenu.vue"
import ContextMenuItem from "../layout/ContextMenuItem.vue"

const prop = defineProps<{
    type: "collection" | "music"
    name: string
    path: string
}>()

const emit = defineEmits(["on:remove", "on:rename"])

const layoutStore = useLayoutStore()
const message = () => layoutStore.locale.message
const router = useRouter()
const music_el = ref<HTMLDivElement>()
let is_open_context_menu = ref(false)

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

    let is_confirm = await confirm(message().music_delete_file_confirm)

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
    }
})

function closeContextMenu() {
    is_open_context_menu.value = false
}
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

    <ContextMenu
        v-if="music_el"
        :watch_element="music_el"
        v-model="is_open_context_menu"
    >
        <ContextMenuItem icon="launch" @click="open">{{ message().music_context_menu_open }}</ContextMenuItem>
        <hr>
        <ContextMenuItem icon="edit_note" @click="openEditor" v-if="type === 'music'">{{ message().music_context_menu_edit }}</ContextMenuItem>
        <ContextMenuItem icon="drive_file_rename_outline" @click="rename.Open">{{ message().music_context_menu_rename }}</ContextMenuItem>
        <hr>
        <ContextMenuItem icon="delete" @click="openRemovePopup">{{ message().music_context_menu_remove }}</ContextMenuItem>
    </ContextMenu>

    <Transition name="fade-in-fast">
        <PrimaryDialog
            :title="message().music_context_menu_rename"
            v-model="rename.is_show"
            v-show="rename.is_show"
        >
            <PrimaryInput
                icon="tag"
                type="text"
                width="100%"
                :placeholder="message().music_rename_input_placeholder"
                v-model="rename.new_name"
            />

            <PrimaryButton
                icon="drive_file_rename_outline"
                @click="rename.Rename"
            > {{ message().music_context_menu_rename }} </PrimaryButton>
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
</style>