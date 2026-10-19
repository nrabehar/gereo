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

- The back office is a web application used on a desktop or laptop, and it must also work on a phone for an on-call operator. It follows the accessibility rules of XCT-08 to XCT-10 and the amount and date formats of XCT-02 and XCT-03. Operator-facing text is in English and French at first; Malagasy is required for every text the operator sends to a user (templates, reasons, banners). Message keys: operator UI `ops.<area>.<element>`, user-facing keys keep the epic of the feature they belong to, for example `push.acc.kyc_rejected`.
- There are no roles. Operator access is permissions only, granted individually, like everything else in Gereo. The permission names below are working names to be fixed in the information architecture because `info.md` defines no operator permissions: `review identity checks`, `view reconciliation`, `resolve discrepancy`, `approve ledger correction`, `handle tickets`, `publish incident`, `search audit log`, `manage flags`, `edit limits and fees`, `approve limits and fees`, `view sms costs`, `manage payouts`, `manage operator access`. "Operator" in a story means a person who holds the permission named in that story.
- Four-eyes rule: an action marked "needs a second person" is proposed by one operator and applied only after another operator, who cannot be the proposer, approves it. Both identities are written to the Audit log.
- Every operator action writes an Audit entry (who, what, object, before and after values, reason, time in UTC and Madagascar time). Audit entries are immutable. Personal data is masked by default (phone `034 ** *** 12`, ID number partly hidden); revealing it is a logged action with a reason.
- A ledger is never edited. An operator who needs to fix a balance proposes a reversing entry and a new entry (OPS-05), never an edit. Operators cannot move money from the back office except through the defined payout actions (OPS-13) and the approved corrections (OPS-05).
- Transaction statuses used here: Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention.
- Parameters in capitals are configurable. Values marked TBD are not decided and must not be guessed in code.

## Configurable parameters

| Parameter | Starting value | Source or status |
| --- | --- | --- |
| `OPERATOR_IDLE_MINUTES` | TBD | operator session idle limit |
| `KYC_REVIEW_TARGET_HOURS` | TBD | the time promised to users in ACC-09; the example "1 day" in 07 UI/UX 5.3 R-K4 is copy only |
| `KYC_MAX_ATTEMPTS` | TBD | shared with ACC |
| `RECON_RUN_TIME` | daily, time TBD | "rapprochement quotidien" in info.md section on money flows |
| `RECON_TOLERANCE_AR` | 0 | amounts are integers, so no rounding tolerance is needed |
| `DISCREPANCY_ESCALATE_HOURS` | TBD | |
| `TICKET_FIRST_RESPONSE_HOURS` | TBD | |
| `TICKET_REOPEN_DAYS` | TBD | |
| `PAYOUT_PENDING_ALERT_MINUTES` | TBD | |
| `BANNER_PROPAGATION_SECONDS` | TBD | |
| `FEE_CHANGE_NOTICE_DAYS` | TBD | |
| `SMS_COST_PER_SEGMENT` | TBD | competitive analysis section 2 quotes about USD 0.59 per segment on a global list price; local aggregator rates are not checked |
| `SMS_BUDGET_DAILY_AR` | TBD | |
| `FLAG_HOLD_MAX_HOURS` | TBD | |
| `AUDIT_RETENTION_YEARS` | at least 5 for identity and transaction records | Law 2016-056 Art. 53 as read in 03 mobile money 5.1; applicability depends on the operating model |

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

**Conversation:** The operators hold the most sensitive data (ID photos, phone numbers, balances) and the most dangerous actions (approve verification, correct the ledger). The product has no roles and the same principle applies here: permissions only, individually granted, changes audited (info.md, permissions guard-rails; 00-conventions section 2). The research warns that fraud by administrators is the dominant failure of group money (competitive analysis section 1), and an operator is an administrator at platform scale. Separation of funds and a complete audit log are non-functional requirements (info.md). The operator sign-in method is not decided; the story says what it must achieve.

**Preconditions:** The operator has an account created by another operator who holds `manage operator access`.
**Trigger:** Operator opens the back office.

**Acceptance criteria:**
1. Happy path. Sign-in needs two factors: a secret the operator knows and a one-time code from a device the operator owns. The method (phone code, authenticator app) is configured before launch. After sign-in the home shows only the tiles for which the operator holds a permission, each with a count (for example `KYC cases waiting: 12`).
2. Business rule, no hidden access. A direct link to a screen without the needed permission shows `ops.access.not_allowed` with the name of the missing permission and who can grant it. No data from that screen is loaded.
3. Business rule, masking. Phone numbers, ID numbers and names of users are masked in lists and in the audit log. A `Reveal` button opens the value for the current record after the operator picks a reason from a short list; each reveal writes an Audit entry. Photos of IDs open only inside the KYC case (OPS-03).
4. Business rule, sessions. The session ends after `OPERATOR_IDLE_MINUTES` of inactivity and after sign-out. A second sign-in by the same operator shows the operator the first session and offers to end it.
5. Business rule, no secrets. An operator can never see a user's PIN, a one-time code or a biometric template, and no screen has a field for them. Operators have no action that sends a user a message asking for a PIN or code (templates are fixed and reviewed, see XCT-12).
6. Business rule, grants. An operator who holds `manage operator access` can grant or revoke a permission for another operator; a grant of `approve ledger correction`, `approve limits and fees` or `manage operator access` needs a second person. An operator cannot grant a permission they do not hold, and cannot change their own permissions.
7. States. An operator whose access was just revoked sees the effect on the next click, not at next sign-in. If the permission service cannot be reached, every screen is closed with `ops.access.service_down` (fail closed) and no data is shown.
8. Errors. Wrong code or password shows a neutral message, locks after a configurable number of attempts for a configurable time, and notifies the person with `manage operator access`. No user data is involved.
9. Notifications. A grant or revoke sends an email or push (channel TBD) to the affected operator, key `ops.access.changed`. Operators never receive user data in notifications.
10. Ledger and audit. No ledger entry. Audit entries for sign-in, failed sign-in, session ended, reveal, grant, revoke, each with operator ID, device, time and reason.

