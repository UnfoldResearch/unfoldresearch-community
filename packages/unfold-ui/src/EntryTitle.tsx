import React from 'react';
import cn from 'classnames';
import { GFML } from './GFML';

export const EntryTitle = ({
  title,
  className,
  clamp,
}: {
  className?: string;
  title: string;
  clamp?: number;
}): JSX.Element => (
  <GFML className={cn('text-xs text-gray-800', className)} text={title} clamp={clamp} nonInteractive />
);
