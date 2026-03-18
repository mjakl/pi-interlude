import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

async function loadExtension({ keybindings } = {}) {
	const home = fs.mkdtempSync(path.join(os.tmpdir(), "pi-interlude-"));

	if (keybindings !== undefined) {
		const keybindingsPath = path.join(home, ".pi", "agent", "keybindings.json");
		fs.mkdirSync(path.dirname(keybindingsPath), { recursive: true });
		fs.writeFileSync(keybindingsPath, JSON.stringify(keybindings), "utf8");
	}

	process.env.HOME = home;
	const moduleUrl = `${pathToFileURL(path.resolve("index.ts")).href}?t=${Date.now()}-${Math.random()}`;
	const module = await import(moduleUrl);
	return module.default;
}

function createHarness(extension) {
	const handlers = new Map();
	const shortcuts = [];
	const notifications = [];
	let editorText = "";
	let status;

	const ctx = {
		hasUI: true,
		ui: {
			getEditorText: () => editorText,
			setEditorText: (text) => {
				editorText = text;
			},
			setStatus: (_key, value) => {
				status = value;
			},
			notify: (message, level) => {
				notifications.push({ message, level });
			},
		},
	};

	const pi = {
		registerShortcut: (key, definition) => {
			shortcuts.push({ key, definition });
		},
		on: (name, handler) => {
			handlers.set(name, handler);
		},
	};

	extension(pi);

	return {
		ctx,
		handlers,
		shortcuts,
		notifications,
		getEditorText: () => editorText,
		setEditorText: (text) => {
			editorText = text;
		},
		getStatus: () => status,
	};
}

test("normalizes custom shortcuts from keybindings.json", { concurrency: false }, async () => {
	const extension = await loadExtension({
		keybindings: {
			interlude: [" F6 ", "ctrl+x", "f6", ""],
		},
	});
	const harness = createHarness(extension);

	assert.deepEqual(
		harness.shortcuts.map((shortcut) => shortcut.key),
		["f6", "ctrl+x"],
	);
});

test("stashes the draft and restores it on the next interactive message", { concurrency: false }, async () => {
	const extension = await loadExtension();
	const harness = createHarness(extension);
	const inputHandler = harness.handlers.get("input");

	assert.ok(inputHandler, "input handler should be registered");
	assert.equal(harness.shortcuts.length, 2);

	harness.setEditorText("original draft");
	await harness.shortcuts[0].definition.handler(harness.ctx);

	assert.equal(harness.getEditorText(), "");
	assert.match(harness.getStatus(), /interlude armed/);

	const result = await inputHandler({ source: "interactive", text: "one-off interlude" }, harness.ctx);
	assert.deepEqual(result, { action: "continue" });
	assert.equal(harness.getEditorText(), "original draft");
	assert.equal(harness.getStatus(), undefined);
});

test("pressing the shortcut again restores the stashed draft manually", { concurrency: false }, async () => {
	const extension = await loadExtension();
	const harness = createHarness(extension);

	harness.setEditorText("draft to keep");
	await harness.shortcuts[0].definition.handler(harness.ctx);
	await harness.shortcuts[0].definition.handler(harness.ctx);

	assert.equal(harness.getEditorText(), "draft to keep");
	assert.equal(harness.getStatus(), undefined);
	assert.deepEqual(harness.notifications.map((item) => item.message), [
		"Draft stashed. Send one message and your previous draft will come back.",
		"Interlude draft restored",
	]);
});

test("before_agent_start restores the draft if the interlude input was blank", { concurrency: false }, async () => {
	const extension = await loadExtension();
	const harness = createHarness(extension);
	const inputHandler = harness.handlers.get("input");
	const beforeAgentStartHandler = harness.handlers.get("before_agent_start");

	assert.ok(inputHandler, "input handler should be registered");
	assert.ok(beforeAgentStartHandler, "before_agent_start handler should be registered");

	harness.setEditorText("draft after blank interlude");
	await harness.shortcuts[0].definition.handler(harness.ctx);

	const result = await inputHandler({ source: "interactive", text: "   " }, harness.ctx);
	assert.deepEqual(result, { action: "continue" });
	assert.equal(harness.getEditorText(), "");

	await beforeAgentStartHandler({}, harness.ctx);
	assert.equal(harness.getEditorText(), "draft after blank interlude");
	assert.equal(harness.getStatus(), undefined);
});

test("session_compact restores the stashed draft after slash commands like /compact", { concurrency: false }, async () => {
	const extension = await loadExtension();
	const harness = createHarness(extension);
	const sessionCompactHandler = harness.handlers.get("session_compact");

	assert.ok(sessionCompactHandler, "session_compact handler should be registered");

	harness.setEditorText("draft to restore after compact");
	await harness.shortcuts[0].definition.handler(harness.ctx);

	assert.equal(harness.getEditorText(), "");
	assert.match(harness.getStatus(), /interlude armed/);

	await sessionCompactHandler({}, harness.ctx);
	assert.equal(harness.getEditorText(), "draft to restore after compact");
	assert.equal(harness.getStatus(), undefined);
});
