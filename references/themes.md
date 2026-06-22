# CyberBin Theme Rules

CyberBin v1 uses one template, `pinboard`, with a small set of approved theme presets. Themes only change CSS variables. They must not change layout structure, paperclip position, animation, Chinese/English typography rules, or slide roles.

## Usage

Use `--theme <theme-id>` with `scripts/create-deck.mjs`.

```bash
node scripts/create-deck.mjs pinboard ./demo/ppt --title "Demo" --demo --slides 5 --theme ikb-blue
```

If the user does not specify a theme, use `pinboard-yellow`.

## Theme Presets

| Theme ID | Base | Accent | Best For |
|---|---|---|---|
| `pinboard-yellow` | yellow paper | deep blue ink | default; AI tools, SaaS, startup playbooks, product strategy |
| `ikb-blue` | white | Klein blue `#002FA7` | AI products, business launches, methodology |
| `lemon-yellow` | white | lemon yellow `#FFD500` | youth, sport, retail, consumer goods, Y2K; body text uses 80% black |
| `lemon-green` | white | lemon green `#C5E803` | ecology, health, Gen Z brands |
| `safety-orange` | white | safety orange `#FF6B35` | caution, news, industrial, sport, active topics |

## Hard Rules

- Do not accept arbitrary user hex values in v1.
- Do not expose a theme ID until `create-deck.mjs`, `validate-deck.mjs`, README, and this file all include it.
- White-base themes must stay white-base; do not inherit the default yellow page background.
- `lemon-yellow` must use 80% black for main body text because yellow text is not readable enough.
- The default `pinboard-yellow` theme must remain visually compatible with the confirmed Chinese and English decks.

## Typography

- Default to Chinese main content when the user brief is Chinese.
- Pinboard uses heavy sans display titles, handwritten emphasis words, sans body, and mono metadata.
- Chinese title sizing applies only to Chinese decks; do not change English title sizing.
- English decks use the confirmed CyberBin pinboard English proportions: large English display title, handwritten emphasis only where it improves rhythm, right-aligned top-right metadata, English hint text, and no Chinese residual UI copy.
- For Pinboard Chinese level-1 titles longer than 5 Chinese characters, add a Chinese sizing class such as `zh-h1-long`, `zh-section-long`, or `zh-cover-title`.
- Chinese hero titles should be short. If a title exceeds 12 Chinese characters, split it over clean semantic lines or rewrite it.
- Never leave English demo filler in a real Chinese deck.

## Paperclip Marks

- Use bundled SVG files in `assets/paperclips/`; do not redraw paperclips with ad hoc inline paths.
- Copy paperclip SVGs into the generated deck's `images/` folder and reference them as local `images/...` assets.
- Keep cover, agenda, card, dark-section, and closing paperclip positions consistent with the confirmed pinboard decks.
- Paperclip marks are decorative and must never cover titles, card labels, body copy, footer labels, or page numbers.

## Runtime Controls

- Keep `Edit`, `Save HTML`, and `PPTX` hover-only on the right side.
- The toolbar must not occupy the top-right metadata area.
- Keep Guizang-style in-slide entrance motion and `B` static mode.

## Image Ratios

- Full-width hero image: 21:9.
- Main visual next to text: 16:10 or 4:3.
- Evidence grid: all images in the same grid should share one ratio, preferably 21:9 or 16:10.
- Square note/card image: 1:1.
- Keep images in `images/` and use relative paths like `images/03-dashboard.png`.

## Copyright-Safe Reference Use

Paid template sites may be used as mood references only. Do not copy template HTML/CSS/JS, paid images, exact slide layouts, template names, screenshots as embedded assets, or remote asset URLs.
