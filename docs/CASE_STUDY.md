# UI/UX Case Study — Alder

*Designing an enterprise AI brand that shows rather than tells.*

## The brief

Design and build a website and SaaS console for Alder, a fictional enterprise AI consultancy and platform. The bar was a funded enterprise product: no template look, no generic AI art, no fake buttons.

## The problem with AI websites

Most AI company sites rely on the same visual shorthand: glowing brains, purple gradients everywhere, floating 3D blobs, and copy that promises transformation. To an enterprise buyer (a VP of Operations, a risk lead) all of it reads as *unproven*. These buyers worry about three things:

1. **Will it reach production?** Most pilots don't.
2. **Can we control it?** Approvals, audit, data boundaries.
3. **Will it work with our systems?** Not a separate tab.

**Design principle:** every section should answer one of those questions with evidence the visitor can *see working*, not with adjectives.

## Concept: "Signal"

The visual identity is built around one idea: **AI as a visible, traceable signal moving through a system.**

| Element | How "signal" shows up |
|---|---|
| Logo | An "N" drawn as one continuous path, ending in a live cyan node |
| Signature interaction | Every primary button carries a glowing dot that blooms into an arrow on hover |
| Hero | Packets of light travel through a real-looking agent pipeline |
| Architecture | Data visibly rises through layers along an animated bus |
| Voice | Monospace "readouts" (`01 — THE GAP`, `runs today 12,480`) give an instrument-panel tone |

Accent colour is used *sparingly*: electric blue for action, violet for depth, cyan only for "live" signals. The restraint is what makes the moments of colour feel meaningful.

## Typography and layout

- **Inter Tight** for display and UI. Its tight apertures look engineered at large sizes and stay legible at 13px.
- **JetBrains Mono** for labels, metrics and system text. This keeps the console voice consistent from the marketing site into the product.
- A **fluid display scale** (`clamp()`) with negative tracking (−0.045em at the largest size) gives headlines editorial weight without breakpoint jumps.
- A **72px measured grid** appears as faint guides behind key sections. It signals precision, and it's masked so it never competes with content.

## Section-by-section decisions

**Hero — show the product immediately.** Instead of an illustration, the hero holds a live operations console. A ticket is classified, passes a policy gate and is resolved by an agent, while an event stream ticks alongside. The frame starts tilted in perspective and flattens as you scroll, a moment of craft that also invites the scroll. The headline resolves letter by letter (blur → electric → white), echoing the signal concept.

**The gap — interactive, not a list.** Four common failures sit on the left. Hover or arrow-key through them, and the right panel reframes each one as an opportunity with a single proof stat. This turns a pain-point list into a conversation.

**Solutions — a bento, not a card grid.** The brief warned against repetitive layouts. AI Agents gets the large tile, with a step-by-step execution trace inside it, because it's the flagship. The other five are compact. A cursor-following spotlight adds depth without glow.

**How it works — a deliberate light section.** Five dark sections in a row become monotonous. The methodology sits on a light "paper" surface that reads like a document. A progress rail fills as you scroll.

**Business impact — a calculator, not claims.** Four sliders drive a visible model. The assumptions are written out underneath, and the disclaimer is explicit. Enterprise buyers trust maths they can audit.

**Case studies and testimonials — honest by design.** Every fictional element carries a visible label: *Illustrative*, *Fictional demo brands*, *Illustrative demo profile*. Ethically this is non-negotiable. It's also good UX: transparency is part of the brand.

## The console

The console had to feel like a product a team would use daily. That meant calm surfaces, dense but readable information, and real interactions.

- **Information hierarchy.** The dashboard leads with four KPIs (each with a trend sparkline and a delta), then usage and system health, then top agents and recent activity. The questions follow the order an ops lead asks them: *Are we OK? What's happening? Who's doing it?*
- **Workflow builder.** The palette is grouped and colour-coded by node kind. Conditions get explicit green "yes" and red "no" handles. The properties panel opens when you select a node, so the canvas gets maximum space, and the main sidebar auto-collapses in the builder. Execution is legible: the running node glows, completed nodes tick, the untaken branch fades, and a live log explains each step. Two simulation controls let anyone explore the edge cases in seconds: *test confidence* (to see branching) and *inject failure*.
- **Agent management.** Status tabs show counts. Search, filter, sort and view mode all live in the URL. Destructive actions confirm and offer undo.
- **Empty, loading and error states** are designed, not defaulted. Skeletons match the final layout, and empty states always offer the next action.

## Accessibility as a design constraint

Accessibility shaped the design rather than being audited in afterwards:

- **Colour.** The chart palette was chosen by running a colour-vision-deficiency validator. The first instinct, electric blue next to violet, failed: the two are nearly indistinguishable for deutan viewers. The final order alternates blue, amber, violet and teal, and it passes in both themes.
- **Motion.** All motion respects `prefers-reduced-motion`.
- **Keyboard.** Every interactive diagram works from the keyboard, and the command palette makes the console fully navigable without a mouse.

## Responsive strategy

Mobile is redesigned, not shrunk:

- **Navigation.** The mega-menus become a full-screen accordion.
- **Architecture.** The architecture diagram becomes a readable ordered stack.
- **Console.** The sidebar becomes a drawer. Tables scroll inside their cards instead of overflowing the page.
- **Builder.** The builder's panels become overlay sheets.

Every route was swept automatically at 375, 768 and 1280px for overflow.

## Outcome

The result is a cohesive brand-to-product experience:

- 7 marketing pages and 9 console views
- A working node-based workflow engine
- One design system spanning both light and dark themes

The visual language stays restrained and the evidence is interactive, so the project reads as a product rather than a template.
