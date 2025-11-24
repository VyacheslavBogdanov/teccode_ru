<template>
	<section class="docs">
		<div class="docs__container">
			<div v-for="doc in documents" :key="doc.title" class="docs__item">
				<span class="docs__icon" aria-hidden="true">PDF</span>
				<span class="docs__title">{{ doc.title }}</span>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
interface DocItem {
	title: string;
}

const documents: DocItem[] = [
	{
		title: 'Описание технических средств хранения исходного текста и объектного кода',
	},
	{
		title: 'Инструкция по установке',
	},
	{
		title: 'Инструкция по эксплуатации',
	},
	{
		title: 'Описание технических средств необходимых для активации',
	},
	{
		title: 'Описание функциональных характеристик',
	},
	{
		title: 'Процессы жизненного цикла',
	},
	{
		title: 'Сведения о программе',
	},
];
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.docs {
	margin-top: 3rem;

	&__container {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem 3.5rem;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
		}
	}

	&__item {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		color: rgba($main-text-color, 0.9);
	}

	&__icon {
		width: 56px;
		height: 76px;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.35);
		border: 2px solid rgba(255, 255, 255, 0.9);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: $main-red-color;
		position: relative;
		overflow: hidden;
		padding-bottom: 0.35rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);

		/* загнутый угол листа */
		&::before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			width: 18px;
			height: 18px;
			border-top: 2px solid rgba(255, 255, 255, 0.9);
			border-left: 2px solid rgba(255, 255, 255, 0.9);
			transform: translate(8px, -8px) rotate(45deg);
			background: rgba(0, 0, 0, 0.9);
		}

		/* тонкая линия как «заголовок» документа */
		&::after {
			content: '';
			position: absolute;
			top: 20px;
			left: 10px;
			right: 10px;
			height: 2px;
			background: rgba(255, 255, 255, 0.35);
		}
	}

	&__title {
		font-size: 1rem;
		line-height: 1.6;
		text-align: left;
	}
}
</style>
