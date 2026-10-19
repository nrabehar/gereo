# EVT: Events and reminders

Epic code: EVT. Release: MVP. Journey steps: 7 Follow (organise and remind). Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file:

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 0 market context (SMS reach), section 12 (event no-show benchmarks and the lack of reliable reminder effect sizes), section 14.3 and 14.6 (SMS cost risk).
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline and SMS rules, section 8.7 events and RSVP, section 8.8 notifications and reminders.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.10 events.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Events: RSVP and reminders push then SMS, no calendar sync) and [design-foundations.md](../../research/design-foundations.md) section 3 principle 7 (SMS is a first-class channel).

## Scope of the epic

In MVP: single and recurring events; invite members or the whole group; RSVP going, maybe, no in one tap with a visible count; automatic reminders (default 24 h and 2 h) by push then SMS if not opened; edit and cancel with notification; a named host; event list and calendar view; link an event to a project; light personal dates to remember and notes; export to the phone calendar (P2, one-way).

Not in MVP: two-way calendar sync, payment attached to an event or RSVP (open question, see raw/07 R-EV5), agenda and attendance records tied to fines (Chamasoft; raw/08 section 6.10), public events, ticketing, guest RSVP by link without an account (open question).

## Parameters

Every value is a configuration parameter. No number is a research finding: raw/04 section 12 found no reliable published effect size for reminders, so no story promises a reduction in no-shows.

| Parameter | Meaning | Starting hypothesis |
| --- | --- | --- |
| EVENT_REMINDER_DEFAULTS | Reminder offsets before the start | 24 h and 2 h (raw/07 R-EV3, a hypothesis to test) |
| EVENT_MAX_REMINDERS | Most reminders one event can carry | To decide |
| EVENT_SMS_WAIT | How long a push may stay unopened before SMS | To decide with the SMS aggregator quote |
| EVENT_SMS_CAP | Most SMS per event and per person | To decide, SMS is costly (raw/04 section 14.6 risk 3) |
| EVENT_RECURRENCE_HORIZON | How far ahead occurrences are generated | To decide |
| EVENT_WEEK_START | First day of the week in calendar view | By locale, to confirm |

Message keys: UI `event.<area>.<name>`; notifications `ntf.event.<name>.push` and `.sms`. SMS keys stay GSM-7 and under 160 characters in each language (raw/07 section 4 R-SMS4). No text is written in this file.

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

**Preconditions:** The person belongs to a group with the Events module enabled and holds Event: create.
**Trigger:** The person taps "New event" on the group page or the event list.

**Acceptance criteria:**
1. The form requires title, start date and time, and audience (default: the whole group, see EVT-03). Optional: end time, place as text, description, host (default the creator, changeable to any member), RSVP deadline, project link (EVT-09), reminder times (EVT-05).
2. The date and time show weekday and the time zone label next to the field, for example `Sat 25 Oct, 15:00`. A start in the past is refused with `event.error.past_date`.
3. On `Create event` the event gets status Scheduled and appears in the group's list and calendar (EVT-08). Invitees receive `ntf.event.invited.push` (EVT-03).
4. A person who holds Event: create but not Event: invite can save the event, but it stays a draft visible only to them until someone with Event: invite sends the invitations; the draft says so (`event.draft.needs_invite`).
5. The host is shown on the event card. If the host is removed from the group, the creator is notified with `ntf.event.host_left.push` and the event keeps the creator as fallback host.
6. States: the button disables while saving; if the connection drops the event is kept as a draft `Saved on this phone`, never created silently; failure shows `event.error.save_failed` with Retry and keeps every field.
7. A title longer than the limit or an empty title shows an inline message; the form never saves a partial event.
8. Audit: creation, host, audience size, reminders and project link are written to the audit log with actor and time.
9. Accessibility and language: labels are always visible, touch targets are at least 48 by 48 dp, the date picker is usable by keyboard and screen reader, and the typed title keeps its language while labels follow the viewer's language.

