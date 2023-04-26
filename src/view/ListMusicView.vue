<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { ListMusicAndCollection } from '../util/piano'
import { ConvertMidiToJsonFromFile } from "../util/converter"
import MusicFileEntry from "../component/piano/MusicFileEntry.vue"
import PrimaryInput from "../component/input/PrimaryInput.vue"
import IconOnlyButton from "../component/button/IconOnlyButton.vue"
import PrimaryDialog from "../component/layout/PrimaryDialog.vue"
import type { FileEntry } from "@tauri-apps/api/fs"
import type { LocationQuery } from "vue-router"

let route = useRoute()
let is_loaded = ref(false)
let is_open_create_collection_dialog = ref(false)
let list_music = ref<FileEntry[]>([])
let list_collection = ref<FileEntry[]>([])
let search_string = ref("")
let current_path: string | undefined

updateCurrentPath()
loadCollection()

watch(route, () => {
    updateCurrentPath()
    loadCollection()
}, { immediate: true })

function updateCurrentPath(query?: LocationQuery) {
    if (!query) query = route.query

    if (query.path && typeof query.path == "string") {
        current_path = query.path
    } else {
        current_path = undefined
    }
}

async function loadCollection(path?: string) {
    if (path) current_path = path
    
    let result = await ListMusicAndCollection(current_path)
    list_collection.value = result.collections
    list_music.value = result.musics

    is_loaded.value = true
    search_string.value = ""
}

async function importFromMIDI() {
    await ConvertMidiToJsonFromFile()
    await loadCollection()
}
</script>

<template>
<section class="container-md" :key="route.fullPath">
    <div class="navbar">
        <PrimaryInput
            class="search"
            type="search"
            icon="search"
            v-model="search_string"
            placeholder="Search..."
        />

        <IconOnlyButton
            icon="create_new_folder"
            @click="importFromMIDI"
            title="Create Collection"
        />

        <IconOnlyButton
            icon="audio_file"
            @click="importFromMIDI"
            title="Import MIDI file"
        />
    </div>

    <div class="list" v-if="is_loaded">
        <div v-for="collection in list_collection" :key="collection.path">
            <MusicFileEntry
                type="collection"
                :name="collection.name || '_'"
                :path="collection.path"
                @on:remove_file="loadCollection"
                v-show="collection.name?.toLowerCase().includes(search_string.toLowerCase())"
            />
        </div>
        
        <div v-for="music in list_music" :key="music.path">
            <MusicFileEntry
                type="music"
                :name="music.name || '_'"
                :path="music.path"
                @on:remove_file="loadCollection"
                v-show="music.name?.toLowerCase().includes(search_string.toLowerCase())"
            />
        </div>
    </div>
    <p v-else>
        Loading...
    </p>

    <Transition name="fade-in-fast">
        <PrimaryDialog
            title="Create Collection"
            v-model="is_open_create_collection_dialog"
            v-show="is_open_create_collection_dialog"
        >
            <PrimaryInput
                icon="tag"
                type="text"
                width="100%"
                placeholder="Collection name"
            />
        </PrimaryDialog>
    </Transition>
</section>
</template>

<style scoped lang="scss">
@import "../asset/scss/container.scss";

.navbar {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;

    .search {
        width: 100%;
        margin-right: 7px;
    }
}

.list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .4rem;
}
</style>