**Data:** Operator (a User with back-office permissions), Audit entry.
**Depends on:** none. Used by every other OPS story.
**Pages:** to be filled from the information architecture.
**Open questions:** Operator sign-in method and device policy. Whether OpenFGA is used for operator permissions as for users (info.md says access control is OpenFGA with no roles). Whether Vanilla Pay or the aggregator needs a named operator list.

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

**Preconditions:** Users have submitted identity checks (ACC-08) or PIN-reset selfie checks (ACC-04).
**Trigger:** Operator opens `ops.kyc.queue`.

**Acceptance criteria:**
1. Happy path. The queue is a list with these columns: case reference, user (masked), case type (new tier request, PIN reset, device recovery), tier requested, submitted at, age with a clock, attempt number, source (self or assisted by a facilitator, ACC-10), automatic flags (blur, glare, name mismatch, ID number already used on another account), assignee, status (New, In review, Waiting for user, Decided).
2. Business rule, order. The default sort is by time left to `KYC_REVIEW_TARGET_HOURS`, oldest first. A case past the target shows a `Late` marker with icon and word, not colour alone. A filter bar offers type, tier, source, flag, assignee and status.
3. Business rule, claim. An operator opens a case with `Take`. A case taken by someone else shows their name and cannot be opened for decision by a second operator (a view-only open is allowed with a warning). A case untouched for a configurable time returns to the queue.
4. Business rule, counters. The header shows counts: waiting, late, in review, decided today, and the median age of waiting cases. These come from the same data as the list.
5. State, empty. An empty queue shows `ops.kyc.queue_empty` ("No cases waiting") and the time of the last refresh, not a blank table. A filter with no result says so and offers to clear filters.
6. State, loading and failure. A loading list shows a skeleton for the first load and a spinner within the list on refresh. A failed load keeps the last list with `Not updated since {time}. Retry` and never clears it.
7. Business rule, flags. A case with ID number already on another account, or a user with an open fraud flag (OPS-10), is marked and cannot be approved until the flag is read; the marker links to the flag.
8. Notifications. New and late cases raise a count in the back office header; a configurable alert goes to operators on duty when the number of late cases is above a threshold (key `ops.kyc.late_alert`, channel TBD). Users are not notified by this story.
9. Ledger and audit. No ledger entry. Audit entries for case taken, released, opened, with operator and time.
10. Accessibility and language. The list uses real table semantics with sortable column headers, works with a keyboard, and the user's language is shown per case so that the operator knows which rejection text the user will see.

**Data:** Identity check, User, Device, Audit entry.
**Depends on:** OPS-01, ACC-08, ACC-10, OPS-10.
**Pages:** to be filled from the information architecture.
**Open questions:** `KYC_REVIEW_TARGET_HOURS`; whether more than one operator may be needed for Tier 3 or for group treasurers (competitive analysis section 6, point 8).

---

### OPS-03 Decide a KYC case: approve, reject with a reason, or ask for a retake

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `review identity checks`
**Tags:** legal-gate, sms, audit

**Story:** As a Gereo operator, I want to compare the ID and the selfie against what the person typed, then approve, reject with a fixed reason or ask for one specific retake, so that each person gets a fair, specific answer and our records are complete.

**Conversation:** The review is where trust is won or lost: "keeps rejecting my national card" is the Money Fellows complaint. Reasons must be specific, actionable and never accusing; the rule is "Photo too dark. Move near a window", not "Your document is invalid" (07 UI/UX 5.3 R-K5; 08 competitor UX 6.1). Approval changes the tier and therefore the limits, so it has a legal weight; identity records are kept at least five years under Art. 53 as read in 03 mobile money 5.1. Whether an operator may approve a lower tier than asked is open.

**Preconditions:** An operator has taken a case (OPS-02).
**Trigger:** Operator opens the case.

**Acceptance criteria:**
1. Happy path. The case page shows the ID front and back and the selfie side by side with zoom and rotate; the data the user typed (legal name, document type and number, date of birth); the attempt history; and the automatic flags. A checklist has to be ticked before `Approve` is enabled: image is readable, typed data matches the document, document not expired, person is of legal age (age rule TBD), face matches, ID number not used on another account.
2. Happy path, approve. `Approve` sets the Identity check to Approved and the user's tier to the requested tier (or a lower one chosen by the operator with a reason, if allowed). The user's limits change from that moment (ACC-09, OPS-11). No ledger entry is created.
3. Business rule, reject. `Reject` requires at least one reason from the fixed list (photo too dark, photo blurred, glare on the document, document expired, name does not match, number does not match, face not clear, document type not accepted, other with a reason code). Each reason has a user-facing text and a tip in Malagasy, French and English. Free text typed by the operator is internal only and is never shown to the user.
4. Business rule, retake. `Ask for retake` marks specific items (front, back, selfie) to redo and keeps the passed items; the user returns to ACC-08 with the failed items marked. Retakes count as attempts; after `KYC_MAX_ATTEMPTS` the page shows `Escalate to support` and the user sees ACC-09 criterion 4.
5. Business rule, duplicates and flags. If the ID number is already linked to another account, approval is blocked and the operator must open the other case or flag (masked) and choose: reject with a reason, or send to a second person (needs a second person). The two accounts are linked in an internal note, never shown to either user.
6. Business rule, PIN reset and device recovery. For case types from ACC-04 and ACC-05 the page shows the stored reference selfie next to the new one; `Approve` completes the reset or device registration; `Reject` shows the user the fixed reason and keeps the account unchanged.
7. State, loading and failure. Images load progressively with a skeleton; if an image fails to load the checklist item is disabled with `Image not loaded. Retry`. A decision that fails to save shows `ops.kyc.decision_not_saved` and nothing is sent to the user.
8. Notifications. On every decision the user gets a push and an SMS in their language: `push.acc.kyc_approved`, `push.acc.kyc_rejected`, `sms.acc.kyc_approved`, `sms.acc.kyc_rejected` (GSM-7 safe, under 160 characters, with the reference ID and a short reason code; XCT-12). The push and SMS are sent only after the decision is saved.
9. Ledger and audit. No ledger entry. Audit entries for case opened, each image viewed, checklist state, decision, reason codes, tier before and after, operator and time. Images are encrypted at rest, and access to them is logged. Retention follows `AUDIT_RETENTION_YEARS` and the legal owner's decision.
10. Accessibility and language. The case page works at 200% font size; image viewing has a keyboard alternative; decision buttons are labelled with the outcome (`Approve Tier 2`, `Reject`), never `Yes` or `OK`.

