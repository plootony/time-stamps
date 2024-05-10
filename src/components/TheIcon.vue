<template>
  <svg :class="['icon', `icon--${name}`, modify]">
    <use :xlink:href="`src/assets/icons/sprite.svg#${name}`"></use>
  </svg>
</template>

<script setup lang="ts">
import type {IIcon} from "@/interfaces/IIcon";

defineProps<IIcon>()
</script>