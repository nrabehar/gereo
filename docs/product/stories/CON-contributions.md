# CON: Contributions and income split

Epic code CON, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, IDs). Sources: [info.md](../../../info.md) (section "Cotisations et repartition"), [competitive-analysis.md](../../research/competitive-analysis.md), [design-foundations.md](../../research/design-foundations.md) and the raw reports in `docs/research/raw/`.

Contributions and income split are the core of the product: they replace the manual calculation of contributions and revenue sharing, and make every flow visible to every authorised member.

## Shared definitions for this epic

Founder decisions D1 to D5 ([05-decisions.md](../05-decisions.md)) apply to every story below. In this epic: D3 (every deposit is income, rules chain) shapes CON-04, CON-09, CON-11 to CON-15 and CON-19; D5 (leftover ariary to Gereo) shapes CON-12, CON-14 and CON-16; D1 and D4 shape how CON-16 and CON-18 show who authorised a payment.

### Contribution item statuses

A contribution plan generates one **item** per member per cycle. An item has one status. Status is always shown as icon + word + colour, never colour alone.

| Status | Meaning |
| --- | --- |
| Upcoming | Item exists but its payment window has not opened |
| Pending | Open and unpaid, before the due date (or inside the grace period) |
| Late | Unpaid after the due date plus `late_grace_days` |
| Processing | A payment was started and the provider has not answered (transaction status Initiated or Pending) |
| Paid | Payment Confirmed |
| Exempt | A permission holder exempted this member for this item, with a reason |
| Cancelled | Item removed by the system with a stated reason: the member left or was removed and the item was waived or never opened (policy `grp.leave_obligation_policy`, GRP-16), or the plan was deleted. An item that the leaving policy records as an outstanding debt is not Cancelled: it keeps its status, is marked "Former member", and gets no reminder and no late fee |

The board and the member view show Paid, Pending and Late as the three headline states from [info.md](../../../info.md). The other states are secondary chips. Money states of a payment (Initiated, Pending, Confirmed, Failed, Cancelled, Needs attention) are the transaction statuses of [00-conventions.md](../00-conventions.md) and WAL; the item status Processing is derived from them.

### Plan, split rule and split run statuses

| Object | Statuses |
| --- | --- |
| Contribution plan | Active, Paused, Ended. A chip "Change waiting for vote" can sit on an Active or Paused plan. |
| Split rule (a named set of destination lines, version by version) | Active, Paused, Ended. A new or changed version that is gated shows "Waiting for vote" and is not applied yet. The RUL epic calls each destination line a "share rule" and uses the state names On, Paused, Waiting for vote; "Active" and "On" are the same state. |
| Split run (one execution for one incoming credit and one rule version) | Done, Needs attention (one or more lines or the whole run could not complete, CON-15), Done after re-run |

### Income, chains and rounding (decisions D3 and D5)

- **Every Confirmed credit into a wallet is income for that wallet** and triggers that wallet's Active split rules. Credits include: a deposit from mobile money, a contribution or a late fee paid into the group wallet, a transfer received from a person or from another wallet (WAL-12, WAL-13), and a Split line received from another rule. Not income: a reversal or refund entry, a Fee line, a Rounding line, and anything not Confirmed. What the ledger chip says (Contribution, Penalty, Split, and so on) never changes whether a credit is income.
- **Rules therefore chain.** Wallet A sends a share to B; B receives a credit, so B's own rules run on it, and so on. Depth counts hops from the wallet where the money first arrived. Two safeguards are mandatory: a rule that would let money come back to a wallet it already passed through is blocked at save time and skipped at run time (cycle detection, owned by RUL-06), and a chain longer than `split_chain_depth_max` is blocked in the same way. Every Split line carries the rule name, the rule version and its hop number, so the chain can be read from the ledger.
- **Rounding.** For one incoming credit and one rule, each destination receives its percent of the credit rounded down to a whole ariary. The part that stays in the wallet is the credit minus the whole-ariary floor of (credit times the sum of percents divided by 100). The difference between that floor and the sum of the rounded-down destination amounts is the **rounding amount**. It is always under 1 ariary per destination line, and it is zero when the credit divides exactly. Worked example: credit 10 Ar, three destinations at 33, 33 and 34 percent. Exact shares are 3.3, 3.3 and 3.4. Destinations get 3, 3 and 3. The allocated total is 10. The rounding amount is 1 Ar. Nothing stays in the wallet. Destinations plus rounding plus the part that stays always equal the credit, to the ariary.
- **The rounding amount goes to Gereo.** It is written as its own ledger line, classified Rounding, from the wallet to Gereo's platform income account, never to a wallet of the group. It is shown on the split receipt and in the ledger thread, it is disclosed in the terms the person accepts (ACC-13), and it is a documented platform income line for finance and OPS. A rounding amount of 0 writes no line.

### Decision gate (group changes that need a vote)

Used by CON-02, CON-11 and CON-13. In the MVP, VOT does not link a vote to a plan or rule change (VOT scope), so the gate works with a vote that the person starts from the change screen.

1. When a save is gated, Gereo stores the change as a proposal snapshot (the exact old and new values) with status "Waiting for vote" and offers "Start the vote", which opens the vote form of VOT-01 pre-filled with the change in one plain sentence. The old terms stay in force.
2. The vote uses the quorum and majority of VOT-02. At least two distinct voters other than the person who proposed the change must vote, the same floor that D4 sets for money votes, so one person can never decide alone.
3. When the vote closes as passed (VOT-09), the snapshot can be applied for `change_apply_window_days`. A holder of the permission the change needs taps "Apply the change". Gereo applies the stored snapshot exactly, never an edited copy, links the decision (VOT-13) and writes the audit entry. A vote that fails, an expired window, or an edit of the proposal discards it, and the person is told why.
4. A group with fewer than three members cannot meet the floor in point 2. The gate is then skipped, the change applies directly, and the audit entry says "No vote possible: fewer than three members".
5. The gate settings belong to the holders of Group: edit group. Tightening a setting applies at once. Loosening one (a weaker value) is itself a gated change that follows the loosening pattern of GRP-12 criterion 5.

### Configurable parameters

Every value is a setting. The defaults below are decided here from the evidence cited, to be validated in field interviews. Parameters owned by another epic are in the second table and are not redefined.

| Parameter | Meaning | Default |
| --- | --- | --- |
| `supported_frequencies` | Frequencies a plan can use | Weekly and monthly (groups in `raw/01-group-savings.md` meet on these cycles). Others later |
| `item_open_days_before_due` | How many days before the due date an item appears | 7 for monthly plans, 3 for weekly plans |
| `late_grace_days` | Days after the due date before an item is Late | 0 |
| `reminder_offsets` | When automatic reminders fire relative to the due date | 3 days before and on the due day (hypothesis from raw/07 section 8.8 R-NT3, to test) |
| `late_reminder_max` | Maximum automatic reminders once an item is Late | 2 (raw/07 section 8.3 R-VT7: extra late reminders added no effect in one study) |
| `manual_reminder_min_interval` | Minimum time between two manual reminders to the same member | 48 hours |
| `manual_reminder_note_max` | Maximum characters of the optional note in a manual reminder | 60, so the whole SMS stays under 160 GSM-7 characters |
| `late_fee_*` | Type (fixed or percent), value, repeat (once or per cycle), cap on total fees | Late fee off |
| `failed_payment_grace_hours` | Hours after a failed payment before an item can become Late with a fee | 24 |
| `plan_amount_max` | Maximum amount of one contribution item | The lowest `DEPOSIT_MAX_PER_TX` in force (WAL), so no item can be unpayable |
| `split_max_destinations` | Maximum destination lines on one wallet | 5 (raw/07 R-G4: 5 to 7 shown before "Other"). Same value as RUL `SHARE_MAX_DESTINATIONS` |
| `split_chain_depth_max` | Maximum number of hops in a rule chain | 3 (raw/07 R-RB4). Same value as RUL `RULE_CHAIN_DEPTH_MAX` |
| `split_change_requires_vote` | Group setting: which split rule changes go through the decision gate: Never, Always, or Above N points | Always for a change to a percentage, a destination or the timing of an Active rule, and for adding a rule to a wallet that already has Active rules. Creating the first Active rule on a wallet, pausing, resuming and ending are not gated |
| `split_change_vote_points` | The N of "Above N points": largest move of one destination share allowed without a vote | 10 |
| `plan_change_requires_vote` | Group setting: which plan changes go through the decision gate: Never, Amount increase, or Any change | Amount increase. Turning a late fee on or raising it counts as an amount increase |
| `change_apply_window_days` | Days a passed vote can still be applied | 7 |
| `split_escalation_hours` | Time after which an unresolved split run opens a support ticket for operators | 24 |

Owned elsewhere and used here as they are:

| Need | Owner and parameter |
| --- | --- |
| Wait before an unread push becomes an SMS; SMS retries; batching of more than five notifications | NTF: `ntf.sms_window.<type or class>`, `ntf.sms_max_retries`, `ntf.sms_retry_backoff`, `ntf.batch_threshold` |
| Quiet hours | NTF: `ntf.quiet_hours_default` (NTF-09) |
| SMS allowance and cost per group | NTF: `ntf.group_sms_allowance` (NTF-06) |
| Time with no provider answer, polling | WAL: `PENDING_TIMEOUT`, `STATUS_POLL_INTERVAL`, `STATUS_POLL_MAX` |
| Retries of a failed rule run | RUL: `RULE_RETRY_MAX`, `RULE_RETRY_BACKOFF` |
| Age after which a reconciliation result is stale | WAL: `RECON_MAX_AGE` |
| Age after which a cached ledger is flagged; page size | WAL: `STALE_BALANCE_AFTER`, `HISTORY_PAGE_SIZE` |
| Retention of audit data | WAL: `RECORD_RETENTION_YEARS` |

### Message keys

UI keys: `con.plan.*`, `con.item.*`, `con.pay.*`, `con.latefee.*`, `con.split.*`, `con.ledger.*`, `con.perm.*`. Errors for the circle and depth checks reuse `err.rul.cycle`, `err.rul.same_wallet` and `err.rul.chain_too_long` (RUL-06). Notifications use the base keys of the NTF catalogue (`msg.con.<event>`, with `.push`, `.sms` and `.inapp` variants) and no CON-only notification key:

| Event in this epic | NTF catalogue row and base key |
| --- | --- |
| Plan created, changed, paused or ended (parameter `change`) | EV-CON-01 `msg.con.plan_changed` |
| Contribution due soon, due today, overdue | EV-CON-02 `msg.con.due_soon`, EV-CON-03 `msg.con.due_today`, EV-CON-04 `msg.con.overdue` |
| Manual reminder | EV-CON-05 `msg.con.reminder_manual` |
| Payment received, payment failed | EV-CON-06 `msg.con.payment_received`, EV-CON-07 `msg.con.payment_failed` |
| Daily late summary to holders of send reminder | EV-CON-09 `msg.con.late_summary` |
| Exemption granted or lifted (parameter `state`) | EV-CON-10 `msg.con.exempted` |
| Late fee applied | EV-CON-11 `msg.con.penalty_applied` |
| Split executed, split rule changed | EV-CON-12 `msg.con.split_executed`, EV-CON-13 `msg.con.split_changed` |
| Split run needs attention | No catalogue row yet: `msg.con.split_failed`, to be added to NTF as Important, in-app, push and SMS fallback, paid by the group |

