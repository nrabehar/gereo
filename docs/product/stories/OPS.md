# OPS: Operator back office, KYC review, reconciliation and support

Epic code OPS, release MVP. Follows [00-conventions.md](../00-conventions.md). The actor in every story is the Gereo operator (support, compliance, operations), unless the story says the System acts. Journey steps covered: 2 Verify, 6 Spend (payout monitoring), 8 Report and support.

## Sources used in the Conversation sections

| Short name | File |
| --- | --- |
| 03 mobile money | [03-madagascar-mobile-money.md](../../research/raw/03-madagascar-mobile-money.md) |
| 06 process | [06-design-process.md](../../research/raw/06-design-process.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption.

## Conventions used in this file

- The back office is a web application used on a desktop or laptop, and it must also work on a phone for an on-call operator. It follows the accessibility rules of XCT-08 to XCT-10 and the amount and date formats of XCT-02 and XCT-03. Operator-facing text is in English and French at first; Malagasy is required for every text the operator sends to a user (templates, reasons, banners).
- There are no roles. Operator access is permissions only, granted individually, like everything else in Gereo. Operator permissions are a separate catalogue, owned by OPS-01 (single table below; other epics cite only these names). They are not member permissions (decision D2): holding one never gives a member permission, and holding a member permission never gives access to the back office. "Operator" in a story means a person who holds the permission named in that story.
- An operator never approves a spend, never votes, never counts toward the floor of two distinct people on a group wallet, and cannot lift a group freeze (decisions D1 and D4; GRP-13; SPD-15). Nothing in this epic can be used to meet or bypass that floor.
- Four-eyes rule: an action marked "needs a second person" is proposed by one operator and applied only after another operator, who cannot be the proposer, approves it. The second person holds the approval permission named in the story. Both identities are written to the Audit log.
- Operator alerts (the keys named `ops.*.alert`) are not member notifications and are outside the NTF catalogue. Decision: every operator alert shows as a count in the back office header and as an email to the on-duty list; an alert marked High severity is also sent by SMS to the on-call operator's phone. Reason: operators have email (members may not, see NTF), and SMS costs money only for the few alerts that cannot wait. Messages to members always go through NTF.
- Message keys to members follow NTF and the conventions grammar: `msg.<epic>.<event>` with the optional variants `.push`, `.sms` and `.inapp`. Messages sent by the operator epic use `msg.ops.<event>` (there is no `push.ops.*` or `sms.ops.*` prefix and no email variant). A notification body is only ever a `msg.*` key. Keys for the operator interface use `ops.<area>.<element>`. SMS follows the fallback rule of NTF-05 (push first, then SMS only if the push was not opened) unless NTF marks the event as sent by SMS directly.
- Every operator action writes an Audit entry (who, what, object, before and after values, reason, time in UTC and Madagascar time). Audit entries are immutable. Personal data is masked by default (phone `034 ** *** 12`, ID number partly hidden); revealing it is a logged action with a reason.
- A ledger is never edited. An operator who needs to fix a balance proposes a reversing entry and a new entry (OPS-05), never an edit. Operators cannot move money from the back office except through the defined payout actions (OPS-13) and the approved corrections (OPS-05).
- Transaction statuses used here are exactly those of WAL: Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention in the interface. A status may carry a plain sub-label but never a new name. "Needs attention" belongs to one object at a time; every queue, filter and alert in this file that shows it names the object (transaction, KYC case, discrepancy alert).
- Operator hold: a time-limited stop that an operator places on an account or on a wallet (OPS-10). The UI label is `Held by Gereo`. Two codes exist: `wallet_held` (the source wallet is under an operator hold) and `destination_held` (the destination wallet is under an operator hold); both display `Held by Gereo`. It is not a Wallet freeze (SPD-15, a member action that an operator can neither apply nor lift) and not an Account lock (ACC-11). The bare words "lock" and "frozen" are not used for it.
- Parameters in capitals are configurable. A value marked "proposed" is a working default set from the evidence named beside it and is tuned after the pilot. A value marked TBD needs an outside party and must not be guessed in code; the story says what the system does until it is known.

## Operator permission catalogue

This is the only list of operator permissions. OPS-01 owns it. It is separate from the member permission catalogue (owned by GRP, shared definitions; conventions section 7 lists names only), and no name in one list is valid in the other.

| Permission | Used in | Second person |
| --- | --- | --- |
| `manage operator access` | OPS-01 | Granting `approve ledger correction`, `approve limits and fees` or `manage operator access` |
| `review identity checks` | OPS-02, OPS-03, OPS-10 | A second holder decides Tier 3 cases and cases where the ID number is already on another account |
| `view reconciliation` | OPS-04 | none |
| `resolve discrepancy` | OPS-04 (manual statement import), OPS-05 | proposes; `approve ledger correction` approves |
| `approve ledger correction` | OPS-05 (WAL-18) | approves; above `CORRECTION_APPROVAL_THRESHOLD` a third holder also approves |
| `handle tickets` | OPS-06, OPS-07 | Unlock of an account locked by a fraud flag |
| `publish incident` | OPS-08 | none |
| `search audit log` | OPS-09 | none |
| `manage flags` | OPS-10 | Account hold at or above `FLAG_SECOND_PERSON_SEVERITY`; every wallet hold, whatever the severity |
| `edit limits and fees` | OPS-11 | proposes; `approve limits and fees` approves |
| `approve limits and fees` | OPS-11 | approves; a third holder for a large fee change |
| `view sms costs` | OPS-12 | none |
| `view notification log` | NTF-12, OPS-12 | none |
| `reveal message text` | NTF-12 | none |
| `manage payouts` | OPS-13 | Pause or resume of all providers |
| `watch platform jobs` | OPS-14 | none |

## Status names

Every status below is a name in this table; stories use no other name. The user-side words are in brackets where they differ.

| Object | Statuses |
| --- | --- |
| Identity check (owned by ACC) | Pending, Approved, Rejected. A retake request is a Rejected result with the failed items marked |
| KYC case in the queue (back office only) | New, In review, Waiting for user, Decided |
| Reconciliation run | Running, Completed, Failed, Report not received |
| Discrepancy alert | Open, Investigating, Resolved, Accepted as late. `Escalated` is a marker on an Open or Investigating alert |
| Correction proposal | Proposed, Approved, Applied, Rejected, Expired |
| Support ticket | Received, In review, Waiting for user (user sees Waiting for you), Resolved, Closed |
| Incident | Active, Resolved |
| Flag | New, In review, Cleared, Escalated, Action taken |
| Operator hold on an account or a wallet (UI label Held by Gereo) | Active, Expired, Lifted |
| Platform job alert (OPS-14) | Open, Acknowledged, Resolved |
| Limits and fees version | Draft, Awaiting approval, Scheduled, Active, Rejected, Replaced |
| Payout in the queue | The transaction statuses above. A payout waiting for the provider is Pending with the sub-label "Waiting for the provider" (WAL-08), also shown as the filter `Queued`. `Late` and `Escalated` are markers. `Needs attention` here is the transaction object |

## Configurable parameters

| Parameter | Starting value | Source or status |
| --- | --- | --- |
| `OPERATOR_IDLE_MINUTES` | 15 (proposed) | operator session idle limit; a back office that shows ID photos and balances closes early |
| `OPERATOR_MAX_FAILED_SIGNINS`, `OPERATOR_LOCK_MINUTES` | 5 and 15 (proposed) | same values as the member PIN lock in ACC-03 so one rule is learned |
| `KYC_REVIEW_TARGET_HOURS` | 24 (proposed) | the time promised to users in ACC-09; matches the "1 day" example in 07 UI/UX 5.3 R-K4, to be checked against queue volume in the pilot |
| `KYC_CLAIM_RELEASE_MINUTES` | 30 (proposed) | a taken case untouched for this long returns to the queue |
| `KYC_LATE_ALERT_COUNT` | 5 (proposed) | number of Late cases that raises `ops.kyc.late_alert` |
| `KYC_MAX_ATTEMPTS` | owned by ACC (3) | not redefined here |
| `KYC_MIN_AGE` | owned by ACC (18, unverified) | not redefined here |
| `RECON_RUN_TIME` | daily, 06:00 Madagascar time (proposed) | owned by OPS-04; "rapprochement quotidien" in info.md section on money flows; run after the provider closes the previous day |
| `RECON_SETTLEMENT_LAG_DAYS` | 1 (proposed) | owned by OPS-04; a provider record not yet due for settlement is shown as Not yet due, not as a difference; TBD with Vanilla Pay |
| `RECON_TOLERANCE_AR` | 0 | owned by OPS-04; amounts are integers, so no rounding tolerance is needed |
| `DISCREPANCY_ESCALATE_HOURS` | 8 (proposed) | one working day; shorter than `NEEDS_ATTENTION_ESCALATE_HOURS` (WAL) because a ledger difference is a control failure |
| `CORRECTION_PROPOSAL_EXPIRY_HOURS` | 48 (proposed) | an unapproved correction expires |
| `CORRECTION_APPROVAL_THRESHOLD` | owned by WAL (TBD) | not redefined here |
| `TICKET_FIRST_RESPONSE_HOURS` | 24 (proposed) | shown to the user as an absolute time (OPS-07) |
| `TICKET_REOPEN_DAYS` | 7 (proposed) | a user reply after Resolved reopens the ticket within this time |
| `TICKET_CLOSE_DAYS` | 3 (proposed) | a Resolved ticket closes after this time with no reply |
| `PAYOUT_PENDING_ALERT_MINUTES` | 10 (proposed starting value, decision D6 and R124, to be confirmed against the provider's real answer times) | counts dispatched payouts only (sent to the provider); a payout waiting for the provider before dispatch is governed by `PAYOUT_PROVIDER_WAIT_MAX`, not by this value. Owned here, read by WAL, SPD and XCT, which never restate a value |
| `PAYOUT_RETRY_MAX` | 3 (proposed) | retries per payout from the back office |
| `JOB_CHECK_RUN_TIME` | daily, 06:30 Madagascar time (proposed) | daily backstop check of OPS-14, run after the reconciliation of `RECON_RUN_TIME` has started |
| `BANNER_PROPAGATION_SECONDS` | 60 (proposed) | time for a published banner to reach the apps online |
| `INCIDENT_NO_NEWS_MINUTES` | 60 (proposed) | a banner with no update for this long shows "No news yet" |
| `INCIDENT_SMS_AFTER_MINUTES` | 60 (proposed) | an incident lasting longer than this sends the SMS fallback to people with a pending request |
| `FEE_CHANGE_NOTICE_DAYS` | 30 (proposed) | minimum notice before a fee increase starts; the legal minimum is TBD (needs counsel) |
| `FEE_LARGE_CHANGE_PERCENT` | 20 (proposed) | a fee change larger than this share of the active value needs a third approval |
| `SMS_COST_PER_SEGMENT` | TBD | competitive analysis section 2 quotes about USD 0.59 per segment on a global list price; local aggregator rates are not checked |
| `SMS_BUDGET_DAILY_AR` | TBD | set from the aggregator quote and the group allowance of NTF-06 |
| `SMS_BUDGET_WARN_PERCENT` | 80 (proposed) | same as `ntf.sms_allowance_warning_percent` so one number is learned |
| `FLAG_HOLD_MAX_HOURS` | 48 (proposed) | twice the new-device cooling period of ACC-05 (24 h); longer holds, on an account or a wallet, need a renewal with a new reason |
| `FLAG_SECOND_PERSON_SEVERITY` | High (proposed) | account holds at or above this severity need a second person; a wallet hold always needs one, whatever its severity |
| `AUDIT_SEARCH_TARGET_SECONDS` | 5 (proposed) | first page of a 7-day search |
| `AUDIT_EXPORT_MAX_ROWS` | 10 000 (proposed) | larger exports must be narrowed |
| `AUDIT_RETENTION_YEARS` | 5 (proposed) | owned here. Covers audit log entries, consent evidence and the decision log. It must be at least `RECORD_RETENTION_YEARS` (WAL), because the authorisation trail of a payment must outlive no less than the payment record. Applicability and duration are a lawyer question: see ACC open question 1. Cited by GRP, CON, ANN, NTF and SPD, which do not redefine it. Retention of ID images is `RECORD_RETENTION_YEARS` (WAL) |
| `RECORD_RETENTION_YEARS` | owned by WAL | not redefined here; covers identity images, transaction records and the ledger |

---

## Stories

### OPS-01 Sign in to the back office and see only what my permissions allow

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** none to sign in; `manage operator access` to grant or revoke permissions to another operator
**Tags:** audit

**Story:** As a Gereo operator, I want to sign in strongly and see only the screens my permissions allow, with personal data masked until I have a reason to open it, so that one stolen password or one curious operator cannot expose users or move money.

**Conversation:** The operators hold the most sensitive data (ID photos, phone numbers, balances) and the most dangerous actions (approve verification, correct the ledger). The product has no roles and the same principle applies here: permissions only, individually granted, changes audited (info.md, permissions guard-rails; 00-conventions section 2). The research warns that fraud by administrators is the dominant failure of group money (competitive analysis section 1), and an operator is an administrator at platform scale. Separation of funds and a complete audit log are non-functional requirements (info.md). Decision on the sign-in method: a password plus a one-time code from an authenticator app on a device the operator owns (second factor that does not depend on the phone network, so a SIM swap on an operator's number cannot open the back office). Operators of money permissions use a device approved by the person with `manage operator access`. This story owns the single operator permission table at the top of this file: the existing names plus `view notification log`, `reveal message text`, `search audit log`, `view reconciliation`, `review identity checks`, `handle tickets`, `resolve discrepancy` and `approve ledger correction`. It is a separate catalogue from member permissions (decision D2), and other epics cite only its names.

**Preconditions:** The operator has an account created by another operator who holds `manage operator access`.
**Trigger:** Operator opens the back office.

**Acceptance criteria:**
1. Happy path. Sign-in needs two factors: a password and a one-time code from an authenticator app on a device the operator owns. A sign-in from a device not yet approved is refused for operators holding `manage payouts`, `approve ledger correction`, `approve limits and fees` or `manage operator access`, until a holder of `manage operator access` approves the device. After sign-in the home shows only the tiles for which the operator holds a permission, each with a count (for example `KYC cases waiting: 12`).
2. Business rule, no hidden access. A direct link to a screen without the needed permission shows `ops.access.not_allowed` with the name of the missing permission and who can grant it. No data from that screen is loaded.
3. Business rule, masking. Phone numbers, ID numbers and names of users are masked in lists and in the audit log. A `Reveal` button opens the value for the current record after the operator picks a reason from a short list; each reveal writes an Audit entry. Photos of IDs open only inside the KYC case (OPS-03).
4. Business rule, sessions. The session ends after `OPERATOR_IDLE_MINUTES` of inactivity and after sign-out. A second sign-in by the same operator shows the operator the first session and offers to end it.5. Business rule, no secrets. An operator can never see a user's PIN, a one-time code or a biometric template, and no screen has a field for them. Operators have no action that sends a user a message asking for a PIN or code (templates are fixed and reviewed, see XCT-12).
6. Business rule, grants. An operator who holds `manage operator access` can grant or revoke a permission for another operator; a grant of `approve ledger correction`, `approve limits and fees` or `manage operator access` needs a second person. An operator cannot grant a permission they do not hold, and cannot change their own permissions.
7. States. An operator whose access was just revoked sees the effect on the next click, not at next sign-in. If the permission service cannot be reached, every screen is closed with `ops.access.service_down` (fail closed) and no data is shown.
8. Errors. Wrong code or password shows a neutral message, locks after `OPERATOR_MAX_FAILED_SIGNINS` attempts for `OPERATOR_LOCK_MINUTES`, and alerts the holders of `manage operator access`. No user data is involved.
9. Notifications. A grant or revoke sends an email to the affected operator, key `ops.access.changed`. Operators never receive user data in notifications.
10. Ledger and audit. No ledger entry. Audit entries for sign-in, failed sign-in, session ended, reveal, grant, revoke, each with operator ID, device, time and reason.

**Data:** Operator (a User with back-office permissions), Audit entry.
**Depends on:** XCT-12 (fixed templates). Used by every other OPS story.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: sign-in method and device policy as in criterion 1. Closed: operator permissions are held in the same permission service as member permissions (info.md says access control is OpenFGA with no roles), in a separate operator namespace, so no operator permission can be inherited from a group, project or document and no member permission opens the back office. Open, needs Vanilla Pay and the SMS aggregator: whether they require a named list of operators who may act on their portals. Default used: the back office can export the list of holders of each permission, with grant dates, from the Audit log.

---

### OPS-02 See the KYC review queue and pick the next case

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `review identity checks`
**Tags:** legal-gate, audit

**Story:** As a Gereo operator, I want a queue of identity checks waiting for me, oldest and most urgent first, so that no one waits longer than we promised them.

**Conversation:** Verification is Gereo's job because Vanilla Pay provides none (info.md; 03 mobile money 5.2). The promise made to the user in ACC-09 must be one the queue can keep. Money Fellows reviewers complain of requests that stay open with no wait time and unexplained rejections (08 competitor UX 6.1). Verification friction is the top complaint class there (competitive analysis section 4). Tag legal-gate: records and tiers come from the money rules.

**Preconditions:** Users have submitted identity checks (ACC-08) or PIN-reset selfie checks (ACC-04), or an operator opened a number change or OTP help case from a ticket (OPS-06).
**Trigger:** Operator opens `ops.kyc.queue`.

**Acceptance criteria:**
1. Happy path. The queue is a list with these columns: case reference, user (masked), case type (new tier request, PIN reset, device recovery, number change and OTP help, the last two opened from OPS-06 and matching ACC-06 and ACC-02), tier requested, submitted at, age with a clock, attempt number, source (self or assisted by a facilitator, `assisted_by` of ACC-10), automatic flags (blur, glare, name mismatch, ID number already used on another account), assignee, status (case statuses of the status table).
2. Business rule, order. The default sort is by time left to `KYC_REVIEW_TARGET_HOURS`, oldest first. A case past the target shows a `Late` marker with icon and word, not colour alone. A filter bar offers type, tier, source, flag, assignee and status.
3. Business rule, claim. An operator opens a case with `Take`. A case taken by someone else shows their name and cannot be opened for decision by a second operator (a view-only open is allowed with a warning). A case untouched for `KYC_CLAIM_RELEASE_MINUTES` returns to the queue.
4. Business rule, counters. The header shows counts: waiting, late, in review, decided today, and the median age of waiting cases. These come from the same data as the list.
5. State, empty. An empty queue shows `ops.kyc.queue_empty` ("No cases waiting") and the time of the last refresh, not a blank table. A filter with no result says so and offers to clear filters.
6. State, loading and failure. A loading list shows a skeleton for the first load and a spinner within the list on refresh. A failed load keeps the last list with `Not updated since {time}. Retry` and never clears it.
7. Business rule, flags. A case with ID number already on another account, or a user with an open fraud flag (OPS-10), is marked and cannot be approved until the flag is read; the marker links to the flag.
8. Notifications. New and late cases raise a count in the back office header; an alert goes to operators on duty when the number of late cases reaches `KYC_LATE_ALERT_COUNT` (key `ops.kyc.late_alert`, channel as in the conventions). Users are not notified by this story.
9. Ledger and audit. No ledger entry. Audit entries for case taken, released, opened, with operator and time.
10. Accessibility and language. The list uses real table semantics with sortable column headers, works with a keyboard, and the user's language is shown per case so that the operator knows which rejection text the user will see.

**Data:** Identity check, User, Device, Audit entry.
**Depends on:** OPS-01, ACC-02, ACC-04, ACC-05, ACC-06, ACC-08, ACC-10, OPS-06, OPS-10.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `KYC_REVIEW_TARGET_HOURS` is 24 (proposed), the same figure ACC-09 shows to the person; the pilot checks it against volume. Closed: a second person is required for Tier 3 cases and for duplicate ID numbers (OPS-03 criterion 5); it is not required for group treasurers, because the floor of GRP-13 (no single person moves group money, decisions D1 and D4) already protects the group and a second check on every treasurer would slow the people the product depends on (competitive analysis section 6, point 8).

---

### OPS-03 Decide a KYC case: approve, reject with a reason, or ask for a retake

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `review identity checks`
**Tags:** legal-gate, sms, audit

**Story:** As a Gereo operator, I want to compare the ID and the selfie against what the person typed, then approve, reject with a fixed reason or ask for one specific retake, so that each person gets a fair, specific answer and our records are complete.

**Conversation:** The review is where trust is won or lost: "keeps rejecting my national card" is the Money Fellows complaint. Reasons must be specific, actionable and never accusing; the rule is "Photo too dark. Move near a window", not "Your document is invalid" (07 UI/UX 5.3 R-K5; 08 competitor UX 6.1). Approval changes the tier and therefore the limits, so it has a legal weight; identity records are kept for the period of ACC open question 1. An operator may approve a lower tier than asked, with a fixed reason (decided in ACC-09).

**Preconditions:** An operator has taken a case (OPS-02).
**Trigger:** Operator opens the case.

**Acceptance criteria:**
1. Happy path. The case page shows the ID front and back and the selfie side by side with zoom and rotate; the data the user typed (legal name, document type and number, date of birth); the attempt history; and the automatic flags. A checklist has to be ticked before `Approve` is enabled: image is readable, typed data matches the document, document not expired, person is at least `KYC_MIN_AGE` (ACC), face matches, ID number not used on another account.
2. Happy path, approve. `Approve` sets the Identity check to Approved and the user's tier to the requested tier (or a lower one chosen by the operator with a fixed reason; this is allowed, ACC-09 shows it to the person). A Tier 3 approval needs a second person who holds `review identity checks`. The user's limits change from that moment (ACC-09, OPS-11). No ledger entry is created.
3. Business rule, reject. `Reject` requires at least one reason from the fixed list, which is the list of ACC-09 (photo too dark, photo blurry, glare on the document, document expired, document type not accepted, document unreadable, name does not match, number does not match, face not clear, face does not match the document, under the minimum age; and `other` with a reason code that has its own approved text). Each reason has a user-facing text and a tip in Malagasy, French and English. Free text typed by the operator is internal only and is never shown to the user.
4. Business rule, retake. `Ask for retake` marks specific items (front, back, selfie) to redo and keeps the passed items; the user returns to ACC-08 with the failed items marked. Retakes count as attempts; after `KYC_MAX_ATTEMPTS` the page shows `Escalate to support` and the user sees ACC-09 criterion 4.
5. Business rule, duplicates and flags. If the ID number is already linked to another account, approval is blocked and the operator must open the other case or flag (masked) and choose: reject with a reason, or send to a second person, who holds `review identity checks` and decides (needs a second person). The two accounts are linked in an internal note, never shown to either user.
6. Business rule, PIN reset and device recovery. For case types from ACC-04 and ACC-05 the page shows the stored reference selfie next to the new one; `Approve` completes the reset or device registration; `Reject` shows the user the fixed reason and keeps the account unchanged.
7. State, loading and failure. Images load progressively with a skeleton; if an image fails to load the checklist item is disabled with `Image not loaded. Retry`. A decision that fails to save shows `ops.kyc.decision_not_saved` and nothing is sent to the user.
8. Notifications. On every decision the user is told in their language with `msg.acc.kyc_approved` (approval) or `msg.acc.kyc_action_needed` (rejection and retake), events EV-ACC-07 and EV-ACC-08 of NTF: push first, SMS only if the push is not opened (NTF-05). The SMS is GSM-7 safe, under 160 characters, with the reference ID and a short reason code (XCT-12). Nothing is sent until the decision is saved.
9. Ledger and audit. No ledger entry. Audit entries for case opened, each image viewed, checklist state, decision, reason codes, tier before and after, operator and time (second operator too for Tier 3). Images are encrypted at rest, and access to them is logged. Audit entries follow `AUDIT_RETENTION_YEARS`; the images follow `RECORD_RETENTION_YEARS` (WAL) after the account closes, as set in ACC-08.
10. Accessibility and language. The case page works at 200% font size; image viewing has a keyboard alternative; decision buttons are labelled with the outcome (`Approve Tier 2`, `Reject`), never `Yes` or `OK`.

**Data:** Identity check, User, Device, Notification, Audit entry.
**Depends on:** OPS-01, OPS-02, ACC-04, ACC-05, ACC-08, ACC-09, OPS-11, NTF-05, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the list of rejection reasons is the one in criterion 3, shared with ACC-09. Closed: a second person is required for Tier 3 and for duplicate ID numbers, not for people who can approve spending (reason in OPS-02). Open, needs translators and field testing: the Malagasy wording of each reason; default used: translators draft the three languages together and no language ships with unreviewed reasons. Open, needs counsel and the hosting choice: where images are stored (retention duration: ACC open question 1); default used: encrypted, kept `RECORD_RETENTION_YEARS` after the account closes, never shown outside this case page.

---

### OPS-04 Check the ledger against Vanilla Pay every day and see the result

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `view reconciliation`
**Tags:** ledger, legal-gate, audit

**Story:** As a Gereo operator, I want a daily match of every Gereo transaction against Vanilla Pay's records and a clear view of what matched and what did not, so that I can prove the money held matches the money owed.

**Conversation:** Daily reconciliation with Vanilla Pay is a stated control (info.md, money flows) and mandatory because provider callbacks can time out or double-notify (competitive analysis section 6, point 6). A visible reconciliation of the ledger against the provider balance is part of Gereo's open design space and highest design risk (design foundations section 1, point 4). Client funds must be kept separate from Gereo's own (info.md). Vanilla Pay's API, settlement and reporting formats are not public and must be confirmed (03 mobile money 3.2 and 7.4), so the story states the result and not the file format. Tag legal-gate.

**Preconditions:** A provider statement or report for the period is available from the payment adapter.
**Trigger:** The System runs reconciliation at `RECON_RUN_TIME`; an operator may also start a run for a date.

**Acceptance criteria:**
1. Happy path, run list. `ops.recon.runs` lists runs by date with: period covered, provider, status (Running, Completed, Failed, Report not received), number of provider records, number of Gereo transactions, matched, unmatched on the provider side, unmatched on the Gereo side, amount mismatches, total difference in ariary, completed at. The last completed run is shown at the top with its time.
2. Business rule, matching. A match requires the same provider reference, the same amount in integer ariary and a consistent status. Fee and tax lines are matched as their own categories against the active version of OPS-11. A provider record not yet due under `RECON_SETTLEMENT_LAG_DAYS` is shown as `Not yet due`, never as a difference. Dispatched payouts in Pending beyond `PAYOUT_PENDING_ALERT_MINUTES`, and deposits beyond the deposit timeout `PENDING_TIMEOUT` (WAL-07), are listed as `stuck`; a payout still waiting for the provider before dispatch is never `stuck` (it waits up to `PAYOUT_PROVIDER_WAIT_MAX`, WAL). Duplicate provider callbacks are matched to one transaction and counted as duplicates, never as two.
3. Business rule, balance check and invariant. Until Vanilla Pay confirms that a balance report for the client funds account exists, reconciliation is item-level (criterion 2) and the balance line shows `Not available from the provider`, never zero. Once the report exists, the run compares the sum of client wallet balances in the ledger with the reported client funds balance and shows both numbers and the difference (`RECON_TOLERANCE_AR`, starting at 0). The run tests one invariant: the provider client-funds balance is at least the sum of the client wallet balances; a breach raises the alert of OPS-05 as High severity. Gereo's own money is held outside that sum and is shown in its own section, never mixed in: Gereo income (Fee, the Gereo part; Rounding, decision D5; Platform: SMS allowance) and, separately, Tax as a liability collected for the state, not income. Money leaves the income account only by a finance process outside the app, run by two people; the ledger has no sweep rule.
4. Business rule, drill down. An operator can open a run and filter by category (unmatched provider, unmatched Gereo, amount mismatch, duplicates, stuck). Each row shows the transaction reference, provider reference, amounts on both sides, statuses, wallet (masked user) and time, and links to the ticket or flag if one exists.
5. Business rule, immutability and reruns. A completed run is stored as it was and never edited. A rerun for the same date is allowed and creates a new run linked to the first; the earlier result stays visible. A rerun is idempotent: it never creates ledger entries by itself.
6. State, empty and failed. A day with no transactions shows `Completed, nothing to match`. A run that failed or is missing the provider report is shown in the list with the reason and raises an alert (OPS-05), never a blank row.
7. State, loading. The run list loads in pages of 20 to 30 rows; a running reconciliation shows its progress and the time since start.
8. Notifications. Completion with zero differences sends nothing. Any difference, failure or missing report sends the alert of OPS-05. Users are not notified by this story.
9. Ledger and audit. Reconciliation writes no ledger entry. Audit entries for run started, completed, failed, rerun, and for each operator view of a run (operator, time), so that nobody can quietly look and leave no trace.
10. Accessibility and language. Differences and totals use the amount format (`12 500 Ar`); status chips have icon, word and colour; the run list is a table with sortable headers and keyboard access.

**Data:** Reconciliation run, Transaction, Ledger entry, Audit entry.
**Depends on:** OPS-01, WAL-07, WAL-11, WAL-20, SPD-10, payment adapter (technical). The alert raised by criteria 6 and 8 is handled in OPS-05, which depends on this story.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs Vanilla Pay: whether it provides a daily statement, an API or only a dashboard export; the settlement schedule (D+0, D+1, D+2); where the client funds account sits and who holds it (03 mobile money 7.4). Default used: the payment adapter has two input modes, an automatic statement fetch and a manual file import by an operator with `resolve discrepancy` (audited like any other action), so the daily run works with either answer; settlement lag 1 day. Closed: this story owns the reconciliation job, `RECON_RUN_TIME`, `RECON_TOLERANCE_AR` (0) and `RECON_SETTLEMENT_LAG_DAYS` (1), and stays item-level until Vanilla Pay confirms a balance report (criterion 3). Closed: the run covers fee and tax lines (criterion 2), because the 0.5% tax line (03 mobile money 5.3) is unverified and must not be missed if it applies.

---

### OPS-05 Get alerted to a discrepancy and resolve it with a reversing entry

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `resolve discrepancy`; the correction itself needs a second operator who holds `approve ledger correction`
**Tags:** ledger, legal-gate, audit

**Story:** When reconciliation finds a difference between the ledger and Vanilla Pay, I want to be alerted at once, see exactly what differs and fix it only by an approved reversing entry, so I can close the gap without ever rewriting history.

**Conversation:** Alerts on discrepancies are a stated control (info.md). Ledger entries are immutable and corrected only by a reversing entry (00-conventions section 2; design foundations section 3, principle 9). Money-out failures and provider outages are where differences appear: an operator accepted but no callback, debited but not delivered (competitive analysis section 4, point 1). The user-facing rule is that Failed must say whether money moved (07 UI/UX 2.3 R-T3), so a correction that changes a balance must also tell the person. Tag legal-gate: a correction moves client money.

**Preconditions:** A reconciliation run has differences, failed, or the report is missing (OPS-04).
**Trigger:** The System raises an alert at the end of a run.

**Acceptance criteria:**
1. Happy path, alert. An alert appears in the back office header and in `ops.recon.alerts` and is sent to operators on duty (channel as in the conventions, key `ops.recon.alert`). It says the date, the number and total of differences and links to the run. Alerts are not merged away: each run with differences creates one alert.
2. Business rule, states. An alert has the statuses of the status table: Open, Investigating, Resolved or Accepted as late. An operator moves it to Investigating with `Take`, which names them. An alert not Resolved after `DISCREPANCY_ESCALATE_HOURS` gets the `Escalated` marker and is re-sent to the holders of `approve ledger correction` and, as a High severity alert, by SMS to the on-call operator.
3. Business rule, cause. For each difference the operator picks a cause from a list: provider record arrived late; Gereo status not updated from a callback; duplicate callback; missing Gereo entry; wrong amount; provider fee not recorded; reversal at the provider; other with a note. A late provider record that arrives within the next run is closed automatically as `Accepted as late` with the link to both runs.
4. Business rule, correction. A correction is proposed as a reversing entry plus, if needed, a new correct entry; each is a balanced double entry, with the reason code, the alert ID and the proposer. It is applied only when a second operator, who holds `approve ledger correction`, approves it (needs a second person); above `CORRECTION_APPROVAL_THRESHOLD` (WAL-18) a third holder must also approve. The original entry is never edited or deleted. When the entry being reversed was income that fed rules (decision D3), the proposal lists the entries derived from it and offers to reverse them in the same proposal, never automatically (WAL-18 criterion 7). A reversal that would make a balance negative is blocked with the alternatives of WAL-18. This story owns the correction workflow; WAL-18 and WAL-20 cite it and do not restate it.
5. Business rule, user effect. If a correction changes a user's or group's balance, the System tells them in their language (base key `msg.wal.balance_corrected`, to be added to the NTF catalogue, push first and SMS fallback) with the reference ID, the amount, the direction and the support route. The correction shows in the person's ledger with a reference to the reversed entry.
6. Business rule, no silent closure. An alert cannot be set to Resolved while any of its differences has no cause and no linked action. A reconciliation run after the correction must show the difference closed before the alert can be marked Resolved automatically.
7. State. The alerts list shows count of Open alerts, age of the oldest, total amount at stake. An empty list shows `No open discrepancies` with the date of the last clean run.
8. Errors. If a correction fails to post (for example the ledger rejects an unbalanced entry), nothing is applied, the proposer sees the reason and no user is notified. If approval does not happen, the proposal becomes Expired after `CORRECTION_PROPOSAL_EXPIRY_HOURS` and the alert returns to Investigating.
9. Ledger and audit. Corrections are the only operator action that writes ledger entries (reversing and new entries), always in pairs that balance. Audit entries for alert raised, taken, cause set, correction proposed, approved, rejected, applied, with both operators' IDs and times.
10. Accessibility and language. The correction preview shows before and after balances in the amount format and in words, so that the approver sees the exact effect; the approval button names the effect (`Approve correction of 12 500 Ar`).

**Data:** Reconciliation run, Discrepancy alert, Ledger entry, Transaction, Notification, Audit entry.
**Depends on:** OPS-01, OPS-04, WAL-18, WAL-20, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: above `CORRECTION_APPROVAL_THRESHOLD` a third holder of `approve ledger correction` approves (WAL-18); the threshold value belongs to WAL and is TBD. Closed: no automatic pause of payouts in the MVP; a pause is a manual action (OPS-13), because one bad statement file could otherwise stop every user's money; the alert escalates instead, and the rule is revisited with pilot data. Open, needs Vanilla Pay and counsel: who bears a loss caused by the provider. Default used: the person is never charged; the shortfall is booked as a Gereo loss line (as WAL-18 does for a blocked negative balance) and a claim against the provider is handled outside the ledger.

---

### OPS-06 Handle support tickets with the full context

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `handle tickets`
**Tags:** audit

**Story:** As a Gereo operator, I want every ticket to arrive with the reference ID, the transaction and the user's language already attached, so that I can answer in one reply instead of asking questions.

**Conversation:** Support is slow on every money product's review page (competitive analysis section 1, point 3, and section 4, point 3). "Report a problem" on every transaction pre-fills the reference ID and the transaction details for support (07 UI/UX 2.6 R-E3). A named support channel with a response time is a trust signal (R-S5). Tickets come from in-app support, from account-safety flows (ACC-04, ACC-05, ACC-11), from the KYC escalation (OPS-03), from failed split runs (RUL-07) and from an operator-created ticket after a phone call. MVP scope says in-app support with ticket status (competitive analysis section 7).

**Preconditions:** A user opened a ticket from the app, an operator created one, or the System opened one for a failed split run.
**Trigger:** Operator opens `ops.tickets`.

**Acceptance criteria:**
1. Happy path, inbox. The inbox lists tickets with: reference (copyable), category (money, identity, access, group, other), user (masked) and language, linked object (transaction, KYC case, group), status, assignee, created at, last update, time to first response and a `Late` marker past `TICKET_FIRST_RESPONSE_HOURS`. Filters: status, category, assignee, language, late, linked object.
2. Happy path, ticket page. The page shows the conversation, the linked transaction with its status and ledger entries (read only), the user's tier, account status (Pending PIN, Active, Locked, Deleting, Deleted) and recent safety events (new device, PIN reset, Account lock), and the other open tickets of the same user. Replies are written in the user's language using templates in Malagasy, French and English that an operator may edit before sending. Machine translation is never used for money statements.
3. Business rule, statuses. Operators move a ticket through Received, In review, Waiting for user, Resolved, Closed (OPS-07 defines what the user sees). Moving to Resolved needs a resolution code; a Resolved ticket becomes Closed when the user confirms or after `TICKET_CLOSE_DAYS` with no reply. A user reply after Resolved reopens it within `TICKET_REOPEN_DAYS`.
4. Business rule, actions. From a ticket the operator can link a KYC case, open the discrepancy or flag for the same transaction, propose a ledger correction (WAL-18, which needs the second operator of OPS-05), unlock a locked account after the checks of ACC-11 (needs a second person for unlock where the lock came from a fraud flag), and send a verification retake request. A ticket opened from "Report this payment" (WAL-14) arrives with the transaction attached. A ticket opened by the System for a failed split run (RUL-07) arrives with the wallet, the rule and the failed run attached, and has the category money. Every action is a button with the same permission as the equivalent screen, so a ticket never gives more power than the operator already has.
5. Business rule, merge and notes. Duplicates are merged with a link kept both ways. Internal notes are visible only to operators and are never shown to the user. A ticket may be assigned to another operator with a note.
6. State, empty and loading. An empty inbox shows `ops.tickets.empty` with the time of last refresh. A failing load keeps the previous list with `Not updated since {time}. Retry`.
7. Business rule, privacy. The user's masked data is shown first; a `Reveal` for phone or ID number needs a reason (OPS-01). Attachments from the user (screenshots) are shown with a warning that they may hold other people's data and are kept for the configured time.
8. Notifications. Each operator reply, status change and request for information notifies the user in their language through `msg.ops.ticket_updated`, with the ticket reference, under the rules of OPS-07. Operators receive a count of late tickets in the header. A message the user writes in a ticket from the phone is an auto-send item listed in XCT-05 Table A; this story adds no other queued action.
9. Ledger and audit. No ledger entry from the ticket itself. Audit entries for ticket created, assigned, replied, status changed, merged, linked, each action taken from it, with operator, time and the ticket reference.
10. Accessibility and language. The inbox is a table with keyboard access; the reply box grows with text; reply templates are written in plain language, no blame words, with the next step as a sentence and the exact time frame (no "soon").

**Data:** Support ticket, Transaction, Identity check, User, Device, Notification, Audit entry.
**Depends on:** OPS-01, OPS-03, OPS-05, ACC-04, ACC-05, ACC-11, WAL-14, RUL-07, NTF-05, XCT-05, XCT-14. The user-side view of the same record is OPS-07, which depends on this story.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the first-response promise is `TICKET_FIRST_RESPONSE_HOURS`, 24 (proposed), shown to the person as an absolute time; support hours are the hours that make that promise true and are published in the app. Closed: every shift covers Malagasy and French, English is best effort, because Malagasy is a first-class language (XCT-01). Closed: no phone line and no WhatsApp channel at launch; support is in-app tickets with an SMS reference (competitive analysis section 7 scopes the MVP to in-app support with ticket status), because a chat channel outside the app would hold money statements and identity data with no audit trail (the same reason NTF-12 gives for no operator-sent SMS). Revisit after the pilot with the ticket volume by category.

---

### OPS-07 Show the person the true status of their ticket

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `handle tickets`
**Tags:** sms, offline, audit

**Story:** As a Gereo operator, I want every status change I make to appear on the person's phone with the reference and the next step, so that nobody has to ask "where is my case".

**Conversation:** The top user complaint across money apps is "Where is my money?" and slow, silent support (competitive analysis section 4, points 1 and 3). A ticket status, a reference ID and an expected time are trust signals (07 UI/UX 2.8 R-S5; 08 competitor UX section 6.12: alerts, a shareable status page, a per-recipient delivery log). The ticket status on the user's phone is the same record the operator edits, never a copy that can differ. The support and account-safety views are the least evidenced part of the research (design foundations section 5), so this story is tested in the first test round.

**Preconditions:** A ticket exists (OPS-06).
**Trigger:** The operator changes the status, replies, or asks for information.

**Acceptance criteria:**
1. Happy path. The user's `Help` list shows each ticket with reference, subject, status word with icon and colour (Received, In review, Waiting for you, Resolved, Closed), last update time in the date format of XCT-03 and one line saying what happens next ("We will answer by Friday 17:00"). The status text comes from keys, not from operator free text.
2. Business rule, same record. The statuses on the user's phone and in the back office come from one field. A status change shows on the phone at the next sync and by push within one minute when the phone is online; the user cannot see a status the operator has not set.
3. Business rule, waiting for you. When the operator asks the person for something, the status becomes `Waiting for you`, the ticket shows what is needed and a button to answer (photo, text or confirm), and the ticket shows how long it will wait before it is closed.
4. Business rule, expected time. The ticket shows an expected response time built from `TICKET_FIRST_RESPONSE_HOURS` and the current queue; it is shown as an absolute time. If the operator target is missed, the user sees `We are late. Sorry. We will answer by {time}` with a new time set by the operator.
5. State, offline. The ticket list and the last replies are cached with a last-synced time (XCT-04). A reply the user writes offline is queued as `Waiting to send` (XCT-05). Opening a ticket never needs a connection for reading.
6. State, empty. With no tickets, the screen explains in one sentence what to use Help for and shows `Report a problem`; it never shows an empty table.
7. Business rule, safety. Every message from Gereo carries `Gereo never asks for your PIN or code`. A ticket reply from an operator cannot contain a request for a PIN or code; a check on outgoing text blocks messages containing words from a configurable list and shows the operator why.
8. Notifications. Base key `msg.ops.ticket_updated` (EV-OPS-01) with the variants `.inapp`, `.push` and `.sms`; in-app and push on each status change or reply. The `.sms` variant is sent only for Waiting for you and Resolved, and only when the push was not opened within the NTF-05 window (fallback rule); each SMS is GSM-7 safe, under 160 characters, with the reference ID (XCT-12). No SMS for Received or In review. NTF must mark EV-OPS-01 as SMS fallback for these two statuses (it lists in-app and push only today). The SMS text is a fixed template; an operator never sends free SMS text (NTF-12).
9. Ledger and audit. No ledger entry. Audit entries for each status change and for each notification sent (channel, time, delivery result), so that the operator can see who was told what (08 competitor UX section 6.12, Loomio delivery log).
10. Accessibility and language. The status chip uses icon, word and colour (XCT-09); status messages announce to screen readers; all keys exist in the three languages.

**Data:** Support ticket, Notification, Audit entry.
**Depends on:** OPS-06, NTF-05, XCT-03, XCT-04, XCT-05, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the user sees all five statuses, including In review, because a visible "In review" with an expected time answers "where is my case" (07 UI/UX 2.8 R-S5); hiding it would bring back silent waiting. Closed: no shareable status link in the MVP; the person quotes the reference ID, because a link to a ticket page would be a way to read someone's case without signing in.

---

### OPS-08 Post a "provider unavailable" banner and keep it up to date

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `publish incident`
**Tags:** sms, offline, ledger, audit

**Story:** When Vanilla Pay or a mobile money operator is down, I want to post an incident banner in three languages that appears in the app at once and tells people what works and when we will update, so I can stop a wave of "where is my money" tickets before it starts.

**Conversation:** Provider outages happen: MVola had material outages in November 2025 and May to June 2026 (competitive analysis section 2; 03 mobile money 7.3). The rule is to show a "provider unavailable" state, queue payouts rather than fail, never claim funds are lost, and provide a reference people can quote (competitive analysis section 6, point 7; 03 mobile money 7.1 point 6). The banner is one of the six shared components to design once (design foundations section 5). An outage at one operator does not stop the others, so scope matters. Whether new payouts are queued or refused during an incident is decided below: queue by default, with block as an operator setting for cases where queueing is unsafe.

**Preconditions:** The operator holds `publish incident`.
**Trigger:** The operator sees a provider problem (alerts from OPS-13, OPS-04, a provider message, user tickets).

**Acceptance criteria:**
1. Happy path, publish. The operator opens `ops.incident.new` and chooses: provider (Vanilla Pay, MVola, Orange Money, Airtel Money, other), affected actions (deposit, withdrawal, contribution payment, all), start time (now or earlier), severity, and a message from a template in Malagasy, French and English with an optional expected update time written as an absolute time in Madagascar time. A preview shows the banner in each language.
2. Business rule, display. The banner appears on all screens that start an affected action (wallet, money in, money out, contribution payment, review and PIN screens) within `BANNER_PROPAGATION_SECONDS`, with icon plus word, the provider name, what is affected, what still works (reading, voting, transfers between wallets) and the time of the last update. It never covers an amount or a PIN pad and is announced to screen readers as a status (XCT-09, XCT-10).
3. Business rule, behaviour during an incident. For each incident the operator sets one of two behaviours for new money-out requests: `Queue` (the request is accepted as in WAL-08 criterion 3: status Pending with the sub-label "Waiting for the provider", dispatched in order when the provider returns, and Failed with a reversing entry only after `PAYOUT_PROVIDER_WAIT_MAX`, owned by WAL) or `Block` (the person sees `{provider} is not available. Nothing was taken.` before entering the PIN; no request is authorised or queued, so this wording stays true). The default is `Queue`, as WAL-08 and SPD-11 already specify; `Block` is only for when the provider says it cannot accept requests or the float cannot cover the queue (see OPS-13). Deposits are never queued (WAL-08 criterion 2). Requests already sent before the incident keep their real status and are never marked Failed by the banner. In this story "Queue" means money held as Pending on the server (WAL-08), not the device queue of XCT-05; this story owns no queue parameter and only cites `PAYOUT_PROVIDER_WAIT_MAX` (WAL).
4. Business rule, updates. The operator posts timestamped updates (`Update 14:30: ...`) that replace the banner text and are kept in an incident timeline visible to users in `ops.incident.history`. Every update shows its time. A banner without an update for `INCIDENT_NO_NEWS_MINUTES` shows `No news yet since {time}` automatically.
5. Business rule, resolve. `Resolve` removes the banner, sets the end time, and notifies only the people affected, meaning people with a Pending request on that provider and people who registered "Tell me when it works" (WAL-08 criterion 2), through `msg.ops.provider_incident` with the state `resolved`. There is no message to the whole user base when the provider recovers (WAL-08 criterion 7). If requests were queued, each queued person gets the normal result message when their payout completes (WAL-11, NTF). Nothing is retried by the banner itself.
6. State, offline and stale. The banner is cached with its last-update time like other content (XCT-04). A user offline sees the last banner marked `Not updated since {time}`. An incident that the device has not heard about cannot be assumed over.
7. Errors. A banner that fails to publish shows the operator the reason and nothing partial is visible to users. A provider recovering earlier than expected does not remove the banner; only `Resolve` does, so the history is accurate.
8. Notifications. Push to users with a Pending request on the affected provider: `msg.ops.provider_incident` (EV-OPS-02, variants `.push`, `.sms` and `.inapp`) with the state `started`, which NTF lists for affected members. The `.sms` variant goes to those users only if the incident lasts longer than `INCIDENT_SMS_AFTER_MINUTES` and the push was not opened, to limit cost (OPS-12); the SMS stays within the length limit of XCT-12 (GSM-7 safe, 160 characters), with the reference ID of their request. No SMS to the whole user base. The queued-withdrawal message of WAL-08 criterion 7 is separate and is not repeated by this story.
9. Ledger and audit. The banner writes no ledger entry. Queued money-out requests follow the normal ledger rules (hold and release, WAL). Audit entries for incident created, updated, resolved, with operator, times and the affected scope, and the behaviour chosen.
10. Accessibility and language. All three languages are required before publish; the publish button is disabled with a reason if one is missing. The message uses plain words and exact times, never "soon".

**Data:** Incident, Transaction, Notification, Audit entry.
**Depends on:** OPS-01, WAL-08, SPD-11, NTF-05, XCT-04, XCT-10. OPS-13 alerts can trigger an incident, and a pause in OPS-13 depends on this story, not the reverse.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: queue by default, block as an exception (criterion 3), because the research rule is to queue payouts rather than fail them (competitive analysis section 6, point 7) and WAL-08 builds on it. Open, needs Vanilla Pay and counsel: whether holding a payout request while the provider is down is allowed and whether a float must pre-fund the queue (03 mobile money 7.3); default used: queue, and block when the provider cannot accept requests. Closed: anyone who holds `publish incident` may publish at any hour; the on-call operator holds it, and an incident posted at night is reviewed by a second holder the next morning in the Audit log. Closed: provider status pages never publish a banner by themselves in the MVP, because a wrong automatic banner on a money screen costs more trust than a late one; they may only raise an alert to the operator.

---

### OPS-09 Search the audit log

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `search audit log`
**Tags:** audit

**Story:** As a Gereo operator, I want to search every recorded action by person, object, action type, reference and time, so that I can answer "who did this and when" for a ticket, a dispute or a regulator.

**Conversation:** A complete audit log and a visible log of permission changes are core promises (info.md, permissions guard-rails and non-functional requirements). Admin fraud is the failure mode of tontines and chamas, and an audit trail is the product's answer (competitive analysis section 4, point 2). The log is also what proves an operator did not abuse access (OPS-01). Records of identity and transactions are kept for the period of ACC open question 1.

**Preconditions:** Audit entries exist (written by every other story).
**Trigger:** Operator opens `ops.audit`, or follows an audit link from a ticket, a case or an alert.

**Acceptance criteria:**
1. Happy path. The search form has: actor (user, operator or System, by masked identifier or ID), object type and object ID (group, wallet, transaction, vote, identity check, ticket), action type (permission granted, permission revoked, rule changed, sign-in, new device, PIN reset, lock, KYC decision, limit changed, fee changed, ledger correction, reveal, export), reference ID, group, device, and a date and time range in Madagascar time. A search needs at least one field, and the default range is the last 7 days.
2. Happy path, results. Results are a list, newest first, 20 to 30 rows per page: time (Madagascar time with UTC on hover), actor, action type in words, object, result (success or refused), reference. Opening a row shows before and after values, device, reason, linked objects and the operator permission used.
3. Business rule, immutability. There is no edit or delete control for audit entries. The only way to add information is a new note entry linked to the original, with the operator's ID.
4. Business rule, masking and reveal. Personal data in entries is masked as in OPS-01; revealing needs a reason and is logged. Entries about permission changes show the member, the permission name, who granted or revoked it and when, in the same wording that members see (GRP-10). An operator who reads the audit log of a group needs a reason, and the read is shown to the group's members as "Gereo support viewed the audit log. Reason: {reason}" (GRP-11 criterion 5), where the reason is the one picked from the short list, never free text.
5. Business rule, export. `Export results` produces a file of the filtered results and needs the same permission plus a reason; the export itself is an audit entry with the filters used and the number of rows. At most `AUDIT_EXPORT_MAX_ROWS` rows are exported and the file states if it was cut.
6. State, empty and large. A search with no result shows `No entries match` with the filters and a button to widen the date range. A search matching more than the maximum shows the count and asks the operator to narrow it.
7. State, loading. The first page appears within `AUDIT_SEARCH_TARGET_SECONDS` for a 7-day search; a longer search shows progress and can be cancelled. A failed search keeps the filters and shows `Search failed. Retry`, never an empty result.
8. Business rule, retention. Entries are kept for `AUDIT_RETENTION_YEARS`. The search says how far back data exists and shows `Older entries are archived` with the process to request them.
9. Notifications. None. Ledger. None. Audit: every search is itself recorded (operator, filters, time, number of results), because looking at the audit log is a sensitive act.
10. Accessibility and language. The form has visible labels, accepts a reference ID pasted with spaces, supports the keyboard and shows result counts to screen readers; action types are shown in words from keys, never raw codes.

**Data:** Audit entry, all objects referenced.
**Depends on:** OPS-01, GRP-10, GRP-11, ACC-14, plus every story that writes audit entries.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs counsel: retention and archiving duration (ACC open question 1); default used: `AUDIT_RETENTION_YEARS` is 5 (proposed, and at least `RECORD_RETENTION_YEARS`), entries older than 1 year may move to an archive that is searchable on request. Closed: members see their own entries through the export of ACC-14 and the group log of GRP-11, not through this screen, so operators and members never read the same raw record. Closed: the search target is `AUDIT_SEARCH_TARGET_SECONDS`, 5 (proposed).

---

### OPS-10 Review fraud and anomaly flags

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `manage flags`
**Tags:** legal-gate, audit

**Story:** As a Gereo operator, I want the system to raise flags on unusual behaviour with the evidence, so that I can decide quickly whether it is a mistake, a thief or a scam, and protect the person without accusing them.

**Conversation:** Fraud in mobile money is mostly social engineering around OTP and PIN, and SIM swap; operator terms put the loss on the customer and users blame the app (03 mobile money 6.7 point 4, 7.3). Anomaly detection and alerts are part of the controls (info.md). Rules to hold: first-time payee, a large amount for this wallet, or a new device raise a pause for the person (07 UI/UX 2.8 R-S3); this story is the operator side. Splitting payments just under a tax or limit threshold is a possible behaviour (03 mobile money 5.3 on the 150,000 Ar tax, status unresolved). Freezing funds and reporting suspicious activity have legal consequences; the story limits the operator to a time-limited hold on actions and leaves the reporting duty as an open question.

**Preconditions:** Rules are configured; events flow in.
**Trigger:** The System raises a flag; an operator opens `ops.flags`.

**Acceptance criteria:**
1. Happy path. The flag list shows: flag ID, rule name, severity, subject (user, group or device, masked), evidence summary in one sentence, status (New, In review, Cleared, Escalated, Action taken), created, age, assignee. A flag page shows the evidence: the events that triggered it with times, the device and sign-in history, linked transactions and the user's tier.
2. Business rule, rules. Rules are configuration, each with a name, a condition, a window and a severity; no threshold is hard-coded. The starting rule list (values set from the first weeks of data, rules start in log-only mode): many wrong PIN attempts across several accounts from one device; new device then money-out to a first-time payee within a short window; same ID number on several accounts; one device with many accounts; repeated OTP requests to many numbers from one source (a cost attack, see OPS-12); several payments just under a configured amount in a short window; amount far above the wallet's own history. A rule can be switched on or off by an operator with the permission, with a reason. One flag type is not a configurable rule: `vote-authorised payout, weak ballots`, defined in SPD-10. It holds a payout authorised by a passed vote for review when the payee is new to the group wallet and the final ballots are weak. The operator can only release or reject it; an operator is never a second approver and never counts toward the D4 floor. The reason is never shown to voters or to the group.
3. Business rule, operator actions. The operator can add a note, assign, clear with a reason code, escalate, request a verification retake (OPS-03), or place a temporary Operator hold on an account's money-out and sign-in (a hold on a wallet is in criterion 5). The hold needs a reason, expires after at most `FLAG_HOLD_MAX_HOURS` unless renewed with a new reason, and needs a second person, who holds `manage flags`, at or above `FLAG_SECOND_PERSON_SEVERITY`. An account hold is not a freeze of funds: money already received still posts to the ledger, including deposits and rule-made entries and their chains (decision D3), and nothing is moved or reversed by the hold. A hold on a person also stops that person from asking to spend and from approving or voting on group spending while it lasts; a held person is ineligible as approver or voter (GRP-13 AC2). Their earlier approvals remain on the audit trail but are re-checked at execution, where the dispatch check of SPD-10 treats a held approver as not eligible; a hold placed after a vote closes does not void that vote. An account hold never freezes a group wallet. Wallet freeze (SPD-15) is a member action that an operator can neither apply nor lift.
4. Business rule, what the person sees. A person under a hold sees `ops.flag.account_review`: "Your account is under a safety review. Contact support with reference {ref}." with the support route (OPS-06) and the end time of the hold. The message never says which rule fired and never accuses. Whether the message may be more specific is a legal question.
5. Business rule, group effect and wallet hold. A flag about a member never changes the group's ledger or permissions by itself; the operator cannot remove a member, edit a group's rules or move group money, and never counts toward the floor of GRP-13 (decisions D1 and D4). The target of an Operator hold may also be a wallet, group or personal. A wallet hold (UI label `Held by Gereo`, codes `wallet_held` and `destination_held`) blocks all money-out of that wallet, including every split leg and the Rounding line to Gereo, and does not block incoming money: deposits and rule-made credits still arrive and stay whole in the source wallet. Payouts already Pending finish; new ones are blocked. Every wallet hold needs a second person who holds `manage flags`, whatever the severity, and expires at `FLAG_HOLD_MAX_HOURS`; renewal needs a new reason. The group cannot lift it; only an operator or expiry can. A hold does not move money, consistent with the first sentence of this criterion. A held wallet raises no continuity alarm and no "no approver" recovery vote (GRP-14). The holders of Wallet: approve spend and Group: view audit log are always told, with the reference and the support route and never the reason (criterion 8).
6. State, empty and loading. An empty list shows `No open flags` with the time of the last rule run. A list loads in pages of 20 to 30. A rule engine that is not running shows a visible warning `Flag rules not running since {time}`, never silence.
7. Business rule, false positives. Each rule shows its counts of flags raised, cleared and actioned over a period so that rules with only cleared flags can be tuned. Tuning a rule is an Audit entry with before and after values.
8. Notifications. Operators on duty get an alert for a High severity flag (`ops.flag.alert`, channel as in the conventions). The person under a hold is told at once with `msg.acc.restricted` (EV-ACC-10 of NTF: in-app, push, SMS fallback; the length limit is that of XCT-12, GSM-7 safe and 160 characters, carrying the reference and support route). A wallet hold notifies the holders named in criterion 5 with `msg.ops.wallet_held` (to be added to the NTF catalogue; push first, SMS fallback, same length limit, reference and support route, no reason). A hold is never silent.
9. Ledger and audit. No ledger entry. Audit entries for flag raised, viewed, assigned, cleared, escalated, hold placed (account or wallet), second operator, renewed, lifted, rule changed, with operator IDs and times.
10. Accessibility and language. Severity uses icon, word and colour; evidence is shown as sentences, not raw JSON; the user-facing text is available in the three languages.

**Data:** Flag, Rule definition, User, Device, Transaction, Audit entry, Notification.
**Depends on:** OPS-01, OPS-03, OPS-06, ACC-05, ACC-11, WAL-10, GRP-13, GRP-14, SPD-10, SPD-15.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs counsel: legal duties on suspicious activity reporting and on telling the person, and whether a hold on money-out is allowed at all without a court or regulator step. Default used: the person is told at once (criterion 8) and the hold is time-limited; no report is filed by the product. Closed: starting rule values are set from the first weeks of data, not guessed now; until then every rule threshold is configuration and the rules start in "log only" mode that raises flags without holds. Closed: the on-call operator is the one who holds `manage flags` on the duty list; the duty list is managed by `manage operator access`.

---

### OPS-11 Configure tier limits and fees, with a second person and a start date

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `edit limits and fees` to propose; `approve limits and fees` for a second person to apply
**Tags:** legal-gate, ledger, audit

**Story:** As a Gereo operator, I want to set limits per tier and the fees per type of money movement as versioned settings with a future start date and a second approval, so that the app never hard-codes a number the regulator or the provider may change.

**Conversation:** Limits depend on the verification tier (info.md, account rules); the tier numbers and the CSBF instructions were not found (03 mobile money 5.1). The 100 000 000 Ar ceiling in the brief is unexplained and an individual operator wallet caps at 20 000 000 Ar (competitive analysis sections 6 and 9). Cross-network payouts cost 3 to 10 times more than same-network and the exact fee must be shown before confirmation (competitive analysis section 6, point 5). A tax line of 0.5% above 150,000 Ar was in the 2025 finance bill but its application is unverified, so tax and fee lines must be configurable without a schema change (competitive analysis section 6, point 9; 03 mobile money 5.3). Tag legal-gate and ledger: fees create ledger lines.

**Preconditions:** The operator holds the permission to propose; another operator holds the approval permission.
**Trigger:** Operator opens `ops.config.limits` or `ops.config.fees`.

**Acceptance criteria:**
1. Happy path, limits. A table lists each tier (Tier 1, 2, 3) against each limit type: balance cap, single deposit, single money-out, per day and per month totals (the set of limit types is configuration), including two named types: `receive a transfer` (the single-deposit limit and balance cap that apply to the recipient) and `transfer to another owner` (a money-out limit). Per-tier limits apply to whoever initiates or approves. A tier whose single money-out limit is zero is not money-out capable (GRP-13). A separate limit set for group wallets (balance cap, daily total, monthly total) sits beside it; cumulative totals belong to the wallet, not to a person. This story is the only place that holds limit numbers. Values are integer ariary shown in the amount format, or `no limit` explicitly. The current active version, its start time and the author are shown above the table.
2. Happy path, fees. A table lists each flow (deposit, withdrawal same-network, withdrawal cross-network, transfer between wallets, contribution, group expense payout, other flows added later) with the three parts of WAL-06, which owns the structure while this story holds only the values: the provider fee (`FEE_TABLE_PROVIDER`), the Gereo fee (`FEE_TABLE_GEREO`) and the tax line (`TAX_LINE`, off by default). Each part has a fee kind (fixed ariary, percentage, or both), the value, minimum and maximum. Who pays defaults to the person, on top of the amount, so the wallet receives exactly what the person chose (WAL-06); Gereo may be set to absorb a part for one flow. The Gereo fee starts at `0 Ar` in every flow, because the research rule is to charge on group size, SMS volume or analytics and never on core behaviour (competitive analysis section 7); the Gereo income lines are Fee (the Gereo part, here), Rounding (decision D5) and Platform: SMS allowance, and the last two are not configured here; Tax is a liability collected for the state, not income. Transfers between wallets show `0 Ar` unless configured otherwise.
3. Business rule, versioning. An edit creates a draft version, never changes the active one. The draft shows a diff against the active version and a preview of the effect (how many users would exceed a new limit, and what a sample payment would cost in each fee case in the amount format). The draft needs a start date and time in the future (Madagascar time) and a reason.
4. Business rule, approval. A different operator with the approval permission reviews the diff and approves or rejects with a reason; the proposer cannot approve (needs a second person). An approved version is Scheduled and becomes Active at its start time without a deployment; the previous version becomes Replaced. Only one version is active at a time.
5. Business rule, validation. Amounts are whole ariary; percentages have a configured precision; minimum is not above maximum; no negative values; a limit above a configured provider cap (for example the operator wallet cap of 20 000 000 Ar) shows a warning and needs a note; a fee change larger than `FEE_LARGE_CHANGE_PERCENT` of the active value needs a third approval from another holder of `approve limits and fees`. Invalid input shows the exact field and rule and keeps what was typed.
6. Business rule, effect. Every transaction and every expense request records the version of limits and fees in force. A limit change takes effect for a pending approval at the moment of approval and again at dispatch (SPD-10), with the version in force recorded on the request. Limits are compared on the amount excluding fees. The live fee on the amount screen and the review screen always come from the active version (WAL-06, WAL-09, WAL-13, SPD-01). A limit lowered below a user's current balance never removes money; it only blocks new deposits.
7. Business rule, notice. A fee increase is shown to users in the app from the approval time with the start date (`ops.fees.change_notice`, key in three languages) and the system enforces a minimum notice of `FEE_CHANGE_NOTICE_DAYS` between approval and start for increases; decreases and limit increases may start at once. A fee value change gives notice with its start date and needs no new consent from users; re-consent (ACC-13) happens only when a line type is added or the Rounding formula changes.
8. State. If the configuration cannot be loaded, the app uses the last cached values and the back office shows the problem; the app never falls back to zero or unlimited. Rolling back is a new version that copies an older one, never an edit.
9. Ledger and audit. Fee lines are written as ledger entries when a transaction settles (WAL-07, WAL-11) and appear as their own line (07 UI/UX 2.5 R-F5). Audit entries for draft created, edited, submitted, approved, rejected, activated, rolled back, with the diff, both operators and the reasons.
10. Accessibility and language. The preview uses the amount format, shows the fee as one number with detail behind `How is this calculated?` (07 UI/UX 2.5 R-F2), and the notice text is plain and exact.

**Data:** Tier configuration, Fee schedule, Tax line, Transaction (version reference), Audit entry.
**Depends on:** OPS-01, ACC-07, WAL-06, WAL-09, WAL-13, SPD-01, XCT-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs the regulator (CSBF), Vanilla Pay and counsel: all limit values and their legal basis. Default used: limits are configuration only; until values exist the app shows only the levels that exist (ACC-07) and a missing value is never treated as zero or unlimited (criterion 8). Closed: the provider fee is paid by the person on top and never reduces what the wallet receives (WAL-06); Gereo may absorb it for one flow by configuration. Open, needs Vanilla Pay: whether the 100 000 000 Ar ceiling is per transaction, per day or per account; default used: per transaction, `PAYOUT_MAX_PER_TX` (WAL-09). Open, needs counsel and Vanilla Pay: whether a mobile money tax applies and is collected by Gereo; default used: the tax line exists and is off. Open, needs counsel: the legally required notice before fee changes; default used: `FEE_CHANGE_NOTICE_DAYS` is 30. Closed: no Gereo fee on core flows at launch (criterion 2), so the revenue model choice does not block this story.

---

### OPS-12 Watch SMS spending and delivery

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `view sms costs`
**Tags:** sms, audit

**Story:** As a Gereo operator, I want to see how many SMS we send, in which language and for what, what they cost and whether they arrive, so that SMS stays an affordable safety net and a cost attack is caught early.

**Conversation:** SMS is a first-class channel and the fallback for everything critical, but it costs money: the Twilio list price quoted in the research is about USD 0.59 per segment and local aggregator rates are not checked (competitive analysis section 2; blocker 4 in section 10, an SMS aggregator quote). A single bad character multiplies the cost by turning one segment into several (XCT-12). The design rule says to charge on group size, SMS volume or advanced analytics, never on core behaviour (competitive analysis section 7), so the volume per group must be measurable. Fake OTP requests to many numbers are a known abuse, hence the OTP view.

**Preconditions:** Messages are sent through an aggregator that reports delivery (NTF).
**Trigger:** Operator opens `ops.sms`.

**Acceptance criteria:**
1. Happy path. The dashboard shows, for a chosen period (today, 7 days, 30 days, custom): messages sent, segments sent, cost in ariary, average segments per message, delivery rate (delivered, failed, unknown) and the time of the last data update. Cost is computed from `SMS_COST_PER_SEGMENT` per aggregator and per destination operator when rates differ.
2. Business rule, breakdowns. The operator can break down by base key (`msg.<epic>.<event>`, shown in words), by epic, by language, by destination operator, by payer class (NTF-06), by group (top groups by volume) and by day, with totals that match the headline numbers and the per-message log of NTF-12 for the same period. The shared basis with NTF-12 is messages accepted by the provider, counted by sent time on Madagascar calendar days; delivery results have 48 hours to arrive, and the comparison with the aggregator's own report (NTF-13) is made at 02:00 the following day. The cost view includes the invitation SMS sent to invitees with no device (the NTF-06 estimate) and shows, per group, the use of `ntf.group_sms_allowance` and of its share reserved for money-decision types, so that the allowance can be calibrated from real data.
3. Business rule, encoding. A panel lists templates and messages that were sent as UCS-2 or in more than one segment, with the template key, language and the character that caused it, so that XCT-12 breaches in production are found. The expected value is zero.
4. Business rule, OTP monitor. A panel shows OTP requests per hour, the success rate, the number of numbers that received more than `OTP_MAX_SENDS_PER_HOUR` codes (ACC-02), and the top sources. A spike above a configured factor of the usual level raises an alert and a flag (OPS-10).
5. Business rule, budget. A daily budget `SMS_BUDGET_DAILY_AR` can be set. At `SMS_BUDGET_WARN_PERCENT` of it a warning is shown, and at 100% an alert goes to operators on duty. Reaching the budget never stops SMS and never throttles anything automatically: OTP and security SMS must always go (NTF-06), and the throttle for group messages is the group allowance of NTF-06, not this budget.
6. State, empty and loading. Before an aggregator is connected the dashboard shows `ops.sms.not_connected` with what is needed; with no messages it shows zeros with the period, not a blank. A failed refresh keeps the last data with `Not updated since {time}. Retry`.
7. Business rule, data lag. Delivery results can arrive late; messages with no delivery report after `ntf.sms_report_timeout` (NTF) are counted as `unknown` and listed separately.
8. Notifications. Alerts for budget, encoding breaches and OTP spikes go to operators on duty (`ops.sms.alert`, channel as in the conventions). No user is notified by this story.
9. Ledger and audit. No ledger entry. Audit entries for views of the per-group breakdown (operator, time) and for any change of the budget or of the aggregator rate with before and after values.
10. Accessibility and language. Amounts in the amount format; charts are labelled directly and always paired with a table; breakdown names are in words, not raw keys.

**Data:** Notification (SMS), SMS template catalogue, Aggregator rate, Audit entry.
**Depends on:** OPS-01, NTF-06, NTF-07, NTF-12, XCT-12, OPS-10, ACC-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs an SMS aggregator quote: the aggregator, its rates, delivery reports and per-operator pricing. Default used: `SMS_COST_PER_SEGMENT` stays TBD, the dashboard shows counts and segments without a cost until a rate is entered, and the budget is not enforced. Closed: the platform pays for group SMS in the MVP, inside the allowance `ntf.group_sms_allowance` (NTF-06); a paid tier is revisited when the aggregator quote is known. Closed: policy at the daily budget is alert only (criterion 5).

---

### OPS-13 Watch and steer the payout queue

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `manage payouts`
**Tags:** ledger, legal-gate, audit

**Story:** As a Gereo operator, I want to see every money-out request, where it stands with the provider and how long it has been there, and to retry, escalate or pause dispatching safely, so that no payout is lost, double-sent or left unexplained.

**Conversation:** "Where is my money?" is the number one user complaint, with pending states that have no reference (competitive analysis section 4, point 1). Payout is often a separate and more restricted provider product, possibly needing a pre-funded float (03 mobile money 3.3, point 2), and provider callbacks can time out or double-notify (competitive analysis section 6, point 6). A payout above 20 000 000 Ar to a personal operator wallet may fail even if the aggregator allows more (03 mobile money 3.3, point 3). During an outage payouts queue and are never claimed lost (competitive analysis section 6, point 7). The operator must be able to steer without being able to edit the amount or payee. Tag legal-gate and ledger.

**Preconditions:** Money-out requests exist (WAL-09, WAL-13, SPD-10).
**Trigger:** Operator opens `ops.payouts`, or follows an alert.

**Acceptance criteria:**
1. Happy path. The queue lists: transaction reference, provider reference, user or group (masked), wallet, amount, fee, network (same or cross), status (the transaction statuses; a payout waiting for the provider is Pending with the sub-label "Waiting for the provider" and the filter `Queued`, as in WAL-08), whether it comes from a personal wallet, a passed vote or approvals (SPD-10), age in state, whether it was blocked by an Operator hold (`wallet_held` or `destination_held`, shown `Held by Gereo`), attempts, last provider response in words, linked ticket or flag. Headline counts and the total ariary in flight (client funds in transit) sit above the list.
2. Business rule, age alert. A dispatched payout (already sent to the provider) in Pending beyond `PAYOUT_PENDING_ALERT_MINUTES` becomes Needs attention (transaction) for the user (WAL-11, XCT-06) and gets a `Late` marker for the operator, with an alert to operators on duty (`ops.payout.late_alert`, channel as in the conventions). A payout not yet dispatched, shown as Pending with the sub-label "Waiting for the provider", is not late: it waits up to `PAYOUT_PROVIDER_WAIT_MAX` (WAL), separate from this alert value, and the operator sees its remaining time. A request still Needs attention (transaction) after `NEEDS_ATTENTION_ESCALATE_HOURS` (WAL) gets the `Escalated` marker and goes to a second operator who holds `manage payouts`.
3. Business rule, retry. `Retry` is offered only for states where it is safe; it re-sends the same idempotency key so the provider and Gereo cannot create a second payout. Before any retry the system asks the provider for the real status; if the provider says paid, the transaction moves to Confirmed instead and no new payout is sent. Retries are capped at `PAYOUT_RETRY_MAX`.
4. Business rule, cancel. `Cancel` is available only before the request was sent to the provider. It releases the hold on the wallet with a reversing entry (WAL-08 criterion 5) and moves the transaction to Cancelled. It is never offered after dispatch; after dispatch the operator can only wait, retry or mark for reconciliation. Cancelling an authorised group payout does not erase the authorisation: the expense request goes to Needs attention with the reason, and any retry uses the same authorisation while the request is unchanged (SPD-10, SPD-11); a vote is never run again.
5. Business rule, failed. When the provider reports failure, the hold is reversed by a reversing entry, the transaction moves to Failed, and the user sees whether money moved and what to do next (WAL-11). The operator sees the same text the user sees. A provider failure after a debit at the provider, with no credit, is marked Needs attention and linked to the reconciliation (OPS-04, OPS-05).
6. Business rule, no edits. The operator can never change the amount, the payee, the wallet or the fee of a request, can never approve, authorise or start a payout that the System has not authorised, and never counts toward the floor of GRP-13 (decisions D1 and D4). "Operator" here means an operator-console role or session, not a person's personal member account: operators never count toward the floor and cannot lift a freeze (SPD-15). Wrong-recipient cases are handled through a ticket (OPS-06) and the provider's own reversal process (competitive analysis section 2 notes the 7-day window and the 5% fee on a reversal), never by editing.
7. Business rule, pause. An operator can pause dispatch for one provider or for all, with a reason; requests keep arriving and show as Pending with the sub-label "Waiting for the provider". A pause is visible on top of the queue and in the app as an incident (OPS-08) when it affects users. Resuming is a separate action. A pause or resume for all providers needs a second person who holds `manage payouts`. A pause does not freeze a group wallet: that is the member action of SPD-15, and an operator cannot apply or lift it.
8. State, empty and loading. An empty queue shows `No payouts waiting` with the time of the last refresh. A failed load keeps the last list marked `Not updated since {time}. Retry`. Lists are paged at 20 to 30 rows.
9. Notifications. When a queued or late payout completes, the user gets the normal result message with the reference ID (`msg.wal.withdrawal_confirmed` or `msg.wal.withdrawal_failed`, with their `.sms` variants, EV-WAL-05 and EV-WAL-06 of NTF; push first, SMS fallback, one SMS per outcome, within the length limit of XCT-12). Users are not notified on an operator view.
10. Ledger and audit. Holds, releases and reversals are written as balanced ledger entries by the System (WAL); no operator action edits an entry. Audit entries for each retry, cancel, pause, resume, mark for reconciliation and note, with operator, time and reason.

**Data:** Transaction, Ledger entry, Provider response, Incident, Audit entry.
**Depends on:** OPS-01, OPS-04, OPS-05, OPS-08, WAL-08, WAL-09, WAL-11, SPD-10, SPD-11, SPD-15, XCT-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs Vanilla Pay: float and pre-funding of payouts and who manages it (03 mobile money 3.3 and 7.3, liquidity risk). Default used: Gereo pays queued payouts from the money already in the client-funds account (WAL-08), and a pause covers a provider that cannot pay. Open, needs Vanilla Pay: whether a status-check endpoint exists; default used: without one, `Retry` is not offered for a payout of unknown outcome and the case goes to reconciliation (WAL-07 criterion 6). Closed: this story keeps ownership of `PAYOUT_PENDING_ALERT_MINUTES` (value in the parameter table above, to be confirmed); WAL, SPD and XCT read it and never restate a value. Closed: retries are capped at `PAYOUT_RETRY_MAX`, 3 (proposed). Closed: a large discrepancy never pauses payouts automatically (OPS-05).

---

### OPS-14 Watch the vote and decision-log jobs

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `watch platform jobs`
**Tags:** audit

**Story:** As a Gereo operator, I want to be alerted when closing a vote or writing its decision fails, and to have a daily check that every closed vote has a decision entry, so that no result is lost and no payout waits on a vote the log does not show.

**Conversation:** A passed vote is the authorisation for a group payout (decision D4), and the decision log is immutable. Closing a vote and writing its decision entry is one atomic step, so a failure leaves the vote open or the pair unwritten, never half done. A silent failure would leave a group waiting with no sign. This story is the backstop for that step, not a second path: the daily check exists because an atomic step can still be skipped by a stuck job. A blocked payout is surfaced as a linked follow-up decision entry (the log is immutable, so the original entry is never edited). Operators have email and push, so the alert uses them; SMS is kept for the few High severity alerts of the conventions and this alert is not one of them.

**Preconditions:** The vote-close job and the decision-log write run (VOT-03, VOT-13).
**Trigger:** The System detects a failed vote-close job or a failed decision-log write; the daily check runs at `JOB_CHECK_RUN_TIME`.

**Acceptance criteria:**
1. Happy path, alert. A failed vote-close job and a failed decision-log write each raise an alert (`ops.job.alert`) to operators on duty. The alert names the job, the vote reference, the group (masked) and the time of failure. The channel is the operator alert channel used by OPS-13, limited to push and email; no SMS is sent for this alert, whatever its severity.
2. Business rule, daily backstop. At `JOB_CHECK_RUN_TIME` the System lists every vote closed in the last day (and any earlier one not yet cleared) that has no decision entry, and every payout that was marked `payout_blocked` and has no linked follow-up decision entry. Each gap raises one alert. A day with no gap shows `All closed votes have a decision entry` with the time of the check.
3. Business rule, no operator writes. An operator cannot create, edit or delete a decision entry and cannot change a vote result. The only action offered is `Run the write again`, which the System performs idempotently on the vote ID and which writes the entry the atomic step would have written, with the original close time. Rerunning twice creates one entry.
4. Business rule, money. For a gap on a money vote the page shows, read only, whether a payout authorised by that vote exists and its status. An operator never starts, releases or cancels that payout from here (OPS-13 and OPS-10 hold those actions) and never counts toward the D4 floor.
5. States. An alert has the statuses of the status table: Open, Acknowledged, Resolved. It is Resolved automatically when the next check finds the gap closed. An alert left Open past `DISCREPANCY_ESCALATE_HOURS` is re-sent with an `Escalated` marker. A failed daily check raises its own alert and never passes silently.
6. Empty and loading. An empty list shows `No open job alerts` with the time of the last check. A failed load keeps the last list with `Not updated since {time}. Retry`.
7. Notifications. Operators only. Members are not notified by this story; a member whose vote result is delayed sees the normal state of VOT.
8. Ledger and audit. No ledger entry. Audit entries for alert raised, acknowledged, rerun requested, rerun result and resolved, with operator, time and vote reference. Decision entries follow `AUDIT_RETENTION_YEARS`.
9. Accessibility and language. Alert severity and status use icon and word; the list is a table with keyboard access; operator text is in English and French.

**Data:** Vote, Decision, Platform job alert, Audit entry.
**Depends on:** OPS-01, OPS-13 (alert channel), VOT-03, VOT-13, SPD-10.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the story adds an alert and a check, not a new write path; the atomic close and decision write stays in VOT. Closed: no SMS, because the on-call SMS is reserved for High severity alerts and a late decision entry never moves money by itself. Open, needs the product owner: whether `watch platform jobs` is held by the same on-call operators as `manage payouts`; default used: it is granted separately by `manage operator access`.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| OPS-01 | Sign in to the back office and see only what my permissions allow | P0 | XCT-12 |
| OPS-02 | See the KYC review queue and pick the next case | P0 | OPS-01, ACC-02, ACC-04, ACC-05, ACC-06, ACC-08, ACC-10, OPS-06, OPS-10 |
| OPS-03 | Decide a KYC case: approve, reject with a reason, or ask for a retake | P0 | OPS-01, OPS-02, ACC-04, ACC-05, ACC-08, ACC-09, OPS-11, NTF-05, XCT-12 |
| OPS-04 | Check the ledger against Vanilla Pay every day and see the result | P0 | OPS-01, WAL-07, WAL-11, WAL-20, SPD-10 |
| OPS-05 | Get alerted to a discrepancy and resolve it with a reversing entry | P0 | OPS-01, OPS-04, WAL-18, WAL-20, NTF-05 |
| OPS-06 | Handle support tickets with the full context | P0 | OPS-01, OPS-03, OPS-05, ACC-04, ACC-05, ACC-11, WAL-14, RUL-07, NTF-05, XCT-05, XCT-14 |
| OPS-07 | Show the person the true status of their ticket | P1 | OPS-06, NTF-05, XCT-03, XCT-04, XCT-05, XCT-12 |
| OPS-08 | Post a "provider unavailable" banner and keep it up to date | P0 | OPS-01, WAL-08, SPD-11, NTF-05, XCT-04, XCT-10 |
| OPS-09 | Search the audit log | P0 | OPS-01, GRP-10, GRP-11, ACC-14 and every story that writes audit entries |
| OPS-10 | Review fraud and anomaly flags | P1 | OPS-01, OPS-03, OPS-06, ACC-05, ACC-11, WAL-10, GRP-13, GRP-14, SPD-10, SPD-15 |
| OPS-11 | Configure tier limits and fees, with a second person and a start date | P0 | OPS-01, ACC-07, WAL-06, WAL-09, WAL-13, SPD-01, XCT-02 |
| OPS-12 | Watch SMS spending and delivery | P1 | OPS-01, NTF-06, NTF-07, NTF-12, XCT-12, OPS-10, ACC-02 |
| OPS-13 | Watch and steer the payout queue | P0 | OPS-01, OPS-04, OPS-05, OPS-08, WAL-08, WAL-09, WAL-11, SPD-10, SPD-11, SPD-15, XCT-06, NTF-05 |
| OPS-14 | Watch the vote and decision-log jobs | P1 | OPS-01, OPS-13, VOT-03, VOT-13, SPD-10 |

Count: 14 stories. P0 is 10 (OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06, OPS-08, OPS-09, OPS-11, OPS-13). P1 is 4 (OPS-07, OPS-10, OPS-12, OPS-14). P2 is 0.

Note on size: OPS-03 and OPS-05 are the largest. If a sprint cannot hold them, split OPS-03 into approve and reject first, then duplicates and flags, and split OPS-05 into the alert, and then the two-person correction. OPS-01 (sign-in, masking, permission grants) and OPS-11 (limits, fees) each hold two capabilities and are split the same way when planned.

## Cross-epic dependencies

- **ACC-04, ACC-05, ACC-06, ACC-08, ACC-09, ACC-10, ACC-11** are the user side of the KYC queue, decisions, PIN reset, device recovery, number change, assisted onboarding and emergency lock handled in OPS-02, OPS-03, OPS-06 and OPS-10. **ACC-07** reads the limits configured in OPS-11. **ACC-14** exports audit entries about the person that OPS-09 searches. **ACC-13** discloses the fees of OPS-11 and the rounding amount to Gereo (decision D5).
- **WAL-07, WAL-08, WAL-11** deposit settlement, queued payouts and unclear outcomes that feed OPS-04, OPS-08 and OPS-13. **WAL-18** reversing entries behind OPS-05. **WAL-20** the ledger-matches-provider line fed by OPS-04. **WAL-06, WAL-09, WAL-13** the live fee line and limits read from OPS-11. **WAL-14** "Report this payment" creates the ticket of OPS-06.
- **SPD-10, SPD-11** expense payouts that enter the payout queue, which operators cannot approve or edit. **SPD-15** the group freeze, which operators cannot apply or lift. **GRP-10, GRP-11** permission and group audit entries searched in OPS-09. **GRP-13** the floor that no operator action may meet or bypass. **CON, VOT, PRJ, EVT, ANN, RUL** audit entries and flags from their actions (OPS-09, OPS-10).
- **NTF-05** push first and SMS fallback for every member message of this epic; **NTF-06, NTF-07, NTF-12** SMS allowance, template fit and the per-message log behind OPS-12.
- **XCT-02, XCT-03** amount and date formats; **XCT-04, XCT-05** cached banners and tickets and queued replies (OPS-07, OPS-08); **XCT-06** the user-side Pending and Needs attention states that feed OPS-13; **XCT-08 to XCT-10** accessibility of the back office; **XCT-12** SMS rules for every SMS of this epic; **XCT-14** message keys and glossary for operator templates.
- **VOT-03, VOT-13** the vote close and the decision-log write watched by OPS-14. **RUL-07** failed split runs that open tickets in OPS-06 and the rule firings that an Operator hold stops (OPS-10).

## Open questions

Closed unless the line says Open. Each open item states the default used and is the only kind that needs an outside party.

1. **Vanilla Pay data and terms.** Open, needs Vanilla Pay: statement or API for reconciliation, payout status and idempotency, settlement timing, float and pre-funding, incident communication, the legal status and who holds client funds (03 mobile money 3.2 and 7.4). Defaults used: manual statement import beside automatic fetch (OPS-04), settlement lag 1 day, no retry without a status endpoint (OPS-13), queue by default during an incident (OPS-08). Blocks OPS-04, OPS-05, OPS-08 and OPS-13 only for the final values.
2. **Operator model and legal duties.** Open, needs a Malagasy lawyer (competitive analysis section 10): licensing route, record retention (ACC open question 1), duties on suspicious activity reporting and on telling a person about a hold, what an operator may do with funds, the age of majority behind `KYC_MIN_AGE`, notice before fee changes. Defaults used: 5 years, the person told at once, no automatic report, `KYC_MIN_AGE` 18, 30 days of notice.
3. **Operator permissions and sign-in.** Closed: the catalogue is the table at the top of this file, the sign-in method is a password plus an authenticator code, the permission service is shared with members in a separate operator namespace, and the second-person grants are named in OPS-01 criterion 6.
4. **Numbers.** Closed for operations: every operational target now has a proposed value in the parameter table, tuned after the pilot. Open, needs the regulator, Vanilla Pay and counsel: limits, fee values and tax lines (OPS-11), and `SMS_COST_PER_SEGMENT` and `SMS_BUDGET_DAILY_AR` (needs the aggregator quote).
5. **Incident behaviour.** Closed: queue by default, block as an exception; any holder of `publish incident` may publish at any hour; provider status pages raise an alert, never a banner.
6. **SMS.** Open, needs an aggregator: aggregator, rates, delivery reports. Closed: the platform pays for group SMS in the MVP inside the NTF-06 allowance; the daily budget alerts and never throttles.
7. **KYC details.** Closed: second-person approval for Tier 3 and duplicate ID numbers only; rejection reasons are the shared list of OPS-03. Open, needs counsel and the regulator: accepted documents (default CIN and passport), image storage (default `RECORD_RETENTION_YEARS`; retention duration is ACC open question 1). Open, needs field testing: Malagasy wording of the reasons; face matching stays manual (`KYC_AUTO_MATCH_ENABLED` off, ACC).
8. **Support promise.** Closed: 24 hours first response (proposed), every shift covers Malagasy and French, no phone or WhatsApp at launch.
9. **Least certain screens.** Test the ticket status view (OPS-07) and the incident banner (OPS-08) in the first test round; design foundations section 5 marks them as the least evidenced.
