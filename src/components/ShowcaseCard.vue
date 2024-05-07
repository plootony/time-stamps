<template>
  <div class="card">
    <img
        class="card__image"
        :src="`@/assets/images/${image}.jpg`"
        width="200" height="170"
        alt="card-image">

    <div class="card__body">
      <h2 class="card__title">{{ title }}</h2>

      <p class="card__subtitle">{{ desc }}</p>

      <div class="tags">
        <div v-for="tag in tags" class="tag">
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {ICard} from "@/interfaces/ICard";

defineProps<ICard>()
</script>