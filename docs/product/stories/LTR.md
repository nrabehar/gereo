# LTR: Later modules (epic stubs)

> **NOT MVP. NONE OF THIS IS IN THE MVP.**
> These are stubs, not committed scope. The MVP is groups, wallets, contributions, ledger, votes, projects, events and in-group announcements. Every module below is later because it either (a) depends on a stable wallet, ledger and group base, (b) carries a legal question that is not answered, or (c) adds moderation and scam load that a small team cannot carry yet. Stories here are short on purpose: 3 to 5 job stories per epic, 3 to 4 acceptance criteria each. They must be expanded to the full format in `00-conventions.md` section 6 only after the gate of their epic is cleared. Nothing here is a promise to build.

Sources: [00-conventions.md](../00-conventions.md), [raw/05-marketplace-social-lending-donations.md](../../research/raw/05-marketplace-social-lending-donations.md) (called "raw/05" below), [competitive-analysis.md](../../research/competitive-analysis.md) section 3.5.

Release for every story below: **Later**. Priority is left open until the gate is cleared. Phasing follows raw/05 section 5.2.

## Summary

| Code | Epic | Phase | Gate to clear first |
| --- | --- | --- | --- |
| MKT | In-group marketplace with wallet escrow | 2 | Stable WAL, CON, GRP in production |
| COM | Member-only communities | 2 | Moderation tooling and report-and-hide proven in ANN |
| SOC | Public social network and discoverable campaigns | 3 | Moderation, rate limits, verification badges, anti-solicitation rules; public fundraising legal question |
| DON | Public donations | 3 | Organiser verification, multi-signer withdrawal, public reporting |
| LND | Lending | 4 | Stable CON, VOT, SPD |
| MRK | Marketing | Last, possibly never | Strategic decision to build at all |

Order note: DON is listed before LND because it is phase 3 in raw/05. MRK is last on purpose.

---

## MKT: In-group marketplace with wallet escrow

**Phase:** 2. **Tags:** ledger, audit.

**Gate:** (1) WAL, CON and GRP are stable in production. (2) A rule for holding a buyer's money until delivery is confirmed. Not researched in raw/05 (gap).

**Permissions used:** Marketplace: publish an offer, edit an offer, manage orders, view sales. Wallet: view balance, initiate spend, approve spend. Group: enable module.

**Scope in one line:** members sell to members, or the group sells to members, inside one group. Payment is held in escrow in the wallet and released when the buyer confirms. No logistics, no search at scale, no seller ads, no category tree (raw/05 section 1.9).

**Job stories**

MKT-01 When I have something to sell to people in my group, I want to list it with a title, price and stock, so I can sell without a Facebook post and a mobile money screenshot.
1. The listing is visible only to members of that group.
2. Only a member who holds "publish an offer" can create it; the price is whole ariary.
3. Stock decreases when an order is paid and the offer shows "sold out" at zero.

MKT-02 When I want to buy from a fellow member, I want my payment held safely until I confirm I received the item, so I can avoid the fake "overpayment" and fake credit SMS scams.
1. Paying moves money from my wallet to an escrow hold, written as balanced ledger entries.
2. The order shows the wallet-confirmed state only; a screenshot is never accepted as proof of payment.
3. I can confirm receipt, which releases the money to the seller (minus any fee shown before I pay).
4. If I do nothing, what happens after the confirm window follows a rule shown before I pay.

MKT-03 When an order goes wrong, I want to open a dispute and have someone I know look at it first, so I can get a fair answer without waiting for a faraway support desk.
1. Either party can open a dispute while the order is held.
2. Funds stay held until the dispute is decided.
3. The first arbiter is a member who holds a permission to manage orders, with an operator as the next step.
4. The outcome is a ledger entry (release or refund), never an edit.

MKT-04 When I sell regularly, I want to see my orders and my sales, so I can know what is paid, held and released.
1. The list shows each order with its status (Initiated, Pending, Confirmed, Failed, Cancelled).
2. Only a member with "view sales" sees totals.
3. The list works offline from cache with a "last synced" time.

