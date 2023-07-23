import React from 'react';
import { Vote } from 'unfold-core';
import { formatAmount } from 'unfold-utils';
import cn from 'classnames';

import { Icon, IconProps } from './Icon';

type EntryVoterProps = {
  score: number;
  vote: Vote | null;
  disabled?: boolean;
  onUpvote?: () => Promise<void>;
  onDownvote?: () => Promise<void>;
};

export const EntryVoter = ({ score, vote, disabled, onDownvote, onUpvote }: EntryVoterProps): JSX.Element => {
  const isUpvote = vote === 'upvote';
  const isDownvote = vote === 'downvote';

  const props: Partial<IconProps> = {
    size: 10,
    strokeWidth: disabled ? undefined : 0.5,
  };

  return (
    <div className="voter grid w-[44px] grid-cols-m1 items-center gap-1">
      <div className="flex flex-col gap-1">
        <Icon
          icon="thumbs-up"
          {...props}
          className={cn({
            'text-sky-600': isUpvote,
            'text-gray-200': isDownvote || (disabled && !isUpvote),
            'text-gray-600': !disabled && !vote,
            'cursor-pointer': !disabled,
          })}
          onClick={async () => {
            if (disabled) {
              return;
            }

            try {
              onUpvote && (await onUpvote());
            } catch {
              // do nothing
            }
          }}
        />
        <Icon
          icon="thumbs-up"
          style={{
            transform: 'rotate(180deg)',
          }}
          className={cn({
            'text-red-600': isDownvote,
            'text-gray-200': isUpvote || (disabled && !isDownvote),
            'text-gray-600': !disabled && !vote,
            'cursor-pointer': !disabled,
          })}
          {...props}
          onClick={async () => {
            if (disabled) {
              return;
            }

            try {
              onDownvote && (await onDownvote());
            } catch {
              // do nothing
            }
          }}
        />
      </div>
      <span className="text-center text-xs font-semibold text-gray-500">{formatAmount(score)}</span>
    </div>
  );
};
