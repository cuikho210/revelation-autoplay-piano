<script setup lang="ts">
import { InitConfigWindow } from "../util/config/config"
import HorizontalPiano from "../component/piano/HorizontalPiano.vue"
import PrimaryButton from "../component/button/PrimaryButton.vue"

</script>

<template>
    <PrimaryButton icon="settings">Tự động cấu hình</PrimaryButton>

    <HorizontalPiano :octaves_start="4" :octaves_length="2" />
</template>

<style scoped lang="scss">

</style>