# pi-interlude

Ever had a nice prompt prepared and the agent comes back with a question, or you need to check something before continuing? Deleting the draft is wasted effort, copy/pasting to make space for the interlude prompt is cumbersome. `zsh` has this fantastic stash command - `Esc-q` - that allows you to temporarily remove the current command and it will restore it after your interlude command is finished. `pi-interlude` brings this to pi. Install it, reload, enter something, press `Ctrl-x`, enter something else, send it, and watch with awe as your previous prompt reappears 🎉.

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
3. Type and send a temporary message, or use one of the supported slash commands below
4. Your previous draft is restored into the editor

Press the shortcut again before sending to restore the stashed draft manually.

## Slash command support

Auto-restore currently works for:

- `/compact`
- `/model`

For other slash commands, the stash stays armed. You can restore it manually by pressing the interlude shortcut again.

Note: the extension currently stashes editor text only. If your draft includes attachments, those are not restored.

## Default shortcuts

- `f6`
- `ctrl+x`

`f6` is the robust default.
`ctrl+x` is the default secondary shortcut, nice mnemonics like `ctrl+i` (interlude) or `ctrl-s` (stash) are already taken or interfere with system keybindings.

## Configuration

The extension reads a custom `interlude` key from pi's existing keybindings file:

- `~/.pi/agent/keybindings.json`

Example:

```json
{
  "interlude": ["f6", "ctrl+x"]
}
```

Single shortcut example:

```json
{
  "interlude": "f6"
}
```

If `interlude` is not set, the extension defaults to `f6` and `ctrl+x`.

After changing `keybindings.json`, run `/reload` in pi.

