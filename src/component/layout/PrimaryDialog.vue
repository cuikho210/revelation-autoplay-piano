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

function show() {
    emit("update:modelValue", true)
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
        max-width: 100%;
        max-height: 100%;
        z-index: 41;
        border-radius: 7px;
        overflow: hidden;
        box-shadow: 4px 4px 1rem rgba(0, 0, 0, 0.04);

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(var(--color-text-primary--rgb), 0.04);

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