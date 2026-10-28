# PRJ: screen and state inventory

Source: `docs/product/stories/PRJ.md` (12 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-PRJ-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-PRJ-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Permission names follow conventions section 7. Project statuses: Active, On hold, Closed (plus the computed marker `Late`). Task statuses: To do, Doing, Done (plus computed `Overdue`). A project never authorises spending (D1, D4); a budget is tracked, not reserved, and writes no ledger entry.

---

### PRJ-01 Start a project from a ready-made template in about a minute

**Story:** PRJ-01 Start a project from a ready-made template in about a minute

**Surfaces:**
- SCR-PRJ-01 | Create project form (name, goal in one sentence, owner prefilled with the creator, target date with a "No date" choice; button `Create project`) | page | Member holding `Project: edit` at group level | Entry: "New project" on the group's project list (SCR-PRJ-38) or the group home | Exit: SCR-PRJ-02, then SCR-PRJ-07
- SCR-PRJ-02 | Optional step: "Add a budget" and "Add people to the team" | page (flow step) | Creator | Entry: after the four fields | Exit: SCR-PRJ-13, SCR-PRJ-03, SCR-PRJ-07
- SCR-PRJ-03 | Member picker (owner, team members) | sheet | Creator | Entry: owner field of SCR-PRJ-01, "Add people to the team" | Exit: SCR-PRJ-01 or SCR-PRJ-02
- SCR-PRJ-04 | Past-date confirmation (`prj.create.past_date`) | modal | Creator | Entry: target date in the past | Exit: SCR-PRJ-01
- SCR-PRJ-05 | Notification: team added (`msg.prj.team_added`, push and in-app, no SMS; also to a new owner who is not the creator) | notification | Added team members and the owner | Entry: system on create | Exit: SCR-PRJ-07
- SCR-PRJ-06 | Notification: project created (`msg.prj.created`, EV-PRJ-01, in-app, Low) | notification | Holders of `Project: view` | Entry: system on create | Exit: SCR-PRJ-07

**States per surface:**
- SCR-PRJ-01 default: four fields on one screen; nothing else required; owner changeable to any member of the group.
- SCR-PRJ-01 validation: name empty or longer than `PROJECT_NAME_MAX_CHARS`, goal empty or longer than `PROJECT_GOAL_MAX_CHARS`; inline message (key not specified).
- SCR-PRJ-01 past date: allowed only after confirmation (SCR-PRJ-04).
- SCR-PRJ-01 saving: button disabled while saving.
- SCR-PRJ-01 failure: fields kept; `prj.error.save_failed` with Retry.
- SCR-PRJ-01 offline: creating a project is never queued (not a registry row); button disabled; `xct.offline.needs_connection`; typed fields stay.
- SCR-PRJ-01 permission hidden: person without `Project: edit`; "New project" not offered, and the empty list explains who can create (SCR-PRJ-38).
- SCR-PRJ-01 long text: not specified beyond the character limits.
- SCR-PRJ-02 default: both actions optional; can skip.
- SCR-PRJ-02 success: project created with status Active, creator and owner on the team, permissions inherited (PRJ-06); opens on SCR-PRJ-07 with every template section visible and empty, each with an empty-state sentence and one action.
- SCR-PRJ-03 default: members of the group; searchable list; owner has no permission beyond what the group gave.
- SCR-PRJ-04 default: confirm a date in the past or change it.
- SCR-PRJ-05 default: `msg.prj.team_added.push` plus in-app item; never triggers NTF-11 SMS.
- SCR-PRJ-06 default: in-app item for holders of `Project: view`.
- SCR-PRJ-01 timing target: median of at most `PROJECT_CREATE_TARGET_SECONDS` in the prototype test; form cut back if higher.

**Criteria map:**
- AC 1: SCR-PRJ-01 default (four fields, limits, owner, "No date").
- AC 2: SCR-PRJ-02 default (optional budget and team, `Create project`).
- AC 3: SCR-PRJ-02 success (opens on the project page, template sections empty with sentence and action).
- AC 4: SCR-PRJ-02 success and SCR-PRJ-03 default (Active, creator and owner on team, inherited permissions).
- AC 5: SCR-PRJ-01 timing target (usability target, no UI).
- AC 6: SCR-PRJ-01 saving, failure, offline (`prj.error.save_failed`, `xct.offline.needs_connection`).
- AC 7: SCR-PRJ-01 validation and SCR-PRJ-04 default (`prj.create.past_date`).
- AC 8: SCR-PRJ-05 and SCR-PRJ-06 default (`msg.prj.team_added`, `msg.prj.created`, no SMS).
- AC 9: no UI, system rule (audit of creation, owner, team members).

**Objects and fields:** Project (name, goal, owner, target date, status, template); Group; Membership; Audit entry; Notification.

**Open points:**
- AC 6 says creating a project is "never queued (XCT-05 Table C)"; conventions and D6 define only Table A and Table B. Which table or "Never queued" index is meant?
- Keys for the name and goal validation messages: not specified in the story.
- What does a member with `Project: view` but not `Project: edit` see where "New project" would be, hidden or a named reason (09 section 6.3 rules 3 and 4)? Story PRJ-10 AC 4 gives an explanation only on the empty list; elsewhere not specified.
- "Photo or initials" for owner: depends on ACC profile photo; not specified in this story.

---

### PRJ-02 Open a project and see what it is about, who owns it and where it stands

**Story:** PRJ-02 Open a project and see what it is about, who owns it and where it stands

**Surfaces:**
- SCR-PRJ-07 | Project page (header: name, goal, owner, deadline `Fri 24 Oct (in 12 days)`, status chip, team list with count and "See all"; sections in fixed order: Summary, Budget, Tasks, Expenses, Decisions, Events, Files; Timeline view beside them) | page | Member holding `Project: view` | Entry: project list, notification, link, group home | Exit: sections, SCR-PRJ-38
- SCR-PRJ-08 | Edit project (name, goal, owner, deadline, On hold or Active; shows what changed; saved on confirmation) | sheet | Holder of `Project: edit` | Entry: edit action on SCR-PRJ-07 | Exit: SCR-PRJ-07
- SCR-PRJ-09 | On hold banner (with the optional reason) | inline (on SCR-PRJ-07) | Every viewer | Entry: project On hold | Exit: none
- SCR-PRJ-10 | Team list ("See all") | sheet | Member holding `Project: view` | Entry: "See all" on SCR-PRJ-07 | Exit: SCR-PRJ-07
- SCR-PRJ-11 | Project history (every field change with before value, after value, actor and time) | page | Member holding `Project: view` | Entry: link on SCR-PRJ-07 | Exit: SCR-PRJ-07
- SCR-PRJ-12 | Notification: owner changed (`msg.prj.owner_changed`, push) | notification | Old and new owner | Entry: system on owner change | Exit: SCR-PRJ-07

**States per surface:**
- SCR-PRJ-07 default: header with absolute date and relative part (XCT-03), status chip with word and icon, sections in the fixed order with counts.
- SCR-PRJ-07 Active, On hold, Closed: status shown by word and icon; `Late` marker when the deadline has passed and the project is not Closed.
- SCR-PRJ-07 Closed: closing summary instead of edit actions (SCR-PRJ-34).
- SCR-PRJ-07 loading: skeleton of the final layout.
- SCR-PRJ-07 offline: opens from cache with `Last synced` (XCT-04); edit actions disabled with an explanation, not queued; read sections still work.
- SCR-PRJ-07 not visible: `prj.error.not_visible` with who can grant access, never a bare "Not allowed".
- SCR-PRJ-07 forbidden or not found: see not visible; a deleted or unknown project is not specified.
- SCR-PRJ-07 edit hidden: person without `Project: edit` sees no edit action.
- SCR-PRJ-08 default: can change name, goal, owner, deadline, put On hold or Active again; each change shows what changed.
- SCR-PRJ-08 owner change: notifies old and new owner; records both.
- SCR-PRJ-08 offline: disabled with an explanation (key not specified).
- SCR-PRJ-09 default: visible banner; reason shown when entered (optional).
- SCR-PRJ-09 new work during hold: new expense requests and new tasks still allowed unless the group decides otherwise.
- SCR-PRJ-10 default: team with count.
- SCR-PRJ-11 default: change list with before, after, actor, time.
- SCR-PRJ-12 default: `msg.prj.owner_changed.push`.

**Criteria map:**
- AC 1: SCR-PRJ-07 default and SCR-PRJ-10 (header content, "See all").
- AC 2: SCR-PRJ-07 Active, On hold, Closed (status words, icons, `Late`).
- AC 3: SCR-PRJ-07 default (sections in fixed order with counts).
- AC 4: SCR-PRJ-08 default (editable fields, On hold and Active).
- AC 5: SCR-PRJ-08 owner change and SCR-PRJ-12 default.
- AC 6: SCR-PRJ-07 offline and SCR-PRJ-08 offline.
- AC 7: SCR-PRJ-07 not visible and Closed (`prj.error.not_visible`).
- AC 8: SCR-PRJ-07 loading and SCR-PRJ-09 default.
- AC 9: SCR-PRJ-11 default (audit of every field change).

**Objects and fields:** Project (name, goal, owner, deadline, status, hold reason, team); Membership; Audit entry.

**Open points:**
- On hold "new expense requests and new tasks are still allowed unless the group decides otherwise": which setting lets the group decide and where? Not specified in the story.
- How is a person who cannot see the project distinguished from a project that does not exist (09 section 6.3 rule 6, GitHub pattern)? Story shows `prj.error.not_visible`, which confirms existence. Per object type decision not specified.
- Where is the optional on-hold reason entered, and its maximum length? Not specified in the story.
- Is "Timeline" a section or a view (PRJ-11 says beside the sections)? The section list of AC 3 omits it. Not specified in the story.
- Key and layout of the project history entries: not specified in the story.

---

### PRJ-03 Link a budget to one wallet and see spent against planned

**Story:** PRJ-03 Link a budget to one wallet and see spent against planned

**Surfaces:**
- SCR-PRJ-13 | Budget editor (planned total in whole ariary shown as `1 000 000 Ar`; pick exactly one wallet among the wallets of this group the person can view) | sheet | Holder of `Project: manage budget` and `Wallet: view balance` on the chosen wallet | Entry: "Set budget" on SCR-PRJ-07 or SCR-PRJ-02 | Exit: SCR-PRJ-07
- SCR-PRJ-14 | Budget section (one sentence and one bar: planned, spent, pending, remaining) | inline (on SCR-PRJ-07) | Member holding `Project: view` | Entry: SCR-PRJ-07 | Exit: SCR-PRJ-15, SCR-PRJ-25
- SCR-PRJ-15 | Budget history (who, when, old and new value) | sheet | Holder of `Project: manage budget` (visibility to others not specified) | Entry: link on SCR-PRJ-14 | Exit: SCR-PRJ-14
- SCR-PRJ-16 | Wallet change confirmation | modal | Holder of `Project: manage budget` | Entry: change wallet before any linked request is Paid | Exit: SCR-PRJ-14
- SCR-PRJ-17 | Notification: budget near (`msg.prj.budget_near`, EV-PRJ-05) | notification | Holders of `Project: manage budget` | Entry: system once per crossing of `PROJECT_BUDGET_ALERT_PERCENT` | Exit: SCR-PRJ-14

**States per surface:**
- SCR-PRJ-13 default: amount and wallet picker; a project has at most one linked wallet; a wallet may be linked to several projects; no consent needed from others.
- SCR-PRJ-13 no wallet: group owns no wallet or none viewable; not specified (precondition says at least one wallet).
- SCR-PRJ-13 wallet change: allowed before any linked request is Paid, with confirmation (SCR-PRJ-16); blocked once one linked request is Paid; open requests keep following their own request (SPD-07).
- SCR-PRJ-13 offline: change not possible offline (message key not specified).
- SCR-PRJ-13 permission hidden: person without `Project: manage budget`; action not shown.
- SCR-PRJ-14 default: `Spent 300 000 Ar of 1 000 000 Ar planned. 120 000 Ar waiting for approval. 580 000 Ar left.` with a bar with a text equivalent.
- SCR-PRJ-14 empty: no budget; "Set budget" action (text not specified).
- SCR-PRJ-14 over budget: spent plus pending above the plan; `prj.budget.over` with the excess; keeps working; new requests warn (SPD-13) but are not blocked by the budget.
- SCR-PRJ-14 wallet unavailable: linked wallet closed or person lost access; `prj.budget.wallet_unavailable`; new expense requests blocked until a new wallet is linked; open requests go to Needs attention with a reason (SPD-13 criterion 7).
- SCR-PRJ-14 offline: figures from cache with `Last synced` and the outdated mark (XCT-04).
- SCR-PRJ-14 live: figures update when the ledger confirms an entry.
- SCR-PRJ-14 counting: spent is Expense and Fee ledger lines of Paid requests minus Reversal lines carrying the project_id; pending counts Awaiting vote, Awaiting approval, Approved, Paying, Needs attention and Failed while authorised, with estimated fee when known; Rejected, Cancelled, Draft, Needs changes never counted.
- SCR-PRJ-14 accessibility: space grouping, never wrapped or clipped at 200% font size, same in three languages.
- SCR-PRJ-15 default: history of planned-total changes with who, when, old and new value; also link and unlink entries (audit).
- SCR-PRJ-16 default: states the consequence; confirm or cancel.
- SCR-PRJ-17 default: sent once per crossing at `PROJECT_BUDGET_ALERT_PERCENT` of the plan (spent plus pending).

**Criteria map:**
- AC 1: SCR-PRJ-13 default (whole ariary, one wallet, wallet viewable).
- AC 2: SCR-PRJ-14 default (sentence and bar with text equivalent).
- AC 3: SCR-PRJ-14 counting.
- AC 4: SCR-PRJ-14 over budget, SCR-PRJ-17 default (`prj.budget.over`, `msg.prj.budget_near`).
- AC 5: SCR-PRJ-15 default, SCR-PRJ-13 wallet change, SCR-PRJ-16 default.
- AC 6: SCR-PRJ-14 wallet unavailable (`prj.budget.wallet_unavailable`).
- AC 7: SCR-PRJ-14 live and offline, SCR-PRJ-13 offline.
- AC 8: no UI, system rule (no ledger entry; linking, unlinking and plan changes are audit entries).
- AC 9: SCR-PRJ-14 accessibility.

**Objects and fields:** Project (planned total, linked wallet); Wallet (reference); Ledger entry (Expense, Fee, Reversal with project_id); Expense request (status, amount, estimated fee); Audit entry.

**Open points:**
- Who sees the Budget section (all with `Project: view`) when they lack `Wallet: view balance` on the linked wallet? Story shows the figures to every viewer; decision R152 and D2 do not state masking. Not specified in the story.
- Who sees the budget history (SCR-PRJ-15)? Not specified in the story.
- The key for "over budget on the request" is SPD-13; the exact warning text on the request is not specified here.
- Is `msg.prj.budget_near` also sent again after the plan is raised and crossed again? Story: once per crossing; whether a plan change re-arms is not specified.

---

### PRJ-04 Keep a short list of tasks and milestones

**Story:** PRJ-04 Keep a short list of tasks and milestones

**Surfaces:**
- SCR-PRJ-18 | Tasks section (task rows with status chips To do, Doing, Done; Done collapsed and counted `5 of 12 done`; milestones in the timeline; `prj.tasks.empty`) | inline (on SCR-PRJ-07) | Member holding `Project: view`; changes by `Project: manage tasks` (task owner may change own status) | Entry: SCR-PRJ-07 | Exit: SCR-PRJ-19
- SCR-PRJ-19 | Task form (title required, owner a team member optional, date optional, milestone flag, status) | sheet | Holder of `Project: manage tasks` | Entry: "Add a task", "Add a milestone", edit | Exit: SCR-PRJ-18
- SCR-PRJ-20 | Conflict chooser ("Your change versus Fanja's change") | sheet | Person whose offline change conflicts | Entry: sync of a conflicting change | Exit: SCR-PRJ-18
- SCR-PRJ-21 | Notification: task assigned (`msg.prj.task_assigned`, EV-PRJ-02) | notification | Task owner | Entry: system when an owner is set | Exit: SCR-PRJ-18
- SCR-PRJ-22 | Notification: task due soon (`msg.prj.task_due.push`, EV-PRJ-03, once before the due date) | notification | Task owner | Entry: system | Exit: SCR-PRJ-18
- SCR-PRJ-23 | Notification: task overdue (`msg.prj.task_overdue.push`, once after the date, push only) | notification | Task owner | Entry: system | Exit: SCR-PRJ-18
- SCR-PRJ-24 | Notification: milestone done (`msg.prj.milestone_done`, EV-PRJ-04, in-app) | notification | Project members | Entry: system when a milestone is marked done | Exit: SCR-PRJ-18

**States per surface:**
- SCR-PRJ-18 default: tasks with status chips with icon and text; Done collapsed and counted.
- SCR-PRJ-18 empty: `prj.tasks.empty` with a button to add a first task or milestone.
- SCR-PRJ-18 overdue: task with a date before today and not Done shows `Overdue` and the number of days.
- SCR-PRJ-18 closed project: tasks read-only.
- SCR-PRJ-18 owner status change: task owner can change own task status without `Project: manage tasks`; every other change needs the permission.
- SCR-PRJ-18 done and undone: marking done records who and when; un-doing allowed and logged.
- SCR-PRJ-18 offline: create, edit, status change are auto-send items (XCT-05 Table A); states `Waiting to send`, `Sent`, `Confirmed` (`xct.queue.waiting`, `xct.queue.sent`, `xct.queue.confirmed`).
- SCR-PRJ-18 failure: failed save keeps the task and shows Retry.
- SCR-PRJ-19 default: title required; owner must be a team member; milestone is a task with a date flagged as a milestone.
- SCR-PRJ-19 owner not on team: offers to add them (needs `Project: manage team`) or refused with `prj.task.owner_not_team`.
- SCR-PRJ-19 validation: empty title or invalid date; inline message (key not specified).
- SCR-PRJ-19 hold: project On hold; tasks allowed (PRJ-02).
- SCR-PRJ-20 default: both versions shown, person chooses; nothing silently overwritten (XCT-05 criterion 6).
- SCR-PRJ-21 default: sent to the owner when set.
- SCR-PRJ-22 default: once before the due date; no SMS.
- SCR-PRJ-23 default: once after the date has passed; no SMS.
- SCR-PRJ-24 default: in-app only.

**Criteria map:**
- AC 1: SCR-PRJ-19 default (fields, milestone flag).
- AC 2: SCR-PRJ-18 default (status chips, Done collapsed, `5 of 12 done`).
- AC 3: SCR-PRJ-18 done and undone and SCR-PRJ-24 default (`msg.prj.milestone_done`).
- AC 4: SCR-PRJ-18 overdue, SCR-PRJ-21, SCR-PRJ-22, SCR-PRJ-23 (`msg.prj.task_assigned`, `msg.prj.task_due.push`, `msg.prj.task_overdue.push`, no SMS).
- AC 5: SCR-PRJ-19 owner not on team (`prj.task.owner_not_team`).
- AC 6: SCR-PRJ-18 offline and SCR-PRJ-20 default (Table A rows, queue states, conflict).
- AC 7: SCR-PRJ-18 empty and closed project (`prj.tasks.empty`).
- AC 8: SCR-PRJ-19 validation and SCR-PRJ-18 failure.
- AC 9: no UI, system rule (audit of creation, edits, owner, date, status).

**Objects and fields:** Task (title, owner, date, milestone flag, status, done by, done at); Project; Membership; Audit entry; Notification.

**Open points:**
- `msg.prj.task_overdue` and `msg.prj.team_added`, `msg.prj.owner_changed`, `msg.prj.access_changed` are "to be added by NTF" (Parameters). Are they in the NTF catalogue yet, with EV IDs? Not specified in the story.
- AC 4 says the owner gets `msg.prj.task_due.push` "once before the due date": at which offset? Not specified in the story.
- Quiet hours (NTF-09) for push of task reminders: not stated in this story.
- Can a task owner change only status, or also the notes (XCT-05 "note" row)? Not specified in the story.

---

### PRJ-05 See every expense request and decision that belongs to the project

**Story:** PRJ-05 See every expense request and decision that belongs to the project

**Surfaces:**
- SCR-PRJ-25 | Expenses section (requests newest first with requester, purpose, amount, SPD status chip, authorisation line; totals reconciling with the budget; filter by status; actions "New expense request") | inline (on SCR-PRJ-07) | Member holding `Project: view` | Entry: SCR-PRJ-07 | Exit: SPD request detail, SPD-01
- SCR-PRJ-26 | Decisions section (decisions of this project newest first with title, VOT result chip, date, `Money moved` marker; filter by result; actions "Ask the group to vote", "Record a decision") | inline (on SCR-PRJ-07) | Member holding `Project: view` | Entry: SCR-PRJ-07 | Exit: SCR-VOT-55, SCR-VOT-01, SCR-VOT-57

**States per surface:**
- SCR-PRJ-25 default: authorisation line `2 of 3 approved` while Awaiting approval, `Vote open, closes Fri 17:00` while Awaiting vote, `Vote passed` once a vote authorised it; Drafts only to their requester.
- SCR-PRJ-25 totals: Paid requests with fees equal Spent in SCR-PRJ-14; over-budget warning counts the amount plus the estimated fee.
- SCR-PRJ-25 empty: `prj.expenses.empty` with one action or an explanation.
- SCR-PRJ-25 visibility: member without `Wallet: view history` sees no payee and no approver names in the list.
- SCR-PRJ-25 action hidden: person without `Wallet: initiate spend`; button hidden and a line names the missing permission and who can grant it.
- SCR-PRJ-25 filter: by status only.
- SCR-PRJ-25 loading: skeleton rows.
- SCR-PRJ-25 offline: from cache with `Last synced` and a note that status may have changed.
- SCR-PRJ-26 default: decisions with result chip (Passed, Not passed (majority not reached), Not passed (quorum not met), Tie) and `Money moved` where a ledger entry exists.
- SCR-PRJ-26 empty: `prj.decisions.empty`.
- SCR-PRJ-26 action hidden: without `Vote: create`, buttons hidden and a line names the missing permission and who can grant it.
- SCR-PRJ-26 scope: group-wide decisions that belong to no project are not shown here.
- SCR-PRJ-26 filter: by result only; loading and offline as SCR-PRJ-25.

**Criteria map:**
- AC 1: SCR-PRJ-25 default (list, authorisation line, project never authorises).
- AC 2: SCR-PRJ-25 totals.
- AC 3: SCR-PRJ-26 default.
- AC 4: SCR-PRJ-25 action hidden and SCR-PRJ-26 action hidden.
- AC 5: SCR-PRJ-25 visibility.
- AC 6: SCR-PRJ-25 empty and SCR-PRJ-26 empty (`prj.expenses.empty`, `prj.decisions.empty`).
- AC 7: SCR-PRJ-25 loading and offline.
- AC 8: SCR-PRJ-25 filter and SCR-PRJ-26 filter.
- AC 9: no UI, system rule beyond layout (screen-reader rows, single column at 320 px; reading not logged).
- AC 10: no UI, system rule (no notification sent by this story; EV-PRJ-06 is VOT-14).

**Objects and fields:** Expense request (requester, purpose, amount, status, authorisation line); Approval; Decision; Vote; Ledger entry (reference).

**Open points:**
- The story says EV-PRJ-06 is emitted by VOT-14 with key `msg.vot.decision_logged`; EV row prefix PRJ and key prefix vot disagree (see VOT-14).
- Which authorisation line shows for Approved, Paying, Paid and Rejected, Failed requests? Story gives three examples only. Not specified in the story.
- Key for the "status may have changed" note offline: not specified in the story.
- Does a project member with `Project: view` see a Draft of another person in any case? Story: Drafts only to their requester; consistent; closed.

---

### PRJ-06 Let the project follow the group's permissions, and narrow them when needed

**Story:** PRJ-06 Let the project follow the group's permissions, and narrow them when needed

**Surfaces:**
- SCR-PRJ-27 | "Who can do what" (every group member who can see the project, with an Effective access line in verbs and a source, `Inherited from the group` or `Narrowed on this project`; switch "Only the project team can see this project") | page | Holder of `Group: grant permission` and `Group: revoke permission` | Entry: "Who can do what" on SCR-PRJ-07 | Exit: SCR-PRJ-28, SCR-PRJ-07
- SCR-PRJ-28 | Narrow access sheet (removes a specific `Project` permission for a member on this project only; effect in words before saving; warning when the last approver is narrowed) | sheet | Same as SCR-PRJ-27 | Entry: member row on SCR-PRJ-27 | Exit: SCR-PRJ-27
- SCR-PRJ-29 | Notification: access changed (`msg.prj.access_changed.push`, plain-words change, no SMS) | notification | The affected member | Entry: system on narrowing or restoration | Exit: SCR-PRJ-07

**States per surface:**
- SCR-PRJ-27 default: new project shows everything inherited, `prj.access.inherited`.
- SCR-PRJ-27 narrowed: `Narrowed on this project` with the date and who did it; removing restores inherited access.
- SCR-PRJ-27 team only: switch "Only the project team can see this project".
- SCR-PRJ-27 forbidden: person without the grant and revoke permissions; not specified (the story has no view for others; GRP-09 effective access panel is a related surface).
- SCR-PRJ-27 refused: change would leave nobody who can edit or close; `prj.access.no_owner`.
- SCR-PRJ-28 default: for example "Rado will no longer be able to approve purchases on this project"; confirm to save; no vote, no PIN.
- SCR-PRJ-28 last approver warning: last holder of `Project: approve purchase` narrowed or revoked; requests would wait; use the vote conversion after `request_stuck_days` (SPD-13).
- SCR-PRJ-28 limits: narrowing cannot reduce approvals needed, cannot touch a Wallet permission, cannot grant access the member lacks on the group; a passed vote still authorises a payout (D4).
- SCR-PRJ-28 offline: not specified in the story.
- SCR-PRJ-29 default: `msg.prj.access_changed.push` with the plain-words change.
- Blocked action anywhere in the project (all project screens): names the missing permission and who can grant it, never a bare "Not allowed" (key not specified).

**Criteria map:**
- AC 1: SCR-PRJ-27 default (effective access lines, source).
- AC 2: SCR-PRJ-27 default (`prj.access.inherited`).
- AC 3: SCR-PRJ-28 default and last approver warning, SCR-PRJ-27 team only.
- AC 4: SCR-PRJ-27 narrowed.
- AC 5: SCR-PRJ-27 refused (`prj.access.no_owner`).
- AC 6: SCR-PRJ-28 limits.
- AC 7: blocked-action message on all project screens.
- AC 8: SCR-PRJ-29 default.
- AC 9: no UI, system rule (audit entries visible to `Group: view audit log`, GRP-10, GRP-11).

**Objects and fields:** Project (exclusion list, team-only flag); Membership; Permission grant; Audit entry.

**Open points:**
- PRJ-06 names `Project: approve purchase`; SPD approvals use `Wallet: approve spend`. How do the two relate for a project expense request? Not specified in the story.
- Does a member see their own narrowed access (an Effective access line for themselves)? GRP-09 owns the panel; not specified in this story.
- Does narrowing the view permission remove the project from the member's list and from notifications? Not specified in the story (PRJ-10 AC 3 says absent from the list).
- How does a narrowed member see a link to the project (forbidden versus `prj.error.not_visible`)? Not specified in the story.

---

### PRJ-07 Attach a file to a decision or an expense request

**Story:** PRJ-07 Attach a file to a decision or an expense request

**Surfaces:**
- SCR-PRJ-30 | File list and "Add a file" control (name, type, size, uploader, time; images open in place, PDFs open or download) | inline (on decision entries SCR-VOT-55, expense requests, announcement reports ANN-06) | Viewer of the parent item; adder holds `Vote: create` for decisions | Entry: parent item | Exit: SCR-PRJ-31
- SCR-PRJ-31 | Add a file (photo from camera or gallery, or PDF; compressed size shown before upload; max `ATTACHMENT_MAX_MB`, types `ATTACHMENT_TYPES`) | sheet | Person with the permission on the parent | Entry: "Add a file" | Exit: SCR-PRJ-30

On an expense request the button opens SPD-03 and every rule there applies.

**States per surface:**
- SCR-PRJ-30 default: attachments appended, never overwritten (VOT-15); visibility follows the parent, with no separate `Document: view`.
- SCR-PRJ-30 limit: `ATTACHMENTS_PER_ITEM` files reached; a further file refused with a clear message (key not specified).
- SCR-PRJ-30 removed: uploader removed their own file within `PROJECT_ATTACHMENT_UNDO_MINUTES`; record shows `File removed by {name}`; afterwards only through an amendment (VOT-15).
- SCR-PRJ-30 view denied: audit stores view-denied attempts; person sees a denied state (key not specified).
- SCR-PRJ-30 offline: a file on a decision is kept on the phone, `Waiting to send` (`xct.queue.waiting`), sent when connected, resumable; viewing offline only for files already opened on this phone.
- SCR-PRJ-30 expense request: notice to approvers `msg.spd.approval_attachment_added`; adding does not void approvals; removing or replacing counts as an edit (SPD-07).
- SCR-PRJ-31 default: final size shown before upload.
- SCR-PRJ-31 too large or wrong type: refused before upload with `prj.file.too_large` or `prj.file.type_not_allowed`; nothing sent.
- SCR-PRJ-31 upload failure: Retry, file kept.
- SCR-PRJ-31 safety check failed: `prj.file.rejected`; not stored.
- SCR-PRJ-31 hidden: without `Vote: create` on a decision, the control is not shown.

**Criteria map:**
- AC 1: SCR-PRJ-31 default (photo or PDF, compression, size before upload).
- AC 2: SCR-PRJ-31 too large or wrong type (`prj.file.too_large`, `prj.file.type_not_allowed`).
- AC 3: SCR-PRJ-30 default (name, type, size, uploader, time, open in place).
- AC 4: SCR-PRJ-30 limit.
- AC 5: SCR-PRJ-30 expense request (SPD-03 unchanged).
- AC 6: SCR-PRJ-30 removed and default.
- AC 7: SCR-PRJ-30 offline.
- AC 8: SCR-PRJ-31 upload failure and safety check failed (`prj.file.rejected`).
- AC 9: no UI, system rule (audit of add, remove, view-denied).

**Objects and fields:** Document (name, type, size, uploader, time, parent link); Decision; Expense request; Audit entry.

**Open points:**
- The story's open question: how long attachments are kept after a project or group closes (ACC open question 1); value cited meanwhile is `RECORD_RETENTION_YEARS` (5).
- Parameter name differs across files: this story and R156 write `ATTACHMENTS_PER_ITEM`, conventions Table A and VOT-14 write `PROJECT_ATTACHMENTS_PER_ITEM`. Which name is final?
- Key for the message when the item limit is reached: not specified in the story.
- Is a "view-denied" state visible to the person, or only audited? Not specified in the story.

---

### PRJ-08 Read a one-page summary of how the project is going

**Story:** PRJ-08 Read a one-page summary of how the project is going

**Surfaces:**
- SCR-PRJ-32 | Summary section (headline sentences; four figures: budget used against planned, tasks done against total, next milestone or deadline with relative time, waiting items; progress and how it is computed `prj.summary.progress_how`; overdue counts with links) | inline (first section of SCR-PRJ-07) | Member holding `Project: view` | Entry: SCR-PRJ-07 | Exit: each figure links to its section; waiting items link to the request or vote

**States per surface:**
- SCR-PRJ-32 default: headline sentences from message keys; four figures; each figure links to its section.
- SCR-PRJ-32 waiting items: open expense requests plus open votes not linked to a request; a request awaiting its vote counts once.
- SCR-PRJ-32 progress: tasks done divided by tasks total, stated by `prj.summary.progress_how`.
- SCR-PRJ-32 no tasks: says so and shows no percent.
- SCR-PRJ-32 overdue: overdue milestones and tasks counted with a link to each; `Late` shown when the deadline has passed.
- SCR-PRJ-32 empty project: `prj.summary.empty` and the next suggested action (add a budget or a first task), not zeros.
- SCR-PRJ-32 offline: from cache with `Last synced` and a note that numbers may be out of date; amounts older than `STALE_BALANCE_HOURS` carry the "may be outdated" mark.
- SCR-PRJ-32 loading: skeleton.
- SCR-PRJ-32 layout: one column at 320 px; amounts never clipped at 200% font size.
- SCR-PRJ-32 over budget: warning counts the amount plus the estimated fee (SPD-13).

**Criteria map:**
- AC 1: SCR-PRJ-32 default (headline sentences).
- AC 2: SCR-PRJ-32 default and waiting items (four figures).
- AC 3: SCR-PRJ-32 progress and no tasks (`prj.summary.progress_how`).
- AC 4: SCR-PRJ-32 overdue.
- AC 5: SCR-PRJ-32 default (links).
- AC 6: SCR-PRJ-32 empty project (`prj.summary.empty`).
- AC 7: SCR-PRJ-32 offline.
- AC 8: SCR-PRJ-32 loading and layout.
- AC 9: no UI, system rule (no audit for reading).

**Objects and fields:** Project; Task (counts, next milestone); Expense request (open count); Vote (open, unlinked); Ledger entry (read).

**Open points:**
- Which message keys form the headline sentences? Not specified in the story (only `prj.summary.progress_how` and `prj.summary.empty` are named).
- What does the "budget used" figure show when the project has no linked budget? Not specified in the story.
- How is "next milestone or deadline" chosen when the project has neither? Not specified in the story.

---

### PRJ-09 Close a project and keep its record

**Story:** PRJ-09 Close a project and keep its record

**Surfaces:**
- SCR-PRJ-33 | Close project sheet (lists what is still open with links; optional closing note; final figures planned, spent, difference; button `Close project`; `prj.close.no_money_moves`) | sheet | Holder of `Project: close` | Entry: "Close project" on SCR-PRJ-07 | Exit: SCR-PRJ-34
- SCR-PRJ-34 | Closing summary (frozen figures and note; read-only project) | inline (on SCR-PRJ-07 when Closed) | Member holding `Project: view` | Entry: SCR-PRJ-07 | Exit: SCR-PRJ-35 for `Project: close` holders
- SCR-PRJ-35 | Reopen confirmation | modal | Holder of `Project: close` | Entry: "Reopen" on SCR-PRJ-34 | Exit: SCR-PRJ-07 Active
- SCR-PRJ-36 | Notification: project closed (`msg.prj.closed.push`, EV-PRJ-07, result in plain words, no SMS) | notification | Team members | Entry: system on close | Exit: SCR-PRJ-34
- SCR-PRJ-37 | System: decision entry "Project closed by {name}" appended by VOT-13 (SCR-VOT-56) to the project and group logs, with the note and summary figures | system | none | Entry: close confirmed | Exit: SCR-VOT-55

**States per surface:**
- SCR-PRJ-33 default: lists open expense requests, open votes linked to the project and tasks not Done, each with a link; person writes an optional closing note and sees final figures.
- SCR-PRJ-33 blocked: open expense requests or open votes remain; refused with `prj.close.blocked` and the list; a vote linked to a request cannot be closed early, so it ends at its deadline or is cancelled with the request (SPD-12).
- SCR-PRJ-33 drafts and tasks: Draft requests do not block (SPD-13 criterion 7: detached); open tasks do not block, stay marked not Done.
- SCR-PRJ-33 personal project: the close check lists only open tasks, which never block (PRJ-12).
- SCR-PRJ-33 hidden: person without `Project: close`; action not shown.
- SCR-PRJ-33 loading and failure: not specified in the story.
- SCR-PRJ-33 offline: not specified in the story.
- SCR-PRJ-34 default: status Closed; frozen closing summary stored; read-only except viewing, attachments on existing items and the closing note; no new event link accepted (EVT-09).
- SCR-PRJ-35 default: reopen sets status Active, removes the frozen status, is an audit entry; earlier closing entry stays in the log; drafts detached at closing do not re-attach; no limit on reopenings.
- SCR-PRJ-36 default: `msg.prj.closed.push` to team members.
- SCR-PRJ-37 default: system entry marked as written by the system, no vote counts.

**Criteria map:**
- AC 1: SCR-PRJ-33 default (open items with links).
- AC 2: SCR-PRJ-33 blocked, drafts and tasks (`prj.close.blocked`).
- AC 3: SCR-PRJ-33 default (note, figures, `Close project`).
- AC 4: SCR-PRJ-34 default.
- AC 5: SCR-PRJ-33 default (`prj.close.no_money_moves`).
- AC 6: SCR-PRJ-37 default.
- AC 7: SCR-PRJ-36 default (`msg.prj.closed.push`).
- AC 8: SCR-PRJ-35 default.
- AC 9: no UI, system rule (audit of actor, time, note, final figures, items left open).

**Objects and fields:** Project (status, closing note, frozen figures); Expense request; Vote; Task; Decision; Audit entry; Notification.

**Open points:**
- What does the person see for an open request in Draft that is detached at close (form text `This request was part of a closed project`, SPD-13)? Not specified in this story.
- Behaviour when the close sheet is opened offline (blocked with `xct.offline.needs_connection`?): not specified in the story.
- The sheet lists open items possibly numerous; paging and long lists: not specified in the story.
- Who receives the closing notice if a team member lost view access? Not specified in the story.

---

### PRJ-10 List all the projects of a group

**Story:** PRJ-10 List all the projects of a group

**Surfaces:**
- SCR-PRJ-38 | Project list of a group (rows: name, owner, status chip, deadline in relative time, budget bar, waiting items count, `Late` marker; tabs or filter Active, On hold, Closed; search by name) | page | Member of the group with `Group: view group`; rows only for projects the person holds `Project: view` on | Entry: "Projects" in the group | Exit: SCR-PRJ-07, SCR-PRJ-01

**States per surface:**
- SCR-PRJ-38 default: Active projects sorted by deadline, nearest first, no date last.
- SCR-PRJ-38 On hold and Closed tabs: switch by tab or filter.
- SCR-PRJ-38 empty: `prj.list.empty` with "New project" if the person holds `Project: edit`, otherwise an explanation of who can create one.
- SCR-PRJ-38 hidden projects: a project the person cannot see is absent, with no placeholder row and no count.
- SCR-PRJ-38 late: `Late` marker for projects past their deadline and not Closed.
- SCR-PRJ-38 loading: skeleton rows; first `PROJECT_LIST_PAGE_SIZE` rows, more on scroll with a visible count.
- SCR-PRJ-38 offline: from cache with `Last synced`; opening a project follows PRJ-02 offline rules.
- SCR-PRJ-38 search: by project name on cached data; accents handled in Malagasy and French; no-match state not specified.
- SCR-PRJ-38 no budget: row shows no budget bar.
- SCR-PRJ-38 accessibility: rows are real links with 48 dp targets, status not by colour alone, amounts never clip at 200% font size.

**Criteria map:**
- AC 1: SCR-PRJ-38 default (row contents) and no budget.
- AC 2: SCR-PRJ-38 default and On hold and Closed tabs.
- AC 3: SCR-PRJ-38 hidden projects.
- AC 4: SCR-PRJ-38 empty (`prj.list.empty`).
- AC 5: SCR-PRJ-38 late.
- AC 6: SCR-PRJ-38 offline.
- AC 7: SCR-PRJ-38 loading.
- AC 8: SCR-PRJ-38 search.
- AC 9: SCR-PRJ-38 accessibility.

**Objects and fields:** Project (name, owner, status, deadline, budget figures, waiting count); Membership; Wallet (reference).

**Open points:**
- The list of a group with narrowed projects hides them silently; does a group-level count ("3 projects") elsewhere (group home) match? Not specified in the story.
- No-match state for the name search: key not specified in the story.
- Personal projects are listed on the individual's home (SCR-PRJ-40), not here; the home surface is outside this epic.

---

### PRJ-11 Follow the project as one timeline of tasks, requests and decisions

**Story:** PRJ-11 Follow the project as one timeline of tasks, requests and decisions

**Surfaces:**
- SCR-PRJ-39 | Timeline view (upcoming items above the history; entries with date and time, icon and text, who, link; grouping above `PROJECT_TIMELINE_GROUP_MIN`; filter by type remembered per project on that phone) | page (view of the project page, beside the sections) | Member holding `Project: view` | Entry: Timeline view on SCR-PRJ-07 | Exit: linked items

**States per surface:**
- SCR-PRJ-39 default: newest first entries for tasks created, done or overdue; milestones reached; requests submitted, approved, rejected, paid; decisions and votes opened and closed; events linked (EVT-09); files added.
- SCR-PRJ-39 upcoming: milestones, events, deadlines shown above the history in date order.
- SCR-PRJ-39 grouped: entries of the same kind on the same day grouped above `PROJECT_TIMELINE_GROUP_MIN`.
- SCR-PRJ-39 visibility: entries respect the PRJ-05 rule (no payee or approver names without `Wallet: view history`).
- SCR-PRJ-39 filtered: by type; remembered per project on this phone.
- SCR-PRJ-39 empty: `prj.timeline.empty` (precondition says at least one event exists).
- SCR-PRJ-39 offline: from cache with `Last synced`; older history loads when connected, first `PROJECT_LIST_PAGE_SIZE` entries first.
- SCR-PRJ-39 loading: not specified in the story.
- SCR-PRJ-39 read-only: written from existing events; creates no record.
- SCR-PRJ-39 accessibility: list in reading order; dates absolute with weekday; nothing only in an icon or colour.

**Criteria map:**
- AC 1: SCR-PRJ-39 default.
- AC 2: SCR-PRJ-39 default and visibility.
- AC 3: SCR-PRJ-39 grouped.
- AC 4: SCR-PRJ-39 upcoming.
- AC 5: SCR-PRJ-39 filtered.
- AC 6: SCR-PRJ-39 empty (`prj.timeline.empty`).
- AC 7: SCR-PRJ-39 offline.
- AC 8: SCR-PRJ-39 read-only.
- AC 9: SCR-PRJ-39 accessibility.

**Objects and fields:** Project; Task; Expense request; Decision; Vote; Event; Document; Audit entry (read).

**Open points:**
- Does the timeline show entries from before the member's access was narrowed or after a leave? Not specified in the story.
- Loading state of the first page and the "older history" prompt key: not specified in the story.
- Whether `Late` and On hold changes appear as timeline entries: not listed among the entry kinds.

---

### PRJ-12 Run a personal project on my own

**Story:** PRJ-12 Run a personal project on my own

**Surfaces:**
- SCR-PRJ-40 | Personal projects on the individual's home (list; "New project" from the person's own home) | inline (on the individual home, outside this epic) | The individual, private | Entry: individual home | Exit: SCR-PRJ-01 (personal mode), SCR-PRJ-07
- SCR-PRJ-41 | "For project" tag on a send (optional choice on a personal wallet send, immutable after the send; owned by WAL-09) | inline (on WAL-09 send form) | The individual | Entry: send form | Exit: send review (WAL-10)

