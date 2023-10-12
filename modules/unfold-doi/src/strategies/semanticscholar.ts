// example: https://www.semanticscholar.org/paper/ProofWriter%3A-Generating-Implications%2C-Proofs%2C-and-Tafjord-Dalvi/87c45a908537ffe1d2ab71a5d609bd7b4efa4fe1

import { DoiStrategy } from '../utils';

const SEMANTICSCHOLAR_HOST = 'www.semanticscholar.org' as const;

export const findDoiFromSemanticScholar: DoiStrategy = ({ window }) => {
  if (window.location.host !== SEMANTICSCHOLAR_HOST) {
    return null;
  }

  const doiLinkElem = window.document.querySelector('.doi__link');
  const doiCandidate = doiLinkElem?.textContent;
  if (doiCandidate && doiCandidate.startsWith('10.')) {
    return doiCandidate;
  }

  return null;
};
