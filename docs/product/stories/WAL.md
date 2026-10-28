# WAL: Wallets and ledger

Epic code WAL, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, statuses, IDs) and the founder decisions D1 to D5 in [05-decisions.md](../05-decisions.md); where a story touches a decision, it follows it. Journey steps covered: 3 Set up, 4 Fund, 6 Spend (the payout step), 7 Follow, 8 Report and support.

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

- Message keys: UI `wal.<screen>.<element>`, errors `err.wal.<code>`, notifications `msg.wal.<event>` with the variants `.push`, `.sms` and `.inapp`. Offline refusals use `xct.offline.money_blocked` for money-out and `xct.offline.needs_connection` for everything else (XCT-05, XCT-06). All text exists in Malagasy, French and English. Wording in quotes is intent, not final copy.
- All amounts in examples (50 000 Ar, 500 Ar and so on) are illustrations. No fee, limit, tax or duration in this file is a decision. Each is a configurable parameter, written in capitals, with its source or status.
- Amounts are integer ariary, shown as `12 500 Ar` (space grouping, no decimals, no-wrap). Receipts and exports use the code `MGA`.
- Times are shown in Madagascar time (Indian/Antananarivo, UTC+3) with the zone shown on deadlines.
- Transaction statuses are exactly Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention in the interface. Status is always icon, word and colour. "Reversed" is a chip on a ledger entry that has been reversed (WAL-18), not a sixth status. A status may carry a plain sub-label but never a new name: a payout queued during an outage is Pending with the label "Waiting for the provider" (OPS-13 calls the same state "Queued for provider"), and a deposit waiting for the operator's answer is Pending with the label "Waiting for the operator". The provider name never appears in these labels. Money set aside for a payout goes through two stages, Reserved and then In transit, both shown as "Set aside, not sent" (conventions 10.5). A group spend waiting for approvals or a vote is an expense request with the SPD statuses (Awaiting approval, Awaiting vote), not a transaction, until its payout is dispatched.
- Tiers follow ACC-07: Tier 1 is phone, OTP and PIN; Tier 2 adds ID and selfie; Tier 3 adds extra proof. Limits per tier come from OPS-11 and are not known.
- Money-in and money-out always name the mobile money operator on the payment screens (07 UI/UX 2.8 R-S5). The payment provider sits behind a payment adapter, so no story names a provider field.
- Entries are append-only. A wallet balance is always the sum of its ledger entries, never a stored number that code can overwrite.
- For wallets owned by the user, the user holds every wallet permission. For group wallets, each permission is checked individually.
- Group wallets: every outflow (mobile money, transfer to a personal wallet, transfer to another group wallet) is authorised in one of two ways, chosen by the spending policy (GRP-12, GRP-13; decisions D1 and D4). Below the vote threshold: the approvals of the band, each from a person other than the requester, who can never approve their own request and for whom no setting allows it. At or above the vote threshold: a passed vote with at least two distinct voters other than the requester, which starts the payment without approvers. WAL stories describe the payout and the money states; the request and approval screens are SPD and the vote screens are VOT.
- Permissions are written "Object: name" as in GRP. The member permission catalogue, the bundles and the money-out class are owned by GRP Shared definitions; conventions section 7 lists names only. Wallet permissions used in this file: Wallet: view balance, view history, deposit, initiate spend, edit rules, export history, close, freeze, create. Wallet: create and Wallet: freeze are not money-out permissions, so granting them needs no PIN. Wallet: approve spend is used by SPD only. Operator permissions are a separate catalogue owned by OPS-01, never member permissions.
- Income (decision D3): defined once in conventions 10.1. WAL-07 owns and emits the "money posted to a wallet" event; RUL-07 consumes it, and cycle detection and `RULE_CHAIN_DEPTH_MAX` are owned by RUL-06.
- Rounding (decision D5). When split rules fire on an income, the leftover ariary (always under 1 ariary per destination) is a Rounding line credited to Gereo (CON-14). It shows on the receipt (WAL-14), in history (WAL-15) and in exports (WAL-16), and is disclosed in the terms (ACC-13).
- Ledger types. The chip list is the one of conventions 10.7: Contribution, Penalty, Income, Split, Rounding, Expense, Transfer, Fee, Share-out, Reversal, Cash-out. Expense is reserved for group spending; a withdrawal to mobile money is Cash-out. Two further ledger types exist for platform lines: Rounding (from the wallet to the Gereo income account) and Platform: SMS allowance (WAL-13, conventions 10.3). The provider channel is a separate field, Where: Mobile money in, Mobile money out, Inside Gereo (WAL-15).
- Wallet states are Open and Closed. Everything else shown on a wallet is a chip derived from facts, never a stored state: Wallet frozen (Wallet freeze, applied by a holder of Wallet: freeze, SPD-15), Held by Gereo, Rules paused, Low balance, Empty, Goal reached, Needs attention.
- Held by Gereo. A wallet state set only by an operator (OPS-10) and cleared only by an operator or by expiry; the group cannot lift it. It stops money-out, including every split leg and the Rounding line to Gereo, but not incoming money, which still arrives and stays whole in the wallet. The wallet shows a banner with a reference and the support route, never the reason. A payout that is already Pending finishes; new ones are blocked. This differs from Wallet freeze, which stops only payouts and refunds.

## Configurable parameters

| Parameter | Meaning | Starting value or status |
| --- | --- | --- |
| `WALLET_MAX_PER_OWNER` | Maximum open wallets for one user. A group is limited by `grp.max_wallets_per_group` (GRP-15), not by this parameter | 10 proposed |
| `WALLET_NAME_MAX` | Maximum characters in a wallet name | 40 proposed |
| `DEPOSIT_MIN`, `DEPOSIT_MAX_PER_TX` | Smallest single deposit, and largest single deposit as a provider cap only. Limits per tier are read from OPS-11 | TBD (provider terms unknown, 03 mobile money 3.2) |
| `WITHDRAW_MIN`, `PAYOUT_MAX_PER_TX` | Smallest withdrawal; largest payout per operator | TBD. Operator caps differ (MVola individual wallet Ar 20M, 03 mobile money 3.3 item 3) |
| `FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE` | The three parts of a fee line | TBD. The tax line must be addable without a schema change (03 mobile money 5.3; the 0.5 percent mobile money tax status is unverified) |
| `PENDING_ETA_TEXT_MINUTES` | Minutes quoted as "usually under" on a Pending screen | TBD (07 UI/UX 9 sample copy uses 2 minutes as an illustration) |
| `PENDING_TIMEOUT` | Time with no provider answer before Gereo polls | TBD |
| `STATUS_POLL_INTERVAL`, `STATUS_POLL_MAX` | Poll frequency and attempt count | TBD, with backoff and a cap (07 UI/UX 4 R-O3) |
| `PAYOUT_PROVIDER_WAIT_MAX` | Longest a payout, personal or group, waits for the provider, on the server side. It is not the device queue of XCT-05. Owned here; every other file only cites it | 24 h proposed (outages in 03 mobile money 3.4 lasted hours to days) |
| `UNDO_WINDOW_SECONDS` | Delay before a payout is dispatched, during which Undo is shown. 0 means no undo | 10 for withdrawals and transfers out of a personal wallet; 0 for group payouts, which are already authorised by other people and have their own cancel (SPD-12). Low end of the 07 UI/UX 2.4 R-C4 hypothesis of 10 to 30 s |
| `LARGE_AMOUNT_PAUSE` | Amount that triggers the "Did someone ask you to send this?" pause | TBD |
| `LARGE_AMOUNT_WORDS` | Amount from which the review sheet repeats the amount in words | TBD |
| `TRANSFER_COUNTS_AS_MONEY_OUT` | Whether a transfer to another owner (WAL-13) counts as money-out against the sender's limits from OPS-11 (ACC-07 names it money-out) | true (default; a transfer to another owner is a scam target and leaves the sender's ownership) |
| `NEEDS_ATTENTION_ESCALATE_HOURS` | Time a payment may stay Needs attention before the case is escalated to a second operator | 24 h proposed |
| `SEARCH_DEBOUNCE_MS` | Wait after the last typed character before a history search runs | 300 |
| `HISTORY_PAGE_SIZE` | Entries per page | 20 (as in CON-16) |
| `EXPORT_SYNC_MAX_ROWS`, `EXPORT_LINK_TTL` | When an export runs in the background; how long the file stays available | TBD |
| `RECON_MAX_AGE` | Age after which the status line says "Not checked". CON-17 reads this same parameter | 36 h proposed (one daily run plus slack) |
| `CORRECTION_APPROVAL_THRESHOLD` | Correction amount above which a second operator must approve | TBD |
| `RECORD_RETENTION_YEARS` | Single definition of the retention of transaction records and raw provider callbacks. It also governs rule firing history and ID images, as RUL and OPS already state. Attachment and receipt retention after a project or group closes is not declared covered. Audit entries use `AUDIT_RETENTION_YEARS` (OPS), which must be at least this value | 5, from Law 2016-056 Art. 53 as read in 03 mobile money 5.1; whether it binds Gereo depends on the operating model (ACC open question 1) |

Parameters owned by other epics and used here without being redefined: `PIN_MAX_WRONG_ATTEMPTS` (5) and `PIN_LOCK_MINUTES` (15) and `NEW_DEVICE_COOLING_HOURS` (24), all ACC; `RULE_CHAIN_DEPTH_MAX`, RUL-06; `RECON_RUN_TIME` and `RECON_TOLERANCE_AR`, OPS-04; `PAYOUT_PENDING_ALERT_MINUTES`, OPS-13; limits per tier (deposit, money-out, daily totals) and fee tables, read from OPS-11; `STALE_BALANCE_HOURS`, `CACHE_RECENT_TRANSACTIONS` and `CACHE_MAX_MB`, XCT-04; `AUDIT_RETENTION_YEARS`, OPS.

## Stories

### WAL-01 Create a wallet

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (own wallet) or Group founder or Permission holder (group wallet)
**Permission needed:** none for a personal wallet; Wallet: create for a group wallet (decision D2)
**Tags:** ledger, audit

**Story:** As an individual, I want to create a named wallet of a type I choose, so that I can keep money for different purposes apart.

**Conversation:** Named wallets with a type, a balance and an optional goal are table stakes (02 personal finance, Takeaways, Table stakes item 1; competitive analysis section 7). Naming and separating money without new accounts is the mental model users like most (02 personal finance, Cross-cutting, "What users love" item 4, Monzo pots). Decisions: the type (budget, savings, investment, business) is a label that sets defaults, never a lock, and no wallet promises interest or yield (competitive analysis section 6 item 3; 03 mobile money 5.1, so the type labels read "Goal" and "Long term" rather than "Savings" and "Investment"). A wallet needs only the sign-up level (Tier 1) so that people can budget before they verify (02 personal finance, Cross-cutting, "KYC friction"). Group wallets are created from the group (GRP-15), need Wallet: create, and use the same form. Empty state of a new wallet follows 07 UI/UX 2.3 R-T7.

**Preconditions:** Signed in at Tier 1. For a group wallet, the person belongs to the group and holds Wallet: create.
**Trigger:** The person taps "New wallet" on the wallet list or on the empty home.

**Acceptance criteria:**
1. Happy path. The form asks for Owner (default "Me", plus each group where the person holds Wallet: create), Name, Type and an optional Goal (target amount in Ar, optional target date). Type is a choice of four with icon, visible word and one plain sentence each (key `wal.create.type.*`). Currency is shown as "Ariary (Ar)" and is fixed in the MVP. After "Create wallet" the person lands on the wallet detail (WAL-03) at 0 Ar with the empty state: one sentence about the wallet, one primary button "Add money".
2. Business rule. Name is required, trimmed, at most `WALLET_NAME_MAX` characters, and unique per owner ignoring case and accents (`err.wal.name_taken` names the field). At `WALLET_MAX_PER_OWNER` open personal wallets the button is disabled and `wal.create.limit_reached` says why. For a group wallet the limit is `grp.max_wallets_per_group` (GRP-15).
3. Business rule. The goal amount is a whole number of at least 1 Ar, typed on a numeric keypad with live grouping. The target date must be in the future. The goal can be added later (WAL-04) and is the same goal used by the goal rule (RUL-10).
4. Business rule. Creation needs no identity check beyond Tier 1; no verification prompt appears. Type does not change any money rule: there are no locks, penalties or yield in the MVP.
5. Business rule, group wallet. The group option is offered only to a person who holds Wallet: create; others see a note `wal.create.group_permission_needed` naming it. The new wallet inherits access from the group and the spending policy of GRP-12; GRP-13 applies from its first day. The creator gets no extra access to the new wallet beyond what they already hold. Wallet: create is not a money-out permission, so granting it needs no PIN (GRP Shared definitions).
6. States. While saving, the button shows progress and is disabled; the request carries an idempotency key so a double tap creates one wallet. A failure creates nothing, keeps the typed values and offers "Try again" (`err.wal.create_failed`). Offline, the form opens but "Create wallet" is disabled with `xct.offline.needs_connection`; no wallet is queued.
7. Ledger and audit. A ledger account is opened at zero. No money entry is written. Audit entry `wallet.created` with actor, owner, name, type, goal, time.
8. Notifications. None to the creator. For a group wallet, members get an in-app item `wal.notice.group_wallet_created`, batched by NTF-08, no push and no SMS.
9. Accessibility and language. The type picker is a radio group with visible words, not colour. The error summary is at the top with focus moved to it, and each message is also by its field. Names accept Malagasy, French and English characters and are stored as written.

