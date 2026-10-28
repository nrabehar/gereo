# RUL: screen and state inventory

Source: `docs/product/stories/RUL.md` (13 stories, read in full), `00-conventions.md`, `05-decisions.md` (D1 to D7 override any story), `design-foundations.md`, `research/raw/09-from-stories-to-pages.md` (sections 3.3, 5, 6, 10.2 to 10.6).

Surface line format: `SCR-RUL-nn | name | kind | who sees it | entry | exit`. State line format: `SCR-RUL-nn state: trigger; sees; can do; key`. Kinds: page, sheet, modal, inline, notification, system. Permission names follow conventions section 7. Amounts are shown as `12 500 Ar`. Rule states are the shared table: On (Active in CON), Paused, Waiting for vote, Needs attention (rule), Stopped. Firing outcomes: Moved, Alert sent, Skipped. Rules on a personal wallet need no permission (the person holds every wallet permission); on a group wallet `Wallet: edit rules` is checked for every create, edit, pause, resume and delete.

---

### RUL-01 See the rules on a wallet and whether they are working

**Story:** RUL-01 See the rules on a wallet and whether they are working

**Surfaces:**
- SCR-RUL-01 | Rules list of a wallet (grouped by template Share, Spending cap, Goal, Low-balance alert; links "What happens when money arrives", "Rule history", button "Add a rule") | page | Owner of a personal wallet; on a group wallet a member with `Wallet: view balance` (read-only) or `Wallet: edit rules` (can change) | Entry: rules line on wallet detail (WAL-03) | Exit: SCR-RUL-04, SCR-RUL-08, SCR-RUL-26, SCR-RUL-13
- SCR-RUL-02 | Rule card (rule as a sentence, state chip with icon and word, last firing line, alert reading) | inline (on SCR-RUL-01) | Same as SCR-RUL-01 | Entry: SCR-RUL-01 | Exit: SCR-RUL-13
- SCR-RUL-03 | Read-only notice (one line naming the missing permission and who holds it, `rul.list.permission_needed`) | inline (on SCR-RUL-01) | Group member without `Wallet: edit rules` | Entry: SCR-RUL-01 | Exit: none

**States per surface:**
- SCR-RUL-01 default: cards grouped by template; share rules in order of creation (which is also the order of application, RUL-07); can add a rule, open a card, open summary or history.
- SCR-RUL-01 empty: no rules; one sentence on what rules do and the four template choices as buttons, no illustration-only screen.
- SCR-RUL-01 loading: skeleton cards.
- SCR-RUL-01 refresh failure: cached list stays with "Could not update. Retry".
- SCR-RUL-01 offline: renders from the XCT-04 cache with "Updated hh:mm"; every action that changes a rule disabled with `xct.offline.needs_connection`.
- SCR-RUL-01 read-only (group, no `Wallet: edit rules`): no Add, Edit, Pause or Delete; SCR-RUL-03 shown.
- SCR-RUL-01 forbidden (group, no `Wallet: view balance`): sees `rul.list.not_permitted`, not the rules. A person with only `Wallet: view history` sees no rule list but still sees rule name and "Why" line on entries and the firing history.
- SCR-RUL-01 limit reached: `RULE_MAX_PER_WALLET` rules; Add leads to a picker with all choices disabled (SCR-RUL-04).
- SCR-RUL-02 On: chip On; last firing, for example "Moved 20 000 Ar to Savings, yesterday".
- SCR-RUL-02 Paused: chip Paused.
- SCR-RUL-02 Waiting for vote: chip on a version of a share rule; old version stays in force (RUL-13).
- SCR-RUL-02 Needs attention: share rule whose destination is closed or held by Gereo; reason shown, never "On".
- SCR-RUL-02 Stopped: rule on a closed wallet, "Stopped: wallet closed" (WAL-05), history kept.
- SCR-RUL-02 alert reading: for alert rules, current reading, for example "Spent 120 000 of 200 000 Ar this month".
- SCR-RUL-02 long text: each card reads as one sentence to a screen reader including its state; state never by colour alone; sentence tested at 2x expansion.
- SCR-RUL-03 default: names the missing permission and a holder (`rul.list.permission_needed`).

**Criteria map:**
- AC 1: SCR-RUL-02 On, Paused, Waiting for vote, Needs attention, Stopped, alert reading (card contents).
- AC 2: SCR-RUL-01 default (grouping by template, creation order, "Add a rule" opens RUL-02).
- AC 3: SCR-RUL-01 default (links "What happens when money arrives" and "Rule history").
- AC 4: SCR-RUL-02 Stopped and Needs attention (states from the shared table).
- AC 5: SCR-RUL-01 read-only and forbidden, SCR-RUL-03 default (`rul.list.permission_needed`, `rul.list.not_permitted`).
- AC 6: SCR-RUL-01 empty, loading, refresh failure.
- AC 7: SCR-RUL-01 offline (`xct.offline.needs_connection`, "Updated hh:mm").
- AC 8: no UI, system rule (no ledger entry, no notification, reading not audited).
- AC 9: SCR-RUL-02 long text.

**Objects and fields:** Wallet rule (name, template, state, version, percent, destination, amount, period); Rule firing (last result); Ledger entry (alert readings); Membership.

**Open points:**
- RUL-01 AC 5 shows read-only cards to a group member, while conventions 09 section 6.3 rule 3 or 4 asks whether to hide or show with a reason; the story chooses show with a reason. Confirm that a member with neither `Wallet: view balance` nor `Wallet: edit rules` sees the rules entry point at all (the story says the wallet "has rules and the missing permission" only in RUL-13 AC 3).
- The text of "Could not update. Retry", "Add a rule" and the empty sentence is quoted intent, no keys given. Keys not specified in the story.
- Who is "a person who holds the permission" named in SCR-RUL-03? GRP "unavailable" markers (conventions section 7) may apply to holders who are Locked or Inactive. Not specified in the story.

---

### RUL-02 Choose one of four ready-made rules

**Story:** RUL-02 Choose one of four ready-made rules

**Surfaces:**
- SCR-RUL-04 | Template picker (exactly four choices: "Share each income", "Spending cap", "Goal with a date", "Low-balance alert", keys `rul.template.*`) | page (flow step) | Owner of a personal wallet; `Wallet: edit rules` holder on a group wallet | Entry: "Add a rule" on SCR-RUL-01, empty-state template buttons | Exit: SCR-RUL-05, SCR-RUL-16, SCR-RUL-19, SCR-RUL-23, existing rule via link

**States per surface:**
- SCR-RUL-04 default: four choices, same order for everyone, each with icon, name and one sentence saying whether it moves money (Share moves money; the others are alert only).
- SCR-RUL-04 type highlight: a savings wallet highlights Goal, a budget wallet highlights Spending cap; the four are never hidden or reordered.
- SCR-RUL-04 already exists: second spending cap for the same period, second goal on the wallet, or second low-balance rule; blocked with `err.rul.already_exists` and a link to edit the existing one.
- SCR-RUL-04 share limit: `SHARE_MAX_DESTINATIONS` share rules reached; Share choice disabled with `rul.template.share_limit_reached`.
- SCR-RUL-04 rule limit: `RULE_MAX_PER_WALLET` reached; all choices disabled; `rul.template.limit_reached`.
- SCR-RUL-04 loading: skeleton buttons.
- SCR-RUL-04 offline: screen opens; each choice disabled with `xct.offline.needs_connection`; no rule queued.
- SCR-RUL-04 permission missing (group): screen not reachable; the missing permission named (`err.wal.permission_missing`).
- SCR-RUL-04 tier: internal-only rule needs Tier 1; a rule leaving the group's wallets or reaching another owner needs the money-out tier for its per-firing maximum (ACC-07); the message shown at that limit is not specified in the story.

**Criteria map:**
- AC 1: SCR-RUL-04 default (four choices, icon, sentence, `rul.template.*`).
- AC 2: no UI, system rule (no blank builder, no fifth template, any other request refused).
- AC 3: SCR-RUL-04 already exists and share limit (`err.rul.already_exists`, `rul.template.share_limit_reached`).
- AC 4: SCR-RUL-04 rule limit (`rul.template.limit_reached`).
- AC 5: SCR-RUL-04 type highlight.
- AC 6: SCR-RUL-04 permission missing (`err.wal.permission_missing`); vote gate follows RUL-13.
- AC 7: SCR-RUL-04 tier (ACC-07; no key).
- AC 8: SCR-RUL-04 loading and offline.
- AC 9: no UI, system rule (only the later save writes `rule.created`; browsing writes nothing).

**Objects and fields:** Wallet rule (read, for duplicates); Wallet (type); Permission (read).

