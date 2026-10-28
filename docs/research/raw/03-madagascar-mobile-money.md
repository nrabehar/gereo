# 03 - Madagascar mobile money, fintech ecosystem and regional peers

Research date: 2026-10-19. Scope: Madagascar mobile-money and fintech ecosystem, regulation/KYC/tax, and regional peers.

## 0. How to read this report

Confidence labels used throughout:

- **[P]** primary or near-primary: operator tariff page, law text, central bank/regulator, company financial filing, App Store page fetched directly.
- **[S]** secondary: reputable press, NGO/IFC/World Bank/DataReportal.
- **[C]** company claim: self-reported by the company (marketing, interview). Not independently verified.
- **[U]** unverified, low-quality or contradictory source. Do not rely on it.

Limits of this research (be explicit):

- The WebSearch budget for the session was exhausted before all planned queries ran. Not researched in depth: Free Money, Flutterwave/Paystack-style wallets, Seychelles, Reunion, BOA/BNI/AccessBank/OMNIS apps, Jirama's own payment channel, local crowdfunding apps, Orange Money / Airtel Money developer API terms. These are listed as gaps in section 9.
- Google Play review pages could not be rendered by the fetch tool. Review evidence comes from Apple App Store pages (fetched directly), search-result summaries of Google Play, and press.

---

## 1. Market overview (Madagascar)

### 1.1 Macro and connectivity

| Metric | Value | Source / confidence |
|---|---|---|
| Population | 32.9 million (Oct 2025), 57.9% rural, median age 19.2 | DataReportal Digital 2026 [S] |
| Internet users | 6.71 million, 20.4% penetration (end 2025) | DataReportal Digital 2026 [S] |
| Cellular mobile connections | 21.8 million = 66.2% of population (+11.1% YoY); 76.3% are 3G/4G/5G-capable (not a proxy for mobile internet use) | DataReportal Digital 2026 [S] |
| Social media user identities | 4.15 million (12.6% of population) | DataReportal Digital 2026 [S] |
| Adults with a personal mobile phone (2024) | 45.8% (women 42.4%, poorest 40% 31.5%) | World Bank Global Findex 2025, Little Data Book country table [P] |
| Adults with a personal smartphone (2024) | 8.9% (women 8.2%, poorest 40% 2.9%) vs 32.9% Sub-Saharan Africa average | Global Findex 2025 [P]; values mapped from a PDF table extraction, re-verify against the PDF before quoting |
| Mobile data cost | ITU: mobile internet = 6.28% of GNI per capita (2023). Press reports average mobile internet tariffs fell about 55% between Dec 2025 and Feb 2026 | ITU figure via search summary [S]; the 55% figure is from an L'Express Madagascar article seen only in a search summary [U] |
| $100 smartphone | about 20% of annual GNI per capita (World Bank figure quoted in a search summary) | [S/U] |

Warnings: a Fintech Times article claims about 75% mobile penetration and about 40% internet penetration; these contradict DataReportal and Findex and should be ignored [U]. The regulator ARTEC quotes 32.57% internet penetration for 2023 (different methodology) [S].

Interpretation for product design: roughly 9 in 100 adults have a smartphone. The addressable base for an app-only product is small; USSD, SMS and feature-phone flows are the mass-market channel.

### 1.2 Financial inclusion (Global Findex 2025, data collected 2024) [P]

Source: World Bank Little Data Book on Financial Inclusion 2025, Madagascar page (survey excluded unsafe/unreachable regions, about 17% of population).

| Indicator (adults 15+) | Madagascar 2024 | Sub-Saharan Africa avg |
|---|---|---|
| Any account | 24.5% (26.3% in 2021, 5.5% in 2011) | 58.2% |
| Bank or similar account | 9.5% | 37.8% |
| Mobile money account | 19.4% | 40.0% |
| Women with account / poorest 40% / rural | 20.3% / 14.1% / 22.2% | - |
| Made or received digital payments in past year | 21.7% (23.9% in 2021, i.e. down) | 50.6% |
| Made a digital merchant payment | 2.4% (5.7% in 2021, i.e. down) | 19.5% |
| Paid a bill online | 3.1% | 15.6% |
| Saved formally using an account | 11.1% (11.5% in 2021) | 34.7% |
| Saved informally via a savings club or person outside the family | 4.9% | 28.1% |

Notes:

- Account ownership is lower than one might infer from "10 million mobile money accounts". Registered accounts include duplicates and dormant accounts.
- Digital merchant payments fell between 2021 and 2024. Mobile money is mostly person-to-person and cash-in/cash-out, not retail payment.
- Informal savings club use in Madagascar (4.9%) is far below the regional average (28.1%) in Findex. This is a single survey indicator and its wording ("savings club or a person outside the family") may not capture local forms (fokonolona contributions, sosiety, tontines among relatives). Treat as a prompt to validate demand via primary research [S, interpretation].

### 1.3 Mobile money size: accounts, active users, volumes

The numbers conflict widely. Figures must always be quoted with their source and definition.

| Claim | Value | Source / confidence |
|---|---|---|
| Registered mobile money accounts per 1,000 adults | 2019: 623; 2022: 864; 2023: 1,077; 2024: 1,250 (more than one account per adult; registered, not active) | IMF Financial Access Survey via FRED series MDGFCMARANUM [S] |
| Accounts created / active, all operators | more than 10 million created, about 4.55 million active | Coordination nationale de la Finance Inclusive (CNFI), quoted by L'Express, Nov 2025 [S] |
| Active mobile money users, market-wide | "about 6 to 7 million" for a population of about 30 million; goal of doubling or tripling in 5-10 years | MVola CEO interview, L'Express via AllAfrica, 3 Aug 2026 [C] |
| MVola active accounts | "more than 15 million" claimed; MVola says it has 50,000 Cash Points and 10,000 partner merchants | NewsMada, May 2025 [C]. Contradicted by the CNFI figure above (4.55 million active across all operators) and by MVola's own B2B catalogue (Nov 2025: "more than 25,000" cash points) |
| MVola users (older) | 3.6 million users, about 14% of population | Mobile World Live [C], undated |
| Orange Money Madagascar | "nearly 4 million customers" and 30,000 cash points (Jan 2024); "2 million customers, 10,000 agents" (IFC 2021) | Orange Madagascar press release via APO Group [C]; IFC [S] |
| Airtel Madagascar (whole operator) | about 4.9-5 million mobile subscribers, about 7% share; no Airtel Money-specific count found | Search summaries of Airtel statements [S/U] |
| Transaction volume | 342 million transactions worth Ar 38,161 billion (vs 211 million two years earlier) per a Nov 2024 analysis cited by press | Press summary [S]; underlying source (probably BFM statistics) not verified |
| Value 2016 to 2020 | mobile money value more than doubled to USD 639 million | IFC 2023 story [S] |
| Mobile money agents distributing | 164,000 distribution agents in the ecosystem, about 1 million people livelihood-linked | Operators' statement against the tax, Nov 2024 [C] |