**Data:** Wallet (write), Ledger account (write), Audit entry (write), User, Group, Membership (read).
**Depends on:** ACC-02, ACC-03, GRP-15 (group wallets from the group).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: creating a group wallet needs Wallet: create (decision D2). Closed: `WALLET_MAX_PER_OWNER` starts at 10, enough for envelope budgeting (02 personal finance, Takeaways item 2) without a long list. Closed: a wallet needs Tier 1 (an account), because a wallet has an owner; there is no wallet at Tier 0. Closed: the two types appear as "Goal" and "Long term" in all three languages, behind the same message keys `wal.create.type.*`, so the wording can change without a release.

---

### WAL-02 See all my wallets and what each one holds

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets; Wallet: view balance for a group wallet
**Tags:** ledger, offline

**Story:** When I open Gereo, I want to see all my wallets and what each holds, so I can decide where to put money or take it from.

**Conversation:** The wallet card is the place where goal progress, status and low-balance state become visible at a glance (08 competitor UX 6.3; 07 UI/UX 2.2 R-M10, R-M12). A group wallet shows "Group balance" with its own label, never a blended number with the person's own money (07 UI/UX 8.1 R-G6). Never show "No wallets" while loading (07 UI/UX 2.3, NN/g empty states).

**Preconditions:** Signed in.
**Trigger:** The person opens the home or the wallet list.

**Acceptance criteria:**
1. Happy path. The list has a section "My wallets" and one section per group. Each card shows name, type icon and word, Available balance, and when a goal exists `7 500 / 10 000 Ar` with a bar. Status chips appear when relevant: Wallet frozen, Held by Gereo, Rules paused, Low balance, Empty, Needs attention, Closed (icon and word), from the shared chip list of this file.
2. Business rule. The top line "All my wallets" is the sum of Available across the person's own open wallets. It excludes group wallets, closed wallets and money on its way in.
3. Business rule. A group wallet card says "Group balance". If the person lacks Wallet: view balance on it, the card shows the name and `wal.list.balance_not_permitted` and no number. A "Your share" line appears only where CON provides it, under its own label.
4. Business rule. Closed wallets are hidden behind "Show closed (n)". Order inside a section is by last activity, then name.
5. States. Empty: one sentence and "Create my first wallet", no empty chart. Loading: skeleton cards, never "No wallets" while loading. Refresh failure with a cache: the cached list stays with "Could not update. Retry". Without a cache: an error panel with Retry.
6. Offline. The list renders from cache with "Updated hh:mm". Cached balances older than `STALE_BALANCE_HOURS` carry "May be outdated" (XCT-04, WAL-17).
7. Accessibility and language. A card reads as one sentence to a screen reader ("Savings, savings wallet, available 12 500 Ariary, goal 75 percent"). Amounts do not clip at 200 percent font scale. Touch targets are at least 48 dp.
8. No notification and no ledger entry. Reading is not audited.

**Data:** Wallet (read), Ledger entry (read, balance), Wallet rule (read, count and state), Membership (read).
**Depends on:** WAL-01, GRP-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the home total hides when the hidden-balance setting is on (WAL-19 AC2). Closed: a group wallet the person can see only through Group: view group still appears as a card with its name and `wal.list.balance_not_permitted` and no number (AC3), so people know the wallet exists and whom to ask.

---

### WAL-03 Open a wallet and see its true balance, goal and what is safe to spend

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets; Wallet: view balance for the balance block, Wallet: view history for recent activity
**Tags:** ledger, offline

**Story:** As a wallet owner or member, I want one screen that shows the balance computed from the ledger, my goal progress and how much I can safely spend, so that I never have to guess.

**Conversation:** "Where is my money?" is the top complaint class (competitive analysis section 4 item 1). The balance is computed from the ledger, which is what guarantees it is real (02 personal finance, Gaps competitors leave, "Native ledger accuracy"). "What is safe to spend" is what users love in envelope budgets (02 personal finance, Cross-cutting item 1) and Monzo's budget view breaks when money sits in pots, so Gereo's version is allocation-aware (02 personal finance, Gaps item 3). Money in transit must never be silently counted or hidden (07 UI/UX 2.2 R-M11). Progress is shown as numbers plus a bar, never a bar alone (R-M12).

**Preconditions:** The wallet exists and the person holds the permission.
**Trigger:** The person taps a wallet card.

**Acceptance criteria:**
1. Happy path. The header shows name, type, owner and Available balance. Under it: "On its way out: X Ar" (already taken from Available, waiting for the provider) and "On its way in: X Ar, not counted yet" (pending deposits). Each line appears only when its amount is above zero.
2. Business rule. Available equals the sum of the wallet's posted ledger entries. It is computed on the server and never edited. While the screen is open and connected, a new entry updates the figures within 5 seconds without a manual refresh.
3. Business rule, goal. With a goal, the screen shows `7 500 / 10 000 Ar`, a bar, the percent, the amount left and the target date. Amount counted toward the goal is Available. At or above the goal the chip "Goal reached" appears. Without a goal, a "Set a goal" link opens WAL-04.
4. Business rule, safe to spend. For budget and business wallets the screen shows "Safe to spend: X Ar". It is the lower of (Available minus reserved amounts minus campaign reserves) and the cap left. Reserved amounts are pending withdrawals and spending that is authorised, by approvals or by a passed vote, but not yet paid (Reserved, conventions 10.5; SPD-10 reservation). The cap left applies only when a spending cap is active (RUL-09 for a personal wallet, SPD-14 for a group wallet); without a cap the first figure is used. It never goes below 0 ("Nothing safe to spend now"). A "How is this calculated?" link shows the lines of the calculation. Savings and investment wallets show goal progress instead.
5. Business rule, group wallet. Two figures with two labels: "Group balance" and, where CON provides it, "Your share" (07 UI/UX 2.2 R-M10).
6. Actions. "Add money" needs Wallet: deposit, "Send out" needs Wallet: initiate spend, and "Move money" needs Wallet: initiate spend on this wallet and Wallet: deposit on the destination. Without the permission a button is shown disabled with the missing permission named (key `err.wal.permission_missing`, as in 07 UI/UX 9 sample copy). A rules line "2 rules on, 1 paused" opens RUL-01. The reconciliation line of WAL-20 and the last N entries (link "See all", WAL-15) sit below.
7. States. Loading: skeleton, never "0 Ar" while loading. A closed wallet shows a banner "Closed on [date]" and no action buttons. A wallet under Wallet freeze (applied by a holder of Wallet: freeze) shows the banner `spd.freeze.banner` (SPD-15); "Send out" and "Move money" are disabled with that reason and "Add money" stays enabled. A new wallet shows the empty state of WAL-01. Offline: all of this from cache with "Updated hh:mm".
8. Errors. If the balance cannot be refreshed, the last known figure stays with "Not updated since [time]. Retry" and the money buttons say the balance is re-checked on send.
9. Accessibility and language. Amounts use equal-width digits and never wrap. The progress bar has a text alternative with the numbers. No information is conveyed by colour alone.

**Data:** Wallet, Ledger entry, Transaction, Wallet rule (read).
**Depends on:** WAL-01, WAL-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the definition of Safe to spend in AC4 ships as written, for budget and business wallets including group ones; field interviews may tune it later but nothing waits on them. Closed: a savings wallet with a goal gets no protected-amount line, because a protected amount is a lock and WAL-01 AC4 rules locks out of the MVP. Closed: "On its way in" shows to everyone who holds Wallet: view balance, because it is part of the balance picture and reveals no counterparty.

---

### WAL-04 Rename and edit a wallet

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; for a group wallet Wallet: create to rename it or change its type, and Wallet: edit rules to change its goal (the goal is a rule, RUL-10 and RUL-13)
**Tags:** audit

**Story:** As a wallet owner, I want to rename a wallet, change its type label and edit its goal, so that the wallet keeps matching what I use it for.

**Conversation:** Renaming, goals and caps are reversible, so no confirmation sheet is needed (07 UI/UX 2.4 R-C1, R-C5: confirm only money-out, money-moving rule activations and destructive actions). The goal is one object shared with the goal rule (RUL-10): editing it here or there changes the same record. History must not be rewritten, so receipts and exports show the wallet name as it was when the entry was made (decision: the ledger entry stores the wallet name at posting, so the presentation never has to guess). Concurrent edits on shared records use per-field merge, not last write wins (07 UI/UX 4 R-O4).

**Preconditions:** The wallet is open (not closed) and the person holds the permission.
**Trigger:** The person taps "Edit" on the wallet detail.

**Acceptance criteria:**
1. Happy path. The person can change name, type label, goal (amount, date, or remove) and, for a personal wallet, the setting "Receives transfers from other people" (WAL-13), which is on for exactly one wallet at a time. "Save" applies at once and returns to the detail with a short confirmation `wal.edit.saved`.
2. Business rule. Name rules are those of WAL-01 (required, length, unique per owner). Changing the type changes the label and the defaults shown, never balance or rules.
3. Business rule. Lowering a goal below the current Available shows the chip "Goal reached". Removing a goal shows a note that the goal rule's alerts stop (RUL-10) and removes the goal rule after the person agrees.
4. Business rule, group wallet. Without the permission, the fields are read-only with the permission named. Members with Wallet: view balance see the new name and goal at once.
5. Business rule. Past receipts and exports keep the wallet name recorded on each entry; the current name is shown in lists with "(was [old name])" in the detail of an old entry.
6. Concurrency. Edits to different fields merge. If another person saved the same field first, the person sees "Changed by [name] at hh:mm. Review" with both versions of that field and chooses; nothing is overwritten silently.
7. States. Saving shows progress. Failure keeps the typed values and says nothing changed. Offline: "Save" is disabled with `xct.offline.needs_connection`. A closed wallet cannot be edited.
8. Notifications. Personal wallet: none. Group wallet: in-app item `wal.notice.wallet_changed` to members with Wallet: view balance, batched by NTF-08, no push or SMS.
9. Ledger and audit. No ledger entry. Audit entry `wallet.edited` with before and after values, actor, time.

**Data:** Wallet (write, including the receives-transfers setting), Audit entry (write), Wallet rule (goal rule, write on removal).
**Depends on:** WAL-01, RUL-10, RUL-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: renaming and changing the type of a group wallet needs Wallet: create, and changing its goal needs Wallet: edit rules, because the goal is a rule. No new permission is added: renaming moves no money, and Wallet: create stays outside the Treasurer bundle so naming stays with the people who open wallets. Closed: the old name is kept on each ledger entry as a snapshot taken at posting (AC5), so the ledger holds it, not the presentation.

---

### WAL-05 Close a wallet

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: close for a group wallet
**Tags:** ledger, audit

**Story:** As a wallet owner, I want to close a wallet I no longer use, only when it holds no money and nothing is still moving, so that my list stays clean and no money is ever lost in a closed wallet.

**Conversation:** Wallet: close is a money-out permission (conventions section 7, GRP catalogue). Closing is where money can get stuck, so the rules are strict: zero balance and no pending item. The history stays and stays exportable, because data loss and company failure are a documented trust killer (Kippa; competitive analysis section 3.2 and section 7 design rules). Records are retained for the configured period (03 mobile money 5.1, Art. 53). Reopening is not in the MVP.

**Preconditions:** The wallet is open and the person holds the permission.
**Trigger:** The person taps "Close wallet" on the wallet detail.

