import { Dropdown } from './Dropdown/Dropdown';
import { License, LicenseOptionsMeta, LicenseOptions } from 'unfold-core';
import { TextArea } from './TextArea';
import React from 'react';

type LicenseInputProps = {
  license: {
    key: License;
    description: string;
  };
  onChange: (license: LicenseInputProps['license']) => void;
  dropdownClassName?: string;
  popoverClassName?: string;
  className?: string;
};

export const LicenseInput = ({
  license: { key, description },
  onChange,
  dropdownClassName,
  popoverClassName,
  className,
}: LicenseInputProps): JSX.Element => {
  return (
    <div className={className}>
      <Dropdown
        item={key}
        items={LicenseOptions}
        renderItem={(l) => LicenseOptionsMeta[l].label}
        onChange={(key) =>
          onChange({
            key,
            description,
          })
        }
        className={dropdownClassName}
        popoverClassName={popoverClassName}
      />

      {key === 'custom' && (
        <TextArea
          className="w-full resize-y"
          placeholder="Your custom license description..."
          rows={4}
          value={description}
          onChange={(e) =>
            onChange({
              key,
              description: e.target.value,
            })
          }
        />
      )}
    </div>
  );
};
