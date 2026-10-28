# Story map and release slices

Built from [02-story-index.md](02-story-index.md) (196 MVP stories). The horizontal axis is the eight journey steps of [00-conventions.md](00-conventions.md). The vertical axis is release slices, each anchored to an outcome it proves. Slices are proposals for the founder to accept or change; they are not written into the story files.

## 1. Why slices

The stories hold 120 P0 items, which is too much for one person working with an AI assistant. A P0 label says the product makes no sense without it; it does not say in what order to build. Slices answer the order question, and let money-free work proceed first.

| Slice | Name | Stories | Outcome it proves |
| --- | --- | --- | --- |
| 0 | Walking skeleton, simulated money | 52 | The core loop works end to end for one real group: join, contribute, see the split in a shared ledger, ask to spend, get approved by a second person and by a vote, record the decision |
| 1 | Real money, safely | 38 | Real deposits and payouts, identity checks, SMS, offline rules, operator tools: everything that touches client funds or protects them |
| 2 | MVP complete | 95 | The remaining P0 items plus all P1: rules, projects, events, announcements, richer groups, polish |
| 3 | Later in the MVP | 10 | P2 items |

Slice 0 can be built and tested with a simulated payment adapter, and later slices put a real payment rail behind the adapter.

## 2. Slice 0, the walking skeleton

The thinnest path that proves the product. Only the happy path and the rules that give the path its meaning are built first; edge states from the acceptance criteria follow in slice 1.

1. Look around, choose a language, sign up with phone and code, set a PIN, accept the terms: ACC-01, ACC-02, ACC-03, ACC-13, plus ACC-07 for the tier ladder. Open an invite link: ACC-16.
2. Start a group as founder, invite two or more people, join: GRP-01, GRP-02, GRP-03, GRP-04, GRP-05, GRP-06.
3. Give a second person the right to approve spending and set the threshold: GRP-07, GRP-08, GRP-12. The floor "no single person can move the money alone" is enforced from day one: GRP-13, SPD-08. Changes are visible: GRP-10.
4. Wallets and balance: WAL-01, WAL-02, WAL-03, deposit simulated: WAL-06, WAL-07, one transaction and its receipt: WAL-14, history: WAL-15.
5. Contribution plan, pay a contribution, status board: CON-01, CON-03, CON-04, CON-05, CON-06.
6. Split the income by rule, see it in the shared ledger: CON-11, CON-14, CON-16, with the audit baseline CON-20.
7. Ask to spend, see the policy, approve with a second person, pay out simulated: SPD-01, SPD-02, SPD-04, SPD-05, SPD-10.
8. Decide by vote and link it to the expense: VOT-01, VOT-02, VOT-03, VOT-04, VOT-05, VOT-06, VOT-08, VOT-09, VOT-13, SPD-09.
9. Basics: notification list NTF-01, language and formats XCT-01, XCT-02, XCT-03.

Stories left out of slice 0 on purpose: push and SMS delivery, KYC capture, real mobile money, offline queue, projects, events, announcements, rules builder, exports, operator tools.

### Slice 0 matrix
| Journey step | Stories |
| --- | --- |
| 1 Discover and join | ACC-01, ACC-02, ACC-13, ACC-16, GRP-03, GRP-04, XCT-01 |
| 2 Verify | ACC-03, ACC-07 |
| 3 Set up | GRP-01, GRP-02, GRP-07, GRP-08, GRP-12, GRP-13, WAL-01, CON-01, CON-11 |
| 4 Fund | WAL-06, WAL-07, CON-03, CON-04, CON-05, CON-14 |
| 5 Decide | VOT-01, VOT-02, VOT-03, VOT-04, VOT-05, VOT-06, VOT-08, VOT-09, VOT-13 |
| 6 Spend | SPD-01, SPD-02, SPD-04, SPD-05, SPD-08, SPD-10 |
| 7 Follow | GRP-05, GRP-06, WAL-02, WAL-03, WAL-14, WAL-15, CON-06, CON-16, NTF-01, XCT-02, XCT-03 |
| 8 Report and support | GRP-10, CON-20 |

## 3. Slice 1, real money safely

Everything that touches client funds or protects them: real deposit and payout settlement, failure handling, identity capture and review, PIN recovery and device change, account lock, SMS and its cost, offline reading, blocked money-out offline, and the operator tools that reconcile, review identity, handle tickets and watch payouts. This slice needs a real payment rail behind the adapter.

### Slice 1 matrix
| Journey step | Stories |
| --- | --- |
| 1 Discover and join | - |
| 2 Verify | ACC-04, ACC-05, ACC-08, ACC-09 |
| 3 Set up | GRP-14, GRP-16, GRP-17, NTF-03, NTF-04 |
| 4 Fund | WAL-12 |
| 5 Decide | SPD-09 |
| 6 Spend | WAL-09, WAL-10, WAL-11, SPD-07, SPD-11 |
| 7 Follow | NTF-05, NTF-06, NTF-07, NTF-10, NTF-11, NTF-12, NTF-13, XCT-04, XCT-05, XCT-06, XCT-12 |
| 8 Report and support | ACC-11, OPS-01, OPS-02, OPS-03, OPS-04, OPS-05, OPS-06, OPS-08, OPS-09, OPS-11, OPS-13 |

## 4. Slice 2, MVP complete

The remaining P0 items that are not money-critical (for example RUL-01 to RUL-07, RUL-12, RUL-13, projects and events basics, remaining vote behaviours) plus all P1 stories.

