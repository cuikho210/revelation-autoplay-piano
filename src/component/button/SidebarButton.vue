<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
    href: string
    icon: string
}>()

const route = useRoute()

</script>

<template>
    <router-link :to="href">
        <div :class="{
            btn: true,
            active: href == route.path
        }">
            <span class="material-icons-round">{{ icon }}</span>
            <slot></slot>
        </div>
    </router-link>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

.btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: var(--color-text-primary);
    border-left: 5px solid rgba($color-primary-1, 0);
    padding: .5rem;
    margin: .25rem auto;
    background-color: var(--color-bg-primary--rgb);
    transition:
        background-color $transition-time,
        color $transition-time,
        border-left $transition-time;

    &:not(.active):hover {
        background-color: rgba(var(--color-text-primary--rgb), 0.01);
        border-left: 5px solid rgba($color-primary-1, 1);
    }

    .material-icons-round {
        color: $color-primary-1;
        margin-right: .5rem;
    }
}

.active {
    background-color: rgba($color-primary-1, 0.2);
    border-left: 5px solid $color-primary-2;

    .material-icons-round {
        color: $color-primary-2;
    }
}
</style>