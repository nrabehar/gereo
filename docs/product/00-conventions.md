# Gereo product definition: conventions

This file fixes the vocabulary, actors, story format and scope rules that every story file in `docs/product/stories/` follows. Read it before writing or reviewing a story.

Sources: [info.md](../../info.md), [competitive-analysis.md](../research/competitive-analysis.md), [design-foundations.md](../research/design-foundations.md) and the raw reports in `docs/research/raw/`.

## 1. Order of work

1. Actors and jobs (this file, section 3).
2. User stories per epic (`stories/*.md`), with acceptance criteria.
3. Story map: epics against journey steps, sliced into releases (`03-story-map.md`).
4. Information architecture: objects, pages, navigation, derived from the stories (`04-information-architecture.md`).
5. Flows with error branches, then wireframes, then prototype tests, then hi-fi.

Pages are never invented first. A page exists because one or more stories need it, and every story lists the page it lands on once the information architecture is done.

## 2. Rules that apply to every story

- There are no roles in the system. Access is permissions only, granted individually and inherited from parent to child (group, then project, then document). Stories name the permission needed, for example "a member who can approve spending". "Treasurer" is only a prefilled bundle of permissions and can be changed.
- Money is integer ariary. Every money movement is a balanced, immutable ledger entry. A correction is a reversing entry, never an edit.
- Transaction statuses: Initiated, Pending, Confirmed, Failed, Cancelled (plus Needs attention in the interface).
- Identity verification (KYC) is done by Gereo. Money-in and money-out need the tier shown in the ACC-07 table, with limits from OPS-11. Browsing, joining and voting need only phone and OTP.
- A guest has phone and OTP only: no tier, no account. Tier 1 means an account with phone, OTP and PIN.
- Stories and code say "tier". The UI says Level / Niveau (ACC-07 criterion 10). Stories never write "Level".
- Payments go through Vanilla Pay behind a payment adapter so another rail can replace it. The legal basis for holding client funds is unconfirmed; stories that move or hold money carry the tag `legal-gate`.
- The product must work on low-end Android phones and slow connections. Anything critical has an SMS path. Money-out is online only. Everything else the person needs to read works offline from cache with a "last synced" time.
- Languages: Malagasy, French, English from the start. Stories never hard-code text; they refer to message keys. Every key in the string catalogue needs Malagasy, French and English text, including `ledger.rounding_line`.
- The database is read-only for assistants working on this repo. Stories describe behaviour; they do not run migrations.
- Everything written in the repository is in English. Code carries no comments.
- One owner per rule. Other files cite it by story ID and never restate numbers. Each default lives in exactly one owner file.
- Owners at a glance: tier table ACC-07; numeric limits and fees OPS-11; no-single-person floor GRP-13 (vote half in VOT "Kinds of vote"); D4 floor of two voters SPD-09 and VOT-03; vote payout review hold SPD-10; link kinds GRP-03, VOT-06 and NTF-11; device queue XCT-05; cache XCT-04; SMS encoding and lint XCT-12; SMS templates and `msg.*` keys NTF-07; notification rules NTF.
- Notifications: a story names the catalogue row ID and the message key `msg.<epic>.<event>`. A story never defines the SMS fallback wait, the daily SMS cap, the group allowance, quiet hours or the batch threshold; these belong to NTF (`ntf.*` parameters). A story may define how many reminders it schedules and at which offsets, and its own domain counts (for example a vote reminder maximum per person).
- Offline: the XCT-05 registry (Table A auto-send, Table B local drafts) is the only list of actions that can be done without a connection. Other epics cite XCT-05 rows; they never add queued actions or copy label text. A new queueable action needs a decision in `05-decisions.md` plus a registry row with endpoint and side-effect class that passes the guard test. A local draft is never sent without a tap. The device queue never holds an action that moves money, approves, rejects, cancels, freezes, creates a group, wallet or project, authorises a payout, or changes a permission, rule or role; the only exception is a person accepting their own invite. Anything not queueable is online only and shows `xct.offline.money_blocked` for money-out or `xct.offline.needs_connection` otherwise. "Queue" means the device queue; money held as Pending on the server is never called queued.
- Floor: stories cite GRP-13 for the no-single-person floor and VOT "Kinds of vote" for the vote half. They never restate the floor numbers or the ineligibility list.
- Messaging: SMS encoding and lint belong to XCT-12. SMS templates and `msg.*` keys belong to NTF-07.