All SMS templates must be GSM-7 safe and under 160 characters (linted in CI, see [design-foundations.md](../../research/design-foundations.md) section 4 and XCT-12). Amounts display as `12 500 Ar`: integer ariary, space grouping, no decimals, identical in Malagasy, French and English (XCT-02).

### Ledger vocabulary used here

Every ledger row carries a classification chip from a controlled list: Contribution, Penalty, Income, Split (always followed by the rule name), Rounding, Expense, Transfer, Fee, Share-out, Reversal. Income is the chip of a credit from outside the group that is neither a Contribution nor a Penalty (for example a mobile money deposit or a transfer received). The chip describes the row; whether a credit triggers split rules is decided by the income rule above. Corrections are reversing entries with a reason, never edits (WAL-18). The list adds Rounding to the one in WAL-15, which must adopt it.

---

## Stories

### CON-01 Create a contribution plan

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (or Group founder, who holds all permissions at the start)
**Permission needed:** Contribution plan: edit
**Tags:** audit

**Story:** As a permission holder, I want to create a contribution plan with an amount, a frequency, a due date and an optional late fee, so that every member knows what to pay and when, and nobody calculates by hand.

**Conversation:** The contribution plan is the first thing a founder like Sara must finish. Calculating contributions by hand is problem 7 in info.md. Table stakes: plan with optional penalty ([competitive-analysis.md](../../research/competitive-analysis.md) section 5). Late fee is optional and off by default because rigid late rules can hurt a member who pays late for a legitimate reason (`raw/07-ui-ux-best-practices.md` section 8.1, MicroSave note; section 9). The plan summary sentence mirrors the "what you see is what you set" principle of the rule builder (`raw/07` section 8.2 R-RB2). Single amount for all members in the MVP: per-member amounts are deferred, see Open questions. See also `raw/01-group-savings.md` section 13 (table stakes 2) and `raw/08-competitor-ux-comparison.md` section 6.6.

**Preconditions:** The group exists and has a group wallet. The person holds Contribution plan: edit. No active plan exists on that wallet (see criterion 6).
**Trigger:** The person opens "Set up contributions" from the group home or an empty-state prompt.

**Acceptance criteria:**
1. The form asks, in this order: plan name, amount (integer ariary, number pad), frequency (from `supported_frequencies`), first due date, end date (optional), destination wallet (defaults to the group's main wallet), who is covered (all current members by default), late fee (toggle, off by default; shown only once CON-09 is released, until then the form has no late fee field). A summary sentence (key `con.plan.summary`, for example "Each member pays amount every month on the 25th, starting on date, into wallet") updates as the person types and stays visible above the save button.
2. Validation is inline and by the field, with an error summary at the top that takes focus. Amount must be a whole number of at least 1 Ar and at most `plan_amount_max`. First due date must be today or later. A due day of 29, 30 or 31 falls on the last day of shorter months and the summary says so. Typed input is kept after an error (key `con.plan.error.*`).
3. Turning on the late fee reveals type (fixed amount or percent), value, grace days and repeat rule, within the limits of `late_fee_*`. With the toggle off the summary says there is no late fee.
4. Before saving, a preview shows the next three due dates, the number of covered members and the expected total per cycle (members x amount). The preview is arithmetic only and writes nothing.
5. Saving creates the plan with status Active and generates items according to `item_open_days_before_due`. Each covered member receives `msg.con.plan_changed` with parameter `change` = created (push, then SMS if the push is unread within the NTF window, NTF-05) because it creates a payment obligation.
6. One active plan per group wallet in the MVP. A second creation attempt shows "A plan already exists" with a link to edit it. Extra, one-off collections belong to ANN-04 (special contribution campaign), not here.
7. States: loading shows a skeleton form. Offline: the draft is kept on the device and Save is disabled with "Saving needs a connection" and the last-synced time. If the save fails server-side, no member is notified, no item exists, the draft is kept and the person sees what happened and a retry button.
8. Permission: a person without Contribution plan: edit does not see the create button. A direct link shows a message naming the missing permission and who in the group holds it (raw/07 section 8.5 R-PM7). The server enforces the check, not only the interface.
9. Audit: audit entry `plan.created` with who, when and all values. No ledger entry is written because no money moves.
10. Accessibility and language: the amount field announces the grouped value (for example "twelve thousand five hundred ariary"). The date field has a typed alternative to the picker. Frequency and summary use full words, tested in Malagasy and French (summary text can expand 200 percent).

**Data:** Contribution plan (write), Contribution (items, write), Membership (read), Wallet (read), Notification (write), Audit entry (write).
**Depends on:** GRP-01 (group and group wallet), GRP-05 (members), WAL-01 (wallet), NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: one amount for all members in the MVP. Per-member amounts (for example a half share) are a later candidate, to be raised only if field interviews show groups need them; the cost is a per-member amount on every item, board and export. Closed: the maximum amount is `plan_amount_max`, the lowest per-transaction deposit limit in force, so an item can never exceed what one payment can carry. Closed: a member who joins mid-cycle starts at the next due date, with no proration, because proration needs a per-member amount.

---

### CON-02 Edit, pause and end a plan, changes apply to future due dates only

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Contribution plan: edit (delete needs Contribution plan: delete)
**Tags:** audit

**Story:** As a permission holder, I want to change, pause or end the plan without disturbing what members already owe, so that nobody finds their past or current amount rewritten.

**Conversation:** Rule from info.md: a changed rule never rewrites history. The same discipline applies to plans: an item keeps the terms it was created with. Members dislike surprise changes to money obligations, and changes to money-out rules may need a vote (`raw/07` section 8.5 R-PM5). Stanbic lets treasurers configure invoices but not their effect on past ones (`raw/08` section 6.6). Ending is the normal way to stop a plan; deleting is restricted so that history is never lost.

**Preconditions:** An Active or Paused plan exists.
**Trigger:** The person opens the plan and taps Edit, Pause or End.

**Acceptance criteria:**
1. Edit covers amount, frequency, due day, late fee settings and end date. Before saving, a "What changes" screen (key `con.plan.change_summary`) states the first due date the change applies from and lists the items that keep the old terms.
2. Items already generated, whether Upcoming, Pending, Late, Processing or Paid, never change. Payments and history are untouched. The next generated item uses the new terms.
3. Pause: the person picks a resume date or "until I resume". While paused no new items are generated, existing open items stay due, and the plan chip shows Paused on every plan screen.
4. End: no new items are generated after the last item already generated. Open items stay collectible until paid or exempted, and the confirmation sentence lists how many. An Ended plan is read-only with a "Copy into a new plan" action. An Ended plan is never reactivated, so its history stays closed.
5. Delete is offered only to a holder of Contribution plan: delete and only when no payment (even Failed) and no Paid item exists. Otherwise the screen explains that the plan can only be ended, so history stays.
6. If `plan_change_requires_vote` applies to the change (by default an amount increase, including turning a late fee on or raising it), Save follows the decision gate in the shared definitions: the change is stored as a proposal, the plan shows "Change waiting for vote" and the old terms stay in force until the vote passes and a holder applies it. Pause and End are never gated.
7. Notifications: a saved change, pause or end sends `msg.con.plan_changed` with parameter `change` = changed, paused or ended to every covered member with the effective date (push, SMS fallback if unread, NTF-05). Exactly one message per save, and none while a change is only waiting for its vote.
8. Concurrent edit: if another holder saved first, the person sees who saved and when, and must review the new version before saving again. Nothing is silently overwritten.
9. States: offline shows the plan read-only from cache with the last-synced time and "Editing needs a connection". A failed save keeps the inputs and tells the person nothing changed.
10. Audit: each change is an audit entry with before and after values, who, when and an optional note. No ledger entry is written.

**Data:** Contribution plan (write), Contribution (write for future items only), Decision (optional link), Audit entry (write), Notification (write).
**Depends on:** CON-01, VOT-01, VOT-02, VOT-09, VOT-13, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: reactivating an ended plan does not exist, only a copy, because one active plan per wallet and a clean history matter more than saving a few taps. Closed: every amount increase needs a vote by default (`plan_change_requires_vote` = Amount increase) because it raises what each member owes (raw/07 section 8.5 R-PM5); a group may change the setting under the decision gate. Closed: when a member leaves, open items follow GRP-16 and the Cancelled definition in the shared definitions.

---

### CON-03 Member's due items and history

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own items)
**Tags:** offline

**Story:** When I open the app and wonder whether I owe my group anything, I want to see what is due, what is late and what I already paid, so I can act in one tap or relax.

**Conversation:** "What needs me now" is the first block of the home (`raw/08` section 6.2). Stanbic leads with outstanding invoices. Members like Rasoa often have little data, so this screen must work offline from cache (conventions section 2; `raw/07` section 4). Never show "No records" while loading (`raw/07` section 2.3). Contribution history is also the member's own proof of payment.

**Preconditions:** The person is a member of a group with an Active or Paused plan, or has past items.
**Trigger:** The person opens "My contributions" from the group or the home dashboard.

**Acceptance criteria:**
1. The top block lists items that need action, Late first, then Pending, each with amount, due date, status chip (icon + word + colour) and a Pay button. A headline sentence states the total owed (key `con.item.owed_summary`).
2. Below it, history lists Paid, Exempt and Cancelled items by date with amount, paid date (or the reason, for Cancelled) and receipt reference. A line above the history says "You contributed [total] this year", the same figure as CON-19. Filters: period and status. The list loads `HISTORY_PAGE_SIZE` rows first, then "Show more".
3. Tapping an item opens detail: cycle, amount, due date, late fee if any (shown as its own Penalty line), status, receipt reference, and for Exempt the scope and the reason recorded for this member, never the reason recorded for another member.
4. Empty states: a member with no plan sees one sentence ("Your group has no contribution plan yet") and, if they hold Contribution plan: edit, a button to create one (CON-01). A member with nothing due sees "You are up to date" and the next due date.
5. Loading shows skeleton rows, never an empty message.
6. Offline: the full screen is readable from cache with a "Last synced hh:mm" banner. The Pay button is disabled with the explanation "Paying needs a connection" (money moves online only). Any item that changed on the server since the cache shows its true state after sync.
7. A Processing item shows its transaction status word and elapsed time, with a link to CON-05 handling. It is not counted as owed twice.
8. Notifications: none created by this story. Tapping a due or late reminder deep-links to the exact item (`raw/08` section 6.12).
9. Accessibility and language: amounts never clip at 200 percent font scale; status is announced as text ("Late, due 25 October"); all dates show weekday and month in words in the person's language.

**Data:** Contribution (read), Contribution plan (read), Transaction (read), Membership (read).
**Depends on:** CON-01, WAL-14 (transaction reference), XCT-04 (offline cache).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a member sees a yearly total of their own contributions (criterion 2), not a lifetime total, so the figure matches CON-19 and is never blended with the group's money. Closed: a member sees their own Cancelled items with the reason, because a hidden item looks like a hidden debt.

---

