# SPD: Spending and approvals

Epic code SPD, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, IDs). Sources: [info.md](../../../info.md) (sections "Garde-fous", "Flux d'argent", "Projets"), [competitive-analysis.md](../../research/competitive-analysis.md), [design-foundations.md](../../research/design-foundations.md) and the raw reports in `docs/research/raw/`.

Spending approvals are the other half of the product's trust promise: money leaves a group only when the right people have seen exactly what is paid, to whom, from which wallet, and agreed. The design rules that govern the whole epic come from [competitive-analysis.md](../../research/competitive-analysis.md) section 7 ("No single administrator can move group funds", "Every approval screen shows exact amount, payee, wallet and rule in plain language") and from [design-foundations.md](../../research/design-foundations.md) section 3 principle 4 ("Approvals authorise exactly what is shown. Any change voids earlier approvals").

## Shared definitions for this epic

### Expense request statuses

An expense request (the object) has one status. The payout it produces is a transaction with the standard statuses (Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention). Status is always shown as icon + word + colour. The shape follows the status list of Open Collective expenses (`raw/08-competitor-ux-comparison.md` section 6.3, `raw/04-projects-voting-governance.md` section 3).

| Status | Meaning |
| --- | --- |
| Draft | Saved, not sent. Nobody else sees it |
| Awaiting vote | The policy requires a vote and the linked vote is open |
| Awaiting approval | Waiting for the required approvals ("1 of 2 approved") |
| Needs changes | An approver asked the requester to change the request (SPD-06). No approvals count until the requester edits (SPD-07) |
| Approved | Approvals complete, payout not yet sent (short, or held, see SPD-11 and SPD-15) |
| Paying | Payout transaction Initiated or Pending |
| Paid | Payout Confirmed |
| Failed | Payout failed; the request keeps its approvals if nothing material changes (SPD-11) |
| Rejected | An approver rejected it, or the linked vote failed. Closed |
| Cancelled | Cancelled by the requester or a permission holder before the payout was sent. Closed |
| Needs attention | Outcome unknown or blocked, a person or an operator must act |

### Configurable parameters

No number below is a product decision. Each is a group or system setting with a default to validate. "Open" means the default is an open question. Where policy values are edited is owned by GRP and RUL (see cross-epic dependencies); this epic reads them.

| Parameter | Meaning | Default |
| --- | --- | --- |
| `spend_approvals_default` | Approvals needed below the multi-approval threshold | 1, never below 1, never counting the requester (floor, see SPD-02) |
| `spend_multi_threshold` | Amount at or above which more approvals are needed | Open |
| `spend_approvals_multi` | Number of approvals at or above that amount | Open (2 or more) |
| `spend_vote_threshold` | Amount at or above which a vote is required before approvals | Open (no vote required) |
| `self_approval_allowed` | The requester may approve their own request | Off (see SPD-08) |
| `receipt_required_above` | Amount above which a receipt or quote is mandatory | Open |
| `attachment_max_size`, `attachment_types` | Limits for attachments | Open |
| `duplicate_window` | Time within which a same payee and amount raises a warning | Open |
| `approval_reminder_after` | When approvers are reminded once more | 24 hours (hypothesis from raw/07 section 8.8 R-NT3) |
| `sms_fallback_delay` | Time after which an unread push is followed by an SMS | Open |
| `payout_pending_timeout` | Time after which an unanswered payout becomes Needs attention | Open |
| `payout_retry_window` | How long Gereo keeps retrying a payout during a provider outage | Open |
| `spend_cap_*` | Period, amount and mode (block, require a vote, warn) of a spending cap | Cap off |
| `freeze_lift_approvals` | Approvals needed to lift an emergency freeze | Same as `spend_approvals_multi` |
| `request_expiry` | Age after which an undecided request is closed by the system | Open (no expiry) |
| `project_spend_requires_decision` | Project requests must link a decision before sending | Off |

### Message key prefixes

`spd.request.*`, `spd.policy.*`, `spd.approval.*`, `spd.payout.*`, `spd.cap.*`, `spd.freeze.*`, `spd.perm.*`. Stories name keys only; SMS templates are GSM-7 safe and under 160 characters. Amounts display as `12 500 Ar`: integer ariary, space grouping, no decimals, identical in Malagasy, French and English. Buttons name the action and the amount ("Approve 120 000 Ar", "Send request for 120 000 Ar").

### Ledger vocabulary used here

Expense, Fee and Reversal rows, each with the request reference, the approvers and the linked decision (see SPD-16). Corrections are reversing entries with a reason, never edits.

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

**Preconditions:** The person holds Wallet: initiate spend on the source wallet. The wallet is not frozen for new requests (see SPD-15).
**Trigger:** The person taps "Ask to spend" from a wallet, a project, or a decision.

**Acceptance criteria:**
1. The form asks: source wallet (default the one the person came from; the picker lists only wallets the person can initiate from), payee, amount (integer ariary, number pad), purpose (short text, required), note (optional), attachment (SPD-03), and optional links to a project and a decision (SPD-13).
2. Payee options: a member of the group, a saved payee, or a new mobile money number with operator. Phone numbers are accepted in any common format (spaces, +261, leading 0) and shown back normalised. The payee's registered name is shown when the provider returns one (open question). A first-time payee is marked "New payee" and the form asks for a re-read of the last three digits.
3. The available balance of the wallet (balance minus amounts reserved for approved requests) is shown next to the amount. While typing, an estimated payout fee line is always shown ("Fee: 0 Ar" if none) and the total is updated live. If amount plus fee exceeds the available balance, the person is blocked before sending with the next step ("Ask for a smaller amount" or "Wallet needs more money"), and the input is kept.
4. The policy for this amount is visible on the form and on the review screen (SPD-02) before the Send button.
5. A single review screen restates source wallet, payee (name and masked number), amount, fee, total, purpose, attachment and the wallet effect ("Wallet goes from 800 000 to 680 000 Ar after payment"). The primary button is "Send request for [amount]". The screen states "Nothing is paid yet" (key `spd.request.review_note`). No default choice is pre-selected.
6. Sending creates the request with a short reference (for example SPD-4821) and status Awaiting approval, or Awaiting vote when the policy requires a vote (SPD-09). The requester sees "Sent, waiting for [N] approvals". Approvers are notified (SPD-04). Key `spd.request.submitted` to the requester.
7. Duplicate check: another open or recent request with the same payee and amount inside `duplicate_window` shows a warning with a link; the person can still send. Draft autosave: the form is saved as a Draft at every field.
8. Offline: the form and drafts are available; a draft is kept on the device with the state "Draft, not sent" and Send is disabled with "Sending needs a connection". Nothing is queued silently. A failed send keeps the draft and says nothing was sent.
9. Permission: a person without Wallet: initiate spend sees no "Ask to spend" button. A direct link shows "You need 'Initiate spend' on this wallet. Ask [names]" (key `spd.perm.missing`), enforced server-side.
10. Audit: entry `request.created` with who, when and every field. No ledger entry is written at this point.