**Open points:**
- RUL-02 AC 6 says the screen is "not reachable" without `Wallet: edit rules`, while RUL-01 AC 5 hides Add and conventions 09 section 6.3 prefers a visible reason. What does a member who arrives by deep link see: forbidden with `err.wal.permission_missing` and a way to request access? Not specified in the story.
- RUL-02 AC 7 lets a rule leave the group's wallets or reach another owner, while RUL-03 AC 4 and RUL-13 AC 5 say a rule can never target a personal wallet or an outside party. Which is current for the tier line, and does any UI path let a rule reach a leaf outside the group (conventions 10.3 chain-leaf rule)? Not specified in the story.
- Tier message and its upgrade path (ACC-07) for a share rule above the person's limit: key not specified in the story.

---

### RUL-03 Build a share rule as one sentence

**Story:** RUL-03 Build a share rule as one sentence

**Surfaces:**
- SCR-RUL-05 | Share rule builder (one sentence with three slots: source wallet fixed, percent on a numeric keypad, destination wallet; optional rule name up to `RULE_NAME_MAX`, default "Share income"; remainder line; rounding and future-only text; live preview; button "Save rule", restated as "Save: 20 percent of each income to Savings") | page | Owner of a personal wallet; for a group wallet the group version is CON-11, reached with `Wallet: edit rules` | Entry: "Share each income" on SCR-RUL-04, Edit on SCR-RUL-13 | Exit: SCR-RUL-08 (after save), SCR-RUL-01
- SCR-RUL-06 | Destination wallet picker (open wallets the person can receive into, different from the source) | sheet | Same as SCR-RUL-05 | Entry: destination slot of SCR-RUL-05 | Exit: SCR-RUL-05

**States per surface:**
- SCR-RUL-05 default: sentence with three slots; default name proposed; live preview (SCR-RUL-07) and "Save rule" below.
- SCR-RUL-05 percent invalid: not a whole number from 1 to 100; Save blocked; message key not specified.
- SCR-RUL-05 percent over 100: total of rules On, Paused or Waiting for vote including this one above 100; Save blocked; "Together your rules take 120 percent. Lower one by 20" (`err.rul.percent_over_100`).
- SCR-RUL-05 remainder: total below 100; line "The other [N] percent stays in [wallet]"; valid, no confirmation.
- SCR-RUL-05 loop or chain too long: choice blocked inline with the reason (SCR-RUL-09), never only after Save.
- SCR-RUL-05 future only: sentence `rul.share.future_only` ("Applies to income that arrives after you save. Past income is not touched.").
- SCR-RUL-05 first save: the rounding line links to the terms (ACC-13).
- SCR-RUL-05 saving: progress shown; double tap creates one rule (idempotency key).
- SCR-RUL-05 failure: nothing created; typed values kept.
- SCR-RUL-05 offline: Save disabled with `xct.offline.needs_connection`.
- SCR-RUL-05 no destination: no other open wallet exists; precondition says at least one; the screen for none is not specified.
- SCR-RUL-05 share limit: `SHARE_MAX_DESTINATIONS` reached; not reachable (SCR-RUL-04).
- SCR-RUL-05 group wallet: save goes through the decision gate (SCR-RUL-33).
- SCR-RUL-05 accessibility: sliders never the only input; every slot reachable by keyboard and screen reader and read as one sentence; same slot order in three languages where grammar allows.
- SCR-RUL-06 default: open wallets only; personal rule offers only other wallets of the same owner; group rule offers only other wallets of the same group; no member personal wallet, no other user.
- SCR-RUL-06 empty: no eligible destination; not specified in the story.
- SCR-RUL-06 blocked options: a choice that would create a cycle or exceed the chain limit is shown with its reason inline (SCR-RUL-09).

**Criteria map:**
- AC 1: SCR-RUL-05 default (three slots, name, preview, "Save rule").
- AC 2: SCR-RUL-05 percent invalid and percent over 100 (`err.rul.percent_over_100`).
- AC 3: SCR-RUL-05 remainder.
- AC 4: SCR-RUL-06 default and SCR-RUL-04 share limit (`SHARE_MAX_DESTINATIONS`, destination rules).
- AC 5: SCR-RUL-05 loop or chain too long (inline, RUL-06).
- AC 6: SCR-RUL-05 future only and first save (`rul.share.future_only`, rounding in words, ACC-13 link).
- AC 7: SCR-RUL-05 default (Save button restates the sentence, no confirmation sheet).
- AC 8: SCR-RUL-05 saving, failure, offline.
- AC 9: no UI, system rule (no ledger entry; audit `rule.created` version 1; `splitrule.created` for a group wallet).
- AC 10: SCR-RUL-05 accessibility.

**Objects and fields:** Wallet rule (source, percent, destination, name, version 1); Wallet; Audit entry.

**Open points:**
- Key for the percent-invalid message (non-numeric, 0, above 100): not specified in the story.
- What does the person see when no other open wallet exists (precondition says at least one)? Not specified in the story.
- The group builder is CON-11; which surface IDs does the group version use, and does it reuse SCR-RUL-05 states? Not specified in the story.
- The sentence "The first time a person saves a share rule, the rounding line links to the terms": is it a link only, or a consent step if ACC-13 re-consent is needed (conventions 10.6 says re-consent only when a line type or formula changes)? Not specified in the story.

---

### RUL-04 See what a rule would have done with my real recent incomes

**Story:** RUL-04 See what a rule would have done with my real recent incomes

**Surfaces:**
- SCR-RUL-07 | Live preview (up to `PREVIEW_INCOME_COUNT` recent incomes within `PREVIEW_LOOKBACK`, sample amount input, per-line `rul.preview.line`, rounding line, chain preview, "Preview only. No money was moved.") | inline (on SCR-RUL-05; also shown in the edit compare of SCR-RUL-13) | Owner of a personal wallet; for a group wallet `Wallet: edit rules` plus `Wallet: view history` (CON-12 is the group version) | Entry: typing in SCR-RUL-05 or tapping "Preview" | Exit: none

**States per surface:**
- SCR-RUL-07 default: lines like "Salary 400 000 Ar on 5 Oct: 80 000 Ar would go to Savings, 320 000 Ar would stay" (`rul.preview.line`), updating as the person types.
- SCR-RUL-07 rounding: always adds up (destinations plus Rounding line to Gereo plus what stays equals the income to the ariary); a Rounding line above 0 shown as one aggregated row going to Gereo; no row at 0.
- SCR-RUL-07 existing rules included: effect of all On rules together with the draft; a paused rule shown "paused, not counted"; a destination that passes money on shows its own share down to `RULE_CHAIN_DEPTH_MAX` hops.
- SCR-RUL-07 zero share: "0 Ar, no entry would be made for it".
- SCR-RUL-07 labelled: "Preview only. No money was moved."; no provider fee shown (moves between wallets are free).
- SCR-RUL-07 empty: no past income; asks for a typed sample amount and says so; invented incomes never shown.
- SCR-RUL-07 sample mode: person can type a sample amount instead of or beside real incomes.
- SCR-RUL-07 loading: skeleton lines.
- SCR-RUL-07 failure: failed load keeps sample mode working.
- SCR-RUL-07 permission limited: group member without `Wallet: view history` sees only sample-amount mode with the missing permission named (as CON-12).
- SCR-RUL-07 offline: works from the cached history (XCT-04) with "Updated hh:mm"; Save stays disabled.
- SCR-RUL-07 privacy: counterparty numbers masked as in the ledger; no audit entry, no ledger entry.

**Criteria map:**
- AC 1: SCR-RUL-07 default (count, lookback, `rul.preview.line`, live).
- AC 2: SCR-RUL-07 rounding (same rounding as the engine, always adds up, Rounding row rules).
- AC 3: SCR-RUL-07 existing rules included (On rules together, paused not counted, chain down to the depth limit).
- AC 4: SCR-RUL-07 zero share.
- AC 5: SCR-RUL-07 labelled.
- AC 6: SCR-RUL-07 empty, sample mode, loading, failure.
- AC 7: SCR-RUL-07 permission limited.
- AC 8: SCR-RUL-07 offline.
- AC 9: SCR-RUL-07 privacy.

**Objects and fields:** Ledger entry (read, last incomes: description, amount, date); Wallet rule (draft); Wallet.

**Open points:**
- The preview example "Salary 400 000 Ar on 5 Oct" shows a counterparty or description label; which ledger field supplies it for a deposit from mobile money (masked number)? Not specified in the story.
- Does the preview of the Rounding line name Gereo only in words ("1 Ar rounding goes to Gereo") or with a key? Not specified in the story.
- How is the preview shown when the chain preview would exceed the screen at 320 px and 200% text? Not specified in the story.

---

### RUL-05 See everything that happens when money arrives, in one place

**Story:** RUL-05 See everything that happens when money arrives, in one place

**Surfaces:**
- SCR-RUL-08 | "What happens when money arrives" summary (ordered list of shares, total moved, what stays, alerts under "Alerts", worked example, chain path in words) | page | Owner of a personal wallet; group member with `Wallet: view balance`; same screen as CON-11 | Entry: link on SCR-RUL-01, from the builder, after saving a change | Exit: SCR-RUL-01, SCR-RUL-05

