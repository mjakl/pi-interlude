# pi-interlude

A pi extension that lets you stash the current draft, send a one-off interlude message, and then restore the original draft.

## Install

### Option 1: Install from npm (recommended)

```bash
pi install npm:@mjakl/pi-interlude
```

### Option 2: Install via git

```bash
pi install git:github.com/mjakl/pi-interlude
```

### Option 3: Install local package

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

