<template>
	<section class="admin">
		<div class="admin__container">
			<header class="admin__header">
				<div class="admin__header-left">
					<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__brand">
						TECH <span class="admin__brand-sep">|</span> CODE
					</RouterLink>
					<RouterLink :to="{ name: ROUTES.admin.name }" class="admin__link">
						← Назад
					</RouterLink>
					<h1 class="admin__title">Редактирование модуля</h1>
				</div>
				<div class="admin__header-actions">
					<a
						v-if="moduleItem"
						:href="publicModuleHref"
						target="_blank"
						rel="noopener"
						class="admin__link"
					>
						Открыть на сайте
					</a>
					<button class="admin__logout" type="button" @click="onLogout">Выйти</button>
				</div>
			</header>

		<p v-if="loading" class="admin__muted">Загрузка…</p>
		<p v-else-if="!moduleItem" class="admin__muted">Модуль не найден</p>

		<div v-else class="admin__grid">
			<section class="admin__card ui-panel">
				<h2 class="admin__card-title">Параметры</h2>
				<form class="admin__form" @submit.prevent="onSave">
					<label class="admin__label">
						<span>Название</span>
						<input class="admin__input" v-model="editTitle" />
					</label>
					<label class="admin__label">
						<span>Добавить превью</span>
						<div class="admin__file">
							<input
								ref="editPreviewInput"
								id="editPreviewFile"
								class="admin__file-input"
								type="file"
								accept="image/*"
								@change="onEditPreviewFile"
							/>
							<label class="admin__file-btn" for="editPreviewFile">Выбрать файл</label>
							<span class="admin__file-name">{{ editPreviewFileLabel }}</span>
						</div>
						<span class="admin__hint">PNG/JPG/WebP, до 3 МБ</span>
						<div v-if="editPreview" class="admin__preview">
							<img v-if="isImagePreview(editPreview)" :src="editPreview" alt="Превью" />
							<span v-else>{{ editPreview }}</span>
						</div>
					</label>
					<label class="admin__label">
						<span>Описание</span>
						<textarea class="admin__textarea" rows="7" v-model="editDescription" />
					</label>
					<button class="ui-cta" type="submit" :disabled="saving">
						{{ saving ? 'Сохраняем…' : 'Сохранить' }}
					</button>
					<p v-if="saveOk" class="admin__ok">{{ saveOk }}</p>
					<p v-if="saveError" class="admin__error">{{ saveError }}</p>
				</form>
			</section>

			<section class="admin__card ui-panel">
				<h2 class="admin__card-title">Документы</h2>

				<form class="admin__form admin__form--inline" @submit.prevent="onCreateDoc">
					<input
						class="admin__input"
						v-model="newDocTitle"
						placeholder="Название документа"
						:disabled="saving || creatingDoc"
					/>
					<button class="admin__btn" type="submit" :disabled="creatingDoc || saving">Добавить</button>
				</form>
				<p v-if="docError" class="admin__error">{{ docError }}</p>

				<ul v-if="moduleItem.documents.length" class="admin__list">
					<li v-for="d in moduleItem.documents" :key="d.id" class="admin__list-item">
						<div class="admin__module-main">
							<div class="admin__module-title">{{ d.title }}</div>
							<div class="admin__module-meta">id: {{ d.id }}</div>
						</div>
						<div class="admin__module-actions">
							<a
								:href="publicDocHref(d.id)"
								target="_blank"
								rel="noopener"
								class="admin__btn"
								:class="{ 'admin__btn--disabled': saving }"
							>
								На сайте
							</a>
							<button class="admin__btn" type="button" @click="onEditDoc(d.id)" :disabled="saving">
								Редактировать
							</button>
							<button
								class="admin__btn admin__btn--danger"
								type="button"
								@click="onDeleteDoc(d.id)"
								:disabled="saving"
							>
								Удалить
							</button>
						</div>
					</li>
				</ul>
				<p v-else class="admin__muted">Документов пока нет</p>

				<div v-if="editingDoc" class="admin__editor" :class="{ 'admin__editor--disabled': saving }">
					<h3 class="admin__card-title">Редактирование документа</h3>
					<label class="admin__label">
						<span>Название</span>
						<input class="admin__input" v-model="editingDocTitle" :disabled="saving || savingDoc" />
					</label>
					<label class="admin__label">
						<span>Текст</span>
						<textarea
							ref="docTextarea"
							class="admin__textarea"
							rows="10"
							v-model="editingDocContent"
							:disabled="saving || savingDoc"
						/>
					</label>
					<label class="admin__label">
						<span>Изображение</span>
						<div class="admin__file">
							<input
								ref="docImageInput"
								id="docImageFile"
								class="admin__file-input"
								type="file"
								accept="image/*"
								:disabled="uploadingImage || saving || savingDoc"
								@change="onDocImageFile"
							/>
							<label
								class="admin__file-btn"
								:class="{ 'admin__file-btn--disabled': uploadingImage }"
								for="docImageFile"
							>
								Выбрать изображение
							</label>
							<span class="admin__file-name">{{ docImageFileName || 'Файл не выбран' }}</span>
						</div>
						<span class="admin__hint">PNG/JPG/WebP/GIF, до 3 МБ. Вставится в позицию курсора.</span>
						<p v-if="uploadError" class="admin__error">{{ uploadError }}</p>
					</label>
					<div class="admin__editor-actions">
						<button class="ui-cta" type="button" @click="onSaveDoc" :disabled="savingDoc || saving">
							{{ savingDoc ? 'Сохраняем…' : 'Сохранить документ' }}
						</button>
						<button class="admin__btn" type="button" @click="onCancelDoc">Закрыть</button>
					</div>
					<p v-if="docSaveError" class="admin__error">{{ docSaveError }}</p>
				</div>
			</section>
		</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ROUTES } from '@/router/routes';
