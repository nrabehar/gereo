# CON: screen and state inventory

Source: `docs/product/stories/CON-contributions.md` (20 stories). Surface IDs are `SCR-CON-nn`. Kinds: page, sheet, modal, inline, notification, system. Container choice follows 09 section 10.3. Permission names follow conventions section 7. Decisions D1 to D7 and the R-rows in `05-decisions.md` apply over any story text. The shared decision gate of the story file is modelled once (SCR-CON-13) and reused by CON-02, CON-11 and CON-13.

Line formats used below:

- Surface lines: `SCR-CON-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-CON-nn [state]: trigger; sees; can do; key`.
- Screens of other epics are cited as `SCR-WAL-nn`, `SCR-GRP-nn` or `SCR-ACC-nn` where those inventories define them.

---

### CON-01 Create a contribution plan

- Story: CON-01 Create a contribution plan
- Surfaces:
  - SCR-CON-01 | Plan setup form (plan name, amount, frequency, first due date, end date, destination wallet, who is covered, late fee toggle) | page | Permission holder with Contribution plan: edit (or founder) | "Set up contributions" on group home or an empty-state prompt | save opens SCR-CON-08 (plan detail); back keeps the draft
  - SCR-CON-02 | Plan summary sentence and preview (`con.plan.summary`; next three due dates, number of covered members, expected total per cycle) | inline | same | SCR-CON-01 | none
  - SCR-CON-03 | Late fee fields (type fixed or percent, value, grace days, repeat rule) | inline | same | toggle on SCR-CON-01 (present only once CON-09 is released) | none
  - SCR-CON-04 | "A plan already exists" notice with link to edit | inline | same | second creation attempt on a wallet that has an active plan | opens SCR-CON-08
  - SCR-CON-05 | Plan notice `msg.con.plan_changed` (EV-CON-01, parameter `change` created, changed, paused, ended) | notification | every covered member | plan created or changed | opens SCR-CON-15
  - SCR-CON-06 | Missing-permission message (`con.perm.missing`: "You need [permission in words]. Ask [names of holders]") | page | person without the permission opening a direct link | direct link | none
  - SCR-CON-07 | Item generator (items by `item_open_days_before_due`) | system | none | plan saved | none
- States per surface:
  - SCR-CON-01 [default]: fields in the order listed; destination defaults to the group's main wallet; covered members all by default; late fee off
  - SCR-CON-01 [validation]: inline per field and an error summary at the top that takes focus; amount whole number between 1 Ar and `plan_amount_max`; first due date today or later; typed input kept (`con.plan.error.*`)
  - SCR-CON-01 [amount warning]: amount above the lowest single-deposit limit among configured tiers; non-blocking warning that some members need a higher tier, and several deposits may fund one item
  - SCR-CON-01 [due day 29 to 31]: summary says the due day falls on the last day of shorter months
  - SCR-CON-01 [loading]: skeleton form
  - SCR-CON-01 [offline]: readable from cache with the last-synced banner; save shows `xct.offline.needs_connection`; not queueable
  - SCR-CON-01 [save failed]: no member notified, no item exists; draft kept; sees what happened and a retry button
  - SCR-CON-01 [permission hidden]: create button not shown to a person without Contribution plan: edit
  - SCR-CON-01 [accessibility]: amount announced grouped; date has a typed alternative; full words; summary expands 200 percent
  - SCR-CON-02 [default]: summary updates as the person types and stays above the save button; with the late fee off it says there is no late fee
  - SCR-CON-02 [preview]: arithmetic only; writes nothing
  - SCR-CON-03 [shown]: late fee toggle on; within `late_fee_*` limits
  - SCR-CON-04 [shown]: one active plan per group wallet; "A plan already exists"
  - SCR-CON-05 [push then sms]: `msg.con.plan_changed` with `change` = created; push, then SMS if unread within the NTF window (NTF-05)
  - SCR-CON-06 [default]: names the missing permission and who in the group holds it
  - SCR-CON-07 [generated]: plan saved Active; items generated per member
- Criteria map:
  - AC 1: SCR-CON-01 [default]; SCR-CON-02 [default]; SCR-CON-03 [shown]
  - AC 2: SCR-CON-01 [validation], [amount warning], [due day 29 to 31]
  - AC 3: SCR-CON-03 [shown]; SCR-CON-02 [default]
  - AC 4: SCR-CON-02 [preview]
  - AC 5: SCR-CON-07 [generated]; SCR-CON-05 [push then sms]
  - AC 6: SCR-CON-04 [shown]
  - AC 7: SCR-CON-01 [loading], [offline], [save failed]
  - AC 8: SCR-CON-01 [permission hidden]; SCR-CON-06 [default]
  - AC 9: no UI, system rule (audit `plan.created` with all values; no ledger entry)
  - AC 10: SCR-CON-01 [accessibility]
- Objects and fields: Contribution plan (name, amount, frequency, first due date, end date, destination wallet, covered members, late fee settings, status Active); Contribution items; Membership; Wallet; Notification; Audit entry (`plan.created`).
- Open points:
  1. Criterion 2 warns when the amount exceeds "the lowest single-deposit limit among the configured tiers", while `plan_amount_max` is min(provider cap, Tier 1 single-deposit limit), and Tier 1 is normally the lowest. If so the warning threshold equals the block threshold; when does the warning show without the block?
  2. The form has a "who is covered" field defaulting to all current members; how a person excludes members, and whether exclusion is allowed at all, is not specified in the story.
  3. The late fee field is hidden until CON-09 is released; is the toggle simply absent from frames of the first release? Stated so; no state for "coming soon" specified.
  4. The one-plan rule is per group wallet; the form also chooses a destination wallet. Is the check against the destination wallet? Not specified in the story.
  5. Automatic reminders can be turned off per plan (CON-08 criterion 9) by holders of Contribution plan: edit, but this form has no reminder setting. See CON-08 open point.
  6. Does the covered-member count include the creator and are they notified `msg.con.plan_changed` themselves? Not specified in the story.

---

### CON-02 Edit, pause and end a plan, changes apply to future due dates only

- Story: CON-02 Edit, pause and end a plan, changes apply to future due dates only
- Surfaces:
  - SCR-CON-08 | Plan detail (summary, status chip Active, Paused or Ended, chip "Change waiting for vote", items counts, actions Edit, Pause, End, Delete, "Copy into a new plan") | page | holder of Contribution plan: edit (Delete needs Contribution plan: delete); members read | plan entry from group home | opens SCR-CON-01 (edit), SCR-CON-10, SCR-CON-11, SCR-CON-12
  - SCR-CON-09 | "What changes" screen (`con.plan.change_summary`: first due date the change applies from; items that keep the old terms) | page | holder of Contribution plan: edit | save of an edit | confirm save
  - SCR-CON-10 | Pause (resume date or "until I resume") | sheet | holder of Contribution plan: edit | "Pause" | confirm
  - SCR-CON-11 | End confirmation (sentence listing how many open items stay collectible) | modal | holder of Contribution plan: edit | "End" | confirm or cancel
  - SCR-CON-12 | Delete explanation (delete only when no payment, even Failed, and no Paid item exists; otherwise "the plan can only be ended") | modal | holder of Contribution plan: delete | "Delete" | confirm or cancel
  - SCR-CON-13 | Change proposal (decision gate: snapshot with gated field set, old and new values, proposer, state Waiting for vote, Applied, Expired or Discarded; "Start the vote"; "Apply the change") | page | proposer; holders of the permission the change needs; voters via VOT | gated save | VOT-01 vote; apply
  - SCR-CON-14 | Concurrent edit review (who saved and when; review the new version) | inline | editor | save collides with another holder's save | review then save again
- States per surface:
  - SCR-CON-08 [active]: Active plan; actions available
  - SCR-CON-08 [paused]: chip Paused on every plan screen; no new items; existing open items stay due
  - SCR-CON-08 [ended]: read-only; "Copy into a new plan" only; never reactivated
  - SCR-CON-08 [waiting for vote]: chip "Change waiting for vote" on an Active or Paused plan; old terms stay in force
  - SCR-CON-08 [offline]: read-only from cache with last-synced time and "Editing needs a connection"
  - SCR-CON-09 [default]: lists the date the change applies from and items that keep old terms; Upcoming, Pending, Late, Processing and Paid items never change
  - SCR-CON-09 [save failed]: inputs kept; says nothing changed
  - SCR-CON-10 [default]: resume date or "until I resume"
  - SCR-CON-11 [default]: no new items after the last generated; open items stay collectible until paid or exempted
  - SCR-CON-12 [allowed]: holder of Contribution plan: delete and no payment or Paid item
  - SCR-CON-12 [blocked]: explains the plan can only be ended so history stays
  - SCR-CON-13 [gated]: amount increase, late fee turned on or raised, when `plan_change_requires_vote` applies; plan shows "Change waiting for vote"; Pause and End never gated
  - SCR-CON-13 [applied], [expired], [discarded]: per shared gate (passed vote with matching `snapshot_ref` applied within `change_apply_window_days`; window passed or nobody holds the permission: Expired; vote Needs attention or Cancelled: Discarded with the reason shown; re-check refuses with "Ask for a new vote")
  - SCR-CON-13 [skipped]: group below three members; applies directly; audit "No vote possible: fewer than three members"
  - SCR-CON-14 [default]: shows who saved first and when; nothing silently overwritten
  - SCR-CON-05 [changed, paused, ended]: `msg.con.plan_changed` with `change` = changed, paused or ended to every covered member with the effective date; exactly one message per save; none while a change only waits for its vote
- Criteria map:
  - AC 1: SCR-CON-09 [default]
  - AC 2: SCR-CON-09 [default] (history untouched; next generated item uses new terms)
  - AC 3: SCR-CON-10 [default]; SCR-CON-08 [paused]
  - AC 4: SCR-CON-11 [default]; SCR-CON-08 [ended]
  - AC 5: SCR-CON-12 [allowed], [blocked]
  - AC 6: SCR-CON-13 [gated], [applied], [expired], [discarded]; SCR-CON-08 [waiting for vote]
  - AC 7: SCR-CON-05 [changed, paused, ended]
  - AC 8: SCR-CON-14 [default]
  - AC 9: SCR-CON-08 [offline]; SCR-CON-09 [save failed]
  - AC 10: no UI, system rule (audit entry per change with before and after, who, when, optional note; no ledger entry)