**States per surface:**
- SCR-RUL-08 default: "When income arrives in Main: 1. 20 percent to Savings. 2. 10 percent to School fees. The other 70 percent stays in Main."; alerts listed under "Alerts".
- SCR-RUL-08 totals: "Total moved: 30 percent. Stays: 70 percent"; at exactly 100, "Nothing stays in Main".
- SCR-RUL-08 rule states: Paused shown "Paused, not applied"; Waiting for vote "Waiting for vote, not applied"; Needs attention with its reason; Stopped "Stopped".
- SCR-RUL-08 worked example: last income or typed amount, same rounding as the engine ("With 100 000 Ar: 20 000 to Savings, 10 000 to School fees, 70 000 stay"); adds "1 Ar rounding goes to Gereo" when rounding leaves an amount.
- SCR-RUL-08 chain: follows destinations that pass money on up to `RULE_CHAIN_DEPTH_MAX` hops ("20 percent to Savings, which sends 50 percent of that to School fees"); never shows a path blocked by RUL-06; never chains across owners.
- SCR-RUL-08 loading: skeleton.
- SCR-RUL-08 offline: readable from the XCT-04 summary cache with "Updated hh:mm".
- SCR-RUL-08 permission: group member without `Wallet: view balance` sees `rul.summary.not_permitted`.
- SCR-RUL-08 no rules: not reachable (precondition: at least one rule); not specified.
- SCR-RUL-08 accessibility: real ordered list for screen readers; amounts never clip at 200% font scale; works in three languages.
- SCR-RUL-08 order: no up and down buttons (order of creation is order of application).

**Criteria map:**
- AC 1: SCR-RUL-08 default (ordered list, alerts).
- AC 2: SCR-RUL-08 totals.
- AC 3: SCR-RUL-08 rule states.
- AC 4: SCR-RUL-08 worked example.
- AC 5: SCR-RUL-08 order (creation order, no reordering).
- AC 6: SCR-RUL-08 chain.
- AC 7: SCR-RUL-08 loading, offline, permission (`rul.summary.not_permitted`).
- AC 8: no UI, system rule (no notifications).
- AC 9: SCR-RUL-08 accessibility.

**Objects and fields:** Wallet rule (all rules, states, percent, destination); Ledger entry (last income); Wallet.

**Open points:**
- The summary is "the screen shared with CON-11" yet group chains are limited to the same group (RUL-03 AC 4) while conventions 10.3 allows a leaf outside the group through a vote; does the summary show an outside leaf? Not specified in the story.
- Where is the typed sample amount entered on SCR-RUL-08 and is it kept? Not specified in the story.
- Key for each summary sentence is not specified (only `rul.summary.not_permitted` is named).

---

### RUL-06 Stop a rule that would send money in a circle

**Story:** RUL-06 Stop a rule that would send money in a circle

**Surfaces:**
- SCR-RUL-09 | Loop and chain error message (inline next to the offending slot, with focus moved to it and repeated in the error summary at the top) | inline (on SCR-RUL-05, and on Resume in SCR-RUL-13) | Person saving, resuming or editing a share rule | Entry: Save, Resume or edit of destination or percent | Exit: back to the slot
- SCR-RUL-10 | System: pause of a foreign rule when a wallet it targets is being deleted (ACC-15) and run-time cycle and depth checks | system | Owner of the affected rule is notified | Entry: account deletion, or any engine hop | Exit: rule state Needs attention with reason `destination_deleted`, notification of SCR-RUL-32

**States per surface:**
- SCR-RUL-09 cycle: all active share rules followed from the destination reach the source again; Save blocked; "This would send money in a circle: Main sends 20 percent to Savings, Savings sends 10 percent to Main. Change one of them." (`err.rul.cycle`, wallet names as parameters).
- SCR-RUL-09 same wallet: rule sends to its own wallet; `err.rul.same_wallet`.
- SCR-RUL-09 chain too long: chain above `RULE_CHAIN_DEPTH_MAX` hops counting every wallet above and below; `err.rul.chain_too_long` naming the limit and the longest path; also checked when a rule is saved on a wallet that already receives money from others.
- SCR-RUL-09 resume blocked: Resume would create a loop; rule stays Paused and the path is named.
- SCR-RUL-09 hidden wallet: person lacks `Wallet: view balance` on a wallet in the path; named "a wallet of [group name]".
- SCR-RUL-09 offline: check runs on cached rules for guidance only; Save disabled anyway.
- SCR-RUL-09 checked set: counts rules On, Paused and Waiting for vote across all wallets of the owner, or of the group.
- SCR-RUL-10 run-time skip: loop or over-long chain appears later; hop skipped with `cycle_prevented` or `chain_too_long`, writes nothing, money stays in the wallet where the hop would have run (RUL-12); audit `rule.skipped` with the path; notice `msg.rul.skipped` (personal) or `msg.con.split_failed` (group).
- SCR-RUL-10 deleted wallet: a user whose wallet is being deleted is the target of a foreign rule, or a chain passes through it; each affected rule paused, Needs attention with `destination_deleted`, no firing until a person acts; owner of that rule notified; no money lost. Test: a 2-hop chain where a third party owns hop 1; deleting the wallet at the end of hop 1 pauses the hop 1 rule, notifies the third party and leaves hop 0 running.
- SCR-RUL-10 no switch-off: no setting, role or operator action turns the checks or the depth limit off.

**Criteria map:**
- AC 1: SCR-RUL-09 cycle (`err.rul.cycle`, path in words).
- AC 2: SCR-RUL-09 same wallet (`err.rul.same_wallet`).
- AC 3: SCR-RUL-09 chain too long (`err.rul.chain_too_long`, hop counting).
- AC 4: SCR-RUL-09 checked set and resume blocked.
- AC 5: SCR-RUL-10 run-time skip (`cycle_prevented`, `chain_too_long`).
- AC 6: no UI, system rule (checks and depth limit mandatory; hop number on each entry; no entry above `RULE_CHAIN_DEPTH_MAX`).
- AC 7: SCR-RUL-09 hidden wallet ("a wallet of [group name]").
- AC 8: SCR-RUL-09 default placement and offline (inline, focus moved, error summary).
- AC 9: SCR-RUL-10 run-time skip (audit `rule.skipped`; a blocked save writes no audit entry and sends nothing).
- AC 10: SCR-RUL-10 deleted wallet (`destination_deleted`).

**Objects and fields:** Wallet rule (source, destination, state, hop); Audit entry (`rule.skipped` with path).

**Open points:**
- Conventions 6 item 5 says "cycle detection and chain depth RUL-07" while 10.2 and 10.9 say RUL-06 owns them, and RUL-07 AC 5 says it is "the sole owner". Which story owns the check surfaces and error keys?
- Hop counting differs: RUL-06 AC 3 counts Main to Savings as hop 1, RUL-07 AC 5 says hop 0 is the request-made transfer or manual move. Is the move that triggers a chain a hop 0 on the preview and ledger? Not specified in the story.
- Notification of a foreign rule owner under SCR-RUL-10 uses `msg.rul.skipped`; the story names no catalogue row for the "paused for destination_deleted" notice. Not specified in the story.
- The error summary at the top: key and layout not specified in the story.

---

### RUL-07 Apply my rules automatically when income arrives

**Story:** RUL-07 Apply my rules automatically when income arrives

**Surfaces:**
- SCR-RUL-11 | System: share rule engine (consumes the WAL-07 "money posted to a wallet" event; runs each On share rule per credit, one atomic posting per hop, retries, chain hops, post-run alert checks, firing record and audit entry) | system | none; results appear on SCR-RUL-26, SCR-RUL-29, SCR-RUL-30 | Entry: any Confirmed credit into a wallet | Exit: ledger lines, firing records, SCR-RUL-12, alert evaluation
- SCR-RUL-12 | Notification: rule fired (`msg.rul.fired`, in-app item only, batched under NTF-08) | notification | Wallet owner; on a group wallet members with `Wallet: view history` | Entry: system after a run | Exit: SCR-RUL-26 or the transaction

