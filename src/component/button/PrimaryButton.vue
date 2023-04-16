<script setup lang="ts">
const prop = defineProps<{
    icon: string
    type?: 'button' | 'submit'
}>()
</script>

<template>
<div>
    <button :type="type">
        <span class="material-icons-round">{{ icon }}</span>
        <slot></slot>
    </button>
</div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

div {
    display: inline-block;
    margin: .4rem auto;
    
    button {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: .4rem;
        padding-right: .7rem;
        background-color: $color-primary-1;
        color: #fff;
        border: none;
        outline: none;
        border-radius: 4px;
        box-shadow: 4px 4px 7px rgba(var(--color-text-primary--rgb), 0.04);
        transition:
            background-color $transition-time,
            box-shadow $transition-time;
        cursor: pointer;
        white-space: nowrap;

        &:hover {
            background-color: $color-primary-2;
            box-shadow: 4px 4px 7px rgba(var(--color-text-primary--rgb), 0.07);
        }

        &:active {
            top: 1px;
        }

        .material-icons-round {
            margin-right: .3rem;
        }
    }
}
</style>