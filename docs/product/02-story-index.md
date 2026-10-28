# Story index

Generated from the 13 MVP story files in `stories/`. Title, priority, actor, permission and tags are copied from each story card; slice and journey step are proposals. 196 stories. `LTR.md` stubs are listed at the end. Slice and journey step are proposals made in `03-story-map.md`.

Counts by priority: P0 120, P1 66, P2 10. By slice: slice 0 52, slice 1 38, slice 2 96, slice 3 10.

Counts by epic: ACC 16, ANN 8, CON 20, EVT 11, GRP 20, NTF 14, OPS 14, PRJ 12, RUL 13, SPD 16, VOT 18, WAL 20, XCT 14.

Journey steps: 1 Discover and join, 2 Verify, 3 Set up, 4 Fund, 5 Decide, 6 Spend, 7 Follow, 8 Report and support.

This index is a hand-built view. The `Depends on (informational)` column is informational only: the source is the `Depends on` line of each story card, and no check, count or build step may read this column.

| ID | Title | Pri | Slice | Step | Actor | Permission needed | Tags | Depends on (informational, source is each story card) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ACC-01 | Choose my language and look around before I register | P0 | 0 | 1 | Visitor | none | offline | XCT-01 |
| ACC-02 | Sign up with my phone number and a code by SMS | P0 | 0 | 1 | Visitor | none | sms, audit | ACC-01, ACC-16, XCT-12 |
| ACC-03 | Set my PIN and choose biometric unlock | P0 | 0 | 2 | Individual | none | audit | ACC-02 |
| ACC-04 | Reset my PIN myself, without an agent | P0 | 1 | 2 | Individual | none | sms, audit | ACC-02, ACC-03, ACC-05, ACC-08, OPS-03 |
| ACC-05 | Sign in on a new phone, or after changing my SIM, and keep my account safe | P0 | 1 | 2 | Individual | none | sms, audit, legal-gate | ACC-02, ACC-03, ACC-04, ACC-08, ACC-11, OPS-10 |
| ACC-06 | Keep my profile up to date: name, language and preferred currency | P1 | 2 | 2 | Individual | none |  | ACC-02, XCT-01 |
| ACC-07 | See what I can do now and what unlocks next (tier ladder) | P0 | 0 | 2 | Individual | none | legal-gate | ACC-02, OPS-11 |
| ACC-08 | Photograph my ID and take a selfie | P0 | 1 | 2 | Individual | none | legal-gate, offline, audit | ACC-07, ACC-13, OPS-03, XCT-05 |
| ACC-09 | Follow my verification: pending, approved, or rejected with a reason and a retry | P0 | 1 | 2 | Individual | none | legal-gate, sms, audit | ACC-08, OPS-02, OPS-03, OPS-11 |
| ACC-10 | Be registered by a facilitator who helps me in person | P1 | 2 | 2 | Individual | none for the person; the facilitator is a Member holding Group: invite member in at least one group (GRP-03) | legal-gate, audit | ACC-01, ACC-02, ACC-03, ACC-08, ACC-13, OPS-02 |
| ACC-11 | See my connected devices and lock my account in an emergency | P0 | 1 | 8 | Individual | none | sms, audit | ACC-03, ACC-05, OPS-06 |
| ACC-12 | Sign out, and be signed out safely when I stop using the app | P1 | 2 | 8 | Individual | none | offline, audit | ACC-03, ACC-11, XCT-04, XCT-05 |
| ACC-13 | Read and agree to the terms and privacy notice in my language | P0 | 0 | 1 | Visitor | none | legal-gate, audit | ACC-01, ACC-02 |
| ACC-14 | Export a copy of my data | P1 | 2 | 8 | Individual | none for personal data. Exporting a group wallet's history needs Wallet: export history on that wallet and is handled in WAL-16 and CON-18 | audit | ACC-03, ACC-13, XCT-02, XCT-03 |
| ACC-15 | Delete my account, and be told what stops me | P1 | 2 | 8 | Individual | none | legal-gate, ledger, audit | ACC-07, ACC-13, ACC-14 |
| ACC-16 | Open an invite or vote link without an account | P0 | 0 | 1 | Visitor | none (the link carries the right to join or vote; see GRP and VOT) | sms, offline | ACC-01, ACC-02, ACC-13, XCT-03, XCT-11, XCT-12 |
| GRP-01 | Start a group for the people I save with | P0 | 0 | 3 | Individual (becomes Group founder) | none | legal-gate, ledger, audit |  |
| GRP-02 | Start with every permission, and say so | P0 | 0 | 3 | Group founder | none (written by the system at creation) | audit | GRP-01 |
| GRP-03 | Invite people by link or by phone number | P0 | 0 | 1 | Permission holder (holds Group: invite member) | Group: invite member | sms, audit | GRP-01, GRP-07, NTF-05, NTF-06, NTF-07 |
| GRP-04 | See the rules before I join, then join or decline | P0 | 0 | 1 | Visitor (becomes Member) | none (a valid invite) | audit, offline | GRP-03 |
| GRP-05 | See who is in the group | P0 | 0 | 7 | Member | Group: view group | offline | GRP-01, GRP-03, GRP-09 |
| GRP-06 | Open the group and see where things stand | P0 | 0 | 7 | Member | Group: view group (balance tile also needs Wallet: view balance) | offline | GRP-01 |
| GRP-07 | See what each kind of member can do, in plain words | P0 | 0 | 3 | Permission holder (holds Group: grant permission) | Group: grant permission, Group: view group | audit | GRP-01, GRP-08 |
| GRP-08 | Give or take away a single permission | P0 | 0 | 3 | Permission holder (holds Group: grant permission or revoke permission) | Group: grant permission to give, Group: revoke permission to take away | audit, legal-gate | GRP-07, GRP-13, GRP-14, NTF-05 |
| GRP-09 | See what a person can and cannot do right now | P1 | 2 | 3 | Member | none for one's own panel; Group: view group for others | audit, offline | GRP-07, GRP-08, GRP-12 |
| GRP-10 | See who changed access, and when | P0 | 0 | 8 | Member | Group: view audit log (own history needs none) | audit | GRP-08, GRP-11 |
| GRP-11 | Keep a complete audit log of group-level actions | P0 | 2 | 8 | Permission holder; Gereo operator | Group: view audit log (operator access is an operator permission defined in OPS-01 and OPS-09, not a member permission) | audit | GRP-08, GRP-10 |
| GRP-12 | Set the amount above which more people must agree | P0 | 0 | 3 | Permission holder (holds Group: set spending policy) | Group: set spending policy | legal-gate, audit | GRP-13 |
| GRP-13 | No single person can move the group's money alone | P0 | 0 | 3 | Member (protected); System (enforces) | none (rule applies to every outflow) | legal-gate, ledger, audit |  |
| GRP-14 | Keep the group from locking itself out | P0 | 1 | 3 | Permission holder; System | Group: revoke permission, remove member (to attempt the actions that trigger it) | legal-gate, audit | GRP-08, GRP-13, GRP-16, GRP-17, NTF-05 |
| GRP-15 | Open another wallet inside the group | P1 | 2 | 3 | Permission holder (holds Wallet: create) | Wallet: create | legal-gate, ledger, audit | GRP-01, GRP-12, GRP-13 |
| GRP-16 | Leave a group and know what happens to my money | P0 | 1 | 3 | Member | none | legal-gate, ledger, audit | GRP-14 |
| GRP-17 | Remove someone from the group | P0 | 1 | 3 | Permission holder (holds Group: remove member) | Group: remove member | audit, legal-gate | GRP-14, GRP-16, NTF-05 |
| GRP-18 | Change the group's name, purpose and rules text | P1 | 2 | 3 | Permission holder (holds Group: edit group) | Group: edit group | audit | GRP-01 |
| GRP-19 | Close a group but keep its history | P1 | 2 | 3 | Permission holder (holds Group: delete group) | Group: delete group | legal-gate, ledger, audit | GRP-13, GRP-20 |
| GRP-20 | Delete a group, within what the law lets us | P2 | 3 | 3 | Permission holder (holds Group: delete group) | Group: delete group | legal-gate, ledger, audit | GRP-19 |
| WAL-01 | Create a wallet | P0 | 0 | 3 | Individual (own wallet) or Group founder or Permission holder (group wallet) | none for a personal wallet; Wallet: create for a group wallet (decision D2) | legal-gate, ledger, audit | ACC-02, ACC-03, GRP-15 |
| WAL-02 | See all my wallets and what each one holds | P0 | 0 | 7 | Individual, Member | none for own wallets; Wallet: view balance for a group wallet | ledger, offline | GRP-06, WAL-01 |
| WAL-03 | Open a wallet and see its true balance, goal and what is safe to spend | P0 | 0 | 7 | Individual, Member | none for own wallets; Wallet: view balance for the balance block, Wallet: view history for recent activity | ledger, offline | WAL-01, WAL-02 |
| WAL-04 | Rename and edit a wallet | P1 | 2 | 3 | Individual, Permission holder | none for own wallets; for a group wallet Wallet: create to rename it or change its type, and Wallet: edit rules to change its goal (the goal is a rule, RUL-10 and RUL-13) | audit | RUL-10, WAL-01 |
| WAL-05 | Close a wallet | P1 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: close for a group wallet | legal-gate, ledger, audit | RUL-08, WAL-03, WAL-09, WAL-12 |
| WAL-06 | Add money from mobile money: amount, fee preview and start | P0 | 0 | 4 | Individual, Member, Permission holder | none for own wallets; Wallet: deposit for a group wallet | legal-gate, ledger, audit | ACC-03, ACC-07, OPS-11, WAL-01, WAL-07, WAL-08 |
| WAL-07 | Settle a deposit exactly once: provider callback, idempotency and timeouts | P0 | 0 | 4 | System | none | legal-gate, ledger, audit, sms | WAL-06 |
| WAL-08 | When the provider is not available, say so and keep the money safe | P1 | 2 | 4 | Individual, Member, System | none | legal-gate, ledger, sms | WAL-06, WAL-10, WAL-11 |
| WAL-09 | Send money out: choose amount and recipient, with limits and fee preview | P0 | 1 | 6 | Individual, Permission holder | none for own wallets; Wallet: initiate spend for a group wallet | legal-gate, ledger | ACC-07, GRP-12, GRP-13, OPS-11, WAL-03, WAL-10 |
| WAL-10 | Review, confirm with my PIN, and pause for a new recipient | P0 | 1 | 6 | Individual, Permission holder | none for own wallets; for a group wallet the requester holds Wallet: initiate spend and uses these screens when sending the request (SPD-01); each approver uses the PIN screen at approval (SPD-05) | legal-gate, ledger, audit | ACC-03, ACC-04, ACC-05, GRP-13, RUL-09, WAL-09 |
| WAL-11 | Follow a withdrawal to its end: confirmed, failed with refund, or needs attention | P0 | 1 | 6 | Individual, System | none | legal-gate, ledger, audit, sms | WAL-07, WAL-08, WAL-10, WAL-14 |
| WAL-12 | Move money between my own wallets | P0 | 1 | 4 | Individual, Permission holder | none for own wallets; for wallets of one group, Wallet: initiate spend on the source and Wallet: deposit on the destination, authorised as in GRP-13 AC1 | legal-gate, ledger, audit | GRP-12, GRP-13, RUL-07, WAL-03 |
| WAL-13 | Send money to another person or group inside Gereo | P1 | 2 | 6 | Individual, Member | none for own wallets as the source; Wallet: initiate spend on a group source; Wallet: deposit on a group destination | legal-gate, ledger, audit, sms | ACC-07, GRP-13, RUL-07, WAL-10, WAL-12 |
| WAL-14 | Read one transaction and its receipt, and report a problem | P0 | 0 | 7 | Individual, Member | Wallet: view history (own wallets: none) | ledger, audit, offline | RUL-12, WAL-07, WAL-11, WAL-15 |
| WAL-15 | Browse and search my history with filters | P0 | 0 | 7 | Individual, Member | Wallet: view history (own wallets: none) | ledger, offline | WAL-03, WAL-14 |
| WAL-16 | Export a wallet's history as CSV or PDF | P1 | 2 | 8 | Individual, Permission holder | none for own wallets; Wallet: export history for a group wallet | ledger, audit | ACC-14, CON-18, WAL-15, XCT-02 |
| WAL-17 | Read my balances and recent history without a connection | P0 | 2 | 7 | Individual, Member | the same as online | offline, ledger | ACC-03, ACC-11, ACC-12, WAL-02, WAL-03, WAL-15 |
| WAL-18 | Correct a mistake with a reversing entry, never an edit | P1 | 2 | 8 | Gereo operator, System | none for members, who only read the result. Operator permissions, from the separate operator catalogue (OPS-01): `handle tickets` or `resolve discrepancy` may propose a correction; only `approve ledger correction`, held by a different person, may approve it (OPS-05, OPS-06) | legal-gate, ledger, audit | WAL-11, WAL-14 |
| WAL-19 | Hide my balance, and see when a wallet is low or empty | P2 | 3 | 7 | Individual, Member | Wallet: view balance for group wallets | offline, ledger | RUL-11, WAL-02, WAL-03 |
| WAL-20 | See that my ledger matches the provider, as a status line | P1 | 2 | 8 | Individual, Member, System | Wallet: view balance | legal-gate, ledger, audit | CON-17, WAL-07, WAL-11 |
| RUL-01 | See the rules on a wallet and whether they are working | P0 | 2 | 7 | Individual, Member, Permission holder | none for own wallets; Wallet: view balance to see rules on a group wallet (read-only), Wallet: edit rules to change them | offline | GRP-06, WAL-01, WAL-03 |
| RUL-02 | Choose one of four ready-made rules | P0 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet | audit | ACC-07, GRP-08, RUL-01, WAL-01 |
| RUL-03 | Build a share rule as one sentence | P0 | 2 | 3 | Individual (own wallet); Permission holder with Wallet: edit rules for a group wallet through CON-11 | none for own wallets; Wallet: edit rules for a group wallet | ledger, audit | CON-11, GRP-15, RUL-02, RUL-04, RUL-06, WAL-01, WAL-12 |
| RUL-04 | See what a rule would have done with my real recent incomes | P0 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules and Wallet: view history for a group wallet | ledger, offline | CON-12, RUL-03, RUL-07, WAL-15 |
| RUL-05 | See everything that happens when money arrives, in one place | P0 | 2 | 3 | Individual, Member, Permission holder | none for own wallets; Wallet: view balance for a group wallet | offline | CON-11, CON-12, RUL-01, RUL-03, RUL-07 |
| RUL-06 | Stop a rule that would send money in a circle | P0 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet | audit | CON-11, GRP-15, RUL-03, RUL-07, RUL-12 |
| RUL-07 | Apply my rules automatically when income arrives | P0 | 2 | 3 | System | none (rule authorised at definition time, class (b) of conventions 10.4) | legal-gate, ledger, audit | CON-14, NTF-08, RUL-03, RUL-06, RUL-12, WAL-07, WAL-11, WAL-12, WAL-13, WAL-18 |
| RUL-08 | Pause, resume, edit or delete a rule, for future income only | P1 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet | audit, ledger | CON-13, RUL-01, RUL-03, RUL-04, RUL-06, RUL-13, WAL-04, WAL-05 |
| RUL-09 | Set a spending cap and be alerted when it is reached | P1 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet (rule and goal edits stay on this permission, which is in the money-out class); the cap mode of a group wallet is a spending-policy item under Group: set spending policy (SPD-14) | ledger, audit, offline | NTF-04, RUL-02, RUL-08, RUL-12, WAL-03, WAL-10, WAL-11, WAL-12, WAL-13, WAL-18 |
| RUL-10 | Set a goal with a target date and follow it | P1 | 2 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet | audit, offline | NTF-14, RUL-02, RUL-08, RUL-12, WAL-01, WAL-03, WAL-04 |
| RUL-11 | Be told when a wallet falls below a level I chose | P2 | 3 | 3 | Individual, Permission holder | none for own wallets; Wallet: edit rules for a group wallet | audit, offline | RUL-02, RUL-07, RUL-08, RUL-12, WAL-03, WAL-06, WAL-19 |
| RUL-12 | See every time a rule ran, and every time it did not | P0 | 2 | 7 | Individual, Member, Permission holder | none for own wallets; Wallet: view history for a group wallet | ledger, audit, offline | CON-15, NTF-01, NTF-08, RUL-07, WAL-14, WAL-15 |
| RUL-13 | Who may change rules on a group wallet, and how it ties to group split rules | P0 | 2 | 3 | Permission holder, Group founder, Member | Wallet: edit rules (money-out class: PIN on grant) to create, change, pause, resume or delete any rule on a group wallet; Wallet: view balance to read them | audit, ledger | CON-11, CON-12, CON-13, CON-14, GRP-07, GRP-08, GRP-11, GRP-13, GRP-15, NTF-01, RUL-01, RUL-03, RUL-08 |
| CON-01 | Create a contribution plan | P0 | 0 | 3 | Permission holder (or Group founder, who holds all permissions at the start) | Contribution plan: edit | audit |  |
| CON-02 | Edit, pause and end a plan, changes apply to future due dates only | P0 | 2 | 3 | Permission holder | Contribution plan: edit (delete needs Contribution plan: delete) | audit | CON-01 |
| CON-03 | Member's due items and history | P0 | 0 | 4 | Member | none (own items) | offline | CON-01 |
| CON-04 | Pay a contribution invoice-first | P0 | 0 | 4 | Member | none (own item) | legal-gate, ledger, audit | CON-03 |
| CON-05 | Handle pending and failed contributions | P0 | 0 | 4 | Member | none | legal-gate, ledger, sms, audit | CON-04 |
| CON-06 | Member status board | P0 | 0 | 7 | Permission holder, and Member (read) | Contribution plan: view | offline | CON-01, CON-04 |
| CON-07 | Send a reminder to a late or pending member | P1 | 2 | 4 | Permission holder | Contribution plan: send reminder | sms, audit | CON-06 |
| CON-08 | Automatic reminders, push then SMS | P0 | 2 | 4 | System | none (configured by Contribution plan: edit) | sms | CON-01, CON-03 |
| CON-09 | Apply a late fee | P1 | 2 | 3 | System | none (configured by Contribution plan: edit; waived by Contribution plan: exempt member) | legal-gate, ledger, audit | CON-01, CON-04, CON-05, CON-10 |
| CON-10 | Exempt a member | P1 | 2 | 3 | Permission holder | Contribution plan: exempt member | audit | CON-06, CON-09 |
| CON-11 | Define income split rules on a group wallet | P0 | 0 | 3 | Permission holder | Wallet: edit rules | legal-gate, ledger, audit |  |
| CON-12 | Preview a split rule on past income | P0 | 2 | 3 | Permission holder | Wallet: edit rules (and Wallet: view history for the real-history preview) | ledger | CON-11 |
| CON-13 | Change, pause or end a split rule, future income only | P1 | 2 | 3 | Permission holder | Wallet: edit rules | legal-gate, audit, ledger | CON-11, CON-12 |
| CON-14 | Execute the split automatically when income arrives | P0 | 0 | 4 | System | none (rule authorised by CON-11 and, if required, a vote) | legal-gate, ledger, audit | CON-11 |
| CON-15 | Split execution failure and retry | P1 | 2 | 4 | Permission holder | Wallet: edit rules | legal-gate, ledger, audit | CON-14 |
| CON-16 | Group ledger transparency view | P0 | 0 | 7 | Member | Wallet: view balance and Wallet: view history | ledger, offline | CON-14, SPD-16 |
| CON-17 | Reconciliation line on the group ledger | P1 | 2 | 7 | Member | Wallet: view balance | ledger, offline | CON-16 |
| CON-18 | Export the ledger for meetings and accounting | P1 | 2 | 8 | Permission holder | Wallet: export history | ledger, audit, offline | CON-16, CON-17 |
| CON-19 | A member sees where their contribution went | P2 | 3 | 7 | Member | none (own contributions); Wallet: view history for the group-level lists | ledger, offline | CON-03, CON-14, CON-16 |
| CON-20 | Permission checks and audit log for contributions and splits | P0 | 0 | 8 | Member, Permission holder, Gereo operator (read) | Contribution plan: view (plan log); Wallet: view history (rule log) | audit | CON-01, CON-02, CON-07, CON-10, CON-11, CON-13, CON-18 |
| SPD-01 | Create an expense request | P0 | 0 | 6 | Member or Permission holder | Wallet: initiate spend | legal-gate, offline, audit | SPD-02, SPD-03 |
| SPD-02 | See the spending policy before sending | P0 | 0 | 6 | Member or Permission holder | Wallet: initiate spend (to use it); Wallet: view balance (to read the policy page) | audit |  |
| SPD-03 | Attach a receipt or a quote | P1 | 2 | 6 | Member or Permission holder | Wallet: initiate spend | offline | SPD-01 |
| SPD-04 | Approval inbox | P0 | 0 | 6 | Permission holder | Wallet: approve spend (or Project: approve purchase for project requests) | offline, sms | SPD-01 |
| SPD-05 | Approval detail and approve | P0 | 0 | 6 | Permission holder | Wallet: approve spend (for project requests, also Project: approve purchase, see SPD-13) | legal-gate, audit | SPD-02, SPD-04, SPD-08 |
| SPD-06 | Reject a request with a reason | P0 | 2 | 6 | Permission holder | Wallet: approve spend (or Project: approve purchase for project requests) | audit | SPD-05 |
| SPD-07 | Edit a request, earlier approvals are voided | P0 | 1 | 6 | Member (the requester) | Wallet: initiate spend (and being the requester) | legal-gate, audit | SPD-01, SPD-05, SPD-09 |
| SPD-08 | Separation of duties | P0 | 0 | 6 | Permission holder | Wallet: approve spend | legal-gate, audit | SPD-05 |
| SPD-09 | Link a vote to an expense | P0 | 1 | 5 | Permission holder or Member (requester) | Wallet: initiate spend, plus Vote: create only for a hand-started vote (VOT-03). When the policy requires the vote, the system creates it and Vote: create is not needed | legal-gate, audit | SPD-01, SPD-02, SPD-05 |
| SPD-10 | Execute the payout through the payment adapter | P0 | 0 | 6 | System | none (authorised by the recorded approvals or by the passed vote) | legal-gate, ledger, audit | SPD-05, SPD-14, SPD-15 |
| SPD-11 | Payout failure, delay and provider outage | P0 | 1 | 6 | Requester, Permission holder, System | the requester or a holder of Wallet: approve spend (to try again, which adds no new authorisation); Wallet: initiate spend (requester view) | legal-gate, ledger, audit | SPD-10 |
| SPD-12 | Cancel a request | P1 | 2 | 6 | Member (the requester), Permission holder or System (expiry) | being the requester, or Wallet: approve spend; none for the system expiry | audit | SPD-01, SPD-09, SPD-10 |
| SPD-13 | Project and decision links | P1 | 2 | 6 | Member or Permission holder | Wallet: initiate spend; Project: approve purchase (project requests); Project: view | legal-gate, ledger, audit | SPD-01, SPD-05, SPD-09 |
| SPD-14 | Spending cap | P1 | 2 | 6 | Permission holder (sets); System (enforces) | Wallet: edit rules to set a cap in warn mode (RUL-09); Group: set spending policy to choose `spd.spend_cap_mode` block or vote and for any loosening or removal; none to see its effect | legal-gate, ledger, audit | SPD-10 |
| SPD-15 | Emergency freeze of outgoing money | P1 | 2 | 6 | Permission holder | Wallet: freeze (decision D2) to freeze and to apply a lift; lifting is authorised by `spd.freeze_lift_approvals` distinct holders of Wallet: approve spend or by an authority vote | legal-gate, ledger, audit | SPD-10 |
| SPD-16 | Receipts, ledger entries and audit trail of a request | P1 | 2 | 7 | Member, Permission holder, Gereo operator (read) | Wallet: view history (ledger and receipt); Wallet: export history (export) | ledger, audit, offline | CON-16, CON-18, SPD-10, SPD-11, SPD-13 |
| VOT-01 | Ask the group a question with a vote | P0 | 0 | 5 | Permission holder | Vote: create | audit |  |
| VOT-02 | Set the quorum and the majority, and read them in plain words | P0 | 0 | 5 | Permission holder | Vote: create | audit | VOT-01 |
| VOT-03 | Start the payment of an expense when its vote passes | P0 | 0 | 5 | Permission holder | Wallet: initiate spend (the requester, SPD-01), and the right to see the expense request. When the policy requires a vote (SPD-09), the system creates the vote on send and the requester does not need Vote: create. When a person starts a vote by hand on a request, Vote: create is also needed | audit, ledger | VOT-01, VOT-02, VOT-08, VOT-13 |
| VOT-04 | Cast my vote and change it until the vote closes | P0 | 0 | 5 | Member | Vote: vote | audit | VOT-01, VOT-18 |
| VOT-05 | See where the vote stands: deadline, rule, quorum and participation | P0 | 0 | 5 | Member | Vote: view | offline | VOT-01, VOT-02, VOT-04 |
| VOT-06 | Share a vote link so someone can vote without a full account | P0 | 0 | 5 | Guest voter | none for the guest; Vote: view for the member who shares the link | sms, audit | VOT-01, VOT-04 |
| VOT-07 | Remind people who have not voted: push, then SMS | P0 | 2 | 5 | System | none (automatic); a manual extra reminder needs Vote: edit, or being the creator of the vote | sms, audit | VOT-01 |
| VOT-08 | Close the vote at the deadline, or close it early | P0 | 0 | 5 | System, and Permission holder for early close | none for automatic close; Vote: close for early close | audit | VOT-04, VOT-09, VOT-10, VOT-13 |
| VOT-09 | Read the result with a clear outcome and a next step | P0 | 0 | 5 | Member | Vote: view | audit | VOT-03, VOT-08, VOT-13 |
| VOT-10 | Decide what happens when too few people vote | P0 | 2 | 5 | Permission holder | Vote: create (to set), Vote: close (to reopen) | audit | VOT-01, VOT-02, VOT-08, VOT-13 |
| VOT-11 | Handle a tie with a clear rule | P1 | 2 | 5 | Permission holder | Vote: create | audit | VOT-01, VOT-08, VOT-09, VOT-13 |
| VOT-12 | Edit, extend or cancel a vote | P1 | 2 | 5 | Permission holder | the vote's creator (Vote: create) may edit and cancel before the first ballot; Vote: edit for anyone else to edit and for everyone to extend; Vote: close to cancel after ballots | audit | VOT-01, VOT-03, VOT-13 |
| VOT-13 | Record every closed vote in the decision log, linked to the money it moved | P0 | 0 | 5 | System | none (automatic); viewing needs Vote: view | audit, ledger | VOT-03, VOT-08, VOT-09, VOT-12 |
| VOT-14 | Record a decision that was taken outside the app | P1 | 2 | 5 | Permission holder | Vote: create, at project level for a project decision and at group level for a group decision (permissions are inherited, conventions section 2) | audit, offline | PRJ-07, VOT-13 |
| VOT-15 | Correct or replace a decision without erasing the original | P1 | 2 | 5 | Permission holder | Vote: edit | audit | VOT-13, VOT-14 |
| VOT-16 | Find past decisions in the decision log | P0 | 2 | 7 | Member | Vote: view (and view on the parent group or project) | offline | VOT-13, VOT-14, VOT-15 |
| VOT-17 | Choose whether ballots are named or anonymous | P1 | 2 | 5 | Permission holder | Vote: create | audit | VOT-01, VOT-04, VOT-05, VOT-13 |
| VOT-18 | Vote when the connection is poor and see the ballot's state | P0 | 2 | 5 | Member | Vote: vote | offline, audit | VOT-04 |
| PRJ-01 | Start a project from a ready-made template in about a minute | P0 | 2 | 3 | Permission holder | Project: edit, held at group level (closed: there is no separate "create project" permission; permissions are inherited from the group, so a holder of Project: edit on the group can create projects in it) | audit |  |
| PRJ-02 | Open a project and see what it is about, who owns it and where it stands | P0 | 2 | 7 | Member | Project: view | offline, audit | PRJ-01 |
| PRJ-03 | Link a budget to one wallet and see spent against planned | P0 | 2 | 3 | Permission holder | Project: manage budget, and Wallet: view balance on the chosen wallet | ledger, audit | PRJ-01, PRJ-02 |
| PRJ-04 | Keep a short list of tasks and milestones | P1 | 2 | 7 | Permission holder | Project: manage tasks. The task owner may also change the status of their own task without it (closed, see Conversation) | offline, audit | PRJ-02 |
| PRJ-05 | See every expense request and decision that belongs to the project | P0 | 2 | 7 | Member | Project: view | ledger, audit | PRJ-02, PRJ-03, VOT-13, VOT-14 |
| PRJ-06 | Let the project follow the group's permissions, and narrow them when needed | P1 | 2 | 3 | Group founder | Group: grant permission and Group: revoke permission, applied to this project (closed) | audit | PRJ-02 |
| PRJ-07 | Attach a file to a decision or an expense request | P1 | 2 | 7 | Member | Vote: create (decisions, as VOT-14 and VOT-15). For an expense request the rules of SPD-03 apply and this story only adds the entry point from the project | offline, audit | VOT-13, VOT-14, VOT-15 |
| PRJ-08 | Read a one-page summary of how the project is going | P1 | 2 | 7 | Member | Project: view | offline | PRJ-03, PRJ-04, PRJ-05, VOT-05 |
| PRJ-09 | Close a project and keep its record | P1 | 2 | 7 | Permission holder | Project: close | audit, ledger | PRJ-02, PRJ-03, PRJ-04, PRJ-05, VOT-13 |
| PRJ-10 | List all the projects of a group | P1 | 2 | 7 | Member | Project: view (per project); Group: view group | offline | PRJ-01, PRJ-02, PRJ-03, PRJ-06 |
| PRJ-11 | Follow the project as one timeline of tasks, requests and decisions | P2 | 3 | 7 | Member | Project: view | offline | EVT-09, PRJ-04, PRJ-05, PRJ-07, VOT-13 |
| PRJ-12 | Run a personal project on my own | P2 | 3 | 7 | Individual | none (own entity) | ledger, audit | PRJ-01, PRJ-03, PRJ-04, PRJ-08, PRJ-09 |
| EVT-01 | Create an event for the group | P0 | 2 | 3 | Permission holder | Event: create (and Event: invite to notify the audience) | audit |  |
| EVT-02 | Repeat an event every week or every month | P1 | 2 | 3 | Permission holder | Event: create (set), Event: edit (change) | audit | EVT-01, EVT-06, EVT-07 |
| EVT-03 | Invite the whole group or chosen members | P0 | 2 | 3 | Permission holder | Event: invite | sms, audit | EVT-01 |
| EVT-04 | Say "going", "maybe" or "no" in one tap and see who is coming | P0 | 2 | 7 | Member | Event: view | offline | EVT-01, EVT-03 |
| EVT-05 | Get automatic reminders, by push then SMS if not opened | P0 | 2 | 7 | System | none (automatic); Event: edit to change times | sms, audit | EVT-01, EVT-03 |
| EVT-06 | Change an event and tell everyone | P1 | 2 | 7 | Permission holder | Event: edit | sms, audit | EVT-01, EVT-03, EVT-04, EVT-05 |
| EVT-07 | Cancel an event and tell everyone | P1 | 2 | 7 | Permission holder | Event: edit | sms, audit | EVT-01, EVT-02, EVT-05 |
| EVT-08 | See upcoming events as a list and as a calendar | P0 | 2 | 7 | Member | Event: view | offline | EVT-01, EVT-04, EVT-10 |
| EVT-09 | Link an event to a project | P1 | 2 | 7 | Permission holder | Event: edit and Project: view | audit | EVT-01, EVT-03, PRJ-02, PRJ-11 |
| EVT-10 | Remember a date and keep a private note | P2 | 3 | 7 | Individual | none (own entity) | offline | EVT-08 |
| EVT-11 | Add an event to my phone's calendar | P2 | 3 | 7 | Member | Event: view | offline | EVT-01, EVT-02 |
| ANN-01 | Publish an announcement to the group | P1 | 2 | 7 | Permission holder | Publication: announce to group | sms, audit |  |
| ANN-02 | Read the group's announcements and see what is new | P1 | 2 | 7 | Member | Group: view group | offline | ANN-01 |
| ANN-03 | Pin, correct or withdraw an announcement | P2 | 3 | 7 | Permission holder | Publication: announce to group (pin and unpin any announcement; edit and withdraw one's own); Publication: moderate (hide any) | audit | ANN-01, ANN-02 |
| ANN-04 | Start a special contribution campaign inside the group | P1 | 2 | 4 | Permission holder | Publication: announce to group and Wallet: initiate spend on the destination wallet | legal-gate, ledger, audit | ANN-01, VOT-01 |
| ANN-05 | Give to a campaign | P1 | 2 | 4 | Member | Wallet: deposit on the destination group wallet (in the Member bundle, GRP-07); the sender's own wallet needs none | legal-gate, ledger, audit, offline | ANN-04 |
| ANN-06 | Get a receipt for every contribution | P1 | 2 | 7 | Member | none (own contribution) | sms, ledger, offline | ANN-05 |
| ANN-07 | Follow the campaign's progress and close it | P1 | 2 | 7 | Member, and System at the deadline | Group: view group (see); a holder of both permissions of ANN-04 (close early) | legal-gate, ledger, audit, offline | ANN-04, ANN-05, ANN-06, ANN-08 |
| ANN-08 | Publish a report on how the money was used | P1 | 2 | 7 | Permission holder | the two permissions of ANN-04 (Publication: announce to group and Wallet: initiate spend on the destination wallet); a campaign-specific permission is noted for later | legal-gate, ledger, audit | ANN-07, PRJ-07 |
| NTF-01 | See everything that happened and open it in one tap | P0 | 0 | 7 | Member | none (each person sees only their own notifications) | offline |  |
| NTF-02 | Know whether the message reached the person | P1 | 2 | 7 | Member; Permission holder | none for one's own items; Contribution plan: send reminder or Vote: create to see per-recipient delivery for items they sent | sms, audit | NTF-01, NTF-05, NTF-12 |
| NTF-03 | Ask to send notifications only after the app has proved useful | P0 | 1 | 3 | Member | none | offline |  |
| NTF-04 | Choose what I get and how | P0 | 1 | 3 | Member; Permission holder | none for a member's own choices; Group: set notification settings for the group's SMS settings (NTF-06) | sms, offline | NTF-03, NTF-10, NTF-14 |
| NTF-05 | Push first, then SMS only if nobody opened the push | P0 | 1 | 7 | System | none | sms | NTF-03, NTF-04, NTF-06, NTF-07, NTF-10, NTF-12, NTF-13 |
| NTF-06 | Keep SMS cost under control and say who pays | P0 | 1 | 7 | Permission holder (holds Group: set notification settings) | Group: set notification settings (decision D2); a top-up still routes through the spending policy and needs Wallet: initiate spend to request it | sms, ledger, audit | GRP-13, NTF-05, NTF-12 |
| NTF-07 | Write every SMS so it fits in one short message, in three languages | P0 | 1 | 7 | System (and the team that writes templates) | none | sms | NTF-12 |
| NTF-08 | Turn a flood into one message | P1 | 2 | 7 | System | none | sms | NTF-01, NTF-05, NTF-06, NTF-07 |
| NTF-09 | Do not wake people at night | P1 | 2 | 7 | Member | none | sms | NTF-04, NTF-05, NTF-12 |
| NTF-10 | Stop SMS any time, and restart it on my terms | P0 | 1 | 7 | Member | none | sms, audit, legal-gate | NTF-04, NTF-05, NTF-12 |
| NTF-11 | Reach people who do not have the app | P0 | 1 | 7 | Visitor; Guest voter; Member without a smartphone | none | sms, offline | GRP-03, NTF-05, NTF-06, NTF-07, NTF-13 |
| NTF-12 | Let operators see what was sent, and why | P0 | 1 | 7 | Gereo operator | operator permission `view notification log`; `reveal message text` to see a message body (both are in the operator catalogue owned by OPS-01, which is separate from member permissions) | sms, audit | NTF-05, NTF-13 |
| NTF-13 | When the SMS cannot be delivered | P0 | 1 | 7 | System | none | sms | NTF-05, NTF-12 |
| NTF-14 | One calm summary a week | P2 | 3 | 7 | Member | none | offline | GRP-06, NTF-01, NTF-04 |
| XCT-01 | Switch language at any time, with Malagasy as a first-class language | P0 | 0 | 1 | Individual | none |  | ACC-01, ACC-06, XCT-12, XCT-14 |
| XCT-02 | See every amount as whole ariary with spaces, the same in every language | P0 | 0 | 7 | Member | none | ledger | XCT-01, XCT-08, XCT-12 |
| XCT-03 | See dates, times and deadlines in Madagascar time, in words where it matters | P0 | 0 | 7 | Member | none |  | ACC-14, ACC-16, XCT-01, XCT-05 |
| XCT-04 | Read my key information with no connection, and see when it was last updated | P0 | 1 | 7 | Member | none (the same permissions apply as online; a cached view never shows more than the person may see) | offline | ACC-03, XCT-03, XCT-05, XCT-06, XCT-11 |
| XCT-05 | Queue the things that can wait, with a visible state, and reject the rest | P0 | 1 | 7 | Member | the same permission the action needs online | offline | ACC-08, ACC-12, XCT-03, XCT-04 |
| XCT-06 | Block money-out when there is no connection, say why, and never double-send | P0 | 1 | 7 | Member | the permission the action needs online, for example Wallet: initiate spend, Wallet: approve spend, Wallet: close, Wallet: freeze or Group: remove member | offline, ledger, legal-gate | OPS-13, XCT-04, XCT-05 |
| XCT-07 | Use less data with a data saver mode | P1 | 2 | 7 | Individual | none |  | XCT-02, XCT-11 |
| XCT-08 | Make every money screen work at 200% text size | P0 | 2 | 7 | Individual | none |  | XCT-02, XCT-13 |
| XCT-09 | Check contrast, target size and status without colour on every screen | P0 | 2 | 7 | Individual | none |  | XCT-08 |
| XCT-10 | Use Gereo with a screen reader, a keyboard and reduced motion | P1 | 2 | 7 | Individual | none |  | XCT-08, XCT-09 |
| XCT-11 | Hold Gereo to performance budgets that fail the build | P1 | 2 | 7 | System | none |  | XCT-04, XCT-07 |
| XCT-12 | Write SMS templates that stay in one 160-character message | P0 | 1 | 7 | System | none | sms | OPS-12, XCT-01, XCT-02, XCT-03 |
| XCT-13 | Check every screen with a pseudo-language that is longer than any real one | P1 | 2 | 7 | System | none |  | XCT-01, XCT-08, XCT-14 |
| XCT-14 | Keep every string a key, with safe fallback, plurals and one glossary | P1 | 2 | 7 | System | none |  | XCT-01, XCT-12, XCT-13 |
| OPS-01 | Sign in to the back office and see only what my permissions allow | P0 | 1 | 8 | Gereo operator | none to sign in; `manage operator access` to grant or revoke permissions to another operator | audit |  |
| OPS-02 | See the KYC review queue and pick the next case | P0 | 1 | 8 | Gereo operator | `review identity checks` | legal-gate, audit | ACC-08, ACC-10, OPS-01, OPS-10 |
| OPS-03 | Decide a KYC case: approve, reject with a reason, or ask for a retake | P0 | 1 | 8 | Gereo operator | `review identity checks` | legal-gate, sms, audit | ACC-08, ACC-09, OPS-01, OPS-02, OPS-11, XCT-12 |
| OPS-04 | Check the ledger against Vanilla Pay every day and see the result | P0 | 1 | 8 | Gereo operator | `view reconciliation` | ledger, legal-gate, audit | OPS-01, OPS-05 |
| OPS-05 | Get alerted to a discrepancy and resolve it with a reversing entry | P0 | 1 | 8 | Gereo operator | `resolve discrepancy`; the correction itself needs a second operator who holds `approve ledger correction` | ledger, legal-gate, audit | OPS-01, OPS-04 |
| OPS-06 | Handle support tickets with the full context | P0 | 1 | 8 | Gereo operator | `handle tickets` | audit | OPS-01, OPS-03, OPS-05, OPS-07, XCT-14 |
| OPS-07 | Show the person the true status of their ticket | P1 | 2 | 8 | Gereo operator | `handle tickets` | sms, offline, audit | OPS-06, XCT-03, XCT-04, XCT-05, XCT-12 |
| OPS-08 | Post a "provider unavailable" banner and keep it up to date | P0 | 1 | 8 | Gereo operator | `publish incident` | sms, offline, ledger, audit | OPS-01, OPS-13, XCT-04, XCT-10 |
| OPS-09 | Search the audit log | P0 | 1 | 8 | Gereo operator | `search audit log` | audit | OPS-01 |
| OPS-10 | Review fraud and anomaly flags | P1 | 2 | 8 | Gereo operator | `manage flags` | legal-gate, audit | ACC-05, ACC-11, OPS-01, OPS-03, OPS-06 |
| OPS-11 | Configure tier limits and fees, with a second person and a start date | P0 | 1 | 8 | Gereo operator | `edit limits and fees` to propose; `approve limits and fees` for a second person to apply | legal-gate, ledger, audit | ACC-07, OPS-01, XCT-02 |
| OPS-12 | Watch SMS spending and delivery | P1 | 2 | 8 | Gereo operator | `view sms costs` | sms, audit | OPS-01, OPS-10, XCT-12 |
| OPS-13 | Watch and steer the payout queue | P0 | 1 | 8 | Gereo operator | `manage payouts` | ledger, legal-gate, audit | OPS-01, OPS-04, OPS-05, OPS-08, XCT-06 |
| OPS-14 | Watch the vote and decision-log jobs | P1 | 2 | 8 | Gereo operator | `watch platform jobs` | audit | OPS-01, OPS-13, SPD-10, VOT-03, VOT-13 |

## Later modules (LTR.md stubs)

Not MVP. See [stories/LTR.md](stories/LTR.md): MKT (marketplace), COM (communities), SOC (social network), DON (public donations), LND (lending, legal-gate), MRK (marketing).
