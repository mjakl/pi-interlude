# pi-interlude

A pi extension that lets you stash the current draft, send a one-off interlude message, and then restore the original draft.

Version: `0.9.0`

## Install

### npm

```bash
pi install npm:@mjakl/pi-interlude
```

### local package

```bash
pi install ./
```

## What it does

1. Press the interlude shortcut
2. Your current editor text is stashed and the input box is cleared
3. Type and send a temporary message
4. Your previous draft is restored into the editor

Press the shortcut again before sending to restore the stashed draft manually.

## Default shortcuts

- `f6`
- `ctrl+i` (`i` for "interlude")

`f6` is the robust default.
`ctrl+i` is a mnemonic secondary shortcut, but in many terminals it is indistinguishable from `tab`, so it may conflict with autocomplete.

## Configuration

The extension reads a custom `interlude` key from pi's existing keybindings file:

- `~/.pi/agent/keybindings.json`

Example:

```json
{
  "interlude": ["f6", "ctrl+i"]
}
```

Single shortcut example:

```json
{
  "interlude": "f6"
}
```

If `interlude` is not set, the extension defaults to `f6` and `ctrl+i`.

After changing `keybindings.json`, run `/reload` in pi.

## Commands

- `/interlude` - stash or restore the current draft
- `/interlude-shortcut` - show the active shortcuts

## Package structure

- `index.ts` - extension entry point
- `package.json` - npm and pi package manifest
- `LICENSE`
- `README.md`

## Publishing notes

This repository is structured as a pi package via the `pi` manifest in `package.json`.
Before publishing, verify package metadata such as package name and repository fields.
