# 06 - Design process for Gereo: frameworks, low-budget research, design system, trust-critical flows, multilingual, and an 8-week plan

Research date: 2026-10-19. Scope: which design processes and methods fit Gereo's context (Madagascar, low-end Android, expensive data, Malagasy/French/English, mixed literacy, one founder-developer plus an AI assistant), and how to run them cheaply.

Claim labels:
- [V] verified in this session at a primary or official source (page or PDF actually read).
- [S] secondary (search-result snippet, blog, vendor, news, or a primary source I could only see through a summary).
- [U] unverified: my own synthesis, common practice, or recollection. Treat as hypothesis.

Numbers in brackets such as [10] point to the Sources list at the end.

Caveats about the research itself:
- Several primary pages could not be read in this session (designkit.org returned 403, GSMA "5 tips for inclusivity" returned 403, nngroup incentives page returned 404). Where that matters it is stated.
- I found no dedicated "GSMA mobile money UX design guideline" document and nothing usable on Bankable Frontier Associates. The closest verifiable financial-inclusion design sources are CGAP (read in full text) and the Medhi et al. TOCHI paper (read in full text).
- Nothing found is specific to Madagascar for UX research method choices; Madagascar facts below are context, and method advice is transferred from other low-resource markets.

---

## 0. Context facts that constrain the process

| Fact | Label | Source |
|---|---|---|
| Unique mobile internet penetration 14.3% in 2025; 22.5M mobile connections end of 2025 | [S] (GSMA press release, seen via search snippet) | [39] |
| 6.60M internet users, 20.4% penetration at start of 2025 (DataReportal) | [S] | [39] |
| Smartphone ownership 24% per one news item; the brief's "~9% of adults" figure could not be reproduced. Treat smartphone share as uncertain and verify before using in a deck | [S]/[U] | [39] |
| Facebook is about 84% of social media page views (StatCounter, Aug 2025); about 4.7M Facebook users (NapoleonCat, Sep 2025). Implication: Messenger/Facebook is the likely contact channel for recruiting; WhatsApp reach is not established by these sources | [S] | [39] |
| Adult literacy about 77.5% in 2022 (World Bank/UNESCO series) | [S] | [40] |
| 1 GB of mobile data averaged about USD 1.12 in 2023, cheapest plan USD 0.32 (Cable.co.uk via Statista); minimum wage cited as about USD 50/month in 2021 | [S] | [48] |
| Android Go targets entry-level phones; minimum RAM is 512 MB up to Android 10, 1 GB for Android 11-12, 2 GB for Android 13 | [V] | [20] |
| The existing web app is React 19, TanStack Router, Tailwind v4, Base UI, lucide-react, two variable fonts (Geist, Lexend); no i18n library is installed yet | [V] (local `web/package.json`) | local |
| The founder's own group already exists and is the stated test group | [V] | local |

Process implications:
1. Real users are scarce online, so field research (in person, on paper, on borrowed phones) outranks remote analytics.
2. Data cost makes any video-based remote method expensive for participants; budget airtime or data into incentives.
3. The founder's own group is a convenient first cohort but a biased one (insider, motivated, not representative); the process must add at least two outside groups.
4. Malagasy literacy and digital literacy are heterogeneous; test comprehension of words and concepts, not only tap targets.

---

## 1. Core frameworks and when each applies

### 1.1 Double Diamond (Design Council)

- Four phases: Discover, Define, Develop, Deliver; each diamond has a divergent then a convergent step. Launched 2004 as a "clear, comprehensive and visual description of the design process"; now the core of a Framework for Innovation with four principles: put people first, communicate visually and inclusively, collaborate and co-create, iterate [V][1].
- The Council itself states "This is not a linear process" and that prototyping early can be part of discovery [V][1].
- Fit for Gereo: use as the skeleton and vocabulary for the whole 8 weeks (Discover = weeks 1-2, Define = end of week 2, Develop = weeks 3-6, Deliver = weeks 6-8 and beyond). It is a map, not a method set; it does not tell you how to interview or test.

### 1.2 Lean UX (Gothelf and Seiden)

- Cycle: state desired outcomes, declare assumptions, write hypotheses ("we believe [outcome] will be achieved if [users] achieve [user outcome] with [feature]"), design an experiment, build the smallest MVP that tests it, then build-measure-learn [S][5]. I did not read the book; wording of the hypothesis template varies across sources.
- Fit for Gereo: strong. It replaces heavy documentation with assumption lists and cheap experiments, which suits one person plus AI. Use it for the rolling backlog: each risky assumption (for example "members will trust the ledger if they can see per-member contributions", "members understand quorum") gets a paper or clickable test.
- Limit: Lean UX assumes you can measure behaviour post-launch; with few smartphone users in the sample, qualitative signal will dominate and metrics will be thin.

### 1.3 Jobs-to-be-Done (JTBD)

- Premise: people "hire" products to make progress; the classic illustration is Christensen's milkshake case (commuters hiring a milkshake for a long boring drive). Practice has diverged: Ulwick's Outcome-Driven Innovation versus the Moesta/Christensen interview approach, and Ulwick publicly disputes the milkshake framing [S][6]. I could not read the HBR article (paywalled summary only).
- Fit for Gereo: use as an interview lens and a backlog format, not a full methodology. Gereo's pain table already reads like jobs (see the balance after contributions, run a vote without a meeting, remind everyone about an event). Write 8-12 job stories ("When ..., I want to ..., so I can ...") and use them to prioritise MVP scope. The repo has a `job-stories` skill available for this.
- Caution: jobs framing finds motivations well but says nothing about comprehension or literacy barriers; it needs usability testing alongside.

### 1.4 Design Sprint (GV) and compressed versions

- The GV sprint is five days (Monday map and target, Tuesday sketch, Wednesday decide and storyboard, Thursday prototype in one day, Friday five customer interviews), for "teams of any size" [V][2].
- Design Sprint 2.0 (AJ&Smart with Jake Knapp) is a four-day version in which the full team is needed only two days; team of 4-12 [S][3][4].
- I found no official solo or two-person version. A practitioner account notes Knapp said a sprint "probably won't be as effective without a team" [S][4]. Any solo sprint is therefore an adaptation, not a method.
- Recommended adaptation for one person plus AI [U]: a 2-day "mini-sprint" on the single riskiest flow (member contributes, balance updates, everyone notified, plus the async vote with quorum): Day 1 map, sketch 3 alternatives, pick one; Day 2 build a clickable prototype and run 3-5 short sessions the same week. The AI assistant can act as sketch-critic and as "devil's advocate" expert, but cannot replace the customer day. Use the founder's own group as sprint "experts".
- When not to use: for broad exploration of unknown needs (use interviews first) or for polishing screens.

