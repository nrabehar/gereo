# Gereo: Design Foundations

Synthesis of three design research reports: [06-design-process.md](raw/06-design-process.md), [07-ui-ux-best-practices.md](raw/07-ui-ux-best-practices.md) and [08-competitor-ux-comparison.md](raw/08-competitor-ux-comparison.md). It builds on [competitive-analysis.md](competitive-analysis.md). Evidence labels in the raw reports are [V] verified at a primary source, [S] secondary, [U] unverified. Items marked [U] here are working assumptions to test, not facts.

## 1. What the research says in one page

1. **Trust screens decide adoption.** Money-out flows need one review screen, a live fee, a reference ID on everything, and honest status words. About 25% of Sub-Saharan mobile money owners have sent money to the wrong person and half never recovered it (CGAP, Findex 2025) [V].
2. **Text-only interfaces fail low-literacy users.** In Medhi et al. (CHI 2009), a rich multimedia interface reached 100% task completion against 72% for voice-only, and text-only was unusable for first-time low-literacy users [V]. Use icons with visible labels, short plain words, prerecorded human voice where it matters, and flat navigation.
3. **The real device is the constraint.** Android Go phones, apps under 40 MB, startup under 5 s, about 5 Ar per MB of data [V/S]. Cache first, show last-synced time, keep money-out online only.
4. **Nobody documents the core differentiators.** No source shows a rule-builder preview, a "why this rule fired" line on each entry, a visible reconciliation of the ledger against the provider balance, a multi-approver interface, or a vote linked to spending with an automatic decision log. These are Gereo's open design space and also its highest design risk.
5. **No competitor has a Malagasy interface.** MVola reviewers ask for more languages [S]. Malagasy as a first-class language is both a differentiator and a cost.
6. **Process must fit one person plus AI.** Double Diamond over 8 weeks, two test rounds of 5 to 6 people in person, fieldwork as the bottleneck.

## 2. Process

Skeleton: Double Diamond with a decision gate after each diamond (end of week 2: scope and brief; end of week 6: hi-fi approved for build).

| Week | Focus | Main outputs |
| --- | --- | --- |
| 1 | Discover | Research plan, oral consent script (Malagasy and French), recruiting list, 5 to 6 field conversations, glossary v0 |
| 2 | Discover and define | 5 to 6 more conversations including one co-design session with an association, journey map, service blueprint, job stories, MVP cut, design principles, performance and accessibility budgets |
| 3 | Flows and wireframes | Flows with error branches, error-state inventory v1, information architecture, grayscale 360 px wireframes with real strings in three languages |
| 4 | Low-fi prototype and test round A | Clickable prototype plus paper kit, 6 sessions (3 members, 3 permission holders) on real phones, fix list |
| 5 | Hi-fi core and design system | Hi-fi for the top 4 flows in light and dark, semantic tokens, component library mirrored from code, microcopy reviewed by a native Malagasy speaker |
| 6 | Coded prototype and test round B | Prototype in the existing React app on a real low-end device, performance and accessibility pass, 5 to 6 sessions |
| 7 | Complete and document | Remaining screens, empty, error and pending states, content table in three languages, component docs, Code Connect |
| 8 | Handoff and buffer | Annotated screens, acceptance criteria, retrospective, post-launch learning plan |

Rules for the process:
- Use Jobs-to-be-Done only as an interview lens and for job stories. Use Lean UX assumption tests for the backlog. Run two adapted 2-day mini-sprints: contribute plus ledger plus notification, and the async vote with quorum. No official solo design sprint exists [S].
- Test 3 to 5 people per round, in several rounds, 3 to 4 per distinct segment (NN/g) [V]. In person first, WhatsApp voice sessions with airtime support as a fallback.
- Pay participants in airtime or mobile money, about half a local day's wage [V from Medhi].
- Cut order if time slips: Code Connect mappings, then dark-mode refinement, then extra screens. Never cut the two test rounds or the error-state inventory.
- The founding group is a convenient but biased first cohort. Add 2 to 3 outside groups.
- Every Malagasy string and every consent conversation needs a human. The AI assistant drafts, clusters, generates and checks.

## 3. Design principles for Gereo

