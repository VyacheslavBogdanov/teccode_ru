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
				<a href="#products" class="header__cta-link">Программные решения</a>
				<a href="#contacts" class="header__cta-link">Контакты</a>
			</nav>

			<div class="header__login">Вход</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.header {
	position: sticky;
	top: 0;
	z-index: 100;
	padding: 1rem 2rem;
	color: $main-text-color;
	background: $main-bg-color;

	&__container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	&__logo {
		font-size: 1.5rem;
		font-weight: 100;
		text-transform: uppercase;

		b {
			color: $main-red-color;
			font-weight: 700;
		}
	}

	&__nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;

		@media (max-width: 767px) {
			width: 100%;
			justify-content: center;
			order: 3;
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

		@media (max-width: 767px) {
			width: 100%;
			text-align: center;
			order: 2;
		}
	}

	@media (max-width: 767px) {
		&__logo {
			width: 100%;
			text-align: center;
			order: 1;
		}
	}
}

html {
	scroll-behavior: smooth;
}
</style>