**Acceptance criteria:**
1. Happy path. A checklist screen lists each condition with icon and word (Done, Not done) and the closing button "Close wallet [name]" enabled only when all are Done. A confirmation sheet restates what happens before the final tap.
2. Business rule, balance. Available must be exactly 0 Ar. If not, the line says "Move 12 500 Ar to another wallet or send it out first" with buttons to WAL-12 and WAL-09. Gereo never closes a wallet with a balance and never sweeps it by itself.
3. Business rule, pending. There must be no transaction in Initiated, Pending or Needs attention, no queued withdrawal, no authorised but unpaid spend (SPD-10), no open expense request on the wallet (SPD-01), no open vote that would pay from it (VOT-03), no open project holding it as its budget wallet (PRJ-03), and the wallet must not be under Wallet freeze (SPD-15, applied by a holder of Wallet: freeze) or Held by Gereo. Each blocker is listed with a link to it.
4. Business rule, rules. Rules on this wallet stop with the reason "Stopped: wallet closed" and keep their history. Rules in other wallets that send money to it are paused with the skipped-run reason `destination_closed` (RUL-12) and the owners are told before the person confirms ("2 rules will be paused: [names]").
5. Business rule, after closing. The wallet is read-only. Its history, receipts and export stay available. It is hidden from the default list. A deposit callback that arrives for a closed wallet is never lost: it goes to Needs attention for operators (OPS).
6. Business rule, group wallet. Wallet: close is required and one holder is enough: because AC2 and AC3 guarantee that no money moves through a closure, no second person is needed. Closing at zero with no pending item and no pending payout is not an outflow (GRP-13 AC4). Members with Wallet: view balance see the closed state at once, with the name of the person who closed it.
7. Errors. If a new pending item appears while the person confirms, closing is cancelled with "Not closed. Something just came in. Check and try again", and nothing changes. Offline: disabled with `xct.offline.needs_connection`.
8. Notifications (matches EV-WAL-14). Group wallet: push `msg.wal.group_wallet_closed.push` to members with Wallet: view balance. Personal wallet: none.
9. Ledger and audit. The ledger account is marked closed; no money entry is written. Audit entry `wallet.closed` with the checklist result, actor, time.

**Data:** Wallet (write status), Transaction (read), Wallet rule (write status), Audit entry (write).
**Depends on:** WAL-03, WAL-09, WAL-12, SPD-01, SPD-10, SPD-15, VOT-03, PRJ-03, RUL-08, RUL-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: reopening is not in the MVP; the person opens a new wallet and the history of the closed one stays readable and exportable. Closed: closing a group wallet at zero balance needs only Wallet: close (AC6). Open: the retention period and what the person is told about it (ACC open question 1). Default used: records and raw provider callbacks are kept `RECORD_RETENTION_YEARS` (5), and the closing sheet says that history stays exportable.

---

### WAL-06 Add money from mobile money: amount, fee preview and start

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; Wallet: deposit for a group wallet
**Tags:** ledger, audit

**Story:** When I want to put money into a wallet from my mobile money account, I want to see exactly what I will pay before I confirm, so I can add money without surprises.

**Conversation:** Showing the exact fee before confirmation is a design rule (competitive analysis section 6 item 5; 07 UI/UX 2.5 R-F1 to R-F4: fee and total update live while typing, "Fee: 0 Ar" is stated, one number with a "How is this calculated?" behind it). Cross-network payouts cost 3 to 10 times more than same-network, and fee slabs are hard to read (03 mobile money 7.1 item 4; 07 UI/UX 2.5). One review screen with everything (07 UI/UX 2.4 R-C2). The operator prompt on the person's phone is where the mobile money PIN is typed, never in Gereo (07 UI/UX 2.8 R-S1). Provider flows are asynchronous (03 mobile money 3.3 item 1). Every deposit is income for the wallet that receives it (decision D3), so a deposit into a group wallet from the wallet screen can be split by its rules (CON-14); contributions are paid through CON-04.

**Preconditions:** The wallet is open. The person's tier allows the amount (ACC-07). A provider is available (WAL-08 otherwise).
**Trigger:** The person taps "Add money".

**Acceptance criteria:**
1. Happy path. The amount screen has a numeric keypad, the destination wallet, the mobile money number (default: the saved number) and the detected operator. The line "You add 50 000 Ar, fee 500 Ar, total you pay 50 500 Ar" updates live as digits are typed. A fee of zero is shown as "Fee: 0 Ar". "How is this calculated?" lists provider fee, Gereo fee and tax line separately, each from configuration (`FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE`). The wallet is credited exactly "You add"; the person's mobile money account is charged "Total you pay".
2. Business rule, number. The number field accepts +261, a leading 0, spaces and dashes, normalises them and shows the normalised number back. The operator comes from a configurable prefix table. An unsupported prefix gives `err.wal.number_not_supported` before any request is sent.
3. Business rule, limits. The amount must be at least `DEPOSIT_MIN` and at most `DEPOSIT_MAX_PER_TX` (a provider cap only), and within the single-deposit limit of the person's tier, read from OPS-11. Above the tier limit the flow stops before the review with the ladder message of ACC-07 ("To add more than [limit], verify your ID") and the typed values are kept; no money moved.
4. Review. One screen shows: to wallet, from number and operator, you add, fee, total you pay, provider name, and the next step ("You will get a prompt from [operator] on your phone. Approve it with your mobile money PIN. Gereo never asks for your PIN"). The button reads "Add 50 000 Ar".
5. Start. Tapping creates a transaction with a reference ID, status Initiated, then Pending once the provider accepts. The screen shows the timeline Initiated, Pending, Confirmed, the reference ID (copyable), time elapsed and the sub-label "Waiting for the operator" and "Usually under `PENDING_ETA_TEXT_MINUTES` minutes. You do not need to do anything. We will SMS you." The wallet is not credited and Available does not change; the amount shows only as "On its way in, not counted yet".
6. Idempotency. An idempotency key is generated when the review opens. A double tap, a retry or a screen reload returns the same transaction and never a second prompt.
7. Cancel. While the status is Initiated and the provider has not accepted, "Cancel" ends it as Cancelled, no money moved. Once Pending, there is no Cancel button; the screen says to ignore the phone prompt if the person changed their mind, and that an unapproved prompt expires.
8. Errors. If the provider rejects at creation, the status is Failed at once with `err.wal.deposit_rejected` ("No money was taken. Check the number.") and a button to edit the number. If the network drops before an answer, the status is shown as Pending with "We are checking", never as Failed without proof. Offline: the button is disabled with `xct.offline.money_blocked`.
9. Notifications and audit. None at start. Audit entry `deposit.initiated` with actor, wallet, amount, fee lines, operator, reference, idempotency key, time. No ledger entry yet: WAL-07 writes it on Confirmed, and the credit is then income for the wallet (decision D3).
10. Accessibility and language. The live fee line is announced politely on change. The pending screen text is in the person's language and states elapsed time in absolute and relative form.

**Data:** Transaction (write), Wallet (read), Audit entry (write), Payment adapter request (write).
**Depends on:** WAL-01, ACC-03, ACC-07, OPS-08, OPS-11. Consumers of its transactions, by ID only: WAL-07, WAL-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the fee is added on top, so the wallet is credited exactly "You add" and a split rule works on the full amount; taking the fee from the credited amount would make every group split smaller than what the person typed. Closed: Gereo's PIN is not asked for a deposit; the operator PIN typed on the person's phone is the authorisation. Closed: any supported operator number can pay, the amount is whole ariary, and the 100 000 000 Ar ceiling is treated as `DEPOSIT_MAX_PER_TX` per transaction.

---

### WAL-07 Settle a deposit exactly once: provider callback, idempotency and timeouts

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** ledger, audit, sms

**Story:** When the provider tells Gereo what happened to a deposit, I want Gereo to record it exactly once and in the right state, so the person's balance is always correct and nobody is ever credited twice or not at all.

**Conversation:** Provider callbacks can time out or double-notify, so idempotency keys, pending and settled states and a reconciliation job are mandatory (competitive analysis section 6 item 6; 03 mobile money 7.1 item 5). "Debited but not delivered" with no trace in the app is the most repeated complaint (08 competitor UX 6.3, Avoid; competitive analysis section 4 item 1). The adapter does not assume that the provider signs callbacks or retries them; another aggregator signs notifications with HMAC and creates links idempotently (03 mobile money 3.4). The status mapping from the provider's words to ours is a table in the payment adapter spec.

**Preconditions:** A deposit transaction exists (WAL-06).
**Trigger:** A provider callback arrives, or `PENDING_TIMEOUT` passes with no answer.

**Acceptance criteria:**
1. Authenticity. A callback is processed only if it passes the check required by the provider contract. A callback that fails it is rejected, stored for review, changes nothing, and raises an alert to OPS after repeated failures.
2. Confirmed. The system matches the callback to the transaction by provider reference, amount and wallet. It posts one atomic, balanced set of entries: external provider account to the wallet for the amount, and external provider account to the fee and tax accounts for each fee line, since the person paid them on top. The status becomes Confirmed and Available rises by exactly the amount shown as "You add". An amount that differs from the transaction is not credited and the transaction goes to Needs attention.
3. Idempotency. A duplicate or replayed callback (same event or provider reference) changes nothing and is acknowledged to the provider. Test: the same callback delivered three times produces exactly one posting.
4. Failed and Cancelled. The status is updated and no wallet entry is written. The person sees a reason in plain words and whether money moved, but only when the provider says so (key `wal.deposit.failed.*`). If the provider result leaves it unclear whether the person was charged, the transaction goes to Needs attention instead.
5. Terminal states are final. A Confirmed callback that arrives after Failed or Cancelled, or one with an unknown reference, is stored, never credited automatically, flagged Needs attention and sent to OPS.
6. Timeout. With no answer by `PENDING_TIMEOUT`, the system polls the provider every `STATUS_POLL_INTERVAL` up to `STATUS_POLL_MAX` times. A poll answer is handled exactly like a callback. If it stays unknown, the person sees Needs attention with "We are checking with the mobile money operator. Reference [ID]. You do not need to do anything" and OPS is alerted. Gereo never marks a deposit Failed without a provider answer.
7. Notifications. Confirmed: SMS `msg.wal.deposit_confirmed.sms` (reference, amount, wallet; must pass the XCT-12 encoding and length lint, 160 GSM-7 characters at most) and push `msg.wal.deposit_confirmed.push` ("Added 50 000 Ar to Savings. Ref 7Q4K-82."). Failed: push `msg.wal.deposit_failed.push` and SMS `msg.wal.deposit_failed.sms` only when money moved or the outcome is unclear. For a group wallet, members with Wallet: view history see the entry in the feed and the digest, not one push each (NTF).
8. Rules and event. This story owns and emits the "money posted to a wallet" event. After the credit is posted, every Confirmed deposit is income for that wallet (decision D3, conventions 10.1) and the event carries it, whether it is a plain deposit or a contribution (CON-04). RUL-07 consumes this event and runs the rules; the other entry points that post money into a wallet (WAL-12, WAL-13) call the same posting path. A rule failure never rolls back the credit.
9. Ledger and audit. Every state change is an audit entry with the provider reference and actor "System". The raw callback (payload, receive time, outcome) is stored append-only for `RECORD_RETENTION_YEARS`. Each provider transaction is marked for reconciliation (WAL-20).

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Raw provider event (write).
**Depends on:** WAL-06, OPS-04, OPS-05, OPS-13, NTF-05, NTF-08. Consumers of its posted-money event, by ID only: RUL-07, WAL-12, WAL-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a Failed deposit never becomes Confirmed by itself; a late Confirmed callback goes to Needs attention and an operator decides (AC5, OPS-05), because a silent flip would credit a person the app already told "no money was taken". Closed: the provider fee never reduces what the wallet receives (WAL-06 decision). Closed: callbacks are verified by the method the contract requires, and until a status endpoint exists polling (AC6) is disabled and the transaction goes to Needs attention at `PENDING_TIMEOUT`.

---

### WAL-08 When the provider is not available, say so and keep the money safe

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member, System
**Permission needed:** none
**Tags:** ledger, sms

**Story:** When the payment provider or the mobile money operator is down, I want Gereo to say so clearly and keep my money safe, so I do not repeat a payment or believe my money is lost.

**Conversation:** MVola had material outages in November 2025 and May to June 2026, and aggregator calls fail with it (03 mobile money 3.4, "Operator risk passes through"; competitive analysis section 2). The rule is: show a "provider unavailable" state and queue payouts rather than failing (competitive analysis section 6 item 7; 03 mobile money 7.1 item 6). A deposit cannot be queued because the person must approve on their own phone, so only an alert is offered. Offline (no connection on the phone) and provider-down (Gereo cannot reach the provider) have different words, because the cause must be attributed accurately (07 UI/UX 4, web.dev guidance).

**Preconditions:** The payment adapter reports a rail or operator as unavailable, by health check or by errors above a threshold, or an operator has posted the incident (OPS-08) or paused dispatch (OPS-13).
**Trigger:** The person starts a deposit or a withdrawal while the state is on.