Creation, project page, budget, tasks, summary and closing reuse SCR-PRJ-01, SCR-PRJ-07, SCR-PRJ-13, SCR-PRJ-14, SCR-PRJ-18, SCR-PRJ-32, SCR-PRJ-33 in personal mode.

**States per surface:**
- SCR-PRJ-40 default: personal projects only on the individual's own home, not in the group list; project stays private to the person.
- SCR-PRJ-40 empty: not specified in the story (precondition: person has at least one wallet).
- SCR-PRJ-01 personal mode: owner is the person and cannot be changed; no team.
- SCR-PRJ-14 personal mode: budget links to one of the person's own wallets; spent counts Expense and Fee lines of Confirmed sends carrying the "For project" tag minus Reversal lines with the same project_id; no group approval flow; the wallet's own PIN and limits apply.
- SCR-PRJ-18 personal mode: person is the only owner.
- SCR-PRJ-26 personal mode: decisions are manual entries only; section explains that no vote is available without a group.
- SCR-PRJ-07 personal mode: no move to a group offered; screen does not show one.
- SCR-PRJ-33 personal mode: lists only open tasks, which never block.
- SCR-PRJ-41 default: optional "For project" choice on a send; label on the ledger entry, not a rule; immutable after the send.
- SCR-PRJ-41 unavailable: if WAL-09 refuses the tag, PRJ-12 moves to Later and the choice does not exist.
- Empty states and offline behaviour follow the group project rules (SCR-PRJ-07 states).

