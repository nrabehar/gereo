# EVT: Events and reminders

Epic code: EVT. Release: MVP. Journey steps: 7 Follow (organise and remind). Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file:

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 0 market context (SMS reach), section 12 (event no-show benchmarks and the lack of reliable reminder effect sizes), section 14.3 and 14.6 (SMS cost risk).
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline and SMS rules, section 8.7 events and RSVP, section 8.8 notifications and reminders.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.10 events.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Events: RSVP and reminders push then SMS, no calendar sync) and [design-foundations.md](../../research/design-foundations.md) section 3 principle 7 (SMS is a first-class channel).

## Scope of the epic

In MVP: single and recurring events; invite members or the whole group; RSVP going, maybe, no in one tap with a visible count; automatic reminders (default 24 h and 2 h) by push then SMS if not opened; edit and cancel with notification; a named host; event list and calendar view; link an event to a project; light personal dates to remember and notes; export to the phone calendar (P2, one-way).

Not in MVP: two-way calendar sync, payment attached to an event or RSVP (closed, see open question 6), agenda and attendance records tied to fines (Chamasoft; raw/08 section 6.10), public events, ticketing, guest RSVP by link without an account (closed as Later, open question 5), proposing an event for approval (closed, open question 7), reopening a cancelled event (closed, open question 8).

Founder decisions D1 to D5 do not apply to this epic: an event never moves money, creates no ledger entry and needs no approval. The permissions used are the catalogue names Event: view, create, edit and invite (conventions section 7); decision D2 added none for events. Being the host of an event gives no permission: every action is gated by the permission only.

The time zone is Madagascar time only (XCT-03). The Events module is on for every group, there is no module switch (GRP-18).

## Parameters

Every value is a configuration parameter. No number is a research finding: raw/04 section 12 found no reliable published effect size for reminders, so no story promises a reduction in no-shows. This epic owns only the scheduling parameters below. Every SMS wait, SMS cap, quiet-hours and allowance value belongs to NTF (`ntf.*`): the push-then-SMS wait is `ntf.sms_window.<type or class>` (30 minutes for the 2-hour reminder, 240 for the 24-hour reminder), the per-person cap is `ntf.sms_daily_cap_per_person`, the group allowance is `ntf.group_sms_allowance` and the quiet window is `ntf.quiet_hours_default`. EVT never defines its own wait or cap.

| Parameter | Meaning | Starting value |
| --- | --- | --- |
| EVENT_REMINDER_PRESETS | The only reminder offsets a host can choose | 1 week, 3 days, 24 h, 2 h. Only the 24 h and 2 h offsets can be followed by SMS (they have an NTF window); the others are push and in-app only |
| EVENT_REMINDER_DEFAULTS | Offsets every new event starts with | 24 h and 2 h (raw/07 R-EV3, a hypothesis to test) |
| EVENT_MAX_REMINDERS | Most reminders one event can carry | 3, because Karlan's studies show extra late reminders add nothing (raw/07 section 8.8) and NTF-05 allows one SMS per reminder |
| EVENT_RSVP_NUDGE | How long before the RSVP deadline an unanswered invitee gets one private nudge (EV-EVT-04) | 24 h; no nudge when the deadline is less than 24 h after the invitation |
| EVENT_LATE_REMINDER_MIN | Smallest gap between the end of quiet hours and the event start for a held reminder to be sent when quiet hours end | 60 minutes |
| EVENT_RECURRENCE_HORIZON | How far ahead occurrences are generated | 90 days, extended daily; a series never shows more than 14 occurrences ahead |
| EVENT_WEEK_START | First day of the week in calendar view | Monday in all three languages (Madagascar uses the Monday week; not user-editable in the MVP) |

### Statuses used by this epic

| Object | Status | Meaning |
| --- | --- | --- |
| Event | Draft | Saved by a holder of Event: create, not yet invited by a holder of Event: invite. Visible only to its creator |
| Event | Scheduled | Invitations sent, start time not reached |
| Event | Cancelled | Cancelled with a reason (EVT-07). Final |
| Event | Ended | Computed marker, not stored: the end time (or start time when no end is set) has passed and the event is not Cancelled. Shown in the Past tab |
| RSVP | Going, Maybe, No | The person's answer |
| RSVP | No answer | Invited and not yet answered (a count, not an answer) |
| RSVP | To confirm | Marker added to a Going or Maybe answer after a material change (EVT-06); the answer stays Going or Maybe |
| RSVP | Sent after start | Marker on an answer that reached the server after the event started (EVT-04) |

Queue labels (`Saved on this phone`, `Waiting to send`) are the XCT-05 labels. Notification and SMS delivery states are the NTF delivery vocabulary. No other status name is used here.

