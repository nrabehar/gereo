# Gereo competitive research 04: projects, voting and governance tools

Research date: 2026-10-19. Scope: group decision/governance tools, project/work management and light ERP, group coordination incumbents (WhatsApp etc.), and sharing/permission UX patterns.

## Method and honesty notes

- Sources used: vendor pages (pricing, docs), Capterra/Trustpilot reviews, Loomio's own public discussion threads, news coverage, DataReportal. Every number below is tagged with its source. "UNVERIFIED" means a single weak source, a vendor/competitor blog, or conflicting sources.
- Reddit was not reachable by the search tool (domain blocked for the crawler), Hacker News threads were not surfaced, Product Hunt was not searched successfully, and G2/Capterra review pages often returned 403 on direct fetch. Real user feedback therefore comes mostly from Capterra/G2 summaries as returned by search, Trustpilot (fetched directly), Loomio's public decision threads (fetched directly), and press. Treat "user feedback" as directional, not statistically representative.
- Third-party pricing pages (cost blogs) disagree a lot with each other. Only official pricing pages are quoted as fact; others are labelled.
- Products reviewed in depth (12): Loomio, WhatsApp/Telegram groups and polls, Open Collective, Splitwise (+Tricount), Notion, Odoo (+ERPNext), Trello/Asana/Monday/ClickUp cluster, Basecamp, Snapshot (+Tally, Safe, Aragon), Doodle, Decidim and Polis, plus a short "others" section (Cobudget, Hylo, Colony, Opavote, Zoho, Airtable, Google Calendar/Sheets, Meetup/Eventbrite) where little could be verified.

## 0. Market context that changes everything: Madagascar

| Fact | Value | Source |
|---|---|---|
| Internet users (Oct 2025) | 6.71 million, 20.4% penetration; about 79.6% offline | DataReportal Digital 2026 Madagascar |
| Mobile connections (end 2025) | 21.8 million, 66.2% of population (includes voice/SMS-only SIMs and multi-SIM people) | DataReportal / GSMA Intelligence |
| Social media identities | 4.15 million (12.6%); 23.1% of adults 18+ | DataReportal |
| Facebook ad reach | 4.15 million (12.6% of population, 23.4% of adults) | DataReportal (ad-reach estimate, not active users) |
| WhatsApp data for Madagascar | Not provided by DataReportal. No reliable Madagascar WhatsApp figure found. | DataReportal page has no WhatsApp section |
| Messenger | 5.7% of "eligible audience" per DataReportal 2025 (as relayed by a search summary; UNVERIFIED on page) | DataReportal 2025 |
| MVola mobile money | "over 10 million customers" per MVola's own GSMA case study (self-reported) | GSMA case study |
| Outbound SMS price | USD 0.5899 per segment on Twilio's Madagascar price page (local aggregator prices not checked; likely lower, UNVERIFIED) | Twilio |
| Data prices | Conflicting third-party travel sites (roughly 2,000 to 30,000 MGA per GB depending on operator and bundle); no authoritative figure | travel/SIM blogs, UNVERIFIED |

Implications:
- Only about one in five Malagasy is online. Mobile connections are many more than internet users, so SMS (and later USSD) is the only channel that reaches many group members. This supports the "push then SMS" vision, but SMS cost per message in Madagascar on a global CPaaS is high, so the SMS fallback must be budgeted and rationed.
- Africa-wide evidence says WhatsApp is the default app where people are online: installed on 95% of surveyed Nigerian smartphones in 2025 (Orange/KPMG, installation not active use), and Q4 2020 Statista figures cited by GeoPoll show about 95 to 97% monthly use among digital populations of Kenya, South Africa and Nigeria. No equivalent verified number exists for Madagascar, where Facebook/Messenger may weigh more. This must be validated locally (a short survey of target users).

## 1. Loomio (the closest product to Gereo's voting vision)

