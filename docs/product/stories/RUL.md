# RUL: Wallet rules

Epic code RUL, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, statuses, IDs). Journey steps covered: 3 Set up, 4 Fund (income arrives and rules fire), 7 Follow (firing history, alerts).

Sources used in the Conversation sections. Raw reports are cited as file plus section.

| Short name | File |
| --- | --- |
| 02 personal finance | [02-personal-finance.md](../../research/raw/02-personal-finance.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption.

## Shared definitions for this epic

**What a rule is.** A wallet rule belongs to one wallet and has a trigger, an optional condition and an action. The MVP offers four templates and no blank builder (02 personal finance, Takeaways item 2; 08 competitor UX 6.5 Adopt):

| Template | Sentence | Acts on | Story |
| --- | --- | --- | --- |
| Share | When income arrives in [wallet], move [percent] to [destination wallet] | Each income | RUL-03 |
| Spending cap | When spending from [wallet] in [period] reaches [amount], alert me | Spending out of the wallet | RUL-09 |
| Goal | I want [wallet] to reach [amount] by [date] | Balance against a date | RUL-10 |
| Low-balance alert | When [wallet] falls below [amount], alert me | Balance | RUL-11 |

Only the share template moves money. The other three read the ledger and send alerts. Rules never edit or reverse past entries.

**Founder decisions that shape this epic** ([05-decisions.md](../05-decisions.md)). D3: every Confirmed credit into a wallet is income for that wallet, including a credit made by another rule, so share rules chain from wallet to wallet; cycle detection and a maximum chain depth are mandatory (RUL-06). D5: the leftover ariary of a share run is a visible Rounding line credited to Gereo, always under 1 Ar per destination, shown on the receipt and disclosed in the terms (RUL-07, ACC-13). D1 and D4 are not owned here. Group money has three authorisation classes (conventions 10.4): (a) a person-initiated outflow, never made by a rule; (b) a firing of a saved rule, pre-authorised once when a holder of Wallet: edit rules saves the rule version, never at each firing, under the chain-leaf rule of RUL-13; (c) system postings, which include the Rounding line. A rule that sends group money to a leaf outside the group is allowed only through the vote of RUL-13.

**Vocabulary.** A share rule is one line: one source wallet, one percent, one destination. A split rule is a named set of such lines (CON). The engine and the ledger work on lines; the personal builder (RUL-03) creates one line at a time and the group builder (CON-11) creates several in one save. Audit entries use the family `rule.*` for lines and `splitrule.*` for sets.

**Rule states** (the shared rule table, namespaced to the object "rule"; CON Active is the same as On here; CON Ended is a soft state that keeps history and is not the same as a deleted line):

| State | Meaning | Applies |
| --- | --- | --- |
| On | The rule runs on future income or watches the wallet; shown as Active in CON | Every template |
| Paused | Switched off by a person; resumes with one tap | Every template |
| Waiting for vote | A group change is stored but not applied; the old version stays in force (RUL-13) | A chip on a version of a share rule |
| Needs attention (rule) | The last run could not complete, or a destination is closed, held or deleted; the reason is shown. Transactions, requests and votes have their own "Needs attention" tables, so filters and queues name the object | Share rule |
| Stopped | The wallet is closed; history is kept (WAL-05) | Every template |

A deleted rule line is not a state: it leaves the list and keeps "(deleted)" after its name on past entries, and its history is reachable from the audit log only.

**Firing outcomes** (RUL-12): Moved (a share wrote entries, including "Moved after re-run" for a re-run of CON-15 or RUL-12), Alert sent (cap, goal or low-balance), Skipped (a run was due and was not done, with a reason code).

**Conventions used in this file**

- Message keys: UI `rul.<screen>.<element>`, errors `err.rul.<code>`. Notifications use the base keys already in the NTF event catalogue (`msg.rul.fired`, `msg.rul.cap_reached`, `msg.rul.low_balance`, `msg.rul.goal_reached`, `msg.rul.goal_behind`, `msg.rul.skipped`, `msg.rul.group_changed`). This epic defines no new notification key, no new SMS template and no new fallback parameter. RUL owns `msg.rul.cap_reached` and its 80 percent warning (RUL-09). The RUL rows of the catalogue use in-app and push only, so no RUL event produces SMS and `ntf.sms_window.*` is not used here; the one SMS in this area is the CON-15 failure message for a group wallet, which is the only message for a skipped group-wallet share (RUL-12 AC9). Percent and deadline formats are XCT-02 and XCT-03. All text exists in Malagasy, French and English. Wording in quotes is intent, not final copy.
- Amounts are integer ariary shown as `12 500 Ar`. Percentages in rules are whole numbers. Every number in this file is a named parameter below.
- Rule-produced ledger entries carry `rule_name`, `rule_version`, `hop` and `caused_by_entry_id`, are flagged as rule-made (for the "Made by a rule" filter and the "Why" line), and are classified Split, or Rounding for the line to Gereo, in the controlled type vocabulary shared with CON and WAL-15. Outcome: a Split line is income for its destination (decision D3; see conventions 10.1).
- A wallet balance is always the sum of its ledger entries (WAL-03). Rules read it; they never store a balance.
- On a personal wallet the person holds every wallet permission. On a group wallet, Wallet: edit rules is checked for every create, edit, pause, resume and delete (RUL-13).
- A rule applies to future income only. A change or a new rule never touches income already received (CON-13).
- Times are shown in Madagascar time (Indian/Antananarivo, UTC+3).

**Configurable parameters**

| Parameter | Meaning | Starting value or status |
| --- | --- | --- |
| `RULE_MAX_PER_WALLET` | Most rules of any kind on one wallet | 10 (five shares plus the three alert templates leave room; one wallet with more than ten rules cannot be read in one summary, 07 UI/UX 8.5) |
| `RULE_NAME_MAX` | Maximum characters in a rule name | 40 (fits one line of a ledger row at 200 percent text) |
| `SHARE_MAX_DESTINATIONS` | Most share rules, or destinations, on one wallet. Owned by RUL-03; CON uses this name and has no alias | 5 (07 UI/UX 8.1 R-G4) |
| `RULE_CHAIN_DEPTH_MAX` | Most hops in a chain of wallets that pass money on. A request-made transfer or manual move is hop 0; depth counts hops 1 up to this value. Owned by RUL-06; this row is the only place that holds the value | 3 (07 UI/UX 8.2 R-RB4) |
| `PREVIEW_INCOME_COUNT` | Recent incomes used by the live preview | 3, as in CON-12 |
| `PREVIEW_LOOKBACK` | How far back the preview looks for incomes | 90 days (about three monthly pay periods) |
| `CAP_PERIOD_OPTIONS` | Periods a spending cap may use | Week and month, the cycles groups and households use (02 personal finance). Month runs from the 1st; a pay-day start is later |
| `CAP_WARNING_PERCENT` | Share of the cap at which one early warning is sent | 80, on by default, the same level SPD-14 shows (a hypothesis, 07 UI/UX 8.2 R-RB5 [U]). A person may switch it off on their own cap |
| `GOAL_CHECK_DAY` | Day and hour of the weekly goal-behind check | The day and hour of `ntf.digest_day` (NTF), so the item lands in the digest of NTF-14 |
| `RULE_RETRY_MAX`, `RULE_RETRY_BACKOFF` | Retries for a transient failure while a rule runs | 3 retries, after 1, 5 and 15 minutes |
| `RULE_HISTORY_PAGE_SIZE` | Firings per page | Same as `HISTORY_PAGE_SIZE` (WAL), 20 |
| `RULE_HISTORY_RETENTION` | How long firing history is kept | `RECORD_RETENTION_YEARS` (ACC), 5, because a firing is part of the ledger story of an entry |

**Defaults decided here** (each closed in Open questions): income is every Confirmed credit (D3); each share is rounded down to a whole ariary and the leftover is a Rounding line to Gereo (D5); several share rules each take their percent of the whole credit, so order never changes the amounts and the MVP has no reordering.

---

## Stories

### RUL-01 See the rules on a wallet and whether they are working

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; Wallet: view balance to see rules on a group wallet (read-only), Wallet: edit rules to change them
**Tags:** offline

**Story:** As a wallet owner, I want one list of the rules on my wallet with the state of each, so that I always know what will happen to my next income.

**Conversation:** Winners in this space keep rules few, visible and explainable; a "rule fired" history must be visible (02 personal finance, Qapital, Implication; Cross-cutting, What users love item 3: automation works "only when rules are few and visible"). Users trust what they can read, so every rule is shown as a sentence, not a form (07 UI/UX 8.2 R-RB1). WAL-03 links its line "2 rules on, 1 paused" here. Group members see a rule in words as a matter of transparency (CON-11 AC7). Offline reading of rules is a stated need (02 personal finance, Takeaways item 7).

**Preconditions:** The wallet exists and the person may view it.
**Trigger:** The person taps the rules line on the wallet detail (WAL-03).

**Acceptance criteria:**
1. Happy path. The list shows one card per rule: the rule as a sentence in the person's language, a state chip (On, Paused, Waiting for vote, Needs attention, Stopped) with icon and word, the last time it fired and what it did ("Moved 20 000 Ar to Savings, yesterday"), and for alert rules the current reading ("Spent 120 000 of 200 000 Ar this month").
2. Business rule. Cards are grouped by template (Share, Spending cap, Goal, Low-balance alert). Within share rules the order is the order of creation, which is also the order of application (RUL-07). A button "Add a rule" opens RUL-02.
3. Business rule. At the top, a link "What happens when money arrives" opens the combined summary (RUL-05) and a link "Rule history" opens RUL-12.
4. Business rule. States come from the table "Rule states". "Stopped" is used for a rule on a closed wallet ("Stopped: wallet closed", WAL-05) and keeps its history. A share rule whose destination is closed or held by Gereo shows "Needs attention" with the reason, never "On".
5. Permission. A person without Wallet: edit rules on a group wallet sees the cards read-only: no Add, Edit, Pause or Delete, and one line naming the missing permission and who holds it (`rul.list.permission_needed`). A person without Wallet: view balance sees `rul.list.not_permitted`, not the rules.
6. States. Empty: one sentence on what rules do and the four template choices as buttons, no illustration-only screen. Loading: skeleton cards. Refresh failure: the cached list stays with "Could not update. Retry".
7. Offline. The list renders from the cache rules of XCT-04 with "Updated hh:mm". Changes and re-run stay online only: every action that changes a rule is disabled with `xct.offline.needs_connection`.
8. No ledger entry and no notification. Reading is not audited.
9. Accessibility and language. Each card reads as one sentence to a screen reader including its state; state is never by colour alone; sentence word order is tested at 2x text expansion in the three languages.

**Data:** Wallet rule (read), Rule firing (read, last result), Ledger entry (read, for alert readings), Membership (read).
**Depends on:** WAL-03, WAL-01, GRP-06, WAL-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a person with only Wallet: view history and not Wallet: view balance does not see the rule list, because a rule shows percents and amounts that reveal the balance; they still see the rule name and "Why" line on each entry and the firing history (RUL-12). Closed: no count of firings on the list; the last firing and the history link are enough.

---

### RUL-02 Choose one of four ready-made rules

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** audit

**Story:** As a wallet owner, I want to pick a rule from a short list of named templates, so that I can automate my money without learning a rule builder.

**Conversation:** Named, human-readable templates beat a blank builder, and four is a deliberately small set (08 competitor UX 6.5 Adopt; 02 personal finance, Takeaways item 2; competitive analysis section 7). Unlimited custom rules, "if this then that" chains and rules triggered by an outside service are not in the MVP (08 competitor UX 6.5 Avoid; 02 personal finance, Risks, "Rules complexity and bad surprises"). Unverified people can still budget with rules on small amounts, because rules do not need identity checks unless money-in or out is involved (02 personal finance, Cross-cutting, KYC friction; ACC-07).

**Preconditions:** The wallet is open and the person holds the permission.
**Trigger:** The person taps "Add a rule" (RUL-01).

**Acceptance criteria:**
1. Happy path. The screen shows exactly four choices, each with icon, a name, and one plain sentence of what it does and whether it moves money: "Share each income" (moves money), "Spending cap" (alert only), "Goal with a date" (alert only), "Low-balance alert" (alert only). Keys `rul.template.*`.
2. Business rule. No blank builder, no fifth template and no custom code exist. A template not offered cannot be created through any other screen or request.
3. Business rule. A wallet may hold several rules. Duplicates are checked per template: a second spending cap for the same period, a second goal on the same wallet (the goal is one shared record, WAL-04) and a second low-balance rule are blocked with `err.rul.already_exists` and a link to edit the existing one. Several share rules are allowed up to `SHARE_MAX_DESTINATIONS`, after which the Share choice is disabled with `rul.template.share_limit_reached`.
4. Business rule. At `RULE_MAX_PER_WALLET` all choices are disabled and `rul.template.limit_reached` says why.
5. Business rule. The type of the wallet pre-selects a template (a savings wallet highlights Goal, a budget wallet highlights Spending cap) but never hides or reorders the others; the four stay in the same order for everyone.
6. Business rule, group wallet. Without Wallet: edit rules the screen is not reachable and the person sees the missing permission named (`err.wal.permission_missing`). Saving a share rule on a group wallet that needs a vote follows RUL-13.
7. Business rule. An internal-only rule needs Tier 1; a rule whose destination leaves the group's wallets or reaches another owner needs the money-out tier for its per-firing maximum (ACC-07).
8. States. Loading: skeleton buttons. Offline: the screen opens but each choice is disabled with `xct.offline.needs_connection`; no rule is queued from the phone.
9. Audit. Only the later save writes `rule.created` (RUL-03, RUL-09, RUL-10, RUL-11). Browsing templates writes nothing.

**Data:** Wallet rule (read, for duplicates), Wallet (read), Permission (read).
**Depends on:** RUL-01, WAL-01, ACC-07, GRP-08, RUL-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `RULE_MAX_PER_WALLET` is 10 (shared definitions). Closed: the wallet-type suggestion stays as a highlight only (AC5); to be watched in the paper test, no decision waits on it. Closed: a template added after the MVP is available to every wallet; a group switch for it is a later question, not an MVP one.

---

### RUL-03 Build a share rule as one sentence

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (own wallet); Permission holder with Wallet: edit rules for a group wallet through CON-11
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** ledger, audit

**Story:** As a wallet owner, I want to say "when income arrives in this wallet, move this percent to that wallet" by filling three slots in a sentence, so that part of every income is set aside without me doing it.

**Conversation:** The three-slot sentence "When [trigger] arrives in [wallet], move [percent] to [destination]" is the recommended builder shape (07 UI/UX 8.2 R-RB1). Automatic percentage allocation of every income is the differentiator: YNAB, Goodbudget and Monzo users do it by hand each pay period, and Qapital and Chime offer only fixed or round-up rules (02 personal finance, Gaps competitors leave item 1; Table stakes list, "Percentage-based auto-allocation"; 08 competitor UX 6.5 Open opportunities). The sum of percentages may be below 100 and the rest stays in the wallet. For a group wallet the same rule is defined in CON-11 and this story does not repeat its group parts: the group sentence, the destinations in the group, the vote gate and the audit entry `splitrule.created` are in CON-11 to CON-13. This story defines the personal-wallet builder and the shared validation.

**Preconditions:** The person chose "Share each income" (RUL-02). At least one other open wallet exists that can be a destination.
**Trigger:** The person opens the share builder.

**Acceptance criteria:**
1. Happy path. The screen is one sentence with three tappable slots: the source wallet (fixed to this wallet), the percent (numeric keypad, whole numbers) and the destination wallet (picker of open wallets). The person may name the rule in short text (at most `RULE_NAME_MAX`); a default name is proposed ("Share income"). Below the sentence sit the live preview (RUL-04) and the button "Save rule".
2. Business rule, percent. Each share is a whole number from 1 to 100. The total of all share rules on the wallet that are On, Paused or Waiting for vote, including this one, must be at most 100, so resuming a rule never breaks the limit. Above it, Save is blocked and the message names the excess ("Together your rules take 120 percent. Lower one by 20", `err.rul.percent_over_100`).
3. Business rule, remainder. When the total is below 100, a line states "The other [N] percent stays in [wallet]". This is a normal, valid state and needs no confirmation.
4. Business rule, destinations. The destination must be an open wallet the person can receive into, different from the source. For personal rules the destination is another wallet of the same owner; for a group wallet it is another wallet of the same group (CON-11 AC5). A group wallet, a personal wallet of someone else or another Gereo user is not offered as a destination of a personal rule, and a group rule never offers a member's personal wallet in this builder: any destination outside the group is handled only by the chain-leaf rule of RUL-13. This story owns `SHARE_MAX_DESTINATIONS`: the number of share rules on a wallet is limited to it.
5. Business rule, loop and depth. The builder blocks any choice that would create a cycle or a chain longer than `RULE_CHAIN_DEPTH_MAX`, using RUL-06, taking into account what the destination wallet already passes on (decision D3). A choice that cannot be saved is shown inline with the reason, never only after Save.
6. Business rule, rounding and effect. The sentence area states in words how rounding works (RUL-07 AC3: each destination gets its percent rounded down, and the leftover ariary, under 1 Ar per destination, goes to Gereo as a Rounding line, decision D5) and says "Applies to income that arrives after you save. Past income is not touched." (`rul.share.future_only`). The first time a person saves a share rule, the rounding line links to the terms (ACC-13).
7. Business rule. Saving does not move money, so no confirmation sheet is needed beyond the restated sentence on the Save button ("Save: 20 percent of each income to Savings"). If an active destination is later closed, RUL-12 explains skipped runs.
8. States. Saving shows progress; a double tap creates one rule (idempotency key). A failure creates nothing and keeps the typed values. Offline: Save is disabled with `xct.offline.needs_connection`.
9. Ledger and audit. No ledger entry at save time. Audit entry `rule.created` with wallet, template, values, rule version 1, actor, time. For a group wallet the entry is `splitrule.created` as in CON-11.
10. Accessibility and language. Sliders are not the only input; every slot is reachable by keyboard and screen reader and read as part of one sentence. The same slot order is kept in Malagasy, French and English where grammar allows.

**Data:** Wallet rule (write, version 1), Wallet (read), Audit entry (write).
**Depends on:** RUL-02, RUL-04, RUL-06, RUL-07, RUL-13, WAL-01, WAL-12, CON-11 (group version), GRP-15, ACC-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: whole percents only, the same as CON-11; decimals add reading effort and rounding lines for no stated need. Closed: a personal rule never sends to a group wallet or to another Gereo user; a person who wants that uses WAL-13, which asks for the PIN and the recipient check on every send, and a rule would skip both. Closed: no fixed-amount share in the MVP (percent only, 02 personal finance Takeaways item 2).

---

### RUL-04 See what a rule would have done with my real recent incomes

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules and Wallet: view history for a group wallet
**Tags:** ledger, offline

**Story:** When I am about to save or change a share rule, I want to see how it would have split my last incomes, so I can trust it before it touches real money.

**Conversation:** Preview before enabling is an open opportunity no competitor documents (08 competitor UX 6.5 Open opportunities [U]; 02 personal finance, Risks, "Preview 'what would happen' before enabling a rule"). A live preview from real history is the strongest anti-error device for non-expert builders (07 UI/UX 8.2 R-RB2, R-RB3; Expandable Grid study in section 8.5). For group wallets the preview is CON-12; this story is the same behaviour on personal wallets and the two must give identical results. A preview writes nothing and moves nothing.

**Preconditions:** A draft or changed share rule is open in the builder.
**Trigger:** The person types or changes any slot, or taps "Preview".

**Acceptance criteria:**
1. Happy path. Under the sentence a preview shows the last up to `PREVIEW_INCOME_COUNT` incomes found within `PREVIEW_LOOKBACK` on this wallet, using the rule on income as defined in RUL-07. Each line reads "Salary 400 000 Ar on 5 Oct: 80 000 Ar would go to Savings, 320 000 Ar would stay" (key `rul.preview.line`). It updates as the person types.
2. Business rule. The preview applies the same rounding as the engine (RUL-07 AC3; see conventions 10.2) and always adds up: destination amounts plus the Rounding line to Gereo plus what stays equals the income to the ariary. A Rounding line above 0 is shown as one aggregated row named as going to Gereo; at 0 no row is shown.
3. Business rule. Existing On rules on the wallet are included, so the line shows the effect of all of them together with the draft (the same data as RUL-05). A paused rule is shown as "paused, not counted". When a destination passes money on, the preview shows what that destination would then do with its share, down to `RULE_CHAIN_DEPTH_MAX` hops, as CON-12 AC6 does.
4. Business rule. If a share would round to 0 Ar the line says "0 Ar, no entry would be made for it".
5. Business rule. The preview states "Preview only. No money was moved." and shows no provider fee, because moves between wallets are free (WAL-12).
6. States. With no past income, the preview asks the person to type a sample amount and says so. The person can always type a sample amount instead of or beside real incomes. Loading: skeleton lines. A failed load keeps the sample mode working.
7. Business rule, group wallet. Without Wallet: view history the person sees only the sample-amount mode with the missing permission named, as in CON-12 AC5.
8. Offline. The preview works from the cached history of XCT-04 with "Updated hh:mm"; Save stays disabled.
9. Privacy. Counterparty numbers are masked as in the ledger. A preview writes no audit entry and no ledger entry.

**Data:** Ledger entry (read), Wallet rule (read, draft), Wallet (read).
**Depends on:** RUL-03, RUL-07, RUL-06, WAL-15, CON-12 (group version).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `PREVIEW_INCOME_COUNT` is 3 and `PREVIEW_LOOKBACK` is 90 days (shared definitions). Closed: a person with no history is shown no invented incomes, only a typed sample, because invented numbers could be read as real money.

---

### RUL-05 See everything that happens when money arrives, in one place

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; Wallet: view balance for a group wallet
**Tags:** offline

**Story:** When I have several rules on a wallet, I want one summary of what happens to a new income, in order, with the total and what stays, so I am never surprised by where my money went.

**Conversation:** Effective-result views beat rule lists: in the Expandable Grid study people read outcomes correctly 83.6 percent of the time against 56.5 percent for lists (07 UI/UX 8.2 R-RB3 and section 8.5). The summary is also the only place that shows the sum and the remainder, which is what makes a total under 100 safe (CON-11 AC3 key `con.split.summary`). Monzo's budget view breaks when money sits in pots (02 personal finance, Gaps item 3), so Gereo shows the whole effect in one place. On group wallets this is the same summary that CON-11 describes and the screen is shared.

**Preconditions:** The wallet has at least one rule.
**Trigger:** The person opens "What happens when money arrives" from RUL-01, from the builder, or after saving a change.

**Acceptance criteria:**
1. Happy path. The summary reads as a short ordered list: "When income arrives in Main: 1. 20 percent to Savings. 2. 10 percent to School fees. The other 70 percent stays in Main." It then lists the alerts that watch the wallet (spending cap, goal, low-balance alert) under "Alerts".
2. Business rule. The summary shows the total of share percentages and the remainder in words, for example "Total moved: 30 percent. Stays: 70 percent". A total of exactly 100 shows "Nothing stays in Main".
3. Business rule. It shows every state of the table "Rule states": a Paused rule is listed as "Paused, not applied", a rule waiting for a vote as "Waiting for vote, not applied", a rule that needs attention with its reason, a stopped rule as "Stopped".
4. Business rule. A worked example uses the wallet's last income when one exists, or a typed amount, shown with the same rounding as the engine ("With 100 000 Ar: 20 000 to Savings, 10 000 to School fees, 70 000 stay"). When the rounding leaves an amount, the example adds the line "1 Ar rounding goes to Gereo".
5. Business rule. The order shown is the order of creation, which is the order of application (RUL-07). There are no up and down buttons in the MVP, because each share takes its percent of the whole income and the order changes no amount; the order only decides the order of ledger lines.
6. Business rule, chains. Because money a rule sends is income for the destination (decision D3), the summary follows every destination that passes money on, up to `RULE_CHAIN_DEPTH_MAX` hops, and shows the full path in words ("20 percent to Savings, which sends 50 percent of that to School fees"). It never shows a path that RUL-06 blocks.
7. States. Loading: skeleton. Offline: readable from the XCT-04 summary cache with "Updated hh:mm". A person without Wallet: view balance on a group wallet sees `rul.summary.not_permitted`.
8. Notifications. None.
9. Accessibility and language. The list is a real ordered list for screen readers; amounts never clip at 200 percent font scale; the sentence works in the three languages.

**Data:** Wallet rule (read), Ledger entry (read, last income), Wallet (read).
**Depends on:** RUL-01, RUL-03, RUL-07, CON-11, CON-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: reordering does not exist in the MVP (AC5). Closed: the summary never shows chains across owners, because a rule can only send inside the same owner or group (RUL-03 AC4).

---

### RUL-06 Stop a rule that would send money in a circle

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** audit

**Story:** As a wallet owner, I want Gereo to refuse a rule that would send money round in a circle and to tell me in plain words why, so that my money never loops.

**Conversation:** Loop prevention in allocation cascades and a cap on rule chains are required safeguards (07 UI/UX 8.2 R-RB4; 02 personal finance, Risks, "cap rule chains; loop prevention in allocation cascades"; 08 competitor UX 6.5 Open opportunities). People who build rules are not experts, so the message must name the wallets in the loop, not say "cycle detected" (design foundations section 3, plain language). CON-11 AC4 and CON-14 AC4 apply the same rule to group wallets; the check is shared.

**Preconditions:** A person is saving, resuming or changing a share rule.
**Trigger:** Save, Resume, or an edit of a destination or percent.

**Acceptance criteria:**
1. Happy path. Before the rule is saved, resumed or edited, the system follows all active share rules from the destination and checks whether the source wallet can be reached again. If it can, Save is blocked and the screen explains with the path in words: "This would send money in a circle: Main sends 20 percent to Savings, Savings sends 10 percent to Main. Change one of them." (`err.rul.cycle`, with the wallet names as parameters).
2. Business rule. A rule that sends to its own wallet is blocked with `err.rul.same_wallet`.
3. Business rule, depth. Hops are counted as in the `RULE_CHAIN_DEPTH_MAX` row of the shared definitions: Main to Savings is hop 1, Savings to School fees is hop 2. This story owns the parameter and the save-time check. A chain longer than `RULE_CHAIN_DEPTH_MAX` hops, counting every wallet the new rule would add above and below it, is blocked with `err.rul.chain_too_long` naming the limit and the longest path. The check also runs when a rule is saved on a wallet that already receives money from others, so a new rule cannot lengthen an existing chain past the limit.
4. Business rule. The check counts rules that are On, Paused and Waiting for vote, so resuming a paused rule can never create a loop that the person did not see. The check uses the current state of all rules on all wallets the person owns, and for a group on all wallets of that group.
5. Business rule, run time. Both checks are repeated when the engine runs each hop (RUL-07 AC5). If a loop or an over-long chain appears later, for example because another person changed a rule on a wallet the first person does not control, the engine skips the affected hop with the reason `cycle_prevented` or `chain_too_long`, writes nothing for it, and the money stays in the wallet where the hop would have run (RUL-12).
6. Business rule, no switch-off. Money made by a rule is income for its destination (decision D3), so the save-time check, the run-time check and the depth limit are mandatory: no setting, role or operator action turns any of them off. Each rule-made entry carries its hop number, so a chain can be read hop by hop in the ledger and a test can assert that no entry has a hop number above `RULE_CHAIN_DEPTH_MAX`.
7. Business rule. The message never reveals wallets the person is not allowed to see: it names them as "a wallet of [group name]" when the person lacks Wallet: view balance there.
8. States. The message appears inline next to the offending slot, with focus moved to it and also in the error summary at the top. Offline: the check runs on cached rules for guidance only; Save is disabled anyway.
9. Notifications and audit. A blocked save writes no audit entry and sends nothing. A hop skipped for `cycle_prevented` or `chain_too_long` notifies as in RUL-12 AC9 (`msg.rul.skipped` on a personal wallet, `msg.con.split_failed` on a group wallet) and writes an audit entry `rule.skipped` with the path.
10. Business rule, deleted wallet (ACC-15). When a user whose wallet is being deleted is the target of a foreign rule, or a chain passes through that wallet, the system pauses each affected rule (state Needs attention with reason `destination_deleted`, no firing until a person acts) and notifies the owner of that rule as in RUL-12 AC9; no money is lost because the hop is skipped and the money stays in the source wallet. Test: a 2-hop chain where a third party owns hop 1; deleting the wallet at the end of hop 1 pauses the hop 1 rule, notifies the third party, and leaves hop 0 running.

**Data:** Wallet rule (read, all linked rules), Audit entry (write on skipped run).
**Depends on:** RUL-03, RUL-07, RUL-12, CON-11, CON-14, GRP-15, ACC-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the value of `RULE_CHAIN_DEPTH_MAX` is set once, in the shared definitions table. Closed: names of wallets in a loop message follow AC7: a wallet the person cannot see is named only as "a wallet of [group name]". Because rules only send inside one owner or group (RUL-03 AC4), no wallet of an unrelated person can ever appear.

---

### RUL-07 Apply my rules automatically when income arrives

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (rule authorised at definition time, class (b) of conventions 10.4)
**Tags:** ledger, audit

**Story:** When income is confirmed in a wallet, I want every active share rule to run at once, under its own name, and the wallets that receive a share to run their own rules in turn, so that I never have to move money by hand and I can see exactly what happened.

**Conversation:** Automatic application on every income, with loop prevention and each firing logged, is Gereo's stated differentiator and Monzo staff described full automation as "planned for later" (08 competitor UX 6.5 Open opportunities; 02 personal finance, Gaps item 1). Manual sorting is forgotten or runs after fixed payments leave (08 competitor UX 6.5 Avoid). Money must move only on Confirmed, never on Pending, because provider callbacks can double-notify (WAL-07; CON-14 AC8). Group split execution is CON-14: this story defines the shared engine that runs both personal rules and group split rules, and CON-14 stays the reference for group-only behaviour (timing "At a set time", vote-gated versions, members' view). Decision D3 settles what counts as income: every Confirmed credit, whatever its source, so nobody tags deposits by hand and rules chain. Decision D5 settles the leftover ariary: it goes to Gereo as a visible Rounding line.