## 3. Actors

Fictional names below are working hypotheses to validate in field interviews, not research findings.

| Actor | Who | What they need |
| --- | --- | --- |
| Visitor | Someone who has opened the app or a link but has no account | See what Gereo is, choose a language, look around, open a vote or invite link |
| Individual | A person managing their own budget, savings, investments or business | Wallets with rules, history, goals, export |
| Member | A person who belongs to one or more groups (for example Rasoa) | Pay contributions, see where money goes, vote, RSVP, follow projects |
| Group founder | The person who creates a group (for example Sara). Starts with all permissions and can grant and revoke | Set up the group, invite, define the plan and split rules, grant permissions |
| Permission holder | A member who holds specific permissions, for example approve spending, edit rules, send reminders (for example Mamy with a treasurer bundle) | Configure plans and splits, approve spending, chase late contributions |
| Guest voter | A person who opens a vote link without a full account, often on a basic phone (for example Tiana) | Cast one vote with minimal steps |
| Gereo operator | Gereo staff for support, compliance and operations | Review identity checks, handle tickets, watch reconciliation and incidents |
| System | Scheduled and event-driven behaviour (reminders, rule firing, vote closing, reconciliation) | Not a person; stories describe it as acceptance criteria |

Later actors (not MVP): Seller, Buyer, Borrower, Lender, Donor.

## 4. Journey steps

Used as the horizontal axis of the story map.

1. Discover and join: language, look around, sign-up, invite or link.
2. Verify: phone, PIN, identity tiers.
3. Set up: wallets, rules, group, plan, split rules, permissions.
4. Fund: deposit, contribute, receive income.
5. Decide: propose, vote, record the decision.
6. Spend: request, approve, pay out.
7. Follow: ledger, project, events, notifications.
8. Report and support: export, reconcile, help, safety.

## 5. Epics

| Code | Epic | Release |
| --- | --- | --- |
| ACC | Account, identity and account safety | MVP |
| WAL | Wallets and ledger | MVP |
| RUL | Wallet rules | MVP |
| GRP | Groups, membership and permissions | MVP |
| CON | Contributions and income split | MVP |
| SPD | Spending and approvals | MVP |
| VOT | Votes and decision log | MVP |
| PRJ | Projects (light) | MVP |
| EVT | Events and reminders | MVP |
| ANN | Group announcements and in-group campaign | MVP |
| NTF | Notifications and SMS | MVP |
| XCT | Cross-cutting: language, offline, low data, accessibility | MVP |
| OPS | Operator back office: KYC review, reconciliation, support | MVP |
| LTR | Later modules: marketplace, communities, social, marketing, lending | Later (stubs only) |

## 6. Story format

Each story is a card, a conversation and a confirmation (3 Cs), small enough to build in one sprint, and testable (INVEST). Use a user story when the actor is clear. Use a job story ("When... I want... so I can...") when the situation matters more than the actor. Plain language a primary school graduate can follow.

```
### ACC-01 Title in the user's words

**Type:** User story | Job story
**Priority:** P0 | P1 | P2
**Release:** MVP | Later
**Actor:** from section 3
**Permission needed:** none | <permission name from section 7>
**Tags:** legal-gate, sms, offline, ledger, audit (only the ones that apply)

**Story:** As a ..., I want ..., so that ...
(or) When ..., I want ..., so I can ...

**Conversation:** why this matters, what we decided, what we did not, link to evidence (research file and section).

**Preconditions:** ...
**Trigger:** ...

**Acceptance criteria:**
1. Happy path, observable and testable.
2. Business rules (limits, thresholds, quorum, permissions).
3. States: empty, loading, pending, failed, offline.
4. Errors: what the person sees, whether money moved, the next action.
5. Notifications: the catalogue row ID and the message key msg.<epic>.<event>, or none.
6. Ledger and audit: entries written, who and when.
7. Accessibility and language: only what is specific to this story.

**Data:** objects read or written (from the object model).
**Depends on:** story IDs.
**Pages:** to be filled from the information architecture.
**Open questions:** ...
```