Message keys: UI `evt.<area>.<name>`; notifications follow the NTF registry, base key `msg.evt.<event>` with variants `.push`, `.sms` and `.inapp` (EV-EVT-01 to EV-EVT-08). Keys this epic needs that the registry lacks, to be added by NTF: `msg.evt.uninvited`, `msg.evt.host_left`, `msg.evt.rsvp_summary`, `msg.evt.reminder_early` (push and in-app only, for the 1-week and 3-day offsets) and an SMS variant of `msg.evt.invited` for invitees with no registered device. SMS keys stay GSM-7 and under 160 characters in each language (NTF-07, XCT-12). No text is written in this file.

---

### EVT-01 Create an event for the group

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: create (and Event: invite to notify the audience)
**Tags:** audit

**Story:** As a member who organises a gathering, I want to create an event with a date, a place and a host, so that everyone knows when and where without anyone phoning around.

**Conversation:** Manual reminders, where someone must call everyone, are info.md problem 6. A meeting date, a host and change alerts as a first-class object come from StokFella (raw/08 section 6.10). The event card holds what, when (absolute date with weekday, time and zone), where, who is going and a three-button RSVP (raw/07 section 8.7 R-EV1). The form is short because the creator is often on a basic phone. Recurring events are EVT-02, inviting is EVT-03.

**Preconditions:** The person belongs to a group that is not archived (GRP-19) and holds Event: create.
**Trigger:** The person taps "New event" on the group page or the event list.

**Acceptance criteria:**
1. The form requires title, start date and time, and audience (default: the whole group, see EVT-03). Optional: end time, place as text, description, host (default the creator, changeable to any member), RSVP deadline, project link (EVT-09), reminder times (EVT-05).
2. The date and time show weekday and the Madagascar time label next to the field (XCT-03), for example `Sat 25 Oct, 15:00`. A start in the past is refused with `evt.error.past_date`.
3. On `Create event` by a holder of Event: invite, the event gets status Scheduled and appears in the group's list and calendar (EVT-08). Invitees receive `msg.evt.invited` (EVT-03, EV-EVT-01).
4. A person who holds Event: create but not Event: invite can save the event, but its status is Draft, visible only to them, until someone with Event: invite sends the invitations; the draft says so (`evt.draft.needs_invite`). A Draft sends no notification and no reminder.
5. The host is shown on the event card. If the host is removed from the group (GRP-17) or leaves it (GRP-16), the creator is notified with `msg.evt.host_left` and the event keeps the creator as fallback host; if the creator is also gone, the holder of Event: edit who changes it next must choose a host before saving.
6. Creating an event is online only and is not on the XCT-05 queue registry. If the connection drops the form keeps every typed field on the phone and shows `Not sent. Retry`; the event is never created silently. Failure shows `evt.error.save_failed` with Retry and keeps every field.
7. A title longer than the limit (80 characters) or an empty title shows an inline message; the form never saves a partial event.
8. Audit: creation, host, audience size, reminders and project link are written to the audit log with actor and time.
9. Accessibility and language: labels are always visible, touch targets are at least 48 by 48 dp, the date picker is usable by keyboard and screen reader, and the typed title keeps its language while labels follow the viewer's language.

**Data:** Event, Group, Membership, Audit entry, Notification.
**Depends on:** GRP-02 (founder holds every permission), GRP-08 (grant Event permissions), GRP-16, GRP-17, GRP-19, NTF-04, NTF-05, XCT-03, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: members cannot propose an event for approval in the MVP (open question 7). Closed: the time zone is Madagascar time only (XCT-03, open question 9).

---

### EVT-02 Repeat an event every week or every month

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: create (set), Event: edit (change)
**Tags:** audit

**Story:** As a member who organises regular meetings, I want to set an event to repeat, so that I do not recreate the same meeting every month.

**Conversation:** Groups contribute monthly and meet on a rhythm; calendar, recurring events and reminders are a core spec line (info.md, Events module). Recurrence is kept to simple patterns because the audience has limited tools. Reminders and RSVP apply per occurrence so a missed month is not confused with a missed day.

**Preconditions:** The create or edit form is open (EVT-01).
**Trigger:** The person turns on "Repeat" on the event.

**Acceptance criteria:**
1. The choices are: every week, every 2 weeks, every month on the same date, every month on the same weekday (for example the first Sunday), and every year. The end is: never, on a date, or after a number of times.
2. A summary sentence repeats the choice in plain words (`evt.repeat.summary`), for example the next three dates, before the person saves.
3. A monthly rule on a date that a month does not have falls on the last day of that month, and the summary says so.
4. The system generates occurrences up to EVENT_RECURRENCE_HORIZON (at most 14 ahead) and extends them daily as time passes. The list and calendar show each occurrence on its own.
5. RSVP and reminders are per occurrence. Invitations are sent once for the series, not once per occurrence, with a note that it repeats.
6. Editing offers "This event only", "This and following events" or "All events", and says what will change. Changes to a past occurrence are refused.
7. Cancelling follows EVT-07 with the same three scopes.
8. The host can be changed on one occurrence without changing the series (`evt.edit.host_this_one`).
9. Audit: the rule, each scope-based edit and each cancelled occurrence are logged with actor and time.

