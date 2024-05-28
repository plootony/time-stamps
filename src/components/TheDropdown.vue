<template>
  <div :class="['dropdown', modify]">
    <button
        @click="toggleDropdown"
        class="dropdown__btn"
    >

      <slot name="button-content">
        {{ name ? name : '' }}
      </slot>
    </button>

    <div v-if="isOpen" class="dropdown__body">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

interface IDropdown {
  name?: string;
  icon?: string;
  modify?: string
}

const props = defineProps<IDropdown>();
const isOpen = ref<boolean>(false);

const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};
</script>
