import { InputHTMLAttributes } from 'react';
import cx from 'classnames';
import React from 'react';

export const Input = ({ className, style = {}, ...rest }: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
  <input
    className={cx(
      'transition-bg-color rounded border border-gray-300 py-1 px-2 text-xs text-gray-700 outline-0 focus:bg-white',
      className,
    )}
    style={{
      maxHeight: '24px',
      ...style,
    }}
    {...rest}
  />
);
