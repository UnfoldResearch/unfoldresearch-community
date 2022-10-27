import { useEffect, useState } from 'react';
import { Entry, Vote } from 'unfold-core';
import { formatAmount } from 'unfold-utils';
import { Icon, IconProps } from 'unfold-ui';
import cx from 'classnames';
import { useAuth } from '../utils/useAuth';
import api from '../utils/api';
import analytics from '../utils/analytics';

type EntryVoterProps = {
  entry: Entry;
  disabled?: boolean;
};

export const EntryVoter = ({ entry, disabled }: EntryVoterProps): JSX.Element => {
  const { user } = useAuth();

  const [score, setScore] = useState<number>(entry.score);
  const [vote, setVote] = useState<Vote | null>(entry.vote);

  useEffect(() => {
    setVote(entry.vote);
    setScore(entry.score);
  }, [entry]);

  const isUpvote = vote === 'upvote';
  const isDownvote = vote === 'downvote';
  const canVote = user?.id !== entry.createdBy.id;

  const props: Partial<IconProps> = {
    size: 10,
    strokeWidth: disabled ? undefined : 0.5,
  };

  const interactive = !disabled && canVote;

  return (
    <div className="voter grid w-[44px] grid-cols-m1 items-center gap-1">
      <div className="flex flex-col gap-1">
        <Icon
          icon="thumbs-up"
          {...props}
          className={cx({
            'text-sky-600': isUpvote,
            'text-gray-200': isDownvote || (!interactive && !isUpvote),
            'text-gray-600': interactive && !vote,
            'cursor-pointer': interactive,
          })}
          onClick={async () => {
            if (!interactive) {
              return;
            }

            const res = await api.vote.vote({
              entryId: entry.id,
              type: isUpvote ? null : 'upvote',
            });

            if (res) {
              setVote(res.hasVoted);
              setScore(res.score);
              analytics.events.track('ext.vote.voted', {
                entryId: entry.id,
                title: entry.title,
                authorId: entry.createdBy.id,
                authorDisplayName: entry.createdBy.displayName,
                type: isUpvote ? 'rm-upvote' : 'upvote',
              });
            }
          }}
        />
        <Icon
          icon="thumbs-up"
          style={{
            transform: 'rotate(180deg)',
          }}
          className={cx({
            'text-red-600': isDownvote,
            'text-gray-200': isUpvote || (!interactive && !isDownvote),
            'text-gray-600': interactive && !vote,
            'cursor-pointer': interactive,
          })}
          {...props}
          onClick={async () => {
            if (!interactive) {
              return;
            }

            const res = await api.vote.vote({
              entryId: entry.id,
              type: isDownvote ? null : 'downvote',
            });

            if (res) {
              setVote(res.hasVoted);
              setScore(res.score);
              analytics.events.track('ext.vote.voted', {
                entryId: entry.id,
                title: entry.title,
                authorId: entry.createdBy.id,
                authorDisplayName: entry.createdBy.displayName,
                type: isDownvote ? 'rm-downvote' : 'downvote',
              });
            }
          }}
        />
      </div>
      <span className="text-center text-xs font-semibold text-gray-500">{formatAmount(score)}</span>
    </div>
  );
};
