# GRP: Groups, membership and permissions

Epic code GRP, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, rules). Evidence is cited in each Conversation as research file plus section.

Evidence shorthand used below: `R01` = [raw/01-group-savings.md](../../research/raw/01-group-savings.md), `R04` = [raw/04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md), `R07` = [raw/07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md), `R08` = [raw/08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md), `CA` = [competitive-analysis.md](../../research/competitive-analysis.md), `DF` = [design-foundations.md](../../research/design-foundations.md).

## Shared definitions for this epic

There are no roles in the system. A membership carries individual permissions only. A "bundle" is a named checklist of permissions used as a shortcut when granting; applying a bundle writes individual permissions and nothing else. Whether a person "matches" a bundle is computed for display only.

Permissions are written "Object: name", for example "Wallet: initiate spend". This section owns the member permission catalogue, the bundle mapping and the money-out class; conventions section 7 lists names only. The catalogue is section 7 of the conventions plus the five permissions added by decision D2: Wallet: freeze, Wallet: create, Group: view audit log, Group: set spending policy, Group: set notification settings. "Wallet: initiate spend" is the permission to ask to spend (decision D2 keeps it). Every stand-in used in the first draft is replaced by a real name. Operator permissions (`review identity checks`, `handle tickets`, `search audit log`) are a separate catalogue in a separate table, owned in full by OPS-01; an operator never holds a member permission by being an operator.

**Bundles (contents are the prefilled defaults, always editable before they are applied):**

| Bundle (plain name) | One-sentence description | Permissions it writes |
| --- | --- | --- |
| Member | Sees everything the group does and takes part | Group: view group. Wallet: view balance, view history, deposit. Contribution plan: view. Vote: view, vote. Event: view. Project: view. Document: view |
| Treasurer | Member, plus runs the money day to day. Cannot change who has access | Everything in Member, plus Wallet: initiate spend, approve spend, edit rules, export history, freeze. Group: view audit log, set notification settings. Contribution plan: edit, exempt member, send reminder. Vote: create, edit, close. Publication: announce to group |

The Treasurer bundle deliberately excludes Wallet: create and close, and Group: set spending policy, grant permission, revoke permission, remove member, delete group and edit group, so the person who runs the money does not also control access or weaken the protection. There are exactly two bundles, Member and Treasurer, and no third bundle.

Event: create, edit, invite, Project: edit and Group: edit group are granted individually from the checklist; no bundle contains them.

Running a campaign needs Publication: announce to group plus Wallet: initiate spend; organisers outside the Treasurer bundle receive Wallet: initiate spend with a PIN.

Wallet: create also covers renaming and retyping a group wallet; Wallet: edit rules also covers the group goal.

**Permission classes used by the safeguards:**

- Money-out class: Wallet: initiate spend, approve spend, edit rules, close. Group: set spending policy is in the class because it changes how much protection money has. Granting any of them asks for the grantor's PIN. Wallet: create and Wallet: freeze are not in the class and need no PIN to grant (freeze only stops money; create moves none).
- Continuity-critical permissions (parameter `grp.continuity_permissions`, default list): Wallet: approve spend, Group: grant permission, revoke permission, remove member, set spending policy. The group must always keep at least one holder of each, and at least two holders of Wallet: approve spend while any group wallet holds money or has money in flight (the requester can never approve their own request, decision D1, so two holders are the smallest number that can pay). Group: delete group is not a continuity permission: GRP-19 falls back to a group vote when fewer than two holders exist.
- Holder counts. "Holders" means every member who holds the permission; it is the count that blocks leave, removal and revoke below the minima (GRP-14). "Reachable holders" excludes members whose account is Locked, Inactive or Deactivated (account status names of conventions 10.3); it drives the "Needs a second approver" banner, approval routing and the approval-count limit of GRP-12. A "money-out capable" holder is one whose tier has a single money-out limit above zero (ACC-07); the two-holder minimum and the lock-out check count capable holders by tier, never by current new-device cooling. Members see only a neutral "unavailable" marker, with no reason and no mention of a lock.

**Status tables used by this epic:**

| Object | Statuses | Notes |
| --- | --- | --- |
| Invite | Sent, Opened, Joined, Declined, Expired, Revoked, Used up | "Used up" is a link that reached `grp.invite_link_max_uses` |
| Membership | Active, Invited, Left, Removed | Invited is the pending invite of GRP-03; Left and Removed are "Former members" |
| Group | Active, Archive pending, Archived, Delete pending, Deleted | Archive pending is the wait for the second confirmer (GRP-19); Delete pending is the `grp.delete_grace` period (GRP-20) |

"Needs a second approver" (GRP-14, `msg.grp.approver_shortage`) is a derived warning on an Active group, not a status or a request sub-label: it is true while fewer than two reachable holders of Wallet: approve spend exist and a group wallet holds money.

**Configurable parameters.** Defaults are working values to validate in field interviews, not research findings. Spending thresholds are not a GRP parameter: they are the SPD parameters `spd.spend_approvals_default`, `spd.spend_multi_threshold`, `spd.spend_approvals_multi` and `spd.spend_vote_threshold`, owned by SPD and edited here (GRP-12), as are the other SPD parameters tagged GRP-12.

| Parameter | Meaning | Default |
| --- | --- | --- |
| `grp.name_max_length`, `grp.purpose_max_length` | Field limits | 60 and 280 characters |
| `grp.max_groups_per_user` | Groups one person may create | 10 |
| `grp.max_wallets_per_group` | Wallets in one group | 10 |
| `grp.invite_link_ttl` | Life of a shared link | 7 days |
| `grp.invite_link_max_uses` | Use cap of a shared link | 50 |
| `grp.invite_resend_cooldown` | Spacing between two sends to the same number | 24 hours |
| `grp.leave_obligation_policy` | What happens to unpaid contributions when someone leaves: settle, waive, record as debt | Record as outstanding debt, offer "Pay now" or an exemption |
| `grp.archive_grace` | Time the second confirmer has to confirm an archive | 7 days |
| `grp.delete_grace` | Hidden and restorable period after a delete request | 30 days |
| `AUDIT_RETENTION_YEARS` | How long audit entries, consent evidence and the decision log are kept; owned by OPS and only cited here | 5 years (legal basis unconfirmed, see Open questions) |
| `grp.continuity_permissions` | List of continuity-critical permissions | As listed above |

Fixed product rule (not a parameter): a group wallet never pays out on the action of one person alone. The floor of two distinct people cannot be lowered by any group, any permission holder or any operator. It is met either by one approval from a person other than the requester, or by a passed vote with at least two distinct voters other than the requester (decision D4); a voter counts toward that floor only after the minimum tenure defined in VOT.

---

### GRP-01 Start a group for the people I save with

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual (becomes Group founder)
**Permission needed:** none
**Tags:** legal-gate, ledger, audit

**Story:** As an individual, I want to create a group with a name, a purpose and a first wallet, so that the people I save with have one shared place for money and decisions.

**Conversation:** The founding problem is a group that runs on calls and hand calculation (info.md, problems 1 and 8). Three fields only; plan and split rules come later from a checklist so a group exists in about a minute (R04 section 14.6 risk 7, "project in 60 seconds"; R07 section 5.2 forms). Group wallets use the same wallet model as personal wallets (CA section 5 differentiators). Decision: creating a group needs only Tier 1 (phone, OTP, PIN) because creation moves no money; every other action follows the "Tier requirements by action" table of ACC-07, and group-wallet limits come from the group-wallet limit set of OPS-11. This carries `legal-gate` because a group wallet may constitute holding client funds (CA section 6 constraint 8): until the legal basis is confirmed, groups can be created and used without deposits.

**Preconditions:** Signed in with phone and OTP (ACC). **Trigger:** Taps "Create a group" on home or on the empty groups list.

**Acceptance criteria:**
1. Happy path: the person enters a group name (required, up to `grp.name_max_length`), a purpose of one or two sentences (required, up to `grp.purpose_max_length`, shown to invitees in GRP-04) and a first wallet name (prefilled from message key `grp.wallet.default_name`) with one of the four wallet types (budget, savings, investment, business). Currency is Ariary and not editable. The primary button reads "Create group". After success the person lands on the new group home (GRP-06).
2. Rule: the group is created with the person as its only member holding every permission (GRP-02), and the wallet belongs to the group with a balance of 0 Ar. Group names need not be unique; if the person already has a group with the same name a soft warning is shown, not a block. Reaching `grp.max_groups_per_user` shows the limit and the next action.
3. Rule: the new wallet accepts deposits (subject to the ACC-07 table, the group-wallet limit set of OPS-11 and the legal gate) but cannot pay out until the safeguard is satisfied (GRP-13). The post-creation checklist shows "Invite members", "Add a second person who can approve spending" and "Set the contribution plan", each deep-linking to its screen.
4. States: while submitting the button is disabled with a progress label and the request carries an idempotency key, so a retry never creates two groups. Offline: Create is disabled and shows `xct.offline.needs_connection`. The form is a local draft (XCT-05 Table B), never sent without a tap, labelled with the `Draft, not sent` key.
5. Errors: validation messages are inline, per field, name the fix and never use "invalid". On server failure the input is kept and the message reads "We could not create the group. Nothing was created." with a Try again button. No money moves in any case.
6. Notifications: none to other people. The founder sees an in-app confirmation (`msg.grp.group_created.inapp`).
7. Ledger and audit: one audit entry `group.created` (who, when, group id, name), plus one audit entry per permission written at creation with actor "system at creation" (GRP-02). The wallet's ledger account is created with no entry.
8. Accessibility and language: every field has a visible label, 48 dp targets, a character counter announced to screen readers; helper text and the prefilled wallet name exist in Malagasy, French and English. A line shows how the name will look inside an SMS, which uses a GSM-7 safe, shortened form (NTF-07).

