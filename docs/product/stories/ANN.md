# ANN: Group announcements and in-group campaign

Epic code: ANN. Release: MVP. Journey steps: 4 Fund, 7 Follow. Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file:

- [05-marketplace-social-lending-donations.md](../../research/raw/05-marketplace-social-lending-donations.md) (raw/05): section 2.3 and 2.7 (closed group social layer), section 4.2 GoFundMe, 4.3 M-Changa, 4.5 Francophone platforms, 4.6 donations takeaways, 3.6 Kiva (automation defaults), section 5.2 phasing, section 5.3 risks.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 2.3 and 2.4 (receipts, review screen), section 4 offline and SMS rules, section 8.8 notifications.
- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 12 (little verifiable data on social and SMS marketing), section 14.6 risk 3.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Group communication) and [design-foundations.md](../../research/design-foundations.md) sections 3 and 4.

## Scope of the epic

In MVP: an announcement published to the group by a member with the right permission, read and pinned; a special contribution campaign inside one group with goal, deadline, description, optional suggested amount per member, progress, ledger-linked contributions, closing and a use-of-funds report; a receipt for each contributor.

The campaign reuses the contribution and ledger primitives, and the research calls it the cheapest and safest first step because the givers are members of the same group (raw/05 section 4.6). The lower legal risk is the research's reading and is not confirmed: Madagascar has no equivalent text on public fundraising that the research could find, and holding funds is regulated (competitive-analysis section 6). Stories that move money carry the tag `legal-gate`.

### What is NOT in the MVP

- Public campaigns open to people outside the group, discoverable campaigns, public share pages with a verified or unverified badge: Phase 3 after verification, treasurer co-signing and withdrawal gating exist (raw/05 sections 4.3 and 4.6, 5.2). See LTR.
- A social feed, follows, reactions, comments, communities, public posts: the group has announcements only (raw/05 section 2.7; competitive-analysis section 7). See LTR.
- Tips, platform fees added at checkout, default-selected add-ons: forbidden by design (raw/05 section 4.2 and 4.5 GoFundMe and HelloAsso complaints).
- Boosts, audience analytics, paid pins, task-for-reward add-ons (competitive-analysis section 7, "Last or never").
- Media-rich posts (video, long documents) in announcements: text first because of data cost (design-foundations section 4).

## Parameters

| Parameter | Meaning | Starting hypothesis |
| --- | --- | --- |
| ANN_MAX_LENGTH | Longest announcement | To decide, short by design |
| ANN_MAX_PINNED | Most pinned announcements per group | To decide, small |
| ANN_SMS_WAIT | How long a push may stay unopened before SMS for an important announcement | To decide with the SMS aggregator quote |
| ANN_SMS_ALLOWED | Whether "important" announcements may use SMS at all, and a monthly cap per group | To decide, SMS is costly (raw/04 section 14.6 risk 3) |
| CAMPAIGN_MIN_DURATION / CAMPAIGN_MAX_DURATION | Allowed time between start and deadline | To decide |
| CAMPAIGN_MIN_CONTRIBUTION | Smallest contribution in whole ariary | To decide with the payment rail fees |
| CAMPAIGN_REPORT_DEADLINE | Time after closing by which the use-of-funds report is due | To decide |
| CAMPAIGN_MAX_EXTENSIONS | Times a deadline may be extended | To decide |

Message keys: UI `announcement.<area>.<name>` and `campaign.<area>.<name>`; notifications `ntf.announcement.<name>.push`, `ntf.campaign.<name>.push` and `.sms`. SMS keys stay GSM-7 and under 160 characters. No text is written in this file.

---

### ANN-01 Publish an announcement to the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group
**Tags:** sms, audit

**Story:** As a member who may announce to the group, I want to publish a short message that every member sees, so that important news is not lost in a chat.

**Conversation:** Groups use WhatsApp for announcements and lose them in scroll (raw/04 section 2). Group announcements are the low-risk start of the social layer, with no reactions or comments and no open network moderation (raw/05 section 2.7). Info.md says the group's internal social network serves announcements. The announcement is text, short, from a permission holder only. SMS is rationed to announcements the publisher marks important (a parameter, since SMS cost is unverified).

**Preconditions:** The person belongs to the group and holds Publication: announce to group.
**Trigger:** The person taps "New announcement" on the group home.

