import { ContentMap, ContentType } from 'unfold-core';
import GFML_CONTENT_DESCRIPTOR from './GFMLContent';
import PAPER_CONTENT_DESCRIPTOR from './PaperContent';
import REVIEW_CONTENT_DESCRIPTOR from './ReviewContent';
import FUNDING_CONTENT_DESCRIPTOR from './FundingContent';
import JOB_CONTENT_DESCRIPTOR from './JobContent';
import EVENT_CONTENT_DESCRIPTOR from './EventContent';

export type ContentDescriptor<C extends ContentType> = {
  // helper text to show while filling out content on Submit screen
  nextStepFn: (data: ContentMap[C]['data']) => string | null;

  // check if data can match a given search query
  matchFn: (data: ContentMap[C]['data'], query: string) => boolean;

  // component renderer
  component: (props: {
    isPreview: boolean;
    data: ContentMap[C]['data'];
    setData: (data: ContentMap[C]['data']) => void;
    query?: (query: string) => void;
  }) => JSX.Element;

  // default value
  default: ContentMap[C]['data'];
};

export const ContentDescriptors: {
  [ct in ContentType]: ContentDescriptor<ct>;
} = {
  'gfml': GFML_CONTENT_DESCRIPTOR,
  'url-paper': PAPER_CONTENT_DESCRIPTOR,
  'review': REVIEW_CONTENT_DESCRIPTOR,
  'funding': FUNDING_CONTENT_DESCRIPTOR,
  'job': JOB_CONTENT_DESCRIPTOR,
  'event': EVENT_CONTENT_DESCRIPTOR,
};
