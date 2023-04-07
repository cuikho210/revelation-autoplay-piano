<script setup lang="ts">
import { PlaySound } from "../util/piano"
import HorizontalPiano from "../component/piano/HorizontalPiano.vue"

</script>

<template>
    <HorizontalPiano :octaves_start="4" :octaves_length="2" />
</template>

<style scoped lang="scss">

</style>