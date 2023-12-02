import { useEffect, useState } from 'react';
import { EntriesList } from '../EntriesList';
import { EntryContent } from '../EntryContent';
import { Entry } from 'unfold-core';
import { useNavigation } from '../../utils/useNavigation';
import api from '../../utils/api';

export const BrowseScreen = (): JSX.Element => {
  const {
    current: { entryId },
  } = useNavigation<'browse'>();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`refretching entry and entries...`);
      const [entryRes, entriesRes] = await Promise.all([
        api.entry.getEntryById({ entryId }),
        api.entry.getEntriesByEntry({ entryId }),
      ]);

      if (entryRes && entriesRes) {
        setEntry(entryRes.entry);
        setEntries(entriesRes.entries);
      }
    };

    fetchData();
  }, [entryId]);

  return (
    <div className="grid h-full grid-flow-row grid-rows-m1" data-comp="browse">
      <div className="overflow-hidden">
        <div className="h-full max-h-[440px] overflow-hidden border-b border-gray-200 bg-white">
          <div className="h-full overflow-y-auto px-3">{entry && <EntryContent entry={entry} />}</div>
        </div>
      </div>

      {entry && entries && <EntriesList entries={entries} entry={entry} />}
    </div>
  );
};
