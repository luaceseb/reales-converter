import { ref } from 'vue'
import { createWorker, PSM } from 'tesseract.js'

let workerPromise

function getAssetPath(filename) {
  return `${import.meta.env.BASE_URL}ocr/${filename}`
}

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker('eng', 1, {
      // These files are packaged with the app: scanning never needs a CDN.
      workerPath: getAssetPath('worker.min.js'),
      corePath: getAssetPath('tesseract-core-lstm.wasm.js'),
      langPath: getAssetPath(''),
      logger: () => {},
    }).then(async (worker) => {
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789R$., ',
        tessedit_pageseg_mode: PSM.SPARSE_TEXT,
      })
      return worker
    })
  }

  return workerPromise
}

function normalizePrice(value) {
  const compact = value.replace(/\s/g, '')
  const decimalIndex = Math.max(compact.lastIndexOf(','), compact.lastIndexOf('.'))

  if (decimalIndex === -1) return Number(compact)

  const integerPart = compact.slice(0, decimalIndex).replace(/[.,]/g, '')
  const decimalPart = compact.slice(decimalIndex + 1).replace(/[.,]/g, '')
  return Number(`${integerPart}.${decimalPart}`)
}

export function useOCR() {
  const text = ref('')
  const price = ref(null)
  const loading = ref(false)
  const error = ref(null)

  function extractPrice(rawText) {
    const normalizedText = rawText.replace(/\n/g, ' ')
    const currencyMatch = normalizedText.match(/R\s*\$?\s*([0-9][0-9\s.,]*)/i)
    const candidates = currencyMatch
      ? [currencyMatch[1]]
      : normalizedText.match(/[0-9][0-9\s.,]*/g) ?? []

    for (const candidate of candidates) {
      const parsed = normalizePrice(candidate)
      if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1000000) return parsed
    }

    return null
  }

  async function scanImage(imageData) {
    loading.value = true
    error.value = null
    text.value = ''
    price.value = null

    try {
      const worker = await getWorker()
      const { data } = await worker.recognize(imageData)
      text.value = data.text.trim()
      price.value = extractPrice(text.value)

      if (price.value == null) {
        error.value = 'No pudimos identificar un precio. Probá con más luz o ingresalo manualmente.'
      }
    } catch (err) {
      error.value = 'No se pudo leer la imagen. Verificá que la cámara esté enfocada e intentá de nuevo.'
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