**Data:** Identity check, User, Device, Notification, Audit entry.
**Depends on:** OPS-01, OPS-02, ACC-08, ACC-09, OPS-11, NTF, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** The list of rejection reasons and the Malagasy text. Whether second-person approval is required for Tier 3 or for people who can approve spending. Image storage place and duration.

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
2. Business rule, matching. A match requires the same provider reference, the same amount in integer ariary and a consistent status. Transactions in Pending beyond a configurable age are listed as `stuck`. Duplicate provider callbacks are matched to one transaction and counted as duplicates, never as two.
3. Business rule, balance check. The run also compares the sum of client wallet balances in the ledger with the balance reported for the client funds account at the provider, and shows both numbers and the difference (`RECON_TOLERANCE_AR`, starting at 0). Gereo's own funds are shown separately and never mixed in.
4. Business rule, drill down. An operator can open a run and filter by category (unmatched provider, unmatched Gereo, amount mismatch, duplicates, stuck). Each row shows the transaction reference, provider reference, amounts on both sides, statuses, wallet (masked user) and time, and links to the ticket or flag if one exists.
5. Business rule, immutability and reruns. A completed run is stored as it was and never edited. A rerun for the same date is allowed and creates a new run linked to the first; the earlier result stays visible. A rerun is idempotent: it never creates ledger entries by itself.
6. State, empty and failed. A day with no transactions shows `Completed, nothing to match`. A run that failed or is missing the provider report is shown in the list with the reason and raises an alert (OPS-05), never a blank row.
7. State, loading. The run list loads in pages of 20 to 30 rows; a running reconciliation shows its progress and the time since start.
8. Notifications. Completion with zero differences sends nothing. Any difference, failure or missing report sends the alert of OPS-05. Users are not notified by this story.
9. Ledger and audit. Reconciliation writes no ledger entry. Audit entries for run started, completed, failed, rerun, and for each operator view of a run (operator, time), so that nobody can quietly look and leave no trace.
10. Accessibility and language. Differences and totals use the amount format (`12 500 Ar`); status chips have icon, word and colour; the run list is a table with sortable headers and keyboard access.

**Data:** Reconciliation run, Transaction, Ledger entry, Audit entry.
**Depends on:** OPS-01, WAL (ledger and transaction statuses), payment adapter (technical), OPS-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Does Vanilla Pay provide a daily statement, an API or only a dashboard export? Settlement schedule (D+0, D+1, D+2). Where the client funds account sits and who holds it (03 mobile money 7.4). Whether the reconciliation also covers fees and any mobile money tax lines (03 mobile money 5.3).

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
1. Happy path, alert. An alert appears in the back office header and in `ops.recon.alerts` and is sent to operators on duty by email or push (channel TBD, key `ops.recon.alert`). It says the date, the number and total of differences and links to the run. Alerts are not merged away: each run with differences creates one alert.
2. Business rule, states. An alert is Open, Investigating, Resolved or Accepted as late. An operator moves it to Investigating with `Take`, which names them. An alert Open longer than `DISCREPANCY_ESCALATE_HOURS` is marked `Escalated` and re-sent to a second group of operators.
3. Business rule, cause. For each difference the operator picks a cause from a list: provider record arrived late; Gereo status not updated from a callback; duplicate callback; missing Gereo entry; wrong amount; provider fee not recorded; reversal at the provider; other with a note. A late provider record that arrives within the next run is closed automatically as `Accepted as late` with the link to both runs.
4. Business rule, correction. A correction is proposed as a reversing entry plus, if needed, a new correct entry; each is a balanced double entry, with the reason code, the alert ID and the proposer. It is applied only when a second operator, who holds `approve ledger correction`, approves it (needs a second person). The original entry is never edited or deleted.
5. Business rule, user effect. If a correction changes a user's or group's balance, the System sends them a message in their language (push and SMS; keys `push.wal.balance_corrected`, `sms.wal.balance_corrected`, owned by WAL and NTF) with the reference ID, the amount, the direction and the support route. The correction shows in the person's ledger with a reference to the reversed entry.
6. Business rule, no silent closure. An alert cannot be set to Resolved while any of its differences has no cause and no linked action. A reconciliation run after the correction must show the difference closed before the alert can be marked Resolved automatically.
7. State. The alerts list shows count of Open alerts, age of the oldest, total amount at stake. An empty list shows `No open discrepancies` with the date of the last clean run.
8. Errors. If a correction fails to post (for example the ledger rejects an unbalanced entry), nothing is applied, the proposer sees the reason and no user is notified. If approval does not happen, the proposal expires after a configurable time and returns the alert to Investigating.
9. Ledger and audit. Corrections are the only operator action that writes ledger entries (reversing and new entries), always in pairs that balance. Audit entries for alert raised, taken, cause set, correction proposed, approved, rejected, applied, with both operators' IDs and times.
10. Accessibility and language. The correction preview shows before and after balances in the amount format and in words, so that the approver sees the exact effect; the approval button names the effect (`Approve correction of 12 500 Ar`).

**Data:** Reconciliation run, Discrepancy alert, Ledger entry, Transaction, Notification, Audit entry.
**Depends on:** OPS-01, OPS-04, WAL (ledger, reversing entries), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Who may approve corrections above a configured amount (a third person?); whether a discrepancy above a threshold should pause payouts automatically (see OPS-13, which only allows a manual pause); how a loss caused by the provider is booked and who bears it.

---

### OPS-06 Handle support tickets with the full context

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `handle tickets`
**Tags:** audit

**Story:** As a Gereo operator, I want every ticket to arrive with the reference ID, the transaction and the user's language already attached, so that I can answer in one reply instead of asking questions.

**Conversation:** Support is slow on every money product's review page (competitive analysis section 1, point 3, and section 4, point 3). "Report a problem" on every transaction pre-fills the reference ID and the transaction details for support (07 UI/UX 2.6 R-E3). A named support channel with a response time is a trust signal (R-S5). Tickets come from in-app support, from account-safety flows (ACC-04, ACC-05, ACC-11), from the KYC escalation (OPS-03) and from an operator-created ticket after a phone call. MVP scope says in-app support with ticket status (competitive analysis section 7).

