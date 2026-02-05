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

		<div class="form__field form__field--full">
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

const SUCCESS_MESSAGE_TIMEOUT = 4000;

const name = ref('');
const email = ref('');
const message = ref('');
const submitted = ref(false);

const resetFields = () => {
	name.value = '';
	email.value = '';
	message.value = '';
};

const scheduleHideSuccess = () => {
	setTimeout(() => {
		submitted.value = false;
	}, SUCCESS_MESSAGE_TIMEOUT);
};

const onSubmit = () => {
	submitted.value = true;

	resetFields();
	scheduleHideSuccess();
};
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.form {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	column-gap: 2rem;
	row-gap: 2rem;
	width: 100%;

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}

	&__field {
		display: flex;
		flex-direction: column;
	}

	&__field--full {
		grid-column: 1 / -1;
	}

	&__label {
		font-size: 0.9rem;
		font-weight: 400;
		text-transform: none;
		color: rgba($main-text-color, 0.85);
		margin-bottom: 0.35rem;
	}

	&__input,
	&__textarea {
		width: 100%;
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
		background: transparent;
		padding: 0.5rem 0;
		font-size: 0.95rem;
		color: $main-text-color;
		outline: none;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;

		&::placeholder {
			color: rgba($main-text-color, 0.45);
		}

		&:focus {
			border-bottom-color: $main-red-color;
			box-shadow: 0 1px 0 rgba($main-red-color, 0.6);
		}
	}

	&__textarea {
		resize: none;
		min-height: 140px;
	}

	&__actions {
		grid-column: 1 / -1;
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
