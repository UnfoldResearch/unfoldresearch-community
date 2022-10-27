import { useEffect, useMemo, useRef, useState } from 'react';
import { File as UFile } from 'unfold-core';
import { formatFileSize, Keys } from 'unfold-utils';
import { Icon, Button, Input, getFileIcon, clampStyle } from 'unfold-ui';
import cx from 'classnames';
import { flatToHierarchicalFiles, HierarchicalFile } from '../utils/files';
import { useClickOutside } from '../utils/useClickOutside';
import api from '../utils/api';
import { DoneUploadFile, InProgressUploadFile, useFilesUploader } from '../utils/useFilesUploader';
import analytics from '../utils/analytics';

type Props = {
  files: UFile[];
  onChange?: (files: UFile[]) => void;
};

export const FilesInput = ({ files: _files, onChange }: Props): JSX.Element => {
  const uploader = useFilesUploader(_files);
  const [activeFile, setActiveFile] = useState<HierarchicalFile | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<HierarchicalFile['id'], boolean>>({});
  const [newName, setNewName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uploadBtnRef = useRef<HTMLInputElement>(null);

  const inprogressFiles = uploader.files.filter((f) => f.status === 'uploading') as InProgressUploadFile[];
  const doneFiles = uploader.files.filter((f) => f.status === 'done') as DoneUploadFile[];

  const files = useMemo(() => flatToHierarchicalFiles(_files), [_files]);

  useEffect(() => {
    onChange?.(doneFiles.map((f) => f.file));
  }, [uploader.files]);

  useEffect(() => {
    setActiveFile(null);
  }, [files]);

  useClickOutside(containerRef, () => {
    setActiveFile(null);
    setNewName(null);
  });

  const onNewFolder = async () => {
    if (activeFile && !activeFile.isFolder) {
      return;
    }

    const parent: DoneUploadFile | null = (() => {
      if (!activeFile) {
        return null;
      }

      return doneFiles.find((f) => f.file.id === activeFile.id) ?? null;
    })();

    await uploader.createFolder({
      name: `New Folder ${(activeFile ? activeFile.children.filter((f) => f.isFolder).length : files.length) + 1}`,
      parent,
    });

    if (activeFile && activeFile.isFolder) {
      setExpandedFolders({
        ...expandedFolders,
        [activeFile.id]: true,
      });
    }
  };

  const onRemove = async () => {
    if (!activeFile) {
      return;
    }

    const doneFile = doneFiles.find((f) => f.file.id === activeFile.id);

    if (!doneFile) {
      return;
    }

    await uploader.remove(doneFile);
    setActiveFile(null);
  };

  const onUpload = async (uploadFile: File) => {
    if (activeFile && !activeFile.isFolder) {
      return;
    }

    const parent: DoneUploadFile | null = (() => {
      if (!activeFile) {
        return null;
      }

      return doneFiles.find((f) => f.file.id === activeFile.id) ?? null;
    })();

    await uploader.upload({
      file: uploadFile,
      parent,
    });

    if (activeFile && activeFile.isFolder) {
      setExpandedFolders({
        ...expandedFolders,
        [activeFile.id]: true,
      });
    }
  };

  const onRename = async () => {
    if (!activeFile || !newName) {
      return;
    }

    const doneFile = doneFiles.find((f) => f.file.id === activeFile.id);

    if (!doneFile) {
      return;
    }

    await uploader.rename({
      file: doneFile,
      name: newName,
    });

    setNewName(null);
  };

  const interactive = !!onChange;

  return (
    <div ref={containerRef} className="overflow-hidden rounded border border-gray-300">
      {interactive && (
        <div className="flex flex-row items-center justify-between border-b border-gray-200">
          <div>
            <Button
              minimal
              icon="folder-open"
              onClick={() => onNewFolder()}
              disabled={!!activeFile && !activeFile.isFolder}
            >
              New Folder
            </Button>
            <Button
              minimal
              icon="export-2"
              onClick={() => {
                uploadBtnRef.current?.click();
              }}
              disabled={!!activeFile && !activeFile.isFolder}
            >
              Upload
              <input
                ref={uploadBtnRef}
                type="file"
                name="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || files.length < 1) {
                    return;
                  }

                  for (let i = 0; i < files.length; i++) {
                    onUpload(files[i]);
                  }

                  e.target.files = null;
                  e.target.value = '';
                }}
              />
            </Button>
          </div>
          <div>
            {/* {activeFile && !activeFile.isFolder && <Button icon="import-2" minimal title="Download" />} */}
            {activeFile && <Button minimal icon="trash" title="Delete" onClick={() => onRemove()} />}
          </div>
        </div>
      )}

      <div
        className={cx('relative max-h-[250px] overflow-y-auto bg-white', {
          'min-h-[120px]': interactive,
        })}
      >
        <FileItem
          file={
            {
              children: files,
            } as HierarchicalFile
          }
          root
          depth={-1}
          selectedId={activeFile ? activeFile.id : null}
          onSelect={(file) => {
            setActiveFile(file);
          }}
          expandedFolders={expandedFolders}
          onToggleExpand={(file) => {
            if (!file.isFolder) {
              return;
            }

            setExpandedFolders({
              ...expandedFolders,
              [file.id]: !expandedFolders[file.id],
            });
          }}
          newName={newName}
          onNewNameChange={(value) => setNewName(value)}
          onRename={onRename}
          interactive={interactive}
        />
        {files.length === 0 && (
          <div className="absolute inset-0 grid place-items-center italic text-gray-400">
            Click 'Upload' to add files
          </div>
        )}
      </div>

      {inprogressFiles.length > 0 && (
        <div className="border-t border-gray-300 bg-white">
          {inprogressFiles.map((f) => (
            <div key={f.id} className="grid grid-cols-1m items-center justify-between pl-2">
              <span className="grid grid-cols-m1 items-center gap-1">
                <Icon type="duotone" icon={getFileIcon(f.name)} color="#5C7080" size={14} />
                <span style={clampStyle(1)}>{f.name}</span>
              </span>
              <span className="grid auto-cols-max grid-flow-col items-center gap-1">
                <span>{Math.min(Math.floor((f.sentBytes / f.totalBytes) * 100), 100)}%</span>
                <Button
                  minimal
                  title="Cancel"
                  icon="trash"
                  onClick={() => {
                    uploader.cancel(f);
                  }}
                  style={{
                    minHeight: '20px',
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type FileItemProps = {
  file: HierarchicalFile;
  selectedId: HierarchicalFile['id'] | null;
  onSelect: (file: HierarchicalFile) => void;
  root?: boolean;
  depth?: number;
  expandedFolders: Record<HierarchicalFile['id'], boolean>;
  onToggleExpand: (file: HierarchicalFile) => void;
  newName: string | null;
  onNewNameChange: (value: string | null) => void;
  onRename: () => void;
  interactive: boolean;
};

const FileItem = ({
  file,
  selectedId,
  onSelect,
  root = false,
  depth = 0,
  expandedFolders,
  onToggleExpand,
  newName,
  onNewNameChange,
  onRename,
  interactive,
}: FileItemProps): JSX.Element => {
  const aRef = useRef<HTMLAnchorElement | null>(null);

  const sortedChildren: HierarchicalFile[] = useMemo(() => {
    return file.children.sort((a, b) => {
      if (a.isFolder && !b.isFolder) {
        return -1;
      }
      if (!a.isFolder && b.isFolder) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [file.children]);

  return (
    <div>
      {!root && (
        <div
          className={cx(
            'grid cursor-pointer grid-cols-1m items-center justify-between gap-1 py-0.5 pr-2 hover:bg-gray-200',
            {
              'bg-gray-100': selectedId === file.id,
            },
          )}
          style={{
            paddingLeft: `${depth * 18 + 8}px`,
          }}
          onClick={() => onSelect(file)}
        >
          <div className="grid grid-flow-col grid-cols-m1 items-center gap-1">
            <Icon
              type="duotone"
              onClick={() => onToggleExpand(file)}
              color={file.isFolder ? '#D99E0B' : '#5C7080'}
              secondaryColor={file.isFolder ? '#D99E0B' : '#5C7080'}
              size={14}
              icon={file.isFolder ? (expandedFolders[file.id] ? 'folder-open' : 'folder') : getFileIcon(file.name)}
            />
            {interactive ? (
              newName !== null && file.id === selectedId ? (
                <Input
                  style={{
                    padding: 0,
                  }}
                  autoFocus
                  value={newName}
                  onChange={(e) => onNewNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === Keys.Escape) {
                      onNewNameChange(null);
                    }
                    if (e.key === Keys.Enter) {
                      onRename();
                    }
                  }}
                />
              ) : (
                <span style={clampStyle(1)} onDoubleClick={() => onNewNameChange(file.name)}>
                  {file.name}
                </span>
              )
            ) : (
              <span
                style={clampStyle(1)}
                onDoubleClick={async () => {
                  if (file.isFolder) {
                    return;
                  }

                  try {
                    const res = await api.file.download({
                      fileS3Key: file.s3Key,
                    });

                    if (res && aRef.current) {
                      aRef.current.href = res.url;
                      aRef.current.click();
                      analytics.events.track('ext.files.download', {
                        fileId: file.id,
                      });
                    }
                  } catch {}
                }}
              >
                {file.name} <a href="" download ref={aRef} className="hidden"></a>
              </span>
            )}
          </div>
          <div className="flex flex-row items-center gap-1 text-xxs text-gray-500">
            <span>
              {!file.isFolder && <span>{formatFileSize(file.size, { space: true })}</span>}
              {/* {formatTimeDiff(file.createdAt.getMilliseconds(), {
                format: 's',
              }).replace(' ago', '')} */}
            </span>
          </div>
        </div>
      )}

      {sortedChildren.length > 0 && (root || expandedFolders[file.id]) && (
        <div>
          {sortedChildren.map((childFile) => (
            <FileItem
              key={childFile.id}
              file={childFile}
              onSelect={onSelect}
              selectedId={selectedId}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
              newName={newName}
              onNewNameChange={onNewNameChange}
              onRename={onRename}
              interactive={interactive}
            />
          ))}
        </div>
      )}
    </div>
  );
};