### CON-04 Pay a contribution invoice-first

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own item)
**Tags:** legal-gate, ledger, audit

**Story:** As a member, I want to pay a contribution from a pre-filled item, see the fee before I confirm, and receive a receipt with a reference, so that I trust where my money went.

**Conversation:** Invoice-first: the item is pre-filled and the member chooses nothing but the confirmation (Stanbic, `raw/08` section 6.6). Avoid making the member leave the app to type a paybill and a composed account number (Stanbic Q28). Fee shown before confirmation; cross-network payouts cost 3 to 10 times more (`raw/03-madagascar-mobile-money.md` section 7.1 item 4). One decision per screen at the money moment, PIN screen repeats amount and recipient (design-foundations section 3 and 4; `raw/07` section 2.4 R-C2 and R-C6; section 2.7 R-A2). Fee as its own ledger line (`raw/07` section 2.5 R-F5). Moves client money: legal-gate.

**Preconditions:** The member has an open item (Pending or Late), is online, has a PIN, and holds the identity tier required by the amount (ACC-07). A wallet or mobile money account is available as the source.
**Trigger:** The member taps Pay on an item.

**Acceptance criteria:**
1. The review screen shows on one screen: group and plan name, cycle, amount (fixed to the item, see criterion 4), late fee line if due, fee line (always present, "Fee: 0 Ar" when none), total taken, source (member wallet or mobile money number), and the effect ("Your wallet goes from 80 000 to 30 000 Ar" when paying from the wallet). Fee and total update live. The primary button names the action and amount ("Pay 10 000 Ar").
2. The PIN screen repeats the amount and the group name and carries "Gereo will never ask for your PIN or code". Paying from mobile money hands off to the provider confirmation from inside the flow without asking the member to type a number (the provider name is shown on the screen).
3. Success shows a receipt with amount, fee, total, time, status Confirmed, item cycle and a short copyable reference ID (key `con.pay.receipt`). A "Share receipt" action produces an image or text without the member's phone number. The receipt on screen is the primary confirmation (`msg.con.payment_received.push`); an SMS (`msg.con.payment_received.sms`) is sent only under the fallback rule of NTF-05, for example when the member has no app or the push was not opened.
4. Business rule: the amount is fixed to the item, so partial payment and overpayment are refused in the MVP. The only editable choice is the source: member wallet balance or mobile money, one source per payment, never both. If the item has an outstanding late fee, the member can pay the item and the fee together or the item first. The member pays any provider fee on top of the item, so the group wallet always receives the full item amount.
5. Insufficient wallet balance is detected while the member types or selects the source, before the PIN, with a next step ("Add money" or "Pay with mobile money"). Identity tier too low shows what unlocks and the ariary limit, and starts verification (ACC-07) without losing the item.
6. Ledger: Confirmed writes balanced entries: member wallet to group wallet, classified Contribution, with the item reference and plan name. The fee is a separate Fee line on the member's own history and on the receipt; the group ledger shows the contribution at its full amount. When paid from mobile money, a deposit into the member wallet precedes it (WAL-07). The Contribution entry is a Confirmed credit into the group wallet and so is income for it: the wallet's split rules run on it (CON-14). The item becomes Paid. Audit entry written with member, time, reference.
7. Idempotency: a double tap or a duplicate provider callback creates one payment only. The same item cannot be paid twice while a payment for it is Processing or Paid.
8. First-time payee pause does not apply (the group wallet is a known destination), but a new device shows the standard money-out cooling limit and confirmation pause (ACC-05, WAL-10).
9. Offline: Pay is disabled with the explanation and the last-synced banner; no payment is queued silently.
10. Accessibility and language: amounts, fee and total are read in full by a screen reader; the Pay button label is localised with the amount; touch targets are at least 48 by 48 dp.

