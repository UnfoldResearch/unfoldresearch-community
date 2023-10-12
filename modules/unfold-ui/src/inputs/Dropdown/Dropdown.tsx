import React, { ReactNode, useState } from 'react';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import cn from 'classnames';
import { Button } from '../../Button';
import { Icon } from '../../Icon';

type DropdownProps<T> = {
  item?: T;
  initialContent?: ReactNode;
  items: readonly T[];
  className?: string;
  popoverClassName?: string;
  renderItem: (item: T) => ReactNode;
  onChange: (item: T) => void;
};

export const Dropdown = function <T>({
  item,
  initialContent,
  items,
  className,
  popoverClassName,
  renderItem,
  onChange,
}: DropdownProps<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div data-wrap="dropdownWrap" className={cn('relative', className)}>
      <Popover2
        content={
          <div className={cn(Classes.POPOVER2_DISMISS, 'w-full overflow-y-auto', popoverClassName)}>
            {items.map((item, idx) => {
              return (
                <div key={idx}>
                  <Button minimal className="w-full rounded-none" onClick={() => onChange(item)}>
                    {renderItem(item)}
                  </Button>
                </div>
              );
            })}
          </div>
        }
        usePortal={false}
        minimal
        matchTargetWidth
        fill
        placement="bottom"
        popoverClassName="shadow-none shadow-lg border border-gray-200 w-full"
        onClose={() => setIsOpen(false)}
      >
        <Button
          outline
          className="flex w-full justify-between border-gray-300 bg-white text-gray-600 hover:border-gray-400"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <div>{item ? renderItem(item) : initialContent}</div>
          <Icon icon={isOpen ? 'arrow-top-rec' : 'arrow-bottom-rec'} className="text-gray-400" size={16} />
        </Button>
      </Popover2>
    </div>
  );
};
