<template>
	<button class="base-button" :type="type" @click="emit('click')">
		{{ text }}
	</button>
</template>

<script setup lang="ts">
defineProps<{ text: string; type?: 'button' | 'submit' }>();
const emit = defineEmits<{ (e: 'click'): void }>();
</script>

<style scoped lang="scss">
.base-button {
	background: transparent;
	color: #fff;
	border: 2px solid #ff3c3c;
	padding: 0.75rem 1.5rem;
	font-weight: 600;
	font-size: 1rem;
	text-transform: uppercase;
	cursor: pointer;
	border-radius: 0;
	transition:
		background 0.3s,
		color 0.3s;

	&:hover {
		background: #ff3c3c;
		color: #000;
	}
}
</style>
