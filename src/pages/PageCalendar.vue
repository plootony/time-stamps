<template>
  <main-layout>
    <template #content>
      <div id="calendar"></div>
    </template>
  </main-layout>
</template>

<script setup lang='ts'>
import {onMounted} from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import {createCalendar, viewMonthGrid} from '@schedule-x/calendar'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'

onMounted(() => {
  const calendar = createCalendar({
    views: [viewMonthGrid],
    plugins: [createEventModalPlugin()],
    events: [
      {
        id: 1,
        title: 'Курс по JS',
        start: '2024-06-21 10:05',
        end: '2024-06-21 10:35',
      },
    ],
  })

  const calendarEl = document.getElementById('calendar')
  if (!calendarEl) return
  calendar.render(calendarEl)
})
</script>

<style>
#calendar {
  width: 100%;
  height: 800px;
  max-height: 90vh;
}
</style>
