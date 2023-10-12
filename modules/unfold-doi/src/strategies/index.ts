import { DoiStrategy } from '../utils';

import { findDoiFromADS } from './ads';
import { findDoiFromCairn } from './cairn';
import { findDoiFromDataDoiAttributes } from './doi_attribute';
import { findDoiFromEpistemonikos } from './epistemonikos';
import { findDoiFromIeee } from './ieee';
import { findDoiFromJSTOR } from './jstor';
import { findDoiFromMetaTags } from './metatags';
import { findDoiFromNber } from './nber';
import { findDoiFromPsycnet } from './psycnet';
import { findDoiFromPubmed } from './pubmed';
import { findDoiFromScienceDirect } from './sciencedirect';
import { findDoiFromInderScienceOnline } from './inderscienceonline';
import { findDoiFromSemanticScholar } from './semanticscholar';
import { findDoiFromTitle } from './title';
import { findDoiFromUrl } from './url';

export const DOI_STRATEGIES: readonly DoiStrategy[] = [
  findDoiFromADS,
  findDoiFromCairn,
  findDoiFromDataDoiAttributes,
  findDoiFromEpistemonikos,
  findDoiFromIeee,
  findDoiFromJSTOR,
  findDoiFromMetaTags,
  findDoiFromNber,
  findDoiFromPsycnet,
  findDoiFromPubmed,
  findDoiFromScienceDirect,
  findDoiFromInderScienceOnline,
  findDoiFromSemanticScholar,
  findDoiFromTitle,
  findDoiFromUrl,
];
