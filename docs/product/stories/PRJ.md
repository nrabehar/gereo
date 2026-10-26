# PRJ: Projects (light)

Epic code: PRJ. Release: MVP. Journey steps: 5 Decide, 6 Spend and 7 Follow. Format and rules: [00-conventions.md](../00-conventions.md). Founder decisions: [05-decisions.md](../05-decisions.md).

Evidence used in this file:

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 5 Notion, section 6 Odoo, section 7 task tools, section 8 Basecamp, section 13 sharing patterns, section 14.5 what to cut, section 14.6 risks 7 and 9.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline, section 8.4 approvals, section 8.5 permissions, section 8.6 projects.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.9 project page, section 6.11 permissions and sharing.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Projects light) and [design-foundations.md](../../research/design-foundations.md) section 4.

## Scope of the epic

In MVP: one fixed project template; project page (goal, owner, deadline, status, team); one budget linked to one group wallet with spent versus planned; tasks and milestones (title, owner, date, done); expense requests and decisions shown on the project; permissions inherited from the group and narrowable; basic attachments on decisions, and a project entry point to the receipt function of SPD-03; one summary page; close a project; project list per group.

Not in MVP: Gantt, task dependencies, custom fields, suppliers, purchase orders, resource planning and skills, document versioning and library, custom reports, forecasting, budget categories (closed: one total only), money reserved for a project (closed: tracked, not reserved), two-way calendar sync, moving a personal project to a group. The evidence is consistent: non-experts bounce off setup in Notion, Odoo, ERPNext and ClickUp, and Basecamp wins on simplicity (raw/04 sections 5 to 8 and 14.5). Gereo's gap to fill is budget, decisions and approvals on a Basecamp-sized scope.

## Founder decisions that touch this epic

- D1 and D4: a project never authorises spending. An expense request of a project is authorised exactly like any other request (SPD-13): by the approvals of its band, never by the requester, or by a passed vote, which replaces approvers. The project only shows the result.
- D2: the permissions used here are real catalogue names (Project: view, edit, manage budget, manage tasks, approve purchase, manage team, close; Vote: create; Group: grant permission, revoke permission; Wallet: view balance, view history, initiate spend). No project permission can narrow a Wallet permission.
- D3 and D5: a project budget is not a wallet rule and writes no ledger entry. Money that arrives in the linked wallet is income of the wallet, not funding of the project, and a split rounding line to Gereo is not project spending.

## Shared definitions for this epic

### Project statuses

A project has one stored status. Status is always shown as icon plus word, never colour alone.

| Status | Meaning |
| --- | --- |
| Active | Work is going on. Default at creation |
| On hold | Paused by a holder of Project: edit. New expense requests and new tasks are still allowed unless the group decides otherwise; a banner shows the pause |
| Closed | Finished (PRJ-09). Read-only except viewing, attachments on existing items and the closing note |

`Late` is a computed marker, not a status: the deadline has passed and the project is not Closed. It is the only place a project is called late.

### Task statuses

| Status | Meaning |
| --- | --- |
| To do | Not started. Default |
| Doing | Started. Set by the task owner or a holder of Project: manage tasks |
| Done | Finished. Records who and when |

`Overdue` is a computed marker on a task that is not Done and whose date is before today.

### Expense request statuses used here

The statuses are those of SPD (Draft, Awaiting vote, Awaiting approval, Needs changes, Approved, Paying, Paid, Failed, Rejected, Cancelled, Needs attention). This epic defines none of its own. For the budget:

- Spent counts requests that are Paid.
- Pending counts requests that are Awaiting vote, Awaiting approval, Approved, Paying, Needs attention, and Failed while the request keeps its authorisation (SPD-11).
- Draft, Needs changes, Rejected and Cancelled count as neither.
- Open means Awaiting vote, Awaiting approval, Needs changes, Approved, Paying, Failed or Needs attention. A Draft is never open for the project.

## Parameters

This epic defines each parameter below once. Parameters owned by other epics are named in the second table and are never redefined here. Defaults are working values to validate in field interviews and prototype tests, not research findings.

| Parameter | Meaning | Default |
| --- | --- | --- |
| PROJECT_ATTACHMENTS_PER_ITEM | Files per decision or per expense request (SPD-03 reads it) | 5 |
| PROJECT_ATTACHMENT_UNDO_MINUTES | Time during which the uploader can remove their own file from a decision | 15 |
| PROJECT_CREATE_TARGET_SECONDS | Usability target for creating a project, measured from tapping "New project" to seeing the project page | 60, from the risk list (raw/04 section 14.6 risk 7); measured in prototype tests, not guaranteed |
| PROJECT_NAME_MAX_CHARS | Longest project name | 60 |
| PROJECT_GOAL_MAX_CHARS | Longest goal sentence | 140 |
| PROJECT_BUDGET_ALERT_PERCENT | Share of the plan (spent plus pending) at which holders of Project: manage budget are alerted once | 80 |
| PROJECT_LIST_PAGE_SIZE | Rows loaded at first on the project list and the timeline | 20 |
| PROJECT_TIMELINE_GROUP_MIN | Entries of the same kind on the same day above which the timeline groups them | 5 |

| Need | Parameter | Owner |
| --- | --- | --- |
| Largest file after compression | `attachment_max_size` (5 MB) | SPD-03 |
| Accepted file types | `attachment_types` (JPEG, PNG, PDF) | SPD-03 |
| Age after which a cached amount is flagged "may be outdated" | `STALE_BALANCE_HOURS` (24) | XCT-04 |
| Retention of files and records | `RECORD_RETENTION_YEARS` | SPD-03, WAL |
| Overspend behaviour of a group wallet | `spend_cap_mode` and the cap rules | SPD-14, RUL-09 |
| Whether project requests must link a decision | `project_spend_requires_decision` | SPD-13, GRP-12 |

