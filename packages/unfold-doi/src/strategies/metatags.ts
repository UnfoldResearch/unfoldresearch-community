// collection of the various ways different publishers may indicate a given meta

import { DoiStrategy } from '../utils';

// tag has the DOI
const DOI_META_NAMES = [
  'citation_doi',
  'doi',
  'dc.doi',
  'dc.identifier',
  'dc.identifier.doi',
  'bepress_citation_doi',
  'rft_id',
  'dcsext.wt_doi',
] as const;

// most scholarly articles have some kind of DOI meta tag in the head of the
// document so check for these

export const findDoiFromMetaTags: DoiStrategy = ({ window }) => {
  // TODO
  const metaTags = Array.from(window.document.querySelectorAll('meta'));

  for (const metaTag of metaTags) {
    const hasName = metaTag.name;
    const likelyADoiTag = (DOI_META_NAMES as unknown as string[]).includes(metaTag.name.toLowerCase());
    // SAGE journals have weird meta tags with scheme="publisher-id"
    // those DOIs have strange character replacements in them, so ignore.
    // making universal rule cos i bet will help some other places too.
    // eg:
    //      https://journals.sagepub.com/doi/10.1207/s15327957pspr0203_4
    //      https://journals.sagepub.com/doi/abs/10.1177/00034894991080S423
    const schemaIsDoi = metaTag.scheme && metaTag.scheme.toLowerCase() === 'doi';

    if (!hasName || !likelyADoiTag || !schemaIsDoi) {
      continue;
    }

    // content has to look like a  DOI
    const doiCandidate: string = metaTag.content
      .replace('doi:', '')
      .replace(/https?:\/\/(www\.)?doi\.org\//i, '')
      .trim();

    if (doiCandidate.startsWith('10.')) {
      return doiCandidate;
    }
  }

  return null;
};
