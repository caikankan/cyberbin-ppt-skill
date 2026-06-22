---
name: cyberbin
description: Generate local single-file HTML PPT decks with CyberBin's pinboard template, especially Chinese-first decks for PPT, slides, HTML presentations, AI tools, SaaS products, growth reviews, course decks, startup pitches, and template-based storytelling. Use this skill whenever the user asks for a CyberBin PPT, pinboard slides, HTML deck, presentation, or wants to turn a topic, PDF, PPT/PPTX, TXT, Markdown, screenshot/image, or structured outline into a polished horizontal slide deck. CyberBin v1 only includes the pinboard template; default deck length is 20 slides unless the user explicitly requests another count. Always compress source material into visual-first presentation language instead of dumping long text into slides.
---

# CyberBin

CyberBin creates local single-file HTML slide decks using its `pinboard` template. It keeps the Guizang-style deck runtime: one `index.html`, horizontal navigation, keyboard/wheel/touch controls, ESC overview, low-power `B` mode, simple entrance animation, browser text editing, edited HTML saving, image-only PPTX export, and optional image slots.

Do not edit the original Guizang PPT Skill. Use this skill's own files and bundled resources.

The confirmed public visual target is the CyberBin `pinboard` system: bright yellow field, deep blue ink, cream paper cards, bundled paperclip SVG marks, hover-only edit toolbar, right-aligned top-right metadata, and Guizang-style slide entrance motion.

## Public Flow

CyberBin is not an unlimited style generator. v1 currently provides exactly one public template:

- `pinboard` — bright Pinboard Deck style for AI tools, SaaS products, growth reviews, courses, and startup pitches.

If the user does not specify a template, briefly show the CyberBin template menu before generating:

| Template | Status | Use |
|---|---|---|
| `pinboard` | Available in v1 | AI tools, SaaS products, growth reviews, course decks, startup pitches |
| Template 2-5 | Coming later | Not usable in v1 |

Then ask them to confirm `pinboard` or proceed with `pinboard` if the request clearly fits. Do not imply Template 2-5 are available. If the user asks which templates are available, say CyberBin v1 currently includes only `pinboard`. If they request another style, explain that the new template must be encapsulated, tested, and added to the catalog before it can be used.

Default to **20 slides** unless the user explicitly requests another slide count. If the user asks for “a deck” or “a PPT” without a count, plan 20 slides.

## Theme Selection

Themes are color presets for the same `pinboard` template. They do not change page structure, paperclip positions, animation, or Chinese/English typography rules.

| Theme | Use |
|---|---|
| `pinboard-yellow` | Default yellow paper and blue ink. Use unless the user asks for another color mood. |
| `ikb-blue` | White base with Klein blue accent. Use for AI products, launches, and methodology decks. |
| `lemon-yellow` | White base with lemon yellow accent and 80% black body text. Use for youth, sport, retail, consumer goods, and Y2K topics. |
| `lemon-green` | White base with lemon green accent. Use for ecology, health, and Gen Z brands. |
| `safety-orange` | White base with safety orange accent. Use for caution, news, industrial, sport, and high-energy topics. |

If the user does not specify a theme, use `pinboard-yellow`. If the user asks for a white-base version, recommend one of the white themes above.

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
4. Choose theme from the Theme Selection table; default is `pinboard-yellow`.
5. Decide language from the user's brief using the Language Rules above.
6. Compress the source into slide-ready claims and page roles before writing HTML. Do not paste long source passages into slides.
7. Create a deck folder in the user's current workspace, normally `<project-name>/ppt`.
8. Run `scripts/create-deck.mjs <template-id> <output-dir> --title "<deck title>" --slides <count> --theme <theme-id>`. For demos, add `--language zh` or `--language en` when the language should be forced.
9. Replace `<!-- SLIDES_HERE -->` with slide sections based on `references/layouts.md` and `references/components.md`, unless using `--demo`.
10. Put images in the deck's `images/` folder and reference them as `images/name.ext`.
11. Preserve the hover-only toolbar. It should appear when the user hovers near the right-side tool area and must not occupy the top-right metadata position.
12. Run `scripts/validate-deck.mjs <output-dir>/index.html --expected-slides <count> --template <template-id> --theme <theme-id>`.
13. Open `index.html` in Chrome and visually inspect every slide, including ESC overview thumbnails, for dense unreadable text, paperclip collisions, and toolbar/header conflicts.
14. If the user asks for PowerPoint, run `npm install` once in the skill folder if needed, then `node scripts/export-pptx.mjs <output-dir>/index.html <output-name>.pptx`. Explain that the PPTX is image-only for visual fidelity; to change text, edit and save the HTML first, then export again.

## Smoke Tests

Use a 5-slide visual demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard/ppt --title "Pinboard Demo" --demo --slides 5
node scripts/validate-deck.mjs ./demo-pinboard/ppt/index.html --expected-slides 5 --template pinboard --theme pinboard-yellow
```

Use a 20-slide structure demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard-20/ppt --title "Pinboard 20 Page Test" --demo --slides 20
node scripts/validate-deck.mjs ./demo-pinboard-20/ppt/index.html --expected-slides 20 --template pinboard --theme pinboard-yellow
```

Use the confirmed English demo:

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard-en/ppt --title "AI Delivery Tool Stack" --demo --slides 20 --language en
node scripts/validate-deck.mjs ./demo-pinboard-en/ppt/index.html --expected-slides 20 --template pinboard --theme pinboard-yellow
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
- `references/components.md`: pinboard component usage rules.
- `references/layouts.md`: default 20-slide rhythm and template page roles.
- `references/themes.md`: theme IDs, color presets, type, and image-slot rules.
- `references/image-prompts.md`: optional image generation rules.
- `references/screenshot-framing.md`: screenshot handling rules.
- `references/checklist.md`: delivery checks.
- `scripts/create-deck.mjs`: create blank decks or demo structure decks.
- `scripts/validate-deck.mjs`: static checks before browser inspection.
- `scripts/export-pptx.mjs`: render HTML slides into an image-only `.pptx`.

## Attribution And License Note

The runtime seed is derived from Guizang PPT Skill, which is licensed under AGPL-3.0. Local personal use is fine for this workflow. If this derivative skill is published, shared, or served as a product, preserve appropriate notices and handle AGPL source obligations.
