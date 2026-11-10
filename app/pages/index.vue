<template>
  <div>
    <AppHeader />

    <section class="materials" :aria-busy="isLoading">
      <h2 class="materials__title">
        Материалы
      </h2>

      <span
        v-if="isLoading"
        class="materials__message"
        role="status"
      >
        Загрузка…
      </span>

      <div
        v-else-if="error"
        class="materials__message"
        role="alert"
      >
        <p>Не удалось загрузить материалы.</p>
        <button
          class="materials__retry"
          type="button"
          @click="refresh()"
        >
          Повторить
        </button>
      </div>

      <div v-else class="materials__cards">
        <template v-if="!!sortedMaterials.length">
          <MaterialCard
            v-for="material in sortedMaterials"
            :key="material.id"
            :material="material"
          />
        </template>

        <span v-else class="materials__message">
          Пока нет материалов.
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Материалы',
  htmlAttrs: {
    lang: 'ru',
  },
})

const { data: materials, status, error, refresh } = await useMaterials()
const isLoading = computed(() => status.value === 'pending')

const sortedMaterials = computed(() => {
  return [...materials.value].sort((first, second) => {
    const dateDiff = Date.parse(second.datetime) - Date.parse(first.datetime)

    if (dateDiff !== 0) {
      return dateDiff
    }

    return (first.id < second.id) ? -1 : (first.id > second.id) ? 1 : 0
  })
})
</script>

<style scoped lang="less">
.materials {
  width: 100%;
  max-width: calc(
    var(--container-width) + var(--container-padding) * 2
  );
  margin-inline: auto;
  padding: var(--space-12) var(--container-padding);

  .mobile({
    padding: var(--space-8) var(--space-4);
  });

  &__title {
    font-size: 36px;
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: var(--space-12);

    .mobile({
      font-size: 28px;
      margin-bottom: var(--space-8);
    });
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-10);

    .tablet({
      grid-template-columns: repeat(2, minmax(0, 1fr));
    });

    .desktop({
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-6);
    });

    .mobile({
      grid-template-columns: minmax(0, 1fr);
      gap: var(--space-4);
    });
  }

  &__message {
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-text-muted);
  }

  &__retry {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--color-accent);
    font: inherit;
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: 3px;
    }
  }
}
</style>