**Data:** Event, Group, Membership, Audit entry, Notification.
**Depends on:** GRP (module, permissions, membership), NTF, XCT (draft behaviour).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether members may propose an event that an authorised member confirms. Whether the time zone is always the group's or can differ.

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
2. A summary sentence repeats the choice in plain words (`event.repeat.summary`), for example the next three dates, before the person saves.
3. A monthly rule on a date that a month does not have falls on the last day of that month, and the summary says so.
4. The system generates occurrences up to EVENT_RECURRENCE_HORIZON and extends them as time passes. The list and calendar show each occurrence on its own.
5. RSVP and reminders are per occurrence. Invitations are sent once for the series, not once per occurrence, with a note that it repeats.
6. Editing offers "This event only", "This and following events" or "All events", and says what will change. Changes to a past occurrence are refused.
7. Cancelling follows EVT-07 with the same three scopes.
8. The host can be changed on one occurrence without changing the series (`event.edit.host_this_one`).
9. Audit: the rule, each scope-based edit and each cancelled occurrence are logged with actor and time.

**Data:** Event (series and occurrence), RSVP, Audit entry.
**Depends on:** EVT-01, EVT-06, EVT-07, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** How far ahead occurrences are generated. Whether a "host rotation" list is needed (default proposed: no, change host per occurrence).

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
2. On sending, each invitee receives `ntf.event.invited.push`. An invitee who has no registered device receives `ntf.event.invited.sms` instead (GSM-7 safe, under 160 characters, with the event reference).
3. "The whole group" keeps up to date until the event starts: a member who joins the group later is invited automatically, and a member who leaves is removed from the invitee list.
4. The host or an inviter can add people later; only the added people are notified. Removing an invitee removes them from counts and notifies them with `ntf.event.uninvited.push` only if they had answered going or maybe.
5. Invitees see the event in their list with their RSVP state (EVT-04). A member who is not invited does not see the event, unless they hold Event: view on the group (open question).
6. Empty and error states: with zero invitees the send button is disabled with `event.invite.none_selected`; a failed send keeps the audience and shows Retry; a send in progress shows `Sending`.
7. The inviter sees `Sent to 18, 2 without a device by SMS` after sending, and the delivery status per channel as counts.
8. Audit: audience size, each person added or removed, channel and time are written to the audit log.
9. Accessibility and language: the member list is searchable with accents handled for Malagasy and French names, and selected state is shown by an icon and text.

**Data:** Event, Membership, RSVP, Notification, Device, Audit entry.
**Depends on:** EVT-01, GRP (membership list, join and leave events), NTF (push, SMS), ACC (device state).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether "the whole group" is dynamic (proposed) or a snapshot. Whether a link that shows the event without an account is added later (Tricount link model, raw/08 section 6.10).

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
1. The event card shows three buttons: Going, Maybe, No. One tap records the answer and shows a state chip with icon and text (`event.rsvp.going`, `event.rsvp.maybe`, `event.rsvp.no`).
2. The person can change the answer until the event starts, or until the RSVP deadline if one was set; after the deadline buttons are locked with `event.rsvp.closed`.
3. Counts are shown to everyone invited: Going, Maybe, No and No answer, as numbers. Names of who is going and maybe are visible to invitees (open question for the default); names of people who have not answered are visible only to the host and holders of Event: edit.
4. The count updates when the page opens and on pull-to-refresh; it does not tick live.
5. Offline: the tap is saved on the phone with `Saved on this phone` then `Waiting to send`, the chip shows the pending state, and sync follows. If the event started before sync, the answer is accepted but marked `Sent after start`.
6. Errors: an answer to a cancelled event is refused with `event.error.cancelled`; a failed send keeps the answer and shows Retry.
7. Notifications: no notification to others for each answer; the host receives a summary only when the RSVP deadline passes (`ntf.event.rsvp_summary.push`).
8. Audit: each change of answer is stored with time so that counts can be explained.
9. Accessibility and language: the three buttons are 48 by 48 dp with 8 dp spacing, never rely on colour alone, are announced as a radio group, and the labels are short enough to survive a 200 to 300% text expansion in Malagasy and French.

