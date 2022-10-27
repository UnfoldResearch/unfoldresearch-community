import { File } from 'unfold-core';

export type HierarchicalFile = File & { children: HierarchicalFile[]; parent: HierarchicalFile | null };

export const flatToHierarchicalFiles = (files: File[]): HierarchicalFile[] => {
  const hFiles: HierarchicalFile[] = files.map((f) => ({
    ...f,
    parent: null,
    children: [],
  }));

  // top-level files don't have parents
  const topLevelFiles: HierarchicalFile[] = [];

  for (const file of hFiles) {
    const parent = hFiles.find((f) => f.id === file.parentId);
    if (!file.parentId || !parent) {
      topLevelFiles.push(file);
    } else {
      file.parent = parent;
      parent.children.push(file);
    }
  }

  return topLevelFiles;
};
