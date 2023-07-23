import { CSSProperties } from 'react';
import cn from 'classnames';
import { ReactNode } from 'react';

type GroupProps = { className?: string; style?: CSSProperties; children?: ReactNode };

export const Group = ({ children, style, className }: GroupProps): JSX.Element => {
  return (
    <div className={cn('grouppp', className)} style={style}>
      {children}
    </div>
  );
};
