<template>
  <div
    v-if="isLoading && courseStore.courses.length"
    class="showcase__loader"
  ></div>

  <div
    v-if="!courseStore.courses.length && !isLoading"
  >Вы еще не добавили ни одного курса
  </div>

  <div v-else class="showcase__cards">
    <course-item
      v-for="course in courseStore.courses"
      :key="course.id"
      :course="course"
      @delete-course="deleteCourse"
    />
  </div>
</template>

<script setup lang='ts'>
import {onMounted} from 'vue'
import {useCourseStore} from '@/stores/course'
import {useCourses} from '@/composables/useCourses'
import CourseItem from '@/components/CourseItem.vue'

const courseStore = useCourseStore()
const {isLoading, getCourses, deleteCourse} = useCourses()

onMounted(() => {
  getCourses()
})
</script>