---
name: cyberbin
description: Generate local single-file HTML PPT decks with CyberBin's pinboard template, especially Chinese-first decks for PPT, slides, HTML presentations, AI tools, SaaS products, growth reviews, course decks, startup pitches, and template-based storytelling. Use this skill whenever the user asks for a CyberBin PPT, pinboard slides, HTML deck, presentation, or wants to turn Chinese or English notes/articles/topics into a polished horizontal slide deck. CyberBin v1 only includes the pinboard template; default deck length is 20 slides unless the user explicitly requests another count.
---

# CyberBin

CyberBin creates local single-file HTML slide decks using its `pinboard` template. It keeps the Guizang-style deck runtime: one `index.html`, horizontal navigation, keyboard/wheel/touch controls, ESC overview, low-power `B` mode, and optional image slots.

Do not edit the original Guizang PPT Skill. Use this skill's own files and bundled resources.

## Public Flow

CyberBin is not an unlimited style generator. v1 currently provides exactly one public template:

- `pinboard` — bright Pinboard Deck style for AI tools, SaaS products, growth reviews, courses, and startup pitches.

If the user asks which templates are available, say CyberBin v1 currently includes only `pinboard`. If they request another style, explain that a new template must be encapsulated before it can be used.

Default to **20 slides** unless the user explicitly requests another slide count. If the user asks for “a deck” or “a PPT” without a count, plan 20 slides.

## Language Rules

CyberBin should be Chinese-first because most expected use cases are Chinese PPTs.

- If the user writes the brief, topic, or source material in Chinese, write the deck's main title, agenda, section titles, body copy, speaker-facing claims, and action items in Chinese.
- Preserve a small amount of English metadata only when it is part of the template's visual language, such as `FIELD GUIDE`, `PHASE`, `EVIDENCE`, `DECK`, or short mono labels. Keep these labels decorative and never let them carry the main meaning.
- If the user says “全中文”, “中文化”, or “不要英文”, translate decorative metadata into short Chinese labels too.
- If the user provides English source material but asks for a Chinese PPT, localize the deck into natural Chinese instead of directly translating sentence by sentence.
- If the user provides Chinese source material but asks for an English deck, use English for all main content and keep template metadata consistent with the selected template.
- For Chinese titles, prefer short spoken phrases. Split long titles over lines instead of shrinking text aggressively.
- Do not leave demo English filler such as “The trust gap” or “What we found” in a real Chinese deck unless the user explicitly wants bilingual copy.

## Generation Workflow

1. Use `pinboard` from `references/template-catalog.md`.
2. Confirm slide count; default is `20`.
3. Decide language from the user's brief using the Language Rules above.
4. Create a deck folder in the user's current workspace, normally `<project-name>/ppt`.
5. Run `scripts/create-deck.mjs <template-id> <output-dir> --title "<deck title>" --slides <count>`.
6. Replace `<!-- SLIDES_HERE -->` with slide sections based on `references/layouts.md`, unless using `--demo`.
7. Put images in the deck's `images/` folder and reference them as `images/name.ext`.
8. Run `scripts/validate-deck.mjs <output-dir>/index.html --expected-slides <count> --template <template-id>`.
9. Open `index.html` in Chrome and visually inspect every slide.

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

## Attribution And License Note

The runtime seed is derived from Guizang PPT Skill, which is licensed under AGPL-3.0. Local personal use is fine for this workflow. If this derivative skill is published, shared, or served as a product, preserve appropriate notices and handle AGPL source obligations.