**Data:** Event (series and occurrence), RSVP, Audit entry.
**Depends on:** EVT-01, EVT-06, EVT-07, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: occurrences are generated 90 days ahead (EVENT_RECURRENCE_HORIZON), because monthly groups need at least three visible dates and a longer horizon multiplies reminders and edits for no gain. Closed: no host rotation list in the MVP; the host is changed per occurrence (criterion 8).

---

### EVT-03 Invite the whole group or chosen members

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: invite
**Tags:** sms, audit

**Story:** As a member who can invite, I want to invite everyone in the group, or only some people, so that the right people are told and I do not have to message them myself.

**Conversation:** Automatic reminders to all members replace manual calls (info.md, problem 6 and journey 5). Whole group is the default because most group events concern everyone. People without a smartphone must still be reached (competitive-analysis section 1: about one in five Malagasy is online, so SMS reaches more people; raw/04 section 0). Invitations use push, and SMS for people with no app or device; reminders carry the SMS rule (EVT-05).

**Preconditions:** The event exists and the person holds Event: invite.
**Trigger:** The person chooses the audience in the event form, or taps "Invite" on an existing event.

**Acceptance criteria:**
1. The audience offers "The whole group" (default), "Pick members" with a searchable list and a count, and, when the event is linked to a project, "The project team" (EVT-09).
2. On sending, each invitee receives `msg.evt.invited` by push and in-app (EV-EVT-01). An invitee who has no registered device receives the SMS variant instead, sent direct with no push step (NTF-11), GSM-7 safe, under 160 characters, with the event reference, charged to the group allowance (NTF-06).
3. "The whole group" keeps up to date until the event starts: a member who joins the group later (GRP-04) is invited automatically, and a member who leaves (GRP-16) or is removed (GRP-17) is dropped from the invitee list and the counts.
4. A holder of Event: invite can add people later; only the added people are notified. Removing an invitee removes them from counts and notifies them with `msg.evt.uninvited` only if they had answered Going or Maybe.
5. Invitees see the event in their list with their RSVP state (EVT-04). Every member holding Event: view on the group sees every group event, invited or not, because group transparency is the default; a member who is not invited sees it read-only, without RSVP buttons and without being counted.
6. Empty and error states: with zero invitees the send button is disabled with `evt.invite.none_selected`; a failed send keeps the audience and shows Retry; a send in progress shows `Sending`.
7. The inviter sees `Sent to 18, 2 without a device by SMS` after sending, and the delivery status per channel as counts.
8. Audit: audience size, each person added or removed, channel and time are written to the audit log.
9. Accessibility and language: the member list is searchable with accents handled for Malagasy and French names, and selected state is shown by an icon and text.

**Data:** Event, Membership, RSVP, Notification, Device, Audit entry.
**Depends on:** EVT-01, GRP-04, GRP-05, GRP-16, GRP-17, NTF-03 (device state), NTF-05, NTF-06, NTF-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: "the whole group" is dynamic, because a snapshot would leave new members uninformed of the next meeting. Closed: a link that shows an event without an account is Later (open question 5).

---

### EVT-04 Say "going", "maybe" or "no" in one tap and see who is coming

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Event: view
**Tags:** offline

**Story:** As an invited member, I want to answer with one tap and see how many are coming, so that I commit without a form and the host can plan.

**Conversation:** RSVP is one tap, no form, with a sticky state chip after the choice (raw/07 section 8.7 R-EV1); a "who is coming" count shown to everyone is an opportunity (raw/08 section 6.10). The industry no-show benchmarks (median about 20%, free events 28%) are vendor numbers, not Gereo data (raw/04 section 12), so the count is for planning, not a promise. Late payment shaming is a risk in the research (raw/07 R-NT8); the same care applies to people who did not answer.

**Preconditions:** The person is invited and the event is Scheduled.
**Trigger:** The person opens the event or a reminder.

