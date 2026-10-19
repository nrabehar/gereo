# PRJ: Projects (light)

Epic code: PRJ. Release: MVP. Journey steps: 5 Decide, 6 Spend and 7 Follow. Format and rules: [00-conventions.md](../00-conventions.md).

Evidence used in this file:

- [04-projects-voting-governance.md](../../research/raw/04-projects-voting-governance.md) (raw/04): section 5 Notion, section 6 Odoo, section 7 task tools, section 8 Basecamp, section 13 sharing patterns, section 14.5 what to cut, section 14.6 risks 7 and 9.
- [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) (raw/07): section 4 offline, section 8.4 approvals, section 8.5 permissions, section 8.6 projects.
- [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) (raw/08): section 6.9 project page, section 6.11 permissions and sharing.
- [competitive-analysis.md](../../research/competitive-analysis.md) section 7 (Projects light) and [design-foundations.md](../../research/design-foundations.md) section 4.

## Scope of the epic

In MVP: one fixed project template; project page (goal, owner, deadline, status, team); one budget linked to one wallet with spent versus planned; tasks and milestones (title, owner, date, done); expense requests and decisions shown on the project; permissions inherited from the group and narrowable; basic attachments on decisions and expense requests; one summary page; close a project; project list per group.

Not in MVP: Gantt, task dependencies, custom fields, suppliers, purchase orders, resource planning and skills, document versioning and library, custom reports, forecasting, budget categories (open question), two-way calendar sync. The evidence is consistent: non-experts bounce off setup in Notion, Odoo, ERPNext and ClickUp, and Basecamp wins on simplicity (raw/04 sections 5 to 8 and 14.5). Gereo's gap to fill is budget, decisions and approvals on a Basecamp-sized scope.

## Parameters

| Parameter | Meaning | Starting hypothesis |
| --- | --- | --- |
| PROJECT_ATTACHMENT_MAX_MB | Largest single file | To decide, low because of data cost |
| PROJECT_ATTACHMENT_TYPES | Allowed file types | Images and PDF, to confirm |
| PROJECT_ATTACHMENTS_PER_ITEM | Files per decision or expense request | To decide |
| PROJECT_CREATE_TARGET_SECONDS | Usability target for creating a project | About 60 seconds, from the risk list (raw/04 section 14.6 risk 7); measured in prototype tests, not guaranteed |

Message keys: UI `project.<area>.<name>`; notifications `ntf.project.<name>.push` and `.sms`. No text is written in this file.

---

### PRJ-01 Start a project from a ready-made template in about a minute

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Group: edit group (to confirm, there is no "create project" permission) and the Projects module enabled for the group
**Tags:** audit

**Story:** As a member who runs an initiative for my group, I want to start a project from one fixed template by answering a few questions, so that I have a place to track the goal, the money and the decisions without learning a tool.

**Conversation:** Non-experts bounce off blank pages and complex setup (Notion "ton of options", Odoo consultants, ClickUp "overwhelming"), so the evidence asks for "a project in 60 seconds, not a blank canvas" (raw/04 sections 5, 6, 7 and 14.6 risk 7). There is one template only in the MVP and no custom fields (raw/04 section 14.5). The template already contains the sections the project needs: summary, budget, tasks, expenses, decisions, events, files. Whether to offer more than one template is an open question. We did not add suppliers, purchase orders or resource planning.

**Preconditions:** The person belongs to a group with the Projects module enabled and holds the permission above.
**Trigger:** The person taps "New project" on the group's project list or the group home.

**Acceptance criteria:**
1. The creation form asks four things on one screen: name (required), goal in one sentence (required), owner (prefilled with the creator, changeable to any member), and target date (optional, with a visible "No date" choice). Nothing else is required.
2. After the four fields, one optional step offers "Add a budget" (PRJ-03) and "Add people to the team"; both can be skipped. The primary button is labelled `Create project`.
3. The new project opens on its project page (PRJ-02) with all template sections visible and empty, each with an empty-state sentence and one action.
4. The project is created with status Active, the creator and owner on the team, and permissions inherited from the group (PRJ-06).
5. Creating takes no more than the usability target PROJECT_CREATE_TARGET_SECONDS in the prototype tests on a low-end phone; if median time exceeds it the form is cut back, never extended.
6. States: the button is disabled while saving; on failure the form keeps its fields and shows `project.error.save_failed` with Retry. Creating a project requires a connection; offline it shows `project.create.needs_connection` and keeps a draft `Saved on this phone`.
7. Errors: name empty or longer than the limit, goal empty, date in the past (allowed only with a confirmation `project.create.past_date`) each show an inline message.
8. Notifications: the owner (if not the creator) and team members added receive `ntf.project.added.push`. Members without the app receive SMS only if the group's SMS rule allows it.
9. Audit: creation, the owner and the team members added are written to the audit log with actor and time.

