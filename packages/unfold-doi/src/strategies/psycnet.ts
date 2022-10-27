// gray: http://psycnet.apa.org/record/2000-13328-008

import { DoiStrategy, DOI_REGEX, runRegexOnHTML } from '../utils';

const PSYCNET_HOST = 'psycnet.apa.org' as const;

export const findDoiFromPsycnet: DoiStrategy = ({ window }) => {
  if (window.location.host !== PSYCNET_HOST) {
    return null;
  }

  const html = window.document.documentElement.innerHTML;
  return runRegexOnHTML(html, DOI_REGEX);
};
