<script setup lang="ts">
import { ref, onMounted } from "vue"
import { registerShortcut } from "../util/register_global_shortcut"

registerShortcut()
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    if (!canvas.value) {
        console.error(new Error("Canvas is null"))
        return
    }

    canvas.value.width = 1366
    canvas.value.height = 768
    canvas.value.style.backgroundColor = "#222"

    const ctx = canvas.value.getContext('2d')
    if (!ctx) {
        console.error(new Error("Context is null"))
        return
    }

    const img = document.createElement('img')
    img.src = "/screenshot.png"

    img.onload = () => {
        if (!canvas.value) return

        ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
    }
})
</script>

<template>
    <canvas ref="canvas"></canvas>
</template>

<style scoped lang="scss">
canvas {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: auto;
}
</style>