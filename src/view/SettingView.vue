<script setup lang="ts">
import { InitConfigWindow } from "../util/config/config"
import PrimaryButton from "../component/button/PrimaryButton.vue"
import { InitMusicWindow } from "../util/play_music"
import { GetPianoConfig } from "../util/config_piano_key"
import { PianoPlayer } from "../util/piano"

async function playMusic() {
    let piano = await GetPianoConfig()

    let music: Music.Music = {
        tempo: 300,
        data: [
            ["C5"],
            ["D5"],
            ["E5"],
            ["C5"],
            ["G5"],
            [], [],
            ["E5"],
            ["D5"],
            [],
            ["G5"],
            [],
            ["D5"],
            [],
            ["C5"],
            ["A4"],
            ["E5"],
            [], [],
            ["C5"],
            ["B4"],
            [], [], [],
            ["G4"],
            [],
            ["A4"],
            [],
            ["B4"],
            [],
            ["C5"],
            ["D5"],
            ["G4"],
            [],
            ["C5"],
            [],
            ["D5"],
            ["E5"],
            ["F5"],
            [],
            ["F5"],
            ["E5"],
            ["D5"],
            ["C5"],
            ["D5"],
        ]
    }

    let player = new PianoPlayer(piano, music)

    setTimeout(() => player.Play(), 2000)
}
</script>

<template>
<section class="container-md">
    <div>
        <h3>Cấu hình - Gán phím Piano</h3>
        <br>

        <p>
            Mở game, ngồi vào đàn, bật chế độ đàn 88 phím sau đó nhấn nút bắt đầu cấu hình. <br>
            Căn chỉnh sao cho các chấm trên màn hình khớp với 84 phím đàn từ C1 đến B7 trên Piano. <br>
            Sau khi căn chỉnh xong, đóng cửa sổ cấu hình. Dữ liệu cấu hình đã được lưu sau mỗi lần nhấn phím. <br>
            <br>
            Dữ liệu đã lưu sẽ được tải lại cho những lần sau.
        </p>
        <br>

        <PrimaryButton icon="settings" @click="InitConfigWindow()">
            Bắt đầu cấu hình
        </PrimaryButton>

        <PrimaryButton icon="piano" @click="playMusic()">
            Test
        </PrimaryButton>
    </div>
</section>
</template>

<style scoped lang="scss">
@import "../asset/scss/container.scss";

</style>