**Data:** Group, Membership, Wallet, Audit entry. **Depends on:** ACC-02, ACC-03, WAL-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: Tier 1 is enough to create a group and a wallet (ACC-07 table; no money moves). Still open, needs a lawyer: whether and when a group wallet may hold member funds (default: groups work without deposits until confirmed).

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
1. Happy path: at creation the founder is granted every permission of the Group, Wallet, Contribution plan, Project, Vote, Event, Document and Publication objects in the catalogue of this epic (conventions section 7 plus the D2 additions), at group level so they inherit to wallets, projects and documents created later.
2. A first-run card reads in plain words "You can do everything in this group right now. Money cannot leave the wallet until a second person can approve it, or until the group votes." with two buttons, "Add an approver" (GRP-08) and "Invite members" (GRP-03). It can be dismissed and stays reachable from the checklist.
3. Rule: the group records "created by Sara on 12 Oct" as a historical fact only. No screen, rule or API treats the creator as having any power beyond held permissions.
4. Rule: the founder can later revoke any of their own permissions, including all of them, subject only to the safeguards in GRP-13 and GRP-14.
5. Rule: the founder's permissions are visible to every member who holds Group: view group (GRP-09), so nobody has hidden power.
6. States: loading shows a skeleton for the card; the card text is cached and readable offline; if the group is no longer new (other holders exist) the card is replaced by the normal home content.
7. Errors: if the permission write fails at creation, the group is not left half-created: the whole creation fails with the GRP-01 error and no group exists.
8. Ledger and audit: one audit entry per permission written, each with actor "system at creation", target the founder, timestamp. No ledger entry.

**Data:** Membership, Audit entry. **Depends on:** GRP-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no confirmation step. The first-run card and the checklist already explain the safeguard, and confirmations stay reserved for money-out so they keep their meaning (R07 section 8.5 R-PM3).

---

### GRP-03 Invite people by link or by phone number

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: invite member)
**Permission needed:** Group: invite member
**Tags:** sms, audit

**Story:** As a member who can invite, I want to invite people with a link I can share in WhatsApp or by their phone number, so that the whole group joins without anyone typing long forms.

**Conversation:** Groups already live in WhatsApp, and Gereo should be the record that chat links into (R04 section 14.2). Stanbic invites by SMS and by phone book and lets the invitee review rules first (R01 section 2; R08 section 6.11). Tricount's link grants full rights, which is acceptable for splitting expenses but not for custody (R08 sections 6.4 and 6.11 avoid). So here a link only opens the limited preview (GRP-04) and never grants access by itself.

**Preconditions:** Group exists, the person holds Group: invite member. **Trigger:** Taps "Invite" on the member list or on the setup checklist.

**Acceptance criteria:**
1. Happy path, link: "Share link" creates a unique link and opens the phone's share sheet with a short ready message (`msg.grp.invite_share.text`, three languages). The link opens the limited preview (GRP-04). Joining gives the Member bundle only. This is the invite share link, one of the three link kinds (the invite share link, defined here; the vote share link in VOT-06; the per-person single-use SMS link in NTF-11).
2. Happy path, phone: the person types a number or picks one from the phone book (contacts access is optional and contact data is never uploaded), selects the SMS language (default the group's language) and sends. The invitee receives an SMS (`msg.grp.invite_received.sms`) with the inviter's first name, the group name and the link.
3. Rules: a shared link expires after `grp.invite_link_ttl` and stops working after `grp.invite_link_max_uses` joins (status Used up), and can be revoked at any time by any holder of Group: invite member. A phone invite carries the Member bundle, so the invited person is eligible to vote as a guest before joining; it is single-use and bound to its number, with the same life: opened from another number it shows "This invite was sent to another number" with a Request access button (the inviter is notified and decides).
4. Rules: a holder can invite only up to the Member bundle unless they also hold Group: grant permission, in which case a bundle can be chosen at invitation. A number already in the group, or already invited, is refused with a plain message and a link to that member. Resending is limited by `grp.invite_resend_cooldown`.
5. States: the invited list shows each invite with a status from the Invite table in the Shared definitions (Sent, Opened, Joined, Declined, Expired, Revoked, Used up) and the date. Empty state explains both ways to invite. Offline: sharing a link works from cache if one already exists; creating a new link or sending an SMS needs a connection and says so.
6. Errors: a number that fails the mobile number check is rejected with the expected format in plain words. If the group's SMS allowance is exhausted, phone invites show "SMS invites are paused for this group. Share the link instead." and the link path stays available (NTF-06). Nothing involving money happens.
7. Notifications: SMS to the invitee (`msg.grp.invite_received.sms`, GSM-7, 160 characters, paid from the group's SMS allowance); push to the inviter when the invite is accepted or declined (GRP-04). If the invitee already has the app, the invite also appears in their notification centre.
8. Audit: `membership.invited` (inviter, channel link or phone, masked number, bundle, time), `invite.revoked`, `invite.expired`. A full phone number is stored in the invite record, not in the audit text.
9. Accessibility and language: the share message and the SMS exist in Malagasy, French and English and name no amounts; the phone field uses a numeric keypad and accepts pasted numbers with spaces.

**Data:** Invite, Group, Notification, Audit entry. **Depends on:** GRP-01, GRP-07, NTF-05, NTF-06, NTF-07.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a shared link may be posted in a group chat, because that is where Madagascan groups already live (R04 section 14.2). The risk is bounded by four limits: the link grants only the Member bundle with no money-out, it expires after 7 days, it stops after 50 joins, and every join is visible and revocable. A phone invite is single-use. Defaults are in the parameter table.

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
1. Happy path: the limited preview shows the group name, purpose, the inviter's name, the number of members and the group's rules in plain words: contribution amount and rhythm if a plan exists (CON), the spending rule in plain words ("Spending needs 2 approvals; above X Ar the group votes instead"), the count (not the names) of people who can approve, and that no single person can move group money. It shows no ledger, no balances and no member names other than the inviter.
2. The preview has a "What you will be able to do" list in verbs taken from the Member bundle ("See the balance and every transaction", "Vote", "See events and projects", "Pay your contributions") and a "What you will not be able to do" list ("Move group money", "Change who has access"). Both lists are generated from the bundle the invite carries (GRP-03).
3. Accept: the person signs in or signs up with phone and OTP (ACC), taps "Join this group", and lands on the group home. A membership with the bundle's permissions is created. Joining does not move money and does not require identity verification.
4. Decline: a "No thanks" button asks for an optional preset reason ("I do not know this group", "Not now", "Wrong number") and closes the invite. A shared link stays valid for others and the person can still accept later while it has not expired; a phone invite becomes Declined.
5. Rules: opening a link never grants access before Accept. An expired, revoked or used-up link shows the reason and "Ask <inviter name> for a new link". A person already in the group is taken to the group home.
6. States: loading shows a skeleton and the group name first; offline: the invite preview is not in the XCT-04 cache list, so it needs a connection and says so. An Accept given while the connection drops is queued under the XCT-05 label keys (class `membership-self`, the only allowlisted auto-send class), shown as "Waiting to send" with "Your answer will be sent when you are connected. Nothing is joined yet." It is never silent: it is a visible pending item.
7. Errors: at receipt the server revalidates the invite, its expiry and the default permission bundle; if any of them changed or expired, the Accept is rejected with a reason and the screen says nothing changed. A member who joins after a vote opened is not added to that vote's electorate (the snapshot is owned by VOT-02). If accepting fails the person stays on the preview with "We could not add you yet. Nothing has changed. [Try again]". A number-bound invite opened from another number shows the GRP-03 message.
8. Notifications: push to the inviter on accept (`msg.grp.invite_accepted.push`) or decline (`msg.grp.invite_declined.push`); an in-app item for holders of Group: invite member; no SMS.
9. Audit: `membership.joined` (who, invite id, bundle written, time) and `invite.declined` with the preset reason code.
10. Accessibility and language: the preview is readable at 200% font scale and under 320 px without clipping, uses short sentences, and opens in the language of the invite SMS, with a visible language switch.

**Data:** Invite, Membership, Group, Audit entry. **Depends on:** GRP-03, ACC-02, ACC-16.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no. An invitee who is not yet a member sees only the inviter's name and the count of approvers, because naming people to a stranger with a link is a privacy leak (criterion 1). Names appear after joining (GRP-05).

---

### GRP-05 See who is in the group

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Group: view group
**Tags:** offline

**Story:** As a member, I want a list of everyone in the group and who can do what with money, so that I know who I am trusting.

**Conversation:** "Hidden admin power: the permission screen must show who can move money" (R08 section 6.11 avoid). Stanbic shows member statuses (R08 section 6.11) and the founding pain is not knowing who is in and who paid (info.md problem 1). Contribution status lives in CON; this list stays about membership. Member visibility of phone numbers is a privacy choice, so the default is masked.

**Preconditions:** Person holds Group: view group. **Trigger:** Opens "Members".

**Acceptance criteria:**
1. Happy path: a list shows each member's display name, join date, and badges for what matters to everyone ("Can approve spending", "Can change who has access") shown with icon and words, never colour alone. The count of members is in the header.
2. Statuses (Membership table in the Shared definitions): Active, Invited (pending, from GRP-03) and, in a separate collapsed "Former members" section, Left and Removed. Former members stay listed so past ledger lines and votes still show a name.
3. Search by name works offline on the cached list; the list can be sorted by name or join date.
4. Rules: phone numbers are masked to the last digits for everyone except holders of Group: invite member or remove member, who need the full number to act. Members who hold Wallet: approve spend are visible to every member with Group: view group, not only to permission holders.
5. Tapping a member opens their member page with "Effective access" (GRP-09) for those allowed to see it, and "Remove" or "Change access" actions only for people holding the matching permission.
6. States: empty state for a group of one: "You are the only member. Invite people." with the invite button (needs Group: invite member; otherwise "Ask <name> who can invite"). Loading uses skeleton rows. Offline shows the cached list with "Last synced" in the header.
7. Errors: if the list fails to refresh, the cached list stays visible with "Could not update. [Try again]". If the person lost Group: view group, the screen explains which permission is missing and names who can grant it (holders of Group: grant permission).
8. Notifications: a new member appears in the list; the in-app feed item `msg.grp.member_joined.inapp` is batched (NTF-08); no push or SMS by default.
9. Accessibility: each row is one focusable item announcing name, status and badges; targets 48 dp; badges have text labels.

**Data:** Membership, User, Invite. **Depends on:** GRP-01, GRP-03, GRP-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: full phone numbers are visible only to holders of Group: invite member or remove member, who need them to act (criterion 4). Display names may be pseudonyms because the name is free text chosen in ACC-06; the masked number lets the group tell two people with the same name apart.

---

### GRP-06 Open the group and see where things stand

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Group: view group (balance tile also needs Wallet: view balance)
**Tags:** offline

**Story:** When I open my group, I want one page that shows the balance, what is waiting for me, who has paid and what is coming next, so I can see in ten seconds whether I need to do anything.

**Conversation:** The dashboard is headline sentences plus a ranked list, not a chart wall (DF section 4 "Groups and rules"; R07 section 8.1 recommended hierarchy). "12 of 15 members have paid this month" is the model sentence. Every competitor with member-visible balances treats it as table stakes (R01 section 13). A visible "ledger equals provider balance as of hh:mm" line is an opportunity nobody documents (R08 section 6.4), included here as an optional line fed by OPS.

**Preconditions:** Person is a member. **Trigger:** Opens a group.

**Acceptance criteria:**
1. Happy path: the home shows, in this order: (a) the group balance in ariary with the "12 500 Ar" format and a status word, (b) "Waiting for you" with pending approvals (SPD) and open votes (VOT) that need this person, each deep-linking to the item, (c) the contribution board summary as a sentence ("12 of 15 have paid this month") linking to CON, (d) the next event (EVT-08) and (e) the last three ledger lines. A vote that closed since the person last looked shows one of the four VOT result chips (Passed, Not passed (majority not reached), Not passed (quorum not met), Tie), never a GRP wording.
2. Rule: each tile appears only if its permission is held. A missing permission shows a short note naming the permission and who can grant it ("You cannot see the balance. Ask Mamy or Sara.") instead of an empty or hidden space.
3. Rule: if the group has the "Needs a second approver" warning (GRP-14) (driven by reachable holders, `msg.grp.approver_shortage`) a banner on top says money cannot leave until a second person can approve, with a link to fix it (holders of Group: grant permission) or the names to ask (everyone else).
4. States: new group: a setup checklist (invite, second approver, contribution plan) replaces the empty tiles. Loading: skeleton tiles, balance first. Partial failure: a tile that fails shows its own small error and Retry while the others render.
5. Offline: the page renders from cache with a single header line "Updated 14:05" (no word "offline"); balances older than `STALE_BALANCE_HOURS` carry a "may be outdated" badge. The cached page holds at most `CACHE_RECENT_TRANSACTIONS` ledger lines inside `CACHE_LEDGER_DAYS` and counts toward `CACHE_MAX_MB`; all these names are owned by XCT-04 and GRP adds no cache of its own.
6. Rule: balance and the ledger lines are computed from the ledger. If a ledger line is Pending or Needs attention the tile shows that status word and what happens next.
7. Errors: if the balance cannot be loaded the tile shows "We could not load the balance. No money has moved. [Try again]" with the last known value and its time.
8. Notifications: none from this page; its counters mirror the notification centre badges (NTF-01).
9. Accessibility and language: headline sentences are real text, amounts never clipped at 200% scale, no information only in images; sentences exist in Malagasy, French and English.

**Data:** Group, Wallet, Ledger entry, Approval, Vote, Contribution, Event. **Depends on:** GRP-01, WAL-03 (balance), SPD-04 (approval inbox), VOT-05 (open votes), CON-06 (board), EVT-08 (next event), CON-17 and OPS-04 (reconciliation line, optional).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the reconciliation line is shown to every member who holds Wallet: view balance, because it only says the ledger matches the provider and reveals no more than the balance tile (CON-17 shows it on the ledger view).

---

### GRP-07 See what each kind of member can do, in plain words

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: grant permission)
**Permission needed:** Group: grant permission, Group: view group
**Tags:** audit

**Story:** As a member who can grant permissions, I want named bundles such as "Member" and "Treasurer" with a plain list of what they allow, so that I can set people up without learning permission names.

**Conversation:** The interface never shows roles in code, but people think in roles, so bundles carry plain names (DF section 3 principle 8; R04 section 14.6 risk 8). Stanbic's role matrix lists privileges without limits (R08 section 6.11 opportunity); we show consequences in one sentence, for example "Can move money up to the first spending limit with one more approver". A bundle is a prefilled checklist and can be changed before applying (conventions section 2).

**Preconditions:** Person holds Group: grant permission and Group: view group. **Trigger:** Opens "Access" in the group, or chooses a bundle while granting (GRP-08).

**Acceptance criteria:**
1. Happy path: the screen lists the bundles Member and Treasurer, each with a one-sentence description and a "What this lets you do" list written in verbs ("See the balance", "Ask to spend and approve other people's requests", "Stop all outgoing money in an emergency", "Send contribution reminders"), no technical names.
2. Rule: contents are the defaults in the Shared definitions section of this file. The Treasurer bundle shows, in a separate "Not included" list, that it cannot change who has access, remove people, change the spending rules, add or close wallets, edit the group itself or delete the group.
3. Rule: before applying a bundle the grantor sees every permission as a checklist and can untick items. Applying writes individual permissions only. The result is shown on the member page as "Treasurer, changed: no Wallet: export history".
4. Rule: a person matches a bundle when their permissions are exactly its permissions; otherwise the member page lists the real permissions. Matching is computed at read time and never stored as a role.
5. Rule: a bundle that includes money-out permissions (class defined in the Shared definitions) shows a notice "This lets <name> move group money. Spending still needs a second person." and requires the grantor's PIN on apply (GRP-08).
6. States: loading skeleton; offline: bundle definitions are static and readable from cache; applying is online only and shows `xct.offline.needs_connection` (XCT-05 Table C). Empty state for a group of one: the screen shows the bundles and "Invite someone first".
7. Errors: the grantor cannot apply a permission they do not hold themselves (GRP-08); the checklist disables such items with "You do not hold this permission".
8. Notifications: none from viewing bundles; granting notifies the person (GRP-08).
9. Accessibility and language: bundle names and verb lists exist in Malagasy, French and English and are reviewed by a native Malagasy speaker; the term for each concept is the same everywhere in the product.

**Data:** Bundle definition (static), Membership. **Depends on:** GRP-01, GRP-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: all permission, role and membership changes made by others are online only and show `xct.offline.needs_connection` (XCT-05 Table C). Closed: the MVP has exactly two bundles, Member and Treasurer, plus the per-permission checklist of GRP-08, which already covers events, announcements and project work. Custom group bundles are a later improvement (P2) and not part of the MVP.

---

### GRP-08 Give or take away a single permission

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: grant permission or revoke permission)
**Permission needed:** Group: grant permission to give, Group: revoke permission to take away
**Tags:** audit, legal-gate

