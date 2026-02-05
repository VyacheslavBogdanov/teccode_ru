<template>
	<section class="admin">
		<div class="admin__container">
			<header class="admin__header">
				<div class="admin__header-left">
					<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__brand">
						TECH <span class="admin__brand-sep">|</span> CODE
					</RouterLink>
					<h1 class="admin__title">Admin</h1>
				</div>
				<div class="admin__header-actions">
					<a :href="publicSiteHref" target="_blank" rel="noopener" class="admin__link">
						← На сайт
					</a>
					<button class="admin__logout" type="button" @click="onLogout">Выйти</button>
				</div>
			</header>

			<div class="admin__grid">
				<section class="admin__card ui-panel">
					<h2 class="admin__card-title">Добавить модуль</h2>
					<form class="admin__form" @submit.prevent="onCreate">
						<label class="admin__label">
							<span>Название</span>
							<input class="admin__input" v-model="createTitle" />
						</label>
						<label class="admin__label">
							<span>Добавить превью</span>
							<div class="admin__file">
								<input
									ref="createPreviewInput"
									id="createPreviewFile"
									class="admin__file-input"
									type="file"
									accept="image/*"
									@change="onCreatePreviewFile"
								/>
								<label class="admin__file-btn" for="createPreviewFile"
									>Выбрать файл</label
								>
								<span class="admin__file-name">{{
									createPreviewFileName || 'Файл не выбран'
								}}</span>
							</div>
							<span class="admin__hint">PNG/JPG/WebP, до 3 МБ</span>
							<div v-if="createPreview" class="admin__preview">
								<img
									v-if="isImagePreview(createPreview)"
									:src="createPreview"
									alt="Превью"
								/>
								<span v-else>{{ createPreview }}</span>
							</div>
						</label>
						<label class="admin__label">
							<span>Описание</span>
							<textarea
								class="admin__textarea"
								v-model="createDescription"
								rows="4"
							/>
						</label>
						<button class="ui-cta" type="submit" :disabled="creating">
							{{ creating ? 'Создаём…' : 'Создать' }}
						</button>
						<p v-if="createError" class="admin__error">{{ createError }}</p>
					</form>
				</section>

				<section class="admin__card ui-panel">
					<h2 class="admin__card-title">Модули</h2>
					<p v-if="loading" class="admin__muted">Загрузка…</p>
					<p v-else-if="!modules.length" class="admin__muted">Пока нет модулей</p>

					<ul v-else class="admin__list">
						<li v-for="m in modules" :key="m.id" class="admin__list-item">
							<div class="admin__module-preview">
								<img v-if="isImagePreview(m.preview)" :src="m.preview" alt="" />
								<span v-else>{{ m.preview }}</span>
							</div>
							<div class="admin__module-main">
								<div class="admin__module-title">{{ m.title }}</div>
								<div class="admin__module-meta">slug: {{ m.slug }}</div>
							</div>
							<div class="admin__module-actions">
								<RouterLink
									:to="{ name: ROUTES.adminModule.name, params: { id: m.id } }"
									class="admin__btn"
								>
									Редактировать
								</RouterLink>
								<button
									class="admin__btn admin__btn--danger"
									type="button"
									@click="onDelete(m.id)"
								>
									Удалить
								</button>
							</div>
						</li>
					</ul>
				</section>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { useAdminStore } from '@/admin/stores/admin';
import { adminApi } from '@/admin/api/admin';
import type { ModuleListItem } from '@/api/software';

const router = useRouter();
const store = useAdminStore();

function toErrorMessage(err: unknown, fallback: string) {
	if (err instanceof Error) return err.message || fallback;
	if (err && typeof err === 'object' && 'message' in err) {
		return String((err as { message?: unknown }).message ?? fallback);
	}
	return fallback;
}

const publicSiteHref = router.resolve(ROUTES.softwareSolutions.path).href;

const loading = ref(false);
const modules = ref<ModuleListItem[]>([]);

const createTitle = ref('');
const createPreview = ref('');
const createPreviewInput = ref<HTMLInputElement | null>(null);
const createPreviewFileName = ref('');
const createDescription = ref('');
const creating = ref(false);
const createError = ref('');

function isImagePreview(value: unknown): boolean {
	const v = String(value ?? '').trim();
	if (!v) return false;
	return (
		v.startsWith('data:image/') ||
		v.startsWith('http://') ||
		v.startsWith('https://') ||
		v.startsWith('/')
	);
}

function fileToDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ''));
		reader.onerror = () => reject(new Error('read_failed'));
		reader.readAsDataURL(file);
	});
}

async function onCreatePreviewFile(e: Event) {
	createError.value = '';
	const input = e.target as HTMLInputElement | null;
	const file = input?.files?.[0];
	if (!file) return;
	if (!file.type.startsWith('image/')) {
		createError.value = 'Выберите файл изображения';
		createPreviewFileName.value = '';
		if (input) input.value = '';
		return;
	}
	if (file.size > 3 * 1024 * 1024) {
		createError.value = 'Слишком большой файл (макс. 3 МБ)';
		createPreviewFileName.value = '';
		if (input) input.value = '';
		return;
	}
	createPreviewFileName.value = file.name;
	createPreview.value = await fileToDataUrl(file);
}

async function load() {
	loading.value = true;
	try {
		const { modules: m } = await adminApi.getModules(store.token);
		modules.value = m;
	} finally {
		loading.value = false;
	}
}

