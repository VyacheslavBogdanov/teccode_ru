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
					<b>Технокод</b> — инновационная ИТ-компания, специализирующаяся на внедрении
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
.hero {
	padding: 10rem 1rem;
	position: relative;
	min-height: 90vh;
	color: #e0e0e0;

	background-image: url('../../assets/images/ai.png');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 1000px auto;

	
	@media (max-height: 1020px), (max-width: 840px) {
		background-size: 700px auto;
	}

	@media (max-width: 500px) {
		padding: 7.5rem 1rem;
		background-size: 550px auto;
		background-position: center 92%;
	}

	&__container {
		display: grid;
		grid-template-columns: 1fr 1px 1fr;
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
		align-items: center;

		@media (max-width: 1240px) {
			max-width: 1000px;
			gap: 2.5rem;
		}

		@media (max-width: 930px) {
			grid-template-columns: 1fr;
			justify-items: center;
			gap: 2rem;
		}

		@media (max-width: 500px) {
			gap: 1.5rem;
		}
	}

	&__column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		animation-duration: 1s;
		animation-fill-mode: both;

		@media (max-width: 1240px) {
			max-width: 820px;
			width: 100%;
		}

		@media (max-width: 930px) {
			max-width: 720px;
			align-items: center;
		}

		@media (max-width: 500px) {
			align-items: flex-start;
		}

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

		@media (max-width: 930px) {
			width: 80%;
			height: 1px;
			margin: 2rem auto;
		}

		@media (max-width: 500px) {
			width: 90%;
			margin: 1.25rem auto;
		}
	}

	&__title {
		font-size: 3rem;
		font-weight: 700;
		text-transform: uppercase;
		margin-bottom: 1.5rem;

		
		text-align: left;
		letter-spacing: 0.08em;
		word-spacing: normal;

		text-shadow: 0 0 10px rgba(255, 60, 60, 0.3);

		@media (max-width: 1240px) {
			font-size: 2.6rem;
			letter-spacing: 0.06em;
		}

		@media (max-width: 930px) {
			font-size: 2.2rem;
			letter-spacing: 0.05em;
			text-align: center;
		}

		@media (max-width: 500px) {
			font-size: 1.8rem;
			letter-spacing: 0.04em;
			margin-bottom: 1.1rem;
			text-align: left;
		}
	}

	&__subtitle {
		text-align: justify;
		color: #ccc;
		line-height: 1.8;
		font-size: 1.05rem;

		@media (max-width: 1240px) {
			font-size: 1rem;
		}

		@media (max-width: 930px) {
			font-size: 0.96rem;
		}

		@media (max-width: 500px) {
			font-size: 0.9rem;
			text-align: left;
		}

		b {
			color: #ff3c3c;
		}
	}
}
</style>