**Acceptance criteria:**
1. The form asks for a title (short, required) and a message (plain text, required, up to ANN_MAX_LENGTH). A toggle `Important` is off by default. Audience is the whole group and is not changeable.
2. A preview shows the announcement as members will see it, with the publisher's name and the time. The button is labelled `Publish to the group`.
3. On publish, all members receive `ntf.announcement.published.push`. If `Important` is on and ANN_SMS_ALLOWED is true, members who do not open the push within ANN_SMS_WAIT, or who have no device, receive `ntf.announcement.important.sms` within the group's SMS cap. A normal announcement never uses SMS.
4. The announcement appears at the top of the group's announcements list for everyone with Group: view group.
5. A person without the permission does not see the "New announcement" button; a line on the screen names the missing permission and who can grant it (`announcement.error.no_permission`).
6. States: the button disables while publishing; if the connection fails the draft is kept as `Saved on this phone` and is never published silently; failure shows Retry and keeps the text.
7. Errors: an empty title or a message over the limit shows an inline message. Duplicate publishing (double tap) creates one announcement.
8. Audit: publisher, time, text, the Important flag and the number of people notified by each channel are written to the audit log.
9. Accessibility and language: labels are visible, the text keeps the language the publisher typed (members read it as written), and the interface around it follows the viewer's language. Targets are at least 48 by 48 dp.

**Data:** Announcement (Publication), Group, Notification, Audit entry.
**Depends on:** GRP (permission, membership), NTF (push, SMS, SMS budget), XCT (draft behaviour).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether announcements may carry one image or file (default proposed: text only). Whether the same announcement can be published in several languages by the publisher.

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
1. The list shows pinned announcements first (ANN-03), then the rest newest first. Each row shows title, the first lines, the publisher's name, the time, and an `Important` marker with icon and text where set.
2. Unread announcements carry a marker with text and an unread count on the group home and the group navigation. Opening an announcement marks it as read; "Mark all as read" is one tap.
3. Tapping a push notification opens the announcement directly, even when it is old, withdrawn or hidden, showing the right state (`announcement.withdrawn`, `announcement.hidden`).
4. The publisher and any holder of Publication: announce to group see `Seen by 18 of 25`; ordinary members do not see who has read it. Names of people who have not read are never shown to others (no shaming).
5. Empty state: `announcement.list.empty`, with a "New announcement" button only for people who may publish.
6. Offline: the list loads from cache with a `Last synced` time and the unread state is kept; new items appear when the connection returns. Reading does not need a connection once the item is cached.
7. Loading shows skeleton rows. A very long announcement is shown in full on its own page, not truncated.
8. The list never shows an announcement from a group the person has left.
9. Accessibility and language: the unread marker is never colour alone, the page reads in order with a screen reader, and the layout reflows at 320 px.

**Data:** Announcement, Read state, Membership.
**Depends on:** ANN-01, GRP, XCT (cache, last synced, deep links).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether read counts are useful or invite pressure; to test. Whether an announcement can have an expiry date after which it leaves the list.

---

### ANN-03 Pin, correct or withdraw an announcement

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group (pin, edit own, withdraw own); Publication: moderate (hide any)
**Tags:** audit

**Story:** As a member who announces to the group, I want to pin an important announcement, fix a mistake or take it down, so that members see the right message at the top.

**Conversation:** Pinning keeps a standing message visible, such as a bank detail change or a contribution rule, without republishing. Because announcements can concern money, edits must be visible so nobody is misled, and a hide by a moderator is a distinct action with a reason. These rules follow the append-only habit used elsewhere (conventions section 2, by analogy) and the report-and-hide idea in raw/05 section 2.7.

**Preconditions:** The announcement is published and the person holds the required permission.
**Trigger:** The person opens the announcement's menu.

**Acceptance criteria:**
1. "Pin" puts the announcement at the top of the list and the group home, limited to ANN_MAX_PINNED; pinning beyond the limit asks which to unpin (`announcement.pin.limit`). "Unpin" returns it to its date position.
2. "Edit" is available to the publisher. A saved edit shows `Edited {time}` to everyone, and one tap shows the earlier text. A material edit does not re-notify unless the editor chooses `Tell the group` (`ntf.announcement.edited.push`).
3. "Withdraw" is available to the publisher; the announcement leaves the list and shows `Withdrawn by {name}` where it was opened from a link, and the text is kept in the audit log.
4. A holder of Publication: moderate can hide any announcement with a reason; it shows `Hidden by a moderator` and the reason to the publisher.
5. A pin, edit, withdraw or hide never changes the audit record of the original text.
6. Offline: pin, edit and withdraw are blocked with an explanation (they change what others see).
7. Errors: two people editing at once get the latest saved version and a conflict message; no silent overwrite.
8. Audit: each action stores actor, time, reason (for hide) and, for edits, old and new text.
9. Accessibility and language: pinned state is shown by an icon and text; menu actions are labelled with words.

