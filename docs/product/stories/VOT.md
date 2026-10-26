# VOT: Votes and decision log

Epic code: VOT. Release: MVP. Journey step: 5 Decide (and 7 Follow for the log). Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file (cited per story as "file section"):

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (called raw/04): section 1 Loomio, section 2 WhatsApp, section 10 Doodle, section 14 takeaways.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline, section 8.3 voting UX, section 8.4 approval UX, section 8.8 notifications.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.8 voting and decision log.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (MVP scope) and [design-foundations.md](../../research/design-foundations.md) section 4 (must-have rules for votes and approvals).

## Scope of the epic

In MVP: vote types yes/no/abstain and single choice; quorum and majority per vote; one linked action (a passed vote starts the payment of an expense request); guest voting through a shared link; reminders push then SMS; automatic close; result with outcome statement; no-quorum fallback; automatic and manual decision log entries; append-only amendments.

Not in MVP: ranking, weighted votes, multiple-choice (select several), vote-triggered change of a split rule or wallet rule, secret-ballot cryptography, comments or discussion threads on a vote, voting by SMS reply (open question, see end of file).

## Parameters (configurable, never hard-coded in stories)

No number below is a legal fact or a research finding. Every value is a configuration parameter whose value is to be decided from field interviews.

| Parameter | Meaning | Starting hypothesis |
| --- | --- | --- |
| VOTE_MIN_DURATION / VOTE_MAX_DURATION | Shortest and longest allowed time between opening and deadline | To decide |
| VOTE_DEFAULT_QUORUM_PERCENT | Default quorum as a percent of eligible voters | To decide with the founding group |
| VOTE_DEFAULT_MAJORITY | Default majority rule | More than half of the yes and no votes (abstentions do not count toward yes or no) |
| VOTE_REMINDER_OFFSETS | When reminders go before the deadline | About 24 h, plus about 2 to 3 h for votes linked to money (raw/07 8.3 R-VT7, a hypothesis) |
| VOTE_SMS_WAIT | How long a push may stay unopened before SMS is sent | To decide with the SMS aggregator quote |
| VOTE_DEFAULT_NOQUORUM_FALLBACK | Default for the no-quorum setting | Extend once (see VOT-10) |
| VOTE_MAX_EXTENSIONS | How many times one vote may be extended | To decide |
| VOTE_REOPEN_WINDOW | Time after a no-quorum close during which the creator may reopen | To decide |
| VOTE_GUEST_OTP_EXPIRY / VOTE_GUEST_OTP_MAX_ATTEMPTS | OTP lifetime and attempts for a guest | Follows the ACC OTP rules (single input, six digits, short expiry, resend countdown) |
| VOTE_CACHE_DAYS | How far back the decision log is available offline | To decide |

## Message key convention

UI strings: `vote.<area>.<name>`, `decision.<area>.<name>`. Notifications: `ntf.vote.<name>.push` and `ntf.vote.<name>.sms`. SMS keys must stay GSM-7 and under 160 characters in every language (lint in CI, raw/07 section 4 rules R-SMS1 to R-SMS4). No text is written in this file; stories only name keys.

---

### VOT-01 Ask the group a question with a vote

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who can create votes, I want to write a question, give the options and set a deadline, so that the group can decide without a meeting.

**Conversation:** Async votes with a deadline remove the need to align everyone's schedule (info.md problem 3). The question must be a full sentence and each option must state its consequence, as Loomio and the research advise (raw/07 section 8.3 R-VT1). Only yes/no/abstain and single choice ship in the MVP; ranking and weighted votes are out (competitive-analysis section 7; raw/04 section 14.5). The deadline is shown in absolute and relative time (raw/07 R-VT2). WhatsApp polls have no record, no quorum and no link to money, which is why groups need this (raw/04 section 2). Quorum and majority are set in VOT-02, the money link in VOT-03, sharing in VOT-06. We did not include discussion threads: the chat stays in WhatsApp and Gereo is the record (raw/04 section 14.2).

**Preconditions:** The person is signed in, belongs to the group (or project) and holds Vote: create. The group has at least one eligible voter.
**Trigger:** The person taps "New vote" on the group page, the project page or the decision log.

**Acceptance criteria:**
1. The form asks, in this order: question (required), context (optional free text), type (yes/no/abstain or single choice), options, deadline, who can vote. Yes/no/abstain shows its three fixed options. Single choice needs 2 to N options (N is a parameter), each a short sentence, no duplicates.
2. The deadline is picked as a date and time. Below the field the form shows both forms: `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`. A deadline outside VOTE_MIN_DURATION and VOTE_MAX_DURATION is refused with `vote.error.deadline_range`.
3. Eligible voters default to every member of the group (or project team) who holds Vote: vote. The creator may pick a subset. Members without Vote: vote appear greyed out with the reason `vote.eligible.no_permission`. The eligible list is frozen when the vote opens.
4. A review step shows the whole vote as voters will see it, including the rule in plain words (from VOT-02), before the creator taps `Open the vote`. The button is labelled with the action, not "Next".
5. On open, the vote gets status Open and a reference ID, and appears in the group's vote list. Eligible members receive `ntf.vote.opened.push`; members without the app or who do not open it get SMS `ntf.vote.opened.sms` after VOTE_SMS_WAIT.
6. States: while saving, the button shows a loading state and cannot be tapped twice (no duplicate vote). If the connection drops before opening, the vote is kept as a draft marked `Saved on this phone` and is never opened silently; the creator confirms again when back online. If the save fails, the form keeps every field and shows `vote.error.save_failed` with a Retry button.
7. A draft can be left and resumed. A draft has no ballots, sends no notification and is visible only to its creator.
8. Audit: an audit entry records who created the vote, when, with the eligible list size and the rule, and who opened it.
9. Accessibility and language: every field has a visible label (no placeholder-only labels), touch targets are at least 48 by 48 dp, and the form works at 200% font size and 320 px width. The question and options keep the language the creator typed; fixed labels follow the viewer's language (Malagasy, French, English).

**Data:** Vote, Group or Project, Membership, Audit entry, Notification.
**Depends on:** GRP (membership list and permissions), NTF (push and SMS), XCT (draft and offline behaviour).
**Pages:** to be filled from the information architecture.
**Open questions:** Maximum number of options. Whether a vote may be opened for a project when the project team is smaller than the group (default proposed: the creator chooses between team and whole group).