### 1.5 Human-Centered Design for financial inclusion

IDEO.org Field Guide / Design Kit
- Field Guide to Human-Centered Design launched April 2015, evolved from the 2009 HCD Toolkit, with 57 methods and a free PDF at designkit.org [V][7]. (A search snippet elsewhere says 54 methods on the website; the count differs by edition [S].)
- Co-Creation Session: 1-3 hours, convene the people you design for and bring them into the process, using role play and rapid prototyping [S][8].
- Ethics: the Little Book of Design Research Ethics, 2nd edition, has five principles (respect, responsibility, honesty, inclusion, evolution) and covers "affirming ongoing consent" and shared credit in participatory design [V][9].

CGAP "Insights into Action: What Human-Centered Design Means for Financial Inclusion" (Seltzer and McKay, 2014; read in full text)
- Seven HCD projects in eight countries with banks, MNOs and an insurance intermediary; design partners included IDEO.org, IDEO.com, Continuum and Grameen Foundation's AppLab [V][10][11]. (The CGAP web page itself gives inconsistent counts, "eight projects in seven countries" versus "seven projects in eight countries" [V][12]; the report says seven projects, eight countries.)
- Ten insights [V][10]: (1) poor people save, in many forms; (2) goals are short-term; (3) cash works, it is about control; (4) people trust people more than organisations; (5) distrust of banks is prevalent; (6) communities pool resources; (7) social networks drive financial and technological awareness; (8) people are uncomfortable or fearful of new technology; (9) the need for safety is context specific; (10) fees do not hurt when the service works.
- Nine design principles [V][10]: design for trust; talk like people talk; offer benefits now; help people maximise their money; build consistent support into the system; give the customer control; community counts; design for concrete goals and dreams; offer limits, not temptations.
- Method pattern [V][11]: learn from customers through in-depth interviews lasting several hours, using board games and role play to replicate real financial behaviour; synthesise immediately after each interview; "how might we" brainstorms; cheap disposable prototypes (sketches, flashcards, an ATM mock-up on an iPad) tested with customers and made progressively more polished.
- A prototype test that matters directly for Gereo: an ATM screen reading "Enjoy your money!" was rejected by a participant who wanted "Are you SURE you want to withdraw this money from your project?" [V][11]. This is evidence that microcopy on money-leaving moments must be tested.
- A relevant analogue: a "digital susu" concept in Ghana (daily small collection by a trusted collector) was explored with animated flashcards [V][11]. Rotating savings and group-collection practices in Madagascar are the equivalent to study; the specific local forms I have not verified [U].
- Honest limits stated by CGAP: HCD "did not solve implementation challenges" and was not a magic bullet [V][11][12].
- CGAP Customer-Centric Guide collection (last updated 2019) is organised as Why Go Customer-Centric, Learn from Customers, Design Solutions, Organize for Delivery; tools are provider-oriented (banks, telcos) and heavy for a one-person team [V][13]. Cherry-pick the research and prototype sections.

GSMA / MicroSave / Grameen / Bankable Frontier
- GSMA has HCD-based work (for example Burundi mobile money user journeys with personas and journey maps [S][15]) and a mobile money API specification that MVola adopted (reported compliant September 2023) [S][17]. I found no GSMA UX design standard for mobile money apps. The page "5 Tips for Inclusivity in Human-Centred Design" could not be read (403) [16].
- MicroSave's Mi4iD approach combines HCD and behavioural economics and argues HCD failures come from neglecting supply-side and market realities [S][18]. Grameen Foundation (AppLab) was a CGAP HCD partner [V][11]. Bankable Frontier Associates: nothing found [U].

### 1.6 Google Next Billion Users / Build for Billions

- Developer guidance groups advice into five areas: connectivity (optimise images, networking, data transfer), device capability (screen sizes, backward compatibility, memory), data cost (app size, configurable network settings), battery, and UI and content (responsive UI, localise) [V][19]. The page gives no numeric thresholds; it says to research your market and treat categories as guidelines [V][19].
- Android Go is a configuration of mainline Android for low-RAM phones; several features are disabled by default (picture-in-picture, draw-over-apps, multi-window) [V][20].
- Google's own research summaries (NBU team) were available only as secondary descriptions [S][49]; the design philosophy line "build for Mumbai, not Mountain View" is secondary.
- Fit: use as a constraint checklist (Section 4.5) rather than a process.

### 1.7 Service design and journey mapping

- Journey map: one actor, one scenario, phases, actions, mindsets, one emotion line, opportunities; one map per point of view [V][25].
- Service blueprint: customer actions, frontstage, backstage, support processes, evidence; lines of interaction and visibility; suited to services with internal dependencies [V][26].
- Fit for Gereo: a journey map for "monthly contribution cycle" (reminder, pay via mobile money, confirmation, ledger update) and one service blueprint for the same cycle, because the experience depends on things the UI cannot show: the mobile money operator, provider callbacks, SMS delivery, and the group treasurer's manual actions today. The blueprint is where the "pending/unknown payment" states come from.

### 1.8 Which framework, when (summary)

| Question | Use |
|---|---|
| How do we structure the weeks? | Double Diamond |
| What do users hire Gereo for? | JTBD interview lens, job stories |
| Which assumptions can kill the product? | Lean UX assumption list and experiments |
| What is the right design for the hardest flow? | 2-day mini-sprint (adapted) |
| How do poor and low-literacy users think about money, trust, saving, groups? | CGAP/IDEO field methods |
| What breaks behind the screen? | Journey map plus service blueprint |
| What technical limits must the design obey? | Build for Billions checklist, performance budget |

---

## 2. Low-budget research methods valid in Madagascar

### 2.1 Method menu with suitability

