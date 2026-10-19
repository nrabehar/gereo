# GRP: Groups, membership and permissions

Epic code GRP, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, rules). Evidence is cited in each Conversation as research file plus section.

Evidence shorthand used below: `R01` = [raw/01-group-savings.md](../../research/raw/01-group-savings.md), `R04` = [raw/04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md), `R07` = [raw/07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md), `R08` = [raw/08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md), `CA` = [competitive-analysis.md](../../research/competitive-analysis.md), `DF` = [design-foundations.md](../../research/design-foundations.md).

## Shared definitions for this epic

There are no roles in the system. A membership carries individual permissions only. A "bundle" is a named checklist of permissions used as a shortcut when granting; applying a bundle writes individual permissions and nothing else. Whether a person "matches" a bundle is computed for display only.

Permission names are exactly those of section 7 of the conventions. Any need that has no permission name there is flagged in Open questions rather than invented.

**Bundles (contents are the prefilled defaults, always editable before they are applied):**

| Bundle (plain name) | One-sentence description | Permissions it writes |
| --- | --- | --- |
| Member | Sees everything the group does and takes part | Group: view group. Wallet: view balance, view history, deposit. Contribution plan: view. Vote: view, vote. Event: view. Project: view. Document: view |
| Treasurer | Member, plus runs the money day to day. Cannot change who has access | Everything in Member, plus Wallet: initiate spend, approve spend, edit rules, export history. Contribution plan: edit, exempt member, send reminder |

The Treasurer bundle deliberately excludes grant permission, revoke permission, remove member, delete group and close (wallet), so the person who runs the money does not also control access.

**Permission classes used by the safeguards:**

- Money-out permissions: initiate spend, approve spend, edit rules, close (wallet). Granting any of them asks for the grantor's PIN.
- Continuity-critical permissions (parameter `grp.continuity_permissions`, default list): approve spend, grant permission, revoke permission, remove member. The group must always keep at least one holder of each, and at least two holders of approve spend while any group wallet holds money or has money in flight.

**Configurable parameters (no value is decided here; each is a setting or an open question):**

| Parameter | Meaning |
| --- | --- |
| `grp.name_max_length`, `grp.purpose_max_length` | Field limits |
| `grp.max_groups_per_user` | Groups one person may create |
| `grp.invite_link_ttl`, `grp.invite_link_max_uses`, `grp.invite_resend_cooldown` | Invite link life, use cap, resend spacing |
| `grp.threshold_bands` | Amount bands with approval counts or vote requirement |
| `grp.leave_obligation_policy` | What happens to unpaid contributions when someone leaves |
| `grp.archive_grace`, `grp.delete_grace`, `grp.retention_period` | Grace periods and record retention |
| `grp.max_wallets_per_group` | Wallets in one group |

Fixed product rule (not a parameter): a group wallet never pays out on the action of one person alone. The floor of two distinct people cannot be lowered by any group, any permission holder or any operator.

---

### GRP-01 Start a group for the people I save with

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (becomes Group founder)
**Permission needed:** none
**Tags:** legal-gate, ledger, audit

**Story:** As an individual, I want to create a group with a name, a purpose and a first wallet, so that the people I save with have one shared place for money and decisions.

**Conversation:** The founding problem is a group that runs on calls and hand calculation (info.md, problems 1 and 8). Three fields only; plan and split rules come later from a checklist so a group exists in about a minute (R04 section 14.6 risk 7, "project in 60 seconds"; R07 section 5.2 forms). Group wallets use the same wallet model as personal wallets (CA section 5 differentiators). Not decided: which identity tier is needed to create a group that will hold money (CA section 6 constraint 8); this carries `legal-gate` because a group wallet may constitute holding client funds.

**Preconditions:** Signed in with phone and OTP (ACC). **Trigger:** Taps "Create a group" on home or on the empty groups list.

**Acceptance criteria:**
1. Happy path: the person enters a group name (required, up to `grp.name_max_length`), a purpose of one or two sentences (required, up to `grp.purpose_max_length`, shown to invitees in GRP-04) and a first wallet name (prefilled from message key `grp.wallet.default_name`) with one of the four wallet types (budget, savings, investment, business). Currency is Ariary and not editable. The primary button reads "Create group". After success the person lands on the new group home (GRP-06).
2. Rule: the group is created with the person as its only member holding every permission (GRP-02), and the wallet belongs to the group with a balance of 0 Ar. Group names need not be unique; if the person already has a group with the same name a soft warning is shown, not a block. Reaching `grp.max_groups_per_user` shows the limit and the next action.
3. Rule: the new wallet accepts deposits (subject to identity tier in WAL) but cannot pay out until the safeguard is satisfied (GRP-13). The post-creation checklist shows "Invite members", "Add a second person who can approve spending" and "Set the contribution plan", each deep-linking to its screen.
4. States: while submitting the button is disabled with a progress label and the request carries an idempotency key, so a retry never creates two groups. Offline: the form can be filled and is kept as "Saved on this phone"; Create is disabled with a plain explanation that creating a group needs a connection.
5. Errors: validation messages are inline, per field, name the fix and never use "invalid". On server failure the input is kept and the message reads "We could not create the group. Nothing was created." with a Try again button. No money moves in any case.
6. Notifications: none to other people. The founder sees an in-app confirmation (`msg.grp.group_created.inapp`).
7. Ledger and audit: one audit entry `group.created` (who, when, group id, name), plus one audit entry per permission written at creation with actor "system at creation" (GRP-02). The wallet's ledger account is created with no entry.
8. Accessibility and language: every field has a visible label, 48 dp targets, a character counter announced to screen readers; helper text and the prefilled wallet name exist in Malagasy, French and English. A line shows how the name will look inside an SMS, which uses a GSM-7 safe, shortened form (NTF-07).

**Data:** Group, Membership, Wallet, Audit entry. **Depends on:** ACC sign-in, WAL wallet creation.
**Pages:** to be filled from the information architecture.
**Open questions:** Identity tier required to create a group; whether group creation is allowed before the legal basis for holding funds is confirmed.

---

### GRP-02 Start with every permission, and say so

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Group founder
**Permission needed:** none (written by the system at creation)
**Tags:** audit

**Story:** As a group founder, I want to start with all permissions and see plainly what I can do, so that I can set the group up alone and then hand out duties without a hidden "owner" status.

**Conversation:** The brief says the founder starts with all permissions and can grant and revoke (conventions section 3). There is no owner role, so the founder is only the first holder, and being first creates no power that the permissions do not give (info.md "Permissions": relations never carry power). The research warns against "a single person who both runs the group and holds the keys" (R08 section 6.4 avoid; R01 section 13 risk 1, Cameroon losses). So the founder screen explains that money-out still needs a second person.

**Preconditions:** A group was just created (GRP-01). **Trigger:** First opening of the group by the founder.

**Acceptance criteria:**
1. Happy path: at creation the founder is granted every permission of the Group, Wallet, Contribution plan, Project, Vote, Event, Document and Publication objects in section 7 of the conventions, at group level so they inherit to wallets, projects and documents created later.
2. A first-run card reads in plain words "You can do everything in this group right now. Money cannot leave the wallet until a second person can approve it." with two buttons, "Add an approver" (GRP-08) and "Invite members" (GRP-03). It can be dismissed and stays reachable from the checklist.
3. Rule: the group records "created by Sara on 12 Oct" as a historical fact only. No screen, rule or API treats the creator as having any power beyond held permissions.
4. Rule: the founder can later revoke any of their own permissions, including all of them, subject only to the safeguards in GRP-13 and GRP-14.
5. Rule: the founder's permissions are visible to every member who can view permissions (GRP-09), so nobody has hidden power.
6. States: loading shows a skeleton for the card; the card text is cached and readable offline; if the group is no longer new (other holders exist) the card is replaced by the normal home content.
7. Errors: if the permission write fails at creation, the group is not left half-created: the whole creation fails with the GRP-01 error and no group exists.
8. Ledger and audit: one audit entry per permission written, each with actor "system at creation", target the founder, timestamp. No ledger entry.

