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
          <ScheduleXCalendar
              :class="{'is-loading': isLoading}"
              :calendar-app="calendarApp"
          />

          <EventDialog
              :modalShow="eventDialogShow"
              @modal-close="eventDialogShow = false"
              @event-add="eventAdd"
          />

          <EventDetails
              v-if="eventDetailsShow"
              :current-event="currentEvent"
              @eventDelete="eventDelete"
              @close="eventDetailsShow = false"
          />
        </section>
      </section>
    </template>
  </main-layout>
</template>

<script setup lang='ts'>
import {onMounted, reactive, ref} from 'vue'
import {useEventsStore} from '@/stores/events'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import {createCalendar, viewMonthGrid} from '@schedule-x/calendar'
import {useCourseStore} from '@/stores/course'
import {collection, deleteDoc, doc, getDocs, query, setDoc} from 'firebase/firestore'
import MainLayout from '@/layouts/MainLayout.vue'
import EventDetails from '@/components/EventDetails.vue'
import EventToday from '@/components/EventToday.vue'
import EventDialog from '@/components/EventDialog.vue'
import type {IEvent} from '@/interfaces/IEvent'

const eventsStore = useEventsStore()

// TODO: Разбить стор на модули
const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId

const isLoading = ref<boolean>(false)
const eventDetailsShow = ref<boolean>(false)
const eventDialogShow = ref<boolean>(false)

// TODO: Подумать над этим еще)
const currentEvent = reactive<IEvent>({
  id: '',
  title: '',
  start: '',
  end: '',
})

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  callbacks: {
    onEventClick: (event): void => {
      currentEvent.id = event.id as string
      currentEvent.title = event.title as string
      currentEvent.start = event.start as string
      currentEvent.end = event.end as string

      eventDetailsShow.value = true
    },

    onClickDate(date): void {
      eventDialogShow.value = true
    },
  },
  events: [
    ...eventsStore.events
  ] as IEvent[],
  plugins: [eventsServicePlugin],
})

/** Удаление ивента */
const eventDelete = async (): Promise<void> => {
  try {
    isLoading.value = true

    console.log('Пытаюсь удалить ивент')
    await deleteDoc(doc(db, `users/${userId}/events/`, currentEvent.id))

    const index: number = eventsStore.events.findIndex(event => event.id === currentEvent.id)
    if (index !== -1) {
      eventsStore.events.splice(index, 1)
      console.log('Выбранный ивент удален')
    }

    calendarApp.events.remove(currentEvent.id)

    eventDetailsShow.value = false

  } catch (error) {
    console.log('Ошибка при удалении ивента', error)
  } finally {
    isLoading.value = false
  }
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