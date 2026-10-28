# VOT: Votes and decision log

Epic code: VOT. Release: MVP. Journey step: 5 Decide (and 7 Follow for the log). Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file (cited per story as "file section"):

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (called raw/04): section 1 Loomio, section 2 WhatsApp, section 10 Doodle, section 14 takeaways.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline, section 8.3 voting UX, section 8.4 approval UX, section 8.8 notifications.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.8 voting and decision log.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (MVP scope) and [design-foundations.md](../../research/design-foundations.md) section 4 (must-have rules for votes and approvals).

## Scope of the epic

In MVP: vote types yes/no/abstain and single choice; quorum and majority per vote; one automatic linked action (a passed vote starts the payment of an expense request); a proposal reference so other epics can gate their changes with a plain vote; guest voting through a shared link; reminders push then SMS; automatic close; result with outcome statement; no-quorum fallback; automatic and manual decision log entries; append-only amendments.

Not in MVP: ranking, weighted votes, multiple-choice (select several), automatic execution of anything other than an expense payout, secret-ballot cryptography, comments or discussion threads on a vote, voting by SMS reply (recorded as Later, see Open questions).

### Kinds of vote

| Kind | What it is | Extra rules |
| --- | --- | --- |
| Plain vote | A question to the group. Nothing happens automatically | Quorum and majority as set in VOT-02. Ballots may be Anonymous or Named (VOT-17) |
| Authority vote | Any vote linked to an expense request (VOT-03), or created from a proposal reference (GRP-12 loosening of the spending policy, GRP-14 recovery of approvers, SPD-15 lifting a freeze, RUL-13 and CON-13 rule and plan changes) | Every holder of Vote: vote is an eligible voter. Ballots are always Named. Quorum "no minimum" is refused. The floor below applies (decision D4). Only the expense payout runs by itself; for every other proposal reference, a person who holds the needed permission applies the change and cites the decision ID |
| Floor of distinct counted voters other than the requester | Authority vote: 2, fixed, no setting can lower it. Plain vote: none | Counted voters exclude guests and everyone on the GRP-13 AC2 list. A money vote that ends below the floor is "Not passed (quorum not met)". GRP-13 is the owner of the full rule and of the list of who is ineligible; this file owns only the vote half and does not restate the list. Evaluation is at vote close only, using ballots received by the server |

### Vote statuses and results

Status of a vote (shared table for this epic). Each status is shown as icon, word and colour.

| Status | Meaning |
| --- | --- |
| Draft | Saved by the creator, not opened. Visible only to the creator (VOT-01) |
| Open | Accepting ballots until the deadline |
| Closing | The system is computing the result (VOT-08) |
| Closed | Final. Carries exactly one result from the next table |
| Cancelled | Cancelled by a person or by the system before a result (VOT-12, VOT-03) |
| Needs attention | The close job or the decision-log write failed; an operator is alerted (VOT-08, VOT-13) |

Result of a Closed vote:

| Result | Meaning |
| --- | --- |
| Passed | Quorum met (and, for an authority vote, at least two distinct voters other than the requester), majority reached |
| Not passed (majority not reached) | Quorum met, majority not reached. Includes yes equal to no on yes/no votes |
| Not passed (quorum not met) | Quorum not met at close, or an authority vote that fails the D4 floor (VOT-03 criterion 3), including when it fails only because a voter left or was removed (reason `Not enough voters`, VOT-02 criterion 10) |
| Tie | Single choice only: two or more top options equal, quorum met (VOT-11) |

A cancelled vote has status Cancelled and no result. These four results and the Cancelled status are the only ones; VOT owns their names, and SPD maps them to its request rejection reasons (VOT-03 criterion 4).

States of a ballot on the voter's phone (the XCT-05 Table A queue states, with one vote-specific word): `Waiting to send`, `Sent`, `Confirmed` (shown to the voter as `Received`, `xct.queue.ballot_received`), `Too late`, `Not sent. Retry` (retries used up, XCT-05), `Withdrawn` (the person cancelled it before it synced, VOT-18). `Counted` appears only in results, and only for a ballot that counts toward quorum (D4).

## Parameters (configurable, never hard-coded in stories)

No number below is a legal fact or a research finding. Starting values are decided here from the evidence (real turnout of 2 to 20 percent makes strict defaults block decisions, raw/04 section 14.1 and 14.6) and are validated in field interviews, which do not block the build. Parameters owned by other epics are not repeated here: SMS wait and SMS budget are NTF (`ntf.sms_window.<type or class>`, `ntf.sms_window_deadline_share`, `ntf.group_sms_allowance`), guest OTP rules are ACC (`OTP_LENGTH`, `OTP_EXPIRY_MINUTES`, `OTP_MAX_SENDS_PER_HOUR`, `OTP_MAX_WRONG_ATTEMPTS`, `OTP_LOCK_MINUTES`, `OTP_RESEND_COUNTDOWN_SECONDS`), quiet hours and the reminder margin are NTF (`ntf.quiet_hours_default`, `ntf.reminder_margin_minutes`), offline cache depth is XCT (`CACHE_LEDGER_DAYS`) and the minimum margin before the deadline for queueing a ballot is XCT (`QUEUE_VOTE_MIN_MINUTES`).

| Parameter | Meaning | Starting value |
| --- | --- | --- |
| VOTE_MIN_DURATION / VOTE_MAX_DURATION | Shortest and longest allowed time between opening and deadline | 6 hours / 30 days |
| VOTE_MAX_OPTIONS | Most options on a single-choice vote | 6 |
| VOTE_DEFAULT_QUORUM_PERCENT | Default quorum as a percent of eligible voters | 30 |
| VOTE_DEFAULT_MAJORITY | Default majority rule | More than half of the yes and no votes (abstentions do not count toward yes or no) |
| VOTE_REMINDER_OFFSETS | When reminders go before the deadline | 24 h, plus 3 h for authority votes (raw/07 8.3 R-VT7, a hypothesis) |
| VOTE_REMINDER_MAX_PER_PERSON | Most automatic reminders one person gets for one vote | 3 |
| VOTE_MANUAL_REMINDER_GAP | Least time between two manual reminders from the creator, and from the last automatic one | 6 hours |
| VOTE_DEFAULT_NOQUORUM_FALLBACK | Default for the no-quorum setting | Extend once (see VOT-10) |
| VOTE_MAX_EXTENSIONS | How many times one vote may be extended, by fallback or by hand (VOT-10 and VOT-12 share this count) | 2 |
| VOTE_REOPEN_WINDOW | Time after a no-quorum close during which the creator may reopen | 48 hours |
| VOTE_CLOSE_TOLERANCE | Longest delay between the deadline and the closing of the vote | 60 seconds |
| VOTE_REFRESH_SECONDS | Refresh interval of participation while the vote page is open | 60 seconds |
| VOTE_DECISION_BACKDATE_DAYS | How far back the date taken of a manual decision may be (VOT-14) | 365 days |
| VOTE_AMEND_MIN_INTERVAL | Least time between two amendments of one decision entry (VOT-15) | 60 seconds |
| VOTE_DEFAULT_VISIBILITY | Default ballot mode for plain votes | Anonymous (VOT-17) |

## Message key convention

UI strings: `vot.<area>.<name>` (the decision log uses the area `decision`, for example `vot.decision.manual_badge`). Notifications use only the NTF base key form `msg.vot.<event>` (variants `.push`, `.sms`, `.inapp`), and every key named here is a row of the NTF catalogue (EV-VOT-01 to EV-VOT-18); NTF owns the rows, the classes and the SMS fallbacks, and this file adds no key and no SMS fallback outside the catalogue. The failed-vote key is `msg.vot.expense_failed` and the passed key is `msg.vot.expense_passed`. SMS length and encoding follow the XCT-12 per-language lint (mg, fr, en, with segment count, variables measured at maximum length) and the NTF-07 template rules. No text is written in this file; stories only name keys.

---

### VOT-01 Ask the group a question with a vote

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who can create votes, I want to write a question, give the options and set a deadline, so that the group can decide without a meeting.

**Conversation:** Async votes with a deadline remove the need to align everyone's schedule. The question must be a full sentence and each option must state its consequence, as Loomio and the research advise (raw/07 section 8.3 R-VT1). Only yes/no/abstain and single choice ship in the MVP; ranking and weighted votes are out (competitive-analysis section 7; raw/04 section 14.5). The deadline is shown in absolute and relative time (raw/07 R-VT2). WhatsApp polls have no record, no quorum and no link to money, which is why groups need this (raw/04 section 2). Quorum and majority are set in VOT-02, the money link in VOT-03, sharing in VOT-06. We did not include discussion threads: the chat stays in WhatsApp and Gereo is the record (raw/04 section 14.2).

**Preconditions:** The person is signed in, belongs to the group (or project) and holds Vote: create. The group has at least one eligible voter.
**Trigger:** The person taps "New vote" on the group page, the project page or the decision log.