**Preconditions:** A user opened a ticket from the app, or an operator created one.
**Trigger:** Operator opens `ops.tickets`.

**Acceptance criteria:**
1. Happy path, inbox. The inbox lists tickets with: reference (copyable), category (money, identity, access, group, other), user (masked) and language, linked object (transaction, KYC case, group), status, assignee, created at, last update, time to first response and a `Late` marker past `TICKET_FIRST_RESPONSE_HOURS`. Filters: status, category, assignee, language, late, linked object.
2. Happy path, ticket page. The page shows the conversation, the linked transaction with its status and ledger entries (read only), the user's tier and recent safety events (new device, PIN reset, lock), and the other open tickets of the same user. Replies are written in the user's language using templates in Malagasy, French and English that an operator may edit before sending. Machine translation is never used for money statements.
3. Business rule, statuses. Operators move a ticket through Received, In review, Waiting for user, Resolved, Closed (OPS-07 defines what the user sees). Moving to Resolved needs a resolution code; closing needs the user's reply or the passing of a configurable time after Resolved. A user reply after Resolved reopens it within `TICKET_REOPEN_DAYS`.
4. Business rule, actions. From a ticket the operator can link a KYC case, open the discrepancy or flag for the same transaction, unlock a locked account after the checks of ACC-11 (needs a second person for unlock where the lock came from a fraud flag), and send a verification retake request. Every action is a button with the same permission as the equivalent screen, so a ticket never gives more power than the operator already has.
5. Business rule, merge and notes. Duplicates are merged with a link kept both ways. Internal notes are visible only to operators and are never shown to the user. A ticket may be assigned to another operator with a note.
6. State, empty and loading. An empty inbox shows `ops.tickets.empty` with the time of last refresh. A failing load keeps the previous list with `Not updated since {time}. Retry`.
7. Business rule, privacy. The user's masked data is shown first; a `Reveal` for phone or ID number needs a reason (OPS-01). Attachments from the user (screenshots) are shown with a warning that they may hold other people's data and are kept for the configured time.
8. Notifications. Each operator reply, status change and request for information sends a push and, per the rules of OPS-07, an SMS to the user in their language, with the ticket reference. Operators receive a count of late tickets in the header.
9. Ledger and audit. No ledger entry from the ticket itself. Audit entries for ticket created, assigned, replied, status changed, merged, linked, each action taken from it, with operator, time and the ticket reference.
10. Accessibility and language. The inbox is a table with keyboard access; the reply box grows with text; reply templates are written in plain language, no blame words, with the next step as a sentence and the exact time frame (no "soon").

**Data:** Support ticket, Transaction, Identity check, User, Device, Notification, Audit entry.
**Depends on:** OPS-01, OPS-03, OPS-05, OPS-07, NTF, XCT-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Support hours and a first-response promise (`TICKET_FIRST_RESPONSE_HOURS`); languages covered by operators on every shift; whether a phone line or a WhatsApp channel is offered at launch (design foundations section 6, question 4).

---

### OPS-07 Show the person the true status of their ticket

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `handle tickets`
**Tags:** sms, offline, audit

**Story:** As a Gereo operator, I want every status change I make to appear on the person's phone with the reference and the next step, so that nobody has to ask "where is my case".

**Conversation:** The top user complaint across money apps is "Where is my money?" and slow, silent support (competitive analysis section 4, points 1 and 3). A ticket status, a reference ID and an expected time are trust signals (07 UI/UX 2.8 R-S5; 08 competitor UX section 6.12: alerts, a shareable status page, a per-recipient delivery log). The ticket status on the user's phone is the same record the operator edits, never a copy that can differ. The user-side screen belongs to the "Support, export and account safety" wireframe (design foundations section 5, screen 26), the least certain screen in the research.

**Preconditions:** A ticket exists (OPS-06).
**Trigger:** The operator changes the status, replies, or asks for information.

**Acceptance criteria:**
1. Happy path. The user's `Help` list shows each ticket with reference, subject, status word with icon and colour (Received, In review, Waiting for you, Resolved, Closed), last update time in the date format of XCT-03 and one line saying what happens next ("We will answer by Friday 17:00"). The status text comes from keys, not from operator free text.
2. Business rule, same record. The statuses on the user's phone and in the back office come from one field. A status change shows on the phone within one sync and by push within seconds; the user cannot see a status the operator has not set.
3. Business rule, waiting for you. When the operator asks the person for something, the status becomes `Waiting for you`, the ticket shows what is needed and a button to answer (photo, text or confirm), and the ticket shows how long it will wait before it is closed.
4. Business rule, expected time. The ticket shows an expected response time built from `TICKET_FIRST_RESPONSE_HOURS` and the current queue; it is shown as an absolute time. If the operator target is missed, the user sees `We are late. Sorry. We will answer by {time}` with a new time set by the operator.
5. State, offline. The ticket list and the last replies are cached with a last-synced time (XCT-04). A reply the user writes offline is queued as `Waiting to send` (XCT-05). Opening a ticket never needs a connection for reading.
6. State, empty. With no tickets, the screen explains in one sentence what to use Help for and shows `Report a problem`; it never shows an empty table.
7. Business rule, safety. Every message from Gereo carries `Gereo never asks for your PIN or code`. A ticket reply from an operator cannot contain a request for a PIN or code; a check on outgoing text blocks messages containing words from a configurable list and shows the operator why.
8. Notifications. Push `push.ops.ticket_updated` on each status change or reply. SMS `sms.ops.ticket_waiting` and `sms.ops.ticket_resolved` only for Waiting for you and Resolved, and only when the push was not opened after a configurable time; each SMS is GSM-7 safe, under 160 characters, with the reference ID (XCT-12). No SMS for Received or In review.
9. Ledger and audit. No ledger entry. Audit entries for each status change and for each notification sent (channel, time, delivery result), so that the operator can see who was told what (08 competitor UX section 6.12, Loomio delivery log).
10. Accessibility and language. The status chip uses icon, word and colour (XCT-09); status messages announce to screen readers; all keys exist in the three languages.

