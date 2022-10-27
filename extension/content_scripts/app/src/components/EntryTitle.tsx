import cx from 'classnames';
import { GFML } from 'unfold-ui';
import { GFML as GFMLType } from 'unfold-core';

export const EntryTitle = ({
  title,
  className,
  clamp,
}: {
  className?: string;
  title: GFMLType;
  clamp?: number;
}): JSX.Element => (
  <GFML className={cx('text-xs text-gray-800', className)} text={title} clamp={clamp} nonInteractive />
);