1. **Show the money's state, never hide it.** Every amount has a status word, an icon and a colour, and a reference ID.
2. **One decision per screen at the money moment.** The review screen shows recipient, amount, fee, total, source wallet and balance after.
3. **Explain every automatic action.** A rule firing writes a ledger entry with the rule's name. Rules show a preview before they are enabled.
4. **Approvals authorise exactly what is shown.** Any change voids earlier approvals.
5. **Plain words, tested.** Short sentences, one term per concept, tested in Malagasy and French.
6. **Cheap by default.** Cached first, light assets, a visible data-saver mode.
7. **SMS is a first-class channel.** Anything critical (OTP, receipt, vote deadline, contribution due, event reminder) works over SMS.
8. **Permissions in human words.** Named bundles and a per-member "Effective access" panel; never roles in the interface code, but people think in roles so the bundles carry plain names.
9. **The ledger is append-only.** Corrections are reversing entries.

## 4. Must-have rules (launch)

Condensed from the 50-rule checklist in the raw report. P0 means true at launch.

**Money and trust**
- Money is integer ariary everywhere. Never floats. Confirm the Vanilla Pay amount encoding: ISO 4217 lists 2 minor units while CLDR says 0 [S].
- Display `12 500 Ar`: space grouping, no decimals, no-wrap, identical in Malagasy, French and English. In the `mg` locale, "," means thousands, in French it means decimal, so space grouping avoids both.
- Review screen on one screen. Fee and total update live while the amount is typed. Button labelled with the action and the amount.
- Transaction states Initiated, Pending, Confirmed, Failed, Cancelled, plus a Needs-attention state. Pending says what happens next. Failed says whether money moved.
- PIN screen repeats amount and recipient. PIN required on every money-out.
- First-time payee, new device or large amount triggers a pause: "Did someone ask you to send this?" and "Gereo never asks for your PIN".
- Money-out works online only, with an explicit explanation offline. Votes and drafts queue with a visible state.

**Authentication and onboarding**
- SMS OTP: single input, autofill, paste allowed, six digits, expiry at most 10 minutes (5 preferred), resend countdown. WCAG 3.3.8 forbids blocking paste.
- Tiered KYC shown as "what you can do now" and "what unlocks next" with ariary limits. Ask for ID and selfie at the moment a limit is hit. Support assisted onboarding by a facilitator.
- Self-service PIN reset and device recovery.

**Layout and accessibility**
- Touch targets at least 48 by 48 dp, 8 dp apart (WCAG 2.5.8 floor is 24 px) [V].
- Contrast 4.5:1 for text, 3:1 for large text and UI components. Status never by colour alone.
- OS font scaling to 200%, reflow at 320 px, amounts never clipped.
- Bottom navigation of at most four items with always-visible labels (hidden navigation was used in 57% of mobile tasks against 86% when visible, NN/g) [V].
- No text inside images.

**SMS and language**
- SMS templates GSM-7 safe and under 160 characters. Circumflex letters (ê, ô, â, î, û), lowercase ç and curly apostrophes switch an SMS to 70 characters per segment [V]. French copy and the Malagasy "ô" are a cost trap. Lint templates in CI.
- Short labels can expand 200 to 300% from English [V W3C]. Design for 2x. Measure real Malagasy and French ratios from the first 150 strings. Add an i18n library before hi-fi (none is installed in `web/package.json`).

**Performance** (starting budgets, [V] thresholds and [U] numbers)
- LCP at most 2.5 s on Lighthouse mobile throttling, INP at most 200 ms, CLS at most 0.1.
- JavaScript per route under about 100 KB compressed, first-visit transfer about 300 KB. A looser starting point from web.dev is 170 KB JS and 5 s to interactive on slow 3G.
- App under 40 MB installed, startup under 5 s, tested on a 1 to 2 GB RAM Android Go phone.

**Votes and approvals**
- Stated passing rule, deadline in absolute and relative time, quorum progress, vote changeable until close, outcome statement with next steps (Loomio) [V].
- Approval screen in plain language with "2 of 3 approved".