**Acceptance criteria:**
1. The form asks, in this order: question (required), context (optional free text), type (yes/no/abstain or single choice), options, deadline, who can vote. Yes/no/abstain shows its three fixed options. Single choice needs 2 to VOTE_MAX_OPTIONS options, each a short sentence, no duplicates.
2. The deadline is picked as a date and time. Below the field the form shows both forms: `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`. A deadline outside VOTE_MIN_DURATION and VOTE_MAX_DURATION is refused with `vot.error.deadline_range`. For a money vote or an authority vote, a deadline inside quiet hours (NTF-09) is refused and snapped to the next slot inside 07:00-21:00, so that no payout starts before holders of Wallet: freeze can be informed. For every vote the creator sees the NTF-09 criterion 3 warning about the chosen deadline.
3. Eligible voters default to every Active member of the group (or project team) who holds Vote: vote, plus people with an Invited membership by phone number who were given the Member bundle at invite (GRP-03; they vote as guests, VOT-06). The creator may pick a subset on a plain vote; an authority vote always uses every holder of Vote: vote in the group that owns the wallet (VOT-03). Members without Vote: vote appear greyed out with the reason `vot.eligible.no_permission`. The eligible list is frozen when the vote opens. A non-member is never eligible.
4. A review step shows the whole vote as voters will see it, including the rule in plain words (from VOT-02), before the creator taps `Open the vote`. The button is labelled with the action, not "Next".
5. On open, the vote gets status Open and a reference ID, and appears in the group's vote list. Eligible members receive `msg.vot.opened` (EV-VOT-01); members without the app or who do not open it get the SMS variant after the NTF-05 wait.
6. States: while saving, the button shows a loading state and cannot be tapped twice (no duplicate vote). If the connection drops before opening, the vote is kept as a local draft marked `Draft, not sent` (XCT-05 Table B, never sent without a tap) and is never opened silently; publishing needs a connection and the creator taps `Open the vote` again when back online (`xct.offline.needs_connection`). If the save fails, the form keeps every field and shows `vot.error.save_failed` with a Retry button.
7. A draft (status Draft) can be left and resumed. A draft has no ballots, sends no notification and is visible only to its creator.
8. Audit: an audit entry records who created the vote, when, with the eligible list size and the rule, and who opened it.
9. Accessibility and language: every field has a visible label (no placeholder-only labels), touch targets are at least 48 by 48 dp, and the form works at 200% font size and 320 px width. The question and options keep the language the creator typed; fixed labels follow the viewer's language (Malagasy, French, English).
10. Proposal reference: when the form is opened from another epic's proposal (GRP-12, GRP-14, SPD-15, RUL-13, CON-13), the question is prefilled, the type is fixed to yes/no/abstain, the vote becomes an authority vote (see Kinds of vote), and the proposal type and ID are shown on the vote page and written to the decision entry as a read-only reference. The proposal reference is the only way to create a non-expense authority vote; the form offers no other route to one. The floor for these votes is owned by GRP-13 and counted under VOT-03 criterion 3. A passed vote does not execute the proposal: the holder of the needed permission applies it and cites the decision ID. The form also accepts two optional prefill inputs from the CON decision gate: `question_text` (generated from the snapshot, read-only) and `snapshot_ref` (immutable once the vote starts), shown with a `Why this vote` line. If the person edits the question, the prefill is dropped and the vote carries no `snapshot_ref`, so it can no longer be applied. This is a form parameter, not a linked-action type.

**Data:** Vote, Group or Project, Membership, Audit entry, Notification.
**Depends on:** GRP-03, GRP-08, NTF-05, NTF-09, XCT-05, VOT-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the maximum number of options is VOTE_MAX_OPTIONS (starting value 6), because a long list on a basic phone is unreadable. Closed: for a project vote the creator chooses between the project team and the whole group, except an authority vote on a project expense, which always goes to the group that owns the wallet, because the group's money is being decided.

---

### VOT-02 Set the quorum and the majority, and read them in plain words

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who creates a vote, I want to set how many people must vote and how many must agree, and see the rule in plain words, so that nobody can argue about the result afterwards.

**Conversation:** Loomio states the agreement rule up front, and quorum is the minimum share of eligible voters who must take part (raw/07 section 8.3 R-VT1 and R-VT3; raw/04 section 1). Loomio only shipped quorum and vote-share settings after 14 years, and real turnout is often 2 to 20%, so strict defaults will block decisions (raw/04 section 14.1 and 14.6). Defaults therefore come from parameters and the creator can change them per vote. Whether a vote linked to money needs a stricter rule is a business rule outside the permission system: the floor is owned by GRP-13 and its vote half by VOT-03 criterion 3; the quorum percent and majority stay configurable. Automatic vote-triggered rule changes are not in the MVP.

**Preconditions:** The create form (VOT-01) is open.
**Trigger:** The creator opens the "Rule" section of the form.

**Acceptance criteria:**
1. The form shows two settings: quorum (percent of eligible voters, prefilled from VOTE_DEFAULT_QUORUM_PERCENT) and majority rule (prefilled from VOTE_DEFAULT_MAJORITY). Quorum may also be set to "no minimum" with a warning `vot.rule.no_quorum_warning`, on a plain vote only. On an authority vote "no minimum" is refused: the option is not offered, and a request that sends it (for example from an older app version) is rejected with `vot.error.no_quorum_refused` ("A vote that decides money or a rule needs a minimum number of voters"). Floor owned by GRP-13; the summary adds the floor in plain words (`vot.rule.authority_floor`, count rule in VOT-03 criterion 3). The floor is shown as a count and applies even when the quorum percent works out lower.
2. Majority choices: for yes/no/abstain, "more than half of the yes and no votes" or "at least a percent set by the creator" (higher than half, up to all). For single choice, "the option with the most votes wins" (plurality, even when no option exceeds half; equal top options are a Tie, VOT-11). Abstain counts toward quorum and never toward yes or no. On an authority vote the requester's own yes counts toward the majority but never toward the D4 floor.
3. A plain-words summary is built from the settings and the current number of eligible voters, for example key `vot.rule.summary.simple` with the numbers filled in: who must vote, how many agree, what abstain does. It updates live as the creator edits and is shown identically on the review step, the vote page and the decision log.
4. Quorum is also shown as a count, rounded up to a whole person (for example "8 of 15"), never only as a percent.
5. Invalid input is refused with a clear message: quorum above 100% or negative, majority threshold not above half, non-numeric input. The form never saves a rule the summary cannot express.
6. The rule is locked when the first ballot is cast (see VOT-12). Group defaults can change later and never alter a vote already open.
7. If the eligible list changes before the first ballot, the summary and the count are recalculated and the creator sees `vot.rule.recalculated`. After the first ballot the eligible list and the quorum denominator stay fixed, including when a member leaves or is removed (GRP-16, GRP-17).
8. Audit: the rule values and the summary text that voters saw are stored with the vote and written to the audit entry at opening.
9. Accessibility and language: the summary is plain text (screen readers read it), never inside an image. Numbers use space grouping and are identical in Malagasy, French and English. Short sentences, one term per concept: "quorum" always has a plain gloss ("minimum number of voters").
10. Floor and departed voters: "distinct" is by account ID, which is stable after deletion (ACC-15 Former member). Only distinct voters other than the requester (for a gate vote, other than the `proposer_id` stored on the snapshot) who are still active members at close count toward the D4 floor. The tally and the denominator stay fixed, and the ballot of a departed or removed member stays counted (GRP-16, GRP-17). If the floor fails only because a voter left or was removed, the vote closes Not passed with the reason `Not enough voters` and says so. Test: an authority vote with the floor met at the deadline minus one hour, then one of those voters removed, closes Not passed with that reason and the departed ballot still appears in the totals.

**Data:** Vote (rule fields), Group settings (defaults), Audit entry.
**Depends on:** VOT-01, GRP (group defaults).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: starting defaults are quorum 30 percent and "more than half of yes and no" (see Parameters), chosen because turnout is often 2 to 20 percent and a strict default would block decisions (raw/04 section 14.1 and 14.6); the founding group may change them and field interviews validate them without blocking the build. Closed: "no minimum" is not allowed on authority votes (D4 floor). Closed: single choice with no option above half uses plurality.

---

### VOT-03 Start the payment of an expense when its vote passes

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Wallet: initiate spend (the requester, SPD-01), and the right to see the expense request. When the policy requires a vote (SPD-09), the system creates the vote on send and the requester does not need Vote: create. When a person starts a vote by hand on a request, Vote: create is also needed
**Tags:** audit, ledger

**Story:** As a member who proposes a spending, I want to link a vote to an expense request, so that when the group says yes the payment starts without a second round of approvals.

**Conversation:** This is the one vote-triggered action in the MVP and Gereo's open design space: nothing found combines a vote, a wallet and an approval in one flow (raw/08 section 6.8 "Open opportunities"; competitive-analysis section 5). Decision D4 (founder): a passed vote is the authorisation, so the payment starts without approvers; approvers exist only for spending below the vote threshold (`spend_vote_threshold`, owned by SPD). The vote page therefore must show exactly what will be paid (raw/07 section 8.4 R-AP1 and R-AP3; the Bybit lesson in raw/04 section 9 is that people approve what the screen shows). The floor that keeps one person from moving group money is owned by GRP-13; this story owns its vote half (criterion 3). Decision D1 stays intact: the requester can vote like any member, but never approves their own request. A money vote is always Named, because the ledger entry of the payout stores the vote and its voters (GRP-13) and SPD-09 shows who voted yes as the authorisation.

**Preconditions:** An expense request exists in status Draft, Awaiting approval, Needs changes or Awaiting vote (SPD status table) and has no open vote. At least two eligible voters other than the requester hold Vote: vote in the group that owns the wallet and are counted under criterion 3; with fewer, a money vote is unavailable and the approval band applies (conventions 10.7). Starting a vote on a request that is Awaiting approval moves it to Awaiting vote and sets its approvals aside; they are not reused.
**Trigger:** The request is sent while the policy requires a vote (SPD-09), or from the expense request the person taps "Ask the group to vote first", or, in VOT-01, the person picks "Link to an expense request".

