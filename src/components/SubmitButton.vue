<template>
	<button class="submit-button" type="submit">
		<slot>Отправить</slot>
	</button>
</template>

<script setup lang="ts">
// Дополнительная логика не требуется — кнопка управляется формой
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.submit-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.8rem;
	border-radius: 999px;
	border: 2px solid $main-red-color;
	background: transparent;
	color: $main-text-color;
	font-size: 0.95rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	cursor: pointer;
	transition:
		background 0.2s ease,
		color 0.2s ease,
		box-shadow 0.2s ease,
		transform 0.1s ease;

	&:hover {
		background: $main-red-color;
		color: #000;
		box-shadow: 0 0 18px rgba($main-red-color, 0.6);
	}

	&:active {
		transform: translateY(1px);
		box-shadow: 0 0 10px rgba($main-red-color, 0.4);
	}
}
</style>