**Data:** Announcement, Audit entry, Notification.
**Depends on:** ANN-01, ANN-02, GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether editing is limited to a time window. Whether a group wants more than one person to pin.

---

### ANN-04 Start a special contribution campaign inside the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group and Wallet: deposit on the destination wallet (to confirm; no campaign permission exists)
**Tags:** legal-gate, ledger, audit

**Story:** As a member who may announce to the group, I want to start a campaign with a goal, a deadline and a reason, so that members can give toward one cause and everyone sees the progress.

**Conversation:** The special contribution campaign inside a group (goal, deadline, wallet pot, ledger, receipts, final report) is the cheapest, safest first step for donations because it reuses contribution and vote primitives and the givers are members (raw/05 section 4.6; competitive-analysis section 7). Evidence says: show the rule for an unmet goal before payment; never default-select a tip; show fees as a line item (raw/05 section 4.6, GoFundMe and HelloAsso complaints in 4.2 and 4.5). The legal position of collecting funds in the group wallet is unconfirmed, so the tag `legal-gate` applies and the story cannot ship before it is cleared. A business rule that requires a vote before a campaign above an amount is an open question.

**Preconditions:** The person belongs to the group, holds the permissions above and the group has a wallet that can receive.
**Trigger:** The person taps "New campaign" on the group home.

**Acceptance criteria:**
1. The form asks for: name (required), the reason in a short description (required), goal in whole ariary (required, integer, shown as `1 000 000 Ar`), deadline (required, absolute and relative as `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`, within CAMPAIGN_MIN_DURATION and CAMPAIGN_MAX_DURATION), destination wallet (one group wallet), an optional suggested amount per member, and a choice of what happens if the goal is not reached by the deadline.
2. That choice has two options: keep the money and use it as described, or give it back to each contributor. It is mandatory, has no default, and is shown to contributors before they pay (ANN-05).
3. The review step shows the campaign as members will see it, with the unmet-goal rule in plain words (`campaign.rule.keep`, `campaign.rule.refund`) and the sentence that nobody pays more than the amount they enter (no tip, no added fee from Gereo; any payment-rail fee is shown on the payment screen).
4. On `Start the campaign` the campaign becomes Open and an announcement (ANN-01) is published automatically with `ntf.campaign.started.push`; members without the app receive `ntf.campaign.started.sms` if the group's SMS rules allow it.
5. After the first confirmed contribution, the goal, the destination wallet and the unmet-goal rule are locked. The deadline may be extended with a reason, up to CAMPAIGN_MAX_EXTENSIONS, and the description may be added to (appended), never rewritten.
6. If the group requires a vote before campaigns above a set amount (business rule, parameter), the form links to a vote (VOT-01) and the campaign opens only when it passes.
7. States: the button disables while saving; offline the form saves as a draft `Saved on this phone` and does not publish; a failed save keeps all fields and shows Retry.
8. Errors: a goal of zero or below CAMPAIGN_MIN_CONTRIBUTION, a deadline outside the limits or no unmet-goal choice show inline messages. The permission check blocks anyone who cannot receive into the chosen wallet.
9. Audit and ledger: creation, every edit, extension and the locked fields are written to the audit log with actor and time; the campaign itself writes no ledger entry.

**Data:** Campaign, Wallet (reference), Announcement, Vote (optional link), Audit entry, Notification.
**Depends on:** ANN-01, GRP (permissions), WAL (destination wallet), VOT-01 (optional), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission governs creating a campaign (proposed: a dedicated one). Whether a destination must be a dedicated sub-wallet or tagged ledger entries in an existing group wallet (proposed: tagged entries, so balances stay visible in one place). The legal opinion on collecting funds in the group wallet. Whether creating a campaign above an amount needs a vote.

---

### ANN-05 Give to a campaign

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none beyond membership of the group; money-in needs a verified identity at the right tier
**Tags:** legal-gate, ledger, audit, offline

**Story:** As a member, I want to give an amount of my choice to a campaign and see that it was received, so that I help my group and trust where the money went.

