import { defineDisplay, useStores } from "@directus/extensions-sdk";
import DisplayComponent from "./display.vue";
import { jumpM2M } from "./lib/jumpM2M";
import { raw } from "./lib/raw";

// See related-values/index.ts in the main codebase for similar example code!

export default defineDisplay({
  id: "dynamic-labels",
  name: "Dynamic Labels",
  icon: "label",
  description: "Display label(s) from columns in the related table",
  component: DisplayComponent,
  types: ["alias", "integer", "uuid", "text"],
  localTypes: ["m2o", "m2m"],
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

    const columnMeta = {
      interface: "select-dropdown",
      options: { choices },
      width: "full",
    };
    const columnsToPick = ["text", "icon", "color"];
    return [
      ...columnsToPick.map((column) => ({
        field: `${column}Column`,
        type: "string",
        name: `$t:${column}`,
        meta: columnMeta,
      })),

      // {
      //   field: "sum",
      //   type: "boolean",
      //   name: "Calulate Sum",
      //   meta: {
      //     interface: "boolean",
      //     options: {
      //       label: "Yes",
      //     },
      //     width: "half",
      //   },
      // },
      // {
      //   field: "prefix",
      //   type: "string",
      //   name: "Prefix",
      //   meta: {
      //     interface: "input",
      //     options: {
      //       font: "monospace",
      //     },
      //     width: "half",
      //   },
      // },
      // {
      //   field: "suffix",
      //   type: "string",
      //   name: "Suffix",
      //   meta: {
      //     interface: "input",
      //     options: {
      //       font: "monospace",
      //     },
      //     width: "half",
      //   },
      // },
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
      options?.colorColumn,
      options?.iconColumn,
      options?.textColumn,
    ].filter(Boolean);

    const isM2M = fieldInfo.type === "alias";

    if (!isM2M) return userChosenFields;

    const jumpData = jumpM2M(fieldInfo.collection, fieldInfo.field);
    const junctionJump = jumpData.link2.field;
    return userChosenFields.map((field) => `${junctionJump}.${field}`);
  },
});

interface UserDefinedOptions {
  textColumn: string;
  iconColumn: string;
  colorColumn: string;
}