Message keys: UI `msg.prj.<area>.<name>`; notifications `msg.prj.<event>` with variants `.push` and `.inapp`, following the NTF registry (EV-PRJ-01 to EV-PRJ-07). Events this epic needs and the registry lacks, to be added by NTF: `msg.prj.team_added`, `msg.prj.owner_changed`, `msg.prj.access_changed`, `msg.prj.task_overdue`. No project event sends an SMS in the MVP. No text is written in this file.

---

### PRJ-01 Start a project from a ready-made template in about a minute

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: edit, held at group level (closed: there is no separate "create project" permission; permissions are inherited from the group, so a holder of Project: edit on the group can create projects in it)
**Tags:** audit

**Story:** As a member who runs an initiative for my group, I want to start a project from one fixed template by answering a few questions, so that I have a place to track the goal, the money and the decisions without learning a tool.

**Conversation:** Non-experts bounce off blank pages and complex setup (Notion "ton of options", Odoo consultants, ClickUp "overwhelming"), so the evidence asks for "a project in 60 seconds, not a blank canvas" (raw/04 sections 5, 6, 7 and 14.6 risk 7). There is one template only in the MVP and no custom fields (raw/04 section 14.5). The template already contains the sections the project needs: summary, budget, tasks, expenses, decisions, events, files. Decision: one template in the MVP, because a second one (purchase, ceremony) cannot be designed without field interviews and the template choice would add a step to a 60-second flow. Decision: Project: edit is the creation permission, since a new permission would change the catalogue for no safety gain (creating a project moves no money). GRP-08 must label it "Create and edit projects". Every MVP module is on for every group (GRP-18), so no module switch exists. We did not add suppliers, purchase orders or resource planning.

**Preconditions:** The person belongs to a group and holds the permission above.
**Trigger:** The person taps "New project" on the group's project list or the group home.

**Acceptance criteria:**
1. The creation form asks four things on one screen: name (required, at most PROJECT_NAME_MAX_CHARS), goal in one sentence (required, at most PROJECT_GOAL_MAX_CHARS), owner (prefilled with the creator, changeable to any member of the group), and target date (optional, with a visible "No date" choice). Nothing else is required.
2. After the four fields, one optional step offers "Add a budget" (PRJ-03) and "Add people to the team"; both can be skipped. The primary button is labelled `Create project`.
3. The new project opens on its project page (PRJ-02) with all template sections visible and empty, each with an empty-state sentence and one action.
4. The project is created with status Active, the creator and the owner on the team, and permissions inherited from the group (PRJ-06). The owner has no permission beyond those the group gave the person.
5. Usability target: in the prototype test with at least 5 participants on a low-end phone, the median time from tapping "New project" to seeing the project page is at most PROJECT_CREATE_TARGET_SECONDS. If it is higher the form is cut back, never extended.
6. States: the button is disabled while saving; on failure the form keeps its fields and shows `msg.prj.error.save_failed` with Retry. Creating a project is not on the offline queue registry (XCT-05): offline the button is disabled and the form shows `xct.offline.needs_connection`, and the typed fields stay on screen.
7. Errors: name empty or longer than the limit, goal empty or longer than the limit, and a date in the past (allowed only after a confirmation `msg.prj.create.past_date`) each show an inline message.
8. Notifications: the owner (if not the creator) and the team members added receive `msg.prj.team_added.push` and an in-app item; holders of Project: view receive the in-app item `msg.prj.created` (EV-PRJ-01, Low). No SMS (closed: project events never use SMS in the MVP).
9. Audit: creation, the owner and the team members added are written to the audit log with actor and time.

**Data:** Project, Group, Membership, Audit entry, Notification.
**Depends on:** GRP-06 (group home), GRP-08 (permission labels), NTF-01, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the creation permission is Project: edit (see Conversation). Closed: one template in the MVP; whether a second template is worth building is for field interviews after launch. Closed: an individual can create a project without a group (PRJ-12).

---

### PRJ-02 Open a project and see what it is about, who owns it and where it stands

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline, audit

**Story:** As a member, I want one project page that shows the goal, owner, deadline, status and team, so that I know what this project is and who to ask.

**Conversation:** A single summary page is the pattern to copy from Basecamp and from Chamasoft's project view (raw/08 section 6.9), and it replaces tools used for each need (info.md problem 5). The page must not turn into a project suite (raw/08 section 6.9 "Avoid"). Status values are deliberately few and listed in the shared table above. Editing is by a person with Project: edit; adding team members needs Project: manage team (PRJ-06 covers narrowing). Decision: no "Planning" status, because a project with no task simply shows an empty Tasks section. Decision: `Late` follows the deadline only; overdue milestones and tasks are counted in the summary (PRJ-08), not on the status.

**Preconditions:** The project exists and the person holds Project: view.
**Trigger:** The person opens a project from the list, a notification or a link.

**Acceptance criteria:**
1. The page header shows name, goal, owner (name and photo or initials), the deadline as an absolute date with a relative part following the rules of XCT-03 (for example `Fri 24 Oct (in 12 days)`), the status chip, and the team as a short list with a count and "See all".
2. Status is one of Active, On hold, Closed (shared table), plus the computed marker `Late`. Each has a word and an icon, never colour alone.
3. Below the header, the page shows the template sections in a fixed order with counts: Summary, Budget, Tasks, Expenses, Decisions, Events, Files.
4. A person with Project: edit can change name, goal, owner, deadline and put the project On hold or Active again. Each change shows what changed and is saved on confirmation.
5. Changing the owner notifies the old and new owner with `msg.prj.owner_changed.push` and records both.
6. Offline: the page opens from cache with a `Last synced` time (XCT-04); edit actions are disabled with an explanation, not queued. Read sections still work.
7. Errors: a project the person cannot see shows `msg.prj.error.not_visible` with who can grant access (never a bare "Not allowed"). A project that was closed shows its closing summary instead of edit actions.
8. States: loading shows a skeleton of the final layout; an On hold project shows a visible banner and the reason when one was entered (optional).
9. Audit: every change to a field is stored with before value, after value, actor and time and is visible in the project history.

