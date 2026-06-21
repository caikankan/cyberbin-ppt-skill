---
name: cyberbin
description: Generate local single-file HTML PPT decks with CyberBin's pinboard template, especially Chinese-first decks for PPT, slides, HTML presentations, AI tools, SaaS products, growth reviews, course decks, startup pitches, and template-based storytelling. Use this skill whenever the user asks for a CyberBin PPT, pinboard slides, HTML deck, presentation, or wants to turn a topic, PDF, PPT/PPTX, TXT, Markdown, screenshot/image, or structured outline into a polished horizontal slide deck. CyberBin v1 only includes the pinboard template; default deck length is 20 slides unless the user explicitly requests another count. Always compress source material into visual-first presentation language instead of dumping long text into slides.
---

# CyberBin

CyberBin creates local single-file HTML slide decks using its `pinboard` template. It keeps the Guizang-style deck runtime: one `index.html`, horizontal navigation, keyboard/wheel/touch controls, ESC overview, low-power `B` mode, simple entrance animation, browser text editing, edited HTML saving, PPTX export, and optional image slots.

Do not edit the original Guizang PPT Skill. Use this skill's own files and bundled resources.

The confirmed public visual target is the CyberBin `pinboard` system: bright yellow field, deep blue ink, cream paper cards, bundled paperclip SVG marks, hover-only edit toolbar, right-aligned top-right metadata, and Guizang-style slide entrance motion.

## Public Flow

CyberBin is not an unlimited style generator. v1 currently provides exactly one public template:

- `pinboard` — bright Pinboard Deck style for AI tools, SaaS products, growth reviews, courses, and startup pitches.

If the user asks which templates are available, say CyberBin v1 currently includes only `pinboard`. If they request another style, explain that a new template must be encapsulated before it can be used.

Default to **20 slides** unless the user explicitly requests another slide count. If the user asks for “a deck” or “a PPT” without a count, plan 20 slides.

## Supported Input Materials

CyberBin supports six input material forms. In every case, convert the material into a visual-first presentation, not a source-material replica.

- **One-line topic**: build a clear deck structure from the topic. Default to 20 slides unless the user gives a count.
- **PDF**: extract the structure and key points, then rewrite them as slide-level claims. Do not recreate PDF pages or move dense PDF text into slides.
- **PPT / PPTX**: extract the content logic and rebuild it with CyberBin layouts. Do not merely reskin the original deck.
- **TXT / Markdown / plain text**: compress the text into page-level points, short titles, and concise card copy.
- **Images / screenshots**: use them as visual references, evidence, or source context. Do not place dense screenshot text directly into a slide as readable content.
- **Structured outline**: follow the user's sequence, but compress or split any page whose content exceeds the template capacity.

## Visual-First Content Rules

CyberBin is not a long-form document typesetter. It produces presentation pages with strong layout, spacing, and visual rhythm.

- Treat the template capacity as a hard constraint. A 10,000-word input must still become a concise 10/20-slide presentation, not a dense text dump.
- Prioritize the exported HTML/PPTX visual result over preserving every sentence from the source.
- Keep each slide to one core claim, one teaching action, or one structural module.
- Compress, merge, rewrite, split, or remove excess material before it enters the slide.
- Move useful but excessive detail into speaker-thinking or omit it; do not force it into the visible page.
- Reject dense pages that look unreadable in the ESC overview thumbnails.
- Do not break title hierarchy, card spacing, paperclip placement, navigation, or whitespace to preserve source text.

## Language Rules

CyberBin should be Chinese-first because most expected use cases are Chinese PPTs.

- If the user writes the brief, topic, or source material in Chinese, write the deck's main title, agenda, section titles, body copy, speaker-facing claims, and action items in Chinese.
- Preserve a small amount of English metadata only when it is part of the template's visual language, such as `FIELD GUIDE`, `PHASE`, `EVIDENCE`, `DECK`, or short mono labels. Keep these labels decorative and never let them carry the main meaning.
- If the user says “全中文”, “中文化”, or “不要英文”, translate decorative metadata into short Chinese labels too.
- If the user provides English source material but asks for a Chinese PPT, localize the deck into natural Chinese instead of directly translating sentence by sentence.
- If the user provides Chinese source material but asks for an English deck, use English for all main content and keep template metadata consistent with the selected template.
- For Chinese titles, prefer short spoken phrases. Use the pinboard title pattern of heavy Chinese display text plus handwritten emphasis when useful; rewrite overlong titles instead of forcing raw source text into the layout.
- For English decks, use the confirmed English `AI Delivery Tool Stack` visual proportions: English content, English hint text (`B static`), hover-only right-side tools, no Chinese residual labels, and no old `trust gap` demo content.
- Do not leave demo English filler such as “The trust gap” or “What we found” in a real Chinese deck unless the user explicitly wants bilingual copy.
- For all `pinboard` decks, keep bundled paperclip SVG marks: cover pins, agenda row pins, card pins, and dark-section corner pins. Do not redraw, distort, omit, or let them overlap important text. Use yellow-filtered pins on dark blue pages.