**Data:** Project, Group, Membership, Audit entry, Notification.
**Depends on:** GRP (module enablement, permissions), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission allows creating a project. One template or two (for example one for a purchase and one for a ceremony). Whether an individual can create a project without a group (see PRJ-12).

---

### PRJ-02 Open a project and see what it is about, who owns it and where it stands

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline, audit

**Story:** As a member, I want one project page that shows the goal, owner, deadline, status and team, so that I know what this project is and who to ask.

**Conversation:** A single summary page is the pattern to copy from Basecamp and from Chamasoft's project view (raw/08 section 6.9), and it replaces tools used for each need (info.md problem 5). The page must not turn into a project suite (raw/08 section 6.9 "Avoid"). Status values are deliberately few. Editing is by a person with Project: edit; adding team members needs Project: manage team (PRJ-06 covers narrowing).

**Preconditions:** The project exists and the person holds Project: view.
**Trigger:** The person opens a project from the list, a notification or a link.

**Acceptance criteria:**
1. The page header shows name, goal, owner (name and photo or initials), deadline as `Fri 24 Oct (in 12 days)`, status chip, and the team as a short list with a count and "See all".
2. Status is one of Active, On hold, Closed, plus a computed marker `Late` when the deadline has passed and the project is not Closed. Each has a word and an icon, never colour alone.
3. Below the header, the page shows the template sections in a fixed order with counts: Summary, Budget, Tasks, Expenses, Decisions, Events, Files.
4. A person with Project: edit can change name, goal, owner, deadline and put the project On hold or Active again. Each change shows what changed and is saved on confirmation.
5. Changing the owner notifies the old and new owner with `ntf.project.owner_changed.push` and records both.
6. Offline: the page opens from cache with a `Last synced` time; edit actions are disabled with an explanation, not queued. Read sections still work.
7. Errors: a project the person cannot see shows `project.error.not_visible` with who can grant access (never a bare "Not allowed"). A project that was closed shows its closing summary instead of edit actions.
8. States: loading shows a skeleton of the final layout; an On hold project shows a visible banner and why (reason text optional).
9. Audit: every change to a field is stored with before value, after value, actor and time and is visible in the project history.

**Data:** Project, Membership, Audit entry.
**Depends on:** PRJ-01, GRP (permissions), XCT (cache, last synced banner, status chip).
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the status "Planning" before the first task is needed (default proposed: no). Whether "Late" should also appear when a milestone is overdue (see PRJ-08).

---

### PRJ-03 Link a budget to one wallet and see spent against planned

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: manage budget, and Wallet: view balance on the chosen wallet
**Tags:** ledger, audit

**Story:** As a member who manages a project's money, I want to set a planned budget and link one wallet, so that everyone sees how much has been spent and how much is left, in real time.

**Conversation:** Budget and spending are what Basecamp lacks and what members ask for ("Where does the money go?"; info.md problem 8; raw/04 section 8). The MVP keeps one budget linked to one wallet, with no forecasting (raw/04 section 14.5). The project does not bypass the wallet's own rules: spending still needs "approve spend" on the wallet (info.md, Projects rule), and the spent figure comes only from confirmed ledger entries. Stanbic Chama shows goal money moved out of the available balance and returnable (raw/08 section 6.9); that reserve behaviour is an open question and is not assumed here. Budget categories are also an open question.

**Preconditions:** A project exists in a group that owns at least one wallet.
**Trigger:** The person taps "Set budget" on the project page or in the creation form (PRJ-01).

