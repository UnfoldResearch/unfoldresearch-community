import React, { ReactNode, ChangeEventHandler } from 'react';

type RadioProps = {
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
};

export const Radio = ({ checked, onChange, children }: RadioProps): JSX.Element => {
  return (
    <div className="flex items-center gap-1">
      <input type="radio" checked={checked} onChange={onChange} />
      {children}
    </div>
  );
};
