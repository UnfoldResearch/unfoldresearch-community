import { ContentDescriptor } from '.';

const PaperContentComp: ContentDescriptor<'url-paper'>['component'] = ({ data }) => {
  return <div>{data.paperAbstract && <p>{data.paperAbstract}</p>}</div>;
};

const DESCRIPTOR: ContentDescriptor<'url-paper'> = {
  matchFn: () => true,
  nextStepFn: () => null,
  component: PaperContentComp,
  default: {
    paperDoi: undefined,
    openAlexId: undefined,
    pmid: undefined,
    paperAuthors: undefined,
    paperAbstract: undefined,
    paperFullText: undefined,
    paperJournal: undefined,
    paperPublisher: undefined,
    paperYear: undefined,
    paperMonth: undefined,
    paperDay: undefined,
    paperVolume: undefined,
    paperIssue: undefined,
    paperFirstPage: undefined,
    paperLastPage: undefined,
    paperOaStatus: undefined,
    paperOaUrl: undefined,
  },
};

export default DESCRIPTOR;