**Acceptance criteria:**
1. The person enters a planned total in whole ariary (integer, no decimals, shown as `1 000 000 Ar`) and picks exactly one wallet among the group's wallets they can view. A project has at most one linked wallet.
2. The Budget section then shows planned, spent, pending and remaining in one sentence and one bar, for example `Spent 300 000 Ar of 1 000 000 Ar planned. 120 000 Ar waiting for approval. 580 000 Ar left.` The bar has a text equivalent.
3. Spent is the sum of confirmed ledger entries that came from expense requests linked to this project. Pending is the sum of requests not yet Confirmed or Failed or Cancelled. Failed and Cancelled requests are never counted as spent.
4. When spent plus pending exceeds the plan, the page shows `project.budget.over` with the excess amount and keeps working. A new expense request that would exceed the plan shows a warning on the request but is not blocked by the budget (open question: block versus warn).
5. The planned total can be changed by a holder of Project: manage budget; each change is kept in the budget history with who, when, old and new value. The wallet cannot be changed once one expense request is Confirmed; before that it can be changed with a confirmation.
6. If the linked wallet is closed or the person loses wallet access, the Budget section shows `project.budget.wallet_unavailable` and new expense requests are blocked until a new wallet is linked.
7. Figures update when the ledger confirms an entry. Offline they show from cache with `Last synced`; changing the budget is not possible offline.
8. Audit and ledger: the budget does not write ledger entries and moves no money; linking, unlinking and every change of the plan are audit entries. The wallet's own approval rules are unchanged.
9. Accessibility and language: amounts use space grouping, never wrap and are never clipped at 200% font size, identical in Malagasy, French and English.

**Data:** Project, Wallet (reference), Ledger entry (read), Expense request (read), Audit entry.
**Depends on:** PRJ-01, PRJ-02, WAL (wallet list, ledger entries and balances), SPD (expense request statuses), GRP.
**Pages:** to be filled from the information architecture.
**Open questions:** Should the planned amount be reserved in the wallet (not spendable elsewhere) or only tracked? Can one wallet fund several projects at once? Budget categories or one total? Block or warn when spending exceeds the plan? Does linking need the wallet owner's consent?

---

### PRJ-04 Keep a short list of tasks and milestones

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: manage tasks
**Tags:** offline, audit

**Story:** As the project owner, I want to list what must be done, who does it and by when, and tick it when finished, so that the team knows the next step without a meeting.

**Conversation:** The minimal useful list is title, owner, date, done, and nothing more (raw/04 section 14.5). Gantt, dependencies and custom fields are cut (Notion, ClickUp and Trello complaints, raw/04 sections 5 to 7). Use a status of To do, Doing and Done with icons plus text in lists, and a vertical timeline, not horizontal tables (raw/07 section 8.6). A milestone is a task marked as a milestone, to keep one object. Whether the task owner may tick their own task without Project: manage tasks is an open question.

**Preconditions:** A project exists, status Active or On hold.
**Trigger:** The person taps "Add a task" or "Add a milestone" in the Tasks section.

**Acceptance criteria:**
1. A task has title (required), owner (a team member, optional), date (optional) and a done state. A milestone is a task with a date that is flagged as a milestone and shown in the timeline.
2. Tasks list with status chips (To do, Doing, Done), each with icon and text. Done tasks are collapsed by default and counted: `5 of 12 done`.
3. Marking done records who and when. Un-doing is allowed and is logged.
4. A task with a date earlier than today and not done shows `Overdue` with the number of days. The owner receives `ntf.project.task_due.push` on the due date and once after it is overdue (push only; SMS use is an open question).
5. The task owner must be a member of the team; assigning someone not on the team offers to add them (needs Project: manage team) or is refused with `project.task.owner_not_team`.
6. Offline: creating, editing and marking done are queued with the states `Saved on this phone`, `Waiting to send`, `Sent`. If two people changed the same task, the person sees both versions ("Your change versus Fanja's change") and chooses; nothing is silently overwritten.
7. Empty state: `project.tasks.empty` with a button to add a first task or milestone. A closed project shows tasks read-only.
8. Errors: empty title or an invalid date shows an inline message; a failed save keeps the task and shows Retry.
9. Audit: creation, edits, owner changes, date changes and done state are stored with actor and time.

**Data:** Task, Project, Membership, Audit entry, Notification.
**Depends on:** PRJ-02, GRP (team membership), NTF, XCT (offline queue).
**Pages:** to be filled from the information architecture.
**Open questions:** Can the task owner tick their own task without the manage permission? Should milestones notify the whole team? Is a "Blocked" state needed (default proposed: no).

