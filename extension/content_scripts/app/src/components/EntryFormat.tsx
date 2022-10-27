import { Format, FormatMeta } from 'unfold-core';
import { IconName } from 'unfold-ui';
import cx from 'classnames';
import { FormatIcon } from 'unfold-ui/src/FormatIcon';

type Props = {
  format: Format | null;
  className?: string;
};

export const EntryFormat = ({ className, format }: Props): JSX.Element | null => {
  if (!format) {
    return null;
  }

  return (
    <span className={cx('inline-flex items-center gap-1 text-xs text-gray-500' as IconName, className)}>
      <FormatIcon format={format} />
      <span>{FormatMeta[format].label}</span>
    </span>
  );
};
