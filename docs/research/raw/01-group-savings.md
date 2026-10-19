# Competitive research 01: Group savings, rotating savings and group-treasury apps

Prepared for: Gereo (Madagascar, MGA, mobile money via Vanilla Pay)
Research date: 2026-10-19
Method: web search plus page fetches. Anything not confirmed from a fetched page or search result is labelled UNVERIFIED. Company-published numbers are labelled COMPANY CLAIM. Direct reddit.com access was blocked in this environment, so no Reddit threads were read; user feedback comes from app-store pages, Trustpilot, aggregators, forums and press.

---

## 0. Summary

- The market splits into four families: (a) chama/stokvel bookkeeping tools (Chamasoft, StokFella, Malipo Circles); (b) bank-backed group accounts (Stanbic Chama, KCB Chama, Zimele ChamaManager, FNB digital stokvel); (c) rotating-savings (ROSCA) apps (Money Fellows in Egypt, Djangui/Yankap in Cameroon, Tonti+ pilot in Benin); (d) shared-expense or pooling tools in rich markets (Splitwise, Tricount, Cash App Pools, PayPal Money Pools, Monzo/Revolut pots, Open Collective).
- No Madagascar-specific group-savings or tontine app was found (searched in English and French). Madagascar has large mobile-money rails (MVola, Orange Money, Airtel Money, interoperable) and NGO-run savings groups (VSLA, AVEC, SILC and others), but digitisation of groups is not documented.
- Most documented user pain is trust and fraud (disappearing administrators or treasurers), not missing features. This is the strongest argument for Gereo's transparent ledger and permission-based custody.
- Nobody found combines async voting with quorum, a decision journal, and automatic revenue-split rules. Closest matches: Malipo Circles (lender approvals of loans), Chamasoft (meeting agenda and attendance since 2021), Stanbic Chama (constitution acceptance, group goals).

---

## 1. Chamasoft (Kenya)