---

### PRJ-05 See every expense request and decision that belongs to the project

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** ledger, audit

**Story:** When the group asks what happened to the money and what was decided for this project, I want to see its expense requests and decisions on the project page, so I can answer without leaving the project.

**Conversation:** The decision log attached to the project is the product's answer to forgotten meeting decisions (info.md problem 2), and spending shows its approvals, as in Open Collective's submit, approve, pay model (raw/04 section 3). The project page merges tasks, expense requests and decisions in one place and avoids more screens (raw/08 section 6.9). Detail screens belong to SPD and VOT; this story is the view and the entry points. Whether a member who can view the project can also view request details such as payee numbers is an open question.

**Preconditions:** The project exists; the person holds Project: view.
**Trigger:** The person opens the Expenses or Decisions section of the project page.

**Acceptance criteria:**
1. The Expenses section lists the project's expense requests newest first with requester, purpose, amount, status chip (word, icon, colour) and an approval line such as `2 of 3 approved`. Tapping opens the SPD request detail.
2. Totals at the top reconcile with the Budget section (PRJ-03): the sum of Confirmed requests equals Spent, and the same wording is used.
3. The Decisions section lists decisions of this project from the decision log (VOT-13, VOT-14) newest first with title, result chip, date and a `Money moved` marker where a ledger entry exists. Tapping opens the log entry.
4. From each section the person can start the next action if they hold the permission: "New expense request" (SPD), "Ask the group to vote" (VOT-01), "Record a decision" (VOT-14). Without the permission the button is hidden and a line names the missing permission and who can grant it.
5. Empty states: `project.expenses.empty` and `project.decisions.empty` each with one action or an explanation.
6. Loading shows skeleton rows. Offline the lists come from cache with `Last synced` and a note that status may have changed.
7. Filters: expenses by status; decisions by result. No other filters in the MVP.
8. Audit: reading is not logged. Visibility follows the project's permissions only.
9. Accessibility and language: status is never colour alone, the lists work in a screen reader row by row and in a single column at 320 px.

**Data:** Project, Expense request, Approval, Decision, Vote, Ledger entry (reference).
**Depends on:** PRJ-02, PRJ-03, SPD (expense request list and detail), VOT-13, VOT-14, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Visibility of payee name and number to members who are not approvers. Whether a project member can see group-wide decisions that are not tied to any project (default proposed: no, only the group log shows them).

---

### PRJ-06 Let the project follow the group's permissions, and narrow them when needed

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Group founder
**Permission needed:** Group: grant permission and Group: revoke permission (applied to this project), to confirm
**Tags:** audit

**Story:** As the group founder or a member who grants permissions, I want the project to start with the group's permissions and let me remove some for this project only, so that a sensitive project is not open to everyone.

**Conversation:** Permissions are inherited from group to project to document (conventions section 2; info.md Permissions). Research shows users cannot read lists of rules and that an "Effective access" view beats a rule list (83.6% against 56.5% accuracy, raw/07 section 8.5 R-PM2) and that Drive makes inherited access unreducible, a pattern to avoid (raw/04 section 13). So inheritance is shown visibly with an explicit override, and effective access is shown per member (raw/08 section 6.11). Narrowing only removes access: it never adds power over what the group gave, and it never lowers the approvals needed for a spend. Whether OpenFGA can express "narrow" as an exclusion is an engineering open question.

**Preconditions:** A project exists and the person can grant and revoke permissions on it.
**Trigger:** The person opens "Who can do what" on the project.

**Acceptance criteria:**
1. The page lists every group member who can see the project with an Effective access line in verbs (see, edit, manage budget, manage tasks, approve a purchase, manage the team, close), and for each the source: `Inherited from the group` or `Set on this project`.
2. A new project starts with everything inherited and the page says so (`project.access.inherited`).
3. A holder of the permission can narrow: remove a specific permission for a member on this project only, or switch "Only the project team can see this project". The sheet shows the effect in words before saving, for example "Rado will no longer be able to approve purchases on this project".
4. Narrowing never changes the member's group permissions. Removing it later restores the inherited access; the page shows `Narrowed on this project` with the date and who did it.
5. A project must always have at least one person who can edit and one who can close it; a change that would leave none is refused with `project.access.no_owner`.
6. Narrowing cannot reduce the number of approvals needed for a spend and cannot grant a member access they do not have on the group.
7. A blocked action anywhere in the project names the missing permission and who can grant it (never a bare "Not allowed").
8. Notifications: the affected member receives `ntf.project.access_changed.push` with the plain-words change; no SMS.
9. Audit: every narrowing, restoration or project-only grant is an audit entry (actor, member, permission, time) visible to members who may view permissions.

