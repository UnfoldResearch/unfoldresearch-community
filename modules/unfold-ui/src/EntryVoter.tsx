import React, { FC, useEffect, useState } from 'react';
import { Entry, Vote, VoteOptions } from 'unfold-core';
import { formatAmount } from 'unfold-utils';
import { ThumbsUpIcon, ThumbsDownIcon, HeartIcon, LightbulbIcon } from 'lucide-react';

import { Button } from './Button';

const VOTE_ICONS = {
  upvote: ThumbsUpIcon,
  downvote: ThumbsDownIcon,
  bulb: LightbulbIcon,
  heart: HeartIcon,
} as const satisfies Record<Vote, FC>;

type EntryVoterProps = {
  currentUserDisplayName: string;
  votes: Entry['votes'];
  allowedToVote?: boolean;
  filterNils?: boolean;
  onRemoveVote?: () => Promise<Entry['votes']>;
  onCastVote?: (vote: Vote) => Promise<Entry['votes']>;
};

export const EntryVoter = ({
  currentUserDisplayName,
  allowedToVote,
  filterNils,
  onCastVote,
  onRemoveVote,
  votes: propsVotes,
}: EntryVoterProps): JSX.Element => {
  const [votes, setVotes] = useState<Entry['votes']>(propsVotes);

  useEffect(() => {
    setVotes(propsVotes);
  }, [propsVotes]);

  let currentUserVote: Vote | null = null;
  for (const vote of VoteOptions) {
    if (votes[vote]?.find((details) => details.displayName === currentUserDisplayName)) {
      currentUserVote = vote;
      break;
    }
  }

  return (
    <div>
      <div className="flex gap-1">
        {VoteOptions.filter((v) => !filterNils || votes[v]).map((v) => {
          const Icon = VOTE_ICONS[v];
          return (
            <Button
              key={v}
              disabled={!allowedToVote}
              {...(currentUserVote !== v
                ? {
                    minimal: true,
                  }
                : {
                    outline: true,
                  })}
              onClick={async () => {
                if (currentUserVote === v && onRemoveVote) {
                  const updatedVotes = await onRemoveVote();
                  setVotes(updatedVotes);
                }
                if (currentUserVote !== v && onCastVote) {
                  const updatedVotes = await onCastVote(v);
                  setVotes(updatedVotes);
                }
              }}
            >
              <Icon strokeWidth={1} absoluteStrokeWidth size={12} /> {formatAmount(votes[v]?.length ?? 0)}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