import { useAdminStore } from '@/admin/stores/admin';
import { adminApi } from '@/admin/api/admin';
import { softwareApi, type DocumentItem, type ModuleDetail } from '@/api/software';

const route = useRoute();
const router = useRouter();
const store = useAdminStore();

const moduleId = computed(() => String(route.params.id ?? ''));

const loading = ref(false);
const moduleItem = ref<ModuleDetail | null>(null);

const editTitle = ref('');
const editPreview = ref('');
const editPreviewInput = ref<HTMLInputElement | null>(null);
const editPreviewFileName = ref('');
const previewDirty = ref(false);
const editDescription = ref('');
const saving = ref(false);
const saveError = ref('');
const saveOk = ref('');
let saveOkTimer: ReturnType<typeof setTimeout> | null = null;

const editPreviewFileLabel = computed(() => {
	if (editPreviewFileName.value) return editPreviewFileName.value;
	if (!previewDirty.value && editPreview.value) return 'Превью уже загружено';
	return 'Файл не выбран';
});

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

async function onEditPreviewFile(e: Event) {
	saveError.value = '';
	const input = e.target as HTMLInputElement | null;
	const file = input?.files?.[0];
	if (!file) return;
	if (!file.type.startsWith('image/')) {
		saveError.value = 'Выберите файл изображения';
		editPreviewFileName.value = '';
		if (input) input.value = '';
		return;
	}
	if (file.size > 3 * 1024 * 1024) {
		saveError.value = 'Слишком большой файл (макс. 3 МБ)';
		editPreviewFileName.value = '';
		if (input) input.value = '';
		return;
	}
	editPreviewFileName.value = file.name;
	editPreview.value = await fileToDataUrl(file);
	previewDirty.value = true;
}

const newDocTitle = ref('');
const creatingDoc = ref(false);
const docError = ref('');