---

### VOT-02 Set the quorum and the majority, and read them in plain words

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create
**Tags:** audit

**Story:** As a member who creates a vote, I want to set how many people must vote and how many must agree, and see the rule in plain words, so that nobody can argue about the result afterwards.

**Conversation:** Loomio states the agreement rule up front, and quorum is the minimum share of eligible voters who must take part (raw/07 section 8.3 R-VT1 and R-VT3; raw/04 section 1). Loomio only shipped quorum and vote-share settings after 14 years, and real turnout is often 2 to 20%, so strict defaults will block decisions (raw/04 section 14.1 and 14.6). Defaults therefore come from parameters and the creator can change them per vote. Whether a vote linked to money needs a stricter rule is a business rule outside the permission system and is an open question. Vote-triggered rule changes are not in the MVP.

**Preconditions:** The create form (VOT-01) is open.
**Trigger:** The creator opens the "Rule" section of the form.

**Acceptance criteria:**
1. The form shows two settings: quorum (percent of eligible voters, prefilled from VOTE_DEFAULT_QUORUM_PERCENT) and majority rule (prefilled from VOTE_DEFAULT_MAJORITY). Quorum may also be set to "no minimum" with a warning `vote.rule.no_quorum_warning`.
2. Majority choices: for yes/no/abstain, "more than half of the yes and no votes" or "at least a percent set by the creator" (higher than half, up to all). For single choice, "the option with the most votes wins". Abstain counts toward quorum and never toward yes or no.
3. A plain-words summary is built from the settings and the current number of eligible voters, for example key `vote.rule.summary.simple` with the numbers filled in: who must vote, how many agree, what abstain does. It updates live as the creator edits and is shown identically on the review step, the vote page and the decision log.
4. Quorum is also shown as a count, rounded up to a whole person (for example "8 of 15"), never only as a percent.
5. Invalid input is refused with a clear message: quorum above 100% or negative, majority threshold not above half, non-numeric input. The form never saves a rule the summary cannot express.
6. The rule is locked when the first ballot is cast (see VOT-12). Group defaults can change later and never alter a vote already open.
7. If the eligible list changes before the first ballot, the summary and the count are recalculated and the creator sees `vote.rule.recalculated`.
8. Audit: the rule values and the summary text that voters saw are stored with the vote and written to the audit entry at opening.
9. Accessibility and language: the summary is plain text (screen readers read it), never inside an image. Numbers use space grouping and are identical in Malagasy, French and English. Short sentences, one term per concept: "quorum" always has a plain gloss ("minimum number of voters").

**Data:** Vote (rule fields), Group settings (defaults), Audit entry.
**Depends on:** VOT-01, GRP (group defaults).
**Pages:** to be filled from the information architecture.
**Open questions:** Value of the default quorum and majority. Whether "no minimum" is allowed on votes linked to money. Single-choice rule when no option exceeds half: plurality is proposed as default.

---

### VOT-03 Start the payment of an expense when its vote passes

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: create, and the right to see the expense request
**Tags:** audit, ledger

**Story:** As a member who proposes a spending, I want to link a vote to an expense request, so that when the group says yes the payment starts without a second round of approvals.

**Conversation:** This is the one vote-triggered action in the MVP and Gereo's open design space: nothing found combines a vote, a wallet and an approval in one flow (raw/08 section 6.8 "Open opportunities"; competitive-analysis section 5). Decision D4 (founder): a passed vote is the authorisation, so the payment starts without approvers; approvers exist only for spending below the vote threshold. The vote page therefore must show exactly what will be paid (raw/07 section 8.4 R-AP1 and R-AP3; the Bybit lesson in raw/04 section 9 is that people approve what the screen shows). To keep the rule that no single person moves group money, a money vote counts only when at least two distinct people other than the requester voted.

**Preconditions:** An expense request exists in a status that allows a vote (defined in SPD) and has no open vote. The creator holds Vote: create.
**Trigger:** From the expense request, the person taps "Ask the group to vote first". Or, in VOT-01, the person picks "Link to an expense request".

**Acceptance criteria:**
1. When linked, the type is fixed to yes/no/abstain, and the vote page shows the exact amount, payee, source wallet, purpose and attachment of the request, taken live from the request. It does not show the wallet balance to guests (see VOT-06).
2. Only one open vote can be linked to a given expense request. A second attempt is refused with `vote.link.already_open` and a link to the open vote.
3. When the vote closes as Passed with at least two distinct voters other than the requester, the expense request starts its payout through the SPD-10 checks, and the requester receives `ntf.vote.expense_passed.push`. The vote result is shown on the request. The vote itself writes no ledger entry; the payout does.
4. When the vote closes as Not passed, as No quorum or as Cancelled, the request is marked as not approved by vote (status wording owned by SPD) and the requester is notified with `ntf.vote.expense_failed.push`. It can be proposed again as a new request or a new vote.
5. If the amount, payee, wallet or purpose of the request changes while the vote is open, the vote is cancelled automatically, all voters are told `ntf.vote.cancelled.push` with the reason `vote.cancel.request_changed`, and a new vote is required. Earlier ballots do not carry over.
6. If the request is cancelled or withdrawn while the vote is open, the vote is cancelled in the same way.
7. The decision-log entry (VOT-13) shows the request, and later shows "Money moved" with a link to the ledger entry once the payment is Confirmed.
8. Audit: the link, the cancellation reason and the transition of the request are written to the audit log with actor and time. A person who cannot see the request cannot link it.
9. Accessibility and language: the amount reads `12 500 Ar` with no wrap and no clipping at 200% font size, identically in all three languages. The button reads `Open the vote` plus the amount, never a bare "Confirm".

