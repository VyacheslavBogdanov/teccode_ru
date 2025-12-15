<template>
	<header class="header">
		<div class="header__container">
			<RouterLink :to="ROUTES.home.path" class="header__logo">
				<b>tech</b>
				<hr />
				code
			</RouterLink>

			<nav class="header__nav">
				<RouterLink
					:to="ROUTES.contactForm.path"
					class="header__cta-link"
					active-class="header__cta-link--active"
				>
					Написать нам
				</RouterLink>

				<RouterLink
					:to="ROUTES.directions.path"
					class="header__cta-link"
					active-class="header__cta-link--active"
				>
					Направления
				</RouterLink>

				<RouterLink
					:to="ROUTES.softwareSolutions.path"
					class="header__cta-link"
					active-class="header__cta-link--active"
				>
					Программные решения
				</RouterLink>

				<RouterLink
					:to="ROUTES.contacts.path"
					class="header__cta-link"
					active-class="header__cta-link--active"
				>
					Контакты
				</RouterLink>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ROUTES } from '@/router/routes';
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.header {
	position: sticky;
	top: 0;
	z-index: 100;
	padding: 1rem 2rem;
	color: $main-text-color;
	background: $main-bg-color;

	@media (max-width: 1240px) {
		padding: 0.75rem 1.5rem;
	}

	@media (max-width: 930px) {
		padding: 0.75rem 1.25rem;
	}

	@media (max-width: 500px) {
		padding: 0.5rem 1rem;
	}

	&__container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;

		@media (max-width: 930px) {
			justify-content: center;
			row-gap: 0.5rem;
		}

		@media (max-width: 500px) {
			flex-direction: column;
			align-items: center;
			row-gap: 0.4rem;
		}
	}

	&__logo {
		font-size: 1.5rem;
		font-weight: 100;
		text-transform: uppercase;

		b {
			color: $main-red-color;
			font-weight: 700;
		}

		@media (max-width: 1240px) {
			font-size: 1.4rem;
		}

		@media (max-width: 930px) {
			width: 100%;
			text-align: left;
		}

		@media (max-width: 500px) {
			text-align: center;
			font-size: 1.25rem;
		}
	}

	&__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;

		@media (max-width: 1240px) {
			gap: 1.25rem;
		}

		@media (max-width: 930px) {
			width: 100%;
			justify-content: center;
		}

		@media (max-width: 500px) {
			gap: 0.75rem;
		}
	}

	&__cta-link {
		font-size: 0.9rem;
		font-weight: 100;
		padding: 0.5rem 1rem;
		color: $main-text-color;
		text-transform: uppercase;
		transition: color 0.3s;
		white-space: nowrap;

		@media (max-width: 1240px) {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}

		@media (max-width: 500px) {
			font-size: 0.8rem;
		}

		&:hover {
			color: $main-red-color;
		}

		&--active {
			color: $main-red-color;
		}
	}
}
</style>
