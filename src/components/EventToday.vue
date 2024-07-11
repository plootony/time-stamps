<template>
  <div class="events-list">
    <ul v-if="todayEvents.length" class="events-list__body">
      <li
        v-for="event in todayEvents"
        :key="event.id"
      >
        <router-link
          class="events-list__item"
          :to="'course/' + event.id"
          :title="event.title"
        >
          <img class="events-list__item-img" :src="event.image" alt="Обложка">

          <span class="events-list__item-title">{{ event.title }}</span>
        </router-link>
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