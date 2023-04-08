<script setup lang="ts">
import { ref } from "vue"
import { InitConfigWindow } from "../util/config/config"
import { GetPianoConfig } from "../util/config_piano_key"
import PianoConfigDetail from "../component/piano/PianoConfigDetail.vue"
import PrimaryButton from "../component/button/PrimaryButton.vue"

let is_config_loaded = ref(false)
let config: Piano.Piano24Key

GetPianoConfig().then(data => {
    config = data
    is_config_loaded.value = true
})

</script>

<template>
<section>
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

    <div class="piano_detail" v-if="is_config_loaded">
        Đã lưu cấu hình!
    </div>
    <div v-else>
        Chưa có cấu hình!
    </div>
</section>
</template>

<style scoped lang="scss">
section {
    padding: .5rem;
}
</style>