**Reuses from MVP:** WAL-13 (send money inside Gereo), WAL-14 (transaction and receipt), WAL-18 (reversing entry), WAL-17 (offline read), GRP-08 and GRP-09 (single permissions, what a person can do), GRP-11 (audit log), SPD-08 (separation of duties), CON-16 (ledger transparency view), NTF-05 (push then SMS).

**Evidence:** raw/05 section 1.5 (Madagascar scam pattern, escrow wedge), 1.9 (takeaways), 5.2 (phasing). competitive-analysis 3.5.

**Open questions**
- Order value cap and confirm window length: not decided; no evidence on right values.
- Who is the first arbiter when the seller is the group itself?
- Fee on escrowed payments: A platform commission is a revenue idea, undecided. Avoid paid visibility at first (raw/05 section 1.3, Jiji complaint pattern).

---

## COM: Member-only communities

**Phase:** 2. **Tags:** audit.

**Gate:** report-and-hide and basic moderation exist and have been used in ANN. Communities are closed: no public discovery, no follows from outsiders.

**Permissions used:** Publication: publish, announce to group, moderate. Group: view group, enable module, invite member.

**Scope in one line:** a space with a feed, reactions and comments for members only, on top of existing group membership. Extends ANN (announcements) from admin-to-members to member-to-member.

**Job stories**

COM-01 When my group wants to talk beyond announcements, I want a members-only feed, so I can discuss in one place instead of a Facebook or WhatsApp group.
1. Only members see and post, if they hold "publish".
2. Posts show author and time; text only at first, small payloads.
3. Works offline from cache with a "last synced" time.

COM-02 When someone posts something unwelcome, I want to report it and have it hidden for me at once, so I can keep the space safe without waiting.
1. Report hides the post for the reporter immediately.
2. A member with "moderate" sees a queue of reports.
3. Moderator actions (hide, restore, remove) are written to the audit log.

COM-03 When I only care about some topics, I want to join a smaller community inside my group, so I can see only what concerns me.
1. A community can be open to all members or invite-only inside the group.
2. Joining and leaving never changes my group membership.
3. Group-wide permissions are inherited and can be narrowed.

COM-04 When a post offers a loan, an investment or a way to "double money", I want it blocked by default, so I can avoid scams inside my group.
1. Posts matching the anti-solicitation rules are held for a moderator.
2. The author is told why, in their language.
3. The rule list is visible to members.

**Reuses from MVP:** ANN-01 to ANN-03 (publish, read, pin or withdraw), GRP-03 and GRP-05 (invite, member list), GRP-08, GRP-11 (permissions, audit), NTF-04 and NTF-08 (preferences, one message instead of a flood), XCT-01, XCT-07 (language, data saver).

**Evidence:** raw/05 section 2.3 (group as trust boundary), 2.7 (takeaways), 5.2.

**Open questions**
- Are media (photos) allowed, given data cost? No evidence collected on data prices.
- Who moderates a small group with few permission holders?
- Is "community" a separate object from "group", or a sub-space of it? To be decided in information architecture.

---

## SOC: Public social network and discoverable campaigns

**Phase:** 3. **Tags:** audit.

**Gate:** (1) Moderation tooling, rate limits, verification badges and anti-solicitation rules are in place (raw/05 section 2.7). (2) For discoverable campaigns: the DON gate is cleared. Raw/05 shows open feeds attract scams and that even a large platform with hundreds of contractors fails at reactive-only moderation (section 2.5, 2.7).

**Permissions used:** Publication: publish, moderate. Group: view group. Marketplace and Prêt permissions are not used here.

**Scope in one line:** public profiles and communities with follows, reactions and moderation; a public page where verified campaigns can be found. No creator payouts.

**Job stories**

