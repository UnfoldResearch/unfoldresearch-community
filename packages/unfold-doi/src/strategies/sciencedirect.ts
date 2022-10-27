// eg: http://www.sciencedirect.com/science/article/pii/S1751157709000881 (green)
// eg: http://www.sciencedirect.com/science/article/pii/S0742051X16306692

import { DoiStrategy, runRegexOnHTML } from '../utils';

export const findDoiFromScienceDirect: DoiStrategy = ({ window }) => {
  if (!window.location.host.includes('sciencedirect')) {
    return null;
  }

  // the old version of ScienceDirect requires a hack to read DOI from js var
  const maybeDOI = runRegexOnHTML(window.document.documentElement.innerHTML, /SDM.doi\s*=\s*'([^']+)'/);
  if (maybeDOI) {
    return maybeDOI;
  }

  // the new React-based version of ScienceDirect pages
  const doiLinkElem = window.document.querySelectorAll('a.doi');
  if (!doiLinkElem.length) {
    return null;
  }

  const matches = doiLinkElem[0].innerHTML.match(/doi\.org\/(.+)/);
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};
