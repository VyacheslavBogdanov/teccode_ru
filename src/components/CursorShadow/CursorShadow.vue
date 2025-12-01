<template>
	<!-- Тень над всем сайтом -->
	<div
		v-if="visible"
		class="cursor-shadow"
		:style="{
			transform: `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`,
		}"
	></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const size = 40; // диаметр "тени" в пикселях

const x = ref(window.innerWidth / 2);
const y = ref(window.innerHeight / 2);
const targetX = ref(x.value);
const targetY = ref(y.value);
const visible = ref(false);

let rafId: number | null = null;

const handleMouseMove = (event: MouseEvent) => {
	targetX.value = event.clientX;
	targetY.value = event.clientY;
	visible.value = true;
};

const animate = () => {
	const ease = 0.15; // чем меньше, тем более плавно/инертно
	x.value += (targetX.value - x.value) * ease;
	y.value += (targetY.value - y.value) * ease;
	rafId = window.requestAnimationFrame(animate);
};

onMounted(() => {
	window.addEventListener('mousemove', handleMouseMove);
	rafId = window.requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
	window.removeEventListener('mousemove', handleMouseMove);
	if (rafId !== null) {
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
	pointer-events: none; // важно: чтобы не мешать кликам

	// стиль свечения в духе твоего сайта
	background: radial-gradient(circle, rgba(255, 60, 60, 0.4), rgba(0, 0, 0, 0));
	box-shadow:
		0 0 25px rgba(255, 60, 60, 0.6),
		0 0 80px rgba(255, 60, 60, 0.4);

	mix-blend-mode: screen;
	opacity: 0.85;
	z-index: 9999;
}
</style>
