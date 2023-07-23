import React from 'react';
import { ChangeEvent } from 'react';
import { Input } from './Input';

type Date = {
  day: number | null;
  month: number | null;
  year: number | null;
};

type Props = {
  value: Date | string | null | undefined;
  onChange: (date: Date) => void;
  disabled?: boolean;
};

export const DateInput = ({ value: rawValue, onChange, disabled }: Props): JSX.Element => {
  const value = (() => {
    if (!rawValue) {
      return {
        day: null,
        month: null,
        year: null,
      };
    }
    if (typeof rawValue !== 'string') {
      return rawValue;
    }
    const parsedValue = JSON.parse(rawValue);
    return {
      day: parseInt(parsedValue['day']) ?? null,
      month: parseInt(parsedValue['month']) ?? null,
      year: parseInt(parsedValue['year']) ?? null,
    };
  })();

  const onChangeHandler = (field: 'day' | 'month' | 'year') => (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (field === 'day' && (val < 1 || val > 31)) {
      return;
    }
    if (field === 'month' && (val < 1 || val > 12)) {
      return;
    }
    if (field === 'year' && val < 0) {
      return;
    }

    onChange({
      ...value,
      [field]: val ?? null,
    });
  };

  return (
    <div className="inline-flex items-center gap-1">
      <Input
        type="text"
        value={value.year === 0 ? '0' : value.year || ''}
        onChange={onChangeHandler('year')}
        placeholder="yyyy"
        maxLength={4}
        inputMode="numeric"
        className="w-[50px]"
        disabled={disabled}
      />
      <Input
        type="text"
        value={value.month === 0 ? '0' : value.month || ''}
        onChange={onChangeHandler('month')}
        placeholder="mm"
        maxLength={2}
        inputMode="numeric"
        className="w-[40px]"
        disabled={disabled}
      />
      <Input
        type="text"
        value={value.day === 0 ? '0' : value.day || ''}
        onChange={onChangeHandler('day')}
        placeholder="dd"
        maxLength={2}
        inputMode="numeric"
        className="w-[40px]"
        disabled={disabled}
      />
    </div>
  );
};