**Preconditions:** An active rule version exists on the wallet. An income reaches Confirmed after that version's effective time.
**Trigger:** The "money posted to a wallet" event that WAL-07 owns and emits for any Confirmed credit into the wallet, including a move or transfer received, a contribution or late fee paid in (CON-04), or another rule's Split line (a chain hop). This story consumes that event.

**Acceptance criteria:**
1. Happy path, income (decision D3). Every Confirmed credit into a wallet triggers that wallet's On share rules, whatever its source and whatever its ledger chip; a Split line made by another rule is such a credit (see conventions 10.1). Test: a deposit, a move between own wallets, a transfer received, a contribution and a Split line each fire the destination's rules. Not income: a reversal or refund entry (WAL-11, WAL-18), a Fee line, a Rounding line, and any entry that is not Confirmed.
2. Business rule, calculation and order. For each On share rule the engine computes the rule's percent of the whole credit, not of what is left after earlier rules, in the order of creation. The total of percentages is at most 100 at save time (RUL-03) and is checked again at run time; if it exceeds 100 at run time, the whole run is skipped with reason `percent_over_100` and nothing is written. Because each share takes its percent of the whole credit, the order changes no amount; it decides only the order of the ledger lines and which skipped rule is reported first. The credit is the amount actually credited to the wallet, so a provider fee, which is its own Fee line, is never taken off before the percent.
3. Business rule, rounding (decision D5; formula in conventions 10.2). Outcome: destination amounts plus the Rounding line to Gereo plus the kept amount equal the credit exactly; the Rounding line is under 1 Ar per destination line (under N Ar for N destinations), is written only when above 0, and shows as one aggregated row per original income on the receipt (per-hop lines in the export only, none in SMS receipts). This is the single test vector: credit 10 Ar, lines of 33, 33 and 34 percent: destinations get 3, 3 and 3, Gereo gets 1, nothing stays.
4. Business rule, one posting per hop, skips. All entries of one credit at one wallet are written in one atomic posting with the credit reference: one balanced entry from the wallet to each destination, classified Split and named with the rule name, version and hop number (key `rul.ledger.share_line`, for example "20 percent to Savings by rule Share income"), plus the Rounding line. Either every line is written or none. Only an unreachable destination skips its own line; a ledger error fails the whole run, never a partial posting. A destination that cannot receive (closed, or held by an operator for compliance) makes only its own share Skipped with the reason `destination_closed` or `destination_held` while other shares go ahead; the money for the skipped share stays in the wallet (RUL-12). A firing that would exceed the destination's balance cap or single-deposit limit (OPS-11, including D3 chains and splits) is held in the source wallet with a visible reason and retried under `RULE_RETRY_MAX`, never a silent failure; the tier rule is in ACC-07. A person-initiated move is class (a), a firing of a saved rule is class (b) (conventions 10.4). A wallet freeze (SPD-15) pauses firings whose destination is outside the group (reason `wallet_frozen`); internal firings and the Rounding line continue. A wallet held by an operator does not run its rules (reason `wallet_held`), as CON-14. Reserves (campaign, set aside) are unavailable to firings.
5. Business rule, chains (decision D3), cycles and depth. This story is the sole owner of cycle detection and the maximum chain depth; other files write "see RUL-07 criterion 5". Each Split line is a Confirmed credit into its destination and runs that wallet's own On rules by this same story, one hop deeper, up to `RULE_CHAIN_DEPTH_MAX` hops (hop 0 is the request-made transfer or manual move; the parameter is owned by RUL-06). Each hop is its own atomic posting with its own idempotency key. If a later hop fails, earlier hops stay done and the money waits in the wallet where the failed hop would have run (CON-15). The cycle and depth checks of RUL-06 are repeated before each hop; a hop that fails them is skipped with `cycle_prevented` or `chain_too_long` and writes nothing. Every entry written by a rule carries `rule_name`, `rule_version`, `hop` and `caused_by_entry_id`.
6. Business rule, idempotency. One run per credit, rule version and destination, enforced by a key built from the credit ID, the rule version and the destination. A duplicate callback, a retry or a replay writes nothing more. A transient failure is retried up to `RULE_RETRY_MAX` with `RULE_RETRY_BACKOFF`; a permanent one waits for a person (CON-15, and the "Run again" of RUL-12 for personal wallets).
7. Business rule, future only. A rule version applies only to credits Confirmed after its effective time. Credits received while a rule was paused or before it existed are never split later, even when the rule is resumed.
8. Business rule, after the run. Once the postings of a wallet are done, the engine re-reads that wallet and checks its alert rules (spending cap, goal, low-balance) on the new balance (RUL-09, RUL-10, RUL-11); this applies to every wallet in a chain. A failure in a rule never rolls back the credit (WAL-07 AC8).
9. Ledger and audit. Every run, including skipped ones, writes a firing record (RUL-12) and an audit entry `rule.fired` with credit reference, rule version, hop, entries written, actor System, time. The credit entry, the destination entries, the Rounding line and the firing record share one reference ID per hop.
10. Notifications. A fired share sends `msg.rul.fired` as an in-app item to the wallet owner and, for group wallets, to members with Wallet: view history, batched under NTF-08 so a busy day makes one summary. No push and no SMS for a normal firing.
11. Business rule, campaign wallet. A campaign wallet (ANN-04) cannot be the source of an outgoing rule. The check runs when a rule is saved (refused while the campaign is Open or Refunding, `err.rul.campaign_source`) and when a wallet becomes a campaign wallet (an existing outgoing rule from it is refused or suspended with a visible reason, state Needs attention). Tests: one for the save trigger, one for the wallet-becomes-campaign trigger.

