<script setup lang="ts">
import { ref } from "vue"
import { ListMusic } from '../util/piano'
import { ConvertMidiToJsonFromFile } from "../util/converter"
import MusicFile from "../component/piano/MusicFile.vue"
import PrimaryButton from "../component/button/PrimaryButton.vue"
import type { FileEntry } from "@tauri-apps/api/fs"

let is_loaded = ref(false)
let list_music = ref<FileEntry[]>([])

loadData()

async function loadData() {
    list_music.value = await ListMusic()
    is_loaded.value = true
}

async function importFromMIDI() {
    await ConvertMidiToJsonFromFile()
    await loadData()
}
</script>

<template>
<section class="container-md">
    <div class="navbar">
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
}

.list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .4rem;
}
</style>