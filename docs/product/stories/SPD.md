# SPD: Spending and approvals

Epic code SPD, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, IDs). Sources: [info.md](../../../info.md) (sections "Garde-fous", "Flux d'argent", "Projets"), [competitive-analysis.md](../../research/competitive-analysis.md), [design-foundations.md](../../research/design-foundations.md) and the raw reports in `docs/research/raw/`.

Spending approvals are the other half of the product's trust promise: money leaves a group only when the right people have seen exactly what is paid, to whom, from which wallet, and agreed. The design rules that govern the whole epic come from [competitive-analysis.md](../../research/competitive-analysis.md) section 7 ("No single administrator can move group funds", "Every approval screen shows exact amount, payee, wallet and rule in plain language") and from [design-foundations.md](../../research/design-foundations.md) section 3 principle 4 ("Approvals authorise exactly what is shown. Any change voids earlier approvals").

## Decisions this epic follows

Founder decisions are in [05-decisions.md](../05-decisions.md); a story that contradicts one is wrong.

- **D1:** the requester can never approve their own request. No setting allows it.
- **D2:** permissions are wallet-level. This epic uses Wallet: initiate spend (ask to spend), Wallet: approve spend, Wallet: freeze, Wallet: edit rules, Wallet: view balance, Wallet: view history, Wallet: export history, Group: set spending policy, Group: grant permission, Project: approve purchase, Project: view and Vote: create. Operator permissions are a separate catalogue owned by OPS-01; an operator never approves, never votes and never counts toward a floor.
- **D3:** every deposit into a wallet is income for that wallet, including a payout that arrives from another wallet of the group. Its rules and splits run (RUL-07, CON-14).
- **D4:** a passed vote is the authorisation. Approvers apply only below `spend_vote_threshold`. A money vote counts only if at least two distinct voters other than the requester voted.
- **D5:** the split rounding line to Gereo is not a spending request and needs no approval here (CON-14, GRP-13 criterion 4).

Two ways to authorise a payout exist and nothing else does: the approvals of the band (each from a person other than the requester) or a passed vote. A request that has neither is never paid, whoever asks.

## Shared definitions for this epic

### Expense request statuses

An expense request (the object) has one status. The payout it produces is a transaction with the standard statuses (Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention). Status is always shown as icon + word + colour. The shape follows the status list of Open Collective expenses (`raw/08-competitor-ux-comparison.md` section 6.3, `raw/04-projects-voting-governance.md` section 3).

| Status | Meaning |
| --- | --- |
| Draft | Saved, not sent. Nobody else sees it |
| Awaiting vote | The policy requires a vote, or the requester asked for one, and the linked vote is open |
| Awaiting approval | Waiting for the required approvals ("1 of 2 approved") |
| Needs changes | An approver asked the requester to change the request (SPD-06). No approvals count until the requester edits (SPD-07) |
| Approved | Authorised (the required approvals are in, or the linked vote passed) and the payout is not yet sent (short, or held, see SPD-11 and SPD-15) |
| Paying | Payout transaction Initiated or Pending |
| Paid | Payout Confirmed |
| Failed | Payout failed; the request keeps its authorisation if nothing material changes (SPD-11) |
| Rejected | An approver rejected it, or the linked vote did not pass. Closed |
| Cancelled | Cancelled by the requester or a permission holder before the payout was sent, or closed by the system after `request_expiry` (shown as "Expired"). Closed |
| Needs attention | Outcome unknown or blocked, a person or an operator must act. Held-by-freeze, not-enough-money and project problems are reasons shown on this status, not statuses |

Statuses of the payout transaction come from the shared transaction table in [00-conventions.md](../00-conventions.md) section 2. "Frozen" and "Held by Gereo" are wallet states owned by WAL, not request statuses.

### Configurable parameters

Defaults are working values to validate in field interviews, not research findings. This epic owns the parameters below and defines each once. They are group settings edited on the "Spending rules" page by a holder of Group: set spending policy (GRP-12; GRP-12 must list every row marked "GRP-12"). Parameters owned by other epics are named in the last table and are never redefined here.

| Parameter | Meaning | Default | Edited in |
| --- | --- | --- | --- |
| `spend_approvals_default` | Approvals needed below the multi-approval threshold | 1; never below 1; never counting the requester (floor, SPD-02) | GRP-12 |
| `spend_multi_threshold` | Amount (without fee) at or above which more approvals are needed | Off: no multi-approval band until a group sets one | GRP-12 |
| `spend_approvals_multi` | Number of approvals at or above that amount | 2 when the band is on; never below 2 | GRP-12 |
| `spend_vote_threshold` | Amount (without fee) at or above which a vote is required. A passed vote is the authorisation and replaces approvals (D4) | Off: no vote band until a group sets one. When set it must be above `spend_multi_threshold` | GRP-12 |
| `receipt_required_above` | Amount at or above which a receipt or quote is mandatory | Off | GRP-12 |
| `attachment_max_size` | Largest file after on-device compression | 5 MB | System |
| `attachment_types` | Accepted file types | JPEG, PNG, PDF | System |
| `duplicate_window` | Time within which a same payee and amount raises a warning | 48 hours | System |
| `approval_reminder_after` | When waiting approvers are reminded once more | 24 hours (hypothesis from raw/07 section 8.8 R-NT3; matches EV-SPD-02) | System |
| `payout_retry_window` | How long Gereo keeps retrying a payout during a provider outage before Needs attention | 24 hours; retries are spaced and capped by OPS-13 | System |
| `spend_cap_mode` | What a spending cap does on a group wallet: warn, block, or require a vote | warn (RUL-09 says a cap alerts; block and vote are chosen on purpose) | GRP-12 |
| `freeze_lift_approvals` | Distinct people needed to lift an emergency freeze | 2; never below 2 | GRP-12 |
| `freeze_cycle_limit` | Freeze and lift cycles on one wallet in 24 hours before the group and an operator are told | 3 | System |
| `request_expiry` | Age, counted from the last change, after which an undecided or unsent-for-payout request is closed by the system. It does not apply while the status is Awaiting vote, where the vote deadline decides | 30 days | GRP-12 |
| `project_spend_requires_decision` | Project requests must link a decision before sending | Off | GRP-12 |

Parameters read from other epics:

| Need | Parameter | Owner |
| --- | --- | --- |
| Wait before an unread push becomes an SMS | `ntf.sms_window.<type>` (type: spending approval) | NTF-05 |
| Number of similar items that become one summary | `ntf.batch_threshold` (starting value 5) | NTF-08 |
| Quiet hours | `ntf.quiet_hours_default` | NTF-09 |
| Age after which a Pending payout becomes Needs attention | `PAYOUT_PENDING_ALERT_MINUTES` | OPS-13 |
| Amount that triggers the "Did someone ask you to send this?" pause | `LARGE_AMOUNT_PAUSE` | WAL-10 |
| Files per expense request | `PROJECT_ATTACHMENTS_PER_ITEM` (proposed 5) | PRJ-07 |
| Cap period options and warning level | `CAP_PERIOD_OPTIONS`, `CAP_WARNING_PERCENT` | RUL-09 |
| Quorum, majority and no-quorum choice of a vote | `VOTE_DEFAULT_QUORUM_PERCENT`, `VOTE_DEFAULT_MAJORITY`, `VOTE_DEFAULT_NOQUORUM_FALLBACK` | VOT-02, VOT-10 |
| Retention of requests, receipts and audit entries | `RECORD_RETENTION_YEARS`, `AUDIT_RETENTION_YEARS` | WAL, OPS |
| Tier limits and fees of money-out | tier limit and fee tables | OPS-11 |

### Message key prefixes

`msg.spd.request.*`, `msg.spd.policy.*`, `msg.spd.approval.*`, `msg.spd.payout.*`, `msg.spd.cap.*`, `msg.spd.freeze.*`, `msg.spd.perm.*`. The prefix `msg.spd.` matches the NTF event catalogue (EV-SPD-01 to EV-SPD-11), which is the registry of notification keys; the key names in this file are working names that NTF reconciles. Stories name keys only; SMS templates are GSM-7 safe and under 160 characters. Amounts display as `12 500 Ar`: integer ariary, space grouping, no decimals, identical in Malagasy, French and English. Buttons name the action and the amount ("Approve 120 000 Ar", "Send request for 120 000 Ar").

### Ledger vocabulary used here

Expense, Fee and Reversal rows, each with the request reference, the approvers or the passed vote with its voters, and the linked decision (see SPD-16). Corrections are reversing entries with a reason, never edits.

---

## Stories

### SPD-01 Create an expense request

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member or Permission holder
**Permission needed:** Wallet: initiate spend
**Tags:** legal-gate, offline, audit

**Story:** As a person who can initiate spending, I want to ask my group to pay someone from a wallet or a project, with the amount, the payee, a receipt or quote and a note, so that spending is requested openly and nobody pays from their own pocket and hopes to be repaid.

**Conversation:** The group's spending today runs on phone calls and memory (info.md problems 1 and 2). Open Collective's model is the best precedent: submit, approve, pay, everyone sees (`raw/04-projects-voting-governance.md` section 3). Policy text is shown on the form (`raw/08-competitor-ux-comparison.md` section 6.7; SPD-02). A request is a submission only, no money moves until the payout (SPD-10), so the screen says so. First-time payee, wrong-number and wrong-person risk is real: 25 percent of Sub-Saharan mobile money owners have sent money to the wrong person and half never recovered it (design-foundations section 1 point 1; `raw/07-ui-ux-best-practices.md` section 2.8 R-S3, section 2.6 R-E1 and R-E4). Moves client money when paid: legal-gate.

**Preconditions:** The person holds Wallet: initiate spend on the source wallet and has the identity tier that OPS-11 requires for money-out of this amount (below it the person sees the next step from ACC-07 before sending). Drafting is allowed while the wallet is frozen; sending is allowed too, approval and payout are not (SPD-15).
**Trigger:** The person taps "Ask to spend" from a wallet, a project, or a decision, or arrives from WAL-09, WAL-12 or WAL-13 on a group wallet.

