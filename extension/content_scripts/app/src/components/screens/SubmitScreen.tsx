import { useEffect, useState } from 'react';
import { License } from 'unfold-core';
import { Button, Input, GFML } from 'unfold-ui';
import { Editor, EditorContextProvider, SerializedEditorState } from 'unfold-plugins';

import { useNavigation } from '../../utils/useNavigation';
import api from '../../utils/api';
import analytics from '../../utils/analytics';

export const SubmitScreen = (): JSX.Element => {
  const { current, goToBrowse } = useNavigation<'submit'>();

  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<SerializedEditorState>(null);
  // const [files, setFiles] = useState<File[]>([]);
  // const [tags, setTags] = useState<Tag[]>([]);

  const [license] = useState<{ key: License; description: string }>({
    key: 'cc-by-sa-4.0',
    description: '',
  });

  const publishDisabled = false;

  const onSubmit = async () => {
    if (status === 'submitting') {
      return;
    }

    setStatus('submitting');
    try {
      const res = await api.entry.submit({
        url: null,
        parentId: current.parent.id,
        content: content as unknown as string,
        title,
        license: license.key,
        licenseDescription: license.description,
        // tags: tags.map((tag) => tag.id),
      });
      // analytics.events.track('Submitted an Entry', {
      //   title,
      //   url: typeof current.parent === 'string' ? current.parent : current.parent.id,
      //   newEntryId: createdEntry ? createdEntry.id : null,
      // });

      if (res) {
        goToBrowse(res.entry.id);
        analytics.events.track('entry.created', {
          title: res.entry.title,
          id: res.entry.id,
        });
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <div className="h-[100vh] overflow-auto">
      <div className="py-2 px-3 text-xs text-gray-700">
        {/* META (parent) */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="mb-0.5">You are adding a new entry under:</div>
            {typeof current.parent === 'string' ? (
              <div>{current.parent}</div>
            ) : (
              <div className="flex flex-col gap-0.5">
                <GFML text={current.parent.title} nonInteractive className="faded" />
              </div>
            )}
          </div>
        </div>

        <hr className="my-2 mb-4" />

        {/* CONTENT */}

        <Input className="w-full mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <EditorContextProvider>
          <div className="rounded border border-gray-300 py-1 px-2 text-xs text-gray-700 bg-white min-h-[150px]">
            <div className="relative">
              <Editor onChange={(content) => setContent(content)} />
            </div>
          </div>
        </EditorContextProvider>

        {/* files, semantics, tags, license */}

        {/* SUBMIT BUTTONS */}
        <div className="mt-2 flex justify-end gap-1">
          <Button
            minimal
            onClick={() => {
              goToBrowse(current.parent.id);
              analytics.events.track('submit.cancel');
            }}
          >
            Cancel
          </Button>
          <Button disabled={publishDisabled} onClick={onSubmit}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
