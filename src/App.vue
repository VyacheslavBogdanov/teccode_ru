<template>
	<div id="app">
		<Header v-if="!isAdmin" />
		<router-view />
		<CursorShadow v-if="!isAdmin" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header/Header.vue';
import CursorShadow from './components/CursorShadow/CursorShadow.vue';

const route = useRoute();
const isAdmin = computed(() => String(route.path ?? '').startsWith('/admin'));
</script>

<style scoped lang="scss">
#app {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