Priority meaning: P0 the MVP does not make sense without it. P1 needed before general availability. P2 improves it.

Keep 6 to 10 acceptance criteria per story. If a story needs more, split it. Each affected criterion keeps a one-line testable outcome and its worked numbers; this file holds formulas and vocabulary only.

Cross-references (story IDs):

1. Story headings (`### XXX-nn`) are the only authority for story IDs.
2. Cite a story by its ID, a criterion as "ID criterion N", a numbered open question as "ID open question N".
3. Cite events as `EV-XXX-nn`, never as a bare story ID. NTF owns the event catalogue (class, payer, SMS fallback, message key); each row names its emitting story, and each message key is emitted by exactly one story.
4. A closed question stays as one line, "Closed: <decision> (ID criterion N)", with the rationale kept. Citing a closed question by its number is a defect.
5. Single owners: cycle detection and chain depth RUL-07; the "money posted to a wallet" event WAL-07 (RUL-07 consumes it; WAL-12 and WAL-13 are entry points); the two-distinct-voters count VOT-03 (VOT-01 criterion 10 extends it to policy-change proposals; GRP-12 and GRP-14 cite VOT-01); attachment size and types SPD-03; items per attachment PRJ-07; `msg.vot.decision_logged` VOT-14.
6. SPD-13 states the request outcome itself (accepted, held, refused) and cites PRJ-03 only for budget numbers.
7. XCT-14 owns screen string keys and the glossary; XCT-12 owns SMS encoding and lint.
8. Bare epic names are allowed only in scope phrases, epic summaries and Cross-epic dependencies sections (allow-list file in the story-map build).
9. Edits to story files are made by string match, never by line number.
10. The story-map build runs the reference check in section 13.

## 7. Permission names

Member permissions are written "Object: name" (for example `Wallet: initiate spend`). The GRP "Shared definitions" section owns the member permission catalogue, the bundle mapping and the money-out class; this table lists names only.

| Object | Permissions |
| --- | --- |
| Group | Group: view group, invite member, remove member, grant permission, revoke permission, enable module, edit group, delete group, view audit log, set spending policy, set notification settings |
| Wallet | Wallet: view balance, view history, deposit, initiate spend, approve spend, edit rules, export history, freeze, create, close |
| Contribution plan | Contribution plan: view, edit, exempt member, send reminder, delete |
| Project | Project: view, edit, manage budget, manage tasks, approve purchase, manage team, close |
| Vote | Vote: view, vote, create, close, edit |
| Event | Event: view, create, edit, invite |
| Document | Document: view, add, edit, delete, share |
| Publication | Publication: publish, announce to group, moderate |

Scope notes:

- `Wallet: initiate spend` is the permission to ask to spend. It is kept as is.
- `Wallet: create` covers creating a wallet inside a group, and also renaming and retyping it.
- `Wallet: edit rules` covers the group goal.
- `Project: edit` is the creation permission and is labelled "Create and edit projects".
- `Document: add`, `edit`, `delete` and `share` are unused in the MVP.
- Money-out class: defined once, in GRP Shared definitions. It is `Wallet: initiate spend`, `approve spend`, `edit rules`, `close`, and `Group: set spending policy` (a PIN is needed to grant any of them). `Wallet: create` and `Wallet: freeze` are not money-out. `Wallet: freeze` is online only and not queueable.
- Bundles: Member and Treasurer only, no third bundle. Treasurer is Member plus `Wallet: initiate spend, approve spend, edit rules, export history, freeze`; `Group: view audit log, set notification settings`; `Contribution plan: edit, exempt member, send reminder`; `Vote: create, edit, close`; `Publication: announce to group`. Treasurer excludes `Wallet: create, close` and `Group: set spending policy, grant permission, revoke permission, remove member, delete group, edit group`.
- Holder counts: "holders" (all, used to block leave and revoke) and "reachable holders" (excludes Locked, Inactive and Deactivated members; used for the shortage banner, the GRP-12 approval-count limit and approval routing). Members see only a neutral "unavailable" marker with no reason.
- Continuity: `Group: set spending policy` has a continuity minimum of one holder. `Group: delete group` is not a continuity permission; GRP-19 falls back to a vote when fewer than two holders exist.
- `split_change_requires_vote` and `plan_change_requires_vote` live on the GRP-12 page under `Group: set spending policy`. Any lowering of them, and the value "Never", is loosening.
- Operator permissions are a separate catalogue, owned by OPS-01 (section "Operator permission catalogue" in `stories/OPS.md`). They are lowercase backticked names (for example `review identity checks`, `handle tickets`, `manage flags`), are never member permissions, and no name in one list is valid in the other.

