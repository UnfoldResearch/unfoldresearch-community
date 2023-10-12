// PDF documents. See https://www.tandfonline.com/doi/pdf/10.1080/10962247.2018.1459956
// https://link.springer.com/content/pdf/10.1007/s11192-017-2242-0.pdf
// https://www.biorxiv.org/content/10.1101/2021.03.15.435418v1.full.pdf

import { DOI_REGEX, DoiStrategy } from '../utils';

const BAD_ENDINGS = [
  /v..full.pdf/,
  '.full.pdf',
  '.full.html',
  '.full.htm',
  '.full.txt',
  '.pdf',
  '.html',
  '.htm',
  '.txt',
  '.full',
];

export const findDoiFromUrl: DoiStrategy = ({ window }) => {
  const maybeDoi = window.location.href.match(DOI_REGEX);
  if (!maybeDoi) {
    return null;
  }

  // clean it up
  let rawDoi = maybeDoi[0];
  for (const badEnding of BAD_ENDINGS) {
    rawDoi = rawDoi.replace(badEnding, '');
  }
  return rawDoi;
};
