import { useEffect, useState } from 'react';
import { ContentMap, Format, License, File, FormatMeta, LicenseOptionsMeta } from 'unfold-core';
import { useNavigation } from '../../utils/useNavigation';
import { Button, IconName, LicenseInput, FormatPickerInput, Input, GFML, SectionToggle } from 'unfold-ui';
import { FilesInput } from '../FilesInput';
import api from '../../utils/api';
import analytics from '../../utils/analytics';
import { ContentDescriptors } from '../content';
import { EntryContent } from '../EntryContent';
import { useAuth } from '../../utils/useAuth';
import { EntryFormat } from '../EntryFormat';

export const SubmitScreen = (): JSX.Element => {
  const { current, goToBrowse } = useNavigation<'submit'>();
  const { user } = useAuth();

  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [isPreview, setIsPreview] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ContentMap[keyof ContentMap]>({
    type: 'gfml',
    data: {
      text: '',
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<Format | null>(null);
  // const [tags, setTags] = useState<Tag[]>([]);
  const [license, setLicense] = useState<{ key: License; description: string }>({
    key: 'cc-by-sa-4.0',
    description: '',
  });

  useEffect(() => {
    analytics.events.track('ext.navigation.submit', {
      parentId: current.parent.id,
      parentTitle: current.parent.title,
    });
  }, []);

  useEffect(() => {
    if (!format) {
      setContent({
        type: 'gfml',
        data: {
          text: '',
          ...content.data,
        },
      });
      return;
    }

    const contentType = FormatMeta[format].contentType;

    // this is fine because all content fields share the type,
    // and they are all exclusivelly mapped in the database, so
    // we can coalesce all of the content at once without issues
    setContent({
      // @ts-ignore
      type: contentType,
      // @ts-ignore
      data: {
        ...ContentDescriptors[contentType].default,
        ...content.data,
      },
    });
  }, [format]);

  const {
    disabled: submitBtnDisabled,
    text: submitBtnText,
    icon: submitBtnIcon,
  } = (() => {
    // @ts-ignore
    const contentNextStep = ContentDescriptors[content.type].nextStepFn(content.data);

    const isDisabled =
      !title ||
      !!contentNextStep ||
      !format ||
      status === 'submitting' ||
      (license.key === 'custom' && !license.description);
    let btnText = 'Submit';
    if (!title) {
      btnText = 'Title not set';
    } else if (!format) {
      btnText = `Type not set`;
    } else if (contentNextStep) {
      btnText = contentNextStep;
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

    let icon: IconName | undefined = isDisabled ? 'alert-triangle' : undefined;
    if (status === 'submitting') {
      icon = 'loading';
    } else if (status === 'error') {
      icon = 'alert-triangle';
    }

    return { disabled: isDisabled, text: btnText, icon };
  })();

  const onSubmit = async () => {
    if (status === 'submitting' || !format) {
      return;
    }

    setStatus('submitting');
    try {
      const createdEntry = await api.entry.submit({
        url: typeof current.parent === 'string' ? current.parent : null,
        parentId: typeof current.parent === 'string' ? null : current.parent.id,
        format,
        title,
        content,
        license: license.key,
        licenseDescription: license.description,
        files: files.map((f) => f.id),
        // tags: tags.map((tag) => tag.id),
      });
      // analytics.events.track('Submitted an Entry', {
      //   title,
      //   url: typeof current.parent === 'string' ? current.parent : current.parent.id,
      //   newEntryId: createdEntry ? createdEntry.id : null,
      // });

      if (createdEntry) {
        goToBrowse(createdEntry);
        analytics.events.track('ext.entry.created', {
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

  const ContentComponent = ContentDescriptors[content.type].component;

  const previewAction = (
    <Button
      minimal
      icon={!isPreview ? 'eye' : 'eye-slash'}
      title={!isPreview ? 'Preview' : 'Close preview'}
      onClick={() => {
        analytics.events.track('ext.submit.preview_toggle', {
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
          analytics.events.track('ext.submit.cancel');
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
              format: format || 'paper',
              title: title || '(untitled)',
              license: license.key,
              licenseDescription: license.description ?? '',
              content,
              files,
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
                <EntryFormat
                  // @ts-ignore
                  format={current.parent.format}
                />

                <GFML text={current.parent.title} nonInteractive className="faded" />
              </div>
            )}
          </div>

          {previewAction}
        </div>

        <hr className="my-2 mb-4" />

        <SectionToggle
          header={(exp) => (
            <div className="flex flex-row items-center gap-1">
              <span className="font-semibold">Type:</span>
              {exp ? null : !format ? (
                <span className="text-gray-500">(not selected)</span>
              ) : (
                <EntryFormat format={format} />
              )}
            </div>
          )}
        >
          <div className="mt-3">
            <FormatPickerInput
              value={format}
              onChange={(newFormat) => {
                setFormat(newFormat);
                analytics.events.track('ext.submit.type_change', {
                  format: newFormat,
                });
              }}
            />
          </div>
        </SectionToggle>

        <SectionToggle
          inert
          header={<span className="mb-0.5 font-semibold text-gray-700">Title</span>}
          className="my-3"
        >
          <Input className="w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </SectionToggle>

        <ContentComponent
          // @ts-ignore
          data={content.data}
          setData={(data) => {
            // @ts-ignore
            setContent({ type: content.type, data });
          }}
          isPreview={isPreview}
        />

        <SectionToggle
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
                analytics.events.track('ext.submit.files_change', {
                  filesCount: files.length,
                  op: files.length < newFiles.length ? 'add' : 'rm',
                });
              }}
            />
          </div>
        </SectionToggle>

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