**Acceptance criteria:**
1. When linked, the type is fixed to yes/no/abstain, the eligible voters are every holder of Vote: vote in the group (no subset), the ballots are Named, and the vote page shows the exact amount, payee, source wallet, purpose and attachment of the request, taken live from the request. It does not show the wallet balance to guests (see VOT-06).
2. Only one open vote can be linked to a given expense request. A second attempt is refused with `vot.link.already_open` and a link to the open vote. If eligible voters other than the requester number fewer than two, the link is refused with `vot.link.too_few_voters`, the approval band applies (conventions 10.7) and the next step is shown (grant Vote: vote to a second person, GRP-08).
3. An authority vote counts only if at least two distinct counted voters other than the requester voted (decision D4). GRP-13 is the master statement of the floor and of who is ineligible (its AC2 is the only list); this story owns only the vote half and other files cite both. A counted voter is one Active member with a PIN account, so guests count toward majority and quorum but never toward the floor. The floor is counted at close only, on ballots received by the server: queued ballots never count and no client timestamp is trusted (VOT-18). Eligibility and hold status are evaluated at close, and a later hold or departure never voids a closed vote (SPD-10 still stops the payout on balance, freeze or cap). A manual decision entry (VOT-14) or an amendment (VOT-15) never counts. When an authority vote ends with fewer than two counted voters, the result is Not passed (quorum not met) and the vote never falls back to approvals. When the vote closes as Passed (quorum met, majority reached, floor met), the vote is the authorisation: the request starts its payout without approvers through the SPD-10 checks (balance, freeze, spending cap, request unchanged) and the requester receives `msg.vot.expense_passed` (EV-VOT-11, shown by SPD-09). A payout authorised by a passed vote is never dispatched during quiet hours: it is held until quiet hours end and the result notice is released at the same moment (NTF-09). The vote result is shown on the request. The vote itself writes no ledger entry; the payout does. Vote close and the decision-entry write are one atomic step (VOT-13). If an SPD-10 check stops the payout and SPD reports `payout_blocked`, the request shows the reason and the next step (SPD-10, SPD-11), the vote is not run again, and a linked follow-up entry is created in the decision log (VOT-13 criterion 3); the closed entry is never edited.
4. When the vote closes as Not passed (majority not reached) the request becomes Rejected and the requester is notified with the single key `msg.vot.expense_failed` (EV-VOT-12, shown by SPD-09); SPD maps it to "The group did not approve". When the vote closes as Not passed (quorum not met), including `Not enough voters`, the request moves to Needs attention for 48 hours, not Rejected, and the requester receives the same key with the quorum reason, mapped by SPD to "Quorum not reached". During those 48 hours the requester may extend the vote once through the extension of criterion 6 and VOT-10, which reopens it with the same reference and a new deadline; only ballots received by the server count. If it is not extended within 48 hours, the request becomes Rejected. SPD owns the wording. When the vote is Cancelled, the request follows SPD-09 and SPD-12. It can be proposed again as a new request.
5. If the amount, payee, wallet or purpose of the request changes while the vote is open (SPD-07), the vote is cancelled automatically, all voters are told `msg.vot.cancelled` with the reason `vot.cancel.request_changed`, and earlier ballots do not carry over. When the policy requires a vote, the system opens a replacement vote for the changed request at once, with a new deadline and a link to the cancelled one (SPD-09 criterion 5); otherwise the requester may start a new vote.
6. If the request is cancelled or withdrawn while the vote is open, the vote is cancelled in the same way with the reason `vot.cancel.request_withdrawn`. A vote linked to a request cannot be closed early (VOT-08); it can be extended or cancelled.
7. The decision-log entry (VOT-13) shows the request, and later shows "Money moved" with a link to the ledger entry once the payment is Confirmed.
8. Audit: the link, the cancellation reason and the transition of the request are written to the audit log with actor and time. A person who cannot see the request cannot link it.
9. Accessibility and language: the amount reads `12 500 Ar` with no wrap and no clipping at 200% font size, identically in all three languages. The button reads `Open the vote` plus the amount, never a bare "Confirm".

**Data:** Vote, Expense request, Decision, Ledger entry (read by link), Audit entry.
**Depends on:** VOT-01, VOT-02, VOT-08, VOT-13, SPD-02, SPD-07, SPD-09, SPD-10, SPD-12, GRP-08, WAL-14, NTF-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a vote is mandatory above `spend_vote_threshold`, a setting owned by SPD-02 and GRP-12 (default: no vote required); VOT only reads it. Closed: the default minimum for a money vote is two distinct voters other than the requester, fixed (D4). Closed: the request statuses that allow a vote are listed in Preconditions.

---

### VOT-04 Cast my vote and change it until the vote closes

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: vote
**Tags:** audit

**Story:** As a member, I want to vote in a few taps and change my mind before the deadline, so that my voice counts without a meeting.

**Conversation:** Loomio lets voters change their vote until close and says so on the ballot (raw/07 section 8.3 R-VT4). Tap-to-vote simplicity is what keeps groups on WhatsApp polls (raw/04 section 2; raw/08 section 6.8). One vote per person, enforced by the person's identity. Guests are VOT-06 and offline casting is VOT-18.

**Preconditions:** The vote is Open, the person is on the frozen eligible list and holds Vote: vote.
**Trigger:** The person opens the vote from a notification, the vote list or a link.

**Acceptance criteria:**
1. The ballot shows the question, the options with their full sentences, and the line `vot.ballot.can_change` ("You can change your answer until {deadline}"). Choosing an option and tapping `Send my vote` records the ballot in at most two taps.
2. After voting the person sees a confirmation with their answer and the word `Received`, and the button changes to `Change my vote`. `Counted` appears only in results, and only for a ballot that counts toward quorum (D4). Changing replaces the earlier ballot and keeps the history in the audit log.
3. A person can hold only one current ballot per vote. A second device or a repeated tap never creates a second ballot.
4. If the vote has closed, the ballot is replaced by the result and `vot.ballot.closed`. A request arriving after the close is rejected and nothing is counted.
5. A person not on the eligible list sees `vot.error.not_eligible` and who to ask; a person on the list without Vote: vote sees `vot.error.no_permission` naming the missing permission and who can grant it.
6. States: sending shows `Sending` and disables the button; on failure the ballot is kept and shows `vot.error.send_failed` with Retry; the person can never be left unsure whether the vote counted.
7. Notifications: no notification to others when a person votes (see VOT-17 for visibility). The voter gets no push for their own vote.
8. Audit: on a Named vote every ballot and every change is stored with voter, time, device and previous value. On an Anonymous vote the audit stores that a ballot or a change happened, with voter, time and device, and keeps the answers only as the rules of VOT-17 allow. The person can see their own ballot history while the vote is open.
9. Accessibility and language: options are real radio buttons with 48 by 48 dp targets, selected state is shown by icon and text and not only colour, and the whole ballot is usable with a screen reader.

**Data:** Ballot, Vote, Membership, Audit entry.
**Depends on:** VOT-01, VOT-18 (offline casting), ACC-02 (signed-in session), GRP-08 (grant Vote: vote), XCT-05 (queue states).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no optional reason with the ballot in the MVP, because comments and discussion stay in WhatsApp (raw/04 section 14.2) and a reason field would need moderation.

---

### VOT-05 See where the vote stands: deadline, rule, quorum and participation

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: view
**Tags:** offline

**Story:** When a vote is open and I have a minute, I want to see the rule, how long is left and how many people have voted, so I can decide whether to vote now or remind others.

**Conversation:** Loomio shows quorum not met before the votes, updates it with participation and shows a check once met (raw/07 section 8.3 R-VT3). The deadline appears in absolute and relative time, updated at coarse granularity to save attention and battery (R-VT2). Quorum progress is a component to design once (design-foundations section 5). Loomio, Chi Hack Night (17% turnout) and the 2012 poll (2%) show participation is the structural problem, so the page must make it visible (raw/04 section 1).

**Preconditions:** The person holds Vote: view for the vote.
**Trigger:** The person opens the vote page.

**Acceptance criteria:**
1. The top of the page shows the question, the status chip (word and icon), the deadline as `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)` (format per XCT-03), and the rule in plain words from VOT-02. After close the chip shows one of the four results (Passed, Not passed (majority not reached), Not passed (quorum not met), Tie) or, for a vote stopped before a result, the status Cancelled.
2. The quorum meter shows a bar with a marker at the threshold and text such as `vot.quorum.progress` ("8 of 15 needed. 5 have voted"; any percent is formatted per XCT-02). When met, it shows a check and `vot.quorum.met`. After close it explains why a vote did not count (quorum not met versus rejected).
3. The relative time updates in days and hours, and in minutes only during the last hour. It does not tick every second.
4. Participation is live while the page is open and the connection is fine: it refreshes every VOTE_REFRESH_SECONDS, on pull-to-refresh and on return to the page. The page shows `Updating...` while refreshing and never blocks the screen with a full-page loader.
5. Option tallies (totals only, never names unless the vote is Named, VOT-17) are shown to a voter once they have cast a ballot, and to everyone with access after close. Before that the page shows participation only.
6. Offline or slow connection: the page loads from cache with a `Last synced` time and the quorum numbers are marked as possibly out of date. Casting stays available under the VOT-18 rules.
7. Loading shows a skeleton of the final layout. A vote the person cannot see returns `vot.error.not_visible` with who can grant access (never a bare "Not allowed").
8. Audit: none for reading; no read is logged.
9. Accessibility and language: the quorum is never conveyed by colour alone, the meter has a text equivalent that screen readers announce, and the layout reflows at 320 px without horizontal scroll.

