<template>
	<div
		v-if="visible"
		class="cursor-shadow"
		:style="{
			left: x + 'px',
			top: y + 'px',
		}"
	></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const x = ref(0);
const y = ref(0);
const targetX = ref(0);
const targetY = ref(0);
const visible = ref(false);

let rafId: number | null = null;

const handleMouseMove = (event: MouseEvent) => {
	targetX.value = event.clientX;
	targetY.value = event.clientY;
	visible.value = true;
};

const animate = () => {
	const ease = 0.12;
	x.value += (targetX.value - x.value) * ease;
	y.value += (targetY.value - y.value) * ease;
	rafId = window.requestAnimationFrame(animate);
};

onMounted(() => {
	if (typeof window === 'undefined') return;

	// стартуем примерно из центра
	x.value = window.innerWidth / 2;
	y.value = window.innerHeight / 2;
	targetX.value = x.value;
	targetY.value = y.value;

	window.addEventListener('mousemove', handleMouseMove);
	rafId = window.requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('mousemove', handleMouseMove);
	}
	if (rafId !== null && typeof window !== 'undefined') {
		window.cancelAnimationFrame(rafId);
	}
});
</script>

<style scoped lang="scss">
.cursor-shadow {
	position: fixed;
	top: 0;
	left: 0;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	pointer-events: none;

	transform: translate(-50%, -50%);

	background: radial-gradient(circle, rgba(255, 60, 60, 0.4), rgba(0, 0, 0, 0));

	mix-blend-mode: screen;
	opacity: 0.85;
	z-index: 9999;
}
</style>
