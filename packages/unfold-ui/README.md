### SCSS styles

SCSS styles are in separate files, per component that they belong to, but if we try to import `.scss` files directly in the components, NextJS app will complain when trying to import something from `unfold-ui`, because it cannot handle importing `.scss` files directly, and instead requires import of styles only in a custom `<App>`.

So, to make style files play nicely with SSR and NextJS, we combine them all in a single style files, i.e. `./src/style.scss` and we then import only that file within each app that's using `unfold-ui`.

This same approach is used by component libraries, where they expose styles and components separately, so each can/should/must be imported independently.

### Tailwind config: `content`

Just as an FYI, notice how Tailwinds's `content` config is set up in different apps - it includes both app's source code relative glob paths, but it also include paths outside the app's scope. This is to make sure that all of the files are scanned for required classnames, because in local dev mode, it scans those for changes and outputs the final, purged styles, so we need to make sure to include everything that's actually inside the app, but also those classnames used by the `unfold-ui` itself.
