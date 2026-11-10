# Alder design system

Alder should feel like a dependable operations company: quiet surfaces, readable information, and a small amount of purposeful colour. This palette refinement preserves the existing routes, content, layout, forms, and demo behaviour.

## Palette

| Role | Colour | Use |
| --- | --- | --- |
| Charcoal | `#151917` | Marketing canvas and dark console background |
| Raised charcoal | `#1C211E` | Product frames and dark cards |
| Paper | `#F4F3EE` | Light console canvas, methodology section, primary marketing buttons |
| Forest | `#44705B` | Filled brand actions with white text |
| Leaf | `#A8C9A3` | Active accents and primary controls on dark surfaces |
| Mineral | `#6D858C` | Secondary diagram information, used sparingly |

Semantic text, status and focus colours adapt between themes in `src/styles/globals.css`. Brand tokens live in `src/styles/tokens.ts`; Tailwind consumes both. Forest actions with white text measure 5.65:1; dark primary controls measure 9.76:1. The tested text/status pairs exceed 4.5:1, and chart strokes exceed 3:1 on both card backgrounds. These are token checks, not a blanket accessibility certification.

## Surfaces and typography

Use flat surfaces instead of coloured glows, rainbow avatars, gradient text, or decorative glass. The Alder mark is monochrome. Retain Inter Tight for the existing type system and reserve the monospaced face primarily for actual events, values, and technical data. Keep long reading text in a full, readable foreground colour.

## Motion

The hero enters once in about half a second. Its live pipeline explains a workflow and offers pause/resume. Timers stop off screen or in hidden tabs. Reduced motion preserves a static diagram and meaningful status. Buttons keep their hit target fixed and translate only their arrow. Ordinary section wrappers keep reading content visible.

## References

Guidance was reviewed from [Taste Skill](https://github.com/Leonxlnx/taste-skill), [Impeccable](https://github.com/pbakaus/impeccable), [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md), and the [motion director/auditor](https://github.com/frankxai/awesome-motion-design-agent-skills). These informed restraint and hierarchy; Alder does not copy a reference brand's visual system.

## Verification limits

Desktop, tablet, mobile and reduced-motion captures are recorded separately from the application source. Contrast checks cover the named semantic pairs. Existing demo content remains illustrative. Full keyboard, touch-device and frame-rate testing require additional runtime verification.
