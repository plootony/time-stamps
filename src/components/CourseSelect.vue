<template>
  <div :class="['course-select', { 'is-loading': isLoading }]">
    <span class="course-select__title">Выберите курс из списка</span>

    <input
      v-model="selectedCourse"
      @click="toggleDropdown"
      class="course-select__value"
      readonly
    >

    <div v-if="isShow" class="course-select__body">
      <ul
        v-if="courseStore.courses.length"
        :class="['course-select__list', { 'is-loading': isLoading }]"
      >
        <li
          v-for="course in courseStore.courses"
          :key="course.id"
          @click="selectCourse(course.title, course.id, course.image)"
          class="course-select__item"
        >
          <img :src="course.image" alt="Обложка" class="course-select__item-img">

          <span class="course-select__item-title">{{ course.title }}</span>
        </li>

      </ul>

      <span v-else class="course-select__empty">Вы еще не добавили ни одного курса</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import {useCourseStore} from '@/stores/course'
import {onMounted, ref} from 'vue'
import {useCourses} from '@/composables/useCourses'

const courseStore = useCourseStore()

const {isLoading, getCourses} = useCourses()
const emits = defineEmits(['selectCourse'])

const isShow = ref<boolean>(false)
const selectedCourse = ref<string>('')

/**
 * Переключение состояния видимости выпадающего списка
 */
const toggleDropdown = (): void => {
  isShow.value = !isShow.value
}

/**
 * Выбор курса и эмиссия события
 * @param {string} title - Название курса
 * @param {string} id - Идентификатор курса
 * @param {string} image - Изображение курса
 */
const selectCourse = (title: string, id: string, image: string): void => {
  selectedCourse.value = title
  emits('selectCourse', title, id, image)

  isShow.value = false
}

/**
 * Инициализация компонента, загрузка курсов и выбор первого курса
 */
const init = async (): Promise<void> => {
  try {
    isLoading.value = true

    await getCourses()

    if (courseStore.courses.length > 0) {
      selectCourse(
        courseStore.courses[0].title,
        courseStore.courses[0].id,
        courseStore.courses[0].image
      )
    }
  } catch (e) {
    console.error(e)

  } finally {
    isLoading.value = false
  }
}

onMounted(init)
</script>