**Data:** RSVP, Event, Membership, Audit entry.
**Depends on:** EVT-01, EVT-03, XCT (offline queue).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether names of those going are visible to every invitee. Whether a person can add "plus guests" with a headcount (default proposed: no). Whether RSVP by SMS reply is added (needs inbound SMS), see the end of the file.

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
1. Each event starts with the default reminder times (EVENT_REMINDER_DEFAULTS). A holder of Event: edit can add, change or remove reminder times, up to EVENT_MAX_REMINDERS, each shown in words (`event.reminder.before`, for example "1 day before").
2. At each time the system sends `ntf.event.reminder.push` to invitees who answered Going or Maybe or have not answered. Invitees who answered No receive nothing.
3. If a person has not opened the push within EVENT_SMS_WAIT, or has no registered device, the system sends `ntf.event.reminder.sms` once for that reminder, within EVENT_SMS_CAP. A person who opened the push or the event gets no SMS.
4. The reminder shows title, weekday, date, time, place and host, and for SMS fits one GSM-7 segment in each language and ends with the event reference. The reminder shows the person's own RSVP state and a link to change it.
5. Reminders whose time has already passed when the event is created or edited are skipped, and the system does not send a late copy; invitees still receive the invitation or change notice.
6. Quiet hours apply to push; a reminder falling in quiet hours is sent when they end if the event has not started. The SMS rule in quiet hours follows NTF.
7. Each person can turn push reminders off per type in preferences and sees the consequence; SMS reminders for events cannot be turned off for a group event the person answered Going (open question).
8. States: delivery results are stored (sent, delivered, opened, failed) and the host sees counts, for example `3 SMS not delivered`, never names of people who ignored it.
9. Audit: each reminder, channel, time, result and the SMS count against the group budget are stored.

**Data:** Event, RSVP, Notification, Device, Audit entry.
**Depends on:** EVT-01, EVT-03, NTF (push, SMS, quiet hours, delivery status, SMS budget), ACC (language, device).
**Pages:** to be filled from the information architecture.
**Open questions:** Who pays for SMS (platform, group allowance, per-SMS). Default reminder times. Whether SMS should go only to people who answered Going or Maybe (raw/07 R-EV3 suggests so) to save cost.

---

### EVT-06 Change an event and tell everyone

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit
**Tags:** sms, audit

**Story:** As the host or a member who can edit, I want to change the date, time, place or host and have everyone told, so that nobody turns up at the wrong time.

**Conversation:** Change alerts are a first-class feature of group meeting objects (StokFella, raw/08 section 6.10), and the research on approvals insists that what people agreed to matches what they see (raw/07 section 8.4, the principle applies by analogy). A change to date or place invalidates earlier commitments, so answers are asked again.

**Preconditions:** The event exists, is Scheduled and has not ended.
**Trigger:** The person taps "Edit" and saves a change.

**Acceptance criteria:**
1. A change to start time, end time, date, place or host is a material change. A change to description or title is minor; for a minor change the editor chooses `Tell the group` or not.
2. A material change sends `ntf.event.changed.push` to all invitees with a plain sentence "was {old}, now {new}", and an SMS `ntf.event.changed.sms` to those who do not open the push within EVENT_SMS_WAIT or have no device.
3. After a change of date or time, those who answered Going or Maybe keep their answer but see `event.rsvp.reconfirm` and are asked to confirm again; counts show the reconfirm state (`Going, to confirm`).
4. Reminder times are recalculated from the new start; reminders already sent for the old time are not repeated.
5. The event page shows a short "Changed" line with who and when, and one tap shows the history of changes (old and new values).
6. Two people editing at once see the latest saved version and a message showing what changed (`event.edit.conflict`); no silent overwrite.
7. Errors: a new start in the past is refused with `event.error.past_date`; a save failure keeps the changes and shows Retry.
8. Offline: edits are blocked with an explanation, not queued, because they change what others see.
9. Audit: each change stores the old and new value, actor and time.

