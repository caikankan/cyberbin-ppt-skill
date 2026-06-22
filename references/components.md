# CyberBin Components

Use these components from `assets/templates/pinboard.html`. Do not invent new class names unless you first add them to the template and update this file.

## Slide Shell

Every page is a `<section class="slide ...">` inside `#deck`.

- Use `class="slide light"` for normal paper pages.
- Use `class="slide dark blue"` for dark section or chart pages.
- Add `data-layout="..."` with one of the layout names from `references/layouts.md`.
- Keep `topline` and `footline` on most pages for deck chrome and page numbers.

## Chrome

- `.topline`: upper-left and upper-right metadata. The right item must be right-aligned.
- `.footline`: footer label and page number. Page number must be right-aligned.
- Keep metadata short. It is decorative, not the main message.

## Titles

- `.display`, `.display-tight`: large cover or closing titles.
- `.headline`: normal page title.
- `.section-title`: dark-section title.
- `.zh-cover-title`, `.zh-inline-title`, `.zh-h1-long`, `.zh-section-long`: Chinese sizing safeguards.
- `.hand`: handwritten emphasis. Use it for a short word or phrase, not an entire paragraph.

## Cards

- `.cards-3`: three-card rows.
- `.cards-5`: five-step workflow rows.
- `.card`: cream paper card.
- `.card.yellow`: accent card.
- `.card.warm`: warm paper card.
- `.bottom-note.note`: handwritten card footer.

Rules:

- Do not overfill cards. One heading, one short paragraph, and one optional note is enough.
- Cards should not contain dense paragraphs or raw PDF/PPT text.
- Keep paperclip marks outside important text.

## Paperclips

Use `<img>` marks copied into `images/` by `create-deck.mjs`.

- cover: `pin-cover-1`, `pin-cover-2`
- card: `pin-card`
- dark page corner: `pin-corner pin-yellow`
- small row pin: `pin-small`

Never redraw paperclips with inline SVG. Never let a paperclip cover text.

## Tables

Use `.table-wrap` around a simple table. Keep tables sparse:

- 3-5 columns maximum.
- 3-5 rows maximum.
- Short phrases, not spreadsheet dumps.

## Numbers

Use `.number-grid` and `.number-card` for three-metric pages. Each metric should have:

- one large number
- one short label
- one short explanation

## Quote / Split Panel

Use `.quote-panel` only when the quote mark will not dominate the page. For Chinese decks, prefer `.split-panel` when a large quote mark would waste space.

## Runtime Tools

The template includes `Edit`, `Save HTML`, and `PPTX`. Keep them hover-only on the right side. The PPTX export is image-only.
