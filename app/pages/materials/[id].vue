<template>
  <div>
    <AppHeader />

    <main class="material-details">
      <BackLink />

      <article class="material-details__article">
        <MaterialDate :datetime="material.datetime" />

        <h1 class="material-details__title">
          {{ material.title }}
        </h1>

        <p class="material-details__short-description">
          {{ material.short_description }}
        </p>

        <div
          class="material-details__content"
          v-html="material.description_html"
        />
      </article>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()

const materialId = String(route.params.id)

const { data: materials, error } = await useMaterials()
const material = materials.value.find(item => item.id === materialId)

if (error.value) {
  throw createError({
    statusCode: 502,
    statusMessage: 'Failed to load material',
    message: 'Не удалось загрузить материал. Попробуйте позже.',
  })
}

if (!material) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Material not found',
    message: 'Материал не найден.',
  })
}

const description = material.short_description || material.title

useHead({
  htmlAttrs: {
    lang: 'ru',
  },
})
useSeoMeta({
  title: material.title,
  description,

  ogType: 'article',
  ogTitle: material.title,
  ogDescription: description,
  ogLocale: 'ru_RU',

  articlePublishedTime: material.datetime,
})
</script>

<style scoped lang="less">
.material-details {
  width: 100%;
  max-width: calc(
    var(--article-width) + var(--container-padding) * 2
  );
  margin-inline: auto;
  padding: var(--space-12) var(--container-padding);

  .mobile({
    padding: var(--space-8) var(--space-4);
  });

  &__article {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    margin-top: var(--space-8);
    padding: var(--article-padding);
    border-radius: var(--radius-article);
    background-color: var(--color-surface);

    .mobile({
      margin-top: var(--space-8);
      padding: var(--space-6) var(--space-4);
      border-radius: var(--radius-card);
      gap: var(--space-6);
    });
  }

  &__title {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;

    .mobile({
      font-size: 24px;
    });
  }

  &__short-description {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.4;
    overflow-wrap: anywhere;
    white-space: pre-wrap;

    .mobile({
      font-size: 18px;
    });
  }

  &__content {
    :deep(blockquote) {
      margin-inline: 0;
      padding-left: var(--space-6);
      border-left: 3px solid var(--color-placeholder);
      color: var(--color-text-muted);
    }
  }
}
</style>
