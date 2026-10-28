# ANN: Group announcements and in-group campaign

Epic code: ANN. Release: MVP. Journey steps: 4 Fund, 7 Follow. Format and rules: [00-conventions.md](../00-conventions.md). Founder decisions: [05-decisions.md](../05-decisions.md).

Evidence used in this file:

- [05-marketplace-social-lending-donations.md](../../research/raw/05-marketplace-social-lending-donations.md) (raw/05): section 2.3 and 2.7 (closed group social layer), section 4.2 GoFundMe, 4.3 M-Changa, 4.5 Francophone platforms, 4.6 donations takeaways, 3.6 Kiva (automation defaults), section 5.2 phasing, section 5.3 risks.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 2.3 and 2.4 (receipts, review screen), section 4 offline and SMS rules, section 8.8 notifications.
- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 12 (little verifiable data on social and SMS marketing), section 14.6 risk 3.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Group communication) and [design-foundations.md](../../research/design-foundations.md) sections 3 and 4.

## Scope of the epic

In MVP: an announcement published to the group by a member with the right permission, read and pinned; a special contribution campaign inside one group with goal, deadline, description, optional suggested amount per member, progress, ledger-linked contributions, closing and a use-of-funds report; a receipt for each contributor.

The campaign reuses the contribution and ledger primitives, and the research calls it the cheapest and safest first step because the givers are members of the same group (raw/05 section 4.6). The lower legal risk is the research's reading and is not confirmed: Madagascar has no equivalent text on public fundraising that the research could find, and holding funds is regulated (competitive-analysis section 6). Stories that move money carry the tag `legal-gate`.

### How a campaign moves money (decided here, read this first)

- A contribution is an internal transfer from the member's wallet to the group wallet (WAL-13), free and Confirmed at once or not created. It is never Pending. A member with too little balance first deposits through WAL-06 and WAL-07, which carry the provider's Pending states; the campaign has no payment of its own and no direct mobile-money payment into a campaign.
- Contributions are tagged ledger entries in an existing group wallet, not a sub-wallet. Every contribution is income for that wallet (decision D3). So that the rule shown to contributors can be kept, the destination wallet must have no active rule that moves money out, and a rule that moves money out cannot be activated on it while a campaign is Open or Refunding (RUL-07, RUL-13). A group that has such rules on its main wallet opens a second wallet for campaigns (GRP-15, WAL-01).
- While a campaign is Open, the money it raised is reserved on the destination wallet: it is part of the balance but not of what can be spent, paid out, moved to another wallet or moved by a rule. The reserve is a derived figure, not a ledger entry, and is unavailable to payouts, rules and moves. It is released when the campaign closes with the keep rule or with the goal reached, and consumed by the refunds when it closes under the refund rule with the goal missed.
- Refunds are system postings (class (c) of the three authorisation classes of conventions section 10), made one per contributor, with no approvers. The destination is fixed to the original source of each contribution: by default the contributor's Gereo wallet, with fee 0. A refund that goes to mobile money pays its payout fee out of the refund, and the net amount is disclosed at contribution time (ANN-04). This is allowed because the unmet-goal rule was shown before payment, accepted by every contributor and locked at the first contribution, and the amount returned is exactly what that person gave. No person decides or moves the money, so the floor "no single person moves the group's money alone" (GRP-13) holds. Unlike a person-initiated outflow (class (a)) and a rule firing (class (b)), it needs neither a spending request, a vote nor a rule version saved in advance, and SPD and GRP-13 must say so (cross-epic issue).
- Spending the money that is kept follows the normal rules: a spending request (SPD-01), then approvers other than the requester (decision D1) or a passed vote above the vote threshold (decision D4). Nothing in this epic lets one person spend campaign money.

### Statuses used by this epic

| Object | Statuses | Notes |
| --- | --- | --- |
| Announcement | Published, Withdrawn, Hidden | Pinned and Edited are markers on a Published announcement, not statuses. Hidden is shown to the publisher as removed by a moderator and uses the catalogue event `msg.ann.removed` |
| Campaign | Open, Closed, Refunding, Refunded | A campaign is Open from the moment it starts. Closed is final when the goal was reached, the keep rule applies, or nobody gave. Refunding runs from a missed goal under the refund rule until the last refund is posted, then Refunded. A draft is a local draft labelled `Draft, not sent` (XCT-05 Table B), never sent without a tap, and not a status |
| Report | Not due, Due, Overdue, Published | Derived from the close time and `CAMPAIGN_REPORT_DEADLINE`. A campaign that received nothing never has a report |
| Contribution and refund | The transaction statuses of the conventions (Initiated, Pending, Confirmed, Failed, Cancelled) | A contribution is Confirmed at once or Failed. A refund can also read Needs attention (WAL-07) when the contributor cannot receive |

### What is NOT in the MVP

- Public campaigns open to people outside the group, discoverable campaigns, public share pages with a verified or unverified badge: Phase 3 after verification, treasurer co-signing and withdrawal gating exist (raw/05 sections 4.3 and 4.6, 5.2). See LTR.
- A social feed, follows, reactions, comments, communities, public posts: the group has announcements only (raw/05 section 2.7; competitive-analysis section 7). See LTR.
- Tips, platform fees added at checkout, default-selected add-ons: forbidden by design (raw/05 section 4.2 and 4.5 GoFundMe and HelloAsso complaints).
- Boosts, audience analytics, paid pins, task-for-reward add-ons (competitive-analysis section 7, "Last or never").
- Media-rich posts (video, long documents, images) in announcements: text only because of data cost (design-foundations section 4).
- Translations of one announcement by the publisher: an announcement keeps the language it was typed in.
- Hiding a contributor's name, a vote before a campaign may start, linking a campaign to a project or to a split rule.

