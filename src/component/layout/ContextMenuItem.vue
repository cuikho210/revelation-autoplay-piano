<script setup lang="ts">

const prop = defineProps<{
    icon: string
}>()

</script>

<template>
    <div class="main">
        <span class="material-icons-round">{{ icon }}</span>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.main {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: .3rem .5rem;
    transition: background-color $transition-time--short ease-out;

    &:hover {
        background-color: rgba($color-primary-1, 0.4);

        .material-icons-round {
            color: $color-primary-2;
        }
    }

    .material-icons-round {
        margin-right: .5rem;
        color: $color-primary-1;
    }
}
</style>