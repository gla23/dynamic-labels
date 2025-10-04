<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: null,
    },
    iconColumn: { type: String },
    textColumn: { type: String },
    colorColumn: { type: String },
    noBackground: { type: Boolean },
  },
  setup: (props) => {
    const items = Array.isArray(props.value)
      ? props.value.map((item) => item[Object.keys(item)[0] as any])
      : [props.value];

    const labels = items.map((item) => ({
      color: item[props.colorColumn ?? "colour"],
      text: item[props.textColumn ?? "name"],
      icon: item[props.iconColumn ?? "icon"],
      foreground: null,
      background: props.noBackground ? "transparent" : null,
    }));

    return { labels };
  },
});

// const props = withDefaults(
//   defineProps<{
//     value: object | object[];
//     iconColumn: string;
//     textColumn: string;
//     colorColumn: string;
//     noBackground: boolean;
//   }>(),
//   {
//     noBackground: false,
//   }
// );
// const items = computed(() => {
//   const items = Array.isArray(props.value)
//     ? props.value.map((item) => item[Object.keys(item)[0] as any])
//     : [props.value];

//   const labels = items.map((item) => ({
//     color: item[props.colorColumn ?? "colour"],
//     text: item[props.textColumn ?? "name"],
//     icon: item[props.iconColumn ?? "icon"],
//     foreground: null,
//     background: null,
//   }));

//   return labels;
// });
</script>

<template>
  <span class="display-labels">
    <v-chip
      v-for="item in labels"
      :key="item.text"
      :style="{
        '--v-chip-color': item.foreground,
        '--v-chip-background-color': item.background,
      }"
      small
      disabled
      label
      :class="{ 'has-icon': !!item.icon || !!item.color }"
      style="margin-right: 8px; padding-left: 4px"
    >
      <v-icon
        v-if="item.icon"
        :name="item.icon"
        :color="item.color"
        left
        small
      />
      <display-color
        v-else-if="item.color"
        class="inline-dot"
        style="margin-right: 4px"
        :value="item.color"
      />
      {{ item.text }}
    </v-chip>
  </span>
</template>
