# NTF: screen and state inventory

Source: `docs/product/stories/NTF.md` (14 stories and the event catalogue of 160 rows, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-NTF-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-NTF-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Story surfaces are SCR-NTF-01 to SCR-NTF-42. Every catalogue row is its own notification surface, numbered SCR-NTF-101 to SCR-NTF-260 in catalogue order (under NTF-01).

Channels: in-app (I), push (P), SMS. Legend from NTF: S-fb = SMS only if the push was not opened within the fallback window; S-d = SMS direct with no push step. Priority classes: Critical, Important, Normal, Low. Payers: Pl (platform), Gr (group allowance). Message key grammar `msg.<epic>.<event>` with variants `.push`, `.sms`, `.inapp`; no `.email`. Operator permissions are lowercase backticked names owned by OPS-01.

Delivery vocabulary (NTF shared status table). Push: Queued, Held (quiet hours), Sent, Delivered, Opened, Not opened, No device, Failed. SMS: Not needed, Queued, Held (quiet hours), Sent, Retrying, Delivered, No delivery report, Failed, Unreachable, Cancelled (need resolved before sending), Skipped (opt-out, allowance or cap), Expired while held. In-app item states: Unread, Read, Needs your action, Resolved. Queue labels are XCT-05 labels (`Waiting to send`, `Sent`, `Confirmed`) and the draft label `Draft, not sent`.

---

### NTF-01 See everything that happened and open it in one tap

**Story:** NTF-01 See everything that happened and open it in one tap

**Surfaces:**
- SCR-NTF-01 | Notification centre (bell; list newest first grouped by day; each row type icon, one sentence, group name, absolute and relative time, unread dot and bold text; "Mark all as read" with undo; link to preferences) | page | Any signed-in person, own notifications only | Entry: the bell, a tap on a push, `/notifications` | Exit: the item's deep link, SCR-NTF-13, SCR-NTF-41
- SCR-NTF-02 | "Needs your action" section (unresolved approvals waiting, votes open, contributions due) | inline (top of SCR-NTF-01) | Same person | Entry: SCR-NTF-01 | Exit: deep link of the item
- SCR-NTF-03 | Notification row (focusable element announcing type, text, group, time and read state) | inline (in SCR-NTF-01, grouped under a summary when batched) | Same person | Entry: SCR-NTF-01 | Exit: deep link, SCR-NTF-06
- SCR-NTF-04 | Access explanation and closed-item screen ("You no longer have access to this. Ask <name of a holder of Group: grant permission>." or the item's final state) | page | A person whose deep link can no longer be shown | Entry: a notification or push deep link | Exit: SCR-NTF-01
- SCR-NTF-05 | App badge (counts unresolved "Needs your action" items plus unread Important or Critical items; a batch summary counts as one) | inline (app icon and bell) | Any signed-in person | Entry: always on | Exit: SCR-NTF-01

The 160 catalogue rows SCR-NTF-101 to SCR-NTF-260 are listed in the section "Catalogue surfaces" below this story block; each is a notification surface with channels and in-app, push and SMS variants.

**States per surface:**
- SCR-NTF-01 default: items newest first grouped by day; tap opens the exact item and marks it read.
- SCR-NTF-01 empty: "Nothing new. Updates from your groups appear here." with a link to preferences.
- SCR-NTF-01 loading: skeleton rows; paging loads older items on demand.
- SCR-NTF-01 mark all as read: one button with undo.
- SCR-NTF-01 refresh failure: cached list stays with "Could not update. [Try again]".
- SCR-NTF-01 offline: latest `ntf.centre_cache_items` (50) readable from cache with a "Last synced" line; read marks are XCT-05 auto-send rows with XCT-05 label keys; an item needing the network shows what is cached and a "No connection" explanation.
- SCR-NTF-01 language: texts re-render in the person's current language from the base key and parameters.
- SCR-NTF-01 retention: items kept `ntf.centre_retention` (12 months).
- SCR-NTF-02 default: unresolved items; an item leaves the section when the need is resolved by anyone and its text reads as a past event.
- SCR-NTF-02 empty: section not shown; not specified in the story.
- SCR-NTF-03 Unread: dot and bold text, not colour alone.
- SCR-NTF-03 Read, Needs your action, Resolved: item states of the centre.
- SCR-NTF-03 accessibility: 48 dp target; one focusable element announcing type, text, group, time, read state.
- SCR-NTF-04 no access: permission removed, group left or group archived; shows the explanation naming a holder of `Group: grant permission`.
- SCR-NTF-04 closed or deleted: opens the item's final state, not an error.
- SCR-NTF-04 removed item from a push: shows the closed-item screen.
- SCR-NTF-05 default: badge counts unresolved "Needs your action" plus unread Important or Critical items; unread Normal and Low show the dot only.

**Criteria map:**
- AC 1: SCR-NTF-01 default and SCR-NTF-03 Unread (list, grouping, row content, deep link, read mark).
- AC 2: SCR-NTF-02 default ("Needs your action", resolved by anyone).
- AC 3: SCR-NTF-04 no access and closed or deleted.
- AC 4: SCR-NTF-01 empty, loading, mark all as read.
- AC 5: SCR-NTF-01 offline (cache of `ntf.centre_cache_items`, XCT-05 labels).
- AC 6: SCR-NTF-05 default (badge rule).
- AC 7: SCR-NTF-01 refresh failure and SCR-NTF-04 removed item from a push.
- AC 8: no UI, system rule (in-app channel only; opening an item records "opened" for NTF-05 and NTF-02).
- AC 9: SCR-NTF-03 accessibility and SCR-NTF-01 language.

**Objects and fields:** Notification (base key, parameters, group, time, read state, Needs your action state, deep link, opened time); Device.

**Open points:**
- The catalogue says "every event also writes an in-app item for people with an account unless the Channel cell says None", but some rows list only S-d (for example EV-ACC-14, EV-ACC-17, EV-ACC-18, EV-VOT-07, EV-VOT-08, EV-NTF-02, EV-NTF-03) and EV-ACC-01 says "no in-app". Does an account holder get an in-app item for S-d-only rows? Not specified in the story.
- The badge counts unread Important or Critical items, but Critical SMS-only rows have no in-app item (EV-ACC-01). Confirm that such events add nothing to the badge. Not specified in the story.
- The explanation "Ask <name of a holder of Group: grant permission>" names a person; conventions 09 section 6.3 rule 6 and the GRP "unavailable" marker apply when that holder is Locked or Inactive. Not specified in the story.
- Exact key texts for "Nothing new...", "Could not update...", "No connection" are quoted intent; keys not specified in the story.
- A person who left the group: do old items remain in the centre (retention 12 months) with the NTF-01 explanation, or are they removed (ANN-02 criterion 8 says no notifications after leaving)? Not specified in the story.
- Catalogue: EV-RUL-08 `msg.rul.cap_warning` is a row, but RUL-09 says the 80 percent warning uses the same message family as `msg.rul.cap_reached` and the RUL epic defines no new key. Which key sends the warning?
- Catalogue: EV-VOT-10 `msg.vot.decision_logged` is emitted by VOT-13 in the catalogue, while VOT-13 criterion 8 and VOT-14 criterion 5 say VOT-14 is the only emitter; and EV-PRJ-06 `msg.prj.decision_added` is emitted by VOT-14 in the catalogue, while VOT-14 criterion 5 cites EV-PRJ-06 for the key `msg.vot.decision_logged`. Which rows and keys are final?
- Catalogue: EV-VOT-09 `msg.vot.too_late` is emitted by VOT-18 in the catalogue, but VOT-18 defines no notification, only the screen string `vot.offline.too_late`.
- Catalogue: EV-VOT-07 and EV-VOT-08 (guest link, guest receipt) are emitted by VOT-06 in the catalogue, but VOT-06 names neither key.
- Catalogue: EV-EVT-08 `msg.evt.payment_due` (Later) lists EVT-11 as emitter, which is the calendar export story; EVT has no payment in the MVP.
- Catalogue: EV-ANN-04 `msg.ann.campaign_contribution` is emitted by ANN-05 in the catalogue but ANN-05 does not name it; and ANN-04 reuses `msg.ann.campaign_launched` for extension updates although each key has one emitter.
- Catalogue: EV-GRP-08 and EV-GRP-09 (permission granted or revoked) carry payer Gr for an SMS about the person's own access, while the payer legend puts account-safety messages on Pl. Which payer applies?

---

### NTF-02 Know whether the message reached the person

**Story:** NTF-02 Know whether the message reached the person

**Surfaces:**
- SCR-NTF-06 | Delivery line on a notification ("Sent to your phone", "Also sent by SMS", "SMS delivered", "Not opened"; "We will text you at 14:20 if you have not opened this") | inline (on SCR-NTF-03 and on a notification detail) | The recipient | Entry: SCR-NTF-01 | Exit: none
- SCR-NTF-07 | "Who was notified" sender view (per recipient by name: push Delivered, No device or Failed; SMS Delivered, Held, or "Not reached" with no reason and the time; count "5 not opened" never beside a name) | page | The holder of the matching permission who sent the item (`Contribution plan: send reminder` or `Vote: create`; events and others not specified) | Entry: "Who was notified" on a vote, event or reminder | Exit: back to the item
- SCR-NTF-08 | Group-visible delivery counts ("3 members not reached"; cause counts for treasurers only in groups of 5 or more) | inline (on the item) | Group members; causes to treasurers in groups of 5 or more | Entry: the item | Exit: none

**States per surface:**
- SCR-NTF-06 Queued: "Sending".
- SCR-NTF-06 timer running: "Waiting to see if the push is opened until 14:20".
- SCR-NTF-06 delivered or not opened: plain-words lines per channel state.
- SCR-NTF-06 no delivery report: reads "No delivery report", never shown as Delivered.
- SCR-NTF-06 failed SMS (recipient): shows the reason in plain words and the next action (for example "Check your phone number").
- SCR-NTF-06 offline: cached state with last synced time.
- SCR-NTF-06 own Opened state: a recipient always sees their own Opened state.
- SCR-NTF-07 default: highest delivery state reached per channel per recipient, by name; the Opened state shown only as a count; a member's opt-out merged with every other cause and shown only as "Not reached" with no reason.
- SCR-NTF-07 not reached: "Not reached" with the next action "Follow up another way".
- SCR-NTF-07 privacy: the sender view never shows message text of other people's private messages (for example private late-payment reminders to others), only that one was sent and its state.
- SCR-NTF-07 opened count: exists only for Important and Critical types.
- SCR-NTF-07 offline: cached with last synced time; not specified further.
- SCR-NTF-07 audited: opening the view is logged (who, which item, when).
- SCR-NTF-07 hidden: a person without the matching permission; the entry is not shown.
- SCR-NTF-08 default: counts only, for example "3 members not reached"; names shown only to the sender.
- SCR-NTF-08 small group: cause counts for treasurers only in groups of 5 or more.

**Criteria map:**
- AC 1: SCR-NTF-06 delivered or not opened (recipient plain-words line).
- AC 2: SCR-NTF-07 default (by name, highest state per channel, Opened as a count only).
- AC 3: SCR-NTF-08 default and small group, SCR-NTF-07 opened count (counts for the group, names only for the sender, "not opened" only for Important and Critical).
- AC 4: SCR-NTF-07 privacy.
- AC 5: SCR-NTF-06 Queued, timer running, offline.
- AC 6: SCR-NTF-06 no delivery report and failed SMS (recipient); SCR-NTF-07 not reached (sender).
- AC 7: no UI, system rule (viewing delivery state sends nothing).
- AC 8: SCR-NTF-07 audited.
- AC 9: SCR-NTF-06 and SCR-NTF-07 (words plus icons, absolute time with relative hint, three languages).

**Objects and fields:** Notification; Device; Delivery attempt (channel, state, time); Audit entry.

**Open points:**
- NTF-02 gives the sender view to `Contribution plan: send reminder` or `Vote: create`; EVT-05 criterion 8 says a host sees only counts such as `3 SMS Unreachable` and never names, and VOT-07 criterion 7 gives the vote creator a count. Which story controls the per-name sender view for votes and events? Not specified in the story.
- Which permission gives the sender view for event invitations and announcements (no `Event:` or `Publication:` permission is listed)? Not specified in the story.
- The sender view shows "Not reached" by name, while the tracking-privacy decision R107 says senders see only a count of not opened; it is consistent for Opened but "Not reached" by name is a different datum. Confirm with privacy review. Not specified in the story.

---

### NTF-03 Ask to send notifications only after the app has proved useful

**Story:** NTF-03 Ask to send notifications only after the app has proved useful

**Surfaces:**
- SCR-NTF-09 | Push explainer ("Turn on notifications" and "Not now", the three or four kinds of messages with an icon and one line each: money moved, things waiting for you, reminders, group news) | sheet | A signed-in person on a device that supports push, at a first useful moment | Entry: after first wallet created, first contribution confirmed, first vote cast (`ntf.push_prompt_moments`) | Exit: SCR-NTF-10 or close
- SCR-NTF-10 | System permission request (the operating system's own prompt) | system | The person | Entry: "Turn on notifications" | Exit: SCR-NTF-09 result
- SCR-NTF-11 | Push help (how to enable push in the phone's settings in three plain steps with images; "Push is not available on this phone. Important items come by SMS.") | inline (on SCR-NTF-13) | A person who denied permission or whose device has no push support | Entry: SCR-NTF-13 | Exit: none
- SCR-NTF-12 | Registration failure notice ("Notifications are on, but we could not finish setting them up. [Try again]") | inline (on SCR-NTF-13 and after the explainer) | The person | Entry: failed token registration | Exit: retry

**States per surface:**
- SCR-NTF-09 default: shown only after a configured useful moment; both buttons have the same visual weight.
- SCR-NTF-09 Not now: closes and nothing else; offered again once after `ntf.push_reprompt_delay` (14 days) at another useful moment, then never again from the app; settings always offer it.
- SCR-NTF-09 unsupported device: devices without push support never see it.
- SCR-NTF-09 offline: can be completed; registration is a silent technical retry on app open and when connectivity returns, with no queue label and not in the XCT-05 registry.
- SCR-NTF-09 accessibility: usable with a screen reader and at 200% font size; three languages.
- SCR-NTF-10 never at install: not shown at install, sign-in or the first screen; only after "Turn on".
- SCR-NTF-10 granted: device registered (token with device id and language); refreshed silently on token change; unregistered on sign-out; first confirmed push is the test `msg.ntf.push_enabled.push`.
- SCR-NTF-10 denied: app records it; no repeating prompt; SCR-NTF-11 shows how to enable; SMS fallback for Important types continues.
- SCR-NTF-11 denied: three plain steps with images.
- SCR-NTF-11 unsupported: "Push is not available on this phone. Important items come by SMS." (run-time feature detection).
- SCR-NTF-12 default: registration fails after grant; retry silently at next open; the centre still holds everything.

**Criteria map:**
- AC 1: SCR-NTF-09 default (explainer, two buttons, opens the system request).
- AC 2: SCR-NTF-10 never at install.
- AC 3: SCR-NTF-09 Not now.
- AC 4: SCR-NTF-10 denied and SCR-NTF-11 denied.
- AC 5: SCR-NTF-10 granted.
- AC 6: SCR-NTF-09 unsupported device and offline, SCR-NTF-11 unsupported.
- AC 7: SCR-NTF-12 default.
- AC 8: SCR-NTF-10 granted (`msg.ntf.push_enabled.push`, EV-NTF-01, surface SCR-NTF-247).
- AC 9: no UI, system rule (Consent record and device event with time, device id, permission state; shown under "my choices" in ACC-13).
- AC 10: SCR-NTF-09 accessibility.

**Objects and fields:** Device (token, device id, language, permission state); Notification preference; Consent record; Audit entry.

**Open points:**
- The first useful moments listed (first wallet, first contribution, first vote) include a vote cast by a guest on the light page; a guest has no device registration (VOT-06); does the explainer appear for guests who later sign in? Not specified in the story.
- The `ntf.push_prompt_moments` default includes the first vote cast, but a person who only joins to vote (R113) may be on a web page without push support. Not specified in the story.
- Key and exact text for the explainer title and the four message kinds: not specified in the story.

---

### NTF-04 Choose what I get and how

**Story:** NTF-04 Choose what I get and how

**Surfaces:**
- SCR-NTF-13 | Notification preferences (groups of types Money, Waiting for you, Reminders, Group news, Weekly summary, each with a push switch; single choice "SMS for important items only"; weekly digest switch; device row showing `acc.session.hide_previews`; current-state sentence; "Send me a test"; one line saying Critical types cannot be switched off) | page | Any signed-in person | Entry: Settings then Notifications, link on SCR-NTF-01 | Exit: SCR-NTF-18 (group part), SCR-NTF-26, ACC-12
- SCR-NTF-14 | Group SMS settings entry (usage and allowance, NTF-06) | inline (section of SCR-NTF-13) | Holder of `Group: set notification settings` | Entry: SCR-NTF-13 | Exit: SCR-NTF-18
- SCR-NTF-15 | Mute a group control (mutes Normal and Low notifications of one group; Important and Critical continue) | inline (on SCR-NTF-13) | Any member | Entry: SCR-NTF-13 | Exit: none

**States per surface:**
- SCR-NTF-13 default: five groups of types each with a push switch; SMS choice with a sentence listing what counts as important; conservative defaults (Important types on; Normal push on only for contributions, votes, approvals, events; Low off; SMS for important items on).
- SCR-NTF-13 Critical types: cannot be switched off; one line says so; Low types have no push switch (they appear in the centre and the digest).
- SCR-NTF-13 current state: "Push: on for this phone. SMS: important items only. Quiet hours 21:00 to 07:00".
- SCR-NTF-13 test: "Send me a test" sends one push and never an SMS.
- SCR-NTF-13 loading: skeleton.
- SCR-NTF-13 offline: readable from cache; preference changes are XCT-05 auto-send rows with label keys; while Waiting to send, turning SMS off shows "You may still receive SMS until this is sent"; money items and security alerts never queued or silenced by a queued preference.
- SCR-NTF-13 failure: a failed save restores previous values and says so; a setting never silently reverts.
- SCR-NTF-13 no push support: "Push is not available on this phone. Important items come by SMS." (SCR-NTF-11).
- SCR-NTF-13 accessibility: switches with visible labels and state words; the "important items" list is one plain sentence per type in three languages.
- SCR-NTF-14 visible: only to holders of `Group: set notification settings`; personal choices need no permission.
- SCR-NTF-14 hidden: other members do not see the group part.
- SCR-NTF-15 muted: group Normal and Low notifications stop; Important and Critical from that group continue.

**Criteria map:**
- AC 1: SCR-NTF-13 default (groups of types, SMS choice, digest switch, hide-previews row).
- AC 2: SCR-NTF-13 Critical types.
- AC 3: SCR-NTF-13 default (conservative defaults; consent wording owned by ACC-13 and NTF-10).
- AC 4: SCR-NTF-15 muted and SCR-NTF-14 visible and hidden.
- AC 5: SCR-NTF-13 current state and test.
- AC 6: SCR-NTF-13 loading and offline.
- AC 7: SCR-NTF-13 failure.
- AC 8: no UI, system rule (no message except the NTF-10 confirmations).
- AC 9: no UI, system rule (audit of every change with old and new value, time, device; Consent records shown in ACC-13).
- AC 10: SCR-NTF-13 accessibility.

**Objects and fields:** Notification preference (per type push switch, SMS choice, digest, mute, quiet hours); Consent record; Audit entry.

**Open points:**
- "Waiting for you" and "Group news" type groups are named; the exact membership of each group against the catalogue rows is not listed. Which catalogue rows belong to which switch? Not specified in the story.
- Where does the person edit quiet hours (NTF-09 says "editable per person in preferences, NTF-04"), but this story lists no quiet hours control, only the sentence. Not specified in the story.
- The test button "sends one push" to a person without a push device: what is shown? Not specified in the story.

---

### NTF-05 Push first, then SMS only if nobody opened the push

**Story:** NTF-05 Push first, then SMS only if nobody opened the push

**Surfaces:**
- SCR-NTF-16 | System: SMS fallback engine (push first, fallback timer `ntf.sms_window.<type>`, deadline-aware window, re-check before sending, direct SMS for recipients without a device, one SMS per event per person, daily cap, push-failure shortcut) | system | none | Entry: an Important event created and the push sent | Exit: SMS, Cancelled, Skipped
- SCR-NTF-17 | Fallback timer line ("We will text you at 14:20 if you have not opened this") | inline (on SCR-NTF-06 for recipients who see the delivery line) | Recipient | Entry: SCR-NTF-01 | Exit: none

**States per surface:**
- SCR-NTF-16 push then wait: push to registered devices; timer started; if opened before it ends no SMS.
- SCR-NTF-16 SMS sent: not opened before the timer ends; the SMS variant is sent once.
- SCR-NTF-16 deadline-aware: effective window is the smaller of the configured window and `ntf.sms_window_deadline_share` (0.5) of the time left before the deadline; too little time means the SMS is sent immediately.
- SCR-NTF-16 Cancelled: need re-checked immediately before sending; person already acted (paid, voted, approved), or the event cancelled or closed; state Cancelled with a reason. An RSVP resolves only the RSVP deadline notice; event reminders EV-EVT-02 and EV-EVT-03 are not cancelled by an RSVP; event changed and cancelled SMS end when the person answers No.
- SCR-NTF-16 no device: no registered device, invalid token or push denied; SMS direct if preferences allow; opt-out recipients get push and in-app only; suppression list checked before S-d SMS to non-members.
- SCR-NTF-16 cap: `ntf.sms_daily_cap` (3) counts Group-paid and Important non-Critical SMS only; a skipped SMS is Skipped with reason "daily cap"; Pl and Critical never skipped.
- SCR-NTF-16 idempotent: one SMS per event, recipient and channel.
- SCR-NTF-16 restart: timer stored on the server and survives restarts; offline phones are treated as not opened at the end of the timer; a planned fallback SMS is scheduled with the NTF-09 reminder rule.
- SCR-NTF-16 push failure: provider failure; no window wait; SMS after `ntf.push_failed_sms_delay` (2 minutes), logged "push failed"; if SMS also fails NTF-13 applies and the in-app item remains.
- SCR-NTF-16 only types S-fb or S-d: Normal and Low never produce SMS; no SMS for marketing.
- SCR-NTF-16 authority vote floor exception: a reminder SMS goes to a Named voter only when the floor is unmet at the deadline minus 24 hours, never to someone who already voted or whose ballot is "Waiting to send" as known to the server; budgeted in the reserve part (money vote closing).
- SCR-NTF-17 default: shown only to recipients who see the delivery line.

**Criteria map:**
- AC 1: SCR-NTF-16 push then wait and SMS sent.
- AC 2: SCR-NTF-16 only types S-fb or S-d.
- AC 3: SCR-NTF-16 deadline-aware.
- AC 4: SCR-NTF-16 Cancelled.
- AC 5: SCR-NTF-16 no device.
- AC 6: SCR-NTF-16 idempotent and cap.
- AC 7: SCR-NTF-16 restart and SCR-NTF-17 default.
- AC 8: SCR-NTF-16 push failure.
- AC 9: no UI, system rule (each decision logged, NTF-12; billable SMS counted against the payer, NTF-06).
- AC 10: SCR-NTF-16 authority vote floor exception (approver notices only below the vote threshold; after a vote no approvers named).

**Objects and fields:** Notification; Delivery attempt (decision, reason, time); Device; Notification preference.

**Open points:**
- NTF-05 AC 4 says event reminder SMS are not cancelled by an RSVP, while conventions and EVT-05 AC 3 say the same; confirm that NTF-05's own text now matches (the story text does).
- NTF-05 AC 10 adds a reminder SMS to Named voters at the deadline minus 24 hours for authority votes, while VOT-07 criterion 1 schedules reminders at 24 hours and 3 hours for authority votes. Are these the same SMS or two? Not specified in the story.
- The timer line text is quoted intent; key not specified in the story.

---

### NTF-06 Keep SMS cost under control and say who pays

**Story:** NTF-06 Keep SMS cost under control and say who pays

**Surfaces:**
- SCR-NTF-18 | SMS usage of a group (monthly allowance `ntf.group_sms_allowance`, SMS used this month, cost per message when the rate is known, list of what was sent by type and count, never message text of private items; reserve and open part; top-up) | page | Holder of `Group: set notification settings` | Entry: group settings "SMS usage", SCR-NTF-14, `/groups/{g}/sms`, allowance notices | Exit: SCR-NTF-21
- SCR-NTF-19 | Bulk send estimate ("12 SMS, about X Ar", includes invitation SMS to invitees without a device) | modal | The sender of a manual bulk send (for example "remind everyone who is late") | Entry: manual bulk send | Exit: confirm or cancel
- SCR-NTF-20 | "SMS are paused for this group" banner | inline (on SCR-NTF-18 and group surfaces for holders) | Holder of `Group: set notification settings` | Entry: open part of the allowance used up | Exit: SCR-NTF-21
- SCR-NTF-21 | Top-up request entry (an expense request with payee Pay Gereo and ledger class "Platform: SMS allowance"; follows the spending policy; shows exact amount, payee and wallet) | inline (on SCR-NTF-18, then the SPD expense request page) | Holder of `Group: set notification settings` who also holds `Wallet: initiate spend` | Entry: SCR-NTF-18 | Exit: SPD request page

**States per surface:**
- SCR-NTF-18 default: allowance, used, cost per message, counts by type; payer classes Pl and Gr.
- SCR-NTF-18 empty month: "No SMS used yet this month".
- SCR-NTF-18 warning: usage reaches `ntf.sms_allowance_warning_percent` (80), computed separately for the reserve (`ntf.group_sms_reserve_share`, 50 percent, money-decision types) and the open part; push and in-app item to holders (`msg.ntf.sms_allowance_low`).
- SCR-NTF-18 open part used up: Gr-class SMS of other types stop; money-decision SMS still send from the reserve; push and in-app continue; banner SCR-NTF-20; `msg.ntf.sms_allowance_empty`.
- SCR-NTF-18 count failure: says so; errs on the side of not exceeding the allowance; money-decision SMS from the reserve still send.
- SCR-NTF-18 offline: cached counts with last synced time.
- SCR-NTF-18 loading: skeleton.
- SCR-NTF-18 hidden: members without `Group: set notification settings`; screen not offered.
- SCR-NTF-18 rate unknown: cost per message not shown; only counts (no price shown to groups by default).
- SCR-NTF-19 default: estimate before a manual bulk send; automatic sends do not ask but are counted; the estimate includes direct invitation SMS.
- SCR-NTF-20 default: banner "SMS are paused for this group"; Critical and Pl-class SMS never stop.
- SCR-NTF-21 default: a person-initiated expense request (class a); below the vote threshold approvers other than the requester approve (D1), above it a vote authorises (D4); approval notices sent by the Gereo-paid sender (Pl).
- SCR-NTF-21 failure: top-up payment fails; no allowance added and no money moves.
- SCR-NTF-21 inbox: an empty allowance never blocks an approval or vote request from appearing in the app inbox.

**Criteria map:**
- AC 1: SCR-NTF-18 default.
- AC 2: SCR-NTF-18 default (payer classes Pl and Gr).
- AC 3: SCR-NTF-19 default.
- AC 4: SCR-NTF-18 warning and open part used up, SCR-NTF-20 default.
- AC 5: SCR-NTF-21 default (top-up as an expense request, Pay Gereo, "Platform: SMS allowance", no silent deduction).
- AC 6: SCR-NTF-18 loading, empty month, offline.
- AC 7: SCR-NTF-18 count failure, SCR-NTF-21 failure.
- AC 8: SCR-NTF-18 warning and open part used up (`msg.ntf.sms_allowance_low`, `msg.ntf.sms_allowance_empty`, push and in-app, no SMS).
- AC 9: no UI, system rule (billable SMS record with recipient, type, segments, payer class, cost; wallet-funded top-up writes a balanced ledger entry; allowance setting changes audited).
- AC 10: SCR-NTF-21 inbox.

**Objects and fields:** SMS allowance (monthly, used, reserve, open part, warning level); Delivery attempt (type, segments, payer, cost); Ledger entry (top-up); Audit entry; Expense request (top-up).

**Open points:**
- The top-up needs `Wallet: initiate spend`, while the screen needs `Group: set notification settings`; what does a holder of only the second permission see on SCR-NTF-21? Not specified in the story.
- "Cost per message at the current rate when the rate is known": the decision B9 says no price is shown to groups, only counts. Which applies? Not specified in the story.
- Does SCR-NTF-18 show the allowance when a group has fewer than 5 members (conventions hide counts in small groups for approver reachability)? Not specified in the story.
- Aggregator rates fix the real allowance value (external, open question 2).

---

### NTF-07 Write every SMS so it fits in one short message, in three languages

**Story:** NTF-07 Write every SMS so it fits in one short message, in three languages

**Surfaces:**
- SCR-NTF-22 | SMS template registry (per template and language: length, segments, encoding; draft that fails cannot be published; exceptions with named approver) | page | Product team and operators (audience not specified in the story) | Entry: tooling for template authors | Exit: none
- SCR-NTF-23 | System: SMS template renderer (variable limits, character mapping per XCT-12, language fallback, short fallback template at send time) | system | none | Entry: any SMS send | Exit: SMS or no send with an operator alert

**States per surface:**
- SCR-NTF-22 default: each template and language with length, segments, encoding.
- SCR-NTF-22 failing draft: over length or unmappable characters; cannot be published.
- SCR-NTF-22 missing language: a template whose language variant is missing cannot be enabled for that language.
- SCR-NTF-22 exception: a template that cannot meet the encoding needs an explicit exception stating segment count and cost, owned by a named approver.
- SCR-NTF-22 review: all three languages reviewed before launch; mg and fr by native speakers.
- SCR-NTF-23 default: sender prefix of XCT-12, ends with a reference, leads with amount and action; variable limits `ntf.sms_group_name_max` (20), `ntf.sms_first_name_max` (12), `ntf.sms_title_max` (20), `ntf.sms_place_max` (20); recipient first names only.
- SCR-NTF-23 language fallback: recipient language, then group language, then Malagasy.
- SCR-NTF-23 link: links use `ntf.sms_short_link_domain` and are counted by the length rule; messages carry facts in text.
- SCR-NTF-23 over length at send time: short fallback template (amount, deadline, reference) with the generic name "a member"; a money reminder is never dropped.
- SCR-NTF-23 missing amount or reference: SMS not sent; error logged with the base key and recipient; in-app item remains (NTF-13); operator alert raised.
- SCR-NTF-23 content rules: no exclamation marks and no emoji in money, error or conflict messages; never names or shames a member in a message others can see.
- SCR-NTF-23 push and in-app variants: same facts, accents allowed, not limited to 160 characters.

**Criteria map:**
- AC 1: SCR-NTF-22 default and SCR-NTF-23 default (per key and language, prefix, reference, example shape).
- AC 2: SCR-NTF-22 failing draft (character mapping of XCT-12).
- AC 3: SCR-NTF-23 default (one segment, variable maxima) and SCR-NTF-22 default.
- AC 4: SCR-NTF-22 missing language and SCR-NTF-23 language fallback.
- AC 5: SCR-NTF-22 exception.
- AC 6: SCR-NTF-23 content rules.
- AC 7: SCR-NTF-23 link.
- AC 8: SCR-NTF-22 default and failing draft.
- AC 9: SCR-NTF-23 over length at send time and missing amount or reference.
- AC 10: SCR-NTF-23 push and in-app variants and SCR-NTF-22 review.

**Objects and fields:** Message template (base key, language, body, parameters, length, segments, encoding); Delivery attempt.

**Open points:**
- Who uses the template registry screen (operators with which permission, or only the build team)? Not specified in the story; OPS-01 catalogue has no template permission named here.
- Malagasy words needing circumflex letters and the sender ID `ntf.sms_sender_id` (open, needs a native reviewer and the aggregator).
- Whether the registry is a screen at all or a build-time report (XCT-12 lint): "the template registry shows" suggests a screen; not specified in the story.

---

### NTF-08 Turn a flood into one message

**Story:** NTF-08 Turn a flood into one message

**Surfaces:**
- SCR-NTF-24 | Batch summary list (the list filtered to the items of a summary, opened from the summary push or in-app item; items grouped under the summary and expandable in the centre) | page | The recipient | Entry: the summary push or in-app item (`msg.ntf.batch_summary`) | Exit: each item's deep link
- SCR-NTF-25 | System: batcher (counts similar items within `ntf.batch_window`; sends one summary; never batches Critical or the person's own money-moved receipts) | system | none | Entry: more than `ntf.batch_threshold` similar pending items | Exit: SCR-NTF-24

**States per surface:**
- SCR-NTF-24 default: filtered list of the summarised items; unread badge counts the summary once.
- SCR-NTF-24 loading and empty: as NTF-01.
- SCR-NTF-24 offline: batching happens on the server so cached lists show items as received.
- SCR-NTF-25 push batch: once the count exceeds `ntf.batch_threshold` (5) within `ntf.batch_window` (10 minutes), one summary push replaces individual pushes ("7 contributions received today").
- SCR-NTF-25 similar means: same base key and same group to the same recipient; different groups never mixed; `msg.con.split_failed` deduplicated per rule per day.
- SCR-NTF-25 SMS batch: several SMS-eligible items within the window become one SMS by count and type ("3 contributions still due. Ref ..."), without names, counted once against the allowance and the daily cap, using the SMS window of the first item.
- SCR-NTF-25 late item: an item arriving after the summary starts a new count; a summary is never edited after sending.
- SCR-NTF-25 failure: if the batch cannot be built the individual notifications are sent normally, capped by the daily cap, never dropped.
- SCR-NTF-25 exceptions: Critical types and money-moved receipts for the person's own transactions are never batched.
- SCR-NTF-25 audit: delivery log records the summary and the item ids it covers.

**Criteria map:**
- AC 1: SCR-NTF-25 push batch and SCR-NTF-24 default.
- AC 2: SCR-NTF-25 similar means and exceptions.
- AC 3: SCR-NTF-24 default (individual items in the centre, badge counts summary once).
- AC 4: SCR-NTF-25 SMS batch.
- AC 5: SCR-NTF-25 late item.
- AC 6: SCR-NTF-24 loading, empty, offline.
- AC 7: SCR-NTF-25 failure.
- AC 8: SCR-NTF-24 default (`msg.ntf.batch_summary`, EV-NTF-07, surface SCR-NTF-253).
- AC 9: SCR-NTF-25 audit.

**Objects and fields:** Notification (summary, covered item ids); Delivery attempt.

**Open points:**
- Does the summary push open SCR-NTF-24 or the centre filtered? The story says "a list filtered to those items"; the page identity and URL are not specified in the story (catalogue says "Filtered list").
- What is the in-app text of the summary variant for a type with no SMS? Not specified in the story.
- Batch of items from several types but same group: story limits "similar" to the same base key; the mixed case is not specified.

---

### NTF-09 Do not wake people at night

**Story:** NTF-09 Do not wake people at night

**Surfaces:**
- SCR-NTF-26 | Quiet hours setting and held count ("Quiet hours 21:00 to 07:00 (Madagascar time)", "Held: 2 notifications until 07:00"; editable window) | inline (section of SCR-NTF-13) | Any signed-in person | Entry: SCR-NTF-13 | Exit: none
- SCR-NTF-27 | System: quiet hours scheduler (hold, silent delivery at the end, reminder placement rule, Critical bypass, expired while held, payout hold after a passed vote) | system | none | Entry: delivery time inside quiet hours | Exit: held items released
- SCR-NTF-28 | Creation deadline warning ("some people may not be notified before the deadline"; shown by VOT-01 and every story that sets a deadline) | inline (on creation forms of votes, requests, events and others) | The creator | Entry: a deadline set while delivery could fall in quiet hours | Exit: none

**States per surface:**
- SCR-NTF-26 default: window shown; editable per person; held notifications counted.
- SCR-NTF-26 offline: cached setting and a note that changes apply when synced.
- SCR-NTF-26 failure: a failed save keeps the previous window.
- SCR-NTF-26 time zone: device clock or time zone wrong: the server's setting governs; a change affects only items not yet delivered.
- SCR-NTF-27 push held: no sound or vibration; held items delivered silently at the end and appear in the centre at once.
- SCR-NTF-27 Critical: delivered at any hour by SMS direct; only Critical bypasses; freeze SMS capped by `ntf.critical_freeze_sms_per_day` (2), beyond it push and in-app only.
- SCR-NTF-27 Important SMS: not sent during quiet hours; held until the end; an item created inside quiet hours whose deadline falls before quiet hours end stays Held and becomes Expired while held at its deadline; sender sees "Not sent: quiet hours" (NTF-02).
- SCR-NTF-27 planned reminder: a planned reminder or fallback SMS inside quiet hours is sent at quiet hours end if at least `ntf.reminder_margin_minutes` (60) remain before the target time; otherwise at the latest slot before quiet hours begin the evening before; unplanned events are simply held.
- SCR-NTF-27 money safety: a payout authorised by a passed vote is dispatched no earlier than quiet hours end and its result notice released at the same moment; `request_expiry` paused while a notice is held (SPD-04).
- SCR-NTF-27 no override: votes, approvals and authority votes never override quiet hours; voters cannot opt to be woken.
- SCR-NTF-28 default: warning at creation.
- SCR-NTF-28 money vote: VOT-01 refuses or snaps a money-vote or authority-vote deadline inside quiet hours to the next slot inside 07:00 to 21:00.

**Criteria map:**
- AC 1: SCR-NTF-27 push held and SCR-NTF-26 default.
- AC 2: SCR-NTF-27 Critical.
- AC 3: SCR-NTF-27 Important SMS and no override, SCR-NTF-28 default.
- AC 4: SCR-NTF-27 planned reminder.
- AC 5: SCR-NTF-26 time zone.
- AC 6: SCR-NTF-26 default and offline.
- AC 7: SCR-NTF-26 failure and time zone.
- AC 8: no UI, system rule (no message beyond held items).
- AC 9: no UI, system rule (held, delivered-late and expired-while-held logged, NTF-12).
- AC 10: SCR-NTF-27 money safety and SCR-NTF-28 money vote.

**Objects and fields:** Notification preference (quiet window, time zone); Delivery attempt (held, released, expired).

**Open points:**
- NTF-09 AC 3 says "Votes, approvals and authority votes never override quiet hours", yet the Critical definition includes "freeze applied" which is a group-money safety event for holders; confirm there is no other group-money event that bypasses. Not specified in the story.
- "Expired while held" item for an approval request: which status does the request show (SPD owns); not specified in this story.
- The held list ("Held: 2 notifications until 07:00") on the notification centre: surface placement not specified beyond preferences.

---

### NTF-10 Stop SMS any time, and restart it on my terms

**Story:** NTF-10 Stop SMS any time, and restart it on my terms

**Surfaces:**
- SCR-NTF-29 | SMS opt-out confirmation (says what the person may miss: "a vote closing, a contribution due, a payment receipt"; confirm to turn off; re-opt-in confirm) | modal | The person | Entry: the SMS switch on SCR-NTF-13 | Exit: SCR-NTF-13
- SCR-NTF-30 | SMS consent status (date of the last change; Critical SMS note) | inline (on SCR-NTF-13) | The person | Entry: SCR-NTF-13 | Exit: ACC-13 "my choices"
- SCR-NTF-31 | System: suppression list and reply keyword handler (STOP and ARRET plus the reviewed Malagasy word, only where two-way SMS is supported; number-level suppression list for non-members) | system | none | Entry: a reply keyword, or a send to a non-member number | Exit: opt-out recorded
- SCR-NTF-32 | "Amount due" badge and "Needs your action" item (after opt-out, money-due reminders appear in the app) | inline (on contribution surfaces and SCR-NTF-02) | The opted-out person | Entry: opt-out | Exit: the contribution

**States per surface:**
- SCR-NTF-29 opt-out: first states what may be missed and asks to confirm; after confirming, one last SMS confirms (`msg.ntf.sms_optout_confirm.sms`) and no further non-Critical SMS is sent; the opt-out covers money-due reminders.
- SCR-NTF-29 re-opt-in: turning SMS on, confirm, one confirmation SMS (`msg.ntf.sms_optin_confirm.sms`); signing in with phone and OTP is the proof of consent.
- SCR-NTF-29 Critical note: one sentence says Critical SMS (security events and group-money safety events, including the freeze SMS and the hostile-deletion alarm) are not covered.
- SCR-NTF-29 confirmation SMS failure: opt-out still takes effect and in-app state is correct; a failed opt-in leaves SMS off and says so.
- SCR-NTF-30 default: shows the date it was changed.
- SCR-NTF-30 offline change: XCT-05 auto-send row with XCT-05 label keys and the keyed reassurance "You may still receive SMS until this is sent"; money items and security alerts never queued or silenced by a queued preference.
- SCR-NTF-31 keyword live: reply opt-out handled in the same flow and shown in the app on next open; the app never promises a keyword that is not live.
- SCR-NTF-31 suppression: number-level list fed by STOP replies and checked before every S-d SMS to a non-member; a number matching an account follows that account's choice.
- SCR-NTF-31 service SMS: OTP, link and payout receipt are services; for an unregistered number only these plus one VOT-07 reminder carrying a per-number opt-out; `grp.invite_sms_per_day` limits invitations; for an account the payout receipt is optional and follows the choice.
- SCR-NTF-31 group view: opt-out is per person; groups never see who opted out; a holder of `Contribution plan: send reminder` sees only an anonymous "not reached by SMS" count, only in groups of 5 or more.
- SCR-NTF-32 default: "Amount due" badge and a "Needs your action" item; push stays.

**Criteria map:**
- AC 1: SCR-NTF-29 opt-out and SCR-NTF-32 default.
- AC 2: SCR-NTF-29 re-opt-in.
- AC 3: SCR-NTF-31 keyword live.
- AC 4: SCR-NTF-29 Critical note.
- AC 5: SCR-NTF-31 group view.
- AC 6: SCR-NTF-30 default and offline change.
- AC 7: SCR-NTF-29 confirmation SMS failure.
- AC 8: SCR-NTF-29 opt-out and re-opt-in (the two confirmation messages; EV-NTF-02, EV-NTF-03, surfaces SCR-NTF-248 and SCR-NTF-249).
- AC 9: no UI, system rule (consent record with person, old and new state, channel, text version, time, device; kept `AUDIT_RETENTION_YEARS`; shown in ACC-13).
- AC 10: SCR-NTF-31 suppression and service SMS.

**Objects and fields:** Notification preference (SMS consent); Consent record; Suppression entry (phone number); Audit entry.

**Open points:**
- EV-NTF-02 and EV-NTF-03 (opt-out and opt-in confirmations) carry class Critical in the catalogue, but conventions 11.8 defines Critical as security events and group-money safety events only; an opt-out confirmation is neither. Is Critical correct for these rows?
- If the confirmation SMS after opt-out is Critical and opt-out covers all non-Critical SMS, confirm that a person who opted out still receives this one message. The story says yes ("one last SMS"); the class label conflicts.
- Whether two-way SMS and keywords exist is external (open, needs the aggregator); until then the keyword flow (SCR-NTF-31) is not live.

---

### NTF-11 Reach people who do not have the app

**Story:** NTF-11 Reach people who do not have the app

**Surfaces:**
- SCR-NTF-33 | System: SMS-only delivery for recipients without a registered device (Important types sent as S-d in the recipient's language, self-contained; allowed non-member cases: group invite, guest link, guest receipt, event invite to a no-device invitee, campaign receipt and campaign refund; suppression list checked first; per-person single-use SMS link) | system | none | Entry: an Important event involving a person with a number and no push device | Exit: SMS, light web page (VOT-06, ACC-16)
- SCR-NTF-34 | "People reached by SMS only" count (usage reports) | inline (on SCR-NTF-18) | Holder of `Group: set notification settings` | Entry: SCR-NTF-18 | Exit: none

**States per surface:**
- SCR-NTF-33 default: Important types sent directly; Normal and Low not sent; the SMS says how to act without the app (link to a light web page, a reference to quote to a named contact, or an instruction to ask the group's contact); a message depending only on a link is not allowed.
- SCR-NTF-33 language: from the account if any, otherwise the invite or vote link, otherwise the group's language, then Malagasy.
- SCR-NTF-33 links: three kinds exist; this story defines the per-person single-use SMS link (one number, one token; signed token; no account; low-end browser; small page; expires at the vote deadline; first open always requires an OTP; a verified number remembered on the same device for that vote's lifetime).
- SCR-NTF-33 payer: Gr except security codes and personal receipts (campaign receipts and refunds are Pl).
- SCR-NTF-33 later install: a person who installs the app and signs in with the same number sees pending items in the centre and SMS-only handling stops.
- SCR-NTF-33 unreachable: a number unreachable is flagged (NTF-13); the inviter or sender told in-app; message never retried beyond limits.
- SCR-NTF-33 no guest result SMS: a guest sees the result on their link; no `msg.vot` guest result key exists.
- SCR-NTF-33 project team: additions never trigger this story.
- SCR-NTF-33 audit: SMS-only sends logged with the reason "no device".
- SCR-NTF-34 default: count of people reached by SMS only.

**Criteria map:**
- AC 1: SCR-NTF-33 default and no guest result SMS (S-d for Important types; non-member cases).
- AC 2: SCR-NTF-33 default (how to act without the app).
- AC 3: SCR-NTF-33 language.
- AC 4: SCR-NTF-33 links.
- AC 5: SCR-NTF-33 payer and SCR-NTF-34 default.
- AC 6: SCR-NTF-33 later install.
- AC 7: SCR-NTF-33 unreachable.
- AC 8: no UI, system rule (same messages as the catalogue marked S-d; no new keys).
- AC 9: SCR-NTF-33 audit.

**Objects and fields:** Notification; Delivery attempt (reason "no device"); Invite; Ballot link; Suppression entry.

**Open points:**
- Whether a feature-phone user can vote or confirm by reply (open, external); default is no reply voting; the light web page or a named contact.
- Who is the "group's named contact" in the SMS text and where it is configured: not specified in the story.
- Which guest receipt SMS exists: `msg.vot.guest_receipt` (EV-VOT-08) is in the catalogue but VOT-06 names no such message and says guests see the result on their link. Which story owns it?

---

### NTF-12 Let operators see what was sent, and why

**Story:** NTF-12 Let operators see what was sent, and why

**Surfaces:**
- SCR-NTF-35 | Operator notification log (each attempt: message id, base key and language, event id and epic, masked number and user id, channel, status, provider code and message, segment count and encoding, cost and payer class, timestamps queued, sent, delivered, opened; decision in words; search and filter by phone number, user, group, epic, base key, status, date range, payer) | page (operator console) | Operator holding `view notification log` | Entry: support ticket, spending review, routine check | Exit: SCR-NTF-36
- SCR-NTF-36 | Message trace (the whole chain for one event across channels) | page (operator console) | Operator holding `view notification log` | Entry: a row of SCR-NTF-35 | Exit: SCR-NTF-37
- SCR-NTF-37 | Reveal message text (reason required, then the rendered body) | modal (operator console) | Operator holding `reveal message text` | Entry: "Reveal" on SCR-NTF-36 | Exit: SCR-NTF-36
- SCR-NTF-38 | Log export | sheet (operator console) | Operator holding `view notification log` | Entry: "Export" on SCR-NTF-35 | Exit: SCR-NTF-35

**States per surface:**
- SCR-NTF-35 default: row per attempt with the decision in words ("SMS sent: push not opened within the window", "SMS skipped: person opted out", "SMS cancelled: contribution already paid", "SMS held: quiet hours", "SMS skipped: daily cap", "SMS skipped: number on the suppression list").
- SCR-NTF-35 empty: "No matching messages".
- SCR-NTF-35 loading: skeletons.
- SCR-NTF-35 provider down: the log still lists attempts with status Queued or Failed.
- SCR-NTF-35 write gap: a log write failure never blocks sending; the system buffers and reconciles later; a gap is flagged to operators.
- SCR-NTF-35 totals: the log is the per-message record behind OPS-12 totals; both reconcile on messages accepted by the provider, by sent time, on Madagascar calendar days, with 48-hour delivery-report tolerance and a 02:00 next-day cut-off.
- SCR-NTF-35 hidden: operators without `view notification log`; screen not shown.
- SCR-NTF-36 default: full chain across channels for one event.
- SCR-NTF-36 text hidden: rendered text hidden by default; OTP codes never stored in logs.
- SCR-NTF-37 default: operator states a reason, then sees the text; every reveal audited with operator, reason, time.
- SCR-NTF-37 hidden: operators without `reveal message text` cannot open it.
- SCR-NTF-38 default: export; every export audited; retention `ntf.log_retention` (12 months).

**Criteria map:**
- AC 1: SCR-NTF-35 default.
- AC 2: SCR-NTF-35 default (decision in words).
- AC 3: SCR-NTF-35 default (search and filters) and SCR-NTF-36 default (trace).
- AC 4: SCR-NTF-36 text hidden, SCR-NTF-37 default, SCR-NTF-38 default.
- AC 5: SCR-NTF-35 totals.
- AC 6: SCR-NTF-35 empty, loading, provider down.
- AC 7: SCR-NTF-35 write gap.
- AC 8: no UI, system rule (no user notifications; operator alerts are OPS-12).
- AC 9: SCR-NTF-37 and SCR-NTF-38 (access, reveals and exports audited; logs kept `ntf.log_retention`).

**Objects and fields:** Delivery attempt; Notification; Audit entry (reveal, export, access).

**Open points:**
- The operator permissions `view notification log` and `reveal message text` are described as "to be added to the OPS-01 catalogue" (NTF open question 9); verify they exist in OPS-01.
- Operators cannot resend or send (open question closed); does SCR-NTF-36 show a "Resend" control hidden or absent? Not specified in the story (absent by decision).
- Export format and scope: not specified in the story.

---

### NTF-13 When the SMS cannot be delivered

**Story:** NTF-13 When the SMS cannot be delivered

**Surfaces:**
- SCR-NTF-39 | SMS unreachable banner ("We could not reach you by SMS. Check your phone number." with a link to change or confirm the number, ACC-05) | inline (on app open and on the item in SCR-NTF-01) | The recipient | Entry: next app open after a permanent failure | Exit: ACC-05 phone number screen
- SCR-NTF-40 | System: SMS retry and failure classification (temporary versus permanent, deadline-aware retries, "Unreachable by SMS" mark, aggregator failure-rate alert) | system | none | Entry: provider failure or no delivery report | Exit: SCR-NTF-39, SCR-NTF-07, operator alert

**States per surface:**
- SCR-NTF-39 default: shown until a later SMS succeeds; the item stays in the centre; `msg.ntf.sms_unreachable.inapp` (EV-NTF-04, surface SCR-NTF-250).
- SCR-NTF-40 Retrying: temporary failure retried up to `ntf.sms_max_retries` (3) after `ntf.sms_retry_backoff` (5, 15 and 60 minutes); state reads "Retrying"; a delivery report moves it to Delivered.
- SCR-NTF-40 permanent: invalid or unreachable number or blocked; retries stop at once; number marked "Unreachable by SMS".
- SCR-NTF-40 deadline passed: no retry after the event deadline; the attempt is closed with the reason "deadline passed".
- SCR-NTF-40 no report: no delivery report after `ntf.sms_report_timeout` (60 minutes) reads "No delivery report", not counted as delivered.
- SCR-NTF-40 sender view: "Not reached" by name with no reason (SCR-NTF-07); holders of `Contribution plan: send reminder` or `Vote: create` see the count of unreached people (cause counts only in groups of 5 or more); the group channel never names them.
- SCR-NTF-40 aggregator failure: failure rate over the limit alerts operators and a second aggregator can be used through the adapter (open question); queued messages never lost.
- SCR-NTF-40 cost: costs recorded only as reported by the provider; a failed message the provider does not bill is not counted against the allowance.
- SCR-NTF-40 notices: no SMS about an SMS failure; sender summary in-app.

**Criteria map:**
- AC 1: SCR-NTF-40 Retrying.
- AC 2: SCR-NTF-40 permanent.
- AC 3: SCR-NTF-40 deadline passed.
- AC 4: SCR-NTF-39 default.
- AC 5: SCR-NTF-40 sender view.
- AC 6: SCR-NTF-40 aggregator failure.
- AC 7: SCR-NTF-40 Retrying and no report.
- AC 8: SCR-NTF-40 cost.
- AC 9: SCR-NTF-39 default and SCR-NTF-40 notices (`msg.ntf.sms_unreachable.inapp`, no SMS).
- AC 10: no UI, system rule (each attempt, retry, classification and final state logged, NTF-12).

**Objects and fields:** Delivery attempt (state, classification, retries); Notification; Notification preference.

**Open points:**
- A second SMS aggregator or a voice call for Critical codes (open, external; default one aggregator, no voice call).
- How does the person dismiss SCR-NTF-39 if the number is correct and SMS still fails? Not specified in the story.
- The failure-rate limit and the alert surface are OPS-12; not specified in this story.

---

### NTF-14 One calm summary a week

**Story:** NTF-14 One calm summary a week

**Surfaces:**
- SCR-NTF-41 | Weekly digest (one in-app item per person, per group short sentences: balance change, contributions paid and due, decisions made, events next week, open items waiting, each with a link; `/notifications/digest`) | page | A member with the digest on and at least one group | Entry: the push or in-app item `msg.ntf.weekly_digest`, SCR-NTF-01 | Exit: each linked item
- SCR-NTF-42 | System: digest builder (runs at `ntf.digest_day`, Sunday 18:00 Madagascar time; carries Low items and recaps Normal ones; never SMS) | system | none | Entry: digest day | Exit: SCR-NTF-41

**States per surface:**
- SCR-NTF-41 default: sentences per group with links; amounts as `12 500 Ar`; plain sentences, not tables.
- SCR-NTF-41 quiet week: nothing sent when nothing happened or is waiting.
- SCR-NTF-41 no push device: the in-app digest only; with a device and push allowed, one push as well.
- SCR-NTF-41 loading and empty: as NTF-01.
- SCR-NTF-41 offline: shows the cached digest.
- SCR-NTF-41 figure failure: a sentence whose figure cannot be loaded is dropped rather than shown wrong.
- SCR-NTF-41 muted group or quiet hours: respects quiet hours, language and group mutes; never contains names of late payers.
- SCR-NTF-41 off: digest switched off in SCR-NTF-13; nothing sent.
- SCR-NTF-42 audit: sent digests are logged (NTF-12); never counts against the SMS allowance.

**Criteria map:**
- AC 1: SCR-NTF-41 default and no push device.
- AC 2: SCR-NTF-41 quiet week.
- AC 3: SCR-NTF-41 muted group or quiet hours.
- AC 4: SCR-NTF-42 audit (never SMS, never counted against the allowance).
- AC 5: SCR-NTF-41 loading, empty, offline.
- AC 6: SCR-NTF-41 figure failure.
- AC 7: SCR-NTF-41 default (`msg.ntf.weekly_digest`, EV-NTF-08, surface SCR-NTF-254).
- AC 8: SCR-NTF-42 audit.
- AC 9: SCR-NTF-41 default (plain sentences, three languages, `12 500 Ar`).

**Objects and fields:** Notification (digest items per group); Notification preference (digest switch).

**Open points:**
- The digest "carries Low-class items and recaps Normal ones": which catalogue rows are Low items to include (EV-RUL-05 is named explicitly "I, digest")? The list of rows feeding the digest is not specified in the story.
- Digest page route `/notifications/digest` is in the catalogue only; its layout for a person in many groups (ordering, collapse) is not specified in the story.
- Does a digest ever show a held-for-quiet-hours state? Not specified in the story.

---

## Catalogue surfaces

The catalogue has 160 rows (EV-ACC-05 is retired and not counted). Each row is a notification surface; the row text below is the NTF catalogue text. Every notification is stored as a base key plus parameters and rendered in the reader's current language; each variant (`.inapp`, `.push`, `.sms`) exists in Malagasy, French and English; an SMS variant is GSM-7 and one segment (NTF-07, XCT-12). Epic-owned rows are also listed where the emitting epic file defines them (marked as epic surface). Email is not a channel.

Common states of every catalogue surface (one set, not repeated per row):

- In-app item: Unread (dot and bold text), Read, Needs your action, Resolved (the need was resolved by anyone and the text reads as a past event); tapping opens the deep link in the row and records Opened (NTF-01).
- Push: Queued, Held (quiet hours), Sent, Delivered, Opened, Not opened, No device, Failed. Held items are delivered silently when quiet hours end (NTF-09), except Critical.
- SMS: Not needed, Queued, Held (quiet hours), Sent, Retrying, Delivered, No delivery report, Failed, Unreachable, Cancelled (need resolved before sending), Skipped (opt-out, allowance or cap), Expired while held. S-fb waits `ntf.sms_window.<type>` for the push to be opened; S-d is sent with no push step; at most one SMS per event per person.
- Batched: more than `ntf.batch_threshold` similar items in `ntf.batch_window` become one summary (EV-NTF-07); Critical and a person's own money-moved receipts are never batched.
- Failure and offline: a failed channel leaves the in-app item; the cached centre shows the item with Last synced (NTF-01); a deep link to something no longer visible opens the explanation SCR-NTF-04.
- Language: recipient language, then group language, then Malagasy.

Row-specific conditions are stated in each entry (trigger and notes, audience, channel cell, class, payer). Where the Channel cell lists only S-d or only SMS, the in-app item is written for account holders by the catalogue rule unless the cell says otherwise (see the open point under NTF-01).
- SCR-NTF-101 | EV-ACC-01 Sign-in or action code requested (`msg.acc.otp`) | notification | audience: The requester | entry: Person asks for a code (sign-up, sign-in, PIN reset, sensitive action) | exit: None (code autofill format); channels: S-d, no in-app; variants: msg.acc.otp.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-02
- SCR-NTF-102 | EV-ACC-02 New device signed in (`msg.acc.new_device`) | notification | audience: Account owner, on existing devices and by SMS | entry: Successful sign-in from an unknown device | exit: `/account/devices`; channels: I, P on other devices, S-d; variants: msg.acc.new_device.inapp, msg.acc.new_device.push, msg.acc.new_device.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-05
- SCR-NTF-103 | EV-ACC-03 PIN changed or reset (`msg.acc.pin_changed`) | notification | audience: Account owner | entry: PIN set or reset | exit: `/account/security`; channels: I, P, S-d; variants: msg.acc.pin_changed.inapp, msg.acc.pin_changed.push, msg.acc.pin_changed.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-03
- SCR-NTF-104 | EV-ACC-04 Phone number changed (`msg.acc.phone_changed`) | notification | audience: Old and new number | entry: Number updated | exit: `/account/security`; channels: S-d to both, I; variants: msg.acc.phone_changed.inapp, msg.acc.phone_changed.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-06
- SCR-NTF-105 | EV-ACC-06 Identity check submitted (`msg.acc.kyc_submitted`) | notification | audience: Applicant | entry: Documents sent | exit: `/account/identity`; channels: I; variants: msg.acc.kyc_submitted.inapp; class: Low; payer: None; emitted by: ACC-08
- SCR-NTF-106 | EV-ACC-07 Identity check approved (`msg.acc.kyc_approved`) | notification | audience: Applicant | entry: Operator or system approves a tier | exit: `/account/identity`; channels: I, P, S-fb; variants: msg.acc.kyc_approved.inapp, msg.acc.kyc_approved.push, msg.acc.kyc_approved.sms (S-fb); class: Important; payer: Pl; emitted by: ACC-09
- SCR-NTF-107 | EV-ACC-08 Identity check needs action (`msg.acc.kyc_action_needed`) | notification | audience: Applicant | entry: Rejected, or more information needed | exit: `/account/identity`; channels: I, P, S-fb; variants: msg.acc.kyc_action_needed.inapp, msg.acc.kyc_action_needed.push, msg.acc.kyc_action_needed.sms (S-fb); class: Important; payer: Pl; emitted by: ACC-09
- SCR-NTF-108 | EV-ACC-09 Tier limit reached (`msg.acc.limit_reached`) | notification | audience: The person, in context | entry: A money action hit a limit | exit: `/account/identity`; channels: I; variants: msg.acc.limit_reached.inapp; class: Normal; payer: None; emitted by: ACC-07
- SCR-NTF-109 | EV-ACC-10 Account restricted (`msg.acc.restricted`) | notification | audience: Account owner | entry: Operator restriction for compliance | exit: `/support`; channels: I, P, S-fb; variants: msg.acc.restricted.inapp, msg.acc.restricted.push, msg.acc.restricted.sms (S-fb); class: Important; payer: Pl; emitted by: OPS-10
- SCR-NTF-110 | EV-ACC-11 Account locked (`msg.acc.locked`) | notification | audience: Account owner, on remaining devices and by SMS | entry: Account lock applied (ACC-11); sent to remaining devices before they are cut off | exit: `/account/security`; channels: I, P, S-d; variants: msg.acc.locked.inapp, msg.acc.locked.push, msg.acc.locked.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-11
- SCR-NTF-111 | EV-ACC-12 Account unlocked (`msg.acc.unlocked`) | notification | audience: Account owner | entry: Account lock lifted | exit: `/account/security`; channels: I, P, S-d; variants: msg.acc.unlocked.inapp, msg.acc.unlocked.push, msg.acc.unlocked.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-11
- SCR-NTF-112 | EV-ACC-13 Account deletion started (`msg.acc.delete_started`) | notification | audience: Account owner | entry: Deletion confirmed and grace begins; the text includes the cancel instructions and the date (hostile-deletion alarm) | exit: `/account/delete`; channels: I, P, S-d; variants: msg.acc.delete_started.inapp, msg.acc.delete_started.push, msg.acc.delete_started.sms (S-d); class: Critical; payer: Pl; emitted by: ACC-15
- SCR-NTF-113 | EV-ACC-14 Account deleted (`msg.acc.delete_done`) | notification | audience: The former account holder | entry: Deletion completed | exit: None; channels: S-d; variants: msg.acc.delete_done.sms (S-d); class: Important; payer: Pl; emitted by: ACC-15
- SCR-NTF-114 | EV-ACC-15 Account data export ready (`msg.acc.export_ready`) | notification | audience: The requester | entry: Export file generated | exit: `/account/export`; channels: I, P; variants: msg.acc.export_ready.inapp, msg.acc.export_ready.push; class: Normal; payer: None; emitted by: ACC-14
- SCR-NTF-115 | EV-ACC-16 Assisted sign-up done (`msg.acc.assist_done`) | notification | audience: The facilitator | entry: A facilitator finished an assisted sign-up for another person; the text carries the first name only | exit: `/account/assist`; channels: I, P; variants: msg.acc.assist_done.inapp, msg.acc.assist_done.push; class: Normal; payer: None; emitted by: ACC-10
- SCR-NTF-116 | EV-ACC-17 Invite link sent to a number without an account (`msg.acc.invite_link`) | notification | audience: The person with the number | entry: The link is re-sent or asked for again; the first send is EV-GRP-02 | exit: `/join/{token}`; channels: S-d; variants: msg.acc.invite_link.sms (S-d); class: Important; payer: Gr; emitted by: ACC-16
- SCR-NTF-117 | EV-ACC-18 Vote link sent to a number without an account (`msg.acc.vote_link`) | notification | audience: The guest voter | entry: The link is re-sent or asked for again; the first send is EV-VOT-07 | exit: `/v/{token}`; channels: S-d; variants: msg.acc.vote_link.sms (S-d); class: Important; payer: Gr; emitted by: ACC-16
- SCR-NTF-118 | EV-WAL-01 Deposit pending (`msg.wal.deposit_pending`) | notification | audience: The depositor | entry: Payment started, awaiting provider | exit: `/wallets/{w}/tx/{t}`; channels: I; variants: msg.wal.deposit_pending.inapp; class: Normal; payer: None; emitted by: WAL-06
- SCR-NTF-119 | EV-WAL-02 Deposit confirmed (`msg.wal.deposit_confirmed`) | notification | audience: The depositor | entry: Provider confirms; this is the money-posted-to-a-wallet event that RUL-07 consumes | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.wal.deposit_confirmed.inapp, msg.wal.deposit_confirmed.push, msg.wal.deposit_confirmed.sms (S-fb); class: Important; payer: Pl; emitted by: WAL-07
- SCR-NTF-120 | EV-WAL-03 Deposit failed (`msg.wal.deposit_failed`) | notification | audience: The depositor | entry: Provider reports failure; says no money moved | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.wal.deposit_failed.inapp, msg.wal.deposit_failed.push, msg.wal.deposit_failed.sms (S-fb); class: Important; payer: Pl; emitted by: WAL-07
- SCR-NTF-121 | EV-WAL-04 Withdrawal pending (`msg.wal.withdrawal_pending`) | notification | audience: The requester | entry: Request sent to provider (initiation) | exit: `/wallets/{w}/tx/{t}`; channels: I, P; variants: msg.wal.withdrawal_pending.inapp, msg.wal.withdrawal_pending.push; class: Normal; payer: None; emitted by: WAL-10
- SCR-NTF-122 | EV-WAL-05 Withdrawal confirmed (`msg.wal.withdrawal_confirmed`) | notification | audience: The requester | entry: Provider confirms; a withdrawal outcome row, one SMS per outcome | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb; variants: msg.wal.withdrawal_confirmed.inapp, msg.wal.withdrawal_confirmed.push, msg.wal.withdrawal_confirmed.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: WAL-11
- SCR-NTF-123 | EV-WAL-06 Withdrawal failed (`msg.wal.withdrawal_failed`) | notification | audience: The requester | entry: Provider reports failure; a withdrawal outcome row, one SMS per outcome | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb; variants: msg.wal.withdrawal_failed.inapp, msg.wal.withdrawal_failed.push, msg.wal.withdrawal_failed.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: WAL-11
- SCR-NTF-124 | EV-WAL-07 Transaction needs attention (`msg.wal.needs_attention`) | notification | audience: The owner | entry: Pending past expected time, or mismatch | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.wal.needs_attention.inapp, msg.wal.needs_attention.push, msg.wal.needs_attention.sms (S-fb); class: Important; payer: Pl; emitted by: WAL-20
- SCR-NTF-125 | EV-WAL-08 Payout delayed (provider unavailable, payout queued) (`msg.wal.provider_queued`) | notification | audience: The requester | entry: Provider down, payout held; the single payout-delayed event, used by SPD-11 and matching WAL-08 criterion 7 | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb (S-d by the money-out SMS rule); variants: msg.wal.provider_queued.inapp, msg.wal.provider_queued.push, msg.wal.provider_queued.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: WAL-08
- SCR-NTF-126 | EV-WAL-09 Transfer between own wallets done (`msg.wal.transfer_done`) | notification | audience: The owner | entry: Transfer confirmed | exit: `/wallets/{w}/tx/{t}`; channels: I; variants: msg.wal.transfer_done.inapp; class: Low; payer: None; emitted by: WAL-12
- SCR-NTF-127 | EV-WAL-10 Money received from a person (`msg.wal.transfer_received`) | notification | audience: The receiver | entry: Transfer into wallet from another person | exit: `/wallets/{w}/tx/{t}`; channels: I, P; variants: msg.wal.transfer_received.inapp, msg.wal.transfer_received.push; class: Normal; payer: None; emitted by: WAL-13
- SCR-NTF-128 | EV-WAL-11 Export ready (`msg.wal.export_ready`) | notification | audience: The requester | entry: Export file generated | exit: `/wallets/{w}/export`; channels: I; variants: msg.wal.export_ready.inapp; class: Low; payer: None; emitted by: WAL-16
- SCR-NTF-129 | EV-WAL-12 Transfer sent to another person (`msg.wal.transfer_sent`) | notification | audience: The sender | entry: Transfer outcome, because money left the sender's ownership; one SMS per outcome; suppressed for campaign-tagged transfers, which use EV-ANN-11 | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb; variants: msg.wal.transfer_sent.inapp, msg.wal.transfer_sent.push, msg.wal.transfer_sent.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: WAL-13
- SCR-NTF-130 | EV-WAL-13 Balance corrected (`msg.wal.balance_corrected`) | notification | audience: The wallet owner | entry: Operator correction posted as a reversing entry (OPS-05) | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.wal.balance_corrected.inapp, msg.wal.balance_corrected.push, msg.wal.balance_corrected.sms (S-fb); class: Important; payer: Pl; emitted by: WAL-18
- SCR-NTF-131 | EV-WAL-14 Group wallet closed (`msg.wal.group_wallet_closed`) | notification | audience: Holders of Wallet: view balance | entry: A group wallet is closed at zero balance (WAL-05); closing a personal wallet sends nothing | exit: `/wallets/{w}`; channels: I, P; variants: msg.wal.group_wallet_closed.inapp, msg.wal.group_wallet_closed.push; class: Normal; payer: None; emitted by: WAL-05
- SCR-NTF-132 | EV-RUL-01 Rule fired (`msg.rul.fired`) | notification | audience: Wallet owner; holders of Wallet: view history for group wallets | entry: A rule created a ledger entry; a whole chain of rules fired by one arrival is one item that names each rule (decision D3) | exit: `/wallets/{w}/history`; channels: I (batched, NTF-08); variants: msg.rul.fired.inapp; class: Low; payer: None; emitted by: RUL-07; epic surface: SCR-RUL-12
- SCR-NTF-133 | EV-RUL-02 Spending cap reached (`msg.rul.cap_reached`) | notification | audience: Wallet owner; holders of Wallet: edit rules for group wallets | entry: Cap hit (personal wallet cap, warn only) | exit: `/wallets/{w}/rules/{r}`; channels: I, P; variants: msg.rul.cap_reached.inapp, msg.rul.cap_reached.push; class: Normal; payer: None; emitted by: RUL-09; epic surface: SCR-RUL-18
- SCR-NTF-134 | EV-RUL-03 Low balance alert (`msg.rul.low_balance`) | notification | audience: Wallet owner; holders of Wallet: edit rules for group wallets | entry: Balance under alert level | exit: `/wallets/{w}`; channels: I, P; variants: msg.rul.low_balance.inapp, msg.rul.low_balance.push; class: Normal; payer: None; emitted by: RUL-11; epic surface: SCR-RUL-25
- SCR-NTF-135 | EV-RUL-04 Goal reached (`msg.rul.goal_reached`) | notification | audience: Wallet owner; group members | entry: Target amount met | exit: `/wallets/{w}/rules/{r}`; channels: I, P; variants: msg.rul.goal_reached.inapp, msg.rul.goal_reached.push; class: Normal; payer: None; emitted by: RUL-10; epic surface: SCR-RUL-21
- SCR-NTF-136 | EV-RUL-05 Goal behind schedule (`msg.rul.goal_behind`) | notification | audience: Wallet owner; holders of Wallet: edit rules for group wallets | entry: Weekly check finds it behind | exit: `/wallets/{w}/rules/{r}`; channels: I, digest; variants: msg.rul.goal_behind.inapp; class: Low; payer: None; emitted by: RUL-10; epic surface: SCR-RUL-22
- SCR-NTF-137 | EV-RUL-06 Rule skipped (personal wallet) (`msg.rul.skipped`) | notification | audience: Wallet owner | entry: Insufficient funds, loop prevented, or chain deeper than the maximum chain depth (decision D3), on a personal wallet. A skip on a group wallet is reported only by EV-CON-14 (`msg.con.split_failed`), never by this row | exit: `/wallets/{w}/rules/{r}`; channels: I, P; variants: msg.rul.skipped.inapp, msg.rul.skipped.push; class: Normal; payer: None; emitted by: RUL-12; epic surface: SCR-RUL-32
- SCR-NTF-138 | EV-RUL-07 Group wallet cap, goal or low-balance setting changed (`msg.rul.group_changed`) | notification | audience: Holders of Wallet: view balance | entry: Cap, goal or low-balance alert edited; a share-rule change uses EV-CON-13 (`msg.con.split_changed`) instead | exit: `/wallets/{w}/rules/{r}`; channels: I, P; variants: msg.rul.group_changed.inapp, msg.rul.group_changed.push; class: Normal; payer: None; emitted by: RUL-13; epic surface: SCR-RUL-36
- SCR-NTF-139 | EV-RUL-08 Spending cap at 80 percent (`msg.rul.cap_warning`) | notification | audience: Wallet owner; holders of Wallet: edit rules for group wallets | entry: The cap warning level is passed; if EV-SPD-15 would follow for the same request within the batch window, EV-SPD-15 is suppressed | exit: `/wallets/{w}/rules/{r}`; channels: I, P; variants: msg.rul.cap_warning.inapp, msg.rul.cap_warning.push; class: Normal; payer: None; emitted by: RUL-09
- SCR-NTF-140 | EV-GRP-01 Group created (`msg.grp.group_created`) | notification | audience: Founder | entry: Founder creates | exit: `/groups/{g}`; channels: I; variants: msg.grp.group_created.inapp; class: Low; payer: None; emitted by: GRP-01
- SCR-NTF-141 | EV-GRP-02 Invitation received (phone) (`msg.grp.invite_received`) | notification | audience: Invitee | entry: Invite sent by number; for a number without an account the phone-number suppression check runs first, and the per-member limit `grp.invite_sms_per_day` applies | exit: `/join/{token}`; channels: S-d (I if account); variants: msg.grp.invite_received.inapp, msg.grp.invite_received.sms (S-d); class: Important; payer: Gr; emitted by: GRP-03
- SCR-NTF-142 | EV-GRP-03 Invitation accepted (`msg.grp.invite_accepted`) | notification | audience: Inviter | entry: Invitee joins | exit: `/groups/{g}/members`; channels: I, P; variants: msg.grp.invite_accepted.inapp, msg.grp.invite_accepted.push; class: Normal; payer: None; emitted by: GRP-04
- SCR-NTF-143 | EV-GRP-04 Invitation declined (`msg.grp.invite_declined`) | notification | audience: Inviter | entry: Invitee declines | exit: `/groups/{g}/members`; channels: I, P; variants: msg.grp.invite_declined.inapp, msg.grp.invite_declined.push; class: Normal; payer: None; emitted by: GRP-04
- SCR-NTF-144 | EV-GRP-05 Member joined (`msg.grp.member_joined`) | notification | audience: Holders of Group: view group | entry: Join completes | exit: `/groups/{g}/members`; channels: I (batched); variants: msg.grp.member_joined.inapp; class: Low; payer: None; emitted by: GRP-05
- SCR-NTF-145 | EV-GRP-06 Member left (`msg.grp.member_left`) | notification | audience: Holders of Group: remove member and Wallet: approve spend | entry: Member leaves | exit: `/groups/{g}/members`; channels: I, P; variants: msg.grp.member_left.inapp, msg.grp.member_left.push; class: Normal; payer: None; emitted by: GRP-16
- SCR-NTF-146 | EV-GRP-07 Member removed (`msg.grp.member_removed`) | notification | audience: The removed person | entry: Removal completes | exit: `/groups/{g}`; channels: I, P, S-fb; variants: msg.grp.member_removed.inapp, msg.grp.member_removed.push, msg.grp.member_removed.sms (S-fb); class: Important; payer: Gr; emitted by: GRP-17
- SCR-NTF-147 | EV-GRP-08 Permission granted (`msg.grp.permission_granted`) | notification | audience: The person | entry: Grant | exit: `/groups/{g}/access/me`; channels: I, P (S-fb if money-out); variants: msg.grp.permission_granted.inapp, msg.grp.permission_granted.push, msg.grp.permission_granted.sms (S-fb); class: Normal (Important if money-out); payer: Gr; emitted by: GRP-08
- SCR-NTF-148 | EV-GRP-09 Permission revoked (`msg.grp.permission_revoked`) | notification | audience: The person | entry: Revoke | exit: `/groups/{g}/access/me`; channels: I, P (S-fb if money-out); variants: msg.grp.permission_revoked.inapp, msg.grp.permission_revoked.push, msg.grp.permission_revoked.sms (S-fb); class: Normal (Important if money-out); payer: Gr; emitted by: GRP-08
- SCR-NTF-149 | EV-GRP-10 Spending rule changed (`msg.grp.threshold_changed`) | notification | audience: Holders of Wallet: approve spend | entry: Thresholds saved | exit: `/groups/{g}/spending-rules`; channels: I, P; variants: msg.grp.threshold_changed.inapp, msg.grp.threshold_changed.push; class: Normal; payer: None; emitted by: GRP-12
- SCR-NTF-150 | EV-GRP-11 Rule loosening needs approval (`msg.grp.threshold_loosen_requested`) | notification | audience: Required approvers | entry: Loosening proposed | exit: `/groups/{g}/spending-rules`; channels: I, P, S-fb; variants: msg.grp.threshold_loosen_requested.inapp, msg.grp.threshold_loosen_requested.push, msg.grp.threshold_loosen_requested.sms (S-fb); class: Important; payer: Gr; emitted by: GRP-12
- SCR-NTF-151 | EV-GRP-12 Group needs a second approver (`msg.grp.approver_shortage`) | notification | audience: Holders of Group: grant permission | entry: Fewer than two reachable holders of Wallet: approve spend while a group wallet holds money (decision D1). The spending-policy screen and this event show anonymous counts of approvers and of people able to be reached, with a warning when fewer than 2 people other than the requester can be reached; counts are hidden for groups under 5 members except the warning | exit: `/groups/{g}/access`; channels: I, P, S-fb; variants: msg.grp.approver_shortage.inapp, msg.grp.approver_shortage.push, msg.grp.approver_shortage.sms (S-fb); class: Important; payer: Gr; emitted by: GRP-14
- SCR-NTF-152 | EV-GRP-13 Wallet created (`msg.grp.wallet_created`) | notification | audience: Members | entry: Group wallet added | exit: `/groups/{g}/wallets/{w}`; channels: I (batched); variants: msg.grp.wallet_created.inapp; class: Low; payer: None; emitted by: GRP-15
- SCR-NTF-153 | EV-GRP-14 Group rules text changed (`msg.grp.group_edited`) | notification | audience: Members | entry: "How our group works" edited | exit: `/groups/{g}/about`; channels: I, P; variants: msg.grp.group_edited.inapp, msg.grp.group_edited.push; class: Normal; payer: None; emitted by: GRP-18
- SCR-NTF-154 | EV-GRP-15 Archive needs confirmation (`msg.grp.archive_requested`) | notification | audience: The second holder of Group: delete group | entry: Archive requested | exit: `/groups/{g}/archive`; channels: I, P, S-fb; variants: msg.grp.archive_requested.inapp, msg.grp.archive_requested.push, msg.grp.archive_requested.sms (S-fb); class: Important; payer: Gr; emitted by: GRP-19
- SCR-NTF-155 | EV-GRP-16 Group archived (`msg.grp.archived`) | notification | audience: Members | entry: Archive confirmed | exit: `/groups/{g}`; channels: I, P; variants: msg.grp.archived.inapp, msg.grp.archived.push; class: Normal; payer: None; emitted by: GRP-19
- SCR-NTF-156 | EV-GRP-17 Deletion scheduled (`msg.grp.delete_scheduled`) | notification | audience: Members | entry: Delete confirmed, grace starts | exit: `/groups/{g}`; channels: I, P; variants: msg.grp.delete_scheduled.inapp, msg.grp.delete_scheduled.push; class: Normal; payer: None; emitted by: GRP-20
- SCR-NTF-157 | EV-GRP-18 Leave confirmed (`msg.grp.leave_confirmed`) | notification | audience: The leaver | entry: Member left | exit: `/groups`; channels: I; variants: msg.grp.leave_confirmed.inapp; class: Low; payer: None; emitted by: GRP-16
- SCR-NTF-158 | EV-GRP-19 Group deleted (`msg.grp.deleted`) | notification | audience: Members | entry: Grace period ended and the group is deleted | exit: `/groups`; channels: I, P; variants: msg.grp.deleted.inapp, msg.grp.deleted.push; class: Normal; payer: None; emitted by: GRP-20
- SCR-NTF-159 | EV-CON-01 Plan or plan parameter change (`msg.con.plan_changed`) | notification | audience: Members | entry: Plan saved, or a parameter change: created, changed, paused, ended | exit: `/groups/{g}/contributions`; channels: I, P; variants: msg.con.plan_changed.inapp, msg.con.plan_changed.push; class: Normal; payer: None; emitted by: CON-01
- SCR-NTF-160 | EV-CON-02 Contribution due soon (`msg.con.due_soon`) | notification | audience: Members who owe | entry: Scheduled before the due date (days set in the plan) | exit: `/groups/{g}/contributions/{c}/pay`; channels: I, P, S-fb; variants: msg.con.due_soon.inapp, msg.con.due_soon.push, msg.con.due_soon.sms (S-fb); class: Important; payer: Gr; emitted by: CON-08
- SCR-NTF-161 | EV-CON-03 Contribution due today (`msg.con.due_today`) | notification | audience: Members who owe | entry: Due date | exit: `/groups/{g}/contributions/{c}/pay`; channels: I, P, S-fb; variants: msg.con.due_today.inapp, msg.con.due_today.push, msg.con.due_today.sms (S-fb); class: Important; payer: Gr; emitted by: CON-08
- SCR-NTF-162 | EV-CON-04 Contribution overdue (`msg.con.overdue`) | notification | audience: The member who owes | entry: Past due, private | exit: `/groups/{g}/contributions/{c}/pay`; channels: I, P, S-fb; variants: msg.con.overdue.inapp, msg.con.overdue.push, msg.con.overdue.sms (S-fb); class: Important; payer: Gr; emitted by: CON-08
- SCR-NTF-163 | EV-CON-05 Reminder sent by a treasurer (`msg.con.reminder_manual`) | notification | audience: Selected late members | entry: Manual reminder, includes the sender's first name | exit: `/groups/{g}/contributions/{c}/pay`; channels: I, P, S-fb; variants: msg.con.reminder_manual.inapp, msg.con.reminder_manual.push, msg.con.reminder_manual.sms (S-fb); class: Important; payer: Gr; emitted by: CON-07
- SCR-NTF-164 | EV-CON-06 Payment received (`msg.con.payment_received`) | notification | audience: The payer | entry: Contribution confirmed | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.con.payment_received.inapp, msg.con.payment_received.push, msg.con.payment_received.sms (S-fb); class: Important; payer: Pl; emitted by: CON-05
- SCR-NTF-165 | EV-CON-07 Payment failed (`msg.con.payment_failed`) | notification | audience: The payer | entry: Contribution failed; says no money moved | exit: `/groups/{g}/contributions/{c}/pay`; channels: I, P, S-fb; variants: msg.con.payment_failed.inapp, msg.con.payment_failed.push, msg.con.payment_failed.sms (S-fb); class: Important; payer: Pl; emitted by: CON-05
- SCR-NTF-166 | EV-CON-08 Member paid (`msg.con.member_paid`) | notification | audience: Holders of Contribution plan: view (counts only) | entry: Contribution confirmed | exit: `/groups/{g}/contributions`; channels: I (batched); variants: msg.con.member_paid.inapp; class: Low; payer: None; emitted by: CON-05
- SCR-NTF-167 | EV-CON-09 Late contributions summary (`msg.con.late_summary`) | notification | audience: Holders of Contribution plan: send reminder | entry: Daily after due date | exit: `/groups/{g}/contributions`; channels: I, P; variants: msg.con.late_summary.inapp, msg.con.late_summary.push; class: Normal; payer: None; emitted by: CON-08
- SCR-NTF-168 | EV-CON-10 Exemption granted or lifted (`msg.con.exempted`) | notification | audience: The exempted member | entry: A holder of Contribution plan: exempt member applies or lifts an exemption | exit: `/groups/{g}/contributions/{c}`; channels: I, P; variants: msg.con.exempted.inapp, msg.con.exempted.push; class: Normal; payer: None; emitted by: CON-10
- SCR-NTF-169 | EV-CON-11 Penalty applied (`msg.con.penalty_applied`) | notification | audience: The member | entry: Late penalty written | exit: `/groups/{g}/contributions/{c}`; channels: I, P, S-fb; variants: msg.con.penalty_applied.inapp, msg.con.penalty_applied.push, msg.con.penalty_applied.sms (S-fb); class: Important; payer: Gr; emitted by: CON-09
- SCR-NTF-170 | EV-CON-12 Income split executed (`msg.con.split_executed`) | notification | audience: Holders of Wallet: view history | entry: Income arrived and rule applied; the item states the rounding amount credited to Gereo when it is above zero (decision D5). In-app only | exit: `/groups/{g}/ledger`; channels: I; variants: msg.con.split_executed.inapp; class: Low; payer: None; emitted by: CON-14
- SCR-NTF-171 | EV-CON-13 Split rule changed (`msg.con.split_changed`) | notification | audience: Members | entry: Share rule edited | exit: `/groups/{g}/split-rules`; channels: I, P; variants: msg.con.split_changed.inapp, msg.con.split_changed.push; class: Normal; payer: None; emitted by: CON-13; epic surface: SCR-RUL-36
- SCR-NTF-172 | EV-CON-14 Split failed (`msg.con.split_failed`) | notification | audience: Holders of Wallet: edit rules | entry: A split run could not complete (CON-15); says what moved and what did not; deduplicated per rule per day by NTF-08 batching | exit: `/groups/{g}/split-rules`; channels: I, P, S-fb; variants: msg.con.split_failed.inapp, msg.con.split_failed.push, msg.con.split_failed.sms (S-fb); class: Important; payer: Gr; emitted by: CON-15
- SCR-NTF-173 | EV-SPD-01 Approval needed (`msg.spd.approval_needed`) | notification | audience: Holders of Wallet: approve spend, excluding the requester (decision D1) | entry: Expense requested below the vote threshold | exit: `/groups/{g}/approvals/{a}`; channels: I, P, S-fb; variants: msg.spd.approval_needed.inapp, msg.spd.approval_needed.push, msg.spd.approval_needed.sms (S-fb); class: Important; payer: Gr; emitted by: SPD-04
- SCR-NTF-174 | EV-SPD-02 Approval reminder (`msg.spd.approval_reminder`) | notification | audience: Approvers who have not acted | entry: Not acted on after one day, once | exit: `/groups/{g}/approvals/{a}`; channels: I, P, S-fb; variants: msg.spd.approval_reminder.inapp, msg.spd.approval_reminder.push, msg.spd.approval_reminder.sms (S-fb); class: Important; payer: Gr; emitted by: SPD-04
- SCR-NTF-175 | EV-SPD-03 Approval progress (`msg.spd.approval_progress`) | notification | audience: The requester | entry: An approver approves | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.approval_progress.inapp, msg.spd.approval_progress.push; class: Normal; payer: None; emitted by: SPD-05
- SCR-NTF-176 | EV-SPD-04 Request approved (`msg.spd.approved`) | notification | audience: Requester and approvers | entry: Required approvals reached, below the vote threshold | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.approved.inapp, msg.spd.approved.push; class: Normal; payer: None; emitted by: SPD-05
- SCR-NTF-177 | EV-SPD-05 Request rejected (`msg.spd.rejected`) | notification | audience: The requester | entry: Approver rejects, with reason | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.rejected.inapp, msg.spd.rejected.push; class: Normal; payer: None; emitted by: SPD-06
- SCR-NTF-178 | EV-SPD-06 Approvals voided (`msg.spd.approvals_voided`) | notification | audience: Requester and earlier approvers | entry: Request or permission changed | exit: `/groups/{g}/approvals/{a}`; channels: I, P, S-fb; variants: msg.spd.approvals_voided.inapp, msg.spd.approvals_voided.push, msg.spd.approvals_voided.sms (S-fb); class: Important; payer: Gr; emitted by: SPD-07
- SCR-NTF-179 | EV-SPD-07 Vote required (`msg.spd.vote_required`) | notification | audience: Requester and holders of Vote: create | entry: Amount above the vote threshold; the vote replaces approvers (decision D4) | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.vote_required.inapp, msg.spd.vote_required.push; class: Normal; payer: None; emitted by: SPD-09
- SCR-NTF-180 | EV-SPD-08 Payout sent (`msg.spd.payout_sent`) | notification | audience: Requester, and the approvers or voters who authorised it | entry: Payout dispatched | exit: `/wallets/{w}/tx/{t}`; channels: I, P; variants: msg.spd.payout_sent.inapp, msg.spd.payout_sent.push; class: Normal; payer: None; emitted by: SPD-10
- SCR-NTF-181 | EV-SPD-09 Payout failed or needs attention (`msg.spd.payout_failed`) | notification | audience: Requester, and the approvers or voters who authorised it | entry: Provider failure; says whether money moved | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-fb; variants: msg.spd.payout_failed.inapp, msg.spd.payout_failed.push, msg.spd.payout_failed.sms (S-fb); class: Important; payer: Gr; emitted by: SPD-11
- SCR-NTF-182 | EV-SPD-10 Insufficient funds (`msg.spd.insufficient_funds`) | notification | audience: The requester | entry: Request exceeds balance | exit: `/groups/{g}/approvals/{a}`; channels: I; variants: msg.spd.insufficient_funds.inapp; class: Normal; payer: None; emitted by: SPD-01
- SCR-NTF-183 | EV-SPD-11 Request expired (`msg.spd.expired`) | notification | audience: The requester | entry: Deadline passed with no decision; `request_expiry` is paused while a notice is held | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.expired.inapp, msg.spd.expired.push; class: Normal; payer: None; emitted by: SPD-12
- SCR-NTF-184 | EV-SPD-12 Freeze applied, for the holders who can lift it (`msg.spd.freeze_applied`) | notification | audience: Holders of Wallet: freeze or Wallet: approve spend, excluding the person who froze | entry: Emergency freeze of a group wallet (SPD-15); at most `ntf.critical_freeze_sms_per_day` freeze SMS per wallet per day, beyond that push and in-app only | exit: `/wallets/{w}`; channels: I, P, S-d; variants: msg.spd.freeze_applied.inapp, msg.spd.freeze_applied.push, msg.spd.freeze_applied.sms (S-d); class: Critical; payer: Pl; emitted by: SPD-15
- SCR-NTF-185 | EV-SPD-13 Freeze applied, for other members (`msg.spd.freeze_applied_members`) | notification | audience: Holders of Wallet: view balance, other than those in EV-SPD-12 | entry: Emergency freeze of a group wallet | exit: `/wallets/{w}`; channels: I, P; variants: msg.spd.freeze_applied_members.inapp, msg.spd.freeze_applied_members.push; class: Normal; payer: None; emitted by: SPD-15
- SCR-NTF-186 | EV-SPD-14 Freeze lifted (`msg.spd.freeze_lifted`) | notification | audience: Holders of Wallet: view balance | entry: Two distinct holders of Wallet: approve spend lift the freeze | exit: `/wallets/{w}`; channels: I, P; variants: msg.spd.freeze_lifted.inapp, msg.spd.freeze_lifted.push; class: Normal; payer: None; emitted by: SPD-15
- SCR-NTF-187 | EV-SPD-15 Spending cap blocked a request (`msg.spd.cap_blocked`) | notification | audience: The requester; holders of Wallet: edit rules | entry: A request would pass the cap (SPD-14); suppressed when `msg.rul.cap_reached` was raised for the same request within the batch window | exit: `/groups/{g}/approvals/{a}`; channels: I; variants: msg.spd.cap_blocked.inapp; class: Normal; payer: None; emitted by: SPD-14
- SCR-NTF-188 | EV-SPD-16 Payout confirmed (`msg.spd.payout_confirmed`) | notification | audience: Requester, and the approvers or voters who authorised it | entry: Provider confirms the payout; the money-out SMS rule applies to the requester | exit: `/wallets/{w}/tx/{t}`; channels: I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb (requester only); variants: msg.spd.payout_confirmed.inapp, msg.spd.payout_confirmed.push, msg.spd.payout_confirmed.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: SPD-10
- SCR-NTF-189 | EV-SPD-17 Changes requested (`msg.spd.needs_changes`) | notification | audience: The requester | entry: An approver asks for changes, with a reason | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.needs_changes.inapp, msg.spd.needs_changes.push; class: Normal; payer: None; emitted by: SPD-06
- SCR-NTF-190 | EV-SPD-18 Receipt added (`msg.spd.approval_attachment_added`) | notification | audience: Approvers who already approved | entry: A file is added to a request that is Awaiting approval; approvals stay | exit: `/groups/{g}/approvals/{a}`; channels: I; variants: msg.spd.approval_attachment_added.inapp; class: Low; payer: None; emitted by: SPD-03
- SCR-NTF-191 | EV-SPD-19 Approval nudge (`msg.spd.approval_nudge`) | notification | audience: Approvers who have not acted | entry: The requester nudges approvers who have not acted, at most once per approver per `approval_reminder_after` | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.approval_nudge.inapp, msg.spd.approval_nudge.push; class: Normal; payer: None; emitted by: SPD-08
- SCR-NTF-192 | EV-SPD-20 Request cancelled (`msg.spd.cancelled`) | notification | audience: The approvers who were waiting, and the requester | entry: The requester or a holder of Wallet: approve spend cancels the request | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.spd.cancelled.inapp, msg.spd.cancelled.push; class: Normal; payer: None; emitted by: SPD-12
- SCR-NTF-193 | EV-VOT-01 Vote opened (`msg.vot.opened`) | notification | audience: Eligible voters | entry: Vote created; a money-vote or authority-vote deadline inside quiet hours is refused or snapped by VOT-01 (NTF-09) | exit: `/groups/{g}/votes/{v}`; channels: I, P, S-fb; variants: msg.vot.opened.inapp, msg.vot.opened.push, msg.vot.opened.sms (S-fb); class: Important; payer: Gr; emitted by: VOT-01; epic surface: SCR-VOT-09
- SCR-NTF-194 | EV-VOT-02 Vote closes soon (first notice) (`msg.vot.closing_soon`) | notification | audience: Eligible voters who have not voted | entry: Scheduled before close, with the NTF-09 reminder rule | exit: `/groups/{g}/votes/{v}`; channels: I, P, S-fb; variants: msg.vot.closing_soon.inapp, msg.vot.closing_soon.push, msg.vot.closing_soon.sms (S-fb); class: Important; payer: Gr; emitted by: VOT-07; epic surface: SCR-VOT-32
- SCR-NTF-195 | EV-VOT-03 Vote closes very soon (money decisions) (`msg.vot.closing_now`) | notification | audience: Voters who have not voted | entry: Scheduled shortly before close, with the NTF-09 reminder rule | exit: `/groups/{g}/votes/{v}`; channels: I, P, S-fb; variants: msg.vot.closing_now.inapp, msg.vot.closing_now.push, msg.vot.closing_now.sms (S-fb); class: Important; payer: Gr; emitted by: VOT-07; epic surface: SCR-VOT-33
- SCR-NTF-196 | EV-VOT-04 Vote result (`msg.vot.result`) | notification | audience: Voters and group | entry: Vote closes with quorum; for a passed money vote the text says the payment starts (decision D4), and the notice is released at the same moment as the payout, no earlier than quiet hours end | exit: `/groups/{g}/votes/{v}`; channels: I, P; variants: msg.vot.result.inapp, msg.vot.result.push; class: Normal; payer: None; emitted by: VOT-08; epic surface: SCR-VOT-38
- SCR-NTF-197 | EV-VOT-05 Quorum not met (`msg.vot.no_quorum`) | notification | audience: Eligible voters | entry: Vote closes without quorum, including a money vote with fewer than two distinct voters other than the requester (decision D4) | exit: `/groups/{g}/votes/{v}`; channels: I, P, S-fb; variants: msg.vot.no_quorum.inapp, msg.vot.no_quorum.push, msg.vot.no_quorum.sms (S-fb); class: Important; payer: Gr; emitted by: VOT-08; epic surface: SCR-VOT-39
- SCR-NTF-198 | EV-VOT-06 Vote extended (`msg.vot.extended`) | notification | audience: Eligible voters | entry: Extension action logged | exit: `/groups/{g}/votes/{v}`; channels: I, P; variants: msg.vot.extended.inapp, msg.vot.extended.push; class: Normal; payer: None; emitted by: VOT-10; epic surface: SCR-VOT-47
- SCR-NTF-199 | EV-VOT-07 Guest vote link (`msg.vot.guest_link`) | notification | audience: Guest voter | entry: Guest voter invited | exit: `/v/{token}`; channels: S-d; variants: msg.vot.guest_link.sms (S-d); class: Important; payer: Gr; emitted by: VOT-06
- SCR-NTF-200 | EV-VOT-08 Guest vote received (`msg.vot.guest_receipt`) | notification | audience: Guest voter | entry: Guest ballot counted; the guest sees the result on the link, with no result SMS | exit: None; channels: S-d; variants: msg.vot.guest_receipt.sms (S-d); class: Important; payer: Gr; emitted by: VOT-06
- SCR-NTF-201 | EV-VOT-09 Queued answer arrived too late (`msg.vot.too_late`) | notification | audience: The voter | entry: Offline vote reached server after close | exit: `/groups/{g}/votes/{v}`; channels: I, P, S-fb; variants: msg.vot.too_late.inapp, msg.vot.too_late.push, msg.vot.too_late.sms (S-fb); class: Important; payer: Gr; emitted by: VOT-18
- SCR-NTF-202 | EV-VOT-10 Decision logged (`msg.vot.decision_logged`) | notification | audience: Members | entry: Result written to decision log | exit: `/groups/{g}/decisions`; channels: I; variants: msg.vot.decision_logged.inapp; class: Low; payer: None; emitted by: VOT-13; epic surface: SCR-VOT-58
- SCR-NTF-203 | EV-VOT-11 Expense vote passed (`msg.vot.expense_passed`) | notification | audience: The requester | entry: A money vote closes Passed and the payment starts without approvers (decision D4) | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.vot.expense_passed.inapp, msg.vot.expense_passed.push; class: Normal; payer: None; emitted by: VOT-03; epic surface: SCR-VOT-15
- SCR-NTF-204 | EV-VOT-12 Expense vote not passed (`msg.vot.expense_failed`) | notification | audience: The requester | entry: A money vote closes Not passed for either reason; the request is Rejected | exit: `/groups/{g}/approvals/{a}`; channels: I, P; variants: msg.vot.expense_failed.inapp, msg.vot.expense_failed.push; class: Normal; payer: None; emitted by: VOT-03; epic surface: SCR-VOT-16
- SCR-NTF-205 | EV-VOT-13 Vote cancelled (`msg.vot.cancelled`) | notification | audience: Eligible voters | entry: Vote cancelled by an action or because the request changed, with the reason | exit: `/groups/{g}/votes/{v}`; channels: I, P; variants: msg.vot.cancelled.inapp, msg.vot.cancelled.push; class: Normal; payer: None; emitted by: VOT-12; epic surface: SCR-VOT-17
- SCR-NTF-206 | EV-VOT-14 Vote updated (`msg.vot.updated`) | notification | audience: Eligible voters already told | entry: A creator edit before the first ballot, only for voters already told | exit: `/groups/{g}/votes/{v}`; channels: I, P; variants: msg.vot.updated.inapp, msg.vot.updated.push; class: Normal; payer: None; emitted by: VOT-12; epic surface: SCR-VOT-53
- SCR-NTF-207 | EV-VOT-15 Decision review due (`msg.vot.review_due`) | notification | audience: The decision owner and the group | entry: The review date of a decision arrives | exit: `/groups/{g}/decisions`; channels: I, P; variants: msg.vot.review_due.inapp, msg.vot.review_due.push; class: Normal; payer: None; emitted by: VOT-09; epic surface: SCR-VOT-44
- SCR-NTF-208 | EV-VOT-16 Vote closed in a tie (`msg.vot.closed_tie`) | notification | audience: Eligible voters | entry: Vote closes with a tie | exit: `/groups/{g}/votes/{v}`; channels: I, P; variants: msg.vot.closed_tie.inapp, msg.vot.closed_tie.push; class: Normal; payer: None; emitted by: VOT-08; epic surface: SCR-VOT-40
- SCR-NTF-209 | EV-VOT-17 Decision assigned (`msg.vot.decision_assigned`) | notification | audience: The named responsible person | entry: A decision entry names a responsible person | exit: `/groups/{g}/decisions`; channels: I, P; variants: msg.vot.decision_assigned.inapp, msg.vot.decision_assigned.push; class: Normal; payer: None; emitted by: VOT-14; epic surface: SCR-VOT-59
- SCR-NTF-210 | EV-VOT-18 Decision amended (`msg.vot.amended`) | notification | audience: Voters and the responsible person | entry: A decision entry is amended; summary only | exit: `/groups/{g}/decisions`; channels: I, P; variants: msg.vot.amended.inapp, msg.vot.amended.push; class: Normal; payer: None; emitted by: VOT-15; epic surface: SCR-VOT-62
- SCR-NTF-211 | EV-PRJ-01 Project created (`msg.prj.created`) | notification | audience: Holders of Project: view | entry: Project saved | exit: `/projects/{p}`; channels: I; variants: msg.prj.created.inapp; class: Low; payer: None; emitted by: PRJ-01; epic surface: SCR-PRJ-06
- SCR-NTF-212 | EV-PRJ-02 Task assigned (`msg.prj.task_assigned`) | notification | audience: The assignee | entry: Task owner set | exit: `/projects/{p}/tasks`; channels: I, P; variants: msg.prj.task_assigned.inapp, msg.prj.task_assigned.push; class: Normal; payer: None; emitted by: PRJ-04; epic surface: SCR-PRJ-21
- SCR-NTF-213 | EV-PRJ-03 Task due soon (`msg.prj.task_due`) | notification | audience: The assignee | entry: Scheduled before the due date; the overdue variant is EV-PRJ-11 | exit: `/projects/{p}/tasks`; channels: I, P; variants: msg.prj.task_due.inapp, msg.prj.task_due.push; class: Normal; payer: None; emitted by: PRJ-04; epic surface: SCR-PRJ-22
- SCR-NTF-214 | EV-PRJ-04 Milestone completed (`msg.prj.milestone_done`) | notification | audience: Project members | entry: Milestone marked done | exit: `/projects/{p}`; channels: I; variants: msg.prj.milestone_done.inapp; class: Low; payer: None; emitted by: PRJ-04; epic surface: SCR-PRJ-24
- SCR-NTF-215 | EV-PRJ-05 Budget line near its limit (`msg.prj.budget_near`) | notification | audience: Holders of Project: manage budget | entry: Spent reaches the alert level | exit: `/projects/{p}/budget`; channels: I, P; variants: msg.prj.budget_near.inapp, msg.prj.budget_near.push; class: Normal; payer: None; emitted by: PRJ-03; epic surface: SCR-PRJ-17
- SCR-NTF-216 | EV-PRJ-06 Decision added manually (`msg.prj.decision_added`) | notification | audience: Project members | entry: Decision entry saved | exit: `/projects/{p}/decisions`; channels: I; variants: msg.prj.decision_added.inapp; class: Low; payer: None; emitted by: VOT-14
- SCR-NTF-217 | EV-PRJ-07 Project closed (`msg.prj.closed`) | notification | audience: Project members | entry: Close action | exit: `/projects/{p}`; channels: I, P; variants: msg.prj.closed.inapp, msg.prj.closed.push; class: Normal; payer: None; emitted by: PRJ-09; epic surface: SCR-PRJ-36
- SCR-NTF-218 | EV-PRJ-08 Added to a project team (`msg.prj.team_added`) | notification | audience: The person added; the owner if not the creator | entry: A person is added to the team | exit: `/projects/{p}`; channels: I, P; variants: msg.prj.team_added.inapp, msg.prj.team_added.push; class: Normal; payer: None; emitted by: PRJ-01; epic surface: SCR-PRJ-05
- SCR-NTF-219 | EV-PRJ-09 Project owner changed (`msg.prj.owner_changed`) | notification | audience: The old and the new owner | entry: Owner changed | exit: `/projects/{p}`; channels: I, P; variants: msg.prj.owner_changed.inapp, msg.prj.owner_changed.push; class: Normal; payer: None; emitted by: PRJ-02; epic surface: SCR-PRJ-12
- SCR-NTF-220 | EV-PRJ-10 Project access changed (`msg.prj.access_changed`) | notification | audience: The affected member | entry: A member's access to the project changes | exit: `/projects/{p}`; channels: I, P; variants: msg.prj.access_changed.inapp, msg.prj.access_changed.push; class: Normal; payer: None; emitted by: PRJ-06; epic surface: SCR-PRJ-29
- SCR-NTF-221 | EV-PRJ-11 Task overdue (`msg.prj.task_overdue`) | notification | audience: The assignee and holders of Project: manage tasks | entry: The due date passed and the task is not done; the overdue audience variant of EV-PRJ-02 and EV-PRJ-03 | exit: `/projects/{p}/tasks`; channels: I, P; variants: msg.prj.task_overdue.inapp, msg.prj.task_overdue.push; class: Normal; payer: None; emitted by: PRJ-04; epic surface: SCR-PRJ-23
- SCR-NTF-222 | EV-EVT-01 Event invitation (`msg.evt.invited`) | notification | audience: Invitees | entry: Event created. Invitees with a device receive I and P (payer None). Invitees with no registered device also receive a direct SMS variant (S-d, payer Gr), once per event per number, after the phone-number suppression check | exit: `/groups/{g}/events/{e}`; channels: I, P; S-d variant for no-device invitees; variants: msg.evt.invited.inapp, msg.evt.invited.push, msg.evt.invited.sms (S-d); class: Normal; payer: None (Gr for the S-d variant); emitted by: EVT-03; epic surface: SCR-EVT-04
- SCR-NTF-223 | EV-EVT-02 Reminder one day before (`msg.evt.reminder_24h`) | notification | audience: Invitees who have not declined | entry: Scheduled with the NTF-09 reminder rule | exit: `/groups/{g}/events/{e}`; channels: I, P, S-fb; variants: msg.evt.reminder_24h.inapp, msg.evt.reminder_24h.push, msg.evt.reminder_24h.sms (S-fb); class: Important; payer: Gr; emitted by: EVT-05; epic surface: SCR-EVT-21
- SCR-NTF-224 | EV-EVT-03 Reminder two hours before (`msg.evt.reminder_2h`) | notification | audience: Confirmed attendees and members without the app | entry: Scheduled with the NTF-09 reminder rule | exit: `/groups/{g}/events/{e}`; channels: I, P, S-fb; variants: msg.evt.reminder_2h.inapp, msg.evt.reminder_2h.push, msg.evt.reminder_2h.sms (S-fb); class: Important; payer: Gr; emitted by: EVT-05; epic surface: SCR-EVT-22
- SCR-NTF-225 | EV-EVT-04 RSVP deadline near (`msg.evt.rsvp_deadline`) | notification | audience: Invitees who have not answered | entry: Scheduled | exit: `/groups/{g}/events/{e}`; channels: I, P; variants: msg.evt.rsvp_deadline.inapp, msg.evt.rsvp_deadline.push; class: Normal; payer: None; emitted by: EVT-04; epic surface: SCR-EVT-18
- SCR-NTF-226 | EV-EVT-05 Event changed (`msg.evt.changed`) | notification | audience: Invitees not declined; the audience is checked as in EVT-05 criterion 2 | entry: Date, time, place or host edited | exit: `/groups/{g}/events/{e}`; channels: I, P, S-fb; variants: msg.evt.changed.inapp, msg.evt.changed.push, msg.evt.changed.sms (S-fb); class: Important; payer: Gr; emitted by: EVT-06; epic surface: SCR-EVT-29
- SCR-NTF-227 | EV-EVT-06 Event cancelled (`msg.evt.cancelled`) | notification | audience: Invitees not declined | entry: Cancelled | exit: `/groups/{g}/events/{e}`; channels: I, P, S-fb; variants: msg.evt.cancelled.inapp, msg.evt.cancelled.push, msg.evt.cancelled.sms (S-fb); class: Important; payer: Gr; emitted by: EVT-07; epic surface: SCR-EVT-33
- SCR-NTF-228 | EV-EVT-07 RSVP saved (`msg.evt.rsvp_saved`) | notification | audience: The responder | entry: Answer recorded | exit: `/groups/{g}/events/{e}`; channels: I; variants: msg.evt.rsvp_saved.inapp; class: Low; payer: None; emitted by: EVT-04; epic surface: SCR-EVT-17
- SCR-NTF-229 | EV-EVT-08 Event payment due (Later) (`msg.evt.payment_due`) | notification | audience: The person | entry: Event with a contribution, person going and unpaid. Not in the MVP | exit: `/groups/{g}/events/{e}/pay`; channels: I, P, S-fb; variants: msg.evt.payment_due.inapp, msg.evt.payment_due.push, msg.evt.payment_due.sms (S-fb); class: Important; payer: Gr; emitted by: EVT-11
- SCR-NTF-230 | EV-EVT-09 Removed from an event (`msg.evt.uninvited`) | notification | audience: The removed invitee | entry: An invitee who had answered Going or Maybe is removed | exit: `/groups/{g}/events`; channels: I, P; variants: msg.evt.uninvited.inapp, msg.evt.uninvited.push; class: Normal; payer: None; emitted by: EVT-03; epic surface: SCR-EVT-13
- SCR-NTF-231 | EV-EVT-10 Event host left (`msg.evt.host_left`) | notification | audience: The event creator | entry: The host left or was removed from the group; the creator becomes the fallback host | exit: `/groups/{g}/events/{e}`; channels: I, P; variants: msg.evt.host_left.inapp, msg.evt.host_left.push; class: Normal; payer: None; emitted by: EVT-01; epic surface: SCR-EVT-05
- SCR-NTF-232 | EV-EVT-11 RSVP summary (`msg.evt.rsvp_summary`) | notification | audience: Holders of Event: edit | entry: The RSVP deadline passed | exit: `/groups/{g}/events/{e}`; channels: I, P; variants: msg.evt.rsvp_summary.inapp, msg.evt.rsvp_summary.push; class: Normal; payer: None; emitted by: EVT-04; epic surface: SCR-EVT-19
- SCR-NTF-233 | EV-EVT-12 Early reminder (`msg.evt.reminder_early`) | notification | audience: Invitees who have not declined | entry: The one-week and three-day reminders; push and in-app only | exit: `/groups/{g}/events/{e}`; channels: I, P; variants: msg.evt.reminder_early.inapp, msg.evt.reminder_early.push; class: Normal; payer: None; emitted by: EVT-05; epic surface: SCR-EVT-23
- SCR-NTF-234 | EV-ANN-01 Announcement published (`msg.ann.published`) | notification | audience: Members | entry: A holder of Publication: announce to group publishes | exit: `/groups/{g}/announcements/{a}`; channels: I, P; variants: msg.ann.published.inapp, msg.ann.published.push; class: Normal; payer: None; emitted by: ANN-01; epic surface: SCR-ANN-05
- SCR-NTF-235 | EV-ANN-02 Urgent announcement (`msg.ann.urgent`) | notification | audience: Members | entry: Publisher marks it Urgent (limited per month by `ANN_URGENT_MAX_PER_MONTH` and bounded by `ANN_URGENT_SMS_SHARE_PERCENT`) | exit: `/groups/{g}/announcements/{a}`; channels: I, P, S-fb; variants: msg.ann.urgent.inapp, msg.ann.urgent.push, msg.ann.urgent.sms (S-fb); class: Important; payer: Gr; emitted by: ANN-01; epic surface: SCR-ANN-06
- SCR-NTF-236 | EV-ANN-03 Special contribution campaign launched (`msg.ann.campaign_launched`) | notification | audience: Members | entry: Campaign opened | exit: `/groups/{g}/campaigns/{a}`; channels: I, P; variants: msg.ann.campaign_launched.inapp, msg.ann.campaign_launched.push; class: Normal; payer: None; emitted by: ANN-04; epic surface: SCR-ANN-22
- SCR-NTF-237 | EV-ANN-04 Campaign contribution received (`msg.ann.campaign_contribution`) | notification | audience: Campaign organisers | entry: Contribution confirmed | exit: `/groups/{g}/campaigns/{a}`; channels: I (batched); variants: msg.ann.campaign_contribution.inapp; class: Low; payer: None; emitted by: ANN-05
- SCR-NTF-238 | EV-ANN-05 Campaign closing soon (`msg.ann.campaign_closing`) | notification | audience: Members who have not contributed | entry: Scheduled before deadline | exit: `/groups/{g}/campaigns/{a}`; channels: I, P; variants: msg.ann.campaign_closing.inapp, msg.ann.campaign_closing.push; class: Normal; payer: None; emitted by: ANN-07; epic surface: SCR-ANN-37
- SCR-NTF-239 | EV-ANN-06 Campaign goal reached (`msg.ann.campaign_goal_reached`) | notification | audience: Members | entry: Goal met | exit: `/groups/{g}/campaigns/{a}`; channels: I, P; variants: msg.ann.campaign_goal_reached.inapp, msg.ann.campaign_goal_reached.push; class: Normal; payer: None; emitted by: ANN-07; epic surface: SCR-ANN-36
- SCR-NTF-240 | EV-ANN-07 Use-of-funds report published (`msg.ann.report_published`) | notification | audience: Contributors | entry: Report saved | exit: `/groups/{g}/campaigns/{a}/report`; channels: I, P; variants: msg.ann.report_published.inapp, msg.ann.report_published.push; class: Normal; payer: None; emitted by: ANN-08; epic surface: SCR-ANN-45
- SCR-NTF-241 | EV-ANN-08 Announcement removed (`msg.ann.removed`) | notification | audience: The author | entry: A holder of Publication: moderate removes | exit: `/groups/{g}/announcements/{a}`; channels: I, P; variants: msg.ann.removed.inapp, msg.ann.removed.push; class: Normal; payer: None; emitted by: ANN-03; epic surface: SCR-ANN-16
- SCR-NTF-242 | EV-ANN-09 Announcement edited (`msg.ann.edited`) | notification | audience: Members | entry: The editor chooses to tell the group | exit: `/groups/{g}/announcements/{a}`; channels: I, P; variants: msg.ann.edited.inapp, msg.ann.edited.push; class: Normal; payer: None; emitted by: ANN-03; epic surface: SCR-ANN-15
- SCR-NTF-243 | EV-ANN-10 Campaign closed (`msg.ann.campaign_closed`) | notification | audience: Members | entry: Campaign ends, with the result in plain words | exit: `/groups/{g}/campaigns/{a}`; channels: I, P; variants: msg.ann.campaign_closed.inapp, msg.ann.campaign_closed.push; class: Normal; payer: None; emitted by: ANN-07; epic surface: SCR-ANN-41
- SCR-NTF-244 | EV-ANN-11 Campaign contribution receipt (`msg.ann.campaign_receipt`) | notification | audience: The contributor | entry: Contribution confirmed; replaces `msg.wal.transfer_sent` for campaign-tagged transfers. Receipt SMS to a non-member go through the phone-number suppression list | exit: `/groups/{g}/campaigns/{a}`; channels: I, P, S-fb (S-d for a non-member); variants: msg.ann.campaign_receipt.inapp, msg.ann.campaign_receipt.push, msg.ann.campaign_receipt.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: ANN-06; epic surface: SCR-ANN-28
- SCR-NTF-245 | EV-ANN-12 Campaign contribution refund (`msg.ann.campaign_refund`) | notification | audience: The contributor | entry: A refund is paid; linked to the original contribution by reference. Refund SMS to a non-member go through the phone-number suppression list | exit: `/groups/{g}/campaigns/{a}`; channels: I, P, S-fb (S-d for a non-member); variants: msg.ann.campaign_refund.inapp, msg.ann.campaign_refund.push, msg.ann.campaign_refund.sms (S-fb and S-d); class: Important; payer: Pl; emitted by: ANN-06; epic surface: SCR-ANN-32
- SCR-NTF-246 | EV-ANN-13 Use-of-funds report due (`msg.ann.report_due`) | notification | audience: The person responsible for the report | entry: Scheduled before the report date, and again after it when Overdue | exit: `/groups/{g}/campaigns/{a}/report`; channels: I, P; variants: msg.ann.report_due.inapp, msg.ann.report_due.push; class: Normal; payer: None; emitted by: ANN-08; epic surface: SCR-ANN-42, SCR-ANN-46
- SCR-NTF-247 | EV-NTF-01 Push enabled test (`msg.ntf.push_enabled`) | notification | audience: The person | entry: First push on a device | exit: `/settings/notifications`; channels: P; variants: msg.ntf.push_enabled.push; class: Normal; payer: None; emitted by: NTF-03
- SCR-NTF-248 | EV-NTF-02 SMS turned off confirmation (`msg.ntf.sms_optout_confirm`) | notification | audience: The person | entry: Opt-out | exit: None; channels: S-d; variants: msg.ntf.sms_optout_confirm.sms (S-d); class: Critical; payer: Pl; emitted by: NTF-10
- SCR-NTF-249 | EV-NTF-03 SMS turned on confirmation (`msg.ntf.sms_optin_confirm`) | notification | audience: The person | entry: Re-opt-in | exit: None; channels: S-d; variants: msg.ntf.sms_optin_confirm.sms (S-d); class: Critical; payer: Pl; emitted by: NTF-10
- SCR-NTF-250 | EV-NTF-04 SMS could not reach you (`msg.ntf.sms_unreachable`) | notification | audience: The person | entry: Permanent SMS failure | exit: `/account/phone`; channels: I; variants: msg.ntf.sms_unreachable.inapp; class: Normal; payer: None; emitted by: NTF-13
- SCR-NTF-251 | EV-NTF-05 Group SMS allowance low (`msg.ntf.sms_allowance_low`) | notification | audience: Holders of Group: set notification settings | entry: Warning level reached, for the reserve or for the open part | exit: `/groups/{g}/sms`; channels: I, P; variants: msg.ntf.sms_allowance_low.inapp, msg.ntf.sms_allowance_low.push; class: Normal; payer: None; emitted by: NTF-06
- SCR-NTF-252 | EV-NTF-06 Group SMS allowance used up (`msg.ntf.sms_allowance_empty`) | notification | audience: Holders of Group: set notification settings | entry: Open part exhausted | exit: `/groups/{g}/sms`; channels: I, P; variants: msg.ntf.sms_allowance_empty.inapp, msg.ntf.sms_allowance_empty.push; class: Important; payer: None; emitted by: NTF-06
- SCR-NTF-253 | EV-NTF-07 Batch summary (`msg.ntf.batch_summary`) | notification | audience: The recipient | entry: More than the batch threshold of similar items; one SMS, counted once | exit: Filtered list; channels: I, P, S-fb (types that allow it); variants: msg.ntf.batch_summary.inapp, msg.ntf.batch_summary.push, msg.ntf.batch_summary.sms (S-fb); class: As the items; payer: As the items; emitted by: NTF-08
- SCR-NTF-254 | EV-NTF-08 Weekly digest (`msg.ntf.weekly_digest`) | notification | audience: Members with digest on (push only if the person has a push device) | entry: Digest day | exit: `/notifications/digest`; channels: I, P; variants: msg.ntf.weekly_digest.inapp, msg.ntf.weekly_digest.push; class: Normal; payer: None; emitted by: NTF-14
- SCR-NTF-255 | EV-OPS-01 Support ticket updated (`msg.ops.ticket_updated`) | notification | audience: The requester | entry: Operator replies or status changes (OPS-07) | exit: `/support/{id}`; channels: I, P, plus S-fb for the statuses "Waiting for you" and "Resolved"; variants: msg.ops.ticket_updated.inapp, msg.ops.ticket_updated.push, msg.ops.ticket_updated.sms (S-fb); class: Normal (Important for those two statuses); payer: Pl; emitted by: OPS-07
- SCR-NTF-256 | EV-OPS-02 Payment provider incident (`msg.ops.provider_incident`) | notification | audience: Affected members | entry: Provider outage declared (OPS-08) | exit: `/status`; channels: I, P, plus S-fb only for affected members with a pending request; variants: msg.ops.provider_incident.inapp, msg.ops.provider_incident.push, msg.ops.provider_incident.sms (S-fb); class: Important; payer: Pl; emitted by: OPS-08; epic surface: SCR-OPS-50
- SCR-NTF-257 | EV-OPS-03 Account under review (`msg.ops.account_review`) | notification | audience: Account owner | entry: An operator opens a compliance review on the account (OPS-10) | exit: `/support`; channels: I, P, S-fb; variants: msg.ops.account_review.inapp, msg.ops.account_review.push, msg.ops.account_review.sms (S-fb); class: Important; payer: Pl; emitted by: OPS-10
- SCR-NTF-258 | EV-OPS-04 Flag alert (`msg.ops.flag_alert`) | notification | audience: Operators with flag-review access | entry: A compliance flag is raised (OPS-10) | exit: Operator console; channels: I, P; variants: msg.ops.flag_alert.inapp, msg.ops.flag_alert.push; class: Normal; payer: None; emitted by: OPS-10
- SCR-NTF-259 | EV-OPS-05 Wallet held by Gereo (`msg.ops.wallet_held`) | notification | audience: Holders of Wallet: approve spend and Group: view audit log | entry: An operator hold is placed on a wallet (OPS-10); the message gives the reference and the support route, never the reason | exit: `/wallets/{w}`; channels: I, P, S-fb; variants: msg.ops.wallet_held.inapp, msg.ops.wallet_held.push, msg.ops.wallet_held.sms (S-fb); class: Important; payer: Pl; emitted by: OPS-10
- SCR-NTF-260 | EV-OPS-06 SMS cost or delivery alert (`msg.ops.sms_alert`) | notification | audience: Operators with access to `view sms costs` | entry: An OPS-12 threshold is passed (spend, delivery rate, aggregator gap) | exit: Operator console; channels: I, P; variants: msg.ops.sms_alert.inapp, msg.ops.sms_alert.push; class: Important; payer: None; emitted by: OPS-12


## Epic summary

Stories: 14.
Distinct surfaces: 202 (inline 18, modal 3, notification 160, page 10, sheet 2, system 9).
State lines: 167.
Open points: 52.

All open points:

1. NTF-01: The catalogue says "every event also writes an in-app item for people with an account unless the Channel cell says None", but some rows list only S-d (for example EV-ACC-14, EV-ACC-17, EV-ACC-18, EV-VOT-07, EV-VOT-08, EV-NTF-02, EV-NTF-03) and EV-ACC-01 says "no in-app". Does an account holder get an in-app item for S-d-only rows? Not specified in the story.
2. NTF-01: The badge counts unread Important or Critical items, but Critical SMS-only rows have no in-app item (EV-ACC-01). Confirm that such events add nothing to the badge. Not specified in the story.
3. NTF-01: The explanation "Ask <name of a holder of Group: grant permission>" names a person; conventions 09 section 6.3 rule 6 and the GRP "unavailable" marker apply when that holder is Locked or Inactive. Not specified in the story.
4. NTF-01: Exact key texts for "Nothing new...", "Could not update...", "No connection" are quoted intent; keys not specified in the story.
5. NTF-01: A person who left the group: do old items remain in the centre (retention 12 months) with the NTF-01 explanation, or are they removed (ANN-02 criterion 8 says no notifications after leaving)? Not specified in the story.
6. NTF-01: Catalogue: EV-RUL-08 `msg.rul.cap_warning` is a row, but RUL-09 says the 80 percent warning uses the same message family as `msg.rul.cap_reached` and the RUL epic defines no new key. Which key sends the warning?
7. NTF-01: Catalogue: EV-VOT-10 `msg.vot.decision_logged` is emitted by VOT-13 in the catalogue, while VOT-13 criterion 8 and VOT-14 criterion 5 say VOT-14 is the only emitter; and EV-PRJ-06 `msg.prj.decision_added` is emitted by VOT-14 in the catalogue, while VOT-14 criterion 5 cites EV-PRJ-06 for the key `msg.vot.decision_logged`. Which rows and keys are final?
8. NTF-01: Catalogue: EV-VOT-09 `msg.vot.too_late` is emitted by VOT-18 in the catalogue, but VOT-18 defines no notification, only the screen string `vot.offline.too_late`.
9. NTF-01: Catalogue: EV-VOT-07 and EV-VOT-08 (guest link, guest receipt) are emitted by VOT-06 in the catalogue, but VOT-06 names neither key.
10. NTF-01: Catalogue: EV-EVT-08 `msg.evt.payment_due` (Later) lists EVT-11 as emitter, which is the calendar export story; EVT has no payment in the MVP.
11. NTF-01: Catalogue: EV-ANN-04 `msg.ann.campaign_contribution` is emitted by ANN-05 in the catalogue but ANN-05 does not name it; and ANN-04 reuses `msg.ann.campaign_launched` for extension updates although each key has one emitter.
12. NTF-01: Catalogue: EV-GRP-08 and EV-GRP-09 (permission granted or revoked) carry payer Gr for an SMS about the person's own access, while the payer legend puts account-safety messages on Pl. Which payer applies?
13. NTF-02: NTF-02 gives the sender view to `Contribution plan: send reminder` or `Vote: create`; EVT-05 criterion 8 says a host sees only counts such as `3 SMS Unreachable` and never names, and VOT-07 criterion 7 gives the vote creator a count. Which story controls the per-name sender view for votes and events? Not specified in the story.
14. NTF-02: Which permission gives the sender view for event invitations and announcements (no `Event:` or `Publication:` permission is listed)? Not specified in the story.
15. NTF-02: The sender view shows "Not reached" by name, while the tracking-privacy decision R107 says senders see only a count of not opened; it is consistent for Opened but "Not reached" by name is a different datum. Confirm with privacy review. Not specified in the story.
16. NTF-03: The first useful moments listed (first wallet, first contribution, first vote) include a vote cast by a guest on the light page; a guest has no device registration (VOT-06); does the explainer appear for guests who later sign in? Not specified in the story.
17. NTF-03: The `ntf.push_prompt_moments` default includes the first vote cast, but a person who only joins to vote (R113) may be on a web page without push support. Not specified in the story.
18. NTF-03: Key and exact text for the explainer title and the four message kinds: not specified in the story.
19. NTF-04: "Waiting for you" and "Group news" type groups are named; the exact membership of each group against the catalogue rows is not listed. Which catalogue rows belong to which switch? Not specified in the story.
20. NTF-04: Where does the person edit quiet hours (NTF-09 says "editable per person in preferences, NTF-04"), but this story lists no quiet hours control, only the sentence. Not specified in the story.
21. NTF-04: The test button "sends one push" to a person without a push device: what is shown? Not specified in the story.
22. NTF-05: NTF-05 AC 4 says event reminder SMS are not cancelled by an RSVP, while conventions and EVT-05 AC 3 say the same; confirm that NTF-05's own text now matches (the story text does).
23. NTF-05: NTF-05 AC 10 adds a reminder SMS to Named voters at the deadline minus 24 hours for authority votes, while VOT-07 criterion 1 schedules reminders at 24 hours and 3 hours for authority votes. Are these the same SMS or two? Not specified in the story.
24. NTF-05: The timer line text is quoted intent; key not specified in the story.
25. NTF-06: The top-up needs `Wallet: initiate spend`, while the screen needs `Group: set notification settings`; what does a holder of only the second permission see on SCR-NTF-21? Not specified in the story.
26. NTF-06: "Cost per message at the current rate when the rate is known": the decision B9 says no price is shown to groups, only counts. Which applies? Not specified in the story.
27. NTF-06: Does SCR-NTF-18 show the allowance when a group has fewer than 5 members (conventions hide counts in small groups for approver reachability)? Not specified in the story.
28. NTF-06: Aggregator rates fix the real allowance value (external, open question 2).
29. NTF-07: Who uses the template registry screen (operators with which permission, or only the build team)? Not specified in the story; OPS-01 catalogue has no template permission named here.
30. NTF-07: Malagasy words needing circumflex letters and the sender ID `ntf.sms_sender_id` (open, needs a native reviewer and the aggregator).
31. NTF-07: Whether the registry is a screen at all or a build-time report (XCT-12 lint): "the template registry shows" suggests a screen; not specified in the story.
32. NTF-08: Does the summary push open SCR-NTF-24 or the centre filtered? The story says "a list filtered to those items"; the page identity and URL are not specified in the story (catalogue says "Filtered list").
33. NTF-08: What is the in-app text of the summary variant for a type with no SMS? Not specified in the story.
34. NTF-08: Batch of items from several types but same group: story limits "similar" to the same base key; the mixed case is not specified.
35. NTF-09: NTF-09 AC 3 says "Votes, approvals and authority votes never override quiet hours", yet the Critical definition includes "freeze applied" which is a group-money safety event for holders; confirm there is no other group-money event that bypasses. Not specified in the story.
36. NTF-09: "Expired while held" item for an approval request: which status does the request show (SPD owns); not specified in this story.
37. NTF-09: The held list ("Held: 2 notifications until 07:00") on the notification centre: surface placement not specified beyond preferences.
38. NTF-10: EV-NTF-02 and EV-NTF-03 (opt-out and opt-in confirmations) carry class Critical in the catalogue, but conventions 11.8 defines Critical as security events and group-money safety events only; an opt-out confirmation is neither. Is Critical correct for these rows?
39. NTF-10: If the confirmation SMS after opt-out is Critical and opt-out covers all non-Critical SMS, confirm that a person who opted out still receives this one message. The story says yes ("one last SMS"); the class label conflicts.
40. NTF-10: Whether two-way SMS and keywords exist is external (open, needs the aggregator); until then the keyword flow (SCR-NTF-31) is not live.
41. NTF-11: Whether a feature-phone user can vote or confirm by reply (open, external); default is no reply voting; the light web page or a named contact.
42. NTF-11: Who is the "group's named contact" in the SMS text and where it is configured: not specified in the story.
43. NTF-11: Which guest receipt SMS exists: `msg.vot.guest_receipt` (EV-VOT-08) is in the catalogue but VOT-06 names no such message and says guests see the result on their link. Which story owns it?
44. NTF-12: The operator permissions `view notification log` and `reveal message text` are described as "to be added to the OPS-01 catalogue" (NTF open question 9); verify they exist in OPS-01.
45. NTF-12: Operators cannot resend or send (open question closed); does SCR-NTF-36 show a "Resend" control hidden or absent? Not specified in the story (absent by decision).
46. NTF-12: Export format and scope: not specified in the story.
47. NTF-13: A second SMS aggregator or a voice call for Critical codes (open, external; default one aggregator, no voice call).
48. NTF-13: How does the person dismiss SCR-NTF-39 if the number is correct and SMS still fails? Not specified in the story.
49. NTF-13: The failure-rate limit and the alert surface are OPS-12; not specified in this story.
50. NTF-14: The digest "carries Low-class items and recaps Normal ones": which catalogue rows are Low items to include (EV-RUL-05 is named explicitly "I, digest")? The list of rows feeding the digest is not specified in the story.
51. NTF-14: Digest page route `/notifications/digest` is in the catalogue only; its layout for a person in many groups (ordering, collapse) is not specified in the story.
52. NTF-14: Does a digest ever show a held-for-quiet-hours state? Not specified in the story.
