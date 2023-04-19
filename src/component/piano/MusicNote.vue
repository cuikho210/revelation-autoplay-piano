<script setup lang="ts">
import { ref } from "vue"
import { PlaySound } from '../../util/piano'

const prop = defineProps<{
    note: string,
    is_active?: boolean
}>()

const emit = defineEmits(["update:active"])
let is_sub_key = prop.note.includes('b')

function toggleActive() {
    if (prop.is_active) {
        emit("update:active", prop.note, false)
    } else {
        PlaySound(prop.note);
        emit("update:active", prop.note, true)
    }
}

</script>

<template>
    <button @click="toggleActive" :class="{
        subkey: is_sub_key,
        active: is_active
    }">
        
    </button>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

button {
    display: inline-block;
    width: 27px;
    height: 27px;
    background-color: transparent;
    border: 1px solid rgba(var(--color-text-primary--rgb), 0.014);
}

.subkey {
    background-color: rgba(var(--color-text-primary--rgb), 0.07);
}

.active {
    background-color: $color-primary-1;
}
</style>