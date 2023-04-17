<script setup lang="ts">
import { ref, onMounted } from "vue"
import MusicNote from "./MusicNote.vue"

interface Beat {
    [key: string]: boolean
}

const prop = defineProps<{
    piano: Piano.Note[]
    modelValue?: Music.Beat
    is_playing?: boolean
    index: number
}>()

const emit = defineEmits(["update:modelValue", "update:selectCurrentPlaying"])
let music_beat: Beat = {}
let beat_el = ref<HTMLDivElement>()

onMounted(() => {
    if (beat_el.value) {
        beat_el.value.addEventListener("contextmenu", event => {
            event.preventDefault()
            emit("update:selectCurrentPlaying", prop.index)
        })
    }
})

loadData()
function loadData() {
    if (!prop.modelValue) return

    prop.modelValue.forEach(note => {
        music_beat[note] = true
    })
}

function updateBeat(note: string, is_active: boolean) {
    music_beat[note] = is_active

    let beat: Music.Beat = []
    
    for (let note in music_beat) {
        if (music_beat[note]) beat.push(note)
    }

    emit("update:modelValue", beat)
}

</script>

<template>
<div ref="beat_el" :class="{ 'is-playing': is_playing }">
    <div v-for="(note, index) of piano" :key="index">
        <MusicNote
            :is_active="music_beat[note.key + note.octa]"
            :note="note.key + note.octa"
            @update:active="updateBeat"
        />
    </div>
</div>
</template>

<style scoped lang="scss">
div {
    display: flex;
    flex-direction: column-reverse;
}

.is-playing {
    opacity: 0.2;
}
</style>