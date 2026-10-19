# CON: Contributions and income split

Epic code CON, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, IDs). Sources: [info.md](../../../info.md) (section "Cotisations et repartition"), [competitive-analysis.md](../../research/competitive-analysis.md), [design-foundations.md](../../research/design-foundations.md) and the raw reports in `docs/research/raw/`.

Contributions and income split are the core of the product: they replace the manual calculation of contributions and revenue sharing, and make every flow visible to every authorised member.

## Shared definitions for this epic

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
| Cancelled | Item removed by the system because the plan or membership ended it (see open questions) |

The board and the member view show Paid, Pending and Late as the three headline states from [info.md](../../../info.md). The other states are secondary chips.

### Configurable parameters

No number below is a product decision. Every one is a setting with a default to validate in field interviews. "Open" means the default is an open question.

| Parameter | Meaning | Default |
| --- | --- | --- |
| `supported_frequencies` | Frequencies a plan can use | Open (weekly and monthly proposed) |
| `item_open_days_before_due` | How many days before the due date an item appears | Open |
| `late_grace_days` | Days after the due date before an item is Late | 0 |
| `reminder_offsets` | When automatic reminders fire relative to the due date | 3 days before and on the due day (hypothesis from raw/07 section 8.8 R-NT3, to test) |
| `late_reminder_max` | Maximum automatic reminders once an item is Late | Open (raw/07 section 8.3 R-VT7: extra late reminders added no effect in one study) |
| `sms_fallback_delay` | Time after a push stays unread before an SMS is sent | Open |
| `quiet_hours` | Window with no push; reminder SMS wait for its end | 21:00 to 07:00 local (hypothesis, raw/07 R-NT5) |
| `manual_reminder_min_interval` | Minimum time between two manual reminders to the same member | Open |
| `late_fee_*` | Type (fixed or percent), value, repeat (once or per cycle), cap on total fees | Late fee off |
| `split_max_destinations` | Maximum destinations per rule | Open (5 to 7 displayed before "Other", raw/07 R-G4) |
| `split_chain_depth_max` | Maximum rule-to-rule chain depth | Open (3 suggested, raw/07 R-RB4) |
| `split_change_requires_vote` | Group setting: split rule changes need a vote (never, always, or when a destination share moves by more than a set number of points) | Never |
| `plan_change_requires_vote` | Group setting: plan amount changes need a vote | Never |
| `reconciliation_stale_after` | Age after which a reconciliation result is shown as stale | Open |
| `contributions_feed_split` | Whether contributions count as income for split rules | Off |
| `plan_amount_max` | Maximum amount of one contribution item | Open (depends on provider limits) |
| `payment_pending_timeout` | Time after which an unanswered payment becomes Needs attention | Open |
| `failed_payment_grace_hours` | Hours after a failed payment before an item can become Late with a fee | Open |

### Message key prefixes

`con.plan.*`, `con.item.*`, `con.pay.*`, `con.reminder.*`, `con.latefee.*`, `con.exempt.*`, `con.split.*`, `con.ledger.*`, `con.export.*`, `con.perm.*`. Stories name keys only. All SMS templates must be GSM-7 safe and under 160 characters (linted in CI, see [design-foundations.md](../../research/design-foundations.md) section 4). Amounts display as `12 500 Ar`: integer ariary, space grouping, no decimals, identical in Malagasy, French and English.

### Ledger vocabulary used here

Every ledger row carries a classification chip from a controlled list: Contribution, Penalty, Income, Split (always followed by the rule name), Expense, Transfer, Fee, Share-out, Reversal. Corrections are reversing entries with a reason, never edits.

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

**Conversation:** Contribution plans are the first screen a founder like Sara must finish (design-foundations section 5, screen 14). Calculating contributions by hand is problem 7 in info.md. Table stakes: plan with optional penalty ([competitive-analysis.md](../../research/competitive-analysis.md) section 5). Late fee is optional and off by default because rigid late rules can hurt a member who pays late for a legitimate reason (`raw/07-ui-ux-best-practices.md` section 8.1, MicroSave note; section 9). The plan summary sentence mirrors the "what you see is what you set" principle of the rule builder (`raw/07` section 8.2 R-RB2). Single amount for all members in the MVP: per-member amounts are an open question. See also `raw/01-group-savings.md` section 13 (table stakes 2) and `raw/08-competitor-ux-comparison.md` section 6.6.

**Preconditions:** The group exists and has a group wallet. The person holds Contribution plan: edit. No active plan exists on that wallet (see criterion 6).
**Trigger:** The person opens "Set up contributions" from the group home or an empty-state prompt.