**Data:** Project, Membership, Audit entry.
**Depends on:** PRJ-01, GRP-08, GRP-09, XCT-03, XCT-04, XCT-09 (status chip rules).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no Planning status. Closed: Late follows the deadline only.

---

### PRJ-03 Link a budget to one wallet and see spent against planned

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: manage budget, and Wallet: view balance on the chosen wallet
**Tags:** ledger, audit

**Story:** As a member who manages a project's money, I want to set a planned budget and link one wallet, so that everyone sees how much has been spent and how much is left, in real time.

**Conversation:** Budget and spending are what Basecamp lacks and what members ask for ("Where does the money go?"; info.md problem 8; raw/04 section 8). The MVP keeps one budget linked to one wallet, with no forecasting (raw/04 section 14.5). The project does not bypass the wallet's own rules: a project request is authorised by the approvals of its band or by a passed vote, exactly as any other request (SPD-13; D1 and D4), and the spent figure comes only from the ledger. Decisions: the plan is tracked, not reserved, because a reserve needs wallet-level states (WAL) and the Stanbic reserve pattern (raw/08 section 6.9) is a different product choice we do not copy in v1; therefore one wallet may fund several projects, each counting only its own requests. One total only, no categories, because categories add setup and the research asks for a Basecamp-sized scope. Overspending warns and does not block, as SPD-13 criterion 1 already says; a group that wants a lock sets a spending cap in block mode (SPD-14). Linking needs no consent from other people: it moves nothing and changes no wallet rule. The fee of a payout is part of what the project spent, because it left the wallet for this purpose.

**Preconditions:** A project exists in a group that owns at least one wallet.
**Trigger:** The person taps "Set budget" on the project page or in the creation form (PRJ-01).

**Acceptance criteria:**
1. The person enters a planned total in whole ariary (integer, no decimals, shown as `1 000 000 Ar`) and picks exactly one wallet among the wallets of this group they can view. A project has at most one linked wallet; a wallet may be linked to several projects.
2. The Budget section then shows planned, spent, pending and remaining in one sentence and one bar, for example `Spent 300 000 Ar of 1 000 000 Ar planned. 120 000 Ar waiting for approval. 580 000 Ar left.` The bar has a text equivalent.
3. Spent is the sum of the Expense and Fee ledger lines of Paid requests linked to this project, minus any Reversal lines that correct them (WAL-18). Pending is the sum of the requests counted as pending in the shared definitions above, with the estimated fee when known. Rejected, Cancelled, Draft and Needs changes requests are never counted.
4. When spent plus pending exceeds the plan, the page shows `msg.prj.budget.over` with the excess amount and keeps working. A new request that would exceed the plan shows the warning on the request (SPD-13) but is not blocked by the budget. When spent plus pending first reaches PROJECT_BUDGET_ALERT_PERCENT of the plan, holders of Project: manage budget receive `msg.prj.budget_near` (EV-PRJ-05) once per crossing.
5. The planned total can be changed by a holder of Project: manage budget; each change is kept in the budget history with who, when, old and new value. The wallet cannot be changed once one linked request is Paid; before that it can be changed with a confirmation, and requests that are already open keep following their own request (SPD-07 voids approvals when the wallet changes).
6. If the linked wallet is closed or the person loses wallet access, the Budget section shows `msg.prj.budget.wallet_unavailable`, new expense requests are blocked until a new wallet is linked, and open requests go to Needs attention with a reason (SPD-13 criterion 7).
7. Figures update when the ledger confirms an entry. Offline they show from cache with `Last synced` and the outdated mark of XCT-04; changing the budget is not possible offline.
8. Audit and ledger: the budget does not write ledger entries and moves no money; linking, unlinking and every change of the plan are audit entries. The wallet's own approval, cap and freeze rules are unchanged.
9. Accessibility and language: amounts use space grouping, never wrap and are never clipped at 200% font size (XCT-02, XCT-08), identical in Malagasy, French and English.

**Data:** Project, Wallet (reference), Ledger entry (read), Expense request (read), Audit entry.
**Depends on:** PRJ-01, PRJ-02, WAL-02, WAL-03, WAL-05 (closed wallet), WAL-18, SPD-07, SPD-11, SPD-13, SPD-14, GRP-08, XCT-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: tracked, not reserved. Closed: one wallet may fund several projects. Closed: one total, no categories. Closed: warn, do not block. Closed: linking needs no wallet owner consent.

---

### PRJ-04 Keep a short list of tasks and milestones

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: manage tasks. The task owner may also change the status of their own task without it (closed, see Conversation)
**Tags:** offline, audit

**Story:** As the project owner, I want to list what must be done, who does it and by when, and tick it when finished, so that the team knows the next step without a meeting.

**Conversation:** The minimal useful list is title, owner, date, done, and nothing more (raw/04 section 14.5). Gantt, dependencies and custom fields are cut (Notion, ClickUp and Trello complaints, raw/04 sections 5 to 7). Use statuses To do, Doing and Done with icons plus text in lists, and a vertical timeline, not horizontal tables (raw/07 section 8.6). A milestone is a task marked as a milestone, to keep one object. Decision: the owner of a task may change its status (To do, Doing, Done) without Project: manage tasks, because the person doing the work is the one who knows it is done and the action moves no money; every other change needs the permission. This is a product rule on one object, not a role. Decision: no Blocked status, because it duplicates the free text of a task. Decision: completing a milestone is shown in-app to project members (EV-PRJ-04); an overdue reminder is push only, never SMS, to keep SMS cost down (NTF-06).

