<template>
  <article class="material-card">
    <NuxtLink :to="pathLink" class="material-card__link">
      <MaterialDate :datetime="material.datetime" />

      <h3 class="material-card__title">
        {{ material.title }}
      </h3>

      <p class="material-card__description">
        {{ material.short_description }}
      </p>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { MaterialListItem } from '../../shared/types/material'

const props = defineProps<{
  material: MaterialListItem
}>()

const pathLink = computed(() => `/materials/${encodeURIComponent(props.material.id)}`)
</script>

<style scoped lang="less">
.material-card {
  border-radius: var(--radius-card);
  background-color: var(--color-surface);
  transition: box-shadow 0.3s ease-in-out;
  overflow: hidden;
  min-height: 273px;

  &:hover,
  &:focus-within {
    box-shadow: 0 20px 32px -12px rgb(20 20 42 / 18%);
  }

  .mobile({
    min-height: 236px;
  });

  &__link {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    height: 100%;
    text-decoration: none;
    padding: var(--space-8) var(--space-6);

    .mobile({
      padding: var(--space-6) var(--space-4);
      gap: var(--space-4);
    })
  }

  &__title {
    color: var(--color-text);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  &__description {
    display: -webkit-box;
    color: var(--color-text-muted);
    font-size: 16px;
    line-height: 1.2;
    overflow: hidden;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }
}
</style>
