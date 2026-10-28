# SPD: screen and state inventory

Source: `docs/product/stories/SPD.md` (16 stories). Surface IDs are `SCR-SPD-nn`. Kinds: page, sheet, modal, inline, notification, system. Container choice follows 09 section 10.3 (money-out review, pause and PIN are full screens, page trigger P5; a request has its own identity and lifecycle, page triggers P1 and P2). Permission names follow conventions section 7. Decisions D1 to D7 and the R-rows in `05-decisions.md` apply over any story text: D1 (no self-approval), D4 (a passed vote authorises the payout, no approvers after it), D6 (XCT-05 owns the queue; request drafts are local drafts in Table B).

Line formats used below:

- Surface lines: `SCR-SPD-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-SPD-nn [state]: trigger; sees; can do; key`.
- Request statuses are the SPD ones: Draft, Awaiting vote, Awaiting approval, Needs changes, Approved, Paying, Paid, Failed, Rejected, Cancelled (shown as "Expired" when closed by expiry), Needs attention.
- Screens of other epics are cited as `SCR-WAL-nn`, `SCR-GRP-nn` or `SCR-ACC-nn` where those inventories define them.

---

### SPD-01 Create an expense request

- Story: SPD-01 Create an expense request
- Surfaces:
  - SCR-SPD-01 | Expense request form (source wallet, payee, amount, purpose, note, attachment, optional project and decision links; available balance; live fee line; policy panel) | page | Member or permission holder with Wallet: initiate spend on the source wallet | "Ask to spend" from a wallet, a project or a decision; WAL-09, WAL-12 and WAL-13 on a group wallet | opens SCR-SPD-02; back keeps the local draft
  - SCR-SPD-02 | Request review (source wallet, payee name and masked number, amount, fee, total, purpose, attachment, wallet effect; "Nothing is paid yet" `spd.request.review_note`; button "Send request for [amount]") | page | same | SCR-SPD-01 | opens SCR-SPD-03
  - SCR-SPD-03 | Request sent confirmation (`spd.request.submitted`; "Sent, waiting for [N] approvals" or "Sent, the group is voting"; reference such as R-4821) | inline | requester | send succeeded | opens SCR-SPD-18
  - SCR-SPD-04 | Payee picker (member of the group, saved payee, new mobile money number with operator, Gereo destination: another Gereo user by phone number, a group wallet, another wallet of this group, "Pay Gereo") | sheet | requester | payee field on SCR-SPD-01 | pick
  - SCR-SPD-05 | Duplicate warning (same payee and amount inside `duplicate_window`, with link) | inline | requester | SCR-SPD-01 | person can still send
  - SCR-SPD-06 | New payee re-read of the last three digits | inline | requester | first-time payee | enter digits
  - SCR-SPD-07 | Missing-permission message (`spd.perm.missing`: "You need 'Wallet: initiate spend' on this wallet. Ask [names]") | page | person without the permission opening a direct link | direct link | none
  - SCR-SPD-08 | Send-time approver count guard | system | none | Send | none
- States per surface:
  - SCR-SPD-01 [default]: source wallet default the one the person came from (picker lists only wallets they can initiate from); purpose required; no default choice pre-selected
  - SCR-SPD-01 [balance]: available balance (balance minus reserved totals) next to the amount; live fee line always shown ("Fee: 0 Ar" if none); total updates live; fee fixed at authorisation
  - SCR-SPD-01 [over balance]: amount plus fee exceeds available balance; blocked before sending with "Ask for a smaller amount" or "Wallet needs more money"; input kept
  - SCR-SPD-01 [receive limit]: payee cannot receive; `err.wal.recipient_cannot_receive` with no reason; a tier limit hit shows `acc.tiers.limit_hit` (ACC-07)
  - SCR-SPD-01 [tier for vote path]: requester below the money-out tier on the vote path; next step from ACC-07 before sending
  - SCR-SPD-01 [draft]: autosave as a Draft at every field; offline the draft is a local draft (XCT-05 Table B) kept on the device with "Draft, not sent"; never sent without a tap
  - SCR-SPD-01 [offline]: Send is online only and not queued; shows `xct.offline.money_blocked` where it starts a payout path, otherwise `xct.offline.needs_connection`
  - SCR-SPD-01 [frozen wallet]: drafting and sending allowed; approval and payout are not (SPD-15)
  - SCR-SPD-01 [permission hidden]: no "Ask to spend" button without Wallet: initiate spend
  - SCR-SPD-02 [default]: single review screen; payee registered name shown if the provider returns one, otherwise "Name not checked"
  - SCR-SPD-02 [policy visible]: the policy for this amount is visible before the Send button
  - SCR-SPD-02 [send failed]: draft kept; says nothing was sent
  - SCR-SPD-03 [approvals]: status Awaiting approval; "Sent, waiting for [N] approvals"
  - SCR-SPD-03 [vote]: status Awaiting vote; "Sent, the group is voting"
  - SCR-SPD-04 [default]: payee options; phone numbers accepted in any common format and shown back normalised
  - SCR-SPD-04 [pay Gereo]: class (a) request with ledger class "Platform: SMS allowance"; no mobile-money payout; D1 and D4 apply; approval notices use the Gereo-paid sender
  - SCR-SPD-05 [shown]: another open or recent request with the same payee and amount
  - SCR-SPD-06 [shown]: payee marked "New payee"
  - SCR-SPD-07 [default]: names the missing permission and who to ask; enforced server-side
  - SCR-SPD-08 [too few approvers]: eligible approvers for this amount and band fewer than needed; sending blocked with "No money moved" and the next step named (ACC-07, SPD-02)
- Criteria map:
  - AC 1: SCR-SPD-01 [default]
  - AC 2: SCR-SPD-04 [default], [pay Gereo]; SCR-SPD-02 [default]; SCR-SPD-06 [shown]
  - AC 3: SCR-SPD-01 [balance], [over balance], [receive limit]
  - AC 4: SCR-SPD-02 [policy visible]; SCR-SPD-09 (policy panel, defined under SPD-02)
  - AC 5: SCR-SPD-02 [default]
  - AC 6: SCR-SPD-03 [approvals], [vote]; SCR-SPD-08 [too few approvers]
  - AC 7: SCR-SPD-05 [shown]; SCR-SPD-01 [draft]
  - AC 8: SCR-SPD-01 [draft], [offline]; SCR-SPD-02 [send failed]
  - AC 9: SCR-SPD-01 [permission hidden]; SCR-SPD-07 [default]
  - AC 10: no UI, system rule (audit `request.created` with every field; no ledger entry)
- Objects and fields: Expense request (reference, source wallet, payee, amount, fee estimate, purpose, note, attachment, project link, decision link, status, version); Wallet (balance, reserved); Membership; Notification; Audit entry (`request.created`).
- Open points:
  1. The review says "Name not checked" (and the open question says no payee name lookup exists), while WAL-10 uses "Name not available" and criterion 2 says the name is shown "when the provider returns one". Which string and rule applies?
  2. Criterion 7 says a Draft is saved "as a Draft at every field" (shared definitions: "Nobody else sees it"), while criterion 8 says the draft is a local draft on the device (XCT-05 Table B, never sent without a tap). Is a Draft a server status or only a local draft?
  3. The requester on the vote path needs the money-out tier before sending; the tier prompt appears "before sending" but the story does not say at which field (amount entry or Send).
  4. Does the "Pay Gereo" payee show a fee line and a separate review text (no mobile-money operator)? Not specified in the story.
  5. A payee who is also a member: does the review show the member's display name or the number? Not specified in the story.
  6. When a group wallet is under an operator hold ("Held by Gereo"), is "Ask to spend" shown? Not specified in the story (SPD-15 mentions the banner only).

---

### SPD-02 See the spending policy before sending

- Story: SPD-02 See the spending policy before sending
- Surfaces:
  - SCR-SPD-09 | Policy panel (`spd.policy.summary` with parameters: approvals needed, approvers hold Wallet: approve spend and are never the requester, vote instead of approvals, available balance; eligible approvers names and count; project purchase gate and remaining budget) | inline | person on the request form | SCR-SPD-01, SCR-SPD-02 | "Ask the group to vote first" opens VOT (SPD-09); link to ask people who can grant permissions (GRP-08)
  - SCR-SPD-10 | Spending rules page (read-only; who last changed and when; Rule when requested) | page | every member who can view the wallet (Wallet: view balance to read the policy page) | wallet "Spending rules" | edit link only for holders of Group: set spending policy (SCR-GRP-51)
  - SCR-SPD-11 | Form warnings ("vote path impossible", "approvals impossible") | inline | requester | SCR-SPD-01 | none
- States per surface:
  - SCR-SPD-09 [default]: one or two sentences with the live amount; a band that is off is not mentioned; crossing a threshold changes the text and highlights the change with a text note, not colour alone
  - SCR-SPD-09 [too few approvers]: "You need [N] more people who can approve spending"; Send button disabled; link to ask people who can grant permissions (GRP-08)
  - SCR-SPD-09 [vote offered]: vote path possible; also offers "Ask the group to vote first" (SPD-09)
  - SCR-SPD-09 [state notes]: wallet frozen (SPD-15), spending cap reached or amount left (SPD-14, RUL-09), amount above available balance; each says whether the person can still send and what to do
  - SCR-SPD-09 [project]: states the project purchase approval needed (SPD-13) and the project budget remaining
  - SCR-SPD-09 [offline]: cached policy with "Last synced hh:mm" and "The rule may have changed"
  - SCR-SPD-09 [policy changed at send]: server re-evaluates; new policy shown; person must confirm again before the request is created
  - SCR-SPD-09 [server disagrees]: server counts differ from cached counts at send; failure with "No money moved"
  - SCR-SPD-09 [language]: sentence is a key with parameters; tested at 200 percent expansion; amounts never clip
  - SCR-SPD-10 [default]: same rules for every member who can view the wallet; with who last changed them and when
  - SCR-SPD-10 [waiting request]: a waiting request shows "Rule when requested: 2 approvals"; the floor and D1 and D4 apply on top
  - SCR-SPD-11 [vote impossible]: fewer than three holders of Vote: vote exist (reuses the GRP-12 criterion 3 string)
  - SCR-SPD-11 [approvals impossible]: fewer than two holders of Wallet: approve spend exist