**Preconditions:** A project exists, status Active or On hold.
**Trigger:** The person taps "Add a task" or "Add a milestone" in the Tasks section.

**Acceptance criteria:**
1. A task has title (required), owner (a team member, optional), date (optional) and a status (shared table). A milestone is a task with a date that is flagged as a milestone and shown in the timeline.
2. Tasks list with status chips (To do, Doing, Done), each with icon and text. Done tasks are collapsed by default and counted: `5 of 12 done`.
3. Marking done records who and when. Un-doing is allowed and is logged. When a milestone is marked done, project members receive the in-app item `msg.prj.milestone_done` (EV-PRJ-04).
4. A task with a date earlier than today and not Done shows `Overdue` with the number of days. When an owner is set, the owner receives `msg.prj.task_assigned` (EV-PRJ-02), `msg.prj.task_due.push` once before the due date (EV-PRJ-03) and `msg.prj.task_overdue.push` once after the date has passed. No SMS.
5. The task owner must be a member of the team; assigning someone not on the team offers to add them (needs Project: manage team) or is refused with `msg.prj.task.owner_not_team`.
6. Offline: creating, editing and changing the status of a task are on the queue registry (XCT-05) with the states `Saved on this phone`, `Waiting to send`, `Sent`. If two people changed the same field of the same task, the person sees both versions ("Your change versus Fanja's change") and chooses; nothing is silently overwritten (XCT-05 criterion 6).
7. Empty state: `msg.prj.tasks.empty` with a button to add a first task or milestone. A closed project shows tasks read-only.
8. Errors: empty title or an invalid date shows an inline message; a failed save keeps the task and shows Retry.
9. Audit: creation, edits, owner changes, date changes and status changes are stored with actor and time.

**Data:** Task, Project, Membership, Audit entry, Notification.
**Depends on:** PRJ-02, GRP-08 (team and permissions), NTF-05, NTF-06, XCT-05. The task create and task update actions must appear in the XCT-05 registry (it lists "task update and note" only).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the task owner may change the status of their own task. Closed: milestones notify project members in-app only. Closed: no Blocked status. Closed: no SMS for task dates.

---

### PRJ-05 See every expense request and decision that belongs to the project

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** ledger, audit

**Story:** When the group asks what happened to the money and what was decided for this project, I want to see its expense requests and decisions on the project page, so I can answer without leaving the project.

**Conversation:** The decision log attached to the project is the product's answer to forgotten meeting decisions (info.md problem 2), and spending shows how it was authorised, as in Open Collective's submit, approve, pay model (raw/04 section 3). The project page merges tasks, expense requests and decisions in one place and avoids more screens (raw/08 section 6.9). Detail screens belong to SPD and VOT; this story is the view and the entry points. Decision on visibility: a member who holds Project: view sees requester, purpose, amount and status of requests; payee name and approver names only with Wallet: view history; attachments, notes and reasons only as SPD-03 and SPD-16 allow. This is the rule SPD-16 criterion 5 already states and the project adds no second rule. Decision: group-wide decisions that belong to no project are not shown on the project; only the group log shows them.

**Preconditions:** The project exists; the person holds Project: view.
**Trigger:** The person opens the Expenses or Decisions section of the project page.

**Acceptance criteria:**
1. The Expenses section lists the project's requests newest first (Drafts only to their requester) with requester, purpose, amount, the SPD status chip (word, icon, colour) and an authorisation line: `2 of 3 approved` while Awaiting approval, `Vote open, closes Fri 17:00` while Awaiting vote, `Vote passed` once a vote authorised it. Tapping opens the SPD request detail.
2. Totals at the top reconcile with the Budget section (PRJ-03): the sum of Paid requests, with their fees, equals Spent, and the same wording is used.
3. The Decisions section lists decisions of this project from the decision log (VOT-13, VOT-14) newest first with title, result chip, date and a `Money moved` marker where a ledger entry exists. Tapping opens the log entry.
4. From each section the person can start the next action if they hold the permission: "New expense request" (Wallet: initiate spend, SPD-01), "Ask the group to vote" (Vote: create, VOT-01), "Record a decision" (Vote: create, VOT-14). Without the permission the button is hidden and a line names the missing permission and who can grant it.
5. Visibility follows the decision above: a member without Wallet: view history sees no payee and no approver names in the list.
6. Empty states: `msg.prj.expenses.empty` and `msg.prj.decisions.empty` each with one action or an explanation.
7. Loading shows skeleton rows. Offline the lists come from cache with `Last synced` and a note that status may have changed.
8. Filters: expenses by status; decisions by result. No other filters in the MVP.
9. Accessibility and language: status is never colour alone, the lists work in a screen reader row by row and in a single column at 320 px. Audit: reading is not logged.

**Data:** Project, Expense request, Approval, Decision, Vote, Ledger entry (reference).
**Depends on:** PRJ-02, PRJ-03, SPD-01, SPD-13, SPD-16, VOT-01, VOT-13, VOT-14, XCT-04, XCT-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: payee and approver names follow Wallet: view history (SPD-16). Closed: group-wide decisions are not shown on a project.

---

### PRJ-06 Let the project follow the group's permissions, and narrow them when needed

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Group founder
**Permission needed:** Group: grant permission and Group: revoke permission, applied to this project (closed)
**Tags:** audit

**Story:** As the group founder or a member who grants permissions, I want the project to start with the group's permissions and let me remove some for this project only, so that a sensitive project is not open to everyone.

