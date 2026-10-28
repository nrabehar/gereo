# Gereo: Competitive Analysis and MVP Proposal

Synthesis of five research reports in [raw/](raw/). Every number below comes from those reports, which label each claim as verified, single-source, company claim or unverified. Where a figure is a company claim, it is marked as such.

## 1. Bottom line

1. **No direct competitor exists in Madagascar.** No digital tontine, association, group-wallet or envelope-budget app was found. Mobile money operators sell payments, not group finance.
2. **No product anywhere combines Gereo's core loop**: group wallet, automatic split rules, a ledger every member can see, async voting with quorum, and an automatic decision log linked to spending approval. Each piece exists separately.
3. **The market failure that matters is trust, not features.** Fraud by administrators, frozen accounts, slow support and company shutdowns (Kippa, Open Collective Foundation, Tally) dominate user complaints in every category.
4. **Two risks sit outside product design**: (a) holding client funds is regulated by Law 2016-056; (b) lending is probably illegal without a licence. The founder handles both on the administrative side, not in development.
5. **Devices**: the working assumption is that everybody has a smartphone or a computer. SMS and shareable links stay useful as a fallback for people who are offline.

## 2. Madagascar context

| Fact | Value | Quality |
| --- | --- | --- |
| Internet users | 20.4% of population (6.71M) | DataReportal 2026 |
| Mobile connections | 21.8M | DataReportal |
| Adults with a smartphone | 8.9% | Findex 2025 |
| Mobile money account ownership | 19.4% of adults; bank accounts 9.5% | Findex 2024 |
| Mobile money accounts | more than 10M created, about 4.55M active | CNFI via L'Express, Nov 2025 |
| MVola claim | 15M active accounts | Company claim, contradicted by CNFI |
| Digital merchant payments | fell from 5.7% to 2.4% (2021 to 2024) | Findex: mobile money is mostly person-to-person |
| "Savings club" use | 4.9% of adults | Findex: group-savings demand needs field validation |
| MVola wallet cap | Ar 20M per individual (balance and transaction), Ar 100M enterprise | Official tariff, Feb 2025 |
| MVola reversal | 5% (min Ar 10,000), 7-day window | Official tariff |
| MVola outages | Nov 2025 and May-June 2026 | Press, CEO statement |
| SMS cost | about USD 0.59 per segment (Twilio list) | Local aggregator rates not checked |

The market-size figures cannot be reconciled with each other. Do not quote any competitor or operator user count externally without verification.

## 3. Competitive map

### 3.1 Group savings and contribution apps (closest to Gereo's core)

| Product | What it does | Lesson |
| --- | --- | --- |
| Chamasoft (Kenya) | Contribution tracking, fines, meeting agenda and attendance, loans | Claims 1M users but Android shows 10K-50K installs; no verifiable review text |
| Bank chama apps (Stanbic, KCB, Zimele) | Bank-held group accounts, multi-signatory withdrawal | Custody by a licensed institution is the trust anchor |
| StokFella / FNB stokvel (South Africa) | Group ledger, meeting hosts, alerts | Free tier is standard |
| Money Fellows (Egypt) | Regulated digital ROSCA, platform-held funds | Scale winner (over USD 60M raised) but only about 7% monthly active of registered users; complaints about ID verification, bugs, 6-10% fees |
| Djangui, Yankap, Tonti+ (Cameroon, Benin) | Online tontines | Members lost 1M and 1.5M FCFA when an administrator vanished; mitigations are admin-blocked withdrawals and payout only when all have paid |
| Splitwise, Tricount | Shared expense tracking | Splitwise has 2.0 on Trustpilot (72 reviews) after capping free expenses per day |
| Open Collective | Public ledger, expense approval | Only product with a fully public ledger; payouts via PayPal or Wise only; its foundation dissolved with two weeks' notice |

### 3.2 Personal finance, wallets and rules

