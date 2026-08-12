---
name: frontend-reconstruction
description: Rebuild a web interface when the user supplies a screenshot, mockup, design file, or existing page reference. Preserve hierarchy, responsiveness, accessibility, and interaction intent. Do not use for net-new interface design without a visual reference.
---

# Frontend Reconstruction

Translate a visual reference into maintainable interface code. Reconstruct the design system behind the pixels instead of tracing coordinates blindly.

## Use this skill when

- The user provides screenshots, mockups, or an existing page to reproduce.
- An interface needs a high-fidelity visual refresh.
- Responsive behavior must be inferred from limited references.

## Ground rules

1. Inspect every provided reference before editing.
2. Preserve the project's framework, component patterns, styling conventions, and existing user changes.
3. Reuse local assets and established icons before sourcing or generating replacements.
4. Do not use placeholder images, fake controls, or non-working interactions in a requested implementation.
5. Avoid copying protected branding or content beyond the user's authorized reference.

## Workflow

### 1. Inventory the reference

Record:

- viewport size and likely breakpoints;
- major regions and visual hierarchy;
- alignment anchors and repeated spacing;
- typography roles, weights, case, and line length;
- color roles, borders, shadows, texture, and depth;
- interactive, loading, empty, error, and focus states;
- image crops, icon style, and asset ratios.

Distinguish visible facts from responsive assumptions.

### 2. Inspect the implementation context

Find route ownership, reusable layout and UI components, design tokens, asset folders, font setup, and the existing data/API shape. Read framework-specific instructions before choosing patterns.

### 3. Define the smallest component map

Give each component one visual or interaction responsibility. Reuse repeated cards, rows, controls, and panels. Do not extract one-use fragments that become harder to read after extraction.

### 4. Establish tokens and structure

Implement typography, color roles, spacing rhythm, and container behavior before polish. Prefer semantic HTML and normal document flow. Use absolute positioning only for intentional overlays.

### 5. Implement responsive intent

Test at the supplied viewport and at least one narrow and one wide viewport. Let content reflow; do not merely scale the desktop composition. Protect readable line lengths, touch targets, and navigation access.

### 6. Implement real states

Controls must work. Provide focus visibility, keyboard operation, descriptive labels, reduced-motion behavior, and appropriate empty/error states. Never render untrusted HTML.

### 7. Visual QA loop

Render the page and compare:

1. macro layout and section proportions;
2. typography and wrapping;
3. spacing and alignment;
4. color, border, shadow, and imagery;
5. hover, focus, open, empty, and responsive states.

Fix the largest perceptual mismatch first. Repeat until remaining differences are intentional and documented.

## Stop conditions

Pause when required reference assets are missing, the target route cannot run, two references contradict each other, or a product choice is required for an unseen state.

## Output contract

Deliver:

- implemented files and the route to view;
- a brief component and state summary;
- viewports and interactions verified;
- remaining assumptions or asset substitutions;
- no claim of pixel-perfect parity unless overlay or equivalent comparison was performed.
