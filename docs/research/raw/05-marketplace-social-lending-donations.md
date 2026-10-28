# Gereo competitive research 05: Marketplace, Social/Marketing, Lending, Donations (Africa / emerging markets)

Research date: 2026-10-19. Scope: later-phase modules of Gereo (Marketplace, Social + communities, Marketing/boosts, Lending, Donation campaigns), with emphasis on Africa, emerging markets, low-bandwidth contexts and Madagascar.

Evidence labels used throughout:
- [V] = verified by fetching the cited page in this session.
- [S] = taken from a search-result summary only (page itself not fetched or blocked), treat as probable.
- [U] = unverified / vendor marketing / low-quality source / conflicting sources. Do not rely on it without a primary check.

Tooling caveat: several primary pages returned HTTP 403/404 (Techcabal, Play Store, some Trustpilot slugs), and the search tool returned summaries, not raw SERPs. Reddit and app-store review pages could not be reached directly, so "real user feedback" is mostly Trustpilot (fetched), press and regulator material. This gap is stated explicitly in each section.

---

## 0. Madagascar context that conditions every module

| Fact | Value | Label | Source |
|---|---|---|---|
| Mobile connections (end 2025) | 21.8 M, 66.2% of population | [V] | DataReportal Digital 2026 Madagascar |
| Internet users (Oct 2025) | 6.71 M, 20.4% penetration; ~79.6% offline | [V] | DataReportal |
| Social media user identities | 4.15 M (12.6%); Facebook ad reach 4.15 M (23.4% of adults 18+) | [V] | DataReportal |
| Mobile money | MVola (Telma/Axian), Orange Money, Airtel Money; interoperable transfers across the 3 | [V] (MVola page via search) / [S] | mvola.mg |
| MVola | Launched 2010, got a bank licence in 2021 | [S] (Wikipedia Axian Telecom via search) | Wikipedia |
| Bank penetration | "below 10%" | [U] (SME fintech blog) | thenoklu-studio blog |
| Online selling | Happens mostly on Facebook pages/groups, paid via mobile money | [V] (2021 article) | La Gazette de la Grande Ile |
| Habitual lending without licence | Punishable (3 months-2 years or 10-40 M Ar per Studio Sifaka citing Law 2020-011 art. 228-229); Law 2017-026 art. 9 forbids non-MFI from offering microfinance services | [V] fact-check article, legal text itself not verified | Studio Sifaka, Assemblee nationale PDF |
| Public fundraising law | No Malagasy text found on "appel a la generosite publique" or crowdfunding | [V] negative finding | search |
| Jumia in Madagascar | No source lists Madagascar among Jumia countries; jumia.mg redirects to jumia.com | [V] (negative evidence, not proof) | jumia.mg redirect, Wikipedia Jumia |

Implications: (1) Reach in Madagascar is mobile + Facebook + mobile money, not web. Design for SMS/USSD fallbacks, tiny payloads, offline-tolerant ledger. (2) The "who is the counterparty and who holds money" question is regulated, not just a UX question (see Lending). (3) The competitor set in Madagascar is mostly informal: Facebook groups, WhatsApp, Telegram, MVola.

---

## 1. MARKETPLACE MODULE

### 1.1 Module overview

African marketplaces split into three archetypes:
1. 1P/3P logistics-heavy retailers (Jumia, Takealot, Kilimall): large GMV, brutal unit economics, high customer-service complaints, pulled back from markets.
2. Classifieds (Jiji, CoinAfrique, Expat-Dakar, OLX heritage): low cost, trust problems (fake sellers, prepayment scams), monetised by premium listings/ads, not commission.
3. Social commerce (Facebook Marketplace/groups, WhatsApp Business catalogs, Instagram Shops, Paystack Storefront/Bumpa/Selar): sellers own the customer relationship; payment and trust are the missing layers.

In Madagascar archetype 3 dominates and the missing layers (escrow, receipts, reviews, dispute resolution) are exactly what Gereo's wallet + ledger + group trust could supply. But a marketplace is a two-sided cold-start problem plus a liability (disputes, refunds, product safety). Gereo's best later-phase entry is closed-loop: sell within a group/community, paid via the group wallet, ledger as proof.

### 1.2 Jumia (pan-African 3P marketplace)

**Profile.** Founded 2012 in Lagos; NYSE IPO April 2019 ($14.50, ~$196 M net); shares peaked near $50 in May 2019 and fell below $5 by end 2019 [V Wikipedia]. 2019 Citron short-seller "securities fraud" allegation; Citigroup report rebutted most points [V Wikipedia]. Exits: Cameroon, Tanzania e-commerce (2019), Food (2023), South Africa and Tunisia (2024), Algeria (early 2026) [V Wikipedia, Q2 2026 release].
**Scale (Q2 2026, reported 12 Aug 2026) [V].** GMV $216.3 M (+20% YoY, +23% adjusted); revenue $52.0 M (+14%); marketplace revenue $28.8 M (+34%), first-party sales $22.8 M (-3%); quarterly active customers 2.6 M; physical orders 6.3 M; gross profit 14.2% of GMV; advertising 1.6% of GMV; adjusted EBITDA loss $8.7 M; FY26 adjusted EBITDA loss guidance $25-30 M; targets EBITDA breakeven Q4 2026; $50 M raise anchored by $25 M IFC. JumiaPay App orders collapsed to ~0 (JumiaPay App Orders 0.0 M, -88%).
**Features.** Marketplace, logistics network (warehouses, pick-up stations), JumiaPay, BNPL partnerships in Nigeria (2024), retail-media ads (26% of sellers use it).
**Business model.** Commission per category deducted after successful delivery (rates vary by category; Egypt example 5%) [S]. Third-party blog figures for Nigeria: electronics 5-10%, fashion 12-20%, 7-14 day payout [U Kolonell]. Plus logistics fees, ads, 1P margin.
**Why it struggled/survives.** Logistics and trust costs, customer service, competition from Temu/Shein (Algeria exit cited) [S]. Survives by shrinking to profitable markets (Nigeria, Egypt, Kenya, Morocco and a few others) and pivoting to marketplace + ads.
**Madagascar.** No evidence of operations. [V negative, not proof]

