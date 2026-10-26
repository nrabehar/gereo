# NTF: Notifications and SMS

Epic code NTF, release MVP. Follows [00-conventions.md](../00-conventions.md). Evidence shorthand: `R01` = [raw/01-group-savings.md](../../research/raw/01-group-savings.md), `R04` = [raw/04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md), `R07` = [raw/07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md), `R08` = [raw/08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md), `CA` = [competitive-analysis.md](../../research/competitive-analysis.md), `DF` = [design-foundations.md](../../research/design-foundations.md).

## Founder decisions applied in this epic

- D1 and D4: approval notices go only to holders of Wallet: approve spend other than the requester (EV-SPD-01), and only for spending below the vote threshold. A passed vote starts the payout without approvers, so the notices after a vote are the vote result (EV-VOT-04) and the payout events (EV-SPD-08, EV-SPD-09). A money vote that closes with fewer than two distinct voters other than the requester is reported as no quorum (EV-VOT-05).
- D2: permissions are written "Object: name". SMS settings belong to Group: set notification settings. Operator permissions are a separate catalogue owned by OPS-01; this epic asks OPS-01 to add two: `view notification log` and `reveal message text`.
- D3: every deposit is income, so rules chain. One arrival that fires a chain of rules produces one in-app item (EV-RUL-01), not one per rule.
- D5: the rounding amount of a split goes to Gereo as a visible ledger line; the split notification states it when it is above zero (EV-CON-12).
- Emergency freeze of group money is a Critical event for the holders who can lift it (EV-SPD-12), because money movement has stopped.

## Shared definitions for this epic

**Why this epic matters.** About 9% of adults own a smartphone and about 20% use the internet (CA section 2; the 9% figure is unreproduced, DF section 6), so push reaches few people and SMS is a first-class channel (DF section 3 principle 7). It is also the main running cost of the product (R04 section 14.6 risk 3).

**Channels.** In-app (the notification centre, always written for a person with an account), push, SMS. Email is not used (members may have none; R08 section 6.7 avoid).

**Priority classes.** Priority is a property of the event type in the catalogue. A group cannot change a class, except where a catalogue row says the sender chooses (urgent announcement).

| Class | Meaning | Channels allowed |
| --- | --- | --- |
| Critical | Security codes, security changes, and an emergency freeze of group money for the holders who can lift it; cannot be switched off | In-app, push, SMS direct |
| Important | Money moved or failed, a deadline that costs the person something, a decision they are needed for | In-app, push, SMS after push is not opened |
| Normal | Useful information | In-app, push |
| Low | Background information | In-app and weekly digest only; no push of its own (the digest is the only push) |

**Channel legend used in the catalogue.** I = in-app. P = push. S-fb = SMS only if the push was not opened within the fallback window (NTF-05). S-d = SMS sent directly with no push step (OTP, security, people without the app). "None" means the channel is not used for that event.

**SMS payer legend.** Pl = Gereo (platform): security codes, personal receipts, the person's own account safety. Gr = the group, charged against its SMS allowance (NTF-06): reminders, votes, events, invites and announcements the group's members trigger.

**Message keys.** A base key has the form `msg.<epic>.<event>`. Each channel has its own variant (`.push`, `.sms`, `.inapp`), and each variant exists in Malagasy (mg), French (fr) and English (en). Stories and the catalogue name the base key. No story hard-codes text. A notification is stored as base key plus parameters and rendered in the reader's current language, so a language change re-renders the notification centre.

**"Opened".** A push or SMS counts as opened when the person taps the push, or opens the linked item in the app, or completes the action it asks for (pays, votes, approves). Opening the notification centre alone does not count for items still unread.

**Delivery vocabulary (the shared status table for this epic).** Push: Queued, Held (quiet hours), Sent, Delivered, Opened, Not opened, No device, Failed. SMS: Not needed, Queued, Held (quiet hours), Sent, Retrying, Delivered, No delivery report, Failed, Unreachable, Cancelled (need resolved before sending), Skipped (opt-out, allowance or cap), Expired while held. Every story in this epic uses these names only; sentences such as "Sending" or "Waiting to see if the push is opened" are display text for these states, not extra states.

**Notification item states (in-app).** Unread, Read, Needs your action, Resolved. Offline queue labels ("Saved on this phone", "Waiting to send") are the XCT-05 labels.

**Configurable parameters.** Starting values are decided here from the research and are validated in the first cohort (open question 12); they are working values, not findings. This epic owns every parameter named `ntf.*`. Other epics point at these and never define their own wait, cap or batching value (open question 13).

| Parameter | Meaning | Starting value |
| --- | --- | --- |
| `ntf.sms_window.<type or class>` | Minutes to wait for the push to be opened before SMS | Important default 120. Spending approval 60. Vote closing and money vote closing 60. Contribution due today 60. Contribution due soon 240. Event reminder 2 hours before 30. Event reminder 24 hours before 240 |
| `ntf.sms_window_deadline_share` | Largest share of the time left before a deadline the wait may use | 0.5 |
| `ntf.push_failed_sms_delay` | Delay before SMS when the push provider reports a failure (NTF-05) | 2 minutes |
| `ntf.sms_daily_cap_per_person` | Most SMS one person receives per day (Critical excluded) | 3 |
| `ntf.group_sms_allowance` | SMS per group per month included, sized by member count; paid by the platform in the MVP | 4 per member per month (recompute when the aggregator quote is known) |
| `ntf.sms_allowance_warning_percent` | Share of the allowance used that triggers the warning | 80 |
| `ntf.batch_threshold` | Number of similar items that triggers a summary (NN/g guidance, R07 section 8.8) | 5 |
| `ntf.batch_window` | Time in which similar items are counted | 10 minutes |
| `ntf.quiet_hours_default` | Default quiet window (R07 section 8.8 R-NT5) | 21:00 to 07:00 |
| `ntf.sms_max_retries`, `ntf.sms_retry_backoff` | Retry limits for failed SMS | 3 retries, after 5, 15 and 60 minutes |
| `ntf.sms_report_timeout` | Time after which an SMS without a delivery report reads No delivery report | 60 minutes |
| `ntf.push_prompt_moments`, `ntf.push_reprompt_delay` | When to ask for push permission, and the wait before asking once more | First wallet created, first contribution confirmed, first vote cast; 14 days |
| `ntf.centre_cache_items`, `ntf.centre_retention` | Items cached offline and items kept in the centre | 50 items; 12 months |
| `ntf.log_retention` | How long delivery logs (attempts, decisions) are kept | 12 months. Consent records are not covered: they follow `AUDIT_RETENTION_YEARS` (SPD) |
| `ntf.digest_day` | Day and hour of the weekly digest | Sunday 18:00 Madagascar time |
| `ntf.sms_group_name_max` | Longest group name in an SMS (NTF-07) | 16 characters, truncated to GSM-7 safe text |
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
5. Offline: the latest `ntf.centre_cache_items` items are readable from cache with a "Last synced" line; opening an item that needs the network shows what is cached and a "No connection" explanation; reading actions queue and show "Waiting to send".
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
2. Happy path, sender: a holder of the matching permission sees for each recipient, by name, the highest delivery state reached per channel: push Delivered, No device or Failed; SMS Delivered, Held, Failed, Unreachable, Skipped (with reason); and the time. The Opened state is shown to the sender only as a count ("5 not opened"), never beside a name.
3. Rule: only counts are shown to the group ("3 members not reached"); names with a delivery problem are shown only to the permission holder who sent the item. The "not opened" count exists only for Important and Critical types. A recipient always sees their own Opened state.
4. Rule: the sender view never shows message text of other people's private messages (for example private late-payment reminders to other members), only that one was sent and its state.
5. States: items still Queued show "Sending"; items whose fallback timer is running show "Waiting to see if the push is opened until 14:20"; offline shows the cached state with last synced time.
6. Errors: if the provider has no delivery report the state reads "No delivery report" and is never shown as Delivered; a failed SMS shows the reason in plain words and the next action (for example "Ask this person to check their number").
7. Notifications: none; viewing delivery state sends nothing.
8. Audit: opening the sender view of per-recipient delivery is logged with who, which item and when, because it exposes personal engagement data.
9. Accessibility and language: states are words plus icons; time is absolute with a relative hint; labels exist in three languages.

