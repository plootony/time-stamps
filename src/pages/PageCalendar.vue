<template>
  <main-layout>
    <template #content>
      <ScheduleXCalendar :calendar-app="calendarApp"/>

      <TheModal :modal-show="eventModalShow" @modalClose="closeModal">
        <template #header> Добавить событие</template>

        <template #content>
          <div class="event-dialog">
            <form class="event-dialog__form">
              <div class="form-group">
                <label class="form-group__label">Заголовок события</label>
                <input type="text" class="form-group__input">
              </div>

              <div class="form-group">
                <label class="form-group__label">Описание</label>
                <input type="time" class="form-group__input">
              </div>

              <div class="form-group">
                <label class="form-group__label">Начало</label>
                <input type="time" class="form-group__input">
              </div>

              <div class="form-group">
                <label class="form-group__label">Конец</label>
                <input type="time" class="form-group__input">
              </div>

            </form>
          </div>
        </template>

        <template #footer>
          <button class="btn btn--outline" @click="closeModal">Закрыть</button>
          <button class="btn btn--primary">Сохранить</button>
        </template>
      </TheModal>

      <div v-if="eventDetailsShow" class="event-details">
        <button class="event-details__close" @click="eventDetailsShow = false">x</button>
        <h3 class="event-details__title">Привет друг, давно мы не виделись!</h3>
        <p class="event-details__desc">Наверное обиделись, стали чужими вдруг!</p>

        <div class="event-details__controls">
          <button class="btn btn--danger">Удалить</button>

          <button class="btn btn--primary">Сохранить</button>
        </div>
      </div>
    </template>

  </main-layout>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import {ScheduleXCalendar} from '@schedule-x/vue'
import {
  createCalendar,
  viewDay,
  viewWeek,
  viewMonthGrid,
} from '@schedule-x/calendar'
import MainLayout from '@/layouts/MainLayout.vue'
import {createEventsServicePlugin} from '@schedule-x/events-service'
import TheModal from '@/components/TheModal.vue'

interface IEvent {
  id: number
  title: string
  start: string
  end: string
}

const currentEventId = ref<Number>(0)

const eventsServicePlugin = createEventsServicePlugin()
const calendarApp = createCalendar({
  views: [viewDay, viewWeek, viewMonthGrid],
  defaultView: viewMonthGrid.name,
  locale: 'ru-RU',
  callbacks: {
    onEventClick: (event) => {
      eventDetailsShow.value = true
      currentEventId.value = event.id as IEvent['id']
      console.log(currentEventId.value)
    },
    onClickDate(date) {
      console.log('onClickDate', date)
      eventModalShow.value = true
    },
  },
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
      start: '2024-06-22',
      end: '2024-06-22',
    },
  ] as IEvent[],
  plugins: [eventsServicePlugin],
})

const eventModalShow = ref<boolean>(false)
const eventDetailsShow = ref<boolean>(false)
const closeModal = (): void => {
  eventModalShow.value = false
}
const eventDelete = (): void => {
  calendarApp.events.remove(currentEventId.value as IEvent['id'])
}

</script>

<style lang="scss">
.event-dialog__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-details {
  padding: 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 600px;
  height: 150px;
  background: rgba(121, 93, 187, 0.37);
  color: white;

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    color: white;
  }

  &__controls {
    display: flex;
    gap: 8px;
  }
}
</style>