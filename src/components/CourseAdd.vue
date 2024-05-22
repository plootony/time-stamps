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
        </div>

        <div class="form-group">
          <label class="form-group__label">Описание</label>
          <input v-model="desc" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Ссылка на ютуб</label>
          <input v-model="courseStore.playerLink" type="text" class="form-group__input">
        </div>

        <div class="form-group">
          <label class="form-group__label">Теги</label>
          <input v-model="tags" type="text" class="form-group__input">
        </div>
      </form>
    </template>

    <template #footer>
      <button class="btn btn--outline" @click.prevent="closeModal">Закрыть</button>

      <button @click.prevent="addCourse" class="btn btn--primary">Сохранить</button>
    </template>
  </the-modal>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {doc, setDoc} from "firebase/firestore"
import {useCourseStore} from "@/stores/course"
import {v4 as uuidv4} from "uuid";
import TheModal from "@/components/TheModal.vue"
import type {ICourse} from "@/interfaces/ICourse"

const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId
const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)

// Данные курса
const title = ref<string>('')
const desc = ref<string>('')
const image = ref<string>('https://www.panchemodan.ru/upload/iblock/e28/seten5uc6lqsx2nfu0y2uoqyer852qme.jpg')
const tags = ref<string>('')
const isCompleted = ref<boolean>(false)

/** Закрываем модалку */
const closeModal = (): void => {
  isShow.value = false
}

/** Получаем название изображения */
const getImage = (event: Event): void => {
  const fileInput = event.target as HTMLInputElement
  const file = fileInput.files?.[0]

  if (file) {
    image.value = file.name
  }
}

/** Добавляем курс в список */
const addCourse = async (): Promise<void> => {
  if (!userId) return

  console.log('Пытаюсь добавить курс')
  const courseData: ICourse = {
    id: uuidv4(),
    title: title.value,
    desc: desc.value,
    image: image.value,
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
    isLoading.value = false
    closeModal()
  }
}
</script>