**Acceptance criteria:**
1. Happy path, banner. Money screens show the banner "Payments are not available right now" (or the operator name) with the time since it started and what still works (balances, history, moves between wallets). The state can apply to one operator only.
2. Deposit. The flow stops at the amount screen with `err.wal.provider_down_deposit`: "We cannot reach [operator] right now. No money was taken." Two buttons: "Try again" and "Tell me when it works". The second registers one alert (push, SMS if the app is not opened) when the state clears, with an expiry. No deposit is queued.
3. Withdrawal. A personal-wallet withdrawal can complete the review and the PIN (WAL-10). It is accepted as Pending with the sub-label "Waiting for the provider" and the text "We will send it as soon as it is back. Your money is set aside." The Pending transaction is created at acceptance and the amount is reserved at that moment (Reserved, then In transit at dispatch, shown as "Set aside, not sent", conventions 10.5). The amount leaves Available at once and shows under "On its way out" with its reference ID. A group payout that is already authorised (SPD-10) behaves the same way from the moment it is accepted. The fee shown at authorisation is the fee charged; Gereo bears any later provider change.
4. Queue rules. Queued withdrawals are sent in order of acceptance when the provider returns. Each is re-checked (limits, destination) and sent with the same idempotency key, so a retry never pays twice.
5. Cancel. While queued and not yet sent, the person can cancel: status Cancelled, a reversing entry returns the full amount and fee, no fee is kept. Once sent, no cancel is offered.
6. Expiry. After `PAYOUT_PROVIDER_WAIT_MAX` (server-side wait for the provider, not the device queue of XCT-05), a queued withdrawal becomes Failed, a reversing entry returns the money, and the person is told with the next action (try again, choose another number). The Needs-attention age for payouts (`PAYOUT_PENDING_ALERT_MINUTES`, OPS-13) applies only to dispatched payouts. Test: a payout queued for 2 hours is not Needs attention and shows "Waiting for the provider".
7. Notifications (matches EV-WAL-08). Queued: in-app and push `msg.wal.provider_queued.push`. One SMS per outcome: `msg.wal.provider_queued.sms` ("Your 50 000 Ar withdrawal is waiting. Your money is safe. Ref 7Q4K-82.") is the SMS for the queued or delayed outcome, direct (S-d) at or above `ntf.money_out_sms_min_amount` or for a new payee, otherwise S-fb after an unread push. Sent and Confirmed or Failed follow WAL-11, which sends no second SMS for the same payout unless the outcome changes. Every SMS text passes the XCT-12 lint. No mass message when the provider recovers.
8. Errors. When the phone has no connection the copy says "No connection" and what still works, not "provider unavailable". Nothing is queued from the phone itself, and the disabled action uses `xct.offline.money_blocked`.
9. Ledger and audit. While queued the amount is Reserved (a derived state with no ledger entry); acceptance or dispatch posts wallet to in-transit (conventions 10.5); cancel or expiry posts the reversal, or only releases the reservation when no entry was posted; each flip is an audit entry with actor "System". Queue size and age are visible to operators with an alert threshold (OPS).

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Provider health state (read).
**Depends on:** WAL-06, WAL-10, OPS-08, OPS-13, NTF-05. Outcomes after the queue follow WAL-11, which builds on this story.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the value of `PAYOUT_PROVIDER_WAIT_MAX` is set once, in the parameter table of this file. Closed: deposits are never queued, not even by a later pay-by-link flow in the MVP, because the person must approve on their own phone. Closed: Gereo holds the money already in the client-funds account, and OPS-13 pause covers a provider that cannot pay.

---

### WAL-09 Send money out: choose amount and recipient, with limits and fee preview

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: initiate spend for a group wallet
**Tags:** ledger

**Story:** As a wallet owner, I want to choose how much to send to a mobile money number and see the fee, the total and my balance afterwards while I type, so that I know the cost before I commit.

**Conversation:** Withdrawal delay and unclear outcomes are the second biggest complaint class (competitive analysis section 4 item 1). Validate the amount in real time and do not blame the person (07 UI/UX 2.4, CGAP principles 12 and 17). Tier limits are shown as "what you can do now and what unlocks next", asked at the moment a limit is hit (design foundations section 4; ACC-07). Operator caps apply even under the aggregator, so a payout above an operator's limit may fail whatever Gereo's ceiling (03 mobile money 3.3 item 3). Money-out is online only (conventions section 2; 08 competitor UX 6.13, "Avoid queuing money movement silently"). For group wallets, no single person can move money alone (GRP-13), so this screen creates the request that SPD authorises, by approvals or by a passed vote (decision D4).

**Preconditions:** The wallet is open, has Available above zero, and the person's tier allows money-out at all (ACC-07).
**Trigger:** The person taps "Send out".

**Acceptance criteria:**
1. Happy path. The screen has: from wallet with Available, to (saved recipients or "New number"), amount on a numeric keypad with a large echo. Under it, live: "Fee [X] Ar, total [Y] Ar, balance after [Z] Ar". A free payment shows "Fee: 0 Ar". The fee follows the destination operator and updates if the number changes operator.
2. Business rule, validation. As the person types, the screen flags an amount above Available ("You have 30 000 Ar available"), below `WITHDRAW_MIN`, or above `PAYOUT_MAX_PER_TX` for that operator ("The most you can send to [operator] in one payment is [limit]. Send in parts or choose another number"). No blame wording, and the next button stays disabled. There is no automatic splitting of a payment.
3. Business rule, number. The number accepts +261, a leading 0, spaces and dashes and is normalised and shown back. The operator comes from a configurable prefix table.
4. Business rule, tier. If the amount, or the day's total, passes the money-out limit of the person's tier (read from OPS-11; ACC-07 defines money-out, and for a group wallet says who needs which tier), the flow stops before the review with the ladder message of ACC-07 and a "Verify my identity" button. Typed values are kept. No money moved. A line "You can still send [X] Ar today" shows when a daily limit exists.
5. Business rule, group wallet. The person needs Wallet: initiate spend. The button reads "Ask to send" and creates an expense request (SPD-01); no money moves from this screen. The screen says how the request will be authorised under the spending policy (GRP-12). Below the vote threshold: "Needs [N] approvals from people other than you: [names of holders of Wallet: approve spend]". At or above it: "The group votes. At least 2 voters other than you must vote" (SPD-09). The requester can never approve their own request (decision D1). If the wallet is under Wallet freeze (SPD-15) the screen says the request will wait. A destination inside Gereo follows SPD-01 (Gereo destinations) and settles instantly (SPD-10 criterion 10). The payout runs only after the checks of SPD-10, then follows WAL-10 and WAL-11 for the money states.
6. Business rule, freshness. Available is re-read from the server when the person taps Next; if it changed, the new figure is shown first.
7. Offline. The screen explains "Sending money needs a connection. Your balance is saved on this phone" and disables the button (`xct.offline.money_blocked`). Nothing is queued from the phone.
8. Errors. A failed balance refresh keeps the screen and offers Retry. A recipient with an unsupported prefix gets `err.wal.number_not_supported`. Money has not moved in any of these errors, and the screen says so.
9. Accessibility and language. Amount errors are inline and read by screen readers without moving focus. The large echo and live line reflow at 200 percent font scale without clipping.
10. Business rule, project tag. An optional "For project" choice lists only the person's own personal projects. The choice is stored as an immutable tag (`project_id`) on the ledger entry of the payout. Reassigning it later is a separate link, never a ledger edit, and the tag of a closed project still resolves. Group wallets link a payout to a project through SPD, not here.

**Data:** Wallet (read), Transaction (draft), Saved recipient (read), Tier configuration (read).
**Depends on:** WAL-03, ACC-07, OPS-11, GRP-12, GRP-13, SPD-01, SPD-09, SPD-10, SPD-15. WAL-10 is the next step of this flow and builds on this story.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: limits by tier are the only restriction on who a person may pay; a Tier 1 person may pay any supported number within the Tier 1 limit set in OPS-11 (which may be zero), and the pause for a new recipient in WAL-10 is the protection against a wrong or coerced number. Closed: a group wallet never pays out directly, below a threshold or otherwise; every group payout is a request (GRP-13 floor). Closed: the 100 000 000 Ar ceiling is per transaction, as `PAYOUT_MAX_PER_TX` (see WAL-06).

---

### WAL-10 Review, confirm with my PIN, and pause for a new recipient

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; for a group wallet the requester holds Wallet: initiate spend and uses these screens when sending the request (SPD-01); each approver uses the PIN screen at approval (SPD-05)
**Tags:** ledger, audit

**Story:** As a person sending money out, I want one review screen, a PIN that repeats what I am approving, and a pause when the recipient is new, so that I do not send money to the wrong person or under pressure.

**Conversation:** About 25 percent of mobile money owners in Sub-Saharan Africa have sent money to the wrong person and half never recovered it (design foundations section 1 item 1; CGAP Findex 2025 [V]). Hence: one review screen with everything (07 UI/UX 2.4 R-C2, CGAP principle 20), outcome-labelled button, the PIN screen repeats amount and recipient (R-C6, R-A2), PIN on every money-out (conventions section 2), and a pause for a first-time payee, a new device or a large amount (07 UI/UX 2.8 R-S3, 2.6 R-E4; Monzo "Take Five"). The provider is not assumed to return the recipient's registered name (07 UI/UX 2.4 R-C3), so the screen shows the number and says the name is not available. Fraud here is social engineering around PIN and OTP (03 mobile money 6.7 item 4).

**Preconditions:** WAL-09 completed with valid values.
**Trigger:** The person taps Next on the amount screen.

**Acceptance criteria:**
1. Happy path. One review screen shows: to (registered name if the provider returns it, otherwise "Name not available", plus the full number and operator), from wallet, amount, fee, total taken, the effect "Savings goes from 80 000 to 30 000 Ar", date and time, and the provider name. The primary button is "Send 50 000 Ar to Rado". A "Change" link returns to the amount screen with values kept. From `LARGE_AMOUNT_WORDS`, the amount is repeated in words in the person's language. If the payment would take a personal wallet past its spending cap, a line says so (RUL-09: a personal cap only warns, never blocks). A block-mode cap on a group wallet stops a payout (SPD-14); that cap mode is applied when the request is created, not here.
2. Business rule, PIN. The button opens a PIN screen that repeats amount and recipient and shows "Gereo will never ask for your PIN or code by phone or message". The PIN is asked on every money-out, every time, with no "remember me". A biometric may be offered only if ACC-03 allows it for money-out; ACC-03 says the PIN is still required.
3. Business rule, wrong PIN. A wrong PIN shows the attempts left. After `PIN_MAX_WRONG_ATTEMPTS` the money-out is locked for `PIN_LOCK_MINUTES` with a visible way to recover (ACC-04). No money moved. After a new device or PIN reset, `NEW_DEVICE_COOLING_HOURS` applies as ACC defines.
4. Business rule, pause. If the number has never been paid successfully by this person, or the device is new, or the amount is at or above `LARGE_AMOUNT_PAUSE`, a pause screen appears before the PIN: "Did someone ask you to send this money?" with "Cancel" as the visually primary action and "Yes, continue" secondary, the line "Gereo never asks for your PIN", and, for a new number, a field to re-type its last 3 digits.
5. Submission, personal wallet. After the PIN is accepted the request carries an idempotency key. The total (amount plus fee) leaves Available at once as an in-transit ledger entry, the transaction is Initiated, then Pending when the provider accepts, and the status screen shows the reference ID, "Set aside, not sent" (Reserved, then In transit, conventions 10.5), the sub-label "Waiting for the provider" and "Usually under `PENDING_ETA_TEXT_MINUTES` minutes." The fee is fixed at this authorisation; Gereo bears any later provider change. Group wallet: a group-source payout is authorised only as GRP-13 AC1 says. The review, the pause and the PIN of this story are the single definition of those components; SPD-01 and SPD-05 reuse them by ID and do not redefine them. They run when the requester sends the request (SPD-01) and for each approver at approval (SPD-05); once the payout is authorised (SPD-10) it dispatches with no further screen, and its in-transit entry is posted at dispatch.
6. Business rule, undo. If `UNDO_WINDOW_SECONDS` is above 0 (10 for a personal wallet, 0 for group payouts), dispatch is delayed by that time and an "Undo" button with a countdown is shown; Undo ends the transaction as Cancelled with the money returned. Once dispatched, no Undo is ever shown.
7. Errors. A double tap creates one transaction. A network loss after the PIN shows "We are checking. Do not send again." with the reference, never "Failed". A provider rejection at dispatch is handled in WAL-11. Offline: the screen cannot be reached (WAL-09).
8. Notifications (matches EV-WAL-04). Initiation and acceptance notify in-app and by push only (`msg.wal.withdrawal_pending.push`, `msg.wal.withdrawal_pending.inapp`; "Sent 50 000 Ar to 034 xx xxx 12, Ref 7Q4K-82. Not you? Call support."). There is no SMS at this step: the one money-out SMS goes at the final outcome and follows WAL-11 and WAL-08 (direct at or above `ntf.money_out_sms_min_amount` or for a new payee, otherwise a fallback after an unread push).
9. Ledger and audit. Entry wallet to in-transit for amount and fee as separate lines. Audit entry `withdraw.authorised` with actor, device, amount, recipient, whether the pause was shown and accepted, PIN failures in the session, time. The PIN is never logged.
10. Accessibility and language. The PIN keypad has targets of at least 56 dp and announces digit count, not digits. The review text reflows at 200 percent font scale, and the button label always names the amount.

