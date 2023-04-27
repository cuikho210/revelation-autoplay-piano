<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import { useRoute } from "vue-router"
import { ListMusicAndCollection, CreateCollection, GetCollectionBreadcrumb } from '../util/music'
import { ConvertMidiToJsonFromFile } from "../util/converter"
import MusicFileEntry from "../component/piano/MusicFileEntry.vue"
import PrimaryInput from "../component/input/PrimaryInput.vue"
import IconOnlyButton from "../component/button/IconOnlyButton.vue"
import PrimaryButton from "../component/button/PrimaryButton.vue"
import PrimaryDialog from "../component/layout/PrimaryDialog.vue"
import type { FileEntry } from "@tauri-apps/api/fs"

let route = useRoute()
let is_loaded = ref(false)
let list_music = ref<FileEntry[]>([])
let list_collection = ref<FileEntry[]>([])
let collection_breadcrumb = ref<FileEntry[]>([])
let search_string = ref("")
let current_path: string | undefined

updateCurrentPath()
loadCollection()

watch(route, () => {
    updateCurrentPath()
    loadCollection()
}, { immediate: true })

function updateCurrentPath() {
    if (route.query.path && typeof route.query.path == "string") {
        current_path = route.query.path
    } else {
        current_path = undefined
    }
}

async function loadCollection(path?: string) {
    if (path) current_path = path
    
    let result = await ListMusicAndCollection(current_path)
    list_collection.value = result.collections
    list_music.value = result.musics
    
    collection_breadcrumb.value = await GetCollectionBreadcrumb(current_path)
    console.log(collection_breadcrumb.value)
    is_loaded.value = true
    search_string.value = ""
}

async function importFromMIDI() {
    await ConvertMidiToJsonFromFile(current_path)
    await loadCollection()
}

let createCollection = reactive({
    is_show: false,
    collection_name: "",

    Open() {
        createCollection.is_show = true
    },

    Create() {
        CreateCollection(createCollection.collection_name, current_path)
        loadCollection()
        createCollection.collection_name = ""
        createCollection.is_show = false
    }
})
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
            @click="createCollection.Open"
            title="Create Collection"
        />

        <IconOnlyButton
            icon="audio_file"
            @click="importFromMIDI"
            title="Import MIDI file"
        />
    </div>

    <div class="breadcrumb">
        <div>
            <RouterLink to="/music">Home</RouterLink>
        </div>

        <div v-for="entry in collection_breadcrumb" :key="entry.path">
            / <RouterLink :to="'/music?path=' + entry.path">{{ entry.name }}</RouterLink>
        </div>
    </div>

    <div class="list" v-if="is_loaded">
        <div v-for="collection in list_collection" :key="collection.path">
            <MusicFileEntry
                type="collection"
                :name="collection.name || '_'"
                :path="collection.path"
                @on:remove="loadCollection"
                v-show="collection.name?.toLowerCase().includes(search_string.toLowerCase())"
            />
        </div>
        
        <div v-for="music in list_music" :key="music.path">
            <MusicFileEntry
                type="music"
                :name="music.name || '_'"
                :path="music.path"
                @on:remove="loadCollection"
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
            v-model="createCollection.is_show"
            v-show="createCollection.is_show"
        >
            <PrimaryInput
                icon="tag"
                type="text"
                width="100%"
                placeholder="Collection name"
                v-model="createCollection.collection_name"
            />

            <PrimaryButton
                icon="add"
                @click="createCollection.Create"
            >Create</PrimaryButton>
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

.breadcrumb {
    margin: 1rem auto;

    div {
        display: inline;
    }
}

.list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .4rem;
}
</style>