**Data:** Project, Membership, Permission grant, Audit entry.
**Depends on:** PRJ-02, GRP (permission model, effective access panel, audit log), NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Which permission is required to narrow on a project (proposed: grant and revoke on the group, applied to the project). Whether narrowing money-out permissions needs a vote (raw/07 R-PM5). Technical feasibility of exclusions in the permission engine. Whether a "Preview as member" (raw/07 R-PM6) is added in the MVP (default proposed: P2).

---

### PRJ-07 Attach a file to a decision or an expense request

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Document: add (and view of the decision or request)
**Tags:** offline, audit

**Story:** As a member, I want to attach a photo or a PDF to a decision or an expense request, so that the proof, the quote or the minutes stay with the record.

**Conversation:** The MVP replaces a document library with attachments on decisions, proposals and expense requests, with basic versions only if cheap (raw/04 section 14.5; competitive-analysis section 7). The approval card shows attached evidence such as a receipt photo (raw/07 section 8.4 R-AP1). There is no versioning: replacing means adding a new file. Data cost matters (about 5 Ar per MB in the research, design-foundations section 1), so the size is visible before upload.

**Preconditions:** The person can view the decision or request and holds Document: add.
**Trigger:** The person taps "Add a file" on a decision entry or an expense request.

**Acceptance criteria:**
1. The person picks a photo (camera or gallery) or a PDF. The app compresses photos on the phone and shows the final size before upload, with the maximum PROJECT_ATTACHMENT_MAX_MB and the allowed types.
2. Files that are too large or of a type not allowed are refused with `project.file.too_large` or `project.file.type_not_allowed` before upload, and nothing is sent.
3. The attachment shows name, type, size, uploader and time; images open in place and PDFs open or download on tap.
4. Up to PROJECT_ATTACHMENTS_PER_ITEM files per item. A further file is refused with a clear message.
5. On an expense request, adding a file after approvals have started notifies approvers (`ntf.spend.attachment_added.push`, owned by SPD) and does not void approvals; changing the amount, payee or wallet still does (SPD rule).
6. Attachments on a decision are appended, never overwritten (VOT-15). A file can be removed only by a holder of Document: delete with a reason, and the record shows `File removed by {name}` instead of vanishing.
7. Offline: the file is kept on the phone with `Saved on this phone` then `Waiting to send`, sent when connected, resumable after an interruption. Viewing a file offline works only for files already opened on this phone.
8. Errors: upload failure shows Retry and keeps the file; a file that fails the safety check shows `project.file.rejected` and is not stored.
9. Audit: add, remove and view-denied attempts are stored with actor and time.

**Data:** Document, Decision, Expense request, Audit entry.
**Depends on:** VOT-13, VOT-14, VOT-15, SPD, GRP (Document permissions), XCT (offline queue).
**Pages:** to be filled from the information architecture.
**Open questions:** Maximum size and allowed types. Whether a Document: view permission is needed separately from viewing the parent. Retention period for files of a closed project.

---

### PRJ-08 Read a one-page summary of how the project is going

**Type:** Job story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline

**Story:** When I open a project before a meeting, I want a short summary of progress, money and what is waiting, so I know the state in under a minute.

**Conversation:** v1 reporting is one page per project: budget used against planned, open decisions, next dates; no custom reports (raw/04 section 14.5). The group dashboard works as headline sentences plus a ranked list with percent bars (design-foundations section 4). A short summary of four figures is borrowed from YNAB's month summary (raw/08 section 6.9). Progress is computed from tasks, not typed by hand, to stay honest.

**Preconditions:** The person holds Project: view.
**Trigger:** The person opens the Summary section (first on the project page).