| Method | What it is | Fit | Label |
|---|---|---|---|
| Guerrilla / discount usability | Simplified think-aloud tests with real users, paper mock-ups, notes as the data, no lab or video; best cost-benefit at 3-5 users per round | Excellent | [V][23] |
| In-person test on borrowed or participant's phone | Participant uses a clickable prototype or coded preview on a real low-end handset | Best, since NN/g says in-person is preferred whenever feasible and remote is the fallback | [V][24] |
| Intercept testing | Approach people at a market, bus stop, mobile money agent kiosk; 10-15 minutes; a task and two questions | Good for first-run comprehension of words and screens; weak for group dynamics | [U] |
| Paper prototype / printed screens | Printed or hand-drawn screens with a human "computer" | Excellent for flow and terms with low-literacy participants; no data cost; CGAP used sketches, flashcards and mock-ups | [V][11] |
| Contextual interview / homes and shops | Several-hour conversations, role play, "show me where you keep the money" | The highest-value discovery method; CGAP's Mexico example led to a product from seeing where cash is stored | [V][11] |
| Co-design workshop with an existing association | 1-3 hours with 6-10 members of an existing group; role play contributions, votes, disputes; rapid prototyping on paper | Excellent because Gereo targets groups; also a recruitment route | [S][8] |
| Diary study via WhatsApp or SMS | Daily prompts and replies for about a week | Plausible: a South African study used WhatsApp for recruitment and prompting over two weeks in low-resource settings [S][45]; a 10-workday semi-automated WhatsApp diary was rated positively by participants but was not a low-income African sample [S][45]. Reach in Madagascar for WhatsApp is not established; Facebook/Messenger or SMS may be better | [S]/[U] |
| Remote moderated test over WhatsApp call | Voice call while participant uses the prototype; screenshots or short screen recordings sent back | Useful as fallback only; NN/g notes higher no-show rates, difficulty reading silence, and need for tool rehearsal [V][24]. Video is data-expensive | [V]+[U] |
| Remote unmoderated | Participant alone | Poor fit here (no real-time help, unclear instructions) | [V][24] |
| Card sorting / quantitative studies | | Needs 15-20 participants per NN/g, so skip for MVP | [V][22] |
| Heuristic evaluation | Experts review against a small set of heuristics; several evaluators find more | You plus the AI assistant can run a pass, but a single evaluator under-finds problems | [V][23] |
| Live operator / voice | Medhi et al.: live operator was up to 10x more accurate than text for health data; graphical UI had highest task completion for mobile banking | Informs design recommendations rather than method | [V][14] |

### 2.2 Sample sizes

- NN/g: about 5 users find roughly 85% of usability problems in a first study; one user reveals about 31%; spend budget on several small rounds ("3 studies with 5 users each") rather than one big study; the model holds only for comparable users, and with several distinct groups test 3-4 per group (at least 3 per group when there are three or more) [V][22]. The article dates from 2000 and the model from 1993 [V][22].
- For Gereo's three segments (individual budgeter, ordinary group member, permission-holder such as a treasurer) that implies 9-12 per round to cover all segments. For one person, run segments in separate rounds: Round A 3-4 members plus 3 permission-holders on the low-fi prototype; Round B 5-6 mixed on a hi-fi coded prototype [U].
- Remember the model assumes problems are detectable by task observation; trust and comprehension issues may need more probing, not more participants [U].

### 2.3 Recruiting and incentives

- Recruit through trusted intermediaries. CGAP found "community counts" and that people trust people more than organisations [V][10]; a warm introduction from an association leader will beat cold approach. Start with the founder's group, then 2-3 outside groups from different settings (for example a market-sellers' association, a church or youth group, a savings circle or cooperative) [U].
- Avoid recruiting only the literate and connected; screen for phone type and for whether they have ever used mobile money (Medhi et al. recruited by a taxonomy of age, environment and phone experience [V][14]).
- Incentives. The best primary precedent: Medhi et al. paid participants with talk-time cards "roughly equivalent to half a daily wage" for those with phones and store gift cards for those without, after consulting intermediary organisations to set the mode and amount [V][14]. Vendor norms of USD 50-100/hour are US-based and not transferable [S][50]. Recommended: pay in airtime or mobile money, equal to about half a local day's wage, plus data or airtime for the call if remote, and disclose it up front [U]. Paying through mobile money is itself a chance to observe the real payment flow.
- Do not make the incentive depend on giving positive feedback, and do not offer product benefits as payment.

### 2.4 Ethics and consent

- IDEO's principles: respect, responsibility, honesty, inclusion, evolution; explicit emphasis on shifting power to participants and on ongoing consent [V][9].
- Low-literacy consent: institutional guidance treats oral consent as the way to include people who can understand but cannot read the form; competence and literacy are separate; an impartial witness is typically recommended, who is not a team member or a relative; recordings and a mark in place of a signature are common; rules vary by country and institution [S][46]. For a design study with no IRB, adapt it: read the consent script aloud in the participant's language, ask them to restate it, record verbal consent if they agree to audio, and repeat consent before recording and before showing any personal data [U].
- Data protection: Madagascar has Law 2014-038 on personal data protection; sources describe an opt-in/consent model and an authority (CMIL) whose operation was delayed, with a decree in 2023 (decree number 2023-1541 per one source) [S][41]. I could not verify details from the official text. Practical rules for research: never use participants' real balances or contacts in prototypes; use fictional names and amounts; store recordings and notes under a pseudonym and delete audio after transcription [U].
- Money-specific research ethics: never have participants perform real transactions in a prototype; if testing the real payment path, use test-mode accounts [U].

### 2.5 Working in Malagasy: translation and interpreter bias

- Cross-language qualitative research shows interpreters can modify questions and answers, take over the interviewer or respondent role, and silence meaning; reflexivity about the interpreter's position is recommended [S][44].
- For UX sessions [U]: (a) interview in Malagasy yourself where you are fluent; (b) otherwise use a trained interpreter who has agreed to translate word for word and not to help or explain; (c) record with consent and have a second person translate 20% of the recording to check drift; (d) pre-write and pre-translate the task cards and key terms so the interpreter is not improvising wording of the test itself; (e) match interpreter to participant (age, region, gender, social position) to avoid deference.
- Dialect: official Malagasy and regional dialects differ; I did not verify the extent for UI text. Test a draft with participants from at least two regions before fixing the glossary [U].
- Term testing example from CGAP: "to save" (ahorrar) was understood as "excess money", while people said "to put aside" (apartar), so product vocabulary changed [V][10]. Do the same for Gereo's key words (wallet, contribution, quorum, split rule, ledger, pending).

### 2.6 Literacy-aware testing

Evidence-based points [V][14]:
- Textual interfaces were unusable by first-time low-literacy users; no low-literacy user completed tasks in the tested text-based mobile banking UIs; graphical interface had the highest task completion in banking; spoken dialog was faster for those who understood it.
- Recommended design features: graphical cues, voice annotation, local-language support in text and audio, minimal hierarchy, no non-numeric text input where avoidable, no scrolling menus, minimal soft-key mapping, and human mediators to introduce users to the UI [V][14].
- Caveat: the studies used feature phones, SMS and USSD in 2009-2011; transfer to smartphone apps is an inference [U].
- Icons are not universal; a GSMA piece reportedly notes that farmers read icons literally [S][15]. CGAP says literal language and clear photos or illustrations beat icons and abstraction where illiteracy is a barrier [V][10]. Always pair icons with a text label and test them.

