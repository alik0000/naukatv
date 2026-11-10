<template>
  <div class="material-editor">
    <div ref="holder" />
  </div>
</template>

<script setup lang="ts">
import type EditorJS from '@editorjs/editorjs'
import type { BlockToolConstructable, OutputData } from '@editorjs/editorjs'

const I18N_OPTIONS = {
  messages: {
    toolNames: {
      Text: 'Параграф',
      Heading: 'Заголовок',
      Quote: 'Цитата',
    },
    tools: {
      header: {
        'Heading 1': 'Заголовок 1',
        'Heading 2': 'Заголовок 2',
        'Heading 3': 'Заголовок 3',
      },
    },
    ui: {
      toolbar: {
        toolbox: {
          Add: 'Добавить',
        },
      },
      popover: {
        Filter: 'Поиск',
        'Nothing found': 'Ничего не найдено',
        'Convert to': 'Преобразовать в',
      },
      blockTunes: {
        toggler: {
          'Click to tune': 'Настройки блока',
          'or drag to move': 'или перетащите',
        },
      },
    },
    blockTunes: {
      delete: {
        Delete: 'Удалить',
        'Click to delete': 'Подтвердить удаление',
      },
      moveUp: {
        'Move up': 'Переместить вверх',
      },
      moveDown: {
        'Move down': 'Переместить вниз',
      },
    },
  },
}
const props = defineProps<{
  initialData?: OutputData
}>()

const holder = ref<HTMLDivElement | null>(null)

let editor: EditorJS | undefined
let ready = false
let disposed = false

const initEditor = async () => {
  try {
    const [
      { default: Editor },
      { default: Header },
      { default: Quote },
    ] = await Promise.all([
      import('@editorjs/editorjs'),
      import('@editorjs/header'),
      import('@editorjs/quote'),
    ])

    if (disposed || !holder.value) return

    editor = new Editor({
      holder: holder.value,
      data: props.initialData,
      placeholder: 'Введите текст...',
      inlineToolbar: false,

      i18n: I18N_OPTIONS,

      tools: {
        header: {
          class: Header as unknown as BlockToolConstructable,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 1,
            placeholder: 'Введите заголовок',
          },
        },
        quote: {
          class: Quote as unknown as BlockToolConstructable,
          config: {
            quotePlaceholder: 'Введите цитату',
            captionPlaceholder: 'Автор цитаты',
          },
        },
      },
    })

    await editor.isReady

    if (disposed) {
      editor.destroy()
      return
    }

    ready = true
  } catch (error) {
    console.error('Ошибка при инициализации EditorJS:', error)
  }
}
const destroyEditor = () => {
  disposed = true

  if (editor && ready) {
    editor.destroy()
    ready = false
  }
}
const save = async(): Promise<OutputData> => {
  if (!editor || !ready || disposed) {
    throw new Error('Редактор ещё не готов')
  }

  return editor.save()
}
onMounted(() => {
  initEditor()
})
onBeforeUnmount(() => {
  destroyEditor()
})
defineExpose({ save })
</script>

<style lang="less">
.material-editor {
  height: 340px;
  overflow-y: auto;

  .codex-editor {
    .codex-editor__redactor {
      padding-bottom: 0 !important;
    }

    //.ce-block__content {
    //  max-width: 775px;
    //}
    //
    //.ce-toolbar__content {
    //  max-width: 860px;
    //}

    .ce-toolbar__plus,
    .ce-toolbar__settings-btn {
      color: var(--color-placeholder);
      width: 32px;
      height: 32px;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .ce-paragraph.cdx-block {
      font-family: inherit;
      color: var(--color-text);
      font-size: 20px;
      line-height: 1.2;

      &::before{
        color: var(--color-placeholder);
      }
    }
  }
}
</style>