**Acceptance criteria:**
1. The event card shows three buttons: Going, Maybe, No. One tap records the answer and shows a state chip with icon and text (`evt.rsvp.going`, `evt.rsvp.maybe`, `evt.rsvp.no`).
2. The person can change the answer until the event starts, or until the RSVP deadline if one was set; after the deadline buttons are locked with `evt.rsvp.closed`.
3. Counts are shown to everyone who can see the event: Going, Maybe, No and No answer, as numbers. Names of who is Going and Maybe are visible to invitees; names of people who said No or have not answered are visible only to holders of Event: edit.
4. The count updates when the page opens and on pull-to-refresh; it does not tick live.
5. Offline: RSVP is on the XCT-05 queue registry. The tap is saved on the phone with `Saved on this phone` then `Waiting to send`, the chip shows the pending state, and sync follows. If the event started before sync, the answer is accepted but carries the marker `Sent after start`.
6. Errors: an answer to a cancelled event is refused with `evt.error.cancelled`; a failed send keeps the answer and shows Retry.
7. Notifications: no notification to others for each answer. The responder gets an in-app item only (`msg.evt.rsvp_saved`, EV-EVT-07). An invitee with no answer receives one private nudge EVENT_RSVP_NUDGE before the RSVP deadline (`msg.evt.rsvp_deadline`, EV-EVT-04). Holders of Event: edit receive a summary of the counts when the deadline passes (`msg.evt.rsvp_summary`). A person is never named in any group-visible message for not answering.
8. Audit: each change of answer is stored with time so that counts can be explained.
9. Accessibility and language: the three buttons are 48 by 48 dp with 8 dp spacing, never rely on colour alone, are announced as a radio group, and the labels are short enough to survive a 200 to 300% text expansion in Malagasy and French.

**Data:** RSVP, Event, Membership, Audit entry.
**Depends on:** EVT-01, EVT-03, XCT-05 (offline queue), XCT-04 (cache), NTF-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: names of those Going and Maybe are visible to invitees, because the evidence points to a visible count as an opportunity (raw/08 section 6.10) and group transparency is the product default. Closed: no "plus guests" headcount in the MVP; each member answers for themselves. RSVP by SMS reply: Later, see open question 5.

---

### EVT-05 Get automatic reminders, by push then SMS if not opened

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none (automatic); Event: edit to change times
**Tags:** sms, audit

**Story:** When an event is coming and some people have not seen it, I want Gereo to remind them at the right times, first by push and then by SMS if they have not opened it, so that nobody has to be called by hand.

**Conversation:** Automatic reminders to all members, by notification and by SMS when the person has not opened the app, are in info.md (Events module). The default cadence of push at about 24 h and 2 h is a hypothesis to test (raw/07 section 8.7 R-EV3 and 8.8 R-NT3), and the evidence on reminder effect is weak (Karlan studies, raw/07 section 8.8; raw/04 section 12). SMS is costly (about USD 0.59 per segment on a global CPaaS; local rate not verified, raw/04 section 0), so SMS is rationed with a cap and a clear who-pays question. No competitor documents SMS fallback for RSVP (raw/08 section 6.10).

**Preconditions:** The event is Scheduled and has invitees.
**Trigger:** Each reminder time before the start, from EVENT_REMINDER_DEFAULTS or the event's own list.

**Acceptance criteria:**
1. Each event starts with the default reminder times (EVENT_REMINDER_DEFAULTS). A holder of Event: edit can add or remove reminder times chosen from EVENT_REMINDER_PRESETS, up to EVENT_MAX_REMINDERS, each shown in words (`evt.reminder.before`, for example "1 day before"). Free-form times are not offered.
2. Audience. The 24 h reminder (`msg.evt.reminder_24h`, EV-EVT-02) goes by push and in-app to invitees who answered Going or Maybe or have not answered. The 2 h reminder (`msg.evt.reminder_2h`, EV-EVT-03) goes to invitees who answered Going or Maybe, and to invitees with no registered device. The 1 week and 3 day reminders (`msg.evt.reminder_early`) go by push and in-app only. Invitees who answered No receive nothing.
3. SMS follows NTF-05 and uses no value of its own: for the 24 h and 2 h reminders only, an SMS is sent once for that reminder when the push was not opened within `ntf.sms_window` for that offset. SMS goes only to invitees who answered Going or Maybe, and to invitees with no registered device who have not answered No; an invitee with a device who has not answered gets push and in-app only. A person who opened the push or the event gets no SMS. Answering Going does not cancel the reminder SMS, because the reminder is about the event itself and not about the answer (NTF-05 criterion 4 must not treat RSVP as the action that resolves a reminder). The per-person daily cap, the group allowance and the opt-out are those of NTF-05, NTF-06 and NTF-10.
4. The reminder shows title, weekday, date, time, place and host, and for SMS fits one GSM-7 segment in each language and ends with the event reference (NTF-07, XCT-12). The reminder shows the person's own RSVP state and a link to change it.
5. Reminders whose time has already passed when the event is created or edited are skipped, and the system does not send a late copy; invitees still receive the invitation or change notice. When the group is archived (GRP-19) or the event is Cancelled, all scheduled reminders stop.
6. Quiet hours follow NTF-09: a planned reminder is never sent inside the quiet window. A reminder time that falls inside it is sent when quiet hours end if the event starts at least EVENT_LATE_REMINDER_MIN after that moment; otherwise it is moved to just before quiet hours begin the evening before.
7. Each person controls push and SMS for events in NTF-04 and NTF-10. A person who stopped SMS gets no event SMS, even after answering Going; the event page shows in words that SMS is off for this person (`evt.reminder.sms_off`).
8. States: delivery results use the NTF delivery vocabulary, and the host sees counts, for example `3 SMS Unreachable`, never names of people who ignored it. Names appear only in the NTF-12 operator trace.
9. Audit: each reminder, channel, time, result and the SMS count against the group allowance are stored by NTF (NTF-12).