const editingDoc = ref<DocumentItem | null>(null);
const editingDocTitle = ref('');
const editingDocContent = ref('');
const savingDoc = ref(false);
const docSaveError = ref('');

const publicModuleHref = computed(() => {
	if (!moduleItem.value) return '#';
	return router.resolve({ name: ROUTES.module.name, params: { slug: moduleItem.value.slug } }).href;
});

function publicDocHref(docId: string) {
	if (!moduleItem.value) return '#';
	return router.resolve({ name: ROUTES.moduleDoc.name, params: { slug: moduleItem.value.slug, docId } }).href;
}

const docTextarea = ref<HTMLTextAreaElement | null>(null);
const docImageInput = ref<HTMLInputElement | null>(null);
const docImageFileName = ref('');
const uploadingImage = ref(false);
const uploadError = ref('');

function insertIntoDoc(snippet: string) {
	const el = docTextarea.value;
	const current = editingDocContent.value ?? '';
	if (!el) {
		editingDocContent.value = `${current}\n${snippet}\n`.trimStart();
		return;
	}
	const start = Number.isFinite(el.selectionStart) ? el.selectionStart : current.length;
	const end = Number.isFinite(el.selectionEnd) ? el.selectionEnd : current.length;
	const before = current.slice(0, start);
	const after = current.slice(end);
	const insertion = `${snippet}\n`;
	editingDocContent.value = `${before}${insertion}${after}`;
	nextTick(() => {
		try {
			el.focus();
			const pos = before.length + insertion.length;
			el.setSelectionRange(pos, pos);
		} catch {
		}
	});
}

async function onDocImageFile(e: Event) {
	uploadError.value = '';
	const input = e.target as HTMLInputElement | null;
	const file = input?.files?.[0];
	if (!file) return;

	if (!file.type.startsWith('image/')) {
		uploadError.value = 'Выберите файл изображения';
		docImageFileName.value = '';
		if (input) input.value = '';
		return;
	}
	if (file.size > 3 * 1024 * 1024) {
		uploadError.value = 'Слишком большой файл (макс. 3 МБ)';
		docImageFileName.value = '';
		if (input) input.value = '';
		return;
	}

	uploadingImage.value = true;
	try {
		docImageFileName.value = file.name;
		const dataUrl = await fileToDataUrl(file);
		const { url } = await adminApi.uploadImage(dataUrl, store.token);
		insertIntoDoc(`![](${url})`);
		docImageFileName.value = '';
		if (docImageInput.value) docImageInput.value.value = '';
		if (input) input.value = '';
	} catch (err: any) {
		const msg = String(err?.message ?? 'Ошибка загрузки');
		if (msg.includes('404')) {
			uploadError.value = 'Не найден маршрут загрузки (404). Проверь что backend запущен и обновлён.';
		} else {
			uploadError.value = msg;
		}
	} finally {
		uploadingImage.value = false;
	}
}

async function load() {
	loading.value = true;
	moduleItem.value = null;
	saveOk.value = '';
	try {
		const { module } = await adminApi.getModule(moduleId.value, store.token);
		moduleItem.value = module;
		editTitle.value = module.title;
		editPreview.value = module.preview;
		editDescription.value = module.description;
		previewDirty.value = false;
		editPreviewFileName.value = '';
		if (editPreviewInput.value) editPreviewInput.value.value = '';
	} catch {
		moduleItem.value = null;
	} finally {
		loading.value = false;
	}
}