## Parameters

Defaults are working values to validate in field interviews, not research findings. SMS waits (`ntf.sms_window.<type>`), caps, allowance and quiet hours are owned by NTF (`ntf.*`, NTF-05, NTF-06, NTF-09) and are not defined here.

| Parameter | Meaning | Starting value |
| --- | --- | --- |
| ANN_TITLE_MAX_LENGTH, ANN_MAX_LENGTH | Longest title and message of an announcement, in characters | 60 and 1 000: a few short paragraphs, read in full on one screen at 200% text |
| ANN_MAX_PINNED | Most pinned announcements per group | 3 |
| ANN_URGENT_MAX_PER_MONTH | Most announcements per group per month that may be marked Urgent, before the effective cap below | 2 |
| ANN_URGENT_SMS_SHARE_PERCENT | Largest share of the per-member monthly SMS allowance (`ntf.group_sms_allowance`) that Urgent announcements may use | 50 |
| CAMPAIGN_MIN_DURATION, CAMPAIGN_MAX_DURATION | Allowed time between start and deadline, including extensions | 3 days and 90 days |
| CAMPAIGN_MIN_CONTRIBUTION | Smallest contribution in whole ariary. A transfer inside Gereo has no fee (WAL-13), so the rail fee no longer sets it | 1 000 Ar |
| CAMPAIGN_REPORT_DEADLINE | Time after closing by which the use-of-funds report is due | 14 days |
| CAMPAIGN_MAX_EXTENSIONS | Times a deadline may be extended | 2 |

Effective Urgent cap per group per month = min(`ANN_URGENT_MAX_PER_MONTH`, max(1, floor(`ANN_URGENT_SMS_SHARE_PERCENT` percent x `ntf.group_sms_allowance` per member per month))), using the effective allowance including any NTF-06 top-up. The member count cancels, so the check is per member. The worst case (one SMS per member per Urgent send) is a bound, not the expected load, because SMS is sent only after the push is unread (NTF-05). With the starting values the cap is 2 of the 4 SMS per member per month.

Message keys: UI `ann.<area>.<name>` for both announcements and campaigns; notifications use the catalogue form of NTF, `msg.ann.<event>` with the variants `.push`, `.sms` and `.inapp`. SMS texts stay GSM-7 and in one segment (NTF-07, XCT-12). No text is written in this file; any wording quoted below stands for a message key.

---

### ANN-01 Publish an announcement to the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group
**Tags:** sms, audit

**Story:** As a member who may announce to the group, I want to publish a short message that every member sees, so that important news is not lost in a chat.

**Conversation:** Groups use WhatsApp for announcements and lose them in scroll (raw/04 section 2). Group announcements are the low-risk start of the social layer, with no reactions or comments and no open network moderation (raw/05 section 2.7). Info.md says the group's internal social network serves announcements. The announcement is text, short, from a permission holder only. SMS is rationed to announcements the publisher marks Urgent, with a monthly limit per group (the effective Urgent cap of the Parameters section, derived from `ANN_URGENT_MAX_PER_MONTH` and `ANN_URGENT_SMS_SHARE_PERCENT`), because SMS cost is unverified and the group pays it from its allowance (NTF-06). The wait before the SMS, the daily cap and quiet hours are NTF's, not repeated here.

**Preconditions:** The person belongs to the group and holds Publication: announce to group.
**Trigger:** The person taps "New announcement" on the group home.

**Acceptance criteria:**
1. The form asks for a title (required, up to `ANN_TITLE_MAX_LENGTH`) and a message (plain text, required, up to `ANN_MAX_LENGTH`), with a visible character count. A toggle `Urgent` is off by default. Audience is the whole group and is not changeable. There is no image, file or translation field.
2. A preview shows the announcement as members will see it, with the publisher's name and the time. The button names the action (`ann.publish.button`).
3. On publish, all members receive `msg.ann.published` (push and in-app). A normal announcement never uses SMS. An Urgent one uses the SMS fallback of NTF-05 (`msg.ann.urgent`, class Gr): only members who have not opened the push within the NTF window, or who have no device, and only within the group's allowance and the person's daily cap.
4. The Urgent toggle is disabled with a reason when the group already used the effective Urgent cap this month (`ann.urgent.limit`). If the group's SMS allowance is used up, the toggle shows `ann.urgent.sms_paused` and the announcement still publishes by push and in-app.
5. The announcement appears at the top of the group's announcements list for everyone with Group: view group.
6. A person without the permission does not see the "New announcement" button; a line on the screen names the missing permission and who can grant it (`ann.error.no_permission`).
7. States: the button disables while publishing. The announcement draft is a local draft (XCT-05 Table B) labelled `Draft, not sent`; it is never sent without a tap, sending is online only, and nothing is queued. If the connection fails the draft is kept and never published silently; the person must tap publish again once online. Failure shows Retry and keeps the text.
8. Errors: an empty title or a message over the limit shows an inline message. Duplicate publishing (double tap) creates one announcement.
9. Audit: publisher, time, text, the Urgent flag and the number of people notified by each channel are written to the audit log, visible to holders of Group: view audit log (GRP-11).
10. Accessibility and language: labels are visible, the text keeps the language the publisher typed (members read it as written), and the interface around it follows the viewer's language. Targets are at least 48 by 48 dp.

