// gold:   https://www.ncbi.nlm.nih.gov/pubmed/17375194

import { DoiStrategy } from '../utils';

const PUBMED_HOST = 'www.ncbi.nlm.nih.gov' as const;

export const findDoiFromPubmed: DoiStrategy = ({ window }) => {
  if (!window.location.host.includes(PUBMED_HOST)) {
    return null;
  }

  const doiLinkElem = window.document.querySelectorAll("a[ref='aid_type=doi']");
  if (doiLinkElem.length) {
    return doiLinkElem[0]?.textContent;
  }

  return null;
};
