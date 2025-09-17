import { useStores } from "@directus/extensions-sdk";
import { Relation, Field } from "@directus/types";
import { raw } from "./raw";

// Originally from get-related-collection.ts in the main repo and modified to do more stuff

export interface JumpData {
  collection: string;
  field: string;
  fieldObj: Field;
  link1: Relation;
  link2: Relation;
}

export function jumpM2M(collection: string, field: string): JumpData {
  const { useFieldsStore, useRelationsStore } = useStores();
  const fieldsStore = useFieldsStore();
  const relationsStore = useRelationsStore();

  const relations: Relation[] = relationsStore.getRelationsForField(
    collection,
    field
  );
  if (relations.length !== 2) throw new Error("Not a M2M?");
  const link1Index = relations.findIndex(
    (relation) => relation.related_collection === collection
  );
  const [link1, link2] = link1Index === 0 ? relations : relations.reverse();
  if (!link1 || !link2) throw new Error("Hmm TS");

  const collectionFields: Field[] =
    fieldsStore.getFieldsForCollection(collection);

  const fieldObj = collectionFields.find((full) => full.field === field);
  if (!fieldObj) throw new Error(`No field '${field}'`);

  const jumpData: JumpData = { collection, field, fieldObj, link1, link2 };

  return jumpData;
}
