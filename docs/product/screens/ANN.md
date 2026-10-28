# ANN: screen and state inventory

Source: `docs/product/stories/ANN.md` (8 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-ANN-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-ANN-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Permission names follow conventions section 7. Announcement statuses: Published, Withdrawn, Hidden (Pinned and Edited are markers). Campaign statuses: Open, Closed, Refunding, Refunded. Report statuses: Not due, Due, Overdue, Published. A contribution is an internal transfer (WAL-13), Confirmed at once or Failed, never Pending. Announcements and campaigns are online only for sending; drafts are local drafts `Draft, not sent` (XCT-05 Table B), never sent without a tap.

---

### ANN-01 Publish an announcement to the group

**Story:** ANN-01 Publish an announcement to the group

**Surfaces:**
- SCR-ANN-01 | Announcement form (title up to `ANN_TITLE_MAX_LENGTH`, plain-text message up to `ANN_MAX_LENGTH` with visible character count, `Urgent` toggle; whole group audience not changeable; no image, file or translation field) | page | Member holding `Publication: announce to group` | Entry: "New announcement" on the group home; Edit (ANN-03); resume a local draft | Exit: SCR-ANN-02
- SCR-ANN-02 | Announcement preview (as members will see it, with the publisher's name and the time; button `ann.publish.button`) | page (flow step) | Publisher | Entry: continue from SCR-ANN-01 | Exit: SCR-ANN-07
- SCR-ANN-03 | Urgent toggle (off by default; disabled with `ann.urgent.limit`; `ann.urgent.sms_paused`) | inline (on SCR-ANN-01) | Publisher | Entry: SCR-ANN-01 | Exit: none
- SCR-ANN-04 | Local draft marker `Draft, not sent` | inline (on SCR-ANN-01 and in the group home entry point) | Publisher on that phone | Entry: leave or lose connection with unsent text | Exit: SCR-ANN-01
- SCR-ANN-05 | Notification: announcement published (`msg.ann.published`, push and in-app, never SMS for a normal announcement) | notification | All members | Entry: system on publish | Exit: SCR-ANN-08
- SCR-ANN-06 | Notification: urgent announcement (`msg.ann.urgent`, EV-ANN-02, class Gr, SMS fallback of NTF-05) | notification | Members who did not open the push within the NTF window or have no device, within the group allowance and the person's daily cap | Entry: system on an Urgent publish | Exit: SCR-ANN-08
- SCR-ANN-07 | Announcements list of the group (pinned first, then newest first); the full states are under ANN-02 | page (inline section of the group home) | Member holding `Group: view group` | Entry: group home, push, "Announcements" | Exit: SCR-ANN-08, SCR-ANN-01

**States per surface:**
- SCR-ANN-01 default: empty title and message; counter visible; Urgent off.
- SCR-ANN-01 validation: empty title or message over the limit; inline message (key not specified).
- SCR-ANN-01 publishing: button disabled while publishing; double tap creates one announcement.
- SCR-ANN-01 failure: Retry shown, text kept.
- SCR-ANN-01 offline: draft kept as a local draft `Draft, not sent`; never published silently; the person taps publish again once online; nothing queued.
- SCR-ANN-01 permission hidden: person without `Publication: announce to group`; no "New announcement" button; a line names the missing permission and who can grant it (`ann.error.no_permission`).
- SCR-ANN-01 long text and accessibility: visible labels, 48 by 48 dp targets, typed text keeps its language, interface follows the viewer's language.
- SCR-ANN-02 default: preview with publisher name and time; button names the action.
- SCR-ANN-03 off: normal announcement, push and in-app only.
- SCR-ANN-03 on: SMS fallback of NTF-05 applies (`msg.ann.urgent`).
- SCR-ANN-03 limit: group already used the effective Urgent cap this month; disabled with `ann.urgent.limit`.
- SCR-ANN-03 allowance used up: shows `ann.urgent.sms_paused`; the announcement still publishes by push and in-app.
- SCR-ANN-04 shown: draft present; text kept on the phone.
- SCR-ANN-05 default: sent to all members (push and in-app).
- SCR-ANN-06 default: SMS only after the NTF wait and within the allowance and daily cap.
- SCR-ANN-07 new: the announcement appears at the top of the list for everyone with `Group: view group`.

**Criteria map:**
- AC 1: SCR-ANN-01 default and SCR-ANN-03 off (fields, limits, count, no image or file or translation).
- AC 2: SCR-ANN-02 default (`ann.publish.button`).
- AC 3: SCR-ANN-05 default and SCR-ANN-06 default (`msg.ann.published`, `msg.ann.urgent`).
- AC 4: SCR-ANN-03 limit and allowance used up (`ann.urgent.limit`, `ann.urgent.sms_paused`).
- AC 5: SCR-ANN-07 new.
- AC 6: SCR-ANN-01 permission hidden (`ann.error.no_permission`).
- AC 7: SCR-ANN-01 publishing, failure, offline and SCR-ANN-04 shown.
- AC 8: SCR-ANN-01 validation and publishing (double tap one announcement).
- AC 9: no UI, system rule (audit of publisher, time, text, Urgent flag, people notified per channel; visible to `Group: view audit log`).
- AC 10: SCR-ANN-01 long text and accessibility.

**Objects and fields:** Announcement (title, message, Urgent flag, publisher, time, status); Group; Notification; Audit entry.

**Open points:**
- Keys for the validation messages and the character counter text: not specified in the story.
- The effective Urgent cap uses `ntf.group_sms_allowance`; where does the person see how many Urgent uses remain this month? Not specified in the story.
- Does the campaign launch announcement (ANN-04 AC 4) count against the Urgent cap, and is it Urgent? Not specified in the story.
- Quiet hours for `msg.ann.published` and `msg.ann.urgent`: governed by NTF-09, but is an Urgent announcement a Critical event (conventions 11.8 lists no ANN item)? Not specified in the story.

---

### ANN-02 Read the group's announcements and see what is new

**Story:** ANN-02 Read the group's announcements and see what is new

**Surfaces:**
- SCR-ANN-08 | Announcement page (full text on its own page, not truncated; publisher, time, Urgent, Pinned and Edited markers; state view for Withdrawn and Hidden) | page | Member holding `Group: view group`; text of Withdrawn or Hidden also to the publisher and holders of `Publication: moderate` | Entry: SCR-ANN-07, push notification (even when old), deep link | Exit: SCR-ANN-07
- SCR-ANN-09 | Unread marker and count (text marker on rows, count on the group home and group navigation, "Mark all as read") | inline (on SCR-ANN-07 and the group home) | Member | Entry: SCR-ANN-07, group home | Exit: SCR-ANN-07
- SCR-ANN-10 | Read count line (`ann.list.seen_count`, for example 18 of 25) | inline (on SCR-ANN-08) | The publisher and holders of `Publication: announce to group` | Entry: SCR-ANN-08 | Exit: none

**States per surface:**
- SCR-ANN-07 default: pinned first (ANN-03), then newest first; row shows title, first lines, publisher, time, `Urgent` marker with icon and text; Withdrawn and Hidden not in the list.
- SCR-ANN-07 empty: `ann.list.empty`, with a "New announcement" button only for people who may publish.
- SCR-ANN-07 loading: skeleton rows.
- SCR-ANN-07 offline: from cache with `Last synced`; unread state kept; new items appear when the connection returns.
- SCR-ANN-07 left group: never shows announcements of a group the person has left; no notifications.
- SCR-ANN-07 accessibility: unread marker not colour alone; reads in order; reflows at 320 px.
- SCR-ANN-08 Published: full text; read counts only for permitted viewers.
- SCR-ANN-08 Withdrawn: ordinary members see only the state (`ann.state.withdrawn`); the publisher and `Publication: moderate` holders also see the text.
- SCR-ANN-08 Hidden: ordinary members see `ann.state.hidden`; the publisher and moderators also see the text; publisher sees the reason.
- SCR-ANN-08 old: opening from a push works even for an old announcement.
- SCR-ANN-08 offline: readable once cached, no connection needed.
- SCR-ANN-08 long text: shown in full.
- SCR-ANN-09 default: unread row marker with text; opening marks as read; "Mark all as read" in one tap.
- SCR-ANN-10 default: count only, never names; names of people who have not read are never shown to anyone.
- SCR-ANN-10 hidden: ordinary members do not see it.

**Criteria map:**
- AC 1: SCR-ANN-07 default.
- AC 2: SCR-ANN-09 default.
- AC 3: SCR-ANN-08 Withdrawn, Hidden, old (`ann.state.withdrawn`, `ann.state.hidden`).
- AC 4: SCR-ANN-10 default and hidden (`ann.list.seen_count`).
- AC 5: SCR-ANN-07 empty (`ann.list.empty`).
- AC 6: SCR-ANN-07 offline and SCR-ANN-08 offline.
- AC 7: SCR-ANN-07 loading and SCR-ANN-08 long text.
- AC 8: SCR-ANN-07 left group.
- AC 9: SCR-ANN-07 accessibility.

**Objects and fields:** Announcement (title, message, status, pinned, edited, Urgent); Read state; Membership.

**Open points:**
- A person who left the group and opens an old push: what do they see (forbidden or not found)? Story says no notifications after leaving; the deep-link state is not specified.
- Read counts: "any holder of `Publication: announce to group`" sees them; whether the count includes the publisher and counts members who joined after publication is not specified in the story.
- Is the Hidden reason shown to the publisher on the announcement page or only in `msg.ann.removed`? ANN-03 says the publisher sees the reason; placement not specified.
- Key for "Mark all as read" and the unread marker text: not specified in the story.

---

### ANN-03 Pin, correct or withdraw an announcement

**Story:** ANN-03 Pin, correct or withdraw an announcement

**Surfaces:**
- SCR-ANN-11 | Announcement menu (Pin, Unpin, Edit, Withdraw, Hide, labelled with words) | sheet | Holders of `Publication: announce to group` (pin, unpin any; edit and withdraw one's own); `Publication: moderate` (hide any) | Entry: menu on SCR-ANN-08 | Exit: SCR-ANN-08, SCR-ANN-01 (edit)
- SCR-ANN-12 | Pin limit dialog (`ann.pin.limit`, choose which to unpin) | modal | Holder of `Publication: announce to group` | Entry: Pin beyond `ANN_MAX_PINNED` | Exit: SCR-ANN-07
- SCR-ANN-13 | Hide dialog (required reason) | modal | Holder of `Publication: moderate` | Entry: Hide in SCR-ANN-11 | Exit: SCR-ANN-08
- SCR-ANN-14 | Edited marker and earlier text (`Edited {time}`, `ann.state.edited`, one tap shows the earlier text) | inline (on SCR-ANN-08) | Everyone who can read the announcement | Entry: SCR-ANN-08 | Exit: none
- SCR-ANN-15 | Notification: announcement edited (`msg.ann.edited`, only if the editor chose `Tell the group`) | notification | Group members | Entry: system on a saved edit | Exit: SCR-ANN-08
- SCR-ANN-16 | Notification: announcement removed (`msg.ann.removed`, EV-ANN row for the moderator hide) | notification | The publisher | Entry: system on hide | Exit: SCR-ANN-08
- SCR-ANN-17 | Action conflict message (latest saved version, conflict message) | inline (on SCR-ANN-08) | Second actor | Entry: simultaneous action | Exit: SCR-ANN-08

Edit reuses SCR-ANN-01 in edit mode with the `Tell the group` choice.

**States per surface:**
- SCR-ANN-11 pin: every holder can pin any announcement; it goes to the top of the list and the group home; limited to `ANN_MAX_PINNED`; Unpin returns it to its date position.
- SCR-ANN-11 edit: publisher only, no time limit.
- SCR-ANN-11 withdraw: publisher only; the announcement leaves the list and shows `ann.state.withdrawn` with the name where opened from a link; text kept in the audit log.
- SCR-ANN-11 hide: needs `Publication: moderate`; required reason; status Hidden.
- SCR-ANN-11 hidden actions: actions the person has no right to are not shown; not specified whether a reason line shows.
- SCR-ANN-11 offline: pin, edit, withdraw and hide blocked with an explanation (key not specified).
- SCR-ANN-12 default: asks which pinned announcement to unpin.
- SCR-ANN-13 default: reason required; ordinary members then see `ann.state.hidden`; publisher sees the reason.
- SCR-ANN-14 default: `Edited {time}` to everyone; earlier text one tap away; original text in the audit record never changed.
- SCR-ANN-15 default: sent only on `Tell the group`; otherwise no notification.
- SCR-ANN-16 default: publisher receives `msg.ann.removed` with the reason.
- SCR-ANN-17 default: latest saved version and a conflict message; no silent overwrite.
- SCR-ANN-08 pinned: pinned state by icon and text.

**Criteria map:**
- AC 1: SCR-ANN-11 pin and SCR-ANN-12 default (`ann.pin.limit`, `ANN_MAX_PINNED`).
- AC 2: SCR-ANN-11 edit, SCR-ANN-14 default, SCR-ANN-15 default (`ann.state.edited`, `msg.ann.edited`).
- AC 3: SCR-ANN-11 withdraw (`ann.state.withdrawn`).
- AC 4: SCR-ANN-13 default and SCR-ANN-16 default (Hidden, `msg.ann.removed`).
- AC 5: SCR-ANN-14 default (original text audit record never changed).
- AC 6: SCR-ANN-11 offline.
- AC 7: SCR-ANN-17 default.
- AC 8: no UI, system rule (audit of actor, time, reason, old and new text; visible to `Group: view audit log`).
- AC 9: SCR-ANN-08 pinned and SCR-ANN-11 (icon and text, labelled actions).

**Objects and fields:** Announcement (pinned flag, edited flag, status, edit history, hide reason); Audit entry; Notification.

**Open points:**
- `msg.ann.edited` and `msg.ann.campaign_closed` and others are "new rows to add" to NTF; key and EV IDs for them are not specified in the story.
- Is a confirmation shown before Withdraw? Not specified in the story.
- Can a moderator who hides an announcement later un-hide it? Not specified in the story.
- The `Withdrawn` state shows "with the name": whose name (publisher's)? Not specified in the story.
- Pin ordering among several pinned announcements: not specified in the story.

---

### ANN-04 Start a special contribution campaign inside the group

**Story:** ANN-04 Start a special contribution campaign inside the group

**Surfaces:**
- SCR-ANN-18 | Campaign form (name, short reason, goal in whole ariary, deadline absolute and relative in Madagascar time, destination wallet, optional suggested amount per member, unmet-goal choice) | page | Member holding `Publication: announce to group` and `Wallet: initiate spend` on the destination wallet | Entry: "New campaign" on the group home; resume a local draft | Exit: SCR-ANN-21
- SCR-ANN-19 | Destination wallet list (group wallets with no active outgoing rule; others unavailable with `ann.error.wallet_has_rules`) | inline (on SCR-ANN-18) | Same as SCR-ANN-18 | Entry: wallet field | Exit: stays on SCR-ANN-18
- SCR-ANN-20 | Unmet-goal choice (keep the money and use it as described, or give it back to each contributor; mandatory, no default; `ann.rule.keep`, `ann.rule.refund`) | inline (on SCR-ANN-18) | Same as SCR-ANN-18 | Entry: SCR-ANN-18 | Exit: stays on SCR-ANN-18
- SCR-ANN-21 | Campaign review step (campaign as members will see it, unmet-goal rule in plain words, `ann.reserve.note`, "nobody pays more than the amount they enter", refund destination and net amount for a mobile-money refund; button `Start the campaign`) | page (flow step) | Same as SCR-ANN-18 | Entry: continue from SCR-ANN-18 | Exit: SCR-ANN-24
- SCR-ANN-22 | Notification: campaign launched (`msg.ann.campaign_launched`, push and in-app; SMS variant only by the NTF-05 ladder within the group allowance; also reused as an update announcement for an extension) | notification | Members | Entry: system on start or on extension | Exit: SCR-ANN-24
- SCR-ANN-23 | Extend deadline and add to description (extension needs a reason; description appended, never rewritten) | sheet | Holder of both permissions | Entry: action on SCR-ANN-24 after the first confirmed contribution | Exit: SCR-ANN-24

The local draft marker is SCR-ANN-04 reused for the campaign form.

**States per surface:**
- SCR-ANN-18 default: all fields; optional suggested amount; deadline within `CAMPAIGN_MIN_DURATION` (3 days) and `CAMPAIGN_MAX_DURATION` (90 days).
- SCR-ANN-18 validation: goal of zero or below `CAMPAIGN_MIN_CONTRIBUTION`, deadline outside the limits, no unmet-goal choice; inline messages (keys not specified).
- SCR-ANN-18 saving: button disabled while saving.
- SCR-ANN-18 failure: all fields kept; Retry shown.
- SCR-ANN-18 offline: local draft `Draft, not sent` (SCR-ANN-04), never sent without a tap, does not publish; nothing queued.
- SCR-ANN-18 permission: a person without both permissions on the chosen wallet cannot choose it; the screen names the missing permission.
- SCR-ANN-18 hidden: person without `Publication: announce to group`; "New campaign" not offered (key not specified).
- SCR-ANN-19 default: only group wallets with no active outgoing rule are selectable.
- SCR-ANN-19 unavailable: a wallet with such a rule shown as unavailable with `ann.error.wallet_has_rules`; while the campaign is Open or Refunding, activating an outgoing rule on that wallet is refused (RUL-07, RUL-13).
- SCR-ANN-19 none: group has no eligible wallet; precondition; the group opens a second wallet (GRP-15, WAL-01); the empty message is not specified.
- SCR-ANN-20 default: two options, no default; shown to contributors before they pay.
- SCR-ANN-20 locked: after the first confirmed contribution, goal, destination wallet and the unmet-goal rule are locked.
- SCR-ANN-21 default: review with the rule in plain words; under the refund rule states where a refund would go (original source wallet, fee 0) and that a mobile-money refund pays its payout fee out of the refund with the net amount shown before paying.
- SCR-ANN-22 default: published automatically as an announcement (ANN-01) on `Start the campaign`.
- SCR-ANN-22 extension: contributors told of an extension by the same key reused as an update announcement, not by SMS.
- SCR-ANN-23 extend: up to `CAMPAIGN_MAX_EXTENSIONS` (2), never beyond `CAMPAIGN_MAX_DURATION` from the start, with a reason.
- SCR-ANN-23 limit: extensions used up or duration cap reached; behaviour and key not specified.
- SCR-ANN-23 description: appended only.

**Criteria map:**
- AC 1: SCR-ANN-18 default.
- AC 2: SCR-ANN-20 default and locked (mandatory, no default, shown before payment).
- AC 3: SCR-ANN-21 default (`ann.rule.keep`, `ann.rule.refund`, `ann.reserve.note`, no tip, refund net amount).
- AC 4: SCR-ANN-22 default (`Start the campaign`, status Open, announcement, `msg.ann.campaign_launched`).
- AC 5: SCR-ANN-20 locked, SCR-ANN-23 extend and description, SCR-ANN-22 extension.
- AC 6: SCR-ANN-19 default and unavailable (`ann.error.wallet_has_rules`).
- AC 7: SCR-ANN-18 saving, failure, offline.
- AC 8: SCR-ANN-18 validation and permission.
- AC 9: no UI, system rule (audit of creation, edits, extension, locked fields; no ledger entry).

**Objects and fields:** Campaign (name, reason, goal, deadline, destination wallet, suggested amount, unmet-goal rule, status, extensions); Wallet (reference); Announcement; Audit entry.

**Open points:**
- ANN-04 reuses `msg.ann.campaign_launched` for extensions, while conventions 11.1 says each message key is emitted by exactly one story and event; is a separate key needed for extension updates? Not specified in the story.
- Does ANN-04 AC 4 say the SMS variant counts against the Urgent cap or the ordinary allowance only? Not specified in the story.
- The empty state when the group has no wallet without an outgoing rule: not specified in the story (precondition only).
- Who may see "New campaign": holders of both permissions only, or does a person with only one see a reason? Story ANN-04 AC 8 names the missing permission on the chosen wallet; the group home entry rule is not specified.
- Where does a campaign appear for a member who is not yet a contributor after the deadline passed (Closed state), and in which list? The campaign list surface is not defined in any ANN story.

---

### ANN-05 Give to a campaign

**Story:** ANN-05 Give to a campaign

**Surfaces:**
- SCR-ANN-24 | Campaign page (campaign, goal, progress, deadline, unmet-goal rule in plain words before the amount field; suggested amount as a visible hint, not preselected; button "Give"; "My contributions"; contributor list; closed and refund states) | page | Member holding `Group: view group`; giving needs `Wallet: deposit` on the destination group wallet | Entry: group home, SCR-ANN-22 notification, announcement, receipt | Exit: SCR-ANN-25, SCR-ANN-29, SCR-ANN-42
- SCR-ANN-25 | Give: amount entry (whole ariary, at least `CAMPAIGN_MIN_CONTRIBUTION`) | page (flow step) | Member | Entry: "Give" on SCR-ANN-24 | Exit: SCR-ANN-26
- SCR-ANN-26 | Give: review (source wallet, amount, fee line 0 Ar, total, balance after, `ann.give.name_visible`, button naming the action and the amount; no tip, no default add-on) | page (flow step) | Member | Entry: SCR-ANN-25 | Exit: PIN screen (ACC-03, with amount and campaign repeated), WAL-13 pause screen, deposit flow (WAL-06), SCR-ANN-27
- SCR-ANN-27 | Give: result (Confirmed or Failed with reference ID) | page (flow step) | Member | Entry: after the PIN | Exit: SCR-ANN-29, SCR-ANN-24

The PIN screen (ACC-03), the pause screen (WAL-13 criterion 3) and the deposit flow (WAL-06, WAL-07, WAL-08) are owned by other epics.

**States per surface:**
- SCR-ANN-24 Open: sees campaign details and "Give".
- SCR-ANN-24 closed: shows `ann.error.closed` and no Give button; no contribution accepted after close.
- SCR-ANN-24 offline: page readable from cache; "Give" disabled with an explanation (money moves, XCT-06).
- SCR-ANN-25 default: amount field; suggested amount hint.
- SCR-ANN-25 below minimum: below `CAMPAIGN_MIN_CONTRIBUTION`; inline message (key not specified).
- SCR-ANN-26 default: one screen with source, amount, fee 0 Ar, total, balance after; the name-visible line says group members will see the member's name; no option to hide the name.
- SCR-ANN-26 short balance: member offered the deposit flow (WAL-06) and returns to the review once the deposit is Confirmed.
- SCR-ANN-26 requirements: member does not meet ACC-07 requirements or exceeds an OPS-11 limit; guided to the step that unlocks it.
- SCR-ANN-26 provider unavailable: during the deposit step handled by WAL-08; the contribution is not created.
- SCR-ANN-26 offline: giving is online only; button disabled with an explanation.
- SCR-ANN-27 Confirmed: one balanced atomic transfer with a reference ID; counts toward progress; income for the destination wallet and reserved until close.
- SCR-ANN-27 Failed: states that no money moved (`ann.receipt.no_money_moved`); next action shown.
- SCR-ANN-27 lost the race: contribution loses the close race; Failed with `ann.error.closed` and no money moves; a deposit that confirms after the close is ordinary wallet money.
- SCR-ANN-27 double tap or retry: creates one transfer (idempotency).
- SCR-ANN-27 never Pending: there is no Pending state for a contribution.
- SCR-ANN-24 contributor names: names and amounts visible to group members; non-contributors never listed; no hide-my-name option.

**Criteria map:**
- AC 1: SCR-ANN-24 Open and SCR-ANN-25 default (campaign, progress, deadline, rule before the amount, hint not preselected).
- AC 2: SCR-ANN-25 default and SCR-ANN-26 default (review, `ann.give.name_visible`, no tip).
- AC 3: SCR-ANN-26 short balance (PIN screen, pause screen, deposit flow).
- AC 4: SCR-ANN-27 Confirmed, Failed, never Pending.
- AC 5: SCR-ANN-27 Confirmed (one ledger entry tagged with the campaign, income, reserved).
- AC 6: SCR-ANN-27 double tap and lost the race (`ann.error.closed`).
- AC 7: SCR-ANN-24 offline and SCR-ANN-26 offline.
- AC 8: SCR-ANN-26 provider unavailable and requirements, SCR-ANN-24 closed (`ann.error.closed`).
- AC 9: SCR-ANN-24 contributor names.
- AC 10: no UI, system rule (audit of contribution, status, device, time; `transfer.external_owner` entry carries the campaign tag).

**Objects and fields:** Contribution (campaign tag, amount, status, reference ID); Transaction; Ledger entry; Wallet; Campaign; Audit entry.

**Open points:**
- ANN-05 permission is `Wallet: deposit` on the destination wallet, which is a Member bundle permission; a member without a Gereo wallet or with limits is routed through ACC-07, but a guest or a member under Tier 1 limits: which message? Not specified in the story.
- Key for the below-minimum message: not specified in the story.
- "Pause screen of WAL-13 criterion 3 applies as written": what the person sees on SCR-ANN-26 when the pause is triggered is owned by WAL; not restated here.
- The ledger tag name is given as `transfer.external_owner` in ANN-05 AC 10; WAL-13 owns it; the contribution's chip in the ledger (Contribution or Transfer) is not specified in the story.

---

### ANN-06 Get a receipt for every contribution

**Story:** ANN-06 Get a receipt for every contribution

**Surfaces:**
- SCR-ANN-28 | Notification: campaign receipt (`msg.ann.campaign_receipt.push`, `msg.ann.campaign_receipt.sms`, class Pl, paid by the platform; SMS holds amount, shortened campaign name, date and reference in one GSM-7 segment) | notification | The contributor | Entry: system on Confirmed | Exit: SCR-ANN-29
- SCR-ANN-29 | Receipt page (WAL-14 receipt plus the campaign name: reference ID, campaign, amount, fee, wallet used, date and time, status as word, icon and colour; labelled proof of payment inside Gereo) | page | The contributor | Entry: transaction list, "My contributions", notification | Exit: SCR-ANN-33, SCR-ANN-24
- SCR-ANN-30 | "My contributions" and totals (what the person gave to each campaign and the total refunded) | inline (on SCR-ANN-24) | The contributor | Entry: SCR-ANN-24 | Exit: SCR-ANN-29
- SCR-ANN-31 | No-money-moved notice for a Failed attempt (`ann.receipt.no_money_moved`) | inline (on SCR-ANN-27 and SCR-ANN-29) | The contributor | Entry: Failed contribution | Exit: next action
- SCR-ANN-32 | Notification: campaign refund (`msg.ann.campaign_refund`, push then SMS by the ladder, class Pl, linked to the original contribution by reference) | notification | The refunded contributor | Entry: system on a refund posting | Exit: SCR-ANN-29
- SCR-ANN-33 | Share receipt (as text, and as image or PDF where the phone allows) | sheet | The contributor | Entry: share on SCR-ANN-29 | Exit: SCR-ANN-29

**States per surface:**
- SCR-ANN-28 push: on Confirmed.
- SCR-ANN-28 SMS: if the push is not opened or there is no device, by the NTF-05 ladder; one message per contribution; the WAL-13 sender SMS is not sent for a campaign contribution.
- SCR-ANN-28 failed: a Failed attempt sends no SMS.
- SCR-ANN-29 Confirmed: receipt with status word, icon and colour.
- SCR-ANN-29 Failed: shows the notice that no money moved and the next action.
- SCR-ANN-29 offline: cached and readable offline with `Last synced`.
- SCR-ANN-29 correction: never an edit; a new receipt linked to a reversing entry (WAL-18).
- SCR-ANN-29 refund receipt: its own receipt linked to the original contribution.
- SCR-ANN-29 resend: resending a receipt is logged.
- SCR-ANN-30 default: totals given and refunded per campaign.
- SCR-ANN-30 empty: member has not given; not specified in the story.
- SCR-ANN-31 default: plain statement that no money moved and the next action.
- SCR-ANN-32 default: refund receipt notice; SMS by the ladder.
- SCR-ANN-33 default: text share; image or PDF where the phone allows.
- SCR-ANN-33 language: SMS and receipt use straight apostrophes, no emoji, no characters that push an SMS to 70 characters; amounts with space grouping and `Ar`.

**Criteria map:**
- AC 1: SCR-ANN-28 push and SMS (`msg.ann.campaign_receipt.push`, `msg.ann.campaign_receipt.sms`, class Pl).
- AC 2: SCR-ANN-29 Confirmed and SCR-ANN-30 default (in-app receipt, "My contributions").
- AC 3: SCR-ANN-29 offline and SCR-ANN-33 default.
- AC 4: SCR-ANN-31 default and SCR-ANN-28 failed (`ann.receipt.no_money_moved`).
- AC 5: SCR-ANN-32 default (`msg.ann.campaign_refund`).
- AC 6: SCR-ANN-30 default.
- AC 7: SCR-ANN-29 correction.
- AC 8: SCR-ANN-29 resend (no UI beyond the log; audit evidence kept for `AUDIT_RETENTION_YEARS`; no ledger entry by the receipt).
- AC 9: SCR-ANN-33 language.

**Objects and fields:** Transaction (reference ID, status, amount, fee, wallet, time); Ledger entry; Notification; Campaign.

**Open points:**
- `msg.ann.campaign_receipt` and `msg.ann.campaign_refund` are "new rows to add" to NTF (class Pl); key variants and EV IDs not specified in the story.
- A "Resend receipt" action is implied by the audit text ("resending a receipt is logged"); who can resend and from which surface? Not specified in the story.
- Receipt shown as image or PDF: which fields and watermark? Not specified in the story.
- Whether the refund receipt of a refund to mobile money shows the fee and net amount: ANN-04 says the net amount is disclosed at contribution time; the receipt content is not specified.

---

### ANN-07 Follow the campaign's progress and close it

**Story:** ANN-07 Follow the campaign's progress and close it

**Surfaces:**
- SCR-ANN-34 | Campaign progress (headline sentence from message keys: amount raised against goal, number of contributors, time left absolute and relative in Madagascar time; progress bar with text equivalent; `Goal reached`) | inline (on SCR-ANN-24) | Member holding `Group: view group` | Entry: SCR-ANN-24 | Exit: none
- SCR-ANN-35 | Contributor list (names and amounts to members; never people who have not given) | inline (on SCR-ANN-24) | Group members | Entry: SCR-ANN-24 | Exit: none
- SCR-ANN-36 | Notification: goal reached (`msg.ann.campaign_goal_reached`) | notification | Members | Entry: system when the goal is reached | Exit: SCR-ANN-24
- SCR-ANN-37 | Notification: campaign closing (`msg.ann.campaign_closing`) | notification | Members who have not given | Entry: system before the deadline | Exit: SCR-ANN-24
- SCR-ANN-38 | Close now confirmation (totals; under the refund rule with the goal missed, how many people get money back and how much) | sheet | Holder of both permissions of ANN-04 | Entry: "Close now" on SCR-ANN-24 | Exit: SCR-ANN-24
- SCR-ANN-39 | System: campaign close and refunds (closes at the deadline; posts one refund per contributor to the original source, exactly the sum of Confirmed contributions, no approvers, fee 0; Refunding then Refunded; report becomes due) | system | none | Entry: deadline, or manual close | Exit: SCR-ANN-41, SCR-ANN-32
- SCR-ANN-40 | Refund held notice (`ann.refund.held`) | inline (on SCR-ANN-24) | Group members | Entry: Wallet freeze (SPD-15) or Operator hold on the destination wallet | Exit: none
- SCR-ANN-41 | Notification: campaign closed (`msg.ann.campaign_closed`, push and in-app with the result in plain words; SMS variant only by the NTF-05 ladder within the group allowance) | notification | Members | Entry: system on close | Exit: SCR-ANN-24

**States per surface:**
- SCR-ANN-34 Open: headline sentence and bar; only Confirmed contributions count.
- SCR-ANN-34 Goal reached: `Goal reached`; the campaign continues until its deadline unless a holder closes it early.
- SCR-ANN-34 Closed: status Closed when the goal was reached, the keep rule applies, or nobody gave; the reserve is released and the money stays in the destination wallet; the report becomes due if anything was received.
- SCR-ANN-34 Refunding: goal missed under the refund rule; refunds being posted; no contribution accepted.
- SCR-ANN-34 Refunded: last refund posted; the report becomes due.
- SCR-ANN-34 offline: page loads from cache with `Last synced` and a note that numbers may have changed; closing is online only.
- SCR-ANN-35 default: contributors with names and amounts; non-contributors never listed.
- SCR-ANN-36 default: `msg.ann.campaign_goal_reached` to members.
- SCR-ANN-37 default: `msg.ann.campaign_closing` before the deadline to members who have not given.
- SCR-ANN-38 default: totals; under the refund rule with the goal missed states how many people get money back and how much.
- SCR-ANN-38 hidden: person without both permissions; "Close now" not shown.
- SCR-ANN-38 offline: closing is online only; blocked (key not specified).
- SCR-ANN-39 deadline: system closes at the deadline; after close no contribution is accepted.
- SCR-ANN-39 refund per contributor: one balanced ledger entry each, referencing the original contributions, with its own receipt (ANN-06).
- SCR-ANN-39 refund needs attention: a refund that cannot be delivered reads Needs attention, shown to the operator (OPS-06), never blocks the others.
- SCR-ANN-39 audit: closing mode, actor, time, totals and the rule applied stored.
- SCR-ANN-40 default: refunds held while the destination wallet is under a Wallet freeze or an Operator hold; they resume when the hold is lifted.
- SCR-ANN-41 default: result in plain words.

**Criteria map:**
- AC 1: SCR-ANN-34 Open (headline sentence, progress bar, Confirmed only).
- AC 2: SCR-ANN-35 default.
- AC 3: SCR-ANN-34 Goal reached, SCR-ANN-36, SCR-ANN-37 (`msg.ann.campaign_goal_reached`, `msg.ann.campaign_closing`).
- AC 4: SCR-ANN-39 deadline, SCR-ANN-38 default (close at deadline or early, confirmation with totals).
- AC 5: SCR-ANN-34 Closed (reserve released, report due).
- AC 6: SCR-ANN-34 Refunding and Refunded, SCR-ANN-39 refund per contributor.
- AC 7: SCR-ANN-40 default and SCR-ANN-39 refund needs attention (`ann.refund.held`, Needs attention, OPS-06).
- AC 8: SCR-ANN-41 default (`msg.ann.campaign_closed`).
- AC 9: SCR-ANN-34 offline and SCR-ANN-38 offline.
- AC 10: no UI, system rule (closing mode, actor, time, totals, rule applied stored; refunds reference original contributions).

**Objects and fields:** Campaign (status, goal, raised, contributor count, deadline, rule); Contribution; Ledger entry (refund); Notification; Audit entry.

**Open points:**
- Where is the campaign's closed-with-nothing-received state defined (no report ever, Closed)? The story says the report never exists; the page text is not specified.
- Key for the headline sentence and for the wallet freeze versus Operator hold message difference (`ann.refund.held` is one key): not specified in the story.
- The NTF catalogue row for `msg.ann.campaign_closing` and `msg.ann.campaign_goal_reached` and their audience: not specified in the story beyond "members".
- What the contributor sees on their own contribution row while a refund is held or Needs attention: not specified in the story.
- A mobile-money refund fee: the refund goes "by default to the contributor's Gereo wallet"; how a contribution knows its "original source" when a deposit was made first (WAL-06) is not specified in the story.

---

### ANN-08 Publish a report on how the money was used

**Story:** ANN-08 Publish a report on how the money was used

**Surfaces:**
- SCR-ANN-42 | Report form (read-only amounts raised, refunded, spent through linked spending requests with a link to each, remaining in the wallet from this campaign; required written account; attachments; button `Publish the report`) | page | Holder of both permissions of ANN-04 | Entry: report prompt after close, `msg.ann.report_due` | Exit: SCR-ANN-43
- SCR-ANN-43 | Published report (figures, account, attachments, addenda, announcement) | page | All group members | Entry: announcement, campaign page | Exit: SCR-ANN-24
- SCR-ANN-44 | Addendum form (dated addendum with a reason) | sheet | Holder of both permissions | Entry: "Add an addendum" on SCR-ANN-43 | Exit: SCR-ANN-43
- SCR-ANN-45 | Notification: report published (`msg.ann.report_published`) | notification | Group members | Entry: system on publish | Exit: SCR-ANN-43
- SCR-ANN-46 | Notification: report due and overdue (`msg.ann.report_due`, before the date and after it when Overdue) | notification | The person responsible, then the remaining holders of both permissions | Entry: system | Exit: SCR-ANN-42
- SCR-ANN-47 | Report gap marker (shows the gap between remaining amount and the ledger, for example open or unlinked spending requests) | inline (on SCR-ANN-42 and SCR-ANN-43) | Report author, then members | Entry: SCR-ANN-42 | Exit: none
- SCR-ANN-48 | Report-missing block (`ann.error.report_missing`: the same person cannot start another campaign) | inline (on SCR-ANN-18) | The person with a missing or Overdue report | Entry: "New campaign" | Exit: SCR-ANN-42

**States per surface:**
- SCR-ANN-42 default: figures read-only from the ledger; account required; attachments under the SPD-03 rules (`ATTACHMENT_MAX_MB`, `ATTACHMENT_TYPES`) and `ATTACHMENTS_PER_ITEM`.
- SCR-ANN-42 Not due: campaign Open; not reachable (precondition: Closed or Refunded with contributions).
- SCR-ANN-42 Due: within `CAMPAIGN_REPORT_DEADLINE` (14 days) after close; reminders.
- SCR-ANN-42 Overdue: past the date; same person cannot start another campaign; withdrawals and spending never blocked.
- SCR-ANN-42 gap: remaining amount does not match the ledger; the form shows the gap and does not let the creator hide it; can publish with the gap marked.
- SCR-ANN-42 creator gone: creator left or lost a permission; duty and reminders pass to the remaining holders of both permissions.
- SCR-ANN-42 no contributions: a campaign that received nothing never has a report.
- SCR-ANN-42 validation, failure, offline: not specified in the story.
- SCR-ANN-42 accessibility: figures with space grouping, never clipped at 200% font size, same wording as the campaign page; account keeps its language.
- SCR-ANN-43 Published: visible to all group members; an announcement is posted; no edit.
- SCR-ANN-44 default: dated addendum with a reason; the original stays visible.
- SCR-ANN-45 default: `msg.ann.report_published`.
- SCR-ANN-46 default: before the date, and after it when Overdue.
- SCR-ANN-47 default: gap shown, publishable with the gap marked.
- SCR-ANN-48 default: `ann.error.report_missing`.

**Criteria map:**
- AC 1: SCR-ANN-42 default (read-only figures, links to linked requests).
- AC 2: SCR-ANN-42 default (written account, attachments).
- AC 3: SCR-ANN-43 Published and SCR-ANN-45 default (`Publish the report`, `msg.ann.report_published`).
- AC 4: SCR-ANN-42 Due and SCR-ANN-46 default (`CAMPAIGN_REPORT_DEADLINE`, `msg.ann.report_due`).
- AC 5: SCR-ANN-42 Overdue and SCR-ANN-48 default (`ann.error.report_missing`).
- AC 6: SCR-ANN-44 default (no edit; dated addenda).
- AC 7: SCR-ANN-42 gap and SCR-ANN-47 default.
- AC 8: SCR-ANN-42 creator gone.
- AC 9: no UI, system rule (audit of report, addenda, attachments, author, time; reads the ledger, writes none).
- AC 10: SCR-ANN-42 accessibility.

**Objects and fields:** Report (account, figures, status, due date, addenda); Campaign; Expense request (read); Ledger entry (read); Document; Announcement; Audit entry.

**Open points:**
- SPD-13 link of a spending request to a campaign "to add": not yet specified; the Report's spent list depends on it.
- `msg.ann.report_due` is a new NTF row; EV ID and audience are not specified in the story.
- Report visibility for a member who joined after the campaign: all group members, per story; confirm.
- Who sees the Report-missing block when the reporting duty passed to other holders (does it block the original creator, the new reporter or both)? Not specified in the story.
- Can an Overdue report still be published, and does publishing clear the block at once? Not specified in the story (implied).

## Epic summary

Stories: 8.
Distinct surfaces: 48 (inline 15, modal 2, notification 12, page 13, sheet 5, system 1).
State lines: 126.
Open points: 36.

All open points:

1. ANN-01: Keys for the validation messages and the character counter text: not specified in the story.
2. ANN-01: The effective Urgent cap uses `ntf.group_sms_allowance`; where does the person see how many Urgent uses remain this month? Not specified in the story.
3. ANN-01: Does the campaign launch announcement (ANN-04 AC 4) count against the Urgent cap, and is it Urgent? Not specified in the story.
4. ANN-01: Quiet hours for `msg.ann.published` and `msg.ann.urgent`: governed by NTF-09, but is an Urgent announcement a Critical event (conventions 11.8 lists no ANN item)? Not specified in the story.
5. ANN-02: A person who left the group and opens an old push: what do they see (forbidden or not found)? Story says no notifications after leaving; the deep-link state is not specified.
6. ANN-02: Read counts: "any holder of `Publication: announce to group`" sees them; whether the count includes the publisher and counts members who joined after publication is not specified in the story.
7. ANN-02: Is the Hidden reason shown to the publisher on the announcement page or only in `msg.ann.removed`? ANN-03 says the publisher sees the reason; placement not specified.
8. ANN-02: Key for "Mark all as read" and the unread marker text: not specified in the story.
9. ANN-03: `msg.ann.edited` and `msg.ann.campaign_closed` and others are "new rows to add" to NTF; key and EV IDs for them are not specified in the story.
10. ANN-03: Is a confirmation shown before Withdraw? Not specified in the story.
11. ANN-03: Can a moderator who hides an announcement later un-hide it? Not specified in the story.
12. ANN-03: The `Withdrawn` state shows "with the name": whose name (publisher's)? Not specified in the story.
13. ANN-03: Pin ordering among several pinned announcements: not specified in the story.
14. ANN-04: ANN-04 reuses `msg.ann.campaign_launched` for extensions, while conventions 11.1 says each message key is emitted by exactly one story and event; is a separate key needed for extension updates? Not specified in the story.
15. ANN-04: Does ANN-04 AC 4 say the SMS variant counts against the Urgent cap or the ordinary allowance only? Not specified in the story.
16. ANN-04: The empty state when the group has no wallet without an outgoing rule: not specified in the story (precondition only).
17. ANN-04: Who may see "New campaign": holders of both permissions only, or does a person with only one see a reason? Story ANN-04 AC 8 names the missing permission on the chosen wallet; the group home entry rule is not specified.
18. ANN-04: Where does a campaign appear for a member who is not yet a contributor after the deadline passed (Closed state), and in which list? The campaign list surface is not defined in any ANN story.
19. ANN-05: ANN-05 permission is `Wallet: deposit` on the destination wallet, which is a Member bundle permission; a member without a Gereo wallet or with limits is routed through ACC-07, but a guest or a member under Tier 1 limits: which message? Not specified in the story.
20. ANN-05: Key for the below-minimum message: not specified in the story.
21. ANN-05: "Pause screen of WAL-13 criterion 3 applies as written": what the person sees on SCR-ANN-26 when the pause is triggered is owned by WAL; not restated here.
22. ANN-05: The ledger tag name is given as `transfer.external_owner` in ANN-05 AC 10; WAL-13 owns it; the contribution's chip in the ledger (Contribution or Transfer) is not specified in the story.
23. ANN-06: `msg.ann.campaign_receipt` and `msg.ann.campaign_refund` are "new rows to add" to NTF (class Pl); key variants and EV IDs not specified in the story.
24. ANN-06: A "Resend receipt" action is implied by the audit text ("resending a receipt is logged"); who can resend and from which surface? Not specified in the story.
25. ANN-06: Receipt shown as image or PDF: which fields and watermark? Not specified in the story.
26. ANN-06: Whether the refund receipt of a refund to mobile money shows the fee and net amount: ANN-04 says the net amount is disclosed at contribution time; the receipt content is not specified.
27. ANN-07: Where is the campaign's closed-with-nothing-received state defined (no report ever, Closed)? The story says the report never exists; the page text is not specified.
28. ANN-07: Key for the headline sentence and for the wallet freeze versus Operator hold message difference (`ann.refund.held` is one key): not specified in the story.
29. ANN-07: The NTF catalogue row for `msg.ann.campaign_closing` and `msg.ann.campaign_goal_reached` and their audience: not specified in the story beyond "members".
30. ANN-07: What the contributor sees on their own contribution row while a refund is held or Needs attention: not specified in the story.
31. ANN-07: A mobile-money refund fee: the refund goes "by default to the contributor's Gereo wallet"; how a contribution knows its "original source" when a deposit was made first (WAL-06) is not specified in the story.
32. ANN-08: SPD-13 link of a spending request to a campaign "to add": not yet specified; the Report's spent list depends on it.
33. ANN-08: `msg.ann.report_due` is a new NTF row; EV ID and audience are not specified in the story.
34. ANN-08: Report visibility for a member who joined after the campaign: all group members, per story; confirm.
35. ANN-08: Who sees the Report-missing block when the reporting duty passed to other holders (does it block the original creator, the new reporter or both)? Not specified in the story.
36. ANN-08: Can an Overdue report still be published, and does publishing clear the block at once? Not specified in the story (implied).
