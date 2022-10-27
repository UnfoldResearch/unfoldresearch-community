This project used [react-browser-extension](https://github.com/abstractalgo/react-browser-extension/) as its base. The structure of the project is still more or less the same just customized more to work with the monorepo setup.

### Local dev setup

```bash
cd extension/content_scripts/app
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the frontend.

### Building and using the extension

First build it with:

```bash
cd extension
yarn build
```

Then open Chrome browser, go to Extensions, turn on "Developer Mode" (top right), click on "Load Unpacked" and selected `./extension/build` folder.

---

### Isolating extension and page domains and handling an irregular shape

The entire extension has been moved within an `iframe`. This becomes a problem because the content within iframes is in a different stacking context, which means that user interactions over areas that are supposedly empty, but still belonging to an iframe, don't respond at all. So we need a mechanism to handle that.

The approach is to have an overlay content, that fully mimics the underlaying iframe's content shape and toggling user interactions based on where the cursor is:

- if the user enters the overlay area, we hide the overlay and let the user interact with an iframe, as they would expect (because they are on top of it)
- if they exit the iframe's content, we disable iframe (`pointer-events: none`) and activate the overlay again

This, effectively, achieves that they can only interact with where the content of the iframe really is, and all the other empty areas fall back onto the interactions with the page (as they should).

Our irregular shape is made out of two pieces - sidebar and a toolbar (a full height rect (sidebar) + a smaller rect next to it (toolbar)); but our iframe is a bounding box of both, thus leaving some areas that are effectively empty.

We create an overlay that has two `div`s that are of exact dimensions and positions as these two rects, that sit just above an iframe. Whenever we change something in the layout (resize sidebar, toggle show/hide sidebar, move toolbar,... we send a `unfold-modified` message to page that re-updates the overlay accordingly). This keeps the overlay and our iframe content in sync at all times.

1. at the beginning, iframe has `pointer-events: none`, and overlay `pointer-events: auto` (now the can only interact with page, and not with the extension)
2. when we mouse-enter the overlay, we set its `pointer-events` to `none` and of iframe to `auto` (now user can interact with the extension, and not with the page)
3. when the user exits sidebar and toolbar, we send message to page that again switches `pointer-events` for the iframe and the overlay (and we're back to (1) state)

And this is how we always keep the irregular shape and available interactions in sync, yet manage to fit the extension into a separate stacking context (iframe) thus resolving issues with colliding styles as the primary problem.

- video explanation: https://youtu.be/0c8Q6sXdhtg (8min)
- PR: #224

### Page data

![image](https://user-images.githubusercontent.com/1355455/167215280-a3662f92-cf8f-4303-90aa-1f9d08a82aae.png)

A handler for `unfold-ready` message in `content-root.ts` waits for the extension to be initialized, thus signaling that the extension is now ready to accept the page data. Once we recieve that, we send the page data (`sendPageData()`).

A new file `inj_script.ts` has been added because a regular content script cannot access JS objects on a page because of security reasons (see code comments inside that `inj_script.ts`). And because we need to access and modify `window.history` object, we need to be able to access JS object, and thus the existence of `inj_script.ts` file. We simply append it to the page's document (see bottom of `content-root.ts` on how we append it).

We can now respond to `history` updates by handling `unfold-reroute` message, and also triggering `sendPageData()` to refresh the page data within the extension.

- video explanation: https://youtu.be/sTDv1EvHnqU (14min)
- PR: #224
