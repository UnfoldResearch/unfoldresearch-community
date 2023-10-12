import { ReactNode, useImperativeHandle } from 'react';
import { forwardRef, useEffect, useRef } from 'react';
import analytics from '../utils/analytics';

const INITIAL_WIDTH = '400px';
// const EDGE_HOVER_COLOR = '#2488FF';

type WrapperProps = {
  initialWidth?: string;
  maxWidth: string;
  minWidth: string;
  children: ReactNode;
  onResize?: (isResizing: boolean) => void;
};

export const ResizableWrapper = forwardRef<HTMLDivElement, WrapperProps>(
  ({ initialWidth = INITIAL_WIDTH, maxWidth, minWidth, children, onResize }, ref) => {
    const edgeRef = useRef<HTMLDivElement>(null);
    const resizableContainerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => resizableContainerRef.current!);

    const resizeActive = useRef(false);

    useEffect(() => {
      edgeRef.current?.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        resizeActive.current = true;
        onResize?.(resizeActive.current);
        document.documentElement.style.cursor = 'col-resize';
      });
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', () => {
        if (!resizeActive.current) {
          return;
        }

        resizeActive.current = false;
        onResize?.(resizeActive.current);
        document.documentElement.style.cursor = 'default';
        analytics.events.track('sidebar.resize');
      });
    }, []);

    const resize = (e: MouseEvent) => {
      if (!resizableContainerRef.current || resizeActive.current === false) {
        return;
      }
      const newWidth = window.innerWidth - e.pageX;
      resizableContainerRef.current.style.width = `clamp(${minWidth}, ${newWidth}px, ${maxWidth})`;
    };

    return (
      <div
        ref={resizableContainerRef}
        className="relative grid h-full grid-flow-col"
        style={{
          width: `${initialWidth}`,
        }}
      >
        {children}
        <div ref={edgeRef} className="absolute h-full w-1 cursor-col-resize" />
      </div>
    );
  },
);
