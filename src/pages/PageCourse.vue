<template>
  <div v-if="course">
    <small>{{ course.id }}</small>
    <h1>{{ course.title }}</h1>
    <span>{{ course.desc }}</span>
  </div>

  <div v-else>Загрузка...</div>
</template>

<script setup lang="ts">
import {getAuth} from "firebase/auth";
import {collection, doc, getFirestore, getDoc} from "firebase/firestore"
import {onMounted, ref} from "vue"
import {useRoute} from "vue-router";

defineProps(['id'])

const router = useRoute()
const db = getFirestore()

const course = ref()
const courseID = router.params.id;

const getOneCourse = async () => {
  if (typeof courseID !== 'string') {
    console.log('Вместо id пришло, что то не то')
    return
  }

  const courseCollection = doc(collection(db, `users/${getAuth().currentUser?.uid}/courses`), courseID)
  const rawCourse = await getDoc(courseCollection)

  course.value = rawCourse.data()
}

onMounted(() => {
  getOneCourse()
});

</script>
