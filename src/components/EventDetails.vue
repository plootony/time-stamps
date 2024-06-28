<template>
  <div class="event-details">
    <button @click="close" class="event-details__close">
      <TheIcon name="close"/>
    </button>

    <h2 v-if="currentEvent" class="event-details__title">{{ currentEvent.title }}</h2>

    <ul v-if="currentEvent">
      <li class="event-details__item">
        <span class="event-details__label">Начало: </span>
        <span class="event-details__value">{{ currentEvent.start }}</span>
      </li>

      <li class="event-details__item">
        <span class="event-details__label">Конец: </span>
        <span class="event-details__value">{{ currentEvent.end }}</span>
      </li>
    </ul>

    <div class="event-details__controls">
      <button @click="eventDelete" class="btn btn--danger">Удалить</button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import TheIcon from '@/components/TheIcon.vue'

const emit = defineEmits(['close', 'eventDelete'])
const props = defineProps({
  currentEvent: {
    type: Object,
    required: false
  }
})
/** Закрытие модального окна */
const close = (): void => {
  emit('close')
}

/** Удаление ивента */
const eventDelete = (): void => {
  emit('eventDelete')
}
</script>