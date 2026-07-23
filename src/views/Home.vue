<script setup>
import { ref, computed, onMounted } from 'vue'
import CameraScanner from '../components/CameraScanner.vue'
import ManualPriceInput from '../components/ManualPriceInput.vue'
import PriceResult from '../components/PriceResult.vue'
import ExchangeRates from '../components/ExchangeRates.vue'
import { useOCR } from '../composables/useOCR'
import { useExchangeRate } from '../composables/useExchangeRate'

const entryMode = ref('manual')
const manualAmount = ref('')

const { price, loading: ocrLoading, scanImage } = useOCR()
const {
  rates,
  loading: ratesLoading,
  error: ratesError,
  fetchRates,
  convert,
} = useExchangeRate()

const enteredPrice = computed(() => {
  if (entryMode.value === 'camera') return price.value

  const normalizedAmount = manualAmount.value.trim().replace(',', '.')
  const amount = Number(normalizedAmount)
  return normalizedAmount && Number.isFinite(amount) && amount >= 0 ? amount : null
})

const convertedPrices = computed(() => {
  if (enteredPrice.value == null) {
    return {
      ARS: null,
      USD: null,
    }
  }

  return {
    ARS: convert(enteredPrice.value, 'ARS'),
    USD: convert(enteredPrice.value, 'USD'),
  }
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
      <section class="entry-mode" aria-label="Método para ingresar el importe">
        <button
          type="button"
          class="entry-mode__button"
          :class="{ 'entry-mode__button--active': entryMode === 'manual' }"
          :aria-pressed="entryMode === 'manual'"
          @click="entryMode = 'manual'"
        >
          Ingresar importe
        </button>
        <button
          type="button"
          class="entry-mode__button"
          :class="{ 'entry-mode__button--active': entryMode === 'camera' }"
          :aria-pressed="entryMode === 'camera'"
          @click="entryMode = 'camera'"
        >
          Usar cámara
        </button>
      </section>

      <ManualPriceInput v-if="entryMode === 'manual'" v-model="manualAmount" />
      <CameraScanner v-else @capture="handleCapture" />

      <PriceResult
        :original-price="enteredPrice"
        :converted-prices="convertedPrices"
        :loading="entryMode === 'camera' && ocrLoading"
        :empty-message="entryMode === 'camera' ? 'Escaneá un precio para ver la conversión' : 'Ingresá un importe para ver la conversión'"
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

.entry-mode {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xs);
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.entry-mode__button {
  min-height: var(--touch-min);
  padding: var(--space-sm);
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, transform 0.1s;
}

.entry-mode__button--active {
  background: var(--color-primary);
  color: #fff;
}

.entry-mode__button:active {
  transform: scale(0.98);
}
</style>
