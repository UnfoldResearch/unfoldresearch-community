import { DoiStrategy } from '../utils';

const SCIENCEONLINE_HOST = /(www\.)?inderscienceonline\.com/;

export const findDoiFromInderScienceOnline: DoiStrategy = ({ window }) => {
  if (!window.location.href.match(SCIENCEONLINE_HOST)) {
    return null;
  }

  const pbContextContent = window.document.querySelector("meta[name='pbContext']")?.getAttribute('content');
  if (!pbContextContent) {
    return null;
  }

  const matches = /article:article:(10\.\d+[^;]*)/.exec(pbContextContent);
  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};
