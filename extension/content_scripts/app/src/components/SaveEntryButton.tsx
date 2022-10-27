import { useEffect } from 'react';
import { useState } from 'react';
import { Entry } from 'unfold-core';
import analytics from '../utils/analytics';
import api from '../utils/api';
import { Button } from 'unfold-ui';
import cx from 'classnames';

type SaveEntryButtonProps = {
  entry: Entry;
};

export const SaveEntryButton = ({ entry }: SaveEntryButtonProps): JSX.Element => {
  const [isInCollections, setIsInCollections] = useState<null | boolean>(null);

  useEffect(() => {
    const checkIsEntrySaved = async () => {
      const res = await api.collection.hasEntry({
        entryId: entry.id,
      });

      if (res) {
        setIsInCollections(res.hasEntry);
      }
    };

    setIsInCollections(null);
    checkIsEntrySaved();
  }, [entry.id]);

  const handleToggle = () => {
    if (isInCollections === null) {
      return;
    }

    const toggleSave = async () => {
      if (!isInCollections) {
        const res = await api.collection.create({
          parentId: null,
          type: 'entry',
          entryId: entry.id,
          title: entry.title,
          format: entry.format,
        });

        if (res) {
          setIsInCollections(true);
          analytics.events.track('ext.collection.created_entry', {
            entryId: entry.id,
            title: entry.title,
            authorId: entry.createdBy.id,
            authorDisplayName: entry.createdBy.displayName,
          });
        }
      } else {
        await api.collection.deleteByEntry({
          entryId: entry.id,
        });

        setIsInCollections(false);

        analytics.events.track('ext.collection.removed', {
          entryId: entry.id,
          title: entry.title,
        });
      }
    };

    toggleSave();
  };

  return (
    <Button
      minimal
      icon={isInCollections === null ? 'loading' : 'star'}
      iconProps={isInCollections ? { className: 'text-sky-600' } : undefined}
      onClick={handleToggle}
      className={cx({
        'text-sky-600': isInCollections,
      })}
    >
      {isInCollections ? 'Saved' : 'Save'}
    </Button>
  );
};
