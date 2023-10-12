// green:   http://www.nber.org/papers/w23298.pdf

import { DoiStrategy, runRegexOnHTML } from '../utils';

const NBER_HOST = 'www.nber.org' as const;

export const findDoiFromNber: DoiStrategy = ({ window }) => {
  if (window.location.host !== NBER_HOST) {
    return null;
  }

  const html = window.document.documentElement.innerHTML;
  return runRegexOnHTML(html, /Document Object Identifier \(DOI\): (10.*?)<\/p>/);
};
