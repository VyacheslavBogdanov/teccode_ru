<template>
	<section class="contact" id="contacts">
		<div class="contact__container">
			<h2 class="contact__title">Свяжитесь с нами</h2>
			<p class="contact__subtitle">
				Оставьте ваши контактные данные и кратко опишите задачу — мы вернёмся с ответом и
				предложением по дальнейшим шагам.
			</p>

			<Form />
		</div>
	</section>
</template>

<script setup lang="ts">
import Form from '@/components/Form.vue';
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

@keyframes contactFadeInUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.contact {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 720px;
		margin: 0 auto;
		padding: 3rem 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7);
		opacity: 0;
		animation: contactFadeInUp 0.8s ease forwards;
	}

	&__title {
		font-size: 2.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1.25rem;
	}

	&__subtitle {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.9);
		line-height: 1.7;
		margin-bottom: 2rem;
	}
}
</style>
