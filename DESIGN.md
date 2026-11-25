---
version: alpha
name: MIS Alumni Portal Design System
description: >-
  The design language for the MIS Alumni Portal — an institutional alumni tracking system and
  community portal for the Department of Management Information Systems at Istanbul University.
  A quiet, document-like system built on Department Navy ink, a single Reunion Gold accent, and
  near-white paper surfaces. It reads as a department record rather than a marketing site: dense
  tables, plain forms, one primary action per screen, hairline borders instead of shadows, and no
  decorative imagery beyond real graduate portraits and event photographs. Typography is a system
  sans-serif stack at 400/600 weights with tabular figures for money and counts. The system is
  implemented in public/css/app.css, the single stylesheet that carries these values in code.

colors:
  primary: "#12355B"
  primary-hover: "#0C2440"
  primary-soft: "#E8EDF4"
  accent: "#C9A227"
  accent-soft: "#F6EFD6"
  on-primary: "#FFFFFF"
  canvas: "#F7F8FA"
  surface: "#FFFFFF"
  surface-sunken: "#EEF1F5"
  ink: "#1B1F24"
  ink-secondary: "#3A424D"
  ink-mute: "#5A6472"
  hairline: "#D8DDE5"
  hairline-strong: "#B9C1CD"
  success: "#1E7A46"
  success-soft: "#E4F2EA"
  warning: "#9A5B00"
  warning-soft: "#FBF0DC"
  danger: "#B3261E"
  danger-soft: "#FBE7E5"

typography:
  display-lg:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.4px
  display-md:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.2px
  heading-lg:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  heading-md:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  body-lg:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-md:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  body-numeric:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: tnum
  body-editorial:
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  label:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.3px
  button:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 10px 16px
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
  text-input-focused:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 10px 12px
  form-label:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 0
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 20px
  card-posting:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 20px
  table-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px 16px
  table-header:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 10px 16px
  nav-bar:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xs}"
    padding: 12px 24px
  pill-status-open:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  pill-status-closed:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 2px 10px
  alert-error:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  alert-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  empty-state:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 32px
  utility-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 8px 24px
  eyebrow:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: 0
  danger-zone:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 16px 24px
---

# MIS Alumni Portal — Design System

## Overview

The portal is a record before it is a product. Every screen answers a question a department administrator or an alumnus actually asks — who graduated in 2015, which postings are still open, who applied, how much was donated — so the design language is closer to a well-set institutional document than to a marketing site. Pages open on `{colors.canvas}` (a barely-tinted paper grey), content sits on `{colors.surface}` (white) inside hairline-bordered cards, and the only saturated colour on a default screen is the Department Navy navigation bar.

The colour system has two roles. **Department Navy** (`{colors.primary}` — `#12355B`) is the institutional voice: the navigation bar, the single filled primary button per screen, and inline links. **Reunion Gold** (`{colors.accent}` — `#C9A227`) is the community voice: campaign progress, event badges, and the one highlight that says "this is about people, not records". Gold never carries body text and never fills a button. Semantic colours (`success`, `warning`, `danger`) appear only as soft-tinted pills and alerts, never as large fills.

Typography is a system sans-serif stack at two weights: 600 for headings, labels, and buttons; 400 for everything else. There is no display face and no letter-spacing trick — the hierarchy comes from size and weight alone, which keeps the pages legible on the low-DPI projectors and lab machines the department actually uses. Any cell containing money, counts, or dates uses `{typography.body-numeric}` with tabular figures so columns line up without manual alignment.

Depth is expressed with hairlines, not shadows. Cards use a 1px `{colors.hairline}` border on `{colors.surface}`; the only shadow in the system is a single soft lift on the focused input. Radius is small and consistent — `{rounded.sm}` for controls, `{rounded.md}` for cards, `{rounded.pill}` reserved for status pills.

**Key Characteristics:**
- Navy navigation bar (`{nav-bar}`) as the only saturated band on the page.
- One filled primary button per screen; every other action is a bordered secondary or a text link.
- Hairline-bordered cards on white over a paper-grey canvas — no drop shadows, no gradients.
- Tabular figures (`{typography.body-numeric}`) for amounts, counts, ids, and dates.
- Status pills (`{pill-status-open}`, `{pill-status-closed}`) instead of coloured text for state.
- Single-column forms with labels above inputs and inline error text below.
- Real photography only: graduate portraits and event photographs, never stock imagery.

