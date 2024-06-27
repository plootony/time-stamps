<template>
  <div class="events-list">
    <ul v-if="todayEvents.length" class="event-list__body">
      <li
          v-for="event in todayEvents"
          :key="event.id"
          class="event-list__item"
      >
        <span class="event-list__item-title">{{ event.title }}</span>
      </li>
    </ul>

    <span v-else class="events-list__empty">На сегодня курсов нет </span>
  </div>
</template>

<script setup lang='ts'>
import {computed} from 'vue'
import {useEventsStore} from '@/stores/events'

const eventsStore = useEventsStore()

/** Вывод ивентов на сегодня */
const todayEvents = computed(() => {
  const todayDate = new Date().toISOString().split('T')[0]
  return eventsStore.events.filter(event => event.start === todayDate)
})
</script>