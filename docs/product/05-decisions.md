# Founder decisions

Decisions taken by the founder, in the order they were taken. Story files must follow them. When a story contradicts a decision, the story is wrong.

| # | Date | Question | Decision | Affects |
| --- | --- | --- | --- | --- |
| D1 | 2026-10-26 | Can the requester approve their own expense request? | No, never. `self_approval_allowed` does not exist as a setting. | SPD-02, SPD-05, SPD-08, GRP-13 |
| D2 | 2026-10-26 | Which permission can freeze outgoing money? | Wallet-level permissions in the style of can send and can withdraw. Exact names to settle: see open items. | SPD-15, GRP, WAL-09, WAL-10 |
| D3 | 2026-10-26 | What counts as income for a wallet? | Every deposit into a wallet is income for that wallet, including money that arrives from another wallet or from a rule. | RUL-07, CON-11, CON-14, WAL-12 |
| D4 | 2026-10-27 | Does a passed vote still need approvers? | No. A passed vote is the authorisation: the payment starts without approvers. Approvers apply only to spending that is below the vote threshold and so has no vote. | SPD-02, SPD-05, SPD-09, SPD-10, VOT-03, GRP-13 |
| D5 | 2026-10-27 | Where does the leftover ariary of a split go? | To Gereo (the platform). | RUL-07, CON-12, CON-14, WAL-20 |

## Consequences to apply

- D1: remove the open question and the `self_approval_allowed` parameter from SPD. A group with one person who can approve cannot spend until a second person holds the permission.
- D3: the earlier default (own-wallet moves and rule-made entries are not income) is replaced. Because every arrival is income, rules can chain from wallet to wallet. Cycle detection (RUL-06) and a maximum chain depth become mandatory, and each entry in a chain carries the name of the rule that made it.

- D4: SPD-09 and VOT-03 no longer send the expense to approvers after a vote. The vote result starts the payout, after the SPD-10 safety checks (balance, freeze, cap, quorum met on the final result). The floor "no single person moves the money alone" is met by the vote itself, so quorum and majority settings must never allow a single voter to decide a money vote: a money vote needs at least two distinct voters other than the requester (default to confirm).
- D5: the leftover is a visible ledger entry, labelled as a rounding amount credited to Gereo, always under one ariary per destination, shown on the receipt and written into the terms the person accepts (ACC-13). It must be a documented platform income line.

## Open items

- D2: dedicated names for the wallet permissions that gate money leaving (send inside Gereo, withdraw to mobile money, freeze) against the existing `initiate spend` and `approve spend`.
