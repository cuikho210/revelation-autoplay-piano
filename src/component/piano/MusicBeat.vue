<script setup lang="ts">
import MusicNote from "./MusicNote.vue"

const prop = defineProps<{
    piano: Piano.Note[]
    modelValue?: Music.Beat
    is_playing?: boolean
}>()

const emit = defineEmits(["update:modelValue"])

let music_beat: any = {}

function updateBeat(note: string, is_active: boolean) {
    music_beat[note] = is_active

    let beat: Music.Beat = []
    
    for (let key in music_beat) {
        if (music_beat[key]) beat.push(key)
    }

    emit("update:modelValue", beat)
}

</script>

<template>
<div :class="{ 'is-playing': is_playing }">
    <div v-for="(note, index) of piano" :key="index">
        <MusicNote :note="note.key + note.octa" @update:active="updateBeat" />
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