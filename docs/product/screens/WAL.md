# WAL: screen and state inventory

Source: `docs/product/stories/WAL.md` (20 stories). Surface IDs are `SCR-WAL-nn`. Kinds: page, sheet, modal, inline, notification, system. Container choice follows 09 section 10.3 (money-out review, pause and PIN are full screens, page trigger P5). Permission names follow conventions section 7. Decisions D1 to D7 and the R-rows in `05-decisions.md` apply over any story text.

Line formats used below:

- Surface lines: `SCR-WAL-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-WAL-nn [state]: trigger; sees; can do; key`.
- For a personal wallet the owner holds every wallet permission and needs none; the permission column below speaks of group wallets where one applies.
- Screens of other epics are cited as `SCR-ACC-nn` or `SCR-GRP-nn` where those inventories define them.

---

### WAL-01 Create a wallet

- Story: WAL-01 Create a wallet
- Surfaces:
  - SCR-WAL-01 | New wallet form (Owner, Name, Type, optional Goal with amount and date; Currency "Ariary (Ar)" fixed) | page | Individual at Tier 1 (personal wallet); holder of Wallet: create (group wallet) | "New wallet" on the wallet list or the empty home | "Create wallet" opens SCR-WAL-07 (wallet detail); back
  - SCR-WAL-02 | Group-wallet permission note `wal.create.group_permission_needed` | inline | member without Wallet: create | Owner picker in SCR-WAL-01 | none
  - SCR-WAL-03 | Group wallet created in-app item `wal.notice.group_wallet_created` | notification (in-app) | group members (batched, NTF-08) | group wallet created | none
  - SCR-WAL-04 | Creation request guard (idempotency key) | system | none | "Create wallet" | none
- States per surface:
  - SCR-WAL-01 [default]: Owner default "Me" plus each group where the person holds Wallet: create; four types with icon, word and one plain sentence (`wal.create.type.*`); goal optional (whole number of at least 1 Ar, target date in the future)
  - SCR-WAL-01 [name taken]: name not unique per owner (ignoring case and accents); sees `err.wal.name_taken` naming the field
  - SCR-WAL-01 [name too long or empty]: required, trimmed, at most `WALLET_NAME_MAX`; inline error
  - SCR-WAL-01 [limit reached]: at `WALLET_MAX_PER_OWNER` open personal wallets (or `grp.max_wallets_per_group` for a group); button disabled; `wal.create.limit_reached` says why
  - SCR-WAL-01 [goal invalid]: goal below 1 Ar or date not in the future; inline error
  - SCR-WAL-01 [saving]: button shows progress and is disabled; request carries an idempotency key
  - SCR-WAL-01 [failure]: sees `err.wal.create_failed`; typed values kept; "Try again"; nothing created
  - SCR-WAL-01 [offline]: form opens; "Create wallet" disabled with `xct.offline.needs_connection`; nothing queued
  - SCR-WAL-01 [error summary]: error summary at the top with focus moved to it; each message also by its field
  - SCR-WAL-02 [default]: group option offered only with Wallet: create; others see the note naming the permission
  - SCR-WAL-03 [in-app]: batched in-app item; no push or SMS
  - SCR-WAL-04 [double tap]: a double tap creates one wallet
- Criteria map:
  - AC 1: SCR-WAL-01 [default] (fields, four types, fixed currency, landing on wallet detail at 0 Ar with the empty state)
  - AC 2: SCR-WAL-01 [name taken], [name too long or empty], [limit reached]
  - AC 3: SCR-WAL-01 [goal invalid], [default] (goal amount, date; same goal as RUL-10)
  - AC 4: no UI, system rule (no identity check beyond Tier 1; type changes no money rule)
  - AC 5: SCR-WAL-02 [default]; system rule (group wallet inherits access and the GRP-12 policy; GRP-13 from day one; creator gets no extra access; no PIN)
  - AC 6: SCR-WAL-01 [saving], [failure], [offline]; SCR-WAL-04 [double tap]
  - AC 7: no UI, system rule (ledger account opened at zero, no money entry; audit `wallet.created`)
  - AC 8: SCR-WAL-03 [in-app]
  - AC 9: SCR-WAL-01 [default], [error summary] (radio group with words, error summary focus, Malagasy, French, English characters)
- Objects and fields: Wallet (owner, name, type, goal amount, goal date, currency, status Open); Ledger account; Audit entry (`wallet.created`); User; Group; Membership.
- Open points:
  1. The story says types appear as "Goal" and "Long term" in place of "Savings" and "Investment"; what are the visible labels of the other two types (budget, business) and the exact keys `wal.create.type.*`? Not specified in the story.
  2. Name uniqueness: criterion 2 says unique per owner ignoring case and accents, but GRP-15 criterion 6 allows a duplicate wallet name inside a group with a soft warning. Which applies to a group wallet?
  3. GRP-01 creates the first wallet through the group form; does it use `err.wal.name_taken` and the same type labels? Not specified in either story.
  4. Is the Owner picker hidden when the person belongs to no group and holds no Wallet: create anywhere? The story implies only "Me" is shown; not specified.

---

### WAL-02 See all my wallets and what each one holds

- Story: WAL-02 See all my wallets and what each one holds
- Surfaces:
  - SCR-WAL-05 | Wallet list (header "All my wallets", section "My wallets", one section per group, "Show closed (n)") | page | Individual, Member | home, wallet tab | tap a card opens SCR-WAL-07; "Create my first wallet" opens SCR-WAL-01
  - SCR-WAL-06 | Wallet card (name, type icon and word, Available balance or "Group balance", goal `7 500 / 10 000 Ar` with bar, status chips) | inline | owner (own wallets); members (group wallets) | SCR-WAL-05 | opens SCR-WAL-07
- States per surface:
  - SCR-WAL-05 [default]: sections and cards; closed wallets hidden behind "Show closed (n)"; order inside a section by last activity then name
  - SCR-WAL-05 [total]: top line "All my wallets" = sum of Available across the person's own open wallets; excludes group wallets, closed wallets and money on its way in
  - SCR-WAL-05 [total hidden]: balance-hiding on (WAL-19); total hidden
  - SCR-WAL-05 [empty]: no wallets; one sentence and "Create my first wallet"; no empty chart
  - SCR-WAL-05 [loading]: skeleton cards; never "No wallets" while loading
  - SCR-WAL-05 [refresh failed with cache]: cached list stays with "Could not update. Retry"
  - SCR-WAL-05 [refresh failed no cache]: error panel with Retry
  - SCR-WAL-05 [offline]: renders from cache with "Updated hh:mm"
  - SCR-WAL-06 [chips]: chips when relevant: Wallet frozen, Held by Gereo, Rules paused, Low balance, Empty, Needs attention, Closed (icon and word)
  - SCR-WAL-06 [group]: label "Group balance"; "Your share" line only where CON provides it under its own label
  - SCR-WAL-06 [balance not permitted]: person lacks Wallet: view balance; card shows the name and `wal.list.balance_not_permitted`, no number
  - SCR-WAL-06 [stale]: cached balance older than `STALE_BALANCE_HOURS`; "May be outdated" (XCT-04, WAL-17)
  - SCR-WAL-06 [screen reader]: card reads as one sentence; amounts do not clip at 200 percent; targets at least 48 dp
- Criteria map:
  - AC 1: SCR-WAL-05 [default]; SCR-WAL-06 [chips]
  - AC 2: SCR-WAL-05 [total]
  - AC 3: SCR-WAL-06 [group], [balance not permitted]
  - AC 4: SCR-WAL-05 [default]
  - AC 5: SCR-WAL-05 [empty], [loading], [refresh failed with cache], [refresh failed no cache]
  - AC 6: SCR-WAL-05 [offline]; SCR-WAL-06 [stale]
  - AC 7: SCR-WAL-06 [screen reader]
  - AC 8: no UI, system rule (no notification, no ledger entry; reading is not audited)
- Objects and fields: Wallet (name, type, goal, status chips, owner); Ledger entry (balance sum); Wallet rule (count and state); Membership.
- Open points:
  1. Criterion 1 lists chips but not "Goal reached", which WAL-03 shows on the detail. Is "Goal reached" also a card chip? Not specified in the story.
  2. The chip "Closed" is listed in criterion 1 but closed wallets are hidden by default (criterion 4); the chip shows only after "Show closed"? Not specified.
  3. Where is the hide/show eye icon placed relative to the "All my wallets" line (WAL-19)? WAL-19 says it sits on the wallet list; position not specified.
  4. A group wallet visible only through Group: view group: GRP-06 shows a "missing permission note" naming who to ask; this card shows `wal.list.balance_not_permitted`; do they show the same names? Not specified.

---

### WAL-03 Open a wallet and see its true balance, goal and what is safe to spend

- Story: WAL-03 Open a wallet and see its true balance, goal and what is safe to spend
- Surfaces:
  - SCR-WAL-07 | Wallet detail (header with name, type, owner, Available; "On its way out", "On its way in"; goal block; "Safe to spend"; actions; rules line "2 rules on, 1 paused"; reconciliation line; last N entries with "See all") | page | owner; member with Wallet: view balance (balance block) and Wallet: view history (recent activity) | wallet card, notification deep link | "Add money" opens SCR-WAL-19; "Send out" opens SCR-WAL-32; "Move money" opens SCR-WAL-42; "Edit" opens SCR-WAL-11; "Close wallet" opens SCR-WAL-15; "See all" opens SCR-WAL-54; rules line opens RUL-01
  - SCR-WAL-08 | "How is this calculated?" lines of Safe to spend | sheet | viewers of the balance block | link under Safe to spend | close
  - SCR-WAL-09 | Action buttons "Add money", "Send out", "Move money" | inline | owner or holder of the matching permission | SCR-WAL-07 | open their screens
  - SCR-WAL-10 | Wallet freeze banner `spd.freeze.banner` (SPD-15) | inline | members of the group | wallet under Wallet freeze | none
- States per surface:
  - SCR-WAL-07 [default]: Available from the ledger; "On its way out: X Ar" and "On its way in: X Ar, not counted yet" each only above zero
  - SCR-WAL-07 [live update]: connected and open; a new entry updates figures within 5 seconds
  - SCR-WAL-07 [goal]: `7 500 / 10 000 Ar`, bar, percent, amount left, target date; counted amount is Available
  - SCR-WAL-07 [goal reached]: Available at or above the goal; chip "Goal reached"
  - SCR-WAL-07 [no goal]: "Set a goal" link opens WAL-04
  - SCR-WAL-07 [safe to spend]: budget and business wallets show "Safe to spend: X Ar" = lower of (Available minus reserved minus campaign reserves) and cap left; never below 0 ("Nothing safe to spend now"); savings and investment wallets show goal progress instead
  - SCR-WAL-07 [group wallet]: two labelled figures "Group balance" and, where CON provides it, "Your share"
  - SCR-WAL-07 [loading]: skeleton; never "0 Ar" while loading
  - SCR-WAL-07 [new wallet]: empty state of WAL-01 (one sentence, primary "Add money")
  - SCR-WAL-07 [closed]: banner "Closed on [date]"; no action buttons
  - SCR-WAL-07 [offline]: from cache with "Updated hh:mm"
  - SCR-WAL-07 [refresh failed]: last known figure with "Not updated since [time]. Retry"; money buttons say the balance is re-checked on send
  - SCR-WAL-07 [permission variants]: balance block needs Wallet: view balance; recent activity needs Wallet: view history; a missing permission is named
  - SCR-WAL-08 [default]: lines of the calculation
  - SCR-WAL-09 [permission missing]: shown disabled with the missing permission named (`err.wal.permission_missing`)
  - SCR-WAL-09 [frozen]: "Send out" and "Move money" disabled with the freeze reason; "Add money" stays enabled
  - SCR-WAL-10 [shown]: banner for a wallet under Wallet freeze
- Criteria map:
  - AC 1: SCR-WAL-07 [default]
  - AC 2: SCR-WAL-07 [default], [live update] (Available is the sum of posted entries, computed on the server)
  - AC 3: SCR-WAL-07 [goal], [goal reached], [no goal]
  - AC 4: SCR-WAL-07 [safe to spend]; SCR-WAL-08 [default]
  - AC 5: SCR-WAL-07 [group wallet]
  - AC 6: SCR-WAL-09 [permission missing]; SCR-WAL-07 [default] (rules line, reconciliation line, last N entries)
  - AC 7: SCR-WAL-07 [loading], [closed], [new wallet], [offline]; SCR-WAL-10 [shown]; SCR-WAL-09 [frozen]
  - AC 8: SCR-WAL-07 [refresh failed]
  - AC 9: SCR-WAL-07 [default] (equal-width digits, no wrap, bar text alternative, not colour alone)