- Objects and fields: Contribution plan (status Active, Paused, Ended; terms; version); Contribution (future items only); Decision (optional link); proposal snapshot (`snapshot_ref`, `proposer_id`, gated fields, state); Audit entry; Notification.
- Open points:
  1. Criterion 1 says edit covers amount, frequency, due day, late fee settings and end date; are plan name, destination wallet and covered members editable? Not specified in the story.
  2. By default only an amount increase is gated (`plan_change_requires_vote` = Amount increase). A frequency change from monthly to weekly raises the total each member owes without raising the amount; is it gated? Not specified in the story.
  3. The snapshot proposal screen (SCR-CON-13) is described only by the shared gate rules; which screen displays the vote result and the "Apply the change" button (plan detail or a dedicated page)? Not specified in the story.
  4. What does the delete option show for a plan with only Failed payments? Criterion 5 says no Failed payment may exist for delete; the explanation text is not specified.
  5. When pausing with "until I resume", is there a reminder to resume? Not specified in the story.

---

### CON-03 Member's due items and history

- Story: CON-03 Member's due items and history
- Surfaces:
  - SCR-CON-15 | My contributions (action block with Late then Pending items and Pay buttons; headline `con.item.owed_summary`; history of Paid, Exempt and Cancelled items; yearly total line; filters period and status) | page | Member (own items, no permission) | "My contributions" from the group or home dashboard; reminder deep link | Pay opens SCR-CON-17; item opens SCR-CON-16
  - SCR-CON-16 | Item detail (cycle, amount, due date, late fee line as Penalty, status, receipt reference, exemption scope and the member's own reason) | page | Member | row in SCR-CON-15 or reminder deep link | Pay; back
- States per surface:
  - SCR-CON-15 [default]: Late first then Pending, each with amount, due date, status chip (icon, word, colour) and Pay; total owed sentence
  - SCR-CON-15 [history]: Paid, Exempt and Cancelled by date with amount, paid date (or the reason for Cancelled) and receipt reference; "You contributed [total] this year" (same figure as CON-19); first `HISTORY_PAGE_SIZE` rows then "Show more"
  - SCR-CON-15 [no plan]: "Your group has no contribution plan yet"; with Contribution plan: edit a create button (CON-01)
  - SCR-CON-15 [up to date]: "You are up to date" and the next due date
  - SCR-CON-15 [loading]: skeleton rows, never an empty message
  - SCR-CON-15 [offline]: readable from cache with "Last synced hh:mm"; Pay disabled with "Paying needs a connection"; items changed on the server show true state after sync
  - SCR-CON-15 [processing]: a Processing item shows its transaction status word and elapsed time, with a link to CON-05; not counted as owed twice
  - SCR-CON-16 [default]: late fee own Penalty line; exemption shows scope and reason recorded for this member, never another member's
  - SCR-CON-16 [accessibility]: amounts never clip at 200 percent; status announced as text ("Late, due 25 October"); dates with weekday and month in words
- Criteria map:
  - AC 1: SCR-CON-15 [default]
  - AC 2: SCR-CON-15 [history]
  - AC 3: SCR-CON-16 [default]
  - AC 4: SCR-CON-15 [no plan], [up to date]
  - AC 5: SCR-CON-15 [loading]
  - AC 6: SCR-CON-15 [offline]
  - AC 7: SCR-CON-15 [processing]
  - AC 8: no UI, system rule (no notification created; reminder deep link opens the exact item)
  - AC 9: SCR-CON-16 [accessibility]
- Objects and fields: Contribution (item: cycle, amount, due date, status, late fee, receipt reference, exemption scope and reason); Contribution plan; Transaction; Membership.
- Open points:
  1. A member of several groups: does "My contributions" show one group at a time or all groups together? The trigger says "from the group or the home dashboard"; not specified in the story.
  2. The offline Pay text is quoted as "Paying needs a connection" while CON-04 criterion 9 says Pay shows `xct.offline.money_blocked`. Which wins (text or key)?
  3. A "Former member" outstanding-debt item (shared definitions): how does a former member see it here? Not specified in the story.
  4. The yearly total period (calendar year or rolling 12 months) is not specified.

---

### CON-04 Pay a contribution invoice-first

- Story: CON-04 Pay a contribution invoice-first
- Surfaces:
  - SCR-CON-17 | Pay review (group and plan name, cycle, amount fixed to the item, late fee line if due, fee line, total taken, source, effect line; button "Pay 10 000 Ar") | page | Member (own item) | Pay button in SCR-CON-15 or SCR-CON-16 | PIN opens SCR-CON-18
  - SCR-CON-18 | Contribution PIN screen (repeats amount and group name; "Gereo will never ask for your PIN or code"; mobile money hand-off wording) | page | Member | review | success opens SCR-CON-19
  - SCR-CON-19 | Receipt `con.pay.receipt` (amount, fee, total, time, status Confirmed, item cycle, copyable reference ID; "Share receipt") | page | Member | payment Confirmed | done
  - SCR-CON-20 | Source picker (member wallet balance or mobile money; one source per payment) | sheet | Member | source line on SCR-CON-17 | pick source
  - SCR-CON-21 | Insufficient-balance next step ("Add money" or "Pay with mobile money") | inline | Member | wallet source selected with too little balance | opens SCR-WAL-19 or switches source
  - SCR-CON-22 | Payment received notices `msg.con.payment_received.push` and `.sms` (EV-CON-06) | notification | Member | payment Confirmed | opens SCR-CON-19
  - SCR-CON-23 | Share receipt (image or text without the member's phone number) | system | Member | "Share receipt" | OS share
- States per surface:
  - SCR-CON-17 [default]: one screen with all lines; "Fee: 0 Ar" when none; live fee and total; effect "Your wallet goes from 80 000 to 30 000 Ar" for wallet source
  - SCR-CON-17 [late fee choice]: item with an outstanding late fee; pay item and fee together or the item first
  - SCR-CON-17 [partial or overpayment refused]: amount fixed to the item; no edit field
  - SCR-CON-17 [tier limit]: identity tier too low; `acc.tiers.limit_hit` shows at payment time and verification starts without losing the item
  - SCR-CON-17 [new device]: cooling limit of ACC-05 and the standard confirmation pause (WAL-10)
  - SCR-CON-17 [offline]: readable from cache with the last-synced banner; Pay shows `xct.offline.money_blocked`; not queueable
  - SCR-CON-17 [already paid or processing]: the same item cannot be paid twice while a payment is Processing or Paid
  - SCR-CON-17 [accessibility]: amounts, fee, total read in full; Pay label localised with the amount; targets at least 48 by 48 dp
  - SCR-CON-18 [default]: PIN repeats amount and group name; mobile money pays by hand-off to the provider confirmation (the screen says the operator is asking for confirmation; provider name never appears)
  - SCR-CON-19 [success]: receipt on screen is the primary confirmation
  - SCR-CON-20 [default]: wallet or mobile money; never both
  - SCR-CON-21 [shown]: detected while typing or selecting source, before the PIN
  - SCR-CON-22 [push]: `msg.con.payment_received.push`
  - SCR-CON-22 [sms]: `msg.con.payment_received.sms` only under the NTF-05 fallback rule (no app or push not opened)
  - SCR-CON-23 [default]: image or text; phone number never included
- Criteria map:
  - AC 1: SCR-CON-17 [default]
  - AC 2: SCR-CON-18 [default]
  - AC 3: SCR-CON-19 [success]; SCR-CON-22 [push], [sms]; SCR-CON-23 [default]
  - AC 4: SCR-CON-17 [partial or overpayment refused], [late fee choice]; SCR-CON-20 [default]
  - AC 5: SCR-CON-21 [shown]; SCR-CON-17 [tier limit]
  - AC 6: no UI, system rule (balanced entries member wallet to group wallet classified Contribution; Fee as its own line on the member's history and receipt; group ledger shows full amount; deposit precedes when paid from mobile money; income for the group wallet so rules run; item becomes Paid; audit)
  - AC 7: SCR-CON-17 [already paid or processing]; system rule (double tap and duplicate callback give one payment)
  - AC 8: SCR-CON-17 [new device]
  - AC 9: SCR-CON-17 [offline]
  - AC 10: SCR-CON-17 [accessibility]
- Objects and fields: Contribution (item, status Paid or Processing); Transaction (reference, status); Ledger entry (Contribution, Fee); Wallet (member, group); Notification; Audit entry.
- Open points:
  1. Share receipt "produces an image or text", while WAL-14 and its open question say the shared receipt is a PDF and plain text in the MVP, not an image. Which format applies to a contribution receipt?
  2. Criterion 8 says the first-time payee pause does not apply, but the WAL-10 pause is also triggered by a new device or large amount; the exact trigger list for contributions is not specified.
  3. Whether paying a contribution from the wallet needs the PIN on every payment is implied by criterion 2; whether a contribution counts as money-out for tier limits is not stated (ACC-07 calls it a deposit or contribute check).
  4. Where the late fee choice (item only or item plus fee) is shown in the review, and its keys, are not specified in the story.
  5. Does the receipt show the rounding line when a split ran on the contribution (CON-19)? Not specified here.

---

### CON-05 Handle pending and failed contributions

- Story: CON-05 Handle pending and failed contributions
- Surfaces:
  - SCR-CON-24 | Payment status page (item Processing, Failed or Needs attention; reference and status; shareable without phone number; "Report this payment") | page | Member (own payment); anyone holding the shareable reference as designed | item detail, notification, shared reference | Try again or Choose another source; report
  - SCR-CON-25 | Payment failed notices `msg.con.payment_failed.push` and `.sms` (EV-CON-07) | notification | Member | payment failed | opens SCR-CON-24
  - SCR-CON-26 | "Report this payment" button (pre-fills the reference, WAL-14) | inline | Member | SCR-CON-24 in Needs attention | opens SCR-WAL-52
- States per surface:
  - SCR-CON-24 [pending]: item Processing with the word "Pending", elapsed time, "Waiting for the operator", "Nothing. We will message you" (`con.pay.pending`); member can leave the screen
  - SCR-CON-24 [failed]: says "No money was taken" or "Money was taken, refund in progress, reference X"; reason in plain words (provider unavailable, wrong PIN, insufficient funds, member cap exceeded, declined); next step "Try again" or "Choose another source" (`con.pay.failed.*`)
  - SCR-CON-24 [timeout]: no provider answer after `PENDING_TIMEOUT`; polls per WAL-07; unknown outcome shows Needs attention and a "Report this payment" button; never auto-retried
  - SCR-CON-24 [late provider message]: Confirmed after Failed or Cancelled; stored, flagged Needs attention and sent to operators; item stays as it was until an operator decides
  - SCR-CON-24 [offline]: last known status and last-synced time; Pay disabled for that item while Processing
  - SCR-CON-24 [shareable]: shows reference and status, no phone number
  - SCR-CON-25 [push], [sms]: result by push; SMS variants when the push is unread within the NTF window; reference included; within 160 GSM-7 characters
  - SCR-CON-26 [shown]: appears in Needs attention
- Criteria map:
  - AC 1: SCR-CON-24 [pending]
  - AC 2: SCR-CON-24 [failed]
  - AC 3: SCR-CON-24 [timeout]; SCR-CON-26 [shown]
  - AC 4: no UI, system rule (lateness judged on initiation time; Processing at the deadline is not Late until Failed, then `failed_payment_grace_hours` apply before any late fee)
  - AC 5: SCR-CON-24 [late provider message]; system rule (idempotent transitions)
  - AC 6: no UI, system rule (Pending and Failed write no Contribution entry; debited then refunded gets a reversing entry with reason and reference; every status change audited)
  - AC 7: SCR-CON-24 [offline]
  - AC 8: SCR-CON-24 [shareable]
  - AC 9: SCR-CON-25 [push], [sms]
- Objects and fields: Transaction (status, reference); Contribution (item status); Ledger entry; Support ticket (from Report); Notification; Audit entry.
- Open points:
  1. The shareable status page shows reference and status "so the member can quote it by SMS to support"; who can open it (anyone with the reference, or only the member), and what URL token protects it? Not specified in the story.
  2. The failure reasons include "member cap exceeded"; which cap is meant (tier limit, wallet cap)? Not specified in the story.
  3. The failure reason "wrong PIN" mentions a PIN typed on the operator's phone; the story does not say whether it can also mean the Gereo PIN.
  4. When money was taken and a refund is in progress, how does the member see closure ("closed by an operator after the provider confirms")? Not specified in the story.

---

### CON-06 Member status board

- Story: CON-06 Member status board
- Surfaces:
  - SCR-CON-27 | Member status board (headline sentence `con.item.board_headline`, progress bar, total collected and expected, status strip, member list with chips, cycle selector, filters by status and name) | page | holder of Contribution plan: view (names); members without it see headline counts only | plan or group home | row actions open SCR-CON-29 or SCR-CON-41
  - SCR-CON-28 | Board row actions ("Send reminder" CON-07, "Exempt" CON-10) | inline | holder of Contribution plan: send reminder, exempt member respectively | each row | opens SCR-CON-29 (single or bulk), SCR-CON-41
- States per surface:
  - SCR-CON-27 [default]: headline "12 of 15 members have paid" with counts, bar, collected and expected in integer ariary; order Late, Pending, Processing, Upcoming, Paid, Exempt; Cancelled only in past cycles with reason
  - SCR-CON-27 [late members]: late rows show days late; no score, ranking or badge; names only on this board and to holders of Contribution plan: view
  - SCR-CON-27 [filters]: status and name search; summary strip counts equal the number of rows
  - SCR-CON-27 [past cycles]: cycle selector; history read-only
  - SCR-CON-27 [counts only]: member without Contribution plan: view sees headline counts, never names
  - SCR-CON-27 [empty]: plan with no items yet explains when the first items appear (`item_open_days_before_due`)
  - SCR-CON-27 [loading]: skeleton rows
  - SCR-CON-27 [offline]: readable from cache with "Last synced hh:mm"; actions disabled with an explanation
  - SCR-CON-27 [real time]: a payment confirmed updates the board without reload (or at next sync in data-saver mode)
  - SCR-CON-27 [accessibility]: status by word and icon; reflows at 320 px; screen reader reads "Rado, Late, 5 days, 10 000 Ar"
  - SCR-CON-28 [permitted]: controls shown only to holders of the matching permission
  - SCR-CON-28 [not permitted]: control absent; a note says who can use it
- Criteria map:
  - AC 1: SCR-CON-27 [default]
  - AC 2: SCR-CON-27 [default], [past cycles]
  - AC 3: SCR-CON-27 [filters]
  - AC 4: SCR-CON-27 [late members]
  - AC 5: SCR-CON-28 [permitted], [not permitted]
  - AC 6: SCR-CON-27 [empty], [loading]
  - AC 7: SCR-CON-27 [offline]
  - AC 8: SCR-CON-27 [real time]
  - AC 9: SCR-CON-27 [accessibility]
- Objects and fields: Contribution (item status, amount, paid or due date, days late); Membership (names); Contribution plan; Transaction.
- Open points:
  1. A member without Contribution plan: view sees headline counts; the Member bundle includes Contribution plan: view, so the counts-only audience is only people whose view was revoked. Is the counts-only view a reachable screen or an edge case? Not specified in the story.
  2. Does the board show the viewer's own row to a counts-only member? Not specified in the story.
  3. How does the board show a "Former member" outstanding-debt row (shared definitions: "marked Former member, no reminder, no late fee")? Not specified in the story.
  4. The board shows "Not reached" for failed SMS (CON-07 criterion 7); the chip placement is not specified here.

---

### CON-07 Send a reminder to a late or pending member

- Story: CON-07 Send a reminder to a late or pending member
- Surfaces:
  - SCR-CON-29 | Manual reminder preview (message with sender name, amount, due date and plan name; optional note up to `manual_reminder_note_max`; SMS count and cost estimate; button "Send reminder"; bulk "Remind selected") | sheet | holder of Contribution plan: send reminder | "Send reminder" on a board row, or selected rows | send; cancel
  - SCR-CON-30 | Reminder delivery log (per recipient: sent, delivered, opened, failed; "Not reached") | page | holder of Contribution plan: send reminder | after sending, board | back
  - SCR-CON-31 | Manual reminder notice `msg.con.reminder_manual` (`.push`, `.sms`; EV-CON-05) | notification | the reminded member | reminder sent | opens SCR-CON-16
- States per surface:
  - SCR-CON-29 [default]: preview with own name; optional note; how many people get an SMS and the estimated cost, paid from the group allowance (class Gr)
  - SCR-CON-29 [rate limited]: member reminded within `manual_reminder_min_interval`; row shows "Reminded 2 days ago by Mamy"; button disabled with that explanation
  - SCR-CON-29 [bulk skipped]: Paid, Exempt and Processing items excluded; confirmation lists how many were skipped and why
  - SCR-CON-29 [quiet hours]: reminder sent inside quiet hours is held and delivered at their end, push and SMS alike; sender told the delivery time
  - SCR-CON-29 [offline]: readable from cache with last-synced banner; remind shows `xct.offline.needs_connection`; not queueable
  - SCR-CON-30 [default]: per-recipient delivery vocabulary of NTF-02; "Not reached" by name with no reason; cause counts only in groups of 5 or more (NTF-13)
  - SCR-CON-30 [board mark]: failed SMS also marks the member "Not reached" on the board for holders of Contribution plan: view
  - SCR-CON-31 [push], [sms]: push first, SMS if unread within the NTF window; members with no app or push token get SMS directly; private; within 160 GSM-7 characters; references the item
- Criteria map:
  - AC 1: SCR-CON-29 [default]
  - AC 2: SCR-CON-29 [default]; SCR-CON-31 [push], [sms]
  - AC 3: SCR-CON-29 [rate limited]
  - AC 4: SCR-CON-29 [bulk skipped]
  - AC 5: SCR-CON-31 [push], [sms]
  - AC 6: SCR-CON-29 [quiet hours]
  - AC 7: SCR-CON-30 [default], [board mark]
  - AC 8: SCR-CON-29 [offline]
  - AC 9: no UI, system rule (audit `reminder.sent`; no ledger entry)
- Objects and fields: Contribution (item); Notification (channel, time, result); Audit entry (`reminder.sent`); Membership.
- Open points:
  1. Criterion 2 shows an "estimated cost" of the SMS; CON-08 open question and blocker B9 say no SMS price is shown, only the count. Does the preview show a price or only a count?
  2. How is "Remind selected" selection mode entered on the board (long press, checkboxes)? Not specified in the story.
  3. The optional note is kept only until sent (CON-20 criterion 7); is the sender shown a note counter against 60 characters? Implied; not specified.
  4. The delivery log placement (own page or section of the board) is not specified.

---

### CON-08 Automatic reminders, push then SMS

- Story: CON-08 Automatic reminders, push then SMS
- Surfaces:
  - SCR-CON-32 | Reminder scheduler (offsets, late steps, idempotency, batching) | system | none | job at each `reminder_offsets` point | none
  - SCR-CON-33 | Automatic reminder notices `msg.con.due_soon`, `msg.con.due_today`, `msg.con.overdue` (`.push`, `.sms`; EV-CON-02 to EV-CON-04) | notification | the member with a Pending or Late item | schedule | opens SCR-CON-16
  - SCR-CON-34 | Late summary `msg.con.late_summary` (EV-CON-09; in-app and push, counts and board link) | notification | holders of Contribution plan: send reminder | each day after the due date | opens SCR-CON-27
  - SCR-CON-35 | "Reminders stopped" marker | inline | holders of Contribution plan: view | board row after `late_reminder_max` | manual reminder (CON-07)
  - SCR-CON-36 | Plan reminders switch (automatic reminders on or off per plan) | inline | holder of Contribution plan: edit | plan settings | toggle
- States per surface:
  - SCR-CON-32 [scheduled]: push at each offset (default 3 days before and on the due day); items Paid, Exempt, Cancelled, Processing skipped; a payment confirmed after the list was built cancels the pending reminder; a retried job never sends the same reminder twice
  - SCR-CON-32 [batching]: more than `ntf.batch_threshold` at once becomes one summary (NTF-08); times follow NTF-09
  - SCR-CON-32 [language]: each message in the member's language; a missing translation falls back to French then English and is flagged to operators
  - SCR-CON-32 [sms failure]: retries per `ntf.sms_max_retries` and `ntf.sms_retry_backoff`; then member marked "Not reached" on the board and logged (NTF-13); provider outage queues the SMS and shows a delivery warning to holders of the view permission
  - SCR-CON-33 [push]: amount, due date and deep link
  - SCR-CON-33 [sms]: one SMS if push unread within the NTF window or no token or no app; amount, due date, group name, reference; never names other members
  - SCR-CON-34 [default]: counts and board link
  - SCR-CON-35 [stopped]: after `late_reminder_max` automatic reminders on a Late item; only manual reminders follow
  - SCR-CON-36 [on or off]: default on; off per plan
- Criteria map:
  - AC 1: SCR-CON-33 [push]; SCR-CON-32 [scheduled]
  - AC 2: SCR-CON-33 [sms]
  - AC 3: SCR-CON-32 [scheduled]
  - AC 4: SCR-CON-32 [scheduled]
  - AC 5: SCR-CON-35 [stopped]; SCR-CON-34 [default]
  - AC 6: SCR-CON-32 [batching]
  - AC 7: SCR-CON-32 [language]
  - AC 8: SCR-CON-32 [sms failure]
  - AC 9: SCR-CON-36 [on or off]; system rule (SMS volume, cost, allowance and payer owned by NTF-06; member opt-out per NTF-04 and NTF-10; item stays visible in app)
  - AC 10: no UI, system rule (each send stored with channel, time and result, visible per recipient to holders of Contribution plan: send reminder; no ledger entry)
- Objects and fields: Contribution (item); Notification (channel, time, result); Device (push token); Audit entry.
- Open points:
  1. Criterion 7 falls back to French, then English; R110 says recipient language, then group language, then Malagasy. Which fallback order applies?
  2. Criterion 9 lets a holder of Contribution plan: edit turn automatic reminders off per plan, but the plan form (CON-01) and edit (CON-02) list no such field. Where is the switch?
  3. The delivery log "visible per recipient to holders of Contribution plan: send reminder" is the same screen as SCR-CON-30? Not specified in the story.
  4. The real SMS cost is open with the aggregator (default: count only).

---

### CON-09 Apply a late fee

- Story: CON-09 Apply a late fee
- Surfaces:
  - SCR-CON-37 | Late fee line on item detail (`con.latefee.applied`: "Late fee: X Ar" with the rule in words, own Penalty line) | inline | Member (own item); holders of Contribution plan: view on the board | item becomes Late with a fee configured | pay (CON-04) or waive
  - SCR-CON-38 | Waive fee (required reason; "Waive this fee") | sheet | holder of Contribution plan: exempt member | item detail | confirm
  - SCR-CON-39 | Penalty notice `msg.con.penalty_applied` (EV-CON-11; push, SMS fallback) | notification | the member (the group gets nothing naming the member) | fee applied | opens SCR-CON-16
  - SCR-CON-40 | Late fee job (daily at end of the grace period) | system | none | daily | none
- States per surface:
  - SCR-CON-37 [applied]: fixed amount, or percent of the item amount rounded down to a whole ariary, within the cap per item; a due amount, no automatic debit
  - SCR-CON-37 [repeat]: new Penalty once per cycle, never beyond the cap; never compounds; plan setting in force when the item was generated applies
  - SCR-CON-37 [not applied]: item Processing at the deadline, or Exempt; no fee
  - SCR-CON-37 [offline]: fee part of the cached item; Pay online only
  - SCR-CON-37 [waived]: fee waived; audit only
  - SCR-CON-38 [default]: required reason; waives one fee without exempting the item
  - SCR-CON-39 [push], [sms]: amount and due date
  - SCR-CON-40 [idempotent]: safe to retry; each fee once
- Criteria map:
  - AC 1: SCR-CON-37 [applied]
  - AC 2: SCR-CON-37 [applied] (no automatic debit; payable with or after the item; no fee on a fee)
  - AC 3: SCR-CON-37 [repeat]
  - AC 4: SCR-CON-37 [not applied]; SCR-CON-38 [default]
  - AC 5: SCR-CON-39 [push], [sms]
  - AC 6: no UI, system rule (no ledger entry on applying; paying writes a Penalty entry classified Penalty and linked to the item; income for the group wallet so rules run; waiver audit only)
  - AC 7: SCR-CON-40 [idempotent]
  - AC 8: SCR-CON-37 [offline]
  - AC 9: no UI, system rule (audit `latefee.applied`, `latefee.waived`)
- Objects and fields: Contribution (item, Penalty line, status Late); Contribution plan (`late_fee_*`); Ledger entry (on payment); Audit entry.
- Open points:
  1. `late_fee_*` values (type, value, repeat, cap) are settings with the fee off by default; no numbers are specified in the story.
  2. Is the late fee shown on the member's "owed" total in `con.item.owed_summary`? Not specified in the story.
  3. Does a waived fee notify the member? Criterion 5 covers only application; CON-10 covers exemption. Not specified.
  4. The "Waive this fee" reason: are presets as in CON-10? Not specified.

---

### CON-10 Exempt a member

- Story: CON-10 Exempt a member
- Surfaces:
  - SCR-CON-41 | Exempt (scope: this item, a number of cycles, a date range or "until lifted"; reason with presets hardship, illness, other; statement of who will see it) | page | holder of Contribution plan: exempt member | "Exempt" on a board row, item or member profile | confirm returns to the board
  - SCR-CON-42 | Exempt chip and reason view | inline | chip: members with the view permission; reason: the member and holders of Contribution plan: exempt member | board, item detail | none
  - SCR-CON-43 | Exemption notice `msg.con.exempted` (EV-CON-10; `state` applied or lifted; push, SMS fallback) | notification | the member (the group receives nothing) | exemption applied or lifted | opens SCR-CON-16
  - SCR-CON-44 | Lift exemption action | inline | holder of Contribution plan: exempt member | exempt chip | confirm
- States per surface:
  - SCR-CON-41 [default]: scope choice and required reason; states who will see the reason
  - SCR-CON-41 [paid item]: Paid items cannot be exempted; explains why the option is unavailable; refunds not part of this story
  - SCR-CON-41 [self]: a person cannot exempt themselves; server check; screen explains
  - SCR-CON-41 [offline]: readable from cache with last-synced banner; exempt shows `xct.offline.needs_connection`; not queueable
  - SCR-CON-42 [chip]: chip "Exempt" with no reason for other members with the view permission
  - SCR-CON-42 [effect]: affected items become Exempt; excluded from expected total, reminders and late fees; pending late fee waived
  - SCR-CON-43 [applied]: scope in plain words
  - SCR-CON-43 [lifted]: restores the plan from the next unpaid item
  - SCR-CON-44 [default]: lifting
- Criteria map:
  - AC 1: SCR-CON-41 [default]
  - AC 2: SCR-CON-42 [effect]
  - AC 3: SCR-CON-41 [paid item]
  - AC 4: SCR-CON-42 [chip]
  - AC 5: SCR-CON-43 [applied], [lifted]
  - AC 6: no UI, system rule (exemption never changes the plan, other amounts or any ledger entry; no second confirmation)
  - AC 7: SCR-CON-41 [self]
  - AC 8: SCR-CON-41 [offline]
  - AC 9: no UI, system rule (audit per exemption and lift; no ledger entry)
- Objects and fields: Contribution (item status Exempt, scope, reason); Membership; Audit entry; Notification.
- Open points:
  1. Criterion 5 mentions lifting an exemption but no trigger or screen is specified; where is the lift action reached (SCR-CON-44 is inferred)?
  2. How is "a number of cycles" entered (stepper) and how is the scope shown on the chip? Not specified in the story.
  3. Presets list is "such as hardship, illness, other"; the full list and keys are not specified.
  4. The reason is visible to holders of Contribution plan: exempt member only (not all Contribution plan: view holders); CON-20 criterion 6 plan log shows exemptions to Contribution plan: view holders. See CON-20 open point 1.

---

### CON-11 Define income split rules on a group wallet

- Story: CON-11 Define income split rules on a group wallet
- Surfaces:
  - SCR-CON-45 | Split rule builder ("When income arrives in [wallet], move [percent] to [destination]"; rule name; destinations up to `SHARE_MAX_DESTINATIONS`; timing On arrival or At a set time; sum check) | page | holder of Wallet: edit rules | "Split income" on the group wallet | Preview opens SCR-CON-50; Save opens SCR-CON-46
  - SCR-CON-46 | Save restatement ("Save: 60 percent to Reserve, 30 percent to Roof project, 10 percent stays", PIN-confirmed) | modal | holder of Wallet: edit rules | Save | confirm; leads to the gate (SCR-CON-13) or approval
  - SCR-CON-47 | "What happens when money arrives" summary (`con.split.summary`: every Active rule, order, sum, remainder, destination chains down to `RULE_CHAIN_DEPTH_MAX` hops) | inline | holder of Wallet: edit rules | SCR-CON-45 | none
  - SCR-CON-48 | Split rule read-only view (rule in words) | page | member with Wallet: view balance | wallet rules link | none
  - SCR-CON-49 | Second holder approval (PIN approval from one other holder of Wallet: edit rules) | page | other holder of Wallet: edit rules | gate fallback (2) | approve or refuse
- States per surface:
  - SCR-CON-45 [default]: sentence builder; whole percents; timing `con.split.timing` stated in words
  - SCR-CON-45 [sum over 100]: 101 or more; Save blocked with the exact excess
  - SCR-CON-45 [sum under 100]: line "Stays in [wallet]: N percent"
  - SCR-CON-45 [same wallet]: destination equals source; `err.rul.same_wallet`
  - SCR-CON-45 [cycle]: money could return to a wallet it passed through; `err.rul.cycle` with the path in plain words
  - SCR-CON-45 [chain too long]: longer than `RULE_CHAIN_DEPTH_MAX`; `err.rul.chain_too_long`
  - SCR-CON-45 [too many destinations]: more than `SHARE_MAX_DESTINATIONS`
  - SCR-CON-45 [loading]: skeleton
  - SCR-CON-45 [offline]: read-only from cache with last-synced time; Save disabled
  - SCR-CON-45 [save failed]: inputs kept; states no rule changed
  - SCR-CON-45 [permission missing]: read-only with no Edit button; direct link shows the missing permission and who holds it
  - SCR-CON-45 [preview required]: Save requires viewing the preview first (CON-12)
  - SCR-CON-46 [default]: one-sentence restatement; confirmation with PIN
  - SCR-CON-47 [default]: lists all Active, Paused and Waiting-for-vote rules on all group wallets for the checks
  - SCR-CON-48 [default]: rule in words for everyone with Wallet: view balance
  - SCR-CON-49 [default]: second holder approves with PIN; audit records "Second holder approval"
  - SCR-CON-13 [rule gate]: new Active rule, change of percent, destination or timing, adding a rule to a wallet with Active rules always go through the gate (no opt-out; `split_change_requires_vote` fixed at Always); rule shows "Waiting for vote" until a holder applies after a passed vote; authority vote; fallback order per GRP-13 criterion 4: vote with at least three holders of Vote: vote, else PIN approval from one other holder of Wallet: edit rules, else single member saves alone ("Single member, no gate"); a leaf outside the group needs a RUL-13 vote
- Criteria map:
  - AC 1: SCR-CON-45 [default], [too many destinations]
  - AC 2: SCR-CON-45 [default]
  - AC 3: SCR-CON-45 [sum over 100], [sum under 100]; SCR-CON-47 [default]
  - AC 4: SCR-CON-45 [same wallet], [cycle], [chain too long]
  - AC 5: SCR-CON-13 [rule gate]; SCR-CON-49 [default]; system rule (chain-leaf rule; class b authorised once at save; audit records "Vote", "Second holder approval" or "Single member, no gate")
  - AC 6: SCR-CON-45 [preview required]; SCR-CON-46 [default]; SCR-CON-13 [rule gate]
  - AC 7: SCR-CON-45 [permission missing]; SCR-CON-48 [default]
  - AC 8: SCR-CON-45 [loading], [offline], [save failed]
  - AC 9: no UI, system rule (audit `splitrule.created`; no ledger entry)
  - AC 10: SCR-CON-45 [default] (number pads, same word order, tested for 2x expansion)
- Objects and fields: Wallet rule (split rule: name, lines with percent and destination, timing, version, status Active, Paused, Ended, Waiting for vote); Wallet; Project (project-linked wallets); Decision (optional link); Audit entry (`splitrule.created`).
- Open points:
  1. How does the other holder reach and use SCR-CON-49 (notification key, screen)? The story names the fallback but no notification key or screen for the second holder.
  2. The shared gate point 7 skips the vote for "fewer than three members", while the fallback order tests "at least three holders of Vote: vote". A group of three members with fewer than three vote holders: which applies? Not specified in the story.
  3. The audit text differs: "No vote possible: fewer than three members" (gate point 7) versus "Single member, no gate" (criterion 5). Which wording does a two-member group record?
  4. The rule name limit (R94 `RULE_NAME_MAX` 40) is not stated in the story. Not specified.
  5. Is the destination wallet picker restricted to wallets of the same group plus project-linked wallets, with project wallets labelled? Stated in criterion 5; labels not specified.
  6. "Waiting for vote" copy and the "Start the vote" entry are owned by the shared gate; their placement on the builder screen is not specified.

---

### CON-12 Preview a split rule on past income

- Story: CON-12 Preview a split rule on past income
- Surfaces:
  - SCR-CON-50 | Split preview (RUL-04 component on group wallet credits: sample credits, typed sample amount, per-destination lines `con.split.preview.line`, Rounding line to Gereo, what stays, group chain view) | page | holder of Wallet: edit rules (and Wallet: view history for real history) | "Preview" in the builder | back to SCR-CON-45
- States per surface:
  - SCR-CON-50 [default]: destination amounts plus the Rounding line to Gereo plus what stays equal the credit to the ariary; writes nothing to the ledger
  - SCR-CON-50 [group chain view]: effect of all rules on the wallet including Paused and Waiting for vote, and the destination rules down to `RULE_CHAIN_DEPTH_MAX` hops (`con.split.summary`); never shows a path that CON-11 blocks
  - SCR-CON-50 [empty]: no past credit; asks for a sample amount and says so
  - SCR-CON-50 [loading]: skeleton
  - SCR-CON-50 [no history permission]: sample amount mode only, with a note naming Wallet: view history; phone numbers masked
  - SCR-CON-50 [offline]: works on cached history with the last-synced time; saving disabled
  - SCR-CON-50 [accessibility]: rows not columns on phones; amounts never clip at 200 percent
- Criteria map:
  - AC 1: SCR-CON-50 [default]
  - AC 2: SCR-CON-50 [default]
  - AC 3: SCR-CON-50 [group chain view]
  - AC 4: SCR-CON-50 [empty], [loading], [no history permission]
  - AC 5: SCR-CON-50 [offline]
  - AC 6: no UI, system rule (no audit entry; history inside the preview respects ledger visibility)
  - AC 7: SCR-CON-50 [accessibility]
- Objects and fields: Ledger entry (past credits); Wallet rule (draft); Wallet.
- Open points:
  1. RUL-04 owns the sample credits, typed amount and rounding display; how many sample credits (`PREVIEW_INCOME_COUNT` 3) and the 90-day lookback (R94) are not restated here. Not specified in the story.
  2. Which preview (real history or sample) is the default when history exists but the person lacks Wallet: view history? Criterion 4 says sample mode only; behaviour clear.
  3. CON-13 criterion 5 requires an old-versus-new comparison in the same preview; this story does not describe the comparison layout. See CON-13.

---

### CON-13 Change, pause or end a split rule, future income only

- Story: CON-13 Change, pause or end a split rule, future income only
- Surfaces:
  - SCR-CON-51 | Split rule detail and versions (version list, status chips Active, Paused, Ended, Waiting for vote, Needs attention; actions Edit, Pause, Resume, End) | page | holder of Wallet: edit rules; members with Wallet: view balance read | wallet rules list | edit opens SCR-CON-45 with old versus new preview
  - SCR-CON-52 | Effective moment statement (`con.split.change_effective`: "Applies to income that arrives after hh:mm on date") | inline | holder of Wallet: edit rules | SCR-CON-45 on edit | none
  - SCR-CON-53 | Pause, Resume and End controls (one tap, never gated) | inline | holder of Wallet: edit rules | SCR-CON-51 | immediate effect
  - SCR-CON-54 | Split changed notice `msg.con.split_changed` (EV-CON-13; in-app and push, no SMS) | notification | members with Wallet: view balance | change applied | opens SCR-CON-51
- States per surface:
  - SCR-CON-51 [default]: each save creates a new version; past entries keep the rule name and version that produced them
  - SCR-CON-51 [waiting for vote]: "Waiting for vote"; old version stays Active until a holder applies the passed change; gate per SCR-CON-13 (gated set: creating an Active rule, any change to a percent, destination or timing, adding a rule to a wallet with Active rules; no opt-out; fallback order as GRP-13; personal wallets not gated)
  - SCR-CON-51 [paused]: visible "Paused" chip on the rule and the wallet card; credits arriving while paused stay in the wallet and are not split retroactively on resume
  - SCR-CON-51 [ended]: ended permanently; history kept; soft state not a delete
  - SCR-CON-51 [concurrent]: another holder saved first; must review the latest version before saving
  - SCR-CON-51 [offline]: read-only with last-synced time; actions disabled
  - SCR-CON-51 [failure]: inputs kept; states the live rule did not change
  - SCR-CON-52 [default]: effective moment in words
  - SCR-CON-53 [resume check]: Resume re-runs the cycle and depth check of RUL-06
  - SCR-CON-54 [applied]: applied change notifies; digest-friendly; a change only waiting for its vote notifies nobody beyond the vote itself
- Criteria map:
  - AC 1: SCR-CON-52 [default]
  - AC 2: SCR-CON-51 [default]
  - AC 3: SCR-CON-51 [waiting for vote]; SCR-CON-13 [rule gate]
  - AC 4: SCR-CON-53 [resume check]; SCR-CON-51 [paused], [ended]
  - AC 5: SCR-CON-50 (preview compares old and new outcome on the same sample)
  - AC 6: SCR-CON-54 [applied]
  - AC 7: SCR-CON-51 [concurrent]
  - AC 8: SCR-CON-51 [offline], [failure]
  - AC 9: no UI, system rule (audit with before and after, version numbers, who, when, linked vote or decision; no ledger entry)
- Objects and fields: Wallet rule (version, status); Vote and Decision (link); proposal snapshot; Audit entry; Notification.
- Open points:
  1. Do Pause, Resume and End notify anyone? Criterion 6 covers only an applied change; the story does not say whether pause or end sends `msg.con.split_changed`.
  2. Is there a confirmation on End (it is permanent, "one tap")? The story says one tap and never gated; no confirmation is specified, though End is not reversible.
  3. The old-versus-new preview layout (CON-12 does not define it) is not specified.
  4. When the fewer-than-three-holders path applies, which approver screen (SCR-CON-49) is shown for a change versus a creation? Same as CON-11; not stated.

---

### CON-14 Execute the split automatically when income arrives

- Story: CON-14 Execute the split automatically when income arrives
- Surfaces:
  - SCR-CON-55 | Split engine (one run per credit and rule version; chains; scheduled runs; skips; reversal) | system | none | credit Confirmed (On arrival) or scheduled time (At a set time) | none
  - SCR-CON-56 | Ledger split lines (`con.ledger.split_line`: "40 percent to Savings by rule Share income"; one Rounding line to Gereo when above 0; skipped line state) | inline | members with Wallet: view history | group ledger and wallet history | opens the entry detail SCR-CON-65
  - SCR-CON-57 | Split executed digest item `msg.con.split_executed` (EV-CON-12; in-app, Low, weekly digest NTF-14) | notification | members with Wallet: view history | split run | none
- States per surface:
  - SCR-CON-55 [done]: destination amounts plus Rounding line plus what stays equal the credit to the ariary; provider fee never part of the credit
  - SCR-CON-55 [idempotent]: duplicate provider callback never writes a second split
  - SCR-CON-55 [chain]: each Split line a Confirmed credit that runs the destination's rules one hop deeper; lines carry rule name, version, hop number and `caused_by_entry_id`; delayed hops keep the first credit's id; failing hop skipped with `cycle_prevented` or `chain_too_long`, nothing written
  - SCR-CON-55 [scheduled]: At a set time splits the sum of Confirmed credits since the last run, including Split lines from other rules; lists the credits covered; no credit writes nothing
  - SCR-CON-55 [several rules]: each takes its percent of the whole credit in the order of `con.split.summary`; over 100 percent at run time skips the run (`percent_over_100`)
  - SCR-CON-55 [wallet held]: Held by Gereo skips every split leg and the Rounding line (`wallet_held`); credit stays whole; recorded in RUL history as "Wallet held"; a run in progress keeps legs already posted and shows a partial run
  - SCR-CON-55 [wallet freeze]: Wallet freeze continues splits inside the group and the Rounding line; firings with a destination outside the group pause
  - SCR-CON-55 [credit not confirmed]: Pending, Failed or Cancelled credit writes nothing
  - SCR-CON-55 [credit reversed]: reversing set follows down the chain, last hop first, with reason; Rounding reversed too; unrecoverable downstream goes to Needs attention for operators
  - SCR-CON-56 [default]: one Split line per destination named with rule name and version; Rounding line aggregated per original income in the app
  - SCR-CON-56 [skipped]: destination cannot receive; only its own line Skipped with `destination_held` (shown "Held by Gereo") or `destination_closed`; share stays in the wallet
  - SCR-CON-56 [offline]: entries from cache with the last-synced time
  - SCR-CON-57 [in-app]: no push or SMS for a normal run; SMS only if a group-level critical setting (Group: set notification settings) asks
- Criteria map:
  - AC 1: SCR-CON-55 [done]
  - AC 2: SCR-CON-56 [default], [skipped]
  - AC 3: SCR-CON-55 [idempotent]
  - AC 4: SCR-CON-55 [chain]
  - AC 5: SCR-CON-55 [scheduled]
  - AC 6: SCR-CON-55 [several rules]
  - AC 7: SCR-CON-55 [wallet held], [wallet freeze]
  - AC 8: SCR-CON-57 [in-app]
  - AC 9: SCR-CON-55 [credit not confirmed], [credit reversed]
  - AC 10: SCR-CON-56 [offline]; system rule (every run recorded with credit reference, rule version, hop, entries written, time; visible to holders of Wallet: view history)
- Objects and fields: Transaction (credit); Wallet rule (version); Ledger entry (Split, Rounding, caused_by_entry_id, hop); Notification; Audit entry.
- Open points:
  1. Where is the group-level critical setting that asks for SMS on a normal run (held by Group: set notification settings) shown? Not specified in the story.
  2. A partial run caused by a hold landing mid-run: which chip or text does the ledger show ("partial run")? Not specified in the story.
  3. How is the first-credit link `caused_by_entry_id` shown to members (entry detail only)? Not specified here.
  4. Does a "scheduled run that finds no credit" leave any visible trace for holders? Criterion 5 says writes nothing; audit says every run is recorded; unresolved whether an empty run is recorded.

---

### CON-15 Split execution failure and retry

- Story: CON-15 Split execution failure and retry
- Surfaces:
  - SCR-CON-58 | Split run detail (Needs attention, plain reason `con.split.failed.reason.*`, "The money is safe in [wallet]. Nothing was shared for [destination or rule].", lines that completed, "Run again") | page | holder of Wallet: edit rules | split failed notice, wallet card chip, rule history | "Run again"
  - SCR-CON-59 | Needs attention chip (split run) on the wallet card | inline | members with Wallet: view balance | wallet card | opens SCR-CON-58
  - SCR-CON-60 | Split failed notice `msg.con.split_failed` (EV-CON-14; in-app, push, SMS fallback S-fb, deduplicated per rule per day) | notification | holders of Wallet: edit rules | run Needs attention | opens SCR-CON-58
  - SCR-CON-61 | Escalation to operators (OPS-06 ticket after `split_escalation_hours`) | system | none | run unresolved | none
- States per surface:
  - SCR-CON-58 [needs attention]: no entry written for a failed or skipped line; money stays where the failed step would have run; reason codes `cycle_prevented`, `chain_too_long`, `percent_over_100`, `destination_held` (shown "Held by Gereo"), `wallet_held`; earlier hops of a chain stay done
  - SCR-CON-58 [auto retry]: transient errors retry up to `RULE_RETRY_MAX` with `RULE_RETRY_BACKOFF`; permanent errors (destination closed, rule cycle) wait for a person
  - SCR-CON-58 [run again]: person fixes the cause and taps "Run again"; re-run covers only lines that did not complete, uses the rule version in force when the credit arrived and the percent of the original credit; normal Split entries with a note "re-run"; run shows "Done after re-run"
  - SCR-CON-58 [already shared]: a re-run for a line already written is refused with "Already shared" and the original entries are shown
  - SCR-CON-58 [different sharing]: one-off manual transfer is a normal transfer (WAL-12); changed sharing is a new rule for future credits (guidance)
  - SCR-CON-58 [offline]: Needs attention readable from cache; "Run again" online only
  - SCR-CON-59 [shown]: until resolved
  - SCR-CON-60 [push, in-app, sms fallback]: paid from the group allowance; not a direct SMS
  - SCR-CON-61 [escalated]: still Needs attention after 24 hours; OPS-06 ticket with the run reference
- Criteria map:
  - AC 1: SCR-CON-58 [needs attention]
  - AC 2: SCR-CON-60 [push, in-app, sms fallback]; SCR-CON-59 [shown]
  - AC 3: SCR-CON-58 [auto retry]
  - AC 4: SCR-CON-58 [run again]
  - AC 5: SCR-CON-58 [different sharing]
  - AC 6: SCR-CON-58 [already shared]
  - AC 7: SCR-CON-61 [escalated]
  - AC 8: SCR-CON-58 [offline]
  - AC 9: no UI, system rule (audit of failure, retry attempts, manual re-run, escalation, who and when)
- Objects and fields: Wallet rule (version); Ledger entry (on success); Notification; Support ticket (escalation); Audit entry; split run (statuses Done, Needs attention, Done after re-run).
- Open points:
  1. Can "Run again" be used while a wallet is Held by Gereo (`wallet_held`)? The story does not say whether the button is disabled with a reason.
  2. Which text shows when a run is partly done and partly Needs attention? Criterion 1 says earlier hops stay done and are shown; wording not specified.
  3. A member without Wallet: edit rules sees the Needs attention chip (SCR-CON-59) but not the run detail? Not specified.
  4. The note "re-run" on entries: key not specified.

---

### CON-16 Group ledger transparency view

- Story: CON-16 Group ledger transparency view
- Surfaces:
  - SCR-CON-62 | Group ledger (headline sentences, reconciliation line, where the money goes, ledger thread grouped by day, filters, accounting view toggle) | page | member holding Wallet: view balance and Wallet: view history | group home | row opens SCR-CON-65; "Set up contributions" in the empty state opens SCR-CON-01
  - SCR-CON-63 | Headline sentences (`con.ledger.headline.*`: group balance, collected this cycle versus target, spent this cycle; "On the way: X Ar") | inline | same | SCR-CON-62 | none
  - SCR-CON-64 | "Where the money goes" (ranked list with percent bars, "Other" collapse after `LEDGER_TOP_DESTINATIONS_SHOWN`, Rounding to Gereo own row) | inline | same | SCR-CON-62 | each row opens the entries behind it
  - SCR-CON-65 | Group ledger entry detail (who requested, what authorised it: approver names or vote and decision; for Split and Rounding lines rule name, version, hop, first credit; reference ID; linked entries) | page | same | row in SCR-CON-62 | back
  - SCR-CON-66 | Ledger filters (type, period, amount range, status) | sheet | same | filter control | apply
  - SCR-CON-67 | "You contributed" and "The group holds" (two numbers) | inline | member | SCR-CON-62 | none
- States per surface:
  - SCR-CON-62 [default]: reverse-chronological entries grouped by day; chip, Where field, plain sentence, amount, status chip
  - SCR-CON-62 [accounting view]: debit and credit columns for holders of Wallet: export history
  - SCR-CON-62 [loading]: skeletons; never "No records"
  - SCR-CON-62 [empty]: new group; shows what the ledger is for and one primary button "Set up contributions"
  - SCR-CON-62 [offline]: cached data with "Last synced hh:mm"; cache older than `STALE_BALANCE_HOURS` shows a warning
  - SCR-CON-62 [real time]: new entries appear without reload (or at next sync in data-saver mode); pagination `HISTORY_PAGE_SIZE`
  - SCR-CON-62 [privacy]: phone numbers masked; attachments and private notes not shown; no member can hide their name
  - SCR-CON-62 [accessibility]: bars labelled with text; no information by colour alone; amounts never clip at 200 percent
  - SCR-CON-63 [default]: balance from Confirmed ledger entries; money on the way shown separately and never added
  - SCR-CON-64 [default]: only group spending counts as spending; a Cash-out row never counted as spending
  - SCR-CON-65 [default]: payment started by a passed vote shows the vote and decision (D4, VOT-13); Rounding as one aggregated row per original income
  - SCR-CON-66 [default]: filters type, period, amount range, status
  - SCR-CON-67 [default]: two numbers about themselves, never blended; no ownership claim
- Criteria map:
  - AC 1: SCR-CON-63 [default]
  - AC 2: SCR-CON-64 [default]
  - AC 3: SCR-CON-62 [default]; SCR-CON-65 [default]
  - AC 4: SCR-CON-66 [default]; SCR-CON-62 [accounting view]
  - AC 5: SCR-CON-67 [default]
  - AC 6: SCR-CON-62 [privacy]
  - AC 7: SCR-CON-62 [loading], [empty], [offline]
  - AC 8: SCR-CON-62 [real time]
  - AC 9: SCR-CON-62 [accessibility]
- Objects and fields: Ledger entry (chip, Where, amount, status, rule name, version, hop, caused_by_entry_id, authorisation links); Transaction; Wallet; Wallet rule; Approval and Decision (read links).
- Open points:
  1. Criterion 4 offers an amount-range filter; WAL-15 closed "no amount-range filter in the MVP". Is the group ledger an exception?
  2. The page needs both Wallet: view balance and Wallet: view history; what does a member with only one see? Not specified in the story (WAL-02 and WAL-15 show a permission message).
  3. With several group wallets, is the ledger per wallet or for the group? Not specified in the story.
  4. "Collected this cycle versus target" assumes one plan; groups with an Ended plan or no plan: what does the headline show? Not specified.
  5. How does the "Where the money goes" period relate to the plan cycle? "for the chosen period" is mentioned but the period control is not specified beyond filters.

---

### CON-17 Reconciliation line on the group ledger

- Story: CON-17 Reconciliation line on the group ledger
- Surfaces:
  - Reuses SCR-WAL-72 (reconciliation status line, defined under WAL-20; placed under the headline of SCR-CON-62; key `con.ledger.reconciled`; tap opens explanation SCR-WAL-73)
  - SCR-CON-68 | "Report a problem" (creates a support ticket with the reference, OPS-06) | sheet | member with Wallet: view balance | SCR-WAL-73 explanation | submit
- States per surface:
  - SCR-CON-68 [default]: reference pre-filled; submit creates a ticket
  - SCR-CON-68 [offline]: not specified in the story
  - SCR-WAL-72 [mismatch for members]: status, time and reference, never the amount; operators with `view reconciliation` see the amount
  - SCR-WAL-72 [stale or unavailable]: older than `RECON_MAX_AGE` carries a Warning chip; unavailable provider shows last good result, never an invented number; money on the way not counted and the line says so
  - SCR-WAL-72 [offline]: cached line with "Last synced hh:mm"; its own time stays the reconciliation time
- Criteria map:
  - AC 1: SCR-WAL-72 (placement under the SCR-CON-62 headline; per transaction and per group wallet)
  - AC 2: SCR-WAL-72 [mismatch for members]
  - AC 3: SCR-WAL-72 [stale or unavailable]
  - AC 4: SCR-CON-68 [default]
  - AC 5: SCR-WAL-72 [offline]
  - AC 6: no UI, system rule (no notification to members or group holders; operators alerted via OPS-05)
  - AC 7: no UI, system rule (every result stored with time, totals, difference, operator action; operator reads logged)
- Objects and fields: Reconciliation run (read, OPS-04); Ledger entry; Support ticket (create).
- Open points:
  1. Should "Report a problem" offline be queued as an auto-send item? WAL-14 puts "Report this payment" in the XCT-05 Auto-send registry; "Report a problem" here is not listed there. Not specified in the story.
  2. Is the reconciliation line shown to members who hold Wallet: view balance but not view history (the ledger page needs both)? Not specified in the story.
  3. Wording harmonisation with WAL-20 is flagged as pending in WAL-20; not specified here.

---

### CON-18 Export the ledger for meetings and accounting

- Story: CON-18 Export the ledger for meetings and accounting
- Surfaces:
  - SCR-CON-69 | Ledger export form (period, wallet, entry types, format CSV or PDF) | page | holder of Wallet: export history | "Export" on the group ledger | generate; same flow as SCR-WAL-57 to SCR-WAL-59
  - SCR-CON-70 | Meeting pack and CSV builder (group columns on top of WAL-16; PDF with headline numbers, ranked list, status board summary, reconciliation line, ledger rows) | system | none | confirmed export | none
- States per surface:
  - SCR-CON-69 [default]: choices of period, wallet, entry types, format
  - SCR-CON-69 [empty]: no entries for the filters; "Nothing to export for this period"; no file
  - SCR-CON-69 [failed]: says nothing was shared; retry (WAL-16 criterion 7)
  - SCR-CON-69 [progress]: generation, "Preparing" state, ready notification and private link follow WAL-16 criterion 5
  - SCR-CON-70 [pdf]: headline numbers, ranked list with percentages, status board summary (counts, no names unless the person also holds Contribution plan: view), reconciliation line, ledger rows; generation date and "Last synced" time
  - SCR-CON-70 [csv]: WAL-16 columns plus the classification chip, `authorised_by`, `rule_name`, `rule_version`, `hop`, `caused_by_entry_id`; per-hop Rounding lines in the export
  - SCR-CON-70 [content]: never private notes or attachments; voided and cancelled requests and reversed entries with their status; totals equal totals on screen to the ariary, Rounding lines included
- Criteria map:
  - AC 1: SCR-CON-69 [default]; SCR-CON-70 [pdf]
  - AC 2: SCR-CON-70 [csv]
  - AC 3: SCR-CON-70 [content]
  - AC 4: SCR-CON-69 [progress]
  - AC 5: no UI beyond SCR-CON-70 [csv] (language and encoding follow WAL-16 criterion 2)
  - AC 6: SCR-CON-69 [empty], [failed]
  - AC 7: SCR-CON-70 [pdf]
  - AC 8: SCR-CON-70 [content]
  - AC 9: no UI, system rule (audit `export.created` written once; kept `AUDIT_RETENTION_YEARS`)
- Objects and fields: Ledger entry; Transaction; Export file; Audit entry (`export.created`); Notification.
- Open points:
  1. Criterion 4 cites the ready notification as `push.wal.export_ready`, which does not match the key grammar (`msg.wal.export_ready.push` in WAL-16). Which key is correct?
  2. Retention for `export.created` is `AUDIT_RETENTION_YEARS` here while WAL-16 states the same entry without a retention; consistent, but the owner story for the entry is not named beyond "the same entry".
  3. The accounting format required by Malagasy accountants is open and external (default: flat CSV of WAL-16 with group columns).
  4. Members without the export permission get "their own contribution statement from CON-19 criterion 7"; where that entry point is shown to them from the ledger is not specified.

---

### CON-19 A member sees where their contribution went

- Story: CON-19 A member sees where their contribution went
- Surfaces:
  - SCR-CON-71 | Where did it go (own contribution amount, date, reference; "You contributed [total] this year"; "The group received [total] this year"; pooled-money statement; "What the group did since"; split chain and Rounding line; period choice this cycle or this year; optional PDF statement share) | page | Member (own contributions); Wallet: view history for group-level lists | receipt or "Where did it go" on a Paid item | statement share; entries behind rows
- States per surface:
  - SCR-CON-71 [default]: plain statement that money is pooled and no ownership share is claimed
  - SCR-CON-71 [what the group did]: ranked list of outflows and splits for the period after the payment (same component as CON-16), each row opens the entries behind it
  - SCR-CON-71 [split chain]: split entries this contribution produced (rule name, hop, destination, amount) and the Rounding line to Gereo as its own aggregated row (`ledger.rounding_line`), all summing to the contribution
  - SCR-CON-71 [period]: this cycle or this year; never shows other members' individual amounts unless the person holds Wallet: view history
  - SCR-CON-71 [loading]: skeleton
  - SCR-CON-71 [nothing spent]: "The group has not spent money since your payment"
  - SCR-CON-71 [offline]: from cache with "Last synced hh:mm"
  - SCR-CON-71 [permission revoked]: only own contributions and a note naming Wallet: view history
  - SCR-CON-71 [statement share]: PDF hides other members and phone numbers
- Criteria map:
  - AC 1: SCR-CON-71 [default]
  - AC 2: SCR-CON-71 [what the group did]
  - AC 3: SCR-CON-71 [split chain]
  - AC 4: SCR-CON-71 [period]
  - AC 5: SCR-CON-71 [loading], [nothing spent], [offline]
  - AC 6: SCR-CON-71 [permission revoked]
  - AC 7: SCR-CON-71 [statement share]; no notification (system rule)
  - AC 8: SCR-CON-71 [default] (figures read in full, plain sentences, no "debit" or "credit")
- Objects and fields: Contribution (own); Ledger entry; Wallet rule.
- Open points:
  1. "The group received [total] this year" is a group-level figure; does it need Wallet: view history or Wallet: view balance? Not specified in the story.
  2. The story is P2 and "field groups confirm it before it is built"; whether the screen exists in the first release is not specified.
  3. How does the screen show a contribution on which no split ran (empty chain)? Not specified in the story.

---

### CON-20 Permission checks and audit log for contributions and splits

- Story: CON-20 Permission checks and audit log for contributions and splits
- Surfaces:
  - Reuses SCR-CON-06 (missing-permission message, defined under CON-01; the states below are added by this story)
  - SCR-CON-72 | Plan log (created, changed, paused, ended, exempted, waived, reminded; filters by action and person) | page | holder of Contribution plan: view | plan page | back
  - SCR-CON-73 | Rule log (created, versions, pauses, executions, rounding amounts, chain hops, failures, re-runs; filters by action and person) | page | holder of Wallet: view history | wallet rules | back
  - SCR-CON-74 | Permission enforcement | system | none | every plan, reminder, exemption, split rule, export action | none
- States per surface:
  - SCR-CON-06 [direct link]: shows "You need [permission in words]. Ask [names of holders]" (`con.perm.missing`), never a bare "Not allowed"
  - SCR-CON-72 [default]: entries with who, when, what, before and after values, linked vote or decision, reason where required
  - SCR-CON-72 [own entries]: any other member sees only entries about themselves; former members keep their own
  - SCR-CON-72 [audit holder]: holders of Group: view audit log see both logs inside the group audit log (GRP-11)
  - SCR-CON-72 [empty]: "Nothing has happened yet"
  - SCR-CON-72 [loading]: skeleton
  - SCR-CON-72 [load failure]: never hides existing entries from cache
  - SCR-CON-72 [offline]: readable from cache with "Last synced"
  - SCR-CON-73 [default]: same behaviour as the plan log for the rule log
  - SCR-CON-74 [enforced]: server refuses a call without permission regardless of the interface; revoked permission takes effect on next request; offline cache never permits an action
  - SCR-CON-74 [operator]: operators with `search audit log` read logs, with `view reconciliation` read results; cannot change anything; access logged
- Criteria map:
  - AC 1: SCR-CON-74 [enforced] (permission per action: Contribution plan: view, edit, delete, exempt member, send reminder; Wallet: edit rules, export history; Group: set spending policy, set notification settings, view audit log)
  - AC 2: SCR-CON-06 [direct link]; hidden or disabled controls with a plain reason (no new surface)
  - AC 3: no UI beyond SCR-GRP-37 (Effective access lists these abilities with their source)
  - AC 4: SCR-CON-74 [enforced]
  - AC 5: no UI, system rule (append-only audit entries with who, when, what, before and after, linked vote, reason)
  - AC 6: SCR-CON-72 [default], [own entries], [audit holder], [offline]; SCR-CON-73 [default]
  - AC 7: no UI, system rule (reminder note text not stored; log shows who and when)
  - AC 8: SCR-CON-74 [operator]
  - AC 9: SCR-CON-72 [empty], [loading], [load failure]
- Objects and fields: Audit entry (who, when, what, before, after, linked vote, reason); Membership; Permission.
- Open points:
  1. The plan log is visible to holders of Contribution plan: view, which the Member bundle includes, so every member could read exemption and waiver entries; CON-10 says exemption reasons are visible only to the member and holders of Contribution plan: exempt member. Does the plan log redact the reason and the member name for those entries?
  2. Criterion 2 says controls are "hidden or disabled with a plain reason"; 09 section 10.4 says disable only for state, never permission. Which applies to controls without permission? Not specified in the story.
  3. The rule log's visibility to Wallet: view history holders includes rounding amounts and chain hops; CON-14 says Wallet: view history holders see runs. Consistent; the plan-log entry screen design is not specified.
  4. Where in the interface are the plan log and rule log reached (plan page, wallet rules page, group audit log)? Not specified in the story.

---

## Epic summary

- Stories: 20.
- Distinct surfaces: 74. By kind:
  - page: 26
  - sheet: 6
  - modal: 3
  - inline: 20
  - notification: 11
  - system: 8
- State lines: 211.
- Open points: 84. Full list:
  - CON-01.1: Criterion 2 warns when the amount exceeds "the lowest single-deposit limit among the configured tiers", while `plan_amount_max` is min(provider cap, Tier 1 single-deposit limit), and Tier 1 is normally the lowest. If so the warning threshold equals the block threshold; when does the warning show without the block?
  - CON-01.2: The form has a "who is covered" field defaulting to all current members; how a person excludes members, and whether exclusion is allowed at all, is not specified in the story.
  - CON-01.3: The late fee field is hidden until CON-09 is released; is the toggle simply absent from frames of the first release? Stated so; no state for "coming soon" specified.
  - CON-01.4: The one-plan rule is per group wallet; the form also chooses a destination wallet. Is the check against the destination wallet? Not specified in the story.
  - CON-01.5: Automatic reminders can be turned off per plan (CON-08 criterion 9) by holders of Contribution plan: edit, but this form has no reminder setting. See CON-08 open point.
  - CON-01.6: Does the covered-member count include the creator and are they notified `msg.con.plan_changed` themselves? Not specified in the story.
  - CON-02.1: Criterion 1 says edit covers amount, frequency, due day, late fee settings and end date; are plan name, destination wallet and covered members editable? Not specified in the story.
  - CON-02.2: By default only an amount increase is gated (`plan_change_requires_vote` = Amount increase). A frequency change from monthly to weekly raises the total each member owes without raising the amount; is it gated? Not specified in the story.
  - CON-02.3: The snapshot proposal screen (SCR-CON-13) is described only by the shared gate rules; which screen displays the vote result and the "Apply the change" button (plan detail or a dedicated page)? Not specified in the story.
  - CON-02.4: What does the delete option show for a plan with only Failed payments? Criterion 5 says no Failed payment may exist for delete; the explanation text is not specified.
  - CON-02.5: When pausing with "until I resume", is there a reminder to resume? Not specified in the story.
  - CON-03.1: A member of several groups: does "My contributions" show one group at a time or all groups together? The trigger says "from the group or the home dashboard"; not specified in the story.
  - CON-03.2: The offline Pay text is quoted as "Paying needs a connection" while CON-04 criterion 9 says Pay shows `xct.offline.money_blocked`. Which wins (text or key)?
  - CON-03.3: A "Former member" outstanding-debt item (shared definitions): how does a former member see it here? Not specified in the story.
  - CON-03.4: The yearly total period (calendar year or rolling 12 months) is not specified.
  - CON-04.1: Share receipt "produces an image or text", while WAL-14 and its open question say the shared receipt is a PDF and plain text in the MVP, not an image. Which format applies to a contribution receipt?
  - CON-04.2: Criterion 8 says the first-time payee pause does not apply, but the WAL-10 pause is also triggered by a new device or large amount; the exact trigger list for contributions is not specified.
  - CON-04.3: Whether paying a contribution from the wallet needs the PIN on every payment is implied by criterion 2; whether a contribution counts as money-out for tier limits is not stated (ACC-07 calls it a deposit or contribute check).
  - CON-04.4: Where the late fee choice (item only or item plus fee) is shown in the review, and its keys, are not specified in the story.
  - CON-04.5: Does the receipt show the rounding line when a split ran on the contribution (CON-19)? Not specified here.
  - CON-05.1: The shareable status page shows reference and status "so the member can quote it by SMS to support"; who can open it (anyone with the reference, or only the member), and what URL token protects it? Not specified in the story.
  - CON-05.2: The failure reasons include "member cap exceeded"; which cap is meant (tier limit, wallet cap)? Not specified in the story.
  - CON-05.3: The failure reason "wrong PIN" mentions a PIN typed on the operator's phone; the story does not say whether it can also mean the Gereo PIN.
  - CON-05.4: When money was taken and a refund is in progress, how does the member see closure ("closed by an operator after the provider confirms")? Not specified in the story.
  - CON-06.1: A member without Contribution plan: view sees headline counts; the Member bundle includes Contribution plan: view, so the counts-only audience is only people whose view was revoked. Is the counts-only view a reachable screen or an edge case? Not specified in the story.
  - CON-06.2: Does the board show the viewer's own row to a counts-only member? Not specified in the story.
  - CON-06.3: How does the board show a "Former member" outstanding-debt row (shared definitions: "marked Former member, no reminder, no late fee")? Not specified in the story.
  - CON-06.4: The board shows "Not reached" for failed SMS (CON-07 criterion 7); the chip placement is not specified here.
  - CON-07.1: Criterion 2 shows an "estimated cost" of the SMS; CON-08 open question and blocker B9 say no SMS price is shown, only the count. Does the preview show a price or only a count?
  - CON-07.2: How is "Remind selected" selection mode entered on the board (long press, checkboxes)? Not specified in the story.
  - CON-07.3: The optional note is kept only until sent (CON-20 criterion 7); is the sender shown a note counter against 60 characters? Implied; not specified.
  - CON-07.4: The delivery log placement (own page or section of the board) is not specified.
  - CON-08.1: Criterion 7 falls back to French, then English; R110 says recipient language, then group language, then Malagasy. Which fallback order applies?
  - CON-08.2: Criterion 9 lets a holder of Contribution plan: edit turn automatic reminders off per plan, but the plan form (CON-01) and edit (CON-02) list no such field. Where is the switch?
  - CON-08.3: The delivery log "visible per recipient to holders of Contribution plan: send reminder" is the same screen as SCR-CON-30? Not specified in the story.
  - CON-08.4: The real SMS cost is open with the aggregator (default: count only).
  - CON-09.1: `late_fee_*` values (type, value, repeat, cap) are settings with the fee off by default; no numbers are specified in the story.
  - CON-09.2: Is the late fee shown on the member's "owed" total in `con.item.owed_summary`? Not specified in the story.
  - CON-09.3: Does a waived fee notify the member? Criterion 5 covers only application; CON-10 covers exemption. Not specified.
  - CON-09.4: The "Waive this fee" reason: are presets as in CON-10? Not specified.
  - CON-10.1: Criterion 5 mentions lifting an exemption but no trigger or screen is specified; where is the lift action reached (SCR-CON-44 is inferred)?
  - CON-10.2: How is "a number of cycles" entered (stepper) and how is the scope shown on the chip? Not specified in the story.
  - CON-10.3: Presets list is "such as hardship, illness, other"; the full list and keys are not specified.
  - CON-10.4: The reason is visible to holders of Contribution plan: exempt member only (not all Contribution plan: view holders); CON-20 criterion 6 plan log shows exemptions to Contribution plan: view holders. See CON-20 open point 1.
  - CON-11.1: How does the other holder reach and use SCR-CON-49 (notification key, screen)? The story names the fallback but no notification key or screen for the second holder.
  - CON-11.2: The shared gate point 7 skips the vote for "fewer than three members", while the fallback order tests "at least three holders of Vote: vote". A group of three members with fewer than three vote holders: which applies? Not specified in the story.
  - CON-11.3: The audit text differs: "No vote possible: fewer than three members" (gate point 7) versus "Single member, no gate" (criterion 5). Which wording does a two-member group record?
  - CON-11.4: The rule name limit (R94 `RULE_NAME_MAX` 40) is not stated in the story. Not specified.
  - CON-11.5: Is the destination wallet picker restricted to wallets of the same group plus project-linked wallets, with project wallets labelled? Stated in criterion 5; labels not specified.
  - CON-11.6: "Waiting for vote" copy and the "Start the vote" entry are owned by the shared gate; their placement on the builder screen is not specified.
  - CON-12.1: RUL-04 owns the sample credits, typed amount and rounding display; how many sample credits (`PREVIEW_INCOME_COUNT` 3) and the 90-day lookback (R94) are not restated here. Not specified in the story.
  - CON-12.2: Which preview (real history or sample) is the default when history exists but the person lacks Wallet: view history? Criterion 4 says sample mode only; behaviour clear.
  - CON-12.3: CON-13 criterion 5 requires an old-versus-new comparison in the same preview; this story does not describe the comparison layout. See CON-13.
  - CON-13.1: Do Pause, Resume and End notify anyone? Criterion 6 covers only an applied change; the story does not say whether pause or end sends `msg.con.split_changed`.
  - CON-13.2: Is there a confirmation on End (it is permanent, "one tap")? The story says one tap and never gated; no confirmation is specified, though End is not reversible.
  - CON-13.3: The old-versus-new preview layout (CON-12 does not define it) is not specified.
  - CON-13.4: When the fewer-than-three-holders path applies, which approver screen (SCR-CON-49) is shown for a change versus a creation? Same as CON-11; not stated.
  - CON-14.1: Where is the group-level critical setting that asks for SMS on a normal run (held by Group: set notification settings) shown? Not specified in the story.
  - CON-14.2: A partial run caused by a hold landing mid-run: which chip or text does the ledger show ("partial run")? Not specified in the story.
  - CON-14.3: How is the first-credit link `caused_by_entry_id` shown to members (entry detail only)? Not specified here.
  - CON-14.4: Does a "scheduled run that finds no credit" leave any visible trace for holders? Criterion 5 says writes nothing; audit says every run is recorded; unresolved whether an empty run is recorded.
  - CON-15.1: Can "Run again" be used while a wallet is Held by Gereo (`wallet_held`)? The story does not say whether the button is disabled with a reason.
  - CON-15.2: Which text shows when a run is partly done and partly Needs attention? Criterion 1 says earlier hops stay done and are shown; wording not specified.
  - CON-15.3: A member without Wallet: edit rules sees the Needs attention chip (SCR-CON-59) but not the run detail? Not specified.
  - CON-15.4: The note "re-run" on entries: key not specified.
  - CON-16.1: Criterion 4 offers an amount-range filter; WAL-15 closed "no amount-range filter in the MVP". Is the group ledger an exception?
  - CON-16.2: The page needs both Wallet: view balance and Wallet: view history; what does a member with only one see? Not specified in the story (WAL-02 and WAL-15 show a permission message).
  - CON-16.3: With several group wallets, is the ledger per wallet or for the group? Not specified in the story.
  - CON-16.4: "Collected this cycle versus target" assumes one plan; groups with an Ended plan or no plan: what does the headline show? Not specified.
  - CON-16.5: How does the "Where the money goes" period relate to the plan cycle? "for the chosen period" is mentioned but the period control is not specified beyond filters.
  - CON-17.1: Should "Report a problem" offline be queued as an auto-send item? WAL-14 puts "Report this payment" in the XCT-05 Auto-send registry; "Report a problem" here is not listed there. Not specified in the story.
  - CON-17.2: Is the reconciliation line shown to members who hold Wallet: view balance but not view history (the ledger page needs both)? Not specified in the story.
  - CON-17.3: Wording harmonisation with WAL-20 is flagged as pending in WAL-20; not specified here.
  - CON-18.1: Criterion 4 cites the ready notification as `push.wal.export_ready`, which does not match the key grammar (`msg.wal.export_ready.push` in WAL-16). Which key is correct?
  - CON-18.2: Retention for `export.created` is `AUDIT_RETENTION_YEARS` here while WAL-16 states the same entry without a retention; consistent, but the owner story for the entry is not named beyond "the same entry".
  - CON-18.3: The accounting format required by Malagasy accountants is open and external (default: flat CSV of WAL-16 with group columns).
  - CON-18.4: Members without the export permission get "their own contribution statement from CON-19 criterion 7"; where that entry point is shown to them from the ledger is not specified.
  - CON-19.1: "The group received [total] this year" is a group-level figure; does it need Wallet: view history or Wallet: view balance? Not specified in the story.
  - CON-19.2: The story is P2 and "field groups confirm it before it is built"; whether the screen exists in the first release is not specified.
  - CON-19.3: How does the screen show a contribution on which no split ran (empty chain)? Not specified in the story.
  - CON-20.1: The plan log is visible to holders of Contribution plan: view, which the Member bundle includes, so every member could read exemption and waiver entries; CON-10 says exemption reasons are visible only to the member and holders of Contribution plan: exempt member. Does the plan log redact the reason and the member name for those entries?
  - CON-20.2: Criterion 2 says controls are "hidden or disabled with a plain reason"; 09 section 10.4 says disable only for state, never permission. Which applies to controls without permission? Not specified in the story.
  - CON-20.3: The rule log's visibility to Wallet: view history holders includes rounding amounts and chain hops; CON-14 says Wallet: view history holders see runs. Consistent; the plan-log entry screen design is not specified.
  - CON-20.4: Where in the interface are the plan log and rule log reached (plan page, wallet rules page, group audit log)? Not specified in the story.