**Data:** Event, RSVP, Notification, Audit entry.
**Depends on:** EVT-01, EVT-03, EVT-04, EVT-05, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a small change in time (for example 15 minutes) should skip the reconfirm. Whether people can be allowed to decline after a change with a free reason.

---

### EVT-07 Cancel an event and tell everyone

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit
**Tags:** sms, audit

**Story:** As the host or a member who can edit, I want to cancel an event with a reason, so that people stop planning for it and know why.

**Conversation:** Cancelling must reach people who did not open the app, otherwise they travel for nothing, so SMS fallback applies to cancellations as to changes. The event stays visible as Cancelled so the group can see it happened, not deleted, in line with append-only principles (conventions section 2, applied by analogy).

**Preconditions:** The event is Scheduled and the person holds Event: edit.
**Trigger:** The person taps "Cancel event".

**Acceptance criteria:**
1. The person must choose a reason from presets (for example "date not possible", "not enough people", "other") and may add text. The button is labelled `Cancel the event` and the sheet shows how many people will be told.
2. On confirmation the status becomes Cancelled, the event remains in the list with a Cancelled chip, and reminders stop.
3. All invitees, whatever their answer, receive `ntf.event.cancelled.push`, and an SMS `ntf.event.cancelled.sms` if they do not open it within EVENT_SMS_WAIT or have no device.
4. For recurring events the person chooses "This event only", "This and following events" or "All events" (EVT-02).
5. A cancelled event cannot be answered (EVT-04) and cannot be edited back to Scheduled. A host who cancelled by mistake creates a new event (reopen is not in the MVP).
6. Linked project (EVT-09): the event stays in the project's list marked Cancelled.
7. Errors: cancelling an event that has already ended is refused with `event.error.already_ended`; a failed send keeps the reason and shows Retry.
8. Offline: blocked with an explanation, not queued.
9. Audit: reason, scope, actor, time and the notification counts are stored.

**Data:** Event, RSVP, Notification, Audit entry.
**Depends on:** EVT-01, EVT-02, EVT-05, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a reopen action is worth the complexity.

---

### EVT-08 See upcoming events as a list and as a calendar

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Event: view
**Tags:** offline

**Story:** When I plan my week, I want to see the group's events as a list and as a month calendar, so I can tell what is coming and what I have answered.

**Conversation:** The event list is part of the Follow step and the calendar is a table stake of the module (info.md, Events). The event and RSVP screen is number 24 in the MVP wireframe list (design-foundations section 5). Calendar is view only; two-way sync is out of v1 (competitive-analysis section 7; raw/08 section 6.10).

**Preconditions:** The person belongs to at least one group with events, or has personal dates (EVT-10).
**Trigger:** The person opens "Events".

**Acceptance criteria:**
1. The default is the upcoming list, grouped by day, nearest first. Each row shows title, weekday, date, time, place, host, the person's RSVP chip, the count going and a Cancelled chip when applicable.
2. A toggle switches to a month calendar. Days with events show a number or text count, never only a dot or a colour; tapping a day shows its events as a list below the grid.
3. Filters: all groups, one group, one project, and "I am going". The filter is remembered on the phone.
4. A Past tab shows events that have ended, newest first.
5. Empty states: `event.list.empty` with a "New event" button if the person holds Event: create, otherwise an explanation of who can create events.
6. Offline: the list and the calendar load from cache with `Last synced`, show events for the cached period, and say that newer changes need a connection. RSVP taps follow EVT-04 offline rules.
7. Loading shows skeleton rows; the calendar grid renders without blocking the list.
8. The first day of the week follows EVENT_WEEK_START; the month view is operable by keyboard and screen reader, and an equivalent list is always available.
9. Accessibility and language: dates are absolute with weekday in the viewer's language (Malagasy, French, English); rows are 48 dp tall at minimum; the layout reflows at 320 px.

**Data:** Event, RSVP, Group, Project.
**Depends on:** EVT-01, EVT-04, XCT (cache, last synced, language), EVT-10 (personal dates shown in the same view).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a week view is needed. Whether personal dates (EVT-10) appear in the same calendar by default or behind a toggle.

