<template>
  <div class="editor">
    <div class="editor__toolbar" id="toolbar">
      <span class="editor__toolbar-title">Оформелние текста</span>

      <span class="ql-formats">
        <button class="ql-bold" title="Bold"></button>
        <button class="ql-italic" title="Italic"></button>
        <button class="ql-underline" title="Underline"></button>
        <button class="ql-strike" title="Strike"></button>
      </span>

      <span class="editor__toolbar-title">Заголовки</span>

      <select class="ql-header" title="Header">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="">Normal</option>
      </select>

      <span class="editor__toolbar-title">Шрифт</span>

      <select class="ql-font" title="Font">
        <option value="">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      <span class="editor__toolbar-title">Размер текста</span>

      <select class="ql-size" title="Size">
        <option value="small">Small</option>
        <option value="">Normal</option>
        <option value="large">Large</option>
        <option value="huge">Huge</option>
      </select>

      <span class="editor__toolbar-title">Выбор цвета</span>

      <span class="ql-formats">
        <select class="ql-color" title="Text Color"></select>
        <select class="ql-background" title="Background Color"></select>
      </span>

      <span class="editor__toolbar-title">Списки</span>

      <span class="ql-formats">
        <button class="ql-list" value="ordered" title="Ordered List"></button>
        <button class="ql-list" value="bullet" title="Bullet List"></button>
      </span>

      <span class="editor__toolbar-title">Выравнивание</span>

      <span class="ql-formats">
        <select class="ql-align" title="Align">
          <option value="" selected>Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
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
    <vue-quill v-model:content="content" :options="editorOptions"></vue-quill>
  </div>
</template>

<script>
import {ref} from 'vue';
import {QuillEditor} from '@vueup/vue-quill';

export default {
  components: {
    'vue-quill': QuillEditor
  },
  setup() {
    const content = ref('');
    const editorOptions = {
      modules: {
        toolbar: '#toolbar'
      },
      theme: 'snow'
    };

    return {
      content,
      editorOptions
    };
  }
};
</script>