# GRP: screen and state inventory

Source: `docs/product/stories/GRP.md` (20 stories). Surface IDs are `SCR-GRP-nn`. Kinds: page, sheet, modal, inline, notification, system. Container choice follows 09 section 10.3. Permission names follow conventions section 7 and the GRP Shared definitions. Decisions D1 to D7 and the R-rows in `05-decisions.md` apply over any story text.

Line formats used below:

- Surface lines: `SCR-GRP-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-GRP-nn [state]: trigger; sees; can do; key`.
- Screens of other epics are cited as `SCR-ACC-nn` where the ACC inventory defines them.

---

### GRP-01 Start a group for the people I save with

- Story: GRP-01 Start a group for the people I save with
- Surfaces:
  - SCR-GRP-01 | Create group form (group name, purpose, first wallet name, wallet type: budget, savings, investment, business; Ariary fixed; SMS-name preview line) | page | Individual with Tier 1 (no permission) | "Create a group" on home or on the empty groups list | "Create group" lands on SCR-GRP-06 (group home); back discards or keeps the local draft
  - SCR-GRP-02 | Group created confirmation `msg.grp.group_created.inapp` | notification (in-app) | Group founder | group created | none
  - SCR-GRP-03 | Setup checklist ("Invite members", "Add a second person who can approve spending", "Set the contribution plan") | inline | Group founder (group home of a new group) | new group home | each item deep-links to its screen (SCR-GRP-14 invite, SCR-GRP-27 approver grant, plan setup in CON)
  - SCR-GRP-04 | Create group request guard (idempotency key) | system | none | submit | none
- States per surface:
  - SCR-GRP-01 [default]: sees visible labels, 48 dp targets, character counters announced to screen readers, prefilled wallet name from `grp.wallet.default_name`, four wallet types, primary button "Create group"; helper text in three languages
  - SCR-GRP-01 [draft]: form edited; kept as a local draft (XCT-05 Table B), never sent without a tap; labelled with the `Draft, not sent` key
  - SCR-GRP-01 [validation]: field error; inline per field, names the fix, never says "invalid"
  - SCR-GRP-01 [duplicate name]: person already has a group with the same name; soft warning, not a block
  - SCR-GRP-01 [limit reached]: `grp.max_groups_per_user` reached; shows the limit and the next action
  - SCR-GRP-01 [submitting]: button disabled with a progress label
  - SCR-GRP-01 [offline]: Create disabled; shows `xct.offline.needs_connection`
  - SCR-GRP-01 [server failure]: sees "We could not create the group. Nothing was created." with Try again; input kept
  - SCR-GRP-01 [success]: group and wallet created; lands on group home
  - SCR-GRP-02 [shown]: in-app confirmation for the founder only; no notification to others
  - SCR-GRP-03 [default]: new group; checklist replaces empty tiles
  - SCR-GRP-04 [retry]: a retry carries the same idempotency key; never creates two groups
- Criteria map:
  - AC 1: SCR-GRP-01 [default], [success] (fields, wallet types, button, landing on GRP-06)
  - AC 2: SCR-GRP-01 [duplicate name], [limit reached]; system rule (only member holds every permission, wallet balance 0 Ar)
  - AC 3: SCR-GRP-03 [default]; system rule (wallet accepts deposits subject to ACC-07 table and OPS-11 group-wallet limits, cannot pay out until the floor is satisfied)
  - AC 4: SCR-GRP-01 [submitting], [offline], [draft]; SCR-GRP-04 [retry]
  - AC 5: SCR-GRP-01 [validation], [server failure]
  - AC 6: SCR-GRP-02 [shown]
  - AC 7: no UI, system rule (audit `group.created`; one entry per permission written with actor "system at creation"; ledger account with no entry)
  - AC 8: SCR-GRP-01 [default] (labels, 48 dp, counter, three languages, SMS-form line)
- Objects and fields: Group (name up to `grp.name_max_length` 60, purpose up to `grp.purpose_max_length` 280, currency Ariary, status Active); Membership (founder, all permissions); Wallet (name, type, balance 0 Ar); Audit entry (`group.created`).
- Open points:
  1. Criterion 4 says the group form is a local draft (XCT-05 Table B, label key `xct.queue.draft`) and also that the request carries an idempotency key; is the draft listed anywhere so it can be resumed after leaving the form? Not specified in the story.
  2. Which text and key does the soft duplicate-name warning use? Not specified in the story.
  3. What is the limit message text when `grp.max_groups_per_user` is reached and what is "the next action"? Not specified in the story.
  4. Does the SMS-name preview line show the shortened form per NTF-07 live while typing? The story says "a line shows how the name will look"; the shortening rule is owned by NTF-07.
  5. The wallet type list (budget, savings, investment, business) is restated here; WAL-01 owns wallet types. Which owner wins if they differ? Not specified in the story.

---

### GRP-02 Start with every permission, and say so

- Story: GRP-02 Start with every permission, and say so
- Surfaces:
  - SCR-GRP-05 | Founder first-run card ("You can do everything in this group right now. Money cannot leave the wallet until a second person can approve it, or until the group votes.", buttons "Add an approver" and "Invite members") | inline | Group founder (all permissions) | first opening of the new group home | "Add an approver" opens SCR-GRP-27; "Invite members" opens SCR-GRP-14; dismiss
  - Reuses SCR-GRP-06 (group home, defined under GRP-06; the founder card sits at the top of it)
  - SCR-GRP-07 | Creation permission write | system | none | group creation | none
- States per surface:
  - SCR-GRP-05 [default]: sees the card; can dismiss; stays reachable from the checklist
  - SCR-GRP-05 [loading]: skeleton for the card
  - SCR-GRP-05 [offline]: card text cached, readable offline
  - SCR-GRP-05 [replaced]: other holders exist; card replaced by the normal home content
  - SCR-GRP-05 [dismissed]: hidden; reopened from the checklist
  - SCR-GRP-07 [success]: every permission of Group, Wallet, Contribution plan, Project, Vote, Event, Document and Publication granted to the founder at group level
  - SCR-GRP-07 [failure]: permission write fails; whole creation fails with the GRP-01 error; no group exists