**Data:** Contribution (write), Transaction (write), Ledger entry (write), Wallet (read, write), Notification (write), Audit entry (write).
**Depends on:** CON-03, WAL-06, WAL-07, WAL-12, WAL-14, ACC-03, ACC-05, ACC-07, NTF-05, XCT-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the member bears the provider fee, shown before confirmation, so the plan amount means what it says for the group; Gereo may later absorb part of it through `FEE_TABLE_GEREO` without changing this story. The fee amounts themselves depend on Vanilla Pay terms (external, see the epic's open questions). Closed: partial payment and overpayment are refused in the MVP. Closed: the member pays from the wallet balance or from mobile money, one source per payment, and a mobile money payment passes through the member wallet in the ledger. Pay on behalf of another member with a second confirmation (StokFella, `raw/08` section 6.6): later.

---

### CON-05 Handle pending and failed contributions

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** legal-gate, ledger, sms, audit

**Story:** When I paid my contribution and the app does not say Confirmed, I want to know whether my money left my account and what happens next, so I do not pay twice or lose money.

**Conversation:** "Where is my money?" is the first complaint class on every money app ([competitive-analysis.md](../../research/competitive-analysis.md) section 4). Pending must say what Gereo is waiting for; Failed must say whether money moved (`raw/07-ui-ux-best-practices.md` section 2.3 R-T2, R-T3, section 2.6 R-E2, R-E3). Provider callbacks can time out or double-notify and operators have outages (`raw/03` section 7.1 items 5 and 6; `raw/08` section 6.3). A member whose payment was pending at the deadline should not be fined for the provider's delay.

**Preconditions:** A payment for an item has been started (transaction Initiated).
**Trigger:** The provider answers late, answers failure, or does not answer.

**Acceptance criteria:**
1. Pending: the item shows Processing with the word "Pending", elapsed time, what Gereo waits for ("Waiting for Vanilla Pay") and what to do ("Nothing. We will message you", key `con.pay.pending`). The member can leave the screen; a push (and SMS if the app is closed) confirms the result later.
2. Failed: the message says explicitly "No money was taken" or "Money was taken, refund in progress, reference X", the reason in plain words (provider unavailable, wrong PIN, insufficient funds, member cap exceeded, declined) and one button for the next step ("Try again", "Choose another source"). Key `con.pay.failed.*`.
3. Timeout: if the provider has not answered after `PENDING_TIMEOUT` (WAL-07 criterion 6), the system polls as WAL-07 defines, and if the outcome stays unknown the transaction is Needs attention and the item shows a "Report this payment" button that pre-fills the reference (WAL-14). Gereo never auto-retries a payment of unknown outcome.
4. Business rule on lateness: lateness is judged on the time the payment was initiated, not the time of confirmation. An item that was Processing at the deadline does not become Late until the transaction is Failed, and then `failed_payment_grace_hours` apply before the late fee.
5. Status transitions are idempotent: a provider that notifies twice, or a Failed after a Confirmed, never changes a Confirmed payment. A Confirmed after a Failed or Cancelled (late provider message) is never credited automatically: it is stored, flagged Needs attention and sent to operators (WAL-07 criterion 5, OPS-05), and the item stays as it was until an operator decides.
6. Ledger: Pending and Failed write no Contribution entry. If money was debited and then refunded, a reversing entry with a reason and the reference is written. Every status change is audited with time and source (callback, poll, operator).
7. Offline: the member sees the last known status and last-synced time. Status changes appear after sync. Pay is disabled for that item while its payment is Processing.
8. The shareable status page shows the reference and status so the member can quote it by SMS to support (`raw/08` section 6.12 open opportunity), with no phone number.
9. Notifications: result by push `msg.con.payment_received.push` or `msg.con.payment_failed.push`, and SMS `.sms` variants when the push was not opened within the NTF window (NTF-05). SMS under 160 GSM-7 characters with the reference.

**Data:** Transaction (read, write), Contribution (write), Ledger entry (write), Notification (write), Audit entry (write), Support ticket (create from Report).
**Depends on:** CON-04, WAL-07, WAL-11, WAL-14, WAL-18, OPS-04, OPS-05, OPS-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `failed_payment_grace_hours` defaults to 24 and the timeout is WAL's `PENDING_TIMEOUT`. Still open and external: what the provider returns on refunds and how long a refund takes (Vanilla Pay terms unknown, `raw/03` section 3.2). Default used until then: any refund is shown as "refund in progress, reference X" and closed by an operator after the provider confirms.

---

### CON-06 Member status board

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder, and Member (read)
**Permission needed:** Contribution plan: view
**Tags:** offline

**Story:** As a member who can view the plan, I want to see who has paid, who is pending and who is late this cycle, so that the group knows where it stands without phone calls.

**Conversation:** Per-member paid, pending, late is table stakes and the core of Mamy's job ([competitive-analysis.md](../../research/competitive-analysis.md) section 5; `raw/08` section 6.4). Layout from `raw/07-ui-ux-best-practices.md` section 8.1: headline sentence first ("12 of 15 members have paid this month"), then a member list with chips. Credibility scores as public shame are to avoid (`raw/08` section 6.4); late members are never named in group notifications (raw/07 R-NT8).

**Preconditions:** A plan exists. The person holds Contribution plan: view.
**Trigger:** The person opens the board from the plan or the group home.

**Acceptance criteria:**
1. The headline sentence gives counts ("12 of 15 members have paid", key `con.item.board_headline`) with a progress bar, total collected and total expected for the cycle, in integer ariary.
2. The list shows each covered member with name, status chip (icon + word + colour), amount and the date paid or due date. Order: Late, Pending, Processing, Upcoming, Paid, Exempt. Cancelled items appear only in past cycles, with their reason. A cycle selector shows past cycles; history is read-only.
3. Filters: status and name search. A summary strip counts each status. Counts always equal the number of rows.
4. Late members appear in the list with the days late. No public score, ranking or badge is computed. Names of late members are visible only on this board and to holders of the view permission, never in notifications to the group.
5. Rows expose actions only to holders of the matching permission: "Send reminder" (CON-07, Contribution plan: send reminder), "Exempt" (CON-10, Contribution plan: exempt member). Without the permission the control is absent and a note tells who can use it.
6. Empty state: a plan with no items yet explains when the first items appear (`item_open_days_before_due`). Loading shows skeleton rows.
7. Offline: the board is readable from cache with "Last synced hh:mm"; actions are disabled with an explanation.
8. Real time: when a payment is confirmed, the board updates without reload on an open screen (or within the next sync when data-saver mode is on).
9. Accessibility and language: status is conveyed by word and icon; the list reflows at 320 px; a screen reader reads "Rado, Late, 5 days, 10 000 Ar".

**Data:** Contribution (read), Membership (read), Contribution plan (read), Transaction (read).
**Depends on:** CON-01, CON-04, GRP-05, GRP-07, XCT-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: members without the view permission see the headline counts only, never names. Closed: a member cannot hide their own name from holders of the view permission in the MVP, because the people who chase payments need to know who owes; the protection against shame is that names stay on this board and out of every notification (criterion 4).

---

### CON-07 Send a reminder to a late or pending member

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Contribution plan: send reminder
**Tags:** sms, audit

**Story:** When a member's contribution is late and I know the person, I want to send a private reminder in my own name, so I can chase kindly without calling.

**Conversation:** Today Mamy phones people one by one. A personal message moved repayment for repeat borrowers in one study; rewording alone did not (`raw/07` section 8.8 evidence and R-NT6). Shame is a risk, so one private reminder first and group-level counts only (R-NT8). Show the SMS cost to the group owner before sending (`raw/08` section 6.12 open opportunity). Do not spam: limit frequency per member.

**Preconditions:** The member has an item that is Pending or Late (not Paid, Exempt or Processing). The sender holds Contribution plan: send reminder and is online.
**Trigger:** The sender taps "Send reminder" on a board row, or selects several rows and taps "Remind selected".

**Acceptance criteria:**
1. The sender sees a preview of the message with their own name, the amount, the due date and the plan name, then taps "Send reminder". An optional short note is allowed, up to `manual_reminder_note_max` characters.
2. The reminder goes by push first and by SMS if the push is unread within the NTF window (NTF-05). Members with no app or no push token get the SMS directly. The preview shows how many people will receive an SMS and the estimated cost, as NTF-06 criterion 3 defines; the SMS is paid from the group's allowance (class Gr).
3. Rate limit: a member cannot be reminded again within `manual_reminder_min_interval`; the row shows "Reminded 2 days ago by Mamy" and the button is disabled with that explanation.
4. Items that are Paid, Exempt or Processing are excluded from a bulk send, and the confirmation lists how many were skipped and why.
5. The message is private to the member. No group announcement names late members. Key `msg.con.reminder_manual` (`.push`, `.sms`), GSM-7 safe, under 160 characters, with a reference to the item.
6. Quiet hours follow NTF-09: a manual reminder sent inside quiet hours is held and delivered at their end, push and SMS alike (SMS in quiet hours only for security events). The sender is told the delivery time.
7. The sender sees a delivery log per recipient, with the delivery vocabulary of NTF-02 (sent, delivered, opened, failed). A failed SMS marks the member "Unreachable" on the board for holders of the view permission (NTF-13).
8. Offline: the action is disabled with "Sending needs a connection". No reminder is queued on the device.
9. Audit: entry `reminder.sent` with sender, recipient, channel, time, item. No ledger entry.

**Data:** Contribution (read), Notification (write), Audit entry (write), Membership (read).
**Depends on:** CON-06, NTF-02, NTF-05, NTF-06, NTF-09, NTF-13, GRP-07.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: reminder SMS are paid by the group from its monthly allowance (class Gr, NTF-06), and the sender sees the estimate first; the allowance size and the final payer rule are NTF's open question. Closed: a note is allowed in the first version, at most `manual_reminder_note_max` characters, and it is not kept after sending (CON-20 criterion 7).

---

### CON-08 Automatic reminders, push then SMS

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (configured by Contribution plan: edit)
**Tags:** sms

**Story:** When a contribution is due soon or overdue, I want the system to remind the member by push and then by SMS if they have not seen it, so that nobody forgets and the treasurer does not have to call.

**Conversation:** Reminders are table stakes and the second-biggest manual job (info.md problem 6 and 7). Push first, SMS as a first-class channel because only a minority of adults own smartphones ([competitive-analysis.md](../../research/competitive-analysis.md) sections 1 and 2; design-foundations section 3 rule 7). Cadence defaults are hypotheses (`raw/07-ui-ux-best-practices.md` section 8.8 R-NT3, R-NT4, R-NT5, R-NT7). Extra late reminders add little (R-VT7, Karlan et al., single study), so the number is capped.

**Preconditions:** A plan with open items exists and reminders are enabled for the plan.
**Trigger:** A scheduled job runs at each `reminder_offsets` point, and at each late step up to `late_reminder_max`.

**Acceptance criteria:**
1. For each item that is Pending or Late, the system sends a push at each configured offset (default: 3 days before and on the due day) with amount, due date and a deep link to the item (keys `msg.con.due_soon`, `msg.con.due_today`, `msg.con.overdue`, `.push` variant).
2. If the push is unread within the NTF window (NTF-05), or the member has no push token or no app, the system sends one SMS (the `.sms` variants of the same keys) containing amount, due date, group name and reference, GSM-7 safe, under 160 characters, never naming other members.
3. Items that are Paid, Exempt, Cancelled or Processing are skipped. A payment that confirms after the job built its list but before sending cancels the pending reminder.
4. Idempotency: a retried job never sends the same reminder twice to the same member for the same offset.
5. The number of automatic reminders on a Late item is capped by `late_reminder_max`, after which the board shows "Reminders stopped" and only a manual reminder (CON-07) can follow. Each day after the due date, holders of Contribution plan: send reminder receive the late summary `msg.con.late_summary` (in-app and push, counts and the board link).
6. Batching: if a member would receive more than `ntf.batch_threshold` notifications at once, they receive one summary (NTF-08). Reminders are scheduled outside quiet hours by design (NTF-09 criteria 3 and 4), so a due-day reminder is never left to fall in the night.
7. Language: each message is sent in the member's language. A missing translation falls back to French, then English, and is flagged to operators.
8. States: a failed SMS retries as NTF defines (`ntf.sms_max_retries`, `ntf.sms_retry_backoff`) then marks the member "Unreachable" on the board and logs it (NTF-13); a provider outage queues the SMS and shows a delivery warning to holders of the view permission.
9. SMS volume and cost are shown in the group's SMS usage screen (NTF-06), which holders of Group: set notification settings can read and change; it is not repeated here. A holder of Contribution plan: edit can turn automatic reminders off per plan. A member can stop SMS or push in their own preferences (NTF-04, NTF-10); the item and its status stay visible in the app either way.
10. Audit and delivery log: each send is stored with channel, time and result, visible per recipient to holders of Contribution plan: send reminder. No ledger entry.

**Data:** Contribution (read), Notification (write), Device (read), Audit entry (write).
**Depends on:** CON-01, CON-03, NTF-04, NTF-05, NTF-06, NTF-08, NTF-09, NTF-10, NTF-13, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `late_reminder_max` defaults to 2. Closed: the SMS wait belongs to NTF (`ntf.sms_window.*`), not to this epic. Closed: quiet hours never swallow a due-day reminder, because NTF-09 schedules reminders outside them. Still open and external: the real SMS cost and aggregator quote for Madagascar (competitive-analysis section 10). Default used until then: no SMS price is shown, only the count of SMS (NTF-06).

---

### CON-09 Apply a late fee

**Type:** Job story (system behaviour)
**Priority:** P1
**Release:** MVP
**Actor:** System
**Permission needed:** none (configured by Contribution plan: edit; waived by Contribution plan: exempt member)
**Tags:** legal-gate, ledger, audit

**Story:** When an item stays unpaid past the due date and grace period, I want the plan's late fee to be added automatically and visibly, so that the rule is fair, the same for everyone and nobody calculates it by hand.

**Conversation:** Optional penalty is table stakes (`raw/01-group-savings.md` section 13; `raw/08` section 6.6 "late handling with a visible remedy"). Penalties appear as a named classification in the ledger (Stanbic vocabulary, `raw/08` section 6.3). Rigid rules can hurt a member who pays late for a legitimate reason (`raw/07` section 8.1, section 9): waiving must be possible and logged. Legality of penalties charged on client money is part of the `legal-gate`.

**Preconditions:** The plan has a late fee configured. An item reaches Late (due date plus `late_grace_days` passed, not Processing, not Exempt).
**Trigger:** Daily job at the end of the grace period.

**Acceptance criteria:**
1. When an item becomes Late, a Penalty line is added to the item according to `late_fee_*` (fixed amount, or percent of the item amount rounded down to a whole ariary) and the cap on total fees per item. The member sees "Late fee: X Ar" on the item detail with the rule in words (key `con.latefee.applied`).
2. The late fee is a due amount, not an automatic debit. No money moves until the member pays (CON-04, which can pay item and fee together or separately). Fee never compounds: a fee on a fee is not allowed.
3. Repeat rule: when the fee repeats per cycle, a new Penalty is added only once per cycle and never beyond the cap. The plan setting that was in force when the item was generated applies, not a later edit (CON-02).
4. A payment that was Processing at the deadline (CON-05 criterion 4) does not trigger a late fee. An Exempt item never receives a fee. A holder of Contribution plan: exempt member can waive one fee from the item detail ("Waive this fee") with a required reason, without exempting the item; no other permission is needed. Exempting the item (CON-10) waives its fee too.
5. Notification: the member receives `msg.con.penalty_applied` (push, SMS fallback, NTF-05) with amount and due date; the group receives no message naming the member. The UI line on the item detail uses `con.latefee.applied`.
6. Ledger: applying the fee writes no ledger entry (no money moves) and the fee is not a receivable in the ledger. Paying it writes a Penalty entry from member wallet to group wallet, classified Penalty and linked to the item. Like every credit into the group wallet it is income for that wallet and the wallet's split rules run on it (CON-14). A waived fee writes an audit entry only. A fee paid by mistake is corrected by a reversing entry.
7. Idempotency: the job is safe to retry; an item receives each fee once.
8. States: offline members see the fee as part of the cached item; Pay is online only. Failed or pending fee payments follow CON-05.
9. Audit: `latefee.applied` and `latefee.waived` with item, member, amount, reason, who waived and when.

**Data:** Contribution (write), Contribution plan (read), Ledger entry (write on payment), Audit entry (write), Notification (write).
**Depends on:** CON-01, CON-04, CON-05, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Still open and external (lawyer): is a late fee allowed at all on client funds. Default used until the opinion is in: the late fee is off in every plan and the feature stays behind its `legal-gate`. Closed: the fee lands in the plan's destination wallet only. Closed: introducing or raising a late fee in a running group counts as an amount increase for `plan_change_requires_vote` (CON-02 criterion 6), so by default it needs a vote. Closed: the fee is not a receivable in the ledger (criterion 6). Closed: waiving a fee needs no separate permission beyond Contribution plan: exempt member.

---

### CON-10 Exempt a member

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Contribution plan: exempt member
**Tags:** audit

**Story:** As a permission holder, I want to exempt a member from one or several contributions with a reason, so that someone in hardship is not chased or fined and the group still has a record.

**Conversation:** Real groups waive contributions for illness, mourning or hardship. Without a record, the treasurer's decision looks arbitrary and trust drops (info.md problem 1 and 8). The exemption is a permission, not a role (conventions section 7). The reason is private to avoid shaming (`raw/07` section 8.1 R-G7; section 8.8 R-NT8).

**Preconditions:** The plan exists. The item or period is not Paid. The person holds Contribution plan: exempt member and is online.
**Trigger:** The person taps "Exempt" on a member's row or item, or on a member's profile.

**Acceptance criteria:**
1. The person chooses the scope: this item, a number of cycles, a date range or "until lifted". A reason is required (short text with presets, such as hardship, illness, other) and the screen states who will see it.
2. The affected items become Exempt: they are excluded from "expected total", reminders and late fees. A pending late fee on those items is waived (see CON-09).
3. Paid items cannot be exempted. Refunding a paid item is not part of this story; the screen explains why the option is unavailable.
4. The reason is visible to the member and to holders of Contribution plan: exempt member only. Other members with the view permission see the chip "Exempt" with no reason.
5. The member receives `msg.con.exempted` with parameter `state` = applied (push, SMS fallback, NTF-05) stating the scope in plain words. The group receives nothing. Lifting the exemption restores the plan from the next unpaid item and sends `msg.con.exempted` with `state` = lifted.
6. An exemption never changes the plan, the amount of other members, or any ledger entry. No second confirmation is needed in the MVP, because no money moves and the exemption is visible in the plan log (CON-20); the compensating controls are criterion 7 and the audit entry of criterion 9.
7. Business rule: a person cannot exempt themselves. The check is server-side and the screen explains it.
8. Offline: the action is disabled with an explanation. No exemption is queued.
9. Audit: each exemption and lift has an entry with who, when, member, scope and reason. No ledger entry is written because no money moves.

**Data:** Contribution (write), Membership (read), Audit entry (write), Notification (write).
**Depends on:** CON-06, CON-09, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: an exempted amount simply never becomes a due item and no ledger event records it. Closed: no second person confirms an exemption in the MVP (criterion 6); revisit if field interviews show groups want separation of duties. Closed: refunding an already paid item is out of scope; it is an ordinary spend from the group wallet that follows SPD and GRP-13, as GRP-16 says.

---

### CON-11 Define income split rules on a group wallet

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, ledger, audit

**Story:** As a permission holder, I want to say what percentage of each income goes to which destination, and when, so that nobody calculates revenue sharing by hand and every member can see the rule.

**Conversation:** Automatic split rules are Gereo's main differentiator and no competitor has them on a group wallet (`raw/01-group-savings.md` section 13 gaps; [competitive-analysis.md](../../research/competitive-analysis.md) section 5). Build the rule as a three-slot sentence (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB1) with a "what happens when money arrives" summary showing the sum and the remainder (R-RB3). The sum may be under 100 percent (info.md). Money moves between wallets of the same group in the MVP; "members" as a destination is out of the MVP because it implies payouts to personal wallets. Under D3 every credit into a wallet is income for it, so rules chain from wallet to wallet; cycles and over-long chains are blocked (R-RB4, RUL-06). Vocabulary: a split rule here is a named set of destination lines; RUL calls each line a share rule.

**Preconditions:** The group has a group wallet and the person holds Wallet: edit rules. At least one destination wallet exists.
**Trigger:** The person opens "Split income" on the group wallet.

**Acceptance criteria:**
1. The rule reads as a sentence: "When income arrives in [wallet], move [percent] to [destination]". The person adds destinations one by one (wallet picker, percent in whole numbers) up to `split_max_destinations` and names the rule in a short text.
2. Timing is chosen once per rule: "On arrival" (default) or "At a set time" (a day of the month and time). The summary states it in words (key `con.split.timing`).
3. The sum of percentages must be at most 100 and each value at least 1. At 101 or more Save is blocked with the exact excess. Under 100, a line states "Stays in [wallet]: N percent". A "what happens when money arrives" summary lists every Active rule on the wallet, their order, the sum and the remainder, and under each destination the rules that will run there in turn, down to `split_chain_depth_max` hops (key `con.split.summary`).
4. The checks of RUL-06 apply as they are written there: a destination cannot be the source wallet (`err.rul.same_wallet`), a rule that would let money come back to a wallet it already passed through is blocked with the path in plain words (`err.rul.cycle`), and a chain longer than `split_chain_depth_max` is blocked (`err.rul.chain_too_long`). The checked rules are all Active, Paused and Waiting-for-vote rules on all wallets of the group.
5. Destinations are wallets owned by the same group, or project-linked wallets (PRJ-03). A move between wallets of the same group is authorised by the rule itself; the approvals of GRP-13 apply to money leaving the group, not to rule moves inside it. "All members (equal shares)" does not exist in the MVP.
6. Before saving, the person must view the preview (CON-12). Saving needs a confirmation that restates the rule in one sentence ("Save: 60 percent to Reserve, 30 percent to Roof project, 10 percent stays"). If `split_change_requires_vote` applies (adding a rule to a wallet that already has Active rules; the first Active rule on a wallet is not gated), Save follows the decision gate in the shared definitions and the rule shows "Waiting for vote" until a holder applies it after the vote passes.
7. Permission: a member without Wallet: edit rules sees the rule read-only with no Edit button; a direct link shows the missing permission and who holds it. Everyone with Wallet: view balance sees the rule in words (transparency).
8. States: loading skeleton; offline read-only from cache with the last-synced time, Save disabled; save failure keeps inputs and states that no rule changed.
9. Audit: entry `splitrule.created` with who, when, rule version number and all values. No ledger entry is written at definition time.
10. Accessibility and language: percent and amount inputs use number pads; the sentence uses the same word order in Malagasy, French and English where grammar allows, and is tested for 2x expansion.

**Data:** Wallet rule (write), Wallet (read), Project (read), Decision (optional link), Audit entry (write).
**Depends on:** WAL-03, RUL-03, RUL-06, RUL-07, GRP-15, PRJ-03, VOT-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed by D3: the rule triggers on every Confirmed credit into the wallet, contributions and late fees included, so `contributions_feed_split` no longer exists. Closed: the chip of a credit (Income, Contribution, Penalty) is set by what it is, not chosen at deposit time, and has no effect on whether rules run. Closed: whole percents only in the MVP, as RUL-03 does. Closed: "members" is not a destination in the MVP; it implies payouts to personal wallets, individual wallet caps (MVola Ar 20M, `raw/03` section 7.1 item 3) and the approvals of GRP-13, and belongs to a later share-out story.

---

### CON-12 Preview a split rule on past income

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules (and Wallet: view history for the real-history preview)
**Tags:** ledger

**Story:** When I am about to save a split rule, I want to see what it would have done with the last incomes, so I can trust it before it touches real money.

**Conversation:** A live preview from real history is the strongest anti-error device for non-expert rule builders and the Expandable Grid study found effective-result views beat rule lists (83.6 percent against 56.5 percent) (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB2, R-RB3; section 8.5). No product documents a preview before enabling (`raw/08-competitor-ux-comparison.md` section 6.5). Rounding must always add up to the original amount (raw/07 section 8.1 R-G3); under D5 the rounding amount goes to Gereo and the preview shows it. This story is the group-wallet counterpart of RUL-04 and uses the same preview component.

**Preconditions:** A draft rule exists (CON-11). The wallet has past Confirmed credits, or the person types a sample.
**Trigger:** The person taps "Preview" while building or changing a rule.

**Acceptance criteria:**
1. The preview shows the last up to `PREVIEW_INCOME_COUNT` (RUL, up to 3) Confirmed credits into the wallet and, for each, what every destination would have received, what would have been rounded to Gereo and what would have stayed, in ariary and percent (key `con.split.preview.line`). It writes nothing to the ledger.
2. The person can type any sample amount instead. Fee-free: the preview shows no provider fee because internal wallet-to-wallet moves have none, and states so. The Rounding line is shown separately and named as going to Gereo.
3. The rounding rule is shown in words, as defined in the shared definitions: each destination receives its percent rounded down to a whole ariary, the part that stays in the wallet is shown, and the remaining ariary (under 1 ariary per destination) is the rounding amount credited to Gereo. Destinations plus rounding plus the part that stays always equal the credit, to the ariary.
4. If a destination would receive 0 Ar for a small credit, the line shows "0 Ar" with a note that no entry is written for it. A rounding amount of 0 shows no Rounding line.
5. Empty state: with no past credit, the preview asks for a sample amount and says so. Loading shows a skeleton. A person without Wallet: view history sees only the sample amount mode, with a note naming the missing permission.
6. The preview also shows the effect of the combined rules on the wallet (`con.split.summary`), including rules paused or waiting for a vote, and what the rules of each destination would then do with what it receives, down to `split_chain_depth_max` hops.
7. Offline: the preview works on cached history and shows the last-synced time. Saving is disabled.
8. No audit entry (nothing changes). Viewing history inside the preview respects the same visibility as the ledger (masked phone numbers).
9. Accessibility and language: the preview table uses rows, not columns, on phones; amounts never clip at 200 percent font scale.

**Data:** Ledger entry (read), Wallet rule (read draft), Wallet (read).
**Depends on:** CON-11, RUL-04, WAL-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed by D5: rounding is rounded down per destination and the leftover goes to Gereo as a visible line, not largest-remainder and not back to the source wallet. RUL-07, RUL-04 and WAL must adopt the same rule so the preview, the ledger and the receipt agree.

---

### CON-13 Change, pause or end a split rule, future income only

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, audit, ledger

**Story:** As a permission holder, I want to change, pause or end a split rule knowing it only affects income that arrives later, and that important changes can need the group's vote, so that history stays intact and nobody changes the sharing alone.

**Conversation:** info.md rules: a modified rule applies only to future income; history is never rewritten; an important change may require a vote according to group settings. Raw/07 section 8.2 R-RB6 states that rule changes in a group wallet are proposals that go to vote, and R-RB7 asks for a one-tap pause. Vote-triggered rule changes are out of v1 in [competitive-analysis.md](../../research/competitive-analysis.md) section 7 and out of the VOT MVP, so the first version gates saving behind a vote that the person starts, as the decision gate in the shared definitions describes. RUL-08 covers pause, resume, edit and delete for every kind of rule; this story adds what is specific to group split rules.

**Preconditions:** A split rule exists. The person holds Wallet: edit rules.
**Trigger:** The person taps Edit, Pause or End on a rule.

**Acceptance criteria:**
1. Each save creates a new rule version. The screen states the effective moment in words: "Applies to income that arrives after hh:mm on date" (key `con.split.change_effective`). Income already received keeps the version in force when it arrived.
2. Past ledger entries are never touched and still show the rule name and version that produced them.
3. "Important change" is decided by the group setting `split_change_requires_vote` (never, always, or when a destination share moves by more than `split_change_vote_points`; default in the shared definitions). When it applies, Save follows the decision gate in the shared definitions: the change is stored as a proposal, the rule shows "Waiting for vote", the old version stays Active until a holder applies the passed change, and if the vote fails nothing changes and the person is told why.
4. Pause: one tap, with a visible "Paused" chip on the rule and the wallet card; credits arriving while paused stay in the wallet and are not split retroactively when the rule resumes. Resume re-runs the circle and depth check of RUL-06. End: the rule stops permanently and keeps its history. Pause, resume and end are never gated.
5. The preview (CON-12) is required before saving a change and compares the old and new outcome on the same sample.
6. All members with Wallet: view balance are notified (digest-friendly) of an applied change with `msg.con.split_changed` (in-app and push). Members are not interrupted by SMS for this. A change that is only waiting for its vote notifies nobody beyond the vote itself.
7. Concurrency: if another holder saved first, the person must review the latest version before saving.
8. Offline: read-only with last-synced time; actions disabled. Failure keeps inputs and states that the live rule did not change.
9. Audit: before and after values, version numbers, who, when, linked vote or decision. No ledger entry is written at change time.

**Data:** Wallet rule (write, version), Vote and Decision (link), Audit entry (write), Notification (write).
**Depends on:** CON-11, CON-12, RUL-06, RUL-08, VOT-01, VOT-02, VOT-09, VOT-13, NTF-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: an important change is any change to a percentage, a destination or the timing of an Active rule, and adding a rule to a wallet that already has Active rules (default of `split_change_requires_vote`). Closed: pause, resume and end need no vote. Closed: the first version uses a person-started vote, not an automatic gate (decision gate in the shared definitions).

---

### CON-14 Execute the split automatically when income arrives

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (rule authorised by CON-11 and, if required, a vote)
**Tags:** legal-gate, ledger, audit

**Story:** When income is confirmed in a group wallet, I want every destination to receive its share immediately and visibly under the rule's name, so that nobody has to do the sharing and every member can see it.

**Conversation:** Automatic execution on every income, with a rule-named ledger entry, is the differentiator of the product (design-foundations section 1 point 4 and section 3 principle 3; `raw/08-competitor-ux-comparison.md` section 6.3 open opportunity "why" line). Money moves on Confirmed, never on Pending, since provider callbacks can time out or double-notify (`raw/03` section 7.1 item 5). Under D3 money produced by a rule is income for the wallet that receives it, so rules chain; the loop and depth safeguards of RUL-06 (`raw/07` section 8.2 R-RB4) are what keep a chain finite. Under D5 the rounding amount goes to Gereo as a visible line and is disclosed in the terms (ACC-13). RUL-07 defines the shared engine for personal and group rules; this story is the reference for what is specific to group wallets (timing At a set time, gated versions, member view).

**Preconditions:** An Active rule version exists on the wallet. A credit (see "Income, chains and rounding" in the shared definitions) reaches Confirmed after the rule version's effective time.
**Trigger:** Credit Confirmed (timing On arrival), or the scheduled time for rules with timing At a set time.

**Acceptance criteria:**
1. On Confirmed, the system calculates each destination's amount as defined in the shared definitions: its percent of the credit rounded down to whole ariary, the part that stays in the wallet, and the rounding amount. The credit is the amount actually credited to the wallet, so a provider fee, which is its own Fee line, is never part of it.
2. All ledger entries of one split run are written in one atomic posting with the credit reference: one balanced entry from the wallet to each destination, classified Split and named with the rule name and version (key `con.ledger.split_line`, for example "40 percent to Savings by rule Share income"), plus one Rounding line to Gereo when the rounding amount is above 0. A destination that cannot receive (closed, or frozen by an operator hold) makes only its own line Skipped, and its share stays in the wallet (CON-15); the other lines go ahead. A ledger error makes the whole run fail and nothing is written. The split receipt (entry detail, CON-16 criterion 3) lists every line, the Rounding line included, and the terms (ACC-13) disclose it.
3. Idempotency: one run per credit and rule version, per line. A duplicate provider callback, a job retry or a reprocess never writes a second split, enforced by a key built from the credit ID, the rule version and the destination.
4. Chains: each Split line is a Confirmed credit into its destination wallet and triggers that wallet's own Active rules by this same story, one hop deeper, up to `split_chain_depth_max` hops. Each hop is its own atomic posting with its own key; if a later hop fails, earlier hops stay done and the money waits in the wallet where the failed hop would have run (CON-15). If the cycle or depth check of RUL-06 fails at run time (for example because another holder changed a rule meanwhile), the affected hop is skipped with reason `cycle_prevented` or `chain_too_long` and nothing is written for it. Every line carries rule name, rule version, hop number and the reference of the first credit.
5. For rules with timing At a set time, the system splits the sum of Confirmed credits received since the last run, including Split lines received from other rules, and the entry lists the credits it covers. A scheduled run that finds no credit writes nothing.
6. Several rules on one wallet each take their percent of the whole credit and run in the order shown in `con.split.summary`; the total can never exceed 100 percent of the credit (enforced at save and again at run; over 100 at run time skips the whole run with reason `percent_over_100`, as RUL-07).
7. Notification: members with Wallet: view history see the run in the ledger feed and, as `msg.con.split_executed` (in-app, Low), in the weekly digest (NTF-14); no push and no SMS for a normal run, as RUL-07 criterion 10. Failures notify as in CON-15. SMS for a normal run only if a group-level critical setting, held by Group: set notification settings, asks for it.
8. A split for a credit that is Pending, Failed or Cancelled writes nothing. If the first credit is later reversed (WAL-18), a reversing set of entries follows down the chain, last hop first, with a reason; the originals stay visible, and the Rounding line is reversed too. If a downstream wallet no longer holds the money, the reversal is Needs attention for operators (WAL-18, OPS-05) and nothing is forced.
9. Audit: every run is recorded with credit reference, rule version, hop, entries written, time. Visible to members who can view history. States: offline members see entries from cache with the last-synced time.

**Data:** Transaction (read), Wallet rule (read), Ledger entry (write), Notification (write), Audit entry (write).
**Depends on:** CON-11, WAL-07, WAL-12, WAL-13, WAL-18, RUL-06, RUL-07, RUL-12, NTF-08, NTF-14, OPS-04, SPD-15, ACC-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: while a wallet is frozen (SPD-15, Wallet: freeze), splits to other wallets of the same group and to Gereo continue, because the money stays inside the group and the freeze exists to stop money leaving; an operator hold ("Held by Gereo", compliance) stops splits as well. Closed by D3: every Confirmed credit is income, so nothing is classified by hand at deposit time. Closed: provider fees are never deducted from the credit before the split, because the fee is its own line and the wallet is credited the net amount.

---

### CON-15 Split execution failure and retry

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, ledger, audit

**Story:** When a split could not run (for example a destination closed), I want to know exactly what happened to the income and to re-run it, so I am sure no money is lost or shared the wrong way.

**Conversation:** Trust depends on exactness: "where is my money?" and administrators who cannot explain a gap are the dominant failure modes ([competitive-analysis.md](../../research/competitive-analysis.md) section 4). Errors must say whether money moved and what to do next (`raw/07-ui-ux-best-practices.md` section 2.6 R-E2). Posting is atomic (CON-14), so a failed run leaves the credit whole in the wallet where it stopped.

**Preconditions:** A credit was Confirmed and a split run could not complete, whole or in part.
**Trigger:** The execution step fails (destination closed or frozen, cap reached, ledger error, rule invalid, cycle or depth check failing at run time).

**Acceptance criteria:**
1. No entry is written for a line that failed or was skipped, and nothing at all is written when the whole run failed. The money stays in the wallet where the failed step would have run (for a first hop, the source wallet; earlier hops of a chain stay done and are shown). The run is marked "Needs attention" with the plain reason (key `con.split.failed.reason.*`) and the statement "The money is safe in [wallet]. Nothing was shared for [destination or rule]."
2. Holders of Wallet: edit rules receive `msg.con.split_failed` (in-app and push; SMS under the NTF fallback rule, NTF-05, because money sharing did not happen, GSM-7 safe, paid from the group allowance). The wallet card shows a "Needs attention" chip until resolved.
3. Automatic retry: transient errors retry up to `RULE_RETRY_MAX` with `RULE_RETRY_BACKOFF` (RUL-07 criterion 6). Permanent errors (destination closed, rule cycle) are not retried and wait for a person.
4. The person can fix the cause (reopen or change the destination) and tap "Run again". The re-run covers only the lines that did not complete, uses the rule version that was in force when the credit arrived (not a version edited later) and the percent of the original credit, and writes the normal Split entries with a note that it was a re-run. The run then shows "Done after re-run".
5. If the person wants the money shared differently, the correct path is a new rule for future credits. A one-off manual transfer is a normal wallet transfer (WAL-12) and is audited as such.
6. Idempotency: a re-run for a line already written is refused with "Already shared" and the original entries are shown.
7. Escalation: a run still Needs attention after `split_escalation_hours` opens a support ticket for operators with the run reference (OPS-06), so stuck runs never depend on a member noticing.
8. Offline: the Needs attention state is readable from cache; the Run again button is online only.
9. Audit: failure, retry attempts, manual re-run, escalation, who and when.

**Data:** Wallet rule (read), Ledger entry (write on success), Notification (write), Support ticket (create on escalation), Audit entry (write).
**Depends on:** CON-14, RUL-07, RUL-12, WAL-12, OPS-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: an unresolved run escalates to operators after `split_escalation_hours` (24 hours by default). Closed: a failed run never blocks later credits from splitting; each credit is independent.

---

### CON-16 Group ledger transparency view

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Wallet: view balance and Wallet: view history
**Tags:** ledger, offline

**Story:** As a member, I want to see in one place the group's balance, where the money goes and every movement with its reason, so that I can trust the group without asking anyone.

**Conversation:** Lack of visibility on the real balance after contributions is problem 1 and 8 in info.md; the real-time visible ledger is the product promise ([competitive-analysis.md](../../research/competitive-analysis.md) section 1 point 2). Structure from `raw/07-ui-ux-best-practices.md` section 8.1: headline sentences, then a ranked list with percentage bars (direct-labelled, no legend, sorted descending), then the ledger with classification chips (R-G1 to R-G6). Sankey is optional and never alone (design-foundations section 4). Stanbic shows all members all transactions (`raw/08` section 6.4).

**Preconditions:** The person is a member who holds the two Wallet permissions. The wallet exists.
**Trigger:** The person opens the group ledger from the group home.

**Acceptance criteria:**
1. Headline: group balance, "Collected this cycle versus target" and "Spent this cycle" with plain sentences ("12 of 15 members have paid", keys `con.ledger.headline.*`). Balance is computed from Confirmed ledger entries. Money still on the way is shown separately ("On the way: X Ar") and never added to the balance.
2. "Where the money goes": a ranked list of destinations or categories for the chosen period with amount, percent and a horizontal bar, direct-labelled. More than `split_max_destinations` rows (same limit, raw/07 R-G4) collapse into "Other". Each row opens the entries behind it. Rounding to Gereo appears as its own row, never hidden in "Other".
3. Ledger thread: reverse-chronological entries grouped by day. Each row shows the classification chip (Contribution, Penalty, Income, Split with the rule name, Rounding, Expense, Transfer, Fee, Share-out, Reversal), plain sentence ("From Group Savings to Roof Project: 120 000 Ar"), amount and status chip. Tapping an entry shows who requested it and what authorised it: the approver names (SPD) or, for a payment started by a passed vote, the vote and the decision (D4, VOT-13); for a Split or Rounding line, the rule name, version, hop number and the first credit that started the chain; the reference ID and the linked entries (R-G1, R-G2).
4. Filters: type, period, amount range, status. An "Accounting view" toggle shows debit and credit columns for holders of Wallet: export history.
5. Members see two numbers about themselves, never one blended: what they contributed in the period and what the group holds (R-G6). No ownership claim is made.
6. Privacy: phone numbers are masked in the shared view; attachments and private notes are not shown (Open Collective pattern, `raw/04-projects-voting-governance.md` section 3). No member can hide their name from the ledger.
7. States: loading skeletons and "Loading" never "No records"; an empty new group shows what the ledger is for and one primary button ("Set up contributions"); offline shows cached data with "Last synced hh:mm"; a cache older than `STALE_BALANCE_AFTER` shows a warning.
8. Real time: new entries appear without reload on an open screen, or at next sync in data-saver mode. Pagination of `HISTORY_PAGE_SIZE` entries.
9. Accessibility: bars are labelled with text, so graphical contrast rules apply to the text, not the bar; no information by colour alone; amounts never clip at 200 percent font scale.

**Data:** Ledger entry (read), Transaction (read), Wallet (read), Wallet rule (read), Approval and Decision (read links).
**Depends on:** WAL-03, WAL-15, CON-14, SPD-16 (expense entries), VOT-13, XCT-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no Sankey view in the MVP; it may follow only after a comprehension test. Closed: the weekly digest belongs to NTF-14. Closed: no public page in the MVP, members only. Closed: no member can hide their own name from the ledger.

---

### CON-17 Reconciliation line on the group ledger

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Wallet: view balance
**Tags:** ledger, offline

**Story:** When I look at the group balance, I want to see that the ledger matches what the payment provider holds, so I know the numbers are real and nothing is missing.

**Conversation:** Nothing found documents a visible reconciliation to members ([competitive-analysis.md](../../research/competitive-analysis.md) section 5; design-foundations section 1 point 4; `raw/08-competitor-ux-comparison.md` section 6.4 open opportunity). info.md specifies a daily reconciliation with Vanilla Pay and alerts on gaps. The risk is the opposite: a visible mismatch can alarm members, so the wording must be factual and the next step clear.

**Preconditions:** The daily reconciliation job exists (OPS-04) and has produced a result for the wallet.
**Trigger:** The person opens the group ledger (CON-16).

**Acceptance criteria:**
1. The line sits under the headline and uses the same component and wording as WAL-20 criterion 2: "All payments of this group matched with Vanilla Pay, checked hh:mm" with a Matched chip (icon + word, key `con.ledger.reconciled`). The comparison is by provider reference and amount for the transactions of this group's wallets, because the provider balance is one global account and cannot be split per group. The time is the time of the last reconciliation, in the person's time zone.
2. Mismatch: the line shows "Being checked: Gereo found a difference and is reviewing it. Your money is not changed" (key `con.ledger.reconcile_diff`) with a reference. Every member, including holders of Wallet: export history, sees the status and time, never the amount. Only operators with the reconciliation permission see the amount (WAL-20 criterion 3, OPS-04).
3. Stale: if the last result is older than `RECON_MAX_AGE` (WAL), the line shows "Last checked [time ago]" with a Warning chip.
4. Provider unavailable: the line shows "Provider balance not available now" with the last good result, never an invented number.
5. Pending entries are excluded from the comparison and the line says so ("Money on the way is not counted").
6. A tap opens an explanation in plain words (what a reconciliation is, how often it runs) and a "Report a problem" action that creates a support ticket with the reference.
7. Offline: the cached line is shown with "Last synced hh:mm"; its own time stays the time of the reconciliation, so the two times are never mixed up.
8. Notifications: none to members and none to group permission holders. Operators receive the alert for a mismatch (OPS-05).
9. Audit: every reconciliation result stored with time, totals, difference, operator action (OPS-04 owns the job; this story only reads it).

**Data:** Reconciliation run (read, owned by OPS-04), Ledger entry (read), Support ticket (create).
**Depends on:** CON-16, WAL-20, OPS-04, OPS-05, OPS-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: only operators see the amount of a difference, as WAL-20 says. Closed: there is no tolerance; any unmatched Confirmed item is shown as a difference, and Pending items are excluded (criterion 5). Closed: matching is per transaction and per group wallet, while the provider-held total is checked globally by OPS-04. Still open and external (Vanilla Pay): whether the provider offers a daily statement or balance to compare against. Default used until then: the line compares the ledger with the provider callbacks and polls we hold, and the global total check waits for OPS-04.

---

### CON-18 Export the ledger for meetings and accounting

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: export history
**Tags:** ledger, audit, offline

**Story:** When the group meets or the accountant asks for the books, I want to export the ledger as a file or a summary page, so I can share it without retyping anything.

**Conversation:** WAL-16 owns export generation for every wallet (formats, columns, size limits, background build, link life); this story adds the group meeting pack and the group-specific columns, and does not restate WAL-16. Export on day one is a design rule and table stakes (CSV and PDF) ([competitive-analysis.md](../../research/competitive-analysis.md) sections 5 and 7). Meetings are where today's trust problems surface (info.md problem 1 and 2). Phone numbers leak targeting data in screenshots, so exports mask them by default (`raw/07-ui-ux-best-practices.md` section 2.8 R-S4). Open Collective filters and exports its ledger (`raw/08` section 6.3).

**Preconditions:** The person holds Wallet: export history and the wallet has entries.
**Trigger:** The person taps Export on the ledger.

**Acceptance criteria:**
1. The person chooses period, wallet, entry types and format: CSV (for accounting) or PDF (for meetings). The PDF meeting pack contains headline numbers, the ranked list with percentages, the status board summary (counts, no names unless the person also holds Contribution plan: view), the reconciliation line and the ledger rows.
2. On top of the WAL-16 columns, each group ledger row includes the classification chip, the rule name, version and hop number for Split and Rounding lines, the vote or decision name where one authorised the entry, and "requested by" and "authorised by" (the approver names, or the vote name for a payment started by a passed vote, D4). Amounts are whole ariary with no decimals (raw integers in CSV, space-grouped in PDF). Phone numbers are always masked; there is no "include full numbers" option in the MVP.
3. Totals in the file equal totals on screen for the same filters, to the ariary, and the Rounding lines to Gereo are included in them.
4. Generation, background build, the "Preparing" state, the ready notification (`push.wal.export_ready`), the private link and offline opening follow WAL-16 criterion 5.
5. Language and encoding follow WAL-16 criterion 2: labels in the person's language, amounts and dates in one format whatever the language.
6. Empty state: no entries for the filters shows "Nothing to export for this period" and no file is created. A failure says nothing was shared and offers a retry (WAL-16 criterion 7).
7. A file shows the generation date and "Last synced" time of the data, and the reconciliation line, so a reader sees how fresh it is.
8. Business rule: export never includes private notes or attachments. Voided and cancelled requests and reversed entries appear with their status.
9. Audit: entry `export.created` with who, when, filters and format (the same entry as WAL-16 criterion 9, written once).

**Data:** Ledger entry (read), Transaction (read), Audit entry (write), Notification (write).
**Depends on:** CON-16, CON-17, WAL-16, XCT-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Still open and external (accountants, field interviews): the accounting format Malagasy accountants require (chart of accounts, standard export). Default used until then: the flat CSV of WAL-16 with the group columns above. Closed: members without the export permission cannot export the ledger; they get their own contribution statement from CON-19 criterion 7. Retention and shutdown commitment text ([competitive-analysis.md](../../research/competitive-analysis.md) section 7) is a terms matter owned by ACC-13 and WAL-16.

---

### CON-19 A member sees where their contribution went

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own contributions); Wallet: view history for the group-level lists
**Tags:** ledger, offline

