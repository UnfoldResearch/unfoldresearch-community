import { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import cn from 'classnames';
import { Icon, IconName, IconProps, IconType } from '../Icon';
import React from 'react';

type ButtonType =
  | {
      outline?: boolean;
      minimal?: undefined;
      textual?: undefined;
    }
  | {
      outline?: undefined;
      minimal?: boolean;
      textual?: undefined;
    }
  | {
      outline?: undefined;
      minimal?: undefined;
      textual?: boolean;
    };

type ButtonProps = {
  onClick?: MouseEventHandler<HTMLSpanElement>;
  icon?: IconName | null;
  iconType?: IconType;
  rightIcon?: IconName | null;
  rightIconType?: IconType;
  disabled?: boolean;
  // size?: number; // or "small" | "large"
  tabIndex?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
  iconProps?: Partial<Omit<IconProps, 'icon'>>;
  children?: ReactNode;
} & ButtonType;

type AnchorButtonProps = Omit<ButtonProps, 'onClick'> & {
  href: string;
  newTab?: boolean;
};

const secondaryColor = '#0284c7';

export const Button = ({
  icon = null,
  iconType,
  rightIcon = null,
  rightIconType,
  onClick,
  disabled,
  tabIndex,
  minimal,
  outline,
  textual,
  children,
  className,
  style,
  title,
  iconProps = {},
}: ButtonProps): JSX.Element => {
  const btnType = minimal ? 'btn-minimal' : outline ? 'btn-outline' : textual ? 'btn-text' : 'btn-primary';
  const _iconProps: Omit<IconProps, 'icon'> = {
    size: 14,
    secondaryColor: secondaryColor,
    ...iconProps,
  };
  return (
    <button
      className={cn(btnType, className)}
      style={style}
      onClick={onClick}
      title={title}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {icon && <Icon icon={icon} type={iconType} {..._iconProps} />} {children}{' '}
      {rightIcon && <Icon icon={rightIcon} type={rightIconType} {..._iconProps} />}
    </button>
  );
};

export const AnchorButton = ({
  icon = null,
  iconType,
  rightIcon = null,
  rightIconType,
  href,
  newTab,
  disabled,
  tabIndex,
  minimal,
  outline,
  textual,
  children,
  className,
  style,
  title,
}: AnchorButtonProps): JSX.Element => {
  const btnType = minimal ? 'btn-minimal' : outline ? 'btn-outline' : textual ? 'btn-text' : 'btn-primary';
  return (
    <a
      className={cn(btnType, className, { 'btn-disabled': disabled })}
      style={style}
      href={href}
      target={newTab ? '_blank' : '_self'}
      rel="noreferrer noopener"
      title={title}
      tabIndex={tabIndex}
    >
      {icon && <Icon icon={icon} size={14} type={iconType} secondaryColor={secondaryColor} />} {children}{' '}
      {rightIcon && <Icon icon={rightIcon} size={14} type={rightIconType} secondaryColor={secondaryColor} />}
    </a>
  );
};
