<template>
  <div class="event-dialog">
    <form class="event-dialog__form">
      <div class="form-group">
        <label class="form-group__label">Заголовок события</label>

        <input
            v-model="courseStore.eventData.title"
            type="text"
            placeholder="Тут будет селектор курсов"
            class="form-group__input"
        >
      </div>

      <div class="form-group">
        <label class="form-group__label">Начало</label>

        <input
            v-model="courseStore.eventData.start"
            type="date" :min="courseStore.eventData.start"
            class="form-group__input"
        >
      </div>

      <div class="form-group">
        <label class="form-group__label">Конец</label>

        <input
            v-model="courseStore.eventData.end"
            type="date"
            :min="courseStore.eventData.start"
            class="form-group__input"
        >
      </div>
    </form>
  </div>
</template>

<script setup lang='ts'>
import {useCourseStore} from '@/stores/course'
const courseStore = useCourseStore()
</script>