**Data:** Vote, Expense request, Approval, Decision, Ledger entry (read by link), Audit entry.
**Depends on:** VOT-01, VOT-02, VOT-08, VOT-13, SPD (expense request and approval statuses), WAL (ledger entry reference).
**Pages:** to be filled from the information architecture.
**Open questions:** Is a vote mandatory above a threshold (business rule in product logic)? What is the default minimum number of voters for a money vote (proposed: two distinct people other than the requester)? Which request statuses allow a vote (owned by SPD).

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
1. The ballot shows the question, the options with their full sentences, and the line `vote.ballot.can_change` ("You can change your answer until {deadline}"). Choosing an option and tapping `Send my vote` records the ballot in at most two taps.
2. After voting the person sees a confirmation with their answer and the words `Counted`, and the button changes to `Change my vote`. Changing replaces the earlier ballot and keeps the history in the audit log.
3. A person can hold only one current ballot per vote. A second device or a repeated tap never creates a second ballot.
4. If the vote has closed, the ballot is replaced by the result and `vote.ballot.closed`. A request arriving after the close is rejected and nothing is counted.
5. A person not on the eligible list sees `vote.error.not_eligible` and who to ask; a person on the list without Vote: vote sees `vote.error.no_permission` naming the missing permission and who can grant it.
6. States: sending shows `Sending` and disables the button; on failure the ballot is kept and shows `vote.error.send_failed` with Retry; the person can never be left unsure whether the vote counted.
7. Notifications: no notification to others when a person votes (see VOT-17 for visibility). The voter gets no push for their own vote.
8. Audit: every ballot and every change is stored with voter, time, device and previous value. The person can see their own ballot history.
9. Accessibility and language: options are real radio buttons with 48 by 48 dp targets, selected state is shown by icon and text and not only colour, and the whole ballot is usable with a screen reader.

**Data:** Ballot, Vote, Membership, Audit entry.
**Depends on:** VOT-01, ACC (session), GRP (Vote: vote permission), XCT (offline in VOT-18).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the voter may add an optional short reason with the ballot (Loomio allows; not in the MVP by default).

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
1. The top of the page shows the question, the status chip (word and icon), the deadline as `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`, and the rule in plain words from VOT-02.
2. The quorum meter shows a bar with a marker at the threshold and text such as `vote.quorum.progress` ("8 of 15 needed. 5 have voted"). When met, it shows a check and `vote.quorum.met`. After close it explains why a vote did not count (quorum not met versus rejected).
3. The relative time updates in days and hours, and in minutes only during the last hour. It does not tick every second.
4. Participation is live while the page is open and the connection is fine: it refreshes at an interval set by a parameter, on pull-to-refresh and on return to the page. The page shows `Updating...` while refreshing and never blocks the screen with a full-page loader.
5. Option tallies are shown to a voter once they have cast a ballot, and to everyone after close (default, see VOT-17 open question). Before that the page shows participation only.
6. Offline or slow connection: the page loads from cache with a `Last synced` time and the quorum numbers are marked as possibly out of date. Casting stays available under the VOT-18 rules.
7. Loading shows a skeleton of the final layout. A vote the person cannot see returns `vote.error.not_visible` with who can grant access (never a bare "Not allowed").
8. Audit: none for reading; no read is logged.
9. Accessibility and language: the quorum is never conveyed by colour alone, the meter has a text equivalent that screen readers announce, and the layout reflows at 320 px without horizontal scroll.

**Data:** Vote, Ballot (counts only), Membership.
**Depends on:** VOT-01, VOT-02, VOT-04, XCT (last synced banner, quorum meter component).
**Pages:** to be filled from the information architecture.
**Open questions:** Should interim option tallies be visible to everyone while the vote is open (more transparent, more social pressure)? Default proposed: visible after you have voted.

---

### VOT-06 Share a vote link so someone can vote without a full account

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Guest voter
**Permission needed:** none for the guest; Vote: create (or Vote: view with share rights, to be confirmed) for the person sharing
**Tags:** sms, audit

**Story:** When a member of my group is on a basic phone and has not registered, I want to send them a link and have them vote with only their phone number and a code, so I can reach the whole group without asking them to install anything.

**Conversation:** "Another platform to sign in and register for" killed Loomio participation at Chi Hack Night, and Doodle shows that link-based answers with no account are what let a poll leave the app and work (raw/04 section 1, section 10 and section 14.2). Gereo must be the record that WhatsApp links into (competitive-analysis section 7). Conventions say voting needs only phone and OTP. Tricount's lesson is that a link must not equal full rights (raw/08 section 6.11 "Avoid"). We decided the link is not a credential: the verified phone number is, and it must match the eligible list. Text-only share message, not an image, because the design rules forbid text inside images (design-foundations section 4).

**Preconditions:** The vote is Open. The guest's phone number is on the eligible list (as a member invited by phone, or as a member who has not completed registration).
**Trigger:** The creator taps "Share" on the vote; the guest taps the link in WhatsApp, SMS or a browser.

**Acceptance criteria:**
1. "Share" opens the phone's share sheet with a ready message (key `vote.share.message`: question, deadline, link). It also offers "Copy link". The link carries an unguessable vote token and stops accepting ballots at close.
2. Before verification the page shows only the group name and closing time. The question and options appear only after the guest's number is verified as eligible.
3. Verification: the guest enters a phone number and a one-time code by SMS (single input, autofill and paste allowed, expiry VOTE_GUEST_OTP_EXPIRY, attempts limited to VOTE_GUEST_OTP_MAX_ATTEMPTS, resend countdown). No PIN, no profile, no identity check is asked.
4. One vote per person: the ballot is tied to the verified phone number. Opening the link on a second phone or verifying again shows the existing ballot, never a second one. A number not on the list sees `vote.guest.not_on_list` with the creator's name to ask.
5. After verification the guest can: read the question, context and options; see the deadline, the rule and quorum progress; vote and change the vote until close; see the result and outcome statement after close. For a vote linked to an expense the guest sees purpose, amount, payee and source wallet name, and never a balance.
6. The guest cannot see or do: the group ledger or any balance, the member list, other votes, the decision log, other projects, vote creation, comments. After voting the page offers an optional "Create an account" and never requires it. If the guest later registers with the same number, their ballots are attached to the new account.
7. The page is light for slow connections and basic browsers (within the route weight budget in design-foundations section 4), with a visible language switch (Malagasy, French, English) and a clear error when the link has expired or the vote is closed (`vote.guest.closed` plus the result when public to eligible voters).
8. Errors: wrong or expired code shows `vote.guest.otp_wrong` with Resend; too many attempts shows a lock message and when to retry; nothing counts until the ballot is confirmed on screen.
9. Audit and privacy: the audit entry records the masked phone number (not the full number in the UI), time, device and the share link token used. Rate limiting applies per number and per token.