**Data:** Vote, Ballot (counts only), Membership.
**Depends on:** VOT-01, VOT-02, VOT-04, XCT-02, XCT-03, XCT-04, XCT-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: interim totals are visible only after you have voted. Showing them to everyone from the start adds social pressure on a small group (raw/04 section 2 and 14.1), and hiding them until close makes the quorum meter less useful; participation counts stay visible to all in every case.

---

### VOT-06 Share a vote link so someone can vote without a full account

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Guest voter
**Permission needed:** none for the guest; Vote: view for the member who shares the link
**Tags:** sms, audit

**Story:** When a member of my group is on a basic phone and has not registered, I want to send them a link and have them vote with only their phone number and a code, so I can reach the whole group without asking them to install anything.

**Conversation:** "Another platform to sign in and register for" killed Loomio participation at Chi Hack Night, and Doodle shows that link-based answers with no account are what let a poll leave the app and work (raw/04 section 1, section 10 and section 14.2). Gereo must be the record that WhatsApp links into (competitive-analysis section 7). Conventions say voting needs only phone and OTP. Tricount's lesson is that a link must not equal full rights (raw/08 section 6.11 "Avoid"). We decided the link is not a credential: the verified phone number is, and it must match the eligible list. Text-only share message, not an image, because the design rules forbid text inside images (design-foundations section 4).

**Preconditions:** The vote is Open. The guest's phone number is on the frozen eligible list: an Invited membership created by phone number (GRP-03) that carries the Member bundle, or an Active member who opens the link without a session. A person who is not a member is never eligible.
**Trigger:** A member taps "Share" on the vote, or Gereo sends the guest a link by SMS (VOT-01, VOT-07); the guest taps the link in WhatsApp, SMS or a browser.

**Acceptance criteria:**
1. "Share" opens the phone's share sheet with a ready message (key `vot.share.message`: question, deadline, link). It also offers "Copy link". This story defines the vote share link: reusable, with an unguessable vote token, it can be forwarded freely because it is not a credential, and it stops accepting ballots at close. The other two link kinds are defined where their tokens are issued and are only referenced here: the invite share link (GRP-03) and the per-person single-use SMS link (NTF-11), which opens the same verification page.
2. Before verification the page shows only the group name, who asked and the closing time. The question and options appear only after the guest's number is verified as eligible, so a forwarded link never leaks what the group is deciding.
3. Verification: the guest enters a phone number and a one-time code by SMS (the ACC-02 rules and parameters apply: single input, autofill and paste allowed, `OTP_EXPIRY_MINUTES`, `OTP_MAX_WRONG_ATTEMPTS`, `OTP_RESEND_COUNTDOWN_SECONDS`). The first open of a link always requires an OTP. A verified number is then remembered on the same device for that vote's lifetime, with no second OTP. No PIN, no profile, no identity check is asked. The code SMS is a security message paid by the platform (NTF-06).
4. One number, one ballot: this is the only counting rule this story owns. The ballot is tied to the verified phone number. Guest ballots count toward majority and quorum but never toward the authority-vote floor (GRP-13, VOT-03 criterion 3), and the ballot screen tells a guest this with `vot.guest.floor_notice`. Opening the link on a second phone or verifying again shows the existing ballot, never a second one. A number not on the list sees `vot.guest.not_on_list` with the creator's name to ask.
5. After verification the guest can: read the question, context and options; see the deadline, the rule and quorum progress; vote and change the vote until close; see the result and outcome statement after close. For a vote linked to an expense the guest sees purpose, amount, payee and source wallet name, and never a balance.
6. The guest cannot see or do: the group ledger or any balance, the member list, other votes, the decision log, other projects, vote creation, comments. The guest session is ephemeral and limited to this vote (ACC-16 criterion 3): it creates no account and no profile. After voting the page offers an optional "Create an account" and never requires it. If the guest later registers with the same number, their ballots are attached to the new account.
7. The page is light for slow connections and basic browsers (within the route weight budget in design-foundations section 4), with a visible language switch (Malagasy, French, English) and a clear error when the link has expired or the vote is closed (`vot.guest.closed` plus the result when public to eligible voters).
8. Errors: wrong or expired code shows `vot.guest.otp_wrong` with Resend; too many attempts shows a lock message and when to retry; nothing counts until the ballot is confirmed on screen.
9. Audit and privacy: the audit entry records the masked phone number (not the full number in the UI), time, device and the share link token used. Rate limiting applies per number and per token.

**Data:** Vote, Ballot, Phone verification, Membership (invited, not registered), Audit entry.
**Depends on:** VOT-01, VOT-04, ACC-02 (phone and OTP), ACC-16 (open a vote link without an account), GRP-03 (invite by phone), NTF-11 (reach people without the app), XCT-01 (language), XCT-07 (low data), XCT-11 (route budget).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a guest session is ephemeral, because a light account would need a profile and a PIN that the guest on a basic phone does not have. Closed: the question is not visible before verification, because group decisions and money amounts must not leak through a forwarded link. Closed: a non-member can never be eligible by phone. Closed: voting by SMS reply for people with no data at all is recorded as Later, not in the MVP (see Open questions 7).

---

### VOT-07 Remind people who have not voted: push, then SMS

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (automatic); a manual extra reminder needs Vote: edit, or being the creator of the vote
**Tags:** sms, audit

**Story:** When the deadline is getting close and some eligible people have not voted, I want Gereo to remind exactly those people, first by push and then by SMS if they did not see it, so I do not have to phone everybody.

**Conversation:** Reminders are the proven lever for turnout and replace the manual calling of members. Research suggests one reminder about 24 h before the close and one in the last hours for money decisions, no more (raw/07 section 8.3 R-VT7, a hypothesis; Karlan et al. found extra late reminders did not add). The cadence is therefore a parameter. SMS must be rationed because it is costly (about USD 0.59 per segment on a global CPaaS, local rate not verified; raw/04 section 14.6 risk 3). Reminders must never shame: counts in the group channel, the names only where the setting allows (raw/07 R-NT8).

**Preconditions:** The vote is Open. At least one eligible person has no ballot.
**Trigger:** Each time in VOTE_REMINDER_OFFSETS before the deadline.

**Acceptance criteria:**
1. At each offset the system sends `msg.vot.closing_soon` (EV-VOT-02) to every eligible person without a ballot. Authority votes use the extra late offset and `msg.vot.closing_now` (EV-VOT-03).
2. If a person has not opened the push within the NTF-05 window (`ntf.sms_window.<type or class>`, deadline-aware), or has no registered device, the system sends the SMS variant of the same key. A person who has already voted, or who opened the push and voted, gets nothing, because NTF-05 re-checks the need just before sending.
3. Guests (VOT-06) who are on the eligible list receive the SMS with the link directly (NTF-11); they cannot receive push. For an unregistered number the only service SMS allowed are the link SMS, the OTP SMS and one reminder, with a per-number opt-out. A registered account follows its own ACC-13 consent.
4. The reminder never says who voted or how; it says the question, the closing time in absolute and relative form, and the link. The SMS stays within the XCT-12 limit (one GSM-7 segment of 160 characters in each language) and ends with the vote reference.
5. Quiet hours (NTF-09) apply to push and SMS and are never overridden by a vote, including on authority votes. A reminder whose send time falls inside quiet hours follows the NTF-09 reminder rule: it is sent at quiet hours end if at least `ntf.reminder_margin_minutes` remain before the deadline, otherwise at the latest slot before quiet hours begin the evening before.
6. A cap of VOTE_REMINDER_MAX_PER_PERSON automatic reminders per person per vote applies. The creator or a holder of Vote: edit may trigger one extra manual reminder at most every VOTE_MANUAL_REMINDER_GAP, with the number of people it will reach shown before sending.
7. States: if SMS delivery fails, the status of the attempt (sent, delivered, failed) is stored and visible to the vote creator as a count (for example `3 reminders not delivered`), without exposing names beyond what VOT-17 allows (NTF-02, NTF-13).
8. Audit: every reminder, channel, time and delivery result is stored. SMS volume is counted against the group's SMS allowance (NTF-06).
9. Language: each person gets the reminder in their preferred language. Message keys are linted per language (mg, fr, en) under XCT-12, where one non-GSM character switches an SMS to 70 characters per segment.

**Data:** Notification, Device, Ballot, Vote, Audit entry.
**Depends on:** VOT-01, VOT-06, NTF-02, NTF-05, NTF-06, NTF-09, NTF-11, NTF-13, ACC-06, ACC-13, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the group pays for vote reminders and notices from its SMS allowance, and the platform pays for guest security codes (the Pl and Gr legend in NTF Shared definitions). Closed: offsets start at 24 h and, for authority votes, 3 h (see Parameters), to validate in field interviews without blocking the build. Closed: a person can opt out of SMS for votes through NTF-10, after the warning about what they may miss.

---

### VOT-08 Close the vote at the deadline, or close it early

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** System, and Permission holder for early close
**Permission needed:** none for automatic close; Vote: close for early close
**Tags:** audit

**Story:** As a member who can close votes, I want the vote to close by itself at the deadline and to be able to close it early, so that the result is final and nobody can vote late or argue about the time.

**Conversation:** Loomio closes at the deadline and lets organisers close early (raw/08 section 6.8 "Adopt"). A fixed close time is what makes results undisputable. Late ballots (including those queued offline) are refused by the server's receipt time (raw/07 section 4 R-O5). Results and fallbacks are VOT-09 and VOT-10.

**Preconditions:** The vote is Open.
**Trigger:** The deadline is reached, or a person with Vote: close taps "Close now".

