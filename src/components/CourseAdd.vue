<template>
  <button
    class="btn btn--primary"
    @click="isShow = true"
  >Начать новый курс
  </button>

  <the-modal
    :modalShow="isShow"
    @modalClose="closeModal"
  >
    <template #header>
      <h2 class="modal__title">Начть новый курс</h2>
    </template>

    <template #content>
      <form class="showcase__form">

        <div :class="['form-group', {'is-error' : v.link.$errors.length}]">
          <label class="form-group__label">Ссылка на ютуб</label>
          <input
            v-model="v.link.$model"
            class="form-group__input"
            type="text"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          >

          <div
            v-if="v.link.$errors.length"
            class="form-group__errors"
          >
            <span
              v-for="error in v.link.$errors"
              :key="error.$uid"
              class="form-group__error"
            >{{ error.$message }}</span>
          </div>
        </div>

        <div :class="['form-group', {'is-error' :  v.title.$errors.length}]">
          <label class="form-group__label">Название курса</label>

          <input
            v-model="v.title.$model"
            class="form-group__input"
            type="text"
            placeholder="Английский для чайников"
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

        <div :class="['form-group', {'is-error' :  v.desc.$errors.length}]">
          <label class="form-group__label">О чем данный курс?</label>

          <input
            v-model="v.desc.$model"
            class="form-group__input form-group__textarea"
            placeholder="Самый лучший курс для чайников :)"
          >

          <div
            v-if="v.desc.$errors.length"
            class="form-group__errors"
          >

            <span
              v-for="error in v.desc.$errors"
              :key="error.$uid"
              class="form-group__error"
            >{{ error.$message }}</span>
          </div>
        </div>


        <div :class="['form-group', {'is-error' :  v.tags.$errors.length}]">
          <label class="form-group__label">Теги</label>

          <input
            v-model="v.tags.$model"
            class="form-group__input"
            type="text"
            placeholder="Языки, Английский"
          >

          <div
            v-if="v.tags.$errors.length"
            class="form-group__errors"
          >
            <span
              v-for="error in v.tags.$errors"
              :key="error.$uid"
              class="form-group__error"
            >{{ error.$message }}</span>
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <button class="btn btn--outline" @click.prevent="closeModal">Закрыть</button>

      <button @click.prevent="addCourse" class="btn btn--primary">Сохранить</button>
    </template>
  </the-modal>
</template>

<script setup lang='ts'>
import {computed, ref} from 'vue'
import {doc, setDoc} from 'firebase/firestore'
import {useCourseStore} from '@/stores/course'
import {v4 as uuidv4} from 'uuid'
import TheModal from '@/components/TheModal.vue'
import type {ICourse} from '@/interfaces/ICourse'

import useVuelidate from '@vuelidate/core'
import {helpers, minLength, required, maxLength} from '@vuelidate/validators'

const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId

const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)

const link = ref<string>('')
const title = ref<string>('')
const desc = ref<string>('')
const tags = ref<string>('')

const isCompleted = ref<boolean>(false)

const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/

const rules = computed(() => ({
  link: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    maxLength: helpers.withMessage(`Максимальная длина: 50 символа`, maxLength(50)),
    youtubeUrl: helpers.withMessage('Ссылка должна быть формата https://www.youtube.com/watch?v=xxxxxx', (value: string) => youtubeUrlPattern.test(value))
  },
  title: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    maxLength: helpers.withMessage(`Максимальная длина: 90 символа`, maxLength(90)),
    minLength: helpers.withMessage(`Минимальная длина: 8 символа`, minLength(8))
  },
  desc: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    maxLength: helpers.withMessage(`Максимальная длина: 180 символа`, maxLength(180)),
    minLength: helpers.withMessage(`Минимальная длина: 8 символа`, minLength(8))
  },
  tags: {
    required: helpers.withMessage('Поле обязательно для заполнения', required),
    maxLength: helpers.withMessage(`Максимальная длина: 50 символа`, maxLength(50)),
    minLength: helpers.withMessage(`Минимальная длина: 5 символа`, minLength(8))
  }
}))

const v = useVuelidate(rules, {link, title, desc, tags})

/** Очищаем данные */
const clearForm = (): void => {
  title.value = ''
  link.value = ''
  desc.value = ''
  tags.value = ''
}

/** Закрываем модалку / очищаем данные */
const closeModal = (): void => {
  isShow.value = false
  isLoading.value = false

  clearForm()
}

/** Добавляем курс в список */
const addCourse = async (): Promise<void> => {
  v.value.$touch()

  if (v.value.$error) return

  if (!userId) return

  const videoId = new URL(link.value).searchParams.get('v')
  const image = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  console.log('Пытаюсь добавить курс')

  const courseData: ICourse = {
    id: uuidv4(),
    title: title.value,
    desc: desc.value,
    image: image || 'default.png',
    link: link.value,
    tags: tags.value.split(',').map(tag => tag.trim()),
    createdAt: new Date(),
    isCompleted: isCompleted.value
  }

  try {
    isLoading.value = true

    await setDoc(doc(db, `users/${userId}/courses/${courseData.id}`), courseData)
    courseStore.courses.push(courseData)

    console.log('Курс добавлен')

  } catch (error) {
    console.log('Ошибка при добавлении курса', error)

  } finally {
    closeModal()
  }
}
</script>