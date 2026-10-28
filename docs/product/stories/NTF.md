# NTF: Notifications and SMS

Epic code NTF, release MVP. Follows [00-conventions.md](../00-conventions.md). Evidence shorthand: `R01` = [raw/01-group-savings.md](../../research/raw/01-group-savings.md), `R04` = [raw/04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md), `R07` = [raw/07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md), `R08` = [raw/08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md), `CA` = [competitive-analysis.md](../../research/competitive-analysis.md), `DF` = [design-foundations.md](../../research/design-foundations.md).

## Founder decisions applied in this epic

- D1 and D4: approval notices go only to holders of Wallet: approve spend other than the requester (EV-SPD-01), and only for spending below the vote threshold. A passed vote starts the payout without approvers, so the notices after a vote are the vote result (EV-VOT-04) and the payout events (EV-SPD-08, EV-SPD-09). A money vote that closes with fewer than two distinct voters other than the requester is reported as no quorum (EV-VOT-05).
- D2: permissions are written "Object: name", in full, everywhere. GRP (Shared definitions) owns the member permission catalogue, the bundles and the money-out class; this epic only cites names. SMS settings belong to Group: set notification settings (not money-out, no PIN to grant). Operator permissions are a separate catalogue owned by OPS-01; this epic cites two of them by name, `view notification log` and `reveal message text`.
- Reachability: the spending-policy screen (Group: set spending policy) and EV-GRP-12 show approvers and voters able to be reached as anonymous counts, with a warning when fewer than 2 people other than the requester can be reached. No identity and no cause is shown, and the counts are hidden for groups under 5 members except the warning.
- D3: every deposit is income, so rules chain. One arrival that fires a chain of rules produces one in-app item (EV-RUL-01), not one per rule.
- D5: the rounding amount of a split goes to Gereo as a visible ledger line; the split notification states it when it is above zero (EV-CON-12).
- Emergency freeze of group money is a Critical event for the holders of Wallet: freeze or Wallet: approve spend, other than the person who froze (EV-SPD-12), because money movement has stopped. It is capped per wallet per day (`ntf.critical_freeze_sms_per_day`).
- Money safety and quiet hours: a payout authorised by a passed vote (D4) is never dispatched during quiet hours, so that holders of Wallet: freeze can be informed before money leaves (NTF-09).
## Shared definitions for this epic

**Why this epic matters.** About 9% of adults own a smartphone and about 20% use the internet (CA section 2; the 9% figure is unreproduced, DF section 6), so push reaches few people and SMS is a first-class channel (DF section 3 principle 7). It is also the main running cost of the product (R04 section 14.6 risk 3).

**Channels.** In-app (the notification centre, always written for a person with an account), push, SMS. Email is not used (members may have none; R08 section 6.7 avoid).

**Priority classes.** Priority is a property of the event type in the catalogue. A group cannot change a class, except where a catalogue row says the sender chooses (urgent announcement).

| Class | Meaning | Channels allowed |
| --- | --- | --- |
| Critical | Security events and group-money safety events: codes, new device, PIN or phone change, lock and unlock, the hostile-deletion alarm (ACC-15 `delete_started`) and freeze applied (EV-SPD-12); cannot be switched off; the only class that bypasses quiet hours (NTF-09) | In-app, push, SMS direct |
| Important | Money moved or failed, a deadline that costs the person something, a decision they are needed for | In-app, push, SMS after push is not opened |
| Normal | Useful information | In-app, push |
| Low | Background information | In-app and weekly digest only; no push of its own (the digest is the only push) |

**Channel legend used in the catalogue.** I = in-app. P = push. S-fb = SMS only if the push was not opened within the fallback window (NTF-05). S-d = SMS sent directly with no push step (OTP, security, people without the app). "None" means the channel is not used for that event.

**SMS payer legend.** Pl = Gereo (platform): security codes, personal receipts, the person's own account safety. Gr = the group, charged against its SMS allowance (NTF-06): reminders, votes, events, invites and announcements the group's members trigger.

**Message keys.** A base key has the form `msg.<epic>.<event>`, with the epic segment the lowercase epic code, underscores only inside the event name and no dotted event names (regex `^msg\.[a-z]{2,4}\.[a-z0-9_]+(\.(push|sms|inapp))?$`). Each channel has its own variant (`.push`, `.sms`, `.inapp`; there is no `.email` variant because there is no email channel), and each variant exists in Malagasy (mg), French (fr) and English (en). Every base key must exist in the catalogue below, and a notification body is only ever a `msg.*` key; screen strings use `<epic>.<area>.<name>` keys and never appear in a notification body. `ntf.*` names are a parameter family, not message keys, and are exempt from the key lint (XCT-12 enforces the regex, catalogue membership and the SMS length rule). Stories and the catalogue name the base key, and each key is emitted by exactly one story (the "Emitted by" column). No story hard-codes text. A notification is stored as base key plus parameters and rendered in the reader's current language, so a language change re-renders the notification centre.

**"Opened".** A push or SMS counts as opened when the person taps the push, or opens the linked item in the app, or completes the action it asks for (pays, votes, approves). Opening the notification centre alone does not count for items still unread.

**Delivery vocabulary (the shared status table for this epic).** Push: Queued, Held (quiet hours), Sent, Delivered, Opened, Not opened, No device, Failed. SMS: Not needed, Queued, Held (quiet hours), Sent, Retrying, Delivered, No delivery report, Failed, Unreachable, Cancelled (need resolved before sending), Skipped (opt-out, allowance or cap), Expired while held. Every story in this epic uses these names only; sentences such as "Sending" or "Waiting to see if the push is opened" are display text for these states, not extra states.

**Notification item states (in-app).** Unread, Read, Needs your action, Resolved. Offline queue labels ("Waiting to send", "Sent", "Confirmed") and the local-draft label ("Draft, not sent") are the XCT-05 labels.

**Configurable parameters.** Starting values are decided here from the research and are validated in the first cohort (open question 12); they are working values, not findings. This epic owns every parameter named `ntf.*`. Other epics point at these and never define their own wait, cap or batching value (open question 13). Domain counts that belong to another epic stay with it and only schedule or bound reminders (for example `VOTE_REMINDER_MAX_PER_PERSON`, `late_reminder_max`, `ANN_URGENT_MAX_PER_MONTH`).

| Parameter | Meaning | Starting value |
| --- | --- | --- |
| `ntf.sms_window.<type or class>` | Minutes to wait for the push to be opened before SMS | Important default 120. Spending approval 60. Vote closing and money vote closing 60. Contribution due today 60. Contribution due soon 240. Event reminder 2 hours before 30. Event reminder 24 hours before 240 |
| `ntf.sms_window_deadline_share` | Largest share of the time left before a deadline the wait may use | 0.5 |
| `ntf.push_failed_sms_delay` | Delay before SMS when the push provider reports a failure (NTF-05) | 2 minutes |
| `ntf.sms_daily_cap` | Most SMS one person receives per day. It counts only Group-paid (Gr) and Important non-Critical SMS; Personal-money (Pl) SMS and Critical SMS are never skipped by it. A batched summary (NTF-08) counts once | 3 |
| `ntf.group_sms_allowance` | SMS per group per month included, sized by member count; paid by the platform in the MVP | 4 per member per month, a starting value to calibrate from OPS-12 data and to recompute when the aggregator quote is known |
| `ntf.group_sms_reserve_share` | Share of `ntf.group_sms_allowance` reserved for money-decision types (amount due today or overdue, money vote closing, spending approval). Exhausting the open part never stops money-decision SMS | 50 percent |
| `ntf.sms_allowance_warning_percent` | Share of the allowance used that triggers the warning; computed separately for the reserve and for the open part | 80 |
| `ANN_URGENT_SMS_SHARE_PERCENT` | Bound on Urgent announcements: the effective monthly Urgent cap is min(`ANN_URGENT_MAX_PER_MONTH`, max(1, floor(share x allowance per member per month))), counted per member and on the effective allowance including any top-up. Owned here as a derived constraint, not an ANN parameter | 50 |
| `ntf.reminder_margin_minutes` | Minimum time that must remain before the target time (event start or vote deadline) for a planned reminder or planned fallback SMS to be sent at quiet hours end (NTF-09) | 60 |
| `ntf.critical_freeze_sms_per_day` | Most freeze-applied SMS (EV-SPD-12) per wallet per day; beyond it push and in-app only | 2 |
| `ntf.money_out_sms_min_amount` | Amount at or above which a money-out outcome SMS is sent directly (S-d) instead of as a fallback (S-fb) | 50 000 Ar, a starting value that WAL confirms against research |
| `grp.invite_sms_per_day` | Most invitation SMS one member can trigger per day | 10 |
| `ntf.batch_threshold` | Number of similar items that triggers a summary (NN/g guidance, R07 section 8.8) | 5 |
| `ntf.batch_window` | Time in which similar items are counted | 10 minutes |
| `ntf.quiet_hours_default` | Default quiet window (R07 section 8.8 R-NT5) | 21:00 to 07:00 |
| `ntf.sms_max_retries`, `ntf.sms_retry_backoff` | Retry limits for failed SMS | 3 retries, after 5, 15 and 60 minutes |
| `ntf.sms_report_timeout` | Time after which an SMS without a delivery report reads No delivery report | 60 minutes |
| `ntf.push_prompt_moments`, `ntf.push_reprompt_delay` | When to ask for push permission, and the wait before asking once more | First wallet created, first contribution confirmed, first vote cast; 14 days |
| `ntf.centre_cache_items`, `ntf.centre_retention` | Items cached offline and items kept in the centre | 50 items; 12 months |
| `ntf.log_retention` | How long delivery logs (attempts, decisions) are kept | 12 months. Consent records are not covered: they follow `AUDIT_RETENTION_YEARS` (OPS) |
| `ntf.digest_day` | Day and hour of the weekly digest | Sunday 18:00 Madagascar time |
| `ntf.sms_group_name_max`, `ntf.sms_first_name_max`, `ntf.sms_title_max`, `ntf.sms_place_max` | Longest group name, first name, event or vote title and place in an SMS (NTF-07). Starting values are set so that the XCT-12 worst case stays within one segment | 20, 12, 20 and 20 characters, truncated to safe text under the XCT-12 character mapping. When the worst case still exceeds one segment, a fixed short template is used |
| `ntf.sms_optout_keywords` | Opt-out keywords per language (NTF-10) | STOP and ARRET; the Malagasy word is chosen by the native reviewer |
| `ntf.sms_sender_id`, `ntf.sms_short_link_domain` | Sender name and link shortener, depend on the aggregator | Sender "Gereo"; domain set when the aggregator is chosen |

---

### NTF-01 See everything that happened and open it in one tap

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none (each person sees only their own notifications)
**Tags:** offline

**Story:** As a member, I want one list of everything the app told me, with a tap taking me to the exact item, so that I never lose a request, a vote or a receipt.

**Conversation:** Tricount's notifications deep-link to the exact item (R08 section 6.12 adopt). The centre is also the safety net: whatever happens with push or SMS, the item exists here. Items that need action sit apart from items that only inform, so a person with little time sees what matters first.

**Preconditions:** Signed in. **Trigger:** Opens the bell, or taps a push.

**Acceptance criteria:**
1. Happy path: the list shows notifications newest first, grouped by day, each with a type icon, one-sentence text, group name, absolute time and relative time, and unread state shown by a dot and bold text (not colour alone). Tapping one opens the exact item (the deep link in the catalogue) and marks it read.
2. Rule: a "Needs your action" section on top lists unresolved items (approvals waiting, votes open, contributions due). An item leaves this section when the need is resolved by anyone (for example the approval completed) and its text then reads as a past event.
3. Rule: a deep link to something the person can no longer see (permission removed, group left, group archived) opens an explanation: "You no longer have access to this. Ask <name of a holder of Group: grant permission>." A deep link to a closed or deleted item opens its final state, not an error.
4. States: empty state "Nothing new. Updates from your groups appear here." with a link to preferences; loading skeleton rows; paging loads older items on demand. Mark all as read is one button with an undo.
5. Offline: the latest `ntf.centre_cache_items` items are readable from cache with a "Last synced" line; opening an item that needs the network shows what is cached and a "No connection" explanation; read marks are rows of the XCT-05 auto-send registry and show the XCT-05 label keys, with no copied strings.
6. Rule: the badge on the app counts unresolved items in "Needs your action" plus unread items of class Important or Critical. Unread Normal and Low items show the unread dot in the centre but add nothing to the badge. A batch summary (NTF-08) counts as one.
7. Errors: if the list fails to refresh the cached list stays with "Could not update. [Try again]"; a push that opens when the item has been removed shows the closed-item screen from criterion 3.
8. Notifications: this story defines the in-app channel; nothing is sent by SMS from here. Opening an item records "opened" for NTF-05 and NTF-02.
9. Accessibility and language: each row is one focusable element announcing type, text, group, time and read state; targets 48 dp; texts re-render in the person's current language from base key and parameters.

**Data:** Notification, Device. **Depends on:** ACC-02 and ACC-03 (sign-in), XCT-04 (offline cache), XCT-01 and XCT-14 (language, keys), event catalogue below.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: items are kept for `ntf.centre_retention` (12 months), because a receipt or a decision notice must stay findable for a year and the centre only holds text and links, not documents. Closed: the read state is shared across a person's devices, because it is stored on the server per user.

---