**Data:** Vote, Ballot, Phone verification, Membership (invited, not registered), Audit entry.
**Depends on:** VOT-01, VOT-04, ACC (phone and OTP service), GRP (invite by phone), NTF (SMS OTP template), XCT (low data, language).
**Pages:** to be filled from the information architecture.
**Open questions:** Does a guest session create a light account (phone-verified) or stay ephemeral? Default proposed: ephemeral. May the question be visible before verification so that the forwarded link works as a preview? Default proposed: no. Can a non-member be added as an eligible voter by phone (for example a guest of the group)? Not assumed. Voting by SMS reply for people with no data at all: see open questions at the end.

---

### VOT-07 Remind people who have not voted: push, then SMS

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (automatic); a manual extra reminder needs Vote: edit
**Tags:** sms, audit

**Story:** When the deadline is getting close and some eligible people have not voted, I want Gereo to remind exactly those people, first by push and then by SMS if they did not see it, so I do not have to phone everybody.

**Conversation:** Reminders are the proven lever for turnout and replace the manual calling in info.md problem 6 and 3. Research suggests one reminder about 24 h before the close and one in the last hours for money decisions, no more (raw/07 section 8.3 R-VT7, a hypothesis; Karlan et al. found extra late reminders did not add). The cadence is therefore a parameter. SMS must be rationed because it is costly (about USD 0.59 per segment on a global CPaaS, local rate not verified; raw/04 section 14.6 risk 3). Reminders must never shame: counts in the group channel, the names only where the setting allows (raw/07 R-NT8).

**Preconditions:** The vote is Open. At least one eligible person has no ballot.
**Trigger:** Each time in VOTE_REMINDER_OFFSETS before the deadline.

**Acceptance criteria:**
1. At each offset the system sends `ntf.vote.reminder.push` to every eligible person without a ballot. Votes linked to money use the extra late offset.
2. If a person has not opened the push within VOTE_SMS_WAIT, or has no registered device, the system sends `ntf.vote.reminder.sms`. A person who has already voted, or who opened the push and voted, gets nothing.
3. Guests (VOT-06) who are on the eligible list receive the SMS with the link; they cannot receive push.
4. The reminder never says who voted or how; it says the question, the closing time in absolute and relative form, and the link. SMS stays within one GSM-7 segment (160 characters) in each language and ends with the vote reference.
5. Quiet hours apply to push; a reminder falling in quiet hours is sent when they end if the vote is still open. SMS follows the quiet-hours rule defined in NTF.
6. A total cap of reminders per vote and per person applies (parameter). The creator may trigger one extra manual reminder, limited by time, with the number of people it will reach shown before sending.
7. States: if SMS delivery fails, the status of the attempt (sent, delivered, failed) is stored and visible to the vote creator as a count (for example `3 reminders not delivered`), without exposing names beyond what VOT-17 allows.
8. Audit: every reminder, channel, time and delivery result is stored. SMS volume is counted against the group's SMS budget (see open question).
9. Language: each person gets the reminder in their preferred language. Message keys are linted for accents that would push an SMS to 70 characters per segment.

**Data:** Notification, Device, Ballot, Vote, Audit entry.
**Depends on:** VOT-01, NTF (push, SMS, quiet hours, delivery status, SMS budget), ACC (language preference).
**Pages:** to be filled from the information architecture.
**Open questions:** Who pays for SMS (platform, group allowance, per-SMS charge)? Exact offsets. Whether people can opt out of the SMS reminder for votes.

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
1. At the deadline the system closes the vote within a short tolerance defined by a parameter. From that moment no new or changed ballot is accepted.
2. "Close now" shows a confirmation sheet with current participation, whether quorum is met and what the result would be, and a button labelled `Close the vote now`. It is available only to holders of Vote: close.
3. Closing early with quorum not reached closes the vote as Not passed (quorum not met) and warns first with `vote.close.early_no_quorum`. The no-quorum fallback of VOT-10 applies only at the deadline.
4. On close, the system computes the result using the stored rule (VOT-09), changes the status, and triggers the decision-log entry (VOT-13) and any linked action (VOT-03).
5. A closed vote is read-only. A ballot received after the close is rejected with `vote.error.closed` and, for queued ballots, the message in VOT-18.
6. Notifications: every eligible person and every guest with a number receives the result: `ntf.vote.closed_passed.push`, `ntf.vote.closed_failed.push` or `ntf.vote.closed_noquorum.push`, with SMS fallback `ntf.vote.closed.sms` for people who do not open the push.
7. States: while the system computes the close, the vote shows `Closing`. If the close job fails, the vote shows `Needs attention` to the creator and holders of Vote: close, the operator is alerted, and the vote still accepts no ballots after the deadline.
8. Audit: the closing mode (deadline or manual), the actor, the exact time and the final counts are written to the audit log. A manual close is attributable to a person.
9. Accessibility and language: the time shown in confirmations is absolute and relative, and the confirm button is not the default focus.

**Data:** Vote, Ballot, Decision, Audit entry, Notification.
**Depends on:** VOT-04, VOT-09, VOT-10, VOT-13, NTF (result notifications), OPS (job failure alert).
**Pages:** to be filled from the information architecture.
**Open questions:** Close automatically as soon as every eligible person has voted? Default proposed: no.

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
1. The result is computed from the stored rule and shown as one of: Passed, Not passed (majority not reached), Not passed (quorum not met), Tie, Cancelled. Each has a word, an icon and a colour, never colour alone.
2. An automatic outcome sentence is generated from message keys (`vote.outcome.passed`, `vote.outcome.rejected`, `vote.outcome.noquorum`, `vote.outcome.tie`) with the counts filled in, for example "5 yes, 1 no, quorum not reached: 5 of 8 needed". It shows facts, not blame.
3. Counts and, where the ballot is named (VOT-17), names are shown as the setting stated before voting. Percentages never replace counts.
4. The vote creator or a holder of Vote: close can add, after the close, a written outcome with a next step: what, who is responsible and by when, and an optional review date. Added text is appended with author and time and is not an edit of the automatic sentence.
5. If a review date is set, the system notifies the owner and the group on that date with `ntf.vote.review_due.push` and links back to the decision.
6. If the vote was linked to an expense, the result page shows what happened to the request and a link to it (VOT-03).
7. States: while the result is computed the page shows a loading state; offline it shows the cached result with `Last synced`.
8. Audit: the outcome text, its author and time are stored and shown in the decision log.
9. Accessibility and language: the outcome sentence is plain text, translated per key, and fits at 200% font size.