**Data:** Membership, Audit entry. **Depends on:** GRP-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a founder should be asked to confirm they understand the money-out safeguard before the first invite.

---

### GRP-03 Invite people by link or by phone number

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds invite member)
**Permission needed:** invite member (group)
**Tags:** sms, audit

**Story:** As a member who can invite, I want to invite people with a link I can share in WhatsApp or by their phone number, so that the whole group joins without anyone typing long forms.

**Conversation:** Groups already live in WhatsApp, and Gereo should be the record that chat links into (R04 section 14.2). Stanbic invites by SMS and by phone book and lets the invitee review rules first (R01 section 2; R08 section 6.11). Tricount's link grants full rights, which is acceptable for splitting expenses but not for custody (R08 sections 6.4 and 6.11 avoid). So here a link only opens the limited preview (GRP-04) and never grants access by itself.

**Preconditions:** Group exists, the person holds invite member. **Trigger:** Taps "Invite" on the member list or on the setup checklist.

**Acceptance criteria:**
1. Happy path, link: "Share link" creates a unique link and opens the phone's share sheet with a short ready message (`msg.grp.invite_share.text`, three languages). The link opens the limited preview (GRP-04). Joining gives the Member bundle only.
2. Happy path, phone: the person types a number or picks one from the phone book (contacts access is optional and contact data is never uploaded), selects the SMS language (default the group's language) and sends. The invitee receives an SMS (`msg.grp.invite_received.sms`) with the inviter's first name, the group name and the link.
3. Rules: links expire after `grp.invite_link_ttl`, can be capped by `grp.invite_link_max_uses`, and can be revoked at any time by any holder of invite member. A phone invite is bound to its number: opened from another number it shows "This invite was sent to another number" with a Request access button (the inviter is notified and decides).
4. Rules: a holder can invite only up to the Member bundle unless they also hold grant permission, in which case a bundle can be chosen at invitation. A number already in the group, or already invited, is refused with a plain message and a link to that member. Resending is limited by `grp.invite_resend_cooldown`.
5. States: the invited list shows each invite as Sent, Opened, Joined, Declined or Expired with the date. Empty state explains both ways to invite. Offline: sharing a link works from cache if one already exists; creating a new link or sending an SMS needs a connection and says so.
6. Errors: a number that fails the mobile number check is rejected with the expected format in plain words. If the group's SMS allowance is exhausted, phone invites show "SMS invites are paused for this group. Share the link instead." and the link path stays available (NTF-06). Nothing involving money happens.
7. Notifications: SMS to the invitee (`msg.grp.invite_received.sms`, GSM-7, 160 characters, paid from the group's SMS allowance); push to the inviter when the invite is accepted or declined (GRP-04). If the invitee already has the app, the invite also appears in their notification centre.
8. Audit: `membership.invited` (inviter, channel link or phone, masked number, bundle, time), `invite.revoked`, `invite.expired`. A full phone number is stored in the invite record, not in the audit text.
9. Accessibility and language: the share message and the SMS exist in Malagasy, French and English and name no amounts; the phone field uses a numeric keypad and accepts pasted numbers with spaces.

**Data:** Invite, Group, Notification, Audit entry. **Depends on:** GRP-01, GRP-07, NTF-05, NTF-06, NTF-07.
**Pages:** to be filled from the information architecture.
**Open questions:** Default link lifetime and use cap; whether a link may be shared publicly in a group chat at all or must be one use per person.

---

### GRP-04 See the rules before I join, then join or decline

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor (becomes Member)
**Permission needed:** none (a valid invite)
**Tags:** audit, offline

**Story:** When someone sends me an invite to a group, I want to see who is asking, what the group is for, its rules and what I will be able to do before I commit, so I can decide to join or decline without risk.

**Conversation:** Stanbic lets the invitee read the group constitution before accepting (R01 section 2; R08 section 6.4 and 6.11 adopt: "Invitee sees a limited view before accepting"). The research also shows that fear of sending money to a digital entity blocks adoption (R04 section 14.6 risk 4), so the preview tells the person exactly what joining does and does not do. Joining needs only phone and OTP (conventions section 2); ID verification is asked later, at the first money step.

**Preconditions:** The person opened a valid invite link or the invite SMS. **Trigger:** Opens the link.

**Acceptance criteria:**
1. Happy path: the limited preview shows the group name, purpose, the inviter's name, the number of members and the group's rules in plain words: contribution amount and rhythm if a plan exists (CON), the spending approval rule ("Spending needs 2 approvals; above X Ar the group votes"), and that no single person can move group money. It shows no ledger, no balances and no member names other than the inviter.
2. The preview has a "What you will be able to do" list in verbs taken from the Member bundle ("See the balance and every transaction", "Vote", "See events and projects", "Pay your contributions") and a "What you will not be able to do" list ("Move group money", "Change who has access"). Both lists are generated from the bundle the invite carries (GRP-03).
3. Accept: the person signs in or signs up with phone and OTP (ACC), taps "Join this group", and lands on the group home. A membership with the bundle's permissions is created. Joining does not move money and does not require identity verification.
4. Decline: a "No thanks" button asks for an optional preset reason ("I do not know this group", "Not now", "Wrong number") and closes the invite. The invite link stays valid for others, and the person can still accept later while it has not expired.
5. Rules: opening a link never grants access before Accept. An expired, revoked or used-up link shows the reason and "Ask <inviter name> for a new link". A person already in the group is taken to the group home.
6. States: loading shows a skeleton and the group name first; offline: a preview opened earlier is shown from cache with its last synced time, and Accept shows "Your answer will be sent when you are connected. Nothing is joined yet." and is kept as "Waiting to send". Accept queued offline is never silent: it becomes a visible pending item.
7. Errors: if accepting fails the person stays on the preview with "We could not add you yet. Nothing has changed. [Try again]". A number-bound invite opened from another number shows the GRP-03 message.
8. Notifications: push to the inviter on accept (`msg.grp.invite_accepted.push`) or decline (`msg.grp.invite_declined.push`); an in-app item for holders of invite member; no SMS.
9. Audit: `membership.joined` (who, invite id, bundle written, time) and `invite.declined` with the preset reason code.
10. Accessibility and language: the preview is readable at 200% font scale and under 320 px without clipping, uses short sentences, and opens in the language of the invite SMS, with a visible language switch.

**Data:** Invite, Membership, Group, Audit entry. **Depends on:** GRP-03, ACC (phone and OTP sign-up).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the invitee may see the names of the people who hold approval permissions before joining.

---

### GRP-05 See who is in the group

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** view group
**Tags:** offline

**Story:** As a member, I want a list of everyone in the group and who can do what with money, so that I know who I am trusting.

**Conversation:** "Hidden admin power: the permission screen must show who can move money" (R08 section 6.11 avoid). Stanbic shows member statuses (R08 section 6.11) and the founding pain is not knowing who is in and who paid (info.md problem 1). Contribution status lives in CON; this list stays about membership. Member visibility of phone numbers is a privacy choice, so the default is masked.

**Preconditions:** Person holds view group. **Trigger:** Opens "Members".

**Acceptance criteria:**
1. Happy path: a list shows each member's display name, join date, and badges for what matters to everyone ("Can approve spending", "Can change who has access") shown with icon and words, never colour alone. The count of members is in the header.
2. Statuses: Active, Invited (pending, from GRP-03) and, in a separate collapsed "Former members" section, Left and Removed. Former members stay listed so past ledger lines and votes still show a name.
3. Search by name works offline on the cached list; the list can be sorted by name or join date.
4. Rules: phone numbers are masked to the last digits for everyone except holders of invite member or remove member, who need the full number to act. Members who hold approve spend are visible to every member with view group, not only to permission holders.
5. Tapping a member opens their member page with "Effective access" (GRP-09) for those allowed to see it, and "Remove" or "Change access" actions only for people holding the matching permission.
6. States: empty state for a group of one: "You are the only member. Invite people." with the invite button (needs invite member; otherwise "Ask <name> who can invite"). Loading uses skeleton rows. Offline shows the cached list with "Last synced" in the header.
7. Errors: if the list fails to refresh, the cached list stays visible with "Could not update. [Try again]". If the person lost view group, the screen explains which permission is missing and names who can grant it (holders of grant permission).
8. Notifications: a new member appears in the list; the in-app feed item `msg.grp.member_joined.inapp` is batched (NTF-08); no push or SMS by default.
9. Accessibility: each row is one focusable item announcing name, status and badges; targets 48 dp; badges have text labels.

**Data:** Membership, User, Invite. **Depends on:** GRP-01, GRP-03, GRP-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Who may see full phone numbers; whether display names can be pseudonyms.

---

### GRP-06 Open the group and see where things stand

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** view group (balance tile also needs view balance)
**Tags:** offline

**Story:** When I open my group, I want one page that shows the balance, what is waiting for me, who has paid and what is coming next, so I can see in ten seconds whether I need to do anything.

**Conversation:** The dashboard is headline sentences plus a ranked list, not a chart wall (DF section 4 "Groups and rules"; R07 section 8.1 recommended hierarchy). "12 of 15 members have paid this month" is the model sentence. Every competitor with member-visible balances treats it as table stakes (R01 section 13). A visible "ledger equals provider balance as of hh:mm" line is an opportunity nobody documents (R08 section 6.4), included here as an optional line fed by OPS.

**Preconditions:** Person is a member. **Trigger:** Opens a group.

**Acceptance criteria:**
1. Happy path: the home shows, in this order: (a) the group balance in ariary with the "12 500 Ar" format and a status word, (b) "Waiting for you" with pending approvals (SPD) and open votes (VOT) that need this person, each deep-linking to the item, (c) the contribution board summary as a sentence ("12 of 15 have paid this month") linking to CON, (d) the next event (EVT) and (e) the last three ledger lines.
2. Rule: each tile appears only if its permission is held. A missing permission shows a short note naming the permission and who can grant it ("You cannot see the balance. Ask Mamy or Sara.") instead of an empty or hidden space.
3. Rule: if the group fails the safeguard (GRP-14) a banner on top says money cannot leave until a second person can approve, with a link to fix it (holders of grant permission) or the names to ask (everyone else).
4. States: new group: a setup checklist (invite, second approver, contribution plan) replaces the empty tiles. Loading: skeleton tiles, balance first. Partial failure: a tile that fails shows its own small error and Retry while the others render.
5. Offline: the page renders from cache with a single header line "Updated 14:05" (no word "offline"); balances older than the stale threshold (starting value 24 h, parameter) carry a "may be outdated" badge.
6. Rule: balance and the ledger lines are computed from the ledger. If a ledger line is Pending or Needs attention the tile shows that status word and what happens next.
7. Errors: if the balance cannot be loaded the tile shows "We could not load the balance. No money has moved. [Try again]" with the last known value and its time.
8. Notifications: none from this page; its counters mirror the notification centre badges (NTF-01).
9. Accessibility and language: headline sentences are real text, amounts never clipped at 200% scale, no information only in images; sentences exist in Malagasy, French and English.

**Data:** Group, Wallet, Ledger entry, Approval, Vote, Contribution, Event. **Depends on:** GRP-01, WAL ledger and balance, SPD approvals, VOT open votes, CON board, EVT next event, OPS reconciliation line (optional).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the reconciliation line is shown to all members or only to holders of view history.

---

### GRP-07 See what each kind of member can do, in plain words

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds grant permission)
**Permission needed:** grant permission, view permissions
**Tags:** audit

**Story:** As a member who can grant permissions, I want named bundles such as "Member" and "Treasurer" with a plain list of what they allow, so that I can set people up without learning permission names.

**Conversation:** The interface never shows roles in code, but people think in roles, so bundles carry plain names (DF section 3 principle 8; R04 section 14.6 risk 8). Stanbic's role matrix lists privileges without limits (R08 section 6.11 opportunity); we show consequences in one sentence, for example "Can move money up to the first spending limit with one more approver". A bundle is a prefilled checklist and can be changed before applying (conventions section 2).

**Preconditions:** Person holds grant permission and view permissions. **Trigger:** Opens "Access" in the group, or chooses a bundle while granting (GRP-08).

**Acceptance criteria:**
1. Happy path: the screen lists the bundles Member and Treasurer, each with a one-sentence description and a "What this lets you do" list written in verbs ("See the balance", "Propose and approve expenses", "Send contribution reminders"), no technical names.
2. Rule: contents are the defaults in the Shared definitions section of this file. The Treasurer bundle shows, in a separate "Not included" list, that it cannot change who has access, remove people or delete the group.
3. Rule: before applying a bundle the grantor sees every permission as a checklist and can untick items. Applying writes individual permissions only. The result is shown on the member page as "Treasurer, changed: cannot export history".
4. Rule: a person matches a bundle when their permissions are exactly its permissions; otherwise the member page lists the real permissions. Matching is computed at read time and never stored as a role.
5. Rule: a bundle that includes money-out permissions shows a notice "This lets <name> move group money. Spending still needs a second person." and requires the grantor's PIN on apply (GRP-08).
6. States: loading skeleton; offline: bundle definitions are static and readable from cache; applying needs a connection. Empty state for a group of one: the screen shows the bundles and "Invite someone first".
7. Errors: the grantor cannot apply a permission they do not hold themselves (GRP-08); the checklist disables such items with "You do not hold this permission".
8. Notifications: none from viewing bundles; granting notifies the person (GRP-08).
9. Accessibility and language: bundle names and verb lists exist in Malagasy, French and English and are reviewed by a native Malagasy speaker; the term for each concept is the same everywhere in the product.

**Data:** Bundle definition (static), Membership. **Depends on:** GRP-01, GRP-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether groups may save their own custom bundles (P2); which further bundles are needed for events, announcements and project work.

---

### GRP-08 Give or take away a single permission

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds grant permission or revoke permission)
**Permission needed:** grant permission, revoke permission
**Tags:** audit, legal-gate

