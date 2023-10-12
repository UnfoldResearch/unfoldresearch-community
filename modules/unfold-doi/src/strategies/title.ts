// Crossref DOI regex. See https://www.crossref.org/blog/dois-and-matching-regular-expressions/

import { DoiStrategy, DOI_REGEX } from '../utils';

export const findDoiFromTitle: DoiStrategy = ({ window }) => {
  const doi = window.document.title.match(DOI_REGEX);
  return doi ? doi[0] : null;
};
