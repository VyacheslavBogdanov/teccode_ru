<template>
	<section class="hero">
		<div class="hero__container">
			<div class="hero__column hero__column--left">
				<h2 class="hero__title">ИИ в системах безопасности</h2>
				<p class="hero__subtitle">
					Глубоко понимаем специфику внедрения искусственного интеллекта в системы
					безопасности объекта
				</p>
			</div>
			<div class="hero__divider"></div>
			<div class="hero__column hero__column--right">
				<p class="hero__subtitle">
					<b>ТехноКод</b> — инновационная ИТ-компания, специализирующаяся на внедрении
					решений в области искусственного интеллекта, заказной разработке программного
					обеспечения и аутсорсинге разработчиков. Мы предлагаем полный цикл услуг от
					аналитики и проектирования до сопровождения и масштабирования ИТ-продуктов.
				</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@keyframes fadeInLeft {
	0% {
		opacity: 0;
		transform: translateX(-30px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes fadeInRight {
	0% {
		opacity: 0;
		transform: translateX(30px);
	}
	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

.hero {
	padding: 10rem 1rem;
	position: relative;
	min-height: 90vh;
	color: #e0e0e0;
	background-image: url('../../assets/images/ai.png');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 45vw;

	&__container {
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
		align-items: center;

		@media (max-width: 767px) {
			grid-template-columns: 1fr;

			.hero__divider {
				display: none;
			}
		}
	}

	&__column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		animation-duration: 1s;
		animation-fill-mode: both;

		&--left {
			animation-name: fadeInLeft;
		}

		&--right {
			animation-name: fadeInRight;
		}
	}

	&__divider {
		width: 1px;
		height: 80%;
		background: rgba(255, 255, 255, 0.08);
		justify-self: center;
	}

	&__title {
		font-size: 3rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 11px;
		margin-bottom: 1.5rem;
		text-align: justify;
		text-shadow: 0 0 10px rgba(255, 60, 60, 0.3);

		@media (max-width: 767px) {
			font-size: 2.2rem;
			text-align: left;
		}
	}

	&__subtitle {
		text-align: justify;
		color: #ccc;
		line-height: 1.8;
		font-size: 1.05rem;

		@media (max-width: 767px) {
			font-size: 0.95rem;
		}

		b {
			color: #ff3c3c;
		}
	}
}
</style>