**Acceptance criteria:**
1. The form asks, in this order: plan name, amount (integer ariary, number pad), frequency (from `supported_frequencies`), first due date, end date (optional), destination wallet (defaults to the group's main wallet), who is covered (all current members by default), late fee (toggle, off by default). A summary sentence (key `con.plan.summary`, for example "Each member pays amount every month on the 25th, starting on date, into wallet") updates as the person types and stays visible above the save button.
2. Validation is inline and by the field, with an error summary at the top that takes focus. Amount must be a whole number of at least 1 Ar and at most `plan_amount_max` (configurable, open question). First due date must be today or later. A due day of 29, 30 or 31 falls on the last day of shorter months and the summary says so. Typed input is kept after an error (key `con.plan.error.*`).
3. Turning on the late fee reveals type (fixed amount or percent), value, grace days and repeat rule, within the limits of `late_fee_*`. With the toggle off the summary says there is no late fee.
4. Before saving, a preview shows the next three due dates, the number of covered members and the expected total per cycle (members x amount). The preview is arithmetic only and writes nothing.
5. Saving creates the plan with status Active and generates items according to `item_open_days_before_due`. Each covered member receives key `con.plan.created` (push, then SMS if unread after `sms_fallback_delay`) because it creates a payment obligation.
6. One active plan per group wallet in the MVP. A second creation attempt shows "A plan already exists" with a link to edit it. Extra, one-off collections belong to ANN (special contribution campaign), not here.
7. States: loading shows a skeleton form. Offline: the draft is kept on the device and Save is disabled with "Saving needs a connection" and the last-synced time. If the save fails server-side, no member is notified, no item exists, the draft is kept and the person sees what happened and a retry button.
8. Permission: a person without Contribution plan: edit does not see the create button. A direct link shows a message naming the missing permission and who in the group holds it (raw/07 section 8.5 R-PM7). The server enforces the check, not only the interface.
9. Audit: audit entry `plan.created` with who, when and all values. No ledger entry is written because no money moves.
10. Accessibility and language: the amount field announces the grouped value (for example "twelve thousand five hundred ariary"). The date field has a typed alternative to the picker. Frequency and summary use full words, tested in Malagasy and French (summary text can expand 200 percent).

**Data:** Contribution plan (write), Contribution (items, write), Membership (read), Wallet (read), Notification (write), Audit entry (write).
**Depends on:** GRP (group and members exist), WAL (group wallet).
**Pages:** to be filled from the information architecture.
**Open questions:** Per-member amounts (for example half share). Maximum amount. Whether a new member who joins mid-cycle owes the current item or starts at the next due date (default proposed: next due date, no proration).

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
4. End: no new items are generated after the last item already generated. Open items stay collectible until paid or exempted, and the confirmation sentence lists how many. An Ended plan is read-only with a "Copy into a new plan" action. Reactivation is an open question.
5. Delete is offered only to a holder of Contribution plan: delete and only when no payment (even Failed) and no Paid item exists. Otherwise the screen explains that the plan can only be ended, so history stays.
6. If `plan_change_requires_vote` applies to the change (for example an amount increase), Save creates a vote proposal instead of applying the change (VOT). The plan shows "Change waiting for vote" and the old terms stay in force until the vote passes.
7. Notifications: a saved change, pause or end sends keys `con.plan.changed`, `con.plan.paused` or `con.plan.ended` to every covered member with the effective date (push, SMS fallback if unread). Exactly one message per save.
8. Concurrent edit: if another holder saved first, the person sees who saved and when, and must review the new version before saving again. Nothing is silently overwritten.
9. States: offline shows the plan read-only from cache with the last-synced time and "Editing needs a connection". A failed save keeps the inputs and tells the person nothing changed.
10. Audit: each change is an audit entry with before and after values, who, when and an optional note. No ledger entry is written.

**Data:** Contribution plan (write), Contribution (write for future items only), Decision (optional link), Audit entry (write), Notification (write).
**Depends on:** CON-01, VOT (vote linked to an action).
**Pages:** to be filled from the information architecture.
**Open questions:** Does reactivating an ended plan exist, or only a copy? Should every amount increase need a vote by default? What happens to open items when a member leaves the group (cancel, or keep as a debt)?

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
2. Below it, history lists Paid, Exempt and Cancelled items by date with amount, paid date and receipt reference. Filters: period and status. The list loads 20 rows first, then "Show more".
3. Tapping an item opens detail: cycle, amount, due date, late fee if any (shown as its own Penalty line), status, receipt reference, and for Exempt the stated exemption, never the internal reason of another person.
4. Empty states: a member with no plan sees one sentence ("Your group has no contribution plan yet") and, if they hold Contribution plan: edit, a button to create one (CON-01). A member with nothing due sees "You are up to date" and the next due date.
5. Loading shows skeleton rows, never an empty message.
6. Offline: the full screen is readable from cache with a "Last synced hh:mm" banner. The Pay button is disabled with the explanation "Paying needs a connection" (money moves online only). Any item that changed on the server since the cache shows its true state after sync.
7. A Processing item shows its transaction status word and elapsed time, with a link to CON-05 handling. It is not counted as owed twice.
8. Notifications: none created by this story. Tapping a due or late reminder deep-links to the exact item (`raw/08` section 6.12).
9. Accessibility and language: amounts never clip at 200 percent font scale; status is announced as text ("Late, due 25 October"); all dates show weekday and month in words in the person's language.

**Data:** Contribution (read), Contribution plan (read), Transaction (read), Membership (read).
**Depends on:** CON-01, WAL (transaction reference), XCT (offline cache).
**Pages:** to be filled from the information architecture.
**Open questions:** Do members see a lifetime total contributed (also used in CON-19)? Does a member see Cancelled items?

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

**Preconditions:** The member has an open item (Pending or Late), is online, has a PIN, and holds the identity tier required by the amount (ACC). A wallet or mobile money account is available as the source.
**Trigger:** The member taps Pay on an item.

**Acceptance criteria:**
1. The review screen shows on one screen: group and plan name, cycle, amount (fixed to the item, see criterion 4), late fee line if due, fee line (always present, "Fee: 0 Ar" when none), total taken, source (member wallet or mobile money number), and the effect ("Your wallet goes from 80 000 to 30 000 Ar" when paying from the wallet). Fee and total update live. The primary button names the action and amount ("Pay 10 000 Ar").
2. The PIN screen repeats the amount and the group name and carries "Gereo will never ask for your PIN or code". Paying from mobile money hands off to the provider confirmation from inside the flow without asking the member to type a number (the provider name is shown on the screen).
3. Success shows a receipt with amount, fee, total, time, status Confirmed, item cycle and a short copyable reference ID (key `con.pay.receipt`). A "Share receipt" action produces an image or text without the member's phone number. An SMS receipt is sent (key `con.pay.confirmed.sms`) and the in-app confirmation goes to the member (key `con.pay.confirmed.push`).
4. Business rule: the amount is fixed to the item, so partial payment and overpayment are not possible in the MVP. The only editable choice is the source. If the item has an outstanding late fee, the member can pay the item and the fee together or the item first. Partial and over payment are open questions below.
5. Insufficient wallet balance is detected while the member types or selects the source, before the PIN, with a next step ("Add money" or "Pay with mobile money"). Identity tier too low shows what unlocks and the ariary limit, and starts verification (ACC) without losing the item.
6. Ledger: Confirmed writes balanced entries: member wallet to group wallet, classified Contribution, with the item reference and plan name; the fee is a separate Fee line visible in the group ledger; when paid from mobile money, an External-to-member-wallet entry precedes it. The item becomes Paid. Audit entry written with member, time, reference.
7. Idempotency: a double tap or a duplicate provider callback creates one payment only. The same item cannot be paid twice while a payment for it is Processing or Paid.
8. First-time payee pause does not apply (the group wallet is a known destination), but a new device shows the standard confirmation pause from ACC.
9. Offline: Pay is disabled with the explanation and the last-synced banner; no payment is queued silently.
10. Accessibility and language: amounts, fee and total are read in full by a screen reader; the Pay button label is localised with the amount; touch targets are at least 48 by 48 dp.

**Data:** Contribution (write), Transaction (write), Ledger entry (write), Wallet (read, write), Notification (write), Audit entry (write).
**Depends on:** CON-03, WAL (transactions, ledger, wallet-to-wallet transfer), ACC (PIN, tier), NTF (SMS), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Who bears the provider fee: member, group, or Gereo (raw/03 section 7.1 item 4 suggests collecting without extra charge to the sender). Partial payment: refuse, accept and keep the item Pending with the remainder, or accept as credit? Overpayment: refuse, or credit against the next item? Default proposed: refuse both in the MVP. Can the member pay from the wallet balance, from mobile money, or both? Pay on behalf of another member with a second confirmation (StokFella, `raw/08` section 6.6): later.

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
3. Timeout: if the provider has not answered after `payment_pending_timeout` (configurable), the transaction becomes Needs attention, shows a "Report this payment" button that pre-fills the reference, and the system polls the provider and runs the reconciliation job. Gereo never auto-retries a payment of unknown outcome.
4. Business rule on lateness: lateness is judged on the time the payment was initiated, not the time of confirmation. An item that was Processing at the deadline does not become Late until the transaction is Failed, and then `failed_payment_grace_hours` (configurable, open) apply before the late fee.
5. Status transitions are idempotent: a provider that notifies twice, or a Failed after a Confirmed, never changes a Confirmed payment. A Confirmed after a Failed (late provider message) reopens the transaction as Confirmed and writes the Contribution entry.
6. Ledger: Pending and Failed write no Contribution entry. If money was debited and then refunded, a reversing entry with a reason and the reference is written. Every status change is audited with time and source (callback, poll, operator).
7. Offline: the member sees the last known status and last-synced time. Status changes appear after sync. Pay is disabled for that item while its payment is Processing.
8. The shareable status page shows the reference and status so the member can quote it by SMS to support (`raw/08` section 6.12 open opportunity), with no phone number.
9. Notifications: result by push `con.pay.confirmed.push` or `con.pay.failed.push`, and SMS `con.pay.confirmed.sms` or `con.pay.failed.sms` when the app was not opened within `sms_fallback_delay`. SMS under 160 GSM-7 characters with the reference.

**Data:** Transaction (read, write), Contribution (write), Ledger entry (write), Notification (write), Audit entry (write), Support ticket (create from Report).
**Depends on:** CON-04, WAL (statuses, reconciliation), OPS (reconciliation, support), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** `payment_pending_timeout` and `failed_payment_grace_hours`. What the provider returns on refunds and how long a refund takes (Vanilla Pay terms unknown, `raw/03` section 3.2).

---

### CON-06 Member status board

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder, and Member (read)
**Permission needed:** Contribution plan: view
**Tags:** offline

**Story:** As a member who can view the plan, I want to see who has paid, who is pending and who is late this cycle, so that the group knows where it stands without phone calls.

**Conversation:** Per-member paid, pending, late is table stakes and the core of Mamy's job ([competitive-analysis.md](../../research/competitive-analysis.md) section 5; `raw/08` section 6.4). Layout from `raw/07-ui-ux-best-practices.md` section 8.1: headline sentence first ("12 of 15 members have paid this month"), then a member list with chips. Credibility scores as public shame are to avoid (`raw/08` section 6.4); late members are never named in group notifications (raw/07 R-NT8). Screen 16 of the P0 wireframe list in design-foundations section 5.

**Preconditions:** A plan exists. The person holds Contribution plan: view.
**Trigger:** The person opens the board from the plan or the group home.

**Acceptance criteria:**
1. The headline sentence gives counts ("12 of 15 members have paid", key `con.item.board_headline`) with a progress bar, total collected and total expected for the cycle, in integer ariary.
2. The list shows each covered member with name, status chip (icon + word + colour), amount and the date paid or due date. Order: Late, Pending, Processing, Paid, Exempt. A cycle selector shows past cycles; history is read-only.
3. Filters: status and name search. A summary strip counts each status. Counts always equal the number of rows.
4. Late members appear in the list with the days late. No public score, ranking or badge is computed. Names of late members are visible only on this board and to holders of the view permission, never in notifications to the group.
5. Rows expose actions only to holders of the matching permission: "Send reminder" (CON-07, Contribution plan: send reminder), "Exempt" (CON-10, Contribution plan: exempt member). Without the permission the control is absent and a note tells who can use it.
6. Empty state: a plan with no items yet explains when the first items appear (`item_open_days_before_due`). Loading shows skeleton rows.
7. Offline: the board is readable from cache with "Last synced hh:mm"; actions are disabled with an explanation.
8. Real time: when a payment is confirmed, the board updates without reload on an open screen (or within the next sync when data-saver mode is on).
9. Accessibility and language: status is conveyed by word and icon; the list reflows at 320 px; a screen reader reads "Rado, Late, 5 days, 10 000 Ar".

**Data:** Contribution (read), Membership (read), Contribution plan (read), Transaction (read).
**Depends on:** CON-01, CON-04, GRP (members), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Should members without the view permission see the counts but not names? Default proposed: they see the headline counts only. Should a member opt to hide their own name where the bundle allows (`raw/07` section 8.1 R-G7)?

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
1. The sender sees a preview of the message with their own name, the amount, the due date and the plan name, then taps "Send reminder". Optional short note (limit configurable) is allowed.
2. The reminder goes by push first and by SMS if unread after `sms_fallback_delay`. Members with no app or no push token get the SMS directly. The preview shows how many people will receive an SMS and the estimated SMS cost (configurable, from the SMS aggregator quote).
3. Rate limit: a member cannot be reminded again within `manual_reminder_min_interval`; the row shows "Reminded 2 days ago by Mamy" and the button is disabled with that explanation.
4. Items that are Paid, Exempt or Processing are excluded from a bulk send, and the confirmation lists how many were skipped and why.
5. The message is private to the member. No group announcement names late members. Key `con.reminder.manual.push` and `con.reminder.manual.sms`, GSM-7 safe, under 160 characters, with a reference to the item.
6. Quiet hours: pushes are deferred to the end of `quiet_hours`, and reminder SMS wait too (SMS in quiet hours only for security events).
7. The sender sees a delivery log per recipient (sent, delivered, read where available, failed). A failed SMS marks the member "Unreachable" on the board for holders of the view permission.
8. Offline: the action is disabled with "Sending needs a connection". No reminder is queued on the device.
9. Audit: entry `reminder.sent` with sender, recipient, channel, time, item. No ledger entry.

**Data:** Contribution (read), Notification (write), Audit entry (write), Membership (read).
**Depends on:** CON-06, NTF (push, SMS, delivery log), GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Who pays for SMS (group, Gereo, free allowance then group)? Maximum note length and whether a note is allowed at all in the first version.

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
1. For each item that is Pending or Late, the system sends a push at each configured offset (default: 3 days before and on the due day) with amount, due date and a deep link to the item (key `con.reminder.due_soon.push`, `con.reminder.due_today.push`, `con.reminder.late.push`).
2. If the push is unread after `sms_fallback_delay`, or the member has no push token or no app, the system sends one SMS (keys `con.reminder.*.sms`) containing amount, due date, group name and reference, GSM-7 safe, under 160 characters, never naming other members.
3. Items that are Paid, Exempt, Cancelled or Processing are skipped. A payment that confirms after the job built its list but before sending cancels the pending reminder.
4. Idempotency: a retried job never sends the same reminder twice to the same member for the same offset.
5. The number of automatic reminders on a Late item is capped by `late_reminder_max`, after which the board shows "Reminders stopped" and only a manual reminder (CON-07) can follow.
6. Batching: if a member would receive more than five notifications at once, they receive one summary (raw/07 R-NT4). Quiet hours defer pushes and reminder SMS until the end of `quiet_hours`.
7. Language: each message is sent in the member's language. A missing translation falls back to French, then English, and is flagged to operators.
8. States: a failed SMS retries once within a configurable window then marks the member "Unreachable" on the board and logs it; a provider outage queues the SMS and shows a delivery warning to holders of the view permission.
9. The group owner can see monthly SMS volume and estimated cost (configurable) in the plan settings. A plan holder can turn reminders off per plan, and a member can turn off push (not SMS for money due) in their notification preferences (NTF).
10. Audit and delivery log: each send is stored with channel, time and result, visible per recipient to holders of Contribution plan: send reminder. No ledger entry.

**Data:** Contribution (read), Notification (write), Device (read), Audit entry (write).
**Depends on:** CON-01, CON-03, NTF (scheduling, SMS aggregator, quiet hours), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Real SMS cost and aggregator quote for Madagascar (competitive-analysis section 10). Default values for `sms_fallback_delay` and `late_reminder_max`. Is the quiet-hours rule acceptable for a due-day reminder if it falls overnight?

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
4. A payment that was Processing at the deadline (CON-05 criterion 4) does not trigger a late fee. An Exempt item never receives a fee. A fee is removed (waived) when a holder of Contribution plan: exempt member waives it with a reason.
5. Notification: the member receives `con.latefee.applied` (push, SMS fallback) with amount and due date; the group receives no message naming the member.
6. Ledger: applying the fee writes no ledger entry (no money moves). Paying it writes a Penalty entry from member wallet to group wallet, classified Penalty and linked to the item. A waived fee writes an audit entry only. A fee paid by mistake is corrected by a reversing entry.
7. Idempotency: the job is safe to retry; an item receives each fee once.
8. States: offline members see the fee as part of the cached item; Pay is online only. Failed or pending fee payments follow CON-05.
9. Audit: `latefee.applied` and `latefee.waived` with item, member, amount, reason, who waived and when.

**Data:** Contribution (write), Contribution plan (read), Ledger entry (write on payment), Audit entry (write), Notification (write).
**Depends on:** CON-01, CON-04, CON-05, CON-10, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Is a late fee allowed at all on client funds, and where does the fee land (group wallet only)? Does the fee need a vote to be introduced in a running group? Should the fee amount be accounted as a receivable in the ledger? Should waiving a fee need a separate permission?

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
3. Paid items cannot be exempted. Refunding a paid item is not part of this story (open question); the screen explains why the option is unavailable.
4. The reason is visible to the member and to holders of Contribution plan: exempt member only. Other members with the view permission see the chip "Exempt" with no reason.
5. The member receives a message (key `con.exempt.applied`, push, SMS fallback) stating the scope in plain words. The group receives nothing. Lifting the exemption restores the plan from the next unpaid item and sends `con.exempt.lifted`.
6. An exemption never changes the plan, the amount of other members, or any ledger entry. If the group's rule requires a second person to confirm exemptions (open question), the item stays in a "Waiting for second confirmation" state.
7. Business rule: a person cannot exempt themselves. The check is server-side and the screen explains it.
8. Offline: the action is disabled with an explanation. No exemption is queued.
9. Audit: each exemption and lift has an entry with who, when, member, scope and reason. No ledger entry is written because no money moves.

**Data:** Contribution (write), Membership (read), Audit entry (write), Notification (write).
**Depends on:** CON-06, CON-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Can an exempted amount be later forgiven as a ledger event, or does it simply never become a due item? Does a second person need to confirm each exemption (separation of duties)? Is a refund of an already paid item in scope?

---

### CON-11 Define income split rules on a group wallet

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, ledger, audit

**Story:** As a permission holder, I want to say what percentage of each income goes to which destination, and when, so that nobody calculates revenue sharing by hand and every member can see the rule.

**Conversation:** Automatic split rules are Gereo's main differentiator and no competitor has them on a group wallet (`raw/01-group-savings.md` section 13 gaps; [competitive-analysis.md](../../research/competitive-analysis.md) section 5). Build the rule as a three-slot sentence (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB1) with a "what happens when money arrives" summary showing the sum and the remainder (R-RB3). The sum may be under 100 percent (info.md). Money moves between wallets of the same group in the MVP; "members" as a destination is an open question because it implies payouts to personal wallets. Cycles are blocked (R-RB4).

**Preconditions:** The group has a group wallet and the person holds Wallet: edit rules. At least one destination wallet exists.
**Trigger:** The person opens "Split income" on the group wallet.

**Acceptance criteria:**
1. The rule reads as a sentence: "When income arrives in [wallet], move [percent] to [destination]". The person adds destinations one by one (wallet picker, percent in whole numbers) up to `split_max_destinations` and names the rule in a short text.
2. Timing is chosen once per rule: "On arrival" (default) or "At a set time" (a day of the month and time). The summary states it in words (key `con.split.timing`).
3. The sum of percentages must be at most 100 and each value at least 1. At 101 or more Save is blocked with the exact excess. Under 100, a line states "Stays in [wallet]: N percent". A "what happens when money arrives" summary lists every active rule on the wallet, their order, the sum and the remainder (key `con.split.summary`).
4. A destination cannot be the source wallet. A rule that would create a cycle (A to B to A) is blocked with the offending path in plain words, and chain depth beyond `split_chain_depth_max` is blocked (key `con.split.error.cycle`).
5. Destinations are wallets owned by the same group, or project-linked wallets (PRJ). "All members (equal shares)" is hidden until the open question below is resolved.
6. Before saving, the person must view the preview (CON-12). Saving needs a confirmation that restates the rule in one sentence ("Save: 60 percent to Reserve, 30 percent to Roof project, 10 percent stays"). If `split_change_requires_vote` applies to creating a rule, Save creates a proposal (VOT) and the rule is Inactive until the vote passes.
7. Permission: a member without Wallet: edit rules sees the rule read-only with no Edit button; a direct link shows the missing permission and who holds it. Everyone with Wallet: view balance sees the rule in words (transparency).
8. States: loading skeleton; offline read-only from cache with the last-synced time, Save disabled; save failure keeps inputs and states that no rule changed.
9. Audit: entry `splitrule.created` with who, when, rule version number and all values. No ledger entry is written at definition time.
10. Accessibility and language: percent and amount inputs use number pads; the sentence uses the same word order in Malagasy, French and English where grammar allows, and is tested for 2x expansion.

**Data:** Wallet rule (write), Wallet (read), Project (read), Decision (optional link), Audit entry (write).
**Depends on:** WAL (wallets, ledger), RUL (rule framework, loop prevention shared), GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Does the rule trigger on contributions as well (`contributions_feed_split`, default off) or only on income? How is an incoming deposit classified as Income or Contribution (WAL)? Whole percents or decimals? Is "members" a destination, with its legal and cap implications (MVola individual wallets cap at Ar 20M, `raw/03` section 7.1 item 3)?

---

### CON-12 Preview a split rule on past income

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules (and Wallet: view history for the real-history preview)
**Tags:** ledger

**Story:** When I am about to save a split rule, I want to see what it would have done with the last incomes, so I can trust it before it touches real money.

**Conversation:** A live preview from real history is the strongest anti-error device for non-expert rule builders and the Expandable Grid study found effective-result views beat rule lists (83.6 percent against 56.5 percent) (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB2, R-RB3; section 8.5). No product documents a preview before enabling (`raw/08-competitor-ux-comparison.md` section 6.5). Rounding must always add up to the original amount (raw/07 section 8.1 R-G3).

**Preconditions:** A draft rule exists (CON-11). The wallet has past Income entries, or the person types a sample.
**Trigger:** The person taps "Preview" while building or changing a rule.

**Acceptance criteria:**
1. The preview shows the last up to three Income entries on the wallet and, for each, what every destination would have received and what would have stayed, in ariary and percent (key `con.split.preview.line`). It writes nothing to the ledger.
2. The person can type any sample amount instead. Fee-free: the preview shows no provider fee because internal wallet-to-wallet moves have none, and states so.
3. Rounding rule is shown in words: each destination receives its percent of the income rounded down to a whole ariary, any remainder from rounding stays in the source wallet. The total of destination lines plus the amount kept always equals the income, to the ariary (proposed default; see open questions).
4. If a destination would receive 0 Ar for a small income, the line shows "0 Ar" with a note that no entry is written for it.
5. Empty state: with no past income, the preview asks for a sample amount and says so. Loading shows a skeleton. A person without Wallet: view history sees only the sample amount mode, with a note naming the missing permission.
6. The preview also shows the effect of the combined rules on the wallet (`con.split.summary`), including rules paused or waiting for a vote.
7. Offline: the preview works on cached history and shows the last-synced time. Saving is disabled.
8. No audit entry (nothing changes). Viewing history inside the preview respects the same visibility as the ledger (masked phone numbers).
9. Accessibility and language: the preview table uses rows, not columns, on phones; amounts never clip at 200 percent font scale.

**Data:** Ledger entry (read), Wallet rule (read draft), Wallet (read).
**Depends on:** CON-11, WAL (history).
**Pages:** to be filled from the information architecture.
**Open questions:** Rounding: largest-remainder across destinations (raw/07 R-G3) versus remainder stays in the source wallet (proposed here when the sum is below 100). One rule must be chosen with WAL so the ledger and the preview agree.

---

### CON-13 Change, pause or end a split rule, future income only

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, audit, ledger

**Story:** As a permission holder, I want to change, pause or end a split rule knowing it only affects income that arrives later, and that important changes can need the group's vote, so that history stays intact and nobody changes the sharing alone.

**Conversation:** info.md rules: a modified rule applies only to future income; history is never rewritten; an important change may require a vote according to group settings. The vote link ("vote linked to an action: modify a split rule") is in the vote module (info.md, Votes). Raw/07 section 8.2 R-RB6 states that rule changes in a group wallet are proposals that go to vote, and R-RB7 asks for a one-tap pause. Vote-triggered rule changes are listed as out of v1 in [competitive-analysis.md](../../research/competitive-analysis.md) section 7, so the first version only gates saving behind a vote that a person starts (see open questions).

**Preconditions:** A split rule exists. The person holds Wallet: edit rules.
**Trigger:** The person taps Edit, Pause or End on a rule.

**Acceptance criteria:**
1. Each save creates a new rule version. The screen states the effective moment in words: "Applies to income that arrives after hh:mm on date" (key `con.split.change_effective`). Income already received keeps the version in force when it arrived.
2. Past ledger entries are never touched and still show the rule name and version that produced them.
3. "Important change" is decided by the group setting `split_change_requires_vote` (never, always, or when a destination moves by more than a set number of points). When it applies, Save creates a proposal (VOT) linked to the rule change, shows "Waiting for vote", and the old version stays active until the vote passes. If the vote fails, nothing changes and the person is told why.
4. Pause: one tap, with a visible "Paused" chip on the rule and the wallet card; income arriving while paused stays in the source wallet and is not split retroactively when the rule resumes. End: the rule stops permanently and keeps its history.
5. The preview (CON-12) is required before saving a change and compares the old and new outcome on the same sample.
6. All members with Wallet: view balance are notified (digest-friendly) of an applied change: key `con.split.rule_changed` (push). Members are not interrupted by SMS for this.
7. Concurrency: if another holder saved first, the person must review the latest version before saving.
8. Offline: read-only with last-synced time; actions disabled. Failure keeps inputs and states that the live rule did not change.
9. Audit: before and after values, version numbers, who, when, linked vote or decision. No ledger entry is written at change time.

**Data:** Wallet rule (write, version), Vote and Decision (link), Audit entry (write), Notification (write).
**Depends on:** CON-11, CON-12, VOT (linked vote), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** What counts as an important change (default proposed: any change to a percentage, destination or timing)? Pause itself may need no vote. Should the first version only allow a manual, person-started vote rather than an automatic gate?

---

### CON-14 Execute the split automatically when income arrives

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (rule authorised by CON-11 and, if required, a vote)
**Tags:** legal-gate, ledger, audit

**Story:** When income is confirmed in a group wallet, I want every destination to receive its share immediately and visibly under the rule's name, so that nobody has to do the sharing and every member can see it.

**Conversation:** Automatic execution on every income, with a rule-named ledger entry, is the differentiator of the product (design-foundations section 1 point 4 and section 3 principle 3; `raw/08-competitor-ux-comparison.md` section 6.3 open opportunity "why" line). Money moves on Confirmed, never on Pending, since provider callbacks can time out or double-notify (`raw/03` section 7.1 item 5). Money produced by a rule must not re-trigger rules (`raw/07` section 8.2 R-RB4).

**Preconditions:** An active rule version exists on the wallet. An income transaction reaches Confirmed after the rule version's effective time.
**Trigger:** Income Confirmed (timing On arrival), or the scheduled time for rules with timing At a set time.

**Acceptance criteria:**
1. On Confirmed, the system calculates each destination's amount: percent of the income rounded down to whole ariary, with the rounding rule agreed in CON-12; the unallocated share stays in the source wallet.
2. All ledger entries for the split are written in one atomic step with the income reference: one balanced entry from the source wallet to each destination, classified Split and named with the rule name and version (key `con.ledger.split_line`, for example "40 percent to Savings by rule Share income"). Either all entries are written or none.
3. Idempotency: one split per income transaction. A duplicate provider callback, a job retry or a reprocess never writes a second split, enforced by a key built from the income ID and the rule version.
4. Rule-produced money is never income for another rule on the same trigger, and a chain beyond `split_chain_depth_max` is stopped. Entries that came from a rule carry a flag so they are never split again.
5. For rules with timing At a set time, the system splits the sum of Confirmed income received since the last run, and the entry lists the incomes it covers. A scheduled run that finds no income writes nothing.
6. Several rules on one wallet apply in the order shown in `con.split.summary`; the total can never exceed 100 percent of the income (enforced at save and again at run).
7. Notification: holders of Wallet: edit rules receive `con.split.executed` (push) with the totals; other members see the entries in the ledger feed and in the weekly digest, not one push per income. SMS only if a group-level critical setting asks for it.
8. A split for an income with Pending, Failed or Cancelled status writes nothing. If an income is later reversed, a reversing set of entries follows with a reason and the originals stay visible.
9. Audit: every execution is recorded with income reference, rule version, entries written, time. Visible to members who can view history. States: offline members see entries from cache with the last-synced time.

**Data:** Transaction (read), Wallet rule (read), Ledger entry (write), Notification (write), Audit entry (write).
**Depends on:** CON-11, WAL (income detection, atomic ledger posting), NTF, OPS (reconciliation).
**Pages:** to be filled from the information architecture.
**Open questions:** Does a frozen wallet (SPD-15) hold internal splits? Proposed default: internal group-to-group wallet moves continue, moves to members' wallets or outside wait. Is money received from an external payer classified automatically as Income, or by the person with Wallet: deposit at deposit time (default proposed)? Are provider fees on the income deducted before the split?

---

### CON-15 Split execution failure and retry

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: edit rules
**Tags:** legal-gate, ledger, audit

**Story:** When a split could not run (for example a destination closed), I want to know exactly what happened to the income and to re-run it, so I am sure no money is lost or shared the wrong way.

**Conversation:** Trust depends on exactness: "where is my money?" and administrators who cannot explain a gap are the dominant failure modes ([competitive-analysis.md](../../research/competitive-analysis.md) section 4). Errors must say whether money moved and what to do next (`raw/07-ui-ux-best-practices.md` section 2.6 R-E2). A failed split is atomic (CON-14) so the income stays whole in the source wallet.

**Preconditions:** An income was Confirmed and the split could not complete.
**Trigger:** The execution step fails (destination closed or frozen, cap reached, ledger error, rule invalid).

**Acceptance criteria:**
1. No entry is written for a failed split. The income stays in the source wallet. The execution is marked "Needs attention" with the plain reason (key `con.split.failed.reason.*`) and the statement "The income is safe in [wallet]. Nothing was shared."
2. Holders of Wallet: edit rules receive `con.split.failed` (push, and SMS because money sharing did not happen, GSM-7 safe). The wallet card shows a "Needs attention" chip until resolved.
3. Automatic retry: transient errors retry with backoff up to a configurable count. Permanent errors (destination closed, rule cycle) are not retried and wait for a person.
4. The person can fix the cause (reopen or change the destination) and tap "Run again". The re-run uses the rule version that was in force when the income arrived, not a version edited later, and writes the normal Split entries with a note that it was a re-run.
5. If the person wants the income shared differently, the correct path is a new rule for future income. A one-off manual transfer is a normal wallet transfer (WAL) and is audited as such.
6. Idempotency: a re-run for an income already split successfully is refused with "Already shared" and the original entries are shown.
7. Operators see all stuck executions in their back office (OPS).
8. Offline: the Needs attention state is readable from cache; the Run again button is online only.
9. Audit: failure, retry attempts, manual re-run, who and when.

**Data:** Wallet rule (read), Ledger entry (write on success), Notification (write), Audit entry (write).
**Depends on:** CON-14, WAL, OPS, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Time after which an unresolved split escalates to operators. Whether a failed split blocks later incomes from splitting (default proposed: no, each income is independent).

---

### CON-16 Group ledger transparency view

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Wallet: view balance and Wallet: view history
**Tags:** ledger, offline

**Story:** As a member, I want to see in one place the group's balance, where the money goes and every movement with its reason, so that I can trust the group without asking anyone.

**Conversation:** Lack of visibility on the real balance after contributions is problem 1 and 8 in info.md; the real-time visible ledger is the product promise ([competitive-analysis.md](../../research/competitive-analysis.md) section 1 point 2). Structure from `raw/07-ui-ux-best-practices.md` section 8.1: headline sentences, then a ranked list with percentage bars (direct-labelled, no legend, sorted descending), then the ledger with classification chips (R-G1 to R-G6). Sankey is optional and never alone (design-foundations section 4). Stanbic shows all members all transactions (`raw/08` section 6.4). Screen 12 of the P0 wireframe list.

**Preconditions:** The person is a member who holds the two Wallet permissions. The wallet exists.
**Trigger:** The person opens the group ledger from the group home.

**Acceptance criteria:**
1. Headline: group balance, "Collected this cycle versus target" and "Spent this cycle" with plain sentences ("12 of 15 members have paid", keys `con.ledger.headline.*`). Balance is computed from Confirmed ledger entries. Money still on the way is shown separately ("On the way: X Ar") and never added to the balance.
2. "Where the money goes": a ranked list of destinations or categories for the chosen period with amount, percent and a horizontal bar, direct-labelled. More than `split_max_destinations` destinations collapse into "Other". Each row opens the entries behind it.
3. Ledger thread: reverse-chronological entries grouped by day. Each row shows the classification chip (Contribution, Penalty, Income, Split with the rule name, Expense, Transfer, Fee, Share-out, Reversal), plain sentence ("From Group Savings to Roof Project: 120 000 Ar"), amount and status chip. Tapping an entry shows who initiated, who approved, the rule or vote or decision that authorised it, the reference ID and the linked entries (R-G1, R-G2).
4. Filters: type, period, amount range, status. An "Accounting view" toggle shows debit and credit columns for permission holders.
5. Members see two numbers about themselves, never one blended: what they contributed in the period and what the group holds (R-G6). No ownership claim is made.
6. Privacy: phone numbers are masked in the shared view; attachments and private notes are not shown (Open Collective pattern, `raw/04-projects-voting-governance.md` section 3). A permission holder can hide their own name only if the group bundle allows.
7. States: loading skeletons and "Loading" never "No records"; an empty new group shows what the ledger is for and one primary button ("Set up contributions"); offline shows cached data with "Last synced hh:mm"; a stale cache older than a configurable age shows a warning.
8. Real time: new entries appear without reload on an open screen, or at next sync in data-saver mode. Pagination of 20 entries.
9. Accessibility: bars are labelled with text, so graphical contrast rules apply to the text, not the bar; no information by colour alone; amounts never clip at 200 percent font scale.

**Data:** Ledger entry (read), Transaction (read), Wallet (read), Wallet rule (read), Approval and Decision (read links).
**Depends on:** WAL (ledger, balances), CON-14, SPD-16 (expense entries), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Sankey view later, subject to a comprehension test. Digest frequency for the weekly summary (raw/07 R-G8) lives with NTF. Can a group choose a public page (Open Collective style)? Default proposed: members only.

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

**Preconditions:** The daily reconciliation job exists (OPS) and has produced a result for the wallet.
**Trigger:** The person opens the group ledger (CON-16).

**Acceptance criteria:**
1. The line sits under the headline: "Ledger total equals provider balance as of hh:mm" with a Matched chip (icon + word, key `con.ledger.reconciled`). The time is the time of the last reconciliation, in the person's time zone.
2. Mismatch: the line shows "Being checked: Gereo found a difference and is reviewing it. Your money is not changed" (key `con.ledger.reconcile_diff`) with a reference. Members see the status and time, not the amount. Holders of Wallet: export history, and operators, see the amount of the difference (default, see open questions).
3. Stale: if the last result is older than `reconciliation_stale_after`, the line shows "Last checked [time ago]" with a Warning chip.
4. Provider unavailable: the line shows "Provider balance not available now" with the last good result, never an invented number.
5. Pending entries are excluded from the comparison and the line says so ("Money on the way is not counted").
6. A tap opens an explanation in plain words (what a reconciliation is, how often it runs) and a "Report a problem" action that creates a support ticket with the reference.
7. Offline: the cached line is shown with "Last synced hh:mm"; its own time stays the time of the reconciliation, so the two times are never mixed up.
8. Notifications: none to members. Operators and holders of Wallet: edit rules receive an alert for a mismatch (OPS, NTF).
9. Audit: every reconciliation result stored with time, totals, difference, operator action (OPS owns the job; this story only reads it).

**Data:** Reconciliation result (read, owned by OPS), Ledger entry (read), Support ticket (create).
**Depends on:** CON-16, OPS (reconciliation job, alerts), WAL.
**Pages:** to be filled from the information architecture.
**Open questions:** Who sees the amount of a difference? Tolerance below which a difference is not shown. Is reconciliation per group wallet or global (provider global account, `raw/03` section 5.1)?

---

### CON-18 Export the ledger for meetings and accounting

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: export history
**Tags:** ledger, audit, offline

**Story:** When the group meets or the accountant asks for the books, I want to export the ledger as a file or a summary page, so I can share it without retyping anything.

**Conversation:** Export on day one is a design rule and table stakes (CSV and PDF) ([competitive-analysis.md](../../research/competitive-analysis.md) sections 5 and 7). Meetings are where today's trust problems surface (info.md problem 1 and 2). Phone numbers leak targeting data in screenshots, so exports mask them by default (`raw/07-ui-ux-best-practices.md` section 2.8 R-S4). Open Collective filters and exports its ledger (`raw/08` section 6.3).

**Preconditions:** The person holds Wallet: export history and the wallet has entries.
**Trigger:** The person taps Export on the ledger.

**Acceptance criteria:**
1. The person chooses period, wallet, entry types and format: CSV (for accounting) or PDF (for meetings). The PDF meeting pack contains headline numbers, the ranked list with percentages, the status board summary (counts, no names unless the person also holds Contribution plan: view), the reconciliation line and the ledger rows.
2. Each ledger row includes entry ID, date and time, classification, rule or vote name, amount in whole ariary with no decimals (raw integers in CSV, space-grouped in PDF), status, reference, initiated by and approved by (names), and phone numbers masked unless the person chooses "include full numbers" and holds a permission that allows it.
3. Totals in the file equal totals on screen for the same filters, to the ariary.
4. Generation online. A large export runs in the background; the person sees "Preparing" and is notified when ready (`con.export.ready`, push). A finished file is saved on the device and opens offline.
5. Language: the file uses the person's language for labels; amounts and dates never change format between languages. CSV uses a text encoding that opens accents and Malagasy characters correctly in common spreadsheet apps (to confirm in testing).
6. Empty state: no entries for the filters shows "Nothing to export for this period" and no file is created. Loading and failure: a failure says nothing was shared and offers a retry.
7. A file shows the generation date and "Last synced" time of the data, and the reconciliation line, so a reader sees how fresh it is.
8. Business rule: export never includes private notes or attachments. Voided and cancelled requests and reversed entries appear with their status.
9. Audit: entry `export.created` with who, when, filters, format and whether full numbers were included.

**Data:** Ledger entry (read), Transaction (read), Audit entry (write), Notification (write).
**Depends on:** CON-16, CON-17, WAL, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Accounting format required by Malagasy accountants (chart of accounts, standard export). Retention and shutdown commitment text ([competitive-analysis.md](../../research/competitive-analysis.md) section 7). May members without export permission export their own contributions only (see CON-19)?

---

### CON-19 A member sees where their contribution went

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own contributions); Wallet: view history for the group-level lists
**Tags:** ledger, offline

