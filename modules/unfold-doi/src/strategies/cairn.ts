import { DoiStrategy } from '../utils';

const CAIRN_HOST = /(www\.)?cairn\.info/;

export const findDoiFromCairn: DoiStrategy = ({ window }) => {
  if (!window.location.href.match(CAIRN_HOST)) {
    return null;
  }
  const aTags: HTMLAnchorElement[] = Array.from(window.document.querySelectorAll('div#article-details a'));
  const linkUrls = aTags.map((aTag) => aTag.href);

  for (const linkUrl of linkUrls) {
    const matches = /https?:\/\/doi.org\/(10\.\d+\/.*)/.exec(linkUrl);
    if (matches && matches.length > 1) {
      return matches[1];
    }
  }

  return null;
};