---

### EVT-09 Link an event to a project

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Event: edit and Project: view
**Tags:** audit

**Story:** As the owner of a project, I want to link its meetings and key dates to the project, so that the project page shows what is coming.

**Conversation:** Events belong to a user, group or project (info.md object model), and the project page lists "next dates" (raw/04 section 14.5). The project timeline merges them (PRJ-11, raw/08 section 6.9). A project deadline is not an event and is not converted into one automatically.

**Preconditions:** The event exists and a project exists in the same group, not Closed.
**Trigger:** The person picks "Project" in the event form, or taps "Add an event" on a project page.

**Acceptance criteria:**
1. An event can be linked to at most one project of the same group. The link is optional and can be removed.
2. From the project page, "Add an event" opens EVT-01 with the project prefilled and the audience offering "The project team" (EVT-03).
3. The project's Events section lists upcoming events first, then past ones, with title, date, host and a Cancelled chip when applicable.
4. The event card shows the project as a chip that opens the project when the person can view it; a person without Project: view sees the name only (open question) or nothing.
5. A Closed project accepts no new links; existing linked events stay and remain visible.
6. Events from a linked project can be filtered in the event list (EVT-08).
7. Errors: linking to a project of another group is not offered; linking a Cancelled event is allowed and shown as Cancelled.
8. Offline: linking is blocked with an explanation, not queued.
9. Audit: link and unlink with actor and time; no notification is sent for a link change unless the audience changes.

**Data:** Event, Project, Audit entry.
**Depends on:** EVT-01, EVT-03, PRJ-02, PRJ-11, GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether milestone dates should be proposed as events. Whether a person without Project: view should see the project name.

---

### EVT-10 Remember a date and keep a private note

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Individual
**Permission needed:** none (own entity)
**Tags:** offline

**Story:** When I need to remember a date, such as a payment I owe or a family event, I want to save it with a short note and get a reminder, so I do not forget without writing it elsewhere.

**Conversation:** Events, notes and dates to remember are one module for users, groups and projects (info.md, Events, notes and dates to remember). In the MVP the personal side is light: no sharing, no attachments. Group dates are events. SMS for personal reminders is off by default because of cost.

**Preconditions:** The person is signed in.
**Trigger:** The person taps "Remember a date" in Events.

**Acceptance criteria:**
1. The form asks for a title and a date (required), an optional yearly repeat, an optional note (plain text) and a reminder time chosen from presets (for example the day before and the morning of).
2. The date appears in the person's calendar and list (EVT-08) marked as personal, visible only to them.
3. The reminder is a push at the chosen time. A person who wants SMS turns on `Also send me an SMS` and sees that it may cost (the cost owner is an open question); the default is off.
4. A note can exist alone (no date) and is listed under "Notes" with the first line shown; it is private and cannot be shared in the MVP.
5. Offline: dates and notes are created and edited on the phone, shown as `Saved on this phone` then synced, and are readable offline.
6. Deleting a date or note removes it from the person's view after a confirmation; it does not affect any group data.
7. Empty states: `event.personal.empty` with one action.
8. Errors: empty title or an invalid date shows an inline message; a failed sync keeps the item and shows Retry.
9. Accessibility and language: a typed note keeps its language; labels follow the viewer's language; the repeat setting is stated in words.

**Data:** Event (personal), Note, Notification.
**Depends on:** ACC, NTF, XCT (offline), EVT-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether notes can be attached to a group, a project or an event and shared (default proposed: later). Cost of personal SMS reminders.

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
3. The export is a copy: later edits and cancellations in Gereo do not update the phone's calendar, and the sheet says so in words (`event.export.static`).
4. Offline, the button changes to "Copy details as text", which puts date, time, place and the event reference in a message the person can paste.
5. A person without a calendar app sees `event.export.no_calendar` and the text fallback.
6. A cancelled event exports as cancelled and the file is marked so.
7. Errors: a failure to hand off shows Retry and the text fallback.
8. Audit: none; the event content leaves the app only to the person who asked.
9. Accessibility and language: the export uses the viewer's language for the event details only if the host typed them in that language; fixed words follow the viewer's language.

