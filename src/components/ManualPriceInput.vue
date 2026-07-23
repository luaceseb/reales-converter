<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <section class="manual-price card">
    <h2 class="card__title">Ingresar importe</h2>

    <label class="manual-price__label" for="price-input">Precio en reales</label>
    <div class="manual-price__field">
      <span class="manual-price__prefix" aria-hidden="true">R$</span>
      <input
        id="price-input"
        :value="modelValue"
        class="manual-price__input"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        placeholder="0,00"
        aria-describedby="price-input-help"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>
    <p id="price-input-help" class="manual-price__help">Usá coma o punto para los decimales.</p>
  </section>
</template>

<style scoped>
.manual-price__label {
  display: block;
  margin-bottom: var(--space-xs);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.manual-price__field {
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--color-surface-raised);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.manual-price__field:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.manual-price__prefix {
  padding-left: var(--space-md);
  color: var(--color-text-muted);
  font-size: 1.125rem;
  font-weight: 600;
}

.manual-price__input {
  width: 100%;
  min-height: var(--touch-min);
  padding: var(--space-sm) var(--space-md);
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 1.125rem;
  font-variant-numeric: tabular-nums;
}

.manual-price__input::placeholder {
  color: var(--color-text-subtle);
}

.manual-price__help {
  margin-top: var(--space-xs);
  color: var(--color-text-subtle);
  font-size: 0.8125rem;
}
</style>
