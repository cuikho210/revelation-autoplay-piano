<script setup lang="ts">
import SideBar from './component/layout/SideBar.vue'
import NavBar from './component/layout/NavBar.vue'

</script>

<template>
	<SideBar />

	<main>
		<NavBar />

		<router-view v-slot="{ Component }">
            <Transition name="fade-in-fast" mode="out-in">
                <div>
					<component :is="Component"></component>
				</div>
            </Transition>
        </router-view>
	</main>
</template>

<style scoped lang="scss">
@import "./asset/scss/config.scss";

main {
	position: relative;
	margin-left: $sidebar-width;
	transition: margin-left $transition-time ease-out;
}

@media screen and (max-width: $breakpoint-mobile) {
	main {
		margin-left: 0;
	}
}
</style>