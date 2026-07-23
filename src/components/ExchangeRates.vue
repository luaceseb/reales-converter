<script setup>
defineProps({
  rates: {
    type: Object,
    default: () => ({}),
  },
  baseCurrency: {
    type: String,
    default: 'BRL',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})

defineEmits(['refresh'])
</script>

<template>
  <section class="exchange-rates card">
    <header class="exchange-rates__header">
      <h2 class="card__title exchange-rates__title">Cotizaciones</h2>
      <span class="exchange-rates__offline">Valores incluidos en la app</span>
    </header>

    <p v-if="error" class="exchange-rates__error">{{ error }}</p>

    <ul v-else-if="Object.keys(rates).length" class="exchange-rates__list">
      <li v-for="(rate, currency) in rates" :key="currency">
        <span class="exchange-rates__currency">{{ currency }}</span>
        <span class="exchange-rates__rate">{{ rate.toFixed(4) }}</span>
      </li>
    </ul>

    <p v-else class="exchange-rates__empty">Sin cotizaciones cargadas</p>
  </section>
</template>

<style scoped>
.exchange-rates__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-sm);
}

.exchange-rates__title {
  margin-bottom: 0;
}

.exchange-rates__offline {
  color: var(--color-text-subtle);
  font-size: 0.75rem;
  text-align: right;
}

.exchange-rates__list {
  list-style: none;
  margin-top: var(--space-md);
}

.exchange-rates__list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-surface-raised);
  font-size: 0.9375rem;
}

.exchange-rates__list li:last-child {
  border-bottom: none;
}

.exchange-rates__currency {
  font-weight: 500;
}

.exchange-rates__rate {
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}

.exchange-rates__empty {
  margin-top: var(--space-md);
  color: var(--color-text-subtle);
  font-size: 0.9375rem;
}

.exchange-rates__error {
  margin-top: var(--space-md);
  color: var(--color-error);
  font-size: 0.9375rem;
}
</style>