Test protocol additions [U]:
- Task cards are spoken, not read; give participants a way to answer without writing.
- Include a comprehension probe per key screen: "what does this number mean?", "what will happen if you press this?", "who can see this?".
- Do not assess the participant; assess the design. Tell them so.
- Keep sessions to 30-40 minutes; allow breaks; offer a neutral third-party seat for women or older participants if they prefer.
- Test with the participant's own phone where possible (their keyboard, language, font size, screen condition).

---

## 3. Design-system process

### 3.1 Principles

- Atomic design is a mental model (atoms, molecules, organisms, templates, pages), not a linear process or a CSS architecture; teams may rename the terms; pages (real content) are where the system is stress-tested [V][38]. For Gereo use three levels in practice: primitives and tokens, components, patterns (for example "contribution row", "vote card", "ledger entry").
- Tokens: the Design Tokens Community Group format reached first stable version 2025.10 [V][36]. Style Dictionary v4 has first-class DTCG support but does not yet fully support 2025.10 (planned for v5) [V][37]. Recommended token tiers: primitive (raw values), semantic (role-based such as text-primary, surface, danger, money-in, money-out), component (only when needed) [U].
- Figma variables: types are color, number, string, boolean, plus timing and easing; a collection holds variables and modes; modes can express light/dark, languages/locales and device sizes; variables can alias other variables of the same type; a collection can hold up to 5,000 variables [V][33].

### 3.2 Plans and limits that affect the process (as of the help pages read)

| Item | Value | Label |
|---|---|---|
| Starter plan | one team, one folder, three files; no variable modes listed; no Dev Mode or Code Connect | [V][32] |
| Professional | up to 10 modes per collection; Dev Mode and Code Connect included | [V][32] |
| Organization | up to 20 modes per collection | [V][32] |
| Enterprise | unlimited modes with extended collections | [V][32] |
| Older forum posts claim 4 modes on Professional/Organization | outdated relative to the help page | [S] |
| Code Connect needs a Dev or Full seat on Professional, Organization or Enterprise; Professional is limited to one active library and one active framework | [V][34] |
| Figma MCP desktop server needs a Dev or Full seat on a paid plan; remote server writes outside drafts need a Full seat; remote write-to-canvas free during beta then usage-based | [V][35] |

Implication: light/dark modes plus language modes plus a code-synced workflow require at least a Professional plan. The Starter plan's three-file limit is too tight for FigJam plus design plus library. I did not verify plan prices; check before committing [U].

### 3.3 Component documentation and versioning

Recommended minimum per component [U]: purpose and when not to use it; anatomy; states (default, hover, focus, active, disabled, loading, error, empty); sizes; content rules (max length, truncation, plural, RTL not needed); accessibility notes (role, keyboard, touch target 24x24 minimum, contrast); props mapping to code; example with real Malagasy and French strings; changelog entry.
Versioning: semantic versions on the library; publish from a "library" Figma file with a branch for risky changes; changelog in the repo; keep tokens in a single file in the repo and generate Figma variables from it or the reverse, never both directions at once [U].

### 3.4 Figma-to-code handoff and keeping them in sync

- Code Connect maps production components to Figma components so Dev Mode shows real code. Recommended approach is framework-agnostic `.figma.ts` template files; legacy integrations exist for React, HTML frameworks, SwiftUI and Jetpack Compose. Mappings can be published through the CLI or the UI (GitHub integration), and CLI-created connections are editable only in the CLI [V][34].
- The Figma MCP server lets agents extract variables, components and layout from Figma and generate code, uses Code Connect to reuse real components, and can write native content back to the canvas [V][35]. Tools for this are available in this environment (`get_design_context`, `get_variable_defs`, `search_design_system`, `use_figma`, `generate_figma_design`, Code Connect tools).
- Because Gereo already has coded components (Textarea, ThemeToggle, Timeline, Toast, Tooltip and others per the git log), the practical path is code-to-Figma first for the existing set (rebuild as a Figma library through the MCP), then Figma-first for new patterns, then Code Connect for mapping [U]. Decide on one source of truth per layer: tokens in the repo, component anatomy in Figma, behaviour in code.
- Sync discipline [U]: no component is added to Figma without a code counterpart or a ticket; no component changes in code without a Figma update; a monthly drift check (compare variables against CSS variables with `get_variable_defs`).

### 3.5 Recommended order of work

1. Research (discover): interviews and observation, journey map, job stories.
2. Define: problem statement, principles, scope (MVP cut), assumption list.
3. Flows: user flows and task flows with error branches (FigJam).
4. Wireframes: grayscale, real text, mobile first (Figma).
5. Low-fi clickable prototype: paper or Figma, 5-6 sessions.
6. Usability test and synthesis; fix.
7. Hi-fi design using the existing design-system components; add missing components.
8. Design-system completion: tokens, variables with modes, documentation.
9. Second test on a coded prototype on a real low-end device.
10. Handoff: Code Connect, specs, content table, acceptance checks.

Design-system work should run alongside from step 4 (tokens decided early) but formal documentation waits until after the first test, so it is not rewritten [U].

---

## 4. Designing financial and trust-critical flows

### 4.1 Threat and risk-based UX review (method)

This is a synthesis of common practice; the specific lists are my own [U]. For each flow, answer: what can go wrong, who could cause it (honest mistake, attacker, abusive insider), how bad is it, how will the user know, how can they recover.

Threat list to review for Gereo [U]:
- Wrong recipient or wrong wallet; wrong amount (Ariary has large numbers; separators matter).
- Duplicate payment from double tap on a slow network; retry after timeout.
- Payment state unknown (operator accepted but callback not received) versus failed versus pending; users will assume the worst.
- Rule changes by a permission-holder that alter the split (insider abuse); retroactive changes; hidden changes. Counter: every rule change appears in the ledger and notifies all members, with a visible effective date.
- Vote manipulation: quorum edge cases, vote changes after deadline, an absent member counted as abstention; make quorum math visible.
- Phishing and impersonation (fake group invites, fake "treasurer" requests); SMS-based scams.
- Shared or lost phone; shoulder surfing; screenshots of balances; notification previews exposing amounts.
- Privacy in a transparent ledger: what do members see about each other's contributions and personal wallets? Separate personal wallet visibility from group wallet visibility.
- Coercion: social pressure when everyone sees who has not contributed.

Evidence anchors: CGAP found distrust of banks, fear of new technology and a need for control, and recommends transparency, showing pricing up front and giving users a real-time window into their money [V][10].

### 4.2 Error-state inventory

