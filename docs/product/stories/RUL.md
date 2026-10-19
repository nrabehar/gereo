# RUL: Wallet rules

Epic code RUL, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, statuses, IDs). Journey steps covered: 3 Set up, 4 Fund (income arrives and rules fire), 7 Follow (firing history, alerts).

Sources used in the Conversation sections. Raw reports are cited as file plus section.

| Short name | File |
| --- | --- |
| 02 personal finance | [02-personal-finance.md](../../research/raw/02-personal-finance.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| info.md | [info.md](../../../info.md), section on wallets and wallet rules |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption.

## Shared definitions for this epic

**What a rule is.** A wallet rule belongs to one wallet and has a trigger, an optional condition and an action (info.md, entity "Wallet rule"). The MVP offers four templates and no blank builder (02 personal finance, Takeaways item 2; 08 competitor UX 6.5 Adopt):

| Template | Sentence | Acts on | Story |
| --- | --- | --- | --- |
| Share | When income arrives in [wallet], move [percent] to [destination wallet] | Each income | RUL-03 |
| Spending cap | When spending from [wallet] in [period] reaches [amount], alert me | Spending out of the wallet | RUL-09 |
| Goal | I want [wallet] to reach [amount] by [date] | Balance against a date | RUL-10 |
| Low-balance alert | When [wallet] falls below [amount], alert me | Balance | RUL-11 |

Only the share template moves money. The other three read the ledger and send alerts. Rules never edit or reverse past entries.

**Conventions used in this file**

- Message keys: UI `rul.<screen>.<element>`, errors `err.rul.<code>`. Notifications use the base keys already in the NTF event catalogue (`msg.rul.fired`, `msg.rul.cap_reached`, `msg.rul.low_balance`, `msg.rul.goal_reached`, `msg.rul.goal_behind`, `msg.rul.skipped`, `msg.rul.group_changed`). This epic defines no new notification key, no new SMS template and no new fallback parameter. The RUL rows of the catalogue use in-app and push only, so no RUL event produces SMS and `ntf.sms_window.*` is not used here. All text exists in Malagasy, French and English. Wording in quotes is intent, not final copy.
- Amounts are integer ariary shown as `12 500 Ar`. Percentages in rules are whole numbers. No number in this file is a decision; each is a named parameter below or an open question.
- Rule-produced ledger entries carry the rule name and rule version, are flagged as rule-made (so they are never treated as income by another rule), and are classified Split in the controlled type vocabulary shared with CON and WAL-15.
- A wallet balance is always the sum of its ledger entries (WAL-03). Rules read it; they never store a balance.
- On a personal wallet the person holds every wallet permission. On a group wallet, `edit rules` is checked for every create, edit, pause, resume and delete (RUL-13).
- A rule applies to future income only. A change or a new rule never touches income already received (info.md, wallet rules; CON-13).
- Times are shown in Madagascar time (Indian/Antananarivo, UTC+3).

**Configurable parameters**

| Parameter | Meaning | Starting value or status |
| --- | --- | --- |
| `RULE_MAX_PER_WALLET` | Most rules of any kind on one wallet | TBD |
| `RULE_NAME_MAX` | Maximum characters in a rule name | TBD |
| `SHARE_MAX_DESTINATIONS` | Most share rules, or destinations, on one wallet | TBD (CON-11 calls the group equivalent `split_max_destinations`; one value is wanted) |
| `RULE_CHAIN_DEPTH_MAX` | Longest allowed chain of wallets that pass money on | TBD (same value as CON `split_chain_depth_max`) |
| `PREVIEW_INCOME_COUNT` | Recent incomes used by the live preview | Up to 3, as in CON-12; to confirm |
| `PREVIEW_LOOKBACK` | How far back the preview looks for incomes | TBD |
| `CAP_PERIOD_OPTIONS` | Periods a spending cap may use (for example week, month) | TBD |
| `CAP_WARNING_PERCENT` | Optional share of the cap at which an early warning is sent | Open (off unless decided) |
| `GOAL_CHECK_DAY` | Day and hour of the weekly goal-behind check | TBD, aligned with `ntf.digest_day` |
| `RULE_RETRY_MAX`, `RULE_RETRY_BACKOFF` | Retries for a transient failure while a rule runs | TBD |
| `RULE_HISTORY_PAGE_SIZE` | Firings per page | Same as `HISTORY_PAGE_SIZE` (WAL) |
| `RULE_HISTORY_RETENTION` | How long firing history is kept | Not shorter than `RECORD_RETENTION_YEARS` (WAL); TBD |

**Defaults proposed here, to validate** (each repeated in Open questions): rounding is down to whole ariary per share and the leftover stays in the source wallet (same as CON-12 and CON-14); income means Confirmed money that comes from outside the owner (see RUL-07); several share rules each take their percent of the original income, so order never changes the amounts.

---

## Stories

### RUL-01 See the rules on a wallet and whether they are working

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; `view balance` to see rules on a group wallet (read-only), `edit rules` to change them
**Tags:** offline

**Story:** As a wallet owner, I want one list of the rules on my wallet with the state of each, so that I always know what will happen to my next income.

**Conversation:** Winners in this space keep rules few, visible and explainable; a "rule fired" history must be visible (02 personal finance, Qapital, Implication; Cross-cutting, What users love item 3: automation works "only when rules are few and visible"). Users trust what they can read, so every rule is shown as a sentence, not a form (07 UI/UX 8.2 R-RB1). WAL-03 links its line "2 rules on, 1 paused" here. Group members see a rule in words as a matter of transparency (CON-11 AC7). Offline reading of rules is a stated need (02 personal finance, Takeaways item 7).

**Preconditions:** The wallet exists and the person may view it.
**Trigger:** The person taps the rules line on the wallet detail (WAL-03).

**Acceptance criteria:**
1. Happy path. The list shows one card per rule: the rule as a sentence in the person's language, a state chip (On, Paused, Waiting for vote, Needs attention, Stopped) with icon and word, the last time it fired and what it did ("Moved 20 000 Ar to Savings, yesterday"), and for alert rules the current reading ("Spent 120 000 of 200 000 Ar this month").
2. Business rule. Cards are grouped by template (Share, Spending cap, Goal, Low-balance alert). Within share rules the order is the application order (RUL-05). A button "Add a rule" opens RUL-02.
3. Business rule. At the top, a link "What happens when money arrives" opens the combined summary (RUL-05) and a link "Rule history" opens RUL-12.
4. Business rule. "Stopped" is used for a rule on a closed wallet ("Stopped: wallet closed", WAL-05) and keeps its history. A share rule whose destination is closed shows "Needs attention" with the reason, never "On".
5. Permission. A person without `edit rules` on a group wallet sees the cards read-only: no Add, Edit, Pause or Delete, and one line naming the missing permission and who holds it (`rul.list.permission_needed`). A person without `view balance` sees `rul.list.not_permitted`, not the rules.
6. States. Empty: one sentence on what rules do and the four template choices as buttons, no illustration-only screen. Loading: skeleton cards. Refresh failure: the cached list stays with "Could not update. Retry".
7. Offline. The list renders from cache with "Updated hh:mm". All actions that change a rule are disabled with `wal.offline.needs_connection`.
8. No ledger entry and no notification. Reading is not audited.
9. Accessibility and language. Each card reads as one sentence to a screen reader including its state; state is never by colour alone; sentence word order is tested at 2x text expansion in the three languages.

**Data:** Wallet rule (read), Rule firing (read, last result), Ledger entry (read, for alert readings), Membership (read).
**Depends on:** WAL-03, WAL-01, GRP-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Does a person with only `view history` (not `view balance`) see rules? Should the list show a count of firings this month?

---

### RUL-02 Choose one of four ready-made rules

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** audit

**Story:** As a wallet owner, I want to pick a rule from a short list of named templates, so that I can automate my money without learning a rule builder.

**Conversation:** Named, human-readable templates beat a blank builder, and four is a deliberately small set (08 competitor UX 6.5 Adopt; 02 personal finance, Takeaways item 2; competitive analysis section 7). Unlimited custom rules, "if this then that" chains and rules triggered by an outside service are not in the MVP (08 competitor UX 6.5 Avoid; 02 personal finance, Risks, "Rules complexity and bad surprises"). Unverified people can still budget with rules on small amounts, because rules do not need identity checks unless money-in or out is involved (02 personal finance, Cross-cutting, KYC friction; ACC-07).

**Preconditions:** The wallet is open and the person holds the permission.
**Trigger:** The person taps "Add a rule" (RUL-01).

**Acceptance criteria:**
1. Happy path. The screen shows exactly four choices, each with icon, a name, and one plain sentence of what it does and whether it moves money: "Share each income" (moves money), "Spending cap" (alert only), "Goal with a date" (alert only), "Low-balance alert" (alert only). Keys `rul.template.*`.
2. Business rule. No blank builder, no fifth template and no custom code exist. A template not offered cannot be created through any other screen or request.
3. Business rule. A wallet may hold several rules. Duplicates are checked per template: a second spending cap for the same period, a second goal on the same wallet (the goal is one shared record, WAL-04) and a second low-balance rule are blocked with `err.rul.already_exists` and a link to edit the existing one. Several share rules are allowed up to `SHARE_MAX_DESTINATIONS`.
4. Business rule. At `RULE_MAX_PER_WALLET` the choices are disabled and `rul.template.limit_reached` says why.
5. Business rule. The type of the wallet may pre-select a template (a savings wallet suggests Goal, a budget wallet suggests Spending cap) but never hides the others.
6. Business rule, group wallet. Without `edit rules` the screen is not reachable and the person sees the missing permission named (`err.wal.permission_missing`). Choosing a template on a group wallet that needs a vote follows RUL-13.
7. Business rule. Choosing needs only Tier 1 (ACC-07). No identity prompt appears for creating a rule.
8. States. Loading: skeleton buttons. Offline: the screen opens but each choice is disabled with `wal.offline.needs_connection`; no rule is queued from the phone.
9. Audit. Only the later save writes `rule.created` (RUL-03, RUL-09, RUL-10, RUL-11). Browsing templates writes nothing.

**Data:** Wallet rule (read, for duplicates), Wallet (read), Permission (read).
**Depends on:** RUL-01, WAL-01, ACC-07, GRP-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Value of `RULE_MAX_PER_WALLET`. Is a wallet-type suggestion wanted, or does it risk steering people? When Gereo adds a template after the MVP, may a group switch it off for its wallets?

---

### RUL-03 Build a share rule as one sentence

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (own wallet); Permission holder with `edit rules` for a group wallet through CON-11
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** ledger, audit

**Story:** As a wallet owner, I want to say "when income arrives in this wallet, move this percent to that wallet" by filling three slots in a sentence, so that part of every income is set aside without me doing it.

**Conversation:** The three-slot sentence "When [trigger] arrives in [wallet], move [percent] to [destination]" is the recommended builder shape (07 UI/UX 8.2 R-RB1). Automatic percentage allocation of every income is the differentiator: YNAB, Goodbudget and Monzo users do it by hand each pay period, and Qapital and Chime offer only fixed or round-up rules (02 personal finance, Gaps competitors leave item 1; Table stakes list, "Percentage-based auto-allocation"; 08 competitor UX 6.5 Open opportunities). The sum of percentages may be below 100 and the rest stays in the wallet (info.md, wallet rules and group split rules). For a group wallet the same rule is defined in CON-11 and this story does not repeat its group parts: the group sentence, the destinations in the group, the vote gate and the audit entry `splitrule.created` are in CON-11 to CON-13. This story defines the personal-wallet builder and the shared validation.

**Preconditions:** The person chose "Share each income" (RUL-02). At least one other open wallet exists that can be a destination.
**Trigger:** The person opens the share builder.

**Acceptance criteria:**
1. Happy path. The screen is one sentence with three tappable slots: the source wallet (fixed to this wallet), the percent (numeric keypad, whole numbers) and the destination wallet (picker of open wallets). The person may name the rule in short text (at most `RULE_NAME_MAX`); a default name is proposed ("Share income"). Below the sentence sit the live preview (RUL-04) and the button "Save rule".
2. Business rule, percent. Each share is a whole number from 1 to 100. The total of all active share rules on the wallet, including this one, must be at most 100. Above it, Save is blocked and the message names the excess ("Together your rules take 120 percent. Lower one by 20", `err.rul.percent_over_100`).
3. Business rule, remainder. When the total is below 100, a line states "The other [N] percent stays in [wallet]". This is a normal, valid state and needs no confirmation.
4. Business rule, destinations. The destination must be an open wallet the person can receive into, different from the source. For personal rules the destination is another wallet of the same owner. A destination that is a group wallet or another person's wallet is not offered in the MVP (open question). The number of share rules is limited to `SHARE_MAX_DESTINATIONS`.
5. Business rule, loop. The builder blocks any choice that would create a cycle, using RUL-06. A choice that cannot be saved is shown inline with the reason, never only after Save.
6. Business rule, rounding and effect. The sentence area states in words how rounding works (RUL-07 AC4) and says "Applies to income that arrives after you save. Past income is not touched." (`rul.share.future_only`).
7. Business rule. Saving does not move money, so no confirmation sheet is needed beyond the restated sentence on the Save button ("Save: 20 percent of each income to Savings"). If an active destination is later closed, RUL-12 explains skipped runs.
8. States. Saving shows progress; a double tap creates one rule (idempotency key). A failure creates nothing and keeps the typed values. Offline: Save is disabled with `wal.offline.needs_connection`.
9. Ledger and audit. No ledger entry at save time. Audit entry `rule.created` with wallet, template, values, rule version 1, actor, time. For a group wallet the entry is `splitrule.created` as in CON-11.
10. Accessibility and language. Sliders are not the only input; every slot is reachable by keyboard and screen reader and read as part of one sentence. The same slot order is kept in Malagasy, French and English where grammar allows.

**Data:** Wallet rule (write, version 1), Wallet (read), Audit entry (write).
**Depends on:** RUL-02, RUL-04, RUL-06, WAL-01, WAL-12, CON-11 (group version), GRP-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Whole percents only, or also decimals (CON-11 asks the same)? May a personal rule send to a group wallet or to another Gereo user (WAL-13 transfers exist but are PIN-gated)? Does a share rule with a fixed amount ("move 5 000 Ar") belong in the MVP (default: no, percent only)?

---

### RUL-04 See what a rule would have done with my real recent incomes

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` and `view history` for a group wallet
**Tags:** ledger, offline

**Story:** When I am about to save or change a share rule, I want to see how it would have split my last incomes, so I can trust it before it touches real money.

**Conversation:** Preview before enabling is an open opportunity no competitor documents (08 competitor UX 6.5 Open opportunities [U]; 02 personal finance, Risks, "Preview 'what would happen' before enabling a rule"). A live preview from real history is the strongest anti-error device for non-expert builders (07 UI/UX 8.2 R-RB2, R-RB3; Expandable Grid study in section 8.5). For group wallets the preview is CON-12; this story is the same behaviour on personal wallets and the two must give identical results. A preview writes nothing and moves nothing.

**Preconditions:** A draft or changed share rule is open in the builder.
**Trigger:** The person types or changes any slot, or taps "Preview".

**Acceptance criteria:**
1. Happy path. Under the sentence a preview shows the last up to `PREVIEW_INCOME_COUNT` incomes found within `PREVIEW_LOOKBACK` on this wallet, using the rule on income as defined in RUL-07. Each line reads "Salary 400 000 Ar on 5 Oct: 80 000 Ar would go to Savings, 320 000 Ar would stay" (key `rul.preview.line`). It updates as the person types.
2. Business rule. The preview applies the same rounding as the engine (RUL-07 AC4) and always adds up: destination amounts plus what stays equals the income to the ariary.
3. Business rule. Existing active rules on the wallet are included, so the line shows the effect of all of them together with the draft (the same data as RUL-05). A paused rule is shown as "paused, not counted".
4. Business rule. If a share would round to 0 Ar the line says "0 Ar, no entry would be made for it".
5. Business rule. The preview states "Preview only. No money was moved." and shows no provider fee, because moves between wallets are free (WAL-12).
6. States. With no past income, the preview asks the person to type a sample amount and says so. The person can always type a sample amount instead of or beside real incomes. Loading: skeleton lines. A failed load keeps the sample mode working.
7. Business rule, group wallet. Without `view history` the person sees only the sample-amount mode with the missing permission named, as in CON-12 AC5.
8. Offline. The preview works from cached incomes with "Updated hh:mm"; Save stays disabled.
9. Privacy. Counterparty numbers are masked as in the ledger. A preview writes no audit entry and no ledger entry.

**Data:** Ledger entry (read), Wallet rule (read, draft), Wallet (read).
**Depends on:** RUL-03, RUL-07, WAL-15, CON-12 (group version).
**Pages:** to be filled from the information architecture.
**Open questions:** Value of `PREVIEW_INCOME_COUNT` and `PREVIEW_LOOKBACK`. May a person with no history yet be shown example incomes (default: no, only a typed sample)?

---

### RUL-05 See everything that happens when money arrives, in one place

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; `view balance` for a group wallet
**Tags:** offline

**Story:** When I have several rules on a wallet, I want one summary of what happens to a new income, in order, with the total and what stays, so I am never surprised by where my money went.

**Conversation:** Effective-result views beat rule lists: in the Expandable Grid study people read outcomes correctly 83.6 percent of the time against 56.5 percent for lists (07 UI/UX 8.2 R-RB3 and section 8.5). The summary is also the only place that shows the sum and the remainder, which is what makes a total under 100 safe (info.md; CON-11 AC3 key `con.split.summary`). Monzo's budget view breaks when money sits in pots (02 personal finance, Gaps item 3), so Gereo shows the whole effect in one place. On group wallets this is the same summary that CON-11 describes and the screen is shared.

**Preconditions:** The wallet has at least one rule.
**Trigger:** The person opens "What happens when money arrives" from RUL-01, from the builder, or after saving a change.

**Acceptance criteria:**
1. Happy path. The summary reads as a short ordered list: "When income arrives in Main: 1. 20 percent to Savings. 2. 10 percent to School fees. The other 70 percent stays in Main." It then lists the alerts that watch the wallet (spending cap, goal, low-balance alert) under "Alerts".
2. Business rule. The summary shows the total of share percentages and the remainder in words, for example "Total moved: 30 percent. Stays: 70 percent". A total of exactly 100 shows "Nothing stays in Main".
3. Business rule. It shows all states: a Paused rule is listed as "Paused, not applied", a rule waiting for a vote as "Waiting for vote, not applied", a stopped rule as "Stopped".
4. Business rule. A worked example uses the wallet's last income when one exists, or a typed amount, shown with the same rounding as the engine ("With 100 000 Ar: 20 000 to Savings, 10 000 to School fees, 70 000 stay").
5. Business rule. The order shown is the order of application (RUL-07). The person with permission may change the order of share rules with up and down buttons; reordering saves a new rule version for each moved rule and applies to future income only.
6. Business rule, cycles. If a destination passes money on to other wallets (a chain), the summary follows it up to `RULE_CHAIN_DEPTH_MAX` and shows the full path in words ("20 percent to Savings, which sends 50 percent of that to School fees"). It never shows a path that RUL-06 blocks.
7. States. Loading: skeleton. Offline: readable from cache with "Updated hh:mm". A person without `view balance` on a group wallet sees `rul.summary.not_permitted`.
8. Notifications. None.
9. Accessibility and language. The list is a real ordered list for screen readers; amounts never clip at 200 percent font scale; the sentence works in the three languages.

**Data:** Wallet rule (read), Ledger entry (read, last income), Wallet (read).
**Depends on:** RUL-01, RUL-03, RUL-07, CON-11, CON-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Does reordering matter for share rules (default: no, see RUL-07 AC3), so is reordering only for the display and for alert order? Should the summary show chains across owners?

---

### RUL-06 Stop a rule that would send money in a circle

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** audit

**Story:** As a wallet owner, I want Gereo to refuse a rule that would send money round in a circle and to tell me in plain words why, so that my money never loops.

**Conversation:** Loop prevention in allocation cascades and a cap on rule chains are required safeguards (07 UI/UX 8.2 R-RB4; 02 personal finance, Risks, "cap rule chains; loop prevention in allocation cascades"; 08 competitor UX 6.5 Open opportunities). People who build rules are not experts, so the message must name the wallets in the loop, not say "cycle detected" (design foundations section 3, plain language). CON-11 AC4 and CON-14 AC4 apply the same rule to group wallets; the check is shared.

**Preconditions:** A person is saving, resuming, reordering or changing a share rule.
**Trigger:** Save, Resume, or an edit of a destination.

**Acceptance criteria:**
1. Happy path. Before the rule is saved, resumed or edited, the system follows all active share rules from the destination and checks whether the source wallet can be reached again. If it can, Save is blocked and the screen explains with the path in words: "This would send money in a circle: Main sends 20 percent to Savings, Savings sends 10 percent to Main. Change one of them." (`err.rul.cycle`, with the wallet names as parameters).
2. Business rule. A rule that sends to its own wallet is blocked with `err.rul.same_wallet`.
3. Business rule. A chain longer than `RULE_CHAIN_DEPTH_MAX` is blocked with `err.rul.chain_too_long` naming the limit and the longest path.
4. Business rule. The check counts rules that are On, Paused and Waiting for vote, so resuming a paused rule can never create a loop that the person did not see. The check uses the current state of all rules on all wallets the person owns, and for a group on all wallets of that group.
5. Business rule, run time. The check is repeated when the engine runs (RUL-07). If a loop appears later, for example because another person changed a rule on a wallet the first person does not control, the engine skips the affected run with the reason `cycle_prevented` and nothing is written (RUL-12).
6. Business rule. Rule-made entries are flagged and are never income for any rule, so even an undetected loop cannot multiply money.
7. Business rule. The message never reveals wallets the person is not allowed to see: it names them as "a wallet of [group name]" when the person lacks `view balance` there.
8. States. The message appears inline next to the offending slot, with focus moved to it and also in the error summary at the top. Offline: the check runs on cached rules for guidance only; Save is disabled anyway.
9. Notifications and audit. A blocked save writes no audit entry and sends nothing. A run skipped for `cycle_prevented` sends `msg.rul.skipped` (RUL-12) and writes an audit entry `rule.skipped` with the path.

**Data:** Wallet rule (read, all linked rules), Audit entry (write on skipped run).
**Depends on:** RUL-03, RUL-07, RUL-12, CON-11, GRP-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Value of `RULE_CHAIN_DEPTH_MAX`. How much of another owner's wallet names may be shown in a loop message?

---

### RUL-07 Apply my rules automatically when income arrives

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (rule authorised at definition time)
**Tags:** ledger, audit

**Story:** When income is confirmed in a wallet, I want every active share rule to run at once, in a clear order, under its own name, so that I never have to move money by hand and I can see exactly what happened.

**Conversation:** Automatic application on every income, with loop prevention and each firing logged, is Gereo's stated differentiator and Monzo staff described full automation as "planned for later" (08 competitor UX 6.5 Open opportunities; 02 personal finance, Gaps item 1). Manual sorting is forgotten or runs after fixed payments leave (08 competitor UX 6.5 Avoid). Money must move only on Confirmed, never on Pending, because provider callbacks can double-notify (WAL-07; CON-14 AC8). Group split execution is CON-14: this story defines the shared engine that runs both personal rules and group split rules, and CON-14 stays the reference for group-only behaviour (timing "At a set time", vote-gated versions, members' view). The person decides what counts as income by default, not by guesswork; this is an open question with a proposed default.

**Preconditions:** An active rule version exists on the wallet. An income reaches Confirmed after that version's effective time.
**Trigger:** WAL-07 posts a confirmed deposit, or WAL-13 posts a transfer received from another person, or any other posting classed as Income.

**Acceptance criteria:**
1. Happy path, income. The engine treats as income, by default, a Confirmed credit that comes from outside the owner: a deposit from mobile money (WAL-06, WAL-07), a transfer received from another person or group (WAL-13), and on a group wallet a deposit classified as Income at deposit time (WAL-06 conversation, CON-14 open question). It does not treat as income: a move between the owner's own wallets (WAL-12), a rule-made entry, a contribution paid to a plan (CON-04, unless the group enabled `contributions_feed_split`, CON-11), a fee, a refund or reversal (WAL-11, WAL-18), and any entry that is not Confirmed.
2. Business rule, calculation. For each active share rule the engine computes the rule's percent of the whole income, not of what is left after earlier rules. The total of percentages is at most 100 at save time (RUL-03) and is checked again at run time; if it exceeds 100 at run time, the whole run is skipped with reason `percent_over_100` and nothing is written.
3. Business rule, order. Share rules run in the order shown in RUL-05. Because each takes its percent of the original income, the order does not change any amount. Order does decide the order of the ledger lines, the order of alerts that follow, and which rule is reported first when several are skipped.
4. Business rule, rounding. Each share is rounded down to a whole ariary. Whatever is left after all shares, including the rounding remainder, stays in the wallet. Destination amounts plus the kept amount always equal the income exactly (default proposed; see open questions).
5. Business rule, all or nothing. All entries for one income are written in one atomic posting with the income reference: one balanced entry from the wallet to each destination, classified Split, named with the rule name and version (key `rul.ledger.share_line`, for example "20 percent to Savings by rule Share income"). Either every share is written or none. A destination that cannot receive (closed, frozen) makes only its own run Skipped with the reason `destination_closed` or `destination_frozen` while other shares go ahead; the money for the skipped share stays in the wallet (RUL-12).
6. Business rule, idempotency. One run per income and rule version, enforced by a key built from income ID and rule version. A duplicate callback, a retry or a replay writes nothing more. A transient failure is retried up to `RULE_RETRY_MAX` with `RULE_RETRY_BACKOFF`; a permanent one waits for a person (CON-15 for group wallets).
7. Business rule, future only. A rule version applies only to incomes Confirmed after its effective time. Incomes received while a rule was paused or before it existed are never split later, even when the rule is resumed.
8. Business rule, after the run. Once the share postings are done, the engine re-reads the wallet and checks the alert rules (spending cap, goal, low-balance) on the new balance (RUL-09, RUL-10, RUL-11). A failure in a rule never rolls back the income (WAL-07 AC8).
9. Ledger and audit. Every run, including skipped ones, writes a firing record (RUL-12) and an audit entry `rule.fired` with income reference, rule version, entries written, actor System, time. The income wallet entry, the destination entries and the firing record share one reference ID.
10. Notifications. A fired share sends `msg.rul.fired` as an in-app item to the wallet owner and, for group wallets, to members with `view history`, batched under NTF-08 so a busy day makes one summary. No push and no SMS for a normal firing.

**Data:** Transaction (read), Wallet rule (read), Ledger entry (write), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** WAL-07, WAL-13, WAL-12, WAL-11, WAL-18, RUL-03, RUL-06, RUL-12, CON-14, NTF-08.
**Pages:** to be filled from the information architecture.
**Open questions:** (1) What counts as income: the default above, or a person tagging each deposit as Income at deposit time, or a per-wallet choice? (2) Rounding: round down with the leftover staying in the wallet (default), or largest-remainder across destinations (07 UI/UX 8.1 R-G3)? One rule must be agreed with CON-12 and WAL so the ledger and preview agree. (3) Are provider fees on the income deducted before the percent is taken? (4) If an income is later reversed (WAL-18), do the rule entries reverse too (default: yes, with a reversing set and a reason, as CON-14 AC8)?

---

### RUL-08 Pause, resume, edit or delete a rule, for future income only

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** audit, ledger

**Story:** As a wallet owner, I want to switch a rule off for a while, change it or delete it, knowing it never touches money already moved, so that I stay in control and history stays true.

**Conversation:** A modified rule applies only to future income and history is never rewritten (info.md, wallet rules). A one-tap pause is a recommended safeguard (07 UI/UX 8.2 R-RB7). Rules must be explainable and reversible and the firing history must stay visible (02 personal finance, Qapital, Implication). Pause, edit and delete are reversible or non-destructive for money, so they need no confirmation sheet, except delete which removes a rule people may rely on (07 UI/UX 2.4 R-C1, R-C5). The group version, with its vote gate, is CON-13; this story is the same behaviour for every template and every wallet and defers to CON-13 for the vote.

**Preconditions:** The rule exists and the person holds the permission. The wallet is open (WAL-05 stops rules on a closed one).
**Trigger:** The person taps Pause, Resume, Edit or Delete on a rule.

**Acceptance criteria:**
1. Happy path, pause and resume. One tap on Pause sets the rule to Paused and shows the chip on the card and on the wallet card ("Rules paused", WAL-02). Resume sets it back to On. Both apply at once.
2. Business rule, future only. Pause and resume take effect for incomes confirmed after the moment of the change. Income that arrived while paused is never split when the rule resumes. The screen says so in one sentence (`rul.edit.future_only`) with the effective time ("Applies to income after 14:05").
3. Business rule, edit. Each save creates a new rule version and shows the effective time. Income already received keeps the version in force when it arrived. Past ledger entries and firings keep the rule name and version that made them. A renamed rule shows the new name on the card and the name at the time on past entries.
4. Business rule, checks on save. An edit runs the same checks as creation: percent total (RUL-03), loop (RUL-06), duplicates (RUL-02), and, for a changed share, a required preview (RUL-04) that compares old and new outcome on the same sample.
5. Business rule, delete. Delete asks one confirmation that restates the rule ("Delete 'Share income'? Past entries stay and keep this name"). A deleted rule stops at once, keeps its history and its name on past entries with "(deleted)" (WAL-14 AC3). It can be recreated but not restored.
6. Business rule, goal. Deleting a goal rule removes the goal from the wallet after the person agrees, because the goal and the rule are one record (WAL-04 AC3). Editing the goal here is the same as editing it in WAL-04.
7. Business rule, group wallet. Without `edit rules` no action button is shown. Where the group requires a vote for changes (CON-13, `split_change_requires_vote`), the save creates a proposal and the old version stays active until it passes (RUL-13). Pause may need no vote by default (CON-13 open question).
8. Concurrency. If another person saved first, the person sees "Changed by [name] at hh:mm. Review" with both versions and chooses; nothing is overwritten silently (WAL-04 AC6).
9. States and audit. Offline: all actions disabled with `wal.offline.needs_connection`. Failure keeps typed values and says nothing changed. Audit entries `rule.paused`, `rule.resumed`, `rule.edited` (before and after values, version numbers), `rule.deleted`, each with actor and time. No ledger entry is written by any of these actions.

**Data:** Wallet rule (write, version), Audit entry (write), Vote (link, group).
**Depends on:** RUL-01, RUL-03, RUL-04, RUL-06, RUL-13, WAL-04, WAL-05, CON-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Does pause need a vote on a group wallet (default: no)? May a deleted rule be restored within some period? Should a rule paused for a long time ask the owner if it is still wanted (default: no)?

---

### RUL-09 Set a spending cap and be alerted when it is reached

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** ledger, audit, offline

**Story:** As a wallet owner, I want to set how much I plan to spend from a wallet in a period and be told when I reach it, so that I can slow down before the money is gone.

**Conversation:** A spending cap with alerts is one of the four launch templates (02 personal finance, Takeaways item 2) and is the part of envelope budgeting users love: "what is safe to spend" (02 personal finance, Cross-cutting item 1; WAL-03 AC4 reads the cap to compute Safe to spend). The review sheet of WAL-10 warns that a payment will pass the cap but does not block it (WAL-10 AC1), so the cap here is a plan and an alert, not a lock. Monzo's budget view mismatches when money sits in pots (02 personal finance, Gaps item 3), so only spending out of this wallet counts. Notification is `msg.rul.cap_reached` (EV-RUL-02, in-app and push, no SMS).

**Preconditions:** The wallet is open. No spending cap for the same period exists (RUL-02).
**Trigger:** The person chooses "Spending cap" and saves; the System later sees spending reach the cap.

**Acceptance criteria:**
1. Happy path. The sentence reads "When spending from [wallet] in [period] reaches [amount], alert me". Period is chosen from `CAP_PERIOD_OPTIONS`; amount is a whole number of at least 1 Ar on a numeric keypad. The card then shows "Spent 120 000 of 200 000 Ar this month" with a bar and the numbers, never a bar alone.
2. Business rule, what counts. Spending is the total of Confirmed money-out from this wallet in the period: withdrawals to mobile money (WAL-11), payments to another person or group (WAL-13) and group payouts (SPD). It excludes manual moves between the owner's own wallets (WAL-12 AC5), rule-made shares, fees counted under the payment they belong to, and Failed or Cancelled items. A reversal reduces the spent total (WAL-18).
3. Business rule, period. The period start and end are in Madagascar time and shown on the card ("This month, resets 1 Nov"). On reset the counter starts at zero and the alert can fire again.
4. Business rule, alert. When the spent total first reaches or passes the cap in a period, the system sends `msg.rul.cap_reached` once for that period, in-app and push, to the wallet owner and, for a group wallet, to holders of `edit rules`. If `CAP_WARNING_PERCENT` is on, one earlier warning is sent at that share, also once per period. Neither blocks any payment.
5. Business rule, effect on other screens. While the cap is active, "Safe to spend" on the wallet is the lower of Available minus reserved and what remains of the cap (WAL-03 AC4), and the review sheet of WAL-10 adds the line that a payment passes the cap. A cap never stops a payment by itself.
6. Business rule, cap raised. If the person raises the cap after it was reached, the alert may fire again only when the new cap is reached.
7. States. Reading the counter works offline from cache with "Updated hh:mm". Saving and editing need a connection. Loading: skeleton. A failed counter refresh keeps the last number with "Not updated since [time]".
8. Audit. `rule.created` and `rule.edited` as in RUL-03 and RUL-08. Each alert is a firing record (RUL-12) with the spent total and the cap at that time. No ledger entry is written, because the rule only reads.
9. Accessibility and language. The alert text includes both numbers and the period ("You have spent 200 000 of your 200 000 Ar cap this month"). It does not blame or shame and has no exclamation marks.

**Data:** Wallet rule (write), Ledger entry (read, spending), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-08, RUL-12, WAL-03, WAL-10, WAL-11, WAL-12, WAL-13, WAL-18, SPD, NTF-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Which periods are offered (`CAP_PERIOD_OPTIONS`) and does a month start on the 1st or on the person's pay day? Is an early warning wanted (`CAP_WARNING_PERCENT`)? Does a cap per category or per member belong in a later release (default: no)? Do rule-made shares count as spending (default: no)?

---

### RUL-10 Set a goal with a target date and follow it

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** audit, offline

**Story:** As a wallet owner, I want to say how much I want in a wallet and by when, and be told if I am on track, behind, or done, so that I save toward something real.

**Conversation:** Goals with a target and progress are table stakes (02 personal finance, Takeaways item 1 and Table stakes, "Savings goals with target and progress"). The goal is one record shared with the wallet form (WAL-01 AC3) and the edit screen (WAL-04), so editing it in any of the three changes the same data. Progress is shown as numbers plus a bar, never a bar alone (07 UI/UX R-M12; WAL-03 AC3). Reached and behind-schedule alerts are catalogue events EV-RUL-04 and EV-RUL-05; the behind-schedule one is Low class, in-app and digest only. A wallet makes no promise of interest or yield (WAL-01 conversation).

**Preconditions:** The wallet is open. It has no goal, or the person edits the existing one.
**Trigger:** The person chooses "Goal with a date", or opens the goal from the wallet.

**Acceptance criteria:**
1. Happy path. The sentence reads "I want [wallet] to reach [amount] by [date]". Amount is a whole number of at least 1 Ar; date must be in the future and is shown with the Madagascar time zone. Saving shows the goal on the wallet card and detail (WAL-02, WAL-03): `7 500 / 10 000 Ar`, a bar, the percent, the amount left and the date.
2. Business rule, one goal. A wallet has at most one goal. It is the same record whether created at wallet creation, in WAL-04 or here. Editing it creates a new version and keeps history.
3. Business rule, progress. Progress counts the wallet's Available balance toward the goal (WAL-03 AC3). The screen also shows the average amount still needed per week until the date, computed from the numbers, as plain information and not as a promise.
4. Business rule, reached. When Available first reaches or passes the amount, the system sends `msg.rul.goal_reached` once (in-app and push), shows the chip "Goal reached" and keeps the goal on the wallet. If the balance falls below and rises again, the alert is not repeated unless the person raised the goal.
5. Business rule, behind schedule. At `GOAL_CHECK_DAY`, if the balance is behind the straight-line pace toward the date, the system sends `msg.rul.goal_behind` as a Low item (in-app and digest, no push, no SMS). Behind means below the linear target for that day; the rule is stated in one sentence in the detail ("You planned 10 000 Ar by 31 Dec").
6. Business rule, date passed. After the target date without reaching the amount, the goal shows "Target date passed" and the person can extend the date or change the amount; no money moves and no fee or penalty applies.
7. Business rule, removal. Removing the goal (here or in WAL-04) asks the person to agree, ends the goal's alerts and keeps past progress in history.
8. States. Empty: wallet without a goal shows "Set a goal". Offline: progress reads from cache with "Updated hh:mm"; saving is disabled. A failed refresh keeps the last figures.
9. Audit. `rule.created` or `rule.edited` with amount, date, version, actor, time; each alert is a firing record (RUL-12). No ledger entry, because the goal only reads.
10. Accessibility and language. The bar has a text alternative with the numbers; dates are written in words in the person's language; nothing is shown by colour alone.

**Data:** Wallet rule (goal, write), Wallet (read), Ledger entry (read, balance), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-08, RUL-12, WAL-01, WAL-03, WAL-04, NTF-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Does a goal on a group wallet notify all members or only holders (the catalogue says group members for goal reached)? Should a goal also protect the amount from spending (default: no, see WAL-03 open questions)? Which pace (linear or a stated deposit schedule) defines "behind"?

---

### RUL-11 Be told when a wallet falls below a level I chose

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Individual, Permission holder
**Permission needed:** none for own wallets; `edit rules` for a group wallet
**Tags:** audit, offline

**Story:** As a wallet owner, I want to choose a balance level and be alerted when the wallet falls below it, so that I can add money before a bill or a payout fails.

**Conversation:** A low-balance or threshold alert is one of the four launch templates (02 personal finance, Takeaways item 2). Gereo does not guess a level, because a default threshold would be wrong for most wallets, so no low state exists without the person's rule (WAL-19 conversation). The chip "Low balance" on the wallet card is driven by this rule (WAL-19 AC3). For group wallets the alert goes to holders of `edit rules` so that it reaches someone who can act (EV-RUL-03).

**Preconditions:** The wallet is open and has no low-balance rule yet (RUL-02).
**Trigger:** The person saves the rule; the System later sees Available cross below the level.

**Acceptance criteria:**
1. Happy path. The sentence reads "When [wallet] falls below [amount], alert me". Amount is a whole number of at least 1 Ar. After saving the card shows "Alert below 50 000 Ar" and the current Available.
2. Business rule, crossing. The alert is sent when Available moves from at or above the level to below it, not on every posting while it stays below. It is re-armed when Available is again at or above the level. A newly saved rule on a wallet already below the level shows the chip at once and sends one alert, so the person is not left unaware.
3. Business rule, what moves it. Any posted entry can cause the crossing: a withdrawal, a payment out, a share made by another rule, a reversal. The check runs after each posting, including the postings of RUL-07.
4. Business rule, notification. The alert is `msg.rul.low_balance` (in-app and push, no SMS), with the balance and the level in the text and a button "Add money" that opens WAL-06. For a group wallet it goes to holders of `edit rules`.
5. Business rule, state on the wallet. While Available is below the level, the wallet card and detail show the chip "Low balance" and the line "Below 50 000 Ar" (WAL-19); the chip clears at or above the level. A balance of exactly the level is not low.
6. Business rule, pending money. Only posted Available counts. Money On its way in is not counted and money On its way out is already deducted (WAL-03 AC1), so the alert does not wait for the provider.
7. States. Offline: the state reads from cache with "Updated hh:mm"; saving is disabled. A failed refresh keeps the last figure.
8. Audit. `rule.created` and `rule.edited` as in RUL-08; each alert is a firing record (RUL-12) with the balance and level. No ledger entry is written.
9. Accessibility and language. Alert text is a plain sentence with both numbers ("Savings has 42 000 Ar, below your 50 000 Ar alert") and no exclamation marks.

**Data:** Wallet rule (write), Ledger entry (read), Rule firing (write), Notification (write), Audit entry (write).
**Depends on:** RUL-02, RUL-07, RUL-08, RUL-12, WAL-03, WAL-19, WAL-06.
**Pages:** to be filled from the information architecture.
**Open questions:** May a wallet have several alert levels (default: one)? Should a repeated alert be sent after a number of days still below (default: no, one alert per crossing)?

---

### RUL-12 See every time a rule ran, and every time it did not

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual, Member, Permission holder
**Permission needed:** none for own wallets; `view history` for a group wallet
**Tags:** ledger, audit, offline

**Story:** When money has moved or an alert has come, I want to see which rule did it, with its name, and when a rule did not run, why, so that I can always explain where my money went.

**Conversation:** A "rule fired" history must be visible in the ledger and every firing must be a ledger entry with the rule name (02 personal finance, Qapital, Implication; Takeaways item 2). The "why" line on an entry is an open opportunity nobody documents (08 competitor UX 6.3 Open opportunities; 08 competitor UX 6.5). WAL-14 shows the rule line on one transaction and links here, and WAL-15 filters history by "Made by a rule". Skipped runs matter as much as fired ones: "where is my money?" is the top complaint class and a rule that silently does nothing is the same failure (competitive analysis section 4 item 1; 07 UI/UX 2.6 R-E2). Monzo's Bills Pot shows a failure plan, saying what happens when money is short (08 competitor UX 6.5 Adopt). For group wallets, failed split runs and retries are CON-15; this story is the common history screen.

**Preconditions:** At least one rule has run or been skipped, or alerted.
**Trigger:** The person opens "Rule history" from RUL-01 or taps the rule line on a transaction (WAL-14), or opens a rule.

**Acceptance criteria:**
1. Happy path. The history is a list of firings, newest first, `RULE_HISTORY_PAGE_SIZE` at a time. Each row shows: time, rule name, the income or event that triggered it, the outcome chip (Moved, Alert sent, Skipped) with icon and word, and for a move the amount and destination ("20 000 Ar to Savings by rule Share income").
2. Business rule, ledger. Every Moved row links to the ledger entries it wrote (WAL-14, via the shared reference ID) and every ledger entry made by a rule shows "Why: 20% to Savings by rule Share income" with a link back to the firing and to the rule. A deleted rule keeps its name followed by "(deleted)" (WAL-14 AC3).
3. Business rule, skipped runs. A Skipped row states the reason in plain words and says that no money moved and where the income is: "Not moved. [Destination] is closed. Your 100 000 Ar stayed in Main." (keys `rul.history.skipped.*`). Reason codes are: `destination_closed`, `destination_frozen`, `cycle_prevented`, `percent_over_100`, `rule_stopped`, `amount_zero`, `ledger_error`.
4. Business rule, no hidden skip. Every run the engine decides not to do for a reason in the list above is recorded. A run that is not due (paused rule, income before the rule existed, income not counted as income) is not a skip and is not a row; the rule detail explains these in one sentence.
5. Business rule, alerts. Cap reached, goal reached, goal behind and low-balance alerts appear as "Alert sent" rows with the figures that caused them. They write no ledger entry.
6. Business rule, incomes. Under an income, "Rules on this income" lists each outcome in order (WAL-14 AC3), including shares that stayed because the total was under 100 percent ("70 percent stayed in Main").
7. Filters. By rule, by outcome (Moved, Alert sent, Skipped), by date. Each rule's own page shows its history only. A link "See in history" applies the "Made by a rule" filter of WAL-15.
8. Permission and privacy. On a group wallet the history is visible to members with `view history`; phone numbers are masked as in the ledger. Without it the person sees `rul.history.not_permitted` naming the permission.
9. States. Empty: "No rule has run yet. When income arrives, you will see it here." Loading: skeleton. Offline: cached rows with "Updated hh:mm". A skipped run raises `msg.rul.skipped` (in-app and push, EV-RUL-06) to the wallet owner and, for group wallets, to holders of `edit rules`, one per skipped run, batched under NTF-08 when many; no SMS.

**Data:** Rule firing (read), Ledger entry (read), Wallet rule (read, name and version), Transaction (read).
**Depends on:** RUL-07, WAL-14, WAL-15, NTF-01, NTF-08, CON-15.
**Pages:** to be filled from the information architecture.
**Open questions:** `RULE_HISTORY_RETENTION`. Is a retry-then-skip shown as one row or as each attempt? Should a skipped run for a closed destination offer a "Run again" button on personal wallets as CON-15 does for groups (default: yes, with the original rule version)?

---

### RUL-13 Who may change rules on a group wallet, and how it ties to group split rules

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder, Group founder, Member
**Permission needed:** `edit rules` (Wallet) to create, change, pause, resume or delete any rule on a group wallet; `view balance` to read them
**Tags:** audit, ledger

**Story:** As a group member, I want only people who hold the right permission to change the rules on the group's wallet, and every change to be visible and recorded, so that nobody can quietly change where the group's money goes.

**Conversation:** `edit rules` is one of the eight wallet permissions (conventions section 7) and "Treasurer" is only a bundle (conventions section 2; GRP-07, GRP-08). The group rules that split income are defined in CON-11 (define), CON-12 (preview), CON-13 (change, pause, end and the vote gate) and CON-14 (execution) and this story references them and does not duplicate them. Cap, goal and low-balance rules on a group wallet are not split rules and have no vote gate in CON, so this story fixes who edits them and when the group's vote setting applies (info.md: an important change may need a vote). A vote linked to a rule change is in VOT; the competitive analysis lists automatic vote-triggered rule changes as out of v1, so the first version gates the save behind a vote the person starts (CON-13 open questions; competitive analysis section 7).

**Preconditions:** The wallet belongs to a group. The person is a member.
**Trigger:** The person opens the rules of a group wallet (RUL-01), or a holder saves, pauses, resumes or deletes a rule.

**Acceptance criteria:**
1. Happy path. A holder of `edit rules` can create, change, pause, resume and delete the rules of the group wallet using the screens of RUL-02, RUL-03, RUL-08, RUL-09, RUL-10 and RUL-11. Share rules on a group wallet are defined and executed as in CON-11 to CON-14; this story only adds the permission and audit rules that follow.
2. Business rule, permission check. The permission is checked on the server on every action. Revoking `edit rules` (GRP-08) removes the buttons at the next load and rejects any action in progress with `err.wal.permission_missing`.
3. Business rule, read-only. A member with `view balance` but not `edit rules` sees every rule and its state in words, read-only, and the name of a person who holds the permission (RUL-01 AC5). A member without `view balance` sees only that the wallet has rules and the missing permission.
4. Business rule, vote gate. Where the group requires a vote for rule changes (CON-13, setting `split_change_requires_vote`), a save that applies to share rules creates a proposal (VOT) and the old version stays active until it passes. Whether the same gate also applies to cap, goal and low-balance rules is a group setting, not decided here (open question; default: no, because they move no money).
5. Business rule, no single hand. A rule that moves money to another group wallet is within the group (CON-11 AC5). A rule that would send group money to a person's personal wallet is not available in the MVP, so the approvals of GRP-13 are never bypassed by a rule.
6. Notification. A saved change to a rule on a group wallet notifies members with `view history` with `msg.rul.group_changed` (in-app and push, EV-RUL-07), stating the rule, what changed and the effective time. For split rules the CON event (`msg.con.split_changed`, EV-CON-13) is used and the two are not both sent for the same change.
7. Business rule, history. Every firing and every skipped run is visible to members with `view history` (RUL-12). The audit trail of rule changes is visible to the holders of `view permissions` in the group audit (GRP-11).
8. States. Offline: read-only from cache with "Updated hh:mm"; every change action is disabled. A concurrent save by another holder follows RUL-08 AC8.
9. Audit. Each create, edit, pause, resume, delete writes the audit entries of RUL-03 and RUL-08 with the actor, the permission used, the rule version, the linked vote when one exists, and time. Rule changes appear in the group audit log (GRP-11).

**Data:** Wallet rule (write), Permission (read), Vote and Decision (link), Audit entry (write), Notification (write).
**Depends on:** RUL-01, RUL-03, RUL-08, GRP-07, GRP-08, GRP-11, GRP-13, GRP-15, CON-11, CON-12, CON-13, CON-14, VOT, NTF-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Does the vote gate cover cap, goal and low-balance rules (default: no)? May a rule send group money to members' personal wallets later, and under which approvals? Does the group founder always keep `edit rules` (GRP-14 lock-out rules)?

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| RUL-01 | See the rules on a wallet and whether they are working | P0 | WAL-01, WAL-03, GRP-06 |
| RUL-02 | Choose one of four ready-made rules | P0 | RUL-01, WAL-01, ACC-07, GRP-08 |
| RUL-03 | Build a share rule as one sentence | P0 | RUL-02, RUL-04, RUL-06, WAL-12, CON-11, GRP-15 |
| RUL-04 | See what a rule would have done with my real recent incomes | P0 | RUL-03, RUL-07, WAL-15, CON-12 |
| RUL-05 | See everything that happens when money arrives, in one place | P0 | RUL-01, RUL-03, RUL-07, CON-11, CON-12 |
| RUL-06 | Stop a rule that would send money in a circle | P0 | RUL-03, RUL-07, RUL-12, CON-11, GRP-15 |
| RUL-07 | Apply my rules automatically when income arrives | P0 | WAL-07, WAL-13, WAL-12, WAL-18, RUL-03, RUL-06, RUL-12, CON-14, NTF-08 |
| RUL-08 | Pause, resume, edit or delete a rule, for future income only | P1 | RUL-01, RUL-03, RUL-04, RUL-06, RUL-13, WAL-04, WAL-05, CON-13 |
| RUL-09 | Set a spending cap and be alerted when it is reached | P1 | RUL-02, RUL-08, RUL-12, WAL-03, WAL-10, WAL-12, WAL-13, SPD, NTF-04 |
| RUL-10 | Set a goal with a target date and follow it | P1 | RUL-02, RUL-08, RUL-12, WAL-01, WAL-03, WAL-04, NTF-14 |
| RUL-11 | Be told when a wallet falls below a level I chose | P2 | RUL-02, RUL-07, RUL-08, RUL-12, WAL-03, WAL-19, WAL-06 |
| RUL-12 | See every time a rule ran, and every time it did not | P0 | RUL-07, WAL-14, WAL-15, NTF-01, NTF-08, CON-15 |
| RUL-13 | Who may change rules on a group wallet, and how it ties to group split rules | P0 | RUL-01, RUL-03, RUL-08, GRP-07, GRP-08, GRP-11, GRP-13, CON-11 to CON-14, VOT |

Totals: 13 stories. 9 P0 (RUL-01 to RUL-07, RUL-12, RUL-13), 3 P1 (RUL-08, RUL-09, RUL-10), 1 P2 (RUL-11).

Story IDs match the references already made by WAL: RUL-01 (rules line, WAL-03), RUL-07 (engine, WAL-07, WAL-12, WAL-13), RUL-08 (stop, pause, WAL-05), RUL-09 (cap, WAL-03, WAL-10), RUL-10 (goal, WAL-01, WAL-04), RUL-11 (threshold, WAL-19), RUL-12 (history, WAL-05, WAL-14).

## Cross-epic dependencies

- **WAL.** WAL-07 and WAL-13 post the incomes the engine reads (RUL-07). WAL-12 manual moves are not income and do not count as spending (RUL-07, RUL-09). WAL-18 reversals reduce a spent total and reverse rule entries (RUL-07, RUL-09). WAL-03 reads the cap for Safe to spend and links the rules line. WAL-04 edits the same goal record (RUL-10). WAL-05 stops rules and pauses rules that send to a closed wallet (RUL-08, RUL-12). WAL-10 shows the cap line on the review sheet (RUL-09). WAL-14 shows the "Why" line and WAL-15 filters "Made by a rule" (RUL-12). WAL-19 uses the low-balance rule for the Low chip (RUL-11). WAL-06 is the "Add money" button of the alert.
- **ACC.** ACC-07 tier ladder: rules need only Tier 1, because rules move money only inside Gereo (RUL-02). ACC-02 and ACC-03 for sign-in.
- **GRP.** GRP-07 and GRP-08 (the `edit rules` permission as a bundle item, grant and revoke), GRP-11 (audit log of group-level actions), GRP-13 (no single person moves the group's money, never bypassed by a rule), GRP-15 (wallets within a group as destinations), GRP-06 (home counters), GRP-14 (founder lock-out).
- **CON.** CON-11 to CON-14 define group split rules and their execution and are the reference for the group version of RUL-03, RUL-04, RUL-05, RUL-07 and RUL-08; CON-15 handles failed split runs and the re-run; CON-04 contributions are not income by default. The same value must be used for `split_max_destinations` and `SHARE_MAX_DESTINATIONS`, and for `split_chain_depth_max` and `RULE_CHAIN_DEPTH_MAX`.
- **NTF.** Event rows EV-RUL-01 to EV-RUL-07 (keys `msg.rul.*`), batching of firing items (NTF-08), centre (NTF-01), preferences (NTF-04), digest of the behind-schedule item (NTF-14). RUL needs no new SMS template and no new window parameter.
- **SPD.** Group payouts count as spending toward a cap (RUL-09).
- **VOT.** The vote that gates a group rule change (RUL-13 and CON-13).
- **OPS.** Operators need to see stuck or repeated skipped runs (CON-15 AC7 for splits; the same view for RUL-12).
- **XCT.** XCT-04 (offline read) and the three-language sentence order for the rule builder.

## Open questions

1. **What counts as income (default in RUL-07 AC1).** Confirmed money from outside the owner: mobile money deposits, transfers received from another person or group, and group deposits classified as Income. Excluded: own-wallet moves, rule-made entries, contributions (unless enabled), fees, refunds. Alternatives: the person tags each deposit, or a per-wallet setting. To confirm with CON-14 and WAL-06, which hold the same open question.
2. **Rounding (default in RUL-07 AC4).** Each share rounded down to a whole ariary and the leftover stays in the wallet, as in CON-12 and CON-14. Alternative: largest-remainder across destinations (07 UI/UX 8.1 R-G3). One rule only, agreed with CON and WAL so that the preview and the ledger match to the ariary.
3. **Fees on income.** Are provider fees taken off an income before the percentage is calculated (also CON-14)? Depends on who pays the fee (WAL-06 open question).
4. **Percent precision and fixed amounts.** Whole percents only (default) or decimals; whether "move 5 000 Ar" is a template later (RUL-03).
5. **Destinations.** May a personal rule send to a group wallet or to another Gereo user? May a group rule send to members' personal wallets (needs GRP-13 approvals and wallet limits)? Default: neither in the MVP.
6. **Limits.** Values of `RULE_MAX_PER_WALLET`, `SHARE_MAX_DESTINATIONS`, `RULE_CHAIN_DEPTH_MAX`, `PREVIEW_INCOME_COUNT`, `PREVIEW_LOOKBACK`, `RULE_NAME_MAX`.
7. **Spending cap definition.** Periods offered, month start, whether an early warning is wanted (`CAP_WARNING_PERCENT`), and what counts as spending (RUL-09).
8. **Goal pace.** What "behind schedule" means (linear pace is the default), the check day, and who is told on a group wallet (RUL-10).
9. **Vote gate scope.** Does a group's "important change needs a vote" setting cover cap, goal and low-balance rules or only share rules (RUL-13; default: share rules only)? Does pause need a vote (default: no)?
10. **Permission names.** `edit rules` is a Wallet permission. Confirm that it also covers the goal on a group wallet (WAL-04 uses it as a stand-in).
11. **Reversal of income.** When an income is reversed (WAL-18), do the rule entries reverse automatically (default: yes) and who is told?
12. **Failure plan.** When a destination is closed or frozen, should a share wait and run when the destination is back, or be skipped for good (default: skipped, with a "Run again" on the original rule version, RUL-12)?
13. **Evidence gaps.** No competitor documents a preview or a skipped-run history (08 competitor UX 6.5 [U]); both are hypotheses to test in the field. How many rules a Malagasy user can read in the combined summary before it stops helping is unknown.