**Story:** When I paid my contribution, I want to see what my group did with its money since, so I can believe my money is used well.

**Conversation:** "Where does my money go" is the question members ask Mamy by phone (info.md problems 1 and 8). Groups pool money, so the honest answer is the group's outflows in the period, not a coin-by-coin trace, unless contributions feed split rules (`contributions_feed_split`). Ownership claims over pooled funds are legally sensitive and are avoided (raw/07 section 8.1 R-G6 two numbers; competitive-analysis section 6 item 1). Screen design from `raw/07` section 8.1 and Stanbic statements (`raw/08` section 6.4).

**Preconditions:** The member has at least one Paid contribution.
**Trigger:** The member opens a receipt or "Where did it go" on a Paid item.

**Acceptance criteria:**
1. The screen shows the member's own contribution (amount, date, reference) and two numbers: "You contributed [total] this year" and "The group received [total] this year". It states plainly that the money is pooled in the group wallet.
2. Below, "What the group did since" shows the ranked list of the group's outflows and splits for the period after the payment, with amount, percent and bars (same component as CON-16), each row opening the entries behind it.
3. If `contributions_feed_split` is on, the screen shows the Split entries produced by this contribution (rule name, destination, amount, all summing to the contribution).
4. The member can choose the period (this cycle, this year). The list never shows other members' individual amounts unless they hold the view permissions for it.
5. States: loading skeleton; empty if nothing was spent ("The group has not spent money since your payment"); offline from cache with "Last synced hh:mm".
6. Errors: a member whose permission to view history was revoked sees only their own contributions and a note naming the permission.
7. No new notification. Optional share of "my contribution statement" (PDF) hides other members and phone numbers.
8. Accessibility and language: figures read out in full, plain sentences, no jargon (no "debit" or "credit").

