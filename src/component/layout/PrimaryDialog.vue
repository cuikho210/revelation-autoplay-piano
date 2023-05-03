<script setup lang="ts">
const prop = defineProps<{
    title: string
    width?: string
    modelValue?: boolean
}>()

const emit = defineEmits(["update:modelValue"])

function hide() {
    emit("update:modelValue", false)
}
</script>

<template>
    <section>
        <div class="bg" @click="hide"></div>

        <div class="main" :style="{ width }">
            <div class="header">
                <p class="title">{{ title }}</p>
                <span class="material-icons-round" @click="hide">close</span>
            </div>

            <div class="body">
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "../../asset/scss/config.scss";

section {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(var(--color-text-primary--rgb), 0.05);
    }

    .main {
        position: relative;
        display: block;
        background-color: var(--color-bg-primary);
        width: 400px;
        max-width: calc(100% - 1rem);
        max-height: calc(100% - 1rem);
        z-index: 41;
        border-radius: 7px;
        overflow-x: hidden;
        overflow-y: auto;
        box-shadow: 4px 4px 1rem rgba(0, 0, 0, 0.04);

        .header {
            position: sticky;
            top: 0px;
            left: 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(var(--color-text-primary--rgb), 0.04);
            background-color: rgba(var(--color-bg-primary--rgb), 0.8);
            backdrop-filter: blur(7px);
            z-index: 15;

            .material-icons-round {
                color: rgb(214, 0, 0);
                padding: .4rem .7rem;
                cursor: pointer;
                transition: background-color $transition-time--short ease-out;

                &:hover {
                    background-color: rgba(var(--color-text-primary--rgb), 0.04);
                }
            }

            .title {
                padding: .4rem .7rem;
                font-weight: bold;
            }
        }

        .body {
            padding: .7rem;
        }
    }
}
</style>