**Story:** As a member who can manage access, I want to give or take away one permission at a time and see the effect before I confirm, so that nobody gets more or less power than I meant.

**Conversation:** Showing the diff and the effective result is what protects people from ACL mistakes (R07 section 8.5 R-PM1 to R-PM4; R04 section 13 "show the effective result"). Confirmation is reserved for money-out powers so it keeps meaning (R07 section 8.5 R-PM3). Every permission change is written to the audit log (conventions section 7; info.md, Permissions section, safeguards). Moving a money-out permission to another person may also be put to a vote (R07 R-PM5); decided not for the MVP, see Open questions.

**Preconditions:** Person holds Group: grant permission to grant or Group: revoke permission to revoke. **Trigger:** Opens a member page and taps "Change access".

**Acceptance criteria:**
1. Happy path: the grantor ticks or unticks permissions on a checklist grouped by object (Group, Wallet, Contribution plan, Vote, Event, Project, Document, Publication), with plain verb labels (Project: edit is labelled "Create and edit projects"). A diff reads "Adding this lets Rado approve spending. This is new." or "Taking this away means Rado can no longer approve spending."
2. Rule: a person can grant only permissions they hold themselves, and never to themselves: a person cannot grant themselves Wallet: approve spend to unblock their own request (SPD-08). A person can revoke only if they hold Group: revoke permission; revoking one's own permission is allowed, subject to GRP-13 and GRP-14.
3. Rule: any change touching a permission of the money-out class (Shared definitions: Wallet: initiate spend, approve spend, edit rules, close; Group: set spending policy) asks for the grantor's PIN and shows the sentence "This lets <name> move group money. Spending still needs a second person." Other changes, including Wallet: create and Wallet: freeze, confirm in one tap without a PIN.
4. Rule: revoking Wallet: approve spend voids that person's approvals on spend requests still pending and re-notifies the remaining approvers (approvals authorise exactly what was shown; DF section 3 principle 4); a ballot the person already cast in a vote is not touched. Revoking Wallet: initiate spend cancels the person's pending requests with a visible reason.
5. Rule: revoking a continuity-critical permission is blocked if it would leave fewer holders than the group needs (GRP-14); the screen says why and offers the fix.
6. States: saving shows a progress state; offline disables saving and shows `xct.offline.needs_connection` (permission changes are online only, XCT-05 Table C); the new permissions take effect immediately on success and the member page refreshes.
7. Errors: on failure nothing changes and the message states "No permission was changed" with Try again; stale data (someone else changed the same person's access meanwhile) shows both versions and asks to review instead of overwriting.
8. Notifications: the affected person gets push (`msg.grp.permission_granted.push` or `msg.grp.permission_revoked.push`) and an in-app item; for money-out changes the SMS fallback applies if the push is not opened (NTF-05). Holders of Group: view audit log see an in-app feed item, no push.
9. Audit: `permission.granted` or `permission.revoked` with grantor, target, permission name, object, time, and the previous and new effective access; narrowing a project's access writes `permission.project_narrowed` with the same fields plus the project. No ledger entry. Entries cannot be edited or deleted.
10. Rule: narrowing a project's access for a person needs Group: grant permission and Group: revoke permission, no PIN and no vote, and is never a lock-out path (GRP-14). Granting Event: create to someone without Event: invite shows once: "This person will also need Event: invite for events to reach members." The two permissions are not merged. A granted Wallet: approve spend below the money-out tier required for the amount (ACC-07) stays inactive; the group sees only "cannot approve yet", and only that person sees "verify your identity to reach the tier"; KYC status is never shown to others.

**Data:** Membership, Audit entry, Approval (voided). **Depends on:** GRP-07, GRP-13, GRP-14, SPD-05, SPD-07, SPD-08, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: granting Wallet: approve spend does not need a second holder of Group: grant permission and no vote in the MVP. Reason: the floor of GRP-13 already means one granted person can never pay alone (D1, D4), the grant needs the grantor's PIN, is audited, notified and visible to every member (GRP-05, GRP-10), and an extra gate would stop small groups with two people from ever starting. Revisit after field interviews if collusion between two holders appears as a fear. The one exception is recovery after a lock-out, which uses a vote (GRP-14).

---

### GRP-09 See what a person can and cannot do right now

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** none for one's own panel; Group: view group for others
**Tags:** audit, offline

**Story:** When I wonder why I cannot do something, or when I want to check someone's access, I want an "Effective access" panel that lists what the person can and cannot do and why, so I can fix it or trust it.

**Conversation:** An experiment found effective-permission views beat rule lists, 83.6% against 56.5% accuracy (n=36) (R07 section 8.5; DF section 4). R-PM2 and R-PM7 in R07 section 8.5 ask for the source of each permission and a named person to ask. Inheritance must be visible ("Inherited from the group"; R04 section 13).

**Preconditions:** Person is a member. **Trigger:** Opens "What I can do here" or a member page, or follows a link from a blocked action.

**Acceptance criteria:**
1. Happy path: the panel shows two lists, "Can" and "Cannot", in verbs per object (for example "Approve spending", "Edit the contribution plan"), each can-line with its source: "From bundle Treasurer, changed", "Given by Sara on 12 Oct" or "Inherited from the group". Where a project has narrowed the person's access, the panel shows that exclusion layer: "Narrowed for project <name> by <name> on <date>".
2. Rule: where business rules limit a permission, the line says so in words: "Approve spending. Requests above X Ar need 3 approvals" (from GRP-12). The panel shows these thresholds but does not edit them.
3. Rule: any member sees their own panel; seeing another member's panel needs Group: view group. Cannot-lines name the permission and who holds Group: grant permission ("You need 'Approve spending'. Ask Mamy or Sara.").
4. Rule: blocked actions anywhere in the product link to this panel, so a person is never left with a bare "Not allowed".
5. States: loading skeleton; offline shows the cached panel with its last synced time and a note that access may have changed since; empty panel for a person with no permissions shows "This person can only be seen by the group" and the reason.
6. Errors: if the permission service does not respond, the panel shows "We could not check this now. [Try again]" and never shows a guess; the UI makes no decision from a stale panel (the server enforces access).
7. Notifications: none.
8. Audit: viewing another member's panel is not audited; the data shown comes from the same permission check used to enforce access, so the panel cannot disagree with reality.
9. Accessibility and language: lists are headings with real list markup, state is conveyed by words and icons, and all verb phrases come from the same message keys as the bundles (GRP-07).

**Data:** Membership, Permission check results, Threshold settings. **Depends on:** GRP-07, GRP-08, GRP-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no "preview as member" mode in the MVP (R07 R-PM6). The effective access panel already answers the question and the mode adds a second way to read the same facts. Revisit if prototype tests show people cannot predict what a bundle gives.

---

### GRP-10 See who changed access, and when

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Group: view audit log (own history needs none)
**Tags:** audit

**Story:** As a member, I want a readable history of every access change in the group, so that I can see who gave or took away power and when.

**Conversation:** "Every permission change is written to the audit log and visible to authorised members" (info.md, Permissions section, safeguards; conventions section 7). R07 section 8.5 R-PM4: show who granted what and when, and let a member see their own access history. Group scandals in tontines come from hidden control (R01 section 5), so this view is a trust feature, not an admin tool. It is the plain-language face of the audit log in GRP-11.

**Preconditions:** Group exists. **Trigger:** Opens "Access history" in the group or on a member page.

**Acceptance criteria:**
1. Happy path: a vertical timeline lists each change as a sentence: "Sara gave Mamy 'Approve spending' on 12 Oct 14:05". Each entry shows actor, target, permission in plain words, date, time and the reference id. Project narrowing entries ("Sara narrowed Rado's access to project School fees") appear in the same timeline.
2. Rule: holders of Group: view audit log see the whole group history; any other member sees only entries about themselves. A former member keeps read-only access to the entries about themselves, as for their payment record (GRP-17).
3. Rule: filters by person and by permission class (money-out, continuity-critical, other); entries are append-only. A correction appears as a new entry, never an edit.
4. Rule: entries made by the system (creation, safeguard events such as GRP-14 blocks and approver shortage warnings) are labelled "System".
5. States: empty history shows "Nobody has changed access yet"; loading skeleton; offline shows cached entries with "Last synced"; paging loads older entries on demand.
6. Errors: a failure to load shows the cached entries and "Could not update. [Try again]".
7. Notifications: none; changes already notified the target (GRP-08).
8. Audit: reading the history is not audited; the entries are the audit entries `permission.granted`, `permission.revoked`, `permission.project_narrowed`, `membership.joined`, `membership.left`, `membership.removed`.
9. Accessibility and language: timeline entries are real text with absolute date and time, no information only by position, and are available in all three languages with member names left as entered.

**Data:** Audit entry. **Depends on:** GRP-08, GRP-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: yes, a former member keeps read-only access to entries about themselves (criterion 2), because it is their own record and it supports an appeal through support (OPS-06).

---

### GRP-11 Keep a complete audit log of group-level actions

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder; Gereo operator
**Permission needed:** Group: view audit log (operator access is an operator permission defined in OPS-01 and OPS-09, not a member permission)
**Tags:** audit

**Story:** As a member who can view the audit log, I want a readable log of group-level actions beyond access changes, and as a Gereo operator I want to read the same log for investigations, so that disputes can be settled by facts.

**Conversation:** The brief requires a "complete audit log" as a non-functional rule (info.md, non-functional requirements table, security row) and the research ties fraud to unaccountable administrators (CA section 4 point 2). Open Collective's trail of states and comments is the benchmark (R08 section 6.7). This story is a filtered read view over SPD-16 (request events, expense entries and the authorising approval or vote link) plus group-level events (permissions, settings, membership); it stores no second copy and states no retention number (retention is inherited from SPD-16 through `AUDIT_RETENTION_YEARS`, owned by OPS). Operator reading sits in OPS-09. The log records who did what; it does not duplicate the ledger (WAL).

**Preconditions:** Group exists. **Trigger:** A group-level action occurs or someone opens "Audit log".

**Acceptance criteria:**
1. Happy path: every group-level action in this list produces exactly one entry with actor, target, group id, time and reference id: group created, edited, archived, restored, deleted; member invited, joined, declined, left, removed; permission granted and revoked; project access narrowed; spending policy changed; notification settings changed; wallet created, renamed, retyped; safeguard blocks; invite revoked. Request events and expense entries are read from SPD-16, not copied.
2. Rule: entries are append-only. A correction is a new entry that references the first. No user, holder or operator can edit or delete entries. The view stores nothing of its own.
3. Rule: entries store identifiers and plain facts, never PINs, OTPs, full card or phone numbers (phone numbers appear masked).
4. Rule: holders of Group: view audit log see every entry and can search and filter by actor, target, action type and date range; any other member sees only entries about themselves, and former members keep their own entries (the access history of GRP-10 is a filtered view of the same entries). Money movements are not listed here; each entry links to the ledger line or approval where it relates to one.
5. Rule: operator reads of a group's audit log follow OPS-09: they happen with a recorded reason, and the access is itself logged and shown to members with the reason as "Gereo support viewed the audit log".
6. States: empty log can occur only before creation completes; paging for long logs; offline: the log is not cached, and the page says it needs a connection (`xct.offline.needs_connection`).
7. Errors: if an action cannot be logged, the action itself is refused and nothing changes ("We could not record this change, so it was not made").
8. Notifications: none from the log itself; entries do not produce messages.
9. Accessibility and language: the same sentence builder as GRP-10; entry type names are message keys in three languages.

**Data:** Audit entry. **Depends on:** GRP-08, GRP-10, SPD-16 (request events and expense entries), OPS-09 (operator access), WAL-14 (ledger links).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: viewing the wider audit log is its own permission, Group: view audit log (decision D2), so a group can show access history to many people and the full log to few. Still open, needs a lawyer: the retention period and its legal basis (CA section 6 constraint 8 cites five years under Art. 53, unconfirmed). Default: 5 years, `AUDIT_RETENTION_YEARS` (owned by OPS). Closed: the audit log is not cached offline.

---

### GRP-12 Set the amount above which more people must agree

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: set spending policy)
**Permission needed:** Group: set spending policy
**Tags:** legal-gate, audit