**Data:** Event, RSVP, Notification, Device, Audit entry.
**Depends on:** EVT-01, EVT-03, NTF-02, NTF-04, NTF-05, NTF-06, NTF-07, NTF-09, NTF-10, NTF-12, ACC-06 (language).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: SMS is paid from the group allowance, which the platform funds in the MVP (NTF-06). Closed: default reminder times stay 24 h and 2 h, validated by the first cohort. Closed: SMS goes only to people who answered Going or Maybe and to people with no device (raw/07 R-EV3), because it limits cost and keeps one SMS per person per reminder. Still open and external: the aggregator rate that fixes the real SMS allowance (competitive-analysis section 10, blocker 4); default until then: the NTF working values and no price shown.

---

### EVT-06 Change an event and tell everyone

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit
**Tags:** sms, audit

**Story:** As a member who can edit events, I want to change the date, time, place or host and have everyone told, so that nobody turns up at the wrong time.

**Conversation:** Change alerts are a first-class feature of group meeting objects (StokFella, raw/08 section 6.10), and the research on approvals insists that what people agreed to matches what they see (raw/07 section 8.4, the principle applies by analogy). A change to date or place invalidates earlier commitments, so answers are asked again.

**Preconditions:** The event exists, is Scheduled and has not ended.
**Trigger:** The person taps "Edit" and saves a change.

**Acceptance criteria:**
1. A change to start time, end time, date, place or host is a material change. A change to description or title is minor; for a minor change the editor chooses `Tell the group` or not.
2. A material change sends `msg.evt.changed` (EV-EVT-05) by push and in-app to all invitees who have not answered No, with a plain sentence "was {old}, now {new}", and an SMS to those who do not open the push within the NTF window for this event type (NTF-05) or have no device. A change of host is material for the invitees but is not in the EV-EVT-05 trigger today (date, time, place), so NTF must add it (see cross-epic note in the epic summary).
3. After a change of date or time, those who answered Going or Maybe keep their answer and receive the marker To confirm; they see `evt.rsvp.reconfirm` and are asked to confirm again, and counts show it (`Going, to confirm`). A change of place or host does not ask for a new answer. A shift of 15 minutes or less in the start time does not set the marker.
4. Reminder times are recalculated from the new start; reminders already sent for the old time are not repeated.
5. The event page shows a short "Changed" line with who and when, and one tap shows the history of changes (old and new values).
6. Two people editing at once see the latest saved version and a message showing what changed (`evt.edit.conflict`); no silent overwrite.
7. Errors: a new start in the past is refused with `evt.error.past_date`; a save failure keeps the changes and shows Retry.
8. Offline: edits are blocked with an explanation, not queued, because they change what others see.
9. Audit: each change stores the old and new value, actor and time.

**Data:** Event, RSVP, Notification, Audit entry.
**Depends on:** EVT-01, EVT-03, EVT-04, EVT-05, NTF-05, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a shift of 15 minutes or less skips the reconfirm marker (criterion 3), because a person who agreed to 15:00 can still attend at 15:15 and the marker would raise noise; the change notice is still sent. Closed: no free-text reason on declining after a change; the person simply changes the answer to No (EVT-04), which keeps the flow to one tap.

---

### EVT-07 Cancel an event and tell everyone

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit
**Tags:** sms, audit

**Story:** As a member who can edit events, I want to cancel an event with a reason, so that people stop planning for it and know why.

**Conversation:** Cancelling must reach people who did not open the app, otherwise they travel for nothing, so SMS fallback applies to cancellations as to changes. The event stays visible as Cancelled so the group can see it happened, not deleted, in line with append-only principles (conventions section 2, applied by analogy).

**Preconditions:** The event is Scheduled and the person holds Event: edit.
**Trigger:** The person taps "Cancel event".

**Acceptance criteria:**
1. The person must choose a reason from presets (for example "date not possible", "not enough people", "other") and may add text. The button is labelled `Cancel the event` and the sheet shows how many people will be told.
2. On confirmation the status becomes Cancelled, the event remains in the list with a Cancelled chip, and reminders stop.
3. All invitees who have not answered No receive `msg.evt.cancelled` (EV-EVT-06) by push and in-app, and an SMS if they do not open it within the NTF window for this event type (NTF-05) or have no device. Invitees who answered No receive an in-app item only, because they are not travelling.
4. For recurring events the person chooses "This event only", "This and following events" or "All events" (EVT-02).
5. A cancelled event cannot be answered (EVT-04) and cannot be edited back to Scheduled. A host who cancelled by mistake creates a new event (reopen is not in the MVP).
6. Linked project (EVT-09): the event stays in the project's list marked Cancelled.
7. Errors: cancelling an event that has already ended is refused with `evt.error.already_ended`; a failed send keeps the reason and shows Retry.
8. Offline: blocked with an explanation, not queued.
9. Audit: reason, scope, actor, time and the notification counts are stored.

