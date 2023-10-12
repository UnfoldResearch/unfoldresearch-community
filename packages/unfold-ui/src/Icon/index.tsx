import React, { CSSProperties } from 'react';
import { Spinner } from '../Spinner';

// @ts-ignore
import lineIcons from './line.json';
// @ts-ignore
import gestaltIcons from './gestalt.json';
// @ts-ignore
import filledIcons from './filled.json';
// @ts-ignore
import duotoneIcons from './duotone.json';
// @ts-ignore
import duocolorIcons from './duocolor.json';

const icons: {
  line: Record<Exclude<IconName, 'loading' | 'unfold'>, string[]>;
  gestalt: Record<Exclude<IconName, 'loading' | 'unfold'>, string[]>;
  filled: Partial<Record<Exclude<IconName, 'loading' | 'unfold'>, string[]>>;
  duocolor: Record<Exclude<IconName, 'loading' | 'unfold'>, [Record<string, any>, string]>;
  duotone: Record<Exclude<IconName, 'loading' | 'unfold'>, [Record<string, any>, string]>;
} = {
  line: lineIcons,
  gestalt: gestaltIcons,
  filled: filledIcons,
  // @ts-ignore
  duocolor: duocolorIcons,
  // @ts-ignore
  duotone: duotoneIcons,
};

export const IconNameOptions = [
  'activity-rec',
  'alert-triangle',
  'arrow-bottom-rec',
  'arrow-left-rec',
  'arrow-right-rec',
  'arrow-top-rec',
  'bell-slash',
  'bell',
  'book-open',
  'bookmark',
  'box-2',
  'briefcase-2',
  'calendar-dates',
  'call-incoming',
  'camera-slash',
  'camera',
  'chart-column',
  'chart-pie',
  'checkbox-circle',
  'clock',
  'comment-2-text',
  'comments-2',
  'compass',
  'copy',
  'credit-card',
  'dashboard',
  'diskette',
  'elements-plus',
  'elements',
  'email',
  'emotion-smile',
  'export-2',
  'eye-slash',
  'eye',
  'file-download',
  'file-text',
  'flag-2',
  'folder-open',
  'folder',
  'gear-2',
  'gps-slash',
  'gps',
  'heart',
  'home',
  'image-3',
  'import-2',
  'inbox-filled',
  'lifebuoy',
  'lightning-slash',
  'lightning',
  'lock-2-opened',
  'lock-2',
  'log-in-2',
  'log-out-2',
  'megaphone',
  'mic-slash',
  'mic',
  'minus-rec',
  'modules',
  'moon',
  'more-horiz',
  'more-vert',
  'mouse',
  'music-note-2',
  'new-release',
  'note-text',
  'pen-tool-2',
  'phone',
  'pin',
  'plus-rec',
  'presentation-chart',
  'receipt',
  'search',
  'send-2',
  'server-2',
  'shopping-bag-2',
  'shopping-bag',
  'sliders-horiz-2',
  'star',
  'sun',
  'swatchbook',
  'thumbs-up',
  'ticket',
  'trash',
  'trophy',
  'user-plus',
  'user',
  'users',
  'video-camera-slash',
  'video-camera',
  'volume-high',
  'volume-slash',
  'wallet',
  'webcam-slash',
  'webcam',
  'yin-yang',
  'loading',
  'unfold',
] as const;

export type IconName = (typeof IconNameOptions)[number];

export const IconTypeOptions = ['line', 'gestalt', 'filled', 'duocolor', 'duotone'] as const;
export type IconType = (typeof IconTypeOptions)[number];

export type IconProps = {
  icon: IconName;
  size?: number;
  color?: string;
  type?: IconType;
  strokeWidth?: number;
  secondaryColor?: string;
  secondaryOpacity?: number;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
};

