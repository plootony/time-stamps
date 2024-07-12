<template>
  <the-modal
    :modal-show="isShow"
    @modal-close="close"
  >
    <template #header>{{ title }}</template>

    <template #content>{{ desc }}</template>

    <template #footer>
      <button @click="close" class="btn btn--outline">Отмена</button>

      <button @click="confirm" :class="`btn btn--${confirmType}`">{{ confirmText }}</button>
    </template>
  </the-modal>
</template>

<script setup lang="ts">
import {defineProps, defineEmits} from 'vue'
import TheModal from '@/components/TheModal.vue'

interface IConfirm {
  isShow: boolean;
  title: string;
  desc: string;
  confirmText: string;
  confirmType: string;
}

const props = defineProps<IConfirm>()

const emits = defineEmits(['close', 'confirm'])

/** Закрытвает диалоговое окно */
const close = (): void => {
  emits('close')
}

/** Подтверждает действие */
const confirm = (): void => {
  emits('confirm')
}
</script>