**Story:** As a member who can manage access, I want to give or take away one permission at a time and see the effect before I confirm, so that nobody gets more or less power than I meant.

**Conversation:** Showing the diff and the effective result is what protects people from ACL mistakes (R07 section 8.5 R-PM1 to R-PM4; R04 section 13 "show the effective result"). Confirmation is reserved for money-out powers so it keeps meaning (R07 section 8.5 R-PM3). Every permission change is written to the audit log (conventions section 7; info.md, Permissions section, safeguards). Moving a money-out permission to another person may also be put to a vote (R07 R-PM5); this is an open question here.

**Preconditions:** Person holds grant permission to grant or revoke permission to revoke. **Trigger:** Opens a member page and taps "Change access".

**Acceptance criteria:**
1. Happy path: the grantor ticks or unticks permissions on a checklist grouped by object (Group, Wallet, Contribution plan, Vote, Event, Project, Document, Publication), with plain verb labels. A diff reads "Adding this lets Rado approve spending. This is new." or "Taking this away means Rado can no longer approve spending."
2. Rule: a person can grant only permissions they hold themselves. A person can revoke only if they hold revoke permission; revoking one's own permission is allowed, subject to GRP-13 and GRP-14.
3. Rule: any change touching money-out permissions asks for the grantor's PIN and shows the sentence "This lets <name> move group money. Spending still needs a second person." Other changes confirm in one tap without a PIN.
4. Rule: revoking approve spend voids that person's approvals on spend requests still pending and re-notifies the remaining approvers (approvals authorise exactly what was shown; DF section 3 principle 4). Revoking initiate spend cancels the person's pending requests with a visible reason.
5. Rule: revoking a continuity-critical permission is blocked if it would leave fewer holders than the group needs (GRP-14); the screen says why and offers the fix.
6. States: saving shows a progress state; offline disables saving with an explanation (permission changes are online only); the new permissions take effect immediately on success and the member page refreshes.
7. Errors: on failure nothing changes and the message states "No permission was changed" with Try again; stale data (someone else changed the same person's access meanwhile) shows both versions and asks to review instead of overwriting.
8. Notifications: the affected person gets push (`msg.grp.permission_granted.push` or `msg.grp.permission_revoked.push`) and an in-app item; for money-out changes the SMS fallback applies if the push is not opened (NTF-05). Holders of view permissions see an in-app feed item, no push.
9. Audit: `permission.granted` or `permission.revoked` with grantor, target, permission name, object, time, and the previous and new effective access. No ledger entry. Entries cannot be edited or deleted.

**Data:** Membership, Audit entry, Approval (voided). **Depends on:** GRP-07, GRP-13, GRP-14, SPD approvals, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether granting approve spend must be acknowledged by a second holder of grant permission; whether a vote can be required to grant money-out permissions.

---

### GRP-09 See what a person can and cannot do right now

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none for one's own panel; view permissions for others
**Tags:** audit, offline

**Story:** When I wonder why I cannot do something, or when I want to check someone's access, I want an "Effective access" panel that lists what the person can and cannot do and why, so I can fix it or trust it.

**Conversation:** An experiment found effective-permission views beat rule lists, 83.6% against 56.5% accuracy (n=36) (R07 section 8.5; DF section 4). R-PM2 and R-PM7 in R07 section 8.5 ask for the source of each permission and a named person to ask. Inheritance must be visible ("Inherited from the group"; R04 section 13).

**Preconditions:** Person is a member. **Trigger:** Opens "What I can do here" or a member page, or follows a link from a blocked action.

**Acceptance criteria:**
1. Happy path: the panel shows two lists, "Can" and "Cannot", in verbs per object (for example "Approve spending", "Edit the contribution plan"), each can-line with its source: "From bundle Treasurer, changed", "Given by Sara on 12 Oct" or "Inherited from the group".
2. Rule: where business rules limit a permission, the line says so in words: "Approve spending. Requests above X Ar need 3 approvals" (from GRP-12). The panel shows these thresholds but does not edit them.
3. Rule: any member sees their own panel; seeing another member's panel needs view permissions. Cannot-lines name the permission and who holds grant permission ("You need 'Approve spending'. Ask Mamy or Sara.").
4. Rule: blocked actions anywhere in the product link to this panel, so a person is never left with a bare "Not allowed".
5. States: loading skeleton; offline shows the cached panel with its last synced time and a note that access may have changed since; empty panel for a person with no permissions shows "This person can only be seen by the group" and the reason.
6. Errors: if the permission service does not respond, the panel shows "We could not check this now. [Try again]" and never shows a guess; the UI makes no decision from a stale panel (the server enforces access).
7. Notifications: none.
8. Audit: viewing another member's panel is not audited; the data shown comes from the same permission check used to enforce access, so the panel cannot disagree with reality.
9. Accessibility and language: lists are headings with real list markup, state is conveyed by words and icons, and all verb phrases come from the same message keys as the bundles (GRP-07).

**Data:** Membership, Permission check results, Threshold settings. **Depends on:** GRP-07, GRP-08, GRP-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a "preview as member" mode (R07 R-PM6) is needed in the MVP.

---

### GRP-10 See who changed access, and when

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** view permissions (own history needs none)
**Tags:** audit

**Story:** As a member, I want a readable history of every access change in the group, so that I can see who gave or took away power and when.

**Conversation:** "Every permission change is written to the audit log and visible to authorised members" (info.md, Permissions section, safeguards; conventions section 7). R07 section 8.5 R-PM4: show who granted what and when, and let a member see their own access history. Group scandals in tontines come from hidden control (R01 section 5), so this view is a trust feature, not an admin tool. It is the plain-language face of the audit log in GRP-11.

**Preconditions:** Group exists. **Trigger:** Opens "Access history" in the group or on a member page.

**Acceptance criteria:**
1. Happy path: a vertical timeline lists each change as a sentence: "Sara gave Mamy 'Approve spending' on 12 Oct 14:05". Each entry shows actor, target, permission in plain words, date, time and the reference id.
2. Rule: holders of view permissions see the whole group history; any other member sees only entries about themselves.
3. Rule: filters by person and by permission class (money-out, continuity-critical, other); entries are append-only. A correction appears as a new entry, never an edit.
4. Rule: entries made by the system (creation, safeguard events such as GRP-14 blocks and approver shortage warnings) are labelled "System".
5. States: empty history shows "Nobody has changed access yet"; loading skeleton; offline shows cached entries with "Last synced"; paging loads older entries on demand.
6. Errors: a failure to load shows the cached entries and "Could not update. [Try again]".
7. Notifications: none; changes already notified the target (GRP-08).
8. Audit: reading the history is not audited; the entries are the audit entries `permission.granted`, `permission.revoked`, `membership.joined`, `membership.left`, `membership.removed`.
9. Accessibility and language: timeline entries are real text with absolute date and time, no information only by position, and are available in all three languages with member names left as entered.

**Data:** Audit entry. **Depends on:** GRP-08, GRP-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether people who left the group keep access to entries about themselves.

---

### GRP-11 Keep a complete audit log of group-level actions

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder; Gereo operator
**Permission needed:** view permissions (operator access is defined in OPS)
**Tags:** audit

**Story:** As a member who can view permissions, I want a full log of group-level actions beyond access changes, and as a Gereo operator I want the same log for investigations, so that disputes can be settled by facts.

**Conversation:** The brief requires a "complete audit log" as a non-functional rule (info.md, non-functional requirements table, security row) and the research ties fraud to unaccountable administrators (CA section 4 point 2). Open Collective's trail of states and comments is the benchmark (R08 section 6.7). This story defines what GRP writes; reading access for operators sits in OPS. The audit log records who did what; it does not duplicate the ledger (WAL).

**Preconditions:** Group exists. **Trigger:** A group-level action occurs or someone opens "Audit log".

**Acceptance criteria:**
1. Happy path: every action in this list produces exactly one entry with actor, target, group id, time and reference id: group created, edited, archived, restored, deleted; member invited, joined, declined, left, removed; permission granted and revoked; threshold changed; wallet created; safeguard blocks; invite revoked.
2. Rule: entries are append-only. A correction is a new entry that references the first. No user, holder or operator can edit or delete entries.
3. Rule: entries store identifiers and plain facts, never PINs, OTPs, full card or phone numbers (phone numbers appear masked).
4. Rule: holders of view permissions can search and filter by actor, target, action type and date range. Money movements are not listed here; each entry links to the ledger line or approval where it relates to one.
5. Rule: operator reads of the log happen with a recorded reason, and the operator's access is itself logged and shown to members as "Gereo support viewed the audit log" (details in OPS).
6. States: empty log can occur only before creation completes; paging for long logs; offline shows the cached latest entries with last synced time.
7. Errors: if an action cannot be logged, the action itself is refused and nothing changes ("We could not record this change, so it was not made").
8. Notifications: none from the log itself; entries do not produce messages.
9. Accessibility and language: the same sentence builder as GRP-10; entry type names are message keys in three languages.

**Data:** Audit entry. **Depends on:** GRP-08, GRP-10, OPS (operator access), WAL (ledger links).
**Pages:** to be filled from the information architecture.
**Open questions:** Retention period and legal basis for records (CA section 6 constraint 8 cites five years under Art. 53, unconfirmed); whether viewing the wider audit log should be a separate permission from view permissions.

---

### GRP-12 Set the amount above which more people must agree

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds edit rules)
**Permission needed:** edit rules (wallet)
**Tags:** legal-gate, audit

