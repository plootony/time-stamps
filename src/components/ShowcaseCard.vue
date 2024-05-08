<template>
  <div class="card">
    <img
        class="card__image"
        :src="`src/assets/images/${card.image}.jpg`"
        width="200" height="170"
        :alt="card.title">

    <div class="card__body">
      <h2 class="card__title">{{ card.title }}</h2>

      <p class="card__subtitle">{{ card.desc }}</p>

      <div class="tags">
        <span
            v-for="tag in card.tags"
            :key="tag"
            class="tag"
        >{{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ICard} from "@/interfaces/ICard";

defineProps<{ card: ICard }>()
</script>