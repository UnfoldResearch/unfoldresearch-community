import { useEffect, useState } from 'react';
import { Entry } from 'unfold-core';
import analytics from '../utils/analytics';
import api from '../utils/api';
import { Button } from 'unfold-ui';
import cn from 'classnames';

type FollowEntryButtonProps = {
  entry: Entry;
};

export const FollowEntryButton = ({ entry }: FollowEntryButtonProps): JSX.Element => {
  const [isFollowing, setIsFollowing] = useState<null | boolean>(null);

  useEffect(() => {
    const checkIsFollowingEntry = async () => {
      const res = await api.subscription.isFollowingEntry({
        entryId: entry.id,
      });

      if (res) {
        setIsFollowing(res.isFollowingEntry);
      }
    };

    setIsFollowing(null);
    checkIsFollowingEntry();
  }, [entry.id]);

  const handleToggle = () => {
    if (isFollowing === null) {
      return;
    }

    const toggleSave = async () => {
      if (!isFollowing) {
        const res = await api.subscription.followEntry({
          entryId: entry.id,
        });

        if (res) {
          analytics.events.track('ext.subscription.follow_entry', {
            entryId: entry.id,
          });
          setIsFollowing(true);
        }
      } else {
        const res = await api.subscription.unfollowEntry({
          entryId: entry.id,
        });

        if (res) {
          analytics.events.track('ext.subscription.unfollow_entry', {
            entryId: entry.id,
          });
          setIsFollowing(false);
        }
      }
    };

    toggleSave();
  };

  return (
    <Button
      minimal
      icon="bell"
      iconProps={isFollowing ? { className: 'text-sky-600' } : undefined}
      onClick={handleToggle}
      className={cn({
        'text-sky-600': isFollowing,
      })}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
