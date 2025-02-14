import { useEffect, useState } from 'react';
import { Entry, isAuthorBot } from 'unfold-core';
import { Button, EntryTitle, EntryVoter, EntryPostingMeta, EntryLinkedTo } from 'unfold-ui';
import { Popover2 } from '@blueprintjs/popover2';

import { useNavigation } from '../utils/useNavigation';
import { useAuth } from '../utils/useAuth';
import api from '../utils/api';
import analytics from '../utils/analytics';
import { SaveEntryButton } from './SaveEntryButton';
import { FollowEntryButton } from './FollowEntryButton';
import { Editor } from 'unfold-plugins';

type EntryContentProps = {
  entry: Entry;
};

export const EntryContent = ({ entry }: EntryContentProps): JSX.Element => {
  const { goToReport, goToBrowse, goToUser } = useNavigation<'browse'>();
  const { user } = useAuth();

  const [actionsOpen, setActionsOpen] = useState(false);

  const isUserAuthor = user?.id === entry.createdBy;
  const isAutogenerated = isAuthorBot(entry.createdBy);

  return (
    <div className="h-full overflow-hidden pb-3">
      <div className="flex items-center justify-between py-2">
        <EntryVoter
          currentUserDisplayName={user!.displayName}
          votes={entry.votes}
          allowedToVote={!isUserAuthor}
          onCastVote={async (vote) => {
            const res = await api.vote.cast({
              entryId: entry.id,
              type: vote,
            });
            if (!res) {
              throw new Error('casting vote failed');
            }
            return res;
          }}
          onRemoveVote={async () => {
            const res = await api.vote.remove({
              entryId: entry.id,
            });
            if (!res) {
              throw new Error('casting vote failed');
            }
            return res;
          }}
        />

        <div>
          {/* <Button minimal icon="file-download">
          Download
        </Button> */}
          {/* <SaveEntryButton entry={entry} /> */}
          {/* <Button minimal icon="book-open">
          Cite
        </Button> */}
          {/* <FollowEntryButton entry={entry} /> */}
          {!isAutogenerated && (
            <Popover2
              usePortal={false}
              isOpen={actionsOpen}
              onClose={() => setActionsOpen(false)}
              content={
                <div className="flex flex-col">
                  {isUserAuthor && (
                    <>
                      {/* <Button minimal icon="note-text">
                      Edit
                    </Button> */}
                      <Button
                        minimal
                        icon="trash"
                        onClick={async () => {
                          setActionsOpen(false);

                          await api.entry.delete({
                            entryId: entry.id,
                          });

                          analytics.events.track('entry.deleted', {
                            title: entry.title,
                            id: entry.id,
                          });

                          const parent = entry.parent;
                          parent && goToBrowse(parent.id);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  {/* <hr className="my-1" /> */}
                  {/* <Button minimal icon="clock">
                  History
                </Button> */}
                  {/* <Button minimal icon="email">
                  Share
                </Button> */}
                  {!isUserAuthor && (
                    <Button
                      minimal
                      className="rounded-none"
                      icon="flag-2"
                      onClick={() => {
                        goToReport(entry);
                        setActionsOpen(false);
                      }}
                    >
                      Report
                    </Button>
                  )}
                </div>
              }
              minimal
              position="bottom-right"
              popoverClassName="shadow-none shadow-lg border border-gray-200"
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
      </div>

      <div className="mb-0.5 grid grid-cols-m1 items-center gap-1 overflow-hidden">
        <EntryLinkedTo
          entry={entry}
          as="div"
          onClick={() => {
            if (!entry.parent) {
              return;
            }

            goToBrowse(entry.parent.id);
          }}
        />
      </div>

      <EntryTitle title={entry.title} className="mb-3 font-semibold" />

      {/* <EditorContextProvider> */}
      <div className="text-xs text-gray-700 bg-white">
        <div className="relative">
          <Editor initialContent={entry.content} readonly />
        </div>
      </div>
      {/* </EditorContextProvider> */}

      <div className="flex flex-col gap-1 pt-3">
        <EntryPostingMeta
          entry={entry}
          type="posted"
          as="div"
          onClick={() => {
            goToUser(entry.createdBy);
          }}
        />

        {/* <EntryTags entry={entry} /> */}
      </div>
    </div>
  );
};
