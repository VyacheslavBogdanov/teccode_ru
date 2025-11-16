<template>
	<section class="products">
		<div class="container">
			<h2>Программные решения</h2>
			<ul>
				<li v-for="product in products" :key="product.id">
					<RouterLink :to="`/products/${product.id}`">{{ product.name }}</RouterLink>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Product {
	id: string;
	name: string;
}

const products: Product[] = [
	{ id: 'fire-detector', name: 'Детектор огня' },
	{ id: 'rtsp-streamer', name: 'Передача видеопотока по RTSP' },
	{ id: 'object-tracker', name: 'Отслеживание объектов' },
	{ id: 'face-recognition', name: 'Распознавание лиц' },
	{ id: 'sabotage-detector', name: 'Детектор саботажа' },
];
</script>

<style scoped lang="scss">
.products {
	padding: 4rem 1rem;
	.container {
		max-width: 960px;
		margin: 0 auto;
	}
	h2 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}
	ul {
		list-style: none;
		padding: 0;
	}
	li {
		margin-bottom: 0.75rem;
		a {
			color: #000;
			font-weight: 500;
			text-decoration: underline;
		}
	}
}
</style>