**Data:** Support ticket, Notification, Audit entry.
**Depends on:** OPS-06, NTF, XCT-03, XCT-04, XCT-05, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Does the user see internal wait statuses such as In review, or only Received, Waiting for you and Resolved? Whether a ticket status can be shared by link or by SMS reference only (08 competitor UX 6.12 opportunity).

---

### OPS-08 Post a "provider unavailable" banner and keep it up to date

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `publish incident`
**Tags:** sms, offline, ledger, audit

**Story:** When Vanilla Pay or a mobile money operator is down, I want to post an incident banner in three languages that appears in the app at once and tells people what works and when we will update, so I can stop a wave of "where is my money" tickets before it starts.

**Conversation:** Provider outages happen: MVola had material outages in November 2025 and May to June 2026 (competitive analysis section 2; 03 mobile money 7.3). The rule is to show a "provider unavailable" state, queue payouts rather than fail, never claim funds are lost, and provide a reference people can quote (competitive analysis section 6, point 7; 03 mobile money 7.1 point 6). The banner is one of the six shared components to design once (design foundations section 5). An outage at one operator does not stop the others, so scope matters. Whether new payouts are queued or refused during an incident is a product and legal decision (open question), so the incident carries it as a setting.

**Preconditions:** The operator holds `publish incident`.
**Trigger:** The operator sees a provider problem (alerts from OPS-13, OPS-04, a provider message, user tickets).

**Acceptance criteria:**
1. Happy path, publish. The operator opens `ops.incident.new` and chooses: provider (Vanilla Pay, MVola, Orange Money, Airtel Money, other), affected actions (deposit, withdrawal, contribution payment, all), start time (now or earlier), severity, and a message from a template in Malagasy, French and English with an optional expected update time written as an absolute time in Madagascar time. A preview shows the banner in each language.
2. Business rule, display. The banner appears on all screens that start an affected action (wallet, money in, money out, contribution payment, review and PIN screens) within `BANNER_PROPAGATION_SECONDS`, with icon plus word, the provider name, what is affected, what still works (reading, voting, transfers between wallets) and the time of the last update. It never covers an amount or a PIN pad and is announced to screen readers as a status (XCT-09, XCT-10).
3. Business rule, behaviour during an incident. For each incident the operator sets one of two behaviours for new money-out requests: `Queue` (the request is accepted, shown as Pending with the text `Waiting for {provider}. Nothing to do. We will SMS you.` and dispatched when the provider returns) or `Block` (the person sees `{provider} is not available. Nothing was taken.` before entering the PIN). The default is `Block` until legal and product decide otherwise (open question). Requests already sent before the incident keep their real status and are never marked Failed by the banner.
4. Business rule, updates. The operator posts timestamped updates (`Update 14:30: ...`) that replace the banner text and are kept in an incident timeline visible to users in `ops.incident.history`. Every update shows its time. A banner without an update for a configurable time shows `No news yet since {time}` automatically.
5. Business rule, resolve. `Resolve` removes the banner, sets the end time, and sends a push to everyone affected (`push.ops.incident_resolved`). If requests were queued, each queued person gets the normal result push and SMS when their payout completes (WAL, NTF). Nothing is retried by the banner itself.
6. State, offline and stale. The banner is cached with its last-update time like other content (XCT-04). A user offline sees the last banner marked `Not updated since {time}`. An incident that the device has not heard about cannot be assumed over.
7. Errors. A banner that fails to publish shows the operator the reason and nothing partial is visible to users. A provider recovering earlier than expected does not remove the banner; only `Resolve` does, so the history is accurate.
8. Notifications. Push to users with a Pending request on the affected provider: `push.ops.incident_started`. SMS `sms.ops.incident_pending` to those users only if the incident lasts longer than a configurable time, to limit cost (OPS-12); the SMS is GSM-7 safe, under 160 characters, with the reference ID of their request. No SMS to the whole user base.
9. Ledger and audit. The banner writes no ledger entry. Queued money-out requests follow the normal ledger rules (hold and release, WAL). Audit entries for incident created, updated, resolved, with operator, times and the affected scope, and the behaviour chosen.
10. Accessibility and language. All three languages are required before publish; the publish button is disabled with a reason if one is missing. The message uses plain words and exact times, never "soon".

**Data:** Incident, Transaction, Notification, Audit entry.
**Depends on:** OPS-01, OPS-13, WAL, NTF, XCT-04, XCT-10.
**Pages:** to be filled from the information architecture.
**Open questions:** Queue or block during an incident (legal view on holding a payout request, user expectation, float). Who may publish at night. Whether provider status pages can feed a draft incident automatically.

---

### OPS-09 Search the audit log

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** `search audit log`
**Tags:** audit

**Story:** As a Gereo operator, I want to search every recorded action by person, object, action type, reference and time, so that I can answer "who did this and when" for a ticket, a dispute or a regulator.

**Conversation:** A complete audit log and a visible log of permission changes are core promises (info.md, permissions guard-rails and non-functional requirements). Admin fraud is the failure mode of tontines and chamas, and an audit trail is the product's answer (competitive analysis section 4, point 2). The log is also what proves an operator did not abuse access (OPS-01). Records of identity and transactions must be kept at least five years under Art. 53 as read in 03 mobile money 5.1.

**Preconditions:** Audit entries exist (written by every other story).
**Trigger:** Operator opens `ops.audit`, or follows an audit link from a ticket, a case or an alert.

