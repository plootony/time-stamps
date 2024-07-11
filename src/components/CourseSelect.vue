<template>
  <div :class="['course-select', { 'is-loading': isLoading }]">
    <span class="course-select__title">Выберите курс из списка</span>

    <input
      @click="toggleDropdown"
      class="course-select__value"
      :value="selectedTitle"
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
const selectedTitle = ref<string>('')
const selectedImage = ref<string>('')
const selectedId = ref<string>('')

const toggleDropdown = () => {
  isShow.value = !isShow.value
}

const selectCourse = (title: string, id: string, image: string) => {
  emits('selectCourse', title, id, image)

  isShow.value = false
}

const init = async () => {

  try {
    isLoading.value = true

    await getCourses()

    if (courseStore.courses.length > 0) {
      selectedId.value = courseStore.courses[0].id
      selectedTitle.value = courseStore.courses[0].title
      selectedImage.value = courseStore.courses[0].image
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(init)
</script>