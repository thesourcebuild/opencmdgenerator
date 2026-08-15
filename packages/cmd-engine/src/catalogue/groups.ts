/**
 * Shape of one entry in a command's group taxonomy (its display sections in
 * the builder form). The taxonomy itself — which groups exist, in what order —
 * is command-specific data and lives in `packages/cmds/<name>`, not here.
 */
export interface FlagGroupMeta<TGroup extends string = string> {
  id: TGroup;
  label: string;
  summary: string;
  /** Display order in the builder form. */
  order: number;
  /** Groups the form collapses by default. */
  collapsedByDefault: boolean;
}

/** Sort a command's group metadata record into display order. */
export function orderedGroups<TGroup extends string>(
  meta: Record<TGroup, FlagGroupMeta<TGroup>>,
): FlagGroupMeta<TGroup>[] {
  return Object.values<FlagGroupMeta<TGroup>>(meta).sort((a, b) => a.order - b.order);
}