**Story:** When I paid my contribution, I want to see what my group did with its money since, so I can believe my money is used well.

**Conversation:** "Where does my money go" is the question members ask Mamy by phone (info.md problems 1 and 8). Groups pool money, so the honest answer is the group's outflows in the period, not a coin-by-coin trace; the only exact trace is the split chain that the contribution itself started, because split rules run on every credit. Ownership claims over pooled funds are legally sensitive and are avoided (raw/07 section 8.1 R-G6 two numbers; competitive-analysis section 6 item 1). Screen design from `raw/07` section 8.1 and Stanbic statements (`raw/08` section 6.4).

**Preconditions:** The member has at least one Paid contribution.
**Trigger:** The member opens a receipt or "Where did it go" on a Paid item.

**Acceptance criteria:**
1. The screen shows the member's own contribution (amount, date, reference) and two numbers: "You contributed [total] this year" and "The group received [total] this year". It states plainly that the money is pooled in the group wallet.
2. Below, "What the group did since" shows the ranked list of the group's outflows and splits for the period after the payment, with amount, percent and bars (same component as CON-16), each row opening the entries behind it.
3. Because a contribution is income for the group wallet (D3), the screen also shows, when split rules ran on this contribution, the Split entries it produced down the chain (rule name, hop, destination, amount) and the Rounding line to Gereo, all summing to the contribution.
4. The member can choose the period (this cycle, this year). The list never shows other members' individual amounts unless they hold the view permissions for it.
5. States: loading skeleton; empty if nothing was spent ("The group has not spent money since your payment"); offline from cache with "Last synced hh:mm".
6. Errors: a member whose permission to view history was revoked sees only their own contributions and a note naming the permission.
7. No new notification. Optional share of "my contribution statement" (PDF) hides other members and phone numbers.
8. Accessibility and language: figures read out in full, plain sentences, no jargon (no "debit" or "credit").

