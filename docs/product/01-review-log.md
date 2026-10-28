# Story review log

Review of the 196 MVP stories in `stories/`. The stories were first drafted by assistants working in parallel. This log records what has been checked, what has been fixed and what is still to do, so nobody mistakes a first draft for a reviewed one.

## 1. Status by epic

| Epic | Stories | Structural checks | Read in full by the reviewer |
| --- | --- | --- | --- |
| SPD | 16 | Done | Yes |
| ACC, ANN, CON, EVT, GRP, NTF, OPS, PRJ, RUL, VOT, WAL, XCT | 179 | Done | Not yet |

Structural checks run by script over the first 195 stories (OPS-14 was added later and is not covered): every story has Priority, Actor, Story, Conversation, Depends on and Open questions; every story has between 6 and 10 acceptance criteria; every story ID cited in an MVP file exists. No failure.

## 2. Fixes made

- SPD: added the status "Needs changes" to the status table (SPD-06 and SPD-07 use it, the table did not list it).
- SPD: removed two references to the early wireframe numbering ("Screen 18 and 19 of the P0 wireframe list"), which will not match the screens derived from the information architecture.

## 3. Findings still open

1. **Stale screen references.** Six Conversation sections cite the early wireframe numbering ("screen 25", "Screen 5 of the wireframe list"): CON-06, CON-16, EVT-04 area, NTF-01, VOT-16, WAL-02. Remove them when the pages are derived, so that traceability points at story IDs only.
2. **Operator permissions.** OPS uses `review identity checks` and `handle tickets`, which are not in the permission table of `00-conventions.md` section 7. Needs an operator permission catalogue, kept separate from the member permissions.
3. **Member permissions missing.** GRP, WAL, SPD and NTF each flag stand-ins for permissions that do not exist: create a group wallet, archive a group, view the wider audit log, set spending thresholds, set SMS settings, freeze outgoing money. Decide whether to add dedicated permissions to the conventions (recommended) or keep the stand-ins.
4. **Overlaps.** NTF-07 and XCT-12 both define SMS template rules. GRP-13 and SPD-08 both state the "no single person acts alone" floor from two sides. Pick one owner and have the other refer to it.
5. **Message key namespaces.** `msg.<epic>.<event>` is for notification messages; `spd.*`, `con.*`, `acc.*`, `wal.*` are interface text keys. This is consistent, but `00-conventions.md` does not say so. Add it.
6. **Cross-epic references.** SPD and CON were written before the other epics existed and name capabilities instead of story IDs in their cross-epic lists. Replace them with real IDs.
7. **Shared parameters.** `sms_fallback_delay` is defined in SPD; NTF must be the single source for the push-then-SMS window.
8. **Ledger model.** SPD-10 and WAL agree on the in-transit posting (wallet to in-transit, then to the external account on Confirmed, reversing entry on failure). Confirmed consistent by reading SPD-10, SPD-11, WAL-09 to WAL-11.
9. **Slice 0 and `legal-gate`.** Slice 0 includes stories that carry `legal-gate` (WAL-06, WAL-07, SPD-10). They are built against a simulated payment adapter in slice 0; the tag blocks only the real release.
10. **Size of P0.** 120 P0 stories is too large for one release (see `03-story-map.md` section 7).

## 4. To do

1. Read the other 12 epic files in full, starting with the core loop: GRP, CON, VOT, ACC, WAL.
2. Resolve findings 1 to 7 above.
3. Decide with the founder the open questions that block slice 0 (self-approval, votes against approvals, who may freeze, rounding and what counts as income).
4. Derive objects, relations and the action-to-permission matrix, then the pages (`04-*`, `05-*`).
