# Information architecture: objects, permissions and traceability

This file is the fourth step of the order of work in [00-conventions.md](00-conventions.md). It is derived from the 196 story cards in `stories/` and from decisions D1 to D7 in [05-decisions.md](05-decisions.md). When a story and this file disagree, the story card and the decision win and this file is wrong.

Sections 1 to 3 are generated from the card fields (Actor, Permission needed, Data). Section 4 and 5 restate the owner catalogues without changing them. The screen inventory per story is in `screens/`; the unified surface list and the navigation are in the files named in section 7.

## 1. Objects

The object model of conventions section 8 lists 26 objects. Reading the Data field of every card finds the objects below. The count is the number of stories that read or write the object. An object that appears here and not in conventions section 8 is a supporting object the stories already use.

| Object | Stories that read or write it | Count |
| --- | --- | --- |
| Audit entry | ACC-02, ACC-03, ACC-04, ACC-05, ACC-06, ACC-08, ACC-09, ACC-10, ACC-11, ACC-12, ACC-13, ACC-14, ACC-15, ACC-16, ANN-01, ANN-03, ANN-04, ANN-05, ANN-07, ANN-08, CON-01, CON-02, CON-04, CON-05, CON-07, CON-08, CON-09, CON-10, CON-11, CON-13, CON-14, CON-15, CON-18, CON-20, EVT-01, EVT-02, EVT-03, EVT-04, EVT-05, EVT-06, EVT-07, EVT-09, GRP-01, GRP-02, GRP-03, GRP-04, GRP-08, GRP-10, GRP-11, GRP-12, GRP-13, GRP-14, GRP-15, GRP-16, GRP-17, GRP-18, GRP-19, GRP-20, NTF-03, NTF-04, NTF-06, NTF-10, NTF-12, OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06, OPS-07, OPS-08, OPS-09, OPS-10, OPS-11, OPS-12, OPS-13, OPS-14, PRJ-01, PRJ-02, PRJ-03, PRJ-04, PRJ-06, PRJ-07, PRJ-09, PRJ-11, PRJ-12, RUL-03, RUL-06, RUL-07, RUL-08, RUL-09, RUL-10, RUL-11, RUL-12, RUL-13, SPD-01, SPD-03, SPD-05, SPD-06, SPD-07, SPD-08, SPD-09, SPD-10, SPD-11, SPD-12, SPD-13, SPD-14, SPD-15, SPD-16, VOT-01, VOT-02, VOT-03, VOT-04, VOT-06, VOT-07, VOT-08, VOT-09, VOT-10, VOT-11, VOT-12, VOT-13, VOT-14, VOT-15, VOT-17, VOT-18, WAL-01, WAL-04, WAL-05, WAL-06, WAL-07, WAL-08, WAL-10, WAL-11, WAL-12, WAL-13, WAL-14, WAL-16, WAL-18, WAL-20, XCT-03, XCT-05, XCT-06 | 142 |
| Notification | ACC-02, ACC-05, ACC-08, ACC-09, ACC-11, ACC-14, ACC-16, ANN-01, ANN-03, ANN-04, ANN-06, ANN-07, CON-01, CON-02, CON-04, CON-05, CON-07, CON-08, CON-09, CON-10, CON-13, CON-14, CON-15, CON-18, EVT-01, EVT-03, EVT-05, EVT-06, EVT-07, EVT-10, GRP-03, NTF-01, NTF-02, NTF-05, NTF-08, NTF-11, NTF-12, NTF-13, NTF-14, OPS-03, OPS-05, OPS-06, OPS-07, OPS-08, OPS-10, OPS-12, PRJ-01, PRJ-04, PRJ-09, RUL-07, RUL-09, RUL-10, RUL-11, RUL-13, SPD-01, SPD-04, SPD-05, SPD-06, SPD-07, SPD-09, SPD-10, SPD-11, SPD-12, SPD-14, SPD-15, VOT-01, VOT-07, VOT-08, VOT-09, VOT-10, VOT-12, VOT-15, WAL-07, WAL-08, WAL-11, WAL-13, WAL-16, WAL-18, XCT-06, XCT-12 | 80 |
| Ledger entry | ACC-14, ANN-05, ANN-06, ANN-07, ANN-08, CON-04, CON-05, CON-09, CON-12, CON-14, CON-15, CON-16, CON-17, CON-18, CON-19, GRP-06, GRP-13, GRP-20, NTF-06, OPS-04, OPS-05, OPS-13, PRJ-03, PRJ-05, PRJ-08, RUL-01, RUL-04, RUL-05, RUL-07, RUL-09, RUL-10, RUL-11, RUL-12, SPD-10, SPD-11, SPD-13, SPD-14, SPD-16, VOT-03, VOT-13, VOT-16, WAL-02, WAL-03, WAL-07, WAL-08, WAL-10, WAL-11, WAL-12, WAL-13, WAL-14, WAL-15, WAL-16, WAL-17, WAL-18, WAL-19, XCT-02, XCT-04, XCT-06 | 58 |
| Transaction | ACC-15, ANN-05, ANN-06, CON-03, CON-04, CON-05, CON-06, CON-14, CON-16, CON-18, OPS-04, OPS-05, OPS-06, OPS-08, OPS-10, OPS-11, OPS-13, RUL-07, RUL-12, SPD-10, SPD-11, SPD-16, WAL-03, WAL-05, WAL-06, WAL-07, WAL-08, WAL-09, WAL-10, WAL-11, WAL-12, WAL-13, WAL-14, WAL-15, WAL-16, WAL-17, WAL-18, WAL-20, XCT-02, XCT-04, XCT-06 | 41 |
| Membership | ACC-15, ACC-16, ANN-02, CON-01, CON-03, CON-06, CON-07, CON-10, CON-20, EVT-01, EVT-03, EVT-04, GRP-01, GRP-02, GRP-04, GRP-05, GRP-07, GRP-08, GRP-09, GRP-14, GRP-16, GRP-17, PRJ-01, PRJ-02, PRJ-04, PRJ-06, PRJ-10, RUL-01, SPD-01, SPD-02, SPD-04, SPD-08, VOT-01, VOT-04, VOT-05, VOT-06, VOT-14, WAL-01, WAL-02, XCT-04 | 40 |
| Wallet | ACC-15, ANN-04, ANN-05, CON-01, CON-04, CON-11, CON-12, CON-16, GRP-01, GRP-06, GRP-15, GRP-19, PRJ-03, PRJ-10, PRJ-12, RUL-02, RUL-03, RUL-04, RUL-05, RUL-10, SPD-01, SPD-02, SPD-05, SPD-10, SPD-12, SPD-15, WAL-01, WAL-02, WAL-03, WAL-04, WAL-05, WAL-06, WAL-09, WAL-13, WAL-17, WAL-19 | 36 |
| Vote | ACC-16, CON-13, GRP-06, GRP-13, GRP-14, OPS-14, PRJ-05, PRJ-08, PRJ-09, PRJ-11, RUL-08, RUL-13, SPD-09, SPD-10, SPD-12, VOT-01, VOT-02, VOT-03, VOT-04, VOT-05, VOT-06, VOT-07, VOT-08, VOT-09, VOT-10, VOT-11, VOT-12, VOT-13, VOT-16, VOT-17, VOT-18, WAL-12, XCT-03, XCT-04 | 34 |
| Wallet rule | ACC-15, CON-11, CON-12, CON-13, CON-14, CON-15, CON-16, CON-19, GRP-12, RUL-01, RUL-02, RUL-03, RUL-04, RUL-05, RUL-06, RUL-07, RUL-08, RUL-09, RUL-10, RUL-11, RUL-12, RUL-13, SPD-14, WAL-02, WAL-03, WAL-04, WAL-05, WAL-14, WAL-15, WAL-17, WAL-19, XCT-04 | 32 |
| Expense request | ACC-15, ANN-08, GRP-17, PRJ-03, PRJ-05, PRJ-07, PRJ-08, PRJ-09, PRJ-11, SPD-01, SPD-03, SPD-04, SPD-05, SPD-06, SPD-07, SPD-08, SPD-09, SPD-10, SPD-11, SPD-12, SPD-13, SPD-14, SPD-15, SPD-16, VOT-03, VOT-13, VOT-16, XCT-05 | 28 |
| Device | ACC-02, ACC-03, ACC-04, ACC-05, ACC-08, ACC-11, ACC-12, ACC-14, CON-08, EVT-03, EVT-05, NTF-01, NTF-02, NTF-03, NTF-05, OPS-02, OPS-03, OPS-06, OPS-10, VOT-07, VOT-18, WAL-10, WAL-17, XCT-01 | 24 |
| Decision | CON-02, CON-11, CON-13, CON-16, OPS-14, PRJ-05, PRJ-07, PRJ-09, PRJ-11, PRJ-12, RUL-13, SPD-09, SPD-13, SPD-16, VOT-03, VOT-08, VOT-09, VOT-10, VOT-11, VOT-12, VOT-13, VOT-14, VOT-15, VOT-16 | 24 |
| User | ACC-02, ACC-03, ACC-04, ACC-05, ACC-06, ACC-07, ACC-08, ACC-09, ACC-10, ACC-11, ACC-12, ACC-13, ACC-14, ACC-15, ACC-16, GRP-05, OPS-02, OPS-03, OPS-06, OPS-10, WAL-01, WAL-13, XCT-01 | 23 |
| Contribution | ACC-14, ACC-15, ANN-05, ANN-07, CON-01, CON-02, CON-03, CON-04, CON-05, CON-06, CON-07, CON-08, CON-09, CON-10, CON-19, GRP-06, GRP-16, XCT-04 | 18 |
| Approval | CON-16, GRP-06, GRP-08, GRP-13, GRP-16, GRP-17, PRJ-05, SPD-04, SPD-05, SPD-06, SPD-07, SPD-08, SPD-10, SPD-12, SPD-13, SPD-15, SPD-16, WAL-12 | 18 |
| Project | CON-11, EVT-08, EVT-09, PRJ-01, PRJ-02, PRJ-03, PRJ-04, PRJ-05, PRJ-06, PRJ-08, PRJ-09, PRJ-10, PRJ-11, PRJ-12, SPD-05, SPD-13, VOT-16 | 17 |
| Event | EVT-01, EVT-02, EVT-03, EVT-04, EVT-05, EVT-06, EVT-07, EVT-08, EVT-09, EVT-10, EVT-11, GRP-06, PRJ-11, XCT-03, XCT-04 | 15 |
| Group | ANN-01, EVT-01, EVT-08, GRP-01, GRP-03, GRP-04, GRP-06, GRP-18, GRP-19, GRP-20, PRJ-01, WAL-01 | 12 |
| Support ticket | ACC-04, ACC-11, ACC-14, CON-05, CON-15, CON-17, OPS-06, OPS-07, SPD-11, WAL-14, WAL-18 | 11 |
| Ballot | ACC-14, ACC-16, VOT-04, VOT-05, VOT-06, VOT-07, VOT-08, VOT-11, VOT-17, VOT-18, XCT-05 | 11 |
| Identity check | ACC-04, ACC-05, ACC-07, ACC-08, ACC-09, ACC-10, ACC-14, OPS-02, OPS-03, OPS-06 | 10 |
| Delivery attempt | NTF-02, NTF-05, NTF-06, NTF-07, NTF-08, NTF-09, NTF-11, NTF-12, NTF-13 | 9 |
| Consent record | ACC-02, ACC-10, ACC-13, ACC-14, ACC-15, NTF-03, NTF-04, NTF-10 | 8 |
| RSVP | EVT-02, EVT-03, EVT-04, EVT-05, EVT-06, EVT-07, EVT-08, XCT-05 | 8 |
| Document | ANN-08, PRJ-07, PRJ-11, SPD-03, SPD-16, VOT-14, VOT-16 | 7 |
| Notification preference | NTF-03, NTF-04, NTF-05, NTF-09, NTF-10, NTF-13, NTF-14 | 7 |
| Contribution plan | CON-01, CON-02, CON-03, CON-06, CON-09, XCT-03 | 6 |
| Task | PRJ-04, PRJ-08, PRJ-09, PRJ-11, PRJ-12, XCT-05 | 6 |
| Rule firing | RUL-01, RUL-07, RUL-09, RUL-10, RUL-11, RUL-12 | 6 |
| Invitation | ACC-16, GRP-03, GRP-04, GRP-05, NTF-11 | 5 |
| Announcement | ANN-01, ANN-02, ANN-03, ANN-04, ANN-08 | 5 |
| Campaign | ANN-04, ANN-05, ANN-06, ANN-07, ANN-08 | 5 |
| Permission | CON-20, RUL-02, RUL-13, SPD-02, SPD-08 | 5 |
| Message catalogue | XCT-01, XCT-02, XCT-13, XCT-14 | 4 |
| Tier configuration | ACC-07, OPS-11, WAL-09 | 3 |
| Reconciliation run | CON-17, OPS-04, OPS-05 | 3 |
| Ledger account | GRP-15, WAL-01 | 2 |
| Incident | OPS-08, OPS-13 | 2 |
| SMS template catalogue | OPS-12, XCT-12 | 2 |
| Raw provider event | WAL-07, WAL-11 | 2 |
| Saved recipient | WAL-09, WAL-10 | 2 |
| Queue item | XCT-05, XCT-06 | 2 |
| Device language setting | ACC-01 | 1 |
| Read state | ANN-02 | 1 |
| Report | ANN-08 | 1 |
| Note | EVT-10 | 1 |
| Bundle definition | GRP-07 | 1 |
| Permission check results | GRP-09 | 1 |
| Threshold settings | GRP-09 | 1 |
| SMS allowance | NTF-06 | 1 |
| Message template | NTF-07 | 1 |
| Suppression entry | NTF-10 | 1 |
| Ballot link | NTF-11 | 1 |
| Operator | OPS-01 | 1 |
| Discrepancy alert | OPS-05 | 1 |
| Flag | OPS-10 | 1 |
| Rule definition | OPS-10 | 1 |
| Fee schedule | OPS-11 | 1 |
| Tax line | OPS-11 | 1 |
| Aggregator rate | OPS-12 | 1 |
| Provider response | OPS-13 | 1 |
| Platform job alert | OPS-14 | 1 |
| Permission grant | PRJ-06 | 1 |
| Spending policy | SPD-02 | 1 |
| Group or Project | VOT-01 | 1 |
| Group settings | VOT-02 | 1 |
| Phone verification | VOT-06 | 1 |
| Payment adapter request | WAL-06 | 1 |
| Provider health state | WAL-08 | 1 |
| Export file | WAL-16 | 1 |
| Device setting | WAL-19 | 1 |
| Reconciliation result | WAL-20 | 1 |
| Document note | XCT-05 | 1 |
| Draft | XCT-05 | 1 |
| Device settings | XCT-07 | 1 |
| Measured transfer counters | XCT-07 | 1 |
| Screenshot baselines | XCT-13 | 1 |
| Glossary | XCT-14 | 1 |

