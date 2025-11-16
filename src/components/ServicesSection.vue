<template>
	<section class="services">
		<div class="container">
			<h2>Направления деятельности</h2>
			<ul>
				<li v-for="service in services" :key="service.title">
					<h3>{{ service.title }}</h3>
					<ul>
						<li v-for="point in service.points" :key="point">- {{ point }}</li>
					</ul>
				</li>
			</ul>
		</div>
	</section>
</template>

<script setup lang="ts">
interface Service {
	title: string;
	points: string[];
}

const services: Service[] = [
	{
		title: 'Искусственный интеллект',
		points: [
			'Разработка модулей ИИ под специфику заказчика',
			'Интеграция с существующими системами',
			'НИОКР в области ML',
			'Внедрение open-source решений',
		],
	},
	{
		title: 'ПО для распределенных систем',
		points: [
			'Видеозахват и RTSP-потоки',
			'Распределённая обработка видео',
			'Передача событий между модулями',
		],
	},
	{
		title: 'Аутстаффинг разработчиков',
		points: ['Почасовая или долгосрочная аренда специалистов от 3000₽/час'],
	},
];
</script>

<style scoped lang="scss">
.services {
	padding: 4rem 1rem;
	color: #000;
	.container {
		max-width: 960px;
		margin: 0 auto;
	}
	h2 {
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	h3 {
		font-size: 1.25rem;
		margin-top: 1.5rem;
	}
	li {
		margin: 0.25rem 0;
	}
}
</style>