**Data:** Contribution (read), Ledger entry (read), Wallet rule (read).
**Depends on:** CON-03, CON-14, CON-16.
**Pages:** to be filled from the information architecture.
**Open questions:** Should this exist in the MVP or follow after validation with field groups? Legal wording about "share of the pool".

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
1. The server checks these permissions for each action: view plan (Contribution plan: view), create or change, pause or end plan (Contribution plan: edit), delete plan (Contribution plan: delete), exempt or waive (Contribution plan: exempt member), manual reminder (Contribution plan: send reminder), define or change a split rule (Wallet: edit rules), export (Wallet: export history). A call without the permission is refused regardless of the interface.
2. Interface: controls the person cannot use are hidden or disabled with a plain reason. Following a direct link shows "You need [permission in words]. Ask [names of holders]" (key `con.perm.missing`), never a bare "Not allowed".
3. A member's "Effective access" panel (GRP) lists these abilities in plain words with their source, so the person sees what they can do before trying.
4. Permissions are inherited (group, then plan or wallet). A revoked permission takes effect on the next request, with no cached allow beyond the offline read-only cache, which never permits an action.
5. Audit entries are append-only and cannot be edited or deleted. Each records who, when, what, before and after values, linked vote or decision and, where a reason is required, the reason.
6. Activity log: the plan log (created, changed, paused, ended, exempted, waived, reminded) is visible to holders of Contribution plan: view. The rule log (created, versions, pauses, executions, failures, re-runs) is visible to holders of Wallet: view history. Filters by action and person; offline readable from cache with "Last synced".
7. Reminder content is not stored beyond what is needed; the log shows who was reminded and when, never the text of a private note.
8. Operators can read the logs for support and compliance but not change them (OPS). Operator access is itself logged.
9. States: empty log for a new plan reads "Nothing has happened yet"; loading skeleton; failure to load never hides existing entries from cache.

