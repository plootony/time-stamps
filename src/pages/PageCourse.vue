<template>
  <main-layout>
    <template #content>
      <div class="course">
        <div class="course__heading">
          <button @click="$router.go(-1)" class="btn btn--primary">
            Назад
          </button>
          <h1 class="course__title">{{ courseInfo?.title }}</h1>
        </div>

        <div class="course__body">
          <Player :time="currentPlayerTime" :title="currentPlayerTitle"/>

          <playlist
              :chapters-list="chaptersList"
              @setChapterTime="updatePlayerTime"
          />
        </div>
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
import Player from "@/components/Player.vue";
import Playlist from "@/components/Playlist.vue";

const db = getFirestore()
const router = useRoute()
const isLoading = ref<boolean>(false)

const userId = getAuth().currentUser?.uid
const courseId = router.params.id as string
const courseInfo = ref<ICourse | null>(null)
const chaptersList = ref<IChapter[]>([])


const currentPlayerTime = ref<number>(0)
const currentPlayerTitle = ref<string>('')

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

const updatePlayerTime = (time: number, title: string): void => {
  currentPlayerTime.value = time
  currentPlayerTitle.value = title
}

onMounted(() => {
  getOneCourse()
  getAllChapters()
})
</script>