**Acceptance criteria:**
1. The summary opens with headline sentences built from message keys, for example the number of tasks done, the next milestone and date, the budget used.
2. It shows four figures: budget used against planned (from PRJ-03), tasks done against total (from PRJ-04), next milestone or deadline with relative time, and waiting items (pending expense requests plus open votes).
3. Progress is tasks done divided by tasks total, and the page states how it is computed (`project.summary.progress_how`). With no tasks the page says so and shows no percent.
4. Overdue milestones and tasks are counted with a link to each, and the project shows `Late` when the deadline has passed (PRJ-02).
5. Each figure links to its section; waiting items link to the request or vote.
6. Empty project: the summary shows `project.summary.empty` and the next suggested action (add a budget or a first task), not zeros.
7. Offline: the summary opens from cache with `Last synced` and a note that numbers may be out of date; amounts older than a parameter carry a visible "may be outdated" mark.
8. Loading uses a skeleton; the page reflows in one column at 320 px and amounts are never clipped at 200% font size.
9. Audit: none for reading.

**Data:** Project, Task, Expense request, Vote, Ledger entry (read).
**Depends on:** PRJ-03, PRJ-04, PRJ-05, VOT-05, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the owner may add a short written status update (default proposed: no, the decision log carries text). Whether "Share summary" as text is offered (it would leak budget outside the group; default proposed: no).

---

### PRJ-09 Close a project and keep its record

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Permission holder
**Permission needed:** Project: close
**Tags:** audit, ledger

**Story:** As the project owner, I want to close a finished project and leave a closing note, so that the group sees how it ended and nothing is left hanging.

**Conversation:** A project that is never closed keeps showing spent versus planned and open items forever. The closing summary is the final snapshot for the next meeting, and no money is moved by closing (budget is not a reserve in the MVP unless the open question decides otherwise). Closing records a line in the decision log so there is a trail (raw/04 section 14.3 audit principle).

**Preconditions:** The person holds Project: close. The project is Active or On hold.
**Trigger:** The person taps "Close project".

**Acceptance criteria:**
1. The close sheet checks and lists what is still open: expense requests not yet Confirmed, Failed, Rejected or Cancelled, open votes linked to the project, tasks not done. Each item has a link.
2. Open expense requests and open votes must be resolved or cancelled before closing; the sheet refuses with `project.close.blocked` and shows the list. Open tasks do not block: they stay marked Not done.
3. The person writes an optional closing note (what was achieved, what remains) and sees the final figures (planned, spent, difference) before confirming with a button labelled `Close project`.
4. On confirmation the status becomes Closed, a frozen closing summary is stored, and the project becomes read-only except for viewing, attachments on existing items and the closing note.
5. Unspent money stays in the wallet; closing creates no ledger entry. The sheet says so in words (`project.close.no_money_moves`).
6. A decision-log entry "Project closed by {name}" is appended automatically with the note and summary figures, and shows in the group log.
7. Team members receive `ntf.project.closed.push` with the result in plain words; no SMS.
8. A holder of Project: close can reopen a closed project; reopening is an audit entry and removes the frozen status, and the earlier closing entry stays in the log.
9. Audit: the closing mode, actor, time, note, final figures and any items left open are stored.

**Data:** Project, Expense request, Vote, Task, Decision, Audit entry, Notification.
**Depends on:** PRJ-02, PRJ-03, PRJ-04, PRJ-05, VOT-13, SPD, NTF.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether unspent budget should be automatically released if a reserve behaviour exists. Whether closing needs a vote above an amount (a business rule). Reopen limits.

---

### PRJ-10 List all the projects of a group

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view (per project); Group: view group
**Tags:** offline

**Story:** As a member, I want one list of my group's projects with their status and money, so that I can find the one I care about and see which are late.

**Conversation:** A flat list stays within the "no project suite" limit and the four-item bottom navigation (design-foundations section 4; raw/04 section 14.5). Project visibility respects PRJ-06 narrowing, so the list shows only what the person may see.

**Preconditions:** The person belongs to the group.
**Trigger:** The person opens "Projects" in the group.

**Acceptance criteria:**
1. Each row shows name, owner, status chip, deadline in relative time, budget bar (spent of planned, when a budget exists) and the number of waiting items.
2. The default view is Active projects, sorted by deadline (nearest first, no date last). Tabs or a filter switch to On hold and Closed.
3. A project the person cannot see is absent, with no placeholder row and no count.
4. Empty state: `project.list.empty` with a "New project" button if the person holds the creation permission (PRJ-01), otherwise an explanation of who can create one.
5. The list shows the Late marker for projects past their deadline and not closed.
6. Offline: the list comes from cache with `Last synced`; opening a project follows PRJ-02 offline rules.
7. Loading shows skeleton rows; the list loads the first screen quickly and more on scroll with a visible count.
8. Search by project name works on cached data and handles accents in Malagasy and French.
9. Accessibility and language: rows are real links with 48 dp targets, status is never colour alone, amounts never clip at 200% font size.

