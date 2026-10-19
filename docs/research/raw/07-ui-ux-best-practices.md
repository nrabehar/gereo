# Gereo - UI/UX Best Practices Research (raw notes)

Date of research: 2026-10-19. Scope: evidence-based UI/UX rules for Gereo (multi-wallet, group wallets, ledger, voting, projects, events, permissions, tiered KYC) for low-to-mid income Malagasy users on low-end Android with slow, costly data.

## 0. How to read this document

Evidence labels used on every claim:

- [V] Verified: read in this session at a primary or official source (W3C, Android Developers, Google/Chrome docs, NN/g, GOV.UK, CGAP, GSMA, Unicode CLDR data, peer-reviewed paper text, vendor's own documentation for that vendor's behavior).
- [S] Secondary: reported by a search-result summary, a blog, a vendor study, or a third-party write-up; plausible but not read at the primary source.
- [U] Unverified: my inference, a design hypothesis, or a fact I know but could not re-verify in this session. Treat as something to test with users, not as a finding.
- [D] Derived: arithmetic or inference computed by me from [V]/[S] inputs (inputs shown).

Caveats on method:

- Material Design 3 (m3.material.io) and Apple HIG (developer.apple.com/design) pages are JavaScript-rendered and returned no body text through the fetch tool. Material guidance is therefore cited from developer.android.com and the Material Components GitHub docs; Apple's 44 pt target is tagged [U].
- Several PDFs (CGAP smartphone UI/UX principles, Medhi et al. CHI 2009, Srivastava et al. CSCW 2021, Reeder et al. CHI 2008) were downloaded and converted to text locally; those are cited as [V].
- Two Gereo-specific premises in the brief (about 9% adult smartphone ownership, "French is 15-30% longer") could not be confirmed at a primary source; see sections 1 and 6.
- No Malagasy-specific text-expansion ratio exists in anything I found. Measure it (section 6).

---

## 1. Context facts that drive the design (Madagascar)

| Fact | Tag | Source |
|---|---|---|
| Internet users: 6.60 M at start of 2025, 20.4% penetration; 6.71 M at end of 2025, still 20.4% | [S] | https://datareportal.com/reports/digital-2025-madagascar and https://datareportal.com/reports/digital-2026-madagascar (via search summary) |
| Mobile connections 22.5 M end of 2025; unique mobile internet penetration 14.3% (2025); 66% of population lived inside mobile broadband coverage but did not use mobile internet (2026); about one-third of rural population outside 4G coverage; smartphone affordability and digital literacy named as major barriers | [V] | https://www.gsma.com/newsroom/press-release/gsma-digital-reforms-could-connect-1-12-million-more-people-in-madagascar-and-add-mga-4-1-trillion-to-gdp-by-2031/ (published 2026-10-16) |
| Adult literacy about 77.5% (2022, World Bank/UNESCO series); youth 15-24 about 82% (2021) | [S] | https://fred.stlouisfed.org/data/SEADTLITRZSMDG and https://policy.desa.un.org/sites/default/files/2025-06/ldc_profile_madagascar.pdf (via search summary) |
| Government statement (Nov 2025): a person who can only spend 500 Ar/day on data effectively pays about 5,000 Ar/GB; big-bundle buyers pay as little as 2,000 Ar/GB | [S] | https://techafricanews.com/2025/11/27/madagascar-government-demands-real-immediate-internet-price-cuts-for-citizens/ |
| At 5,000 Ar/GB, 1 MB costs about 5 Ar, so a 3 MB first load is about 15 Ar, i.e. about 3% of a 500 Ar daily data budget | [D] | derived from the line above (decimal GB) |
| Data plans in some countries can cost up to 10% of a typical user's monthly income | [V] | https://developer.android.com/docs/quality-guidelines/building-for-billions-data-cost |
| Sub-Saharan Africa: a 4G-capable device costs about 26% of monthly GDP per capita vs 16% in other LMICs (2026 commentary) | [S] | https://techafricanews.com/2026/03/05/2025-vs-2026-mobile-industry-checkpoint-has-anything-actually-changed-for-africa/ |
| About 25% of mobile money account owners in Sub-Saharan Africa sent money to the wrong recipient; half of them did not recover the funds (Findex 2025). Senegal 34%, Cote d'Ivoire 27%, Burkina Faso 25%, Kenya 35% | [V] | https://www.cgap.org/blog/findex-2025-why-financial-inclusion-needs-to-be-more-responsible |
| 9% adult smartphone ownership in Madagascar | [U] | Not found at a primary source. GSMA says the barrier is demand/affordability/literacy, not coverage; no Madagascar smartphone share was in the pages read. Validate with GSMA Intelligence before quoting. |

Design implications:

