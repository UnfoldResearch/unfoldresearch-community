import { useEffect, useState } from 'react';
import { License, File, LicenseOptionsMeta } from 'unfold-core';
import { Button, IconName, LicenseInput, Input, GFML, SectionToggle } from 'unfold-ui';

import { useNavigation } from '../../utils/useNavigation';
import { FilesInput } from '../FilesInput';
import api from '../../utils/api';
import analytics from '../../utils/analytics';
import { EntryContent } from '../EntryContent';
import { useAuth } from '../../utils/useAuth';

type NextStepMeta = {
  icon?: IconName;
  text: string;
} | null;

export const SubmitScreen = (): JSX.Element => {
  const { current, goToBrowse } = useNavigation<'submit'>();
  const { user } = useAuth();

  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [isPreview, setIsPreview] = useState(false);

  const [title, setTitle] = useState('');
  // const [files, setFiles] = useState<File[]>([]);
  // const [format, setFormat] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  // const [contentNextStep, setContentNextStep] = useState<NextStepMeta>(null);
  // const [tags, setTags] = useState<Tag[]>([]);
  const [license, setLicense] = useState<{ key: License; description: string }>({
    key: 'cc-by-sa-4.0',
    description: '',
  });

  useEffect(() => {
    analytics.events.track('navigation.submit', {
      parentId: current.parent.id,
      parentTitle: current.parent.title,
    });
  }, []);

  const {
    disabled: submitBtnDisabled,
    text: submitBtnText,
    icon: submitBtnIcon,
  } = (() => {
    const isDisabled =
      !title ||
      // !!contentNextStep ||
      // !format ||
      status === 'submitting' ||
      (license.key === 'custom' && !license.description);

    // text
    let btnText = 'Submit';
    if (!title) {
      btnText = 'Title not set';
      // } else if (!format) {
      //   btnText = `Type not set`;
      // } else if (contentNextStep) {
      //   btnText = contentNextStep.text;
    } else if (license.key === 'custom' && !license.description) {
      btnText = 'License description is empty';
    }
    /* else if (tags.length < 1) {
      btnText = 'Add at least 1 tag...';
    } */
    if (status === 'submitting') {
      btnText = 'Submitting...';
    } else if (status === 'error') {
      btnText = '[Error] Try again';
    }

    // icon
    let icon: IconName | undefined = isDisabled ? 'alert-triangle' : undefined;
    if (status === 'submitting') {
      icon = 'loading';
    } else if (status === 'error') {
      icon = 'alert-triangle';
    }

    return { disabled: isDisabled, text: btnText, icon };
  })();

  const onSubmit = async () => {
    if (status === 'submitting') {
      return;
    }

    setStatus('submitting');
    try {
      const createdEntry = await api.entry.submit({
        url: typeof current.parent === 'string' ? current.parent : null,
        parentId: typeof current.parent === 'string' ? null : current.parent.id,
        // format,
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

      if (createdEntry) {
        goToBrowse(createdEntry);
        analytics.events.track('entry.created', {
          title: createdEntry.title,
          id: createdEntry.id,
        });
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  const previewAction = (
    <Button
      minimal
      icon={!isPreview ? 'eye' : 'eye-slash'}
      title={!isPreview ? 'Preview' : 'Close preview'}
      onClick={() => {
        analytics.events.track('submit.preview_toggle', {
          is_preview: isPreview,
        });
        setIsPreview(!isPreview);
      }}
      className="gray"
    />
  );

  const submitActions = (
    <div className="mt-6 flex flex-col items-center justify-end gap-1">
      <Button disabled={submitBtnDisabled} onClick={onSubmit} icon={submitBtnIcon} className="w-full justify-center">
        {submitBtnText}
      </Button>
      <Button
        minimal
        onClick={() => {
          goToBrowse(current.parent);
          analytics.events.track('submit.cancel');
        }}
        className="w-full justify-center"
      >
        Cancel
      </Button>
    </div>
  );

  if (isPreview) {
    return (
      <div className="h-full text-xs text-gray-700">
        <div className="bg-white px-3 shadow-sm">
          <EntryContent
            actions={previewAction}
            entry={{
              id: 'whatever',
              createdAt: Date.now(),
              createdBy: user!,
              score: 0,
              vote: null,
              content,
              parent:
                typeof current.parent === 'string'
                  ? {
                      id: 'any',
                      title: current.parent,
                    }
                  : {
                      id: current.parent.id,
                      title: current.parent.title,
                    },
              url: typeof current.parent === 'string' ? current.parent : null,
              // format: format || 'paper',
              title: title || '(untitled)',
              license: license.key,
              licenseDescription: license.description ?? '',
            }}
          />
        </div>

        <div className="p-3">{submitActions}</div>
      </div>
    );
  }

  return (
    <div className="h-[100vh] overflow-auto">
      <div className="py-2 px-3 text-xs text-gray-700">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="mb-0.5">You are adding a new entry under:</div>
            {typeof current.parent === 'string' ? (
              <div>{current.parent}</div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {/* <FormatMeta format={current.parent.format as Format} /> */}
                <GFML text={current.parent.title} nonInteractive className="faded" />
              </div>
            )}
          </div>

          {previewAction}
        </div>

        <hr className="my-2 mb-4" />

        {/* <SectionToggle
          header={(exp) => (
            <div className="flex flex-row items-center gap-1">
              <span className="font-semibold">Type:</span>
              {exp ? null : !format ? (
                <span className="text-gray-500">(not selected)</span>
              ) : (
                <FormatMeta format={format as Format} />
              )}
            </div>
          )}
        >
          <div className="mt-3">
            <FormatPickerInput
              value={format as Format}
              onChange={(newFormat) => {
                setFormat(newFormat);
                analytics.events.track('submit.type_change', {
                  format: newFormat,
                });
              }}
            />
          </div>
        </SectionToggle> */}

        <SectionToggle
          inert
          header={<span className="mb-0.5 font-semibold text-gray-700">Title</span>}
          className="my-3"
        >
          <Input className="w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </SectionToggle>
        {/*
        {format && (
          <FormatContentComponent
            isPreview={isPreview}
            query=""
            // format={format as Format}
            data={content}
            setData={setContent}
            setNextStep={setContentNextStep}
          />
        )} */}

        {/* <SectionToggle
          className="my-3"
          header={(exp) => (
            <div>
              <span className="font-semibold">Files: </span>
              {!exp
                ? (() => {
                    const filesCnt = files.filter((f) => !f.isFolder).length;
                    const foldersCnt = files.length - filesCnt;

                    return (
                      <span className="text-gray-500">
                        {files.length === 0
                          ? '(optional)'
                          : [
                              `${filesCnt} file${filesCnt === 1 ? '' : 's'}`,
                              `${foldersCnt} folder${foldersCnt === 1 ? '' : 's'}`,
                            ].join(', ')}
                      </span>
                    );
                  })()
                : null}
            </div>
          )}
        >
          <div className="py-2">
            <FilesInput
              files={files}
              onChange={(newFiles) => {
                setFiles(newFiles);
                analytics.events.track('submit.files_change', {
                  filesCount: files.length,
                  op: files.length < newFiles.length ? 'add' : 'rm',
                });
              }}
            />
          </div>
        </SectionToggle> */}

        {/* <SectionToggle
        header={(exp) => (
          <div>
            <span className="font-semibold">Tags: </span>
            {!exp && tags.length > 0 ? <Tags tags={tags} /> : <span className="text-gray-500">none</span>}
          </div>
        )}
        className="my-1"
      >
        TODO
      </SectionToggle> */}

        <SectionToggle
          header={(exp) => (
            <div>
              <span className="mb-1 font-semibold">License: </span>
              {!exp && <span className="text-gray-500">{LicenseOptionsMeta[license.key].label}</span>}
            </div>
          )}
          className="my-1"
        >
          <LicenseInput
            license={license}
            onChange={setLicense}
            dropdownClassName="mb-2 w-full"
            popoverClassName="h-50"
            className="my-2"
          />
        </SectionToggle>

        {submitActions}
      </div>
    </div>
  );
};
