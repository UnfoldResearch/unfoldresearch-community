import { CSSProperties } from 'react';

export const clampStyle = (lines: number): CSSProperties => ({
  display: '-webkit-box',
  lineClamp: lines,
  WebkitLineClamp: `${lines}`,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxHeight: `${lines}rem`,
});
