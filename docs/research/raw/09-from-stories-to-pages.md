# 09 - From user stories to pages, navigation and flows: methods, evidence and a procedure for Gereo

Research date: 2026-10-19. Scope: the established methods for going from requirements and user stories to a defined set of pages, navigation and flows, and which combination fits Gereo. This report does not repeat what [06-design-process.md](06-design-process.md) covers (Double Diamond, field research, sample sizes for usability tests, interpreter protocol, WCAG, performance budgets, 8-week plan). It builds on [../../product/00-conventions.md](../../product/00-conventions.md), [../../../info.md](../../../info.md), [../design-foundations.md](../design-foundations.md), [08-competitor-ux-comparison.md](08-competitor-ux-comparison.md) and [04-projects-voting-governance.md](04-projects-voting-governance.md).

## 0. Labels, limits and the one-paragraph answer

Labels (same as the other raw reports):

| Label | Meaning |
| --- | --- |
| [V] | Verified: the page was fetched and read in this session at the cited URL |
| [S] | Secondary: search-result excerpt, blog, vendor guide, or a primary source seen only through a summary |
| [U] | Unverified: my synthesis or common practice; treat as a hypothesis to test |

Limits stated up front:

1. Every method below is practitioner-established. I found no controlled study showing that story mapping, OOUX or ORCA produce better products than alternatives [U]. The hard numbers that do exist are for card sorting (NN/g, 168-user study) and for usability sample sizes (see 06). Do not treat the other methods as proven; treat them as structured ways to avoid forgetting things.
2. Some primary pages failed: ooux.com (403 and 404), Material 3 bottom-sheet and navigation-bar pages (JavaScript shell, overview only), Apple HIG tab bars (title only), Linear docs (404 on one URL; the facts used come from search excerpts of Linear's own docs), Open Collective team page (moved). Affected claims are labelled [S] or [U].
3. No source was found for card sorting or tree testing in Malagasy, or for oral card sorting with low-literacy participants. Those parts of the test plan are my adaptation [U].
4. No evidence-based rule exists for "number of screens per MVP". Vendor blogs give ranges that are marketing heuristics (see section 8).

**One-paragraph answer.** Start from the stories you already have, not from screens. Use four methods in sequence, each answering a different question: a **story map** (what, in what order, in which release), **OOUX/ORCA** (which things exist, how they relate, who can do what to each thing, which attributes are shown), **hierarchical task analysis plus flows with a state inventory** (how each critical task proceeds and fails), and **information-architecture tests** (a small paper card sort for labels, then a paper tree test of two competing navigation structures). Gereo's object model and permission list are already half of an OOUX deliverable, so OOUX is the best fit for turning stories into pages; the story map controls scope; the flows and state inventory carry the trust-critical detail. Pages are then derived by explicit rules (section 5), permission variants are designed as first-class states (section 6), and every artifact is traceable by ID (section 7). The full procedure is in section 10.

---

## 1. User story mapping (Jeff Patton)

### 1.1 What it is

- NN/g describes story mapping as a lean UX method using sticky notes to outline the steps users take toward their goals; Jeff Patton popularised it. Its layers are **activities** (most general user tasks, left to right), **steps** beneath each activity (sequential subtasks), and **details** beneath each step (specific interactions, stacked in priority order). Release lines are drawn across the map: details above the first line are the MVP, those below are candidates for later. Steps become epics, details become stories with acceptance criteria [V][1].
- Patton's own wording: the top row is the **backbone**, "the essential capabilities the system needs to have". The stories placed highest form the **walking skeleton** (Alistair Cockburn's term), the smallest system that works end to end, which Patton says he always tries to build first. Releases are horizontal lanes; build order is left to right and top to bottom; the map stays visible as an "information radiator" [V][2].
- Patton does not ask stakeholders to rank backbone items against each other, because all of them are needed for a minimum viable product. The real trade-offs are in the details under each backbone item [V][2].

### 1.2 How to build one from existing stories

Gereo already has the horizontal axis: the eight journey steps in `00-conventions.md` section 4 (Discover and join, Verify, Set up, Fund, Decide, Spend, Follow, Report and support). Procedure [U, adapted from 1.1]:

1. Print or list every story card (ID, title, actor, permission, priority) from `docs/product/stories/`.
2. Place each card under the journey step where the person experiences it. A story that fits two steps is probably two stories.
3. Add a middle row of **user tasks** per journey step (verb phrases: "pay my contribution", "see why money moved"). This is Patton's "steps" layer. It is where gaps appear: a task with no story is a missing story.
4. Draw the vertical order inside each column by necessity (P0 on top), then draw three release lanes: skeleton, MVP, later.
5. Put system-only behaviour (rule firing, reminder sending, vote closing) in a separate low lane, not in the user row. NN/g says to describe what the user does, not what the system does internally [V][1]; `00-conventions.md` already says the System actor appears as acceptance criteria.
6. Keep operator (OPS) stories on their own map. They are a different persona with a different journey; mixing them recreates "map shock".
7. Review left to right as a narrative per persona: Member (Rasoa), Permission holder (Mamy), Guest voter (Tiana), Group founder (Sara). Patton frames the map as a story about a person's use of the product [V][3].

### 1.3 Common mistakes (Patton's five)

From Patton's "5 story mapping mistakes" [V][3]:

| Mistake | Gereo risk | Counter |
| --- | --- | --- |
| Losing the story: cards become nouns/features instead of verb steps | Cards named "Wallet rules", "Votes" | Write every map card as a verb phrase |
| Getting lost in details ("map shock") | 14 epics times many stories | Mile wide, inch deep: finish the whole row of tasks first |
| Worrying about flow, branches and what-ifs | Flowchart arguments inside the map | One typical left-to-right flow; alternatives live in the vertical axis and in the flow specs later |
| Mapping the whole product to add one feature | Not applicable to the first map (the product is new) but applies to every later module (marketplace, lending) | One map per later module |
| Not anchoring releases to an outcome | MVP defined by "everything we listed" | Name target users and a measurable outcome per release before slicing |

NN/g adds warnings against mapping a massive product in one map, discussing tools instead of outcomes, and including risky items without user data or feasibility [V][1]. Patton's earlier article adds: do not keep a flat backlog (it loses context), do not delete the epic when you detail it, do not throw the map away after building it [V][2].

Fit for Gereo: high for scope control and gap finding; low for page definition. A story map says when something is needed, not what page it lives on. Use it as step 2 of the procedure, then hand over to OOUX.

---

## 2. Object-oriented UX (OOUX, Sophia Prater) and ORCA

### 2.1 What it is

- Prater's argument: map the real-world objects in users' mental models before defining actions, flows or layouts. Objects are found by highlighting nouns in the brief; recurring nouns that are tangible things become objects, abstractions and mere collections do not. Each object is broken into **core content** and **metadata** that users might sort or filter by. The object map is a first draft, and "is not a sitemap, storyboard, or task flow" [V][4].
- The same article says that navigation emerges from the relationships between objects: "The content is the navigation, and it's all in context"; persistent top navigation is "the fire escape". It does not claim that objects simply become pages; it says objects are the foundation for the implementation system, interactions and navigation. Views such as maps and calendars are mechanisms built on objects, not objects [V][4].
- ORCA = **O**bjects, **R**elationships, **C**alls-to-action, **A**ttributes. Four stages: Discovery, Requirements, Prioritization, Representation. Discovery produces a nested object matrix, a CTA matrix and an object map. Requirements asks what makes each object unique, which attributes are required, who can edit it, how it changes over time. Prioritization orders the elements of the object map, which translates directly into a single-column mobile hierarchy. Only in Representation are flows and wireframes designed [S][5]. The explainer notes you do not need to follow every step.
- Matrix definitions, from a podcast summary only: the **nested object matrix** lists all objects on both axes and puts relationships at intersections, which "helps identify requirements that could easily be missed"; the **CTA matrix** maps objects to roles (what each user type wants to do to each object) and surfaces who can do what early [S][6]. I found no primary definition of the nested object matrix [S].

