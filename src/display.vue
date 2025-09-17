<template>
  <v-chip
    v-for="item in Array.isArray(value) ? value.map(item => item[Object.keys(item)[0] as any]) : [value]"
    :key="item.value"
    :style="{
      '--v-chip-color': item.foreground,
      '--v-chip-background-color': item.background,
    }"
    small
    disabled
    label
    :class="{ 'has-icon': !!item.icon || !!item.colour }"
    style="margin-right: 8px"
  >
    <v-icon
      v-if="item.icon"
      :name="item.icon"
      :color="item.colour"
      left
      small
    />
    <display-color
      v-else-if="item.colour"
      class="inline-dot"
      :value="item.colour"
    />
    {{ item.name }}
  </v-chip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  // setup: (props) => {
  // console.log(props.value);
  // },
});
</script>