## 2. Actors against the stories

| Actor (as written on the card) | Count |
| --- | --- |
| Member | 38 |
| Permission holder | 36 |
| Individual | 19 |
| System | 16 |
| Gereo operator | 15 |
| Individual, Permission holder | 13 |
| Individual, Member | 7 |
| Visitor | 4 |
| Individual, Member, Permission holder | 4 |
| Member or Permission holder | 4 |
| Member, Permission holder, Gereo operator (read) | 2 |
| Group founder | 2 |
| Permission holder (holds Group: delete group) | 2 |
| Member; Permission holder | 2 |
| Individual, Member, System | 2 |
| Member, and System at the deadline | 1 |
| Permission holder (or Group founder, who holds all permissions at the start) | 1 |
| Permission holder, and Member (read) | 1 |
| Individual (becomes Group founder) | 1 |
| Permission holder (holds Group: invite member) | 1 |
| Visitor (becomes Member) | 1 |
| Permission holder (holds Group: grant permission) | 1 |
| Permission holder (holds Group: grant permission or revoke permission) | 1 |
| Permission holder; Gereo operator | 1 |
| Permission holder (holds Group: set spending policy) | 1 |
| Member (protected); System (enforces) | 1 |
| Permission holder; System | 1 |
| Permission holder (holds Wallet: create) | 1 |
| Permission holder (holds Group: remove member) | 1 |
| Permission holder (holds Group: edit group) | 1 |
| Permission holder (holds Group: set notification settings) | 1 |
| System (and the team that writes templates) | 1 |
| Visitor; Guest voter; Member without a smartphone | 1 |
| Individual (own wallet); Permission holder with Wallet: edit rules for a group wallet through CON-11 | 1 |
| Permission holder, Group founder, Member | 1 |
| Member (the requester) | 1 |
| Permission holder or Member (requester) | 1 |
| Requester, Permission holder, System | 1 |
| Member (the requester), Permission holder or System (expiry) | 1 |
| Permission holder (sets); System (enforces) | 1 |
| Guest voter | 1 |
| System, and Permission holder for early close | 1 |
| Individual (own wallet) or Group founder or Permission holder (group wallet) | 1 |
| Individual, System | 1 |
| Gereo operator, System | 1 |