**Data:** Announcement (Publication), Group, Notification, Audit entry.
**Depends on:** GRP-07, GRP-08 (permission), GRP-05 (membership), GRP-11 (audit log), NTF-05, NTF-06, NTF-07 (push, SMS ladder, SMS allowance, SMS text rules), XCT-05 (draft behaviour).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: text only, no image or file in the MVP, because of data cost and moderation (design-foundations section 4; raw/05 section 2.7). Closed: no translations by the publisher; the announcement keeps the language it was typed in (criterion 10), and a group that needs two languages posts two announcements. Closed: `Important` in the first draft is renamed `Urgent` to match the catalogue event EV-ANN-02; the delivery class Important in NTF is a different word and stays NTF's.

---

### ANN-02 Read the group's announcements and see what is new

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Group: view group
**Tags:** offline

**Story:** When I open my group, I want to see the latest announcements, the pinned ones first and what I have not read, so I do not miss something the group needs from me.

**Conversation:** The announcement list is the "follow" side of ANN-01 and replaces searching a chat. Offline reading from cache with a last-synced time is a general rule for anything the person needs to read (conventions section 2). Reading is passive: no reactions or comments in the MVP (raw/05 section 2.7 allows members-only reactions later).

**Preconditions:** The person belongs to the group.
**Trigger:** The person opens the group home, the announcements list, or a push.

**Acceptance criteria:**
1. The list shows pinned announcements first (ANN-03), then the rest newest first. Each row shows title, the first lines, the publisher's name, the time, and an `Urgent` marker with icon and text where set. Withdrawn and Hidden announcements are not in the list.
2. Unread announcements carry a marker with text and an unread count on the group home and the group navigation. Opening an announcement marks it as read; "Mark all as read" is one tap.
3. Tapping a push notification opens the announcement directly, even when it is old, Withdrawn or Hidden. A Withdrawn or Hidden announcement shows only its state (`ann.state.withdrawn`, `ann.state.hidden`) to ordinary members; the publisher and holders of Publication: moderate also see the text.
4. The publisher and any holder of Publication: announce to group see how many members have read it (`ann.list.seen_count`, for example 18 of 25); ordinary members do not see who has read it. Names of people who have not read are never shown to anyone (no shaming).
5. Empty state: `ann.list.empty`, with a "New announcement" button only for people who may publish.
6. Offline: the list loads from cache with a `Last synced` time and the unread state is kept; new items appear when the connection returns. Reading does not need a connection once the item is cached.
7. Loading shows skeleton rows. A very long announcement is shown in full on its own page, not truncated.
8. The list never shows an announcement from a group the person has left, and a person who left no longer receives its notifications.
9. Accessibility and language: the unread marker is never colour alone, the page reads in order with a screen reader, and the layout reflows at 320 px.

**Data:** Announcement, Read state, Membership.
**Depends on:** ANN-01, GRP-05, GRP-06, GRP-16, XCT-04 (cache, last synced), NTF-01 (deep links from a notification).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: read counts are shown only to the publisher and to holders of Publication: announce to group, never per name and never to ordinary members, which keeps the benefit (the publisher knows whether to follow up) without social pressure; the first cohort checks whether it is useful and the rule stays unless field interviews show harm. Closed: no expiry date in the MVP; pin, unpin and withdraw (ANN-03) are enough, and the list stays short because only the most recent items load first.

---

