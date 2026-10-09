import { useStores } from "@directus/extensions-sdk";
import { hasInjectionContext } from "vue";

let cached: Record<string, any> | null = null;

/** `useStores`, but usable outside a component's setup.
 *
 *  `useStores` is an `inject()`, so it only works while a component is being set up. Directus calls
 *  a display's `fields()` (and `options()`) from inside computeds, which re-run lazily after setup
 *  has finished, e.g. when the table layout changes page or collection. There `useStores` throws
 *  "[useStores]: The stores could not be found." The stores themselves are pinia stores that work
 *  anywhere once the app is running, so keep hold of them from the first call that could inject. */
export function stores(): Record<string, any> {
  if (hasInjectionContext()) {
    try {
      cached = useStores();
    } catch {
      // An injection context without the stores, fall through to the cached ones
    }
  }
  if (!cached) throw new Error("[dynamic-labels]: The stores could not be found.");
  return cached;
}

const memos = new Map<string, unknown>();
let memoFields: unknown;
let memoRelations: unknown;

/** Remembers a lookup on the fields/relations stores until either is replaced (the stores replace
 *  their arrays rather than mutate them). Every cell of a column makes the same lookups, and each
 *  one scans every field or relation in the project, so this keeps big tables and their animations
 *  from lagging. Reading the arrays here also means a computed using it tracks just those two refs,
 *  not every field it would otherwise have scanned. */
export function memo<T>(key: string, compute: () => T): T {
  const { useFieldsStore, useRelationsStore } = stores();
  const fields = useFieldsStore().fields;
  const relations = useRelationsStore().relations;
  if (fields !== memoFields || relations !== memoRelations) {
    memos.clear();
    memoFields = fields;
    memoRelations = relations;
  }
  if (!memos.has(key)) memos.set(key, compute());
  return memos.get(key) as T;
}