async function onSave() {
	if (!moduleItem.value) return;
	saveError.value = '';
	saveOk.value = '';
	if (saveOkTimer) {
		clearTimeout(saveOkTimer);
		saveOkTimer = null;
	}
	if (previewDirty.value && !editPreview.value) {
		saveError.value = 'Выберите изображение превью';
		return;
	}
	saving.value = true;
	try {
		const payload: { title?: string; description?: string; preview?: string } = {
			title: editTitle.value,
			description: editDescription.value,
		};
		if (previewDirty.value) payload.preview = editPreview.value;
		const { module } = await adminApi.updateModule(
			moduleItem.value.id,
			payload,
			store.token,
		);
		moduleItem.value = module;
		previewDirty.value = false;
		editPreviewFileName.value = '';
		if (editPreviewInput.value) editPreviewInput.value.value = '';
		saveOk.value = 'Сохранено';
		saveOkTimer = setTimeout(() => {
			saveOk.value = '';
			saveOkTimer = null;
		}, 2000);
	} catch (e: any) {
		saveError.value = e?.message ?? 'Ошибка';
	} finally {
		saving.value = false;
	}
}

async function onCreateDoc() {
	if (!moduleItem.value) return;
	docError.value = '';
	creatingDoc.value = true;
	try {
		await adminApi.createDocument(
			moduleItem.value.id,
			{ title: newDocTitle.value, content: '' },
			store.token,
		);
		newDocTitle.value = '';
		await load();
	} catch (e: any) {
		docError.value = e?.message ?? 'Ошибка';
	} finally {
		creatingDoc.value = false;
	}
}

async function onEditDoc(docId: string) {
	docError.value = '';
	docSaveError.value = '';
	try {
		const { document } = await softwareApi.getDocument(docId);
		editingDoc.value = document;
		editingDocTitle.value = document.title;
		editingDocContent.value = document.content;
	} catch {
		docError.value = 'Не удалось загрузить документ';
	}
}

async function onSaveDoc() {
	if (!editingDoc.value) return;
	docSaveError.value = '';
	savingDoc.value = true;
	try {
		await adminApi.updateDocument(
			editingDoc.value.id,
			{ title: editingDocTitle.value, content: editingDocContent.value },
			store.token,
		);
		editingDoc.value = null;
		await load();
	} catch (e: any) {
		docSaveError.value = e?.message ?? 'Ошибка сохранения';
	} finally {
		savingDoc.value = false;
	}
}

function onCancelDoc() {
	editingDoc.value = null;
	editingDocTitle.value = '';
	editingDocContent.value = '';
	uploadError.value = '';
	docSaveError.value = '';
	docImageFileName.value = '';
	if (docImageInput.value) docImageInput.value.value = '';
}

async function onDeleteDoc(id: string) {
	if (!confirm('Удалить документ?')) return;
	await adminApi.deleteDocument(id, store.token);
	if (editingDoc.value?.id === id) editingDoc.value = null;
	await load();
}

async function onLogout() {
	await store.logout();
	router.replace({ name: ROUTES.adminLogin.name });
}

onMounted(load);
watch(moduleId, load);
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
		margin-top: 0.5rem;
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
		grid-template-columns: 420px 1fr;
		gap: 1.5rem;

		@media (max-width: 960px) {
			grid-template-columns: 1fr;
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
		&--inline {
			grid-template-columns: 1fr auto;
			align-items: end;
		}
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

	&__file-btn--disabled {
		opacity: 0.6;
		pointer-events: none;
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
		width: 120px;
		height: 120px;
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

	&__list {
		margin-top: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	&__list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.9rem;
		border-radius: 12px;
		border: 1px solid rgba(17, 24, 39, 0.12);
		background: #ffffff;
		box-shadow: 0 10px 24px rgba(17, 24, 39, 0.05);
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

	&__btn--disabled {
		opacity: 0.6;
		pointer-events: none;
	}

	&__editor {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid rgba(17, 24, 39, 0.12);
		display: grid;
		gap: 0.9rem;
	}

	&__editor--disabled {
		opacity: 0.6;
		pointer-events: none;
	}



	&__editor-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: center;
	}

	&__muted {
		color: rgba(17, 24, 39, 0.65);
	}

	&__error {
		color: $main-red-color;
		font-size: 0.9rem;
	}

	&__ok {
		color: rgba(17, 24, 39, 0.85);
		font-size: 0.9rem;
	}
}
</style>
