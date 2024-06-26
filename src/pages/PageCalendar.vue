<template>
  <main-layout>
    <template #content>
      <ScheduleXCalendar :calendar-app="calendarApp"/>

      <TheModal
          :modal-show="eventDialogShow"
          @modalClose="closeModal"
      >
        <template #header>Добавить событие</template>

        <template #content>
          <EventDialog/>
        </template>

        <template #footer>
          <button class="btn btn--outline" @click="closeModal">Закрыть</button>
          <button @click="eventAdd" class="btn btn--primary">Сохранить</button>
        </template>
      </TheModal>

      <EventDetails
          v-if="eventDetailsShow"
          @eventDelete="eventDelete"
          @close="eventDetailsShow = false"
      />
    </template>
  </main-layout>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import {useCourseStore} from '@/stores/course'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createCalendar, viewMonthGrid} from '@schedule-x/calendar'
import type {IEvent} from '@/interfaces/IEvent'
import MainLayout from '@/layouts/MainLayout.vue'
import TheModal from '@/components/TheModal.vue'
import EventDetails from '@/components/EventDetails.vue'
import EventDialog from '@/components/EventDialog.vue'

const courseStore = useCourseStore()

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  callbacks: {
    onEventClick: (event) => {
      eventDetailsShow.value = true
      courseStore.currentEventId = event.id as IEvent['id']
      courseStore.currentEventTitle = event.title
    },
    onClickDate(date) {
      courseStore.eventData.start = date
      courseStore.eventData.end = date
      eventDialogShow.value = true
      eventDetailsShow.value = false
    },
  },
  events: [
    ...courseStore.events
  ] as IEvent[],
  plugins: [eventsServicePlugin],
})

const eventDialogShow = ref<boolean>(false)
const eventDetailsShow = ref<boolean>(false)

/** Закрытие модального окна */
const closeModal = (): void => {
  eventDialogShow.value = false
}

/** Удаление ивента */
const eventDelete = (): void => {
  calendarApp.events.remove(courseStore.currentEventId as IEvent['id'])
  eventDetailsShow.value = false
}

/** Добавление ивента */
const eventAdd = (): void => {
  calendarApp.events.add({
    id: courseStore.eventData.id,
    title: courseStore.eventData.title,
    start: courseStore.eventData.start,
    end: courseStore.eventData.end,
  })
  eventDialogShow.value = false
}
</script>