# WAL: Wallets and ledger

Epic code WAL, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, statuses, IDs). Journey steps covered: 3 Set up, 4 Fund, 6 Spend (the payout step), 7 Follow, 8 Report and support.

Sources used in the Conversation sections. Raw reports are cited as file plus section.

| Short name | File |
| --- | --- |
| 02 personal finance | [02-personal-finance.md](../../research/raw/02-personal-finance.md) |
| 03 mobile money | [03-madagascar-mobile-money.md](../../research/raw/03-madagascar-mobile-money.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption. A rule marked [U] is a hypothesis to test in the field, not a fact.

## Conventions used in this file

- Message keys: UI `wal.<screen>.<element>`, errors `err.wal.<code>`, push `push.wal.<name>`, SMS `sms.wal.<name>`. All text exists in Malagasy, French and English. Wording in quotes is intent, not final copy.
- All amounts in examples (50 000 Ar, 500 Ar and so on) are illustrations. No fee, limit, tax or duration in this file is a decision. Each is a configurable parameter, written in capitals, with its source or status.
- Amounts are integer ariary, shown as `12 500 Ar` (space grouping, no decimals, no-wrap). Receipts and exports use the code `MGA`.
- Times are shown in Madagascar time (Indian/Antananarivo, UTC+3) with the zone shown on deadlines.
- Transaction statuses are exactly Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention in the interface. Status is always icon, word and colour. "Reversed" is a chip on a ledger entry that has been reversed (WAL-18), not a sixth status.
- Tiers follow ACC-07: Tier 1 is phone, OTP and PIN; Tier 2 adds ID and selfie; Tier 3 adds extra proof. Limits per tier come from OPS-11 and are not known.
- Money-in and money-out always name the provider ("Vanilla Pay") and the mobile money operator on the payment screens (07 UI/UX 2.8 R-S5). Vanilla Pay sits behind a payment adapter, so no story names a Vanilla Pay field.
- Entries are append-only. A wallet balance is always the sum of its ledger entries, never a stored number that code can overwrite.
- For wallets owned by the user, the user holds every wallet permission. For group wallets, each permission is checked individually.
- Group wallets: every outflow (mobile money, transfer to a personal wallet, transfer to another group wallet) needs at least one approval from a person other than the requester (GRP-13), with the bands of GRP-12. WAL stories describe the payout and the money states; the request and approval screens are SPD.

## Configurable parameters

| Parameter | Meaning | Starting value or status |
| --- | --- | --- |
| `WALLET_MAX_PER_OWNER` | Maximum open wallets for one user | TBD |
| `WALLET_NAME_MAX` | Maximum characters in a wallet name | TBD |
| `DEPOSIT_MIN`, `DEPOSIT_MAX_PER_TX` | Smallest and largest single deposit | TBD (provider terms unknown, 03 mobile money 3.2) |
| `WITHDRAW_MIN`, `PAYOUT_MAX_PER_TX` | Smallest withdrawal; largest payout per operator | TBD. Operator caps differ (MVola individual wallet Ar 20M, 03 mobile money 3.3 item 3) |
| `TIER_DEPOSIT_LIMIT`, `TIER_WITHDRAW_LIMIT`, `WITHDRAW_DAILY_LIMIT` | Limits per tier and per day | TBD, from OPS-11 |
| `FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE` | The three parts of a fee line | TBD. The tax line must be addable without a schema change (03 mobile money 5.3; the 0.5 percent mobile money tax status is unverified) |
| `PENDING_ETA_TEXT_MINUTES` | Minutes quoted as "usually under" on a Pending screen | TBD (07 UI/UX 9 sample copy uses 2 minutes as an illustration) |
| `PENDING_TIMEOUT` | Time with no provider answer before Gereo polls | TBD |
| `STATUS_POLL_INTERVAL`, `STATUS_POLL_MAX` | Poll frequency and attempt count | TBD, with backoff and a cap (07 UI/UX 4 R-O3) |
| `QUEUE_MAX_AGE` | Longest a queued withdrawal waits for the provider | TBD |
| `UNDO_WINDOW_SECONDS` | Delay before a payout is dispatched, during which Undo is shown. 0 means no undo | Open (07 UI/UX 2.4 R-C4 hypothesis of 10 to 30 s) |
| `LARGE_AMOUNT_PAUSE` | Amount that triggers the "Did someone ask you to send this?" pause | TBD |
| `LARGE_AMOUNT_WORDS` | Amount from which the review sheet repeats the amount in words | TBD |
| `PIN_MAX_WRONG_ATTEMPTS`, `PIN_LOCK_MINUTES` | PIN limits, owned by ACC-03 | TBD |
| `NEW_DEVICE_COOLING_HOURS` | Limit on money-out after a new device or PIN reset, owned by ACC | TBD |
| `OFFLINE_CACHE_DEPTH` | Recent entries kept per wallet on the phone | TBD (07 UI/UX 4 table says "last N") |
| `OFFLINE_CACHE_MAX_MB` | Storage cap for the cache | TBD |
| `STALE_BALANCE_AFTER` | Age after which a cached balance is flagged | 24 h proposed (07 UI/UX 4 R-O7 [U]) |
| `HISTORY_PAGE_SIZE` | Entries per page | 20 (as in CON-16) |
| `EXPORT_SYNC_MAX_ROWS`, `EXPORT_LINK_TTL` | When an export runs in the background; how long the file stays available | TBD |
| `RECON_TIME`, `RECON_MAX_AGE` | Daily reconciliation time; age after which the status line says "Not checked" | TBD (CON-17 calls the same threshold `reconciliation_stale_after`) |
| `CORRECTION_APPROVAL_THRESHOLD` | Correction amount above which a second operator must approve | TBD |
| `RECORD_RETENTION_YEARS` | Retention of transaction records and raw provider callbacks | 5, from Law 2016-056 Art. 53 as read in 03 mobile money 5.1; whether it binds Gereo depends on the operating model |

## Stories

### WAL-01 Create a wallet

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (own wallet) or Group founder or Permission holder (group wallet)
**Permission needed:** none for a personal wallet; `edit group` for a group wallet (stand-in, see GRP-15 and open questions)
**Tags:** legal-gate, ledger, audit

**Story:** As an individual, I want to create a named wallet of a type I choose, so that I can keep money for different purposes apart.

**Conversation:** Named wallets with a type, a balance and an optional goal are table stakes (02 personal finance, Takeaways, Table stakes item 1; competitive analysis section 7). Naming and separating money without new accounts is the mental model users like most (02 personal finance, Cross-cutting, "What users love" item 4, Monzo pots). Decisions: the type (budget, savings, investment, business) is a label that sets defaults, never a lock, and no wallet promises interest or yield (competitive analysis section 6 item 3; 03 mobile money 5.1, Art. 17 bars advertising e-money as savings, so the labels "Savings" and "Investment" need a lawyer's view). A wallet needs only the sign-up level (Tier 1) so that people can budget before they verify (02 personal finance, Cross-cutting, "KYC friction"). Group wallets are created from the group (GRP-15) and use the same form. Empty state of a new wallet follows 07 UI/UX 2.3 R-T7.

**Preconditions:** Signed in at Tier 1. For a group wallet, the person belongs to the group and holds the permission.
**Trigger:** The person taps "New wallet" on the wallet list or on the empty home.

**Acceptance criteria:**
1. Happy path. The form asks for Owner (default "Me", plus each group where the person holds the permission), Name, Type and an optional Goal (target amount in Ar, optional target date). Type is a choice of four with icon, visible word and one plain sentence each (key `wal.create.type.*`). Currency is shown as "Ariary (Ar)" and is fixed in the MVP. After "Create wallet" the person lands on the wallet detail (WAL-03) at 0 Ar with the empty state: one sentence about the wallet, one primary button "Add money".
2. Business rule. Name is required, trimmed, at most `WALLET_NAME_MAX` characters, and unique per owner ignoring case and accents (`err.wal.name_taken` names the field). At `WALLET_MAX_PER_OWNER` open wallets the button is disabled and `wal.create.limit_reached` says why.
3. Business rule. The goal amount is a whole number of at least 1 Ar, typed on a numeric keypad with live grouping. The target date must be in the future. The goal can be added later (WAL-04) and is the same goal used by the goal rule (RUL-10).
4. Business rule. Creation needs no identity check beyond Tier 1; no verification prompt appears. Type does not change any money rule: there are no locks, penalties or yield in the MVP.
5. Business rule, group wallet. The group option is offered only to a person who holds the permission; others see a note `wal.create.group_permission_needed` naming it. The new wallet inherits access from the group and the spending rule of GRP-12; GRP-13 applies from its first day.
6. States. While saving, the button shows progress and is disabled; the request carries an idempotency key so a double tap creates one wallet. A failure creates nothing, keeps the typed values and offers "Try again" (`err.wal.create_failed`). Offline, the form opens but "Create wallet" is disabled with `wal.offline.needs_connection`; no wallet is queued.
7. Ledger and audit. A ledger account is opened at zero. No money entry is written. Audit entry `wallet.created` with actor, owner, name, type, goal, time.
8. Notifications. None to the creator. For a group wallet, members get an in-app item `wal.notice.group_wallet_created`, batched by NTF, no push and no SMS.
9. Accessibility and language. The type picker is a radio group with visible words, not colour. The error summary is at the top with focus moved to it, and each message is also by its field. Names accept Malagasy, French and English characters and are stored as written.

**Data:** Wallet (write), Ledger account (write), Audit entry (write), User, Group, Membership (read).
**Depends on:** ACC-02, ACC-03, GRP-15 (group wallets from the group).
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission creates a group wallet (`edit group` is a stand-in)? Legal view on the labels "Savings" and "Investment" under Law 2016-056 Art. 17. Value of `WALLET_MAX_PER_OWNER`. May a wallet be created at Tier 0 or only at Tier 1?

---

### WAL-02 See all my wallets and what each one holds

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets; `view balance` for a group wallet
**Tags:** ledger, offline

**Story:** When I open Gereo, I want to see all my wallets and what each holds, so I can decide where to put money or take it from.

**Conversation:** Screen 5 of the wireframe list (design foundations section 5). The wallet card is the place where goal progress, status and low-balance state become visible at a glance (08 competitor UX 6.3; 07 UI/UX 2.2 R-M10, R-M12). A group wallet shows "Group balance" with its own label, never a blended number with the person's own money (07 UI/UX 8.1 R-G6). Never show "No wallets" while loading (07 UI/UX 2.3, NN/g empty states).

**Preconditions:** Signed in.
**Trigger:** The person opens the home or the wallet list.

**Acceptance criteria:**
1. Happy path. The list has a section "My wallets" and one section per group. Each card shows name, type icon and word, Available balance, and when a goal exists `7 500 / 10 000 Ar` with a bar. Status chips appear when relevant: Rules paused, Low balance, Needs attention, Closed (icon and word).
2. Business rule. The top line "All my wallets" is the sum of Available across the person's own open wallets. It excludes group wallets, closed wallets and money on its way in.
3. Business rule. A group wallet card says "Group balance". If the person lacks `view balance` on it, the card shows the name and `wal.list.balance_not_permitted` and no number. A "Your share" line appears only where CON provides it, under its own label.
4. Business rule. Closed wallets are hidden behind "Show closed (n)". Order inside a section is by last activity, then name.
5. States. Empty: one sentence and "Create my first wallet", no empty chart. Loading: skeleton cards, never "No wallets" while loading. Refresh failure with a cache: the cached list stays with "Could not update. Retry". Without a cache: an error panel with Retry.
6. Offline. The list renders from cache with "Updated hh:mm". Cached balances older than `STALE_BALANCE_AFTER` carry "May be outdated" (WAL-17).
7. Accessibility and language. A card reads as one sentence to a screen reader ("Savings, savings wallet, available 12 500 Ariary, goal 75 percent"). Amounts do not clip at 200 percent font scale. Touch targets are at least 48 dp.
8. No notification and no ledger entry. Reading is not audited.

**Data:** Wallet (read), Ledger entry (read, balance), Wallet rule (read, count and state), Membership (read).
**Depends on:** WAL-01, GRP-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Does the home total hide when the person has a hidden-balance setting on (WAL-19 says yes)? Does the list show a group wallet the person can see only by `view group`?

---

### WAL-03 Open a wallet and see its true balance, goal and what is safe to spend

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets; `view balance` for the balance block, `view history` for recent activity
**Tags:** ledger, offline

**Story:** As a wallet owner or member, I want one screen that shows the balance computed from the ledger, my goal progress and how much I can safely spend, so that I never have to guess.

**Conversation:** "Where is my money?" is the top complaint class (competitive analysis section 4 item 1). The balance is computed from the ledger, which is what guarantees it is real (info.md, "Flux d'argent"; 02 personal finance, Gaps competitors leave, "Native ledger accuracy"). "What is safe to spend" is what users love in envelope budgets (02 personal finance, Cross-cutting item 1) and Monzo's budget view breaks when money sits in pots, so Gereo's version is allocation-aware (02 personal finance, Gaps item 3). Money in transit must never be silently counted or hidden (07 UI/UX 2.2 R-M11). Progress is shown as numbers plus a bar, never a bar alone (R-M12). Screen 6.

**Preconditions:** The wallet exists and the person holds the permission.
**Trigger:** The person taps a wallet card.

**Acceptance criteria:**
1. Happy path. The header shows name, type, owner and Available balance. Under it: "On its way out: X Ar" (already taken from Available, waiting for the provider) and "On its way in: X Ar, not counted yet" (pending deposits). Each line appears only when its amount is above zero.
2. Business rule. Available equals the sum of the wallet's posted ledger entries. It is computed on the server and never edited. While the screen is open and connected, a new entry updates the figures without a manual refresh.
3. Business rule, goal. With a goal, the screen shows `7 500 / 10 000 Ar`, a bar, the percent, the amount left and the target date. Amount counted toward the goal is Available. At or above the goal the chip "Goal reached" appears. Without a goal, a "Set a goal" link opens WAL-04.
4. Business rule, safe to spend. For budget and business wallets the screen shows "Safe to spend: X Ar". It equals Available minus amounts reserved (pending withdrawals and spending that is approved but not yet paid). If a spending cap rule is active (RUL-09), it is the lower of that figure and what remains of the cap. It never goes below 0 ("Nothing safe to spend now"). A "How is this calculated?" link shows the lines of the calculation. Savings and investment wallets show goal progress instead.
5. Business rule, group wallet. Two figures with two labels: "Group balance" and, where CON provides it, "Your share" (07 UI/UX 2.2 R-M10).
6. Actions. "Add money", "Send out" and "Move money" appear for people with the matching permission (`deposit`, `initiate spend`). Without it a button is shown disabled with the missing permission named (key `err.wal.permission_missing`, as in 07 UI/UX 9 sample copy). A rules line "2 rules on, 1 paused" opens RUL-01. The reconciliation line of WAL-20 and the last N entries (link "See all", WAL-15) sit below.
7. States. Loading: skeleton, never "0 Ar" while loading. A closed wallet shows a banner "Closed on [date]" and no action buttons. A new wallet shows the empty state of WAL-01. Offline: all of this from cache with "Updated hh:mm".
8. Errors. If the balance cannot be refreshed, the last known figure stays with "Not updated since [time]. Retry" and the money buttons say the balance is re-checked on send.
9. Accessibility and language. Amounts use equal-width digits and never wrap. The progress bar has a text alternative with the numbers. No information is conveyed by colour alone.

**Data:** Wallet, Ledger entry, Transaction, Wallet rule (read).
**Depends on:** WAL-01, WAL-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Exact definition of safe to spend (the one here is a proposal to test in the field). Does a savings wallet with a goal also need a "protected amount" line? Should "On its way in" show for people with only `view balance`?

---

### WAL-04 Rename and edit a wallet

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; for a group wallet `edit group` to rename or change the type, `edit rules` to change the goal (stand-ins, see open questions)
**Tags:** audit

**Story:** As a wallet owner, I want to rename a wallet, change its type label and edit its goal, so that the wallet keeps matching what I use it for.

**Conversation:** Renaming, goals and caps are reversible, so no confirmation sheet is needed (07 UI/UX 2.4 R-C1, R-C5: confirm only money-out, money-moving rule activations and destructive actions). The goal is one object shared with the goal rule (RUL-10): editing it here or there changes the same record. History must not be rewritten, so receipts and exports show the wallet name as it was when the entry was made (decision, to confirm with OPS for support reading). Concurrent edits on shared records use per-field merge, not last write wins (07 UI/UX 4 R-O4).

**Preconditions:** The wallet is open (not closed) and the person holds the permission.
**Trigger:** The person taps "Edit" on the wallet detail.

**Acceptance criteria:**
1. Happy path. The person can change name, type label and goal (amount, date, or remove). "Save" applies at once and returns to the detail with a short confirmation `wal.edit.saved`.
2. Business rule. Name rules are those of WAL-01 (required, length, unique per owner). Changing the type changes the label and the defaults shown, never balance or rules.
3. Business rule. Lowering a goal below the current Available shows the chip "Goal reached". Removing a goal shows a note that the goal rule's alerts stop (RUL-10) and removes the goal rule after the person agrees.
4. Business rule, group wallet. Without the permission, the fields are read-only with the permission named. Members with `view balance` see the new name and goal at once.
5. Business rule. Past receipts and exports keep the wallet name recorded on each entry; the current name is shown in lists with "(was [old name])" in the detail of an old entry.
6. Concurrency. If another person saved first, the person sees "Changed by [name] at hh:mm. Review" with both versions per field and chooses; nothing is overwritten silently.
7. States. Saving shows progress. Failure keeps the typed values and says nothing changed. Offline: "Save" is disabled with `wal.offline.needs_connection`. A closed wallet cannot be edited.
8. Notifications. Personal wallet: none. Group wallet: in-app item `wal.notice.wallet_changed` to members with `view balance`, batched by NTF, no push or SMS.
9. Ledger and audit. No ledger entry. Audit entry `wallet.edited` with before and after values, actor, time.

**Data:** Wallet (write), Audit entry (write), Wallet rule (goal rule, write on removal).
**Depends on:** WAL-01, RUL-10.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission renames a group wallet or edits its goal (no wallet permission covers it)? Is the old name kept on entries as proposed, and who keeps it (ledger or presentation)?

---

### WAL-05 Close a wallet

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `close` for a group wallet
**Tags:** legal-gate, ledger, audit

**Story:** As a wallet owner, I want to close a wallet I no longer use, only when it holds no money and nothing is still moving, so that my list stays clean and no money is ever lost in a closed wallet.

**Conversation:** `close` is one of the eight wallet permissions (conventions section 7). Closing is where money can get stuck, so the rules are strict: zero balance and no pending item. The history stays and stays exportable, because data loss and company failure are a documented trust killer (Kippa; competitive analysis section 3.2 and section 7 design rules). Records are retained for the configured period (03 mobile money 5.1, Art. 53). Reopening is not in the MVP.

**Preconditions:** The wallet is open and the person holds the permission.
**Trigger:** The person taps "Close wallet" on the wallet detail.

**Acceptance criteria:**
1. Happy path. A checklist screen lists each condition with icon and word (Done, Not done) and the closing button "Close wallet [name]" enabled only when all are Done. A confirmation sheet restates what happens before the final tap.
2. Business rule, balance. Available must be exactly 0 Ar. If not, the line says "Move 12 500 Ar to another wallet or send it out first" with buttons to WAL-12 and WAL-09. Gereo never closes a wallet with a balance and never sweeps it by itself.
3. Business rule, pending. There must be no transaction in Initiated, Pending or Needs attention, no queued withdrawal, no approved but unpaid spend (SPD), and no open expense request on the wallet. Each blocker is listed with a link to it.
4. Business rule, rules. Rules on this wallet stop with the reason "Stopped: wallet closed" and keep their history. Rules in other wallets that send money to it are paused with the skipped-run reason `destination_closed` (RUL-12) and the owners are told before the person confirms ("2 rules will be paused: [names]").
5. Business rule, after closing. The wallet is read-only. Its history, receipts and export stay available. It is hidden from the default list. A deposit callback that arrives for a closed wallet is never lost: it goes to Needs attention for operators (OPS).
6. Business rule, group wallet. `close` is required. Closing is allowed only if the checks pass, so no money can move through the closure. Members see the closed state at once.
7. Errors. If a new pending item appears while the person confirms, closing is cancelled with "Not closed. Something just came in. Check and try again", and nothing changes. Offline: disabled with `wal.offline.needs_connection`.
8. Notifications. Group wallet: push `push.wal.group_wallet_closed` to members with `view balance`. Personal wallet: none.
9. Ledger and audit. The ledger account is marked closed; no money entry is written. Audit entry `wallet.closed` with the checklist result, actor, time.

**Data:** Wallet (write status), Transaction (read), Wallet rule (write status), Audit entry (write).
**Depends on:** WAL-03, WAL-09, WAL-12, SPD, RUL-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Reopening a closed wallet. Whether closing a group wallet should need a second person even at zero balance. Retention period and what the person sees about it.

---

### WAL-06 Add money from mobile money: amount, fee preview and start

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; `deposit` for a group wallet
**Tags:** legal-gate, ledger, audit

**Story:** When I want to put money into a wallet from my mobile money account, I want to see exactly what I will pay before I confirm, so I can add money without surprises.

**Conversation:** Showing the exact fee before confirmation is a design rule (competitive analysis section 6 item 5; 07 UI/UX 2.5 R-F1 to R-F4: fee and total update live while typing, "Fee: 0 Ar" is stated, one number with a "How is this calculated?" behind it). Cross-network payouts cost 3 to 10 times more than same-network, and fee slabs are hard to read (03 mobile money 7.1 item 4; 07 UI/UX 2.5). One review screen with everything (07 UI/UX 2.4 R-C2). The operator prompt on the person's phone is where the mobile money PIN is typed, never in Gereo (07 UI/UX 2.8 R-S1). Provider flows are asynchronous (03 mobile money 3.3 item 1). A deposit into a group wallet from the wallet screen is classified Income, so rules can split it (CON-14 open question, default proposed); contributions are paid through CON-04.

**Preconditions:** The wallet is open. The person's tier allows the amount (ACC-07). A provider is available (WAL-08 otherwise).
**Trigger:** The person taps "Add money".

**Acceptance criteria:**
1. Happy path. The amount screen has a numeric keypad, the destination wallet, the mobile money number (default: the saved number) and the detected operator. The line "You add 50 000 Ar, fee 500 Ar, total you pay 50 500 Ar" updates live as digits are typed. A fee of zero is shown as "Fee: 0 Ar". "How is this calculated?" lists provider fee, Gereo fee and tax line separately, each from configuration (`FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE`). The wallet is credited exactly "You add"; the person's mobile money account is charged "Total you pay".
2. Business rule, number. The number field accepts +261, a leading 0, spaces and dashes, normalises them and shows the normalised number back. The operator comes from a configurable prefix table. An unsupported prefix gives `err.wal.number_not_supported` before any request is sent.
3. Business rule, limits. The amount must be at least `DEPOSIT_MIN` and at most `DEPOSIT_MAX_PER_TX`, and within the tier limit `TIER_DEPOSIT_LIMIT`. Above the tier limit the flow stops before the review with the ladder message of ACC-07 ("To add more than [limit], verify your ID") and the typed values are kept; no money moved.
4. Review. One screen shows: to wallet, from number and operator, you add, fee, total you pay, provider name, and the next step ("You will get a prompt from [operator] on your phone. Approve it with your mobile money PIN. Gereo never asks for your PIN"). The button reads "Add 50 000 Ar".
5. Start. Tapping creates a transaction with a reference ID, status Initiated, then Pending once the provider accepts. The screen shows the timeline Initiated, Pending, Confirmed, the reference ID (copyable), time elapsed and "Waiting for Vanilla Pay. Usually under `PENDING_ETA_TEXT_MINUTES` minutes. You do not need to do anything. We will SMS you." The wallet is not credited and Available does not change; the amount shows only as "On its way in, not counted yet".
6. Idempotency. An idempotency key is generated when the review opens. A double tap, a retry or a screen reload returns the same transaction and never a second prompt.
7. Cancel. While the status is Initiated and the provider has not accepted, "Cancel" ends it as Cancelled, no money moved. Once Pending, there is no Cancel button; the screen says to ignore the phone prompt if the person changed their mind, and that an unapproved prompt expires.
8. Errors. If the provider rejects at creation, the status is Failed at once with `err.wal.deposit_rejected` ("No money was taken. Check the number.") and a button to edit the number. If the network drops before an answer, the status is shown as Pending with "We are checking", never as Failed without proof. Offline: the button is disabled with `wal.offline.money_needs_connection`.
9. Notifications and audit. None at start. Audit entry `deposit.initiated` with actor, wallet, amount, fee lines, operator, reference, idempotency key, time. No ledger entry yet (WAL-07 writes it on Confirmed).
10. Accessibility and language. The live fee line is announced politely on change. The pending screen text is in the person's language and states elapsed time in absolute and relative form.

**Data:** Transaction (write), Wallet (read), Audit entry (write), Payment adapter request (write).
**Depends on:** WAL-01, WAL-07, WAL-08, ACC-03, ACC-07, OPS-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Who pays the fee (added on top as here, or taken from the credited amount)? Does Vanilla Pay collect from any operator number, and is the amount unit ariary or a minor unit (07 UI/UX 2.1)? Whether the 100 000 000 Ar ceiling in the brief applies per transaction, per day or per account. Whether the PIN of Gereo is also asked for deposits (default here: no, the operator PIN is the authorisation).

---

### WAL-07 Settle a deposit exactly once: provider callback, idempotency and timeouts

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** legal-gate, ledger, audit, sms

**Story:** When Vanilla Pay tells Gereo what happened to a deposit, I want Gereo to record it exactly once and in the right state, so the person's balance is always correct and nobody is ever credited twice or not at all.

**Conversation:** Provider callbacks can time out or double-notify, so idempotency keys, pending and settled states and a reconciliation job are mandatory (competitive analysis section 6 item 6; 03 mobile money 7.1 item 5). "Debited but not delivered" with no trace in the app is the most repeated complaint (08 competitor UX 6.3, Avoid; competitive analysis section 4 item 1). Whether Vanilla Pay signs callbacks and how it retries is unknown (03 mobile money 3.2); another aggregator signs notifications with HMAC and creates links idempotently (03 mobile money 3.4). The status mapping from the provider's words to ours is a table in the payment adapter spec.

**Preconditions:** A deposit transaction exists (WAL-06).
**Trigger:** A provider callback arrives, or `PENDING_TIMEOUT` passes with no answer.

**Acceptance criteria:**
1. Authenticity. A callback is processed only if it passes the check required by the provider contract. A callback that fails it is rejected, stored for review, changes nothing, and raises an alert to OPS after repeated failures.
2. Confirmed. The system matches the callback to the transaction by provider reference, amount and wallet. It posts one atomic, balanced set of entries: external provider account to wallet for the amount, with the fee and tax lines as their own entries. The status becomes Confirmed and Available rises by exactly the amount shown as "You add". An amount that differs from the transaction is not credited and the transaction goes to Needs attention.
3. Idempotency. A duplicate or replayed callback (same event or provider reference) changes nothing and is acknowledged to the provider. Test: the same callback delivered three times produces exactly one posting.
4. Failed and Cancelled. The status is updated and no wallet entry is written. The person sees a reason in plain words and whether money moved, but only when the provider says so (key `wal.deposit.failed.*`). If the provider result leaves it unclear whether the person was charged, the transaction goes to Needs attention instead.
5. Terminal states are final. A Confirmed callback that arrives after Failed or Cancelled, or one with an unknown reference, is stored, never credited automatically, flagged Needs attention and sent to OPS.
6. Timeout. With no answer by `PENDING_TIMEOUT`, the system polls the provider every `STATUS_POLL_INTERVAL` up to `STATUS_POLL_MAX` times. A poll answer is handled exactly like a callback. If it stays unknown, the person sees Needs attention with "We are checking with Vanilla Pay. Reference [ID]. You do not need to do anything" and OPS is alerted. Gereo never marks a deposit Failed without a provider answer.
7. Notifications. Confirmed: SMS `sms.wal.deposit_confirmed` (reference, amount, wallet, GSM-7 safe, under 160 characters) and push `push.wal.deposit_confirmed` ("Added 50 000 Ar to Savings. Ref 7Q4K-82."). Failed: push `push.wal.deposit_failed` and SMS `sms.wal.deposit_failed` only when money moved or the outcome is unclear. For a group wallet, members with `view history` see the entry in the feed and the digest, not one push each (NTF).
8. Rules. After the credit is posted, the deposit is offered to the rule engine as income (RUL-07). A rule failure never rolls back the credit.
9. Ledger and audit. Every state change is an audit entry with the provider reference and actor "System". The raw callback (payload, receive time, outcome) is stored append-only for `RECORD_RETENTION_YEARS`. Each provider transaction is marked for reconciliation (WAL-20).

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Raw provider event (write).
**Depends on:** WAL-06, OPS (reconciliation, Needs attention queue), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay sign callbacks, retry, and expose a status endpoint? Can a Failed deposit later become Confirmed (default here: no, it goes to Needs attention and an operator decides)? Does the provider fee reduce what the wallet receives?

---

### WAL-08 When the provider is not available, say so and keep the money safe

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member, System
**Permission needed:** none
**Tags:** legal-gate, ledger, sms

**Story:** When Vanilla Pay or the mobile money operator is down, I want Gereo to say so clearly and keep my money safe, so I do not repeat a payment or believe my money is lost.

**Conversation:** MVola had material outages in November 2025 and May to June 2026, and aggregator calls fail with it (03 mobile money 3.4, "Operator risk passes through"; competitive analysis section 2). The rule is: show a "provider unavailable" state and queue payouts rather than failing (competitive analysis section 6 item 7; 03 mobile money 7.1 item 6). A deposit cannot be queued because the person must approve on their own phone, so only an alert is offered. Offline (no connection on the phone) and provider-down (Gereo cannot reach the provider) have different words, because the cause must be attributed accurately (07 UI/UX 4, web.dev guidance).

**Preconditions:** The payment adapter reports a rail or operator as unavailable, by health check or by errors above a threshold.
**Trigger:** The person starts a deposit or a withdrawal while the state is on.

**Acceptance criteria:**
1. Happy path, banner. Money screens show the banner "Vanilla Pay is not available right now" (or the operator name) with the time since it started and what still works (balances, history, moves between wallets). The state can apply to one operator only.
2. Deposit. The flow stops at the amount screen with `err.wal.provider_down_deposit`: "We cannot reach [operator] right now. No money was taken." Two buttons: "Try again" and "Tell me when it works". The second registers one alert (push, SMS if the app is not opened) when the state clears, with an expiry. No deposit is queued.
3. Withdrawal. The person can complete the review and the PIN (WAL-10). The withdrawal is accepted as Pending with "Waiting for the provider. We will send it as soon as it is back. Your money is set aside." The amount leaves Available at once and shows under "On its way out" with its reference ID.
4. Queue rules. Queued withdrawals are sent in order of acceptance when the provider returns. Each is re-checked (limits, destination) and sent with the same idempotency key, so a retry never pays twice.
5. Cancel. While queued and not yet sent, the person can cancel: status Cancelled, a reversing entry returns the full amount and fee, no fee is kept. Once sent, no cancel is offered.
6. Expiry. After `QUEUE_MAX_AGE`, a queued withdrawal becomes Failed, a reversing entry returns the money, and the person is told with the next action (try again, choose another number).
7. Notifications. Queued: push `push.wal.withdraw_queued` and SMS `sms.wal.withdraw_queued` ("Your 50 000 Ar withdrawal is waiting. Your money is safe. Ref 7Q4K-82."). Sent and Confirmed or Failed follow WAL-11. No mass message when the provider recovers.
8. Errors. When the phone has no connection the copy says "No connection" and what still works, not "provider unavailable". Nothing is queued from the phone itself.
9. Ledger and audit. Acceptance of a queued withdrawal posts wallet to in-transit; cancel or expiry posts the reversal; each flip is an audit entry with actor "System". Queue size and age are visible to operators with an alert threshold (OPS).

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Provider health state (read).
**Depends on:** WAL-06, WAL-10, WAL-11, OPS (provider health), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Value of `QUEUE_MAX_AGE`. Whether a queued withdrawal needs a float that Gereo or the provider must pre-fund (03 mobile money 7.3). Whether deposits could also be queued by a pay-by-link flow later.

---

### WAL-09 Send money out: choose amount and recipient, with limits and fee preview

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `initiate spend` for a group wallet
**Tags:** legal-gate, ledger

**Story:** As a wallet owner, I want to choose how much to send to a mobile money number and see the fee, the total and my balance afterwards while I type, so that I know the cost before I commit.

**Conversation:** Withdrawal delay and unclear outcomes are the second biggest complaint class (competitive analysis section 4 item 1). Validate the amount in real time and do not blame the person (07 UI/UX 2.4, CGAP principles 12 and 17). Tier limits are shown as "what you can do now and what unlocks next", asked at the moment a limit is hit (design foundations section 4; ACC-07). Operator caps apply even under the aggregator, so a payout above an operator's limit may fail whatever Gereo's ceiling (03 mobile money 3.3 item 3). Money-out is online only (conventions section 2; 08 competitor UX 6.13, "Avoid queuing money movement silently"). For group wallets, no single person can move money alone (GRP-13), so this screen creates the request that SPD approves.

**Preconditions:** The wallet is open, has Available above zero, and the person's tier allows money-out at all (ACC-07).
**Trigger:** The person taps "Send out".

**Acceptance criteria:**
1. Happy path. The screen has: from wallet with Available, to (saved recipients or "New number"), amount on a numeric keypad with a large echo. Under it, live: "Fee [X] Ar, total [Y] Ar, balance after [Z] Ar". A free payment shows "Fee: 0 Ar". The fee follows the destination operator and updates if the number changes operator.
2. Business rule, validation. As the person types, the screen flags an amount above Available ("You have 30 000 Ar available"), below `WITHDRAW_MIN`, or above `PAYOUT_MAX_PER_TX` for that operator ("The most you can send to [operator] in one payment is [limit]. Send in parts or choose another number"). No blame wording, and the next button stays disabled. There is no automatic splitting of a payment.
3. Business rule, number. The number accepts +261, a leading 0, spaces and dashes and is normalised and shown back. The operator comes from a configurable prefix table.
4. Business rule, tier. If the amount, or the day's total against `WITHDRAW_DAILY_LIMIT`, passes the tier limit, the flow stops before the review with the ladder message of ACC-07 and a "Verify my identity" button. Typed values are kept. No money moved. A line "You can still send [X] Ar today" shows when a daily limit exists.
5. Business rule, group wallet. The person needs `initiate spend`. The button reads "Ask for approval" and the screen says who must approve ("Needs 1 more person: [names of approvers]"). The payout runs only after SPD approvals complete (GRP-13), then follows WAL-10 and WAL-11 for the money states.
6. Business rule, freshness. Available is re-read from the server when the person taps Next; if it changed, the new figure is shown first.
7. Offline. The screen explains "Sending money needs a connection. Your balance is saved on this phone" and disables the button (`wal.offline.money_needs_connection`). Nothing is queued from the phone.
8. Errors. A failed balance refresh keeps the screen and offers Retry. A recipient with an unsupported prefix gets `err.wal.number_not_supported`. Money has not moved in any of these errors, and the screen says so.
9. Accessibility and language. Amount errors are inline and read by screen readers without moving focus. The large echo and live line reflow at 200 percent font scale without clipping.

**Data:** Wallet (read), Transaction (draft), Saved recipient (read), Tier configuration (read).
**Depends on:** WAL-03, WAL-10, ACC-07, OPS-11, GRP-12, GRP-13, SPD.
**Pages:** to be filled from the information architecture.
**Open questions:** May a Tier 1 or Tier 2 person send to any number or only to their own verified number? The meaning of the 100 000 000 Ar ceiling for payouts. Whether a group wallet can ever pay out directly, below a threshold, without an SPD request (default here: no, always a request).

---

### WAL-10 Review, confirm with my PIN, and pause for a new recipient

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `initiate spend` or `approve spend` for a group wallet
**Tags:** legal-gate, ledger, audit

**Story:** As a person sending money out, I want one review screen, a PIN that repeats what I am approving, and a pause when the recipient is new, so that I do not send money to the wrong person or under pressure.

**Conversation:** About 25 percent of mobile money owners in Sub-Saharan Africa have sent money to the wrong person and half never recovered it (design foundations section 1 item 1; CGAP Findex 2025 [V]). Hence: one review screen with everything (07 UI/UX 2.4 R-C2, CGAP principle 20), outcome-labelled button, the PIN screen repeats amount and recipient (R-C6, R-A2), PIN on every money-out (conventions section 2), and a pause for a first-time payee, a new device or a large amount (07 UI/UX 2.8 R-S3, 2.6 R-E4; Monzo "Take Five"). Whether Vanilla Pay returns the recipient's registered name is unknown (07 UI/UX 2.4 R-C3); until it is known, the screen shows the number and says the name is not available. Fraud here is social engineering around PIN and OTP (03 mobile money 6.7 item 4).

**Preconditions:** WAL-09 completed with valid values.
**Trigger:** The person taps Next on the amount screen.

**Acceptance criteria:**
1. Happy path. One review screen shows: to (registered name if the provider returns it, otherwise "Name not available", plus the full number and operator), from wallet, amount, fee, total taken, the effect "Savings goes from 80 000 to 30 000 Ar", date and time, and the provider name. The primary button is "Send 50 000 Ar to Rado". A "Change" link returns to the amount screen with values kept. From `LARGE_AMOUNT_WORDS`, the amount is repeated in words in the person's language. If the payment would take the wallet past its spending cap, a line says so (RUL-09); it does not block.
2. Business rule, PIN. The button opens a PIN screen that repeats amount and recipient and shows "Gereo will never ask for your PIN or code by phone or message". The PIN is asked on every money-out, every time, with no "remember me". A biometric may be offered only if ACC-03 allows it for money-out; ACC-03 says the PIN is still required.
3. Business rule, wrong PIN. A wrong PIN shows the attempts left. After `PIN_MAX_WRONG_ATTEMPTS` the money-out is locked for `PIN_LOCK_MINUTES` with a visible way to recover (ACC-04). No money moved. After a new device or PIN reset, `NEW_DEVICE_COOLING_HOURS` applies as ACC defines.
4. Business rule, pause. If the number has never been paid successfully by this person, or the device is new, or the amount is at or above `LARGE_AMOUNT_PAUSE`, a pause screen appears before the PIN: "Did someone ask you to send this money?" with "Cancel" as the visually primary action and "Yes, continue" secondary, the line "Gereo never asks for your PIN", and, for a new number, a field to re-type its last 3 digits.
5. Submission. After the PIN is accepted the request carries an idempotency key. The total (amount plus fee) leaves Available at once as an in-transit ledger entry, the transaction is Initiated, then Pending when the provider accepts, and the status screen shows the reference ID and "Waiting for Vanilla Pay. Usually under `PENDING_ETA_TEXT_MINUTES` minutes."
6. Business rule, undo. If `UNDO_WINDOW_SECONDS` is above 0, dispatch is delayed by that time and an "Undo" button with a countdown is shown; Undo ends the transaction as Cancelled with the money returned. Once dispatched, no Undo is ever shown.
7. Errors. A double tap creates one transaction. A network loss after the PIN shows "We are checking. Do not send again." with the reference, never "Failed". A provider rejection at dispatch is handled in WAL-11. Offline: the screen cannot be reached (WAL-09).
8. Notifications. SMS `sms.wal.withdraw_sent` to the person ("Sent 50 000 Ar to 034 xx xxx 12, Ref 7Q4K-82. Not you? Call support.", GSM-7 safe) once the provider accepts; outcomes follow WAL-11.
9. Ledger and audit. Entry wallet to in-transit for amount and fee as separate lines. Audit entry `withdraw.authorised` with actor, device, amount, recipient, whether the pause was shown and accepted, PIN failures in the session, time. The PIN is never logged.
10. Accessibility and language. The PIN keypad has targets of at least 56 dp and announces digit count, not digits. The review text reflows at 200 percent font scale, and the button label always names the amount.

**Data:** Transaction (write), Ledger entry (write), Saved recipient (write on success), Audit entry (write), Device (read).
**Depends on:** WAL-09, ACC-03, ACC-04, ACC-05, GRP-13, SPD, RUL-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay return the recipient's name? May a biometric replace the PIN on money-out (ACC-03 says no)? Value of `UNDO_WINDOW_SECONDS` and `LARGE_AMOUNT_PAUSE`. For group wallets, whose PIN is asked and when (requester at request, each approver at approval, as proposed)?

---

### WAL-11 Follow a withdrawal to its end: confirmed, failed with refund, or needs attention

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, System
**Permission needed:** none
**Tags:** legal-gate, ledger, audit, sms

**Story:** When I have sent money out, I want to see honestly where it is and, if it fails, to get my money back with a clear message, so I never wonder where it went.

**Conversation:** "Successful" shown before the recipient has the money (Kuda reviews) and "debited but not delivered" with no trace (Orange Max it reviews, PiggyVest) are the failure patterns to avoid (08 competitor UX 6.3). Failed must say explicitly whether money left the account (07 UI/UX 2.3 R-T3). Pending must say what happens next (R-T2). A reversal at the operator is costly and slow (MVola 5 percent, minimum Ar 10,000, 7-day window; 03 mobile money 7.1 item 5), so Gereo promises no recall. Refunds and idempotency follow WAL-07.

**Preconditions:** A withdrawal was authorised (WAL-10) or queued (WAL-08).
**Trigger:** A provider callback, a poll answer, a person's cancel, or a timeout.

**Acceptance criteria:**
1. Confirmed. After an authentic, matched callback the in-transit entry moves to the external provider account in one atomic posting. Status Confirmed, receipt available (WAL-14), SMS `sms.wal.withdraw_confirmed` and push `push.wal.withdraw_confirmed` ("Sent 50 000 Ar to Rado. Ref 7Q4K-82."). The fee is its own line.
2. Business rule. "Sent" or "Successful" is never shown before the provider confirms. Until then the text is the Pending text of WAL-10 AC5 and a timeline Initiated, Pending, Confirmed.
3. Failed. When the provider says it failed, the status is Failed and one atomic reversing entry returns the full total (amount plus fee) from in-transit to the wallet. The screen says "We could not send 50 000 Ar. Your money is back in Savings. Ref [ID]" with "Try again" and "Report this payment". SMS `sms.wal.withdraw_failed` and push `push.wal.withdraw_failed`.
4. Business rule, unclear. If a failure leaves it unclear whether the provider paid, the transaction is Needs attention, the money stays under "On its way out", OPS is alerted, and the person sees "We are checking with Vanilla Pay. Your money is set aside. Ref [ID]". It is never refunded automatically without a provider final answer or an operator decision, so Gereo never pays twice.
5. Idempotency. A duplicate callback never posts twice. A reversal can exist once per transaction, enforced by a uniqueness rule on the original entry.
6. Timeout. Polling follows WAL-07 AC6 with the same parameters. If it stays unknown the status is Needs attention.
7. Cancelled. A cancel during the undo window or while queued (WAL-08) ends as Cancelled with the amount and fee returned by a reversing entry; no fee is kept.
8. Mistaken payment. The receipt shows "Sent to the wrong person? Gereo cannot take back money that was already sent. Contact the recipient or your operator" and the "Report this payment" action (WAL-14).
9. Ledger and audit. Every state change is an audit entry with the provider reference and the actor (System, or the operator who decided a Needs attention case). The raw provider event is stored as in WAL-07. For a group wallet the entries keep the requester and every approver.

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Raw provider event (write).
**Depends on:** WAL-07, WAL-08, WAL-10, WAL-14, OPS.
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay offer recall or reversal, and who bears its cost? Does the provider fee come back on a failed payment? How long may a case stay Needs attention before escalation?

---

### WAL-12 Move money between my own wallets

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; for wallets of one group, `initiate spend` on the source and `deposit` on the destination, with the approvals of GRP-13
**Tags:** legal-gate, ledger, audit

**Story:** As a wallet owner, I want to move money between two wallets I own, instantly and at no cost, so that I can budget by moving money to where it is needed.

**Conversation:** Free, instant ledger transfers between wallets are part of the MVP scope (competitive analysis section 7; 02 personal finance, Takeaways item 1). Monzo shows pot moves as paired entries in the feed but users say each pot also needs its own full history (08 competitor UX 6.3, Adopt). Transfers inside a group are outflows for GRP-13, so one person alone cannot complete them (GRP-13 open question, default yes). A manual move is not income and does not trigger split rules (CON-14, decision shared with RUL-07). Server-authoritative ledger: the phone never writes money (07 UI/UX 4 R-O4).

**Preconditions:** The person owns, or for a group holds the permissions on, at least two open wallets of the same owner. The source has Available above zero.
**Trigger:** The person taps "Move money".

**Acceptance criteria:**
1. Happy path. The screen asks for From wallet, To wallet (only open wallets of the same owner, not the source) and amount. It shows "Fee: 0 Ar" and "balance after" for both wallets. The button reads "Move 20 000 Ar to Savings".
2. Business rule. The move is one balanced pair of ledger entries posted atomically, with no provider. It is Confirmed at once with a reference ID. No PIN is asked for a move inside one owner (open question).
3. Business rule, validation. Amount at least 1 Ar, whole number, at most Available. Source and destination must differ and be open. Errors are inline ("You have 30 000 Ar available").
4. Business rule, group wallets. Moving money between wallets of the same group is an outflow: it needs `initiate spend` on the source and at least one approval from another person (GRP-13), within the bands of GRP-12. It stays Pending ("Waiting for approval, 1 of 2") until SPD completes it; until then Available is unchanged and the amount is shown as reserved.
5. Business rule, effects. A manual move is not income: it never fires the destination's split rules and never counts as spending for a cap on the source. It does count toward the destination's goal progress.
6. History. The move appears in both wallets as paired entries "Transfer out" and "Transfer in" linked by one reference ID, each wallet with its own full history.
7. Errors. If the balance changed so that the move is no longer possible, nothing is posted and the message says "Not moved. Your balance changed. Check and try again". A double tap creates one move (idempotency key). Offline: the button is disabled with `wal.offline.money_needs_connection`.
8. Notifications. Personal wallets: none (on-screen confirmation). Group wallets: in-app item `wal.notice.group_transfer` to members with `view history`, batched by NTF.
9. Ledger and audit. Audit entry `transfer.internal` with actor, both wallets, amount, reference, and for group wallets the approvers.

**Data:** Ledger entry (write), Transaction (write), Approval (read, group), Audit entry (write).
**Depends on:** WAL-03, GRP-13, GRP-12, SPD, RUL-07.
**Pages:** to be filled from the information architecture.
**Open questions:** Does a move above some amount need the PIN even inside one owner? Do moves between a user's wallets count as "money-out" for tier limits (default: no)?

---

### WAL-13 Send money to another person or group inside Gereo

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets as the source; `initiate spend` on a group source; `deposit` on a group destination
**Tags:** legal-gate, ledger, audit, sms

**Story:** As a person with money in Gereo, I want to send some of it to another Gereo user or to a group wallet I belong to, free and instantly, so that I do not pay mobile money fees for money that stays inside Gereo.

**Conversation:** info.md says a wallet belongs to one entity "but allows transfers"; the brief asks for free ledger entries between owners and a rule for who may initiate. Decision: only the owner side of the source may initiate (push only); there is no pull and no "request money" in the MVP, so nobody can take money out of someone else's wallet. Money that leaves one owner for another is a scam target, so it gets the PIN and the first-recipient pause of WAL-10 (07 UI/UX 2.8 R-S3, R-S4). Gereo does not reverse such transfers on its own; mistakes go to support (WAL-14, WAL-18). Phone numbers are masked in group-visible ledgers (R-S4).

**Preconditions:** The source wallet is open with Available above zero. The recipient is a Gereo user (by phone number) or a group wallet in which the sender holds `deposit`.
**Trigger:** The person taps "Send to a person or group" on a wallet.

**Acceptance criteria:**
1. Happy path. The person picks the destination: a Gereo user by phone number (the app shows the registered display name and a partly masked number) or a group wallet from the person's groups. A user destination lands in the recipient's receiving wallet. A review screen shows recipient, from wallet, amount, "Fee: 0 Ar", balance after, and the button "Send 20 000 Ar to Rasoa".
2. Business rule, who may initiate. Only the owner side of the source wallet can initiate, with the permission above. The recipient can never pull money, and there is no money request in the MVP.
3. Business rule, PIN and pause. The PIN is asked, on a screen repeating amount and recipient. A first-time recipient or a new device triggers the pause "Did someone ask you to send this money?" (WAL-10 AC4).
4. Business rule, limits. Whether this counts against the sender's tier and daily limit is configured (`TRANSFER_COUNTS_AS_MONEY_OUT`, open question); a limit hit shows the ladder message of ACC-07 and no money moves.
5. Business rule, group source. A transfer out of a group wallet to anyone outside the group follows GRP-13 and SPD: it is a request that needs another person's approval.
6. Posting. The transfer is one balanced, atomic posting with a reference ID, Confirmed at once, visible in both histories (the recipient sees "Received from [display name]"). It is income for the recipient wallet, so its rules apply (RUL-07).
7. Business rule, irreversible. Gereo does not reverse the transfer on its own. The receiver may send money back as a new transfer; a mistaken transfer goes through "Report this payment" and operator correction (WAL-18).
8. Errors. A number that is not a Gereo user shows "[number] does not have Gereo yet" with an invite action (GRP, ACC-16) and no money moves. A recipient who cannot receive (no receiving wallet, wallet closed) shows `err.wal.recipient_cannot_receive`. Offline: disabled.
9. Notifications. Recipient: push `push.wal.transfer_received` ("Rasoa sent you 20 000 Ar. Ref 7Q4K-82.") and SMS if the app is not opened (NTF). Sender: SMS `sms.wal.transfer_sent` because money left their ownership.
10. Ledger and audit, privacy. Audit entry `transfer.external_owner` with both parties, amount, device, pause outcome. Group-visible ledgers show the sender's display name and never the phone number.

**Data:** Ledger entry (write), Transaction (write), Wallet (read, `receives_transfers` flag), User (read), Audit entry (write), Notification (write).
**Depends on:** WAL-10, WAL-12, ACC-07, GRP-13, SPD, RUL-07, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** How does a user mark which wallet receives transfers (default: the first wallet, changeable in WAL-04)? May a user block incoming transfers from people they do not know? Do owner-to-owner transfers count as money-out for limits? Whether a verified identity is needed to receive.

---

### WAL-14 Read one transaction and its receipt, and report a problem

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** `view history` (own wallets: none)
**Tags:** ledger, audit, offline

**Story:** When I want to know what happened to a payment, I want one page with its status, fee, reference and the ledger entries behind it, and a way to report a problem, so I can prove it or get help.

**Conversation:** Every money movement shows a status, a reference ID and a way to get help (design foundations section 3 principle 1; 07 UI/UX 2.3 R-T4, 2.6 R-E3). A receipt carries amount, fee, date, time and transaction ID (CGAP principle 14; GOV.UK confirmation pages). "Report this payment" attaches the provider reference in one tap (08 competitor UX 6.3, Avoid). A "why" line from the rule engine is an open opportunity nobody documents (08 competitor UX 6.3, Open). Screenshots leak numbers, so the shared receipt hides the counterparty number by default (07 UI/UX 2.8 R-S4). Screen 7.

**Preconditions:** The transaction belongs to a wallet the person may see.
**Trigger:** The person taps a row in a history list or a link in a notification.

**Acceptance criteria:**
1. Happy path. The page shows: status chip (icon, word, colour), amount with direction words ("Received +50 000 Ar" or "Sent -50 000 Ar"), fee, total, date and time, type, wallet, counterparty (full name; number masked for anyone other than the sender), initiated by, approved by (group, from SPD), the reference ID in groups of 3 or 4 characters with a copy button, the provider reference, and a timeline with each status change and its time.
2. Ledger block. Each entry behind the transaction is a plain sentence ("From Savings to Rado: 50 000 Ar"). Fee and tax lines are their own entries. An "Accounting view" toggle shows debit and credit columns.
3. Rule line. An entry made by a rule shows "Why: 40% to Savings by rule Split salary" with a link to the rule (RUL-12). A deleted rule still shows its name followed by "(deleted)". An income shows "Rules on this income" with each outcome (Moved, Alert sent, Skipped and the reason).
4. State explanations. Pending says what Gereo waits for and what to do ("Nothing. We will SMS you."). Failed says whether money moved. Needs attention gives the reference and the support route. A reversed entry shows the chip "Reversed" and links both ways to its reversal (WAL-18).
5. Report. "Report this payment" is always visible. It opens a form pre-filled with reference, amount, date, status, wallet and provider reference, with a choice (Not received, Wrong recipient, Taken twice, Other) and optional text. Submitting creates a support ticket (OPS) and shows its number and status. It never promises a refund. Offline, the report is kept as "Waiting to send" with a visible state and sent when the connection returns.
6. Receipt and share. A Confirmed transaction has a receipt (reference, amount, fee, date, wallet name at the time, status, provider) shareable as a PDF or text through the phone's share sheet. Other statuses show a "Summary" labelled "Not a proof of payment". The counterparty number is hidden in the shared file unless the sender chooses to include it.
7. Repeat. A past withdrawal or transfer out offers "Repeat this payment", which opens WAL-09 or WAL-13 filled in. The PIN is asked again.
8. Offline and loading. The page and the receipt open from cache with "Updated hh:mm"; a loading skeleton appears when not cached. A missing permission shows the permission by name.
9. Audit. Opening is not audited. Submitting a report is: `support.reported` with actor, reference, category, time.
10. Accessibility and language. The reference is announced in groups and the copy button announces "Copied". Direction is given by words and icon, not by red and green.

**Data:** Transaction, Ledger entry, Wallet rule (read), Support ticket (write), Audit entry (write).
**Depends on:** WAL-07, WAL-11, WAL-15, RUL-12, OPS (tickets), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Format of the reference ID (short, speakable, collision-safe). Whether the shared receipt should be an image as well as a PDF. May the sender choose to show the recipient number to the recipient?

---

### WAL-15 Browse and search my history with filters

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** `view history` (own wallets: none)
**Tags:** ledger, offline

**Story:** When I need to find a payment or understand where my money went, I want to filter my history by wallet, type, date and who made it, and search it, so I can answer in seconds.

**Conversation:** A complete, filterable history with search is table stakes (02 personal finance, Takeaways item 3: filter by wallet, type, date, rule-generated versus manual). Open Collective filters by type, period, amount and status (08 competitor UX 6.3). Use rows, not tables, on phones (07 UI/UX 2.3 R-T5; NN/g mobile tables). Never show "No records" while loading (NN/g empty states). The controlled type vocabulary comes from CON (Contribution, Penalty, Income, Split, Expense, Transfer, Fee, Share-out, Reversal); this story adds the plain words Deposit and Withdrawal for provider-linked entries.

**Preconditions:** The person can see at least one wallet.
**Trigger:** The person opens "See all" on a wallet, or "History" for all wallets.

**Acceptance criteria:**
1. Happy path. Rows are grouped by day with a date header. A row shows counterparty or purpose, amount (right-aligned, equal-width digits), status chip and time. `HISTORY_PAGE_SIZE` rows load at a time with "Load more". Order is by posting time, newest first.
2. Filters. A filter sheet offers: Wallet (when the view spans wallets), Type (Deposit, Withdrawal, Transfer, Split, Contribution, Penalty, Expense, Fee, Share-out, Reversal), Date (Today, 7 days, This month, Custom range), Source (All, Made by a rule, Made by a person) and Status (All, Confirmed, Pending, Failed, Cancelled, Needs attention). Active filters show as removable chips with a "Clear all". Filters combine with AND.
3. Business rule, source. "Made by a rule" shows entries that carry a rule name; "Made by a person" shows the others. Rule entries show the rule name in the row.
4. Search. A box matches reference ID (prefix, ignoring case and dashes), counterparty name, note and an exact amount typed in digits. It starts at 2 characters, waits briefly after typing, highlights the match and works inside the active filters.
5. Totals. For the filtered result the header shows "Money in X Ar, money out Y Ar", computed on the server over the whole result, not only the loaded rows.
6. States. Empty new wallet: the empty state of WAL-01. No match: "No entries match. Clear filters". Loading: skeleton rows, never "No records". A failed refresh keeps the list and offers Retry.
7. Permission. Without `view history` on a group wallet the person sees `wal.history.not_permitted` naming it. Phone numbers are masked in group-visible lists.
8. Offline. Filters and search run on the cached recent entries and the header says "Showing saved items from [date]. Connect to see older ones." Totals say they cover saved items only.
9. Accessibility and language. Filter controls are at least 48 dp. The result count is announced after filtering ("12 results"). Status and direction are never by colour alone.

**Data:** Ledger entry (read), Transaction (read), Wallet rule (read, name).
**Depends on:** WAL-03, WAL-14, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Final controlled vocabulary of types (shared with CON-16, to align). Is amount-range filtering needed in the MVP? Search over Malagasy and French accents.

---

### WAL-16 Export a wallet's history as CSV or PDF

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `export history` for a group wallet
**Tags:** ledger, audit

**Story:** When I need my records for a meeting, an accountant or myself, I want to download a wallet's history as a spreadsheet or a PDF statement, so I can keep my own books and never depend on Gereo to hold them.

**Conversation:** Ship export on day one and never put it behind payment (competitive analysis section 7, design rules). Kippa's shutdown left about 500,000 merchants without records (competitive analysis section 3.2). Export is also a trust signal (02 personal finance, Risks, "Data loss / company failure"). Formats match ACC-14: integer MGA, ISO dates with the Madagascar offset, labels in the person's language with stable technical names in a second header row. The group-meeting version of the same export, with headline numbers and status counts, is CON-18; this story is the engine both use.

**Preconditions:** The wallet has entries and the person holds the permission.
**Trigger:** The person taps "Export" on a wallet or on the history.

**Acceptance criteria:**
1. Happy path. The person chooses format (CSV or PDF), period (This month, Last month, Custom), wallet (one, or all those they may export) and whether to apply the current filters. A confirmation shows the number of entries before generating.
2. CSV. UTF-8 with a byte-order mark so accents open correctly in common spreadsheet apps (to confirm in testing). Columns: reference, date and time (ISO 8601 with +03:00), wallet, type, status, direction, amount (integer MGA), fee, total, counterparty, rule name, note, balance after. Labels are in the person's language; stable technical names are in a second header row. Amounts are plain integers with no grouping.
3. PDF. A statement with owner, wallet, period, generation time and the code MGA; opening balance, closing balance, money in and money out; the entries as list rows; page numbers and a generation reference ID. Opening plus in minus out equals closing, to the ariary, and the closing balance equals the ledger at period end. Text is real text, not images.
4. Business rule, content. Totals count only posted entries. Pending, Failed and Cancelled items are listed in a section "Not counted". Reversed entries appear with their reversal. Notes marked private and attachments are never included.
5. Size. Up to `EXPORT_SYNC_MAX_ROWS` the file is built at once. Above it, the screen says "We are preparing your file", and push `push.wal.export_ready` arrives when done. A private download link lasts `EXPORT_LINK_TTL`. A finished file is saved on the phone and opens offline.
6. Business rule, group wallet. Phone numbers are masked as in the ledger; names of initiator and approvers are included. The person needs `export history`; a person without it sees the missing permission by name.
7. Errors and offline. A failed build gives no partial file and `err.wal.export_failed` with "Try again". Offline, "Export" is disabled with an explanation; files already downloaded stay readable. An empty period creates no file and says "Nothing to export for this period".
8. No paywall. Export is free and has no cooldown for wallet history in the MVP.
9. Audit. Entry `export.created` with actor, wallet, period, filters, format, row count, time.

**Data:** Ledger entry (read), Transaction (read), Audit entry (write), Notification (write), Export file (write).
**Depends on:** WAL-15, ACC-14, CON-18, XCT-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Does the accounting profession in Madagascar need a standard format or chart of accounts? Spreadsheet delimiter and encoding by locale. Does the download need the PIN, as in ACC-14?

---

### WAL-17 Read my balances and recent history without a connection

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** the same as online
**Tags:** offline, ledger

**Story:** When I have no connection or no data, I want to open Gereo and still read my balances and recent history with the time they were last updated, so I am never locked out of information about my own money.

**Conversation:** Offline read access to balances and recent history is a differentiator and a stated requirement (competitive analysis section 5; conventions section 2). The guidance: say what still works, avoid the word "offline" for non-technical users, show freshness, and never queue money silently (07 UI/UX 4 R-O1 to R-O7; 08 competitor UX 6.13). The ledger is server-authoritative, so the phone never "wins" a conflict on money (R-O4). Balances older than a threshold carry a warning (R-O7). Real devices have 1 to 2 GB of RAM and slow data (design foundations section 1 item 3).

**Preconditions:** The app synced at least once on this device.
**Trigger:** The app opens without a connection, or the connection drops while it is open.

**Acceptance criteria:**
1. Happy path. After each successful sync the phone keeps: wallet list, balances, goals, rule definitions, the last `OFFLINE_CACHE_DEPTH` entries per wallet and the receipts for them. One header indicator shows "Updated hh:mm", "Updating..." or "Not updated since yesterday. Retry".
2. Business rule, wording. Without a connection the screens open from cache and say "No connection" with what still works (balances, history, receipts, rules). The word "offline" is not used. The banner does not block the screen.
3. Business rule, freshness. If the last sync is older than `STALE_BALANCE_AFTER`, each cached balance carries "May be outdated" and the money buttons explain that the balance is re-checked when sending.
4. Business rule, actions. Add money, send out, move money, send to a person, close, edit and export are disabled with a one-line reason (`wal.offline.money_needs_connection`). Nothing that moves money is queued on the phone. "Report this payment" is kept as "Waiting to send" with its state shown (WAL-14).
5. Sync. When the connection returns, the app updates by itself and the indicator changes. For balances the cache is replaced by the server value, never merged.
6. Security. Cached data is readable only after the app unlock (PIN or biometric, ACC-03) and is erased on sign-out and when a device is removed (ACC-11, ACC-12).
7. Permissions. Group wallet data is cached only for what the person may see. When a permission is revoked, the next sync removes that data from the phone.
8. Storage. The app asks for persistent storage with a one-screen explanation of what is saved and about how large it is, within `OFFLINE_CACHE_MAX_MB`. If refused or evicted, the app works online and says "Nothing is saved on this phone yet" with the reason.
9. Accessibility and language. The hidden-balance setting (WAL-19) is respected in cached views. Times are in Madagascar time, strings in the person's language.

**Data:** Wallet, Ledger entry, Transaction, Wallet rule (cached read), Device.
**Depends on:** WAL-02, WAL-03, WAL-15, ACC-03, ACC-11, ACC-12, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Value of `OFFLINE_CACHE_DEPTH`. Whether a "remind me by SMS when I am online" option should exist for blocked money actions. How to handle a shared phone.

---

### WAL-18 Correct a mistake with a reversing entry, never an edit

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator, System
**Permission needed:** none (operator tool, OPS)
**Tags:** legal-gate, ledger, audit

**Story:** As a Gereo operator, I want to correct a mistake by adding a reversing entry with a reason, so that the history stays complete and the people who see it can trust it.

**Conversation:** The ledger is append-only and a correction is a reversing entry (conventions section 2; info.md, "Principes comptables"). People can see an entry reversed with its reason, never silently changed (07 UI/UX 8.1 R-G5). Open Collective keeps immutable entries and adds correcting ones (08 competitor UX 6.3, Adopt). System reversals (a failed withdrawal returns the money) need no operator and are described in WAL-08 and WAL-11. Gereo cannot recall money that already left for the provider; recall happens with the provider and Gereo records only what it holds.

**Preconditions:** An entry exists. For an operator action, there is a support ticket (OPS) with a reason.
**Trigger:** A system failure path (WAL-08, WAL-11), or an operator posts a reversal or correction from a ticket.

**Acceptance criteria:**
1. Business rule. No actor, screen or API can edit or delete a ledger entry. A correction is a new entry linked to the original with a reason code and a note.
2. System reversals. A failed or cancelled withdrawal (WAL-08, WAL-10, WAL-11) posts its reversing entry automatically with the reason `withdrawal_failed` or `withdrawal_cancelled`. No operator is needed.
3. Operator flow. From a ticket the operator picks an entry and chooses Reverse in full or Correct (new adjusting entries). A reason code, a note and the ticket number are required. Above `CORRECTION_APPROVAL_THRESHOLD` a second operator must approve before posting.
4. Preview. Before posting, the operator sees the exact entries to be written and the resulting balance of each wallet. The button reads "Post reversal of 50 000 Ar". A reversal that would take a wallet below zero is blocked with the reason and the alternatives (open question).
5. One reversal per entry. An entry can be reversed in full once. Partial corrections can add up to at most the original amount. Both are enforced by the ledger.
6. Person's view. The original row shows the chip "Reversed" and links to the reversal; the reversal row reads "Reversal of Ref 7Q4K-82" with a reason in plain words (key `wal.reversal.reason.<code>`). The balance arithmetic is visible. Operators appear as "Gereo support", not by name.
7. Rules. A reversal or correction is never income (no rule fires on it) and never counts as spending for a cap. A reversed income does not undo what rules already moved from it (open question).
8. Notifications. The owner gets push `push.wal.reversal_posted` and SMS `sms.wal.reversal_posted` ("A correction of 50 000 Ar was made on Savings. Ref 7Q4K-82. See the app."). Group wallets: members with `view history` see it in the feed and the digest.
9. Ledger and audit. Audit entry `ledger.reversal` with operator, approver, ticket, reason, balances before and after, time, visible to authorised operators and, in words, to the people concerned.

**Data:** Ledger entry (write), Transaction (read), Support ticket (read), Audit entry (write), Notification (write).
**Depends on:** WAL-11, WAL-14, OPS (ticket and correction tool), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** What happens if a reversal would make a balance negative (debt claim, block, or loss absorbed by Gereo)? Whether a reversed income should offer to reverse its rule shares. Who may approve high-value corrections and what evidence they need.

---

### WAL-19 Hide my balance, and see when a wallet is low or empty

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** `view balance` for group wallets
**Tags:** offline, ledger

**Story:** When other people can see my screen, I want to hide my balances with one tap, and when a wallet is running low I want it to be obvious, so I keep my privacy and am never surprised by an empty wallet.

**Conversation:** CGAP principle 21: make the balance easy to see and easy to hide, because users want privacy from family and others (07 UI/UX 2.2 R-M10 [V]). The low-balance state exists only when the person asked for a threshold (RUL-11); Gereo does not guess, because a default threshold would be wrong for most wallets. The empty state follows 07 UI/UX 2.3 R-T7. Insufficient-balance handling in forms (WAL-09, WAL-12) reuses the same words.

**Preconditions:** The person has at least one wallet.
**Trigger:** The person taps the eye icon, or a wallet's Available falls below its threshold or to zero.

**Acceptance criteria:**
1. Happy path, hide. An eye icon with a visible label "Hide" or "Show" sits on the wallet list and the wallet detail. Tapping hides every balance-type figure (Available, safe to spend, goal amounts, the total) as "••••". The state is remembered per device across restarts. The default is visible.
2. Business rule. Hiding applies on every screen that shows a balance, including cached views and the home total, and for group balances too. Transaction amounts in history stay visible in the MVP (open question). Notifications and SMS are unchanged.
3. Business rule, low state. When a wallet has an active low-balance rule (RUL-11) and Available is below its threshold, the card and the detail show the chip "Low balance" (icon and word), the line "Below 50 000 Ar" (example) and an "Add money" button. It clears when Available is back at or above the threshold. No threshold means no low state.
4. Business rule, empty. A wallet with activity and Available 0 shows the chip "Empty" and "Add money". A new wallet with no activity shows the onboarding empty state of WAL-01.
5. Business rule, pending. The low and empty states use Available only. Pending deposits appear as a note ("1 deposit on its way, not counted yet"), never added in.
6. Business rule, forms. Insufficient-balance messages in WAL-09 and WAL-12 show Available and, when another wallet of the person has enough, a link "Move money from [wallet]" that opens WAL-12 filled in.
7. Group wallets. Low and empty states are visible to members who can view the balance. Alerts about them go to the audience chosen in RUL-11 and NTF.
8. Accessibility and language. The toggle is at least 48 dp. A screen reader says "Balance hidden. Double tap to show". The chip uses icon and word.
9. No notification and no ledger entry. This story only changes display.

**Data:** Wallet (read), Ledger entry (read), Wallet rule (read, threshold), Device setting (write, local).
**Depends on:** WAL-02, WAL-03, RUL-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Should history amounts also hide? Should a lock-screen push show amounts?

---

### WAL-20 See that my ledger matches the provider, as a status line

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member, System
**Permission needed:** `view balance`
**Tags:** legal-gate, ledger, audit

**Story:** When I look at a wallet, I want a short line that tells me when the ledger was last checked against Vanilla Pay and whether it matched, so I know the numbers are real.

**Conversation:** A daily reconciliation with the provider and alerts on gaps are required (info.md, "Contrôles"; competitive analysis section 6 item 6). Nothing found documents a reconciliation visible to users (08 competitor UX 6.4, Open opportunities; design foundations section 1 item 4). The risk is alarm, so wording is factual and the next step clear. This story is the wallet-level line; CON-17 is the same line on the group ledger, and both read results owned by OPS, using the same component and the same wording to be harmonised.

**Preconditions:** The reconciliation job has produced at least one result (OPS).
**Trigger:** The person opens a wallet.

**Acceptance criteria:**
1. Business rule, job. Every day at `RECON_TIME` the system compares each provider transaction of the day with the ledger by reference and amount, and the total of client-fund ledger accounts with the provider-held balance where the provider exposes it (open question). The result is stored with start, end, counts and outcome.
2. Happy path. The wallet detail shows one line with three possible states, each with icon and word: "Matched, checked 19 Oct 02:00", "Checking...", or "Difference under review since 19 Oct 02:00". Time is absolute, in Madagascar time.
3. Explanation. A tap opens a short note in plain words: what is compared, how often, and "Your balance comes from the Gereo ledger and is not changed by this check". It lists the number of the person's own items still waiting to be matched. It shows no amount of any difference to people without operator rights.
4. Difference. The person's unmatched items show Needs attention (WAL-14). OPS is alerted. Nothing is corrected automatically; a fix is a reversing entry (WAL-18). The line returns to Matched when OPS closes the case, with an audit entry.
5. Missed run. If there is no successful run within `RECON_MAX_AGE`, the line says "Not checked since 17 Oct 02:00" with a warning chip, and OPS is alerted. Provider unreachable: "Provider balance not available now", showing the last good result, never an invented number.
6. Offline. The cached line shows "Last known: Matched, checked 19 Oct 02:00" and keeps the reconciliation time distinct from the last-synced time (CON-17 AC7).
7. Group wallet. Every member who can view the balance sees the same line.
8. Notifications. None by default. If one of the person's items is involved, push `push.wal.needs_attention` ("We are checking a payment. Ref 7Q4K-82. You do not need to do anything.").
9. Audit. Every run, with its outcome and any operator action, is stored for `RECORD_RETENTION_YEARS`.

**Data:** Reconciliation result (read, owned by OPS), Transaction (read), Audit entry (write).
**Depends on:** WAL-07, WAL-11, CON-17, OPS (reconciliation job).
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay expose a balance and a daily settlement report to compare against? Is reconciliation per wallet or global (the funds sit in a global account, 03 mobile money 5.1)? Tolerance below which a difference is not shown.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| WAL-01 | Create a wallet | P0 | ACC-02, ACC-03, GRP-15 |
| WAL-02 | See all my wallets and what each one holds | P0 | WAL-01, GRP-06 |
| WAL-03 | Open a wallet and see its true balance, goal and what is safe to spend | P0 | WAL-01, WAL-02 |
| WAL-04 | Rename and edit a wallet | P1 | WAL-01, RUL-10 |
| WAL-05 | Close a wallet | P1 | WAL-03, WAL-09, WAL-12, SPD, RUL-08 |
| WAL-06 | Add money from mobile money: amount, fee preview and start | P0 | WAL-01, WAL-07, WAL-08, ACC-03, ACC-07, OPS-11 |
| WAL-07 | Settle a deposit exactly once: provider callback, idempotency and timeouts | P0 | WAL-06, OPS, NTF |
| WAL-08 | When the provider is not available, say so and keep the money safe | P1 | WAL-06, WAL-10, WAL-11, OPS, NTF |
| WAL-09 | Send money out: choose amount and recipient, with limits and fee preview | P0 | WAL-03, WAL-10, ACC-07, OPS-11, GRP-12, GRP-13, SPD |
| WAL-10 | Review, confirm with my PIN, and pause for a new recipient | P0 | WAL-09, ACC-03, ACC-04, ACC-05, GRP-13, SPD, RUL-09 |
| WAL-11 | Follow a withdrawal to its end: confirmed, failed with refund, or needs attention | P0 | WAL-07, WAL-08, WAL-10, WAL-14, OPS |
| WAL-12 | Move money between my own wallets | P0 | WAL-03, GRP-12, GRP-13, SPD, RUL-07 |
| WAL-13 | Send money to another person or group inside Gereo | P1 | WAL-10, WAL-12, ACC-07, GRP-13, SPD, RUL-07, NTF |
| WAL-14 | Read one transaction and its receipt, and report a problem | P0 | WAL-07, WAL-11, WAL-15, RUL-12, OPS |
| WAL-15 | Browse and search my history with filters | P0 | WAL-03, WAL-14 |
| WAL-16 | Export a wallet's history as CSV or PDF | P1 | WAL-15, ACC-14, CON-18 |
| WAL-17 | Read my balances and recent history without a connection | P0 | WAL-02, WAL-03, WAL-15, ACC-03, ACC-11, ACC-12 |
| WAL-18 | Correct a mistake with a reversing entry, never an edit | P1 | WAL-11, WAL-14, OPS, NTF |
| WAL-19 | Hide my balance, and see when a wallet is low or empty | P2 | WAL-02, WAL-03, RUL-11 |
| WAL-20 | See that my ledger matches the provider, as a status line | P1 | WAL-07, WAL-11, CON-17, OPS |

Totals: 20 stories. P0: 12 (WAL-01, 02, 03, 06, 07, 09, 10, 11, 12, 14, 15, 17). P1: 7 (WAL-04, 05, 08, 13, 16, 18, 20). P2: 1 (WAL-19).

## Cross-epic dependencies

- **ACC.** ACC-02 and ACC-03 (sign-in and PIN, PIN required on every money-out, PIN lock), ACC-04 (PIN reset), ACC-05 (new device and cooling period), ACC-07 (tier ladder and the "limit hit" message, used by WAL-06, WAL-09, WAL-13), ACC-11 and ACC-12 (cache erased on device removal and sign-out), ACC-14 (personal data export, shares format rules with WAL-16), ACC-16 (invite a person who has no Gereo yet).
- **GRP.** GRP-06 (group home lists the group wallets), GRP-12 (spending bands), GRP-13 (no single person moves group money alone: applies to WAL-09, WAL-12, WAL-13), GRP-15 (create another wallet inside the group, shares WAL-01), permission checks through GRP-09.
- **CON.** CON-04 to CON-05 (contribution payments use the deposit machinery of WAL-06 and WAL-07), CON-11 to CON-15 (group split rules run on the engine RUL-07), CON-16 (group ledger view built on WAL-15), CON-17 (reconciliation line, same component as WAL-20), CON-18 (meeting export built on WAL-16).
- **SPD.** The spend request and approval flow that authorises group payouts and group transfers (WAL-09, WAL-10, WAL-12, WAL-13), reserved amounts in safe to spend (WAL-03), approved but unpaid spends that block closing (WAL-05), expense entries (SPD-16).
- **VOT.** Indirect: VOT-03 (a passed vote creates an expense request that ends as a WAL payout) and the recovery vote of GRP-14.
- **PRJ.** A wallet linked to a project cannot be closed while the project holds it (WAL-05); project spending debits the linked wallet through SPD.
- **EVT, ANN.** No direct dependency.
- **NTF.** Delivery, batching, quiet hours and SMS fallback for every key named here (`push.wal.*`, `sms.wal.*`, in-app `wal.notice.*`); the digest for group entries; GSM-7 lint for SMS templates.
- **XCT.** Number and date formatting (XCT-02), offline cache and sync infrastructure and storage consent (XCT-03, XCT-07), Malagasy and French strings, accessibility rules.
- **OPS.** OPS-11 (tier limits and fee configuration), reconciliation job and its alerts (WAL-20), Needs attention queue, support tickets for "Report this payment" (WAL-14), correction tool with two-person approval (WAL-18), provider health and queue monitoring (WAL-08).
- **RUL.** RUL-07 (the engine reads income postings from WAL-07, WAL-13), RUL-09 (spending cap seen on the review sheet, WAL-10), RUL-10 (goal shared with WAL-04), RUL-11 (threshold drives the low state, WAL-19), RUL-12 (rule history linked from the "why" line, WAL-14).

## Open questions

1. **Legal gate.** The legal basis for holding client funds is unconfirmed (Law 2016-056 Arts. 9, 16, 17, 25, 79 to 80, as read in 03 mobile money 5.1). Every story tagged legal-gate waits on counsel's opinion on the operating model (mandated agent, licensed partner or own licence) and on the status of a group wallet ledger.
2. **Labels.** May wallets be called "Savings" and "Investment" given Art. 17 on advertising e-money as savings? Copy review before the wireframes.
3. **Vanilla Pay facts.** API, sandbox, callback signing, retry policy, status endpoint, amount encoding (ariary or minor unit), recipient name lookup, recall and reversal rules, settlement timing, fees and the per-transaction, daily and per-account meaning of the 100 000 000 Ar ceiling (03 mobile money 3.2, 7.4).
4. **Limits and fees.** Tier limits (OPS-11), deposit and payout limits, who pays the deposit fee, the tax line status, and how the 20 000 000 Ar operator wallet cap constrains group payouts.
5. **Safe to spend.** The definition in WAL-03 is a proposal. Test it in the field, especially for savings wallets and for group wallets.
6. **Income classification.** Is a deposit into a group wallet always Income, or chosen at deposit time (CON-14 open question)? Shared decision with RUL and CON.
7. **Transfers between owners.** Receiving wallet, who may receive, blocking unknown senders, and whether such transfers count toward money-out limits (WAL-13).
8. **PIN rules.** PIN for transfers inside one owner above some amount, biometric on money-out, and whose PIN is asked for group payouts (WAL-10, WAL-12).
9. **Late and unclear provider results.** Can a Failed deposit become Confirmed later? How long may Needs attention last before escalation? What is promised to a person who sent money to the wrong number?
10. **Negative balances.** What a reversal does when the wallet is already below the amount (WAL-18).
11. **Permissions for wallet administration.** No wallet permission covers create, rename or goal edit on a group wallet; `edit group` and `edit rules` are stand-ins (WAL-01, WAL-04, GRP-15).
12. **Vocabulary.** One controlled list of entry types shared by WAL-15, CON-16 and the exports.
13. **Reconciliation scope.** Per wallet, per group or global, and who sees the amount of a difference (WAL-20, CON-17).
14. **Retention and shutdown.** The retention period and a published data-retention and shutdown commitment (competitive analysis section 7).
