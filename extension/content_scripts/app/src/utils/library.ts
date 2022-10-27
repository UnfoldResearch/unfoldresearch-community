import { Collection } from 'unfold-core';

export type HierarchicalCollection = Collection & {
  children: HierarchicalCollection[];
};

export const flatToHierarchicalLibrary = (collections: Collection[]): HierarchicalCollection[] => {
  const hCollections: HierarchicalCollection[] = collections.map((collection) => ({
    ...collection,
    children: [],
  }));

  // top-level collections don't have parents
  const topLevelCollections: HierarchicalCollection[] = [];

  for (const collection of hCollections) {
    const parentId = collection.parentId;
    if (!parentId) {
      topLevelCollections.push({ ...collection });
    } else {
      const parentCollection = hCollections.find((c) => c.id === parentId);
      if (parentCollection) {
        parentCollection!.children.push(collection);
      }
    }
  }

  return topLevelCollections;
};
