// https://www.crossref.org/blog/dois-and-matching-regular-expressions/
export const DOI_REGEX = /(10.\d{4,9}\/[-._;()/:A-Z0-9]+)/gi;
export const DOI_REGEX_FULL = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/gi;

export type DoiStrategy = (options: { window: Window }) => string | null;

export const runRegexOnHTML = (html: string, regex: RegExp): string | null => {
  const matches = regex.exec(html);
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};

export const isDocumentPDF = (document: Document): boolean => {
  return document.contentType === 'application/pdf';
};

export const HOSTS_NOT_ALLOWED: (
  | {
      host: string;
      paths: string[];
    }
  | string
)[] = [
  'wikipedia.org',
  'scholar.google.com',
  'google',
  'connectedpapers',
  'clinicaltrials.gov',
  {
    host: 'psycnet.apa.org',
    paths: ['/record', '/fulltext', '/search/display'],
  },
];

export const isHostAllowed = (url: Location): boolean => {
  for (const host of HOSTS_NOT_ALLOWED) {
    if (typeof host === 'string') {
      if (url.host.includes(host)) {
        return false;
      }
    } else {
      if (url.host.includes(host.host) && host.paths.some((path) => url.href.includes(path))) {
        return false;
      }
    }
  }
  return true;
};

// single-page apps (SPA) take a while to fully load all the HTML, and until
// they do we can't find the DOI
export const LONG_DELAY_HOSTS = [
  'psycnet.apa.org',
  'www.sciencedirect.com',
  'mdpi.com',
  'onlinelibrary.wiley.com',
  'webofknowledge',
  'scopus',
  'karger.com',
  'journals.plos.org',
  'europepmc.org',
  'orcid.org',
  'connectedpapers.com',
  'lens.org',
] as const;