Realistic reading: there are on the order of 4.5 to 7 million active mobile-money users in a population of about 33 million (about 45% of adults have a personal phone, 19% have a mobile money account per Findex). Do not size the market from "15 million active accounts".

### 1.4 Market structure

- Three licensed operators: MVola (Telma, now Yas Madagascar, Axian group), Orange Money (Orange Madagascar), Airtel Money (Airtel Madagascar). Plus Paositra Money (post office; CSBF approval 3 Sep 2023 as microfinance institution and e-money issuer) [S].
- Interoperability exists: since Jan 2024, Orange Money accounts can be opened regardless of the SIM operator (Orange, Telma "yellow" or Airtel "red") [C/S]. P2P transfers between MVola, Orange Money and Airtel Money are possible, routed by number prefix, but cross-network transfers cost much more than same-network transfers (see MVola tariff below) [P].
- Telma rebranded to **Yas** on 26 Nov 2024. MVola kept its name [S].
- Fintech ecosystem is telecom-led and bank-supported; about 20 fintech/digital financial providers, mostly payments [S, Fintech Times, low authority].

---

## 2. Per-product sections: Madagascar mobile money operators

### 2.1 MVola (Telma / Yas, Axian Telecom)

**Profile**
- Launched 2010 (Wikipedia/press; "16 years" per the CEO in Aug 2026) [S]. First and largest service by most accounts. Received a banking licence in 2021 (CEO refers to "its banking license"; third-party sources say 2021) [S/C].
- New CEO Alexandre Castel (appointed 2026) says priority one is to "renforcer la confiance de nos clients" [C].
- Claimed scale: 15 million active accounts, 50,000 Cash Points [C]; disputed (see 1.3).
- MVola's own 2023 impact review: 79% of surveyed users were unbanked before getting MVola; 4 in 5 women surveyed say Avance and Epargne make them more financially independent [C].
- Axian fintech arms elsewhere are being rebranded "Mixx by Yas" (Senegal, Togo, Tanzania) [S].

**Features** (MVola tariff page, MVola B2B catalogue Nov 2025, MVola terms) [P]
- P2P transfers, cash-in free, cash-out at Cash Points, QR payments, airtime/bundles, bill payments (JIRAMA, Yas, Canal+, insurers, DGI tax portal, OSTIE/CNAPS).
- MVola Epargne: savings at 8% annual (page) paid quarterly, max balance Ar 100,000,000; note the 2023 review and a 2025 catalogue mention 4% and the aggregator listing says 4%, so the rate has changed or varies by product (confirm) [P/S].
- MVola Avance (nano-credit 30 days, 8-12% per page, up to Ar 4,000,000), Fameno (7 days, up to Ar 1,000,000), Avance Mikasa (90 days, up to Ar 3,000,000). CEO says Avance is used by "several hundred thousand people" [P/C].
- Visa card, wallet-to-bank (free with BNI, about 1% to other banks), Western Union receiving (an App Store reviewer says it stopped working).
- B2B: in-store terminal, "e-commerce button", dedicated USSD bill menu (e.g. `#111*1*5*5#`), batch salary payouts from Excel, linked accounts, double-signature, cash-transfer logistics to remote areas (M-Agri), "Selfcare" web portal [P].
- **MVola Developer** portal (developer.mvola.mg): apps, sandbox, token generation, "Merchant Pay" API; GSMA Mobile Money API certified (Sept 2023: International transfers and Person-to-person) [P/C]. Community SDK notes (unofficial): sandbox host devapi.mvola.mg, production api.mvola.mg, tokens last 3,600 s, `x_callback_url` for webhook, only two test numbers 0343500003 / 0343500004 in sandbox [U, third-party SDK READMEs].

