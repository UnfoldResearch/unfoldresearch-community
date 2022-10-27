import { MouseEventHandler } from 'react';
import { Entry } from 'unfold-core';
import { EntryPostingMeta } from './EntryPostingMeta';
import { EntryFormat } from './EntryFormat';
import { EntryTitle } from './EntryTitle';
import { EntryVoter } from './EntryVoter';

type EntryPreviewProps = {
  entry: Entry;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export const EntryPreview = ({ entry, onClick }: EntryPreviewProps): JSX.Element => (
  <div
    className="cloud grid cursor-pointer grid-flow-col grid-cols-m1 items-center gap-2 p-3 text-xs text-gray-700 hover:bg-white"
    onClick={onClick}
  >
    <EntryVoter entry={entry} disabled />

    <div>
      <div className="mb-0.5 flex justify-between text-xxs text-gray-400">
        <EntryFormat format={entry.format} />
        <EntryPostingMeta entry={entry} type="short" />
      </div>
      <EntryTitle title={entry.title} clamp={2} />
    </div>
  </div>
);