**States per surface:**
- SCR-RUL-11 income: every Confirmed credit triggers the wallet's On share rules whatever its source or chip (deposit, own move, transfer received, contribution, Split line); not income: reversal or refund entry, Fee line, Rounding line, anything not Confirmed.
- SCR-RUL-11 calculation: each rule takes its percent of the whole credit in creation order; total above 100 at run time skips the whole run with `percent_over_100` and writes nothing; the credit is the net amount credited (provider fee is its own Fee line).
- SCR-RUL-11 rounding: round down per destination; leftover to Gereo as a Rounding line, only when above 0, one aggregated receipt row per original income (per-hop lines in export only, none in SMS receipts). Test vector: credit 10 Ar, lines 33, 33, 34 percent gives 3, 3, 3 and Gereo 1, nothing stays.
- SCR-RUL-11 posting: one atomic posting per hop with credit reference; entries named by `rul.ledger.share_line` (for example "20 percent to Savings by rule Share income"); every written entry carries `rule_name`, `rule_version`, `hop`, `caused_by_entry_id`.
- SCR-RUL-11 skipped destination: closed or held destination skips only its own line (`destination_closed`, `destination_held`); other shares go ahead; money stays in the wallet.
- SCR-RUL-11 held for limit: destination balance cap or single-deposit limit (OPS-11) exceeded; held in the source wallet with a visible reason, retried under `RULE_RETRY_MAX`; reason `recipient_limit`.
- SCR-RUL-11 frozen: wallet freeze (SPD-15) pauses firings whose destination is outside the group (`wallet_frozen`); internal firings and the Rounding line continue.
- SCR-RUL-11 held wallet: operator hold stops the wallet's rules (`wallet_held`).
- SCR-RUL-11 reserves: campaign or set-aside reserves unavailable to firings.
- SCR-RUL-11 chain: each Split line is a Confirmed credit into its destination and runs that wallet's rules one hop deeper up to `RULE_CHAIN_DEPTH_MAX`; each hop its own atomic posting with its own idempotency key; a later hop failing leaves earlier hops done; cycle and depth checks repeated before each hop.
- SCR-RUL-11 idempotent: one run per credit, rule version and destination; a duplicate callback or retry writes nothing more; transient failure retried up to `RULE_RETRY_MAX` after 1, 5 and 15 minutes; permanent failure waits for a person.
- SCR-RUL-11 future only: a version applies only to credits Confirmed after its effective time; credits received while paused are never split later.
- SCR-RUL-11 alerts after run: wallet re-read and cap, goal and low-balance rules checked on the new balance for every wallet in the chain; a rule failure never rolls back the credit.
- SCR-RUL-11 ledger error: whole run fails, never a partial posting.
- SCR-RUL-11 campaign wallet: a campaign wallet cannot be the source of an outgoing rule; refused at save while the campaign is Open or Refunding (`err.rul.campaign_source`); an existing outgoing rule is refused or suspended when the wallet becomes a campaign wallet (Needs attention with a visible reason).
- SCR-RUL-12 default: `msg.rul.fired` in-app, no push, no SMS; busy day gives one batched summary.

**Criteria map:**
- AC 1: SCR-RUL-11 income (D3, what is and is not income).
- AC 2: SCR-RUL-11 calculation (`percent_over_100` skip, order, net credit).
- AC 3: SCR-RUL-11 rounding (D5 test vector).
- AC 4: SCR-RUL-11 posting, skipped destination, held for limit, frozen, held wallet, reserves, ledger error.
- AC 5: SCR-RUL-11 chain (cycle, depth, hops, idempotency per hop).
- AC 6: SCR-RUL-11 idempotent.
- AC 7: SCR-RUL-11 future only.
- AC 8: SCR-RUL-11 alerts after run.
- AC 9: no UI, system rule (firing record and `rule.fired` audit per run, shared reference ID).
- AC 10: SCR-RUL-12 default (`msg.rul.fired`, NTF-08 batching).
- AC 11: SCR-RUL-11 campaign wallet (`err.rul.campaign_source`).

**Objects and fields:** Transaction (read), Wallet rule (version, percent, destination), Ledger entry (write: Split, Rounding), Rule firing (write), Notification (write), Audit entry (write).

**Open points:**
- Skip reason list ownership: RUL-12 AC 3 says it owns the list, conventions 11.5 says the list is in RUL-07. Which is the source for the reason codes and their `rul.history.skipped.*` keys?
- `recipient_limit` is described in RUL-07 AC 4 as "held in the source wallet and retried" and in RUL-12 as a Skipped reason; is it Skipped, Needs attention or both while retrying, and what does the person see between attempts? Not specified in the story.
- RUL-07 AC 5 gives hop 0 as the request-made transfer or manual move; the first rule firing on a deposit is then hop 1. The ledger "hop" shown to people (RUL-12) is not specified.
- Which surface shows a share rule suspended because its wallet became a campaign wallet, and with what key? Not specified in the story (state Needs attention only).
- Is `msg.rul.fired` also sent to a person who has `Wallet: view history` but not `Wallet: view balance` on a group wallet? Story says members with `Wallet: view history`; consistency with RUL-01 closed question not stated.

---

### RUL-08 Pause, resume, edit or delete a rule, for future income only

**Story:** RUL-08 Pause, resume, edit or delete a rule, for future income only

**Surfaces:**
- SCR-RUL-13 | Rule detail (the rule as a sentence, state, version and effective time, actions Pause, Resume, Edit, Delete, its own history, one sentence explaining what is not a skip) | page | Owner of a personal wallet; group member with `Wallet: view balance` (actions only with `Wallet: edit rules`) | Entry: card on SCR-RUL-01, rule line on a transaction (WAL-14), "See in history" | Exit: SCR-RUL-01, builders, SCR-RUL-26
- SCR-RUL-14 | Delete confirmation ("Delete 'Share income'? Past entries stay and keep this name"; goal variant asks the person to agree) | modal | Person with the permission | Entry: Delete on SCR-RUL-13 | Exit: SCR-RUL-01
- SCR-RUL-15 | Concurrent change review ("Changed by [name] at hh:mm. Review", both versions, choose) | sheet | Person whose save conflicted | Entry: save when another person saved first | Exit: SCR-RUL-13

Edit reuses SCR-RUL-05, SCR-RUL-16, SCR-RUL-19 and SCR-RUL-23 in edit mode.

**States per surface:**
- SCR-RUL-13 On: chip On; Pause available; one tap, applies at once, chip also on the wallet card ("Rules paused", WAL-02).
- SCR-RUL-13 Paused: Resume sets On at once; `rul.edit.future_only` with the effective time ("Applies to income after 14:05"); income received while paused never split on resume.
- SCR-RUL-13 resume blocked: RUL-06 loop or depth check fails; rule stays Paused and the path is named (SCR-RUL-09); also percent total (RUL-03) and duplicates (RUL-02) checks.
- SCR-RUL-13 edit: each save creates a new rule version and shows the effective time; past entries keep the version in force; a renamed rule shows the new name on the card and the old name on past entries; a changed share requires a preview comparing old and new outcome on the same sample.
- SCR-RUL-13 deleted: rule leaves the list, keeps "(deleted)" after its name on past entries; can be recreated, not restored.
- SCR-RUL-13 group wallet without permission: no action button shown.
- SCR-RUL-13 group wallet gated change: creating an Active share rule, changing percent or destination, adding a rule to a wallet with Active rules goes through the gate (SCR-RUL-33); old version stays active until it passes; pause, resume and end never gated.
- SCR-RUL-13 closed wallet: rules Stopped (WAL-05); actions not available.
- SCR-RUL-13 offline: all actions disabled with `xct.offline.needs_connection`.
- SCR-RUL-13 failure: typed values kept; says nothing changed.
- SCR-RUL-13 long paused: rule stays visible as Paused; asks nothing.
- SCR-RUL-14 share rule: restates the rule; one confirmation; line stops at once.
- SCR-RUL-14 goal: deleting a goal rule removes the goal from the wallet after the person agrees (goal and rule are one record, WAL-04).
- SCR-RUL-14 no confirmation for pause and resume: by design.
- SCR-RUL-15 default: both versions shown; person chooses; nothing overwritten silently.

**Criteria map:**
- AC 1: SCR-RUL-13 On and Paused (one-tap pause and resume, chips).
- AC 2: SCR-RUL-13 Paused (`rul.edit.future_only`, effective time).
- AC 3: SCR-RUL-13 edit (new version, names on past entries).
- AC 4: SCR-RUL-13 edit and resume blocked (checks and required preview).
- AC 5: SCR-RUL-14 share rule and SCR-RUL-13 deleted ("(deleted)", `rule.*` audit).
- AC 6: SCR-RUL-14 goal.
- AC 7: SCR-RUL-13 group wallet without permission and gated change (decision gate, never for pause, resume, end).
- AC 8: SCR-RUL-15 default.
- AC 9: SCR-RUL-13 offline and failure (audit `rule.paused`, `rule.resumed`, `rule.edited`, `rule.deleted`; no ledger entry).

**Objects and fields:** Wallet rule (state, version, effective time, name); Audit entry; Vote (link, group).

**Open points:**
- "Rule detail" is nowhere defined as a screen in the stories (RUL-12 says "each rule's own page", RUL-07 and RUL-12 say "the rule detail explains"). Confirm SCR-RUL-13 as one page and its URL and layout. Not specified in the story.
- RUL-08 AC 5 says Delete "ends" a line; conventions 11.5 says CON "Ended" is a soft state different from RUL deleted. Which label does the group rule delete show: Delete or End? Not specified in the story.
- The "Review" sheet of AC 8 compares two versions: is the person asked to re-run their edit on the latest version? Not specified in the story.
- No key given for "Delete" confirmation, "Changed by [name] at hh:mm. Review" or the preview comparison. Not specified in the story.
- Pause or Resume on a share rule in Waiting for vote: allowed? Not specified in the story.

---

### RUL-09 Set a spending cap and be alerted when it is reached

**Story:** RUL-09 Set a spending cap and be alerted when it is reached