- Criteria map:
  - AC 1: SCR-GRP-07 [success] (every catalogue permission at group level, inherited to wallets, projects, documents)
  - AC 2: SCR-GRP-05 [default], [dismissed]
  - AC 3: no UI, system rule (group records "created by Sara on 12 Oct" as a historical fact; creator has no power beyond held permissions)
  - AC 4: no UI, system rule (founder may revoke own permissions subject to GRP-13 and GRP-14)
  - AC 5: no UI beyond SCR-GRP-26 and SCR-GRP-37 (founder's permissions visible to every member holding Group: view group)
  - AC 6: SCR-GRP-05 [loading], [offline], [replaced]
  - AC 7: SCR-GRP-07 [failure]
  - AC 8: no UI, system rule (one audit entry per permission with actor "system at creation", no ledger entry)
- Objects and fields: Membership (permissions held, source "system at creation"); Audit entry (actor, target founder, timestamp); Group (created by, date).
- Open points:
  1. Where is "created by Sara on 12 Oct" shown (group page, member page, audit log)? Criterion 3 records it but names no screen.
  2. Criterion 2 says the card "stays reachable from the checklist", but the checklist (GRP-01 criterion 3) has three named items and none is the card. How is the card reopened?
  3. When does the card turn into "normal home content" if the founder dismisses it, then another holder appears? Not specified in the story.
  4. The card text promises a vote path ("or until the group votes") yet a one-member group cannot vote (VOT floor). Is the text different for groups under three members? Not specified in the story.

---

### GRP-03 Invite people by link or by phone number

- Story: GRP-03 Invite people by link or by phone number
- Surfaces:
  - SCR-GRP-14 | Invite screen (Share link; phone number field with phone book picker, SMS language selector, send) | page | Permission holder with Group: invite member | "Invite" on the member list or the setup checklist | share sheet; send; back
  - SCR-GRP-15 | Phone's share sheet with `msg.grp.invite_share.text` | system | holder of Group: invite member | "Share link" | OS share
  - SCR-GRP-16 | Invites list (status per invite: Sent, Opened, Joined, Declined, Expired, Revoked, Used up, with date; revoke action) | page | holder of Group: invite member | member list "Invited" | revoke an invite
  - SCR-GRP-17 | Invite SMS `msg.grp.invite_received.sms` | notification (SMS) | invitee | phone invite sent | opens invite preview (SCR-GRP-19)
  - SCR-GRP-18 | Number-bound invite mismatch ("This invite was sent to another number", Request access button) | page | person opening the link from another number | phone invite opened on another number | Request access notifies the inviter, who decides
- States per surface:
  - SCR-GRP-14 [default]: both paths shown; link creation; Member bundle only
  - SCR-GRP-14 [bundle choice]: holder also holds Group: grant permission; may choose a bundle at invitation
  - SCR-GRP-14 [wrong number format]: rejected with the expected format in plain words
  - SCR-GRP-14 [duplicate]: number already in the group or already invited; refused with a plain message and link to that member
  - SCR-GRP-14 [resend cooldown]: second send to the same number within `grp.invite_resend_cooldown` (24 hours); blocked
  - SCR-GRP-14 [SMS paused]: group SMS allowance exhausted; shows "SMS invites are paused for this group. Share the link instead."; link path stays available
  - SCR-GRP-14 [offline]: sharing an existing link works from cache; creating a link or sending SMS needs a connection and says so
  - SCR-GRP-14 [contacts]: contacts access optional; contact data never uploaded
  - SCR-GRP-16 [default]: each invite with status and date
  - SCR-GRP-16 [empty]: explains both ways to invite
  - SCR-GRP-16 [revoked]: any holder of Group: invite member revokes; link stops working
  - SCR-GRP-16 [expired or used up]: after `grp.invite_link_ttl` (7 days) or `grp.invite_link_max_uses` (50): status Expired or Used up
  - SCR-GRP-17 [sent]: SMS (GSM-7, 160 characters) with inviter's first name, group name and link; paid from group allowance
  - SCR-GRP-18 [default]: number mismatch; Request access; the inviter is notified and decides
- Criteria map:
  - AC 1: SCR-GRP-14 [default]; SCR-GRP-15 (invite share link, Member bundle only)
  - AC 2: SCR-GRP-14 [default], [contacts]; SCR-GRP-17 [sent]
  - AC 3: SCR-GRP-16 [expired or used up], [revoked]; SCR-GRP-18 [default] (phone invite single-use, bound to number, same life)
  - AC 4: SCR-GRP-14 [bundle choice], [duplicate], [resend cooldown]
  - AC 5: SCR-GRP-16 [default], [empty]; SCR-GRP-14 [offline]
  - AC 6: SCR-GRP-14 [wrong number format], [SMS paused]
  - AC 7: SCR-GRP-17 [sent]; push to inviter on accept or decline is `msg.grp.invite_accepted.push` and `msg.grp.invite_declined.push` (SCR-GRP-21, GRP-04); invite also appears in the invitee's notification centre if the app is installed
  - AC 8: no UI, system rule (audit `membership.invited` with channel, masked number, bundle, time; `invite.revoked`; `invite.expired`; full number in the invite record only)
  - AC 9: SCR-GRP-14 [default] (numeric keypad, paste with spaces; share message and SMS in three languages, no amounts)
- Objects and fields: Invite (token, channel link or phone, number, language, bundle, status, created, expiry, uses); Group; Notification; Audit entry.
- Open points:
  1. Criterion 3 says a phone invite makes the invited person "eligible to vote as a guest before joining". R42 and the VOT rules say non-members are never eligible to vote and ACC-16 criterion 4 ties vote links to an eligible list. Which is the rule?
  2. When a bundle is chosen at invitation and it contains a money-out permission, is the inviter's PIN needed (GRP-08 criterion 3)? Not specified in the story.
  3. What is the key and wording of the notice the inviter receives for "Request access" and where does the inviter decide? Not specified in the story.
  4. Who may see the invites list (Group: invite member only, or also Group: view group)? Not specified in the story.
  5. `grp.invite_sms_per_day` (R185) is not in this story; does a per-day invitation SMS limit show in SCR-GRP-14? Not specified in the story.
  6. Is the SMS language selector's default "the group's language" defined for a group with several languages? Not specified in the story.

---

### GRP-04 See the rules before I join, then join or decline

- Story: GRP-04 See the rules before I join, then join or decline
- Surfaces:
  - SCR-GRP-19 | Invite preview (group name, purpose, inviter name, member count, contribution amount and rhythm if a plan exists, spending rule sentence, count of approvers, "no single person can move group money"; "What you will be able to do" and "What you will not be able to do" lists; buttons "Join this group" and "No thanks") | page | Visitor with a valid invite (guest view, no bottom bar) | invite link or invite SMS (SCR-ACC-81 is the generic link page) | Join opens phone and OTP (ACC) then SCR-GRP-06; "No thanks" opens SCR-GRP-20
  - SCR-GRP-20 | Decline sheet (optional preset reasons: "I do not know this group", "Not now", "Wrong number") | sheet | Visitor | "No thanks" | closes the invite
  - SCR-GRP-21 | Inviter notices `msg.grp.invite_accepted.push`, `msg.grp.invite_declined.push`, in-app item for holders of Group: invite member | notification | holders of Group: invite member | accept or decline | none
  - SCR-GRP-22 | Join pending ("Waiting to send", "Your answer will be sent when you are connected. Nothing is joined yet.") | inline | Visitor accepting while offline | Accept with connection lost | none
  - SCR-GRP-23 | Invite problem page (expired, revoked, used-up with reason and "Ask <inviter name> for a new link") | page | Visitor | invalid link state | contact the inviter
  - SCR-GRP-24 | Join server revalidation | system | none | Accept received | none
- States per surface:
  - SCR-GRP-19 [default]: sees the lists generated from the bundle the invite carries; no ledger, balances or member names other than the inviter
  - SCR-GRP-19 [loading]: skeleton with the group name first
  - SCR-GRP-19 [offline]: preview not in the XCT-04 cache list; needs a connection and says so
  - SCR-GRP-19 [already a member]: person already in the group; taken to group home
  - SCR-GRP-19 [accept failed]: sees "We could not add you yet. Nothing has changed. [Try again]"; stays on the preview
  - SCR-GRP-19 [number mismatch]: number-bound invite opened from another number; shows the GRP-03 message (SCR-GRP-18)
  - SCR-GRP-19 [large text]: readable at 200% font scale and under 320 px without clipping; visible language switch; opens in the invite SMS language
  - SCR-GRP-20 [default]: optional preset reason; shared link stays valid for others; phone invite becomes Declined
  - SCR-GRP-22 [waiting]: Accept queued under class `membership-self` (XCT-05 label keys); visible pending item
  - SCR-GRP-23 [expired, revoked, used up]: reason shown and "Ask <inviter name> for a new link"
  - SCR-GRP-24 [rejected at receipt]: invite, expiry or default bundle changed or expired; Accept rejected with a reason; screen says nothing changed
  - SCR-GRP-24 [joined]: membership with the bundle's permissions created; no money moved; no identity verification required
  - SCR-GRP-21 [push], [in-app]: inviter notified of accept or decline; no SMS
- Criteria map:
  - AC 1: SCR-GRP-19 [default]
  - AC 2: SCR-GRP-19 [default] (lists generated from the invite's bundle)
  - AC 3: SCR-GRP-24 [joined]; SCR-GRP-19 [default] (sign in or sign up with phone and OTP, "Join this group", group home)
  - AC 4: SCR-GRP-20 [default]
  - AC 5: SCR-GRP-23 [expired, revoked, used up]; SCR-GRP-19 [already a member]; no access before Accept (system rule)
  - AC 6: SCR-GRP-19 [loading], [offline]; SCR-GRP-22 [waiting]
  - AC 7: SCR-GRP-24 [rejected at receipt]; SCR-GRP-19 [accept failed], [number mismatch]; a joiner after a vote opened is not in that electorate (system rule, VOT-02)
  - AC 8: SCR-GRP-21 [push], [in-app]
  - AC 9: no UI, system rule (audit `membership.joined` with invite id and bundle; `invite.declined` with preset reason code)
  - AC 10: SCR-GRP-19 [large text]
- Objects and fields: Invite (status, bundle, number, expiry); Membership (permissions from bundle); Group (name, purpose, rules text, plan summary, spending rule, approver count); Audit entry (`membership.joined`, `invite.declined` reason code).
- Open points:
  1. The preview shows "the count (not the names) of people who can approve", while GRP-12 criterion 3 hides approver counts for groups under five members. Does the invite preview follow that hiding? Not specified in the story.
  2. Joining "needs only phone and OTP" but ACC-02 criterion 3 creates a Pending PIN account where nothing else is reachable until a PIN is set. Does the invitee set a PIN before landing on group home?
  3. How does the preview word the spending rule for a group with no band set ("default floor in words", GRP-12 criterion 8)? Not specified in the story.
  4. Which key texts do the Decline reasons use? Only the English wording is given.
  5. A guest invited by phone invite: does this preview replace the SCR-ACC-81 generic link page, or does it render inside it? ACC-16 criterion 1 shows only name, inviter and member count; GRP-04 shows more. Which wins?
  6. For `msg.grp.invite_accepted.push`, is the joiner's name shown (R4 forbids showing approver names to invitees, not the reverse)? Not specified in the story.

---

### GRP-05 See who is in the group

- Story: GRP-05 See who is in the group
- Surfaces:
  - SCR-GRP-25 | Members list (header count, display name, join date, badges "Can approve spending" and "Can change who has access", sort, search, collapsed "Former members") | page | Member with Group: view group | "Members" in the group | tap a row opens SCR-GRP-26
  - SCR-GRP-26 | Member page (display name, masked number, badges, status, Effective access link, "Remove" and "Change access" actions) | page | Member with Group: view group; actions only for holders of the matching permission | row in SCR-GRP-25 | opens SCR-GRP-27 (change access), SCR-GRP-46 (remove), SCR-GRP-37 (effective access)
  - Reuses SCR-GRP-27 (change access, defined under GRP-08; entry from the member page "Change access")
  - SCR-GRP-28 | New member feed item `msg.grp.member_joined.inapp` (batched, NTF-08) | notification (in-app) | members | a member joins | none
  - SCR-GRP-29 | Missing-permission explanation (which permission is missing, who can grant it) | inline | Member who lost Group: view group | open Members without the permission | link to holders of Group: grant permission
- States per surface:
  - SCR-GRP-25 [default]: Active and Invited members; header count; badges with icon and words; phone masked to last digits except for holders of Group: invite member or remove member
  - SCR-GRP-25 [former members]: collapsed section with Left and Removed; stay listed so past ledger lines and votes show a name
  - SCR-GRP-25 [search offline]: search by name works on the cached list; sort by name or join date
  - SCR-GRP-25 [group of one]: "You are the only member. Invite people." with an invite button (needs Group: invite member; otherwise "Ask <name> who can invite")
  - SCR-GRP-25 [loading]: skeleton rows
  - SCR-GRP-25 [offline]: cached list with "Last synced" in the header
  - SCR-GRP-25 [refresh failed]: cached list stays with "Could not update. [Try again]"
  - SCR-GRP-26 [default]: Effective access link for those allowed; Remove or Change access only for holders of the matching permission
  - SCR-GRP-28 [in-app]: batched in-app feed item; no push or SMS by default
  - SCR-GRP-29 [default]: names the missing permission and who can grant it
- Criteria map:
  - AC 1: SCR-GRP-25 [default]
  - AC 2: SCR-GRP-25 [default], [former members]
  - AC 3: SCR-GRP-25 [search offline]
  - AC 4: SCR-GRP-25 [default] (masking rules; approvers visible to every member with Group: view group)
  - AC 5: SCR-GRP-26 [default]
  - AC 6: SCR-GRP-25 [group of one], [loading], [offline]
  - AC 7: SCR-GRP-25 [refresh failed]; SCR-GRP-29 [default]
  - AC 8: SCR-GRP-28 [in-app]
  - AC 9: SCR-GRP-25 [default] (one focusable row announcing name, status and badges; 48 dp; text badges)
- Objects and fields: Membership (status Active, Invited, Left, Removed; join date; permissions); User (display name, masked or full phone); Invite.
- Open points:
  1. Which permission does the badge "Can change who has access" stand for (Group: grant permission, revoke permission, or both)? Not specified in the story.
  2. Does the list show the neutral "unavailable" marker next to unreachable holders (GRP-14 criterion 10)? The story does not place it on this list.
  3. Does the list show the "Invited" members' names or numbers, and to whom? Not specified in the story.
  4. Why does the story depend on GRP-09 for the Effective access link when GRP-09 is P1 and this story P0? Not an ambiguity for the screen, but the link must be hidden if GRP-09 is not built; not specified.

---

### GRP-06 Open the group and see where things stand

- Story: GRP-06 Open the group and see where things stand
- Surfaces:
  - SCR-GRP-06 | Group home | page | Member with Group: view group | group list, notification deep link | opens the tiles' targets
  - SCR-GRP-30 | Balance tile (balance with "12 500 Ar" format and status word, last known value and time) | inline | Member with Wallet: view balance | SCR-GRP-06 | opens wallet detail (WAL)
  - SCR-GRP-31 | "Waiting for you" tile (pending approvals from SPD, open votes from VOT, VOT result chips) | inline | Member | SCR-GRP-06 | deep link to each item
  - SCR-GRP-32 | Contribution board summary sentence ("12 of 15 have paid this month") | inline | Member | SCR-GRP-06 | opens CON board
  - SCR-GRP-33 | Next event tile (EVT-08) | inline | Member | SCR-GRP-06 | opens the event
  - SCR-GRP-34 | Last three ledger lines | inline | Member | SCR-GRP-06 | opens the ledger
  - SCR-GRP-35 | Approver shortage banner ("Needs a second approver") | inline | all members; fix link for holders of Group: grant permission | SCR-GRP-06 | link to SCR-GRP-27 or names to ask
  - SCR-GRP-36 | Reconciliation line ("ledger equals provider balance as of hh:mm", optional, from OPS) | inline | Member with Wallet: view balance | SCR-GRP-06 | none
  - SCR-GRP-47 | Missing-permission tile note ("You cannot see the balance. Ask Mamy or Sara.") | inline | Member lacking a tile permission | SCR-GRP-06 | none
- States per surface:
  - SCR-GRP-06 [default]: tiles in order balance, waiting for you, contribution board summary, next event, last three ledger lines
  - SCR-GRP-06 [new group]: setup checklist (SCR-GRP-03) replaces the empty tiles
  - SCR-GRP-06 [loading]: skeleton tiles, balance first
  - SCR-GRP-06 [offline]: renders from cache; one header line "Updated 14:05" (no word "offline"); at most `CACHE_RECENT_TRANSACTIONS` lines within `CACHE_LEDGER_DAYS`
  - SCR-GRP-06 [partial failure]: a failing tile shows its own small error and Retry while the others render
  - SCR-GRP-30 [default]: balance and status word from the ledger
  - SCR-GRP-30 [pending]: a ledger line Pending or Needs attention; tile shows that status word and what happens next
  - SCR-GRP-30 [stale]: balance older than `STALE_BALANCE_HOURS`; "may be outdated" badge
  - SCR-GRP-30 [error]: "We could not load the balance. No money has moved. [Try again]" with last known value and time
  - SCR-GRP-30 [permission missing]: replaced by SCR-GRP-47
  - SCR-GRP-31 [result chip]: a vote closed since last look; one of four VOT chips (Passed, Not passed (majority not reached), Not passed (quorum not met), Tie), never a GRP wording
  - SCR-GRP-35 [shown]: fewer than two reachable holders of Wallet: approve spend and a group wallet holds money; banner "money cannot leave until a second person can approve"; `msg.grp.approver_shortage`
  - SCR-GRP-36 [shown]: shown when OPS data is available
  - SCR-GRP-47 [default]: short note naming the permission and who can grant it
- Criteria map:
  - AC 1: SCR-GRP-06 [default]; SCR-GRP-30, SCR-GRP-31 [result chip], SCR-GRP-32, SCR-GRP-33, SCR-GRP-34 [default]
  - AC 2: SCR-GRP-47 [default]; SCR-GRP-30 [permission missing]
  - AC 3: SCR-GRP-35 [shown]
  - AC 4: SCR-GRP-06 [new group], [loading], [partial failure]
  - AC 5: SCR-GRP-06 [offline]; SCR-GRP-30 [stale]
  - AC 6: SCR-GRP-30 [pending]
  - AC 7: SCR-GRP-30 [error]
  - AC 8: no UI, system rule (no notification from this page; counters mirror notification centre badges, NTF-01)
  - AC 9: SCR-GRP-06 [default] (real text sentences, amounts unclipped at 200%, three languages)
- Objects and fields: Group; Wallet (balance, status); Ledger entry (last three); Approval; Vote (result chip); Contribution (paid count); Event (next); reconciliation line (OPS).
- Open points:
  1. A group can have up to `grp.max_wallets_per_group` wallets (GRP-15); is "the group balance" a total of all wallets or one tile per wallet? Not specified in the story.
  2. Criterion 2 says each tile needs "its permission" but names only Wallet: view balance. Which permission gates the board summary (Contribution plan: view), the event tile (Event: view), the ledger lines (Wallet: view history) and "Waiting for you"? Not specified in the story.
  3. What is "a status word" on the balance tile when nothing is pending? Not specified in the story.
  4. GRP-14 criterion 10 puts a neutral "unavailable" marker next to unreachable holders; does the shortage banner name or count holders for non-holders of Group: grant permission ("the names to ask")? The banner could expose who is reachable.
  5. The offline header "Updated 14:05" contradicts the offline wording of other stories only if they use the word offline; XCT-04 owns it. Not a story ambiguity, no action.

---

### GRP-07 See what each kind of member can do, in plain words

- Story: GRP-07 See what each kind of member can do, in plain words
- Surfaces:
  - SCR-GRP-38 | Access screen (bundle list Member and Treasurer, one-sentence descriptions, "What this lets you do" verb list, "Not included" list for Treasurer) | page | Permission holder with Group: grant permission and Group: view group | "Access" in the group, or choosing a bundle while granting | "Apply" opens SCR-GRP-39
  - SCR-GRP-39 | Bundle apply checklist (every permission as a checklist, untickable; money-out notice) | page | holder of Group: grant permission | SCR-GRP-38 or SCR-GRP-27 | apply asks PIN for money-out class (SCR-GRP-40)
- States per surface:
  - SCR-GRP-38 [default]: sees Member and Treasurer with plain verb lists; Treasurer "Not included" list (cannot change who has access, remove people, change spending rules, add or close wallets, edit the group, delete the group)
  - SCR-GRP-38 [loading]: skeleton
  - SCR-GRP-38 [offline]: bundle definitions static, readable from cache
  - SCR-GRP-38 [group of one]: shows bundles and "Invite someone first"
  - SCR-GRP-39 [default]: every permission ticked from the bundle defaults; items editable before apply; result later shown as "Treasurer, changed: no Wallet: export history"
  - SCR-GRP-39 [money-out notice]: bundle includes money-out permissions; sees "This lets <name> move group money. Spending still needs a second person."; PIN required on apply
  - SCR-GRP-39 [permission not held]: item the grantor does not hold; disabled with "You do not hold this permission"
  - SCR-GRP-39 [offline]: applying disabled with `xct.offline.needs_connection`
- Criteria map:
  - AC 1: SCR-GRP-38 [default]
  - AC 2: SCR-GRP-38 [default] (Treasurer "Not included")
  - AC 3: SCR-GRP-39 [default] (checklist, individual permissions only, "Treasurer, changed" on member page)
  - AC 4: no UI beyond SCR-GRP-26 and SCR-GRP-37, system rule (a person matches a bundle when permissions are exactly its permissions; computed at read time, never stored)
  - AC 5: SCR-GRP-39 [money-out notice]
  - AC 6: SCR-GRP-38 [loading], [offline], [group of one]; SCR-GRP-39 [offline]
  - AC 7: SCR-GRP-39 [permission not held]
  - AC 8: no UI, system rule (viewing sends nothing; granting notifies via GRP-08)
  - AC 9: SCR-GRP-38 [default] (three languages, native Malagasy review, one term per concept)
- Objects and fields: Bundle definition (Member, Treasurer: static permission lists); Membership (permissions held, bundle match at read time).
- Open points:
  1. The story cites "XCT-05 Table C" for online-only permission changes; XCT-05 defines Table C only as an informational index of never-queued actions, not a second source of truth (D6), and its row "Permission, role and membership changes by others" cites GRP-07 only. Is the citation meant as the default-deny rule? Not specified.
  2. The Member bundle row lists Wallet: deposit, but conventions section 7 names list `Wallet: deposit` while WAL may not use it as a gate. Which story consumes it? Not specified in the story.
  3. The Treasurer bundle write includes Group: view audit log; the apply screen's money-out notice for Treasurer is triggered by money-out permissions. Is the notice shown when only freeze or edit rules are included? Edit rules is in the class, so yes; stated here only for completeness.
  4. Where are the bundle permissions "Event: view, Project: view, Document: view" shown given that Document is unused in the MVP (conventions section 7)? Not specified in the story.

---

### GRP-08 Give or take away a single permission

- Story: GRP-08 Give or take away a single permission
- Surfaces:
  - SCR-GRP-27 | Change access (checklist grouped by object: Group, Wallet, Contribution plan, Vote, Event, Project, Document, Publication; plain verb labels; diff sentence) | page | Permission holder with Group: grant permission (to give) or Group: revoke permission (to take away) | member page, SCR-GRP-26 "Change access", SCR-GRP-05 first-run card | save; PIN sheet
  - SCR-GRP-40 | PIN confirmation for a money-out change (sentence "This lets <name> move group money. Spending still needs a second person.") | sheet | grantor | save of a change touching Wallet: initiate spend, approve spend, edit rules, close or Group: set spending policy | confirm or cancel
  - SCR-GRP-41 | Permission change notices `msg.grp.permission_granted.push`, `msg.grp.permission_revoked.push`, in-app item; SMS fallback for money-out changes | notification | affected person; holders of Group: view audit log (in-app only) | change saved | opens SCR-GRP-37
  - SCR-GRP-42 | Event: create hint ("This person will also need Event: invite for events to reach members.") | inline | grantor | granting Event: create without Event: invite | none
  - SCR-GRP-43 | "Cannot approve yet" marker and holder-only explanation ("verify your identity to reach the tier") | inline | group sees marker; only the holder sees the reason | Wallet: approve spend granted below the required tier | link to ACC-07 ladder
- States per surface:
  - SCR-GRP-27 [default]: tick or untick; diff reads "Adding this lets Rado approve spending. This is new." or "Taking this away means Rado can no longer approve spending."; Project: edit labelled "Create and edit projects"
  - SCR-GRP-27 [not held]: grantor lacks the permission; item disabled
  - SCR-GRP-27 [self grant blocked]: grantor tries to give themselves a permission, for example Wallet: approve spend; not allowed
  - SCR-GRP-27 [revoke blocked]: revoking a continuity-critical permission would leave too few holders; screen says why and offers the fix (GRP-14 modal SCR-GRP-61)
  - SCR-GRP-27 [saving]: progress state
  - SCR-GRP-27 [offline]: saving disabled with `xct.offline.needs_connection`
  - SCR-GRP-27 [success]: permissions effective at once; member page refreshes
  - SCR-GRP-27 [failure]: sees "No permission was changed" with Try again
  - SCR-GRP-27 [stale]: someone else changed the same person's access; shows both versions and asks to review; no overwrite
  - SCR-GRP-40 [default]: PIN entry with the money-out sentence
  - SCR-GRP-41 [push]: `msg.grp.permission_granted.push` or `msg.grp.permission_revoked.push`
  - SCR-GRP-41 [sms fallback]: money-out change and push not opened; SMS per NTF-05
  - SCR-GRP-41 [audit in-app]: in-app feed item for holders of Group: view audit log, no push
  - SCR-GRP-42 [shown once]: shown once when granting Event: create without Event: invite
  - SCR-GRP-43 [inactive]: granted Wallet: approve spend below the money-out tier for the amount; group sees "cannot approve yet"; the holder sees the tier prompt; KYC status never shown to others
- Criteria map:
  - AC 1: SCR-GRP-27 [default]
  - AC 2: SCR-GRP-27 [self grant blocked], [not held]
  - AC 3: SCR-GRP-40 [default]; SCR-GRP-27 [default] (other changes, including Wallet: create and Wallet: freeze, confirm in one tap without a PIN)
  - AC 4: no UI, system rule (revoking Wallet: approve spend voids that person's pending approvals and re-notifies approvers; ballots untouched; revoking Wallet: initiate spend cancels pending requests with a visible reason)
  - AC 5: SCR-GRP-27 [revoke blocked]
  - AC 6: SCR-GRP-27 [saving], [offline], [success]
  - AC 7: SCR-GRP-27 [failure], [stale]
  - AC 8: SCR-GRP-41 [push], [sms fallback], [audit in-app]
  - AC 9: no UI, system rule (audit `permission.granted`, `permission.revoked`, `permission.project_narrowed` with previous and new effective access; no ledger entry; immutable)
  - AC 10: SCR-GRP-42 [shown once]; SCR-GRP-43 [inactive]; project narrowing needs both Group: grant permission and Group: revoke permission, no PIN, no vote, never a lock-out path (system rule)
- Objects and fields: Membership (permissions, source, grantor); Audit entry (grantor, target, permission, object, time, previous and new effective access); Approval (voided).
- Open points:
  1. The PIN sentence "This lets <name> move group money" is written for granting; what is the sentence when revoking a money-out permission? Not specified in the story.
  2. Granting is allowed "only permissions they hold themselves", but the founder holds all; may a Treasurer-bundle holder who has Group: grant permission grant Wallet: create or close they do not hold? Stated as not allowed; the story does not say what the checklist shows.
  3. The stale-data screen "shows both versions and asks to review"; the exact review controls are not specified in the story.
  4. How does the screen decide and show "below the money-out tier required for the amount" when no amount exists at grant time? The story does not name the tier basis at grant time.
  5. Is the SMS fallback for a money-out change also sent to the person whose permission is revoked? The story says the "affected person" gets push and SMS fallback "for money-out changes"; revocation is included by wording but not explicit.

---

### GRP-09 See what a person can and cannot do right now

- Story: GRP-09 See what a person can and cannot do right now
- Surfaces:
  - SCR-GRP-37 | Effective access panel ("Can" and "Cannot" lists in verbs per object with source lines; thresholds in words; narrowed-project layer) | page | Any member (own panel, no permission); Group: view group for another member's panel | "What I can do here", member page, link from any blocked action | links to who can grant
  - SCR-GRP-44 | Blocked-action link ("Why can I not do this?") | inline | any member who hits a blocked action | any blocked action in the product | opens SCR-GRP-37
- States per surface:
  - SCR-GRP-37 [default]: "Can" lines with source ("From bundle Treasurer, changed", "Given by Sara on 12 Oct", "Inherited from the group"); "Cannot" lines naming the permission and who holds Group: grant permission ("You need 'Approve spending'. Ask Mamy or Sara.")
  - SCR-GRP-37 [narrowed]: project exclusion layer "Narrowed for project <name> by <name> on <date>"
  - SCR-GRP-37 [limited by rule]: line states the limit in words ("Approve spending. Requests above X Ar need 3 approvals"); thresholds shown, not edited
  - SCR-GRP-37 [loading]: skeleton
  - SCR-GRP-37 [offline]: cached panel with last synced time and a note that access may have changed
  - SCR-GRP-37 [empty]: person with no permissions; shows "This person can only be seen by the group" and the reason
  - SCR-GRP-37 [service error]: shows "We could not check this now. [Try again]"; never shows a guess
  - SCR-GRP-37 [forbidden for others]: viewing another member's panel without Group: view group; not offered
  - SCR-GRP-44 [default]: replaces any bare "Not allowed"
- Criteria map:
  - AC 1: SCR-GRP-37 [default], [narrowed]
  - AC 2: SCR-GRP-37 [limited by rule]
  - AC 3: SCR-GRP-37 [default], [forbidden for others]
  - AC 4: SCR-GRP-44 [default]
  - AC 5: SCR-GRP-37 [loading], [offline], [empty]
  - AC 6: SCR-GRP-37 [service error]
  - AC 7: no UI, system rule (no notifications)
  - AC 8: no UI, system rule (viewing is not audited; data comes from the same check that enforces access)
  - AC 9: SCR-GRP-37 [default] (headings, list markup, words and icons, verb keys shared with GRP-07)
- Objects and fields: Membership; Permission check results (can, cannot, source, layer); Threshold settings (read-only).
- Open points:
  1. The empty text "This person can only be seen by the group" with "the reason" is unclear for a person who has no permissions; what reason is shown? Not specified in the story.
  2. Does the panel show the thresholds to a member who lacks Wallet: view balance (amounts reveal balance scale, R100)? Not specified in the story.
  3. May a former member see their own panel? GRP-10 gives former members read-only access to entries about themselves; the panel is not mentioned.
  4. The story is P1 while GRP-05, GRP-07 and GRP-08 link to it; the link behaviour when the panel is not built is not specified.

---

### GRP-10 See who changed access, and when

- Story: GRP-10 See who changed access, and when
- Surfaces:
  - SCR-GRP-45 | Access history timeline (sentence per change with actor, target, permission, date, time, reference id; filters by person and by permission class) | page | Member (own entries, no permission); holder of Group: view audit log (whole group); former member (own entries, read-only) | "Access history" in the group or on a member page | links to the entry's member page
- States per surface:
  - SCR-GRP-45 [default]: vertical timeline with sentences like "Sara gave Mamy 'Approve spending' on 12 Oct 14:05"; project narrowing entries in the same timeline; system entries labelled "System"
  - SCR-GRP-45 [own entries]: member without Group: view audit log sees only entries about themselves
  - SCR-GRP-45 [former member]: read-only own entries
  - SCR-GRP-45 [filtered]: filter by person and permission class (money-out, continuity-critical, other)
  - SCR-GRP-45 [empty]: "Nobody has changed access yet"
  - SCR-GRP-45 [loading]: skeleton; paging loads older entries on demand
  - SCR-GRP-45 [offline]: cached entries with "Last synced"
  - SCR-GRP-45 [load failed]: cached entries and "Could not update. [Try again]"
- Criteria map:
  - AC 1: SCR-GRP-45 [default]
  - AC 2: SCR-GRP-45 [own entries], [former member]
  - AC 3: SCR-GRP-45 [filtered]; append-only (system rule)
  - AC 4: SCR-GRP-45 [default] ("System" label)
  - AC 5: SCR-GRP-45 [empty], [loading], [offline]
  - AC 6: SCR-GRP-45 [load failed]
  - AC 7: no UI, system rule (changes already notified the target in GRP-08)
  - AC 8: no UI, system rule (reading not audited; entries are `permission.granted`, `permission.revoked`, `permission.project_narrowed`, `membership.joined`, `membership.left`, `membership.removed`)
  - AC 9: SCR-GRP-45 [default] (real text, absolute date and time, three languages, names as entered)
- Objects and fields: Audit entry (actor, target, permission, date, time, reference id, action type, system flag).
- Open points:
  1. Criterion 5 shows cached entries offline, but GRP-11 criterion 6 says the audit log (the same entries) is not cached offline and R191 says GRP-11 follows XCT-04 offline. Which offline behaviour applies?
  2. Is the member-without-permission view ("entries about themselves") the same screen with filters hidden? Not specified in the story.
  3. Does the timeline show the reference id for system entries? Criterion 1 says each entry shows a reference id; criterion 4 labels system entries; the story does not exclude the id.

---

### GRP-11 Keep a complete audit log of group-level actions

- Story: GRP-11 Keep a complete audit log of group-level actions
- Surfaces:
  - SCR-GRP-48 | Audit log (all group-level entries; search and filter by actor, target, action type, date range; links to ledger line or approval) | page | Holder of Group: view audit log (all entries); any other member (entries about themselves); Gereo operator reads through OPS-09 (operator permission, not a member permission) | "Audit log" in the group | entry links
  - SCR-GRP-49 | Operator-view entry "Gereo support viewed the audit log" (with reason) | inline | members who may read the log | operator read under OPS-09 | none
  - SCR-GRP-50 | Audit write guard ("We could not record this change, so it was not made") | system | none | any group-level action | none
- States per surface:
  - SCR-GRP-48 [default]: entries with actor, target, group id, time, reference id; request events and expense entries read from SPD-16; money movements link to ledger line or approval
  - SCR-GRP-48 [own entries]: member without Group: view audit log sees only entries about themselves; former members keep their own
  - SCR-GRP-48 [search]: search and filter for holders of Group: view audit log
  - SCR-GRP-48 [paging]: long logs page
  - SCR-GRP-48 [empty]: only before creation completes
  - SCR-GRP-48 [offline]: log not cached; page says it needs a connection (`xct.offline.needs_connection`)
  - SCR-GRP-49 [shown]: operator read with recorded reason appears to members as "Gereo support viewed the audit log"
  - SCR-GRP-50 [refused]: an action cannot be logged; action refused; sees "We could not record this change, so it was not made"
- Criteria map:
  - AC 1: SCR-GRP-48 [default] (group created, edited, archived, restored, deleted; member events; permission events; project narrowing; spending policy; notification settings; wallet created, renamed, retyped; safeguard blocks; invite revoked)
  - AC 2: no UI, system rule (append-only; a correction is a new entry referencing the first; the view stores nothing)
  - AC 3: no UI, system rule (identifiers and facts only, no PINs, OTPs, full numbers; phones masked)
  - AC 4: SCR-GRP-48 [search], [own entries]
  - AC 5: SCR-GRP-49 [shown]
  - AC 6: SCR-GRP-48 [empty], [paging], [offline]
  - AC 7: SCR-GRP-50 [refused]
  - AC 8: no UI, system rule (entries produce no messages)
  - AC 9: SCR-GRP-48 [default] (sentence builder as GRP-10; entry type names as message keys in three languages)
- Objects and fields: Audit entry (actor, target, group id, time, reference id, action type, links); SPD-16 request events (read only).
- Open points:
  1. GRP-10 criterion 5 caches access-history entries offline while this story does not cache the log; R191 item 3 says GRP-11 follows XCT-04 offline. Which applies?
  2. Does the group see the operator reason text, or only the sentence "Gereo support viewed the audit log" (criterion 5 says "with the reason")? Not specified in the story.
  3. Which action types does the filter offer? The list in criterion 1 gives events; the filter vocabulary is not specified.
  4. Retention is inherited from SPD-16 through `AUDIT_RETENTION_YEARS`; the story says it states no number, so the screen shows none.

---

### GRP-12 Set the amount above which more people must agree

- Story: GRP-12 Set the amount above which more people must agree
- Surfaces:
  - SCR-GRP-51 | Spending rules page (bands as plain sentences, live sample line, SPD parameters tagged GRP-12, `grp.split_change_requires_vote`, `grp.plan_change_requires_vote`, per-wallet override, counts "approvers" and "voters able to be reached") | page | Permission holder with Group: set spending policy | "Spending rules" on the group or wallet | save; loosening proposal
  - SCR-GRP-52 | Loosening proposal (held change with before and after, approvers progress, authority vote route via proposal reference) | page | proposer; holders of Wallet: approve spend (approvers); members (notified) | save of a loosening change; `msg.grp.threshold_loosen_requested.push` | approve; open vote (VOT-01)
  - SCR-GRP-53 | Cannot-loosen warning ("This group cannot loosen its limits: it needs two other approvers or a vote. You can still tighten them.") | inline | holder of Group: set spending policy | opening SCR-GRP-51 when loosening is impossible | none
  - SCR-GRP-54 | Supply warning and counts ("Only 2 people can approve. Add another approver or lower this number."; anonymous counts; warning when fewer than two people other than the requester can be reached) | inline | holder of Group: set spending policy | SCR-GRP-51 | none
  - SCR-GRP-55 | Threshold notices `msg.grp.threshold_changed.push`, `msg.grp.threshold_loosen_requested.push` (SMS fallback if unread) | notification | holders of Wallet: approve spend; members | change saved or proposed | opens SCR-GRP-51 or SCR-GRP-52
- States per surface:
  - SCR-GRP-51 [default]: bands "Up to X Ar: 1 approval from someone other than the requester. From X Ar: 2 approvals. From Y Ar: the group votes instead of approvals."; amounts in whole ariary; live sample line; SPD parameters `receipt_required_above`, `spend_cap_mode`, `freeze_lift_approvals`, `request_expiry`, `project_spend_requires_decision`
  - SCR-GRP-51 [empty]: no band set; shows the default floor in words and "Add a band"
  - SCR-GRP-51 [tightening]: more approvals or lower amount; applies at once
  - SCR-GRP-51 [loosening]: fewer approvals, higher amount, removing a vote, setting a change-vote setting to Never or lowering it; held as a proposed change (SCR-GRP-52)
  - SCR-GRP-51 [Never not offered]: `grp.split_change_requires_vote` or `grp.plan_change_requires_vote` for a rule that moves money to another wallet; Never not offered
  - SCR-GRP-51 [band exceeds supply]: approvals required exceed reachable holders minus one; saving blocked
  - SCR-GRP-51 [vote band unavailable]: too few eligible voters or the vote link unavailable; choice disabled with the reason
  - SCR-GRP-51 [band order]: bands not ordered or overlapping; saving blocked
  - SCR-GRP-51 [existing requests]: waiting requests keep the rule they were created under; shown as "Rule when requested: 2 approvals" on the request
  - SCR-GRP-51 [per wallet]: a wallet with its own bands (stricter or equal, or looser only through the loosening proposal)
  - SCR-GRP-51 [saving]: saving state
  - SCR-GRP-51 [offline]: saving disabled with an explanation
  - SCR-GRP-51 [stale]: someone else changed values; shows both versions as in GRP-08
  - SCR-GRP-51 [failure]: a failed save changes nothing and says so
  - SCR-GRP-52 [pending]: needs either two distinct approvers other than the proposer (at least as many as the strictest band requires) or an authority vote
  - SCR-GRP-52 [approved]: loosening applied; audit `threshold.loosen_approved`; all members notified
  - SCR-GRP-53 [shown]: the group cannot meet the loosening conditions
  - SCR-GRP-54 [shown]: counts hidden for groups under five members except the warning
  - SCR-GRP-55 [push]: holders of Wallet: approve spend get `msg.grp.threshold_changed.push`; `msg.grp.threshold_loosen_requested.push` with SMS fallback if unread
- Criteria map:
  - AC 1: SCR-GRP-51 [default]
  - AC 2: no UI, system rule (platform floor applies under every band; a band only adds approvals or requires a vote)
  - AC 3: SCR-GRP-51 [band exceeds supply], [vote band unavailable]; SCR-GRP-54 [shown]
  - AC 4: SCR-GRP-51 [band order], [vote band unavailable]
  - AC 5: SCR-GRP-51 [tightening], [loosening], [Never not offered]; SCR-GRP-52 [pending], [approved]; SCR-GRP-53 [shown]
  - AC 6: SCR-GRP-51 [existing requests]
  - AC 7: SCR-GRP-51 [per wallet]
  - AC 8: SCR-GRP-51 [saving], [offline], [empty], [stale], [failure]
  - AC 9: SCR-GRP-55 [push]
  - AC 10: no UI, system rule (audit `threshold.changed`, `threshold.loosen_requested`, `threshold.loosen_approved` with before and after, actor, approvers, time)
- Objects and fields: Wallet rule (spending threshold: `spd.spend_approvals_default`, `spd.spend_multi_threshold`, `spd.spend_approvals_multi`, `spd.spend_vote_threshold`); group settings `grp.split_change_requires_vote`, `grp.plan_change_requires_vote`; Audit entry; Membership counts.
- Open points:
  1. How do the approvers see and approve a loosening proposal (which screen, which PIN, which notification action)? The story names only the notification `msg.grp.threshold_loosen_requested.push`.
  2. The page lists `receipt_required_above` and `project_spend_requires_decision` as SPD parameters tagged GRP-12, but conventions Table B does not list them. Where are they defined and what are their editors and defaults? Not specified in the story.
  3. How is a loosening distinguished from a tightening when one save mixes both? Not specified in the story.
  4. Does a loosening proposal expire, and after how long? Not specified in the story.
  5. The anonymous counts are hidden for groups under five; does the supply warning text "Only 2 people can approve" also show a count in those groups? The text implies a count; EV-GRP-12 allows only the warning.
  6. What does the page show when the vote link to an expense (SPD-09, VOT-03) is unavailable besides disabling the choice with a reason? The reason text is not specified.

---

### GRP-13 No single person can move the group's money alone

- Story: GRP-13 No single person can move the group's money alone
- Surfaces:
  - SCR-GRP-56 | Floor enforcement (server rule on every outflow: requester, band approvals or authority vote; stable error code on bypass) | system | none (applies to every outflow) | any outflow attempt including API calls, rule firings, operator actions | none
  - SCR-GRP-57 | Outflow blocked message ("No money moved" and who could approve; link to add or ask an approver) | inline | person attempting the outflow | blocked outflow | link to SCR-GRP-27
  - SCR-GRP-58 | Review line on a request ("Asked by Sara. Needs 1 more approval.") | inline | requester and approvers (rendered by SPD) | request detail | none
  - SCR-GRP-59 | Approver shortage notices `msg.grp.approver_shortage.push` and `.sms` | notification | holders of Group: grant permission | group drops below two approvers | opens SCR-GRP-35 context
  - SCR-GRP-60 | Rule decision gate (fallback order: authority vote with at least three holders of Vote: vote; PIN approval from one other holder of Wallet: edit rules; single-member save with audit "Single member, no gate") | system | saver of a rule or plan change | rule or plan save (screens in CON and RUL) | none
- States per surface:
  - SCR-GRP-56 [enforced]: outflow completes only through approvals of the band, each from a distinct eligible person other than the requester, or a passed authority vote
  - SCR-GRP-56 [ineligible]: requester, anyone who already approved, anyone under an operator hold, anyone who left or lost the permission, anyone acting through an operator console session; payee is not excluded; guests count toward majority and quorum but never toward the floor
  - SCR-GRP-56 [rejected]: direct API call, rule firing or operator action without authorisation; rejected with a stable error code; no ledger entry
  - SCR-GRP-56 [vote below floor]: evaluated on ballots received at close; queued ballots do not count; ends "Not passed (quorum not met)"; never falls back to approvals
  - SCR-GRP-56 [freeze lift]: needs two distinct approvers or an authority vote; vote path needs at least three holders of Vote: vote
  - SCR-GRP-57 [shown]: outflow blocked; "No money moved"; names who could approve
  - SCR-GRP-35 [banner, defined under GRP-06]: fewer than two reachable, money-out capable holders of Wallet: approve spend (by tier, not by new-device cooling); banner "Money cannot leave this wallet until a second person can approve it"; payout buttons disabled with that reason; deposits and contributions continue; vote path only under SPD-09 conditions
  - SCR-GRP-58 [pending approvals]: count from the band
  - SCR-GRP-59 [push], [sms]: `msg.grp.approver_shortage.push`, `.sms`; banner stays until fixed
  - SCR-GRP-60 [gate]: rule or plan change moving money to another wallet follows the fallback order; first Active rule gated like any other; no other skip
- Criteria map:
  - AC 1: SCR-GRP-56 [enforced]; SCR-GRP-58 [pending approvals]
  - AC 2: SCR-GRP-56 [ineligible]
  - AC 3: SCR-GRP-56 [rejected]
  - AC 4: SCR-GRP-60 [gate]; SCR-GRP-56 [enforced] (outflow definitions; not outflows: deposits, contributions, closing at zero, rounding line)
  - AC 5: SCR-GRP-56 [freeze lift]
  - AC 6: SCR-GRP-56 [vote below floor]
  - AC 7: SCR-GRP-35 [banner]; SCR-GRP-57 [shown]
  - AC 8: SCR-GRP-59 [push], [sms]
  - AC 9: no UI, system rule (ledger entry stores initiator and approvers or vote and voters; `safeguard.blocked` audit; no ledger entry on a block)
  - AC 10: no UI beyond SCR-GRP-19 and SCR-GRP-05 (rule explained in one sentence in three languages)
- Objects and fields: Ledger entry (initiator, approvers or vote and voters, timestamps); Approval; Vote; Audit entry (`safeguard.blocked`: actor, attempted amount, reason).
- Open points:
  1. The error code returned on a bypass attempt is "stable" but not named. Not specified in the story.
  2. Criterion 5 says a group below three holders of Vote: vote has no vote path "and relies on approvals or on recovery through OPS-06"; but operators cannot lift a freeze (criterion 3). What does a two-person group with a freeze do? Not specified in the story.
  3. The shortage banner is driven by "reachable, money-out capable" holders; GRP-14 criterion 4 drives it by "reachable holders" only. Which count drives the banner?
  4. The accepted residual risk of one person with two SIMs has no UI; no mitigation screen is specified.
  5. Criterion 4 mentions an SMS allowance top-up approval; the screens for it belong to NTF-06; not specified here.

---

### GRP-14 Keep the group from locking itself out

- Story: GRP-14 Keep the group from locking itself out
- Surfaces:
  - SCR-GRP-61 | Last-holder block ("You are the last person who can <approve spending>. Give it to another member first." with a button to the grant screen) | modal | person leaving, being removed, or revoking a permission | attempt to leave (GRP-16), remove (GRP-17), revoke (GRP-08) | button opens SCR-GRP-62
  - SCR-GRP-62 | Member picker for the grant screen | sheet | blocked person | button in SCR-GRP-61 | opens SCR-GRP-27 with the chosen member
  - SCR-GRP-63 | Unavailable marker (neutral, no reason, no mention of a lock) | inline | every member | next to a holder who is not reachable | none
  - SCR-GRP-64 | Recovery by vote entry (remaining members start an authority vote proposing new approvers) | inline | remaining members (Vote: create) | shortage state | opens VOT-01
  - SCR-GRP-65 | Continuity guard and shortage tracker (`grp.continuity_permissions`) | system | none | leave, removal, revocation, account becoming inactive | none
  - SCR-GRP-66 | Project: approve purchase continuity warning | inline | holders of Group: grant permission | losing the last holder of Project: approve purchase | none
- States per surface:
  - SCR-GRP-61 [blocked]: action would leave fewer holders than required; shows what is missing, that nothing changed, and who could be granted the permission (members with Group: view group)
  - SCR-GRP-61 [offline]: online only; says so
  - SCR-GRP-62 [default]: member list picker
  - SCR-GRP-63 [shown]: holder not reachable (Locked, Inactive or Deactivated); no screen, message or API field names the status; test: only the marker differs
  - SCR-GRP-64 [available]: reachable holders below minimum; remaining members start an authority vote (guests excluded); needs three eligible voters
  - SCR-GRP-64 [unavailable]: fewer than three eligible voters; no vote path; OPS-06 escalation applies
  - SCR-GRP-65 [minimums]: one holder for Group: grant permission, revoke permission, remove member, set spending policy; two for Wallet: approve spend while a group wallet holds a balance or has money in flight; only money-out capable holders (by tier) count toward the approve-spend minimum
  - SCR-GRP-65 [shortage]: fewer than two reachable holders; Active group shows warning "Needs a second approver" (`msg.grp.approver_shortage`); GRP-13 banners apply; holders of Group: grant permission alerted; new-device cooling never triggers it; a wallet Held by Gereo triggers no continuity alarm and no recovery vote
  - SCR-GRP-65 [no executable path]: policy or permission change would leave a spending policy with no executable path; refused at save (GRP-12)
  - SCR-GRP-66 [warning]: warning only, not a block; requests rely on the SPD-13 stuck-request escape
- Criteria map:
  - AC 1: SCR-GRP-61 [blocked]; SCR-GRP-62 [default]
  - AC 2: SCR-GRP-65 [minimums], [no executable path]; SCR-GRP-66 [warning]
  - AC 3: SCR-GRP-61 [blocked] (leaving, removal, revocation and self-revocation; a member with no critical permission is never blocked)
  - AC 4: SCR-GRP-65 [shortage]; block checks use holders and the warning uses reachable holders
  - AC 5: SCR-GRP-64 [available], [unavailable]
  - AC 6: SCR-GRP-61 [offline]
  - AC 7: SCR-GRP-61 [blocked]
  - AC 8: SCR-GRP-59 [push], [sms] (defined under GRP-13); blocked person sees the message in-app only
  - AC 9: no UI, system rule (audit `safeguard.blocked`, `safeguard.shortage` with the permission and current holders)
  - AC 10: SCR-GRP-63 [shown]
- Objects and fields: Membership (permissions, reachable status); Audit entry; Vote (recovery).
- Open points:
  1. The operational process when no member can act (death, dispute, fewer than three members) is still open with Gereo operations; default is nobody moves the money and OPS-06 documents the case.
  2. How does a remaining member find the recovery-by-vote entry (banner link, group home, vote creation)? Not specified in the story.
  3. Where is the Project: approve purchase warning shown and to whom? Not specified in the story.
  4. Does the block copy name the permission using the plain verb (for example "approve spending") from the bundle keys? The example text suggests yes; the keys are not specified.
  5. Which screen does a blocked person in GRP-16 or GRP-17 return to after the block? Not specified in the story.

---

### GRP-15 Open another wallet inside the group

- Story: GRP-15 Open another wallet inside the group
- Surfaces:
  - SCR-GRP-67 | Add wallet form (name, type: budget, savings, investment, business) | page | Permission holder with Wallet: create | "Add wallet" in the group | success lands on the new wallet; back
  - SCR-GRP-68 | Wallet created in-app item `msg.grp.wallet_created.inapp` (batched, NTF-08) | notification (in-app) | members | wallet created | none
  - SCR-GRP-69 | Wallet inheritance (access and spending rule from the group; own bands later) | system | none | wallet creation | none
- States per surface:
  - SCR-GRP-67 [default]: name and type; no PIN; balance 0 Ar
  - SCR-GRP-67 [limit reached]: `grp.max_wallets_per_group` reached; shows the limit and the next action
  - SCR-GRP-67 [duplicate name]: allowed with a soft warning
  - SCR-GRP-67 [saving]: saving state
  - SCR-GRP-67 [offline]: creating disabled with the usual explanation; the wallet list is cached offline
  - SCR-GRP-67 [failure]: creates nothing and says so
  - SCR-GRP-67 [success]: wallet on group home and ledger views; visible to members with Wallet: view balance
  - SCR-GRP-68 [in-app]: batched in-app item; no push or SMS
  - SCR-GRP-69 [inherited]: inherits group access and the GRP-12 spending rule; GRP-13 applies from day one; can be a destination of a rule or split with income per D3, RUL-06 checks apply
- Criteria map:
  - AC 1: SCR-GRP-67 [default], [success]
  - AC 2: SCR-GRP-69 [inherited]
  - AC 3: SCR-GRP-69 [inherited]
  - AC 4: SCR-GRP-67 [limit reached]
  - AC 5: SCR-GRP-67 [saving], [offline]
  - AC 6: SCR-GRP-67 [failure], [duplicate name]
  - AC 7: SCR-GRP-68 [in-app]
  - AC 8: no UI, system rule (ledger account with no entry; audit `wallet.created`, `wallet.renamed`, `wallet.retyped`)
- Objects and fields: Wallet (name, type, balance 0 Ar, group); Ledger account; Audit entry.
- Open points:
  1. Wallet: create also covers renaming and retyping, but this story shows only a creation form. Which screen renames and retypes (WAL-04)? Not specified in the story.
  2. Does the form warn that retyping or renaming affects rules or reports? Not specified in the story.
  3. The in-app item is batched under NTF-08; the batch text is not specified here.
  4. Does a new wallet default to "no outgoing rule" requirement for campaign use (R175)? Not specified in the story.

---

### GRP-16 Leave a group and know what happens to my money

- Story: GRP-16 Leave a group and know what happens to my money
- Surfaces:
  - SCR-GRP-70 | Leave summary (total contributed, amount due, group's written leaving rule, access lost, what is kept; Pay now or "Ask a treasurer for an exemption"; button "Leave group") | page | Member (no permission) | "Leave this group" on the group page or member page | "Leave group" confirms; back
  - SCR-GRP-71 | Leave blocked explanation (pending money in flight, or GRP-14 would be violated) | inline | Member | SCR-GRP-70 | links to the fix
  - SCR-GRP-72 | Leave notices `msg.grp.leave_confirmed.inapp` (leaver), `msg.grp.member_left.push` (holders of Group: remove member and Wallet: approve spend; SMS fallback if the leaver held a continuity-critical permission) | notification | leaver; holders | leave completed | none
- States per surface:
  - SCR-GRP-70 [default]: sees the facts and the group's rule on leaving (from rules text, GRP-18); contributions already paid stay in the group wallet unless the rule says otherwise
  - SCR-GRP-70 [obligation]: `grp.leave_obligation_policy` applies; default debt record with "Pay now" and exemption offered; summary names which applies
  - SCR-GRP-70 [offline]: leaving disabled with the usual message; summary readable from cache with last synced time
  - SCR-GRP-70 [failure]: failure leaves the person in the group and says so; no money moves
  - SCR-GRP-71 [pending money]: pending contribution or a spend the person requested; blocked with link to the fix
  - SCR-GRP-71 [GRP-14 violated]: person holds a continuity-critical permission as the last holder; blocked via SCR-GRP-61
  - SCR-GRP-72 [in-app], [push], [sms]: confirmations as above
- Criteria map:
  - AC 1: SCR-GRP-70 [default]
  - AC 2: SCR-GRP-70 [default] (paid money stays; refunds are ordinary group spends under GRP-13 and SPD)
  - AC 3: SCR-GRP-70 [obligation]
  - AC 4: SCR-GRP-71 [pending money], [GRP-14 violated]
  - AC 5: no UI, system rule (no further ballots; cast ballot stays counted; denominator fixed; pending approvals voided; name stays as "Former member")
  - AC 6: SCR-GRP-70 [default], [offline]
  - AC 7: SCR-GRP-70 [failure]
  - AC 8: SCR-GRP-72 [in-app], [push], [sms]
  - AC 9: no UI, system rule (no ledger entry; debt is a note on member history; audit `membership.left` with contributed, due, policy applied)
- Objects and fields: Membership (status Left); Contribution (paid total, amount due); Approval (voided); Audit entry (`membership.left`).
- Open points:
  1. Where is the outstanding-debt note shown ("note on the member history") and who sees it? Not specified in the story.
  2. Does the leave summary change when the leaver holds a money-out permission (PIN needed)? Not specified in the story.
  3. When the D4 floor fails only because of the departure, the open vote closes "Not passed (floor not met)" (open question); is the leaver warned on SCR-GRP-70, as GRP-17 shows affected votes to the remover? Not specified in the story.
  4. ACC-15 criterion 2 treats an amount owed recorded at leave as a blocker for account deletion; the leaver's screen does not mention this consequence.

---

### GRP-17 Remove someone from the group

- Story: GRP-17 Remove someone from the group
- Surfaces:
  - SCR-GRP-46 | Remove member screen (what removal does, reason presets and optional text, affected open money votes, button "Remove <name>") | page | Permission holder with Group: remove member | "Remove from group" on the member page | confirm; PIN sheet when the target holds a money-out permission
  - SCR-GRP-73 | Removed-person view ("You are no longer in <group>", reason code in plain words, what they keep, read-only record of own payments and receipts and access-history entries about themselves) | page | removed person | next app open after removal | support route (OPS-06)
  - SCR-GRP-74 | Removal notices `msg.grp.member_removed.push`, `.sms` (no reason text), `msg.grp.member_removed.inapp` for holders of Group: view audit log | notification | removed person; holders of Group: view audit log | removal completed | none
- States per surface:
  - SCR-GRP-46 [default]: access ends now, pending requests cancelled, approvals voided; reason required from presets plus optional text; confirm
  - SCR-GRP-46 [money-out holder]: target holds a money-out permission; remover's PIN required (sheet SCR-GRP-40 pattern)
  - SCR-GRP-46 [blocked]: removal would violate GRP-14; blocked with the usual explanation (SCR-GRP-61)
  - SCR-GRP-46 [affected votes]: lists open money votes the removal would affect through the voter floor (VOT-02) before confirming
  - SCR-GRP-46 [self]: a person cannot remove themselves; offered GRP-16 instead
  - SCR-GRP-46 [saving]: saving state
  - SCR-GRP-46 [offline]: action disabled with an explanation
  - SCR-GRP-46 [failure]: membership unchanged and says so; no money moves
  - SCR-GRP-73 [default]: sees reason in plain words and what they keep; cannot see ledger, balance, members or votes
  - SCR-GRP-74 [push], [sms], [in-app]: removed person gets push with SMS fallback and no reason text in the SMS; holders of Group: view audit log get an in-app item; the group channel never names the reason
- Criteria map:
  - AC 1: SCR-GRP-46 [default]
  - AC 2: SCR-GRP-46 [self], [blocked], [money-out holder]
  - AC 3: SCR-GRP-46 [affected votes]; system rule (permissions end at once, pending requests cancelled, approvals voided, ballot stays counted, denominator fixed)
  - AC 4: no UI beyond CON screens, system rule (owed amounts stay visible as outstanding to holders of the relevant contribution permissions and follow `grp.leave_obligation_policy`)
  - AC 5: SCR-GRP-73 [default]
  - AC 6: SCR-GRP-46 [saving], [offline]; SCR-GRP-73 [default]
  - AC 7: SCR-GRP-46 [failure]
  - AC 8: SCR-GRP-74 [push], [sms], [in-app]
  - AC 9: no UI, system rule (no ledger entry; audit `membership.removed` with remover, target, reason code, permissions held, cancelled and voided items)
- Objects and fields: Membership (status Removed); Approval (voided); Expense request (cancelled); Audit entry (`membership.removed`).
- Open points:
  1. The reason presets are not listed in the story. Not specified in the story.
  2. The removed person sees "the reason code in plain words" while the group channel never names the reason; does the removed person see the free-text part? Not specified in the story.
  3. The permission names used for outstanding amounts ("relevant contribution permissions") are not named. Not specified in the story.
  4. Can the removed person see the screen if they have no app installed? Only the SMS (no reason) reaches them; not specified in the story.

---

### GRP-18 Change the group's name, purpose and rules text

- Story: GRP-18 Change the group's name, purpose and rules text
- Surfaces:
  - SCR-GRP-75 | Edit group (name, purpose, "How our group works" free text) | page | Permission holder with Group: edit group | "Edit group" | save; back keeps a local draft
  - SCR-GRP-76 | Version history (who changed what and when; restore as a new version) | inline | holder of Group: edit group | SCR-GRP-75 | restore
  - SCR-GRP-77 | Group edited notices (`msg.grp.group_edited.push` for rules text; in-app item for name or purpose) | notification | all members | edit saved | none
- States per surface:
  - SCR-GRP-75 [default]: text edits show at once in the group page and invite preview
  - SCR-GRP-75 [draft offline]: local draft only (XCT-05 Table B), never auto-sent, labelled with the `Draft, not sent` key; saving needs a connection and shows `xct.offline.needs_connection`
  - SCR-GRP-75 [conflict]: two people edit the same field; both versions shown
  - SCR-GRP-75 [saving]: saving state
  - SCR-GRP-75 [validation or failure]: validation as in GRP-01; failed save keeps text in the form
  - SCR-GRP-75 [large text]: field supports 200% font scale; explains the text is shown in the language written, with an option to add translations later
  - SCR-GRP-76 [default]: each version listed; restoring creates a new version
  - SCR-GRP-77 [material]: rules text change; in-app item and push to all members
  - SCR-GRP-77 [minor]: name or purpose change; in-app item only; no SMS
- Criteria map:
  - AC 1: SCR-GRP-75 [default]
  - AC 2: SCR-GRP-76 [default]
  - AC 3: SCR-GRP-77 [material], [minor]
  - AC 4: no UI beyond SCR-GRP-19, system rule (invite links keep working and show current text; earlier previewers see the new text on accept)
  - AC 5: SCR-GRP-75 [saving], [conflict], [draft offline]
  - AC 6: SCR-GRP-75 [validation or failure]
  - AC 7: SCR-GRP-77 [material], [minor]
  - AC 8: no UI, system rule (audit `group.edited` with field names, previous and new values, actor, time)
  - AC 9: SCR-GRP-75 [large text]
- Objects and fields: Group (name, purpose, rules text, version history); Audit entry (`group.edited`).
- Open points:
  1. Does a name change appear in SMS templates immediately, given the GSM-7 short form of NTF-07? Not specified in the story.
  2. Who can see the version history (only Group: edit group holders or every member)? Not specified in the story.
  3. The "option to add translations later" is mentioned in criterion 9 but closed as not in the MVP; does the form show any option? Not specified.
  4. Maximum length of "How our group works" text: not specified in the story.

---

### GRP-19 Close a group but keep its history

- Story: GRP-19 Close a group but keep its history
- Surfaces:
  - SCR-GRP-78 | Archive group (conditions checklist: all wallets at 0 Ar, no pending transactions, no waiting spend requests, no open votes; type the group name; PIN) | page | Permission holder with Group: delete group | "Archive group" | confirm; opens SCR-GRP-79
  - SCR-GRP-79 | Archive pending banner and second confirmer prompt | inline | other holders of Group: delete group | `msg.grp.archive_requested.push` | confirm or let lapse
  - SCR-GRP-80 | Archived banner ("Archived on 12 Oct") and restore action | inline | all members; restore for holders of Group: delete group | group in status Archived | restore with a second holder
  - SCR-GRP-81 | Archive notices `msg.grp.archive_requested.push`, `msg.grp.archived.push` (SMS fallback only if a member holds an open obligation) | notification | second confirmer; all members | archive requested, completed | none
- States per surface:
  - SCR-GRP-78 [default]: each condition shown done or not
  - SCR-GRP-78 [balance left]: a wallet holds money; "Pay out the remaining <amount> first" with link to a spend request; cannot proceed until 0 Ar by approved outflows
  - SCR-GRP-78 [ready]: all conditions pass; confirm with the group name typed and the PIN
  - SCR-GRP-78 [archiving]: archiving state
  - SCR-GRP-78 [offline]: disabled with an explanation
  - SCR-GRP-78 [failure]: group stays Active and says so; money never moves
  - SCR-GRP-79 [pending]: status Archive pending; the second holder has `grp.archive_grace` (7 days) to confirm
  - SCR-GRP-79 [lapsed]: not confirmed in time; request lapses; group stays Active
  - SCR-GRP-79 [vote fallback]: fewer than two holders of Group: delete group; archive falls back to a group vote under normal quorum
  - SCR-GRP-80 [archived]: read-only for all members; ledger, decisions, members and audit visible and exportable; no contributions, requests, votes, events or reminders are created; scheduled reminders stop
  - SCR-GRP-80 [restore]: a holder restores with a second different holder (or vote fallback); audit entry; cancelled votes not reopened
  - SCR-GRP-81 [push], [sms fallback]: as above
- Criteria map:
  - AC 1: SCR-GRP-78 [default], [ready]
  - AC 2: SCR-GRP-79 [pending], [lapsed], [vote fallback]
  - AC 3: SCR-GRP-78 [balance left]
  - AC 4: SCR-GRP-80 [archived]
  - AC 5: SCR-GRP-80 [restore]
  - AC 6: SCR-GRP-78 [archiving], [offline]; SCR-GRP-80 [archived]
  - AC 7: SCR-GRP-78 [failure]
  - AC 8: SCR-GRP-81 [push], [sms fallback]
  - AC 9: no UI, system rule (no ledger entry; audit `group.archive_requested`, `group.archived`, `group.restored`)
- Objects and fields: Group (status Active, Archive pending, Archived); Wallet (balance); Audit entry.
- Open points:
  1. The conditions do not include due contributions, but criterion 8 allows an SMS fallback when "a member holds an open obligation". Can an archive complete with unpaid contributions or recorded debts? Not specified in the story.
  2. Where do restore requests appear for the second holder (notification key)? Only `msg.grp.archive_requested.push` is named for archive; the restore request key is not specified.
  3. Where is a group "Archived" found in lists (own section or in the normal list)? Not specified in the story.
  4. Does a vote fallback for archive follow VOT "Kinds of vote" (authority vote) or a plain vote? Said "normal quorum"; the vote kind is not specified.

---

### GRP-20 Delete a group, within what the law lets us

- Story: GRP-20 Delete a group, within what the law lets us
- Surfaces:
  - SCR-GRP-82 | Delete group (what is removed, what is kept, full export offer in CSV and PDF, "Delete group" button) | page | Permission holder with Group: delete group (group Archived) | "Delete group" on an archived group | confirm; second confirmer
  - SCR-GRP-83 | Delete pending banner (days remaining in grace) and restore | inline | holders of Group: delete group | group in status Delete pending | restore within `grp.delete_grace`
  - SCR-GRP-84 | Delete notices `msg.grp.delete_scheduled.push`, `msg.grp.deleted.inapp` | notification | all members | deletion scheduled, completed | none
  - SCR-GRP-85 | Member personal export after deletion (own contribution history from wallet history) | inline | former members of a deleted group | wallet history | export
- States per surface:
  - SCR-GRP-82 [default]: explains removal (name from lists, announcements, events, documents, chat-like content) and kept records (ledger entries, approvals, decisions, audit entries for `AUDIT_RETENTION_YEARS`); offers full export first
  - SCR-GRP-82 [not archived]: only Archived groups can be deleted; action not offered
  - SCR-GRP-82 [second confirmer]: a second holder of Group: delete group must confirm as in GRP-19 (vote fallback when fewer than two holders); group Delete pending
  - SCR-GRP-82 [offline]: disabled with the usual explanation
  - SCR-GRP-82 [failure]: group stays archived; no money moves
  - SCR-GRP-83 [grace]: group hidden but restorable; days remaining shown
  - SCR-GRP-83 [completed]: after grace, removable content erased; kept records retained and not viewable by members
  - SCR-GRP-84 [push], [in-app]: deletion scheduled and completed; no SMS
  - SCR-GRP-85 [default]: members still export their own contribution history for the retention periods
- Criteria map:
  - AC 1: SCR-GRP-82 [default]
  - AC 2: SCR-GRP-82 [not archived], [second confirmer]
  - AC 3: SCR-GRP-83 [grace], [completed]
  - AC 4: SCR-GRP-85 [default]
  - AC 5: no UI, system rule (kept records accessible only through the OPS operator process with a recorded reason)
  - AC 6: SCR-GRP-83 [grace]; SCR-GRP-82 [offline]
  - AC 7: SCR-GRP-82 [failure]
  - AC 8: SCR-GRP-84 [push], [in-app]
  - AC 9: no UI, system rule (audit `group.delete_requested`, `group.delete_confirmed`, `group.deleted` with kept and erased)
- Objects and fields: Group (status Delete pending, Deleted); Ledger entry (retained); Audit entry; export file.
- Open points:
  1. After the group is hidden, where does a member see `msg.grp.deleted.inapp`? The group is no longer listed; not specified in the story.
  2. Does restoring a Delete pending group need the same second confirmer as GRP-19? "Restorable" is stated; the confirmation rule is not.
  3. Is the pre-delete export (CSV and PDF) a WAL-16 and CON-18 export or a group-level export with new fields? Not specified in the story.
  4. Which retention applies to "kept records": the story cites `AUDIT_RETENTION_YEARS` (OPS) while the ledger falls under `RECORD_RETENTION_YEARS` (WAL). Which period applies to ledger entries?

---

## Epic summary

- Stories: 20.
- Distinct surfaces: 79. By kind:
  - page: 24
  - sheet: 3
  - modal: 1
  - inline: 29
  - notification: 13
  - system: 9
- State lines: 213.
- Open points: 90. Full list:
  - GRP-01.1: Criterion 4 says the group form is a local draft (XCT-05 Table B, label key `xct.queue.draft`) and also that the request carries an idempotency key; is the draft listed anywhere so it can be resumed after leaving the form? Not specified in the story.
  - GRP-01.2: Which text and key does the soft duplicate-name warning use? Not specified in the story.
  - GRP-01.3: What is the limit message text when `grp.max_groups_per_user` is reached and what is "the next action"? Not specified in the story.
  - GRP-01.4: Does the SMS-name preview line show the shortened form per NTF-07 live while typing? The story says "a line shows how the name will look"; the shortening rule is owned by NTF-07.
  - GRP-01.5: The wallet type list (budget, savings, investment, business) is restated here; WAL-01 owns wallet types. Which owner wins if they differ? Not specified in the story.
  - GRP-02.1: Where is "created by Sara on 12 Oct" shown (group page, member page, audit log)? Criterion 3 records it but names no screen.
  - GRP-02.2: Criterion 2 says the card "stays reachable from the checklist", but the checklist (GRP-01 criterion 3) has three named items and none is the card. How is the card reopened?
  - GRP-02.3: When does the card turn into "normal home content" if the founder dismisses it, then another holder appears? Not specified in the story.
  - GRP-02.4: The card text promises a vote path ("or until the group votes") yet a one-member group cannot vote (VOT floor). Is the text different for groups under three members? Not specified in the story.
  - GRP-03.1: Criterion 3 says a phone invite makes the invited person "eligible to vote as a guest before joining". R42 and the VOT rules say non-members are never eligible to vote and ACC-16 criterion 4 ties vote links to an eligible list. Which is the rule?
  - GRP-03.2: When a bundle is chosen at invitation and it contains a money-out permission, is the inviter's PIN needed (GRP-08 criterion 3)? Not specified in the story.
  - GRP-03.3: What is the key and wording of the notice the inviter receives for "Request access" and where does the inviter decide? Not specified in the story.
  - GRP-03.4: Who may see the invites list (Group: invite member only, or also Group: view group)? Not specified in the story.
  - GRP-03.5: `grp.invite_sms_per_day` (R185) is not in this story; does a per-day invitation SMS limit show in SCR-GRP-14? Not specified in the story.
  - GRP-03.6: Is the SMS language selector's default "the group's language" defined for a group with several languages? Not specified in the story.
  - GRP-04.1: The preview shows "the count (not the names) of people who can approve", while GRP-12 criterion 3 hides approver counts for groups under five members. Does the invite preview follow that hiding? Not specified in the story.
  - GRP-04.2: Joining "needs only phone and OTP" but ACC-02 criterion 3 creates a Pending PIN account where nothing else is reachable until a PIN is set. Does the invitee set a PIN before landing on group home?
  - GRP-04.3: How does the preview word the spending rule for a group with no band set ("default floor in words", GRP-12 criterion 8)? Not specified in the story.
  - GRP-04.4: Which key texts do the Decline reasons use? Only the English wording is given.
  - GRP-04.5: A guest invited by phone invite: does this preview replace the SCR-ACC-81 generic link page, or does it render inside it? ACC-16 criterion 1 shows only name, inviter and member count; GRP-04 shows more. Which wins?
  - GRP-04.6: For `msg.grp.invite_accepted.push`, is the joiner's name shown (R4 forbids showing approver names to invitees, not the reverse)? Not specified in the story.
  - GRP-05.1: Which permission does the badge "Can change who has access" stand for (Group: grant permission, revoke permission, or both)? Not specified in the story.
  - GRP-05.2: Does the list show the neutral "unavailable" marker next to unreachable holders (GRP-14 criterion 10)? The story does not place it on this list.
  - GRP-05.3: Does the list show the "Invited" members' names or numbers, and to whom? Not specified in the story.
  - GRP-05.4: Why does the story depend on GRP-09 for the Effective access link when GRP-09 is P1 and this story P0? Not an ambiguity for the screen, but the link must be hidden if GRP-09 is not built; not specified.
  - GRP-06.1: A group can have up to `grp.max_wallets_per_group` wallets (GRP-15); is "the group balance" a total of all wallets or one tile per wallet? Not specified in the story.
  - GRP-06.2: Criterion 2 says each tile needs "its permission" but names only Wallet: view balance. Which permission gates the board summary (Contribution plan: view), the event tile (Event: view), the ledger lines (Wallet: view history) and "Waiting for you"? Not specified in the story.
  - GRP-06.3: What is "a status word" on the balance tile when nothing is pending? Not specified in the story.
  - GRP-06.4: GRP-14 criterion 10 puts a neutral "unavailable" marker next to unreachable holders; does the shortage banner name or count holders for non-holders of Group: grant permission ("the names to ask")? The banner could expose who is reachable.
  - GRP-06.5: The offline header "Updated 14:05" contradicts the offline wording of other stories only if they use the word offline; XCT-04 owns it. Not a story ambiguity, no action.
  - GRP-07.1: The story cites "XCT-05 Table C" for online-only permission changes; XCT-05 defines Table C only as an informational index of never-queued actions, not a second source of truth (D6), and its row "Permission, role and membership changes by others" cites GRP-07 only. Is the citation meant as the default-deny rule? Not specified.
  - GRP-07.2: The Member bundle row lists Wallet: deposit, but conventions section 7 names list `Wallet: deposit` while WAL may not use it as a gate. Which story consumes it? Not specified in the story.
  - GRP-07.3: The Treasurer bundle write includes Group: view audit log; the apply screen's money-out notice for Treasurer is triggered by money-out permissions. Is the notice shown when only freeze or edit rules are included? Edit rules is in the class, so yes; stated here only for completeness.
  - GRP-07.4: Where are the bundle permissions "Event: view, Project: view, Document: view" shown given that Document is unused in the MVP (conventions section 7)? Not specified in the story.
  - GRP-08.1: The PIN sentence "This lets <name> move group money" is written for granting; what is the sentence when revoking a money-out permission? Not specified in the story.
  - GRP-08.2: Granting is allowed "only permissions they hold themselves", but the founder holds all; may a Treasurer-bundle holder who has Group: grant permission grant Wallet: create or close they do not hold? Stated as not allowed; the story does not say what the checklist shows.
  - GRP-08.3: The stale-data screen "shows both versions and asks to review"; the exact review controls are not specified in the story.
  - GRP-08.4: How does the screen decide and show "below the money-out tier required for the amount" when no amount exists at grant time? The story does not name the tier basis at grant time.
  - GRP-08.5: Is the SMS fallback for a money-out change also sent to the person whose permission is revoked? The story says the "affected person" gets push and SMS fallback "for money-out changes"; revocation is included by wording but not explicit.
  - GRP-09.1: The empty text "This person can only be seen by the group" with "the reason" is unclear for a person who has no permissions; what reason is shown? Not specified in the story.
  - GRP-09.2: Does the panel show the thresholds to a member who lacks Wallet: view balance (amounts reveal balance scale, R100)? Not specified in the story.
  - GRP-09.3: May a former member see their own panel? GRP-10 gives former members read-only access to entries about themselves; the panel is not mentioned.
  - GRP-09.4: The story is P1 while GRP-05, GRP-07 and GRP-08 link to it; the link behaviour when the panel is not built is not specified.
  - GRP-10.1: Criterion 5 shows cached entries offline, but GRP-11 criterion 6 says the audit log (the same entries) is not cached offline and R191 says GRP-11 follows XCT-04 offline. Which offline behaviour applies?
  - GRP-10.2: Is the member-without-permission view ("entries about themselves") the same screen with filters hidden? Not specified in the story.
  - GRP-10.3: Does the timeline show the reference id for system entries? Criterion 1 says each entry shows a reference id; criterion 4 labels system entries; the story does not exclude the id.
  - GRP-11.1: GRP-10 criterion 5 caches access-history entries offline while this story does not cache the log; R191 item 3 says GRP-11 follows XCT-04 offline. Which applies?
  - GRP-11.2: Does the group see the operator reason text, or only the sentence "Gereo support viewed the audit log" (criterion 5 says "with the reason")? Not specified in the story.
  - GRP-11.3: Which action types does the filter offer? The list in criterion 1 gives events; the filter vocabulary is not specified.
  - GRP-11.4: Retention is inherited from SPD-16 through `AUDIT_RETENTION_YEARS`; the story says it states no number, so the screen shows none.
  - GRP-12.1: How do the approvers see and approve a loosening proposal (which screen, which PIN, which notification action)? The story names only the notification `msg.grp.threshold_loosen_requested.push`.
  - GRP-12.2: The page lists `receipt_required_above` and `project_spend_requires_decision` as SPD parameters tagged GRP-12, but conventions Table B does not list them. Where are they defined and what are their editors and defaults? Not specified in the story.
  - GRP-12.3: How is a loosening distinguished from a tightening when one save mixes both? Not specified in the story.
  - GRP-12.4: Does a loosening proposal expire, and after how long? Not specified in the story.
  - GRP-12.5: The anonymous counts are hidden for groups under five; does the supply warning text "Only 2 people can approve" also show a count in those groups? The text implies a count; EV-GRP-12 allows only the warning.
  - GRP-12.6: What does the page show when the vote link to an expense (SPD-09, VOT-03) is unavailable besides disabling the choice with a reason? The reason text is not specified.
  - GRP-13.1: The error code returned on a bypass attempt is "stable" but not named. Not specified in the story.
  - GRP-13.2: Criterion 5 says a group below three holders of Vote: vote has no vote path "and relies on approvals or on recovery through OPS-06"; but operators cannot lift a freeze (criterion 3). What does a two-person group with a freeze do? Not specified in the story.
  - GRP-13.3: The shortage banner is driven by "reachable, money-out capable" holders; GRP-14 criterion 4 drives it by "reachable holders" only. Which count drives the banner?
  - GRP-13.4: The accepted residual risk of one person with two SIMs has no UI; no mitigation screen is specified.
  - GRP-13.5: Criterion 4 mentions an SMS allowance top-up approval; the screens for it belong to NTF-06; not specified here.
  - GRP-14.1: The operational process when no member can act (death, dispute, fewer than three members) is still open with Gereo operations; default is nobody moves the money and OPS-06 documents the case.
  - GRP-14.2: How does a remaining member find the recovery-by-vote entry (banner link, group home, vote creation)? Not specified in the story.
  - GRP-14.3: Where is the Project: approve purchase warning shown and to whom? Not specified in the story.
  - GRP-14.4: Does the block copy name the permission using the plain verb (for example "approve spending") from the bundle keys? The example text suggests yes; the keys are not specified.
  - GRP-14.5: Which screen does a blocked person in GRP-16 or GRP-17 return to after the block? Not specified in the story.
  - GRP-15.1: Wallet: create also covers renaming and retyping, but this story shows only a creation form. Which screen renames and retypes (WAL-04)? Not specified in the story.
  - GRP-15.2: Does the form warn that retyping or renaming affects rules or reports? Not specified in the story.
  - GRP-15.3: The in-app item is batched under NTF-08; the batch text is not specified here.
  - GRP-15.4: Does a new wallet default to "no outgoing rule" requirement for campaign use (R175)? Not specified in the story.
  - GRP-16.1: Where is the outstanding-debt note shown ("note on the member history") and who sees it? Not specified in the story.
  - GRP-16.2: Does the leave summary change when the leaver holds a money-out permission (PIN needed)? Not specified in the story.
  - GRP-16.3: When the D4 floor fails only because of the departure, the open vote closes "Not passed (floor not met)" (open question); is the leaver warned on SCR-GRP-70, as GRP-17 shows affected votes to the remover? Not specified in the story.
  - GRP-16.4: ACC-15 criterion 2 treats an amount owed recorded at leave as a blocker for account deletion; the leaver's screen does not mention this consequence.
  - GRP-17.1: The reason presets are not listed in the story. Not specified in the story.
  - GRP-17.2: The removed person sees "the reason code in plain words" while the group channel never names the reason; does the removed person see the free-text part? Not specified in the story.
  - GRP-17.3: The permission names used for outstanding amounts ("relevant contribution permissions") are not named. Not specified in the story.
  - GRP-17.4: Can the removed person see the screen if they have no app installed? Only the SMS (no reason) reaches them; not specified in the story.
  - GRP-18.1: Does a name change appear in SMS templates immediately, given the GSM-7 short form of NTF-07? Not specified in the story.
  - GRP-18.2: Who can see the version history (only Group: edit group holders or every member)? Not specified in the story.
  - GRP-18.3: The "option to add translations later" is mentioned in criterion 9 but closed as not in the MVP; does the form show any option? Not specified.
  - GRP-18.4: Maximum length of "How our group works" text: not specified in the story.
  - GRP-19.1: The conditions do not include due contributions, but criterion 8 allows an SMS fallback when "a member holds an open obligation". Can an archive complete with unpaid contributions or recorded debts? Not specified in the story.
  - GRP-19.2: Where do restore requests appear for the second holder (notification key)? Only `msg.grp.archive_requested.push` is named for archive; the restore request key is not specified.
  - GRP-19.3: Where is a group "Archived" found in lists (own section or in the normal list)? Not specified in the story.
  - GRP-19.4: Does a vote fallback for archive follow VOT "Kinds of vote" (authority vote) or a plain vote? Said "normal quorum"; the vote kind is not specified.
  - GRP-20.1: After the group is hidden, where does a member see `msg.grp.deleted.inapp`? The group is no longer listed; not specified in the story.
  - GRP-20.2: Does restoring a Delete pending group need the same second confirmer as GRP-19? "Restorable" is stated; the confirmation rule is not.
  - GRP-20.3: Is the pre-delete export (CSV and PDF) a WAL-16 and CON-18 export or a group-level export with new fields? Not specified in the story.
  - GRP-20.4: Which retention applies to "kept records": the story cites `AUDIT_RETENTION_YEARS` (OPS) while the ledger falls under `RECORD_RETENTION_YEARS` (WAL). Which period applies to ledger entries?
