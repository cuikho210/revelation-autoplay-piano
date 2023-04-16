<script setup lang="ts">
import { reactive } from "vue"
import { GeneratePiano, PlaySound } from "../../util/piano"
import PianoKey from './PianoKey.vue'
import MusicBeat from "./MusicBeat.vue"
import PrimaryInput from "../input/PrimaryInput.vue"
import PrimaryButton from "../button/PrimaryButton.vue"

let piano = GeneratePiano(1, 7)
let music_name = "Music " + new Date().toDateString()

let music = reactive<Music.Music>({
    tempo: 120,
    data: []
})

function addBeat(length: number) {
    for (let i = 0; i < length; i ++) {
        music.data.push([])
    }
}

function playMusic(beat_index: number) {
    if (beat_index >= music.data.length) return

    music.data[beat_index].forEach(note => {
        PlaySound(note)
    })

    setTimeout(() => playMusic(++beat_index), 60000 / music.tempo)
}

function saveMusic() {

}

addBeat(32)

</script>

<template>
<section class="container">
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
            width="140px"
            v-model="music.tempo"
        />

        <PrimaryButton class="btn" icon="add" @click="addBeat(8)">Add 8 beat</PrimaryButton>
        <PrimaryButton class="btn" icon="play_arrow" @click="playMusic(0)">Play</PrimaryButton>
        <PrimaryButton class="btn" icon="save">Save</PrimaryButton>
    </div>

    <div class="piano-roll">
        <div class="piano">
            <div v-for="(note, index) of piano" :key="index">
                <PianoKey :note="note" />
            </div>
        </div>

        <div class="roll">
            <div v-for="(_, index) in music.data" :key="index">
                <MusicBeat :piano="piano" v-model="music.data[index]" />
            </div>
        </div>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.container {
    position: relative;
}

.navbar {
    position: sticky;
    top: 41px;
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

    .roll {
        overflow: scroll;
        display: flex;
    }
}
</style>