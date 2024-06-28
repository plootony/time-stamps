import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {IEvent} from '@/interfaces/IEvent'

export const useEventsStore = defineStore('events', () => {
    const events = ref([] as IEvent[])
    return {
        events
    }
})
