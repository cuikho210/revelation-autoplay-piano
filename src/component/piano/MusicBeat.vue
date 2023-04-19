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
        <MusicNote
        v-for="(note, i) of piano" :key="i"
            :is_active="music_beat[note.key + note.octa]"
            :note="note.key + note.octa"
            :class="{
                'note': true,
                'note-4': index % 4 == 0,
                'note-16': index % 16 == 0
            }"
            @update:active="updateBeat"
        />
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

div {
    display: flex;
    flex-direction: column-reverse;

    .note-4 {
        border-left: 1px solid rgba(var(--color-text-primary--rgb), 0.07);
    }

    .note-16 {
        border-left: 1px solid rgba(var(--color-text-primary--rgb), 0.17);
    }
}

.is-playing {
    opacity: 0.4;

    .note {
        border-left: 1px solid $color-primary-1;
        border-right: 1px solid $color-primary-1;
    }
}
</style>