Business rules such as thresholds and mandatory votes live in product logic, not in the permission system. Every permission change is written to the audit log.

## 8. Object model (summary)

User, Group, Membership, Wallet, Wallet rule, Ledger entry, Transaction, Contribution plan, Contribution, Project, Task, Decision, Event, RSVP, Document, Vote, Ballot, Expense request, Approval, Announcement, Campaign, Notification, Device, Identity check, Audit entry, Support ticket.

The information architecture file turns these into pages and navigation.

## 9. Traceability

Every story cites the evidence behind it (research file and section) in its Conversation. Every wireframe will cite the story IDs it satisfies. A story with no page and a page with no story are both defects.

## 10. Money model: single definitions

Stories cite these as "conventions 10.x". This section holds formulas and vocabulary; stories keep their own worked numbers (RUL-07 holds the rounding test vector).

### 10.1 Income

Every deposit into a wallet is income for that wallet, including money coming from another wallet or from a rule (D3). Hop 0 is the original deposit; each rule firing that credits another wallet is the next hop. Each entry in a chain carries the name of the rule that made it. This is the only definition of income; other files delete their copies.

### 10.2 Chains

Rules can chain from wallet to wallet. Cycle detection (error key `err.rul.cycle`, the only cycle error) and a maximum chain depth `RULE_CHAIN_DEPTH_MAX` are mandatory and owned by RUL-06.

### 10.3 Authorisation classes for group money

| Class | What | Authorised by |
| --- | --- | --- |
| (a) | Person-initiated outflow: an expense request or a D4 vote, including Pay Gereo and SMS allowance top-up | The band's approvals or a passed authority vote (GRP-13) |
| (b) | Rule firing | Pre-authorised at save of the rule version, with the chain-leaf rule below |
| (c) | System postings: ANN refunds and Rounding | The system, by fixed definition |

Chain-leaf rule (class b): every save of a group rule recomputes the full reachable chain, including existing downstream rules. A leaf outside the group requires a RUL-13 vote. A chain wholly inside the group requires a second eligible person other than the saver. When none exists the save is refused.

Intra-group moves are expense requests (class a). They count in neither "spent" nor "spent or promised" for caps, but are included in reserved amounts and approval thresholds.

Small-group fallback: when eligible voters other than the requester number fewer than 2, a money vote is unavailable and the approval band applies. A spending policy must always keep one executable path, checked at save in GRP-12 and GRP-14.

A passed vote is the authorisation for spending (D4): the payment starts without approvers. Approvers apply only below the vote threshold. The requester can never approve their own expense (D1).

### 10.4 Money states

- Stage 1 "Reserved": derived, from request creation or vote pass, no ledger entry.
- Stage 2 "In transit": a ledger entry exists, from dispatch or provider acceptance.
- Both display as "Set aside, not sent". SPD-11 criterion 1 means Stage 1 while queued and Stage 2 once dispatched.
- The fee is fixed at authorisation; Gereo bears any later provider change. The balance check runs on reserved totals at authorisation.
- "Nothing was taken" is retired for authorised or queued requests. It stays valid before provider acceptance (the transaction does not exist yet and the retry is idempotent on the request id) and in OPS-09 Block mode.
- Once Gereo accepts a payout, the Pending transaction exists with sub-label "Waiting for the provider". Inbound deposits use "Waiting for the operator". The provider name never appears in the UI.
- The Needs attention age (`PAYOUT_PENDING_ALERT_MINUTES`) applies only to dispatched payouts. Queued payouts wait up to `PAYOUT_PROVIDER_WAIT_MAX` in "Waiting for the provider".

### 10.5 Platform lines