### 2.2 Why it fits Gereo unusually well

1. Gereo already has an explicit object model (info.md "Modele conceptuel", `00-conventions.md` section 8 lists 26 objects). OOUX's expensive first step, object discovery, is mostly done; the work is classifying and relating them.
2. Gereo has no roles. The CTA matrix traditionally has roles as columns; here the columns are **permissions** (`00-conventions.md` section 7) plus the System and Guest actors. The permission table is already roughly one half of a CTA matrix; building the full matrix will expose CTAs that have no permission (missing permissions) and permissions that no CTA uses (dead permissions) [U, but a direct consequence of the structure].
3. Entities own things (a user or a group owns wallets, projects, events, documents). The nested object matrix is the right tool to see that "Project" appears under both "User" and "Group" and to decide whether that produces one page or two contexts (open decision D1 in section 10).
4. Permissions inherit group, then project, then document. Nesting (Group contains Project contains Document) is exactly the relationship structure the matrix records, so the inheritance model and the navigation hierarchy can be checked against each other.
5. OOUX forces the ranked, single-column ordering that mobile-first needs, and the ranking doubles as the "show first" rule for each page.

### 2.3 Limits and cautions

- Objects are not pages. Ledger entry, Ballot, RSVP, Approval, Device and Audit entry are objects but are better as rows, sections or sheets inside a parent (section 5). The mapping is a decision, not a conversion.
- OOUX under-specifies sequences and error branches. It must be paired with task analysis and flows (section 3).
- OOUX is noun-led; Gereo's riskiest content is verbs under uncertainty (approve, vote, reverse). The CTA matrix is where those get enough attention.
- No evidence of effectiveness beyond practitioner accounts [U].

---

## 3. Task analysis, hierarchical task analysis, flows with error branches, state inventories

### 3.1 Task analysis and HTA

- NN/g: task analysis studies how a single user performs tasks to reach a goal. A task is "any activity that is usually observable and has a start and an end point"; a goal is the outcome, not the task (filling a form is a task, registering is the goal). Method: gather information by observing and talking with users (contextual inquiry, critical-incident interviews, diaries), then analyse number, sequence, hierarchy and complexity. The usual deliverable is a **hierarchical task analysis** (HTA) with **plans** showing how steps vary (novice versus expert, conditional steps) [V][7].
- HTA originates with Annett and Duncan (1967) for training process-control operators. It represents a goal, its subtasks and operations; **plans** state whether subtasks are sequential, parallel, conditional or iterative; decomposition stops when the source of a performance failure can be identified and a fix proposed [S][8]. A vendor guide gives a "P x C" stopping rule and 2 to 3 levels for consumer software; treat as a rule of thumb, not a standard [S][8].
- Fit for Gereo: use a light HTA only for the six key journeys in info.md and for the money-moving tasks (contribute, spend, approve, vote). Its main value is the **plans** (conditions): "if quorum not reached", "if the permission holder is the only approver", "if the provider callback is late". Those conditions are what the story acceptance criteria already hint at.

### 3.2 User flows, task flows, wireflows

Terminology varies; the working definitions in secondary glossaries agree on this: a **task flow** is one task completed similarly by all users and does not branch; a **user flow** maps a task from entry to end state including decisions and error branches; a **wireflow** embeds simplified screens in the flow [S][9]. For Gereo, use user flows with branches, one per story cluster, and add screens to the flow only once the screen inventory exists (so wireflows come after step 7, not before).

Minimum content of a Gereo flow (template in section 10): entry points (navigation, notification, SMS link, deep link), preconditions (permission, KYC tier, connectivity), happy path, every branch with the message key, whether money moved on each branch, offline behaviour, the SMS path, and exit points. WCAG items for errors and financial reversibility are in 06 section 4.5.

### 3.3 State inventories

- Scott Hurff's UI Stack names five states every screen has: ideal, empty (first use, cleared data, no search results), error, partial (sparsely populated) and loading. He recommends designing each deliberately, keeping the user's input intact on error, and showing content arriving rather than a spinner [V][10].
- NN/g on empty states: they should communicate system status (never show "No records" while still loading), provide learning cues and direct pathways [V][11].
- Gereo needs more states than these five because of money and permissions. Extend per screen: **forbidden** (no permission), **not found or no longer exists**, **pending** (money in flight), **needs attention**, **offline with last-synced**, **deadline passed**, **quorum not reached**, **limit or KYC tier reached**, **reversed**. 06 section 4.2 already lists the money states; this report adds the permission states. One inventory per screen, kept in the screen inventory (section 10).

---

## 4. Information architecture methods

### 4.1 IA versus navigation

NN/g: information architecture is the underlying structure (what content and functions exist and how they relate), documented in spreadsheets and diagrams; navigation is the visible components on top of it. IA should drive navigation choices; choosing navigation on looks alone can force a poor IA. Navigation decisions listed: usage priority, placement, pattern [V][12]. For Gereo: the object map and nested matrix are the IA; the bottom bar is only the visible tip.

### 4.2 Sitemaps

A sitemap is the hierarchical list of pages. In an OOUX flow it is derived from the object map, not drawn first. Keep it as a text outline with screen IDs (indented list), which is diffable in git and cheap for one person. Prater is explicit that the object map is not a sitemap [V][4]; do both, in that order.

### 4.3 Navigation models for a four-item bottom bar

| Pattern | Evidence | Fit |
| --- | --- | --- |
| Bottom tab bar | NN/g: persistent, recommended for roughly 4 to 5 main options; beyond 5 touch targets get too small; hidden carousels reduce discoverability [V][13]. Material 3 recommends three to five destinations [S][14]. Apple HIG page unreadable here; commonly stated guidance of 3 to 5 tabs and never hiding or disabling a tab [U] | Primary container for Gereo |
| Visible versus hidden navigation, mobile | NN/g study: navigation was used in 57% of mobile tasks when hidden against 86% with combo (visible plus hidden) navigation; hidden navigation made mobile tasks 15% slower than combo and cut content discoverability by more than 20%. With 4 or fewer top-level links, show them visibly [V][15] | Supports at most four visible bottom items with labels, as `design-foundations.md` already requires |
| Hamburger or drawer | NN/g: holds many options but least discoverable; suited to content-heavy browse sites [V][13] | Use only for low-frequency items (Settings, Help, About) if at all |
| Hub and spoke (home as menu) | NN/g: works for task-based apps where users do one task per session, but every step returns to the hub [V][13] | Partial fit: Home as a "what needs me now" hub (pending approvals, votes closing, contributions due), not as the only menu |
| Content as navigation (object relationships) | Prater: navigation emerges from nested objects; top nav is the fire escape [V][4] | The main route between group, wallet, vote, project, decision |

Observed navigation in similar products (from 08, with the original labels): Stanbic Chama navigation not documented; personal wallet plus Chama cards [V]; Splitwise three tabs Friends, Groups, Recent Activity [S, weak]; Monzo churned from 3 tabs to 5 and back to 3, then added a Grow tab [S]; YNAB tabs Home, Plan, Spending, Reflect [V partial]; Open Collective public page with Budget, Expenses, Transactions plus an admin Dashboard [V]; Loomio group page with threads, Polls, Files [V].

### 4.4 Card sorting