**Story:** As a member who can edit wallet rules, I want to set spending thresholds so that bigger payments need more approvals or a vote, so that the group's money is protected in proportion to the amount.

**Conversation:** Spending above a threshold requires the approval of several people or a vote (info.md, Permissions section, safeguards). Multi-approver spending is table stakes (CA section 5) and no consumer app documents its interface (R08 section 6.7 open opportunity; R07 section 8.4 R-AP4, "2 of 3 approvers needed"). Thresholds are business rules in product logic, not permissions (conventions section 7). The number of bands and amounts are group settings; nothing here fixes a value.

**Preconditions:** A group wallet exists; person holds edit rules on it. **Trigger:** Opens "Spending rules" on the group or wallet.

**Acceptance criteria:**
1. Happy path: the screen shows spending bands in plain sentences and lets the person edit them: "Up to X Ar: 1 approval from someone other than the requester. Above X Ar: 2 approvals. Above Y Ar: the group votes (VOT)." Amounts are whole ariary. A live line shows the effect for a sample amount.
2. Rule: the platform floor always applies underneath every band: at least one approval from a person other than the requester (GRP-13). A band can only add approvals or require a vote, never remove the floor.
3. Rule: a band cannot demand more approvals than the group can supply: requested count must not exceed the number of current holders of approve spend minus the requester. If it would, saving is blocked with "Only 2 people can approve. Add another approver or lower this number."
4. Rule: bands must be ordered and non-overlapping; setting a "vote required" band is possible only if the vote link to an expense is available (VOT); otherwise that choice is disabled with the reason.
5. Rule: tightening a rule (more approvals, lower amount) applies at once. Loosening a rule (fewer approvals, higher amount, removing a vote) is held as a proposed change that needs approval from the same number of people as the strictest band currently requires (parameter, to confirm), so one person cannot quietly weaken the protection.
6. Rule: requests already waiting keep the approval rule they were created under, shown on the request ("Rule when requested: 2 approvals"). Only new requests use the new rule.
7. States: saving state; offline disables saving with an explanation; empty state before any band is set shows the default floor in words and an "Add a band" button; stale data shows both versions as in GRP-08.
8. Errors: a failed save changes nothing and says so; nothing about money moves from this screen.
9. Notifications: holders of approve spend receive push when thresholds change (`msg.grp.threshold_changed.push`); a loosening proposal notifies the required approvers (`msg.grp.threshold_loosen_requested.push`) with SMS fallback if unread (NTF-05).
10. Audit: `threshold.changed` or `threshold.loosen_requested` and `threshold.loosen_approved` with before and after values, actor, approvers and time.