- Objects and fields: Wallet (name, type, owner, goal, status); Ledger entry (posted sum, reserved amounts); Transaction (in and out pending amounts); Wallet rule (count and state, cap).
- Open points:
  1. Criterion 6 shows actions disabled with the permission named, while 09 section 10.4 rule 5 says never disable for permission (hide, or show enabled with a reason). Which applies? Not specified in the story.
  2. What does "N" in "last N entries" equal on the detail page? Not specified in the story (the cache holds `CACHE_RECENT_TRANSACTIONS`).
  3. "Campaign reserves" in the Safe to spend formula come from ANN; the "How is this calculated?" line wording for them is not specified.
  4. A person with Wallet: view history but not Wallet: view balance: does the detail show "On its way in" pending deposits? Open question says "everyone who holds Wallet: view balance"; behaviour for others not specified.

---

### WAL-04 Rename and edit a wallet

- Story: WAL-04 Rename and edit a wallet
- Surfaces:
  - SCR-WAL-11 | Edit wallet (name, type label, goal amount and date or remove, "Receives transfers from other people" for a personal wallet) | page | owner; holder of Wallet: create (rename, retype) and Wallet: edit rules (goal) on a group wallet | "Edit" on wallet detail | "Save" returns to SCR-WAL-07 with `wal.edit.saved`
  - SCR-WAL-12 | Concurrency review ("Changed by [name] at hh:mm. Review", both versions of the field) | inline | the editor | save collides with another edit | choose a version
  - SCR-WAL-13 | Wallet changed in-app item `wal.notice.wallet_changed` | notification (in-app) | members with Wallet: view balance (batched, NTF-08) | group wallet edited | none
  - SCR-WAL-14 | Goal removal agreement (note that goal rule alerts stop) | modal | editor | removing a goal | agree or cancel
- States per surface:
  - SCR-WAL-11 [default]: editable fields; "Save" applies at once; confirmation `wal.edit.saved`
  - SCR-WAL-11 [name rules]: required, length, unique per owner as in WAL-01
  - SCR-WAL-11 [goal lowered]: goal below current Available; chip "Goal reached"
  - SCR-WAL-11 [read-only group]: group wallet without the permission; fields read-only with the permission named; members with Wallet: view balance see the new name and goal at once
  - SCR-WAL-11 [receives transfers]: personal wallet setting, on for exactly one wallet at a time
  - SCR-WAL-11 [saving]: progress
  - SCR-WAL-11 [failure]: typed values kept; says nothing changed
  - SCR-WAL-11 [offline]: "Save" disabled with `xct.offline.needs_connection`
  - SCR-WAL-11 [closed]: a closed wallet cannot be edited
  - SCR-WAL-11 [old entry name]: detail of an old entry shows "(was [old name])"; past receipts and exports keep the recorded name
  - SCR-WAL-12 [default]: edits to different fields merge; same field collision shows both versions; nothing silently overwritten
  - SCR-WAL-13 [in-app]: group wallet only; personal wallets get none
  - SCR-WAL-14 [default]: note that goal rule alerts stop (RUL-10); removes the goal rule after agreement
- Criteria map:
  - AC 1: SCR-WAL-11 [default], [receives transfers]
  - AC 2: SCR-WAL-11 [name rules]
  - AC 3: SCR-WAL-11 [goal lowered]; SCR-WAL-14 [default]
  - AC 4: SCR-WAL-11 [read-only group]
  - AC 5: SCR-WAL-11 [old entry name]
  - AC 6: SCR-WAL-12 [default]
  - AC 7: SCR-WAL-11 [saving], [failure], [offline], [closed]
  - AC 8: SCR-WAL-13 [in-app]
  - AC 9: no UI, system rule (no ledger entry; audit `wallet.edited` with before and after)
- Objects and fields: Wallet (name, type, goal, `receives_transfers`); Wallet rule (goal rule, written on removal); Audit entry (`wallet.edited`).
- Open points:
  1. The setting "Receives transfers" is on for exactly one wallet; how does the person turn it off, and which wallet receives when that wallet is closed (WAL-05)? Not specified in the story.
  2. Renaming and retyping a group wallet needs Wallet: create, but no group-wallet edit entry for a holder of Wallet: create only (no Wallet: edit rules) is described when they open the goal fields. Are the goal fields shown read-only? Implied by criterion 4; not explicit.
  3. Is a toast `wal.edit.saved` the only confirmation, given 09 section 10.3 says a toast is a result, not a place to learn something costly? Acceptable here (no money); recorded for completeness.

---

### WAL-05 Close a wallet

- Story: WAL-05 Close a wallet
- Surfaces:
  - SCR-WAL-15 | Close wallet checklist (each condition Done or Not done; button "Close wallet [name]") | page | owner; holder of Wallet: close (group wallet) | "Close wallet" on wallet detail | opens SCR-WAL-16 when all Done
  - SCR-WAL-16 | Closing confirmation sheet (restates what happens, history stays exportable) | sheet | owner; holder of Wallet: close | enabled closing button | final tap
  - SCR-WAL-17 | Wallet closed notice `msg.wal.group_wallet_closed.push` (EV-WAL-14) | notification | members with Wallet: view balance (group wallet only) | group wallet closed | opens SCR-WAL-07
  - SCR-WAL-18 | Closed wallet banner "Closed on [date]" (with the name of the person who closed a group wallet) | inline | owner; members | closed wallet detail | none
- States per surface:
  - SCR-WAL-15 [default]: conditions with icon and word (Done, Not done)
  - SCR-WAL-15 [balance not zero]: Available not exactly 0 Ar; "Move 12 500 Ar to another wallet or send it out first" with buttons to WAL-12 and WAL-09; Gereo never sweeps
  - SCR-WAL-15 [pending items]: any transaction in Initiated, Pending or Needs attention, queued withdrawal, authorised but unpaid spend, open expense request, open vote paying from it, open project holding it as budget wallet, Wallet freeze or Held by Gereo; each blocker listed with a link
  - SCR-WAL-15 [rules impact]: rules on this wallet stop with "Stopped: wallet closed"; rules in other wallets that send to it pause with `destination_closed`; owners told before confirming ("2 rules will be paused: [names]")
  - SCR-WAL-15 [ready]: all Done; closing button enabled
  - SCR-WAL-15 [offline]: disabled with `xct.offline.needs_connection`
  - SCR-WAL-16 [default]: restates what happens
  - SCR-WAL-16 [new pending item]: something came in while confirming; cancelled with "Not closed. Something just came in. Check and try again"; nothing changes
  - SCR-WAL-17 [push]: group wallet only; personal wallet none
  - SCR-WAL-18 [default]: wallet read-only; history, receipts and export remain; hidden from the default list
- Criteria map:
  - AC 1: SCR-WAL-15 [default], [ready]; SCR-WAL-16 [default]
  - AC 2: SCR-WAL-15 [balance not zero]
  - AC 3: SCR-WAL-15 [pending items]
  - AC 4: SCR-WAL-15 [rules impact]
  - AC 5: SCR-WAL-18 [default]; system rule (a deposit callback for a closed wallet goes to Needs attention for operators)
  - AC 6: SCR-WAL-18 [default] (name of the closer shown to members); one holder of Wallet: close is enough (system rule)
  - AC 7: SCR-WAL-16 [new pending item]; SCR-WAL-15 [offline]
  - AC 8: SCR-WAL-17 [push]
  - AC 9: no UI, system rule (ledger account marked closed, no money entry; audit `wallet.closed` with checklist result)
- Objects and fields: Wallet (status Open, Closed); Transaction (pending check); Wallet rule (status written); Audit entry (`wallet.closed`).
- Open points:
  1. Wallet: close is a money-out class permission (granting needs a PIN); does the person closing a personal or group wallet enter a PIN? Not specified in the story.
  2. What does the closing sheet say about the retention period (`RECORD_RETENTION_YEARS` open with ACC open question 1)? Default says "history stays exportable"; wording not specified.
  3. What happens to the "receives transfers" flag when the receiving wallet is closed? See WAL-04 open point 1.
  4. Reopening is not in the MVP; no screen. Confirmed closed.

---

### WAL-06 Add money from mobile money: amount, fee preview and start

- Story: WAL-06 Add money from mobile money: amount, fee preview and start
- Surfaces:
  - SCR-WAL-19 | Add money amount screen (numeric keypad, destination wallet, mobile money number, detected operator, live "You add X, fee Y, total you pay Z", "How is this calculated?") | page | owner; holder of Wallet: deposit (group wallet) | "Add money" on wallet detail | "Next" opens SCR-WAL-20
  - SCR-WAL-20 | Add money review ("to wallet, from number and operator, you add, fee, total you pay, provider name, next step"; button "Add 50 000 Ar") | page | same | SCR-WAL-19 | "Add ..." opens SCR-WAL-21; "Change" back
  - SCR-WAL-21 | Deposit status (timeline Initiated, Pending, Confirmed; reference ID; time elapsed; sub-label "Waiting for the operator") | page | same | review start, notification link | Cancel (Initiated only); done
  - SCR-WAL-22 | Fee breakdown sheet ("How is this calculated?": provider fee, Gereo fee, tax line) | sheet | same | link on SCR-WAL-19 | close
- States per surface:
  - SCR-WAL-19 [default]: live fee line updates while typing; "Fee: 0 Ar" when zero; wallet credited exactly "You add"; number accepts +261, leading 0, spaces, dashes and is shown back normalised
  - SCR-WAL-19 [unsupported prefix]: `err.wal.number_not_supported` before any request
  - SCR-WAL-19 [amount out of range]: below `DEPOSIT_MIN` or above `DEPOSIT_MAX_PER_TX`; inline error
  - SCR-WAL-19 [tier limit]: above the tier's single-deposit limit (OPS-11); flow stops before review with the ladder message of ACC-07 ("To add more than [limit], verify your ID"); typed values kept; no money moved
  - SCR-WAL-19 [offline]: button disabled with `xct.offline.money_blocked`
  - SCR-WAL-19 [live announcement]: fee line announced politely on change
  - SCR-WAL-20 [default]: one screen with everything; "Gereo never asks for your PIN" text; idempotency key generated on open
  - SCR-WAL-21 [initiated]: transaction created with reference ID; "Cancel" available while the provider has not accepted; ends Cancelled, no money moved
  - SCR-WAL-21 [pending]: provider accepted; timeline, copyable reference, time elapsed absolute and relative, "Waiting for the operator", "Usually under `PENDING_ETA_TEXT_MINUTES` minutes. You do not need to do anything. We will SMS you."; wallet not credited; amount only as "On its way in, not counted yet"; no Cancel; advice to ignore the phone prompt if the person changed their mind
  - SCR-WAL-21 [rejected]: provider rejects at creation; Failed at once with `err.wal.deposit_rejected` ("No money was taken. Check the number.") and edit-number button
  - SCR-WAL-21 [network dropped]: shown as Pending with "We are checking", never Failed without proof
  - SCR-WAL-21 [double tap or reload]: returns the same transaction; never a second prompt
  - SCR-WAL-21 [provider unavailable]: see SCR-WAL-27 (WAL-08)
  - SCR-WAL-22 [default]: lines from `FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE`
