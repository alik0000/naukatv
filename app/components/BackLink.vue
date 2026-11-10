<template>
  <NuxtLink to="/" class="back-link">
    <span>Назад</span>
  </NuxtLink>
</template>

<style scoped lang="less">
.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-text);
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  transition: color .35s ease-in-out;

  &::before {
    content: '';
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background-color: currentColor;
    -webkit-mask: url('/images/icons/arrow-left.svg') center / contain no-repeat;
    mask: url('/images/icons/arrow-left.svg') center / contain no-repeat;
  }

  &:hover {
    color: var(--color-accent);
  }
}
</style>