| Product | Strength | Complaint |
| --- | --- | --- |
| YNAB (4.79 App Store, USD 109/year) | Envelope method loved | Months-long learning curve, sync delays, price rises |
| Goodbudget | Manual envelopes | Monthly manual refill makes users look overspent |
| Monarch (USD 850M valuation) | Aggregation | 2.0 Trustpilot: bank-sync errors, slow support |
| Monzo (15.2M customers, 4.6 Trustpilot) | Up to 20 pots | Budget view ignores money held in pots |
| Qapital | Rules called "game-changers" | USD 3-12/month; shared-goal bugs |
| PiggyVest (over 6M customers) | Locked wallets | Withdrawal delays, locked accounts, unanswered email |
| Moniepoint, OPay, Kuda | Scale in Nigeria | Account restrictions, disputes lasting weeks |
| Kippa | Merchant bookkeeping | Shut down January 2024; about 500,000 merchants lost records |

### 3.3 Madagascar payment rails

| Rail | Status |
| --- | --- |
| MVola | Developer portal with sandbox, GSMA API-certified, B2B collection and payout; App Store 4.3 (about 5k ratings) with crash and update complaints |
| Orange Money | App Store 3.1 (76 ratings): "money debited, service not delivered", OTP failures; API terms not found |
| Airtel Money | No feedback or API terms found |
| Papi.mg, direct operator APIs | Backup rails |

### 3.4 Projects, voting and governance

| Product | Lesson |
| --- | --- |
| WhatsApp / Telegram | The real incumbent: installed, no account. Missing: record, quorum, deadline, link to money, permissions |
| Loomio | Testimonials praise the decision trail, not speed. Chi Hack Night turnout 17% ("another platform to register for"); 2012 poll 2% |
| Snapshot, Tally, Aragon, Safe | Governance tooling is a hard business: Tally shut down March 2026, Aragon Association dissolved 2024 |
| Notion, Odoo, ERPNext, ClickUp, Asana | Non-experts bounce off setup; consultants needed for Odoo/ERPNext |
| Basecamp | Wins on simplicity, no budgeting |

### 3.5 Marketplace, social, marketing, lending, donations

| Area | Finding |
| --- | --- |
| Marketplace | Selling in Madagascar happens on Facebook with mobile money; a fake "overpayment" scam is documented; escrow through the wallet is the clear wedge. Jumia is 1.5/5 on Trustpilot (Kenya and Nigeria) and no evidence was found of it operating in Madagascar |
| Social | Moderation and scam load grow with openness |
| pr.social | Paid micro-task platform (follow/like tasks paid in USDT or TRX), 2.3/5 on Trustpilot from 27 reviews, mostly withdrawal problems, no named company. It is not a marketing toolkit |
| Lending | Kenya debt-shaming returned in 2025; Nigeria's 2025 rules frozen by a court April 2026; Andhra Pradesh group-lending harm pattern |
| Donations | GoFundMe 3.3/5 and under regulator pressure; M-Changa (multiple verified treasurers, refunds of staged appeals) is the best benchmark |

## 4. What users repeatedly say

1. **"Where is my money?"** Withdrawal delays, debited-but-not-delivered, pending states with no reference (PiggyVest, Moniepoint, Orange Money, Chime).
2. **Administrator risk.** One person holding the keys is the failure mode of tontines and chamas.
3. **Support is slow** on every money product's Trustpilot page.
4. **Verification friction** is the top complaint class at Money Fellows.
5. **Paywalls on core behavior cause backlash** (Splitwise), as do subscription price rises (YNAB, Monarch, Qapital).
6. **Complexity beats feature breadth.** Notion, Odoo and ClickUp lose non-experts; Basecamp wins.
7. **Sync and scraping errors** are the number one complaint of budgeting apps; a native ledger avoids them.
8. **Registered is not active.** Money Fellows 7%, Chamasoft 1M claim vs 10K-50K installs, Paykko 14% of registered users became depositors.

