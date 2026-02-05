<template>
	<section class="module" v-if="moduleItem">
		<div class="module__container">
			<p class="module__breadcrumb">Программные решения / {{ moduleItem.title }}</p>
			<h1 class="module__title">{{ moduleItem.title }}</h1>
			<p class="module__subtitle">
				Здесь будет подробное описание данного программного модуля, его функциональности,
				интеграций и вариантов внедрения. Сейчас это заглушка, чтобы настроить навигацию.
			</p>

			<RouterLink to="/contact-form" class="module__cta"> Запросить цену </RouterLink>

			<!-- Передаём в документы только нужный набор DocItem[] -->
			<ModuleDocuments :documents="documents" :moduleSlug="moduleItem.slug" />
		</div>
	</section>

	<section v-else class="module module--not-found">
		<div class="module__container">
			<h1 class="module__title">Модуль не найден</h1>
			<RouterLink to="/products" class="module__cta"> К списку модулей </RouterLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import ModuleDocuments from './ModuleDocuments.vue';
import { useMainStore } from '../../stores/main';
import type { DocItem } from '../../stores/main';

interface ModuleItem {
	slug: string;
	icon: string;
	title: string;
}

// тот же массив, что и в Products.vue (можешь позже вынести в общий файл)
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

const route = useRoute();
const mainStore = useMainStore();

const moduleDocumentIds: Record<string, string[]> = {
	'fire-detector': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'program-info',
	],
	'employee-docs': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'rtsp-streaming': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'video-transcoding': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'electrical-safety-docs': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'composite-video-channel': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'audio-notifications': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'retraining-courses': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'system-services': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'document-generation': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'reports-generation': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'template-generation': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'scheduled-tasks': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'functional-spec',
		'lifecycle-processes',
		'technical-architecture',
	],
	'target-classifier': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'program-info',
	],
	'camera-sabotage-detector': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'program-info',
	],
	'face-recognition': [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'program-info',
	],
	lpr: [
		'source-storage-description',
		'installation-manual',
		'operation-manual',
		'activation-hardware-description',
		'functional-spec',
		'lifecycle-processes',
		'program-info',
	],
};

const moduleItem = computed(() => modules.find((m) => m.slug === (route.params.slug as string)));

// превращаем ids в DocItem[] из стора
const documents = computed<DocItem[]>(() => {
	const slug = route.params.slug as string;
	const ids = moduleDocumentIds[slug] ?? [];

	return ids.map((id) => mainStore.getDocumentById(id)).filter((doc): doc is DocItem => !!doc);
});
</script>

<style scoped lang="scss">
@use '../../assets/styles/variables.scss' as *;

.module {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 900px;
		margin: 0 auto;
	}

	&__breadcrumb {
		font-size: 0.85rem;
		color: rgba($main-text-color, 0.6);
		margin-bottom: 0.75rem;
	}

	&__title {
		font-size: 2.1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 1.25rem;
	}

	&__subtitle {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.9);
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	&__cta {
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
}
</style>
