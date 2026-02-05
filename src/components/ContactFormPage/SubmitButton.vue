<template>
	<button class="submit-button" type="submit" :disabled="disabled">
		<slot>Отправить</slot>
	</button>
</template>

<script setup lang="ts">
defineProps<{
	disabled?: boolean;
}>();
</script>

<style scoped lang="scss">
@use '../../assets/styles/mixins.scss' as m;
@use '../../assets/styles/variables.scss' as *;

.submit-button {
	@include m.ui-cta;

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		box-shadow: none;
		transform: none;
	}
}
</style>