**Data:** Event, RSVP, Notification, Audit entry.
**Depends on:** EVT-01, EVT-02, EVT-05, NTF-05, XCT-05 (actions off the queue registry are online only).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no reopen in the MVP; a mistaken cancellation is fixed by creating a new event (criterion 5), which keeps the Cancelled record honest and avoids a second status path.

---

### EVT-08 See upcoming events as a list and as a calendar

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Event: view
**Tags:** offline

**Story:** When I plan my week, I want to see the group's events as a list and as a month calendar, so I can tell what is coming and what I have answered.

**Conversation:** The event list is part of the Follow step and the calendar is a table stake of the module (info.md, Events). Calendar is view only; two-way sync is out of v1 (competitive-analysis section 7; raw/08 section 6.10).

**Preconditions:** The person belongs to at least one group with events, or has personal dates (EVT-10).
**Trigger:** The person opens "Events".

**Acceptance criteria:**
1. The default is the upcoming list, grouped by day, nearest first. Each row shows title, weekday, date, time, place, host, the person's RSVP chip, the count going and a Cancelled chip when applicable.
2. A toggle switches to a month calendar. Days with events show a number or text count, never only a dot or a colour; tapping a day shows its events as a list below the grid.
3. Filters: all groups, one group, one project, "I am going" and "Not personal". The filter is remembered on the phone. Draft events (EVT-01) appear only to their creator, marked Draft.
4. A Past tab shows events that have ended, newest first.
5. Empty states: `evt.list.empty` with a "New event" button if the person holds Event: create, otherwise an explanation of who can create events.
6. Offline: the list and the calendar load from cache with `Last synced`, show events for the cached period, and say that newer changes need a connection. RSVP taps follow EVT-04 offline rules.
7. Loading shows skeleton rows; the calendar grid renders without blocking the list.
8. The first day of the week follows EVENT_WEEK_START; the month view is operable by keyboard and screen reader, and an equivalent list is always available.
9. Accessibility and language: dates are absolute with weekday in the viewer's language (Malagasy, French, English); rows are 48 dp tall at minimum; the layout reflows at 320 px.

**Data:** Event, RSVP, Group, Project.
**Depends on:** EVT-01, EVT-04, XCT-03 (dates), XCT-04 (cache, last synced), XCT-01 (language), EVT-10 (personal dates shown in the same view).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no week view in the MVP; the list grouped by day already serves the week, and a third view adds build and test cost without evidence. Closed: personal dates (EVT-10) appear in the same list and calendar by default, marked as personal, because one place to look is the point of the module; the filter "Not personal" hides them.

---

### EVT-09 Link an event to a project

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit and Project: view
**Tags:** audit

**Story:** As a member who can edit events and see the project, I want to link its meetings and key dates to the project, so that the project page shows what is coming.

**Conversation:** Events belong to a user, group or project (info.md object model), and the project page lists "next dates" (raw/04 section 14.5). The project timeline merges them (PRJ-11, raw/08 section 6.9). A project deadline is not an event and is not converted into one automatically.

**Preconditions:** The event exists and a project exists in the same group, not Closed (PRJ-09). The person holds Event: edit and Project: view.
**Trigger:** The person picks "Project" in the event form, or taps "Add an event" on a project page.

**Acceptance criteria:**
1. An event can be linked to at most one project of the same group. The link is optional and can be removed.
2. From the project page, "Add an event" opens EVT-01 with the project prefilled and the audience offering "The project team" (EVT-03).
3. The project's Events section lists upcoming events first, then past ones, with title, date, host and a Cancelled chip when applicable.
4. The event card shows the project as a chip that opens the project when the person holds Project: view; a person without Project: view sees the project name as plain text without a link.
5. A Closed project accepts no new links; existing linked events stay and remain visible.
6. Events from a linked project can be filtered in the event list (EVT-08).
7. Errors: linking to a project of another group is not offered; linking a Cancelled event is allowed and shown as Cancelled.
8. Offline: linking is blocked with an explanation, not queued.
9. Audit: link and unlink with actor and time; no notification is sent for a link change unless the audience changes.

**Data:** Event, Project, Audit entry.
**Depends on:** EVT-01, EVT-03, PRJ-02 (project page, Events section and team), PRJ-04 (milestones), PRJ-06 (project permissions), PRJ-11 (timeline), GRP-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: milestone dates are not proposed as events in the MVP; a milestone stays in PRJ-04 and the timeline (PRJ-11) shows both, so no duplicate object is created. Closed: a person without Project: view sees the project name as plain text, because the name alone reveals no money or decision and the event itself is already visible to them.

---