**Acceptance criteria:**
1. The form asks: source wallet (default the one the person came from; the picker lists only wallets the person can initiate from), payee, amount (integer ariary, number pad), purpose (short text, required), note (optional), attachment (SPD-03), and optional links to a project and a decision (SPD-13).
2. Payee options: a member of the group, a saved payee, a new mobile money number with operator, or a Gereo destination (another Gereo user by phone number, a group wallet, or another wallet of this group, the cases of WAL-12 and WAL-13, which create their request here). Phone numbers are accepted in any common format (spaces, +261, leading 0) and shown back normalised. The payee's registered name is shown when the provider returns one; when it does not, the review screen says "Name not checked". A first-time payee is marked "New payee" and the form asks for a re-read of the last three digits.
3. The available balance of the wallet (balance minus amounts reserved for approved requests) is shown next to the amount. While typing, an estimated payout fee line is always shown ("Fee: 0 Ar" if none) and the total is updated live. If amount plus fee exceeds the available balance, the person is blocked before sending with the next step ("Ask for a smaller amount" or "Wallet needs more money"), and the input is kept.
4. The policy for this amount is visible on the form and on the review screen (SPD-02) before the Send button.
5. A single review screen restates source wallet, payee (name and masked number), amount, fee, total, purpose, attachment and the wallet effect ("Wallet goes from 800 000 to 680 000 Ar after payment"). The primary button is "Send request for [amount]". The screen states "Nothing is paid yet" (key `msg.spd.request.review_note`). No default choice is pre-selected.
6. Sending creates the request with a short reference (for example R-4821, never confused with a story ID) and status Awaiting approval, or Awaiting vote when the policy requires a vote (SPD-09). The requester sees "Sent, waiting for [N] approvals" or "Sent, the group is voting". Approvers are notified (SPD-04). Key `msg.spd.request.submitted` to the requester.
7. Duplicate check: another open or recent request with the same payee and amount inside `duplicate_window` shows a warning with a link; the person can still send. Draft autosave: the form is saved as a Draft at every field.
8. Offline: the form and drafts are available; a draft is kept on the device with the state "Draft, not sent" and Send is disabled with "Sending needs a connection". Nothing is queued silently. A failed send keeps the draft and says nothing was sent.
9. Permission: a person without Wallet: initiate spend sees no "Ask to spend" button. A direct link shows "You need 'Initiate spend' on this wallet. Ask [names]" (key `msg.spd.perm.missing`), enforced server-side.
10. Audit: entry `request.created` with who, when and every field. No ledger entry is written at this point.

**Data:** Expense request (write), Wallet (read), Membership (read), Notification (write), Audit entry (write).
**Depends on:** WAL-03 (balance, reserved amounts), WAL-09 and WAL-10 (fee estimate, limits, pause rules), WAL-12 and WAL-13 (Gereo destinations), GRP-08 and GRP-09 (permissions), OPS-11 (limits and fees), ACC-07 (tiers), SPD-02, SPD-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs Vanilla Pay: does the provider expose a payee name lookup (Confirmation of Payee)? Default used: no lookup, "Name not checked" plus the re-read of the last three digits. Closed: there is no per-request maximum of our own; the limit is the tier limit and fee table of OPS-11 and the provider limit, and a request above either is blocked before sending with the reason. Closed: one payee per request (batch is out of the MVP). Closed: members with Wallet: view history see amount, purpose, status, payee display name and approver names; attachments, notes and rejection reasons only the requester, approvers, voters of the linked vote who are members, and holders of Wallet: approve spend (Open Collective pattern).

---

### SPD-02 See the spending policy before sending

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member or Permission holder
**Permission needed:** Wallet: initiate spend (to use it); Wallet: view balance (to read the policy page)
**Tags:** audit

**Story:** When I am about to send an expense request, I want to read in plain words who must approve it and whether a vote is needed, so I know what will happen and how long it may take.

**Conversation:** The policy is displayed on the Open Collective submission page and is the strongest cue that spending is governed, not arbitrary (`raw/04-projects-voting-governance.md` section 3; `raw/08` section 6.7). Thresholds and mandatory votes live in product logic, not in the permission system (conventions section 7; info.md "Garde-fous"). The approval count is shown like a quorum ("2 of 3 approvers needed", `raw/07-ui-ux-best-practices.md` section 8.4 R-AP4).

**Preconditions:** The person is on the request form (SPD-01) or on the wallet's "Spending rules" page.
**Trigger:** The form opens or the amount changes.

**Acceptance criteria:**
1. A policy panel states in one or two sentences, using the live amount: how many approvals are needed, that approvers must hold Wallet: approve spend and are never the requester (decision D1), whether a vote is required instead of approvals (decision D4), and the wallet's available balance (key `msg.spd.policy.summary` with parameters).
2. Tiers, compared with the amount without the fee: below `spend_multi_threshold` the request needs `spend_approvals_default` approval; at or above it needs `spend_approvals_multi`; at or above `spend_vote_threshold` a vote replaces approvals: the request goes to a vote and, if it passes, the payout starts. A band that is off (default) is not mentioned. Crossing a threshold while typing changes the text and highlights the change with a text note, not colour alone.
3. Floor (GRP-13): whatever the group sets, a payout needs either at least one approval from a person other than the requester, or a passed vote with at least two distinct voters other than the requester. A group that never configured a policy gets exactly this floor. The floor can be raised, never lowered.
4. The panel lists the eligible approvers (names and count). When fewer people can approve than the policy requires (for example the founder is alone), the panel says "You need [N] more people who can approve spending", the Send button is disabled, and a link opens how to ask the people who can grant permissions (GRP-08). If at least three people hold Vote: vote (the requester and two others), the panel also offers "Ask the group to vote first" (SPD-09) as the other way to spend.
5. For a project expense, the panel also states the project purchase approval needed (SPD-13), and the project budget remaining.
6. State notes appear when relevant: wallet frozen (SPD-15), spending cap reached or the amount left this period (SPD-14), amount above available balance. Each says whether the person can still send and what to do.
7. A read-only "Spending rules" page shows the same rules for every member who can view the wallet, with who last changed them and when.
8. Offline: the cached policy appears with "Last synced hh:mm" and "The rule may have changed". At send, the server re-evaluates; if the policy changed, the person sees the new policy and must confirm again before the request is created.
9. Language: the sentence is a key with parameters and is tested for 200 percent expansion in Malagasy and French (XCT-13); amounts never clip at 200 percent font scale (XCT-08).
10. A request already waiting keeps the rule it was created under and shows "Rule when requested: 2 approvals" (GRP-12 criterion 6). The floor and decisions D1 and D4 always apply on top of the old rule.

**Data:** Spending policy (read), Wallet (read), Membership (read), Permission (read).
**Depends on:** GRP-12 (policy settings), GRP-13 (floor), GRP-09 (who can approve), RUL-09 (caps), WAL-03, VOT-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the policy is edited by a holder of Group: set spending policy on the "Spending rules" page (GRP-12, decision D2); tightening applies at once, loosening needs two other approvers or a vote (GRP-12 criterion 5), which answers `raw/07` section 8.5 R-PM5. Closed: the policy is per group with an optional per-wallet override (GRP-12 criterion 7), and a project may be stricter (PRJ-06), never looser.

---

### SPD-03 Attach a receipt or a quote

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member or Permission holder
**Permission needed:** Wallet: initiate spend
**Tags:** offline

**Story:** As a requester, I want to attach a photo of a receipt, an invoice or a quote to my request, so that approvers can see what the money is for before they approve.

**Conversation:** Open Collective expenses always come with a receipt or invoice, and the approver sees it (`raw/04-projects-voting-governance.md` section 3). On Madagascar's devices and connections a photo can be large and an upload can fail, so capture, compression and resume matter (design-foundations section 3 principle 6; `raw/07` sections 3 and 4). Out of scope for v1: document versioning and library; attach files to decisions and expenses only ([competitive-analysis.md](../../research/competitive-analysis.md) section 7).

**Preconditions:** A request is Draft or open for edit (SPD-07).
**Trigger:** The person taps "Add receipt or quote" on the form.

**Acceptance criteria:**
1. The person chooses Receipt or Quote and takes a photo, picks one from the gallery or picks a PDF. Types and size are limited by `attachment_types` and `attachment_max_size`; the app compresses photos on the device before upload and tells the person the size.
2. A progress bar shows the upload with a Cancel and a Retry. An upload that is interrupted resumes where it stopped when the connection returns, without asking the person to start again.
3. Offline: the attachment is stored with the draft on the device, shown as "Waiting to upload", and uploaded when the person is online. Sending the request needs the upload to be complete.
4. If the amount is at or above `receipt_required_above`, an attachment is mandatory and the Send button explains which item is missing (key `msg.spd.request.attachment_required`).
5. Approvers see a thumbnail and open the full image on tap, so no heavy image loads on a data plan before they choose to. A zoom control is available and the image is not cropped.
6. Privacy: attachments are visible only to the requester, holders of Wallet: approve spend or Project: approve purchase on this request, and members who are voters on its linked vote (they authorise the payment, VOT-03 criterion 1). A guest voter never sees them (VOT-06). They are not shown in the shared ledger or in exports (SPD-16).
7. Adding an attachment to a request that already has approvals does not void them, but approvers who already approved are notified "A receipt was added" (key `msg.spd.approval.attachment_added`). Removing or replacing an attachment counts as an edit and voids approvals (SPD-07).
8. Unsupported file or oversize: the message says which limit failed and what to do ("Use a photo under X MB or take a new one"), the draft is kept.
9. Accessibility: the attachment has a text label (type and date) and an alternative text field ("Receipt for roof tiles, 120 000 Ar") for approvers who use a screen reader.

