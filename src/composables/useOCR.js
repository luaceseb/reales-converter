import { ref } from 'vue'

export function useOCR() {
  const text = ref('')
  const price = ref(null)
  const loading = ref(false)
  const error = ref(null)

  function extractPrice(rawText) {
    const match = rawText.match(/(\d+[.,]\d{2}|\d+)/)
    if (!match) return null

    return parseFloat(match[1].replace(',', '.'))
  }

  async function scanImage(imageData) {
    loading.value = true
    error.value = null
    text.value = ''
    price.value = null

    try {
      // TODO: integrar librería OCR (p. ej. Tesseract.js)
      text.value = ''
      price.value = extractPrice(text.value)
    } catch (err) {
      error.value = err.message ?? 'Error al procesar la imagen'
    } finally {
      loading.value = false
    }
  }

  return {
    text,
    price,
    loading,
    error,
    scanImage,
    extractPrice,
  }
}