**Data:** Contribution (read), Ledger entry (read), Wallet rule (read).
**Depends on:** CON-03, CON-14, CON-16.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the story stays P2 in the MVP release and ships after the P0 and P1 stories; field groups confirm it before it is built. Still open and external (lawyer): the legal wording about a member's "share of the pool"; default used until then is the plain statement in criterion 1 that the money is pooled and no ownership share is claimed.

---

### CON-20 Permission checks and audit log for contributions and splits

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member, Permission holder, Gereo operator (read)
**Permission needed:** Contribution plan: view (plan log); Wallet: view history (rule log)
**Tags:** audit

**Story:** As a member, I want every action on the plan and the split rules to need the right permission and be written in a log I can read, so that no one person can change the group's money rules in secret.

**Conversation:** Permissions only, no roles (conventions section 2 and 7). Every permission change is audited and visible to authorised members (info.md "Garde-fous"). Transparent, hidden-admin power is the failure mode of tontines (`raw/01-group-savings.md` section 13 risks 1; `raw/08` section 6.11). When blocked, say which permission is missing and who can grant it (`raw/07` section 8.5 R-PM7).

**Preconditions:** A plan or a split rule exists.
**Trigger:** Any action on a plan, a reminder, an exemption, a split rule or an export; or a member opening the activity log.