- Gereo income: Fee Gereo part, Rounding, Platform: SMS allowance.
- Collected for the state: Tax (a liability, not income).
- Money leaves the income account only through a finance process outside the app, run by two people. There is no sweep rule in the ledger and no story for it.
- Invariant tested by OPS-04: provider client-funds balance is at least the sum of client wallet balances, and income is held outside that sum.

### 10.6 Rounding (D5)

The leftover ariary of a split goes to Gereo as a visible ledger line, labelled Rounding, always under 1 ariary per destination (so under N ariary for N destinations), shown on the receipt and disclosed in the terms (ACC-13).

- In app: one aggregated receipt row per original income. Export: per-hop lines.
- SMS receipts carry no Rounding line; the SMS total includes it.
- No line when the amount is 0.
- Re-consent in ACC-13 only when a line type is added or the Rounding formula changes. Fee changes follow the OPS-11 start date and notice only.

### 10.7 Caps

RUL-09 owns the personal cap (warn only, no mode field). SPD-14 owns `spend_cap_mode` and its modes for group wallets only, set under `Group: set spending policy`.

### 10.8 Refunds and freeze

- Refunds are class (c). The destination is fixed to the original source; the default is the contributor's Gereo wallet with fee 0. A refund to mobile money pays its fee out of the refund, and the net is disclosed at contribution time (ANN-04).
- Wallet freeze (SPD-15) pauses class (b) firings whose destination is outside the group, and payouts and refunds. Internal firings and Rounding continue.
- When a payout is blocked, `payout_blocked` is added to the XCT status vocabulary and surfaced as a linked follow-up decision entry (the log is immutable). Vote close and decision write are one atomic step; OPS-14 is the backstop.

### 10.9 Parameters defined here once

Each is defined once, in the owner story, and only cited elsewhere: `RULE_CHAIN_DEPTH_MAX` (RUL-06), `PAYOUT_PROVIDER_WAIT_MAX` (WAL), `PAYOUT_PENDING_ALERT_MINUTES` (OPS-13), `RECON_RUN_TIME` (OPS-04), `spend_cap_mode` (SPD-14). Retired duplicates: the Income definition in WAL, the CON shared definition "Income, chains and rounding", `split_chain_depth_max`, `payout_retry_window` as a separate value (it references `PAYOUT_PROVIDER_WAIT_MAX`), the duplicate `RECON_TIME`, and any second cap mode field.

## 11. Shared vocabulary

This section owns the key grammar, the parameter tables, the status tables, the hold and lock terms, the rule vocabulary, skip reasons, ledger chips and formats.

### 11.1 Message keys

- Two namespaces. Notifications use `msg.<epic>.<event>`. Interface text uses `<epic>.<area>.<name>` with the epic's own lower-case code (`vot.*`, not `vote.*`). A push, SMS or in-app notification body is only ever a `msg.*` key; screens use only interface keys (for example `con.pay.pending`).
- `msg.*` grammar: `^msg\.[a-z]{2,4}\.[a-z0-9_]+(\.(push|sms|inapp))?$`. Underscores only inside the event name; no dotted event names. Every base key must exist in the NTF catalogue. There is no `.email` variant because there is no email channel.
- `ntf.*` is a parameter family (for example `ntf.log_retention`, `ntf.sms_group_name_max`, `ntf.sms_short_link_domain`), not a message-key prefix, and is exempt from the lint.
- Only NTF defines `msg.*` keys and `ntf.*` parameters. Another epic proposes a catalogue row and NTF accepts it. Screen text keys `wal.<screen>.<element>` stay owned by XCT-14. Each epic owns its own domain parameters.
- XCT-12 enforces the regex, catalogue membership and the 160-character GSM-7 limit for `.sms` that NTF-07 owns. Lint is per language (mg, fr, en) with segment count; variables are measured at maximum length.
- Offline messages are `xct.offline.money_blocked` and `xct.offline.needs_connection` only.

### 11.2 Parameters

Table A, system constants, in capitals, owned here with one citing owner story each:

