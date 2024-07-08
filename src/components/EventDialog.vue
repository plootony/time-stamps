<template>
  <the-modal
    :modalShow="eventDialogShow"
    @modal-close="closeModal"
  >

    <template #header>
      <h2 class="modal__title">Добавить событие</h2>
    </template>

    <template #content>
      <div class="event-dialog">
        <form
          @submit.prevent
          class="event-dialog__form"
        >
          <SmartSelect />

          <div class="form-group">
            <label class="form-group__label">Начало</label>

            <input
              v-model="eventData.start"
              type="date"
              :min="eventData.start"
              class="form-group__input"
            >
          </div>

          <div class="form-group">
            <label class="form-group__label">Конец</label>

            <input
              v-model="eventData.end"
              type="date"
              :min="eventData.start"
              class="form-group__input"
            >
          </div>
        </form>
      </div>
    </template>

    <template #footer>
      <button @click="eventAdd" class="btn btn--primary">Сохранить</button>

      <button @click="closeModal" class="btn btn--outline">Закрыть</button>
    </template>
  </the-modal>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import {v4 as uuidv4} from 'uuid'
import TheModal from '@/components/TheModal.vue'
import type {IEvent} from '@/interfaces/IEvent'
import SmartSelect from '@/components/SmartSelect.vue'
import {useCourseStore} from '@/stores/course'

const courseStore = useCourseStore()
const props = defineProps({
  eventDialogShow: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['modalClose', 'eventAdd'])

const today = new Date().toISOString().split('T')[0]
const eventData = ref<IEvent>({
  id: uuidv4(),
  title: '',
  start: today,
  end: today
})

/** Закрытие модального окна */
const closeModal = () => {
  emits('modalClose')
  clearForm()
}

/** Добавление события */
const eventAdd = () => {
  emits('eventAdd', eventData.value)
  clearForm()
}

/** Очистка формы */
const clearForm = () => {
  eventData.value = {
    id: uuidv4(),
    title: '',
    start: today,
    end: today
  }
}
</script>