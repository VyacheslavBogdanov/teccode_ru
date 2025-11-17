<template>
	<section class="services" id="directions">
		<div class="services__container">
			<h2 class="services__title">Направления деятельности</h2>

			<div class="services__grid">
				<!-- Блок 1: Искусственный интеллект -->
				<article class="services__card">
					<h3 class="services__card-title">Искусственный интеллект</h3>
					<p class="services__card-intro">
						Мы создаем и внедряем интеллектуальные программные модули для повышения
						уровня безопасности объектов и автоматизации анализа видеопотока:
					</p>
					<ul class="services__list">
						<li>
							Разрабатываем программные модули ИИ для систем видеонаблюдения: детектор
							огня, распознавание лиц, детектор саботажа видеокамеры, распознавание
							автомобильных номеров, классификатор целей по изображению.
						</li>
						<li>
							Интегрируем ИИ-модули в существующие системы безопасности предприятий и
							инфраструктурных объектов.
						</li>
						<li>
							Проводим прикладные научно-исследовательские работы в области
							компьютерного зрения и машинного обучения.
						</li>
						<li>
							Постоянно изучаем и внедряем передовые open-source решения в сфере
							AI/ML.
						</li>
						<li>
							Анализируем запросы клиентов и предлагаем оптимальные алгоритмы на базе
							ИИ под специфические задачи.
						</li>
					</ul>
					<p class="services__note">
						Для расчета стоимости внедрения ИИ-модуля на вашем объекте — оставьте заявку
						через форму на сайте. Коммерческое предложение предоставляется
						индивидуально.
					</p>
				</article>

				<!-- Блок 2: ПО для распределенных систем безопасности -->
				<article class="services__card">
					<h3 class="services__card-title">ПО для распределенных систем безопасности</h3>
					<p class="services__card-intro">
						Мы создаем и внедряем программы, предназначенные для функционирования во
						внешних системах, входящих в состав комплексов, предназначенных для
						построения глобальных распределенных систем безопасности любого масштаба:
					</p>
					<ul class="services__list">
						<li>
							Модуль «Формирование композитного видеоканала» — выполняет функцию
							автоматического формирования композитного видеоканала с использованием
							видеопотоков, полученных из специального программного обеспечения.
						</li>
						<li>
							Модуль «Транскодирование видеопотока» — выполняет функцию
							автоматического преобразования видеопотока с использованием параметров,
							заданных в СПО.
						</li>
						<li>
							Модуль «Передача видеопотока по протоколу RTSP» — выполняет функции
							передачи запроса видеоданных от клиента к специальному программному
							обеспечению и передачи видеоданных по протоколу RTSP/RTP от специального
							программного обеспечения к клиенту.
						</li>
					</ul>
					<p class="services__tech">
						<span>Используемые технологии:</span> C++, SQLite, PostgreSQL.
					</p>
					<p class="services__note">
						Для расчета стоимости внедрения ПО — оставьте заявку через форму на сайте.
						Коммерческое предложение предоставляется индивидуально.
					</p>
				</article>

				<!-- Блок 3: Заказная разработка ПО -->
				<article class="services__card">
					<h3 class="services__card-title">Заказная разработка ПО</h3>
					<p class="services__card-intro">
						Мы разрабатываем кастомные программные решения под задачи заказчиков — от
						MVP до полноценных корпоративных систем:
					</p>
					<ul class="services__list">
						<li>Анализируем бизнес-задачи клиента и формируем техническое задание.</li>
						<li>Собираем команду разработчиков и проектируем архитектуру продукта.</li>
						<li>
							Используем современные технологии: Python, JavaScript, C++, Vue, React,
							Node.js, Express.js.
						</li>
						<li>
							Реализуем проект «под ключ» с учетом сроков, бюджета и потребностей
							заказчика.
						</li>
						<li>
							Примеры решений: корпоративные веб-приложения, модули аналитики,
							автоматизация документооборота, внутренние CRM- и ERP-системы.
						</li>
					</ul>
					<p class="services__note">
						Для расчета стоимости разработки ПО — оставьте заявку через форму на сайте.
						Коммерческое предложение предоставляется индивидуально.
					</p>
				</article>

				<!-- Блок 4: Аутстаффинг разработчиков -->
				<article class="services__card">
					<h3 class="services__card-title">Аутстаффинг разработчиков</h3>
					<p class="services__card-intro">
						Нужны специалисты на проект? Мы предоставим разработчиков с релевантным
						опытом для усиления вашей команды:
					</p>
					<ul class="services__list">
						<li>Подключение разработчиков в течение 1 рабочего дня.</li>
						<li>
							Поддержка технологий: Python, JavaScript, C++, Vue, React, Node.js,
							Express.js.
						</li>
						<li>
							Гибкие условия: от краткосрочного подключения до долгосрочного
							сотрудничества.
						</li>
						<li>Стоимость: от 3000 рублей в час при объеме от 160 часов в месяц.</li>
					</ul>
					<p class="services__note">
						Для расчета стоимости аутстаффинга — оставьте заявку через форму на сайте.
						Коммерческое предложение предоставляется индивидуально.
					</p>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
// логика тут не нужна, данные зашиты в разметку по заданию
</script>

<style scoped lang="scss">
@use '../assets/styles/variables.scss' as *;

.services {
	padding: 6rem 1rem;
	color: $main-text-color;

	&__container {
		max-width: 1200px;
		margin: 0 auto;
	}

	&__title {
		font-size: 2.2rem;
		font-weight: 700;
		margin-bottom: 3rem;
		text-align: left;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	&__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;

		@media (min-width: 960px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	&__card {
		position: relative;
		padding: 2rem;
		border-radius: 16px;
		background: rgba(0, 0, 0, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 1.5rem;
			bottom: 1.5rem;
			width: 3px;
			background: linear-gradient(180deg, $main-red-color, transparent);
			opacity: 0.9;
		}
	}

	&__card-title {
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	&__card-intro {
		font-size: 0.98rem;
		color: rgba($main-text-color, 0.9);
		margin-bottom: 1rem;
		line-height: 1.7;
	}

	&__list {
		list-style: none;
		margin: 0;
		padding-left: 0;
		font-size: 0.95rem;
		line-height: 1.7;

		li {
			position: relative;
			padding-left: 1.2rem;
			margin-bottom: 0.6rem;
			color: rgba($main-text-color, 0.9);

			&::before {
				content: '•';
				position: absolute;
				left: 0;
				top: 0;
				color: $main-red-color;
			}
		}
	}

	&__tech {
		margin-top: 1rem;
		font-size: 0.9rem;
		color: rgba($main-text-color, 0.8);

		span {
			font-weight: 600;
			color: $main-text-color;
		}
	}

	&__note {
		margin-top: 1.5rem;
		font-size: 0.9rem;
		color: rgba($main-text-color, 0.8);
		line-height: 1.6;
	}
}
</style>