**Data:** Expense request (write), Wallet (read), Membership (read), Notification (write), Audit entry (write).
**Depends on:** WAL (wallets, balance, fee estimate), GRP (permissions), SPD-02, SPD-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay expose a payee name lookup (Confirmation of Payee)? Maximum amount per request (provider limits unknown, `raw/03-madagascar-mobile-money.md` section 3.2). Can a request be made for several payees at once (batch)? Default: one payee per request. Who sees a request: all members who can view history see amount, purpose and status; attachments and notes only the requester, approvers and permission holders (Open Collective pattern).

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
1. A policy panel states in one or two sentences, using the live amount: how many approvals are needed, that approvers must hold the approve spend permission and cannot be the requester (unless `self_approval_allowed`), whether a vote is required first, and the wallet's available balance (key `spd.policy.summary` with parameters).
2. Tiers: below `spend_multi_threshold` the request needs `spend_approvals_default` approval; at or above it needs `spend_approvals_multi`; at or above `spend_vote_threshold` a vote must pass before approvals. Crossing a threshold while typing changes the text and highlights the change with a text note, not colour alone.
3. Floor: whatever the group sets, at least one approval from a person other than the requester is always needed. A group that never configured a policy gets exactly this floor. The floor can be raised, never lowered.
4. The panel lists the eligible approvers (names and count). When fewer people can approve than the policy requires (for example the founder is alone), the panel says "You need [N] more people who can approve spending", the Send button is disabled, and a link opens how to ask the people who can grant permissions (GRP).
5. For a project expense, the panel also states the project purchase approval needed (SPD-13), and the project budget remaining.
6. State notes appear when relevant: wallet frozen (SPD-15), spending cap reached or the amount left this period (SPD-14), amount above available balance. Each says whether the person can still send and what to do.
7. A read-only "Spending rules" page shows the same rules for every member who can view the wallet, with who last changed them and when.
8. Offline: the cached policy appears with "Last synced hh:mm" and "The rule may have changed". At send, the server re-evaluates; if the policy changed, the person sees the new policy and must confirm again before the request is created.
9. Language: the sentence is a key with parameters and is tested for 200 percent expansion in Malagasy and French; amounts never clip at 200 percent font scale.

**Data:** Spending policy (read), Wallet (read), Membership (read), Permission (read).
**Depends on:** GRP (permissions, policy settings), RUL (thresholds and caps), WAL.
**Pages:** to be filled from the information architecture.
**Open questions:** Where the policy is edited and whether editing it needs a vote (RUL and GRP; `raw/07` section 8.5 R-PM5 proposes that changes to money-out powers may need a vote). Should the group be able to set a policy per wallet or per project? Default proposed: per wallet, with a project able to be stricter.

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
4. If the amount is at or above `receipt_required_above`, an attachment is mandatory and the Send button explains which item is missing (key `spd.request.attachment_required`).
5. Approvers see a thumbnail and open the full image on tap, so no heavy image loads on a data plan before they choose to. A zoom control is available and the image is not cropped.
6. Privacy: attachments are visible only to the requester, the approvers and holders of Wallet: approve spend or Project: approve purchase on this request; they are not shown in the shared ledger or in exports (SPD-16).
7. Adding an attachment to a request that already has approvals does not void them, but approvers who already approved are notified "A receipt was added" (key `spd.approval.attachment_added`). Removing or replacing an attachment counts as an edit and voids approvals (SPD-07).
8. Unsupported file or oversize: the message says which limit failed and what to do ("Use a photo under X MB or take a new one"), the draft is kept.
9. Accessibility: the attachment has a text label (type and date) and an alternative text field ("Receipt for roof tiles, 120 000 Ar") for approvers who use a screen reader.

**Data:** Document (write, attached to the Expense request), Expense request (write), Audit entry (write).
**Depends on:** SPD-01, XCT (compression, offline queue of non-money items).
**Pages:** to be filled from the information architecture.
**Open questions:** Maximum size and accepted types. Retention of attachments after a group deletes a request (legal retention of five years, `raw/03` section 7.1 item 8). Whether a quote can later be replaced by the final invoice without voiding approvals.

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

**Preconditions:** The person holds approve spend on at least one wallet with an open request, or approve purchase on a project with one.
**Trigger:** A request becomes Awaiting approval, or the person opens "Approvals".

**Acceptance criteria:**
1. The inbox has three tabs: "Waiting for me", "I approved or rejected", "All requests I can see". Each row shows requester, purpose, amount, source wallet, status chip, approval progress ("1 of 2 approved") and the time waiting. Sorted by oldest first by default.
2. A request voided by an edit reappears at the top of "Waiting for me" with a "Changed" chip and a note of what changed (SPD-07). A request the person submitted themselves appears in "All" with a note that someone else must approve (SPD-08), never in "Waiting for me".
3. A badge with the count of waiting requests shows on the home and the navigation. The count equals the number of rows in "Waiting for me".
4. Notification to approvers: key `spd.approval.requested` immediately by push, then one reminder after `approval_reminder_after` if still waiting (`spd.approval.reminder`). If the push is unread after `sms_fallback_delay`, an SMS (`spd.approval.requested.sms`) carries the amount, requester and reference and a link to the detail; approving requires the app and is not done by SMS reply.
5. Batching: more than five waiting requests produce one summary notification, not five. Quiet hours defer push; SMS for money out follows the same quiet-hours rule unless the group chooses otherwise (open question).
6. Empty state: "Nothing is waiting for you" with a link to all requests. Loading shows skeleton rows, never an empty message while loading.
7. Offline: the cached list is readable with "Last synced hh:mm". Opening a detail offline shows the cached summary; Approve and Reject are disabled with "Approving needs a connection". A request that was decided elsewhere shows its true status after sync, and cannot be approved twice.
8. A notification deep-links to the exact request detail (SPD-05).
9. Accessibility and language: rows read as one sentence for a screen reader ("Rado asks 120 000 Ar for roof tiles, waiting two days, one of two approved").