SOC-01 When I want to follow people or groups I trust outside my own groups, I want to follow them, so I can see their public posts.
1. Following is separate from group membership.
2. Public posts show a verification badge state (verified or unverified).
3. I can unfollow and block at any time.

SOC-02 When I post publicly, I want clear rules and limits, so I can know what is allowed before I am blocked.
1. Rate limits apply per account.
2. Posts about loans, investments or "double your money" are banned by default.
3. A removed post shows the reason.

SOC-03 When I see a scam or abuse, I want to report it and see what was done, so I can trust the network is not a free-for-all.
1. Report hides the item for me at once.
2. A moderator decision is recorded and sent to the reporter.
3. Repeated offenders lose posting rights, audited.

SOC-04 When I come across a public campaign, I want to see whether it is verified and where the money goes, so I can decide whether to give.
1. Each public campaign shows a status badge (verified or unverified) and the final use-of-funds report when it exists.
2. An unverified campaign cannot be shared with a "give" button.
3. Fees and the goal-not-reached rule are shown before payment.

**Reuses from MVP:** ANN-04 to ANN-08 (campaign, give, receipt, progress, use-of-funds report), COM-01 to COM-04 (this file, once built), ACC-07, ACC-08 and ACC-09 (tier ladder, identity, verification state), OPS-10 (fraud and anomaly flags), GRP-11.

**Evidence:** raw/05 sections 2.2 (Binance Square lesson: do not pay per conversion), 2.3, 2.7, 4.6.

**Open questions**
- What is the minimum moderation staffing before launch? No evidence on moderator burnout or workload (raw/05 gap).
- Public campaign discovery depends on DON legal findings: no Malagasy text on public fundraising was found (raw/05 section 4.5).
- Does the verification badge reuse identity tiers or need an organiser check of its own?

---

## DON: Public donations

**Phase:** 3. **Tags:** ledger, audit.

**Gate:** (1) Organiser identity verification, multi-signer withdrawal and a mandatory use-of-funds report exist (raw/05 section 4.6). (2) raw/05 found no Malagasy text on public appeals or crowdfunding, and rules on holding funds for third parties were not researched.

**Permissions used:** Wallet: view balance, view history, deposit, initiate spend, approve spend. Group: view group. Publication: publish. A dedicated donation permission set does not exist and would have to be added.

**Scope in one line:** the in-group "special contribution campaign" (ANN-04 to ANN-08, MVP) opened to people outside the group. Donations are not loans and have no interest.

**Job stories**

DON-01 When I want to raise money for a cause beyond my group, I want to open a public campaign with a goal, deadline and description, so I can reach people who do not know me.
1. The organiser must meet the tier requirement for this action, as defined in ACC-07 ("Tier requirements by action") with limits from OPS-11, before the campaign goes public.
2. The campaign has a wallet pot; money is not mixed with the organiser's own wallet.
3. The goal-not-reached rule (refund or keep) is set at creation and shown before every gift.

DON-02 When I want to give, I want to see fees and what happens to my money before I pay, so I can avoid surprises.
1. Fees appear as a line item; no tip is selected by default.
2. I receive a receipt for every gift.
3. The gift is a balanced ledger entry from my wallet to the campaign wallet.

DON-03 When the organiser wants to take money out, I want more than one person to agree, so I can be sure funds are not taken by one person alone.
1. Withdrawal needs several named signers, with partial withdrawals allowed.
2. A withdrawal is blocked until the previous use-of-funds report is published.
3. Every withdrawal and approval is audited.

DON-04 When a campaign looks fake, I want to flag it, so I can help stop abuse.
1. A flagged campaign can be paused by an operator, with the reason recorded.
2. Donors are refunded when the operator rules the campaign false, by reversing entries.
3. The organiser sees the decision and can appeal.

**Reuses from MVP:** ANN-04 to ANN-08 (all campaign stories), WAL-13, WAL-14, WAL-18, SPD-08 and SPD-14 (separation of duties, spending cap), GRP-13 (no single person moves money), OPS-06, OPS-10, OPS-13 (support, flags, payout queue), CON-16 and CON-18 (transparency, export).

