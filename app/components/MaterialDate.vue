<template>
  <time class="material-date" :datetime="datetime">
    {{ formattedDate }}
  </time>
</template>

<script setup lang="ts">
const props = defineProps<{
  datetime: string
}>()

const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const formattedDate = computed(() => {
  return formatter.format(new Date(props.datetime))
})
</script>

<style scoped lang="less">
.material-date {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-placeholder);
  font-size: 16px;
  line-height: 1;

  &::before {
    content: '';
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    background-color: currentColor;
    -webkit-mask: url('/images/icons/calendar.svg') center / contain no-repeat;
    mask: url('/images/icons/calendar.svg') center / contain no-repeat;
  }
}
</style>