- Criteria map:
  - AC 1: SCR-SPD-09 [default]
  - AC 2: SCR-SPD-09 [default]
  - AC 3: no UI, system rule (floor owned by GRP-13 and VOT "Kinds of vote"; a group with no policy gets exactly that floor; applies to class (a); refunds are class (c))
  - AC 4: SCR-SPD-09 [too few approvers], [vote offered], [server disagrees]; SCR-SPD-11 [vote impossible], [approvals impossible]
  - AC 5: SCR-SPD-09 [project]
  - AC 6: SCR-SPD-09 [state notes]
  - AC 7: SCR-SPD-10 [default]
  - AC 8: SCR-SPD-09 [offline], [policy changed at send]
  - AC 9: SCR-SPD-09 [language]
  - AC 10: SCR-SPD-10 [waiting request]
- Objects and fields: Spending policy (`spd.spend_approvals_default`, `spd.spend_multi_threshold`, `spd.spend_approvals_multi`, `spd.spend_vote_threshold`); Wallet (available balance); Membership (eligible approvers); Permission.
- Open points:
  1. Criterion 4 lists eligible approvers by name and count, while GRP-12 criterion 3 and R185 show "approvers" and "voters able to be reached" as anonymous counts, hidden for groups under five members except the warning. Which applies on the request form?
  2. Criterion 7 says a read-only "Spending rules" page for members; GRP-12 defines the editable page SCR-GRP-51. Is it the same page with a permission variant, or two pages? Not specified.
  3. The `{N}` in "You need [N] more people" counts approvers by tier or by permission? Criterion 4 says eligible approvers include money-out capable only through ACC-07 elsewhere; not specified here.
  4. The "Ask the group to vote first" offer when only the vote path is possible but the requester lacks the money-out tier: shown or hidden? Not specified.

---

### SPD-03 Attach a receipt or a quote

- Story: SPD-03 Attach a receipt or a quote
- Surfaces:
  - SCR-SPD-12 | Attachment picker (choose Receipt or Quote; take a photo, pick from the gallery or pick a PDF) | sheet | requester with Wallet: initiate spend | "Add receipt or quote" on the form | pick; cancel
  - SCR-SPD-13 | Upload progress (progress bar, Cancel, Retry; size shown after compression; "Waiting to upload") | inline | requester | after picking | none
  - SCR-SPD-14 | Attachment viewer (thumbnail; full image on tap; zoom; alternative text) | page | requester; holders of Wallet: approve spend or Project: approve purchase on this request; member voters of its linked vote | thumbnail on SCR-SPD-18 | back
- States per surface:
  - SCR-SPD-12 [default]: Receipt or Quote; types limited by `ATTACHMENT_TYPES` (JPEG, PNG, PDF) and size by `ATTACHMENT_MAX_MB` (5 MB); app compresses photos on device and tells the size
  - SCR-SPD-12 [refused]: unsupported file or oversize; message says which limit failed and what to do ("Use a photo under X MB or take a new one"); draft kept
  - SCR-SPD-13 [uploading]: progress bar; Cancel and Retry; interrupted upload resumes where it stopped when connection returns
  - SCR-SPD-13 [waiting to upload]: offline on an unsent draft; attachment stays with the draft (XCT-05 Table B) shown as "Waiting to upload"; Send needs the upload complete
  - SCR-SPD-13 [proof on sent request]: a proof added to an already-sent request is an auto-send item (XCT-05 Table A) that sends itself when the app is open with signal
  - SCR-SPD-13 [required]: amount at or above `receipt_required_above`; attachment mandatory; Send explains which item is missing (`spd.request.attachment_required`)
  - SCR-SPD-14 [default]: thumbnail first; full image on tap; zoom; not cropped
  - SCR-SPD-14 [locked]: Approved request; attachments cannot be added or removed
  - SCR-SPD-14 [awaiting approval]: attachment change never voids or adds an approval; approvers who already approved are notified "A receipt was added" (`msg.spd.approval_attachment_added`, EV-SPD-18)
  - SCR-SPD-14 [privacy]: never shown to a guest voter, in the shared ledger or in exports
  - SCR-SPD-14 [accessibility]: text label (type and date) and an alternative text field
- Criteria map:
  - AC 1: SCR-SPD-12 [default]
  - AC 2: SCR-SPD-13 [uploading]
  - AC 3: SCR-SPD-13 [waiting to upload], [proof on sent request]
  - AC 4: SCR-SPD-13 [required]
  - AC 5: SCR-SPD-14 [default]
  - AC 6: SCR-SPD-14 [privacy]
  - AC 7: SCR-SPD-14 [awaiting approval], [locked]
  - AC 8: SCR-SPD-12 [refused]
  - AC 9: SCR-SPD-14 [accessibility]
- Objects and fields: Document (attachment: type Receipt or Quote, size, alternative text, upload state); Expense request; Audit entry.
- Open points:
  1. The limit on files per request is `ATTACHMENTS_PER_ITEM` (PRJ-07); the message shown when the limit is reached is not specified in this story.
  2. The gallery is allowed here (unlike ID photos in ACC-08); stated explicitly in criterion 1, no ambiguity; recorded for completeness.
  3. Retention of attachments after a request is deleted or a group closes follows `RECORD_RETENTION_YEARS` and ACC open question 1 (open); the interface text is not specified.
  4. Does an approver who opens the thumbnail on a data plan see the file size before loading? Criterion 5 says the thumbnail loads, not the full image; the size hint is not specified.

---

### SPD-04 Approval inbox

- Story: SPD-04 Approval inbox
- Surfaces:
  - SCR-SPD-15 | Approval inbox (tabs "Waiting for me", "I approved or rejected", "All requests I can see"; rows with requester, purpose, amount, source wallet, status chip, progress "1 of 2 approved", time waiting; oldest first) | page | holder of Wallet: approve spend (or Project: approve purchase for project requests) | "Approvals" and home | row opens SCR-SPD-18
  - SCR-SPD-16 | Waiting count badge (home and navigation) | inline | holder of the approving permission | home and navigation | opens SCR-SPD-15
  - SCR-SPD-17 | Approval notices `msg.spd.approval_needed` (`.push`, `.sms`; EV-SPD-01), `msg.spd.approval_reminder` (EV-SPD-02), batched summary | notification | approvers on the approvals path | request Awaiting approval | opens SCR-SPD-18
- States per surface:
  - SCR-SPD-15 [default]: three tabs; sorted oldest first
  - SCR-SPD-15 [changed]: a request voided by an edit reappears at the top of "Waiting for me" with a "Changed" chip and a note of what changed
  - SCR-SPD-15 [own request]: a request the person submitted appears only in "All" with a note that someone else must approve (SPD-08)
  - SCR-SPD-15 [awaiting vote]: appears in "All" and in the voters' own vote list, never in "Waiting for me"
  - SCR-SPD-15 [empty]: "Nothing is waiting for you" with a link to all requests
  - SCR-SPD-15 [loading]: skeleton rows, never an empty message
  - SCR-SPD-15 [offline]: cached inbox, request detail and receipts (last 50 for the active wallet) readable with "Updated hh:mm"; opening a detail shows the cached summary; Approve disabled with `xct.offline.money_blocked`, Reject disabled with `xct.offline.needs_connection`; neither queued; a request decided elsewhere shows its true status after sync
  - SCR-SPD-15 [accessibility]: row read as one sentence ("Rado asks 120 000 Ar for roof tiles, waiting two days, one of two approved")
  - SCR-SPD-16 [default]: count equals the number of rows in "Waiting for me"
  - SCR-SPD-17 [push then reminder]: `msg.spd.approval_needed` immediately by push; one reminder after `approval_reminder_after`
  - SCR-SPD-17 [sms]: unread after the NTF-05 wait; `msg.spd.approval_needed.sms` carries amount, requester, reference and link; approving never by SMS reply
  - SCR-SPD-17 [batched]: `ntf.batch_threshold` or more waiting gives one summary (NTF-08)
  - SCR-SPD-17 [quiet hours]: held until quiet hours end; `spd.request_expiry` paused while a notice is held
  - SCR-SPD-17 [vote path]: once a request goes to a vote, notices name no approvers
- Criteria map:
  - AC 1: SCR-SPD-15 [default]
  - AC 2: SCR-SPD-15 [changed], [own request], [awaiting vote]
  - AC 3: SCR-SPD-16 [default]
  - AC 4: SCR-SPD-17 [push then reminder], [sms], [vote path]
  - AC 5: SCR-SPD-17 [batched], [quiet hours]
  - AC 6: SCR-SPD-15 [empty], [loading]
  - AC 7: SCR-SPD-15 [offline]
  - AC 8: SCR-SPD-17 [push then reminder] (deep link to the exact request detail)
  - AC 9: SCR-SPD-15 [accessibility]
- Objects and fields: Expense request (status, progress, time waiting, requester, wallet, amount); Approval; Notification; Membership.
- Open points:
  1. A project request needs both gates; a Project: approve purchase holder who is not a Wallet: approve spend holder sees which requests in "Waiting for me" (only the project gate)? Not specified in the story.
  2. Does "All requests I can see" include requests the person cannot open (visibility rules of SPD-01)? Not specified in the story.
  3. The badge count on the "navigation" conflicts with no rule here (bottom bar identical for all, 09 rule); a badge on a fixed item is allowed, recorded for completeness.
  4. Is there a separate view for requests held by a freeze for approvers? Not specified in the story (SPD-15 mentions the inbox shows the frozen state).

---

### SPD-05 Approval detail and approve