**Conversation:** Permissions are inherited from group to project to document (conventions section 2; info.md Permissions). Research shows users cannot read lists of rules and that an "Effective access" view beats a rule list (83.6% against 56.5% accuracy, raw/07 section 8.5 R-PM2) and that Drive makes inherited access unreducible, a pattern to avoid (raw/04 section 13). So inheritance is shown visibly with an explicit override, and effective access is shown per member (raw/08 section 6.11, GRP-09). Narrowing only removes access: it never adds power over what the group gave, it never lowers the approvals needed for a spend, and it applies to Project permissions only. Decisions: narrowing needs the same permissions as granting on the group, because the grantors already own access control; it needs no vote and no PIN, because it can only reduce power and moves no money (granting a money-out permission keeps the PIN of GRP-08); Wallet permissions are not narrowable per project, because the wallet owns them. Engineering decision: narrowing is stored as an exclusion list on the project and checked in product logic after the permission engine allows the action (allowed by the group and not excluded on the project), so the MVP does not depend on the engine expressing exclusions. "Preview as member" (raw/07 R-PM6) is not in the MVP.

**Preconditions:** A project exists and the person can grant and revoke permissions on the group.
**Trigger:** The person opens "Who can do what" on the project.

**Acceptance criteria:**
1. The page lists every group member who can see the project with an Effective access line in verbs (see, edit, manage budget, manage tasks, approve a purchase, manage the team, close), and for each the source: `Inherited from the group` or `Narrowed on this project`.
2. A new project starts with everything inherited and the page says so (`msg.prj.access.inherited`).
3. A holder of the permissions can narrow: remove a specific Project permission for a member on this project only, or switch "Only the project team can see this project". The sheet shows the effect in words before saving, for example "Rado will no longer be able to approve purchases on this project", and warns when nobody would remain able to give the project approval of SPD-13 (requests above the approval band would then need a vote).
4. Narrowing never changes the member's group permissions. Removing it later restores the inherited access; the page shows `Narrowed on this project` with the date and who did it.
5. A project must always have at least one person who can edit and one who can close it; a change that would leave none is refused with `msg.prj.access.no_owner`.
6. Narrowing cannot reduce the number of approvals needed for a spend, cannot touch a Wallet permission and cannot grant a member access they do not have on the group. A passed vote still authorises a project payout (D4), whatever was narrowed.
7. A blocked action anywhere in the project names the missing permission and who can grant it (never a bare "Not allowed").
8. Notifications: the affected member receives `msg.prj.access_changed.push` with the plain-words change; no SMS.
9. Audit: every narrowing and restoration is an audit entry (actor, member, permission, time) visible to members who may view permissions (GRP-10, GRP-11).

**Data:** Project, Membership, Permission grant, Audit entry.
**Depends on:** PRJ-02, GRP-08, GRP-09, GRP-10, GRP-11, NTF-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: narrowing needs Group: grant permission and Group: revoke permission. Closed: no vote and no PIN to narrow. Closed: exclusions are product logic. Closed: Preview as member is not in the MVP.

---

### PRJ-07 Attach a file to a decision or an expense request

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Vote: create (decisions, as VOT-14 and VOT-15). For an expense request the rules of SPD-03 apply and this story only adds the entry point from the project
**Tags:** offline, audit

**Story:** As a member, I want to attach a photo or a PDF to a decision or an expense request, so that the proof, the quote or the minutes stay with the record.

**Conversation:** The MVP replaces a document library with attachments on decisions and expense requests, with no versions (raw/04 section 14.5; competitive-analysis section 7). The approval card shows attached evidence such as a receipt photo (raw/07 section 8.4 R-AP1). Data cost matters (about 5 Ar per MB in the research, design-foundations section 1), so the size is visible before upload. One owner per rule: SPD-03 owns everything about files on an expense request (permission, privacy, voiding of approvals, notices, file limits); this story owns files on decisions and the shared item limit PROJECT_ATTACHMENTS_PER_ITEM. Decision: attaching to a decision needs Vote: create, the permission that records and amends decisions, so that the people who write the decision can add the minutes; the Document permissions stay unused in the MVP. Decision: a file on a decision cannot be deleted, because the record must stay complete (VOT-15); the uploader can undo a mistaken upload for PROJECT_ATTACHMENT_UNDO_MINUTES and a mark stays. Decision: visibility of a file follows its parent, with no separate Document: view.

**Preconditions:** The person can view the decision or request and holds the permission for it.
**Trigger:** The person taps "Add a file" on a decision entry, or on an expense request from the project (which opens SPD-03).

**Acceptance criteria:**
1. The person picks a photo (camera or gallery) or a PDF. The app compresses photos on the phone and shows the final size before upload, with the maximum `attachment_max_size` and the allowed `attachment_types` (owned by SPD-03).
2. Files that are too large or of a type not allowed are refused with `msg.prj.file.too_large` or `msg.prj.file.type_not_allowed` before upload, and nothing is sent.
3. The attachment shows name, type, size, uploader and time; images open in place and PDFs open or download on tap.
4. Up to PROJECT_ATTACHMENTS_PER_ITEM files per decision or request. A further file is refused with a clear message.
5. Expense request: the button opens SPD-03 and every rule there applies unchanged, including who may see the file, the notice to approvers (`msg.spd.approval.attachment_added`), the rule that adding does not void approvals and that removing or replacing counts as an edit (SPD-07).
6. Decision: attachments are appended, never overwritten (VOT-15). The uploader may remove their own file for PROJECT_ATTACHMENT_UNDO_MINUTES after upload; the record then shows `File removed by {name}` instead of vanishing. After that a file leaves the record only through an amendment (VOT-15).
7. Offline: a file on a decision is kept on the phone with `Saved on this phone` then `Waiting to send`, sent when connected, resumable after an interruption (the action "decision attachment upload" must be added to the XCT-05 registry; the expense attachment is already there). Viewing a file offline works only for files already opened on this phone.
8. Errors: upload failure shows Retry and keeps the file; a file that fails the safety check shows `msg.prj.file.rejected` and is not stored.
9. Audit: add, remove and view-denied attempts are stored with actor and time.