**Acceptance criteria:**
1. Happy path. The search form has: actor (user, operator or System, by masked identifier or ID), object type and object ID (group, wallet, transaction, vote, identity check, ticket), action type (permission granted, permission revoked, rule changed, sign-in, new device, PIN reset, lock, KYC decision, limit changed, fee changed, ledger correction, reveal, export), reference ID, group, device, and a date and time range in Madagascar time. A search needs at least one field, and the default range is the last 7 days.
2. Happy path, results. Results are a list, newest first, 20 to 30 rows per page: time (Madagascar time with UTC on hover), actor, action type in words, object, result (success or refused), reference. Opening a row shows before and after values, device, reason, linked objects and the operator permission used.
3. Business rule, immutability. There is no edit or delete control for audit entries. The only way to add information is a new note entry linked to the original, with the operator's ID.
4. Business rule, masking and reveal. Personal data in entries is masked as in OPS-01; revealing needs a reason and is logged. Entries about permission changes show the member, the permission name, who granted or revoked it and when, in the same wording that members see (GRP).
5. Business rule, export. `Export results` produces a file of the filtered results and needs the same permission plus a reason; the export itself is an audit entry with the filters used and the number of rows. A configurable maximum number of rows applies and the file states if it was cut.
6. State, empty and large. A search with no result shows `No entries match` with the filters and a button to widen the date range. A search matching more than the maximum shows the count and asks the operator to narrow it.
7. State, loading. The first page appears within `AUDIT_SEARCH_TARGET_SECONDS` for a 7-day search (value TBD); a longer search shows progress and can be cancelled. A failed search keeps the filters and shows `Search failed. Retry`, never an empty result.
8. Business rule, retention. Entries are kept for `AUDIT_RETENTION_YEARS` at least (five for identity and transaction records if the legal owner confirms). The search says how far back data exists and shows `Older entries are archived` with the process to request them.
9. Notifications. None. Ledger. None. Audit: every search is itself recorded (operator, filters, time, number of results), because looking at the audit log is a sensitive act.
10. Accessibility and language. The form has visible labels, accepts a reference ID pasted with spaces, supports the keyboard and shows result counts to screen readers; action types are shown in words from keys, never raw codes.

**Data:** Audit entry, all objects referenced.
**Depends on:** OPS-01, plus every story that writes audit entries.
**Pages:** to be filled from the information architecture.
**Open questions:** Retention and archiving duration; whether members can see their own audit entries and how that is shown (ACC-14 exports them); search performance target.

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
2. Business rule, rules. Rules are configuration, each with a name, a condition, a window and a severity; no threshold is hard-coded. The starting rule list (values TBD): many wrong PIN attempts across several accounts from one device; new device then money-out to a first-time payee within a short window; same ID number on several accounts; one device with many accounts; repeated OTP requests to many numbers from one source (a cost attack, see OPS-12); several payments just under a configured amount in a short window; amount far above the wallet's own history. A rule can be switched on or off by an operator with the permission, with a reason.
3. Business rule, operator actions. The operator can add a note, assign, clear with a reason code, escalate, request a verification retake (OPS-03), or place a temporary hold on the account's money-out and sign-in. The hold needs a reason, expires after at most `FLAG_HOLD_MAX_HOURS` unless renewed with a new reason, and needs a second person above a configurable severity. A hold is not a freeze of funds: money already received still posts to the ledger and nothing is moved or reversed by the hold.
4. Business rule, what the person sees. A person under a hold sees `ops.flag.account_review`: "Your account is under a safety review. Contact support with reference {ref}." with the support route (OPS-06) and the end time of the hold. The message never says which rule fired and never accuses. Whether the message may be more specific is a legal question.
5. Business rule, group effect. A flag about a member never changes the group's ledger or permissions by itself; the operator cannot remove a member, edit a group's rules or move group money (GRP, SPD).
6. State, empty and loading. An empty list shows `No open flags` with the time of the last rule run. A list loads in pages of 20 to 30. A rule engine that is not running shows a visible warning `Flag rules not running since {time}`, never silence.
7. Business rule, false positives. Each rule shows its counts of flags raised, cleared and actioned over a period so that rules with only cleared flags can be tuned. Tuning a rule is an Audit entry with before and after values.
8. Notifications. Operators on duty get an alert for a High severity flag (`ops.flag.alert`, channel TBD). The person under a hold gets `push.ops.account_review` and `sms.ops.account_review` (GSM-7 safe, under 160 characters, reference and support route).
9. Ledger and audit. No ledger entry. Audit entries for flag raised, viewed, assigned, cleared, escalated, hold placed, renewed, lifted, rule changed, with operator IDs and times.
10. Accessibility and language. Severity uses icon, word and colour; evidence is shown as sentences, not raw JSON; the user-facing text is available in the three languages.

**Data:** Flag, Rule definition, User, Device, Transaction, Audit entry, Notification.
**Depends on:** OPS-01, OPS-03, OPS-06, ACC-05, ACC-11, WAL, SPD.
**Pages:** to be filled from the information architecture.
**Open questions:** Legal duties on suspicious activity reporting and on telling the person; whether a hold on money-out is allowed without notice. Starting rule values after the first weeks of data. Who is on call and when.

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
1. Happy path, limits. A table lists each tier (Tier 1, 2, 3) against each limit type: balance cap, single deposit, single money-out, per day and per month totals (the set of limit types is configuration). Values are integer ariary shown in the amount format, or `no limit` explicitly. The current active version, its start time and the author are shown above the table.
2. Happy path, fees. A table lists each flow (deposit, withdrawal same-network, withdrawal cross-network, transfer between wallets, contribution, payout to a group, other flows added later) with: fee kind (fixed ariary, percentage, or both), the value, minimum, maximum, who pays (sender, recipient, Gereo), and a separate tax line (kind and value, off by default). Transfers between wallets show `0 Ar` unless configured otherwise.
3. Business rule, versioning. An edit creates a draft version, never changes the active one. The draft shows a diff against the active version and a preview of the effect (how many users would exceed a new limit, and what a sample payment would cost in each fee case in the amount format). The draft needs a start date and time in the future (Madagascar time) and a reason.
4. Business rule, approval. A different operator with the approval permission reviews the diff and approves or rejects with a reason; the proposer cannot approve (needs a second person). An approved version becomes active at its start time without a deployment. Only one version is active at a time.
5. Business rule, validation. Amounts are whole ariary; percentages have a configured precision; minimum is not above maximum; no negative values; a limit above a configured provider cap (for example the operator wallet cap) shows a warning and needs a note; a fee change above a configured size needs a third approval. Invalid input shows the exact field and rule and keeps what was typed.
6. Business rule, effect. Every transaction records the version of limits and fees applied. The live fee on the amount screen and the review screen always come from the active version (WAL, SPD). A limit lowered below a user's current balance never removes money; it only blocks new deposits.
7. Business rule, notice. A fee increase is shown to users in the app from the approval time with the start date (`ops.fees.change_notice`, key in three languages) and the system enforces a minimum notice of `FEE_CHANGE_NOTICE_DAYS` (value TBD) between approval and start for increases; decreases and limit increases may start at once.
8. State. If the configuration cannot be loaded, the app uses the last cached values and the back office shows the problem; the app never falls back to zero or unlimited. Rolling back is a new version that copies an older one, never an edit.
9. Ledger and audit. Fee lines are written as ledger entries when a transaction settles (WAL) and appear as their own line (07 UI/UX 2.5 R-F5). Audit entries for draft created, edited, submitted, approved, rejected, activated, rolled back, with the diff, both operators and the reasons.
10. Accessibility and language. The preview uses the amount format, shows the fee as one number with detail behind `How is this calculated?` (07 UI/UX 2.5 R-F2), and the notice text is plain and exact.

