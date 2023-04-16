<script setup lang="ts">
import { ref } from "vue"
import { PlaySound } from '../../util/piano'

const prop = defineProps<{
    note: string
}>()

const emit = defineEmits(["update:active"])
const is_active = ref(false)
let is_sub_key = prop.note.includes('b')

function toggleActive() {
    is_active.value = !is_active.value

    if (is_active.value) {
        PlaySound(prop.note);
        emit("update:active", prop.note, true)
    } else {
        emit("update:active", prop.note, false)
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
    border: 1px solid rgba($color-primary-2, 0.2);
}

.subkey {
    background-color: rgba(var(--color-text-primary--rgb), 0.07);
}

.active {
    background-color: $color-primary-1;
}
</style>