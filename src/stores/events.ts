import {defineStore} from 'pinia'
import type {IEvent} from '@/interfaces/IEvent'
import {ref} from "vue";

export const useEventsStore = defineStore('events', () => {
    const events = ref([] as IEvent[])
    const eventData = ref<IEvent>({
        id: Date.now(),
        title: '',
        start: '',
        end: '='
    })
    const currentEventId = ref<Number>(0)
    const currentEventTitle = ref<string>('')

    return {
        events,
        eventData,
        currentEventId,
        currentEventTitle
    }
})