**Acceptance criteria:**
1. The server checks these permissions for each action: view plan (Contribution plan: view), create or change, pause or end plan (Contribution plan: edit), delete plan (Contribution plan: delete), exempt or waive (Contribution plan: exempt member), manual reminder (Contribution plan: send reminder), define or change a split rule (Wallet: edit rules), export (Wallet: export history), set the group's vote requirement for plan and rule changes (Group: edit group), set the group's SMS and notification settings (Group: set notification settings), read the group audit log (Group: view audit log). A call without the permission is refused regardless of the interface.
2. Interface: controls the person cannot use are hidden or disabled with a plain reason. Following a direct link shows "You need [permission in words]. Ask [names of holders]" (key `con.perm.missing`), never a bare "Not allowed".
3. A member's "Effective access" panel (GRP-09) lists these abilities in plain words with their source, so the person sees what they can do before trying.
4. Permissions are inherited (group, then plan or wallet). A revoked permission takes effect on the next request, with no cached allow beyond the offline read-only cache, which never permits an action.
5. Audit entries are append-only and cannot be edited or deleted. Each records who, when, what, before and after values, linked vote or decision and, where a reason is required, the reason.
6. Activity log: the plan log (created, changed, paused, ended, exempted, waived, reminded) is visible to holders of Contribution plan: view. The rule log (created, versions, pauses, executions, rounding amounts, chain hops, failures, re-runs) is visible to holders of Wallet: view history. Holders of Group: view audit log (GRP-11) see both inside the group audit log. Any other member sees only the entries about themselves, as GRP-10 does. Filters by action and person; offline readable from cache with "Last synced".
7. Reminder content is not stored beyond what is needed; the log shows who was reminded and when, never the text of a private note.
8. Operators with the `search audit log` permission (OPS-09) can read the logs for support and compliance but not change them. Operator access is itself logged.
9. States: empty log for a new plan reads "Nothing has happened yet"; loading skeleton; failure to load never hides existing entries from cache.

