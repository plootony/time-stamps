<template>
  <h2 v-if="courseStore.playerTitle" class="editor__title">{{ courseStore.playerTitle }}</h2>

  <div v-show="courseStore.chapters.length" class="editor">
    <!--  TODO: Привести верстку в порядок -->
    <div
        style="width: 20%;
        display: flex;
        flex-direction: column;
        gap: 16px;"
    >
      <div class="editor__toolbar" id="toolbar">
        <span class="editor__toolbar-title">Оформление текста</span>
        <span class="ql-formats">
        <button class="ql-bold" title="Жирнывй"></button>
        <button class="ql-italic" title="Курсив"></button>
        <button class="ql-underline" title="Подчеркивание"></button>
        <button class="ql-strike" title="Зачеркнутый"></button>
      </span>

        <span class="editor__toolbar-title">Заголовки</span>

        <select class="ql-header" title="Заголовки">
          <option value="1">Заголовок 1</option>
          <option value="2">Заголовок 2</option>
          <option value="">Обычный текст</option>
        </select>

        <span class="editor__toolbar-title">Размер текста</span>

        <select class="ql-size" title="Размер текста">
          <option value="small">Маленький</option>
          <option value="">Обычный</option>
          <option value="large">Большой</option>
          <option value="huge">Огромный</option>
        </select>

        <span class="editor__toolbar-title">Выбор цвета</span>

        <span class="ql-formats">
        <select class="ql-color" title="Цвет текста"></select>
        <select class="ql-background" title="Цвет фона"></select>
      </span>

        <span class="editor__toolbar-title">Списки</span>

        <span class="ql-formats">
        <button class="ql-list" value="ordered" title="Нумерованный список"></button>
        <button class="ql-list" value="bullet" title="Обычный список"></button>
      </span>

        <span class="editor__toolbar-title">Выравнивание</span>

        <span class="ql-formats">
        <select class="ql-align">
          <option value="" title="Левый край" selected>Левый край</option>
          <option value="center" title="Центер">По центру</option>
          <option value="right" title="Правый край">Правый край</option>
          <option value="justify" title="По ширине">По ширине</option>
        </select>
      </span>

        <span class="editor__toolbar-title">Добавление объектов</span>

        <span class="ql-formats">
        <button class="ql-code-block" title="Code Block"></button>
        <button class="ql-blockquote" title="Blockquote"></button>
        <button class="ql-link" title="Insert Link"></button>
        <button class="ql-clean" title="Remove Formatting"></button>
      </span>
      </div>

      <button
          class="btn btn--primary"
          @click="saveChapter"
      >Сохранить главу
      </button>
    </div>

    <div v-show="courseStore.chapters.length" style="width: 80%;">
      <QuillEditor
          :options="editorOptions"
          @ready="ready"
          ref="editorRef"
          @text-change="highlightCode"
      />
    </div>
  </div>

  <div v-show="courseStore.chapters.length === 0">
    Создайте главу, для того, чтобы начать конспектировать
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {useCourseStore} from "@/stores/course"
import {doc, updateDoc} from 'firebase/firestore'
import {useRoute} from 'vue-router'
import hljs from 'highlight.js'
import {QuillEditor} from '@vueup/vue-quill'
import {type QuillOptionsStatic} from 'quill'


const router = useRoute()
const courseStore = useCourseStore()
const courseId = router.params.id as string
const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null)
const isReady = ref<boolean>(false)
const editorOptions: QuillOptionsStatic = {
  modules: {
    toolbar: '#toolbar',
  },
  placeholder: 'Начните свою историю здесь...',
}

/** Проверка загрузки эдитора */
const ready = (): void => {
  isReady.value = true
}

/** Получаем текст главы из эдитора */
const saveChapter = async (): Promise<void> => {
  const chapterRef = doc(courseStore.db, `users/${courseStore.userId}/courses/${courseId}/chapters/${courseStore.chapterId}`)
  try {
    if (editorRef.value === null || !isReady.value) return
    courseStore.chapterText = editorRef.value.getHTML()
    await updateDoc(chapterRef, {
      text: courseStore.chapterText
    })
    console.log('Глава успешно сохранена!')
  } catch (error) {
    console.error('Сохранить главу не удалось!', error)
  }
}

/** Записываем текст главы в эдитор */
const setChapter = (): void => {
  if (editorRef.value === null || !isReady.value) return

  if (typeof courseStore.chapterText === 'undefined') {
    courseStore.chapterText = ''
  }

  editorRef.value.setHTML(courseStore.chapterText)
}

/** Подсветка кода */
const highlightCode = (): void => {
  const elements = document.querySelectorAll('.ql-syntax');
  elements.forEach((block) => {
    hljs.highlightBlock(block as HTMLElement);
  })
}

watch(() => courseStore.chapterId, (): void => {
  setChapter()
})
</script>