**Data:** Audit entry (read, write), Membership (read), Permission (read).
**Depends on:** CON-01, CON-02, CON-07, CON-10, CON-11, CON-13, CON-18, GRP (permissions, effective access), OPS.
**Pages:** to be filled from the information architecture.
**Open questions:** Who can read the log if a member lacks the view permission? Retention period for audit data (legal: records kept five years under Law 2016-056 art. 53, to confirm with a lawyer).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| CON-01 | Create a contribution plan | P0 | GRP, WAL |
| CON-02 | Edit, pause and end a plan, changes apply to future due dates only | P0 | CON-01, VOT |
| CON-03 | Member's due items and history | P0 | CON-01, WAL, XCT |
| CON-04 | Pay a contribution invoice-first | P0 | CON-03, WAL, ACC, NTF, XCT |
| CON-05 | Handle pending and failed contributions | P0 | CON-04, WAL, OPS, NTF |
| CON-06 | Member status board | P0 | CON-01, CON-04, GRP, XCT |
| CON-07 | Send a reminder to a late or pending member | P1 | CON-06, NTF, GRP |
| CON-08 | Automatic reminders, push then SMS | P0 | CON-01, CON-03, NTF, XCT |
| CON-09 | Apply a late fee | P1 | CON-01, CON-04, CON-05, CON-10, NTF |
| CON-10 | Exempt a member | P1 | CON-06, CON-09 |
| CON-11 | Define income split rules on a group wallet | P0 | WAL, RUL, GRP |
| CON-12 | Preview a split rule on past income | P0 | CON-11, WAL |
| CON-13 | Change, pause or end a split rule, future income only | P1 | CON-11, CON-12, VOT, NTF |
| CON-14 | Execute the split automatically when income arrives | P0 | CON-11, WAL, NTF, OPS |
| CON-15 | Split execution failure and retry | P1 | CON-14, WAL, OPS, NTF |
| CON-16 | Group ledger transparency view | P0 | WAL, CON-14, SPD-16, XCT |
| CON-17 | Reconciliation line on the group ledger | P1 | CON-16, OPS, WAL |
| CON-18 | Export the ledger for meetings and accounting | P1 | CON-16, CON-17, WAL, XCT |
| CON-19 | A member sees where their contribution went | P2 | CON-03, CON-14, CON-16 |
| CON-20 | Permission checks and audit log for contributions and splits | P0 | CON-01, CON-02, CON-07, CON-10, CON-11, CON-13, CON-18, GRP, OPS |