**Data:** Notification, Device, Delivery attempt. **Depends on:** NTF-01, NTF-05, NTF-12, CON-07 (manual reminder), VOT-07 (vote reminders).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: "Opened" is tracked, because NTF-05 needs it to avoid paying for an SMS nobody needed. Senders see only the count of not opened, never a name, and the group sees nothing; the tracking is disclosed in the privacy notice (ACC-13). The wording of that disclosure is part of the legal review of consent (open question 3).

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
6. States: devices without push support (some low-end browsers or Android Go builds) never see the screen and the person's preferences screen says "Push is not available on this phone. Important items come by SMS." Offline: the screen can be completed, the registration is queued and shown as "Waiting to send".
7. Errors: if registration fails after the permission is granted, the person sees "Notifications are on, but we could not finish setting them up. [Try again]" and a retry runs silently at next open; no message is lost because the notification centre still holds everything.
8. Notifications: the first confirmed push on the new device is a short test (`msg.ntf.push_enabled.push`) so the person sees it works; no SMS.
9. Audit: the grant, denial and device registration are recorded as a consent and device event with time, device id and the permission state.
10. Accessibility and language: the screen is usable with a screen reader and at 200% font size; text in three languages; the "Not now" button has the same visual weight as the primary button.

**Data:** Device, Notification preference, Audit entry. **Depends on:** ACC-02 (sign-in), ACC-11 (devices), WAL-01, CON-04 and VOT-04 (the first useful moments), XCT-05 (queue labels).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: for a person who joins only to vote, the first vote cast is a first useful moment (it is in the default list). Closed: push on a web app installed on a low-end Android phone is decided by feature detection at run time; where the browser does not report push support the person is treated as having no device and Important items come by SMS (criterion 6). The share of members with working push is measured from device registrations in the first cohort.

---

### NTF-04 Choose what I get and how

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** sms, offline

**Story:** As a member, I want to choose which kinds of messages I get, whether I accept SMS for important items, and whether I want a weekly summary, so that the app is useful and not noisy.

**Conversation:** Most people keep defaults, so defaults must be conservative, and per-type toggles belong inside the app (R07 section 8.8, NN/g). The proposed defaults are contributions due, votes closing, approvals waiting, events, and a weekly digest, with everything else off (R07 R-NT3, to validate). Loomio offers digest versus immediate (R08 section 6.12 adopt). The consent default for SMS is an open question because SMS has a cost and consent rules (NTF-10).

**Preconditions:** Signed in. **Trigger:** Opens Settings, then Notifications.

**Acceptance criteria:**
1. Happy path: the screen shows groups of types in plain words (Money, Waiting for you, Reminders, Group news, Weekly summary), each with a push switch; below it a single choice "SMS for important items only" (on or off) with a sentence listing what counts as important, and a switch for the weekly digest (NTF-14).
2. Rule: Critical types (security codes and security changes) cannot be switched off and the screen says so in one line. Low types have no push switch (they appear in the centre and the digest).
3. Rule: defaults are conservative: Important types on; Normal types push on only for contributions, votes, approvals and events; Low types off; SMS for important items is on by default, shown clearly and never hidden; the consent wording the person accepted is the one of ACC-13 and NTF-10.
4. Rule: a person can mute a group's Normal and Low notifications without leaving the group; Important and Critical types from that group continue.
5. Rule: the screen shows the person's current state in words ("Push: on for this phone. SMS: important items only. Quiet hours 21:00 to 07:00") and a "Send me a test" button that sends one push and never an SMS.
6. States: loading skeleton; offline: the screen is readable from cache and changes are kept as "Waiting to send"; turning SMS off while offline shows "You may still receive SMS until this is sent" because the change is not yet applied.
7. Errors: a failed save restores the previous values and says so; a setting never silently reverts.
8. Notifications: changing SMS or push choices sends no message except the opt-out and opt-in confirmations in NTF-10.
9. Audit: every change to SMS consent, digest and per-type switches is recorded with old value, new value, time and device.
10. Accessibility and language: switches have visible labels and state words; the list of "important items" is one plain sentence per type in three languages.

**Data:** Notification preference, Audit entry. **Depends on:** NTF-03, NTF-10, NTF-14, XCT-01, XCT-04, XCT-05.
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
1. Happy path: the system sends push to the person's registered devices, starts a fallback timer of length `ntf.sms_window.<type>`, and if the push is not opened (see "Opened" above) before it ends, sends the SMS variant of the message once. If it is opened, no SMS is sent.
2. Rule: only types marked S-fb or S-d in the catalogue ever produce SMS. Normal and Low types never do, whatever the group wants. There is no SMS for marketing.
3. Rule: the wait is deadline-aware: the effective window is the smaller of the configured window and `ntf.sms_window_deadline_share` of the time left before the deadline, so a vote closing in two hours does not wait longer than the vote allows. If too little time is left to wait, the SMS is sent immediately.
4. Rule: the need is re-checked immediately before sending. If the person has already acted (paid, voted, approved, RSVPed), or the event has been cancelled or closed, the SMS is cancelled with state Cancelled and a reason. A person never receives an SMS for something already done.
5. Rule: recipients with no registered device, an invalid push token, or push denied skip the push step and receive the SMS directly (S-d behaviour) if their preferences allow it. Recipients who opted out of SMS (NTF-10) receive only push and in-app.
6. Rule: at most one SMS per event per person (idempotency key of event, recipient and channel). Respect `ntf.sms_daily_cap_per_person` for non-Critical types; a skipped SMS is logged as Skipped with the reason "daily cap".
7. States: the timer is stored on the server and survives restarts; an item waiting is shown to the recipient as "We will text you at 14:20 if you have not opened this" only for recipients who see the delivery line (NTF-02). Offline phones cannot confirm push delivery, so they are treated as not opened when the timer ends.
8. Errors: if the push provider fails, the system does not wait the window but sends the SMS after a short delay (logged as "push failed"); if the SMS also fails, NTF-13 applies and the in-app item remains.
9. Ledger and audit: each decision (SMS sent, cancelled, skipped) is logged with event, recipient, reason and time (NTF-12); billable SMS are counted against the payer (NTF-06). No money moves.

**Data:** Notification, Delivery attempt, Device, Notification preference. **Depends on:** NTF-03, NTF-04, NTF-06, NTF-07, NTF-10, NTF-12, NTF-13, event catalogue.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: starting windows are in the parameter table (60 minutes for approvals, money votes and due-today contributions, 120 for other Important items, 30 for the two-hour event reminder), because R-NT3 asks for the approval nudge within a day and votes within hours, and Karlan's studies show one timely SMS is enough (R07 section 8.8). They are tuned by A/B test (open question 12). Closed: guest voters and invitees without an account have no device and get SMS direct (criterion 5); if they later sign in, push-then-SMS applies.

---

### NTF-06 Keep SMS cost under control and say who pays

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: set notification settings)
**Permission needed:** Group: set notification settings (decision D2)
**Tags:** sms, ledger, audit

**Story:** As a group member who runs the group's settings, I want to see how many SMS the group has used, what they cost and what happens when the allowance runs out, so that SMS never become a surprise bill or silently stop.

**Conversation:** Twilio lists about USD 0.59 per segment for Madagascar, but local aggregator rates were not verified (CA section 2; R04 section 14.6 risk 3). The research recommends budgeting SMS per group or per event, rationing to critical messages, showing the cost to the group owner and charging by group size or SMS volume without ever gating core behaviour (R08 section 6.12; CA section 7 design rules). This story fixes the rules without choosing prices. Who pays is decided in Open questions.

**Preconditions:** A group exists. **Trigger:** The group uses SMS, or a holder opens "SMS usage" in group settings.