**Acceptance criteria:**
1. At the deadline the system closes the vote within VOTE_CLOSE_TOLERANCE. From that moment no new or changed ballot is accepted.
2. "Close now" shows a confirmation sheet with current participation, whether quorum is met and what the result would be, and a button labelled `Close the vote now`. It is available only to holders of Vote: close, and never on a vote linked to an expense request (VOT-03), which can only end at its deadline, be extended or be cancelled, so nobody can cut off the other voters of a money decision.
3. Closing early with quorum not reached closes the vote with the result Not passed (quorum not met) and warns first with `vot.close.early_no_quorum`. The no-quorum fallback of VOT-10 applies only at the deadline.
4. On close, the system computes the result using the stored rule (VOT-09), changes the status to Closed with the result, and writes the decision-log entry (VOT-13) in the same atomic step, then triggers any linked action (VOT-03). A money vote counts only with at least two distinct voters other than the requester (VOT-03 criterion 3); when eligible voters other than the requester number fewer than two, a money vote is unavailable and the approval band applies (conventions 10.7).
5. A closed vote is read-only. A ballot received after the close is rejected with `vot.error.closed` and, for queued ballots, the message in VOT-18.
6. Notifications: every eligible person receives the result in the app and by push: `msg.vot.result` (EV-VOT-04) for Passed and Not passed (majority not reached), `msg.vot.no_quorum` (EV-VOT-05, with the NTF-05 SMS fallback) for Not passed (quorum not met), `msg.vot.closed_tie` for Tie. A guest sees the result on their link and gets no result SMS. Quiet hours hold an unplanned result until they end (NTF-09); for a passed money vote the result notice and the payout are released together (VOT-03 criterion 3).
7. States: while the system computes the close, the vote has status Closing. If the close job or the decision-log write fails, the vote has status Needs attention for the creator and holders of Vote: close, the operator is alerted (OPS-14 is the backstop), and the vote still accepts no ballots after the deadline.
8. Audit: the closing mode (deadline or manual), the actor, the exact time and the final counts are written to the audit log. A manual close is attributable to a person.
9. Accessibility and language: the time shown in confirmations is absolute and relative, and the confirm button is not the default focus.

**Data:** Vote, Ballot, Decision, Audit entry, Notification.
**Depends on:** VOT-03, VOT-04, VOT-09, VOT-10, VOT-13, NTF-05, NTF-09, OPS-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no automatic close when everyone has voted. A fixed deadline is what makes the time predictable for people on poor connections, and the creator can still close early (except on a money vote).

---

### VOT-09 Read the result with a clear outcome and a next step

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: view
**Tags:** audit

**Story:** As a member, I want a closed vote to tell me in plain words whether it passed, why, and what happens next, so that nobody has to ask what was decided.

**Conversation:** Loomio's outcome statement states the result and the next step, is shown above the numbers and may carry a review date (raw/07 section 8.3 and raw/08 section 6.8). A failed vote should state facts, thank voters and name the next step (R-VT8). The decision trail is the winning value in every Loomio testimonial (raw/04 section 1).

**Preconditions:** The vote is closed.
**Trigger:** The person opens the vote or the notification after close.

**Acceptance criteria:**
1. The result is computed from the stored rule and shown as one of the four results of the shared table: Passed, Not passed (majority not reached), Not passed (quorum not met), Tie. A Cancelled vote shows the status Cancelled and no result. Each has a word, an icon and a colour, never colour alone.
2. An automatic outcome sentence is generated from message keys (`vot.outcome.passed`, `vot.outcome.rejected`, `vot.outcome.noquorum`, `vot.outcome.tie`, and `vot.outcome.authority_floor` when an authority vote failed the D4 floor, with the reason `Not enough voters`) with the counts filled in, for example "5 yes, 1 no, quorum not reached: 5 of 8 needed". It shows facts, not blame.
3. Counts and, where the ballot is named (VOT-17), names are shown as the setting stated before voting. Percentages never replace counts. The word `Counted` is shown against a ballot only when it counts toward quorum (D4).
4. The vote creator or a holder of Vote: close can add, after the close, a written outcome with a next step: what, who is responsible and by when, and an optional review date. Added text is appended with author and time and is not an edit of the automatic sentence.
5. If a review date is set, the system notifies the owner and the group on that date with `msg.vot.review_due` and links back to the decision.
6. If the vote was linked to an expense, the result page shows what happened to the request and a link to it (VOT-03).
7. States: while the result is computed the page shows a loading state; offline it shows the cached result with `Last synced`.
8. Audit: the outcome text, its author and time are stored and shown in the decision log.
9. Accessibility and language: the outcome sentence is plain text, translated per key, and fits at 200% font size.
10. Result for the CON decision gate: a closed vote exposes to CON its id, close time, status and `snapshot_ref`. Only a vote with the result Passed allows an Apply; Not passed (either reason), Tie, Needs attention and Cancelled do not.

**Data:** Vote, Decision, Audit entry, Notification.
**Depends on:** VOT-03, VOT-08, VOT-13, VOT-17, NTF-01, CON-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the next step is prompted, never required, because a mandatory field would block the close on a basic phone and the automatic sentence already states the result.

---

### VOT-10 Decide what happens when too few people vote

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create (to set), Vote: close (to reopen)
**Tags:** audit

**Story:** As a member who creates a vote, I want to choose in advance what happens if the quorum is not reached by the deadline, so that the vote does not stall and the group does not get a decision nobody agreed to.

**Conversation:** Loomio's documentation does not say what happens when there is no quorum at the deadline (raw/08 section 6.8 "Avoid"); Gereo must define it in the interface. With real turnout of 2 to 20%, no-quorum will be common, so a per-vote setting with a sane default is a named risk mitigation (raw/04 section 14.6 risk 1; competitive-analysis section 7). The default value is a parameter and an open question.

**Preconditions:** The create form is open (VOT-01), and a quorum greater than "no minimum" is set.
**Trigger:** The creator sets "If not enough people vote by the deadline", or the deadline arrives without quorum.

**Acceptance criteria:**
1. The form offers three choices, prefilled from VOTE_DEFAULT_NOQUORUM_FALLBACK: (a) extend once by a duration the creator picks, within VOTE_MAX_DURATION; (b) close as Not passed (quorum not met) and let the creator reopen within VOTE_REOPEN_WINDOW; (c) close as Not passed (quorum not met) with no reopen. The choice is explained in one plain sentence each (`vot.fallback.extend`, `vot.fallback.reopen`, `vot.fallback.close`). A vote linked to an expense request offers only (a) and (c), because it has its own 48-hour extension below and no reopen window; the default is the same as for other votes. An authority vote with fewer than two counted voters at close is always Not passed (quorum not met) whatever the fallback, and never falls back to approvals (VOT-03 criterion 3). For a money vote the linked request moves to Needs attention for 48 hours; the requester may extend the vote once through the VOT-03 criterion 6 extension (counted in VOTE_MAX_EXTENSIONS), and if it is not extended the request becomes Rejected (VOT-03 criterion 4). Only ballots received by the server count.
2. For (a), when the deadline arrives without quorum the system extends the deadline by the chosen duration (at most VOTE_MAX_EXTENSIONS), notifies every eligible person who has not voted with `msg.vot.extended` (EV-VOT-06, in-app and push), and shows the new deadline in absolute and relative form. The reminders of VOT-07 then run again against the new deadline, so SMS follows from them and not from the extension notice. If quorum is still not met after the last extension the vote closes as Not passed (quorum not met).
3. For (b), the vote closes as Not passed (quorum not met), the creator and holders of Vote: close are notified, and a `Reopen` action is available until the window ends. Reopening keeps all ballots and the same vote reference, sets a new deadline within the duration limits and notifies eligible voters (`msg.vot.opened`). Every close still writes its own decision entry (VOT-13). After the window the vote stays closed.
4. A vote that reaches quorum is never affected by the fallback.
5. The setting is shown to voters before voting with the rest of the rule (`vot.rule.summary` includes it) and is locked at the first ballot.
6. Each extension and reopening is a visible, logged action (who, when, from which deadline to which) and appears in the decision-log history.
7. A closed-as-no-quorum vote always creates a decision-log entry (VOT-13) so the failed attempt is on the record, and a later reopened vote links to it.
8. Errors: reopening after the window or beyond limits is refused with `vot.error.reopen_expired`.
9. Accessibility and language: choices are radio buttons with visible descriptions, and the dialog states consequences in plain words.

**Data:** Vote (fallback setting), Decision, Audit entry, Notification.
**Depends on:** VOT-01, VOT-02, VOT-03, VOT-07, VOT-08, VOT-13, NTF-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default is extend once, because it keeps the vote alive without a second decision by the creator, and money votes use the same default (with no reopen option). Closed: a reopened vote keeps its reference and gets one decision entry per close, linked in a chain.

---

### VOT-11 Handle a tie with a clear rule

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who created a single-choice vote that ended level, I want a clear tie result and an easy way to run a runoff, so that the group is not left with an unexplained outcome.

**Conversation:** Loomio's research does not cover ties and the product has no roles, so no one has a casting vote. A yes/no vote with a "more than half" rule cannot tie, because it simply does not pass. Only single choice can tie (raw/04 section 14.3 for the table-stakes list; this rule is a decision made here, not evidence).

**Preconditions:** A single-choice vote closes with the two or more top options equal and quorum met.
**Trigger:** The vote closes.

