<script setup>
defineProps({
  originalPrice: {
    type: Number,
    default: null,
  },
  convertedPrices: {
    type: Object,
    default: () => ({
      ARS: null,
      USD: null,
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: 'Ingresá un importe para ver la conversión',
  },
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(amount) {
  return numberFormatter.format(amount)
}
</script>

<template>
  <section class="price-result card">
    <h2 class="card__title">Resultado</h2>

    <p v-if="loading" class="price-result__loading">Convirtiendo...</p>

    <template v-else-if="originalPrice != null">
      <p class="price-result__original">R$ {{ originalPrice.toFixed(2) }}</p>
      <div v-if="convertedPrices.ARS != null || convertedPrices.USD != null" class="price-result__conversions">
        <p v-if="convertedPrices.ARS != null" class="price-result__converted">
          <span class="price-result__currency">ARS</span>
          {{ formatAmount(convertedPrices.ARS) }}
        </p>
        <p v-if="convertedPrices.USD != null" class="price-result__converted">
          <span class="price-result__currency">USD</span>
          {{ formatAmount(convertedPrices.USD) }}
        </p>
      </div>
      <p v-else class="price-result__empty">Sin cotización disponible</p>
    </template>

    <p v-else class="price-result__empty">{{ emptyMessage }}</p>
  </section>
</template>

<style scoped>
.price-result {
  text-align: center;
  padding-top: var(--space-xl);
  padding-bottom: var(--space-xl);
}

.price-result__original {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.price-result__converted {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-success);
  letter-spacing: -0.03em;
  margin-top: var(--space-xs);
  font-variant-numeric: tabular-nums;
}

.price-result__conversions {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.price-result__conversions .price-result__converted {
  margin-top: 0;
}

.price-result__currency {
  display: inline-block;
  min-width: 3rem;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  vertical-align: middle;
}

.price-result__empty {
  color: var(--color-text-subtle);
  font-size: 0.9375rem;
}

.price-result__loading {
  color: var(--color-text-muted);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