**Acceptance criteria:**
1. Happy path: the screen shows the monthly allowance (`ntf.group_sms_allowance`), SMS used so far this month, the cost per message at the current rate when the rate is known, and a list of what was sent by type and count (never message text of private items).
2. Rule: two payer classes apply. Platform pays (Pl) for security codes, personal receipts and account safety messages, which never reduce a group allowance. The group pays (Gr) for invites, reminders, votes, events and announcements that members trigger, which draw from the group allowance.
3. Rule: before a manual bulk send (for example the treasurer's "remind everyone who is late"), the sender sees an estimate "12 SMS, about X Ar" and confirms; automatic sends do not ask but are counted.
4. Rule: when usage reaches `ntf.sms_allowance_warning_percent` holders of Group: set notification settings get a push and an in-app item; when the allowance is used up Gr-class SMS stop, push and in-app continue, and the banner "SMS are paused for this group" appears for them. Critical and Pl-class SMS never stop.
5. Rule: topping up the allowance is explicit. If it is paid from a group wallet it is an expense request with Gereo as the payee (SPD-01): it follows the group's spending policy (SPD-02), so below the vote threshold approvers other than the requester approve it (SPD-05, decision D1) and above it a vote authorises it (SPD-09, decision D4). It writes a ledger entry classified as an SMS fee credited to Gereo, and shows the exact amount, payee and wallet; nothing is ever deducted from a wallet silently.
6. States: loading skeleton; empty month shows "No SMS used yet this month"; offline shows cached counts with last synced time.
7. Errors: if the usage count cannot be loaded the screen says so and the system errs on the side of not exceeding the allowance; if a top-up payment fails, no allowance is added and no money moves.
8. Notifications: `msg.ntf.sms_allowance_low` and `msg.ntf.sms_allowance_empty` to holders of Group: set notification settings (push, in-app; no SMS since it is the problem being addressed).
9. Ledger and audit: each billable SMS records recipient, type, segments, payer class and cost as an operational record; a wallet-funded top-up writes a balanced ledger entry; changes to allowance settings are audited.

**Data:** SMS allowance, Delivery attempt, Ledger entry (for top-ups), Audit entry. **Depends on:** GRP-07 and GRP-08 (the permission), SPD-01, SPD-02, SPD-05, SPD-09 and SPD-10 (top-up as an expense), OPS-12 (rates and budget), NTF-05, NTF-12.
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
1. Happy path: a template is stored per base key and language, with a body and parameter names. Every SMS body begins with "Gereo:" and ends with a reference. It leads with amount and action, and gives the next step. Example shape: `Gereo: Contribution 10 000 Ar due 25/10 for Group Tanjona. Pay in app. Ref C-4821`. Wording for mg and fr is written by native speakers, not machine translation.
2. Rule: all SMS text uses GSM-7 characters only. Forbidden: emoji, curly quotes and apostrophes, non-breaking spaces (the thousands separator in amounts must be an ordinary space), and letters outside the GSM-7 table including circumflex vowels and lowercase c-cedilla. Characters that count as two in GSM-7 (for example `[ ] { } ^ ~ | \`) are avoided.
3. Rule: rendered length must be at most 160 characters, tested with the longest allowed value for every parameter. Group names are shortened to a GSM-7 safe, truncated form (`ntf.sms_group_name_max`) with a visible preview in group settings; recipient names are first names only and truncated.
4. Rule: a CI check lints every template in every language for forbidden characters, worst-case length and missing parameters, and fails the build. A template whose language variant is missing cannot be enabled for that language; fallback order is recipient language, then group language, then Malagasy (the platform default, because it is the language of most members). The lint rules are owned by XCT-12; this story owns the registry and the content rules, and a change to one is made in both.
5. Rule: a template that cannot meet GSM-7 in a language is not shipped as UCS-2 by accident; it needs an explicit exception that states segment count and cost, owned by a named approver.
6. Rule: each message stands alone: it says what, how much, who and a reference (R07 R-SMS2), contains no exclamation marks and no emoji in money, error or conflict messages (R07 R-MC7), and never names or shames a member in a message that others can see (R07 R-NT8). Late reminders to members are private and use the fact plus an offer (R07 R-MC8).
7. Rule: links, if any, use `ntf.sms_short_link_domain` and are counted in the 160 characters. Messages must stay usable if the link cannot be opened: they carry the needed facts in text.
8. States: the template registry shows for each template and language its length, segments and encoding; a draft that fails cannot be published.
9. Errors: if a template fails at send time (missing parameter, over length), the SMS is not sent, the error is logged with the base key and recipient, and the in-app item remains (NTF-13).
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
2. Rule: "similar" means the same base key and the same group, to the same recipient. Critical types and money-moved receipts for the person's own transactions are never batched. Items from different groups are never mixed.
3. Rule: individual items still appear in the notification centre (NTF-01), grouped under the summary and expandable; the unread badge counts the summary once.
4. Rule: SMS batching: when several SMS-eligible items for one person would fire within the window, a single SMS summarises them by count and type ("3 contributions still due. Ref ..."), under 160 GSM-7 characters, without names (R07 R-NT8), and counts as one SMS in the allowance.
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
2. Rule: Critical events (codes, new device, PIN change, phone change, and an emergency freeze of group money to the holders who can lift it) are delivered at any hour by SMS direct as required.
3. Rule: Important SMS are not sent during quiet hours; they are held until the end. Quiet hours never make a deadline pass in silence: planned reminders are scheduled before quiet hours begin (criterion 4). An item created inside quiet hours whose deadline falls before quiet hours end stays Held and becomes Expired while held at its deadline; the sender sees "Not sent: quiet hours" in NTF-02 and, at creation, a warning that some people may not be notified before the deadline. Every outcome is logged.
4. Rule: reminders are scheduled at send time outside quiet hours by design; only unplanned events (for example a vote result at 23:00) are held.
5. Rule: quiet hours use the person's local time; changing the time zone or the window affects only items not yet delivered.
6. States: preferences show "Quiet hours 21:00 to 07:00 (Madagascar time)" and "Held: 2 notifications until 07:00"; offline shows the cached setting and a note that changes apply when synced.
7. Errors: if the clock or time zone is wrong on the device, the server's setting governs; a failed save keeps the previous window.
8. Notifications: none beyond the held items; the held list does not itself produce a message.
9. Audit: held, delivered-late and expired-while-held decisions are logged (NTF-12).

**Data:** Notification preference, Delivery attempt. **Depends on:** NTF-04, NTF-05, NTF-12, XCT-03 (Madagascar time).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default window is 21:00 to 07:00 (`ntf.quiet_hours_default`), editable per person. Closed: voters on money decisions cannot opt to be woken in the MVP, because VOT and SPD already decided that quiet hours are never overridden by a vote or an approval; the creation warning in criterion 3 covers the risk.

---

### NTF-10 Stop SMS any time, and restart it on my terms

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** sms, audit, legal-gate

**Story:** As a person who gets SMS from Gereo, I want to stop them whenever I choose and to start them again later, so that the app respects my consent and my phone credit.

**Conversation:** SMS is used for reminders and group decisions, not marketing (R07 R-NT1). Consent for SMS in Madagascar and the rules for opt-out keywords and sender registration were not researched, so this story is `legal-gate`: keywords, wording and record keeping depend on a legal and aggregator check (CA section 10 blocker 4). The principle stands either way: opt-out is always available in-app, and one person's opt-out must not break group deadlines (they still get push and in-app).

**Preconditions:** The person has a verified phone number. **Trigger:** Turns SMS off or on in preferences, or replies with an opt-out keyword where two-way SMS is supported.

**Acceptance criteria:**
1. Happy path, opt-out: in NTF-04 the person turns off "SMS for important items". The screen first says what they may miss ("a vote closing, a contribution due, a payment receipt") and asks to confirm. After confirming, one last SMS confirms it (`msg.ntf.sms_optout_confirm.sms`) and no further non-Critical SMS is sent.
2. Happy path, re-opt-in: the person turns SMS back on in the app, confirms, and receives one confirmation SMS (`msg.ntf.sms_optin_confirm.sms`). Signing in with the phone and OTP is the proof of consent.
3. Rule: reply keywords (per language, set by `ntf.sms_optout_keywords`) work only where the aggregator supports two-way SMS; the app never promises a keyword that is not live. A reply opt-out is handled within the same flow and shown in the app on next open.
4. Rule: Critical SMS (OTP and security alerts) are not covered by the opt-out because the person asked for them in the moment; the screen says so in one sentence.
5. Rule: an opt-out is per person, not per group; groups never see who opted out, only a count "3 members are not reachable by SMS" to holders of Contribution plan: send reminder.
6. States: the setting shows the date it was changed; offline changes are queued with "You may still receive SMS until this is sent" (NTF-04).
7. Errors: if the confirmation SMS fails, the opt-out still takes effect and the in-app state is correct; a failed opt-in leaves SMS off and says so.
8. Notifications: the two confirmation messages above; nothing else.
9. Audit: every consent change is recorded with person, old and new state, channel (app or reply), text version shown, time and device; records are kept for `AUDIT_RETENTION_YEARS` (SPD), not `ntf.log_retention`, because they are evidence of consent.

**Data:** Notification preference, Consent record, Audit entry. **Depends on:** NTF-04, NTF-05, NTF-12, ACC-02 (phone and OTP), ACC-13 (terms and consent text).
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs a lawyer and the aggregator: legal basis and wording for SMS consent, whether two-way SMS and keywords are available, and whether Critical SMS may lawfully ignore an opt-out. Default used until then: opt-out in the app only, keywords shown only where the aggregator confirms them, Critical SMS continue (criterion 4).

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
1. Happy path: for such recipients Important types are sent as SMS directly (S-d), in their language, self-contained: what, how much, who, reference, and how to act. Normal and Low types are not sent, to protect cost.
2. Rule: the SMS says how the person can act without the app: a link to a light web page (guest voting, in VOT), a reference to quote to a named contact, or an instruction to ask the group's contact, whichever is available. A message that depends only on a link is not allowed (NTF-07 criterion 7).
3. Rule: the recipient's language comes from their account if any, otherwise from the invite (GRP-03) or vote link, otherwise from the group's language.
4. Rule: guest voters: the SMS link carries a signed single-use token that opens a page needing no account, works on a low-end browser, loads a small page, and expires at the vote deadline (VOT-06 defines the page, ACC-16 the entry).
5. Rule: these SMS are charged to the group allowance (class Gr) except security codes and personal receipts, which are Pl; the group sees a count of "people reached by SMS only" in usage reports (NTF-06).
6. States: if a person later installs the app and signs in with the same number, their pending items appear in the centre and SMS-only handling stops for them.
7. Errors: an unreachable number is flagged (NTF-13) and the inviter or sender is told in-app; the message is never retried beyond limits.
8. Notifications: the same messages as in the catalogue marked S-d; no new keys.
9. Audit: SMS-only sends are logged with the reason "no device" (NTF-12).

**Data:** Notification, Delivery attempt, Invite, Ballot link. **Depends on:** GRP-03 (invite SMS), VOT-06 (guest voting page), ACC-16 (open a link without an account), NTF-05, NTF-06, NTF-07, NTF-13.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the default language for an unknown number is the group's language, then Malagasy (NTF-07 criterion 4). Open, needs the aggregator and field interviews: whether people with only a feature phone can vote or confirm by replying to an SMS. Default used until then: no reply voting; the person acts through the light web page if the phone has a browser, or through the group's named contact (criterion 2), and approving by SMS reply is never allowed (SPD).

---

### NTF-12 Let operators see what was sent, and why

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Gereo operator
**Permission needed:** operator permission `view notification log`; `reveal message text` to see a message body (both to be added to the OPS-01 catalogue)
**Tags:** sms, audit

**Story:** As a Gereo operator, I want a searchable log of every notification attempt with its channel, status, reason and cost, so that I can answer "why didn't I get my SMS" and watch SMS spend.

**Conversation:** Support is slow on every money product and the first question is "did you send it?" (CA section 4 point 3). The research also warns of delayed or missing SMS without in-app fallback (R08 section 6.12 avoid). Message text can contain money and personal data, so operators see it only with a reason, and every view is logged (R07 section 8.5 R-PM4 on audit trails).

**Preconditions:** An operator account with the right access. **Trigger:** A support ticket, a spending review, or a routine check.

**Acceptance criteria:**
1. Happy path: each attempt shows message id, base key and language, event id and epic, recipient (masked number and user id), channel, status per the delivery vocabulary, provider status code and message, segment count and encoding, cost and payer class, and timestamps for queued, sent, delivered and opened.
2. Rule: each row also shows the decision that led to it, in words: "SMS sent: push not opened within the window", "SMS skipped: person opted out", "SMS cancelled: contribution already paid", "SMS held: quiet hours", "SMS skipped: daily cap".
3. Rule: search and filter by phone number, user, group, epic, base key, status, date range and payer; a trace view shows the whole chain for one event across channels.
4. Rule: the rendered message text is hidden by default and shown only after the operator states a reason; OTP codes are never stored in logs; every reveal and every export is itself audited with operator, reason and time.
5. Rule: the SMS volume, delivery rate, cost and spend alerts are the dashboard of OPS-12 (permission `view sms costs`); this log is the per-message record those figures sum, and the totals of the two must match for any period.
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
5. Rule: the sender view (NTF-02) shows "SMS failed" or "Unreachable" with the reason; holders of Contribution plan: send reminder or Vote: create see the count of unreached people. The group channel never names them.
6. Rule: if the failure rate for one aggregator passes a limit, operators are alerted and a second aggregator can be used through the adapter (open question); the system never loses the queued messages.
7. States: while retrying the state reads "Retrying"; no delivery report after `ntf.sms_report_timeout` reads "No delivery report" and is not counted as delivered.
8. Errors: costs are recorded only as reported by the provider; a failed message that the provider does not bill is not counted against the group allowance.
9. Notifications: `msg.ntf.sms_unreachable.inapp` to the recipient; sender summary in-app; no SMS about an SMS failure.
10. Audit: each attempt, retry, classification and final state is logged (NTF-12).

**Data:** Delivery attempt, Notification, Notification preference. **Depends on:** NTF-05, NTF-12, ACC-05 (change phone), OPS-12 (aggregator alert).
**Pages:** to be filled from the information architecture.
**Open questions:** Open, needs the aggregator and a cost decision: whether a second SMS aggregator or a voice call is used for Critical codes. Default used until then: one aggregator behind the adapter, no voice call. Closed: silent failures are detected by the `ntf.sms_report_timeout` state and by OPS-12 comparing sent counts with the aggregator's billed counts each day.

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

Every MVP epic is covered. The IDs are stable references; epics may add events later through this table. Deep links are route templates; the information architecture reconciles them later, and a story never points at a screen number. `{g}` group, `{w}` wallet, `{t}` transaction, `{a}` approval, `{v}` vote, `{e}` event, `{p}` project, `{c}` contribution, `{r}` rule. Every event also writes an in-app item for people with an account unless the Channel cell says "None".

Where the audience is "people with an account", people without one receive only the S-d variants marked in the Channel column.

### ACC

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-ACC-01 | Sign-in or action code requested | Person asks for a code (sign-up, sign-in, PIN reset, sensitive action) | The requester | S-d, no in-app | Critical | Pl | `msg.acc.otp` | None (code autofill format) |
| EV-ACC-02 | New device signed in | Successful sign-in from an unknown device | Account owner, on existing devices and by SMS | I, P on other devices, S-d | Critical | Pl | `msg.acc.new_device` | `/account/devices` |
| EV-ACC-03 | PIN changed or reset | PIN set or reset | Account owner | I, P, S-d | Critical | Pl | `msg.acc.pin_changed` | `/account/security` |
| EV-ACC-04 | Phone number changed | Number updated | Old and new number | S-d to both, I | Critical | Pl | `msg.acc.phone_changed` | `/account/security` |
| EV-ACC-05 | Account recovery started | Recovery requested | Account owner | I, P, S-d | Critical | Pl | `msg.acc.recovery_started` | `/account/recovery` |
| EV-ACC-06 | Identity check submitted | Documents sent | Applicant | I | Low | None | `msg.acc.kyc_submitted` | `/account/identity` |
| EV-ACC-07 | Identity check approved | Operator or system approves a tier | Applicant | I, P, S-fb | Important | Pl | `msg.acc.kyc_approved` | `/account/identity` |
| EV-ACC-08 | Identity check needs action | Rejected, or more information needed | Applicant | I, P, S-fb | Important | Pl | `msg.acc.kyc_action_needed` | `/account/identity` |
| EV-ACC-09 | Tier limit reached | A money action hit a limit | The person, in context | I | Normal | None | `msg.acc.limit_reached` | `/account/identity` |
| EV-ACC-10 | Account restricted | Operator restriction for compliance | Account owner | I, P, S-fb | Important | Pl | `msg.acc.restricted` | `/support` |

### WAL

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-WAL-01 | Deposit pending | Payment started, awaiting provider | The depositor | I | Normal | None | `msg.wal.deposit_pending` | `/wallets/{w}/tx/{t}` |
| EV-WAL-02 | Deposit confirmed | Provider confirms | The depositor | I, P, S-fb | Important | Pl | `msg.wal.deposit_confirmed` | `/wallets/{w}/tx/{t}` |
| EV-WAL-03 | Deposit failed | Provider reports failure; says no money moved | The depositor | I, P, S-fb | Important | Pl | `msg.wal.deposit_failed` | `/wallets/{w}/tx/{t}` |
| EV-WAL-04 | Withdrawal pending | Request sent to provider | The requester | I, P | Normal | None | `msg.wal.withdrawal_pending` | `/wallets/{w}/tx/{t}` |
| EV-WAL-05 | Withdrawal confirmed | Provider confirms | The requester | I, P, S-fb | Important | Pl | `msg.wal.withdrawal_confirmed` | `/wallets/{w}/tx/{t}` |
| EV-WAL-06 | Withdrawal failed | Provider reports failure | The requester | I, P, S-fb | Important | Pl | `msg.wal.withdrawal_failed` | `/wallets/{w}/tx/{t}` |
| EV-WAL-07 | Transaction needs attention | Pending past expected time, or mismatch | The owner | I, P, S-fb | Important | Pl | `msg.wal.needs_attention` | `/wallets/{w}/tx/{t}` |
| EV-WAL-08 | Provider unavailable, payout queued | Provider down, payout held | The requester | I, P | Important | None | `msg.wal.provider_queued` | `/wallets/{w}/tx/{t}` |
| EV-WAL-09 | Transfer between own wallets done | Transfer confirmed | The owner | I | Low | None | `msg.wal.transfer_done` | `/wallets/{w}/tx/{t}` |
| EV-WAL-10 | Money received from a person | Transfer into wallet from another person | The receiver | I, P | Normal | None | `msg.wal.transfer_received` | `/wallets/{w}/tx/{t}` |
| EV-WAL-11 | Export ready | Export file generated | The requester | I | Low | None | `msg.wal.export_ready` | `/wallets/{w}/export` |

### RUL

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-RUL-01 | Rule fired | A rule created a ledger entry; a whole chain of rules fired by one arrival is one item that names each rule (decision D3) | Wallet owner; holders of Wallet: view history for group wallets | I (batched, NTF-08) | Low | None | `msg.rul.fired` | `/wallets/{w}/rules/{r}` |
| EV-RUL-02 | Spending cap reached | Cap hit | Wallet owner; holders of Wallet: edit rules for group wallets | I, P | Normal | None | `msg.rul.cap_reached` | `/wallets/{w}/rules/{r}` |
| EV-RUL-03 | Low balance alert | Balance under alert level | Wallet owner; holders of Wallet: edit rules for group wallets | I, P | Normal | None | `msg.rul.low_balance` | `/wallets/{w}` |
| EV-RUL-04 | Goal reached | Target amount met | Wallet owner; group members | I, P | Normal | None | `msg.rul.goal_reached` | `/wallets/{w}/rules/{r}` |
| EV-RUL-05 | Goal behind schedule | Weekly check finds it behind | Wallet owner | I, digest | Low | None | `msg.rul.goal_behind` | `/wallets/{w}/rules/{r}` |
| EV-RUL-06 | Rule skipped | Insufficient funds, loop prevented, or chain deeper than the maximum chain depth (decision D3) | Wallet owner; holders of Wallet: edit rules | I, P | Normal | None | `msg.rul.skipped` | `/wallets/{w}/rules/{r}` |
| EV-RUL-07 | Group wallet rule changed | Rule edited | Holders of Wallet: view history | I, P | Normal | None | `msg.rul.group_changed` | `/wallets/{w}/rules/{r}` |

### GRP

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-GRP-01 | Group created | Founder creates | Founder | I | Low | None | `msg.grp.group_created` | `/groups/{g}` |
| EV-GRP-02 | Invitation received (phone) | Invite sent by number | Invitee | S-d (I if account) | Important | Gr | `msg.grp.invite_received` | `/join/{token}` |
| EV-GRP-03 | Invitation accepted | Invitee joins | Inviter | I, P | Normal | None | `msg.grp.invite_accepted` | `/groups/{g}/members` |
| EV-GRP-04 | Invitation declined | Invitee declines | Inviter | I, P | Normal | None | `msg.grp.invite_declined` | `/groups/{g}/members` |
| EV-GRP-05 | Member joined | Join completes | Holders of Group: view group | I (batched) | Low | None | `msg.grp.member_joined` | `/groups/{g}/members` |
| EV-GRP-06 | Member left | Member leaves | Holders of Group: remove member and Wallet: approve spend | I, P | Normal | None | `msg.grp.member_left` | `/groups/{g}/members` |
| EV-GRP-07 | Member removed | Removal completes | The removed person | I, P, S-fb | Important | Gr | `msg.grp.member_removed` | `/groups/{g}` |
| EV-GRP-08 | Permission granted | Grant | The person | I, P (S-fb if money-out) | Normal (Important if money-out) | Gr | `msg.grp.permission_granted` | `/groups/{g}/access/me` |
| EV-GRP-09 | Permission revoked | Revoke | The person | I, P (S-fb if money-out) | Normal (Important if money-out) | Gr | `msg.grp.permission_revoked` | `/groups/{g}/access/me` |
| EV-GRP-10 | Spending rule changed | Thresholds saved | Holders of Wallet: approve spend | I, P | Normal | None | `msg.grp.threshold_changed` | `/groups/{g}/spending-rules` |
| EV-GRP-11 | Rule loosening needs approval | Loosening proposed | Required approvers | I, P, S-fb | Important | Gr | `msg.grp.threshold_loosen_requested` | `/groups/{g}/spending-rules` |
| EV-GRP-12 | Group needs a second approver | Fewer than two holders of Wallet: approve spend while a group wallet holds money (decision D1) | Holders of Group: grant permission | I, P, S-fb | Important | Gr | `msg.grp.approver_shortage` | `/groups/{g}/access` |
| EV-GRP-13 | Wallet created | Group wallet added | Members | I (batched) | Low | None | `msg.grp.wallet_created` | `/groups/{g}/wallets/{w}` |
| EV-GRP-14 | Group rules text changed | "How our group works" edited | Members | I, P | Normal | None | `msg.grp.group_edited` | `/groups/{g}/about` |
| EV-GRP-15 | Archive needs confirmation | Archive requested | The second holder of Group: delete group | I, P, S-fb | Important | Gr | `msg.grp.archive_requested` | `/groups/{g}/archive` |
| EV-GRP-16 | Group archived | Archive confirmed | Members | I, P | Normal | None | `msg.grp.archived` | `/groups/{g}` |
| EV-GRP-17 | Deletion scheduled | Delete confirmed, grace starts | Members | I, P | Normal | None | `msg.grp.delete_scheduled` | `/groups/{g}` |
| EV-GRP-18 | Leave confirmed | Member left | The leaver | I | Low | None | `msg.grp.leave_confirmed` | `/groups` |

### CON

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-CON-01 | Plan created or changed | Plan saved | Members | I, P | Normal | None | `msg.con.plan_changed` | `/groups/{g}/contributions` |
| EV-CON-02 | Contribution due soon | Scheduled before the due date (days set in the plan) | Members who owe | I, P, S-fb | Important | Gr | `msg.con.due_soon` | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-03 | Contribution due today | Due date | Members who owe | I, P, S-fb | Important | Gr | `msg.con.due_today` | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-04 | Contribution overdue | Past due, private | The member who owes | I, P, S-fb | Important | Gr | `msg.con.overdue` | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-05 | Reminder sent by a treasurer | Manual reminder, includes the sender's first name | Selected late members | I, P, S-fb | Important | Gr | `msg.con.reminder_manual` | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-06 | Payment received | Contribution confirmed | The payer | I, P, S-fb | Important | Pl | `msg.con.payment_received` | `/wallets/{w}/tx/{t}` |
| EV-CON-07 | Payment failed | Contribution failed; says no money moved | The payer | I, P, S-fb | Important | Pl | `msg.con.payment_failed` | `/groups/{g}/contributions/{c}/pay` |
| EV-CON-08 | Member paid | Contribution confirmed | Holders of Contribution plan: view (counts only) | I (batched) | Low | None | `msg.con.member_paid` | `/groups/{g}/contributions` |
| EV-CON-09 | Late contributions summary | Daily after due date | Holders of Contribution plan: send reminder | I, P | Normal | None | `msg.con.late_summary` | `/groups/{g}/contributions` |
| EV-CON-10 | Exemption granted | A holder of Contribution plan: exempt member acts | The exempted member | I, P | Normal | None | `msg.con.exempted` | `/groups/{g}/contributions/{c}` |
| EV-CON-11 | Penalty applied | Late penalty written | The member | I, P, S-fb | Important | Gr | `msg.con.penalty_applied` | `/groups/{g}/contributions/{c}` |
| EV-CON-12 | Income split executed | Income arrived and rule applied; the item states the rounding amount credited to Gereo when it is above zero (decision D5) | Holders of Wallet: view history | I | Low | None | `msg.con.split_executed` | `/groups/{g}/ledger` |
| EV-CON-13 | Split rule changed | Rule edited | Members | I, P | Normal | None | `msg.con.split_changed` | `/groups/{g}/split-rules` |
| EV-CON-14 | Split failed | A split run could not complete (CON-15); says what moved and what did not | Holders of Wallet: edit rules | I, P, S-fb | Important | Gr | `msg.con.split_failed` | `/groups/{g}/split-rules` |

### SPD

Project expenses use the same events with the project name added to the text. Under decisions D1 and D4, approvals (EV-SPD-01 to EV-SPD-06) exist only for spending below the vote threshold; above it the vote events (EV-VOT-01 to EV-VOT-05) authorise the payout and EV-SPD-08 and EV-SPD-09 follow. The payout-delayed notice of SPD-11 is EV-WAL-08.

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-SPD-01 | Approval needed | Expense requested below the vote threshold | Holders of Wallet: approve spend, excluding the requester (decision D1) | I, P, S-fb | Important | Gr | `msg.spd.approval_needed` | `/groups/{g}/approvals/{a}` |
| EV-SPD-02 | Approval reminder | Not acted on after one day, once | Approvers who have not acted | I, P, S-fb | Important | Gr | `msg.spd.approval_reminder` | `/groups/{g}/approvals/{a}` |
| EV-SPD-03 | Approval progress | An approver approves | The requester | I, P | Normal | None | `msg.spd.approval_progress` | `/groups/{g}/approvals/{a}` |
| EV-SPD-04 | Request approved | Required approvals reached, below the vote threshold | Requester and approvers | I, P | Normal | None | `msg.spd.approved` | `/groups/{g}/approvals/{a}` |
| EV-SPD-05 | Request rejected | Approver rejects, with reason | The requester | I, P | Normal | None | `msg.spd.rejected` | `/groups/{g}/approvals/{a}` |
| EV-SPD-06 | Approvals voided | Request or permission changed | Requester and earlier approvers | I, P, S-fb | Important | Gr | `msg.spd.approvals_voided` | `/groups/{g}/approvals/{a}` |
| EV-SPD-07 | Vote required | Amount above the vote threshold; the vote replaces approvers (decision D4) | Requester and holders of Vote: create | I, P | Normal | None | `msg.spd.vote_required` | `/groups/{g}/approvals/{a}` |
| EV-SPD-08 | Payout sent | Payout confirmed | Requester, and the approvers or voters who authorised it | I, P | Normal | None | `msg.spd.payout_sent` | `/wallets/{w}/tx/{t}` |
| EV-SPD-09 | Payout failed or needs attention | Provider failure; says whether money moved | Requester, and the approvers or voters who authorised it | I, P, S-fb | Important | Gr | `msg.spd.payout_failed` | `/wallets/{w}/tx/{t}` |
| EV-SPD-10 | Insufficient funds | Request exceeds balance | The requester | I | Normal | None | `msg.spd.insufficient_funds` | `/groups/{g}/approvals/{a}` |
| EV-SPD-11 | Request expired | Deadline passed with no decision | The requester | I, P | Normal | None | `msg.spd.expired` | `/groups/{g}/approvals/{a}` |
| EV-SPD-12 | Freeze applied, for the holders who can lift it | Emergency freeze of a group wallet (SPD-15) | Holders of Wallet: freeze and Wallet: approve spend | I, P, S-d | Critical | Pl | `msg.spd.freeze_applied` | `/wallets/{w}` |
| EV-SPD-13 | Freeze applied, for other members | Emergency freeze of a group wallet | Holders of Wallet: view balance, other than those in EV-SPD-12 | I, P | Normal | None | `msg.spd.freeze_applied_members` | `/wallets/{w}` |
| EV-SPD-14 | Freeze lifted | Two distinct holders of Wallet: approve spend lift the freeze | Holders of Wallet: view balance | I, P | Normal | None | `msg.spd.freeze_lifted` | `/wallets/{w}` |
| EV-SPD-15 | Spending cap blocked a request | A request would pass the cap (SPD-14) | The requester; holders of Wallet: edit rules | I | Normal | None | `msg.spd.cap_blocked` | `/groups/{g}/approvals/{a}` |

### VOT

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-VOT-01 | Vote opened | Vote created | Eligible voters | I, P, S-fb | Important | Gr | `msg.vot.opened` | `/groups/{g}/votes/{v}` |
| EV-VOT-02 | Vote closes soon (first notice) | Scheduled before close | Eligible voters who have not voted | I, P, S-fb | Important | Gr | `msg.vot.closing_soon` | `/groups/{g}/votes/{v}` |
| EV-VOT-03 | Vote closes very soon (money decisions) | Scheduled shortly before close | Voters who have not voted | I, P, S-fb | Important | Gr | `msg.vot.closing_now` | `/groups/{g}/votes/{v}` |
| EV-VOT-04 | Vote result | Vote closes with quorum; for a passed money vote the text says the payment starts (decision D4) | Voters and group | I, P | Normal | None | `msg.vot.result` | `/groups/{g}/votes/{v}` |
| EV-VOT-05 | Quorum not met | Vote closes without quorum, including a money vote with fewer than two distinct voters other than the requester (decision D4) | Eligible voters | I, P, S-fb | Important | Gr | `msg.vot.no_quorum` | `/groups/{g}/votes/{v}` |
| EV-VOT-06 | Vote extended | Extension action logged | Eligible voters | I, P | Normal | None | `msg.vot.extended` | `/groups/{g}/votes/{v}` |
| EV-VOT-07 | Guest vote link | Guest voter invited | Guest voter | S-d | Important | Gr | `msg.vot.guest_link` | `/v/{token}` |
| EV-VOT-08 | Guest vote received | Guest ballot counted | Guest voter | S-d | Important | Gr | `msg.vot.guest_receipt` | None |
| EV-VOT-09 | Queued answer arrived too late | Offline vote reached server after close | The voter | I, P, S-fb | Important | Gr | `msg.vot.too_late` | `/groups/{g}/votes/{v}` |
| EV-VOT-10 | Decision logged | Result written to decision log | Members | I | Low | None | `msg.vot.decision_logged` | `/groups/{g}/decisions` |

### PRJ

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-PRJ-01 | Project created | Project saved | Holders of Project: view | I | Low | None | `msg.prj.created` | `/projects/{p}` |
| EV-PRJ-02 | Task assigned | Task owner set | The assignee | I, P | Normal | None | `msg.prj.task_assigned` | `/projects/{p}/tasks` |
| EV-PRJ-03 | Task due soon | Scheduled before the due date | The assignee | I, P | Normal | None | `msg.prj.task_due` | `/projects/{p}/tasks` |
| EV-PRJ-04 | Milestone completed | Milestone marked done | Project members | I | Low | None | `msg.prj.milestone_done` | `/projects/{p}` |
| EV-PRJ-05 | Budget line near its limit | Spent reaches the alert level | Holders of Project: manage budget | I, P | Normal | None | `msg.prj.budget_near` | `/projects/{p}/budget` |
| EV-PRJ-06 | Decision added manually | Decision entry saved | Project members | I | Low | None | `msg.prj.decision_added` | `/projects/{p}/decisions` |
| EV-PRJ-07 | Project closed | Close action | Project members | I, P | Normal | None | `msg.prj.closed` | `/projects/{p}` |

### EVT

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-EVT-01 | Event invitation | Event created | Invitees | I, P | Normal | None | `msg.evt.invited` | `/groups/{g}/events/{e}` |
| EV-EVT-02 | Reminder one day before | Scheduled | Invitees who have not declined | I, P, S-fb | Important | Gr | `msg.evt.reminder_24h` | `/groups/{g}/events/{e}` |
| EV-EVT-03 | Reminder two hours before | Scheduled | Confirmed attendees and members without the app | I, P, S-fb | Important | Gr | `msg.evt.reminder_2h` | `/groups/{g}/events/{e}` |
| EV-EVT-04 | RSVP deadline near | Scheduled | Invitees who have not answered | I, P | Normal | None | `msg.evt.rsvp_deadline` | `/groups/{g}/events/{e}` |
| EV-EVT-05 | Event changed | Date, time or place edited | Invitees not declined | I, P, S-fb | Important | Gr | `msg.evt.changed` | `/groups/{g}/events/{e}` |
| EV-EVT-06 | Event cancelled | Cancelled | Invitees not declined | I, P, S-fb | Important | Gr | `msg.evt.cancelled` | `/groups/{g}/events/{e}` |
| EV-EVT-07 | RSVP saved | Answer recorded | The responder | I | Low | None | `msg.evt.rsvp_saved` | `/groups/{g}/events/{e}` |
| EV-EVT-08 | Event payment due | Event with a contribution, person going and unpaid | The person | I, P, S-fb | Important | Gr | `msg.evt.payment_due` | `/groups/{g}/events/{e}/pay` |

### ANN

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-ANN-01 | Announcement published | A holder of Publication: announce to group publishes | Members | I, P | Normal | None | `msg.ann.published` | `/groups/{g}/announcements/{a}` |
| EV-ANN-02 | Urgent announcement | Publisher marks urgent (limited per month, parameter) | Members | I, P, S-fb | Important | Gr | `msg.ann.urgent` | `/groups/{g}/announcements/{a}` |
| EV-ANN-03 | Special contribution campaign launched | Campaign opened | Members | I, P | Normal | None | `msg.ann.campaign_launched` | `/groups/{g}/campaigns/{a}` |
| EV-ANN-04 | Campaign contribution received | Contribution confirmed | Campaign organisers | I (batched) | Low | None | `msg.ann.campaign_contribution` | `/groups/{g}/campaigns/{a}` |
| EV-ANN-05 | Campaign closing soon | Scheduled before deadline | Members who have not contributed | I, P | Normal | None | `msg.ann.campaign_closing` | `/groups/{g}/campaigns/{a}` |
| EV-ANN-06 | Campaign goal reached | Goal met | Members | I, P | Normal | None | `msg.ann.campaign_goal_reached` | `/groups/{g}/campaigns/{a}` |
| EV-ANN-07 | Use-of-funds report published | Report saved | Contributors | I, P | Normal | None | `msg.ann.report_published` | `/groups/{g}/campaigns/{a}/report` |
| EV-ANN-08 | Announcement removed | A holder of Publication: moderate removes | The author | I, P | Normal | None | `msg.ann.removed` | `/groups/{g}/announcements/{a}` |

### NTF, OPS and cross-cutting

| ID | Event | Trigger | Audience | Channel | Priority | SMS payer | Message key | Deep link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EV-NTF-01 | Push enabled test | First push on a device | The person | P | Normal | None | `msg.ntf.push_enabled` | `/settings/notifications` |
| EV-NTF-02 | SMS turned off confirmation | Opt-out | The person | S-d | Critical | Pl | `msg.ntf.sms_optout_confirm` | None |
| EV-NTF-03 | SMS turned on confirmation | Re-opt-in | The person | S-d | Critical | Pl | `msg.ntf.sms_optin_confirm` | None |
| EV-NTF-04 | SMS could not reach you | Permanent SMS failure | The person | I | Normal | None | `msg.ntf.sms_unreachable` | `/account/phone` |
| EV-NTF-05 | Group SMS allowance low | Warning level reached | Holders of Group: set notification settings | I, P | Normal | None | `msg.ntf.sms_allowance_low` | `/groups/{g}/sms` |
| EV-NTF-06 | Group SMS allowance used up | Allowance exhausted | Holders of Group: set notification settings | I, P | Important | None | `msg.ntf.sms_allowance_empty` | `/groups/{g}/sms` |
| EV-NTF-07 | Batch summary | More than the batch threshold of similar items | The recipient | I, P, S-fb (types that allow it) | As the items | As the items | `msg.ntf.batch_summary` | Filtered list |
| EV-NTF-08 | Weekly digest | Digest day | Members with digest on (push only if the person has a push device) | I, P | Normal | None | `msg.ntf.weekly_digest` | `/notifications/digest` |
| EV-OPS-01 | Support ticket updated | Operator replies or status changes (OPS-07) | The requester | I, P | Normal | None | `msg.ops.ticket_updated` | `/support/{id}` |
| EV-OPS-02 | Payment provider incident | Provider outage declared (OPS-08) | Affected members | I, P | Important | None | `msg.ops.provider_incident` | `/status` |

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| NTF-01 | See everything that happened and open it in one tap | P0 | ACC-02, ACC-03, XCT-01, XCT-04, XCT-14, catalogue |
| NTF-02 | Know whether the message reached the person | P1 | NTF-01, NTF-05, NTF-12, CON-07, VOT-07 |
| NTF-03 | Ask to send notifications only after the app has proved useful | P0 | ACC-02, ACC-11, WAL-01, CON-04, VOT-04, XCT-05 |
| NTF-04 | Choose what I get and how | P0 | NTF-03, NTF-10, NTF-14 |
| NTF-05 | Push first, then SMS only if nobody opened the push | P0 | NTF-03, NTF-04, NTF-06, NTF-07, NTF-10, NTF-12, NTF-13 |
| NTF-06 | Keep SMS cost under control and say who pays | P0 | GRP-07, GRP-08, SPD-01, SPD-02, SPD-05, SPD-09, SPD-10, OPS-12, NTF-05, NTF-12 |
| NTF-07 | Write every SMS so it fits in one short message, in three languages | P0 | XCT-12, XCT-14, NTF-12 |
| NTF-08 | Turn a flood into one message | P1 | NTF-01, NTF-05, NTF-06, NTF-07 |
| NTF-09 | Do not wake people at night | P1 | NTF-04, NTF-05, NTF-12, XCT-03 |
| NTF-10 | Stop SMS any time, and restart it on my terms | P0 | NTF-04, NTF-05, NTF-12, ACC-02, ACC-13 |
| NTF-11 | Reach people who do not have the app | P0 | GRP-03, VOT-06, ACC-16, NTF-05, NTF-06, NTF-07, NTF-13 |
| NTF-12 | Let operators see what was sent, and why | P0 | OPS-01, OPS-06, OPS-09, OPS-12, NTF-05, NTF-13 |
| NTF-13 | When the SMS cannot be delivered | P0 | NTF-05, NTF-12, ACC-05, OPS-12 |
| NTF-14 | One calm summary a week | P2 | NTF-01, NTF-04, GRP-06, CON-03, CON-16, VOT-13, EVT-08 |

Totals: 10 P0, 3 P1, 1 P2. The event catalogue has 118 rows across ACC, WAL, RUL, GRP, CON, SPD, VOT, PRJ, EVT, ANN and the NTF and OPS rows.

## Cross-epic dependencies

Every ID below was checked against the story files in this folder.

- ACC: ACC-02 (sign-up with phone and OTP; the OTP message `msg.acc.otp`), ACC-05 (new phone or SIM change), ACC-06 (profile language), ACC-07 and ACC-09 (tiers and verification results), ACC-11 (connected devices), ACC-13 (terms, privacy notice and consent text used by NTF-02, NTF-04 and NTF-10), ACC-16 (open an invite or vote link without an account, used by NTF-11). ACC-15 account deletion sends its own start and finish messages (`msg.acc.delete_started`, `msg.acc.delete_done`) that this catalogue does not yet list.
- WAL: WAL-06 and WAL-07 (deposit pending, confirmed, failed), WAL-09 to WAL-11 (withdrawal and its end states), WAL-08 (provider unavailable, payout queued), WAL-12 and WAL-13 (transfers), WAL-14 (receipts), WAL-16 (export), WAL-20 (reconciliation line, wallet needs attention).
- RUL: RUL-07 (rule firing and chains), RUL-06 (loop and chain depth stops), RUL-09 (spending cap), RUL-10 (goal), RUL-11 (low balance alert), RUL-12 (rule log), RUL-13 (group wallet rule changes).
- GRP: GRP-03 (invite SMS), GRP-04 (accept and decline events), GRP-06 (digest and home counters), GRP-07 and GRP-08 (bundles, grant and revoke alerts), GRP-12 (spending policy changes and loosening), GRP-14 (approver shortage), GRP-15 (wallet created), GRP-16 and GRP-17 (leave, removal), GRP-18 (rules text), GRP-19 and GRP-20 (archive, delete).
- CON: CON-04 (pay), CON-05 (pending and failed), CON-07 (manual reminder), CON-08 (automatic reminders), CON-09 (late fee), CON-10 (exemption), CON-14 (split execution), CON-15 (split failure), CON-16 (ledger view).
- SPD: SPD-04 (approval inbox and its notifications), SPD-07 (voided approvals), SPD-10 and SPD-11 (payout and failure), SPD-14 (cap), SPD-15 (freeze); the SMS allowance top-up is an SPD expense request with Gereo as payee (NTF-06).
- VOT: VOT-03 (passed vote starts the payment), VOT-06 (share link and guest page), VOT-07 (remind people who have not voted), VOT-09 (result), VOT-10 (too few votes), VOT-13 (decision log), VOT-14 (decision recorded outside the app), VOT-18 (poor connection, too-late answers).
- PRJ: PRJ-04 (tasks and milestones), PRJ-03 (budget alert), PRJ-05 (decisions and requests on the project), PRJ-09 (close).
- EVT: EVT-01 (creation), EVT-03 (invitations), EVT-04 (RSVP), EVT-05 (automatic reminders, push then SMS), EVT-06 and EVT-07 (change and cancellation).
- ANN: ANN-01 (publish), ANN-03 (withdraw, moderate), ANN-04 to ANN-08 (campaign events and report); the urgent flag and its monthly limit are an ANN parameter that must stay below the group allowance.
- XCT: XCT-12 owns the 160-character lint that NTF-07 relies on, and the two must say the same thing; XCT-14 (strings as keys, fallback), XCT-01 (language), XCT-03 (time), XCT-04 (offline read), XCT-05 (queue labels), XCT-07 (data saver), XCT-10 (accessibility).
- OPS: OPS-01 (access catalogue; NTF-12 asks for `view notification log` and `reveal message text`), OPS-06 and OPS-07 (tickets), OPS-08 (provider incident), OPS-09 (audit search), OPS-10 (flag holds send their own messages that this catalogue does not yet list), OPS-12 (SMS spend and delivery dashboard, alerts and aggregator rates).

## Open questions

1. **Closed: who pays for SMS.** The platform pays Pl-class SMS. Each group gets a monthly Gr-class allowance sized by member count, paid by the platform in the MVP, and may top up from a group wallet through an expense request (NTF-06). Evidence: CA section 7 (charge by group size or SMS volume, never gate core behaviour).
2. **Open, needs the SMS aggregator: rates, sender ID registration, two-way SMS and keyword support, delivery reports, a second provider** (CA section 10 blocker 4; R04 section 14.6 risk 10). Default used: one aggregator behind the adapter, working values in the parameter table, no price shown to groups.
3. **Open, needs a lawyer: consent.** Legal basis and wording for SMS consent in Madagascar, and whether Critical SMS may ignore an opt-out (NTF-04, NTF-10). Default used: SMS for important items is on at sign-up with the consent text in ACC-13, opt-out in the app is always available, Critical SMS continue.
4. **Closed: windows.** Starting values are in the parameter table (NTF-05, NTF-08, NTF-09). Voters on money decisions cannot opt to be woken in the MVP.
5. **Open, needs the aggregator and field interviews: feature phones.** Whether a basic-phone user can vote or confirm by replying to an SMS or by USSD (R07 section 4, R-SMS3). Default used: no reply voting; the light web page or the group's named contact (NTF-11).
6. **Closed: language fallback.** Recipient language, then group language, then Malagasy (NTF-07, NTF-11).
7. **Open, needs a native Malagasy reviewer: Malagasy SMS spelling.** Default used: no circumflex letters, ASCII opt-out keywords STOP and ARRET plus a reviewed Malagasy word (NTF-07, NTF-10).
8. **Closed: opened tracking and privacy.** Tracked for sending decisions, shown to a sender only as a count, never per name, and disclosed in the privacy notice (NTF-02).
9. **Closed: permission names.** SMS settings use Group: set notification settings (decision D2). Operators use `view notification log` and `reveal message text`, to be added to the OPS-01 catalogue.
10. **Closed: push on low-end phones.** Feature detection at run time; no support means SMS for Important items (NTF-03). The share of members with working push is measured in the first cohort.
11. **Closed: catalogue ownership.** NTF owns this table. Another epic adds or changes a row by a change to this file, reviewed by the NTF owner. Moving an event into the Important class needs a cost check against OPS-12 because it adds SMS. The table is frozen at the start of each release build and thereafter changes only through that review.
12. **Open, needs field research: evidence gaps.** Reminder effectiveness in this population is unknown (R07 section 8.8 cites Bolivia, Peru, the Philippines and Uganda, not Madagascar). Default used: the starting windows; A/B test timing and wording in the first cohort.
13. **Closed: key and parameter naming across epics.** NTF owns one key form, `msg.<epic>.<event>` with underscores and variants `.push`, `.sms`, `.inapp`, and one parameter family, `ntf.*`. Other epics rename their keys to the catalogue keys and remove their own waits and caps (`sms_fallback_delay` in SPD, `EVENT_SMS_WAIT` in EVT, `ANN_SMS_WAIT` in ANN, `ntf.event.*` keys in EVT and ANN). They may keep only the scheduling offsets of their own reminders.
14. **Closed: event overlap.** One SMS ladder exists, defined in NTF-05. CON-08, SPD-04, VOT-07, EVT-05 and the ANN stories may choose only the `ntf.sms_window.<type>` value for their type and the times at which a reminder is scheduled; they may not define a second wait, cap or retry rule. Where a rule differs, the stricter one is kept (one SMS per event per person, no SMS for something already done).
