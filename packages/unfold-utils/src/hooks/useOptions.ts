import { useEffect, useState } from 'react';
import { storage } from '../storage';

export type Options = {
  defaultSidebarWidth: number;
  defaultToolbarSize: number;
  defaultExpanded: boolean;

  position: 'left' | 'right';
  positionOffset: number;

  blacklist: string[];
  whitelist: string[];
};

const DEFAULT_OPTIONS: Options = {
  defaultSidebarWidth: 400,
  defaultToolbarSize: 34,
  defaultExpanded: false,

  position: 'right',
  positionOffset: 160,

  blacklist: [],
  whitelist: [],
};

const OPTIONS_STORAGE_KEY = 'options::options' as const;

export const useOptions = () => {
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);

  useEffect(() => {
    const getOptions = async () => {
      try {
        const options = await storage.get(OPTIONS_STORAGE_KEY, null);
        if (!options) {
          setOptions(DEFAULT_OPTIONS);
          await storage.set(OPTIONS_STORAGE_KEY, DEFAULT_OPTIONS);
        } else {
          setOptions(options);
        }
      } catch {}
    };

    getOptions();
  }, []);

  const setOption = async (option: Partial<Options>): Promise<void> => {
    const newOptions = {
      ...options,
      ...option,
    };
    await storage.set(OPTIONS_STORAGE_KEY, newOptions);
    setOptions(newOptions);
  };

  return { options, setOption };
};