**Data:** Vote, Decision, Audit entry, Notification.
**Depends on:** VOT-08, VOT-13, VOT-03, NTF (review reminder).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the next step must be filled before the decision is considered complete (default proposed: no, only prompted).

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
1. The form offers three choices, prefilled from VOTE_DEFAULT_NOQUORUM_FALLBACK: (a) extend once by a duration the creator picks; (b) close as Not passed and let the creator reopen within VOTE_REOPEN_WINDOW; (c) close as Not passed with no reopen. The choice is explained in one plain sentence each (`vote.fallback.extend`, `vote.fallback.reopen`, `vote.fallback.close`).
2. For (a), when the deadline arrives without quorum the system extends the deadline by the chosen duration (at most VOTE_MAX_EXTENSIONS), notifies every eligible person who has not voted with `ntf.vote.extended.push` and SMS fallback, and shows the new deadline in absolute and relative form. If quorum is still not met after the last extension the vote closes as Not passed (quorum not met).
3. For (b), the vote closes as Not passed (quorum not met), the creator and holders of Vote: close are notified, and a `Reopen` action is available until the window ends. Reopening keeps all ballots, sets a new deadline within the duration limits and notifies eligible voters. After the window the vote stays closed.
4. A vote that reaches quorum is never affected by the fallback.
5. The setting is shown to voters before voting with the rest of the rule (`vote.rule.summary` includes it) and is locked at the first ballot.
6. Each extension and reopening is a visible, logged action (who, when, from which deadline to which) and appears in the decision-log history.
7. A closed-as-no-quorum vote always creates a decision-log entry (VOT-13) so the failed attempt is on the record, and a later reopened vote links to it.
8. Errors: reopening after the window or beyond limits is refused with `vote.error.reopen_expired`.
9. Accessibility and language: choices are radio buttons with visible descriptions, and the dialog states consequences in plain words.

**Data:** Vote (fallback setting), Decision, Audit entry, Notification.
**Depends on:** VOT-01, VOT-02, VOT-08, VOT-13, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** The default (extend once, proposed) and whether votes linked to money must use a different default. Whether a reopened vote keeps its original reference or gets a new one.

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
1. The result is Tie and states which options tied and with how many votes each (`vote.outcome.tie`).
2. No option is chosen automatically and no person has a casting vote.
3. The result page offers the vote creator and holders of Vote: close a "Start a runoff vote" action which opens VOT-01 prefilled with only the tied options, the same eligible voters and rule, and a new deadline to be set.
4. The runoff links back to the original vote and the decision-log entry shows both.
5. A yes/no vote where yes and no are equal under "more than half" closes as Not passed (majority not reached), not as Tie, and the outcome sentence says so.
6. A tie on a vote linked to money cannot occur (yes/no only), and the linked expense follows VOT-03 for Not passed.
7. Notifications: result notification uses `ntf.vote.closed_tie.push` and the SMS fallback with the runoff invitation sent when the runoff opens.
8. Audit: tie result, runoff creation and the link between the two votes are written to the audit log.
9. Accessibility and language: the tie explanation is plain text and reads correctly with 2 or more tied options.

**Data:** Vote, Ballot, Decision, Audit entry.
**Depends on:** VOT-01, VOT-08, VOT-09, VOT-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the group should be allowed to set a tie-break rule in advance (for example the earlier-listed option wins). Default proposed: no.

---

### VOT-12 Edit or cancel a vote before the first ballot

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Vote: edit (edit and extend), Vote: close (cancel after ballots)
**Tags:** audit

**Story:** As the member who created a vote, I want to fix a mistake or cancel the vote before anyone has voted, so that a typo does not force the group to vote twice.

**Conversation:** The research says never edit a vote after the first ballot without notifying and resetting votes (raw/07 section 8.3 R-VT9, an unverified rule) and Loomio supports edit and withdraw before the first vote (raw/04 section 14.3). We decided text, options, eligible list and rule are locked at the first ballot. Extending the deadline is allowed afterwards because organisers can extend (raw/07 section 8.3), but only as a visible, logged action.

**Preconditions:** The vote is Open or Draft and the person holds Vote: edit.
**Trigger:** The person taps "Edit" or "Cancel vote" on the vote.

**Acceptance criteria:**
1. While there are zero ballots, the creator can edit question, context, options, deadline, eligible voters and rule. A saved edit updates the vote immediately and eligible voters are notified only if they had already been told (`ntf.vote.updated.push`).
2. From the first ballot on, question, context, options, eligible list and rule are locked and the Edit screen says why (`vote.edit.locked`).
3. After the first ballot, the deadline may be extended (not shortened) with a mandatory reason, which notifies every eligible person who has not voted and appears in the vote history. Extensions count toward VOTE_MAX_EXTENSIONS.
4. Cancelling with zero ballots needs a confirmation and removes the vote from the list with an audit entry; it creates no decision-log entry.
5. Cancelling after ballots exists needs Vote: close, a mandatory reason chosen from presets plus free text, and sends `ntf.vote.cancelled.push` with the reason. Ballots are kept in the audit log, the vote shows Cancelled, and a decision-log entry records the cancellation (VOT-13).
6. If a vote linked to an expense is cancelled, VOT-03 applies to the request.
7. Errors: two people editing at once get the latest saved version and a message `vote.edit.conflict` showing what changed (no silent overwrite).
8. Offline: edits are blocked with an explanation, not queued, because they change what voters see.
9. Audit: every edit stores before and after values, actor and time; cancellations store the reason.

**Data:** Vote, Audit entry, Notification, Decision.
**Depends on:** VOT-01, VOT-03, VOT-13, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether adding an eligible voter after opening (a member who joined late) is allowed before the first ballot only or at any time (default proposed: before the first ballot, logged).

---

### VOT-13 Record every closed vote in the decision log, linked to the money it moved

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (automatic); viewing needs Vote: view
**Tags:** audit, ledger

