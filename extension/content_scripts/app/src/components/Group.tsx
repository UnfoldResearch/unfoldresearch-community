import { CSSProperties } from 'react';
import cx from 'classnames';
import { ReactNode } from 'react';

type GroupProps = { className?: string; style?: CSSProperties; children?: ReactNode };

export const Group = ({ children, style, className }: GroupProps): JSX.Element => {
  return (
    <div className={cx('grouppp', className)} style={style}>
      {children}
    </div>
  );
};