**Data:** Transaction (read), Wallet rule (read), Ledger entry (write), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** WAL-06, WAL-07, WAL-11, WAL-18, RUL-03, RUL-06, RUL-12, RUL-09, RUL-10, RUL-11, CON-04, CON-14, CON-15, NTF-08, ACC-13, SPD-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: every Confirmed credit is income, so nobody tags deposits and there is no per-wallet choice; contributions and late fees are such credits (decision D3; CON-09, CON-14 AC1). Closed: round down per destination, the leftover goes to Gereo as a Rounding line, not largest-remainder and not back to the wallet (decision D5; CON-14). Closed: provider fees are never taken off a credit before the percent, because the fee is its own line and the wallet is credited the net amount (CON-14 AC1; reconciliation line CON-17). Closed: when a credit is reversed (WAL-18), the rule entries reverse down the chain, last hop first, with a reason, and the Rounding line reverses too; a downstream wallet that no longer holds the money is Needs attention for operators (CON-14 AC8, OPS-05). Closed: the Rounding line exists, under 1 Ar per destination, and is disclosed in ACC-13.

---

### RUL-08 Pause, resume, edit or delete a rule, for future income only

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** audit, ledger

**Story:** As a wallet owner, I want to switch a rule off for a while, change it or delete it, knowing it never touches money already moved, so that I stay in control and history stays true.