**Data:** Wallet rule (spending threshold), Audit entry. **Depends on:** GRP-13, SPD (approvals), VOT (linked vote), WAL.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission governs thresholds (edit rules is used here because no group-level equivalent exists); the exact approval count for loosening; whether thresholds are per wallet or per group.

---

### GRP-13 No single person can move the group's money alone

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member (protected); System (enforces)
**Permission needed:** none (rule applies to every outflow)
**Tags:** legal-gate, ledger, audit

**Story:** As a member, I want the product to guarantee that no single person can move group money alone, including the founder and Gereo staff, so that I can trust the group wallet.

**Conversation:** Administrator risk is the main failure of tontines and chamas: losses of 1M and 1.5M FCFA when an administrator vanished (R01 section 5), and "avoid any design where one admin holds the wallet keys" (R01 section 13 risk 1; CA section 7 design rules). Tonti+ blocked admin self-payout (R01 section 5). This is a fixed product rule, not a setting. It is the group-side counterpart of the spending approval stories in SPD.

**Preconditions:** A group wallet exists. **Trigger:** Any attempt to move money out of a group wallet, including transfers to a personal wallet, wallet closure, scheduled payouts from rules and refunds.

**Acceptance criteria:**
1. Happy path: a spend from a group wallet is created by one person (initiate spend) and completes only after approval by at least one other person (approve spend). The review screen reads "Asked by Sara. Needs 1 more approval."
2. Rule: the requester can never count as an approver of the same request, even if they hold approve spend and even if they are the founder; there is no setting to allow it.
3. Rule: the server enforces the rule, not only the screens. A direct API call, a scheduled rule firing (RUL) or an operator action that would complete a group-wallet outflow with fewer than two distinct people is rejected with a stable error code, and no ledger entry is written.
4. Rule: money moving between wallets of the same group, to a personal wallet, or out to mobile money all count as outflows and need the same approvals; deposits and contributions in do not.
5. States: when the group has fewer than two people able to approve (one holder, or one has left), a banner says "Money cannot leave this wallet until a second person can approve it" and payout buttons are disabled with that reason; deposits and contributions continue to work. Loading and offline states for the banner follow GRP-06.
6. Errors: if an outflow is blocked the message states "No money moved" and names who could approve; the next action is a link to add or ask an approver (GRP-08).
7. Notifications: when the group drops below two approvers the holders of grant permission get push, with SMS fallback (`msg.grp.approver_shortage.push`, `.sms`); the banner stays until fixed.
8. Ledger and audit: each outflow's ledger entry stores the initiator and every approver with timestamps; a blocked attempt writes the audit entry `safeguard.blocked` with actor, attempted amount and reason; none writes a ledger entry.
9. Accessibility and language: the rule is explained in one sentence in all three languages and shown in the invite preview (GRP-04) and in the founder card (GRP-02).

**Data:** Ledger entry (initiator, approvers), Approval, Audit entry. **Depends on:** SPD (spend request and approval), WAL (ledger), RUL (scheduled outflows), OPS (no unilateral operator move).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether transfers between two wallets of the same group still need approval in the MVP (default here: yes); legal view on whether Gereo staff may ever act as a second approver (default: never).

---

### GRP-14 Keep the group from locking itself out

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder; System
**Permission needed:** revoke permission, remove member (to attempt the actions that trigger it)
**Tags:** legal-gate, audit

**Story:** When someone who holds a critical permission is about to leave, be removed or lose it, I want the product to stop me from leaving the group without anyone able to approve or manage, so I can hand the duty over first.

