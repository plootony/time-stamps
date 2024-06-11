<template>
  <button
      class="btn btn--primary"
      @click="isShow = true"
  >Добавить новый курс
  </button>

  <the-modal
      :modalShow="isShow"
      @modalClose="closeModal"
  >
    <template #header>
      <h2 class="modal__title">Добавить новый курс</h2>
    </template>

    <template #content>
      <form class="showcase__form">
        <div class="form-group">
          <label class="form-group__label">Заголовок</label>
          <input v-model="title" type="text" class="form-group__input">
          <span v-if="errors.title.length" class="form-group__error">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label class="form-group__label">Описание</label>
          <input v-model="desc" type="text" class="form-group__input">
          <span v-if="errors.desc.length" class="form-group__error">{{ errors.desc }}</span>
        </div>

        <div class="form-group">
          <label class="form-group__label">Ссылка на ютуб</label>
          <input v-model="courseStore.playerLink" type="text" class="form-group__input">
          <span v-if="errors.link.length" class="form-group__error">{{ errors.link }}</span>
        </div>

        <div class="form-group">
          <label class="form-group__label">Теги</label>
          <input v-model="tags" type="text" class="form-group__input">
          <span v-if="errors.tags.length" class="form-group__error">{{ errors.tags }}</span>
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
import {ref} from 'vue'
import {doc, setDoc} from 'firebase/firestore'
import {useCourseStore} from '@/stores/course'
import {v4 as uuidv4} from 'uuid'
import TheModal from '@/components/TheModal.vue'
import type {ICourse} from '@/interfaces/ICourse'
import {toast} from 'vue3-toastify'

interface IErrors {
  title: string
  link: string
  desc: string
  tags: string
}

const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId
const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const title = ref<string>('')
const desc = ref<string>('')
const tags = ref<string>('')
const youtubeUrlPattern = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/;
const isCompleted = ref<boolean>(false)
const errors = ref<IErrors>({
  title: '',
  link: '',
  desc: '',
  tags: '',
})

/** Очищаем данные */
const clearForm = (): void => {
  courseStore.playerLink = ''
  title.value = ''
  desc.value = ''
  tags.value = ''
  errors.value.title = ''
  errors.value.link = ''
  errors.value.desc = ''
  errors.value.tags = ''
}

/** Закрываем модалку / очищаем данные */
const closeModal = (): void => {
  clearForm()
  isShow.value = false
  isLoading.value = false
}

/** Добавляем курс в список */
const addCourse = async (): Promise<void> => {
  if (!userId) return

  if (title.value === '') {
    errors.value.title = 'Заголовок не может быть пустым'
  }

  if (courseStore.playerLink === '') {
    errors.value.link = 'Ссылка на ютуб не может быть пустой'
  }

  if (!youtubeUrlPattern.test(courseStore.playerLink)) {
    errors.value.link = 'Ссылка должна быть формата https://www.youtube.com/watch?v=xxxxxx'
  }

  if (desc.value === '') {
    errors.value.desc = 'Описание не может быть пустым'
  }

  if (tags.value === '') {
    errors.value.tags = 'Теги не могут быть пустыми'
  }

  if (errors.value.title || errors.value.link || errors.value.desc || errors.value.tags) {
    toast.error('Заполните все обязательные поля')
    return
  }

  const videoId = new URL(courseStore.playerLink).searchParams.get('v');
  const image = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  console.log('Пытаюсь добавить курс')
  const courseData: ICourse = {
    id: uuidv4(),
    title: title.value,
    desc: desc.value,
    image: image || 'default.png',
    link: courseStore.playerLink,
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