**Acceptance criteria:**
1. The result is Tie and states which options tied and with how many votes each (`vot.outcome.tie`).
2. No option is chosen automatically and no person has a casting vote.
3. The result page offers the vote creator and holders of Vote: close a "Start a runoff vote" action which opens VOT-01 prefilled with only the tied options, the same eligible voters and rule, and a new deadline to be set.
4. The runoff links back to the original vote and the decision-log entry shows both.
5. A yes/no vote where yes and no are equal under "more than half" closes as Not passed (majority not reached), not as Tie, and the outcome sentence says so.
6. A tie on a vote linked to money cannot occur (yes/no only), and the linked expense follows VOT-03 for Not passed.
7. Notifications: the result uses `msg.vot.closed_tie`; when the runoff opens, eligible voters receive `msg.vot.opened` like any new vote.
8. Audit: tie result, runoff creation and the link between the two votes are written to the audit log.
9. Accessibility and language: the tie explanation is plain text and reads correctly with 2 or more tied options.

**Data:** Vote, Ballot, Decision, Audit entry.
**Depends on:** VOT-01, VOT-08, VOT-09, VOT-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no tie-break rule in advance, because it would give a hidden casting vote to whoever orders the options; a runoff is the only way out.

---

### VOT-12 Edit, extend or cancel a vote

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** the vote's creator (Vote: create) may edit and cancel before the first ballot; Vote: edit for anyone else to edit and for everyone to extend; Vote: close to cancel after ballots
**Tags:** audit

**Story:** As the member who created a vote, I want to fix a mistake or cancel the vote before anyone has voted, and to extend the deadline afterwards, so that a typo does not force the group to vote twice.

**Conversation:** The research says never edit a vote after the first ballot without notifying and resetting votes (raw/07 section 8.3 R-VT9, an unverified rule) and Loomio supports edit and withdraw before the first vote (raw/04 section 14.3). We decided text, options, eligible list and rule are locked at the first ballot. Extending the deadline is allowed afterwards because organisers can extend (raw/07 section 8.3), but only as a visible, logged action.

**Preconditions:** The vote is Draft or Open and the person holds the permission named above.
**Trigger:** The person taps "Edit" or "Cancel vote" on the vote.

**Acceptance criteria:**
1. While there are zero ballots, the creator can edit question, context, options, deadline, eligible voters and rule. A saved edit updates the vote immediately and eligible voters are notified only if they had already been told (`msg.vot.updated`). A member added to the eligible list now is told with `msg.vot.opened`; adding after the first ballot is not allowed.
2. From the first ballot on, question, context, options, eligible list and rule are locked and the Edit screen says why (`vot.edit.locked`).
3. After the first ballot, the deadline may be extended (not shortened) with a mandatory reason, which notifies every eligible person who has not voted and appears in the vote history. Extensions count toward VOTE_MAX_EXTENSIONS. For a money vote or an authority vote, an extended deadline inside quiet hours is snapped to the next slot inside 07:00-21:00 as in VOT-01 criterion 2.
4. Cancelling with zero ballots needs a confirmation and removes the vote from the list with an audit entry; it creates no decision-log entry.
5. Cancelling after ballots exist needs Vote: close, a mandatory reason chosen from presets plus free text, and sends `msg.vot.cancelled` with the reason. Ballots are kept in the audit log, the vote shows Cancelled, and a decision-log entry records the cancellation (VOT-13).
6. If a vote linked to an expense is cancelled, VOT-03 applies to the request. Such a vote takes its amount, payee and wording from the request (SPD-09), so Vote: edit cannot change them once any ballot is cast. Test: with one ballot cast on a linked vote, an edit of amount, payee or wording by a holder of Vote: edit is refused and the vote and its ballots are unchanged.
7. Errors: two people editing at once get the latest saved version and a message `vot.edit.conflict` showing what changed (no silent overwrite).
8. Offline: edits are blocked with `xct.offline.needs_connection`, not queued, because they change what voters see.
9. Audit: every edit stores before and after values, actor and time; cancellations store the reason.

**Data:** Vote, Audit entry, Notification, Decision.
**Depends on:** VOT-01, VOT-03, VOT-10, VOT-13, NTF-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a member who joined late can be added only before the first ballot, as a logged edit, because adding voters afterwards would change the quorum denominator under the voters' feet. After the first ballot the list is fixed (see VOT-02 criterion 7).

---

### VOT-13 Record every closed vote in the decision log, linked to the money it moved

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (automatic); viewing needs Vote: view
**Tags:** audit, ledger

**Story:** When a vote closes, I want the decision to be written to the log by itself, with the vote and any payment it led to attached, so I can later answer "what was decided, why and what happened because of it" without searching a chat.

**Conversation:** Decisions in meetings are almost always forgotten or vague. The decision trail is the single strongest value cited by Loomio users (raw/04 section 1 and section 14.1 "value is the trail, not the click"). No product found links the decision to the ledger entry it triggered (raw/08 section 6.8 "Open opportunities"; competitive-analysis section 5). The entry must hold the question, options, result, quorum status, proposer, date, outcome with next steps and links to the ledger entries the decision triggered (raw/07 R-VT6).

**Preconditions:** A vote closes with any result, or is cancelled after at least one ballot.
**Trigger:** VOT-08 closing, VOT-12 cancellation after ballots, or the closing of a project (PRJ-09).

**Acceptance criteria:**
1. At each close the system creates exactly one decision entry (a reopened vote has one per close, VOT-10) holding: question, context, options, result with counts, quorum status, the rule in words, proposer, close date, ballot visibility mode, and a link to the vote. When the vote carries a `snapshot_ref`, the entry stores it. Vote close and the entry write are one atomic step.
2. Every one of the four results (Passed, Not passed (majority not reached), Not passed (quorum not met), Tie) and a Cancelled vote that had at least one ballot are logged. A vote cancelled before the first ballot is not logged as a decision.
3. If the vote was linked to an expense request, the entry links to the request. When the resulting payment reaches Confirmed in the ledger, the system appends a "Money moved" link with the ledger entry reference and amount to the decision entry; if the payment fails, is cancelled, or is stopped by an SPD-10 check, the system appends that status instead. When SPD reports `payout_blocked`, the system creates a linked follow-up entry in the log; entries are immutable and the earlier entry is never edited.
4. The entry belongs to the project when the vote belongs to a project, and to the group otherwise. A project decision also appears in the group log.
5. The entry is append-only: the system never edits earlier fields. Later additions (outcome statement, review date, money links, reopen links, amendments) are appended with author, time and source.
6. If a vote is reopened (VOT-10) or a runoff is started (VOT-11), the new entry links to the earlier one and both stay visible.
7. States: close and entry write are one atomic step. If the write fails, the vote shows Needs attention instead of Closed, no linked action runs, the creator and the operator are alerted, and the system retries until it succeeds; no closed vote is ever without an entry (OPS-14 is the backstop and checks that every closed vote has an entry).
8. Notifications: members with access receive the result as in VOT-08. An automatic entry sends no notification of its own, so there is no second push for the same event. The in-app item `msg.vot.decision_logged` is emitted only by VOT-14 (manual entries).
9. Audit and ledger: each append is an audit entry; the money link is a read-only reference to a ledger entry, and the decision never writes to the ledger itself.
10. System-written entry: when PRJ-09 closes a project, the system writes the entry `Project closed by {name}` to the project log and the group log. It has no vote counts, is append-only like every entry, and is marked as written by the system.

**Data:** Decision, Vote, Expense request, Ledger entry (reference), Audit entry.
**Depends on:** VOT-03, VOT-08, VOT-09, VOT-12, SPD-09, SPD-13, SPD-16, WAL-14, OPS-14, PRJ-05, PRJ-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the anonymous ballot-to-voter link is not kept after close (VOT-17 criterion 8), so the log holds totals only for Anonymous votes. Closed: members who were not eligible can see the entry if they can view the group or project, because the log is the group's shared record.

---

### VOT-14 Record a decision that was taken outside the app

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create, at project level for a project decision and at group level for a group decision (permissions are inherited, conventions section 2)
**Tags:** audit, offline

**Story:** As a member who attended a meeting, I want to write down what was decided and who is responsible, so that decisions taken in a room or on the phone are not lost.

**Conversation:** Groups keep deciding in meetings and calls, and those decisions are the ones forgotten. Every important decision must be linked to a vote or to an identified person. "Decision" is not an object in the permission catalogue, so recording a decision reuses Vote: create, the permission to put a question to the group; amending uses Vote: edit (VOT-15). Manual entries must be visibly different from vote results so nobody mistakes them for a counted vote.

**Preconditions:** The person can add a decision to the group or project.
**Trigger:** The person taps "Record a decision" on the decision log or project page.

**Acceptance criteria:**
1. The form asks: what was decided (required), context (optional), date taken (required, not in the future, not older than a parameter), where it was taken (list: meeting, phone call, chat, other), who took it (pick members, or free-text names for people not in the group), and the responsible person (required, a member).
2. The entry is stored with the badge `vot.decision.manual_badge` ("Recorded by {name}, not a vote") and never shows vote counts or a result chip.
3. The entry accepts up to `PROJECT_ATTACHMENTS_PER_ITEM` files (for example a photo of minutes), under the rules of PRJ-07 and SPD-03.
4. A manual entry may be linked to a project and to an existing vote or expense request. The link is information only. If linked to a vote, the vote result stays separate and unchanged.
5. Saving shows the entry to members who can view the log as the in-app item `msg.vot.decision_logged` (EV-PRJ-06, summary only: title and responsible person; this story is the only emitter of that key), and notifies the named responsible person with `msg.vot.decision_assigned` (push).
6. Offline: the entry is an auto-send item in the XCT-05 Table A registry. It is saved on the phone with the state `Waiting to send`, sent when the connection returns, and the date taken remains as typed. A conflict never overwrites another entry.
7. Errors: missing responsible person or invalid date shows an inline message and keeps all other fields.
8. Audit: the author, time, device and all fields are stored. The author is shown to everyone who sees the entry.
9. Accessibility and language: the person picker is searchable and keyboard-usable, and fixed labels follow the viewer's language while the typed text keeps its language.
10. Authorisation guard: a manual entry moves no money. It can never be the authorising vote of a payout (D4, SPD-10), and it never counts toward quorum or approver counts. The entry shows both the date typed and the date it was entered.