### Profile
- Open-source async decision tool built by Loomio Cooperative Limited, a worker-owned cooperative (New Zealand) since 2011, from the Occupy Wellington experience. Part of the Enspiral network; per openDemocracy it employed 11 worker-members at the time of writing (date not shown).
- User base: no total published. The About page lists case studies only (NYC-DSA 13,000 members, OpenSSL, WRI 150 people, Raise 450 people). openDemocracy says "hundreds of cooperatives, social enterprises, municipalities and activist groups" and widespread use by Podemos circles (older claim).
- Status: active. Poll threads released May 2026, quorum and vote-share requirement settings released September 2025 (Loomio's own thread).

### Features
- Discussion threads with proposals and polls attached; outcomes recorded in the thread (this is the "decision record").
- Poll templates: advice process, consent, consensus, most-popular-option etc.; custom templates; four responses agree/disagree/abstain/block in the classic proposal.
- Quorum set as a percentage of eligible voters; deadline set at creation; voters can change their vote until close.
- Integrations: Slack, Discord, Microsoft Teams, webhooks, API; hosting in USA, EU, NZ/AU; self-hostable.

### Strengths (real feedback)
- Decision trail is the winning value, repeatedly:
  - OpenSSL (Anton Arapov): "People can point to the exact discussion when a decision was made, and why."
  - NYC-DSA (Darren Goldner): "We try not to vote in chat mechanisms because there's no trail."
  - WRI (Jared Messinger): "Having a place where you can easily reference what was decided and why."
  - Source: https://www.loomio.com/testimonials (vendor-curated, all positive, no friction mentioned).
- Async inclusion: Argot Collective: "It enables everybody from every time zone to contribute." Raise (Ian Martin Group): "more than half of the company participated actively."
- Ratings: Capterra 4.8 (26 reviews), G2 4.3 (22 reviews) as of March 2026, small samples, Capterra reviews are incentivized (per search summary of Capterra).
- Groups are "often extensions of preexisting offline relationships" which mitigates the veto/block risk (openDemocracy, Deseriis and Bartlett).

### Weaknesses / user complaints (with sources)
- Participation is the structural problem, not the feature set:
  - Chi Hack Night (Chicago civic tech group) adopted Loomio at USD 19/month. The adoption vote itself drew only 8 agree out of 45 eligible voters (17% turnout, 37 undecided), decided 26 April 2017. Source: https://www.loomio.com/d/k1yDR4ap/choose-a-decision-making-platform
  - Same thread, sign-up friction: Eric Sherman called Loomio "another platform to sign in and register for" and suggested voting by text message; Derek Eder noted that the Slack integration pushes proposals to Slack but members still need accounts. Another member said it helped her follow discussion despite not attending in person.
  - Loomio's own early community thread (12 Sep 2012, "What does it mean if not all members vote?"): a poll on minimum proposal length closed with 2 of 100 eligible voters (2%). Members argued over quorum (one proposed 66% turnout) and a minimum voting period. Source: https://www.loomio.com/d/PYH3Frln/what-does-it-mean-if-not-all-members-vote
- Onboarding is "relatively hard" for other team members (Capterra reviewer, 2021); UI "not intuitive, requires time to adapt" (G2 AI summary). Source: https://www.capterra.com/p/152670/Loomio/reviews/ and https://www.g2.com/products/loomio/reviews (as summarized via search; direct fetch was 403).
- A volunteer on the Sociocracy For All forum said largely volunteer sociocratic organizations "struggle with written/online/asynchronous decision making for social and communication reasons" (paraphrased via search summary; https://forums.sociocracyforall.org/t/loomio-and-sociocracy/1368).
- Loomio's own May 2026 release notes admit that a concern raised inside a vote could not be answered where it was raised (hence "poll threads"), and that the release "had bugs and some design decisions the developers now acknowledge were wrong". Source: https://www.loomio.com/blog/2026/05/29/poll-threads/
- Scott Laugenour (13 Jun 2026): the group uses quorum plus a cap on "concerns" of 1% for online consensus decisions, but most executive decisions still happen in in-person meetings. Source: https://www.loomio.com/d/eCqMOwZ3/feature-feedback-request-quorum-and-vote-share-requirement

### Pricing
- Official: one subscription per group, invited people are not charged; 14-day free trial limited to 10 people and 10 threads; nonprofit discount exists (amount not stated); custom quotes for multi-group or over 2,000 people. Source: https://www.loomio.com/docs/en/policy/subscriptions/pricing
- Third-party numbers conflict: Capterra lists Community Lifetime USD 199 one-time (one group, up to 100 users), Starter USD 49/month, Pro USD 149/month; CostBench lists USD 39 and 99 per year (UNVERIFIED, looks inconsistent). Check loomio.com/pricing before citing.

## 2. WhatsApp groups/Communities (and Telegram, Slack polls): the real incumbent

### Profile
- WhatsApp: 3 billion monthly active users globally as of May 2025 (Meta figure relayed by search result, UNVERIFIED on primary page). Highest relative usage in Africa and Latin America per Statista Q2 2025. Installed on 95% of Nigerian smartphones surveyed in 2025 (Orange/KPMG, brandspurng.com report), with the study warning this is installation not active use. No verified Madagascar figure.
- Communities: announcement group up to 5,000 members; sub-groups 1,024 members; roughly 50 groups per community (secondary sources, one outlier says 100; no official Meta page checked, UNVERIFIED).

### Features relevant to Gereo
- Group chat, polls, event creation, announcement channels, voice notes, no accounts needed beyond the phone number.
- Polls: up to 12 options; votes are public and traditionally uneditable; creator controls the option list; "add options" by members still in beta; single-choice restriction was an early request (betanews, androidpolice, igeeksblog via search).
- One blog dated 4 Aug 2026 (greentick.ai, single source, UNVERIFIED) says WhatsApp now supports hidden voter names, poll end times and editing within 15 minutes. If true, the gap between WhatsApp polls and a formal vote narrows further (but still no quorum, no majority rule, no record).
- Telegram: Polls 2.0 (Jan 2020) added visible votes, multi-answer, quiz mode. https://telegram.org/blog/polls-2-0-vmq

### Strengths (why groups fall back to WhatsApp)
- Already installed, already open daily, zero onboarding. Everyone is in the chat; there is nothing to "go and register for" (the exact complaint made against Loomio at Chi Hack Night).
- Social context and persuasion happen in the same place as the decision.
- Works in low-bandwidth contexts better than a heavy web app (WhatsApp is the default messaging app for locals and businesses in Madagascar per one travel source, UNVERIFIED).
- The Paykko tontine app (Benin, launched March 2026) is a useful 2026 data point: 54,000 registered users in six months but only about 14% became active depositors; the company runs moderated WhatsApp community groups and field teams to build trust (company-reported via launchbaseafrica.com). Trust and the human layer still sit in WhatsApp.

### Weaknesses
- No audit trail: decisions are buried in scroll, nothing is retrievable "why was this decided?" (the pain Loomio's testimonials repeat).
- Polls have no quorum, no deadline until recently, no weighted/majority rules, no link to money or actions, public votes create social pressure (WhatsApp's own August 2026 update addressed social pressure per the single blog source).
- No permissions model, no spending controls, no versioned documents.
- No independent research found on tontine/ROSCA groups' record-keeping disputes; vendor claims (Kolonell: "disputes cut by 85%") are unsourced marketing, do not rely.

### Pricing
- Free for users. (WhatsApp Business API is paid; irrelevant for Gereo.)

## 3. Open Collective (transparent ledger and expense approval)

### Profile
- Platform for groups to raise and spend money in the open, usually under a fiscal host who holds the money and legal status. "Thousands of collectives", "millions in contributions" (no exact counts published on the About page). Since October 2024 stewarded by OFiCo (OFi Consortium), a membership non-profit (Open Collective pricing page).
- Notable failure event: Open Collective Foundation (separate fiscal host entity, 600+ collectives per press) announced on 28 Feb 2024 that it would dissolve by 31 Dec 2024, with deadlines of 15 March 2024 to accept donations and 30 Sept 2024 to spend or transfer funds. A student mutual aid fund (The See You Collective) said it received two weeks of notice and had to pause distributions: "It's upsetting that OCF, as an entity committed to transparency..." Sources: https://thescarlet.org/19390/news/the-see-you-collective-faces-significant-pause-after-closing-of-fiscal-sponsor and https://thesocialchangenest.org/the-social-change-nest-response-to-the-dissolution-of-open-collective-foundation. The platform itself kept running.

### Features
- Public ledger: basic expense data (amount, description) is public; attachments, payment details and comments are private.
- Expense flow: anyone can submit an expense with receipt/invoice; an admin of the collective must approve it; modifying an expense requires re-approval; automated payouts via PayPal and Wise-supported bank accounts, twice weekly on platform-managed hosts. The docs page checked does not mention multi-approver thresholds (one admin approval suffices) and does not describe a separate host approval step there (an older docs search result mentions a two-step approval; treat as partially verified). Source: https://docs.opencollective.com/help/expenses-and-getting-paid/expenses
- Expense policy displayed on the submission page; host payment target example: within 7 business days of approval (OCF policy, one host).

### Strengths
- Transparency as the product ("money should move in the open, in service of communities").
- Clear mental model: submit, approve, pay, everyone sees.

### Weaknesses / complaints
- Dependency on a legal fiscal host (a US/EU concept), payouts limited to Wise-served countries and PayPal. Not designed for mobile-money-based groups; Madagascar-style MVola/Orange Money payout is not in the supported list (from the docs, absence not explicit).
- Third-party description: "not designed as a full travel and expense suite" (fitgap summary).
- A member of the social.coop hosting team hesitated to submit a reimbursement claim for hosting costs; the finance group had to encourage it (Loomio thread, shows reluctance not process failure): https://www.loomio.com/d/1nGqwDPX/hosting-expenses-i-made-a-mistake
- No Reddit/HN complaints retrieved.

### Pricing (new organizations from March 2026)
- Collectives are free. Organizations (hosts): Discover USD 0 (1 active collective, 10 paid expenses/month, USD 1 per extra expense), Basic USD 60/month, Pro USD 320/month; no percentage cut now (old 15% revenue share on host fees replaced). Source: https://opencollective.com/pricing

## 4. Splitwise (and Tricount): the group-money incumbent and a pricing cautionary tale

### Profile
- Splitwise launched 2011 (Providence, RI), tens of millions of registered users (2021 coverage; active users never disclosed), about USD 30.2 million raised, freemium. Source: search summary of TechCrunch/yespress, UNVERIFIED for current numbers.
- Tricount (Belgium) was bought by bunq in May 2022 with about 5.4 million users (fintechfutures, techcrunch); free with ads and an optional paid tier.

### Strengths
- Does one thing: shared expenses and "who owes whom" with debt simplification. Trustpilot praise: "Great for splitting expenses with a travel group!" (Carol, Mar 2023); "great for holidays and splitting bills with housemates" (Tom C, Apr 2026).

### Weaknesses / user complaints
- Free tier daily cap: Trustpilot TrustScore 2.0 from 72 reviews (64% one-star). Examples: "Can't add more than 2 expenses a day" (Viplav Sharma, 27 Aug 2026); "the new limit of only 3 transactions per day is ridiculous" (Leonhardt, 26 Feb 2026); "The free version is essentially unusable and an annual fee is not good value for the occasional user" (Matt, 11 Jul 2025). Source: https://www.trustpilot.com/review/splitwise.com
- The cap appeared in late 2023 (3 to 4 expenses per entry session, 10-second cooldown reports), Splitwise never published the number; "3 to 5 per day" is competitor-blog reporting (getfinny.app, UNVERIFIED). itvoice.in coverage: https://www.itvoice.in/splitwise-has-introduced-restrictions-on-the-number-of-free-expenses-users-can-add
- Per-person subscription: one reviewer objected the price is "per person using it".

### Pricing
- Pro about USD 4.99/month or USD 39.99 to 49.99/year, varies by country and App Store tier; Splitwise does not print a price on its site (competitor blog and Locals Insider, UNVERIFIED). Pro unlocks no cap, no ads, receipt scanning, currency conversion, charts.

Lesson for Gereo: a paywall on core daily group behavior destroys goodwill; Tricount and Splid (no account needed for members) are explicitly positioned as the "no limit" alternatives.

## 5. Notion (the "light ERP" people actually try first)

### Profile
- All-in-one docs/wiki/database workspace. Global scale; per-member SaaS pricing.

### Features relevant to Gereo
- Pages and databases, relations, templates, comments, mentions, page history, guests, teamspaces. Permission levels: Full access, Can edit, Can edit content (databases), Can create (Business+), Can comment, Can view. Subpages inherit parent permissions; "Notion respects the broadest level of access given to a user"; link sharing with three tiers (only invited, workspace, anyone with link with optional expiry); access requests approved in Inbox. Source: https://www.notion.com/help/sharing-and-permissions

### Strengths
- Reviewers: "once you overcome the learning curve, it becomes incredibly worthwhile."

### Weaknesses / complaints
- Blank-page and choice overload (SoftwareFinder/Capterra reviewers, via search summary): "The only place that can be a bit tough is the beginning since there are a ton of options"; "Even when you add just one block, you're met with a long scroll of choices"; "customization options can pull me in for way longer than intended"; "as projects multiply it gets harder to maintain a clean structure"; "more advanced features and permission settings feel a bit confusing". Source: https://softwarefinder.com/project-management-software/notion/reviews and https://www.capterra.com/p/186596/Notion/reviews/?page=15
- Teams need templates or a shared structure to get past the blank page (reviewer pattern).
- Guests need their own Notion account to open a shared page (official doc).
- No quorum, no vote objects, no spending controls, no mobile-money wallet.

### Pricing (official page, checked)
- Free; Plus USD 10 per member/month (monthly billing); Business USD 20 per member/month; Enterprise custom; yearly saves "up to 20%". Free team workspaces have a block limit, 5 MB uploads, 7-day history, up to 10 guests. Source: https://www.notion.com/pricing (third-party pages quote USD 12/22 etc., ignore).

## 6. Odoo (and ERPNext): real ERP, wrong weight class for friend groups

### Profile
- Open-core ERP with Community and Enterprise editions; very broad module set (Project, Accounting, Purchase, Documents, Calendar...). ERPNext (Frappe) is the open-source alternative.

### Strengths
- Real double-entry accounting, purchase flow, documents, permissions via groups and access rules.

### Weaknesses / complaints
- Complexity and consultant dependency (Capterra, via search summary): "We spent thousands on Odoo internal consultants, plus we hired a third-party consultant... Simple tasks like setting up email and service contracts are almost impossible to get working, even with paid assistance"; "Accounting system is overly complex and not suitable for smaller companies that need simple accounting." Source: https://capterra.com/p/135618/Odoo/reviews/?page=5
- Implementation cost estimates (implementation-firm blogs, vendor-adjacent, UNVERIFIED as market data): partners about USD 1,800 to 2,000/day (Ragic); full professional implementation USD 15,000 to 60,000 and DIY only realistic under 20 users with 3 to 5 standard modules (Ecosire). ventor.tech argues Odoo's low subscription price creates "a dangerous misconception that implementation will be equally simple" (vendor viewpoint).
- Odoo's own forum: support from Odoo itself (not partners) described as "very poor" by one poster (single post).
- ERPNext (G2/Gartner via search): "The main challenge with ERPNext is the initial setup and learning curve... often requires technical knowledge or support from experienced partners"; G2 ease of use 8.2 vs TallyPrime 9.0, support quality 6.3. Sources: https://g2.com/products/erpnext/reviews and https://www.gartner.com/reviews/product/erpnext

### Pricing
- Odoo official pricing page (checked, promotional, first-year discounted): One App Free (one app, unlimited users), Standard USD 8.95/user/month (list 11.20), Custom USD 16.40 (list 20.40), Light User USD 2.90. Installing a second app moves you to Standard. Third-party pages quote USD 16.90 to 31.10 and 25.50 to 61, region-dependent (UNVERIFIED). Source: https://www.odoo.com/pricing
- ERPNext: Frappe Cloud compute-based, sites from about USD 5/month (docs, entry price conflicts with another Frappe page at USD 10, UNVERIFIED). Source: https://docs.frappe.io/cloud/pricing

## 7. Trello / Asana / Monday / ClickUp (work-management cluster)

### Profile
- Task/kanban tools, mass market.

### Strengths
- Trello: "simplicity is a strength"; "a Kanban board can just feel so right" (Capterra reviewers).
- Monday.com: usually described as easiest of the group to adopt without training (comparison sites, UNVERIFIED).

### Weaknesses / complaints
- Trello: weak reporting and trouble at scale; a reviewer who tried Gantt integrations "took to Google Sheets instead"; notifications are the most-cited problem (Capterra topic summary). Source: https://www.capterra.com/p/211559/Trello/reviews/?page=6
- ClickUp: "overwhelming interface" from feature density; onboarding curve of 2 to 3 weeks per a comparison site (UNVERIFIED). Asana: "steep learning curve... advanced features" and "overwhelming if your team is small or your projects are simple" (Capterra reviewers). Monday: pricing escalates quickly for small teams. Source: https://thedigitalprojectmanager.com/tools/clickup-vs-asana/ and https://www.capterra.com/p/184581/Asana-PM/reviews/?page=30
- None have a vote object, decision log or spending approval.

### Pricing (Trello official, checked)
- Free (10 collaborators, 10 boards per Workspace), Standard USD 5/user/month annual (USD 6 monthly), Premium USD 10 (USD 12.50), Enterprise USD 17.50. Source: https://trello.com/pricing

## 8. Basecamp (the best precedent for "small, opinionated, no ERP")

### Profile
- Project communication tool built around message boards, to-dos, schedule, docs and automatic check-ins; deliberate simplicity. Capterra 4.3 (about 14,400 reviews), G2 4.1 (about 5,460) per rfp.wiki roundup (UNVERIFIED current counts).

### Strengths
- "Easy software to use, and the whole team was trained up within the day"; interface "very friendly, easy to navigate" (Capterra reviewers).
- Flat pricing, not per seat: Studio USD 59/month, Pro USD 99, Unlimited USD 299/month annual; Free plan 1 project, 5 users; nonprofits 10% off. Source: https://basecamp.com/pricing

### Weaknesses
- "Limited features, for example there is nothing for budgeting, analysis and time tracking"; reporting back is trickier so teams "switch back to emails... or phone calls"; "a bit dated". Source: https://www.capterra.com/p/56808/Basecamp/reviews/?page=11 (via search summary).
- Interpretation: Basecamp's gaps (budget, decisions, approvals) are exactly where Gereo can differentiate, and its simplicity is what to copy.

## 9. DAO governance stack: Snapshot, Tally, Safe, Aragon

### Profile and status (this is a cautionary sector)
- Snapshot: off-chain, gasless voting for DAOs; widely used. A forum post (blockeden.xyz, 9 Feb 2026, entirely unsourced) claims 21,000+ spaces, 10M+ votes, 17% average turnout; none of that is verified. Cabin DAO's forum cites a 58-proposal Snapshot history with median turnout about 27% of circulating supply and recent proposals 15 to 20% (single community, informal). Wintermute argues that gas cost is a main cause of low on-chain turnout and off-chain votes draw more. Sources: https://blockeden.xyz/forum/t/tally-powers-10b-in-dao-assets-snapshot-has-21-000-spaces-and-10m-votes-but-average-turnout-is-17-the-tools-are-ready-but-the-voters-arent/540 and https://forum.cabin.city/t/governmental-structure-change-for-cabin-quorum-voting-requirements-for-large-money-dao-proposals/346
- Tally (on-chain governance UI used by Uniswap, Arbitrum): announced shutdown on 17 March 2026 after 5+ years, over 1 million users and over USD 1 billion in payments processed (The Block). CEO Dennison Bertram: "there isn't a venture-backed business in governance tooling for decentralized protocols, at least not yet." Source: https://www.theblock.co/post/394026/ethereum-governance-solution-tally-used-by-uniswap-arbitrum-and-others-is-winding-down
- Aragon Association: announced dissolution in 2024 (86,343 ETH treasury made redeemable), citing "bureaucratic complexity, misaligned stakeholders, and failed attempts at changing governance"; product to continue under a company (status after 2024 not verified). Source: https://thedefiant.io/aragon-to-return-usd115m-of-treasury-assets-to-ant-holders
- Colony: reports of wind-down (mexc/chaincatcher, mixed quality, UNVERIFIED).
- Safe (multisig): M-of-N signers approve spending. Signer coordination is the friction; the Bybit hack on 21 Feb 2025 (about USD 1.4 to 1.5 billion, ~401,000 ETH) involved altered transaction data shown to signers in the Safe interface, so humans approved something different from what they saw (NCC Group, Zealynx; sources disagree on exact mechanism). Source: https://nccgroup.com/dk/research-blog/in-depth-technical-analysis-of-the-bybit-hack

### Strengths
- Snapshot's menu of vote types and gasless voting made voting free; Safe's multi-approver spending is the canonical reference for threshold approvals.

### Weaknesses
- Low turnout and whale concentration (unsourced forum figures: top 1% holding 90% of power across 10 DAOs attributed to "Chainalysis data", UNVERIFIED).
- Wallet-based identity is unusable for non-crypto groups.
- Business model failure (Tally, Aragon Association, Colony): even technically good governance tooling did not find a paying market.

### Pricing
- Snapshot: free for basic use (not verified on the pricing page this session). Safe: free wallet, gas fees on transactions.

Lesson for Gereo: the mechanics worth copying are deadline, quorum, vote types, threshold approval and the preview of what you are signing (human-readable summary of the action a vote will trigger). The sector's low turnout and business-model failures are the warning.

## 10. Doodle (the scheduling poll that went mainstream)

### Profile
- Group scheduling polls; "millions of people have used a Doodle poll without even signing up" (Softabase; no official count found). Capterra 4.6 from 1,837 reviews; Softabase about 7.3/10 from about 2,100 reviews.

### Strengths
- Respondents need no account; one link; very simple ("very easy to use").

### Weaknesses
- Ads on the free plan are the most common complaint ("ads on the free version are pretty excessive, and the push for premium can be distracting"); essential features (reminders, branding, integrations) sit behind paid tiers. Free plan limits per Koalendar: one group poll with up to 10 time slots. Source: https://capterra.com/p/142620/Doodle/pricing/ and https://koalendar.com/blog/doodle-pricing

### Pricing
- Capterra: Pro USD 6.95, Team USD 8.95 per user/month; Koalendar (April to October 2026): Pro USD 11, Team USD 16 per seat/month billed annually (conflict, UNVERIFIED).

Lesson: link-based no-account responses are what let a poll leave the app and succeed.

## 11. Decidim and Polis (civic participation, mostly irrelevant to private groups but instructive)

- Decidim: free software for participatory democracy, born in Barcelona. More than 400 active instances in 20 countries per Barcelona City Council (older 2021 note said 300+ in 18 countries; decidim.org lists 511 instances, date unclear). The Barcelona Provincial Council's Participa311 hosts 132 instances, 1,200+ participatory processes and about 60,500 registered participants (promoter's number). Criticism: an Ara opinion piece says most Barcelonians do not know the platform exists; a UAB 2025 thesis finds tensions and limits. No Barcelona-wide turnout figure found. Voting is restricted to registered residents (identity/census), which is a barrier in itself. Sources: https://ajuntament.barcelona.cat/innovaciodemocratica/en/decidim and https://en.ara.cat/opinion/how-to-improve-democracy-local-in-catalonia_129_5817685.amp.html
- Polis: participants vote agree/disagree/pass on short statements and cannot reply to each other (reduces trolling); clustering surfaces consensus across opinion groups; used in vTaiwan (vTaiwan claims 80% of 26 issues led to government action, self-claim UNVERIFIED). Source: https://arxiv.org/pdf/2502.05017
- Lesson: swipe-style agree/disagree/pass on short items is an unusually low-friction input; fine for later "opinion gathering" but not v1.

## 12. Others (little verifiable data, listed to scope what to skip)

- Cobudget (participatory budgeting): a status search returned unrelated news; status unverified. Hylo, Opavote: nothing verified. Zoho Projects/Books, Airtable, Monday: not deep-dived (Monday covered above via comparison sites).
- Google Calendar/Sheets and Facebook Groups as de-facto tools: no sourced data collected. Hypothesis (not evidence): groups use Sheets for ledgers and calendars for dates because they are free, already installed, and shareable by link. Needs primary interviews in Madagascar.
- Meetup/Eventbrite RSVP: no study found for those products. Industry benchmark (PheedLoop, 1,070+ events): median no-show about 20%, free events 28%, paid 17%; vendor estimates for free events 30 to 60% (Eventtia, Nunify; unmethodical). Reminder effect sizes: no reliable published number found; the "20 to 40% reduction" claim is from an unnamed-case-study blog and should be ignored. Source: https://www.eventtia.com/how-to-prevent-no-shows-at-your-events-tips-and-strategies/
- SMS vs push: no independent African study found; vendor claims (SMS 90 to 98% open vs push 7.8 to 60%) conflict and are marketing. The only robust point is structural: SMS needs no data connection.

## 13. Sharing UX patterns worth copying (OpenFGA/Zanzibar-style end-user experience)

- Google Drive: three roles (Viewer, Commenter, Editor); folder access is inherited by all files inside; "Anyone with the link" convenience option; a person with higher parent access cannot be reduced on a single file (Patronum guide, vendor content). Link-viewers appear as anonymous animals. Source: https://support.google.com/drive/answer/2494822
- Notion: share button on every page with Invite by email/name/group, a role dropdown, general access (invited only / workspace / anyone with link plus expiry), access requests approved in an inbox, "broadest access wins" rule, subpage inheritance with per-page override. Source: https://www.notion.com/help/sharing-and-permissions
- Linear: not researched this session; no claim made.
- Patterns to copy for Gereo: (1) one Share button, always in the same place; (2) a short list of named capability bundles (not roles) shown as plain language ("can view", "can comment", "can approve spending"); (3) inheritance shown visibly ("Inherited from project X") with an explicit override; (4) access requests flow instead of dead ends; (5) show the effective result ("who can see this and why").
- Patterns to avoid: hidden "broadest access wins" surprises, and unreducible inherited access.

## 14. Takeaways for Gereo MVP

### 14.1 What makes async voting actually used vs ignored (evidence summary)

| Pattern | Evidence |
|---|---|
| Voting works when the group already has a trust relationship and an in-person or chat habit | Loomio groups are often extensions of offline relationships (openDemocracy); OpenSSL, NYC-DSA use it as the decision record |
| It fails when the vote is the first reason to install/register | Chi Hack Night: "another platform to sign in and register for", 17% turnout; Loomio 2012: 2% turnout |
| Value is the trail, not the click | Every Loomio testimonial cites "what was decided and why"; nobody cites speed |
| Quorum is double-edged | Needed to avoid 2-vote "decisions", but with real turnout of 2 to 20% groups often fail quorum; Loomio only shipped quorum/vote-share settings in Sept 2025 after 14 years |
| Tools must live where people already are | Loomio's Slack/Teams/Discord integrations exist for this reason; Chi Hack Night notes they still require accounts |
| Short deadline plus reminders | Chi Hack Night chose a 24-hour deadline after each breakout meeting; Loomio documentation says a deadline helps prompt non-voters (no confirmed automatic reminder feature found) |
| Turnout is low even where voting is free and gasless | Snapshot/DAO figures (unsourced, 5 to 27% depending on source) |
| Public votes create social pressure | WhatsApp's own poll updates targeted hidden voter names (single source, UNVERIFIED) |

### 14.2 Why groups fall back to WhatsApp (and what to do about it)

- It is already installed and opened daily; decisions are made in the same place as persuasion; no account.
- Its failure points are exactly Gereo's value: no record, no quorum/majority, no deadline (historically), no money linkage, no permissions.
- Implication: Gereo should be the system of record that WhatsApp talks to, not a replacement of the chat. Concretely: shareable vote links that work without full registration (Doodle-style, Splid-style), a WhatsApp-friendly share card with deadline and current tally, results posted back as a shareable summary, and an SMS fallback for people not online.

### 14.3 Table stakes for v1 (what every credible comparator has)
- Group with members, invitations by link/phone number.
- A proposal with title, context, options, deadline, one or two vote types (yes/no/abstain, single choice) and a majority rule; automatic close and result; edit/withdraw rules before first vote.
- Visible decision log entry created automatically on close: question, context, result, who voted what (or anonymous option), date, linked documents.
- Reminders to non-voters before close (push, then SMS), and clear "I have voted / I have not" status.
- Expense request, approver list, threshold, status; ledger with a visible history (Open Collective's core).
- Event/date with RSVP and reminders.
- Simple permission model with a "share" screen using plain language.
- Audit log and no deletion of decisions (append-only with amendments).

### 14.4 Gaps nobody fills well (Gereo's opening)
- Decision linked to money: nothing combines a vote, a wallet and a threshold approval in one flow (Loomio has votes without money; Open Collective has money with single-admin approval; Safe has thresholds but needs crypto wallets).
- Mobile-money-native group treasury for Madagascar (MVola/Orange/Airtel): Open Collective payouts via PayPal/Wise only; Splitwise/Tricount only track debts, they do not move money.
- Offline/low-data reach: no comparator does push then SMS for a group decision.
- A decision log that is automatically generated and connected to project and budget (Basecamp has no budgets; Notion has no vote objects; Odoo is overweight).
- Multi-approver spending in a consumer-grade UX.

### 14.5 What to cut from the ERP scope for v1
Cut or defer (evidence: Odoo/ERPNext complexity, Notion blank-page overload, Basecamp's success with simplicity, ClickUp "overwhelming"):
- Supplier management, purchase orders, procurement flow: defer; v1 = a simple "expense request" with attachment.
- Document versioning and a full document library: v1 = attach files to a decision, proposal or expense (basic versions only if cheap).
- Team/resources planning and skills: cut.
- Reporting dashboard: v1 = one page per project (budget used vs planned, open decisions, next dates). No custom reports.
- Gantt/dependencies/custom fields/databases: cut (Notion/ClickUp/Trello complaints).
- Multiple vote types: ship yes/no/abstain and single-choice; defer ranking and weighted.
- Vote-triggered actions: ship exactly one (approve an expense); defer "change a split rule".
- Calendar: events with RSVP and reminders only; no two-way calendar sync at first.
- Budget: single budget with categories linked to the wallet; no forecasting.
- Minimal useful "project + decision log": a project sheet (name, goal, members, budget, status), a list of tasks or milestones (title, owner, date, done), a decision log (auto-created from votes, plus manual entries with context), an expenses list with approvals, and a timeline of events. That is roughly Basecamp's scope plus decisions and money, and nothing more.

### 14.6 Risks
1. Participation risk: expect 2 to 20% turnout on async votes unless the vote is embedded where people already are (evidence: Chi Hack 17%, Loomio 2012 2%, DAO 5 to 27%). Quorum rules that are too strict will block decisions; need a "no-quorum fallback" and per-vote configuration with sane defaults.
2. Distribution risk: WhatsApp inertia and the 20.4% internet penetration mean most target users are not reachable by push. Cold-start must run through WhatsApp links and SMS.
3. SMS cost risk: Twilio lists USD 0.5899 per segment for Madagascar; local aggregator pricing not verified. Budget SMS per group or per event, ration to critical messages (vote closing, spending approval), and verify local rates.
4. Money risk: trust. Paykko (Benin) saw only about 14% of registered users become depositors because people hesitate to send money to a digital entity; Open Collective Foundation's dissolution stranded groups' funds with two weeks of notice. Wallet custody, licensing (mobile-money partnership or payment institution status) and what happens if Gereo disappears need an explicit answer.
5. Business model risk: governance tooling is a hard business (Tally shut down in March 2026 citing no sustainable venture-backed model; Aragon Association dissolved; Colony reportedly winding down; Loomio survives as a small cooperative with USD-denominated pricing). Gereo's revenue must not depend only on subscriptions for voting; payments, spend approvals or group wallets are the better anchor.
6. Pricing risk: Splitwise's daily cap paywall on core behavior produced a 2.0 Trustpilot score; never gate basic voting or logging behind payment, and avoid per-seat pricing for groups that are mostly informal (Basecamp flat pricing, Loomio per-group pricing, Odoo One App Free are the references).
7. Complexity risk: three independent evidence streams (Notion, Odoo/ERPNext, ClickUp/Asana) show non-experts bounce off setup. Provide a fixed template: project in 60 seconds, not a blank canvas.
8. Permissions risk: "permissions-only, no roles" is correct internally, but end users think in roles. Ship named permission bundles in the UI and show effective access, as Notion/Drive do, or support load will spike.
9. Spending security risk: the Bybit hack shows humans approve what the screen shows, not what the action does. The approval screen must display the exact amount, payee, wallet and rule being applied, plain language, before approvers confirm.
10. Evidence gap: no Madagascar-specific data on WhatsApp vs Messenger usage, no verified SMS aggregator rates, no primary interviews. These three should be settled before sizing the SMS and share-link strategy.

## Sources

Group governance and decision tools
- Loomio pricing policy: https://www.loomio.com/docs/en/policy/subscriptions/pricing
- Loomio about: https://www.loomio.com/about
- Loomio testimonials: https://www.loomio.com/testimonials
- Loomio Capterra pricing and reviews: https://www.capterra.com/p/152670/Loomio/pricing/ and https://www.capterra.com/p/152670/Loomio/reviews/
- Loomio G2: https://www.g2.com/products/loomio/reviews
- Loomio, Chi Hack Night adoption thread: https://www.loomio.com/d/k1yDR4ap/choose-a-decision-making-platform
- Loomio, "What does it mean if not all members vote": https://www.loomio.com/d/PYH3Frln/what-does-it-mean-if-not-all-members-vote
- Loomio quorum and vote share feedback thread: https://www.loomio.com/d/eCqMOwZ3/feature-feedback-request-quorum-and-vote-share-requirement
- Loomio poll threads release: https://www.loomio.com/blog/2026/05/29/poll-threads/
- openDemocracy, Loomio and the problem of deliberation: https://www.opendemocracy.net/digitaliberties/marco-deseriis-richard-bartlett/loomio-and-problem-of-deliberation
- Loomio and Sociocracy forum: https://forums.sociocracyforall.org/t/loomio-and-sociocracy/1368
- Open Collective pricing: https://opencollective.com/pricing
- Open Collective about: https://opencollective.com/about
- Open Collective expenses docs: https://docs.opencollective.com/help/expenses-and-getting-paid/expenses
- Open Collective Foundation dissolution: https://thescarlet.org/19390/news/the-see-you-collective-faces-significant-pause-after-closing-of-fiscal-sponsor and https://thesocialchangenest.org/the-social-change-nest-response-to-the-dissolution-of-open-collective-foundation
- Social.coop reimbursement hesitation thread: https://www.loomio.com/d/1nGqwDPX/hosting-expenses-i-made-a-mistake
- Tally shutdown: https://www.theblock.co/post/394026/ethereum-governance-solution-tally-used-by-uniswap-arbitrum-and-others-is-winding-down
- Aragon Association dissolution: https://thedefiant.io/aragon-to-return-usd115m-of-treasury-assets-to-ant-holders
- Snapshot/DAO turnout (unsourced forum): https://blockeden.xyz/forum/t/tally-powers-10b-in-dao-assets-snapshot-has-21-000-spaces-and-10m-votes-but-average-turnout-is-17-the-tools-are-ready-but-the-voters-arent/540
- Cabin DAO quorum discussion: https://forum.cabin.city/t/governmental-structure-change-for-cabin-quorum-voting-requirements-for-large-money-dao-proposals/346
- Wintermute on off-chain governance: https://wintermute.com/insights/research/defi-research/osnap-a-case-for-off-chain-governance
- Bybit hack technical analysis: https://nccgroup.com/dk/research-blog/in-depth-technical-analysis-of-the-bybit-hack
- Decidim (Barcelona): https://ajuntament.barcelona.cat/innovaciodemocratica/en/decidim
- Decidim criticism (opinion): https://en.ara.cat/opinion/how-to-improve-democracy-local-in-catalonia_129_5817685.amp.html
- Polis / vTaiwan field insights: https://arxiv.org/pdf/2502.05017

Group coordination
- DataReportal Digital 2026 Madagascar: https://datareportal.com/reports/digital-2026-madagascar
- DataReportal Digital 2025 Madagascar: https://datareportal.com/reports/digital-2025-madagascar
- MVola GSMA case study: https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/mvola-madagascar-a-case-study-for-the-gsma-mobile-money-api-and-open-platforms/
- Twilio SMS pricing Madagascar: https://www.twilio.com/en-us/sms/pricing/mg
- WhatsApp Nigeria 2025 study: https://brandspurng.com/2026/09/26/whatsapp-installed-on-95-of-nigerian-smartphones-study-finds/
- WhatsApp Africa Statista/GeoPoll: https://www.geopoll.com/?p=19136
- WhatsApp polls changes: https://www.androidpolice.com/whatsapp-finally-fixing-polls/ and https://betanews.com/article/whatsapp-is-working-on-a-feature-that-allows-users-to-add-options-to-existing-polls/ and https://greentick.ai/blogs/create-a-poll-in-whatsapp/ (single source)
- WhatsApp Communities limits (secondary): https://getkanal.com/blog/whatsapp-communities-guide
- Telegram Polls 2.0: https://telegram.org/blog/polls-2-0-vmq
- Paykko tontine adoption: https://launchbaseafrica.com/2026/09/29/paykko-gara-tontines/
- Splitwise Trustpilot: https://www.trustpilot.com/review/splitwise.com
- Splitwise pricing and limit (competitor blog): https://getfinny.app/blog/splitwise-pricing-2026
- Splitwise free limit coverage: https://www.itvoice.in/splitwise-has-introduced-restrictions-on-the-number-of-free-expenses-users-can-add
- Tricount/bunq: https://techcrunch.com/2022/05/03/bunq-to-acquire-group-expenses-app-tricount/ and https://www.fintechfutures.com/challenger-banks/dutch-challenger-bunq-becomes-eu-s-second-largest-neobank-with-tricount-acquisition
- Doodle pricing and reviews: https://capterra.com/p/142620/Doodle/pricing/ and https://koalendar.com/blog/doodle-pricing
- Event no-show benchmarks: https://www.eventtia.com/how-to-prevent-no-shows-at-your-events-tips-and-strategies/

Project management and light ERP
- Notion pricing: https://www.notion.com/pricing
- Notion sharing and permissions: https://www.notion.com/help/sharing-and-permissions
- Notion reviews: https://softwarefinder.com/project-management-software/notion/reviews and https://www.capterra.com/p/186596/Notion/reviews/?page=15
- Odoo pricing: https://www.odoo.com/pricing
- Odoo reviews: https://capterra.com/p/135618/Odoo/reviews/?page=5
- Odoo implementation cost (vendor-adjacent): https://ventor.tech/odoo/why-odoo-works-for-thousands-but-failed-for-you and https://ecosire.com/blog/odoo-consultant-vs-diy-implementation and https://ap3.ragic.com/intl/en/blog/582/odoo-review-cost-apps-implementation-alternatives
- ERPNext reviews and Frappe Cloud pricing: https://g2.com/products/erpnext/reviews and https://www.gartner.com/reviews/product/erpnext and https://docs.frappe.io/cloud/pricing
- Trello pricing: https://trello.com/pricing
- Trello reviews: https://www.capterra.com/p/211559/Trello/reviews/?page=6
- Asana reviews: https://www.capterra.com/p/184581/Asana-PM/reviews/?page=30
- ClickUp vs Asana comparison: https://thedigitalprojectmanager.com/tools/clickup-vs-asana/
- Basecamp pricing: https://basecamp.com/pricing
- Basecamp reviews: https://www.capterra.com/p/56808/Basecamp/reviews/?page=11
- Google Drive sharing: https://support.google.com/drive/answer/2494822
