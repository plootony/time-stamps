import {ref, watch} from 'vue'
import {useCourseStore} from '@/stores/course'
import type {ICourse} from '@/interfaces/ICourse'

const courseStore = useCourseStore()

export function useFilterCourses() {
  const text = ref<string>('')
  let results = ref([] as ICourse[])

  /** Фильтрует курсы по введенному тексту */
  const filterCourses = (): void => {
    results.value = []

    if (text.value) {
      results.value = courseStore.courses.filter((course: ICourse) => {
        return course.title.toLowerCase().includes(text.value.toLowerCase())
      })
    }
  }

  /** Очищает результаты поиска */
  const searchClear = (): void => {
    results.value = []
    text.value = ''
  }

  /** Следит за изменением инпута*/
  watch(text, () => {
    if (text.value.length > 2) {
      filterCourses()
    } else {
      results.value = []
    }
  })

  return {
    filterCourses,
    searchClear,
    text,
    results
  }
}