For every screen that moves or displays money, list: empty, loading (slow network), partial load, offline, error (validation), error (server), error (provider/operator), timeout, pending, success, success-but-delayed, reversed, expired, permission denied, quorum not reached, deadline passed, limit exceeded (the 100,000,000 Ar ceiling), duplicate, conflict (two people edit a rule). Capture in a FigJam table: state, trigger, what the user sees, what the user can do, what is logged, message text key, and which language variants exist. WCAG 3.3.1 requires errors to be identified and described in text; 3.3.4 requires financial submissions to be reversible, checked or confirmed [V][27]. CGAP's "Are you SURE you want to withdraw" example is the model for confirmation wording [V][11].

### 4.3 Content design and microcopy process

1. Write a glossary of 20-30 domain terms first (wallet, contribution, split rule, ledger, vote, quorum, pending), with approved Malagasy, French and English forms and one example sentence each; test terms with users (Section 2.5).
2. Write the content table in a spreadsheet or Figma string variables (Section 5) before hi-fi design.
3. Voice rules: literal, concrete, specific amounts and dates, no jargon ("talk like people talk" [V][10]), same word for the same thing everywhere.
4. Money moments get three-part copy: what will happen, what it costs, how to undo or get help.
5. Test copy as part of usability tests (read aloud, then ask the participant to say it back).
6. Version copy with the design; every string has a key and an owner.

### 4.4 Legal and compliance checkpoints

Not legal advice; checkpoints for the compliance owner [U unless noted]:
- E-money: Law 2016-056 on electronic money and e-money institutions is the base law; CSBF (attached to the central bank) supervises; instructions on agents, governance and special accounts exist (2017, 2018, 2020 per a list I could not cross-check) [S][42]. Banking Law 2020-011 also touches electronic financial services [S][42].
- Personal data: Law 2014-038; consent and purpose; data minimisation; retention; cross-border transfer limits [S][41]. Decide where data is stored and what the privacy screen says before building onboarding.
- Group money collection: whether a group wallet that holds members' contributions is a regulated activity depends on the provider model; confirm [U].
- Terms and consent screens must be in the user's language (Malagasy plus French) and written in plain language; checkpoint at the start of hi-fi (Week 5) and again before launch.
- Fees and limits must be visible before commitment (CGAP: show pricing up front, be transparent [V][10]).

### 4.5 Accessibility review checkpoints (WCAG 2.2 AA)

Verified WCAG 2.2 criteria relevant to Gereo [V][27][28][29]:
- 2.5.8 Target Size (Minimum), AA: pointer targets at least 24 by 24 CSS px, with exceptions for spacing, equivalents, inline, user-agent and essential [V][28]. Recommendation: design to 44-48 px on mobile as a project rule [U].
- 2.5.7 Dragging Movements, AA: any drag must have a single-pointer alternative [V][27]. Relevant to reordering split rules or sliders for percentages.
- 3.3.7 Redundant Entry, A: do not make users retype information already entered in the same process [V][27].
- 3.3.8 Accessible Authentication (Minimum), AA: no cognitive function test unless an alternative or mechanism exists; one-time codes must be pasteable and fillable; split OTP boxes that only accept the first digit on paste fail; a PIN handled by the device OS is not treated as a cognitive test, but a site-set PIN the user must remember is [V][29]. Design the OTP and PIN screens accordingly (single field with `autocomplete="one-time-code"` is a common approach [U]).
- 3.3.1 Error Identification (A), 3.3.2 Labels or Instructions (A), 3.3.4 Error Prevention (AA) for financial data [V][27].
- 3.1.1 Language of Page (A) and 3.1.2 Language of Parts (AA): set page language and mark language changes, which matters for mixed Malagasy/French content [V][27].
- 3.2.6 Consistent Help (A): help in the same place [V][27 summary].
- 4.1.1 Parsing removed in 2.2 [V][27].
- Colour contrast (1.4.3 at 4.5:1 and 3:1 large text), non-text contrast (1.4.11), resize text (1.4.4), reflow (1.4.10), text spacing (1.4.12): I could not read these in the excerpt; their levels and thresholds are as commonly documented [U]. Verify at the spec before relying on them.

Checkpoints by phase [U]: (1) wireframes: touch targets, focus order, reading order, error placement; (2) hi-fi: contrast of both light and dark themes, states, 200% text scale; (3) coded: keyboard and screen reader pass, Lighthouse accessibility, test with large system font on a real phone; (4) release: manual run through the top 5 tasks with TalkBack on Android [U].

### 4.6 Performance budgets as a design constraint

- A budget is "a set of limits imposed on metrics that affect site performance"; types are quantity-based, milestone timings, and rule-based scores. web.dev's defaults: under 5 s Time to Interactive and under 170 KB of critical-path resources compressed on a baseline device and 3G network; example budgets include under 170 KB JavaScript on a product page and interactive in under 5 s on slow 3G on a Moto G4; enforce in the build with Lighthouse CI, bundlesize or webpack and re-measure with real-user data [V][21]. These are starting values, based on an older device baseline.
- Google's Build for Billions categories (connectivity, device capability, data cost, battery, UI/content) give the review checklist [V][19]; Android Go sets the RAM floor of the target devices (512 MB-2 GB depending on version) [V][20].
- Proposed Gereo budgets [U]: initial route at most 170 KB compressed JS and under 5 s TTI on throttled slow-3G with 4x CPU slowdown; each additional route lazily loaded; total fonts under about 60-100 KB per language set (subset latin plus latin-ext; check that Malagasy diacritics render in the chosen fonts; the current stack loads two variable fonts, which is a cost to review [V local]); icons tree-shaken; no hero images; skeletons rather than spinners; no optimistic UI for money (show pending, never fake success).
- Design implications: fewer fonts and weights, system-font fallback, one-column layouts, avoid heavy illustrations, compress and size-limit uploaded images, paginate the ledger, send small payloads, design for poll or push with SMS fallback.
- Budget numbers should be set as design acceptance criteria, in the design brief, before wireframes (Week 2) [U].

---

## 5. Process for multilingual products (Malagasy / French / English)

### 5.1 Content strategy

- Choose a source language for strings. The codebase uses English; code content must remain English per project rule, so English keys and English source text, with French and Malagasy as translations [V local rule / U decision]. The conversational language of the team is French; terminology decisions should still be taken in Malagasy and French with users, not derived from English [U].
- Default and fallback: default to the language chosen at onboarding, with a visible language switch on every screen; fall back Malagasy to French to English per key (never show raw keys) [U].
- Mixed language is normal in speech; do not expect users to want a pure language. Test whether French loan terms are better understood than Malagasy coinages for finance words [U].
- Dialect and register: official Malagasy versus regional speech; test two regions [U].

### 5.2 Text expansion in layouts

