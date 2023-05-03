<script setup lang="ts">
import useLayoutStore from "../store/layout.store"

const layoutStore = useLayoutStore()
const message = () => layoutStore.locale.message

</script>

<template>
<section class="container-md">
    <div>
        <h2>Revelation Autoplay Piano</h2>
        <p>{{ message().home_description }}</p>
    </div>
    <br>

    <div>
        <h2>{{ message().home_guide_title }}</h2>
        <p>{{ message().home_guide_step_1 }}</p>
        <p>{{ message().home_guide_step_2 }}</p>
        <p>{{ message().home_guide_step_3 }}</p>
    </div>
    <br>

    <div>
        <h2>{{ message().home_info_title }}</h2>
        <p>{{ message().home_info_author }}: cuikho210</p>
        <p>Github: https://github.com/cuikho210</p>
        <p>Email: tonykms210@gmail.com</p>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../asset/scss/container.scss";

</style>