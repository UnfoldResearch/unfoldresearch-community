import { Entry, VOTE_WEIGHTS, Vote } from 'unfold-core';

const countScore = (votes: Entry['votes']) => {
  const allVotes = Object.entries(votes) as unknown as [Vote, number][];
  let res = 0;
  for (const [vote, count] of allVotes) {
    res = res + VOTE_WEIGHTS[vote] * count;
  }
  return res;
};

type FilterOrderBy = 'date' | 'score' | 'velocity';
type FilterOrder = 'asc' | 'desc';

export type FilterOptions = {
  // format: Record<Format, boolean>;
  link: {
    refs: boolean;
    links: boolean;
  };
  author: {
    community: boolean;
    authors: boolean;
    bot: boolean;
  };
  orderBy: FilterOrderBy;
  order: FilterOrder;
};

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  // format: FormatOptions.reduce((acc, cat) => ({ ...acc, [cat]: true }), {} as Record<Format, boolean>),
  author: {
    community: true,
    authors: true,
    bot: true,
  },
  link: {
    links: true,
    refs: false,
  },
  order: 'desc',
  orderBy: 'score',
};

export const filterEntries = (entries: Entry[], filterQuery: string, filter: FilterOptions): Entry[] => {
  // const SORT_FIELD: Record<FilterOrderBy, 'createdAt' | 'score' | ((entry: Entry) => number)> = {
  //   date: 'createdAt',
  //   score: 'score',
  //   velocity: (e) => e.score / (Date.now() - e.createdAt),
  // } as const;

  const scores = entries.map((e) => countScore(e.votes));

  // parse and tidy query
  let query = filterQuery.toLowerCase();
  // const extraFilters = {
  //   format: null as string | null,
  //   semantics: null as string | null,
  // }
  // {
  //   query = query.replace(/format:([\w\-]+)/, (_: string, p2: string) => {
  //     extraFilters.format = p2.toLowerCase()
  //     return ''
  //   })

  //   query = query.replace(/semantics:([\w\-]+)/, (_: string, p2: string) => {
  //     extraFilters.semantics = p2.toLowerCase()
  //     return ''
  //   })
  // }
  query = query.trim();

  // filter
  const filteredEntries = entries.filter((entry) => {
    // const linkTypeEnabled = filter.linkType[entry.isRef ? 'refs' : 'links'];
    // const formatTypeEnabled = filter.format[entry.format];
    const titleMatchesQuery = entry.title.toLowerCase().match(query);
    // const contentMatchesQuery = entry.content.toLowerCase().match(query)
    const matchesQuery = query ? titleMatchesQuery /* || contentMatchesQuery */ : true;

    return (
      // linkTypeEnabled &&
      // formatTypeEnabled &&
      matchesQuery
    );
  });

  // sort
  const sortFactor = filter.order === 'asc' ? -1 : 1;

  return filteredEntries;

  // return filteredEntries.sort((a, b) => {
  //   const field = SORT_FIELD[filter.orderBy]!;

  //   const _a = typeof field === 'function' ? field(a) : a[field];
  //   const _b = typeof field === 'function' ? field(b) : b[field];

  //   if (_a < _b) {
  //     return 1 * sortFactor;
  //   }
  //   if (_a > _b) {
  //     return -1 * sortFactor;
  //   }
  //   return 0;
  // });
  // return entries;
};