**Data:** Document (write, attached to the Expense request), Expense request (write), Audit entry (write).
**Depends on:** SPD-01, SPD-07, PRJ-07 (the project entry point to the same function), XCT-05 (offline queue of non-money items), XCT-07 (data saver).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: maximum size and types are `attachment_max_size` and `attachment_types` (defaults 5 MB, JPEG, PNG, PDF); the count per request follows `PROJECT_ATTACHMENTS_PER_ITEM` of PRJ-07. Closed: a quote can stay and the final invoice is added as a second file without voiding approvals; if the final invoice has a different amount, the amount edit voids approvals (SPD-07). Open, needs a lawyer: retention of attachments after a request is deleted or a group closes (five years under `raw/03` section 7.1 item 8 as read); default used: kept for `RECORD_RETENTION_YEARS` (5) and never shown to the group after the group deletes the request.

---

### SPD-04 Approval inbox

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: approve spend (or Project: approve purchase for project requests)
**Tags:** offline, sms

**Story:** When I open the app, I want to see which requests are waiting for me, with the amount and how long they have waited, so I can approve quickly and the group is never blocked by my silence.

**Conversation:** "What needs me now" is the first block of the home: pending approvals, votes closing, contributions due (`raw/08-competitor-ux-comparison.md` section 6.2). Approvers are the bottleneck: pending approvals notify immediately, then once after 24 hours (`raw/07-ui-ux-best-practices.md` section 8.8 R-NT3). Approvals that happen only by email fail for members without email (`raw/08` section 6.7).

**Preconditions:** The person holds Wallet: approve spend on at least one wallet with an open request, or Project: approve purchase on a project with one.
**Trigger:** A request becomes Awaiting approval, or the person opens "Approvals".

**Acceptance criteria:**
1. The inbox has three tabs: "Waiting for me", "I approved or rejected", "All requests I can see". Each row shows requester, purpose, amount, source wallet, status chip, approval progress ("1 of 2 approved") and the time waiting. Sorted by oldest first by default.
2. A request voided by an edit reappears at the top of "Waiting for me" with a "Changed" chip and a note of what changed (SPD-07). A request the person submitted themselves, or one where the person is the payee, appears in "All" with a note that someone else must approve (SPD-08), never in "Waiting for me". A request in Awaiting vote appears in "All" and in the voters' own vote list (VOT), never in "Waiting for me".
3. A badge with the count of waiting requests shows on the home and the navigation. The count equals the number of rows in "Waiting for me".
4. Notification to approvers (EV-SPD-01, EV-SPD-02): key `msg.spd.approval.requested` immediately by push, then one reminder after `approval_reminder_after` if still waiting (`msg.spd.approval.reminder`). If the push is unread after the NTF-05 wait (`ntf.sms_window` for spending approvals), an SMS (`msg.spd.approval.requested.sms`) carries the amount, requester and reference and a link to the detail; approving requires the app and is never done by SMS reply.
5. Batching: when `ntf.batch_threshold` or more requests are waiting, they produce one summary notification, not one each (NTF-08). Quiet hours (NTF-09) hold push and SMS for approval requests until they end, unless that would pass `request_expiry`; the group cannot change this, and freeze and failed-payout messages follow their own rule (SPD-11, SPD-15).
6. Empty state: "Nothing is waiting for you" with a link to all requests. Loading shows skeleton rows, never an empty message while loading.
7. Offline: the cached list is readable with "Last synced hh:mm". Opening a detail offline shows the cached summary; Approve and Reject are disabled with "Approving needs a connection". A request that was decided elsewhere shows its true status after sync, and cannot be approved twice.
8. A notification deep-links to the exact request detail (SPD-05).
9. Accessibility and language: rows read as one sentence for a screen reader ("Rado asks 120 000 Ar for roof tiles, waiting two days, one of two approved").

**Data:** Expense request (read), Approval (read), Notification (write), Membership (read).
**Depends on:** SPD-01, SPD-08, GRP-09, NTF-05, NTF-08, NTF-09, XCT-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: quiet hours apply to approval SMS, because an approval request is never a security event and a late approval costs less than a night wake-up (NTF-09 criterion 3). Closed: no separate daily digest of waiting approvals; the badge, the first reminder and the weekly digest (NTF-14) are enough for the MVP.

---

### SPD-05 Approval detail and approve

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: approve spend (for project requests, also Project: approve purchase, see SPD-13)
**Tags:** legal-gate, audit

**Story:** As a person who can approve spending, I want to read in plain language exactly what will be paid, to whom, from which wallet, what remains, and who already approved, and then approve that exactly, so that I never approve something I did not understand.

**Conversation:** The approval card shows requester, purpose, amount, destination name and number, source wallet and balance after, evidence, related project and budget line, who approved, and what happens next (`raw/07-ui-ux-best-practices.md` section 8.4 R-AP1). Buttons name the outcome and are not styled to push approval (R-AP2). Confirmation must restate specifics, never default to yes (`raw/07` section 2.4 R-C2, R-C5, R-C6; NN/g confirmation). First-time payee, large amounts and new devices trigger a pause with "Did someone ask you to send this?" (R-S3). Approvals authorise exactly what was shown (R-AP3; PSD2 dynamic-linking principle). Moves client money: legal-gate.

**Preconditions:** A request is Awaiting approval. The person holds the required permission, has the identity tier OPS-11 requires for approving money-out of this amount, is online, and is not blocked by separation of duties (SPD-08).
**Trigger:** The person opens a request from the inbox or from a notification.

**Acceptance criteria:**
1. The detail opens with a plain-language summary sentence (key `msg.spd.approval.summary`): "[Requester] asks to pay [amount] to [payee] from [wallet]. After payment the wallet holds [balance after]. [N of M] approved: [names]." Under it: purpose, note, attachment thumbnail, payee name and masked number, operator, fee, total, related project and budget line with remaining budget, linked decision or vote, and the policy that applies.
2. Buttons are "Approve [amount]" and "Reject" (SPD-06), neither pre-selected. The first screen never contains an "Approve all" action. Approval is per request.
3. For a first-time payee (never paid successfully from this wallet), a payee that fails a name check, an amount at or above `LARGE_AMOUNT_PAUSE` (WAL-10) or a new device (ACC-05), a pause screen appears before the PIN with the question "Did someone ask you to send this money?" (key `msg.spd.approval.pause`), "Cancel" as the visually primary action, and "Gereo will never ask for your PIN".
4. The PIN screen repeats the amount and the payee. After a correct PIN the approval is recorded with the approver, time, and a hash of exactly what was shown, so the approval authorises only that content.
5. The result shows "You approved. [N of M] approved. [What happens next]" (key `msg.spd.approval.recorded`). The final approval changes the status to Approved and starts the payout (SPD-10), and says so.
6. Business rules: each approver counts once. The requester and the payee cannot count (SPD-08). An approval recorded by a person whose permission was revoked before execution does not count (re-checked in SPD-10).
7. Insufficient available balance at the time of approval blocks the action with the reason and no approval is recorded (the funds could have been reserved by another approved request).
8. Errors: if the request was edited, cancelled, rejected or already paid since the approver opened it, the approver sees the new state and the approve button is replaced by what changed; no approval is recorded. If the connection fails after the PIN, the approval state is unknown to the person: the screen says "Checking" and reloads the real state; no duplicate approval is created (idempotent key per approver and content).
9. Notifications: the requester receives `msg.spd.approval.recorded.requester` (push) per approval; the other approvers are not notified of each approval except for the final one (`msg.spd.request.approved`).
10. Audit: entry `approval.recorded` with approver, time, request version and device. No ledger entry yet.

**Data:** Expense request (read, write status), Approval (write), Wallet (read), Project (read), Audit entry (write), Notification (write).
**Depends on:** SPD-04, SPD-02, SPD-06, SPD-08, ACC-03 (PIN), ACC-04 (PIN reset), ACC-05 (new-device signal), WAL-03 (balance, reserve), WAL-10 (pause and PIN pattern), NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a PIN is required for every approval, since each one authorises money going out (`raw/07` R-C1); WAL-10 asks the same of each approver. Closed: a project request needs both gates, see SPD-13. Open, needs Vanilla Pay: the payee name check (see SPD-01); default used: "Name not checked" and the pause screen for first-time payees.

---

### SPD-06 Reject a request with a reason

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: approve spend (or Project: approve purchase for project requests)
**Tags:** audit

**Story:** As an approver, I want to reject a request and say why, so that the requester understands, can fix it, and the group keeps a record.

**Conversation:** Open Collective requires a comment on rejection and notifies the requester; its status list includes "Incomplete" with a comment trail (`raw/08-competitor-ux-comparison.md` section 6.7). Rejection reasons should be offered as presets to keep the action quick (`raw/07-ui-ux-best-practices.md` section 8.4 R-AP2). Tone: errors and refusals state facts and a next step, never blame (`raw/07` section 9; NN/g). Failed votes copy follows the same pattern (R-VT8).

**Preconditions:** A request is Awaiting approval and the person may approve it.
**Trigger:** The approver taps "Reject" in SPD-05.

**Acceptance criteria:**
1. The screen asks for a reason: presets (for example "Missing receipt", "Amount too high", "Not a group expense", "Wrong payee", "Other") and an optional short text. A reason is required; the Reject button names the action.
2. The approver chooses one of two outcomes: "Reject, closed" (status Rejected) or "Ask to change" (status Needs changes, no approvals counted until the requester edits, see SPD-07). "Ask to change" is the one shown first, neither is pre-selected. The choice is written in plain words on the screen.
3. The choice of one approver takes effect at once and no group setting changes that. The other approvers see "Rejected by [name]" or "[Name] asked for changes, with the reason". A Needs changes request that the requester does not edit is closed by the system after `request_expiry` as Cancelled (Expired), not Rejected.
4. The reason is shown to the requester and to the other approvers, in the request's comment trail with the approver's name, time and reason. Other members who can view only see the status.
5. The requester receives `msg.spd.request.rejected` or `msg.spd.request.needs_changes` (push, SMS fallback if unread) with the reason and the next step ("Edit and send again" or "Closed").
6. A Rejected request cannot be approved or paid. A new request can be copied from it and shows a link to the original and its reason. Money never moved; the message says so.
7. Errors and states: if the request already changed or was decided, the person sees the new state and no rejection is recorded. Offline: Reject is disabled with an explanation; nothing is queued.
8. Audit: `approval.rejected` with approver, time, reason, outcome. No ledger entry is written.
9. Accessibility and language: preset reasons are keys translated in Malagasy, French and English; the text field accepts all three scripts and diacritics.

