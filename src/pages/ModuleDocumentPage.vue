<template>
	<section class="doc-page" v-if="doc && moduleItem">
		<div class="doc-page__container">
			<p class="doc-page__breadcrumb">
				Программные решения / {{ moduleItem.title }} / {{ doc.title }}
			</p>

			<h1 class="doc-page__title">{{ doc.title }}</h1>
			<p class="doc-page__meta">Модуль: {{ moduleItem.title }}</p>

			<div class="doc-page__images" v-if="images.length">
				<figure v-for="(src, index) in images" :key="index" class="doc-page__image-wrapper">
					<img :src="src" :alt="`${doc.title} — страница ${index + 1}`" />
				</figure>
			</div>

			<p v-else class="doc-page__placeholder">
				Изображения для этого документа пока не добавлены.
			</p>
		</div>
	</section>

	<section v-else class="doc-page doc-page--not-found">
		<div class="doc-page__container">
			<h1 class="doc-page__title">Документ не найден</h1>
			<RouterLink to="/products" class="doc-page__back"> ← К списку модулей </RouterLink>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { useMainStore, type DocItem } from '@/stores/main';
import placeholderImg from '@/assets/images/ai.png';

interface ModuleItem {
	slug: string;
	icon: string;
	title: string;
}

// тот же список модулей, что в Modules.vue / Software.vue (можешь дописать остальные)
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

const moduleSlug = computed(() => route.params.slug as string);
const docId = computed(() => route.params.docId as string);

const moduleItem = computed<ModuleItem | undefined>(() =>
	modules.find((m) => m.slug === moduleSlug.value),
);

const doc = computed<DocItem | undefined>(() => mainStore.getDocumentById(docId.value));

// Заглушка: пока для любого документа показываем одну и ту же картинку
const images = computed<string[]>(() => (doc.value ? [placeholderImg] : []));
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.doc-page {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 960px;
		margin: 0 auto;
	}

	&__breadcrumb {
		font-size: 0.85rem;
		color: rgba($main-text-color, 0.6);
		margin-bottom: 0.75rem;
	}

	&__title {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.75rem;
	}

	&__meta {
		font-size: 0.9rem;
		color: rgba($main-text-color, 0.7);
		margin-bottom: 2rem;
	}

	&__images {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	&__image-wrapper {
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7);
		background: rgba(0, 0, 0, 0.4);

		img {
			display: block;
			width: 100%;
			height: auto;
		}
	}

	&__placeholder {
		font-size: 0.95rem;
		color: rgba($main-text-color, 0.8);
	}

	&__back {
		display: inline-flex;
		margin-top: 1.5rem;
		font-size: 0.9rem;
		color: $main-text-color;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.7);
		}
	}
}
</style>
