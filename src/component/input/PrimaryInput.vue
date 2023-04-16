<script setup lang="ts">

const prop = defineProps<{
    icon: string
    type: 'text' | 'number' | 'email' | 'password' | 'search'
    placeholder?: string
    required?: boolean
    modelValue?: string | number
    width?: string
}>()

const emit = defineEmits(['update:modelValue'])

function updateModelValue(e: Event) {
    let value: string | number = (<HTMLInputElement>e.target).value
    if (prop.type == "number") value = Number(value)
    
    emit('update:modelValue', value)
}
</script>

<template>
    <label class="input" :style="{ width }">
        <input
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :required="required"
            @input="updateModelValue"
        />

        <div class="icon">
            <span class="material-icons-round">{{ icon }}</span>
        </div>

        <div class="placeholder">{{ placeholder }}</div>
    </label>
</template>

<style lang="scss" scoped>
@import "../../asset/scss/config.scss";

.input {
    display: inline-block;
    position: relative;
    background-color: var(--color-bg-primary);
    margin: .4rem 2px;
    transition: background-color $transition-time, color $transition-time;

    .icon {
        position: absolute;
        top: 0;
        left: 3px;
        width: 2.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-primary-1;
        transition: color $transition-time;
    }

    .placeholder {
        position: absolute;
        top: .9rem;
        right: calc(100% - 8rem);
        opacity: 0;
        font-size: 12px;
        color: #777;
        transition:
            opacity $transition-time,
            top $transition-time,
            right $transition-time;
    }

    input {
        display: block;
        padding: {
            left: 2.5rem;
            bottom: .7rem;
            top: .7rem;
            right: .5rem;
        }
        width: 100%;
        border: none;
        border-radius: 5px;
        background-color: rgba($color-primary-1, 0.04);
        color: var(--color-text-primary);
        outline: none;
        transition: background-color $transition-time, color $transition-time;

        &:focus {
            outline: none;
            background-color: rgba($color-primary-2, 0.07);

            + .icon {
                color: $color-primary-2;
            }
        }

        &:not(:placeholder-shown) ~ .placeholder {
            opacity: 1;
            right: .5rem;
            top: 0px;
        }
    }
}
</style>