**Surfaces:**
- SCR-RUL-16 | Spending cap editor (sentence "When spending from [wallet] in [period] reaches [amount], alert me"; period from `CAP_PERIOD_OPTIONS` week or month; amount at least 1 Ar on a numeric keypad; 80 percent warning switch) | page | Owner of a personal wallet; `Wallet: edit rules` on a group wallet | Entry: "Spending cap" on SCR-RUL-04, Edit | Exit: SCR-RUL-01
- SCR-RUL-17 | Cap progress (text "Spent 120 000 of 200 000 Ar this month", bar with numbers, "This month, resets 1 Nov"; also Safe to spend and the review-sheet line elsewhere) | inline (on SCR-RUL-02, SCR-RUL-13, wallet detail) | Same as SCR-RUL-01 | Entry: card, wallet | Exit: none
- SCR-RUL-18 | Notification: cap reached and early warning (`msg.rul.cap_reached`, EV-RUL-02, in-app and push, no SMS) | notification | Wallet owner; on a group wallet holders of `Wallet: edit rules` | Entry: system when spent first reaches the cap, and at `CAP_WARNING_PERCENT` | Exit: SCR-RUL-13

**States per surface:**
- SCR-RUL-16 default: sentence; saving shows card "Spent ... of ... Ar this month".
- SCR-RUL-16 duplicate: second cap for the same period blocked with `err.rul.already_exists` (RUL-02).
- SCR-RUL-16 cap raised: person raises cap after it was reached; alert may fire again only when the new cap is reached.
- SCR-RUL-16 offline: saving and editing need a connection; `xct.offline.needs_connection`.
- SCR-RUL-16 group wallet: cap mode (`spend_cap_mode`) is under `Group: set spending policy` (SPD-14); this screen holds the value and the alert only; personal cap is warn-only with no mode field and never stops a payment.
- SCR-RUL-16 warning off: person may switch the 80 percent warning off on their own cap.
- SCR-RUL-17 counting: Confirmed money-out only: payments to another person or group (WAL-13) and group payouts (SPD-10, chip Expense); excludes Cash-out, manual moves between own wallets, Split and Rounding lines, fees counted under the payment, Failed or Cancelled; a reversal reduces the total; reserved but unpaid requests not counted.
- SCR-RUL-17 period: Madagascar time; month from the 1st; at reset the counter starts at zero and the alert can fire again.
- SCR-RUL-17 offline: counter reads from the XCT-04 cache with "Updated hh:mm".
- SCR-RUL-17 loading: skeleton.
- SCR-RUL-17 refresh failure: last number with "Not updated since [time]".
- SCR-RUL-17 effects elsewhere: while active, Safe to spend is the lower of (Available minus reserved minus campaign reserves) and the cap left (WAL-03); WAL-10 review sheet adds the line that a payment passes the cap.
- SCR-RUL-18 warning: once per period at `CAP_WARNING_PERCENT` with the same message family and the figures.
- SCR-RUL-18 reached: once per period when spent first reaches or passes the cap; blocks no payment; text includes both numbers and the period ("You have spent 200 000 of your 200 000 Ar cap this month"), no blame, no exclamation marks.
- SCR-RUL-18 suppression: `msg.spd.cap_blocked` suppressed when this key was raised for the same request within the batch window.

**Criteria map:**
- AC 1: SCR-RUL-16 default and SCR-RUL-17 (sentence, period options, bar with numbers).
- AC 2: SCR-RUL-17 counting.
- AC 3: SCR-RUL-17 period.
- AC 4: SCR-RUL-18 warning and reached (`msg.rul.cap_reached`, once per period, audience).
- AC 5: SCR-RUL-17 effects elsewhere and SCR-RUL-16 group wallet.
- AC 6: SCR-RUL-16 cap raised.
- AC 7: SCR-RUL-17 offline, loading, refresh failure; SCR-RUL-16 offline.
- AC 8: no UI, system rule (audit `rule.created`, `rule.edited`; each alert a firing record; no ledger entry).
- AC 9: SCR-RUL-18 reached (plain text with both numbers and the period).

**Objects and fields:** Wallet rule (period, amount, warning flag); Ledger entry (spending); Rule firing (alert with spent total and cap); Notification; Audit entry.

**Open points:**
- `CAP_PERIOD_OPTIONS` period start for week is not stated (month from the 1st). Which weekday starts the week? Not specified in the story.
- Which key carries the text "Not updated since [time]" and the 80 percent warning text variant? Not specified in the story.
- Does a group-wallet cap editor show the `spend_cap_mode` value as read-only text? Not specified in the story.
- EV-RUL-02 is named for `msg.rul.cap_reached`; the warning at 80 percent uses "the same message family": same key or a variant? Not specified in the story.

---

### RUL-10 Set a goal with a target date and follow it

**Story:** RUL-10 Set a goal with a target date and follow it

**Surfaces:**
- SCR-RUL-19 | Goal editor (sentence "I want [wallet] to reach [amount] by [date]"; amount at least 1 Ar; date in the future with Madagascar time zone; same record as wallet creation WAL-01 and WAL-04) | page | Owner of a personal wallet; `Wallet: edit rules` on a group wallet | Entry: "Goal with a date" on SCR-RUL-04, "Set a goal" on an empty wallet, wallet detail | Exit: wallet detail
- SCR-RUL-20 | Goal progress (`7 500 / 10 000 Ar`, bar, percent, amount left, date, average per week still needed, chips "Goal reached" and "Target date passed") | inline (on wallet card and detail, SCR-RUL-02, SCR-RUL-13) | Owner; group members with `Wallet: view balance` | Entry: wallet | Exit: SCR-RUL-19
- SCR-RUL-21 | Notification: goal reached (`msg.rul.goal_reached`, EV-RUL-04, in-app and push) | notification | Wallet owner; on a group wallet every member with `Wallet: view balance` | Entry: system when Available first reaches the amount | Exit: wallet detail
- SCR-RUL-22 | Notification: goal behind schedule (`msg.rul.goal_behind`, EV-RUL-05, Low class, in-app and digest, no push, no SMS) | notification | Wallet owner; on a group wallet holders of `Wallet: edit rules` | Entry: system at `GOAL_CHECK_DAY` | Exit: wallet detail

**States per surface:**
- SCR-RUL-19 default: sentence; saving shows the goal on the wallet card and detail.
- SCR-RUL-19 one goal: at most one goal per wallet; same record from every entry; editing creates a new version and keeps history.
- SCR-RUL-19 validation: amount below 1 Ar or date not in the future; message key not specified.
- SCR-RUL-19 date passed: "Target date passed"; person can extend the date or change the amount; no money moves, no fee or penalty.
- SCR-RUL-19 removal: removing the goal asks the person to agree (SCR-RUL-14 goal variant); ends the goal's alerts; keeps past progress in history.
- SCR-RUL-19 offline: saving disabled.
- SCR-RUL-20 empty: wallet without a goal shows "Set a goal".
- SCR-RUL-20 default: progress counts the wallet's Available balance; average per week needed shown as information, not a promise.
- SCR-RUL-20 reached: chip "Goal reached"; goal stays on the wallet; alert not repeated if the balance falls and rises again unless the goal was raised.
- SCR-RUL-20 behind: in the detail, one sentence of the rule ("You planned 10 000 Ar by 31 Dec").
- SCR-RUL-20 offline: progress reads from the XCT-04 cache with "Updated hh:mm"; failed refresh keeps last figures.
- SCR-RUL-20 accessibility: the bar has a text alternative with the numbers; dates in words in the person's language; never by colour alone.
- SCR-RUL-21 default: sent once; group wallet audience every member with `Wallet: view balance`.
- SCR-RUL-22 default: Low item; behind means below the straight-line pace between the start and the target date.

**Criteria map:**
- AC 1: SCR-RUL-19 default and SCR-RUL-20 default (sentence, display on wallet card and detail).
- AC 2: SCR-RUL-19 one goal.
- AC 3: SCR-RUL-20 default (Available balance, average per week).
- AC 4: SCR-RUL-21 default, SCR-RUL-20 reached (`msg.rul.goal_reached`).
- AC 5: SCR-RUL-22 default, SCR-RUL-20 behind (`msg.rul.goal_behind`).
- AC 6: SCR-RUL-19 date passed.
- AC 7: SCR-RUL-19 removal.
- AC 8: SCR-RUL-20 empty and offline, SCR-RUL-19 offline.
- AC 9: no UI, system rule (audit `rule.created` or `rule.edited`; each alert a firing record; no ledger entry).
- AC 10: SCR-RUL-20 accessibility.

**Objects and fields:** Wallet rule (goal amount, date, version); Wallet (Available); Ledger entry (balance); Rule firing; Notification; Audit entry.

