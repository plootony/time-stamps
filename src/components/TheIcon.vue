<template>
  <svg :class="['icon', `icon--${name}`, modify]">
    <use :xlink:href="`/src/assets/icons/sprite.svg#${name}`"></use>
  </svg>
</template>

<script setup lang='ts'>
interface IIcon {
  name: string,
  modify?: string
}

const props = defineProps<IIcon>()
</script>