**Data:** Expense request (read), Approval (read), Notification (write), Membership (read).
**Depends on:** SPD-01, GRP, NTF (push, SMS fallback, batching), XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Should SMS for money-out approvals respect quiet hours? Is a "digest of waiting approvals" daily useful for groups with many requests?

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

**Preconditions:** A request is Awaiting approval. The person holds the required permission, is online, and is not blocked by separation of duties (SPD-08).
**Trigger:** The person opens a request from the inbox or from a notification.

**Acceptance criteria:**
1. The detail opens with a plain-language summary sentence (key `spd.approval.summary`): "[Requester] asks to pay [amount] to [payee] from [wallet]. After payment the wallet holds [balance after]. [N of M] approved: [names]." Under it: purpose, note, attachment thumbnail, payee name and masked number, operator, fee, total, related project and budget line with remaining budget, linked decision or vote, and the policy that applies.
2. Buttons are "Approve [amount]" and "Reject" (SPD-06), neither pre-selected. The first screen never contains an "Approve all" action. Approval is per request.
3. For a first-time payee, a payee that fails a name check, an amount unusual for the wallet or a new device, a pause screen appears before the PIN with the question "Did someone ask you to send this money?" (key `spd.approval.pause`), "Cancel" as the visually primary action, and "Gereo will never ask for your PIN".
4. The PIN screen repeats the amount and the payee. After a correct PIN the approval is recorded with the approver, time, and a hash of exactly what was shown, so the approval authorises only that content.
5. The result shows "You approved. [N of M] approved. [What happens next]" (key `spd.approval.recorded`). The final approval changes the status to Approved and starts the payout (SPD-10), and says so.
6. Business rules: each approver counts once. The requester and the payee cannot count (SPD-08). An approval recorded by a person whose permission was revoked before execution does not count (re-checked in SPD-10).
7. Insufficient available balance at the time of approval blocks the action with the reason and no approval is recorded (the funds could have been reserved by another approved request).
8. Errors: if the request was edited, cancelled, rejected or already paid since the approver opened it, the approver sees the new state and the approve button is replaced by what changed; no approval is recorded. If the connection fails after the PIN, the approval state is unknown to the person: the screen says "Checking" and reloads the real state; no duplicate approval is created (idempotent key per approver and content).
9. Notifications: the requester receives `spd.approval.recorded.requester` (push) per approval; the other approvers are not notified of each approval except for the final one (`spd.request.approved`).
10. Audit: entry `approval.recorded` with approver, time, request version and device. No ledger entry yet.

**Data:** Expense request (read, write status), Approval (write), Wallet (read), Project (read), Audit entry (write), Notification (write).
**Depends on:** SPD-04, SPD-02, SPD-08, ACC (PIN, new-device signal), WAL (balance, reserve), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Is a PIN required for every approval or only the final one (default proposed: every approval, since each one authorises money going out, R-C1)? Does a project request need both an approve spend and an approve purchase approval (SPD-13)? Is the payee's name check available (open in SPD-01)?

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
2. The approver chooses one of two outcomes: "Reject, closed" (status Rejected) or "Ask to change" (status stays open as Needs changes, no approvals counted until the requester edits, see SPD-07). Default proposed: "Ask to change". The choice is written in plain words on the screen.
3. A single rejection closes a request only when the group policy says so. By default one rejection moves the request to "Needs changes" and shows the other approvers that a rejection was recorded; the request becomes Rejected when the requester does not change it within `request_expiry` or a second approver rejects (open question).
4. The reason is shown to the requester and to the other approvers, in the request's comment trail with the approver's name, time and reason. Other members who can view only see the status.
5. The requester receives `spd.request.rejected` or `spd.request.needs_changes` (push, SMS fallback if unread) with the reason and the next step ("Edit and send again" or "Closed").
6. A Rejected request cannot be approved or paid. A new request can be copied from it. Money never moved; the message says so.
7. Errors and states: if the request already changed or was decided, the person sees the new state and no rejection is recorded. Offline: Reject is disabled with an explanation; nothing is queued.
8. Audit: `approval.rejected` with approver, time, reason, outcome. No ledger entry is written.
9. Accessibility and language: preset reasons are keys translated in Malagasy, French and English; the text field accepts all three scripts and diacritics.

**Data:** Expense request (write status), Approval (write), Notification (write), Audit entry (write).
**Depends on:** SPD-05, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Does one rejection close the request or only pause it? Default proposed: one rejection pauses it as "Needs changes". May a rejected request be re-submitted unchanged to try other approvers?

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
1. Before the edit starts, the screen says: "Changing this request will cancel the [N] approvals it already has. Approvers will need to approve again." (key `spd.request.edit_warning`). The person must confirm to continue. A request with no approvals edits without this warning.
2. Material fields are: source wallet, payee, amount, purpose, linked project or budget line, linked decision or vote, and removing or replacing an attachment. Changing any material field voids all approvals. Adding a note or an attachment does not (SPD-03).
3. After saving a material change, the status returns to Awaiting approval (or Awaiting vote if the amount crosses a threshold, see SPD-09), the approval count shows "0 of N", and a "Changed" label states what changed (from and to values) on the detail and in the inbox.
4. Approvers who had approved, and all approvers who can still approve, receive `spd.approval.voided` (push, SMS fallback if unread) with the changed fields. A vote already open for the request is notified and reset or restarted per VOT rules (SPD-09).
5. The policy is re-evaluated with the new amount (SPD-02). If the new amount needs a vote or more approvals, the requester sees this before saving.
6. A request that was Approved and waiting for payout (held for a freeze, SPD-15, or a provider outage, SPD-11) is moved back to Awaiting approval by the edit; the reserved funds are released.
7. Version history: each edit creates a new version. Approvals record the version they apply to. Old versions remain readable with who changed what and when, for approvers and permission holders.
8. Concurrency: if an approver approves while the requester is editing, the approval is recorded against the old version and is voided on save; the approver sees "Changed while you were approving" and nothing is paid.
9. Offline: Edit is read-only with an explanation; the draft of the edit is not queued. Errors keep the person's inputs.
10. Audit: `request.edited` with version, before and after values, voided approvals (who and when), who edited, when.

**Data:** Expense request (write, versions), Approval (void), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-05, SPD-09, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** May an approver or permission holder edit a request on the requester's behalf? Default proposed: no, only the requester, who may also cancel it. Are note edits also material? Default: no.

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

**Preconditions:** A request is Awaiting approval and the viewer holds approve spend on its wallet.
**Trigger:** The requester, the payee or an approver who already approved opens the request or tries to approve.

