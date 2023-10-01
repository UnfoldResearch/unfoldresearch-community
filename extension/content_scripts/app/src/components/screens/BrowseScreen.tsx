import { useEffect, useState } from 'react';
import { EntriesList } from '../EntriesList';
import { EntryContent } from '../EntryContent';
import { Entry } from 'unfold-core';
import { useNavigation } from '../../utils/useNavigation';
import api from '../../utils/api';
import { Editor } from 'unfold-plugins';

export const BrowseScreen = (): JSX.Element => {
  const {
    current: { entry },
  } = useNavigation<'browse'>();

  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setEntries(null);
      const data = await api.entry.getEntriesByEntry({
        entryId: entry.id,
      });

      if (data) {
        setEntries(data.entries);
        return;
      }

      setEntries([]);
    };

    fetchData();
  }, [entry]);

  return (
    <div className="grid h-full grid-flow-row grid-rows-m1" data-comp="browse">
      <div className="overflow-hidden">
        <div className="h-full max-h-[440px] overflow-hidden border-b border-gray-200 bg-white">
          <div className="h-full overflow-y-auto px-3">
            <Editor />
            <EntryContent entry={entry} />
          </div>
        </div>
      </div>

      <EntriesList entries={entries} />
    </div>
  );
};
