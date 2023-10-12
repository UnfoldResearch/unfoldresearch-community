import { MouseEventHandler } from 'react';
import { Entry } from 'unfold-core';
import { EntryPostingMeta, EntryTitle, EntryVoter } from 'unfold-ui';
import { FormatMeta, Format } from 'unfold-plugins';
import { useNavigation } from '../utils/useNavigation';

type EntryPreviewProps = {
  entry: Entry;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const EntryPreview = ({ entry, onClick }: EntryPreviewProps): JSX.Element => {
  const { goToUser } = useNavigation();

  return (
    <div
      className="cloud grid cursor-pointer grid-flow-col grid-cols-m1 items-center gap-2 p-3 text-xs text-gray-700 hover:bg-white"
      onClick={onClick}
    >
      <EntryVoter score={entry.score} vote={entry.vote} disabled />

      <div>
        <div className="mb-0.5 flex justify-between text-xxs text-gray-400">
          {/* <FormatMeta format={entry.format as Format} /> */}
          <EntryPostingMeta
            entry={entry}
            type="short"
            as="div"
            onClick={() => {
              goToUser(entry.createdBy.id);
            }}
          />
        </div>
        <EntryTitle title={entry.title} clamp={2} />
      </div>
    </div>
  );
};