**Data:** Expense request (write status), Approval (write), Notification (write), Audit entry (write).
**Depends on:** SPD-05, SPD-07, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: one approver decides between closing and asking for changes, with no group setting; a single rejection is safe because it only stops money, and the requester can copy the request. Closed: a Rejected request cannot be re-submitted; a copy is a new request that needs new authorisation, so it cannot be used to shop for a friendlier approver without the others seeing the earlier rejection (the copy links to the original).

---

### SPD-07 Edit a request, earlier approvals are voided

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member (the requester)
**Permission needed:** Wallet: initiate spend (and being the requester)
**Tags:** legal-gate, audit

**Story:** As a requester, I want to fix a mistake in my request even after some people approved it, knowing earlier approvals no longer count, so that approvers always authorise exactly what is paid.

**Conversation:** Open Collective requires re-approval after any modification (`raw/04-projects-voting-governance.md` section 3). The product rule is that an approval authorises exactly what was shown; if the amount, destination or source changes, existing approvals are voided and approvers are re-notified (`raw/07-ui-ux-best-practices.md` section 8.4 R-AP3; design-foundations section 3 principle 4). Rule R-VT9 applies the same idea to votes ("do not allow a proposal to be edited after the first vote without notifying and resetting votes").

**Preconditions:** The request is Draft, Awaiting vote, Awaiting approval or Needs changes. It is not Approved with payout sent, Paying, Paid, Rejected or Cancelled.
**Trigger:** The requester taps "Edit" on their request.

**Acceptance criteria:**
1. Before the edit starts, the screen says: "Changing this request will cancel the [N] approvals it already has. Approvers will need to approve again." (key `msg.spd.request.edit_warning`). The person must confirm to continue. A request with no approvals edits without this warning.
2. Material fields are: source wallet, payee, amount, purpose, linked project or budget line, linked decision or vote, and removing or replacing an attachment. Changing any material field voids all approvals. Adding a note or an attachment does not (SPD-03).
3. After saving a material change, the status returns to Awaiting approval, or to Awaiting vote if the new amount is at or above `spend_vote_threshold` (SPD-09), and the approval count shows "0 of N". A request that was in Awaiting vote and falls below the vote threshold keeps its vote cancelled and goes to Awaiting approval unless the requester asked for the vote by hand. A "Changed" label states what changed (from and to values) on the detail and in the inbox.
4. Approvers who had approved, and all approvers who can still approve (or, on a money vote, the voters), receive `msg.spd.approval.voided` (EV-SPD-06; push, SMS fallback if unread) with the changed fields. A vote already open for the request is cancelled and replaced as VOT-03 criterion 5 and SPD-09 criterion 5 say; a passed vote is voided by a material edit in the same way.
5. The policy is re-evaluated with the new amount (SPD-02). If the new amount needs a vote or more approvals, the requester sees this before saving.
6. A request that was Approved and waiting for payout (held for a freeze, SPD-15, or a provider outage, SPD-11) is moved back to Awaiting approval or Awaiting vote by the edit, whether it was authorised by approvals or by a passed vote; the reserved funds are released.
7. Version history: each edit creates a new version. Approvals record the version they apply to. Old versions remain readable with who changed what and when, for approvers and permission holders.
8. Concurrency: if an approver approves while the requester is editing, the approval is recorded against the old version and is voided on save; the approver sees "Changed while you were approving" and nothing is paid.
9. Offline: Edit is read-only with an explanation; the draft of the edit is not queued. Errors keep the person's inputs.
10. Audit: `request.edited` with version, before and after values, voided approvals (who and when), who edited, when.

**Data:** Expense request (write, versions), Approval (void), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-03, SPD-05, SPD-09, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: only the requester edits; an approver who wants a change uses "Ask to change" (SPD-06) and a permission holder may cancel (SPD-12). Closed: a note edit is not material and does not void approvals.

---

### SPD-08 Separation of duties

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: approve spend
**Tags:** legal-gate, audit

**Story:** As a member of a money group, I want the person who asks for money never to be the only person who approves it, so that no single person can move the group's funds.

**Conversation:** Administrator risk is the dominant failure mode of tontines and chamas: members lost 1M and 1.5M FCFA when an administrator vanished (`raw/01-group-savings.md` section 13 risk 1; [competitive-analysis.md](../../research/competitive-analysis.md) section 3.1). Stanbic's role matrix lets both chairperson and treasurer pay and does not document multi-approver (`raw/08-competitor-ux-comparison.md` section 6.7). "Never let the requester approve their own request when the group's rule excludes it; explain why" (`raw/07-ui-ux-best-practices.md` section 8.4 R-AP5). Tonti+ blocks admin self-payout as the counter-pattern (`raw/08` section 6.4).

**Preconditions:** A request is Awaiting approval and the viewer holds Wallet: approve spend on its wallet.
**Trigger:** The requester, the payee or an approver who already approved opens the request or tries to approve.

**Acceptance criteria:**
1. The requester can never approve their own request (decision D1, no setting exists to change it). The approve button is absent for them and a note says "You asked for this payment, so someone else must approve it" (key `msg.spd.approval.self_blocked`). The rule is enforced on the server, not only on the screen.
2. A person who is the payee (for example a member reimbursed) cannot approve it either, with the same kind of note; this rule is fixed like criterion 1. A person who already approved cannot approve again. Gereo staff are never approvers, whatever they hold in the back office (GRP-13).
3. The policy counts only distinct eligible approvers. A group with only one person who can approve, and who is also the requester, sees on the form "You need another person who can approve spending" and cannot send by approvals (SPD-02). This is the intended friction: the founder starting alone must grant the permission to a second person.
4. A group with at least three people who hold Vote: vote can still spend through a vote (SPD-09, GRP-13 criterion 5). The requester's own vote never counts toward the minimum of two other voters.
5. Permission and relationship changes are re-checked at execution (SPD-10): an approver who lost the permission, left the group or became the payee since approving no longer counts, and the request returns to Awaiting approval with the missing count.
6. The requester sees the list of eligible approvers and who has approved (names), so they know who to ask; they can send a nudge reminder to those who have not (maximum one per approver per `approval_reminder_after`) (key `msg.spd.approval.nudge`).
7. A permission holder cannot grant themselves Wallet: approve spend to unblock their own request: granting needs another person who holds Group: grant permission (GRP-08) and is audited (GRP-10).
8. Errors: any attempt to approve against the rule shows what rule applies, whether money moved (no) and what to do next (ask another approver). No approval is recorded.
9. Audit: refused self-approval attempts are logged with who, when and request, so a pattern can be seen.

**Data:** Expense request (read), Approval (read, write refusal), Membership (read), Permission (read), Audit entry (write).
**Depends on:** SPD-05, GRP-08, GRP-10, GRP-13, SPD-02, SPD-10.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a payee who is also an approver cannot approve that request (criterion 2). Closed by D1: the self-approval open question no longer exists.

---

### SPD-09 Link a vote to an expense

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder or Member (requester)
**Permission needed:** Wallet: initiate spend. When the policy requires the vote, the system creates it and Vote: create is not needed; for a vote started by hand, Vote: create is also needed (VOT-03)
**Tags:** legal-gate, audit

**Story:** When an expense is big enough that the group should decide together, I want the vote to open from the request and, if it passes, the payment to start, so I can have one flow from decision to payment.

**Conversation:** The vote linked to a wallet and spending in one flow is the combination nobody has (`raw/08-competitor-ux-comparison.md` section 6.8; [competitive-analysis.md](../../research/competitive-analysis.md) section 5; info.md Votes: "link a vote to an action: approve an expense"). Linked action approve an expense is the only linked action in v1 ([competitive-analysis.md](../../research/competitive-analysis.md) section 7). Decision D4 settles what info.md left open ("au-dessus d'un seuil, approbation de plusieurs personnes ou un vote"): a passed vote is the authorisation and the payment starts with no approvers. "No single person moves the money" is met by the vote itself, which counts only with at least two distinct voters other than the requester. The vote is never followed by a second round of approvals, and a vote never falls back to approvals when it fails.

**Preconditions:** The policy requires a vote for this amount (`spend_vote_threshold`), or the requester asks for one on any request in Draft, Awaiting approval, Needs changes or Awaiting vote. At least three people hold Vote: vote in the group (the requester and two others, VOT-03). A vote started by hand on a request in Awaiting approval sets its approvals aside; they are not reused (VOT-03).
**Trigger:** The request is sent with an amount at or above the vote threshold, or the requester taps "Ask the group to vote first" on the request.

**Acceptance criteria:**
1. When the policy requires a vote, sending the request creates a linked vote (VOT) with the question prefilled as a full sentence with the consequence ("Pay 300 000 Ar to Rado for roof repair from the Repairs wallet"), the amount, payee and wallet, the passing rule, the quorum and the deadline from the group's vote settings. The request status is Awaiting vote and no approver is asked yet.
2. The request detail shows the vote's state (quorum progress, time left, current count) and links to it. The requester cannot edit the vote's question to differ from the request; the question is derived from the request.
3. Vote passes (quorum met, majority reached, and at least two distinct voters other than the requester voted, decision D4): the system writes the result to the decision log, links the Decision to the request, and starts the payout after the SPD-10 checks, with no approvers involved (key `msg.spd.request.vote_passed`). The request detail shows the vote result and who voted Yes as the authorisation.
4. Vote fails or no quorum: the request becomes Rejected with the reason "The group did not approve" or "Quorum not reached", the requester is told with the counts and the next step ("You can propose it again", key `msg.spd.request.vote_failed`). No money moved. For no quorum the choice is extend or close, as set in VOT-10, and never a fall back to approvals. `request_expiry` does not apply while the request is Awaiting vote: the vote deadline decides.
5. Edit (SPD-07) of a request while a vote is open cancels the vote, tells the voters, and opens a replacement vote with a new deadline when the policy requires one (VOT-03 criterion 5); earlier ballots do not carry over, because the vote must be about exactly what is paid.
6. Cancelling the request closes the vote with "Withdrawn by the requester".
7. A passed vote is the authorisation (decision D4). The payout still re-runs every SPD-10 check (balance, freeze, spending cap, version unchanged) and stops with a reason if one fails. The requester's own Yes vote may count toward the majority but never toward the minimum of two other voters.
8. Member voters see the request's essential facts and its attachment, never private notes (SPD-03 criterion 6). A guest voter opening a vote link sees amount, purpose, payee display name and the passing rule, never attachments (VOT-06).
9. Offline: the vote status is readable from cache (XCT-04); casting the vote is a VOT behaviour (VOT-18). Creating the linked vote needs a connection.
10. Audit: the link between request, vote and decision is recorded with times and the people involved.

