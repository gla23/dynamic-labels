import { Field } from "@directus/types";
import { memo, stores } from "./stores";

export interface Columns {
  iconColumn?: string | null;
  colorColumn?: string | null;
  textColumn?: string | null;
  secondaryTextColumn?: string | null;
}

const byName = (fields: Field[], patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = fields.find((field) => pattern.test(field.field));
    if (match) return match;
  }
  return undefined;
};

/** The obvious columns of the related collection to use, so the options don't have to be clicked
 *  through every time the display is chosen */
export function defaultColumns(fields: Field[]): Required<Columns> {
  const plain = fields.filter(
    (field) =>
      !field.schema?.is_primary_key &&
      // Relations, user/date stamps and the like
      !field.meta?.special?.length
  );

  const icon =
    plain.find((field) => field.meta?.interface === "select-icon") ??
    byName(plain, [/^icon$/i, /icon/i]);
  const color =
    plain.find((field) => field.meta?.interface === "select-color") ??
    byName(plain, [/^colou?r$/i, /colou?r/i]);

  // Short text first as it makes for a smaller chip, with the full text as its fallback
  const texts = plain.filter(
    (field) =>
      ["string", "text"].includes(field.type) &&
      field !== icon &&
      field !== color &&
      !/(^|_)(id|uuid|slug|sort|status|key|code)$/i.test(field.field)
  );
  const ranked: Field[] = [];
  for (const pattern of [/^short_?(text|name|title|label)$/i, /short/i, /^text$/i, /^name$/i, /^title$/i, /^label$/i, /text|name|title|label/i]) {
    for (const field of texts)
      if (pattern.test(field.field) && !ranked.includes(field)) ranked.push(field);
  }
  const [text = texts[0], secondaryText] = ranked;

  return {
    iconColumn: icon?.field ?? null,
    colorColumn: color?.field ?? null,
    textColumn: text?.field ?? null,
    secondaryTextColumn: secondaryText?.field ?? null,
  };
}

export function collectionDefaults(collection: string | null | undefined) {
  if (!collection) return defaultColumns([]);
  return memo(`defaults:${collection}`, () =>
    defaultColumns(stores().useFieldsStore().getFieldsForCollection(collection))
  );
}

/** The user's chosen columns, with the defaults for any option that has never been set. An option
 *  cleared on purpose is null, and stays cleared. */
export function resolveColumns(options: Columns | null | undefined, collection: string | null | undefined): Required<Columns> {
  const defaults = collectionDefaults(collection);
  const pick = (key: keyof Columns) =>
    options?.[key] === undefined ? defaults[key] : options[key] ?? null;
  return {
    iconColumn: pick("iconColumn"),
    colorColumn: pick("colorColumn"),
    textColumn: pick("textColumn"),
    secondaryTextColumn: pick("secondaryTextColumn"),
  };
}