**Story:** When a vote closes, I want the decision to be written to the log by itself, with the vote and any payment it led to attached, so I can later answer "what was decided, why and what happened because of it" without searching a chat.

**Conversation:** Decisions in meetings are almost always forgotten or vague (info.md problem 2). The decision trail is the single strongest value cited by Loomio users (raw/04 section 1 and section 14.1 "value is the trail, not the click"). No product found links the decision to the ledger entry it triggered (raw/08 section 6.8 "Open opportunities"; competitive-analysis section 5). The entry must hold the question, options, result, quorum status, proposer, date, outcome with next steps and links to the ledger entries the decision triggered (raw/07 R-VT6).

**Preconditions:** A vote closes with any result, or is cancelled after at least one ballot.
**Trigger:** VOT-08 closing, or VOT-12 cancellation after ballots.

**Acceptance criteria:**
1. At close the system creates exactly one decision entry holding: question, context, options, result with counts, quorum status, the rule in words, proposer, close date, ballot visibility mode, and a link to the vote.
2. Passed, Not passed, No quorum, Tie and Cancelled-after-ballots are all logged. A vote cancelled before the first ballot is not logged as a decision.
3. If the vote was linked to an expense request, the entry links to the request. When the resulting payment reaches Confirmed in the ledger, the system appends a "Money moved" link with the ledger entry reference and amount to the decision entry; if the payment fails or is cancelled the system appends that status instead.
4. The entry belongs to the project when the vote belongs to a project, and to the group otherwise. A project decision also appears in the group log.
5. The entry is append-only: the system never edits earlier fields. Later additions (outcome statement, review date, money links, reopen links, amendments) are appended with author, time and source.
6. If a vote is reopened (VOT-10) or a runoff is started (VOT-11), the new entry links to the earlier one and both stay visible.
7. States: if the log write fails, the vote remains closed, the creator and the operator are alerted, and the system retries until it succeeds; no closed vote is ever without an entry (reconciliation check owned by OPS).
8. Notifications: members with access receive the result as in VOT-08; the decision entry itself adds `ntf.decision.recorded.push` only for project owners who have followed the project (no extra spam).
9. Audit and ledger: each append is an audit entry; the money link is a read-only reference to a ledger entry, and the decision never writes to the ledger itself.

**Data:** Decision, Vote, Expense request, Ledger entry (reference), Audit entry.
**Depends on:** VOT-08, VOT-09, VOT-12, VOT-03, SPD, WAL (ledger entry reference), OPS (reconciliation check), PRJ (project decision views).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the log stores the anonymous ballot-to-voter link (see VOT-17). Whether members who were not eligible can see the entry (default proposed: yes, if they can view the group or project).

---

### VOT-14 Record a decision that was taken outside the app

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: edit (project decisions) or Group: edit group (group decisions), to confirm
**Tags:** audit, offline

**Story:** As a member who attended a meeting, I want to write down what was decided and who is responsible, so that decisions taken in a room or on the phone are not lost.

**Conversation:** Groups keep deciding in meetings and calls, and those decisions are the ones forgotten (info.md problem 2). Every important decision must be linked to a vote or to an identified person (info.md, Projects rule). Open question on which permission governs this entry because "Decision" is not an object in the permission table. Manual entries must be visibly different from vote results so nobody mistakes them for a counted vote.

**Preconditions:** The person can add a decision to the group or project.
**Trigger:** The person taps "Record a decision" on the decision log or project page.

**Acceptance criteria:**
1. The form asks: what was decided (required), context (optional), date taken (required, not in the future, not older than a parameter), where it was taken (list: meeting, phone call, chat, other), who took it (pick members, or free-text names for people not in the group), and the responsible person (required, a member).
2. The entry is stored with the badge `decision.manual.badge` ("Recorded by {name}, not a vote") and never shows vote counts or a result chip.
3. One file may be attached (photo of minutes) under the PRJ-07 attachment rules.
4. A manual entry may be linked to a project and to an existing vote or expense request. If linked to a vote, the vote result stays separate and unchanged.
5. Saving notifies members who can view the log with `ntf.decision.recorded.push` (summary only: title and responsible person).
6. Offline: the entry is saved on the phone with the state `Waiting to send`, sent when the connection returns, and the date taken remains as typed. A conflict never overwrites another entry.
7. Errors: missing responsible person or invalid date shows an inline message and keeps all other fields.
8. Audit: the author, time, device and all fields are stored. The author is shown to everyone who sees the entry.
9. Accessibility and language: the person picker is searchable and keyboard-usable, and fixed labels follow the viewer's language while the typed text keeps its language.

**Data:** Decision, Document, Membership, Audit entry.
**Depends on:** VOT-13, PRJ-07, GRP, XCT (offline queue).
**Pages:** to be filled from the information architecture.
**Open questions:** The exact permission for manual entries. Whether a manual decision can be backdated before the member joined the group.

---

### VOT-15 Correct or replace a decision without erasing the original

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** same as VOT-14
**Tags:** audit

**Story:** As a member who spots a wrong or outdated decision entry, I want to amend or supersede it with a visible note, so that the record stays honest and nothing is rewritten.

**Conversation:** Audit log and no deletion of decisions, append-only with amendments, is a table-stakes item (raw/04 section 14.3). The same principle as the ledger: correct with a new record, never edit (conventions, section 2). Votes' counts are never amendable; only context and outcome fields are.

**Preconditions:** A decision entry exists and the person can edit decisions.
**Trigger:** The person taps "Amend" or "Replace this decision" on the entry.

**Acceptance criteria:**
1. "Amend" adds an amendment that carries a mandatory reason, the new text and the author. The original text, counts and attachments remain visible in a history chain on the entry.
2. The entry shows an `Amended` chip and the latest text first, with "Show original" one tap away.
3. Vote counts, result, quorum status and the rule words are locked and cannot be amended; the Amend form does not offer them.
4. "Replace this decision" creates a new decision (manual or from a new vote) that links back with `Supersedes {title}`; the old entry shows `Superseded by` with a link and stays readable.
5. Notifications: members who voted or are the responsible person receive `ntf.decision.amended.push`, summary only.
6. An amendment can be made only once per minute per entry to prevent accidental duplicates, and a duplicate amendment shows `decision.error.duplicate`.
7. Offline: amendments queue as `Waiting to send` and sync in order of creation; a conflict shows both versions ("Your change versus Fanja's change").
8. Audit: the amendment, reason, author and time are written to the audit log, and no earlier record is modified or deleted. There is no delete action on a decision.
9. Accessibility and language: history is a plain list readable by screen readers, with absolute dates.

