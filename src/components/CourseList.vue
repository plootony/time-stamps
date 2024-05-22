<template>
  <div v-if="isLoading"> Загрузка...</div>

  <div v-else class="showcase__cards">
    <course-item
        v-for="course in courseStore.courses"
        :key="course.id"
        :course="course"
        @delete-course="deleteCourse"
    />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue"
import {useCourseStore} from "@/stores/course"
import {deleteDoc, doc, collection, getDocs, orderBy, query} from "firebase/firestore"
import CourseItem from "@/components/CourseItem.vue"
import type {ICourse} from "@/interfaces/ICourse"

const courseStore = useCourseStore()
const db = courseStore.db
const userId = courseStore.userId
const isLoading = ref<boolean>(false)

/** Получаем список курсов */
const getCourses = async (): Promise<void> => {
  if (!userId) {
    console.log('Пользователь не найден')
    return
  }

  try {
    isLoading.value = true

    console.log('Пытаюсь получить список курсов')
    const docRef = query(
        collection(db, `users/${userId}/courses/`),
        orderBy('createdAt', 'desc')
    )

    const docSnap = await getDocs(docRef)
    if (docSnap.empty) {
      console.log('Список курсов пуст')
      return
    }

    console.log('Ощищаю старый список курсов')
    courseStore.courses = []

    docSnap.docs.map(doc => {
      console.log('Итерируюсь по списку курсов', doc.data())
      courseStore.courses.push(doc.data() as ICourse)
      console.log('Список курсов построен')
    })

  } catch (error) {
    console.log('Ошибка при получении курса', error)
  } finally {
    isLoading.value = false
  }
}

/** Удаляем курс из списка */
const deleteCourse = async (id: string): Promise<void> => {
  try {
    isLoading.value = true
    console.log('Пытаюсь удалить курс')
    await deleteDoc(doc(db, `users/${userId}/courses/`, id))

    const index: number = courseStore.courses.findIndex(course => course.id === id)
    if (index !== -1) {
      courseStore.courses.splice(index, 1)
      console.log('Выбранный курс удален')
    }
  } catch (error) {
    console.log('Ошибка при удалении курса', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  getCourses()
})
</script>