// Internal id lookup shared by the resolvers. Not part of the package's public exports.

/** The item with this id, or a "Not found" error. */
export function find<T extends { id: string }>(list: T[], id: string): T {
  const item = list.find((x) => x.id === id);
  if (!item) throw new Error('Not found');
  return item;
}
