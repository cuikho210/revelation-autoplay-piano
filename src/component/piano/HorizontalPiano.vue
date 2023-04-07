<script setup lang="ts">
import PianoKey from '../button/PianoKey.vue'

const prop = defineProps<{
    octaves_start?: number
    octaves_length?: number
}>()

let octaves_start = prop.octaves_start || 3
let octaves_length = prop.octaves_length || 3

type Octa_key = string[]
type Piano_key = Octa_key[]

let octa_template = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
let octaves: Piano_key = []

for (let i = octaves_start; i < octaves_start + octaves_length; i++) {
    let octa: Octa_key = []
    
    octa_template.forEach(note => {
        octa.push(note + i)
    })

    octaves.push(octa)
}

</script>

<template>
    <div v-for="(octa, octa_index) in octaves" :key="octa_index">
        <div v-for="note in octa" :key="note">
            <PianoKey :note="note" />
        </div>
    </div>
</template>