### ANN-03 Pin, correct or withdraw an announcement

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group (pin and unpin any announcement; edit and withdraw one's own); Publication: moderate (hide any)
**Tags:** audit

**Story:** As a member who announces to the group, I want to pin an important announcement, fix a mistake or take it down, so that members see the right message at the top.

**Conversation:** Pinning keeps a standing message visible, such as a bank detail change or a contribution rule, without republishing. Because announcements can concern money, edits must be visible so nobody is misled, and a hide by a moderator is a distinct action with a reason. These rules follow the append-only habit used elsewhere (conventions section 2, by analogy) and the report-and-hide idea in raw/05 section 2.7. The story holds four small actions on one menu; they share the same rules and audit and are tested together, so it is not split.

**Preconditions:** The announcement is Published and the person holds the required permission.
**Trigger:** The person opens the announcement's menu.

**Acceptance criteria:**
1. "Pin" is open to every holder of Publication: announce to group, for any announcement. It puts the announcement at the top of the list and the group home, limited to `ANN_MAX_PINNED`; pinning beyond the limit asks which to unpin (`ann.pin.limit`). "Unpin" returns it to its date position and is open to the same people.
2. "Edit" is available to the publisher only, with no time limit. A saved edit shows `Edited {time}` to everyone (`ann.state.edited`), and one tap shows the earlier text. An edit does not notify unless the editor chooses `Tell the group` (`msg.ann.edited`).
3. "Withdraw" is available to the publisher only; the announcement leaves the list and shows its Withdrawn state (`ann.state.withdrawn`, with the name) where it was opened from a link, and the text is kept in the audit log.
4. A holder of Publication: moderate can hide any announcement with a required reason; its status becomes Hidden, ordinary members see `ann.state.hidden`, and the publisher sees the reason and receives `msg.ann.removed`.
5. A pin, edit, withdraw or hide never changes the audit record of the original text.
6. Offline: pin, edit, withdraw and hide are blocked with an explanation (they change what others see).
7. Errors: two people editing or acting at once get the latest saved version and a conflict message; no silent overwrite.
8. Audit: each action stores actor, time, reason (for hide) and, for edits, old and new text, visible to holders of Group: view audit log (GRP-11).
9. Accessibility and language: pinned state is shown by an icon and text; menu actions are labelled with words.

**Data:** Announcement, Audit entry, Notification.
**Depends on:** ANN-01, ANN-02, GRP-07, GRP-08, GRP-11, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: editing has no time window because every edit is visible and its earlier text one tap away; a group that wants a harder rule withdraws and republishes. Closed: any holder of Publication: announce to group may pin or unpin, because pinning changes order, not content, and the limit and the audit bound abuse.

---

### ANN-04 Start a special contribution campaign inside the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group and Wallet: initiate spend on the destination wallet
**Tags:** legal-gate, ledger, audit

**Story:** As a member who may announce to the group, I want to start a campaign with a goal, a deadline and a reason, so that members can give toward one cause and everyone sees the progress.

**Conversation:** The special contribution campaign inside a group (goal, deadline, wallet pot, ledger, receipts, final report) is the cheapest, safest first step for donations because it reuses contribution and ledger primitives and the givers are members (raw/05 section 4.6; competitive-analysis section 7). Evidence says: show the rule for an unmet goal before payment; never default-select a tip; show fees as a line item (raw/05 section 4.6, GoFundMe and HelloAsso complaints in 4.2 and 4.5). Permission, decided here: no new permission is created. Starting a campaign needs Publication: announce to group because it announces to the group, and Wallet: initiate spend on the destination because the person who raises money for a cause is the one who will later ask to spend it and write the report (ANN-08); someone who could not ask to spend should not collect. A campaign-specific permission may be added later; it is not part of this story. The legal position of collecting funds in the group wallet is unconfirmed, so the tag `legal-gate` applies and the story cannot ship before it is cleared. No vote is needed to start a campaign: a campaign moves no money by itself, and spending the money still passes the group's spending rules.

**Preconditions:** The person belongs to the group, holds the permissions above, and the group has a wallet that can receive and has no active rule that moves money out of it.
**Trigger:** The person taps "New campaign" on the group home.

**Acceptance criteria:**
1. The form asks for: name (required), the reason in a short description (required), goal in whole ariary (required, integer, shown with space grouping), deadline (required, absolute and relative in Madagascar time per XCT-03, within `CAMPAIGN_MIN_DURATION` and `CAMPAIGN_MAX_DURATION`), destination wallet (one group wallet), an optional suggested amount per member, and a choice of what happens if the goal is not reached by the deadline.
2. That choice has two options: keep the money and use it as described, or give it back to each contributor. It is mandatory, has no default, and is shown to contributors before they pay (ANN-05).
3. The review step shows the campaign as members will see it, with the unmet-goal rule in plain words (`ann.rule.keep`, `ann.rule.refund`), the sentence that the money raised is reserved until the campaign closes (`ann.reserve.note`), and the sentence that nobody pays more than the amount they enter (no tip, no added fee from Gereo). Under the refund rule it also states where a refund would go (the original source wallet, fee 0) and, for a refund that would go to mobile money, that its payout fee is taken out of the refund, with the net amount shown before the person pays.
4. On `Start the campaign` the campaign becomes Open and an announcement (ANN-01) is published automatically with `msg.ann.campaign_launched`. Members without the app receive the SMS variant only by the NTF-05 ladder and only within the group's allowance.
5. After the first confirmed contribution, the goal, the destination wallet and the unmet-goal rule are locked. The deadline may be extended with a reason, up to `CAMPAIGN_MAX_EXTENSIONS` and never beyond `CAMPAIGN_MAX_DURATION` from the start; the description may be added to (appended), never rewritten. Contributors are told of an extension by `msg.ann.campaign_launched` reused as an update announcement, not by SMS.
6. The destination list shows only group wallets with no active outgoing rule; a wallet with such a rule is shown as unavailable with the reason `ann.error.wallet_has_rules`. While the campaign is Open or Refunding, activating an outgoing rule on that wallet is refused (RUL-07, RUL-13).
7. States: the button disables while saving; offline the form is a local draft (XCT-05 Table B) labelled `Draft, not sent`, never sent without a tap, and does not publish; sending is online only and nothing is queued; a failed save keeps all fields and shows Retry.
8. Errors: a goal of zero or below `CAMPAIGN_MIN_CONTRIBUTION`, a deadline outside the limits or no unmet-goal choice show inline messages. A person without both permissions on the chosen wallet cannot choose it, and the screen names the missing permission.
9. Audit and ledger: creation, every edit, extension and the locked fields are written to the audit log with actor and time (GRP-11); the campaign itself writes no ledger entry.

**Data:** Campaign, Wallet (reference), Announcement, Notification, Audit entry.
**Depends on:** ANN-01, GRP-07, GRP-08, GRP-15 (second wallet), WAL-01, RUL-07, RUL-13, NTF-05, XCT-03, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no dedicated permission now; the pair Publication: announce to group and Wallet: initiate spend on the destination wallet decides (see Conversation), and a campaign-specific permission is noted for later; GRP must show it in the permission list as the way to run campaigns. Closed: tagged ledger entries in an existing group wallet, not a sub-wallet, so balances stay visible in one place, with the no-outgoing-rule restriction of criterion 6 so that decision D3 (every deposit is income and rules run) cannot move reserved money. Closed: no vote is required to start a campaign. Still open, needs a lawyer: the legal opinion on collecting funds in the group wallet (epic question 1).

---

### ANN-05 Give to a campaign

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Wallet: deposit on the destination group wallet (in the Member bundle, GRP-07); the sender's own wallet needs none
**Tags:** legal-gate, ledger, audit, offline

**Story:** As a member, I want to give an amount of my choice to a campaign and see that it was received, so that I help my group and trust where the money went.

**Conversation:** A contribution is an internal transfer from the member's wallet to the group wallet (WAL-13), tagged with the campaign (conventions section 2). The payment screen must show source, amount, fee and total on one screen, the button labelled with action and amount (design-foundations section 4; raw/07 section 2.4). Gereo never adds a tip or a default add-on, because those are what turned GoFundMe and HelloAsso reviewers against them (raw/05 sections 4.2 and 4.5). A list of contributors is shown to members, but non-contributors are never listed, to avoid shaming (raw/07 R-NT8). Because the money comes from the member's wallet, Vanilla Pay's Pending states appear only in the deposit step (WAL-06, WAL-07), never on the contribution itself.

**Preconditions:** The campaign is Open. The member has a wallet with balance, or can deposit first; the requirements of ACC-07 and the limits of OPS-11 are met for a transfer between wallets.
**Trigger:** The member taps "Give" on the campaign page.

**Acceptance criteria:**
1. The page shows the campaign, goal, progress, deadline and the unmet-goal rule in plain words before the amount field. A suggested amount, if set, is a visible hint and not preselected.
2. The member types a whole-ariary amount (at least `CAMPAIGN_MIN_CONTRIBUTION`). The review screen shows source wallet, amount, the fee line (0 Ar, as WAL-13), total and balance after, a line saying that group members will see the member's name (`ann.give.name_visible`), and a button that names the action and the amount. There is no tip and no default add-on.
3. PIN is required, with the amount and campaign repeated on the PIN screen. The pause screen of WAL-13 criterion 3 applies as it is written there and adds nothing of its own. If the wallet balance is short, the member is offered the deposit flow (WAL-06) and returns to the review screen once the deposit is Confirmed.
4. The contribution is posted as one atomic transfer (WAL-13 criterion 6) with a reference ID and is either Confirmed at once or Failed; it is never Pending. Failed states that no money moved. Only Confirmed counts toward progress.
5. A Confirmed contribution writes one balanced ledger entry from the member's wallet to the destination wallet, tagged with the campaign, with the campaign name as its reason, visible in the group ledger to people who hold Wallet: view history. It is income for the destination wallet (decision D3), and it is reserved until the campaign closes (see the section on how a campaign moves money).
6. A double tap or a retry creates one transfer (idempotency). At the deadline the closing job and the transfer take the same lock: a contribution counts only if it was posted before the closing time, and one that loses the race is Failed with `ann.error.closed` and no money moves. A deposit that confirms after the close is ordinary wallet money, not a late contribution.
7. Offline: giving is online only (it moves money, XCT-06); the button is disabled with an explanation, and the campaign page stays readable from cache.
8. Errors: provider unavailable during the deposit step is handled by WAL-08 and the contribution is not created; a closed campaign shows `ann.error.closed`; a member who does not meet the ACC-07 requirements or exceeds an OPS-11 limit is guided to the step that unlocks it.
9. Names of contributors and their amounts are shown to group members, the same as the ledger (CON-16, WAL-13 criterion 10). There is no hide-my-name option in the MVP. Non-contributors are never listed.
10. Audit and ledger: each contribution, status, device and time are stored (WAL-13 `transfer.external_owner` entry carries the campaign tag).

**Data:** Contribution (campaign), Transaction, Ledger entry, Wallet, Campaign, Audit entry.
**Depends on:** ANN-04, WAL-13 (transfer to a group wallet), WAL-06, WAL-07, WAL-08 (deposit), WAL-14 (transaction page), ACC-03 (PIN), ACC-07 (tier requirements by action), OPS-11 (limits), XCT-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a contribution counts only if it was posted before the closing time (criterion 6); because it is an instant internal transfer there is no "initiated before and confirmed after" case. Closed: no direct mobile-money payment into a campaign; the member deposits first (WAL-06) and then gives, which keeps one money-in path and the provider's states in one place. Closed: contributors cannot hide their name in the MVP, because the group ledger and the ledger tag already show the sender's display name to members, so a hide option would promise a privacy the ledger does not give; the review screen says so before paying. Revisit after field interviews if members ask to give anonymously.

---

### ANN-06 Get a receipt for every contribution

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own contribution)
**Tags:** sms, ledger, offline

