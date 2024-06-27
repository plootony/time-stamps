<template>
  <main-layout>
    <template #content>
      <section class="calendar">
        <section class="events">
          <h2 class="events__title">Курсы на сегодня</h2>
          <span class="events__subtitle">27.06.2024</span>

          <EventToday/>
        </section>

        <section class="schedule">
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
        </section>
      </section>
    </template>
  </main-layout>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import {useEventsStore} from '@/stores/events'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createCalendar, viewMonthGrid} from '@schedule-x/calendar'
import MainLayout from '@/layouts/MainLayout.vue'
import TheModal from '@/components/TheModal.vue'
import EventDetails from '@/components/EventDetails.vue'
import EventDialog from '@/components/EventDialog.vue'
import EventToday from '@/components/EventToday.vue'
import type {IEvent} from '@/interfaces/IEvent'

const eventsStore = useEventsStore()
const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  callbacks: {
    onEventClick: (event) => {
      eventDetailsShow.value = true
      eventsStore.currentEventId = event.id as IEvent['id']
      eventsStore.currentEventTitle = event.title as IEvent['title']
    },
    onClickDate(date) {
      eventsStore.eventData.start = date as IEvent['start']
      eventsStore.eventData.end = date as IEvent['end']

      eventDialogShow.value = true
      eventDetailsShow.value = false
    },
  },
  events: [
    ...eventsStore.events
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
  calendarApp.events.remove(eventsStore.currentEventId as IEvent['id'])
  eventsStore.events = eventsStore.events.filter(event => event.id !== eventsStore.currentEventId)

  eventDetailsShow.value = false
}

/** Добавление ивента */
const eventAdd = (): void => {
  calendarApp.events.add(eventsStore.eventData)
  eventsStore.events.push(eventsStore.eventData)

  eventDialogShow.value = false
}
</script>