### Slice 2 matrix
| Journey step | Stories |
| --- | --- |
| 1 Discover and join | - |
| 2 Verify | ACC-06, ACC-10 |
| 3 Set up | GRP-09, GRP-15, GRP-18, GRP-19, WAL-04, WAL-05, RUL-02, RUL-03, RUL-04, RUL-05, RUL-06, RUL-07, RUL-08, RUL-09, RUL-10, RUL-13, CON-02, CON-09, CON-10, CON-12, CON-13, PRJ-01, PRJ-03, PRJ-06, EVT-01, EVT-02, EVT-03 |
| 4 Fund | WAL-08, CON-07, CON-08, CON-15, ANN-04, ANN-05 |
| 5 Decide | VOT-07, VOT-10, VOT-11, VOT-12, VOT-14, VOT-15, VOT-17, VOT-18 |
| 6 Spend | WAL-13, SPD-03, SPD-06, SPD-12, SPD-13, SPD-14, SPD-15 |
| 7 Follow | WAL-17, RUL-01, RUL-12, CON-17, SPD-16, VOT-16, PRJ-02, PRJ-04, PRJ-05, PRJ-07, PRJ-08, PRJ-09, PRJ-10, EVT-04, EVT-05, EVT-06, EVT-07, EVT-08, EVT-09, ANN-01, ANN-02, ANN-06, ANN-07, ANN-08, NTF-02, NTF-08, NTF-09, XCT-07, XCT-08, XCT-09, XCT-10, XCT-11, XCT-13, XCT-14 |
| 8 Report and support | ACC-12, ACC-14, ACC-15, GRP-11, WAL-16, WAL-18, WAL-20, CON-18, OPS-07, OPS-10, OPS-12, OPS-14 |

## 5. Slice 3

### Slice 3 matrix
| Journey step | Stories |
| --- | --- |
| 1 Discover and join | - |
| 2 Verify | - |
| 3 Set up | GRP-20, RUL-11 |
| 4 Fund | - |
| 5 Decide | - |
| 6 Spend | - |
| 7 Follow | WAL-19, CON-19, PRJ-11, PRJ-12, EVT-10, EVT-11, ANN-03, NTF-14 |
| 8 Report and support | - |

## 6. Critical dependency chain

ACC-02 (sign up) leads to GRP-01 (group) and GRP-03 and GRP-04 (members), then GRP-08 and GRP-12 (an approver and a threshold). CON-01 and CON-04 (plan and payment) need WAL-01 and WAL-06 and WAL-07 (wallet and deposit). CON-11 and CON-14 (split rule and its execution) need CON-04. SPD-01, SPD-05 and SPD-10 need WAL-01 and GRP-08. VOT-03 and SPD-09 need both VOT and SPD. Real settlement (WAL-07 real, SPD-10 real) depends on OPS-04 and OPS-05 for reconciliation.

### Cross-reference convention and build order

- Story headings (`### XXX-nn`) are the only authority for story IDs. Cite a story by ID, a criterion as "ID criterion N", a numbered open question as "ID open question N", and an event as EV-XXX-nn, never as a bare story ID. A closed question stays as one line, "Closed: <decision> (ID criterion N)", with its rationale kept.
- NTF owns the EV- catalogue (class, payer, SMS fallback, message key). Other stories cite only the EV- ID and message key, and each message key is emitted by exactly one story.
- WAL-07 owns and emits the "money posted to a wallet" event (D3). RUL-07 consumes it; cycle detection and the maximum chain depth are owned by RUL-06. WAL-12 and WAL-13 are entry points that depend on WAL-07 and on RUL-07 for the rule run.
- VOT-03 owns the "two distinct voters other than the requester" count (D4). VOT-01 criterion 10 extends it to policy-change proposals, and GRP-12 and GRP-14 cite VOT-01. SPD-13 states the request outcome (accepted, held, refused) and cites PRJ-03 only for budget numbers. XCT-14 and XCT-12 stay as they are.
- Build order for the money-posted chain: RUL-07, then WAL-12, then WAL-13. No story changes slice because of this order.
- Known tension, not resolved here: WAL-12 is in slice 1 and depends on RUL-07, which is in slice 2. Until RUL-07 is built, WAL-12 posts money without running rules. Slice membership is unchanged; the founder or the build maintainer may move RUL-07 into slice 1.
- Check, run as part of the story-map build by the product definition owner: every ID cited anywhere resolves to a `###` heading; every "Depends on" list is acyclic except the chain explicitly allowed above; every message key is emitted by one story; every EV- ID exists in NTF. The story files now follow the convention. The check was run by hand on 2026-10-28 with a throwaway script that is not stored in the repository; it found no missing story ID and no missing criterion or open-question target, and no message key outside the catalogue. Adding the script to the story-map build is still to do.
- Dependency-cycle check result before these edits, from the "Depends on" lines of the 196 story headings: the graph contains cycles (for example ACC-01 and XCT-01 depend on each other, and WAL-07, RUL-07, WAL-12 and WAL-13 reference one another). The cycle check was not re-run after the later edits to the story files.


## 7. Scope risk

- 120 P0 stories, estimated as slices 0 to 2 above, remain a large body of work. A realistic first release for the founding group is slice 0 plus the money-safety subset of slice 1, run with the group as a pilot.
- Candidates to defer or merge: the 13 RUL stories can wait until after the first pilot because the group loop does not need personal rules; NTF has 14 stories and a 113-row event catalogue, which should be cut to the events that the slice 0 and 1 stories actually emit; EVT and ANN do not block the loop; XCT performance and accessibility stories are ongoing conditions on every story, not standalone work items.
- Each story still carries 6 to 10 acceptance criteria. When a slice is planned, pick the criteria that make the happy path true and put the rest in a later pass.

## 8. Open items for the founder

See [01-review-log.md](01-review-log.md) for findings, and the open questions at the end of each story file.