| Name | Owner | Value or note |
| --- | --- | --- |
| `RECORD_RETENTION_YEARS` | WAL | Identity images, transaction records, ledger, firing history, attachments and expense files. Lawyer text: see ACC open question 1 |
| `AUDIT_RETENTION_YEARS` | OPS | Audit log, consent evidence, decision log. Must be at least `RECORD_RETENTION_YEARS` |
| `NEEDS_ATTENTION_ESCALATE_HOURS` | WAL | Owner story holds the value |
| `DISCREPANCY_ESCALATE_HOURS` | OPS | Owner story holds the value |
| `STALE_BALANCE_HOURS` | XCT-04 | 24 |
| `CACHE_RECENT_TRANSACTIONS` | XCT-04 | 50 |
| `CACHE_MAX_MB` | XCT-04 | 10, sized for 1 to 2 GB phones; no epic may raise it or add its own cache |
| `CACHE_LEDGER_DAYS` | XCT-04 | 60 |
| `QUEUE_MAX_MB` | XCT | 12, separate from `CACHE_MAX_MB` |
| `QUEUE_MAX_RETRIES` | XCT | Owner story holds the value |
| `QUEUE_ITEM_MAX_DAYS` | XCT | 7 |
| `QUEUE_KYC_MAX_DAYS` | XCT | 3 |
| `PAYOUT_PROVIDER_WAIT_MAX` | WAL | Owner story holds the value |
| `PAYOUT_PENDING_ALERT_MINUTES` | OPS-13 | Owner story holds the value |
| `FLAG_HOLD_MAX_HOURS` | OPS-10 | Operator hold expiry |
| `NEW_DEVICE_COOLING_HOURS` | ACC | Also the window for weak ballots (SPD-10) |
| `SHARE_MAX_DESTINATIONS` | RUL-03 | 5 |
| `RULE_CHAIN_DEPTH_MAX` | RUL-06 | Owner story holds the value |
| `LEDGER_TOP_DESTINATIONS_SHOWN` | CON-16 | 5; display count for the "Other" collapse only |
| `ATTACHMENT_MAX_MB`, `ATTACHMENT_TYPES` | SPD-03 | Reused by ANN |
| `PROJECT_ATTACHMENTS_PER_ITEM` | PRJ-07 | Project, decision and report entry points; ANN reuses |
| `QUEUE_*`, `ANN_URGENT_*` | XCT, ANN | Owner stories; ANN urgent cap is derived from the NTF allowance |

Table B, group settings, lowercase `<epic>.<name>` (written without prefix in stories once unambiguous), edited on GRP-12, definitions owned by SPD-02 unless stated. These are not renamed to capitals.

| Name | Owner story | Editor | Note |
| --- | --- | --- | --- |
| `spd.spend_approvals_default` | SPD-02 | GRP-12 | |
| `spd.spend_multi_threshold` | SPD-02 | GRP-12 | |
| `spd.spend_approvals_multi` | SPD-02 | GRP-12 | |
| `spd.spend_vote_threshold` | SPD-02 | GRP-12 | Default: no vote required |
| `spd.freeze_lift_approvals` | SPD-15 | GRP-12 | |
| `spd.freeze_cycle_limit` | SPD-15 | GRP-12 | |
| `spd.request_expiry` | SPD-02 | GRP-12 | Paused while a notice is held |
| `spd.request_stuck_days` | SPD-13 | GRP-12 | 7 |
| `spd.spend_cap_mode` | SPD-14 | GRP-12 | Owner story holds the modes and the default |
| `grp.split_change_requires_vote` | CON gate section | GRP-12 | Value "Never" is removed for any rule that moves money to another wallet |
| `grp.plan_change_requires_vote` | CON gate section | GRP-12 | |
| `change_apply_window_days` | CON gate section | GRP-12 | 7; also applies to freeze-lift votes |

Retention: two names only. `grp.retention_period` is retired and GRP cites `AUDIT_RETENTION_YEARS`. Attachments on expense requests (SPD-03) and ANN attachments use `RECORD_RETENTION_YEARS`; audit data (CON-18, audit log) uses `AUDIT_RETENTION_YEARS`. Retention after a project or group closes stays an open lawyer question. The legal-gate item names both values.

Extra parameters: the floor-failed money vote extension window is 48 hours (reuse VOT-03 criterion 6); a voter counts toward the D4 floor only after a minimum tenure owned by VOT. `vote_late_grace_hours` does not exist.