**Data:** Expense request (write status, link), Vote (create, read), Decision (write on close, VOT), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-02, SPD-07, SPD-10, SPD-12, VOT-02, VOT-03, VOT-10, VOT-13, GRP-12, GRP-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: quorum and majority of a money vote are the defaults of VOT-02 (`VOTE_DEFAULT_QUORUM_PERCENT`, more than half of yes and no votes); the minimum of two distinct voters other than the requester is fixed and cannot be lowered (D4). Closed: a decision taken before the request exists can be linked (SPD-13) but is information only and never authorises a payout, because only a vote about exactly this payee, amount and wallet does.

---

### SPD-10 Execute the payout through the payment adapter

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (authorised by the recorded approvals or by the passed vote)
**Tags:** legal-gate, ledger, audit

**Story:** When the last required approval is in or the vote has passed, I want the payout to be sent safely to the payee through the payment provider and every status to be visible, so that the money goes out exactly once and everyone can follow it.

**Conversation:** Payments go through Vanilla Pay behind a payment adapter so another rail can replace it (conventions section 2). Provider callbacks can time out or double-notify, so idempotency keys, pending and settled states and a reconciliation job are mandatory ([competitive-analysis.md](../../research/competitive-analysis.md) section 6 item 6; `raw/03-madagascar-mobile-money.md` section 7.1 item 5). Pending says what happens next; failed says whether money moved (`raw/07-ui-ux-best-practices.md` section 2.3 R-T1 to R-T4). A rule that cannot pay if funds are insufficient (`raw/08-competitor-ux-comparison.md` section 6.7). Money-out is online only. Moves client money: legal-gate.

**Preconditions:** The request is Approved: either it has the required approvals on the current version from people who still hold the permission, or its linked vote passed with at least two distinct voters other than the requester (D4).
**Trigger:** The last required approval is recorded, or the linked vote closes as Passed.

**Acceptance criteria:**
1. Before dispatch, the system re-checks, in this order: version unchanged and authorisation not older than `request_expiry`; the approvals still valid and from eligible people, or the passed vote still valid with its floor of two other voters; wallet not frozen or held (SPD-15); cap not exceeded in block or vote mode (SPD-14); project conditions (SPD-13); requester and payee rules (SPD-08); available balance covers amount plus fee. If any check fails, nothing is sent, the request shows why with whether money moved (no), and returns to the right state: Awaiting approval when approvals lack, Needs attention for a hold, a missing balance or a cap. A vote is never run again after a check fails; when the cause is gone, the requester or a holder of Wallet: approve spend taps "Try again" (SPD-11) and the same authorisation is used while the request is unchanged.
2. The system creates the payout transaction with an idempotency key built from the request and the version, and sends it through the payment adapter. Status Initiated, then Pending when the provider has accepted it, then Confirmed or Failed. The request shows Paying then Paid.
3. Amount reservation: from the moment the request is authorised (final approval or passed vote) until the payout resolves, the amount plus fee is reserved against the wallet's available balance so no second request can spend it, and WAL-03 counts it in "Safe to spend" (key `msg.spd.payout.reserved`).
4. The fee is the real provider fee for the payee's network, shown on the request before approval and recorded as its own Fee ledger line, so cross-network costs are visible to all members (`raw/07` section 2.5 R-F5). The wallet pays the fee: the payee receives the full amount asked and the wallet is debited amount plus fee (same as WAL-10).
5. Callbacks and polling: provider notifications are processed idempotently. A duplicate Confirmed does nothing. A payout still unanswered after `PAYOUT_PENDING_ALERT_MINUTES` (OPS-13) becomes Needs attention and the system polls and reconciles (OPS-04); it never resubmits a payout of unknown outcome automatically.
6. Statuses and what the person sees: Pending shows elapsed time, what Gereo is waiting for and "Nothing to do, we will tell you" (key `msg.spd.payout.pending`). Confirmed shows the receipt (SPD-16). Failed is handled by SPD-11. Online only (XCT-06): if the system cannot reach the provider the request waits (SPD-11), the requester is never asked to "retry". The status of a Paying request is readable from cache with "Last synced hh:mm"; nothing can be paid or retried offline.
7. Ledger, as in WAL-10 and WAL-11: at dispatch the amount and the fee leave the wallet to an in-transit account as separate lines; on Confirmed they move in one atomic posting from in-transit to the external provider account; on Failed or Cancelled one atomic reversing entry returns them. Each entry carries the request reference, the approvers or the vote with its voters, the version and the decision link. All entries are balanced and immutable.
8. Notifications: the requester receives `msg.spd.payout.sent` when dispatched and `msg.spd.payout.confirmed` (EV-SPD-08; push; SMS receipt with reference `msg.spd.payout.confirmed.sms`). Approvers receive `msg.spd.payout.confirmed` once. Members receive nothing individually (the ledger and the digest show it).
9. Audit: dispatch, each status change and its source (adapter callback, poll, operator), the idempotency key and the reference given by the provider.
10. Gereo destinations (another Gereo user, a group wallet, another wallet of this group): no provider is involved, there is no in-transit step and the fee is 0 Ar (WAL-12, WAL-13). After the same checks, one balanced entry moves the money and the request goes from Paying to Paid at once. The money is income for the receiving wallet (D3), so its rules and splits run (RUL-07, CON-14), and each resulting entry names its rule.

**Data:** Expense request (write status), Transaction (write), Ledger entry (write), Approval (read), Vote (read), Wallet (read, reserve), Notification (write), Audit entry (write).
**Depends on:** SPD-05, SPD-09, SPD-14, SPD-15, WAL-03, WAL-10, WAL-11, WAL-12, WAL-13, WAL-18 (reversing entries), WAL-20 (reconciliation), OPS-04, OPS-13, RUL-07, CON-14, NTF-05, XCT-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: posting model is the one in criterion 7, the same as WAL-10 and WAL-11. Closed: payouts to non-Gereo mobile money numbers are in the MVP, because suppliers and workers are not members and WAL-09 already sends to any number. Closed: the wallet pays the fee. Open, needs Vanilla Pay: provider limits per transaction, per day and per wallet (Ar 20M individual wallet cap on MVola, the Ar 100M ceiling in info.md needs clarification, `raw/03` sections 7.1 item 3 and 7.4 item 4); default used: the limits of OPS-11, and a payout above a provider limit is blocked before sending or fails with the reason of SPD-11.

---

### SPD-11 Payout failure, delay and provider outage

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Requester, Permission holder, System
**Permission needed:** the requester or a holder of Wallet: approve spend (to try again, which adds no new authorisation); Wallet: initiate spend (requester view)
**Tags:** legal-gate, ledger, audit

**Story:** When a payout does not go through or the provider is down, I want to know whether the money left the wallet and what happens next, so that nobody pays twice or thinks money is lost.

**Conversation:** "Debited but not delivered" with no in-app trace is the most common complaint on Orange Max it and PiggyVest (`raw/08-competitor-ux-comparison.md` section 6.3). MVola had outages in November 2025 and May-June 2026: show "provider unavailable", queue payouts rather than fail, never claim funds are lost, and give a reference (`raw/03-madagascar-mobile-money.md` section 7.1 item 6). Reversals through the provider cost 5 percent (minimum Ar 10,000) with a 7-day window (competitive-analysis section 2), which is why the system must not send blindly. Errors say what happened, whether money moved, what to do next (`raw/07` section 2.6 R-E2, R-E3).

**Preconditions:** A payout was dispatched or was due to be dispatched (SPD-10).
**Trigger:** The provider returns Failed, does not answer, is unavailable, or rejects the payee.

**Acceptance criteria:**
1. Provider unavailable before dispatch: the request stays Approved with "Waiting for Vanilla Pay" and the state "Nothing was taken from the wallet". The system retries, spaced and capped as OPS-13 sets, until `payout_retry_window`, then moves the request to Needs attention and notifies the requester and, when approvals authorised it, the approvers (`msg.spd.payout.delayed`). An operator incident banner (OPS-08) may already explain the delay.
2. Failed after dispatch: the message states the plain reason (payee number not valid, payee wallet limit exceeded, insufficient provider funds, declined, provider error) and whether money moved ("Not taken from the wallet" or "Taken, refund in progress, reference X") (key `msg.spd.payout.failed.*`).
3. Ledger: a failed payout writes a reversing entry returning the amount and the fee from the in-transit account to the wallet, with a reason and the reference. The original entries stay visible. The reservation is released only when the reversal is posted.
4. Next steps per reason: transient errors offer "Try again" to the requester and to holders of Wallet: approve spend, using the same authorisation (approvals or passed vote) while the request is unchanged (a new idempotency attempt number, never a duplicate on an unknown outcome). A payee problem requires an edit of the payee, which voids approvals (SPD-07). A limit problem offers "Edit the amount" or "Cancel".
5. Unknown outcome (timeout, no callback): status Needs attention with the sentence "We are checking with the provider. Do not pay again" and the reference; the system reconciles (OPS-04) and an operator is alerted (OPS-13). Retry is blocked until the outcome is known.
6. The requester and approvers can tap "Report this payment" (WAL-14), which pre-fills the reference and the request into a support ticket (OPS-06).
7. Notifications (EV-SPD-09): `msg.spd.payout.failed` to the requester and to approvers by push, and SMS (`msg.spd.payout.failed.sms`, under 160 GSM-7 characters with the reference, XCT-12) because money did not arrive.
8. Offline: the status and the reference are readable from cache; Try again is online only.
9. Audit: each failure, retry attempt, operator action and the final outcome, with time and source.

