<script setup>
defineProps({
  originalPrice: {
    type: Number,
    default: null,
  },
  convertedPrice: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="price-result card">
    <h2 class="card__title">Resultado</h2>

    <p v-if="loading" class="price-result__loading">Convirtiendo...</p>

    <template v-else-if="originalPrice != null">
      <p class="price-result__original">R$ {{ originalPrice.toFixed(2) }}</p>
      <p v-if="convertedPrice != null" class="price-result__converted">
        {{ currency }} {{ convertedPrice.toFixed(2) }}
      </p>
      <p v-else class="price-result__empty">Sin cotización disponible</p>
    </template>

    <p v-else class="price-result__empty">Escaneá un precio para ver la conversión</p>
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
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-success);
  letter-spacing: -0.03em;
  margin-top: var(--space-xs);
  font-variant-numeric: tabular-nums;
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
