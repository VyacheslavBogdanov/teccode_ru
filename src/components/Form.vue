<template>
	<form class="form" @submit.prevent="onSubmit">
		<div class="form__field">
			<label for="name" class="form__label">Ваше имя</label>
			<input
				id="name"
				v-model="name"
				type="text"
				class="form__input"
				placeholder="Иван Иванов"
				required
			/>
		</div>

		<div class="form__field">
			<label for="email" class="form__label">Ваша почта</label>
			<input
				id="email"
				v-model="email"
				type="email"
				class="form__input"
				placeholder="you@example.com"
				required
			/>
		</div>

		<div class="form__field">
			<label for="message" class="form__label">Ваше сообщение</label>
			<textarea
				id="message"
				v-model="message"
				class="form__textarea"
				placeholder="Ваше сообщение…"
				rows="5"
				required
			></textarea>
		</div>

		<div class="form__actions">
			<SubmitButton>Отправить</SubmitButton>
			<p v-if="submitted" class="form__success">
				Сообщение отправлено. Мы свяжемся с вами в ближайшее время.
			</p>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SubmitButton from './SubmitButton.vue';

const name = ref('');
const email = ref('');
const message = ref('');
const submitted = ref(false);

const onSubmit = () => {
	// Здесь можно будет интегрировать реальную отправку (API, почта и т.п.)
	submitted.value = true;

	// Простая очистка полей после отправки
	name.value = '';
	email.value = '';
	message.value = '';

	// Через пару секунд можно скрывать сообщение, если захочешь
	setTimeout(() => {
		submitted.value = false;
	}, 4000);
};
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.form {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	&__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	&__label {
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba($main-text-color, 0.85);
	}

	&__input,
	&__textarea {
		width: 100%;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(0, 0, 0, 0.35);
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		color: $main-text-color;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			background 0.2s ease;

		&::placeholder {
			color: rgba($main-text-color, 0.5);
		}

		&:focus {
			border-color: $main-red-color;
			box-shadow: 0 0 0 1px rgba($main-red-color, 0.5);
			background: rgba(0, 0, 0, 0.6);
		}
	}

	&__textarea {
		resize: vertical;
		min-height: 140px;
	}

	&__actions {
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;

		@media (max-width: 480px) {
			align-items: stretch;
		}
	}

	&__success {
		font-size: 0.88rem;
		color: rgba($main-text-color, 0.8);
	}
}
</style>
