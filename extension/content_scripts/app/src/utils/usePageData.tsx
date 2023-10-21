import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { isDev } from 'unfold-utils';
import { IconsBoard, Input, SectionToggle } from 'unfold-ui';
import { ReactNode } from 'react';

type PageData = {
  url: string;
  title: string;
  description: string;
  // Both Toolbar and Sidebar need page data to be able to fetch the right
  // information. Toolbar needs to respond to new page data always and asap,
  // while the Sidebar will need to fetch it (and maybe create it in that
  // process) only when the user interacts with it. So the page data may be
  // available, but "suppressed", i.e. yet unused by the Sidebar. When we
  // expande the Sidebar, we unsuppress it, making it available for Sidebar
  // to do as it pleases.
  suppressed: boolean;
};

const PageDataCtx = createContext<{ current: PageData | null; unsuppressPageData: () => void }>({
  current: null,
  unsuppressPageData: () => {},
});

export const usePageData = () => useContext(PageDataCtx);

export const PageDataProvider = ({ children }: { children?: ReactNode }): JSX.Element => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const suppressedRef = useRef(true);
  const [text, setText] = useState(pageData?.url || '');

  useEffect(() => {
    if (isDev()) {
      setPageData({
        url: 'https://unfoldresearch.com',
        title: 'https://unfoldresearch.com',
        description: 'description',
        suppressed: suppressedRef.current,
      });
      return;
    }

    const pageDataHandler = ({ data }) => {
      if (data.type !== 'unfold-pagedata') {
        return;
      }

      setPageData({
        url: data.url,
        title: data.title,
        description: data.description,
        suppressed: suppressedRef.current,
      });
    };

    window.addEventListener('message', pageDataHandler);

    window.parent.postMessage(
      {
        type: 'unfold-ready',
      },
      '*',
    );

    return () => {
      window.removeEventListener('message', pageDataHandler);
    };
  }, []);

  useEffect;

  useEffect(() => {
    if (isDev()) {
      setText(pageData?.url || '');
    }
  }, [pageData]);

  const unsuppressPageData = useCallback(() => {
    suppressedRef.current = false;
    setPageData(
      pageData
        ? {
            ...pageData,
            suppressed: false,
          }
        : pageData,
    );
  }, [pageData]);

  const content = (
    <PageDataCtx.Provider
      value={{
        current: pageData,
        unsuppressPageData,
      }}
    >
      <div data-comp="page">{children}</div>
    </PageDataCtx.Provider>
  );

  if (!isDev() || !pageData) {
    return content;
  }

  return (
    <div>
      <div className="mr-[500px] mt-[100px] pl-[100px] text-xs text-gray-700">
        <Input
          className="mb-6 w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="URL"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setPageData({
                url: text,
                title: text,
                description: text,
                suppressed: suppressedRef.current,
              });
            }
          }}
        />
        <div className="mb-6">
          <span className="font-semibold">Current url:</span> {pageData.url}
        </div>
        <div className="inline-flex flex-col gap-1">
          {[
            'https://unfoldresearch.com',
            'https://google.com',
            'https://twitter.com',
            'https://linkedin.com',
            'https://youtube.com',
          ].map((url) => (
            <div
              key={url}
              className="cursor-pointer text-sky-600 hover:text-sky-500"
              onClick={() => {
                setPageData({
                  url,
                  title: url,
                  description: url,
                  suppressed: suppressedRef.current,
                });
                setText(url);
              }}
            >
              {url}
            </div>
          ))}
        </div>

        <SectionToggle header="All icons" className="mt-6">
          <div className="mx-auto mt-6">
            <IconsBoard />
          </div>
        </SectionToggle>
      </div>

      {content}
    </div>
  );
};
