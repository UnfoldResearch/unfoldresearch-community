import { MouseEventHandler } from 'react';
import { Entry } from 'unfold-core';
import { EntryPostingMeta, EntryTitle, EntryVoter } from 'unfold-ui';
import { useNavigation } from '../utils/useNavigation';
import { useAuth } from '../utils/useAuth';

type EntryPreviewProps = {
  entry: Entry;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const EntryPreview = ({ entry, onClick }: EntryPreviewProps): JSX.Element => {
  const user = useAuth().user;
  const { goToUser } = useNavigation();

  return (
    <div
      className="cloud flex flex-col gap-1 cursor-pointer p-3 text-xs text-gray-700 hover:bg-white"
      onClick={onClick}
    >
      <div className="mb-0.5 flex justify-between text-xxs text-gray-400">
        {/* <FormatMeta format={entry.format as Format} /> */}
        <EntryPostingMeta
          entry={entry}
          type="short"
          as="div"
          onClick={() => {
            goToUser(entry.createdBy);
          }}
        />
      </div>
      <EntryTitle title={entry.title} clamp={2} />
      <EntryVoter allowedToVote={true} votes={entry.votes} currentUserDisplayName={user!.displayName} filterNils />
    </div>
  );
};
