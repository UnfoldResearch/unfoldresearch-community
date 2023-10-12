import { DoiStrategy } from '../utils';

const DOI_ATTRIBUTE = 'data-doi' as const;

// sniff DOIs from the altmetric.com widget e.g.
export const findDoiFromDataDoiAttributes: DoiStrategy = ({ window }) => {
  const nodesWithDoiAttr = Array.from(window.document.querySelectorAll(`*[${DOI_ATTRIBUTE}]`));
  const dataDoiValues = nodesWithDoiAttr.map((node) => node.getAttribute(DOI_ATTRIBUTE));

  // if there are multiple unique DOIs, we're on some kind of TOC page,
  // we don't want none of that noise.
  const numUniqueDois = new Set(dataDoiValues).size;
  if (numUniqueDois === 1) {
    return dataDoiValues[0];
  }

  return null;
};
