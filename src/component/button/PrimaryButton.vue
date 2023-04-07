<script setup lang="ts">
const prop = defineProps<{
    icon: string
    type?: 'button' | 'submit'
}>()
</script>

<template>
<button :type="type">
    <span class="material-icons-round">{{ icon }}</span>
    <slot></slot>
</button>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: .4rem;
    background-color: $color-primary-1;
    color: #fff;
}
</style>