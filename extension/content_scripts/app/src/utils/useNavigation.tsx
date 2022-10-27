import { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Collection, Entry, EntryFull, User } from 'unfold-core';
import analytics from './analytics';
import api from './api';
import { useAuth } from './useAuth';
import { usePageData } from './usePageData';

type NavigationPage =
  | {
      screen: 'auth';
    }
  | {
      screen: 'browse';
      entry: EntryFull;
    }
  | {
      screen: 'report';
      entry: Entry;
    }
  | {
      screen: 'submit';
      parent: Pick<Entry, 'id' | 'title'>;
    }
  | {
      screen: 'library';
      ownerId: User['id'];
      pendingItem:
        | null
        | {
            type: 'entry';
            entry: Entry;
          }
        | {
            type: 'collection';
            collection: Collection;
          }
        | {
            type: 'user';
            user: User;
          };
    }
  | {
      screen: 'user';
      userId: User['id'];
    }
  // | {
  //     screen: 'tag';
  //     tag: Tag;
  //   }
  | {
      screen: 'notifications';
    }
  | {
      screen: 'alerts';
      userId: User['id'];
    }
  | {
      screen: 'help';
    }
  | {
      screen: 'feedback';
    };

export type Navigation = {
  current: NavigationPage;
  goToAuth: () => void;
  goToBrowse: (targetEntry?: Pick<Entry, 'id' | 'title'>) => Promise<void>;
  goToReport: (entry: Entry) => void;
  goToSubmit: (parent: Pick<Entry, 'id' | 'title'>) => void;
  goToHelp: () => void;
  goToLibrary: (ownerId: User['id'], item?: Extract<NavigationPage, { screen: 'library' }>['pendingItem']) => void;
  goToUser: (userId: User['id']) => void;
  // goToTag: (tag: Tag) => void
  goToNotifications: () => void;
  // goToAlerts: (userId: User['id']) => void;
  goToFeedback: () => void;
};

const NavigationCtx = createContext<Navigation>({
  current: {
    screen: 'auth',
  },
  goToAuth: () => {},
  goToBrowse: async () => {},
  goToReport: () => {},
  goToSubmit: () => {},
  goToHelp: () => {},
  goToLibrary: () => {},
  goToUser: () => {},
  goToNotifications: () => {},
  // goToAlerts: () => {},
  goToFeedback: () => {},
});

export const NavigationProvider = ({ children }: { children?: ReactNode }): JSX.Element => {
  const { user } = useAuth();
  const [nav, setNav] = useState<NavigationPage>({
    screen: 'auth',
  });

  const { current: currentPage } = usePageData();

  const fetchCurrentUrlEntryAndGo = async () => {
    // Maybe we have the page data, but it's suppressed, meaning we still have
    // not triggered the sidebar, so we will wait for that so we don't fetch all
    // of data for all of the urls unnecessarily if the user doesn't even
    // interact with the sidebar. This saves us from fetching the data (saves
    // bandwidth), but also saves us from creating entries for all of the urls
    // that users don't interact with (saves creation).
    if (!currentPage || !user || currentPage.suppressed) {
      return;
    }

    const res = await api.entry.getEntryByUrl({
      url: currentPage.url,
      title: currentPage.title,
      description: currentPage.description,
    });

    if (res && res.entry) {
      setNav({ screen: 'browse', entry: res.entry });
      analytics.events.track('ext.navigation.entry', {
        entryId: res.entry.id,
        title: res.entry.title,
        authorId: res.entry.createdBy.id,
      });
    }
  };

  useEffect(() => {
    fetchCurrentUrlEntryAndGo();
  }, [currentPage]);

  return (
    <NavigationCtx.Provider
      value={{
        current: nav,
        goToAuth: () => setNav({ screen: 'auth' }),
        goToBrowse: async (targetEntry) => {
          if (!targetEntry) {
            fetchCurrentUrlEntryAndGo();
            return;
          }

          const res = await api.entry.getEntryById({
            entryId: targetEntry.id,
          });

          if (res && res.entry) {
            setNav({ screen: 'browse', entry: res.entry });
            analytics.events.track('ext.navigation.entry', {
              entryId: res.entry.id,
              title: res.entry.title,
              authorId: res.entry.createdBy.id,
            });
          }
        },
        goToReport: (entry: Entry) => {
          setNav({ screen: 'report', entry });
        },
        goToSubmit: (parent) => {
          setNav({ screen: 'submit', parent });
        },
        goToHelp: () => {
          setNav({ screen: 'help' });
        },
        goToLibrary: (ownerId, item) => {
          setNav({ screen: 'library', ownerId, pendingItem: item ?? null });
        },
        goToUser: (userId) => {
          setNav({ screen: 'user', userId });
        },
        goToNotifications: () => {
          setNav({ screen: 'notifications' });
        },
        // goToAlerts(userId) {
        //   setNav({
        //     screen: 'alerts',
        //     userId,
        //   });
        // },
        goToFeedback: () => {
          setNav({ screen: 'feedback' });
        },
      }}
    >
      {children}
    </NavigationCtx.Provider>
  );
};

export function useNavigation<S extends NavigationPage['screen']>() {
  return useContext(NavigationCtx) as Exclude<Navigation, 'current'> & {
    current: Extract<NavigationPage, { screen: S }>;
  };
}