export const Icon = ({
  icon,
  size = 24,
  color = 'currentColor',
  type = 'line',
  strokeWidth = 0,
  secondaryColor = 'currentColor',
  secondaryOpacity,
  style = {},
  className,
  onClick,
}: IconProps): JSX.Element => {
  if (icon === 'loading') {
    return <Spinner size={size} width={size * 0.2} />;
  }

  if (icon === 'unfold') {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          ...style,
        }}
      >
        <svg viewBox="0 0 512 512">
          <path
            fill={color}
            d="M410.455,7.048l92.686,94.281c1.519,1.545,0.529,4.161-1.633,4.312l-203.935,14.29L410.455,7.048z"
          />
          <path
            fill={color}
            d="M216.118,201.384L76.802,509.007c-0.967,2.136,1.752,4.018,3.41,2.36l316.491-316.491L410.455,7.048 L216.118,201.384z"
          />
          <path
            fill={secondaryColor}
            d="M358.275,59.228l-8.73,119.239L76.801,509.007c-0.967,2.136,1.752,4.018,3.41,2.36l316.491-316.491 L410.455,7.048L358.275,59.228z"
          />
          <path
            fill={secondaryColor}
            d="M9.245,0.001l174.048,5.652L384.61,206.969l-85.52,85.52L8.446,1.845 C7.754,1.152,8.266-0.031,9.245,0.001z"
          />
          <path fill={color} d="M183.294,5.652 L234.733,356.845 L384.61,206.969 Z" />
          <path
            fill={secondaryColor}
            d="M183.294,5.652l11.677,79.726l100.326,100.326c20.012,20.012,20.012,52.458,0,72.47l-65.433,65.433 l4.868,33.237L384.61,206.968L183.294,5.652z"
          />
        </svg>
      </div>
    );
  }

  const svgProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    style: style,
    className: className,
    onClick: onClick,
  };

  switch (type) {
    case 'line':
    case 'gestalt':
    case 'filled': {
      const paths = icons[type][icon];
      const _strokeWidth = type === 'filled' ? 0 : strokeWidth;
      if (!paths) {
        return (
          <span
            style={{
              border: '1px solid red',
              boxSizing: 'border-box',
              display: 'inline-block',
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></span>
        );
      }
      return (
        <svg {...svgProps}>
          {paths!.map((path, idx) => (
            <path
              key={idx}
              fillRule="evenodd"
              d={path}
              fill={color}
              stroke={color}
              strokeWidth={_strokeWidth}
              shapeRendering="geometricPrecision"
            />
          ))}
        </svg>
      );
    }

    case 'duocolor':
    case 'duotone': {
      // temporary render for missing icons
      const i = icons[type][icon];
      if (!i) {
        return (
          <span
            style={{
              border: '1px solid red',
              boxSizing: 'border-box',
              display: 'inline-block',
              width: `${size}px`,
              height: `${size}px`,
            }}
          ></span>
        );
      }
      // /temp-fix
      const item = icons[type][icon][0];
      const Comp = Object.keys(item)[0];
      const path = icons[type][icon][1];
      const extraSecondaryProps: Record<string, any> = {
        stroke: secondaryColor ?? color,
        strokeWidth: type === 'duotone' ? 0 : strokeWidth,
      };
      extraSecondaryProps.fill = secondaryColor ?? color;
      if (type === 'duotone' && secondaryOpacity) {
        extraSecondaryProps.opacity = secondaryOpacity;
      } else if (type === 'duocolor' && color) {
        extraSecondaryProps.opacity = 1;
      }
      return (
        <svg {...svgProps}>
          <Comp {...item[Comp]} {...extraSecondaryProps} />
          <path
            fillRule="evenodd"
            d={path}
            fill={color}
            stroke={color}
            strokeWidth={strokeWidth}
            shapeRendering="geometricPrecision"
          />
        </svg>
      );
    }
  }
};

export const IconsBoard = () => (
  <div className="flex flex-wrap gap-5">
    {IconNameOptions.map((name) => (
      <div key={name} className="flex flex-col items-center gap-1">
        <div className="flex gap-2.5">
          {IconTypeOptions.map((type) => (
            <Icon
              key={`${type}-${name}`}
              icon={name}
              type={type}
              size={16}
              color="#394B59"
              secondaryColor="rgb(59, 162, 252)"
              // secondaryOpacity={0.5}
              // strokeWidth={2}
            />
          ))}
        </div>
        <small className="text-xxs">{name}</small>
      </div>
    ))}
  </div>
);