- W3C/IBM guidance: shorter source strings expand more; average expansion by English length: up to 10 chars 200-300%, 11-20 chars 180-200%, 21-30 chars 160-180%, 31-50 chars 140-160%, 51-70 chars 151-170% (as published), over 70 chars 130% [V][30].
- Layout rules from the same article: flexible containers, no fixed-width tight squeezes, check short labels beside fields and in tabs first, do not abbreviate to fit, avoid gaps from short translations, allow extra line height [V][30].
- Malagasy and French strings are often longer than English in my experience; no measured Malagasy expansion figure was found [U]. Use pseudo-localisation (strings padded 40-100%) in Figma and in the app, and design buttons and labels to wrap instead of truncate. Use Figma string variables with language modes to preview copy fit: Figma documents modes for languages/locales and string variables [V][33].
- Numbers and currency: format Ariary consistently (grouping, symbol position) per locale; verify that `Intl.NumberFormat` and date formatting behave on target Android WebView versions for the `mg` locale [U].

### 5.3 Plurals and grammar

- CLDR plural rules: Malagasy (`mg`) cardinal categories are `one` (n = 0..1) and `other`; French (`fr`) is `one` for 0 and 1 (i = 0,1) [V][31]; other French categories (for example a `many` category for large round numbers) were not checked in the rows I read [U]. Use ICU MessageFormat or equivalent so the translator can express plural forms per language [U].
- Avoid string concatenation; give translators whole sentences with named placeholders and context notes.

### 5.4 Translation workflow

Suggested pipeline for a one-person team [U]:
1. Extract strings to keys (introduce an i18n library in the web app before hi-fi; none is installed yet [V local]).
2. Build or maintain the glossary and a style guide (tone, formality, how to address the user, number formats).
3. Machine pre-translation by the AI assistant for drafts only; mark as unreviewed; a native speaker reviews every Malagasy string (AI Malagasy quality is not verified; treat as low-trust) [U].
4. Review in context with screenshots; a second reviewer or a user check for money-critical strings; back-translate critical strings (balance, pending, cancel, confirm, vote result) to check meaning [U].
5. Lock strings per release; track untranslated and changed strings; fail the build on missing keys.
6. SMS and push copy are separate content types with length limits (SMS segment size, GSM-7 versus Unicode encoding affects cost); write SMS in the plainest possible language and check character encoding for diacritics [U].
- Set the `lang` attribute per page and per passage [V][27].

### 5.5 Plain-language writing

- ISO 24495-1:2023 is the plain-language standard; it lists governing principles starting with "readers get what they need (relevant)" and "readers can easily find what they need (findable)"; it focuses on text, gives its examples only in English, and does not cover accessibility (refers to WCAG) [S][47]. I could not confirm the wording of the remaining principles from the catalogue pages; the standard is paywalled.
- Rules to adopt [U]: one idea per sentence; verbs first for actions ("Pay 10,000 Ar"); amounts, dates and deadlines explicit; define unusual words once; say what happens next; avoid negations and double negatives; same term per concept; test comprehension by having users restate the message.
- No Malagasy plain-language guideline was found; build a short style guide from user testing [U].

---

## 6. Deliverables checklist

Discover and define
- [ ] Research plan (questions, segments, sample, consent script, incentive, interpreter protocol)
- [ ] 10-15 field conversations or observations with notes (pseudonymised)
- [ ] Insight board in FigJam (affinity clusters)
- [ ] 2-3 proto-personas (member, permission-holder, individual) based on research
- [ ] Journey map: monthly contribution cycle; second map: vote cycle
- [ ] Service blueprint: contribution cycle (including operator and SMS)
- [ ] 8-12 job stories and a prioritised MVP scope
- [ ] Assumption list with risk ranking (Lean UX)
- [ ] Design principles (5-7) and design brief including performance and accessibility budgets
- [ ] Glossary draft (Malagasy, French, English)

Design
- [ ] Information architecture and navigation map
- [ ] User flows with error branches for 6 key journeys listed in the brief
- [ ] Error-state inventory table
- [ ] Wireframes for MVP screens (mobile first, 360 px baseline) with real strings
- [ ] Low-fi clickable prototype (or paper kit) and test script
- [ ] Round A test report (3 pages: findings, severity, changes)
- [ ] Hi-fi screens in light and dark modes
- [ ] Round B test report on a coded prototype on a real low-end phone
- [ ] Content table in three languages with keys and owners

Design system
- [ ] Token inventory (primitive and semantic) in a single source file
- [ ] Figma library with variables, modes (theme, language), component set mirroring the coded set
- [ ] Component docs (usage, states, a11y, content rules)
- [ ] Code Connect mappings for the top components
- [ ] Changelog and versioning rule

Quality and compliance
- [ ] Threat and risk table for each money flow
- [ ] Accessibility checklist run on top 5 tasks (WCAG 2.2 AA items from Section 4.5)
- [ ] Performance budget results (Lighthouse on throttled profile, bundle report)
- [ ] Legal and compliance sign-off items (licence perimeter, privacy, terms text) with owner and date
- [ ] Translation review sign-off for money-critical strings

Handoff
- [ ] Annotated flows and states per screen
- [ ] Acceptance criteria per feature including error states, copy keys and budgets
- [ ] Open questions and known gaps list

---

## 7. Suggested 8-week design plan for the MVP

Assumptions: one person full time on design and product with an AI assistant; access to the founder's group plus 2-3 outside groups; a paid Figma Professional seat (needed for modes and Dev Mode) [V][32]; the coded components already exist. Weeks 7-8 can compress into 6 weeks if usability results are clean. Estimated effort assumes 4-5 working days per week.