**Conversation:** A group where the last approver leaves has money nobody can move; a group where the last holder of grant permission leaves can never fix its access. Continuity-critical permissions and their minimum holders are defined in the Shared definitions section. The same logic must handle accounts that become unreachable (lost phone, deactivated), which the research flags as a key-person dependency (R01 section 13 risk 6).

**Preconditions:** The group has continuity-critical permissions held by few people. **Trigger:** A holder tries to leave (GRP-16), is removed (GRP-17), or has a permission revoked (GRP-08); or an account becomes inactive.

**Acceptance criteria:**
1. Happy path: when the action would leave fewer holders of a continuity-critical permission than required, it is blocked with "You are the last person who can <approve spending>. Give it to another member first." and a button to open the grant screen with a member picker.
2. Rule: required holders are one for grant permission, revoke permission and remove member, and two for approve spend while any group wallet holds a balance or has money in flight; the minimums come from the Shared definitions section and the safeguard in GRP-13.
3. Rule: the block applies to every route to the same outcome: leaving, removal, revocation and self-revocation. A member with no critical permission is never blocked from leaving by this story.
4. Rule: if the group is already under the minimum because an account became inactive, the group enters a visible state "Needs a second approver", GRP-13 banners apply, and holders of grant permission are alerted (`msg.grp.approver_shortage`).
5. Rule: a recovery path exists for a group that cannot reach the minimum by itself: the remaining members start a vote (VOT) that proposes new approvers; a passed vote lets the remaining holders of grant permission add them with the vote recorded as the authority. Gereo staff cannot move group funds and cannot grant on the group's behalf without that vote.
6. States: loading and failure states follow the originating action; offline: all these actions are online only and say so.
7. Errors: a blocked action shows what is missing, that nothing changed, and who could be granted the permission (the current members with view group).
8. Notifications: the person blocked sees the message only in-app; the group alert uses `msg.grp.approver_shortage.push` with SMS fallback to holders of grant permission (NTF-05).
9. Audit: `safeguard.blocked` for each refused action and `safeguard.shortage` when a group enters the shortage state, with the permission concerned and current holders.

**Data:** Membership, Audit entry, Vote. **Depends on:** GRP-13, GRP-08, GRP-16, GRP-17, VOT (recovery vote), NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Legal and operational process when no member can act (including death or dispute); whether operators may start a recovery process on request and with what evidence.

---

### GRP-15 Open another wallet inside the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds edit group)
**Permission needed:** edit group
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can edit the group, I want to create further wallets for specific purposes (reserve, project fund, event kitty), so that the group's money is separated by purpose and visible to everyone.

**Conversation:** Group wallets have the same rules as personal wallets and are a differentiator (CA section 5). Wallet types and creation live in WAL; this story covers creating wallets from the group, their inherited access and the safeguard on them. No permission named in section 7 covers "create wallet"; edit group is used as a stand-in and flagged as an open question.

**Preconditions:** Person holds edit group; the group has fewer than `grp.max_wallets_per_group` wallets. **Trigger:** Taps "Add wallet" in the group.

**Acceptance criteria:**
1. Happy path: the person names the wallet and picks a type (budget, savings, investment, business). The wallet is created with a balance of 0 Ar, appears on the group home and ledger views, and is visible to every member with view balance.
2. Rule: the new wallet inherits access from the group (members see its balance and history per the Member bundle) and inherits the group's spending rule from GRP-12; it can have its own bands afterwards by a holder of edit rules.
3. Rule: GRP-13 applies fully to the new wallet from its first day.
4. Rule: reaching `grp.max_wallets_per_group` blocks creation with the limit and the next action.
5. States: saving state; offline disables creating with the usual explanation; the list of wallets is cached offline.
6. Errors: a failed creation creates nothing and says so; a duplicate wallet name inside the group is allowed with a soft warning.
7. Notifications: in-app item for members (`msg.grp.wallet_created.inapp`), batched under NTF-08; no push or SMS.
8. Ledger and audit: ledger account created with no entry; audit `wallet.created` with actor, type, time.

**Data:** Wallet, Ledger account, Audit entry. **Depends on:** GRP-01, GRP-12, GRP-13, WAL wallet creation.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether a separate permission to create or close group wallets is needed; whether the legal basis for several client-fund wallets differs from one.

---

### GRP-16 Leave a group and know what happens to my money

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** legal-gate, ledger, audit

**Story:** As a member, I want to leave a group and see first what happens to what I paid, what I still owe and what I lose access to, so that I can leave without surprises.

**Conversation:** Leaving is where trust is tested: last-in-rotation members carry all the risk in tontines (R01 section 5), and rigid rules can punish a member who pays late for a legitimate reason (R07 section 9). The treatment of money already paid is a group and legal decision; this story shows the facts and applies the group's rule `grp.leave_obligation_policy`. The research gives no tested policy, so none is invented here.

**Preconditions:** The person is an active member. **Trigger:** Taps "Leave this group" on the group page or member page.

**Acceptance criteria:**
1. Happy path: a summary screen shows before confirming: total contributed by the person, any amount currently due, the group's own written rule on leaving (from group rules text, GRP-18), the access they lose ("You will no longer see the balance or the ledger"), and what they keep ("Your receipts and your own payment history remain in your wallet history").
2. Rule: contributions already paid stay in the group wallet unless the group's rule says otherwise; the summary states the rule in words. Gereo does not refund automatically; any refund is an ordinary spend from the group wallet that follows GRP-13 and SPD.
3. Rule: amounts due are handled by `grp.leave_obligation_policy`: either settled before leaving, or waived by a holder of exempt member (CON), or recorded as an outstanding debt in the history. The summary names which applies and offers "Pay now" or "Ask a treasurer for an exemption".
4. Rule: leaving is blocked while the person's pending money in flight exists (a pending contribution, a spend they requested) and while GRP-14 would be violated; the screen explains and links to the fix.
5. Rule: after leaving, the person cannot vote on open votes, their pending approvals are voided and approvers re-notified, and their name stays on past ledger lines and decisions as "Former member".
6. States: confirm step requires typing nothing but a clear button "Leave group"; offline disables with the usual message; the summary is readable offline from cache with last synced time.
7. Errors: a failure leaves the person in the group and says so; no money moves from this action.
8. Notifications: in-app confirmation to the leaver (`msg.grp.leave_confirmed.inapp`); push to holders of remove member and approve spend (`msg.grp.member_left.push`); no SMS unless the leaver held a continuity-critical permission (then SMS fallback applies, NTF-05).
9. Ledger and audit: no ledger entry from leaving itself; an outstanding debt, if recorded, is a note on the member history, not a ledger entry; audit `membership.left` with the summary shown (contributed, due, policy applied).

**Data:** Membership, Contribution, Approval, Audit entry. **Depends on:** GRP-14, CON (amounts due, exemptions), SPD (voided approvals), VOT (open ballots), WAL.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether members have any claim on group funds when they leave (this depends on the legal model and on whether CON offers rotation or share-out); how quorum is computed after someone leaves an open vote.

---

### GRP-17 Remove someone from the group

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds remove member)
**Permission needed:** remove member
**Tags:** audit, legal-gate

**Story:** As a member who can remove members, I want to remove someone with a recorded reason, so that the group can protect itself while the person is treated fairly.

**Conversation:** Stanbic uses reversible member statuses (active, on-hold, terminated) (R08 section 6.11). Removal changes who can see the ledger and who can approve money, so it must be visible and safe (R07 section 8.5). Fairness matters: shaming is a risk in groups (R07 section 8.8 R-NT8; section 9 R-MC8).