### EVT-10 Remember a date and keep a private note

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Individual
**Permission needed:** none (own entity)
**Tags:** offline

**Story:** When I need to remember a date, such as a payment I owe or a family event, I want to save it with a short note and get a reminder, so I do not forget without writing it elsewhere.

**Conversation:** Events, notes and dates to remember are one module for users, groups and projects (info.md, Events, notes and dates to remember). In the MVP the personal side is light: no sharing, no attachments. Group dates are events. SMS for personal reminders is not offered because of cost.

**Preconditions:** The person is signed in.
**Trigger:** The person taps "Remember a date" in Events.

**Acceptance criteria:**
1. The form asks for a title and a date (required), an optional yearly repeat, an optional note (plain text) and a reminder time chosen from presets (for example the day before and the morning of).
2. The date appears in the person's calendar and list (EVT-08) marked as personal, visible only to them.
3. The reminder is a push and in-app item at the chosen time (quiet hours follow NTF-09). No SMS is offered for personal dates in the MVP, because no payer class exists for them in NTF-06 (the group allowance is for group content and the platform pays only security and receipts).
4. A note can exist alone (no date) and is listed under "Notes" with the first line shown; it is private and cannot be shared in the MVP.
5. Offline: dates and notes are created and edited on the phone, shown as `Saved on this phone` then `Waiting to send` and synced, and are readable offline. This needs a personal date and note entry on the XCT-05 queue registry, which they do not have today (see cross-epic notes). A reminder set offline is scheduled on the phone and also registered on the server at sync.
6. Deleting a date or note removes it from the person's view after a confirmation; it does not affect any group data.
7. Empty states: `evt.personal.empty` with one action.
8. Errors: empty title or an invalid date shows an inline message; a failed sync keeps the item and shows Retry.
9. Accessibility and language: a typed note keeps its language; labels follow the viewer's language; the repeat setting is stated in words.

**Data:** Event (personal), Note, Notification.
**Depends on:** ACC-02 (signed-in person), NTF-04, NTF-09, XCT-04, XCT-05, EVT-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: notes cannot be attached to a group, project or event nor shared in the MVP (Later), because sharing needs permissions and moderation that the personal side does not have. Closed: no personal SMS reminders in the MVP (criterion 3), which removes the cost question.

---

### EVT-11 Add an event to my phone's calendar

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** Event: view
**Tags:** offline

**Story:** As a member, I want to put an event in my phone's own calendar, so that it reminds me even without Gereo.

**Conversation:** Calendar sync is out of v1 (competitive-analysis section 7; raw/08 section 6.10 "Avoid"). This story is a one-way export of a single event as a file and is the cheapest form. Add to calendar works only online, and offline the fallback is copied text (raw/07 section 8.7 R-EV4). Reminders sent by Gereo are unaffected.

**Preconditions:** The event is Scheduled or Cancelled and the person can view it.
**Trigger:** The person taps "Add to my calendar" on the event.

**Acceptance criteria:**
1. The app produces a standard calendar file with title, start, end, place, description and a link back to the event, and hands it to the phone's calendar through the share or open action.
2. A recurring event exports its repeat rule; an occurrence exports as a single event.
3. The export is a copy: later edits and cancellations in Gereo do not update the phone's calendar, and the sheet says so in words (`evt.export.static`).
4. Offline, the button changes to "Copy details as text", which puts date, time, place and the event reference in a message the person can paste.
5. A person without a calendar app sees `evt.export.no_calendar` and the text fallback.
6. A cancelled event exports as cancelled and the file is marked so.
7. Errors: a failure to hand off shows Retry and the text fallback.
8. Audit: none; the event content leaves the app only to the person who asked.
9. Accessibility and language: the export uses the viewer's language for the event details only if the host typed them in that language; fixed words follow the viewer's language.

**Data:** Event.
**Depends on:** EVT-01, EVT-02, XCT-04 (offline cache is the source of the text fallback).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no subscribable personal calendar feed in the MVP; it needs a private token and a security review, and the static export of criterion 3 covers the need at lower risk.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| EVT-01 | Create an event for the group | P0 | GRP-02, GRP-08, GRP-16, GRP-17, GRP-19, NTF-04, NTF-05, XCT-03, XCT-05 |
| EVT-02 | Repeat an event every week or every month | P1 | EVT-01, EVT-06, EVT-07, NTF-05 |
| EVT-03 | Invite the whole group or chosen members | P0 | EVT-01, GRP-04, GRP-05, GRP-16, GRP-17, NTF-03, NTF-05, NTF-06, NTF-11 |
| EVT-04 | Say "going", "maybe" or "no" in one tap and see who is coming | P0 | EVT-01, EVT-03, XCT-04, XCT-05, NTF-04 |
| EVT-05 | Get automatic reminders, by push then SMS if not opened | P0 | EVT-01, EVT-03, NTF-02, NTF-04 to NTF-07, NTF-09, NTF-10, NTF-12, ACC-06 |
| EVT-06 | Change an event and tell everyone | P1 | EVT-01, EVT-03, EVT-04, EVT-05, NTF-05, XCT-05 |
| EVT-07 | Cancel an event and tell everyone | P1 | EVT-01, EVT-02, EVT-05, NTF-05, XCT-05 |
| EVT-08 | See upcoming events as a list and as a calendar | P0 | EVT-01, EVT-04, EVT-10, XCT-01, XCT-03, XCT-04 |
| EVT-09 | Link an event to a project | P1 | EVT-01, EVT-03, PRJ-02, PRJ-04, PRJ-06, PRJ-11, GRP-08 |
| EVT-10 | Remember a date and keep a private note | P2 | ACC-02, NTF-04, NTF-09, XCT-04, XCT-05, EVT-08 |
| EVT-11 | Add an event to my phone's calendar | P2 | EVT-01, EVT-02, XCT-04 |

