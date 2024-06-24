<template>
  <svg :class="['icon', `icon--${name}`, modify]">
    <use :xlink:href="iconUrl"></use>
  </svg>
</template>

<script setup lang='ts'>
interface IIcon {
  name: string,
  modify?: string
}

const props = defineProps<IIcon>()
const iconUrl = 'src/assets/icons/sprite.svg#' + props.name
</script>