**Fees (official tariff effective 17 Feb 2025, TTC)** [P: https://mvola.mg/tarifs/]
- Deposit: free. Account opening: free.
- P2P to MVola subscriber: Ar 70 (100-5,000), 150 (5,001-10,000), 250 (10,001-25,000), 500 (25,001-50,000), 1,000 (50,001-100,000), 1,900 (100,001-500,000), 3,200 (500,001-1M), up to 31,300 at 19-20M.
- P2P to/from another mobile money operator: Ar 200-250 (up to 5,000), 500 (5,001-10,000), 1,000 (10,001-25,000), 1,500 (25,001-50,000), 2,000 (50,001-100,000), 3,500 (100,001-250,000), 5,000 (250,001-500,000), 8,500 (500,001-1M).
- To a non-subscriber (coupon): Ar 750 (100-5,000), 1,400 (5,001-10,000), 1,800, 3,800, 4,800 (50,001-100,000), 10,000 (100,001-250,000).
- Cash-out at Cash Point: Ar 100-150 (to 5,000), 275, 550, 650, 1,300 (25,001-50,000), 1,900 (50,001-100,000), 3,400 (100,001-250,000), 4,700 (250,001-500,000).
- Merchant purchases: 0 for the customer; merchant bears 1%.
- Enterprise-account transfers are cheaper than individual (e.g. Ar 800 for 50,001-100,000).
- Inactivity: Ar 2,000/month after 6 months, 4,000 after 12, 6,000 after 18. Adjustment request (disputed/incorrect transfer): 5% of amount, minimum Ar 10,000, claim window 7 days. SIM swap Ar 1,000. Customer service 807 costs Ar 200/call.
- Limits (individual): transfer min 100, max Ar 20,000,000; **max balance Ar 20,000,000**; daily cumulative 20,000,000; monthly cumulative 620,000,000. Enterprise: transfer max Ar 100,000,000. Terms text lists lower caps in some partner-product contexts (Grand Public Ar 10,000,000 per transaction under PAMF/Baobab terms; merchant and enterprise Ar 100,000,000) [P]. The Ar 100M figure matches the enterprise/merchant ceiling.

**Terms that matter for a custodial product** (MVola general terms) [P]
- Only adults resident in Madagascar; CIN, passport or other accepted ID plus a Yas phone number; one MVola account per SIM.
- MVola can suspend/close accounts without notice (suspected fraud, lost SIM); balance is then paid only on presenting ID, and refund claims are in person at a Yas shop.
- Transfers are irrevocable once validated with the PIN. Liability is "obligation of means"; MVola not liable unless negligence proven.
- Disputes go to Antananarivo commercial courts.

**Strengths**
- Largest agent/Cash Point footprint, strongest brand and widest merchant ecosystem; cheapest same-network P2P (Ar 70 for small amounts).
- Real, certified developer APIs; B2B tooling for payouts and collections.
- Integrated savings and credit products that users do adopt.

**Weaknesses and user complaints**
- App Store Madagascar listing: 4.3 / 5 from about 5k ratings. Representative reviews (App Store, fetched 2026-10-19): "After updating, bank to mvola doesn't work" (15/11/2023); "The apps still crashing on start" (17/12/2024); "The app lags and freezes when trying to write the recipient's name"; "After update, lot of options doesn't work!"; "The update UI is disaster and worse than before"; "Mostly network issue, otherwise application issue" (13/11/2025); one Malagasy review praises ease of use but notes fees are sometimes high; another says the Western Union receiving feature "stopped working a long time ago". No developer replies visible. Source: https://apps.apple.com/mg/app/mvola/id1496566692 [P]
- Outage of Nov 2025: serious disruptions from 10 Nov, apps unreachable, many transactions failing; MVola blamed the global Cloudflare outage; the minister for digital development made an unannounced visit to MVola headquarters and demanded a full report; a permanent supervision framework with regular audits and continuity plans was announced. Source: https://www.lexpress.mg/2025/11/mobile-money-controle-inopine-chez-mvola.html [S]
- May-June 2026 incidents: the CEO acknowledges "technical problems" affecting access and sometimes balance display after a May platform migration; says "l'argent ne disparait pas des comptes" and incidents have "fortement diminue". Source: https://fr.allafrica.com/stories/202608030688.html (L'Express, 3 Aug 2026) [C]. A user-report page (totalbug) lists unverified, undated user posts: a code request unanswered for about a month, a bank transfer debited but not credited to MVola, a bank top-up option gone on iPhone. Source: https://www.totalbug.com/mvola/ [U]
- Cross-network transfers cost 3x to 10x same-network transfers.

### 2.2 Orange Money Madagascar

**Profile**
- Launched in Madagascar 2011 (Wikipedia: group service started Dec 2008 in Cote d'Ivoire; Madagascar 2011) [S]. Press release says "13 years" active in Jan 2024.
- Jan 2024: nearly 4 million customers, 30,000 cash points; account self-opening in about 5 minutes on a smartphone using ID photo and selfie, immediate basic account then full account after secondary checks; open to subscribers of any operator; referral and 50% discount on transfers to Orange Money accounts [C]. Source: https://www.africa-newsroom.com/press/orange-money-desormais-disponible-pour-tous-a-madagascar-quel-que-soit-loperateur?lang=fr
- Group-level (not Madagascar): Orange Money 53 million monthly active users as of 31 Aug 2026 and more than EUR 200 billion transactions in 2025 [C]; Max it super-app about 23-25 million users in 16 countries [C].
- PAMF microfinance savings/credit via Orange Money since 2018, extended to Facebook Messenger in 2021 [S].

**Features**: deposits, cash-out, P2P to any operator, bill payment, online and in-store payment, salary, international receipt; apps "Orange Money Afrique" (onboarding) and "Orange Max it - Madagascar" [C].

**Fees** (aggregator sites, not primary; verify) [U]: send Ar 100 (to 5,000), 300 (5,001-25,000), 700 (25,001-100,000), 1,600 (100,001-500,000); cash-out Ar 200 (1,001-5,000), 350, 700, 2,000 (25,001-100,000), 5,000 (100,001-500,000). Same table given for Airtel. Per-operation cap Ar 20 million. Aggregator itself says Orange and Airtel do not publish readable tariffs. Source: https://momocalc.com/madagascar/orange-fees

**Strengths**: large cash-point network, self-onboarding, savings/credit via partners.

**Weaknesses and user complaints** (App Store Madagascar, 3.1 / 5 from about 76 ratings; Google Play about 3.4 from about 1.5K per search summary) [P/S]
- Money debited but service not delivered: "j'ai pas recu le credit et l'argent etait bien soutire de mon compte" (20/09/2025); "l'argent est retire mais l'achat n'est pas realise" (three times, 20/09/2025); "mon solde a ete debite, mais le forfait n'a pas ete active" (14 Feb).
- Login/OTP failure: "l'application dit que vais recevoir un sms, en vain!" (26 Feb).
- Slow/crashing: "Ca rame, ca plante, ca replante" and cannot pay Orange bills (7 Aug); "Rien ne marche dans l'appli" (07/12/2025).
- A reviewer alleges Ar 160,000 deducted without a deposit (26 Aug); the developer reply routes to customer service 204.
- iOS gaps: contacts/manual number entry problems, Touch ID mentioned but not enableable.
- Orange replies uniformly say "temporary technical issue" and refer to 204 / 3900 / orange.mg, with no resolution path in-app.
- Source: https://apps.apple.com/mg/app/orange-max-it-madagascar/id1295171817?see-all=reviews&platform=iphone

### 2.3 Airtel Money Madagascar

**Profile**: third operator; Airtel Madagascar has about 5 million subscribers and about 7% market share (whole telecom operator) [S/U]. No Airtel Money user or agent number found. Interoperability with MVola/Orange via number-prefix routing [S]. Airtel Money available at post offices (older) [S]. Xsolla added Airtel Money Madagascar to its payment coverage in Dec 2025 (app or USSD) [S].
**Features/rules** (Airtel terms as summarised by an aggregator [U]): 18+, Malagasy ID or passport/residence card, up to 5 Airtel Money accounts per person, 5-year data retention; Airtel Money menu `*436#`. Fees reportedly same table as Orange [U]. Production API access requires KYC documents (developers.airtel.africa) per a third-party README [U].
**User feedback**: none found in the research window. Gap.

### 2.4 Paositra Money and others

- Paositra Malagasy launched Paositra Money in 2019 with Senegalese firm Numherit; CSBF approval on 3 Sep 2023 as MFI and e-money issuer; a Nov 2025 article describes relaunch of E-Manda and Paositra Money mobile services; no user number [S]. Sources: https://newsmada.com/?p=86294 , https://www.lexpress.mg/2025/11/telecommunications-paositra-malagasy-se.html
- BNI Madagascar KRED (since 2019): online MSME loans up to USD 1,200, more than 25,000 credit lines in three years [S, IFC]. Baobab+ pay-as-you-go solar to more than 100,000 households [S, IFC].
- Bank/microfinance apps (BOA, BNI, BMOI, AccessBanque, OTIV, CECAM, Vola Mahasoa): not researched in depth (gap).
- **Tontine/association/crowdfunding apps for Madagascar**: none found. Search returned only generic or other-country products (My Tontine lists Congo, Cameroon, Cote d'Ivoire, Senegal, Gabon, DRC and MTN/Airtel/Orange/Yas; Tonti; a GitHub demo). Suggests a real gap, but also may reflect poor indexing of local Facebook-based groups. Needs primary field research.

### 2.5 eAriary (central bank digital currency project)

- BFM (Banky Foiben'i Madagasikara, which the founder and some sources call BCM) began an experimental phase on about 23 May 2025. Retail CBDC; BFM sole issuer; distribution via e-money issuers, banks and MFIs; mobile app and USSD planned; offline usage under study. BFM's own page indicates a pilot in certain areas from Nov 2026 (earlier press release said Oct 2025, so the schedule slipped) [S]. Technology: eCurrency Mint with PayLogic.
- BFM governor example: a Ar 200,000 transfer costing Ar 2,000 today; eAriary aims to cut such fees, support QR payments, programmable/mass payments, and instant account opening by a recipient with no account [S]. Source: https://www.2424.mg/transaction-financiere-tout-savoir-sur-leariary-la-monnaie-numerique-officielle-en-projet-de-la-banky-foibeni-madagasikara/
- Relevance to Gereo: a future low-cost rail and a possible distributor role for fintechs; not a 2026-27 dependency. Status of the Nov 2026 pilot not confirmed.

---

## 3. Payment aggregator (the rail behind the adapter)

No aggregator is selected. Gereo reaches the operators through a payment adapter, so the rail can be replaced. Section 3.4 lists alternatives.

### 3.1 What is publicly known

Nothing in this file assumes a named aggregator.

### 3.2 What is typically not public (confirm with the chosen aggregator before design freeze)

Aggregators rarely publish: REST API documentation, authentication method, sandbox, webhook/callback format and retry/signature rules, settlement schedule for mobile money (D+0 / D+1 / D+2), per-operator fee pass-through, payout (disbursement) API, refunds/reversals, per-transaction/daily limits per operator, uptime SLA, fraud/chargeback rules, merchant KYC requirements, exclusivity terms, or the basis of the 100,000,000 Ar ceiling. All of these must be asked in writing of whichever aggregator is chosen.

### 3.3 Integration-constraint hypotheses to test (not facts)

1. Inbound (collect) flows probably mirror the operators' merchant APIs: customer enters phone number, receives a USSD/app push to approve with PIN, aggregator gets an async callback. Direct operator APIs behave this way (MVola Merchant Pay: initiate, details, status; callback URL; GSMA-certified) [P/U]. Expect async states (pending, timeout) that Gereo must reconcile.
2. Outbound (payout/withdrawal) APIs are often a separate, more restricted product and may need extra approval and a pre-funded float. Ask whether the aggregator can disburse to arbitrary MVola/Orange/Airtel numbers programmatically and at what cost, since MVola charges the sender Ar 200-24,000 for cross-network P2P.
3. Operator-side limits still apply under the aggregator: MVola individual max balance and per-transaction cap is Ar 20,000,000 while enterprise is Ar 100,000,000, so a payout above 20M Ar to a personal MVola wallet may fail even if the aggregator's own ceiling is 100M.
4. Aggregator sits in a regulatory grey zone (see section 5): where the funds sit (operator wallets or an aggregator merchant account) and who holds them determines Gereo's own exposure.

### 3.4 Partner risks

- **Concentration/single point of failure**: a small aggregator is a single point of failure. Ask for financials, insurance, bank partners, and contractual exit/data portability.
- **Competitive overlap**: an aggregator with its own consumer wallet app could compete with a Gereo wallet; check non-compete/exclusivity and data-sharing terms.
- **Operator risk passes through**: MVola outages (Nov 2025, May-June 2026) mean aggregator calls fail too. Design for retries, idempotency and manual reconciliation.
- **Alternatives to benchmark**: Papi.mg (https://papi.mg/) markets one REST API/key for MVola, Orange Money, Airtel Money and Visa, HMAC-SHA256 signed notifications, idempotent link creation, sandbox, WordPress plugin; claims about 400 shops and about 6,000 transactions processed; fees not published [C]. Direct operator integrations (MVola Developer, Orange Developer "Orange Money Web Payment", Airtel developers portal) exist per community SDKs; Airtel production requires KYC docs [U]. A GitHub reference project (PaidMada) shows the callback/credential shape of all three [U].

---

## 4. Other ecosystem players and signals

- **Xsolla** (Dec 2025): integrated MVola ("instant card-free payments", real-time verification) and expanded Airtel Money coverage to Madagascar: international platforms now treat Malagasy mobile money as a normal rail [S].
- **mfs africa / MVola** (2023): remittance partnerships; MVola is GSMA API certified. International remittances enter via Western Union, Thunes, MFS Africa [S/C].
- **Cross-border within the Indian Ocean**: MVola Comoros-Madagascar bridge exists; Holo (Comoros) launched Holo-to-Orange Money Madagascar transfers in March 2020, one direction only because the Madagascar central bank did not allow flows from Madagascar to Comoros at the time [P: BDC white paper footnote 32]. Important for the "other markets" ambition: outbound flows are FX-controlled.
- **Government use**: digital payments for teacher salaries, scholarships, tax collection; the DGI tax portal and SIGRNF accept MVola [S/P].

---

## 5. Regulation, KYC and tax

### 5.1 Legal framework [P: Law No. 2016-056 on electronic money, promulgated 2 Feb 2017]

Read directly from the law PDF (https://textes.lexxika.com/wp-content/uploads/2024/05/Loi-2016-056-02-Fevrier-2016-Sur-la-Monnaie-Electronique-et-les-Etablissements-de-Monnaie-Electronique.pdf):

- Supervisor: the CSBF (Commission de Supervision Bancaire et Financiere), attached to the central bank. Issuers need a CSBF **agrement** (Arts. 11, 40-44).
- E-money = monetary value stored on a medium, issued against cash, redeemable at par, one unit = one ariary, a claim on the issuer (Art. 3).
- "Management" operations (cash-in, cash-out, transfer, storage) may only be offered by an e-money institution, a credit institution, or a distribution **agent acting under a mandate contract** with an e-money institution (Arts. 9, 16, 30). Doing so without that status is a criminal offence (Art. 16 refers to penalties in Arts. 117-118). Using names/ads that suggest approval is also prohibited.
- E-money institutions cannot take deposits in the banking sense, grant credit, pay or charge interest on e-money, or advertise e-money as savings (Art. 17). Credit/savings products must come from licensed credit institutions or MFIs; the e-money institution may advertise them after CSBF authorisation. This explains why MVola Epargne/Avance run through bank/MFI partners (PAMF, Baobab in MVola's terms).
- HQ must be in Madagascar (Art. 25); minimum paid-in capital set by decree on CSBF proposal (Art. 26).
- Customer funds go into a "compte global" held at several territorial banks, kept separate, cannot be used by the issuer and cannot be seized by the issuer's creditors; e-money issued per day cannot exceed the account balance (Arts. 79-80). On licence withdrawal users have three months to prove their claim (Art. 81, Art. 22).
- Data/AML: AML/CFT programme and agent compliance (Art. 49), transactions subject to legal limits (Art. 50), identity and transaction records kept at least five years (Art. 53).
- The implementing CSBF instructions (KYC tiers, caps, agent criteria) were not found; the law refers to them. These are the key documents to obtain.

**Implication for Gereo's "client funds in wallets" model**: holding client balances and offering wallet functions to individuals and groups is the core of e-money "management". Gereo must (a) be or partner with a CSBF-licensed e-money institution/credit institution and operate as its mandated distribution agent, or (b) design the "wallet" as a non-custodial ledger of claims against the licensed partner's wallet, or (c) obtain its own e-money licence (Madagascar HQ, capital, compte global). Group "savings" with interest, lending among members, or pooled funds that look like deposits (Art. 17, 15) raise the highest risk.

### 5.2 KYC practice

- Operators: ID required (CIN, passport or accepted ID), adult resident, one account per SIM (MVola); Airtel: ID, up to 5 accounts [P/U]. Orange: self-onboarding with ID photo and selfie, basic then full account after secondary checks [C].
- SIM registration requirements exist; older sources describe suspension of unidentified lines; no current ARTEC text found [U].
- Operator tiers/limits per KYC level are not published by official pages found; third-party mentions of lower caps for level-1 accounts are unconfirmed [U].
- Comparator: Comoros' Holo uses simplified BCC-authorised KYC; at launch it had no requirements, which led to dormant, non-transacting accounts; it later required a minimum opening balance [P, BDC white paper].

### 5.3 Tax on mobile money (TTM)

- Announced by DGI on 14 Nov 2024 in the 2025 finance bill: 0.5% on domestic and international transfers above Ar 150,000; transfers between a user's own accounts and amounts under 150,000 exempt; expected extra revenue Ar 143 billion in 2025; declared monthly [S].
- All three operators publicly opposed it, saying fees could rise 2-5x for transfers and 2-10x for merchant payments and that 164,000 agents' livelihoods were at risk [C/S].
- The Finance Ministry says the 2025 finance law was adopted on 29-30 Nov 2024 and presents the tax among its main reforms; a May 2025 article treats it as part of the 2025 finance law [S]. A low-authority aggregator says no public source confirms actual application and operators show no separate tax line in 2026 tariffs; a variant on fees (about 5%) was mentioned in early 2026 [U]. **Status: unresolved. Verify with DGI/Journal Officiel.** Design the product so a per-transaction tax or fee line can be added without a schema change; remember that splitting contributions below Ar 150,000 may become a user behaviour.

---

## 6. Regional peers: what works, what failed

### 6.1 Wave (Senegal, Cote d'Ivoire and others)

- **Profile**: launched Senegal 2018, Cote d'Ivoire 2019 per Rest of World (April 2021 per other sources; sources disagree), BCEAO licence by April 2022; USD 200M Series A in 2021 at USD 1.7B valuation; cut about 15% of staff in June 2022. Users: "8 million monthly users in Senegal and several million in Cote d'Ivoire" (company, about 2023); more than 7 million Senegal users per its job posts; claims of 29 million monthly active users and 150,000 agents come from low-quality blogs [C/U]. Sources: https://restofworld.org/2022/how-wave-is-disrupting-francophone-africas-mobile-money-market/ ; https://triplepundit.com/2025/wave-mobile-money-cote-divoire/
- **Pricing**: 1% flat on app transfers, free deposits and withdrawals at agents. Orange cut prices (to about 0.8% and free withdrawal in 2021) and called Wave "the Amazon model: we burn cash" [S]. Wave co-founder said profitability would take years; claims of profitability are unverified [U].
- **UX**: app-first, QR codes, visual interface, plus physical QR cards for customers without smartphones; bypassed Orange's control of USSD [S]. Customer service "always responds" per a vendor; Orange's mistaken transfers could not be reversed per the same vendor [S, anecdotal].
- **Why it worked**: radical price transparency, trust marketing, QR merchant acceptance, and a competitive agent bonus. Agent economics were the pain: one agent's daily commission fell from about CFA 15,000 on Orange Money to about 6,000; Wave bonuses later disappeared; mobile money operators struck in Cote d'Ivoire in Aug 2022 after Wave cut commissions [S].
- **Complaints / fraud**: Oct 2026 report of Senegalese users alleging unauthorised withdrawals via masked numbers (one above CFA 1 million), Wave allegedly declining responsibility, consumer association asking for compensation; phishing SMS schemes in Cote d'Ivoire with losses about CFA 169.7 million in one case. Older: SIM-swap theft of CFA 260,000 (2022). Source: https://www.osiris.sn/wave-des-utilisateurs-senegalais-denoncent-des-retraits-frauduleux-un-mode.html [S, single outlet].
- **Transferability to Madagascar**: price war model needs funding and a licensed e-money issuer; Madagascar smartphone ownership is 8.9%, so the QR-app approach reaches far fewer people; OTP/SMS phishing is the dominant fraud and applies equally in Madagascar.

### 6.2 M-Pesa (Kenya, Tanzania, others)

- **Profile**: pilot 2005, Kenya commercial launch March 2007; Tanzania 2008 (slow uptake initially); exits from India (2019), Romania (2017), Albania (2017) because of low uptake/regulatory issues [S, Wikipedia]. FY2025 (year to Mar 2025): about 35.8 million one-month active customers, about 299,000 agents, M-PESA revenue KShs 161.1 billion (+15.2%, 44.2% of service revenue), transaction value KShs 38.29 trillion [S]; a half-year report cites 37.9 million monthly actives; FY2026 secondary analysis: revenue about KSh 182.7bn, Fuliza (overdraft) 17.7 million distinct users [S/U]. Note differing "active" definitions.
- **Lessons**: agent trust and training were the early bottleneck; airtime top-up with a 5% discount drove volumes; repositioned from loan repayment to remittances/payments after observing real use; used national ID for KYC; in South Africa growth lagged (banked population, strict registration) [S]. Tanzania's lower prices through competition vs Kenya's higher fees (Gates Foundation 2013) [S].
- **Criticism**: opaque pricing, unwanted subscriptions (USAID study), 2019 lawsuit about data of 11.5M users [S].
- **Group savings**: Kenya has 300,000+ registered chamas (unverified estimate) and a cluster of M-Pesa-integrated management apps (Hakiba Digital, SmartChama, ChamaPro, ChamaPay). ChamaPay explicitly states it is not a bank, SACCO or licensed financial institution; vendor adoption numbers are unaudited marketing (e.g. 500+ chamas, KES 850M) [U]. Pattern: apps orchestrate contributions via M-Pesa STK push and keep records; the regulated entity holds the money.

### 6.3 MTN MoMo and Orange Money Africa (groups)

- MTN FY2025: MoMo 69.5 million monthly active customers (+10%), fintech transaction value USD 500.3 billion (+37.6%), volumes 23.3 billion; Ghana and Rwanda main drivers; MTN Uganda fintech active users 14.7 million [P: MTN FY25 results https://www.mtn.com/wp-content/uploads/2026/03/MTN-Group-FY-25-results-JSE-SENS.pdf].
- MTN shut Ayoba (its super-app) in March 2026 after about 35 million users, and Orange's Max it was targeting 75 million users by 2028 after missing an earlier 45 million target [S, Developing Telecoms]. Super-apps have not shown a clear path to monetisation.
- Orange Money group: 53 million monthly actives (Aug 2026), EUR 200 billion+ in 2025 [C].

### 6.4 Chipper Cash

Cross-border wallet that restructured (several layoffs 2023-24), had a bank-partner problem in 2024 that paused US services for about two months, and reportedly stopped burning cash in Q4 2025 (unaudited, two ex-employees) [S]. Lesson: sponsor-bank dependence is a business risk; wallet-only plays are hard to make profitable.

### 6.5 Moov, Free Money, Flutterwave/Paystack

Only basic facts found: Moov Money operates in Cote d'Ivoire, Togo (Flooz), Benin (agents and bank partner accounts) under Moov Africa/Maroc Telecom; user counts not found [S/U]. Free Money, Flutterwave/Paystack wallets: not researched (gap).

### 6.6 Indian Ocean peers

- **Comoros**: MVola (Telma, April 2019) and Holo (BDC, Sept 2019). Holo reached 10,000 sign-ups quickly via concert-linked enrolment but usage did not follow; many dormant accounts; changed to require a minimum balance; external agents quit for lack of revenue; 42 merchants; informality blocks agents (commercial register required); utilities lacked APIs for bill payment [P: BDC white paper https://www.datocms-assets.com/17643/1623309096-wp-holo-success-story-in-comoros.pdf]. A BCC annual report reportedly shows only MVola and Holo leading, Wari failing [S].
- **Mauritius**: MCB Juice about 650,000 users and over 7 million transactions a month (2025 article; older 420,000 figure) on an interoperable national QR/payment backbone with my.t money (Mauritius Telecom) and Blink (Emtel); no myT/Blink counts [S/U].
- Seychelles, Reunion: not researched.

### 6.7 Cross-cutting lessons

1. Registration is not usage: Holo and Madagascar's 1,250 accounts per 1,000 adults versus 19% Findex mobile money ownership.
2. The regulated money holder is a licensed entity; successful chama/tontine apps layer records and workflows on top, not custody.
3. Agents decide adoption in cash economies; their commissions are the fragile point (Wave, Holo).
4. Fraud is social engineering around OTP and PIN and SIM swap, and operators' terms put the loss on the customer (MVola Art. 8.9, 14.4).
5. Reliability and refund/dispute handling drive reviews more than features (Orange Max it, MVola outages).
6. Price: fees on small amounts are the main adoption barrier; same-network P2P at Ar 70 vs cross-network Ar 200-250 for the same small transfer is a UX trap for groups with mixed operators.

---

## 7. Takeaways for Gereo MVP

### 7.1 Constraints (design around these)

1. **Licensing/custody**: custody of client funds in wallets falls under the 2016 e-money law (CSBF agrement, mandated-agent rules, no deposit-taking, no interest on e-money, compte global). Decide the operating model before building: mandated agent of a licensed issuer, partnership, or own licence.
2. **Interest and lending**: do not promise interest, yields, or intra-group lending in the wallet; route savings/credit through licensed banks/MFIs (as MVola does).
3. **Wallet caps**: operator wallets cap individuals at Ar 20M balance and per transaction; enterprise Ar 100M. Group pots above Ar 20M cannot land in one personal MVola wallet.
4. **Fees**: cross-network payouts cost 3x to 10x same-network. Show the exact fee before confirmation; prefer same-operator payout routing; collect contributions in a way that does not charge the sender extra.
5. **Asynchronous money movement**: operator USSD push/callback flows can time out or double-notify; MVola reversals cost 5% (min Ar 10,000) and take a 7-day window. Idempotency keys, a ledger with pending/settled states and a reconciliation job are non-optional.
6. **Reliability**: MVola had material outages in Nov 2025 and May-June 2026. Show "provider unavailable" states, queue payouts, never claim funds are lost, and provide a transaction reference users can quote.
7. **Device and network**: about 9% of adults have smartphones; 20% use the internet. The app must be a lightweight PWA/Android Go build with offline-tolerant screens and aggressive caching; USSD/SMS parity for critical actions (confirm contribution, view balance, receive reminder, vote). Malagasy/French/English with Malagasy as a first-class language, not a translation afterthought.
8. **KYC is Gereo's job**: tiered KYC (phone + OTP for browse/receive; ID photo + selfie for withdraw/hold above a cap; extra for group treasurers). Use CIN, handle SIM-swap risk (re-verify on new device/SIM), keep records five years (Art. 53), data-protection compliance.
9. **Tax**: TTM status unclear; build a configurable tax/fee line.
10. **Cross-border**: Madagascar-to-abroad flows are tightly controlled (Comoros example); other-market expansion needs per-country licensing (Wave note) - keep the core payment layer provider-agnostic.

### 7.2 Opportunities

- **No local digital tontine/association product found** while about 6-7 million people use mobile money and informal group finance exists; but Findex shows low "savings club" use (4.9%), so validate demand with field interviews before assuming a large market.
- Trust gap: users complain about money debited without service delivery and opaque dispute handling. A product that shows a transparent ledger, receipts, and fast human support differentiates.
- Group workflows operators do not provide: shared pots with rules, contribution reminders by SMS, rotating payouts, approvals (double signature exists only in MVola B2B Selfcare), receipts for committee records.
- Low merchant acceptance (2.4% digital merchant payments) means contributions and payouts, not retail, are the natural wedge.
- Remittance receipts from abroad (diaspora) to groups/families, via MVola/Orange international transfer APIs and Western Union.
- eAriary (future) may give a cheaper rail and distributor role.

### 7.3 Risks

- **Regulatory**: operating as an unlicensed e-money service is an offence (Art. 16); aggregator HQ in France vs Art. 25 for issuers; unpublished CSBF instructions on caps; tax uncertainty.
- **Partner**: aggregator concentration risk, product overlap with its own wallet, undisclosed API/settlement terms. Plan a second rail (Papi or direct operator APIs) behind an adapter interface.
- **Fraud**: OTP phishing, SIM swap and social engineering are the dominant losses across markets; operator terms put liability on customers, and users will blame the app.
- **Liquidity and float**: if Gereo promises instant payouts it must fund float or depend on aggregator settlement timing; unknown.
- **Group-specific**: treasurer abuse and disputes over contributions; need role-based approvals and audit trail.
- **Sustainability**: small-ticket fee economics (Ar 70-250 on small transfers); Wave/Chipper show low-margin wallets are hard to run profitably.

### 7.4 Questions to put to the chosen aggregator (checklist)

1. REST API docs, sandbox, auth, signed webhooks, retry policy, idempotency, status polling.
2. Collection and disbursement flows per operator: limits per transaction/day/month/balance, settlement time, float requirements, fees, refund/reversal rules.
3. Does the 100,000,000 Ar ceiling apply per transaction, per day, or per account? Does it hold for payouts to personal wallets?
4. Sandbox test numbers and production onboarding time, merchant KYC requirements.
5. SLA, incident communication, fraud rules, data ownership/portability, exclusivity.

---

## 8. Source quality notes

- Most reliable here: Madagascar law text, MVola official tariff and terms, Findex Little Data Book, DataReportal, MTN filings, Apple App Store review pages, L'Express/AllAfrica reports.
- Weakest: momocalc.com (aggregator with internally contradictory notes), TheNoklu blog, Fintech Times, totalbug (undated anonymous complaints), several Wave blogs (businessmodelcanvastemplate, allbusiness.africa, substack, liners).
- Metric traps: "registered", "created", "active (30 day)", "users" and "customers" differ by source and company; the Madagascar numbers in 1.3 cannot be reconciled.

## 9. Gaps still open

- Orange Money and Airtel Money developer/API terms; official Orange/Airtel tariffs and KYC tier limits.
- CSBF instructions (KYC tiers, caps, agent rules); CSBF list of licensed e-money institutions.
- Google Play review text for MVola, Orange Max it, Airtel Money, Wave, M-Pesa.
- Free Money, Flutterwave/Paystack wallets, Seychelles, Reunion, bank/MFI apps in Madagascar, local crowdfunding and tontine apps, Jirama's payment apps.
- Field research on how Malagasy groups (associations, fokonolona, tontines, church and burial groups) actually collect and hold money.

---

## 10. Sources

Madagascar market and operators
- DataReportal Digital 2026 Madagascar: https://datareportal.com/reports/digital-2026-madagascar
- World Bank Little Data Book on Financial Inclusion 2025 (Madagascar page): https://thedocs.worldbank.org/en/doc/be6615202d1f08a25855c8ac2d615122-0050012025/related/Little-Data-Book-2025-Web.pdf
- IMF FAS registered mobile money accounts per 1,000 adults (FRED): https://fred.stlouisfed.org/data/MDGFCMARANUM
- IFC, Madagascar's Mobile Money Boom: https://www.ifc.org/en/stories/2023/madagascars-mobile-money-boom
- L'Express Madagascar, MVola inspection after outages (Nov 2025): https://www.lexpress.mg/2025/11/mobile-money-controle-inopine-chez-mvola.html
- L'Express via AllAfrica, MVola CEO interview (3 Aug 2026): https://fr.allafrica.com/stories/202608030688.html
- NewsMada, MVola 15 years: https://newsmada.com/2025/05/08/mobile-money-mvola-celebre-15-ans-dinclusion-financiere-a-madagascar/ (not fetched; figures from search summary)
- MVola tariffs: https://mvola.mg/tarifs/
- MVola general terms: https://www.mvola.mg/conditions-generales/
- MVola Epargne: https://www.mvola.mg/mvola-epargne/
- MVola B2B catalogue 2025: https://www.mvola.mg/wp-content/uploads/2025/11/MVola-Catalogue-BToB-2025.pdf
- MVola Corporate and Impact Review 2023: https://www.mvola.mg/wp-content/uploads/2024/08/CorporateImpact-Review-MVola-2023.pdf
- MVola App Store (Madagascar) reviews: https://apps.apple.com/mg/app/mvola/id1496566692?see-all=reviews&platform=iphone
- MVola user complaints (unverified): https://www.totalbug.com/mvola/
- Mobile World Live on MVola: https://www.mobileworldlive.com/old_latest-stories/mvola-launches-mobile-money-loans-in-madagascar/
- Orange Money Madagascar interoperability release (APO, 18 Jan 2024): https://www.africa-newsroom.com/press/orange-money-desormais-disponible-pour-tous-a-madagascar-quel-que-soit-loperateur?lang=fr
- Orange Max it Madagascar App Store reviews: https://apps.apple.com/mg/app/orange-max-it-madagascar/id1295171817?see-all=reviews&platform=iphone
- Orange Max it Madagascar Google Play (page not rendered by tool): https://play.google.com/store/apps/details?id=com.orange.myorange.omg&hl=en_US
- Orange, Orange Money and Max it overview: https://www.orange.com/en/our-news/orange-money-financial-services-right-your-phone
- Fee aggregator pages (low authority): https://momocalc.com/madagascar , https://momocalc.com/madagascar/orange-fees , https://momocalc.com/madagascar/airtel-fees , https://momocalc.com/fr/madagascar/mobile-money-tax
- Telma becomes Yas: https://www.lexpress.mg/2024/11/telephonie-mobile-telma-change-de-nom.html
- Paositra Malagasy licence: https://newsmada.com/?p=86294
- Xsolla integrates MVola: https://www.businesswire.com/news/home/20251204268075/en/Xsolla-Integrates-MVola-as-a-Payment-Method-to-Enable-Instant-Card-Free-Payments-for-Gamers-in-Madagascars-Mobile-First-Market
- Xsolla and Airtel Money Madagascar: https://thepaypers.com/payments/news/xsolla-brings-airtel-mobile-money-to-tanzania-and-madagascar
- Fintech Times, Madagascar ecosystem 2026 (low authority): https://thefintechtimes.com/the-fintech-ecosystem-of-madagascar-in-2026/


Regulation, tax, eAriary
- Law 2016-056 on electronic money (promulgated 2 Feb 2017): https://textes.lexxika.com/wp-content/uploads/2024/05/Loi-2016-056-02-Fevrier-2016-Sur-la-Monnaie-Electronique-et-les-Etablissements-de-Monnaie-Electronique.pdf
- BFM eAriary page: https://www.banky-foibe.mg/eariary
- 2424.mg on eAriary: https://www.2424.mg/transaction-financiere-tout-savoir-sur-leariary-la-monnaie-numerique-officielle-en-projet-de-la-banky-foibeni-madagasikara/
- eCurrency / BFM press release: https://www.prnewswire.com/news-releases/ecurrency-cbdc-technology-in-madagascar-for-eariary-project-at-banky-foibeni-madagasikara-bfm-302597601.html
- Tax: https://fr.allafrica.com/stories/202411200196.html , https://www.financialafrik.com/2024/11/21/projet-de-taxation-du-mobile-money-a-madagascar-une-menace-multiple-pour-le-developpement-du-pays/ , https://www.capmad.com/fr/news/finance-fr/une-taxe-sur-les-transactions-mobiles-a-madagascar/ , https://www.madagascar-services.com/blog/en/2025/05/22/major-changes-introduced-by-the-2025-finance-act-in-madagascar/
- UNCDF diagnostic of Madagascar digital financial services ecosystem, Feb 2020 (found, not read): https://www.uncdf.org/Download/AdminFileWithFilename?id=10563&cultureId=127&filename=080620v2madagascarreportfrpdf

Regional peers
- Rest of World on Wave: https://restofworld.org/2022/how-wave-is-disrupting-francophone-africas-mobile-money-market/
- TriplePundit on Wave in Cote d'Ivoire: https://triplepundit.com/2025/wave-mobile-money-cote-divoire/
- Osiris/Senenews on Wave fraud (6 Oct 2026): https://www.osiris.sn/wave-des-utilisateurs-senegalais-denoncent-des-retraits-frauduleux-un-mode.html
- M-Pesa (Wikipedia): https://en.wikipedia.org/wiki/M-Pesa
- Safaricom FY2025 annual report: https://www.safaricom.co.ke/images/Downloads/annual-2025-report.pdf ; summary: https://moseskemibaro.medium.com/an-in-depth-analysis-of-safaricom-kenyas-fy25-business-performance-f677266b3dab
- Safaricom FY2026 analysis (secondary): https://khusoko.com/2026/05/07/safaricom-fy2026-results-earnings-analysis/
- Chama app vendors (Kenya): https://hakiba.digital/ , https://chamapay.co.ke/ , https://smartchama.com
- MTN Group FY2025 results: https://www.mtn.com/wp-content/uploads/2026/03/MTN-Group-FY-25-results-JSE-SENS.pdf
- Developing Telecoms on Max it: https://developingtelecoms.com/telecom-business/operator-news/19961-orange-targets-75-million-users-for-max-it-super-app-as-africa-growth-accelerates.html
- Orange Money (Wikipedia): https://en.wikipedia.org/wiki/Orange_Money
- Chipper Cash: https://techcabal.com/2026/01/21/chipper-cash-posts-first-quarter-without-cash-burn/ , https://techpoint.africa/2024/05/08/chipper-cash-fully-operational-us/
- Holo (Comoros) white paper: https://www.datocms-assets.com/17643/1623309096-wp-holo-success-story-in-comoros.pdf
- MVola Comores: https://www.comoresinfos.net/telma-comores-lance-le-service-mvola/ ; Al-Watwan market share: https://alwatwan.net/societe/mobile-money-2019-2020-i-mvola-et-holo-se-sont-partag%C3%A9s-le-march%C3%A9.html
- MCB Juice (Mauritius): https://platformafrica.com/2025/09/05/mcb-juice-5-0-a-new-era-for-digital-payments-in-mauritius/ ; https://mauritiusbiz.com/going-cashless-mauritius/
- My Tontine (other markets): https://mytontine.app/fr
