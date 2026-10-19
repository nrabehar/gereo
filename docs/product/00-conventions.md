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
- Identity verification (KYC) is done by Gereo. Money-in and money-out need a verified identity at the right tier. Browsing, joining and voting need only phone and OTP.
- Payments go through Vanilla Pay behind a payment adapter so another rail can replace it. The legal basis for holding client funds is unconfirmed; stories that move or hold money carry the tag `legal-gate`.
- The product must work on low-end Android phones and slow connections. Anything critical has an SMS path. Money-out is online only. Everything else the person needs to read works offline from cache with a "last synced" time.
- Languages: Malagasy, French, English from the start. Stories never hard-code text; they refer to message keys.
- The database is read-only for assistants working on this repo. Stories describe behaviour; they do not run migrations.
- Everything written in the repository is in English.

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
**Permission needed:** none | <permission name from info.md>
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
5. Notifications: push, SMS, or none, and the message key.
6. Ledger and audit: entries written, who and when.
7. Accessibility and language: only what is specific to this story.

**Data:** objects read or written (from the object model).
**Depends on:** story IDs.
**Pages:** to be filled from the information architecture.
**Open questions:** ...
```

Priority meaning: P0 the MVP does not make sense without it. P1 needed before general availability. P2 improves it.

Keep 6 to 10 acceptance criteria per story. If a story needs more, split it.

## 7. Permission names

From the object model in `info.md`.

| Object | Permissions |
| --- | --- |
| Group | view group, invite member, remove member, view permissions, grant permission, revoke permission, enable module, edit group, delete group |
| Wallet | view balance, view history, deposit, initiate spend, approve spend, edit rules, export history, close |
| Contribution plan | view, edit, exempt member, send reminder, delete |
| Project | view, edit, manage budget, manage tasks, approve purchase, manage team, close |
| Vote | view, vote, create, close, edit |
| Event | view, create, edit, invite |
| Document | view, add, edit, delete, share |
| Publication | publish, announce to group, moderate |

Business rules such as thresholds and mandatory votes live in product logic, not in the permission system. Every permission change is written to the audit log.

## 8. Object model (summary)

User, Group, Membership, Wallet, Wallet rule, Ledger entry, Transaction, Contribution plan, Contribution, Project, Task, Decision, Event, RSVP, Document, Vote, Ballot, Expense request, Approval, Announcement, Campaign, Notification, Device, Identity check, Audit entry, Support ticket.

The information architecture file turns these into pages and navigation.

## 9. Traceability

Every story cites the evidence behind it (research file and section) in its Conversation. Every wireframe will cite the story IDs it satisfies. A story with no page and a page with no story are both defects.
