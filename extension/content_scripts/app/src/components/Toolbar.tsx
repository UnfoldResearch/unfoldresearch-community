import { forwardRef, useEffect, useState } from 'react';
import cn from 'classnames';
import { formatAmount, useOptions } from 'unfold-utils';
import { Button, Spinner, BirdLogo } from 'unfold-ui';
import { FormatIcon, Format as NarrowFormat } from 'unfold-plugins';

import { usePageData } from '../utils/usePageData';
import api from '../utils/api';
import { useNavigation } from '../utils/useNavigation';
import { useAuth } from '../utils/useAuth';

type ToolbarProps = {
  toggleExpanded: () => void;
  expanded: boolean;
};

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(({ toggleExpanded, expanded }, ref) => {
  const { current: currentPage } = usePageData();
  const { options } = useOptions();
  const { current, goToBrowse, goToNotifications, goToHelp, goToLibrary } = useNavigation();
  const { user } = useAuth();
  const [counts, setCounts] = useState<Partial<Record<string, number>> | null>(null);
  const [hasNotifs, setHasNotifs] = useState(false);

  useEffect(() => {
    if (!currentPage) {
      return;
    }
    const fetchCounts = async () => {
      setCounts(null);

      const res = await api.entry.countByFormat({
        url: currentPage.url,
      });

      if (res) {
        setCounts(res);

        // const url = new URL(currentPage.url);
        // analytics.events.track('navigation.count', {
        //   url: currentPage.url,
        //   hostname: url.hostname,
        //   withUser: user !== null,
        // });
      }
    };

    fetchCounts();
  }, [currentPage]);

  useEffect(() => {
    // const fetchNotifs = async () => {
    //   const res = await api.notification.count();
    //   if (res) {
    //     setHasNotifs(res.count > 0);
    //   }
    // };

    // fetchNotifs();
  }, []);

  const openNotifications = async () => {
    // goToNotifications();
    // const res = await api.notification.markAll();
    // if (res && res.success) {
    //   setHasNotifs(false);
    // }
  };

  const hasAnyContent = counts && Object.values(counts).some((cnt) => (cnt ?? 0) > 0);

  const selectedItem = (() => {
    switch (current.screen) {
      case 'alerts':
      case 'notifications':
        return 'notifications';
      case 'help':
      case 'feedback':
        return 'help';
      case 'library':
        return 'library';
      default:
        return 'browse';
    }
  })();

  return (
    <div
      onClick={() => toggleExpanded()}
      title="Toggle sidebar"
      style={{
        transition: 'transform 0.15s ease-out',
        marginTop: `${options.positionOffset}px`,
        zIndex: 2,
        minWidth: '40px',
        // clipPath:
        //   options.position === 'right'
        //     ? 'polygon(-10px 0, 100% 0, 100% calc(100% + 10px), -10px calc(100% + 10px))'
        //     : 'polygon(0 0, calc(100% + 10px) 0, calc(100% + 10px) calc(100% + 10px), 0 calc(100% + 10px))',
      }}
      className={cn(
        'absolute inline-block cursor-pointer select-none border-y border-gray-200 bg-white py-3 px-2 text-xs text-gray-700 shadow-md',
        {
          'right-full rounded-l border-l': options.position === 'right',
          'left-full rounded-r border-r': options.position === 'left',
        },
      )}
      data-comp="toolbar"
      ref={ref}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn({
            'mb-3': !expanded && (hasAnyContent || !counts),
          })}
          style={{
            minWidth: '14px',
            minHeight: '14px',
            width: '14px',
            height: '14px',
          }}
        >
          <BirdLogo />
        </div>

        {counts ? (
          !expanded ? (
            <div className="flex flex-col gap-1">
              {(Object.entries(counts) as [string, number][])
                .filter(([, cnt]) => cnt)
                .map(([format, cnt]) => (
                  <div className="flex items-center gap-1" key={format}>
                    <FormatIcon format={format as NarrowFormat} /> {formatAmount(cnt)}
                  </div>
                ))}
            </div>
          ) : null
        ) : (
          !expanded && <Spinner size={14} />
        )}

        {expanded && !!user && (
          <div className="mt-6 flex flex-col gap-2">
            <Button
              minimal
              className={cn('flex place-content-center', {
                'border border-gray-200 bg-bp-gray-1': selectedItem === 'browse',
              })}
              icon="chart-column"
              iconProps={{
                className: 'rotate-90',
              }}
              title="Browse"
              onClick={(e) => {
                e.stopPropagation();
                if (current.screen === 'browse' && current.entry.url === currentPage?.url) {
                  return;
                }
                goToBrowse();
              }}
            />
            <Button
              minimal
              className={cn('flex place-content-center', {
                'border border-gray-200 bg-bp-gray-1': selectedItem === 'library',
              })}
              icon="star"
              title="Library"
              onClick={(e) => {
                e.stopPropagation();
                goToLibrary(user.id);
              }}
            />
            <Button
              minimal
              className={cn('relative flex place-content-center border', {
                'border-gray-200 bg-bp-gray-1': selectedItem === 'notifications',
                'border-transparent': selectedItem !== 'notifications',
              })}
              icon="bell"
              title="Notifications"
              onClick={(e) => {
                e.stopPropagation();
                openNotifications();
              }}
            >
              {hasNotifs && (
                <div className="absolute top-[3px] right-[3px] h-[5px] w-[5px] rounded-full bg-sky-600 opacity-60"></div>
              )}
            </Button>
            <Button
              minimal
              className={cn('flex place-content-center', {
                'border border-gray-200 bg-bp-gray-1': selectedItem === 'help',
              })}
              icon="lifebuoy"
              title="Help"
              onClick={(e) => {
                e.stopPropagation();
                goToHelp();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
