<template>
  <div>
    <AppHeader>
      <template #actions>
        <button
          class="material-create__submit"
          type="submit"
          form="material-create-form"
          :disabled="isSubmitting || submissionFinished"
        >
          {{ isSubmitting ? 'Сохранение…' : 'Сохранить' }}
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
        novalidate
        :aria-busy="isSubmitting"
        class="material-create-form"
        @submit.prevent="handleSubmit"
      >
        <div class="material-create-form__fields">
          <div class="material-create-form__field">
            <input
              v-model="title"
              class="material-create-form__field-title"
              name="title"
              type="text"
              placeholder="Введите заголовок"
              :maxlength="TITLE_MAX_LENGTH"
            >
          </div>

          <div class="material-create-form__field">
            <textarea
              v-model="shortDescription"
              class="material-create-form__field-description"
              name="short_description"
              placeholder="Введите краткое описание..."
              :maxlength="DESCRIPTION_MAX_LENGTH"
            />
          </div>
        </div>

        <MaterialEditor ref="materialEditor" />
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { EditorValue } from '../../../shared/types/editor'
import {
  localDatetimeToIso,
  toLocalDatetimeInput,
} from '../../utils/datetime'
import type {
  CreateMaterialPayload,
} from '../../../shared/types/create-material'

useHead({
  title: 'Создание материала',
  htmlAttrs: {
    lang: 'ru',
  },
})

const TITLE_MAX_LENGTH = 80
const DESCRIPTION_MAX_LENGTH = 255

const isSubmitting = ref(false)
const submissionFinished = ref(false)
const submitError = ref('')
const title = ref('')
const shortDescription = ref('')
const datetime = ref('')
const editorValue = shallowRef<EditorValue | null>(null)
const createdMaterialId = ref<string | null>(null)
const isOpeningMaterial = ref(false)
const materialEditorRef = useTemplateRef('materialEditor')

const validationMessage = ref('')

onMounted(() => {
  datetime.value = toLocalDatetimeInput(new Date())
})

const {
  data: materials,
  error: materialsError,
  refresh: refreshMaterials,
} = await useMaterials()

async function handleSubmit() {
  if (isSubmitting.value || submissionFinished.value) {
    return
  }

  validationMessage.value = ''
  submitError.value = ''

  const isoDatetime = localDatetimeToIso(datetime.value)
  const document = editorValue.value

  if (!isoDatetime || !document) {
    return
  }

  const payload: CreateMaterialPayload = {
    title: title.value,
    short_description: shortDescription.value,
    datetime: isoDatetime,
    description_html: document.html,
    description_json: {
      type: 'doc',
      content: document.json.content ?? [],
    },
  }

  isSubmitting.value = true

  try {
    const response = await $fetch('/api/materials', {
      method: 'POST',
      body: payload,
      retry: 0,
    })

    createdMaterialId.value = response.id
    submissionFinished.value = true

    validationMessage.value = 'Материал сохранён. Открываем страницу…'

    await openCreatedMaterial()
  } catch (error: unknown) {
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error
        ? error.statusCode
        : undefined

    submitError.value =
      statusCode === 422
        ? 'Сервер отклонил сохранение. Проверьте поля формы.'
        : 'Не удалось подтвердить сохранение. Проверьте список перед повторной отправкой.'
  } finally {
    isSubmitting.value = false
  }
}

async function openCreatedMaterial() {
  if (!createdMaterialId.value || isOpeningMaterial.value) {
    return
  }

  isOpeningMaterial.value = true
  submitError.value = ''

  try {
    await refreshMaterials()

    if (materialsError.value) {
      throw new Error('Failed to refresh materials')
    }

    const material = materials.value.find(
      item => item.id === createdMaterialId.value,
    )

    if (!material) {
      validationMessage.value =
        'Материал сохранён, но пока не появился в списке. Повторите открытие через несколько секунд.'

      return
    }

    await navigateTo(
      `/materials/${encodeURIComponent(material.id)}`,
    )
  } catch {
    submitError.value =
      'Материал сохранён, но открыть его не удалось. Повторите открытие — заново сохранять форму не нужно.'
  } finally {
    isOpeningMaterial.value = false
  }
}
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
    })
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
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
