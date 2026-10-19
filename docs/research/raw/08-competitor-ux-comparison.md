# Gereo: Competitor UX/UI Comparison

Research date: 2026-10-19. Scope: how the closest products actually design their interface and flows, as far as text sources allow. This report builds on `../competitive-analysis.md` and `01` to `05` in this folder and does not repeat their market research.

## 0. Method, labels and limits

Every claim carries one of three labels.

| Label | Meaning |
| --- | --- |
| [V] | Verified: read on an official or primary page (store listing, vendor help centre or documentation, vendor FAQ, vendor blog, published academic or CGAP paper) during this research |
| [S] | Secondary: press, forum or community posts, review aggregators, third-party guides, or a search-result excerpt of a page that itself could not be loaded |
| [U] | Unverified or inferred: a design inference by the author, or a count derived from documented steps. Never presented as a fact about the product |

Rules followed: no screen is described unless a text source describes it. "ND" means "not documented in any source I could read". Star ratings are the storefront shown in the cited URL; storefronts differ, so numbers can differ from `../competitive-analysis.md`.

Hard limits of this research, stated up front:

1. I cannot view images. Store screenshots carry no captions in any listing read (Chamasoft, Stanbic, Money Fellows, Splitwise, StokFella, Tricount all returned image placeholders only). Visual style, density, colour and iconography are therefore mostly ND.
2. Mobbin, Page Flows and similar screenshot libraries are paywalled or image-only; searches returned no usable text teardown of any product in scope. The only teardown-style text found was community redesign threads (Monzo), vendor help pages (YNAB, Open Collective, Loomio) and academic or CGAP design research on mobile money.
3. Play Store pages did not load (Chamasoft, Wave, M-Pesa). Review text is therefore mostly from App Store listings and a few aggregators. No Reddit or X text was retrievable.
4. Some pages loaded only as a search-result excerpt (flagged [S] even when the host is official).
5. Wave exists as two unrelated companies: Wave Mobile Money (Senegal, Cote d'Ivoire, Mali, Burkina Faso, Gambia, Uganda) and Wave Money (Myanmar). CGAP's design deck documents the Myanmar one. The two are kept apart below.

## 1. Product selection

Twelve products get a full profile; six more get short profiles. Chosen for how much real interface evidence exists and for relevance to a Gereo screen type.

| Full profile | Why it is in |
| --- | --- |
| 1. Stanbic Chama app (Kenya) | Closest product: group wallet, roles, invoices, member-visible ledger. Only product with a primary FAQ describing screens |
| 2. Chamasoft (Kenya) | Longest-running chama tool; release notes show product evolution |
| 3. Money Fellows (Egypt) | Scale winner for digital ROSCA; richest onboarding and KYC complaints |
| 4. yaNkap and Tonti+ (Cameroon, Benin) | Mobile-money tontine with late-payment and turn-order logic; USSD pilot |
| 5. Splitwise | Shared-ledger benchmark; paywall backlash |
| 6. Tricount | Link-only sharing, offline, accessibility work |
| 7. Open Collective | Public ledger and the only documented expense-approval state machine |
| 8. Monzo (pots) | Pots, Bills Pots, Salary Sorter (closest thing to split rules in a consumer app) |
| 9. YNAB | Envelope status colours, home-dashboard hierarchy, swipe approval |
| 10. Loomio | Async voting with deadline, quorum, outcome, review date |
| 11. MVola | Madagascar home market: current app, redesign, language complaints |
| 12. M-Pesa app (Safaricom and Vodacom Tanzania listings) | Mobile-money super app pattern, offline mode, shortcut home |

Short profiles: PiggyVest, Orange Max it (Madagascar), Wave Mobile Money (Senegal) plus Wave Money Myanmar as documented by CGAP, Kuda and Moniepoint, Qapital with Goodbudget and Cashew, StokFella with WhatsApp polls. Jumia and Jiji appear only in the marketplace note. Airtel Money: no UX source found.

---

## 2. Full profiles

### 2.1 Stanbic Chama app (Kenya)

Sources: vendor FAQ PDF https://sponsorships.standardbank.com/static_file/Kenya/filedownload/Chama/Chama%20App%20New%20FAQs.pdf ; App Store https://apps.apple.com/app/id1564047823

| Dimension | Evidence |
| --- | --- |
| Navigation model | Tab or drawer structure and item count: ND. Documented surfaces: personal wallet, "Chama summary screen", Chama cards, group chat, goals, loan application [V]. Long-press a Chama card, then tap a pencil button to edit it [V] |
| Home / dashboard | Version 5.0.3 introduced "a wallet and group dashboard" [V App Store notes]. Personal wallet shows balance and an "Outstanding Invoices" amount; tapping the transaction history shows what you owe [V] |
| Wallet / group detail | Members see "their own transactions and those of other members" and "balances and transaction history (Invoices, Payments, Transfers, Deposits and Withdrawals)" [V]. All members can search group transactions in real time [V App Store]. Transactions are named by classification: Joining Fees, Contributions, Penalties, Loan repayments, Loan interest, Disbursements [V]. Loan capital and interest are shown separately [V]. Group goals can have pictures and track progress; money allocated to a goal moves out of the available balance and can be returned [V App Store] |
| Transaction list and status | Types and classifications as above. Pending, failed or settled states are not described [ND] |
| Onboarding and KYC | Register with mobile number; a personal wallet is created automatically [V]. Before forming or joining a Chama, scan the Kenyan National ID and take a selfie [V]. Kenyan citizens only, 18+ [V] |
| Join flow | Only the chairperson can invite. Tap Invite, enter a phone number or pick from the phone book, choose the role (Member, Mentor or Treasurer), optionally name a referrer (the "guarantor"). The invitee receives a limited view of the Chama with a button, sees its details, and accepts or declines [V]. Invitees can review the constitution first [V App Store]. Public Chamas are searchable with finances visible; a join request notifies the chairperson, who sees the requester's public profile and can start a chat [V] |
| Contribution or payment initiation | Two stages [V]. (1) Fund the wallet: M-Pesa Paybill 600100, account number "555" plus the registered phone number, amount; or bank transfer or Pesalink with the same account number format. (2) Pay: tap Payment button, select the Chama, select the transaction classification, select the invoice if invoicing is on (amount pre-filled), submit. Documented step count: wallet funding 3 manual inputs outside the app, then 3 selections in the app [U count from documented steps]. Withdrawal: select Bank Payment type, choose option and amount, submit request [V] |
| Approval / multi-signature | Role matrix: Chairperson and Treasurer can make payments and see invoices; Member and Mentor cannot make payments; only Chairperson can invite and accept invitations [V]. A multi-approver rule on withdrawals is not documented for this app [ND] |
| Voting / decisions | A poll feature exists in the chat ("You can even create a poll", FAQ Q18) [V]. No deadline, quorum or outcome record described [ND]. Roles include a Mentor with view-only plus chat [V]. Member statuses: Active, On-hold, Terminated, reversible [V App Store] |
| Notifications | System notifications when invoices are due and when payments are made, set up by the treasurer; chat notification when an invoice is issued [V]. Channel (push or SMS) ND |
| Offline / low data | ND. App size listed 1.3 MB on the App Store page [V], which is a store-metadata value and may be unreliable |
| Languages | English [V App Store] |
| Visual style | ND |
| Accessibility | ND |
| Review complaints | No reviews: the App Store page says the rating "was recently reset" and shows none [V]. No complaint text found |

Takeaways for Gereo: invoice-first contribution with pre-filled amount, transaction classification vocabulary, constitution shown before joining, role matrix in plain table form, public-versus-private group switch.

### 2.2 Chamasoft (Kenya)

Sources: App Store https://apps.apple.com/mx/app/chamasoft/id1489712788 ; Sensor Tower Android record https://app.sensortower.com/api/android/apps/chamasoft.app?country=KE

| Dimension | Evidence |
| --- | --- |
| Navigation model | ND |
| Home / dashboard | ND. Release 3.0.0 says "A more inituitive user interface and longer session" [V App Store, typo in original]. 2.3.3 "Revamped interface", 2.0.x "Full interface redesign" [V]. Three redesigns in about five years |
| Module list | Membership Management, Bank Account Management (withdrawals, transfers, deposits), Expense Management, Project Management, Loan Management, Financial Reports (Member Statements, Loan Summaries, Expense Summary, Transaction Statements), One Time Penalty Management, treasurer cash book [V] |
| Transaction display | Per-member statement; penalties appear on the member's statement [V]. "Acts as an online treasurer by reconciling recorded payments" [V company claim] |
| Onboarding and KYC | Group setup, member management, country code selection for one-time PINs (1.x); auto-read SMS verification (2.0.x) [V release notes]. KYC steps ND |
| Contribution initiation | Member invoicing is automated; e-wallet takes M-Pesa payments and withdraws to M-Pesa or bank [V]. Step count ND. Release 2.3.5: "resolved M-Pesa payment prompt issues" [V] |
| Approval | "Advanced Loans Module with better approvals and repayment schedules" (2.3.4) [V]. Withdrawal approval or multi-signature: ND |
| Voting / decisions | None. Meeting management with records, attendance, agenda and shareable reports since 2.1.1 [V] |
| Notifications | "Sends payment reminders" [V]. Free SMS bundles in paid plans (per `01`) |
| Offline | "Partial offline capabilities" since 2.1.1 (June 2021) [V]. Detail ND |
| Languages | ND on store listing |
| Security | AES-256 in transit, stronger authentication, 2FA (2.3.3) [V] |
| Review complaints | No text reviews retrievable (App Store: not enough ratings; Play: featured reviews empty) [V]. Android 3.99 from 129 ratings: 82 five-star, 14 four, 4 three, 8 two, 21 one-star, i.e. about 16% one-star [V Sensor Tower]. Installs 10K to 50K against a company claim of 1M users (`01`) |

Takeaways: fines and meeting attendance matter to real chamas; offline was added late and only partially; repeated redesigns suggest the home screen was hard to get right [U].

### 2.3 Money Fellows (Egypt)

Sources: vendor guide https://www.moneyfellows.com/en-us/3elmelgeib-home/your-complete-guide-to-money-fellows-app ; App Store https://apps.apple.com/us/app/money-fellows-online-circles/id1113492041 ; aggregator reviews https://justuseapp.com/en/app/1113492041/money-fellows-online-game-ya/reviews ; Trustpilot https://www.trustpilot.com/review/moneyfellows.com

| Dimension | Evidence |
| --- | --- |
| Navigation | ND |
| Home | ND. Listing positions it as "personal finance and savings app" with budgeting, goals and circles [V App Store] |
| Circle detail | Monthly payment, duration (6, 10 or 12 months), payout schedule, "full payment schedule" reviewable before joining [V]. Transparency claim: "view circle details and updates at any time" [V] |
| Onboarding | Sign up with full name, email, phone, national ID; OTP; add payment details; review and sign the legal agreement. 5 documented steps [V, count from the guide]. App Store: "Sign-up is fully digital with an ID scan" [V]. A credit limit is derived by "analysing your data" after you pick a circle [V] |
| Join / payment steps | Log in, browse circles, pick a circle, tap Join, add bank account or prepaid card, track dates. 4 steps [V count]. Payment channels: Fawry, bank transfer, prepaid card, e-wallet, Instapay, Money Fellows card [V]. Payout turn chosen at start, middle or end; admin fee depends on position, from a stated maximum of 16% early to 0% late [V company statement; third-party sources quote lower figures] |
| Approval / multi-sig | None; the platform administers the circle [V, structure] |
| Voting | None |
| Notifications | "Regular reminders about payment and collection deadlines" [V] |
| Offline | ND |
| Languages | Website English and Arabic [V]. App Store lists English only [V] |
| Review complaints | "It wouldn't let me get passed the phone number confirmation page"; "It keeps rejecting my national card"; blank white screen after activation, reinstall needed; "they take 5-10 mins to reply back on the chat for each message"; salary document requested every three months; "Now i can't understand these newly added interface" [S, justuseapp, undated reviews]. App Store 4.3 from 174 ratings; 2021 review: circle limits too low, slow live chat [V]. May 2026 Trustpilot review: restricted card, 2,000 EGP unreachable, "Your request is still open and will be handled soon" [S] |

Takeaways: verification gating is the highest-friction step in this category; interface changes were also resented.

### 2.4 yaNkap and Tonti+ (Cameroon, Benin)

Sources: App Store https://apps.apple.com/cm/app/yankap/id6754392382 ; site https://yankap.cm/ ; Tonti+ pilot summary https://solve.mit.edu/solutions/36119 (via `01`)

| Dimension | Evidence |
| --- | --- |
| Navigation | ND. Tontine creation starts on a web page ("Creer ma tontine", tontine.yankap.cm) [V]; the app lists tontines (Nkap), savings goals ("Jars"), shared expenses by invitation code, transfers, bill payments, QR receive [V App Store] |
| Group setup | Manager sets contribution amount, frequency and turn order ("ordre de passage"), then invites members [V] |
| Ledger and status | Real-time balance and reconciled transaction history; automatic payment messages appear in the group chat [V] |
| Late handling | Late payments detected automatically. "Cotisation fluide" advances a late member's contribution so the turn is not blocked; the member repays plus group-set penalties [V] |
| Trust cue | Member credibility score from punctuality, participation, engagement, visible to members, with per-tontine reports [V company site] |
| Payment initiation | Each member pays from their own mobile-money account (Orange Money, MTN MoMo); company says it holds no funds [V company claim]. Steps ND. Withdrawal fees under 2% [V company claim] |
| Approval | Payout released only when all members have paid (per `01`, [S]). Tonti+ blocked administrators from withdrawing or paying themselves [S, MIT Solve] |
| Voting | None |
| Offline / low data | Tonti+: members paid daily by USSD on basic phones; admins used an Android app [S, MIT Solve]. yaNkap: ND |
| Languages | French and English, switchable at any time [V App Store description] |
| Security | Biometric login, 4-digit PIN per transaction, KYC, push alerts [V] |
| Review complaints | Single review: "Pourquoi depuis plus de 3 jours je n'arrivent pas a faire de transaction ?"; developer says a technical incident was resolved. 3.0 from 6 ratings [V App Store] |

Takeaways: turn order as a first-class screen, automatic late detection with a visible remedy, credibility score (use carefully: shaming risk), USSD parity for basic phones.

### 2.5 Splitwise

Sources: App Store https://apps.apple.com/us/app/splitwise/id458023433 and https://apps.apple.com/pl/app/id458023433 ; Trustpilot https://www.trustpilot.com/review/splitwise.com and regional mirrors (for example https://au.trustpilot.com/review/splitwise.com)

| Dimension | Evidence |
| --- | --- |
| Navigation | Official listings do not describe it. A third-party APK page describes three tabs: Friends, Groups, Recent Activity [S, weak] |
| Home | ND. Pro adds spending-by-category charts [V] |
| Group detail | Group ledger of who owes whom; unequal splits by percentage, shares or exact amounts; multiple payers; recurring bills; categories; comments; edit history; restore deleted groups or bills; activity feed [V] |
| Status display | Debt simplification reduces the number of payments in a group [V]; one reviewer wished it were optional [S] |
| Onboarding | ND |
| Expense entry | "Add bill" with amount, who owes, date, optional photo [S guides, generic]. Step count ND |
| Settle up | Record a cash payment, or pay by Venmo or PayPal (US) or Paytm (India) [V listing] |
| Approval / voting | None |
| Notifications | Push notifications and activity feed [V] |
| Offline | Offline entry [V] |
| Languages | English, Dutch, French, German, Indonesian, Italian, Japanese, Polish, Portuguese, Spanish, Swedish, Thai [V] |
| Accessibility | Developer lists none on the store [ND] |
| Review complaints | Free-tier cap and countdown: App Store, 4 Aug 2025: "free plan limited to five expenses per day" and a 10-second timer; "There is absolutely no reason why a free account should be limited on the number of expenses it can enter per day" [V App Store]. Trustpilot: caps reported as 3 per day (late 2023) and 4 per day (2025) with no warning [S]. The official cap is not published, so the number is unconfirmed. Other: no iPad Split View; itemise an existing receipt photo is Pro; "virtually any abroad trip is easier to be held in Google Spreadsheets" [V App Store]. Rating 4.0 from 29K (US) and 4.2 from 1.2K (Poland) |

### 2.6 Tricount

Sources: App Store (Korea) https://apps.apple.com/kr/app/tricount-%EA%B7%B8%EB%A3%B9-%EC%B2%AD%EA%B5%AC%EC%84%9C-%EB%B6%84%ED%95%A0/id349866256 ; help https://tricount.com/en/how-to-share-tricount , https://www.tricount.com/en/do-i-need-a-login-or-account , https://tricount.com/en/who-can-access-my-tricount ; features https://tricount.com/update ; Kimola report https://kimola.com/reports/in-depth-tricount-app-feedback-report-reveals-crucial-insights-google-play-en-157042

| Dimension | Evidence |
| --- | --- |
| Navigation | ND |
| Group creation and sharing | Name the trip, dinner or household, invite members [V]. "Share" button at top right sends the link; the access URL sits under a Share tab; "before sharing you need to synchronize" [V help, via excerpts]. Anyone with the link gets full access rights; no login needed [V help] |
| Join | "Easier joining from invite links" (14.0.x) and "one-tap joining" (10.x) [V release notes] |
| Settling | "tricount suggests repayments for you to check before settling" [V]. In-app payment requests [V]. 14.2.0: share what outside friends owe you even if they do not use the app [V] |
| Insights | Statistics removed then restored; a pie chart shows where group spending is concentrated [V developer reply] |
| Offline | Log expenses without connection, "Sync when you are back online" [V]. A Google Play report cites sync problems and lost expenses [S, paid-report marketing page] |
| Notifications | 13.5.0: notifications "link directly to the relevant part of the app" [V] |
| Languages | 37 languages including Arabic, French, Hindi, Indonesian, Spanish, Turkish [V]. No Malagasy |
| Accessibility | VoiceOver support added (11.5 to 11.7) and "add expenses with VoiceOver" (14.2.0) [V] |
| Visual style | 11.0.0 "new look and icon, dark mode by default" [V]. A reviewer: redesign "added confusing emoji throughout the interface" [V App Store, 14 Aug 2024]; custom emoji per tricount is a documented feature (10.x) [V] |
| Pricing and rating | Developer: "free with no subscription, no hidden fees, and no limits" [V company claim]. 4.7 from 69 (Korea) |

### 2.7 Open Collective

Sources: https://docs.opencollective.com/help/expenses-and-getting-paid/submitting-expenses ; https://docs.opencollective.com/help/collectives/expenses ; https://docs.opencollective.com/help/collectives/budget ; https://docs.opencollective.com/help/product/ledger . The docs carry a banner saying some pages are out of date after the new Dashboard.

| Dimension | Evidence |
| --- | --- |
| Navigation | Collective public page with a Budget section; Expenses tab and Transactions tab; admin Dashboard [V] |
| Public page / home | "Simple Budget": Today's Balance, Total Raised, Total Disbursed, Estimated Annual Budget, plus recent transactions; or "New Budget Visualisation" with graphs and categories, toggled in page settings [V]. Private information (emails, attachments) is hidden [V] |
| Expenses and transactions lists | Expenses tab filters: Type, Payout, Period, Amount, Status, tags. Transactions tab filters: Type, Period, Amount, Kind. CSV export of transactions [V] |
| Ledger principle | "Transactions can only be added to the ledger", never edited; deleted entries are hidden from lists and exports; funds moved off-platform do not appear unless manually added [V] |
| Expense submission (steps) | 1 Click Submit Expense. 2 Choose Reimbursement or Invoice; page shows the Collective balance and expense policies. 3 Payee (individual or organisation). 4 Payout method (bank transfer via Wise, PayPal or custom). 5 Type-specific form (title, receipts, item description, date, amount). 6 Expense summary, optional private note, Submit expense. About 6 steps [V]. Optional recurring expense with frequency and end date [V] |
| Approval flow | Collective admin approves as a valid use of funds; Fiscal host admin then pays; "Expenses cannot be paid if there are insufficient funds in the Collective balance" [V]. Approval rules are per project; the docs recommend agreeing guidelines [V]. Rejection notifies the submitter and suggests a reason comment [V] |
| Status vocabulary | Draft, Unverified, Pending, Approved, Rejected, Scheduled for Payment, Processing, Error, Paid, Spam, Incomplete [V], with definitions such as "Processing: paid by the Fiscal Host, awaiting confirmation from Wise or PayPal" |
| Voting | None |
| Notifications | Admins get email with expense details; submitter notified on approval or rejection [V] |
| Languages, offline, accessibility | ND |
| Complaints | Fiscal host switching blocked until balance is zero and slow [S https://opencollective.com/mutual-aid-alnwick/updates/fiscal-host-issues ]; payment-modal and multi-currency rate bugs [S https://opencollective.ecosyste.ms/collectives/opencollective-oss/issues?page=7 ]; invoices lacking enough description for outsiders [S https://write.as/nikclayton/stepping-back-from-the-tusky-project ]; payment issues [S https://talk.tiddlywiki.org/t/opencollective-payment-issues/11436/8 ] |

### 2.8 Monzo (pots)

Sources: https://monzo.com/features/pots/ ; https://monzo.com/blog/2018/12/10/joint-pots ; https://monzo.com/blog/2019/09/26/introducing-salary-sorter-and-bills-pots ; App Store https://apps.apple.com/us/app/monzo-bank-better-money/id1052238659 ; community threads https://community.monzo.com/t/monzo-redesign-a-retrospective/95953 , https://community.monzo.com/t/app-layout-why-is-mine-different/76787 , https://community.monzo.com/t/we-re-launching-grow-tab-sign-up-for-early-access/190853 , https://community.monzo.com/t/am-i-using-the-app-right/90806

| Dimension | Evidence |
| --- | --- |
| Navigation model | History: 2017 Android bottom bar with Spending, Card, Contacts [S, from a 2017 blog title and excerpt: https://monzo.com/blog/2017/08/01/bottom-nav-bar ]. Later layout of 5 tabs: Home, Summary, Accounts, Payments, Help [S]. Redesign trial: bottom bar reduced to Home, Payments, Help (icon-only in the trial), Summary and Account tabs removed, pots and accounts reached by a "View all" or swipe-down [S]. A Grow tab (savings, investments, pension, home equity; "now" versus "future" split) was later added to the bottom bar and Trends moved to Home [S community post, date not shown]. The current official tab list was not verified [U] |
| Home | Default is the transaction feed [S, Monzo staff in community]. Home now holds Trends, Pots, Cashback, credit insights and insurance; users call it cluttered and cannot remove items [S] |
| Pot detail | Up to 20 pots per personal or joint account; name and image; hide or lock; "Edit scheduled payments" inside a pot; pot movements show as two feed transactions [V]. Create Pot is on the Account tab (2018 blog) [V]. Joint pots work "just like you'd expect"; who can add or withdraw, visibility and notifications are not stated [V, absence] |
| Rules | Salary Sorter: tap the salary payment (or any incoming payment over 100 GBP); the app proposes a split into pots; it remembers the split, so next payday is one tap; sorting is manual, not automatic [V blog]. Bills Pot: convert a regular pot, choose which Direct Debits or standing orders it covers, fund it, money moves on the due date; warning the day before if short [V blog] |
| Contribution or payment steps | Salary Sorter: tap payment, check amounts, confirm [V], about 3 steps [U count]. Undo a payment within seconds if it has not left [V App Store] |
| Approval | None for personal pots. Joint accounts: not documented |
| Voting | None |
| Notifications | "Instant notifications" [V App Store]; Bills Pot shortfall warning [V] |
| Offline | ND |
| Languages | English and Spanish [V App Store] |
| Visual style | Cross-app consistency of buttons, icons, colours and type (student teardown) [S]; card-based layout praised, "generic and a bit sad" criticism [S community] |
| Complaints | Pots lack a full transaction history screen, causing reconciliation trouble ("A nightmare for business accounts") [S]; Android back button exits app; payments tab role muddled; credit cards shown at the same level as pots [S]; "scheduled payments" label misleading, should be "scheduled transfers" (App Store, 23 Jan 2023); bill tracking scattered, hard to know whether bills are covered between paychecks (App Store, 19 Sep 2024); account freeze with no response [V App Store]. Rating 4.7 from 5.7K |

### 2.9 YNAB

Sources: App Store https://apps.apple.com/us/app/ynab-budget-planner/id1010865877 ; help https://support.ynab.com/en_us/spotlight-BkdHBZUokg.md , https://support.ynab.com/en_us/colors-and-icons-in-your-plan-HJQv_XHko.md , https://support.ynab.com/en_us/updates-to-ynab-S1f4aRLeC.md

| Dimension | Evidence |
| --- | --- |
| Navigation | Mobile tabs named in help: Home, Plan, Spending, Reflect; Accounts is referenced; full tab list and order not stated [V partial]. Add Transaction button at the bottom of Home, Plan and Spending tabs [V]. Support via "Connect with Our Team" at the bottom of Home or the three-dots menu [V] |
| Home hierarchy (mobile) | Header with plan name, greeting, three-dots to Settings and Privacy, gift icon; then Pinned Categories; Current Goal; "[Month] Summary" with four figures (Total Targets, Assigned, Underfunded, Spent) each linking onward; Assigned in Future Months with pie graph; For You (content). Any section collapsible [V] |
| Status colours | Red: cash overspending; Yellow: underfunded; Green: available positive and targets on track; Gray: zero and not underfunded. Icons: credit card with exclamation, calendar, partly filled pie, green circle, Zz snooze [V] |
| Rule-like behaviour | Ready to Assign banner then Auto-Assign for underfunded [V]. Plan Reset returns available money to Ready to Assign [V App Store] |
| Approval | Card Mode: swipe right to approve, left to skip transactions, with List Mode retained [V]. Shared plans for up to six people on one subscription, real-time [V] |
| Onboarding | "Initial setup takes several hours" (2021 review) [V App Store]; "Set up YNAB at your own pace" release article exists [S search result] |
| Languages, offline | English only [V]. Offline ND |
| Complaints | Interface changes too often, new Home Screen cluttered, badges hard to interpret, floating add button, moved menu buttons cause mis-taps (2025); bank connection difficulty; credit card budgeting "not intuitive" (2021) [V App Store]. Rating 4.8 from about 62K. Price complaints are in `02` |

### 2.10 Loomio

Sources: https://www.loomio.com/docs/en/user_manual/polls/intro_to_decisions ; https://www.loomio.com/docs/en/user_manual/polls/quorum ; https://www.loomio.com/how-it-works/ ; community critique https://lists.openstreetmap.org/pipermail/tagging/2015-May/024798.html , https://socialhub.activitypub.rocks/t/2021-04-23-social-cg-meeting/1621?page=2

| Dimension | Evidence |
| --- | --- |
| Navigation | Group page with threads, Polls tab, Files tab, tags, search, subgroups [V] |
| Starting a decision | In a discussion: reply area, "Start a vote", choose a template. Or Polls tab, "New poll", choose a template [V]. Proposal templates: Sense check, Advice, Consent, Consensus. Poll types: Choose, Score, Allocate, Rank, Time poll, STV Election [V]. Group admins can create reusable poll templates [V]. At least 4 steps (entry point, template, configure, start) [U count] |
| Timing | Opens immediately, or on an opening date (visible but not votable), or saved as draft. Closes automatically; a coordinator can close early or reopen with a new time (not anonymous polls) [V] |
| Quorum | Set in "More settings" under "Participation quorum" as a percentage; blank means none. The results panel shows quorum as not reached before any votes and a green check mark when met; participation is measured against eligible voters. What happens when the deadline passes without quorum is not stated [V] |
| Voting UX | Voters can vote, explain their vote, change it while open. Results update live unless hidden until close. Anonymous votes hide results until close, no reasons, no changes [V] |
| Outcome and decision log | On close, Loomio prompts coordinators to enter an outcome; it states what was decided and next steps and appears above results. Optional Review date triggers a reminder to revisit [V]. Searchable archive, export of poll results to spreadsheet, print or PDF [V] |
| Notifications | Notified when voting opens; default reminder to non-voters one day before closing; email with results when outcome published; email digest option; vote by clicking a link in the email; chat integrations (Slack, Teams, Discord, Matrix); guests invited by email to a single discussion [V] |
| Offline | ND. No mobile app is a documented complaint in one party's discussion [S] |
| Languages | ND on the how-it-works page |
| Complaints | Participation: about 5 or 6 of 40 users per proposal, mostly the same people (2015) [S]; an ICANN task-force pilot saw low participation [S]; UX "severely lacking" versus Discourse (2021) [S]; the lack of an app hurts mobile-first users [S]. Raw `04` records 17% turnout at Chi Hack Night |

WhatsApp polls (for comparison, [S]): tap to vote, tap again to remove, tap another to change; "View votes" shows who voted; older guides list up to 12 options and no expiry or anonymity; a 4 Aug 2026 report says deadlines and anonymous voting were added [https://t2online.in/tech/tech-news/whatsapp-adds-poll-deadlines--anonymous-voting-and-an--all-tag-to-group-chats/2007011 , https://timelines.ai/creating-and-using-polls-on-whatsapp]. No quorum was found.

### 2.11 MVola (Madagascar)

Sources: App Store https://apps.apple.com/us/app/id1496566692 ; press https://newsmada.com/?p=197781 (dated 3 Oct 2026)

| Dimension | Evidence |
| --- | --- |
| Navigation | Release 24.1: "redesigned interface, a 'Voir tout' (see all) services view, and a simplified menu" [V App Store]. Tab structure ND |
| Home / features | Instant transfers, bill payments (utilities, school fees), QR payments at merchants, airtime and data bundles for self or others, biometric login and PIN, MVola Credit (stated 9%), Savings (stated 4% a year, paid quarterly) [V]. 24.2: reward and ranking views, progress tracking [V] |
| Transaction history | An older listing mentions history of the last 10 transactions [S, Yas et moi listing, 2.3 stars from 18 ratings] |
| Security UX | 21.99: connected-device management and an emergency account-lock for suspected fraud [V] |
| Onboarding / KYC | ND |
| Redesign process | Announced 2 Oct 2026: based on usage analysis, customer complaints and user tests; beta through "MVola Lab"; regular improvements promised. No feature list [V press] |
| Offline | Review in Malagasy (24 Apr 2025): the app needs a data connection; purchases fail without it and the user is "forced to dial *#111#" [V App Store, translated] |
| Languages | Store lists English, description is French, reviews say it is French only; two reviews (28 Sep 2024, 20 Oct 2025) ask for English. Malagasy interface is not documented, although one review is written in Malagasy [V, conflicting] |
| Accessibility | Developer lists none [V] |
| Permissions | Approximate location (agents, merchants), camera (QR), contacts, storage (receipts), push [V] |
| Complaints and rating | 4.2 from 192 ratings (US storefront); raw `03` records 4.3 from about 5K on another storefront. Positive: "Simple et rapide" |

### 2.12 M-Pesa app (Safaricom Kenya and Vodacom Tanzania)

Sources: Vodacom Tanzania App Store https://apps.apple.com/app/id1313948420 ; Safaricom page https://safaricom.co.ke/personal/value-added-services/information-services/m-pesa-app (HTTP 403 on fetch, read only as a search excerpt) ; secondary https://khusoko.com/2021/07/06/mpesa-super-app-the-new-way-to-transact-more-fast-and-conveniently/ (503 on fetch, search excerpt)

| Dimension | Evidence |
| --- | --- |
| Navigation and home | Safaricom: "simpler interaction with key features and shortcuts on the homepage"; offline access to key features; biometric login; mini apps for travel, lifestyle, utilities [S, search excerpt of an official page]. Tanzania: "M-PESA SUPER APP" with redesigned homepage "access to services for quick transactions" [V App Store] |
| Offline | Safaricom 2021: offline mode for Send Money, Lipa Na M-Pesa, withdrawals and airtime without data [S]. Tanzania review: "unreliable without an internet connection" [V App Store] |
| Spend view | "My Spend" home-screen card with category breakdown [S 2021] |
| Authentication | Touch ID, Face ID or 4-digit M-Pesa PIN [V Tanzania] |
| Onboarding | Browse features without logging in; non-Vodacom subscribers register via agents and shops [V Tanzania] |
| Other | "AI pay" scans Lipa Namba codes; store locator for agents; network coverage check [V Tanzania] |
| Languages | English and Swahili [V Tanzania] |
| Complaints | Crashes, some transactions 30 to 45 minutes, outdated interface, no dark mode [V App Store reviews, 2025] ; Kenya: Fuliza suspension on 30 Sep 2025 after a technical hitch and complaints of delayed or missing SMS notifications [S https://peopledaily.digital/news/kenyans-left-confused-as-fuliza-crashes , https://thekenyatimes.com/business/safaricom-responds-after-users-complain-of-delayed-m-pesa-messages/ ]. Rating 4.8 from 1.7K (Tanzania) |

---

## 3. Short profiles

| Product | Evidence |
| --- | --- |
| PiggyVest (Nigeria) | Product ladder: Autosave, Target Savings ("multiple goals or group saving"), Quicksave, Safelock (locked), Flex Naira, Flex Dollar, Investify; monthly interest alerts; "interface cleanup" and dark mode in release notes; Safelock rollover toggle "with an explanatory pop-up"; liveness check on some requests [V https://apps.apple.com/app/id1263117994 ]. English only, 4.6 from 7.5K [V]. Complaints: unexplained interest shortfalls, "glitches", blocked withdrawals, BVN and card data requests at onboarding [V App Store, 2020 and 2024 reviews]. unitQ score 78, down 9 in 30 days, no review text [S https://www.unitq.com/unitq-scorecards/piggyvest/ ]. 3.5% to 5% early-withdrawal penalty on locked plans [S brands.ng] |
| Orange Max it (Madagascar) | Bundles line management and Orange Money: balances and consumption, top-up, bundles, transfers, bill payments (water, electricity, TV), Visa card, savings and loans, marketplace, tickets [V https://apps.apple.com/mg/app/orange-max-it-madagascar/id1295171817?l=fr-FR ]. Fully redesigned 4.0 (Dec 2021), new UI 3.0 (Dec 2020) [V]. English only listed, 3.1 from 76. Complaints: "slow, crashes and restarts, poor ergonomics with too many buttons, menus, and submenus"; OTP SMS not received; Orange Money debited without credit delivered (20 Sep 2025, twice) with developer replies pointing to phone line 204 and a website [V] |
| Wave Mobile Money (Senegal and five others) | Transfers 1% fee, free deposits, withdrawals and bill payments; French and English; 4.4 from about 51K; 25 consecutive release notes read "bug fixes and UI improvements" [V https://apps.apple.com/ci/app/wave-mobile-money/id1523884528 ]. Savings vault: reviewers (19 May 2024, 25 Sep 2024) want a depositor-set unlock date because the current vault is "not useful as currently presented" [V]. Free QR card for users without smartphones lets them transact with an agent [S https://www.africaprivateequitynews.com/p/west-africa-mobile-money-company-raises-200m ]. No onboarding steps published [V site] |
| Wave Money Myanmar (CGAP deck, not Senegal) | Sign-in with phone number plus code, "5-step process"; shallow home menu with shortcut labels Send Money, Buy Airtime, Home, Help, Settings, Transaction History; airtime split into two screens (who, then how much) after an early single-screen prototype overwhelmed customers; confirmation screen then receipt with colour and tick cues; in-flow help assistant [V https://www.cgap.org/sites/default/files/publications/slidedeck/principlesofsmartphonedesign05oct16-161005230428.pdf ] |
| Kuda (Nigeria) | Release 3.006: identity confirmation on device change, warning before sending to a bank with known issues, tap-to-view transfer status, alert when connection drops during a transfer or bill payment; 4.6 from about 218K [V https://apps.apple.com/ng/app/kuda-money-app-for-africans/id1467373738 ]. Reviews: chat-style transfer view liked; Face ID does not fall back to PIN after two failures; "successful" transfers not received; in-app help sends generic articles [V] |
| Moniepoint (Nigeria) | Four-step onboarding: download, email and phone with OTP, username and password, then BVN, KYC and face and ID checks; about five minutes [S Moniepoint marketing pages]. KYC levels: L1 single debit 50,000 and daily 300,000 NGN; L2 100,000 and 500,000; L3 daily 5,000,000 [S support page excerpt https://support.apigateway.moniepoint.com/topics/account-opening-and-kyc-related-inquiries-235/what-are-the-transaction-limits-for-each-kyc-level-461 ; help page returned 403]. Complaints: restricted accounts, weeks to resolve [S https://au.trustpilot.com/review/moniepoint.com ] |
| Qapital | Eight named rules: Set and Forget, Round Up, Guilty Pleasure, Spend Less, Freelancer (percentage of each deposit over 100 USD), 52 Week, Apple Health, IFTTT [V https://www.qapital.com/blog/save-money-qapital-rules ]. No rule-creation steps and no preview described in any source read. Dream Team shared goals show one another's transactions without sharing accounts [S, store text via search] |
| Goodbudget | Manual envelopes (Monthly and Annual); no bank sync; sync between devices; free plan 2 devices [S https://www.pcworld.com/article/3287145/goodbudget-review.html ] |
| Cashew | Customisable home with widgets, budgets with per-category limits, Material You theming, translations via a shared spreadsheet; sharing and offline not stated [V https://github.com/jameskokoska/Cashew ] |
| StokFella | iOS listing: payments, claims and meetings; outstanding payments with reminders; meeting date, host and change alerts; group finance, goals, membership growth [V https://apps.apple.com/app/id1058855642 ; 3.1 notes 2019; 3.8 from 4 ratings]. An "on behalf" function lets a member capture payments and claims for someone illiterate or without a smartphone [S, search excerpt of https://www.howwemadeitinafrica.com/entrepreneur-simplifying-running-south-africas-stokvels-smartphone-app/57201/ ]. OTP on each login; voucher payout option [S press] |
| Jumia and Jiji (marketplace only) | Cash on delivery used to counter fear of being scammed; up to 75% of Jumia Nigeria business was pay-on-delivery, Jumia Pay meant to shift to prepayment [S https://techcentral.co.za/?p=180086 ]. No primary source on either app's escrow or trust-badge UI |

## 4. Design-research evidence on low-literacy and emerging-market mobile money

| Source | Findings |
| --- | --- |
| CGAP, Smartphones and Mobile Money: Principles for UI/UX Design, Oct 2016 [V] | 21 principles. Those that bear on Gereo: explore before registering (01); simplify registration (03); flatten menu hierarchy (04); focus menus on actions, not navigation (05); reduce text, use visual cues (06); design icons relevant to local users, multicolour and less abstract worked better, "?" was not understood as help, a person with a headset was (07); plain local words, for example "Find Shop" rather than "Local Agent" (08); build on Android familiarity (09); pre-fill from past use and contacts (10, 11); validate in real time before "Next" (12); digestible chunks (13); confirm, then receipt (14); a history with in-progress, pending and failed states (15); contextual help inside the flow (16); errors with a next step (17) |
| Medhi, Gautama, Toyama, CHI 2009, Microsoft Research India [V] | Ethnography with 90 subjects (India, Kenya, Philippines, South Africa) and a usability test with 58 subjects: non-text designs strongly preferred over text; rich multimedia gave better task completion, spoken dialog was faster with less assistance; human mediation matters |
| Srivastava et al., SARAL, ACM CSCW 2021 [V abstract] | Framework of actionable UI guidelines for low-literate smartphone users from two decades of HCI literature, evaluated with 20 practitioners |

---

## 5. (a) Comparison matrix

"ND" = not documented in sources read. Tabs and counts are given only where a source states them. Strongest and weakest patterns are the author's judgement ([U]) from the evidence above.

| Product | Navigation | Home | Wallet / group detail | Onboarding steps | Contribution / payment steps | Approval | Voting | Offline | Languages | Strongest pattern | Weakest pattern |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Stanbic Chama | ND (wallet, Chama summary, chat) | Wallet and group dashboard; outstanding invoices amount | Member-visible searchable ledger; named classifications | Phone number, ID scan and selfie before joining a group | Fund wallet (3 inputs via Paybill) then pay (about 3 selections); amount pre-filled from invoice | Role matrix; multi-approver ND | Chat poll only | ND | English | Invoice-driven pay with pre-filled amount and classification vocabulary | Two-stage funding outside the app; no documented withdrawal approval; no reviews to learn from |
| Chamasoft | ND | ND; redesigned three times | Statements, reports, cash book | Group setup, OTP | Invoicing plus M-Pesa wallet; steps ND | Loan approvals only | None (meeting records) | Partial since 2021 | ND | Fines and meeting attendance built in | Home and flow not documented; M-Pesa prompt bugs; 16% one-star on Android |
| Money Fellows | ND | ND | Circle schedule, payout turn | 5 (details, OTP, payment details, contract) | 4 to join; fee tied to payout position | Platform-run | None | ND | Site EN and AR; app listing EN | Legal contract and full schedule shown before joining | ID verification failures; support latency; up to 16% fee |
| yaNkap / Tonti+ | ND; web creation plus app | ND | Turn order, balance, auto messages in chat | ND | Mobile money per member; steps ND | Payout when all paid; admin blocked from self-payout (Tonti+) | None | USSD (Tonti+) | FR, EN | Automatic late detection with "cotisation fluide" and a visible score | Transactions blocked 3+ days in one review; credibility score may shame |
| Splitwise | 3 tabs (S, weak) | ND | Who owes whom; edit history, comments | ND | "Add bill" about 4 fields (S) | None | None | Offline entry | 13 | Debt simplification; edit history | Daily-entry cap and countdown on free tier |
| Tricount | ND | ND | Shared list, suggested repayments, insights | None required (link only) | Add expense offline; steps ND | None | None | Offline entry, sync later | 37 | Link-only joining, offline, VoiceOver | Full rights to anyone with the link; redesign emoji confusion; sync loss reports (S) |
| Open Collective | Public page tabs: Expenses, Transactions; dashboard | Simple Budget: balance, raised, disbursed, estimated annual budget | Public immutable ledger, filters, CSV | ND | Expense: about 6 steps | Collective admin then fiscal host admin; 11 statuses | None | ND | ND | Public ledger plus explicit status vocabulary | Out-of-date docs; slow host switching; payout rails limited (per `01`) |
| Monzo | 3 to 5 tabs depending on era; Grow tab added (S) | Feed first; cluttered with cards | Pots up to 20; no full pot history screen (S) | ND | Salary Sorter about 3 steps, remembered split | None (joint ND) | None | ND | EN, ES | Salary Sorter remembers the split; Bills Pot with day-before warning | Pot labels ("scheduled payments"); home clutter; hidden pot history |
| YNAB | Home, Plan, Spending, Reflect (+ Accounts) | Pinned categories, goal, 4-figure summary | Category colours and icons | Setup takes hours (review) | Add Transaction button on three tabs | Card Mode swipe approve | None | ND | EN | Four-colour status with icons; one-gesture approval | Learning curve; frequent redesign |
| Loomio | Threads, Polls tab, Files | Group threads | Outcome above results; review date | Sign-in by Google, email code or password; guest by email | Start vote: at least 4 steps | None (no money) | Deadline, quorum %, outcome, reminders | ND | ND | Outcome plus review date; vote from email link | Low turnout; no native app complaint |
| MVola | Simplified menu, "Voir tout" (24.1) | Services view, rewards (24.2) | Last 10 transactions (older listing) | ND | ND | None | None | Needs data; USSD fallback | French (store EN) | Emergency account lock; device management | French only; data required |
| M-Pesa (TZ and KE) | Shortcut home; mini apps | Quick actions, My Spend (S) | ND | Browse before login; agent registration | ND | None | None | Offline mode for 4 key actions (S) | EN, SW (TZ) | Offline for the core actions | Crashes; slow transactions; no dark mode |
| PiggyVest | ND | Product ladder | Plan types with locks | BVN and card requests resented | ND | None | None | ND | EN | Locked plans with explanatory pop-up | Unexplained interest drops; blocked withdrawals |
| Orange Max it | Many buttons and submenus (review) | Super-app services | ND | OTP | ND | None | None | ND | EN listed | Single app for line plus wallet | Clutter; OTP failures; debited without delivery |
| Wave (Senegal) | ND | ND | Savings vault | ND | Free deposit and withdrawal, 1% transfer | None | None | QR card for non-smartphones (S) | FR, EN | Fee clarity; free QR card | Vault lacks date-lock |
| Kuda | ND | Redesigned home | Chat-style transfers | Device-change identity confirmation | Tap-to-view status | None | None | Connection-drop alert | EN | Honest transfer status and connection alerts | Face ID has no PIN fallback; "successful" but not received |
| Qapital | ND | ND | Goals, Dream Team shared | ND | Eight rule types | None | None | ND | ND | Named, human-readable rule templates | No preview documented |

---

## 6. (b) Patterns to adopt, avoid, and open opportunities, by Gereo screen type

Each line gives the evidence in brackets. "Adopt" means a pattern documented as working or praised. Items marked [U] are my design inference.

### 6.1 Onboarding and KYC

Adopt
- Let people look around before registering; require phone and OTP first, ID later [CGAP 01 and 03; Money Fellows complaints show the cost of gating early; Stanbic gates only at group join].
- Show tiers as a ladder ("what you can do now, what unlocks next") with the limits of each [Moniepoint tiers with explicit single and daily limits, S].
- Treat "pending review" as a real screen with expected wait and what still works [KYC practice sources, S; Money Fellows "request is still open" shows the failure].
- Provide a language choice on the first screen: French, Malagasy, English [MVola reviews; yaNkap switchable; Tricount 37 languages].
- Ask for ID only when it is needed: money movement, caps, or group treasurer [Stanbic requires it before forming or joining; Gereo can defer further, [U]].
- Device-change identity confirmation and connected-device list with an emergency lock [Kuda 3.006; MVola 21.99].

Avoid
- Repeating document requests (salary slip every three months) [Money Fellows reviews].
- Unexplained rejection of an ID photo ("keeps rejecting my national card") [Money Fellows]; always state the reason and the retake tip.
- Collecting BVN-like data and a card at first launch with no explanation [PiggyVest 2020 review].
- OTP that depends on one channel with no alternative [Orange Max it SMS not received].

Open opportunities
- Visible "why we ask" copy and a retake guide in Malagasy; no competitor documents this. [U]
- Assisted registration for people without a smartphone, at the group level, in the manner of StokFella's "on behalf" capture [S] and Wave's QR card [S]. Legal feasibility is out of scope here.

### 6.2 Home dashboard

Adopt
- A short list of actions first, not menus [CGAP 04, 05; Wave Myanmar shallow home].
- A hierarchy where the first block answers "what needs me now": pending approvals, votes closing, contributions due. YNAB's Home puts Pinned Categories, one Current Goal and a four-figure monthly summary before anything else [YNAB]; Stanbic leads with outstanding invoices [Stanbic].
- Collapsible sections the user controls [YNAB].
- Status colour paired with an icon and a word, never colour alone [YNAB colours and icons; CGAP 06 colour plus tick plus text].
- A last-synced timestamp when stale (see 6.12) [U, from Safaricom offline mode and MVola data-required complaint].

Avoid
- Letting the home become a catalogue of products (Monzo home cluttered with cashback, insurance, credit insights; Orange Max it submenus) [Monzo community, Orange review].
- Adding a content or promotion section on home ("For You" in YNAB) [U; low value for Gereo's trust positioning].
- Frequent layout changes: YNAB, Chamasoft (three redesigns), Money Fellows all drew complaints [reviews cited above].

Open opportunities
- One cross-wallet "safe to spend" figure that includes money in group envelopes. Monzo's budgeting ignores pot money and users find bill coverage between paychecks hard to know [Monzo App Store review 19 Sep 2024]. [U]

### 6.3 Wallet detail and ledger

Adopt
- A named transaction vocabulary shown on every row: Joining Fee, Contribution, Penalty, Disbursement [Stanbic]. Add Gereo's "Rule: name" as a classification [U].
- A full status vocabulary with definitions, not three states: Open Collective's list (Pending, Approved, Scheduled, Processing, Paid, Error, Incomplete) gives the shape [Open Collective].
- Transaction detail with fee, reference ID, date and time, and a repeat button [CGAP 14, 15].
- Pot or wallet movements appear in the main feed as paired entries [Monzo shows two feed entries; make sure each wallet also has its own full history, which Monzo users say was missing, S].
- Immutable entries: corrections added as new entries [Open Collective ledger].
- Tap-to-view transfer status and an alert if connection drops mid-payment [Kuda].
- Filters by type, period, amount, status; CSV export [Open Collective].

Avoid
- "Successful" shown before the recipient has the money [Kuda reviews].
- "Debited but not delivered" with no in-app trace [Orange Max it reviews, 20 Sep 2025; PiggyVest]. Show the provider reference and a one-tap "report this payment" that attaches it.
- Mislabelled actions ("scheduled payments" that are really transfers) [Monzo App Store review 23 Jan 2023].

Open opportunities
- A per-entry "why" line from the rule engine ("40% to Savings by rule Split salary") with a link to the rule. No source documents this; Monzo Salary Sorter remembers a split but does not document an explanation per entry [V blog, absence]. [U]

### 6.4 Group wallet transparency view

Adopt
- All members can see all group transactions, searchable, real time [Stanbic].
- Public-page pattern as an option: Today's Balance, Total Raised, Total Disbursed on top, recent transactions beneath [Open Collective Simple Budget]. For Gereo, make public optional and default to members only [U].
- Mentor or observer role with view only [Stanbic Mentor].
- Hide private details (emails, attachments) on shared views [Open Collective].
- Member contribution status board with paid, pending, late [yaNkap late detection; Stanbic outstanding invoices].
- Constitution or rules visible before joining and reachable later [Stanbic].

Avoid
- A single person who both runs the group and holds the keys [raw `01` Cameroon losses; Tonti+ blocked admin self-payout is the counter-pattern].
- Credibility scores as public shame [yaNkap score, S risk]; if used, show to the member and the treasurer only [U].
- Link-only full-rights access for a money group [Tricount grants full rights to anyone holding the link; acceptable for splitting expenses, not for custody] [U].

Open opportunities
- Reconciliation line on the group page: "ledger total equals provider balance as of hh:mm". Nothing found documents a visible reconciliation to members. [U]

### 6.5 Rule builder

Adopt
- Named, human-readable templates rather than a blank builder [Qapital's eight named rules].
- Remember a choice and reuse it with one tap [Monzo Salary Sorter].
- Show a failure plan: what happens when money is short [Monzo Bills Pot: uses what it has, takes the rest, warns the day before].
- Start with a very small set of templates (Gereo already proposes four) [consistent with Qapital's popularity of simple rules; the "most popular rule" claim is S].

Avoid
- Manual sorting that users forget, or that runs after fixed payments leave [Monzo community complaints about manual effort and timing].
- Third-party rule builders for core rules [Qapital edits IFTTT rules on IFTTT's site, V help].

Open opportunities
- Preview before enabling ("if your last 3 incomes had arrived, this rule would have moved X to Y"). No product documents a preview; Qapital documentation read does not mention one [V, absence]. [U]
- Automatic, not manual, application on every income, with loop prevention and each firing logged. This is Gereo's stated differentiator and Monzo's own staff described full automation as "planned for later" [V Monzo community, Salary Sorter thread].

### 6.6 Contribution flow

Adopt
- Invoice or due item with amount pre-filled; pick the group and the classification only if more than one applies [Stanbic Q27].
- Automatic reminders on a schedule and, for Gereo, push then SMS [Stanbic notifications; Loomio 24h reminder; raw `04`].
- Late handling with a visible remedy such as advancing a late member's share (opt-in per group) [yaNkap "cotisation fluide"].
- Confirmation screen then receipt with amount, fee, time, ID [CGAP 14].
- Real-time validation of amount against balance before "Next" [CGAP 12].
- Split into small chunks: who, then how much [Wave Myanmar airtime].

Avoid
- Making the member leave the app and type a Paybill number and a composed account number (555 plus phone) [Stanbic Q28]. For Gereo, hand off to the provider prompt from inside the flow [U].
- Fees only shown after the fact; show exact fee before confirmation [CGAP 14; `../competitive-analysis.md` constraint 5].
- Fee schedules that depend on payout position without a simple calculator [Money Fellows 0% to 16% by position].

Open opportunities
- Pay on behalf of a member (cash received by the treasurer, recorded with a second member's confirmation) [StokFella "on behalf" function, S]. [U for Gereo's dual confirmation]
- USSD or SMS "pay" confirmation for members with basic phones [Tonti+ USSD pilot, S].

### 6.7 Expense approval

Adopt
- Policy text shown on the request form: what the group allows, with the current balance [Open Collective submit page].
- Two named roles and states: requester, approver, payer; status list including "Incomplete" with a comment trail [Open Collective].
- A rule that cannot pay if funds are insufficient [Open Collective].
- Comment on rejection, notify the requester [Open Collective].
- One-gesture approval for routine items with a list fallback [YNAB Card Mode]. For money outflows, require a confirm step with exact payee and amount [U].
- Plain-language summary of amount, payee, wallet, rule on the approval screen [`../competitive-analysis.md` design rules; Kuda warns before sending to a bank with known issues].

Avoid
- Approvals that happen only by email [Open Collective admin email model; Gereo members may lack email].
- Single treasurer approves everything: Stanbic's role matrix makes Chairperson and Treasurer both able to pay, and multi-approver is not documented [V absence].

Open opportunities
- Threshold-based multi-approver with the count shown ("2 of 3 approved") and a deadline. Standard Bank's South African stokvel terms require three digital signatories on its app [S, search excerpt], showing the model exists in banks but no consumer app documents its interface. [U]
- Link the request to a vote so approval is the vote result (see 6.8).

### 6.8 Voting and decision log

Adopt
- Start a vote from where the discussion is, using a template [Loomio "Start a vote"].
- Visible quorum progress with a green check when met [Loomio].
- Deadline, early close by a coordinator, reminder to non-voters 24 hours before closing [Loomio].
- Outcome statement written at close and displayed above results, plus an optional review date [Loomio].
- Change your vote until close; optional reasons [Loomio].
- Vote from an email link without a full session [Loomio]; for Gereo, from an SMS or WhatsApp link [U].
- Searchable archive, export [Loomio].
- Tap to vote simplicity [WhatsApp polls].

Avoid
- A polling feature with no deadline or quorum [WhatsApp polls older behaviour; Stanbic chat poll with none documented].
- Leaving "no quorum at deadline" undefined: Loomio's docs do not say [V absence]. Define it in the interface: extend, close as invalid, or fall back.
- Another account to create before voting [Chi Hack Night turnout 17%, raw `04`].

Open opportunities
- The only combination not found anywhere: vote result automatically creates the decision log entry and releases or blocks a linked expense [competitive analysis]. [U]
- Decision log entry with a "money moved" link back to the ledger. [U]

### 6.9 Project page

Adopt
- A single summary with budget linked to a wallet and spend to date [Chamasoft Project Management: "project costs and the contributions needed to fund them", V].
- Section collapse and a short summary of four figures [YNAB month summary].
- Group goals with picture and progress; allocated money moved out of the available balance and returnable [Stanbic].

Avoid
- A full project suite (Notion and Odoo drove non-experts away; raw `04`).

Open opportunities
- Project page whose timeline merges tasks, expense requests and decisions in one feed. [U]

### 6.10 Events

Adopt
- Meeting date, host and change alerts as a first-class object [StokFella listing].
- Attendance and agenda records tied to fines [Chamasoft 2.1.1 and automated fines 2.3.4].
- Share a link that opens the event without an account [Tricount link model, as precedent; Loomio guest-by-email].

Avoid
- Calendar sync in v1 [consistent with MVP scope].

Open opportunities
- RSVP reminders with SMS fallback and a "who is coming" count shown to everyone. No competitor documents SMS fallback. [U]

### 6.11 Permissions and sharing screen

Adopt
- A role matrix as a plain table: payments, invoices, invite, request loan, chat, view history, accept invitation [Stanbic Q16].
- Role chosen at the moment of invitation [Stanbic].
- Member status: Active, On-hold, Terminated, reversible [Stanbic].
- Invitee sees a limited view before accepting [Stanbic].
- Share by link, by phone number, from the phone book [Stanbic; Tricount link].

Avoid
- Link equals full rights [Tricount].
- Hidden admin power: the permission screen must show who can move money and any change in a log [`../competitive-analysis.md`].

Open opportunities
- Bundles named in everyday words with a one-line consequence ("Can move money up to 50,000 Ar with one more approver"). Stanbic's matrix lists privileges but not limits. [U]

### 6.12 Notifications

Adopt
- Notifications that deep-link to the exact item [Tricount 13.5.0].
- A per-recipient delivery log ("who was notified and, where available, who read it") [Loomio].
- Digest versus immediate choice [Loomio].
- Alerts when a transfer is interrupted by a connection drop [Kuda].
- Treasurer-configurable system notifications for invoices due and payments made [Stanbic].

Avoid
- Relying only on push or only on email [Safaricom SMS delays, S; MVola data requirement].
- Delayed or missing SMS without an in-app fallback [Safaricom news, S].

Open opportunities
- Push first, SMS if unread after a period, with the cost shown to the group owner. [U]
- Store a shareable status page for a payment so a member can show the provider reference by SMS when support is needed. [U]

### 6.13 Cross-cutting: offline and low data

Evidence: Safaricom offline mode for four core actions [S]; Chamasoft partial offline [V]; Tricount offline entry with later sync [V]; Splitwise offline entry [V]; MVola needs data and falls back to USSD [V review]; Tonti+ USSD [S]; Wave QR card [S]; M-Pesa Tanzania review "unreliable without an internet connection" [V].

Adopt: read-only offline view of balances and recent history with last-synced time; queue non-money entries (RSVP, expense drafts) for later.
Avoid: queuing money movement silently (no source tests this; provider callbacks and double notifications are in `../competitive-analysis.md`).
Open: a USSD or SMS command set for contribute, balance, and vote. [U]

### 6.14 Cross-cutting: language, visual style, accessibility

- Languages: Tricount 37, Splitwise 13, M-Pesa Tanzania 2 (English and Swahili), Wave 2, yaNkap 2, MVola effectively 1 with review demand for more, Orange Max it 1 listed. No Malagasy interface was found in any product [V listings].
- Icons: use literal, multicolour, action-specific icons; test locally [CGAP 07].
- Visual density: store text does not allow measuring density; the only primary visual-style statements are Tricount (dark mode by default, custom emoji) and Cashew (Material You, accent colours) [V].
- Accessibility: Tricount documents VoiceOver work [V]; most products list none [V, absence]. Add: text scaling, audio read-out of amounts and confirmations (CGAP says many users like to hear instructions and confirmations in their language, V deck; Medhi 2009 non-text and spoken designs preferred) [U for Gereo].

---

## 7. (c) Recommended MVP screens (26) for wireframing

Each screen derives from evidence above. IDs are for the wireframe backlog.

| # | Screen | One-line purpose | Main evidence |
| --- | --- | --- | --- |
| 1 | Welcome and language | Pick Malagasy, French or English and look around before registering | CGAP 01; MVola, yaNkap language evidence |
| 2 | Phone, OTP and PIN | Sign in with phone and OTP, then set a PIN or biometric | Stanbic Q2; Kuda; yaNkap PIN |
| 3 | KYC tier ladder and capture | Show what each tier allows and collect ID and selfie only when needed, with a pending state | Moniepoint tiers; Stanbic Q30; Money Fellows complaints |
| 4 | Home dashboard | Pending actions first, then wallets and group alerts | YNAB home; Stanbic wallet; CGAP 04 |
| 5 | Wallet list and create | See all wallets with type labels and create a new one | Monzo pots; PiggyVest ladder |
| 6 | Wallet detail and ledger | Balance, goal progress, rules, and a filterable history | Stanbic ledger; Open Collective filters |
| 7 | Transaction detail and receipt | Status timeline, fee, reference ID, rule name, "report this payment" | CGAP 14, 15; Kuda; Open Collective statuses |
| 8 | Money in, money out and transfer | Deposit, withdraw or move between wallets with fee preview and confirmation | CGAP 12, 14; Stanbic Q27 to Q29 |
| 9 | Rule builder with preview | Pick one of four templates, set it, preview effect, enable | Qapital; Monzo Salary Sorter |
| 10 | Rule detail and firing history | See what a rule did and pause it | [U] from rule-named ledger differentiator |
| 11 | Group home | Group balance, contribution board, pending approvals, open votes | Stanbic summary; Open Collective Simple Budget |
| 12 | Group ledger (transparency) | Searchable, exportable, member-visible ledger with reconciliation line | Stanbic; Open Collective |
| 13 | Invite and join | Invite by link or phone, show rules and role, accept or decline from a limited view | Stanbic Q14 |
| 14 | Contribution plan setup | Amount, frequency, deadline, optional penalty, late remedy | yaNkap; Chamasoft fines; Stanbic invoices |
| 15 | Pay contribution | Pre-filled due item, fee shown, one confirmation | Stanbic Q27; CGAP |
| 16 | Member status board | Paid, pending, late per member, with reminder action | yaNkap late detection; Stanbic outstanding invoices |
| 17 | Roles and permission bundles | Role matrix in plain words, plus a change log | Stanbic Q16 |
| 18 | Expense request | Payee, amount, wallet, receipt, policy text visible | Open Collective submit flow |
| 19 | Approval inbox and detail | Plain-language summary, "2 of 3 approved", approve or reject with comment | Open Collective approval; YNAB Card Mode (for routine items) |
| 20 | Create vote | Template, deadline, quorum, majority, optional linked expense | Loomio |
| 21 | Vote detail and cast | Options, quorum progress, deadline, change vote; opens from a guest link | Loomio; WhatsApp polls |
| 22 | Decision log | Outcome statement, review date, link to money moved | Loomio outcomes |
| 23 | Project page | Budget, tasks, expense requests and decisions on one page | Chamasoft Project Management; YNAB summary |
| 24 | Event and RSVP | Date, host, RSVP, attendee count, reminder state | StokFella; Chamasoft meetings |
| 25 | Notification centre and preferences | Deep-linked list, delivery state, push to SMS settings, digest option | Tricount 13.5; Loomio; Stanbic |
| 26 | Support, export and account safety | Ticket status, data export, connected devices, emergency lock | MVola 21.99; Kuda; `../competitive-analysis.md` design rules |

Cross-screen components to design once: status chip (word, icon, colour), amount-and-fee confirmation sheet, "last synced" banner, provider-unavailable banner, role badge, quorum meter.

---

## 8. Conflicts, caveats and gaps

1. Store ratings differ by storefront (MVola 4.2 from 192 here versus 4.3 from about 5K in `03`; Money Fellows 4.3 from 174 here versus about 4.1 from about 3.2K in `01`). Do not quote one as the product rating.
2. Splitwise free cap is 3, 4 or 5 per day depending on the source and date; the official number is unpublished.
3. MVola store language: listing says English, description is French, reviews say French only.
4. Monzo current tab list is unverified; the sources trace three eras only.
5. Safaricom M-Pesa app details come from search excerpts of official and secondary pages that returned 403 or 503 on fetch.
6. No product was found whose approval, voting or rule screens could be described step by step from primary sources apart from Open Collective (expense), Loomio (voting), Stanbic (payment, invite) and Monzo (Salary Sorter, Bills Pot). Treat the rest of the matrix cells as gaps to fill by hands-on use of the apps.
7. No Malagasy-language competitor interface, and no Airtel Money UX source, was found.
8. A hands-on walkthrough of Stanbic Chama, Chamasoft, Loomio, Open Collective and MVola on a real device is the cheapest next step to turn [U] items into [V].

## 9. Source index

Store listings: https://apps.apple.com/mx/app/chamasoft/id1489712788 ; https://app.sensortower.com/api/android/apps/chamasoft.app?country=KE ; https://apps.apple.com/app/id1564047823 ; https://apps.apple.com/us/app/money-fellows-online-circles/id1113492041 ; https://apps.apple.com/cm/app/yankap/id6754392382 ; https://apps.apple.com/app/id1058855642 ; https://apps.apple.com/us/app/splitwise/id458023433 ; https://apps.apple.com/pl/app/id458023433 ; https://apps.apple.com/kr/app/tricount-%EA%B7%B8%EB%A3%B9-%EC%B2%AD%EA%B5%AC%EC%84%9C-%EB%B6%84%ED%95%A0/id349866256 ; https://apps.apple.com/us/app/monzo-bank-better-money/id1052238659 ; https://apps.apple.com/us/app/ynab-budget-planner/id1010865877 ; https://apps.apple.com/us/app/id1496566692 ; https://apps.apple.com/app/id1313948420 ; https://apps.apple.com/app/id1263117994 ; https://apps.apple.com/mg/app/orange-max-it-madagascar/id1295171817?l=fr-FR ; https://apps.apple.com/ci/app/wave-mobile-money/id1523884528 ; https://apps.apple.com/ng/app/kuda-money-app-for-africans/id1467373738

Vendor documentation and blogs: https://sponsorships.standardbank.com/static_file/Kenya/filedownload/Chama/Chama%20App%20New%20FAQs.pdf ; https://www.moneyfellows.com/en-us/3elmelgeib-home/your-complete-guide-to-money-fellows-app ; https://yankap.cm/ ; https://tricount.com/en/how-to-share-tricount ; https://www.tricount.com/en/do-i-need-a-login-or-account ; https://tricount.com/update ; https://docs.opencollective.com/help/expenses-and-getting-paid/submitting-expenses ; https://docs.opencollective.com/help/collectives/expenses ; https://docs.opencollective.com/help/collectives/budget ; https://docs.opencollective.com/help/product/ledger ; https://monzo.com/features/pots/ ; https://monzo.com/blog/2018/12/10/joint-pots ; https://monzo.com/blog/2019/09/26/introducing-salary-sorter-and-bills-pots ; https://support.ynab.com/en_us/spotlight-BkdHBZUokg.md ; https://support.ynab.com/en_us/colors-and-icons-in-your-plan-HJQv_XHko.md ; https://support.ynab.com/en_us/updates-to-ynab-S1f4aRLeC.md ; https://www.loomio.com/docs/en/user_manual/polls/intro_to_decisions ; https://www.loomio.com/docs/en/user_manual/polls/quorum ; https://www.loomio.com/how-it-works/ ; https://www.qapital.com/blog/save-money-qapital-rules ; https://help.qapital.com/en/articles/10245393-ifttt-rules ; https://www.wave.com/en/ ; https://github.com/jameskokoska/Cashew

Press, community and review sources: https://newsmada.com/?p=197781 ; https://community.monzo.com/t/monzo-redesign-a-retrospective/95953 ; https://community.monzo.com/t/app-layout-why-is-mine-different/76787 ; https://community.monzo.com/t/we-re-launching-grow-tab-sign-up-for-early-access/190853 ; https://community.monzo.com/t/am-i-using-the-app-right/90806 ; https://monzo.com/blog/2017/08/01/bottom-nav-bar ; https://justuseapp.com/en/app/1113492041/money-fellows-online-game-ya/reviews ; https://www.trustpilot.com/review/moneyfellows.com ; https://www.trustpilot.com/review/splitwise.com ; https://au.trustpilot.com/review/moniepoint.com ; https://www.unitq.com/unitq-scorecards/piggyvest/ ; https://kimola.com/reports/in-depth-tricount-app-feedback-report-reveals-crucial-insights-google-play-en-157042 ; https://t2online.in/tech/tech-news/whatsapp-adds-poll-deadlines--anonymous-voting-and-an--all-tag-to-group-chats/2007011 ; https://timelines.ai/creating-and-using-polls-on-whatsapp ; https://lists.openstreetmap.org/pipermail/tagging/2015-May/024798.html ; https://socialhub.activitypub.rocks/t/2021-04-23-social-cg-meeting/1621?page=2 ; https://opencollective.com/mutual-aid-alnwick/updates/fiscal-host-issues ; https://write.as/nikclayton/stepping-back-from-the-tusky-project ; https://talk.tiddlywiki.org/t/opencollective-payment-issues/11436/8 ; https://peopledaily.digital/news/kenyans-left-confused-as-fuliza-crashes ; https://thekenyatimes.com/business/safaricom-responds-after-users-complain-of-delayed-m-pesa-messages/ ; https://techcentral.co.za/?p=180086 ; https://www.pcworld.com/article/3287145/goodbudget-review.html ; https://www.africaprivateequitynews.com/p/west-africa-mobile-money-company-raises-200m ; https://solve.mit.edu/solutions/36119

Design research: https://www.cgap.org/sites/default/files/publications/slidedeck/principlesofsmartphonedesign05oct16-161005230428.pdf ; https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/medhi_chi2009.pdf ; https://doi.org/10.1145/3449210