**Story:** As a contributor, I want a receipt with a reference number, by app and by SMS, so that I can prove what I gave without calling the treasurer.

**Conversation:** Receipts and reference IDs on everything money-related are a design principle (design-foundations section 3 principle 1; raw/07 section 2.3), and SMS is mandatory for payment receipts (raw/07 section 4 R-SMS1 to R-SMS4). The research lists receipts as one of the five parts of a group campaign (raw/05 section 4.6). The transaction receipt itself is WAL-14's; this story adds the campaign details and the campaign's own message, which replaces the generic transfer SMS so that one contribution sends one message (NTF-05 rule: one SMS per event per person). A contribution has no Pending state (ANN-05), so there is no Pending receipt.

**Preconditions:** A contribution or a refund reached a final status (Confirmed or Failed).
**Trigger:** The status change.

**Acceptance criteria:**
1. On Confirmed the contributor receives `msg.ann.campaign_receipt.push` and, by the NTF-05 ladder (class Pl, paid by the platform, never reducing the group allowance), `msg.ann.campaign_receipt.sms` if the push is not opened or there is no device. The SMS holds amount, campaign name (shortened), date and reference, in one GSM-7 segment in each language (NTF-07, XCT-12). The sender SMS of WAL-13 criterion 9 is not sent for a campaign contribution.
2. The in-app receipt is the WAL-14 receipt plus the campaign name: reference ID, campaign, amount, fee, wallet used, date and time, and status as word, icon and colour. It is available from the transaction list and from the campaign page under "My contributions".
3. The receipt is cached and readable offline, with `Last synced`, and can be shared as text, and as an image or PDF where the phone allows it (raw/07 section 4).
4. A Failed attempt shows a notice that states plainly that no money moved (`ann.receipt.no_money_moved`) and the next action. It sends no SMS.
5. A refund (ANN-07 when the rule is to give back) produces its own receipt, `msg.ann.campaign_refund` (push, then SMS by the ladder, class Pl), linked to the original contribution by reference.
6. The contributor can see the total they gave to each campaign, and the total refunded.
7. A correction is never an edit: it is a new receipt linked to a reversing entry (WAL-18).
8. Audit and ledger: each receipt links to its ledger entry; resending a receipt is logged, and the audit evidence is kept for `AUDIT_RETENTION_YEARS` (OPS); no ledger entry is written by the receipt.
9. Accessibility and language: the SMS and the receipt use straight apostrophes, no emoji and no characters that would push an SMS to 70 characters per segment; amounts read with space grouping and `Ar` in all three languages (XCT-02).

