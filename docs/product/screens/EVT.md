# EVT: screen and state inventory

Source: `docs/product/stories/EVT.md` (11 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-EVT-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-EVT-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Permission names follow conventions section 7 (`Event: view`, `Event: create`, `Event: edit`, `Event: invite`). Event statuses: Draft, Scheduled, Cancelled, plus the computed marker Ended. RSVP answers: Going, Maybe, No; counts add No answer; markers To confirm and Sent after start. An event never moves money. Creating, editing, cancelling and linking an event are online only and on neither XCT-05 registry (`xct.offline.needs_connection`).

---

### EVT-01 Create an event for the group

**Story:** EVT-01 Create an event for the group

**Surfaces:**
- SCR-EVT-01 | Event form (create and edit: title up to 80 characters, start date and time with weekday and Madagascar label, end time, place text, description, audience, host, RSVP deadline, project link, reminder times, repeat; button `Create event`) | page | Member holding `Event: create` (`Event: invite` to notify the audience; `Event: edit` to edit) | Entry: "New event" on the group page or the event list (SCR-EVT-07); "Add an event" on a project page (EVT-09); Edit on SCR-EVT-06 | Exit: SCR-EVT-06 of the new event
- SCR-EVT-02 | Draft marker (`evt.draft.needs_invite`: visible only to the creator until someone with `Event: invite` sends the invitations) | inline (on SCR-EVT-01, SCR-EVT-06, SCR-EVT-07) | Creator only | Entry: saving without `Event: invite` | Exit: none
- SCR-EVT-03 | Host picker (any member of the group) | sheet | Creator or editor | Entry: host field of SCR-EVT-01 | Exit: SCR-EVT-01
- SCR-EVT-04 | Notification: invited (`msg.evt.invited`, EV-EVT-01, push and in-app; SMS variant for invitees with no registered device) | notification | Invitees | Entry: system on send | Exit: SCR-EVT-06
- SCR-EVT-05 | Notification: host left (`msg.evt.host_left`) | notification | The event's creator | Entry: system when the host is removed (GRP-17) or leaves (GRP-16) | Exit: SCR-EVT-06
- SCR-EVT-06 | Event page (event card: what, when with weekday, time and zone, where, host, who is going, three-button RSVP, project chip, Changed line, status and chips; stable reference) | page | Member holding `Event: view` on the group (invited members get RSVP; others read-only) | Entry: SCR-EVT-07, notification, SMS reference, project page | Exit: SCR-EVT-07, SCR-EVT-01 (edit)
- SCR-EVT-07 | Events list and calendar (upcoming list grouped by day; month calendar toggle; Past tab; filters; "New event"); the full states are under EVT-08 | page | Member holding `Event: view` | Entry: "Events", group page, group home next-event tile (GRP-06) | Exit: SCR-EVT-06, SCR-EVT-01

**States per surface:**
- SCR-EVT-01 default: required title, start date and time, audience (default the whole group); optional the rest; host defaults to the creator.
- SCR-EVT-01 past date: start in the past refused with `evt.error.past_date`.
- SCR-EVT-01 title error: empty title or title longer than 80 characters; inline message (key not specified); form never saves a partial event.
- SCR-EVT-01 saving: loading state; double tap guarded (not specified beyond "saving").
- SCR-EVT-01 failure: server failure; `evt.error.save_failed` with Retry; every field kept.
- SCR-EVT-01 offline: blocked with `xct.offline.needs_connection`; never created silently; nothing saved on the phone as a draft.
- SCR-EVT-01 archived group: precondition says the group is not archived (GRP-19); the form for an archived group is not specified.
- SCR-EVT-01 permission hidden: person without `Event: create`; "New event" not offered; the empty list gives an explanation (SCR-EVT-07).
- SCR-EVT-01 accessibility: labels always visible, 48 by 48 dp targets, date picker usable by keyboard and screen reader, typed title keeps its language.
- SCR-EVT-02 default: `evt.draft.needs_invite`; the Draft sends no notification and no reminder; the GRP-08 grant-time hint tells a granter that Event: create holders' events stay Draft without Event: invite.
- SCR-EVT-03 default: members listed; creator is default host.
- SCR-EVT-03 host gone: host removed or left; creator becomes fallback host; if the creator is also gone the next holder of `Event: edit` must choose a host before saving.
- SCR-EVT-04 default: invitation push and in-app; SMS variant direct for an invitee with no registered device (see EVT-03).
- SCR-EVT-05 default: `msg.evt.host_left` to the creator.
- SCR-EVT-06 Scheduled: invitations sent, start not reached.
- SCR-EVT-06 Draft: visible only to the creator.
- SCR-EVT-06 default fields: title, weekday, date, time, zone, place, host, counts, RSVP, project chip.
- SCR-EVT-07 new event: appears in the group's list and calendar when Scheduled; a Draft appears only to its creator marked Draft.

**Criteria map:**
- AC 1: SCR-EVT-01 default (required and optional fields, host default).
- AC 2: SCR-EVT-01 default and past date (`evt.error.past_date`, `Sat 25 Oct, 15:00`).
- AC 3: SCR-EVT-06 Scheduled, SCR-EVT-07 new event, SCR-EVT-04 default (`Create event`, `msg.evt.invited`, EV-EVT-01).
- AC 4: SCR-EVT-02 default (`evt.draft.needs_invite`, Draft status, no notification or reminder).
- AC 5: SCR-EVT-03 host gone, SCR-EVT-05 default (`msg.evt.host_left`).
- AC 6: SCR-EVT-01 offline and failure (`xct.offline.needs_connection`, `evt.error.save_failed`).
- AC 7: SCR-EVT-01 title error.
- AC 8: no UI, system rule (audit of creation, host, audience size, reminders, project link).
- AC 9: SCR-EVT-01 accessibility.

**Objects and fields:** Event (title, start, end, place, description, audience, host, RSVP deadline, project link, reminders, status, reference); Group; Membership; Audit entry; Notification.

**Open points:**
- AC 4 and the whole-group audience: who sees the Draft marker and what text does a person with `Event: invite` see to send the invitations of someone else's Draft (an "Invite" action on SCR-EVT-06)? Not specified in the story.
- Key for the title error message: not specified in the story.
- What happens to a Scheduled event when its group is archived (GRP-19)? EVT-05 says reminders stop; the event page state is not specified.
- Is a Draft that nobody invites ever expired or reminded? Not specified in the story.
- Notification `msg.evt.host_left` goes to the creator; if the creator was also the host who left, who is told? Not specified in the story.

---

### EVT-02 Repeat an event every week or every month

**Story:** EVT-02 Repeat an event every week or every month

**Surfaces:**
- SCR-EVT-08 | Repeat section (choices every week, every 2 weeks, every month on the same date, every month on the same weekday, every year; end: never, on a date, after a number of times; summary sentence `evt.repeat.summary`) | inline (section of SCR-EVT-01) | Holder of `Event: create` (set), `Event: edit` (change) | Entry: "Repeat" on SCR-EVT-01 | Exit: stays on SCR-EVT-01
- SCR-EVT-09 | Scope chooser ("This event only", "This and following events", "All events", states what will change) | sheet | Holder of `Event: edit` | Entry: Edit or Cancel on a recurring event | Exit: SCR-EVT-01 or SCR-EVT-32

**States per surface:**
- SCR-EVT-08 default: choices and end rule; summary sentence repeats the choice in plain words, for example the next three dates, before saving.
- SCR-EVT-08 short month: a monthly rule on a date the month lacks falls on the last day of that month; summary says so.
- SCR-EVT-08 horizon: occurrences generated up to `EVENT_RECURRENCE_HORIZON` (90 days, at most 14 ahead) and extended daily; list and calendar show each occurrence on its own.
- SCR-EVT-08 invitation: invitations sent once for the series with a note that it repeats; RSVP and reminders per occurrence.
- SCR-EVT-08 offline: online only (`xct.offline.needs_connection`).
- SCR-EVT-09 default: states what will change; edit scopes.
- SCR-EVT-09 past occurrence: changes to a past occurrence refused; message key not specified.
- SCR-EVT-09 host: host can be changed on one occurrence without changing the series (`evt.edit.host_this_one`).
- SCR-EVT-09 cancel: same three scopes as EVT-07.

**Criteria map:**
- AC 1: SCR-EVT-08 default.
- AC 2: SCR-EVT-08 default (`evt.repeat.summary`).
- AC 3: SCR-EVT-08 short month.
- AC 4: SCR-EVT-08 horizon.
- AC 5: SCR-EVT-08 invitation.
- AC 6: SCR-EVT-09 default and past occurrence.
- AC 7: SCR-EVT-09 cancel.
- AC 8: SCR-EVT-09 host (`evt.edit.host_this_one`).
- AC 9: no UI, system rule (audit of the rule, scope-based edits, cancelled occurrences).

**Objects and fields:** Event (series and occurrence, repeat rule, end rule); RSVP; Audit entry.

**Open points:**
- Key for refusing a change to a past occurrence: not specified in the story.
- "Every month on the same weekday (for example the first Sunday)": what happens for a fifth weekday that a month lacks? Not specified in the story.
- How is an invitee told about a series change "This and following events" (one `msg.evt.changed` per series or per occurrence)? Not specified in the story.
- Does a person joining the group later get invited to the series or only to upcoming occurrences? Not specified in the story.

---

### EVT-03 Invite the whole group or chosen members

**Story:** EVT-03 Invite the whole group or chosen members

**Surfaces:**
- SCR-EVT-10 | Audience selector ("The whole group" default, "Pick members" with searchable list and count, "The project team" when linked to a project) | inline (section of SCR-EVT-01) | Holder of `Event: invite` | Entry: audience field of SCR-EVT-01 | Exit: stays on SCR-EVT-01
- SCR-EVT-11 | Invite sheet (add people to an existing event; shows channel counts and the NTF-06 SMS estimate before sending) | sheet | Holder of `Event: invite` | Entry: "Invite" on SCR-EVT-06 | Exit: SCR-EVT-06
- SCR-EVT-12 | Send result line (`Sent to 18, 2 without a device by SMS`, delivery status per channel as counts, `Sending`) | inline (on SCR-EVT-06 for the inviter) | Inviter | Entry: after sending | Exit: none
- SCR-EVT-13 | Notification: uninvited (`msg.evt.uninvited`) | notification | A removed invitee who had answered Going or Maybe | Entry: system on removal | Exit: SCR-EVT-07
- SCR-EVT-14 | System: audience upkeep and invitation SMS rules (whole group stays dynamic until the event starts; `grp.invite_sms_per_day`; NTF suppression list) | system | none | Entry: join (GRP-04), leave (GRP-16), removal (GRP-17), send | Exit: invite or drop

**States per surface:**
- SCR-EVT-10 default: whole group preselected; "Pick members" with searchable list, selected state by icon and text, accents handled.
- SCR-EVT-10 project team: option offered only when the event is linked to a project (EVT-09).
- SCR-EVT-10 none selected: zero invitees; send button disabled with `evt.invite.none_selected`.
- SCR-EVT-11 default: add people later; only the added people are notified.
- SCR-EVT-11 remove: removing an invitee removes them from counts.
- SCR-EVT-11 sending: `Sending`.
- SCR-EVT-11 failure: audience kept, Retry shown.
- SCR-EVT-11 limit reached: invitation SMS over `grp.invite_sms_per_day` per member per day; behaviour and key not specified in the story.
- SCR-EVT-11 estimate: SMS cost shown through the NTF-06 estimate before sending (also in the OPS-12 cost view).
- SCR-EVT-12 default: `Sent to 18, 2 without a device by SMS`; delivery status per channel as counts.
- SCR-EVT-13 default: `msg.evt.uninvited` only if the person had answered Going or Maybe.
- SCR-EVT-14 whole group: new member invited automatically; leaver or removed member dropped from invitees and counts.
- SCR-EVT-14 SMS: invitee with no registered device gets the SMS variant direct (no push step, NTF-11), GSM-7 safe, under 160 characters, with the event reference, charged to the group allowance; suppression list checked.
- SCR-EVT-14 non-invited member: a member with `Event: view` sees every group event read-only, without RSVP buttons and not counted.

**Criteria map:**
- AC 1: SCR-EVT-10 default and project team.
- AC 2: SCR-EVT-04 (SMS variant), SCR-EVT-11 estimate and limit reached, SCR-EVT-14 SMS.
- AC 3: SCR-EVT-14 whole group.
- AC 4: SCR-EVT-11 default and remove, SCR-EVT-13 default (`msg.evt.uninvited`).
- AC 5: SCR-EVT-06 (invitee RSVP state in list) and SCR-EVT-14 non-invited member.
- AC 6: SCR-EVT-10 none selected, SCR-EVT-11 failure and sending (`evt.invite.none_selected`, `Sending`).
- AC 7: SCR-EVT-12 default.
- AC 8: no UI, system rule (audit of audience size, additions, removals, channel, time).
- AC 9: SCR-EVT-10 default (searchable, accents, icon plus text).

**Objects and fields:** Event (audience, invitees); Membership; RSVP; Notification (channel, delivery); Device; Audit entry.

**Open points:**
- The SMS variant of `msg.evt.invited` does not yet exist in the NTF catalogue ("to be added by NTF"); until then the SMS invitation has no key. Not specified in the story.
- AC 2 states invitation SMS are limited by `grp.invite_sms_per_day`, a parameter conventions assigns to GRP-03 invitations; does the same cap apply to event invitations and what does the inviter see at the limit? Not specified in the story.
- "The project team" audience when the project team changes later (static or dynamic)? Not specified in the story.
- What does a removed-then-re-invited person see? Not specified in the story.

---

### EVT-04 Say "going", "maybe" or "no" in one tap and see who is coming

**Story:** EVT-04 Say "going", "maybe" or "no" in one tap and see who is coming

**Surfaces:**
- SCR-EVT-15 | RSVP buttons and chip (Going, Maybe, No as a radio group; sticky state chip `evt.rsvp.going`, `evt.rsvp.maybe`, `evt.rsvp.no`; `evt.rsvp.closed`) | inline (on SCR-EVT-06 and rows of SCR-EVT-07) | Invited member holding `Event: view` | Entry: SCR-EVT-06, reminder | Exit: none
- SCR-EVT-16 | RSVP counts and names (Going, Maybe, No, No answer as numbers; names of Going and Maybe to invitees; names of No and No answer only to `Event: edit` holders) | inline (on SCR-EVT-06) | Anyone who can see the event (names by permission) | Entry: SCR-EVT-06 | Exit: none
- SCR-EVT-17 | Notification: RSVP saved (`msg.evt.rsvp_saved`, EV-EVT-07, in-app only) | notification | The responder | Entry: system after an answer | Exit: SCR-EVT-06
- SCR-EVT-18 | Notification: RSVP deadline nudge (`msg.evt.rsvp_deadline`, EV-EVT-04, private) | notification | An invitee with no answer | Entry: system `EVENT_RSVP_NUDGE` (24 h) before the RSVP deadline | Exit: SCR-EVT-06
- SCR-EVT-19 | Notification: RSVP summary (`msg.evt.rsvp_summary`) | notification | Holders of `Event: edit` | Entry: system when the RSVP deadline passes | Exit: SCR-EVT-06

**States per surface:**
- SCR-EVT-15 default: three buttons, one tap records the answer; 48 by 48 dp with 8 dp spacing, never colour alone, radio group, labels survive 200 to 300% expansion.
- SCR-EVT-15 changed: person can change the answer until the event starts or until the RSVP deadline.
- SCR-EVT-15 closed: after the deadline buttons are locked with `evt.rsvp.closed`.
- SCR-EVT-15 offline: tap shows `Waiting to send` (XCT-05 Table A, class none); chip shows the pending state; sends itself when the app is open with signal.
- SCR-EVT-15 sent after start: event started before sync; answer accepted with the marker `Sent after start`.
- SCR-EVT-15 cancelled: answer to a cancelled event refused with `evt.error.cancelled`.
- SCR-EVT-15 failure: answer kept, Retry shown.
- SCR-EVT-15 not invited: no buttons for a member who is not invited (EVT-03).
- SCR-EVT-15 To confirm: marker added after a material change (EVT-06); `evt.rsvp.reconfirm` (see SCR-EVT-28).
- SCR-EVT-16 default: counts update when the page opens and on pull-to-refresh, not live.
- SCR-EVT-16 names: Going and Maybe names to invitees; No and No answer names only to `Event: edit`.
- SCR-EVT-16 offline: counts from cache; marking not specified.
- SCR-EVT-17 default: in-app item to the responder; nothing to others for each answer.
- SCR-EVT-18 default: one private nudge; no nudge when the deadline is less than 24 h after the invitation.
- SCR-EVT-19 default: summary of counts to `Event: edit` holders; a person is never named in a group-visible message for not answering.

**Criteria map:**
- AC 1: SCR-EVT-15 default.
- AC 2: SCR-EVT-15 changed and closed (`evt.rsvp.closed`).
- AC 3: SCR-EVT-16 default and names.
- AC 4: SCR-EVT-16 default (no live tick).
- AC 5: SCR-EVT-15 offline and sent after start.
- AC 6: SCR-EVT-15 cancelled and failure (`evt.error.cancelled`).
- AC 7: SCR-EVT-17, SCR-EVT-18, SCR-EVT-19 default (`msg.evt.rsvp_saved`, `msg.evt.rsvp_deadline`, `msg.evt.rsvp_summary`).
- AC 8: no UI, system rule (audit of each change with time).
- AC 9: SCR-EVT-15 default (accessibility).

**Objects and fields:** RSVP (answer, time, marker); Event (RSVP deadline, status); Membership; Audit entry; Notification.

**Open points:**
- `msg.evt.rsvp_summary` is not yet in the NTF catalogue (listed as a request to NTF). Key and EV ID are not specified in the story.
- Key for the pending RSVP chip text: not specified beyond the XCT-05 `Waiting to send` label.
- What does a person with no answer see after the RSVP deadline passes (locked buttons with no answer)? Not specified in the story.
- Does `Sent after start` show to the host in the counts? Not specified in the story.

---

### EVT-05 Get automatic reminders, by push then SMS if not opened

**Story:** EVT-05 Get automatic reminders, by push then SMS if not opened

**Surfaces:**
- SCR-EVT-20 | Reminder times section (defaults 24 h and 2 h; add or remove presets from 1 week, 3 days, 24 h, 2 h up to `EVENT_MAX_REMINDERS`; shown in words `evt.reminder.before`) | inline (section of SCR-EVT-01) | Holder of `Event: edit` | Entry: SCR-EVT-01 | Exit: stays on SCR-EVT-01
- SCR-EVT-21 | Notification: 24 h reminder (`msg.evt.reminder_24h`, EV-EVT-02; push and in-app, SMS after the NTF window) | notification | Invitees Going, Maybe or no answer | Entry: system at the 24 h offset | Exit: SCR-EVT-06
- SCR-EVT-22 | Notification: 2 h reminder (`msg.evt.reminder_2h`, EV-EVT-03; push, in-app, SMS) | notification | Invitees Going or Maybe, and invitees with no registered device | Entry: system at the 2 h offset | Exit: SCR-EVT-06
- SCR-EVT-23 | Notification: early reminder (`msg.evt.reminder_early`, push and in-app only) | notification | Same audience as the 24 h reminder | Entry: system at the 1 week and 3 day offsets | Exit: SCR-EVT-06
- SCR-EVT-24 | Reminder delivery counts for the host (for example `3 SMS Unreachable`, NTF delivery vocabulary, no names) | inline (on SCR-EVT-06) | Host and `Event: edit` holders | Entry: SCR-EVT-06 | Exit: none
- SCR-EVT-25 | "SMS is off" note (`evt.reminder.sms_off`) | inline (on SCR-EVT-06) | The person who stopped SMS | Entry: SCR-EVT-06 | Exit: NTF-10 settings
- SCR-EVT-26 | System: reminder scheduler (offsets, audience, SMS fallback once per reminder, skip of past times, stop on cancel or archive, quiet hours) | system | none | Entry: Scheduled event with invitees | Exit: SCR-EVT-21 to SCR-EVT-23

**States per surface:**
- SCR-EVT-20 default: each new event starts with 24 h and 2 h; free-form times not offered.
- SCR-EVT-20 limit: `EVENT_MAX_REMINDERS` (3) reached; further presets disabled (key not specified).
- SCR-EVT-20 permission hidden: person without `Event: edit`; times read-only.
- SCR-EVT-21 push: invitees who answered Going or Maybe or have not answered; those who answered No receive nothing.
- SCR-EVT-21 SMS fallback: only if the push was not opened within `ntf.sms_window` for that offset (240 minutes for 24 h), only to invitees Going or Maybe and to invitees with no device who have not answered No; an invitee with a device who has not answered gets push and in-app only.
- SCR-EVT-22 SMS fallback: window 30 minutes for the 2 h reminder, same audience rule; a person who opened the push or the event gets no SMS; answering Going does not cancel the reminder SMS.
- SCR-EVT-21 content: title, weekday, date, time, place, host, the person's RSVP state and a link to change it; SMS fits one GSM-7 segment per language and ends with the event reference.
- SCR-EVT-23 default: push and in-app only; no SMS.
- SCR-EVT-24 default: counts such as `3 SMS Unreachable`, never names of people who ignored it; names only in the NTF-12 operator trace.
- SCR-EVT-25 default: person who stopped SMS (NTF-04, NTF-10) gets no event SMS even after answering Going; the page says SMS is off for them.
- SCR-EVT-26 past times: reminders whose time passed when the event is created or edited are skipped, no late copy.
- SCR-EVT-26 stopped: event Cancelled or group archived (GRP-19); all scheduled reminders stop.
- SCR-EVT-26 quiet hours: placement of a reminder or planned fallback SMS inside quiet hours follows NTF-09 only.
- SCR-EVT-26 caps: per-person daily cap, group allowance and opt-out follow NTF-05, NTF-06, NTF-10; behaviour at cap not shown by this story.

**Criteria map:**
- AC 1: SCR-EVT-20 default and limit (`evt.reminder.before`, presets, max).
- AC 2: SCR-EVT-21, SCR-EVT-22, SCR-EVT-23 (audience per reminder; No answerers receive nothing).
- AC 3: SCR-EVT-21 SMS fallback and SCR-EVT-22 SMS fallback (NTF-05 window, audience, Going does not cancel).
- AC 4: SCR-EVT-21 content.
- AC 5: SCR-EVT-26 past times and stopped.
- AC 6: SCR-EVT-26 quiet hours.
- AC 7: SCR-EVT-25 default (`evt.reminder.sms_off`).
- AC 8: SCR-EVT-24 default.
- AC 9: no UI, system rule (reminders, channel, time, result and allowance count stored by NTF-12).

**Objects and fields:** Event (reminder times); RSVP; Notification (key, channel, time, result); Device; Audit entry.

**Open points:**
- `msg.evt.reminder_early` is not yet in the NTF catalogue (request to NTF). Key and EV ID not specified in the story.
- EVT-05 AC 2 and EV-EVT-03 audience: the story asks NTF to align the 2-hour audience (Going and Maybe plus invitees with no device); confirm the catalogue row.
- NTF-05 criterion 4 must not treat RSVP as resolving a reminder (request to NTF); confirm the change is made.
- Message when the group SMS allowance or the daily cap is exhausted: not shown to the host by this story.
- Late-added invitee (after the 24 h offset passed): do they get the reminder for later offsets only? Not specified in the story.

---

### EVT-06 Change an event and tell everyone

**Story:** EVT-06 Change an event and tell everyone

**Surfaces:**
- SCR-EVT-27 | Change history ("Changed" line with who and when; one tap shows old and new values) | sheet (opened from an inline line on SCR-EVT-06) | Member who can view the event | Entry: "Changed" line on SCR-EVT-06 | Exit: SCR-EVT-06
- SCR-EVT-28 | Reconfirm prompt (`evt.rsvp.reconfirm`, counts show `Going, to confirm`) | inline (on SCR-EVT-06) | Invitees who answered Going or Maybe | Entry: after a change of date or time | Exit: SCR-EVT-15
- SCR-EVT-29 | Notification: event changed (`msg.evt.changed`, EV-EVT-05, push and in-app with "was {old}, now {new}", SMS fallback) | notification | Invitees who have not answered No | Entry: system on a material change | Exit: SCR-EVT-06
- SCR-EVT-30 | "Tell the group" choice for a minor change (title or description) | inline (on SCR-EVT-01 in edit mode) | Holder of `Event: edit` | Entry: save of a minor change | Exit: stays on SCR-EVT-01
- SCR-EVT-31 | Edit conflict message (`evt.edit.conflict`, shows what changed) | inline (on SCR-EVT-01 in edit mode) | The second editor | Entry: save against a stale version | Exit: SCR-EVT-01 on the latest version

Edit uses SCR-EVT-01 in edit mode.

**States per surface:**
- SCR-EVT-01 edit: only for a Scheduled event that has not ended; holder of `Event: edit` can change start, end, date, place, host (material) and title or description (minor).
- SCR-EVT-01 edit past date: new start in the past refused with `evt.error.past_date`.
- SCR-EVT-01 edit failure: save failure keeps the changes, Retry shown.
- SCR-EVT-01 edit offline: blocked with an explanation, not queued (`xct.offline.needs_connection`).
- SCR-EVT-27 default: change entries with old value, new value, actor, time.
- SCR-EVT-28 date or time change: Going and Maybe keep their answer and receive the marker To confirm; asked to confirm again.
- SCR-EVT-28 small shift: a shift of 15 minutes or less in the start time does not set the marker; the notice is still sent.
- SCR-EVT-28 place or host change: no new answer asked.
- SCR-EVT-29 material: sent by push and in-app to invitees who have not answered No; SMS to those who do not open the push within the NTF window for this event type (NTF-05) or have no device.
- SCR-EVT-29 host change: material for invitees but not in the EV-EVT-05 trigger today (date, time, place), so NTF must add it.
- SCR-EVT-30 minor: editor chooses `Tell the group` or not.
- SCR-EVT-31 default: latest saved version shown with what changed; no silent overwrite.
- Reminders: recalculated from the new start; reminders already sent for the old time are not repeated.

**Criteria map:**
- AC 1: SCR-EVT-01 edit and SCR-EVT-30 minor (material versus minor).
- AC 2: SCR-EVT-29 material and host change (`msg.evt.changed`).
- AC 3: SCR-EVT-28 date or time change, small shift, place or host change (`evt.rsvp.reconfirm`, `Going, to confirm`).
- AC 4: no UI, system rule (reminders recalculated from the new start; sent ones not repeated).
- AC 5: SCR-EVT-27 default.
- AC 6: SCR-EVT-31 default (`evt.edit.conflict`).
- AC 7: SCR-EVT-01 edit past date and failure.
- AC 8: SCR-EVT-01 edit offline.
- AC 9: no UI, system rule (old and new value, actor, time).

**Objects and fields:** Event (changed fields, history); RSVP (To confirm marker); Notification; Audit entry.

**Open points:**
- The host change is material for invitees but not in the EV-EVT-05 trigger (date, time, place); NTF must add it (story and epic summary).
- Key for the minor-change `Tell the group` control: not specified in the story.
- For a recurring event, which scope applies to an edit, and does the To confirm marker apply per occurrence? Not specified in the story (see EVT-02).
- A change made while the event is a Draft: no notice, but is there a history line? Not specified in the story.

---

### EVT-07 Cancel an event and tell everyone

**Story:** EVT-07 Cancel an event and tell everyone

**Surfaces:**
- SCR-EVT-32 | Cancel event sheet (reason presets such as "date not possible", "not enough people", "other" plus optional text; count of people who will be told; button `Cancel the event`; scope choice for recurring events via SCR-EVT-09) | sheet | Holder of `Event: edit` | Entry: "Cancel event" on SCR-EVT-06 | Exit: SCR-EVT-06 Cancelled
- SCR-EVT-33 | Notification: event cancelled (`msg.evt.cancelled`, EV-EVT-06, push and in-app; SMS after the NTF window or when no device; invitees who answered No get an in-app item only) | notification | Invitees | Entry: system on cancel | Exit: SCR-EVT-06

**States per surface:**
- SCR-EVT-32 default: reason required; shows how many people will be told.
- SCR-EVT-32 recurring: choose "This event only", "This and following events" or "All events".
- SCR-EVT-32 already ended: refused with `evt.error.already_ended`.
- SCR-EVT-32 failure: a failed send keeps the reason; Retry shown.
- SCR-EVT-32 offline: blocked with an explanation, not queued.
- SCR-EVT-32 hidden: person without `Event: edit`; action not shown.
- SCR-EVT-06 Cancelled: status Cancelled; stays in the list with a Cancelled chip; reminders stop; cannot be answered (`evt.error.cancelled`) and cannot be edited back to Scheduled; a mistaken cancellation is fixed by creating a new event.
- SCR-EVT-06 linked project: the event stays in the project's list marked Cancelled.
- SCR-EVT-33 default: invitees who have not answered No receive push and in-app; SMS if not opened in the NTF window or no device.
- SCR-EVT-33 No answerers: in-app item only.

**Criteria map:**
- AC 1: SCR-EVT-32 default (reason, `Cancel the event`, number told).
- AC 2: SCR-EVT-06 Cancelled.
- AC 3: SCR-EVT-33 default and No answerers (`msg.evt.cancelled`, EV-EVT-06).
- AC 4: SCR-EVT-32 recurring.
- AC 5: SCR-EVT-06 Cancelled (no answers, no reopen).
- AC 6: SCR-EVT-06 linked project.
- AC 7: SCR-EVT-32 already ended and failure (`evt.error.already_ended`).
- AC 8: SCR-EVT-32 offline.
- AC 9: no UI, system rule (reason, scope, actor, time, notification counts).

**Objects and fields:** Event (status, cancel reason, scope); RSVP; Notification; Audit entry.

**Open points:**
- Are the reason presets given keys? The story lists examples ("date not possible", "not enough people", "other"); the final list and keys are not specified in the story.
- Is the cancel reason shown to invitees on SCR-EVT-06 and in the notification? The story says "know why"; the placement is not specified.
- Cancelling a Draft event (never invited): allowed? Not specified in the story (precondition says Scheduled).

---

### EVT-08 See upcoming events as a list and as a calendar

**Story:** EVT-08 See upcoming events as a list and as a calendar

**Surfaces:**
- SCR-EVT-07 is defined under EVT-01 (Events list and calendar, entries "Events", exits SCR-EVT-06 and SCR-EVT-40); this story adds the states below for an individual with personal dates as well as members holding `Event: view`.
- SCR-EVT-34 | Month calendar view (toggle; days show a number or text count; tap a day for its events below the grid; first day from `EVENT_WEEK_START`; equivalent list always available) | inline (view of SCR-EVT-07) | Same as SCR-EVT-07 | Entry: toggle on SCR-EVT-07 | Exit: SCR-EVT-06
- SCR-EVT-35 | Filter sheet (all groups, one group, one project, "I am going", "Not personal"; remembered on the phone) | sheet | Same as SCR-EVT-07 | Entry: filter button | Exit: SCR-EVT-07
- SCR-EVT-36 | Past tab (events that have ended, newest first) | inline (tab of SCR-EVT-07) | Same as SCR-EVT-07 | Entry: tab | Exit: SCR-EVT-06

**States per surface:**
- SCR-EVT-07 default: upcoming list grouped by day, nearest first; row shows title, weekday, date, time, place, host, the person's RSVP chip, count going, Cancelled chip when applicable.
- SCR-EVT-07 draft rows: Draft events appear only to their creator, marked Draft.
- SCR-EVT-07 personal dates: shown by default marked personal, hidden by the filter "Not personal".
- SCR-EVT-07 empty: `evt.list.empty` with "New event" if the person holds `Event: create`, otherwise an explanation of who can create events.
- SCR-EVT-07 loading: skeleton rows; calendar grid renders without blocking the list.
- SCR-EVT-07 offline: list and calendar load from cache with `Last synced`, events for the cached period; says newer changes need a connection; RSVP taps follow EVT-04 offline rules.
- SCR-EVT-07 accessibility: dates absolute with weekday in the viewer's language; rows at least 48 dp tall; reflows at 320 px.
- SCR-EVT-34 default: day cells with a number or text count, never only a dot or colour; keyboard and screen-reader operable.
- SCR-EVT-34 day selected: events of that day listed below the grid.
- SCR-EVT-35 default: filters; remembered.
- SCR-EVT-36 default: ended events newest first.

**Criteria map:**
- AC 1: SCR-EVT-07 default.
- AC 2: SCR-EVT-34 default and day selected.
- AC 3: SCR-EVT-35 default and SCR-EVT-07 draft rows.
- AC 4: SCR-EVT-36 default.
- AC 5: SCR-EVT-07 empty (`evt.list.empty`).
- AC 6: SCR-EVT-07 offline.
- AC 7: SCR-EVT-07 loading.
- AC 8: SCR-EVT-34 default (`EVENT_WEEK_START`, keyboard, list equivalent).
- AC 9: SCR-EVT-07 accessibility.

**Objects and fields:** Event (title, date, time, place, host, status); RSVP (own answer, count going); Group; Project; Personal event.

**Open points:**
- Is there a "No results" state when the filters match no event? Not specified in the story.
- What does the Past tab show for personal dates and cancelled events? Not specified in the story.
- Where does a member with no group (individual only) see group filters? Not specified in the story.
- Offline text "newer changes need a connection": key not specified (story forbids no specific word here).

---

### EVT-09 Link an event to a project

**Story:** EVT-09 Link an event to a project

**Surfaces:**
- SCR-EVT-37 | Project link field in the event form ("Project", at most one project of the same group, removable) | inline (section of SCR-EVT-01) | Holder of `Event: edit` and `Project: view` | Entry: "Project" in SCR-EVT-01, "Add an event" on a project page | Exit: stays on SCR-EVT-01
- SCR-EVT-38 | Project Events section (upcoming first then past; title, date, host, Cancelled chip) | inline (on the project page SCR-PRJ-07) | Holder of `Project: view` | Entry: project page | Exit: SCR-EVT-06
- SCR-EVT-39 | Project chip on the event card (opens the project when the person holds `Project: view`; plain text otherwise) | inline (on SCR-EVT-06) | Anyone who can view the event | Entry: SCR-EVT-06 | Exit: SCR-PRJ-07

**States per surface:**
- SCR-EVT-37 default: project picker lists only Active or On hold projects of the same group the person can view; link optional and removable.
- SCR-EVT-37 from project: "Add an event" opens SCR-EVT-01 with the project prefilled and the audience offering "The project team".
- SCR-EVT-37 closed project: a Closed project accepts no new links; existing linked events stay visible.
- SCR-EVT-37 other group: linking to a project of another group not offered.
- SCR-EVT-37 cancelled event: linking a Cancelled event allowed and shown as Cancelled.
- SCR-EVT-37 offline: blocked with an explanation, not queued.
- SCR-EVT-37 no notification: link change sends no notification unless the audience changes.
- SCR-EVT-38 default: list with title, date, host and Cancelled chip.
- SCR-EVT-38 empty: not specified in the story.
- SCR-EVT-39 with permission: chip opens the project.
- SCR-EVT-39 without permission: project name as plain text without a link.
- SCR-EVT-07 filter: events from a linked project can be filtered in the list (EVT-08).

**Criteria map:**
- AC 1: SCR-EVT-37 default (at most one project, optional, removable).
- AC 2: SCR-EVT-37 from project.
- AC 3: SCR-EVT-38 default.
- AC 4: SCR-EVT-39 with and without permission.
- AC 5: SCR-EVT-37 closed project.
- AC 6: SCR-EVT-07 filter (SCR-EVT-35).
- AC 7: SCR-EVT-37 other group and cancelled event.
- AC 8: SCR-EVT-37 offline.
- AC 9: no UI, system rule (audit of link and unlink; no notification unless the audience changes).

**Objects and fields:** Event (project link); Project (name, status, team); Audit entry.

**Open points:**
- PRJ-09 says a Closed project "accepts no new event link" while PRJ-02 lists the Events section as part of the project page; does the "Add an event" button on a Closed project show disabled with a reason (09 section 6.3 rule 5) or is it hidden? Not specified in the story.
- Does unlinking an event from a Closed project work? Not specified in the story.
- Empty state of the project's Events section: key not specified in the story.

---

### EVT-10 Remember a date and keep a private note

**Story:** EVT-10 Remember a date and keep a private note

**Surfaces:**
- SCR-EVT-40 | Remember a date form (title and date required, optional yearly repeat, optional plain-text note, reminder time from presets such as the day before and the morning of) | page | The individual, private | Entry: "Remember a date" in Events | Exit: SCR-EVT-07
- SCR-EVT-41 | Notes list ("Notes" with the first line shown; a note may exist alone without a date; `evt.personal.empty`) | inline (section of SCR-EVT-07) | The individual, private | Entry: SCR-EVT-07 | Exit: SCR-EVT-40
- SCR-EVT-42 | Delete confirmation for a date or note | modal | The individual | Entry: delete action | Exit: SCR-EVT-41
- SCR-EVT-43 | Notification: personal date reminder (push and in-app at the chosen time; key not named in the story) | notification | The individual | Entry: system at the chosen time, quiet hours per NTF-09 | Exit: SCR-EVT-07

**States per surface:**
- SCR-EVT-40 default: fields; date appears in the person's calendar and list marked personal, visible only to them.
- SCR-EVT-40 validation: empty title or invalid date; inline message (key not specified).
- SCR-EVT-40 offline: created and edited on the phone, shown as `Waiting to send`, sent by themselves when the app is open with signal (XCT-05 Table A personal date and note rows, class none); a reminder set offline is scheduled on the phone and registered on the server at sync.
- SCR-EVT-40 sync failure: item kept, Retry shown.
- SCR-EVT-40 SMS: no SMS offered for personal dates.
- SCR-EVT-41 default: notes private, cannot be shared in the MVP, cannot be attached to a group, project or event.
- SCR-EVT-41 empty: `evt.personal.empty` with one action.
- SCR-EVT-41 offline: readable offline.
- SCR-EVT-42 default: confirmation; deleting removes it from the person's view; does not affect any group data.
- SCR-EVT-43 default: push and in-app only.

**Criteria map:**
- AC 1: SCR-EVT-40 default.
- AC 2: SCR-EVT-40 default (marked personal in calendar and list).
- AC 3: SCR-EVT-43 default and SCR-EVT-40 SMS (no SMS; quiet hours per NTF-09).
- AC 4: SCR-EVT-41 default.
- AC 5: SCR-EVT-40 offline and SCR-EVT-41 offline.
- AC 6: SCR-EVT-42 default.
- AC 7: SCR-EVT-41 empty (`evt.personal.empty`).
- AC 8: SCR-EVT-40 validation and sync failure.
- AC 9: SCR-EVT-40 default (language of note, repeat stated in words).

**Objects and fields:** Event (personal: title, date, yearly repeat, reminder time); Note (text, optional date); Notification.

**Open points:**
- The personal reminder notification has no `msg.evt.*` key or EV row named; NTF owns the catalogue. Which key is it? Not specified in the story.
- Preset reminder choices are examples only ("the day before and the morning of"); the final list is not specified in the story.
- Does a repeating personal date show in the Past tab each year? Not specified in the story.

---

### EVT-11 Add an event to my phone's calendar

**Story:** EVT-11 Add an event to my phone's calendar

**Surfaces:**
- SCR-EVT-44 | Add to my calendar sheet (hands a standard calendar file to the phone's calendar through share or open; static-copy notice `evt.export.static`; offline text fallback "Copy details as text"; `evt.export.no_calendar`) | sheet | Member holding `Event: view` | Entry: "Add to my calendar" on SCR-EVT-06 | Exit: SCR-EVT-06

**States per surface:**
- SCR-EVT-44 default: file with title, start, end, place, description and a link back to the event; sheet says later edits and cancellations in Gereo do not update the phone's calendar (`evt.export.static`).
- SCR-EVT-44 recurring: a recurring event exports its repeat rule; an occurrence exports as a single event.
- SCR-EVT-44 cancelled: a cancelled event exports as cancelled and the file is marked so.
- SCR-EVT-44 offline: button changes to "Copy details as text" (date, time, place, event reference) from the cache.
- SCR-EVT-44 no calendar app: `evt.export.no_calendar` and the text fallback.
- SCR-EVT-44 hand-off failure: Retry and the text fallback.
- SCR-EVT-44 language: event details only in the host's typed language; fixed words follow the viewer's language.

**Criteria map:**
- AC 1: SCR-EVT-44 default.
- AC 2: SCR-EVT-44 recurring.
- AC 3: SCR-EVT-44 default (`evt.export.static`).
- AC 4: SCR-EVT-44 offline.
- AC 5: SCR-EVT-44 no calendar app (`evt.export.no_calendar`).
- AC 6: SCR-EVT-44 cancelled.
- AC 7: SCR-EVT-44 hand-off failure.
- AC 8: no UI, system rule (no audit).
- AC 9: SCR-EVT-44 language.

**Objects and fields:** Event (title, start, end, place, description, link, repeat rule, status).

**Open points:**
- Key for the "Copy details as text" label and the copied message template: not specified in the story.
- Does exporting a Draft event work for its creator? Not specified in the story (precondition: Scheduled or Cancelled).
- Does an exported personal date use the same sheet? Not specified in the story (permission `Event: view`; EVT-10 is separate).

## Epic summary

Stories: 11.
Distinct surfaces: 44 (inline 18, modal 1, notification 12, page 4, sheet 7, system 2).
State lines: 133.
Open points: 42.

All open points:

1. EVT-01: AC 4 and the whole-group audience: who sees the Draft marker and what text does a person with `Event: invite` see to send the invitations of someone else's Draft (an "Invite" action on SCR-EVT-06)? Not specified in the story.
2. EVT-01: Key for the title error message: not specified in the story.
3. EVT-01: What happens to a Scheduled event when its group is archived (GRP-19)? EVT-05 says reminders stop; the event page state is not specified.
4. EVT-01: Is a Draft that nobody invites ever expired or reminded? Not specified in the story.
5. EVT-01: Notification `msg.evt.host_left` goes to the creator; if the creator was also the host who left, who is told? Not specified in the story.
6. EVT-02: Key for refusing a change to a past occurrence: not specified in the story.
7. EVT-02: "Every month on the same weekday (for example the first Sunday)": what happens for a fifth weekday that a month lacks? Not specified in the story.
8. EVT-02: How is an invitee told about a series change "This and following events" (one `msg.evt.changed` per series or per occurrence)? Not specified in the story.
9. EVT-02: Does a person joining the group later get invited to the series or only to upcoming occurrences? Not specified in the story.
10. EVT-03: The SMS variant of `msg.evt.invited` does not yet exist in the NTF catalogue ("to be added by NTF"); until then the SMS invitation has no key. Not specified in the story.
11. EVT-03: AC 2 states invitation SMS are limited by `grp.invite_sms_per_day`, a parameter conventions assigns to GRP-03 invitations; does the same cap apply to event invitations and what does the inviter see at the limit? Not specified in the story.
12. EVT-03: "The project team" audience when the project team changes later (static or dynamic)? Not specified in the story.
13. EVT-03: What does a removed-then-re-invited person see? Not specified in the story.
14. EVT-04: `msg.evt.rsvp_summary` is not yet in the NTF catalogue (listed as a request to NTF). Key and EV ID are not specified in the story.
15. EVT-04: Key for the pending RSVP chip text: not specified beyond the XCT-05 `Waiting to send` label.
16. EVT-04: What does a person with no answer see after the RSVP deadline passes (locked buttons with no answer)? Not specified in the story.
17. EVT-04: Does `Sent after start` show to the host in the counts? Not specified in the story.
18. EVT-05: `msg.evt.reminder_early` is not yet in the NTF catalogue (request to NTF). Key and EV ID not specified in the story.
19. EVT-05: EVT-05 AC 2 and EV-EVT-03 audience: the story asks NTF to align the 2-hour audience (Going and Maybe plus invitees with no device); confirm the catalogue row.
20. EVT-05: NTF-05 criterion 4 must not treat RSVP as resolving a reminder (request to NTF); confirm the change is made.
21. EVT-05: Message when the group SMS allowance or the daily cap is exhausted: not shown to the host by this story.
22. EVT-05: Late-added invitee (after the 24 h offset passed): do they get the reminder for later offsets only? Not specified in the story.
23. EVT-06: The host change is material for invitees but not in the EV-EVT-05 trigger (date, time, place); NTF must add it (story and epic summary).
24. EVT-06: Key for the minor-change `Tell the group` control: not specified in the story.
25. EVT-06: For a recurring event, which scope applies to an edit, and does the To confirm marker apply per occurrence? Not specified in the story (see EVT-02).
26. EVT-06: A change made while the event is a Draft: no notice, but is there a history line? Not specified in the story.
27. EVT-07: Are the reason presets given keys? The story lists examples ("date not possible", "not enough people", "other"); the final list and keys are not specified in the story.
28. EVT-07: Is the cancel reason shown to invitees on SCR-EVT-06 and in the notification? The story says "know why"; the placement is not specified.
29. EVT-07: Cancelling a Draft event (never invited): allowed? Not specified in the story (precondition says Scheduled).
30. EVT-08: Is there a "No results" state when the filters match no event? Not specified in the story.
31. EVT-08: What does the Past tab show for personal dates and cancelled events? Not specified in the story.
32. EVT-08: Where does a member with no group (individual only) see group filters? Not specified in the story.
33. EVT-08: Offline text "newer changes need a connection": key not specified (story forbids no specific word here).
34. EVT-09: PRJ-09 says a Closed project "accepts no new event link" while PRJ-02 lists the Events section as part of the project page; does the "Add an event" button on a Closed project show disabled with a reason (09 section 6.3 rule 5) or is it hidden? Not specified in the story.
35. EVT-09: Does unlinking an event from a Closed project work? Not specified in the story.
36. EVT-09: Empty state of the project's Events section: key not specified in the story.
37. EVT-10: The personal reminder notification has no `msg.evt.*` key or EV row named; NTF owns the catalogue. Which key is it? Not specified in the story.
38. EVT-10: Preset reminder choices are examples only ("the day before and the morning of"); the final list is not specified in the story.
39. EVT-10: Does a repeating personal date show in the Past tab each year? Not specified in the story.
40. EVT-11: Key for the "Copy details as text" label and the copied message template: not specified in the story.
41. EVT-11: Does exporting a Draft event work for its creator? Not specified in the story (precondition: Scheduled or Cancelled).
42. EVT-11: Does an exported personal date use the same sheet? Not specified in the story (permission `Event: view`; EVT-10 is separate).
