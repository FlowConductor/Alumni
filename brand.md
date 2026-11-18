# Brand Guidelines — MIS Alumni Portal

The brand reference for the MIS Alumni Portal: who we are, how we sound, and how the product should look. It is the companion to [README.md](README.md) (what the product does), [ddd.md](ddd.md) (how the domain is modelled), and [DESIGN.md](DESIGN.md) (the design system: tokens, components, responsive rules).

Status: the written identity below is decided. Visual values live in [DESIGN.md](DESIGN.md), which is the source of truth for colours, type, radius, and spacing, and are implemented in `public/css/app.css`. Items marked **TBD** are open decisions.

## Table of Contents

- [Brand at a Glance](#brand-at-a-glance)
- [Brand Story](#brand-story)
- [Audiences](#audiences)
- [Voice and Tone](#voice-and-tone)
- [Naming and Terminology](#naming-and-terminology)
- [Visual Identity](#visual-identity)
- [UI Copy Patterns](#ui-copy-patterns)
- [Brand in the Codebase](#brand-in-the-codebase)
- [Do and Don't](#do-and-dont)
- [Assets and Ownership](#assets-and-ownership)

## Brand at a Glance

| Element | Value |
|---------|-------|
| Name | MIS Alumni Portal |
| Tagline | Where MIS graduates stay connected. |
| One-liner | The alumni tracking system and community portal for graduates of the Istanbul University, Faculty of Economics, Department of Management Information Systems. |
| Positioning | Two products in one: an institutional record of graduates for the department, and a community hub alumni actually want to use. |
| Personality | Institutional but warm. Precise, plain-spoken, never bureaucratic. |
| Language | English in the product and documentation. Turkish is the primary community language and is expected in user-generated content. |

The name is always written in full as **MIS Alumni Portal** on first mention. "The portal" is acceptable afterwards. Do not shorten it to "MAP", "Alumni App", or "MIS Portal".

## Brand Story

The Department of Management Information Systems has decades of graduates and no single place that knows who they are. Spreadsheets go stale, social networks are not institutional records, and the department's accreditation reports depend on data nobody maintains.

The MIS Alumni Portal closes that gap by making the two needs the same product: the more useful the portal is to alumni, the better the data the department holds; the better the data, the more the department can offer back. The brand should always express that reciprocity — the portal is not surveillance of graduates, and it is not a marketing site for the university. It is a shared asset.

Three values drive every decision:

1. **Accuracy over volume.** A verified profile beats a large stale list. Never imply data the portal does not have.
2. **Belonging over networking.** The tone is a department reunion, not a job marketplace. Career features serve the community; they do not define it.
3. **Privacy by default.** Alumni decide what is visible. Copy must never pressure people into publishing more than they chose.

## Audiences

| Audience | What they need from the brand | How they meet it |
|----------|-------------------------------|------------------|
| Alumni | To feel recognised, not processed | Warm, direct copy; no institutional jargon; privacy controls stated plainly |
| Current students and recent graduates | A reason to join early | Mentorship and job postings framed as access, not obligation |
| Department staff | Confidence that the data is trustworthy | Precise labels, visible provenance, no inflated claims |
| Partner companies | A credible channel to MIS talent | Professional, factual posting language |

## Voice and Tone

The voice is constant; the tone shifts with the moment.

**Voice principles**

- **Plain.** Short sentences, active verbs, no filler. "Save your profile", not "Utilise the profile management facility".
- **Specific.** Numbers and names over adjectives. "1,240 graduates since 1998", not "a thriving community".
- **Warm, not chummy.** Address the reader as "you". No exclamation marks, no slang, no emoji.
- **Honest about limits.** If a feature is not built, say so. The documentation already marks undecided items **TBD**; the product should be equally candid.

**Tone by moment**

| Moment | Tone | Example |
|--------|------|---------|
| Welcome and onboarding | Encouraging, brief | "Welcome back. Your profile is 80% complete." |
| Data entry | Neutral and instructive | "Graduation year is required." |
| Errors | Calm, factual, actionable | "We could not save your changes. Try again." |
| Empty states | Helpful, never scolding | "No job postings yet. Be the first to share one." |
| Success | Quiet | "Saved." |
| Sensitive data (privacy, donations) | Explicit and reassuring | "Only you and department staff can see this." |

## Naming and Terminology

Consistency matters more than preference. Use these terms exactly:

| Use | Not |
|-----|-----|
| alumni (plural), alumnus (one person) | alumnis, alumni's (as plural) |
| graduate | ex-student, mezun (in English copy) |
| the department | the school, the faculty (when the department is meant) |
| MIS | Management Information Systems (spell out on first mention) |
| job posting | job ad, vacancy, listing |
| job application | application form, submission |
| donation | gift, contribution (in UI labels) |
| announcement | news item, post |
| profile | account, record |

Capitalisation: sentence case for headings, buttons, and labels ("Create job posting", not "Create Job Posting"). Product names and proper nouns keep their capitals (MIS Alumni Portal, Istanbul University).

## Visual Identity

### Logo

**TBD** — no logo exists yet. Until one is chosen, use the wordmark "MIS Alumni Portal" set in the heading typeface. Do not draw a temporary mark, and do not use the Istanbul University or faculty logo without written permission from the department.

### Colour

The palette is defined once, as tokens, in [DESIGN.md](DESIGN.md) — that file is the source of truth for every hex value, type size, radius, and spacing step. This section records only the intent behind each role.

| Role | Name | Use |
|------|------|-----|
| Primary | Department Navy | Navigation bar, the one filled primary button per screen, links |
| Primary hover | Deep Navy | Hover and pressed states |
| Accent | Reunion Gold | Campaign progress, event badges, the active nav underline |
| Surface | Paper | Page background |
| Surface raised | White | Cards, forms, tables |
| Text | Ink | Body copy |
| Text muted | Slate | Secondary text, metadata |
| Border | Line | Dividers, input borders |
| Success | Green | Confirmations, `open` status |
| Warning | Amber | Cautions, `pending` status |
| Danger | Red | Errors, destructive actions |

Contrast: body text must reach WCAG AA (4.5:1) against its background. Never use Reunion Gold for body text on white — it measures 2.4:1.

### Typography

**TBD** — no typeface is licensed yet. The interim stack is the system sans-serif, defined as tokens in [DESIGN.md](DESIGN.md) (`{typography.display-lg}` through `{typography.label}`). Two families maximum; a licensed humanist sans-serif would replace the system stack in DESIGN.md and in `public/css/app.css`, nowhere else.

### Imagery

Real graduates, real events, real workplaces. No stock photography of generic handshakes or smiling call-centre staff. Portraits are square, natural light, and published only with the person's consent. Illustrations, if used, are line-based and single-colour in Department Navy.

### Layout and spacing

Generous whitespace, one primary action per screen, forms in a single column. Spacing on a 4 px scale (4, 8, 12, 16, 24, 32, 48). Cards use a 1 px Line border rather than a shadow.

## UI Copy Patterns

Concrete strings, matching the messages the application already returns.

| Context | Copy |
|---------|------|
| Page title suffix | `- MIS Alumni Portal` |
| Primary button | `Save`, `Create job posting`, `Apply`, `Delete` |
| Destructive confirmation | `Delete this job posting? This cannot be undone.` |
| Required field error | `Field "title" is required.` |
| Length error | `Field "title" must be at most 120 characters.` |
| Not found | `User with id 999999 not found.` |
| Conflict | `This user has already applied to this job posting.` |
| Blocked delete | `User with id 1 still has donations or job applications and cannot be deleted.` |
| 404 page | `404 - Page not found` / `The page you asked for does not exist on the MIS Alumni Portal.` |
| Server error | `Server error` / `Unexpected server error.` |

Rules: no emoji anywhere in the product or documentation. No all-caps for emphasis. Error messages state what happened and what to do next, never blame the user.

## Brand in the Codebase

Where the brand currently lives, so changes stay in one place:

| Surface | Location |
|---------|----------|
| Design tokens and component rules | `DESIGN.md` |
| Page titles and headings | `src/views/**/*.ejs` (`<title>` and `<h1>`) |
| 404 page | `src/views/404.ejs` |
| Error page | `src/views/error.ejs` |
| API error copy | `src/controllers/*.controller.js` |
| API documentation | `src/docs/openapi.js` (served at `/api-docs`) |
| Project description | `README.md`, `package.json` (`description`) |

The shared layout lives in `src/views/partials/` (`head.ejs`, `nav.ejs`, `footer.ejs`) and the tokens are implemented once in `public/css/app.css` — the single place those values are written in code.

## Do and Don't

**Do**

- Write in plain English and let Turkish appear naturally in user-generated content.
- Show the department's name in full on first mention.
- State privacy rules explicitly wherever personal data is collected.
- Keep the two-product framing visible: tracking for the department, community for alumni.

**Don't**

- Use emoji, exclamation marks, or hype ("revolutionary", "world-class", "seamless").
- Claim data or features the portal does not have.
- Use the university or faculty logo without permission.
- Call alumni "users" in user-facing copy. They are alumni; "user" is an internal, technical term.
- Publish a graduate's details without their consent.

## Assets and Ownership

| Asset | Status |
|-------|--------|
| Logo (SVG, light and dark) | TBD |
| Design tokens (colours, type, radius, spacing) | Defined in [DESIGN.md](DESIGN.md); implemented in `public/css/app.css` |
| Typeface licence | TBD |
| Social preview image | TBD |
| Brand owner / approver | TBD — the department decides |

Until an owner is named, treat this document as the reference and raise changes as pull requests against it.