**Preconditions:** Person holds remove member; target is an active member other than themselves. **Trigger:** Opens a member page and taps "Remove from group".

**Acceptance criteria:**
1. Happy path: the screen shows what removal does (access ends now, pending requests are cancelled, approvals voided), asks for a reason from presets plus optional text, and requires a confirm with the button "Remove <name>".
2. Rule: a person cannot remove themselves (they use GRP-16). A removal that would violate GRP-14 is blocked with the usual explanation. Removing someone holding a money-out permission requires the remover's PIN.
3. Rule: on removal, all the person's permissions in the group end at once, their pending spend requests are cancelled, their approvals on pending requests are voided with approvers re-notified, and they can no longer vote.
4. Rule: amounts the removed person still owes are not erased: they stay visible to holders of the relevant contribution permissions as an outstanding amount and follow `grp.leave_obligation_policy`.
5. Rule: the removed person keeps a read-only record of their own payments and receipts; they cannot see the group ledger, balance, members or votes.
6. States: saving state; offline disables the action with an explanation; the removed person's next app open shows "You are no longer in <group>", the reason code in plain words and what they keep.
7. Errors: failure leaves membership unchanged and says so; no money moves.
8. Notifications: the removed person gets push and an SMS fallback (`msg.grp.member_removed.push`, `.sms`) with no reason text in the SMS; holders of view permissions get an in-app item (`msg.grp.member_removed.inapp`); the group channel never names the reason.
9. Ledger and audit: no ledger entry; audit `membership.removed` with remover, target, reason code, permissions held at the time and the cancelled and voided items.

**Data:** Membership, Approval, Expense request, Audit entry. **Depends on:** GRP-14, GRP-16, SPD, VOT, CON, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether removal of someone with a continuity-critical permission should require a vote; whether removed people can appeal and how; whether an on-hold status (reversible, as in Stanbic) is needed in the MVP.

---

### GRP-18 Change the group's name, purpose and rules text

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds edit group)
**Permission needed:** edit group
**Tags:** audit

**Story:** As a member who can edit the group, I want to update the group name, purpose and written rules, so that the information new members see is accurate.

**Conversation:** The constitution or rules must be visible before joining and reachable later (R08 section 6.4 adopt). The rules text is the group's own words (for example on leaving, on lateness); it informs but does not enforce. Enforced rules live in CON, SPD and GRP-12. Changing the name affects SMS templates, which use a GSM-7 safe short form (NTF-07).

**Preconditions:** Person holds edit group. **Trigger:** Opens "Edit group".

**Acceptance criteria:**
1. Happy path: the person edits name, purpose and a free-text "How our group works" section; saving shows the new text immediately in the group page and in the invite preview.
2. Rule: edits keep a version history showing who changed what and when (audit); the text can be restored to an earlier version by creating a new version.
3. Rule: a change to the "How our group works" text is a material change: all members get an in-app item and a push (`msg.grp.group_edited.push`); a name or purpose change gets an in-app item only.
4. Rule: invite links already sent keep working and show the current text on open; invitees who opened the preview earlier see the new text when they accept.
5. States: saving state, conflict state if two people edit the same field (both versions shown); offline: edits kept as draft "Saved on this phone", sending disabled until connected.
6. Errors: validation as in GRP-01; a failed save keeps the text in the form.
7. Notifications: as in criterion 3; no SMS.
8. Audit: `group.edited` with field names, previous and new values, actor and time.
9. Accessibility and language: the text field supports 200% font scale, and the form explains that the text is shown in the language written, with an option to add translations later.

**Data:** Group, Audit entry. **Depends on:** GRP-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the rules text can be translated per language inside the group; whether enable module also lives on this screen.

---

### GRP-19 Close a group but keep its history

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds delete group)
**Permission needed:** delete group
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can close the group, I want to archive it when it has served its purpose, so that nothing new happens but everyone keeps the record.

**Conversation:** Records must stay (append-only ledger, no deletion of decisions; R04 section 14.3). Open Collective Foundation's dissolution stranded groups' funds on two weeks' notice (R04 section 14.6 risk 4), so closing must never leave money or members in limbo. Using delete group for archiving is a stand-in until a separate permission exists.

**Preconditions:** Person holds delete group. **Trigger:** Opens "Archive group".

**Acceptance criteria:**
1. Happy path: the screen checks the conditions and shows each as done or not: all group wallets at 0 Ar, no pending transactions, no waiting spend requests, no open votes. When all pass, the person confirms with the group name typed and the PIN.
2. Rule: archiving needs a second person, by the same rule as GRP-13: a different holder of delete group must confirm within `grp.archive_grace`, or the request lapses.
3. Rule: if a wallet still has money the screen says "Pay out the remaining <amount> first" with a link to a spend request (SPD); the archive cannot proceed until the balance is 0 Ar by approved outflows.
4. Rule: once archived the group is read-only for all members: ledger, decisions, members and audit remain visible and exportable; no contributions, requests, votes, events or reminders are created; scheduled reminders stop.
5. Rule: a holder of delete group can restore the group within `grp.archive_grace` or later through a new confirmation, which writes an audit entry; restoring does not reopen cancelled votes.
6. States: archiving state; offline disables with an explanation; the archived group shows a clear "Archived on 12 Oct" banner in every language.
7. Errors: a failed archive leaves the group active and says so; money never moves from this action.
8. Notifications: all members get push (`msg.grp.archive_requested.push` to the second confirmer, `msg.grp.archived.push` to everyone); no SMS unless a member holds an open obligation (then SMS fallback applies).
9. Ledger and audit: no ledger entry from archiving; audit `group.archive_requested`, `group.archived`, `group.restored`.

**Data:** Group, Wallet, Audit entry. **Depends on:** GRP-13, GRP-20, SPD, VOT, CON, WAL.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether archiving should require a vote of all members; whether a group with unreachable members can ever be force-closed.

---

### GRP-20 Delete a group, within what the law lets us

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Permission holder (holds delete group)
**Permission needed:** delete group
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can delete the group, I want to delete an archived group so that it stops appearing, while records the law requires are kept.

**Conversation:** The ledger is immutable and records must be kept (conventions section 2; CA section 6 constraint 8, five-year retention cited under Art. 53 but unconfirmed). Data export on day one and a published shutdown and retention commitment are design rules (CA section 7). So deletion means removal from member views and deletion of non-required content, not erasure of the ledger.

**Preconditions:** The group is archived and the person holds delete group. **Trigger:** Taps "Delete group" on an archived group.

**Acceptance criteria:**
1. Happy path: the screen explains what is removed (name from lists, announcements, events, documents, chat-like content) and what is kept for `grp.retention_period` (ledger entries, approvals, decisions, audit entries) and offers a full export first (CSV and PDF) before the delete button.
2. Rule: only archived groups can be deleted; a second holder of delete group must confirm, as in GRP-19.
3. Rule: deletion starts a grace period `grp.delete_grace` during which the group is hidden but restorable; after it, content marked removable is erased and kept records are retained under the retention period and cannot be viewed by members.
4. Rule: members of a deleted group can still export their own contribution history from their wallet history for the retention period.
5. Rule: kept records are accessible only through the operator process in OPS with a recorded reason.
6. States: the deletion state shows days remaining in the grace period; offline disables with the usual explanation.
7. Errors: a failed delete leaves the group archived; no money moves.
8. Notifications: push to all members when deletion is scheduled and when it completes (`msg.grp.delete_scheduled.push`, `msg.grp.deleted.inapp`); no SMS.
9. Audit: `group.delete_requested`, `group.delete_confirmed`, `group.deleted` with what was kept and what was erased.