**Data:** Document, Decision, Expense request, Audit entry.
**Depends on:** VOT-13, VOT-14, VOT-15, SPD-03, SPD-07, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: size and types are `attachment_max_size` and `attachment_types` (SPD-03). Closed: no separate Document: view. Open, needs a lawyer and owned by SPD-03: how long files are kept after a project or group closes; default used here: `RECORD_RETENTION_YEARS` (5), never deleted earlier.

---

### PRJ-08 Read a one-page summary of how the project is going

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline

**Story:** When I open a project before a meeting, I want a short summary of progress, money and what is waiting, so I know the state in under a minute.

**Conversation:** v1 reporting is one page per project: budget used against planned, open decisions, next dates; no custom reports (raw/04 section 14.5). The group dashboard works as headline sentences plus a ranked list with percent bars (design-foundations section 4). A short summary of four figures is borrowed from YNAB's month summary (raw/08 section 6.9). Progress is computed from tasks, not typed by hand, to stay honest. Decision: no free-text status update by the owner, because the decision log already carries text. Decision: no "Share summary" as text, because it would leak budget outside the group.

**Preconditions:** The person holds Project: view.
**Trigger:** The person opens the Summary section (first on the project page).

**Acceptance criteria:**
1. The summary opens with headline sentences built from message keys, for example the number of tasks done, the next milestone and date, the budget used.
2. It shows four figures: budget used against planned (from PRJ-03), tasks done against total (from PRJ-04), next milestone or deadline with relative time, and waiting items. Waiting items are expense requests that are open (shared definitions) plus open votes that are not linked to a request; a request awaiting its vote counts once.
3. Progress is tasks done divided by tasks total, and the page states how it is computed (`msg.prj.summary.progress_how`). With no tasks the page says so and shows no percent.
4. Overdue milestones and tasks are counted with a link to each, and the project shows `Late` when the deadline has passed (PRJ-02).
5. Each figure links to its section; waiting items link to the request or vote.
6. Empty project: the summary shows `msg.prj.summary.empty` and the next suggested action (add a budget or a first task), not zeros.
7. Offline: the summary opens from cache with `Last synced` and a note that numbers may be out of date; amounts older than `STALE_BALANCE_HOURS` carry the "may be outdated" mark (XCT-04).
8. Loading uses a skeleton; the page reflows in one column at 320 px and amounts are never clipped at 200% font size.
9. Audit: none for reading.

**Data:** Project, Task, Expense request, Vote, Ledger entry (read).
**Depends on:** PRJ-03, PRJ-04, PRJ-05, VOT-05, XCT-04, XCT-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no written status update. Closed: no share-as-text of the summary.

---

### PRJ-09 Close a project and keep its record

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: close
**Tags:** audit, ledger

**Story:** As the project owner, I want to close a finished project and leave a closing note, so that the group sees how it ended and nothing is left hanging.

**Conversation:** A project that is never closed keeps showing spent versus planned and open items forever. The closing summary is the final snapshot for the next meeting, and no money is moved by closing (the budget is not a reserve, PRJ-03). Closing records a line in the decision log so there is a trail (raw/04 section 14.3 audit principle). Decisions: closing needs no vote above any amount, because it moves no money and can be reversed; reopening is allowed at any time by a holder of Project: close, with no limit on the number of reopenings, because every reopening is logged and a limit would trap a group that closed by mistake.

**Preconditions:** The person holds Project: close. The project is Active or On hold.
**Trigger:** The person taps "Close project".

**Acceptance criteria:**
1. The close sheet checks and lists what is still open: expense requests that are open (shared definitions), open votes linked to the project, tasks not Done. Each item has a link.
2. Open expense requests and open votes must be resolved or cancelled before closing; the sheet refuses with `msg.prj.close.blocked` and shows the list. A vote linked to a request cannot be closed early (VOT-03), so it is resolved at its deadline or cancelled with the request (SPD-12). Draft requests do not block: they are detached from the project and stay with their requester. Open tasks do not block: they stay marked not Done.
3. The person writes an optional closing note (what was achieved, what remains) and sees the final figures (planned, spent, difference) before confirming with a button labelled `Close project`.
4. On confirmation the status becomes Closed, a frozen closing summary is stored, and the project becomes read-only except for viewing, attachments on existing items and the closing note.
5. Unspent money stays in the wallet; closing creates no ledger entry. The sheet says so in words (`msg.prj.close.no_money_moves`).
6. A decision-log entry "Project closed by {name}" is appended automatically (a system entry of VOT-13, with the note and summary figures) and shows in the group log.
7. Team members receive `msg.prj.closed.push` (EV-PRJ-07) with the result in plain words; no SMS.
8. A holder of Project: close can reopen a closed project; reopening sets the status back to Active, removes the frozen status, is an audit entry, and the earlier closing entry stays in the log.
9. Audit: the actor, time, note, final figures and any items left open are stored.

**Data:** Project, Expense request, Vote, Task, Decision, Audit entry, Notification.
**Depends on:** PRJ-02, PRJ-03, PRJ-04, PRJ-05, VOT-03, VOT-13, SPD-12, SPD-13, NTF-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no automatic release of unspent budget, because nothing is reserved. Closed: closing needs no vote. Closed: reopening has no limit and is logged.

---

### PRJ-10 List all the projects of a group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view (per project); Group: view group
**Tags:** offline

**Story:** As a member, I want one list of my group's projects with their status and money, so that I can find the one I care about and see which are late.