**Data:** Project, Membership, Wallet (reference for budget bar).
**Depends on:** PRJ-01, PRJ-02, PRJ-03, PRJ-06, XCT.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the list also shows the individual's personal projects (PRJ-12) in one place or separately.

---

### PRJ-11 Follow the project as one timeline of tasks, requests and decisions

**Type:** Job story
**Priority:** P2
**Release:** MVP
**Actor:** Member
**Permission needed:** Project: view
**Tags:** offline

**Story:** When I come back to a project after some days, I want to see what happened in order, so I can catch up without opening every section.

**Conversation:** The only gap identified on the project page is one timeline that merges tasks, expense requests and decisions (raw/08 section 6.9 "Open opportunities", unverified). Use a simple vertical timeline with date, event and who, icon and text, no horizontal scroll, completed items collapsed (raw/07 section 8.6). No Gantt.

**Preconditions:** The project has at least one event to show.
**Trigger:** The person opens the Timeline view of the project.

**Acceptance criteria:**
1. The timeline lists, newest first, entries for: tasks created, done or overdue; milestones reached; expense requests submitted, approved, rejected and paid; decisions and votes opened and closed; events linked to the project (EVT-09); files added.
2. Each entry shows date and time, an icon with text, who did it and a link to the item.
3. Entries of the same kind on the same day are grouped when there are more than a parameter number.
4. Upcoming items (milestones, events, deadlines) are shown above the history in date order.
5. The person can filter by type; the filter is remembered per project on that phone.
6. Empty state: `project.timeline.empty`.
7. Offline: loaded from cache with `Last synced`; older history loads when connected.
8. The timeline is read-only and written from existing events; it creates no new record.
9. Accessibility and language: the timeline is a list in reading order; dates are absolute with weekday; no information is only in an icon or colour.

**Data:** Project, Task, Expense request, Decision, Vote, Event, Document, Audit entry (read).
**Depends on:** PRJ-04, PRJ-05, PRJ-07, EVT-09, VOT-13, SPD.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether the timeline replaces the separate Tasks, Expenses and Decisions sections or sits beside them (testing needed).

---

### PRJ-12 Run a personal project on my own

**Type:** User story
**Priority:** P2
**Release:** MVP
**Actor:** Individual
**Permission needed:** none (own entity)
**Tags:** ledger, audit

**Story:** As an individual, I want to start a project of my own, with a goal, a budget linked to one of my wallets and a few tasks, so that I can follow a personal plan like building a house or starting a business.

**Conversation:** The object model lets a project belong to a user or a group (info.md, Projet). The personal path uses the same template and sections with a team of one. There is no vote, since there is no group; a decision is a manual entry. Research did not test the individual path, so it is the least certain story of the epic (raw/08 section 6.9 and raw/04 section 14.5 cover groups only).

**Preconditions:** The person has an account and at least one wallet for the budget link.
**Trigger:** The person taps "New project" from their own home.

**Acceptance criteria:**
1. The same four-field creation (PRJ-01) is used; the owner is the person and cannot be changed to someone else (no team).
2. The budget links to one of the person's own wallets and works as PRJ-03, without any group approval flow: spending follows the wallet's own rules.
3. Tasks and milestones work as PRJ-04, with the person as the only owner.
4. Decisions are manual entries only (VOT-14 without vote links); the Decisions section explains that no vote is available without a group.
5. The person can later move the project to a group they belong to if they hold the permission there (open question); until then it is private.
6. Closing and the summary follow PRJ-08 and PRJ-09.
7. Empty states and offline behaviour follow the group project rules.
8. Audit entries record the same events as a group project.
9. Accessibility and language: identical to the group version.

