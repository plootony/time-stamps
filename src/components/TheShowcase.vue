<template>
  <div class="showcase">
    <div class="showcase__heading">
      <the-heading/>

      <course-add />
    </div>


    <course-list />
  </div>
</template>

<script setup lang="ts">
import TheHeading from "@/components/TheHeading.vue"
import CourseList from "@/components/CourseList.vue"
import CourseAdd from "@/components/CourseAdd.vue"
</script>

