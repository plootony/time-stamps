import {defineStore} from 'pinia'
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {type Ref, ref} from 'vue'
import type {ICourse} from "@/interfaces/ICourse"
import type {IChapter} from "@/interfaces/IChapter"

export const useCourseStore = defineStore('course', () => {
    const db = getFirestore()
    const userId = getAuth().currentUser?.uid

    const courses = ref<ICourse[]>([])
    const courseDetails = ref<ICourse | null>(null)

    const isPlayerReady = ref<boolean>(false)
    const playerTime = ref<number>(0)
    const playerTitle = ref<string>('')
    const playerLink = ref<string>('')

    const chapters = ref([]) as Ref<IChapter[]>
    const chapterId = ref<string>('')
    const chapterText = ref<string>('12')

    return {
        db,
        userId,
        courses,
        chapters,
        playerTime,
        courseDetails,
        chapterId,
        chapterText,
        isPlayerReady,
        playerTitle,
        playerLink,
    }
})
