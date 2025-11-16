<template>
	<section class="contact" id="contact">
		<div class="container">
			<h2>Сделайте запрос</h2>
			<form @submit.prevent="submit">
				<input v-model="form.name" type="text" placeholder="Ваше имя" required />
				<input v-model="form.email" type="email" placeholder="Email" required />
				<textarea v-model="form.message" placeholder="Ваш запрос" required />
				<BaseButton text="Отправить" type="submit" />
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import BaseButton from './BaseButton.vue';

const form = reactive({
	name: '',
	email: '',
	message: '',
});

const submit = () => {
	alert('Запрос отправлен!');
	form.name = '';
	form.email = '';
	form.message = '';
};
</script>

<style scoped lang="scss">
.contact {
	color: #fff;
	padding: 4rem 1rem;
	.container {
		max-width: 600px;
		margin: 0 auto;
	}
	h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
		text-align: center;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		input,
		textarea {
			padding: 0.75rem;
			border: none;
			border-radius: 4px;
			font-size: 1rem;
		}
	}
}
</style>
