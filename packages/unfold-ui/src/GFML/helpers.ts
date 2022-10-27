import katex from 'katex';
import { marked } from 'marked';

// import sanitizeHtml from 'sanitize-html';

export const formatLatex = (text: string, inlineOnly = false): string => {
  if (inlineOnly) {
    return text.replace(/(?<!\\)\$([^$]*)(?<!\$)\$/gi, (_, p1) => {
      try {
        return katex.renderToString(p1, { displayMode: false });
      } catch {
        return _;
      }
    });
  } else {
    return (
      text
        // display
        .replace(/^\$([^$]*)(?<!\$)\$$/gi, (_, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true });
          } catch {
            return _;
          }
        })
        .replace(/^\$([^$]*)(?<!\$)\$\n/gi, (_, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true });
          } catch {
            return _;
          }
        })
        .replace(/\n\$([^$]*)(?<!\$)\$$/gi, (_, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true });
          } catch {
            return _;
          }
        })
        .replace(/\n\$([^$]*)(?<!\$)\$\n/gi, (_, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true });
          } catch {
            return _;
          }
        })
        // inline
        .replace(/(?<!\\)\$([^$]*)(?<!\$)\$/gi, (_, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: false });
          } catch {
            return _;
          }
        })
    );
  }
};

export const formatGFMLatexText = (text: string, inlineOnly = false): string => {
  try {
    const textLatexFormatted = formatLatex(text, inlineOnly);
    return marked.parse(textLatexFormatted, {
      gfm: true,
      smartLists: false,
      // sanitizer: (html: string) => sanitizeHtml(html, {
      //   allowedAttributes: {
      //     img: ['src', 'alt'],
      //     a: ['href']
      //   }
      // })
    });
  } catch {
    return text;
  }
};