- Story: SPD-05 Approval detail and approve
- Surfaces:
  - SCR-SPD-18 | Request detail (summary sentence `spd.approval.summary`, purpose, note, attachment thumbnail, payee name and masked number, operator, fee, total, project and budget line, linked decision or vote, applicable policy, approvals list, actions Approve, Reject, Edit, Cancel; vote panel; payout status; version history link) | page | requester; holders of Wallet: approve spend; members with Wallet: view history (limited fields) | inbox row, notification, project page, ledger entry | Approve opens SCR-SPD-19 or SCR-SPD-20; Reject opens SCR-SPD-23
  - SCR-SPD-19 | Approval pause (`spd.approval.pause`: "Did someone ask you to send this money?", "Cancel" primary, "Gereo will never ask for your PIN") | page | approver | first-time payee, name check fail, amount at or above `LARGE_AMOUNT_PAUSE`, or new device | continue opens SCR-SPD-20
  - SCR-SPD-20 | Approval PIN screen (repeats amount and payee) | page | approver | Approve or pause | recorded
  - SCR-SPD-21 | Approval progress notices `msg.spd.approval_progress` (EV-SPD-03, push, to the requester per approval) and `msg.spd.approved` (final) | notification | requester; other approvers (final only) | approval recorded | opens SCR-SPD-18
  - SCR-SPD-22 | Approval recording (approver, time, hash of what was shown, version, device; idempotent per approver and content) | system | none | correct PIN | none
- States per surface:
  - SCR-SPD-18 [default]: summary sentence "[Requester] asks to pay [amount] to [payee] from [wallet]. After payment the wallet holds [balance after]. [N of M] approved: [names]."; buttons "Approve [amount]" and "Reject" neither pre-selected; no "Approve all"
  - SCR-SPD-18 [recorded]: "You approved. [N of M] approved. [What happens next]" (`spd.approval.recorded`); the final approval changes status to Approved and starts the payout and says so
  - SCR-SPD-18 [insufficient balance]: blocked with the reason; no approval recorded
  - SCR-SPD-18 [tier below]: approver below the money-out tier for the amount; approval refused; `acc.tiers.limit_hit` shown through ACC-07
  - SCR-SPD-18 [changed since opened]: request edited, cancelled, rejected or already paid; approver sees the new state and the approve button is replaced by what changed; no approval recorded
  - SCR-SPD-18 [checking]: connection fails after the PIN; "Checking" and reload of real state; no duplicate approval
  - SCR-SPD-18 [offline]: Approve button shows `xct.offline.money_blocked`; online only, never queued
  - SCR-SPD-18 [requester view]: no Approve button for the requester (D1); cached requests never show Approve to the requester
  - SCR-SPD-18 [limited view]: members with Wallet: view history see amount, purpose, status, payee display name and approver names only
  - SCR-SPD-19 [default]: shown before the PIN
  - SCR-SPD-20 [default]: PIN repeats amount and payee
  - SCR-SPD-21 [progress]: requester gets one push per approval; other approvers are not notified except the final `msg.spd.approved`; only on the approvals path
  - SCR-SPD-22 [recorded]: approver counts once; approval by a person whose permission was revoked before execution does not count (re-checked in SPD-10)
- Criteria map:
  - AC 1: SCR-SPD-18 [default]
  - AC 2: SCR-SPD-18 [default]
  - AC 3: SCR-SPD-19 [default]
  - AC 4: SCR-SPD-20 [default]; SCR-SPD-22 [recorded]
  - AC 5: SCR-SPD-18 [recorded]
  - AC 6: SCR-SPD-22 [recorded]; SCR-SPD-18 [tier below]
  - AC 7: SCR-SPD-18 [insufficient balance]
  - AC 8: SCR-SPD-18 [changed since opened], [checking], [offline]
  - AC 9: SCR-SPD-21 [progress]
  - AC 10: no UI, system rule (audit `approval.recorded` with approver, time, request version, device; no ledger entry)
- Objects and fields: Expense request (status, version); Approval (approver, time, content hash, version, device); Wallet (balance, balance after); Project; Audit entry.
- Open points:
  1. Criterion 3 triggers the pause for "a payee that fails a name check", while SPD-01 closes that no payee name lookup exists. Does this trigger ever fire?
  2. After the vote path passes, which surface does the request detail show to voters (no approvers)? Defined in SPD-09; the detail page serves both, but the final-approval button label does not apply; not stated here.
  3. The "Changed" chip requires the approver to re-read what changed; where is the diff shown on this page (version history link)? Not specified in the story.
  4. Does the approver see the requester's identity-tier status (never, per GRP-08)? Not shown; confirmed by GRP-08, not restated here.

---

### SPD-06 Reject a request with a reason

- Story: SPD-06 Reject a request with a reason
- Surfaces:
  - SCR-SPD-23 | Reject screen (reason presets such as "Missing receipt", "Amount too high", "Not a group expense", "Wrong payee", "Other" plus optional short text; outcome choice "Ask to change" shown first and "Reject, closed"; neither pre-selected) | page | holder of Wallet: approve spend (or Project: approve purchase) | "Reject" in SCR-SPD-18 | confirm
  - SCR-SPD-24 | Rejection notices `msg.spd.rejected` (EV-SPD-05) and `msg.spd.needs_changes` (EV-SPD-17), push and in-app | notification | the requester | outcome saved | opens SCR-SPD-18
  - SCR-SPD-25 | Comment trail (approver name, time, reason) | inline | requester and other approvers | SCR-SPD-18 | none
- States per surface:
  - SCR-SPD-23 [default]: reason required; button names the action; outcome written in plain words
  - SCR-SPD-23 [already decided]: request changed or decided; sees the new state; no rejection recorded
  - SCR-SPD-23 [offline]: Reject disabled with `xct.offline.needs_connection`; not queued
  - SCR-SPD-24 [rejected]: reason and next step "Closed"; money never moved
  - SCR-SPD-24 [needs changes]: reason and "Edit and send again"
  - SCR-SPD-25 [default]: reason visible to requester and other approvers; other members who can view only see the status
  - SCR-SPD-18 [rejected view]: status Rejected; request cannot be approved or paid; a copy can be made and shows a link to the original and its reason; other approvers see "Rejected by [name]"
  - SCR-SPD-18 [needs changes view]: status Needs changes; no approvals count until the requester edits; other approvers see "[Name] asked for changes, with the reason"; not edited for `spd.request_expiry` closes as Cancelled (Expired), not Rejected
- Criteria map:
  - AC 1: SCR-SPD-23 [default]
  - AC 2: SCR-SPD-23 [default]
  - AC 3: SCR-SPD-18 [rejected view], [needs changes view]
  - AC 4: SCR-SPD-25 [default]
  - AC 5: SCR-SPD-24 [rejected], [needs changes]
  - AC 6: SCR-SPD-18 [rejected view]
  - AC 7: SCR-SPD-23 [already decided], [offline]
  - AC 8: no UI, system rule (audit `approval.rejected` with approver, time, reason, outcome; no ledger entry)
  - AC 9: SCR-SPD-23 [default] (preset reasons are keys in three languages; text field accepts three scripts and diacritics)
- Objects and fields: Expense request (status Rejected or Needs changes); Approval (rejection, reason code, outcome); Notification; Audit entry.
- Open points:
  1. Criterion 4 says the reason is shown to the requester and other approvers only; SPD-01 closes that rejection reasons are also visible to member voters and holders of Wallet: approve spend. Which audience is correct for member voters of a linked vote?
  2. A single "Reject, closed" by one approver ends a request that other approvers may want; no group setting (closed). No override UI is specified.
  3. How is the copy "from a Rejected request" started (button on the detail)? Criterion 6 says a copy can be made; the entry control is not specified.
  4. The preset list is "for example"; the final list and keys are not specified.

---

### SPD-07 Edit a request, earlier approvals are voided

- Story: SPD-07 Edit a request, earlier approvals are voided
- Surfaces:
  - SCR-SPD-26 | Edit warning (`spd.request.edit_warning`: "Changing this request will cancel the [N] approvals it already has. Approvers will need to approve again.") | modal | requester | "Edit" on a request that has approvals | confirm opens SCR-SPD-01 in edit mode
  - SCR-SPD-27 | Version history (each version, who changed what and when) | page | approvers and permission holders; the requester | link on SCR-SPD-18 | back
  - SCR-SPD-28 | "Changed" label (from and to values) | inline | approvers, inbox | SCR-SPD-18, SCR-SPD-15 | none
  - SCR-SPD-29 | Approvals voided notice `msg.spd.approvals_voided` (EV-SPD-06; push, SMS fallback) | notification | approvers who approved and all who can still approve; on a money vote, the voters | material edit saved | opens SCR-SPD-18
- States per surface:
  - SCR-SPD-26 [default]: confirmation required to continue; a request with no approvals edits without this warning
  - SCR-SPD-01 [edit mode]: material fields are source wallet, payee, amount, purpose, linked project or budget line, linked decision or vote; changing any voids all approvals; adding a note does not; attachment change on Awaiting approval never voids
  - SCR-SPD-01 [policy reevaluated]: new amount needs a vote or more approvals; requester sees this before saving
  - SCR-SPD-18 [after save]: status returns to Awaiting approval (or Awaiting vote if the amount reaches `spd.spend_vote_threshold`); approval count "0 of N"; "Changed" label states what changed
  - SCR-SPD-18 [vote cancelled]: a request that was Awaiting vote and falls below the vote threshold keeps its vote cancelled and goes to Awaiting approval unless the requester asked for the vote by hand
  - SCR-SPD-18 [approved waiting edit]: an Approved request waiting for payout (freeze or provider outage) returns to Awaiting approval or Awaiting vote; reserved funds released; applies to approvals and to a passed vote
  - SCR-SPD-18 [concurrent]: approver approves while the requester edits; approval recorded against the old version and voided on save; approver sees "Changed while you were approving"; nothing paid
  - SCR-SPD-18 [offline]: Edit read-only; `xct.offline.needs_connection`; not queued; inputs kept on error
  - SCR-SPD-27 [default]: old versions readable with who changed what and when
  - SCR-SPD-28 [default]: from and to values
  - SCR-SPD-29 [push], [sms]: changed fields listed
- Criteria map:
  - AC 1: SCR-SPD-26 [default]
  - AC 2: SCR-SPD-01 [edit mode]
  - AC 3: SCR-SPD-18 [after save], [vote cancelled]; SCR-SPD-28 [default]
  - AC 4: SCR-SPD-29 [push], [sms]; system rule (an open vote is cancelled and replaced per VOT-03 and SPD-09)
  - AC 5: SCR-SPD-01 [policy reevaluated]
  - AC 6: SCR-SPD-18 [approved waiting edit]
  - AC 7: SCR-SPD-27 [default]
  - AC 8: SCR-SPD-18 [concurrent]
  - AC 9: SCR-SPD-18 [offline]
  - AC 10: no UI, system rule (audit `request.edited` with version, before and after, voided approvals, who, when)
