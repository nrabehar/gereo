# VOT: screen and state inventory

Source: `docs/product/stories/VOT.md` (18 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-VOT-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-VOT-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Permission names follow conventions section 7. Money is shown as `12 500 Ar`. Guest pages have no bottom bar.

---

### VOT-01 Ask the group a question with a vote

**Story:** VOT-01 Ask the group a question with a vote

**Surfaces:**
- SCR-VOT-01 | Create vote form (single page flow, fields in the order question, context, type, options, deadline, who can vote, rule, no-quorum fallback, ballot visibility) | page | Member holding `Vote: create` on the group (or project) | Entry: "New vote" on the group page, the project page or the decision log; proposal reference (GRP-12, GRP-14, SPD-15, RUL-13, CON-13); "Link to an expense request" (VOT-03); runoff (VOT-11); resume a Draft | Exit: SCR-VOT-04 review step, leave as Draft, back to the origin
- SCR-VOT-02 | Eligible voters selector (inline in SCR-VOT-01) | inline | Creator | Entry: "who can vote" field of SCR-VOT-01 | Exit: stays on SCR-VOT-01
- SCR-VOT-03 | Deadline field with absolute and relative preview (inline in SCR-VOT-01) | inline | Creator | Entry: deadline field | Exit: stays on SCR-VOT-01
- SCR-VOT-04 | Vote review step ("the whole vote as voters will see it", button `Open the vote`) | page (flow step) | Creator | Entry: continue from SCR-VOT-01 | Exit: SCR-VOT-07 of the new vote, back to SCR-VOT-01
- SCR-VOT-05 | Vote list of the group or project (rows with status chip, reference ID) | page (inline section on the group or project page) | Member with `Vote: view` (Drafts only to their creator) | Entry: group page, project page, notification deep link | Exit: SCR-VOT-07, SCR-VOT-01
- SCR-VOT-06 | Local draft marker `Draft, not sent` (inline row state in SCR-VOT-05 and top of SCR-VOT-01) | inline | Creator, on the phone that holds the draft | Entry: SCR-VOT-05, SCR-VOT-01 | Exit: SCR-VOT-01
- SCR-VOT-07 | Vote page (question, status, rule, ballot, tallies, result; the vote's own page with a stable reference ID and URL) | page | Member on the frozen eligible list with `Vote: view`; guests use SCR-VOT-28 | Entry: SCR-VOT-05, notification deep link, vote link, decision entry, expense request | Exit: SCR-VOT-05, group or project page
- SCR-VOT-08 | Proposal reference block ("Why this vote", proposal type and ID, read-only) (inline on SCR-VOT-01, SCR-VOT-04, SCR-VOT-07) | inline | Creator, then every viewer of the vote | Entry: form opened from another epic's proposal | Exit: link to the proposal
- SCR-VOT-09 | Notification: vote opened (`msg.vot.opened`, EV-VOT-01; in-app and push, SMS variant after the NTF-05 wait) | notification | Eligible members; guests by SMS link (NTF-11) | Entry: system on open (and on reopen, runoff, member added before first ballot) | Exit: deep link to SCR-VOT-07 (SCR-VOT-28 for guests)

**States per surface:**
- SCR-VOT-01 default: creator opens the form; sees empty fields in the stated order, yes/no/abstain showing its three fixed options, rule prefilled from defaults; can fill, save as Draft, continue.
- SCR-VOT-01 single choice: type single choice; sees an option list needing 2 to `VOTE_MAX_OPTIONS` short-sentence options, no duplicates; can add and remove options.
- SCR-VOT-01 validation error (deadline): deadline outside `VOTE_MIN_DURATION` and `VOTE_MAX_DURATION`; sees `vot.error.deadline_range`; can change the deadline; fields kept.
- SCR-VOT-01 validation error (options): fewer than 2 options, more than `VOTE_MAX_OPTIONS`, or a duplicate; sees an inline message (key not specified in the story); can correct.
- SCR-VOT-01 loading (saving): creator taps Open; button shows a loading state and cannot be tapped twice (no duplicate vote).
- SCR-VOT-01 failure: save fails; every field kept; sees `vot.error.save_failed` with Retry; can retry.
- SCR-VOT-01 offline: connection drops before opening; vote kept as a local draft `Draft, not sent` (XCT-05 Table B, never sent without a tap); sees `xct.offline.needs_connection` on Open; can open again when back online.
- SCR-VOT-01 draft resumed: creator returns to a Draft; sees saved fields; draft has no ballots and sends no notification.
- SCR-VOT-01 proposal prefill: opened from GRP-12, GRP-14, SPD-15, RUL-13 or CON-13; question prefilled, type fixed to yes/no/abstain, authority vote, SCR-VOT-08 shown; can open the vote; editing the question drops the prefill and any `snapshot_ref`.
- SCR-VOT-01 gate prefill: CON decision gate passes `question_text` (read-only) and `snapshot_ref` (immutable once started); sees `Why this vote` line; if the question is edited the prefill is dropped and the vote can no longer be applied.
- SCR-VOT-01 long text: long question, context or option text; sees text wrapped at 200% font size and 320 px width, no clipping (AC 9).
- SCR-VOT-01 permission hidden: person without `Vote: create`; "New vote" is not offered (server enforces). No denied state is specified in the story.
- SCR-VOT-02 default: Active members holding `Vote: vote` plus Invited-by-phone members with the Member bundle preselected; creator can pick a subset on a plain vote.
- SCR-VOT-02 greyed member: member without `Vote: vote`; sees the row greyed with `vot.eligible.no_permission`; cannot select.
- SCR-VOT-02 authority locked: authority vote; sees every holder of `Vote: vote` of the wallet's group, no subset choice.
- SCR-VOT-02 frozen: vote opened; list frozen; non-members never listed.
- SCR-VOT-02 edited before first ballot: list changes; summary recalculated, creator sees `vot.rule.recalculated` (SCR-VOT-10).
- SCR-VOT-02 empty: group has no eligible voter; not specified in the story (precondition says at least one).
- SCR-VOT-03 default: creator picks a date and time; sees `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)` below the field.
- SCR-VOT-03 error: outside min or max duration; `vot.error.deadline_range`.
- SCR-VOT-03 snapped: money vote or authority vote with a deadline inside quiet hours; deadline refused and snapped to the next slot inside 07:00 to 21:00; creator sees the new value.
- SCR-VOT-03 quiet-hours warning: any vote; creator sees the NTF-09 criterion 3 warning about the chosen deadline (key not named in this story).
- SCR-VOT-04 default: sees the whole vote as voters will, including the rule in plain words; button `Open the vote` (action label, not "Next").
- SCR-VOT-04 loading: tap Open; loading state, no double tap.
- SCR-VOT-04 success: vote gets status Open and a reference ID, appears in SCR-VOT-05; creator lands on SCR-VOT-07.
- SCR-VOT-04 failure and offline: as SCR-VOT-01 failure and offline.
- SCR-VOT-05 default: list of votes with status chip (icon, word, colour) and reference.
- SCR-VOT-05 empty: not specified for open votes in the story (VOT-16 has `vot.decision.list_empty` for the log only).
- SCR-VOT-05 draft row: creator only; `Draft` status; resume.
- SCR-VOT-05 offline: not specified in the story for the vote list.
- SCR-VOT-05 forbidden: person without `Vote: view`; not specified in the story.
- SCR-VOT-06 shown: local draft exists on this phone; marked `Draft, not sent`; can resume and tap Open when online.
- SCR-VOT-07 Open (member): see VOT-04, VOT-05; shows rule, reference ID, proposal reference.
- SCR-VOT-07 Draft: creator only; no ballots.
- SCR-VOT-07 proposal reference: SCR-VOT-08 shown; passed vote does not execute the proposal; holder applies it and cites the decision ID.
- SCR-VOT-08 default: proposal type and ID shown, read-only; link back to the proposal.
- SCR-VOT-08 gate: `Why this vote` line when `snapshot_ref` is present.
- SCR-VOT-09 in-app and push: vote opened; member taps, lands on SCR-VOT-07; `msg.vot.opened`.
- SCR-VOT-09 SMS fallback: member without the app or who did not open it; SMS variant after the NTF-05 wait; guest link via NTF-11.
- SCR-VOT-09 reopen, runoff, late-added member: same key reused (VOT-10, VOT-11, VOT-12).

**Criteria map:**
- AC 1: SCR-VOT-01 default and single choice (field order, 3 fixed options, 2 to `VOTE_MAX_OPTIONS` options, no duplicates).
- AC 2: SCR-VOT-03 default, error, snapped, quiet-hours warning (`vot.error.deadline_range`, absolute and relative text, snap to 07:00 to 21:00).
- AC 3: SCR-VOT-02 default, greyed member, authority locked, frozen (`vot.eligible.no_permission`, list frozen on open, non-member never eligible).
- AC 4: SCR-VOT-04 default (review step, `Open the vote`).
- AC 5: SCR-VOT-04 success and SCR-VOT-09 (status Open, reference ID, `msg.vot.opened`, SMS variant after wait).
- AC 6: SCR-VOT-01 loading, failure, offline and SCR-VOT-06 (`vot.error.save_failed`, `Draft, not sent`, `xct.offline.needs_connection`).
- AC 7: SCR-VOT-01 draft resumed, SCR-VOT-05 draft row (draft private to creator, no ballots, no notification).
- AC 8: no UI, system rule (audit entry: creator, time, eligible list size, rule, who opened).
- AC 9: SCR-VOT-01 long text (visible labels, 48 by 48 dp targets, 200% font, 320 px, viewer-language fixed labels).
- AC 10: SCR-VOT-01 proposal prefill and gate prefill, SCR-VOT-08 (authority vote, read-only reference, `Why this vote`, `question_text`, `snapshot_ref`).

**Objects and fields:** Vote (question, context, type, options, deadline, eligible list, rule, no-quorum fallback, visibility, status, reference ID, proposal type and ID, `snapshot_ref`); Group or Project; Membership (bundle, Invited by phone); Audit entry; Notification.

**Open points:**
- Which key shows an option-validation error (fewer than 2, duplicate)? Not specified in the story.
- Which key carries the NTF-09 criterion 3 deadline warning and where is it shown? Not specified in the story.
- No story defines the vote list surface (SCR-VOT-05): its empty, offline and forbidden states and its filters are not specified.
- What does a member without `Vote: create` see on the group page, hidden entry or a reason? Not specified in the story (conventions section 7 and 09 section 6.3 rule 3 or 4).
- VOT-01 AC 3 says invited-by-phone members "vote as guests", while the Eligible voters line of Kinds of vote says an authority vote uses every holder of `Vote: vote`. Can an Invited-by-phone person be a holder of `Vote: vote` for an authority vote? Not specified in the story.

---

### VOT-02 Set the quorum and the majority, and read them in plain words

**Story:** VOT-02 Set the quorum and the majority, and read them in plain words

**Surfaces:**
- SCR-VOT-10 | Rule section of the create form (quorum percent, "no minimum" option, majority choices) | inline (section of SCR-VOT-01) | Creator with `Vote: create` | Entry: "Rule" section of SCR-VOT-01 | Exit: stays on SCR-VOT-01
- SCR-VOT-11 | Rule summary in plain words (key `vot.rule.summary.simple`; same text on review step, vote page, decision log) | inline | Creator, every voter, every log reader | Entry: SCR-VOT-10, SCR-VOT-04, SCR-VOT-07, SCR-VOT-55 | Exit: none

**States per surface:**
- SCR-VOT-10 default: quorum prefilled from `VOTE_DEFAULT_QUORUM_PERCENT`, majority from `VOTE_DEFAULT_MAJORITY`; creator can edit both.
- SCR-VOT-10 yes/no/abstain majority: choices "more than half of the yes and no votes" or "at least a percent set by the creator" (above half, up to all).
- SCR-VOT-10 single choice majority: "the option with the most votes wins" (plurality); equal top options are a Tie (VOT-11).
- SCR-VOT-10 plain vote no minimum: creator selects "no minimum"; sees warning `vot.rule.no_quorum_warning`.
- SCR-VOT-10 authority vote: "no minimum" option not offered; floor shown in plain words (`vot.rule.authority_floor`) as a count even when the quorum percent works out lower.
- SCR-VOT-10 refused request: older app sends "no minimum" on an authority vote; rejected with `vot.error.no_quorum_refused` ("A vote that decides money or a rule needs a minimum number of voters").
- SCR-VOT-10 invalid input: quorum above 100% or negative, majority threshold not above half, non-numeric; clear message (key not specified); the form never saves a rule the summary cannot express.
- SCR-VOT-10 locked: first ballot cast; rule read-only; group defaults changed later never alter an open vote.
- SCR-VOT-10 recalculated: eligible list changed before first ballot; creator sees `vot.rule.recalculated`.
- SCR-VOT-11 default: built from the settings and the current eligible count; updates live while editing; shows who must vote, how many agree, what abstain does.
- SCR-VOT-11 quorum as count: shown as a count rounded up to a whole person, for example "8 of 15", never only a percent.
- SCR-VOT-11 includes fallback: `vot.rule.summary` includes the no-quorum setting (VOT-10).
- SCR-VOT-11 fixed after first ballot: eligible list and denominator stay fixed even when a member leaves or is removed.
- SCR-VOT-11 long text: plain text, readable by screen readers, never in an image, fits at 200% font size.

**Criteria map:**
- AC 1: SCR-VOT-10 default, plain vote no minimum, authority vote, refused request (`vot.rule.no_quorum_warning`, `vot.error.no_quorum_refused`, `vot.rule.authority_floor`).
- AC 2: SCR-VOT-10 yes/no/abstain majority and single choice majority (abstain counts to quorum only; requester's own yes counts to majority, never to the D4 floor).
- AC 3: SCR-VOT-11 default (live summary, identical on review, vote page, decision log).
- AC 4: SCR-VOT-11 quorum as count.
- AC 5: SCR-VOT-10 invalid input.
- AC 6: SCR-VOT-10 locked.
- AC 7: SCR-VOT-10 recalculated, SCR-VOT-11 fixed after first ballot.
- AC 8: no UI, system rule (rule values and summary text stored and written to the audit entry at opening).
- AC 9: SCR-VOT-11 long text (plain text, space-grouped numbers, "quorum" with the gloss "minimum number of voters").
- AC 10: no UI, system rule (floor counts distinct account IDs still active at close, tally and denominator fixed, departed ballot stays counted); its outcome appears in SCR-VOT-42 (reason `Not enough voters`).

**Objects and fields:** Vote (quorum percent or no minimum, majority rule, threshold, eligible count, summary text); Group settings (defaults); Audit entry.

**Open points:**
- VOT-02 AC 10 and VOT-09 use the reason `Not enough voters` with result Not passed (quorum not met), while conventions 11.3 and decision R191 item 2 name the result "Not passed (floor not met)". Which wording is final?
- Key for the invalid-input messages in AC 5: not specified in the story.
- The minimum voter tenure (default 72 hours of membership and a verified phone, decision R183, "owned by VOT") appears in no VOT story. Which story owns it and how does it show on a vote page?
- VOT-02 AC 6 says the rule is locked at the first ballot while VOT-10 AC 5 and VOT-17 AC 2 lock their own settings at the first ballot; is "locked" one shared state, with one message key? `vot.edit.locked` is named only in VOT-12.

---

### VOT-03 Start the payment of an expense when its vote passes

**Story:** VOT-03 Start the payment of an expense when its vote passes

**Surfaces:**
- SCR-VOT-12 | "Link to an expense request" picker (list of the person's linkable requests) | sheet | Member who can see the request; requester has `Wallet: initiate spend`; manual start also needs `Vote: create` | Entry: SCR-VOT-01 option "Link to an expense request"; "Ask the group to vote first" on the expense request (SPD page) | Exit: SCR-VOT-01 in linked mode
- SCR-VOT-13 | Linked expense summary on the vote page (exact amount, payee, source wallet, purpose, attachment, taken live from the request) | inline (on SCR-VOT-01, SCR-VOT-04, SCR-VOT-07) | Creator and members who may see the request; never a wallet balance to guests | Entry: SCR-VOT-07 of a linked vote | Exit: link to the expense request (SPD)
- SCR-VOT-14 | Vote status and result on the expense request (SPD page, VOT adds the vote states) | inline (on the SPD request page) | Requester, approvers, member voters, `Wallet: approve spend` holders | Entry: request page | Exit: SCR-VOT-07
- SCR-VOT-15 | Notification: expense vote passed (`msg.vot.expense_passed`, EV-VOT-11, shown by SPD-09) | notification | Requester | Entry: system at close Passed (held to the end of quiet hours together with the payout) | Exit: request page
- SCR-VOT-16 | Notification: expense vote failed (`msg.vot.expense_failed`, EV-VOT-12, with quorum reason variant, shown by SPD-09) | notification | Requester | Entry: system at close Not passed | Exit: request page
- SCR-VOT-17 | Notification: vote cancelled (`msg.vot.cancelled`, with reason) | notification | All eligible voters | Entry: system or person cancels | Exit: SCR-VOT-07
- SCR-VOT-18 | System: start of payout after Passed (SPD-10 checks: balance, freeze, spending cap, request unchanged) | system | none | Entry: atomic close with decision write | Exit: payout, or `payout_blocked` on the request
- SCR-VOT-19 | System: automatic cancellation on request change or withdrawal, and replacement vote | system | none | Entry: SPD-07 edit, SPD-12 cancel | Exit: SCR-VOT-17 and a new SCR-VOT-07
- SCR-VOT-20 | Extend deadline sheet (new deadline, reason; used by the requester within 48 hours and by VOT-10, VOT-12) | sheet | Requester of a Needs attention request; holders per VOT-12 | Entry: request page or vote page | Exit: SCR-VOT-07

**States per surface:**
- SCR-VOT-12 default: list of the person's requests in Draft, Awaiting approval, Needs changes or Awaiting vote with no open vote.
- SCR-VOT-12 refused already open: `vot.link.already_open` with a link to the open vote.
- SCR-VOT-12 refused too few voters: fewer than two eligible voters other than the requester; `vot.link.too_few_voters`; the approval band applies; next step shown (grant `Vote: vote` to a second person, GRP-08).
- SCR-VOT-12 empty: no linkable request; not specified in the story.
- SCR-VOT-12 awaiting approval: starting a vote on an Awaiting approval request moves it to Awaiting vote and sets its approvals aside; shown as a warning (text not specified).
- SCR-VOT-12 hidden request: person who cannot see the request cannot link it.
- SCR-VOT-13 default: exact amount, payee, source wallet, purpose, attachment; amount `12 500 Ar` no wrap at 200% font size.
- SCR-VOT-13 guest: no wallet balance shown.
- SCR-VOT-13 request changed: amount, payee, wallet or purpose changed while open; vote cancelled (SCR-VOT-19).
- SCR-VOT-13 button: `Open the vote` plus the amount, never a bare "Confirm".
- SCR-VOT-14 Awaiting vote: vote open; sees status and link to the vote.
- SCR-VOT-14 passed: payout starts without approvers through SPD-10 checks; vote result shown on the request.
- SCR-VOT-14 not passed (majority not reached): request Rejected; mapped by SPD to "The group did not approve".
- SCR-VOT-14 not passed (quorum not met): request Needs attention for 48 hours; mapped by SPD to "Quorum not reached"; requester can extend once (SCR-VOT-20).
- SCR-VOT-14 not extended in 48 hours: request becomes Rejected.
- SCR-VOT-14 cancelled: follows SPD-09 and SPD-12; can be proposed again as a new request.
- SCR-VOT-14 payout blocked: `payout_blocked` after an SPD-10 check; request shows the reason and next step; vote not run again; linked follow-up entry in the log.
- SCR-VOT-15 default: requester receives `msg.vot.expense_passed`; inside quiet hours, held until quiet hours end, released with the payout.
- SCR-VOT-16 majority: `msg.vot.expense_failed`.
- SCR-VOT-16 quorum: same key with the quorum reason (including `Not enough voters`).
- SCR-VOT-17 request changed: reason `vot.cancel.request_changed`; earlier ballots do not carry over.
- SCR-VOT-17 request withdrawn: reason `vot.cancel.request_withdrawn`.
- SCR-VOT-18 held in quiet hours: payout never dispatched during quiet hours; released with the result notice.
- SCR-VOT-18 blocked: balance, freeze, cap or request changed; `payout_blocked` (SPD-10, SPD-11).
- SCR-VOT-19 replacement: policy requires a vote; new vote with a new deadline and a link to the cancelled one (SPD-09 criterion 5); otherwise requester may start a new vote.
- SCR-VOT-19 early close absent: a linked vote cannot be closed early; only extended or cancelled.
- SCR-VOT-20 default: new deadline and reason; counted in `VOTE_MAX_EXTENSIONS`; reopens with the same reference.
- SCR-VOT-20 inside quiet hours: snapped as in VOT-01 AC 2.
- SCR-VOT-20 offline: blocked with `xct.offline.needs_connection` (VOT-12 AC 8).

**Criteria map:**
- AC 1: SCR-VOT-13 default and SCR-VOT-01 linked mode (type fixed, every holder of `Vote: vote`, Named ballots, live request data, no balance to guests).
- AC 2: SCR-VOT-12 refused already open and refused too few voters (`vot.link.already_open`, `vot.link.too_few_voters`).
- AC 3: SCR-VOT-14 passed and quorum not met, SCR-VOT-15, SCR-VOT-18 (D4 floor at close, ballots received by the server, Passed starts payout via SPD-10, `msg.vot.expense_passed`, quiet-hours hold, `payout_blocked`, no ledger write by the vote, atomic close).
- AC 4: SCR-VOT-14 not passed states, SCR-VOT-16, SCR-VOT-20 (`msg.vot.expense_failed`, 48-hour Needs attention, one extension).
- AC 5: SCR-VOT-19 replacement, SCR-VOT-17 (`msg.vot.cancelled`, `vot.cancel.request_changed`).
- AC 6: SCR-VOT-17 request withdrawn, SCR-VOT-19 early close absent (`vot.cancel.request_withdrawn`).
- AC 7: SCR-VOT-55 states "Money moved" (decision entry shows the request, then "Money moved" with the ledger link).
- AC 8: no UI, system rule (audit of link, cancellation reason, request transition); SCR-VOT-12 hidden request (a person who cannot see the request cannot link it).
- AC 9: SCR-VOT-13 default and button (`12 500 Ar` no wrap at 200%, `Open the vote` plus the amount).

**Objects and fields:** Vote (linked request, Named ballots, authority flag); Expense request (amount, payee, source wallet, purpose, attachment, status); Decision; Ledger entry (read by link); Audit entry.

**Open points:**
- VOT-03 Preconditions and VOT-08 AC 4 cite "conventions 10.7" for the small-group fallback, but conventions 10.7 is Caps; the fallback is in conventions 10.3. Correct citation?
- VOT-03 AC 3 and VOT-06 AC 4 say guests never count toward the D4 floor; decision R189 says a guest ballot tied to a verified number on the frozen eligible list counts toward the SPD-09 floor on the vote path, and R186 says R189 applies. Which rule do the vote page and `vot.guest.floor_notice` follow?
- Result reason for a floor failure: story says Not passed (quorum not met) with reason `Not enough voters`; R191 says "Not passed (floor not met)". See VOT-02 open points.
- Which permission lets the requester extend after quorum failure (SCR-VOT-20)? VOT-12 gives extension to `Vote: edit` holders; the requester may hold neither `Vote: edit` nor `Vote: create`.
- VOT-03 AC 4 says the requester may extend "once"; `VOTE_MAX_EXTENSIONS` is 2 and shared with VOT-10 and VOT-12. Is the requester's once-only extension inside that count, and can the requester extend if earlier extensions used the count? Not specified in the story.
- Key and text for the warning that approvals set aside are not reused when a vote starts on an Awaiting approval request: not specified in the story.
- Decision R189 holds a vote-authorised payout for operator review (OPS-10, release-only) for a new payee with weak ballots; no VOT story names the request or vote state the voters see. Not specified in the story.

---

### VOT-04 Cast my vote and change it until the vote closes

**Story:** VOT-04 Cast my vote and change it until the vote closes

**Surfaces:**
- SCR-VOT-21 | Ballot (question, options as radio buttons with full sentences, `vot.ballot.can_change`, button `Send my vote`) | inline (section of SCR-VOT-07) | Member on the frozen eligible list holding `Vote: vote` | Entry: SCR-VOT-07 from notification, vote list or link | Exit: SCR-VOT-22
- SCR-VOT-22 | Ballot confirmation (own answer, word `Received`, button `Change my vote`, own ballot history while open) | inline (section of SCR-VOT-07) | The voter | Entry: after sending | Exit: SCR-VOT-21 in change mode
- SCR-VOT-23 | Cannot vote block (`vot.error.not_eligible`, `vot.error.no_permission`, `vot.ballot.closed`) | inline (replaces SCR-VOT-21) | Person not eligible, without `Vote: vote`, or after close | Entry: SCR-VOT-07 | Exit: none, names who to ask

**States per surface:**
- SCR-VOT-21 default: vote Open; sees the question, options, `vot.ballot.can_change` ("You can change your answer until {deadline}"); can pick an option and tap `Send my vote` (at most two taps).
- SCR-VOT-21 sending: `Sending`; button disabled.
- SCR-VOT-21 failure: ballot kept; `vot.error.send_failed` with Retry; person never left unsure whether it counted.
- SCR-VOT-21 second device or repeated tap: no second ballot; the one current ballot shown.
- SCR-VOT-21 offline: ballot stored locally (see SCR-VOT-69, VOT-18).
- SCR-VOT-21 long text: options with full sentences wrap at 200% font size, 48 by 48 dp radio targets, selected state by icon and text, screen-reader usable.
- SCR-VOT-22 default: shows the answer and `Received`; button changes to `Change my vote`; changing replaces the earlier ballot and keeps history in the audit log.
- SCR-VOT-22 counted: `Counted` appears only in results and only for a ballot that counts toward quorum (D4); not shown here.
- SCR-VOT-22 own history: voter sees their own ballot history while open.
- SCR-VOT-23 closed: vote closed; ballot replaced by the result and `vot.ballot.closed`; late request rejected, nothing counted.
- SCR-VOT-23 not eligible: `vot.error.not_eligible` and who to ask.
- SCR-VOT-23 no permission: on the list without `Vote: vote`; `vot.error.no_permission` naming the missing permission and who can grant it.

**Criteria map:**
- AC 1: SCR-VOT-21 default (`vot.ballot.can_change`, two taps).
- AC 2: SCR-VOT-22 default and counted (`Received`, `Change my vote`, `Counted` only in results, history in audit).
- AC 3: SCR-VOT-21 second device or repeated tap (one current ballot per person per vote).
- AC 4: SCR-VOT-23 closed (`vot.ballot.closed`, late request rejected).
- AC 5: SCR-VOT-23 not eligible and no permission (`vot.error.not_eligible`, `vot.error.no_permission`).
- AC 6: SCR-VOT-21 sending and failure (`Sending`, `vot.error.send_failed`, Retry).
- AC 7: no UI, system rule (no notification to others, no push to the voter for their own vote).
- AC 8: no UI, system rule (Named: every ballot and change stored with voter, time, device, previous value; Anonymous: stores that a ballot happened); own history in SCR-VOT-22.
- AC 9: SCR-VOT-21 long text (radio buttons, 48 by 48 dp, icon plus text, screen reader).

**Objects and fields:** Ballot (voter, answer, time, device, previous value, state); Vote (status, deadline, eligible list); Membership; Audit entry.

**Open points:**
- Does casting a ballot require `Vote: view` as well as `Vote: vote` (VOT-05 names `Vote: view` as its permission)? Not specified in the story.
- "Who to ask" in `vot.error.not_eligible`: which person or role is named for a person not on the frozen list? Not specified in the story.
- Anonymous mode: what does the voter's own history show for answers "as the rules of VOT-17 allow"? Not specified in the story.

---

### VOT-05 See where the vote stands: deadline, rule, quorum and participation

**Story:** VOT-05 See where the vote stands: deadline, rule, quorum and participation

**Surfaces:**
- SCR-VOT-24 | Vote header (question, status chip with word and icon, deadline `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`, rule in plain words, `Last synced`, refresh indicator) | inline (top of SCR-VOT-07) | Member with `Vote: view` | Entry: SCR-VOT-07 | Exit: none
- SCR-VOT-25 | Quorum meter (bar, threshold marker, `vot.quorum.progress`, `vot.quorum.met`, text equivalent) | inline (on SCR-VOT-07) | Member with `Vote: view` | Entry: SCR-VOT-07 | Exit: none
- SCR-VOT-26 | Option tallies (totals) | inline (on SCR-VOT-07) | Voter after casting; everyone with access after close | Entry: SCR-VOT-07 | Exit: none
- SCR-VOT-27 | Vote not visible state (`vot.error.not_visible`) | page (state of SCR-VOT-07) | Person without access | Entry: link or notification | Exit: who can grant access

**States per surface:**
- SCR-VOT-24 Open: shows status chip, absolute and relative deadline (days and hours; minutes only in the last hour, never every second), rule from SCR-VOT-11.
- SCR-VOT-24 closed: chip shows one of Passed, Not passed (majority not reached), Not passed (quorum not met), Tie; Cancelled vote shows status Cancelled and no result.
- SCR-VOT-24 loading: skeleton of the final layout; refreshing shows `Updating...`, never a full-page loader.
- SCR-VOT-24 refresh: every `VOTE_REFRESH_SECONDS` while the page is open, on pull-to-refresh and on return to the page.
- SCR-VOT-24 offline or slow: loads from cache with `Last synced`; quorum numbers marked as possibly out of date; casting stays available under VOT-18.
- SCR-VOT-24 Closing and Needs attention: shown as statuses (VOT-08).
- SCR-VOT-25 not met: bar with marker at the threshold; `vot.quorum.progress` ("8 of 15 needed. 5 have voted"; percent per XCT-02).
- SCR-VOT-25 met: check and `vot.quorum.met`.
- SCR-VOT-25 after close: explains why the vote did not count (quorum not met versus rejected).
- SCR-VOT-25 accessibility: never colour alone, text equivalent announced by screen readers, reflows at 320 px.
- SCR-VOT-26 before voting: participation only, no tallies.
- SCR-VOT-26 after casting or after close: totals, names only if Named (VOT-17).
- SCR-VOT-27 default: `vot.error.not_visible` with who can grant access, never a bare "Not allowed".

**Criteria map:**
- AC 1: SCR-VOT-24 Open and closed (question, chip, deadline, rule).
- AC 2: SCR-VOT-25 not met, met, after close (`vot.quorum.progress`, `vot.quorum.met`).
- AC 3: SCR-VOT-24 Open (relative time granularity).
- AC 4: SCR-VOT-24 loading and refresh (`Updating...`, `VOTE_REFRESH_SECONDS`).
- AC 5: SCR-VOT-26 before voting and after casting.
- AC 6: SCR-VOT-24 offline or slow (cache, `Last synced`, possibly out of date).
- AC 7: SCR-VOT-24 loading (skeleton) and SCR-VOT-27 default (`vot.error.not_visible`).
- AC 8: no UI, system rule (no read is logged).
- AC 9: SCR-VOT-25 accessibility (not by colour alone, text equivalent, 320 px).

**Objects and fields:** Vote (status, deadline, rule summary, quorum threshold, eligible count); Ballot (counts only); Membership.

**Open points:**
- Is the participation count shown to a person who has `Vote: view` but is not on the eligible list (for example a project-team member outside the electorate)? Not specified in the story.
- Key for the quorum text after close ("why a vote did not count"): not specified beyond the `vot.outcome.*` keys of VOT-09.
- Is the result visible to a person on the eligible list after the vote is Cancelled, and what does the page show? Not specified in the story.

---

### VOT-06 Share a vote link so someone can vote without a full account

**Story:** VOT-06 Share a vote link so someone can vote without a full account

**Surfaces:**
- SCR-VOT-28 | Guest vote page (light page, language switch, no bottom bar; before verification shows group name, who asked and closing time; after verification question, context, options, deadline, rule, quorum progress, ballot, result after close) | page (guest) | Guest voter whose verified number is on the frozen eligible list | Entry: vote share link (reusable, unguessable token), per-person single-use SMS link (NTF-11), WhatsApp, browser | Exit: SCR-VOT-31, close the page
- SCR-VOT-29 | Guest verification (phone number entry, one-time code, `vot.guest.otp_wrong`, resend) | page (guest flow step) | Guest | Entry: first open of the link on a device | Exit: SCR-VOT-28 verified
- SCR-VOT-30 | Share sheet (phone share sheet with ready message `vot.share.message`, "Copy link") | sheet | Member with `Vote: view` | Entry: "Share" on SCR-VOT-07 | Exit: back to SCR-VOT-07
- SCR-VOT-31 | Optional "Create an account" offer (after voting) | inline (on SCR-VOT-28) | Guest | Entry: after the ballot is confirmed | Exit: account creation (ACC)

**States per surface:**
- SCR-VOT-28 before verification: only group name, who asked and closing time; question and options hidden so a forwarded link leaks nothing.
- SCR-VOT-28 verified open: sees question, context, options, deadline, rule, quorum progress; can vote and change the vote until close.
- SCR-VOT-28 expense-linked: sees purpose, amount, payee and source wallet name, never a balance.
- SCR-VOT-28 voted: ballot confirmed on screen; sees the answer; nothing counts until confirmed on screen.
- SCR-VOT-28 offline: guest cannot queue; sees `xct.offline.needs_connection` (VOT-18).
- SCR-VOT-28 closed or link expired: sees `vot.guest.closed` plus the result when public to eligible voters; designed page, not an error.
- SCR-VOT-28 not on the list: number not eligible; `vot.guest.not_on_list` with the creator's name to ask.
- SCR-VOT-28 floor notice: ballot screen shows `vot.guest.floor_notice` (guest ballot counts toward majority and quorum, never toward the authority floor).
- SCR-VOT-28 loading: route weight within the budget of design-foundations section 4; language switch visible (Malagasy, French, English).
- SCR-VOT-28 not found: unknown or revoked token; not specified in the story beyond the expired state.
- SCR-VOT-28 second device or re-verify: shows the existing ballot, never a second one.
- SCR-VOT-29 default: phone and one-time code; ACC-02 rules (single input, autofill and paste allowed, `OTP_EXPIRY_MINUTES`, `OTP_MAX_WRONG_ATTEMPTS`, `OTP_RESEND_COUNTDOWN_SECONDS`).
- SCR-VOT-29 wrong or expired code: `vot.guest.otp_wrong` with Resend.
- SCR-VOT-29 too many attempts: lock message and when to retry (text and key not specified).
- SCR-VOT-29 remembered: verified number remembered on the same device for the vote's lifetime; no second OTP; first open always requires an OTP.
- SCR-VOT-29 rate limited: per number and per token (behaviour shown not specified).
- SCR-VOT-30 default: ready message with question, deadline, link; "Copy link".
- SCR-VOT-30 after close: link stops accepting ballots; sharing still possible, behaviour not specified.
- SCR-VOT-31 default: optional "Create an account", never required; later registration with the same number attaches earlier ballots.

**Criteria map:**
- AC 1: SCR-VOT-30 default (`vot.share.message`, "Copy link"; link reusable, unguessable token, not a credential, stops at close).
- AC 2: SCR-VOT-28 before verification.
- AC 3: SCR-VOT-29 default and remembered (OTP rules, no PIN or profile, code SMS paid by the platform).
- AC 4: SCR-VOT-28 not on the list, floor notice, second device (`vot.guest.not_on_list`, `vot.guest.floor_notice`, one number one ballot).
- AC 5: SCR-VOT-28 verified open and expense-linked.
- AC 6: SCR-VOT-28 verified open and SCR-VOT-31 (guest cannot see ledger, balances, member list, other votes, decision log, other projects, vote creation, comments; ephemeral session; optional account).
- AC 7: SCR-VOT-28 loading and closed (light page, language switch, `vot.guest.closed`).
- AC 8: SCR-VOT-29 wrong or expired code and too many attempts (`vot.guest.otp_wrong`, lock message).
- AC 9: no UI, system rule (audit of masked number, time, device, share token; rate limiting per number and per token).

**Objects and fields:** Vote; Ballot (tied to a verified phone number); Phone verification; Membership (Invited, not registered); Audit entry (masked number, time, device, token).

**Open points:**
- VOT-06 AC 4 and `vot.guest.floor_notice` say a guest never counts toward the floor; decision R189 says a guest ballot tied to a verified number on the frozen list counts toward the SPD-09 floor on the vote path. Which is binding for the notice and for the vote result?
- `vot.guest.closed` "plus the result when public to eligible voters": what makes the result "public to eligible voters" and when is it withheld? Not specified in the story.
- Lock message key and wording after too many wrong codes: not specified in the story (ACC-02 owns the parameters).
- What does the guest page show for an unknown or revoked token versus an expired one? Not specified in the story (09 section 5.3 asks for a designed expired page).
- An Active member opening the link without a session is treated as a guest; is the member then shown the member page after sign-in, with the ballot carried over? Not specified in the story.

---

### VOT-07 Remind people who have not voted: push, then SMS

**Story:** VOT-07 Remind people who have not voted: push, then SMS

**Surfaces:**
- SCR-VOT-32 | Notification: closing soon (`msg.vot.closing_soon`, EV-VOT-02; push, in-app, SMS variant with the link, vote reference at the end) | notification | Eligible persons without a ballot | Entry: system at each offset of `VOTE_REMINDER_OFFSETS` | Exit: deep link to SCR-VOT-07 or SCR-VOT-28
- SCR-VOT-33 | Notification: closing now (`msg.vot.closing_now`, EV-VOT-03; authority votes, extra late offset) | notification | Eligible persons without a ballot on an authority vote | Entry: system | Exit: deep link as above
- SCR-VOT-34 | Manual reminder sheet (shows the number of people it will reach before sending) | sheet | The vote creator or a holder of `Vote: edit` | Entry: action on SCR-VOT-07 | Exit: SCR-VOT-07
- SCR-VOT-35 | Reminder delivery count (for example `3 reminders not delivered`) | inline (on SCR-VOT-07) | Vote creator | Entry: SCR-VOT-07 | Exit: none
- SCR-VOT-36 | System: reminder scheduler (offsets, push then SMS fallback, re-check just before sending, cap, quiet hours) | system | none | Entry: Open vote with at least one eligible person without a ballot | Exit: notifications

**States per surface:**
- SCR-VOT-32 push: at each offset, to each person without a ballot.
- SCR-VOT-32 SMS fallback: push not opened within the NTF-05 window (deadline-aware) or no registered device; SMS variant of the same key; never sent to someone who already voted (NTF-05 re-check).
- SCR-VOT-32 guest: SMS with the link sent directly (NTF-11); no push; for an unregistered number only link SMS, OTP SMS and one reminder, with a per-number opt-out.
- SCR-VOT-32 content: question, closing time (absolute and relative), link; never who voted or how; within the XCT-12 160-character GSM-7 limit.
- SCR-VOT-32 quiet hours: send time inside quiet hours; sent at quiet hours end if at least `ntf.reminder_margin_minutes` remain before the deadline, otherwise at the latest slot before quiet hours begin the evening before.
- SCR-VOT-32 capped: `VOTE_REMINDER_MAX_PER_PERSON` automatic reminders reached; none sent.
- SCR-VOT-32 opted out: SMS opt-out through NTF-10; none sent by SMS.
- SCR-VOT-33 default: sent at the extra late offset on an authority vote; quiet hours still apply.
- SCR-VOT-34 default: shows the reach count; can send; one extra manual reminder at most every `VOTE_MANUAL_REMINDER_GAP`.
- SCR-VOT-34 too soon: gap not elapsed since the last manual or automatic reminder; refused (key not specified).
- SCR-VOT-34 permission hidden: person is neither creator nor `Vote: edit` holder; action not shown.
- SCR-VOT-34 no one to reach: all have voted; not specified in the story.
- SCR-VOT-35 default: count of undelivered reminders, no names beyond VOT-17.
- SCR-VOT-35 pending: delivery report not yet back; status sent, delivered or failed stored (NTF-02, NTF-13); display of pending not specified.
- SCR-VOT-36 audit: every reminder, channel, time and result stored; SMS volume counted against the group allowance (NTF-06).

**Criteria map:**
- AC 1: SCR-VOT-32 push and SCR-VOT-33 default (`msg.vot.closing_soon`, `msg.vot.closing_now`).
- AC 2: SCR-VOT-32 SMS fallback (NTF-05 window, re-check before sending).
- AC 3: SCR-VOT-32 guest (SMS with link, no push, per-number opt-out, ACC-13 consent for registered accounts).
- AC 4: SCR-VOT-32 content (no voter detail, closing time, link, GSM-7 160, vote reference).
- AC 5: SCR-VOT-32 quiet hours (NTF-09 reminder rule, never overridden by a vote).
- AC 6: SCR-VOT-32 capped and SCR-VOT-34 default and too soon (`VOTE_REMINDER_MAX_PER_PERSON`, `VOTE_MANUAL_REMINDER_GAP`, reach count).
- AC 7: SCR-VOT-35 default and pending (count of undelivered).
- AC 8: SCR-VOT-36 audit (no UI, system rule; allowance counting).
- AC 9: no UI, system rule (recipient language, per-language lint, 70-character UCS-2 switch).

**Objects and fields:** Notification (key, channel, time, delivery result); Device; Ballot (presence only); Vote (deadline, offsets); Audit entry.

**Open points:**
- Who sees SCR-VOT-35 in an Anonymous vote beyond the creator, and does a `Vote: edit` holder see it? The story says "vote creator" only.
- Is the reminder count in SCR-VOT-34 shown for a vote where eligible persons are guests with an unregistered number and a single-reminder limit? Not specified in the story.
- EV numbers: this story names EV-VOT-02 and EV-VOT-03; the Cross-epic section says the catalogue runs EV-VOT-01 to EV-VOT-10 plus new events, while Message key convention says EV-VOT-01 to EV-VOT-18. Which range is correct?
- Message key for a manual reminder: reuse `msg.vot.closing_soon` or a separate key? Not specified in the story.

---

### VOT-08 Close the vote at the deadline, or close it early

**Story:** VOT-08 Close the vote at the deadline, or close it early

**Surfaces:**
- SCR-VOT-37 | "Close now" confirmation sheet (participation, whether quorum is met, what the result would be, button `Close the vote now`, not default focus) | sheet | Holder of `Vote: close`, never on a vote linked to an expense request | Entry: "Close now" on SCR-VOT-07 | Exit: SCR-VOT-07 closed
- SCR-VOT-38 | Notification: result (`msg.vot.result`, EV-VOT-04; in-app and push) | notification | Every eligible person | Entry: system at close, Passed and Not passed (majority not reached) | Exit: SCR-VOT-07
- SCR-VOT-39 | Notification: no quorum (`msg.vot.no_quorum`, EV-VOT-05, NTF-05 SMS fallback) | notification | Every eligible person | Entry: system at close, Not passed (quorum not met) | Exit: SCR-VOT-07
- SCR-VOT-40 | Notification: tie (`msg.vot.closed_tie`) | notification | Every eligible person | Entry: system at close, Tie | Exit: SCR-VOT-07
- SCR-VOT-41 | System: close job (compute result from the stored rule, set status Closed with result, write decision entry atomically, trigger the linked action) | system | none | Entry: deadline reached within `VOTE_CLOSE_TOLERANCE` | Exit: SCR-VOT-55 entry, notifications, SCR-VOT-18

**States per surface:**
- SCR-VOT-37 default: shows participation, quorum status and projected result; can confirm with `Close the vote now` or dismiss.
- SCR-VOT-37 early with no quorum: warns first with `vot.close.early_no_quorum`; result would be Not passed (quorum not met); VOT-10 fallback does not apply.
- SCR-VOT-37 hidden: linked expense vote or no `Vote: close`; action not offered (linked votes: extend or cancel only).
- SCR-VOT-37 offline: not specified in the story.
- SCR-VOT-38 default: result sent in app and by push; a guest sees the result on the link and gets no result SMS.
- SCR-VOT-38 quiet hours: unplanned result held until they end; a passed money vote notice and payout released together.
- SCR-VOT-39 default: `msg.vot.no_quorum`, SMS fallback per NTF-05.
- SCR-VOT-40 default: `msg.vot.closed_tie`.
- SCR-VOT-41 Closing: system computing; status Closing; no new or changed ballot accepted from the deadline.
- SCR-VOT-41 closed: status Closed with exactly one result; read-only; a later ballot rejected with `vot.error.closed` (queued ballots see the VOT-18 message).
- SCR-VOT-41 Needs attention: close job or decision-log write fails; status Needs attention for the creator and holders of `Vote: close`; operator alerted (OPS-14 backstop); still accepts no ballots after the deadline.
- SCR-VOT-41 money vote below the floor: fewer than two counted voters other than the requester; result Not passed (quorum not met).

**Criteria map:**
- AC 1: SCR-VOT-41 Closing and closed (close within `VOTE_CLOSE_TOLERANCE`, no new ballots).
- AC 2: SCR-VOT-37 default and hidden (confirmation sheet, `Close the vote now`, `Vote: close` only, never on linked votes).
- AC 3: SCR-VOT-37 early with no quorum (`vot.close.early_no_quorum`; fallback only at deadline).
- AC 4: SCR-VOT-41 closed and money vote below the floor (atomic status and entry write, linked action, small-group fallback).
- AC 5: SCR-VOT-41 closed (read-only, `vot.error.closed`).
- AC 6: SCR-VOT-38, SCR-VOT-39, SCR-VOT-40 (keys, guest sees result on the link, quiet hours).
- AC 7: SCR-VOT-41 Closing and Needs attention.
- AC 8: no UI, system rule (closing mode, actor, exact time, final counts in audit).
- AC 9: SCR-VOT-37 default (absolute and relative time, confirm not default focus).

**Objects and fields:** Vote (status, result, closing mode, closed at); Ballot; Decision; Audit entry; Notification.

**Open points:**
- VOT-08 AC 4 cites "conventions 10.7" for the small-group fallback (conventions 10.3 holds it). Correct citation?
- Is `Close now` hidden or shown disabled with a reason on a linked vote? Story says "never"; 09 section 10.4 rule 5 allows disabled only for state; not specified in the story.
- Does the creator get a distinct notification for Needs attention? Not specified in the story (status only, operator alert).
- Does Tie have its own EV-VOT number? The story names `msg.vot.closed_tie` without an EV ID.

---

### VOT-09 Read the result with a clear outcome and a next step

**Story:** VOT-09 Read the result with a clear outcome and a next step

**Surfaces:**
- SCR-VOT-42 | Result and outcome block (result chip, automatic outcome sentence, counts, names if Named, written outcome with next step, link to the expense request) | inline (on SCR-VOT-07 after close) | Member with `Vote: view` | Entry: SCR-VOT-07, SCR-VOT-38 | Exit: SCR-VOT-55, expense request
- SCR-VOT-43 | Add outcome and next step form (what, who is responsible, by when, optional review date) | sheet | Vote creator or holder of `Vote: close` | Entry: "Add outcome" on SCR-VOT-42 | Exit: SCR-VOT-42
- SCR-VOT-44 | Notification: review due (`msg.vot.review_due`) | notification | The owner and the group | Entry: system on the review date | Exit: link back to the decision (SCR-VOT-55)
- SCR-VOT-45 | System: result exposed to the CON decision gate (id, close time, status, `snapshot_ref`) | system | none | Entry: vote closes | Exit: CON Apply allowed only on Passed

**States per surface:**
- SCR-VOT-42 Passed: word, icon, colour; `vot.outcome.passed` with counts.
- SCR-VOT-42 Not passed (majority not reached): `vot.outcome.rejected`; includes yes equal to no on yes/no.
- SCR-VOT-42 Not passed (quorum not met): `vot.outcome.noquorum`, for example "5 yes, 1 no, quorum not reached: 5 of 8 needed".
- SCR-VOT-42 authority floor failed: `vot.outcome.authority_floor` with the reason `Not enough voters`.
- SCR-VOT-42 Tie: `vot.outcome.tie`; see SCR-VOT-50.
- SCR-VOT-42 Cancelled: status Cancelled, no result.
- SCR-VOT-42 loading: result being computed; loading state.
- SCR-VOT-42 offline: cached result with `Last synced`.
- SCR-VOT-42 Named: names shown with answers as stated before voting; percentages never replace counts; `Counted` against a ballot only when it counts toward quorum.
- SCR-VOT-42 Anonymous: totals only.
- SCR-VOT-42 expense-linked: shows what happened to the request and a link (VOT-03).
- SCR-VOT-42 outcome text appended: author and time shown; automatic sentence never edited.
- SCR-VOT-42 long text: sentence plain text, fits at 200% font size.
- SCR-VOT-43 default: fields what, who, by when, optional review date; prompted, never required.
- SCR-VOT-43 offline: not specified in the story.
- SCR-VOT-43 hidden: person without `Vote: close` and not the creator; action not shown.
- SCR-VOT-44 default: sent on the review date to the owner and the group, links to the decision.

**Criteria map:**
- AC 1: SCR-VOT-42 Passed, Not passed states, Tie, Cancelled (four results and Cancelled, word plus icon plus colour).
- AC 2: SCR-VOT-42 outcome states (`vot.outcome.passed`, `vot.outcome.rejected`, `vot.outcome.noquorum`, `vot.outcome.tie`, `vot.outcome.authority_floor`).
- AC 3: SCR-VOT-42 Named and Anonymous (counts, names per setting, `Counted` rule).
- AC 4: SCR-VOT-43 default and SCR-VOT-42 outcome text appended.
- AC 5: SCR-VOT-44 default (`msg.vot.review_due`).
- AC 6: SCR-VOT-42 expense-linked.
- AC 7: SCR-VOT-42 loading and offline.
- AC 8: no UI, system rule (outcome text, author, time stored and shown in the decision log, SCR-VOT-55).
- AC 9: SCR-VOT-42 long text.
- AC 10: SCR-VOT-45 (only Passed allows an Apply; Not passed either reason, Tie, Needs attention and Cancelled do not).

**Objects and fields:** Vote (result, counts, quorum status, outcome statement, next step, owner, due date, review date, `snapshot_ref`); Decision; Audit entry; Notification.

**Open points:**
- Reason wording `Not enough voters` against "Not passed (floor not met)" of R191 (see VOT-02 open points).
- Is the written outcome of SCR-VOT-43 editable or replaceable later, or only appended again? The story says appended with author and time, with no edit.
- Who is "the owner" notified by `msg.vot.review_due` when no responsible person was named (next step is not required)? Not specified in the story.
- Does "the group" in `msg.vot.review_due` mean every eligible voter or every member with `Vote: view`? Not specified in the story.

---

### VOT-10 Decide what happens when too few people vote

**Story:** VOT-10 Decide what happens when too few people vote

**Surfaces:**
- SCR-VOT-46 | No-quorum fallback setting ("If not enough people vote by the deadline": extend once, close and allow reopen, close with no reopen) | inline (section of SCR-VOT-01 and SCR-VOT-10) | Creator with `Vote: create` | Entry: rule section of SCR-VOT-01 | Exit: stays on SCR-VOT-01
- SCR-VOT-47 | Notification: vote extended (`msg.vot.extended`, EV-VOT-06; in-app and push) | notification | Eligible persons who have not voted | Entry: system at an extension | Exit: SCR-VOT-07
- SCR-VOT-48 | Reopen dialog (new deadline within duration limits, consequences stated) | modal | Holder of `Vote: close` (and creator) | Entry: `Reopen` on SCR-VOT-42 until `VOTE_REOPEN_WINDOW` ends | Exit: SCR-VOT-07 Open
- SCR-VOT-49 | System: fallback executor at the deadline (extend, close with reopen window, close without reopen) | system | none | Entry: deadline reached without quorum | Exit: SCR-VOT-47, SCR-VOT-39, SCR-VOT-55

**States per surface:**
- SCR-VOT-46 default: three radio choices with visible descriptions `vot.fallback.extend`, `vot.fallback.reopen`, `vot.fallback.close`, prefilled from `VOTE_DEFAULT_NOQUORUM_FALLBACK`; extend takes a duration within `VOTE_MAX_DURATION`.
- SCR-VOT-46 expense-linked: only (a) extend and (c) close offered; same default.
- SCR-VOT-46 hidden: quorum is "no minimum"; setting not applicable (precondition).
- SCR-VOT-46 locked: first ballot cast; setting shown to voters in `vot.rule.summary` and locked.
- SCR-VOT-47 default: `msg.vot.extended`, new deadline in absolute and relative form; SMS follows from VOT-07 reminders, not from this notice.
- SCR-VOT-48 default: states consequences in plain words; keeps all ballots and the vote reference; notifies eligible voters with `msg.vot.opened`.
- SCR-VOT-48 expired: after the window or beyond limits; refused with `vot.error.reopen_expired`.
- SCR-VOT-48 hidden: for expense-linked votes no reopen window exists.
- SCR-VOT-49 extend: deadline extended up to `VOTE_MAX_EXTENSIONS`; quorum still unmet after the last extension: closes Not passed (quorum not met).
- SCR-VOT-49 close with reopen: Not passed (quorum not met); creator and holders of `Vote: close` notified; `Reopen` available until the window ends.
- SCR-VOT-49 close without reopen: Not passed (quorum not met), no reopen.
- SCR-VOT-49 authority below the floor: always Not passed (quorum not met) whatever the fallback; never falls back to approvals; request to Needs attention for 48 hours (VOT-03).
- SCR-VOT-49 quorum reached: fallback never applies.

**Criteria map:**
- AC 1: SCR-VOT-46 default and expense-linked (three choices, plain sentences, authority floor override, 48-hour request extension).
- AC 2: SCR-VOT-47 default and SCR-VOT-49 extend (`msg.vot.extended`, `VOTE_MAX_EXTENSIONS`).
- AC 3: SCR-VOT-48 default and SCR-VOT-49 close with reopen (`Reopen`, same reference, `msg.vot.opened`, one decision entry per close).
- AC 4: SCR-VOT-49 quorum reached.
- AC 5: SCR-VOT-46 locked (shown before voting, locked at first ballot).
- AC 6: SCR-VOT-55 history (each extension and reopening logged with who, when, from and to deadline).
- AC 7: SCR-VOT-55 (a no-quorum close always creates an entry; a reopened vote links to it).
- AC 8: SCR-VOT-48 expired (`vot.error.reopen_expired`).
- AC 9: SCR-VOT-46 default and SCR-VOT-48 default (radio buttons, consequences in plain words).

**Objects and fields:** Vote (fallback setting, extension count, new deadline, reopen window end); Decision; Audit entry; Notification.

**Open points:**
- The notification to the creator and `Vote: close` holders when a vote closes for (b) is not given a key. Is it `msg.vot.no_quorum` (SCR-VOT-39)? Not specified in the story.
- Does an extension chosen by fallback (a) share the count `VOTE_MAX_EXTENSIONS` with the manual extension of VOT-12 and the requester's extension of VOT-03? Story says VOT-10 and VOT-12 share it; the requester extension "once" is not reconciled.
- The reopen dialog is allowed for "Vote: close (to reopen)" while VOT-10 AC 3 also says "the creator": may a creator without `Vote: close` reopen? Not specified in the story.
- Where does the person choose the extension duration for (a) at setting time (a field in SCR-VOT-46) versus at the deadline? Story: "by a duration the creator picks"; the field location and bounds are not specified.

---

### VOT-11 Handle a tie with a clear rule

**Story:** VOT-11 Handle a tie with a clear rule

**Surfaces:**
- SCR-VOT-50 | Tie result and "Start a runoff vote" action (tied options with counts, runoff opens SCR-VOT-01 prefilled with only the tied options, same eligible voters and rule, new deadline to set; link to the original) | inline (on SCR-VOT-42, entry in SCR-VOT-55) | Vote creator and holders of `Vote: close` (action); every viewer (result text) | Entry: SCR-VOT-42 after a Tie | Exit: SCR-VOT-01 (runoff mode)

**States per surface:**
- SCR-VOT-50 Tie: result Tie, `vot.outcome.tie` naming the tied options and their counts; no option chosen; no casting vote; readable with 2 or more tied options.
- SCR-VOT-50 runoff available: creator and `Vote: close` holders see "Start a runoff vote".
- SCR-VOT-50 runoff started: new vote prefilled, new deadline required, linked to the original; log shows both; eligible voters receive `msg.vot.opened`.
- SCR-VOT-50 permission hidden: others see the result only.
- SCR-VOT-50 yes/no equal: not a Tie; shown as Not passed (majority not reached) and the sentence says so.
- SCR-VOT-50 money vote: a tie cannot occur (yes/no only); linked expense follows VOT-03 for Not passed.

**Criteria map:**
- AC 1: SCR-VOT-50 Tie (`vot.outcome.tie`, tied options and votes).
- AC 2: SCR-VOT-50 Tie (no automatic choice, no casting vote).
- AC 3: SCR-VOT-50 runoff available (action, prefill, new deadline).
- AC 4: SCR-VOT-50 runoff started and SCR-VOT-55 (link back, log shows both).
- AC 5: SCR-VOT-50 yes/no equal (Not passed (majority not reached) with the sentence).
- AC 6: SCR-VOT-50 money vote (no UI, system rule: no tie on money; VOT-03 for Not passed).
- AC 7: SCR-VOT-40 (`msg.vot.closed_tie`) and SCR-VOT-09 (`msg.vot.opened` for the runoff).
- AC 8: no UI, system rule (audit of tie, runoff creation, link between votes).
- AC 9: SCR-VOT-50 Tie (plain text for 2 or more tied options).

**Objects and fields:** Vote (options, counts, runoff link); Ballot; Decision; Audit entry.

**Open points:**
- Does the runoff vote copy the original's eligible list exactly, including a member who left since (VOT-02 AC 7 and decision R46)? Not specified in the story.
- Is a runoff allowed on a quorum-met tie only, or also after extension or reopen? Not specified in the story.
- A runoff prefilled "with only the tied options" can have the 2-option minimum; if three options tied, the form keeps three. Not specified whether the creator may add options. Not specified in the story.

---

### VOT-12 Edit, extend or cancel a vote

**Story:** VOT-12 Edit, extend or cancel a vote

**Surfaces:**
- SCR-VOT-51 | Edit vote (the SCR-VOT-01 form in edit mode with the lock explanation `vot.edit.locked`) | page | Vote creator (`Vote: create`) before the first ballot; `Vote: edit` holders for anyone else | Entry: "Edit" on SCR-VOT-07 | Exit: SCR-VOT-07
- SCR-VOT-52 | Cancel vote sheet (confirmation; after ballots, preset reasons plus free text) | sheet | Creator before the first ballot; `Vote: close` after ballots | Entry: "Cancel vote" on SCR-VOT-07 | Exit: SCR-VOT-07 Cancelled or SCR-VOT-05
- SCR-VOT-53 | Notification: vote updated (`msg.vot.updated`) | notification | Eligible voters who had already been told | Entry: system on saved edit | Exit: SCR-VOT-07
- SCR-VOT-54 | Edit conflict message (`vot.edit.conflict`, shows what changed) | inline (on SCR-VOT-51) | Second editor | Entry: save with a stale version | Exit: SCR-VOT-51 on the latest version

The extend action reuses SCR-VOT-20; cancellation notices reuse SCR-VOT-17.

**States per surface:**
- SCR-VOT-51 zero ballots: question, context, options, deadline, eligible voters and rule editable; saved edit updates the vote at once; a member added now receives `msg.vot.opened`.
- SCR-VOT-51 locked: from the first ballot; question, context, options, eligible list and rule read-only; sees `vot.edit.locked`; adding a voter not allowed.
- SCR-VOT-51 linked vote: amount, payee and wording come from the request (SPD-09) and cannot be changed once a ballot exists; an edit of those by a `Vote: edit` holder is refused, vote and ballots unchanged.
- SCR-VOT-51 offline: blocked with `xct.offline.needs_connection`, not queued.
- SCR-VOT-51 conflict: see SCR-VOT-54.
- SCR-VOT-51 saving and failure: save failure behaviour not specified beyond VOT-01; see open points.
- SCR-VOT-52 zero ballots: confirmation; vote removed from the list; audit entry; no decision-log entry.
- SCR-VOT-52 with ballots: needs `Vote: close`; mandatory reason from presets plus free text; `msg.vot.cancelled` with the reason; ballots kept in the audit log; status Cancelled; decision entry records the cancellation.
- SCR-VOT-52 linked vote: VOT-03 applies to the request.
- SCR-VOT-52 hidden: person without the needed permission; action not shown.
- SCR-VOT-53 default: sent only to people already told; `msg.vot.updated`.
- SCR-VOT-54 default: latest saved version shown with what changed; no silent overwrite.
- SCR-VOT-20 extension after first ballot: deadline extended, not shortened, mandatory reason; notifies every eligible person who has not voted; appears in the vote history; counts toward `VOTE_MAX_EXTENSIONS`; money or authority vote deadline in quiet hours snapped to 07:00 to 21:00.
- SCR-VOT-20 limit reached: `VOTE_MAX_EXTENSIONS` used; behaviour and key not specified.
- SCR-VOT-20 shortening: refused; key not specified.

**Criteria map:**
- AC 1: SCR-VOT-51 zero ballots and SCR-VOT-53 (`msg.vot.updated`, `msg.vot.opened` for an added member).
- AC 2: SCR-VOT-51 locked (`vot.edit.locked`).
- AC 3: SCR-VOT-20 extension after first ballot (reason, notification, history, count, snap).
- AC 4: SCR-VOT-52 zero ballots.
- AC 5: SCR-VOT-52 with ballots (`Vote: close`, reason, `msg.vot.cancelled`, ballots kept, decision entry).
- AC 6: SCR-VOT-51 linked vote and SCR-VOT-52 linked vote.
- AC 7: SCR-VOT-54 default (`vot.edit.conflict`).
- AC 8: SCR-VOT-51 offline (`xct.offline.needs_connection`).
- AC 9: no UI, system rule (audit of before and after values, actor, time, cancellation reason).

**Objects and fields:** Vote (all editable fields, extension count, cancel reason); Audit entry; Notification; Decision.

**Open points:**
- "Eligible voters are notified only if they had already been told": what defines "told" (push sent versus opened)? Not specified in the story.
- VOT-12 permission line says `Vote: edit` is needed "for everyone to extend", but VOT-03 AC 6 lets the requester extend a failed-quorum money vote. Does the requester need `Vote: edit`? Not specified in the story.
- Where are the preset cancel reasons listed? Not specified in the story.
- Can the creator extend, cancel after ballots, or edit once they lose `Vote: create`? Not specified in the story.
- No error key for a refused shortening of the deadline or for a used-up extension count. Not specified in the story.

---

### VOT-13 Record every closed vote in the decision log, linked to the money it moved

**Story:** VOT-13 Record every closed vote in the decision log, linked to the money it moved

**Surfaces:**
- SCR-VOT-55 | Decision entry page (question, context, options, result with counts, quorum status, rule in words, proposer, close date, ballot visibility mode, link to the vote, links to the request and ledger entry, history chain, attachments; stable reference) | page | Member with `Vote: view` and view on the parent group or project | Entry: SCR-VOT-63, notification, SCR-VOT-07, expense request, ledger entry | Exit: SCR-VOT-63, SCR-VOT-07
- SCR-VOT-56 | System: decision entry writer (one entry per close, atomic with close, retries until it succeeds; project-closed entry from PRJ-09) | system | none | Entry: VOT-08 close, VOT-12 cancel after ballots, PRJ-09 close | Exit: SCR-VOT-55

**States per surface:**
- SCR-VOT-55 default: entry with all fields; the entry belongs to the project when the vote does, to the group otherwise; a project decision also appears in the group log.
- SCR-VOT-55 result variants: each of Passed, Not passed (majority not reached), Not passed (quorum not met), Tie, and Cancelled with at least one ballot.
- SCR-VOT-55 snapshot: stores `snapshot_ref` when the vote carries it.
- SCR-VOT-55 Anonymous: totals only.
- SCR-VOT-55 money moved: payment Confirmed; "Money moved" link with the ledger reference and amount appended.
- SCR-VOT-55 payment failed, cancelled or stopped: that status appended instead.
- SCR-VOT-55 payout blocked: `payout_blocked`; a linked follow-up entry created; earlier entry never edited.
- SCR-VOT-55 reopened or runoff: new entry links to the earlier one; both visible.
- SCR-VOT-55 system entry: `Project closed by {name}`, no vote counts, marked as written by the system.
- SCR-VOT-55 appended additions: outcome statement, review date, money links, reopen links, amendments appended with author, time and source; no edit of earlier fields.
- SCR-VOT-55 not a member of the electorate: can see the entry if they can view the group or project.
- SCR-VOT-55 forbidden or not found: not specified in the story.
- SCR-VOT-55 offline: see VOT-16 (cache and `Last synced`).
- SCR-VOT-56 write failed: vote shows Needs attention, not Closed; no linked action runs; creator and operator alerted; retries until it succeeds (OPS-14 backstop).
- SCR-VOT-56 cancelled before first ballot: no entry.

**Criteria map:**
- AC 1: SCR-VOT-55 default and snapshot (one entry per close, fields, atomic write).
- AC 2: SCR-VOT-55 result variants (four results and cancelled with a ballot logged; cancelled with none is not).
- AC 3: SCR-VOT-55 money moved, payment failed, payout blocked.
- AC 4: SCR-VOT-55 default (project or group ownership, project decision in the group log).
- AC 5: SCR-VOT-55 appended additions (append-only).
- AC 6: SCR-VOT-55 reopened or runoff.
- AC 7: SCR-VOT-56 write failed (Needs attention, retries, OPS-14).
- AC 8: no UI, system rule (no second push; `msg.vot.decision_logged` is emitted only by VOT-14).
- AC 9: no UI, system rule (each append is an audit entry; money link is read-only; no ledger write).
- AC 10: SCR-VOT-55 system entry (`Project closed by {name}`).

**Objects and fields:** Decision (question, context, options, result, counts, quorum status, rule words, proposer, closed at, visibility mode, `snapshot_ref`, links); Vote; Expense request; Ledger entry (reference); Audit entry.

**Open points:**
- Decision entries are "immutable" yet receive appended links and statuses; the visible distinction between original fields and appended items is not specified in the story.
- "Members who were not eligible can see the entry if they can view the group or project": does `Vote: view` still apply? Story precondition says `Vote: view`; Closed question says view on the group or project. Not specified in the story.
- Does a "Needs attention" vote that is later resolved produce the entry with a visible delay marker? Not specified in the story.


---

### VOT-14 Record a decision that was taken outside the app

**Story:** VOT-14 Record a decision that was taken outside the app

**Surfaces:**
- SCR-VOT-57 | Record a decision form (what was decided, context, date taken, where it was taken, who took it, responsible person, attachments, optional link to a project, vote or request) | page | Holder of `Vote: create` at group level (group decision) or project level (project decision) | Entry: "Record a decision" on the decision log or the project page | Exit: SCR-VOT-55
- SCR-VOT-58 | Notification: decision logged (`msg.vot.decision_logged`, in-app item, summary only: title and responsible person) | notification | Members who can view the log | Entry: system on save | Exit: SCR-VOT-55
- SCR-VOT-59 | Notification: decision assigned (`msg.vot.decision_assigned`, push) | notification | The named responsible person | Entry: system on save | Exit: SCR-VOT-55

**States per surface:**
- SCR-VOT-57 default: empty form; required: what was decided, date taken (not in the future, not older than `VOTE_DECISION_BACKDATE_DAYS`), responsible person (a member); where taken from the list meeting, phone call, chat, other; who took it by picking members or typing free-text names.
- SCR-VOT-57 attachments: up to `PROJECT_ATTACHMENTS_PER_ITEM` files under the rules of PRJ-07 and SPD-03.
- SCR-VOT-57 links: optional link to a project and to an existing vote or expense request; information only, the vote result unchanged.
- SCR-VOT-57 validation error: missing responsible person or invalid date; inline message (key not specified); other fields kept.
- SCR-VOT-57 offline: saved on the phone with state `Waiting to send`, sent when the connection returns (XCT-05 Table A); date taken stays as typed; a conflict never overwrites another entry.
- SCR-VOT-57 loading and failure: not specified in the story.
- SCR-VOT-57 hidden: person without `Vote: create`; action not shown.
- SCR-VOT-57 long text and picker: person picker searchable and keyboard-usable; fixed labels in the viewer's language, typed text keeps its language.
- SCR-VOT-58 default: in-app item for members who can view the log.
- SCR-VOT-59 default: push to the responsible person.

**Criteria map:**
- AC 1: SCR-VOT-57 default (fields, date rule, where-taken list, who took it, responsible person).
- AC 2: SCR-VOT-55 (badge `vot.decision.manual_badge` "Recorded by {name}, not a vote", no counts or result chip).
- AC 3: SCR-VOT-57 attachments.
- AC 4: SCR-VOT-57 links.
- AC 5: SCR-VOT-58 and SCR-VOT-59 default.
- AC 6: SCR-VOT-57 offline (`Waiting to send`).
- AC 7: SCR-VOT-57 validation error.
- AC 8: no UI, system rule (audit of author, time, device, fields; author shown on the entry).
- AC 9: SCR-VOT-57 long text and picker.
- AC 10: SCR-VOT-55 (entry shows date typed and date entered; no money moved; never an authorising vote or a quorum count).

**Objects and fields:** Decision (what, context, date taken, date entered, place, who took it, responsible person, attachments, links, author, device); Document; Membership; Audit entry.

**Open points:**
- The story ties `msg.vot.decision_logged` to "EV-PRJ-06" while the key is in the `vot` family and conventions 11.1 says each key belongs to one epic story. Which EV row and epic own it?
- Is the manual entry notified to members who can view the log in a group with many members as one in-app item each (batching)? Not specified in the story (NTF owns batching).
- Which attachments are visible to which viewers on a manual entry? Not specified in the story (R154 and SPD-03 apply to expense files).
- What key shows for an invalid date or missing responsible person? Not specified in the story.

---

### VOT-15 Correct or replace a decision without erasing the original

**Story:** VOT-15 Correct or replace a decision without erasing the original

**Surfaces:**
- SCR-VOT-60 | Amend sheet (mandatory reason, new text, author; no vote counts, result, quorum status or rule words) | sheet | Holder of `Vote: edit` | Entry: "Amend" on SCR-VOT-55 | Exit: SCR-VOT-55
- SCR-VOT-61 | Entry history chain (amendments, `Amended` chip, "Show original", `Supersedes {title}`, `Superseded by`) | inline (on SCR-VOT-55) | Member who can view the entry | Entry: SCR-VOT-55 | Exit: linked entry
- SCR-VOT-62 | Notification: decision amended (`msg.vot.amended`, summary only) | notification | Members who voted and the responsible person | Entry: system on amendment | Exit: SCR-VOT-55

"Replace this decision" opens SCR-VOT-57 (manual) or SCR-VOT-01 (new vote) with a back link.

**States per surface:**
- SCR-VOT-60 default: reason and new text required; sees only context and outcome fields; original text, counts and attachments stay visible.
- SCR-VOT-60 duplicate: second amendment within `VOTE_AMEND_MIN_INTERVAL` refused; `vot.decision.duplicate`.
- SCR-VOT-60 offline: queued as `Waiting to send`, synced in creation order (XCT-05 Table A).
- SCR-VOT-60 conflict: both versions shown as `Your change` and `{name}'s change`.
- SCR-VOT-60 hidden: person without `Vote: edit`; action not shown.
- SCR-VOT-60 locked fields: counts, result, quorum status and rule words not offered.
- SCR-VOT-61 amended: `Amended` chip, latest text first, "Show original" one tap away; a manual entry keeps the badge `Recorded by {name}, not a vote` through every amendment.
- SCR-VOT-61 replaced: new entry shows `Supersedes {title}`; old entry shows `Superseded by` with a link and stays readable.
- SCR-VOT-61 history list: plain list readable by screen readers, absolute dates; no delete action.
- SCR-VOT-62 default: `msg.vot.amended`.

**Criteria map:**
- AC 1: SCR-VOT-60 default and SCR-VOT-61 amended (reason, history chain).
- AC 2: SCR-VOT-61 amended (`Amended` chip, "Show original", manual badge kept).
- AC 3: SCR-VOT-60 locked fields (counts locked; no money; never authorising or counted).
- AC 4: SCR-VOT-61 replaced (`Supersedes {title}`, `Superseded by`).
- AC 5: SCR-VOT-62 default (`msg.vot.amended`).
- AC 6: SCR-VOT-60 duplicate (`vot.decision.duplicate`).
- AC 7: SCR-VOT-60 offline and conflict.
- AC 8: no UI, system rule (audit of amendment, reason, author, time; no earlier record modified; no delete action).
- AC 9: SCR-VOT-61 history list.

**Objects and fields:** Decision (append records, reason, author, time, supersedes link); Audit entry; Notification.

**Open points:**
- The open question of the story: is a hidden-for-error status needed for an entry created by mistake (default proposed: amend with reason, never hide)?
- `msg.vot.amended` goes to "members who voted": on an Anonymous vote, which list is used since the answer link is removed (VOT-17 AC 8 keeps the list of who took part)? Not specified in the story.
- Who may "Replace this decision" with a new vote: `Vote: edit` holder only, or also `Vote: create`? The story lists `Vote: edit` for the action and `Vote: create` for the new entry. Not specified in the story.

---

### VOT-16 Find past decisions in the decision log

**Story:** VOT-16 Find past decisions in the decision log

**Surfaces:**
- SCR-VOT-63 | Decision log list (newest first; rows with title, result chip, date, proposer or responsible person, "Money moved" or "Manual" marker; project name in the group log; visible count; paginated) | page | Member with `Vote: view` and view on the parent group or project | Entry: "Decisions" on the group or project page, notifications | Exit: SCR-VOT-55, SCR-VOT-01, SCR-VOT-57
- SCR-VOT-64 | Log filter sheet (project, result, kind, status, date range, scope) | sheet | Same as SCR-VOT-63 | Entry: filter button on SCR-VOT-63 | Exit: SCR-VOT-63
- SCR-VOT-65 | Log search (free text over title, question, context, outcome, option text, matching words shown) | inline (on SCR-VOT-63) | Same as SCR-VOT-63 | Entry: search field | Exit: SCR-VOT-63

**States per surface:**
- SCR-VOT-63 default: rows newest first; group log includes project decisions with the project's name; a project log shows only its own.
- SCR-VOT-63 empty: no decisions; `vot.decision.list_empty` and a button to open a vote or record a decision depending on permissions.
- SCR-VOT-63 loading: skeleton rows; first page fast, the rest on scroll with a visible count.
- SCR-VOT-63 offline: entries of the last `CACHE_LEDGER_DAYS` with `Last synced`; older entries need a connection, said without the word "offline" (key not specified).
- SCR-VOT-63 filtered empty: filters match nothing; empty state with a clear action (key not specified).
- SCR-VOT-63 forbidden: person without view on the parent; not specified in the story.
- SCR-VOT-64 default: filter by project, result (Passed, Not passed for either reason, Tie), kind (vote or manual entry), status (Cancelled, Amended), date range, group or project scope.
- SCR-VOT-65 match: matching words shown; accents handled (search "e" matches "ê" and "é").
- SCR-VOT-65 no match: `vot.decision.search_empty` with a clear action.
- SCR-VOT-65 offline: works on cached entries.

**Criteria map:**
- AC 1: SCR-VOT-63 default (row content and markers).
- AC 2: SCR-VOT-64 default.
- AC 3: SCR-VOT-65 match and no match (`vot.decision.search_empty`).
- AC 4: SCR-VOT-63 default (group log includes project decisions; project log own only).
- AC 5: SCR-VOT-55 (full entry, history chain, linked vote, request, ledger entry, permitted attachments).
- AC 6: SCR-VOT-63 empty (`vot.decision.list_empty`).
- AC 7: SCR-VOT-63 offline and SCR-VOT-65 offline (`CACHE_LEDGER_DAYS`, `Last synced`).
- AC 8: SCR-VOT-63 loading.
- AC 9: SCR-VOT-63 default and SCR-VOT-65 match (screen-reader rows, text labels, accent-insensitive search).

**Objects and fields:** Decision; Vote; Project; Expense request; Ledger entry (reference); Document.

**Open points:**
- Key and wording of the "older entries need a connection" message: not specified in the story.
- Does the filtered-empty state reuse `vot.decision.search_empty` or `vot.decision.list_empty`? Not specified in the story.
- The log export (CSV and PDF) is a P2 non-story, so no surface exists; confirm the surface is absent from the MVP.
- Are Drafts, Closing and Needs attention votes shown in the log? Story: entries are written at close; Needs attention has no entry. Not specified in the story.

---

### VOT-17 Choose whether ballots are named or anonymous

**Story:** VOT-17 Choose whether ballots are named or anonymous

**Surfaces:**
- SCR-VOT-66 | Ballot visibility setting ("Who can see how people voted": Anonymous or Named, one sentence each `vot.visibility.anonymous`, `vot.visibility.named`, `vot.visibility.authority_named`) | inline (section of SCR-VOT-01) | Creator with `Vote: create` | Entry: section of SCR-VOT-01 | Exit: stays on SCR-VOT-01
- SCR-VOT-67 | Non-voter list (people who have not voted yet, private) | inline (on SCR-VOT-07) | Creator and holders of `Vote: close`, Anonymous mode | Entry: SCR-VOT-07 | Exit: SCR-VOT-34
- SCR-VOT-68 | Named ballot list (each person's answer) | inline (on SCR-VOT-07 and SCR-VOT-28 for guests' display name) | Every member with `Vote: view`, Named mode | Entry: SCR-VOT-07 | Exit: none

The visibility mode line also appears on SCR-VOT-21 and SCR-VOT-42.

**States per surface:**
- SCR-VOT-66 default: Anonymous preselected from `VOTE_DEFAULT_VISIBILITY`; creator can switch to Named.
- SCR-VOT-66 authority: choice not offered; always Named; `vot.visibility.authority_named` explains why.
- SCR-VOT-66 locked: first ballot cast; setting locked.
- SCR-VOT-66 shown to voters: mode shown on the ballot page before voting and again on the result page; privacy explanation as text with an icon in three languages.
- SCR-VOT-67 default: names only of those who have not voted, never answers; never in the group channel.
- SCR-VOT-67 hidden: all other members; in Named mode the list is not specified separately.
- SCR-VOT-68 Named: names and answers visible; guests shown with a display name from their membership.
- SCR-VOT-68 Anonymous: not shown; totals only; guests' answers hidden.
- SCR-VOT-68 expense-linked: Named shown next to the amount; the payout entry stores the vote and its voters; SPD-09 shows who voted yes as the authorisation.
- SCR-VOT-68 after close, Anonymous: answer-to-person link removed; the decision entry keeps totals and the list of who took part; operators never see a link.

**Criteria map:**
- AC 1: SCR-VOT-66 default and authority (two options, default Anonymous, authority always Named).
- AC 2: SCR-VOT-66 shown to voters and locked (shown before voting and on the result, locked at first ballot).
- AC 3: SCR-VOT-67 default, SCR-VOT-68 Named (participation counts to all; non-voter list to creator and `Vote: close`; Named shows names and answers).
- AC 4: SCR-VOT-68 Named and Anonymous (guest display name or hidden).
- AC 5: SCR-VOT-68 expense-linked.
- AC 6: SCR-VOT-55 (entry stores the mode; totals only in Anonymous).
- AC 7: no UI, system rule (reminders and notifications never state who voted what).
- AC 8: SCR-VOT-68 after close, Anonymous (one ballot per voter for integrity, no answer-to-person view, no export, link removed at close).
- AC 9: SCR-VOT-66 shown to voters (text with icon, three languages).

**Objects and fields:** Vote (visibility mode); Ballot; Membership (display name); Audit entry.

**Open points:**
- A guest or Invited member may have no display name: what is shown in Named mode? Not specified in the story.
- Does the non-voter list include guests whose number is on the list but who are not registered? Not specified in the story.
- In Named mode, who sees the non-voter list? Not specified in the story (only Anonymous mode is stated).

---

### VOT-18 Vote when the connection is poor and see the ballot's state

**Story:** VOT-18 Vote when the connection is poor and see the ballot's state

**Surfaces:**
- SCR-VOT-69 | Queued ballot state (state of SCR-VOT-21 and SCR-VOT-22: `Waiting to send`, `Sent`, `Confirmed` shown as `Received`, `Too late`, `Not sent. Retry`, `Withdrawn`; `Retry now`; cancel action; `vot.offline.not_counted`; `Open Gereo when you have signal`) | inline | Member holding `Vote: vote` | Entry: tap `Send my vote` without a working connection | Exit: SCR-VOT-22
- SCR-VOT-70 | Sync indicator and waiting counter (header: `Updated 14:05`, `Updating...`, `Not updated since yesterday - Retry`; `1 item waiting since Mon`) | inline (app header) | Any signed-in person | Entry: always on | Exit: Retry

**States per surface:**
- SCR-VOT-69 Waiting to send: `xct.queue.waiting`; `vot.offline.not_counted` ("Not counted yet. Connect before {deadline}") with the deadline absolute and relative; ballot stored on the phone at once; says reminders may still arrive until the ballot is sent.
- SCR-VOT-69 Sent then Received: app open with a connection; automatic send with exponential backoff; `Sent` then `Confirmed` shown as `Received` (`xct.queue.ballot_received`); `Counted` only in results and only when it counts toward quorum.
- SCR-VOT-69 retrying: keeps retrying until the deadline; shows `Open Gereo when you have signal`; `Retry now` always available.
- SCR-VOT-69 Not sent. Retry: retries used up (XCT-05); `Retry now` available.
- SCR-VOT-69 Too late: server receives after the deadline; rejected; `vot.offline.too_late` with both times (voting closed, answer arrived); nothing counted.
- SCR-VOT-69 Withdrawn: person cancels a ballot still `Waiting to send`.
- SCR-VOT-69 changed before sync: only the latest sent; screen shows the final state, never two states.
- SCR-VOT-69 removed or demoted voter: server rejects at receipt with a reason shown to the voter (key not specified).
- SCR-VOT-69 not available: guest on the light page cannot queue; `xct.offline.needs_connection`; also when the deadline is within `QUEUE_VOTE_MIN_MINUTES`.
- SCR-VOT-69 offline vote page: cached question, rule and last-known participation with `Last synced`; options and rule from the version the person saw.
- SCR-VOT-69 accessibility: every state has text, icon and colour; deadline warning announced to screen readers.
- SCR-VOT-70 default: `Updated 14:05`; `Updating...` while syncing; `Not updated since yesterday - Retry`; counter `1 item waiting since Mon`.

**Criteria map:**
- AC 1: SCR-VOT-69 Waiting to send (`xct.queue.waiting`, `vot.offline.not_counted`).
- AC 2: SCR-VOT-69 Sent then Received and retrying (`Retry now`, `Open Gereo when you have signal`, a queued ballot at the deadline counts toward nothing).
- AC 3: SCR-VOT-70 default (sync indicator and counter).
- AC 4: SCR-VOT-69 Too late (`vot.offline.too_late`).
- AC 5: SCR-VOT-69 changed before sync (one ballot per voter per vote, server receipt order).
- AC 6: SCR-VOT-69 Withdrawn.
- AC 7: SCR-VOT-69 removed or demoted voter and not available (guest cannot queue); client time and device stored, receipt time decides (system rule).
- AC 8: SCR-VOT-69 offline vote page.
- AC 9: SCR-VOT-69 accessibility.

**Objects and fields:** Ballot (queued: client timestamp, device ID, receipt time, state); Vote (cache); Device; Audit entry.

**Open points:**
- `QUEUE_VOTE_MIN_MINUTES` has no value in this story and is not in conventions Table A (owned by XCT-05). What does the person see when the deadline is nearer than the minimum: `xct.offline.needs_connection` or another key? Not specified in the story.
- Key for the rejection of a removed or demoted voter's ballot at receipt: not specified in the story.
- The story says `Confirmed` is shown as `Received`; VOT-04 AC 2 shows `Received` after an online send. Is the online send state shown with the same `Sent` interim word? Not specified in the story.

---

## Epic summary

Stories: 18.
Distinct surfaces: 70 (inline 27, modal 1, notification 15, page 11, sheet 9, system 7).
State lines: 272.
Open points: 71.

All open points:

1. VOT-01: Which key shows an option-validation error (fewer than 2, duplicate)? Not specified in the story.
2. VOT-01: Which key carries the NTF-09 criterion 3 deadline warning and where is it shown? Not specified in the story.
3. VOT-01: No story defines the vote list surface (SCR-VOT-05): its empty, offline and forbidden states and its filters are not specified.
4. VOT-01: What does a member without `Vote: create` see on the group page, hidden entry or a reason? Not specified in the story (conventions section 7 and 09 section 6.3 rule 3 or 4).
5. VOT-01: VOT-01 AC 3 says invited-by-phone members "vote as guests", while the Eligible voters line of Kinds of vote says an authority vote uses every holder of `Vote: vote`. Can an Invited-by-phone person be a holder of `Vote: vote` for an authority vote? Not specified in the story.
6. VOT-02: VOT-02 AC 10 and VOT-09 use the reason `Not enough voters` with result Not passed (quorum not met), while conventions 11.3 and decision R191 item 2 name the result "Not passed (floor not met)". Which wording is final?
7. VOT-02: Key for the invalid-input messages in AC 5: not specified in the story.
8. VOT-02: The minimum voter tenure (default 72 hours of membership and a verified phone, decision R183, "owned by VOT") appears in no VOT story. Which story owns it and how does it show on a vote page?
9. VOT-02: VOT-02 AC 6 says the rule is locked at the first ballot while VOT-10 AC 5 and VOT-17 AC 2 lock their own settings at the first ballot; is "locked" one shared state, with one message key? `vot.edit.locked` is named only in VOT-12.
10. VOT-03: VOT-03 Preconditions and VOT-08 AC 4 cite "conventions 10.7" for the small-group fallback, but conventions 10.7 is Caps; the fallback is in conventions 10.3. Correct citation?
11. VOT-03: VOT-03 AC 3 and VOT-06 AC 4 say guests never count toward the D4 floor; decision R189 says a guest ballot tied to a verified number on the frozen eligible list counts toward the SPD-09 floor on the vote path, and R186 says R189 applies. Which rule do the vote page and `vot.guest.floor_notice` follow?
12. VOT-03: Result reason for a floor failure: story says Not passed (quorum not met) with reason `Not enough voters`; R191 says "Not passed (floor not met)". See VOT-02 open points.
13. VOT-03: Which permission lets the requester extend after quorum failure (SCR-VOT-20)? VOT-12 gives extension to `Vote: edit` holders; the requester may hold neither `Vote: edit` nor `Vote: create`.
14. VOT-03: VOT-03 AC 4 says the requester may extend "once"; `VOTE_MAX_EXTENSIONS` is 2 and shared with VOT-10 and VOT-12. Is the requester's once-only extension inside that count, and can the requester extend if earlier extensions used the count? Not specified in the story.
15. VOT-03: Key and text for the warning that approvals set aside are not reused when a vote starts on an Awaiting approval request: not specified in the story.
16. VOT-03: Decision R189 holds a vote-authorised payout for operator review (OPS-10, release-only) for a new payee with weak ballots; no VOT story names the request or vote state the voters see. Not specified in the story.
17. VOT-04: Does casting a ballot require `Vote: view` as well as `Vote: vote` (VOT-05 names `Vote: view` as its permission)? Not specified in the story.
18. VOT-04: "Who to ask" in `vot.error.not_eligible`: which person or role is named for a person not on the frozen list? Not specified in the story.
19. VOT-04: Anonymous mode: what does the voter's own history show for answers "as the rules of VOT-17 allow"? Not specified in the story.
20. VOT-05: Is the participation count shown to a person who has `Vote: view` but is not on the eligible list (for example a project-team member outside the electorate)? Not specified in the story.
21. VOT-05: Key for the quorum text after close ("why a vote did not count"): not specified beyond the `vot.outcome.*` keys of VOT-09.
22. VOT-05: Is the result visible to a person on the eligible list after the vote is Cancelled, and what does the page show? Not specified in the story.
23. VOT-06: VOT-06 AC 4 and `vot.guest.floor_notice` say a guest never counts toward the floor; decision R189 says a guest ballot tied to a verified number on the frozen list counts toward the SPD-09 floor on the vote path. Which is binding for the notice and for the vote result?
24. VOT-06: `vot.guest.closed` "plus the result when public to eligible voters": what makes the result "public to eligible voters" and when is it withheld? Not specified in the story.
25. VOT-06: Lock message key and wording after too many wrong codes: not specified in the story (ACC-02 owns the parameters).
26. VOT-06: What does the guest page show for an unknown or revoked token versus an expired one? Not specified in the story (09 section 5.3 asks for a designed expired page).
27. VOT-06: An Active member opening the link without a session is treated as a guest; is the member then shown the member page after sign-in, with the ballot carried over? Not specified in the story.
28. VOT-07: Who sees SCR-VOT-35 in an Anonymous vote beyond the creator, and does a `Vote: edit` holder see it? The story says "vote creator" only.
29. VOT-07: Is the reminder count in SCR-VOT-34 shown for a vote where eligible persons are guests with an unregistered number and a single-reminder limit? Not specified in the story.
30. VOT-07: EV numbers: this story names EV-VOT-02 and EV-VOT-03; the Cross-epic section says the catalogue runs EV-VOT-01 to EV-VOT-10 plus new events, while Message key convention says EV-VOT-01 to EV-VOT-18. Which range is correct?
31. VOT-07: Message key for a manual reminder: reuse `msg.vot.closing_soon` or a separate key? Not specified in the story.
32. VOT-08: VOT-08 AC 4 cites "conventions 10.7" for the small-group fallback (conventions 10.3 holds it). Correct citation?
33. VOT-08: Is `Close now` hidden or shown disabled with a reason on a linked vote? Story says "never"; 09 section 10.4 rule 5 allows disabled only for state; not specified in the story.
34. VOT-08: Does the creator get a distinct notification for Needs attention? Not specified in the story (status only, operator alert).
35. VOT-08: Does Tie have its own EV-VOT number? The story names `msg.vot.closed_tie` without an EV ID.
36. VOT-09: Reason wording `Not enough voters` against "Not passed (floor not met)" of R191 (see VOT-02 open points).
37. VOT-09: Is the written outcome of SCR-VOT-43 editable or replaceable later, or only appended again? The story says appended with author and time, with no edit.
38. VOT-09: Who is "the owner" notified by `msg.vot.review_due` when no responsible person was named (next step is not required)? Not specified in the story.
39. VOT-09: Does "the group" in `msg.vot.review_due` mean every eligible voter or every member with `Vote: view`? Not specified in the story.
40. VOT-10: The notification to the creator and `Vote: close` holders when a vote closes for (b) is not given a key. Is it `msg.vot.no_quorum` (SCR-VOT-39)? Not specified in the story.
41. VOT-10: Does an extension chosen by fallback (a) share the count `VOTE_MAX_EXTENSIONS` with the manual extension of VOT-12 and the requester's extension of VOT-03? Story says VOT-10 and VOT-12 share it; the requester extension "once" is not reconciled.
42. VOT-10: The reopen dialog is allowed for "Vote: close (to reopen)" while VOT-10 AC 3 also says "the creator": may a creator without `Vote: close` reopen? Not specified in the story.
43. VOT-10: Where does the person choose the extension duration for (a) at setting time (a field in SCR-VOT-46) versus at the deadline? Story: "by a duration the creator picks"; the field location and bounds are not specified.
44. VOT-11: Does the runoff vote copy the original's eligible list exactly, including a member who left since (VOT-02 AC 7 and decision R46)? Not specified in the story.
45. VOT-11: Is a runoff allowed on a quorum-met tie only, or also after extension or reopen? Not specified in the story.
46. VOT-11: A runoff prefilled "with only the tied options" can have the 2-option minimum; if three options tied, the form keeps three. Not specified whether the creator may add options. Not specified in the story.
47. VOT-12: "Eligible voters are notified only if they had already been told": what defines "told" (push sent versus opened)? Not specified in the story.
48. VOT-12: VOT-12 permission line says `Vote: edit` is needed "for everyone to extend", but VOT-03 AC 6 lets the requester extend a failed-quorum money vote. Does the requester need `Vote: edit`? Not specified in the story.
49. VOT-12: Where are the preset cancel reasons listed? Not specified in the story.
50. VOT-12: Can the creator extend, cancel after ballots, or edit once they lose `Vote: create`? Not specified in the story.
51. VOT-12: No error key for a refused shortening of the deadline or for a used-up extension count. Not specified in the story.
52. VOT-13: Decision entries are "immutable" yet receive appended links and statuses; the visible distinction between original fields and appended items is not specified in the story.
53. VOT-13: "Members who were not eligible can see the entry if they can view the group or project": does `Vote: view` still apply? Story precondition says `Vote: view`; Closed question says view on the group or project. Not specified in the story.
54. VOT-13: Does a "Needs attention" vote that is later resolved produce the entry with a visible delay marker? Not specified in the story.
55. VOT-14: The story ties `msg.vot.decision_logged` to "EV-PRJ-06" while the key is in the `vot` family and conventions 11.1 says each key belongs to one epic story. Which EV row and epic own it?
56. VOT-14: Is the manual entry notified to members who can view the log in a group with many members as one in-app item each (batching)? Not specified in the story (NTF owns batching).
57. VOT-14: Which attachments are visible to which viewers on a manual entry? Not specified in the story (R154 and SPD-03 apply to expense files).
58. VOT-14: What key shows for an invalid date or missing responsible person? Not specified in the story.
59. VOT-15: The open question of the story: is a hidden-for-error status needed for an entry created by mistake (default proposed: amend with reason, never hide)?
60. VOT-15: `msg.vot.amended` goes to "members who voted": on an Anonymous vote, which list is used since the answer link is removed (VOT-17 AC 8 keeps the list of who took part)? Not specified in the story.
61. VOT-15: Who may "Replace this decision" with a new vote: `Vote: edit` holder only, or also `Vote: create`? The story lists `Vote: edit` for the action and `Vote: create` for the new entry. Not specified in the story.
62. VOT-16: Key and wording of the "older entries need a connection" message: not specified in the story.
63. VOT-16: Does the filtered-empty state reuse `vot.decision.search_empty` or `vot.decision.list_empty`? Not specified in the story.
64. VOT-16: The log export (CSV and PDF) is a P2 non-story, so no surface exists; confirm the surface is absent from the MVP.
65. VOT-16: Are Drafts, Closing and Needs attention votes shown in the log? Story: entries are written at close; Needs attention has no entry. Not specified in the story.
66. VOT-17: A guest or Invited member may have no display name: what is shown in Named mode? Not specified in the story.
67. VOT-17: Does the non-voter list include guests whose number is on the list but who are not registered? Not specified in the story.
68. VOT-17: In Named mode, who sees the non-voter list? Not specified in the story (only Anonymous mode is stated).
69. VOT-18: `QUEUE_VOTE_MIN_MINUTES` has no value in this story and is not in conventions Table A (owned by XCT-05). What does the person see when the deadline is nearer than the minimum: `xct.offline.needs_connection` or another key? Not specified in the story.
70. VOT-18: Key for the rejection of a removed or demoted voter's ballot at receipt: not specified in the story.
71. VOT-18: The story says `Confirmed` is shown as `Received`; VOT-04 AC 2 shows `Received` after an online send. Is the online send state shown with the same `Sent` interim word? Not specified in the story.
