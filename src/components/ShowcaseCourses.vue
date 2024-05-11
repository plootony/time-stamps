<template>
  <showcase-dialog @update-courses="getAllCourses"/>

  <div v-if="isLoading"> Загрузка...</div>

  <div v-else class="showcase__cards">
    <showcase-course
        v-for="course in courses"
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
const courses = ref<ICourse[]>([])
const isLoading = ref(false)

const getAllCourses = async () => {
  try {
    isLoading.value = true
    const getData = query(collection(db, `users/${getAuth().currentUser?.uid}/courses/`), orderBy('createdAt', 'desc'))
    const coursesList = await getDocs(getData)

    courses.value = []

    coursesList.docs.map(doc => {
      courses.value.push(doc.data() as ICourse)
    })

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const deleteCourse = async (id: string) => {
  await deleteDoc(doc(db, `users/${getAuth().currentUser?.uid}/courses/`, id))
  getAllCourses()
}

onMounted(() => {
  getAllCourses()
})
</script>