import { DoiStrategy } from '../utils';

const EPISTEMONIKOS_HOST = 'epistemonikos.org' as const;

export const findDoiFromEpistemonikos: DoiStrategy = ({ window }) => {
  // gold: https://www.epistemonikos.org/en/documents/7342deed74b20db32345d92a3e1acff5e8139e22

  if (!window.location.host.includes(EPISTEMONIKOS_HOST)) {
    return null;
  }

  const doiLinkElem = Array.from(window.document.querySelectorAll('a')).filter((aTag) => {
    return aTag.innerText === 'DOI';
  });

  if (doiLinkElem.length) {
    return doiLinkElem[0].href;
  }

  return null;
};