**Data:** Transaction (read, write), Ledger entry (write), Expense request (write status), Support ticket (create), Notification (write), Audit entry (write).
**Depends on:** SPD-07, SPD-10, WAL-11, WAL-14, WAL-18, OPS-04, OPS-06, OPS-08, OPS-13, NTF-05, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: retry window is `payout_retry_window` (24 hours) and the attempt count is the OPS-13 cap. Closed: an operator cannot mark a payout Confirmed by hand; the outcome comes from asking the provider or from reconciliation, and a ledger correction goes through OPS-05 with a second operator, so the action is audited. Open, needs Vanilla Pay: the failure codes the provider returns (`raw/03` section 3.2); default used: the reason list of criterion 2 with "provider error" for any other code.

---

### SPD-12 Cancel a request

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member (the requester), Permission holder or System (expiry)
**Permission needed:** being the requester, or Wallet: approve spend; none for the system expiry
**Tags:** audit

**Story:** As a requester, I want to cancel a request I no longer need, so that approvers stop seeing it and no money can be sent by mistake.

**Conversation:** Undo or cancel is a basic usability need (`raw/07-ui-ux-best-practices.md` section 2.4, NN/g heuristics); but Undo must never be shown for something already sent to the provider (R-C4). Open Collective lets expenses be cancelled before payment. Stale requests pile up and hide what needs approvers (`raw/08` section 6.2).

**Preconditions:** The request is Draft, Awaiting vote, Awaiting approval, Needs changes, or Approved but not yet sent to the provider.
**Trigger:** The person taps "Cancel request".

**Acceptance criteria:**
1. The confirmation states "Nothing will be paid" and lists the effect: approvals dropped (count), linked vote closed, reserved amount released. The button reads "Cancel request" (not "Yes"), with "Keep it" as the other choice.
2. The requester can cancel their own request. A holder of Wallet: approve spend can cancel another person's request only with a reason, and the requester is told who and why.
3. Once the payout was sent to the provider (Paying), Paid or Failed with money in transit, the Cancel action is not shown; the screen explains that a payout already sent cannot be cancelled in Gereo and points to SPD-11 or support.
4. Cancelling closes the request (status Cancelled, closed), closes a linked vote as "Withdrawn" (SPD-09), releases any reserved amount, voids approvals and removes it from approvers' inboxes.
5. Notification: approvers who were waiting receive `msg.spd.request.cancelled` (push, no SMS), and the requester receives confirmation. If a person other than the requester cancelled, the requester also receives the reason.
6. Race: if the last approval or the dispatch happens at the same instant, the server decides; the person sees the true outcome ("Already sent, cannot cancel" with a link). No double outcome is possible.
7. Offline: Cancel is disabled with "Cancelling needs a connection" for requests already visible to others; a Draft never sent can be deleted offline.
8. A Cancelled request stays visible in history with who and why, and can be copied into a new request.
9. Audit: `request.cancelled` with who, when, reason and state at cancellation. No ledger entry (nothing had moved); a reservation release is logged.
10. Expiry: a request with no decision, or authorised but not sent, for `request_expiry` (30 days, counted from the last change) is cancelled by the system as "Expired", after one warning to the requester seven days before (EV-SPD-11, `msg.spd.expired`). A request in Awaiting vote is excluded: the vote deadline decides. Expiry releases reserved amounts, voids approvals and is audited as `request.expired`.

**Data:** Expense request (write status), Approval (void), Vote (close), Wallet (release), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-09, SPD-10, VOT-12, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: any holder of Wallet: approve spend may cancel another person's request, with a reason that the requester sees, and it is audited (criterion 2); no stronger permission is invented. Closed: stale requests are closed by `request_expiry` (criterion 10).

---

### SPD-13 Project and decision links

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member or Permission holder
**Permission needed:** Wallet: initiate spend; Project: approve purchase (project requests); Project: view
**Tags:** legal-gate, ledger, audit

**Story:** As a project member, I want an expense to belong to a project and, if there is one, to the decision that authorised it, so that the project shows what was spent and why.

**Conversation:** A project expense debits the linked wallet and needs Wallet: approve spend (info.md "Projets (ERP)"); every important decision is linked to a vote or to a named person. Keep tasks and money linked: each expense request references a budget line and shows remaining budget in a sentence and a bar (`raw/07-ui-ux-best-practices.md` section 8.6). A decision log entry with a "money moved" link back to the ledger is an open opportunity (`raw/08-competitor-ux-comparison.md` section 6.8). Project page timeline merges tasks, expense requests and decisions (section 6.9). Out of scope: purchase orders and supplier management ([competitive-analysis.md](../../research/competitive-analysis.md) section 7).

**Preconditions:** A project with a linked wallet exists (PRJ), or the person links an existing decision.
**Trigger:** The person starts a request from the project, or adds a project or decision on the request form.

**Acceptance criteria:**
1. A request started from a project is prefilled with the project's linked wallet and shows the budget line, the remaining budget in a sentence ("Budget 2 000 000 Ar, spent 750 000 Ar, left 1 250 000 Ar") and a bar. Amount above the remaining budget shows "Over budget by X" on the form and on the approval detail and does not block, as PRJ-03 criterion 4 says: the budget is a plan, and a group that wants a lock sets a spending cap in block mode (SPD-14).
2. Permissions: a project request needs the requester to hold Wallet: initiate spend on the linked wallet. Authorisation by approvals needs two gates: the approvals of the band from holders of Wallet: approve spend (money), and one approval from a holder of Project: approve purchase (the purchase makes sense for the project). Neither gate can be met by the requester or the payee (D1, SPD-08). One person holding both permissions may meet the purchase gate and one of the band's approvals with a single approval; the band's count of distinct people still applies. The detail lists both kinds (key `msg.spd.approval.project_gates`). When a passed vote authorises the request (D4), the vote replaces both gates.
3. A person without Project: approve purchase sees the second gate as "Waiting for a project approver" and cannot supply it. If nobody holds it, the panel says so and who can grant it (GRP-08, PRJ-06).
4. Decision link: the form can link an existing decision (from the decision log, including one recorded outside the app, VOT-14) or, when a vote passed (SPD-09), the decision is linked automatically. A linked earlier decision is information only: it never replaces approvals or the vote. When the policy requires a decision for project spending (setting `project_spend_requires_decision`, default off), Send is blocked without one with a clear reason.
5. After payment, the ledger entry, the request and the decision show each other: from the decision "money moved: 300 000 Ar, entry reference" and from the entry "authorised by decision, vote result" (key `msg.spd.request.decision_link`).
6. The project page timeline shows the request with status and amount at each step (requested, approved, paid), merged with tasks and decisions (PRJ). Project spend to date updates only when a payout is Confirmed.
7. A project cannot be closed while it has open requests (PRJ-09 criterion 2), so closing never orphans one. If the budget line is removed or the linked wallet becomes unavailable (PRJ-03 criterion 6), open requests are returned to Needs attention with a reason; paid ones keep their link.
8. Offline: project and decision links are readable from cache; sending is online only.
9. Audit: link, unlink and permission gate approvals each recorded with who and when.

**Data:** Expense request (write), Project (read), Decision (read, link), Approval (write), Ledger entry (read), Audit entry (write).
**Depends on:** SPD-01, SPD-05, SPD-09, SPD-14, PRJ-03, PRJ-05, PRJ-06, PRJ-09, PRJ-11, VOT-13, VOT-14, GRP-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a project request needs both gates, and one person holding both permissions satisfies both gates with one approval but the band still needs its distinct people (criterion 2). Closed: over budget warns and does not block (criterion 1). Closed: the project owner cannot initiate spend without Wallet: initiate spend; permission inheritance from the group applies (PRJ-06).

---

### SPD-14 Spending cap

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (sets); System (enforces)
**Permission needed:** Wallet: edit rules to set a cap in warn mode (RUL-09); Group: set spending policy to set, loosen or remove a cap in block or vote mode; none to see its effect
**Tags:** legal-gate, ledger, audit

**Story:** As a permission holder, I want to choose what happens when a wallet or project reaches its spending cap, so that even approved requests cannot drain it when the group wants a hard limit.

**Conversation:** The spending cap with alert is one of the four rule templates in the MVP ([competitive-analysis.md](../../research/competitive-analysis.md) section 7; info.md "Wallets"). Show the remaining cap on the wallet card, warn at the warning level and at the cap, and state whether the cap blocks, asks for a vote, or only warns (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB5; thresholds are U). The cap is a guard for the group when many small approved requests would add up. RUL-09 owns the cap rule, its period, its counter and its alert, and says a cap alerts and never blocks by itself; this story adds the two stricter modes for group-wallet spending and their enforcement, so the mode default is warn and block or vote is a deliberate choice that protects money, which is why it needs Group: set spending policy.

**Preconditions:** A spending cap rule exists on the wallet or project (set in RUL-09) and, for block or vote mode, a mode was chosen under the spending policy.
**Trigger:** A request is created, authorised or about to be paid.

