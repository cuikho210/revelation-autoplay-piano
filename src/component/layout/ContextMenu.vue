<script setup lang="ts">
import { ref, onMounted } from "vue"

const prop = defineProps<{
    watch_element: HTMLElement | undefined
    modelValue?: boolean
}>()

const emit = defineEmits(["update:modelValue"])

const background = ref<HTMLDivElement>()
const context_menu = ref<HTMLDivElement>()

onMounted(() => {
    if (!background.value || !prop.watch_element) return

    prop.watch_element.addEventListener("contextmenu", openContextMenu)
    background.value.addEventListener("click", closeContextMenu)
    background.value.addEventListener("contextmenu", closeContextMenu)
})

function closeContextMenu(event?: MouseEvent) {
    if (event) event.preventDefault()
    emit("update:modelValue", false)
}

function openContextMenu(event: MouseEvent) {
    event.preventDefault()
    if (!background.value || !context_menu.value) return

    let top = event.clientY
    let left = event.clientX
    let rect = context_menu.value.getBoundingClientRect()

    if (top + rect.height > window.innerHeight) top -= rect.height
    if (left + rect.width > window.innerWidth) left -= rect.width

    context_menu.value.style.top = top + "px"
    context_menu.value.style.left = left + "px"

    emit("update:modelValue", true)
}

</script>

<template>
<div>
    <div ref="background" class="background" :style="{
        visibility: modelValue ? 'initial' : 'hidden'
    }"></div>

    <div ref="context_menu" class="context-menu" :style="{
        visibility: modelValue ? 'initial' : 'hidden',
        opacity: modelValue ? '1' : '0'
    }">
        <slot></slot>
    </div>
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
}

.context-menu {
    position: fixed;
    border: 1px solid rgba(var(--color-text-primary--rgb), 0.02);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 4px 4px 1rem rgba(0, 0, 0, 0.04);
    background-color: rgba(var(--color-bg-primary--rgb), 0.8);
    backdrop-filter: blur(7px);
    visibility: hidden;
    opacity: 0;
    transition:
        visibility $transition-time ease-out,
        opacity $transition-time ease-out,
        background-color $transition-time ease-out;
}
</style>