### Profile
- Kenyan chama bookkeeping platform. The idea dates from 2013; Chamasoft Limited was incorporated in 2015 (MIT Solve profile, last updated April 2024). Android listing shows publisher Chamasoft Limited, released Nov 2017.
- Markets: Kenya today; the MIT Solve profile lists planned DRC, Ethiopia, Tanzania and Uganda, and names Equity bank partnerships in Kenya, Uganda and Tanzania (the profile is internally inconsistent on current footprint).
- User base: COMPANY CLAIM "over 1,000,000 users" (MIT Solve). This conflicts with the Sensor Tower estimate of Android installs at 10K-50K and under 5K downloads in the last month, plus 129 Android reviews at 3.99 stars. iOS shows 1 rating (1.0). Treat the 1M figure as unverified; it may count members rather than installs, or web use.
- Funding: no external investment named; grants and awards unspecified; NGO partners named include Danish Refugee Council, RTI, USAID, Swisscontact, Akiba Mashinani Trust, Agriexperience.
- Origin of the wider Kenyan software idea: a 2013 Capital FM piece covers a different, earlier product (Aynek Chama Software, built by University of Nairobi student Barry Songa after a relative's chama collapsed from mismanaged funds). It confirms the origin story is the same trust problem as Gereo's.

### Features (from App Store and Play descriptions and version notes)
- Member invoicing, per-member statements, payment reminders, treasurer cash book, cloud storage.
- E-wallet: contributions by M-Pesa; withdrawals to M-Pesa or bank.
- Loans module (internal group loans since v2.0.2, advanced loans module Nov 2025), expense tracking, project management, automated fines/penalties.
- Meeting management with attendance and agenda recording and "partial offline support" (since v2.1.1, June 2021).
- AES-256 in transit and two-factor authentication (v2.3.3, 2023). Free SMS bundles in paid plans.

### Strengths
- Longest-running dedicated chama tool found; deep fits to chama operations (fines, internal loans, meeting records).
- Bank and NGO distribution (software offered free to groups banking with a partner).

### Weaknesses / user complaints
- I found NO verifiable text reviews of Chamasoft (Play Store content would not load; iOS has no review text). No complaint or praise quotes can be reported. Do not infer satisfaction from the 3.99 Android rating (129 reviews, via Sensor Tower: https://app.sensortower.com/api/android/apps/chamasoft.app?country=KE).
- Version notes imply past problems: "fix for M-Pesa payment prompt problems", "stability fixes" (v2.3.5), and an earlier need for "automatic SMS verification code reading" (https://apps.apple.com/us/app/chamasoft/id1489712788).
- Business model tension: MIT Solve profile says subscriptions are primary revenue but also that fees may be scrapped for lower-income groups.

### Pricing
- A mirror of chamasoft.com (not the live site, which refused connection) listed a free tier, Ksh 1,000 per month with 30-day trial, quarterly and yearly tiers (yearly Ksh 10,000), 600 free SMS in paid tiers. UNVERIFIED against the live site.

---

## 2. Bank-backed Kenyan group apps: Stanbic Chama, KCB Chama, Zimele ChamaManager, Postbank M-Chama

### Profile and features
- Stanbic Chama app: free; personal wallet after KYC; deposit from M-Pesa; withdraw to M-Pesa or Stanbic; multiple groups; invite contacts by SMS; invitees review the group constitution before accepting; every member can see group activity searchable in real time; roles (chairperson, treasurer, mentor with view-only plus chat); member statuses (active, on-hold, terminated); group goals; group-funded member loans (https://apps.apple.com/app/id1564047823). App Store shows rating "recently reset", no reviews visible.
- KCB Chama: USSD (*225#) contribution via M-Pesa, requires a KCB account (https://ke.kcbgroup.com/products/kcb-chama; via search summary).
- Zimele ChamaManager: feature of Zimele Unit Trust savings plan, regulated by the Capital Markets Authority; multi-signatory security, automated M-Pesa reconciliation, real-time group statements; COMPANY CLAIM 5,000+ groups and 30,000+ members; "free forever" group management, with unit trust charges, and third-party mobile money, bank and SMS fees; access limited to Zimele members (https://www.zimele.co.ke/chama/).
- Postbank M-Chama and Bank of Africa E-Chama: bank group accounts with M-Pesa deposit and signatory approval of withdrawals (via search summary; UNVERIFIED in detail).

### Strengths
- Regulated custody: funds in a bank or unit trust account reduce disappearance risk compared with a treasurer's personal wallet.
- USSD access (KCB) covers non-smartphone members.

### Weaknesses
- Bound to the bank (account or membership required), so not neutral tools. No independent user reviews found.

### Pricing
- Free or low-fee, monetised via deposits and bank relationship.

---

## 3. StokFella (South Africa) and FNB digital stokvel

### Profile
- StokFella: founded by Tshepo Moloi (idea in 2016; Fin24 2016 article describes it as newly launched). COMPANY CLAIM Dec 2022: about 3,000 active groups, more than R200m invested through it (https://www.sowetan.co.za/business/2022-12-14-keep-your-hard-earned-cash-safe-with-the-stokfella-app/). A 2020 piece reported just over 800 groups. Won Best Financial Solution at 2020 MTN Business App of the Year Awards (ITWeb via search summary).
- FNB digital stokvel account (bank product, launched 2020): COMPANY CLAIM Nov 2022: 102,293 members, 46% opened a transactional account, over R1.8bn contributed, no monthly fee, interest on group savings (https://www.itweb.co.za/article/fnb-stokvel-contributions-balloon-as-members-go-digital/VgZeyvJlmQaMdjX9). A 2024 follow-up reported net deposits above R9.6bn (via Business Report search result; UNVERIFIED in detail).

### Features (StokFella)
- Payments, claims and meetings management; outstanding payments with reminders; group financials, goals and membership growth; meeting dates and hosts with alerts; savings accounts (Nala savings account and a 32-day notice account); payout by vouchers rather than cash; EFT (free, 1 to 3 days), retail store and card payments (instant, extra charge).

### Strengths
- Strong fit to a local ritual (December payouts, meeting hosts). Voucher payout design addresses cash-theft risk.

### Weaknesses
- No independent reviews found. iOS listing shows 3.8 from 4 ratings, with three 2016 reviews, all positive and generic (https://apps.apple.com/app/id1058855642). Weak evidence.
- Marketing-heavy coverage; fraud claims are the company's framing.

### Pricing
- Free first four months, then monthly subscription by group size; free for stokvels under five members; fee decreases as membership grows (amounts not published in sources found).

---

## 4. Money Fellows (Egypt, regulated ROSCA/gam3eya app)

### Profile
- Digitises rotating savings circles. Founder Ahmed Wadi; founding year inconsistent across sources (2014, 2016, 2017 appear). Operating in Egypt.
- Funding: $31m Series B first close (Oct 2022) led by CommerzVentures, Middle East Venture Partners, Arzan; plus a $13m extension in May 2025, total raised over $60m (single press release; https://www.wamda.com/index.php/en/2025/05/money-fellows-secures-13-million-expand-digital-saving-offerings-africa).
- Users: 4.5 million registered, about 7% active monthly (Techpoint, 2022: https://techpoint.africa/2022/10/31/money-fellows-31-million-series-b/); COMPANY CLAIM 8.5 million users in 2025. Egyptian App Store rating 4.1 from about 3.2K ratings (via search summary).
- Regulatory: self-described as under Central Bank of Egypt supervision (regulatory sandbox claim also appears; self-reported).

### Features
- Online circles with a platform acting as administrator; payout order; merchant partnerships to buy products through circles; planned BNPL, pensions, cards.

### Strengths
- Platform-run custody and enforcement removes the "rogue administrator" risk. Real scale. Reliable payouts reported by some users.

### Weaknesses / user complaints (aggregator https://justuseapp.com/en/app/1113492041/money-fellows-online-game-ya/reviews; aggregator sentiment scores are unreliable and internally inconsistent, quotes are individual reviews)
- Onboarding and verification: "It wouldn't let me get passed the phone number confirmation page." and "It keeps rejecting my national card and I don't know why".
- Bugs: "Lots of bugs and i can't use it"; blank screen after activation requiring reinstall.
- Support: live chat replies reportedly 5 to 10 minutes per message.
- Fees: reviewers say fees are high for circles around 10 months, administrative charges reportedly up to about 10% of circle amount; late-payment fines resented; salary document requests every three months resented.
- Praise: "MoneyFellows is very professional and easy to use, great management and professional customer care"; "I used this app from about 6 months and I got paid and I would totally recommend it".

### Pricing
- One-time service fee reported around 6% in early circles, decreasing as circles fill (Techpoint); revenue also from merchant mark-ups.

### Why it succeeded
- Regulated, platform-held funds, strong cultural fit (gam3eya is a mass habit), and an economic wedge (consumer credit via circles). Low monthly activity (7%) shows that registration does not equal engagement.

---

## 5. Djangui, Yankap/Nkap and other francophone tontine apps (Cameroon, Benin)

### Profile
- Djangui (Cameroon): launched 2016 by Guilain Kenfack (Appfabrik); COMPANY CLAIM about 50,000 users; one of the first tontine apps. Imitators named: Tontine.plus, i-djangui, Nkap app, Faroty (Faroty is mainly crowdfunding). Afriland First Bank lets clients join tontines (AFP report, March 2024: https://techxplore.com/news/2024-03-ancient-community-banking-digital-age.amp ; Le360 version: https://afrique.le360.ma/societe/cameroun-les-ancestrales-tontines-se-digitalisent_U4DBPRVMPRG5BLRMEMZGWTPYTM/).
- Yankap (yaNkap, Cameroon): digital tontine plus wallet; Orange Money and MTN MoMo; free "Essentiel" plan (1 tontine, up to 15 members); withdrawals under 2% fee (COMPANY CLAIM); site shows pre-launch countdown to 22 May 2026 while also saying "launched" (inconsistent); claims it never holds funds (yet advertises a wallet); credibility score for members (https://yankap.cm/). iOS listing 3.0 from 6 ratings; one visible review complains transactions failed for more than three days, developer replied it was a resolved technical incident (https://apps.apple.com/cm/app/yankap/id6754392382).
- Tonti+ (Benin, 2019 pilot by Open SI with UNCDF and MTN MoMo): about 115 motorcycle-taxi drivers in 13 tontines; members paid daily via USSD on basic phones into a virtual tontine account; admins used an Android app; system blocked admins from withdrawing cash or paying themselves; 6 months, more than 8,000 transactions; no outcome data reported; scaling barriers listed: limited access to operator systems, cash-out fees, regulators viewing tontines as informal (https://solve.mit.edu/solutions/36119).

### Features (common)
- Rotation order, contribution tracking, late detection, penalties, group chat, mobile-money payment, automatic release only once all members have paid (yaNkap description).

### Strengths
- Directly addresses the founding pain: "we weren't sure if some people had paid or not" (Kenfack, AFP).
- Mobile money integration (MTN, Orange).

### Weaknesses / fraud evidence
- Paul Kemayou, civil servant, lost over 1 million FCFA saved for a year in an online tontine; administrator could not account for the money (AFP).
- Ghislaine Kengne: "Il y a des personnes qui s'enregistrent sous de fausses identités" (Le360).
- Camer.be (7 Aug 2024): seamstress in Yaoundé lost 1.5 million FCFA in an online tontine of 15 members over 15 months; she was last in rotation; administrator (also treasurer) became unreachable, blocked her; no platform named (https://www.camer.be/86172/11:1/arnaque-a-la-tontine-en-ligne-une-camerounaise-perd-15-million-fcfa-dans-une-cotisation-virtuelle-cameroon.html). Key risk pattern: the member last in the rotation carries all the risk.
- No independent app-store review corpus found for Tontine.plus, i-djangui or Faroty (UNVERIFIED).

### Pricing
- Djangui: no app fees stated. Yankap: free tier plus withdrawal fee. Local developers sell white-label tontine apps (Kolonell, Dakar, quotes 500,000 to 3.5m FCFA; marketing source).

---

## 6. Splitwise (global shared-expense tracker)

### Profile
- Founded 2011 in Providence, US (Jon Bittner, Marshall Weir, Ryan Laughlin). Funding: about $9m before a $20m Series A led by Insight Partners (April 2021); about $30m total per CB Insights-type sources. COMPANY CLAIM in 2021: tens of millions of registered users, about $90bn of expenses tracked (https://techcrunch.com/2021/04/28/splitwise-raises-20m-series-a-to-help-everyone-in-the-world-divvy-expenses).
- Does not move money; revenue from Splitwise Pro (about $3 per month in 2021; third-party 2026 sources cite $4.99 per month, unverified).

### Features
- Group ledgers of who owes whom, unequal splits, debt simplification, multi-currency, reminders, receipt scanning (Pro).

### Strengths
- Zero custody risk (never holds money), no regulation burden, strong network effect. Praise: "Super usefull for group trips" and "great for holidays and splitting bills with housemates" (Trustpilot).

### Weaknesses / user complaints
- Trustpilot score 2.0 from 72 reviews, 64% one-star (company has not invited reviews, so skew expected): "Can't add more than 2 expenses a day."; "the new limit of only 3 transactions per day is ridiculous"; "It's clearly designed to frustrate free users into paying." (https://www.trustpilot.com/review/splitwise.com).
- Free tier daily cap, ads with cooldown and feature gating, introduced with little notice, per Trustpilot and a design agency blog; the exact cap is not published officially (UNVERIFIED which number).
- Lesson: users revolt when a core collaborative utility is paywalled by usage caps.

### Pricing
- Freemium; Pro subscription.

---

## 7. Tricount (Belgium, owned by bunq)

- Belgian group-expense app, about 5.4 million users when bunq announced the acquisition in May 2022, terms undisclosed; focus on France, Spain, Germany, Belgium, Italy; multi-currency, unequal splits, works with any bank; free with ads and optional subscription (CSV export, statistics) (https://techcrunch.com/2022/05/03/bunq-to-acquire-group-expenses-app-tricount). Tricount reported users split about 20.2bn pounds in 2025 (Jan 2026 report via search summary).
- A competitor blog claims Tricount removed its premium tier; UNVERIFIED.
- No Tricount-specific user feedback gathered.

---

## 8. Open Collective (transparent group finance, US/global)

### Profile
- Platform for collectives with a public ledger (budgets, contributions, expenses visible by default per third-party review). Expense flow: collective admins approve, then the fiscal host checks paperwork before payout (docs.opencollective.com).
- Fee model: fiscal hosts charge a host fee (commonly 0 to 10%); platform takes a share of host fee (a docs snippet cites 15%; the fee page fetched carries no date and says it may be out of date, so UNVERIFIED) (https://docs.opencollective.com/help/fiscal-hosts/fiscal-host-fees).
- Failure case: Open Collective Foundation (a US 501(c)(3) fiscal host, separate from Open Collective Inc.) wound down by 31 Dec 2024, citing an unsustainable model; more than 600 collectives had to move (https://dataumbrella.substack.com/p/202403-data-umbrella-newsletter-march and thesocialchangenest.org).

### Relevance
- Best existing example of "everything visible to all members by default". Not designed for informal recurring contributions or mobile money.
- Lesson: a legal/fiscal custodian carries compliance and cost burden; complexity of custody killed OCF.

---

## 9. Cash App Pools, PayPal Money Pools, Venmo Groups, Monzo/Revolut pots

- Cash App Pools: announced 29 July 2025, limited rollout; invite by $cashtag, text, link; non-users can pay via Apple Pay/Google Pay; goal tracking; organiser can close and move money to own balance (https://alternativeto.net/news/2025/7/cash-app-launches-group-pools-with-non-user-payments-and-apple-pay-google-pay-integration). Note: money ends up with the organiser, i.e. the same single-point-of-control trust model.
- PayPal Money Pools: launched Jan 2019, closed 2021 (existing pools closed by 8 Nov 2021), PayPal said it would "sharpen our focus on more specialized money raising services"; returned in late 2024 per one report (UNVERIFIED) (https://collctiv.com/blog/paypal-is-closing-its-money-pools-service). A vendor blog speculates low usage; speculation only.
- Venmo Groups: shared-expense groups with ongoing expense tracking (https://www.paymentsjournal.com/venmo-launches-venmo-groups-to-split-common-expenses/amp/); launch date not confirmed.
- Monzo Shared Pots: shown as a "sneak peek" in 2019, never clearly shipped; users demanded it for gifts, holidays, rent; concerns: "what happens legally to the funds if the Group Vault 'owner' dies" and partners withdrawing everything; one user speculated "just not a money maker" (https://community.monzo.com/t/shared-pots-where-did-it-go/64670). Revolut Group Vaults and shared tabs: only admins can withdraw (forum reports, UNVERIFIED in detail).
- GoFundMe Pot and Moneypool: nothing verifiable found in searches; UNVERIFIED, no claims made.

---

## 10. Malipo Circles and other niche Kenyan tools

- Malipo Circles: just over 15,000 users about a year after launch (Business Daily, 9 Dec 2020); groups collect, lend, borrow without meeting; lenders approve loan requests in the app; automated merry-go-round lending; access levels limit who can disburse; developer Erick Oyugi: joint accounts "added to the logistical challenges since it was not as transparent as we would have wanted" (https://www.businessdailyafrica.com/bd/corporate/technology/innovation-takes-operations-of-chamas-online-3223786). Current status UNVERIFIED.
- openBaraza Chama (open source), ChamaChat (SMS/WhatsApp chatbot with M-Pesa API; 2022 grant listing, status UNVERIFIED): no voting or decision log found.

---

## 11. Madagascar and Indian Ocean context

- No Madagascar-specific tontine or group-savings app found (English and French searches).
- Mobile money: MVola (Telma, 2010; digital bank licence; GSMA API-compliant since Sept 2023; developer portal), Orange Money, Airtel Money; the three are interoperable (Madagascar second in Africa after Tanzania). User counts conflict: LinkedIn profile cites over 7 million MVola clients, a blog about 5 million, another source over 10 million; treat as unverified (sources via GSMA and search results).
- Savings products on mobile money: MVola Epargne (2% in 2017 launch, raised to 4% per MVola 2024 impact review), Orange Money plus PAMF M-Kajy and Tahiry Be (savings from 500 ariary, automatic weekly or monthly deposits, over 700,000 users borrowed or saved per press; https://www.lexpress.mg/2025/08/inclusion-financiere-la-solution.html). All are individual products, not group.
- Savings groups: NGO-led (CARE, CRS) VSLA, SILC, AVEC and others; 15 to 25 members; 9 to 12 month cycles; transactions done in front of members in meetings "to build transparency and trust"; coordinated by RPGEM; no data found on number of groups nationwide or on digitisation (https://www.lexpress.mg/2024/03/developpement-la-finance-inclusive.html).
- Banking penetration: an AFD fact sheet cites about 5% (via search summary; UNVERIFIED date).
- Vanilla Pay: described as an aggregator of mobile money operators, account with phone number and email (Khaleej Times profile); no public API documentation found. Confirm integration terms directly.

---

## 12. Cross-cutting evidence on offline, low-end phone, USSD and adoption

- Digital savings group (DSG) practitioners: Catholic Relief Services over-estimated uptake in Kenya despite M-Pesa; uptake depended on demographics, devices, connectivity, social norms; mobile money agents faced liquidity problems; groups averaged only one or two smartphones; trust was low at launch and needed "money games"; free apps became paid after projects ended; automation can erode group financial skills (https://dsghub.org/our-digital-journey-with-savings-groups-what-we-got-wrong-and-the-lessons-weve-learned-along-the-way/).
- Uganda pilot (Response Innovation Lab): digitisation improved trust and efficiency ("Increased trust led to decreased disagreements, which increased morale"); none of 15 groups had power; charging was the most common reason for stopping; only 1 of 15 groups still used the device at follow-up; reliance on one trained member was a single point of failure (https://www.responseinnovationlab.com/updates/learning-from-a-savings-group-digitisation-pilot-in-uganda).
- CARE Sierra Leone MiKashBoks: 81 VSLA groups piloted, worked on smartphones and feature phones with digital literacy training (USAID Learning Lab blog, program outcome only).
- USSD portals for members plus a shared smartphone for the group is the common pattern (MOBIS, DigiSave, Tonti+).
- Chamasoft added only partial offline support (2021).

---

## 13. Takeaways for Gereo MVP

### Table stakes (every credible competitor has them)
1. Mobile money in/out (M-Pesa in Kenya; Orange/MTN in Cameroon; for Gereo: MVola, Orange Money, Airtel Money via Vanilla Pay).
2. Contribution tracking with reminders and per-member statements; penalties or fines for late payment.
3. Member-visible balances (Stanbic, Zimele and Malipo all stress "all members can see").
4. Group roles or signatory approval on withdrawals (multi-signatory in Zimele and Bank of Africa; admin-only withdrawal in Revolut). Gereo's permissions-only model must still enforce multi-approval on outflows.
5. SMS reminders; account recovery and 2FA.
6. Loans or advances inside the group (Chamasoft, Stanbic, Malipo) — common but not in Gereo's stated MVP; note as a likely user ask.
7. Free entry tier for small groups (Chamasoft, StokFella, Yankap, Zimele, Stanbic).

### Gaps nobody does well (Gereo differentiators)
- Async voting with deadlines and quorum: not found in any chama, stokvel or tontine app. Closest: Malipo lender approvals, Chamasoft agenda and attendance, Stanbic constitution acceptance. General boardroom tools (UpperBee, Sherpany) do it but are not savings apps.
- Decision journal tied to money movements: not found anywhere. Chamasoft records meeting agenda and attendance only.
- Automatic revenue-split rules on a group wallet: not found in group-savings apps (Open Collective splits via host/fee logic only).
- Real-time double-entry ledger visible to every member: transparency claims are common, but only Open Collective publishes a full ledger; none documents double-entry. Note Kolonell-type marketing ("tamper-proof ledger") overstates.
- Projects linked to wallets (light ERP): not found in rotating-savings apps; Chamasoft has "project management" (depth unverified).
- Events with push and SMS reminders: partial (meeting hosts and alerts in StokFella; meeting records in Chamasoft).

### Risks and lessons
1. Custody and fraud are the dominant failure mode. Documented losses: 1m and 1.5m FCFA in Cameroon online tontines; Kenyan treasurers disappearing with savings (e.g. Sh163,000 Mombasa case, Nation/Nairobi News reporting, dates unclear). Mitigations seen: platform-held funds (Money Fellows), bank/unit-trust custody (Zimele), system-blocked admin withdrawals (Tonti+), automatic payout only when all have paid (yaNkap). Gereo should avoid any design where one admin holds the wallet keys.
2. Last-in-rotation risk: if Gereo supports rotating payouts, require escrow or all-paid release conditions.
3. Regulation: regulators view tontines as informal (Tonti+ page); Money Fellows works under a regulatory sandbox; Zimele under CMA. Holding member funds in Madagascar may require an e-money or microfinance partner. Needs a legal check; not researched here.
4. Paywall backlash: Splitwise reviews show hostility to usage caps on core features. Keep core ledger and contribution tracking free or charge on a different axis (group size, SMS volume).
5. Registered is not active: Money Fellows had about 7% monthly active of registered users; Chamasoft 1M claim vs 10K-50K Android installs. Measure by active groups.
6. Low-end phones, charging, connectivity, key-person dependence: Uganda pilot (1 of 15 groups still using it) and CRS lessons. Plan for lightweight web or PWA, SMS and USSD fallbacks, and avoid a single trained operator (Gereo's no-roles model helps).
7. Onboarding friction (KYC, phone and ID verification) is the top Money Fellows complaint class; allow signing in with phone number and OTP and defer heavy KYC to money-movement steps.
8. Support responsiveness matters in money apps: complaints about slow support (Money Fellows), unanswered messages after flagged withdrawals (Cowrywise, Nairametrics).
9. Single Madagascar-specific unknowns: no local competitor found; may mean open market or low willingness to pay. Validate with the friend-group origin cohort and local savings-group promoters (RPGEM, CARE, CRS).
10. Aggregator and company-published numbers were frequent; do not quote competitor user counts externally without verification.

### Not covered or unverified
- Reddit and X threads (blocked or not retrieved); Play Store review text for Chamasoft, StokFella, Money Fellows; Trustpilot for chama apps.
- Esusu/Ajo-style Nigerian apps beyond brief mentions (AjoMoney, eAjor, Truesaver names only; no data). PiggyVest and Cowrywise are individual-savings products with limited group features; Cowrywise withdrawal-flag complaints are the only feedback gathered (Nairametrics, likely 2019 to 2021, undated in my fetch).
- GoFundMe Pot, Moneypool, Kuza, Jenga, Chamaa, Wekeza, Chama Yetu: nothing verifiable found.
- Madagascar nationwide count of savings groups and Findex 2021 informal-savings percentage.

---

## Sources

- https://app.sensortower.com/api/android/apps/chamasoft.app?country=KE
- https://apps.apple.com/us/app/chamasoft/id1489712788
- https://apps.apple.com/mx/app/chamasoft/id1489712788
- https://solve.mit.edu/solutions/85265 (Chamasoft)
- https://capitalfm.africa/thesauce/are-you-in-a-chama-students-develop-management-software
- https://apps.apple.com/app/id1564047823 (Stanbic Chama)
- https://ke.kcbgroup.com/products/kcb-chama
- https://www.zimele.co.ke/chama/
- https://www.businessdailyafrica.com/bd/corporate/technology/innovation-takes-operations-of-chamas-online-3223786
- https://biznakenya.com/?p=120719 and https://nairobinews.nation.africa/man-charged-with-stealing-chama-cash/ (Kenyan chama theft examples, via search summaries)
- https://www.sowetan.co.za/business/2022-12-14-keep-your-hard-earned-cash-safe-with-the-stokfella-app/
- https://apps.apple.com/app/id1058855642 (StokFella)
- https://www.itweb.co.za/article/fnb-stokvel-contributions-balloon-as-members-go-digital/VgZeyvJlmQaMdjX9
- https://techpoint.africa/2022/10/31/money-fellows-31-million-series-b/
- https://www.wamda.com/index.php/en/2025/05/money-fellows-secures-13-million-expand-digital-saving-offerings-africa
- https://justuseapp.com/en/app/1113492041/money-fellows-online-game-ya/reviews
- https://techxplore.com/news/2024-03-ancient-community-banking-digital-age.amp
- https://afrique.le360.ma/societe/cameroun-les-ancestrales-tontines-se-digitalisent_U4DBPRVMPRG5BLRMEMZGWTPYTM/
- https://www.camer.be/86172/11:1/arnaque-a-la-tontine-en-ligne-une-camerounaise-perd-15-million-fcfa-dans-une-cotisation-virtuelle-cameroon.html
- https://yankap.cm/
- https://apps.apple.com/cm/app/yankap/id6754392382
- https://solve.mit.edu/solutions/36119 (Tonti+ Benin pilot)
- https://www.kolonell.com/en/blog/digital-savings-group-microfinance-app-kenya-2026 (vendor marketing, low reliability)
- https://techcrunch.com/2021/04/28/splitwise-raises-20m-series-a-to-help-everyone-in-the-world-divvy-expenses
- https://www.trustpilot.com/review/splitwise.com
- https://getfinny.app/blog/splitwise-pricing-2026 (competitor blog, low reliability)
- https://techcrunch.com/2022/05/03/bunq-to-acquire-group-expenses-app-tricount
- https://docs.opencollective.com/help/fiscal-hosts/fiscal-host-fees
- https://dataumbrella.substack.com/p/202403-data-umbrella-newsletter-march
- https://thesocialchangenest.org/?p=5062
- https://alternativeto.net/news/2025/7/cash-app-launches-group-pools-with-non-user-payments-and-apple-pay-google-pay-integration
- https://www.paymentsjournal.com/venmo-launches-venmo-groups-to-split-common-expenses/amp/
- https://collctiv.com/blog/paypal-is-closing-its-money-pools-service (competitor blog)
- https://community.monzo.com/t/shared-pots-where-did-it-go/64670
- https://nairametrics.com/?p=408083 (Cowrywise complaints)
- https://www.lexpress.mg/2025/08/inclusion-financiere-la-solution.html
- https://www.lexpress.mg/2024/03/developpement-la-finance-inclusive.html
- https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/uncategorized/mvola-madagascar-a-case-study-for-the-gsma-mobile-money-api-and-open-platforms/
- https://www.mvola.mg/wp-content/uploads/2025/07/Corporate-Impact-Review-MVola-2024_.pdf (via search summary)
- https://www.khaleejtimes.com/supplements/vanilla-pay-international-we-secure-the-way-people-pay?amp=1
- https://dsghub.org/our-digital-journey-with-savings-groups-what-we-got-wrong-and-the-lessons-weve-learned-along-the-way/
- https://www.responseinnovationlab.com/updates/learning-from-a-savings-group-digitisation-pilot-in-uganda
- https://usaidlearninglab.org/community/blog/digitalizing-savings-groups-sierra-leone
