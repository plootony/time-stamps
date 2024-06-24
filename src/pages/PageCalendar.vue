<template>
  <main-layout>
    <template #content>
      <ScheduleXCalendar :calendar-app="calendarApp"/>
    </template>

  </main-layout>
</template>

<script setup lang='ts'>
import {reactive} from 'vue'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
} from '@schedule-x/calendar'
import MainLayout from '@/layouts/MainLayout.vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createEventModalPlugin} from '@schedule-x/event-modal'

interface IEvent {
  id: number
  title: string
  start: string
  end: string
}

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewDay, viewWeek, viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  events: [
    {
      id: 1,
      title: 'Event 1',
      start: '2024-06-22',
      end: '2024-06-22',
    },
    {
      id: 2,
      title: 'Event 2',
      start: '2023-12-20 12:00',
      end: '2023-12-20 13:00',
    },
  ] as IEvent[],
  plugins: [eventsServicePlugin, createEventModalPlugin()],

})
const newEvent = reactive<IEvent>({
  id: Date.now(),
  title: '',
  start: '',
  end: '',
})
</script>

