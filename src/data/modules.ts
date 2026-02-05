import type { DocId } from './documents';

export type ModuleSlug =
	| 'fire-detector'
	| 'employee-docs'
	| 'rtsp-streaming'
	| 'video-transcoding'
	| 'electrical-safety-docs'
	| 'composite-video-channel'
	| 'audio-notifications'
	| 'retraining-courses'
	| 'system-services'
	| 'document-generation'
	| 'reports-generation'
	| 'template-generation'
	| 'scheduled-tasks'
	| 'target-classifier'
	| 'camera-sabotage-detector'
	| 'face-recognition'
	| 'lpr';

export interface ModuleItem {
	slug: ModuleSlug;
	icon: string;
	title: string;
}

export const MODULES: ModuleItem[] = [
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
	{ slug: 'audio-notifications', icon: '🔔', title: 'Программный модуль «Звуковые уведомления»' },
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
	{ slug: 'reports-generation', icon: '📊', title: 'Программный модуль «Формирование отчётов»' },
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
	{ slug: 'lpr', icon: '🚗', title: 'Программный модуль «Распознавание автомобильных номеров»' },
];

export const MODULES_BY_SLUG = Object.fromEntries(MODULES.map((m) => [m.slug, m])) as Record<
	ModuleSlug,
	ModuleItem
>;

// По умолчанию — полный набор документов для модулей (можешь сужать per-module)
export const DEFAULT_MODULE_DOC_IDS: DocId[] = [
	'source-storage',
	'install',
	'operation',
	'activation-requirements',
	'functional-specs',
	'lifecycle',
	'program-info',
	'architecture',
];