**Data:** Transaction (write), Ledger entry (write), Saved recipient (write on success), Audit entry (write), Device (read).
**Depends on:** WAL-09, ACC-03, ACC-04, ACC-05, GRP-13, SPD-01, SPD-05, SPD-10, RUL-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a biometric never replaces the PIN on money-out (ACC-03 decided it). Closed: for group wallets the requester enters their PIN when sending the request and each approver when approving; nobody is asked again at payout. Closed: `UNDO_WINDOW_SECONDS` is 10 for personal-wallet payouts and 0 for group payouts (parameter table). Closed: the screen says "Name not available" because the recipient's registered name is not looked up. Still TBD as configuration: `LARGE_AMOUNT_PAUSE`, set with OPS-11 and the fraud flags of OPS-10.

---

### WAL-11 Follow a withdrawal to its end: confirmed, failed with refund, or needs attention

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, System
**Permission needed:** none
**Tags:** ledger, audit, sms

**Story:** When I have sent money out, I want to see honestly where it is and, if it fails, to get my money back with a clear message, so I never wonder where it went.

**Conversation:** "Successful" shown before the recipient has the money (Kuda reviews) and "debited but not delivered" with no trace (Orange Max it reviews, PiggyVest) are the failure patterns to avoid (08 competitor UX 6.3). Failed must say explicitly whether money left the account (07 UI/UX 2.3 R-T3). Pending must say what happens next (R-T2). A reversal at the operator is costly and slow (MVola 5 percent, minimum Ar 10,000, 7-day window; 03 mobile money 7.1 item 5), so Gereo promises no recall. Refunds and idempotency follow WAL-07.

**Preconditions:** A withdrawal was authorised (WAL-10) or queued (WAL-08).
**Trigger:** A provider callback, a poll answer, a person's cancel, or a timeout.

**Acceptance criteria:**
1. Confirmed. After an authentic, matched callback the in-transit entry moves to the external provider account in one atomic posting. Status Confirmed, receipt available (WAL-14), push `msg.wal.withdrawal_confirmed.push` ("Sent 50 000 Ar to Rado. Ref 7Q4K-82.") and the one money-out SMS `msg.wal.withdrawal_confirmed.sms` of this payout (direct at or above `ntf.money_out_sms_min_amount` or for a new payee, otherwise a fallback after an unread push; passes the XCT-12 lint; not sent again if WAL-08 already sent the SMS for a queued outcome and nothing changed). The fee is its own line.
2. Business rule. "Sent" or "Successful" is never shown before the provider confirms. Until then the text is the Pending text of WAL-10 AC5 and a timeline Initiated, Pending, Confirmed.
3. Failed. When the provider says it failed, the status is Failed and one atomic reversing entry returns the full total (amount plus fee) from in-transit to the wallet. The screen says "We could not send 50 000 Ar. Your money is back in Savings. Ref [ID]" with "Try again" and "Report this payment". Push `msg.wal.withdrawal_failed.push` and the one money-out SMS `msg.wal.withdrawal_failed.sms` for this outcome, under the same direct or fallback rule as AC1.
4. Business rule, unclear. If a failure leaves it unclear whether the provider paid, the transaction is Needs attention, the money stays under "On its way out", OPS is alerted (after `NEEDS_ATTENTION_ESCALATE_HOURS` the case is escalated to a second operator, OPS-13), and the person sees "We are checking with the mobile money operator. Your money is set aside. Ref [ID]". It is never refunded automatically without a provider final answer or an operator decision, so Gereo never pays twice.
5. Idempotency. A duplicate callback never posts twice. A reversal can exist once per transaction, enforced by a uniqueness rule on the original entry.
6. Timeout. Polling follows WAL-07 AC6 with the same parameters. If it stays unknown the status is Needs attention.
7. Cancelled. A cancel during the undo window or while queued (WAL-08) ends as Cancelled with the amount and fee returned by a reversing entry; no fee is kept.
8. Mistaken payment. The receipt shows "Sent to the wrong person? Gereo cannot take back money that was already sent. Contact the recipient or your operator" and the "Report this payment" action (WAL-14).
9. Ledger and audit. Every state change is an audit entry with the provider reference and the actor (System, or the operator who decided a Needs attention case). The raw provider event is stored as in WAL-07. For a group wallet the entries keep the requester and every approver, or the vote and its voters (decision D4).

**Data:** Transaction (write status), Ledger entry (write), Notification (write), Audit entry (write), Raw provider event (write).
**Depends on:** WAL-07, WAL-08, WAL-10, SPD-10, SPD-11, OPS-05, OPS-13. WAL-14 shows the receipt of its result.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the provider fee comes back to the wallet with the amount on any failed payment (AC3); whether Gereo recovers that fee from the provider is a finance matter that does not change what the person sees. Closed: a case may stay Needs attention `NEEDS_ATTENTION_ESCALATE_HOURS` (24 h proposed) before escalation. Closed: Gereo promises no recall (AC8) and the person is pointed to the recipient and to their operator.

---

### WAL-12 Move money between my own wallets

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; for wallets of one group, Wallet: initiate spend on the source and Wallet: deposit on the destination, authorised as in GRP-13 AC1
**Tags:** ledger, audit

**Story:** As a wallet owner, I want to move money between two wallets I own, instantly and at no cost, so that I can budget by moving money to where it is needed.

**Conversation:** Free, instant ledger transfers between wallets are part of the MVP scope (competitive analysis section 7; 02 personal finance, Takeaways item 1). Monzo shows pot moves as paired entries in the feed but users say each pot also needs its own full history (08 competitor UX 6.3, Adopt). Transfers inside a group are outflows for GRP-13, so one person alone cannot complete them (GRP-13, closed: yes). Under decision D3 a manual move is a credit into the destination and therefore income for it (conventions 10.1), so the destination's rules run (CON-14, RUL-07); it is still not spending for a cap on the source (RUL-09 AC2), because the money stays with the same owner. Server-authoritative ledger: the phone never writes money (07 UI/UX 4 R-O4).

**Preconditions:** The person owns, or for a group holds the permissions on, at least two open wallets of the same owner. The source has Available above zero.
**Trigger:** The person taps "Move money".

**Acceptance criteria:**
1. Happy path. The screen asks for From wallet, To wallet (only open wallets of the same owner, not the source) and amount. It shows the fee line as read from configuration (`FEE_TABLE_GEREO`; "Fee: 0 Ar" only because the configured value for a move inside Gereo is 0) and "balance after" for both wallets. The button reads "Move 20 000 Ar to Savings".
2. Business rule. The move is one balanced pair of ledger entries posted atomically, with no provider. It is Confirmed at once with a reference ID. No PIN is asked for a move between wallets of one personal owner, because the money stays with the same person and any later rule action was authorised when its rule was saved.
3. Business rule, validation. Amount at least 1 Ar, whole number, at most Available minus reserved amounts; the move out of a campaign wallet is blocked for the reserved part. Source and destination must differ and be open. Errors are inline ("You have 30 000 Ar available").
4. Business rule, group wallets. A person-initiated move between wallets of one group is an expense request (class a, conventions 10.4) and counts in neither spent nor promised for caps; a firing of a saved rule is class b and is never an expense request. The request needs Wallet: initiate spend on the source and is created through SPD-01, authorised as GRP-13 AC1 says (decisions D1 and D4). While it waits it has the SPD status Awaiting approval or Awaiting vote (shown as "Waiting for approval, 1 of 2"), Available is unchanged and the amount is shown as reserved. When authorisation completes and the checks of SPD-10 pass, the move posts, settles instantly (SPD-10 criterion 10) and is Confirmed at once. A source under Wallet freeze (SPD-15, applied by a holder of Wallet: freeze) blocks the move.
5. Business rule, income and effects (decision D3). A manual move is income for the destination: it is a Confirmed credit into the destination (conventions 10.1). A move into a wallet with rules fires them (RUL-07), chains included. Entries made by rules carry the rule name and hop number; cycle detection and `RULE_CHAIN_DEPTH_MAX` (RUL-06) apply, and a rule skipped for a cycle or for depth never rolls back the move. The rounding amount of a split goes to Gereo and shows on the receipt (decision D5). The move never counts as spending for a cap on the source (RUL-09 AC2) and counts toward the destination's goal progress.
6. History. The move appears in both wallets as paired entries "Transfer out" and "Transfer in" linked by one reference ID, each wallet with its own full history, followed by any Split and Rounding lines the destination's rules made from it.
7. Errors. If the balance changed so that the move is no longer possible, nothing is posted and the message says "Not moved. Your balance changed. Check and try again". A double tap creates one move (idempotency key). Offline: the button is disabled with `xct.offline.money_blocked`.
8. Notifications. Personal wallets: none (on-screen confirmation). Group wallets: in-app item `wal.notice.group_transfer` to members with Wallet: view history, batched by NTF.
9. Ledger and audit. Audit entry `transfer.internal` with actor, both wallets, amount, reference, and for group wallets the approvers or the vote and its voters.
10. Entry point and edge cases. This story is an entry point that calls the same posting path as WAL-07; RUL-07 runs the rules. (a) Group outflow: a move from a group wallet to a wallet outside the group, or a payment to Gereo such as an SMS allowance top-up (posted as ledger class "Platform: SMS allowance", conventions 10.3), is a person-initiated outflow (class a) and needs the request and the approvals or vote of AC4, including the Gereo destinations of SPD-01. (b) A split that pays a group wallet: when a saved rule's share lands in a group wallet, it is a class b firing authorised when the rule version was saved (conventions 10.4), needs no request, is income for that wallet (conventions 10.1) and fires that wallet's own rules within `RULE_CHAIN_DEPTH_MAX`.

**Data:** Ledger entry (write), Transaction (write), Approval and Vote (read, group), Audit entry (write).
**Depends on:** WAL-03, WAL-07, GRP-12, GRP-13, SPD-01, SPD-05, SPD-10, SPD-15, RUL-06, RUL-07 (RUL-07 only for the rule run).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no PIN for a move between a person's own wallets, whatever the amount; the protection is that the money does not change owner (AC2). Closed: a move between a person's own wallets is not money-out for tier limits, because no provider is involved (default confirmed).

---

### WAL-13 Send money to another person or group inside Gereo

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** none for own wallets as the source; Wallet: initiate spend on a group source; Wallet: deposit on a group destination
**Tags:** ledger, audit, sms

**Story:** As a person with money in Gereo, I want to send some of it to another Gereo user or to a group wallet I belong to, free and instantly, so that I do not pay mobile money fees for money that stays inside Gereo.

**Conversation:** A wallet belongs to one entity but allows transfers; the brief asks for free ledger entries between owners and a rule for who may initiate. Decision: only the owner side of the source may initiate (push only); there is no pull and no "request money" in the MVP, so nobody can take money out of someone else's wallet. Money that leaves one owner for another is a scam target, so it gets the PIN and the first-recipient pause of WAL-10 (07 UI/UX 2.8 R-S3, R-S4). Gereo does not reverse such transfers on its own; mistakes go to support (WAL-14, WAL-18). Phone numbers are masked in group-visible ledgers (R-S4).

**Preconditions:** The source wallet is open with Available above zero. The recipient is a Gereo user (by phone number) or a group wallet in which the sender holds Wallet: deposit.
**Trigger:** The person taps "Send to a person or group" on a wallet.

**Acceptance criteria:**
1. Happy path. The person picks the destination: a Gereo user by phone number (the app shows the registered display name and a partly masked number) or a group wallet from the person's groups. A user destination lands in the recipient's receiving wallet. A review screen shows recipient, from wallet, amount, the fee line as read from configuration (`FEE_TABLE_GEREO`; "Fee: 0 Ar" only because the configured value for a transfer inside Gereo is 0), balance after, and the button "Send 20 000 Ar to Rasoa".
2. Business rule, who may initiate. Only the owner side of the source wallet can initiate, with the permission above. The recipient can never pull money, and there is no money request in the MVP.
3. Business rule, PIN and pause. The PIN is asked, on a screen repeating amount and recipient. A first-time recipient, a new device or an amount at or above `LARGE_AMOUNT_PAUSE` triggers the pause "Did someone ask you to send this money?" (WAL-10 AC4).
4. Business rule, limits. A transfer to another owner is money-out (ACC-07) and counts against the sender's money-out limits read from OPS-11 (`TRANSFER_COUNTS_AS_MONEY_OUT`, default true); a limit hit shows the ladder message of ACC-07 and no money moves. Receiving needs Tier 1 and the recipient's receive limits from OPS-11: a transfer that would take the recipient above them is refused with `err.wal.recipient_cannot_receive`, which does not say why.
5. Business rule, group source. A transfer out of a group wallet to anyone outside the group is an outflow: a person with Wallet: initiate spend creates a request (SPD-01, including its Gereo destinations), authorised as GRP-13 AC1 says (decisions D1 and D4), and settled instantly once authorised (SPD-10 criterion 10). The PIN and the pause of AC3 apply when the request is created. A payment to Gereo (Pay Gereo, SMS allowance top-up) is such a person-initiated outflow, posted as ledger class "Platform: SMS allowance" (conventions 10.3).
6. Posting. This story is an entry point that calls the same posting path as WAL-07. The transfer is one balanced, atomic posting with a reference ID, Confirmed at once, visible in both histories (the recipient sees "Received from [display name]"). It is income for the recipient wallet (decision D3, conventions 10.1), so its rules run (RUL-07), chains included, within the limits of RUL-06. The rounding amount of any split goes to Gereo and shows on the receipt (decision D5).
7. Business rule, irreversible. Gereo does not reverse the transfer on its own. The receiver may send money back as a new transfer; a mistaken transfer goes through "Report this payment" and operator correction (WAL-18).
8. Errors. A number that is not a Gereo user shows "[number] does not have Gereo yet" with an invite action (GRP-03) and no money moves. A recipient who cannot receive (no receiving wallet, wallet closed) shows `err.wal.recipient_cannot_receive`. Offline: disabled.
9. Notifications. Recipient: push `msg.wal.transfer_received.push` ("Rasoa sent you 20 000 Ar. Ref 7Q4K-82.") and SMS if the app is not opened (NTF-05). Sender: one SMS `msg.wal.transfer_sent.sms` at the outcome because money left their ownership, direct at or above `ntf.money_out_sms_min_amount` or for a new payee, otherwise a fallback after an unread push; it is suppressed for a campaign-tagged transfer. All SMS texts pass the XCT-12 lint.
10. Ledger and audit, privacy. Audit entry `transfer.external_owner` with both parties, amount, device, pause outcome. Group-visible ledgers show the sender's display name and never the phone number.

