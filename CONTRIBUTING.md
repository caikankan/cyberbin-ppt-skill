# Contributing

CyberBin is maintained as a visual-first HTML PPT skill. Contributions are welcome, but the main repository is controlled by the maintainer; fork the repository if you want to customize your own version.

## Priorities

- Preserve the confirmed `pinboard` visual system.
- Add rules to `references/` before adding new visual freedom.
- Keep PPTX export image-only unless the maintainer explicitly changes that policy.
- Avoid copying paid template code, assets, screenshots, or remote URLs.

## Adding Themes

1. Add the theme ID and variables to `scripts/create-deck.mjs`.
2. Add the theme ID to `scripts/validate-deck.mjs`.
3. Document the theme in `references/themes.md` and `README.md`.
4. Generate and validate a 5-slide demo.

## Adding Templates

Do not expose a new template ID until all of these are done:

1. Add a complete HTML seed template under `assets/templates/`.
2. Add layout rules and component rules under `references/`.
3. Add validation coverage where possible.
4. Generate a 5-slide visual demo and a 20-slide structure demo.
5. Get maintainer confirmation.

## Pull Requests

Useful pull requests include:

- layout collision fixes
- checklist improvements
- validation rules
- theme variable cleanup
- documentation that prevents recurring generation mistakes
