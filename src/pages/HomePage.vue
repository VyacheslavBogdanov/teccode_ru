<template>
	<main>
		<HeroSection />
		<!-- <ServicesSection /> -->
		<!-- <ProductsSection /> -->
		<!-- <ContactForm /> -->
	</main>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import ServicesSection from '@/components/ServicesSection.vue';
import ProductsSection from '@/components/ProductsSection.vue';
import ContactForm from '@/components/ContactForm.vue';
</script>

<style scoped>
main {
	display: flex;
	flex-direction: column;
}
</style>