| Week | Focus | Deliverables | FigJam artifacts | Figma artifacts | AI assistant role |
|---|---|---|---|---|---|
| 1 | Discover: plan and field start | Research plan, consent script (oral, Malagasy and French), recruiting list (founder's group plus 2-3 outside groups), assumption list, glossary v0; 5-6 field conversations (home or place of work, including the group's current manual process) | Assumption map; research plan board; interview notes template | Audit page: list existing coded components and tokens | Draft interview guide, consent text, glossary seeds; transcribe only with consent; do not feed raw personal data without pseudonymisation |
| 2 | Discover and define | 5-6 more conversations including one co-design session with an association; synthesis; journey map (contribution cycle) and service blueprint; job stories; MVP cut; design principles; design brief with performance and accessibility budgets | Affinity board; journey map; service blueprint; job-story board; principles | Token inventory page (colors, type, spacing from code); start Figma variable collections (primitives) | Help cluster notes; draft job stories; propose budgets; flag contradictions across interviews |
| 3 | Flows and wireframes | Flows with error branches for contribute, vote, create group, split revenue; error-state inventory v1; IA; wireframes (grayscale, 360 px) for MVP screens with real strings in three languages | Flows; error inventory table; IA map | Wireframe pages; strings as Figma string variables with language modes for fit checks | Generate flow permutations and missing states; generate pseudo-localised and translated strings for fit checks |
| 4 | Low-fi prototype and Round A test | Clickable low-fi prototype plus printed paper kit; test script with comprehension probes; Round A: 6 sessions (3 members, 3 permission-holders) in person on borrowed or own phones; synthesis; fix list | Test plan; observation grid; severity board | Low-fi prototype flows; v2 wireframes | Synthesis of notes; prioritise fixes; do not substitute for sessions |
| 5 | Hi-fi core and design system | Hi-fi for the top 4 flows in light and dark; semantic tokens and Figma variables (theme and language modes); component library mirrored from code; missing components added; microcopy v1 reviewed by a native Malagasy speaker; compliance checkpoint 1 (terms, privacy, copy limits) | Content review board; compliance checklist | Hi-fi screens; library file with variables, modes, component sets | Build library through the Figma MCP; draft Malagasy and French copy for human review |
| 6 | Round B prep and coded prototype | Coded prototype in the existing React app with fake data, deployed to a preview URL and tested on a real low-end device; performance budget run; accessibility pass (WCAG items); Round B: 5-6 sessions; synthesis; fixes | Test plan; accessibility and performance results board | Revised hi-fi; annotated states | Wire fake data; run Lighthouse and axe-style checks; list failures |
| 7 | Complete and document | Remaining screens (events, projects, decision journal, settings); empty/error/pending states; full content table in three languages with keys; component documentation; Code Connect mappings for top components; change log; compliance checkpoint 2 | Final flows; release scope | Final hi-fi; docs page; Code Connect | Generate component docs from code and Figma; produce string key diffs |
| 8 | Handoff and buffer | Handoff pack: annotated screens, acceptance criteria (states, copy keys, budgets, accessibility), open questions; final accessibility and performance review; retrospective; plan for post-launch learning (what to measure, who to interview in the first month) | Retrospective; learning plan | Handoff page; library version 1.0 published | Generate acceptance criteria; check sync between Figma variables and code tokens |

Notes on realism [U]:
- Fieldwork is the bottleneck, not tooling; book recruiting in Week 1 and use the founder's group early to unblock.
- If the user count is too low for Round B, run it as a second co-design session with a group instead of individual tests.
- Cut order if time slips: Code Connect mappings, then dark mode refinements, then extra screens; never cut the two test rounds or the error-state inventory.
- Keep the AI use to synthesis, drafting, generation and checking; every Malagasy string and every consent conversation needs a human.

---

## 8. Recommended process for Gereo

1. Skeleton: Double Diamond over 8 weeks, with an explicit decision gate after each diamond (end of Week 2: scope and brief; end of Week 6: hi-fi approved for build) [1].
2. Discovery: CGAP/IDEO-style field conversations with real money behaviour, role play and paper prompts rather than surveys; use JTBD only as the interview lens and as job stories for the backlog [10][11][6].
3. Concept validation: Lean UX assumption list with cheap tests; one adapted 2-day mini-sprint on the contribution-plus-ledger-plus-notification flow and a second on the async vote with quorum [5][2].
4. Testing: small rounds of 5-6 in person (NN/g), separate rounds per segment, on real low-end phones, using printed and clickable prototypes; remote WhatsApp voice sessions only as fallback with airtime support [22][24].
5. Literacy: graphical cues plus text plus voice-ready content; term testing for every money word; no text-only critical step; oral consent; interpreter protocol [14][10][46][44].
6. Trust-critical flows: threat table, error-state inventory (including pending and unknown), confirmation copy tested in sessions, explicit rule-change and quorum visibility in the ledger [10][11].
7. Compliance: privacy decision and copy limits before hi-fi; second review before launch [42][41].
8. Accessibility: WCAG 2.2 AA items from Section 4.5 as acceptance criteria, with real-device TalkBack and large-font checks [27][28][29].
9. Performance: budgets in the brief (170 KB JS, 5 s TTI on slow 3G as starting values), enforced in the build [21][19][20].
10. Multilingual: English keys, human-reviewed Malagasy and French, glossary first, pseudo-localisation, ICU plurals, `lang` attributes [30][31][27].
11. Design system: tokens in the repo (DTCG-compatible), Figma variables with theme and language modes on a Professional plan, library mirrored from the existing coded components, Code Connect for key components, one source of truth per layer [36][37][33][32][34].
12. Ethics: IDEO's five principles as the research ground rules; incentives in airtime or mobile money at about half a local day's wage; pseudonymised data [9][14].

Open questions to resolve early:
- Whether WhatsApp or Messenger is the dominant channel for the target groups.
- Which Malagasy register and glossary to use; whether the product needs audio guidance in the MVP or only in a later phase.
- Figma plan and budget.

---

## Sources

