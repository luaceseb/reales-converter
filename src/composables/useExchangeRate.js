import { ref, computed } from 'vue'
import { fixedExchangeRates } from '../data/exchangeRates'

export function useExchangeRate() {
  const rates = ref({})
  const loading = ref(false)
  const error = ref(null)
  const baseCurrency = ref('BRL')

  const hasRates = computed(() => Object.keys(rates.value).length > 0)

  async function fetchRates() {
    loading.value = true
    error.value = null

    try {
      rates.value = fixedExchangeRates
    } catch (err) {
      error.value = err.message ?? 'No se pudieron obtener las cotizaciones'
    } finally {
      loading.value = false
    }
  }

  function convert(amount, toCurrency) {
    const rate = rates.value[toCurrency]
    if (rate == null || amount == null) return null
    return amount * rate
  }

  return {
    rates,
    loading,
    error,
    baseCurrency,
    hasRates,
    fetchRates,
    convert,
  }
}