## Colors

> **Source:** the palette proposed in [brand.md](brand.md); this document is the source of truth for values.

### Brand & Accent
- **Department Navy** (`{colors.primary}` — `#12355B`): navigation bar, primary button fill, inline links, active tab underline.
- **Deep Navy** (`{colors.primary-hover}` — `#0C2440`): hover and pressed state of the primary button and nav links.
- **Navy Soft** (`{colors.primary-soft}` — `#E8EDF4`): selected table row, active navigation item background, focus ring tint.
- **Reunion Gold** (`{colors.accent}` — `#C9A227`): campaign progress bars, event badges, the "featured" marker on a posting. Never a text colour at body size, never a button fill.
- **Gold Soft** (`{colors.accent-soft}` — `#F6EFD6`): the background of a gold badge or a highlighted campaign card.

### Surface
- **Paper** (`{colors.canvas}` — `#F7F8FA`): the page background on every screen.
- **White** (`{colors.surface}` — `#FFFFFF`): cards, tables, forms, and the content column.
- **Sunken** (`{colors.surface-sunken}` — `#EEF1F5`): table headers, disabled inputs, the closed-status pill.

### Text
- **Ink** (`{colors.ink}` — `#1B1F24`): body copy, table cells, input values.
- **Ink Secondary** (`{colors.ink-secondary}` — `#3A424D`): form labels, card subtitles.
- **Ink Mute** (`{colors.ink-mute}` — `#5A6472`): metadata, timestamps, empty-state copy, table headers.
- **On Primary** (`{colors.on-primary}` — `#FFFFFF`): text on the navy navigation bar and the primary button.

### Semantic
- **Success** (`{colors.success}` — `#1E7A46`) on `{colors.success-soft}`: saved confirmations, `open` status pill, completed donations.
- **Warning** (`{colors.warning}` — `#B26A00`) on `{colors.warning-soft}`: pending donations, incomplete profiles.
- **Danger** (`{colors.danger}` — `#B3261E`) on `{colors.danger-soft}`: validation errors, the delete action, `failed` donations.

Contrast: Ink on White is 16.6:1, Ink Mute on White is 6.0:1, On Primary on Department Navy is 12.5:1, Warning on Warning Soft is 4.8:1 — all above WCAG AA. Reunion Gold on White is 2.4:1 and must never carry text.

## Typography

### Font Family
- **UI and body:** the system stack — `-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`. No webfont is loaded, so pages render instantly on slow campus networks and nothing is licensed.
- **Long-form editorial:** the system serif stack — `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif`. Used only for article bodies, the about page's prose, and the hero lead. It is not a webfont, so nothing is licensed or downloaded; it gives the record pages an editorial voice without leaving the system fonts.
- **Code and ids:** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, used for record ids in tables and for the API examples in the documentation.
- A licensed humanist sans-serif is **TBD**; if one is chosen it replaces the system stack in this file and in `public/css/app.css`, nowhere else.