- Objects and fields: Expense request (versions, material fields); Approval (voided); Notification; Audit entry (`request.edited`).
- Open points:
  1. Version history is readable "for approvers and permission holders"; which permission holders (Wallet: view history, Wallet: approve spend)? Not specified in the story.
  2. A passed vote is voided by a material edit "in the same way"; the voters' view of a voided passed vote is not specified in this story (VOT-03 owns it).
  3. Does the requester see a diff before saving (from and to values) or only after? Criterion 3 shows "Changed" after saving; criterion 5 shows the policy effect before saving; the diff before saving is not specified.
  4. Can the requester of an Approved request in Paying edit? The preconditions exclude it; the message shown is not specified.

---

### SPD-08 Separation of duties

- Story: SPD-08 Separation of duties
- Surfaces:
  - SCR-SPD-30 | Self-blocked note (`spd.approval.self_blocked`: "You asked for this payment, so someone else must approve it") | inline | the requester who holds Wallet: approve spend | their own request detail | none
  - SCR-SPD-31 | Nudge action and notice (`msg.spd.approval_nudge`, EV-SPD-19; list of eligible approvers and who approved) | inline | requester | request detail | send nudge
  - SCR-SPD-32 | Separation enforcement (server rule; refused attempt logging) | system | none | approve attempt | none
- States per surface:
  - SCR-SPD-30 [default]: approve button absent for the requester; note explains why; server-enforced
  - SCR-SPD-30 [form]: group with only one approver who is also the requester; form shows "You need another person who can approve spending"; cannot send by approvals
  - SCR-SPD-31 [list]: requester sees eligible approvers and who approved (names)
  - SCR-SPD-31 [nudge limit]: maximum one nudge per approver per `approval_reminder_after`
  - SCR-SPD-32 [refused]: approve attempt against the rule; shows what rule applies, that money did not move and what to do next (ask another approver); no approval recorded; logged
  - SCR-SPD-32 [ineligible]: person who already approved cannot approve again; operator-console sessions never approvers; payee not excluded
  - SCR-SPD-32 [recheck]: approvals re-checked at execution; an approver who no longer qualifies no longer counts; request returns to Awaiting approval with the missing count
  - SCR-SPD-32 [self grant]: a permission holder cannot grant themselves Wallet: approve spend; granting needs another holder of Group: grant permission
- Criteria map:
  - AC 1: SCR-SPD-30 [default]
  - AC 2: SCR-SPD-32 [ineligible]
  - AC 3: SCR-SPD-30 [form]
  - AC 4: no UI, system rule (floor and ineligibility defined in GRP-13 AC1 and AC2)
  - AC 5: SCR-SPD-32 [recheck]
  - AC 6: SCR-SPD-31 [list], [nudge limit]
  - AC 7: SCR-SPD-32 [self grant]
  - AC 8: SCR-SPD-32 [refused]
  - AC 9: no UI, system rule (refused self-approval attempts logged with who, when, request)
- Objects and fields: Expense request; Approval (refusal); Membership; Permission; Audit entry.
- Open points:
  1. Criterion 6 shows the requester the names of eligible approvers; GRP-12 and R185 show anonymous counts on the policy screen. Which applies on the request detail for the requester?
  2. The nudge notification `msg.spd.approval_nudge` audience is each approver who has not approved; whether the nudge is shown on the approver's inbox row is not specified.
  3. Is the nudge control shown when only one approver is eligible and the band needs two (impossible)? Not specified.

---

### SPD-09 Link a vote to an expense

- Story: SPD-09 Link a vote to an expense
- Surfaces:
  - SCR-SPD-33 | Linked vote panel on the request (quorum progress, time left, count, link to the vote; vote result and who voted Yes as the authorisation) | inline | requester; approvers; member voters; members with view | SCR-SPD-18 | opens the vote (VOT-04)
  - SCR-SPD-34 | "Ask the group to vote first" action | inline | requester | request detail, policy panel | creates the linked vote
  - SCR-SPD-35 | Quorum-not-reached Needs attention (48 hours, "Quorum not reached", extend once through VOT-03 AC6) | inline | requester | vote ends below the floor | extend once
  - SCR-SPD-36 | Linked vote creation (question prefilled from the request, amount, payee, wallet, passing rule, quorum, deadline) | system | none | send at or above the vote threshold, or "Ask the group to vote first" | none
  - SCR-SPD-37 | Vote result notices `msg.vot.expense_passed`, `msg.vot.expense_failed` (owned by VOT) | notification | requester and voters | vote closes | opens SCR-SPD-18
- States per surface:
  - SCR-SPD-33 [open]: status Awaiting vote; no approver asked; question derived from the request and not editable by the requester
  - SCR-SPD-33 [passed]: quorum met, majority reached, floor met (evaluated at close only); result written to the decision log, Decision linked, payout starts after SPD-10 checks with no approvers; shows the vote result and who voted Yes
  - SCR-SPD-33 [failed]: request Rejected with a mapped reason ("The group did not approve" for Not passed (majority not reached) and Tie); counts and "You can propose it again"; no money moved
  - SCR-SPD-33 [cancelled vote]: a Cancelled vote is not a rejection; request cancelled gives "Withdrawn by the requester"
  - SCR-SPD-33 [edit replaces]: edit while a vote is open cancels the vote, tells voters, opens a replacement with a new deadline when required; earlier ballots do not carry over
  - SCR-SPD-33 [expiry excluded]: `spd.request_expiry` does not apply while Awaiting vote
  - SCR-SPD-33 [member voter view]: member voters see the essential facts and attachment, never private notes; a guest voter sees amount, purpose, payee display name and the passing rule, never attachments
  - SCR-SPD-33 [offline]: vote status readable from cache; casting is a VOT behaviour; creating the linked vote needs a connection
  - SCR-SPD-34 [available]: request in Draft, Awaiting approval, Needs changes or Awaiting vote and the vote path is available; a vote started by hand on a request in Awaiting approval sets its approvals aside (not reused)
  - SCR-SPD-34 [unavailable]: the GRP-13 and VOT "Kinds of vote" conditions fail; a money vote is unavailable and the approval band applies
  - SCR-SPD-35 [shown]: status Needs attention for 48 hours with "Quorum not reached"; only server-received ballots count; if not extended the request becomes Rejected with "Quorum not reached"; never a fall back to approvals
  - SCR-SPD-36 [created]: linked vote created at send when the policy requires one
- Criteria map:
  - AC 1: SCR-SPD-36 [created]; SCR-SPD-33 [open]
  - AC 2: SCR-SPD-33 [open]
  - AC 3: SCR-SPD-33 [passed]
  - AC 4: SCR-SPD-33 [failed]; SCR-SPD-35 [shown]; SCR-SPD-37 (results notices)
  - AC 5: SCR-SPD-33 [edit replaces]
  - AC 6: SCR-SPD-33 [cancelled vote]
  - AC 7: no UI beyond SCR-SPD-33 [passed], system rule (the payout re-runs every SPD-10 check; the floor is owned by GRP-13 and VOT "Kinds of vote")
  - AC 8: SCR-SPD-33 [member voter view]
  - AC 9: SCR-SPD-33 [offline]
  - AC 10: no UI, system rule (link between request, vote and decision recorded with times and people)
