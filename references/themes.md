# Theme Rules

## Template Tokens

Each HTML seed defines theme variables near the top of its `<style>` block. Change those variables only inside this skill's copied deck output, not inside the original Guizang skill.

| Template | Base | Key Colors |
|---|---|---|
| `pinboard` | pinboard | bright yellow paper, deep blue ink, cream paper cards, hand-drawn pin marks |

## Typography

- Default to Chinese main content when the user brief is Chinese. Main content includes title, agenda, section titles, body copy, conclusions, methods, and action items.
- Pinboard uses heavy sans display titles, handwritten emphasis words, sans body, and mono metadata.
- Chinese title sizing applies only to Chinese decks; do not change English title sizing.
- English decks use the confirmed CyberBin pinboard English proportions: large English display title, handwritten emphasis only where it improves rhythm, right-aligned top-right metadata, English hint text, and no Chinese residual UI copy.
- For Pinboard Chinese level-1 titles longer than 5 Chinese characters, add a Chinese sizing class such as `zh-h1-long`, `zh-section-long`, or `zh-cover-title` instead of using the raw English-scale title classes.
- In `pin-detail` layouts, the title area is narrower because of the left notice column. If a Chinese level-1 title is longer than 5 Chinese characters, use `zh-h1-long` so it stays visually controlled and avoids awkward two-line breaks.
- Chinese hero titles should be short. If a title exceeds 12 Chinese characters, split it over clean semantic lines or rewrite it.
- For Chinese decks, English can remain only as decorative mono metadata when the template relies on it visually. Examples: `FIELD GUIDE`, `PHASE`, `EVIDENCE`, `VOL.`, `DECK`. These labels should be short and secondary.
- If the user asks for full Chinese output, localize decorative labels too. Use concise labels such as `现场手册`, `阶段`, `证据`, `方法`, `决策`, `第 01 页`.
- Never leave English demo filler in a real Chinese deck. Replace phrases such as `What we found`, `Why it matters`, `What to do`, `The trust gap`, and `Pick the pilots` with natural Chinese claims.
- Never use the old English `trust gap` demo as the public English demo. The confirmed English demo is `AI Delivery Tool Stack`.
- Do not use emoji as slide furniture. Use Lucide icons or plain text labels.

## Paperclip Marks

- Use the bundled SVG files in `assets/paperclips/`; do not redraw paperclips with ad hoc inline paths.
- Copy paperclip SVGs into the generated deck's `images/` folder and reference them as local `images/...` assets.
- Keep cover, agenda, card, dark-section, and closing paperclip positions consistent with the confirmed pinboard decks.
- On dark blue pages, use the yellow-filtered paperclip treatment so the mark is visible.
- Paperclip marks are decorative and must never cover titles, card labels, body copy, footer labels, or page numbers.

## Runtime Controls

- Keep the `Edit`, `Save HTML`, and `PPTX` tools hover-only on the right side.
- The toolbar must not occupy the top-right metadata area.
- Keep the Guizang-style in-slide entrance motion and `B` static mode.

## Image Ratios

- Full-width hero image: 21:9.
- Main visual next to text: 16:10 or 4:3.
- Evidence grid: all images in the same grid must share one ratio, preferably 21:9 or 16:10.
- Square note/card image: 1:1.
- Keep images in `images/` and use relative paths like `images/03-dashboard.png`.

## Copyright-Safe Reference Use

Paid template sites may be used as mood references only. Do not copy:

- template HTML/CSS/JS
- paid images or illustrations
- exact slide layouts
- template names
- screenshots as embedded assets
- remote asset URLs
