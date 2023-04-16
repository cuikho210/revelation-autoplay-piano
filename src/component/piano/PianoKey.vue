<script setup lang="ts">
import { PlaySound } from '../../util/piano'

const prop = defineProps<{
    note: Piano.Note
    width?: string
}>()

let is_sub_key = prop.note.key.includes('b')
let note_name = prop.note.key + prop.note.octa

</script>

<template>
    <button @click="PlaySound(note_name)" :style="{
        backgroundColor: is_sub_key ? '#2f2f2f' : '#fefefe',
        color: is_sub_key ? '#fff' : '#000',
        width: width || '100px'
    }">
        {{ note_name  }}
    </button>
</template>

<style scoped lang="scss">
button {
    display: inline-block;
    width: 100px;
    padding: .25rem;
    border: 1px solid rgba(var(--color-text-primary--rgb), 0.04);

    &:active {
        opacity: 0.8;
    }
}
</style>