<template>
	<footer class="footer">
		<div class="container">
			<p>&copy; {{ year }} ООО "ТехноКод"</p>
			<p>info@teccode.ru &mdash; г. Москва</p>
		</div>
	</footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped lang="scss">
.footer {
	color: #888;
	padding: 3rem 1rem;
	font-size: 0.875rem;
	text-align: center;
	.container {
		max-width: 960px;
		margin: 0 auto;
		line-height: 1.6;
	}
}
</style>
