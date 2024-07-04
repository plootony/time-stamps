<template>
  <the-modal :modal-show="isShow" @modal-close="modalClose">
    <template #header>
      <h2 class="modal__title">Добавить новую главу</h2>
    </template>

    <template #content>
      <form class="playlist__form">
        <div class="form-group">
          <label class="form-group__label">Заголовок</label>

          <input
              v-model="title"
              @input="validateInput"
              type="text"
              class="form-group__input"
          >

          <span
              v-if="error"
              class="form-group__error"
          >{{ error }}</span>
        </div>
      </form>
    </template>

    <template #footer>
      <button
          class="btn btn--outline"
          @click.prevent="modalClose"
      >Закрыть
      </button>

      <button
          @click.prevent="addChapter"
          :class="['btn btn--primary',{'is-loading' : isLoading}]"
      >Сохранить
      </button>
    </template>
  </the-modal>
</template>

<script setup lang='ts'>
import {ref} from 'vue'
import TheModal from '@/components/TheModal.vue'
import {setDoc, doc} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import type {IChapter} from '@/interfaces/IChapter'
import {useRoute} from 'vue-router'
import {useCourseStore} from '@/stores/course'
import {toast} from "vue3-toastify";

const courseStore = useCourseStore()
const router = useRoute()
const db = courseStore.db
const userId = courseStore.userId
const courseId = router.params.id

const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const title = ref<string>('')
const error = ref<string>('')

const emit = defineEmits(['modalClose'])


const validateInput = () => {
  const regex = /^[a-zA-Zа-яА-ЯёЁ0-9 .,:-]*$/
  if (!regex.test(title.value)) {
    error.value = 'Специальные символы запрещены!'
  } else {
    error.value = ''
  }
};

// Закрытие модального окна
const modalClose = () => {
  title.value = ''
  emit('modalClose')
}

/** Добавление новой главы */
const addChapter = async (): Promise<void> => {
  const chapterData: IChapter = {
    id: uuidv4(),
    title: title.value,
    time: courseStore.playerTime
  }

  if (!userId) return

  try {
    isLoading.value = true
    await setDoc(doc(db, `users/${userId}/courses/${courseId}/chapters/${chapterData.id}`), chapterData)
    courseStore.chapters.push(chapterData)

    toast.success('Глава успешно добавлена!')
    console.log('Глава успешно добавлена', courseStore.chapters)
    modalClose()

  } catch (error) {
    toast.error('Не удалось добавить главу!')
    console.log('Не удалось добавить главу!', error)

  } finally {
    isLoading.value = false
  }
}
</script>