**Data:** Decision, Document, Membership, Audit entry.
**Depends on:** VOT-03, VOT-13, PRJ-07, SPD-03, GRP-08, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the permission is Vote: create. Closed: a manual decision can be dated before the author joined the group, within VOTE_DECISION_BACKDATE_DAYS, because the record describes the group, not the author; the author and the date of entry stay visible.

---

### VOT-15 Correct or replace a decision without erasing the original

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: edit
**Tags:** audit

**Story:** As a member who spots a wrong or outdated decision entry, I want to amend or supersede it with a visible note, so that the record stays honest and nothing is rewritten.

**Conversation:** Audit log and no deletion of decisions, append-only with amendments, is a table-stakes item (raw/04 section 14.3). The same principle as the ledger: correct with a new record, never edit (conventions, section 2). Votes' counts are never amendable; only context and outcome fields are.

**Preconditions:** A decision entry exists and the person can edit decisions.
**Trigger:** The person taps "Amend" or "Replace this decision" on the entry.

**Acceptance criteria:**
1. "Amend" adds an amendment that carries a mandatory reason, the new text and the author. The original text, counts and attachments remain visible in a history chain on the entry.
2. The entry shows an `Amended` chip and the latest text first, with "Show original" one tap away. A manual entry keeps the badge `Recorded by {name}, not a vote` through every amendment, and the original text stays visible.
3. Vote counts, result, quorum status and the rule words are locked and cannot be amended; the Amend form does not offer them. An amendment moves no money, can never serve as the authorising vote of a payout (D4, SPD-10) and never counts toward quorum or approver counts.
4. "Replace this decision" creates a new decision (manual or from a new vote) that links back with `Supersedes {title}`; the old entry shows `Superseded by` with a link and stays readable.
5. Notifications: members who voted or are the responsible person receive `msg.vot.amended`, summary only.
6. A second amendment of the same entry within VOTE_AMEND_MIN_INTERVAL is refused to prevent accidental duplicates, and a duplicate amendment shows `vot.decision.duplicate`.
7. Offline: amendments are auto-send items in the XCT-05 Table A registry; they queue as `Waiting to send` and sync in order of creation; a conflict shows both versions (`Your change` and `{name}'s change`, as in XCT-05).
8. Audit: the amendment, reason, author and time are written to the audit log, and no earlier record is modified or deleted. There is no delete action on a decision.
9. Accessibility and language: history is a plain list readable by screen readers, with absolute dates.

**Data:** Decision (append records), Audit entry, Notification.
**Depends on:** VOT-13, VOT-14, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a hidden-for-error status is needed for an entry created by mistake (default proposed: amend with reason, never hide).

---

### VOT-16 Find past decisions in the decision log

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: view (and view on the parent group or project)
**Tags:** offline

**Story:** When someone asks "why did we decide that?", I want to open the log, search and see the decision with its context and the money it moved, so I can answer in seconds.

**Conversation:** A searchable archive with export is what Loomio adds beyond the poll itself (raw/08 section 6.8 "Adopt"; raw/04 section 1). Groups use the log at meetings, often on weak connections, so it must read offline (conventions section 2).

**Preconditions:** The person can view the group or project.
**Trigger:** The person opens "Decisions" from the group or project page.

**Acceptance criteria:**
1. The list is newest first. Each row shows: question or title, result chip (word, icon, colour), date, proposer or responsible person, and a "Money moved" or "Manual" marker.
2. The person can filter by project, result (Passed, Not passed for either reason, Tie), kind (vote or manual entry), status (Cancelled, Amended), date range and group or project scope.
3. Free-text search covers title, question, context, outcome statement and option text, and shows the matching words. Search with no match shows an empty state with a clear action (`vot.decision.search_empty`).
4. The group log includes project decisions and says which project each belongs to; a project log shows only its own.
5. Opening a row shows the full entry, the history chain, the linked vote, expense request and ledger entry, and attachments the person is allowed to see.
6. Empty state: a group with no decisions sees `vot.decision.list_empty` and a button to open a vote or record a decision, depending on permissions.
7. Offline: entries from the last `CACHE_LEDGER_DAYS` (XCT-04) are available with a `Last synced` time, search works on cached entries, and the page says that older entries need a connection (without using the word "offline").
8. Loading shows skeleton rows; a slow connection loads the first page quickly and the rest on scroll with a visible count.
9. Accessibility and language: the list is readable by a screen reader row by row, filters have text labels, and searching Malagasy and French text handles accents (a search for "e" matches "ê" and "é").

**Data:** Decision, Vote, Project, Expense request, Ledger entry (reference), Document.
**Depends on:** VOT-13, VOT-14, VOT-15, XCT-04 (offline cache, last synced), PRJ-05 (project scope).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: export of the log as CSV and PDF is not part of this story; it is a P2 follow-up that reuses the WAL-16 export component and is not yet a story.

---

### VOT-17 Choose whether ballots are named or anonymous

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who creates a vote, I want to say whether people can see who voted what, so that members feel free to vote honestly and the group still trusts the result.

**Conversation:** Public votes create social pressure (WhatsApp changes aimed at hidden voter names, single source, raw/04 section 2 and section 14.1); raw/07 R-VT5 says the group's setting must be stated before voting. Open question with a default: the founding group's culture is not yet known, and money approvals are named by nature. This story captures the setting and its defaults, and the open question must be settled in field interviews.

**Preconditions:** The create form is open.
**Trigger:** The creator opens "Who can see how people voted".

