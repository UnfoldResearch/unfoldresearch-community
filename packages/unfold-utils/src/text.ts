export const toKebabCase = (value: string) => {
  return value.replace(/\s+/g, '-').toLowerCase();
};

export const toFormattedTagCase = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[^\w\s-.]/gi, '')
    .replace(/\s+/gi, '-');
};

export const toCapitalized = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const toCamelCase = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export const formatAmount = (num: number, options?: { uppercase?: boolean }): string => {
  const M = options?.uppercase ? 'M' : 'm';
  const K = options?.uppercase ? 'K' : 'k';
  if (num >= 10_000_000) {
    return (num / 1_000_000).toFixed(0) + M;
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + M;
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(0) + K;
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + K;
  }
  return num.toFixed(0);
};

export const formatFileSize = (bytes: number, options?: { space?: boolean }) => {
  const kbs = Math.floor(bytes / 1024);
  const roughMbs = bytes / (1024 * 1024);
  const mbs = Math.floor(roughMbs);
  const _ = options?.space ? ' ' : '';

  if (mbs > 10) {
    return `${mbs}${_}MB`;
  }

  if (mbs > 0) {
    if (Math.floor((roughMbs - mbs) * 10) === 0) {
      return `${mbs}${_}MB`;
    }
    return `${roughMbs.toFixed(1)}${_}MB`;
  }
  if (kbs > 0) {
    return `${kbs}${_}KB`;
  }
  return `${bytes}${_}B`;
};

export const trimUnsafeDisplayName = (value: string) => value.replace(/[^A-Za-z_\d]/gi, '');
