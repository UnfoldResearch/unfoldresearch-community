import React from 'react';
import { Format, FormatMeta, FormatOptions } from 'unfold-core';
import cx from 'classnames';
import { FormatIcon } from '../FormatIcon';

type Props = {
  value: Format | null;
  onChange: (state: Format) => void;
};

export const FormatPickerInput = ({ value, onChange }: Props): JSX.Element => {
  return (
    <div className="flex max-h-40 flex-col flex-wrap overflow-x-auto">
      {FormatOptions.map((format) => (
        <div
          key={format}
          className={cx('flex cursor-pointer items-center gap-1 rounded-sm px-2 py-0.5 hover:bg-bp-gray-2', {
            'bg-bp-gray-3 font-semibold': value === format,
          })}
          onClick={() => {
            onChange(format);
          }}
        >
          <FormatIcon format={format} />
          {FormatMeta[format].label}
        </div>
      ))}
    </div>
  );
};