1. The product is for a minority online population that is still cost-constrained: every megabyte has a visible price, so weight is a UX feature, not just an engineering metric.
2. Because internet use is about 20%, many members of a group may never install the app. Gereo needs a non-app channel (SMS now, optionally USSD/WhatsApp-style later) for the group-critical moments (OTP, payment confirmation, vote deadline, event reminder). See sections 3.5 and 7.7.
3. Phone sharing, borrowed phones and agent mediation are normal in this segment (CGAP shows help-in-flow valued "because they might share their phone with someone else" [V], https://www.cgap.org/sites/default/files/publications/slidedeck/principlesofsmartphonedesign05oct16-161005230428.pdf). Hide-balance, PIN-gated actions and session timeouts matter.

---

## 2. Fintech and money UX

### 2.1 Displaying Ariary

Verified data (Unicode CLDR, read from https://github.com/unicode-org/cldr-json, files `cldr-core/supplemental/currencyData.json` and `cldr-numbers-full/main/{mg,fr-MG,fr,en-MG}/numbers.json` and `currencies.json`):

- MGA has `_digits: 0` and `_rounding: 0` in CLDR: no decimals in display. [V]
- Symbol: `Ar` in `mg`, `fr-MG`, `en-MG`; `fr` has no `Ar` symbol (only narrow symbol `Ar`). [V]
- `fr-MG`: decimal `,`, group U+202F (narrow no-break space), currency pattern `#,##0.00 ¤` (number then space then symbol) so `1 250 000 Ar`. [V]
- `mg`: decimal `.`, group `,`, currency pattern `¤ #,##0.00` so `Ar 1,250,000`. [V]
- `en-MG`: decimal `.`, group `,`, pattern `¤#,##0.00` so `Ar1,250,000`. [V]
- Observed with `Intl.NumberFormat` on Node v26.8.2 (ICU): `fr-MG` gives `1 250 000 Ar`; `mg` gives `Ar 1,250,000`; `fr` gives `1 250 000 MGA`; `en` gives `MGA 1,250,000`; 1250000.5 rounds to 1250001 (half-up), so floats silently change the amount. [V, own run]
- The CLDR `mg` locale is thin: in my run `Intl.RelativeTimeFormat('mg')` fell back to abbreviations (`-2 d`) while date long format worked (`19 Oktobra 2026`, weekday `Alatsinainy`). Plan to ship hand-written Malagasy strings rather than rely on ICU for anything beyond numbers and dates. [V, own run]
- ISO 4217 lists MGA with a minor unit (subunit 0.01) while CLDR treats it as 0 decimals; the ariary was historically divided into 5 iraimbilanja, now effectively obsolete (Wikipedia, May 2023). This is a classic integration trap: a payment API may expect minor units x1 or x100. [S] https://en.wikipedia.org/wiki/Malagasy_ariary . Confirm the exact amount encoding in the Vanilla Pay API before building the ledger. [U]

Rules:

- R-M1. Store and compute money as integer ariary (BIGINT), never float. Rounding half-up on floats changes amounts (see run above). [V own run + D]
- R-M2. Display with a space as the only thousands separator and no decimals: `12 500 Ar`. Use U+202F or U+00A0 inside the number and a no-break space before `Ar` so it never wraps. [V CLDR for fr-MG; the no-wrap recommendation is [U]]
- R-M3. Use the same grouping style in Malagasy, French and English UI. The CLDR defaults conflict: `1,250` is one thousand two hundred fifty in `mg`/`en` but 1.25 in `fr`. A shared space-grouped format removes the ambiguity. [D from CLDR, recommendation [U]]
- R-M4. Use the short symbol `Ar` in lists and cards and the ISO code `MGA` in receipts, statements and exports where currency must be unambiguous. [U]
- R-M5. Amount input: numeric keypad (`inputmode="numeric"`), live regrouping as the user types, large echo of the formatted amount. Add a spelled-out confirmation line on the review screen for large amounts (CGAP lists "visually represent large monetary values" as a good idea to prototype, because of difficulty with periods, commas and zeros). [V as a prototype idea: CGAP deck p.36]
- R-M6. Ask in research whether users think in "francs" (1 Ar = 5 fmg) or Ariary. Informal francs pricing persists in daily speech; if so, never show francs, but test whether amounts like `5 000 Ar` are read correctly. [U]
- R-M7. Show signs and direction with words plus icon plus colour: `Received +5 000 Ar`, `Sent -5 000 Ar`. Do not rely on red/green (WCAG 1.4.1, see section 7). In Stripe, a negative sign has different meaning in different surfaces (credit vs debit), which is a warning against sign-only semantics. [V for WCAG; S for Stripe: https://docs.stripe.com/billing/customer/balance]
- R-M8. Right-align amounts in lists and use tabular (equal-width) numerals so columns scan. [S] (Stripe monospace claim via third-party breakdown https://www.designmd.co/blog/stripe-design-system-breakdown ); the rule itself is standard typography [U].
- R-M9. Dates and times: fixed Madagascar time (Indian/Antananarivo, UTC+3; my ICU run rendered 14:30 UTC as 17:30) with the zone shown on deadlines. `fr-MG` short date is `dd/mm/yyyy`. Never show US-style dates. [V own run for UTC+3 and format; no DST assumption is [U]]

### 2.2 Balances

- CGAP principle 21: make the balance easy to see and easy to hide; tapping the balance hides it; users want both quick balance and privacy from family and others. [V] CGAP deck p.32.
- Rule R-M10: balance visible by default on the wallet card, one-tap hide, hidden state remembered per device. For group wallets show both "group balance" and "your share/contribution" with distinct labels. [V for hide; U for group split]
- Rule R-M11: state which balance is shown: "Available" vs "Pending in" vs "Reserved for approved expenses". Money in transit must not be silently included or excluded. [U]
- Rule R-M12: per-wallet caps/goals show progress as `7 500 / 10 000 Ar` plus a bar, never a bar alone. [U]

### 2.3 Transaction lists, statuses, reference IDs

- CGAP principle 15: leave a clear trail of transaction history; expandable detail; repeat a past transaction; show "in progress", "pending" or "failed" (Jana Cash example). [V] CGAP deck p.26.
- CGAP principle 6 shows green plus tick plus word "Success" and arrow direction for send/receive. [V] CGAP deck p.15.
- CGAP principle 14: confirmation receipt with amount sent, fee, date/time and transaction ID. [V] CGAP deck p.24-25.
- GOV.UK confirmation pages: must include a reference number if one exists, what happens next and when, contact details, a way to save a record (for example PDF). [V] https://design-system.service.gov.uk/patterns/confirmation-pages/
- NN/g empty states: communicate status, give learning cues, give a direct path; never show "No records" while still loading. [V] https://www.nngroup.com/articles/empty-state-interface-design/
- NN/g: for large tables on mobile keep sticky headers, minimize columns, lock the first column. [V] https://www.nngroup.com/articles/mobile-tables/ (apply as: use list rows, not tables, on phones [U]).

Rules:

- R-T1. Every money movement has a state machine visible to the user with exactly these states: Draft, Awaiting your PIN, Sent to provider, Pending, Confirmed, Failed, Reversed, Needs attention. Each state shows icon + word + colour. [U, structure; supports from V items above]
- R-T2. Pending must show elapsed time, what Gereo is waiting for, and what the user should do ("Nothing. We will SMS you."). Mobile money confirmations can stall; an unexplained spinner reads as lost money. [U]
- R-T3. Failed must say explicitly whether money left the sender's account: "Not taken from your account" or "Taken, refund in progress, reference X". [U]
- R-T4. Show a short reference ID (copyable, speakable in groups of 3-4 characters) on every detail and receipt, and in the SMS. It is what the user reads to a call centre or agent. [V for reference importance (GOV.UK, CGAP); format is U]
- R-T5. List row = counterparty or purpose, amount, status chip (icon+word), time. Group transactions by day with a date header. Tap opens detail with fee, total, ledger entries, who initiated, reference. [U, consistent with CGAP #15]
- R-T6. Offer "repeat this payment" and "pay again to this contact" from detail (CGAP #15 and #11). [V]
- R-T7. Empty state for a new wallet: one sentence of what the wallet is for + one primary button ("Add money") + optional demo/learn link. Do not show an empty chart. [V NN/g + Android UI guide ("avoid empty views", https://developer.android.com/docs/quality-guidelines/building-for-billions-ui)]

### 2.4 Review and confirmation before irreversible actions

- CGAP principle 20: consolidate full transaction details onto one screen to finalise; users build confidence and make fewer errors. [V]
- CGAP principle 14: allow a review step before confirming plus a post-success receipt; a brief "sending" animation reassures even when the transaction is instant. [V]
- CGAP principle 12 and 17: validate in real time (for example amount exceeds balance while typing, before pressing Next) and offer next-step solutions without blaming the user. [V]
- NN/g confirmation dialogs: use confirmation only for serious consequences; restate the specifics; label buttons with the outcome ("Send 50 000 Ar" not "Yes"); no default "Yes"; over-use trains click-through; prefer undo where feasible; personalised thresholds (confirm payments well above a user's usual range). [V] https://www.nngroup.com/articles/confirmation-dialog/
- NN/g heuristics 3 and 5: undo and cancel; prioritise high-cost errors. [V] https://www.nngroup.com/articles/ten-usability-heuristics/
- GOV.UK check answers: state that the transaction is not complete until the user confirms; group content; "Change" link per section that returns to the summary; name the specific action on the submit button. [V] https://design-system.service.gov.uk/patterns/check-answers/
- Android BiometricPrompt: confirmation (explicit button after biometric success) is the default and recommended for purchases/high-risk actions; per-use auth keys (duration 0) for high-value payments. [V] https://developer.android.com/identity/sign-in/biometric-auth

Rules:

- R-C1. Irreversible = outgoing mobile money, withdrawals, expense approvals that release funds, vote-implementing transfers, member removal. Reversible = renaming, goals, caps (with undo), draft rules.
- R-C2. Review screen shows, on one screen: To (name AND number, with contact name), From wallet, Amount, Fee, Total taken, Date/time, plus the effect ("Wallet Savings goes from 80 000 to 30 000 Ar"). Primary button: `Send 50 000 Ar to Rado`. [V CGAP + NN/g; wallet-effect line is U]
- R-C3. Show the recipient's registered name where the provider returns it (confirmation of payee). Monzo launched Confirmation of Payee: no warning on exact match, a warning before payment on mismatch or unverifiable. [V vendor behavior] https://monzo.com/blog/2020/05/04/confirmation-of-payee-launch . Whether Vanilla Pay exposes a name lookup is unknown. [U]
- R-C4. Use undo (a 10-30 s "Cancel" window) only where the system can truly cancel before dispatch. Never show Undo for something already sent to the provider. The window length is a hypothesis. [U]
- R-C5. Confirmation fatigue: confirm only money-out, rule activations that move money, and destructive actions. Do not confirm edits, filters, or navigation. [V NN/g]
- R-C6. The PIN screen repeats amount and recipient (what-you-see-is-what-you-authorise). The EU's PSD2 RTS imposes "dynamic linking" of the authentication code to amount and payee; I could not fetch the regulation text, so treat as the principle only. [U] https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32018R0389

### 2.5 Fee disclosure

- CGAP #19: auto-calculate the fee during the flow; fee slab tables were consistently hard to understand in Wave Money Myanmar prototyping. [V]
- In Cote d'Ivoire, joint efforts cut transactions completed without cost information from 36% (2022) to 6% (2024). [V] https://www.cgap.org/blog/findex-2025-why-financial-inclusion-needs-to-be-more-responsible
- Baymard (e-commerce, not fintech, but a strong analogy): 40% of abandoners cited extra costs too high, 12% could not see or calculate the total up front, 19% distrusted the site with card data; average abandonment 70.22% across 50 studies. [V as e-commerce data] https://baymard.com/lists/cart-abandonment-rate
- Wise vs Revolut test (20 participants, 10 per group; vendor study by Lyssna): finding the total cost took 3 min 39 s vs 7 min 6 s; 70% vs 30% found the correct total. Directional only. [S] https://www.lyssna.com/blog/fee-transparency-ux-wise-vs-revolut/

Rules:

- R-F1. Show Fee and Total on the amount screen live as the user types, not only on review. `Amount 50 000 Ar - Fee 500 Ar - Total 50 500 Ar`. [V CGAP #19]
- R-F2. Use one number for the fee in the common case; put slab tables behind "How is this calculated?" (progressive disclosure, max 2 levels per NN/g https://www.nngroup.com/articles/progressive-disclosure/ [V]).
- R-F3. Fee-free actions say so explicitly ("Fee: 0 Ar"). Never omit the fee line. [U]
- R-F4. The total on review equals the amount that will be debited, to the ariary. Any difference must be explained (rounding is not allowed when everything is integers). [U]
- R-F5. For group splits, show the fee as its own line in the ledger so it is visible to all members. [U]

### 2.6 Errors and recovery

- NN/g error-message guidelines: put the message by the field; use several cues, not colour alone; plain language, no codes; say what happened and what to do; polite (words like "invalid", "illegal", "incorrect" blame the user); preserve input; do not use humour. [V] https://www.nngroup.com/articles/error-message-guidelines/
- GOV.UK validation: error summary at top with focus moved to it, inline message per field, redisplay fields as entered, do not validate on blur; ignore spaces/hyphens the user typed. [V] https://design-system.service.gov.uk/patterns/validation/
- CGAP #17: give next-step solutions; do not make users feel at fault; keep them in the flow. [V]
- WCAG 4.1.3: status messages (success, error, progress) must be exposed with `role="status"`/`role="alert"` without moving focus. [V] https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- Mobile money wrong-recipient errors: 25% sent to the wrong recipient and half could not recover (see section 1). Recovery cannot rely on the recipient or on call centres. [V]

Rules:

- R-E1. Accept messy phone numbers (spaces, +261, 0 prefix, dashes) and normalise; show the normalised number back. [V principle from GOV.UK; Madagascar format specifics U]
- R-E2. Every error has: what happened, whether money moved, what to do next, a button for it. Example: "We could not reach Vanilla Pay. No money was taken. Try again" [Try again] [Save for later]. [V principles]
- R-E3. Keep a visible "Report a problem" on every transaction detail that pre-fills the reference ID and the transaction JSON for support. [U, supports CGAP #16 help-in-flow]
- R-E4. For wrong-recipient risk, add friction before the first payment to any new number (show name if available; ask to re-read last 3 digits aloud/confirm) and allow cancel until provider accepts. [U; justified by the 25% / 50% unrecovered statistic V]
- R-E5. In-flow contextual help, not a separate FAQ: CGAP #16 shows users appreciate help inside the transaction, including people who share their phone. [V]

### 2.7 PIN, biometrics and authentication

- WCAG 3.3.8: a PIN or password typed into a site is a cognitive test and needs a non-cognitive alternative (for example OS biometrics/passkey); OTP fields must allow paste and autofill; split-digit fields where paste fills only one box fail; common identifiers (name, phone) are not cognitive tests. [V] https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- Android: `BIOMETRIC_STRONG or DEVICE_CREDENTIAL` gives biometric with PIN/pattern fallback; confirmation step default for sensitive actions; per-use cryptographic auth for large payments. [V]
- CGAP: the most common reason to call a call centre is PIN reset; allow in-app PIN change and self-service reset. [V] CGAP deck p.34.
- Low-literate Bangladeshi users (n=40, 2026 paper): 72.5% transaction-error prevalence, 47.5% agent dependency, 32.5% PIN sharing. Small sample. [S] https://dl.acm.org/doi/10.1145/3811242.3819111
- Mobile money authentication, NIST SP 800-63B: out-of-band codes must be at least 6 digits and valid at most 10 minutes; the PSTN/SMS channel is "restricted" and alternatives must be offered; rate-limit failed attempts. [V] https://pages.nist.gov/800-63-4/sp800-63b.html
- MDN: avoid SMS-only OTP for sign-in (use it as a second factor or to confirm actions such as payments); code expiry ideally 5 minutes or less. [V] https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/OTP

Rules:

- R-A1. App unlock: device biometrics when enrolled, otherwise the Gereo app PIN. Offer fingerprint as an option, not a requirement; many low-end phones have no sensor or no enrolled finger. [V for API; U for device coverage]
- R-A2. Payment authorisation: Gereo PIN (4-6 digits) every time for money-out, biometric as an alternative if the user opted in. Show amount and recipient on the same screen as the PIN pad. [U; V WCAG rationale]
- R-A3. Never let PIN entry block paste/autofill in OTP boxes; use one input with `autocomplete="one-time-code"` and visual segmenting, not six separate inputs. [V WCAG 3.3.8]
- R-A4. Self-service PIN reset (via OTP + selfie if tier requires) so users do not hand their PIN to an agent. [V CGAP]
- R-A5. Lockout screens explain how long and how to recover; never a dead end. [U]

### 2.8 Scam resistance and trust signals

- Monzo "Take Five": stop, challenge, protect; built-in pauses in high-risk moments; warning screens as friction; in-app scam warnings; claims 55% more fraud prevented in 2024 (no baseline given; self-reported). [V that the interventions exist; S for the claim] https://monzo.com/blog/take-five-stop-challenge-protect
- Mobile money fraud in Africa is mostly social engineering: victims phoned by fake agents/telco staff and talked into disclosing OTPs or dialling authorising codes; SIM-swap; fraudsters mining public screenshots and wallet numbers shared on social media. [S] https://mobileidworld.com/mobile-money-fraud-surges-in-ghana-as-scammers-deploy-social-engineering-tactics/ , https://restofworld.org/2023/mpesa-sim-swap-fraud/ , https://www.myjoyonline.com/the-data-driven-truth-about-financial-scams-in-ghana/
- Digital ROSCA research: members trust people more than platforms; platforms that cross-sell member data erode trust. [S] https://www.microsave.net/2020/04/13/digital-rosca-the-new-kid-on-the-block/ and https://community.interledger.org/andria/project-name-ilf-ambassador-progress-report-1c86

Rules:

- R-S1. Put the sentence "Gereo will never ask for your PIN or code" on every OTP and PIN screen and in every Gereo SMS. [S basis, U copy]
- R-S2. OTP SMS includes purpose and amount where relevant ("Code 482913 to send 50 000 Ar to 034 xx xxx 12. Do not share."). This hampers fake-agent scams that reuse generic codes. [U; follows dynamic-linking principle]
- R-S3. First-time payee, unusually large amount for this wallet, or new device triggers a pause screen with a plain question: "Did someone ask you to send this money?" plus Cancel as the visually primary action. [S Monzo; U wording]
- R-S4. Mask phone numbers in group-visible ledgers (`034 ** *** 12`) and offer a "share receipt" that hides the number, because screenshots leak targeting data. [S]
- R-S5. Trust signals that work here: visible reference IDs, SMS receipts, a named support channel with response time, the provider name (Vanilla Pay) on every payment screen, regulator/KYC tier explanation in plain words. [U]
- R-S6. Do not use member data for third-party offers inside group views; keep the ledger purely about the group's money. [S MicroSave]

---

## 3. Mobile-first and low-end device design

### 3.1 Touch targets and thumb reach

| Standard | Value | Tag | Source |
|---|---|---|---|
| WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA | at least 24 x 24 CSS px, with exceptions: spacing (24 px circle centred on the target must not hit another target), inline, equivalent control, essential, user-agent | [V] | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| WCAG 2.2 SC 2.5.5 Target Size (Enhanced), AAA | at least 44 x 44 CSS px | [V] | https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html |
| Android | touch target at least 48 x 48 dp, larger is better | [V] | https://developer.android.com/guide/topics/ui/accessibility/apps |
| NN/g | minimum 1 cm x 1 cm physical; about 2 cm for primary actions or users in motion; about 2 mm gap often recommended; extra spacing cannot rescue undersized targets | [V] | https://www.nngroup.com/articles/touch-target-size/ |
| Apple HIG | 44 x 44 pt | [U] | HIG pages not machine-readable this session |
| Hoober: 49% of people hold phones with one hand and use the thumb | | [S] | https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/ |

Rules:

- R-D1. Minimum 48 x 48 dp for every tap target; 56 dp for the primary action of money screens; at least 8 dp between adjacent targets. [V 48 dp and 2 mm; 56/8 are U]
- R-D2. Put the primary action and the amount keypad in the lower half of the screen; destructive or rare actions go top or behind a menu. [S thumb zone]
- R-D3. Make the whole list row tappable, not just a small chevron. [U]
- R-D4. Avoid swipe-only or drag-only actions (WCAG 2.5.7 Dragging Movements, AA: every drag needs a single-tap alternative). Many low-literacy users do not know what "swipe" means (secondary, from NBU summaries; the SARAL paper warns against abstract gestures). [V WCAG 2.5.7 https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ ; SARAL V]

### 3.2 Navigation: bottom bar vs tabs vs drawer

- NN/g: tab bars are best for a small set; more than 5 items are hard to fit at good target size; a navigation menu (hamburger) is least discoverable. [V] https://www.nngroup.com/articles/mobile-navigation-patterns/
- NN/g hidden-navigation study (179 participants, 6 sites): on mobile, navigation was used in 57% of tasks when hidden vs 86% when a combo of visible and hidden; hidden navigation lowered content discoverability by more than 20% and raised task difficulty (2.6 vs 2.1 on a 1-7 scale for visible). [V] https://www.nngroup.com/articles/hamburger-menus/
- Material Components (Android): bottom navigation takes 3 to 5 destinations; default labels show on all items when 3 or fewer and only on the selected item when 4 or more; `LABEL_VISIBILITY_LABELED` shows all. [V] https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/BottomNavigation.md
- CGAP #4/#5: flatten menus; focus menus on actions ("doing") not navigating; avoid jargon; home screen with the few transactions people actually do. [V]
- SARAL G7: minimise menu hierarchies; prefer linear navigation. [V]
- Medhi 2009: non-literate users could not form a mental model of hierarchical menus; recommend minimising hierarchy. [V]

Rules:

- R-N1. Bottom navigation with 4 destinations maximum, each with icon AND always-visible label (override the Material default of labelling only the selected tab). Suggested: Home (wallets), Groups, Activity, More. Rarely used areas (projects, events, journal) live inside Groups. [V for 3-5 and discoverability; label override is U, grounded in CGAP #6/#7]
- R-N2. No hamburger drawer as the only route to anything important. Drawer, if any, is for settings and help. [V NN/g]
- R-N3. Depth limit: any frequent task reachable in 3 taps from Home. [U]
- R-N4. Home screen = action buttons for the 3-4 most frequent actions (Send, Add money, Pay contribution, Vote) plus wallet cards. Personalise with recent recipients first (CGAP #10 and #11). [V]
- R-N5. A persistent Help affordance on every screen in the same place (WCAG 3.2.6 Consistent Help, level A). [V]

### 3.3 Information density, loading states, perceived performance

- NN/g mobile UX: above-the-fold content on a 30-inch monitor needs 5 screenfuls on a 4-inch phone; average mobile session about 72 s vs 150 s on desktop; minimise typing; use camera and biometrics; save state continuously; offer undo. [V] https://www.nngroup.com/articles/mobile-ux/
- NN/g response-time limits: 0.1 s feels instantaneous; about 1 s keeps flow; about 10 s is the attention limit and needs percent-done and a way to interrupt. [V] https://www.nngroup.com/articles/response-times-3-important-limits/
- NN/g skeletons: under 1 s use neither skeleton nor spinner; 2-10 s spinner for a single module; skeleton for full-page loads under 10 s; over 10 s a progress bar with duration estimate. [V] https://www.nngroup.com/articles/skeleton-screens/
- SARAL: limit concepts per page; avoid scroll bars/long scrolling for low-literate users. [V]

Rules:

- R-L1. One idea per screen in money flows (who, then how much, then review), as CGAP #13 (Wave Money split airtime purchase into two screens after a combined screen overwhelmed users). [V]
- R-L2. Show cached content immediately and refresh in the background; skeleton for first uncached page load only; spinner only inside a single card; progress bar only for uploads/KYC capture. [V NN/g thresholds]
- R-L3. Never show "No data" before the load completes (NN/g empty-states). [V]
- R-L4. Save form state locally continuously; if the app is killed mid-KYC or mid-contribution, resume where left off. [V NN/g mobile]
- R-L5. Touch feedback on every tappable element within 100 ms (visual press state) to mask latency; Android's guide asks for touch feedback to reduce perceived latency. [V https://developer.android.com/docs/quality-guidelines/building-for-billions-ui ; 100 ms from NN/g 0.1 s]
- R-L6. Avoid interaction models that need scroll bars or tiny scroll targets for the primary task; keep primary content within about 2 screens. [V SARAL for scroll warning; 2 screens is U]

### 3.4 Performance budgets

Verified numbers:

- Core Web Vitals "good" at the 75th percentile: LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1. [V] https://web.dev/articles/vitals
- Lighthouse default mobile throttling: RTT 150 ms, 1.6 Mbps down / 750 Kbps up, 4x CPU slowdown; labelled "Slow 4G" (formerly "Fast 3G"), roughly bottom 25% of 4G and top 25% of 3G connections. [V] https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- web.dev performance budgets (2018, dated): interactive in under 5 s on slow 3G on a Moto G4; critical-path resources under 170 KB compressed and minified; example product page under 170 KB JavaScript on mobile. [V] https://web.dev/articles/performance-budgets-101
- V8: median phone (Moto G4) executes the same JS 3-4x slower than a high-end phone, and a sub-$100 phone (Alcatel 1X) over 6x slower; split bundles over about 50-100 kB. [V] https://v8.dev/blog/cost-of-javascript-2019
- Android (Go edition) guidance: runs on 1 GB RAM or less; on-device app size under 40 MB; PSS RAM at most 90 MB for apps; startup under 5 s; 60 fps target (16 ms frames); lossy WebP and vector icons for size; request images at or below target render size; fetch each image at most once; bounded caches. [V] https://developer.android.com/docs/quality-guidelines/building-for-billions-device-capacity , https://developer.android.com/docs/quality-guidelines/building-for-billions-data-cost , https://developer.android.com/docs/quality-guidelines/building-for-billions-connectivity
- Save-Data: browsers send `Save-Data: on` and expose `navigator.connection.saveData`; offer an explicit toggle; keep core content and trim cost (1x images, skip non-essential images/fonts); default to full content until the user opts in; add `Vary: Save-Data`. [V] https://web.dev/articles/optimizing-content-efficiency-save-data
- Android Data Saver is API 24+; "over half of all users worldwide will experience your app over a 2G connection" (dated guidance). [V] https://developer.android.com/docs/quality-guidelines/building-for-billions-connectivity

Proposed Gereo budgets (my synthesis; targets, not findings) [U]:

| Metric | Target |
|---|---|
| First-visit web/PWA transfer | at most 300 KB compressed (HTML+CSS+JS+fonts), aiming near 170 KB critical path |
| JS per route | under 100 KB compressed; no single bundle over about 50-100 kB |
| Images on first view | 0 required; any avatar/illustration lazy and at most 20 KB |
| Fonts | one variable subset (Latin + Malagasy/French diacritics), under 40 KB, `font-display: swap`, or system font stack |
| Android app | under 40 MB installed; under 15 MB download (Play Store guidance is dated; check current) |
| Time to interactive on Lighthouse Slow 4G, 4x CPU | under 5 s |
| LCP | at most 2.5 s on Lighthouse mobile defaults |
| Repeat visit | usable from cache with 0 bytes for the shell |
| Per-screen data | at most 5-15 KB JSON for lists; paginate at 20-30 rows |

Rules:

- R-P1. Test on a real 1-2 GB RAM Android Go device and on Lighthouse mobile throttling in CI; fail the build if LCP exceeds 2.5 s or JS exceeds the budget. [V thresholds; CI policy U]
- R-P2. Text first: render transaction text immediately, defer avatars and illustrations. Android's connectivity guide: "prioritize text over rich media". [V]
- R-P3. Data-saver mode on by default prompt on first run when the OS data saver is on; a visible switch in Settings with the estimated Ar saved. [V mechanism; estimate is D from section 1]
- R-P4. Icons are inline SVG, one sprite, no icon font; photos only for KYC capture. [V Android vector/WebP guidance; sprite is U]
- R-P5. Disable decorative animation on low-RAM devices (`isLowRamDevice` / `prefers-reduced-motion`). [V Android guide: reduce or remove animations on low-cost devices; WCAG 2.3.3]
- R-P6. Ask for consent before large downloads and show size (web.dev offline guidance: "Get consent before large downloads", "Show costs"). [V]

### 3.5 PWA vs native on Android Go

- Android Go targets 1 GB RAM or less and the Go APK path is optional; the page recommends optimising the main app for all devices rather than a separate Go-only app, which creates a separate listing. [V] https://developer.android.com/docs/quality-guidelines/building-for-billions-device-capacity
- Chromium and Firefox evict site storage under pressure (least recently used origin first); Safari caps script-writable storage after 7 days without interaction, installed PWAs exempt; Chrome allows up to 60% of disk per origin. [V] https://web.dev/articles/storage-for-the-web
- Implication: a PWA's offline cache can be wiped on a phone with low storage unless persistent storage is requested and the user is told what is stored. [D]
- Option space: (a) PWA only (lowest download cost, weakest offline persistence, no reliable background sync on all devices) [U]; (b) native Android app of under 40 MB (best offline, push, SMS autofill via SMS Retriever, Keystore) [V for Android capabilities]; (c) PWA for web, native for Android. Evidence supports (c) when offline and OTP autofill matter; decide with the engineering research file.
- OTP autofill: SMS Retriever (no permission, message must be 140 bytes or fewer, contain the code, and include an 11-character app hash) [V https://developers.google.com/identity/sms-retriever/verify]; SMS User Consent does not need the hash but asks the user to approve and expects a 4-10 character alphanumeric code with a digit [S https://developers.google.com/identity/sms-retriever/choose-an-api]; WebOTP needs Chrome 84+ on Android, HTTPS, and a last line `@domain #code` [V https://developer.chrome.com/docs/identity/web-apis/web-otp]. The WebOTP SMS format also drives Safari autofill via `autocomplete="one-time-code"` (Safari 14+). [V]

### 3.6 Dark mode and display

- NN/g: dark mode helps some low-vision users (for example cloudy ocular media), may extend battery on OLED (possibility, not verified), but light mode performs better for most people with normal vision; offer user choice rather than defaulting to dark; follow the OS setting. [V] https://www.nngroup.com/articles/dark-mode/
- Rules: R-DM1: default to the OS theme, with a manual toggle; both themes must pass the contrast rules in section 7. R-DM2: do not use pure `#000` backgrounds with pure white text for long reading; do not assume dark saves battery on LCD (many low-end phones are LCD). [S/U]
- Sunlight legibility: a large share of use is outdoors; favour high contrast (aim above the AA minimum) for amounts and primary buttons. [U]

---

## 4. Offline and poor-connectivity patterns

Verified guidance:

- web.dev offline UX guidelines: say what is happening and what still works; attribute the problem accurately; report state changes; use action-based language and avoid the word "offline" for non-technical audiences; combine text, icon and colour; do not block the interface with full-screen loaders; queue work and sync later; confirm saved work; sync status without overloading; get consent before large downloads; show sizes; show freshness (last updated); disable dependent features rather than hide browsing; indicate readiness for offline use; educate during onboarding. [V] https://web.dev/articles/offline-ux-design-guidelines
- Android offline-first: local data source is the source of truth; reads reactive from local; writes: online-only (bank transfers), queued (analytics), lazy (write locally then sync; needs conflict resolution); sync pull vs push vs hybrid; last-write-wins is common but silently drops edits; use exponential backoff and cap retries. [V] https://developer.android.com/topic/architecture/data-layer/offline-first
- Android connectivity guidance: store data on disk; offline-first reads; queue outbound requests and run them when connectivity returns; notify users of lost connectivity only when an operation needs the network. [V] https://developer.android.com/docs/quality-guidelines/building-for-billions-connectivity
- Google NBU summaries recommend an offline indicator and "cloud off" with plain text. [S] https://medium.com/design-bootcamp/the-next-billion-users-c3d2e19dea8f
- NN/g system status: no consequential action without informing the user; explain state changes caused by time or external events. [V] https://www.nngroup.com/articles/visibility-system-status/

What must work offline (proposal, grounded on the above) [U]:

| Capability | Offline behaviour |
|---|---|
| Read: own wallets, balances, last N transactions, goals, caps | Always available from local store, with "Updated 2 h ago" |
| Read: group ledger (last 30-90 days), member list, contributions due, active votes, events | Available and flagged with last sync time |
| Read: rule definitions and permission bundles | Available (static) |
| Read: receipts and reference IDs | Available; shareable as image/PDF/text offline |
| Draft: new expense request, vote ballot, RSVP, task update, note | Lazy write: store locally, label "Waiting to send", sync later |
| Money movement (send, contribute, approve release) | Online-only per Android's own bank-transfer guidance; disable with explanation and offer "Save as draft" or "Send me an SMS reminder when online" |
| Casting a vote | Lazy write allowed only if the vote deadline is later than the expected sync; show "Not counted yet. Connect before Fri 17:00" and surface the risk prominently |
| KYC capture | Capture offline, upload when connected, resumable |

Rules:

- R-O1. A single sync indicator in the header: `Updated 14:05` / `Updating...` / `Not updated since yesterday - Retry`. Avoid the word "offline"; say "No connection" and what the user can still do. [V web.dev]
- R-O2. Per-item states: `Saved on this phone`, `Waiting to send`, `Sent`, `Confirmed`. Never leave a queued money-adjacent action ambiguous. [V web.dev/Android queued writes; labels U]
- R-O3. Queue size and age are visible ("2 items waiting since Mon") with a Retry-now button; retries use exponential backoff and a cap. [V Android]
- R-O4. Conflicts: for financial records the ledger is server-authoritative and append-only; the client never "wins" a conflict on money. For drafts/tasks use per-field merge and show both versions on conflict ("Your change vs Fanja's change") rather than last-write-wins, which silently drops edits. [V Android on LWW trade-off; ledger rule U]
- R-O5. Votes and approvals cast offline carry a client timestamp and device ID, and the server records receipt time; if the deadline passes while queued, show "Too late: voting closed 17:00, your answer arrived 17:04" and let the group admin extend only through a visible, logged action. [U; informed by Loomio extensions]
- R-O6. Ask for persistent storage and tell the user what is stored and how big (web.dev: show what's available offline and storage). [V web.dev; storage eviction V]
- R-O7. Stale data is dangerous for money: balances older than a threshold (suggest 24 h) carry a visible "may be outdated" badge and the Send button explains that balance is re-checked on send. [U]

SMS/USSD fallback:

- CGAP calls USSD "clumsy, text heavy, hierarchical, and a barrier to uptake" and expects smartphones to take over; Medhi et al. found users get lost in hierarchical menus and soft-key mappings. [V] CGAP deck p.3; Medhi CHI 2009
- GSMA notes USSD was not designed with accessibility in mind (2026 preprint, secondary) and that smartphone apps allow simpler flows than USSD or SIM Toolkit. [S]
- Rules: R-SMS1. SMS is mandatory for OTP, payment receipts, vote deadline, contribution due, event reminder. R-SMS2. Every SMS is self-contained (what, how much, who, reference). R-SMS3. Treat USSD as read-only and one level deep, if built at all (balance, last 3 transactions, "reply 1 to confirm"). Session limits and per-screen character limits depend on the operator; I recall about 182 characters per USSD screen but did not verify. [U]
- GSM-7 vs UCS-2: 160 characters per single GSM-7 segment, 153 per segment when concatenated; 70 per single UCS-2 segment and 67 when concatenated; one character outside GSM-7 (emoji, curly quotes, many accented letters) flips the entire message to UCS-2. [V from Twilio's page content as returned by search] https://twilio.com/docs/glossary/what-sms-character-limit . Twilio's GSM-7 table includes e-acute, e-grave, u-grave, a-grave, i-grave, o-grave, n-tilde, u-diaeresis, o-diaeresis, a-diaeresis and capital C-cedilla, but not circumflex letters (a, e, i, o, u with circumflex) and not lowercase c-cedilla. [V] https://www.twilio.com/docs/glossary/what-is-gsm-7-character-encoding . Malagasy uses o-circumflex in some loanwords and dialects (for example "hopitaly" written with a circumflex), so those words push SMS to UCS-2. [S] https://static.hlt.bme.hu/semantics/external/pages/lexikai_fej_előtti_vagy_mögötti_bővítmény/en.wikipedia.org/wiki/Malagasy_language.html
- R-SMS4. Write SMS templates to stay GSM-7: straight apostrophes only (French `l'` must not use the typographic apostrophe), no emoji, avoid lowercase c-cedilla and circumflex letters, and lint the template in CI with a GSM-7 checker and a segment counter. Budget under 160 characters. [V encoding facts; the lint rule is U]

---

## 5. Forms, onboarding and progressive KYC

### 5.1 Phone + OTP flow

- Autofill: `autocomplete="one-time-code"`; `inputmode="numeric"`; single field; message format with trailing `@domain #code` enables browser autofill and WebOTP. [V] https://developer.chrome.com/docs/identity/web-apis/web-otp , https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/OTP
- WCAG 3.3.8: OTP must be pasteable and autofillable; split-digit fields where paste fills one box fail. [V]
- Expiry: NIST at most 10 minutes for out-of-band codes and at least 6 digits; MDN prefers 5 minutes or less. [V]
- Resend timer: no controlled study; 30 s is the most common starting point (Twilio), 30-60 s with backoff 30 -> 60 -> 120 s is common. [S] https://www.twilio.com/en-us/blog/best-practices-retry-logic-sms-2fa
- NN/g mobile: minimise typing; biometric login; short forms. [V]

Rules:

- R-OTP1. One numeric input, large digits, autofill/paste enabled, auto-submit on the sixth digit, preserve the entered phone number on the screen so users can fix typos ("Code sent to 034 12 345 67. Wrong number? Change"). [V mechanics; copy U]
- R-OTP2. Resend button disabled with a visible countdown for 30 s, then 60 s, then 120 s; after the third send offer "Call me" or "Get help"; cap sends per number per hour server-side. Default timings are [S]; test them with the actual SMS delivery latency on local operators (no measurement found) [U].
- R-OTP3. Say what to do when SMS does not arrive: "Check your signal. Codes can take up to 1 minute." [U]
- R-OTP4. SMS format includes the app hash or `@domain #code` last line, subject to the SMS length rule in section 4. [V]
- R-OTP5. Use OTP to verify the phone and to confirm risky changes (new device, PIN reset, high-value). Do not make the user type an OTP for every payment; use the PIN. [V MDN: SMS OTP as a second factor or to confirm actions]

### 5.2 Form design

- NN/g placeholders: placeholders disappear, strain memory, hurt contrast and screen readers; use visible labels above the field and keep essential hints outside the field. [V] https://www.nngroup.com/articles/form-design-placeholders/
- GOV.UK: do not validate on blur; error summary; "Change" links; do not blame; tolerate spaces/hyphens. [V]
- WCAG 3.3.7 Redundant Entry (A): do not ask again for info already given in the same process. [V] https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- CGAP #3: simplify registration; reduce steps; Wave Money used phone number plus a unique code in 5 steps. [V]
- CGAP #11: use contacts and history for recipients; typing numbers causes input errors. [V]
- Baymard: 17% of e-commerce abandoners cited a long or complicated checkout; 18% cited forced account creation. [V as e-commerce] https://baymard.com/lists/cart-abandonment-rate

Rules:

- R-FM1. Visible labels above fields; example text may sit in a grey hint line outside the field; never placeholder-only. [V]
- R-FM2. Ask the minimum at each step; collect optional data later; never ask something already known (WCAG 3.3.7). [V]
- R-FM3. Use pickers instead of typing wherever possible: contacts, groups, wallets, dates, amounts via presets (+1 000 / +5 000 / +10 000). [V CGAP #10, #11; presets U]
- R-FM4. Errors on submit and on leaving a step, not on every keystroke except for balance checks and format masks where CGAP showed real-time checks help ("amount exceeds your balance" while typing). [V]
- R-FM5. Allow account creation without password: phone + OTP + PIN. [U]

### 5.3 Progressive KYC and ID/selfie capture

- FATF's risk-based approach allows tiered/progressive CDD where transaction/payment limits vary and lower-assurance digital ID may suffice for simplified due diligence in low-risk cases; simplified does not mean no CDD. [S via search summaries] https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Guidance-on-Digital-Identity.pdf , https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/blog/new-guidance-from-fatf-on-amlcft-and-financial-inclusion/ . Madagascar's own tier thresholds were not researched here. [U]
- CGAP #1: allow users to explore before registering. [V] CGAP deck p.8. CGAP also lists remote self-registration (ID photo, selfie, basic info; Wave Money used 8 steps) as an idea worth further prototyping. [V p.39]
- Drop-off numbers are all vendor claims: one guide cites 40-65% average drop-off at the identity verification step; another says document upload plus post-verification wait remove 35-55% of initial volume; perceived effort as the top stated reason at 38% and technical failures at 24%; the Signicat 2022 survey (7,600 consumers, 14 European countries) found 68% abandoned at least one financial application in the previous year. All [S], unverified and not Madagascar. Sources: https://www.lorikeetcx.ai/articles/kyc-kyb-completion-rate , https://www.flatstudio.co/blog/fintech-onboarding-ux-kyc-drop-off , https://sortment.com/blogs/fintech-kyc-onboarding-playbook
- NN/g mobile: use the camera for codes instead of typing; save state so users can resume. [V]

Rules:

- R-K1. Tier model with value shown at each tier: Tier 0 browse/demo with no account; Tier 1 phone + OTP + PIN, small limits, can join groups and vote; Tier 2 ID number + photo of ID + selfie, higher limits, can create group wallets or approve expenses above X; Tier 3 address/proof for the highest limits. Show tiers as "What you can do now / what unlocks next" with limits in Ar. [V CGAP #1; S FATF; the tier design U]
- R-K2. Ask for KYC at the moment a limit is hit, with the specific benefit ("To send more than 200 000 Ar a day, verify your ID. 3 minutes."), not at signup. [U, progressive disclosure per NN/g V]
- R-K3. ID capture: guide frame overlay, auto-capture on focus, glare/blur check on-device, show a preview with Retake, and explain why each photo is needed. Do not rely on text-only instructions: use one illustration per step. [S on capture being the largest drop-off; U on design details]
- R-K4. Make KYC resumable: save each captured image locally and upload in the background; show "Verification in review. We will SMS you in 1 day" with an expected time and a reference ID. [V NN/g save state; U copy]
- R-K5. Failure reasons are specific and actionable ("Photo too dark. Move near a window") and do not accuse ("Your document is invalid"). [V NN/g error guidelines]
- R-K6. Offer assisted KYC (agent, community facilitator) because human mediation is repeatedly shown to be critical for low-literate users (Medhi: "integrate human mediators"; SARAL G12). [V]
- R-K7. Step indicator: show "Step 2 of 4" with titles for multi-step KYC; keep steps at 4-6 maximum (CGAP examples use 5 and 8 steps). GOV.UK's progress-indicator page returned 404, so the specific GOV.UK stance is not verified. [U for the cap; V that CGAP examples exist]

---

## 6. Low/mixed literacy and multilingual design

### 6.1 Evidence base

- Medhi, Gautama and Toyama (CHI 2009, Microsoft Research): ethnography of 90 subjects in India, Kenya, the Philippines and South Africa, then a usability study of 58 non-/semi-literate subjects in India comparing text-based, spoken-dialog (no text) and rich multimedia (no text) mobile money UIs. Non-text designs strongly preferred over text; overall task completion was 72% (13/18) for voice UI and 100% (20/20) for the rich multimedia UI; voice UI took less than half the time and needed fewer than a third of the prompts; female completion on voice was 60% vs about 88% for male. Eight recommendations: graphical cues; voice annotation; local language in text and audio; minimise hierarchy; avoid non-numeric text input; avoid menus that need scrolling; minimise soft-key mappings; integrate human mediators. [V] https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/medhi_chi2009.pdf
- SARAL (Srivastava, Kapania, Tuli, Singh, CSCW 2021, https://doi.org/10.1145/3449210): 13 guidelines in 5 themes derived from a review of 53 papers, a study with 20 practitioners, and six industry reports. Guidelines: multiple modes of interaction; leverage numerical literacy; minimalist interface; visual cues; avoid jargon; break down information; simplify navigation; accessible help; short simple instructions; audio/video help over text; culturally responsive design; human facilitators; customisation. It also cites warnings against any scroll bars and notes some users struggle to map numbers to navigation actions. [V]
- CGAP smartphone mobile money principles (2016, Chen, Fiorillo, Hanouch): 21 principles including reduce text and use visual cues; icons relevant to local users (multi-colour, less abstract icons worked; "?" was not understood as help in Pakistan; a person with a headset worked better); simple familiar menu terms; flat menus; audio instructions in the local language as an idea to prototype. [V] https://www.cgap.org/sites/default/files/publications/slidedeck/principlesofsmartphonedesign05oct16-161005230428.pdf

### 6.2 Icons, labels and plain language

Rules:

- R-I1. Every icon has a visible text label; icon alone is allowed only for universally learned items (back, close) and still has an accessible name. [V CGAP #6, SARAL G1/G4; Android: each element needs a content description https://developer.android.com/guide/topics/ui/accessibility/apps]
- R-I2. Prototype icons with local users; avoid abstract glyphs (question mark for help, hamburger, gear) as sole signifiers. CGAP found "?" not associated with help; the "Menu" label slightly beat the hamburger icon in cited third-party research. [V CGAP; V NN/g mobile-navigation-patterns]
- R-I3. Multi-colour, concrete icons for money actions (wallet, hand + coin, ballot box, calendar), not flat monochrome line art, validated in tests. [V CGAP #7 (Pakistan)]
- R-I4. Plain language: aim for roughly 6th to 8th grade reading level and 15-20 word sentences in English source copy; NN/g's numbers are for English-speaking general audiences, so apply as a proxy and have Malagasy/French copy reviewed by a literate-but-not-expert reader. [V NN/g https://www.nngroup.com/articles/plain-language-experts/ ; transfer to MG/FR is U]
- R-I5. Use words people say aloud: CGAP "Find Shop" vs "Local Agent" colloquial lesson; avoid "nick setting" style jargon. List the terms you will standardise (wallet, group, contribution, vote, decision journal) and have Malagasy translators propose everyday words, then test each with users. [V CGAP #8; terms U]
- R-I6. No text embedded in images: WCAG 1.4.5 (AA) requires real text instead of images of text (logotypes exempt), which also makes localisation, text scaling, screen readers and data weight work. [V] https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
- R-I7. Prefer numerals and concrete visuals for key facts (amount, date, count) because low-literate users are often comfortable with numbers, but do not use numbers to map to navigation actions. [V SARAL G2 and caveat]

### 6.3 Audio and voice hints

- Medhi: voice UI was faster but completion lower than rich multimedia; the rich client combined graphics with voice feedback on buttons using prerecorded human speech. [V]
- CGAP: audio instructions in the local language is "worth further prototyping"; users like to hear explanations, confirmations. [V] CGAP deck p.35
- SARAL G10: prefer audio or video tutorials over text help. [V]
- Rules: R-V1. Provide a speaker button next to the review screen sentence ("You are sending 50 000 Ar to Rado") and next to onboarding steps; use prerecorded human voice (as in Medhi), not default TTS, because Malagasy TTS availability and quality are unverified. [V Medhi human recordings; TTS quality U]. R-V2. Audio files are tiny (voice codecs, 8-16 kbps), downloaded on demand per language with size shown, and cached. [U] R-V3. Audio also helps shared-phone use: do not auto-play; always user-initiated. [U]

### 6.4 Languages, expansion and numbers

- Android: localise for key regional languages and "allow for spacing, density, order, emphasis, and wording variations"; internationalise dates/times/units. [V] https://developer.android.com/docs/quality-guidelines/building-for-billions-ui
- W3C i18n cites IBM translation-expansion averages from English into European languages: strings up to 10 characters expand 200-300%; 11-20: 180-200%; 21-30: 160-180%; 31-50: 140-160%; 51-70: 151-170% (as published); over 70: 130%. One French example (Flickr "views" to "consultations") was 2.6x. [V] https://www.w3.org/International/articles/article-text-size . These are not French-specific.
- Implication: the brief's "French about 15-30% longer" applies to long running text, not to button labels and tab names, which can double or triple. [D]
- No Malagasy ratio found. Pseudolocalisation (inflated, accented strings) is the standard way to find overflow before translation. [S] https://poeditor.com/blog/text-expansion-and-contraction-localization/ . Malagasy has 21 letters and often uses compound or periphrastic constructions; whether strings are longer than French is not established. [S for alphabet; U for length]

Rules:

- R-L10. Design every label to survive 2x its English length at 4 words or fewer and 1.5x beyond; allow 2-line wrap in buttons and tab labels; never fixed-width pills. [V W3C table; thresholds D]
- R-L11. Run a pseudolocale (every string 1.6x plus accents) in CI screenshot tests. [S]
- R-L12. Measure real ratios: translate the first 150 UI strings into Malagasy and French now and compute median and 90th percentile length vs English; set layout targets from that. [U]
- R-L13. Language switch visible on first screen and in Settings; remember per device; per-group default language. Because members of one group may prefer different languages, never force group-wide language for personal UI. [U]
- R-L14. Pluralisation and gender/number agreement in French and Malagasy need ICU MessageFormat or equivalent; do not concatenate strings. [S: standard i18n practice; CLDR plural rules exist for fr and mg: my run returned `one`/`other` for both]
- R-L15. Numbers: see section 2.1 (space grouping, no decimals). Percent in French is `25 %` with a space, in English/Malagasy `25%` per CLDR; choose one style app-wide for simplicity. [V own run + CLDR]
- R-L16. Dates: write month names in words in all languages in confirmations (`19 octobre 2026` / `19 Oktobra 2026`), numeric form only in dense lists, never mm/dd. [V own run for formats; rule U]

---

## 7. Accessibility (WCAG 2.2 AA essentials)

| Requirement | Value | Tag | Source |
|---|---|---|---|
| 1.4.3 Contrast (Minimum), AA | 4.5:1 normal text; 3:1 large text (18 pt or 14 pt bold, about 24 px / 18.5 px); strict thresholds, no rounding | [V] | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |
| Android | text under 18 sp (or bold under 14 sp) needs 4.5:1; else 3:1 | [V] | https://developer.android.com/guide/topics/ui/accessibility/apps |
| 1.4.11 Non-text Contrast, AA | 3:1 for UI component boundaries/states and graphical objects needed to understand content; charts where values are in text are exempt | [V] | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| 1.4.1 Use of Color, A | colour not the only means of conveying information; red/green status needs another cue | [V] | https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html |
| 1.4.4 Resize text | 200% minimum | [V] | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| 1.4.10 Reflow | works at 320 CSS px width without 2-D scrolling (except data tables, maps, diagrams) | [V] | same |
| 1.4.12 Text spacing, AA | line height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x with no loss of content | [V] | https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html |
| 2.4.11 Focus Not Obscured (Minimum), AA | focused item not fully hidden by sticky bars | [V] | https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ |
| 2.5.7 Dragging Movements, AA | single-pointer alternative to any drag | [V] | same |
| 2.5.8 Target Size (Minimum), AA | 24 x 24 CSS px | [V] | see 3.1 |
| 3.2.6 Consistent Help, A | help in same relative place across pages | [V] | same |
| 3.3.7 Redundant Entry, A | do not re-ask information already given in the process | [V] | same |
| 3.3.8 Accessible Authentication (Minimum), AA | no cognitive test without alternative; paste/autofill allowed | [V] | see 2.7 |
| 4.1.3 Status Messages, AA | live regions for success/error/progress without moving focus | [V] | see 2.6 |
| 2.3.3 Animation from Interactions, AAA / prefers-reduced-motion | disable non-essential motion; honour OS setting | [V] | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html |
| 1.4.5 Images of Text, AA | real text instead of images of text | [V] | see 6.2 |
| Colour vision deficiency prevalence | about 1 in 12 men; red-green most common | [V] | https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness |

Rules:

- R-AC1. Status chips never rely on colour: icon + word + colour, and each status colour must reach 3:1 against its background plus text at 4.5:1. [V]
- R-AC2. Pair every red/green indicator (sent/received, over/under cap) with a shape, arrow direction or sign; choose a colour-blind-safe pair (blue/orange) for charts, and label values directly. [V WCAG 1.4.1; CGAP uses arrows plus colour for sent/received: V]
- R-AC3. Support OS font scaling to at least 200% (use `sp`/`rem`); test every money screen at 200% with a 320 px viewport and a 1.5-line-height override; amounts must not truncate. [V WCAG reflow/resize/spacing; Android sp unit V]
- R-AC4. Visible focus indicator and focus never hidden by sticky bottom nav or keyboards (2.4.11); in native Android, ensure TalkBack order matches visual order. [V]
- R-AC5. Screen readers: each interactive element has a meaningful name describing purpose, not "button"; unique labels in repeated rows (include amount and counterparty in a row's description); mark decorative icons as hidden; use `role="status"` for success toasts. [V Android and WCAG 4.1.3]
- R-AC6. Respect reduced motion; no parallax; animations short and essential (a brief "sending" animation helps per CGAP #14 but must be disabled under reduced-motion). [V]
- R-AC7. Do not use toasts alone for money outcomes; toasts disappear before slow readers finish; keep results on a persistent screen. [U]
- R-AC8. Voice access and dictation compatibility: avoid blocking paste and autofill (3.3.8). [V]

---

## 8. Specific patterns for Gereo's surfaces

### 8.1 Group transparency dashboard and ledger

Evidence:

- Stanbic Chama App (Kenya) FAQ: members see their own and other members' transactions "ensuring transparency"; transactions are classified as Joining fees, Contributions, Penalties, Loan repayments, Loan interest, Disbursements; capital and interest are shown separately on loans for transparency; invoices for contributions with notifications; per-member roles gate who can pay or invoice. [V as vendor documentation] Stanbic Bank Kenya, "Chama App" FAQ PDF (found through web search and read as text; the exact URL was not retained, so re-locate it on stanbicbank.co.ke before citing)
- MicroSave: in physical ROSCAs the leader is "the human ledger"; digital tools must replace that role; members need group-set rules for onboarding, distribution cycle and rotation; rigid payment rules can penalise a member who pays late for a legitimate reason; platforms cross-selling member data could erode trust. [S] https://www.microsave.net/2020/04/13/digital-rosca-the-new-kid-on-the-block/
- Digital record-keeping in Pakistani ROSCAs reported fewer errors and easier access to transaction information for members. [S] ResearchGate figure summary via search
- Experimental evidence: mobile-money e-ROSCAs of anonymous participants still made on-time contributions 88% of the time; 62% paid in all four periods (Science Advances). It tests payment behaviour, not transparency features. [S] https://www.science.org/doi/10.1126/sciadv.abc5831
- Interledger field notes: users distrust technology and operators more than their group; option for anonymous participation matters. [S]
- Chart comprehension: "The Gulf of Interpretation" (CHI 2025) found a stacked bar chart harder to read than a Sankey diagram for participants, and participants were overwhelmed by amount of data; not about budgets. [S] https://dl.acm.org/doi/10.1145/3706598.3713413 . A Sankey review in health notes users need an explanation to grasp benefits and that stacked bars suffice when transitions are not the focus. [S] https://pmc.ncbi.nlm.nih.gov/articles/PMC9232856/ . No study directly compares Sankey vs stacked bar for budget flows with non-experts. [S]
- Charts and WCAG: if values are labelled in text, graphical elements are not needed for understanding and 1.4.11 does not apply to them. [V]

Recommended hierarchy of views (my synthesis) [U]:

1. Headline numbers: Group balance, Collected this month vs target, Spent this month; each with plain sentence ("12 of 15 members have paid this month").
2. "Where the money goes" as a ranked list: category, amount, percent, horizontal bar. Bars are direct-labelled; no legend.
3. Contributions status as a member list with chips: Paid, Due, Late (icon + word + colour) and amount; privacy-aware visibility is a permission, not a role.
4. Full ledger: chronological list with classification chips (use a controlled vocabulary like the Chama App's: Contribution, Penalty, Expense, Transfer, Fee, Share-out), reference ID, who initiated, who approved, link to the vote or approval that authorised it.
5. Optional advanced "Flow" view (Sankey) only on screens of 600 dp or more or behind a "See flow" disclosure; never the only view; always accompanied by the ranked list. Use only if a user test shows comprehension; otherwise skip.

Rules:

- R-G1. Every ledger entry answers who, what, how much, why, and what authorised it, in one tap. [U; supports "real-time double-entry ledger visible to members"]
- R-G2. Show double-entry as a plain sentence, not debit/credit: "From Group Savings to Roof Project: 120 000 Ar". Offer an "Accounting view" toggle with debit/credit columns for treasurers. [U]
- R-G3. Revenue-split rules show a live example next to the rule: "If 100 000 Ar arrives: 60 000 to Savings, 30 000 to Repairs, 10 000 to Reserve." Rounding must be integer-safe: show who gets the remainder (largest-remainder rule) so totals always add to the original amount. [U; integer arithmetic fact V in 2.1]
- R-G4. Percent flows: keep to at most 5-7 destinations before "Other"; show both amount and percent; stacked bars only when direct-labelled and 2-5 segments; sorting descending. [U; WCAG V]
- R-G5. Entries are append-only; corrections appear as new reversing entries with a reason, never edits; show a "Reversed" chip. [U; ledger principle]
- R-G6. A member can always see how much of the group's money is theirs and what is shared; use two numbers, never one blended. [U]
- R-G7. Public vs private: members can hide their own name in the group view only if the group's permission bundle allows; default is visible, since transparency is the product promise and the digital-ROSCA literature notes both transparency benefits and anonymity preferences. [S]
- R-G8. Digest: weekly summary push/SMS ("This week: 4 contributions, 1 expense approved, balance 1 240 000 Ar. Details in Gereo.") rather than an alert per transaction. [V NN/g batching; copy U]

### 8.2 Rule builder for non-experts (if-this-then-that)

Evidence:

- Ur et al. (CHI 2014) found that trigger-action programming can express most behaviours participants wanted for smart-home devices; in a usability test, simple and complex versions showed no significant performance or satisfaction difference; they analysed about 67,000 shared IFTTT programs. [S] https://dl.acm.org/doi/10.1145/2556288.2557420
- Ur et al. (CHI 2016) analysed 224,590 public IFTTT programs shared by over 100,000 users; users often duplicate others' programs. [S] https://dl.acm.org/doi/10.1145/2858036.2858556
- Research on debugging trigger-action programs and on trigger interpretation (when vs if wording) exists (arXiv 2310.06509 and ACM 10.1145/3569506) but I could not read the text, so no findings are claimed. [U]
- NN/g: confirm only serious actions; label buttons with outcomes; restate the specifics. [V] See 2.4.
- NN/g progressive disclosure: two levels is the practical target. [V]
- Expandable Grid (Reeder et al., CHI 2008, 36 participants): viewing the effective result of interacting rules beat the native list-of-rules interface; overall accuracy 83.6% vs 56.5%. [V] https://reitermk.github.io/papers/2008/CHI2.pdf

Rules (all [U] unless noted; the UX shape is inference):

- R-RB1. Build rules as a sentence with 3 blank slots: `When [money arrives in Wallet A] -> move [20%] -> to [Wallet B]`. Slots are pickers (wallets, percent presets, amounts), not free text. Only expose triggers: money arrives, balance exceeds, date, member pays. Only expose actions: move %, move fixed amount, notify, hold for approval.
- R-RB2. Always show a live preview with the user's real numbers ("Last month 250 000 Ar arrived. This rule would have moved 50 000 Ar to Wallet B.") before activation. Preview is the remedy for the "list of rules" problem (V Reeder).
- R-RB3. Show effective result of all rules on a wallet together: a single "What happens when money arrives" summary that lists order, percentages summing to at most 100%, and the remainder; warn if the sum exceeds 100% or leaves 0 in the source wallet. This mirrors the Expandable Grid benefit (V).
- R-RB4. Loop prevention: build the graph of wallet-to-wallet rules; block saving a rule that creates a cycle (A -> B -> A), with plain words and the offending path ("This would send money back to Wallet A"); cap chain depth (suggest 3) and cap total allocation at 100% per trigger; make every automated move carry the originating rule ID in the ledger, and refuse re-triggering on money produced by a rule unless explicitly enabled. Implementation details belong to the architecture file.
- R-RB5. Spending-cap rules: show remaining cap in the wallet card and warn at 80% and at the cap; state whether the cap blocks, asks approval, or only warns. [U thresholds]
- R-RB6. Rule changes in a group wallet are proposals that go to vote (link to the voting pattern); personal wallet rules take effect after a review screen.
- R-RB7. Rules can be paused with one tap; paused state is visible on the wallet card.
- R-RB8. Offer 4-6 templates ("Save 10% of every income", "Keep 50 000 Ar for emergencies") because users copy others' programs (S IFTTT corpus). [S]

### 8.3 Voting UX

Evidence (Loomio's documented behaviour, vendor docs):

- Quorum is the minimum percentage of eligible voters who must participate; the results panel shows quorum not met before votes, updates with participation, and shows a green check once met. [V] https://www.loomio.com/docs/en/user_manual/polls/quorum
- The agreement rule should be stated in the proposal; the proposer sets duration; the system notifies before closing; organisers can extend the closing date; participants can vote, explain and change their vote until close; at close the organiser is prompted to write an outcome that states results and what will happen next, and members are emailed the outcome; a failed vote can be treated as a learning point with a follow-up planned. [V as vendor documentation via search summary] https://help.loomio.com/en/user_manual/polls/outcomes/index.html , https://www.loomio.com/docs/en/user_manual/polls/intro_to_decisions , https://help.loomio.com/en/user_manual/making_decisions/consensus_process.html

Rules:

- R-VT1. A proposal screen contains: title as a question; 2-4 options each written as a full sentence with its consequence ("Yes: spend 300 000 Ar on roof repair from the Repairs wallet"); who can vote; passing rule in words ("Passes if more than half of voters say yes and at least 8 of 15 members vote"); deadline. [V Loomio state the rule; wording U]
- R-VT2. Deadline shown both absolute and relative with zone: `Closes Fri 24 Oct, 17:00 (in 2 days 3 h)`. Countdown text updates at coarse granularity (days/hours; minutes only in the last hour) to avoid distraction and battery use. [U]
- R-VT3. Quorum progress bar with a marker at the threshold and text: `8 of 15 needed. 5 have voted.` After closing, explain why a vote did not count (quorum not met vs rejected). [V Loomio pattern]
- R-VT4. Allow changing the vote until the deadline, and say so on the ballot. [V Loomio]
- R-VT5. Results show counts and names according to the group's permission setting (secret ballot vs open) with the setting stated before voting. [U; Loomio supports different poll types but detail not verified]
- R-VT6. Closing creates a Decision Journal entry automatically: question, options, result, quorum status, who proposed, date, and a written outcome with next steps, plus links to the ledger entries the decision triggered. [V Loomio outcome statements; journal integration U]
- R-VT7. Reminders: one reminder at about 24 h before close to those who have not voted, one in the last 2-3 hours for decisions that move money; no more. The cadence is a hypothesis; Karlan et al. found extra late reminders did not add to savings effects. [U; S Karlan]
- R-VT8. Failed or rejected vote copy states facts, thanks the voters and names the next step ("The proposal did not reach the 8 votes needed. 5 yes, 1 no. You can propose it again."). [V Loomio guidance on failed proposals as learning]
- R-VT9. Do not allow a proposal to be edited after the first vote without notifying and resetting votes. [U]
- R-VT10. Offline: see R-O5.

### 8.4 Approval UX (expense approvals)

- CGAP #20: all transaction details on one screen to finalise. [V]
- NN/g confirmation: restate specifics; label buttons with outcomes; avoid default yes. [V]
- Android: confirmation step and per-use auth for high-value payments. [V]
- PSD2 dynamic linking principle (authorisation bound to amount and payee). [U, regulation text not read]

Rules:

- R-AP1. An approval card shows: requester, purpose, amount, destination (name and number), source wallet and balance after, attached evidence (receipt photo if any), related project/budget line and remaining budget, who has already approved, and what happens next. [U]
- R-AP2. Buttons: `Approve 120 000 Ar` and `Reject` (primary is determined by the amount, not styled to push approval). Rejecting prompts for a short reason with presets. [V NN/g; presets U]
- R-AP3. Approval authorises exactly what was shown; if the amount, destination or source changes after approvals, existing approvals are voided and approvers are re-notified. [U, dynamic linking principle]
- R-AP4. Show the approval threshold in words ("2 of 3 approvers needed") with progress, like quorum. [U]
- R-AP5. Never let the requester approve their own request when the group's rule excludes it; explain why. [U]

### 8.5 Permissions and sharing UX (no roles)

- Expandable Grid result (see 8.2): showing effective permissions beat list-of-rules (83.6% vs 56.5% overall accuracy, n=36). [V]
- Reeder et al. note end users cannot understand the implications of ACL changes in out-of-the-box dialogs; Salmon-style interfaces that show effective permissions improved accuracy. [S] https://www.robreeder.com/researchStatement.pdf and https://www.cs.columbia.edu/~smb/student_theses/maritza-johnson.pdf
- Stanbic Chama App role table is an example of coarse bundles (Payments, Invoices, Group chat, View transaction history, Invite, Request loans) mapped to named roles; Gereo's no-roles model replaces role names with permission bundles. [V as vendor FAQ]

Rules (UX shape [U]):

- R-PM1. Show bundles by plain names with a one-sentence description and a "What this lets you do" list in verbs ("See the ledger", "Propose expenses", "Approve expenses up to 200 000 Ar", "Invite members"). Avoid technical names like `wallet.write`.
- R-PM2. Every member's page has an "Effective access" panel: a short list of what the person can and cannot do right now, with the source ("From bundle: Treasurer helper"). Mirrors the Expandable Grid benefit.
- R-PM3. When assigning, show the diff: "Adding this bundle lets Rado approve expenses. This is new." Use confirm only if the bundle includes money-out powers. [V NN/g confirmation scope]
- R-PM4. Show who granted what and when (audit trail) and let a member see their own access history. [U]
- R-PM5. Changes to money-out permissions may require a vote (ties to voting UX). [U]
- R-PM6. "Preview as member" lets a manager view the app as another member would, to catch over- or under-sharing. [U]
- R-PM7. When something is blocked, say which permission is missing and who can grant it ("You need 'Approve expenses'. Ask Fanja or Rado."), never a bare "Not allowed". [U; NN/g constructive errors V]

### 8.6 Projects (tasks, budget, expense approvals)

- Keep tasks and money linked: each expense request references a budget line; budget remaining shown in sentence and bar; tasks have an owner, a due date and a status chip (To do, Doing, Done) with icons. [U]
- Timeline: use a simple vertical timeline (date, event, who) rather than Gantt; each node uses icon + text; no horizontal scrolling; completed items collapsed by default. [U; supports SARAL scroll warnings V and NN/g mobile table guidance V]

### 8.7 Events and RSVP

- No primary study was found on RSVP UX in this segment. [U]
- NN/g notification guidance and Karlan's reminder results are the closest evidence (see 8.8).

Rules [U]:

- R-EV1. Event card: what, when (absolute date + weekday + time + zone), where (text + map link only if data allows), who is going (count), and a 3-button RSVP (Yes, No, Maybe) with a sticky state chip after choice. One tap, no form.
- R-EV2. Show the RSVP deadline and the effect ("Cost per person depends on how many come").
- R-EV3. Reminders: push at about 24 h and 2 h; SMS only to confirmed attendees or to members without the app, once, within 160 GSM-7 characters, including date, time and place. Cadence is a hypothesis to A/B test.
- R-EV4. Add to phone calendar (.ics) only when online; offline fallback is copy-text.
- R-EV5. If the event has a contribution, link RSVP to payment status ("Going - paid", "Going - 5 000 Ar due").

### 8.8 Notifications and reminders (push + SMS)

Evidence:

- NN/g push guidance: ask for permission later (after value is shown); explain what notifications will cover; send relevant items only; combine when more than five are due at once; most people keep defaults, so defaults should be conservative; provide in-app per-type toggles instead of forcing OS settings; 56 notifications per day on average in 2016 (Telefonica Research as cited). [V] https://www.nngroup.com/articles/push-notification/
- Karlan et al. (Management Science 2016): reminders raised savings-goal attainment in field experiments in Bolivia, Peru and the Philippines; messages mentioning both goal and financial incentive worked best; gain vs loss framing no significant difference; extra late reminders did not add. [S] https://www.nber.org/papers/w16205
- Karlan, Morten, Zinman (Philippines microfinance): on average text reminders did not raise repayment; for repeat borrowers, messages with the loan officer's name did significantly increase repayment; most message variants did not work and differences were minor. [S] https://www.nber.org/system/files/working_papers/w17952/w17952.pdf and https://doi.org/10.1177/237946151500100204
- Cadena and Schoar (Uganda) reported SMS reminders improving timely repayment by 7-9% as cited by later work; they did not randomise timing or content. [S]
- A norm/shame message experiment found women more sensitive to shame incentives; men more to financial incentives; I could not confirm the study's country. [S] https://www.sciencedirect.com/science/article/pii/S104295732500052X
- SMS segment and encoding facts in section 4.

Rules:

- R-NT1. Channels: push for information; SMS only for money moved, codes, deadlines that cost the member something, and members without the app. Do not use SMS for marketing. [U; V NN/g relevance]
- R-NT2. Ask for push permission after the first completed task (for example after the first wallet is created or first contribution made), with a one-screen explanation of the 3-4 types of messages. [V NN/g]
- R-NT3. Defaults: contributions due (3 days before and on the day), votes (24 h before close; 2 h for money decisions), approvals pending (immediately, then once after 24 h), events (24 h and 2 h), weekly digest. Everything else off by default. [U; NN/g says conservative defaults V]
- R-NT4. Batch: more than 5 pending notifications become one summary. [V NN/g]
- R-NT5. Quiet hours: no pushes from 21:00 to 07:00 local, SMS only for security events. [U]
- R-NT6. Personalise reminders with the sender's name where the sender is known to the recipient ("Fanja, treasurer, reminds you:") since personal touch moved repayment for repeat borrowers in one study; do not expect miracles from rewording. [S Karlan-Morten-Zinman]
- R-NT7. SMS copy is cost-aware: under 160 GSM-7 characters, no accent traps (see 4), lead with amount and action, end with a reference. Example: `Gereo: Contribution 10 000 Ar due 25/10 for Group Tanjona. Pay in app or reply HELP. Ref C-4821` [U copy; V length rules]
- R-NT8. Late-payment reminders never name or shame members in group channels; one private reminder first, group-level summary only counts ("3 contributions still due") unless the group's rule says otherwise. [U; shame sensitivity S]

---

## 9. Microcopy and tone

Evidence:

- NN/g error messages: no blame words ("invalid", "illegal", "incorrect"), no humour, plain language, specific, constructive, preserve input. [V]
- NN/g tone dimensions: formal vs casual, serious vs funny, respectful vs irreverent, matter-of-fact vs enthusiastic; keep brand personality, vary tone with the user's emotional state; humour in repeated or serious errors can irritate; a traditional financial institution may find irreverence out of character; test it. [V] https://www.nngroup.com/articles/tone-of-voice-dimensions/
- Mailchimp: tone follows the reader's state of mind; "always more important to be clear than entertaining"; "if you're unsure, keep a straight face". [V] https://styleguide.mailchimp.com/voice-and-tone/
- CGAP: do not make users feel at fault; treat errors as a chance to solve the frustration. [V]
- Loomio: failed proposal outcome states facts and next step. [V]
- Digital ROSCA: rigid rules can hurt a member who pays late for a legitimate reason. [S]

Tone profile for Gereo (proposal) [U]: respectful, matter-of-fact, warm but not playful, plain and short. Humour never near money, errors or conflict.

Rules:

- R-MC1. Lead with the outcome and the number: "Sent 50 000 Ar to Rado" not "Transaction successful". [U]
- R-MC2. Own the problem: "We could not complete this payment" rather than "You entered an invalid number". [V NN/g]
- R-MC3. Every error and warning includes the next action as a button. [V]
- R-MC4. Avoid abstract finance jargon: use "money in", "money out", "share" instead of "credit", "debit", "allocation"; test local vernacular for every term. [V CGAP #8 principle; terms U]
- R-MC5. Be exact about time and money, never "soon" or "shortly": "within 5 minutes", "by Friday 17:00". [U]
- R-MC6. Give the reference and the support route in every failure. [V GOV.UK reference; U]
- R-MC7. No exclamation marks and no emoji in money, KYC, error, and conflict messages. [V NN/g tone: avoid humour; emoji also break GSM-7, V]
- R-MC8. Avoid second-person accusation in group conflicts ("You are late") and use the fact plus the offer ("10 000 Ar is still due for October. Pay now or ask the treasurer for more time.") [U; informed by S MicroSave]

Sample copy (English and French; Malagasy to be written and tested by native translators; strings here are proposals) [U]:

| Situation | English | French |
|---|---|---|
| Payment sent | Sent 50 000 Ar to Rado. Ref 7Q4K-82. | 50 000 Ar envoyes a Rado. Ref 7Q4K-82. |
| Payment pending | Waiting for Vanilla Pay. Usually under 2 minutes. You do not need to do anything. We will SMS you. | En attente de Vanilla Pay. En general moins de 2 minutes. Vous n'avez rien a faire. Nous vous enverrons un SMS. |
| Payment failed | We could not send 50 000 Ar. No money was taken. [Try again] | Nous n'avons pas pu envoyer 50 000 Ar. Aucun argent n'a ete debite. [Reessayer] |
| Late contribution (to the member, private) | 10 000 Ar is still due for October. [Pay now] [Ask for more time] | 10 000 Ar restent a payer pour octobre. [Payer] [Demander un delai] |
| Late contributions (group view) | 3 contributions are still due. Last updated 14:05. | 3 cotisations restent a payer. Mis a jour a 14:05. |
| Vote did not pass | The proposal did not pass. 5 yes, 4 no. You can propose a new version. | La proposition n'a pas ete adoptee. 5 oui, 4 non. Vous pouvez en proposer une nouvelle version. |
| Quorum not met | Not enough people voted: 8 were needed, 5 voted. The decision was not made. | Pas assez de votes : 8 etaient necessaires, 5 ont vote. La decision n'a pas ete prise. |
| Permission missing | You need the permission "Approve expenses". Ask Fanja or Rado. | Il vous faut l'autorisation « Approuver les depenses ». Demandez a Fanja ou Rado. |
| PIN screen | Gereo will never ask for your PIN or code by phone or message. | Gereo ne vous demandera jamais votre code PIN ou un code par telephone ou message. |

(French strings above are written without accents inside this table so the file stays readable in any editor; production copy must use proper accents in UI and the SMS GSM-7 constraints in section 4.)

---

## 10. Gereo UI/UX rules checklist (prioritised)

Legend: P0 = must be true at launch; P1 = needed before general availability; P2 = improvement. Evidence tag is the weakest tag among its supports.

### P0 - Trust, safety, correctness

1. Store, compute and transmit money as integer ariary; never floats. [V own run] (R-M1)
2. Display amounts as `12 500 Ar` (space grouping, no decimals, no-wrap), identical across MG/FR/EN. [V CLDR; U rule] (R-M2, R-M3)
3. Review screen on one screen: recipient name and number, amount, fee, total, from-wallet and balance after; button labelled with the action and amount. [V CGAP/NN/g] (R-C2)
4. Fee and total shown live while typing the amount. [V CGAP] (R-F1)
5. Transaction states (Draft ... Needs attention) with icon + word + colour; Pending says what happens next; Failed says whether money moved. [U/V] (R-T1 to R-T3)
6. Reference ID on every transaction, receipt and SMS. [V] (R-T4)
7. PIN screen repeats amount and recipient; PIN required for every money-out; biometric optional. [V/U] (R-A2, R-C6)
8. SMS OTP: single input, autofill (`one-time-code`, `@domain #code`), paste allowed, 6 digits, expiry at most 10 min (5 preferred), resend countdown. [V] (R-OTP1, R-OTP2, R-A3)
9. First-time payee/new-device/large-amount pause with plain "Did someone ask you to send this?" and "Gereo never asks for your PIN" on PIN/OTP screens and SMS. [S/U] (R-S1, R-S3)
10. Ledger is append-only; corrections as reversing entries; money never resolved by "last write wins". [V/U] (R-G5, R-O4)
11. Money-out is online-only with an explicit disabled explanation offline; drafts and votes queue with visible state. [V Android] (section 4)
12. Every tap target at least 48 x 48 dp; at least 8 dp apart. [V] (R-D1)
13. Text contrast 4.5:1 (3:1 large) and 3:1 for UI components; status never by colour alone. [V] (R-AC1, R-AC2)
14. Support OS font scaling to 200% and reflow at 320 px without clipping amounts. [V] (R-AC3)
15. Every icon has a visible label; bottom nav has four or fewer items with always-visible labels. [V/U] (R-I1, R-N1)
16. Everything critical works in SMS: OTP, receipts, vote deadline, contribution due, event reminder; SMS templates GSM-7 safe and under 160 chars. [V/U] (R-SMS1 to R-SMS4)
17. Errors say what happened, whether money moved, and the next action as a button; no blame words; keep user input. [V] (R-E2, R-MC2)
18. Self-service PIN reset and device recovery without agent. [V CGAP] (R-A4)
19. Votes: stated passing rule, deadline in absolute and relative time with zone, quorum progress, ability to change until close, outcome statement with next steps. [V Loomio] (R-VT1 to R-VT4, R-VT6)
20. Approval authorises exactly the details shown; any change voids approvals. [U] (R-AP3)

### P1 - Performance, offline, onboarding, comprehension

21. Performance budget enforced in CI: LCP at most 2.5 s on Lighthouse mobile throttling, JS per route under about 100 KB compressed, first-visit transfer at most about 300 KB. [V thresholds; U numbers] (section 3.4)
22. Test on a 1-2 GB RAM Android Go phone; app under 40 MB installed; startup under 5 s. [V] (R-P1)
23. Data-saver mode with a visible toggle and estimated Ar saved; images off by default in saver mode. [V mechanism] (R-P3)
24. Cached content renders immediately; skeleton only for first uncached full-page load; spinner within one module; progress bar for uploads over 10 s. [V NN/g] (R-L2)
25. Single sync indicator with last-updated time; item-level `Saved on this phone / Waiting to send / Sent / Confirmed`. [V web.dev] (R-O1, R-O2)
26. Persistent storage requested; stale-balance badge after 24 h. [V/U] (R-O6, R-O7)
27. Tiered KYC shown as "what you can do now / what unlocks next" with Ar limits; ask at the moment a limit is hit. [V CGAP/S FATF] (R-K1, R-K2)
28. ID/selfie capture with guided frame, on-device blur/glare check, resumable background upload, specific failure reasons. [S/U] (R-K3 to R-K5)
29. Assisted onboarding (agent/community facilitator) supported in KYC and PIN setup. [V Medhi/SARAL] (R-K6)
30. Plain language reviewed with real users in Malagasy and French; terms standardised and tested. [V CGAP/NN/g; U transfer] (R-I4, R-I5)
31. Layout survives 2x English length on short labels; pseudolocale in CI; measure real Malagasy/French ratios from the first 150 strings. [V W3C; U] (R-L10 to R-L12)
32. Audio hint (prerecorded human voice) on review/confirmation and onboarding screens. [V Medhi/CGAP] (R-V1)
33. No text in images; all UI strings are real text (WCAG 1.4.5). [V] (R-I6)
34. Rule builder as a 3-slot sentence with live preview from real history; combined "what happens when money arrives" summary; cycle detection with plain-language message. [V Reeder for principle; U shape] (R-RB1 to R-RB4)
35. Permission bundles with plain verbs and a per-member "Effective access" panel; diff on change. [V Reeder; U shape] (R-PM1 to R-PM3)
36. Group dashboard: headline sentences, ranked list with percent bars, member status chips, full ledger; Sankey optional and never alone. [S/U] (section 8.1)
37. Notifications: ask for permission after first value; conservative defaults; batch more than 5; per-type in-app toggles. [V NN/g] (R-NT2 to R-NT4)
38. Focus not obscured by sticky nav; screen-reader names unique per row with amount and counterparty; `role="status"` for confirmations. [V] (R-AC4, R-AC5)

### P2 - Polish and experimentation

39. Recent recipients first and contact picker for payee selection; repeat-payment shortcuts. [V CGAP #10/#11] (R-T6, R-N4)
40. Balance hide/show with per-device memory. [V CGAP #21] (R-M10)
41. Dark mode follows OS with manual override; both pass contrast. [V NN/g] (R-DM1)
42. Weekly digest by push/SMS summarising the group. [U] (R-G8)
43. Event RSVP as three one-tap states with payment linkage; reminders at 24 h and 2 h (A/B test). [U] (section 8.7)
44. Rule templates (4-6) for common cases. [S] (R-RB8)
45. Reduced-motion honoured; brief "sending" animation only when motion is allowed. [V] (R-AC6)
46. Optional visual money aid (banknote images) for large amounts after local testing. [V as CGAP prototype idea; U for Madagascar] (R-M5 note)
47. Decision Journal auto-entries link to the ledger entries they triggered. [U] (R-VT6)
48. Quiet hours and sender-named reminders. [U/S] (R-NT5, R-NT6)
49. Preview-as-member for permission managers. [U] (R-PM6)
50. Sankey "flow" view on 600 dp or wider only after comprehension testing. [U] (section 8.1)

---

## 11. Open questions and recommended user research

1. What is Vanilla Pay's actual amount encoding for MGA (x1 vs x100), name-lookup capability, confirmation latency and failure semantics? (Drives pending/failed copy and the confirmation-of-payee feature.)
2. Do target users read amounts in Ariary or francs, and do they read `5 000 Ar` correctly? Is `Ar` understood, or is `Ariary` clearer?
3. What are the real SMS delivery latencies and costs per operator (Telma, Orange, Airtel) for OTP? This sets resend timers and budget. No measurement found.
4. Malagasy text-expansion ratio and which dialect/standard to use for audio.
5. Comprehension test of ranked list vs stacked bar vs Sankey with 8-10 target users on a real group's data.
6. Test icon sets with 8-10 users per language group (CGAP stresses local prototyping; "?" and flat icons failed in Pakistan).
7. Determine regulatory tier limits for Madagascar mobile money/wallets and who is the regulated entity for KYC (not researched).
8. Smartphone ownership and OS/Android version distribution among target users to size the minimum Android version and the Go-edition constraint.
9. Confirm Play Store size guidance and current Build for Billions numbers (the Android pages read are dated).
10. Whether to ship PWA, native Android or both (see 3.5), given offline persistence and OTP autofill needs.

---

## 12. Source list (URLs cited)

Standards and platforms:
- WCAG 2.2 Understanding: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html , .../target-size-enhanced.html , .../contrast-minimum.html , .../non-text-contrast.html , .../use-of-color.html , .../reflow.html , .../text-spacing.html , .../images-of-text.html , .../animation-from-interactions.html , .../accessible-authentication-minimum.html , .../status-messages.html ; What's new: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- web.dev: https://web.dev/articles/vitals , https://web.dev/articles/performance-budgets-101 , https://web.dev/articles/offline-ux-design-guidelines , https://web.dev/articles/optimizing-content-efficiency-save-data , https://web.dev/articles/storage-for-the-web
- Chrome: https://developer.chrome.com/docs/identity/web-apis/web-otp ; Lighthouse throttling: https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- V8 cost of JavaScript: https://v8.dev/blog/cost-of-javascript-2019
- Android Developers: https://developer.android.com/guide/topics/ui/accessibility/apps , https://developer.android.com/guide/topics/ui/accessibility/principles , https://developer.android.com/topic/architecture/data-layer/offline-first , https://developer.android.com/identity/sign-in/biometric-auth , https://developer.android.com/docs/quality-guidelines/build-for-billions , .../building-for-billions-data-cost , .../building-for-billions-connectivity , .../building-for-billions-device-capacity , .../building-for-billions-ui
- Material Components Android (bottom navigation): https://raw.githubusercontent.com/material-components/material-components-android/master/docs/components/BottomNavigation.md
- Google SMS Retriever: https://developers.google.com/identity/sms-retriever/verify , https://developers.google.com/identity/sms-retriever/overview , https://developers.google.com/identity/sms-retriever/choose-an-api
- MDN OTP: https://developer.mozilla.org/en-US/docs/Web/Security/Authentication/OTP ; NIST SP 800-63B: https://pages.nist.gov/800-63-4/sp800-63b.html
- Unicode CLDR data: https://github.com/unicode-org/cldr-json (currencyData.json; numbers.json and currencies.json for mg, fr-MG, fr, en-MG)

NN/g:
- https://www.nngroup.com/articles/touch-target-size/ , /mobile-navigation-patterns/ , /hamburger-menus/ , /skeleton-screens/ , /response-times-3-important-limits/ , /mobile-ux/ , /confirmation-dialog/ , /error-message-guidelines/ , /progressive-disclosure/ , /empty-state-interface-design/ , /form-design-placeholders/ , /visibility-system-status/ , /dark-mode/ , /mobile-tables/ , /plain-language-experts/ , /tone-of-voice-dimensions/ , /push-notification/ , /ten-usability-heuristics/

GOV.UK Design System: https://design-system.service.gov.uk/patterns/confirmation-pages/ , /patterns/check-answers/ , /patterns/validation/

Fintech, inclusion, research:
- CGAP, Smartphones and Mobile Money: Principles for UI/UX Design (2016): https://www.cgap.org/sites/default/files/publications/slidedeck/principlesofsmartphonedesign05oct16-161005230428.pdf
- CGAP Findex 2025 blog: https://www.cgap.org/blog/findex-2025-why-financial-inclusion-needs-to-be-more-responsible
- Medhi, Gautama, Toyama, CHI 2009: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/medhi_chi2009.pdf
- Srivastava et al., SARAL, CSCW 2021: https://doi.org/10.1145/3449210 (PDF read from https://www.shivanikapania.com/assets/cscw2021paper.pdf)
- Low-literate Bangladeshi users and mobile financial services (2026): https://dl.acm.org/doi/10.1145/3811242.3819111
- GSMA Madagascar press release (2026-10-16): https://www.gsma.com/newsroom/press-release/gsma-digital-reforms-could-connect-1-12-million-more-people-in-madagascar-and-add-mga-4-1-trillion-to-gdp-by-2031/
- DataReportal: https://datareportal.com/reports/digital-2025-madagascar , https://datareportal.com/reports/digital-2026-madagascar
- Reeder et al. Expandable Grids, CHI 2008: https://reitermk.github.io/papers/2008/CHI2.pdf
- Loomio docs: https://www.loomio.com/docs/en/user_manual/polls/quorum , https://help.loomio.com/en/user_manual/polls/outcomes/index.html , https://www.loomio.com/docs/en/user_manual/polls/intro_to_decisions
- Ur et al. CHI 2014: https://dl.acm.org/doi/10.1145/2556288.2557420 ; CHI 2016: https://dl.acm.org/doi/10.1145/2858036.2858556
- Karlan et al.: https://www.nber.org/papers/w16205 ; https://www.nber.org/system/files/working_papers/w17952/w17952.pdf
- MicroSave digital ROSCA: https://www.microsave.net/2020/04/13/digital-rosca-the-new-kid-on-the-block/
- Science Advances e-ROSCA: https://www.science.org/doi/10.1126/sciadv.abc5831
- Gulf of Interpretation (CHI 2025): https://dl.acm.org/doi/10.1145/3706598.3713413
- Monzo: https://monzo.com/blog/take-five-stop-challenge-protect , https://monzo.com/blog/2020/05/04/confirmation-of-payee-launch
- Baymard cart abandonment: https://baymard.com/lists/cart-abandonment-rate
- Lyssna Wise vs Revolut: https://www.lyssna.com/blog/fee-transparency-ux-wise-vs-revolut/
- FATF Digital ID guidance: https://www.fatf-gafi.org/content/dam/fatf-gafi/guidance/Guidance-on-Digital-Identity.pdf
- Twilio SMS encoding: https://twilio.com/docs/glossary/what-sms-character-limit , https://www.twilio.com/docs/glossary/what-is-gsm-7-character-encoding , https://www.twilio.com/en-us/blog/best-practices-retry-logic-sms-2fa
- W3C i18n text size: https://www.w3.org/International/articles/article-text-size
- Smashing thumb zone: https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/
- NEI colour blindness: https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness
- Mailchimp voice and tone: https://styleguide.mailchimp.com/voice-and-tone/
- Madagascar: https://en.wikipedia.org/wiki/Malagasy_ariary , https://techafricanews.com/2025/11/27/madagascar-government-demands-real-immediate-internet-price-cuts-for-citizens/
