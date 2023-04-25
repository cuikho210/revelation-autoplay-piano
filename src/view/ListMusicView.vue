<script setup lang="ts">
import { ref } from "vue"
import { ListMusic } from '../util/piano'
import { ConvertMidiToJsonFromFile } from "../util/converter"
import MusicFile from "../component/piano/MusicFile.vue"
import PrimaryButton from "../component/button/PrimaryButton.vue"
import PrimaryInput from "../component/input/PrimaryInput.vue"
import type { FileEntry } from "@tauri-apps/api/fs"

let is_loaded = ref(false)
let list_music = ref<FileEntry[]>([])
let search_string = ref("")

loadData()

async function loadData() {
    list_music.value = await ListMusic()
    is_loaded.value = true
    search_string.value = ""
}

async function importFromMIDI() {
    await ConvertMidiToJsonFromFile()
    await loadData()
}
</script>

<template>
<section class="container-md">
    <div class="navbar">
        <PrimaryInput
            class="search"
            type="search"
            icon="search"
            v-model="search_string"
            placeholder="Search..."
        />

        <PrimaryButton
            icon="file_open"
            @click="importFromMIDI"
        >Import from MIDI</PrimaryButton>
    </div>

    <div class="list" v-if="is_loaded">
        <div class="music" v-for="(music, index) in list_music" :key="index">
            <MusicFile
                :name="music.name || '_'"
                :path="music.path"
                @on:remove_file="loadData"
                v-show="music.name?.toLowerCase().includes(search_string.toLowerCase())"
            />
        </div>
    </div>
    <p v-else>
        Loading...
    </p>
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