**Data:** Event.
**Depends on:** EVT-01, EVT-02, XCT (offline fallback).
**Pages:** to be filled from the information architecture.
**Open questions:** A subscribable personal feed that would keep a calendar up to date needs a private token and a security review; not planned for the MVP.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| EVT-01 | Create an event for the group | P0 | GRP, NTF, XCT |
| EVT-02 | Repeat an event every week or every month | P1 | EVT-01, EVT-06, EVT-07, NTF |
| EVT-03 | Invite the whole group or chosen members | P0 | EVT-01, GRP, NTF, ACC |
| EVT-04 | Say "going", "maybe" or "no" in one tap and see who is coming | P0 | EVT-01, EVT-03, XCT |
| EVT-05 | Get automatic reminders, by push then SMS if not opened | P0 | EVT-01, EVT-03, NTF, ACC |
| EVT-06 | Change an event and tell everyone | P1 | EVT-01, EVT-03, EVT-04, EVT-05, NTF |
| EVT-07 | Cancel an event and tell everyone | P1 | EVT-01, EVT-02, EVT-05, NTF |
| EVT-08 | See upcoming events as a list and as a calendar | P0 | EVT-01, EVT-04, XCT |
| EVT-09 | Link an event to a project | P1 | EVT-01, EVT-03, PRJ-02, PRJ-11, GRP |
| EVT-10 | Remember a date and keep a private note | P2 | ACC, NTF, XCT, EVT-08 |
| EVT-11 | Add an event to my phone's calendar | P2 | EVT-01, EVT-02, XCT |

Count: 11 stories. P0: 5 (EVT-01, EVT-03, EVT-04, EVT-05, EVT-08). P1: 4 (EVT-02, EVT-06, EVT-07, EVT-09). P2: 2 (EVT-10, EVT-11).

## Cross-epic dependencies

Other epic files did not exist when this file was written. Names are the binding reference; IDs are to be reconciled.

- ACC: signed-in session, language preference, device registration (push versus SMS), personal items (EVT-10).
- WAL: none in the MVP. Payment attached to an event is out of scope.
- RUL: none.
- GRP: Events module enablement, membership list and join and leave events (EVT-03), permission bundles with Event permissions, group members removed from events.
- CON: none in the MVP. A contribution tied to an event's RSVP (raw/07 R-EV5) is out of scope; a contribution due date is shown by CON, not as an event.
- SPD: none.
- NTF: push and SMS templates for every `ntf.event.*` key, quiet hours, push-then-SMS wait, per-type preferences, delivery status, SMS budget and who pays.
- XCT: offline queue and states, `Last synced` banner, calendar and list components, language and number and date formats, accessibility.
- OPS: SMS incident handling, support.
- PRJ: PRJ-11 timeline reads events; EVT-09 uses the project page.
- VOT: none directly; a vote and an event can be mentioned together in a project timeline.

## Open questions

1. Who pays for SMS and what is the per-event or per-group cap (EVT-05, EVT-03). Needs the SMS aggregator quote (competitive-analysis section 10).
2. Default reminder times and whether SMS goes only to those who answered Going or Maybe (EVT-05; raw/07 R-EV3 is a hypothesis).
3. Whether names of those going are visible to every invitee, and whether people who did not answer are visible to the host (EVT-04).
4. Whether the whole-group audience is dynamic (proposed) or a snapshot (EVT-03).
5. RSVP by SMS reply and guest RSVP by link without an account: not in the MVP; both would need inbound SMS or a light session, as for guest votes (VOT-06). Priority P2 if confirmed.
6. Whether an event may carry a contribution or payment status (raw/07 R-EV5), which would depend on CON and WAL.
7. Whether a member can propose an event for approval by an authorised member (EVT-01).
8. Whether a reopen of a cancelled event is needed (EVT-07).
9. Which time zone applies when members travel (EVT-01); Madagascar uses one zone, but diaspora members may join.