**Story:** As a member who can set the spending policy, I want to set the amounts above which more people must approve or the group must vote, so that the group's money is protected in proportion to the amount.

**Conversation:** Spending above a threshold requires the approval of several people or a vote (info.md, Permissions section, safeguards). Multi-approver spending is table stakes (CA section 5) and no consumer app documents its interface (R08 section 6.7 open opportunity; R07 section 8.4 R-AP4, "2 of 3 approvers needed"). Decision D2 gives this its own permission, Group: set spending policy, instead of the Wallet: edit rules stand-in, so the person who edits wallet rules cannot also weaken the protection. This story edits the SPD parameters `spd.spend_approvals_default`, `spd.spend_multi_threshold`, `spd.spend_approvals_multi` and `spd.spend_vote_threshold`; SPD-02 shows them and SPD owns their meaning. It is the single "Spending rules" page and also hosts `grp.split_change_requires_vote` and `grp.plan_change_requires_vote`, which closes CON-20. Under decision D4 a passed vote replaces approvals for the amounts at or above `spend_vote_threshold`. The values are group settings; nothing here fixes a value.

**Preconditions:** A group wallet exists; person holds Group: set spending policy. **Trigger:** Opens "Spending rules" on the group or wallet.

**Acceptance criteria:**
1. Happy path: the screen shows spending bands in plain sentences and lets the person edit them: "Up to X Ar: 1 approval from someone other than the requester. From X Ar: 2 approvals. From Y Ar: the group votes instead of approvals." Amounts are whole ariary. A live line shows the effect for a sample amount. The same page lists every SPD parameter tagged GRP-12 (the thresholds, `receipt_required_above`, `spend_cap_mode`, `freeze_lift_approvals`, `request_expiry`, `project_spend_requires_decision`) and the two change-vote settings `grp.split_change_requires_vote` and `grp.plan_change_requires_vote`. All of them need Group: set spending policy. Only the thresholds are edited as bands; for the others the page shows the SPD owner's definition and edits the value.
2. Rule: the platform floor always applies underneath every band; see GRP-13 (and VOT "Kinds of vote" for the vote half). A band can only add approvals or require a vote, never remove the floor.
3. Rule: a band cannot demand more than the group can supply. Approvals required must not exceed the number of reachable holders of Wallet: approve spend minus one (the requester can never approve their own request, D1; see GRP-13). A vote band is blocked while too few eligible voters hold Vote: vote to meet the vote floor (GRP-13, VOT "Kinds of vote"; counted voters follow GRP-13 criterion 2, so guests are excluded). If a band would exceed the supply, saving is blocked with "Only 2 people can approve. Add another approver or lower this number." When reachable holders later fall below a band's requirement, affected requests stay in Needs attention and the recovery by vote of GRP-14 applies; bands are never auto-clamped. When the eligible voters cannot meet the vote floor of GRP-13, a money vote is unavailable and the approval band applies (small-group fallback, conventions 10.7), and a spending policy must always keep one executable path, checked at save here and in GRP-14. On save the page warns when any band has fewer eligible approvers (money-out capable, excluding the requester, ACC-07) than the band needs. The page shows "approvers" and "voters able to be reached" as anonymous counts, with a warning when fewer than two people other than the requester can be reached; no identities and no cause are shown, and the counts are hidden for groups under five members except the warning (EV-GRP-12).
4. Rule: bands must be ordered and non-overlapping; the vote band uses the vote link to an expense (SPD-09, VOT-03), and the choice is disabled with the reason if that link is unavailable.
5. Rule: tightening a rule (more approvals, lower amount) applies at once. Loosening a rule (fewer approvals, higher amount, removing a vote; setting `grp.split_change_requires_vote` or `grp.plan_change_requires_vote` to Never, or lowering either) is held as a proposed change that needs either two distinct approvers other than the proposer (holders of Wallet: approve spend, and at least as many as the strictest band currently requires) or an authority vote (VOT-01, via proposal reference). Tightening is always allowed. One person cannot quietly weaken the protection, so there is no "min(2, others)" relaxation. A group that cannot meet this (for example its continuity minimum is exactly two approvers and it has fewer than three voters) simply cannot loosen: the screen shows the warning "This group cannot loosen its limits: it needs two other approvers or a vote. You can still tighten them." before the person edits, rather than failing late. Every loosening notifies all members and writes an audit entry. Never is not offered for `grp.split_change_requires_vote` or `grp.plan_change_requires_vote` for any rule that moves money to another wallet; the decision gate of GRP-13 criterion 4 applies (conventions 10.5b).
6. Rule: requests already waiting keep the approval rule they were created under, shown on the request ("Rule when requested: 2 approvals"). Only new requests use the new rule.
7. Rule: the policy is set per group and every group wallet inherits it. A holder of Group: set spending policy may give one wallet its own bands (stricter or equal to the group's, or looser only through the loosening proposal of criterion 5).
8. States: saving state; offline disables saving with an explanation; empty state before any band is set shows the default floor in words and an "Add a band" button; stale data shows both versions as in GRP-08. A failed save changes nothing and says so; nothing about money moves from this screen.
9. Notifications: holders of Wallet: approve spend receive push when thresholds change (`msg.grp.threshold_changed.push`); a loosening proposal notifies the required approvers (`msg.grp.threshold_loosen_requested.push`) with SMS fallback if unread (NTF-05), and members are told through the same keys. Operator reads of this history go through OPS-09, with the reason shown to members.
10. Audit: `threshold.changed` or `threshold.loosen_requested` and `threshold.loosen_approved` with before and after values, actor, approvers and time.

Test case: a group with exactly two reachable approvers (its continuity minimum) and fewer than three voters opens "Spending rules", sees the cannot-loosen warning, can save a tightening at once, and a loosening attempt is refused at the screen with no proposal created.

**Data:** Wallet rule (spending threshold), Audit entry. **Depends on:** GRP-13, GRP-14, SPD-02, SPD-05, SPD-09, VOT-01, VOT-03, WAL-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the page hosts `grp.split_change_requires_vote` and `grp.plan_change_requires_vote` (closes CON-20). Closed: the permission is Group: set spending policy (D2); loosening needs two distinct approvers other than the proposer and at least the strictest band's count, or an authority vote, and a group that cannot meet this cannot loosen (criterion 5); thresholds are per group with an optional per-wallet override (criterion 7).

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

**Preconditions:** A group wallet exists. **Trigger:** Any attempt to move money out of a group wallet, including transfers to a personal wallet, wallet closure, payouts from rules and refunds.

**Acceptance criteria:**
1. Happy path: the floor is met by exactly one path. A spend from a group wallet is created by one person (Wallet: initiate spend) and completes only through (a) the approvals of the band set in GRP-12, each from a distinct eligible person other than the requester (Wallet: approve spend), or (b) a passed authority vote, which is the authorisation and starts the payment without approvers (decision D4; the vote half, including the fixed authority-vote floor, is owned by VOT "Kinds of vote" and is not restated here). The review screen reads "Asked by Sara. Needs 1 more approval." (the count comes from the band). A band can only add approvals or require a vote, never remove the floor, and no setting lowers it.
2. Rule: this is the only ineligibility list for the floor. Ineligible: the requester (decision D1: never an approver or a floor voter of the same request, even as founder or holder of Wallet: approve spend); anyone who already approved on that request; any person under an operator hold (OPS-10); any person who has left the group or lost the needed permission (approvals are re-checked at execution, SPD-10; votes are evaluated at close only, and a hold or departure after a vote closes never voids the closed vote); any person acting through an operator-console role or session (OPS-01 catalogue). A staff member's personal member account counts normally. The payee is NOT excluded. A "distinct person" is one Active member with a PIN account; guests count toward majority and quorum but never toward the floor. Other files cite this criterion and do not restate it.
3. Rule: operators cannot lift a freeze, cannot complete an outflow and never count toward the floor. The server enforces the floor, not only the screens: a direct API call, a rule firing (RUL) or an operator action that would complete a group-wallet outflow without the authorisation of criterion 1 is rejected with a stable error code, and no ledger entry is written.
4. Rule: what counts as an outflow. (i) Manual or request-made moves between wallets of the same group need the floor like any outflow, as do moves to a personal wallet, out to mobile money, Pay Gereo and an SMS allowance top-up (NTF-06). (ii) Rule-made intra-group moves are authorised once, at the save of the rule version under RUL-13 AC4/5 and the decision gate (CON-13), not per move; a move into a wallet that has rules fires them, and money arriving from another wallet or a rule is income for the receiving wallet (decision D3), so chains are allowed within RUL-06 limits. Not outflows: deposits, contributions, closing a wallet at zero balance with nothing pending (WAL-05), and the rounding line of a split (under 1 Ar per destination, credited to Gereo, decision D5; CON-14, ACC-13). Campaign refunds (ANN) are system postings that follow their own story. Rule gate fallback order (CON-13, RUL-13 AC4, CON-11): a rule or plan change that moves money to another wallet needs, in order, (1) an authority vote when at least three holders of Vote: vote exist; (2) otherwise PIN approval from one other holder of Wallet: edit rules; (3) otherwise, only a group with exactly one Active member saves alone, and the audit entry records "Single member, no gate". No other skip exists, and the first Active rule on a wallet is gated like any other when it moves money to another wallet.
5. Rule: lifting a freeze (SPD-15) needs two distinct approvers or an authority vote. The vote path needs at least three holders of Vote: vote; a group below three has no vote path and relies on approvals or on recovery through OPS-06.
6. Rule: the floor is evaluated on ballots received by the server at close, never on queued or "Waiting to send" ballots (XCT-05). A vote that ends below the floor is "Not passed (quorum not met)" and never falls back to approvals.
7. States and errors: when the group has fewer than two reachable, money-out capable holders of Wallet: approve spend (counted by tier, not by current new-device cooling, so a phone change never flips the banner), a banner says "Money cannot leave this wallet until a second person can approve it" and payout buttons are disabled with that reason; deposits and contributions continue to work, and the vote path stays available only on the conditions of SPD-09. If an outflow is blocked the message states "No money moved" and names who could approve; the next action is a link to add or ask an approver (GRP-08). A rule whose destination leaves the group's wallets or reaches another owner's wallet needs the saver to hold the money-out tier for the maximum it can move per firing (ACC-07); internal-only rules need Tier 1. Loading and offline states follow GRP-06.
8. Notifications: when the group drops below two approvers the holders of Group: grant permission get push, with SMS fallback (`msg.grp.approver_shortage.push`, `.sms`); the banner stays until fixed.
9. Ledger and audit: each outflow's ledger entry stores the initiator and every approver, or the vote and its voters, with timestamps; a blocked attempt writes the audit entry `safeguard.blocked` with actor, attempted amount and reason; none writes a ledger entry.
10. Accessibility and language: the rule is explained in one sentence in all three languages and shown in the invite preview (GRP-04) and in the founder card (GRP-02).

**Data:** Ledger entry (initiator, approvers or vote), Approval, Vote, Audit entry. **Depends on:** SPD-01, SPD-05, SPD-08, SPD-09, SPD-10, WAL-09, WAL-12, WAL-14, RUL-07, RUL-13, VOT-03, VOT "Kinds of vote", SPD-15, NTF-06 (an SMS top-up approval follows the dual-control rule), OPS-01 (no unilateral operator move).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a group split rule never becomes Active, nor changes percent or destination, by one person's action alone; the save passes the decision gate (criterion 4). Closed: transfers between two wallets of the same group need the floor in the MVP when manual or request-made (criterion 4 (i)); rule-made transfers are authorised once at rule save (criterion 4 (ii)). Closed: Gereo staff are never a second approver and never a voter (criterion 2). Accepted residual risk: one person holding two SIMs as two Active members with PIN accounts can meet the floor alone; this is an identity-assurance problem owned by ACC and OPS, mitigated here only by excluding guests and requiring Active members with a PIN account.

---

### GRP-14 Keep the group from locking itself out

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder; System
**Permission needed:** Group: revoke permission, remove member (to attempt the actions that trigger it)
**Tags:** legal-gate, audit

**Story:** When someone who holds a critical permission is about to leave, be removed or lose it, I want the product to stop me from leaving the group without anyone able to approve or manage, so I can hand the duty over first.

**Conversation:** A group where the last approver leaves has money nobody can move; a group where the last holder of Group: grant permission leaves can never fix its access. Continuity-critical permissions and their minimum holders are defined in the Shared definitions section. The same logic must handle accounts that become unreachable (lost phone, deactivated), which the research flags as a key-person dependency (R01 section 13 risk 6).

**Preconditions:** The group has continuity-critical permissions held by few people. **Trigger:** A holder tries to leave (GRP-16), is removed (GRP-17), or has a permission revoked (GRP-08); or an account becomes inactive.

**Acceptance criteria:**
1. Happy path: when the action would leave fewer holders of a continuity-critical permission than required, it is blocked with "You are the last person who can <approve spending>. Give it to another member first." and a button to open the grant screen with a member picker.
2. Rule: required holders are one for Group: grant permission, revoke permission, remove member and set spending policy, and two for Wallet: approve spend while any group wallet holds a balance or has money in flight; the minimums come from `grp.continuity_permissions` in the Shared definitions section and the safeguard in GRP-13. Group: delete group is not listed. Only money-out capable holders (ACC-07) count toward the approve-spend minimum, by tier and not by current new-device cooling. A policy or permission change that would leave a spending policy with no executable path is refused at save (GRP-12). Project: approve purchase is also on the continuity list as a warning only, not a block: losing its last holder shows a warning, and requests on the approvals path rely on the SPD-13 stuck-request escape.
3. Rule: the block applies to every route to the same outcome: leaving, removal, revocation and self-revocation. A member with no critical permission is never blocked from leaving by this story.
4. Rule: block checks use "holders" (all holders). The warning uses "reachable holders" (excluding Locked, Inactive and Deactivated accounts): when fewer than two remain, the Active group shows the warning "Needs a second approver" (`msg.grp.approver_shortage`, a warning, not a status), GRP-13 banners apply, and holders of Group: grant permission are alerted. New-device cooling never triggers the banner. A wallet Held by Gereo triggers no continuity alarm and no "no approver" recovery vote. Project narrowing is never a lock-out path.
5. Rule: a recovery path exists for a group that cannot reach the minimum by itself: the remedy when reachable holders fall below the minimum is recovery by vote: the remaining members start a vote (VOT-01) that proposes new approvers. The recovery vote is an authority vote via proposal reference, and counted voters follow GRP-13 criterion 2 (guests excluded). A passed vote lets the remaining holders of Group: grant permission add them with the vote recorded as the authority. Gereo staff cannot move group funds and cannot grant on the group's behalf without that vote. The three-holder check of GRP-12 criterion 3 applies: with fewer than three eligible voters there is no vote path and the OPS-06 escalation applies, see Open questions.
6. States: loading and failure states follow the originating action; offline: all these actions are online only and say so.
7. Errors: a blocked action shows what is missing, that nothing changed, and who could be granted the permission (the current members with Group: view group).
8. Notifications: the person blocked sees the message only in-app; the group alert uses `msg.grp.approver_shortage.push` with SMS fallback to holders of Group: grant permission (NTF-05).
9. Audit: `safeguard.blocked` for each refused action and `safeguard.shortage` when a group enters the shortage state, with the permission concerned and current holders.
10. Rule: members see only a neutral "unavailable" marker next to a holder who is not reachable, with no reason and no mention of a lock. Test: for a holder whose account is Locked, no member-facing screen, message or API field contains the word lock or any status of that account, and only the marker differs from a reachable holder.

**Data:** Membership, Audit entry, Vote. **Depends on:** GRP-13, GRP-08, GRP-16, GRP-17, VOT-01 (recovery vote), NTF-05, OPS-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Still open, needs a lawyer and Gereo operations: the legal and operational process when no member can act (death, dispute, a group below three members). Default used: the wallet stays as it is, deposits continue, nobody moves the money, including Gereo staff, and the case is handled as an OPS-06 support ticket with identity evidence, resolved only through a recorded process the lawyer approves. Closed: operators may open and document such a case on request, but may not start or decide the recovery vote.

---

### GRP-15 Open another wallet inside the group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds Wallet: create)
**Permission needed:** Wallet: create
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can create wallets, I want to create further wallets for specific purposes (reserve, project fund, event kitty), so that the group's money is separated by purpose and visible to everyone.

**Conversation:** Group wallets have the same rules as personal wallets and are a differentiator (CA section 5). Wallet types and creation live in WAL-01; this story covers creating wallets from the group, their inherited access and the safeguard on them. Decision D2 adds the permission Wallet: create, replacing the Group: edit group stand-in, so creating wallets is separate from editing the group's name and rules.

**Preconditions:** Person holds Wallet: create; the group has fewer than `grp.max_wallets_per_group` wallets. **Trigger:** Taps "Add wallet" in the group.

**Acceptance criteria:**
1. Happy path: Wallet: create covers creating, renaming and retyping a group wallet, with no PIN. The person names the wallet and picks a type (budget, savings, investment, business). The wallet is created with a balance of 0 Ar, appears on the group home and ledger views, and is visible to every member with Wallet: view balance.
2. Rule: the new wallet inherits access from the group (members see its balance and history per the Member bundle) and inherits the group's spending rule from GRP-12; it can have its own bands afterwards by a holder of Group: set spending policy (GRP-12 criterion 7).
3. Rule: GRP-13 applies fully to the new wallet from its first day. The new wallet can be a destination of a rule or a split, and money arriving that way is income for it (decision D3); the cycle and depth checks of RUL-06 apply.
4. Rule: reaching `grp.max_wallets_per_group` blocks creation with the limit and the next action.
5. States: saving state; offline disables creating with the usual explanation; the list of wallets is cached offline.
6. Errors: a failed creation creates nothing and says so; a duplicate wallet name inside the group is allowed with a soft warning.
7. Notifications: in-app item for members (`msg.grp.wallet_created.inapp`), batched under NTF-08; no push or SMS.
8. Ledger and audit: ledger account created with no entry; audit `wallet.created`, `wallet.renamed` and `wallet.retyped` with actor, type, time.

**Data:** Wallet, Ledger account, Audit entry. **Depends on:** GRP-01, GRP-12, GRP-13, WAL-01, RUL-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: CON-11 refers to this story for a second campaign wallet. Closed: creating a group wallet is Wallet: create (D2) and closing stays Wallet: close, a money-out permission (WAL-05). Still open, needs a lawyer (same review as GRP-01): whether several client-fund wallets in one group change the legal basis; default: limited by `grp.max_wallets_per_group`.

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
3. Rule: amounts due are handled by `grp.leave_obligation_policy`: either settled before leaving, or waived by a holder of Contribution plan: exempt member (CON-10), or recorded as an outstanding debt in the history. The default is the debt record, with "Pay now" and the exemption both offered. The summary names which applies and offers "Pay now" or "Ask a treasurer for an exemption".
4. Rule: leaving is blocked while the person's pending money in flight exists (a pending contribution, a spend they requested) and while GRP-14 would be violated; the screen explains and links to the fix.
5. Rule: after leaving, the person cannot cast further ballots; a ballot already cast stays counted and the quorum denominator of an open vote is not reduced (it is fixed when the vote opens, VOT-02). Their pending approvals are voided and approvers re-notified, and their name stays on past ledger lines and decisions as "Former member".
6. States: confirm step requires typing nothing but a clear button "Leave group"; offline disables with the usual message; the summary is readable offline from cache with last synced time.
7. Errors: a failure leaves the person in the group and says so; no money moves from this action.
8. Notifications: in-app confirmation to the leaver (`msg.grp.leave_confirmed.inapp`); push to holders of Group: remove member and Wallet: approve spend (`msg.grp.member_left.push`); no SMS unless the leaver held a continuity-critical permission (then SMS fallback applies, NTF-05).
9. Ledger and audit: no ledger entry from leaving itself; an outstanding debt, if recorded, is a note on the member history, not a ledger entry; audit `membership.left` with the summary shown (contributed, due, policy applied).

**Data:** Membership, Contribution, Approval, Audit entry. **Depends on:** GRP-14, CON-03 (amounts due), CON-10 (exemptions), SPD-07 (voided approvals), VOT-04 (ballots), WAL-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: quorum after someone leaves an open vote stays fixed and the leaver's ballot stays counted (criterion 5); if the D4 floor of two distinct voters is then no longer met only because of the departure, the vote closes Not passed (floor not met) and says so (VOT-02). Closed: a late fee already applied is a due amount, not a debit, and is waived with an exemption (CON-09 criterion 2, CON-09 criterion 4); refunding paid items is an ordinary group spend (CON-10 open questions). The default policy for unpaid contributions is the debt record (parameter table). Still open, needs a lawyer: whether a leaver has any legal claim on group funds. Default used: none, money paid stays in the group wallet unless the group's written rule or a group spend says otherwise (criterion 2).

---

### GRP-17 Remove someone from the group

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder (holds Group: remove member)
**Permission needed:** Group: remove member
**Tags:** audit, legal-gate

**Story:** As a member who can remove members, I want to remove someone with a recorded reason, so that the group can protect itself while the person is treated fairly.

**Conversation:** Stanbic uses reversible member statuses (active, on-hold, terminated) (R08 section 6.11). Removal changes who can see the ledger and who can approve money, so it must be visible and safe (R07 section 8.5). Fairness matters: shaming is a risk in groups (R07 section 8.8 R-NT8; section 9 R-MC8).

**Preconditions:** Person holds Group: remove member; target is an active member other than themselves. **Trigger:** Opens a member page and taps "Remove from group".

**Acceptance criteria:**
1. Happy path: the screen shows what removal does (access ends now, pending requests are cancelled, approvals voided), asks for a reason from presets plus optional text, and requires a confirm with the button "Remove <name>".
2. Rule: a person cannot remove themselves (they use GRP-16). A removal that would violate GRP-14 is blocked with the usual explanation. Removing someone holding a money-out permission (class in the Shared definitions) requires the remover's PIN.
3. Rule: on removal, all the person's permissions in the group end at once, their pending spend requests are cancelled, their approvals on pending requests are voided with approvers re-notified, and they can no longer vote. As in GRP-16, a ballot cast before removal stays counted and the denominator is fixed; the removed member cannot cast a new ballot. Before the remover confirms, the screen shows which open money votes the removal would affect through the voter floor (VOT-02).
4. Rule: amounts the removed person still owes are not erased: they stay visible to holders of the relevant contribution permissions as an outstanding amount and follow `grp.leave_obligation_policy`.
5. Rule: the removed person keeps a read-only record of their own payments and receipts; they cannot see the group ledger, balance, members or votes. They do keep read-only access to the access-history entries about themselves (GRP-10).
6. States: saving state; offline disables the action with an explanation; the removed person's next app open shows "You are no longer in <group>", the reason code in plain words and what they keep.
7. Errors: failure leaves membership unchanged and says so; no money moves.
8. Notifications: the removed person gets push and an SMS fallback (`msg.grp.member_removed.push`, `.sms`) with no reason text in the SMS; holders of Group: view audit log get an in-app item (`msg.grp.member_removed.inapp`); the group channel never names the reason.
9. Ledger and audit: no ledger entry; audit `membership.removed` with remover, target, reason code, permissions held at the time and the cancelled and voided items.

**Data:** Membership, Approval, Expense request, Audit entry. **Depends on:** GRP-14, GRP-16, SPD-07, SPD-12, VOT-04, CON-10, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: removing someone with a continuity-critical permission does not need a vote; GRP-14 already blocks any removal that would leave the group unable to act, and a vote would let a majority stall a legitimate removal of a thief. Closed: a removed person appeals through a support ticket (OPS-06), seeing their own access history (GRP-10); the group decides again by re-inviting. Closed: no reversible on-hold status in the MVP; removal is the single, audited action, and re-inviting is the reversal.

---

### GRP-18 Change the group's name, purpose and rules text

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds Group: edit group)
**Permission needed:** Group: edit group
**Tags:** audit