**Data:** Ledger entry (write), Transaction (write), Wallet (read, `receives_transfers` flag), User (read), Audit entry (write), Notification (write).
**Depends on:** WAL-04, WAL-07, WAL-10, WAL-12, ACC-07, GRP-03, GRP-13, SPD-01, RUL-06, RUL-07 (RUL-07 only for the rule run), NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the receiving wallet is the first wallet created, changeable in WAL-04 (one wallet at a time). Closed: a user cannot block incoming transfers in the MVP, because a block list is a feature of its own and the sender is always named; a person who receives something unwanted reports it through WAL-14. Closed: owner-to-owner transfers count as money-out for the sender's limits (`TRANSFER_COUNTS_AS_MONEY_OUT`, default true). Closed: receiving needs no identity beyond Tier 1, within the recipient's receive limits from OPS-11 (AC4).

---

### WAL-14 Read one transaction and its receipt, and report a problem

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** Wallet: view history (own wallets: none)
**Tags:** ledger, audit, offline

**Story:** When I want to know what happened to a payment, I want one page with its status, fee, reference and the ledger entries behind it, and a way to report a problem, so I can prove it or get help.

**Conversation:** Every money movement shows a status, a reference ID and a way to get help (design foundations section 3 principle 1; 07 UI/UX 2.3 R-T4, 2.6 R-E3). A receipt carries amount, fee, date, time and transaction ID (CGAP principle 14; GOV.UK confirmation pages). "Report this payment" attaches the provider reference in one tap (08 competitor UX 6.3, Avoid). A "why" line from the rule engine is an open opportunity nobody documents (08 competitor UX 6.3, Open). Screenshots leak numbers, so the shared receipt hides the counterparty number by default (07 UI/UX 2.8 R-S4).

**Preconditions:** The transaction belongs to a wallet the person may see.
**Trigger:** The person taps a row in a history list or a link in a notification.

**Acceptance criteria:**
1. Happy path. The page shows: status chip (icon, word, colour), amount with direction words ("Received +50 000 Ar" or "Sent -50 000 Ar"), fee, total, date and time, type, wallet, counterparty (full name; number masked for anyone other than the sender), initiated by, approved by (group: the approvers from SPD-05, or "Group vote" with a link to the vote and the number of voters, VOT-03), the reference ID in groups of 3 or 4 characters with a copy button, the provider reference, and a timeline with each status change and its time.
2. Ledger block. Each entry behind the transaction is a plain sentence ("From Savings to Rado: 50 000 Ar"). Fee and tax lines are their own entries. An "Accounting view" toggle shows debit and credit columns.
3. Rule line. An entry made by a rule shows "Why: 40% to Savings by rule Split salary" with a link to the rule (RUL-12). When rules chained, the line shows each hop in order ("Split salary, then Keep 10% for school"). A deleted rule still shows its name followed by "(deleted)". An income shows "Rules on this income" with each outcome (Moved, Alert sent, Skipped and the reason). A Rounding line (`ledger.rounding_line`) is its own row and shows "Rounding to Gereo: 1 Ar" with the words "Whole-ariary leftover of a split, in the terms you accepted" (decision D5). In the app it is one aggregated row per original income, with per-hop lines in the export only, and no row when the amount is 0.
4. State explanations. Pending says what Gereo waits for and what to do ("Nothing. We will SMS you."). Failed says whether money moved. Needs attention gives the reference and the support route. A reversed entry shows the chip "Reversed" and links both ways to its reversal (WAL-18).
5. Report. "Report this payment" is always visible. It opens a form pre-filled with reference, amount, date, status, wallet and provider reference, with a choice (Not received, Wrong recipient, Taken twice, Other) and optional text. Submitting creates a support ticket (OPS) and shows its number and status. It never promises a refund. Offline, the report is an auto-send item of the XCT-05 registry (Table A, "Report this payment"): it is kept as "Waiting to send" with a visible state and sent when the app is open with signal.
6. Receipt and share. A Confirmed transaction has a receipt (reference, amount, fee, date, wallet name at the time, status, provider) shareable as a PDF or text through the phone's share sheet. Other statuses show a "Summary" labelled "Not a proof of payment". The counterparty number is hidden in the shared file unless the sender chooses to include it.
7. Repeat. A past withdrawal or transfer out offers "Repeat this payment", which opens WAL-09 or WAL-13 filled in. The PIN is asked again.
8. Offline and loading. The page and the receipt open from cache with "Updated hh:mm"; a loading skeleton appears when not cached. A missing permission shows the permission by name.
9. Audit. Opening is not audited. Submitting a report is: `support.reported` with actor, reference, category, time.
10. Accessibility and language. The reference is announced in groups and the copy button announces "Copied". Direction is given by words and icon, not by red and green.

**Data:** Transaction, Ledger entry, Wallet rule (read), Support ticket (write), Audit entry (write).
**Depends on:** WAL-07, WAL-11, RUL-12, OPS-06, OPS-07, XCT-02, XCT-03, XCT-05. WAL-15 lists the rows that open this page.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the reference ID is 8 characters from an alphabet without 0, O, 1, I and L, shown in two groups of 4 ("7Q4K-82AX"), the last character a check character so a typing error is detected; it is speakable and collision-checked on creation (the examples in this file show it shortened). Closed: the shared receipt is a PDF and plain text in the MVP, not an image. Closed: the sender may include the recipient number in a shared file (AC6); the recipient never sees it by default.

---

### WAL-15 Browse and search my history with filters

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** Wallet: view history (own wallets: none)
**Tags:** ledger, offline

**Story:** When I need to find a payment or understand where my money went, I want to filter my history by wallet, type, date and who made it, and search it, so I can answer in seconds.

**Conversation:** A complete, filterable history with search is table stakes (02 personal finance, Takeaways item 3: filter by wallet, type, date, rule-generated versus manual). Open Collective filters by type, period, amount and status (08 competitor UX 6.3). Use rows, not tables, on phones (07 UI/UX 2.3 R-T5; NN/g mobile tables). Never show "No records" while loading (NN/g empty states). The controlled chip list comes from conventions 10.7 (Contribution, Penalty, Income, Split, Rounding, Expense, Transfer, Fee, Share-out, Reversal, Cash-out); this story adopts it, and adds a separate Where filter for the provider channel. A mobile money deposit carries the chip Income; money sent from a wallet to mobile money carries the chip Cash-out. Expense is reserved for group spending, so spending caps and "Where the money goes" (CON-16) never count a person's own cash-out as spending. Deposit and Withdrawal stay as quick filter groupings only.

**Preconditions:** The person can see at least one wallet.
**Trigger:** The person opens "See all" on a wallet, or "History" for all wallets.

**Acceptance criteria:**
1. Happy path. Rows are grouped by day with a date header. A row shows counterparty or purpose, amount (right-aligned, equal-width digits), status chip and time. `HISTORY_PAGE_SIZE` rows load at a time with "Load more". Order is by posting time, newest first.
2. Filters. A filter sheet offers: Wallet (when the view spans wallets), Type (Contribution, Penalty, Income, Split, Rounding, Expense, Transfer, Fee, Share-out, Reversal, Cash-out, and the ledger type Platform: SMS allowance), quick groupings Deposit (Income with Where = Mobile money in) and Withdrawal (Cash-out), Where as its own filter (Mobile money in, Mobile money out, Inside Gereo), Date (Today, 7 days, This month, Custom range), Source (All, Made by a rule, Made by a person) and Status (All, Confirmed, Pending, Failed, Cancelled, Needs attention). Active filters show as removable chips with a "Clear all". Filters combine with AND.
3. Business rule, source. "Made by a rule" shows entries that carry a rule name, Split and Rounding lines included; "Made by a person" shows the others. Rule entries show the rule name in the row. A Rounding entry (from the wallet to the Gereo income account) is shown as its own row, aggregated per original income. Test: a deposit into a wallet with rules shows the chip Income, Where = Mobile money in, and a Rounding row that agree with each other and with the receipt.
4. Search. A box matches reference ID (prefix, ignoring case and dashes), counterparty name, note and an exact amount typed in digits. It starts at 2 characters, ignores accents and case, waits `SEARCH_DEBOUNCE_MS` after the last character, highlights the match and works inside the active filters.
5. Totals. For the filtered result the header shows "Money in X Ar, money out Y Ar", computed on the server over the whole result, not only the loaded rows.
6. States. Empty new wallet: the empty state of WAL-01. No match: "No entries match. Clear filters". Loading: skeleton rows, never "No records". A failed refresh keeps the list and offers Retry.
7. Permission. Without Wallet: view history on a group wallet the person sees `wal.history.not_permitted` naming it. Phone numbers are masked in group-visible lists.
8. Offline. Filters and search run on the cached recent entries and the header says "Showing saved items from [date]. Connect to see older ones." Totals say they cover saved items only.
9. Accessibility and language. Filter controls are at least 48 dp. The result count is announced after filtering ("12 results"). Status and direction are never by colour alone.

**Data:** Ledger entry (read), Transaction (read), Wallet rule (read, name).
**Depends on:** WAL-03, WAL-14, XCT-02, XCT-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the controlled list of chips is the one of conventions 10.7 (with Income, Rounding and Cash-out), and the provider channel is the separate Where filter. Closed: no amount-range filter in the MVP; exact-amount search covers the need. Closed: search ignores accents and case, so Malagasy and French spellings match.

---

### WAL-16 Export a wallet's history as CSV or PDF

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: export history for a group wallet
**Tags:** ledger, audit

**Story:** When I need my records for a meeting, an accountant or myself, I want to download a wallet's history as a spreadsheet or a PDF statement, so I can keep my own books and never depend on Gereo to hold them.

**Conversation:** Ship export on day one and never put it behind payment (competitive analysis section 7, design rules). Kippa's shutdown left about 500,000 merchants without records (competitive analysis section 3.2). Export is also a trust signal (02 personal finance, Risks, "Data loss / company failure"). Formats match ACC-14: integer MGA, ISO dates with the Madagascar offset, labels in the person's language with stable technical names in a second header row. The group-meeting version of the same export, with headline numbers and status counts, is CON-18; this story is the engine both use.

**Preconditions:** The wallet has entries and the person holds the permission.
**Trigger:** The person taps "Export" on a wallet or on the history.

