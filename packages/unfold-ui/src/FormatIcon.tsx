import React from 'react';
import { Format, FormatIconName, FormatMeta } from 'unfold-core';
import { Icon, IconName, IconProps, IconType } from './Icon';

enum Color {
  Brown = '#946638',
  Green = '#43BF4D',
  Purple = '#7157D9',
  Gray = '#5C7080',
  Blue = '#137CBD',
  Red = '#D13913',
  Yellow = '#D99E0B',
}

const FORMAT_ICON_PROPS: Record<
  FormatIconName,
  {
    icon: IconName;
    color: Color;
  }
> = {
  data: { icon: 'folder-open', color: Color.Yellow },
  project: { icon: 'box-2', color: Color.Red },
  research: { icon: 'file-text', color: Color.Blue },
  slides: { icon: 'presentation-chart', color: Color.Blue },
  note: { icon: 'note-text', color: Color.Gray },
  video: { icon: 'video-camera', color: Color.Gray },
  mic: { icon: 'mic', color: Color.Gray },
  review: { icon: 'receipt', color: Color.Purple },
  job: { icon: 'briefcase-2', color: Color.Brown },
  event: { icon: 'calendar-dates', color: Color.Brown },
  funding: { icon: 'wallet', color: Color.Brown },
  inquiry: { icon: 'new-release', color: Color.Green },
};

type FormatIconProps = ({ format: Format; icon?: FormatIconName } | { format?: Format; icon: FormatIconName }) &
  Omit<IconProps, 'icon'>;

export const FormatIcon = ({ format, icon, ...rest }: FormatIconProps): JSX.Element => {
  let baseProps: typeof FORMAT_ICON_PROPS[keyof typeof FORMAT_ICON_PROPS] = FORMAT_ICON_PROPS['research'];
  if (icon) {
    baseProps = FORMAT_ICON_PROPS[icon];
  } else if (format) {
    baseProps = FORMAT_ICON_PROPS[FormatMeta[format].icon];
  }

  const props: IconProps = {
    ...baseProps,
    secondaryColor: baseProps.color,
    type: 'duotone' as IconType,
    size: 14,
    ...rest,
  };

  return <Icon {...props} />;
};