**Data:** Transaction, Ledger entry, Notification, Campaign.
**Depends on:** ANN-05, WAL-13, WAL-14, WAL-18, NTF-05, NTF-07, XCT-02, XCT-04, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Still open, needs a lawyer: whether the receipt is a legal document or only a proof of payment inside Gereo (epic question 1). Default used: proof of payment inside Gereo, labelled so on the receipt, as WAL-14 labels non-confirmed summaries. Closed: receipts are transaction records and are kept for `RECORD_RETENTION_YEARS` (WAL), because they are the proof behind ledger entries; their audit evidence follows `AUDIT_RETENTION_YEARS` (OPS). The legal side is ACC open question 1.

---

### ANN-07 Follow the campaign's progress and close it

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member, and System at the deadline
**Permission needed:** Group: view group (see); a holder of both permissions of ANN-04 (close early)
**Tags:** legal-gate, ledger, audit, offline

**Story:** When a campaign is running, I want to see how much has come in and when it ends, and when it ends I want it to close cleanly and follow the rule everyone saw, so nobody argues about what happens to the money.

**Conversation:** Progress is computed only from confirmed ledger entries, so the number is real (info.md "Registre comptable en temps réel"). The unmet-goal rule shown before payment must be applied exactly (raw/05 section 4.6). A refund returns each person's own money under a rule they accepted and no one could change after the first contribution, so it is a class (c) system posting (conventions section 10), made without approvers, and is neither a spending request nor a vote; the reasoning is in the section on how a campaign moves money, and SPD and GRP-13 must record it. The story covers viewing, the deadline and the refund because they are one lifecycle tested end to end; if the refund grows (partial failures, operator cases) it can become its own story.

**Preconditions:** A campaign exists.
**Trigger:** Opening the campaign; the deadline; a holder taps "Close now".