**Acceptance criteria:**
1. Happy path. The person chooses format (CSV or PDF), period (This month, Last month, Custom), wallet (one, or all those they may export) and whether to apply the current filters. A confirmation shows the number of entries before generating, and the PIN is asked before the download (ACC-14 criterion 2), because the file leaves the app.
2. CSV. UTF-8 with a byte-order mark so accents open correctly in common spreadsheet apps (test: a file with accented names opens intact in each spreadsheet app on the test list). The separator is a comma, with a choice "Semicolon (for French-language spreadsheets)" in the form. Columns: reference, date and time (ISO 8601 with +03:00), wallet, type, where (the channel, its own column), status, direction, amount (integer MGA), fee, total, counterparty, rule_name, rule_version, hop, caused_by_entry_id, note, balance after. A group wallet export adds the group columns defined in CON-18. Labels are in the person's language; stable technical names are in a second header row. Amounts are plain integers with no grouping.
3. PDF. A statement with owner, wallet, period, generation time and the code MGA; opening balance, closing balance, money in and money out; the entries as list rows; page numbers and a generation reference ID. Opening plus in minus out equals closing, to the ariary, and the closing balance equals the ledger at period end. Text is real text, not images.
4. Business rule, content. Totals count only posted entries. Pending, Failed and Cancelled items are listed in a section "Not counted". Reversed entries appear with their reversal, and Rounding lines and Fee lines appear as their own separate rows (Rounding per hop in the export, unlike the aggregated row in the app). Notes marked private and attachments are never included.
5. Size. Up to `EXPORT_SYNC_MAX_ROWS` the file is built at once. Above it, the screen says "We are preparing your file", and push `msg.wal.export_ready.push` arrives when done. A private download link lasts `EXPORT_LINK_TTL`. A finished file is saved on the phone and opens offline.
6. Business rule, group wallet. Phone numbers are masked as in the ledger; names of initiator and approvers are included. The person needs Wallet: export history; a person without it sees the missing permission by name.
7. Errors and offline. A failed build gives no partial file and `err.wal.export_failed` with "Try again". Offline, "Export" is disabled with `xct.offline.needs_connection` (XCT-06); files already downloaded stay readable (XCT-04). An empty period creates no file and says "Nothing to export for this period".
8. No paywall. Export is free and has no cooldown for wallet history in the MVP.
9. Audit. Entry `export.created`, written once when the file is built and never again on a retry or a re-download, with actor, wallet, period, filters, format, row count, time.

**Data:** Ledger entry (read), Transaction (read), Audit entry (write), Notification (write), Export file (write).
**Depends on:** WAL-15, ACC-14, XCT-02, XCT-04, XCT-06. CON-18 builds its meeting export on this story.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: yes, the download of any export needs the PIN (ACC-14 criterion 2). Closed: comma separator by default with a semicolon option, because French-language spreadsheet settings expect a semicolon. Open, needs field research: whether the accounting profession in Madagascar needs a standard format or chart of accounts. Default used: the plain CSV and PDF of this story.

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
This story is the wallet slice of XCT-04. Anything not listed below is defined by XCT-04 and not restated here.

1. Happy path, what is cached. After each successful sync the phone keeps, for the wallets the person may see: the wallet list, the balance, the goal, the rule definitions, the last `CACHE_RECENT_TRANSACTIONS` history entries per wallet (reference, status chip, amount, fee, date and time, type, counterparty as shown online, rule name) and the receipts for those cached entries.
2. Business rule, per XCT-04. The indicator, the wording without a connection, freshness (`STALE_BALANCE_HOURS` and the "May be outdated" flag), storage, unlock, erase, the never-cached list, the freeze state, the number of ledger days and group data are all per XCT-04.
3. Business rule, actions. Add money, send out, move money, send to a person, close, edit and export are disabled with a one-line reason (`xct.offline.money_blocked` for money-out, `xct.offline.needs_connection` for the others). Nothing that moves money is queued on the phone.
4. Business rule, Report this payment. A pending "Report this payment" shows on the receipt as "Waiting to send" with its state visible (WAL-14, XCT-05).
5. Sync. When the connection returns, the app updates by itself. For balances the cache is replaced by the server value, never merged.
6. Accessibility and language. The hidden-balance setting (WAL-19) is respected in cached views. Times are in Madagascar time, strings in the person's language.

**Data:** Wallet, Ledger entry, Transaction, Wallet rule (cached read), Device.
**Depends on:** WAL-02, WAL-03, WAL-15, ACC-03, ACC-11, ACC-12, XCT-04, XCT-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the cache depth is `CACHE_RECENT_TRANSACTIONS`, owned by XCT-04. Closed: no "remind me by SMS when I am online" option in the MVP; the buttons explain what to do and nothing money-related is queued (XCT-06). Closed: a shared phone is handled by sign-out: the cache is readable only after the unlock of the signed-in person and is erased on sign-out (per XCT-04), so each person signs in with their own account.

---

### WAL-18 Correct a mistake with a reversing entry, never an edit

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator, System
**Permission needed:** none for members, who only read the result. Operator permissions, from the separate operator catalogue (OPS-01): `handle tickets` or `resolve discrepancy` may propose a correction; only `approve ledger correction`, held by a different person, may approve it (OPS-05, OPS-06)
**Tags:** ledger, audit

**Story:** As a Gereo operator, I want to correct a mistake by adding a reversing entry with a reason, so that the history stays complete and the people who see it can trust it.

**Conversation:** The ledger is append-only and a correction is a reversing entry (conventions section 2). People can see an entry reversed with its reason, never silently changed (07 UI/UX 8.1 R-G5). Open Collective keeps immutable entries and adds correcting ones (08 competitor UX 6.3, Adopt). System reversals (a failed withdrawal returns the money) need no operator and are described in WAL-08 and WAL-11. The operator workflow (queue, proposal, second approver, expiry) is owned by OPS-05; this story fixes what the ledger accepts and what the person sees. Gereo cannot recall money that already left for the provider; recall happens with the provider and Gereo records only what it holds.

**Preconditions:** An entry exists. For an operator action, there is a support ticket (OPS) with a reason.
**Trigger:** A system failure path (WAL-08, WAL-11), or an operator posts a reversal or correction from a ticket.

**Acceptance criteria:**
1. Business rule, invariants. No actor, screen or API can edit or delete a ledger entry. A correction is a new entry linked to the original with a reason code and a note, balanced like any posting, and it carries the `project_id` of the original entry. This story owns these invariants and the person's view; the correction workflow is OPS-05's.
2. System reversals. A failed or cancelled withdrawal (WAL-08, WAL-10, WAL-11) posts its reversing entry automatically with the reason `withdrawal_failed` or `withdrawal_cancelled`. No operator is needed.
3. Operator flow. From a ticket or a discrepancy alert the operator picks an entry and chooses Reverse in full or Correct (new adjusting entries). A reason code, a note and the ticket or alert number are required. The proposer, holding `handle tickets` or `resolve discrepancy`, can never approve the correction; only a different person holding `approve ledger correction` may approve it (OPS-05). Above `CORRECTION_APPROVAL_THRESHOLD` a third approver, different from the proposer and the first approver, must also approve.
4. Preview. Before posting, the operator sees the exact entries to be written and the resulting balance of each wallet. The button reads "Post reversal of 50 000 Ar". A reversal that would take a wallet below zero is blocked with the reason and the alternatives: reverse the entries derived from it first (AC7), or correct a smaller amount up to Available. A shortfall that remains is posted as a Gereo loss line, the debit side of the correction, never as a debt claim on the person in the MVP.
5. One reversal per entry. An entry can be reversed in full once. Partial corrections can add up to at most the original amount. Both are enforced by the ledger.
6. Person's view. The original row shows the chip "Reversed" and links to the reversal; the reversal row reads "Reversal of Ref 7Q4K-82" with a reason in plain words (key `wal.reversal.reason.<code>`). The balance arithmetic is visible. Operators appear as "Gereo support", not by name.
7. Rules. A reversal or correction is never income (no rule fires on it) and never counts as spending for a cap. A reversed income does not undo by itself what rules already moved from it: the preview lists every entry derived from it (shares moved to other wallets, and the Rounding line credited to Gereo, decisions D3 and D5), and the operator may select them for reversal in the same proposal, each as its own linked reversing entry. All are selected by default.
8. Notifications. The owner gets push `msg.wal.balance_corrected.push` and SMS `msg.wal.balance_corrected.sms` (the keys of OPS-05; the SMS passes the XCT-12 lint) ("A correction of 50 000 Ar was made on Savings. Ref 7Q4K-82. See the app."). Group wallets: members with Wallet: view history see it in the feed and the digest.
9. Ledger and audit. Audit entry `ledger.reversal` with operator, approver, ticket, reason, balances before and after, time, visible to authorised operators and, in words, to the people concerned.

**Data:** Ledger entry (write), Transaction (read), Support ticket (read), Audit entry (write), Notification (write).
**Depends on:** WAL-11, WAL-14, OPS-05, OPS-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a reversal that would make a balance negative is blocked, with the alternatives of AC4 (reverse the derived entries first, or correct up to Available, with any shortfall booked as a Gereo loss). Closed: a reversed income offers its derived entries for reversal in the same proposal (AC7), never automatically. Closed: above `CORRECTION_APPROVAL_THRESHOLD` a third person approves; the evidence required is the ticket or alert, the reason code and the preview (OPS to confirm, OPS-05 open question).

---

### WAL-19 Hide my balance, and see when a wallet is low or empty

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Individual, Member
**Permission needed:** Wallet: view balance for group wallets
**Tags:** offline, ledger

**Story:** When other people can see my screen, I want to hide my balances with one tap, and when a wallet is running low I want it to be obvious, so I keep my privacy and am never surprised by an empty wallet.

**Conversation:** CGAP principle 21: make the balance easy to see and easy to hide, because users want privacy from family and others (07 UI/UX 2.2 R-M10 [V]). The low-balance state exists only when the person asked for a threshold (RUL-11); Gereo does not guess, because a default threshold would be wrong for most wallets. The empty state follows 07 UI/UX 2.3 R-T7. Insufficient-balance handling in forms (WAL-09, WAL-12) reuses the same words.

**Preconditions:** The person has at least one wallet.
**Trigger:** The person taps the eye icon, or a wallet's Available falls below its threshold or to zero.

**Acceptance criteria:**
1. Happy path, hide. An eye icon with a visible label "Hide" or "Show" sits on the wallet list and the wallet detail. Tapping hides every balance-type figure (Available, safe to spend, goal amounts, the total) as "••••". The state is remembered per device across restarts. The default is visible.
2. Business rule. Hiding applies on every screen that shows a balance, including cached views and the home total, and for group balances too. Transaction amounts in history stay visible in the MVP (see Open questions). Notifications and SMS are unchanged.
3. Business rule, low state. When a wallet has an active low-balance rule (RUL-11) and Available is below its threshold, the card and the detail show the chip "Low balance" (icon and word), the line "Below 50 000 Ar" (example) and an "Add money" button. It clears when Available is back at or above the threshold. No threshold means no low state.
4. Business rule, empty. A wallet with activity and Available 0 shows the chip "Empty" and "Add money". A new wallet with no activity shows the onboarding empty state of WAL-01.
5. Business rule, pending. The low and empty states use Available only. Pending deposits appear as a note ("1 deposit on its way, not counted yet"), never added in.
6. Business rule, forms. Insufficient-balance messages in WAL-09 and WAL-12 show Available and, when another wallet of the person has enough, a link "Move money from [wallet]" that opens WAL-12 filled in.
7. Group wallets. Low and empty states are visible to members who can view the balance. Alerts about them go to the audience chosen in RUL-11 and NTF-04.
8. Accessibility and language. The toggle is at least 48 dp. A screen reader says "Balance hidden. Double tap to show". The chip uses icon and word.
9. No notification and no ledger entry. This story only changes display.

**Data:** Wallet (read), Ledger entry (read), Wallet rule (read, threshold), Device setting (write, local).
**Depends on:** WAL-02, WAL-03, RUL-11, NTF-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: history amounts stay visible in the MVP, because people search them by amount (WAL-15) and the hide setting exists to hide balances, as CGAP principle 21 asks. Closed: a lock-screen push keeps its amount, because the setting lives on one device and the server composes the message; a lock-screen setting belongs to NTF-04 as a later option.

---

### WAL-20 See that my ledger matches the provider, as a status line

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Member, System
**Permission needed:** Wallet: view balance
**Tags:** ledger, audit

**Story:** When I look at a wallet, I want a short line that tells me when the ledger was last checked against the provider's records and whether it matched, so I know the numbers are real.

**Conversation:** A daily reconciliation with the provider and alerts on gaps are required (competitive analysis section 6 item 6). Nothing found documents a reconciliation visible to users (08 competitor UX 6.4, Open opportunities; design foundations section 1 item 4). The risk is alarm, so wording is factual and the next step clear. This story is the wallet-level line; CON-17 is the same line on the group ledger, and both read results owned by OPS, using the same component and the same wording to be harmonised.

**Preconditions:** The reconciliation job has produced at least one result (OPS).
**Trigger:** The person opens a wallet.