**Conversation:** A modified rule applies only to future income and history is never rewritten. A one-tap pause is a recommended safeguard (07 UI/UX 8.2 R-RB7). Rules must be explainable and reversible and the firing history must stay visible (02 personal finance, Qapital, Implication). Pause, edit and delete are reversible or non-destructive for money, so they need no confirmation sheet, except delete which removes a rule people may rely on (07 UI/UX 2.4 R-C1, R-C5). The group version, with its vote gate, is CON-13; this story is the same behaviour for every template and every wallet and defers to CON-13 for the vote.

**Preconditions:** The rule exists and the person holds the permission. The wallet is open (WAL-05 stops rules on a closed one).
**Trigger:** The person taps Pause, Resume, Edit or Delete on a rule.
**Acceptance criteria:**
1. Happy path, pause and resume. One tap on Pause sets the rule to Paused and shows the chip on the card and on the wallet card ("Rules paused", WAL-02). Resume sets it back to On. Both apply at once.
2. Business rule, future only. Pause and resume take effect for incomes confirmed after the moment of the change. Income that arrived while paused is never split when the rule resumes. The screen says so in one sentence (`rul.edit.future_only`) with the effective time ("Applies to income after 14:05").
3. Business rule, edit. Each save creates a new rule version and shows the effective time. Income already received keeps the version in force when it arrived. Past ledger entries and firings keep the rule name and version that made them. A renamed rule shows the new name on the card and the name at the time on past entries.
4. Business rule, checks on save and resume. An edit and a Resume run the same checks as creation: percent total (RUL-03), loop and chain depth (RUL-06), duplicates (RUL-02), and, for a changed share, a required preview (RUL-04) that compares old and new outcome on the same sample. A Resume blocked by RUL-06 stays Paused and names the path.
5. Business rule, delete. Delete asks one confirmation that restates the rule ("Delete 'Share income'? Past entries stay and keep this name"). A deleted rule line stops at once, keeps its history and its name on past entries with "(deleted)" (WAL-14 AC3). It can be recreated but not restored. Deleting a line is not the same as CON Ended: it is recorded in the `rule.*` audit family and its history is reachable from the audit log only.
6. Business rule, goal. Deleting a goal rule removes the goal from the wallet after the person agrees, because the goal and the rule are one record (WAL-04 AC3). Editing the goal here is the same as editing it in WAL-04.
7. Business rule, group wallet. Without Wallet: edit rules no action button is shown. On a group wallet, creating an Active share rule, changing its percent or destination, and adding a rule to a wallet that already has Active rules always go through the decision gate (conventions 10.5b; RUL-13), and the old version stays active until it passes. No setting turns the gate off. Pause, resume and end stay one tap and are never gated, as in CON-13.
8. Concurrency. If another person saved first, the person sees "Changed by [name] at hh:mm. Review" with both versions and chooses; nothing is overwritten silently (WAL-04 AC6).
9. States and audit. Offline: all actions disabled with `xct.offline.needs_connection`. Failure keeps typed values and says nothing changed. Audit entries `rule.paused`, `rule.resumed`, `rule.edited` (before and after values, version numbers), `rule.deleted` for lines (`splitrule.*` for sets, CON-11 to CON-13), each with actor and time. No ledger entry is written by any of these actions.

