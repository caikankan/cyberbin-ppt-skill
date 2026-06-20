# CyberBin Layouts

Use one template system per deck. Default slide count is 20 unless the user explicitly requests another count.

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

- `pin-cover`: yellow field-guide cover, oversized left title, small mono metadata, inline SVG pin/arrow marks.
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

Use inline SVG/CSS for hand-drawn elements. Do not depend on external image assets. Do not include the right-side screenshot dot navigation from the reference images; those dots came from the source website viewer, not the template itself.