**Open points:**
- The story says the NTF row EV-RUL-05 "must add" the group audience (holders of `Wallet: edit rules`); is the catalogue row already updated? Not specified in the story.
- Who sees "Goal reached" chip and "Target date passed" in the group when the viewer lacks `Wallet: view balance`? Not specified in the story.
- Validation keys for the goal form: not specified in the story.
- Does the goal editor for a group wallet go through the decision gate? Story RUL-13 AC 4 says cap, goal and low-balance rules are not gated; but RUL-10 permission needs `Wallet: edit rules` (money-out class, PIN on grant). Confirm that no PIN is asked at save.

---

### RUL-11 Be told when a wallet falls below a level I chose

**Story:** RUL-11 Be told when a wallet falls below a level I chose

**Surfaces:**
- SCR-RUL-23 | Low-balance alert editor (sentence "When [wallet] falls below [amount], alert me"; amount at least 1 Ar) | page | Owner of a personal wallet; `Wallet: edit rules` on a group wallet | Entry: "Low-balance alert" on SCR-RUL-04, Edit | Exit: SCR-RUL-01
- SCR-RUL-24 | Low balance chip and line ("Low balance", "Below 50 000 Ar", card shows "Alert below 50 000 Ar" and current Available; shown on wallet card and detail, owned by WAL-19) | inline | Owner; group members with `Wallet: view balance` | Entry: wallet card and detail, SCR-RUL-02 | Exit: none
- SCR-RUL-25 | Notification: low balance (`msg.rul.low_balance`, EV-RUL-03, in-app and push, no SMS, button "Add money" opening WAL-06) | notification | Wallet owner; on a group wallet holders of `Wallet: edit rules` | Entry: system on crossing | Exit: WAL-06 deposit

**States per surface:**
- SCR-RUL-23 default: sentence; after saving the card shows "Alert below 50 000 Ar" and the current Available.
- SCR-RUL-23 duplicate: one alert level per wallet; a second is blocked by `err.rul.already_exists`.
- SCR-RUL-23 saved while already below: chip shown at once and one alert sent.
- SCR-RUL-23 offline: saving disabled with `xct.offline.needs_connection`.
- SCR-RUL-24 low: Available below the level; chip "Low balance" and line "Below 50 000 Ar"; a balance exactly at the level is not low; clears at or above the level.
- SCR-RUL-24 offline: state reads from cache with "Updated hh:mm"; failed refresh keeps the last figure.
- SCR-RUL-24 pending money: only posted Available counts; money on its way in not counted, money on its way out already deducted.
- SCR-RUL-24 no rule: no low state exists without the person's rule.
- SCR-RUL-25 crossing: sent when Available moves from at or above the level to below, once; re-armed when Available is again at or above; check runs after every posting including RUL-07 postings.
- SCR-RUL-25 content: "Savings has 42 000 Ar, below your 50 000 Ar alert", both numbers, no exclamation marks; "Add money" button.
- SCR-RUL-25 group: goes to holders of `Wallet: edit rules`.

**Criteria map:**
- AC 1: SCR-RUL-23 default.
- AC 2: SCR-RUL-25 crossing and SCR-RUL-23 saved while already below.
- AC 3: SCR-RUL-25 crossing (any posted entry can cause it).
- AC 4: SCR-RUL-25 content and group (`msg.rul.low_balance`, "Add money", group audience).
- AC 5: SCR-RUL-24 low.
- AC 6: SCR-RUL-24 pending money.
- AC 7: SCR-RUL-24 offline, SCR-RUL-23 offline.
- AC 8: no UI, system rule (audit `rule.created`, `rule.edited`; each alert a firing record; no ledger entry).
- AC 9: SCR-RUL-25 content.

**Objects and fields:** Wallet rule (level); Ledger entry (read); Rule firing (balance and level); Notification; Audit entry.

**Open points:**
- Is the chip "Low balance" visible to group members without `Wallet: view balance`? Not specified in the story (WAL-19 owns the chip).
- Where is "Add money" shown for a group wallet when the recipient of the alert lacks `Wallet: deposit`? Not specified in the story.
- If the wallet becomes Stopped (closed), is an already-low chip cleared? Not specified in the story.

---

### RUL-12 See every time a rule ran, and every time it did not

**Story:** RUL-12 See every time a rule ran, and every time it did not

