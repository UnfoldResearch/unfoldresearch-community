import { useEffect, useRef, useState } from 'react';
import analytics from './utils/analytics';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { ResizableWrapper } from './components/ResizableWrapper';
import { isDev, useOptions } from 'unfold-utils';
import cx from 'classnames';
import { usePageData } from './utils/usePageData';

const App = (): JSX.Element => {
  const { unsuppressPageData } = usePageData();
  const { options } = useOptions();

  const [expanded, setExpanded] = useState(isDev());
  const everExpandedRef = useRef(false);
  const expandedRef = useRef(expanded);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

  const toolbar = (
    <Toolbar
      ref={toolbarRef}
      toggleExpanded={() => {
        setExpanded(!expanded);
        expandedRef.current = !expanded;
        analytics.events.track('ext.sidebar.toggle');
      }}
      expanded={expanded}
    />
  );

  const notifyParent = () => {
    const toolbarRect = toolbarRef.current?.getClientRects()[0];
    const wrapperRect = wrapperRef.current?.getClientRects()[0];

    window.parent.postMessage(
      {
        type: 'unfold-modified',
        top: toolbarRect?.top,
        width: toolbarRect?.width,
        height: toolbarRect?.height,
        sidebarWidth: wrapperRect?.width,
        expanded: expandedRef.current,
      },
      '*',
    );
  };

  useEffect(() => {
    const ro = new ResizeObserver(notifyParent);
    toolbarRef.current && ro.observe(toolbarRef.current);
    wrapperRef.current && ro.observe(wrapperRef.current);

    return () => {
      toolbarRef.current && ro.unobserve(toolbarRef.current);
      wrapperRef.current && ro.unobserve(wrapperRef.current);
    };
  }, []);

  useEffect(() => {
    notifyParent();
    if (expanded && !everExpandedRef.current) {
      everExpandedRef.current = true;
      unsuppressPageData();
    }
  }, [expanded]);

  return (
    <div
      className={cx('fixed top-0 bottom-0 grid h-full grid-flow-col', {
        'right-0': options.position === 'right',
        'left-0': options.position === 'left',
      })}
      style={{
        transform: `translateX(${options.position === 'left' ? '-' : ''}${expanded ? 0 : `100%`})`,
        transition: 'transform 0.15s ease-out',
      }}
      data-comp="app"
      onMouseLeave={() => {
        if (isResizing.current) {
          return;
        }

        window.parent.postMessage({ type: 'unfold-leave' }, '*');
      }}
    >
      {options.position === 'right' && toolbar}
      <ResizableWrapper
        minWidth="360px"
        maxWidth="70vw"
        ref={wrapperRef}
        onResize={(r) => {
          notifyParent();
          isResizing.current = r;
        }}
      >
        <Sidebar />
      </ResizableWrapper>
      {options.position === 'left' && toolbar}
    </div>
  );
};

export default App;
