<script setup lang="ts">
const prop = defineProps<{
    icon: string
    type?: 'button' | 'submit'
}>()
</script>

<template>
<div class="btn">
    <button :type="type">
        <span class="material-icons-round">{{ icon }}</span>
        <slot></slot>
    </button>
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";
@import "../../asset/scss/primary_button.scss";
</style>