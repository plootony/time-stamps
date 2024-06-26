import {defineStore} from 'pinia'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {type Ref, ref} from 'vue'
import type {ICourse} from '@/interfaces/ICourse'
import type {IChapter} from '@/interfaces/IChapter'
import type {IEvent} from '@/interfaces/IEvent'

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
    const chapterText = ref<string>('')

    const events = ref([
        {
            id: 1,
            title: 'Event 1',
            start: '2024-06-22',
            end: '2024-06-22',
        },
        {
            id: 2,
            title: 'Event 2',
            start: '2024-06-22',
            end: '2024-06-22',
        },
        {
            id: 3,
            title: 'Event 3',
            start: '2024-06-22',
            end: '2024-06-22',
        },
    ] as IEvent[])
    const eventData = ref<IEvent>({
        id: Date.now(),
        title: '',
        start: '',
        end: '='
    })
    const currentEventId = ref<Number>(0)
    const currentEventTitle = ref<string>('')

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
        events,
        eventData,
        currentEventId,
        currentEventTitle
    }
})
