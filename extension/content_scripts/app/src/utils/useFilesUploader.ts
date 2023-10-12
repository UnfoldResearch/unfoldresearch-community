import { useRef, useState } from 'react';
import { File as UFile } from 'unfold-core';
import { API_ENDPOINTS, FileUploadResponse } from 'unfold-api';
import api from './api';
import { useAuth } from './useAuth';

const genId = () => Math.floor(Math.random() * 1_000_000_000).toString();

export type UploadFile = {
  id: string;
} & (
  | {
      status: 'uploading';
      name: string;
      sentBytes: number;
      totalBytes: number;
    }
  | {
      status: 'error';
      // error: string;
    }
  | {
      status: 'done';
      file: UFile;
    }
);

export type InProgressUploadFile = Extract<UploadFile, { status: 'uploading' }>;
export type DoneUploadFile = Extract<UploadFile, { status: 'done' }>;
export type ErrorUploadFile = Extract<UploadFile, { status: 'error' }>;

type UploadableFile = {
  xhr: XMLHttpRequest | null;
  uploadFile: UploadFile;
};

type UseFilesUploader = {
  files: UploadFile[];
  upload: (options: { file: File; parent: DoneUploadFile | null }) => void;
  cancel: (file: InProgressUploadFile) => void;
  createFolder: (options: { name: string; parent: DoneUploadFile | null }) => Promise<void>;
  rename: (options: { file: DoneUploadFile; name: string }) => Promise<void>;
  remove: (file: DoneUploadFile) => Promise<void>;
  getDownloadUrl: (file: DoneUploadFile) => Promise<string | null>;
};

export const useFilesUploader = (files: UFile[] = []): UseFilesUploader => {
  const { user } = useAuth();
  const filesRef = useRef<UploadableFile[]>(
    files.map((f) => ({
      xhr: null,
      uploadFile: {
        id: f.id,
        status: 'done',
        file: f,
      },
    })),
  );
  const [rv, setRV] = useState<UploadFile[]>(
    files.map((f) => ({
      id: f.id,
      status: 'done',
      file: f,
    })),
  );

  const setFiles = (files: UploadableFile[]) => {
    filesRef.current = files;
    setRV(files.map((f) => f.uploadFile));
  };

  const upload: UseFilesUploader['upload'] = ({ file, parent }) => {
    const xhr = new XMLHttpRequest();

    const newUploadableFile: UploadableFile = {
      xhr,
      uploadFile: {
        id: genId(),
        status: 'uploading',
        name: file.name,
        sentBytes: 0,
        totalBytes: file.size,
      },
    };

    const handleUploadError = () => {
      newUploadableFile.uploadFile.status = 'error';
      setFiles([...filesRef.current]);
    };

    xhr.open('POST', `${api.urlBase}${API_ENDPOINTS.file.upload}`, true);
    xhr.setRequestHeader('Accept', 'application/json');
    const accessToken = user!.accessToken;
    if (accessToken) {
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parent ? parent.file.id : 'null');

    xhr.upload.onprogress = (e) => {
      if (newUploadableFile.uploadFile.status === 'uploading' && e.lengthComputable) {
        newUploadableFile.uploadFile.sentBytes = e.loaded;
      }
      setFiles([...filesRef.current]);
    };

    xhr.onloadend = () => {
      try {
        if (!xhr.status.toString().match(/2\d\d/)) {
          handleUploadError();
          return;
        }

        const file = JSON.parse(xhr.response) as FileUploadResponse;

        setFiles([
          ...filesRef.current.filter((f) => f.uploadFile.id !== newUploadableFile.uploadFile.id),
          {
            xhr: null,
            uploadFile: {
              ...newUploadableFile.uploadFile,
              status: 'done',
              file,
            },
          },
        ]);
      } catch {}
    };

    xhr.onerror = () => {
      handleUploadError();
    };

    xhr.send(formData);
    setFiles([...filesRef.current, newUploadableFile]);
  };

  const cancel: UseFilesUploader['cancel'] = (file) => {
    const uploadableFile = filesRef.current.find((f) => f.uploadFile.id === file.id);
    if (!uploadableFile) {
      return;
    }

    uploadableFile.xhr!.abort();
    setFiles(filesRef.current.filter((f) => f.uploadFile.id !== file.id));
  };

  const createFolder: UseFilesUploader['createFolder'] = async ({ name, parent }) => {
    const folder = await api.file.createFolder({
      name,
      parentId: parent ? parent.file.id : null,
    });

    if (!folder) {
      return;
    }

    setFiles([
      ...filesRef.current,
      {
        xhr: null,
        uploadFile: {
          id: genId(),
          status: 'done',
          file: folder,
        },
      },
    ]);
  };

  const rename: UseFilesUploader['rename'] = async ({ file, name }) => {
    const res = await api.file.rename({
      fileId: file.file.id,
      name,
    });

    if (res) {
      file.file.name = name;
      file.file.s3Key = res.newS3Key;
      setFiles([...filesRef.current]);
    }
  };

  const remove: UseFilesUploader['remove'] = async (file) => {
    await api.file.delete({
      fileId: file.file.id,
    });

    setFiles(filesRef.current.filter((f) => f.uploadFile !== file));
  };

  const getDownloadUrl: UseFilesUploader['getDownloadUrl'] = async (file) => {
    if (file.file.isFolder) {
      return 'this file is folder (not implemented)';
    }

    try {
      const res = await api.file.download({
        fileS3Key: file.file.s3Key,
      });

      if (res) {
        return res.url;
      }
    } catch {}

    return null;
  };

  return {
    files: rv,
    upload,
    cancel,
    createFolder,
    rename,
    remove,
    getDownloadUrl,
  };
};
