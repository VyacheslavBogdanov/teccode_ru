<template>
	<section class="products" id="products">
		<div class="products__container">
			<header class="products__header">
				<h2 class="products__title">Программные решения</h2>
				<p class="products__subtitle">
					Наша команда разработала ряд программных модулей в виде standalone-решений с
					богатым API для интеграции в системы безопасности.
				</p>

				<RouterLink to="/contact-form" class="products__cta"> Запросить цену </RouterLink>
			</header>

			<div class="products__grid">
				<RouterLink
					v-for="(moduleItem, index) in modules"
					:key="moduleItem.slug"
					class="products__card"
					:to="{ name: 'ProductModule', params: { slug: moduleItem.slug } }"
					:style="{ animationDelay: `${0.05 * index}s` }"
				>
					<div class="products__icon" aria-hidden="true">
						{{ moduleItem.icon }}
					</div>
					<p class="products__name">
						{{ moduleItem.title }}
					</p>
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface ModuleItem {
	slug: string;
	icon: string;
	title: string;
}

const modules: ModuleItem[] = [
	{ slug: 'fire-detector', icon: '🔥', title: 'Программный модуль «Детектор огня»' },
	{
		slug: 'employee-docs',
		icon: '📒',
		title: 'Программный модуль «Справочник документов сотрудника»',
	},
	{
		slug: 'rtsp-streaming',
		icon: '📹',
		title: 'Программный модуль «Передача видеопотока по протоколу RTSP»',
	},
	{
		slug: 'video-transcoding',
		icon: '⏯️',
		title: 'Программный модуль «Транскодирование видеопотока»',
	},
	{
		slug: 'electrical-safety-docs',
		icon: '📘',
		title: 'Программный модуль «Справочник документов по электробезопасности»',
	},
	{
		slug: 'composite-video-channel',
		icon: '🎞️',
		title: 'Программный модуль «Формирование композитного видеоканала»',
	},
	{
		slug: 'audio-notifications',
		icon: '🔔',
		title: 'Программный модуль «Звуковые уведомления»',
	},
	{
		slug: 'retraining-courses',
		icon: '📚',
		title: 'Программный модуль «Справочник курсов переподготовки»',
	},
	{
		slug: 'system-services',
		icon: '🛡️',
		title: 'Программный модуль «Системные сервисы и службы»',
	},
	{
		slug: 'document-generation',
		icon: '📄',
		title: 'Программный модуль «Формирование документов»',
	},
	{
		slug: 'reports-generation',
		icon: '📊',
		title: 'Программный модуль «Формирование отчётов»',
	},
	{
		slug: 'template-generation',
		icon: '🗂️',
		title: 'Программный модуль «Формирование шаблонов документов»',
	},
	{
		slug: 'scheduled-tasks',
		icon: '⏱️',
		title: 'Программный модуль «Формирование периодических задач»',
	},
	{
		slug: 'target-classifier',
		icon: '🎯',
		title: 'Программный модуль «Классификатор целей по видеоизображению»',
	},
	{
		slug: 'camera-sabotage-detector',
		icon: '📡',
		title: 'Программный модуль «Детектор саботажа видеокамеры»',
	},
	{
		slug: 'face-recognition',
		icon: '👤',
		title: 'Программный модуль «Потоковое распознавание лиц»',
	},
	{
		slug: 'lpr',
		icon: '🚗',
		title: 'Программный модуль «Распознавание автомобильных номеров»',
	},
];
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

@keyframes productsFadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.products {
	padding: 6rem 1rem 7rem;
	color: $main-text-color;
	text-align: center;

	&__container {
		max-width: 1200px;
		margin: 0 auto;
	}

	&__header {
		max-width: 720px;
		margin: 0 auto 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	&__title {
		font-size: 2.2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.25rem;
	}

	&__subtitle {
		font-size: 0.95rem;
		color: rgba($main-text-color, 0.85);
		line-height: 1.7;
	}

	&__cta {
		margin-top: 0.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.8rem;
		border-radius: 999px;
		border: 2px solid $main-red-color;
		background: transparent;
		color: $main-text-color;
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
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

	&__grid {
		margin-top: 2.5rem;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2.5rem 3rem;

		@media (min-width: 768px) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		@media (min-width: 1100px) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	&__card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.75rem 1rem 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
		opacity: 0;
		animation: productsFadeInUp 0.7s ease forwards;
		transition:
			transform 0.15s ease-out,
			box-shadow 0.15s ease-out,
			border-color 0.15s ease-out;
		text-decoration: none;
		color: inherit;
		cursor: pointer;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 22px 55px rgba(0, 0, 0, 0.8);
			border-color: rgba($main-red-color, 0.7);
		}
	}

	&__icon {
		font-size: 2.7rem;
		line-height: 1;
	}

	&__name {
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.4;
		color: rgba($main-text-color, 0.95);
	}
}
</style>
