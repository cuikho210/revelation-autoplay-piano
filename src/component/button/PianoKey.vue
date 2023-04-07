<script setup lang="ts">
import { PlaySound } from '../../util/piano'

const prop = defineProps<{
    note: string
}>()

let is_sub_key = prop.note.includes('b')

</script>

<template>
    <button @click="PlaySound(note)" :style="{
        backgroundColor: is_sub_key ? '#2f2f2f' : '#fefefe',
        color: is_sub_key ? '#fff' : '#000'
    }">
        {{ note }}
    </button>
</template>

<style scoped lang="scss">
button {
    user-select: none;
    display: block;
    width: 100px;
    padding: .25rem;
    border: 1px solid rgba(var(--color-text-primary--rgb), 0.04);

    &:active {
        opacity: 0.8;
    }
}
</style>