- Criteria map:
  - AC 1: SCR-WAL-19 [default]; SCR-WAL-22 [default]
  - AC 2: SCR-WAL-19 [default], [unsupported prefix]
  - AC 3: SCR-WAL-19 [amount out of range], [tier limit]
  - AC 4: SCR-WAL-20 [default]
  - AC 5: SCR-WAL-21 [initiated], [pending]
  - AC 6: SCR-WAL-20 [default]; SCR-WAL-21 [double tap or reload]
  - AC 7: SCR-WAL-21 [initiated], [pending]
  - AC 8: SCR-WAL-21 [rejected], [network dropped]; SCR-WAL-19 [offline]
  - AC 9: no UI, system rule (audit `deposit.initiated`; no ledger entry until WAL-07 on Confirmed, then income per D3)
  - AC 10: SCR-WAL-19 [live announcement]; SCR-WAL-21 [pending] (text in the person's language, elapsed time absolute and relative)
- Objects and fields: Transaction (reference ID, status, amount, fee lines, operator, number, idempotency key); Wallet; Payment adapter request; Audit entry (`deposit.initiated`).
- Open points:
  1. The review shows a "provider name", but conventions 10.4 say the provider name never appears in the UI and D7 names no provider. Does "provider name" mean the mobile money operator? Not specified in the story.
  2. Is a daily limit checked for deposits (WAL-09 shows "You can still send X today" for money-out only)? Not specified in the story.
  3. `PENDING_ETA_TEXT_MINUTES` is TBD; the pending text cannot be finalised until set.
  4. For a group wallet, does a deposit by a member show "Wallet: deposit" only, or also the group's split effects (CON-14) before review? Not specified in the story.
  5. Which key names the "Tell me when it works" alert is in WAL-08; here the provider-down state is only a pointer.

---

### WAL-07 Settle a deposit exactly once: provider callback, idempotency and timeouts

- Story: WAL-07 Settle a deposit exactly once: provider callback, idempotency and timeouts
- Surfaces:
  - SCR-WAL-23 | Provider callback processor (authenticity check, match by provider reference, amount and wallet; atomic posting; idempotency; terminal states; timeout poll) | system | none (System actor) | provider callback or `PENDING_TIMEOUT` | none
  - SCR-WAL-24 | Deposit result notices `msg.wal.deposit_confirmed.push` and `.sms`, `msg.wal.deposit_failed.push` and `.sms` | notification | depositor; for a group wallet, members with Wallet: view history see the feed entry and digest | state change | opens SCR-WAL-21 or SCR-WAL-50
  - SCR-WAL-25 | "Money posted to a wallet" event (emitted; RUL-07 consumes) | system | none | Confirmed credit | none
- States per surface:
  - SCR-WAL-23 [authentic]: passes the check required by the provider contract; processed
  - SCR-WAL-23 [not authentic]: rejected, stored for review, changes nothing; alert to OPS after repeated failures
  - SCR-WAL-23 [confirmed]: one atomic balanced posting (provider account to wallet for the amount; to fee and tax accounts for each fee line); status Confirmed; Available rises by exactly "You add"
  - SCR-WAL-23 [amount mismatch]: not credited; transaction goes to Needs attention
  - SCR-WAL-23 [duplicate]: same event or provider reference; changes nothing; acknowledged; the same callback three times gives one posting
  - SCR-WAL-23 [failed or cancelled]: status updated; no wallet entry; person sees a reason in plain words (`wal.deposit.failed.*`) and whether money moved, only when the provider says so
  - SCR-WAL-23 [unclear charge]: provider result leaves charge unclear; Needs attention
  - SCR-WAL-23 [late confirmed after terminal]: Confirmed callback after Failed or Cancelled, or unknown reference; stored, never credited automatically; Needs attention; sent to OPS
  - SCR-WAL-23 [timeout]: no answer by `PENDING_TIMEOUT`; polls every `STATUS_POLL_INTERVAL` up to `STATUS_POLL_MAX`; still unknown shows Needs attention with "We are checking with the mobile money operator. Reference [ID]. You do not need to do anything"; OPS alerted; never Failed without a provider answer
  - SCR-WAL-23 [polling disabled]: no status endpoint exists; polling disabled; transaction goes to Needs attention at `PENDING_TIMEOUT`
  - SCR-WAL-24 [confirmed push and sms]: "Added 50 000 Ar to Savings. Ref 7Q4K-82." (XCT-12 lint, 160 GSM-7 characters)
  - SCR-WAL-24 [failed]: push `msg.wal.deposit_failed.push`; SMS `msg.wal.deposit_failed.sms` only when money moved or the outcome is unclear
  - SCR-WAL-24 [group feed]: members with Wallet: view history see the entry in the feed and digest, not a push each
  - SCR-WAL-25 [emitted]: every Confirmed deposit is income for that wallet (D3), plain deposit or contribution; a rule failure never rolls back the credit
- Criteria map:
  - AC 1: SCR-WAL-23 [authentic], [not authentic]
  - AC 2: SCR-WAL-23 [confirmed], [amount mismatch]
  - AC 3: SCR-WAL-23 [duplicate]
  - AC 4: SCR-WAL-23 [failed or cancelled], [unclear charge]
  - AC 5: SCR-WAL-23 [late confirmed after terminal]
  - AC 6: SCR-WAL-23 [timeout], [polling disabled]
  - AC 7: SCR-WAL-24 [confirmed push and sms], [failed], [group feed]
  - AC 8: SCR-WAL-25 [emitted]
  - AC 9: no UI, system rule (every state change an audit entry with actor "System"; raw callback stored append-only for `RECORD_RETENTION_YEARS`; marked for reconciliation WAL-20)
- Objects and fields: Transaction (status, provider reference); Ledger entry (credit, fee, tax lines); Notification; Audit entry; Raw provider event (payload, time, outcome).
- Open points:
  1. Which message key tells a depositor that the Failed deposit was reversed or never charged when the provider answer is unclear (`wal.deposit.failed.*` has no listed variants)? Not specified in the story.
  2. `PENDING_TIMEOUT`, `STATUS_POLL_INTERVAL` and `STATUS_POLL_MAX` are TBD; the Needs attention timing cannot be shown yet.
  3. What does a depositor see after an operator resolves a Needs attention deposit (OPS-05)? Not specified in the story.
  4. Is a "Needs attention" deposit shown on the wallet detail's "On its way in" line? Not specified in the story.

---

### WAL-08 When the provider is not available, say so and keep the money safe

- Story: WAL-08 When the provider is not available, say so and keep the money safe
- Surfaces:
  - SCR-WAL-26 | Provider unavailable banner ("Payments are not available right now" or the operator name, time since start, what still works) | inline | Individual, Member on money screens | state on (adapter health, OPS-08 incident, OPS-13 pause) | none
  - SCR-WAL-27 | Deposit stop (`err.wal.provider_down_deposit`: "We cannot reach [operator] right now. No money was taken."; buttons "Try again", "Tell me when it works") | page | person starting a deposit | amount screen while the state is on | "Try again"; alert registered
  - SCR-WAL-28 | Queued withdrawal status (Pending, sub-label "Waiting for the provider", "We will send it as soon as it is back. Your money is set aside.", reference ID, "On its way out", Cancel) | inline | person who sent a withdrawal | withdrawal accepted while the state is on | cancel while not yet sent
  - SCR-WAL-29 | Queued notices `msg.wal.provider_queued.push` and `.sms` (and in-app) | notification | withdrawing person | withdrawal queued | opens SCR-WAL-50
  - SCR-WAL-30 | Provider-up alert registration (one alert, push, SMS if the app is not opened, with expiry) | system | person who tapped "Tell me when it works" | SCR-WAL-27 | none
  - SCR-WAL-31 | Payout queue processor (order of acceptance, re-check, same idempotency key, expiry at `PAYOUT_PROVIDER_WAIT_MAX`) | system | none | provider returns | none
- States per surface:
  - SCR-WAL-26 [shown]: may apply to one operator only; lists what still works (balances, history, moves between wallets)
  - SCR-WAL-26 [no connection]: the phone has no connection; copy says "No connection" and what still works, not "provider unavailable"
  - SCR-WAL-27 [default]: no deposit queued
  - SCR-WAL-27 [alert registered]: one alert with an expiry; fires when the state clears; no mass message at recovery
  - SCR-WAL-28 [queued]: amount reserved at acceptance; leaves Available at once; shown under "On its way out" with reference ID; fee fixed at authorisation; Gereo bears later provider change
  - SCR-WAL-28 [queued group payout]: authorised group payout behaves the same from the moment it is accepted
  - SCR-WAL-28 [cancel]: while queued and not yet sent; status Cancelled; reversing entry returns amount and fee; no fee kept
  - SCR-WAL-28 [sent]: once sent, no cancel offered
  - SCR-WAL-28 [expired]: after `PAYOUT_PROVIDER_WAIT_MAX`; Failed; reversing entry returns the money; sees the next action (try again, choose another number)
  - SCR-WAL-28 [two hours queued]: shows "Waiting for the provider", not Needs attention
  - SCR-WAL-29 [push and in-app]: `msg.wal.provider_queued.push` and in-app
  - SCR-WAL-29 [sms]: `msg.wal.provider_queued.sms` ("Your 50 000 Ar withdrawal is waiting. Your money is safe. Ref 7Q4K-82."); direct at or above `ntf.money_out_sms_min_amount` or for a new payee, otherwise fallback after an unread push
  - SCR-WAL-31 [processing]: sends in order of acceptance; each re-checked for limits and destination
  - SCR-WAL-31 [offline phone]: nothing queued from the phone; disabled action uses `xct.offline.money_blocked`
- Criteria map:
  - AC 1: SCR-WAL-26 [shown]
  - AC 2: SCR-WAL-27 [default], [alert registered]
  - AC 3: SCR-WAL-28 [queued], [queued group payout]
  - AC 4: SCR-WAL-31 [processing]
  - AC 5: SCR-WAL-28 [cancel], [sent]
  - AC 6: SCR-WAL-28 [expired], [two hours queued]
  - AC 7: SCR-WAL-29 [push and in-app], [sms]
  - AC 8: SCR-WAL-26 [no connection]; SCR-WAL-31 [offline phone]
  - AC 9: no UI, system rule (Reserved is derived; acceptance or dispatch posts wallet to in-transit; cancel or expiry posts the reversal or releases the reservation; audit with actor "System"; queue size and age visible to operators)
- Objects and fields: Transaction (status, sub-label, reference); Ledger entry (in-transit, reversal); Notification; Audit entry; Provider health state.
- Open points:
  1. The alert from "Tell me when it works" has an expiry whose value is not specified in the story.
  2. R187 says that when the provider is unavailable before acceptance there is no transaction and the request stays Approved with "Nothing was taken from the wallet", while criterion 3 says a withdrawal is accepted as Pending at once. What is the moment of acceptance and which wording applies?
  3. Criterion 3 reserves the amount at acceptance with no ledger entry, while WAL-10 criterion 5 posts an in-transit entry at PIN acceptance. See WAL-10 open point 1.
  4. Does the banner show the operator name or the generic text when several operators differ? Criterion 1 allows both; the selection rule is not specified.
  5. Is a withdrawal that is queued shown on the "On its way out" line of SCR-WAL-07 with the "Cancel" action reachable there? Not specified in the story.

---

### WAL-09 Send money out: choose amount and recipient, with limits and fee preview

- Story: WAL-09 Send money out: choose amount and recipient, with limits and fee preview
- Surfaces:
  - SCR-WAL-32 | Send out amount screen (from wallet with Available, "to" saved recipients or "New number", amount keypad with large echo, live "Fee X Ar, total Y Ar, balance after Z Ar") | page | owner; holder of Wallet: initiate spend (group wallet) | "Send out" on wallet detail | "Next" opens SCR-WAL-35; for a group wallet "Ask to send" creates a request (SPD-01)
  - SCR-WAL-33 | Group authorisation explanation ("Needs [N] approvals from people other than you: [names of holders of Wallet: approve spend]" or "The group votes. At least 2 voters other than you must vote") | inline | holder of Wallet: initiate spend on a group wallet | SCR-WAL-32 | none
  - SCR-WAL-34 | "For project" picker (own personal projects only) | sheet | owner | SCR-WAL-32 | pick or clear
- States per surface:
  - SCR-WAL-32 [default]: live fee, total, balance after; "Fee: 0 Ar" when free; fee follows destination operator
  - SCR-WAL-32 [amount above Available]: "You have 30 000 Ar available"; next disabled; no blame wording
  - SCR-WAL-32 [below minimum]: below `WITHDRAW_MIN`; next disabled
  - SCR-WAL-32 [above operator cap]: above `PAYOUT_MAX_PER_TX` for that operator ("The most you can send to [operator] in one payment is [limit]. Send in parts or choose another number"); no automatic splitting
  - SCR-WAL-32 [unsupported prefix]: `err.wal.number_not_supported`
  - SCR-WAL-32 [tier limit]: amount or the day's total passes the tier money-out limit (OPS-11); stops before review with the ACC-07 ladder message and a "Verify my identity" button; typed values kept; "You can still send [X] Ar today" when a daily limit exists
  - SCR-WAL-32 [freshness]: Available re-read on Next; changed figure shown first
  - SCR-WAL-32 [offline]: "Sending money needs a connection. Your balance is saved on this phone"; button disabled (`xct.offline.money_blocked`); nothing queued
  - SCR-WAL-32 [refresh failed]: keeps the screen; Retry; money has not moved
  - SCR-WAL-32 [group wallet]: button reads "Ask to send"; no money moves from this screen; frozen wallet says the request will wait; a destination inside Gereo follows SPD-01 and settles instantly
  - SCR-WAL-32 [accessibility]: amount errors inline, read by screen readers without moving focus; reflow at 200 percent
  - SCR-WAL-33 [below threshold]: approvals needed and who can approve
  - SCR-WAL-33 [vote]: at or above the vote threshold; vote explanation
  - SCR-WAL-34 [default]: lists only personal projects; choice stored as immutable `project_id` tag on the payout entry
- Criteria map:
  - AC 1: SCR-WAL-32 [default]
  - AC 2: SCR-WAL-32 [amount above Available], [below minimum], [above operator cap]
  - AC 3: SCR-WAL-32 [default], [unsupported prefix]
  - AC 4: SCR-WAL-32 [tier limit]
  - AC 5: SCR-WAL-32 [group wallet]; SCR-WAL-33 [below threshold], [vote]
  - AC 6: SCR-WAL-32 [freshness]
  - AC 7: SCR-WAL-32 [offline]
  - AC 8: SCR-WAL-32 [refresh failed], [unsupported prefix]
  - AC 9: SCR-WAL-32 [accessibility]
  - AC 10: SCR-WAL-34 [default]
- Objects and fields: Wallet (Available); Transaction (draft: amount, fee, total, recipient, operator); Saved recipient; Tier configuration; Expense request (group, via SPD-01); project_id tag.
- Open points:
  1. Criterion 4's button "Verify my identity" differs from ACC-07 criterion 4's `Verify now`. Which label is used?
  2. Criterion 10 lists only personal projects, but personal projects are P2 in PRJ-12 and cut first. Is the project picker hidden when none exist or not built? Not specified in the story.
  3. Does the "names of holders of Wallet: approve spend" list in SCR-WAL-33 respect GRP-12's rule that identities are not shown in the spending policy counts? WAL-09 shows names; GRP-12 shows anonymous counts. Which applies to a requester?
  4. The daily money-out total is read from OPS-11; the start of the day (Madagascar time) is not specified in the story.

---

### WAL-10 Review, confirm with my PIN, and pause for a new recipient

- Story: WAL-10 Review, confirm with my PIN, and pause for a new recipient
- Surfaces:
  - SCR-WAL-35 | Withdrawal review (to, from wallet, amount, fee, total taken, effect "Savings goes from 80 000 to 30 000 Ar", date and time, provider name; button "Send 50 000 Ar to Rado"; "Change" link) | page | owner; requester or approver on a group wallet (SPD-01, SPD-05 reuse it) | "Next" from SCR-WAL-32 | opens SCR-WAL-36 or SCR-WAL-37
  - SCR-WAL-36 | Pause screen ("Did someone ask you to send this money?", "Cancel" primary, "Yes, continue", "Gereo never asks for your PIN", last 3 digits field for a new number) | page | same | new payee, new device or amount at or above `LARGE_AMOUNT_PAUSE` | continue opens SCR-WAL-37
  - SCR-WAL-37 | PIN screen (repeats amount and recipient; "Gereo will never ask for your PIN or code by phone or message") | page | same | review or pause | PIN accepted opens SCR-WAL-38
  - SCR-WAL-38 | Withdrawal status (reference ID, "Set aside, not sent", "Waiting for the provider", "Usually under `PENDING_ETA_TEXT_MINUTES` minutes.", Undo with countdown) | page | owner | PIN accepted | follows WAL-11
  - SCR-WAL-39 | Withdrawal pending notices `msg.wal.withdrawal_pending.push` and `.inapp` (EV-WAL-04) | notification | sender | initiation or acceptance | opens SCR-WAL-50
- States per surface:
  - SCR-WAL-35 [default]: recipient name if the provider returns it, otherwise "Name not available", plus full number and operator
  - SCR-WAL-35 [large amount]: from `LARGE_AMOUNT_WORDS` the amount is repeated in words in the person's language
  - SCR-WAL-35 [personal cap]: payment would pass a personal spending cap; a line says so (warn only, RUL-09)
  - SCR-WAL-35 [group cap]: a block-mode cap on a group wallet stops a payout at request creation (SPD-14), not here
  - SCR-WAL-35 [offline]: screen cannot be reached (WAL-09)
  - SCR-WAL-36 [default]: before the PIN; for a new number, re-type last 3 digits
  - SCR-WAL-37 [default]: PIN asked every time, no "remember me"; biometric only if ACC-03 allows (PIN still required)
  - SCR-WAL-37 [wrong PIN]: shows attempts left; after `PIN_MAX_WRONG_ATTEMPTS` money-out locked for `PIN_LOCK_MINUTES` with a recovery way (ACC-04); `NEW_DEVICE_COOLING_HOURS` applies after a new device or reset
  - SCR-WAL-37 [keypad]: targets at least 56 dp; announces digit count
  - SCR-WAL-38 [initiated]: personal wallet; total (amount plus fee) leaves Available at once as an in-transit ledger entry; transaction Initiated; fee fixed at authorisation
  - SCR-WAL-38 [pending]: provider accepts; Pending with sub-label and "Set aside, not sent"
  - SCR-WAL-38 [undo window]: `UNDO_WINDOW_SECONDS` above 0 (10 for personal, 0 for group); dispatch delayed; "Undo" with countdown; Undo ends Cancelled with money returned; once dispatched no Undo
  - SCR-WAL-38 [network loss after PIN]: "We are checking. Do not send again." with reference; never Failed
  - SCR-WAL-38 [double tap]: one transaction
  - SCR-WAL-38 [group wallet]: authorised only as GRP-13 AC1 says; review, pause and PIN reused by SPD-01 and SPD-05; no further screen at payout
  - SCR-WAL-39 [push and in-app]: "Sent 50 000 Ar to 034 xx xxx 12, Ref 7Q4K-82. Not you? Call support."; no SMS at this step
- Criteria map:
  - AC 1: SCR-WAL-35 [default], [large amount], [personal cap], [group cap]
  - AC 2: SCR-WAL-37 [default]
  - AC 3: SCR-WAL-37 [wrong PIN]
  - AC 4: SCR-WAL-36 [default]
  - AC 5: SCR-WAL-38 [initiated], [pending], [group wallet]
  - AC 6: SCR-WAL-38 [undo window]
  - AC 7: SCR-WAL-38 [network loss after PIN], [double tap]; SCR-WAL-35 [offline]
  - AC 8: SCR-WAL-39 [push and in-app]
  - AC 9: no UI, system rule (ledger wallet to in-transit for amount and fee as separate lines; audit `withdraw.authorised` with pause outcome and PIN failures; PIN never logged)
  - AC 10: SCR-WAL-37 [keypad]; SCR-WAL-35 [default] (reflow at 200 percent; button names the amount)
- Objects and fields: Transaction (reference, status, amount, fee, total); Ledger entry (in-transit lines); Saved recipient (written on success); Audit entry (`withdraw.authorised`); Device.
- Open points:
  1. Criterion 5 posts an in-transit ledger entry at PIN acceptance for a personal wallet, while conventions 10.4 say Stage 1 Reserved has no ledger entry and Stage 2 In transit starts at dispatch, and WAL-08 criterion 9 posts at acceptance or dispatch. After the 10-second Undo window, when does the in-transit entry post?
  2. The review shows a "provider name" while conventions 10.4 and D7 say it never appears. What is shown there?
  3. `LARGE_AMOUNT_PAUSE` and `LARGE_AMOUNT_WORDS` are TBD.
  4. Is the pause shown to an approver in SPD-05 for a new payee? Criterion 5 says the approver uses the PIN screen; the pause for approvers is not specified.
  5. The Undo window delays dispatch for personal wallets; does the "Waiting for the provider" label appear during the undo countdown? Not specified in the story.

---

### WAL-11 Follow a withdrawal to its end: confirmed, failed with refund, or needs attention

- Story: WAL-11 Follow a withdrawal to its end: confirmed, failed with refund, or needs attention
- Surfaces:
  - Reuses SCR-WAL-38 (withdrawal status, defined under WAL-10; entry also by notification deep link; the outcome states below are added by this story)
  - SCR-WAL-40 | Withdrawal outcome notices `msg.wal.withdrawal_confirmed.push`, `.sms`, `msg.wal.withdrawal_failed.push`, `.sms` | notification | sender | provider outcome | opens SCR-WAL-50
  - SCR-WAL-41 | Withdrawal outcome processor (callback, poll, cancel, timeout, reversal uniqueness) | system | none | provider result | none
- States per surface:
  - SCR-WAL-38 [confirmed]: authentic matched callback; Confirmed; receipt available; fee its own line; "Sent" never shown before the provider confirms
  - SCR-WAL-38 [pending text]: until confirmed, the Pending text of WAL-10 and timeline Initiated, Pending, Confirmed
  - SCR-WAL-38 [failed]: provider failed; reversing entry returns the full total (amount plus fee); sees "We could not send 50 000 Ar. Your money is back in Savings. Ref [ID]" with "Try again" and "Report this payment"
  - SCR-WAL-38 [needs attention]: unclear whether the provider paid; money stays under "On its way out"; sees "We are checking with the mobile money operator. Your money is set aside. Ref [ID]"; OPS alerted; escalated after `NEEDS_ATTENTION_ESCALATE_HOURS`; never refunded without provider final answer or operator decision
  - SCR-WAL-38 [timeout]: polling per WAL-07 AC6 parameters; still unknown becomes Needs attention
  - SCR-WAL-38 [cancelled]: cancel during undo or while queued; Cancelled; reversing entry; no fee kept
  - SCR-WAL-38 [mistaken payment]: receipt shows "Sent to the wrong person? Gereo cannot take back money that was already sent. Contact the recipient or your operator" and "Report this payment"
  - SCR-WAL-40 [confirmed]: push "Sent 50 000 Ar to Rado. Ref 7Q4K-82." and the one money-out SMS (direct at or above `ntf.money_out_sms_min_amount` or new payee, otherwise fallback after unread push); not sent again if WAL-08 sent one and nothing changed
  - SCR-WAL-40 [failed]: push and the one SMS under the same rule
  - SCR-WAL-41 [duplicate callback]: never posts twice; one reversal per transaction enforced by uniqueness on the original entry
- Criteria map:
  - AC 1: SCR-WAL-38 [confirmed]; SCR-WAL-40 [confirmed]
  - AC 2: SCR-WAL-38 [pending text]
  - AC 3: SCR-WAL-38 [failed]; SCR-WAL-40 [failed]
  - AC 4: SCR-WAL-38 [needs attention]
  - AC 5: SCR-WAL-41 [duplicate callback]
  - AC 6: SCR-WAL-38 [timeout]
  - AC 7: SCR-WAL-38 [cancelled]
  - AC 8: SCR-WAL-38 [mistaken payment]
  - AC 9: no UI, system rule (every state change an audit entry with provider reference and actor; raw event stored as WAL-07; group entries keep requester and approvers or vote and voters)
- Objects and fields: Transaction (status Confirmed, Failed, Cancelled, Needs attention); Ledger entry (in-transit to provider; reversal); Notification; Audit entry; Raw provider event.
- Open points:
  1. After an operator decides a Needs attention withdrawal, what does the sender see and which key (OPS-05)? Not specified in the story.
  2. Does the person see the fee returned as a separate line on the Failed screen? Criterion 3 says the full total returns; the screen text names the amount only.
  3. Is "Report this payment" on a Failed payout the same form as SCR-WAL-50? Presumably yes (WAL-14); not stated here.
  4. A group payout's Failed outcome goes to SPD-11; which of the two stories owns the requester's screen text? Not specified in this story.

---

### WAL-12 Move money between my own wallets

- Story: WAL-12 Move money between my own wallets
- Surfaces:
  - SCR-WAL-42 | Move money screen (From wallet, To wallet, amount, fee line, "balance after" for both; button "Move 20 000 Ar to Savings") | page | owner; holder of Wallet: initiate spend on the source and Wallet: deposit on the destination (group) | "Move money" on wallet detail; "Move money from [wallet]" link from WAL-19 | Confirmed at once for personal wallets; request for group
  - SCR-WAL-43 | Group move request status ("Waiting for approval, 1 of 2", amount shown as reserved) | inline | requester and group members | group move requested | follows SPD
  - SCR-WAL-44 | Group transfer in-app item `wal.notice.group_transfer` | notification (in-app) | members with Wallet: view history (batched) | group move posted | none
  - SCR-WAL-45 | Posting path entry (shared with WAL-07; rule run by RUL-07; Gereo destinations of SPD-01) | system | none | confirmed move | none
- States per surface:
  - SCR-WAL-42 [default]: only open wallets of the same owner, not the source; fee line from `FEE_TABLE_GEREO` ("Fee: 0 Ar" because configured 0)
  - SCR-WAL-42 [validation]: amount at least 1 Ar, whole number, at most Available minus reserved; campaign wallet reserved part blocked; source and destination differ and are open; inline errors ("You have 30 000 Ar available")
  - SCR-WAL-42 [confirmed personal]: one balanced pair posted atomically; Confirmed at once; reference ID; no PIN; no provider
  - SCR-WAL-42 [changed balance]: balance changed; nothing posted; "Not moved. Your balance changed. Check and try again"
  - SCR-WAL-42 [double tap]: one move (idempotency key)
  - SCR-WAL-42 [offline]: button disabled with `xct.offline.money_blocked`
  - SCR-WAL-42 [frozen source]: source under Wallet freeze blocks the move
  - SCR-WAL-42 [history]: paired entries "Transfer out" and "Transfer in" with one reference ID, followed by Split and Rounding lines from the destination's rules
  - SCR-WAL-43 [awaiting]: SPD status Awaiting approval or Awaiting vote; Available unchanged; amount reserved
  - SCR-WAL-43 [posted]: authorisation done and SPD-10 checks pass; posts and settles instantly; Confirmed
  - SCR-WAL-44 [in-app]: batched; personal wallets none
  - SCR-WAL-45 [entry points]: group outflow to another group's or outside wallet, or payment to Gereo, is a class (a) request; a saved rule's share landing in a group wallet is class (b), no request, income for that wallet
- Criteria map:
  - AC 1: SCR-WAL-42 [default]
  - AC 2: SCR-WAL-42 [confirmed personal]
  - AC 3: SCR-WAL-42 [validation]
  - AC 4: SCR-WAL-43 [awaiting], [posted]; SCR-WAL-42 [frozen source]
  - AC 5: SCR-WAL-42 [history]; SCR-WAL-45 [entry points] (income for destination, rules run, rounding to Gereo, not spending for cap)
  - AC 6: SCR-WAL-42 [history]
  - AC 7: SCR-WAL-42 [changed balance], [double tap], [offline]
  - AC 8: SCR-WAL-44 [in-app]
  - AC 9: no UI, system rule (audit `transfer.internal` with wallets, amount, reference, approvers or vote and voters)
  - AC 10: SCR-WAL-45 [entry points]
- Objects and fields: Ledger entry (transfer out, transfer in, split, rounding); Transaction (reference); Approval and Vote (read, group); Audit entry (`transfer.internal`).
- Open points:
  1. Do the PIN and the WAL-10 review and pause apply when a group move request is created? Criterion 2 says no PIN for personal moves; criterion 4 says the request is created through SPD-01 (which reuses the WAL-10 components) but does not state the PIN for this case.
  2. The fee line is "0 Ar" because configured; if `FEE_TABLE_GEREO` is later non-zero for moves, is there a live fee line? Implied; not specified.
  3. How is "reserved" shown on the source while a group move is Awaiting approval? Criterion 4 says amount shown as reserved; where is not specified.
  4. A move from a group wallet into the same group's other wallet is a request (class a) yet criterion 4 also says intra-group moves do not count in "spent"; how the SPD request screen labels this is owned by SPD; not specified here.

---

### WAL-13 Send money to another person or group inside Gereo

- Story: WAL-13 Send money to another person or group inside Gereo
- Surfaces:
  - SCR-WAL-46 | Send to a person or group (destination picker: Gereo user by phone number with registered display name and partly masked number, or a group wallet from the person's groups) | page | owner of the source wallet; holder of Wallet: initiate spend (group source); Wallet: deposit on a group destination | "Send to a person or group" on a wallet | opens SCR-WAL-47
  - SCR-WAL-47 | Transfer review (recipient, from wallet, amount, fee line from `FEE_TABLE_GEREO`, balance after; button "Send 20 000 Ar to Rasoa"; PIN and pause screens SCR-WAL-36 and SCR-WAL-37) | page | same | SCR-WAL-46 | confirmed at once
  - SCR-WAL-48 | Recipient not on Gereo prompt ("[number] does not have Gereo yet", invite action GRP-03) | inline | sender | number lookup fails | opens GRP-03 invite
  - SCR-WAL-49 | Transfer notices `msg.wal.transfer_received.push` (and SMS if app not opened), `msg.wal.transfer_sent.sms` | notification | recipient; sender | transfer confirmed | opens receipt
- States per surface:
  - SCR-WAL-46 [default]: user destination lands in the recipient's receiving wallet
  - SCR-WAL-46 [group destination]: group wallet where the sender holds Wallet: deposit
  - SCR-WAL-46 [offline]: disabled
  - SCR-WAL-47 [default]: PIN on a screen repeating amount and recipient; pause for first-time recipient, new device, or amount at or above `LARGE_AMOUNT_PAUSE`
  - SCR-WAL-47 [limit hit]: money-out limit (`TRANSFER_COUNTS_AS_MONEY_OUT`, default true) hit; ACC-07 ladder message; no money moves
  - SCR-WAL-47 [recipient cannot receive]: recipient above receive limits, no receiving wallet or wallet closed; `err.wal.recipient_cannot_receive` without saying why
  - SCR-WAL-47 [group source]: outflow from a group wallet to anyone outside the group creates a request (SPD-01, including Gereo destinations); PIN and pause apply at request creation; settled instantly once authorised; Pay Gereo or SMS allowance top-up posted as "Platform: SMS allowance"
  - SCR-WAL-47 [confirmed]: one balanced atomic posting with reference ID; visible in both histories; recipient sees "Received from [display name]"; income for the recipient wallet; rules run; rounding to Gereo on the receipt
  - SCR-WAL-48 [default]: "[number] does not have Gereo yet" with invite action; no money moves
  - SCR-WAL-49 [recipient]: push `msg.wal.transfer_received.push` ("Rasoa sent you 20 000 Ar. Ref 7Q4K-82."); SMS if the app is not opened (NTF-05)
  - SCR-WAL-49 [sender]: one SMS `msg.wal.transfer_sent.sms` at the outcome (direct at or above `ntf.money_out_sms_min_amount` or new payee, otherwise fallback after unread push); suppressed for a campaign-tagged transfer
- Criteria map:
  - AC 1: SCR-WAL-46 [default], [group destination]; SCR-WAL-47 [default]
  - AC 2: no UI beyond SCR-WAL-46, system rule (only the owner side of the source initiates; no pull; no money request)
  - AC 3: SCR-WAL-47 [default]
  - AC 4: SCR-WAL-47 [limit hit], [recipient cannot receive]
  - AC 5: SCR-WAL-47 [group source]
  - AC 6: SCR-WAL-47 [confirmed]
  - AC 7: no UI, system rule (no automatic reversal; receiver may send back as a new transfer; mistakes via "Report this payment" and WAL-18)
  - AC 8: SCR-WAL-48 [default]; SCR-WAL-47 [recipient cannot receive]; SCR-WAL-46 [offline]
  - AC 9: SCR-WAL-49 [recipient], [sender]
  - AC 10: no UI, system rule (audit `transfer.external_owner`; group-visible ledgers show display name, never the phone number)
- Objects and fields: Ledger entry; Transaction; Wallet (`receives_transfers` flag); User (display name, masked number); Audit entry (`transfer.external_owner`); Notification.
- Open points:
  1. Looking up a phone number and returning "does not have Gereo yet" or a display name reveals whether a number has an account (ACC stories deliberately avoid this before sign-in). Is that accepted for signed-in senders, and is lookup rate-limited? Not specified in the story.
  2. R70 says no blocking; there is no screen for a recipient to refuse. Confirmed closed; no UI.
  3. Which pause text applies to a first-time group destination? Criterion 3 names first-time recipient; a group wallet is not a "number". Not specified in the story.
  4. The sender's SMS `msg.wal.transfer_sent.sms` is suppressed for a campaign-tagged transfer; where is the campaign tag chosen (ANN-05)? Not specified here.
  5. The story says phone numbers are masked in group-visible ledgers; the recipient picker shows a partly masked number: which digits are masked? Not specified.

---

### WAL-14 Read one transaction and its receipt, and report a problem

- Story: WAL-14 Read one transaction and its receipt, and report a problem
- Surfaces:
  - SCR-WAL-50 | Transaction detail and receipt (status chip, amount with direction words, fee, total, date and time, type, wallet, counterparty, initiated by, approved by, reference ID, provider reference, timeline, ledger block, rule line, Rounding row, state explanation) | page | owner; member with Wallet: view history | history row, notification, "See all" | report, share, repeat, back
  - SCR-WAL-51 | Accounting view toggle (debit and credit columns) | inline | viewer | SCR-WAL-50 | toggle
  - SCR-WAL-52 | Report this payment (pre-filled form: reference, amount, date, status, wallet, provider reference; choice Not received, Wrong recipient, Taken twice, Other; optional text) | page | viewer of the transaction | "Report this payment" | submit creates a support ticket (OPS) and shows its number and status
  - SCR-WAL-53 | Share receipt (PDF or text through the phone's share sheet) | system | viewer of a Confirmed transaction | "Share" | OS share
- States per surface:
  - SCR-WAL-50 [default]: full detail; reference ID in groups of 3 or 4 characters with a copy button; counterparty full name with number masked for anyone other than the sender; "approved by" lists approvers or "Group vote" with link and voters count
  - SCR-WAL-50 [ledger block]: each entry as a sentence ("From Savings to Rado: 50 000 Ar"); fee and tax lines their own entries
  - SCR-WAL-50 [rule line]: "Why: 40% to Savings by rule Split salary" with link (RUL-12); chains show each hop in order; deleted rule shows its name followed by "(deleted)"; income shows "Rules on this income" with each outcome (Moved, Alert sent, Skipped and the reason)
  - SCR-WAL-50 [rounding]: Rounding line (`ledger.rounding_line`) own row "Rounding to Gereo: 1 Ar" with "Whole-ariary leftover of a split, in the terms you accepted"; one aggregated row per original income in the app; no row when 0
  - SCR-WAL-50 [pending]: says what Gereo waits for and what to do ("Nothing. We will SMS you.")
  - SCR-WAL-50 [failed]: says whether money moved
  - SCR-WAL-50 [needs attention]: gives the reference and the support route
  - SCR-WAL-50 [reversed]: chip "Reversed" linking both ways to the reversal (WAL-18)
  - SCR-WAL-50 [summary]: a non-Confirmed transaction shows a "Summary" labelled "Not a proof of payment"
  - SCR-WAL-50 [offline or loading]: opens from cache with "Updated hh:mm"; a loading skeleton when not cached
  - SCR-WAL-50 [permission missing]: shows the permission by name
  - SCR-WAL-50 [repeat]: past withdrawal or transfer out offers "Repeat this payment" opening WAL-09 or WAL-13 filled in; PIN asked again
  - SCR-WAL-51 [default]: debit and credit columns
  - SCR-WAL-52 [default]: "Report this payment" always visible; submit never promises a refund
  - SCR-WAL-52 [offline]: report kept as "Waiting to send" (XCT-05 Table A "Report this payment") and sent when the app is open with signal
  - SCR-WAL-53 [default]: Confirmed transaction receipt (reference, amount, fee, date, wallet name at the time, status, provider); counterparty number hidden unless the sender chooses to include it
  - SCR-WAL-50 [accessibility]: reference announced in groups; copy button announces "Copied"; direction by words and icon, not red and green
- Criteria map:
  - AC 1: SCR-WAL-50 [default]
  - AC 2: SCR-WAL-50 [ledger block]; SCR-WAL-51 [default]
  - AC 3: SCR-WAL-50 [rule line], [rounding]
  - AC 4: SCR-WAL-50 [pending], [failed], [needs attention], [reversed]
  - AC 5: SCR-WAL-52 [default], [offline]
  - AC 6: SCR-WAL-53 [default]; SCR-WAL-50 [summary]
  - AC 7: SCR-WAL-50 [repeat]
  - AC 8: SCR-WAL-50 [offline or loading], [permission missing]
  - AC 9: no UI, system rule (opening is not audited; submitting a report writes `support.reported`)
  - AC 10: SCR-WAL-50 [accessibility]
- Objects and fields: Transaction (status, amount, fee, total, type, wallet, counterparty, initiated by, approved by, reference ID, provider reference, timeline); Ledger entry; Wallet rule (name, version); Support ticket (category, reference); Audit entry (`support.reported`).
- Open points:
  1. Reference format: criterion 1 says "groups of 3 or 4 characters", the open question says 8 characters in two groups of 4 ("7Q4K-82AX"), and examples show "7Q4K-82" (7 characters). Which grouping and length is final?
  2. The receipt shows "provider" and criterion 1 shows a "provider reference"; conventions 10.4 say the provider name never appears. What is shown?
  3. The counterparty full name is shown but "Name not available" applies for payouts (WAL-10); what does the detail show for a payout to an unknown name? Not specified.
  4. "Notes marked private" appear in WAL-16, but no screen here lets a person add a note or mark it private. Where are notes created? Not specified in the story.
  5. Is "Report this payment" on a group wallet transaction available to every member with Wallet: view history, or only the requester? Not specified.

---

### WAL-15 Browse and search my history with filters

- Story: WAL-15 Browse and search my history with filters
- Surfaces:
  - SCR-WAL-54 | History list (rows grouped by day, search box, totals header, active filter chips) | page | owner; member with Wallet: view history | "See all" on a wallet, "History" for all wallets | row opens SCR-WAL-50
  - SCR-WAL-55 | Filter sheet (Wallet, Type, quick groupings Deposit and Withdrawal, Where, Date, Source, Status) | sheet | viewer | filter control on SCR-WAL-54 | apply or clear
  - SCR-WAL-56 | Totals header ("Money in X Ar, money out Y Ar") | inline | viewer | SCR-WAL-54 | none
- States per surface:
  - SCR-WAL-54 [default]: rows grouped by day; counterparty or purpose, amount (right-aligned, equal-width digits), status chip, time; `HISTORY_PAGE_SIZE` rows with "Load more"; newest first by posting time
  - SCR-WAL-54 [rule entries]: rule name shown in the row; Rounding entries own row aggregated per original income
  - SCR-WAL-54 [search]: matches reference ID (prefix, ignoring case and dashes), counterparty name, note, exact amount in digits; starts at 2 characters; ignores accents and case; waits `SEARCH_DEBOUNCE_MS`; highlights the match; works inside active filters
  - SCR-WAL-54 [empty new wallet]: the empty state of WAL-01
  - SCR-WAL-54 [no match]: "No entries match. Clear filters"
  - SCR-WAL-54 [loading]: skeleton rows; never "No records"
  - SCR-WAL-54 [refresh failed]: list kept; Retry
  - SCR-WAL-54 [permission missing]: group wallet without Wallet: view history; `wal.history.not_permitted` naming it; phone numbers masked in group-visible lists
  - SCR-WAL-54 [offline]: filters and search on cached recent entries; "Showing saved items from [date]. Connect to see older ones."
  - SCR-WAL-54 [accessibility]: result count announced after filtering ("12 results"); controls at least 48 dp
  - SCR-WAL-55 [default]: filters combine with AND; Type includes Contribution, Penalty, Income, Split, Rounding, Expense, Transfer, Fee, Share-out, Reversal, Cash-out and Platform: SMS allowance; Where: Mobile money in, Mobile money out, Inside Gereo; Date: Today, 7 days, This month, Custom range; Source: All, Made by a rule, Made by a person; Status: All, Confirmed, Pending, Failed, Cancelled, Needs attention; "Clear all"
  - SCR-WAL-56 [online]: computed on the server over the whole result
  - SCR-WAL-56 [offline]: totals say they cover saved items only
- Criteria map:
  - AC 1: SCR-WAL-54 [default]
  - AC 2: SCR-WAL-55 [default]
  - AC 3: SCR-WAL-54 [rule entries]; SCR-WAL-55 [default]
  - AC 4: SCR-WAL-54 [search]
  - AC 5: SCR-WAL-56 [online]
  - AC 6: SCR-WAL-54 [empty new wallet], [no match], [loading], [refresh failed]
  - AC 7: SCR-WAL-54 [permission missing]
  - AC 8: SCR-WAL-54 [offline]; SCR-WAL-56 [offline]
  - AC 9: SCR-WAL-54 [accessibility]
- Objects and fields: Ledger entry (type chip, Where, amount, status, rule name, counterparty, time); Transaction; Wallet rule (name).
- Open points:
  1. Does "Money in X, money out Y" include Rounding, Fee and Reversal lines? Not specified in the story.
  2. Is the Platform: SMS allowance type shown to members without Wallet: view history? Not specified.
  3. Where does a person add a "note" that search matches? No note-entry screen is specified in this epic.
  4. Is the filter sheet one sheet with all seven filters, and does it scroll? 09 section 10.3 says a sheet that needs scrolling or a second step becomes a page; seven filters likely scroll. Container choice not specified in the story.

---

### WAL-16 Export a wallet's history as CSV or PDF

- Story: WAL-16 Export a wallet's history as CSV or PDF
- Surfaces:
  - SCR-WAL-57 | Export form (format CSV or PDF, period This month, Last month, Custom, wallet one or all exportable, apply current filters, CSV separator choice, entry count confirmation) | page | owner; holder of Wallet: export history (group wallet) | "Export" on a wallet or on the history | PIN (SCR-ACC-30 pattern) then generate and download
  - SCR-WAL-58 | Export progress and ready (preparing message, private link, saved file) | inline | requester | large export | open file
  - SCR-WAL-59 | Export ready notice `msg.wal.export_ready.push` | notification | requester | background build done | opens SCR-WAL-58
  - SCR-WAL-60 | Export builder (CSV with BOM and columns; PDF statement; reconciliation of opening, closing, in, out) | system | none | confirmed export | none
- States per surface:
  - SCR-WAL-57 [default]: choices; count of entries shown before generating; PIN asked before download
  - SCR-WAL-57 [permission missing]: group wallet without Wallet: export history; permission named
  - SCR-WAL-57 [empty period]: no file; "Nothing to export for this period"
  - SCR-WAL-57 [offline]: "Export" disabled with `xct.offline.needs_connection`; downloaded files stay readable
  - SCR-WAL-58 [sync]: up to `EXPORT_SYNC_MAX_ROWS` built at once
  - SCR-WAL-58 [preparing]: above it, "We are preparing your file"; link lasts `EXPORT_LINK_TTL`
  - SCR-WAL-58 [ready]: finished file saved on the phone, opens offline
  - SCR-WAL-58 [failed]: no partial file; `err.wal.export_failed` with "Try again"
  - SCR-WAL-59 [push]: `msg.wal.export_ready.push`
  - SCR-WAL-60 [csv]: UTF-8 with byte-order mark; separator comma with a "Semicolon (for French-language spreadsheets)" choice; columns reference, date and time ISO 8601 +03:00, wallet, type, where, status, direction, amount integer MGA, fee, total, counterparty, rule_name, rule_version, hop, caused_by_entry_id, note, balance after; group columns from CON-18; labels in the person's language and technical names in a second header row; plain integers
  - SCR-WAL-60 [pdf]: owner, wallet, period, generation time, code MGA, opening, closing, in, out; opening plus in minus out equals closing; real text; page numbers; generation reference ID
  - SCR-WAL-60 [content]: totals count posted entries only; Pending, Failed, Cancelled in "Not counted"; Reversed entries with their reversal; Rounding per hop and Fee as own rows; private notes and attachments never included
  - SCR-WAL-60 [group]: phone numbers masked; initiator and approver names included
- Criteria map:
  - AC 1: SCR-WAL-57 [default]
  - AC 2: SCR-WAL-60 [csv]
  - AC 3: SCR-WAL-60 [pdf]
  - AC 4: SCR-WAL-60 [content]
  - AC 5: SCR-WAL-58 [sync], [preparing], [ready]; SCR-WAL-59 [push]
  - AC 6: SCR-WAL-60 [group]; SCR-WAL-57 [permission missing]
  - AC 7: SCR-WAL-58 [failed]; SCR-WAL-57 [offline], [empty period]
  - AC 8: no UI, system rule (export free, no cooldown for wallet history)
  - AC 9: no UI, system rule (audit `export.created` written once at build, not on retry or re-download)
- Objects and fields: Ledger entry; Transaction; Export file (format, period, filters, row count); Audit entry (`export.created`); Notification.
- Open points:
  1. "Notes marked private" are excluded, yet no story defines how a note is created or marked private. Where?
  2. `EXPORT_SYNC_MAX_ROWS` and `EXPORT_LINK_TTL` are TBD.
  3. Does a PIN entry for an export reuse the generic PIN prompt of SCR-ACC-30 or the money-out PIN screen of SCR-WAL-37? The story says "the PIN is asked"; the screen is not named.
  4. The accounting profession's required format is open with field research (default used: plain CSV and PDF).
  5. Is the number of entries confirmation a sheet or inline text? Not specified in the story.

---

### WAL-17 Read my balances and recent history without a connection

- Story: WAL-17 Read my balances and recent history without a connection
- Surfaces:
  - SCR-WAL-61 | Wallet cache slice (wallet list, balance, goal, rule definitions, last `CACHE_RECENT_TRANSACTIONS` entries per wallet and their receipts; XCT-04 owns the rest) | system | Individual, Member (same permissions as online) | after each successful sync | none
  - SCR-WAL-62 | Disabled-action reasons (one line: `xct.offline.money_blocked` or `xct.offline.needs_connection`) | inline | Individual, Member | opening a money or edit action without connection | none
  - SCR-WAL-63 | Receipt "Waiting to send" report item | inline | person who reported while offline | "Report this payment" offline | none
- States per surface:
  - SCR-WAL-61 [cached]: wallet list, balance, goal, rule definitions, history entries with reference, status chip, amount, fee, date and time, type, counterparty, rule name, receipts
  - SCR-WAL-61 [sync]: connection returns; app updates itself; for balances the cache is replaced by the server value, never merged
  - SCR-WAL-61 [hidden balances]: the hidden-balance setting (WAL-19) respected in cached views
  - SCR-WAL-62 [money-out]: add money, send out, move money, send to a person disabled with `xct.offline.money_blocked`
  - SCR-WAL-62 [other]: close, edit, export disabled with `xct.offline.needs_connection`
  - SCR-WAL-63 [waiting]: "Waiting to send" with its state visible (WAL-14, XCT-05)
- Criteria map:
  - AC 1: SCR-WAL-61 [cached]
  - AC 2: no UI, system rule (indicator, wording, freshness, storage, unlock, erase, never-cached list, freeze state, ledger days and group data per XCT-04)
  - AC 3: SCR-WAL-62 [money-out], [other]
  - AC 4: SCR-WAL-63 [waiting]
  - AC 5: SCR-WAL-61 [sync]
  - AC 6: SCR-WAL-61 [hidden balances]; times in Madagascar time and strings in the person's language (no UI beyond that)
- Objects and fields: Wallet; Ledger entry; Transaction; Wallet rule (cached read); Device.
- Open points:
  1. The story says anything not listed is defined by XCT-04; the exact wording of the "without a connection" indicator is therefore not in this file. Not specified in the story.
  2. Which freeze state and "Held by Gereo" chip are cached and shown offline? Per XCT-04; not specified here.
  3. Is "Add money" also shown as `xct.offline.money_blocked` (money-in), although deposits are not money-out? Criterion 3 lists add money with money-out reasons; WAL-06 uses `xct.offline.money_blocked` for deposits as well. Consistent in the stories, but the key's name says money-out.

---

### WAL-18 Correct a mistake with a reversing entry, never an edit

- Story: WAL-18 Correct a mistake with a reversing entry, never an edit
- Surfaces:
  - SCR-WAL-64 | Reversal or correction proposal (pick entry, Reverse in full or Correct, reason code, note, ticket or alert number) | page | Gereo operator holding `handle tickets` or `resolve discrepancy` (operator console, OPS-05) | support ticket or discrepancy alert | submit for approval
  - SCR-WAL-65 | Reversal preview (exact entries to be written, resulting balance of each wallet, derived entries listed and selected by default; button "Post reversal of 50 000 Ar") | page | operator; approver holding `approve ledger correction` | SCR-WAL-64 | post
  - SCR-WAL-66 | Person's view of a reversal (chip "Reversed", reversal row "Reversal of Ref 7Q4K-82" with reason `wal.reversal.reason.<code>`; operators shown as "Gereo support") | inline | owner; members with Wallet: view history | transaction detail | links both ways
  - SCR-WAL-67 | Balance corrected notices `msg.wal.balance_corrected.push` and `.sms` | notification | owner; members with Wallet: view history see the feed and digest | correction posted | opens SCR-WAL-50
  - SCR-WAL-68 | Ledger invariants and system reversals (`withdrawal_failed`, `withdrawal_cancelled`) | system | none | failure paths | none
- States per surface:
  - SCR-WAL-64 [default]: operator picks an entry; reason code, note and ticket or alert required; proposer can never approve
  - SCR-WAL-64 [third approver]: above `CORRECTION_APPROVAL_THRESHOLD` a third person different from proposer and first approver must approve
  - SCR-WAL-65 [default]: shows entries and resulting balances
  - SCR-WAL-65 [negative balance]: reversal would take a wallet below zero; blocked with reason and alternatives (reverse derived entries first, or correct a smaller amount up to Available); remaining shortfall posted as a Gereo loss line, never a debt claim
  - SCR-WAL-65 [one reversal]: an entry reversed in full once; partial corrections up to the original amount
  - SCR-WAL-65 [derived entries]: reversed income lists derived entries (shares moved, Rounding line) all selected by default; each its own linked reversing entry
  - SCR-WAL-66 [default]: arithmetic visible; balance arithmetic of the reversal
  - SCR-WAL-67 [push and sms]: "A correction of 50 000 Ar was made on Savings. Ref 7Q4K-82. See the app."
  - SCR-WAL-68 [invariants]: no actor, screen or API edits or deletes an entry; correction carries the original `project_id`
  - SCR-WAL-68 [system reversal]: failed or cancelled withdrawal posts its reversing entry automatically; no operator
  - SCR-WAL-68 [rules]: a reversal or correction is never income and never counts as spending for a cap
- Criteria map:
  - AC 1: SCR-WAL-68 [invariants]
  - AC 2: SCR-WAL-68 [system reversal]
  - AC 3: SCR-WAL-64 [default], [third approver]
  - AC 4: SCR-WAL-65 [default], [negative balance]
  - AC 5: SCR-WAL-65 [one reversal]
  - AC 6: SCR-WAL-66 [default]
  - AC 7: SCR-WAL-68 [rules]; SCR-WAL-65 [derived entries]
  - AC 8: SCR-WAL-67 [push and sms]
  - AC 9: no UI, system rule (audit `ledger.reversal` with operator, approver, ticket, reason, balances before and after)
- Objects and fields: Ledger entry (reversing, adjusting, project_id, reason code, links); Support ticket; Audit entry (`ledger.reversal`); Notification.
- Open points:
  1. Operator screens are owned by OPS-05; this inventory lists them because the story fixes what they accept. Which story owns the frame list for SCR-WAL-64 and SCR-WAL-65? Not specified in the story.
  2. The evidence required above `CORRECTION_APPROVAL_THRESHOLD` is "OPS to confirm" (OPS-05 open question).
  3. The value of `CORRECTION_APPROVAL_THRESHOLD` is TBD.
  4. How does a member read the "Gereo loss" shortfall booking? The story says it is the debit side; the member view of it is not specified.
  5. The reason codes list (`wal.reversal.reason.<code>`) is not listed in the story beyond `withdrawal_failed` and `withdrawal_cancelled`.

---

### WAL-19 Hide my balance, and see when a wallet is low or empty

- Story: WAL-19 Hide my balance, and see when a wallet is low or empty
- Surfaces:
  - SCR-WAL-69 | Hide and Show toggle (eye icon with visible label) | inline | Individual, Member (group balances need Wallet: view balance) | wallet list and wallet detail | toggle
  - SCR-WAL-70 | Low balance and Empty chips with "Add money" | inline | Individual; members who can view the balance | wallet card and detail | opens SCR-WAL-19
  - SCR-WAL-71 | "Move money from [wallet]" link in insufficient-balance messages (WAL-09, WAL-12) | inline | Individual | insufficient balance message | opens SCR-WAL-42 filled in
- States per surface:
  - SCR-WAL-69 [visible]: default; balances shown
  - SCR-WAL-69 [hidden]: every balance-type figure (Available, safe to spend, goal amounts, the total) as "••••"; remembered per device across restarts; applies to cached views, the home total and group balances; history transaction amounts stay visible; notifications and SMS unchanged
  - SCR-WAL-69 [accessibility]: at least 48 dp; screen reader says "Balance hidden. Double tap to show"
  - SCR-WAL-70 [low]: active low-balance rule (RUL-11) and Available below its threshold; chip "Low balance", line "Below 50 000 Ar" (example), "Add money"; clears at or above the threshold; no threshold means no low state
  - SCR-WAL-70 [empty]: wallet with activity and Available 0; chip "Empty" and "Add money"; new wallet with no activity shows the WAL-01 empty state
  - SCR-WAL-70 [pending]: low and empty use Available only; note "1 deposit on its way, not counted yet"
  - SCR-WAL-70 [group]: visible to members who can view the balance; alerts go to the audience chosen in RUL-11 and NTF-04
  - SCR-WAL-71 [default]: when another wallet of the person has enough, link "Move money from [wallet]"
- Criteria map:
  - AC 1: SCR-WAL-69 [visible], [hidden]
  - AC 2: SCR-WAL-69 [hidden]
  - AC 3: SCR-WAL-70 [low]
  - AC 4: SCR-WAL-70 [empty]
  - AC 5: SCR-WAL-70 [pending]
  - AC 6: SCR-WAL-71 [default]
  - AC 7: SCR-WAL-70 [group]
  - AC 8: SCR-WAL-69 [accessibility]
  - AC 9: no UI, system rule (display only; no notification, no ledger entry)
- Objects and fields: Wallet; Ledger entry (Available); Wallet rule (low-balance threshold); Device setting (hide, local).
- Open points:
  1. ACC-12 criterion 6 owns notification previews; WAL-19 keeps lock-screen push amounts visible. A person hiding balances still sees amounts in push; is this disclosed anywhere on the toggle? Closed by the story; not specified whether the toggle explains it.
  2. Where is the eye icon placed on a group wallet detail and does it also hide the "Your share" figure? "Every balance-type figure" implies yes; not explicit.
  3. P2 priority: is the toggle needed on the first release screens already designed (WAL-02, WAL-03)? Not specified in the story.

---

### WAL-20 See that my ledger matches the provider, as a status line

- Story: WAL-20 See that my ledger matches the provider, as a status line
- Surfaces:
  - SCR-WAL-72 | Reconciliation status line (icon and word: "Matched, checked 19 Oct 02:00", "Checking...", "Difference under review since 19 Oct 02:00") | inline | member with Wallet: view balance | wallet detail (and CON-17 on the group ledger) | tap opens SCR-WAL-73
  - SCR-WAL-73 | Reconciliation explanation (what is compared, how often, "Your balance comes from the Gereo ledger and is not changed by this check"; number of own items waiting; "Overall check: under review") | sheet | member with Wallet: view balance (no amount of any difference for non-operators) | SCR-WAL-72 | close
  - SCR-WAL-74 | Needs attention notice `msg.wal.needs_attention.push` | notification | person whose item is involved | item unmatched | opens SCR-WAL-50
  - SCR-WAL-75 | Reconciliation result reader (OPS-04 job result; daily at `RECON_RUN_TIME`) | system | none | daily run | none
- States per surface:
  - SCR-WAL-72 [matched]: "Matched, checked 19 Oct 02:00" in Madagascar time
  - SCR-WAL-72 [checking]: "Checking..."
  - SCR-WAL-72 [difference]: "Difference under review since 19 Oct 02:00" only when an item of this wallet or of another wallet of its group is unmatched; OPS alerted; nothing corrected automatically
  - SCR-WAL-72 [overall check]: global balance difference with no item of this wallet; line stays "Matched"; explanation shows "Overall check: under review"
  - SCR-WAL-72 [not checked]: no successful run within `RECON_MAX_AGE`; "Not checked since 17 Oct 02:00" with a warning chip
  - SCR-WAL-72 [provider unreachable]: "Provider balance not available now" with the last good result, never an invented number
  - SCR-WAL-72 [offline]: "Last known: Matched, checked 19 Oct 02:00"; reconciliation time distinct from last-synced time
  - SCR-WAL-72 [group]: every member who can view the balance sees the same line
  - SCR-WAL-73 [default]: plain-words note; own items waiting count; no difference amount for non-operators; tolerance 0 (`RECON_TOLERANCE_AR`)
  - SCR-WAL-74 [push]: "We are checking a payment. Ref 7Q4K-82. You do not need to do anything."
  - SCR-WAL-75 [run]: compares each provider transaction of the day with the ledger by reference and amount; Rounding line covered by the internal check, not matched by provider reference; result stored with start, end, counts, outcome
  - SCR-WAL-75 [closed case]: line returns to Matched when OPS closes the case, with an audit entry
- Criteria map:
  - AC 1: SCR-WAL-75 [run]
  - AC 2: SCR-WAL-72 [matched], [checking], [difference]
  - AC 3: SCR-WAL-73 [default]
  - AC 4: SCR-WAL-72 [difference], [overall check]; SCR-WAL-75 [closed case]
  - AC 5: SCR-WAL-72 [not checked], [provider unreachable]
  - AC 6: SCR-WAL-72 [offline]
  - AC 7: SCR-WAL-72 [group]
  - AC 8: SCR-WAL-74 [push]; none by default (no UI)
  - AC 9: no UI, system rule (every run with outcome and operator action stored for `RECORD_RETENTION_YEARS`)
- Objects and fields: Reconciliation result (read, OPS-owned); Transaction (matched flag); Audit entry.
- Open points:
  1. GRP-06 criterion 1 and CON-17 reuse this line; the wording "to be harmonised" is flagged in the Conversation. Which wording wins if they differ? Not specified.
  2. Does the line also appear on the wallet list card or only on the wallet detail? The story says "when I look at a wallet"; only the detail is specified.
  3. Is "Checking..." triggered by a time window or a flag from OPS? Not specified.

---

## Epic summary

- Stories: 20.
- Distinct surfaces: 75. By kind:
  - page: 23
  - sheet: 6
  - modal: 1
  - inline: 21
  - notification: 12
  - system: 12
- State lines: 250.
- Open points: 83. Full list:
  - WAL-01.1: The story says types appear as "Goal" and "Long term" in place of "Savings" and "Investment"; what are the visible labels of the other two types (budget, business) and the exact keys `wal.create.type.*`? Not specified in the story.
  - WAL-01.2: Name uniqueness: criterion 2 says unique per owner ignoring case and accents, but GRP-15 criterion 6 allows a duplicate wallet name inside a group with a soft warning. Which applies to a group wallet?
  - WAL-01.3: GRP-01 creates the first wallet through the group form; does it use `err.wal.name_taken` and the same type labels? Not specified in either story.
  - WAL-01.4: Is the Owner picker hidden when the person belongs to no group and holds no Wallet: create anywhere? The story implies only "Me" is shown; not specified.
  - WAL-02.1: Criterion 1 lists chips but not "Goal reached", which WAL-03 shows on the detail. Is "Goal reached" also a card chip? Not specified in the story.
  - WAL-02.2: The chip "Closed" is listed in criterion 1 but closed wallets are hidden by default (criterion 4); the chip shows only after "Show closed"? Not specified.
  - WAL-02.3: Where is the hide/show eye icon placed relative to the "All my wallets" line (WAL-19)? WAL-19 says it sits on the wallet list; position not specified.
  - WAL-02.4: A group wallet visible only through Group: view group: GRP-06 shows a "missing permission note" naming who to ask; this card shows `wal.list.balance_not_permitted`; do they show the same names? Not specified.
  - WAL-03.1: Criterion 6 shows actions disabled with the permission named, while 09 section 10.4 rule 5 says never disable for permission (hide, or show enabled with a reason). Which applies? Not specified in the story.
  - WAL-03.2: What does "N" in "last N entries" equal on the detail page? Not specified in the story (the cache holds `CACHE_RECENT_TRANSACTIONS`).
  - WAL-03.3: "Campaign reserves" in the Safe to spend formula come from ANN; the "How is this calculated?" line wording for them is not specified.
  - WAL-03.4: A person with Wallet: view history but not Wallet: view balance: does the detail show "On its way in" pending deposits? Open question says "everyone who holds Wallet: view balance"; behaviour for others not specified.
  - WAL-04.1: The setting "Receives transfers" is on for exactly one wallet; how does the person turn it off, and which wallet receives when that wallet is closed (WAL-05)? Not specified in the story.
  - WAL-04.2: Renaming and retyping a group wallet needs Wallet: create, but no group-wallet edit entry for a holder of Wallet: create only (no Wallet: edit rules) is described when they open the goal fields. Are the goal fields shown read-only? Implied by criterion 4; not explicit.
  - WAL-04.3: Is a toast `wal.edit.saved` the only confirmation, given 09 section 10.3 says a toast is a result, not a place to learn something costly? Acceptable here (no money); recorded for completeness.
  - WAL-05.1: Wallet: close is a money-out class permission (granting needs a PIN); does the person closing a personal or group wallet enter a PIN? Not specified in the story.
  - WAL-05.2: What does the closing sheet say about the retention period (`RECORD_RETENTION_YEARS` open with ACC open question 1)? Default says "history stays exportable"; wording not specified.
  - WAL-05.3: What happens to the "receives transfers" flag when the receiving wallet is closed? See WAL-04 open point 1.
  - WAL-05.4: Reopening is not in the MVP; no screen. Confirmed closed.
  - WAL-06.1: The review shows a "provider name", but conventions 10.4 say the provider name never appears in the UI and D7 names no provider. Does "provider name" mean the mobile money operator? Not specified in the story.
  - WAL-06.2: Is a daily limit checked for deposits (WAL-09 shows "You can still send X today" for money-out only)? Not specified in the story.
  - WAL-06.3: `PENDING_ETA_TEXT_MINUTES` is TBD; the pending text cannot be finalised until set.
  - WAL-06.4: For a group wallet, does a deposit by a member show "Wallet: deposit" only, or also the group's split effects (CON-14) before review? Not specified in the story.
  - WAL-06.5: Which key names the "Tell me when it works" alert is in WAL-08; here the provider-down state is only a pointer.
  - WAL-07.1: Which message key tells a depositor that the Failed deposit was reversed or never charged when the provider answer is unclear (`wal.deposit.failed.*` has no listed variants)? Not specified in the story.
  - WAL-07.2: `PENDING_TIMEOUT`, `STATUS_POLL_INTERVAL` and `STATUS_POLL_MAX` are TBD; the Needs attention timing cannot be shown yet.
  - WAL-07.3: What does a depositor see after an operator resolves a Needs attention deposit (OPS-05)? Not specified in the story.
  - WAL-07.4: Is a "Needs attention" deposit shown on the wallet detail's "On its way in" line? Not specified in the story.
  - WAL-08.1: The alert from "Tell me when it works" has an expiry whose value is not specified in the story.
  - WAL-08.2: R187 says that when the provider is unavailable before acceptance there is no transaction and the request stays Approved with "Nothing was taken from the wallet", while criterion 3 says a withdrawal is accepted as Pending at once. What is the moment of acceptance and which wording applies?
  - WAL-08.3: Criterion 3 reserves the amount at acceptance with no ledger entry, while WAL-10 criterion 5 posts an in-transit entry at PIN acceptance. See WAL-10 open point 1.
  - WAL-08.4: Does the banner show the operator name or the generic text when several operators differ? Criterion 1 allows both; the selection rule is not specified.
  - WAL-08.5: Is a withdrawal that is queued shown on the "On its way out" line of SCR-WAL-07 with the "Cancel" action reachable there? Not specified in the story.
  - WAL-09.1: Criterion 4's button "Verify my identity" differs from ACC-07 criterion 4's `Verify now`. Which label is used?
  - WAL-09.2: Criterion 10 lists only personal projects, but personal projects are P2 in PRJ-12 and cut first. Is the project picker hidden when none exist or not built? Not specified in the story.
  - WAL-09.3: Does the "names of holders of Wallet: approve spend" list in SCR-WAL-33 respect GRP-12's rule that identities are not shown in the spending policy counts? WAL-09 shows names; GRP-12 shows anonymous counts. Which applies to a requester?
  - WAL-09.4: The daily money-out total is read from OPS-11; the start of the day (Madagascar time) is not specified in the story.
  - WAL-10.1: Criterion 5 posts an in-transit ledger entry at PIN acceptance for a personal wallet, while conventions 10.4 say Stage 1 Reserved has no ledger entry and Stage 2 In transit starts at dispatch, and WAL-08 criterion 9 posts at acceptance or dispatch. After the 10-second Undo window, when does the in-transit entry post?
  - WAL-10.2: The review shows a "provider name" while conventions 10.4 and D7 say it never appears. What is shown there?
  - WAL-10.3: `LARGE_AMOUNT_PAUSE` and `LARGE_AMOUNT_WORDS` are TBD.
  - WAL-10.4: Is the pause shown to an approver in SPD-05 for a new payee? Criterion 5 says the approver uses the PIN screen; the pause for approvers is not specified.
  - WAL-10.5: The Undo window delays dispatch for personal wallets; does the "Waiting for the provider" label appear during the undo countdown? Not specified in the story.
  - WAL-11.1: After an operator decides a Needs attention withdrawal, what does the sender see and which key (OPS-05)? Not specified in the story.
  - WAL-11.2: Does the person see the fee returned as a separate line on the Failed screen? Criterion 3 says the full total returns; the screen text names the amount only.
  - WAL-11.3: Is "Report this payment" on a Failed payout the same form as SCR-WAL-50? Presumably yes (WAL-14); not stated here.
  - WAL-11.4: A group payout's Failed outcome goes to SPD-11; which of the two stories owns the requester's screen text? Not specified in this story.
  - WAL-12.1: Do the PIN and the WAL-10 review and pause apply when a group move request is created? Criterion 2 says no PIN for personal moves; criterion 4 says the request is created through SPD-01 (which reuses the WAL-10 components) but does not state the PIN for this case.
  - WAL-12.2: The fee line is "0 Ar" because configured; if `FEE_TABLE_GEREO` is later non-zero for moves, is there a live fee line? Implied; not specified.
  - WAL-12.3: How is "reserved" shown on the source while a group move is Awaiting approval? Criterion 4 says amount shown as reserved; where is not specified.
  - WAL-12.4: A move from a group wallet into the same group's other wallet is a request (class a) yet criterion 4 also says intra-group moves do not count in "spent"; how the SPD request screen labels this is owned by SPD; not specified here.
  - WAL-13.1: Looking up a phone number and returning "does not have Gereo yet" or a display name reveals whether a number has an account (ACC stories deliberately avoid this before sign-in). Is that accepted for signed-in senders, and is lookup rate-limited? Not specified in the story.
  - WAL-13.2: R70 says no blocking; there is no screen for a recipient to refuse. Confirmed closed; no UI.
  - WAL-13.3: Which pause text applies to a first-time group destination? Criterion 3 names first-time recipient; a group wallet is not a "number". Not specified in the story.
  - WAL-13.4: The sender's SMS `msg.wal.transfer_sent.sms` is suppressed for a campaign-tagged transfer; where is the campaign tag chosen (ANN-05)? Not specified here.
  - WAL-13.5: The story says phone numbers are masked in group-visible ledgers; the recipient picker shows a partly masked number: which digits are masked? Not specified.
  - WAL-14.1: Reference format: criterion 1 says "groups of 3 or 4 characters", the open question says 8 characters in two groups of 4 ("7Q4K-82AX"), and examples show "7Q4K-82" (7 characters). Which grouping and length is final?
  - WAL-14.2: The receipt shows "provider" and criterion 1 shows a "provider reference"; conventions 10.4 say the provider name never appears. What is shown?
  - WAL-14.3: The counterparty full name is shown but "Name not available" applies for payouts (WAL-10); what does the detail show for a payout to an unknown name? Not specified.
  - WAL-14.4: "Notes marked private" appear in WAL-16, but no screen here lets a person add a note or mark it private. Where are notes created? Not specified in the story.
  - WAL-14.5: Is "Report this payment" on a group wallet transaction available to every member with Wallet: view history, or only the requester? Not specified.
  - WAL-15.1: Does "Money in X, money out Y" include Rounding, Fee and Reversal lines? Not specified in the story.
  - WAL-15.2: Is the Platform: SMS allowance type shown to members without Wallet: view history? Not specified.
  - WAL-15.3: Where does a person add a "note" that search matches? No note-entry screen is specified in this epic.
  - WAL-15.4: Is the filter sheet one sheet with all seven filters, and does it scroll? 09 section 10.3 says a sheet that needs scrolling or a second step becomes a page; seven filters likely scroll. Container choice not specified in the story.
  - WAL-16.1: "Notes marked private" are excluded, yet no story defines how a note is created or marked private. Where?
  - WAL-16.2: `EXPORT_SYNC_MAX_ROWS` and `EXPORT_LINK_TTL` are TBD.
  - WAL-16.3: Does a PIN entry for an export reuse the generic PIN prompt of SCR-ACC-30 or the money-out PIN screen of SCR-WAL-37? The story says "the PIN is asked"; the screen is not named.
  - WAL-16.4: The accounting profession's required format is open with field research (default used: plain CSV and PDF).
  - WAL-16.5: Is the number of entries confirmation a sheet or inline text? Not specified in the story.
  - WAL-17.1: The story says anything not listed is defined by XCT-04; the exact wording of the "without a connection" indicator is therefore not in this file. Not specified in the story.
  - WAL-17.2: Which freeze state and "Held by Gereo" chip are cached and shown offline? Per XCT-04; not specified here.
  - WAL-17.3: Is "Add money" also shown as `xct.offline.money_blocked` (money-in), although deposits are not money-out? Criterion 3 lists add money with money-out reasons; WAL-06 uses `xct.offline.money_blocked` for deposits as well. Consistent in the stories, but the key's name says money-out.
  - WAL-18.1: Operator screens are owned by OPS-05; this inventory lists them because the story fixes what they accept. Which story owns the frame list for SCR-WAL-64 and SCR-WAL-65? Not specified in the story.
  - WAL-18.2: The evidence required above `CORRECTION_APPROVAL_THRESHOLD` is "OPS to confirm" (OPS-05 open question).
  - WAL-18.3: The value of `CORRECTION_APPROVAL_THRESHOLD` is TBD.
  - WAL-18.4: How does a member read the "Gereo loss" shortfall booking? The story says it is the debit side; the member view of it is not specified.
  - WAL-18.5: The reason codes list (`wal.reversal.reason.<code>`) is not listed in the story beyond `withdrawal_failed` and `withdrawal_cancelled`.
  - WAL-19.1: ACC-12 criterion 6 owns notification previews; WAL-19 keeps lock-screen push amounts visible. A person hiding balances still sees amounts in push; is this disclosed anywhere on the toggle? Closed by the story; not specified whether the toggle explains it.
  - WAL-19.2: Where is the eye icon placed on a group wallet detail and does it also hide the "Your share" figure? "Every balance-type figure" implies yes; not explicit.
  - WAL-19.3: P2 priority: is the toggle needed on the first release screens already designed (WAL-02, WAL-03)? Not specified in the story.
  - WAL-20.1: GRP-06 criterion 1 and CON-17 reuse this line; the wording "to be harmonised" is flagged in the Conversation. Which wording wins if they differ? Not specified.
  - WAL-20.2: Does the line also appear on the wallet list card or only on the wallet detail? The story says "when I look at a wallet"; only the detail is specified.
  - WAL-20.3: Is "Checking..." triggered by a time window or a flag from OPS? Not specified.