**Data:** Decision (append records), Audit entry, Notification.
**Depends on:** VOT-13, VOT-14, XCT (offline queue).
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

**Conversation:** A searchable archive with export is what Loomio adds beyond the poll itself (raw/08 section 6.8 "Adopt"; raw/04 section 1). The log is screen 22 in the MVP wireframe list (design-foundations section 5). Groups use the log at meetings, often on weak connections, so it must read offline (conventions section 2).

**Preconditions:** The person can view the group or project.
**Trigger:** The person opens "Decisions" from the group or project page.

**Acceptance criteria:**
1. The list is newest first. Each row shows: question or title, result chip (word, icon, colour), date, proposer or responsible person, and a "Money moved" or "Manual" marker.
2. The person can filter by project, result (Passed, Not passed, No quorum, Tie, Cancelled, Manual, Amended), date range and group or project scope.
3. Free-text search covers title, question, context, outcome statement and option text, and shows the matching words. Search with no match shows an empty state with a clear action (`decision.search.empty`).
4. The group log includes project decisions and says which project each belongs to; a project log shows only its own.
5. Opening a row shows the full entry, the history chain, the linked vote, expense request and ledger entry, and attachments the person is allowed to see.
6. Empty state: a group with no decisions sees `decision.list.empty` and a button to open a vote or record a decision, depending on permissions.
7. Offline: entries from the last VOTE_CACHE_DAYS are available with a `Last synced` time, search works on cached entries, and the page says that older entries need a connection (without using the word "offline").
8. Loading shows skeleton rows; a slow connection loads the first page quickly and the rest on scroll with a visible count.
9. Accessibility and language: the list is readable by a screen reader row by row, filters have text labels, and searching Malagasy and French text handles accents (a search for "e" matches "ê" and "é").