**Data:** Audit entry (read, write), Membership (read), Permission (read).
**Depends on:** CON-01, CON-02, CON-07, CON-10, CON-11, CON-13, CON-18, GRP-08, GRP-09, GRP-10, GRP-11, OPS-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a member without a view permission reads only the entries about themselves (criterion 6). Closed: audit data is kept for WAL's `RECORD_RETENTION_YEARS` (5 years proposed). Still open and external (lawyer): whether Law 2016-056 art. 53 binds Gereo; tracked in WAL, default 5 years.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| CON-01 | Create a contribution plan | P0 | GRP-01, GRP-05, WAL-01, NTF-05 |
| CON-02 | Edit, pause and end a plan, changes apply to future due dates only | P0 | CON-01, VOT-01, VOT-02, VOT-09, VOT-13, NTF-05 |
| CON-03 | Member's due items and history | P0 | CON-01, WAL-14, XCT-04 |
| CON-04 | Pay a contribution invoice-first | P0 | CON-03, WAL-06, WAL-07, WAL-12, WAL-14, ACC-03, ACC-05, ACC-07, NTF-05, XCT-06 |
| CON-05 | Handle pending and failed contributions | P0 | CON-04, WAL-07, WAL-11, WAL-14, WAL-18, OPS-04, OPS-05, OPS-06, NTF-05 |
| CON-06 | Member status board | P0 | CON-01, CON-04, GRP-05, GRP-07, XCT-04 |
| CON-07 | Send a reminder to a late or pending member | P1 | CON-06, NTF-02, NTF-05, NTF-06, NTF-09, NTF-13, GRP-07 |
| CON-08 | Automatic reminders, push then SMS | P0 | CON-01, CON-03, NTF-04, NTF-05, NTF-06, NTF-08, NTF-09, NTF-10, NTF-13, XCT-12 |
| CON-09 | Apply a late fee | P1 | CON-01, CON-04, CON-05, NTF-05 |
| CON-10 | Exempt a member | P1 | CON-06, CON-09, NTF-05 |
| CON-11 | Define income split rules on a group wallet | P0 | WAL-03, RUL-03, RUL-06, RUL-07, GRP-15, PRJ-03, VOT-01 |
| CON-12 | Preview a split rule on past income | P0 | CON-11, RUL-04, WAL-15 |
| CON-13 | Change, pause or end a split rule, future income only | P1 | CON-11, CON-12, RUL-06, RUL-08, VOT-01, VOT-02, VOT-09, VOT-13, NTF-08 |
| CON-14 | Execute the split automatically when income arrives | P0 | CON-11, WAL-07, WAL-12, WAL-13, WAL-18, RUL-06, RUL-07, RUL-12, NTF-08, NTF-14, OPS-04, SPD-15, ACC-13 |
| CON-15 | Split execution failure and retry | P1 | CON-14, RUL-07, RUL-12, WAL-12, OPS-06, NTF-05 |
| CON-16 | Group ledger transparency view | P0 | WAL-03, WAL-15, CON-14, SPD-16, VOT-13, XCT-04 |
| CON-17 | Reconciliation line on the group ledger | P1 | CON-16, WAL-20, OPS-04, OPS-05, OPS-06 |
| CON-18 | Export the ledger for meetings and accounting | P1 | CON-16, CON-17, WAL-16, XCT-02 |
| CON-19 | A member sees where their contribution went | P2 | CON-03, CON-14, CON-16 |
| CON-20 | Permission checks and audit log for contributions and splits | P0 | CON-01, CON-02, CON-07, CON-10, CON-11, CON-13, CON-18, GRP-08, GRP-09, GRP-10, GRP-11, OPS-09 |

Count: 20 stories. P0: 12 (CON-01, 02, 03, 04, 05, 06, 08, 11, 12, 14, 16, 20). P1: 7 (CON-07, 09, 10, 13, 15, 17, 18). P2: 1 (CON-19).

## Cross-epic dependencies

- **ACC:** PIN entry (ACC-03), new-device cooling and confirmation (ACC-05), tier check and "what unlocks next" (ACC-07) at the moment a limit is hit in CON-04; the terms must disclose the rounding amount credited to Gereo (ACC-13, CON-14).
- **WAL:** deposit and settlement machinery (WAL-06, WAL-07), money states and "report this payment" (WAL-14), transfers between wallets (WAL-12, WAL-13) which under D3 are income for the destination, history filters and the type vocabulary (WAL-15), export generation (WAL-16), reversing entries (WAL-18), reconciliation line (WAL-20). WAL must adopt the Rounding classification and the floor-plus-Gereo rounding rule.
- **RUL:** the shared engine and checks: circle and depth check (RUL-06), automatic application (RUL-07), firing history (RUL-12), preview (RUL-04), pause and edit (RUL-08), who may change group rules (RUL-13). RUL-06 and RUL-07 must drop the rule that rule-made entries are never income (D3) and adopt the rounding rule.
- **GRP:** members and invitation (GRP-05), bundles (GRP-07), grant and revoke (GRP-08), effective access (GRP-09), access history (GRP-10), group audit log (GRP-11), leaving and open items (GRP-16), wallet creation (GRP-15), the settings `split_change_requires_vote` and `plan_change_requires_vote` held by Group: edit group.
- **VOT:** the vote form (VOT-01), quorum and majority (VOT-02), result (VOT-09), decision log (VOT-13). The MVP has no vote linked to a rule or plan change, so CON uses the person-started decision gate.
- **PRJ:** project-linked wallet as a split destination (PRJ-03) and its ledger entries.
- **EVT:** event-linked contribution (a contribution item attached to an event, raw/07 section 8.7 R-EV5) is later; a hook is reserved.
- **ANN:** special one-off contribution campaign inside the group (ANN-04, not a plan, CON-01 criterion 6); announcement of a plan change (optional).
- **NTF:** push then SMS (NTF-05), delivery log (NTF-02), SMS cost and group allowance (NTF-06), batching (NTF-08), quiet hours (NTF-09), SMS opt-out (NTF-10), unreachable numbers (NTF-13), weekly digest (NTF-14), and the catalogue rows EV-CON-01 to EV-CON-13 plus the missing `msg.con.split_failed`.
- **XCT:** offline cache and last-synced banner (XCT-04), amounts (XCT-02), money-out online only (XCT-06), SMS templates (XCT-12), 200 percent font scale (XCT-08), data saver (XCT-07).
- **OPS:** daily reconciliation and mismatch alerts (OPS-04, OPS-05), support tickets including escalated split runs (OPS-06), audit log search (OPS-09).
- **SPD:** expense entries and their authorising approval or vote link (SPD-16), emergency freeze interplay with splits (SPD-15).

## Open questions

Closed questions keep their number so references stay stable.

1. **Closed: provider fee on a contribution.** The member bears it, shown before confirmation; the group receives the full item amount (CON-04). The fee amounts depend on Vanilla Pay terms (see 15).
2. **Closed: partial payment and overpayment.** Both are refused in the MVP (CON-04).
3. **Closed: payment source.** Member wallet balance or mobile money, one source per payment; a mobile money payment passes through the member wallet in the ledger (CON-04).
4. **Open, external (lawyer): late fee legality.** Is a penalty allowed on client funds. Default used: late fee off in every plan, feature behind its `legal-gate`. The rest of the question is closed: the fee lands in the plan's destination wallet, introducing or raising it counts as an amount increase for the decision gate, it is not a ledger receivable, and waiving needs no extra permission (CON-09).
5. **Closed by D3: what counts as income.** Every Confirmed credit into a wallet, contributions and late fees included. `contributions_feed_split` is removed. Provider fees are never deducted from the credit before the split (CON-11, CON-14).
6. **Closed by D5: rounding.** Rounded down per destination; the leftover goes to Gereo as a visible Rounding line shown on the receipt and disclosed in the terms (CON-12, CON-14).
7. **Closed: "members" as a split destination.** Not in the MVP; it needs payouts to personal wallets, individual wallet caps and the approvals of GRP-13 (CON-11).
8. **Closed: important change.** Percentage, destination or timing of an Active rule, and adding a rule to a wallet that already has Active rules, by default; plan amount increases and late fee changes for plans. The first version uses a person-started vote (decision gate). Pause, resume and end are never gated (CON-02, CON-13).
9. **Closed: per-member amounts, mid-cycle joiners and leavers.** One amount for all in the MVP; a joiner starts at the next due date with no proration; a leaver's open items follow GRP-16 and the Cancelled definition (CON-01, CON-02).
10. **Closed: visibility.** Members without the view permission see counts only; late names stay on the board; no one hides their own name; exemption reasons are visible to the member and to holders of the exempt permission; no second confirmation of exemptions in the MVP (CON-06, CON-10).
11. **Partly closed: reminder economics.** Closed: reminder SMS are paid by the group allowance, `late_reminder_max` is 2, `manual_reminder_min_interval` is 48 hours, the SMS wait is NTF's, and quiet hours never swallow a due-day reminder (NTF-09). Open, external (SMS aggregator): the real SMS cost for Madagascar. Default used: only the SMS count is shown until a quote exists (CON-07, CON-08).
12. **Closed: reconciliation visibility.** Only operators see the amount of a difference; no tolerance; matching is per transaction and per group wallet, the provider-held total is checked globally by OPS-04 (CON-17). The provider statement itself is open and external (see 15).
13. **Closed: frozen wallet and splits.** Splits to other wallets of the same group and to Gereo continue during a freeze by Wallet: freeze; an operator hold stops them too (CON-14, CON-15, SPD-15).
14. **Open, external (lawyer): legal gate for the whole epic.** Holding contributions in a group wallet, penalties, any payout to members, the rounding amount credited to Gereo, and the wording of a member's "share of the pool" (CON-19) depend on the unconfirmed legal basis for holding client funds (Law 2016-056, see competitive-analysis section 6 item 1). Every story tagged `legal-gate` is blocked from release until that opinion is in. Default used: build behind the gate.
15. **Open, external (Vanilla Pay): amount encoding, ceilings, fees, refunds and statements.** The Vanilla Pay amount unit (design-foundations section 4), what the Ar 100 000 000 ceiling applies to (competitive-analysis section 9), per-transaction limits, provider fee amounts, refund behaviour and timing, and whether a daily statement or balance exists. Defaults used: `plan_amount_max` equals the lowest per-transaction deposit limit in force, refunds are closed by an operator after provider confirmation, the reconciliation line compares the ledger with the provider callbacks and polls we hold.
16. **Open, external (accountants, field interviews): accounting export format.** Chart of accounts or standard export expected by Malagasy accountants (CON-18). Default used: the flat CSV of WAL-16 with the group columns.