**Conversation:** A flat list stays within the "no project suite" limit and the four-item bottom navigation (design-foundations section 4; raw/04 section 14.5). Project visibility respects PRJ-06 narrowing, so the list shows only what the person may see. Decision: the group list shows group projects only; personal projects (PRJ-12) are listed on the individual's own home.

**Preconditions:** The person belongs to the group.
**Trigger:** The person opens "Projects" in the group.

**Acceptance criteria:**
1. Each row shows name, owner, status chip, deadline in relative time, budget bar (spent of planned, when a budget exists) and the number of waiting items (as counted in PRJ-08).
2. The default view is Active projects, sorted by deadline (nearest first, no date last). Tabs or a filter switch to On hold and Closed.
3. A project the person cannot see is absent, with no placeholder row and no count.
4. Empty state: `msg.prj.list.empty` with a "New project" button if the person holds Project: edit (PRJ-01), otherwise an explanation of who can create one.
5. The list shows the Late marker for projects past their deadline and not Closed.
6. Offline: the list comes from cache with `Last synced`; opening a project follows PRJ-02 offline rules.
7. Loading shows skeleton rows; the first PROJECT_LIST_PAGE_SIZE rows load first and more load on scroll with a visible count.
8. Search by project name works on cached data and handles accents in Malagasy and French.
9. Accessibility and language: rows are real links with 48 dp targets, status is never colour alone, amounts never clip at 200% font size.

**Data:** Project, Membership, Wallet (reference for budget bar).
**Depends on:** PRJ-01, PRJ-02, PRJ-03, PRJ-06, GRP-06, XCT-04, XCT-09.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: personal projects are listed separately on the individual's home, not in the group list.

---

### PRJ-11 Follow the project as one timeline of tasks, requests and decisions

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline

**Story:** When I come back to a project after some days, I want to see what happened in order, so I can catch up without opening every section.

**Conversation:** The only gap identified on the project page is one timeline that merges tasks, expense requests and decisions (raw/08 section 6.9 "Open opportunities", unverified). Use a simple vertical timeline with date, event and who, icon and text, no horizontal scroll, completed items collapsed (raw/07 section 8.6). No Gantt. Decision: the timeline sits beside the Tasks, Expenses and Decisions sections as another view, and replaces none of them in the MVP, because removing the sections would need test evidence we do not have; a prototype test may later show that it can replace them. What each entry reveals follows PRJ-05 (payee and approver names, attachments).

**Preconditions:** The project has at least one event to show.
**Trigger:** The person opens the Timeline view of the project.

**Acceptance criteria:**
1. The timeline lists, newest first, entries for: tasks created, done or overdue; milestones reached; expense requests submitted, approved, rejected and paid (SPD status changes); decisions and votes opened and closed; events linked to the project (EVT-09); files added.
2. Each entry shows date and time, an icon with text, who did it and a link to the item. Entries respect the visibility rule of PRJ-05.
3. Entries of the same kind on the same day are grouped when there are more than PROJECT_TIMELINE_GROUP_MIN.
4. Upcoming items (milestones, events, deadlines) are shown above the history in date order.
5. The person can filter by type; the filter is remembered per project on that phone.
6. Empty state: `msg.prj.timeline.empty`.
7. Offline: loaded from cache with `Last synced`; older history loads when connected, the first PROJECT_LIST_PAGE_SIZE entries first.
8. The timeline is read-only and written from existing events; it creates no new record.
9. Accessibility and language: the timeline is a list in reading order; dates are absolute with weekday; no information is only in an icon or colour.

**Data:** Project, Task, Expense request, Decision, Vote, Event, Document, Audit entry (read).
**Depends on:** PRJ-04, PRJ-05, PRJ-07, EVT-09, VOT-13, SPD-13, XCT-03, XCT-04.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the timeline sits beside the sections in the MVP.

---

### PRJ-12 Run a personal project on my own

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Individual
**Permission needed:** none (own entity)
**Tags:** ledger, audit

**Story:** As an individual, I want to start a project of my own, with a goal, a budget linked to one of my wallets and a few tasks, so that I can follow a personal plan like building a house or starting a business.

**Conversation:** The object model lets a project belong to a user or a group (info.md, Projet). The personal path uses the same template and sections with a team of one. There is no vote and no approval, since there is no group; a decision is a manual entry. Research did not test the individual path, so it is the least certain story of the epic (raw/08 section 6.9 and raw/04 section 14.5 cover groups only). Decisions: the story stays in the MVP at P2, and is the first story cut if the release slips; a personal project cannot be moved to a group in the MVP, because its history, spending and permissions would have to be re-owned; the person starts a new group project instead. A personal wallet has no expense requests (WAL-09 sends money directly), so spent is computed from sends the person tags with the project when sending: WAL-09 must offer an optional "For project" choice on a send (the tag is a label on the ledger entry, not a rule).

**Preconditions:** The person has an account and at least one wallet for the budget link.
**Trigger:** The person taps "New project" from their own home.

**Acceptance criteria:**
1. The same four-field creation (PRJ-01) is used; the owner is the person and cannot be changed to someone else (no team).
2. The budget links to one of the person's own wallets and works as PRJ-03, with spent counted from the Confirmed sends and fees tagged with the project (and corrected by reversals); there is no group approval flow, and the wallet's own PIN and limits apply (WAL-10).
3. Tasks and milestones work as PRJ-04, with the person as the only owner.
4. Decisions are manual entries only (VOT-14 without vote links); the Decisions section explains that no vote is available without a group.
5. The project stays private to the person. There is no move to a group in the MVP and the screen does not offer one.
6. Closing and the summary follow PRJ-08 and PRJ-09; the close check lists only open tasks, which never block.
7. Empty states and offline behaviour follow the group project rules.
8. Audit entries record the same events as a group project.
9. Accessibility and language: identical to the group version.

