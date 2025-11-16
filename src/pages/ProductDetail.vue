<template>
	<section class="product-detail">
		<div class="container">
			<h2>Модуль: {{ productName }}</h2>
			<p>Подробная информация о модуле появится здесь.</p>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const productName = computed(() => route.params.id);
</script>

<style scoped lang="scss">
.product-detail {
	padding: 4rem 1rem;
	.container {
		max-width: 800px;
		margin: 0 auto;
	}
	h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}
	p {
		font-size: 1.125rem;
	}
}
</style>