**Groups and rules**
- Rule builder as a three-slot sentence with live preview from real history, a combined "what happens when money arrives" summary, and plain-language cycle detection [U shape].
- Per-member "Effective access" panel. An experiment found effective-permission views beat rule lists, 83.6% against 56.5% accuracy (n=36) [V].
- Group dashboard as headline sentences plus a ranked list with percent bars. Sankey is optional and never alone, because the evidence is thin [S].

## 5. Screens to wireframe (26)

From [08-competitor-ux-comparison.md](raw/08-competitor-ux-comparison.md) section 7. Priority P0 means part of the first wireframe pass.

| # | Screen | Flow | Priority |
| --- | --- | --- | --- |
| 1 | Welcome and language | Onboarding | P0 |
| 2 | Phone, OTP and PIN | Onboarding | P0 |
| 3 | KYC tier ladder and capture | Onboarding | P0 |
| 4 | Home dashboard | Core | P0 |
| 5 | Wallet list and create | Wallets | P0 |
| 6 | Wallet detail and ledger | Wallets | P0 |
| 7 | Transaction detail and receipt | Wallets | P0 |
| 8 | Money in, money out and transfer | Wallets | P0 |
| 9 | Rule builder with preview | Rules | P0 |
| 10 | Rule detail and firing history | Rules | P1 |
| 11 | Group home | Group | P0 |
| 12 | Group ledger (transparency) | Group | P0 |
| 13 | Invite and join | Group | P0 |
| 14 | Contribution plan setup | Contributions | P0 |
| 15 | Pay contribution | Contributions | P0 |
| 16 | Member status board | Contributions | P0 |
| 17 | Roles and permission bundles | Permissions | P1 |
| 18 | Expense request | Approvals | P0 |
| 19 | Approval inbox and detail | Approvals | P0 |
| 20 | Create vote | Votes | P0 |
| 21 | Vote detail and cast | Votes | P0 |
| 22 | Decision log | Votes | P0 |
| 23 | Project page | Projects | P1 |
| 24 | Event and RSVP | Events | P1 |
| 25 | Notification centre and preferences | Notifications | P1 |
| 26 | Support, export and account safety | Account | P1 |

Components to design once: status chip (word, icon, colour), amount-and-fee confirmation sheet, "last synced" banner, provider-unavailable banner, role badge, quorum meter.

Best evidence for individual screens, all [V] unless stated: Stanbic Chama FAQ (invoice-first payment, role matrix, invite flow, ID plus selfie before joining), Open Collective (11-status expense workflow), Loomio (quorum, outcome statements, review dates), Monzo (Salary Sorter, Bills Pot), CGAP principles. Rows with no strong source (screens 10, 17 to 19, 23, 26) are the least certain.

## 6. Open questions

1. **Smartphone ownership.** The 9% figure could not be reproduced. One news item says 24%, GSMA gives 14.3% unique mobile internet penetration, DataReportal gives 20.4% internet use. Verify before it drives decisions.
2. **Vanilla Pay licence perimeter.** [03 report](raw/03-madagascar-mobile-money.md) and the design process report both found that Vanilla Pay still seeks e-money status [S]. Get written confirmation before final copy.
3. **Identity verification.** `info.md` says Vanilla Pay provides none yet lists "verify identity" in the start journey. Reconcile.
4. **Channel.** Is WhatsApp or Messenger dominant for the target groups? No Madagascar data found.
5. **Malagasy register and glossary**, and whether audio guidance belongs in the MVP or a later phase.
6. **Figma plan.** Light and dark modes and language modes need a Professional plan (10 modes per collection); Dev Mode and Code Connect also need Professional or higher. The account plan tier is "student", so check.
7. **Hands-on walkthrough** of Stanbic Chama, Chamasoft, Loomio, Open Collective and MVola on a real device is the cheapest way to turn [U] items into [V].
8. Evidence gaps from the raw reports: no Airtel Money UX source, no visual-style detail (the research could not view images), store ratings that disagree between storefronts, and Material 3 and Apple HIG pages that were not readable.

## 7. Next artifacts

1. FigJam: [Gereo - Research and MVP](https://www.figma.com/board/9mOn96yDG2ihV1PGU6J7yL), already built.
2. Figma Design file with grayscale 360 px wireframes of the P0 screens above and the six shared components.
3. Error-state inventory and content table in three languages.
4. Low-fi prototype for test round A.