**Data:** Group, Audit entry, Ledger entry (retained). **Depends on:** GRP-19, OPS, XCT export.
**Pages:** to be filled from the information architecture.
**Open questions:** Retention period and its legal basis; whether members must consent to erasure of non-financial content.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| GRP-01 | Start a group for the people I save with | P0 | ACC sign-in, WAL wallet creation |
| GRP-02 | Start with every permission, and say so | P0 | GRP-01 |
| GRP-03 | Invite people by link or by phone number | P0 | GRP-01, GRP-07, NTF-05, NTF-06, NTF-07 |
| GRP-04 | See the rules before I join, then join or decline | P0 | GRP-03, ACC sign-up |
| GRP-05 | See who is in the group | P0 | GRP-01, GRP-03, GRP-09 |
| GRP-06 | Open the group and see where things stand | P0 | GRP-01, WAL, SPD, VOT, CON, EVT |
| GRP-07 | See what each kind of member can do, in plain words | P0 | GRP-01, GRP-08 |
| GRP-08 | Give or take away a single permission | P0 | GRP-07, GRP-13, GRP-14, SPD, NTF-05 |
| GRP-09 | See what a person can and cannot do right now | P1 | GRP-07, GRP-08, GRP-12 |
| GRP-10 | See who changed access, and when | P0 | GRP-08, GRP-11 |
| GRP-11 | Keep a complete audit log of group-level actions | P0 | GRP-08, GRP-10, OPS |
| GRP-12 | Set the amount above which more people must agree | P0 | GRP-13, SPD, VOT, WAL |
| GRP-13 | No single person can move the group's money alone | P0 | SPD, WAL, RUL, OPS |
| GRP-14 | Keep the group from locking itself out | P0 | GRP-13, GRP-08, GRP-16, GRP-17, VOT, NTF-05 |
| GRP-15 | Open another wallet inside the group | P1 | GRP-01, GRP-12, GRP-13, WAL |
| GRP-16 | Leave a group and know what happens to my money | P0 | GRP-14, CON, SPD, VOT, WAL |
| GRP-17 | Remove someone from the group | P0 | GRP-14, GRP-16, SPD, VOT, CON, NTF-05 |
| GRP-18 | Change the group's name, purpose and rules text | P1 | GRP-01 |
| GRP-19 | Close a group but keep its history | P1 | GRP-13, GRP-20, SPD, VOT, CON, WAL |
| GRP-20 | Delete a group, within what the law lets us | P2 | GRP-19, OPS, XCT export |

Totals: 15 P0, 4 P1, 1 P2.

## Cross-epic dependencies

IDs below are taken from the story files that exist at the time of writing (ACC, CON, SPD, VOT, EVT, PRJ, XCT); WAL, RUL, ANN and OPS files were not yet present, so those lines name the needed capability. Re-check the numbers when the story map is built.

- ACC: ACC-02 (phone and OTP sign-up) and ACC-03 (PIN) for GRP-01, GRP-04 and the PIN step in GRP-08; ACC-07 (tier ladder) for the identity tier needed to hold or approve money (GRP-01, GRP-13); ACC-16 (open an invite or vote link without an account) is the entry point of GRP-04; ACC-11 (connected devices) for lost-account cases in GRP-14.
- WAL: wallet creation and types, ledger accounts, ledger entries carrying initiator and approvers, balance and status words (GRP-01, GRP-06, GRP-13, GRP-15, GRP-19).
- RUL: scheduled rule outflows from group wallets obey the safeguard (GRP-13).
- CON: CON-01 (plan) summary in the invite preview (GRP-04); CON-06 (member status board) and CON-17 (reconciliation line) on group home (GRP-06); CON-10 (exempt a member) and CON-09 (late fee) for leavers and removals (GRP-16, GRP-17).
- SPD: SPD-02 (spending policy) is where thresholds are displayed and GRP-12 is where they are edited; SPD-08 (separation of duties) and GRP-13 describe the same floor from two sides and must stay consistent; SPD-07 (edit request, approvals voided) for GRP-08, GRP-16, GRP-17; SPD-04 (approval inbox) for group home; SPD-01 and SPD-10 for the payout of a remaining balance before archive (GRP-19); SPD-15 (emergency freeze) interacts with GRP-14.
- VOT: VOT-03 and SPD-09 (vote linked to an expense) for the vote band in GRP-12; VOT-05 for open votes on group home; VOT-01 for the recovery vote in GRP-14; VOT-04 and VOT-10 for ballots and quorum of leavers (GRP-16).
- EVT: EVT-08 (upcoming events) feeds the next-event tile (GRP-06).
- PRJ: PRJ-06 (project follows the group's permissions) relies on the inheritance defined here.
- ANN: inherits group permissions; nothing blocks GRP.
- NTF: NTF-05 (push-then-SMS), NTF-06 (SMS allowance), NTF-07 (templates), NTF-08 (batching); message keys are listed in each story and in the NTF event catalogue (EV-GRP-01 to EV-GRP-18).
- XCT: XCT-01 (language), XCT-04 (offline read and last synced), XCT-05 (queue what can wait), XCT-06 (no money-out offline), XCT-08 to XCT-10 (accessibility), XCT-14 (strings as keys).
- OPS: operator access to the audit log with a recorded reason, reconciliation line, support on locked groups (GRP-06, GRP-11, GRP-13, GRP-14, GRP-20).


## Open questions

1. **Legal basis.** Holding group funds needs a confirmed legal basis (CA section 6 constraint 1). Which identity tier is required to create a group, receive money in it and be an approver (GRP-01, GRP-12, GRP-13)?
2. **Missing permission names.** Section 7 of the conventions has no permission for creating wallets, archiving a group, viewing the wider audit log or setting spending thresholds. This file uses edit group, delete group, view permissions and edit rules as stand-ins. Add dedicated names or confirm the stand-ins.
3. **Member bundle scope.** Should members propose expenses (initiate spend) or create votes by default? Open Collective lets any user submit an expense, Gereo's default Member bundle does not.
4. **Money already paid when leaving.** Does a leaver have any claim on group funds? Which of "settle", "waive" or "record as debt" is the default for unpaid contributions (`grp.leave_obligation_policy`)?
5. **Loosening a safeguard.** How many people must approve a weaker spending rule (GRP-12)? Should granting a money-out permission also need a second holder or a vote (GRP-08)?
6. **No-approver recovery.** What exactly can Gereo staff do when a group cannot act (death, dispute, lost accounts) without breaking the rule that no single person moves group money (GRP-14)?
7. **Retention and deletion.** Retention period, who may see retained records, whether members must consent to erasure of non-financial content (GRP-11, GRP-20).
8. **Visibility.** Who may see full phone numbers of members and whether the group's approvers are visible to invitees before joining (GRP-04, GRP-05).
9. **Invite links.** Default lifetime, use cap, and whether a public link in a group chat is acceptable for a group that holds money (GRP-03).
10. **Group creation limits.** Value of `grp.max_groups_per_user` and `grp.max_wallets_per_group`, and whether group creation is allowed before KYC.
11. **Modules.** Where "enable module" is controlled in the MVP, and by whom.
12. **Evidence gaps.** The effective access panel and the bundle wording are untested in Malagasy; the 83.6% result is from an experiment outside Madagascar (R07 section 8.5). Test with real members in the first prototype round.
