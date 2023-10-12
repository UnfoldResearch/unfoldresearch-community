const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const formatTime = (datetime: Date, format: string): string => {
  let output = '';

  for (let i = 0; i < format.length; i++) {
    const letter = format[i];

    switch (letter) {
      case 'h':
        output += datetime.getHours();
        break;
      case 'm':
        const m = datetime.getMinutes();
        output += (m < 10 ? '0' : '') + m;
        break;
      case 's':
        output += datetime.getSeconds();
        break;
      case 'Y':
        output += datetime.getFullYear();
        break;
      case 'M':
        output += MONTHS[datetime.getMonth()];
        break;
      case 'D':
        output += datetime.getDate();
        break;
      default:
        output += letter;
    }
  }

  return output;
};

type TimeDiffFormat = 's' | 'm' | 'l';
export const formatTimeDiff = (
  older_time: number,
  options?: {
    format?: TimeDiffFormat;
    space?: boolean;
  },
  newer_time: number = Date.now(),
): string => {
  const _format = options?.format ? options?.format : 'l';

  const elapsed = (newer_time - older_time) / 1000; // in seconds

  const elapsed_minutes = Math.round(elapsed / 60);
  const elapsed_hours = Math.round(elapsed / (60 * 60));
  const elapsed_days = Math.round(elapsed / (60 * 60 * 24));
  const elapsed_weeks = Math.round(elapsed / (60 * 60 * 24 * 7));
  const elapsed_months = Math.round(elapsed / (60 * 60 * 24 * 31));
  const elapsed_years = Math.round(elapsed / (60 * 60 * 24 * 365));

  const fmt = (amt: number, [s, m, l]: [string, string, string]): string => {
    const FMT_SEL: Record<TimeDiffFormat, number> = {
      s: 0,
      m: 1,
      l: 2,
    };
    // const identifier = amt > 1 ? amt.toString() : 'a ';
    const period = [s, m, l][FMT_SEL[_format]];
    const pluralSuffix = _format === 'l' ? 's' : '';
    return `${amt}${options?.space ? ' ' : ''}${period}${amt !== 1 ? pluralSuffix : ''} ago`;
  };

  if (elapsed_years > 0) {
    return fmt(elapsed_years, ['y', 'yr', 'year']);
  }
  if (elapsed_months > 0) {
    return fmt(elapsed_months, ['mth', 'mth', 'month']);
  }
  if (elapsed_weeks > 0) {
    return fmt(elapsed_weeks, ['w', 'wk', 'week']);
  }
  if (elapsed_days > 0) {
    return fmt(elapsed_days, ['d', 'd', 'day']);
  }
  if (elapsed_hours > 0) {
    return fmt(elapsed_hours, ['h', 'h', 'hour']);
  }

  // if (elapsed_minutes > 0) {
  return fmt(Math.max(elapsed_minutes, 1), ['m', 'min', 'minute']);

  // return (format === 'm' ? 'sec' : format === 's' ? 's' : ` seconds`) + suffix;
};

export const printDateContent = (
  date:
    | {
        day: number | null;
        month: number | null;
        year: number | null;
      }
    | null
    | string,
): string => {
  if (!date) {
    return '';
  }

  const { year, month, day } = typeof date === 'string' ? JSON.parse(date) : date;

  if (!year) {
    return '';
  }
  if (!month) {
    return `${year}`;
  }
  if (!day) {
    return `${MONTHS[month - 1]} ${year}`;
  }
  return `${MONTHS[month - 1]} ${day}, ${year}`;
};
