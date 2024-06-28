<template>
  <div class="event-details">
    <button @click="close" class="event-details__close">
      <TheIcon name="close"/>
    </button>

    <div class="event-details__controls">
      <button @click="eventDelete" class="btn btn--danger">Удалить</button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import TheIcon from '@/components/TheIcon.vue'

const emit = defineEmits(['close', 'eventDelete'])

/** Закрытие модального окна */
const close = (): void => {
  emit('close')
}

/** Удаление ивента */
const eventDelete = (): void => {
  emit('eventDelete')
}
</script>