Count: 20 stories. P0: 12 (CON-01, 02, 03, 04, 05, 06, 08, 11, 12, 14, 16, 20). P1: 7 (CON-07, 09, 10, 13, 15, 17, 18). P2: 1 (CON-19).

## Cross-epic dependencies

Story IDs of other epics are named by capability because their files are not final; link the exact IDs when each epic file is complete.

- **ACC:** PIN entry and confirmation on money-out (CON-04), identity tier check and "what unlocks next" at the moment a limit is hit (CON-04), new-device pause (CON-04).
- **WAL:** wallet-to-wallet transfer and ledger posting with atomic multi-entry writes (CON-04, CON-14), transaction statuses and reference IDs (CON-04, CON-05), classification chips and history filters (CON-16), income classification at deposit (CON-11, CON-14), reconciliation inputs (CON-17), "report this payment" (CON-05), reversing entries (CON-05, CON-14).
- **RUL:** the shared rule framework, three-slot sentence, loop prevention and preview component (CON-11, CON-12); personal wallet rules reuse the same engine.
- **GRP:** members and invitation, permission bundles and the "Effective access" panel (CON-06, CON-20), permission grant and revoke audit (CON-20), group setting for votes on rule changes (`split_change_requires_vote`, `plan_change_requires_vote`).
- **VOT:** vote linked to an action: change a split rule or a plan amount (CON-02, CON-13); decision log entry created from the vote result with a link back to the ledger entries it triggered.
- **PRJ:** project-linked wallet as a split destination (CON-11) and its ledger entries.
- **EVT:** event-linked contribution (a contribution item attached to an event, raw/07 section 8.7 R-EV5) is later; a hook is reserved.
- **ANN:** special one-off contribution campaign inside the group (not a plan, CON-01 criterion 6); announcement of a plan change (optional).
- **NTF:** push then SMS scheduling, quiet hours, batching of more than five notifications, per-recipient delivery log, weekly digest, SMS aggregator and cost (CON-05, CON-07, CON-08, CON-09, CON-10, CON-13, CON-14, CON-15).
- **XCT:** offline cache and last-synced banner (CON-03, CON-06, CON-16, CON-17), message keys in three languages, SMS GSM-7 lint, 200 percent font scale, data-saver mode.
- **OPS:** daily reconciliation job and mismatch alerts (CON-17), stuck payments and failed splits (CON-05, CON-15), read access to logs (CON-20), support ticket from "Report this payment".
- **SPD:** expense entries in the ledger and their authorising approval link (CON-16, via SPD-16), emergency freeze interplay with splits (CON-14, CON-15; SPD-15).

