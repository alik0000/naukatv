<template>
  <div>
    <AppHeader>
      <template #actions>
        <button
          class="material-create__submit"
          type="submit"
          form="material-create-form"
          :disabled="isLoading"
        >
          Сохранить
        </button>
      </template>
    </AppHeader>

    <main class="material-create">
      <header class="material-create__header">
        <BackLink />

        <h1 class="material-create__title">
          Создание материала
        </h1>
      </header>

      <form
        id="material-create-form"
        class="material-create-form"
        :aria-busy="isLoading"
        @submit.prevent="handleSubmit"
      >
        <div class="material-create-form__fields">
          <div class="material-create-form__field">
            <input
              v-model="title"
              class="material-create-form__field-title"
              name="title"
              type="text"
              required
              placeholder="Введите заголовок"
              aria-label="Заголовок материала"
              :maxlength="80"
              :disabled="isLoading"
            >
          </div>

          <div class="material-create-form__field">
            <textarea
              v-model="shortDescription"
              class="material-create-form__field-description"
              name="short_description"
              placeholder="Введите краткое описание..."
              aria-label="Краткое описание"
              :maxlength="255"
              required
              :disabled="isLoading"
            />
          </div>
        </div>

        <MaterialEditor ref="materialEditor" :inert="isLoading" />
      </form>

      <div
        v-if="submitError"
        class="material-create__error"
        role="alert"
      >
        {{ submitError }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { MaterialEditorHandle } from '../../../shared/types/editor'
import type { CreateMaterialPayload } from '../../../shared/types/create-material'
import { editorToHtml } from '../../../shared/utils/editor'

const title = ref('')
const shortDescription = ref('')
const isLoading = ref(false)
const submitError = ref('')
const materialEditorRef = useTemplateRef<MaterialEditorHandle>('materialEditor')

const NOTIFICATION_DURATION = 5000
let notificationTimer: ReturnType<typeof setTimeout> | undefined

const clearError = () => {
  clearTimeout(notificationTimer)
  submitError.value = ''
}

const showError = (message: string) => {
  clearError()
  submitError.value = message
  notificationTimer = setTimeout(clearError, NOTIFICATION_DURATION)
}

const saveMaterial = async () => {
  const editor = materialEditorRef.value

  if (!editor) {
    throw new Error('Редактор ещё не готов.')
  }

  const document = await editor.save()
  const payload: CreateMaterialPayload = {
    title: title.value.trim(),
    short_description: shortDescription.value.trim(),
    datetime: new Date().toISOString(),
    description_html: editorToHtml(document),
    description_json: document,
  }

  return $fetch('/api/materials', {
    method: 'POST',
    body: payload,
    retry: 0,
  })
}

const handleSubmit = async () => {
  if (isLoading.value) return

  clearError()
  isLoading.value = true

  try {
    const material = await saveMaterial()
    await navigateTo(`/materials/${encodeURIComponent(material.id)}`)
  } catch {
    showError('Не удалось сохранить или открыть материал. Попробуйте ещё раз.')
  } finally {
    isLoading.value = false
  }
}

onBeforeUnmount(() => clearTimeout(notificationTimer))

useHead({
  title: 'Создание материала',
  htmlAttrs: {
    lang: 'ru'
  }
})
useSeoMeta({
  robots: 'noindex'
})
</script>

<style scoped lang="less">
.material-create {
  width: 100%;
  max-width: calc(
    var(--article-width) + var(--container-padding) * 2
  );
  margin-inline: auto;
  padding: var(--space-12) var(--space-6);

  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
    margin-bottom: var(--space-12);
  }

  &__title {
    font-size: 32px;
    line-height: 1.3;
    overflow-wrap: anywhere;

    .mobile({
      margin-bottom: var(--space-8);
      font-size: 26px;
    });
  }

  &__submit {
    min-height: 44px;
    padding: var(--space-2) var(--space-6);
    border: 0;
    border-radius: var(--radius-button);
    background-color: var(--color-action-background);
    color: var(--color-accent);

    &:hover {
      background-color: var(--color-action-hover);
    }

    &:disabled {
      opacity: 0.6;
    }

    .mobile({
      padding-inline: var(--space-3);
      font-size: 14px;
    });
  }

  &__error {
    position: fixed;
    left: 50%;
    bottom: var(--space-6);
    z-index: 1000;
    width: max-content;
    max-width: calc(100% - var(--space-6) * 2);
    padding: var(--space-2) var(--space-4);
    border: 1px solid currentColor;
    border-radius: var(--radius-button);
    background-color: var(--color-surface);
    color: var(--color-error);
    text-align: center;
    transform: translateX(-50%);
  }
}

.material-create-form {
  display: grid;
  gap: var(--space-10);
  padding: var(--space-12) var(--space-6);
  border-radius: var(--radius-article);
  background-color: var(--color-surface);

  &__fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    padding-left: 106px;

    .mobile({
      padding-left: 0;
    });
  }

  &__field-title,
  &__field-description {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    border-radius: 0;
    font-family: inherit;
    background: transparent;
    color: var(--color-text);

    &::placeholder {
      color: var(--color-placeholder);
      opacity: 1;
    }

    &:focus-visible {
      outline: none;
    }
  }

  &__field-title {
    font-size: 36px;
    font-weight: 600;
    line-height: 1.2;
  }

  &__field-description {
    resize: none;
    font-size: 22px;
    line-height: 1;
  }

  .mobile({
    &__field-title {
      font-size: 28px;
    }

    &__field-description {
      font-size: 20px;
    }
  });
}
</style>