### NTF-02 Know whether the message reached the person

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member; Permission holder
**Permission needed:** none for one's own items; Contribution plan: send reminder or Vote: create to see per-recipient delivery for items they sent
**Tags:** sms, audit

**Story:** When a reminder or a vote notice matters, I want to see whether it reached the person (push delivered, SMS delivered, not opened), so I can follow up in another way instead of guessing.

**Conversation:** Loomio shows a per-recipient delivery log, including who read it where available (R08 section 6.12 adopt). Late payment is sensitive: reminders are private and never shame (R07 section 8.8 R-NT8). So delivery detail is visible to the person who needs to act, never posted to the group, and "opened" is shown only for types where it changes what you do.

**Preconditions:** A notification was created. **Trigger:** Opens a notification detail, or opens "Who was notified" on a vote, event or reminder.

**Acceptance criteria:**
1. Happy path, recipient: each item in the centre shows a delivery line in plain words: "Sent to your phone", "Also sent by SMS", "SMS delivered", "Not opened". It tells the person whether an SMS was sent because the push was not opened.
2. Happy path, sender: a holder of the matching permission sees for each recipient, by name, the highest delivery state reached per channel: push Delivered, No device or Failed; SMS Delivered or Held, or "Not reached" by name with no reason (a member's opt-out is merged with every other cause, such as Failed, Unreachable or Skipped, and is never shown as a reason); and the time. The Opened state is shown to the sender only as a count ("5 not opened"), never beside a name.
3. Rule: only counts are shown to the group ("3 members not reached"; cause counts for treasurers appear only in groups of 5 or more); names with a delivery problem are shown only to the permission holder who sent the item. The "not opened" count exists only for Important and Critical types. A recipient always sees their own Opened state.
4. Rule: the sender view never shows message text of other people's private messages (for example private late-payment reminders to other members), only that one was sent and its state.
5. States: items still Queued show "Sending"; items whose fallback timer is running show "Waiting to see if the push is opened until 14:20"; offline shows the cached state with last synced time.
6. Errors: if the provider has no delivery report the state reads "No delivery report" and is never shown as Delivered; for the recipient, a failed SMS shows the reason in plain words and the next action (for example "Check your phone number"); the sender sees only "Not reached" and the next action "Follow up another way".
7. Notifications: none; viewing delivery state sends nothing.
8. Audit: opening the sender view of per-recipient delivery is logged with who, which item and when, because it exposes personal engagement data.
9. Accessibility and language: states are words plus icons; time is absolute with a relative hint; labels exist in three languages.

**Data:** Notification, Device, Delivery attempt. **Depends on:** NTF-01, NTF-05, NTF-12, CON-07 (manual reminder), VOT-07 (vote reminders).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: "Opened" is tracked, because NTF-05 needs it to avoid paying for an SMS nobody needed. Senders see only the count of not opened, never a name, and the group sees nothing; the tracking is disclosed in the privacy notice (ACC-13). The wording of that disclosure is part of the consent text (ACC-13).

---

### NTF-03 Ask to send notifications only after the app has proved useful

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** offline

**Story:** As a new member, I want the app to ask about notifications only after I have done something useful, with a clear explanation of what I will receive, so that I can say yes knowing why.

**Conversation:** NN/g says to ask for permission later, after value is shown, and to explain what messages will cover (R07 section 8.8; rule R-NT2). Asking at install gets refusals and the system prompt can only be answered once. The first useful moments proposed are the first wallet created or the first contribution made; the list is a parameter (`ntf.push_prompt_moments`) to test. SMS works without any permission, so a refusal is not a dead end.

**Preconditions:** Signed in on a device that supports push. **Trigger:** The person completes one of the configured first useful moments.

**Acceptance criteria:**
1. Happy path: after the moment (for example "Contribution sent"), a screen titled in plain words explains the three or four kinds of messages the person will get (money moved, things waiting for you, reminders, group news) with an icon and one line each, and two buttons, "Turn on notifications" and "Not now". "Turn on" then opens the system permission request.
2. Rule: the system request is never shown at install, at sign-in or on the first screen. It is shown only after "Turn on".
3. Rule: "Not now" closes the screen and nothing else; it is offered again once after `ntf.push_reprompt_delay` at another useful moment, and then never again from the app. The settings screen always offers it.
4. Rule: if the system permission is denied, the app records it, shows no repeating prompt, and the settings screen explains how to enable push in the phone's settings in three plain steps with images. SMS fallback for Important types continues under the person's SMS choice.
5. Rule: on grant, the device is registered (token stored with device id and language); if the token changes it is refreshed silently; if the person signs out the device is unregistered.
6. States: devices without push support (some low-end browsers or Android Go builds) never see the screen and the person's preferences screen says "Push is not available on this phone. Important items come by SMS." Offline: the screen can be completed; push-token registration is a silent technical retry on app open and when connectivity returns, shows no queue label and is not in the XCT-05 registry.
7. Errors: if registration fails after the permission is granted, the person sees "Notifications are on, but we could not finish setting them up. [Try again]" and a retry runs silently at next open; no message is lost because the notification centre still holds everything.
8. Notifications: the first confirmed push on the new device is a short test (`msg.ntf.push_enabled.push`) so the person sees it works; no SMS.
9. Audit: the grant, denial and device registration are recorded as a Consent record and a device event with time, device id and the permission state; ACC-13 displays the Consent record under "my choices".
10. Accessibility and language: the screen is usable with a screen reader and at 200% font size; text in three languages; the "Not now" button has the same visual weight as the primary button.

**Data:** Device, Notification preference, Consent record, Audit entry. **Depends on:** ACC-02 (sign-in), ACC-11 (devices), WAL-01, CON-04 and VOT-04 (the first useful moments), XCT-05 (queue labels).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: for a person who joins only to vote, the first vote cast is a first useful moment (it is in the default list). Closed: push on a web app installed on a low-end Android phone is decided by feature detection at run time; where the browser does not report push support the person is treated as having no device and Important items come by SMS (criterion 6). The share of members with working push is measured from device registrations in the first cohort.

---

### NTF-04 Choose what I get and how

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member; Permission holder
**Permission needed:** none for a member's own choices; Group: set notification settings for the group's SMS settings (NTF-06)
**Tags:** sms, offline

**Story:** As a member, I want to choose which kinds of messages I get, whether I accept SMS for important items, and whether I want a weekly summary, so that the app is useful and not noisy.

**Conversation:** Most people keep defaults, so defaults must be conservative, and per-type toggles belong inside the app (R07 section 8.8, NN/g). The proposed defaults are contributions due, votes closing, approvals waiting, events, and a weekly digest, with everything else off (R07 R-NT3, to validate). Loomio offers digest versus immediate (R08 section 6.12 adopt). The consent default for SMS is an open question because SMS has a cost and consent rules (NTF-10).

**Preconditions:** Signed in. **Trigger:** Opens Settings, then Notifications.

**Acceptance criteria:**
1. Happy path: the screen shows groups of types in plain words (Money, Waiting for you, Reminders, Group news, Weekly summary), each with a push switch; below it a single choice "SMS for important items only" (on or off) with a sentence listing what counts as important, and a switch for the weekly digest (NTF-14). A device row shows the "hide previews" setting owned by ACC-12 (`acc.session.hide_previews`); this screen only displays it and links to it.
2. Rule: Critical types (the NTF-09 definition: security events and group-money safety events, including the freeze SMS and the hostile-deletion alarm) cannot be switched off and the screen says so in one line. Low types have no push switch (they appear in the centre and the digest).
3. Rule: defaults are conservative: Important types on; Normal types push on only for contributions, votes, approvals and events; Low types off; SMS for important items is on by default, shown clearly and never hidden; the consent wording the person accepted is the one of ACC-13 (it names the freeze SMS) and NTF-10, and is not restated here.
4. Rule: a person can mute a group's Normal and Low notifications without leaving the group; Important and Critical types from that group continue. The group part of this screen (usage and allowance, NTF-06) is visible only to holders of Group: set notification settings; personal choices need no permission.
5. Rule: the screen shows the person's current state in words ("Push: on for this phone. SMS: important items only. Quiet hours 21:00 to 07:00") and a "Send me a test" button that sends one push and never an SMS.
6. States: loading skeleton; offline: the screen is readable from cache and preference changes are rows of the XCT-05 auto-send registry, shown with the XCT-05 label keys; while an item is Waiting to send, turning SMS off shows the keyed reassurance "You may still receive SMS until this is sent" because the change is not yet applied. Money items and security alerts are never queued or silenced by a queued preference.
7. Errors: a failed save restores the previous values and says so; a setting never silently reverts.
8. Notifications: changing SMS or push choices sends no message except the opt-out and opt-in confirmations in NTF-10.
9. Audit: every change to SMS consent, digest and per-type switches is recorded with old value, new value, time and device; SMS consent changes write Consent records that ACC-13 displays under "my choices".
10. Accessibility and language: switches have visible labels and state words; the list of "important items" is one plain sentence per type in three languages.

**Data:** Notification preference, Consent record, Audit entry. **Depends on:** NTF-03, NTF-06, NTF-10, NTF-14, ACC-12, ACC-13, XCT-01, XCT-04, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: SMS for important items is on at sign-up, because only about 9 percent of adults own a smartphone (CA section 2) so SMS is the only channel that reaches most members, and opt-out is one switch in the app (NTF-10). The legal wording of consent stays an open external item (open question 3). Closed: a group cannot set a minimum notification level for its members; a person's consent is personal.

---

### NTF-05 Push first, then SMS only if nobody opened the push

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** sms

**Story:** When something important needs a person (a contribution due, a vote closing, a spending approval) and they have not opened the push, I want the system to send one SMS after a set time, so I can act without everyone paying for SMS that nobody needed.

**Conversation:** Push is cheap but reaches few; SMS reaches everyone but costs money and can arrive late (R04 section 14.6 risks 2 and 3; R08 section 6.12 open opportunity "Push first, SMS if unread after a period"). Karlan's field studies show reminders help but extra late reminders add nothing (R07 section 8.8), so one SMS per event, not a ladder. The research recommends SMS only for money moved, codes, deadlines that cost the member something, and members without the app, never for marketing (R07 R-NT1).

**Preconditions:** An event of class Important (Critical events go by SMS direct, NTF-09) with a recipient who has not opted out of SMS. **Trigger:** The event is created and the push is sent.

**Acceptance criteria:**
1. Happy path: the system sends push to the person's registered devices, starts a fallback timer of length `ntf.sms_window.<type>` (for example 60 minutes for the type spending approval), and if the push is not opened (see "Opened" above) before it ends, sends the SMS variant of the message once. If it is opened, no SMS is sent.
2. Rule: only types marked S-fb or S-d in the catalogue ever produce SMS. Normal and Low types never do, whatever the group wants. There is no SMS for marketing.
3. Rule: the wait is deadline-aware: the effective window is the smaller of the configured window and `ntf.sms_window_deadline_share` of the time left before the deadline, so a vote closing in two hours does not wait longer than the vote allows. If too little time is left to wait, the SMS is sent immediately.
4. Rule: the need is re-checked immediately before sending. If the person has already acted (paid, voted, approved), or the event has been cancelled or closed, the SMS is cancelled with state Cancelled and a reason. A person never receives an SMS for something already done. An RSVP counts as "need resolved" only for the RSVP deadline notice: the event reminders (EV-EVT-02, EV-EVT-03) are excluded and are not cancelled by an RSVP, while event changed and event cancelled SMS (EV-EVT-05, EV-EVT-06) still end when the person answers No.
5. Rule: recipients with no registered device, an invalid push token, or push denied skip the push step and receive the SMS directly (S-d behaviour) if their preferences allow it. Recipients who opted out of SMS (NTF-10) receive only push and in-app. Before every S-d SMS to a non-member, the phone-number suppression list (NTF-10) is checked; if the number matches an account, that account's choice applies instead.
6. Rule: at most one SMS per event per person (idempotency key of event, recipient and channel). Respect `ntf.sms_daily_cap` (3), which counts only Group-paid (Gr) and Important non-Critical SMS; Personal-money (Pl) and Critical SMS are never skipped by it. A skipped SMS is logged as Skipped with the reason "daily cap".
7. States: the timer is stored on the server and survives restarts; an item waiting is shown to the recipient as "We will text you at 14:20 if you have not opened this" only for recipients who see the delivery line (NTF-02). Offline phones cannot confirm push delivery, so they are treated as not opened when the timer ends. A planned fallback SMS is scheduled with the NTF-09 reminder rule.
8. Errors: if the push provider fails, the system does not wait the window but sends the SMS after a short delay (logged as "push failed"); if the SMS also fails, NTF-13 applies and the in-app item remains.
9. Ledger and audit: each decision (SMS sent, cancelled, skipped) is logged with event, recipient, reason and time (NTF-12); billable SMS are counted against the payer (NTF-06). No money moves.
10. Rule (spending and authority votes, decisions D1 and D4): the approver-notice events (EV-SPD-01, EV-SPD-02 via SPD-04, and EV-SPD-03, EV-SPD-04 via SPD-05) apply only to requests below the vote threshold. After a vote, notices name no approvers. One exception class exists for authority votes: a reminder SMS goes to a Named voter only when the floor in GRP-13 and VOT "Kinds of vote" is still unmet at the deadline minus 24 hours, and never to a person who already voted or whose ballot is "Waiting to send" as known to the server. It is budgeted under `ntf.group_sms_allowance` (reserve part, money vote closing), follows criteria 3 and 6, and adds no new event per ballot. EV-VOT-05 depends on the "quorum not met" close defined in VOT-03.

**Data:** Notification, Delivery attempt, Device, Notification preference. **Depends on:** NTF-03, NTF-04, NTF-06, NTF-07, NTF-10, NTF-12, NTF-13, VOT-03, event catalogue.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: starting windows are in the parameter table (60 minutes for approvals, money votes and due-today contributions, 120 for other Important items, 30 for the two-hour event reminder), because R-NT3 asks for the approval nudge within a day and votes within hours, and Karlan's studies show one timely SMS is enough (R07 section 8.8). They are tuned by A/B test (open question 12). Closed: guest voters and invitees without an account have no device and get SMS direct (criterion 5); if they later sign in, push-then-SMS applies.

---

### NTF-06 Keep SMS cost under control and say who pays

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: set notification settings)
**Permission needed:** Group: set notification settings (decision D2); a top-up still routes through the spending policy and needs Wallet: initiate spend to request it
**Tags:** sms, ledger, audit