**Acceptance criteria:**
1. By default, the requester cannot approve their own request (`self_approval_allowed` off). The approve button is absent for them and a note says "You asked for this payment, so someone else must approve it" (key `spd.approval.self_blocked`). The rule is enforced on the server, not only on the screen.
2. By default, a person who is the payee (for example a member reimbursed) cannot approve it either, with the same kind of note. A person who already approved cannot approve again.
3. The policy counts only distinct eligible approvers. A group with only one person who can approve, and who is also the requester, sees on the form "You need another person who can approve spending" and cannot send (SPD-02). This is the intended friction: the founder starting alone must grant the permission to a second person.
4. If a group sets `self_approval_allowed` on, the request shows "Approved by the person who asked" on the detail and in the ledger, and the setting change itself is audited and visible to all members. Open question below on whether that setting is allowed at all, or limited to small groups and small amounts.
5. Permission and relationship changes are re-checked at execution (SPD-10): an approver who lost the permission, left the group or became the payee since approving no longer counts, and the request returns to Awaiting approval with the missing count.
6. The requester sees the list of eligible approvers and who has approved (names), so they know who to ask; they can send a nudge reminder to those who have not (maximum one per approver per `approval_reminder_after`) (key `spd.approval.nudge`).
7. A permission holder cannot grant themselves the approve spend permission to unblock their own request: granting needs another person with grant permission (GRP) and is audited.
8. Errors: any attempt to approve against the rule shows what rule applies, whether money moved (no) and what to do next (ask another approver). No approval is recorded.
9. Audit: refused self-approval attempts are logged with who, when and request, so a pattern can be seen.

**Data:** Expense request (read), Approval (read, write refusal), Membership (read), Permission (read), Audit entry (write).
**Depends on:** SPD-05, GRP (permissions, grant audit).
**Pages:** to be filled from the information architecture.
**Open questions:** Can the requester approve their own request? Default proposed: no, with `self_approval_allowed` off and not changeable in the MVP, which blocks single-person groups from spending until a second approver exists. Alternative to decide with the founder: allow self-approval only below a small amount and only in groups of fewer than a set number of members. Can a payee who is also an approver approve? Default: no.

---

### SPD-09 Link a vote to an expense

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder or Member (requester)
**Permission needed:** Wallet: initiate spend, and Vote: create (to start the vote)
**Tags:** legal-gate, audit

**Story:** When an expense is big enough that the group should decide together, I want the vote to open from the request and, if it passes, send the expense to the approvers, so I can have one flow from decision to payment.

**Conversation:** The vote linked to a wallet and spending in one flow is the combination nobody has (`raw/08-competitor-ux-comparison.md` section 6.8; [competitive-analysis.md](../../research/competitive-analysis.md) section 5; info.md Votes: "link a vote to an action: approve an expense"). Linked action approve an expense is the only linked action in v1 ([competitive-analysis.md](../../research/competitive-analysis.md) section 7). A vote does not replace approvals: it expresses the group's will and then the people who hold approve spend still authorise the payment (info.md: "au-dessus d'un seuil, approbation de plusieurs personnes ou un vote"; this epic keeps both, to be confirmed in the open questions).

**Preconditions:** The policy requires a vote for this amount (`spend_vote_threshold`), or a person with Vote: create and Wallet: initiate spend starts one for any request.
**Trigger:** The request is sent with an amount at or above the vote threshold, or the requester taps "Ask the group to vote".

**Acceptance criteria:**
1. When the policy requires a vote, sending the request creates a linked vote (VOT) with the question prefilled as a full sentence with the consequence ("Pay 300 000 Ar to Rado for roof repair from the Repairs wallet"), the amount, payee and wallet, the passing rule, the quorum and the deadline from the group's vote settings. The request status is Awaiting vote and no approver is asked yet.
2. The request detail shows the vote's state (quorum progress, time left, current count) and links to it. The requester cannot edit the vote's question to differ from the request; the question is derived from the request.
3. Vote passes (quorum met and majority reached): the system writes the result to the decision log, links the Decision to the request, changes the status to Awaiting approval and sends the request to approvers (key `spd.request.vote_passed`). Approvers see the vote result and link on the detail (SPD-05).
4. Vote fails or no quorum: the request becomes Rejected with the reason "The group did not approve" or "Quorum not reached", the requester is told with the counts and the next step ("You can propose it again", key `spd.request.vote_failed`). No money moved. Policy for no-quorum (extend, close as invalid, fall back) follows the vote settings (VOT).
5. Edit (SPD-07) of a request while a vote is open resets or restarts the vote and notifies voters, because the vote must be about exactly what is paid.
6. Cancelling the request closes the vote with "Withdrawn by the requester".
7. The vote result does not release money by itself. After a pass, normal approvals apply (SPD-05, SPD-08).
8. Voters see the request's essential facts, never attachments or private notes unless the group allows it. A guest voter opening a vote link sees amount, purpose, payee display name and the passing rule.
9. Offline: the vote status is readable from cache; casting the vote is a VOT behaviour. Creating the linked vote needs a connection.
10. Audit: the link between request, vote and decision is recorded with times and the people involved.

**Data:** Expense request (write status, link), Vote (create, read), Decision (write on close, VOT), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-02, SPD-05, VOT (vote linked to an action, decision log), GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** After a vote passes, do approvers still need to approve, or does the vote replace approvals (default proposed: approvals still required, which keeps the no single administrator rule)? Which majority and quorum apply by default for money votes? Can a request be created after the vote (decision exists first)? Allowed via the decision link in SPD-13.

---

### SPD-10 Execute the payout through the payment adapter

**Type:** Job story (system behaviour)
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (authorised by the recorded approvals)
**Tags:** legal-gate, ledger, audit

**Story:** When the last required approval is in, I want the payout to be sent safely to the payee through the payment provider and every status to be visible, so that the money goes out exactly once and everyone can follow it.

**Conversation:** Payments go through Vanilla Pay behind a payment adapter so another rail can replace it (conventions section 2). Provider callbacks can time out or double-notify, so idempotency keys, pending and settled states and a reconciliation job are mandatory ([competitive-analysis.md](../../research/competitive-analysis.md) section 6 item 6; `raw/03-madagascar-mobile-money.md` section 7.1 item 5). Pending says what happens next; failed says whether money moved (`raw/07-ui-ux-best-practices.md` section 2.3 R-T1 to R-T4). A rule that cannot pay if funds are insufficient (`raw/08-competitor-ux-comparison.md` section 6.7). Money-out is online only. Moves client money: legal-gate.

**Preconditions:** The request is Approved with the required approvals on the current version, from people who still hold the permission.
**Trigger:** The last required approval is recorded.

