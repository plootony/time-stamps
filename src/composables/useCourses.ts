import {ref} from 'vue'
import {useCourseStore} from '@/stores/course'
import {query, collection, orderBy, getDocs, getFirestore, deleteDoc, doc} from 'firebase/firestore'
import type {ICourse} from '@/interfaces/ICourse'

const db = getFirestore()

export function useCourses() {
  const isLoading = ref(false)
  const courseStore = useCourseStore()
  const userId = courseStore.userId

  /** Получение курсов*/
  const getCourses = async (): Promise<void> => {
    if (!userId) {
      console.log('Пользователь не найден')
      return
    }

    try {
      isLoading.value = true
      console.log('Пытаюсь получить список курсов')
      const docRef = query(
        collection(db, `users/${userId}/courses/`),
        orderBy('createdAt', 'desc')
      )

      const docSnap = await getDocs(docRef)
      if (docSnap.empty) {
        console.log('Список курсов пуст')
        return
      }

      console.log('Ощищаю старый список курсов')
      courseStore.courses = []

      docSnap.docs.forEach(doc => {
        console.log('Итерируюсь по списку курсов', doc.data())
        courseStore.courses.push(doc.data() as ICourse)
      })
    } catch (error) {
      console.log('Ошибка при получении курса', error)
    } finally {
      isLoading.value = false
    }
  }

  /** Удаляем курс из списка */
  const deleteCourse = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      console.log('Пытаюсь удалить курс')
      await deleteDoc(doc(db, `users/${userId}/courses/`, id))

      const index: number = courseStore.courses.findIndex(course => course.id === id)
      if (index !== -1) {
        courseStore.courses.splice(index, 1)
        console.log('Выбранный курс удален')
      }
    } catch (error) {
      console.log('Ошибка при удалении курса', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    getCourses,
    deleteCourse
  }
}