**Criteria map:**
- AC 1: SCR-PRJ-01 personal mode.
- AC 2: SCR-PRJ-14 personal mode and SCR-PRJ-41 default.
- AC 3: SCR-PRJ-18 personal mode.
- AC 4: SCR-PRJ-26 personal mode.
- AC 5: SCR-PRJ-40 default and SCR-PRJ-07 personal mode.
- AC 6: SCR-PRJ-33 personal mode and SCR-PRJ-32.
- AC 7: SCR-PRJ-07 states reused (empty, offline).
- AC 8: no UI, system rule (same audit events as a group project).
- AC 9: no UI beyond group-version accessibility (identical).

**Objects and fields:** Project (user-owned); Wallet; Task; Decision (manual); Ledger entry (tag `project_id`); Audit entry.

**Open points:**
- Dependency on WAL-09 offering an immutable "For project" tag: not yet confirmed; if refused, the whole story moves to Later.
- How does a sent amount in a personal wallet appear when the tag is chosen after the fact (no edit allowed)? Not specified in the story.
- Does a personal project appear on any search or notification surface? Not specified in the story.
- Demand for personal projects needs field interviews (story open question).

## Epic summary

Stories: 12.
Distinct surfaces: 41 (inline 10, modal 3, notification 10, page 7, sheet 10, system 1).
State lines: 149.
Open points: 46.