async function onCreate() {
	createError.value = '';
	if (!createPreview.value) {
		createError.value = 'Выберите изображение превью';
		return;
	}
	creating.value = true;
	try {
		await adminApi.createModule(
			{
				title: createTitle.value,
				preview: createPreview.value,
				description: createDescription.value,
			},
			store.token,
		);
		createTitle.value = '';
		createDescription.value = '';
		createPreview.value = '';
		createPreviewFileName.value = '';
		if (createPreviewInput.value) createPreviewInput.value.value = '';
		await load();
	} catch (e: unknown) {
		createError.value = toErrorMessage(e, 'Ошибка');
	} finally {
		creating.value = false;
	}
}

async function onDelete(id: string) {
	if (!confirm('Удалить модуль и все его документы?')) return;
	await adminApi.deleteModule(id, store.token);
	await load();
}

async function onLogout() {
	await store.logout();
	router.replace({ name: ROUTES.adminLogin.name });
}

onMounted(load);
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.admin {
	padding: 5rem 1rem;
	min-height: 100vh;
	color: #111827;
	background: transparent;

	:deep(.ui-panel) {
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 18px 45px rgba(17, 24, 39, 0.08);
	}

	:deep(.ui-cta) {
		border-color: $main-red-color;
		color: #111827;
		background: transparent;
		&:hover {
			background: $main-red-color;
			color: #ffffff;
			box-shadow: 0 0 0 4px rgba($main-red-color, 0.14);
		}
	}

	&__container {
		max-width: 1200px;
		margin: 0 auto;
	}

	&__header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	&__header-left {
		display: grid;
		gap: 0.35rem;
	}

	&__brand {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		font-weight: 900;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #111827;
		border-bottom: 1px solid transparent;
		width: fit-content;
		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.6);
		}
	}

	&__brand-sep {
		opacity: 0.6;
	}

	&__title {
		font-size: 1.8rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__header-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	&__link {
		color: rgba(17, 24, 39, 0.9);
		border-bottom: 1px solid transparent;
		&:hover {
			color: $main-red-color;
			border-bottom-color: rgba($main-red-color, 0.6);
		}
	}

	&__logout {
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.18);
		border-radius: 10px;
		padding: 0.55rem 0.9rem;
		color: #111827;
		cursor: pointer;
		&:hover {
			border-color: rgba($main-red-color, 0.6);
			color: $main-red-color;
		}
	}

	&__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;

		@media (min-width: 960px) {
			grid-template-columns: 420px 1fr;
		}
	}

	&__card {
		padding: 1.5rem;
	}

	&__card-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	&__form {
		display: grid;
		gap: 0.9rem;
	}

	&__label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.9rem;
		color: rgba(17, 24, 39, 0.9);
	}

	&__input,
	&__textarea {
		padding: 0.75rem 0.9rem;
		border-radius: 10px;
		border: 1px solid rgba(17, 24, 39, 0.18);
		background: #ffffff;
		color: #111827;
		outline: none;
		&:focus {
			border-color: rgba($main-red-color, 0.8);
			box-shadow: 0 0 0 4px rgba($main-red-color, 0.12);
		}

		&::placeholder {
			color: rgba(17, 24, 39, 0.45);
		}
	}

	&__hint {
		font-size: 0.8rem;
		color: rgba(17, 24, 39, 0.55);
	}

	&__file {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	&__file-input {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	&__file-btn {
		padding: 0.75rem 0.9rem;
		border-radius: 10px;
		border: 1px solid rgba(17, 24, 39, 0.18);
		background: #ffffff;
		color: #111827;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			color 0.2s ease;

		&:hover {
			border-color: rgba($main-red-color, 0.55);
			color: $main-red-color;
			box-shadow: 0 0 0 4px rgba($main-red-color, 0.1);
		}
	}

	&__file-name {
		font-size: 0.85rem;
		color: rgba(17, 24, 39, 0.6);
		max-width: 320px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__preview {
		margin-top: 0.55rem;
		width: 96px;
		height: 96px;
		border-radius: 14px;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: rgba(17, 24, 39, 0.03);
		overflow: hidden;
		display: grid;
		place-items: center;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	&__textarea {
		resize: vertical;
	}

	&__error {
		color: $main-red-color;
		font-size: 0.9rem;
	}

	&__muted {
		color: rgba(17, 24, 39, 0.65);
	}

	&__list {
		display: grid;
		gap: 0.75rem;
	}

	&__list-item {
		display: grid;
		grid-template-columns: 48px 1fr auto;
		gap: 1rem;
		align-items: center;
		padding: 0.9rem;
		border-radius: 12px;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 10px 24px rgba(17, 24, 39, 0.05);
	}

	&__module-preview {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: grid;
		place-items: center;
		border: 1px solid rgba(17, 24, 39, 0.12);
		font-size: 1.6rem;
		background: rgba(17, 24, 39, 0.03);

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	&__module-title {
		font-weight: 700;
		line-height: 1.3;
	}

	&__module-meta {
		font-size: 0.85rem;
		color: rgba(17, 24, 39, 0.55);
	}

	&__module-actions {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	&__btn {
		background: transparent;
		border: 1px solid rgba(17, 24, 39, 0.18);
		border-radius: 10px;
		padding: 0.5rem 0.75rem;
		color: #111827;
		cursor: pointer;
		font-size: 0.9rem;
		&:hover {
			border-color: rgba($main-red-color, 0.6);
			color: $main-red-color;
			background: rgba($main-red-color, 0.06);
		}
		&--danger:hover {
			border-color: rgba($main-red-color, 0.6);
			background: rgba($main-red-color, 0.12);
			color: $main-red-color;
		}
	}
}
</style>