- Definition and types (NN/g): open (participants create and label groups; most common; reveals mental models), closed (predefined categories; for validation, but tree testing is usually recommended instead), hybrid (generally advised against because predefined categories bias). Use 30 to 50 cards. Label groups after grouping. Moderated suits qualitative insight [V][16].
- Sample sizes (NN/g, based on a 168-user study): correlation with the full-sample result was 0.75 at 5 users ("not good enough"), 0.90 at 15, about 0.93 at 20 (author's estimate), 0.95 at 30 and 0.98 at 60. Recommendation: 15 for most projects, 30 for large well-funded ones, and good results "with as few as 12" for tight budgets or hard-to-recruit users. The reason is that card sorting is generative and mental models vary [V][17]. Optimal Workshop (vendor) recommends 30 to 50 participants [V][18]. The NN/g definition page says at least 15 for qualitative studies and 30 to 50 for quantitative ones [V][16].
- Low-tech version: physical index cards, photograph each result before reuse, enter groups into a spreadsheet, build a cards-by-categories count matrix converted to percentages, standardise differently worded category names before counting, and drop weak groupings below a cutoff (one practitioner used 10%) [S][19]. An agreement score can be computed as total placements divided by (sorters times unique cards) [S][19].
- Low-literacy variant: a 2025 study with 69 disadvantaged adult learners used cards with a short text plus a representative image to include people with limited literacy [S][20]. No study found for oral sorting in emerging markets [U]. My adaptation [U]: cards with icon plus short word in Malagasy; the facilitator reads each card aloud on request; the participant sorts and then names each pile aloud; the facilitator writes the name; record with consent.
- Working in Malagasy: reuse the interpreter and consent protocol in 06 section 2.5 and 2.4. Add: pre-translate all card wording and have a second speaker check it; do not translate on the fly; record which cards participants asked to have re-read (a finding in itself); test two regions if possible, because 06 notes dialect differences are unverified [U].

### 4.5 Tree testing

- NN/g: tree testing evaluates a navigation hierarchy by having participants click through a text-only tree to find where a resource would be located. Steps: define the tree, put it in a spreadsheet (one category per row, level per column), define tasks and correct answers, test, analyse. Task types: key business tasks, sleight-of-hand tasks, problem-area tasks, label comparisons, plus an easy warm-up. Metrics: success rate, time on task, directness, incorrect selections, click order. NN/g gives no participant number; qualitative tree tests need few participants and should not be analysed with statistics; for several tree versions use a between-subjects design [V][21].
- Quantitative sample sizes are vendor conventions: Optimal Workshop says 50 to 100 participants per task [V][18]; other vendors say 30 minimum and 100 ideal [S][22].
- Success bands attributed to Albert and Tullis (98 studies) are widely repeated: above 90% excellent, 80 to 90% very good, 61 to 80% good, 41 to 60% fair, below 40% poor, with a median of 62% [S][22]. I could not reach the original; use only as a rough calibration.
- Fit for Gereo: a quantitative tree test is out of reach for one person in the field. A **moderated paper tree test with 5 to 6 participants per tree version** (consistent with NN/g's small-round logic in 06) finds structural and labelling problems, and the directness and wrong-first-click observations are the data. Do not report percentages as if they were statistics [U].

### 4.6 Labelling and naming

- NN/g on information scent: labels should be descriptive, use words the audience knows, carry their own meaning (context may be missed on small screens), and be accurate. Vague labels such as "More" have low scent; jargon hides destinations [V][23].
- Gereo specifics: icons need visible labels (06, CGAP evidence); one term per concept; the glossary (06 section 4.3) is the source of every nav label; the bottom-bar labels must be tested as words in Malagasy and French before being fixed, since "wallet", "ledger", "quorum" and "split rule" are the riskiest [U].
- WCAG 3.2.3 Consistent Navigation (AA): repeated navigation keeps the same relative order across pages unless the user changes it [V][24]. Do not reorder tabs by role or permission; see section 6.

---

## 5. When does something deserve a page?

### 5.1 Evidence

- NN/g on dialogs: modal dialogs interrupt and are justified for critical warnings that prevent irreversible errors, missing information needed to continue a user-initiated action, short steps that break up a complex task (with progress shown), and information that substantially reduces future effort. Avoid them for nonessential content, high-stakes flows such as checkout, and complex decisions that need information the modal blocks. "If it requires multiple steps to begin with, it probably justifies dedicating a full page to it" [V][25].
- Bottom sheets: Material 3 (via the Compose API reference) describes modal bottom sheets as an alternative to inline menus or simple dialogs on mobile, especially for a long list of actions or items that need longer descriptions and icons; like dialogs they block the rest of the app until dismissed [S][26]. SAP Fiori guidance: use for deep-linked supplementary content and action lists, not for complex information or notifications that require action. KLM's design system: avoid for multi-step content; use full screen for tasks central to the main flow [S][26]. I could not read the m3.material.io page itself [U].
- URLs: Nielsen's URL guidelines say URLs should be human-readable, hackable (delete the end to go up a level), persistent, and shareable (short enough not to wrap when pasted into messages; he gives 78 characters for email) [V][27].
- Android App Links are verified HTTPS deep links that open the app directly with no chooser; users without the app go to the website at the same URL, "no 404s, no errors". Verification uses an `assetlinks.json` file and a matching signing certificate [V][28]. Tricount notifications deep-link to the relevant part of the app and links open the group without a login [V from 08][29].

### 5.2 Decision rules for Gereo (proposal [U], built on 5.1)

A candidate becomes a **page** if it meets **any one** of the page triggers; otherwise use the lightest container that fits.

Page triggers:
- P1. It has an identity others point to: a notification, an SMS or a message links to it (vote, invite, expense request, transaction, event, decision, announcement).
- P2. It is an object with its own lifecycle and history (wallet, group, project, vote, expense request, transaction).
- P3. It takes more than one screen of content or more than one step to complete.
- P4. It must survive interruption: a pending payment, a half-filled plan, a vote closing tomorrow.
- P5. It moves money out or is irreversible (review and PIN are full screens, not sheets; NN/g says high-stakes flows should not be modal).
- P6. A person without an account may land on it (guest vote, invite preview).
- P7. Support or audit needs a stable reference to it (transaction receipt with reference ID).

If none applies:

| Container | Use when | Gereo examples (hypotheses) |
| --- | --- | --- |
| Bottom sheet | One decision or a pick from a list, completes in one screen, returns to the same parent, no own lifecycle, reversible | Pick wallet, filter ledger, choose reminder channel, share link options, change vote option, grant a single permission from a member row |
| Modal dialog | Critical warning or one missing piece of information, short, binary | "Leave without saving", "Did someone ask you to send this?", offline explanation for money-out |
| Inline section or expandable row | Detail that belongs to the parent and is read, not acted on alone | Rule list inside a wallet, ballot count inside a vote, RSVP list inside an event, approvals strip inside an expense request |
| Notification or toast | Result of something the person just did, or an alert that something needs them | Toast: "Contribution received". If the person must act, send a notification with a deep link to the page; never rely on a toast |
| SMS | The only channel the person has when the app is closed or the phone is basic | Reminder, receipt, vote link: always lands on a page that works without the app |

Tie-breakers: if two containers fit, choose the one with the smaller interruption. If a sheet would need a scroll or a second step, promote it to a page. If a page has no URL anyone would ever share and no state to preserve, demote it to a sheet or a section. Revisit every demotion against the lowest-end device test (small screens favour fewer layers).

Open decision D2: `design-foundations.md` lists an "amount-and-fee confirmation sheet" component, while NN/g advises against modals in high-stakes flows. Recommendation: keep the sheet as a visual component for the review step but present it as a full screen pushed in the flow so it has its own back behaviour and can be restored if the app is interrupted [U].

### 5.3 Deep links, shareable URLs, guest and limited views

Rules [U unless cited]:
- Every page-triggered object has a stable, short, human-readable path (for example `/g/{group}/votes/{id}`), persistent over time (Nielsen [V]). Keep the full URL short enough for a 160-character GSM-7 SMS (design-foundations).
- **Vote link**: the URL contains a token that grants the single permission "vote" on that vote only. It opens a minimal page (question, options, deadline, quorum progress, one button) with no bottom bar and no account creation required before the ballot; phone verification is the minimum identity step, consistent with `00-conventions.md` (voting needs only phone and OTP). After voting, offer but never require joining.
- **Invite link**: opens a limited view of the group before acceptance: name, purpose, rules or constitution, contribution plan, what joining requires. Stanbic shows invitees "a limited view" with accept and decline, and the constitution before joining [V from 08][29]. Do not make the link equal to full rights; Tricount's link-equals-full-access is acceptable for expense splitting and not for custody [V from 08][29].
- **Unauthenticated landing**: preserve the intended destination through phone and OTP and return to it afterwards (an application of WCAG 3.3.7 Redundant Entry: do not make people retype what they already entered; 06 [V]).
- **Web fallback**: a verified App Link falls back to the website for people without the app [V][28], so the web must render the guest vote, invite preview and public receipt. This also helps basic phones and low storage.
- **Link lifetimes**: tokens expire (vote close, invite expiry), can be revoked, and the expired state is a designed page, not an error.
- **Notifications deep-link to the exact item** (Tricount [V from 08]).

---

## 6. Permission-aware IA (permissions only, inherited group, project, document)

### 6.1 What other products do

| Product | Pattern | Label |
| --- | --- | --- |
| Google Drive | Viewer, Commenter, Editor, Owner. Folder access applies to everything inside; you cannot give someone less on a file than they have through the parent folder, so you change the parent or create a limited subfolder. General access: Restricted, Anyone with the link, Public [V][30]. A "You need access" page lets you request access with an optional note; the owner gets an email with the request [S][31] | [V]/[S] |
| Notion | Full access, Can edit, Can edit content, Can create, Can comment, Can view. Subpages inherit; Notion applies the broadest access a user has, so a broader grant elsewhere overrides a narrower one. A person with no access can request it; creators or editors accept or deny. Someone without database access gets an error [V][32] | [V] |
| GitHub | Read, Triage, Write, Maintain, Admin; custom roles on Enterprise Cloud [V][33]. Unauthenticated requests to private resources get 404 instead of 403 "to avoid confirming the existence of private repositories" [V][34] | [V] |
| Linear | Guests reach only issues, projects and documents in the teams they are invited to; they cannot see or discover other teams or workspace-wide features. Private teams hide issues from non-members. Integrations enabled for the workspace can expose data to guests [S][35] | [S] |
| Open Collective | Admins (change settings, approve expenses, add receipts, contribute from the balance), Core contributors (shown in Team, can create events, cannot change settings or approve expenses), Accountants (view receipts, invoices, reports, cannot change settings or approve) [V][36]. Two surfaces: a public Collective page and an admin Dashboard [V from 08] | [V] |
| Loomio | A guest invited by email sees one discussion with its comments and polls but no other discussions in the group [S][37] | [S] |
| Stanbic Chama | Role matrix: Chairperson and Treasurer pay and see invoices; Member and Mentor cannot pay; invitee sees a limited view before accepting [V from 08][29] | [V] |

### 6.2 What to show, hide or disable

Design-system guidance (three independent systems, with some disagreement):
- **Hide** what the person cannot use: Carbon's "hidden" variation removes the element entirely when the person lacks permission to view, interact or act, and it returns only if their permission changes (example: "Add member" invisible to non-owners) [V][38]. HashiCorp Helios: "When a user does not have permissions, hide the related actions, navigation items, and views"; no explanation is needed for hidden viewer-only actions; if someone lands on a page they cannot access, explain why and give a next step [V][39].
- **Avoid disabled controls**: Helios argues disabled elements cannot be focused or explained and are inaccessible to assistive technology; alternatives are to show enabled or to hide with an explanation. For non-editable values use read-only, and render unavailable links as plain text [V][39].
- **Disable with a reason** when the person needs to know why: Cloudscape uses a disabled reason (tooltip for short, text or alert for long), one sentence for what and why plus a second for next steps; its example permission wording is "This action is available for resource owner"; it also says not to show disabled items that are redundant and that users cannot enable, but hide them [V][40].
- Hiding is presentation only; authorisation must be enforced on the server (my reasoning, not stated by these sources) [U].

### 6.3 Rules for Gereo's permission-aware navigation (proposal [U], built on 6.1 and 6.2)

1. **The server decides, the interface explains.** Every action is checked server-side. The interface never relies on hiding for security.
2. **Top-level destinations are never hidden or reordered by permission.** The bottom bar is identical for everyone (WCAG 3.2.3 [V][24]). What differs is the content inside a destination. A destination with nothing for this person shows an empty state with the next step, not a missing tab.
3. **Hide actions the person has no path to and no reason to know about**, for example "Delete group" for an ordinary member (Carbon, Helios).
4. **Show with a plain reason actions that are part of a workflow the person participates in or can ask for.** Examples: an expense request awaiting "someone who can approve spending", a rule screen read-only with "Ask a member who can edit rules". The reason names the permission in everyday words and, if the person holds "view permissions", links to who holds it. This departs from Carbon's pure hide rule because in a permissions-only system any member may later be granted the permission, and members need to know whom to ask [U].
5. **Disable only for state, never for permission**, and always with a visible reason and a focusable control or a plain-text equivalent: quorum closed, deadline passed, offline (money-out), KYC tier limit (with a path to verify, because the person can fix it), balance insufficient.
6. **Four different "nothing here" states, never conflated:** (a) empty (no data yet), (b) forbidden (exists, you may not see it), (c) not found or expired, (d) not synced (offline). Each has its own wording and next step. Forbidden offers "Request access" to the people who can grant it (Drive, Notion pattern [V/S]). For objects whose existence is itself sensitive, the page is indistinguishable from not found (GitHub pattern [V][34]); decide per object type. Proposal: a private group or personal wallet does not confirm existence; a link carrying a valid invite or vote token always shows the guest view.
7. **Inheritance is visible.** Every permission-gated panel can answer "why can I do this": "From the group" or "On this project". A per-member **Effective access** panel is the tested pattern (83.6% against 56.5% accuracy, n=36, from design-foundations [V]).
8. **Decision D3 (affects IA): can a child narrow what a parent grants?** Drive and Notion do not let you give less than the parent (Drive) or apply the broadest grant (Notion) [V][30][32]. info.md only says permissions "can descend" from parent to child. If children can only widen, the effective-access panel and the nav stay simple; if they can narrow, forbidden states appear inside objects the person can otherwise see. Decide before the screen inventory is frozen.
9. **Money amounts are a separate permission (view balance, view history).** Decision D4: when a member lacks "view balance", does the wallet row show a masked amount or disappear? Recommendation: show the row with a masked amount and the reason, because disappearing wallets look like theft in a trust product [U].
10. **Guest and limited views are first-class screens** with their own inventory rows (vote guest, invite preview, public receipt), no bottom bar, no dead-end links.
11. **Permissions change live.** If access changes while the person has the app open or cached, the next server response shows "Your access changed" with the new reality; cached pages show last-synced time and never let a stale permission trigger a money action (money-out is online-only already).
12. **Design every screen for permission variants.** In the screen inventory, list the 2 to 4 permission profiles that see the screen differently (for example wallet detail: no balance, balance only, balance plus history, plus initiate spend). Each variant is a state frame (section 8).
13. **Permission changes are an audit item.** The audit log (a screen) is permission-gated, and the grant flow shows the consequence in one sentence ("Can move money up to 50 000 Ar with one more approver"; opportunity noted in 08).

---

## 7. Traceability and Definition of Ready

### 7.1 Linking stories, screens and tests

- A requirements traceability matrix (RTM) is a bi-directional mapping linking business goals to requirements, design and test cases; typical columns include requirement ID, source, priority, status, design element and test case ID; any requirement with no linked test is a coverage gap; reuse existing ticket IDs as unique IDs [S][41][42].
- Gereo already states the rule: "A story with no page and a page with no story are both defects" (`00-conventions.md` section 9). The matrix is how that rule becomes checkable.
- I found no source for putting story IDs in Figma frame names [U]. Practical convention proposed: frame name = `{ScreenID} {Screen name} / {state} / {permission variant} / {lang}`; the Figma description holds the story IDs; the matrix holds the frame link. State and variant in the name make coverage countable.
- Minimum viable matrix (one row per story, one spreadsheet or markdown table, kept in `docs/product/`): Story ID, Screen IDs, CTA IDs, Flow ID, Frames done, Test case IDs, Status. Two automated checks: stories with no screen, screens with no story.

### 7.2 Definition of Ready: evidence and cautions

- Agile Alliance: a Definition of Ready is a set of criteria, generally based on INVEST, that a story must meet before being accepted into the next iteration; it is the counterpart of the Definition of Done; it prevents starting work without clear completion criteria and gives teams a basis to push back [V][43].
- INVEST (Bill Wake, 2003): Independent, Negotiable, Valuable, Estimable, Small, Testable [S][44].
- The Scrum Guide does not define a Definition of Ready. It says Product Backlog items that can be Done within one Sprint are "deemed ready for selection" [V][45].
- Criticism: Allan Kelly argues DoR reduces agility by breaking flow, assuming role-specific handoffs, adding wait states, and undermining value-based prioritisation; readiness work goes stale and is wasted if the story is never scheduled; his alternative is to make a story ready after it is prioritised, not before [V][46]. Scrum.org posts note it can turn into a gate or a contract between developers and product owner [S][47].
- Implication for Gereo: the founder writes the stories and the pages are derived from them, so a lightweight "design-ready" checklist is useful (designing from a vague story produces invented pages). Apply it as a **pre-design lint on the stories in the current slice only**, never as a gate on the whole backlog, and never as a wait state between people (there is one person). Checklists are in section 10.

---

## 8. Sizing the work and controlling MVP scope

- Evidence is thin. A search found only vendor and agency heuristics: more than five or six core screens means the MVP is probably too big; cost tiers of 6 to 10 screens (simple), 12 to 20 (standard), 20+ (complex); estimating by counting features at 15 to 60 hours each; and one estimator who rejects screen counting because "timeline and budget most often depend not on the number of screens, but on the complexity of behavior", naming screens-and-states (empty, error, loading, no access, no slots), business logic, integrations and roles as the hidden drivers [S][48]. None of these is validated; they are sales-side heuristics.
- Better unit than "screens": **frames = screens x required states x permission variants**. A 26-screen list (`design-foundations.md` section 5) with an average of 5 required states each is about 130 state frames before permission variants and before three languages. This is arithmetic to illustrate the multiplier, not a measured figure [U].
- Rules of thumb for scope control [U, built on Patton [V][2][3]]:
  1. Cut by **flows**, not by screens: the walking skeleton is the thinnest path through contribute, ledger, notify.
  2. Anchor each release to a named outcome and a target user before choosing what goes in (Patton mistake 5).
  3. Set a **frame budget** per release derived from your own capacity (measure the real hours for the first three screens including states, then extrapolate). Any new page must cite a story ID and either displaces an existing item or moves to the next lane.
  4. Reuse before add: every new page type must fail the reuse test (can an existing page with a variant do it?).
  5. P0 pages get all states; P1 pages get happy path, empty, error and forbidden; P2 pages wait.
  6. The number of top-level destinations is fixed at four by evidence (section 4.3); everything else is contextual. Anything that wants a fifth tab is a signal the object model has a missing parent.
  7. Defer Later-module stubs (LTR) entirely: no screens, only extension points in the navigation decisions.
  8. Re-run the coverage check at each slice boundary; scope creep shows up as pages without stories.

---

## 9. How similar products structure pages and navigation (from 08 and 04, plus new sources)

| Product | Structure (as documented) | Lesson for Gereo | Label |
| --- | --- | --- | --- |
| Stanbic Chama (Kenya) | Personal wallet, Chama summary screen, Chama cards, group chat, goals, loan application. Navigation model ND. Dashboard introduced in v5.0.3. Invitee limited view before accepting; role matrix; named transaction classifications | Two scopes (personal and group) side by side; invite preview; ledger vocabulary on every row | [V] (08) |
| Open Collective | Public Collective page (Budget, Expenses, Transactions) and an admin Dashboard; three roles; 11 expense statuses | Public and admin surfaces split by permission; expense status vocabulary; but this is a role model, Gereo is permission-only, so the split would be per-object and per-action, not per-surface | [V] (08, [36]) |
| Loomio | Group page with threads, Polls tab, Files; guest sees only one discussion; vote from an email link; outcome and review date after close | Vote page as the shareable unit; guest view limited to one object; outcome statement on the page | [V]/[S] (08, [37]) |
| Splitwise | Friends, Groups, Recent Activity (weak source) | Object tabs mirror the object model (people, groups, feed); useful as a candidate shape | [S] (08) |
| Monzo | 3 tabs, then 5, then 3 with icon-only trial, then a Grow tab added; home reported cluttered | Navigation churn is a real cost; adding destinations over time without a model creates clutter; decide the four now | [S] (08) |
| YNAB | Home, Plan, Spending, Reflect; Home leads with pinned categories, goal, four-figure summary; collapsible sections | Home as "what needs me" with ranked blocks | [V partial] (08) |
| Tricount | Link-only joining; notifications deep-link to the item; offline entry | Link design and deep links; contrast with custody | [V] (08) |
| Wave Money Myanmar (CGAP deck) | Shallow home menu with shortcut labels; one question per screen | Flat navigation, action-focused menus | [V] (08) |
| Stokvel and chama apps (StokFella, Chamasoft) | Payments, claims, meetings, statements; Chamasoft redesigned three times in about five years | Meetings and fines are first-class objects in real groups; redesign churn is a warning | [V]/[S] (08) |

What no source documents: a permission-only navigation, where two members of the same group see different destinations' contents because of individually granted permissions. Open Collective, Drive, Notion and GitHub are all role or level based (even when custom roles exist). Gereo's permission-aware IA is therefore a design-risk area with little precedent [U]; plan to test it explicitly (section 10.8).

Raw 04 context to keep in mind for votes: turnout of async votes is often 2 to 20% unless embedded where people already are, and "another platform to sign in and register for" was the stated friction at Chi Hack Night (17% turnout) [S from 04]. That is the evidence behind the guest vote link in 5.3.

---

## 10. Recommended procedure for Gereo

### 10.0 Combination chosen and why

| Method | Question it answers | Decision | Reason |
| --- | --- | --- | --- |
| Story map (Patton) | What, in what order, which release | Use | Cheap, finds missing stories, controls scope; journey steps already exist |
| OOUX / ORCA | Which things, which relationships, which actions by whom, which attributes | Use as the page-derivation backbone | Object model and permissions already explicit; CTA columns become permissions |
| HTA with plans | What conditions branch each task | Use lightly for 6 journeys and money tasks | Feeds error branches; skip full decomposition elsewhere |
| User flows with error branches and state inventory | How each flow proceeds and fails, state by state | Use for every P0 story cluster | Trust-critical, already required by 06 |
| Sitemap (text outline) | Page hierarchy | Use, derived from objects | Diffable in git |
| Card sorting (open, paper, 12 participants) | Labels and groupings in users' words | Use, small and focused on labels | NN/g: 12 acceptable under budget constraints; unusually important for Malagasy terms |
| Tree testing (paper, moderated, 2 versions) | Whether the structure is findable | Use qualitative; skip quantitative | 50 to 100 per task is not feasible |
| Hub-and-spoke | Home as menu | Partial: Home as "what needs me" | NN/g: fine for task apps, costs a step per task |
| Closed or hybrid card sort, quantitative tree test, big surveys | | Skip for MVP | Sample size and tooling |

### 10.1 Steps in order

Step 0. **Freeze the vocabulary.** Glossary v0 in three languages (06 section 4.3) and the permission names in `00-conventions.md` section 7. Artifact: `glossary` table. Done when every noun used in stories is in the glossary.

Step 1. **Lint the stories of the current slice** against the design-ready checklist (10.5). Artifact: story register (one row per story). Fix or park every story that fails.

Step 2. **Build the story map** (backbone, tasks, stories, release lanes, system lane). Artifact: `03-story-map.md`. Done when every story sits in exactly one column, every task has at least one story, and each release lane has a named outcome.

Step 3. **Object map and nested object matrix.** Extract nouns from the stories, reconcile with the 26 objects, classify each as page-worthy or part-of (hypothesis table below), and record relationships and nesting including the user-or-group ownership. Artifact: `04a-object-map.md`. Done when every object has a parent, a lifecycle and a source story.

Step 4. **CTA matrix with permissions as columns.** Extract verbs from stories and acceptance criteria. Reconcile with the permission table: list CTAs with no permission and permissions with no CTA. Artifact: `04b-cta-matrix.md`. Done when both gap lists are empty or explicitly justified (business-rule only).

Step 5. **Attribute matrix** for page-worthy P0 objects only. Artifact: `04c-attribute-matrix.md`. Ranked attribute order becomes the on-screen priority order, and the "visible to" column feeds the permission variants.

Step 6. **Task analysis and flows.** HTA with plans for the six info.md journeys plus spend, approve and vote; then a flow spec per story cluster with error branches. Artifact: `05-flows/{FLOW-ID}.md`. Done when every branch names its message key and says whether money moved.

Step 7. **Derive the screen inventory** by applying the page triggers (5.2) to the object map and flows, then run the coverage check both ways (stories to screens, screens to stories). Artifact: `04d-screen-inventory.md` (replaces the "Pages" placeholder in each story). Done when no story lacks a screen and no screen lacks a story, and each screen has its state list and permission variants.

Step 8. **Navigation.** Write the sitemap outline from the inventory; fill the navigation decision table; resolve decisions D1 (context model), D3 (narrowing), D4 (masked balance). Artifact: `04e-navigation.md`. Done when exactly four bottom destinations are chosen with labels in the glossary, or the open candidates are listed for testing.

Step 9. **IA tests** (10.8): open paper card sort for labels, then paper tree test of two navigation candidates; revise; freeze navigation v1. Artifact: IA test report (2 pages).

Step 10. **Wireframes** with frame naming and state frames, low-fi prototype, test round A (06 weeks 3 to 4). Artifact: Figma frames plus the traceability matrix.

Step 11. **Maintain traceability** and re-run the checks at each slice boundary; review build-ready checklist (10.6) per screen at handoff.

Rough effort for steps 0 to 8 [U]: 6 to 8 working days for the MVP slice, with the AI assistant drafting matrices from the stories and the founder reviewing every row; steps 9 and 10 follow the field schedule in 06.

### 10.2 Artifact templates (concrete columns)

**Story map** (spreadsheet or markdown, one row per story; the visual map is generated from it):

| Story ID | Journey step (1 to 8) | Backbone activity | Task (verb phrase) | Actor | Permission needed | Release lane (skeleton / MVP / later) | Priority (P0 to P2) | Outcome served | Tags (legal-gate, sms, offline, ledger, audit) | Depends on | System lane? (Y/N) |

**Object map** (one row per object) plus nested matrix:

| Object | Definition (one sentence, glossary words) | Owner or parent | Core content (always shown) | Metadata (sort or filter) | Lifecycle states | Relationships (verb, cardinality, target) | Page-worthy? (Y/N + trigger P1 to P7) | Rank order on screen | Source stories |

Nested object matrix: objects on both axes; cell = relationship verb and cardinality (for example Group contains 0..n Project; Wallet receives 0..n Ledger entry); mark inherited-permission edges with an arrow.

Hypothesis classification of the 26 objects [U, to be confirmed in step 7]:

| Likely page or flow | Likely part of a parent | Likely list item or setting |
| --- | --- | --- |
| Group, Wallet, Transaction (receipt), Contribution plan, Vote, Project, Decision, Event, Document, Expense request, Announcement, Identity check (flow), Support ticket, Membership (member detail with Effective access), Wallet rule (builder flow; detail P1) | Ledger entry (child of Transaction), Contribution (due item, enters the pay flow), Ballot, Approval, RSVP, Task | Notification (deep-links elsewhere), Device (in Account safety), Audit entry (permission-gated list), User (profile and settings), Campaign (later) |

**CTA matrix** (one row per object-verb pair):

| CTA ID | Object | CTA (verb phrase) | Actor type (member / permission holder / guest / system) | Permission required (name from section 7) or "none" or "business rule" | Trigger (user / system / schedule) | Preconditions and states | Moves money? | Needs approval or vote? | Surfaced as (page / sheet / modal / inline / notification) | SMS path? | Offline? | Ledger or audit effect | Story IDs |

**Attribute matrix** (one row per attribute of a page-worthy object):

| Object | Attribute | Type and unit (integer ariary, date, enum, text) | Source (user input / system / provider) | Required? | Editable by (permission) | Visible to (permission) | Shown on (screen IDs) | Sort or filter? | Rank | Message key | Example value |

**Screen inventory** (one row per screen or container):

| Screen ID | Name (glossary term) | Container (page / flow step / sheet / modal / inline / guest page) | Object(s) | Purpose (one line) | Story IDs | CTA IDs | Entry points (nav, notification, SMS, deep link) | URL pattern and token? | Permission to view | Permission variants | Required states (empty, loading, partial, error, forbidden, not found, offline, pending, deadline passed, quorum not reached, limit or tier reached) | Parent and nav location | Release lane | Priority | Frames (links) | Status |

**Navigation decision table** (one row per candidate destination, including the rejected ones):

| Destination | Level (bottom tab / in-page / top bar / overflow) | Objects it exposes | Stories served | Frequency (daily / weekly / monthly, from interviews) | Who has content here (permission profiles) | Label candidates (mg / fr / en) | Rule when empty for this person | Badge rule | Evidence (card sort result, tree test result) | Decision and rationale |

Candidate structures to test in step 9 [U]:

- A: Home | Wallets | Groups | Me, with the inbox as a bell in the top bar.
- B: Home | Wallets | Groups | Inbox, with Me behind the avatar.
- Entity context question D1: either the Wallets and Groups tabs list personal and group items together (object-first), or a context switcher chooses person or group first (entity-first). Stanbic shows personal wallet and group cards on one surface [V from 08]. Test with tasks that cross both scopes.

**Flow spec** (one file per flow; step table plus branch table):

Header: Flow ID, name, story IDs, actor and permission, entry points, preconditions (permission, KYC tier, connectivity), exit points, related flows.

| Step # | Screen ID and state | User action | System response | Ledger or audit effect | Notification or SMS (message key) | Next step |

| Branch ID | At step # | Trigger (error or alternative) | Screen ID and state shown | Message key | Money moved? (yes / no / unknown) | Recovery action | Logged where | Story AC reference |

Plus a final "offline and SMS" paragraph and "open questions".

### 10.3 Decision rules: page versus sheet versus modal versus inline versus notification

Apply in this order, stop at the first yes (proposal [U], from 5.1 and 5.2):

1. Does a notification, SMS or message link to it, or will anyone share its URL (P1, P6, P7)? Page.
2. Is it an object with its own lifecycle or history (P2)? Page.
3. Does it move money out, or is it irreversible (P5)? Page or full-screen flow step; the confirmation may look like a sheet but is a screen.
4. Does it need more than one screen or step, or must it survive interruption (P3, P4)? Page or flow.
5. Is it one reversible decision or a pick from a list, completed in one screen and returning to the same parent? Bottom sheet.
6. Is it a critical warning or one missing piece of information, short and binary? Modal dialog.
7. Is it detail read in the context of the parent? Inline section.
8. Is it a result or an alert? Toast for a result; notification with a deep link if the person must act; SMS if they may not have the app open.

Never use a toast or a sheet as the only place a person can learn something that costs money. Never stack a sheet on a sheet.

### 10.4 Rules for permission-aware navigation (summary of section 6.3)

1. Server enforces; interface explains.
2. The four bottom destinations are identical for everyone and never reordered.
3. Hide actions with no path and no reason to know (Carbon, Helios).
4. Show with a plain reason actions that belong to a workflow the person is part of or could be granted, naming the permission in everyday words and whom to ask.
5. Disable only for state, with a reason; never for permission.
6. Four distinct nothing-here states: empty, forbidden (with request access), not found or expired, not synced.
7. Show where a permission comes from, and keep a per-member Effective access panel.
8. Decide whether children may narrow parents (D3) before freezing the inventory.
9. Decide masked versus hidden amounts for people without "view balance" (D4); default to masked with reason.
10. Guest and limited views are first-class screens with no bottom bar.
11. Re-check permissions on every server response; stale cache never authorises a money action.
12. List permission variants per screen and design each as a frame.

### 10.5 Definition of Ready for stories (design-ready)

A story enters design when all of these are true (apply to the current slice only, as a lint, not a gate [U]; see 7.2):

1. Format follows `00-conventions.md` section 6 and uses message keys, not hard-coded text.
2. One actor named from section 3, and one permission (or "none") from section 7.
3. Verb-phrase task identified in the story map, with journey step and release lane.
4. Trigger and preconditions stated, including KYC tier and connectivity assumptions.
5. 6 to 10 acceptance criteria; if more, split (INVEST Small [S][44]).
6. Happy path, business rules (limits, thresholds, quorum), and each state (empty, loading, pending, failed, offline) are testable (INVEST Testable).
7. Errors state what the person sees, whether money moved and the next action.
8. Notifications: push, SMS or none, with message keys.
9. Ledger and audit entries listed for anything that changes money or permissions.
10. Objects read or written listed with their glossary names.
11. Dependencies by story ID, and no unresolved `legal-gate` that blocks the story's wording.
12. Evidence cited in the Conversation, and open questions listed with an owner.

### 10.6 Definition of Ready for screens (build-ready)

A screen is build-ready when all of these are true:

1. Screen ID, name from the glossary, container type chosen by the 10.3 rules, and at least one story ID (and every story ID listed is covered).
2. Entry points listed, including notification, SMS and deep-link entries, and the unauthenticated landing behaviour.
3. URL pattern and token rule defined if the screen is a page trigger P1, P6 or P7.
4. Permission to view and every permission variant listed, each with a frame.
5. All required states have frames (empty, loading, partial, error, forbidden, not found or expired, offline with last-synced, pending, plus screen-specific ones) with message keys.
6. All CTAs reference CTA IDs, with their permission, preconditions and the container they open.
7. Attribute rank order and formats applied (`12 500 Ar`, absolute and relative time for deadlines).
8. Strings exist as keys in Malagasy, French and English, checked for 200% expansion and GSM-7 safety for SMS content (06).
9. Accessibility notes: touch targets at least 48 dp, status not by colour alone, focus order, screen-reader labels (06).
10. Performance notes: route weight budget, no blocking images, ledger paginated (06).
11. Tested at least once in a prototype session with the two or three tasks that touch it, with findings closed or ticketed.
12. Traceability row complete: frames linked, flow ID, test case IDs.

### 10.7 Test plan for the IA

Goal: confirm that the labels are understood, the four destinations are findable, and permission variants do not create dead ends.

**Stage 1. Open card sort (labels and groupings).**
- Method: moderated, in person, paper cards, open sort, groups labelled after sorting [V][16]; spoken on request.
- Cards: 30 to 40 [V][16], each an object or a task in glossary words (Malagasy first, French second), icon plus short word; include the Gereo-specific nouns (group wallet, contribution, split rule, ledger, vote, quorum, decision log, expense request, effective access).
- Participants: 12 (NN/g's acceptable minimum under tight recruiting [V][17]): 4 ordinary members, 4 permission holders or founders, 4 individual budgeters, drawn from the founder's group plus at least two outside groups (06 recruiting rule). Pay as in 06. Treat results as qualitative: use the count matrix as a pointer, not as a statistic.
- Capture: photograph each layout, record group names verbatim, note cards the participant asked to have re-read, analyse in a spreadsheet [S][19].
- Output: label shortlist and grouping hypotheses for step 8; glossary updates.

**Stage 2. Paper tree test (findability of two navigation candidates).**
- Method: printed tree, moderated, think aloud; one tree version per participant (between-subjects [V][21]). Two versions (A and B in 10.2). Tree labels in Malagasy with French shown on request.
- Participants: 6 per version, at least 2 permission holders per version (12 total, can be the same recruitment pool as stage 1 but not the same people).
- Tasks: 12 to 14 tasks, spoken, with one warm-up. Mix key tasks, problem-area tasks, and tasks that cross personal and group scope (the D1 question). Suggested tasks:
  1. See how much money the group has right now.
  2. Pay this month's contribution.
  3. Find out who has paid and who is late.
  4. Vote on a proposal you received by SMS.
  5. Find what the group decided last month about the roof.
  6. Ask for money for a purchase for the project.
  7. Approve a payment someone asked for.
  8. Change how incoming money is split.
  9. See why 40 000 Ar moved to savings.
  10. Invite a new member.
  11. Find out who is allowed to approve spending.
  12. Tell the group about the meeting on Saturday and see who is coming.
  13. Check your own personal savings goal.
  14. Report a payment that left your account but did not arrive.
- Measures: first click, final answer, directness, backtracks, hesitation, who needed the task re-read [V][21].
- Success threshold (my rule, anchored to the Albert and Tullis bands [S][22] but adapted to tiny samples [U]): a task passes when at least 5 of 6 participants reach the correct location without help (83%, the "very good" band) and at least 4 of 6 on first click. A task failing 3 or more of 6 forces a relabel or restructure. The chosen version needs at least 11 of 14 tasks passing and no failed money-moving task. Report counts ("5 of 6"), not percentages.

**Stage 3. Permission-variant walkthrough (expert review, no participants).**
- For each P0 screen, walk each listed permission variant and check the 12 rules in 10.4 and that the forbidden, not found and empty states are distinct. Use two reviewers (founder and the AI assistant) because one evaluator under-finds problems (06) [U].
- Pass: every variant has a next step and no dead end.

**Stage 4. First-click and comprehension on the low-fi prototype** within test round A (06): the same navigation tasks plus comprehension probes on the bottom bar labels ("what do you expect to find under this word?"). Pass: no label is misread by 2 or more of 6 participants.

Re-run Stage 2 (shorter, only failed tasks) after any structural change, in a second small round, following the "several small rounds" logic in 06 [V].

---

## Sources

[1] NN/g, User-Story Mapping. https://www.nngroup.com/articles/user-story-mapping/ (read)
[2] Jeff Patton and Associates, The New Backlog. https://www.jpattonassociates.com/the-new-backlog/ (read)
[3] Jeff Patton and Associates, 5 story mapping mistakes. https://jpattonassociates.com/5-story-mapping-mistakes/ (read)
[4] Sophia Prater, Object-Oriented UX (A List Apart). https://alistapart.com/article/object-oriented-ux/ (read)
[5] Fundament, Introduction to Object-Oriented UX (ORCA stages). https://www.fundament.design/p/introduction-to-object-oriented-ux (read; secondary explainer). Also https://medium.com/design-bootcamp/introducing-orca-the-third-diamond-in-your-ux-process-23a1babb0389 (403, search excerpt only)
[6] InfoQ podcast summary, Object-Oriented UX with Sophia Prater. https://www.infoq.com/podcasts/object-oriented-ux-sophia-prater/ ; ORCA series https://ooux.com/hi/orcaseries (search excerpts only; ooux.com pages returned 403 or 404)
[7] NN/g, Task Analysis. https://www.nngroup.com/articles/task-analysis/ (read)
[8] Hierarchical task analysis background: https://www.uxmatters.com/mt/archives/2010/02/hierarchical-task-analysis.php ; https://www.koji.so/docs/task-analysis-ux-research ; Annett 2003 PDF https://mycourses.aalto.fi/pluginfile.php/1689946/mod_folder/content/0/annett2003%20Hierarchical%20Task%20Analysis.pdf (search excerpts only)
[9] Task flow, user flow and wireflow definitions: https://uxplanet.org/ux-glossary-task-flows-user-flows-flowcharts-and-some-new-ish-stuff-2321044d837d ; https://maze.co/resources/glossary/user-flow/ ; https://slickplan.com/blog/wireflow (search excerpts only)
[10] Scott Hurff, UI Stack. https://www.scotthurff.com/posts/why-your-user-interface-is-awkward-youre-ignoring-the-ui-stack/ (read)
[11] NN/g, Designing Empty States in Complex Applications. https://www.nngroup.com/articles/empty-state-interface-design/ (read)
[12] NN/g, Information architecture versus navigation. https://www.nngroup.com/articles/ia-vs-navigation/ (read)
[13] NN/g, Mobile navigation patterns. https://www.nngroup.com/articles/mobile-navigation-patterns/ (read)
[14] Material Design 3, Navigation bar. https://m3.material.io/components/navigation-bar/guidelines (overview only, three to five destinations)
[15] NN/g, Hamburger menus and hidden navigation hurt UX metrics. https://www.nngroup.com/articles/hamburger-menus/ (read)
[16] NN/g, Card Sorting: Uncover Users' Mental Models. https://www.nngroup.com/articles/card-sorting-definition/ (read)
[17] NN/g, Card Sorting: How Many Users to Test. https://www.nngroup.com/articles/card-sorting-how-many-users-to-test/ (read)
[18] Optimal Workshop, How many participants you need for reliable results. https://support.optimalworkshop.com/en/articles/9679633-how-many-participants-you-need-for-reliable-results (read; vendor)
[19] Card-sort analysis, paper method: https://uxmatters.com/mt/archives/2010/09/dancing-with-the-cards-quick-and-dirty-analysis-of-card-sorting-data.php ; https://libguides.massgeneral.org/UXTools/cardsorting ; https://courses.isds.tugraz.at/iaweb/projects/ws2023/blum-2024-01-30-card-sorting-analysis-techniques.pdf (search excerpts only)
[20] Card sorting with adult learners, text plus image cards (2025). https://www.tandfonline.com/doi/full/10.1080/02601370.2025.2462163 (search excerpt only)
[21] NN/g, Tree Testing. https://www.nngroup.com/articles/tree-testing/ (read)
[22] Tree test sample sizes and Albert and Tullis bands: https://www.uxbeam.com/tree-testing/how-it-works ; https://www.lyssna.com/guides/tree-testing-guide/ ; https://www.switas.com/articles/card-sorting-tree-testing-first-click-testing-choice (search excerpts only; vendor and practitioner sources)
[23] NN/g, Information Scent. https://www.nngroup.com/articles/information-scent/ (read)
[24] W3C, Understanding SC 3.2.3 Consistent Navigation. https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html (read)
[25] NN/g, Modal and Nonmodal Dialogs. https://www.nngroup.com/articles/modal-nonmodal-dialog/ (read)
[26] Bottom sheet guidance: Compose Material 3 reference https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-modal-bottom-sheet.html ; SAP Fiori https://www.sap.com/design-system/fiori-design-android/v26-4/components/system-components/bottom-sheet/usage ; KLM https://design.klm.com/latest/components/bottom-sheet/usage-BbiVuOqR (search excerpts only; m3.material.io page not readable)
[27] NN/g, URL as UI. https://www.nngroup.com/articles/url-as-ui/ (read)
[28] Android Developers, About Android App Links. https://developer.android.com/training/app-links/about (read)
[29] Earlier raw report [08-competitor-ux-comparison.md](08-competitor-ux-comparison.md) (Stanbic Chama FAQ, Tricount help and release notes, Open Collective docs, Loomio docs, Monzo, YNAB, Wave Myanmar CGAP deck; see that file for the original URLs and labels)
[30] Google Drive Help, Share files from Google Drive. https://support.google.com/drive/answer/2494822 (read)
[31] Google Docs Help, access requests. https://support.google.com/docs/answer/14743550 ; https://support.google.com/docs/answer/16722399 (search excerpts only)
[32] Notion, Sharing and permissions. https://www.notion.com/help/sharing-and-permissions (read)
[33] GitHub Docs, Repository roles for an organization. https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization (read)
[34] GitHub Docs, Troubleshooting the REST API (404 instead of 403 for private resources). https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api (read)
[35] Linear docs, Members and roles, Private teams, guest accounts changelog. https://linear.app/docs/members-roles ; https://linear.app/docs/private-teams ; https://linear.app/changelog/2022-07-14-guest-accounts (search excerpts only)
[36] Open Collective docs, Core contributors. https://docs.opencollective.com/help/collectives/core-contributors (read; docs carry a banner that some pages are out of date)
[37] Loomio, guests and direct discussions. https://www.loomio.com/docs/en/user_manual/discussions/direct_discussions ; https://www.loomio.com/d/WmcJB5lR/new-feature-invite-people-directly-into-a-thread-or-decision (search excerpts only)
[38] Carbon Design System, Disabled states. https://carbondesignsystem.com/patterns/disabled-states/ (read)
[39] HashiCorp Helios, Show, hide, and disable. https://helios.hashicorp.design/patterns/disabled-patterns (read)
[40] Cloudscape, Disabled and read-only states. https://cloudscape.design/patterns/general/disabled-and-read-only-states/ (read)
[41] Traceability matrix overviews: https://www.baeldung.com/cs/rtm-software-development ; https://miro.com/templates/traceability-matrix-by-rizwan-khawaja/ (search excerpts only)
[42] Traceability matrix in testing, unique IDs and gaps: https://www.drizz.dev/post/traceability-matrix-in-testing (search excerpt only)
[43] Agile Alliance, Definition of Ready. https://www.agilealliance.org/glossary/definition-of-ready/ (read)
[44] INVEST criteria (Bill Wake, 2003, "INVEST in Good Stories, and SMART Tasks"): https://concepts.dsebastien.net/concept/invest-criteria/ ; https://innolution.com/resources/glossary/invest/ (search excerpts only; original article text not read)
[45] Scrum Guide. https://scrumguides.org/scrum-guide.html (read)
[46] Allan Kelly, Definition of Ready considered harmful. https://www.allankelly.net/archives/category/requirements/page/3/ (read)
[47] Scrum.org discussions on Definition of Ready. https://www.scrum.org/node/12275 ; https://www.scrum.org/node/83868 (search excerpts only)
[48] MVP scoping and screen-count heuristics (vendor and agency blogs, not validated): https://www.rapidnative.com/tools/mvp-scope-calculator ; https://qazaqsoft.kz/en/blog/mobile-development/mobile-app-mvp-minimum-features ; https://thinkmobiles.com/blog/mvp-mobile-app-cost/ (search excerpts only)