[1] Design Council, Framework for Innovation / Double Diamond. https://www.designcouncil.org.uk/our-resources/framework-for-innovation/ (read)
[2] GV, The Design Sprint. https://www.gv.com/sprint/ (read)
[3] SessionLab, Design Sprint 2.0 template. https://www.sessionlab.com/templates/design-sprint-2-0 (read; vendor)
[4] Frontiers Design blog, The Design Sprint 2.0. https://design.frontiersin.org/blog/2018/10/26/the-design-sprint-20-what-is-it-and-what-does-it-look-like (search snippet only); solo-sprint account and Knapp comment surfaced via search of ee.linkedin.com/in/laura-eiche (secondary)
[5] University of Edinburgh website communications blog on Lean UX hypothesis statement. https://blogs.ed.ac.uk/website-communications/?p=1797 (search snippet only; the book itself not read)
[6] JTBD background: https://customerthink.com/?p=46611 ; Ulwick critique https://strategyn.com/2013/01/16/market-segmentation-is-soured-by-milkshake-marketing/ ; HBR https://hbr.org/2016/09/know-your-customers-jobs-to-be-done (paywalled summary only)
[7] IDEO, Design Kit post. https://ideo.com/post/design-kit (read)
[8] Design Kit, Co-Creation Session method. https://www.designkit.org/methods/co-creation-session.html (search snippet; designkit.org direct fetch returned 403)
[9] IDEO, new edition of the Little Book of Design Research Ethics. https://www.ideo.com/journal/a-new-edition-of-the-little-book-of-design-research-ethics (read)
[10] CGAP, Insights into Action (PDF, full text read). https://www.cgap.org/sites/default/files/CGAP_Insights_into_Action_final.pdf
[11] CGAP, Brief: Designing Customer-Centric Branchless Banking Offerings (PDF, full text read). https://www.cgap.org/sites/default/files/Brief-Designing-Customer-Centric-Branchless-Banking-Offerings-Dec-2013.pdf
[12] CGAP publication page. https://www.cgap.org/research/publication/what-human-centered-design-means-for-financial-inclusion (read)
[13] CGAP Customer-Centric Guide collection. https://www.cgap.org/topics/collections/customer-centric-guide (read)
[14] Medhi et al., Designing Mobile Interfaces for Novice and Low-Literacy Users, ACM TOCHI 18(1), 2011 (PDF, full text read). https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ToCHI2711_Medhi.pdf
[15] GSMA, Burundi mobile money user experience (HCD, journeys). https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/blog/enhancing-the-user-experience-of-mobile-money-enabled-cash-recipients-spotlight-on-burundi/ (search snippet only)
[16] GSMA, 5 Tips for Inclusivity in Human-Centred Design. https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/region/africa/5-tips-for-inclusivity-in-human-centred-design/ (403, not read)
[17] GSMA, MVola Madagascar case study for the Mobile Money API. https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/mvola-madagascar-a-case-study-for-the-gsma-mobile-money-api-and-open-platforms/ (search snippet only)
[18] MicroSave Mi4iD. https://www.microsave.net/mi4id/ ; https://medium.com/@MicroSave/why-does-research-matter-in-human-centered-design-3a27aee8f879 (search snippets)
[19] Android, Build for Billions. https://developer.android.com/build-for-billions (read)
[20] Android Go edition. https://developer.android.com/guide/topics/androidgo (read)
[21] web.dev, Performance budgets 101. https://web.dev/articles/performance-budgets-101 (read)
[22] NN/g, Why You Only Need to Test with 5 Users. https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ (read)
[23] NN/g, Guerrilla HCI. https://www.nngroup.com/articles/guerrilla-hci/ (read)
[24] NN/g, Remote usability tests. https://www.nngroup.com/articles/remote-usability-tests/ (read)
[25] NN/g, Journey Mapping 101. https://www.nngroup.com/articles/journey-mapping-101/ (read)
[26] NN/g, Service blueprints. https://www.nngroup.com/articles/service-blueprints-definition/ (read)
[27] W3C, WCAG 2.2. https://www.w3.org/TR/WCAG22/ (partially read; guideline 1.4 text not reached)
[28] W3C, Understanding 2.5.8 Target Size (Minimum). https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (read)
[29] W3C, Understanding 3.3.8 Accessible Authentication (Minimum). https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html (read)
[30] W3C Internationalization, Text size in translation. https://www.w3.org/International/articles/article-text-size.en.html (read)
[31] Unicode CLDR, Language plural rules chart (v46). https://www.unicode.org/cldr/charts/46/supplemental/language_plural_rules.html (read, rows for mg and fr)
[32] Figma, plans and features. https://help.figma.com/hc/en-us/articles/360040328273-Figma-plans-and-features (read)
[33] Figma, overview of variables, collections and modes. https://help.figma.com/hc/en-us/articles/14506821864087-Overview-of-variables-collections-and-modes (read)
[34] Figma, Code Connect. https://developers.figma.com/docs/code-connect/ (read)
[35] Figma, MCP server. https://developers.figma.com/docs/figma-mcp-server/ (read)
[36] Design Tokens Community Group. https://www.designtokens.org/ (read)
[37] Style Dictionary, DTCG support. https://styledictionary.com/info/dtcg/ (read)
[38] Brad Frost, Atomic Design, chapter 2. https://atomicdesign.bradfrost.com/chapter-2/ (read)
[39] Madagascar digital context: GSMA press release https://www.gsma.com/newsroom/press-release/gsma-digital-reforms-could-connect-1-12-million-more-people-in-madagascar-and-add-mga-4-1-trillion-to-gdp-by-2031/ ; DataReportal 2025 via https://www.scribd.com/document/941687707/Digital-2025-Madagascar-DataReportal-Global-Digital-Insights ; NapoleonCat https://stats.napoleoncat.com/facebook-users-in-madagascar/2025/09/ ; StatCounter https://gs.statcounter.com/social-media-stats/all/madagascar ; Ecofin https://www.ecofinagency.com/news/0210-59411-madagascar-has-80-4g-coverage-yet-mobile-internet-remains-out-of-reach-for-most (all search snippets only)
[40] FRED/World Bank adult literacy, Madagascar. https://fred.stlouisfed.org/data/SEADTLITRZSMDG (search snippet only)
[41] Law 2014-038 on personal data protection. https://www.assemblee-nationale.mg/wp-content/uploads/2020/11/Loi-n°2014-038-sur-la-protection-des-données-à-Kre-personnel.pdf ; https://regulations.clym.io/law-no-2014-038-on-the-protection-of-personal-data-madagascar (search snippets only; text not read)
[42] Law 2016-056 on electronic money. https://www.assemblee-nationale.mg/media/archives_textes/pl/2016-056/Loi-n-2016-056-monnaie-%C3%A9lectronique.pdf ; PIC Madagascar https://www.pic.commerce.mg/fr/services-financiers (search snippets only)
[44] Cross-language interviewing and interpreters: Temple and Edwards https://sites.ualberta.ca/~iiqm/backissues/1_2Final/html/temple.html ; https://iris.landsbokasafn.is/en/publications/methodological-and-ethical-challenges-in-cross-language-qualitati/ (search snippets only)
[45] WhatsApp in low-resource usability and diary studies: https://link.springer.com/article/10.1186/s44247-026-00272-x ; https://formative.jmir.org/2026/1/e84032 (search snippets only)
[46] Oral and short-form consent guidance: https://irb.ucsf.edu/enrolling-subjects-who-are-legally-blind-illiterate-or-cannot-talk-or-write (search snippet only; US clinical-research context)
[47] ISO 24495-1:2023 catalogue entry. https://www.standards.govt.nz/shop/iso-24495-12023 (search snippet only)
[48] Data cost: https://www.statista.com/statistics/1273295/price-for-mobile-data-in-madagascar/ ; https://www.internetsociety.org/blog/2021/12/notes-from-madagascar-what-its-like-to-be-affected-by-the-digital-divide/ (search snippets only)
[49] Google Developers Blog, Building better products for new internet users. https://developers.googleblog.com/en/building-better-products-for-new-internet-users/ (search snippet only)
[50] NZ government guidance on paying research participants (vendor norms for comparison). https://dns.govt.nz/standards-and-guidance/design-and-ux/user-research-for-government/paying-user-research-participants (search snippet only)