**Evidence:** raw/05 section 4.3 (M-Changa multi-treasurer and refunds, the benchmark), 4.2 (GoFundMe default tip and unauthorised pages), 4.5 (Que Choisir advice), 4.6.

**Open questions**
- Does an organiser need an incorporated body or an authorisation? Not found in raw/05.
- Who decides refund versus keep when a goal is not reached, and in what time frame?
- Fee level: undecided, no evidence collected for Madagascar.

---

## LND: Lending

**Phase:** 4. **Tags:** ledger, audit.

**Gate: hard.** Lending is the riskiest module and is built last (raw/05 section 3.9).

What raw/05 reports, with the caveat that **the legal texts themselves were not read**; it relies on a fact-check article (Studio Sifaka) and links to Law 2017-026:
- Unlicensed habitual lending may be an offence under Law 2020-011 arts. 228-229.
- Law 2017-026 art. 9 reportedly forbids anyone other than a microfinance institution to offer microfinance services.
- "Habitual" is not defined in the source. Occasional loans between individuals are treated differently. Tontines and family loans are not addressed.
- A platform that systematises lending (schedules, automated reminders, interest) risks being characterised as habitual credit activity or as offering microfinance services.

No penalty figure or legal conclusion is restated here as established fact.

**Permissions used:** Prêt: request, approve, repay, view. Vote: view, vote, create, close. Wallet: initiate spend, approve spend. Group: view group.

**Safeguards (from raw/05 section 3.10), non-negotiable for any version:**
- Group funds only. Never lend platform funds.
- No interest income to Gereo. Zero fee or a group-set fixed fee; total cost shown before acceptance.
- No access to contacts or SMS; no alternative-data scoring; no credit bureau pulls.
- No shaming, no external collection agents, no messaging a borrower's contacts.
- Due dates set by the borrower (Tala result, raw/05 section 3.2).
- Exposure caps: per-member limit tied to their own contributions and a cap on simultaneous loans (raw/05 gives a share of own contributions as an example only; value undecided).
- Multi-approver disbursement; ledger visible to all members.

**Job stories**

LND-01 When I need money between contributions, I want to ask my group for a loan with an amount and my own repayment dates, so I can borrow from people I know under rules everyone can read.
1. The request shows the total I will repay before I send it.
2. The due dates are chosen by me, within group limits.
3. A request over my exposure cap cannot be sent and I see why.

LND-02 When a member asks for a loan, I want the group to vote on it, so I can make sure the decision is shared and recorded.
1. The request opens a vote using the group's quorum and majority.
2. The result goes to the decision log.
3. No single person can approve and disburse alone.

LND-03 When a loan is approved, I want the money to leave the group wallet through the normal approval path, so I can trust that every ariary is traceable.
1. Disbursement is a balanced ledger entry from the group wallet to the borrower.
2. It needs the same approvals as other spending above the threshold.
3. If the payout fails, no loan is created and the borrower is told.

LND-04 When I owe money, I want reminders that are polite and on my terms, so I can repay on time without pressure.
1. Reminders go by push then SMS to me only, never to my contacts.
2. I can move a due date once, within limits, before it passes.
3. There is no public list of who is late; only permission holders see status.

LND-05 When someone repays, I want it to show on the group ledger at once, so I can see how much is still out.
1. A repayment is a ledger entry from the borrower to the group wallet.
2. The outstanding balance is visible to all members.
3. A mistake is corrected by a reversing entry.

**Reuses from MVP:** VOT-01 to VOT-05, VOT-13 (votes and decision log), VOT-03 (vote leads to payment), SPD-01, SPD-04, SPD-05, SPD-08, SPD-10 (request, approve, separation, payout), SPD-14 (spending cap), GRP-12 and GRP-13 (threshold, no single person), CON-03 to CON-05 (member due items, invoice-first payment, pending and failed), CON-08 (push then SMS), CON-16 (transparency), WAL-18, NTF-09 (do not wake people at night).