**Story:** As a member who can edit the group, I want to update the group name, purpose and written rules, so that the information new members see is accurate.

**Conversation:** The constitution or rules must be visible before joining and reachable later (R08 section 6.4 adopt). The rules text is the group's own words (for example on leaving, on lateness); it informs but does not enforce. Enforced rules live in CON, SPD and GRP-12. Changing the name affects SMS templates, which use a GSM-7 safe short form (NTF-07).

**Preconditions:** Person holds Group: edit group. **Trigger:** Opens "Edit group".

**Acceptance criteria:**
1. Happy path: the person edits name, purpose and a free-text "How our group works" section; saving shows the new text immediately in the group page and in the invite preview.
2. Rule: edits keep a version history showing who changed what and when (audit); the text can be restored to an earlier version by creating a new version.
3. Rule: a change to the "How our group works" text is a material change: all members get an in-app item and a push (`msg.grp.group_edited.push`); a name or purpose change gets an in-app item only.
4. Rule: invite links already sent keep working and show the current text on open; invitees who opened the preview earlier see the new text when they accept.
5. States: saving state, conflict state if two people edit the same field (both versions shown); offline: the draft of name, purpose and rules text is a local draft only (XCT-05 Table B), never auto-sent, labelled with the `Draft, not sent` key; saving it for real needs a connection and shows `xct.offline.needs_connection`.
6. Errors: validation as in GRP-01; a failed save keeps the text in the form.
7. Notifications: as in criterion 3; no SMS.
8. Audit: `group.edited` with field names, previous and new values, actor and time.
9. Accessibility and language: the text field supports 200% font scale, and the form explains that the text is shown in the language written, with an option to add translations later.

