import React, { TextareaHTMLAttributes } from 'react';
import cx from 'classnames';

export const TextArea = ({
  className,
  style = {},
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element => (
  <textarea
    className={cx(
      'transition-bg-color rounded border border-gray-300 py-1 px-2 text-xs text-gray-700 outline-0 focus:bg-white',
      className,
    )}
    style={style}
    {...rest}
  />
);
