<script setup lang="ts">
import { ref } from "vue"
import { ListMusic } from '../util/piano'
import MusicFile from "../component/piano/MusicFile.vue"
import type { FileEntry } from "@tauri-apps/api/fs"

let is_loaded = ref(false)
let list_music = ref<FileEntry[]>([])

loadData()

async function loadData() {
    list_music.value = await ListMusic()
    is_loaded.value = true
}
</script>

<template>
<section class="container-md">
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

.list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: .4rem;
}
</style>