**Acceptance criteria:**
1. The form offers two options: Anonymous (only totals are shown; nobody sees who voted what) and Named (members see each person's answer). The default is VOTE_DEFAULT_VISIBILITY (Anonymous), and the choice is explained in one sentence each (`vot.visibility.anonymous`, `vot.visibility.named`). On an authority vote the choice is not offered: the vote is always Named, and the form says why (`vot.visibility.authority_named`).
2. The choice is shown on the ballot page before the person votes, and again on the result page. It is locked at the first ballot.
3. In both modes, everyone sees participation counts. In Anonymous mode, only the creator and holders of Vote: close see the list of people who have not voted yet (to chase them privately), never any answers. In Named mode, every member with Vote: view sees names and answers.
4. Guests (VOT-06) follow the same mode: their answer is shown with a display name from their membership in Named mode, or hidden in Anonymous mode.
5. For a vote linked to an expense, Named is shown next to the amount. The payout's ledger entry stores the vote and its voters (GRP-13) and SPD-09 shows who voted yes as the authorisation, so an Anonymous money vote would contradict both.
6. The decision-log entry stores the mode, and in Anonymous mode shows totals only.
7. Reminders and notifications never mention who voted what in either mode.
8. Audit: in Anonymous mode, the system stores one ballot per voter for integrity (one vote per person) but exposes no answer-to-person view in the interface, and the creator cannot export one. At close, the link between each answer and its voter is removed: the decision entry keeps the totals and the list of who took part, and operators never see an answer-to-person link.
9. Accessibility and language: the privacy explanation is plain, in three languages, and appears as text with an icon, not only an icon.

**Data:** Vote (visibility setting), Ballot, Audit entry.
**Depends on:** VOT-01, VOT-03, VOT-04, VOT-05, VOT-13, GRP-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default for plain votes is Anonymous, a starting value that field interviews may change without blocking the build. Closed: money-linked (authority) votes are Named, for the reasons in criterion 5. Closed: nobody, operators and auditors included, sees an answer-to-person link on an Anonymous vote after close. Closed: the list of non-voters is shown only to the creator and holders of Vote: close, privately, and never in the group channel, which follows raw/07 R-NT8.

---

### VOT-18 Vote when the connection is poor and see the ballot's state

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: vote
**Tags:** offline, audit

**Story:** When I have no data or a bad connection and a vote is about to close, I want to cast my vote on the phone and see clearly whether it was sent and counted, so I am never unsure about my vote.

**Conversation:** Votes and drafts queue with a visible state while money-out stays online only (design-foundations section 4; conventions section 2). Per-item states `Waiting to send`, `Sent`, `Confirmed` (shown to the voter as `Received`); queue size and age visible; the ledger is server-authoritative; a vote queued offline carries a client timestamp and device ID and the server records receipt time; a late ballot shows "Too late: voting closed 17:00, your answer arrived 17:04" (raw/07 section 4 R-O1 to R-O5). We decided the server's receipt time decides whether a ballot counts, with no grace window: the device clock is forgeable, and a grace window would let the result change after the deadline and make the outcome statement and the payout of a money vote disputable. The authority-vote floor (GRP-13, VOT-03 criterion 3) is counted only on ballots received by the server at close; a queued ballot never counts and no client timestamp is trusted. XCT-05 criterion 4 states the same rule.

**Preconditions:** The vote page was loaded at least once on this device, the vote is Open on the cached copy, and the deadline is more than `QUEUE_VOTE_MIN_MINUTES` away (XCT-05 Table A; there is no grace window).
**Trigger:** The person taps `Send my vote` without a working connection.

**Acceptance criteria:**
1. The ballot is stored on the phone at once and shown as `Waiting to send` (`xct.queue.waiting`). The screen says `vot.offline.not_counted` ("Not counted yet. Connect before {deadline}"), with the deadline in absolute and relative form.
2. When the app is open with a connection, it sends the ballot automatically with exponential backoff, and the state moves to `Sent` and then `Confirmed`, shown to the voter as `Received`, when the server confirms. `Counted` appears only in results and only when the ballot counts toward quorum (D4). A ballot still queued at the deadline counts toward nothing, the floor included. A queued ballot keeps retrying until the deadline and shows `Open Gereo when you have signal`. A `Retry now` button is always available. The ballot screen says that reminders may still arrive until the ballot is sent.
3. A single header indicator shows the sync state (`Updated 14:05`, `Updating...`, or `Not updated since yesterday - Retry`), and a counter shows items waiting and their age (`1 item waiting since Mon`).
4. If the server receives the ballot after the deadline it is rejected, and the person sees `vot.offline.too_late` with both times (voting closed, answer arrived). Nothing is counted and the ballot is shown as `Too late`.
5. One ballot per (voter, vote), decided by server receipt order and never by client time, and deduplicated on (voter, vote) across devices. A voter may change the ballot until the deadline and the last one received wins; if the person changes it again before sync, only the latest is sent. The screen shows the final state, never two states.
6. The person can cancel a ballot that is still `Waiting to send` before it syncs, with the state changing to `Withdrawn`.
7. The stored ballot carries client timestamp and device ID, and the server stores receipt time. Both are in the audit entry (client time is informational and is never what decides). At receipt the server re-checks Vote: vote and membership, and rejects the ballot of a removed or demoted voter with a reason shown to the voter. A guest voter on the light vote page (VOT-06) cannot queue a ballot and sees `xct.offline.needs_connection`.
8. The vote page offline shows cached question, rule and last-known participation with a `Last synced` time; options and the rule come from the version the person saw.
9. Accessibility and language: every state has text, an icon and a colour. The deadline warning is announced to screen readers.

**Data:** Ballot (queued), Vote (cache), Device, Audit entry.
**Depends on:** VOT-04, XCT-03, XCT-04, XCT-05, ACC-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no grace window (see Conversation). Closed: vote by SMS is recorded as Later (see Open questions 7).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| VOT-01 | Ask the group a question with a vote | P0 | GRP-03, GRP-08, NTF-05, NTF-09, XCT-05, VOT-03 |
| VOT-02 | Set the quorum and the majority, and read them in plain words | P0 | VOT-01, GRP-16, GRP-17 |
| VOT-03 | Start the payment of an expense when its vote passes | P0 | VOT-01, VOT-02, VOT-08, VOT-13, SPD-02, SPD-07, SPD-09, SPD-10, SPD-12, GRP-08, WAL-14 |
| VOT-04 | Cast my vote and change it until the vote closes | P0 | VOT-01, VOT-18, ACC-02, GRP-08, XCT-05 |
| VOT-05 | See where the vote stands: deadline, rule, quorum and participation | P0 | VOT-01, VOT-02, VOT-04, XCT-02, XCT-03, XCT-04, XCT-09 |
| VOT-06 | Share a vote link so someone can vote without a full account | P0 | VOT-01, VOT-04, ACC-02, ACC-16, GRP-03, NTF-11, XCT-01, XCT-07, XCT-11 |
| VOT-07 | Remind people who have not voted: push, then SMS | P0 | VOT-01, VOT-06, NTF-02, NTF-05, NTF-06, NTF-09, NTF-11, NTF-13, ACC-06 |
| VOT-08 | Close the vote at the deadline, or close it early | P0 | VOT-03, VOT-04, VOT-09, VOT-10, VOT-13, NTF-05, NTF-09, OPS-14 |
| VOT-09 | Read the result with a clear outcome and a next step | P0 | VOT-03, VOT-08, VOT-13, VOT-17, NTF-01, CON-13 |
| VOT-10 | Decide what happens when too few people vote | P0 | VOT-01, VOT-02, VOT-03, VOT-07, VOT-08, VOT-13, NTF-01 |
| VOT-11 | Handle a tie with a clear rule | P1 | VOT-01, VOT-08, VOT-09, VOT-13 |
| VOT-12 | Edit, extend or cancel a vote | P1 | VOT-01, VOT-03, VOT-10, VOT-13, NTF-01 |
| VOT-13 | Record every closed vote in the decision log, linked to the money it moved | P0 | VOT-03, VOT-08, VOT-09, VOT-12, SPD-09, SPD-13, SPD-16, WAL-14, OPS-14, PRJ-05, PRJ-09 |
| VOT-14 | Record a decision that was taken outside the app | P1 | VOT-13, PRJ-07, GRP-08, XCT-05 |
| VOT-15 | Correct or replace a decision without erasing the original | P1 | VOT-13, VOT-14, XCT-05 |
| VOT-16 | Find past decisions in the decision log | P0 | VOT-13, VOT-14, VOT-15, XCT-04, PRJ-05 |
| VOT-17 | Choose whether ballots are named or anonymous | P1 | VOT-01, VOT-03, VOT-04, VOT-05, VOT-13, GRP-13 |
| VOT-18 | Vote when the connection is poor and see the ballot's state | P0 | VOT-04, XCT-03, XCT-04, XCT-05, ACC-11 |

Count: 18 stories. P0: 13 (VOT-01 to VOT-10, VOT-13, VOT-16, VOT-18). P1: 5 (VOT-11, VOT-12, VOT-14, VOT-15, VOT-17). P2: 0.

## Cross-epic dependencies

- ACC: ACC-02 phone and OTP and its parameters, reused for guests (VOT-06); ACC-16 opens the vote link; ACC-06 language preference (VOT-07); ACC-11 device ID (VOT-18).
- GRP: GRP-03 invite by phone (guest eligibility, VOT-06); GRP-08 grant Vote permissions; GRP-12 and GRP-14, SPD-15, RUL-13 and CON-13 use a vote as the authority for a change and carry a proposal reference (VOT-01 criterion 10); GRP-13 stores the vote and its voters on the payout entry; GRP-16 and GRP-17 fix what happens to the ballot of someone who leaves (VOT-02 criterion 7).
- SPD: SPD-09 creates the linked vote and owns the request statuses and the Rejected wording (VOT-03); SPD-10 safety checks after a passed vote; SPD-07 and SPD-12 trigger vote cancellation; SPD-13 links decisions; SPD-16 shows the vote on the request trail.
- WAL: WAL-14 ledger entry reference that links back to the decision (VOT-13); WAL-16 export component for a future decision-log export.
- RUL and CON: RUL-13 and CON-13 gate rule and plan changes with a plain vote that carries a proposal reference; VOT never changes a rule by itself.
- NTF: every `msg.vot.*` event (EV-VOT-01 to EV-VOT-10 plus the new events listed under Message key convention), NTF-05 push-then-SMS, NTF-06 SMS payer and allowance, NTF-09 quiet hours and reminder rule, NTF-11 guests, XCT-12 SMS lint.
- XCT: XCT-04 cache and last synced, XCT-05 offline queue and its Table A registry (manual decision entries and amendments are auto-send items), XCT-03 deadline wording, XCT-07 and XCT-11 low data, XCT-09 status without colour.
- OPS: OPS-14 is the backstop for a failed close job and a failed decision-log write, and checks that every closed vote has a decision entry (VOT-08, VOT-13).
- PRJ: PRJ-05 lists decisions on the project page; PRJ-07 attachments are used by VOT-14.

## Open questions

Closed questions are kept for the record, with the decision.

1. Closed by decision D4: a passing vote is the authorisation and replaces approvers above the vote threshold. The D4 floor is fixed, applies to every authority vote, is counted under VOT-03 criterion 3, and the requester's own yes counts toward the majority only.
2. Closed: default quorum 30 percent, default majority "more than half of yes and no", default no-quorum fallback "extend once" (see Parameters and VOT-02, VOT-10). Field interviews validate these values without blocking the build.
3. Closed: plain votes default to Anonymous (VOTE_DEFAULT_VISIBILITY); money-linked authority votes are always Named (VOT-17).
4. Closed: no answer-to-person link is kept after close on an Anonymous vote and nobody sees one (VOT-17 criterion 8).
5. Closed: interim totals are visible after you have voted (VOT-05).
6. Closed: guest session is ephemeral; the question is not visible before verification; non-members are never eligible by phone (VOT-06).
7. Later: voting by SMS reply, for example "reply 1 for yes", is recorded as Later and is not in the MVP; the reminder SMS carries the link to the light guest page (VOT-06). It would need an outside party first (the SMS aggregator for inbound SMS, plus a security review and field research on feature-phone use). Same question as the NTF and XCT open items.
8. Closed: the group pays for vote reminders from its SMS allowance and the platform pays for guest security codes (NTF-06); the monthly cap per group is an NTF parameter.
9. Closed: strictly the server's receipt time, no grace window (VOT-18).
10. Closed: manual decision entries use Vote: create and amendments use Vote: edit (VOT-14, VOT-15).
11. Closed: a member who leaves or is removed keeps their ballot and the quorum denominator stays fixed (GRP-16, GRP-17, VOT-02 criterion 7); a member who joins late can be added only before the first ballot (VOT-12).
12. Closed: no automatic close when everyone has voted (VOT-08).
13. Closed: the consent text of ACC-13 covers SMS from groups the person joined, and a guest sees a short notice on the verification page before the code is sent.
