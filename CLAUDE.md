# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어로 작성
- **커밋 메시지**: 한국어로 작성
- **문서화**: 한국어로 작성 (`ROADMAP.md`, `CLAUDE.md` 포함)
- **변수명/함수명**: 영어 (코드 표준 준수)
- **UI 텍스트**: 한국어 (`lang="ko"`, 기존 라벨과 메시지 유지)

## Repository layout

- Root: a static login page (`login.html`, `login.css`, `login.js`) and `ROADMAP.md`.
- `ROADMAP.md` plans a developer web resume. Its files (`index.html`, `style.css`, `data.js`, `script.js`) do not exist yet. Treat the roadmap as the spec when building them.
- `bucket-list-main/` is a separate app with its own `CLAUDE.md` and `README.md`. Work on it from its own `CLAUDE.md`. This file does not cover it.
- Not a git repository. No `package.json`, build step, linter, test runner, or framework. Tailwind CSS is loaded from the CDN where it is used.

## Commands

- Run the login page: open `login.html` directly in a browser. There is no dev server or build.
- Build, lint, test: none configured. Don't invent these commands; add tooling only if the user asks for it.

## Architecture: login page

- `login.html` holds the markup: a single form with `#email` and `#password` fields, error slots `#email-error` / `#password-error`, a status line `#status`, and a show/hide toggle `#toggle-pw`. Element IDs are referenced by `login.js`, so renaming them requires updating both files.
- `login.css` defines colors as CSS custom properties on `:root`, with dark-mode overrides under `prefers-color-scheme: dark`. Validation state uses `aria-invalid="true"` on inputs, which the CSS styles as a red border.
- `login.js` handles all behavior:
  - Client-side validation: email must match a simple `local@domain.tld` regex; password must be at least 8 characters. Errors are written into the `*-error` elements via `setError`.
  - Submit flow: `validate()` runs first, then the button is disabled while the request runs, and the result is shown in `#status` with classes `ok` or `fail`.
  - The request is currently a demo: a 600 ms timeout always succeeds if validation passes. The real `fetch("/api/login", ...)` call is commented out in the `TODO` block. Enabling it means the `catch` branch becomes the real failure path, so the demo timeout must be removed at the same time.

## Architecture: resume site (planned)

- The layout and data flow are specified in `ROADMAP.md` section 3 (file structure) and section 4 (data model).
- Content lives in `data.js` as `window.RESUME`. `script.js` renders it into `index.html`. Keep this split, so editing content never requires touching markup.
- Render with `textContent`, not `innerHTML`, so resume text is never parsed as HTML.
