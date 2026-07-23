import { ref, onUnmounted } from 'vue'

export function useCamera() {
  const videoRef = ref(null)
  const stream = ref(null)
  const error = ref(null)
  const isActive = ref(false)

  async function start() {
    error.value = null

    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.value) {
        videoRef.value.srcObject = stream.value
        await videoRef.value.play()
      }

      isActive.value = true
    } catch (err) {
      error.value = err.message ?? 'No se pudo acceder a la cámara'
      isActive.value = false
    }
  }

  function stop() {
    stream.value?.getTracks().forEach((track) => track.stop())
    stream.value = null
    isActive.value = false
  }

  function captureFrame() {
    if (!videoRef.value?.videoWidth || !videoRef.value?.videoHeight) return null

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.value, 0, 0)

    return canvas.toDataURL('image/png')
  }

  onUnmounted(stop)

  return {
    videoRef,
    error,
    isActive,
    start,
    stop,
    captureFrame,
  }
}