**Conversation:** Contributions are balanced ledger entries from the member's wallet to the group wallet, tagged with the campaign (conventions section 2). The payment screen must show source, amount, fee and total on one screen, the button labelled with action and amount (design-foundations section 4; raw/07 section 2.4). Gereo never adds a tip or a default add-on, because those are what turned GoFundMe and HelloAsso reviewers against them (raw/05 sections 4.2 and 4.5). A list of contributors is shown, but non-contributors are never listed, to avoid shaming (raw/07 R-NT8). Money-in follows the Vanilla Pay rail and its states.

**Preconditions:** The campaign is Open. The member has a wallet or can deposit; identity is verified at the tier required for money-in.
**Trigger:** The member taps "Give" on the campaign page.

**Acceptance criteria:**
1. The page shows the campaign, goal, progress, deadline and the unmet-goal rule in plain words before the amount field. A suggested amount, if set, is a visible hint and not preselected.
2. The member types a whole-ariary amount (at least CAMPAIGN_MIN_CONTRIBUTION). The review screen shows source wallet, amount, any rail fee as its own line, total and balance after, and the button reads `Give 20 000 Ar`. There is no tip and no default add-on.
3. PIN is required, with the amount and campaign repeated on the PIN screen. If the wallet balance is short, the member is offered the deposit flow (WAL) and returns to the review screen.
4. The contribution is a transaction with a reference ID and the statuses Initiated, Pending, Confirmed, Failed, Cancelled. Pending states what happens next; Failed states whether money moved. Only Confirmed counts toward progress.
5. A Confirmed contribution writes one balanced ledger entry from the member's wallet to the destination wallet, tagged with the campaign, with the campaign name as its reason, visible in the group ledger to people who can view history.
6. A double tap or a retry creates one transaction (idempotency). A contribution initiated before the close and confirmed after it is counted (open question, see end).
7. Offline: money-in is online only; the button is disabled with an explanation, and the member can choose "Remind me when I am online" (`ntf.campaign.remind_me.push`).
8. Errors: provider unavailable shows a clear banner and the contribution stays Pending or is not created; closed campaign shows `campaign.error.closed`; the member who is below the identity tier is guided to the step that unlocks it (ACC).
9. Audit and ledger: each contribution, status change, device and time are stored; names of contributors are shown to members, and a member may hide their name from the contributor list (open question).

**Data:** Contribution (campaign), Transaction, Ledger entry, Wallet, Campaign, Audit entry.
**Depends on:** ANN-04, WAL (wallet, deposit, transaction states, ledger), CON (contribution payment flow), ACC (PIN, identity tier), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a contribution confirmed after the close counts. Whether members can hide their name. Whether direct mobile-money payment into the campaign (without a prior deposit) is offered.

---

### ANN-06 Get a receipt for every contribution

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none (own contribution)
**Tags:** sms, ledger, offline

**Story:** As a contributor, I want a receipt with a reference number, by app and by SMS, so that I can prove what I gave without calling the treasurer.

**Conversation:** Receipts and reference IDs on everything money-related are a design principle (design-foundations section 3 principle 1; raw/07 section 2.3), and SMS is mandatory for payment receipts (raw/07 section 4 R-SMS1 to R-SMS4). The research lists receipts as one of the five parts of a group campaign (raw/05 section 4.6). Receipts must be readable offline, and a failed attempt must say that no money moved.

**Preconditions:** A contribution reached a final status (Confirmed, Failed or Cancelled).
**Trigger:** The status change.

**Acceptance criteria:**
1. On Confirmed the contributor receives `ntf.campaign.receipt.push` and, if the push is not opened within a parameter or there is no device, `ntf.campaign.receipt.sms` containing amount, campaign name (shortened), date and reference, in one GSM-7 segment (160 characters) in each language.
2. The in-app receipt shows reference ID, campaign, amount, fee, wallet used, date and time, and status as word, icon and colour. It is available from the transaction list and from the campaign page under "My contributions".
3. The receipt is cached and readable offline, with `Last synced`, and can be shared as text, and as an image or PDF where the phone allows it (raw/07 section 4).
4. A Failed or Cancelled attempt produces a notice that states plainly whether money moved (`campaign.receipt.no_money_moved`) and the next action.
5. A refund (ANN-07 when the rule is to give back) produces its own receipt, linked to the original by reference.
6. Receipts are never sent for Pending status; a Pending contribution shows what happens next in the app only.
7. The contributor can see the total they gave to each campaign.
8. Audit and ledger: each receipt links to its ledger entry; resending a receipt is logged; the receipt is never edited, a correction is a new receipt linked to a reversing entry.
9. Accessibility and language: the SMS and the receipt use straight apostrophes, no emoji and no characters that would push an SMS to 70 characters per segment; amounts read `20 000 Ar` in all three languages.

