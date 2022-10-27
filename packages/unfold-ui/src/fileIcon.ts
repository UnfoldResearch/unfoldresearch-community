import { IconName } from './Icon';

const ICON_MAP: Record<string, IconName> = {
  // image
  'png': 'image-3',
  'bmp': 'image-3',
  'jpg': 'image-3',
  'jpeg': 'image-3',
  'tiff': 'image-3',
  'gif': 'image-3',
  'eps': 'image-3',
  'raw': 'image-3',
  'svg': 'image-3',
  'ai': 'image-3',
  'psd': 'image-3',
  'cdr': 'image-3',
  // video
  'mp4': 'video-camera',
  'avi': 'video-camera',
  'mov': 'video-camera',
  'mkv': 'video-camera',
  'flv': 'video-camera',
  'webm': 'video-camera',
  'wmv': 'video-camera',
  'mpg': 'video-camera',
  'mpeg': 'video-camera',
  // audio
  'mp3': 'music-note-2',
  'flac': 'music-note-2',
  'ogg': 'music-note-2',
  'wav': 'music-note-2',
  'wma': 'music-note-2',
  'aac': 'music-note-2',
  // 3d
  // code
  'r': 'note-text',
  'py': 'note-text',
  'ipynb': 'note-text',
  'sh': 'note-text',
  'nb': 'note-text',
  'c': 'note-text',
  'cpp': 'note-text',
  'h': 'note-text',
  'hpp': 'note-text',
  'tex': 'note-text',
  'latex': 'note-text',
  'js': 'note-text',
  'jsx': 'note-text',
  'ts': 'note-text',
  'tsx': 'note-text',
  'html': 'note-text',
  'css': 'note-text',
  'scss': 'note-text',
  'sass': 'note-text',
  'less': 'note-text',
  'go': 'note-text',
  'exe': 'note-text',
  // writing
  'pdf': 'file-text',
  'djvu': 'file-text',
  'epub': 'file-text',
  'mobi': 'file-text',
  'doc': 'file-text',
  'docx': 'file-text',
  // data
  'json': 'server-2',
  'xml': 'server-2',
  'sql': 'server-2',
  'sqlite': 'server-2',
  'db': 'server-2',
  'csv': 'server-2',
  'xls': 'server-2',
  'xlsx': 'server-2',
  'tsv': 'server-2',
  'dat': 'server-2',
  'ods': 'server-2',
  'dta': 'server-2',
  'sas7bdat': 'server-2',
  'sav': 'server-2',
  'zsav': 'server-2',
  // archive
  'zip': 'box-2',
  '7z': 'box-2',
  'rar': 'box-2',
  'tar': 'box-2',
  'gz': 'box-2',
  'apk': 'box-2',
  'cab': 'box-2',
  'car': 'box-2',
  'dmg': 'box-2',
  'jar': 'box-2',
  // presentation
  'ppt': 'presentation-chart',
  'pptx': 'presentation-chart',
} as const;

export const getFileIcon = (filename: string): IconName => {
  const ext = filename.substring(filename.lastIndexOf('.') + 1);
  return ICON_MAP[ext] ?? 'file-text';
};

// type Props = Omit<IconProps, 'icon'> & {
//   filename: string;
// };

// export const FileIcon = ({ filename, ...props }: Props): JSX.Element => {
//   const icon = getFileIcon(filename);
//   return <Icon {...props} icon={icon} />;
// };
