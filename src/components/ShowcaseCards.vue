<template>
  <showcase-dialog/>

  <div class="showcase__cards">
    <showcase-card
        v-for="course in courses"
        :key="course.id"
        :course="course"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import ShowcaseCard from "@/components/ShowcaseCard.vue";
import type {ICourse} from "@/interfaces/ICourse";
import ShowcaseDialog from "@/components/ShowcaseDialog.vue";

const courses = ref<ICourse[]>([]);
</script>