**Acceptance criteria:**
1. The wallet and request screens show the cap in words ("This month's limit: 500 000 Ar. Spent or promised: 320 000 Ar. Left: 180 000 Ar") and a bar. For enforcement, spent counts Confirmed payouts plus amounts reserved for authorised requests inside the period; the RUL-09 counter shows Confirmed money-out only and the screen labels the two figures differently.
2. Warnings: at `CAP_WARNING_PERCENT` and when a request would take the cap over, the requester sees the effect before sending (SPD-02) and approvers see it in the detail (SPD-05).
3. Mode block: a request above the amount left cannot be sent, and a payout that would exceed the cap at execution is stopped (SPD-10 check) with "The monthly limit would be exceeded. Nothing was paid" and the next step (smaller amount, wait for the next period, or a vote to change the cap).
4. Mode require a vote: a request above the amount left goes to a vote (SPD-09), which replaces approvals as decision D4 says; if it passes, the payout proceeds even though it exceeds the cap, and the ledger entry names the vote. Mode warn (default): the request goes ahead with a visible warning and the overage is flagged on the request.
5. The period and its reset follow RUL-09 (Madagascar time, `CAP_PERIOD_OPTIONS`); the reset is visible in the cap line and writes no ledger entry. A cap on a project and a cap on its wallet can both exist; a request must satisfy both and the stricter message is shown.
6. Changing or removing a cap follows RUL-13 and GRP-12: tightening applies at once, loosening (including moving from block to warn) is a loosening proposal as in GRP-12 criterion 5. A change applies to future requests only; amounts already paid stay counted for the period.
7. Notifications: the warning and the reached alerts to holders of Wallet: edit rules are RUL-09's `msg.rul.cap_reached`, so nobody gets two alerts; this story adds `msg.spd.cap.blocked` to the requester when a request is stopped by the cap (push).
8. Offline: the cap line is readable from cache with "Last synced hh:mm"; enforcement is on the server.
9. Audit: each time the cap blocked, sent to a vote, or flagged a request, with the request, amounts and period.

**Data:** Wallet rule (read cap and mode), Expense request (read), Ledger entry (read), Notification (write), Audit entry (write).
**Depends on:** SPD-09, SPD-10, RUL-09, RUL-13, GRP-12, WAL-03, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: period boundaries and time zone are RUL-09's (Madagascar time, `CAP_PERIOD_OPTIONS`). Closed: a project cap and a wallet cap can coexist and both apply. Closed: the warning level is `CAP_WARNING_PERCENT` of RUL-09 (80 percent is a hypothesis, `raw/07` R-RB5).

---

### SPD-15 Emergency freeze of outgoing money

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: freeze (decision D2) to freeze; lifting needs `freeze_lift_approvals` distinct holders of Wallet: approve spend
**Tags:** legal-gate, ledger, audit

**Story:** When I suspect fraud, a stolen phone or a dispute, I want to stop all money leaving a wallet right away and have the group lift it together, so that nothing more is lost while we sort it out.

**Conversation:** Administrator fraud and frozen accounts dominate complaints; mitigations seen include system-blocked admin withdrawals (Tonti+) and multi-signatory release ([competitive-analysis.md](../../research/competitive-analysis.md) section 3.1; `raw/01-group-savings.md` section 13 risk 1). Fraud is mostly social engineering and SIM swap (`raw/07-ui-ux-best-practices.md` section 2.8). A brake that one person can pull but that needs several people to release matches the "no single administrator" rule. Decision D2 gives the brake its own permission, Wallet: freeze, which only stops money, needs no PIN to grant (GRP-07) and is in the Treasurer bundle, so the person who can freeze is not automatically a person who can approve. The freeze is for group wallets; a person protects their own wallets with the account lock (ACC-11).

**Preconditions:** The person holds Wallet: freeze on the wallet and is online. The wallet is a group wallet and is not already frozen.
**Trigger:** The person taps "Freeze outgoing money" on a wallet.

**Acceptance criteria:**
1. The confirmation states what stops (new payouts, new approvals, withdrawals, and manual transfers out of this wallet, including to other wallets of the same group) and what continues (money coming in, contributions, viewing, and the splits and rule-made shares to other wallets of the same group and to Gereo, which were authorised when the rule was saved, CON-14, CON-15, GRP-13 criterion 4), with a required short reason (presets such as "Suspected fraud", "Lost phone", "Dispute", "Other").
2. After confirmation, the wallet shows a Frozen banner (key `msg.spd.freeze.banner`) with who froze it, when and why (reason visible to permission holders). Payouts that have not yet been dispatched are held (request status Needs attention "Held by freeze"); payouts already with the provider continue and the screen says so.
3. New requests can be drafted and sent but cannot be approved or paid while frozen; the policy panel and the inbox show the frozen state (SPD-02, SPD-04). Edits and cancellations remain possible.
4. All members who can view the wallet are notified immediately: `msg.spd.freeze.applied` (push) and, to holders of Wallet: freeze and Wallet: approve spend, SMS (`msg.spd.freeze.applied.sms`) because money movement stopped. Lifting sends `msg.spd.freeze.lifted`. NTF must class the freeze SMS as a security event so quiet hours do not hold it (NTF-09).
5. Lifting needs `freeze_lift_approvals` (2, never fewer) distinct people holding Wallet: approve spend, each entering their PIN. The person who froze may be one of them but never the only one; there is no setting that lets one person lift alone. Progress shows "1 of 2 approved to lift". If the group has fewer than two holders of Wallet: approve spend, the lift goes to a vote with a proposal reference (VOT-01, VOT-03 authority vote) and a holder of Wallet: freeze applies the result and cites the decision.
6. When lifted, held requests return to Approved or Awaiting approval and each is re-checked (SPD-10 criterion 1). A request edited during the freeze keeps normal rules.
7. A Gereo operator can also hold a group wallet for compliance (OPS-10 hold, which stops money-out and is not a freeze of funds). The banner then says "Held by Gereo" with the reference and a way to contact support, not the reason, and a group cannot lift it.
8. Offline: the Frozen banner and state are readable from cache; applying or lifting needs a connection.
9. Ledger and audit: freezing and lifting write no ledger entry. Both are audit entries with who, when, reason and the held requests. More than `freeze_cycle_limit` freeze and lift cycles on one wallet in 24 hours are flagged to the group and to an operator (OPS-10), and a further freeze still works because stopping money is always allowed.

**Data:** Wallet (write state), Expense request (read, write status), Approval (write for lift), Notification (write), Audit entry (write).
**Depends on:** SPD-10, WAL-03 (wallet state, outgoing blocks), WAL-09, WAL-12, GRP-07, GRP-08, GRP-11, VOT-01, VOT-03, CON-14, CON-15, OPS-10, NTF-05, NTF-09, ACC-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed by D2: the permission that freezes is Wallet: freeze. Closed: freeze abuse is limited by lifting needing two people, the audit, the immediate notification and `freeze_cycle_limit`. Closed (CON-14, CON-15): splits and rule-made shares inside the group continue during a freeze, manual transfers to other wallets of the group stop. Open, needs Vanilla Pay: which provider-level holds Gereo can place on money already dispatched; default used: none, a payout already with the provider continues and the screen says so.

---

### SPD-16 Receipts, ledger entries and audit trail of a request

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member, Permission holder, Gereo operator (read)
**Permission needed:** Wallet: view history (ledger and receipt); Wallet: export history (export)
**Tags:** ledger, audit, offline

**Story:** As a member, I want every expense to leave a receipt and ledger entries that show who asked, who approved and what authorised it, so that I can check the group's spending without asking anyone.

**Conversation:** Every ledger entry answers who, what, how much, why, and what authorised it, in one tap (`raw/07-ui-ux-best-practices.md` section 8.1 R-G1). Confirmation receipts carry amount, fee, date, time and transaction ID (`raw/07` section 2.3; CGAP principle 14). A decision log with a "money moved" link back to the ledger is an open opportunity (`raw/08-competitor-ux-comparison.md` section 6.8). Open Collective shows basic expense data publicly and keeps attachments private (`raw/04-projects-voting-governance.md` section 3). Expense rows feed the group ledger view (CON-16).

**Preconditions:** A request has progressed past Draft, or a payout has been Confirmed.
**Trigger:** The person opens a request's detail, a ledger entry, or the receipt after payment.

**Acceptance criteria:**
1. The receipt for a Confirmed payout shows amount, fee, total, payee name and masked number, source wallet, date and time, status Confirmed and a short copyable reference (key `msg.spd.payout.receipt`), the names of the approvers, or the vote result with the names of those who voted Yes, and the project and decision it belongs to. A split rounding line is never part of this receipt; it belongs to the split receipt (CON-16). "Share receipt" produces an image or text that hides the payee's number.
2. Ledger entries written for a request are: Expense (wallet to in-transit or to payee) and Fee as its own line, each classified and carrying the request reference, the version, the approvers or the vote with its voters, the decision link and the payout reference. Reversals appear with a "Reversed" chip and the reason, the originals untouched.
3. From any such ledger entry, one tap opens the request summary, the approvals list (who, when), the vote and decision, and the attachment only for those who may see it (SPD-03). No attachments or private notes appear in the shared ledger or in exports.
4. The request audit trail is a timeline: created, edited (versions), approvals (who, when), rejections with reason, votes, freeze holds, payout statuses, cancel. Each item has who, when and what changed, in plain words. It is append-only.
5. Visibility: members with Wallet: view history see amount, purpose, status, payee display name and approver names; attachments, notes and reasons only follow SPD-03 and SPD-06 rules. The same events also appear in the group audit log for holders of Group: view audit log (GRP-11), which reads them from here and does not store a second copy.
6. Empty state: a wallet with no spending shows what spending requests are and a button to ask (if permitted). Loading shows skeletons, never "No records".
7. Offline: receipts and the audit trail of the last 50 requests of each wallet the person can view are readable from cache with "Last synced hh:mm" (XCT-04); export needs a connection.
8. Export (holders of Wallet: export history, WAL-16) includes expense rows, approver or voter names and references, and follows the format of CON-18; the export writes an audit entry.
9. Operators can read request trails for support and compliance but not change them (OPS-09); operator reads are logged and need a reason.
10. Accessibility and language: timeline items read as sentences; dates show weekday and time; amounts never clip at 200 percent font scale.