**Acceptance criteria:**
1. The campaign page shows a headline sentence from message keys (amount raised against goal, number of contributors, time left in absolute and relative form, Madagascar time) and a progress bar with a text equivalent. Only Confirmed contributions count.
2. The contributor list shows names and amounts to members and never lists people who have not given.
3. When the goal is reached the page shows `Goal reached`, members receive `msg.ann.campaign_goal_reached`, and the campaign continues until its deadline unless a holder closes it early. Before the deadline, members who have not given receive `msg.ann.campaign_closing`.
4. At the deadline the system closes the campaign. A holder can also close early with a confirmation that shows the totals and, under the refund rule with the goal missed, says how many people will get money back and how much. After close, no contribution is accepted (ANN-05).
5. On close with the goal reached, with the keep rule, or with no contribution, the status is Closed, the reserve is released and the money stays in the destination wallet; the report becomes due (ANN-08) if anything was received.
6. On close with the goal not reached and the refund rule, the status is Refunding. The system posts one refund per contributor from the destination wallet to the original source of each contribution (by default the contributor's Gereo wallet), for exactly the sum of that person's Confirmed contributions, with no approvers and fee 0. A refund to mobile money pays its payout fee out of the refund, and the net amount was disclosed at contribution time (ANN-04). Each refund is its own balanced ledger entry referencing the original contributions, and has its own receipt (ANN-06). When the last refund is posted the status is Refunded and the report becomes due.
7. A Wallet freeze or an Operator hold on the destination wallet (SPD-15, conventions section 10) holds the refunds; the page shows `ann.refund.held` and the refunds resume when the hold is lifted. A refund that cannot be delivered (the person cannot receive) reads Needs attention, is shown to the operator (OPS-06) and never blocks the others.
8. Members receive `msg.ann.campaign_closed` with the result in plain words, as push and in-app; the SMS variant goes only by the NTF-05 ladder and within the group's allowance.
9. Offline: the page loads from cache with `Last synced` and a note that numbers may have changed. Closing is online only.
10. Audit and ledger: closing mode (deadline or manual), actor, time, totals and the rule applied are stored; refund entries reference the original contributions.

**Data:** Campaign, Contribution, Ledger entry, Notification, Audit entry.
**Depends on:** ANN-04, ANN-05, ANN-06, ANN-08, WAL-13, WAL-03 (reserve in what is safe to spend), WAL-18, SPD-10 (reserve respected by payouts), SPD-15 (freeze), OPS-06, NTF-05, XCT-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a refund needs no approval flow, because it returns exactly each person's own money under the rule shown before payment and locked at the first contribution; no person decides or moves it (the system does), so the floor of GRP-13 holds. This replaces the earlier proposal of an expense request, which would have let an approver block people's money. Closed: a campaign does not close when the goal is reached; it runs to its deadline, since extra gifts are welcome and a holder can close early. Closed: the deadline is in Madagascar time (XCT-03).

---

### ANN-08 Publish a report on how the money was used

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** the two permissions of ANN-04 (Publication: announce to group and Wallet: initiate spend on the destination wallet); a campaign-specific permission is noted for later
**Tags:** legal-gate, ledger, audit

**Story:** As the member who ran a campaign, I want to publish what was spent and what is left, so that contributors see where their money went.

**Conversation:** A use-of-funds report is the fifth part of the group campaign and a mandatory step before the next campaign (raw/05 section 4.6). Transparency of money is the product's promise and M-Changa's credibility rests on accountability and refunds when appeals fail (raw/05 section 4.3). In the group the report links to real expense requests, not typed numbers. Spending requests can be linked to a campaign by the requester (the optional campaign link is read from SPD-13, like the project and decision links); a request that is not linked shows up as a gap in the report, which is the intended pressure. The report is about the person who ran the campaign, but the duty belongs to the group: if that person leaves or loses a permission, any holder of both permissions may write it.

**Preconditions:** The campaign is Closed or Refunded and received contributions.
**Trigger:** The person opens the report prompt after close, or a reminder.

**Acceptance criteria:**
1. The report form shows, read only, the amounts raised, refunded (if any), spent through the spending requests linked to the campaign (list with link to each) and remaining in the wallet from this campaign, taken from the ledger, so the totals cannot be typed.
2. The creator adds a short written account (required) and may attach photos or receipts under the attachment rules of SPD-03 (`ATTACHMENT_MAX_MB`, `ATTACHMENT_TYPES`) and `ATTACHMENTS_PER_ITEM` (PRJ-07).
3. On `Publish the report` the report becomes visible to all group members, an announcement is posted and the group receives `msg.ann.report_published`.
4. The report is due within `CAMPAIGN_REPORT_DEADLINE` after close. The person responsible receives `msg.ann.report_due` before the date and after it when Overdue.
5. While a report is Due past its date (Overdue) or missing, the same person cannot start another campaign (`ann.error.report_missing`). Withdrawals and spending from the destination wallet are never blocked by a missing report.
6. A report is not edited. Corrections are added as dated addenda, each with a reason, and the original stays visible.
7. If the remaining amount does not match the ledger (for example spending requests still open or not linked), the form shows the gap and does not let the creator hide it; it can be published with the gap marked.
8. If the creator left the group or no longer holds both permissions, the duty and the reminders pass to the remaining holders of both permissions.
9. Audit and ledger: the report, addenda, attachments, author and time are stored; the report reads from the ledger and writes none.
10. Accessibility and language: figures use space grouping, never clip at 200% font size and read in the same wording as the campaign page; the account keeps the language it was typed in.

**Data:** Campaign, Report, Expense request (read), Ledger entry (read), Document, Announcement, Audit entry.
**Depends on:** ANN-07, SPD-13 (link of a request to a campaign, to add), SPD-01, WAL-03, PRJ-07, NTF-05, GRP-16.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: an overdue report blocks the same person's next campaign only, not withdrawals, because blocking spending would hold the whole group's money hostage for one person's delay, and spending already needs approvers or a vote (decisions D1 and D4). Closed: no second member approves the report; the report reads from the ledger and every spending request behind it was already approved. Closed: attachments follow `RECORD_RETENTION_YEARS` (WAL) like the receipts they are; the audit evidence of the report follows `AUDIT_RETENTION_YEARS` (OPS). Retention after a group closes stays with ACC open question 1.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| ANN-01 | Publish an announcement to the group | P1 | GRP-05, GRP-07, GRP-08, GRP-11, NTF-05, NTF-06, NTF-07, XCT-05 |
| ANN-02 | Read the group's announcements and see what is new | P1 | ANN-01, GRP-05, GRP-06, GRP-16, XCT-04, NTF-01 |
| ANN-03 | Pin, correct or withdraw an announcement | P2 | ANN-01, ANN-02, GRP-07, GRP-08, GRP-11, NTF-05 |
| ANN-04 | Start a special contribution campaign inside the group | P1 | ANN-01, GRP-07, GRP-08, GRP-15, WAL-01, RUL-07, RUL-13, NTF-05 |
| ANN-05 | Give to a campaign | P1 | ANN-04, WAL-13, WAL-06, WAL-07, WAL-14, ACC-03, ACC-07, XCT-06 |
| ANN-06 | Get a receipt for every contribution | P1 | ANN-05, WAL-13, WAL-14, WAL-18, NTF-05, NTF-07, XCT-12 |
| ANN-07 | Follow the campaign's progress and close it | P1 | ANN-04, ANN-05, ANN-06, ANN-08, WAL-03, SPD-10, SPD-15, OPS-06, NTF-05 |
| ANN-08 | Publish a report on how the money was used | P1 | ANN-07, SPD-01, SPD-13, WAL-03, PRJ-07, NTF-05 |

Count: 8 stories. P0: 0. P1: 7 (ANN-01, 02, 04, 05, 06, 07, 08). P2: 1 (ANN-03). The epic is MVP scope but not part of the core loop; campaign stories also depend on clearing the `legal-gate`.

## Cross-epic dependencies

Every ID below was checked against the story files in this folder.

- ACC: ACC-03 (PIN), ACC-07 (tier requirements by action; numeric limits are OPS-11's), ACC-06 (language preference).
- WAL: WAL-13 (a contribution is a transfer to a group wallet), WAL-06, WAL-07, WAL-08 (deposit and provider states), WAL-14 (receipt and transaction page), WAL-18 (reversing entry for corrections), WAL-03 (the reserve must be outside what is safe to spend), WAL-01 (group wallet). WAL-13 criterion 9 must not send its sender SMS for a campaign contribution.
- RUL: RUL-07 and RUL-13 must refuse an outgoing rule on a wallet that holds an Open or Refunding campaign (ANN-04 criterion 6); rules never move reserved money. A campaign cannot feed a split rule beyond that, and no campaign-specific rule exists.
- GRP: GRP-07 and GRP-08 (the permissions Publication: announce to group, Publication: moderate, Wallet: initiate spend, Wallet: deposit), GRP-05 (members), GRP-06 (group home), GRP-11 (audit log), GRP-15 (second wallet for campaigns), GRP-16 (leaving a group), GRP-13 (the refund exception).
- CON: CON-16 (ledger transparency shows contributor names the same way); CON-01 criterion 6 sends one-off collections to ANN-04. Contribution tracking per member stays in CON and is not mixed with campaigns.
- SPD: SPD-01 and SPD-13 (link a spending request to a campaign, to add), SPD-10 (payouts respect the reserve), SPD-15 (Wallet freeze holds refunds), SPD-02 and GRP-13 (record that campaign refunds are system-made without approvers).
- VOT: none. A vote may be mentioned in an announcement; no campaign needs a vote.
- NTF: the catalogue rows EV-ANN-01 to EV-ANN-08, plus new rows to add: edited announcement, campaign closed, campaign receipt (class Pl), campaign refund (class Pl), report due, with the keys `msg.ann.edited`, `msg.ann.campaign_closed`, `msg.ann.campaign_receipt`, `msg.ann.campaign_refund`, `msg.ann.report_due`. NTF-05 (ladder), NTF-06 (allowance), NTF-07 (SMS text), NTF-09 (quiet hours) own every wait, cap and SMS rule.
- XCT: XCT-04 (offline cache, last synced), XCT-05 (draft labels), XCT-06 (money-out online only), XCT-02, XCT-03 (amounts, Madagascar time), XCT-12 (SMS length).
- OPS: OPS-04 (reconciliation of campaign totals against the ledger), OPS-06 (disputed contributions, refunds that need attention), OPS-11 (limits), `AUDIT_RETENTION_YEARS`; WAL owns `RECORD_RETENTION_YEARS`.
- PRJ: PRJ-07 (attachment rules used by the report); linking a campaign to a project is not in the MVP.
- EVT: none.
- LTR: SOC-04 and DON-01 reuse ANN-04 to ANN-08.

## Open questions

1. Open, needs a lawyer: legal opinion on collecting funds from members into a group wallet (tag `legal-gate`), on the status of a receipt, and on refunds. Madagascar has no equivalent text on public fundraising that the research could find (raw/05 section 4.5, gap). Default used: campaigns are built as specified and cannot ship until the opinion is in; receipts are proof of payment inside Gereo only.
2. Closed: which permission creates a campaign. No new permission; the pair Publication: announce to group and Wallet: initiate spend on the destination wallet (ANN-04). The same pair closes early and writes the report.
3. Closed: destination. Tagged entries in an existing group wallet that has no outgoing rule, with the contributed money reserved until close (ANN-04).
4. Closed: refunds. Made by the system, per contributor, without approvers, under the rule locked at the first contribution (ANN-07).
5. Closed: a contribution counts if posted before the closing time; there is no Pending contribution (ANN-05).
6. Closed: contributors cannot hide their names in the MVP; non-contributors are never shown (ANN-05).
7. Closed: no vote is needed to start a campaign (ANN-04).
8. Closed: an overdue report blocks the same person's next campaign only, not withdrawals (ANN-08).
9. Closed: SMS. `Urgent` announcements use the NTF-05 ladder within the group allowance; the only ANN parameters are `ANN_URGENT_MAX_PER_MONTH` (2) and `ANN_URGENT_SMS_SHARE_PERCENT` (50), combined into the effective cap of the Parameters section; the payer is the group (class Gr) except receipts, which the platform pays (class Pl) (ANN-01, ANN-06; NTF-06).
10. Closed: announcements are text only and not translated by the publisher (ANN-01).