**Acceptance criteria:**
1. Before dispatch, the system re-checks, in this order: version unchanged, required approvals still valid and from eligible people, wallet not frozen (SPD-15), cap not exceeded (SPD-14), project and budget conditions (SPD-13), available balance covers amount plus fee. If any check fails, nothing is sent, the request shows why with whether money moved (no), and returns to the right state (usually Awaiting approval or Needs attention).
2. The system creates the payout transaction with an idempotency key built from the request and the version, and sends it through the payment adapter. Status Initiated, then Pending when the provider has accepted it, then Confirmed or Failed. The request shows Paying then Paid.
3. Amount reservation: from the final approval until the payout resolves, the amount plus fee is reserved against the wallet's available balance so no second request can spend it (key `spd.payout.reserved`).
4. The fee is the real provider fee for the payee's network, shown on the request before approval and recorded as its own Fee ledger line, so cross-network costs are visible to all members (`raw/07` section 2.5 R-F5).
5. Callbacks and polling: provider notifications are processed idempotently. A duplicate Confirmed does nothing. A payout still unanswered after `payout_pending_timeout` becomes Needs attention and the system polls and reconciles; it never resubmits a payout of unknown outcome automatically.
6. Statuses and what the person sees: Pending shows elapsed time, what Gereo is waiting for and "Nothing to do, we will tell you" (key `spd.payout.pending`). Confirmed shows the receipt (SPD-16). Failed is handled by SPD-11. Online only: if the system cannot reach the provider the request waits (SPD-11), the requester is never asked to "retry".
7. Ledger (provisional model, to confirm with WAL): at dispatch the amount and fee move from the wallet to an in-transit account; on Confirmed from in-transit to the external payee account; on Failed or Cancelled a reversing entry returns them. Each entry carries the request reference, the approvers, the version and the decision link. All entries are balanced and immutable.
8. Notifications: the requester receives `spd.payout.sent` when dispatched and `spd.payout.confirmed` (push; SMS receipt with reference `spd.payout.confirmed.sms`). Approvers receive `spd.payout.confirmed` once. Members receive nothing individually (the ledger and the digest show it).
9. Audit: dispatch, each status change and its source (adapter callback, poll, operator), the idempotency key and the reference given by the provider.
10. Offline: the status of a Paying request is readable from cache with "Last synced hh:mm". Nothing can be paid or retried offline.

**Data:** Expense request (write status), Transaction (write), Ledger entry (write), Approval (read), Wallet (read, reserve), Notification (write), Audit entry (write).
**Depends on:** SPD-05, SPD-14, SPD-15, WAL (ledger, in-transit account, reservation, reconciliation), OPS (reconciliation, stuck payouts), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Posting model for money in transit (to settle with WAL, see the criterion above). Whether payouts to non-Gereo payees are in the MVP or only to members. Provider limits per transaction, per day and per wallet (Ar 20M individual wallet cap on MVola, the Ar 100M ceiling in info.md needs clarification, `raw/03` sections 7.1 item 3 and 7.4 item 4). Who bears the payout fee.

---

### SPD-11 Payout failure, delay and provider outage

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Requester, Permission holder, System
**Permission needed:** Wallet: approve spend (to retry); Wallet: initiate spend (requester view)
**Tags:** legal-gate, ledger, audit

**Story:** When a payout does not go through or the provider is down, I want to know whether the money left the wallet and what happens next, so that nobody pays twice or thinks money is lost.

**Conversation:** "Debited but not delivered" with no in-app trace is the most common complaint on Orange Max it and PiggyVest (`raw/08-competitor-ux-comparison.md` section 6.3). MVola had outages in November 2025 and May-June 2026: show "provider unavailable", queue payouts rather than fail, never claim funds are lost, and give a reference (`raw/03-madagascar-mobile-money.md` section 7.1 item 6). Reversals through the provider cost 5 percent (minimum Ar 10,000) with a 7-day window (competitive-analysis section 2), which is why the system must not send blindly. Errors say what happened, whether money moved, what to do next (`raw/07` section 2.6 R-E2, R-E3).

**Preconditions:** A payout was dispatched or was due to be dispatched (SPD-10).
**Trigger:** The provider returns Failed, does not answer, is unavailable, or rejects the payee.

**Acceptance criteria:**
1. Provider unavailable before dispatch: the request stays Approved with "Waiting for Vanilla Pay" and the state "Nothing was taken from the wallet". The system retries until `payout_retry_window`, then moves the request to Needs attention and notifies approvers and the requester (`spd.payout.delayed`).
2. Failed after dispatch: the message states the plain reason (payee number not valid, payee wallet limit exceeded, insufficient provider funds, declined, provider error) and whether money moved ("Not taken from the wallet" or "Taken, refund in progress, reference X") (key `spd.payout.failed.*`).
3. Ledger: a failed payout writes a reversing entry returning the amount and the fee from the in-transit account to the wallet, with a reason and the reference. The original entries stay visible. The reservation is released only when the reversal is posted.
4. Next steps per reason: transient errors offer "Try again" to holders of Wallet: approve spend using the same approvals while the request is unchanged (a new idempotency attempt number, never a duplicate on an unknown outcome). A payee problem requires an edit of the payee, which voids approvals (SPD-07). A limit problem offers "Edit the amount" or "Cancel".
5. Unknown outcome (timeout, no callback): status Needs attention with the sentence "We are checking with the provider. Do not pay again" and the reference; the system reconciles and an operator is alerted (OPS). Retry is blocked until the outcome is known.
6. The requester and approvers can tap "Report this payment", which pre-fills the reference and the request into a support ticket.
7. Notifications: `spd.payout.failed` to the requester and to approvers by push, and SMS (`spd.payout.failed.sms`, under 160 GSM-7 characters with the reference) because money did not arrive.
8. Offline: the status and the reference are readable from cache; Try again is online only.
9. Audit: each failure, retry attempt, operator action and the final outcome, with time and source.

**Data:** Transaction (read, write), Ledger entry (write), Expense request (write status), Support ticket (create), Notification (write), Audit entry (write).
**Depends on:** SPD-10, WAL (reversing entries), OPS (stuck payout view, reconciliation, support), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Retry window and attempt count. What the provider returns on each failure (Vanilla Pay terms unknown, `raw/03` section 3.2). Whether an operator can confirm an outcome by hand and how that is audited.

---