**Data:** Expense request (read), Approval (read), Ledger entry (read), Transaction (read), Decision (read), Document (read, restricted), Audit entry (read).
**Depends on:** SPD-03, SPD-06, SPD-10, SPD-11, SPD-13, WAL-14 (receipt page), WAL-15, WAL-16, CON-16, CON-18, GRP-11, OPS-09, XCT-04, XCT-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs a lawyer: retention period for audit data and receipts (five years under Law 2016-056 art. 53 per competitive-analysis section 6 item 8); default used: `RECORD_RETENTION_YEARS` (5). Closed: the payee receives only the provider's own message, never a Gereo SMS, for privacy and cost.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| SPD-01 | Create an expense request | P0 | WAL-03, WAL-09, WAL-10, WAL-12, WAL-13, GRP-08, GRP-09, OPS-11, ACC-07, SPD-02, SPD-03 |
| SPD-02 | See the spending policy before sending | P0 | GRP-09, GRP-12, GRP-13, RUL-09, WAL-03, VOT-02 |
| SPD-03 | Attach a receipt or a quote | P1 | SPD-01, SPD-07, PRJ-07, XCT-05, XCT-07 |
| SPD-04 | Approval inbox | P0 | SPD-01, SPD-08, GRP-09, NTF-05, NTF-08, NTF-09, XCT-04 |
| SPD-05 | Approval detail and approve | P0 | SPD-02, SPD-04, SPD-06, SPD-08, ACC-03, ACC-04, ACC-05, WAL-03, WAL-10, NTF-05 |
| SPD-06 | Reject a request with a reason | P0 | SPD-05, SPD-07, NTF-05 |
| SPD-07 | Edit a request, earlier approvals are voided | P0 | SPD-01, SPD-03, SPD-05, SPD-09, NTF-05 |
| SPD-08 | Separation of duties | P0 | SPD-02, SPD-05, SPD-10, GRP-08, GRP-10, GRP-13 |
| SPD-09 | Link a vote to an expense | P0 | SPD-01, SPD-02, SPD-07, SPD-10, SPD-12, VOT-02, VOT-03, VOT-10, VOT-13, GRP-12, GRP-13 |
| SPD-10 | Execute the payout through the payment adapter | P0 | SPD-05, SPD-09, SPD-14, SPD-15, WAL-03, WAL-10 to WAL-13, WAL-18, WAL-20, OPS-04, OPS-13, RUL-07, CON-14, NTF-05, XCT-06 |
| SPD-11 | Payout failure, delay and provider outage | P0 | SPD-07, SPD-10, WAL-11, WAL-14, WAL-18, OPS-04, OPS-06, OPS-08, OPS-13, NTF-05, XCT-12 |
| SPD-12 | Cancel a request | P1 | SPD-01, SPD-09, SPD-10, VOT-12, NTF-05 |
| SPD-13 | Project and decision links | P1 | SPD-01, SPD-05, SPD-09, SPD-14, PRJ-03, PRJ-05, PRJ-06, PRJ-09, PRJ-11, VOT-13, VOT-14, GRP-08 |
| SPD-14 | Spending cap | P1 | SPD-09, SPD-10, RUL-09, RUL-13, GRP-12, WAL-03, NTF-05 |
| SPD-15 | Emergency freeze of outgoing money | P1 | SPD-10, WAL-03, WAL-09, WAL-12, GRP-07, GRP-08, GRP-11, VOT-01, VOT-03, CON-14, CON-15, OPS-10, NTF-05, NTF-09, ACC-11 |
| SPD-16 | Receipts, ledger entries and audit trail of a request | P1 | SPD-03, SPD-06, SPD-10, SPD-11, SPD-13, WAL-14, WAL-15, WAL-16, CON-16, CON-18, GRP-11, OPS-09, XCT-04, XCT-08 |

Count: 16 stories. P0: 10 (SPD-01, 02, 04, 05, 06, 07, 08, 09, 10, 11). P1: 6 (SPD-03, 12, 13, 14, 15, 16).

## Cross-epic dependencies

Story IDs below were checked against the other story files. Where a file names a capability without a story, the capability is named.

- **ACC:** ACC-03 PIN on every money-out approval, ACC-04 self-service PIN reset, ACC-05 new-device signal and SIM-swap re-verification (SPD-05), ACC-07 identity tier for requesters and approvers (SPD-01, SPD-05), ACC-11 account lock for personal wallets (SPD-15).
- **WAL:** WAL-03 balance, reserved amounts and Safe to spend (SPD-01, SPD-10), WAL-09 and WAL-13 group outflows that create requests here, WAL-10 PIN, pause and in-transit posting (SPD-05, SPD-10), WAL-11 payout end states (SPD-11), WAL-12 transfers between wallets of a group, WAL-14 receipt and report a payment (SPD-11, SPD-16), WAL-16 export, WAL-18 reversing entries, WAL-20 reconciliation line. WAL must also define the wallet Frozen and Held by Gereo states and block outgoing flows while they last (SPD-15).
- **RUL:** RUL-09 spending cap rule, counter and alert (SPD-14); RUL-13 who changes rules and the vote gate (SPD-14); RUL-07 rules that fire on income that arrives from a payout (SPD-10).
- **GRP:** GRP-12 edits the spending policy and every parameter marked GRP-12 in this file; GRP-13 is the floor seen from the group side and must stay consistent with SPD-08; GRP-08 grants permissions, GRP-09 lists who can approve, GRP-10 and GRP-11 audit; GRP-07 bundles include Wallet: freeze and Group: set spending policy.
- **VOT:** VOT-02 quorum and majority, VOT-03 the vote linked to a request and its payout start, VOT-10 no-quorum choices, VOT-12 cancel and extend, VOT-13 decision log entry with a link to the ledger, VOT-14 decisions recorded outside the app, VOT-06 guest view, VOT-18 poor connection (SPD-09, SPD-13, SPD-15).
- **PRJ:** PRJ-03 budget linked to a wallet (budget warns, never blocks), PRJ-05 requests listed on the project, PRJ-06 project permissions, PRJ-07 attachments on a request (shares SPD-03's function), PRJ-09 close blocked while requests are open, PRJ-11 timeline (SPD-13).
- **EVT:** none in the MVP; a later hook if an event expense is allowed.
- **ANN:** none in the MVP; an optional announcement when a large expense is paid or a freeze applies would be an ANN story.
- **NTF:** the catalogue EV-SPD-01 to EV-SPD-11 is the registry for the keys here; NTF-05 push then SMS, NTF-08 batching, NTF-09 quiet hours, NTF-12 delivery log, NTF-14 weekly digest. The catalogue lacks events for freeze applied and lifted, cap blocked and payout delayed; NTF must add them (SPD-15, SPD-14, SPD-11).
- **XCT:** XCT-04 offline reading with last synced, XCT-05 queue for non-money items, XCT-06 money-out blocked offline, XCT-07 data saver, XCT-08 200 percent text, XCT-12 SMS templates, XCT-13 pseudo-language, XCT-14 keys.
- **OPS:** OPS-04 and OPS-05 reconciliation and corrections, OPS-06 support tickets, OPS-08 provider unavailable banner, OPS-09 audit search, OPS-10 holds and flags, OPS-11 tier limits and fees, OPS-13 payout queue (SPD-10, SPD-11, SPD-15, SPD-16). OPS must add a wallet-level hold ("Held by Gereo") for group wallets if one is wanted; OPS-10 only holds an account.
- **CON:** CON-16 expense rows in the group ledger, CON-18 export, CON-14 and CON-15 splits during a freeze, CON-20 shared audit conventions.

## Open questions

1. **Closed by decision D1:** the requester can never approve their own request. A group with a single permission holder cannot spend by approvals until a second approver exists (SPD-08).
2. **Closed by decision D4:** a passed vote is the authorisation and replaces approvals; approvers apply below `spend_vote_threshold`. A money vote needs two distinct voters other than the requester (SPD-09).
3. **Closed: PIN on every approval,** not only the last (SPD-05).
4. **Closed: one rejection** is the approver's choice between closing and asking for changes, with no group setting (SPD-06).
5. **Closed: project spending gates.** Both gates apply; one person holding both permissions meets both with one approval; over budget warns and does not block (SPD-13).
6. **Closed: posting model for money in transit** is the WAL-10 and WAL-11 model; funds are reserved from authorisation (SPD-10).
7. **Payee check.** Closed: payouts to non-Gereo numbers are in the MVP and the wallet pays the fee. Open, needs Vanilla Pay: whether the provider offers a payee name lookup; default: "Name not checked" plus the last-three-digits re-read (SPD-01, SPD-10).
8. **Provider limits.** Open, needs Vanilla Pay: per-transaction, per-day and per-wallet limits, the meaning of the Ar 100 000 000 ceiling, payee wallet caps (Ar 20M on individual MVola wallets); default: OPS-11 limits and a clear reason on failure (SPD-10, SPD-11).
9. **Closed by decision D2: freeze design.** Wallet: freeze freezes; two distinct holders of Wallet: approve spend lift; splits inside the group continue; manual transfers stop (SPD-15). Open, needs Vanilla Pay: provider-level holds; default: none.
10. **Closed: who edits the spending policy.** A holder of Group: set spending policy, with loosening held for two other approvers or a vote (GRP-12, SPD-02).
11. **Closed: SMS for approvals.** Quiet hours apply, approving by SMS reply is never allowed, cost follows NTF-06 (SPD-04).
12. **Closed: request expiry and visibility.** `request_expiry` is 30 days; attachments and notes go only to the requester, approvers, member voters and holders of Wallet: approve spend (SPD-01, SPD-03, SPD-12, SPD-16).
13. **Legal gate for the whole epic. Open, needs a lawyer and Vanilla Pay.** Holding client funds and paying out to third parties depend on the unconfirmed legal basis (Law 2016-056, competitive-analysis section 6 item 1); every story tagged `legal-gate` is blocked from release until the legal opinion and the Vanilla Pay due diligence (competitive-analysis section 10) are in.
14. **Retention. Open, needs a lawyer.** Five years proposed under art. 53, kept as `RECORD_RETENTION_YEARS` and `AUDIT_RETENTION_YEARS` (SPD-03, SPD-16).
