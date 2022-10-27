// example: https://www.jstor.org/stable/1340219

import { DoiStrategy, DOI_REGEX } from '../utils';

export const findDoiFromJSTOR: DoiStrategy = ({ window }) => {
  const dataTarget = window.document.querySelectorAll('*[data-qa="crossref-doi"]');
  if (dataTarget.length) {
    const matches = (dataTarget[0].textContent || '').match(DOI_REGEX);
    if (matches) {
      return matches[1];
    }
  }

  return null;
};