**Data:** Tier configuration, Fee schedule, Tax line, Transaction (version reference), Audit entry.
**Depends on:** OPS-01, ACC-07, WAL, SPD, XCT-02.
**Pages:** to be filled from the information architecture.
**Open questions:** All values (limits and fees) and the legal basis for them; who bears provider fees; whether the 100 000 000 Ar ceiling is per transaction, per day or per account; whether a mobile money tax applies and is collected by Gereo; legally required notice before fee changes; the business model choices (info.md, revenue sources to be decided).

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
2. Business rule, breakdowns. The operator can break down by template key (OTP, receipt, vote deadline, contribution due, event reminder, security, KYC, support), by language, by destination operator, by group (top groups by volume) and by day, with totals that match the headline numbers.
3. Business rule, encoding. A panel lists templates and messages that were sent as UCS-2 or in more than one segment, with the template key, language and the character that caused it, so that XCT-12 breaches in production are found. The expected value is zero.
4. Business rule, OTP monitor. A panel shows OTP requests per hour, the success rate, the number of numbers that received more than a configured number of codes, and the top sources. A spike above a configured factor of the usual level raises an alert and a flag (OPS-10).
5. Business rule, budget. A daily budget `SMS_BUDGET_DAILY_AR` can be set. At a configured fraction of it a warning is shown, and at 100% an alert goes to operators on duty. Reaching the budget does not stop OTP or security SMS; the story leaves the decision to throttle other SMS to a person (open question).
6. State, empty and loading. Before an aggregator is connected the dashboard shows `ops.sms.not_connected` with what is needed; with no messages it shows zeros with the period, not a blank. A failed refresh keeps the last data with `Not updated since {time}. Retry`.
7. Business rule, data lag. Delivery results can arrive late; messages with no delivery report after a configurable time are counted as `unknown` and listed separately.
8. Notifications. Alerts for budget, encoding breaches and OTP spikes go to operators on duty (`ops.sms.alert`, channel TBD). No user is notified by this story.
9. Ledger and audit. No ledger entry. Audit entries for views of the per-group breakdown (operator, time) and for any change of the budget or of the aggregator rate with before and after values.
10. Accessibility and language. Amounts in the amount format; charts are labelled directly and always paired with a table; breakdown names are in words, not raw keys.

**Data:** Notification (SMS), SMS template catalogue, Aggregator rate, Audit entry.
**Depends on:** OPS-01, NTF, XCT-12, OPS-10.
**Pages:** to be filled from the information architecture.
**Open questions:** The aggregator, its rates, delivery reports and per-operator pricing; who pays for group SMS (the group owner, Gereo, or a paid tier); policy at the daily budget.

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

**Preconditions:** Money-out requests exist (WAL, SPD).
**Trigger:** Operator opens `ops.payouts`, or follows an alert.

**Acceptance criteria:**
1. Happy path. The queue lists: transaction reference, provider reference, user or group (masked), wallet, amount, fee, network (same or cross), state (Initiated, Pending, Queued for provider, Failed, Needs attention, Confirmed today), age in state, attempts, last provider response in words, linked ticket or flag. Headline counts and the total ariary in flight (client funds in transit) sit above the list.
2. Business rule, age alert. A request in Pending beyond `PAYOUT_PENDING_ALERT_MINUTES` becomes Needs attention for the user (XCT-06) and gets a `Late` marker for the operator, with an alert to operators on duty (`ops.payout.late_alert`, channel TBD).
3. Business rule, retry. `Retry` is offered only for states where it is safe; it re-sends the same idempotency key so the provider and Gereo cannot create a second payout. Before any retry the system asks the provider for the real status; if the provider says paid, the transaction moves to Confirmed instead and no new payout is sent. Retries are capped at a configurable number.
4. Business rule, cancel. `Cancel` is available only before the request was sent to the provider. It releases the hold on the wallet with a reversing entry (WAL) and moves the transaction to Cancelled. It is never offered after dispatch; after dispatch the operator can only wait, retry or mark for reconciliation.
5. Business rule, failed. When the provider reports failure, the hold is reversed by a reversing entry, the transaction moves to Failed, and the user sees whether money moved and what to do next (XCT-06, WAL). The operator sees the same text the user sees. A provider failure after a debit at the provider, with no credit, is marked Needs attention and linked to the reconciliation (OPS-04, OPS-05).
6. Business rule, no edits. The operator can never change the amount, the payee, the wallet or the fee of a request. Wrong-recipient cases are handled through a ticket (OPS-06) and the provider's own reversal process (competitive analysis section 2 notes the 7-day window and the 5% fee on a reversal), never by editing.
7. Business rule, pause. An operator can pause dispatch for one provider or for all, with a reason; requests keep arriving and show as `Queued for provider`. A pause is visible on top of the queue and in the app as an incident (OPS-08) when it affects users. Resuming is a separate action. A pause or resume needs a second person if it is for all providers.
8. State, empty and loading. An empty queue shows `No payouts waiting` with the time of the last refresh. A failed load keeps the last list marked `Not updated since {time}. Retry`. Lists are paged at 20 to 30 rows.
9. Notifications. When a queued or late payout completes, the user gets the normal result push and SMS with the reference ID (`sms.wal.payment_result`, WAL and NTF, GSM-7 safe, under 160 characters). Users are not notified on an operator view.
10. Ledger and audit. Holds, releases and reversals are written as balanced ledger entries by the System (WAL); no operator action edits an entry. Audit entries for each retry, cancel, pause, resume, status override request and note, with operator, time and reason.