### SPD-12 Cancel a request

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member (the requester) or Permission holder
**Permission needed:** being the requester, or Wallet: approve spend
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
5. Notification: approvers who were waiting receive `spd.request.cancelled` (push, no SMS), and the requester receives confirmation. If a person other than the requester cancelled, the requester also receives the reason.
6. Race: if the last approval or the dispatch happens at the same instant, the server decides; the person sees the true outcome ("Already sent, cannot cancel" with a link). No double outcome is possible.
7. Offline: Cancel is disabled with "Cancelling needs a connection" for requests already visible to others; a Draft never sent can be deleted offline.
8. A Cancelled request stays visible in history with who and why, and can be copied into a new request.
9. Audit: `request.cancelled` with who, when, reason and state at cancellation. No ledger entry (nothing had moved); a reservation release is logged.

**Data:** Expense request (write status), Approval (void), Vote (close), Wallet (release), Notification (write), Audit entry (write).
**Depends on:** SPD-01, SPD-09, SPD-10, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** May any approver cancel another person's request, or only a holder with a stronger permission? Automatic closing of stale requests (`request_expiry`).

---

### SPD-13 Project and decision links

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member or Permission holder
**Permission needed:** Wallet: initiate spend; Project: approve purchase (project requests); Project: view
**Tags:** legal-gate, ledger, audit

**Story:** As a project member, I want an expense to belong to a project and, if there is one, to the decision that authorised it, so that the project shows what was spent and why.

**Conversation:** A project expense debits the linked wallet and needs the approve spend permission (info.md "Projets (ERP)"); every important decision is linked to a vote or to a named person. Keep tasks and money linked: each expense request references a budget line and shows remaining budget in a sentence and a bar (`raw/07-ui-ux-best-practices.md` section 8.6). A decision log entry with a "money moved" link back to the ledger is an open opportunity (`raw/08-competitor-ux-comparison.md` section 6.8). Project page timeline merges tasks, expense requests and decisions (section 6.9). Out of scope: purchase orders and supplier management ([competitive-analysis.md](../../research/competitive-analysis.md) section 7).

**Preconditions:** A project with a linked wallet exists (PRJ), or the person links an existing decision.
**Trigger:** The person starts a request from the project, or adds a project or decision on the request form.

**Acceptance criteria:**
1. A request started from a project is prefilled with the project's linked wallet and shows the budget line, the remaining budget in a sentence ("Budget 2 000 000 Ar, spent 750 000 Ar, left 1 250 000 Ar") and a bar. Amount above the remaining budget shows "Over budget by X" and follows the group's setting (block, or allow with an extra approval; default proposed: block).
2. Permissions: a project request needs the requester to hold Wallet: initiate spend on the linked wallet. Approval needs both a holder of Wallet: approve spend on the wallet (money) and one holder of Project: approve purchase (the purchase makes sense for the project). The detail lists both kinds (key `spd.approval.project_gates`). Default proposed; see open questions.
3. A person without Project: approve purchase sees the second gate as "Waiting for a project approver" and cannot supply it. If nobody holds it, the panel says so and who can grant it (GRP, PRJ).
4. Decision link: the form can link an existing decision (from the decision log) or, when a vote passed (SPD-09), the decision is linked automatically. When the policy requires a decision for project spending (setting `project_spend_requires_decision`, default off), Send is blocked without one with a clear reason.
5. After payment, the ledger entry, the request and the decision show each other: from the decision "money moved: 300 000 Ar, entry reference" and from the entry "authorised by decision, vote result" (key `spd.request.decision_link`).
6. The project page timeline shows the request with status and amount at each step (requested, approved, paid), merged with tasks and decisions (PRJ). Project spend to date updates only when a payout is Confirmed.
7. If the project is closed (PRJ) or the budget line is removed, open requests are returned to Needs attention with a reason; paid ones keep their link.
8. Offline: project and decision links are readable from cache; sending is online only.
9. Audit: link, unlink and permission gate approvals each recorded with who and when.

**Data:** Expense request (write), Project (read), Decision (read, link), Approval (write), Ledger entry (read), Audit entry (write).
**Depends on:** SPD-01, SPD-05, SPD-09, PRJ (project, budget, wallet link, timeline), VOT (decision log), GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Does a project request need both wallet and project approvals, or may one person holding both count twice (default: no, the two gates are distinct and an approver holding both counts once for the threshold and once for the purchase gate)? Over-budget behaviour. Should the project owner be able to initiate spend from a wallet without being a wallet permission holder (default: no, permission inheritance from the group applies)?

---

### SPD-14 Spending cap

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (sets); System (enforces)
**Permission needed:** Wallet: edit rules (to set); none to see its effect
**Tags:** legal-gate, ledger, audit

**Story:** As a permission holder, I want to put a limit on how much a wallet or project may spend in a period, so that even approved requests cannot drain it.

**Conversation:** The spending cap with alert is one of the four rule templates in the MVP ([competitive-analysis.md](../../research/competitive-analysis.md) section 7; info.md "Wallets"). Show the remaining cap on the wallet card, warn at 80 percent and at the cap, and state whether the cap blocks, asks approval, or only warns (`raw/07-ui-ux-best-practices.md` section 8.2 R-RB5; thresholds are U). The cap is a guard for the group when many small approved requests would add up. The rule engine belongs to RUL; this story defines the enforcement on spending.

**Preconditions:** A spending cap rule exists on the wallet or project (set in RUL).
**Trigger:** A request is created, approved or about to be paid.

**Acceptance criteria:**
1. The wallet and request screens show the cap in words ("This month's limit: 500 000 Ar. Spent or promised: 320 000 Ar. Left: 180 000 Ar") and a bar. Spent counts Confirmed payouts plus amounts reserved for approved requests inside the period.
2. Warnings: at the configured warning level and when a request would take the cap over, the requester sees the effect before sending (SPD-02) and approvers see it in the detail (SPD-05).
3. Mode block (default): a request above the amount left cannot be sent, and a payout that would exceed the cap at execution is stopped (SPD-10 check) with "The monthly limit would be exceeded. Nothing was paid" and the next step (smaller amount, wait for the next period, or a vote to change the cap).
4. Mode require a vote: a request above the cap is sent to a vote (SPD-09) in addition to approvals. Mode warn: the request goes ahead with a visible warning and the overage is flagged in the ledger.
5. The period resets at the configured start; the reset is visible in the cap line and writes no ledger entry.
6. Changing or removing a cap follows RUL, may need a vote according to group settings, and applies to future requests only; amounts already paid stay counted for the period.
7. Notifications: holders of Wallet: edit rules receive `spd.cap.warning` at the warning level and `spd.cap.reached` at the cap (push, digest-friendly).
8. Offline: the cap line is readable from cache with "Last synced hh:mm"; enforcement is on the server.
9. Audit: each time the cap blocked or flagged a request, with the request, amounts and period.