**Data:** Project (user-owned), Wallet, Task, Decision, Audit entry.
**Depends on:** PRJ-01, PRJ-03, PRJ-04, PRJ-08, PRJ-09, WAL-09, WAL-10, ACC-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no move from personal to group in the MVP. Closed: the personal path stays in the MVP at P2, first to be cut. Open, needs field interviews: whether individuals want projects at all; default used: build it last and measure use.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| PRJ-01 | Start a project from a ready-made template in about a minute | P0 | GRP-06, GRP-08, NTF-01, XCT-05 |
| PRJ-02 | Open a project and see what it is about, who owns it and where it stands | P0 | PRJ-01, GRP-08, GRP-09, XCT-03, XCT-04, XCT-09 |
| PRJ-03 | Link a budget to one wallet and see spent against planned | P0 | PRJ-01, PRJ-02, WAL-02, WAL-03, WAL-05, WAL-18, SPD-07, SPD-11, SPD-13, SPD-14, GRP-08, XCT-04 |
| PRJ-04 | Keep a short list of tasks and milestones | P1 | PRJ-02, GRP-08, NTF-05, NTF-06, XCT-05 |
| PRJ-05 | See every expense request and decision that belongs to the project | P0 | PRJ-02, PRJ-03, SPD-01, SPD-13, SPD-16, VOT-01, VOT-13, VOT-14, XCT-04, XCT-09 |
| PRJ-06 | Let the project follow the group's permissions, and narrow them when needed | P1 | PRJ-02, GRP-08, GRP-09, GRP-10, GRP-11, NTF-04 |
| PRJ-07 | Attach a file to a decision or an expense request | P1 | VOT-13, VOT-14, VOT-15, SPD-03, SPD-07, XCT-05 |
| PRJ-08 | Read a one-page summary of how the project is going | P1 | PRJ-03, PRJ-04, PRJ-05, VOT-05, XCT-04, XCT-08 |
| PRJ-09 | Close a project and keep its record | P1 | PRJ-02 to PRJ-05, VOT-03, VOT-13, SPD-12, SPD-13, NTF-01 |
| PRJ-10 | List all the projects of a group | P1 | PRJ-01, PRJ-02, PRJ-03, PRJ-06, GRP-06, XCT-04, XCT-09 |
| PRJ-11 | Follow the project as one timeline of tasks, requests and decisions | P2 | PRJ-04, PRJ-05, PRJ-07, EVT-09, VOT-13, SPD-13, XCT-03, XCT-04 |
| PRJ-12 | Run a personal project on my own | P2 | PRJ-01, PRJ-03, PRJ-04, PRJ-08, PRJ-09, WAL-09, WAL-10, ACC-02 |

Count: 12 stories. P0: 4 (PRJ-01, PRJ-02, PRJ-03, PRJ-05). P1: 6 (PRJ-04, PRJ-06 to PRJ-10). P2: 2 (PRJ-11, PRJ-12).

## Cross-epic dependencies

- ACC: signed-in session and individual account for PRJ-12 (ACC-02 is the sign-up that creates the individual account).
- WAL: group wallet list for the budget link (WAL-02, WAL-03), closed wallet state (WAL-05), reversing entries (WAL-18), and an optional "For project" tag on a send (WAL-09) for PRJ-12.
- RUL: none. A project budget is not a wallet rule and no rule is created by a project.
- GRP: Project: edit as the creation permission and its label (GRP-08), effective access panel (GRP-09), access change history (GRP-10), audit log (GRP-11), group home (GRP-06). Every MVP module is on for every group (GRP-18), so no module switch is used.
- CON: none in the MVP. Linking a contribution plan or a campaign (ANN-04) to a project's funding is not in the MVP; income into the linked wallet is income of the wallet (D3), not project funding.
- SPD: expense request create, list, detail, statuses and wording (SPD-01, SPD-13), file rules on requests (SPD-03), visibility (SPD-16), cancel (SPD-12), spending cap (SPD-14).
- VOT: decision log entries (VOT-13), manual entries (VOT-14), amendments with attachments (VOT-15), open-vote counts (VOT-05), linked-vote rules (VOT-03), vote creation (VOT-01).
- EVT: EVT-09 links events to projects (PRJ-11).
- NTF: registry rows EV-PRJ-01 to EV-PRJ-07 plus the four events listed in Parameters; quiet hours (NTF-09).
- XCT: offline queue registry (XCT-05), `Last synced` and outdated marks (XCT-04), date rules (XCT-03), status chip rules (XCT-09), 200% text (XCT-08).
- OPS: none in the MVP beyond support for lost project access.

## Open questions

1. Closed: creating a project needs Project: edit at group level; narrowing needs Group: grant permission and Group: revoke permission (PRJ-01, PRJ-06).
2. Closed: the budget is tracked and not reserved; one wallet may fund several projects; one total, no categories; overspend warns and does not block; the fee counts as spent; linking needs no consent (PRJ-03).
3. Closed: narrowing is an exclusion list checked in product logic, with no dependency on the permission engine (PRJ-06).
4. Closed: one template in the MVP (PRJ-01). A second template for purchases or ceremonies is for field interviews after launch and does not block anything.
5. Closed: a task owner may change the status of their own task without Project: manage tasks (PRJ-04).
6. Closed: attachment size and types are those of SPD-03, the count per item is PROJECT_ATTACHMENTS_PER_ITEM (PRJ-07). Open, needs a lawyer and owned by SPD-03: retention of files after a project or group closes; default used: `RECORD_RETENTION_YEARS` (5).
7. Closed: no move from personal to group in the MVP; the personal path stays at P2 and is the first cut (PRJ-12). Open, needs field interviews: demand for personal projects.
8. Closed: the timeline sits beside the sections (PRJ-11).
9. Closed: no SMS for task dates or any other project event in the MVP (PRJ-04, NTF-06).