**Real user feedback (Trustpilot, unverified, Trustpilot warns not representative):**
- Jumia Kenya: 1.5/5 from 132 reviews, ~76% 1-star. Complaints: refund refused for phone with 4 GB RAM instead of 8 GB (Apr 2026); hose advertised 100 ft, measured ~40 ft (Feb 2026); "each time I was referred to an AI whats app group" when seeking a human (Sep 2026); delivery a week or more. Praise: "fast shipping, easy returns, easy buying process" (Aug 2026, 3 stars); pick-up stations in many regions. https://uk.trustpilot.com/review/jumia.co.ke [V]
- Jumia Nigeria: 1.5/5 from 161 reviews, 79% 1-star. Complaints: damaged product and month-long refund wait (Sep 2026); order marked delivered without delivery code (Aug 2026); refund refused for defective phone (Sep 2026). https://www.trustpilot.com/review/jumia.com.ng [V]
- Seller-side complaints (fees, payout delays): none found in this session. [gap]

**Strengths:** brand trust at scale in a few markets, logistics, pay-on-delivery culture. **Weaknesses:** refunds/returns and support are the dominant complaint pattern; seller communication; 3P quality control.

### 1.3 Jiji (classifieds, Nigeria/Ghana/Kenya/Uganda/Tanzania/Ethiopia/Senegal/Cote d'Ivoire)

**Profile.** CEO says 12 M+ unique monthly visitors, 8 countries [S via search of Techcabal 2024; page itself returned 403]. Growth via free listings for first-time sellers, local-language content (Hausa), preinstalled apps on cheap Android phones [S]. Kenya arm descends from OLX [S].
**Features.** Free ad posting, moderation before publication, "report abuse" flow, premium boosts (Basic/VIP/Diamond/Enterprise in Ethiopia), cost-per-click "Pro Sales" [S africa.com, productmint [U]].
**Business model.** Not commission. Listing is free; revenue from premium boosts/subscriptions, CPC, display ads [S/U]. Kenya claims no commission on sold items [S].
**Trust posture.** Kenya manager: prepayment is "highly advised against", shown on every ad; moderation review pre-publication [S]. Ghana FAQ: confirmed scam -> seller blocked immediately [S]. Nigeria leadership cites AI fraud detection [S, company claim].

**Real user feedback (Trustpilot Jiji Nigeria, 2.6/5, 37 reviews, 62% 1-star) [V]** https://www.trustpilot.com/review/jiji.ng
- Praise: free and fast posting, buyers calling within hours (Apr 2026); "perfect service end to end" after selling an AC (Sep 2026).
- Complaints: "DON'T PAY FOR JIJI PREMIUM SUBSCRIPTION" - premium ads repeatedly declined (Dec 2025); paid ads not approved (Nov 2025); sales calls pushing subscriptions and account locked (Sep 2026); fake rental agent demanding payment (Feb 2026).
**Lesson for Gereo:** classifieds monetise sellers via paid visibility, which creates a perverse incentive and a recurrent "I paid and got nothing" complaint. Moderation + fraud are the core cost.

### 1.4 CoinAfrique (and Expat-Dakar)

CoinAfrique: founded Benin 2016, claimed #1 classifieds in francophone Africa, 10 countries; app 2 M+ downloads, 800 k MAU, 60 k new listings/month (company-reported, 2018-era) [S, U]. Acquired by Autochek to push auto financing since ~50% of volume is automotive [S]. Expat-Dakar: no usable source found [gap]. No independent scam statistics found for either [gap]. Takeaway: the monetisation path of francophone classifieds is vehicles/real estate + financing, not small peer trading.

### 1.5 Facebook Marketplace / Groups / Shops, WhatsApp Business, Instagram Shops (the real incumbent in Madagascar)

**Madagascar reality.** Online selling is mostly Facebook pages and groups paid via mobile money [V La Gazette 2021]. A blog cites groups such as "Vente en ligne Tana" and "Friperie Mada" with hundreds of thousands of members [U blog, no verification].
**Scale (global).** Marketplace ~1 B monthly users in spring 2021, 150+ countries [V ProPublica 2021]. WhatsApp Business >200 M monthly users (June 2023) [S Statista via search]; catalogs rolled out to limited markets first and initially not Africa [S Techpoint, date unclear].
**Business model.** Meta monetises via ads, boosts; Marketplace added ads and paid boosts [V ProPublica].
**Weaknesses / trust failures (V ProPublica, 22 Sep 2021):** ~400 Accenture contractors reviewing 600+ items/day; enforcement "100% reactive, it's not proactive" (former contractor); AI missed obvious scams and wrongly banned legitimate sellers; ~700,000 auto-banned accounts awaiting appeal at one point; Marketplace launched in Benin despite internal flags for "unusually high scam prevalence". Recent: FTC says Facebook generated more reported fraud losses than any other social platform in 2025 [S, secondary], Meta says it removed 159 M scam ads in 2025 [S, company claim]. https://www.propublica.org/article/facebook-grew-marketplace-to-1-billion-users-now-scammers-are-using-it-to-target-people-around-the-world
**Madagascar-specific scam pattern [V La Gazette, Feb 2021]:** fake mobile money transfer SMS shown to a kiosk operator, "overpayment" refund requested; seller ended up 48 h in custody and repaid 1,000,000 Ar to withdraw the complaint; causes cited: unregistered street-sold SIMs, overloaded kiosks. Other: gendarmerie vows to hunt Facebook scammers (non-existent products) [S, Midi Madagasikara, ~650 days old]; fake trading pages, ~100 M Ar extorted, 7 arrested (Jan 2024) [S Gabon Media Time]; guides tell buyers never to pay strangers via MVola without escrow [S/U].
**Gereo implication:** an escrow-style wallet hold (release on buyer confirmation) plus verified receipts directly attacks the documented scam pattern. That is the marketplace wedge. Everything else (search, categories, logistics) is a distraction.

### 1.6 Storefront-in-a-link tools: Paystack Storefront, Bumpa, Selar

Paystack Storefront: free page, only normal Paystack fee (local cards ~1.5% + N100 capped N2,000) [U, Bumpa blog + guides]. Bumpa: business management app for Nigerian entrepreneurs [S]. Selar: no usable data [gap]. Unregistered merchants report 30-60+ day payout holds [U]. Takeaway: low-fee "link storefronts" win because the seller already has an audience on WhatsApp/IG; the differentiator is payments + simple inventory.

### 1.7 Takealot (South Africa)

