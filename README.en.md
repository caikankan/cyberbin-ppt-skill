# CyberBin PPT Skill

CyberBin is a local HTML PPT skill for Codex, Claude Code, and other file-system agents. It generates single-file horizontal HTML slide decks and can export image-only PowerPoint files for visual fidelity.

v1 includes one public template: `pinboard`.

![CyberBin Pinboard preview](./assets/preview/cyberbin-pinboard-preview.png)

## Quick Start

### Codex

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/caikankan/cyberbin-ppt-skill.git ~/.codex/skills/cyberbin
```

Prompt:

```text
Use CyberBin pinboard to create a 20-slide HTML deck about AI delivery tools.
```

### Claude Code

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/caikankan/cyberbin-ppt-skill.git ~/.claude/skills/cyberbin
```

Prompt:

```text
/cyberbin make a 20-slide pinboard HTML deck about AI tools
```

## Template

CyberBin v1 exposes only one usable template.

| Template | Status | Best For | Visual System |
|---|---|---|---|
| `pinboard` | Available in v1 | AI tools, SaaS products, growth reviews, course decks, startup pitches | bright paper, deep ink, paper cards, mono labels, bundled paperclip marks |
| Template 2-5 | Coming later | Not included in v1 | Will be added after visual encapsulation and tests |

## Pinboard Themes

Themes are color variables for the same `pinboard` template. They do not change layout, paperclip placement, animation, or Chinese/English typography rules.

| Theme ID | Base | Accent | Best For |
|---|---|---|---|
| `pinboard-yellow` | yellow paper | deep blue ink | default product strategy and AI tool decks |
| `ikb-blue` | white | IKB `#002FA7` | AI products, business launches, methods |
| `lemon-yellow` | white | lemon yellow `#FFD500` | youth, sport, retail, consumer goods, Y2K; body text uses 80% black |
| `lemon-green` | white | lemon green `#C5E803` | ecology, health, Gen Z brands |
| `safety-orange` | white | safety orange `#FF6B35` | caution, news, industrial, sport, active topics |

Example:

```bash
node scripts/create-deck.mjs pinboard ./demo/ppt --title "AI Delivery Tool Stack" --demo --slides 20 --language en --theme ikb-blue
```

## Workflow

CyberBin follows a structured Guizang-style skill workflow:

1. Choose template: v1 uses `pinboard`
2. Choose theme: default `pinboard-yellow`
3. Identify input type: topic, PDF, PPTX, TXT/Markdown, screenshot, or outline
4. Compress content into slide-level claims
5. Copy the HTML seed template
6. Fill pages from `references/layouts.md`
7. Check with `references/checklist.md`
8. Run `scripts/validate-deck.mjs`
9. Preview in a browser
10. Export image-only PPTX if needed

CyberBin is not a long-form document typesetter. Long source material must be compressed, split, merged, or omitted before it enters the visible slides.

## Export PPTX

PPTX export is image-only. Each PowerPoint slide is a full-slide screenshot of the HTML slide, so the visual result matches the browser deck.

If you need text changes, edit and save the HTML first, then export PPTX.

```bash
npm install
node scripts/export-pptx.mjs ./demo/ppt/index.html ./demo.pptx
```

## Manual Test

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard/ppt --title "Pinboard Demo" --demo --slides 5
node scripts/validate-deck.mjs ./demo-pinboard/ppt/index.html --expected-slides 5 --template pinboard --theme pinboard-yellow
```

## Attribution And License

CyberBin's HTML PPT runtime and skill organization are derived from [Guizang PPT Skill](https://github.com/op7418/guizang-ppt-skill).

CyberBin is released under AGPL-3.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
