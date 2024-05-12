<template>
  <showcase-dialog @update-courses="getAllCourses"/>

  <div v-if="isLoading"> Загрузка...</div>

  <div v-else class="showcase__cards">
    <showcase-course
        v-for="course in coursesList"
        :key="course.id"
        :course="course"
        @delete-course="deleteCourse"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc} from "firebase/firestore"
import type {ICourse} from "@/interfaces/ICourse";
import ShowcaseDialog from "@/components/ShowcaseDialog.vue"
import ShowcaseCourse from "@/components/ShowcaseCourse.vue"
import {getAuth} from "firebase/auth";

const db = getFirestore()
const userId = getAuth().currentUser?.uid
const coursesList = ref<ICourse[]>([]);
const isLoading = ref(false)

const getAllCourses = async () => {
  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = query(collection(db, `users/${userId}/courses/`), orderBy('createdAt', 'desc'))
    const docSnap = await getDocs(docRef)

    coursesList.value = []

    docSnap.docs.map(doc => {
      coursesList.value.push(doc.data() as ICourse)
    })

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const deleteCourse = async (id: string) => {
  await deleteDoc(doc(db, `users/${userId}/courses/`, id))
  coursesList.value = coursesList.value.filter(course => course.id !== id)
}

onMounted(() => {
  getAllCourses()
})
</script>