### Hierarchy
- **Display Large** (`{typography.display-lg}` — 32px/600): page titles, one per screen (`All users`, `Job postings`).
- **Display Medium** (`{typography.display-md}` — 24px/600): the record title on a detail page (a posting title, a user's name).
- **Heading Large** (`{typography.heading-lg}` — 20px/600): section headings inside a page (`Applications`, `Donations`).
- **Heading Medium** (`{typography.heading-md}` — 18px/600): card titles in a list.
- **Body Large** (`{typography.body-lg}` — 16px/400): long-form copy — announcements, descriptions, cover letters.
- **Body Medium** (`{typography.body-md}` — 14px/400): the default for tables, forms, and navigation.
- **Body Small** (`{typography.body-sm}` — 13px/400): metadata under a title, helper text under an input.
- **Body Numeric** (`{typography.body-numeric}` — 14px/400, `tnum`): amounts, counts, dates, ids.
- **Body Editorial** (`{typography.body-editorial}` — 17px serif, 1.65): article bodies, about-page prose, and the hero lead, one step up at 18px. The only place a serif appears; UI text stays in the sans stack.
- **Label** (`{typography.label}` — 12px/600, 0.3px tracking): eyebrows, form labels, table headers, status pills, footer headings.
- **Button** (`{typography.button}` — 14px/600): every button and link-styled action.

### Principles
- Two weights only: 600 and 400. No 300, no 700, no italics for emphasis — use a heading or a sentence instead.
- Hierarchy comes from size and weight, never from colour alone.
- Sentence case everywhere: `Create job posting`, not `Create Job Posting`.
- Line length caps at 72 characters for long-form copy; tables and forms may run wider.
- Numbers are always tabular so a column of amounts reads as a column.

### Note on Font Substitutes
The system stack renders as Segoe UI on Windows, SF Pro on macOS, and Roboto on Android and ChromeOS. Metrics differ slightly, so never hard-code a text width or a fixed-height button; size controls with padding and let the type breathe.

## Layout

### Spacing System
A 4px scale: `{spacing.xxs}` 2, `{spacing.xs}` 4, `{spacing.sm}` 8, `{spacing.md}` 12, `{spacing.lg}` 16, `{spacing.xl}` 24, `{spacing.xxl}` 32, `{spacing.huge}` 48. Component padding uses `md`/`lg`; gaps between cards use `lg`; section separation uses `xxl`; page top and bottom padding uses `huge`.

### Grid & Container
Detail pages use a two-column split at desktop: main content on the left, an action and metadata sidebar on the right that sticks while the content scrolls (`position: sticky`, 24px offset). The sidebar drops below the content under 1024px.

A single centred content column, max-width 1080px, with `{spacing.xl}` side padding below 1080px and `{spacing.lg}` below 640px. Detail pages use a two-column split at desktop (main content 2/3, metadata sidebar 1/3) that collapses to one column below 900px. Tables are full-width inside the column and scroll horizontally rather than wrapping cells.

### Whitespace Philosophy
Whitespace separates records, not decoration. Every card is one record; the gap between cards is the only divider needed. Forms breathe at `{spacing.lg}` between fields and `{spacing.xl}` between fieldsets. Never compress a table to fit more rows — paginate instead.

## Elevation & Depth

Depth is nearly flat. Cards, tables, and the navigation bar are separated by 1px `{colors.hairline}` borders on `{colors.surface}`, not by shadows. The single exception is the focused input, which lifts with `0 1px 2px rgba(18, 53, 91, 0.12)` plus a 2px `{colors.primary-soft}` ring so keyboard focus is unmistakable.

### Decorative Depth
None. No gradients, no glass, no blurred backdrops, no illustration behind content. The one permitted decorative element is a 3px `{colors.accent}` top border on a featured campaign card.

## Shapes

### Border Radius Scale
- `{rounded.xs}` 4px: table cells, badges, the navigation bar's inner items.
- `{rounded.sm}` 6px: buttons, inputs, selects, alerts.
- `{rounded.md}` 8px: cards, panels, the empty state.
- `{rounded.lg}` 12px: modal dialogs and the largest containers only.
- `{rounded.pill}` 9999px: status pills and count badges — nothing else.

### Photography Geometry
Portraits are square (1:1), cropped to the face, 96px in tables and 160px on a profile page. Event photographs are 3:2 landscape, full column width, with no rounded corners beyond `{rounded.md}`. Every image carries a caption with the event name and year in `{typography.body-sm}`.

## Components

### Buttons
- **Primary** (`{button-primary}`): Department Navy fill, white text, `{rounded.sm}`, `10px 16px` padding. Exactly one per screen — the action the page exists for (`Save`, `Create job posting`, `Apply`).
- **Primary hover** (`{button-primary-hover}`): Deep Navy fill, no size change.
- **Secondary** (`{button-secondary}`): white fill, 1px `{colors.hairline-strong}` border, navy text. Used for `Cancel`, `Edit`, `Back`.
- **Danger** (`{button-danger}`): white fill, 1px `{colors.danger}` border, red text. Used only for `Delete`, and always paired with a confirmation.
- Disabled buttons drop to `{colors.surface-sunken}` fill with `{colors.ink-mute}` text and no border. Never hide a disabled action — explain why it is unavailable next to it.

### Cards & Containers
- **Card** (`{card}`): white, 1px `{colors.hairline}`, `{rounded.md}`, 20px padding. One record per card.
- **Posting card** (`{card-posting}`): a card whose title is `{typography.heading-md}`, followed by company and city in `{typography.body-sm}` `{colors.ink-mute}`, a status pill on the right, and the description clamped to three lines.
- **Table** (`{table-header}`, `{table-row}`): header row on `{colors.surface-sunken}` with `{typography.label}` in `{colors.ink-mute}`; body rows on white separated by 1px `{colors.hairline}`; hover row tinted `{colors.primary-soft}`.
- **Danger zone** (`{danger-zone}`): a card with a `{colors.danger}` border, a short explanation, and one danger button. It sits below edit forms and is the only place a destructive action appears twice (header and editor).
- **Empty state** (`{empty-state}`): centred `{colors.ink-mute}` copy plus one secondary action. Copy states the fact and offers the next step: `No job postings yet. Be the first to share one.`

### Inputs & Forms
- **Text input** (`{text-input}`): white fill, 1px `{colors.hairline-strong}`, `{rounded.sm}`, `10px 12px`, `{typography.body-md}`. Placeholder text is `{colors.ink-mute}` and never replaces a label.
- **Focused input** (`{text-input-focused}`): 1px `{colors.primary}` border plus the focus ring described in Elevation & Depth.
- **Label** (`{form-label}`): above the input, `{typography.label}`, `{colors.ink-secondary}`, with `{spacing.xs}` gap. Required fields are marked with a text suffix `(required)`, not an asterisk alone.
- **Error text**: below the input, `{typography.body-sm}`, `{colors.danger}`, prefixed by the field name: `Field "title" must be at most 120 characters.`
- Forms are single-column. Fieldsets group related fields with a `{typography.heading-lg}` legend and `{spacing.xl}` separation.
- **Form note**: one paragraph below the form at `{typography.body-sm}` in `{colors.ink-mute}`, for caveats that are not field errors (for example, that no verification email is sent yet).

### Navigation
- **Utility bar** (`{utility-bar}`): a white strip above the navy bar with the faculty on the left and the department on the right, at label size in Ink Mute. It carries the institutional context so the navy bar can stay short.
- **Top bar** (`{nav-bar}`): Department Navy, white text, 12px/24px padding, product name at `{typography.heading-md}` on the left, section links at `{typography.body-md}` on the right.
- **Active item**: white text with a 2px `{colors.accent}` bottom border. Inactive items are `rgba(255,255,255,0.78)`.
- **Breadcrumb** on detail pages: `Job postings / Data Analyst` in `{typography.body-sm}`, `{colors.ink-mute}`, links in `{colors.primary}`.
- No hamburger above 768px; below it, links collapse into a single menu button labelled `Menu`.

### Headings and Page Furniture
- **Eyebrow** (`{eyebrow}`): a label-size line above a page title that names the section (`Alumni directory`, `Career services`, `Community`, `About`). It replaces repeating the module name in the title itself.
- **Page header**: title plus optional one-sentence subtitle, closed by a 1px `{colors.hairline}` rule. The rule is the page's first structural line.
- **Section head**: a section title with an optional right-aligned meta line (`20 records, ordered by id`), closed by the same hairline rule. Used instead of bare `h2`s.
- **Breadcrumb**: `Section / Record` in `{typography.body-sm}`, with the current record unlinked.

### Pills, Tags, and Chips
- **Status pill** (`{pill-status-open}`, `{pill-status-closed}`): `{rounded.pill}`, `{typography.label}`, `2px 10px` padding. `open` is green on green-soft; `closed` is mute on sunken. Application states map the same way: `pending` warning, `reviewed` navy-soft, `accepted` success, `rejected` danger.
- **Count badge**: same shape, `{colors.primary-soft}` fill with `{colors.primary}` text, used for row counts in section headings.
- **Role pill**: the same shape, one class per role — `alumni` is mute on sunken, `staff` navy on navy-soft, `admin` white on navy (the only filled pill in the system), `employer` warning on gold-soft. It appears in the directory table, in the record header, and in the identity list, so a role can be read at a glance.
- Pills are never interactive. If it can be clicked, it is a button or a link.

### Signature Components
- **Profile header**: square portrait, name at `{typography.display-md}`, graduation year and department in `{typography.body-sm}` `{colors.ink-mute}`, and a privacy indicator pill stating who can see the profile.
- **Campaign progress**: a 8px `{rounded.pill}` track on `{colors.surface-sunken}` with a `{colors.accent}` fill, the raised amount in `{typography.body-numeric}`, and the goal in `{colors.ink-mute}` beside it.
- **Application row**: applicant name, applied date in `{typography.body-numeric}`, status pill, and a `Review` secondary button — the whole row is the record, no detail page needed for triage.
- **404 and error pages**: centred, max-width 560px, `{typography.display-lg}` title, one sentence of reason in `{typography.body-lg}`, and a row of secondary links back into the app.

## Do's and Don'ts

### Do
- Use `{colors.primary}` for exactly one filled button per screen and for inline links.
- Put every record in a `{card}` or a `{table-row}` with a 1px `{colors.hairline}` border — the border is the separator.
- Render amounts, counts, dates, and ids with `{typography.body-numeric}` so columns align.
- Express state with a status pill, not with coloured body text.
- Keep forms single-column with labels above inputs and errors directly below the field.
- Write empty states as a fact plus a next step.
- Reserve `{colors.accent}` for community signals: campaign progress, event badges, the active nav underline.

### Don't
- Don't add drop shadows, gradients, or glass effects to cards, headers, or modals.
- Don't use Reunion Gold as a text colour or a button fill — it fails contrast on white.
- Don't introduce a second accent colour; the palette is navy, gold, and neutrals.
- Don't use `{rounded.pill}` on buttons or cards — pills are for status and counts only.
- Don't put two filled primary buttons on one screen.
- Don't use stock photography, illustrations of people, or decorative icons in place of labels.
- Don't hide a destructive action behind an icon; `Delete` is always a labelled button with a confirmation.
- Don't use emoji anywhere in the interface.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Wide | ≥ 1280px | Content column 1080px; detail pages two-column (2/3 + 1/3) |
| Desktop | 1024–1279px | Content column fluid with 24px side padding; two-column detail retained |
| Tablet | 768–1023px | Detail pages collapse to one column; tables scroll horizontally; nav links stay visible |
| Mobile | < 768px | Nav collapses to a `Menu` button; display drops 32 → 24px; cards go full-bleed with 16px padding |

### Touch Targets
- Buttons and inputs are at least 40px tall on touch; below 768px they grow to 44px via padding.
- Table rows are 44px minimum on mobile so a row is tappable as a whole.
- Status pills are not interactive, so they stay at their compact size.

### Collapsing Strategy
- Display tiers stair-step 32 → 24 → 20px; body stays at 14px and never drops below 13px.
- Tables keep their columns and scroll horizontally rather than stacking into cards — the columns are the point.
- The two-column detail layout becomes one column with the metadata block moved below the main content.
- Navigation links collapse into a single menu button; the product name stays visible at all widths.
- Forms stay single-column at every width; only padding changes.

### Image Behavior
Portraits use `srcset` at 96px, 160px, and 320px with a square crop; the 96px variant is served in tables. Event photographs are served at 640px and 1280px wide with a 3:2 crop, lazy-loaded below the fold. No image is used as a background, and no text is ever set over a photograph.

## Iteration Guide

1. Change one component at a time and reference tokens by name (`{colors.primary}`, `{button-primary}`, `{rounded.sm}`) — never a raw hex value in a template.
2. When a token changes here, change it in `public/css/app.css` (the single stylesheet that implements it), and update [brand.md](brand.md) if the intent changed too.
3. Keep the palette closed: navy, gold, neutrals, and the three semantic pairs. A new colour needs a documented reason.
4. New screens start from an existing pattern — list page, detail page, or form — before inventing a layout.
5. Every new component gets an entry in the frontmatter `components` map and a paragraph under Components.
6. Check contrast before shipping: body text ≥ 4.5:1, large text and UI borders ≥ 3:1.
7. If the `@google/design.md` CLI is available, run `npx @google/design.md lint DESIGN.md` after edits to keep the file valid. It is not installed in this project, so the frontmatter is validated by hand: every `group.token` reference in the prose must exist in the frontmatter map.