**Data:** Group, Audit entry. **Depends on:** GRP-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the rules text is one language in the MVP, the one it was written in (criterion 9); translations come later. Closed: Group: enable module has no screen in the MVP, because every MVP module is on for every group; the permission stays in the catalogue for later modules (LTR).

---

### GRP-19 Close a group but keep its history

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder (holds Group: delete group)
**Permission needed:** Group: delete group
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can close the group, I want to archive it when it has served its purpose, so that nothing new happens but everyone keeps the record.

**Conversation:** Records must stay (append-only ledger, no deletion of decisions; R04 section 14.3). Open Collective Foundation's dissolution stranded groups' funds on two weeks' notice (R04 section 14.6 risk 4), so closing must never leave money or members in limbo. Archiving and deleting both use Group: delete group; no separate permission is needed because archiving is the reversible first step of the same act.

**Preconditions:** Person holds Group: delete group. **Trigger:** Opens "Archive group".

**Acceptance criteria:**
1. Happy path: the screen checks the conditions and shows each as done or not: all group wallets at 0 Ar, no pending transactions, no waiting spend requests, no open votes. When all pass, the person confirms with the group name typed and the PIN.
2. Rule: archiving needs a second person: a different holder of Group: delete group must confirm within `grp.archive_grace`, or the request lapses (the group stays Active). Until confirmed the group is Archive pending. When fewer than two holders of Group: delete group exist, the archive falls back to a group vote under the normal quorum.
3. Rule: if a wallet still has money the screen says "Pay out the remaining <amount> first" with a link to a spend request (SPD); the archive cannot proceed until the balance is 0 Ar by approved outflows.
4. Rule: once archived the group is read-only for all members: ledger, decisions, members and audit remain visible and exportable; no contributions, requests, votes, events or reminders are created; scheduled reminders stop.
5. Rule: a holder of Group: delete group can restore an Archived group at any time with a second, different holder of Group: delete group confirming (or a group vote under the normal quorum when fewer than two holders exist), which writes an audit entry; restoring does not reopen cancelled votes.
6. States: archiving state; offline disables with an explanation; the archived group shows a clear "Archived on 12 Oct" banner in every language.
7. Errors: a failed archive leaves the group active and says so; money never moves from this action.
8. Notifications: the second confirmer gets push (`msg.grp.archive_requested.push`) and all members get push when it completes (`msg.grp.archived.push`); no SMS unless a member holds an open obligation (then SMS fallback applies).
9. Ledger and audit: no ledger entry from archiving; audit `group.archive_requested`, `group.archived`, `group.restored`.

