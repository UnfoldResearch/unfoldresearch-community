import { useMemo, useState } from 'react';
import { Entry, Format } from 'unfold-core';
import { Button, Icon, Input, FormatIcon } from 'unfold-ui';
import { EntryPreview } from './EntryPreview';
import { DEFAULT_FILTER_OPTIONS, filterEntries } from '../utils/filtering';
import { useNavigation } from '../utils/useNavigation';

const CIRCLE_ICONS: readonly Format[] = ['dataset', 'software', 'paper', 'notes', 'review', 'question'] as const;

export const EntriesList = ({ entries }: { entries: Entry[] | null }): JSX.Element => {
  const { current, goToSubmit, goToBrowse } = useNavigation<'browse'>();
  const [query, setQuery] = useState('');
  const [filter /* , setFilter */] = useState(DEFAULT_FILTER_OPTIONS);

  const filteredEntries = useMemo(() => filterEntries(entries ?? [], query, filter), [entries, query, filter]);

  return (
    <div className="entries-list grid h-full grid-rows-m1 overflow-hidden">
      <div className="my-3 flex items-center justify-between px-3">
        {entries && entries.length > 0 ? (
          <div className="relative inline-flex items-center gap-1">
            {/* <Button minimal icon="sliders-horiz-2" className="text-gray-400" title="Adjust the filter" /> */}
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              spellCheck={false}
              className="bg-bp-gray-1"
            />
          </div>
        ) : (
          <div></div>
        )}
        <Button
          icon="plus-rec"
          onClick={() => {
            goToSubmit(current.entry);
          }}
        >
          Add new
        </Button>
      </div>

      {!!entries && (
        <div className="relative h-full overflow-auto">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <EntryPreview
                key={entry.id}
                entry={entry}
                onClick={() => {
                  goToBrowse(entry);
                }}
              />
            ))
          ) : (
            <div className="pointer-events-none absolute inset-0 mx-auto grid w-[360px] select-none place-content-center p-9 text-center text-base text-gray-500">
              <div
                className="relative mx-auto"
                style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                }}
              >
                {CIRCLE_ICONS.map((fmt, idx) => (
                  <div
                    key={fmt}
                    className="absolute text-gray-400"
                    style={{
                      top: Math.sin((2 * Math.PI * idx) / CIRCLE_ICONS.length) * 60 + 60 + 'px',
                      left: Math.cos((2 * Math.PI * idx) / CIRCLE_ICONS.length) * 60 + 60 + 'px',
                    }}
                  >
                    <FormatIcon color="currentColor" format={fmt} size={30} type="filled" />
                  </div>
                ))}
                <Icon
                  icon="unfold"
                  secondaryColor="rgb(107 114 128 / var(--tw-text-opacity))"
                  className="absolute text-gray-400"
                  style={{
                    top: '64px',
                    left: '64px',
                  }}
                />
              </div>
              <div className="mt-10 mb-3">
                Share links to research papers, reviews, videos, blog posts, projects, files...
              </div>
              <div className="pointer-events-none flex flex-row items-center justify-center text-base">
                Click{' '}
                <Button outline icon="plus-rec" className="gray mx-1">
                  Add new
                </Button>{' '}
                to get started
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
