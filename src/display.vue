<script lang="ts">
import { useStores } from "@directus/extensions-sdk";
import { defineComponent } from "vue";
import { relatedCollection } from "./lib/relatedCollection";

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: null,
    },
    collection: { type: String, required: true },
    field: { type: String, required: true },
    iconColumn: { type: String },
    textColumn: { type: String },
    colorColumn: { type: String },
    secondaryTextColumn: { type: String },
    noBackground: { type: Boolean },
  },
  setup: (props) => {
    const items = Array.isArray(props.value)
      ? props.value.map((item) => item[Object.keys(item)[0] as any])
      : [props.value];

    const labels = items.map((item) => {
      return {
        color: item[props.colorColumn ?? "colour"],
        text:
          item[props.textColumn ?? "name"] ??
          item[props.secondaryTextColumn ?? "name"],
        icon: item[props.iconColumn ?? "icon"],
        foreground: null,
        background: props.noBackground ? "transparent" : null,
      };
    });

    // The icon column's own display, so the icon draws however that field is set to draw — a
    // custom icon display included — rather than as a Material Symbols font name
    const { useFieldsStore } = useStores();
    const target = relatedCollection(props.collection, props.field);
    const iconField = target
      ? useFieldsStore().getField(target, props.iconColumn ?? "icon")
      : null;
    const iconDisplay: string | null = iconField?.meta?.display ?? null;
    const iconDisplayOptions = iconField?.meta?.display_options ?? {};

    return { labels, iconDisplay, iconDisplayOptions };
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
      <span v-if="item.icon" class="label-icon" :style="{ color: item.color }">
        <component
          :is="`display-${iconDisplay}`"
          v-if="iconDisplay"
          v-bind="iconDisplayOptions"
          :value="item.icon"
        />
        <v-icon v-else :name="item.icon" />
      </span>
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

<style scoped>
/* What v-icon's `small` and `left` gave it; displays that draw an icon size it off --v-icon-size */
.label-icon {
  --v-icon-size: 1rem;
  display: inline-flex;
  vertical-align: middle;
  margin-inline-end: 0.4375rem;
}
</style>
