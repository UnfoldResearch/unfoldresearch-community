import { ReactNode } from 'react';
import cn from 'classnames';
import { Icon, IconProps } from 'unfold-ui';

type Props = {
  icon: IconProps['icon'];
  children: ReactNode;
  className?: string;
};

export const ScreenTitle = ({ icon, children, className }: Props): JSX.Element => (
  <h1 className={cn('flex items-center gap-1 text-lg font-semibold', className)}>
    <Icon icon={icon} size={16} strokeWidth={0.5} className="text-gray-400" /> {children}
  </h1>
);
