# CyberBin Layouts

Use one template system per deck. CyberBin v1 exposes only `pinboard`. Default slide count is 20 unless the user explicitly requests another count.

## Pre-Flight

Before writing slide HTML, do the same kind of framework check used by Guizang:

- Read `assets/templates/pinboard.html` and confirm the class names you plan to use exist in the template CSS.
- Read `references/components.md` for the approved component grammar.
- Read `references/themes.md` if the user asks for a color mood.
- Do not invent new public layouts while generating a normal deck. Use the existing pinboard page roles below.
- If the source material is too long, compress or split the message before it enters a slide. Do not shrink text until the page becomes unreadable.
- Theme presets only change CSS variables. They must not change layout, paperclip positions, animation, title rules, or toolbar behavior.

## Theme Rhythm

Plan the slide rhythm before filling content:

- `pin-cover` starts the deck.
- `pin-agenda` appears early when the deck has more than 6 slides.
- Use deep-blue section pages every 4-6 slides for breathing room.
- Use card/table/number pages for proof and structure.
- End with a closing page or summary card page.

Do not create long runs of nearly identical card pages. If the content naturally becomes repetitive, combine points or switch to a table, workflow, or section page.

## Default 20-Slide Rhythm

Use this structure when the user gives a topic but no custom outline:

1. Cover
2. Table of contents / agenda
3. Why this matters now
4. Current situation
5. Core problem
6. Key insight
7. Chapter 1 opener
8. Chapter 1 explanation
9. Chapter 1 example or evidence
10. Chapter 2 opener
11. Chapter 2 explanation
12. Chapter 2 example or evidence
13. Chapter 3 opener
14. Chapter 3 explanation
15. Chapter 3 example or evidence
16. Method / workflow
17. Before vs after
18. Risks / caveats / decisions
19. Summary takeaways
20. Closing / next action

For shorter decks, preserve the same arc: cover, context, problem, insight, method, proof, closing.

## Universal Page Roles

Every template should eventually support these roles:

- cover
- agenda
- section opener
- statement
- data or proof
- comparison
- process / workflow
- example / case
- summary
- closing

## Pin & Paper Target

The `pinboard` public template is CyberBin v1's only public template. It is a distinct Pin & Paper system rather than a recolored magazine layout. It supports:

- `pin-cover`: yellow field-guide cover, oversized left title, small mono metadata, bundled SVG pin/arrow marks.
- `pin-agenda`: agenda page with large “What’s inside” heading, horizontal rows, dotted dividers, row metadata, and pin marks.
- `pin-rules`: three paper cards with blue outline, offset shadow, card-specific bottom notes, and pin marks.
- `pin-section`: deep blue chapter opener with oversized yellow title, handwritten emphasis, and minimal supporting text.
- `pin-detail`: three paper cards for findings, why it matters, and actions.
- `pin-chart`: blue section with yellow chart panel and thick hand-drawn line chart.
- `pin-workflow`: five paper cards with handwritten numbers and arrows between steps.
- `pin-table`: large comparison table with blue header and pill tags.
- `pin-numbers`: three large metric cards with handwritten unit marks.
- `pin-quote`: oversized cream quote card with a highlight strip.
- `pin-closing`: final ask / next action page.

Use bundled local SVG files for paperclip marks; do not redraw them inline. Do not include the right-side screenshot dot navigation from the reference images; those dots came from the source website viewer, not the template itself.

## Capacity Rules

Pinboard pages are deliberately sparse. Use these rough limits:

- Cover: title up to 2 short lines, subtitle up to 2 lines, one side note.
- Agenda: 4-6 rows, each row under 10 Chinese characters or 5 English words when possible.
- Three-card pages: 3 cards, each card one title plus 1-2 short sentences.
- Table pages: 3-5 rows and 3-4 columns. For larger tables, summarize categories instead of reproducing source rows.
- Quote pages: one sentence or two short clauses. If a quote is long, rewrite it as a claim.
- Blue section pages: one large statement and one short supporting sentence.

If a source page exceeds these limits, reduce it. Visual integrity wins over literal completeness.
