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
- Chinese titles are split into readable lines instead of being compressed too small.
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
