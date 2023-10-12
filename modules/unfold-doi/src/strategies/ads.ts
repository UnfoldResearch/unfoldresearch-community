// example: https://ui.adsabs.harvard.edu/abs/2011TJSAI..26..166M/abstract

import { DoiStrategy } from '../utils';

export const findDoiFromADS: DoiStrategy = ({ window }) => {
  const dataTarget = window.document.querySelectorAll('*[data-target="DOI"]');
  if (dataTarget.length) {
    return dataTarget[0]?.textContent;
  }

  return null;
};