**Data:** Wallet rule (write, version), Audit entry (write), Vote (link, group).
**Depends on:** RUL-01, RUL-03, RUL-04, RUL-06, RUL-13, WAL-04, WAL-05, WAL-14, CON-13, VOT-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: pause needs no vote on a group wallet, because a pause only stops money moving and is undone with one tap (CON-13). Closed: a deleted rule cannot be restored; it is recreated, and its history stays under the old name (AC5), which keeps the version history simple. Closed: a long-paused rule asks nothing; it stays visible as Paused on the card and in the summary.

---

### RUL-09 Set a spending cap and be alerted when it is reached

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet (rule and goal edits stay on this permission, which is in the money-out class); the cap mode of a group wallet is a spending-policy item under Group: set spending policy (SPD-14)
**Tags:** ledger, audit, offline

**Story:** As a wallet owner, I want to set how much I plan to spend from a wallet in a period and be told when I reach it, so that I can slow down before the money is gone.

**Conversation:** A spending cap with alerts is one of the four launch templates (02 personal finance, Takeaways item 2) and is the part of envelope budgeting users love: "what is safe to spend" (02 personal finance, Cross-cutting item 1; WAL-03 AC4 reads the cap to compute Safe to spend). The review sheet of WAL-10 warns that a payment will pass the cap but does not block it (WAL-10 AC1), so the cap here is a plan and an alert, not a lock. Monzo's budget view mismatches when money sits in pots (02 personal finance, Gaps item 3), so only spending out of this wallet counts. Notification is `msg.rul.cap_reached` (EV-RUL-02, in-app and push, no SMS).

**Preconditions:** The wallet is open. No spending cap for the same period exists (RUL-02).
**Trigger:** The person chooses "Spending cap" and saves; the System later sees spending reach the cap.