**Data:** Group, Wallet, Audit entry. **Depends on:** GRP-13, SPD-01, SPD-10, VOT-05, CON-03, WAL-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: archiving does not need a vote of all members; two holders of Group: delete group, every member notified, and the archive is reversible (criterion 5). Still open, needs a lawyer (same process as GRP-14): whether a group with unreachable members can ever be force-closed. Default used: no force-close, the group stays Active.

---

### GRP-20 Delete a group, within what the law lets us

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Permission holder (holds Group: delete group)
**Permission needed:** Group: delete group
**Tags:** legal-gate, ledger, audit

**Story:** As a member who can delete the group, I want to delete an archived group so that it stops appearing, while records the law requires are kept.

**Conversation:** The ledger is immutable and records must be kept (conventions section 2; CA section 6 constraint 8, five-year retention cited under Art. 53 but unconfirmed). Data export on day one and a published shutdown and retention commitment are design rules (CA section 7). So deletion means removal from member views and deletion of non-required content, not erasure of the ledger.

**Preconditions:** The group is archived and the person holds Group: delete group. **Trigger:** Taps "Delete group" on an archived group.

**Acceptance criteria:**
1. Happy path: the screen explains what is removed (name from lists, announcements, events, documents, chat-like content) and what is kept for the retention periods (`AUDIT_RETENTION_YEARS`, owned by OPS; ledger entries, approvals, decisions, audit entries) and offers a full export first (CSV and PDF) before the delete button.
2. Rule: only Archived groups can be deleted; a second holder of Group: delete group must confirm, as in GRP-19 (including its vote fallback when fewer than two holders exist). While waiting the group is Delete pending.
3. Rule: deletion starts a grace period `grp.delete_grace` during which the group is hidden but restorable; after it, content marked removable is erased and kept records are retained under `AUDIT_RETENTION_YEARS` and cannot be viewed by members.
4. Rule: members of a deleted group can still export their own contribution history from their wallet history for the retention periods.
5. Rule: kept records are accessible only through the operator process in OPS with a recorded reason.
6. States: the deletion state shows days remaining in the grace period; offline disables with the usual explanation.
7. Errors: a failed delete leaves the group archived; no money moves.
8. Notifications: push to all members when deletion is scheduled and when it completes (`msg.grp.delete_scheduled.push`, `msg.grp.deleted.inapp`); no SMS.
9. Audit: `group.delete_requested`, `group.delete_confirmed`, `group.deleted` with what was kept and what was erased.

