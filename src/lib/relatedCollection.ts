import { memo, stores } from "./stores";
import { Relation } from "@directus/types";
import { jumpM2M } from "./jumpM2M";

/** The collection whose items the labels show: the far side of an M2M's junction, or the other
 *  end of an M2O/O2M */
export function relatedCollection(collection: string, field: string): string | null {
  return memo(`related:${collection}.${field}`, () => findRelatedCollection(collection, field));
}

function findRelatedCollection(collection: string, field: string) {
  const { useRelationsStore } = stores();
  const relations: Relation[] = useRelationsStore().getRelationsForField(
    collection,
    field
  );
  if (relations.length === 2)
    return jumpM2M(collection, field).link2.related_collection;
  const [relation] = relations;
  if (!relation) return null;
  return relation.related_collection === collection
    ? relation.collection
    : relation.related_collection;
}
