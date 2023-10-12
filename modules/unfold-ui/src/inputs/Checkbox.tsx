import React from 'react';
import { InputHTMLAttributes } from 'react';

type Props = Pick<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style'> & {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: React.ReactNode;
};

export const Checkbox = ({ value, onChange, label, className, style = {}, ...rest }: Props): JSX.Element => (
  <div className="flex items-center gap-1">
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className={className}
      style={{
        maxHeight: '24px',
        ...style,
      }}
      {...rest}
    />
    {label}
  </div>
);
