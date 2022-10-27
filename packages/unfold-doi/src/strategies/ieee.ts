// green:   http://ieeexplore.ieee.org/document/6512846/

import { DoiStrategy, runRegexOnHTML } from '../utils';

const IEEE_HOST = 'ieeexplore.ieee.org' as const;

export const findDoiFromIeee: DoiStrategy = ({ window }) => {
  if (window.location.host !== IEEE_HOST) {
    return null;
  }

  const html = window.document.documentElement.innerHTML;
  return runRegexOnHTML(html, /'doi':'([^']+)'/);
};
