import React from 'react';
import cn from 'classnames';

type SpinnerProps = {
  width?: number;
  size?: number;
  /* Duration of the animation cycle, in milliseconds. */
  duration?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryOpacity?: number;
  secondaryOpacity?: number;
  /* Size of the filled arc. Value in [0, 1] range. */
  arcSize?: number;
};

export const Spinner = ({
  duration = 420,
  width = 3,
  size = 16,
  arcSize = 0.33,
  primaryOpacity = 0.7,
  secondaryOpacity = 0.3,
  className,
  primaryColor = 'currentColor',
  secondaryColor = 'currentColor',
}: SpinnerProps): JSX.Element => {
  const r = size * 0.5;
  const circumference = size * Math.PI;
  const arc = arcSize * circumference;

  return (
    <div
      className={cn('animate-spin', className)}
      style={{
        animationDuration: `${duration}ms`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <circle
          r={r - width * 0.5}
          cx={r}
          cy={r}
          stroke={secondaryColor}
          opacity={secondaryOpacity}
          strokeWidth={width}
          fill="none"
        />
        <circle
          r={r - width * 0.5}
          cx={r}
          cy={r}
          stroke={primaryColor}
          opacity={primaryOpacity}
          strokeWidth={width}
          strokeDasharray={`${arc} ${circumference - arc}`}
          fill="none"
        />
      </svg>
    </div>
  );
};
