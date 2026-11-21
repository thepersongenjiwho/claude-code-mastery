# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

- Static front-end only: `index.html`, `css/styles.css`, `js/storage.js`, `js/app.js`. No `package.json`, build step, linter, test runner, or framework.
- Not a git repository.
- The parent folder (`C:\workspace\claude-code-mastery`) has its own `CLAUDE.md` for an unrelated `login.html` project. Ignore it when working here.
- `README.md` is partly out of date. Where it disagrees with the code, trust the code:
  - It calls the code class-based. Only `BucketListApp` (`js/app.js`) is a class. `BucketStorage` (`js/storage.js`) is an object literal.
  - It documents `createdAt` as a date string (`"2025-11-06"`). The code stores a full ISO timestamp (`new Date().toISOString()`).
  - It mentions an `assets/` folder that does not exist.

## Commands

- Run: open `index.html` directly in a browser, or serve the folder with `python -m http.server 8000` and visit http://localhost:8000. VS Code Live Server also works.
- Build, lint, test: none configured. Don't invent them. There is no test suite, so there is no single-test command.

## Architecture

Read `js/app.js` and `js/storage.js` together to follow the data flow. `index.html` supplies the markup and the modal.

- **`BucketStorage`** (`js/storage.js`) is the only code that touches `localStorage`, under the key `bucketList`. Each mutator follows the same pattern: `load()` the whole array, change it, `save()` the whole array. Nothing is cached in memory. Errors are logged with `console.error`. `load()` returns `[]` on a parse error, and `save()` returns a boolean that no caller checks. So after corrupted data is loaded, the next write overwrites it.
- **`BucketListApp`** (`js/app.js`) owns the DOM. It is created on `DOMContentLoaded` and stored in a global `let app`.
- **Rendering replaces the whole list.** `render()` calls `updateStats()`, then `BucketStorage.getFilteredList(this.currentFilter)`, then sets `#bucketListContainer.innerHTML` from `createBucketItemHTML()`. There are no incremental DOM updates. As a result, the `slideIn` animation on `.bucket-item` replays on every render, including filter changes.
- **Inline handlers couple the two files.** Buttons in the generated markup call `app.handleToggle('<id>')`, `app.openEditModal(...)`, and `app.handleDelete(...)` through `onclick` attributes. Renaming the global `app` or any of these methods silently breaks the buttons, because nothing builds or lints the project. `js/storage.js` must load before `js/app.js`, which is the order in `index.html`.
- **Data model:** `{ id, title, completed, createdAt, completedAt }`. `id` is `Date.now().toString()`, so it is always a string. New items are inserted at the front (`unshift`), so the list is newest first. Completing an item sets `completedAt`. Un-completing sets it to `null`.
- **Filters** are `'all' | 'active' | 'completed'`, held in `app.currentFilter` and not persisted across reloads. `handleFilter` moves the `active` class between buttons. The initial HTML marks "전체" as active, which must match the default `'all'`.
- **Edit modal:** `#editModal` is shown and hidden by toggling the `hidden` and `flex` classes. `app.editingId` holds the item being edited, and `closeEditModal()` resets it.
- **Styling:** Tailwind loads from the CDN, and `css/styles.css` overrides it. Both the generated markup and the CSS depend on `.bucket-item`, `.filter-btn`, and `.line-through`. The mobile media query assumes the button group is `.bucket-item > div:last-child`. The dark-mode block in `styles.css` overrides only a few Tailwind classes (`.bg-white`, `.text-gray-800`, `.text-gray-600`, `.border-gray-300`, and `body`) under `prefers-color-scheme: dark`. Other Tailwind classes you add are not covered there.

## Known issue: quotes in titles break edit and delete

`escapeHtml()` in `js/app.js` escapes only `&`, `<`, and `>`. Titles go into inline `onclick="..."` attributes, where only single quotes are backslash-escaped. A title containing `"` ends the attribute early. A title ending in `\` breaks the JavaScript string. In either case the 수정 and 삭제 buttons for that item stop working. The checkbox is unaffected because it passes only the id.

Fix it by putting `data-id` on the buttons and handling clicks with one delegated listener on `#bucketListContainer`. Don't add more user text to inline attributes.

## Conventions

- UI text and comments are in Korean (`lang="ko"`). Keep that unless asked otherwise.
- Validation and delete confirmation use the native `alert()` and `confirm()`.
- Dates are formatted with `toLocaleDateString('ko-KR')`.