**Data:** Transaction, Ledger entry, Notification, Campaign.
**Depends on:** ANN-05, WAL (transaction and ledger), NTF (push, SMS, GSM-7 lint), XCT (offline cache).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the receipt is a legal document or only a proof of payment inside Gereo (needs the legal opinion). Retention period for receipts.

---

### ANN-07 Follow the campaign's progress and close it

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member, and System at the deadline
**Permission needed:** Group: view group (see); the campaign's creator or a holder of the same permissions as ANN-04 (close early)
**Tags:** legal-gate, ledger, audit, offline

**Story:** When a campaign is running, I want to see how much has come in and when it ends, and when it ends I want it to close cleanly and follow the rule everyone saw, so nobody argues about what happens to the money.

**Conversation:** Progress is computed only from confirmed ledger entries, so the number is real (info.md "Registre comptable en temps réel"). The unmet-goal rule shown before payment must be applied exactly (raw/05 section 4.6). A refund moves money back, and the design rule "no single administrator can move group funds" applies, so the refund goes through the group's approval flow (competitive-analysis section 7). That is an open question to confirm.

**Preconditions:** A campaign exists.
**Trigger:** Opening the campaign; the deadline; the creator taps "Close now".

**Acceptance criteria:**
1. The campaign page shows a headline sentence from message keys (amount raised against goal, number of contributors, time left in absolute and relative form) and a progress bar with a text equivalent. Only Confirmed contributions count.
2. The contributor list shows names and amounts to members (subject to the hide-name open question) and never lists people who have not given.
3. When the goal is reached the page shows `Goal reached` and the campaign continues until its deadline, unless the creator closes it (default; open question).
4. At the deadline the system closes the campaign; the creator can also close early with a confirmation that shows totals. After close, no contribution is accepted (ANN-05).
5. On close with the goal reached, or with the keep rule, the funds stay in the destination wallet and the report becomes due (ANN-08).
6. On close with the goal not reached and the refund rule, the system prepares one refund per contributor and submits them as an expense request that needs the same approvals as any outflow (SPD); no refund is paid until approved, and each refund writes its own ledger entry and receipt (ANN-06).
7. Members receive `ntf.campaign.closed.push` with the result in plain words; the same message goes by SMS to people who do not open the push, within the group's SMS cap.
8. Offline: the page loads from cache with `Last synced` and a note that numbers may have changed. Closing is online only.
9. Audit and ledger: closing mode (deadline or manual), actor, time, totals and the rule applied are stored; refund entries reference the original contributions.

**Data:** Campaign, Contribution, Ledger entry, Expense request, Notification, Audit entry.
**Depends on:** ANN-04, ANN-05, ANN-06, ANN-08, SPD (refund approval), WAL, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a refund needs the group's approval flow (proposed: yes). Whether a campaign closes automatically when the goal is reached. Time zone of the deadline.

---

### ANN-08 Publish a report on how the money was used

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Publication: announce to group and the permission used to create the campaign (ANN-04)
**Tags:** legal-gate, ledger, audit

**Story:** As the member who ran a campaign, I want to publish what was spent and what is left, so that contributors see where their money went.

**Conversation:** A use-of-funds report is the fifth part of the group campaign and a mandatory step before the next withdrawal or the next campaign (raw/05 section 4.6). Transparency of money is the product's promise and M-Changa's credibility rests on accountability and refunds when appeals fail (raw/05 section 4.3). In the group the report links to real expense requests, not typed numbers.

**Preconditions:** The campaign is Closed and has received contributions.
**Trigger:** The creator opens the report prompt after close, or a reminder.

**Acceptance criteria:**
1. The report form shows, read only, the amounts raised, refunded (if any), spent through linked expense requests (list with link to each) and remaining in the wallet, taken from the ledger, so the totals cannot be typed.
2. The creator adds a short written account (required) and may attach photos or receipts under the attachment rules (PRJ-07).
3. On `Publish the report` the report becomes visible to all group members, an announcement is posted and the group receives `ntf.campaign.report.push`.
4. The report is due within CAMPAIGN_REPORT_DEADLINE after close. The creator receives `ntf.campaign.report_due.push` before and after the date.
5. While a report is overdue or missing, the same person cannot start another campaign (`campaign.error.report_missing`); whether withdrawals from the destination wallet are also blocked is an open question.
6. A report is not edited. Corrections are added as dated addenda, each with a reason, and the original stays visible.
7. If the remaining amount does not match the ledger (for example expense requests still open), the form shows the gap and does not let the creator hide it; it can be published with the gap marked.
8. Audit and ledger: the report, addenda, attachments, author and time are stored; the report reads from the ledger and writes none.
9. Accessibility and language: figures use space grouping, never clip at 200% font size and read in the same wording as the campaign page; the account keeps the language it was typed in.