**Data:** Decision, Vote, Project, Expense request, Ledger entry (reference), Document.
**Depends on:** VOT-13, VOT-14, VOT-15, XCT (offline cache, last synced), PRJ (project scope).
**Pages:** to be filled from the information architecture.
**Open questions:** Export of the log as CSV and PDF (priority P2 proposed, same component as the ledger export, owned by WAL).

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
1. The form offers two options: Anonymous (only totals are shown; nobody sees who voted what) and Named (members see each person's answer). The default is Anonymous, chosen as a parameter, and the choice is explained in one sentence each (`vote.visibility.anonymous`, `vote.visibility.named`).
2. The choice is shown on the ballot page before the person votes, and again on the result page. It is locked at the first ballot.
3. In both modes, everyone sees participation counts. In Anonymous mode, only the creator and holders of Vote: close see the list of people who have not voted yet (to chase them privately), never any answers. In Named mode, every member with Vote: view sees names and answers.
4. Guests (VOT-06) follow the same mode: their answer is shown with a display name from their membership in Named mode, or hidden in Anonymous mode.
5. For a vote linked to an expense, the mode is shown next to the amount; whether it can be Anonymous is an open question and the default is configurable.
6. The decision-log entry stores the mode, and in Anonymous mode shows totals only.
7. Reminders and notifications never mention who voted what in either mode.
8. Audit: in Anonymous mode, the system stores one ballot per voter for integrity (one vote per person) but exposes no answer-to-person view in the interface, and the creator cannot export one. Whether the stored link is permanent is an open question.
9. Accessibility and language: the privacy explanation is plain, in three languages, and appears as text with an icon, not only an icon.

**Data:** Vote (visibility setting), Ballot, Audit entry.
**Depends on:** VOT-01, VOT-04, VOT-05, VOT-13.
**Pages:** to be filled from the information architecture.
**Open questions:** The default (Anonymous proposed). Must money-linked votes be Named for accountability? Do operators or auditors ever see the answer-to-person link, and for how long? Is the list of non-voters visible to the creator a shaming risk (see raw/07 R-NT8)?

---

### VOT-18 Vote when the connection is poor and see the ballot's state

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: vote
**Tags:** offline, audit

**Story:** When I have no data or a bad connection and a vote is about to close, I want to cast my vote on the phone and see clearly whether it was sent and counted, so I am never unsure about my vote.

**Conversation:** Votes and drafts queue with a visible state while money-out stays online only (design-foundations section 4; conventions section 2). Per-item states `Saved on this phone`, `Waiting to send`, `Sent`, `Confirmed`; queue size and age visible; the ledger is server-authoritative; a vote queued offline carries a client timestamp and device ID and the server records receipt time; a late ballot shows "Too late: voting closed 17:00, your answer arrived 17:04" (raw/07 section 4 R-O1 to R-O5). We decided the server's receipt time decides whether a ballot counts. A grace window for ballots cast before the deadline but received after it is an open question.

**Preconditions:** The vote page was loaded at least once on this device and the vote is Open on the cached copy.
**Trigger:** The person taps `Send my vote` without a working connection.

**Acceptance criteria:**
1. The ballot is stored on the phone and shown as `Saved on this phone`, then `Waiting to send`. The screen says `vote.offline.not_counted` ("Not counted yet. Connect before {deadline}"), with the deadline in absolute and relative form.
2. When the connection returns, the app sends the ballot automatically with exponential backoff and a retry cap, and the state moves to `Sent` and then `Counted` when the server confirms. A `Retry now` button is always available.
3. A single header indicator shows the sync state (`Updated 14:05`, `Updating...`, or `Not updated since yesterday - Retry`), and a counter shows items waiting and their age (`1 item waiting since Mon`).
4. If the server receives the ballot after the deadline it is rejected, and the person sees `vote.offline.too_late` with both times (voting closed, answer arrived). Nothing is counted and the ballot is shown as `Too late`.
5. If the person changes the ballot again before sync, only the latest ballot is sent. If a ballot sent from another device has a later client time, the later one wins and the screen shows the final state, never two states.
6. The person can cancel a ballot that is still `Waiting to send` before it syncs, with the state changing to `Not sent`.
7. The stored ballot carries client timestamp and device ID, and the server stores receipt time. Both are in the audit entry (client time is informational and is never what decides).
8. The vote page offline shows cached question, rule and last-known participation with a `Last synced` time; options and the rule come from the version the person saw.
9. Accessibility and language: every state has text, an icon and a colour. The deadline warning is announced to screen readers.

**Data:** Ballot (queued), Vote (cache), Device, Audit entry.
**Depends on:** VOT-04, XCT (offline queue, last synced banner, retry), ACC (device ID).
**Pages:** to be filled from the information architecture.
**Open questions:** A grace window for ballots with a client time before the deadline. Whether a vote-by-SMS fallback is added (below).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| VOT-01 | Ask the group a question with a vote | P0 | GRP, NTF, XCT |
| VOT-02 | Set the quorum and the majority, and read them in plain words | P0 | VOT-01, GRP |
| VOT-03 | Start the payment of an expense when its vote passes | P0 | VOT-01, VOT-02, VOT-08, VOT-13, SPD, WAL |
| VOT-04 | Cast my vote and change it until the vote closes | P0 | VOT-01, ACC, GRP |
| VOT-05 | See where the vote stands: deadline, rule, quorum and participation | P0 | VOT-01, VOT-02, VOT-04, XCT |
| VOT-06 | Share a vote link so someone can vote without a full account | P0 | VOT-01, VOT-04, ACC, GRP, NTF |
| VOT-07 | Remind people who have not voted: push, then SMS | P0 | VOT-01, NTF, ACC |
| VOT-08 | Close the vote at the deadline, or close it early | P0 | VOT-04, VOT-09, VOT-10, VOT-13, NTF, OPS |
| VOT-09 | Read the result with a clear outcome and a next step | P0 | VOT-08, VOT-13, VOT-03, NTF |
| VOT-10 | Decide what happens when too few people vote | P0 | VOT-01, VOT-02, VOT-08, VOT-13 |
| VOT-11 | Handle a tie with a clear rule | P1 | VOT-01, VOT-08, VOT-09, VOT-13 |
| VOT-12 | Edit or cancel a vote before the first ballot | P1 | VOT-01, VOT-03, VOT-13 |
| VOT-13 | Record every closed vote in the decision log, linked to the money it moved | P0 | VOT-08, VOT-09, VOT-12, VOT-03, SPD, WAL, OPS |
| VOT-14 | Record a decision that was taken outside the app | P1 | VOT-13, PRJ-07, GRP, XCT |
| VOT-15 | Correct or replace a decision without erasing the original | P1 | VOT-13, VOT-14, XCT |
| VOT-16 | Find past decisions in the decision log | P0 | VOT-13, VOT-14, VOT-15, XCT, PRJ |
| VOT-17 | Choose whether ballots are named or anonymous | P1 | VOT-01, VOT-04, VOT-05, VOT-13 |
| VOT-18 | Vote when the connection is poor and see the ballot's state | P0 | VOT-04, XCT, ACC |

Count: 18 stories. P0: 13 (VOT-01 to VOT-10, VOT-13, VOT-16, VOT-18). P1: 5 (VOT-11, VOT-12, VOT-14, VOT-15, VOT-17). P2: 0.

## Cross-epic dependencies

At the time of writing the other epic files do not exist. Names below are the binding reference; IDs are to be reconciled when those files are written.

- ACC: phone and OTP sign-up and sessions; light phone verification reused for guests (VOT-06); language preference per person (VOT-07); device ID (VOT-18).
- GRP: membership list, invite by phone for people without full accounts, permission bundles containing the Vote permissions, "Effective access" panel, group-level defaults for quorum and fallback, audit log of permission changes.
- SPD: create expense request, approval screen and statuses, "awaiting approval" and "not approved by vote" wording, payout that references the decision (VOT-03, VOT-13).
- WAL: ledger entry reference and detail page that links back to the decision (VOT-13), ledger export component reused by the decision log export.
- RUL: no dependency in the MVP; vote-triggered rule changes are explicitly out and appear as a later story.
- CON: no dependency in the MVP; a material change of a contribution plan needing a vote is out of scope for v1.
- NTF: push and SMS templates for every `ntf.vote.*` and `ntf.decision.*` key, quiet hours, push-then-SMS wait, delivery status, SMS budget (VOT-07), GSM-7 lint.
- XCT: offline queue and states, `Last synced` banner, quorum meter component, status chip, language switch, low-data route budget (VOT-06), accessibility.
- OPS: alert when a close job or decision-log write fails (VOT-08, VOT-13), reconciliation check that every closed vote has a decision entry, support for disputed votes.
- PRJ: project page lists decisions (PRJ-05); attachments (PRJ-07) used by VOT-14.

## Open questions

1. Closed by decision D4: a passing vote is the authorisation and replaces approvers above the vote threshold. Default minimum of two distinct voters other than the requester, to confirm.
2. Default quorum, default majority and default no-quorum fallback (VOT-02, VOT-10): to decide from field interviews with the founding group and two outside groups.
3. Named versus anonymous ballots, and the default (VOT-17): the proposed default is Anonymous; money-linked votes may need Named.
4. Does the system keep a permanent answer-to-person link in Anonymous mode, and who may see it (VOT-17)?
5. Interim tallies while the vote is open: visible to everyone, only after you vote (proposed), or hidden until close (VOT-05)?
6. Guest voting: ephemeral session or light account; whether the question is visible before verification; whether non-members can ever be eligible by phone (VOT-06).
7. Voting by SMS reply (for example "reply 1 for yes") for people with no data: not in the MVP; needs inbound SMS from the aggregator and a security review. Priority P2 if confirmed.
8. Who pays for SMS reminders and guest OTPs, and the monthly cap per group (VOT-07, NTF).
9. Late ballots: strictly server receipt time, or a grace window for ballots cast before the deadline (VOT-18).
10. Which permission governs manual decision entries and amendments, since "Decision" is not an object in the permission table (VOT-14, VOT-15).
11. Members who leave or are removed during a vote: does their ballot stay counted and does the quorum denominator change? Members who join late: can they be added? (VOT-01, VOT-12).
12. Close automatically when everyone has voted (VOT-08).
13. Whether the group's SMS and the vote's use of phone numbers require explicit consent text under Malagasy data-protection rules (not researched; legal review).
