<template>
	<section class="admin">
		<div class="admin__container ui-panel">
			<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__brand">
				TECH <span class="admin__brand-sep">|</span> CODE
			</RouterLink>
			<h1 class="admin__title">Админка</h1>
			<p class="admin__subtitle">Вход по логину и паролю</p>

			<form class="admin__form" @submit.prevent="onSubmit">
				<label class="admin__label">
					<span>Логин</span>
					<input class="admin__input" v-model="login" autocomplete="username" />
				</label>

				<label class="admin__label">
					<span>Пароль</span>
					<div class="admin__password">
						<input
							class="admin__input admin__input--password"
							v-model="password"
							autocomplete="current-password"
							:type="showPassword ? 'text' : 'password'"
						/>
						<button
							class="admin__password-toggle"
							type="button"
							:aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
							@click="showPassword = !showPassword"
						>
							<svg
								v-if="!showPassword"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<svg
								v-else
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 3l18 18"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
								<path
									d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M2 12s3.5-7 10-7c1.7 0 3.2.35 4.5.9M22 12s-3.5 7-10 7c-1.7 0-3.2-.35-4.5-.9"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>
					</div>
				</label>

				<button class="ui-cta admin__submit" type="submit" :disabled="loading">
					{{ loading ? 'Входим…' : 'Войти' }}
				</button>

				<p v-if="error" class="admin__error">{{ error }}</p>
			</form>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { useAdminStore } from '@/admin/stores/admin';

const router = useRouter();
const route = useRoute();
const store = useAdminStore();

const login = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

async function onSubmit() {
	error.value = '';
	loading.value = true;
	try {
		await store.login(login.value, password.value);
		const redirect = String(route.query.redirect ?? '/admin');
		router.replace(redirect);
	} catch (e) {
		error.value =
			e instanceof Error && e.message
				? e.message
				: 'Не удалось войти. Проверьте соединение и попробуйте ещё раз.';
	} finally {
		loading.value = false;
	}
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.admin {
	padding: 5rem 1rem;
	min-height: 100vh;
	color: #111827;
	background: transparent;

	:deep(.ui-panel) {
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 18px 45px rgba(17, 24, 39, 0.08);
	}

	:deep(.ui-cta) {
		border-color: $main-red-color;
		color: #111827;
		background: transparent;
		&:hover {
			background: $main-red-color;
			color: #ffffff;
			box-shadow: 0 0 0 4px rgba($main-red-color, 0.14);
		}
	}

	&__container {
		max-width: 520px;
		margin: 0 auto;
		padding: 2rem;
	}

	&__brand {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #111827;
		border-bottom: 1px solid transparent;
		width: fit-content;
		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.6);
		}
	}

	&__brand-sep {
		opacity: 0.6;
	}

	&__title {
		font-size: 1.6rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__subtitle {
		margin-top: 0.5rem;
		color: rgba(17, 24, 39, 0.65);
	}

	&__form {
		margin-top: 1.5rem;
		display: grid;
		gap: 1rem;
	}

	&__label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.9rem;
		color: rgba(17, 24, 39, 0.9);
	}

	&__input {
		padding: 0.75rem 0.9rem;
		border-radius: 10px;
		border: 1px solid rgba(17, 24, 39, 0.18);
		background: #ffffff;
		color: #111827;
		outline: none;
		box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);

		&:focus {
			border-color: rgba($main-red-color, 0.8);
			box-shadow:
				0 0 0 4px rgba($main-red-color, 0.12),
				0 1px 0 rgba(17, 24, 39, 0.04);
		}

		&::placeholder {
			color: rgba(17, 24, 39, 0.45);
		}
	}

	&__password {
		position: relative;
		display: grid;
	}

	&__input--password {
		padding-right: 3rem;
	}

	&__password-toggle {
		position: absolute;
		top: 50%;
		right: 0.65rem;
		transform: translateY(-50%);
		width: 2.2rem;
		height: 2.2rem;
		display: grid;
		place-items: center;
		border: none;
		border-radius: 10px;
		background: transparent;
		cursor: pointer;
		color: rgba(17, 24, 39, 0.8);

		&:hover {
			background: rgba($main-red-color, 0.08);
			color: $main-red-color;
		}

		&:focus-visible {
			outline: none;
			box-shadow: 0 0 0 4px rgba($main-red-color, 0.12);
			background: rgba($main-red-color, 0.06);
		}
	}

	&__submit {
		justify-self: start;
		margin-top: 0.25rem;
	}

	&__error {
		color: $main-red-color;
		font-size: 0.9rem;
	}
}
</style>
