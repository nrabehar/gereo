# XCT: Cross-cutting rules for language, offline, low data and accessibility

Epic code XCT, release MVP. Follows [00-conventions.md](../00-conventions.md). These stories apply to every screen of every other epic. They are written as testable acceptance rules: a story here is "done" when the check it describes passes on the screens listed, and it stays a release gate for every later story.

## Sources used in the Conversation sections

| Short name | File |
| --- | --- |
| 03 mobile money | [03-madagascar-mobile-money.md](../../research/raw/03-madagascar-mobile-money.md) |
| 06 process | [06-design-process.md](../../research/raw/06-design-process.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption. Budgets and thresholds marked [U] are starting values to test, not facts.

## Conventions used in this file

- Message keys: UI strings of this epic use `xct.<area>.<name>`, the form `<epic>.<area>.<name>` with the epic's own code; errors use `err.xct.<code>`; the body of a push, SMS or in-app notification is only ever a `msg.<epic>.<event>` key (conventions 10.1). Every key exists in Malagasy, French and English.
- "Money screens" means every screen that shows an amount, a balance, a fee, a status chip or a PIN pad. The definition is the rule, not a list: any page that shows one of these is a money screen. The information architecture carries a flag per page, and a page that shows an amount without the flag is a defect.
- "Critical flows" means: sign-up and PIN (ACC-02, ACC-03), pay a contribution (CON-04), cast a vote (VOT-04), request and approve an expense (SPD-01, SPD-05), start a payout from a passed vote (VOT-03), deposit (WAL-06), withdraw (WAL-09, WAL-10), read the group ledger (CON-16).
- Permission names are written "Object: name". GRP Shared definitions owns the member permission catalogue and the bundles; conventions section 7 lists names only. This epic needs no new permission. Decision D2 (see [05-decisions.md](../05-decisions.md)) added Wallet: freeze, Wallet: create, Group: view audit log, Group: set spending policy and Group: set notification settings; XCT-06 uses Wallet: freeze and XCT-04 uses Group: view audit log. Operator permissions are a separate catalogue owned by OPS-01.
- SMS keys: an SMS template is a message key of the form `msg.<epic>.<event>.sms` (conventions 10.1). The lint of XCT-12 enforces the key grammar, catalogue membership and the length rule; keys that start with `sms.`, `push.` or `ntf.` are not valid message keys (the `ntf.*` parameter family is exempt).
- Test devices: a real Android Go phone with 1 to 2 GB RAM (design foundations section 4), a mid-range Android phone, and a desktop browser with mobile emulation. Network profile for automated tests: Lighthouse mobile throttling (round trip 150 ms, 1.6 Mbps down, 750 Kbps up, 4x CPU slowdown) (07 UI/UX 3.4 [V]).
- Nothing here writes a ledger entry unless stated. Where a story touches money display or money queueing, the ledger rules are called out.

## Configurable parameters

| Parameter | Starting value | Source or status |
| --- | --- | --- |
| `STALE_BALANCE_HOURS` | 24 | 07 UI/UX 4 R-O7 [U]. Owned by XCT-04: the one name for the age after which a cached balance is flagged. WAL, CON and ACC cite this name and drop `STALE_BALANCE_AFTER` |
| `CACHE_LEDGER_DAYS` | 60 | Middle of the 30 to 90 range in 07 UI/UX 4 [U]. A 60-day window covers two monthly contribution cycles, the longest period a member checks in a meeting. Revisit after field tests |
| `CACHE_RECENT_TRANSACTIONS` | 50 per wallet | Owned by XCT-04. WAL, CON and ACC cite this name and drop `OFFLINE_CACHE_DEPTH` |
| `CACHE_MAX_MB` | 10 | Owned by XCT-04. Sized for 1 to 2 GB Android Go phones; no epic may raise it or add its own cache. WAL, CON and ACC cite this name and drop `OFFLINE_CACHE_MAX_MB` |
| `QUEUE_MAX_RETRIES` | 6, with delays of 5 s doubling up to 15 min | 07 UI/UX 4 R-O3. Owned by XCT-05. Only attempts made while connected count. After the sixth failure an auto-send item shows `Not sent. Retry` and stays; vote ballots never stop at the cap (XCT-05 criterion 5) |
| `QUEUE_VOTE_MIN_MINUTES` | 2 | Owned by XCT-05. A ballot is queued only if the deadline is more than this many minutes away (XCT-05 criterion 3) |
| `QUEUE_BALLOT_WARN_MINUTES` | 60 | Owned by XCT-05. Time before the deadline from which a still-queued ballot shows the warning `xct.queue.ballot_deadline_warning` (XCT-05 criterion 3). Starting value [U], to test in field interviews |
| `QUEUE_ITEM_MAX_DAYS` | 7 | Owned by XCT-05. An auto-send item older than this becomes Expired with a visible message saying nothing changed; drafts are exempt (XCT-05 criterion 5) |
| `QUEUE_KYC_MAX_DAYS` | 3 | Owned by XCT-05. Self-expiry of a queued KYC photo (XCT-05 criterion 13) |
| `QUEUE_KYC_MAX_CASES` | 10 per device | Owned by XCT-05. Also bounds ACC-10 assisted onboarding on a facilitator's phone |
| `QUEUE_MAX_MB` | 12 | Owned by XCT-05. A queue budget separate from `CACHE_MAX_MB`; cache eviction never touches it (XCT-05 criterion 12) |
| `TIME_SKEW_TOLERANCE_SECONDS` | 120 | Device clock against server time before `xct.time.check_clock` appears (XCT-03 criterion 5) |
| `PENDING_TO_ATTENTION` | not defined here | The age after which a dispatched payout that is Pending becomes Needs attention is `PAYOUT_PENDING_ALERT_MINUTES`, owned by OPS-13. This epic shows no number and only uses it |
| `SPELLED_AMOUNT_FROM_AR` | 100 000 | Amount from which the review screen spells the amount in words (07 UI/UX 2.1 R-M5). Typical contributions are 10 000 Ar; 100 000 has six digits and is the first amount where a missed zero is costly |
| `CONTRAST_TARGET_AMOUNT` | 7:1 | Contrast target for amounts and primary button labels, the WCAG AAA level, for outdoor use (07 UI/UX 7 [U]) |
| `DATA_COST_AR_PER_MB` | about 5 | design foundations section 1, point 3 [V/S]; used only for the saver estimate |
| `LARGE_DOWNLOAD_CONSENT_MB` | 2 | About 10 Ar at `DATA_COST_AR_PER_MB`. 07 UI/UX 3.4 R-P6 |
| `SMS_MAX_CHARS` | 160 | GSM-7 single segment (07 UI/UX 4 [V]). One non-GSM character switches the message to UCS-2 at 70 characters per segment (XCT-12) |
| Name, title and place length in SMS | owned by NTF-07 | `ntf.sms_group_name_max`; starting values 20 characters for a group name and 12 for a first name; `ntf.sms_title_max` and `ntf.sms_place_max` for event and vote titles and places. XCT-12 uses them for the worst-case test and defines no second parameter |
| `PSEUDO_EXPANSION` | 1.6 times plus accents | 07 UI/UX 6.4 R-L11 [S] |
| Performance budgets | see XCT-11 | design foundations section 4 |

Owners: XCT-04 owns the four `CACHE_*` and `STALE_*` parameters; XCT-05 owns every `QUEUE_*` parameter listed above; the other rows are owned by the XCT story that uses them unless the row says otherwise.

---

## Stories

### XCT-01 Switch language at any time, with Malagasy as a first-class language

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a person using Gereo, I want to switch between Malagasy, French and English from the first screen and from Settings, and see every screen, message and SMS in my choice, so that I never have to use a language I do not read well.

**Conversation:** No competitor has a Malagasy interface and MVola reviewers ask for more languages (design foundations section 1, point 5; 08 competitor UX 6.14), so Malagasy is a differentiator and a cost. First-class means: complete at launch, reviewed by a native speaker, tested in layout and in user testing, and listed on the same footing. The AI assistant drafts but every Malagasy string needs a human (design foundations section 2; 06 process 5.4). Members of one group may prefer different languages, so language is personal and a group's default language never overrides it (07 UI/UX 6.4 R-L13). Fallback is Malagasy to French to English per key and never a raw key (06 process 5.1). Evidence on dialect: official Malagasy and regional speech differ and were not measured (06 process 2.5).

**Preconditions:** None; works before sign-up.
**Trigger:** Person taps the language control on the first screen (ACC-01) or in Settings, or a notification is generated for them.

**Acceptance criteria:**
1. Happy path. A language control is visible on the first screen and reachable in at most two taps from Home and from Settings. It lists `Malagasy`, `Francais` and `English` in that order, each written in its own language, same size.
2. Happy path. Switching applies at once with no reload and no loss of state: text typed in a form, the scroll position, the open step in a flow and any queued items are kept. Language-dependent content such as the amount in words and dates re-renders in the new language.
3. Business rule. The choice is stored on the device for visitors and in the profile after sign-up (ACC-06). It decides the language of push messages, SMS and emails sent to that person from then on, including already scheduled reminders that have not been sent.
4. Business rule. A group's default language is only a default for group-created content (for example announcement drafts) and never changes anyone's interface. Content written by a member is displayed as written and is not machine-translated.
5. Business rule, completeness. Release gate: 100% of keys used by the P0 stories exist in Malagasy, French and English and are marked reviewed by a native speaker. A missing Malagasy key falls back to French, then English, and the app logs a missing-key event. The build fails if a key is missing from the French or English file; a missing Malagasy key is a release blocker for P0 screens.
6. Business rule, money-critical strings. The strings for balance, pending, failed, cancel, confirm, send, and vote result are back-translated and checked by a second reviewer before launch (06 process 5.4, step 4).
7. State. The language chosen on the first screen is downloaded with the first visit; the other two download when first chosen and are cached after that (in a native build all three are bundled). Offline, a language already used switches at once. A language not yet downloaded shows `Needs a connection, about {size} MB`, and the other languages keep working. A pack above `LARGE_DOWNLOAD_CONSENT_MB` asks first (XCT-07).
8. Errors. If a language pack fails to load, the app stays in the current language and shows `err.xct.language_not_loaded` with `Try again`. No screen is ever blank or showing keys.
9. Accessibility and language. The `lang` attribute is set on the page, and on any passage in another language (for example a French member name inside Malagasy text). Plural and gender forms use a message format, not string concatenation (XCT-14).
10. Notifications. Language of the SMS and push follows the profile (see NTF); the SMS key table lists the three versions of each template (XCT-12). Audit entry only for the change of the profile language (ACC-06).

**Data:** User (language), Device (language, local), message catalogue.
**Depends on:** ACC-01, ACC-06, XCT-12, XCT-14.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: regional dialects get no variants in the MVP. One official Malagasy is shipped, written in plain everyday words, because no evidence shows which dialects fail and a second variant doubles the review cost (06 process 2.5). Field interviews test comprehension and can reopen this after launch. Open, needs a native speaker and field interviews: the exact register and glossary, and the named native reviewer and review time (a launch dependency). Default used: official Malagasy with the glossary of XCT-14, drafted by the team and reviewed by a native speaker before the P0 gate of criterion 5.

---

### XCT-02 See every amount as whole ariary with spaces, the same in every language

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none
**Tags:** ledger

**Story:** As a member, I want every amount to be written as whole ariary with a space between thousands (for example `12 500 Ar`) in the same way in Malagasy, French and English, so that I never misread a number or a fee.

**Conversation:** Money is integer ariary, never floats (00-conventions section 2). Rounding a float changed 1250000.5 into 1250001 in a verified run (07 UI/UX 2.1 R-M1). The CLDR defaults conflict: `1,250` is one thousand two hundred fifty in Malagasy and English but 1.25 in French, so one shared space-grouped format removes the ambiguity (07 UI/UX 2.1 R-M3). ISO 4217 lists minor units for MGA while CLDR says none, which is an integration trap with any payment provider (07 UI/UX 2.1; design foundations section 4). The Malagasy locale in standard libraries is thin, so we ship our own formatting (07 UI/UX 2.1). Large numbers with many zeros are hard to read; CGAP suggested showing large amounts visually (R-M5), which we do as a spelled-out line.

**Preconditions:** Any screen, message or export that shows an amount.
**Trigger:** An amount is displayed, typed, exported or sent in a message.

**Acceptance criteria:**
1. Happy path, display. The same function formats every amount shown in the interface. Required results (test table): 0 gives `0 Ar`, 999 gives `999 Ar`, 1000 gives `1 000 Ar`, 12500 gives `12 500 Ar`, 1250000 gives `1 250 000 Ar`, 100000000 gives `100 000 000 Ar`. No decimals, no symbol before the number, one space before `Ar`, and results are identical for the three languages. XCT-02 owns the amount format; other epics cite it and never restate it.
2. Business rule, no wrap. The grouping spaces and the space before `Ar` are non-breaking, so an amount never splits across two lines, at any font size (XCT-08). Right-aligned amounts in lists use equal-width digits so columns scan.
3. Business rule, integers. Amounts are stored, computed and transmitted as integers in ariary. The server rejects any amount with a fraction or exponent form (`12500.5`, `1e4`) with `err.xct.amount_not_whole` and never rounds it. A unit test pins that 1250000.5 is rejected, not changed to 1250001. How the provider encodes amounts (minor units or whole) is covered by the adapter test before the first money flow.
4. Business rule, input. Amount fields open a numeric keypad, regroup digits live as the person types, and echo the formatted amount in large type. A single `.`, `,` or space followed by exactly three digits is read as a thousands separator, so pasted `12 500`, `12500`, `12.500` and `12,500` are all accepted as 12 500. Any other separator use (`12.5`, `12.50`, `1.250.5`), an exponent form or letters is rejected with the same error, and the field keeps what the person typed.
5. Business rule, direction and sign. Money in and out use words plus icon plus colour (`Received +5 000 Ar`, `Sent -5 000 Ar`), never colour or sign alone (XCT-09). A fee is always its own labelled line, including `Fee: 0 Ar` when free (07 UI/UX 2.5 R-F3). The rounding amount of a split that is credited to Gereo (decision D5, RUL-07, conventions section 10) is its own labelled receipt row (`ledger.rounding_line`) and is never merged into a destination's amount. In the app there is one aggregated Rounding row per original income; per-hop lines appear only in exports; no row appears when the amount is 0; the amount is always under 1 ariary per destination, so under N Ar for N destinations (RUL-07 holds the test vector). SMS receipts omit the row and their total includes it (criterion 8).
6. Business rule, review. For amounts at or above `SPELLED_AMOUNT_FROM_AR`, the review screen adds a line that spells the amount in words in the person's language (the Malagasy wording is reviewed by the native reviewer of XCT-01). The total on review equals the amount debited, to the ariary (07 UI/UX 2.5 R-F4).
7. State, exports and receipts. Receipts, statements and CSV or PDF exports show the code `MGA` where the currency must be unambiguous (`12 500 MGA`); a CSV also contains a raw integer column with no spaces so spreadsheets can sum it.
8. State, SMS. SMS use a normal space, not a non-breaking space, because a non-breaking space is not in the GSM-7 set and would turn the whole message into UCS-2 (XCT-12 checks this). An SMS receipt shows no Rounding line; its total includes the Rounding amount.
9. Accessibility. A screen reader reads an amount as a number in the person's language plus "ariary", not as digits with spaces. The percent sign is written without a space (`25%`) in every language, in the app and in SMS, because a space before `%` would need a non-breaking space that GSM-7 does not allow (criterion 8). A lint fails the build on `25 %`.
10. Ledger and audit. The formatter never changes a stored value; a test compares the stored integer with the displayed text for 1 000 random amounts per language. No ledger entry is written by this story.

**Data:** Ledger entry, Transaction (amount fields), message catalogue.
**Depends on:** WAL-14 (transaction receipt), WAL-16 (export), WAL-18 (reversing entries), RUL-07 (Rounding), XCT-01, XCT-08, XCT-12.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the adapter converts at one place, whole ariary inside Gereo, and an adapter test pins the conversion with a sandbox payment before any money flow. Closed: no franc hint in the MVP (1 Ar equals 5 fmg), because adding a second unit to a money screen risks confusion more than it helps; field interviews can reopen it (07 UI/UX 2.1 R-M6). Closed: percent style is `25%` (criterion 9). Closed: `SPELLED_AMOUNT_FROM_AR` is 100 000.

---

### XCT-03 See dates, times and deadlines in Madagascar time, in words where it matters

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none

**Story:** As a member, I want every date and deadline in Madagascar time, written the same way for everyone, so that I do not miss a vote or a contribution because of a date I misread.

**Conversation:** Votes and contributions run on deadlines, and a deadline that is read wrong costs a vote or a late fee. Votes must show the deadline in absolute and relative time with the zone (07 UI/UX 10, item 19; design foundations section 4). Madagascar uses UTC+3 (verified in a local ICU run, 07 UI/UX 2.1 R-M9). The Malagasy locale in standard libraries falls back to abbreviations for relative time, so Malagasy relative phrases are hand-written (07 UI/UX 2.1). Numeric dates are a trap: the French short form is day, month, year and US order must never appear. Whether users abroad (a diaspora member) need their own zone is open.

**Preconditions:** Any screen, message or export that shows a date or time.
**Trigger:** A date or time is displayed, typed, scheduled or sent.

**Acceptance criteria:**
1. Happy path. All dates and times are stored in UTC and displayed in Madagascar time (Indian/Antananarivo, UTC+3). A deadline shows the zone: `Fri 24 Oct, 17:00 (Madagascar time)`. The zone label is a translated string, not a code. XCT-03 owns the date and time formats; other epics cite it and never restate it.
2. Business rule, forms. Confirmation screens, receipts and notifications write the month in words in the person's language (`19 octobre 2026`, `19 Oktobra 2026`, `19 October 2026`). Dense lists may use the numeric form `19/10/2026` (day, month, year). Month-first order never appears in any language.
3. Business rule, time. Times use the 24-hour clock (`17:00`) in all languages. "Today", "tomorrow" and weekday names are translated by hand-written strings; the build fails if a relative-time key is missing in Malagasy.
4. Business rule, deadlines. Every deadline shows both the absolute time and the time left (`in 2 hours`, `closes tonight 17:00`). Time left updates when the screen is open, and once passed shows `closed 17:00`, never a negative countdown.
5. Business rule, device clock. If the device clock differs from the server time by more than `TIME_SKEW_TOLERANCE_SECONDS`, the app shows `xct.time.check_clock` and uses the server time for all deadlines, so a wrong phone clock cannot extend a vote or hide a late payment.
6. State, offline. Cached deadlines still show absolute time; relative time is computed from the device clock and marked `about` offline; a vote queued offline shows `Not counted yet. Connect before Fri 17:00` (label key defined in XCT-05 criterion 11).
7. Business rule, other zones. If the device zone is not UTC+3, the app still shows Madagascar time only, with the zone label of criterion 1 on every deadline. It never converts to the device zone and there is no setting for it in the MVP. A test sets the device to another zone and checks that every deadline, receipt and reminder shows the same text as on a device in Madagascar.
8. Errors. An invalid date typed in a field is flagged next to the field with the expected form and an example; the person is not blamed and the typed text is kept.
9. Accessibility and language. A screen reader reads a deadline as a sentence in the person's language. Date pickers use large targets (at least 48 dp) and can also be typed.
10. Ledger and audit. Ledger and audit entries store UTC and the ISO form; exports show ISO with the `+03:00` offset (ACC-14). A test checks the same deadline in the three languages and with a device in another time zone.

**Data:** every object with a date: Transaction, Vote, Event, Contribution plan, Audit entry.
**Depends on:** XCT-01, XCT-05. Used by VOT-05, VOT-08, EVT-01, CON-01, CON-03, ACC-14, ACC-16.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: users abroad see Madagascar time only in the MVP (criterion 7), because every deadline in the product is a Madagascar deadline and a second time on screen is a second chance to misread it; a diaspora zone is a Later item. Closed: no daylight saving is planned, and a test pins the UTC+3 offset for every day from 2026 to 2036 so that a time-zone data change is caught in the build.

---

### XCT-04 Read my key information with no connection, and see when it was last updated

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** none (the same permissions apply as online; a cached view never shows more than the person may see)
**Tags:** offline

**Story:** When I have no signal or no data, I want to open the app and still read my balances, my group's recent history, what I owe and what votes are open, with a clear time of last update, so I can answer a question in a meeting without asking someone else.

**Conversation:** Offline read access to balances and recent history is a stated differentiator (competitive analysis section 5). Read-only offline views with last-synced time are the adopted pattern; queuing money silently is rejected (08 competitor UX 6.13). The guidance is to say what still works, show freshness and avoid the word "offline" for non-technical users (07 UI/UX section 4; web.dev guidance as cited). Stale balances are dangerous, so they carry a badge after a threshold (R-O7 [U]). A PWA cache can be wiped on a low-storage phone unless persistent storage is requested (07 UI/UX 3.5, R-O6). Cached money data is also a privacy risk on a lost phone (ACC-12).

**Preconditions:** The person has signed in at least once on this device and the app has synced.
**Trigger:** The app opens or is used while the device has no usable connection.

**Acceptance criteria:**
1. Happy path. With no connection, the app opens to Home from cache within the performance budget (XCT-11). The header shows one indicator: `Updated 14:05`, `Updating...` or `Not updated since yesterday. Retry`, with a retry button. The word "offline" is not used; the text is "No connection" with what still works.
2. Business rule, what is cached. Each item shows `Updated {time}`. Own wallets and balances; the last `CACHE_RECENT_TRANSACTIONS` transactions per wallet; the group ledger for the last `CACHE_LEDGER_DAYS`; member list; contributions due and status (CON); open votes and events; the decision log; tasks; rule definitions, the combined summary, firing history and cap and goal readings (RUL); permission bundles; the approvals inbox, request detail and receipts (the last 50 requests for the active wallet and the last 10 for each other wallet); receipts and reference IDs; the freeze state of each wallet as last synced. Receipts can be shared as image, PDF or text while offline. Never cached, because they need a connection: the audit log (Group: view audit log), so a cached view never includes audit log data; identity documents and selfies; other people's full phone numbers beyond what the member list already shows; anything from the operator back office; and, by default, attachment bodies and photos. Queued KYC photos are not cache: they are queue items with their own rules (XCT-05 criterion 13), and identity documents are still never cached. Cached money data follows the same permissions as online (Wallet: view balance, Wallet: view history). A cached request never shows Approve to its requester (D1); Approve is disabled offline (XCT-06) and, after reconnect, the action re-reads server state first. Wallet: freeze is online-only and not queueable (XCT-06 criterion 1); the cache shows only its last synced state. XCT-04 is the sole owner of the indicator, freshness, storage, unlock, erase, the never-cached list, the freeze state, ledger days, group data and the parameters `STALE_BALANCE_HOURS`, `CACHE_RECENT_TRANSACTIONS`, `CACHE_MAX_MB` and `CACHE_LEDGER_DAYS`. No epic may raise `CACHE_MAX_MB` or add its own cache, and other epics must not restate this list or its exclusions; they cite XCT-04.
3. Business rule, permissions. The cache stores only what the person may see at the last sync. If a permission was removed online, the next sync removes the data, and the app never shows a screen that was not allowed. Cached data is readable only after app unlock (ACC-03) and is deleted on sign-out or emergency lock (ACC-11, ACC-12).
4. State, freshness. Each cached screen shows `Updated {time}` near its title. A balance older than `STALE_BALANCE_HOURS` shows a `may be outdated` badge (icon plus word), and the money-out button explains that the balance is checked again when sending (XCT-06).
5. State, empty and loading. The app never shows "No data" before the load completes. On a first launch with an empty cache and no connection, it shows `xct.offline.first_launch` (what Gereo needs and `Retry`) and not an empty list. A section whose cache is empty because the person has no data shows the normal empty state, and not a connection error.
6. State, background refresh. When the connection returns, the app refreshes in the background without a full-screen loader. Changes since the last view are flagged with a small `Updated` mark; the person's scroll position and open item are kept.
7. Business rule, storage. The app asks for persistent storage and tells the person what is stored and how big (`xct.storage.what_is_saved`). When storage is full, cached data is trimmed in the order of XCT-05 criterion 12 and queued items are never touched. If the browser evicts the cache, the next open shows `xct.offline.cache_cleared` and restores on connection; nothing is lost on the server.
8. Errors. A failed refresh on a weak connection keeps the cached data and shows `Not updated since 14:05. Retry`; it does not clear the screen. A server error shows the same message without the word "error".
9. Notifications and ledger. None sent. The cache is a copy: the ledger is server-authoritative and append-only, and nothing in the cache can create or edit a ledger entry (07 UI/UX 4 R-O4).
10. Accessibility and language. The status text is announced politely (status region) when it changes, not on every second. Last-synced time uses the date rules of XCT-03.

**Data:** local cache of Wallet, Ledger entry, Transaction, Contribution, Vote, Event, Wallet rule, Membership.
**Depends on:** ACC-03, ACC-11, ACC-12, XCT-03, XCT-05, XCT-06, XCT-11. Used by WAL-17 (the wallet slice of XCT-04; WAL, CON and ACC cite its parameter names), WAL-02, GRP-06, CON-03, CON-16, VOT-05, VOT-16, EVT-08.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `CACHE_LEDGER_DAYS` is 60, `CACHE_RECENT_TRANSACTIONS` is 50 and `CACHE_MAX_MB` is 10 (parameters table). If storage is refused or full, the app trims in the order of XCT-05 criterion 12 (attachment bodies are never cached, then the oldest ledger days, rules history, the decision log, then receipts of non-active wallets) and always keeps balances, open votes and what the person owes. Closed: the MVP is a PWA only; a native Android build is added only if field tests show the browser evicts the cache or cannot autofill the OTP, which are the two things a native build would fix (07 UI/UX 3.5). XCT-11 criterion 6 applies only if that build exists. Closed: no extra encryption layer on the cache in the MVP. Protection is the unlock gate, erase on sign-out and emergency lock, the exclusion list of criterion 2 and the hidden-balance setting (WAL-19); Android encrypts app storage by default. A security review before general availability decides whether to add a PIN-derived key; it is not a launch blocker.

---

### XCT-05 Queue the things that can wait, with a visible state, and reject the rest

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** the same permission the action needs online
**Tags:** offline

**Story:** As a member with a bad connection, I want to write a draft, an RSVP or a vote and see that it is waiting to be sent, so that I know it is not lost and what to do if it is too late.

**Conversation:** Android's own offline guidance separates online-only actions (bank transfers), queued actions and lazy writes (07 UI/UX section 4). Items must never be ambiguous: every item shows one of the states of criterion 11 (R-O2). XCT-05 is the single owner of the device queue; an action absent from Table A is not queueable. Conflicts: the ledger is server-authoritative; for drafts use per-field merge and show both versions, since last-write-wins silently drops edits (R-O4). A vote queued past its deadline needs a clear, logged outcome (R-O5). This story defines the registry of what may be queued; money movement is XCT-06.

**Preconditions:** The device has no connection or a very slow one.
**Trigger:** Person completes a queueable action.

**Acceptance criteria:**
1. Happy path. A queueable action (Table A) completed offline is saved on the phone at once and shows `Waiting to send`. When the connection returns it is sent in order, then shows `Sent`, and `Confirmed` once the server accepts it.
2. Business rule, registry. Device storage is described by two registries and one index, given as tables after this list. Table A (auto-send) lists the only actions that send themselves when the app is open with signal. Table B (local drafts) lists items that are saved on the phone, are never sent without a tap and are not queue items; the sending step of every draft is online only. Table C is a readable index of actions that are never queued, generated from the same data; it is not a second source of truth. Default-deny stays the enforceable rule: an action absent from Table A is not queueable and is disabled when there is no connection, showing `xct.offline.money_blocked` for money-out (XCT-06) and `xct.offline.needs_connection` for every other action. These two keys are defined once here; the `wal.offline.*` keys, the RUL-01 offline key, `acc.offline.cannot_*` keys that only mean a connection is needed, and the SPD-01 text `Sending needs a connection` are replaced by them in a sweep. Every row names its owner story, its server endpoint and a side-effect class (ledger, approval, membership, permission, creation, authorisation, none). Guard test: it reads the registry data (endpoint and side-effect class) and fails if any Table A row has a class other than `none`, with exactly one allowlisted exception, `membership-self` for invite accept. A second assertion: a Table A row flagged authorisation-restricted (manual decision entry and decision amendment) can never be referenced as the authorising vote of a payout (D4, SPD-10) and never counts toward a quorum or an approver count. Manual entries and amendments keep the badge `Recorded by {name}, not a vote` through amendments and keep the original text visible. A ballot on a vote about money is allowed because the ballot moves no money; any payout that follows is started by the server after the vote closes (VOT-03, XCT-06). A new entry needs a recorded decision and the test.
3. Business rule, votes. A vote may be queued only if its deadline is more than `QUEUE_VOTE_MIN_MINUTES` away; the screen then says `Not counted yet. Connect before {deadline}` and `Reminders may still arrive until a queued ballot is sent; the server cannot know about queued ballots`. A ballot is one per (voter, vote), decided by server receipt order and never by client time; the queued ballot carries a client timestamp and device ID for audit only, and the server records the receipt time. Guest voters on the light vote page cannot queue: their ballot is not queueable (ACC-16, VOT-06). Authority vote (the money-vote half owned by VOT "Kinds of vote", with the floor owned by GRP-13): a queued ballot shows `Waiting to send` until the server has received it, and only ballots received by the server before the close count toward the floor; the floor is evaluated at close and never from client time or a queued ballot. When the deadline is less than `QUEUE_BALLOT_WARN_MINUTES` away and the ballot is still queued, the voter sees the warning `xct.queue.ballot_deadline_warning` ("Your answer has not been sent. It only counts once Gereo receives it before {deadline}.") with `Retry now`. This story restates no floor number; it cites GRP-13 and VOT.
4. Business rule, too late. If the deadline passes while the item is queued, the server rejects it and the person sees `Too late: voting closed 17:00, your answer arrived 17:04`. Only a visible, logged action by a person who holds Vote: edit can extend it (VOT-12); the queue never reopens a vote and there is no grace window (VOT-18). Scripted test: a ballot queued with 3 minutes left and signal returning after 4 minutes gives Too late.
5. Business rule, visibility and retries. The queue count and age are visible (`2 items waiting since Mon`) with `Retry now`. Only attempts made while connected count against `QUEUE_MAX_RETRIES` (6). Backoff resets on the connectivity-regained event and when the app is opened or returns to the foreground, and the queue then sends immediately. Vote ballots never stop at the cap: they keep retrying until the ballot deadline. Other auto-send items show `Not sent. Retry` at the cap and stay. An auto-send item older than `QUEUE_ITEM_MAX_DAYS` becomes Expired with a visible message saying nothing changed (drafts are exempt). Because the MVP is a PWA and nothing sends while it is closed, every item in Waiting to send shows `Open Gereo when you have signal`. The app never drops an item silently.
6. Business rule, conflicts. For drafts, tasks and notes the app merges per field and shows both versions (`Your change` and `{name}'s change`) when two people edited the same field; it never overwrites without telling. The server never accepts a queued item that conflicts with a ledger fact (for example a proof attachment for a request on a wallet since closed); it returns the item with a reason. At receipt the server also re-validates permission and membership (not only ledger conflicts) and rejects with a reason when either is gone. Scripted test: two devices queue two ballots for one voter and one vote, and the server keeps one, by receipt order.
7. Business rule, idempotency. Each queued item has a client-generated ID; resending after a timeout never creates a duplicate on the server. For ballots the key is (voter, vote).
8. State. Queued items survive the app being killed and restarted. A queued item names its owner story in the data and in the UI. Sign-out with items in the queue warns first and shows the count (ACC-12). A person can cancel a queued item before it is sent (state Withdrawn).
9. Errors. A rejected or expired item shows the reason in plain words and says whether anything changed; no money has moved for any queueable action. Where a rejection needs a person to act, the item shows a button for it.
10. Ledger and audit. Queueable actions write no ledger entry when queued. When accepted by the server, normal audit entries are written with both the client timestamp and the server receipt time.
11. State vocabulary. Queue states are Waiting to send, Sent and Confirmed, plus the terminal states `Not sent. Retry`, Too late, Withdrawn and Expired. Every local draft uses the one label `Draft, not sent`; `Saved on this phone` is retired as a label everywhere. For ballots the voter sees `Received` when the state is Confirmed; `Counted` is shown only in vote results and only for a ballot that counts toward quorum (D4, two distinct voters other than the requester); a queued ballot shows `Not counted yet. Connect before {deadline}`. Every label is a keyed string (`xct.queue.waiting`, `xct.queue.sent`, `xct.queue.confirmed`, `xct.queue.not_sent_retry`, `xct.queue.too_late`, `xct.queue.withdrawn`, `xct.queue.expired`, `xct.queue.draft`, `xct.queue.ballot_received`, `xct.queue.ballot_not_counted`, `xct.queue.ballot_deadline_warning`, `xct.queue.open_when_signal`) defined only in XCT-05. CI lint: fail if any file under the stories folder other than XCT.md contains the literal label texts; other epics use the keys.
12. Storage. The queue requests persistent browser storage and has its own budget `QUEUE_MAX_MB`, outside `CACHE_MAX_MB`. Cache eviction trims cached data in this order: attachment bodies (never cached), then the oldest ledger days, rules history, the decision log, then receipts of non-active wallets; it never touches queued items. If the browser evicts queued items anyway, the next open shows `N items were lost` and lists them by owner story. Scripted test: the queue survives a cache eviction.
13. KYC photos. Capture happens inside the app only, with no copy in the gallery. Queued photos are encrypted at rest with a non-extractable WebCrypto key; the honest limit is that the key sits on the same device, so this protects against casual copying and not against an unlocked phone, and the security review decides on more. Local copies are deleted when the server answers Confirmed, on sign-out (ACC-12), on remote wipe or emergency lock (ACC-11 criterion 2), and at `QUEUE_KYC_MAX_DAYS`. The sign-out warning shows the number of KYC items and says plainly that they will be lost; KYC photos are deleted even if the person keeps other items. At most `QUEUE_KYC_MAX_CASES` cases are queued per device, which also bounds ACC-10 assisted onboarding on a facilitator's phone. Scripted test: KYC wipe on sign-out.

**Registry tables for criterion 2.** Endpoints are working names to be fixed by the API design; the registry data file is the source and the tables are generated from it.

Table A: Auto-send (items that send themselves when the app is open with signal)

| Action | Owner story | Endpoint | Side-effect class | Label key |
| --- | --- | --- | --- | --- |
| Vote ballot | VOT-18 | `POST /votes/{id}/ballots` | none | `xct.queue.action_ballot` |
| RSVP | EVT-04 | `PUT /events/{id}/rsvp` | none | `xct.queue.action_rsvp` |
| Personal date and personal note | EVT-10 | `POST /me/dates`, `POST /me/notes` | none | `xct.queue.action_personal_item` |
| Task create, task update including status, and note | PRJ-04 | `POST /projects/{id}/tasks`, `PATCH /tasks/{id}`, `POST /tasks/{id}/notes` | none | `xct.queue.action_task` |
| Decision attachment upload | PRJ-07 | `POST /decisions/{id}/attachments` | none | `xct.queue.action_decision_attachment` |
| Proof attachment added to an already-sent expense request | SPD-03 | `POST /expense-requests/{id}/attachments` | none | `xct.queue.action_proof_attachment` |
| Support-ticket message | OPS-06 | `POST /tickets/{id}/messages` | none | `xct.queue.action_ticket_message` |
| Report this payment | WAL-14 | `POST /transactions/{id}/reports` | none | `xct.queue.action_report_payment` |
| Manual decision entry | VOT-14 | `POST /groups/{id}/decisions` | none, flagged authorisation-restricted | `xct.queue.action_manual_decision` |
| Decision amendment | VOT-15 | `POST /decisions/{id}/amendments` | none, flagged authorisation-restricted | `xct.queue.action_decision_amendment` |
| Notification preference changes and read marks | NTF-01, NTF-03, NTF-04, NTF-10 | `PUT /me/notification-preferences`, `POST /me/notifications/read` | none | `xct.queue.action_notification_prefs` |
| KYC photo upload, resumable | ACC-08 | `PUT /identity-checks/{id}/photos` | none | `xct.queue.action_kyc_photo` |
| Invite accept | GRP-04 | `POST /invitations/{id}/accept` | membership-self (the one allowlisted exception) | `xct.queue.action_invite_accept` |

The authorisation-restricted flag is a separate field from the side-effect class, so these two rows pass the guard test with class `none` and are additionally covered by its second assertion.

Table B: Local drafts (saved on the phone, never sent without a tap, not queue items; all use the label `Draft, not sent`, key `xct.queue.draft`)

| Draft | Owner story |
| --- | --- |
| Expense request draft | SPD-01 |
| Announcement draft | ANN-01 |
| Group form draft | GRP-01 |
| Group edit draft, including rules text | GRP-18 |
| Vote-creation draft | VOT-02 |

Table C: Never queued (index only; the owner story decides, and this table is not a second source of truth)

| Actions | Owner stories | Offline key |
| --- | --- | --- |
| Money-out of any kind (the list is XCT-06 criterion 1; it is not copied here) | XCT-06 | `xct.offline.money_blocked` |
| Spend approve, reject, cancel and freeze | SPD-05, SPD-06, SPD-07, SPD-12, SPD-15 | `xct.offline.money_blocked` |
| Contribution pay | CON-01, CON-04 | `xct.offline.money_blocked` |
| Group, wallet and project creation | GRP-01, WAL, PRJ-01 | `xct.offline.needs_connection` |
| Permission, role and membership changes by others | GRP-07 | `xct.offline.needs_connection` |
| Event create, edit, cancel, link | EVT-01 | `xct.offline.needs_connection` |
| Rule changes and re-run | RUL-01, RUL-05, RUL-12, CON-15 | `xct.offline.needs_connection` |
| Contribution remind, exempt, apply change | CON-07, CON-10 | `xct.offline.needs_connection` |
| Profile edits | ACC-06 criterion 7 | `xct.offline.needs_connection` |
| Guest ballot on the light vote page | ACC-16, VOT-06 | `xct.offline.needs_connection` |

**Data:** Queue item (local), Ballot, RSVP, Expense request (draft), Task, Document note, Audit entry, Draft (local).
**Depends on:** XCT-03, XCT-04. Used by ACC, GRP, CON, VOT, SPD, RUL, NTF, WAL, EVT, PRJ, ANN, OPS.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: Table A of criterion 2 is the complete MVP auto-send list; profile edits and every money action are not on it. A new entry needs a recorded decision and the guard test of criterion 2. Closed: no vote-by-SMS path in the MVP; a voter near the deadline with no data is told the deadline and the queue state (criterion 3), and a vote link opens a light page (ACC-16, VOT-06). Vote by SMS is Later; field interviews decide when it moves out of Later, and VOT and NTF take it up if ballots arrive too late. Reminders may still arrive until a queued ballot is sent; the server cannot know about queued ballots, and the ballot screen says so (criterion 3).

---

### XCT-06 Block money-out when there is no connection, say why, and never double-send

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Member
**Permission needed:** the permission the action needs online, for example Wallet: initiate spend, Wallet: approve spend, Wallet: close, Wallet: freeze or Group: remove member
**Tags:** offline, ledger

**Story:** As a member, I want money-out to be blocked when I have no connection, with a clear reason and a useful alternative, and to be sure that a connection lost mid-payment cannot send twice or lose money, so that I can trust every payment I make.

**Conversation:** Money-out is online only (00-conventions section 2; design foundations section 4). Queuing money silently is a documented risk with no source testing it (08 competitor UX 6.13). Provider callbacks can time out or double-notify, so idempotency keys, pending states and reconciliation are mandatory (competitive analysis section 6, point 6). Mobile money confirmations can stall, and an unexplained spinner reads as lost money (07 UI/UX 2.3 R-T2). Failed must say whether money moved (R-T3). Tag ledger because it governs when money leaves the ledger.

**Preconditions:** A money-out action is available to the person.
**Trigger:** Person starts or confirms an action in the online-only list while the connection is absent or lost.

**Acceptance criteria:**
1. Happy path, blocked. The online-only list is: send inside Gereo (WAL-13), withdraw (WAL-09, WAL-10), move money between wallets (WAL-12), pay a contribution (CON-04), give to a campaign (ANN-05), submit, edit, cancel, approve or reject an expense request (SPD-01, SPD-05, SPD-06, SPD-07, SPD-12), create the vote linked to an expense (SPD-09), any retry of a payout (SPD-11), close a wallet (WAL-05), freeze or unfreeze outgoing money (SPD-15; a queued freeze would give false safety, so the screen points to the support route of OPS-06), change or reset the PIN (ACC-03, ACC-04), remove a member (GRP-17), delete the account (ACC-15) and any export generated on the server (WAL-16, CON-18). Wallet: freeze is online-only and never queueable. A payout started by a passed vote or by approvals is started by the server, never by a phone, so no phone state can start or block it. When the device has no connection, these buttons are disabled and the reason sits next to the button (`xct.offline.money_blocked`: "You need a connection to move money. Nothing was taken.") and not in a pop-up. Rows of this list that move no money out by themselves (freeze and unfreeze, PIN change and reset, remove member, delete account, server exports, edit, cancel and reject of a request, creating the linked vote) show `xct.offline.needs_connection` instead, the one key for every non-queueable action (XCT-05 criterion 2).
2. Business rule, alternatives. The disabled state offers `Save as draft` where a draft exists (for example an expense request) and `Remind me when I am connected`, which schedules a local reminder on the phone (not an SMS, because the phone has no connection to ask for one).
3. Business rule, stale balance. When a balance is older than `STALE_BALANCE_HOURS` the review screen refreshes the balance from the server before the PIN step. If the refreshed balance differs, the person sees the new balance and must confirm again; the PIN screen never uses an old amount.
4. Business rule, idempotency. Every money-out attempt has a unique key created before the request. Retrying after a timeout or a double tap sends the same key, so the server creates at most one transaction. The send button is disabled after the first tap until the result is known.
5. State, connection lost mid-payment. If the connection is lost after the request is sent, the app shows the transaction as `Pending` with the reference ID and `xct.offline.payment_unknown` ("We are checking. Do not send it again. We will SMS you."). It never shows Failed or Success on its own. On reconnect the app asks the server for the status first and never resubmits automatically.
6. State, statuses. The transaction uses only the Gereo statuses (Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention). The status vocabulary also holds `payout_blocked`, owned by XCT: a payout stopped by the SPD-10 checks after a passed vote. It creates no transaction and takes nothing; it is shown on the request and surfaced as a linked follow-up decision entry, because the decision log is immutable. Closing the vote and writing the decision is one atomic step, and OPS-14 is the backstop. The Needs attention age is `PAYOUT_PENDING_ALERT_MINUTES` (OPS-13) and applies only to dispatched payouts that are Pending; such a payout then appears in the operator queue (OPS-13). A queued payout shows the sub-label `Waiting for the provider` for up to `PAYOUT_PROVIDER_WAIT_MAX` (WAL) and is not Needs attention. Test: a payout queued for 2 hours is not Needs attention.
7. Errors. A failed request says whether money left the wallet (`Not taken from your account` or `Taken, refund in progress, reference X`) and gives the next action as a button (07 UI/UX 2.6 R-E2, R-T3). Where Failed after a hold, the ledger reverses the hold with a reversing entry (WAL), never an edit.
8. Notifications. The final status of a Pending money-out is sent by push and by SMS with the reference ID, using the result keys owned by WAL-11 (`msg.wal.withdrawal_confirmed.sms`, `msg.wal.withdrawal_failed.sms`) and, for a payout started by a vote or approvals, SPD-11 (`msg.spd.payout_failed.sms`), all keys in the grammar of conventions 10.1; all GSM-7 safe and under 160 characters. A person who is still offline gets the SMS and sees the status on next sync.
9. Ledger and audit. No ledger entry is written for a blocked or unsent attempt. An accepted attempt follows the normal rules (WAL). Audit entries record attempt created, request sent, status changes and who saw a warning, with client and server times.
10. Accessibility and language. The disabled reason is text plus icon, announced as a status, and is read in the person's language; the explanation is the same across all money-out buttons, always the key `xct.offline.money_blocked`, so people learn it once.

**Data:** Transaction, Ledger entry, Notification, Audit entry, Queue item (local, reminders only).
**Depends on:** WAL-09, WAL-10, WAL-11 (transaction states, hold and reversing entries), WAL-18, SPD-10, SPD-11 (payout), XCT-04, XCT-05, OPS-13, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a payout attempt carries Gereo's own idempotency key, no automatic resubmission of an attempt of unknown outcome, status asked of the provider before any retry, and the daily reconciliation of OPS-04 as the safety net. Closed: the Pending-to-Needs-attention time is the single parameter `PAYOUT_PENDING_ALERT_MINUTES`, owned by OPS-13, which sets its value; this epic states no number.

---

### XCT-07 Use less data with a data saver mode

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a person who pays for mobile data by the megabyte, I want a data saver mode I can switch on and see what it saves, so that Gereo does not use my airtime.

**Conversation:** Data costs about 5 Ar per MB (design foundations section 1, point 3 [V/S]). The browser exposes a Save-Data signal; the guidance is to offer an explicit toggle, keep core content, trim cost, and default to full content until the person opts in (07 UI/UX 3.4, R-P3). Android's guidance adds asking consent before large downloads and showing their size (R-P6). Core content, such as numbers and statuses, is never reduced.

**Preconditions:** None; works signed out and signed in.
**Trigger:** Person switches `xct.saver.toggle` in Settings, or accepts the first-run prompt.

**Acceptance criteria:**
1. Happy path. In Settings, a visible switch `Data saver` with a one-sentence explanation turns the mode on or off at once, with no restart. The state shows as text (`On` or `Off`) and not colour alone.
2. Business rule, first run. If the device signals Save-Data or Android Data Saver, the first screen after language choice offers `Turn on data saver` with equal weight to `Not now`. The mode is never turned on silently.
3. Business rule, effects. In saver mode: no avatars or illustrations are downloaded (a placeholder with initials is shown); images are not loaded unless the person taps them; custom web fonts are replaced by the system font; list pages are smaller (20 rows instead of 30); no prefetch of other screens; audio hints are not downloaded until asked; background refresh runs only on tap or at open.
4. Business rule, unchanged. Amounts, statuses, reference IDs, the PIN pad, receipts, votes, approvals and the example group are identical in both modes. KYC photos are the one place images are sent, and are compressed to a configurable size in both modes (ACC-08).
5. Business rule, consent. Any single download above `LARGE_DOWNLOAD_CONSENT_MB` (an export, a language pack, a receipt PDF bundle, an app update) shows its size and asks first, in both modes.
6. State. The screen shows an estimate `About {n} Ar saved since you turned it on`, computed from measured bytes avoided times `DATA_COST_AR_PER_MB`, labelled as an estimate. If there is no measurement yet, it shows `Not enough use yet`, not zero.
7. State, offline. Saver mode can be switched offline. Cached content is the same.
8. Errors. If the saved setting cannot be stored, the mode applies for the session and the person sees `err.xct.setting_not_saved`. No money is involved.
9. Notifications, ledger. None. Audit: not logged (a device preference).
10. Accessibility and language. The explanation and the estimate use plain words in the person's language; the estimate follows the amount format (XCT-02).

**Data:** Device settings (local), measured transfer counters (local).
**Depends on:** XCT-02, XCT-11, ACC-08 (photo compression), XCT-01 (language packs).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: `DATA_COST_AR_PER_MB` is one app-wide value, not per operator, because the estimate is labelled as an estimate and a per-operator price needs a lookup that no story provides. Open, needs field interviews: whether people trust the estimate or find it confusing; default used is to ship it with the `About` wording and drop it if two or more of the first interview sessions misread it.

---

### XCT-08 Make every money screen work at 200% text size

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a person who sets my phone to large text, I want every screen to stay readable and usable, and no amount or button to be cut off, so that I can use Gereo without help.

**Conversation:** Support OS font scaling to 200%, reflow at 320 px, and amounts never clipped (design foundations section 4; WCAG 1.4.4, 1.4.10, 1.4.12 in 07 UI/UX section 7). Short labels can expand 200 to 300% in translation, so layout must wrap (XCT-13). Sticky bars must not hide a focused item (WCAG 2.4.11).

**Preconditions:** A test device or emulator with system font size at its largest setting.
**Trigger:** A person uses the app with large text; also run in release testing.

**Acceptance criteria:**
1. Happy path. At 200% system font scale and a 320 CSS px viewport, every money screen and every critical flow shows all content without horizontal scrolling, in all three languages.
2. Business rule, amounts. No amount, balance, fee or total is truncated, ellipsised or split across lines (the non-breaking rule of XCT-02). A test renders the longest amount `100 000 000 Ar` with a long sign and status in the narrowest layout.
3. Business rule, controls. Buttons and tabs wrap their label onto two lines instead of truncating; the label stays fully visible; button height grows. The bottom navigation keeps always-visible labels with up to four items and may wrap them.
4. Business rule, text spacing. With line height 1.5, paragraph spacing 2, letter spacing 0.12 and word spacing 0.16 applied by an override, no content is lost or overlaps.
5. Business rule, sticky elements. A focused field or button is never fully hidden by the keyboard, the sticky bar or the bottom navigation (WCAG 2.4.11). The PIN pad and the primary action remain reachable by scrolling at 200%.
6. State. Skeletons, banners (offline, incident, last synced) and dialogs also reflow; a banner never covers an amount.
7. Errors. Error messages and inline hints grow with the text and stay next to their field.
8. Notifications. Not applicable. Ledger and audit. Not applicable.
9. Test method. Automated: a screenshot test per money screen at 200% in Malagasy (the likely longest) fails on overlap, clipping or horizontal scroll. Manual: one run per release on a real phone with the largest system font through the top five tasks.
10. Accessibility and language. Sizes are defined in relative units that follow the system setting (`sp` or `rem`), not in fixed pixels. No text is inside an image (WCAG 1.4.5).

**Data:** none.
**Depends on:** XCT-02, XCT-13. Applies to every epic with screens.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: there is no screen list to keep in step. A money screen is defined by the rule in "Conventions used in this file", and the information architecture flags each page.

---

### XCT-09 Check contrast, target size and status without colour on every screen

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a person using a phone outdoors, with poor eyesight or with colour blindness, I want text and buttons I can see and tap, and statuses I can read without colour, so that I do not mistake a failed payment for a confirmed one.

**Conversation:** WCAG 2.2 AA thresholds: contrast 4.5:1 for text and 3:1 for large text and interface parts; the Android floor for a target is 48 by 48 dp, and the project rule is 48 dp with 8 dp spacing and 56 dp for the primary money action (07 UI/UX 3.1 R-D1 [V for 48 dp, U for 56 and 8]; section 7). About 1 in 12 men has colour blindness, so red and green alone fail (07 UI/UX 7). Every status chip is word plus icon plus colour (design foundations section 3, principle 1). A large share of use is outdoors, so contrast for amounts and primary buttons aims above the minimum [U].

**Preconditions:** Light and dark themes both implemented.
**Trigger:** Every build; every new screen.

**Acceptance criteria:**
1. Happy path. Text has a contrast ratio of at least 4.5:1 against its background, large text (about 24 px, or 18.5 px bold) at least 3:1, and interface boundaries and icons that carry meaning at least 3:1, in both the light and the dark theme. An automated check runs per screen and per state in CI.
2. Business rule, outdoors. Amount text and primary button labels reach `CONTRAST_TARGET_AMOUNT` (7:1) in the light theme and in the dark theme, and are also checked in a simulated sunlight mode (screenshot brightened and flattened) where they must stay at least 4.5:1. A brand colour that cannot reach 7:1 with its text is not used for a primary button.
3. Business rule, target size. Every tappable element is at least 48 by 48 dp with at least 8 dp between neighbours; primary money actions are 56 dp. Whole list rows are tappable, not only the chevron. A check lists any target under the floor and fails the build below 24 CSS px (the WCAG minimum).
4. Business rule, status. Every status chip (Initiated, Pending, Confirmed, Failed, Cancelled, Needs attention) and every sent or received indicator shows an icon, a word and a colour; each status colour has 3:1 against its background and its text has 4.5:1. A greyscale screenshot test confirms each status is still distinguishable by icon and word.
5. Business rule, charts. Charts label values directly, use a colour-blind-safe pair and pair every red or green with a shape, arrow or sign. A chart never carries information that is not also in text.
6. Business rule, forms. Errors are shown with text, an icon and the field outline, never colour alone, next to the field and in a summary at the top that receives focus (WCAG 3.3.1).
7. State. The same checks apply to disabled, pending, loading, offline, incident and empty states. The banners for no connection and provider unavailable keep 4.5:1.
8. Errors. A failed check fails the build with the screen name, element and measured value.
9. Notifications, ledger. Not applicable. Audit: not applicable.
10. Test method. Automated accessibility checks (axe or equivalent) and Lighthouse accessibility score in CI; a manual greyscale pass and a colour-blindness simulation in design review; one TalkBack run per release.

**Data:** none.
**Depends on:** XCT-08. Applies to every epic with screens.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the target for amounts and primary buttons is 7:1 (`CONTRAST_TARGET_AMOUNT`). Closed: no separate high-contrast setting in the MVP, because both themes already meet the AA minimum everywhere and 7:1 on the money text; revisit if the TalkBack or outdoor tests show a need.

---

### XCT-10 Use Gereo with a screen reader, a keyboard and reduced motion

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a person who uses TalkBack or reduced motion, I want every control to have a clear name, a logical order and no required gesture, so that I can pay and vote on my own.

**Conversation:** WCAG 2.2 AA essentials, as listed in 07 UI/UX section 7: unique names for repeated rows (amount and counterparty included), status messages in live regions without moving focus (4.1.3), focus not obscured (2.4.11), single-pointer alternatives to drags (2.5.7), consistent help (3.2.6), language of parts (3.1.2), accessible authentication (3.3.8). Toasts alone are not used for money outcomes because they vanish before slow readers finish (07 UI/UX 7 R-AC7). Reduced motion is respected (R-AC6) and also helps low-RAM devices (R-P5).

**Preconditions:** TalkBack or the browser accessibility tree is available.
**Trigger:** A screen is reviewed in design, coded and released.

**Acceptance criteria:**
1. Happy path. Each interactive element has a name that says its purpose; icons that carry meaning have a visible label as well as an accessible name; decorative icons are hidden from assistive technology.
2. Business rule, rows. Each repeated row has a unique name that includes the amount, the counterparty and the status (`Sent 5 000 Ar to Rado, Confirmed, 14:05`).
3. Business rule, focus. Focus order matches visual order; focus is visible; focus moves to the error summary on a failed submit and to the new screen title on navigation; a sticky element never hides the focused control.
4. Business rule, status. Success, error and progress messages use a live region (`role="status"` or `role="alert"`) without moving focus. A money outcome is always shown on a persistent screen or card, never only in a toast (ACC-03 PIN result, XCT-06).
5. Business rule, gestures. No action needs a swipe or a drag. Every drag, such as reordering split rules or a percentage slider, has a tap alternative and a typed input.
6. Business rule, motion. Animations are short and essential; with the system reduced-motion setting on, or a low-RAM device, non-essential motion is removed, including the brief sending animation.
7. Business rule, help. A `Help` control appears in the same place on every screen (WCAG 3.2.6) and leads to in-context help and the support route (OPS-06).
8. Business rule, authentication. OTP fields allow paste and autofill; the PIN screen offers biometric as an alternative where available (ACC-02, ACC-03). Language of passages is marked (`lang`) when it differs from the page language, such as a French member name inside Malagasy text.
9. Errors. Every error names the field, says what to do, and keeps the typed values (WCAG 3.3.1, 3.3.4). Reviewing before a money action is possible for every money action.
10. Test method. A TalkBack run through the top five tasks per release, plus automated rules for names, roles and focus in CI. Result recorded in the release checklist.

**Data:** none.
**Depends on:** XCT-08, XCT-09. Applies to every epic with screens.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: audio read-out of amounts by a recorded human voice is not in the MVP. It needs a recorded Malagasy voice set and a field test with low-literacy users, and the MVP already has the spelled-out amount line (XCT-02 criterion 6) and TalkBack support; it is a Later item. Closed: TalkBack runs on the Android Go test phone of the test devices list (the lowest supported Android version) and on the mid-range phone with the current Android release.

---

### XCT-11 Hold Gereo to performance budgets that fail the build

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** System
**Permission needed:** none

**Story:** As the product team, we want performance budgets enforced in the build and checked on a real low-end phone, so that Gereo stays usable on Android Go phones and slow connections.

**Conversation:** The device is the main constraint: Android Go phones, apps under 40 MB, a start in under 5 seconds, data at about 5 Ar per MB (design foundations section 1, point 3). The starting budgets are in design foundations section 4 and 07 UI/UX 3.4; the thresholds for LCP, INP and CLS are verified, the byte numbers are our targets [U]. A looser reference from web.dev is 170 KB of JavaScript and 5 seconds to interactive on slow 3G. Budgets are set as acceptance criteria before wireframes (06 process 4.6). The current web app loads two variable fonts, which is a cost to review (06 process 4.6 [V local]).

**Preconditions:** A build pipeline and a reference device exist.
**Trigger:** Every build and every release candidate.

**Acceptance criteria:**
1. Happy path. The build runs a Lighthouse check with mobile throttling (round trip 150 ms, 1.6 Mbps, 4x CPU slowdown) on the critical flows and fails if any budget below is exceeded.
2. Business rule, web vitals. Largest Contentful Paint at most 2.5 s, Interaction to Next Paint at most 200 ms, Cumulative Layout Shift at most 0.1, measured at the 75th percentile in field data once available and on each lab run before that.
3. Business rule, size. JavaScript per route under about 100 KB compressed, with no single bundle above about 100 KB; first-visit transfer at most about 300 KB (HTML, CSS, JavaScript and fonts) compressed; time to interactive under 5 s on the throttled profile. The vote link page (ACC-16, VOT-06) has its own tighter limit: first-visit transfer at most 150 KB compressed, one language, system font, no avatar. A looser starting point (170 KB JavaScript) is allowed only by a recorded decision.
4. Business rule, assets. No image is required on a first view; any avatar or illustration is lazy and at most about 20 KB; one font subset covering Latin with Malagasy and French diacritics, under about 40 KB, with a system-font fallback; icons are one inline vector sprite; no text in images.
5. Business rule, data per screen. List responses are at most about 15 KB and paginated at 20 to 30 rows. A repeat visit loads the shell from cache with 0 bytes transferred.
6. Business rule, Android app. If a native Android build exists: under 40 MB installed, startup under 5 s on a phone with 1 to 2 GB of RAM, measured on a real Android Go device before each release. Decorative animation is off on low-RAM devices.
7. Business rule, UI feel. A visual press state appears within 100 ms of a tap; skeletons appear only for a first uncached full-page load, spinners only inside one card, progress bars only for uploads (07 UI/UX 3.3 R-L2). No optimistic success for money: pending is shown, never faked success (06 process 4.6).
8. State. A budget change needs a recorded decision with a reason, because raising it is a decision about people's data cost. The current values and their history are kept with the project documents.
9. Errors. A failed budget names the route, the metric, the measured value and the limit.
10. Reporting. A one-page performance report per release lists the measured values for the critical flows and the result on the real device; it is part of the release checklist. No ledger or audit effect.

**Data:** none (build and test results).
**Depends on:** XCT-04, XCT-07, ACC-16. Applies to every epic with screens.
**Pages:** not applicable (release process).
**Open questions:** Closed: the budgets in criteria 2 to 5 are the starting values until the first measured build; changing one follows criterion 8. Closed: the first-visit target for the vote link page is 150 KB (criterion 3). Closed: the MVP is a PWA only (XCT-04 open questions), so criterion 6 applies only if a native build is added. Open, needs a purchase decision: the exact Android Go model used for tests; default used is any phone with 1 to 2 GB of RAM running Android 8.1 Go or later.

---

### XCT-12 Write SMS templates that stay in one 160-character message

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** System
**Permission needed:** none
**Tags:** sms

**Story:** As the product team, we want every SMS template checked in the build for safe characters and length in all three languages, so that no message costs several segments or arrives garbled.

**Conversation:** XCT-12 is the sole owner of SMS encoding and the build lint; NTF-07 owns the template registry, the content rules, the exceptions process and send-time failure. One character outside the GSM-7 set turns the whole message into UCS-2 and cuts it from 160 to 70 characters per message (07 UI/UX section 4 [V], Twilio table). The set includes some French accents (é, è, ù, à) but not circumflex letters, lowercase ç or curly apostrophes, so French copy and the Malagasy `ô` are a cost trap (design foundations section 4). SMS is a first-class channel for OTP, receipts, vote deadlines, contribution due and event reminders (design foundations section 3, principle 7; 07 UI/UX 4 R-SMS1 to R-SMS4). Every SMS is self-contained: what, how much, who, reference (R-SMS2). SMS is not used for marketing (R-NT1). SMS cost is monitored in OPS-12.

**Preconditions:** A template catalogue exists with SMS keys (see "Conventions used in this file") in three languages.
**Trigger:** Any change to a template, to a placeholder, or to a translation; every build.

**Acceptance criteria:**
1. Happy path. A lint step reads every SMS template (every key of the form `msg.<epic>.<event>.sms`, conventions 10.1) per language, Malagasy, French and English, and fails the build if any character is outside the GSM-7 basic set or its extension table (extension characters count as two). It reports the segment count of each template. Any non-GSM character, for example `ô`, `ê`, `â`, `î` or a lowercase `ç`, switches the whole message to UCS-2 at 70 characters per segment, and the lint then fails the build unless the template is marked as allowed to be multi-segment, which only an NTF-07 exception can do.
2. Business rule, forbidden characters. The lint reports specifically: curly apostrophes and quotes, emoji, circumflex letters (â, ê, î, ô, û), lowercase ç, non-breaking and narrow no-break spaces, and any tab or special dash. Only a straight apostrophe is allowed. Required fix: rewrite the word (for example write Malagasy `o` instead of `ô` in SMS).
3. Business rule, length. Variables (name, amount, reference) are measured at their maximum length, and after substituting each placeholder with its worst-case value the message is at most `SMS_MAX_CHARS` (160) characters. Worst cases: amount `100 000 000 Ar` (14 characters), a reference of 8 characters, a group name of `ntf.sms_group_name_max` characters, a first name of the NTF-07 cap, an event or vote title of `ntf.sms_title_max`, a place of `ntf.sms_place_max`, a date as `24/10`, a deadline time as `17:00` (parameters table). An OTP template must fit one segment including its last line `@{APP_DOMAIN} #{code}`. When the worst case exceeds 160 characters, the key must carry a fixed short template (amount, deadline and reference only, with the generic name `a member`) that is itself linted. A name longer than its cap is cut with `...` by the function of criterion 8 before substitution.
4. Business rule, content. Each template: starts with `Gereo:`; leads with the action and the amount; includes a reference or the support route where money or access is involved; ends with the reference. An OTP template contains the code, the validity in minutes, the sentence that Gereo never asks for the code or PIN, and a last line `@{APP_DOMAIN} #{code}` for autofill (ACC-02). No template asks for a PIN or a code, and none contains a marketing message.
5. Business rule, amounts and dates. SMS amounts use the format of XCT-02 with a normal space and `Ar`; dates use `dd/mm` or `dd/mm/yyyy` in Madagascar time; no month-first order (XCT-03).
6. Business rule, same meaning. The three language versions of a key carry the same placeholders and the same meaning; a test checks placeholder sets are equal and flags a template that is shorter than 60% or longer than 160% of the English version for human review.
7. State. A template that fails is not deployable. The lint prints the key, the language, the offending character or the length and the number of segments it would use.
8. Business rule, person-supplied names. A fixed character mapping table covers person-supplied names: for example `â` to `a`, `ê` to `e`, `î` to `i`, `ô` to `o`, `û` to `u`, lowercase `ç` to `c`, curly apostrophes to a straight one. A character with no mapping is dropped, and a name with no mappable character at all becomes the generic name `a member`. The mapping is data, tested by the lint on sample names in the three languages, and it never drops a money reminder. XCT-12 defines no runtime replace-and-send step: send-time failure (text over length or unmappable after the mapping) belongs to NTF-07 criterion 9 and NTF-13.
9. Notifications and key lint. This story owns the build-time lint and the character and length rules for every SMS in the product, including those of ACC (`msg.acc.*.sms`) and the money messages of WAL, CON, SPD, VOT, EVT and NTF. The same lint enforces the key grammar of conventions 10.1, `^msg\.[a-z]{2,4}\.[a-z0-9_]+(\.(push|sms|inapp))?$`; requires every base key to exist in the NTF catalogue; rejects `sms.*`, `push.*` and `ntf.*` as message keys while exempting the `ntf.*` parameter family (for example `ntf.log_retention`); and enforces the 160 GSM-7 limit on `.sms` keys, matching NTF-07. NTF-07 owns the template registry, the sender, the content rules and the exceptions process; the two stories must not define a second set of rules.
10. Ledger and audit. No ledger entry. Audit: each SMS send is recorded by NTF with template key, language, segments and cost (visible in OPS-12). A sample of five templates per epic is reviewed by a native speaker for meaning, since AI drafts are low-trust for Malagasy (06 process 5.4).

**Data:** SMS template catalogue, Notification.
**Depends on:** XCT-01, XCT-02, XCT-03, XCT-14, NTF-07. Used by ACC-02, WAL-11, CON-04, CON-08, SPD-11, VOT-07, EVT-05, ANN-06, NTF-05, OPS-12.
**Pages:** not applicable (build and content process).
**Open questions:** Closed: XCT-12 and NTF-07 describe the same lint. The split is XCT-12 for the character set, the segment count, the length test, the name mapping and the lint, and NTF-07 for the registry, the content rules, the sender, exceptions and send-time failure; NTF-07 criteria 2 to 4 cite this story instead of repeating the rules. Closed: no UCS-2 message is sent in the MVP; an exception needs a named approver, a stated segment count and cost (NTF-07 criterion 5). Open, needs the SMS aggregator: whether it supports a sender name and delivery receipts, how it counts segments, and its real rates (competitive analysis section 10). Default used: our own segment count from the lint, an alphanumeric sender id `ntf.sms_sender_id` if allowed and a plain sender otherwise, and no reliance on delivery receipts for money messages (the in-app item and the push stay the proof).

---

### XCT-13 Check every screen with a pseudo-language that is longer than any real one

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** System
**Permission needed:** none

**Story:** As the product team, we want a fake language with longer, accented strings run on every screen in CI, so that we find text that overflows before real translations arrive.

**Conversation:** Short labels expand 200 to 300% from English, and a French example grew 2.6 times (W3C figures, 07 UI/UX 6.4). No Malagasy expansion ratio exists; the research says to translate the first 150 strings and measure (07 UI/UX 6.4 R-L12; 06 process 5.2). Pseudo-localisation is the standard way to find overflow (R-L11). The design rule is: labels of 4 words or fewer survive 2 times the English length, longer ones 1.5 times; buttons and tabs wrap instead of truncating (R-L10).

**Preconditions:** All UI text comes from message keys (XCT-14); a pseudo-locale file can be generated.
**Trigger:** Every build; every new screen; the first 150 strings translated.

**Acceptance criteria:**
1. Happy path. A generated pseudo-locale replaces each string by `[` plus the string expanded by `PSEUDO_EXPANSION` (1.6 times) with accented letters, plus `]`. A screenshot test renders every screen and state in the pseudo-locale at the normal font size and at 200% (XCT-08).
2. Business rule, no truncation. The test fails on any text cut by ellipsis, clipped by its container, overlapping another element, or forced to scroll horizontally. Buttons and tab labels wrap to two lines; none uses a fixed-width pill.
3. Business rule, hard-coded text. Any visible text on a screen that is not wrapped in the pseudo-locale markers is reported as hard-coded text and fails the build, so that no string escapes translation (the project rule of no hard-coded text, 00-conventions section 2).
4. Business rule, no text in images. The test flags any image with embedded text (a list of known assets plus an OCR spot-check on first views) (WCAG 1.4.5).
5. Business rule, measure. When the first 150 strings are translated into Malagasy and French, a report gives median and 90th-percentile length against English per string group (labels, buttons, messages). The layout targets (2 times for short labels, 1.5 times for long ones) are checked against the measured values and updated.
6. Business rule, plurals. A pseudo-test renders plural messages with counts 0, 1, 2 and 11 to catch concatenation; the `mg` and `fr` rules from CLDR (`one` and `other`) are used (07 UI/UX 6.4 R-L14; 06 process 5.3).
7. State. A screen with a known exception (for example a table that must scroll) is listed with a reason and reviewed each release; the list cannot grow without a recorded approval.
8. Errors. A failure names the screen, the key, the language and a screenshot diff.
9. Notifications, ledger, audit. Not applicable.
10. Reporting. The report is part of the release checklist and is attached to the design hand-off of each screen.

**Data:** message catalogue, screenshot baselines.
**Depends on:** XCT-01, XCT-08, XCT-14. Applies to every epic with screens.
**Pages:** not applicable (build and design process).
**Open questions:** Closed: screenshot tests run in Playwright with mobile emulation and the throttled profile of the test devices list, because it drives the same browser engine as the PWA and the Lighthouse run of XCT-11. Open, needs measurement on real translations: the Malagasy and French expansion ratios. Default used: 1.6 times (`PSEUDO_EXPANSION`) and the 2 times and 1.5 times layout targets until criterion 5 reports the measured values.

---

### XCT-14 Keep every string a key, with safe fallback, plurals and one glossary

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** System
**Permission needed:** none

**Story:** As the product team, we want every piece of text to be a message key with a glossary term and a translation owner, so that wording is consistent in three languages and nothing is ever hard-coded or concatenated.

**Conversation:** Stories never hard-code text; they refer to message keys (00-conventions section 2). No i18n library is installed in the web app yet (design foundations section 4; 06 process 5.4, step 1), so this story is the base for XCT-01, XCT-12 and XCT-13. The terms for wallet, group, contribution, vote, decision and pending are tested with users and kept in a glossary of 20 to 30 terms (06 process 4.3). Each string has a key and an owner and is versioned with the design (06 process 4.3, step 6). Plurals and gender need a message format (07 UI/UX 6.4 R-L14). Source text and keys are in English because everything in the repository is in English (00-conventions section 2).

**Preconditions:** An i18n library and a catalogue structure exist (one file per language).
**Trigger:** A developer or content owner adds or changes text.

**Acceptance criteria:**
1. Happy path. All visible text, including error messages, empty states, accessibility labels, notification text and SMS, is read from the catalogue by key. A lint rule fails the build on a string literal in a screen component. Each epic owns its UI prefix and writes UI keys as `<epic>.<area>.<name>` with the epic's own code; a notification body is only ever a `msg.<epic>.<event>` key (conventions 10.1, enforced by XCT-12).
2. Business rule, catalogue. Each key has: the English source text, French and Malagasy translations, a context note for translators (where it appears, who sees it), a status (draft, reviewed, back-translated for money-critical keys), an owner, and the date of the last change.
3. Business rule, fallback. A missing key falls back Malagasy to French to English; the raw key is never displayed. The build fails if a key exists in the code and not in the English and French files; the report lists missing Malagasy keys by screen (XCT-01 criterion 5).
4. Business rule, messages. Whole sentences with named placeholders are the unit of translation; concatenating fragments is forbidden and a lint rule flags `+` between translated parts. Plural and gender forms use a message format with the `one` and `other` categories for `mg` and `fr`.
5. Business rule, glossary. A glossary file lists each domain term with approved Malagasy, French and English forms and one example sentence; a lint checks that a key does not use a banned synonym. Terms are changed only through a recorded decision. The glossary includes the five lock and hold terms of conventions 10.4: PIN lock-out (ACC-03), App lock (ACC-12), Account lock (ACC-11), Wallet freeze (SPD-15) and Operator hold (UI label `Held by Gereo`). The bare words "lock" and "frozen" are banned synonyms.
6. Business rule, voice. Copy follows the plain-language rules (one idea per sentence, verb first for actions, exact amounts and times, no blame words, no exclamation marks or emoji near money, no "soon") (07 UI/UX section 9; 06 process 5.5). A copy checklist is part of each screen review.
7. State. Untranslated and changed strings since the last release are listed; strings are frozen for the release candidate.
8. Errors. A malformed message format fails the build with the key and language. At runtime a malformed message falls back to the English text and logs an event.
9. Notifications. SMS and push keys follow the same catalogue, with the extra SMS checks of XCT-12.
10. Ledger and audit. Not applicable; the catalogue change history is the version control history.

**Data:** message catalogue, glossary.
**Depends on:** none. Used by XCT-01, XCT-12, XCT-13 and every other epic.
**Pages:** not applicable (content process).
**Open questions:** Closed: the message format is ICU MessageFormat, because it is the format of the CLDR plural rules named in criterion 4 and it is supported by the maintained i18n libraries for the web; the library chosen at build time must support ICU plurals, per-language lazy loading (XCT-01 criterion 7) and a missing-key hook (XCT-01 criterion 5). Closed: the glossary is owned by the product owner, with the native reviewer of XCT-01 approving the Malagasy column, and is reviewed at each release candidate when strings are frozen (criterion 7). Closed: no regional variants in the MVP (XCT-01 open questions).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| XCT-01 | Switch language at any time, with Malagasy as a first-class language | P0 | ACC-01, ACC-06, XCT-12, XCT-14 |
| XCT-02 | See every amount as whole ariary with spaces, the same in every language | P0 | WAL-14, WAL-16, WAL-18, XCT-01, XCT-08, XCT-12 |
| XCT-03 | See dates, times and deadlines in Madagascar time, in words where it matters | P0 | XCT-01, XCT-05 |
| XCT-04 | Read my key information with no connection, and see when it was last updated | P0 | ACC-03, ACC-11, ACC-12, XCT-03, XCT-05, XCT-06, XCT-11 |
| XCT-05 | Queue the things that can wait, with a visible state, and reject the rest | P0 | XCT-03, XCT-04 |
| XCT-06 | Block money-out when there is no connection, say why, and never double-send | P0 | WAL-09, WAL-10, WAL-11, WAL-18, SPD-10, SPD-11, XCT-04, XCT-05, OPS-13, NTF-05 |
| XCT-07 | Use less data with a data saver mode | P1 | XCT-02, XCT-11, ACC-08, XCT-01 |
| XCT-08 | Make every money screen work at 200% text size | P0 | XCT-02, XCT-13 |
| XCT-09 | Check contrast, target size and status without colour on every screen | P0 | XCT-08 |
| XCT-10 | Use Gereo with a screen reader, a keyboard and reduced motion | P1 | XCT-08, XCT-09 |
| XCT-11 | Hold Gereo to performance budgets that fail the build | P1 | XCT-04, XCT-07, ACC-16 |
| XCT-12 | Write SMS templates that stay in one 160-character message | P0 | XCT-01, XCT-02, XCT-03, XCT-14, NTF-07 |
| XCT-13 | Check every screen with a pseudo-language that is longer than any real one | P1 | XCT-01, XCT-08, XCT-14 |
| XCT-14 | Keep every string a key, with safe fallback, plurals and one glossary | P1 | none |

Count: 14 stories. P0: 9 (XCT-01, 02, 03, 04, 05, 06, 08, 09, 12). P1: 5 (XCT-07, 10, 11, 13, 14). P2: 0.

Note on build order: XCT-14 is a P1 label but is the technical base for XCT-01, XCT-12 and XCT-13. The i18n library must exist before any hi-fi screens (design foundations section 4), so schedule it first even though the label is P1 for the acceptance gate.

## Cross-epic dependencies

- **ACC-01, ACC-06** language choice and profile language (XCT-01); **ACC-02, ACC-03** OTP and PIN screens that XCT-09, XCT-10 check; **ACC-08** KYC photo capture uses the queue (XCT-05) and the data saver compression (XCT-07); **ACC-11, ACC-12** emergency lock and sign-out erase the cache and interact with the queue (XCT-04, XCT-05); **ACC-16** the vote link page is the first-visit budget case (XCT-11).
- **WAL-14** receipts and reference IDs (XCT-02, XCT-04); **WAL-09, WAL-10, WAL-11, WAL-13** online-only money-out and its states (XCT-06); **WAL-17** is the wallet slice of XCT-04, and WAL, CON and ACC cite its parameter names; **WAL-18** reversing entries (XCT-06); **SPD-01** the expense request draft is a local draft and **SPD-03** a proof attachment on an already-sent request is auto-send (XCT-05); **SPD-05, SPD-06, SPD-15** approve, reject and freeze are online-only (XCT-06); **SPD-10, SPD-11** payouts started by votes or approvals are started by the server (XCT-06); **VOT-03** a passed vote starts the payout on the server (XCT-06); **VOT-12, VOT-18** vote extension and queued ballots (XCT-03, XCT-05); **VOT-14, VOT-15** manual decision entries and amendments are authorisation-restricted auto-send items (XCT-05); **CON-04** contribution payment (XCT-06); **CON-03** due dates (XCT-03); **EVT-04** RSVP (XCT-05); **PRJ-04** tasks and notes (XCT-05); **ANN-01** announcement drafts are local drafts (XCT-05); **GRP, PRJ, ANN, RUL, EVT** screens that must pass XCT-08 to XCT-10 and use the glossary (XCT-14).
- **NTF-05, NTF-07** send push and SMS using the rules of XCT-12 and the language of XCT-01; local reminders for blocked money-out (XCT-06) are owned by the client, the SMS fallback by NTF.
- **OPS-12** SMS cost monitoring reads the segment and encoding data that XCT-12 defines; **OPS-13** the payout queue receives transactions that become Needs attention (XCT-06) and owns `PAYOUT_PENDING_ALERT_MINUTES`; **OPS-06** support route linked from the Help control (XCT-10) and from a blocked freeze (XCT-06).

## Open questions

1. **Amount encoding.** Closed: ISO 4217 lists minor units for MGA while CLDR says none, so whole ariary inside Gereo, one conversion point in the adapter, pinned by a sandbox test.
2. **Malagasy quality and ownership.** Open, needs a native speaker and field interviews: the named native reviewer, the register and the glossary. Default used: official Malagasy in plain words, reviewed before the P0 gate. Closed: no regional variants in the MVP. Open, needs measurement: the real expansion ratio (default 1.6 times, XCT-13).
3. **Platform choice.** Closed: PWA only in the MVP; a native Android build is added only if the browser evicts the cache or cannot autofill the OTP in field tests (XCT-04).
4. **Cache limits.** Closed: 60 days, 50 transactions per wallet, 10 MB (which no epic may raise), and no extra encryption layer in the MVP (XCT-04). The queue has its own budget `QUEUE_MAX_MB` (XCT-05 criterion 12).
5. **Payout idempotency and status.** Closed: Gereo uses its own idempotency key per attempt and assumes neither status polling nor signed callbacks on payouts (XCT-06). Closed: the Pending-to-Needs-attention time is `PAYOUT_PENDING_ALERT_MINUTES`, owned by OPS-13.
6. **SMS channel.** Open, needs the SMS aggregator: sender name, delivery receipts, segment counting and real prices. Default used in XCT-12. Closed: no UCS-2 message in the MVP.
7. **Byte budgets.** Closed: the starting budgets stand until the first measured build and change only by a recorded decision; the vote link page is 150 KB (XCT-11).
8. **Accessibility scope.** Closed: no audio read-out in the MVP; contrast target 7:1 for amounts and primary buttons; TalkBack tested on the Android Go phone and the mid-range phone (XCT-09, XCT-10).
9. **Time zone and percent style.** Closed: Madagascar time only; percent is written `25%` (XCT-03, XCT-02).
10. **Screen list.** Closed: money screens are defined by a rule, and the information architecture flags each page (Conventions section of this file).