## 5. Table stakes and differentiators

### Table stakes (users will not adopt without them)

- Mobile money in and out, with clear pending, completed and failed states and a reference ID.
- Named wallets with goals, filterable history and simple charts.
- Contribution tracking with per-member status, reminders (push then SMS) and optional late penalties.
- Balances visible to members.
- Multi-approver spending above a threshold.
- Export of the ledger (CSV and PDF).
- PIN or biometric lock and two-factor on withdrawals.
- A free tier covering core behavior.

### Differentiators (nobody does these together)

- Automatic split rules that fire on every income, with a rule-named ledger entry.
- A double-entry ledger visible to all authorised members, in real time.
- Async votes with deadline, quorum and majority, whose result lands automatically in a decision log.
- A vote linked to a wallet and a spending approval in one flow.
- Group wallets that have the same rules as personal wallets.
- Allocation-aware analysis (what is safe to spend, across wallets).
- Mobile-money-native group treasury for Madagascar.
- Push, then SMS fallback for group decisions.
- Offline read access to balances and recent history.

## 6. Constraints to design around

1. **Custody and licensing.** Law 2016-056 reserves wallet services to a CSBF-licensed e-money institution, a credit institution or a mandated distribution agent, and unlicensed activity is a criminal offence (Arts. 9, 16, 30). E-money institutions cannot take deposits, lend or pay interest (Art. 17), must be headquartered in Madagascar (Art. 25) and hold client funds in a segregated global account (Arts. 79-80).2. **Lending.** Habitual unlicensed lending is punishable (Law 2020-011 arts. 228-229: 3 months to 2 years or a 10-40M Ar fine) and Law 2017-026 art. 9 bars non-MFIs from microfinance services. The research did not read the legal texts directly.
3. **No interest or yield promises** on wallets.
4. **Wallet caps.** Individual MVola wallets cap at Ar 20M; a group pot above that cannot land in one personal wallet. The Ar 100M ceiling quoted in the project brief needs clarification (per transaction, per day or per account).
5. **Fees.** Cross-network payouts cost 3 to 10 times more than same-network. Show the exact fee before confirmation.
6. **Asynchronous money movement.** Provider callbacks can time out or double-notify. Idempotency keys, pending and settled states and a reconciliation job are mandatory.
7. **Provider outages** happen. Show a "provider unavailable" state and queue payouts rather than failing.
8. **KYC is Gereo's job.** Tiered: phone and OTP to browse and receive; ID and selfie to withdraw or hold above a cap; extra checks for group treasurers. Handle SIM-swap risk and keep records five years (Art. 53).
9. **Tax.** A 0.5% mobile transaction tax above Ar 150,000 was in the 2025 finance bill; whether it is applied is unverified. Keep tax and fee lines configurable.
10. **Devices.** Lightweight PWA or Android Go build, offline-tolerant screens, aggressive caching, Malagasy as a first-class language.

## 7. Proposed MVP

**Core promise:** automatic envelopes for mobile money, with a group wallet everyone can audit and decisions that leave a record.

### In scope (v1)

| Area | Scope |
| --- | --- |
| Account | Phone and OTP sign-up; tiered KYC, heavy verification only at money-movement steps; languages Malagasy, French, English |
| Wallets | Personal and group wallets with type labels (budget, savings, investment, business); free ledger transfers between wallets; deposit and withdrawal through a payment adapter; double-entry ledger; statuses with reference IDs; CSV and PDF export; offline read mode with a last-synced timestamp |
| Rules | Four templates only: percentage allocation of each income, spending cap with alert, goal with target date, low-balance alert; preview before enabling; loop prevention; every firing visible in the ledger |
| Groups | Create, invite by link or phone number; permission bundles shown in plain language on top of the permissions model; audit log of permission changes; multi-approver threshold on outflows |
| Contributions | Plan (amount, frequency, deadline, optional penalty); per-member paid, pending, late; automatic reminders push then SMS; split rules on group income |
| Votes | Yes/no/abstain and single choice; deadline; quorum and majority per vote with a no-quorum fallback; shareable link that works without full registration; WhatsApp-friendly share card; one linked action: approve an expense; result written to the decision log |
| Projects (light) | Project sheet, task and milestone list, auto-generated decision log with manual entries, expense requests with approvals, one budget linked to a wallet, one summary page |
| Events | Event with RSVP and reminders push then SMS; no calendar sync |
| Group communication | Announcements; a "special contribution" campaign inside the group (goal, deadline, use-of-funds report) |
| Support | In-app support with ticket status |

