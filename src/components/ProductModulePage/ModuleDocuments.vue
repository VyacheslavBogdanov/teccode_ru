<template>
	<section class="docs" v-if="documents.length">
		<div class="docs__container">
			<RouterLink
				v-for="doc in documents"
				:key="doc.id"
				class="docs__item"
				:to="{ name: 'ProductModuleDocument', params: { slug: moduleSlug, docId: doc.id } }"
			>
				<span class="docs__icon" aria-hidden="true">PDF</span>
				<span class="docs__title">{{ doc.title }}</span>
			</RouterLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { DocItem } from '@/stores/main';

defineProps<{
	documents: DocItem[];
	moduleSlug: string;
}>();
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

@keyframes docsFadeInUp {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.docs {
	margin-top: 3.5rem;

	&__container {
		max-width: 960px;
		margin: 0 auto;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.06);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2.2rem 4rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: 1.6rem 2rem;
		}
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 1.4rem;
		color: rgba($main-text-color, 0.9);
		text-decoration: none;
		cursor: pointer;
		opacity: 0;
		animation: docsFadeInUp 0.6s ease forwards;
		transition:
			transform 0.15s ease-out,
			color 0.15s ease-out;

		&:nth-child(1) {
			animation-delay: 0.05s;
		}
		&:nth-child(2) {
			animation-delay: 0.1s;
		}
		&:nth-child(3) {
			animation-delay: 0.15s;
		}
		&:nth-child(4) {
			animation-delay: 0.2s;
		}
		&:nth-child(5) {
			animation-delay: 0.25s;
		}
		&:nth-child(6) {
			animation-delay: 0.3s;
		}
		&:nth-child(7) {
			animation-delay: 0.35s;
		}
		&:nth-child(8) {
			animation-delay: 0.4s;
		}

		&:hover {
			transform: translateY(-3px);

			.docs__title {
				color: $main-red-color;
			}

			.docs__icon {
				border-color: $main-red-color;
				box-shadow: 0 14px 32px rgba(0, 0, 0, 0.95);
				background: radial-gradient(
					circle at 30% 20%,
					rgba($main-red-color, 0.22),
					rgba(0, 0, 0, 0.7)
				);
			}
		}
	}

	&__icon {
		width: 60px;
		height: 80px;
		flex: 0 0 60px;
		box-sizing: border-box;
		border-radius: 8px;
		background: rgba(0, 0, 0, 0.4);
		border: 2px solid rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: $main-red-color;
		position: relative;
		overflow: hidden;
		padding-bottom: 0.45rem;
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.8);
		transition:
			border-color 0.15s ease-out,
			box-shadow 0.15s ease-out,
			background 0.15s ease-out;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 20px;
			height: 20px;
			border-top: 2px solid rgba(255, 255, 255, 0.9);
			border-left: 2px solid rgba(255, 255, 255, 0.9);
			transform: translate(9px, -9px) rotate(45deg);
			background: rgba(0, 0, 0, 0.98);
		}

		&::after {
			content: '';
			position: absolute;
			top: 22px;
			left: 11px;
			right: 11px;
			height: 2px;
			background: rgba(255, 255, 255, 0.35);
		}
	}

	&__title {
		flex: 1;
		font-size: 1.02rem;
		line-height: 1.7;
		text-align: left;
		color: rgba($main-text-color, 0.92);
	}
}
</style>
