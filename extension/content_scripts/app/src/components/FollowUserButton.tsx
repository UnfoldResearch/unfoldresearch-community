import { useEffect, useState } from 'react';
import { User } from 'unfold-core';
import analytics from '../utils/analytics';
import api from '../utils/api';
import { Button } from 'unfold-ui';
import cn from 'classnames';

type FollowUserButtonProps = {
  user: Pick<User, 'id'>;
};

export const FollowUserButton = ({ user }: FollowUserButtonProps): JSX.Element => {
  const [isFollowing, setIsFollowing] = useState<null | boolean>(null);

  useEffect(() => {
    const checkIsFollowingUser = async () => {
      const res = await api.subscription.isFollowingUser({
        userId: user.id,
      });

      if (res) {
        setIsFollowing(res.isFollowingUser);
      }
    };

    setIsFollowing(null);
    checkIsFollowingUser();
  }, [user.id]);

  const handleToggle = () => {
    if (isFollowing === null) {
      return;
    }

    const toggleSave = async () => {
      if (!isFollowing) {
        const res = await api.subscription.followUser({
          userId: user.id,
        });

        if (res) {
          analytics.events.track('subscription.follow_user', {
            userId: user.id,
          });
          setIsFollowing(true);
        }
      } else {
        const res = await api.subscription.unfollowUser({
          userId: user.id,
        });

        if (res) {
          analytics.events.track('subscription.unfollow_user', {
            userId: user.id,
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
