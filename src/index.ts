import { defineDisplay } from "@directus/extensions-sdk";
import DisplayComponent from "./display.vue";

export default defineDisplay({
  id: "dynamic-labels",
  name: "Dynamic Labels",
  icon: "label",
  description:
    "Similar to the in-build Labels Display, just get the parameters from the table itself rather than hard coded per slug.",
  component: DisplayComponent,
  options: null,
  types: ["alias", "integer", "uuid", "text"],
  localTypes: ["m2o", "m2m"],
  fields: (options, metadata) => {
    const isM2M = metadata.type === "alias";
    return isM2M
      ? ["stages_id.icon", "stages_id.colour", "stages_id.name"]
      : ["icon", "colour", "name"];
  },
});
