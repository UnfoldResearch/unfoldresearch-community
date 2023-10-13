import { Popover2 } from '@blueprintjs/popover2';
import { useEffect, useState } from 'react';
import { Button, TextArea, GFML } from 'unfold-ui';
import { UserDetails } from 'unfold-core';
import { formatTime } from 'unfold-utils';
import analytics from '../../utils/analytics';
import api from '../../utils/api';
import { useAuth } from '../../utils/useAuth';
import { useNavigation } from '../../utils/useNavigation';
import { FollowUserButton } from '../FollowUserButton';
import { SaveUserButton } from '../SaveUserButton';

export const UserScreen = (): JSX.Element => {
  const { logout, user } = useAuth();
  const { current, goToAuth } = useNavigation<'user'>();

  const [actionsOpen, setActionsOpen] = useState(false);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [newDetails, setNewDetails] = useState<UserDetails | null>(null);

  const isSelf = user!.id === current.userId;

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await api.user.get({
        userId: current.userId,
      });

      if (res) {
        setDetails(res);
      }
    };

    fetchUserDetails();
    analytics.events.track('navigation.user', {
      userId: current.userId,
    });
  }, []);

  return (
    <div className="p-3 text-gray-700">
      <div className="flex items-center justify-end gap-1">
        {!isSelf && details ? (
          <>
            <SaveUserButton
              user={{
                id: current.userId,
                displayName: details.displayName,
              }}
            />
            <FollowUserButton
              user={{
                id: current.userId,
              }}
            />
          </>
        ) : (
          <Button
            minimal
            icon={newDetails === null ? 'pen-tool-2' : 'checkbox-circle'}
            onClick={async () => {
              if (!details) {
                return;
              }

              if (newDetails === null) {
                setNewDetails(details);
              } else {
                const res = await api.user.update({
                  bio: newDetails.bio,
                });
                if (res && res.success) {
                  setDetails(newDetails);
                  setNewDetails(null);
                }
              }
            }}
          >
            {newDetails === null ? 'Edit' : 'Save changes'}
          </Button>
        )}
        {isSelf && (
          <Popover2
            usePortal={false}
            isOpen={actionsOpen}
            onClose={() => setActionsOpen(false)}
            minimal
            position="bottom-right"
            popoverClassName="shadow-none shadow-lg border border-gray-200"
            content={
              <div className="flex flex-col">
                {isSelf ? (
                  <Button
                    minimal
                    icon="log-out-2"
                    className="w-full rounded-none"
                    onClick={() => {
                      logout();
                      goToAuth();
                    }}
                  >
                    Log out
                  </Button>
                ) : (
                  <Button minimal icon="flag-2" className="w-full rounded-none">
                    Report
                  </Button>
                )}
              </div>
            }
          >
            <Button
              icon="more-vert"
              minimal
              onClick={() => {
                setActionsOpen(!actionsOpen);
              }}
            />
          </Popover2>
        )}
      </div>

      {details && (
        <div>
          <div>
            <div>
              <span className="font-semibold">{details.displayName}</span> ({details.score})
            </div>
            <div className="gray-500 mb-4 text-xs">
              Member since: {formatTime(new Date(details.createdAt), 'M D, Y h:m')}
            </div>
            {newDetails === null ? (
              <div>
                <GFML
                  text={
                    details.bio
                      ? details.bio
                      : isSelf
                      ? "_You didn't write anything about yourself._"
                      : "_The user didn't write anything about them._"
                  }
                />
              </div>
            ) : (
              <TextArea
                rows={10}
                className="my-3 min-h-[100px] w-full resize-y"
                placeholder="Write something about yourself..."
                value={newDetails.bio}
                onChange={(e) =>
                  setNewDetails({
                    ...newDetails,
                    bio: e.target.value,
                  })
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