**Story:** As a group member who runs the group's settings, I want to see how many SMS the group has used, what they cost and what happens when the allowance runs out, so that SMS never become a surprise bill or silently stop.

**Conversation:** Twilio lists about USD 0.59 per segment for Madagascar, but local aggregator rates were not verified (CA section 2; R04 section 14.6 risk 3). The research recommends budgeting SMS per group or per event, rationing to critical messages, showing the cost to the group owner and charging by group size or SMS volume without ever gating core behaviour (R08 section 6.12; CA section 7 design rules). This story fixes the rules without choosing prices. Who pays is decided in Open questions.

**Preconditions:** A group exists. **Trigger:** The group uses SMS, or a holder opens "SMS usage" in group settings.

**Acceptance criteria:**
1. Happy path: the screen shows the monthly allowance (`ntf.group_sms_allowance`), SMS used so far this month, the cost per message at the current rate when the rate is known, and a list of what was sent by type and count (never message text of private items).
2. Rule: two payer classes apply. Platform pays (Pl) for security codes, personal receipts and account safety messages, which never reduce a group allowance, and for the approval notices of an allowance top-up request (criterion 5). The group pays (Gr) for invites, reminders, votes, events and announcements that members trigger, which draw from the group allowance.
3. Rule: before a manual bulk send (for example the treasurer's "remind everyone who is late"), the sender sees an estimate "12 SMS, about X Ar" and confirms; automatic sends do not ask but are counted. The estimate shown to a host also includes the invitation SMS that will go to invitees with no device (direct, Gr), and the same cost appears in the OPS-12 cost view.
4. Rule: `ntf.group_sms_reserve_share` (50 percent) of the allowance is reserved for money-decision types (amount due today or overdue, money vote closing, spending approval). When usage reaches `ntf.sms_allowance_warning_percent`, computed separately for the reserve and for the open part, holders of Group: set notification settings get a push and an in-app item. When the open part is used up, Gr-class SMS of other types stop, money-decision SMS still send from the reserve, push and in-app continue, and the banner "SMS are paused for this group" appears for them. Critical and Pl-class SMS never stop. The base value of 4 per member per month is a starting value to calibrate from OPS-12 data.
5. Rule: topping up the allowance is explicit. If it is paid from a group wallet it is a person-initiated expense request (class (a), conventions section 10) with payee Pay Gereo and ledger class "Platform: SMS allowance" (SPD-01): it follows the group's spending policy (SPD-02), so below the vote threshold approvers other than the requester approve it (SPD-05, decision D1) and above it a vote authorises it (SPD-09, decision D4). It shows the exact amount, payee and wallet; nothing is ever deducted from a wallet silently. The approval notices of this request are sent by the Gereo-paid sender (Pl), never from the group allowance. A standing monthly top-up by rule is Later.
6. States: loading skeleton; empty month shows "No SMS used yet this month"; offline shows cached counts with last synced time.
7. Errors: if the usage count cannot be loaded the screen says so and the system errs on the side of not exceeding the allowance, except that money-decision SMS from the reserve still send; if a top-up payment fails, no allowance is added and no money moves.
8. Notifications: `msg.ntf.sms_allowance_low` and `msg.ntf.sms_allowance_empty` to holders of Group: set notification settings (push, in-app; no SMS since it is the problem being addressed).
9. Ledger and audit: each billable SMS records recipient, type, segments, payer class and cost as an operational record; a wallet-funded top-up writes a balanced ledger entry; changes to allowance settings are audited.
10. Rule: an empty SMS allowance never blocks an approval or vote request from appearing in the app inbox, and the top-up request itself is carried in-app.

**Data:** SMS allowance, Delivery attempt, Ledger entry (for top-ups), Audit entry. **Depends on:** GRP-07 and GRP-08 (the permission), GRP-13, SPD-01, SPD-02, SPD-05, SPD-09 and SPD-10 (top-up as an expense), OPS-12 (rates and budget), NTF-05, NTF-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: in the MVP the platform pays Pl-class SMS and includes a monthly Gr-class allowance per group sized by member count; beyond it the group may top up from a group wallet (criterion 5). CA section 7 says to charge by group size or SMS volume and never to gate core behaviour; a per-member allowance does exactly that and keeps vote and contribution reminders working. Closed: the permission is Group: set notification settings. Still open and external: aggregator rates, which fix the real value of `ntf.group_sms_allowance` (competitive-analysis section 10 blocker 4); default until then: the working value in the parameter table and no price shown, only counts.

---

### NTF-07 Write every SMS so it fits in one short message, in three languages

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** System (and the team that writes templates)
**Permission needed:** none
**Tags:** sms

**Story:** As the product team, I want every SMS template to follow strict length and character rules in Malagasy, French and English, so that each message costs one segment and reads cleanly on any phone.

**Conversation:** One character outside GSM-7 turns the whole message into UCS-2 at 70 characters per segment instead of 160 (R07 section 4). French circumflex vowels, lowercase c-cedilla and typographic apostrophes are the trap, and some Malagasy spellings use o-circumflex (R07 section 4, R-SMS4; DF section 4). No competitor has a Malagasy interface (R08 section 6.14), so every Malagasy string needs a native reviewer (DF section 2). R07 R-NT7 gives the model template: lead with amount and action, end with a reference.

**Preconditions:** A template exists in the registry. **Trigger:** A template is added, edited or sent.

**Acceptance criteria:**
1. Happy path: a template is stored per base key and language, with a body and parameter names. Every SMS body carries the sender prefix defined in XCT-12 and ends with a reference. It leads with amount and action, and gives the next step. Example shape: `Gereo: Contribution 10 000 Ar due 25/10 for Group Tanjona. Pay in app. Ref C-4821`. Wording for mg and fr is written by native speakers, not machine translation.
2. Rule: the allowed characters and the encoding of every SMS are defined by the XCT-12 character mapping (see XCT-12). A template that uses a character outside it cannot be published.
3. Rule: a rendered SMS must fit one segment as XCT-12 defines it (160 GSM-7 characters; the limit and the worst-case measurement belong to XCT-12), with every variable at its maximum length. This story owns the variable limits as parameters: `ntf.sms_group_name_max` (20), `ntf.sms_first_name_max` (12), `ntf.sms_title_max` and `ntf.sms_place_max`; group names are shown in a truncated preview in group settings, and recipient names are first names only.
4. Rule: XCT-12 owns encoding and the build-time lint (per language mg, fr and en, with segment count); this story owns the template registry, the `msg.*` keys and the content rules. A template whose language variant is missing cannot be enabled for that language; fallback order is recipient language, then group language, then Malagasy (the platform default, because it is the language of most members). A rule change is made in XCT-12 first and in this story only if the registry is affected.
5. Rule: a template that cannot meet the XCT-12 encoding in a language is not shipped in a longer encoding by accident; it needs an explicit exception that states segment count and cost, owned by a named approver.
6. Rule: each message stands alone: it says what, how much, who and a reference (R07 R-SMS2), contains no exclamation marks and no emoji in money, error or conflict messages (R07 R-MC7), and never names or shames a member in a message that others can see (R07 R-NT8). Late reminders to members are private and use the fact plus an offer (R07 R-MC8).
7. Rule: links, if any, use `ntf.sms_short_link_domain` and are counted by the XCT-12 length rule. Messages must stay usable if the link cannot be opened: they carry the needed facts in text.
8. States: the template registry shows for each template and language its length, segments and encoding; a draft that fails cannot be published.
9. Errors: if the rendered text is over length or unmappable at send time, the short fallback template (amount, deadline and reference only) is sent with the generic name "a member"; XCT-12 owns a fixed character mapping and a money reminder is never dropped. Only when the amount or the reference is missing is the SMS not sent: the error is logged with the base key and recipient, the in-app item remains (NTF-13) and an operator alert is raised.
10. Accessibility and language: push and in-app variants use the same facts but may use accents and are not limited to 160 characters; all three languages are reviewed before launch.

**Data:** Message template, Delivery attempt. **Depends on:** XCT-12 (lint), XCT-14 (keys, fallback), NTF-12, native Malagasy review.
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs a native Malagasy reviewer and the aggregator: which Malagasy words need circumflex letters, and the sender name registered for Madagascar (`ntf.sms_sender_id`). Default used until then: Malagasy SMS are written without circumflex letters (plain o), reviewed by a native speaker, and the sender is "Gereo".

---

### NTF-08 Turn a flood into one message

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** sms

**Story:** When more than five similar things happen to a person in a short time (for example many contributions paid), I want one summary instead of many messages, so I can read it once and tap through if I care.

**Conversation:** NN/g: combine notifications when more than five are due at once (R07 section 8.8; R-NT4). Group payment days create bursts for permission holders (for example 12 contributions in an hour). SMS cost grows with every item, so the same rule protects the group allowance (NTF-06).

**Preconditions:** A recipient has pending notifications of the same type and group. **Trigger:** The count within the batching window exceeds `ntf.batch_threshold`.

**Acceptance criteria:**
1. Happy path: once the count of similar pending items exceeds `ntf.batch_threshold` within `ntf.batch_window`, one summary push is sent in place of the individual pushes ("7 contributions received today"), and it opens a list filtered to those items.
2. Rule: "similar" means the same base key and the same group, to the same recipient. Critical types and money-moved receipts for the person's own transactions are never batched. Items from different groups are never mixed. `msg.con.split_failed` is deduplicated per rule per day by this batching.
3. Rule: individual items still appear in the notification centre (NTF-01), grouped under the summary and expandable; the unread badge counts the summary once.
4. Rule: SMS batching: when several SMS-eligible items for one person would fire within the window, a single SMS summarises them by count and type ("3 contributions still due. Ref ..."), within the XCT-12 length rule, without names (R07 R-NT8). A batched summary is one SMS: it counts once against the allowance and once against `ntf.sms_daily_cap`, and it uses the SMS window of the type of its first item.
5. Rule: an item that arrives after the summary was sent starts a new count; a summary is never edited after it was sent.
6. States: loading and empty states follow NTF-01; offline: batching happens on the server so cached lists show items as received.
7. Errors: if the batch cannot be built the individual notifications are sent normally, capped by the daily cap, never dropped.
8. Notifications: base key `msg.ntf.batch_summary` with variants for push, in-app and SMS, parameterised by type and count; the individual messages keep their own keys.
9. Audit: the delivery log records the summary and the item ids it covers (NTF-12).

**Data:** Notification, Delivery attempt. **Depends on:** NTF-01, NTF-05, NTF-06, NTF-07.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the window is `ntf.batch_window` (10 minutes), because a payment-day burst lasts minutes and a longer wait would delay receipts. Closed: no "always immediate" choice in the MVP; the individual items stay in the centre (criterion 3), so nothing is hidden.

---

### NTF-09 Do not wake people at night

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** sms

**Story:** As a member, I want quiet hours so that I am not buzzed or texted at night, except for security events.

**Conversation:** R07 section 8.8 R-NT5 proposes no push from 21:00 to 07:00 local and SMS at night only for security events (unvalidated). Madagascar uses a single time zone, but the person's time zone is stored anyway so the product scales. Deadlines complicate quiet hours: the rule must never make a deadline pass in silence.

**Preconditions:** A notification is to be delivered inside the person's quiet window. **Trigger:** Delivery time falls inside quiet hours.

**Acceptance criteria:**
1. Happy path: during quiet hours (default `ntf.quiet_hours_default`, editable per person in preferences, NTF-04) no push sound or vibration occurs; push items are held and delivered silently at the end of quiet hours, and appear in the notification centre at once.
2. Rule: Critical events are delivered at any hour by SMS direct as required, and only Critical events bypass quiet hours. Critical means security events and group-money safety events: codes, new device, PIN change, phone change, lock, unlock, the ACC-15 `delete_started` alarm and freeze applied (EV-SPD-12). Freeze SMS are capped by `ntf.critical_freeze_sms_per_day`; beyond the cap the freeze notice is push and in-app only.
3. Rule: Important SMS are not sent during quiet hours; they are held until the end. Quiet hours never make a deadline pass in silence: planned reminders are scheduled by criterion 4. An item created inside quiet hours whose deadline falls before quiet hours end stays Held and becomes Expired while held at its deadline; the sender sees "Not sent: quiet hours" in NTF-02 and, at creation, a warning that some people may not be notified before the deadline. That deadline warning must be shown by VOT-01 and by every story that sets a deadline. Votes, approvals and authority votes never override quiet hours, and voters cannot opt to be woken. Every outcome is logged.
4. Rule (reminder scheduling, owned by this story): a planned reminder, or a planned fallback SMS, whose send time falls inside quiet hours is sent at quiet hours end if at least `ntf.reminder_margin_minutes` (60) remain before the target time (event start or vote deadline); otherwise it is sent at the latest slot before quiet hours begin the evening before. Only unplanned events (for example a vote result at 23:00) are simply held. VOT-07 and EVT-05 both use this rule.
5. Rule: quiet hours use the person's local time; changing the time zone or the window affects only items not yet delivered.
6. States: preferences show "Quiet hours 21:00 to 07:00 (Madagascar time)" and "Held: 2 notifications until 07:00"; offline shows the cached setting and a note that changes apply when synced.
7. Errors: if the clock or time zone is wrong on the device, the server's setting governs; a failed save keeps the previous window.
8. Notifications: none beyond the held items; the held list does not itself produce a message.
9. Audit: held, delivered-late and expired-while-held decisions are logged (NTF-12).
10. Rule (money safety): a payout authorised by a passed vote (D4) is dispatched no earlier than quiet hours end, and its result notice is released at the same moment, so no payout starts before holders of Wallet: freeze can be informed. VOT-01 refuses, or snaps to the next slot inside 07:00 to 21:00, a money-vote or authority-vote deadline that falls inside quiet hours. `request_expiry` is paused while a notice is held (SPD-04).

**Data:** Notification preference, Delivery attempt. **Depends on:** NTF-04, NTF-05, NTF-12, VOT-01, SPD-04, SPD-10, XCT-03 (Madagascar time).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default window is 21:00 to 07:00 (`ntf.quiet_hours_default`), editable per person. Closed: voters on money decisions cannot opt to be woken in the MVP, because VOT and SPD already decided that quiet hours are never overridden by a vote or an approval; the creation warning in criterion 3 covers the risk.

---

### NTF-10 Stop SMS any time, and restart it on my terms

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** sms, audit

**Story:** As a person who gets SMS from Gereo, I want to stop them whenever I choose and to start them again later, so that the app respects my consent and my phone credit.

**Conversation:** SMS is used for reminders and group decisions, not marketing (R07 R-NT1). Consent for SMS in Madagascar and the rules for opt-out keywords and sender registration were not researched, so keywords, wording and record keeping depend on an aggregator check (CA section 10 blocker 4). The principle stands either way: opt-out is always available in-app, and one person's opt-out must not break group deadlines (they still get push and in-app).

**Preconditions:** The person has a verified phone number. **Trigger:** Turns SMS off or on in preferences, or replies with an opt-out keyword where two-way SMS is supported.

**Acceptance criteria:**
1. Happy path, opt-out: in NTF-04 the person turns off "SMS for important items". The screen first says what they may miss ("a vote closing, a contribution due, a payment receipt") and asks to confirm. After confirming, one last SMS confirms it (`msg.ntf.sms_optout_confirm.sms`) and no further non-Critical SMS is sent. The opt-out covers all non-Critical SMS, including money-due reminders; the app then shows an "Amount due" badge and a "Needs your action" item, and the push stays.
2. Happy path, re-opt-in: the person turns SMS back on in the app, confirms, and receives one confirmation SMS (`msg.ntf.sms_optin_confirm.sms`). Signing in with the phone and OTP is the proof of consent.
3. Rule: reply keywords (per language, set by `ntf.sms_optout_keywords`) work only where the aggregator supports two-way SMS; the app never promises a keyword that is not live. A reply opt-out is handled within the same flow and shown in the app on next open.
4. Rule: Critical SMS (the NTF-09 definition: security events and group-money safety events, including the freeze SMS and the hostile-deletion alarm) are not covered by the opt-out; the screen says so in one sentence, and the ACC-13 consent text names the freeze SMS.
5. Rule: an opt-out is per person, not per group; groups never see who opted out. A holder of Contribution plan: send reminder sees only an anonymous "not reached by SMS" count, and only in groups of 5 or more members.
6. States: the setting shows the date it was changed; an offline change is a row of the XCT-05 auto-send registry with the XCT-05 label keys and the keyed reassurance "You may still receive SMS until this is sent" (NTF-04). Money items and security alerts are never queued or silenced by a queued preference.
7. Errors: if the confirmation SMS fails, the opt-out still takes effect and the in-app state is correct; a failed opt-in leaves SMS off and says so.
8. Notifications: the two confirmation messages above; nothing else.
9. Audit: every consent change is recorded with person, old and new state, channel (app or reply), text version shown, time and device; records are kept for `AUDIT_RETENTION_YEARS` (OPS), not `ntf.log_retention`, because they are evidence of consent. Each change writes a Consent record that ACC-13 displays under "my choices"; the consent text itself is owned by ACC-13 and not restated here.
10. Rule (non-members and numbers): SMS that are services, not options, are separated from optional SMS. Service SMS are the OTP, the link and the payout receipt; for an unregistered number only these are allowed, plus one VOT-07 reminder carrying a per-number opt-out. A number-level suppression list (by phone number, not account) is fed by STOP replies and checked before every S-d SMS to a non-member; if the number matches an account, that account's choice (NTF-04, this story) applies instead. `grp.invite_sms_per_day` limits invitation SMS per member per day. For a person with an account the payout receipt is an optional SMS and follows their choice.

**Data:** Notification preference, Consent record, Suppression entry (phone number), Audit entry. **Depends on:** NTF-04, NTF-05, NTF-12, VOT-07, ACC-02 (phone and OTP), ACC-13 (terms and consent text).
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs the aggregator: whether two-way SMS and keywords are available. Default used until then: opt-out in the app only, keywords shown only where the aggregator confirms them, Critical SMS continue (criterion 4).

---

### NTF-11 Reach people who do not have the app

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor; Guest voter; Member without a smartphone
**Permission needed:** none
**Tags:** sms, offline

**Story:** When someone has only a basic phone or has never installed the app (an invitee, a guest voter, a member with no data), I want them to receive what they need by SMS alone, so I can include them without forcing an install.

**Conversation:** Cold start runs through WhatsApp links and SMS, not push (R04 section 14.6 risk 2). The guest voter, Tiana, opens a vote link on a basic phone (conventions section 3). R07 R-SMS1 makes SMS mandatory for OTP, receipts, vote deadline, contribution due and event reminder. Smart phones are rare in the target group (CA section 1 point 5), and feature phones cannot open links; whether SMS reply commands are available is unknown (R07 section 4, R-SMS3).

**Preconditions:** A recipient has a phone number but no registered push device. **Trigger:** An Important event involves that person (invite, vote, contribution, event, receipt).

**Acceptance criteria:**
1. Happy path: for such recipients Important types are sent as SMS directly (S-d), in their language, self-contained: what, how much, who, reference, and how to act. Normal and Low types are not sent, to protect cost. For a person who is not a member, only these S-d cases exist: group invite, guest link, guest receipt, event invite to a no-device invitee, campaign receipt and campaign refund. Project team additions (PRJ) never trigger this story. Each case goes through the phone-number suppression list (NTF-10) first. There is no guest result SMS: a guest sees the result on their link, and no `msg.vot` guest result key exists.
2. Rule: the SMS says how the person can act without the app: a link to a light web page (guest voting, in VOT), a reference to quote to a named contact, or an instruction to ask the group's contact, whichever is available. A message that depends only on a link is not allowed (NTF-07 criterion 7).
3. Rule: the recipient's language comes from their account if any, otherwise from the invite (GRP-03) or vote link, otherwise from the group's language.
4. Rule: three link kinds exist and are defined where their token is issued: the invite share link (GRP-03), the vote share link (VOT-06 criterion 1) and the per-person single-use SMS link, which this story defines and nothing else. The per-person single-use SMS link is one number with one token: a signed token that opens a page needing no account, works on a low-end browser, loads a small page, and expires at the vote deadline (VOT-06 defines the page, ACC-16 the entry). A verified number is remembered on the same device for that vote's lifetime; the first open always requires an OTP.
5. Rule: these SMS are charged to the group allowance (class Gr) except security codes and personal receipts (including campaign receipts and refunds), which are Pl; the group sees a count of "people reached by SMS only" in usage reports (NTF-06). The invitation SMS to a no-device invitee is direct (Gr) and its cost is added to the NTF-06 estimate shown to the host and to the OPS-12 cost view; invitees with a device keep I and P.
6. States: if a person later installs the app and signs in with the same number, their pending items appear in the centre and SMS-only handling stops for them.
7. Errors: an unreachable number is flagged (NTF-13) and the inviter or sender is told in-app; the message is never retried beyond limits.
8. Notifications: the same messages as in the catalogue marked S-d; no new keys.
9. Audit: SMS-only sends are logged with the reason "no device" (NTF-12).

**Data:** Notification, Delivery attempt, Invite, Ballot link. **Depends on:** GRP-03 (invite SMS), VOT-06 (guest voting page), ACC-16 (open a link without an account), NTF-05, NTF-06, NTF-07, NTF-10 (suppression list), NTF-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default language for an unknown number is the group's language, then Malagasy (NTF-07 criterion 4). Open, needs the aggregator and field interviews: whether people with only a feature phone can vote or confirm by replying to an SMS. Default used until then: no reply voting (vote by SMS is Later, XCT-05); the person acts through the light web page if the phone has a browser, or through the group's named contact (criterion 2), and approving by SMS reply is never allowed (SPD).

---

### NTF-12 Let operators see what was sent, and why

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** operator permission `view notification log`; `reveal message text` to see a message body (both are in the operator catalogue owned by OPS-01, which is separate from member permissions)
**Tags:** sms, audit

**Story:** As a Gereo operator, I want a searchable log of every notification attempt with its channel, status, reason and cost, so that I can answer "why didn't I get my SMS" and watch SMS spend.

**Conversation:** Support is slow on every money product and the first question is "did you send it?" (CA section 4 point 3). The research also warns of delayed or missing SMS without in-app fallback (R08 section 6.12 avoid). Message text can contain money and personal data, so operators see it only with a reason, and every view is logged (R07 section 8.5 R-PM4 on audit trails).

**Preconditions:** An operator account with the right access. **Trigger:** A support ticket, a spending review, or a routine check.

**Acceptance criteria:**
1. Happy path: each attempt shows message id, base key and language, event id and epic, recipient (masked number and user id), channel, status per the delivery vocabulary, provider status code and message, segment count and encoding, cost and payer class, and timestamps for queued, sent, delivered and opened.
2. Rule: each row also shows the decision that led to it, in words: "SMS sent: push not opened within the window", "SMS skipped: person opted out", "SMS cancelled: contribution already paid", "SMS held: quiet hours", "SMS skipped: daily cap", "SMS skipped: number on the suppression list".
3. Rule: search and filter by phone number, user, group, epic, base key, status, date range and payer; a trace view shows the whole chain for one event across channels.
4. Rule: the rendered message text is hidden by default and shown only after the operator states a reason; OTP codes are never stored in logs; every reveal and every export is itself audited with operator, reason and time.
5. Rule: the SMS volume, delivery rate, cost and spend alerts are the dashboard of OPS-12 (permission `view sms costs`); this log is the per-message record those figures sum, and the totals of the two must match for any period. Both reconcile on messages accepted by the provider, by sent time, on Madagascar calendar days, with a 48-hour tolerance for delivery reports; the NTF-13 aggregator daily comparison cut-off is 02:00 the following day.
6. States: empty results show "No matching messages"; loading skeletons; the log is available when the provider is down (it lists attempts with status Queued or Failed).
7. Errors: a log write failure must not block sending; the system buffers the log and reconciles later; a gap is flagged to operators.
8. Notifications: none to users; the alerts for operators are defined in OPS-12.
9. Audit: log access, reveals and exports are audited; the logs are kept for `ntf.log_retention`.

**Data:** Delivery attempt, Notification, Audit entry. **Depends on:** OPS-01 (console and access), OPS-06 (tickets), OPS-09 (audit search), OPS-12 (dashboard), NTF-05, NTF-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: delivery logs are kept for `ntf.log_retention` (12 months), enough for a dispute or a billing check by the aggregator; the audit entries of reveals and exports follow `AUDIT_RETENTION_YEARS`. Closed: support cannot resend or send a message in the MVP; the person triggers a fresh action (for example a new code, ACC-02), because an operator-sent SMS would be an unaudited channel.

---

### NTF-13 When the SMS cannot be delivered

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** sms

**Story:** When an SMS fails or never arrives, I want the system to retry sensibly, keep the in-app item, and tell the right people, so that nobody misses a deadline because a message was lost.

**Conversation:** Provider outages and delayed SMS happen (R08 section 6.12 avoid; CA section 6 constraint 7). A failure must never be a silent end: the in-app item always remains and the sender or group learns who was not reached, without shaming (R07 R-NT8).

**Preconditions:** An SMS attempt was made. **Trigger:** The aggregator reports a failure, or no delivery report arrives.

**Acceptance criteria:**
1. Happy path: a temporary failure triggers up to `ntf.sms_max_retries` retries with `ntf.sms_retry_backoff`; a delivery report moves the state to Delivered.
2. Rule: failures are classified as temporary (network, provider busy) or permanent (invalid or unreachable number, blocked); permanent failures stop retries at once and mark the number "Unreachable by SMS".
3. Rule: retries are deadline-aware: no retry is attempted after the event deadline has passed, and the attempt is closed with the reason "deadline passed".
4. Rule: the recipient sees an in-app banner on next open, "We could not reach you by SMS. Check your phone number." with a link to change or confirm the number (ACC-05), until a later SMS succeeds. The item stays in the centre.
5. Rule: the sender view (NTF-02) shows "Not reached" by name with no reason; holders of Contribution plan: send reminder or Vote: create see the count of unreached people (cause counts only in groups of 5 or more). The group channel never names them.
6. Rule: if the failure rate for one aggregator passes a limit, operators are alerted and a second aggregator can be used through the adapter (open question); the system never loses the queued messages.
7. States: while retrying the state reads "Retrying"; no delivery report after `ntf.sms_report_timeout` reads "No delivery report" and is not counted as delivered.
8. Errors: costs are recorded only as reported by the provider; a failed message that the provider does not bill is not counted against the group allowance.
9. Notifications: `msg.ntf.sms_unreachable.inapp` to the recipient; sender summary in-app; no SMS about an SMS failure.
10. Audit: each attempt, retry, classification and final state is logged (NTF-12).

**Data:** Delivery attempt, Notification, Notification preference. **Depends on:** NTF-05, NTF-12, ACC-05 (change phone), OPS-12 (aggregator alert).
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs the aggregator and a cost decision: whether a second SMS aggregator or a voice call is used for Critical codes. Default used until then: one aggregator behind the adapter, no voice call. Closed: silent failures are detected by the `ntf.sms_report_timeout` state and by OPS-12 comparing, each day, messages accepted by the provider (by sent time, on Madagascar calendar days, with a 48-hour tolerance for delivery reports) with the aggregator's billed counts; the comparison cut-off is 02:00 the following day.

---

### NTF-14 One calm summary a week

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** offline

**Story:** As a member, I want one weekly summary of what happened in my groups and what is waiting, so that I can stay informed without many pushes.

**Conversation:** Digest versus immediate is an adopted pattern (R08 section 6.12; Loomio). The weekly digest is a conservative default in the research proposal (R07 R-NT3). It carries Low-class items and recaps Normal ones. It is never SMS.

**Preconditions:** Digest is on and the person belongs to at least one group. **Trigger:** `ntf.digest_day` arrives.

**Acceptance criteria:**
1. Happy path: one in-app item per person and, if the person has a push device and allows push, one push, summarise per group: balance change, contributions paid and due, decisions made, events next week, and open items waiting, as short sentences with a link to each.
2. Rule: it is sent only if something happened or is waiting; a quiet week sends nothing.
3. Rule: it respects quiet hours, language and group mutes; it never contains names of late payers.
4. Rule: it is never sent by SMS and never counts against SMS allowance.
5. States: loading and empty states as in NTF-01; offline shows the cached digest.
6. Errors: if a figure cannot be loaded the sentence is dropped rather than shown wrong.
7. Notifications: base key `msg.ntf.weekly_digest` with push and in-app variants.
8. Audit: sent digests are logged (NTF-12).
9. Accessibility and language: plain sentences, not tables, in three languages; amounts in the "12 500 Ar" format.

**Data:** Notification, Notification preference. **Depends on:** NTF-01, NTF-04, GRP-06, CON-03 and CON-16 (contributions and ledger), VOT-13 (decisions), EVT-08 (upcoming events).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: Sunday 18:00 (`ntf.digest_day`), outside quiet hours and before the week starts. Closed: a person with no push device gets the in-app digest only (criterion 1).

---

## Event catalogue

Every MVP epic is covered. The IDs are stable references; epics may add events later through this table. Deep links are route templates; the information architecture reconciles them later, and a story never points at a screen number. `{g}` group, `{w}` wallet, `{t}` transaction, `{a}` approval, `{v}` vote, `{e}` event, `{p}` project, `{c}` contribution, `{r}` rule. Every event also writes an in-app item for people with an account unless the Channel cell says "None". The "Emitted by" column names the one story that emits the key; other stories cite only the EV- ID and the key.

Where the audience is "people with an account", people without one receive only the S-d variants marked in the Channel column, and each S-d SMS to a non-member goes through the phone-number suppression list first (NTF-10).

Money-out SMS rule, used by EV-WAL-05, EV-WAL-06, EV-WAL-08, EV-WAL-12 and EV-SPD-16: one SMS per withdrawal or transfer outcome (completed, failed, or queued or delayed). The initiation event is I and P only. The SMS is S-d when the amount is at or above `ntf.money_out_sms_min_amount` or the payee is new, otherwise S-fb.

### ACC

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-ACC-01 | Sign-in or action code requested | Person asks for a code (sign-up, sign-in, PIN reset, sensitive action) | The requester | S-d, no in-app | Critical | Pl | `msg.acc.otp` | ACC-02 | None (code autofill format) |
| EV-ACC-02 | New device signed in | Successful sign-in from an unknown device | Account owner, on existing devices and by SMS | I, P on other devices, S-d | Critical | Pl | `msg.acc.new_device` | ACC-05 | `/account/devices` |
| EV-ACC-03 | PIN changed or reset | PIN set or reset | Account owner | I, P, S-d | Critical | Pl | `msg.acc.pin_changed` | ACC-03 | `/account/security` |
| EV-ACC-04 | Phone number changed | Number updated | Old and new number | S-d to both, I | Critical | Pl | `msg.acc.phone_changed` | ACC-06 | `/account/security` |
| EV-ACC-06 | Identity check submitted | Documents sent | Applicant | I | Low | None | `msg.acc.kyc_submitted` | ACC-08 | `/account/identity` |
| EV-ACC-07 | Identity check approved | Operator or system approves a tier | Applicant | I, P, S-fb | Important | Pl | `msg.acc.kyc_approved` | ACC-09 | `/account/identity` |
| EV-ACC-08 | Identity check needs action | Rejected, or more information needed | Applicant | I, P, S-fb | Important | Pl | `msg.acc.kyc_action_needed` | ACC-09 | `/account/identity` |
| EV-ACC-09 | Tier limit reached | A money action hit a limit | The person, in context | I | Normal | None | `msg.acc.limit_reached` | ACC-07 | `/account/identity` |
| EV-ACC-10 | Account restricted | Operator restriction for compliance | Account owner | I, P, S-fb | Important | Pl | `msg.acc.restricted` | OPS-10 | `/support` |
| EV-ACC-11 | Account locked | Account lock applied (ACC-11); sent to remaining devices before they are cut off | Account owner, on remaining devices and by SMS | I, P, S-d | Critical | Pl | `msg.acc.locked` | ACC-11 | `/account/security` |
| EV-ACC-12 | Account unlocked | Account lock lifted | Account owner | I, P, S-d | Critical | Pl | `msg.acc.unlocked` | ACC-11 | `/account/security` |
| EV-ACC-13 | Account deletion started | Deletion confirmed and grace begins; the text includes the cancel instructions and the date (hostile-deletion alarm) | Account owner | I, P, S-d | Critical | Pl | `msg.acc.delete_started` | ACC-15 | `/account/delete` |
| EV-ACC-14 | Account deleted | Deletion completed | The former account holder | S-d | Important | Pl | `msg.acc.delete_done` | ACC-15 | None |
| EV-ACC-15 | Account data export ready | Export file generated | The requester | I, P | Normal | None | `msg.acc.export_ready` | ACC-14 | `/account/export` |
| EV-ACC-16 | Assisted sign-up done | A facilitator finished an assisted sign-up for another person; the text carries the first name only | The facilitator | I, P | Normal | None | `msg.acc.assist_done` | ACC-10 | `/account/assist` |
| EV-ACC-17 | Invite link sent to a number without an account | The link is re-sent or asked for again; the first send is EV-GRP-02 | The person with the number | S-d | Important | Gr | `msg.acc.invite_link` | ACC-16 | `/join/{token}` |
| EV-ACC-18 | Vote link sent to a number without an account | The link is re-sent or asked for again; the first send is EV-VOT-07 | The guest voter | S-d | Important | Gr | `msg.acc.vote_link` | ACC-16 | `/v/{token}` |

EV-ACC-05 (account recovery started) is retired and its ID is not reused.

### WAL

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-WAL-01 | Deposit pending | Payment started, awaiting provider | The depositor | I | Normal | None | `msg.wal.deposit_pending` | WAL-06 | `/wallets/{w}/tx/{t}` |
| EV-WAL-02 | Deposit confirmed | Provider confirms; this is the money-posted-to-a-wallet event that RUL-07 consumes | The depositor | I, P, S-fb | Important | Pl | `msg.wal.deposit_confirmed` | WAL-07 | `/wallets/{w}/tx/{t}` |
| EV-WAL-03 | Deposit failed | Provider reports failure; says no money moved | The depositor | I, P, S-fb | Important | Pl | `msg.wal.deposit_failed` | WAL-07 | `/wallets/{w}/tx/{t}` |
| EV-WAL-04 | Withdrawal pending | Request sent to provider (initiation) | The requester | I, P | Normal | None | `msg.wal.withdrawal_pending` | WAL-10 | `/wallets/{w}/tx/{t}` |
| EV-WAL-05 | Withdrawal confirmed | Provider confirms; a withdrawal outcome row, one SMS per outcome | The requester | I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb | Important | Pl | `msg.wal.withdrawal_confirmed` | WAL-11 | `/wallets/{w}/tx/{t}` |
| EV-WAL-06 | Withdrawal failed | Provider reports failure; a withdrawal outcome row, one SMS per outcome | The requester | I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb | Important | Pl | `msg.wal.withdrawal_failed` | WAL-11 | `/wallets/{w}/tx/{t}` |
| EV-WAL-07 | Transaction needs attention | Pending past expected time, or mismatch | The owner | I, P, S-fb | Important | Pl | `msg.wal.needs_attention` | WAL-20 | `/wallets/{w}/tx/{t}` |
| EV-WAL-08 | Payout delayed (provider unavailable, payout queued) | Provider down, payout held; the single payout-delayed event, used by SPD-11 and matching WAL-08 criterion 7 | The requester | I, P, S-fb (S-d by the money-out SMS rule) | Important | Pl | `msg.wal.provider_queued` | WAL-08 | `/wallets/{w}/tx/{t}` |
| EV-WAL-09 | Transfer between own wallets done | Transfer confirmed | The owner | I | Low | None | `msg.wal.transfer_done` | WAL-12 | `/wallets/{w}/tx/{t}` |
| EV-WAL-10 | Money received from a person | Transfer into wallet from another person | The receiver | I, P | Normal | None | `msg.wal.transfer_received` | WAL-13 | `/wallets/{w}/tx/{t}` |
| EV-WAL-11 | Export ready | Export file generated | The requester | I | Low | None | `msg.wal.export_ready` | WAL-16 | `/wallets/{w}/export` |
| EV-WAL-12 | Transfer sent to another person | Transfer outcome, because money left the sender's ownership; one SMS per outcome; suppressed for campaign-tagged transfers, which use EV-ANN-11 | The sender | I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb | Important | Pl | `msg.wal.transfer_sent` | WAL-13 | `/wallets/{w}/tx/{t}` |
| EV-WAL-13 | Balance corrected | Operator correction posted as a reversing entry (OPS-05) | The wallet owner | I, P, S-fb | Important | Pl | `msg.wal.balance_corrected` | WAL-18 | `/wallets/{w}/tx/{t}` |
| EV-WAL-14 | Group wallet closed | A group wallet is closed at zero balance (WAL-05); closing a personal wallet sends nothing | Holders of Wallet: view balance | I, P | Normal | None | `msg.wal.group_wallet_closed` | WAL-05 | `/wallets/{w}` |

### RUL

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-RUL-01 | Rule fired | A rule created a ledger entry; a whole chain of rules fired by one arrival is one item that names each rule (decision D3) | Wallet owner; holders of Wallet: view history for group wallets | I (batched, NTF-08) | Low | None | `msg.rul.fired` | RUL-07 | `/wallets/{w}/history` |
| EV-RUL-02 | Spending cap reached | Cap hit (personal wallet cap, warn only) | Wallet owner; holders of Wallet: edit rules for group wallets | I, P | Normal | None | `msg.rul.cap_reached` | RUL-09 | `/wallets/{w}/rules/{r}` |
| EV-RUL-03 | Low balance alert | Balance under alert level | Wallet owner; holders of Wallet: edit rules for group wallets | I, P | Normal | None | `msg.rul.low_balance` | RUL-11 | `/wallets/{w}` |
| EV-RUL-04 | Goal reached | Target amount met | Wallet owner; group members | I, P | Normal | None | `msg.rul.goal_reached` | RUL-10 | `/wallets/{w}/rules/{r}` |
| EV-RUL-05 | Goal behind schedule | Weekly check finds it behind | Wallet owner; holders of Wallet: edit rules for group wallets | I, digest | Low | None | `msg.rul.goal_behind` | RUL-10 | `/wallets/{w}/rules/{r}` |
| EV-RUL-06 | Rule skipped (personal wallet) | Insufficient funds, loop prevented, or chain deeper than the maximum chain depth (decision D3), on a personal wallet. A skip on a group wallet is reported only by EV-CON-14 (`msg.con.split_failed`), never by this row | Wallet owner | I, P | Normal | None | `msg.rul.skipped` | RUL-12 | `/wallets/{w}/rules/{r}` |
| EV-RUL-07 | Group wallet cap, goal or low-balance setting changed | Cap, goal or low-balance alert edited; a share-rule change uses EV-CON-13 (`msg.con.split_changed`) instead | Holders of Wallet: view balance | I, P | Normal | None | `msg.rul.group_changed` | RUL-13 | `/wallets/{w}/rules/{r}` |
| EV-RUL-08 | Spending cap at 80 percent | The cap warning level is passed; if EV-SPD-15 would follow for the same request within the batch window, EV-SPD-15 is suppressed | Wallet owner; holders of Wallet: edit rules for group wallets | I, P | Normal | None | `msg.rul.cap_warning` | RUL-09 | `/wallets/{w}/rules/{r}` |

### GRP

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-GRP-01 | Group created | Founder creates | Founder | I | Low | None | `msg.grp.group_created` | GRP-01 | `/groups/{g}` |
| EV-GRP-02 | Invitation received (phone) | Invite sent by number; for a number without an account the phone-number suppression check runs first, and the per-member limit `grp.invite_sms_per_day` applies | Invitee | S-d (I if account) | Important | Gr | `msg.grp.invite_received` | GRP-03 | `/join/{token}` |
| EV-GRP-03 | Invitation accepted | Invitee joins | Inviter | I, P | Normal | None | `msg.grp.invite_accepted` | GRP-04 | `/groups/{g}/members` |
| EV-GRP-04 | Invitation declined | Invitee declines | Inviter | I, P | Normal | None | `msg.grp.invite_declined` | GRP-04 | `/groups/{g}/members` |
| EV-GRP-05 | Member joined | Join completes | Holders of Group: view group | I (batched) | Low | None | `msg.grp.member_joined` | GRP-05 | `/groups/{g}/members` |
| EV-GRP-06 | Member left | Member leaves | Holders of Group: remove member and Wallet: approve spend | I, P | Normal | None | `msg.grp.member_left` | GRP-16 | `/groups/{g}/members` |
| EV-GRP-07 | Member removed | Removal completes | The removed person | I, P, S-fb | Important | Gr | `msg.grp.member_removed` | GRP-17 | `/groups/{g}` |
| EV-GRP-08 | Permission granted | Grant | The person | I, P (S-fb if money-out) | Normal (Important if money-out) | Gr | `msg.grp.permission_granted` | GRP-08 | `/groups/{g}/access/me` |
| EV-GRP-09 | Permission revoked | Revoke | The person | I, P (S-fb if money-out) | Normal (Important if money-out) | Gr | `msg.grp.permission_revoked` | GRP-08 | `/groups/{g}/access/me` |
| EV-GRP-10 | Spending rule changed | Thresholds saved | Holders of Wallet: approve spend | I, P | Normal | None | `msg.grp.threshold_changed` | GRP-12 | `/groups/{g}/spending-rules` |
| EV-GRP-11 | Rule loosening needs approval | Loosening proposed | Required approvers | I, P, S-fb | Important | Gr | `msg.grp.threshold_loosen_requested` | GRP-12 | `/groups/{g}/spending-rules` |
| EV-GRP-12 | Group needs a second approver | Fewer than two reachable holders of Wallet: approve spend while a group wallet holds money (decision D1). The spending-policy screen and this event show anonymous counts of approvers and of people able to be reached, with a warning when fewer than 2 people other than the requester can be reached; counts are hidden for groups under 5 members except the warning | Holders of Group: grant permission | I, P, S-fb | Important | Gr | `msg.grp.approver_shortage` | GRP-14 | `/groups/{g}/access` |
| EV-GRP-13 | Wallet created | Group wallet added | Members | I (batched) | Low | None | `msg.grp.wallet_created` | GRP-15 | `/groups/{g}/wallets/{w}` |
| EV-GRP-14 | Group rules text changed | "How our group works" edited | Members | I, P | Normal | None | `msg.grp.group_edited` | GRP-18 | `/groups/{g}/about` |
| EV-GRP-15 | Archive needs confirmation | Archive requested | The second holder of Group: delete group | I, P, S-fb | Important | Gr | `msg.grp.archive_requested` | GRP-19 | `/groups/{g}/archive` |
| EV-GRP-16 | Group archived | Archive confirmed | Members | I, P | Normal | None | `msg.grp.archived` | GRP-19 | `/groups/{g}` |
| EV-GRP-17 | Deletion scheduled | Delete confirmed, grace starts | Members | I, P | Normal | None | `msg.grp.delete_scheduled` | GRP-20 | `/groups/{g}` |
| EV-GRP-18 | Leave confirmed | Member left | The leaver | I | Low | None | `msg.grp.leave_confirmed` | GRP-16 | `/groups` |
| EV-GRP-19 | Group deleted | Grace period ended and the group is deleted | Members | I, P | Normal | None | `msg.grp.deleted` | GRP-20 | `/groups` |

### CON

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-CON-01 | Plan or plan parameter change | Plan saved, or a parameter change: created, changed, paused, ended | Members | I, P | Normal | None | `msg.con.plan_changed` | CON-01 | `/groups/{g}/contributions` |
| EV-CON-02 | Contribution due soon | Scheduled before the due date (days set in the plan) | Members who owe | I, P, S-fb | Important | Gr | `msg.con.due_soon` | CON-08 | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-03 | Contribution due today | Due date | Members who owe | I, P, S-fb | Important | Gr | `msg.con.due_today` | CON-08 | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-04 | Contribution overdue | Past due, private | The member who owes | I, P, S-fb | Important | Gr | `msg.con.overdue` | CON-08 | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-05 | Reminder sent by a treasurer | Manual reminder, includes the sender's first name | Selected late members | I, P, S-fb | Important | Gr | `msg.con.reminder_manual` | CON-07 | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-06 | Payment received | Contribution confirmed | The payer | I, P, S-fb | Important | Pl | `msg.con.payment_received` | CON-05 | `/wallets/{w}/tx/{t}` |
| EV-CON-07 | Payment failed | Contribution failed; says no money moved | The payer | I, P, S-fb | Important | Pl | `msg.con.payment_failed` | CON-05 | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-08 | Member paid | Contribution confirmed | Holders of Contribution plan: view (counts only) | I (batched) | Low | None | `msg.con.member_paid` | CON-05 | `/groups/{g}/contributions` |
| EV-CON-09 | Late contributions summary | Daily after due date | Holders of Contribution plan: send reminder | I, P | Normal | None | `msg.con.late_summary` | CON-08 | `/groups/{g}/contributions` |
| EV-CON-10 | Exemption granted or lifted | A holder of Contribution plan: exempt member applies or lifts an exemption | The exempted member | I, P | Normal | None | `msg.con.exempted` | CON-10 | `/groups/{g}/contributions/{c}` |
| EV-CON-11 | Penalty applied | Late penalty written | The member | I, P, S-fb | Important | Gr | `msg.con.penalty_applied` | CON-09 | `/groups/{g}/contributions/{c}` |
| EV-CON-12 | Income split executed | Income arrived and rule applied; the item states the rounding amount credited to Gereo when it is above zero (decision D5). In-app only | Holders of Wallet: view history | I | Low | None | `msg.con.split_executed` | CON-14 | `/groups/{g}/ledger` |
| EV-CON-13 | Split rule changed | Share rule edited | Members | I, P | Normal | None | `msg.con.split_changed` | CON-13 | `/groups/{g}/split-rules` |
| EV-CON-14 | Split failed | A split run could not complete (CON-15); says what moved and what did not; deduplicated per rule per day by NTF-08 batching | Holders of Wallet: edit rules | I, P, S-fb | Important | Gr | `msg.con.split_failed` | CON-15 | `/groups/{g}/split-rules` |

### SPD

Project expenses use the same events with the project name added to the text. Under decisions D1 and D4, approvals (EV-SPD-01 to EV-SPD-06) exist only for spending below the vote threshold; above it the vote events (EV-VOT-01 to EV-VOT-05, EV-VOT-11 and EV-VOT-12) authorise the payout and EV-SPD-08, EV-SPD-16 and EV-SPD-09 follow. The payout-delayed notice of SPD-11 is EV-WAL-08. Approval notices follow quiet hours, and a payout authorised by a passed vote is dispatched no earlier than quiet hours end (NTF-09). There are no cap warning or cap reached rows for SPD: those are EV-RUL-02 and EV-RUL-08.

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-SPD-01 | Approval needed | Expense requested below the vote threshold | Holders of Wallet: approve spend, excluding the requester (decision D1) | I, P, S-fb | Important | Gr | `msg.spd.approval_needed` | SPD-04 | `/groups/{g}/approvals/{a}` |
| EV-SPD-02 | Approval reminder | Not acted on after one day, once | Approvers who have not acted | I, P, S-fb | Important | Gr | `msg.spd.approval_reminder` | SPD-04 | `/groups/{g}/approvals/{a}` |
| EV-SPD-03 | Approval progress | An approver approves | The requester | I, P | Normal | None | `msg.spd.approval_progress` | SPD-05 | `/groups/{g}/approvals/{a}` |
| EV-SPD-04 | Request approved | Required approvals reached, below the vote threshold | Requester and approvers | I, P | Normal | None | `msg.spd.approved` | SPD-05 | `/groups/{g}/approvals/{a}` |
| EV-SPD-05 | Request rejected | Approver rejects, with reason | The requester | I, P | Normal | None | `msg.spd.rejected` | SPD-06 | `/groups/{g}/approvals/{a}` |
| EV-SPD-06 | Approvals voided | Request or permission changed | Requester and earlier approvers | I, P, S-fb | Important | Gr | `msg.spd.approvals_voided` | SPD-07 | `/groups/{g}/approvals/{a}` |
| EV-SPD-07 | Vote required | Amount above the vote threshold; the vote replaces approvers (decision D4) | Requester and holders of Vote: create | I, P | Normal | None | `msg.spd.vote_required` | SPD-09 | `/groups/{g}/approvals/{a}` |
| EV-SPD-08 | Payout sent | Payout dispatched | Requester, and the approvers or voters who authorised it | I, P | Normal | None | `msg.spd.payout_sent` | SPD-10 | `/wallets/{w}/tx/{t}` |
| EV-SPD-09 | Payout failed or needs attention | Provider failure; says whether money moved | Requester, and the approvers or voters who authorised it | I, P, S-fb | Important | Gr | `msg.spd.payout_failed` | SPD-11 | `/wallets/{w}/tx/{t}` |
| EV-SPD-10 | Insufficient funds | Request exceeds balance | The requester | I | Normal | None | `msg.spd.insufficient_funds` | SPD-01 | `/groups/{g}/approvals/{a}` |
| EV-SPD-11 | Request expired | Deadline passed with no decision; `request_expiry` is paused while a notice is held | The requester | I, P | Normal | None | `msg.spd.expired` | SPD-12 | `/groups/{g}/approvals/{a}` |
| EV-SPD-12 | Freeze applied, for the holders who can lift it | Emergency freeze of a group wallet (SPD-15); at most `ntf.critical_freeze_sms_per_day` freeze SMS per wallet per day, beyond that push and in-app only | Holders of Wallet: freeze or Wallet: approve spend, excluding the person who froze | I, P, S-d | Critical | Pl | `msg.spd.freeze_applied` | SPD-15 | `/wallets/{w}` |
| EV-SPD-13 | Freeze applied, for other members | Emergency freeze of a group wallet | Holders of Wallet: view balance, other than those in EV-SPD-12 | I, P | Normal | None | `msg.spd.freeze_applied_members` | SPD-15 | `/wallets/{w}` |
| EV-SPD-14 | Freeze lifted | Two distinct holders of Wallet: approve spend lift the freeze | Holders of Wallet: view balance | I, P | Normal | None | `msg.spd.freeze_lifted` | SPD-15 | `/wallets/{w}` |
| EV-SPD-15 | Spending cap blocked a request | A request would pass the cap (SPD-14); suppressed when `msg.rul.cap_reached` was raised for the same request within the batch window | The requester; holders of Wallet: edit rules | I | Normal | None | `msg.spd.cap_blocked` | SPD-14 | `/groups/{g}/approvals/{a}` |
| EV-SPD-16 | Payout confirmed | Provider confirms the payout; the money-out SMS rule applies to the requester | Requester, and the approvers or voters who authorised it | I, P, S-d at or above `ntf.money_out_sms_min_amount` or for a new payee, else S-fb (requester only) | Important | Pl | `msg.spd.payout_confirmed` | SPD-10 | `/wallets/{w}/tx/{t}` |
| EV-SPD-17 | Changes requested | An approver asks for changes, with a reason | The requester | I, P | Normal | None | `msg.spd.needs_changes` | SPD-06 | `/groups/{g}/approvals/{a}` |
| EV-SPD-18 | Receipt added | A file is added to a request that is Awaiting approval; approvals stay | Approvers who already approved | I | Low | None | `msg.spd.approval_attachment_added` | SPD-03 | `/groups/{g}/approvals/{a}` |
| EV-SPD-19 | Approval nudge | The requester nudges approvers who have not acted, at most once per approver per `approval_reminder_after` | Approvers who have not acted | I, P | Normal | None | `msg.spd.approval_nudge` | SPD-08 | `/groups/{g}/approvals/{a}` |
| EV-SPD-20 | Request cancelled | The requester or a holder of Wallet: approve spend cancels the request | The approvers who were waiting, and the requester | I, P | Normal | None | `msg.spd.cancelled` | SPD-12 | `/groups/{g}/approvals/{a}` |

### VOT

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-VOT-01 | Vote opened | Vote created; a money-vote or authority-vote deadline inside quiet hours is refused or snapped by VOT-01 (NTF-09) | Eligible voters | I, P, S-fb | Important | Gr | `msg.vot.opened` | VOT-01 | `/groups/{g}/votes/{v}` |
| EV-VOT-02 | Vote closes soon (first notice) | Scheduled before close, with the NTF-09 reminder rule | Eligible voters who have not voted | I, P, S-fb | Important | Gr | `msg.vot.closing_soon` | VOT-07 | `/groups/{g}/votes/{v}` |
| EV-VOT-03 | Vote closes very soon (money decisions) | Scheduled shortly before close, with the NTF-09 reminder rule | Voters who have not voted | I, P, S-fb | Important | Gr | `msg.vot.closing_now` | VOT-07 | `/groups/{g}/votes/{v}` |
| EV-VOT-04 | Vote result | Vote closes with quorum; for a passed money vote the text says the payment starts (decision D4), and the notice is released at the same moment as the payout, no earlier than quiet hours end | Voters and group | I, P | Normal | None | `msg.vot.result` | VOT-08 | `/groups/{g}/votes/{v}` |
| EV-VOT-05 | Quorum not met | Vote closes without quorum, including a money vote with fewer than two distinct voters other than the requester (decision D4) | Eligible voters | I, P, S-fb | Important | Gr | `msg.vot.no_quorum` | VOT-08 | `/groups/{g}/votes/{v}` |
| EV-VOT-06 | Vote extended | Extension action logged | Eligible voters | I, P | Normal | None | `msg.vot.extended` | VOT-10 | `/groups/{g}/votes/{v}` |
| EV-VOT-07 | Guest vote link | Guest voter invited | Guest voter | S-d | Important | Gr | `msg.vot.guest_link` | VOT-06 | `/v/{token}` |
| EV-VOT-08 | Guest vote received | Guest ballot counted; the guest sees the result on the link, with no result SMS | Guest voter | S-d | Important | Gr | `msg.vot.guest_receipt` | VOT-06 | None |
| EV-VOT-09 | Queued answer arrived too late | Offline vote reached server after close | The voter | I, P, S-fb | Important | Gr | `msg.vot.too_late` | VOT-18 | `/groups/{g}/votes/{v}` |
| EV-VOT-10 | Decision logged | Result written to decision log | Members | I | Low | None | `msg.vot.decision_logged` | VOT-13 | `/groups/{g}/decisions` |
| EV-VOT-11 | Expense vote passed | A money vote closes Passed and the payment starts without approvers (decision D4) | The requester | I, P | Normal | None | `msg.vot.expense_passed` | VOT-03 | `/groups/{g}/approvals/{a}` |
| EV-VOT-12 | Expense vote not passed | A money vote closes Not passed for either reason; the request is Rejected | The requester | I, P | Normal | None | `msg.vot.expense_failed` | VOT-03 | `/groups/{g}/approvals/{a}` |
| EV-VOT-13 | Vote cancelled | Vote cancelled by an action or because the request changed, with the reason | Eligible voters | I, P | Normal | None | `msg.vot.cancelled` | VOT-12 | `/groups/{g}/votes/{v}` |
| EV-VOT-14 | Vote updated | A creator edit before the first ballot, only for voters already told | Eligible voters already told | I, P | Normal | None | `msg.vot.updated` | VOT-12 | `/groups/{g}/votes/{v}` |
| EV-VOT-15 | Decision review due | The review date of a decision arrives | The decision owner and the group | I, P | Normal | None | `msg.vot.review_due` | VOT-09 | `/groups/{g}/decisions` |
| EV-VOT-16 | Vote closed in a tie | Vote closes with a tie | Eligible voters | I, P | Normal | None | `msg.vot.closed_tie` | VOT-08 | `/groups/{g}/votes/{v}` |
| EV-VOT-17 | Decision assigned | A decision entry names a responsible person | The named responsible person | I, P | Normal | None | `msg.vot.decision_assigned` | VOT-14 | `/groups/{g}/decisions` |
| EV-VOT-18 | Decision amended | A decision entry is amended; summary only | Voters and the responsible person | I, P | Normal | None | `msg.vot.amended` | VOT-15 | `/groups/{g}/decisions` |

### PRJ

Project events stay I and P with payer None. Project team additions never trigger NTF-11.

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-PRJ-01 | Project created | Project saved | Holders of Project: view | I | Low | None | `msg.prj.created` | PRJ-01 | `/projects/{p}` |
| EV-PRJ-02 | Task assigned | Task owner set | The assignee | I, P | Normal | None | `msg.prj.task_assigned` | PRJ-04 | `/projects/{p}/tasks` |
| EV-PRJ-03 | Task due soon | Scheduled before the due date; the overdue variant is EV-PRJ-11 | The assignee | I, P | Normal | None | `msg.prj.task_due` | PRJ-04 | `/projects/{p}/tasks` |
| EV-PRJ-04 | Milestone completed | Milestone marked done | Project members | I | Low | None | `msg.prj.milestone_done` | PRJ-04 | `/projects/{p}` |
| EV-PRJ-05 | Budget line near its limit | Spent reaches the alert level | Holders of Project: manage budget | I, P | Normal | None | `msg.prj.budget_near` | PRJ-03 | `/projects/{p}/budget` |
| EV-PRJ-06 | Decision added manually | Decision entry saved | Project members | I | Low | None | `msg.prj.decision_added` | VOT-14 | `/projects/{p}/decisions` |
| EV-PRJ-07 | Project closed | Close action | Project members | I, P | Normal | None | `msg.prj.closed` | PRJ-09 | `/projects/{p}` |
| EV-PRJ-08 | Added to a project team | A person is added to the team | The person added; the owner if not the creator | I, P | Normal | None | `msg.prj.team_added` | PRJ-01 | `/projects/{p}` |
| EV-PRJ-09 | Project owner changed | Owner changed | The old and the new owner | I, P | Normal | None | `msg.prj.owner_changed` | PRJ-02 | `/projects/{p}` |
| EV-PRJ-10 | Project access changed | A member's access to the project changes | The affected member | I, P | Normal | None | `msg.prj.access_changed` | PRJ-06 | `/projects/{p}` |
| EV-PRJ-11 | Task overdue | The due date passed and the task is not done; the overdue audience variant of EV-PRJ-02 and EV-PRJ-03 | The assignee and holders of Project: manage tasks | I, P | Normal | None | `msg.prj.task_overdue` | PRJ-04 | `/projects/{p}/tasks` |

### EVT

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-EVT-01 | Event invitation | Event created. Invitees with a device receive I and P (payer None). Invitees with no registered device also receive a direct SMS variant (S-d, payer Gr), once per event per number, after the phone-number suppression check | Invitees | I, P; S-d variant for no-device invitees | Normal | None (Gr for the S-d variant) | `msg.evt.invited` | EVT-03 | `/groups/{g}/events/{e}` |
| EV-EVT-02 | Reminder one day before | Scheduled with the NTF-09 reminder rule | Invitees who have not declined | I, P, S-fb | Important | Gr | `msg.evt.reminder_24h` | EVT-05 | `/groups/{g}/events/{e}` |
| EV-EVT-03 | Reminder two hours before | Scheduled with the NTF-09 reminder rule | Confirmed attendees and members without the app | I, P, S-fb | Important | Gr | `msg.evt.reminder_2h` | EVT-05 | `/groups/{g}/events/{e}` |
| EV-EVT-04 | RSVP deadline near | Scheduled | Invitees who have not answered | I, P | Normal | None | `msg.evt.rsvp_deadline` | EVT-04 | `/groups/{g}/events/{e}` |
| EV-EVT-05 | Event changed | Date, time, place or host edited | Invitees not declined; the audience is checked as in EVT-05 criterion 2 | I, P, S-fb | Important | Gr | `msg.evt.changed` | EVT-06 | `/groups/{g}/events/{e}` |
| EV-EVT-06 | Event cancelled | Cancelled | Invitees not declined | I, P, S-fb | Important | Gr | `msg.evt.cancelled` | EVT-07 | `/groups/{g}/events/{e}` |
| EV-EVT-07 | RSVP saved | Answer recorded | The responder | I | Low | None | `msg.evt.rsvp_saved` | EVT-04 | `/groups/{g}/events/{e}` |
| EV-EVT-08 | Event payment due (Later) | Event with a contribution, person going and unpaid. Not in the MVP | The person | I, P, S-fb | Important | Gr | `msg.evt.payment_due` | EVT-11 | `/groups/{g}/events/{e}/pay` |
| EV-EVT-09 | Removed from an event | An invitee who had answered Going or Maybe is removed | The removed invitee | I, P | Normal | None | `msg.evt.uninvited` | EVT-03 | `/groups/{g}/events` |
| EV-EVT-10 | Event host left | The host left or was removed from the group; the creator becomes the fallback host | The event creator | I, P | Normal | None | `msg.evt.host_left` | EVT-01 | `/groups/{g}/events/{e}` |
| EV-EVT-11 | RSVP summary | The RSVP deadline passed | Holders of Event: edit | I, P | Normal | None | `msg.evt.rsvp_summary` | EVT-04 | `/groups/{g}/events/{e}` |
| EV-EVT-12 | Early reminder | The one-week and three-day reminders; push and in-app only | Invitees who have not declined | I, P | Normal | None | `msg.evt.reminder_early` | EVT-05 | `/groups/{g}/events/{e}` |

### ANN

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-ANN-01 | Announcement published | A holder of Publication: announce to group publishes | Members | I, P | Normal | None | `msg.ann.published` | ANN-01 | `/groups/{g}/announcements/{a}` |
| EV-ANN-02 | Urgent announcement | Publisher marks it Urgent (limited per month by `ANN_URGENT_MAX_PER_MONTH` and bounded by `ANN_URGENT_SMS_SHARE_PERCENT`) | Members | I, P, S-fb | Important | Gr | `msg.ann.urgent` | ANN-01 | `/groups/{g}/announcements/{a}` |
| EV-ANN-03 | Special contribution campaign launched | Campaign opened | Members | I, P | Normal | None | `msg.ann.campaign_launched` | ANN-04 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-04 | Campaign contribution received | Contribution confirmed | Campaign organisers | I (batched) | Low | None | `msg.ann.campaign_contribution` | ANN-05 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-05 | Campaign closing soon | Scheduled before deadline | Members who have not contributed | I, P | Normal | None | `msg.ann.campaign_closing` | ANN-07 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-06 | Campaign goal reached | Goal met | Members | I, P | Normal | None | `msg.ann.campaign_goal_reached` | ANN-07 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-07 | Use-of-funds report published | Report saved | Contributors | I, P | Normal | None | `msg.ann.report_published` | ANN-08 | `/groups/{g}/campaigns/{a}/report` |
| EV-ANN-08 | Announcement removed | A holder of Publication: moderate removes | The author | I, P | Normal | None | `msg.ann.removed` | ANN-03 | `/groups/{g}/announcements/{a}` |
| EV-ANN-09 | Announcement edited | The editor chooses to tell the group | Members | I, P | Normal | None | `msg.ann.edited` | ANN-03 | `/groups/{g}/announcements/{a}` |
| EV-ANN-10 | Campaign closed | Campaign ends, with the result in plain words | Members | I, P | Normal | None | `msg.ann.campaign_closed` | ANN-07 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-11 | Campaign contribution receipt | Contribution confirmed; replaces `msg.wal.transfer_sent` for campaign-tagged transfers. Receipt SMS to a non-member go through the phone-number suppression list | The contributor | I, P, S-fb (S-d for a non-member) | Important | Pl | `msg.ann.campaign_receipt` | ANN-06 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-12 | Campaign contribution refund | A refund is paid; linked to the original contribution by reference. Refund SMS to a non-member go through the phone-number suppression list | The contributor | I, P, S-fb (S-d for a non-member) | Important | Pl | `msg.ann.campaign_refund` | ANN-06 | `/groups/{g}/campaigns/{a}` |
| EV-ANN-13 | Use-of-funds report due | Scheduled before the report date, and again after it when Overdue | The person responsible for the report | I, P | Normal | None | `msg.ann.report_due` | ANN-08 | `/groups/{g}/campaigns/{a}/report` |

### NTF, OPS and cross-cutting

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Emitted by | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-NTF-01 | Push enabled test | First push on a device | The person | P | Normal | None | `msg.ntf.push_enabled` | NTF-03 | `/settings/notifications` |
| EV-NTF-02 | SMS turned off confirmation | Opt-out | The person | S-d | Critical | Pl | `msg.ntf.sms_optout_confirm` | NTF-10 | None |
| EV-NTF-03 | SMS turned on confirmation | Re-opt-in | The person | S-d | Critical | Pl | `msg.ntf.sms_optin_confirm` | NTF-10 | None |
| EV-NTF-04 | SMS could not reach you | Permanent SMS failure | The person | I | Normal | None | `msg.ntf.sms_unreachable` | NTF-13 | `/account/phone` |
| EV-NTF-05 | Group SMS allowance low | Warning level reached, for the reserve or for the open part | Holders of Group: set notification settings | I, P | Normal | None | `msg.ntf.sms_allowance_low` | NTF-06 | `/groups/{g}/sms` |
| EV-NTF-06 | Group SMS allowance used up | Open part exhausted | Holders of Group: set notification settings | I, P | Important | None | `msg.ntf.sms_allowance_empty` | NTF-06 | `/groups/{g}/sms` |
| EV-NTF-07 | Batch summary | More than the batch threshold of similar items; one SMS, counted once | The recipient | I, P, S-fb (types that allow it) | As the items | As the items | `msg.ntf.batch_summary` | NTF-08 | Filtered list |
| EV-NTF-08 | Weekly digest | Digest day | Members with digest on (push only if the person has a push device) | I, P | Normal | None | `msg.ntf.weekly_digest` | NTF-14 | `/notifications/digest` |
| EV-OPS-01 | Support ticket updated | Operator replies or status changes (OPS-07) | The requester | I, P, plus S-fb for the statuses "Waiting for you" and "Resolved" | Normal (Important for those two statuses) | Pl | `msg.ops.ticket_updated` | OPS-07 | `/support/{id}` |
| EV-OPS-02 | Payment provider incident | Provider outage declared (OPS-08) | Affected members | I, P, plus S-fb only for affected members with a pending request | Important | Pl | `msg.ops.provider_incident` | OPS-08 | `/status` |
| EV-OPS-03 | Account under review | An operator opens a compliance review on the account (OPS-10) | Account owner | I, P, S-fb | Important | Pl | `msg.ops.account_review` | OPS-10 | `/support` |
| EV-OPS-04 | Flag alert | A compliance flag is raised (OPS-10) | Operators with flag-review access | I, P | Normal | None | `msg.ops.flag_alert` | OPS-10 | Operator console |
| EV-OPS-05 | Wallet held by Gereo | An operator hold is placed on a wallet (OPS-10); the message gives the reference and the support route, never the reason | Holders of Wallet: approve spend and Group: view audit log | I, P, S-fb | Important | Pl | `msg.ops.wallet_held` | OPS-10 | `/wallets/{w}` |
| EV-OPS-06 | SMS cost or delivery alert | An OPS-12 threshold is passed (spend, delivery rate, aggregator gap) | Operators with access to `view sms costs` | I, P | Important | None | `msg.ops.sms_alert` | OPS-12 | Operator console |

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| NTF-01 | See everything that happened and open it in one tap | P0 | ACC-02, ACC-03, XCT-01, XCT-04, XCT-14, catalogue |
| NTF-02 | Know whether the message reached the person | P1 | NTF-01, NTF-05, NTF-12, CON-07, VOT-07 |
| NTF-03 | Ask to send notifications only after the app has proved useful | P0 | ACC-02, ACC-11, WAL-01, CON-04, VOT-04, XCT-05 |
| NTF-04 | Choose what I get and how | P0 | NTF-03, NTF-06, NTF-10, NTF-14, ACC-12, ACC-13 |
| NTF-05 | Push first, then SMS only if nobody opened the push | P0 | NTF-03, NTF-04, NTF-06, NTF-07, NTF-10, NTF-12, NTF-13 |
| NTF-06 | Keep SMS cost under control and say who pays | P0 | GRP-07, GRP-08, GRP-13, SPD-01, SPD-02, SPD-05, SPD-09, SPD-10, OPS-12, NTF-05, NTF-12 |
| NTF-07 | Write every SMS so it fits in one short message, in three languages | P0 | XCT-12, XCT-14, NTF-12 |
| NTF-08 | Turn a flood into one message | P1 | NTF-01, NTF-05, NTF-06, NTF-07 |
| NTF-09 | Do not wake people at night | P1 | NTF-04, NTF-05, NTF-12, VOT-01, SPD-04, SPD-10, XCT-03 |
| NTF-10 | Stop SMS any time, and restart it on my terms | P0 | NTF-04, NTF-05, NTF-12, VOT-07, ACC-02, ACC-13 |
| NTF-11 | Reach people who do not have the app | P0 | GRP-03, VOT-06, ACC-16, NTF-05, NTF-06, NTF-07, NTF-10, NTF-13 |
| NTF-12 | Let operators see what was sent, and why | P0 | OPS-01, OPS-06, OPS-09, OPS-12, NTF-05, NTF-13 |
| NTF-13 | When the SMS cannot be delivered | P0 | NTF-05, NTF-12, ACC-05, OPS-12 |
| NTF-14 | One calm summary a week | P2 | NTF-01, NTF-04, GRP-06, CON-03, CON-16, VOT-13, EVT-08 |

Totals: 10 P0, 3 P1, 1 P2. The event catalogue has 160 rows across ACC (17), WAL (14), RUL (8), GRP (19), CON (14), SPD (20), VOT (18), PRJ (11), EVT (12), ANN (13) and the NTF (8) and OPS (6) rows. EV-ACC-05 is retired and not counted.

## Cross-epic dependencies

Every ID below was checked against the story files in this folder.

- ACC: ACC-02 (sign-up with phone and OTP; the OTP message `msg.acc.otp`), ACC-05 (new phone or SIM change), ACC-06 (profile language), ACC-07 and ACC-09 (tiers and verification results), ACC-11 (connected devices), ACC-13 (terms, privacy notice and consent text used by NTF-02, NTF-04 and NTF-10), ACC-16 (open an invite or vote link without an account, used by NTF-11). ACC-12 (`acc.session.hide_previews`, displayed in NTF-04), ACC-15 account deletion sends its own start and finish messages (EV-ACC-13 `msg.acc.delete_started`, EV-ACC-14 `msg.acc.delete_done`).
- WAL: WAL-06 and WAL-07 (deposit pending, confirmed, failed), WAL-09 to WAL-11 (withdrawal and its end states), WAL-08 (provider unavailable, payout queued), WAL-12 and WAL-13 (transfers), WAL-14 (receipts), WAL-16 (export), WAL-20 (reconciliation line, wallet needs attention).
- RUL: RUL-07 (rule firing and chains), RUL-06 (loop and chain depth stops), RUL-09 (spending cap), RUL-10 (goal), RUL-11 (low balance alert), RUL-12 (rule log), RUL-13 (group wallet rule changes).
- GRP: GRP-03 (invite SMS), GRP-04 (accept and decline events), GRP-06 (digest and home counters), GRP-07 and GRP-08 (bundles, grant and revoke alerts), GRP-12 (spending policy changes and loosening), GRP-14 (approver shortage), GRP-15 (wallet created), GRP-16 and GRP-17 (leave, removal), GRP-18 (rules text), GRP-19 and GRP-20 (archive, delete).
- CON: CON-04 (pay), CON-05 (pending and failed), CON-07 (manual reminder), CON-08 (automatic reminders), CON-09 (late fee), CON-10 (exemption), CON-14 (split execution), CON-15 (split failure), CON-16 (ledger view).
- SPD: SPD-04 (approval inbox and its notifications), SPD-07 (voided approvals), SPD-10 and SPD-11 (payout and failure), SPD-14 (cap), SPD-15 (freeze); the SMS allowance top-up is an SPD expense request with Gereo as payee (NTF-06).
- VOT: VOT-03 (passed vote starts the payment), VOT-06 (share link and guest page), VOT-07 (remind people who have not voted), VOT-09 (result), VOT-10 (too few votes), VOT-13 (decision log), VOT-14 (decision recorded outside the app), VOT-18 (poor connection, too-late answers).
- PRJ: PRJ-04 (tasks and milestones), PRJ-03 (budget alert), PRJ-05 (decisions and requests on the project), PRJ-09 (close).
- EVT: EVT-01 (creation), EVT-03 (invitations), EVT-04 (RSVP), EVT-05 (automatic reminders, push then SMS), EVT-06 and EVT-07 (change and cancellation).
- ANN: ANN-01 (publish), ANN-03 (withdraw, moderate), ANN-04 to ANN-08 (campaign events and report); the only ANN parameter is `ANN_URGENT_MAX_PER_MONTH` (default 2), the Urgent flag's monthly limit, and its effective cap is bounded by `ANN_URGENT_SMS_SHARE_PERCENT` (50, defined in the NTF parameter table) against `ntf.group_sms_allowance`; campaign receipts and refunds to non-members go through the number suppression list (NTF-10).
- XCT: XCT-12 owns the SMS encoding, character mapping and build-time lint that NTF-07 relies on (NTF-07 owns the registry and content rules; a rule change is made in XCT-12 first); XCT-14 (strings as keys, fallback), XCT-01 (language), XCT-03 (time), XCT-04 (offline read), XCT-05 (queue labels), XCT-07 (data saver), XCT-10 (accessibility).
- OPS: OPS-01 (the operator permission catalogue, separate from member permissions; NTF-12 cites `view notification log` and `reveal message text` by name), OPS-06 and OPS-07 (tickets), OPS-08 (provider incident), OPS-09 (audit search), OPS-10 (flags and wallet holds: EV-OPS-03 to EV-OPS-05), OPS-12 (SMS spend and delivery dashboard, alerts and aggregator rates).

## Open questions

1. **Closed: who pays for SMS.** The platform pays Pl-class SMS. Each group gets a monthly Gr-class allowance sized by member count, paid by the platform in the MVP, and may top up from a group wallet through an expense request (NTF-06). Evidence: CA section 7 (charge by group size or SMS volume, never gate core behaviour).
2. **Open, needs the SMS aggregator: rates, sender ID registration, two-way SMS and keyword support, delivery reports, a second provider** (CA section 10 blocker 4; R04 section 14.6 risk 10). Default used: one aggregator behind the adapter, working values in the parameter table, no price shown to groups.
3. **Consent.** Closed (NTF-04, NTF-10): SMS for important items is on at sign-up with the consent text in ACC-13, opt-out in the app is always available, Critical SMS continue.
4. **Closed: windows.** Starting values are in the parameter table (NTF-05, NTF-08, NTF-09). Voters on money decisions cannot opt to be woken in the MVP.
5. **Open, needs the aggregator and field interviews: feature phones.** Whether a basic-phone user can vote or confirm by replying to an SMS or by USSD (R07 section 4, R-SMS3). Default used: no reply voting; the light web page or the group's named contact (NTF-11).
6. **Closed: language fallback.** Recipient language, then group language, then Malagasy (NTF-07, NTF-11).
7. **Open, needs a native Malagasy reviewer: Malagasy SMS spelling.** Default used: no circumflex letters, ASCII opt-out keywords STOP and ARRET plus a reviewed Malagasy word (NTF-07, NTF-10).
8. **Closed: opened tracking and privacy.** Tracked for sending decisions, shown to a sender only as a count, never per name, and disclosed in the privacy notice (NTF-02).
9. **Closed: permission names.** SMS settings use Group: set notification settings (decision D2). Operators use `view notification log` and `reveal message text`, to be added to the OPS-01 catalogue.
10. **Closed: push on low-end phones.** Feature detection at run time; no support means SMS for Important items (NTF-03). The share of members with working push is measured in the first cohort.
11. **Closed: catalogue ownership.** NTF owns this table. Another epic adds or changes a row by a change to this file, reviewed by the NTF owner. Moving an event into the Important class needs a cost check against OPS-12 because it adds SMS. The table is frozen at the start of each release build and thereafter changes only through that review.
12. **Open, needs field research: evidence gaps.** Reminder effectiveness in this population is unknown (R07 section 8.8 cites Bolivia, Peru, the Philippines and Uganda, not Madagascar). Default used: the starting windows; A/B test timing and wording in the first cohort.
13. **Closed: key and parameter naming across epics.** NTF owns one key form, `msg.<epic>.<event>` with underscores and variants `.push`, `.sms`, `.inapp`, and one parameter family, `ntf.*`. Other epics rename their keys to the catalogue keys and remove their own waits and caps (`sms_fallback_delay` in SPD, `EVENT_SMS_WAIT` in EVT, `ANN_SMS_WAIT` in ANN, `ntf.event.*` keys in EVT and ANN, and `EVENT_LATE_REMINDER_MIN`, replaced by `ntf.reminder_margin_minutes`). They may keep only the scheduling offsets and the domain counts of their own reminders; for ANN the only parameter is `ANN_URGENT_MAX_PER_MONTH`.
14. **Closed: event overlap.** One SMS ladder exists, defined in NTF-05. CON-08, SPD-04, VOT-07, EVT-05 and the ANN stories may choose only the `ntf.sms_window.<type>` value for their type and the times at which a reminder is scheduled; they may not define a second wait, cap or retry rule. Where a rule differs, the stricter one is kept (one SMS per event per person, no SMS for something already done).
15. **Closed, with external items: freeze is Critical, and quiet hours stay unbreakable for votes.** The freeze SMS (EV-SPD-12) is Critical, direct, platform-paid, sent to holders of Wallet: freeze or Wallet: approve spend other than the person who froze, and capped at `ntf.critical_freeze_sms_per_day` (2) per wallet per day, because a freeze stops money and the people who can lift it must know; beyond the cap the notice is push and in-app only. Votes, approvals and authority votes never override quiet hours, and a payout authorised by a passed vote waits until quiet hours end, so holders of Wallet: freeze can be informed before money leaves (NTF-09). Closed: Critical SMS ignore an SMS opt-out, the consent text names the freeze SMS (ACC-13), and consent and suppression records are kept for `AUDIT_RETENTION_YEARS` (ACC open question 1). Open, needs the aggregator: STOP-reply handling that feeds the number suppression list.