**Data:** Project (user-owned), Wallet, Task, Decision, Audit entry.
**Depends on:** PRJ-01, PRJ-03, PRJ-04, PRJ-08, PRJ-09, WAL, ACC.
**Pages:** to be filled from the information architecture.
**Open questions:** Whether moving a personal project to a group is allowed and how its history is shown. Whether the individual path belongs in the MVP at all.

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| PRJ-01 | Start a project from a ready-made template in about a minute | P0 | GRP, NTF |
| PRJ-02 | Open a project and see what it is about, who owns it and where it stands | P0 | PRJ-01, GRP, XCT |
| PRJ-03 | Link a budget to one wallet and see spent against planned | P0 | PRJ-01, PRJ-02, WAL, SPD, GRP |
| PRJ-04 | Keep a short list of tasks and milestones | P1 | PRJ-02, GRP, NTF, XCT |
| PRJ-05 | See every expense request and decision that belongs to the project | P0 | PRJ-02, PRJ-03, SPD, VOT-13, VOT-14 |
| PRJ-06 | Let the project follow the group's permissions, and narrow them when needed | P1 | PRJ-02, GRP, NTF |
| PRJ-07 | Attach a file to a decision or an expense request | P1 | VOT-13, VOT-14, VOT-15, SPD, GRP, XCT |
| PRJ-08 | Read a one-page summary of how the project is going | P1 | PRJ-03, PRJ-04, PRJ-05, VOT-05 |
| PRJ-09 | Close a project and keep its record | P1 | PRJ-02 to PRJ-05, VOT-13, SPD, NTF |
| PRJ-10 | List all the projects of a group | P1 | PRJ-01, PRJ-02, PRJ-03, PRJ-06 |
| PRJ-11 | Follow the project as one timeline of tasks, requests and decisions | P2 | PRJ-04, PRJ-05, PRJ-07, EVT-09, VOT-13 |
| PRJ-12 | Run a personal project on my own | P2 | PRJ-01, PRJ-03, PRJ-04, WAL, ACC |

Count: 12 stories. P0: 4 (PRJ-01, PRJ-02, PRJ-03, PRJ-05). P1: 6 (PRJ-04, PRJ-06 to PRJ-10). P2: 2 (PRJ-11, PRJ-12).

## Cross-epic dependencies

Other epic files did not exist when this file was written. Names are the binding reference; IDs are to be reconciled.

- ACC: signed-in session, language preference, individual account for PRJ-12.
- WAL: wallet list for the budget link, wallet balance and ledger entries read for Spent (PRJ-03), wallet closure state.
- RUL: none in the MVP. A project budget is not a wallet rule.
- GRP: Projects module enablement (Group: enable module), who can create a project, permission grant and revoke, "Effective access" panel and audit log (PRJ-06), team membership.
- CON: none in the MVP. Linking a group contribution plan or a campaign (ANN-04) to a project's funding is an open question.
- SPD: expense request create, list, detail, approval statuses and wording, "attachment added" notice (PRJ-05, PRJ-07, PRJ-09).
- VOT: VOT-13 decision log entries, VOT-14 manual entries, VOT-15 attachments on amended decisions, VOT-05 for open-vote counts (PRJ-05, PRJ-08).
- EVT: EVT-09 links events to projects (PRJ-11).
- NTF: push and SMS templates for `ntf.project.*`, quiet hours, SMS rules for adding members without the app.
- XCT: offline queue and states, `Last synced` banner, status chip component, language, accessibility.
- OPS: none in the MVP beyond support for lost project access.

## Open questions

1. Which permission allows creating a project (no "create project" exists in the table), and whether narrowing needs grant and revoke on the group or a project permission (PRJ-01, PRJ-06).
2. Budget behaviour: is the planned amount reserved in the wallet or only tracked, may one wallet fund several projects, one total or categories, block or warn on overspend (PRJ-03). Stanbic reserves goal money; that is not assumed (raw/08 section 6.9).
3. Can the permission engine express narrowing (exclusion) cleanly, and is it worth the complexity in the MVP (PRJ-06)?
4. One template or several (PRJ-01). A second template for purchases or ceremonies would need field research.
5. Whether task owners may tick their own tasks without a manage permission (PRJ-04).
6. Attachment limits, allowed types, retention (PRJ-07).
7. Should a project move from personal to group, and is the personal path in the MVP (PRJ-12)?
8. Does the timeline replace the sections or sit beside them (PRJ-11)? Needs test round A.
9. Do SMS reminders exist for task due dates (default proposed: no, push only) and who pays for SMS (NTF)?