## 3. Action to permission matrix

One row per story, copied from the card. "none" means the card asks for no permission beyond being the right actor. Permission names are those of conventions section 7 for members and of OPS-01 for operators.

| Story | Title | Priority | Actor | Permission needed |
| --- | --- | --- | --- | --- |
| ACC-01 | Choose my language and look around before I register | P0 | Visitor | none |
| ACC-02 | Sign up with my phone number and a code by SMS | P0 | Visitor | none |
| ACC-03 | Set my PIN and choose biometric unlock | P0 | Individual | none |
| ACC-04 | Reset my PIN myself, without an agent | P0 | Individual | none |
| ACC-05 | Sign in on a new phone, or after changing my SIM, and keep my account safe | P0 | Individual | none |
| ACC-06 | Keep my profile up to date: name, language and preferred currency | P1 | Individual | none |
| ACC-07 | See what I can do now and what unlocks next (tier ladder) | P0 | Individual | none |
| ACC-08 | Photograph my ID and take a selfie | P0 | Individual | none |
| ACC-09 | Follow my verification: pending, approved, or rejected with a reason and a retry | P0 | Individual | none |
| ACC-10 | Be registered by a facilitator who helps me in person | P1 | Individual | none for the person; the facilitator is a Member holding Group: invite member in at least one group (GRP-03) |
| ACC-11 | See my connected devices and lock my account in an emergency | P0 | Individual | none |
| ACC-12 | Sign out, and be signed out safely when I stop using the app | P1 | Individual | none |
| ACC-13 | Read and agree to the terms and privacy notice in my language | P0 | Visitor | none |
| ACC-14 | Export a copy of my data | P1 | Individual | none for personal data. Exporting a group wallet's history needs Wallet: export history on that wallet and is handled in WAL-16 and CON-18 |
| ACC-15 | Delete my account, and be told what stops me | P1 | Individual | none |
| ACC-16 | Open an invite or vote link without an account | P0 | Visitor | none (the link carries the right to join or vote; see GRP and VOT) |
| ANN-01 | Publish an announcement to the group | P1 | Permission holder | Publication: announce to group |
| ANN-02 | Read the group's announcements and see what is new | P1 | Member | Group: view group |
| ANN-03 | Pin, correct or withdraw an announcement | P2 | Permission holder | Publication: announce to group (pin and unpin any announcement; edit and withdraw one's own); Publication: moderate (hide any) |
| ANN-04 | Start a special contribution campaign inside the group | P1 | Permission holder | Publication: announce to group and Wallet: initiate spend on the destination wallet |
| ANN-05 | Give to a campaign | P1 | Member | Wallet: deposit on the destination group wallet (in the Member bundle, GRP-07); the sender's own wallet needs none |
| ANN-06 | Get a receipt for every contribution | P1 | Member | none (own contribution) |
| ANN-07 | Follow the campaign's progress and close it | P1 | Member, and System at the deadline | Group: view group (see); a holder of both permissions of ANN-04 (close early) |
| ANN-08 | Publish a report on how the money was used | P1 | Permission holder | the two permissions of ANN-04 (Publication: announce to group and Wallet: initiate spend on the destination wallet); a campaign-specific permission is noted for later |
| CON-01 | Create a contribution plan | P0 | Permission holder (or Group founder, who holds all permissions at the start) | Contribution plan: edit |
| CON-02 | Edit, pause and end a plan, changes apply to future due dates only | P0 | Permission holder | Contribution plan: edit (delete needs Contribution plan: delete) |
| CON-03 | Member's due items and history | P0 | Member | none (own items) |
| CON-04 | Pay a contribution invoice-first | P0 | Member | none (own item) |
| CON-05 | Handle pending and failed contributions | P0 | Member | none |
| CON-06 | Member status board | P0 | Permission holder, and Member (read) | Contribution plan: view |
| CON-07 | Send a reminder to a late or pending member | P1 | Permission holder | Contribution plan: send reminder |
| CON-08 | Automatic reminders, push then SMS | P0 | System | none (configured by Contribution plan: edit) |
| CON-09 | Apply a late fee | P1 | System | none (configured by Contribution plan: edit; waived by Contribution plan: exempt member) |
| CON-10 | Exempt a member | P1 | Permission holder | Contribution plan: exempt member |
| CON-11 | Define income split rules on a group wallet | P0 | Permission holder | Wallet: edit rules |
| CON-12 | Preview a split rule on past income | P0 | Permission holder | Wallet: edit rules (and Wallet: view history for the real-history preview) |
| CON-13 | Change, pause or end a split rule, future income only | P1 | Permission holder | Wallet: edit rules |
| CON-14 | Execute the split automatically when income arrives | P0 | System | none (rule authorised by CON-11 and, if required, a vote) |
| CON-15 | Split execution failure and retry | P1 | Permission holder | Wallet: edit rules |
| CON-16 | Group ledger transparency view | P0 | Member | Wallet: view balance and Wallet: view history |
| CON-17 | Reconciliation line on the group ledger | P1 | Member | Wallet: view balance |
| CON-18 | Export the ledger for meetings and accounting | P1 | Permission holder | Wallet: export history |
| CON-19 | A member sees where their contribution went | P2 | Member | none (own contributions); Wallet: view history for the group-level lists |
| CON-20 | Permission checks and audit log for contributions and splits | P0 | Member, Permission holder, Gereo operator (read) | Contribution plan: view (plan log); Wallet: view history (rule log) |
| EVT-01 | Create an event for the group | P0 | Permission holder | Event: create (and Event: invite to notify the audience) |
| EVT-02 | Repeat an event every week or every month | P1 | Permission holder | Event: create (set), Event: edit (change) |
| EVT-03 | Invite the whole group or chosen members | P0 | Permission holder | Event: invite |
| EVT-04 | Say "going", "maybe" or "no" in one tap and see who is coming | P0 | Member | Event: view |
| EVT-05 | Get automatic reminders, by push then SMS if not opened | P0 | System | none (automatic); Event: edit to change times |
| EVT-06 | Change an event and tell everyone | P1 | Permission holder | Event: edit |
| EVT-07 | Cancel an event and tell everyone | P1 | Permission holder | Event: edit |
| EVT-08 | See upcoming events as a list and as a calendar | P0 | Member | Event: view |
| EVT-09 | Link an event to a project | P1 | Permission holder | Event: edit and Project: view |
| EVT-10 | Remember a date and keep a private note | P2 | Individual | none (own entity) |
| EVT-11 | Add an event to my phone's calendar | P2 | Member | Event: view |
| GRP-01 | Start a group for the people I save with | P0 | Individual (becomes Group founder) | none |
| GRP-02 | Start with every permission, and say so | P0 | Group founder | none (written by the system at creation) |
| GRP-03 | Invite people by link or by phone number | P0 | Permission holder (holds Group: invite member) | Group: invite member |
| GRP-04 | See the rules before I join, then join or decline | P0 | Visitor (becomes Member) | none (a valid invite) |
| GRP-05 | See who is in the group | P0 | Member | Group: view group |
| GRP-06 | Open the group and see where things stand | P0 | Member | Group: view group (balance tile also needs Wallet: view balance) |
| GRP-07 | See what each kind of member can do, in plain words | P0 | Permission holder (holds Group: grant permission) | Group: grant permission, Group: view group |
| GRP-08 | Give or take away a single permission | P0 | Permission holder (holds Group: grant permission or revoke permission) | Group: grant permission to give, Group: revoke permission to take away |
| GRP-09 | See what a person can and cannot do right now | P1 | Member | none for one's own panel; Group: view group for others |
| GRP-10 | See who changed access, and when | P0 | Member | Group: view audit log (own history needs none) |
| GRP-11 | Keep a complete audit log of group-level actions | P0 | Permission holder; Gereo operator | Group: view audit log (operator access is an operator permission defined in OPS-01 and OPS-09, not a member permission) |
| GRP-12 | Set the amount above which more people must agree | P0 | Permission holder (holds Group: set spending policy) | Group: set spending policy |
| GRP-13 | No single person can move the group's money alone | P0 | Member (protected); System (enforces) | none (rule applies to every outflow) |
| GRP-14 | Keep the group from locking itself out | P0 | Permission holder; System | Group: revoke permission, remove member (to attempt the actions that trigger it) |
| GRP-15 | Open another wallet inside the group | P1 | Permission holder (holds Wallet: create) | Wallet: create |
| GRP-16 | Leave a group and know what happens to my money | P0 | Member | none |
| GRP-17 | Remove someone from the group | P0 | Permission holder (holds Group: remove member) | Group: remove member |
| GRP-18 | Change the group's name, purpose and rules text | P1 | Permission holder (holds Group: edit group) | Group: edit group |
| GRP-19 | Close a group but keep its history | P1 | Permission holder (holds Group: delete group) | Group: delete group |
| GRP-20 | Delete a group, within what the law lets us | P2 | Permission holder (holds Group: delete group) | Group: delete group |
| NTF-01 | See everything that happened and open it in one tap | P0 | Member | none (each person sees only their own notifications) |
| NTF-02 | Know whether the message reached the person | P1 | Member; Permission holder | none for one's own items; Contribution plan: send reminder or Vote: create to see per-recipient delivery for items they sent |
| NTF-03 | Ask to send notifications only after the app has proved useful | P0 | Member | none |
| NTF-04 | Choose what I get and how | P0 | Member; Permission holder | none for a member's own choices; Group: set notification settings for the group's SMS settings (NTF-06) |
| NTF-05 | Push first, then SMS only if nobody opened the push | P0 | System | none |
| NTF-06 | Keep SMS cost under control and say who pays | P0 | Permission holder (holds Group: set notification settings) | Group: set notification settings (decision D2); a top-up still routes through the spending policy and needs Wallet: initiate spend to request it |
| NTF-07 | Write every SMS so it fits in one short message, in three languages | P0 | System (and the team that writes templates) | none |
| NTF-08 | Turn a flood into one message | P1 | System | none |
| NTF-09 | Do not wake people at night | P1 | Member | none |
| NTF-10 | Stop SMS any time, and restart it on my terms | P0 | Member | none |
| NTF-11 | Reach people who do not have the app | P0 | Visitor; Guest voter; Member without a smartphone | none |
| NTF-12 | Let operators see what was sent, and why | P0 | Gereo operator | operator permission `view notification log`; `reveal message text` to see a message body (both are in the operator catalogue owned by OPS-01, which is separate from member permissions) |
| NTF-13 | When the SMS cannot be delivered | P0 | System | none |
| NTF-14 | One calm summary a week | P2 | Member | none |
| OPS-01 | Sign in to the back office and see only what my permissions allow | P0 | Gereo operator | none to sign in; `manage operator access` to grant or revoke permissions to another operator |
| OPS-02 | See the KYC review queue and pick the next case | P0 | Gereo operator | `review identity checks` |
| OPS-03 | Decide a KYC case: approve, reject with a reason, or ask for a retake | P0 | Gereo operator | `review identity checks` |
| OPS-04 | Check the ledger against the provider's records every day and see the result | P0 | Gereo operator | `view reconciliation` |
| OPS-05 | Get alerted to a discrepancy and resolve it with a reversing entry | P0 | Gereo operator | `resolve discrepancy`; the correction itself needs a second operator who holds `approve ledger correction` |
| OPS-06 | Handle support tickets with the full context | P0 | Gereo operator | `handle tickets` |
| OPS-07 | Show the person the true status of their ticket | P1 | Gereo operator | `handle tickets` |
| OPS-08 | Post a "provider unavailable" banner and keep it up to date | P0 | Gereo operator | `publish incident` |
| OPS-09 | Search the audit log | P0 | Gereo operator | `search audit log` |
| OPS-10 | Review fraud and anomaly flags | P1 | Gereo operator | `manage flags` |
| OPS-11 | Configure tier limits and fees, with a second person and a start date | P0 | Gereo operator | `edit limits and fees` to propose; `approve limits and fees` for a second person to apply |
| OPS-12 | Watch SMS spending and delivery | P1 | Gereo operator | `view sms costs` |
| OPS-13 | Watch and steer the payout queue | P0 | Gereo operator | `manage payouts` |
| OPS-14 | Watch the vote and decision-log jobs | P1 | Gereo operator | `watch platform jobs` |
| PRJ-01 | Start a project from a ready-made template in about a minute | P0 | Permission holder | Project: edit, held at group level (closed: there is no separate "create project" permission; permissions are inherited from the group, so a holder of Project: edit on the group can create projects in it) |
| PRJ-02 | Open a project and see what it is about, who owns it and where it stands | P0 | Member | Project: view |
| PRJ-03 | Link a budget to one wallet and see spent against planned | P0 | Permission holder | Project: manage budget, and Wallet: view balance on the chosen wallet |
| PRJ-04 | Keep a short list of tasks and milestones | P1 | Permission holder | Project: manage tasks. The task owner may also change the status of their own task without it (closed, see Conversation) |
| PRJ-05 | See every expense request and decision that belongs to the project | P0 | Member | Project: view |
| PRJ-06 | Let the project follow the group's permissions, and narrow them when needed | P1 | Group founder | Group: grant permission and Group: revoke permission, applied to this project (closed) |
| PRJ-07 | Attach a file to a decision or an expense request | P1 | Member | Vote: create (decisions, as VOT-14 and VOT-15). For an expense request the rules of SPD-03 apply and this story only adds the entry point from the project |
| PRJ-08 | Read a one-page summary of how the project is going | P1 | Member | Project: view |
| PRJ-09 | Close a project and keep its record | P1 | Permission holder | Project: close |
| PRJ-10 | List all the projects of a group | P1 | Member | Project: view (per project); Group: view group |
| PRJ-11 | Follow the project as one timeline of tasks, requests and decisions | P2 | Member | Project: view |
| PRJ-12 | Run a personal project on my own | P2 | Individual | none (own entity) |
| RUL-01 | See the rules on a wallet and whether they are working | P0 | Individual, Member, Permission holder | none for own wallets; Wallet: view balance to see rules on a group wallet (read-only), Wallet: edit rules to change them |
| RUL-02 | Choose one of four ready-made rules | P0 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-03 | Build a share rule as one sentence | P0 | Individual (own wallet); Permission holder with Wallet: edit rules for a group wallet through CON-11 | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-04 | See what a rule would have done with my real recent incomes | P0 | Individual, Permission holder | none for own wallets; Wallet: edit rules and Wallet: view history for a group wallet |
| RUL-05 | See everything that happens when money arrives, in one place | P0 | Individual, Member, Permission holder | none for own wallets; Wallet: view balance for a group wallet |
| RUL-06 | Stop a rule that would send money in a circle | P0 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-07 | Apply my rules automatically when income arrives | P0 | System | none (rule authorised at definition time, class (b) of conventions 10.4) |
| RUL-08 | Pause, resume, edit or delete a rule, for future income only | P1 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-09 | Set a spending cap and be alerted when it is reached | P1 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet (rule and goal edits stay on this permission, which is in the money-out class); the cap mode of a group wallet is a spending-policy item under Group: set spending policy (SPD-14) |
| RUL-10 | Set a goal with a target date and follow it | P1 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-11 | Be told when a wallet falls below a level I chose | P2 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet |
| RUL-12 | See every time a rule ran, and every time it did not | P0 | Individual, Member, Permission holder | none for own wallets; Wallet: view history for a group wallet |
| RUL-13 | Who may change rules on a group wallet, and how it ties to group split rules | P0 | Permission holder, Group founder, Member | Wallet: edit rules (money-out class: PIN on grant) to create, change, pause, resume or delete any rule on a group wallet; Wallet: view balance to read them |
| SPD-01 | Create an expense request | P0 | Member or Permission holder | Wallet: initiate spend |
| SPD-02 | See the spending policy before sending | P0 | Member or Permission holder | Wallet: initiate spend (to use it); Wallet: view balance (to read the policy page) |
| SPD-03 | Attach a receipt or a quote | P1 | Member or Permission holder | Wallet: initiate spend |
| SPD-04 | Approval inbox | P0 | Permission holder | Wallet: approve spend (or Project: approve purchase for project requests) |
| SPD-05 | Approval detail and approve | P0 | Permission holder | Wallet: approve spend (for project requests, also Project: approve purchase, see SPD-13) |
| SPD-06 | Reject a request with a reason | P0 | Permission holder | Wallet: approve spend (or Project: approve purchase for project requests) |
| SPD-07 | Edit a request, earlier approvals are voided | P0 | Member (the requester) | Wallet: initiate spend (and being the requester) |
| SPD-08 | Separation of duties | P0 | Permission holder | Wallet: approve spend |
| SPD-09 | Link a vote to an expense | P0 | Permission holder or Member (requester) | Wallet: initiate spend, plus Vote: create only for a hand-started vote (VOT-03). When the policy requires the vote, the system creates it and Vote: create is not needed |
| SPD-10 | Execute the payout through the payment adapter | P0 | System | none (authorised by the recorded approvals or by the passed vote) |
| SPD-11 | Payout failure, delay and provider outage | P0 | Requester, Permission holder, System | the requester or a holder of Wallet: approve spend (to try again, which adds no new authorisation); Wallet: initiate spend (requester view) |
| SPD-12 | Cancel a request | P1 | Member (the requester), Permission holder or System (expiry) | being the requester, or Wallet: approve spend; none for the system expiry |
| SPD-13 | Project and decision links | P1 | Member or Permission holder | Wallet: initiate spend; Project: approve purchase (project requests); Project: view |
| SPD-14 | Spending cap | P1 | Permission holder (sets); System (enforces) | Wallet: edit rules to set a cap in warn mode (RUL-09); Group: set spending policy to choose `spd.spend_cap_mode` block or vote and for any loosening or removal; none to see its effect |
| SPD-15 | Emergency freeze of outgoing money | P1 | Permission holder | Wallet: freeze (decision D2) to freeze and to apply a lift; lifting is authorised by `spd.freeze_lift_approvals` distinct holders of Wallet: approve spend or by an authority vote |
| SPD-16 | Receipts, ledger entries and audit trail of a request | P1 | Member, Permission holder, Gereo operator (read) | Wallet: view history (ledger and receipt); Wallet: export history (export) |
| VOT-01 | Ask the group a question with a vote | P0 | Permission holder | Vote: create |
| VOT-02 | Set the quorum and the majority, and read them in plain words | P0 | Permission holder | Vote: create |
| VOT-03 | Start the payment of an expense when its vote passes | P0 | Permission holder | Wallet: initiate spend (the requester, SPD-01), and the right to see the expense request. When the policy requires a vote (SPD-09), the system creates the vote on send and the requester does not need Vote: create. When a person starts a vote by hand on a request, Vote: create is also needed |
| VOT-04 | Cast my vote and change it until the vote closes | P0 | Member | Vote: vote |
| VOT-05 | See where the vote stands: deadline, rule, quorum and participation | P0 | Member | Vote: view |
| VOT-06 | Share a vote link so someone can vote without a full account | P0 | Guest voter | none for the guest; Vote: view for the member who shares the link |
| VOT-07 | Remind people who have not voted: push, then SMS | P0 | System | none (automatic); a manual extra reminder needs Vote: edit, or being the creator of the vote |
| VOT-08 | Close the vote at the deadline, or close it early | P0 | System, and Permission holder for early close | none for automatic close; Vote: close for early close |
| VOT-09 | Read the result with a clear outcome and a next step | P0 | Member | Vote: view |
| VOT-10 | Decide what happens when too few people vote | P0 | Permission holder | Vote: create (to set), Vote: close (to reopen) |
| VOT-11 | Handle a tie with a clear rule | P1 | Permission holder | Vote: create |
| VOT-12 | Edit, extend or cancel a vote | P1 | Permission holder | the vote's creator (Vote: create) may edit and cancel before the first ballot; Vote: edit for anyone else to edit and for everyone to extend; Vote: close to cancel after ballots |
| VOT-13 | Record every closed vote in the decision log, linked to the money it moved | P0 | System | none (automatic); viewing needs Vote: view |
| VOT-14 | Record a decision that was taken outside the app | P1 | Permission holder | Vote: create, at project level for a project decision and at group level for a group decision (permissions are inherited, conventions section 2) |
| VOT-15 | Correct or replace a decision without erasing the original | P1 | Permission holder | Vote: edit |
| VOT-16 | Find past decisions in the decision log | P0 | Member | Vote: view (and view on the parent group or project) |
| VOT-17 | Choose whether ballots are named or anonymous | P1 | Permission holder | Vote: create |
| VOT-18 | Vote when the connection is poor and see the ballot's state | P0 | Member | Vote: vote |
| WAL-01 | Create a wallet | P0 | Individual (own wallet) or Group founder or Permission holder (group wallet) | none for a personal wallet; Wallet: create for a group wallet (decision D2) |
| WAL-02 | See all my wallets and what each one holds | P0 | Individual, Member | none for own wallets; Wallet: view balance for a group wallet |
| WAL-03 | Open a wallet and see its true balance, goal and what is safe to spend | P0 | Individual, Member | none for own wallets; Wallet: view balance for the balance block, Wallet: view history for recent activity |
| WAL-04 | Rename and edit a wallet | P1 | Individual, Permission holder | none for own wallets; for a group wallet Wallet: create to rename it or change its type, and Wallet: edit rules to change its goal (the goal is a rule, RUL-10 and RUL-13) |
| WAL-05 | Close a wallet | P1 | Individual, Permission holder | none for own wallets; Wallet: close for a group wallet |
| WAL-06 | Add money from mobile money: amount, fee preview and start | P0 | Individual, Member, Permission holder | none for own wallets; Wallet: deposit for a group wallet |
| WAL-07 | Settle a deposit exactly once: provider callback, idempotency and timeouts | P0 | System | none |
| WAL-08 | When the provider is not available, say so and keep the money safe | P1 | Individual, Member, System | none |
| WAL-09 | Send money out: choose amount and recipient, with limits and fee preview | P0 | Individual, Permission holder | none for own wallets; Wallet: initiate spend for a group wallet |
| WAL-10 | Review, confirm with my PIN, and pause for a new recipient | P0 | Individual, Permission holder | none for own wallets; for a group wallet the requester holds Wallet: initiate spend and uses these screens when sending the request (SPD-01); each approver uses the PIN screen at approval (SPD-05) |
| WAL-11 | Follow a withdrawal to its end: confirmed, failed with refund, or needs attention | P0 | Individual, System | none |
| WAL-12 | Move money between my own wallets | P0 | Individual, Permission holder | none for own wallets; for wallets of one group, Wallet: initiate spend on the source and Wallet: deposit on the destination, authorised as in GRP-13 AC1 |
| WAL-13 | Send money to another person or group inside Gereo | P1 | Individual, Member | none for own wallets as the source; Wallet: initiate spend on a group source; Wallet: deposit on a group destination |
| WAL-14 | Read one transaction and its receipt, and report a problem | P0 | Individual, Member | Wallet: view history (own wallets: none) |
| WAL-15 | Browse and search my history with filters | P0 | Individual, Member | Wallet: view history (own wallets: none) |
| WAL-16 | Export a wallet's history as CSV or PDF | P1 | Individual, Permission holder | none for own wallets; Wallet: export history for a group wallet |
| WAL-17 | Read my balances and recent history without a connection | P0 | Individual, Member | the same as online |
| WAL-18 | Correct a mistake with a reversing entry, never an edit | P1 | Gereo operator, System | none for members, who only read the result. Operator permissions, from the separate operator catalogue (OPS-01): `handle tickets` or `resolve discrepancy` may propose a correction; only `approve ledger correction`, held by a different person, may approve it (OPS-05, OPS-06) |
| WAL-19 | Hide my balance, and see when a wallet is low or empty | P2 | Individual, Member | Wallet: view balance for group wallets |
| WAL-20 | See that my ledger matches the provider, as a status line | P1 | Individual, Member, System | Wallet: view balance |
| XCT-01 | Switch language at any time, with Malagasy as a first-class language | P0 | Individual | none |
| XCT-02 | See every amount as whole ariary with spaces, the same in every language | P0 | Member | none |
| XCT-03 | See dates, times and deadlines in Madagascar time, in words where it matters | P0 | Member | none |
| XCT-04 | Read my key information with no connection, and see when it was last updated | P0 | Member | none (the same permissions apply as online; a cached view never shows more than the person may see) |
| XCT-05 | Queue the things that can wait, with a visible state, and reject the rest | P0 | Member | the same permission the action needs online |
| XCT-06 | Block money-out when there is no connection, say why, and never double-send | P0 | Member | the permission the action needs online, for example Wallet: initiate spend, Wallet: approve spend, Wallet: close, Wallet: freeze or Group: remove member |
| XCT-07 | Use less data with a data saver mode | P1 | Individual | none |
| XCT-08 | Make every money screen work at 200% text size | P0 | Individual | none |
| XCT-09 | Check contrast, target size and status without colour on every screen | P0 | Individual | none |
| XCT-10 | Use Gereo with a screen reader, a keyboard and reduced motion | P1 | Individual | none |
| XCT-11 | Hold Gereo to performance budgets that fail the build | P1 | System | none |
| XCT-12 | Write SMS templates that stay in one 160-character message | P0 | System | none |
| XCT-13 | Check every screen with a pseudo-language that is longer than any real one | P1 | System | none |
| XCT-14 | Keep every string a key, with safe fallback, plurals and one glossary | P1 | System | none |

## 4. Member permission catalogue

Owner: GRP shared definitions. Names only, as in conventions section 7.

| Object | Permissions |
| --- | --- |
| Group | view group, invite member, remove member, grant permission, revoke permission, enable module, edit group, delete group, view audit log, set spending policy, set notification settings |
| Wallet | view balance, view history, deposit, initiate spend, approve spend, edit rules, export history, freeze, create, close |
| Contribution plan | view, edit, exempt member, send reminder, delete |
| Project | view, edit, manage budget, manage tasks, approve purchase, manage team, close |
| Vote | view, vote, create, close, edit |
| Event | view, create, edit, invite |
| Document | view, add, edit, delete, share (add, edit, delete and share are unused in the MVP) |
| Publication | publish, announce to group, moderate |

Bundles, always editable before they are applied:

| Bundle | Permissions it writes |
| --- | --- |
| Member | Group: view group. Wallet: view balance, view history, deposit. Contribution plan: view. Vote: view, vote. Event: view. Project: view. Document: view |
| Treasurer | Everything in Member, plus Wallet: initiate spend, approve spend, edit rules, export history, freeze. Group: view audit log, set notification settings. Contribution plan: edit, exempt member, send reminder. Vote: create, edit, close. Publication: announce to group |

Granted one by one, in no bundle: Event: create, edit, invite. Project: edit. Group: edit group. Wallet: create, close. Group: set spending policy, grant permission, revoke permission, remove member, delete group.

Classes used by the safeguards:

- Money-out class: Wallet: initiate spend, approve spend, edit rules, close, and Group: set spending policy. Granting any of them asks for the grantor's PIN.
- Continuity-critical: Wallet: approve spend, Group: grant permission, revoke permission, remove member, set spending policy. The group always keeps at least one holder of each, and at least two holders of Wallet: approve spend while a group wallet holds money.
- A requester can never approve their own request (D1). A passed vote is the authorisation above the vote threshold, with at least two distinct voters other than the requester (D4).

## 5. Operator permission catalogue

Owner: OPS-01. Separate from the member catalogue: no name is valid in both lists, and an operator never counts toward the floor of two distinct people on a group wallet.

| Permission | Used in | Second person |
| --- | --- | --- |
| manage operator access | OPS-01 | Granting approve ledger correction, approve limits and fees or manage operator access |
| review identity checks | OPS-02, OPS-03, OPS-10 | A second holder decides Tier 3 cases and cases where the ID number is already on another account |
| view reconciliation | OPS-04 | none |
| resolve discrepancy | OPS-04, OPS-05 | proposes; approve ledger correction approves |
| approve ledger correction | OPS-05 | approves; above the correction threshold a third holder also approves |
| handle tickets | OPS-06, OPS-07 | Unlock of an account locked by a fraud flag |
| publish incident | OPS-08 | none |
| search audit log | OPS-09 | none |
| manage flags | OPS-10 | Account hold at or above the second-person severity; every wallet hold |
| edit limits and fees | OPS-11 | proposes; approve limits and fees approves |
| approve limits and fees | OPS-11 | approves; a third holder for a large fee change |
| view sms costs | OPS-12 | none |
| view notification log | NTF-12, OPS-12 | none |
| reveal message text | NTF-12 | none |
| manage payouts | OPS-13 | Pause or resume of all providers |
| watch platform jobs | OPS-14 | none |

## 6. Rules the navigation must respect

These come from conventions section 2 and the stories, and bind every screen.

- Pages are never invented first: a page exists because a story needs it, and every page cites its story IDs.
- Permission-aware navigation: a person never sees a control they cannot use without an explanation, and members see only a neutral "unavailable" marker for a locked or inactive holder, never a reason.
- Money-out is online only. The device queue holds only the rows of XCT-05 Table A. Local drafts are never sent without a tap.
- Every status shows icon, word and colour together. Every money state says whether money moved.
- Amounts are whole ariary with space grouping, dates are in Madagascar time, every string is a key, and every screen survives text twice as long.

## 7. Files that complete this one

The remaining parts of the information architecture are written after the screen inventories are checked: the unified surface list with its states (`06-surface-inventory.md`), the navigation and page-versus-sheet rules (`07-navigation.md`), and the flows with their error branches (`08-flows.md`).
