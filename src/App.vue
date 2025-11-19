<template>
	<div id="app">
		<Header />
		<router-view />
	</div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