Success fees by category (clothing 10-18%, homeware 15%, computers 5-10%) and monthly seller fee R300-400 (sources conflict) [U 2024 guides]; fulfilment fee +7% from 1 Apr 2026 [S, Takealot help page]; 3P share of GMV rising [S Financial Mail 2024]. Not directly relevant to Madagascar; useful only as proof that commission + fulfilment + subscription layering is the mature model.

### 1.8 Kilimall

Exited Uganda in 2018 [S Kenyan Wall Street]. No 2025-26 status found [gap]. Do not cite beyond "regional retreat precedent".

### 1.9 Marketplace: Takeaways for Gereo
- Defer a public marketplace. Build first (later phase, after wallet/ledger/groups are stable): group-scoped listings ("members sell to members / group sells to members") + wallet escrow + mutual confirmation + receipt in ledger.
- Do not build logistics, search at scale, seller ads, or category taxonomy. Delivery is arranged by the parties.
- Revenue: small flat/percent fee only on escrowed wallet payments; avoid paid visibility at first (Jiji complaint pattern).
- Risk: product disputes become Gereo support load (Jumia's dominant complaint). Cap order value, require buyer-confirm window, group admin as first-line arbiter.
- Risk: fake "overpayment" and fake credit SMS scams exploit off-platform payment; show wallet-confirmed state, never accept screenshot proof.

---

## 2. SOCIAL / COMMUNITIES / MARKETING MODULES

### 2.1 Module overview

For Gereo the social module is "group announcements + communities with follows/reactions/moderation". Evidence shows: (a) open public feeds in emerging markets attract scams and need heavy moderation; (b) creator-pay schemes (Binance Square) tie rewards to trading volume, which pushes shilling; (c) micro-task "earn on social" platforms (pr.social) are fragile on trust; (d) boost tools from Meta are cheap but often optimise for vanity engagement. A closed, group-scoped social layer is cheap and low-risk; an open network is neither.

### 2.2 Binance Square

**Profile.** Binance's in-app social feed; ~35 M monthly active users claimed (May and July 2025, company marketing) [S, U]. In 2023 at rebrand: 10 M+ MAU, 170+ media partners, 11,500 KOLs [S]. Programs: Write to Earn, CreatorPad [S].
**Model.** Write to Earn pays creators a share of trading fees from readers who trade after clicking cashtags/chart widgets; tiers reported as 20% base, up to 50% for top weekly creators, paid weekly in USDC [S/U, community posts, not official]. Feb 2026: 300 BNB allocated to Write to Earn that month [S].
**Weaknesses.** Incentive tied to trades encourages promotional content; scam warnings circulate on Square (Binance's own scam hashtag feeds) [S]; Binance Trustpilot shows frozen-account complaints (not Square-specific) [S]. No source found on Square moderation quality or creator counts [gap].
**Lesson.** Pay-per-conversion creator revenue is attractive but conflicts with transparency. If Gereo ever adds creator revenue, tie it to disclosed, non-financial-advice categories and exclude investment solicitation.

### 2.3 Facebook Groups, Telegram channels, WhatsApp communities (the de facto Malagasy social layer)

- Africa crypto scam groups: study cluster of 152 Facebook groups on airdrops with 47% of links pointing to Telegram [S]. FSCA (South Africa) warned in Jan 2025 of Telegram groups impersonating licensed firms; victims added without consent, fake dashboards and bots simulate profits [S].
- Moderator burnout/volunteer moderation: no study found [gap].
- Lesson: group = trust boundary. Gereo can differentiate by making membership, admin roles and money movements verifiable inside the group, which Facebook/Telegram cannot.
- Chama fraud context (offline benchmark, relevant to group trust): FSD Kenya research cited as theft/embezzlement = 13% of chama funds; chamas used by 41% of Kenyans by 2018; "most chamas collapse within two years" (unsourced) [V Money254, secondary]. Documented case: chairlady accused of misappropriating group-investment contributions [S Nairobi News, page 403].

### 2.4 pr.social (what it actually is)

**Verified.** "Earn on social networks | PR.SOCIAL" [V]. It is NOT a PR/marketing add-on toolkit for brands in the Buffer/Hootsuite sense. It is a paid micro-tasks marketplace:
- Advertisers place tasks on social networks (follow, like, comment, view, repost, vote, review - 30+ networks claimed) and performers do them from their own accounts for a reward [V Terms 1.1, guide].
- Performers link accounts via a code in their profile or a Telegram bot, submit screenshots; most tasks auto-checked in minutes, Premium tasks (up to $0.50) reviewed by a human; rejected tasks can be resubmitted up to 5 times [V guide].
- Minimum withdrawal $2 (USDT BEP20) or $5 (TRX); 24 h security hold; no withdrawal fee stated; referral pays 10% of friends' accepted-task rewards [V guide]. Terms: no fee amounts, no platform commission stated, no company name or governing law stated; liability capped at balance + prior-year payouts [V terms].
- Business model (inferred, [U]): advertisers pay for engagement, platform keeps a spread; not documented on the site.
**Trustpilot (unclaimed profile): 2.3/5, 27 reviews, 67% 1-star** [V] https://www.trustpilot.com/review/pr.social
- Praise: "pay me 2 usd on 16 July 2026. So it is real platform"; "paid... very good site for earning" (Oct 2026).
- Complaints: withdrawal pending 24 days, tickets unanswered (Sep 2026); "Pending withdrawals rejected and support tickets closed without reason" (Aug 2026); "scam site, my withdrawal never landed" (Sep 2026); account restricted for "Suspicious activity detected" (Jun 2026).
**Assessment.** A "task-for-crypto" platform selling inauthentic engagement (the performer's followers are not customers). It conflicts with platform rules of the networks it targets ("networks can block accounts" is acknowledged in its own guide). For Gereo it is a cautionary example, not a template. The idea of "small add-on features that generate revenue for others" is viable only if value is real (e.g., group-run services, local promotions), not engagement farming.

### 2.5 Meta boosts / Ads Manager (marketing/audience analytics benchmark)

- Boost minimum about $2 over ~2 days (third-party Metricool help page) [U]; boosts cannot be edited once active; agency view: boosts optimise engagement, not enquiries/sales [U].
- Historical fake-engagement problem: click farms ("$1 per thousand clicks"), small business reporting more likes but fewer real interactions [S, 2012-2014 era, old].
- Madagascar-specific budget/currency support: not found [gap]. Facebook ad reach 4.15 M in Madagascar [V DataReportal] (note Meta says reach is not active users).
- Lesson: "reach / people touched / engagement" analytics are cheap to show but easy to mislead. If Gereo ships audience analytics, report unique members reached inside the group/community and conversion to contribution/purchase, not vanity likes.

### 2.6 SMS / USSD marketing (Africa's Talking and local aggregators)

Africa's Talking: Kenya-based SMS, USSD, short code, voice APIs [S]. Madagascar support not confirmed [gap]. Madagascar SMS pricing sources conflict wildly ($0.011-0.022 local operators vs $0.33 Plivo long code) [U]. Operators: Airtel, Orange, Yas (Telma) [S]; regulator ARTEC [S]. Lesson: SMS is the only channel that reaches the 79.6% offline population for reminders (loans, contributions) but cost per message in Madagascar needs a direct quote before any "automated reminders" promise.

### 2.7 Social + Marketing: Takeaways for Gereo
- MVP/early: group announcements (admin to members), reactions/comments restricted to members, simple report-and-hide. This reuses existing group membership and avoids open-network moderation.
- Later: public communities with follows only after moderation tooling, rate limits, verification badges, and clear anti-solicitation rules (investment/loan/"double your money" posts banned by default).
- Defer: creator monetisation, boosts, campaigns, audience analytics, task-for-reward add-ons. Highest risk of scam adjacency and lowest relevance to the core wallet.
- Marketing "boost" can start as a paid pin/highlight inside a group or community owned by Gereo (no external ad network), with transparent receipt in the ledger.
- Risk: platform moderation load. ProPublica shows even Meta with 400 contractors fails reactive-only moderation.

---

## 3. LENDING MODULE

### 3.1 Module overview

Digital lending in Africa is a proven revenue machine and a proven source of consumer harm. Two models matter:
1. Algorithmic consumer credit (Tala, Branch, M-Shwari/Fuliza, FairMoney, Carbon): short tenor, high effective APR, data-driven scoring, strong regulatory attention on collections and data abuse.
2. Group/community lending (Grameen joint liability, chamas/VSLAs, Kiva-through-MFIs): relationship and social collateral; failure modes are over-indebtedness, peer pressure, and treasurer embezzlement.

Gereo's stated design (group-internal lending using only group funds) sits in model 2, which is the safest competitively but still bumps into Madagascar's law on habitual lending (see 3.9).

### 3.2 Tala

**Profile [V Wikipedia].** Founded 2011 (infobox says 2010) by Shivani Siroya; HQ Santa Monica; serves Kenya, Philippines, Mexico, India; "over 10 million clients" in 2025 incl. ~3.5 M in Kenya; raised $350 M; loans $10-$500, avg ~$50; wallet added 2017; repayment rate >90%.
**Licensing (Kenya) [V paybillke review].** Operator Inventure Mobile Ltd, licensed 30 Jan 2023 as non-deposit-taking credit provider (first tranche, DCP Regulations 2022).
**Pricing [U/S].** Flat facility fee ~5-15% over 21-30 days; published cost 109.5-219% APR; late fee 5-8% of balance (sources conflict) [S/U]. Initial limits often under KES 5,000, growth with repayment; scoring opaque with no direct appeal; historically broad Android permissions (SMS, contacts) [U/V paybillke].
**Evolution.** Feature letting users choose due dates (2022) and Apr 2025 layoffs of 28 customer-service/collections staff as defaults and support queries fell [S, Techcabal 403]. A concrete data point that borrower-controlled schedules reduce collections cost.
**Complaints.** Criticised for encouraging impulsive borrowing and high interest; some users reported aggressive collection tactics [V Wikipedia]. Direct app-store/Reddit feedback could not be retrieved [gap].

### 3.3 Branch (Branch International)

California-HQ lender in Kenya, Nigeria, Tanzania (plus others); one source says 4 M+ customers, 29 M+ loans, $1 B disbursed (Aug 2025 article), another says $600 M to 3 M [S, conflicting]. Alternative data incl. SMS patterns, contact diversity, device signals [S]. Trustpilot: only 2 reviews (3.2/5), one citing hard-to-reach support [V] https://www.trustpilot.com/review/branch.co - too thin to infer anything.

### 3.4 M-Shwari and Fuliza (Safaricom/M-Pesa)

- Fuliza (6 months to Sep 2025): 9.1 M active users (+22.2%), KES 629.2 B borrowed (+39.8%), avg loan KES 254.60, 17.8% of Safaricom's 51.12 M 90-day active customers; fees 1% access + daily maintenance KES 5-30 depending on band; underwriters NCBA and KCB [V Business Daily Nov 2025].
- M-Shwari: 7.9 M monthly active users, avg loan KES 9,186, disbursements KES 48 B [V Business Daily].
- Fee interpretation: KES 1,000 held 30 days costs ~KES 190 (19%) per one third-party guide [U paybillke/pesatrail].
- User outrage Aug 2026 over unprompted Fuliza deductions after a Feb 26-Mar 20 2026 billing glitch [S streamlinefeed, low quality, not confirmed with primary source].
- Why they succeed: embedded in the mobile money wallet users already trust and use. Lesson for Gereo: the group wallet is that anchor; lending can ride on wallet history.

### 3.5 FairMoney, Carbon, Jumo, Kopo Kopo

- FairMoney (Nigeria): microfinance-bank licence (state MFB), >N150 bn disbursed in 2025 and >N7 bn interest paid to savers; ~15,000 loans/day per TechCabal Jul 2026 [S]. Company-disclosed figures. Evolved from loan app to neobank.
- Carbon (Nigeria): began as Paylater (2015), rebrand 2019; $100 M+ disbursed claim from job posting [U].
- Jumo (South Africa): infrastructure for banks/MNOs; claims 120 M loans / $3.5 B / 18 M consumers [S, undated, U].
- Kopo Kopo: no data found [gap].
- Lendahand (NL): crowdfunding for emerging-market entrepreneurs, revenue from service fee on borrower interest shared with local partners [S].

### 3.6 Kiva (and microfinance via field partners)

**Profile [V MIT Tech Review 2023].** Nonprofit, founded 2005; 2.4 M lenders, 190+ countries, 5 M+ borrowers in 95 countries (2023); lenders earn no interest; since 2019 charges partners fees (avg 2.53%, up to 8%); Kiva Capital for return-seeking investors; CEO ~$800 k pay (2020); "Lenders on Strike" ~200 lenders in 2021.
**Transparency issues.** Borrower interest by field partners not clearly disclosed (e.g., ECLOF Kenya 40% per year on Kiva's partner page [S]); critic Hugh Sinclair called non-disclosure "a deliberate deception of potential lenders"; 2021 redesign allegedly made interest harder to find [S NextBillion etc.]. Implies direct borrower-lender links that don't exist [V MIT TR].
**Trustpilot: 4.8/5, 744 reviews [V]** https://www.trustpilot.com/review/kiva.org. Praise: updates on borrower, funds relent. Complaint: reviewer says balance "donated to themselves" - Kiva reply points to auto-lending settings (Oct 2026). Lesson: automation defaults (auto-lend, auto-tip) are the main source of "you stole my money" complaints.

### 3.7 Microfinance in Madagascar

Regulator: CSBF; framework Law 2017-026 on microfinance [S]. IMF Financial Access Survey shows ~2.58 M household deposit accounts at deposit-taking MFIs in 2024 (2.09 M in 2022) [S]. A CSBF decision concerning Volamahasoa dated 2026-01-14 is listed but content not accessible [gap; do not infer a problem]. OTIV/CECAM/SIPEM/Baobab client numbers not found [gap]. Deposits are large in Madagascar MFIs, so supervisory actions expose savers [S].

### 3.8 Group lending lessons (Grameen, Andhra Pradesh) and savings groups (chamas/VSLAs)

- Andhra Pradesh 2010: spate of borrower suicides (~80 reported), lenders charged 24-30% "usurious" rates, multiple borrowing, aggressive agents; government crackdown told borrowers not to repay [S Project Syndicate/CGAP/NextBillion]. Debate: joint liability pressure vs growth-driven drift from group model [S]. Lesson: group guarantee + shame + speed of growth is dangerous; individual repayment capacity assessment still required.
- VSLA digitisation: randomized evaluation in 200 Sierra Leone communities - upgrading VSLAs as mobile-money agents raised DFS account ownership +7.2 pp (29%), usage rose only with consumer-feedback add-on (+11 pp); participating VSLAs digitized more savings, lower default rates, higher group income [V IPA]. Counterpoint: manual in-meeting ledger lets everyone see and challenge entries; digital phones are private and can concentrate expertise in one person [V pixelcharmer field notes]. Lesson: Gereo's "transparent ledger" must be visible to every member by default and verifiable in-meeting, not just an admin tool.
- Kenya chama context above (13% theft claim, secondary).

### 3.9 Regulation and borrower-harm pitfalls

**Kenya [V Business Daily Jun 2025; S globallawexperts].** DCP Regulations 2022: pricing models approved by CBK, full cost of credit disclosed upfront, harassment/shaming/third-party contact prohibited, contact-list harvesting curbed, graduated sanctions. 126 licensed DCPs (Jun 2025; a low-quality blog claims 252 later [U]); 600+ applicants waiting. Debt-shaming resurged in 2025 (Chapeo Capital apps named; also Whitepath, Rocketpesa, Platinum Credit, Azura Credit, Mulla Pride, Credit Watch Investments). ODPC can fine but not revoke licences; CBK can. Industry claim of 75% fall in abuse cases [S, industry-side].
**Nigeria [V Ecofin].** FCCPC DEON Regulations 2025 (gazetted 21 Jul 2025, compliance deadline 5 Jan 2026, fines up to N100 M per violation) frozen by interim Federal High Court injunction on 15 Apr 2026 after WASPAN suit; approved apps 269 (Sep 2024) -> 408 (Mar 2025); 47 delisted, 88 on watchlist; >11,000 complaints 2021-2023; inflation 24.48%, policy rate 27.5%. Takeaway: licensing regimes themselves get litigated; do not build on the assumption of a stable rulebook.
**Other markets [S].** Tanzania and Nigeria regulators describe contact-based shaming; Philippines privacy regulator had 485 complaints; India police linked collection tactics to three suicides.
**Madagascar [V Studio Sifaka fact-check; legal text not read]:**
- Law 2020-011 (banking reform): only licensed credit institutions/MFIs may carry on credit activity professionally. Habitual unlicensed lending can be prosecuted as illegal exercise of banking activity; habitual excessive-rate lending can be usury. Penalties cited: 3 months-2 years imprisonment or fine of 10-40 M Ar (arts. 228-229).
- Law 2017-026 art. 9: no one other than an MFI may offer microfinance services.
- Occasional loans between individuals are treated differently; "habitual" is not defined in the source; tontines/family loans not addressed.
- Implication for Gereo: group-internal lending of members' pooled money to members could be argued as outside "professional" credit, but a platform that systematises it, with schedules, automated reminders, scoring and interest, risks being characterised as habitual credit activity or as offering microfinance services. Never lend platform funds; never take interest as platform revenue; keep rules owned by the group.

### 3.10 Lending: Takeaways for Gereo
- Defer entirely until contribution/ledger/votes are stable. This is the highest-risk module.
- If built, first version = "group loan ledger": request, group vote approval (reuse vote module), disbursement from group wallet, repayment schedule, SMS/in-app reminders, zero or group-set fixed fee, per-member exposure cap (e.g. share of own contributions), cap on simultaneous loans.
- Design out the documented harms: no contact-list access, no public shaming, no external collection agents, upfront total-cost display, borrower-set due dates (Tala result), cooling-off for rollovers, caps on concurrent debts.
- Do not use alternative-data scoring, SMS/contacts permissions, or external credit bureau pulls.
- Risk: group social pressure (Andhra Pradesh) and treasurer fraud (chama 13% stat). Mitigate with multi-approver disbursement, visible ledger to all, immutable audit trail.

---

## 4. DONATION CAMPAIGNS MODULE

### 4.1 Module overview

Fundraising platforms differ by who holds funds, how fees show up, and verification depth. Trust failures cluster around (1) fake or exaggerated campaigns, (2) hidden fees/default tips, (3) frozen accounts/withdrawal delays, (4) lack of accountability on use of funds. Mobile-money-native platforms (M-Changa) and group pots (Leetchi, HelloAsso) are closest to Gereo.

### 4.2 GoFundMe

**Profile.** Lifetime >$40 B raised claim (BusinessWire May 2025, secondary) [U]. Model: dropped 5% fee for individuals in US/CA/UK in 2017, relies on donor tips plus payment processing ~2.9% + $0.30 [S/U].
**Controversies [V NY AG release 3 Mar 2026].** In Oct 2025 GoFundMe allegedly created donation pages for ~1.4 M US charities without consent; default tip ~16.5% went to GoFundMe; SEO allegedly outranked charities' own sites; 20 AGs/regulators demanded proof of removal and written-consent requirement within 14 days. https://ag.ny.gov/press-release/2026/attorney-general-james-demands-transparency-gofundme-unauthorized-fundraising
**Trustpilot: 3.3/5, 24,326 reviews, 56% 1-star [V]** https://www.trustpilot.com/review/gofundme.com. Praise for support staff ("answer my questions immediately"). Complaints: funds blocked by repeated bank verification problems (Oct 2026); fundraiser closed after hitting goal without explanation; mandatory-feeling tip ("never use it again"); "a $100 donation incurred about a 25% fee" (single reviewer, unverified).
**Fraud example.** NJ couple and a homeless man charged over a fabricated story raising >$400,000 [S CBS].

### 4.3 M-Changa (Kenya, mobile-money fundraising)

Fee 4.25% platform fee (3.5% reported for raising >= KES 3 M in 30 days); Visa/PayPal contributions +2.5%; withdrawals once at least KES 250 raised and verification (documents, up to three treasurers, partial withdrawals) [V mchanga homepage / S]. Fraud/trust cases [S kenyans.co.ke, techweez]: street-singers fundraiser (>KES 290,000 raised) alleged staged, philanthropist asked for refunds; 2021 "baby shower sisters" appeal: M-Changa said it failed due diligence and refunded all donors; forged anti-corruption letter used to intimidate an activist who fundraised for protest victims (2024). Lesson: multi-treasurer controls, identity verification before withdrawal, and willingness to refund are what built credibility. Direct M-Changa app-store reviews not retrievable [gap].

### 4.4 Kiva (as donation/lending hybrid)

See 3.6. Relevant for fundraising: strong repayment/relend narrative, 4.8 Trustpilot, but opaque borrower interest and auto-lend defaults generate trust damage.

### 4.5 Francophone: Leetchi, Ulule, KissKissBankBank, HelloAsso

| Platform | Fees (labels) | Trustpilot [V] |
|---|---|---|
| HelloAsso | 0% platform; funded by voluntary donor tips [S] | 4.8/5, 1,791 reviews; complaint: optional contribution easy to miss (EUR 76 charged on EUR 70 membership) https://www.trustpilot.com/review/helloasso.com |
| Leetchi | free to create; 6% at withdrawal for 100-10,000 EUR, 1.5% above (recent list) vs older 4%/2.9%/1.9% grid - conflicting [U] | 4.3/5, 52,292 reviews; complaints: identity verification rejecting documents, slow support https://www.trustpilot.com/review/leetchi.com |
| Ulule | ~8% card / 5% PayPal incl. VAT (one comparison) vs 0% platform + payment fees (another) [U] | 4.9/5, 1,268 reviews; complaint: EUR 50 reward never delivered, Ulule says "a crowdfunding platform, not an online shop" https://www.trustpilot.com/review/ulule.com |
| KissKissBankBank | ~8% (5% + 3% payment), 12% "all-inclusive" since 2024 per Senegal-focused article [U] | not fetched |

Que Choisir (Mar 2020) advice for donors: use platforms with anti-fraud teams, check Orias registration, ensure beneficiary and creator clearly identified, beware poor spelling, check fees; Leetchi said it uses automated checks, requests documents when suspicious, relies on user reports [V]. https://www.quechoisir.org/actualite-cagnottes-coronavirus-comment-eviter-les-arnaques-n77459/
**Regulation.** France: law 91-772 covers public appeals incl. crowdfunding platforms, prior declaration threshold EUR 153,000 [S]. Morocco: law 18.18 on public appeals (individual urgent collections need authorization) [S]. Madagascar: no equivalent text found [V negative].

### 4.6 Donations: Takeaways for Gereo
- Cheapest, safest first step: "special contribution campaign" inside a group = goal + deadline + wallet pot + ledger + receipts + final use-of-funds report. It reuses the contribution and vote primitives and carries low legal risk because donors are members.
- Defer open public campaigns until verification (identity of organiser, treasurer co-signing, withdrawal gating, public reporting) exists. M-Changa's multi-treasurer + due-diligence-refund pattern is the benchmark.
- Show fees as a line item up front; never default-select a tip. Provide a clear "what happens if goal not reached" rule (refund vs keep) and show it before payment.
- Funds-usage report should be a first-class, mandatory step before the next withdrawal or new campaign.
- Risk: fraudsters' favourite pattern is emotional, urgent, unverified appeals shared on social media. A public share link needs a campaign status badge (verified/unverified).

---

## 5. Cross-module summary

### 5.1 Business model comparison

| Product | Module | Primary revenue | Take rate / price (label) |
|---|---|---|---|
| Jumia | Marketplace | commissions, logistics, ads, 1P | gross profit 14.2% of GMV; ads 1.6% of GMV [V] |
| Jiji | Marketplace | premium boosts, CPC, ads | commissions none claimed in Kenya [S] |
| Takealot | Marketplace | success fee + fulfilment + subscription | 5-18%+R300-400/month [U] |
| Paystack Storefront | Marketplace | payment fee | ~1.5% local cards [U] |
| Binance Square | Social | trading fees share | 20-50% to creators [U] |
| pr.social | Marketing/tasks | advertiser spend (inferred) | rewards $0.0x-$0.50, 10% referral [V], spread unknown |
| Meta boost | Marketing | ad spend | ~$2 minimum [U] |
| Tala | Lending | facility fees | ~5-15% per 21-30 d; 109-219% APR [U] |
| Fuliza | Lending | 1% access + daily fee | KES 5-30/day by band [V] |
| Kiva | Lending/donations | partner fees (avg 2.53%) + donations | up to 8% [V] |
| GoFundMe | Donations | donor tips + processing | ~2.9% + $0.30 [U] |
| M-Changa | Donations | platform fee | 4.25% [V/S] |
| HelloAsso | Donations | voluntary tips | 0% [S] |
| Leetchi | Donations | withdrawal fee | 6% / 1.5% [U] |

### 5.2 Phasing recommendation (module value vs distraction)

1. MVP (core): groups, wallets, contributions, ledger, votes, projects. Optional low-cost add: group announcements; "special contribution" campaign inside group (donation primitive).
2. Phase 2: in-group marketplace listings with wallet escrow; extended campaigns with use-of-funds reports; communities (member-only).
3. Phase 3: public social network, discoverable campaigns, referral/commission features.
4. Phase 4 (only after legal clearance): group-internal lending with strict safeguards.
5. Last / possibly never: boosts, audience analytics, task-for-reward add-ons, creator payouts.

### 5.3 Top risks (ordered)
1. Illegal credit activity in Madagascar (Law 2020-011 art. 228-229; Law 2017-026 art. 9) if lending is systematised.
2. Unregulated or unknown fundraising law in Madagascar; AML/e-money rules on holding funds for third parties (BCM/CSBF) not researched here [gap].
3. Moderation and scam load from any open social or public marketplace (ProPublica, Jiji, FSCA findings).
4. Trust erosion through defaults and opacity (Kiva auto-lend, GoFundMe tips, Kiva rate disclosure).
5. Off-platform payment scams exploiting mobile money kiosks (La Gazette case).
6. Group-level embezzlement and social pressure (chama 13% claim, Andhra Pradesh).
7. Over-engineering for 20% internet penetration: web-first features will not reach most users; SMS cost in Madagascar uncertain.

### 5.4 Open questions and gaps
- Reddit and app-store review text for Tala, Branch, Fuliza, M-Changa, Binance Square, WhatsApp/Facebook in Madagascar: not retrievable here.
- Jumia/Jiji seller-side fee and payout complaints: not found.
- Kopo Kopo, Selar, Expat-Dakar, Kilimall current status: no usable data.
- Malagasy legal texts on public fundraising, e-money custody, AML for non-bank wallets, and the definition of "habitual" credit activity: not read.
- Verify whether Jumia, Jejoo, Tsena, Zandrony or similar services operate in Madagascar (search could not confirm any of them; confirmed existing but small classifieds: E-tady, Tonga-Soa, ZaraoO, Trouvetout.mg, Banabaana, MadaPage; scale unknown [S]).

---

## Sources

Madagascar context
- DataReportal Digital 2026 Madagascar: https://datareportal.com/reports/digital-2026-madagascar
- La Gazette de la Grande Ile, online purchase scams: https://www.lagazette-dgi.com/p-53555.html
- Midi Madagasikara, Facebook scams, gendarmerie: https://midi-madagasikara.mg/escroqueries-sur-facebook-la-gendarmerie-lance-la-traque/
- Gabon Media Time, Facebook fake-trading arrest: https://gabonmediatime.com/madagascar-un-gabonais-et-ses-complices-interpelles-pour-arnaque-sur-facebook/
- Studio Sifaka fact-check on lending with interest: https://www.studiosifaka.org/i-verify/item/9151-oui-a-madagascar-il-est-interdit-de-pratiquer-le-pret-d-argent-avec-interet-sans-agrement.html
- Law 2017-026 on Microfinance (EN translation): https://www.samifin.gov.mg/sites/default/files/2025-01/R14.C14.3.4.1%20Law%202017%20_026%20on%20Microfinance_Eng_Translated.pdf
- Law 2017-026 (FR): https://www.assemblee-nationale.mg/wp-content/uploads/2020/10/Loi-n%C2%B02017-026-Microfinance.pdf
- Banky Foiben'i Madagasikara regulatory texts: https://www.banky-foibe.mg/texte-reglementaire
- MVola money transfer: https://www.mvola.mg/transfert-dargent/
- Axian Telecom (MVola history): https://en.wikipedia.org/wiki/Axian_Telecom
- Madagascar classifieds (E-tady, Tonga-Soa, ZaraoO, Trouvetout, etc.): https://www.tonga-soa.com/ , https://zaraoo.com/ , https://www.trouvetout.mg/ , https://madapage.com/ , https://www.banabaana.com/pays-217-Madagascar
- Madagascar e-commerce guide (payment methods, Facebook groups) [U]: https://www.dizitalizeo.com/developpement-de-site-e-commerce-a-madagascar-le-guide-complet-pour-vendre-en-ligne-en-2026/ (403 on fetch, summary via search)
- Madagascar SMS pricing (conflicting) [U]: https://sent.dm/resources/madagascar-sms-pricing

Marketplace
- Jumia Q2 2026 release: https://investor.jumia.com/news/news-details/2026/Jumia-Reports-Second-Quarter-2026-Results-and-Announces-Capital-Raise/default.aspx
- Jumia (Wikipedia): https://en.wikipedia.org/wiki/Jumia
- Jumia Algeria exit coverage: https://www.ecofinagency.com/news-finances/1202-52854-jumia-pulls-out-of-algeria-sets-sights-on-2027-profit
- Jumia Kenya Trustpilot: https://uk.trustpilot.com/review/jumia.co.ke
- Jumia Nigeria Trustpilot: https://www.trustpilot.com/review/jumia.com.ng
- Jumia seller fee context (Egypt page): https://sell.jumia.com/?p=138
- Nigeria commission estimates [U]: https://kolonell.com/en/blog/selling-jumia-jiji-vs-own-store-margins-2026
- Jiji Techcabal profile: https://techcabal.com/2024/11/21/how-jiji-became-one-of-nigerias-e-commerce-leaders/
- Jiji Nigeria Trustpilot: https://www.trustpilot.com/review/jiji.ng
- Jiji Ethiopia premium services: https://africa.com/headlines/jiji-launches-premium-services-in-ethiopia-pledges-to-boost-sme-growth
- Jiji Business Daily (Kenya security): https://www.businessdailyafrica.com/bd/corporate/technology/e-commerce-platform-jiji-beefs-up-cyber-security-3210998
- CoinAfrique funding: https://vc4a.com/blog/2018/04/13/coinafrique-raises-e-2-5-million-and-boosts-its-development-in-french-speaking-africa/
- Takealot fulfilment fee update: https://help.takealot.com/hc/en-us/articles/26151010109596-Important-Update-Fulfilment-Fee-Adjustment-Effective-01-April-2026
- Kilimall Uganda exit: https://kenyanwallstreet.com/kilimall-exits-uganda-possible-partnership-to-revive-the-business-hits-a-snag
- Bumpa vs Paystack Storefront: https://www.getbumpa.com/blog/bumpa-vs-paystack-storefront-which-is-right-for-your-business
- WhatsApp Business 200 M MAU: https://www.africa-press.net/angola/all-news/whatsapp-business-exceeds-200-million-monthly-users
- WhatsApp catalog Africa: https://techpoint.africa/insight/whatsapp-business-catalog/
- ProPublica on Facebook Marketplace: https://www.propublica.org/article/facebook-grew-marketplace-to-1-billion-users-now-scammers-are-using-it-to-target-people-around-the-world

Social / Marketing
- pr.social home: https://pr.social/
- pr.social how to earn guide: https://pr.social/guides/how-to-earn
- pr.social terms: https://pr.social/terms
- pr.social Trustpilot: https://www.trustpilot.com/review/pr.social
- Binance Square scale/programs: https://www.financemagnates.com/cryptocurrency/binance-launches-live-trading-on-binance-square-for-real-time-crypto-deals/ , https://mpost.io/creatorpad-launches-on-binance-square-to-transform-crypto-content-creation-and-engagement/
- Binance Square Write to Earn (community post) [U]: https://www.binance.com/en/square/hashtag/write2earrn
- Telegram scam groups in South Africa: https://develop.dailymaverick.co.za/article/2024-07-07-fraudsters-use-telegram-app-to-offer-bogus-investment-opportunities
- Facebook/Telegram crypto airdrop groups study: https://spir.aoir.org/ojs/index.php/spir/article/view/13503
- Boost post (Metricool help) [U]: https://help.metricool.com/how-to-boost-your-posts-fr90h
- Africa's Talking: https://help.africastalking.com/

Lending
- Tala (Wikipedia): https://en.wikipedia.org/wiki/Tala_Finance
- Tala Kenya review (paybillke) [U]: https://paybillke.com/guides/tala-kenya-review-2026
- Tala layoffs (Techcabal, 403, snippet only): https://techcabal.com/2025/04/16/tala-layoffs-kenya/
- Tala self-set repayment dates: https://khusoko.com/2022/02/09/tala-allows-borrowers-choose-when-to-repay-loan/
- Branch Trustpilot: https://www.trustpilot.com/review/branch.co
- Safaricom Fuliza/M-Shwari numbers (Business Daily): https://www.businessdailyafrica.com/bd/markets/kenyans-borrow-sh629bn-from-fuliza-as-digital-overdraft-gains-5256022
- Fuliza deductions complaint [U]: https://streamlinefeed.co.ke/news/safaricom-issues-explanations-unprompted-mpesa-fuliza-deductions-customer-outrage
- Kenya debt-shaming (Business Daily, Jun 2025): https://www.businessdailyafrica.com/bd/economy/debt-shaming-back-as-digital-lenders-defy-cbk-5094888
- Kenya DCP rules overview: https://globallawexperts.com/kenyas-licensed-digital-lenders/
- Nigeria loan-app injunction (Ecofin): https://www.ecofinagency.com/news/1704-54772-loan-apps-in-nigeria-a-court-freezes-regulators-reform-exposes-a-jurisdictional-war-paralysing-fintech-regulation
- Nigeria approved/delisted lenders (WeeTracker): https://weetracker.com/2025/10/23/approved-loan-apps-nigeria/
- Tanzania loan-app harassment: https://www.thecitizen.co.tz/tanzania/business/public-outcry-as-unregulated-online-loan-apps-continue-to-harass-borrowers-5235562
- FairMoney 2025 disbursement: https://www.vanguardngr.com/2026/01/fairmoney-records-n150bn-loan-disbursement-pays-n7bn-interest-to-savers/
- FairMoney PoS lending: https://techcabal.com/2026/07/23/for-fairmoney-every-pos-terminal-is-a-lending-opportunity/
- Carbon: https://brands.ng/companies/carbon-nigeria-onefi/
- Lendahand: https://agritechobservatory.review.fao.org/zh/lendahand
- Kiva (MIT Technology Review): https://www.technologyreview.com/2023/08/14/1077351/microfinance-money-making/
- Kiva responds to Sinclair critique: https://nextbillion.net/kiva-responds/
- Kiva Trustpilot: https://www.trustpilot.com/review/kiva.org
- Andhra Pradesh crisis (CGAP): https://cgap.org/node/1885
- Project Syndicate on microfinance crisis: https://www.project-syndicate.org/commentary/the-crisis-of-microfinance
- IPA VSLA digitisation evidence: https://poverty-action.org/expanding-financial-access-through-digital-finance-evidence-village-savings-and-loans-associations
- Pixelcharmer field notes on friction in VSLA ledgers: https://www.pixelcharmer.com/fieldnotes/2017/friction/
- Chama failure and theft (Money254) [U]: https://www.money254.co.ke/post/chama-revolution-what-successful-chamas-know-do-why-many-fail
- Chama misappropriation case: https://nairobinews.nation.africa/facebook-mums-expose-colleague-over-misappropriation-of-chama-funds/

Donations
- GoFundMe Trustpilot: https://www.trustpilot.com/review/gofundme.com
- NY AG letter to GoFundMe: https://ag.ny.gov/press-release/2026/attorney-general-james-demands-transparency-gofundme-unauthorized-fundraising
- GoFundMe fee transparency critique: https://nonprofitnewsfeed.com/news/gofundme-needs-to-be-more-transparent-with-donors-about-transaction-fees/
- M-Changa: https://www.mchanga.africa/questions/
- M-Changa case (case study): https://sibelkusimba.com/wp-content/uploads/2019/10/m-changa.2019.pdf
- M-Changa refund of staged appeal: https://techweez.com/2021/11/16/mchanga-refund-shirleen-mukami-scam/
- Street boys fundraiser fraud claim: https://www.kenyans.co.ke/news/37822-singing-street-boys-turn-conmen-after-ksh493k-fundraiser
- Leetchi Trustpilot: https://www.trustpilot.com/review/leetchi.com
- Ulule Trustpilot: https://www.trustpilot.com/review/ulule.com
- HelloAsso Trustpilot: https://www.trustpilot.com/review/helloasso.com
- Que Choisir on cagnotte scams: https://www.quechoisir.org/actualite-cagnottes-coronavirus-comment-eviter-les-arnaques-n77459/
- French crowdfunding fee comparison (GoFundMe FR blog, vendor) [U]: https://www.gofundme.com/fr-fr/c/blog/fundraising-site-lowest-fees
- Morocco AGP law 18.18: https://lematin.ma/express/2023/loi-relative-aux-appels-generosite-publique-entre-vigueur/385656.html
- France AGP guide: https://www.centre-francais-fondations.org/wp-content/uploads/2024/11/guide_agp_maj-2.pdf
