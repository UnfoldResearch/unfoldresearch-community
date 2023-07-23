import React from 'react';
import { Entry } from 'unfold-core';
import cn from 'classnames';

import { EntryTitle } from './EntryTitle';

type EntryLinkedToProps = {
  entry: Entry;
  className?: string;
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

export const EntryLinkedTo = ({ className, entry: { parent }, ...rest }: EntryLinkedToProps): JSX.Element | null => {
  if (!parent || !parent.id) {
    return null;
  }

  const actionElem = ((): JSX.Element => {
    switch (rest.as) {
      case 'div': {
        return (
          <span className="cursor-pointer hover:text-gray-700" onClick={() => rest.onClick()}>
            <EntryTitle title={parent.title} className="faded" clamp={1} />
          </span>
        );
      }
      case 'link': {
        return (
          <a className="cursor-pointer hover:text-gray-700" href={rest.href}>
            <EntryTitle title={parent.title} className="faded" clamp={1} />
          </a>
        );
      }
      default: {
        throw Error('Unhandled switch case.');
      }
    }
  })();

  return (
    <span
      className={cn('grid grid-cols-3 items-center text-gray-500', className)}
      style={{
        gridTemplateColumns: 'max-content minmax(auto, max-content) max-content',
      }}
    >
      — at "{actionElem}"
    </span>
  );
};
