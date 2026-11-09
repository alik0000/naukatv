<template>
  <main class="materials-page">
    <h1 class="materials-page__title">
      Lorem ipsum dolor sit amet
    </h1>

    <p class="materials-page__description">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Alias autem corporis impedit incidunt porro.
      Alias aperiam blanditiis dolorem explicabo natus nostrum sequi!
      Commodi ex ipsam numquam officia perferendis ratione voluptate.
    </p>
  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'Материалы',
  htmlAttrs: {
    lang: 'ru',
  },
})
</script>

<style scoped lang="less">
.materials-page {
  padding: 48px 24px;

  &__title {
    margin-bottom: 16px;
    font-size: 32px;
    line-height: 1.2;
  }

  &__description {
    color: var(--color-text);
    font-size: 18px;
    line-height: 1.5;
  }
}
</style>
