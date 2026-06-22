# CyberBin Template Catalog

CyberBin v1 has exactly one public template. Do not imply that other styles are available until they are implemented and tested.

## Public Template Menu

Show this menu when the user asks what CyberBin can generate or when they request a CyberBin deck without naming a template.

| Template | Status | Best For | Visual Keywords |
|---|---|---|---|
| `pinboard` | Available in v1 | AI tools, SaaS products, growth reviews, course covers, startup pitches | yellow paper, blue ink, mono labels, bundled paperclip marks, cream cards |
| Template 2 | Coming later | Not included in v1 | Do not expose as a usable template ID |
| Template 3 | Coming later | Not included in v1 | Do not expose as a usable template ID |
| Template 4 | Coming later | Not included in v1 | Do not expose as a usable template ID |
| Template 5 | Coming later | Not included in v1 | Do not expose as a usable template ID |

## Available Template

| ID | Name | Best For | Visual Keywords |
|---|---|---|---|
| `pinboard` | Pinboard Deck | AI tools, SaaS products, growth reviews, course covers, startup pitches | yellow paper, blue ink, mono labels, hand-drawn pins/arrows, paper cards |

## Available Theme Presets

Themes are color presets inside `pinboard`. They are not separate templates and must not alter layout, paperclip positions, animation, title fitting, or language rules.

| Theme ID | Name | Base | Best For |
|---|---|---|---|
| `pinboard-yellow` | Yellow paper / blue ink | yellow field | Default CyberBin look, AI tools, SaaS, growth, courses |
| `ikb-blue` | Klein Blue | white base | AI products, business launches, methodology |
| `lemon-yellow` | Lemon Yellow | white base | youth, sport, retail, consumer goods, Y2K retro |
| `lemon-green` | Lemon Green | white base | ecology, sustainability, health, Gen Z brands |
| `safety-orange` | Safety Orange | white base | caution, news, industrial, sport, energetic topics |

## Selection Rules

- Use `pinboard` for all CyberBin v1 decks.
- If the user asks what templates are available, say v1 currently includes only `pinboard`.
- If the user requests another style, explain that the new template must be encapsulated first.
- If the user asks for a different color, offer the five theme presets above.
- Do not accept arbitrary custom hex colors in normal generation; preserving the tested system is more important than unlimited freedom.
- Default slide count is 20 unless the user states another number.

## Pinboard Usage

Use `pinboard` for youthful product strategy reports, startup team playbooks, AI tool launches, SaaS product decks, growth retrospectives, course covers, and product-driven startup pitches.

Avoid using it directly for government reports, state-owned enterprise brochures, formal corporate profiles, banking, legal, medical, insurance, luxury, real estate, or heavy industry decks unless the user explicitly wants a young innovation sub-brand look. For formal contexts, borrow only the rhythm, not the bright yellow/blue palette or hand-drawn marks.

## Future Template Intake

When adding a new template after v1, ask the user to provide references in this exact structure:

```text
模板 N
名字：
适合做什么：
不合适做什么：
参考图：
必须保留：
不想要：
备注：
```

Add future templates one by one. Do not expose a new template ID in scripts, validation, or this catalog until its 5-slide demo and 20-slide structure test pass.
