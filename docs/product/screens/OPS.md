# OPS: screen and state inventory

Source: `docs/product/stories/OPS.md` (14 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

OPS is the operator back office, a separate web console used on a desktop or laptop and also usable on a phone by an on-call operator (not the member app). Its surfaces are inventoried on their own. A few OPS stories also define member-app surfaces (ticket status, incident banner, account review message, fee notice, audit-read notice); those are marked "member app".

Surface line format: `SCR-OPS-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-OPS-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Operator permissions are the lowercase backticked names of the operator catalogue owned by OPS-01: `manage operator access`, `review identity checks`, `view reconciliation`, `resolve discrepancy`, `approve ledger correction`, `handle tickets`, `publish incident`, `search audit log`, `manage flags`, `edit limits and fees`, `approve limits and fees`, `view sms costs`, `view notification log`, `reveal message text`, `manage payouts`, `watch platform jobs`. They are never member permissions. Operator alerts (keys `ops.*.alert`) show as a count in the back office header and as an email to the on-duty list; High severity also goes by SMS to the on-call operator. Operator-facing text is English and French; text sent to users must exist in Malagasy. Personal data is masked by default (phone `034 ** *** 12`); `Reveal` needs a reason. An operator never approves a spend, never votes, never counts toward the floor and cannot lift a freeze.

Status tables used: KYC case (New, In review, Waiting for user, Decided); Reconciliation run (Running, Completed, Failed, Report not received); Discrepancy alert (Open, Investigating, Resolved, Accepted as late; marker Escalated); Correction proposal (Proposed, Approved, Applied, Rejected, Expired); Support ticket (Received, In review, Waiting for user shown to the user as Waiting for you, Resolved, Closed); Incident (Active, Resolved); Flag (New, In review, Cleared, Escalated, Action taken); Operator hold, UI label `Held by Gereo` (Active, Expired, Lifted); Platform job alert (Open, Acknowledged, Resolved); Limits and fees version (Draft, Awaiting approval, Scheduled, Active, Rejected, Replaced); payouts use transaction statuses with the sub-label "Waiting for the provider" and markers `Late` and `Escalated`.

---

### OPS-01 Sign in to the back office and see only what my permissions allow

**Story:** OPS-01 Sign in to the back office and see only what my permissions allow

**Surfaces:**
- SCR-OPS-01 | Operator sign-in (password plus one-time code from an authenticator app on an operator-owned device) | page (console) | Any operator | Entry: opening the back office | Exit: SCR-OPS-02
- SCR-OPS-02 | Operator home (only the tiles for which the operator holds a permission, each with a count, for example `KYC cases waiting: 12`) | page (console) | Signed-in operator | Entry: after sign-in | Exit: each tile's screen
- SCR-OPS-03 | Access not allowed screen (`ops.access.not_allowed` naming the missing permission and who can grant it; `ops.access.service_down`) | page (console) | An operator without the permission, or any operator when the permission service is down | Entry: a direct link to a screen | Exit: SCR-OPS-02
- SCR-OPS-04 | Reveal dialog (a reason from a short list, then the value for the current record) | modal (console) | Operator viewing masked data | Entry: `Reveal` button | Exit: the record
- SCR-OPS-05 | Session notice (idle end after `OPERATOR_IDLE_MINUTES`; a second sign-in shows the first session and offers to end it) | modal (console) | The operator | Entry: inactivity or a second sign-in | Exit: SCR-OPS-01 or the session
- SCR-OPS-06 | Operator access management (list of operators and permissions; grant and revoke) | page (console) | Holder of `manage operator access` | Entry: tile on SCR-OPS-02 | Exit: SCR-OPS-07, SCR-OPS-08
- SCR-OPS-07 | Second-person approval of a sensitive grant (`approve ledger correction`, `approve limits and fees`, `manage operator access`) | inline (on SCR-OPS-06) | A second holder of `manage operator access` | Entry: pending grant | Exit: SCR-OPS-06
- SCR-OPS-08 | Device approval (new device for operators holding `manage payouts`, `approve ledger correction`, `approve limits and fees` or `manage operator access`) | inline (on SCR-OPS-06) | Holder of `manage operator access` | Entry: refused sign-in from a new device | Exit: SCR-OPS-06
- SCR-OPS-09 | Notification: access changed (`ops.access.changed`, email to the affected operator) | notification (operator, email) | The affected operator | Entry: grant or revoke | Exit: none
- SCR-OPS-10 | Notification: repeated failed sign-ins (alert to holders of `manage operator access`) | notification (operator alert) | Holders of `manage operator access` | Entry: `OPERATOR_MAX_FAILED_SIGNINS` reached | Exit: SCR-OPS-06

**States per surface:**
- SCR-OPS-01 default: password and authenticator code.
- SCR-OPS-01 wrong credentials: neutral message; locks after `OPERATOR_MAX_FAILED_SIGNINS` (5) attempts for `OPERATOR_LOCK_MINUTES` (15); alerts holders of `manage operator access` (SCR-OPS-10); no user data involved.
- SCR-OPS-01 unapproved device: sign-in refused for holders of `manage payouts`, `approve ledger correction`, `approve limits and fees` or `manage operator access` until a holder of `manage operator access` approves the device.
- SCR-OPS-01 permission service down: every screen closed with `ops.access.service_down` (fail closed).
- SCR-OPS-02 default: tiles by permission with counts.
- SCR-OPS-02 revoked access: effect on the next click, not at next sign-in.
- SCR-OPS-02 no tile: operator with no permission sees no tiles (state not specified).
- SCR-OPS-03 default: no data of the screen loaded; names the missing permission and who can grant it.
- SCR-OPS-03 service down: `ops.access.service_down`.
- SCR-OPS-04 default: reason chosen from a short list; each reveal writes an audit entry; ID photos open only inside the KYC case.
- SCR-OPS-05 idle: session ends after `OPERATOR_IDLE_MINUTES` (15) of inactivity or at sign-out.
- SCR-OPS-05 second session: shows the first session and offers to end it.
- SCR-OPS-06 default: grant or revoke a permission for another operator; an operator cannot grant a permission they do not hold and cannot change their own permissions.
- SCR-OPS-06 hidden: operators without `manage operator access`.
- SCR-OPS-07 pending: grant of `approve ledger correction`, `approve limits and fees` or `manage operator access` waits for a second person.
- SCR-OPS-08 default: approve or refuse the device.
- SCR-OPS-09 default: email to the affected operator; never contains user data.
- SCR-OPS-10 default: alert to holders of `manage operator access`.

**Criteria map:**
- AC 1: SCR-OPS-01 default and unapproved device, SCR-OPS-02 default (two factors, device approval, tiles with counts).
- AC 2: SCR-OPS-03 default (`ops.access.not_allowed`, no data loaded).
- AC 3: SCR-OPS-04 default (masking, `Reveal`, reason, photos inside the KYC case).
- AC 4: SCR-OPS-05 idle and second session.
- AC 5: no UI, system rule (an operator never sees a PIN, a one-time code or a biometric template; no field and no action asks a user for them; templates fixed, XCT-12).
- AC 6: SCR-OPS-06 default and SCR-OPS-07 pending (grants, second person for three permissions, no self-grant).
- AC 7: SCR-OPS-02 revoked access and SCR-OPS-03 service down (`ops.access.service_down`).
- AC 8: SCR-OPS-01 wrong credentials and SCR-OPS-10 default.
- AC 9: SCR-OPS-09 default (`ops.access.changed`).
- AC 10: no UI, system rule (audit of sign-in, failed sign-in, session ended, reveal, grant, revoke, with operator ID, device, time, reason).

**Objects and fields:** Operator (a User with back-office permissions: permissions, devices, sessions); Audit entry.

**Open points:**
- OPS-01 criteria 4 and 5 appear on one line in the story ("...offers to end it.5. Business rule, no secrets."); confirm there are 10 separate criteria.
- No screen is described for a second operator who has no permission yet and an empty home (SCR-OPS-02 no tile). Not specified in the story.
- A second operator approving a grant: where do they see the pending grant (SCR-OPS-07 location is inferred from criterion 6)? Not specified in the story.
- Whether the aggregator requires a named list of operators (open, needs the SMS aggregator); default is an export of the list of holders from the audit log. Surface for that export is not specified in the story.
- The unit of "device" for operators (a browser profile or hardware): not specified in the story.

---

### OPS-02 See the KYC review queue and pick the next case

**Story:** OPS-02 See the KYC review queue and pick the next case

**Surfaces:**
- SCR-OPS-11 | KYC review queue (`ops.kyc.queue`; table with case reference, user masked, case type, tier requested, submitted at, age with a clock, attempt number, source self or assisted, automatic flags, assignee, status; `Take`) | page (console) | Operator holding `review identity checks` | Entry: tile on SCR-OPS-02, links from tickets and flags | Exit: SCR-OPS-16
- SCR-OPS-12 | Back office header counts (queue counts and operator alert counts: waiting, late, in review, decided today, median age of waiting cases; alerts of all `ops.*.alert` keys) | inline (header of every console screen) | Every operator, per permission | Entry: always on | Exit: the alert's screen
- SCR-OPS-13 | Queue filter bar (type, tier, source, flag, assignee, status) | inline (on SCR-OPS-11) | Same as SCR-OPS-11 | Entry: SCR-OPS-11 | Exit: none
- SCR-OPS-14 | View-only warning (a case taken by someone else) | modal (console) | A second operator opening a taken case | Entry: open a taken case | Exit: view-only case page
- SCR-OPS-15 | Notification: late KYC cases (`ops.kyc.late_alert`, header count and email to the on-duty list) | notification (operator alert) | Operators on duty | Entry: late cases reach `KYC_LATE_ALERT_COUNT` (5) | Exit: SCR-OPS-11

**States per surface:**
- SCR-OPS-11 default: default sort by time left to `KYC_REVIEW_TARGET_HOURS` (24), oldest first; real table semantics, sortable headers, keyboard; user's language shown per case.
- SCR-OPS-11 Late: past the target shows a `Late` marker with icon and word, not colour alone.
- SCR-OPS-11 case types: new tier request, PIN reset, device recovery, number change and OTP help (the last two opened from OPS-06).
- SCR-OPS-11 claim: `Take` opens a case for decision; a case taken by someone else shows their name and cannot be opened for decision by a second operator; untouched for `KYC_CLAIM_RELEASE_MINUTES` (30) returns to the queue.
- SCR-OPS-11 flags: a case with the ID number already on another account, or a user with an open fraud flag (OPS-10), is marked and cannot be approved until the flag is read; the marker links to the flag.
- SCR-OPS-11 empty: `ops.kyc.queue_empty` ("No cases waiting") with the time of the last refresh; a filter with no result says so and offers to clear filters.
- SCR-OPS-11 loading: skeleton on first load, spinner within the list on refresh.
- SCR-OPS-11 failure: last list kept with `Not updated since {time}. Retry`, never cleared.
- SCR-OPS-11 forbidden: operator without `review identity checks`; SCR-OPS-03.
- SCR-OPS-12 default: counts from the same data as the list.
- SCR-OPS-13 default: filters.
- SCR-OPS-14 default: warning that someone else holds the case; view-only open allowed.
- SCR-OPS-15 default: alert at five Late cases; users not notified.

**Criteria map:**
- AC 1: SCR-OPS-11 default and case types (columns).
- AC 2: SCR-OPS-11 default and Late, SCR-OPS-13 default.
- AC 3: SCR-OPS-11 claim and SCR-OPS-14 default.
- AC 4: SCR-OPS-12 default.
- AC 5: SCR-OPS-11 empty.
- AC 6: SCR-OPS-11 loading and failure.
- AC 7: SCR-OPS-11 flags.
- AC 8: SCR-OPS-12 default and SCR-OPS-15 default (`ops.kyc.late_alert`).
- AC 9: no UI, system rule (audit of case taken, released, opened).
- AC 10: SCR-OPS-11 default (table semantics, keyboard, user language per case).

**Objects and fields:** Identity check (reference, type, tier requested, submitted at, attempt, source `assisted_by`, flags); User (masked); Device; Audit entry.

**Open points:**
- Is "waiting for user" cases shown in the default view or hidden? The story lists the status column and filter but not the default filter. Not specified in the story.
- The header count (SCR-OPS-12) is shared by all OPS alerts; OPS-02 is the first story naming it and no story states where the alert list opens. Not specified in the story.
- Tier 3 and duplicate-ID cases need a second person (OPS-03); how they appear in the queue (a "Needs second person" marker) is not specified in the story.

---

### OPS-03 Decide a KYC case: approve, reject with a reason, or ask for a retake

**Story:** OPS-03 Decide a KYC case: approve, reject with a reason, or ask for a retake

**Surfaces:**
- SCR-OPS-16 | KYC case page (ID front and back and selfie side by side with zoom and rotate; typed data legal name, document type and number, date of birth; attempt history; automatic flags; buttons `Approve Tier 2`, `Reject`, `Ask for retake`, `Escalate to support`) | page (console) | Operator holding `review identity checks` who took the case | Entry: `Take` on SCR-OPS-11 | Exit: SCR-OPS-11
- SCR-OPS-17 | Decision checklist (image readable, typed data matches the document, document not expired, person at least `KYC_MIN_AGE`, face matches, ID number not used on another account) | inline (on SCR-OPS-16) | Same | Entry: SCR-OPS-16 | Exit: enables `Approve`
- SCR-OPS-18 | Reject reasons (fixed list of ACC-09: photo too dark, photo blurry, glare on the document, document expired, document type not accepted, document unreadable, name does not match, number does not match, face not clear, face does not match the document, under the minimum age; and `other` with a reason code) | sheet (console) | Same | Entry: `Reject` | Exit: SCR-OPS-16
- SCR-OPS-19 | Retake items selector (front, back, selfie) | sheet (console) | Same | Entry: `Ask for retake` | Exit: SCR-OPS-16
- SCR-OPS-20 | Duplicate ID and flag panel (the other case or flag masked; choose reject with a reason, or send to a second person; internal link note) | inline (on SCR-OPS-16) | Same | Entry: ID number linked to another account | Exit: SCR-OPS-21
- SCR-OPS-21 | Second-person decision (second holder of `review identity checks` decides a Tier 3 case or a duplicate-ID case) | inline (on SCR-OPS-16) | A second holder of `review identity checks`, never the first deciding operator | Entry: sent to a second person | Exit: SCR-OPS-11
- SCR-OPS-22 | Reference selfie comparison (stored reference selfie next to the new one; for PIN reset ACC-04 and device recovery ACC-05) | inline (on SCR-OPS-16) | Same | Entry: case types PIN reset and device recovery | Exit: SCR-OPS-16

The user's decision notices are catalogue rows EV-ACC-07 (`msg.acc.kyc_approved`, SCR-NTF-106) and EV-ACC-08 (`msg.acc.kyc_action_needed`, SCR-NTF-107).

**States per surface:**
- SCR-OPS-16 default: images, typed data, attempt history, flags; `Approve` disabled until the checklist is complete.
- SCR-OPS-16 approve: sets the Identity check to Approved and the user's tier to the requested tier or a lower one chosen with a fixed reason; limits change from that moment (ACC-09, OPS-11); no ledger entry; button labelled with the outcome.
- SCR-OPS-16 Tier 3: approval needs a second person holding `review identity checks`.
- SCR-OPS-16 reject: at least one reason from the fixed list, each with user-facing text and tip in Malagasy, French and English; free text typed by the operator is internal only and never shown.
- SCR-OPS-16 retake: marks specific items to redo and keeps passed items; retakes count as attempts; after `KYC_MAX_ATTEMPTS` the page shows `Escalate to support` and the user sees ACC-09 criterion 4.
- SCR-OPS-16 PIN reset and device recovery: `Approve` completes the reset or device registration; `Reject` shows the user the fixed reason and keeps the account unchanged.
- SCR-OPS-16 loading: images load progressively with a skeleton; a failed image disables its checklist item with `Image not loaded. Retry`.
- SCR-OPS-16 save failure: `ops.kyc.decision_not_saved`; nothing sent to the user.
- SCR-OPS-16 notifications: on every decision the user is told in their language (EV-ACC-07 or EV-ACC-08), push first and SMS only if the push is not opened; nothing sent until the decision is saved.
- SCR-OPS-16 accessibility: works at 200% font size; keyboard alternative for image viewing; decision buttons labelled with the outcome, never `Yes` or `OK`.
- SCR-OPS-16 not taken: operator who has not taken the case sees it view-only (SCR-OPS-14).
- SCR-OPS-17 default: all six items must be ticked before `Approve`.
- SCR-OPS-18 default: pick at least one reason; `other` carries a reason code with approved text.
- SCR-OPS-19 default: front, back, selfie.
- SCR-OPS-20 default: approval blocked; the operator opens the other case or flag (masked) and chooses; the two accounts are linked in an internal note never shown to either user.
- SCR-OPS-21 default: second person decides; both identities in the audit log.
- SCR-OPS-22 default: reference selfie and new selfie side by side.

**Criteria map:**
- AC 1: SCR-OPS-16 default and SCR-OPS-17 default (page contents, checklist).
- AC 2: SCR-OPS-16 approve and Tier 3 (tier set, lower tier with fixed reason, second person for Tier 3).
- AC 3: SCR-OPS-16 reject and SCR-OPS-18 default (fixed list, three languages, free text internal).
- AC 4: SCR-OPS-16 retake and SCR-OPS-19 default (`Escalate to support`).
- AC 5: SCR-OPS-20 default and SCR-OPS-21 default (duplicates, second person).
- AC 6: SCR-OPS-22 default and SCR-OPS-16 PIN reset and device recovery.
- AC 7: SCR-OPS-16 loading and save failure (`ops.kyc.decision_not_saved`).
- AC 8: SCR-OPS-16 notifications (EV-ACC-07, EV-ACC-08, `msg.acc.kyc_approved`, `msg.acc.kyc_action_needed`).
- AC 9: no UI, system rule (audit of case opened, each image viewed, checklist, decision, reason codes, tier before and after; images encrypted; access logged).
- AC 10: SCR-OPS-16 accessibility.

**Objects and fields:** Identity check (images, typed data, status Pending, Approved, Rejected, reason codes, tier before and after); User; Device; Notification; Audit entry.

**Open points:**
- Where does a second person find a case sent to them (a queue marker or a separate list)? Not specified in the story.
- Malagasy wording of each rejection reason (open, needs translators and field testing); no language ships with unreviewed reasons.
- Where images are stored (open, needs the hosting choice); retention duration is ACC open question 1.
- The case page offers `Approve Tier 2`; the decision button label for a lower tier chosen with a reason is not specified in the story.
- "Escalate to support" target: creates an OPS-06 ticket? Not specified in the story.

---

### OPS-04 Check the ledger against the provider's records every day and see the result

**Story:** OPS-04 Check the ledger against the provider's records every day and see the result

**Surfaces:**
- SCR-OPS-23 | Reconciliation runs (`ops.recon.runs`; per run: date, period covered, provider, status, provider records, Gereo transactions, matched, unmatched provider side, unmatched Gereo side, amount mismatches, total difference in ariary, completed at; last completed run at the top) | page (console) | Operator holding `view reconciliation` | Entry: tile on SCR-OPS-02, alert link | Exit: SCR-OPS-24
- SCR-OPS-24 | Run detail with drill-down (filter by category: unmatched provider, unmatched Gereo, amount mismatch, duplicates, stuck; row with transaction reference, provider reference, amounts on both sides, statuses, wallet masked, time, link to ticket or flag) | page (console) | Operator holding `view reconciliation` | Entry: SCR-OPS-23 | Exit: SCR-OPS-30, tickets, flags
- SCR-OPS-25 | Manual statement import (a file imported by an operator) | sheet (console) | Operator holding `resolve discrepancy` | Entry: action on SCR-OPS-23 | Exit: SCR-OPS-23
- SCR-OPS-26 | Start or rerun a run for a date | sheet (console) | Operator holding `view reconciliation` (start) | Entry: action on SCR-OPS-23 | Exit: SCR-OPS-23
- SCR-OPS-27 | Balance check and Gereo income sections (client wallet balances against the reported client-funds balance, both numbers and the difference; Gereo income: Fee Gereo part, Rounding, Platform: SMS allowance; Tax as a liability, shown separately) | inline (on SCR-OPS-24) | Operator holding `view reconciliation` | Entry: SCR-OPS-24 | Exit: none
- SCR-OPS-28 | System: reconciliation job (runs at `RECON_RUN_TIME`, daily 06:00 Madagascar time) | system | none | Entry: schedule or manual start | Exit: SCR-OPS-23, SCR-OPS-33

**States per surface:**
- SCR-OPS-23 default: runs with status Running, Completed, Failed or Report not received; paged 20 to 30 rows.
- SCR-OPS-23 Running: shows progress and the time since start.
- SCR-OPS-23 no transactions: `Completed, nothing to match`.
- SCR-OPS-23 Failed or Report not received: listed with the reason; raises the OPS-05 alert; never a blank row.
- SCR-OPS-23 forbidden: operators without `view reconciliation`; SCR-OPS-03.
- SCR-OPS-23 accessibility: table with sortable headers and keyboard access; amounts `12 500 Ar`; status chips with icon, word and colour.
- SCR-OPS-24 matching: match needs the same provider reference, the same integer amount and a consistent status; fee and tax lines matched as their own categories against the active OPS-11 version.
- SCR-OPS-24 Not yet due: a provider record not yet due under `RECON_SETTLEMENT_LAG_DAYS` (1) shown as `Not yet due`, never a difference.
- SCR-OPS-24 stuck: dispatched payouts Pending beyond `PAYOUT_PENDING_ALERT_MINUTES`, and deposits beyond `PENDING_TIMEOUT` (WAL-07) are `stuck`; a payout still waiting for the provider before dispatch is never `stuck`.
- SCR-OPS-24 duplicates: duplicate provider callbacks matched to one transaction and counted as duplicates.
- SCR-OPS-24 immutability: a completed run is stored as it was and never edited; a rerun for the same date creates a new linked run; the earlier result stays visible; a rerun never creates ledger entries.
- SCR-OPS-24 view audit: each operator view of a run is audited.
- SCR-OPS-25 default: manual file import beside automatic fetch; audited like any action.
- SCR-OPS-26 default: operator starts a run for a date; rerun linked to the first.
- SCR-OPS-27 no balance report: item-level only; balance line shows `Not available from the provider`, never zero.
- SCR-OPS-27 balance report present: sums compared with `RECON_TOLERANCE_AR` (0); invariant provider client-funds balance at least the sum of client wallet balances; a breach raises the OPS-05 alert as High severity.
- SCR-OPS-27 Gereo money: held outside that sum and shown in its own section; Tax a liability for the state, not income.
- SCR-OPS-28 completion: zero differences send nothing; any difference, failure or missing report sends the OPS-05 alert; users not notified.

**Criteria map:**
- AC 1: SCR-OPS-23 default (run list columns, last completed run on top).
- AC 2: SCR-OPS-24 matching, Not yet due, stuck, duplicates.
- AC 3: SCR-OPS-27 no balance report, balance report present, Gereo money.
- AC 4: SCR-OPS-24 default (drill down by category, row content, links).
- AC 5: SCR-OPS-24 immutability, SCR-OPS-26 default.
- AC 6: SCR-OPS-23 no transactions and Failed or Report not received.
- AC 7: SCR-OPS-23 Running (progress; pages of 20 to 30 rows).
- AC 8: SCR-OPS-28 completion.
- AC 9: SCR-OPS-24 view audit (no ledger entry; audit of run started, completed, failed, rerun and each view).
- AC 10: SCR-OPS-23 accessibility.

**Objects and fields:** Reconciliation run (date, period, provider, counts, differences, status, linked reruns); Transaction; Ledger entry; Audit entry.

**Open points:**
- `PENDING_TIMEOUT` (WAL-07) and `PAYOUT_PROVIDER_WAIT_MAX` (WAL) values are not given here. Not specified in the story.
- Who holds the permission to start a run: the story says "an operator may also start a run" with `view reconciliation`, while manual import needs `resolve discrepancy`. Confirm that starting a run needs no write permission. Not specified in the story.
- No provider statement or API is assumed (OPS open question 1); the exact manual import file format and error states are not specified in the story.
- Which user-facing money states show `stuck` rows: label and key not specified in the story.

---

### OPS-05 Get alerted to a discrepancy and resolve it with a reversing entry

**Story:** OPS-05 Get alerted to a discrepancy and resolve it with a reversing entry

**Surfaces:**
- SCR-OPS-29 | Discrepancy alerts (`ops.recon.alerts`; count of Open alerts, age of the oldest, total amount at stake) | page (console) | Operator holding `resolve discrepancy` | Entry: header alert, tile, SCR-OPS-33 | Exit: SCR-OPS-30
- SCR-OPS-30 | Discrepancy alert detail (differences, cause pick list, `Take`, link to the run, linked actions) | page (console) | Operator holding `resolve discrepancy` | Entry: SCR-OPS-29 | Exit: SCR-OPS-31
- SCR-OPS-31 | Correction proposal (reversing entry plus, if needed, a new correct entry, each balanced, with reason code, alert ID and proposer; lists derived entries of income that fed rules and offers to reverse them in the same proposal; before and after balances in the amount format and in words) | page (console) | Operator holding `resolve discrepancy` (proposes) | Entry: SCR-OPS-30 | Exit: SCR-OPS-32
- SCR-OPS-32 | Correction approval (second operator holding `approve ledger correction`; a third holder above `CORRECTION_APPROVAL_THRESHOLD`; button `Approve correction of 12 500 Ar`) | page (console) | Operator holding `approve ledger correction`, not the proposer | Entry: pending proposal | Exit: SCR-OPS-30
- SCR-OPS-33 | Notification: reconciliation alert (`ops.recon.alert`: date, number and total of differences, link to the run; header count and email; High severity also by SMS to the on-call operator) | notification (operator alert) | Operators on duty | Entry: end of a run with differences, failure or missing report | Exit: SCR-OPS-29
- SCR-OPS-34 | System: alert escalation and automatic closure (Escalated marker after `DISCREPANCY_ESCALATE_HOURS`; late provider record closed as Accepted as late; proposal expiry) | system | none | Entry: time or next run | Exit: markers, re-sent alerts

The balance-correction notice to the user is catalogue row EV-WAL-13 (`msg.wal.balance_corrected`, SCR-NTF-130).

**States per surface:**
- SCR-OPS-29 default: one alert per run with differences; not merged away.
- SCR-OPS-29 empty: `No open discrepancies` with the date of the last clean run.
- SCR-OPS-29 forbidden: operators without `resolve discrepancy`; SCR-OPS-03.
- SCR-OPS-30 Open then Investigating: `Take` names the operator.
- SCR-OPS-30 cause: for each difference pick a cause: provider record arrived late; Gereo status not updated from a callback; duplicate callback; missing Gereo entry; wrong amount; provider fee not recorded; reversal at the provider; other with a note.
- SCR-OPS-30 Accepted as late: a late provider record arriving within the next run closes automatically with links to both runs.
- SCR-OPS-30 Resolved: not allowed while any difference has no cause and no linked action; Resolved automatically only after a run shows the difference closed.
- SCR-OPS-30 Escalated: not Resolved after `DISCREPANCY_ESCALATE_HOURS` (8) gets the `Escalated` marker and is re-sent to holders of `approve ledger correction` and, as High severity, by SMS to the on-call operator.
- SCR-OPS-31 default: preview of before and after balances.
- SCR-OPS-31 blocked: a reversal that would make a balance negative is blocked with the alternatives of WAL-18.
- SCR-OPS-31 failure: a correction that fails to post (for example an unbalanced entry) applies nothing; the proposer sees the reason; no user notified.
- SCR-OPS-32 Proposed: second operator approves or rejects; proposer cannot approve.
- SCR-OPS-32 Approved, Applied, Rejected: statuses of the correction proposal.
- SCR-OPS-32 large: above `CORRECTION_APPROVAL_THRESHOLD` (WAL-18, TBD) a third holder also approves.
- SCR-OPS-32 Expired: not approved within `CORRECTION_PROPOSAL_EXPIRY_HOURS` (48); alert returns to Investigating.
- SCR-OPS-33 default: alert states date, number and total of differences.
- SCR-OPS-34 user effect: a correction that changes a balance tells the user or group in their language (`msg.wal.balance_corrected`, push first, SMS fallback) with reference ID, amount, direction and support route; the correction shows in the person's ledger referencing the reversed entry.

**Criteria map:**
- AC 1: SCR-OPS-33 default and SCR-OPS-29 default (alert in header and list, key `ops.recon.alert`).
- AC 2: SCR-OPS-30 Open then Investigating and Escalated.
- AC 3: SCR-OPS-30 cause and Accepted as late.
- AC 4: SCR-OPS-31 default and blocked, SCR-OPS-32 Proposed and large.
- AC 5: SCR-OPS-34 user effect.
- AC 6: SCR-OPS-30 Resolved.
- AC 7: SCR-OPS-29 default and empty.
- AC 8: SCR-OPS-31 failure and SCR-OPS-32 Expired.
- AC 9: no UI, system rule (corrections the only operator action that writes ledger entries, in balanced pairs; audit with both operators' IDs and times).
- AC 10: SCR-OPS-31 default and SCR-OPS-32 (preview in the amount format and in words; button names the effect).

**Objects and fields:** Reconciliation run; Discrepancy alert (status, cause, markers); Correction proposal (status, entries, reason code, proposer, approvers); Ledger entry; Transaction; Notification; Audit entry.

**Open points:**
- `CORRECTION_APPROVAL_THRESHOLD` value is owned by WAL and is TBD; the UI for the third approval cannot be designed with a number. Not specified in the story.
- The story says `msg.wal.balance_corrected` is "to be added to the NTF catalogue"; the catalogue already lists it as EV-WAL-13. Confirm it is closed.
- Shortfall booked as a Gereo loss line (closed question): which screen shows it? Not specified in the story.
- Where the approver sees the pending proposals list (inbox): not specified in the story.

---

### OPS-06 Handle support tickets with the full context

**Story:** OPS-06 Handle support tickets with the full context

**Surfaces:**
- SCR-OPS-35 | Ticket inbox (`ops.tickets`; reference copyable, category money, identity, access, group, other, user masked and language, linked object, status, assignee, created at, last update, time to first response, `Late` marker) | page (console) | Operator holding `handle tickets` | Entry: tile on SCR-OPS-02 | Exit: SCR-OPS-36
- SCR-OPS-36 | Ticket page (conversation; linked transaction with status and ledger entries read only; user's tier; account status Pending PIN, Active, Locked, Deleting, Deleted; recent safety events; other open tickets of the same user; internal notes; attachments with a warning) | page (console) | Operator holding `handle tickets` | Entry: SCR-OPS-35, "Report this payment" (WAL-14), account-safety flows, KYC escalation, failed split run (RUL-07) | Exit: SCR-OPS-38
- SCR-OPS-37 | Reply composer (templates in Malagasy, French and English, editable before sending; no machine translation for money statements) | inline (on SCR-OPS-36) | Same | Entry: SCR-OPS-36 | Exit: sends a reply
- SCR-OPS-38 | Ticket actions (link a KYC case; open the discrepancy or flag for the same transaction; propose a ledger correction; unlock an account after ACC-11 checks; send a verification retake request; assign; set status with a resolution code) | sheet (console) | Same, each action with the permission of its own screen | Entry: SCR-OPS-36 | Exit: the target screen
- SCR-OPS-39 | Merge tickets (links kept both ways) | modal (console) | Same | Entry: action on SCR-OPS-36 | Exit: SCR-OPS-36
- SCR-OPS-40 | Create ticket (an operator-created ticket after a phone call) | sheet (console) | Same | Entry: SCR-OPS-35 | Exit: SCR-OPS-36

**States per surface:**
- SCR-OPS-35 default: filters by status, category, assignee, language, late, linked object; table with keyboard access.
- SCR-OPS-35 Late: `Late` marker past `TICKET_FIRST_RESPONSE_HOURS` (24).
- SCR-OPS-35 empty: `ops.tickets.empty` with the time of last refresh.
- SCR-OPS-35 failure: previous list kept with `Not updated since {time}. Retry`.
- SCR-OPS-35 forbidden: operators without `handle tickets`; SCR-OPS-03.
- SCR-OPS-36 statuses: Received, In review, Waiting for user, Resolved, Closed; Resolved needs a resolution code; Resolved becomes Closed when the user confirms or after `TICKET_CLOSE_DAYS` (3) with no reply; a user reply after Resolved reopens it within `TICKET_REOPEN_DAYS` (7).
- SCR-OPS-36 system-opened: a ticket opened by the System for a failed split run arrives with the wallet, the rule and the failed run attached, category money; a ticket from "Report this payment" arrives with the transaction attached.
- SCR-OPS-36 privacy: masked data first; `Reveal` for phone or ID number needs a reason (OPS-01); user attachments shown with a warning that they may hold other people's data.
- SCR-OPS-36 merge and notes: duplicates merged with a link both ways; internal notes never shown to the user; assign with a note.
- SCR-OPS-36 notification: each reply, status change and request for information notifies the user through `msg.ops.ticket_updated` (EV-OPS-01, SCR-NTF-255) under OPS-07; operators see a count of late tickets in the header.
- SCR-OPS-36 offline user message: a message the user writes from the phone is an auto-send item of XCT-05 Table A.
- SCR-OPS-37 default: templates in the user's language; plain language, no blame words, next step as a sentence and exact time frame (no "soon").
- SCR-OPS-38 default: each action a button with the same permission as the equivalent screen; a ticket never gives more power.
- SCR-OPS-38 unlock: needs a second person where the lock came from a fraud flag.
- SCR-OPS-39 default: merge with link both ways.
- SCR-OPS-40 default: operator-created ticket.

**Criteria map:**
- AC 1: SCR-OPS-35 default and Late (inbox columns, filters).
- AC 2: SCR-OPS-36 default and SCR-OPS-37 default (ticket page contents, templates).
- AC 3: SCR-OPS-36 statuses.
- AC 4: SCR-OPS-38 default and unlock, SCR-OPS-36 system-opened.
- AC 5: SCR-OPS-39 default and SCR-OPS-36 merge and notes.
- AC 6: SCR-OPS-35 empty and failure.
- AC 7: SCR-OPS-36 privacy.
- AC 8: SCR-OPS-36 notification and offline user message.
- AC 9: no UI, system rule (audit of ticket events and actions).
- AC 10: SCR-OPS-35 default and SCR-OPS-37 default (keyboard, growing reply box, plain templates).

**Objects and fields:** Support ticket (reference, category, status, resolution code, assignee, notes, links); Transaction; Identity check; User; Device; Notification; Audit entry.

**Open points:**
- Support hours are "published in the app" (closed question): where and with which key? Not specified in the story.
- The category list (money, identity, access, group, other) is given; no category for a failed split run besides money. Confirmed as money.
- Reply templates content and keys: not specified in the story.
- How an operator creates a ticket on behalf of a person who is not signed in (SCR-OPS-40): form fields not specified in the story.

---

### OPS-07 Show the person the true status of their ticket

**Story:** OPS-07 Show the person the true status of their ticket

**Surfaces:**
- SCR-OPS-41 | Help ticket list (member app: reference, subject, status word with icon and colour Received, In review, Waiting for you, Resolved, Closed, last update time, one line saying what happens next, button `Report a problem`) | page (member app) | The person who opened the tickets | Entry: Help, "Report this payment" (WAL-14), push | Exit: SCR-OPS-42
- SCR-OPS-42 | Ticket detail (member app: conversation; when the status is `Waiting for you`, what is needed and a button to answer with a photo, text or confirm; how long it will wait before it is closed) | page (member app) | The person who opened the ticket | Entry: SCR-OPS-41 | Exit: SCR-OPS-41
- SCR-OPS-43 | Outgoing text safety check (blocks words from a configurable list asking for a PIN or code, and shows the operator why) | inline (on SCR-OPS-37) | Operator holding `handle tickets` | Entry: sending a reply | Exit: SCR-OPS-37
- SCR-OPS-44 | Expected response time line (absolute time from `TICKET_FIRST_RESPONSE_HOURS` and the current queue; `We are late. Sorry. We will answer by {time}`) | inline (on SCR-OPS-41 and SCR-OPS-42, set by the operator in SCR-OPS-36) | The person | Entry: SCR-OPS-41 | Exit: none

The notification is catalogue row EV-OPS-01 (`msg.ops.ticket_updated`, SCR-NTF-255) with `.inapp`, `.push` and `.sms` variants.

**States per surface:**
- SCR-OPS-41 default: status text from keys, not operator free text; last update in the XCT-03 date format; one line saying what happens next ("We will answer by Friday 17:00").
- SCR-OPS-41 empty: one sentence on what to use Help for and `Report a problem`; never an empty table.
- SCR-OPS-41 same record: one field for the operator and the phone; a status change shows at the next sync and by push within one minute online; the user cannot see a status the operator has not set.
- SCR-OPS-41 offline: list and last replies cached with a last-synced time (XCT-04); reading needs no connection.
- SCR-OPS-42 Waiting for you: shows what is needed, an answer button and how long it will wait before it is closed.
- SCR-OPS-42 offline reply: a reply written offline is queued as `Waiting to send` (XCT-05 Table A).
- SCR-OPS-42 safety: every message from Gereo carries `Gereo never asks for your PIN or code`.
- SCR-OPS-43 blocked: a reply containing a word from the list is blocked and the operator sees why.
- SCR-OPS-44 default: absolute expected time.
- SCR-OPS-44 late: `We are late. Sorry. We will answer by {time}` with a new time set by the operator.
- Notification: in-app and push on each status change or reply; `.sms` only for Waiting for you and Resolved and only when the push was not opened within the NTF-05 window; GSM-7 safe, under 160 characters, with the reference; no SMS for Received or In review; fixed template, never free text.

**Criteria map:**
- AC 1: SCR-OPS-41 default (list contents, status words, next-step line).
- AC 2: SCR-OPS-41 same record.
- AC 3: SCR-OPS-42 Waiting for you.
- AC 4: SCR-OPS-44 default and late.
- AC 5: SCR-OPS-41 offline and SCR-OPS-42 offline reply.
- AC 6: SCR-OPS-41 empty.
- AC 7: SCR-OPS-42 safety and SCR-OPS-43 blocked.
- AC 8: notification (`msg.ops.ticket_updated`, EV-OPS-01, `.inapp`, `.push`, `.sms` for two statuses), surface SCR-NTF-255.
- AC 9: no UI, system rule (audit of each status change and each notification with channel, time, delivery result).
- AC 10: SCR-OPS-41 default (icon, word and colour, screen-reader announcements, three-language keys).

**Objects and fields:** Support ticket (status, expected time, next-step key); Notification; Audit entry.

**Open points:**
- NTF must mark EV-OPS-01 as SMS fallback for Waiting for you and Resolved (the story says it lists in-app and push only); the catalogue row now shows `S-fb` for those statuses; confirm closure.
- The Help list is a member app screen not listed in ACC or GRP; where it sits in the navigation (09 section 4) is not specified in the story.
- What the user sees for a ticket merged into another: not specified in the story.
- The list of blocked words for outgoing text: configurable, content not specified in the story.

---

### OPS-08 Post a "provider unavailable" banner and keep it up to date

**Story:** OPS-08 Post a "provider unavailable" banner and keep it up to date

**Surfaces:**
- SCR-OPS-45 | Incident publish form (`ops.incident.new`: provider MVola, Orange Money, Airtel Money or other; affected actions deposit, withdrawal, contribution payment or all; start time; severity; template message in Malagasy, French and English with an optional expected update time in Madagascar time; behaviour for new money-out `Queue` or `Block`; preview in each language) | page (console) | Operator holding `publish incident` | Entry: alerts from OPS-13, OPS-04, a provider message, tickets | Exit: SCR-OPS-46
- SCR-OPS-46 | Incident banner (icon plus word, provider name, what is affected, what still works, last update time; never covers an amount or a PIN pad; announced as a status) | inline (member app: wallet, money in, money out, contribution payment, review and PIN screens) | Members on screens that start an affected action | Entry: publish within `BANNER_PROPAGATION_SECONDS` (60) | Exit: SCR-OPS-47
- SCR-OPS-47 | Incident history (`ops.incident.history`: timestamped updates) | page (member app) | Members | Entry: banner link | Exit: back
- SCR-OPS-48 | Incident update (timestamped update replacing the banner text) | sheet (console) | Operator holding `publish incident` | Entry: active incident | Exit: SCR-OPS-45 view
- SCR-OPS-49 | Resolve incident | modal (console) | Operator holding `publish incident` | Entry: `Resolve` | Exit: banner removed
- SCR-OPS-50 | System: banner propagation and incident notices (`msg.ops.provider_incident`, EV-OPS-02, SCR-NTF-256, states `started` and `resolved`) | system | affected members only | Entry: publish, long incident, resolve | Exit: push, SMS fallback, in-app

**States per surface:**
- SCR-OPS-45 default: provider, affected actions, start time (now or earlier), severity, message from a template, preview per language.
- SCR-OPS-45 missing language: all three languages required; the publish button disabled with a reason if one is missing.
- SCR-OPS-45 publish failure: shows the operator the reason; nothing partial visible to users.
- SCR-OPS-45 behaviour: `Queue` default (Pending with the sub-label "Waiting for the provider"; Failed with a reversing entry only after `PAYOUT_PROVIDER_WAIT_MAX`); `Block` only when the provider cannot accept requests or the float cannot cover the queue; deposits never queued; requests already sent keep their real status; "Queue" here is money held as Pending on the server, not the device queue.
- SCR-OPS-45 hidden: operators without `publish incident`; SCR-OPS-03.
- SCR-OPS-46 shown: banner on all screens that start an affected action; user sees what still works (reading, voting, transfers between wallets).
- SCR-OPS-46 Block: person sees `{provider} is not available. Nothing was taken.` before entering the PIN; no request authorised or queued.
- SCR-OPS-46 No news: a banner without an update for `INCIDENT_NO_NEWS_MINUTES` (60) shows `No news yet since {time}` automatically.
- SCR-OPS-46 offline or stale: cached with last-update time; a user offline sees the last banner marked `Not updated since {time}`; an incident the device has not heard about cannot be assumed over.
- SCR-OPS-46 provider recovered early: the banner stays; only `Resolve` removes it.
- SCR-OPS-47 default: timeline of updates, each with its time.
- SCR-OPS-48 default: update replaces the banner text and is kept in the timeline.
- SCR-OPS-49 default: sets the end time, removes the banner, notifies only affected people (Pending request on that provider, and people who registered "Tell me when it works", WAL-08); no message to the whole user base; each queued person gets the normal result message when their payout completes.
- SCR-OPS-50 started: push to users with a Pending request on the affected provider; `.sms` only if the incident lasts longer than `INCIDENT_SMS_AFTER_MINUTES` (60) and the push was not opened, GSM-7 safe, 160 characters, with the reference of their request; no SMS to the whole user base.
- SCR-OPS-50 status pages: provider status pages never publish a banner; they may only raise an alert.

**Criteria map:**
- AC 1: SCR-OPS-45 default and missing language (fields and preview).
- AC 2: SCR-OPS-46 shown (display within `BANNER_PROPAGATION_SECONDS`, content, never covers an amount or PIN pad).
- AC 3: SCR-OPS-45 behaviour and SCR-OPS-46 Block (`Queue` or `Block`).
- AC 4: SCR-OPS-48 default, SCR-OPS-47 default, SCR-OPS-46 No news.
- AC 5: SCR-OPS-49 default.
- AC 6: SCR-OPS-46 offline or stale.
- AC 7: SCR-OPS-45 publish failure and SCR-OPS-46 provider recovered early.
- AC 8: SCR-OPS-50 started (`msg.ops.provider_incident`, EV-OPS-02).
- AC 9: no UI, system rule (no ledger entry; audit of incident created, updated, resolved, scope, behaviour chosen).
- AC 10: SCR-OPS-45 missing language (three languages, plain words, exact times).

**Objects and fields:** Incident (provider, affected actions, severity, start and end time, behaviour, updates); Transaction; Notification; Audit entry.

**Open points:**
- Conventions 10.4 says "Nothing was taken" stays valid "in OPS-09 Block mode", but Block mode is defined in OPS-08 (OPS-09 is the audit search). Correct citation?
- Catalogue EV-OPS-02 lists `.push`, `.sms`, `.inapp`; the story gives SMS only after `INCIDENT_SMS_AFTER_MINUTES` and the NTF-05 window; the NTF row says "S-fb only for affected members with a pending request". Consistent; the interaction of the two windows is not specified in the story.
- Surface for the on-call operator to see all active incidents (a list): not specified in the story.
- Banner for queued payouts of members with no Pending request but who open the money-out screen: shown by criterion 2; text for that case is not specified.

---

### OPS-09 Search the audit log

**Story:** OPS-09 Search the audit log

**Surfaces:**
- SCR-OPS-51 | Audit search (`ops.audit`; fields: actor, object type and ID, action type in words, reference ID, group, device, date and time range in Madagascar time; results newest first, 20 to 30 rows per page) | page (console) | Operator holding `search audit log` | Entry: tile on SCR-OPS-02, audit links from a ticket, a case or an alert | Exit: SCR-OPS-52
- SCR-OPS-52 | Audit entry detail (before and after values, device, reason, linked objects, operator permission used) | sheet (console) | Same | Entry: a result row | Exit: SCR-OPS-54
- SCR-OPS-53 | Export results (a reason, the filters, at most `AUDIT_EXPORT_MAX_ROWS` rows) | sheet (console) | Same | Entry: `Export results` | Exit: SCR-OPS-51
- SCR-OPS-54 | Add a note (a new note entry linked to the original) | sheet (console) | Same | Entry: SCR-OPS-52 | Exit: SCR-OPS-52
- SCR-OPS-55 | Group audit-read reason (reason picked from a short list before reading a group's audit log) | modal (console) | Same | Entry: opening the audit log of a group | Exit: SCR-OPS-51
- SCR-OPS-56 | Member-visible notice "Gereo support viewed the audit log. Reason: {reason}" (GRP-11 criterion 5) | inline (member app, group audit log) | Members who read the group log | Entry: group audit log (GRP-11) | Exit: none

**States per surface:**
- SCR-OPS-51 default: at least one search field required; default range last 7 days; time in Madagascar time with UTC on hover; result columns time, actor, action type in words, object, result success or refused, reference.
- SCR-OPS-51 no result: `No entries match` with the filters and a button to widen the date range.
- SCR-OPS-51 too many: more than the maximum shows the count and asks to narrow.
- SCR-OPS-51 loading: first page within `AUDIT_SEARCH_TARGET_SECONDS` (5) for a 7-day search; a longer search shows progress and can be cancelled.
- SCR-OPS-51 failure: filters kept; `Search failed. Retry`, never an empty result.
- SCR-OPS-51 retention: says how far back data exists; `Older entries are archived` with the process to request them (`AUDIT_RETENTION_YEARS`, 5).
- SCR-OPS-51 forbidden: operators without `search audit log`; SCR-OPS-03.
- SCR-OPS-51 immutability: no edit or delete control for entries.
- SCR-OPS-51 accessibility: visible labels; accepts a reference ID pasted with spaces; keyboard; result counts for screen readers; action types in words from keys.
- SCR-OPS-52 default: personal data masked as in OPS-01; permission changes in the same wording as members see (GRP-10); reveal needs a reason and is logged.
- SCR-OPS-53 default: needs the same permission plus a reason; the export is itself an audit entry with filters and row count; the file states if it was cut.
- SCR-OPS-54 default: only way to add information.
- SCR-OPS-55 default: reason from the short list, never free text.
- SCR-OPS-56 default: shown to the group's members.
- Self-audit: every search is recorded (operator, filters, time, number of results).

**Criteria map:**
- AC 1: SCR-OPS-51 default (search form fields, default range).
- AC 2: SCR-OPS-51 default and SCR-OPS-52 default (results and entry detail).
- AC 3: SCR-OPS-51 immutability and SCR-OPS-54 default.
- AC 4: SCR-OPS-52 default, SCR-OPS-55 default, SCR-OPS-56 default.
- AC 5: SCR-OPS-53 default.
- AC 6: SCR-OPS-51 no result and too many.
- AC 7: SCR-OPS-51 loading and failure.
- AC 8: SCR-OPS-51 retention.
- AC 9: no UI, system rule (no notification, no ledger; each search audited).
- AC 10: SCR-OPS-51 accessibility.

**Objects and fields:** Audit entry (time, actor, action type, object, result, reference, before and after, device, reason, linked objects); all objects referenced.

**Open points:**
- How operators request archived entries (the process named in `Older entries are archived`): not specified in the story.
- Whether SCR-OPS-55 applies only to a group audit log or to every search touching a group: the story gives the group audit log read; scope of other group-linked searches is not specified.
- Members see their own entries through ACC-14 and GRP-11 (closed); conventions R143 matches. No further screen.
- The reason list contents (for both Reveal and group read): not specified in the story.

---

### OPS-10 Review fraud and anomaly flags

**Story:** OPS-10 Review fraud and anomaly flags

**Surfaces:**
- SCR-OPS-57 | Flags list (`ops.flags`; flag ID, rule name, severity, subject masked, evidence summary in one sentence, status New, In review, Cleared, Escalated, Action taken, created, age, assignee) | page (console) | Operator holding `manage flags` | Entry: tile on SCR-OPS-02, `ops.flag.alert` | Exit: SCR-OPS-58
- SCR-OPS-58 | Flag page (evidence events with times, device and sign-in history, linked transactions, tier; actions note, assign, clear with a reason code, escalate, request a retake, place an Operator hold) | page (console) | Operator holding `manage flags` | Entry: SCR-OPS-57 | Exit: SCR-OPS-59
- SCR-OPS-59 | Operator hold dialog (target an account's money-out and sign-in, or a wallet; reason; expiry at most `FLAG_HOLD_MAX_HOURS` unless renewed with a new reason) | modal (console) | Operator holding `manage flags` | Entry: action on SCR-OPS-58 | Exit: SCR-OPS-58
- SCR-OPS-60 | Hold second-person approval (a second holder of `manage flags` for an account hold at or above `FLAG_SECOND_PERSON_SEVERITY`, and for every wallet hold) | inline (on SCR-OPS-58) | A second holder of `manage flags` | Entry: pending hold | Exit: SCR-OPS-58
- SCR-OPS-61 | Flag rules (name, condition, window, severity, on or off with a reason; counts of flags raised, cleared and actioned over a period; log-only mode) | page (console) | Operator holding `manage flags` | Entry: SCR-OPS-57 | Exit: SCR-OPS-57
- SCR-OPS-62 | Weak-ballot payout review (flag type `vote-authorised payout, weak ballots`, SPD-10; operator can only release or reject) | inline (on SCR-OPS-58) | Operator holding `manage flags` | Entry: flag raised by SPD-10 | Exit: SCR-OPS-58
- SCR-OPS-63 | Member account review message (`ops.flag.account_review`: "Your account is under a safety review. Contact support with reference {ref}." with the support route and the end time of the hold; never says which rule fired) | inline (member app) | The person under a hold | Entry: app open during a hold | Exit: support (OPS-06)
- SCR-OPS-64 | Notification: flag alert (`ops.flag.alert`, header count and email; High severity also SMS to the on-call operator) | notification (operator alert) | Operators on duty | Entry: a High severity flag | Exit: SCR-OPS-57
- SCR-OPS-65 | Rule engine status warning (`Flag rules not running since {time}`) | inline (on SCR-OPS-57) | Operator holding `manage flags` | Entry: engine not running | Exit: none

Member notices are catalogue rows EV-ACC-10 (`msg.acc.restricted`, SCR-NTF-109) and EV-OPS-05 (`msg.ops.wallet_held`, SCR-NTF-259).

**States per surface:**
- SCR-OPS-57 default: pages of 20 to 30.
- SCR-OPS-57 empty: `No open flags` with the time of the last rule run.
- SCR-OPS-57 forbidden: operators without `manage flags`; SCR-OPS-03.
- SCR-OPS-58 default: evidence as sentences, not raw JSON; severity with icon, word and colour.
- SCR-OPS-58 Operator hold on an account: stops the account's money-out and sign-in; money already received still posts to the ledger (including deposits and rule-made entries and chains); nothing moved or reversed; a held person is ineligible as approver or voter (GRP-13 AC2); a hold after a vote closes does not void that vote; never freezes a group wallet.
- SCR-OPS-58 wallet hold: label `Held by Gereo`, codes `wallet_held` and `destination_held`; blocks all money-out including every split leg and the Rounding line; incoming money still arrives and stays whole; payouts already Pending finish; the group cannot lift it; only an operator or expiry; raises no continuity alarm and no "no approver" recovery vote.
- SCR-OPS-58 group effect: a flag about a member never changes the group ledger or permissions; the operator cannot remove a member, edit group rules or move group money.
- SCR-OPS-58 log-only: rules start in log-only mode raising flags without holds.
- SCR-OPS-59 default: reason required; expires after at most `FLAG_HOLD_MAX_HOURS` (48) unless renewed with a new reason.
- SCR-OPS-60 default: second person approves; both identities in the audit log.
- SCR-OPS-61 default: no threshold hard-coded; start list of seven rules; rule switched on or off with a reason; tuning is an audit entry with before and after values; false-positive counts per rule.
- SCR-OPS-62 default: release or reject only; never a second approver; never counts toward the D4 floor; the reason never shown to voters or the group.
- SCR-OPS-63 default: shows the reference, the support route and the hold end time; never accuses; whether it may be more specific is a legal question.
- SCR-OPS-64 default: alert for a High severity flag.
- SCR-OPS-65 default: visible warning, never silence.
- Notifications: the person under a hold is told at once with `msg.acc.restricted` (EV-ACC-10); a wallet hold notifies holders of `Wallet: approve spend` and `Group: view audit log` with `msg.ops.wallet_held` (reference and support route, no reason); a hold is never silent.

**Criteria map:**
- AC 1: SCR-OPS-57 default and SCR-OPS-58 default.
- AC 2: SCR-OPS-61 default and SCR-OPS-62 default.
- AC 3: SCR-OPS-58 Operator hold on an account, SCR-OPS-59 default, SCR-OPS-60 default.
- AC 4: SCR-OPS-63 default.
- AC 5: SCR-OPS-58 wallet hold and group effect, SCR-OPS-60 default.
- AC 6: SCR-OPS-57 empty and SCR-OPS-65 default.
- AC 7: SCR-OPS-61 default (false positives, tuning audit).
- AC 8: SCR-OPS-64 default and Notifications (`ops.flag.alert`, `msg.acc.restricted`, `msg.ops.wallet_held`).
- AC 9: no UI, system rule (audit of flag raised, viewed, assigned, cleared, escalated, hold placed, second operator, renewed, lifted, rule changed).
- AC 10: SCR-OPS-58 default and SCR-OPS-63 default (icon, word, colour; sentences; three languages).

**Objects and fields:** Flag (rule, severity, subject, status, evidence); Rule definition (name, condition, window, severity, mode, counts); User; Device; Transaction; Operator hold (target, status Active, Expired, Lifted, expiry, reason); Notification; Audit entry.

**Open points:**
- The story says operator alerts are outside the NTF catalogue (`ops.*.alert`), yet the catalogue lists EV-OPS-04 `msg.ops.flag_alert` and EV-OPS-06 `msg.ops.sms_alert` for operators. Which channel and key owns operator alerts?
- The catalogue also lists EV-OPS-03 `msg.ops.account_review` (account under review, I, P, S-fb) while OPS-10 criterion 8 names only `msg.acc.restricted` (EV-ACC-10) for the person under a hold. Which one is sent, or both? Not specified in the story.
- Whether `ops.flag.account_review` message may be more specific is a legal question (open in the story; default generic text).
- Reporting duty for suspicious activity: left as an open question, no product action. Not specified in the story.
- The "hold" lifting by an operator: who lifts and whether a second person is needed to lift: not specified in the story (criterion 5: "only an operator or expiry can").
- Surface for a second operator to find pending holds awaiting approval: not specified in the story.

---

### OPS-11 Configure tier limits and fees, with a second person and a start date

**Story:** OPS-11 Configure tier limits and fees, with a second person and a start date

**Surfaces:**
- SCR-OPS-66 | Limits table (`ops.config.limits`: each tier Tier 1, 2, 3 against balance cap, single deposit, single money-out, per day and per month totals, `receive a transfer`, `transfer to another owner`; separate group wallet limit set; current active version, start time and author) | page (console) | Operator holding `edit limits and fees` (propose) or `approve limits and fees` | Entry: tile on SCR-OPS-02 | Exit: SCR-OPS-68
- SCR-OPS-67 | Fees table (`ops.config.fees`: per flow deposit, withdrawal same-network, withdrawal cross-network, transfer between wallets, contribution, group expense payout; three parts `FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE` off by default; fee kind, value, minimum, maximum; who pays) | page (console) | Same | Entry: tile on SCR-OPS-02 | Exit: SCR-OPS-68
- SCR-OPS-68 | Draft diff and preview (diff against the active version; effect: how many users would exceed a new limit; sample payment cost per fee case; start date and time in the future in Madagascar time; reason; `How is this calculated?`) | page (console) | Operator holding `edit limits and fees` | Entry: an edit on SCR-OPS-66 or SCR-OPS-67 | Exit: SCR-OPS-69
- SCR-OPS-69 | Version approval review (diff; approve or reject with a reason; a third approval for a fee change above `FEE_LARGE_CHANGE_PERCENT` of the active value) | page (console) | Operator holding `approve limits and fees`, not the proposer | Entry: Awaiting approval version | Exit: SCR-OPS-66
- SCR-OPS-70 | Version history (Draft, Awaiting approval, Scheduled, Active, Rejected, Replaced; rollback as a new copy) | inline (on SCR-OPS-66 and SCR-OPS-67) | Same | Entry: SCR-OPS-66 | Exit: SCR-OPS-68
- SCR-OPS-71 | Fee change notice (`ops.fees.change_notice`: start date, from the approval time; three languages) | inline (member app, fee surfaces) | Members | Entry: approved fee increase | Exit: none

**States per surface:**
- SCR-OPS-66 default: integer ariary in the amount format or `no limit` explicitly; a tier whose single money-out limit is zero is not money-out capable (GRP-13); the only place that holds limit numbers.
- SCR-OPS-66 forbidden: operators without either permission; SCR-OPS-03.
- SCR-OPS-67 default: Gereo fee starts at `0 Ar` in every flow; transfers between wallets show `0 Ar` unless configured; provider fee paid by the person on top by default; Gereo may absorb a part for one flow; Tax is a liability.
- SCR-OPS-68 draft: an edit creates a draft, never changes the active version.
- SCR-OPS-68 validation: whole ariary; configured percentage precision; minimum not above maximum; no negative value; a limit above a configured provider cap shows a warning and needs a note; invalid input shows the exact field and rule and keeps what was typed.
- SCR-OPS-68 large change: a fee change larger than `FEE_LARGE_CHANGE_PERCENT` (20) needs a third approval from another holder of `approve limits and fees`.
- SCR-OPS-69 approve: approved version is Scheduled and becomes Active at its start time without a deployment; the previous version becomes Replaced; only one version active at a time; the proposer cannot approve.
- SCR-OPS-69 reject: rejected with a reason.
- SCR-OPS-70 rollback: a new version copying an older one, never an edit.
- SCR-OPS-71 increase: shown from the approval time with the start date; the system enforces a minimum of `FEE_CHANGE_NOTICE_DAYS` (30) between approval and start for increases; decreases and limit increases may start at once; no new consent (ACC-13 only when a line type is added or the Rounding formula changes).
- Config load failure: the app uses the last cached values and the back office shows the problem; never zero or unlimited.
- Effect on requests: every transaction and expense request records the version in force; a limit change applies to a pending approval at approval and again at dispatch (SPD-10); limits compare amounts excluding fees; a limit lowered below a balance never removes money; it only blocks new deposits.

**Criteria map:**
- AC 1: SCR-OPS-66 default (table, group set, active version).
- AC 2: SCR-OPS-67 default (fee table, three parts, who pays).
- AC 3: SCR-OPS-68 draft (diff, preview, start date, reason).
- AC 4: SCR-OPS-69 approve and reject.
- AC 5: SCR-OPS-68 validation and large change.
- AC 6: effect on requests (recorded version, SPD-10, live fee from the active version).
- AC 7: SCR-OPS-71 increase (`ops.fees.change_notice`, `FEE_CHANGE_NOTICE_DAYS`).
- AC 8: config load failure and SCR-OPS-70 rollback.
- AC 9: no UI, system rule (fee lines written as ledger entries at settlement; audit of draft, edit, submit, approve, reject, activate, rollback).
- AC 10: SCR-OPS-68 draft (amount format, one number with `How is this calculated?`).

**Objects and fields:** Tier configuration (limits per tier and limit type, group limit set); Fee schedule (`FEE_TABLE_PROVIDER`, `FEE_TABLE_GEREO`, `TAX_LINE`); Limits and fees version (status, start time, author, approvers, reason); Transaction (version reference); Audit entry.

**Open points:**
- Values for limits, fees and the tax line are open as configuration; until set the app shows only existing levels (ACC-07). The UI must show "missing value" distinctly from zero or `no limit`. Not specified in the story.
- Whether the approver can edit a draft or only approve or reject: the story says approve or reject only; confirm.
- The notice shown in the app for a limit decrease (no notice required): not specified in the story.
- Text of the group wallet limit set screen section: not specified in the story.

---

### OPS-12 Watch SMS spending and delivery

**Story:** OPS-12 Watch SMS spending and delivery

**Surfaces:**
- SCR-OPS-72 | SMS dashboard (`ops.sms`; period today, 7 days, 30 days, custom; messages sent, segments sent, cost in ariary, average segments per message, delivery rate delivered, failed, unknown, time of last data update) | page (console) | Operator holding `view sms costs` | Entry: tile on SCR-OPS-02, `ops.sms.alert` | Exit: SCR-NTF-35
- SCR-OPS-73 | Breakdown panels (by base key in words, epic, language, destination operator, payer class, group top volume, day; per-group use of `ntf.group_sms_allowance` and its reserve) | inline (on SCR-OPS-72) | Same | Entry: SCR-OPS-72 | Exit: none
- SCR-OPS-74 | Encoding panel (templates and messages sent as UCS-2 or in more than one segment, with template key, language and the offending character) | inline (on SCR-OPS-72) | Same | Entry: SCR-OPS-72 | Exit: none
- SCR-OPS-75 | OTP monitor (OTP requests per hour, success rate, numbers over `OTP_MAX_SENDS_PER_HOUR`, top sources) | inline (on SCR-OPS-72) | Same | Entry: SCR-OPS-72 | Exit: SCR-OPS-57 (flag)
- SCR-OPS-76 | Budget and rate setting (`SMS_BUDGET_DAILY_AR`, `SMS_COST_PER_SEGMENT` per aggregator and operator) | sheet (console) | Same | Entry: SCR-OPS-72 | Exit: SCR-OPS-72
- SCR-OPS-77 | Notification: SMS alert (`ops.sms.alert` for budget, encoding breaches and OTP spikes; header count and email) | notification (operator alert) | Operators on duty | Entry: threshold passed | Exit: SCR-OPS-72

**States per surface:**
- SCR-OPS-72 default: headline numbers for the period; cost from `SMS_COST_PER_SEGMENT` per aggregator and operator.
- SCR-OPS-72 not connected: before an aggregator is connected, `ops.sms.not_connected` with what is needed.
- SCR-OPS-72 no messages: zeros with the period, not a blank.
- SCR-OPS-72 failed refresh: last data with `Not updated since {time}. Retry`.
- SCR-OPS-72 rate unknown: `SMS_COST_PER_SEGMENT` TBD; counts and segments shown without a cost until a rate is entered.
- SCR-OPS-72 data lag: messages with no delivery report after `ntf.sms_report_timeout` are counted as `unknown` and listed separately.
- SCR-OPS-72 budget: at `SMS_BUDGET_WARN_PERCENT` (80) a warning; at 100% an alert; reaching the budget never stops SMS and never throttles automatically.
- SCR-OPS-72 forbidden: operators without `view sms costs`; SCR-OPS-03.
- SCR-OPS-73 totals: match the headline and the NTF-12 log for the same period (messages accepted by the provider, sent time, Madagascar calendar days, 48-hour delivery tolerance, aggregator comparison at 02:00 next day); includes invitation SMS to invitees with no device.
- SCR-OPS-74 default: expected value zero.
- SCR-OPS-75 default: a spike above a configured factor raises an alert and a flag (OPS-10).
- SCR-OPS-76 default: changes audited with before and after values.
- SCR-OPS-77 default: alerts for budget, encoding breaches and OTP spikes; no user notified.
- Accessibility: amounts in the amount format; charts labelled directly and paired with a table; breakdown names in words.

**Criteria map:**
- AC 1: SCR-OPS-72 default.
- AC 2: SCR-OPS-73 totals.
- AC 3: SCR-OPS-74 default.
- AC 4: SCR-OPS-75 default.
- AC 5: SCR-OPS-72 budget and SCR-OPS-76 default.
- AC 6: SCR-OPS-72 not connected, no messages, failed refresh.
- AC 7: SCR-OPS-72 data lag.
- AC 8: SCR-OPS-77 default (`ops.sms.alert`).
- AC 9: no UI, system rule (audit of per-group breakdown views and changes of budget or aggregator rate).
- AC 10: accessibility (amount format, charts with table, words not raw keys).

**Objects and fields:** Notification (SMS: key, language, operator, payer, group, segments, encoding, delivery); SMS template catalogue; Aggregator rate; Audit entry.

**Open points:**
- The aggregator, its rates and delivery reports are open (needs an SMS aggregator quote); `SMS_COST_PER_SEGMENT` and `SMS_BUDGET_DAILY_AR` stay TBD.
- Catalogue row EV-OPS-06 (`msg.ops.sms_alert`, I and P, Important) conflicts with the story's `ops.sms.alert` outside the NTF catalogue. Which is the channel and key? (See OPS-10 open points.)
- "A spike above a configured factor of the usual level": the factor and the baseline window are not specified in the story.
- The operators' view of per-group breakdown and who may see group names: audited, masking rule not specified in the story.

---

### OPS-13 Watch and steer the payout queue

**Story:** OPS-13 Watch and steer the payout queue

**Surfaces:**
- SCR-OPS-78 | Payout queue (`ops.payouts`; transaction reference, provider reference, user or group masked, wallet, amount, fee, network same or cross, status, source personal wallet, passed vote or approvals, age in state, `Held by Gereo` marker, attempts, last provider response in words, linked ticket or flag; headline counts and total ariary in flight; filter `Queued`) | page (console) | Operator holding `manage payouts` | Entry: tile on SCR-OPS-02, `ops.payout.late_alert` | Exit: SCR-OPS-79
- SCR-OPS-79 | Payout row actions (`Retry`, `Cancel`, mark for reconciliation, note; the same text the user sees for a failure) | inline (on SCR-OPS-78) | Same | Entry: a row | Exit: SCR-OPS-80
- SCR-OPS-80 | Cancel confirmation (only before the request was sent to the provider; releases the hold with a reversing entry) | modal (console) | Same | Entry: `Cancel` | Exit: SCR-OPS-78
- SCR-OPS-81 | Pause or resume dispatch (one provider or all, with a reason; a pause or resume for all providers needs a second holder of `manage payouts`) | modal (console) | Same | Entry: action on SCR-OPS-78 | Exit: SCR-OPS-83
- SCR-OPS-82 | Notification: late payout (`ops.payout.late_alert`, header count and email) | notification (operator alert) | Operators on duty | Entry: a dispatched payout Pending beyond `PAYOUT_PENDING_ALERT_MINUTES` | Exit: SCR-OPS-78
- SCR-OPS-83 | Pause banner on top of the queue (visible pause; shown in the app as an incident via OPS-08 when it affects users) | inline (on SCR-OPS-78) | Operators; members through SCR-OPS-46 | Entry: a pause | Exit: SCR-OPS-45

User result notices are catalogue rows EV-WAL-05 and EV-WAL-06 (`msg.wal.withdrawal_confirmed`, SCR-NTF-122, and `msg.wal.withdrawal_failed`, SCR-NTF-123).

**States per surface:**
- SCR-OPS-78 default: statuses are the transaction statuses; a payout waiting for the provider is Pending with the sub-label "Waiting for the provider"; paged at 20 to 30 rows.
- SCR-OPS-78 empty: `No payouts waiting` with the time of the last refresh.
- SCR-OPS-78 failure: last list marked `Not updated since {time}. Retry`.
- SCR-OPS-78 late: a dispatched payout Pending beyond `PAYOUT_PENDING_ALERT_MINUTES` (10) becomes Needs attention (transaction) for the user and gets a `Late` marker.
- SCR-OPS-78 waiting for the provider: not late; waits up to `PAYOUT_PROVIDER_WAIT_MAX` (WAL); the operator sees its remaining time.
- SCR-OPS-78 escalated: Needs attention (transaction) after `NEEDS_ATTENTION_ESCALATE_HOURS` (WAL) gets the `Escalated` marker and goes to a second holder of `manage payouts`.
- SCR-OPS-78 forbidden: operators without `manage payouts`; SCR-OPS-03.
- SCR-OPS-79 retry: offered only where safe; re-sends the same idempotency key; first asks the provider for the real status; if paid the transaction moves to Confirmed and no new payout is sent; capped at `PAYOUT_RETRY_MAX` (3); not offered for an unknown outcome (the case goes to reconciliation).
- SCR-OPS-79 failed: the hold is reversed by a reversing entry; the transaction moves to Failed; the operator sees the same text the user sees; a provider failure after a debit with no credit is Needs attention linked to reconciliation (OPS-04, OPS-05).
- SCR-OPS-79 no edits: the operator can never change amount, payee, wallet or fee; never approve, authorise or start a payout the System has not authorised; never counts toward the floor; wrong-recipient cases go through a ticket and the provider's reversal process.
- SCR-OPS-80 default: releases the hold with a reversing entry and moves the transaction to Cancelled; never offered after dispatch (only wait, retry or mark for reconciliation); cancelling an authorised group payout sends the expense request to Needs attention and any retry uses the same authorisation while the request is unchanged.
- SCR-OPS-81 pause: requests keep arriving and show as Pending with "Waiting for the provider"; resuming is a separate action; does not freeze a group wallet.
- SCR-OPS-82 default: alert for a late dispatched payout.
- SCR-OPS-83 default: pause visible on top of the queue.

**Criteria map:**
- AC 1: SCR-OPS-78 default (columns, headline counts).
- AC 2: SCR-OPS-78 late, waiting for the provider, escalated, SCR-OPS-82 default.
- AC 3: SCR-OPS-79 retry.
- AC 4: SCR-OPS-80 default.
- AC 5: SCR-OPS-79 failed.
- AC 6: SCR-OPS-79 no edits.
- AC 7: SCR-OPS-81 pause and SCR-OPS-83 default.
- AC 8: SCR-OPS-78 empty and failure.
- AC 9: no UI, system rule (user result message `msg.wal.withdrawal_confirmed` or `msg.wal.withdrawal_failed`, one SMS per outcome; users not notified on an operator view).
- AC 10: no UI, system rule (holds, releases and reversals are System ledger entries; audit of each retry, cancel, pause, resume, mark for reconciliation, note).

**Objects and fields:** Transaction (status, sub-label, age, attempts, last provider response); Ledger entry; Provider response; Incident; Audit entry.

**Open points:**
- `PAYOUT_PROVIDER_WAIT_MAX` and `NEEDS_ATTENTION_ESCALATE_HOURS` values are owned by WAL and not given here. Not specified in the story.
- No status-check endpoint is assumed (closed), so the retry safety test of criterion 3 may be unavailable; the UI for "provider says paid" cannot be tested until a provider is known.
- "Mark for reconciliation" action: where the person sees the result (OPS-04 link) is not specified in the story.
- The text shown to the user for a Late payout (XCT-06) is not restated; not specified here.

---

### OPS-14 Watch the vote and decision-log jobs

**Story:** OPS-14 Watch the vote and decision-log jobs

**Surfaces:**
- SCR-OPS-84 | Platform job alerts (open list with status Open, Acknowledged, Resolved; name of the job, vote reference, group masked, time of failure) | page (console) | Operator holding `watch platform jobs` | Entry: tile on SCR-OPS-02, `ops.job.alert` | Exit: SCR-OPS-85
- SCR-OPS-85 | Job alert detail (read-only: whether a payout authorised by that vote exists and its status; action `Run the write again`) | page (console) | Same | Entry: SCR-OPS-84 | Exit: SCR-OPS-84
- SCR-OPS-86 | Notification: job alert (`ops.job.alert`, push and email only; never SMS whatever the severity) | notification (operator alert) | Operators on duty | Entry: failed vote-close job, failed decision-log write, daily gap | Exit: SCR-OPS-84
- SCR-OPS-87 | System: daily check at `JOB_CHECK_RUN_TIME` (every vote closed in the last day with no decision entry, every payout marked `payout_blocked` with no linked follow-up decision entry) | system | none | Entry: schedule, daily 06:30 Madagascar time | Exit: SCR-OPS-86

**States per surface:**
- SCR-OPS-84 default: alerts naming the job, vote reference, group masked and time; table with keyboard access.
- SCR-OPS-84 empty: `No open job alerts` with the time of the last check.
- SCR-OPS-84 failure: last list kept with `Not updated since {time}. Retry`.
- SCR-OPS-84 forbidden: operators without `watch platform jobs`; SCR-OPS-03.
- SCR-OPS-84 escalated: an alert left Open past `DISCREPANCY_ESCALATE_HOURS` (8) is re-sent with an `Escalated` marker.
- SCR-OPS-84 Resolved: automatically when the next check finds the gap closed.
- SCR-OPS-85 default: read-only; an operator cannot create, edit or delete a decision entry or change a vote result.
- SCR-OPS-85 rerun: `Run the write again` performed by the System idempotently on the vote ID, writing the entry with the original close time; running twice creates one entry.
- SCR-OPS-85 money: an operator never starts, releases or cancels the payout from here and never counts toward the D4 floor.
- SCR-OPS-86 default: alert for a failed job or write; channel limited to push and email.
- SCR-OPS-87 gap: each gap raises one alert; a day with none shows `All closed votes have a decision entry` with the time of the check.
- SCR-OPS-87 check failure: a failed daily check raises its own alert and never passes silently.

**Criteria map:**
- AC 1: SCR-OPS-86 default and SCR-OPS-84 default (`ops.job.alert`, push and email, no SMS).
- AC 2: SCR-OPS-87 gap.
- AC 3: SCR-OPS-85 default and rerun.
- AC 4: SCR-OPS-85 money.
- AC 5: SCR-OPS-84 escalated and Resolved, SCR-OPS-87 check failure.
- AC 6: SCR-OPS-84 empty and failure.
- AC 7: no UI, system rule (operators only; members not notified; a member whose vote result is delayed sees the normal state of VOT).
- AC 8: no UI, system rule (audit of alert raised, acknowledged, rerun requested, rerun result, resolved; decision entries follow `AUDIT_RETENTION_YEARS`).
- AC 9: SCR-OPS-84 default (icon and word, keyboard, English and French).

**Objects and fields:** Vote; Decision; Platform job alert (status, job, vote reference, group, failure time); Audit entry.

**Open points:**
- Whether `watch platform jobs` is held by the same on-call operators as `manage payouts` (open, needs the product owner); default is granting separately by `manage operator access`.
- The `Acknowledged` action: which button and who sees the acknowledger; not specified in the story.
- The story says the alert channel is that of OPS-13, "push and email"; conventions say operator alerts are header count plus email; whether operator push exists in the console is not specified.

---

## Catalogue of operator alerts (all kinds in this epic)

Header count and email to the on-duty list; High severity also SMS to the on-call operator (decision R148): `ops.kyc.late_alert` (SCR-OPS-15), `ops.recon.alert` (SCR-OPS-33), `ops.flag.alert` (SCR-OPS-64), `ops.sms.alert` (SCR-OPS-77), `ops.payout.late_alert` (SCR-OPS-82), `ops.job.alert` (SCR-OPS-86), `ops.access.changed` email (SCR-OPS-09), failed sign-in alert (SCR-OPS-10).

## Epic summary

Stories: 14.
Distinct surfaces: 87 (inline 25, modal 9, notification 8, page 30, sheet 11, system 4).
State lines: 202.
Open points: 58.

All open points:

1. OPS-01: OPS-01 criteria 4 and 5 appear on one line in the story ("...offers to end it.5. Business rule, no secrets."); confirm there are 10 separate criteria.
2. OPS-01: No screen is described for a second operator who has no permission yet and an empty home (SCR-OPS-02 no tile). Not specified in the story.
3. OPS-01: A second operator approving a grant: where do they see the pending grant (SCR-OPS-07 location is inferred from criterion 6)? Not specified in the story.
4. OPS-01: Whether the aggregator requires a named list of operators (open, needs the SMS aggregator); default is an export of the list of holders from the audit log. Surface for that export is not specified in the story.
5. OPS-01: The unit of "device" for operators (a browser profile or hardware): not specified in the story.
6. OPS-02: Is "waiting for user" cases shown in the default view or hidden? The story lists the status column and filter but not the default filter. Not specified in the story.
7. OPS-02: The header count (SCR-OPS-12) is shared by all OPS alerts; OPS-02 is the first story naming it and no story states where the alert list opens. Not specified in the story.
8. OPS-02: Tier 3 and duplicate-ID cases need a second person (OPS-03); how they appear in the queue (a "Needs second person" marker) is not specified in the story.
9. OPS-03: Where does a second person find a case sent to them (a queue marker or a separate list)? Not specified in the story.
10. OPS-03: Malagasy wording of each rejection reason (open, needs translators and field testing); no language ships with unreviewed reasons.
11. OPS-03: Where images are stored (open, needs the hosting choice); retention duration is ACC open question 1.
12. OPS-03: The case page offers `Approve Tier 2`; the decision button label for a lower tier chosen with a reason is not specified in the story.
13. OPS-03: "Escalate to support" target: creates an OPS-06 ticket? Not specified in the story.
14. OPS-04: `PENDING_TIMEOUT` (WAL-07) and `PAYOUT_PROVIDER_WAIT_MAX` (WAL) values are not given here. Not specified in the story.
15. OPS-04: Who holds the permission to start a run: the story says "an operator may also start a run" with `view reconciliation`, while manual import needs `resolve discrepancy`. Confirm that starting a run needs no write permission. Not specified in the story.
16. OPS-04: No provider statement or API is assumed (OPS open question 1); the exact manual import file format and error states are not specified in the story.
17. OPS-04: Which user-facing money states show `stuck` rows: label and key not specified in the story.
18. OPS-05: `CORRECTION_APPROVAL_THRESHOLD` value is owned by WAL and is TBD; the UI for the third approval cannot be designed with a number. Not specified in the story.
19. OPS-05: The story says `msg.wal.balance_corrected` is "to be added to the NTF catalogue"; the catalogue already lists it as EV-WAL-13. Confirm it is closed.
20. OPS-05: Shortfall booked as a Gereo loss line (closed question): which screen shows it? Not specified in the story.
21. OPS-05: Where the approver sees the pending proposals list (inbox): not specified in the story.
22. OPS-06: Support hours are "published in the app" (closed question): where and with which key? Not specified in the story.
23. OPS-06: The category list (money, identity, access, group, other) is given; no category for a failed split run besides money. Confirmed as money.
24. OPS-06: Reply templates content and keys: not specified in the story.
25. OPS-06: How an operator creates a ticket on behalf of a person who is not signed in (SCR-OPS-40): form fields not specified in the story.
26. OPS-07: NTF must mark EV-OPS-01 as SMS fallback for Waiting for you and Resolved (the story says it lists in-app and push only); the catalogue row now shows `S-fb` for those statuses; confirm closure.
27. OPS-07: The Help list is a member app screen not listed in ACC or GRP; where it sits in the navigation (09 section 4) is not specified in the story.
28. OPS-07: What the user sees for a ticket merged into another: not specified in the story.
29. OPS-07: The list of blocked words for outgoing text: configurable, content not specified in the story.
30. OPS-08: Conventions 10.4 says "Nothing was taken" stays valid "in OPS-09 Block mode", but Block mode is defined in OPS-08 (OPS-09 is the audit search). Correct citation?
31. OPS-08: Catalogue EV-OPS-02 lists `.push`, `.sms`, `.inapp`; the story gives SMS only after `INCIDENT_SMS_AFTER_MINUTES` and the NTF-05 window; the NTF row says "S-fb only for affected members with a pending request". Consistent; the interaction of the two windows is not specified in the story.
32. OPS-08: Surface for the on-call operator to see all active incidents (a list): not specified in the story.
33. OPS-08: Banner for queued payouts of members with no Pending request but who open the money-out screen: shown by criterion 2; text for that case is not specified.
34. OPS-09: How operators request archived entries (the process named in `Older entries are archived`): not specified in the story.
35. OPS-09: Whether SCR-OPS-55 applies only to a group audit log or to every search touching a group: the story gives the group audit log read; scope of other group-linked searches is not specified.
36. OPS-09: Members see their own entries through ACC-14 and GRP-11 (closed); conventions R143 matches. No further screen.
37. OPS-09: The reason list contents (for both Reveal and group read): not specified in the story.
38. OPS-10: The story says operator alerts are outside the NTF catalogue (`ops.*.alert`), yet the catalogue lists EV-OPS-04 `msg.ops.flag_alert` and EV-OPS-06 `msg.ops.sms_alert` for operators. Which channel and key owns operator alerts?
39. OPS-10: The catalogue also lists EV-OPS-03 `msg.ops.account_review` (account under review, I, P, S-fb) while OPS-10 criterion 8 names only `msg.acc.restricted` (EV-ACC-10) for the person under a hold. Which one is sent, or both? Not specified in the story.
40. OPS-10: Whether `ops.flag.account_review` message may be more specific is a legal question (open in the story; default generic text).
41. OPS-10: Reporting duty for suspicious activity: left as an open question, no product action. Not specified in the story.
42. OPS-10: The "hold" lifting by an operator: who lifts and whether a second person is needed to lift: not specified in the story (criterion 5: "only an operator or expiry can").
43. OPS-10: Surface for a second operator to find pending holds awaiting approval: not specified in the story.
44. OPS-11: Values for limits, fees and the tax line are open as configuration; until set the app shows only existing levels (ACC-07). The UI must show "missing value" distinctly from zero or `no limit`. Not specified in the story.
45. OPS-11: Whether the approver can edit a draft or only approve or reject: the story says approve or reject only; confirm.
46. OPS-11: The notice shown in the app for a limit decrease (no notice required): not specified in the story.
47. OPS-11: Text of the group wallet limit set screen section: not specified in the story.
48. OPS-12: The aggregator, its rates and delivery reports are open (needs an SMS aggregator quote); `SMS_COST_PER_SEGMENT` and `SMS_BUDGET_DAILY_AR` stay TBD.
49. OPS-12: Catalogue row EV-OPS-06 (`msg.ops.sms_alert`, I and P, Important) conflicts with the story's `ops.sms.alert` outside the NTF catalogue. Which is the channel and key? (See OPS-10 open points.)
50. OPS-12: "A spike above a configured factor of the usual level": the factor and the baseline window are not specified in the story.
51. OPS-12: The operators' view of per-group breakdown and who may see group names: audited, masking rule not specified in the story.
52. OPS-13: `PAYOUT_PROVIDER_WAIT_MAX` and `NEEDS_ATTENTION_ESCALATE_HOURS` values are owned by WAL and not given here. Not specified in the story.
53. OPS-13: No status-check endpoint is assumed (closed), so the retry safety test of criterion 3 may be unavailable; the UI for "provider says paid" cannot be tested until a provider is known.
54. OPS-13: "Mark for reconciliation" action: where the person sees the result (OPS-04 link) is not specified in the story.
55. OPS-13: The text shown to the user for a Late payout (XCT-06) is not restated; not specified here.
56. OPS-14: Whether `watch platform jobs` is held by the same on-call operators as `manage payouts` (open, needs the product owner); default is granting separately by `manage operator access`.
57. OPS-14: The `Acknowledged` action: which button and who sees the acknowledger; not specified in the story.
58. OPS-14: The story says the alert channel is that of OPS-13, "push and email"; conventions say operator alerts are header count plus email; whether operator push exists in the console is not specified.
