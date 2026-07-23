<script setup>
import { ref, computed, onMounted } from 'vue'
import CameraScanner from '../components/CameraScanner.vue'
import PriceResult from '../components/PriceResult.vue'
import ExchangeRates from '../components/ExchangeRates.vue'
import { useOCR } from '../composables/useOCR'
import { useExchangeRate } from '../composables/useExchangeRate'

const targetCurrency = ref('USD')

const { price, loading: ocrLoading, scanImage } = useOCR()
const {
  rates,
  loading: ratesLoading,
  error: ratesError,
  fetchRates,
  convert,
} = useExchangeRate()

const convertedPrice = computed(() => {
  if (price.value == null) return null
  return convert(price.value, targetCurrency.value)
})

async function handleCapture(imageData) {
  await scanImage(imageData)
}

onMounted(fetchRates)
</script>

<template>
  <div class="home">
    <header class="home__header">
      <h1 class="home__title">Reales Converter</h1>
      <p class="home__subtitle">Escaneá un precio y convertilo al instante</p>
    </header>

    <main class="home__main">
      <CameraScanner @capture="handleCapture" />

      <PriceResult
        :original-price="price"
        :converted-price="convertedPrice"
        :currency="targetCurrency"
        :loading="ocrLoading"
      />

      <ExchangeRates
        :rates="rates"
        :loading="ratesLoading"
        :error="ratesError"
        @refresh="fetchRates"
      />
    </main>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.home__title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.home__subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.home__main {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>
