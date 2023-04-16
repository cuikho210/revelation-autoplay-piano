<script setup lang="ts">
import { GeneratePiano } from "../../util/piano"
import PianoKey from './PianoKey.vue'

const prop = defineProps<{
    octaves_start?: number
    octaves_length?: number
}>()

let octaves_start = prop.octaves_start || 3
let octaves_length = prop.octaves_length || 3
let piano = GeneratePiano(octaves_start, octaves_length)

</script>

<template>
    <div v-for="(note, index) of piano" :key="index">
        <PianoKey :note="note" />
    </div>
</template>