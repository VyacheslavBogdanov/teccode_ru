<template>
	<section class="docs" v-if="docs.length">
		<div class="docs__container">
			<RouterLink
				v-for="(doc, i) in docs"
				:key="doc.id"
				class="docs__item"
				:to="{ name: ROUTES.moduleDoc.name, params: { slug: moduleSlug, docId: doc.id } }"
				:style="{ animationDelay: `${0.05 * i}s` }"
			>
				<span class="docs__icon" aria-hidden="true">TXT</span>
				<span class="docs__title">{{ doc.title }}</span>
			</RouterLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTES } from '@/router/routes';
import type { ModuleDocumentLink } from '@/api/software';

const props = defineProps<{
	moduleSlug: string;
	docs: ModuleDocumentLink[];
}>();
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

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
		animation: fadeInUp 0.6s ease forwards;
		transition: transform 0.15s ease-out;

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
		transition: color 0.15s ease-out;
	}
}
</style>
