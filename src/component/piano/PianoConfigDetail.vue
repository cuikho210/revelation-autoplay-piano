<script setup lang="ts">
import PianoKey from '../button/PianoKey.vue'

const prop = defineProps<{
    piano: Piano.Piano24Key
}>()

type PianoKey = {
    note: string,
    octa: number,
    position: Position
}

let piano_keys: PianoKey[] = []

for (let i = 4; i < 6; i ++) {
    for (let key_octa in prop.piano) {
        let octa = prop.piano[key_octa as keyof Piano.Piano24Key]

        for (let note in octa) {
            let note_position = octa[note as keyof Piano.Octaves]
            note_position.x = Math.round(note_position.x)
            note_position.y = Math.round(note_position.y)

            piano_keys.push({
                note,
                octa: i,
                position: note_position
            })
        }
    }
}
</script>

<template>
<section>
    <div v-for="piano_key in piano_keys" :key="piano_key.position.x">
        <PianoKey
            :note="piano_key.note + piano_key.octa"
            :x="piano_key.position.x"
            :y="piano_key.position.y"
                width="140px"
        />
    </div>
</section>
</template>

<style scoped lang="scss">

</style>