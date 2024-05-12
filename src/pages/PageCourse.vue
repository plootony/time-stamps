<template>
  <main-layout>
    <template #content>
      <div v-if="courseInfo">
        {{ courseInfo }}
        <br><br><br>

        <chapter-dialog/>
      </div>

      <div v-if="chaptersList">
        {{ chaptersList }}
      </div>

    </template>
  </main-layout>
</template>

<script setup lang="ts">
import {getAuth} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query} from "firebase/firestore"
import MainLayout from "@/layouts/MainLayout.vue"
import {useRoute} from "vue-router"
import {onMounted, ref} from "vue"
import type {ICourse} from "@/interfaces/ICourse";
import type {IChapter} from "@/interfaces/IChapter";
import ChapterDialog from "@/components/ChapterDialog.vue";

const db = getFirestore()
const router = useRoute()
const isLoading = ref<boolean>(false)

const userId = getAuth().currentUser?.uid
const courseId = router.params.id as string
const courseInfo = ref<ICourse | null>(null)
const chaptersList = ref<IChapter[]>([])

const getOneCourse = async (): Promise<void> => {

  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = doc(db, `users/${userId}/courses/${courseId}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      courseInfo.value = docSnap.data() as ICourse
    } else {
      console.log("Документ не найден")
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const getAllChapters = async () => {
  try {
    isLoading.value = true

    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    const docRef = query(collection(db, `users/${userId}/courses/${courseId}/chapters/`))
    const docSnap = await getDocs(docRef)

    if (docSnap) {
      docSnap.docs.map(doc => {
        chaptersList.value.push(doc.data() as IChapter)
      })
    }

  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getOneCourse()
  getAllChapters()
})
</script>