Count: 11 stories. P0: 5 (EVT-01, EVT-03, EVT-04, EVT-05, EVT-08). P1: 4 (EVT-02, EVT-06, EVT-07, EVT-09). P2: 2 (EVT-10, EVT-11).

## Cross-epic dependencies

Story IDs are the binding reference.

- ACC: ACC-02 (signed-in person), ACC-06 (language preference). Device registration state is read through NTF-03.
- WAL: none. Payment attached to an event is Later.
- RUL: none.
- GRP: GRP-02 (the founder holds every permission), GRP-08 (grant Event: view, create, edit, invite one by one), GRP-04, GRP-05, GRP-16, GRP-17 (join, list, leave and removal feed the whole-group audience), GRP-18 (no module switch), GRP-19 (an archived group sends no reminders), GRP-06 (next-event tile reads EVT-08). The two GRP bundles contain only Event: view, so every Event permission beyond viewing is granted individually through GRP-08 until a later bundle exists.
- CON: none in the MVP. A contribution tied to an event's RSVP (raw/07 R-EV5) is Later; a contribution due date is shown by CON, not as an event.
- SPD: none.
- NTF: NTF-02, NTF-03, NTF-04, NTF-05, NTF-06, NTF-07, NTF-09, NTF-10, NTF-11, NTF-12 and the catalogue rows EV-EVT-01 to EV-EVT-08. Requests to NTF: (a) add an SMS variant of EV-EVT-01 for invitees with no registered device; (b) add `msg.evt.uninvited`, `msg.evt.host_left`, `msg.evt.rsvp_summary` and `msg.evt.reminder_early`; (c) add a change of host to the EV-EVT-05 trigger; (d) in NTF-05 criterion 4, an RSVP must not cancel an event reminder SMS; (e) the 2-hour reminder audience in EV-EVT-03 is Going and Maybe plus invitees with no device; (f) EV-EVT-08 (event payment due) belongs to Later, since EVT has no payment; (g) the quiet-hours rule of EVT-05 criterion 6.
- XCT: XCT-01, XCT-03, XCT-04, XCT-05 (add personal date and note to the queue registry for EVT-10; keep event creation, edit and cancel off it), XCT-12, XCT-14.
- OPS: OPS-12 (SMS spend), NTF-12 trace for support.
- PRJ: PRJ-02 (Events section), PRJ-11 (timeline reads events), PRJ-09 (closed project accepts no new link).
- VOT: none directly; a vote and an event can be mentioned together in a project timeline.
- ANN: none; an announcement is not an event.

## Open questions

1. Closed: SMS is paid from the group SMS allowance, funded by the platform in the MVP (NTF-06). Still open and external: the SMS aggregator rate that fixes the real allowance value (competitive-analysis section 10, blocker 4). Default until then: the NTF working values and no price shown.
2. Closed: default reminder times stay 24 h and 2 h; SMS goes only to Going and Maybe invitees and to invitees with no device (EVT-05).
3. Closed: names of those Going and Maybe are visible to invitees; names of those who said No or did not answer are visible only to holders of Event: edit (EVT-04).
4. Closed: the whole-group audience is dynamic (EVT-03).
5. Closed as Later: RSVP by SMS reply and guest RSVP by link without an account. Both need inbound SMS or a light session, as for guest votes (VOT-06, ACC-16). Revisit after the first cohort shows how many members have no app; priority P2 if confirmed. Whether the aggregator supports inbound SMS is an external check, listed with the SMS blocker.
6. Closed: an event carries no contribution or payment status in the MVP (raw/07 R-EV5), because it would need CON and WAL changes and a legal-gate review for no proven need; CON reserves a hook.
7. Closed: members cannot propose an event for approval; a holder of Event: create creates it, and without Event: invite it stays a Draft until someone invites (EVT-01).
8. Closed: no reopen of a cancelled event (EVT-07).
9. Closed: time zone is Madagascar time only (XCT-03); diaspora members see the same time with the zone label.