### Explicitly out of v1

Supplier management and purchase orders, document versioning and library (attach files to decisions and expenses only), resource planning, Gantt, custom reports, ranking and weighted votes, vote-triggered rule changes, calendar sync, public marketplace, public social network, boosts, audience analytics, task-for-reward add-ons, and all lending.

### Later phases

1. **Phase 2:** in-group marketplace with wallet escrow, extended campaigns, member-only communities.
2. **Phase 3:** public social network, discoverable campaigns, referral and commission features.
3. **Phase 4:** group-internal lending, only after written legal clearance, with group funds only, no interest income, no contacts access, no shaming, borrower-set due dates and exposure caps.
4. **Last or never:** boosts, audience analytics, task-for-reward add-ons.

### Design rules taken from the evidence

- Never put basic voting, logging or contribution tracking behind payment; charge on group size, SMS volume or advanced analytics.
- No single administrator can move group funds.
- Every approval screen shows exact amount, payee, wallet and rule in plain language.
- Ship data export on day one and publish a shutdown and data-retention commitment.
- Preview any rule before it is enabled.
- Measure success by active groups, not registered users.
- Make Gereo the record that WhatsApp links into, not a replacement for the chat.

## 8. Positioning

"Your group's money and decisions, always visible, on any phone." Compete on exactness (native ledger), automation (rules per wallet) and accountability (decision log tied to spending). Do not compete on bank aggregation, investment breadth or social reach.

## 9. Corrections to the project brief

| Brief says | Research says |
| --- | --- |
| Marketing module with "small features like pr.social" | pr.social is a paid micro-task platform with poor reviews and no named company; drop the reference |
| 100,000,000 Ar ceiling | Operator wallets cap individuals at Ar 20M; clarify what the ceiling applies to |
| Lending module | Probably illegal without a licence; defer |
| Identity verification "by Gereo" | Confirmed necessary; make it tiered to avoid the onboarding drop-off seen at Money Fellows |
| Madagascar-first demand | Findex shows only 4.9% use savings clubs; validate in the field |

## 10. Blockers before build

1. **Field interviews** with the founding group and other associations (fokonolona, church and burial groups, tontines) on how they collect and hold money.
2. **SMS aggregator quote** for Madagascar to size reminder and vote messaging.
3. **Payment rail** behind an adapter interface (Papi.mg or direct operator APIs).

## 11. Research gaps

- Reddit, X and Play Store review text were not retrievable; user feedback leans on Trustpilot, App Store pages, press and regulator material.
- Orange Money and Airtel Money developer terms and CSBF KYC-tier instructions were not found.
- Malagasy legal texts on public fundraising, AML for non-bank wallets and the meaning of "habitual" lending were not read.
- Local bank and microfinance apps, Free Money, Seychelles and Réunion were not covered.
- Several funding and fee figures conflict between sources and are flagged in the raw reports.

## 12. Raw reports

- [01-group-savings.md](raw/01-group-savings.md)
- [02-personal-finance.md](raw/02-personal-finance.md)
- [03-madagascar-mobile-money.md](raw/03-madagascar-mobile-money.md)
- [04-projects-voting-governance.md](raw/04-projects-voting-governance.md)
- [05-marketplace-social-lending-donations.md](raw/05-marketplace-social-lending-donations.md)
