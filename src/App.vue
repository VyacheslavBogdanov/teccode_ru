<template>
	<div id="app">
		<Header />
		<router-view />
		<!-- <Footer /> -->
	</div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
