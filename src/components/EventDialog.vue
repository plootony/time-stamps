<template>
  <div class="event-dialog">
    <form @submit.prevent class="event-dialog__form">
      <div class="form-group">
        <label class="form-group__label">Заголовок события</label>

        <input
            v-model="eventsStore.eventData.title"
            type="text"
            placeholder="Тут будет селектор курсов"
            class="form-group__input"
        >
      </div>

      <div class="form-group">
        <label class="form-group__label">Начало</label>

        <input
            v-model="eventsStore.eventData.start"
            type="date" :min="eventsStore.eventData.start"
            class="form-group__input"
        >
      </div>

      <div class="form-group">
        <label class="form-group__label">Конец</label>

        <input
            v-model="eventsStore.eventData.end"
            type="date"
            :min="eventsStore.eventData.start"
            class="form-group__input"
        >
      </div>
    </form>
  </div>
</template>

<script setup lang='ts'>
import {onUnmounted} from 'vue'
import {useEventsStore} from '@/stores/events'

const eventsStore = useEventsStore()

onUnmounted(() => {
  eventsStore.eventData = {
    id: Date.now(),
    title: '',
    start: '',
    end: ''
  }
})
</script>