## Generation Workflow

1. Use `pinboard` from `references/template-catalog.md`.
2. Identify the input material form: topic, PDF, PPT/PPTX, TXT/Markdown, image/screenshot, or structured outline.
3. Confirm slide count; default is `20`.
4. Decide language from the user's brief using the Language Rules above.
5. Compress the source into slide-ready claims and page roles before writing HTML. Do not paste long source passages into slides.
6. Create a deck folder in the user's current workspace, normally `<project-name>/ppt`.
7. Run `scripts/create-deck.mjs <template-id> <output-dir> --title "<deck title>" --slides <count>`. For demos, add `--language zh` or `--language en` when the language should be forced.
8. Replace `<!-- SLIDES_HERE -->` with slide sections based on `references/layouts.md`, unless using `--demo`.
9. Put images in the deck's `images/` folder and reference them as `images/name.ext`.
10. Preserve the hover-only toolbar. It should appear when the user hovers near the right-side tool area and must not occupy the top-right metadata position.
11. Run `scripts/validate-deck.mjs <output-dir>/index.html --expected-slides <count> --template <template-id>`.
12. Open `index.html` in Chrome and visually inspect every slide, including ESC overview thumbnails, for dense unreadable text, paperclip collisions, and toolbar/header conflicts.
13. If the user asks for PowerPoint, run `npm install` once in the skill folder if needed, then `node scripts/export-pptx.mjs <output-dir>/index.html <output-name>.pptx`. Explain that the PPTX keeps decorative visuals as background while main text is editable PowerPoint text.

## Smoke Tests

Use a 5-slide visual demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard/ppt --title "Pinboard Demo" --demo --slides 5
node scripts/validate-deck.mjs ./demo-pinboard/ppt/index.html --expected-slides 5 --template pinboard
```

Use a 20-slide structure demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard-20/ppt --title "Pinboard 20 Page Test" --demo --slides 20
node scripts/validate-deck.mjs ./demo-pinboard-20/ppt/index.html --expected-slides 20 --template pinboard
```

Use the confirmed English demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard-en/ppt --title "AI Delivery Tool Stack" --demo --slides 20 --language en
node scripts/validate-deck.mjs ./demo-pinboard-en/ppt/index.html --expected-slides 20 --template pinboard
```

## Future Template Encapsulation Flow

Future templates should be added one at a time after user confirmation. Ask the user to provide each template in this format:

```text
模板 1
名字：
适合做什么：
不合适做什么：
参考图：
必须保留：
不想要：
备注：
```

For each future template, extract the visual system, add a dedicated template file, add layout rules, generate a 5-slide demo and a 20-slide structure demo, then ask the user to confirm before making it public. Do not mix visual rules across templates.

## Resources

- `assets/templates/*.html`: complete HTML seed templates copied into new decks.
- `assets/motion.min.js`: local Motion One fallback inherited from Guizang.
- `references/template-catalog.md`: public `pinboard` template description.
- `references/template-intake.md`: sanitized notes for the confirmed `pinboard` visual system.
- `references/layouts.md`: default 20-slide rhythm and template page roles.
- `references/themes.md`: colors, type, and image-slot rules.
- `references/checklist.md`: delivery checks.
- `scripts/create-deck.mjs`: create blank decks or demo structure decks.
- `scripts/validate-deck.mjs`: static checks before browser inspection.
- `scripts/export-pptx.mjs`: render HTML slides into a visual `.pptx`.

## Attribution And License Note

The runtime seed is derived from Guizang PPT Skill, which is licensed under AGPL-3.0. Local personal use is fine for this workflow. If this derivative skill is published, shared, or served as a product, preserve appropriate notices and handle AGPL source obligations.
