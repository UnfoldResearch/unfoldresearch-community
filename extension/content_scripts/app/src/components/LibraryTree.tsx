import { useEffect, useMemo, useRef, useState } from 'react';
import { Collection } from 'unfold-core';
import { Icon, IconName, GFML } from 'unfold-ui';
import cx from 'classnames';
import { flatToHierarchicalLibrary, HierarchicalCollection } from '../utils/library';
import { useClickOutside } from '../utils/useClickOutside';
import { FormatIcon } from 'unfold-ui/src/FormatIcon';

type LibraryTreeProps = {
  collections: Collection[] | null;
  interactive?: boolean;
  onSelect?: (collectionId: Collection | null) => void;
  className?: string;
};

export const LibraryTree = ({ collections: _collections, onSelect }: LibraryTreeProps): JSX.Element => {
  const collections = useMemo(() => flatToHierarchicalLibrary(_collections ?? []), [_collections]);
  const [activeCollection, setActiveCollection] = useState<HierarchicalCollection | null>(null);
  const [expandedCollections, setExpandedCollections] = useState<Record<HierarchicalCollection['id'], boolean>>({});
  const [detailsCache, setDetailsCache] = useState<
    Record<
      Collection['id'],
      {
        icon: IconName;
        isDeleted: boolean;
      }
    >
  >({});
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setActiveCollection(null);
  });

  useEffect(() => {
    setActiveCollection(null);
  }, []);

  useEffect(() => {
    setActiveCollection(null);
  }, [collections]);

  useEffect(() => {
    onSelect?.(activeCollection);
  }, [activeCollection]);

  return (
    <div className="relative h-[200px] max-h-[360px] min-h-[120px] resize-y overflow-auto" ref={containerRef}>
      {_collections?.length === 0 ? (
        <div className="absolute inset-0 grid animate-fadein place-items-center italic text-gray-400">
          No items in the library.
        </div>
      ) : (
        <CollectionItem
          collection={
            {
              children: collections,
            } as HierarchicalCollection
          }
          root
          depth={-1}
          selectedId={activeCollection ? activeCollection.id : null}
          onSelect={setActiveCollection}
          expandedCollections={expandedCollections}
          setExpandedCollections={setExpandedCollections}
          detailsCache={detailsCache}
          setDetailsCache={setDetailsCache}
        />
      )}
    </div>
  );
};

type CollectionItemProps = {
  collection: HierarchicalCollection;
  root?: boolean;
  selectedId: HierarchicalCollection['id'] | null;
  onSelect: (collection: HierarchicalCollection) => void;
  expandedCollections: Record<HierarchicalCollection['id'], boolean>;
  setExpandedCollections: (expandedCollections: Record<HierarchicalCollection['id'], boolean>) => void;
  depth: number;
  detailsCache: Record<
    Collection['id'],
    {
      icon: IconName;
      isDeleted: boolean;
    }
  >;
  setDetailsCache: (detailsCache: CollectionItemProps['detailsCache']) => void;
};

const CollectionItem = ({
  collection,
  root,
  depth,
  selectedId,
  onSelect,
  expandedCollections,
  setExpandedCollections,
  detailsCache,
  setDetailsCache,
}: CollectionItemProps): JSX.Element => {
  const icon: JSX.Element | IconName = (() => {
    switch (collection.refType) {
      case null:
        return expandedCollections[collection.id] ? 'folder-open' : 'folder';
      case 'entry':
        return <FormatIcon format={collection.format} />;
      case 'user':
        return 'user';
      default:
        return 'bookmark';
    }
  })();

  return (
    <div>
      {!root && (
        <div
          className={cx('grid cursor-pointer grid-cols-m1 items-center gap-1 py-0.5 pr-2 hover:bg-gray-200', {
            'bg-gray-100': selectedId === collection.id,
          })}
          style={{
            paddingLeft: `${depth * 18 + 8}px`,
          }}
          onClick={() => onSelect(collection)}
        >
          {typeof icon === 'string' ? (
            <Icon
              icon={icon}
              type="duotone"
              size={14}
              onClick={() => {
                setExpandedCollections({
                  ...expandedCollections,
                  [collection.id]: !expandedCollections[collection.id],
                });
              }}
            />
          ) : (
            icon
          )}
          <GFML text={collection.title} clamp={1} className="faded" nonInteractive />
        </div>
      )}

      {collection.children.length > 0 && (root || expandedCollections[collection.id]) && (
        <div>
          {collection.children.map((childCollection) => (
            <CollectionItem
              key={childCollection.id}
              depth={depth + 1}
              collection={childCollection}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedCollections={expandedCollections}
              setExpandedCollections={setExpandedCollections}
              detailsCache={detailsCache}
              setDetailsCache={setDetailsCache}
            />
          ))}
        </div>
      )}
    </div>
  );
};
