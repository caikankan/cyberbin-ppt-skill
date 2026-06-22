# CyberBin Image Rules

CyberBin can use images as evidence, references, or visual assets, but the core v1 workflow does not require image generation.

## Rules

- Images are embedded deck assets, not complete slide pages.
- Do not generate page numbers, headers, footers, logos, or slide chrome inside images.
- Image language must match the deck language.
- Save image assets into `images/` and reference them with relative paths.
- Choose the image ratio before generating or adapting the image.

## Recommended Ratios

| Use | Ratio |
|---|---|
| full-width evidence image | 21:9 |
| main visual beside text | 16:10 or 4:3 |
| screenshot reconstruction | 16:10 |
| card image | 1:1 |
| multi-image row | consistent height |

## Prompt Shape

Keep prompts short:

```text
Create a clean 16:10 presentation image for a CyberBin pinboard deck. Subject: [topic]. Style: minimal product evidence image, no title, no page number, no footer, no border.
```

For information graphics, use sparse labels and large shapes. If the source screenshot must stay faithful, use screenshot framing instead of regenerating.
