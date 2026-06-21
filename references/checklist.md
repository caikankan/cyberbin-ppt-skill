# Delivery Checklist

Run `scripts/validate-deck.mjs` first, then inspect in Chrome.

## Static Checks

- The generated file is named `index.html`.
- `<title>` is real, not `[必填]`.
- No visible `[必填]`, `TODO`, or `SLIDES_HERE` remains.
- The deck includes `meta name="cyberbin-template"` with `pinboard`.
- The deck includes `meta name="cyberbin-slide-target"` with the intended slide count.
- If the user did not request a count, validate against 20 slides.
- No paid template site URL appears in the output.
- Every local `images/...` path exists.
- Runtime controls remain: `deck`, `hint`, ESC overview code, and low-power `B` mode.
- Runtime tools remain: `Edit`, `Save HTML`, and `PPTX`.
- Simple slide entrance animation code remains active unless `B` static mode is enabled.
- If the brief is Chinese, main content is Chinese and no English demo filler remains.
- If the user requested full Chinese, decorative metadata is Chinese too.
- Chinese `pinboard` decks keep paperclip marks on covers, agenda rows, cards, and dark section pages.

## Input Material Checks

- Identify the input type before writing slides: one-line topic, PDF, PPT/PPTX, TXT/Markdown/plain text, image/screenshot, or structured outline.
- PDF inputs are summarized into teaching or presentation structure; no PDF page is recreated as a dense text slide.
- PPT/PPTX inputs are rebuilt with CyberBin layouts; the output is not a visual reskin of the original deck.
- TXT/Markdown/plain text inputs are compressed into slide-level claims, not pasted paragraph by paragraph.
- Image and screenshot inputs are used as visual references, evidence, or context; dense screenshot text is not copied directly into slide bodies.
- Structured outlines may define the page order, but overlong page content is still compressed, split, or removed.

## Visual-First Content Checks

- The deck reads as a designed presentation, not a document pasted into slides.
- A 10,000-word source has been reduced to the requested slide count; excess text is not forced into the visible pages.
- Each slide carries one core claim, one teaching action, or one structural module.
- No slide looks like a dense article, worksheet, raw table, PDF screenshot, or unreadable source-material dump.
- ESC overview thumbnails remain visually readable; no thumbnail appears as a block of tiny text.
- Long source text has been compressed, merged, rewritten, split, or omitted before entering the page.
- The visible deck preserves title hierarchy, card spacing, paperclip placement, navigation, and whitespace.
- If information must be omitted for visual clarity, prefer a concise page plus speaker-facing thinking over a crowded slide.

## Commands

Validate a normal 20-slide deck:

```bash
node scripts/validate-deck.mjs path/to/index.html --expected-slides 20 --template pinboard
```

Validate a 5-slide visual demo:

```bash
node scripts/validate-deck.mjs path/to/index.html --expected-slides 5 --template pinboard
```

## Visual Checks

- First viewport clearly shows the subject and title.
- Chinese titles use short presentation phrases and the pinboard heavy-display plus handwritten-emphasis pattern when useful.
- Overlong Chinese titles are rewritten or split into a better page structure; raw source text is not forced into the title.
- Agenda items are short phrases; they do not contain OCR fragments, PDF extraction noise, or meaningless metadata.
- Text does not collide with navigation dots.
- Images are not stretched by arbitrary source ratios.
- `Edit` enables visible text editing; `Save HTML` downloads a clean edited copy.
- `PPTX` export command works after `npm install`.
- One deck uses one template system only.
- A 20-slide deck follows the rhythm in `references/layouts.md`.
- If reviewing a future template reference, confirm the 5-slide demo and 20-slide structure demo before making that template public.

## Handoff

- Give the user the absolute path to `index.html`.
- Mention the selected template and slide count.
- Mention whether validation passed.