**Acceptance criteria:**
1. Business rule, job. This story reads the result of the job that OPS-04 owns. Every day at `RECON_RUN_TIME` the system compares each provider transaction of the day with the ledger by reference and amount, and the total of client-fund ledger accounts with the provider-held balance where the provider exposes it (default: it does not, see Open questions). The result is stored with start, end, counts and outcome. A Rounding line (`ledger.rounding_line`) has no provider transaction: it is its own ledger row, aggregated per original income in the app, and is covered by the internal ledger check, not matched by provider reference.
2. Happy path. The wallet detail shows one line with three possible states, each with icon and word: "Matched, checked 19 Oct 02:00", "Checking...", or "Difference under review since 19 Oct 02:00". Time is absolute, in Madagascar time.
3. Explanation. A tap opens a short note in plain words: what is compared, how often, and "Your balance comes from the Gereo ledger and is not changed by this check". It lists the number of the person's own items still waiting to be matched. It shows no amount of any difference to people without operator rights. This story owns the reconciliation line component, which CON-17 reuses with the same wording: the amount of a difference is visible to operators only, and the tolerance is 0 (`RECON_TOLERANCE_AR`, OPS-04).
4. Difference. The person's unmatched items show Needs attention (WAL-14). The line says "Difference under review" only when an item of this wallet, or of another wallet of its group, is unmatched; a difference in the global balance check with no item of this wallet appears in the explanation of AC3 as "Overall check: under review" and leaves this line on "Matched" for its own items. OPS is alerted. Nothing is corrected automatically; a fix is a reversing entry (WAL-18). The line returns to Matched when OPS closes the case, with an audit entry.
5. Missed run. If there is no successful run within `RECON_MAX_AGE`, the line says "Not checked since 17 Oct 02:00" with a warning chip, and OPS is alerted. Provider unreachable: "Provider balance not available now", showing the last good result, never an invented number.
6. Offline. The cached line shows "Last known: Matched, checked 19 Oct 02:00" and keeps the reconciliation time distinct from the last-synced time (CON-17 AC7).
7. Group wallet. Every member who can view the balance sees the same line.
8. Notifications. None by default. If one of the person's items is involved, push `msg.wal.needs_attention.push` ("We are checking a payment. Ref 7Q4K-82. You do not need to do anything.").
9. Audit. Every run, with its outcome and any operator action, is stored for `RECORD_RETENTION_YEARS`.

**Data:** Reconciliation result (read, owned by OPS), Transaction (read), Audit entry (write).
**Depends on:** WAL-07, WAL-11, OPS-04, OPS-05. CON-17 shows the same line on the group ledger and reads the same result.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the line is per wallet for items and global for the balance check (AC4 rule above). Closed: no tolerance; `RECON_TOLERANCE_AR` is 0 because amounts are whole ariary (OPS-04). Closed: only the item-level comparison by reference and amount runs, and the line never shows a provider balance.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| WAL-01 | Create a wallet | P0 | ACC-02, ACC-03, GRP-15 |
| WAL-02 | See all my wallets and what each one holds | P0 | WAL-01, GRP-06 |
| WAL-03 | Open a wallet and see its true balance, goal and what is safe to spend | P0 | WAL-01, WAL-02 |
| WAL-04 | Rename and edit a wallet | P1 | WAL-01, RUL-10, RUL-13 |
| WAL-05 | Close a wallet | P1 | WAL-03, WAL-09, WAL-12, SPD-01, SPD-10, SPD-15, VOT-03, PRJ-03, RUL-08, RUL-12 |
| WAL-06 | Add money from mobile money: amount, fee preview and start | P0 | WAL-01, ACC-03, ACC-07, OPS-08, OPS-11 |
| WAL-07 | Settle a deposit exactly once: provider callback, idempotency and timeouts | P0 | WAL-06, OPS-04, OPS-05, OPS-13, NTF-05, NTF-08 |
| WAL-08 | When the provider is not available, say so and keep the money safe | P1 | WAL-06, WAL-10, OPS-08, OPS-13, NTF-05 |
| WAL-09 | Send money out: choose amount and recipient, with limits and fee preview | P0 | WAL-03, ACC-07, OPS-11, GRP-12, GRP-13, SPD-01, SPD-09, SPD-10, SPD-15 |
| WAL-10 | Review, confirm with my PIN, and pause for a new recipient | P0 | WAL-09, ACC-03, ACC-04, ACC-05, GRP-13, SPD-01, SPD-05, SPD-10, RUL-09 |
| WAL-11 | Follow a withdrawal to its end: confirmed, failed with refund, or needs attention | P0 | WAL-07, WAL-08, WAL-10, SPD-10, SPD-11, OPS-05, OPS-13 |
| WAL-12 | Move money between my own wallets | P0 | WAL-03, WAL-07, GRP-12, GRP-13, SPD-01, SPD-05, SPD-10, SPD-15, RUL-06, RUL-07 (rule run only) |
| WAL-13 | Send money to another person or group inside Gereo | P1 | WAL-04, WAL-07, WAL-10, WAL-12, ACC-07, GRP-03, GRP-13, SPD-01, RUL-06, RUL-07 (rule run only), NTF-05 |
| WAL-14 | Read one transaction and its receipt, and report a problem | P0 | WAL-07, WAL-11, RUL-12, OPS-06, OPS-07, XCT-02, XCT-03, XCT-05 |
| WAL-15 | Browse and search my history with filters | P0 | WAL-03, WAL-14, XCT-02, XCT-03 |
| WAL-16 | Export a wallet's history as CSV or PDF | P1 | WAL-15, ACC-14, XCT-02, XCT-04, XCT-06 |
| WAL-17 | Read my balances and recent history without a connection (wallet slice of XCT-04) | P0 | WAL-02, WAL-03, WAL-15, ACC-03, ACC-11, ACC-12, XCT-04, XCT-06 |
| WAL-18 | Correct a mistake with a reversing entry, never an edit | P1 | WAL-11, WAL-14, OPS-05, OPS-06, NTF-05 |
| WAL-19 | Hide my balance, and see when a wallet is low or empty | P2 | WAL-02, WAL-03, RUL-11, NTF-04 |
| WAL-20 | See that my ledger matches the provider, as a status line | P1 | WAL-07, WAL-11, OPS-04, OPS-05 |

Totals: 20 stories. P0: 12 (WAL-01, 02, 03, 06, 07, 09, 10, 11, 12, 14, 15, 17). P1: 7 (WAL-04, 05, 08, 13, 16, 18, 20). P2: 1 (WAL-19).

Dependency direction. A story lists only what must exist before it. Where two stories form one flow, the later one depends on the earlier one: WAL-09 then WAL-10, WAL-06 then WAL-07 and WAL-08, WAL-10 then WAL-11, WAL-14 then WAL-15, WAL-15 then WAL-16. Build order for money posted into a wallet: RUL-07, then WAL-12, then WAL-13, all entry points on the posting path of WAL-07. CON-17 and CON-18 build on WAL-20 and WAL-16 and are not listed here.

## Cross-epic dependencies

- **ACC.** ACC-02 and ACC-03 (sign-in and PIN, PIN required on every money-out, PIN lock), ACC-04 (PIN reset), ACC-05 (new device and cooling period), ACC-07 (tier ladder and the "limit hit" message, used by WAL-06, WAL-09, WAL-13), ACC-11 and ACC-12 (cache erased on device removal and sign-out), ACC-13 (terms that disclose the rounding amount to Gereo), ACC-14 (personal data export, shares format rules and the PIN with WAL-16).
- **GRP.** GRP-06 (group home lists the group wallets), GRP-12 (spending policy), GRP-13 (no single person moves group money alone: applies to WAL-09, WAL-12, WAL-13), GRP-15 (create another wallet inside the group, shares WAL-01), GRP-03 (invite a person who has no Gereo yet), GRP-09 (permission checks).
- **CON.** CON-04 and CON-05 (contribution payments use the deposit machinery of WAL-06 and WAL-07), CON-11 to CON-15 (group split rules run on the engine RUL-07, with the Rounding line to Gereo), CON-16 (group ledger view built on WAL-15, controlled type list), CON-17 (reconciliation line, same component as WAL-20), CON-18 (meeting export built on WAL-16).
- **SPD.** SPD-01 (the request that WAL-09, WAL-12 and WAL-13 create for a group wallet), SPD-05 (approval, with the approver's PIN screen of WAL-10), SPD-09 (vote linked to an expense), SPD-10 (payout execution, in-transit posting and reservation), SPD-11 (payout failure), SPD-12 (cancel), SPD-14 (spending cap on a group wallet), SPD-15 (freeze), SPD-16 (expense entries).
- **VOT.** VOT-03 (a passed vote starts the payout of an expense, decision D4) and the recovery vote of GRP-14.
- **PRJ.** PRJ-03 (a wallet linked to an open project cannot be closed, WAL-05; project spending debits the linked wallet through SPD).
- **EVT, ANN.** No direct dependency.
- **NTF.** NTF-05 (push then SMS), NTF-08 (batching of group entries into the feed and digest), NTF-07 and XCT-12 (GSM-7 and length lint for SMS templates), NTF-04 (preferences); delivery for every key named here (`msg.wal.*` with its variants, in-app `wal.notice.*`).
- **XCT.** XCT-02 (amounts), XCT-03 (dates and time zone), XCT-04 (offline read, of which WAL-17 is the wallet slice), XCT-05 (device queue; "Report this payment" is in its auto-send registry), XCT-06 (money-out blocked offline, `xct.offline.money_blocked`), XCT-07 (data saver), XCT-08 to XCT-10 (accessibility), XCT-14 (strings as keys).
- **OPS.** OPS-04 (daily reconciliation job and its tolerance, read by WAL-20), OPS-05 (discrepancy and correction workflow behind WAL-18), OPS-06 and OPS-07 (tickets for "Report this payment" and their status), OPS-08 (provider unavailable banner), OPS-11 (tier limits and fee tables), OPS-13 (payout queue, retries and pause).
- **RUL.** RUL-06 (cycle detection and chain depth), RUL-07 (the engine reads every income posting from WAL-07, WAL-12 and WAL-13), RUL-09 (spending cap seen on the review sheet, WAL-10), RUL-10 and RUL-13 (goal shared with WAL-04), RUL-11 (threshold drives the low state, WAL-19), RUL-12 (rule history linked from the "why" line, WAL-14).

## Open questions

Closed questions say Closed with the decision; the full reasoning is in the Open questions line of the story named.

1. Closed: there is no legal gate on holding client funds; the stories are built and tested against a sandbox before real money is held (decision D7).
2. **Labels.** Closed: the types are called "Goal" and "Long term", behind the same message keys (WAL-01).
3. Closed: the provider is not named and the adapter assumes nothing about its API, sandbox, callback signing, retry policy, status endpoint, amount encoding (ariary or minor unit), recipient name lookup, recall and reversal rules, settlement timing, client-funds balance and settlement report, fees or the meaning of the 100 000 000 Ar ceiling. The defaults are written in WAL-06, WAL-07, WAL-08, WAL-10, WAL-11 and WAL-20.
4. **Limits and fees.** Partly closed. Closed: the deposit fee is added on top of the amount (WAL-06). Open as configuration: the values of tier limits (OPS-11), deposit and payout limits, and the 20 000 000 Ar operator wallet cap, which WAL-09 AC2 enforces per operator. Closed: the 0.5 percent mobile money tax line (`TAX_LINE`) exists and is off.
5. **Safe to spend.** Closed: the definition of WAL-03 ships as written; field interviews may tune it later.
6. **Income classification.** Closed: by decision D3 every deposit into a wallet is income for that wallet, whatever its source, so rules chain (CON-14 criterion 4).
7. **Transfers between owners.** Closed (WAL-13): first wallet receives by default, no blocking in the MVP, transfers count as money-out for the sender, receiving needs only Tier 1 within the recipient's tier limit.
8. **PIN rules.** Closed (WAL-10, WAL-12): no PIN for a move between a person's own wallets; no biometric on money-out; for group wallets the requester and each approver enter their PIN once, nobody at payout.
9. **Late and unclear provider results.** Closed (WAL-07, WAL-11): a Failed deposit never becomes Confirmed by itself; Needs attention is escalated after `NEEDS_ATTENTION_ESCALATE_HOURS`; a person who sent money to the wrong number is told Gereo cannot take it back and is helped to contact the recipient and the operator.
10. **Negative balances.** Closed (WAL-18): a reversal that would go below zero is blocked, with alternatives; no debt claim on the person in the MVP.
11. **Permissions for wallet administration.** Closed by decision D2: the member permission catalogue, bundles and money-out class are owned by GRP Shared definitions. Wallet: create creates and renames a group wallet, Wallet: edit rules changes its goal, Wallet: freeze applies a freeze, Wallet: close closes it (WAL-01, WAL-04, WAL-05). Operator permissions are in OPS-01.
12. **Vocabulary.** Closed: the controlled list of chips is the one of conventions 10.7 (with Income, Rounding and Cash-out), and the provider channel is the separate Where filter (WAL-15).
13. **Reconciliation scope.** Closed: the status line is read from OPS-04 and shows the same result per group wallet, with the amount of a difference visible to operators only (CON-17 criterion 2). Whether a client-funds balance is exposed is part of open question 3.
14. **Retention and shutdown.** Open, see ACC open question 1. The retention period (default 5 years, `RECORD_RETENTION_YEARS`) and a published data-retention and shutdown commitment (competitive analysis section 7). Default used: history stays exportable after a wallet is closed, and the terms (ACC-13) state the export right on shutdown.
15. **Accounting format.** Open, needs field research. Does the accounting profession in Madagascar need a standard export format or chart of accounts (WAL-16)? Default used: plain CSV and PDF.
