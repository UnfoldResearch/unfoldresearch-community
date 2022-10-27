<a href="https://twitter.com/UnfoldResearch" target="_blank"><img src="https://img.shields.io/twitter/follow/UnfoldResearch?label=Follow&style=social"></a>

# <img src="assets/unfold-logo.svg" height="24"/> Unfold Research - community version

This is a community version of the Unfold Research monorepo.

- `backend/` - the backend API server
- `web/` - for the web app, i.e. the marketing site
- `extension/` - the browser extension ([readme](./extension/README.md#local-dev-setup))
  - `content_scripts/app/` - content script for the extension
  - `options/` - the options page for the extension
  - `popup/` - the popup app for the extension
  - `worker/` - the service worker (aka the background script) for the extension
- `packages/` - separate reusable packages
  - `unfold-core` - core types and configs
  - `unfold-ui` - design system
  - `unfold-api` - API spec and types
  - `unfold-analytics` - analytics events spec
  - `unfold-doi` - utilities for finding a DOI
  - `unfold-utils` - various utilities
- `docs/` - docs, guidelines, processes

## What is a "community" version?

This is a partial mirror of the full, private monorepo that's used for the development of Unfold Research.

This mirror repo gets updated automatically through Github Actions whenever there is a push to the original monorepo.

The "community version" is a place where the community can leave additional feedback or requests, and discuss and contribute amongst each other.

## Why both the private and the community version?

We like working with monorepos, as they keep everything in one place, thus making it simpler to work and iterate. But making everything public would be a massive security risk as there are many important things and a lot of sensitive code that could be leaked and exploited for malicious intents.

Also, we use Github Projects for project management and we wanted to utilize Github's amazing features to get some additional feedback from the community, but still keep them separate, and that meant having two separate repos to be able to achieve that.

## When will it be completely public and Open Source?

The aim _is_ to make the original repo completely open source as soon as possible, but for the time being, we will use this setup, due to our security concerns, project management needs, and a limited capacity to set up things differently and adjust the tooling accordingly. We believe this is a decent compromise for now, and thanks for your patience.

## Verification

Every automatically generated update for this repo also has a tag - a commit hash from the original repo that triggered the update. This also means that once we go open source, you'll even be able to compare hashes and files, and confirm that this repo was a mere mirror of the original, and no additional adjustments have been made on top of it.

Additionally, people have had special concerns in regard to using the Unfold Research browser extension and giving it all the permissions that it needs, especially "to read and modify page data".

With this mirror repo, you can verify the exact functionality of the browser extension and make sure that there's no funny business. For full security, you could also compare this repo against the archive that your browser downloads when installing the extension from the Chrome Web Store and make sure they match.
