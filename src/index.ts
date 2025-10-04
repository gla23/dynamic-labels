import { defineDisplay, useStores } from "@directus/extensions-sdk";
import DisplayComponent from "./display.vue";
import { jumpM2M } from "./lib/jumpM2M";

// See related-values/index.ts in the main codebase for similar example code!

export default defineDisplay({
  id: "dynamic-labels",
  name: "Dynamic Labels",
  icon: "label",
  description: "Display label(s) from columns in the related table",
  component: DisplayComponent,
  types: ["alias", "integer", "uuid", "text", "string"],
  localTypes: ["m2o", "m2m", "o2m", "translations", "m2a", "file", "files"],
  options: ({ editing, relations }) => {
    // https://directus.io/docs/tutorials/extensions/summarize-relational-items-in-a-custom-display-extension

    if (editing === "+")
      return [
        {
          interface: "presentation-notice",
          options: {
            text: "Please complete the field before attempting to configure the display.",
          },
          width: "full",
        } as any,
      ];

    // M2O has just relations.m2o filled in
    // M2M has both m2o and o2m filled in 👍
    const relatedCollection = relations.m2o?.related_collection;

    const { useFieldsStore } = useStores();
    const fieldsStore = useFieldsStore();
    const fields = fieldsStore.getFieldsForCollection(relatedCollection);
    const choices = fields.map((field: any) => ({
      text: field.name,
      value: field.field,
    }));

    const notes = {
      icon: "The field containing the icon to display. Leave empty to simply show a dot.",
      color: "The field containing the colour to use for the icon or dot.",
      text: "The field containing text to put in the label. Leave empty to just render the icon or dot.",
      secondaryText: "Fallback field to use when the text field is empty",
    } as const;
    const columnsToPick = Object.keys(notes) as (keyof typeof notes)[];
    return [
      ...columnsToPick.map((column) => ({
        field: `${column}Column`,
        type: "string",
        name: `$t:${column}`,
        meta: {
          width: "half",
          note: notes[column],
          interface: "select-dropdown",
          options: { choices },
        },
      })),
      {
        field: "noBackground",
        name: "Remove background",
        type: "boolean",
        meta: {
          width: "half",
          interface: "boolean",
          note: "Display the text and icon/dot without the 'chip' styling.",
        },
        schema: {
          default_value: false,
        },
      },
    ];
  },
  fields: (
    /**
     * Data provided by the user from the above options form
     */
    options: UserDefinedOptions,
    /**
     * Information for the field that this Display is being used on
     */
    fieldInfo
  ) => {
    // Returns the fields of the closest collection to download. So if it's a simple M2O, this is the fields of the target collection. But if it's a M2M this is the junction table.

    // To do: prefil a decent column here? Nah better done in the form
    const userChosenFields = [
      options?.iconColumn,
      options?.colorColumn,
      options?.textColumn,
      options?.secondaryTextColumn,
    ].filter(Boolean);

    const isM2M = fieldInfo.type === "alias";

    if (!isM2M) return userChosenFields;

    try {
      const jumpData = jumpM2M(fieldInfo.collection, fieldInfo.field);
      const junctionJump = jumpData.link2.field;
      return userChosenFields.map((field) => `${junctionJump}.${field}`);
    } catch (e) {
      console.error("Directus issue means this M2M isn't showing!");
      return [];
    }
  },
});

export interface UserDefinedOptions {
  iconColumn: string;
  colorColumn: string;
  textColumn: string;
  secondaryTextColumn: string;
  noBackground: boolean;
}