**Evidence:** raw/05 sections 3.2 (Tala due-date result), 3.6 (Kiva auto-lend complaints), 3.8 (Andhra Pradesh, chama embezzlement), 3.9 (Kenya debt-shaming, Nigeria court freeze, Madagascar law), 3.10. competitive-analysis 3.5.

**Open questions**
- Are late fees allowed at all? If any fee counts as interest in law, the no-interest safeguard needs a precise wording.
- Value of the exposure cap and the concurrent loans cap.
- Is an "interest on loans" revenue line compatible with the safeguards? As written it is not; it must be dropped.
- The brief also says a user or group can request a loan from the platform. That conflicts with "group funds only" and is out of scope here.

---

## MRK: Marketing (last, possibly never)

**Phase:** Last, only after everything above, and possibly never. **Tags:** audit.

> **Warning: pr.social is NOT a model for this module.** The brief cited pr.social as inspiration for "small add-on features that can also earn money for others". Raw/05 section 2.4 verified that pr.social is a paid micro-task platform: advertisers pay for follows, likes and comments, and performers do them from their own accounts and are paid in crypto (USDT or TRX). It sells inauthentic engagement, names no company, and has 2.3 out of 5 on Trustpilot from 27 reviews, with 67 percent 1-star, mostly about withdrawals pending or rejected and tickets unanswered. It is not a marketing toolkit. Do not copy its model. Trustpilot is not representative, but nothing found supports reuse.

**Gate:** (1) COM and SOC exist with working moderation. (2) A product decision that marketing is worth its scam adjacency (raw/05 section 2.7: highest risk, lowest relevance to the core wallet). (3) A real Madagascar quote for any SMS-based promotion (raw/05 section 2.6: SMS pricing sources conflict).

**Permissions used:** Marketing: create a campaign, spend a marketing budget, view results. Publication: publish. Wallet: initiate spend.

**Scope in one line:** at most, a paid highlight or pin inside a Gereo community with a ledger receipt, and audience numbers about real members reached. No external ad networks, no task-for-reward, no creator payouts.

**Job stories**

MRK-01 When I sell something or run a project, I want to pin a post in my community for a fixed price, so I can be seen without leaving Gereo.
1. The price and duration are shown before I pay.
2. Payment is a ledger entry from my wallet, with a receipt.
3. A pin is clearly labelled as promoted.

MRK-02 When I promote something, I want to see how many different members saw it and how many then acted, so I can judge if it worked.
1. Reach counts unique members, not impressions.
2. Results show contributions or purchases that followed, not only likes.
3. Only a member with "view results" sees them.

MRK-03 When I give a group member a spending limit for promotion, I want it enforced, so I can avoid overspending.
1. Marketing budget needs the "spend a marketing budget" permission.
2. Spending beyond the limit is blocked and the person sees why.
3. Every spend is audited.

**Reuses from MVP:** WAL-13, WAL-14, SPD-14 (spending cap), GRP-08, GRP-11, ANN-02 (read and what is new), COM and SOC (this file).

**Evidence:** raw/05 sections 2.4 (pr.social), 2.5 (Meta boosts: vanity engagement), 2.7, 5.2 (last or possibly never). competitive-analysis 3.5.

**Open questions**
- Is there real demand? The only source is the founder's problem statement (marketing "blind"); no field interview evidence yet.
- Which of the three Madagascar mobile money flows can pay for promotions without extra friction? Not researched.
- Should this module exist at all?

---

## Cross-epic open questions

- Malagasy texts on e-money custody, AML for non-bank wallets and public fundraising were not read (raw/05 section 5.4).
- Reach: about four in five Malagasy people were offline in the DataReportal figure cited in raw/05, so every later module needs an SMS path and low-data design (XCT-04, XCT-07).
- Later actors named in conventions section 3 (Seller, Buyer, Borrower, Lender, Donor) need definitions before these stubs are expanded.