**Acceptance criteria:**
1. Happy path. The sentence reads "When spending from [wallet] in [period] reaches [amount], alert me". Period is chosen from `CAP_PERIOD_OPTIONS`; amount is a whole number of at least 1 Ar on a numeric keypad. The card then shows "Spent 120 000 of 200 000 Ar this month" with a bar and the numbers, never a bar alone.
2. Business rule, what counts. Spent is Confirmed money-out only: payments to another person or group (WAL-13) and group payouts (SPD-10, chip Expense). It excludes Cash-out (withdrawals to mobile money, WAL-11; a person's own cash-out is not spending for caps), manual moves between the owner's own wallets (WAL-12 AC5; manual moves are not spending), rule-made Split and Rounding lines, fees counted under the payment they belong to, and Failed or Cancelled items. A reversal reduces the spent total (WAL-18). Amounts reserved for approved but unpaid requests are not counted here; SPD-14 adds them in its own "spent or promised" line.
3. Business rule, period. The period start and end are in Madagascar time and shown on the card ("This month, resets 1 Nov"). On reset the counter starts at zero and the alert can fire again.
4. Business rule, alert. When the spent total first reaches or passes the cap in a period, the system sends `msg.rul.cap_reached` once for that period, in-app and push, to the wallet owner and, for a group wallet, to holders of Wallet: edit rules. At `CAP_WARNING_PERCENT` one earlier warning is sent, also once per period, with the same message family and the figures. The alert itself blocks no payment. This story owns `msg.rul.cap_reached` and the 80 percent warning. SPD-14 sends no second message for the same crossing: `msg.spd.cap_blocked` is suppressed when `msg.rul.cap_reached` was raised for the same request within the batch window. Percent and deadline formats follow XCT-02 and XCT-03.
5. Business rule, effect on other screens. While the cap is active, "Safe to spend" on the wallet is the lower of (Available minus reserved minus campaign reserves) and the cap left (WAL-03 AC4), and the review sheet of WAL-10 adds the line that a payment passes the cap. The personal cap is warn-only and has no mode field: it never stops a payment. On a group wallet the setting `spend_cap_mode` is owned by SPD-14 and set under Group: set spending policy; that enforcement belongs to SPD-14, and this story only holds the cap value and the alert.
6. Business rule, cap raised. If the person raises the cap after it was reached, the alert may fire again only when the new cap is reached.
7. States. Reading the counter works offline from the XCT-04 cache with "Updated hh:mm". Saving and editing need a connection. Loading: skeleton. A failed counter refresh keeps the last number with "Not updated since [time]".
8. Audit. `rule.created` and `rule.edited` as in RUL-03 and RUL-08. Each alert is a firing record (RUL-12) with the spent total and the cap at that time. No ledger entry is written, because the rule only reads.
9. Accessibility and language. The alert text includes both numbers and the period ("You have spent 200 000 of your 200 000 Ar cap this month"). It does not blame or shame and has no exclamation marks.

**Data:** Wallet rule (write), Ledger entry (read, spending), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-08, RUL-12, WAL-03, WAL-10, WAL-11, WAL-12, WAL-13, WAL-18, SPD-10, SPD-14, NTF-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: periods are week and month and a month starts on the 1st (`CAP_PERIOD_OPTIONS`); a pay-day start is a later question because it needs field research on pay cycles. Closed: the early warning is on at 80 percent (`CAP_WARNING_PERCENT`), the same as SPD-14. Closed: no cap per category or per member in the MVP. Closed: rule-made Split and Rounding lines do not count as spending, because the money has not left the owner or the group (the Rounding line is under 1 Ar per destination).

---

### RUL-10 Set a goal with a target date and follow it

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** audit, offline

**Story:** As a wallet owner, I want to say how much I want in a wallet and by when, and be told if I am on track, behind, or done, so that I save toward something real.

**Conversation:** Goals with a target and progress are table stakes (02 personal finance, Takeaways item 1 and Table stakes, "Savings goals with target and progress"). The goal is one record shared with the wallet form (WAL-01 AC3) and the edit screen (WAL-04), so editing it in any of the three changes the same data. Progress is shown as numbers plus a bar, never a bar alone (07 UI/UX R-M12; WAL-03 AC3). Reached and behind-schedule alerts are catalogue events EV-RUL-04 and EV-RUL-05; the behind-schedule one is Low class, in-app and digest only. A wallet makes no promise of interest or yield (WAL-01 conversation).

**Preconditions:** The wallet is open. It has no goal, or the person edits the existing one.
**Trigger:** The person chooses "Goal with a date", or opens the goal from the wallet.

**Acceptance criteria:**
1. Happy path. The sentence reads "I want [wallet] to reach [amount] by [date]". Amount is a whole number of at least 1 Ar; date must be in the future and is shown with the Madagascar time zone. Saving shows the goal on the wallet card and detail (WAL-02, WAL-03): `7 500 / 10 000 Ar`, a bar, the percent, the amount left and the date.
2. Business rule, one goal. A wallet has at most one goal. It is the same record whether created at wallet creation, in WAL-04 or here. Editing it creates a new version and keeps history.
3. Business rule, progress. Progress counts the wallet's Available balance toward the goal (WAL-03 AC3). The screen also shows the average amount still needed per week until the date, computed from the numbers, as plain information and not as a promise.
4. Business rule, reached. When Available first reaches or passes the amount, the system sends `msg.rul.goal_reached` once (in-app and push, to the wallet owner and, on a group wallet, to every member with Wallet: view balance), shows the chip "Goal reached" and keeps the goal on the wallet. If the balance falls below and rises again, the alert is not repeated unless the person raised the goal.
5. Business rule, behind schedule. At `GOAL_CHECK_DAY`, if the balance is behind the straight-line pace toward the date, the system sends `msg.rul.goal_behind` as a Low item (in-app and digest, no push, no SMS) to the wallet owner and, on a group wallet, to holders of Wallet: edit rules, who can act on it. Behind means below the linear target for that day; the rule is stated in one sentence in the detail ("You planned 10 000 Ar by 31 Dec").
6. Business rule, date passed. After the target date without reaching the amount, the goal shows "Target date passed" and the person can extend the date or change the amount; no money moves and no fee or penalty applies.
7. Business rule, removal. Removing the goal (here or in WAL-04) asks the person to agree, ends the goal's alerts and keeps past progress in history.
8. States. Empty: wallet without a goal shows "Set a goal". Offline: progress reads from the XCT-04 cache with "Updated hh:mm"; saving is disabled. A failed refresh keeps the last figures.
9. Audit. `rule.created` or `rule.edited` with amount, date, version, actor, time; each alert is a firing record (RUL-12). No ledger entry, because the goal only reads.
10. Accessibility and language. The bar has a text alternative with the numbers; dates are written in words in the person's language; nothing is shown by colour alone.

**Data:** Wallet rule (goal, write), Wallet (read), Ledger entry (read, balance), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-08, RUL-12, WAL-01, WAL-03, WAL-07, NTF-04, NTF-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: on a group wallet, goal reached goes to every member with Wallet: view balance (a shared success, as the catalogue says) and goal behind goes to holders of Wallet: edit rules only; the NTF catalogue row EV-RUL-05 must add them. Closed: a goal does not protect the amount from spending (WAL-03). Closed: "behind" means below the straight-line pace between the start and the target date; a stated deposit schedule is a later template because it needs a new input and the MVP has four templates.

---

### RUL-11 Be told when a wallet falls below a level I chose

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; Wallet: edit rules for a group wallet
**Tags:** audit, offline

**Story:** As a wallet owner, I want to choose a balance level and be alerted when the wallet falls below it, so that I can add money before a bill or a payout fails.

**Conversation:** A low-balance or threshold alert is one of the four launch templates (02 personal finance, Takeaways item 2). Gereo does not guess a level, because a default threshold would be wrong for most wallets, so no low state exists without the person's rule (WAL-19 conversation). The chip "Low balance" on the wallet card is driven by this rule (WAL-19 AC3). For group wallets the alert goes to holders of Wallet: edit rules so that it reaches someone who can act (EV-RUL-03).

**Preconditions:** The wallet is open and has no low-balance rule yet (RUL-02).
**Trigger:** The person saves the rule; the System later sees Available cross below the level.

**Acceptance criteria:**
1. Happy path. The sentence reads "When [wallet] falls below [amount], alert me". Amount is a whole number of at least 1 Ar. After saving the card shows "Alert below 50 000 Ar" and the current Available.
2. Business rule, crossing. The alert is sent when Available moves from at or above the level to below it, not on every posting while it stays below. It is re-armed when Available is again at or above the level. A newly saved rule on a wallet already below the level shows the chip at once and sends one alert, so the person is not left unaware.
3. Business rule, what moves it. Any posted entry can cause the crossing: a withdrawal, a payment out, a share made by another rule, a reversal. The check runs after each posting, including the postings of RUL-07.
4. Business rule, notification. The alert is `msg.rul.low_balance` (in-app and push, no SMS), with the balance and the level in the text and a button "Add money" that opens WAL-06. For a group wallet it goes to holders of Wallet: edit rules.
5. Business rule, state on the wallet. While Available is below the level, the wallet card and detail show the chip "Low balance" and the line "Below 50 000 Ar" (WAL-19); the chip clears at or above the level. A balance of exactly the level is not low.
6. Business rule, pending money. Only posted Available counts. Money On its way in is not counted and money On its way out is already deducted (WAL-03 AC1), so the alert does not wait for the provider.
7. States. Offline: the state reads from cache with "Updated hh:mm"; saving is disabled. A failed refresh keeps the last figure.
8. Audit. `rule.created` and `rule.edited` as in RUL-08; each alert is a firing record (RUL-12) with the balance and level. No ledger entry is written.
9. Accessibility and language. Alert text is a plain sentence with both numbers ("Savings has 42 000 Ar, below your 50 000 Ar alert") and no exclamation marks.

**Data:** Wallet rule (write), Ledger entry (read), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-07, RUL-08, RUL-12, WAL-03, WAL-19, WAL-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: one alert level per wallet, as RUL-02 AC3 blocks a second low-balance rule. Closed: one alert per crossing and no repeat while below the level, because repeated alerts teach people to ignore them; the chip stays visible meanwhile (WAL-19).

---

### RUL-12 See every time a rule ran, and every time it did not

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; Wallet: view history for a group wallet
**Tags:** ledger, audit, offline

**Story:** When money has moved or an alert has come, I want to see which rule did it, with its name, and when a rule did not run, why, so that I can always explain where my money went.

**Conversation:** A "rule fired" history must be visible in the ledger and every firing must be a ledger entry with the rule name (02 personal finance, Qapital, Implication; Takeaways item 2). The "why" line on an entry is an open opportunity nobody documents (08 competitor UX 6.3 Open opportunities; 08 competitor UX 6.5). WAL-14 shows the rule line on one transaction and links here, and WAL-15 filters history by "Made by a rule". Skipped runs matter as much as fired ones: "where is my money?" is the top complaint class and a rule that silently does nothing is the same failure (competitive analysis section 4 item 1; 07 UI/UX 2.6 R-E2). Monzo's Bills Pot shows a failure plan, saying what happens when money is short (08 competitor UX 6.5 Adopt). For group wallets, failed split runs and retries are CON-15; this story is the common history screen.

**Preconditions:** At least one rule has run or been skipped, or alerted.
**Trigger:** The person opens "Rule history" from RUL-01 or taps the rule line on a transaction (WAL-14), or opens a rule.

**Acceptance criteria:**
1. Happy path. The history is a list of firings, newest first, `RULE_HISTORY_PAGE_SIZE` at a time. Each row shows: time, rule name, the income or event that triggered it, the outcome chip (Moved, Alert sent, Skipped) with icon and word, and for a move the amount and destination ("20 000 Ar to Savings by rule Share income").
2. Business rule, ledger. Every Moved row links to the ledger entries it wrote (WAL-14, via the shared reference ID) and every ledger entry made by a rule shows "Why: 20% to Savings by rule Share income" with a link back to the firing and to the rule. A deleted rule keeps its name followed by "(deleted)" (WAL-14 AC3).
3. Business rule, skipped runs. A Skipped row states the reason in plain words and says that no money moved and where the income is: "Not moved. [Destination] is closed. Your 100 000 Ar stayed in Main." (keys `rul.history.skipped.*`). This story owns the skip reason list (conventions 10.6). Reason codes are: `destination_closed`, `destination_held` (operator hold, "Held by Gereo"), `destination_deleted` (RUL-06 AC10), `wallet_held`, `wallet_frozen` (a wallet freeze pausing a firing whose destination is outside the group, RUL-07 AC4), `recipient_limit` (the amount is held in the source wallet, RUL-07 AC4), `cycle_prevented`, `chain_too_long`, `percent_over_100`, `rule_stopped`, `amount_zero`, `ledger_error`. A wallet freeze is not a reason for a firing inside the group: those shares still run (RUL-07 AC4).
4. Business rule, no hidden skip. Every run the engine decides not to do for a reason in the list above is recorded. A run that is not due (paused rule, income before the rule existed, income not counted as income) is not a skip and is not a row; the rule detail explains these in one sentence.
5. Business rule, alerts. Cap reached, goal reached, goal behind and low-balance alerts appear as "Alert sent" rows with the figures that caused them. They write no ledger entry.
6. Business rule, incomes. Under an income, "Rules on this income" lists each outcome in order and hop by hop (WAL-14 AC3), including the Rounding line to Gereo when there is one ("1 Ar rounding to Gereo") and shares that stayed because the total was under 100 percent ("70 percent stayed in Main").
7. Filters. By rule, by outcome (Moved, Alert sent, Skipped), by date. Each rule's own page shows its history only. A link "See in history" applies the "Made by a rule" filter of WAL-15.
8. Permission and privacy. On a group wallet the history is visible to members with Wallet: view history; phone numbers are masked as in the ledger. Without it the person sees `rul.history.not_permitted` naming the permission.
9. States. Empty: "No rule has run yet. When income arrives, you will see it here." Loading: skeleton. Offline: rows from the XCT-04 history cache with "Updated hh:mm". A skipped run on a personal wallet raises `msg.rul.skipped` (in-app and push, EV-RUL-06) to the owner, one per skipped run, batched under NTF-08 when many, with no SMS because no money was lost. A skipped share on a group wallet goes to `msg.con.split_failed` only (CON-15, with its SMS fallback under NTF-05): personal-wallet skips go to `msg.rul.skipped` only, so nobody gets two messages for one skip.
10. Business rule, run again. On a Skipped row for `destination_closed`, `destination_held` or a transient `ledger_error`, a personal-wallet owner can tap "Run again" once the cause is fixed. The re-run covers only the shares that did not complete, uses the rule version in force when the income arrived and the percent of the original credit, is online only (`xct.offline.needs_connection`), and is idempotent: a share already written is refused with "Already shared" (the same behaviour as CON-15 AC4 and AC6, which owns the group version). The row then reads "Moved after re-run" and an audit entry `rule.rerun` is written with actor and time.

**Data:** Rule firing (read, write on re-run), Ledger entry (read, write on re-run), Wallet rule (read, name and version), Transaction (read), Audit entry (write on re-run).
**Depends on:** RUL-07, WAL-14, WAL-15, NTF-01, NTF-08, CON-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: firing records are kept for `RECORD_RETENTION_YEARS` (shared definitions). Closed: a retry that ends in a skip is one row with the number of attempts in its detail, not one row per attempt, so the list stays readable. Closed: "Run again" is offered on personal wallets (AC10).

---

### RUL-13 Who may change rules on a group wallet, and how it ties to group split rules

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder, Group founder, Member
**Permission needed:** Wallet: edit rules (money-out class: PIN on grant) to create, change, pause, resume or delete any rule on a group wallet; Wallet: view balance to read them
**Tags:** audit, ledger

**Story:** As a group member, I want only people who hold the right permission to change the rules on the group's wallet, and every change to be visible and recorded, so that nobody can quietly change where the group's money goes.

**Conversation:** Wallet: edit rules is a wallet permission (conventions section 7) and "Treasurer" is only a bundle (conventions section 2; GRP-07, GRP-08). GRP-08 treats it as a money-out permission, so granting it asks for the grantor's PIN, because a rule can move group money between the group's wallets without a request at each firing (GRP-13 AC4). The group rules that split income are defined in CON-11 (define), CON-12 (preview), CON-13 (change, pause, end and the vote gate) and CON-14 (execution) and this story references them and does not duplicate them. Cap, goal and low-balance rules on a group wallet are not split rules and have no vote gate in CON, so this story fixes who edits them and when the group's vote setting applies (an important change may need a vote). A vote linked to a rule change is VOT-01 opened with a proposal reference; the competitive analysis lists automatic vote-triggered rule changes as out of v1, so the first version gates the save behind a vote the person starts (CON-13 open questions; competitive analysis section 7).

**Preconditions:** The wallet belongs to a group. The person is a member.
**Trigger:** The person opens the rules of a group wallet (RUL-01), or a holder saves, pauses, resumes or deletes a rule.

**Acceptance criteria:**
1. Happy path. A holder of Wallet: edit rules can create, change, pause, resume and delete the rules of the group wallet using the screens of RUL-02, RUL-03, RUL-08, RUL-09, RUL-10 and RUL-11. Share rules on a group wallet are defined and executed as in CON-11 to CON-14; this story only adds the permission and audit rules that follow.
2. Business rule, permission check. The permission is checked on the server on every action. Revoking Wallet: edit rules (GRP-08) removes the buttons at the next load and rejects any action in progress with `err.wal.permission_missing`.
3. Business rule, read-only. A member with Wallet: view balance but not Wallet: edit rules sees every rule and its state in words, read-only, and the name of a person who holds the permission (RUL-01 AC5). A member without Wallet: view balance sees only that the wallet has rules and the missing permission.
4. Business rule, decision gate. On a group wallet, creating a share rule that moves money to another wallet (the first Active rule on a wallet included), changing its percent or destination, and adding a rule to a wallet that already has Active rules go through the gate below (conventions 10.5b); personal wallets are not gated. The gate has this fallback order, and no other skip exists: (1) an authority vote when at least three holders of Vote: vote exist; (2) otherwise PIN approval from one other holder of Wallet: edit rules; (3) otherwise, only if the group has exactly one Active member, the holder saves alone and the audit entry records "Single member, no gate". For (1), the change is stored as a snapshot and its vote is created through VOT-01 AC10; the vote of VOT-01 and VOT-02 counts only with at least two distinct voters other than the proposer (the floor of decision D4, counted by VOT-03); a passed vote (VOT-09) lets a holder of Wallet: edit rules apply exactly the stored snapshot within `change_apply_window_days`, citing the decision ID, the decision is logged (VOT-13), and the old version stays active until then. The setting `split_change_requires_vote` has no "Never" value for a rule that moves money to another wallet: it keeps only values that gate. Each line of a D3 chain goes through the gate. Pause, resume and end stay one tap and are never gated. Cap, goal and low-balance rules are not gated: they move no money. Floor scope: GRP-13 AC4 (rule-made intra-group moves are authorised once at rule save under this gate and are not individually subject to the floor); the floor itself is stated only in GRP-13 and VOT "Kinds of vote".
5. Business rule, destinations and chain (class (b), conventions 10.4). A rule can never target a personal wallet or an outside party: every destination is another wallet of the same group (RUL-03 AC4, CON-11 AC5). On every save of a group rule the system recomputes the full reachable chain, including existing downstream rules, and every line of that chain is covered by the gate of AC4 at the save that adds it. The rounding line to Gereo needs no approval (class (c), GRP-13 AC4, D5).
6. Notification. A saved change to a rule on a group wallet notifies members with Wallet: view balance (those who can read rules, as CON-13 AC6; audience of EV-RUL-07) with `msg.rul.group_changed` (in-app and push, EV-RUL-07), stating the rule, what changed and the effective time. For share rules the CON event (`msg.con.split_changed`, EV-CON-13) is used instead and the two are never both sent for the same change; `msg.rul.group_changed` covers only cap, goal and low-balance changes.
7. Business rule, history. Every firing and every skipped run is visible to members with Wallet: view history (RUL-12). The audit trail of rule changes is visible to holders of Group: view audit log in the group audit log (GRP-11).
8. States. Offline: read-only from cache with "Updated hh:mm"; every change action is disabled. A concurrent save by another holder follows RUL-08 AC8.
9. Audit. Each create, edit, pause, resume, delete writes the audit entries of RUL-03 and RUL-08 (`rule.*` for lines, `splitrule.*` for sets) with the actor, the permission used, the rule version, the linked vote when one exists, and time. Rule changes appear in the group audit log (GRP-11).
10. Business rule, campaign wallet. Activation of an outgoing rule on a campaign destination wallet is refused while the campaign is Open or Refunding (ANN-04); this covers both the rule save and a wallet becoming a campaign wallet, see RUL-07 criterion 11.

**Data:** Wallet rule (write), Permission (read), Vote and Decision (link), Audit entry (write), Notification (write).
**Depends on:** RUL-01, RUL-03, RUL-08, GRP-07, GRP-08, GRP-11, GRP-13, GRP-15, CON-11, CON-12, CON-13, CON-14, VOT-01, VOT-02, VOT-03, VOT-09, VOT-13, ACC-07, ANN-04, NTF-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the vote gate covers share rules only, because cap, goal and low-balance rules move no money. Closed: a rule can reach a leaf outside the group only through the vote and tier checks of AC4 and AC5, so GRP-13 is never bypassed by a rule. Closed: the founder holds Wallet: edit rules like any other holder and can lose it by revocation (GRP-08); no lock-out follows, because Wallet: edit rules is not in the continuity-critical list of GRP-14 and rules already saved keep running until a holder changes them.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| RUL-01 | See the rules on a wallet and whether they are working | P0 | WAL-01, WAL-03, WAL-05, GRP-06 |
| RUL-02 | Choose one of four ready-made rules | P0 | RUL-01, RUL-13, WAL-01, ACC-07, GRP-08 |
| RUL-03 | Build a share rule as one sentence | P0 | RUL-02, RUL-04, RUL-06, RUL-07, RUL-13, WAL-12, CON-11, GRP-15, ACC-13 |
| RUL-04 | See what a rule would have done with my real recent incomes | P0 | RUL-03, RUL-06, RUL-07, WAL-15, CON-12 |
| RUL-05 | See everything that happens when money arrives, in one place | P0 | RUL-01, RUL-03, RUL-07, CON-11, CON-12 |
| RUL-06 | Stop a rule that would send money in a circle | P0 | RUL-03, RUL-07, RUL-12, CON-11, CON-14, GRP-15, ACC-15 |
| RUL-07 | Apply my rules automatically when income arrives | P0 | WAL-06, WAL-07, WAL-11, WAL-18, RUL-03, RUL-06, RUL-09 to RUL-12, CON-04, CON-14, CON-15, NTF-08, ACC-13, SPD-15 |
| RUL-08 | Pause, resume, edit or delete a rule, for future income only | P1 | RUL-01, RUL-03, RUL-04, RUL-06, RUL-13, WAL-04, WAL-05, WAL-14, CON-13, VOT-01 |
| RUL-09 | Set a spending cap and be alerted when it is reached | P1 | RUL-02, RUL-08, RUL-12, WAL-03, WAL-10, WAL-11, WAL-12, WAL-13, WAL-18, SPD-10, SPD-14, NTF-04 |
| RUL-10 | Set a goal with a target date and follow it | P1 | RUL-02, RUL-08, RUL-12, WAL-01, WAL-03, WAL-07, NTF-04, NTF-14 |
| RUL-11 | Be told when a wallet falls below a level I chose | P2 | RUL-02, RUL-07, RUL-08, RUL-12, WAL-03, WAL-06, WAL-19 |
| RUL-12 | See every time a rule ran, and every time it did not | P0 | RUL-07, WAL-14, WAL-15, NTF-01, NTF-08, CON-15 |
| RUL-13 | Who may change rules on a group wallet, and how it ties to group split rules | P0 | RUL-01, RUL-03, RUL-08, GRP-07, GRP-08, GRP-11, GRP-13, GRP-15, CON-11 to CON-14, VOT-01, VOT-02, VOT-03, VOT-09, VOT-13, ACC-07, ANN-04, NTF-01 |

Totals: 13 stories. 9 P0 (RUL-01 to RUL-07, RUL-12, RUL-13), 3 P1 (RUL-08, RUL-09, RUL-10), 1 P2 (RUL-11).

Story IDs match the references already made by WAL: RUL-01 (rules line, WAL-03), RUL-07 (engine, WAL-07, WAL-12, WAL-13), RUL-08 (stop, pause, WAL-05), RUL-09 (cap, WAL-03, WAL-10), RUL-10 (goal, WAL-01, WAL-04), RUL-11 (threshold, WAL-19), RUL-12 (history, WAL-05, WAL-14).

## Cross-epic dependencies

- **WAL.** WAL-07 owns and emits the "money posted to a wallet" event the engine consumes; WAL-12 and WAL-13 are entry points whose credits are all income (D3, RUL-07). WAL-12 manual moves out of a wallet are not spending (RUL-09). WAL-18 reversals reduce a spent total and reverse rule entries down the chain (RUL-07, RUL-09). WAL-03 reads the cap for Safe to spend and links the rules line. WAL-04 edits the same goal record (RUL-10). WAL-05 stops rules and sets rules that send to a closed wallet to Needs attention (RUL-08, RUL-12). WAL-10 shows the cap line on the review sheet (RUL-09). WAL-14 shows the "Why" line and WAL-15 filters "Made by a rule" (RUL-12). WAL-19 uses the low-balance rule for the Low chip (RUL-11). WAL-06 is the "Add money" button of the alert.
- **ACC.** ACC-07 tier table: an internal-only rule needs Tier 1; a rule leaving the group's wallets needs the money-out tier (RUL-02, RUL-13). ACC-15 account deletion pauses foreign rules that target the deleted wallet (RUL-06 AC10). ACC-13 terms disclose the Rounding line to Gereo (RUL-03, RUL-07). ACC-02 and ACC-03 for sign-in.
- **GRP.** GRP-07 and GRP-08 (Wallet: edit rules as a money-out permission, grant and revoke), GRP-11 (group audit log, read with Group: view audit log), GRP-13 (no single person moves the group's money; AC4 authorises a rule once at save), GRP-15 (wallets within a group as destinations), GRP-06 (home counters), GRP-14 (founder and continuity).
- **CON.** CON-11 to CON-14 define group split rules, the decision gate and their execution and are the reference for the group version of RUL-03, RUL-04, RUL-05, RUL-07 and RUL-08; CON-15 handles failed split runs and the re-run; CON-04 contributions are income (D3). CON uses `SHARE_MAX_DESTINATIONS` (RUL-03) and `RULE_CHAIN_DEPTH_MAX` (RUL-06) and keeps no alias.
- **NTF.** Event rows EV-RUL-01 to EV-RUL-07 (keys `msg.rul.*`), batching of firing items (NTF-08), centre (NTF-01), preferences (NTF-04), digest of the behind-schedule item (NTF-14). RUL needs no new SMS template and no new window parameter.
- **SPD.** SPD-10 payouts count as spending toward a cap (RUL-09). SPD-14 owns enforcement of a cap on a group wallet (`spend_cap_mode`). SPD-15 freeze pauses firings whose destination is outside the group and does not stop shares between wallets of the same group (RUL-07 AC4). SPD-14 owns `spend_cap_mode` for group wallets, set under Group: set spending policy.
- **VOT.** VOT-01, VOT-02, VOT-09 and VOT-13 carry the vote that gates a group share-rule change (RUL-13, CON-13).
- **OPS.** Operators need to see stuck or repeated skipped runs (CON-15 AC7 for splits; the same view for RUL-12); OPS-05 handles a reversal that cannot unwind a chain.
- **XCT.** XCT-04 (offline read) and the three-language sentence order for the rule builder.

## Open questions

Closed in the stories above and summarised here. Closed items carry the decision; the last two need an outside party.

1. **Closed: what counts as income.** Every Confirmed credit into a wallet, whatever its source (decision D3, RUL-07 AC1). Not income: reversals and refunds, Fee lines, Rounding lines, anything not Confirmed. No tagging by hand and no per-wallet setting.
2. **Closed: rounding.** Each share is rounded down per destination and the leftover goes to Gereo as a visible Rounding line, shown on the receipt and disclosed in the terms (decision D5, RUL-07 AC3). Not largest-remainder and not back to the wallet.
3. **Closed: fees on income.** Provider fees are never taken off before the percent; the wallet is credited the net amount and the fee is its own line (CON-14 AC1).
4. **Closed: percent precision and fixed amounts.** Whole percents only; no fixed-amount share in the MVP (RUL-03).
5. **Closed: destinations.** A personal rule sends only to another wallet of the same owner; a group rule goes to another wallet of the same group, and a leaf outside the group needs the vote and money-out tier of RUL-13 AC5, so GRP-13 is never bypassed (RUL-03 AC4).
6. **Closed: limits.** `RULE_MAX_PER_WALLET` 10, `RULE_NAME_MAX` 40, `SHARE_MAX_DESTINATIONS` 5, `RULE_CHAIN_DEPTH_MAX` (value in the shared definitions table), `PREVIEW_INCOME_COUNT` 3, `PREVIEW_LOOKBACK` 90 days. Field interviews may tune them; nothing waits on them.
7. **Closed: spending cap definition.** Week and month, a month from the 1st, early warning at 80 percent, only Confirmed money-out counts, Cash-out, manual moves and rule-made lines do not (RUL-09). Enforcement on a group wallet belongs to SPD-14.
8. **Closed: goal pace.** Linear pace, checked at `GOAL_CHECK_DAY`; goal reached goes to every member who can view the balance, goal behind to holders of Wallet: edit rules (RUL-10).
9. **Closed: vote gate scope.** Share rules only, always gated on a group wallet with no opt-out; pause, resume and end are not gated (RUL-08 AC7, RUL-13 AC4).
10. **Closed: permission names.** Wallet: edit rules is the permission for every rule, including the goal on a group wallet (WAL-04). Reading rules needs Wallet: view balance; firing history needs Wallet: view history; the audit trail needs Group: view audit log.
11. **Closed: reversal of income.** Rule entries reverse automatically down the chain, last hop first, with a reason; the Rounding line reverses too (CON-14 AC8).
12. **Closed: failure plan.** A share whose destination is closed or held is skipped, not queued, and the owner can "Run again" on the original rule version (RUL-12 AC10; CON-15 for groups).
13. **Open, external (field research): evidence gaps.** No competitor documents a preview or a skipped-run history (08 competitor UX 6.5 [U]); both are hypotheses to test in field interviews. How many rules a Malagasy user can read in the combined summary before it stops helping is unknown. Default used: the four templates, the limits above and the summary as written.
14. **Rounding line to Gereo.** Closed: the line exists, always under 1 Ar per destination, visible on the receipt and disclosed in the terms (ACC-13).
