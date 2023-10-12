import { useState, useEffect } from 'react';
import { Notification } from 'unfold-core';
import { formatTimeDiff } from 'unfold-utils';
import { Button } from 'unfold-ui';
import analytics from '../../utils/analytics';
import api from '../../utils/api';
import { NotificationItem } from '../NotificationItem';
import { ScreenTitle } from '../ScreenTitle';

export const NotificationsScreen = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  // const [pagesLoaded, setPagesLoaded] = useState(0);

  useEffect(() => {
    analytics.events.track('navigation.notifications');

    const fetchNotifs = async () => {
      const res = await api.notification.get({});

      if (res) {
        setNotifications(res.notifications);
      }
    };
    if (!notifications) {
      fetchNotifs();
    }
  }, []);

  return (
    <div className="text-gray-700">
      <div className="flex items-center justify-between p-3">
        <ScreenTitle icon="bell">Notifications</ScreenTitle>

        {/* <Button
          icon="sliders-horiz-2"
          minimal
          title="Manage alerts"
          onClick={() => {
            goToAlerts(user!.id);
          }}
        >
          Manage alerts
        </Button> */}
      </div>
      {/* <div className="mb-3 flex justify-end">
        <Button minimal icon="checkbox-circle">
          Mark all read
        </Button>
      </div> */}

      <div className="flex flex-col">
        {notifications && notifications.length === 0 && (
          <div className="flex flex-col gap-2 px-3 text-xs text-gray-500">
            <div>You don't have any notifications.</div>
            <div className="pointer-events-none flex flex-row items-center">
              Use{' '}
              <Button outline icon="bell" className="gray mx-1">
                Follow
              </Button>{' '}
              to subscribe to updates and new additions.
            </div>
          </div>
        )}
        {notifications &&
          notifications.length > 0 &&
          notifications.map((n) => (
            <div
              className="cloud grid cursor-pointer grid-flow-col grid-cols-1m items-start gap-2 p-3 text-xs text-gray-700 hover:bg-white"
              key={n.id}
            >
              <div>
                <NotificationItem notification={n.data} />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-gray-400">
                  {formatTimeDiff(n.createdAt, {
                    format: 'm',
                  })}
                </div>
                <div>{/* <Button minimal icon="checkbox-circle" /> */}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
