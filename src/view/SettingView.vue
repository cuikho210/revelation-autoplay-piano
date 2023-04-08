<script setup lang="ts">
import { ref } from "vue"
import { listen } from "@tauri-apps/api/event"
import { InitConfigWindow } from "../util/config/config"
import { GetPianoConfig } from "../util/config_piano_key"
import PrimaryButton from "../component/button/PrimaryButton.vue"

let is_config_loaded = ref(false)

GetPianoConfig().then(() => {
    is_config_loaded.value = true
})

listen("piano_draw", () => {
    is_config_loaded.value = true
})

</script>

<template>
<section class="container-md">
    <div>
        <h3>Cấu hình - Gán phím Piano</h3>
        <br>

        <p>
            Mở game, ngồi vào đàn, bật chế độ đàn 25 phím sau đó nhấn nút bắt đầu cấu hình. <br>
            Căn chỉnh sao cho các chấm trên màn hình khớp với 24 phím đàn đầu tiên trên Piano. <br>
            Sau khi căn chỉnh xong, đóng cửa sổ cấu hình. Dữ liệu cấu hình đã được lưu sau mỗi lần nhấn phím. <br>
            <br>
            Dữ liệu đã lưu sẽ được tải lại cho những lần sau.
        </p>
        <br>

        <PrimaryButton icon="settings" @click="InitConfigWindow()">
            Bắt đầu cấu hình
        </PrimaryButton>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../asset/scss/container.scss";

</style>