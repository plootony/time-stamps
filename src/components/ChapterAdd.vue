<template>
  <the-modal
    :modal-show="isShow"
    @modal-close="modalClose"
  >
    <template #header>
      <h2 class="modal__title">Добавить новую главу</h2>
    </template>

    <template #content>
      <form class="playlist__form" @submit.prevent>
        <div :class="['form-group', {'is-error' : v.title.$errors.length}]">
          <label class="form-group__label">Заголовок</label>

          <input
            v-model="v.title.$model"
            type="text"
            class="form-group__input"
          >

          <div
            v-if="v.title.$errors.length"
            class="form-group__errors"
          >
            <span
              v-for="error in v.title.$errors"
              :key="error.$uid"
              class="form-group__error"
            >{{ error.$message }}</span>
          </div>
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
import {computed, ref} from 'vue'
import TheModal from '@/components/TheModal.vue'
import {setDoc, doc} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import type {IChapter} from '@/interfaces/IChapter'
import {useRoute} from 'vue-router'
import {useCourseStore} from '@/stores/course'
import {toast} from 'vue3-toastify'
import useVuelidate from '@vuelidate/core'
import {helpers, minLength, required, maxLength} from '@vuelidate/validators'

const courseStore = useCourseStore()
const router = useRoute()
const db = courseStore.db
const userId = courseStore.userId
const courseId = router.params.id
const emit = defineEmits(['modalClose'])
const isShow = ref<boolean>(false)

const isLoading = ref<boolean>(false)
const title = ref<string>('')

const specSymbolCheck = /^[a-zA-Zа-яА-ЯёЁ0-9 .,:-]*$/

const rules = computed(() => ({
  title: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    minLength: helpers.withMessage(`Минимальная длина: 8 символа`, minLength(8)),
    maxLength: helpers.withMessage(`Максимальная длина: 50 символа`, maxLength(50)),
    specSymbol: helpers.withMessage('Спец символы запрещены!', (value: string) => specSymbolCheck.test(value))
  }
}))

const v = useVuelidate(rules, {title})

// Закрытие модального окна
const modalClose = () => {
  title.value = ''
  v.value.$reset()
  emit('modalClose')
}

/** Добавление новой главы */
const addChapter = async (): Promise<void> => {
  v.value.$touch()

  if (v.value.$error) return

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