**Surfaces:**
- SCR-RUL-26 | Rule history (firings newest first, `RULE_HISTORY_PAGE_SIZE` per page; each row time, rule name, trigger, outcome chip Moved, Alert sent or Skipped, amount and destination) | page | Owner of a personal wallet; group member with `Wallet: view history` | Entry: "Rule history" on SCR-RUL-01, rule line on a transaction (WAL-14), SCR-RUL-13, "See in history" | Exit: transaction, SCR-RUL-13
- SCR-RUL-27 | History filter (by rule, by outcome Moved, Alert sent, Skipped, by date) | sheet | Same as SCR-RUL-26 | Entry: filter button | Exit: SCR-RUL-26
- SCR-RUL-28 | Skipped run row (plain-words reason, "Not moved. [Destination] is closed. Your 100 000 Ar stayed in Main.", keys `rul.history.skipped.*`, number of attempts in its detail) | inline (on SCR-RUL-26) | Same as SCR-RUL-26 | Entry: SCR-RUL-26 | Exit: SCR-RUL-31
- SCR-RUL-29 | "Rules on this income" (each outcome in order and hop by hop, Rounding line "1 Ar rounding to Gereo", "70 percent stayed in Main") | inline (on transaction detail, WAL-14) | Viewer of the transaction | Entry: transaction detail | Exit: SCR-RUL-26
- SCR-RUL-30 | "Why" line on a ledger entry ("Why: 20% to Savings by rule Share income", links to the firing and the rule; "(deleted)" after a deleted rule's name) | inline (on ledger rows and entries, WAL-14) | Viewer of the entry | Entry: ledger | Exit: SCR-RUL-26, SCR-RUL-13
- SCR-RUL-31 | "Run again" action (once the cause is fixed) | inline (on SCR-RUL-28) | Owner of a personal wallet | Entry: Skipped row for `destination_closed`, `destination_held` or transient `ledger_error` | Exit: row becomes "Moved after re-run"
- SCR-RUL-32 | Notification: rule skipped (`msg.rul.skipped`, EV-RUL-06, in-app and push, no SMS) | notification | Owner of a personal wallet | Entry: system on a skipped run, batched under NTF-08 | Exit: SCR-RUL-26

For a skipped share on a group wallet only `msg.con.split_failed` is sent (CON-15, SMS fallback under NTF-05); nobody gets two messages for one skip.

**States per surface:**
- SCR-RUL-26 default: list of firings with outcome chips with icon and word; a Moved row reads "20 000 Ar to Savings by rule Share income".
- SCR-RUL-26 empty: "No rule has run yet. When income arrives, you will see it here."
- SCR-RUL-26 loading: skeleton.
- SCR-RUL-26 offline: rows from the XCT-04 history cache with "Updated hh:mm".
- SCR-RUL-26 forbidden: group member without `Wallet: view history`; `rul.history.not_permitted` naming the permission.
- SCR-RUL-26 own rule: each rule's own page shows its history only; "See in history" applies the "Made by a rule" filter of WAL-15.
- SCR-RUL-26 alert rows: "Alert sent" for cap reached, goal reached, goal behind and low-balance, with the figures; no ledger entry.
- SCR-RUL-26 not due: paused rule, income before the rule existed, income not counted as income: not a row (explained in the rule detail).
- SCR-RUL-26 privacy: phone numbers masked as in the ledger.
- SCR-RUL-27 default: filters by rule, outcome, date.
- SCR-RUL-28 reasons: `destination_closed`, `destination_held` ("Held by Gereo"), `destination_deleted`, `wallet_held`, `wallet_frozen` (destination outside the group), `recipient_limit`, `cycle_prevented`, `chain_too_long`, `percent_over_100`, `rule_stopped`, `amount_zero`, `ledger_error`; every row says no money moved and where the income is.
- SCR-RUL-28 retried: a retry ending in a skip is one row with the attempts in its detail.
- SCR-RUL-28 freeze inside the group: not a skip; internal shares still run.
- SCR-RUL-29 default: lists each outcome in order and hop by hop, Rounding line when present, shares that stayed.
- SCR-RUL-30 default: "Why" line with links; deleted rule shows its name followed by "(deleted)".
- SCR-RUL-31 available: personal-wallet owner; online only (`xct.offline.needs_connection`).
- SCR-RUL-31 result: re-run covers only unfinished shares, uses the rule version in force when the income arrived and the percent of the original credit; idempotent, a share already written refused with "Already shared"; row reads "Moved after re-run"; audit `rule.rerun`.
- SCR-RUL-31 hidden: not offered on group wallets (CON-15 owns the group version) or for other reasons.
- SCR-RUL-32 default: one per skipped run, batched under NTF-08 when many.

**Criteria map:**
- AC 1: SCR-RUL-26 default (list, page size, row content).
- AC 2: SCR-RUL-26 default and SCR-RUL-30 default (Moved links to entries; "Why" line; "(deleted)").
- AC 3: SCR-RUL-28 reasons (plain words, `rul.history.skipped.*`, reason codes).
- AC 4: SCR-RUL-26 not due and SCR-RUL-28 reasons (every skip recorded, no hidden skip).
- AC 5: SCR-RUL-26 alert rows.
- AC 6: SCR-RUL-29 default.
- AC 7: SCR-RUL-27 default and SCR-RUL-26 own rule.
- AC 8: SCR-RUL-26 forbidden and privacy (`rul.history.not_permitted`).
- AC 9: SCR-RUL-26 empty, loading, offline; SCR-RUL-32 default (`msg.rul.skipped`, EV-RUL-06, one per skip, no SMS; group skip only `msg.con.split_failed`).
- AC 10: SCR-RUL-31 available and result ("Run again", "Already shared", "Moved after re-run", `rule.rerun`).

**Objects and fields:** Rule firing (time, rule name, version, trigger, outcome, reason code, amount, destination, attempts, reference ID); Ledger entry; Wallet rule; Transaction; Audit entry.

**Open points:**
- Skip reason list ownership conflicts: this story owns it, conventions 11.5 says the list is in RUL-07. Which source file is final?
- `recipient_limit` held and retried (RUL-07 AC 4) versus listed as a reason for a Skipped row here; is "Run again" offered for it? The story lists `destination_closed`, `destination_held` and transient `ledger_error` only.
- Group wallet skipped-share visibility: RUL-12 lists group history for members with `Wallet: view history`, but `Run again` and the notice for groups are CON-15; which surface shows the group re-run and does it reuse SCR-RUL-31? Not specified in the story.
- What is shown for `msg.rul.skipped` when the owner is not the one who triggered the run (a foreign rule owner paused by `destination_deleted`)? Not specified in the story.
- Keys `rul.history.skipped.*` are named as a family only; the list of final keys per reason code is not specified in the story.
- Text for "No rule has run yet..." and "Already shared" is quoted intent; keys not specified.

---

### RUL-13 Who may change rules on a group wallet, and how it ties to group split rules

**Story:** RUL-13 Who may change rules on a group wallet, and how it ties to group split rules

**Surfaces:**
- SCR-RUL-33 | Decision gate step (which of three gate paths applies: (1) authority vote when at least three holders of `Vote: vote` exist, (2) PIN approval from one other holder of `Wallet: edit rules`, (3) single Active member saves alone, audit "Single member, no gate") | page (flow step) | Holder of `Wallet: edit rules` saving a gated change | Entry: Save in SCR-RUL-05 (group version CON-11), edits in SCR-RUL-13 | Exit: SCR-VOT-01 with proposal reference (path 1), approval request (path 2), saved (path 3)
- SCR-RUL-34 | "Waiting for vote" chip and snapshot (stored change not applied; old version in force; link to the vote and decision) | inline (on SCR-RUL-02, SCR-RUL-13, SCR-RUL-08) | Group member with `Wallet: view balance` | Entry: rule card | Exit: SCR-VOT-07
- SCR-RUL-35 | Apply approved change (applies exactly the stored snapshot within `change_apply_window_days`, citing the decision ID) | sheet | Holder of `Wallet: edit rules` | Entry: link on SCR-RUL-34 after the vote closes Passed | Exit: SCR-RUL-13
- SCR-RUL-36 | Notification: group rule changed (`msg.rul.group_changed`, EV-RUL-07, in-app and push; cap, goal and low-balance changes only; share rules use `msg.con.split_changed`, EV-CON-13) | notification | Group members with `Wallet: view balance` | Entry: system on a saved change | Exit: SCR-RUL-13
- SCR-RUL-37 | Permission revoked state (buttons removed at next load; in-progress action rejected) | inline (on every rule screen of a group wallet) | Person who lost `Wallet: edit rules` | Entry: next load or in-progress save | Exit: SCR-RUL-01 read-only

The PIN approval by a second holder (path 2) is owned by CON-13 and the approval surface is not defined in this story.

**States per surface:**
- SCR-RUL-33 path vote: three or more holders of `Vote: vote`; change stored as a snapshot; vote created through VOT-01 criterion 10; counts only with at least two distinct voters other than the proposer (D4 floor, VOT-03); old version stays active.
- SCR-RUL-33 path PIN: fewer than three voters; PIN approval from one other holder of `Wallet: edit rules`.
- SCR-RUL-33 path single member: exactly one Active member; holder saves alone; audit entry records "Single member, no gate".
- SCR-RUL-33 gated changes: first Active rule that moves money to another wallet, change of percent or destination, adding a rule to a wallet with Active rules; each line of a D3 chain goes through the gate.
- SCR-RUL-33 not gated: pause, resume, end; cap, goal, low-balance rules; personal wallets.
- SCR-RUL-33 no value "Never": `split_change_requires_vote` keeps only values that gate.
- SCR-RUL-33 chain recompute: every save recomputes the full reachable chain, including downstream rules; the rounding line to Gereo needs no approval.
- SCR-RUL-33 campaign destination: activation refused while the campaign is Open or Refunding (ANN-04), at rule save and when a wallet becomes a campaign wallet (RUL-07 AC 11).
- SCR-RUL-33 offline: read-only from cache with "Updated hh:mm"; every change action disabled.
- SCR-RUL-33 concurrent save: follows RUL-08 AC 8 (SCR-RUL-15).
- SCR-RUL-34 waiting: stored change not applied; old version active; sees the vote status.
- SCR-RUL-34 vote failed or snapshot expired: not applied; "no vote possible" outcomes follow VOT; not specified for display here.
- SCR-RUL-35 default: applies exactly the stored snapshot; cites the decision ID; decision logged (VOT-13).
- SCR-RUL-35 expired: window `change_apply_window_days` ended; behaviour not specified in this story.
- SCR-RUL-36 default: states the rule, what changed and the effective time.
- SCR-RUL-37 default: `err.wal.permission_missing`; buttons gone at next load.
- SCR-RUL-37 read-only view: member with `Wallet: view balance` but not `Wallet: edit rules` sees every rule and state in words and the name of a holder (RUL-01 AC 5); member without `Wallet: view balance` sees only that the wallet has rules and the missing permission.

**Criteria map:**
- AC 1: SCR-RUL-13 and builder screens (holder can create, change, pause, resume, delete via RUL-02, RUL-03, RUL-08, RUL-09, RUL-10, RUL-11); no new surface.
- AC 2: SCR-RUL-37 default (server check, buttons removed, in-progress action rejected).
- AC 3: SCR-RUL-37 read-only view (read-only list, named holder).
- AC 4: SCR-RUL-33 (three gate paths, gated and not gated changes, no "Never"), SCR-RUL-34 and SCR-RUL-35 (snapshot, apply within window, cite decision ID).
- AC 5: SCR-RUL-33 chain recompute (destinations in the same group, chain covered, rounding needs no approval).
- AC 6: SCR-RUL-36 default (`msg.rul.group_changed`, EV-RUL-07, share rules use `msg.con.split_changed`).
- AC 7: SCR-RUL-26 (history for `Wallet: view history`); audit trail in GRP-11 for `Group: view audit log` (no UI here).
- AC 8: SCR-RUL-33 offline and concurrent save.
- AC 9: no UI, system rule (audit entries with actor, permission used, version, linked vote, time; group audit log GRP-11).
- AC 10: SCR-RUL-33 campaign destination.

**Objects and fields:** Wallet rule (version, snapshot, gate status); Permission; Vote and Decision (link, `snapshot_ref`); Audit entry; Notification.

**Open points:**
- Contradiction on destinations: RUL-13 AC 5 and RUL-03 AC 4 say every destination is another wallet of the same group, while the Shared definitions and conventions 10.3 say a leaf outside the group requires a RUL-13 vote. Can the group builder offer an outside-the-group leaf, and through which surface?
- Is the gate path chosen automatically from the counts, and does the person see which path was applied before saving? Not specified in the story.
- Surface and message keys for the PIN approval by a second holder (path 2): owned by CON-13; not specified in this story.
- Apply step: who may apply when the proposer lacks `Wallet: edit rules`, and what is shown if nobody holds it (R191: the snapshot expires)? Not specified in the story.
- RUL-13 sets "PIN on grant" for `Wallet: edit rules`; the grant screen is GRP-08. Is a PIN requested at each rule save by a holder? Not specified in the story.
- EV-RUL-07 audience "members with `Wallet: view balance`" versus the group audit trail for `Group: view audit log`: both defined; no conflict, but SMS is none. Confirm no SMS path for a group rule change. Not specified in the story.

## Epic summary

Stories: 13.
Distinct surfaces: 37 (inline 13, modal 1, notification 7, page 10, sheet 4, system 2).
State lines: 182.
Open points: 53.

All open points:

1. RUL-01: RUL-01 AC 5 shows read-only cards to a group member, while conventions 09 section 6.3 rule 3 or 4 asks whether to hide or show with a reason; the story chooses show with a reason. Confirm that a member with neither `Wallet: view balance` nor `Wallet: edit rules` sees the rules entry point at all (the story says the wallet "has rules and the missing permission" only in RUL-13 AC 3).
2. RUL-01: The text of "Could not update. Retry", "Add a rule" and the empty sentence is quoted intent, no keys given. Keys not specified in the story.
3. RUL-01: Who is "a person who holds the permission" named in SCR-RUL-03? GRP "unavailable" markers (conventions section 7) may apply to holders who are Locked or Inactive. Not specified in the story.
4. RUL-02: RUL-02 AC 6 says the screen is "not reachable" without `Wallet: edit rules`, while RUL-01 AC 5 hides Add and conventions 09 section 6.3 prefers a visible reason. What does a member who arrives by deep link see: forbidden with `err.wal.permission_missing` and a way to request access? Not specified in the story.
5. RUL-02: RUL-02 AC 7 lets a rule leave the group's wallets or reach another owner, while RUL-03 AC 4 and RUL-13 AC 5 say a rule can never target a personal wallet or an outside party. Which is current for the tier line, and does any UI path let a rule reach a leaf outside the group (conventions 10.3 chain-leaf rule)? Not specified in the story.
6. RUL-02: Tier message and its upgrade path (ACC-07) for a share rule above the person's limit: key not specified in the story.
7. RUL-03: Key for the percent-invalid message (non-numeric, 0, above 100): not specified in the story.
8. RUL-03: What does the person see when no other open wallet exists (precondition says at least one)? Not specified in the story.
9. RUL-03: The group builder is CON-11; which surface IDs does the group version use, and does it reuse SCR-RUL-05 states? Not specified in the story.
10. RUL-03: The sentence "The first time a person saves a share rule, the rounding line links to the terms": is it a link only, or a consent step if ACC-13 re-consent is needed (conventions 10.6 says re-consent only when a line type or formula changes)? Not specified in the story.
11. RUL-04: The preview example "Salary 400 000 Ar on 5 Oct" shows a counterparty or description label; which ledger field supplies it for a deposit from mobile money (masked number)? Not specified in the story.
12. RUL-04: Does the preview of the Rounding line name Gereo only in words ("1 Ar rounding goes to Gereo") or with a key? Not specified in the story.
13. RUL-04: How is the preview shown when the chain preview would exceed the screen at 320 px and 200% text? Not specified in the story.
14. RUL-05: The summary is "the screen shared with CON-11" yet group chains are limited to the same group (RUL-03 AC 4) while conventions 10.3 allows a leaf outside the group through a vote; does the summary show an outside leaf? Not specified in the story.
15. RUL-05: Where is the typed sample amount entered on SCR-RUL-08 and is it kept? Not specified in the story.
16. RUL-05: Key for each summary sentence is not specified (only `rul.summary.not_permitted` is named).
17. RUL-06: Conventions 6 item 5 says "cycle detection and chain depth RUL-07" while 10.2 and 10.9 say RUL-06 owns them, and RUL-07 AC 5 says it is "the sole owner". Which story owns the check surfaces and error keys?
18. RUL-06: Hop counting differs: RUL-06 AC 3 counts Main to Savings as hop 1, RUL-07 AC 5 says hop 0 is the request-made transfer or manual move. Is the move that triggers a chain a hop 0 on the preview and ledger? Not specified in the story.
19. RUL-06: Notification of a foreign rule owner under SCR-RUL-10 uses `msg.rul.skipped`; the story names no catalogue row for the "paused for destination_deleted" notice. Not specified in the story.
20. RUL-06: The error summary at the top: key and layout not specified in the story.
21. RUL-07: Skip reason list ownership: RUL-12 AC 3 says it owns the list, conventions 11.5 says the list is in RUL-07. Which is the source for the reason codes and their `rul.history.skipped.*` keys?
22. RUL-07: `recipient_limit` is described in RUL-07 AC 4 as "held in the source wallet and retried" and in RUL-12 as a Skipped reason; is it Skipped, Needs attention or both while retrying, and what does the person see between attempts? Not specified in the story.
23. RUL-07: RUL-07 AC 5 gives hop 0 as the request-made transfer or manual move; the first rule firing on a deposit is then hop 1. The ledger "hop" shown to people (RUL-12) is not specified.
24. RUL-07: Which surface shows a share rule suspended because its wallet became a campaign wallet, and with what key? Not specified in the story (state Needs attention only).
25. RUL-07: Is `msg.rul.fired` also sent to a person who has `Wallet: view history` but not `Wallet: view balance` on a group wallet? Story says members with `Wallet: view history`; consistency with RUL-01 closed question not stated.
26. RUL-08: "Rule detail" is nowhere defined as a screen in the stories (RUL-12 says "each rule's own page", RUL-07 and RUL-12 say "the rule detail explains"). Confirm SCR-RUL-13 as one page and its URL and layout. Not specified in the story.
27. RUL-08: RUL-08 AC 5 says Delete "ends" a line; conventions 11.5 says CON "Ended" is a soft state different from RUL deleted. Which label does the group rule delete show: Delete or End? Not specified in the story.
28. RUL-08: The "Review" sheet of AC 8 compares two versions: is the person asked to re-run their edit on the latest version? Not specified in the story.
29. RUL-08: No key given for "Delete" confirmation, "Changed by [name] at hh:mm. Review" or the preview comparison. Not specified in the story.
30. RUL-08: Pause or Resume on a share rule in Waiting for vote: allowed? Not specified in the story.
31. RUL-09: `CAP_PERIOD_OPTIONS` period start for week is not stated (month from the 1st). Which weekday starts the week? Not specified in the story.
32. RUL-09: Which key carries the text "Not updated since [time]" and the 80 percent warning text variant? Not specified in the story.
33. RUL-09: Does a group-wallet cap editor show the `spend_cap_mode` value as read-only text? Not specified in the story.
34. RUL-09: EV-RUL-02 is named for `msg.rul.cap_reached`; the warning at 80 percent uses "the same message family": same key or a variant? Not specified in the story.
35. RUL-10: The story says the NTF row EV-RUL-05 "must add" the group audience (holders of `Wallet: edit rules`); is the catalogue row already updated? Not specified in the story.
36. RUL-10: Who sees "Goal reached" chip and "Target date passed" in the group when the viewer lacks `Wallet: view balance`? Not specified in the story.
37. RUL-10: Validation keys for the goal form: not specified in the story.
38. RUL-10: Does the goal editor for a group wallet go through the decision gate? Story RUL-13 AC 4 says cap, goal and low-balance rules are not gated; but RUL-10 permission needs `Wallet: edit rules` (money-out class, PIN on grant). Confirm that no PIN is asked at save.
39. RUL-11: Is the chip "Low balance" visible to group members without `Wallet: view balance`? Not specified in the story (WAL-19 owns the chip).
40. RUL-11: Where is "Add money" shown for a group wallet when the recipient of the alert lacks `Wallet: deposit`? Not specified in the story.
41. RUL-11: If the wallet becomes Stopped (closed), is an already-low chip cleared? Not specified in the story.
42. RUL-12: Skip reason list ownership conflicts: this story owns it, conventions 11.5 says the list is in RUL-07. Which source file is final?
43. RUL-12: `recipient_limit` held and retried (RUL-07 AC 4) versus listed as a reason for a Skipped row here; is "Run again" offered for it? The story lists `destination_closed`, `destination_held` and transient `ledger_error` only.
44. RUL-12: Group wallet skipped-share visibility: RUL-12 lists group history for members with `Wallet: view history`, but `Run again` and the notice for groups are CON-15; which surface shows the group re-run and does it reuse SCR-RUL-31? Not specified in the story.
45. RUL-12: What is shown for `msg.rul.skipped` when the owner is not the one who triggered the run (a foreign rule owner paused by `destination_deleted`)? Not specified in the story.
46. RUL-12: Keys `rul.history.skipped.*` are named as a family only; the list of final keys per reason code is not specified in the story.
47. RUL-12: Text for "No rule has run yet..." and "Already shared" is quoted intent; keys not specified.
48. RUL-13: Contradiction on destinations: RUL-13 AC 5 and RUL-03 AC 4 say every destination is another wallet of the same group, while the Shared definitions and conventions 10.3 say a leaf outside the group requires a RUL-13 vote. Can the group builder offer an outside-the-group leaf, and through which surface?
49. RUL-13: Is the gate path chosen automatically from the counts, and does the person see which path was applied before saving? Not specified in the story.
50. RUL-13: Surface and message keys for the PIN approval by a second holder (path 2): owned by CON-13; not specified in this story.
51. RUL-13: Apply step: who may apply when the proposer lacks `Wallet: edit rules`, and what is shown if nobody holds it (R191: the snapshot expires)? Not specified in the story.
52. RUL-13: RUL-13 sets "PIN on grant" for `Wallet: edit rules`; the grant screen is GRP-08. Is a PIN requested at each rule save by a holder? Not specified in the story.
53. RUL-13: EV-RUL-07 audience "members with `Wallet: view balance`" versus the group audit trail for `Group: view audit log`: both defined; no conflict, but SMS is none. Confirm no SMS path for a group rule change. Not specified in the story.