**Data:** Wallet rule (read cap), Expense request (read), Ledger entry (read), Notification (write), Audit entry (write).
**Depends on:** SPD-10, RUL (spending cap rule), WAL, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Period boundaries and time zone. Whether a cap per project and per wallet can coexist. Warning levels (80 percent is a hypothesis, raw/07 R-RB5).

---

### SPD-15 Emergency freeze of outgoing money

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: approve spend to freeze (default); lifting needs `freeze_lift_approvals`
**Tags:** legal-gate, ledger, audit

**Story:** When I suspect fraud, a stolen phone or a dispute, I want to stop all money leaving a wallet right away and have the group lift it together, so that nothing more is lost while we sort it out.

**Conversation:** Administrator fraud and frozen accounts dominate complaints; mitigations seen include system-blocked admin withdrawals (Tonti+) and multi-signatory release ([competitive-analysis.md](../../research/competitive-analysis.md) section 3.1; `raw/01-group-savings.md` section 13 risk 1). Fraud is mostly social engineering and SIM swap (`raw/07-ui-ux-best-practices.md` section 2.8). A brake that one person can pull but that needs several people to release matches the "no single administrator" rule. No new permission name is invented; the freeze uses an existing permission as the default and the open question asks whether a dedicated one is needed (conventions section 7).

**Preconditions:** The person holds Wallet: approve spend on the wallet and is online.
**Trigger:** The person taps "Freeze outgoing money" on a wallet.

**Acceptance criteria:**
1. The confirmation states what stops (new payouts, new approvals, withdrawals and transfers out of this wallet) and what continues (money coming in, contributions, viewing, internal splits between wallets of the same group, per the open question), with a required short reason (presets such as "Suspected fraud", "Lost phone", "Dispute", "Other").
2. After confirmation, the wallet shows a Frozen banner (key `spd.freeze.banner`) with who froze it, when and why (reason visible to permission holders). Payouts that have not yet been dispatched are held (request status Needs attention "Held by freeze"); payouts already with the provider continue and the screen says so.
3. New requests can be drafted and sent but cannot be approved or paid while frozen; the policy panel and the inbox show the frozen state (SPD-02, SPD-04). Edits and cancellations remain possible.
4. All members who can view the wallet are notified immediately: `spd.freeze.applied` (push) and, to permission holders, SMS (`spd.freeze.applied.sms`) because money movement stopped. Lifting sends `spd.freeze.lifted`.
5. Lifting needs `freeze_lift_approvals` distinct people holding Wallet: approve spend, each entering their PIN, and cannot be done by the person who froze it alone unless the policy allows. Progress shows "1 of 2 approved to lift". A vote can lift it where the group chose (VOT).
6. When lifted, held requests return to Approved or Awaiting approval and each is re-checked (SPD-10 criterion 1). A request edited during the freeze keeps normal rules.
7. A Gereo operator can also freeze or hold a wallet for compliance (OPS). The banner then says "Held by Gereo" with the reference and a way to contact support, not the reason.
8. Offline: the Frozen banner and state are readable from cache; applying or lifting needs a connection.
9. Ledger and audit: freezing and lifting write no ledger entry. Both are audit entries with who, when, reason and the held requests. Repeated freeze and lift of the same wallet is rate-limited and flagged to the group.

**Data:** Wallet (write state), Expense request (read, write status), Approval (write for lift), Notification (write), Audit entry (write).
**Depends on:** SPD-10, WAL (wallet state, outgoing blocks), GRP, VOT, OPS, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission may freeze? Default: approve spend. Should a dedicated "freeze" permission exist (needs a conventions change)? Can a single person's freeze be abused to block the group? (mitigation: lifting needs several people, the freeze is audited and notified.) Do internal splits (CON-14) and member-wallet transfers continue during a freeze? Which provider-level holds can Gereo place?

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
1. The receipt for a Confirmed payout shows amount, fee, total, payee name and masked number, source wallet, date and time, status Confirmed and a short copyable reference (key `spd.payout.receipt`), the names of the approvers and the project and decision it belongs to. "Share receipt" produces an image or text that hides the payee's number.
2. Ledger entries written for a request are: Expense (wallet to in-transit or to payee) and Fee as its own line, each classified and carrying the request reference, the version, the approvers, the decision link and the payout reference. Reversals appear with a "Reversed" chip and the reason, the originals untouched.
3. From any such ledger entry, one tap opens the request summary, the approvals list (who, when), the vote and decision, and the attachment only for those who may see it (SPD-03). No attachments or private notes appear in the shared ledger or in exports.
4. The request audit trail is a timeline: created, edited (versions), approvals (who, when), rejections with reason, votes, freeze holds, payout statuses, cancel. Each item has who, when and what changed, in plain words. It is append-only.
5. Visibility: members with Wallet: view history see amount, purpose, status, payee display name and approver names; attachments, notes and reasons only follow SPD-03 and SPD-06 rules.
6. Empty state: a wallet with no spending shows what spending requests are and a button to ask (if permitted). Loading shows skeletons, never "No records".
7. Offline: receipts and the audit trail of the last N requests are readable from cache with "Last synced hh:mm"; export needs a connection.
8. Export includes expense rows, approver names and references (CON-18 conventions); the export writes an audit entry.
9. Operators can read request trails for support and compliance but not change them (OPS); operator reads are logged.
10. Accessibility and language: timeline items read as sentences; dates show weekday and time; amounts never clip at 200 percent font scale.

