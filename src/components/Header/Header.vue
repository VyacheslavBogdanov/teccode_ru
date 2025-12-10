<template>
	<header class="header">
		<div class="header__container">
			<RouterLink to="/" class="header__logo"><b>tech</b>code</RouterLink>

			<nav class="header__nav">
				<RouterLink
					to="/contact-form"
					href="#contact"
					class="header__cta-link"
					:class="{ 'header__cta-link--active': route.name === 'ContactForm' }"
					>Написать нам</RouterLink
				>
				<RouterLink
					to="/directions"
					class="header__cta-link"
					:class="{ 'header__cta-link--active': route.name === 'Directions' }"
				>
					Направления
				</RouterLink>
				<RouterLink
					to="/sofware-solutions"
					class="header__cta-link"
					:class="{ 'header__cta-link--active': route.name === 'SoftwareSolutions' }"
					>Программные решения</RouterLink
				>
				<RouterLink
					to="/contacts"
					class="header__cta-link"
					:class="{ 'header__cta-link--active': route.name === 'Contacts' }"
					>Контакты</RouterLink
				>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute();
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

		@media (max-width: 1240px) {
			max-width: 1000px;
			gap: 0.75rem;
		}

		@media (max-width: 930px) {
			max-width: 100%;
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
			order: 1;
			width: 100%;
			text-align: center;
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
			order: 2;
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
		text-decoration: none;
		text-transform: uppercase;
		transition: color 0.3s;
		white-space: nowrap;

		@media (max-width: 1240px) {
			font-size: 0.85rem;
			padding: 0.4rem 0.8rem;
		}

		@media (max-width: 930px) {
			text-align: center;
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

	&__login {
		font-size: 0.9rem;
		font-weight: 100;
		text-transform: uppercase;
		cursor: pointer;

		&:hover {
			color: $main-red-color;
		}

		@media (max-width: 930px) {
			order: 3;
			width: 100%;
			text-align: center;
			margin-top: 0.25rem;
		}
	}
}

html {
	scroll-behavior: smooth;
}
</style>