- Objects and fields: Expense request (status, vote link); Vote (question, quorum, majority, deadline, result); Decision (written on close); Notification; Audit entry.
- Open points:
  1. VOT-01 snaps or refuses a money vote deadline inside quiet hours (conventions 11.8); the requester's view of an adjusted deadline is not specified in this story.
  2. The request detail shows "who voted Yes as the authorisation", but R40 says money votes are Named ballots; whether members who voted No are shown is not specified.
  3. How does the requester start the single extension (button label) on a Needs attention request? Criterion 4 cites VOT-03 AC6; the control on this screen is not specified.
  4. Criterion 4 maps a Tie to "The group did not approve"; the mapping for "Not passed (floor not met)" (R191 item 2, departed voter) is not specified here.
  5. Is "Ask the group to vote first" shown to a requester below the money-out tier (vote path needs the requester's tier)? Not specified.

---

### SPD-10 Execute the payout through the payment adapter

- Story: SPD-10 Execute the payout through the payment adapter
- Surfaces:
  - SCR-SPD-38 | Payout execution (pre-dispatch checks in order; idempotent transaction; callbacks and polling; reversal) | system | none | last required approval recorded, or linked vote closes Passed | none
  - SCR-SPD-39 | Payout status (Paying then Paid; elapsed time; "Nothing to do, we will tell you" `spd.payout.pending`; Needs attention reasons) | inline | requester; approvers; members with Wallet: view history | SCR-SPD-18 | opens receipt SCR-SPD-70
  - SCR-SPD-40 | Reserved line ("Set aside, not sent", `spd.payout.reserved`) | inline | members who can view the wallet; WAL-03 Safe to spend | request authorised | none
  - SCR-SPD-41 | Payout notices `msg.spd.payout_sent`, `msg.spd.payout_confirmed` (EV-SPD-08; push; SMS receipt `.sms`) | notification | requester; approvers (once) | dispatched, confirmed | opens SCR-SPD-18
  - SCR-SPD-42 | Vote-authorised payout safeguards (held until quiet hours end; OPS-10 review hold: release or reject only) | system | none | passed vote payout | none
- States per surface:
  - SCR-SPD-38 [checks]: re-checks in order: version unchanged and authorisation not older than `spd.request_expiry`; approvals still eligible (a passed vote is not re-evaluated for voter eligibility); wallet not frozen or held; cap not exceeded in block or vote mode; project conditions; requester rule; tier of requester (vote path) or of every approver (approval path) still covers the amount; reservation still covers amount plus fee
  - SCR-SPD-38 [check failed]: nothing sent; request shows why with whether money moved (no); returns to Awaiting approval when approvals lack, or Needs attention for a hold, missing balance, cap, or limit change or downgrade; keeps the same vote or approvals and resumes after verification with no new vote; a vote-authorised payout is stopped only by balance, freeze or cap
  - SCR-SPD-38 [dispatch]: payout transaction with an idempotency key from request and version; Initiated, then Pending, then Confirmed or Failed; request shows Paying then Paid
  - SCR-SPD-38 [callbacks]: duplicate Confirmed does nothing; dispatched payout unanswered after `PAYOUT_PENDING_ALERT_MINUTES` becomes Needs attention; polls and reconciles; never resubmits a payout of unknown outcome
  - SCR-SPD-38 [gereo destination]: another Gereo user, a group wallet, another wallet of the group; no provider, no in-transit step, fee 0 Ar; one balanced entry; Paying to Paid at once; hop 0 of a chain; income for the receiving wallet so rules and splits run; D5 leftover line written
  - SCR-SPD-38 [payout blocked]: a passed vote that cannot lead to a payout uses the XCT status and a linked follow-up decision entry is written
  - SCR-SPD-39 [pending]: elapsed time, what Gereo is waiting for, `spd.payout.pending`
  - SCR-SPD-39 [confirmed]: receipt (SPD-16)
  - SCR-SPD-39 [offline]: status of a Paying request readable from cache with "Last synced hh:mm"; nothing payable or retryable offline
  - SCR-SPD-40 [reserved]: amount plus fee reserved from authorisation until the payout resolves; counted in WAL-03 "Safe to spend"
  - SCR-SPD-41 [requester]: `msg.spd.payout_sent` on dispatch; `msg.spd.payout_confirmed` push and SMS receipt with reference
  - SCR-SPD-41 [approvers]: `msg.spd.payout_confirmed` once; members nothing individually
  - SCR-SPD-42 [quiet hours]: payout authorised by a vote dispatched no earlier than the end of quiet hours; result notice released at the same moment
  - SCR-SPD-42 [review hold]: payee new to the group wallet and removing weak ballots would fail the vote or leave it below the floor; held for OPS-10 review; reason never shown to voters
- Criteria map:
  - AC 1: SCR-SPD-38 [checks], [check failed], [payout blocked]
  - AC 2: SCR-SPD-38 [dispatch]
  - AC 3: SCR-SPD-40 [reserved]
  - AC 4: no UI beyond SCR-SPD-02 (fee shown before approval), system rule (real provider fee for the payee's network; wallet pays the fee; payee receives full amount; Fee ledger line; fee fixed at authorisation)
  - AC 5: SCR-SPD-38 [callbacks]
  - AC 6: SCR-SPD-39 [pending], [confirmed], [offline]
  - AC 7: no UI, system rule (ledger: amount and fee to in-transit as separate lines at dispatch; atomic posting to the provider account on Confirmed; one reversing entry on Failed or Cancelled; entries carry request reference, approvers or vote and voters, version, decision link)
  - AC 8: SCR-SPD-41 [requester], [approvers]
  - AC 9: no UI, system rule (audit of dispatch, status changes and source, idempotency key, provider reference)
  - AC 10: SCR-SPD-38 [gereo destination]
  - AC 11: SCR-SPD-42 [quiet hours], [review hold]
- Objects and fields: Expense request (status); Transaction (idempotency key, status); Ledger entry (in-transit, Fee, reversal); Approval and Vote (read); Wallet (reserved); Notification; Audit entry.
- Open points:
  1. Criterion 8 says "Approvers receive `msg.spd.payout_confirmed` once"; on the vote path there are no approvers. Who receives the confirmation after a vote-authorised payout (the requester only, or voters)? Not specified.
  2. When a vote-authorised payout is held until the end of quiet hours, what status and text does the request show to the requester ("Approved" with a hold reason)? Not specified in the story.
  3. The OPS-10 review hold reason is never shown to voters; what is the requester shown while a payout is held for review? Not specified.
  4. The money-states stage names and the screen word for Stage 1 versus Stage 2 are both "Set aside, not sent" (conventions 10.4); no state distinguishes them on the page, by design.
  5. `PAYOUT_PENDING_ALERT_MINUTES` and `PAYOUT_PROVIDER_WAIT_MAX` values are owned by OPS-13 and WAL (proposals only).

---

### SPD-11 Payout failure, delay and provider outage

- Story: SPD-11 Payout failure, delay and provider outage
- Surfaces:
  - SCR-SPD-43 | Payout failure panel (reason `spd.payout.failed.<reason>`; "Not taken from the wallet" or "Taken, refund in progress, reference X"; actions "Try again", "Edit the amount", "Edit the payee", "Cancel", "Report this payment") | inline | requester; holders of Wallet: approve spend (Try again) | SCR-SPD-18 | Try again; report (SCR-WAL-52)
  - SCR-SPD-44 | Payout failed notices `msg.spd.payout_failed` (`.push`, `.sms`; EV-SPD-09) | notification | requester and approvers | payout failed | opens SCR-SPD-18
- States per surface:
  - SCR-SPD-43 [queued]: provider unavailable before acceptance; request stays Approved, no transaction, no ledger entry; "Set aside, not sent"; retries spaced and capped by OPS-13; once accepted a Pending transaction with sub-label "Waiting for the provider"; waits up to `PAYOUT_PROVIDER_WAIT_MAX`, then Needs attention; an OPS-08 incident banner may explain
  - SCR-SPD-43 [failed]: plain reason (payee number not valid, payee wallet limit exceeded, insufficient provider funds, declined, provider error) and whether money moved
  - SCR-SPD-43 [reversal]: failed payout writes a reversing entry returning amount and fee; reservation released only when the reversal is posted
  - SCR-SPD-43 [transient]: "Try again" to requester and holders of Wallet: approve spend with the same authorisation while unchanged (new idempotency attempt number)
  - SCR-SPD-43 [payee problem]: edit of the payee required; voids approvals (SPD-07)
  - SCR-SPD-43 [limit problem]: "Edit the amount" or "Cancel"
  - SCR-SPD-43 [unknown outcome]: Needs attention with "We are checking with the provider. Do not pay again" and reference; retry blocked until known; operator alerted
  - SCR-SPD-43 [offline]: status and reference readable from cache; Try again disabled with `xct.offline.money_blocked`
  - SCR-SPD-44 [push], [sms]: reference included; under 160 GSM-7 characters; delayed notice is EV-WAL-08 (not this story)
- Criteria map:
  - AC 1: SCR-SPD-43 [queued]
  - AC 2: SCR-SPD-43 [failed]
  - AC 3: SCR-SPD-43 [reversal]
  - AC 4: SCR-SPD-43 [transient], [payee problem], [limit problem]
  - AC 5: SCR-SPD-43 [unknown outcome]
  - AC 6: SCR-SPD-43 [failed] ("Report this payment", WAL-14, pre-fills reference and request)
  - AC 7: SCR-SPD-44 [push], [sms]
  - AC 8: SCR-SPD-43 [offline]
  - AC 9: no UI, system rule (audit of each failure, retry attempt, operator action and final outcome)
- Objects and fields: Transaction; Ledger entry (reversal); Expense request (status Failed, Needs attention); Support ticket; Notification; Audit entry.
- Open points:
  1. `msg.spd.payout_failed` goes "to the requester and to approvers"; on the vote path there are no approvers. Who is told (voters)? Not specified.
  2. The criterion 2 reason list includes "insufficient provider funds"; whether the requester sees provider-side wording (never the provider name) is not specified.
  3. Where does the requester see the OPS-08 incident banner relative to the request detail? Not specified in the story.
  4. A "Try again" by a holder of Wallet: approve spend who is not the requester: does it need a PIN? Not specified in the story.

---

### SPD-12 Cancel a request

- Story: SPD-12 Cancel a request
- Surfaces:
  - SCR-SPD-45 | Cancel confirmation ("Nothing will be paid"; effects: approvals dropped (count), linked vote closed, reserved amount released; "Cancel request" and "Keep it"; reason field for a holder cancelling another person's request) | modal | requester; holder of Wallet: approve spend | "Cancel request" on SCR-SPD-18 | confirm
  - SCR-SPD-46 | Cancel and expiry notices `msg.spd.cancelled` (EV-SPD-20, push, no SMS) and `msg.spd.expired` (EV-SPD-11) | notification | waiting approvers; the requester | cancelled or 7 days before expiry | opens SCR-SPD-18
  - SCR-SPD-47 | Expiry job (`spd.request_expiry` 30 days from the last change) | system | none | daily | none
- States per surface:
  - SCR-SPD-45 [default]: effects listed; button "Cancel request"
  - SCR-SPD-45 [by another holder]: reason required; the requester is told who and why
  - SCR-SPD-45 [too late]: Paying, Paid or Failed with money in transit; Cancel not shown; explains a sent payout cannot be cancelled in Gereo; points to SPD-11 or support
  - SCR-SPD-45 [race]: last approval or dispatch at the same instant; server decides; "Already sent, cannot cancel" with a link
  - SCR-SPD-45 [offline]: Cancel of a request visible to others is online only; disabled with `xct.offline.needs_connection`; a Draft never sent is a local draft (Table B) and can be deleted offline
  - SCR-SPD-18 [cancelled]: status Cancelled; closed vote "Withdrawn by the requester"; reserved amount released; approvals voided; removed from approvers' inboxes; stays visible in history with who and why; can be copied
  - SCR-SPD-46 [cancelled push]: waiting approvers and the requester notified; reason to the requester if someone else cancelled
  - SCR-SPD-46 [expiry warning]: one warning to the requester seven days before expiry
  - SCR-SPD-47 [expired]: request with no decision, or authorised but not sent, for `spd.request_expiry` cancelled as "Expired"; not Awaiting vote; reservation released; approvals voided; audited `request.expired`
- Criteria map:
  - AC 1: SCR-SPD-45 [default]
  - AC 2: SCR-SPD-45 [default], [by another holder]
  - AC 3: SCR-SPD-45 [too late]
  - AC 4: SCR-SPD-18 [cancelled]
  - AC 5: SCR-SPD-46 [cancelled push]
  - AC 6: SCR-SPD-45 [race]
  - AC 7: SCR-SPD-45 [offline]
  - AC 8: SCR-SPD-18 [cancelled]
  - AC 9: no UI, system rule (audit `request.cancelled` with who, when, reason, state; reservation release logged)
  - AC 10: SCR-SPD-46 [expiry warning]; SCR-SPD-47 [expired]
- Objects and fields: Expense request (status Cancelled, Expired); Approval (voided); Vote (closed); Wallet (reservation released); Notification; Audit entry.
- Open points:
  1. Criterion 10 gives the seven-day warning as "EV-SPD-11, `msg.spd.expired`", the same key name as the expiry itself. Is `msg.spd.expired` the warning, the expiry notice, or both with different parameters?
  2. Does a Needs attention request (held by freeze) expire after `spd.request_expiry`? Criterion 10 says "no decision, or authorised but not sent"; held requests are authorised but not sent, so yes, but the freeze pause rule is not stated.
  3. The expiry clock "from the last change" while a notice is held (R185: paused while a notice is held) is not restated here.
  4. A holder cancelling another person's request is the approver who may also have approved; no restriction stated.

---

### SPD-13 Project and decision links

- Story: SPD-13 Project and decision links
- Surfaces:
  - SCR-SPD-48 | Project link section on the form (prefilled linked wallet, budget line, "Budget 2 000 000 Ar, spent 750 000 Ar, left 1 250 000 Ar" and bar; Over budget warning) | inline | requester | request started from a project or project added on the form | none
  - SCR-SPD-49 | Project gates on the detail (`spd.approval.project_gates`: money gate and purchase gate; "Waiting for a project approver") | inline | requester; approvers; holders of Project: approve purchase | SCR-SPD-18 | none
  - SCR-SPD-50 | Decision link picker (existing decision from the decision log, including one recorded outside the app; optional campaign link) | sheet | requester | decision field | pick
  - SCR-SPD-51 | Convert to authority vote (stuck-request escape after `request_stuck_days`) | modal | requester | request waiting in an approver wait | confirm; approvals void
  - SCR-SPD-52 | Detached Draft banner ("This request was part of a closed project") | inline | requester | Draft of a project that closed | submit or delete
  - SCR-SPD-53 | Decision and ledger links (`spd.request.decision_link`: "money moved: 300 000 Ar, entry reference"; "authorised by decision, vote result") | inline | members who can see the decision and entry | decision, ledger entry, request | opens target
- States per surface:
  - SCR-SPD-48 [default]: remaining budget sentence and bar (PRJ-03 for figures)
  - SCR-SPD-48 [over budget]: "Over budget by X" on the form and approval detail; held for approval or vote like any request; warning uses amount plus estimated fee; approval thresholds stay fee-free
  - SCR-SPD-48 [closed project]: request refused with "This project is closed"; person can ask from the wallet instead
  - SCR-SPD-49 [both gates]: approvals of the band from holders of Wallet: approve spend, plus one approval from a holder of Project: approve purchase; neither gate met by the requester; one person holding both meets both with one approval but the band's distinct people count still applies
  - SCR-SPD-49 [no gate holder]: "Waiting for a project approver"; a person without Project: approve purchase cannot supply it; if nobody holds it, the panel says so and who can grant it (GRP-08, PRJ-06)
  - SCR-SPD-49 [vote]: above the vote threshold the vote replaces both gates; a passed vote authorises alone
  - SCR-SPD-50 [default]: a linked earlier decision or campaign is information only and never replaces approvals or the vote
  - SCR-SPD-50 [required]: `project_spend_requires_decision` on; Send blocked without a decision with a clear reason
  - SCR-SPD-51 [available]: after `request_stuck_days` (default 7) in "Waiting for a project approver" or any approver wait; convertible to an authority vote if three holders of Vote: vote exist; approvals so far void; audit logs the conversion
  - SCR-SPD-52 [detached]: project closed; Draft becomes an ordinary wallet request (project link and budget line removed, normal approval path, D1 holds); not re-attached if the project reopens
  - SCR-SPD-52 [deleted]: Draft whose requester left (GRP-16) or was removed (GRP-17) is deleted
  - SCR-SPD-53 [after payment]: from the decision "money moved"; from the entry "authorised by decision, vote result"
  - SCR-SPD-18 [project timeline]: project page timeline shows the request with status and amount at each step (requested, approved, paid); project spend to date updates only on Confirmed payout
  - SCR-SPD-18 [project unavailable]: budget line removed or linked wallet unavailable (PRJ-03 criterion 6); open requests return to Needs attention with a reason; paid ones keep their link
  - SCR-SPD-18 [project offline]: project and decision links readable from cache; sending online only
- Criteria map:
  - AC 1: SCR-SPD-48 [default], [over budget], [closed project]
  - AC 2: SCR-SPD-49 [both gates], [vote]
  - AC 3: SCR-SPD-49 [no gate holder]
  - AC 4: SCR-SPD-50 [default], [required]
  - AC 5: SCR-SPD-53 [after payment]
  - AC 6: SCR-SPD-18 [project timeline]
  - AC 7: SCR-SPD-52 [detached], [deleted]; SCR-SPD-18 [project unavailable]
  - AC 8: SCR-SPD-18 [project offline]
  - AC 9: no UI, system rule (link, unlink and permission gate approvals each audited with who and when)
  - AC 10: SCR-SPD-51 [available]
- Objects and fields: Expense request (project link, budget line, decision link, campaign link); Project (budget, spent, status); Decision; Approval (gate kind); Ledger entry; Audit entry.
- Open points:
  1. Criterion 10 uses `request_stuck_days` (conventions Table B lists it as `spd.request_stuck_days`) but the SPD parameter table of this story does not define it. Which name and owner apply, and is it edited on GRP-12?
  2. The "Waiting for a project approver" state counts toward the stuck days; does the state also show for a project request where the band's approvals are still missing? Not specified.
  3. The convert-to-vote action needs three holders of Vote: vote; what the requester sees when fewer than three exist? Not specified.
  4. The over-budget warning uses amount plus estimated fee while approval thresholds stay fee-free; the warning text for fee-inclusive figures is not specified.
  5. Is the campaign link visible to approvers or only stored? Not specified.

---

### SPD-14 Spending cap

- Story: SPD-14 Spending cap
- Surfaces:
  - SCR-SPD-54 | Cap line and bar ("This month's limit: 500 000 Ar. Spent or promised: 320 000 Ar. Left: 180 000 Ar") | inline | members who can view the wallet; requester; approvers | wallet card, request form, request detail | none
  - SCR-SPD-55 | Cap block message ("The monthly limit would be exceeded. Nothing was paid" with next steps) | inline | requester; approvers | block mode, send or execution | smaller amount, wait, or a vote to change the cap
  - SCR-SPD-56 | Cap blocked notice `msg.spd.cap_blocked` (push) | notification | requester | request stopped by the cap | opens SCR-SPD-18
  - SCR-SPD-57 | Cap enforcement (`spd.spend_cap_mode`: warn, block, vote) | system | none | request created, authorised or about to be paid | none
- States per surface:
  - SCR-SPD-54 [default]: "Spent or promised" is its own labelled line (Confirmed payouts plus amounts reserved inside the period); RUL-09 counter shows Confirmed money-out only; intra-group moves counted in neither
  - SCR-SPD-54 [warning]: at `CAP_WARNING_PERCENT` and when a request would take the cap over, the requester sees the effect before sending and approvers in the detail
  - SCR-SPD-54 [two caps]: a cap on a project and on its wallet can coexist; a request must satisfy both; the stricter message shown
  - SCR-SPD-54 [offline]: readable from cache with "Last synced hh:mm"; enforcement on the server
  - SCR-SPD-54 [period]: period and reset follow RUL-09 (Madagascar time, `CAP_PERIOD_OPTIONS`); the reset is visible in the cap line and writes no ledger entry
  - SCR-SPD-55 [block]: a request above the amount left cannot be sent; a payout that would exceed the cap at execution is stopped (SPD-10 check)
  - SCR-SPD-56 [push]: suppressed when `msg.rul.cap_reached` was raised for the same request within the batch window
  - SCR-SPD-57 [block mode]: request stopped
  - SCR-SPD-57 [vote mode]: request above the amount left goes to a vote; if it passes the payout proceeds even though over the cap and the ledger entry names the vote; when eligible voters other than the requester number fewer than two, the vote is unavailable and the approval band applies
  - SCR-SPD-57 [warn mode]: default; request goes ahead with a visible warning; overage flagged on the request
  - SCR-SPD-57 [change]: changing or removing a cap follows RUL-13 and GRP-12; tightening at once; loosening is a loosening proposal; applies to future requests only
- Criteria map:
  - AC 1: SCR-SPD-54 [default]
  - AC 2: SCR-SPD-54 [warning]
  - AC 3: SCR-SPD-55 [block]; SCR-SPD-57 [block mode]
  - AC 4: SCR-SPD-57 [vote mode], [warn mode]
  - AC 5: SCR-SPD-54 [period], [two caps]
  - AC 6: SCR-SPD-57 [change]
  - AC 7: SCR-SPD-56 [push]
  - AC 8: SCR-SPD-54 [offline]
  - AC 9: no UI, system rule (audit each time the cap blocked, sent to a vote or flagged a request, with request, amounts and period)
- Objects and fields: Wallet rule (cap, `spd.spend_cap_mode`); Expense request; Ledger entry (read); Notification; Audit entry.
- Open points:
  1. Who sees the cap line (all members with Wallet: view balance, or only requester and approvers)? Not specified in the story.
  2. The next step "a vote to change the cap" needs a vote entry; how the requester starts it from the block message is not specified.
  3. Cap period boundaries and warning level come from RUL-09 (`CAP_WARNING_PERCENT` 80 percent is a hypothesis).
  4. In vote mode with fewer than two eligible voters, the approval band applies; the screen text is not specified.

---

### SPD-15 Emergency freeze of outgoing money

- Story: SPD-15 Emergency freeze of outgoing money
- Surfaces:
  - SCR-SPD-58 | Freeze confirmation (what stops, what continues, required short reason with presets "Suspected fraud", "Lost phone", "Dispute", "Other") | page | holder of Wallet: freeze (online; any authenticated session including a fresh device login with OTP; a Locked account cannot freeze) | "Freeze outgoing money" on a group wallet | confirm
  - SCR-SPD-59 | Wallet frozen banner (`spd.freeze.banner`: who froze, when, why for permission holders) | inline | members who can view the wallet | wallet detail, policy panel, inbox | opens SCR-SPD-60 for approvers
  - SCR-SPD-60 | Lift screen ("1 of 2 approved to lift", PIN per approver; vote route) | page | holders of Wallet: approve spend; holder of Wallet: freeze applies a vote-authorised lift | banner action | approve or apply
  - SCR-SPD-61 | "Held by Gereo" banner (reference and support route, never the reason) | inline | members of the group | operator hold (OPS-10, WAL) | OPS-06 support
  - SCR-SPD-62 | Freeze notices `msg.spd.freeze_applied` (`.push`, `.sms` Critical), `msg.spd.freeze_lifted` | notification | all members who can view the wallet (push); holders of Wallet: freeze or Wallet: approve spend other than the person who froze (SMS) | freeze applied, lifted | opens SCR-SPD-59
  - SCR-SPD-63 | Freeze enforcement and cycle flag | system | none | freeze, lift | none
- States per surface:
  - SCR-SPD-58 [default]: lists what stops (payouts, refunds, new approvals, withdrawals, manual transfers out including to other wallets of the same group, rule firings whose destination is outside the group held in the source wallet with a visible reason) and what continues (money in, contributions, viewing, internal firings, the Rounding line to Gereo)
  - SCR-SPD-58 [offline]: freeze needs a connection; not queued; banner and state readable from cache
  - SCR-SPD-58 [blocked]: Locked account cannot freeze; wallet already frozen; not a group wallet
  - SCR-SPD-59 [frozen]: "Wallet frozen"; undispatched payouts held (request Needs attention "Held by freeze"); payouts already with the provider continue and the screen says so
  - SCR-SPD-59 [requests]: new requests can be drafted and sent but not approved or paid; edits and cancellations remain possible; policy panel and inbox show the frozen state
  - SCR-SPD-60 [lift by approvals]: `spd.freeze_lift_approvals` (2, never fewer) distinct holders of Wallet: approve spend each enter their PIN; the person who froze may be one but never the only one
  - SCR-SPD-60 [lift by vote]: fewer than two approvers; authority vote with proposal reference (VOT-01, VOT-03); a holder of Wallet: freeze applies the lift citing the decision ID within `change_apply_window_days`; a passed vote not applied expires; operators cannot lift
  - SCR-SPD-60 [lifted]: held requests return to Approved or Awaiting approval and are re-checked (SPD-10); a request edited during the freeze keeps normal rules
  - SCR-SPD-61 [held]: operator hold stops all money-out including every split leg and the Rounding line; group cannot lift
  - SCR-SPD-62 [sms cap]: freeze SMS limited by `ntf.critical_freeze_sms_per_day` per wallet; beyond that push and in-app only
  - SCR-SPD-62 [critical]: freeze SMS is Critical, platform-paid, not held by quiet hours
  - SCR-SPD-63 [cycles]: more than `spd.freeze_cycle_limit` freeze and lift cycles in 24 hours flagged to the group and an operator (OPS-10); a further freeze still works
- Criteria map:
  - AC 1: SCR-SPD-58 [default]
  - AC 2: SCR-SPD-59 [frozen]
  - AC 3: SCR-SPD-59 [requests]
  - AC 4: SCR-SPD-62 [critical], [sms cap]; SCR-SPD-62 (push to all members who can view)
  - AC 5: SCR-SPD-60 [lift by approvals], [lift by vote]
  - AC 6: SCR-SPD-60 [lifted]
  - AC 7: SCR-SPD-61 [held]
  - AC 8: SCR-SPD-58 [offline]
  - AC 9: SCR-SPD-63 [cycles]; no UI otherwise (freezing and lifting write no ledger entry; audit with who, when, reason, held requests)
- Objects and fields: Wallet (state frozen); Expense request (status Needs attention "Held by freeze"); Approval (lift); Notification; Audit entry.
- Open points:
  1. Criterion 5 says a holder of Wallet: freeze "applies the lift" on the vote path only; who completes a lift by approvals (automatic on the second approval, or an apply step)? Not specified in the story.
  2. Freeze is allowed from any authenticated session; does the freeze confirmation ask for a PIN? Conventions say no PIN to grant the permission; the story does not say whether the freeze action itself asks for it. Not specified.
  3. The freeze notice push goes to "all members who can view the wallet", including holders of the permission who froze; the person who froze receives which confirmation? Not specified.
  4. `ntf.critical_freeze_sms_per_day` value is owned by NTF-09.
  5. Presets list is "such as"; the full list and keys are not specified.

---

### SPD-16 Receipts, ledger entries and audit trail of a request

- Story: SPD-16 Receipts, ledger entries and audit trail of a request
- Surfaces:
  - SCR-SPD-70 | Payout receipt (`spd.payout.receipt`: amount, fee, total, payee name and masked number, source wallet, date and time, status Confirmed, copyable reference, approvers or vote result with names of Yes voters, project and decision; "Share receipt") | page | Wallet: view history (ledger and receipt) | payout Confirmed, ledger entry | share; back
  - SCR-SPD-71 | Expense ledger entries (Expense, Fee, Reversal rows with request reference, version, approvers or vote and voters, decision link, payout reference; "Reversed" chip) | inline | Wallet: view history | group ledger | one tap opens SCR-SPD-18
  - SCR-SPD-72 | Request audit trail (timeline: created, edited with versions, approvals, rejections with reason, votes, freeze holds, payout statuses, cancel) | page | members with Wallet: view history (limited); holders of Group: view audit log (GRP-11 read); Gereo operators (OPS-09, read with reason) | request detail | back
  - SCR-SPD-73 | Spending list empty state (what spending requests are; "Ask to spend" if permitted) | inline | member | wallet spending list | opens SCR-SPD-01
  - SCR-SPD-74 | Expense export rows (follows CON-18 and WAL-16) | system | holder of Wallet: export history | export | none
- States per surface:
  - SCR-SPD-70 [default]: split rounding line never part of this receipt (belongs to the split receipt, CON-16); "Share receipt" produces an image or text that hides the payee's number
  - SCR-SPD-71 [default]: Expense (wallet to in-transit or to payee) and Fee as own line; Expense only for group spending; a person's own withdrawal is Cash-out
  - SCR-SPD-71 [reversed]: "Reversed" chip and reason; originals untouched
  - SCR-SPD-71 [tap]: opens request summary, approvals list, vote and decision, attachment only for those who may see it; no attachments or private notes in the shared ledger or exports
  - SCR-SPD-72 [default]: timeline items read as sentences with weekday and time; append-only; who, when, what changed
  - SCR-SPD-72 [visibility]: attachments, notes and reasons only follow SPD-03 and SPD-06 rules
  - SCR-SPD-73 [empty]: new wallet with no spending
  - SCR-SPD-73 [loading]: skeletons, never "No records"
  - SCR-SPD-70 [offline]: cached inbox, request detail and receipts (last 50 for the active wallet) readable with "Updated hh:mm"; a cached request never shows Approve to its requester (D1); export needs a connection
  - SCR-SPD-74 [export]: expense rows, approver or voter names and references; writes an audit entry
  - SCR-SPD-72 [operator]: operators read trails for support and compliance, cannot change; reads logged and need a reason
- Criteria map:
  - AC 1: SCR-SPD-70 [default]
  - AC 2: SCR-SPD-71 [default], [reversed]
  - AC 3: SCR-SPD-71 [tap]
  - AC 4: SCR-SPD-72 [default]
  - AC 5: SCR-SPD-72 [visibility]
  - AC 6: SCR-SPD-73 [empty], [loading]
  - AC 7: SCR-SPD-70 [offline]
  - AC 8: SCR-SPD-74 [export]
  - AC 9: SCR-SPD-72 [operator]
  - AC 10: SCR-SPD-72 [default] (sentences, weekday and time, amounts never clip at 200 percent)
- Objects and fields: Expense request; Approval; Ledger entry (Expense, Fee, Reversal); Transaction; Decision; Document (restricted); Audit entry.
- Open points:
  1. "Share receipt" produces an image or text; WAL-14 closes that the shared receipt is a PDF and plain text, not an image. Which applies to a payout receipt?
  2. A receipt hides the payee's number when shared; the on-screen receipt shows the masked number. Both show masked; the full number is never shown. Not an ambiguity; recorded for completeness.
  3. The receipt for a vote-authorised payout lists "names of those who voted Yes"; no field for No voters. Whether members who voted No are shown is not specified.
  4. Retention of the audit trail and receipts depends on ACC open question 1 (open); no on-screen retention text is specified.
  5. The same trail is read by GRP-11 without copying; whether a member sees the same trail in the group audit log and in the request is not further specified.

---

## Epic summary

- Stories: 16.
- Distinct surfaces: 68. By kind:
  - page: 15
  - sheet: 3
  - modal: 3
  - inline: 27
  - notification: 10
  - system: 10
- State lines: 191.
- Open points: 70. Full list:
  - SPD-01.1: The review says "Name not checked" (and the open question says no payee name lookup exists), while WAL-10 uses "Name not available" and criterion 2 says the name is shown "when the provider returns one". Which string and rule applies?
  - SPD-01.2: Criterion 7 says a Draft is saved "as a Draft at every field" (shared definitions: "Nobody else sees it"), while criterion 8 says the draft is a local draft on the device (XCT-05 Table B, never sent without a tap). Is a Draft a server status or only a local draft?
  - SPD-01.3: The requester on the vote path needs the money-out tier before sending; the tier prompt appears "before sending" but the story does not say at which field (amount entry or Send).
  - SPD-01.4: Does the "Pay Gereo" payee show a fee line and a separate review text (no mobile-money operator)? Not specified in the story.
  - SPD-01.5: A payee who is also a member: does the review show the member's display name or the number? Not specified in the story.
  - SPD-01.6: When a group wallet is under an operator hold ("Held by Gereo"), is "Ask to spend" shown? Not specified in the story (SPD-15 mentions the banner only).
  - SPD-02.1: Criterion 4 lists eligible approvers by name and count, while GRP-12 criterion 3 and R185 show "approvers" and "voters able to be reached" as anonymous counts, hidden for groups under five members except the warning. Which applies on the request form?
  - SPD-02.2: Criterion 7 says a read-only "Spending rules" page for members; GRP-12 defines the editable page SCR-GRP-51. Is it the same page with a permission variant, or two pages? Not specified.
  - SPD-02.3: The `{N}` in "You need [N] more people" counts approvers by tier or by permission? Criterion 4 says eligible approvers include money-out capable only through ACC-07 elsewhere; not specified here.
  - SPD-02.4: The "Ask the group to vote first" offer when only the vote path is possible but the requester lacks the money-out tier: shown or hidden? Not specified.
  - SPD-03.1: The limit on files per request is `ATTACHMENTS_PER_ITEM` (PRJ-07); the message shown when the limit is reached is not specified in this story.
  - SPD-03.2: The gallery is allowed here (unlike ID photos in ACC-08); stated explicitly in criterion 1, no ambiguity; recorded for completeness.
  - SPD-03.3: Retention of attachments after a request is deleted or a group closes follows `RECORD_RETENTION_YEARS` and ACC open question 1 (open); the interface text is not specified.
  - SPD-03.4: Does an approver who opens the thumbnail on a data plan see the file size before loading? Criterion 5 says the thumbnail loads, not the full image; the size hint is not specified.
  - SPD-04.1: A project request needs both gates; a Project: approve purchase holder who is not a Wallet: approve spend holder sees which requests in "Waiting for me" (only the project gate)? Not specified in the story.
  - SPD-04.2: Does "All requests I can see" include requests the person cannot open (visibility rules of SPD-01)? Not specified in the story.
  - SPD-04.3: The badge count on the "navigation" conflicts with no rule here (bottom bar identical for all, 09 rule); a badge on a fixed item is allowed, recorded for completeness.
  - SPD-04.4: Is there a separate view for requests held by a freeze for approvers? Not specified in the story (SPD-15 mentions the inbox shows the frozen state).
  - SPD-05.1: Criterion 3 triggers the pause for "a payee that fails a name check", while SPD-01 closes that no payee name lookup exists. Does this trigger ever fire?
  - SPD-05.2: After the vote path passes, which surface does the request detail show to voters (no approvers)? Defined in SPD-09; the detail page serves both, but the final-approval button label does not apply; not stated here.
  - SPD-05.3: The "Changed" chip requires the approver to re-read what changed; where is the diff shown on this page (version history link)? Not specified in the story.
  - SPD-05.4: Does the approver see the requester's identity-tier status (never, per GRP-08)? Not shown; confirmed by GRP-08, not restated here.
  - SPD-06.1: Criterion 4 says the reason is shown to the requester and other approvers only; SPD-01 closes that rejection reasons are also visible to member voters and holders of Wallet: approve spend. Which audience is correct for member voters of a linked vote?
  - SPD-06.2: A single "Reject, closed" by one approver ends a request that other approvers may want; no group setting (closed). No override UI is specified.
  - SPD-06.3: How is the copy "from a Rejected request" started (button on the detail)? Criterion 6 says a copy can be made; the entry control is not specified.
  - SPD-06.4: The preset list is "for example"; the final list and keys are not specified.
  - SPD-07.1: Version history is readable "for approvers and permission holders"; which permission holders (Wallet: view history, Wallet: approve spend)? Not specified in the story.
  - SPD-07.2: A passed vote is voided by a material edit "in the same way"; the voters' view of a voided passed vote is not specified in this story (VOT-03 owns it).
  - SPD-07.3: Does the requester see a diff before saving (from and to values) or only after? Criterion 3 shows "Changed" after saving; criterion 5 shows the policy effect before saving; the diff before saving is not specified.
  - SPD-07.4: Can the requester of an Approved request in Paying edit? The preconditions exclude it; the message shown is not specified.
  - SPD-08.1: Criterion 6 shows the requester the names of eligible approvers; GRP-12 and R185 show anonymous counts on the policy screen. Which applies on the request detail for the requester?
  - SPD-08.2: The nudge notification `msg.spd.approval_nudge` audience is each approver who has not approved; whether the nudge is shown on the approver's inbox row is not specified.
  - SPD-08.3: Is the nudge control shown when only one approver is eligible and the band needs two (impossible)? Not specified.
  - SPD-09.1: VOT-01 snaps or refuses a money vote deadline inside quiet hours (conventions 11.8); the requester's view of an adjusted deadline is not specified in this story.
  - SPD-09.2: The request detail shows "who voted Yes as the authorisation", but R40 says money votes are Named ballots; whether members who voted No are shown is not specified.
  - SPD-09.3: How does the requester start the single extension (button label) on a Needs attention request? Criterion 4 cites VOT-03 AC6; the control on this screen is not specified.
  - SPD-09.4: Criterion 4 maps a Tie to "The group did not approve"; the mapping for "Not passed (floor not met)" (R191 item 2, departed voter) is not specified here.
  - SPD-09.5: Is "Ask the group to vote first" shown to a requester below the money-out tier (vote path needs the requester's tier)? Not specified.
  - SPD-10.1: Criterion 8 says "Approvers receive `msg.spd.payout_confirmed` once"; on the vote path there are no approvers. Who receives the confirmation after a vote-authorised payout (the requester only, or voters)? Not specified.
  - SPD-10.2: When a vote-authorised payout is held until the end of quiet hours, what status and text does the request show to the requester ("Approved" with a hold reason)? Not specified in the story.
  - SPD-10.3: The OPS-10 review hold reason is never shown to voters; what is the requester shown while a payout is held for review? Not specified.
  - SPD-10.4: The money-states stage names and the screen word for Stage 1 versus Stage 2 are both "Set aside, not sent" (conventions 10.4); no state distinguishes them on the page, by design.
  - SPD-10.5: `PAYOUT_PENDING_ALERT_MINUTES` and `PAYOUT_PROVIDER_WAIT_MAX` values are owned by OPS-13 and WAL (proposals only).
  - SPD-11.1: `msg.spd.payout_failed` goes "to the requester and to approvers"; on the vote path there are no approvers. Who is told (voters)? Not specified.
  - SPD-11.2: The criterion 2 reason list includes "insufficient provider funds"; whether the requester sees provider-side wording (never the provider name) is not specified.
  - SPD-11.3: Where does the requester see the OPS-08 incident banner relative to the request detail? Not specified in the story.
  - SPD-11.4: A "Try again" by a holder of Wallet: approve spend who is not the requester: does it need a PIN? Not specified in the story.
  - SPD-12.1: Criterion 10 gives the seven-day warning as "EV-SPD-11, `msg.spd.expired`", the same key name as the expiry itself. Is `msg.spd.expired` the warning, the expiry notice, or both with different parameters?
  - SPD-12.2: Does a Needs attention request (held by freeze) expire after `spd.request_expiry`? Criterion 10 says "no decision, or authorised but not sent"; held requests are authorised but not sent, so yes, but the freeze pause rule is not stated.
  - SPD-12.3: The expiry clock "from the last change" while a notice is held (R185: paused while a notice is held) is not restated here.
  - SPD-12.4: A holder cancelling another person's request is the approver who may also have approved; no restriction stated.
  - SPD-13.1: Criterion 10 uses `request_stuck_days` (conventions Table B lists it as `spd.request_stuck_days`) but the SPD parameter table of this story does not define it. Which name and owner apply, and is it edited on GRP-12?
  - SPD-13.2: The "Waiting for a project approver" state counts toward the stuck days; does the state also show for a project request where the band's approvals are still missing? Not specified.
  - SPD-13.3: The convert-to-vote action needs three holders of Vote: vote; what the requester sees when fewer than three exist? Not specified.
  - SPD-13.4: The over-budget warning uses amount plus estimated fee while approval thresholds stay fee-free; the warning text for fee-inclusive figures is not specified.
  - SPD-13.5: Is the campaign link visible to approvers or only stored? Not specified.
  - SPD-14.1: Who sees the cap line (all members with Wallet: view balance, or only requester and approvers)? Not specified in the story.
  - SPD-14.2: The next step "a vote to change the cap" needs a vote entry; how the requester starts it from the block message is not specified.
  - SPD-14.3: Cap period boundaries and warning level come from RUL-09 (`CAP_WARNING_PERCENT` 80 percent is a hypothesis).
  - SPD-14.4: In vote mode with fewer than two eligible voters, the approval band applies; the screen text is not specified.
  - SPD-15.1: Criterion 5 says a holder of Wallet: freeze "applies the lift" on the vote path only; who completes a lift by approvals (automatic on the second approval, or an apply step)? Not specified in the story.
  - SPD-15.2: Freeze is allowed from any authenticated session; does the freeze confirmation ask for a PIN? Conventions say no PIN to grant the permission; the story does not say whether the freeze action itself asks for it. Not specified.
  - SPD-15.3: The freeze notice push goes to "all members who can view the wallet", including holders of the permission who froze; the person who froze receives which confirmation? Not specified.
  - SPD-15.4: `ntf.critical_freeze_sms_per_day` value is owned by NTF-09.
  - SPD-15.5: Presets list is "such as"; the full list and keys are not specified.
  - SPD-16.1: "Share receipt" produces an image or text; WAL-14 closes that the shared receipt is a PDF and plain text, not an image. Which applies to a payout receipt?
  - SPD-16.2: A receipt hides the payee's number when shared; the on-screen receipt shows the masked number. Both show masked; the full number is never shown. Not an ambiguity; recorded for completeness.
  - SPD-16.3: The receipt for a vote-authorised payout lists "names of those who voted Yes"; no field for No voters. Whether members who voted No are shown is not specified.
  - SPD-16.4: Retention of the audit trail and receipts depends on ACC open question 1 (open); no on-screen retention text is specified.
  - SPD-16.5: The same trail is read by GRP-11 without copying; whether a member sees the same trail in the group audit log and in the request is not further specified.
