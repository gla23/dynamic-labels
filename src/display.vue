<script lang="ts">
import { computed, defineComponent } from "vue";
import { resolveColumns } from "./lib/columns";
import { relatedCollection } from "./lib/relatedCollection";
import { memo, stores } from "./lib/stores";

export default defineComponent({
  props: {
    value: {
      type: [Object, Array],
      default: null,
    },
    collection: { type: String, required: true },
    field: { type: String, required: true },
    // undefined when never set, so the default column is used
    iconColumn: { type: String, default: undefined },
    textColumn: { type: String, default: undefined },
    colorColumn: { type: String, default: undefined },
    secondaryTextColumn: { type: String, default: undefined },
    noBackground: { type: Boolean },
  },
  setup: (props) => {
    const { useFieldsStore } = stores();
    const target = computed(() => relatedCollection(props.collection, props.field));
    const columns = computed(() => resolveColumns(props, target.value));

    const labels = computed(() => {
      const items: any[] = Array.isArray(props.value)
        ? props.value.map((item) => item?.[Object.keys(item)[0] as any])
        : [props.value];
      const { iconColumn, colorColumn, textColumn, secondaryTextColumn } = columns.value;

      return items
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
          color: colorColumn ? item[colorColumn] : null,
          text:
            (textColumn ? item[textColumn] : null) ??
            (secondaryTextColumn ? item[secondaryTextColumn] : null),
          icon: iconColumn ? item[iconColumn] : null,
          foreground: null,
          background: props.noBackground ? "transparent" : null,
        }));
    });

    // The icon column's own display, so the icon draws however that field is set to draw — a
    // custom icon display included — rather than as a Material Symbols font name
    const iconField = computed(() => {
      const collection = target.value;
      const iconColumn = columns.value.iconColumn;
      if (!collection || !iconColumn) return null;
      return memo(`field:${collection}.${iconColumn}`, () =>
        useFieldsStore().getField(collection, iconColumn)
      );
    });
    const iconDisplay = computed<string | null>(() => iconField.value?.meta?.display ?? null);
    const iconDisplayOptions = computed(() => iconField.value?.meta?.display_options ?? {});

    return { labels, iconDisplay, iconDisplayOptions };
  },
});
</script>

<template>
  <span class="display-labels">
    <v-chip
      v-for="(item, index) in labels"
      :key="index"
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
