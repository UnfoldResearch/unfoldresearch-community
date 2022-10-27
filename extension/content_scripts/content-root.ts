var iframe = document.createElement("iframe");
var extensionUrl = chrome.runtime.getURL("content.html");
iframe.src = extensionUrl;
iframe.id = "unfoldresearch-extension";
// @ts-ignore
iframe.style.colorScheme = "light";
document.body.appendChild(iframe);

const sidebarCapture = document.createElement("div");
sidebarCapture.style.position = "fixed";
sidebarCapture.style.zIndex = "10000";
sidebarCapture.style.top = "0px";
sidebarCapture.style.bottom = "0px";
sidebarCapture.style.right = "0px";
sidebarCapture.style.width = "0px";
sidebarCapture.style.background = "none";
const toolbarCapture = document.createElement("div");
toolbarCapture.style.position = "fixed";
toolbarCapture.style.zIndex = "10000";
toolbarCapture.style.top = "0px";
toolbarCapture.style.right = "0px";
toolbarCapture.style.width = "0px";
toolbarCapture.style.height = "0px";
toolbarCapture.style.background = "none";

const handler = () => {
  iframe.style.pointerEvents = "auto";
  toolbarCapture.style.pointerEvents = "none";
  sidebarCapture.style.pointerEvents = "none";
};
sidebarCapture.addEventListener("mouseenter", handler);
toolbarCapture.addEventListener("mouseenter", handler);
document.body.appendChild(sidebarCapture);
document.body.appendChild(toolbarCapture);

const reset = () => {
  iframe.style.pointerEvents = "none";
  toolbarCapture.style.pointerEvents = "auto";
  sidebarCapture.style.pointerEvents = "auto";
};

const sendPageData = (): void => {
  // extract url, title and description
  const url = window.location.href;

  const ogTitle = document.head.querySelector(`meta[property="og:title"]`)?.[
    "content"
  ];
  const title = document.title;
  const ogDesc = document.head.querySelector(
    `meta[property="og:description"]`
  )?.["content"];
  const metaDesc = document.head.querySelector(`meta[name="description"]`)?.[
    "content"
  ];

  iframe.contentWindow.postMessage(
    {
      type: "unfold-pagedata",
      url,
      title: ogTitle || title || url,
      description: ogDesc || metaDesc || "",
    },
    "*"
  );
};

window.addEventListener("message", ({ data }) => {
  // iframe shape
  if (data.type === "unfold-modified") {
    const { top, width, height, sidebarWidth, expanded } = data;
    sidebarCapture.style.width = `${expanded ? sidebarWidth : 0}px`;
    toolbarCapture.style.top = `${top}px`;
    toolbarCapture.style.right = `${expanded ? sidebarWidth : 0}px`;
    toolbarCapture.style.width = `${width}px`;
    toolbarCapture.style.height = `${height}px`;
    if (!expanded) {
      reset();
    }
    return;
  }

  if (data.type === "unfold-leave") {
    reset();
  }

  // page data
  if (data.type === "unfold-reroute") {
    sendPageData();
  }

  if (data.type === "unfold-ready") {
    sendPageData();
  }
});

var s = document.createElement("script");
s.src = chrome.runtime.getURL("inj_script.js");
(document.head || document.documentElement).appendChild(s);