**Data:** Expense request (read), Approval (read), Ledger entry (read), Transaction (read), Decision (read), Document (read, restricted), Audit entry (read).
**Depends on:** SPD-10, SPD-11, SPD-13, WAL, CON-16, CON-18, OPS, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Retention period for audit data and receipts (five years under Law 2016-056 art. 53 per competitive-analysis section 6 item 8; to confirm with a lawyer). Does the payee receive any Gereo SMS (privacy and cost) or only the provider's own message? Default proposed: only the provider's message.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| SPD-01 | Create an expense request | P0 | WAL, GRP, SPD-02, SPD-03 |
| SPD-02 | See the spending policy before sending | P0 | GRP, RUL, WAL |
| SPD-03 | Attach a receipt or a quote | P1 | SPD-01, XCT |
| SPD-04 | Approval inbox | P0 | SPD-01, GRP, NTF, XCT |
| SPD-05 | Approval detail and approve | P0 | SPD-04, SPD-02, SPD-08, ACC, WAL, NTF |
| SPD-06 | Reject a request with a reason | P0 | SPD-05, NTF |
| SPD-07 | Edit a request, earlier approvals are voided | P0 | SPD-01, SPD-05, SPD-09, NTF |
| SPD-08 | Separation of duties | P0 | SPD-05, GRP |
| SPD-09 | Link a vote to an expense | P0 | SPD-01, SPD-02, SPD-05, VOT, GRP |
| SPD-10 | Execute the payout through the payment adapter | P0 | SPD-05, SPD-14, SPD-15, WAL, OPS, NTF |
| SPD-11 | Payout failure, delay and provider outage | P0 | SPD-10, WAL, OPS, NTF |
| SPD-12 | Cancel a request | P1 | SPD-01, SPD-09, SPD-10, NTF |
| SPD-13 | Project and decision links | P1 | SPD-01, SPD-05, SPD-09, PRJ, VOT, GRP |
| SPD-14 | Spending cap | P1 | SPD-10, RUL, WAL, NTF |
| SPD-15 | Emergency freeze of outgoing money | P1 | SPD-10, WAL, GRP, VOT, OPS, NTF |
| SPD-16 | Receipts, ledger entries and audit trail of a request | P1 | SPD-10, SPD-11, SPD-13, WAL, CON-16, CON-18, OPS, XCT |

Count: 16 stories. P0: 10 (SPD-01, 02, 04, 05, 06, 07, 08, 09, 10, 11). P1: 6 (SPD-03, 12, 13, 14, 15, 16).

## Cross-epic dependencies

Story IDs of other epics are named by capability because their files are not final; link the exact IDs when each epic file is complete.

- **ACC:** PIN on every money-out approval, new-device signal for the pause screen (SPD-05), identity tier for requesters and approvers at the right level, SIM-swap re-verification, self-service PIN reset (SPD-05, SPD-15).
- **WAL:** wallet balance and available balance with reservation (SPD-01, SPD-10), fee estimate, payout transaction and statuses, in-transit posting model and reversing entries (SPD-10, SPD-11), wallet frozen state and outgoing blocks (SPD-15), reconciliation (SPD-10, SPD-11), transaction reference and report-a-payment (SPD-11).
- **RUL:** spending cap rule and its editor (SPD-14); thresholds and spending policy editor if the policy is treated as a wallet rule (SPD-02); loop and conflict checks for cap rules.
- **GRP:** permissions Wallet: initiate spend and approve spend, Project: approve purchase; "Effective access" panel; permission grant audit (SPD-08); the settings for thresholds, `self_approval_allowed`, and who can edit the policy (SPD-02); list of eligible approvers.
- **VOT:** vote linked to an action "approve an expense"; vote creation from a request with derived question; decision log entry on close with link back to the ledger; no-quorum fallback; guest voter link view (SPD-09, SPD-13, SPD-15 lifting by vote).
- **PRJ:** project linked to a wallet, budget lines and remaining budget, project timeline merging tasks, expenses and decisions, approve purchase gate (SPD-13); project close behaviour.
- **EVT:** none in the MVP; a later hook if an event expense (event-linked purchase) is allowed.
- **ANN:** optional announcement when a large expense is paid or a freeze applies (no dependency in the MVP).
- **NTF:** push then SMS fallback with `sms_fallback_delay`, batching of more than five notifications, quiet hours, deep links to the request, per-recipient delivery log, reminder after `approval_reminder_after`, SMS aggregator (SPD-04, SPD-05, SPD-10, SPD-11, SPD-15).
- **XCT:** offline cache with last-synced, offline queue only for non-money items (drafts, attachments), message keys in three languages, SMS GSM-7 lint, 200 percent font scale, image compression and resumable upload (SPD-01, SPD-03, SPD-04).
- **OPS:** reconciliation and stuck payouts, operator freeze and hold, support tickets from "Report this payment", read-only access to request trails with logged access (SPD-10, SPD-11, SPD-15, SPD-16).
- **CON:** CON-16 (expense rows in the group ledger), CON-18 (export), CON-14 and CON-15 (splits during a freeze), CON-20 (shared audit conventions).

## Open questions

1. **Can the requester approve their own request?** Default proposed: no, always (`self_approval_allowed` off). Consequence: a group with a single permission holder cannot spend until a second approver exists. Alternative to decide with the founder: allow self-approval only for small amounts in small groups (SPD-08). Related: may a payee who is also an approver approve? Default: no.
2. **Do votes replace approvals or precede them?** Default proposed: a passed vote sends the expense to the approvers, who still approve (SPD-09). info.md says "approvals by several people or a vote"; confirm that both apply together above the vote threshold.
3. **PIN on every approval or only the final?** Default proposed: every approval (SPD-05).
4. **One rejection: close or pause?** Default proposed: one rejection pauses as "Needs changes" (SPD-06).
5. **Project spending gates.** Is the project approve purchase gate in addition to the wallet approve spend gate, or can one approval cover both? Over-budget behaviour (SPD-13).
6. **Posting model for money in transit** and when funds are reserved (default: at final approval) (SPD-10, WAL).
7. **Payee check.** Does Vanilla Pay expose a name lookup? Are payouts to non-Gereo payees in the MVP? Who bears the payout fee? (SPD-01, SPD-10; `raw/03` section 3.2.)
8. **Provider limits.** Per-transaction, per-day and per-wallet limits; the meaning of the Ar 100 000 000 ceiling; payee wallet caps (Ar 20M on individual MVola wallets) (SPD-10, SPD-11).
9. **Freeze design.** Which permission freezes, whether a dedicated permission is needed, and whether internal splits and member-wallet transfers continue during a freeze (SPD-15, CON-14).
10. **Who edits the spending policy and does editing it need a vote?** Thresholds, number of approvals, vote threshold, and spending cap belong to RUL and GRP (SPD-02, SPD-14).
11. **SMS economics and quiet hours for money-out approvals.** Who pays, whether quiet hours apply, and whether approving by SMS reply is ever allowed (default: never) (SPD-04).
12. **Request expiry and visibility.** Automatic closing of stale requests (`request_expiry`) and who sees what of a request: attachments and notes only to participants (SPD-01, SPD-03, SPD-16).
13. **Legal gate for the whole epic.** Holding client funds and paying out to third parties depend on the unconfirmed legal basis (Law 2016-056, competitive-analysis section 6 item 1); every story tagged `legal-gate` is blocked from release until the legal opinion and the Vanilla Pay due diligence (competitive-analysis section 10) are in.
14. **Retention.** Audit and receipt retention period (five years proposed under art. 53, to confirm with a lawyer) (SPD-16).
