import { useEffect } from 'react';
import { useState } from 'react';
import { User } from 'unfold-core';
import analytics from '../utils/analytics';
import api from '../utils/api';
import { Button } from 'unfold-ui';
import cx from 'classnames';

type SaveUserButtonProps = {
  user: Pick<User, 'id' | 'displayName'>;
};

export const SaveUserButton = ({ user }: SaveUserButtonProps): JSX.Element => {
  const [isInCollections, setIsInCollections] = useState<null | boolean>(null);

  useEffect(() => {
    const checkIsEntrySaved = async () => {
      const res = await api.collection.hasUser({
        userId: user.id,
      });

      if (res) {
        setIsInCollections(res.hasUser);
      }
    };

    setIsInCollections(null);
    checkIsEntrySaved();
  }, [user.id]);

  const handleToggle = () => {
    if (isInCollections === null) {
      return;
    }

    const toggleSave = async () => {
      if (!isInCollections) {
        const res = await api.collection.create({
          parentId: null,
          type: 'user',
          userId: user.id,
          title: user.displayName,
        });

        if (res) {
          setIsInCollections(true);
          analytics.events.track('ext.collection.created_user', {
            userId: user.id,
          });
        }
      } else {
        await api.collection.deleteByUser({
          userId: user.id,
        });

        setIsInCollections(false);

        analytics.events.track('ext.collection.removed', {
          userId: user.id,
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