**Data:** Group, Audit entry, Ledger entry (retained). **Depends on:** GRP-19, OPS-09, WAL-16, CON-18, ACC-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: members do not consent one by one to erasure of non-financial content. They accept the deletion rules in the terms (ACC-13), get the scheduled-deletion push, have the whole grace period and can export first (criterion 1). Still open, needs a lawyer: the retention period and its legal basis (see GRP-11). Default used: 5 years.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| GRP-01 | Start a group for the people I save with | P0 | ACC-02, ACC-03, WAL-01 |
| GRP-02 | Start with every permission, and say so | P0 | GRP-01 |
| GRP-03 | Invite people by link or by phone number | P0 | GRP-01, GRP-07, NTF-05, NTF-06, NTF-07 |
| GRP-04 | See the rules before I join, then join or decline | P0 | GRP-03, ACC-02, ACC-16 |
| GRP-05 | See who is in the group | P0 | GRP-01, GRP-03, GRP-09 |
| GRP-06 | Open the group and see where things stand | P0 | GRP-01, WAL-03, SPD-04, VOT-05, CON-06, EVT-08 |
| GRP-07 | See what each kind of member can do, in plain words | P0 | GRP-01, GRP-08 |
| GRP-08 | Give or take away a single permission | P0 | GRP-07, GRP-13, GRP-14, SPD-05, SPD-07, SPD-08, NTF-05 |
| GRP-09 | See what a person can and cannot do right now | P1 | GRP-07, GRP-08, GRP-12 |
| GRP-10 | See who changed access, and when | P0 | GRP-08, GRP-11 |
| GRP-11 | Keep a complete audit log of group-level actions | P0 | GRP-08, GRP-10, OPS-09, WAL-14 |
| GRP-12 | Set the amount above which more people must agree | P0 | GRP-13, GRP-14, SPD-02, SPD-05, SPD-09, VOT-01, VOT-03, WAL-01 |
| GRP-13 | No single person can move the group's money alone | P0 | SPD-01, SPD-05, SPD-08, SPD-09, SPD-10, WAL-09, WAL-12, RUL-07, RUL-13, VOT-03, NTF-06, OPS-01 |
| GRP-14 | Keep the group from locking itself out | P0 | GRP-13, GRP-08, GRP-16, GRP-17, VOT-01, NTF-05, OPS-06 |
| GRP-15 | Open another wallet inside the group | P1 | GRP-01, GRP-12, GRP-13, WAL-01, RUL-06 |
| GRP-16 | Leave a group and know what happens to my money | P0 | GRP-14, CON-03, CON-10, SPD-07, VOT-04, WAL-14 |
| GRP-17 | Remove someone from the group | P0 | GRP-14, GRP-16, SPD-07, SPD-12, VOT-04, CON-10, NTF-05 |
| GRP-18 | Change the group's name, purpose and rules text | P1 | GRP-01 |
| GRP-19 | Close a group but keep its history | P1 | GRP-13, GRP-20, SPD-01, SPD-10, VOT-05, CON-03, WAL-05 |
| GRP-20 | Delete a group, within what the law lets us | P2 | GRP-19, OPS-09, WAL-16, CON-18, ACC-14 |

Totals: 15 P0, 4 P1, 1 P2.

## Cross-epic dependencies

All IDs below were looked up in the story files of each epic.

- ACC: ACC-02 (phone and OTP sign-up) and ACC-03 (PIN) for GRP-01, GRP-04 and the PIN step in GRP-08; ACC-07 (tier ladder) for the tier limits on money in a group wallet; ACC-16 (open an invite or vote link without an account) is the entry point of GRP-04; ACC-11 (connected devices) for lost-account cases in GRP-14; ACC-13 (terms) for the rounding and deletion disclosures (GRP-13, GRP-20); ACC-14 (export my data) for GRP-20.
- WAL: WAL-01 (create a wallet, group option shared with GRP-15), WAL-03 (balance), WAL-05 (close), WAL-09 and WAL-12 (outflows covered by GRP-13), WAL-14 (receipt and ledger line carrying initiator and approvers), WAL-16 (export).
- RUL: RUL-06 (cycle and depth limits, also for D3 chains), RUL-07 (rule execution obeys GRP-13), RUL-13 (who may change rules on a group wallet).
- CON: CON-01 (plan summary in the invite preview, GRP-04), CON-03 (amounts due), CON-06 (member status board, GRP-06), CON-10 (exempt a member, GRP-16 and GRP-17), CON-14 (split execution and the rounding line to Gereo, D5), CON-17 (reconciliation line), CON-18 (export, GRP-20).
- SPD: SPD-02 shows the spending policy and GRP-12 edits it (SPD owns the parameters); SPD-08 and GRP-13 describe the same floor from two sides and must stay consistent; SPD-07 (edit request, approvals voided) for GRP-08, GRP-16, GRP-17; SPD-04 (approval inbox) for group home; SPD-01 and SPD-10 for the payout of a remaining balance before archive (GRP-19); SPD-09 (vote linked to an expense) for the vote band; SPD-12 (cancel) for GRP-17; SPD-15 (emergency freeze) must use Wallet: freeze (D2).
- VOT: VOT-01 (recovery vote and loosening vote), VOT-02 (quorum fixed at opening), VOT-03 (vote starts the payment, D4), VOT-04 (ballots of leavers), VOT-05 (open votes on group home).
- EVT: EVT-08 (upcoming events) feeds the next-event tile (GRP-06).
- PRJ: PRJ-06 (project follows the group's permissions) relies on the inheritance defined here.
- ANN: inherits group permissions (Publication: publish, announce to group); nothing blocks GRP.
- NTF: NTF-05 (push-then-SMS), NTF-06 (SMS allowance, uses Group: set notification settings; an SMS top-up approval follows the dual-control rule of GRP-13), NTF-07 (templates), NTF-08 (batching); message keys are listed in each story and in the NTF event catalogue (EV-GRP-01 to EV-GRP-18).
- XCT: XCT-01 (language), XCT-04 (offline read, last synced and `STALE_BALANCE_HOURS`), XCT-05 (queue what can wait), XCT-06 (no money-out offline), XCT-08 to XCT-10 (accessibility), XCT-14 (strings as keys).
- OPS: OPS-01 (operator permission catalogue), OPS-04 (reconciliation line), OPS-06 (support for locked groups and appeals), OPS-09 (operator reads of the audit log with a reason).

## Open questions

Each question below is closed with a decision, or kept open only when it needs a lawyer, Vanilla Pay or Gereo operations. The per-story Open questions fields carry the same decisions.

1. **Legal basis.** Still open, needs a lawyer and Vanilla Pay: whether and when a group wallet may hold member funds (CA section 6 constraint 1). Default used: groups can be created and used without deposits until confirmed. Closed: creating a group needs Tier 1 (ACC-07 table); group-wallet limits follow OPS-11 (GRP-01).
2. **Missing permission names.** Closed by decision D2: the five permissions Wallet: freeze, Wallet: create, Group: view audit log, Group: set spending policy and Group: set notification settings are added to the catalogue, and the stand-ins (Group: edit group for creating wallets, Wallet: edit rules for thresholds, a general view stand-in for the audit log) are replaced. Group: delete group serves both archive and delete. Conventions section 7 lists the names, including the five additions.
3. **Member bundle scope.** Closed: the Member bundle does not include Wallet: initiate spend or Vote: create. A member who wants to spend asks a Treasurer or receives the permission through GRP-08, which keeps control of who can open requests with the people who can be held to account. Open Collective's open submission suits a tool that never holds funds.
4. **Money already paid when leaving.** Closed for the product default: paid money stays, unpaid contributions are recorded as an outstanding debt, with "Pay now" and an exemption offered (GRP-16). Still open, needs a lawyer: any legal claim of a leaver on group funds.
5. **Loosening a safeguard.** Closed: loosening needs at least two distinct holders of Wallet: approve spend other than the proposer, and at least the strictest band's count, or a vote if the strictest band is a vote (GRP-12). Granting a money-out permission needs no second holder and no vote in the MVP (GRP-08).
6. **No-approver recovery.** Still open, needs a lawyer and Gereo operations: what can happen when a group cannot act (death, dispute, fewer than three members). Default used: nobody moves the money, including staff; support documents the case (GRP-14).
7. **Retention and deletion.** Retention period and legal basis still open, needs a lawyer (default 5 years, `AUDIT_RETENTION_YEARS`, owned by OPS). Closed: kept records are read only through OPS-09 with a reason; members do not consent individually to erasure of non-financial content (GRP-20).
8. **Visibility.** Closed: full phone numbers only for holders of Group: invite member or remove member; approvers are shown to members, not to invitees, who see only a count (GRP-04, GRP-05).
9. **Invite links.** Closed: 7 days, 50 uses for a shared link, single use for a phone invite, public posting in a group chat allowed with those limits (GRP-03).
10. **Group creation limits.** Closed: 10 groups per user, 10 wallets per group as starting values, creation allowed at Tier 1 (parameter table).
11. **Modules.** Closed: no enable-module screen in the MVP; every MVP module is on for every group (GRP-18).
12. **Evidence gaps.** The effective access panel and the bundle wording are untested in Malagasy; the 83.6% result is from an experiment outside Madagascar (R07 section 8.5). Needs field research: test with real members in the first prototype round.
13. **Vote minimum for money.** Default under decision D4, to confirm in field interviews: a money vote counts only with at least two distinct voters other than the requester, so a group needs at least three members able to vote to use the vote path (GRP-12, GRP-13).
