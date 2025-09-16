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
  types: ["string"],
});
