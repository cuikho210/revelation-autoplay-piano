<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRoute } from "vue-router"
import { GeneratePiano, PlaySound } from "../../util/piano"
import { SaveMusic, GetMusicFromPath } from "../../util/music"
import { GetFileNameFromPath } from "../../util/converter"
import PianoKey from './PianoKey.vue'
import MusicBeat from "./MusicBeat.vue"
import PrimaryInput from "../input/PrimaryInput.vue"
import PrimaryButton from "../button/PrimaryButton.vue"

interface MusicBeat {
    is_playing: boolean
    data: Music.Beat
}

let route = useRoute()
let piano = GeneratePiano(1, 7)
let music_name = "Music " + new Date().toDateString()
let music_data = reactive<MusicBeat[]>([])
let is_playing = ref(false)
let tempo = ref(120)
let is_loaded = ref(false)
let current_playing_beat = 0

if (route.query.path && typeof route.query.path == "string") {
    loadDataFromPath(route.query.path)
} else {
    addBeat(32)
    is_loaded.value = true
}

async function loadDataFromPath(path: string) {
    let music = await GetMusicFromPath(path)

    tempo.value = music.tempo
    music_name = await GetFileNameFromPath(path)

    music.data.forEach(beat => {
        music_data.push({
            is_playing: false,
            data: beat
        })
    })
    is_loaded.value = true
}

function addBeat(length: number) {
    for (let i = 0; i < length; i ++) {
        music_data.push({
            is_playing: false,
            data: []
        })
    }
}

function loopPlayMusic() {
    if (current_playing_beat >= music_data.length || !is_playing.value) {
        is_playing.value = false
        return
    }

    if (music_data[current_playing_beat - 1]) music_data[current_playing_beat - 1].is_playing = false
    music_data[current_playing_beat].is_playing = true

    music_data[current_playing_beat].data.forEach(note => {
        PlaySound(note.name)
    })

    current_playing_beat++
    setTimeout(() => loopPlayMusic(), 7500 / tempo.value)
}

function tooglePlayMusic() {
    if (is_playing.value) {
        is_playing.value = false
    } else {
        is_playing.value = true
        loopPlayMusic()
    }
}

function stopMusic() {
    is_playing.value = false
    setCurrentPlaying(0)
}

function setCurrentPlaying(beat_index: number) {
    if (current_playing_beat > 0) music_data[current_playing_beat - 1].is_playing = false
    if (music_data[current_playing_beat]) music_data[current_playing_beat].is_playing = false

    current_playing_beat = beat_index
    music_data[current_playing_beat].is_playing = true
}

async function saveMusic() {
    let music: Music.Music = {
        tempo: tempo.value,
        data: []
    }

    music_data.forEach(music_beat => {
        music.data.push(music_beat.data)
    })

    await SaveMusic(music_name, music)
    alert("Saved!")
}

</script>

<template>
<section class="container" v-if="is_loaded">
    <div class="navbar">
        <PrimaryInput
            type="text"
            icon="tag"
            placeholder="Name"
            width="100%"
            v-model="music_name"
        />

        <PrimaryInput
            type="number"
            icon="music_note"
            placeholder="Tempo"
            width="170px"
            v-model="tempo"
        />

        <PrimaryButton class="btn" icon="add" @click="addBeat(8)">Add 8 beat</PrimaryButton>
        <PrimaryButton class="btn" icon="stop" @click="stopMusic">Stop</PrimaryButton>
        <PrimaryButton class="btn" :icon="is_playing ? 'pause' : 'play_arrow'" @click="tooglePlayMusic">{{ is_playing ? "Pause" : "Play" }}</PrimaryButton>
        <PrimaryButton class="btn" icon="save" @click="saveMusic">Save</PrimaryButton>
    </div>

    <div class="piano-roll">
        <div class="piano">
            <div v-for="(note, index) of piano" :key="index">
                <PianoKey :note="note" />
            </div>
        </div>

        <div class="roll">
            <div v-for="(_, index) in music_data" :key="index">
                <MusicBeat
                    :piano="piano"
                    :is_playing="music_data[index].is_playing"
                    :index="index"
                    v-model="music_data[index].data"
                    @update:select-current-playing="setCurrentPlaying"
                />
            </div>
        </div>
    </div>
</section>
<p v-else>Loading...</p>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.container {
    position: relative;
}

.navbar {
    position: sticky;
    top: 37.78px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(var(--color-text-primary--rgb), 0.05);
    background-color: rgba(var(--color-bg-primary--rgb), 0.8);
    backdrop-filter: blur(7px);
    z-index: 20;
    transition: background-color $transition-time;

    .btn {
        margin: auto 2px;
    }
}

.piano-roll {
    position: relative;
    display: flex;

    .piano {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
    }

    .roll {
        overflow: scroll;
        display: flex;
    }
}
</style>