**Data:** Transaction, Ledger entry, Provider response, Incident, Audit entry.
**Depends on:** OPS-01, OPS-04, OPS-05, OPS-08, WAL, SPD, XCT-06, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Float and pre-funding of payouts with Vanilla Pay and who manages it (03 mobile money 3.3 and 7.3, liquidity risk); whether a status check endpoint exists; the cap on retries; whether a global pause should also be triggered automatically by a large discrepancy (OPS-05).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| OPS-01 | Sign in to the back office and see only what my permissions allow | P0 | none |
| OPS-02 | See the KYC review queue and pick the next case | P0 | OPS-01, ACC-08, ACC-10, OPS-10 |
| OPS-03 | Decide a KYC case: approve, reject with a reason, or ask for a retake | P0 | OPS-01, OPS-02, ACC-08, ACC-09, OPS-11, NTF, XCT-12 |
| OPS-04 | Check the ledger against Vanilla Pay every day and see the result | P0 | OPS-01, WAL, OPS-05 |
| OPS-05 | Get alerted to a discrepancy and resolve it with a reversing entry | P0 | OPS-01, OPS-04, WAL, NTF |
| OPS-06 | Handle support tickets with the full context | P0 | OPS-01, OPS-03, OPS-05, OPS-07, NTF, XCT-14 |
| OPS-07 | Show the person the true status of their ticket | P1 | OPS-06, NTF, XCT-03, XCT-04, XCT-05, XCT-12 |
| OPS-08 | Post a "provider unavailable" banner and keep it up to date | P0 | OPS-01, OPS-13, WAL, NTF, XCT-04, XCT-10 |
| OPS-09 | Search the audit log | P0 | OPS-01 and every story that writes audit entries |
| OPS-10 | Review fraud and anomaly flags | P1 | OPS-01, OPS-03, OPS-06, ACC-05, ACC-11, WAL, SPD |
| OPS-11 | Configure tier limits and fees, with a second person and a start date | P0 | OPS-01, ACC-07, WAL, SPD, XCT-02 |
| OPS-12 | Watch SMS spending and delivery | P1 | OPS-01, NTF, XCT-12, OPS-10 |
| OPS-13 | Watch and steer the payout queue | P0 | OPS-01, OPS-04, OPS-05, OPS-08, WAL, SPD, XCT-06, NTF |

Count: 13 stories. P0: 9 (OPS-01, 02, 03, 04, 05, 06, 08, 09, 11, 13 is 10; see next line). 

Exact count: P0 is 10 (OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06, OPS-08, OPS-09, OPS-11, OPS-13). P1 is 3 (OPS-07, OPS-10, OPS-12). P2 is 0. Total 13.

Note on size: OPS-03 and OPS-05 are the largest. If a sprint cannot hold them, split OPS-03 into approve and reject first, then duplicates and flags, and split OPS-05 into the alert, and then the two-person correction.

## Cross-epic dependencies

Story IDs for the other epics are not final while those files are being written. Each line names the capability relied on and must be mapped to a story ID once the epics land.

- **ACC-04, ACC-05, ACC-08, ACC-09, ACC-10, ACC-11** are the user side of the KYC queue, decisions, PIN reset and device recovery, assisted onboarding and emergency lock handled in OPS-02, OPS-03, OPS-06 and OPS-10. **ACC-07** reads the limits configured in OPS-11. **ACC-14** exports audit entries about the person that OPS-09 searches.
- **WAL** ledger entries and reversing entries, holds and releases on payouts, transaction statuses and reference IDs, the live fee line, balance correction messages (OPS-04, OPS-05, OPS-11, OPS-13).
- **SPD** expense payouts that enter the payout queue, approvals that cannot be edited by operators, limit checks (OPS-11, OPS-13). **GRP** permission change entries searched in OPS-09; member and permission views that OPS-10 does not change. **CON** contributions paid through the provider that appear in reconciliation (OPS-04). **VOT, PRJ, EVT, ANN, RUL** audit entries and flags from their actions (OPS-09, OPS-10).
- **NTF** delivery of push and SMS, fallback timing, quiet hours, delivery reports and the SMS cost model for OPS-03, OPS-05, OPS-07, OPS-08, OPS-10 and OPS-12.
- **XCT-02, XCT-03** amount and date formats in every screen; **XCT-04, XCT-05** cached banners and tickets and queued replies on the user side (OPS-07, OPS-08); **XCT-06** the user-side Pending and Needs attention states that feed OPS-13; **XCT-08 to XCT-10** accessibility of the back office; **XCT-12** SMS rules for every `sms.ops.*` message; **XCT-14** message keys and glossary for operator templates.

## Open questions

1. **Vanilla Pay data and terms.** Statement or API for reconciliation, payout status and idempotency, settlement timing, float and pre-funding, incident communication, the legal status and who holds client funds (03 mobile money 3.2 and 7.4). Blocks OPS-04, OPS-05, OPS-08 and OPS-13.
2. **Operator model and legal duties.** Licensing route, record retention for identity and transaction records (Art. 53, applicability open), duties on suspicious activity reporting and on telling a person about a hold, and what an operator may do with funds (hold, reverse). Needs a Malagasy lawyer (competitive analysis section 10).
3. **Operator permissions and sign-in.** The permission names, sign-in method and device policy for operators; whether OpenFGA covers them; who may grant the second-person permissions.
4. **Numbers.** All limits, fees, tax lines, review targets, response targets, alert thresholds and budgets are TBD; none is set in this document.
5. **Incident behaviour.** Queue or block new payouts during a provider outage; who may publish at night; whether provider status can create a draft banner.
6. **SMS.** Aggregator, rates, delivery reports and the policy at the daily budget; who pays for group SMS.
7. **KYC details.** Accepted documents, face matching approach, rejection reason list in Malagasy, second-person approval for Tier 3 and for people who can approve spending, image storage and duration.
8. **Support promise.** Support hours, languages per shift, first-response target, and whether phone or WhatsApp support exists at launch (design foundations section 6, question 4).
9. **Least certain screens.** Design foundations section 5 marks the support and account-safety screens as the least evidenced; test the ticket status view and the incident banner in the first test round.