All open points:

1. PRJ-01: AC 6 says creating a project is "never queued (XCT-05 Table C)"; conventions and D6 define only Table A and Table B. Which table or "Never queued" index is meant?
2. PRJ-01: Keys for the name and goal validation messages: not specified in the story.
3. PRJ-01: What does a member with `Project: view` but not `Project: edit` see where "New project" would be, hidden or a named reason (09 section 6.3 rules 3 and 4)? Story PRJ-10 AC 4 gives an explanation only on the empty list; elsewhere not specified.
4. PRJ-01: "Photo or initials" for owner: depends on ACC profile photo; not specified in this story.
5. PRJ-02: On hold "new expense requests and new tasks are still allowed unless the group decides otherwise": which setting lets the group decide and where? Not specified in the story.
6. PRJ-02: How is a person who cannot see the project distinguished from a project that does not exist (09 section 6.3 rule 6, GitHub pattern)? Story shows `prj.error.not_visible`, which confirms existence. Per object type decision not specified.
7. PRJ-02: Where is the optional on-hold reason entered, and its maximum length? Not specified in the story.
8. PRJ-02: Is "Timeline" a section or a view (PRJ-11 says beside the sections)? The section list of AC 3 omits it. Not specified in the story.
9. PRJ-02: Key and layout of the project history entries: not specified in the story.
10. PRJ-03: Who sees the Budget section (all with `Project: view`) when they lack `Wallet: view balance` on the linked wallet? Story shows the figures to every viewer; decision R152 and D2 do not state masking. Not specified in the story.
11. PRJ-03: Who sees the budget history (SCR-PRJ-15)? Not specified in the story.
12. PRJ-03: The key for "over budget on the request" is SPD-13; the exact warning text on the request is not specified here.
13. PRJ-03: Is `msg.prj.budget_near` also sent again after the plan is raised and crossed again? Story: once per crossing; whether a plan change re-arms is not specified.
14. PRJ-04: `msg.prj.task_overdue` and `msg.prj.team_added`, `msg.prj.owner_changed`, `msg.prj.access_changed` are "to be added by NTF" (Parameters). Are they in the NTF catalogue yet, with EV IDs? Not specified in the story.
15. PRJ-04: AC 4 says the owner gets `msg.prj.task_due.push` "once before the due date": at which offset? Not specified in the story.
16. PRJ-04: Quiet hours (NTF-09) for push of task reminders: not stated in this story.
17. PRJ-04: Can a task owner change only status, or also the notes (XCT-05 "note" row)? Not specified in the story.
18. PRJ-05: The story says EV-PRJ-06 is emitted by VOT-14 with key `msg.vot.decision_logged`; EV row prefix PRJ and key prefix vot disagree (see VOT-14).
19. PRJ-05: Which authorisation line shows for Approved, Paying, Paid and Rejected, Failed requests? Story gives three examples only. Not specified in the story.
20. PRJ-05: Key for the "status may have changed" note offline: not specified in the story.
21. PRJ-05: Does a project member with `Project: view` see a Draft of another person in any case? Story: Drafts only to their requester; consistent; closed.
22. PRJ-06: PRJ-06 names `Project: approve purchase`; SPD approvals use `Wallet: approve spend`. How do the two relate for a project expense request? Not specified in the story.
23. PRJ-06: Does a member see their own narrowed access (an Effective access line for themselves)? GRP-09 owns the panel; not specified in this story.
24. PRJ-06: Does narrowing the view permission remove the project from the member's list and from notifications? Not specified in the story (PRJ-10 AC 3 says absent from the list).
25. PRJ-06: How does a narrowed member see a link to the project (forbidden versus `prj.error.not_visible`)? Not specified in the story.
26. PRJ-07: The story's open question: how long attachments are kept after a project or group closes (ACC open question 1); value cited meanwhile is `RECORD_RETENTION_YEARS` (5).
27. PRJ-07: Parameter name differs across files: this story and R156 write `ATTACHMENTS_PER_ITEM`, conventions Table A and VOT-14 write `PROJECT_ATTACHMENTS_PER_ITEM`. Which name is final?
28. PRJ-07: Key for the message when the item limit is reached: not specified in the story.
29. PRJ-07: Is a "view-denied" state visible to the person, or only audited? Not specified in the story.
30. PRJ-08: Which message keys form the headline sentences? Not specified in the story (only `prj.summary.progress_how` and `prj.summary.empty` are named).
31. PRJ-08: What does the "budget used" figure show when the project has no linked budget? Not specified in the story.
32. PRJ-08: How is "next milestone or deadline" chosen when the project has neither? Not specified in the story.
33. PRJ-09: What does the person see for an open request in Draft that is detached at close (form text `This request was part of a closed project`, SPD-13)? Not specified in this story.
34. PRJ-09: Behaviour when the close sheet is opened offline (blocked with `xct.offline.needs_connection`?): not specified in the story.
35. PRJ-09: The sheet lists open items possibly numerous; paging and long lists: not specified in the story.
36. PRJ-09: Who receives the closing notice if a team member lost view access? Not specified in the story.
37. PRJ-10: The list of a group with narrowed projects hides them silently; does a group-level count ("3 projects") elsewhere (group home) match? Not specified in the story.
38. PRJ-10: No-match state for the name search: key not specified in the story.
39. PRJ-10: Personal projects are listed on the individual's home (SCR-PRJ-40), not here; the home surface is outside this epic.
40. PRJ-11: Does the timeline show entries from before the member's access was narrowed or after a leave? Not specified in the story.
41. PRJ-11: Loading state of the first page and the "older history" prompt key: not specified in the story.
42. PRJ-11: Whether `Late` and On hold changes appear as timeline entries: not listed among the entry kinds.
43. PRJ-12: Dependency on WAL-09 offering an immutable "For project" tag: not yet confirmed; if refused, the whole story moves to Later.
44. PRJ-12: How does a sent amount in a personal wallet appear when the tag is chosen after the fact (no edit allowed)? Not specified in the story.
45. PRJ-12: Does a personal project appear on any search or notification surface? Not specified in the story.
46. PRJ-12: Demand for personal projects needs field interviews (story open question).
