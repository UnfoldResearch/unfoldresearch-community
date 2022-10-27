import { NotificationData, NotificationType } from 'unfold-core';
import { EntryAuthor } from 'unfold-ui';
import { useNavigation } from '../utils/useNavigation';
import { EntryTitle } from './EntryTitle';

type NotificationComponent<nt extends NotificationData['type']> = (props: {
  notification: Omit<Extract<NotificationData, { type: nt }>, 'type'>;
}) => JSX.Element;

const EntryNewItem: NotificationComponent<'entry-new-item'> = ({ notification: { entry, parentEntry } }) => {
  const { goToBrowse } = useNavigation();

  return (
    <div
      className="flex flex-col gap-0.5"
      onClick={() => {
        goToBrowse({
          id: entry.id,
          title: entry.title,
        });
      }}
    >
      <div>
        New pub at <EntryTitle title={parentEntry.title} className="faded inline-block font-semibold" />:
      </div>
      <EntryTitle title={entry.title} className="faded inline-block font-semibold" />
    </div>
  );
};

const UserNewItem: NotificationComponent<'user-new-item'> = ({ notification: { entry } }) => {
  const { goToBrowse, goToUser } = useNavigation();

  return (
    <div
      className="flex flex-col gap-0.5"
      onClick={() => {
        goToBrowse({
          id: entry.id,
          title: entry.title,
        });
      }}
    >
      <div className="flex gap-0.5">
        <EntryAuthor
          user={{
            displayName: entry.createdBy.displayName,
          }}
          onClick={() => {
            goToUser(entry.createdBy.id);
          }}
        />{' '}
        submitted to
        <EntryTitle title={entry.title} className="faded inline-block font-semibold" />
      </div>
    </div>
  );
};

const NotificationDescriptors: {
  [nt in NotificationType]: NotificationComponent<nt>;
} = {
  'entry-new-item': EntryNewItem,
  'user-new-item': UserNewItem,
} as const;

export const NotificationItem = ({ notification }: { notification: NotificationData }): JSX.Element => {
  const NotifComp = NotificationDescriptors[notification.type];
  // @ts-ignore
  return <NotifComp notification={notification} />;
};
