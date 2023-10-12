import React, { ReactNode, useState } from 'react';
import { Icon } from './Icon';

type SectionToggleProps = {
  header: ReactNode | ((expanded: boolean) => ReactNode);
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
  children?: ReactNode;
  inert?: boolean;
};

export const SectionToggle = ({
  header,
  children,
  expanded,
  onToggle,
  className,
  inert,
}: SectionToggleProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(inert ? true : !!expanded);

  return (
    <div className={className}>
      <div
        className="flex cursor-pointer select-none flex-row items-center gap-1"
        onClick={() => {
          setIsExpanded(!isExpanded);
          onToggle?.(!isExpanded);
        }}
      >
        {!inert && <Icon icon={isExpanded ? 'minus-rec' : 'plus-rec'} size={12} className="text-gray-400" />}
        {typeof header === 'function' ? header(isExpanded) : header}
      </div>
      {/*
        We do want to hide/show instead of unmount/mount children because some
        sections might be doing things async. Think of files input for example,
        that could still be uploading files in the background.
      */}
      <div className={!isExpanded ? 'hidden' : ''}>{children}</div>
    </div>
  );
};
