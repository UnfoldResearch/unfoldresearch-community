// This needs to be a separate script file from the main content script because
// page's JS objects aren't accessible from a regular content script. See:
// - https://developer.chrome.com/docs/extensions/mv3/content_scripts/#isolated_world
// - https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions
//
// So, to be able to subscribe to routing changes, we have two options:
// 1) use `webNavigation` permissions (https://developer.chrome.com/docs/extensions/reference/webNavigation/)
// 2) inject JS script from content script and use 'postMessage' for communication
//
// The first approach is shared between all extension content script instances,
// which means that we need to use window ID and tab ID to figure out which exact
// instance was making routing changes, which complicates things significantly.
// Thus, the second approach is better - doesn't involve background script
// unnecessarily and also is 1:1 mapping between content script and a script
// getting injected into the page. Because these two contexts are isolated from
// each other, they're safe, and data that needs to passed between them can only
// do that via message API, which requires serialization/deserialization.

const notifyPage = (): void => {
  // const unfoldIframe = document.getElementById(
  //   "unfoldresearch-extension"
  // ) as HTMLIFrameElement;
  window.postMessage(
    {
      type: "unfold-reroute",
    },
    "*",
  );
};

var _pushState = history.pushState;
history.pushState = function () {
  _pushState.apply(this, arguments);
  notifyPage();
};

var _replaceState = history.replaceState;
history.replaceState = function () {
  _replaceState.apply(this, arguments);
  notifyPage();
};
