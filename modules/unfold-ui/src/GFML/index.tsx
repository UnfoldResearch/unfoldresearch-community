import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import cn from 'classnames';
import { formatGFMLatexText } from './helpers';
import { clampStyle } from '../clampStyle';
import React from 'react';

type GFMLProps = {
  text: string;
  inlineOnly?: boolean;
  nonInteractive?: boolean;
  style?: CSSProperties;
  className?: string;
  clamp?: number;
};

// GFML - Github Flavored Markdown (and) Latex
export const GFML = ({
  text,
  style = {},
  className,
  inlineOnly = false,
  nonInteractive,
  clamp,
}: GFMLProps): JSX.Element => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const formattedText = useMemo(
    () =>
      formatGFMLatexText(text, {
        inlineOnly,
      }),
    [text, inlineOnly],
  );

  useEffect(() => {
    containerRef.current?.querySelectorAll('a').forEach((tag) => tag.setAttribute('target', '_blank'));
  }, [formattedText]);

  return (
    <span
      ref={containerRef}
      className={cn(
        'gfml-container',
        {
          'non-interactive': !!nonInteractive,
        },
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: formattedText,
      }}
      style={{
        ...(clamp ? clampStyle(clamp) : {}),
        ...style,
      }}
    ></span>
  );
};
