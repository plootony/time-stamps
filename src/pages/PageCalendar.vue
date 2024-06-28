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

          <EventDialog
              :modalShow="eventDialogShow"
              @modal-close="eventDialogShow = false"
              @event-add="eventAdd"
          />

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
import {onMounted, ref} from 'vue'
import {useEventsStore} from '@/stores/events'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createCalendar, viewMonthGrid} from '@schedule-x/calendar'
import MainLayout from '@/layouts/MainLayout.vue'
import EventDetails from '@/components/EventDetails.vue'
import EventToday from '@/components/EventToday.vue'
import EventDialog from '@/components/EventDialog.vue'
import type {IEvent} from '@/interfaces/IEvent'
import {useCourseStore} from '@/stores/course'
import {collection, doc, getDocs, query, setDoc} from 'firebase/firestore'

const eventsStore = useEventsStore()

// TODO: Разбить стор на модули
const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId

const isLoading = ref<boolean>(false)
const eventDetailsShow = ref<boolean>(false)
const eventDialogShow = ref<boolean>(false)

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  callbacks: {
    onEventClick: (event) => {
      eventDetailsShow.value = true
    },
    onClickDate(date) {
      eventDialogShow.value = true
    },
  },
  events: [
    ...eventsStore.events
  ] as IEvent[],
  plugins: [eventsServicePlugin],
})

/** Удаление ивента */
const eventDelete = (): void => {
  eventDetailsShow.value = false
}

/** Добавление ивента */
const eventAdd = async (eventData: IEvent): Promise<void> => {
  console.log(eventData)

  if (!userId) return

  isLoading.value = true

  try {
    await setDoc(doc(db, `users/${userId}/events/${eventData.id}`), eventData)
    calendarApp.events.add(eventData)
    eventsStore.events.push(eventData)

    eventDialogShow.value = false
  } catch (error) {
    console.log('Не удалось добавить ивент', error)

  } finally {
    isLoading.value = false
  }
}

/** Получение списка ивентов */
const getAllEvents = async (): Promise<void> => {
  if (!userId) return

  try {
    isLoading.value = true

    console.log('Пытаюсь получить список ивентов')
    const docRef = query(
        collection(db, `users/${userId}/events/`)
    )

    const docSnap = await getDocs(docRef)

    if (docSnap.empty) {
      console.log('Список ивентов пуст')
      return
    }

    console.log('Ощищаю старый список ивентов')
    eventsStore.events = []

    docSnap.docs.map(doc => {
      console.log('Итерируюсь по списку ивентов', doc.data())
      eventsStore.events.push(doc.data() as IEvent)
    })

    calendarApp.events.set(eventsStore.events)

  } catch (error) {
    console.log('Ошибка при получении ивентов', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(getAllEvents)
</script>