## Open questions

1. **Who bears the provider fee on a contribution** (member, group, Gereo), and how it is shown (CON-04).
2. **Partial payment and overpayment.** Default proposed: refuse both in the MVP; alternatives are partial accepted with remainder due, and overpayment credited to the next item (CON-04).
3. **Payment source.** Member wallet balance, mobile money, or both; and whether a mobile money payment passes through the member wallet in the ledger (CON-04, WAL).
4. **Late fee legality and design.** Is a penalty allowed on client funds, where does it land, does introducing it in a running group need a vote, and is it a receivable in the ledger (CON-09).
5. **What counts as income for split rules.** Classification at deposit, whether contributions feed rules (`contributions_feed_split`, default off) and whether provider fees are taken before the split (CON-11, CON-14).
6. **Rounding rule for splits.** Largest-remainder versus remainder stays in the source wallet; must be the same in the preview and in the ledger (CON-12, CON-14).
7. **"Members" as a split destination.** Equal shares to members implies payouts to personal wallets and caps (Ar 20M on individual MVola wallets); hidden until decided (CON-11).
8. **Important change.** Which split or plan changes need a vote by default (CON-02, CON-13); and whether the first version supports only manually started votes.
9. **Per-member amounts, mid-cycle joiners and leavers.** Proration, cancelled items and unpaid debts when a member leaves (CON-01, CON-02).
10. **Visibility.** Do members see names of late payers, or only counts; reasons for exemptions; whether a second person must confirm exemptions (CON-06, CON-10).
11. **Reminder economics.** Real SMS cost, who pays, defaults for `sms_fallback_delay`, `late_reminder_max`, `manual_reminder_min_interval`, and whether quiet hours may delay a due-day reminder (CON-07, CON-08).
12. **Reconciliation visibility.** Who sees the amount of a difference, tolerance, and whether reconciliation is per wallet or global (CON-17).
13. **Frozen wallet and splits.** Whether internal splits continue when outgoing money is frozen (CON-14, CON-15, SPD-15).
14. **Legal gate for the whole epic.** Holding contributions in a group wallet, penalties, and any payout to members depend on the unconfirmed legal basis for holding client funds (Law 2016-056, see competitive-analysis section 6 item 1); every story tagged `legal-gate` is blocked from release until that opinion is in.
15. **Amount encoding and ceilings.** Confirm the Vanilla Pay amount unit (design-foundations section 4) and what the Ar 100 000 000 ceiling applies to (competitive-analysis section 9), since a plan amount maximum and payment limits depend on it.
