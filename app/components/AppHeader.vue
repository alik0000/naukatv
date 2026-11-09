<template>
  <header class="app-header">
    <div class="app-header__container">
      <NuxtLink to="/" class="app-header__logo-wrapper">
        <img
          src="/images/icons/logo.svg"
          alt="Моя планета"
          class="app-header__logo"
        >
      </NuxtLink>

      <div class="app-header__actions">
        <slot name="actions">
          <NuxtLink to="/" class="app-header__action">
            Создать материал
          </NuxtLink>
        </slot>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
.app-header {
  background-color: var(--color-surface);

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-6);
    width: 100%;
    max-width: calc(
      var(--container-width) + var(--container-padding) * 2
    );
    min-height: var(--header-height);
    margin-inline: auto;
    padding: var(--space-4) var(--container-padding);

    .mobile({
      gap: var(--space-4);
    })
  }

  &__logo-wrapper {
    display: block;
    width: 114px;
    height: 44px;
    text-decoration: none;

    .mobile({
      width: 94px;
      height: 36px;
    })
  }

  &__logo {
    width: 100%;
    height: 100%;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    padding: var(--space-2) var(--space-6);
    border-radius: var(--radius-button);
    background-color: var(--color-action-background);
    color: var(--color-accent);
    font-size: 16px;
    line-height: 1.25;
    text-align: center;
    text-decoration: none;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--color-action-hover);
    }

    .mobile({
      height: 48px;
      padding-inline: var(--space-3);
      font-size: 14px;
    })
  }
}
</style>
