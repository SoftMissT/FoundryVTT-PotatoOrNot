# Foundry VTT v14 compatibility

Potato Or Not v0.6.0 supports Foundry VTT v13 and is verified for v14.

## Runtime lifecycle

- Module settings and the settings menu are registered during `init`.
- The public `globalThis.PotatoOrNot` API is created during `ready`.
- `PotatoOrNotReady` is emitted with the API instance after initialization.
- The preset dialog uses `ApplicationV2`, `HandlebarsApplicationMixin`, and `render({ force: true })`.

## Graphics settings

Foundry can add or remove client graphics settings between core releases. Before applying a preset, the module checks every `module.setting` key against the live `game.settings.settings` registry. Unsupported keys are skipped, preventing an obsolete core setting from breaking the complete preset.

## Release package

Run `npm test` to validate JavaScript, manifest compatibility, lifecycle patterns, versions, and translations. Run `npm run build` to produce the Foundry-ready directory in `dist/`.

Published GitHub releases attach:

- `module.json`
- `module.zip`

The manifest and download URLs are rewritten for the release tag by the GitHub Actions workflow.
