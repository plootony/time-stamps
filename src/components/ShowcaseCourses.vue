<template>
  <showcase-dialog @update-courses="getAllCourses"/>

  <div class="showcase__cards">
    <showcase-course
        v-for="course in courses"
        :key="course.id"
        :course="course"
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

const getAllCourses = async () => {
  try {
    const getData = query(collection(db, `users/${getAuth().currentUser?.uid}/courses/`))
    const coursesList = await getDocs(getData)

    courses.value = []

    coursesList.docs.map(doc => {
      courses.value.push(doc.data() as ICourse)
    })

  } catch (error) {
    console.log(error)
  } finally {
    console.log('Загрузка завершена')
  }
}

onMounted(() => {
  getAllCourses()
})
</script>