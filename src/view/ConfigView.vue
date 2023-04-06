<script setup lang="ts">
import { PlaySound } from "../util/piano"

</script>

<template>
    <button @click="PlaySound('C', 4)">C4</button>
    <button @click="PlaySound('D', 4)">D4</button>
    <button @click="PlaySound('E', 4)">E4</button>
    <button @click="PlaySound('F', 4)">F4</button>
    <button @click="PlaySound('G', 4)">G4</button>
    <button @click="PlaySound('A', 4)">A4</button>
    <button @click="PlaySound('B', 4)">B4</button>
</template>

<style scoped lang="scss">

</style>