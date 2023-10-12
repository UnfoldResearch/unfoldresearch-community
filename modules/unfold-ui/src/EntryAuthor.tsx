import React from 'react';
import { ComponentProps } from 'react';
import { User } from 'unfold-core';
import { formatAmount } from 'unfold-utils';

type Props = {
  user: {
    displayName: User['displayName'];
    score?: User['score'];
  };
  disabled?: boolean;
} & (
  | {
      as: 'link';
      href: string;
    }
  | {
      as?: 'div';
      onClick: () => void;
    }
);

export const EntryAuthor = ({ user, disabled, ...props }: Props): JSX.Element => {
  const attrs: Partial<ComponentProps<'a'>> = disabled
    ? {}
    : props.as === 'link'
    ? {
        href: props.href,
      }
    : {
        className: 'cursor-pointer',
        onClick: props.onClick,
      };

  const Comp = props.as === 'link' ? 'a' : 'span';

  return (
    <span className="inline-flex items-center gap-0.5">
      <Comp {...attrs}>
        <span className="font-semibold">{user.displayName}</span>
      </Comp>
      {user.score !== undefined && <span>({formatAmount(user.score)})</span>}
    </span>
  );
};
