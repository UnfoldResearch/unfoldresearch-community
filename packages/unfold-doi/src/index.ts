import { DOI_STRATEGIES } from './strategies';

export { DOI_REGEX, isDocumentPDF } from './utils';

export const findDoiInWindow = ({ window }: { window: Window }): string | null => {
  for (const strat of DOI_STRATEGIES) {
    const result = strat({ window });

    if (result && result.startsWith('10.')) {
      return result;
    }
  }

  return null;
};
