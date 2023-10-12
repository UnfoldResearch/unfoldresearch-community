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

export const formatGFMLatexText = (
  text: string,
  options?: {
    inlineOnly?: boolean;
  },
): string => {
  // if (options?.altLinks) {
  //   marked.use({
  //     renderer: {
  //       link(href, title, text) {
  //         return `<Link href={${href}} title={${title}}>${text}</Link>`;
  //       },
  //     },
  //   });
  // } else {
  //   marked.use({
  //     renderer: {
  //       link(href, title, text) {
  //         return `<a href={${href}} title={${title}}>${text}</a>`;
  //       },
  //     },
  //   });
  // }

  try {
    const textLatexFormatted = formatLatex(text, !!options?.inlineOnly);
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
