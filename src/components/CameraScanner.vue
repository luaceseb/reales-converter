<script setup>
import { useCamera } from '../composables/useCamera'

const emit = defineEmits(['capture'])

const { videoRef, error, isActive, start, stop, captureFrame } = useCamera()

function handleCapture() {
  const frame = captureFrame()
  if (frame) emit('capture', frame)
}
</script>

<template>
  <section class="camera card">
    <h2 class="card__title">Escanear precio</h2>

    <div class="camera__viewport">
      <video
        ref="videoRef"
        class="camera__video"
        :class="{ 'camera__video--active': isActive }"
        playsinline
        muted
      />
      <div v-if="!isActive" class="camera__placeholder">
        <span class="camera__icon" aria-hidden="true">📷</span>
        <p>Activá la cámara para escanear</p>
      </div>
    </div>

    <p v-if="error" class="camera__error">{{ error }}</p>

    <div class="camera__actions">
      <button v-if="!isActive" type="button" class="btn btn--primary btn--full" @click="start">
        Activar cámara
      </button>
      <template v-else>
        <button type="button" class="btn btn--primary btn--full" @click="handleCapture">
          Capturar
        </button>
        <button type="button" class="btn btn--secondary btn--full" @click="stop">Detener</button>
      </template>
    </div>
  </section>
</template>

<style scoped>
.camera__viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
}

.camera__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera__video:not(.camera__video--active) {
  display: none;
}

.camera__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  color: var(--color-text-subtle);
  border: 2px dashed var(--color-surface-raised);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
}

.camera__icon {
  font-size: 2rem;
  line-height: 1;
}

.camera__error {
  margin-top: var(--space-md);
  color: var(--color-error);
  font-size: 0.9375rem;
}

.camera__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}
</style>