### 11.3 Statuses

Each object has its own status table in its owning epic. Shared words are namespaced per object and every filter or queue names the object.

- Expense request statuses are the SPD ones (Awaiting approval, Awaiting vote, and so on), never "Pending approval". "Needs a second approver" is a warning on an Active group (EV-GRP-12, `msg.grp.approver_shortage`), never a request status or sub-label.
- Vote results are four: Passed, Not passed (majority not reached), Not passed (quorum not met), Tie. Cancelled is a vote status. VOT owns result names; SPD owns request rejection reasons. Mapping: majority not reached gives "The group did not approve"; quorum not met gives "Quorum not reached".
- Failed-vote key is `msg.vot.expense_failed`; passed is `msg.vot.expense_passed`.
- "Needs attention" belongs to one object at a time (rule, transaction, request, vote, KYC case, discrepancy alert), each defined in its own table.
- Sub-labels never create new status names.

### 11.4 Lock and hold words

Five terms. The bare words "lock" and "frozen" are banned.

| Term | Owner | Meaning |
| --- | --- | --- |
| PIN lock-out | ACC-03 | Too many wrong PINs |
| App lock | ACC-12 | Device-level screen lock |
| Account lock | ACC-11 | The account is locked |
| Wallet freeze | SPD-15 | A member action (`Wallet: freeze`). Banner "Wallet frozen" |
| Operator hold | OPS-10 | UI label "Held by Gereo" |

`wallet_held`: the source wallet is under an operator hold. `destination_held`: the destination wallet is under one. Both display "Held by Gereo". WAL owns the wallet state; OPS-10 owns the hold.

Flow table:

| | Payouts and refunds | Splits and rule transfers | Rounding line | Contributions in |
| --- | --- | --- | --- | --- |
| Wallet freeze | Stopped | Internal continue; outside the group paused | Continues | Continue |
| Operator hold | Stopped | Stopped, every split leg | Stopped | Arrive; credits stay whole in the source wallet |

An operator hold needs a second operator whatever the severity, expires at `FLAG_HOLD_MAX_HOURS`, and is renewed only with a new reason. The group cannot lift it. Holders of `Wallet: approve spend` and `Group: view audit log` are notified with reference and support route, without the reason, by push with SMS fallback. Payouts already Pending finish. A held wallet raises no continuity alarm and no "no approver" recovery vote.

### 11.5 Rule vocabulary and the split-rule floor

- Share rule: one line (one percent, one destination). Split rule: a named set of lines. Engine and ledger work on lines. Audit families: `rule.*` (lines) and `splitrule.*` (sets).
- States: On (shown as Active in CON), Paused, Waiting for vote, Needs attention. CON "Ended" is a soft state that keeps history and is not RUL "deleted". A RUL line delete is recorded in the audit family, with history reachable from the audit log only.
- Split-rule floor: on a group wallet, a split rule can never become Active, nor change percent or destination, by one person's action alone. Creating an Active rule, changing percent or destination, and adding a rule to a wallet that already has Active rules always go through the decision gate. The opt-out is removed. Pause, resume and end stay one-tap and are never gated. Personal wallets are not gated.
- Decision gate fallback order for a rule or plan change that moves money to another wallet: (1) an authority vote when at least three holders of `Vote: vote` exist; (2) otherwise PIN approval from one other holder of `Wallet: edit rules`; (3) otherwise, only if the group has exactly one Active member, the holder saves alone and the audit entry records "Single member, no gate". No other skip exists. The first Active rule on a wallet is gated like any other.
- Skip reason codes for rule firings are listed in RUL-07; a firing that cannot proceed is held with a visible reason, never failed silently.

### 11.6 Ledger chips and Where

Chips: Contribution, Penalty, Income, Split, Rounding, Expense, Transfer, Fee, Share-out, Reversal, Cash-out.

- Expense is reserved for group spending (approved requests and votes) so caps and CON-16 never count a person's own cash-out as spending.
- Cash-out is a personal or group withdrawal to mobile money.
- Deposit and Withdrawal are filter groupings only: Deposit is Income with Where "Mobile money in"; Withdrawal is Cash-out.
- Where values: Mobile money in, Mobile money out, Inside Gereo. The export has Where as its own column. A deposit into a wallet with rules fires splits, and the chip, Where and Rounding must agree (test).

