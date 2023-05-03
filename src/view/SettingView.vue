<script setup lang="ts">
import { InitConfigWindow } from "../util/config/config"
import PrimaryButton from "../component/button/PrimaryButton.vue"
import useLayoutStore from "../store/layout.store"

const layoutStore = useLayoutStore()
const message = () => layoutStore.locale.message

</script>

<template>
<section class="container-md">
    <div>
        <h3>{{ message().setting_key_assignment_title }}</h3>
        <p v-html="message().setting_key_assignment_help"></p>
        <br>

        <PrimaryButton icon="settings" @click="InitConfigWindow()">
            {{ message().setting_key_assignment_button_create_profile }}
        </PrimaryButton>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../asset/scss/container.scss";

h3 {
    margin-bottom: .7rem;
}
</style>