**Data:** Campaign, Report, Expense request, Ledger entry (read), Document, Announcement, Audit entry.
**Depends on:** ANN-07, SPD, WAL, PRJ-07, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a report may be required to be approved by a second member. Whether overdue reports block withdrawals. Retention of attachments.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| ANN-01 | Publish an announcement to the group | P1 | GRP, NTF, XCT |
| ANN-02 | Read the group's announcements and see what is new | P1 | ANN-01, GRP, XCT |
| ANN-03 | Pin, correct or withdraw an announcement | P2 | ANN-01, ANN-02, GRP |
| ANN-04 | Start a special contribution campaign inside the group | P1 | ANN-01, GRP, WAL, VOT-01, NTF |
| ANN-05 | Give to a campaign | P1 | ANN-04, WAL, CON, ACC, NTF |
| ANN-06 | Get a receipt for every contribution | P1 | ANN-05, WAL, NTF, XCT |
| ANN-07 | Follow the campaign's progress and close it | P1 | ANN-04, ANN-05, ANN-06, ANN-08, SPD, WAL, NTF |
| ANN-08 | Publish a report on how the money was used | P1 | ANN-07, SPD, WAL, PRJ-07, NTF |

Count: 8 stories. P0: 0. P1: 7 (ANN-01, 02, 04, 05, 06, 07, 08). P2: 1 (ANN-03). The epic is MVP scope but not part of the core loop; campaign stories also depend on clearing the `legal-gate`.

## Cross-epic dependencies

Other epic files did not exist when this file was written. Names are the binding reference; IDs are to be reconciled.

- ACC: PIN, identity tier for money-in, language preference, device state for push versus SMS.
- WAL: group wallet as destination, member wallet as source, deposit flow, transaction states and reference IDs, ledger entries tagged with a campaign, ledger view and receipts.
- RUL: none. Whether a campaign can feed a split rule is out of scope.
- GRP: Publication permissions (publish, announce to group, moderate), group wallet permissions, module enablement, membership join and leave.
- CON: contribution payment flow and its confirmation states reused by ANN-05; contribution tracking per member stays in CON and is not mixed with campaigns.
- SPD: expense requests for refunds (ANN-07) and for spending campaign funds (ANN-08), approval statuses.
- VOT: VOT-01 optional vote before a large campaign; votes may be mentioned in announcements.
- NTF: push and SMS templates for every `ntf.announcement.*` and `ntf.campaign.*` key, GSM-7 lint, SMS cap and cost owner, quiet hours.
- XCT: offline cache, `Last synced` banner, language, accessibility, receipts offline.
- OPS: reconciliation of campaign totals against the ledger, support for disputed contributions and refunds.
- PRJ: PRJ-07 attachments used by the report; a campaign linked to a project is an open question.
- EVT: none.

## Open questions

1. Legal opinion on collecting funds from members into a group wallet (tag `legal-gate`), on the status of a receipt, and on refunds. Madagascar has no equivalent text on public fundraising that the research could find (raw/05 section 4.5, gap).
2. Which permission creates a campaign; the table has none (ANN-04). A dedicated permission is proposed.
3. Destination: a dedicated sub-wallet or tagged entries in an existing group wallet (ANN-04); tagged entries proposed.
4. Does a refund need the group's approval flow (ANN-07)? Proposed: yes, because no single administrator moves group funds.
5. Whether a contribution initiated before the deadline and confirmed after counts (ANN-05).
6. Whether contributors can hide their names from the contributor list (ANN-05) and whether non-contributors are ever shown (proposed: never).
7. Whether a campaign above an amount needs a vote first (ANN-04) and the amount.
8. Whether overdue use-of-funds reports block the next campaign only, or also withdrawals (ANN-08).
9. SMS: whether `Important` announcements may use SMS, the cap, and who pays (ANN-01, NTF).
10. Whether announcements may carry an image or file, and whether the publisher may add translations (ANN-01).