### 11.7 Formats

Dates, numbers and money formats are owned by XCT-02 and XCT-03; other files cite them only.

### 11.8 SMS and notification vocabulary

- Critical: security events and group-money safety events (codes, new device, PIN or phone change, account lock and unlock, hostile-deletion alarm ACC-15, freeze applied). NTF-09 owns the definition. Only Critical bypasses quiet hours.
- A payout authorised by a passed vote is never dispatched during quiet hours; it is held until quiet hours end. VOT-01 refuses or snaps a money-vote or authority-vote deadline inside quiet hours to the next slot inside 07:00 to 21:00.
- Reminder scheduling (NTF-09): a planned reminder whose time falls inside quiet hours is sent at quiet hours end if at least `ntf.reminder_margin_minutes` remain before the target time, otherwise at the latest slot before quiet hours begin the evening before.
- NTF owns the SMS ladder, windows, daily cap, group allowance, batching, opt-out and the catalogue. OPS-12 owns the dashboard and alerts.

## 12. Glossary

| Term | Meaning |
| --- | --- |
| Distinct person | One Active member with a PIN account. Guests and operator-console sessions are not distinct persons for the floor |
| Floor (no single person) | See GRP-13 and VOT "Kinds of vote". Fixed, no setting |
| Authority vote | See VOT "Kinds of vote" |
| money-out tier | The lowest tier whose single money-out limit covers the amount. Needed by whoever approves money-out, and by the requester on the vote path. Never by a voter |
| money-out capable | A tier whose single money-out limit is above zero |
| Decision gate (CON) | A passed vote that authorises a change to terms, bound to an exact snapshot, applied within `change_apply_window_days`. See the shared gate section of `CON-contributions.md` |
| Held by Gereo (WAL) | Wallet state set by an operator compliance hold (OPS-10); stops all money-out including split legs, not incoming money |
| Reserved, In transit, Set aside not sent | Money states in conventions 10.4 |
| Rounding | The D5 leftover line to Gereo, conventions 10.6 |
| Platform: SMS allowance | A Gereo income line, conventions 10.5 |
| hop 0 | The original deposit of a chain, conventions 10.1 |
| class (a), (b), (c) | Authorisation classes, conventions 10.3 |
| Critical | Conventions 11.8 |

## 13. Verification

Reference check (run in the story-map build, derived from story headings):

1. Every `XXX-nn` cited exists as a heading.
2. Every `EV-XXX-nn` exists in the NTF catalogue.
3. Every `msg.*` key matches the grammar in 11.1 and exists in the catalogue, and is emitted by exactly one story.
4. Every "ID criterion N" and "ID open question N" points to an existing item that is not closed.
5. Bare epic names appear only in the allow-list contexts.
6. `RULE_CHAIN_DEPTH_MAX`, `PAYOUT_PROVIDER_WAIT_MAX`, `PAYOUT_PENDING_ALERT_MINUTES`, `RECON_RUN_TIME` and `spend_cap_mode` are each defined once.
7. No file contains `STALE_BALANCE_AFTER`, `OFFLINE_CACHE_DEPTH`, `CON_GATE_APPLY_WINDOW_DAYS`, `QUEUE_MAX_AGE`, `grp.retention_period`, `self_approval_allowed`, "Group: view permissions", or a "(SPD)" or "(WAL)" citation as owner of a retention parameter.
8. Every Auto-send row of the XCT-05 registry has side-effect class `none`, except `membership-self`.

Story index and story map: WAL-17 is marked "wallet slice of XCT-04".

## 14. Founder decisions

Founder decisions D1 to D6 are in [05-decisions.md](05-decisions.md) and override any story. In short: D1 no self-approval; D2 wallet-level permissions (names in section 7); D3 every deposit is income, so rules chain; D4 a passed vote authorises spending, with at least two distinct voters other than the requester; D5 the split leftover goes to Gereo as a visible Rounding line; D6 XCT-05 owns the device queue. When a story contradicts a decision, the story is wrong.
