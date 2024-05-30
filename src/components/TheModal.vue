<template>
  <Teleport to="body">
    <div v-if="modalShow" class="modal">
      <div class="modal__body">
        <div class="modal__header">
          <h2 class="modal__title">
            <slot name="header">Заголовок по умолчанию</slot>
          </h2>

          <button class="modal__close" @click="modalClose">
            <TheIcon name="close"/>
          </button>
        </div>

        <div class="modal__content">
          <slot name="content">Контент по умолчанию</slot>
        </div>

        <div class="modal__footer">
          <slot name="footer">Футер по умолчанию</slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang='ts'>
import TheIcon from '@/components/TheIcon.vue'

interface IModal {
  modalShow: boolean
}

defineProps<IModal>()
const emit = defineEmits(['modalClose'])

const modalClose = () => {
  emit('modalClose')
}
</script>