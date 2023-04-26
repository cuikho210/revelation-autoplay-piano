<script setup lang="ts">
const prop = defineProps<{
    icon: string
    type?: 'button' | 'submit'
    title?: string
}>()
</script>

<template>
    <div class="btn">
        <button :type="type" :title="title">
            <span class="material-icons-round">{{ icon }}</span>
        </button>
    </div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.btn {
    display: inline-block;

    button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: .4rem;
        color: $color-primary-1;
        background-color: transparent;
        border: none;
        outline: none;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color $transition-time, color $transition-time;

        &:hover {
            background-color: rgba(var(--color-text-primary--rgb), 0.04);
        }

        &:active {
            top: 1px;
        }
    }
}
</style>