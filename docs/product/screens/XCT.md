# XCT: screen and state inventory

Source: `docs/product/stories/XCT.md` (14 stories). Surface IDs are `SCR-XCT-nn`. Kinds: page, sheet, modal, inline, notification, system. XCT stories apply to every screen of every other epic. Where a story is a build or content rule with no screen of its own, its surface is a `system` surface (a check, a rule or a registry) and its "states" are the pass and fail conditions the story names. Inline surfaces are components that appear inside many screens. Decisions D1 to D7 and the R-rows in `05-decisions.md` apply over any story text: D6 makes XCT-05 the single owner of the device queue.

Line formats used below:

- Surface lines: `SCR-XCT-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-XCT-nn [state]: trigger; sees; can do; key`.
- Screens of other epics are cited as `SCR-ACC-nn`, `SCR-GRP-nn`, `SCR-WAL-nn`, `SCR-CON-nn` or `SCR-SPD-nn` where those inventories define them.

---

### XCT-01 Switch language at any time, with Malagasy as a first-class language

- Story: XCT-01 Switch language at any time, with Malagasy as a first-class language
- Surfaces:
  - SCR-XCT-01 | Language control (lists `Malagasy`, `Francais`, `English` in that order, each in its own language, same size) | inline | Individual or Visitor (no permission) | first screen (SCR-ACC-01); Settings; at most two taps from Home and from Settings | choosing a language applies it at once
  - SCR-XCT-02 | Language switch engine (applies without reload and without loss of state; re-renders amounts in words and dates) | system | none | choice | none
  - SCR-XCT-03 | Language pack status (`Needs a connection, about {size} MB`; large-pack consent) | inline | Individual | choosing a language not yet downloaded | try again; consent (SCR-XCT-39)
  - SCR-XCT-04 | Language pack failure (`err.xct.language_not_loaded` with `Try again`) | inline | Individual | pack fails to load | try again
  - SCR-XCT-05 | Catalogue completeness gate and fallback (Malagasy to French to English per key, never a raw key; missing-key event) | system | none | build and runtime | none
- States per surface:
  - SCR-XCT-01 [default]: visible on the first screen; reachable in at most two taps; three labelled choices in order
  - SCR-XCT-01 [stored]: choice stored on the device for visitors and in the profile after sign-up (ACC-06); decides the language of push, SMS and other messages sent from then on, including scheduled reminders not yet sent
  - SCR-XCT-01 [group default]: a group's default language is only a default for group-created content; never changes anyone's interface; member-written content shown as written, not translated
  - SCR-XCT-02 [switch]: applies at once; typed form text, scroll position, open step and queued items kept
  - SCR-XCT-03 [not downloaded]: language not yet downloaded and no connection; sees `Needs a connection, about {size} MB`; other languages keep working
  - SCR-XCT-03 [downloaded]: language already used switches at once offline
  - SCR-XCT-03 [large pack]: pack above `LARGE_DOWNLOAD_CONSENT_MB` asks first (XCT-07)
  - SCR-XCT-04 [failed]: app stays in the current language; no screen blank or showing keys
  - SCR-XCT-05 [gate]: 100% of keys used by P0 stories exist in Malagasy, French and English and are marked reviewed; build fails if a key is missing from French or English; a missing Malagasy key is a release blocker for P0 screens
  - SCR-XCT-05 [fallback]: missing Malagasy key falls back to French then English; app logs a missing-key event
  - SCR-XCT-05 [money strings]: balance, pending, failed, cancel, confirm, send and vote result are back-translated and checked by a second reviewer before launch
  - SCR-XCT-02 [accessibility]: `lang` attribute on the page and on passages in another language; plurals and gender by message format
- Criteria map:
  - AC 1: SCR-XCT-01 [default]
  - AC 2: SCR-XCT-02 [switch]
  - AC 3: SCR-XCT-01 [stored]
  - AC 4: SCR-XCT-01 [group default]
  - AC 5: SCR-XCT-05 [gate], [fallback]
  - AC 6: SCR-XCT-05 [money strings]
  - AC 7: SCR-XCT-03 [not downloaded], [downloaded], [large pack]
  - AC 8: SCR-XCT-04 [failed]
  - AC 9: SCR-XCT-02 [accessibility]
  - AC 10: no UI, system rule (SMS and push language follows the profile; audit only for a profile language change, ACC-06)
- Objects and fields: User (language); Device (language, local); message catalogue (key, language, review status).
- Open points:
  1. Criterion 3 says the language decides messages "sent push, SMS and emails", but there is no email channel (conventions 11.1). Is "emails" a defect to remove?
  2. Criterion 7 downloads the other two languages only when first chosen, while ACC-01 criterion 5 says the language screen, welcome and example group work with no connection and one tap sets the language. What happens when a visitor with no connection taps a language that is not bundled?
  3. The control is reachable "in Settings", but no story defines a Settings screen; ACC-06 profile holds language. Is Settings the profile?
  4. The string `Needs a connection, about {size} MB` has no key in the story. Not specified.
  5. The named native reviewer, register and glossary are open (launch dependency).

---

### XCT-02 See every amount as whole ariary with spaces, the same in every language

- Story: XCT-02 See every amount as whole ariary with spaces, the same in every language
- Surfaces:
  - SCR-XCT-06 | Amount formatter (one function for all amounts; test table `0 Ar`, `999 Ar`, `1 000 Ar`, `12 500 Ar`, `1 250 000 Ar`, `100 000 000 Ar`) | system | none | any displayed amount | none
  - SCR-XCT-07 | Amount input field (numeric keypad, live regrouping, large echo) | inline | Member | any amount field | typed value
  - SCR-XCT-08 | Amount error (`err.xct.amount_not_whole`) | inline | Member | fraction, exponent or invalid separator | field keeps what was typed
  - SCR-XCT-09 | Spelled-out amount line (from `SPELLED_AMOUNT_FROM_AR` 100 000) | inline | Member on a review screen | review screens | none
  - SCR-XCT-10 | Receipt, statement and export amount code (`MGA`, raw integer column) | system | none | receipts and exports | none
- States per surface:
  - SCR-XCT-06 [display]: no decimals, no symbol before the number, one space before `Ar`; identical in the three languages; grouping spaces and the space before `Ar` are non-breaking; equal-width digits in lists
  - SCR-XCT-06 [direction]: money in and out by words plus icon plus colour (`Received +5 000 Ar`, `Sent -5 000 Ar`); a fee is always its own line including `Fee: 0 Ar`
  - SCR-XCT-06 [rounding row]: the Rounding line to Gereo is its own labelled row (`ledger.rounding_line`), one aggregated row per original income in the app, per-hop lines in exports, no row at 0, always under 1 ariary per destination
  - SCR-XCT-06 [sms]: SMS use a normal space, not a non-breaking space; SMS receipt shows no Rounding line and its total includes it
  - SCR-XCT-06 [percent and reader]: percent written `25%` in every language; a lint fails on `25 %`; a screen reader reads an amount as a number in the person's language plus "ariary"
  - SCR-XCT-06 [integrity]: formatter never changes a stored value; test compares stored integer with displayed text for 1 000 random amounts per language
  - SCR-XCT-07 [default]: keypad opens; digits regroup live; large echo
  - SCR-XCT-07 [paste]: a single `.`, `,` or space followed by exactly three digits is read as a thousands separator; pasted `12 500`, `12500`, `12.500`, `12,500` all accepted as 12 500
  - SCR-XCT-08 [rejected]: `12.5`, `12.50`, `1.250.5`, an exponent form or letters rejected; server rejects `12500.5` and `1e4` and never rounds (a unit test pins 1250000.5 is rejected)
  - SCR-XCT-09 [shown]: amount at or above `SPELLED_AMOUNT_FROM_AR` adds a line spelling the amount in words in the person's language; the total on review equals the amount debited
  - SCR-XCT-10 [default]: `12 500 MGA` where the currency must be unambiguous; CSV has a raw integer column with no spaces
- Criteria map:
  - AC 1: SCR-XCT-06 [display]
  - AC 2: SCR-XCT-06 [display]
  - AC 3: SCR-XCT-08 [rejected]
  - AC 4: SCR-XCT-07 [default], [paste]; SCR-XCT-08 [rejected]
  - AC 5: SCR-XCT-06 [direction], [rounding row]
  - AC 6: SCR-XCT-09 [shown]
  - AC 7: SCR-XCT-10 [default]
  - AC 8: SCR-XCT-06 [sms]
  - AC 9: SCR-XCT-06 [percent and reader]
  - AC 10: SCR-XCT-06 [integrity]
- Objects and fields: Ledger entry (amount integer); Transaction (amount fields); message catalogue.
- Open points:
  1. Which receipts and statements count as "where the currency must be unambiguous" (show `MGA`) versus `Ar`? WAL-14 examples show `Ar` on the receipt; WAL conventions say receipts and exports use `MGA`. Not specified.
  2. A pasted `1,250` is read as 1 250 (thousands); in French locale `1,250` means 1.25; the story fixes the rule but does not state a warning on paste. Not specified.
  3. The spelled-out words for Malagasy depend on the native reviewer (XCT-01).
  4. No key is named for the review line that spells the amount. Not specified in the story.

---

### XCT-03 See dates, times and deadlines in Madagascar time, in words where it matters

- Story: XCT-03 See dates, times and deadlines in Madagascar time, in words where it matters
- Surfaces:
  - SCR-XCT-11 | Date and time formatter (stored UTC, shown in Madagascar time UTC+3) | system | none | any date or time | none
  - SCR-XCT-12 | Deadline display (absolute `Fri 24 Oct, 17:00 (Madagascar time)` plus time left) | inline | Member (and guest voters) | any deadline | none
  - SCR-XCT-13 | Clock check notice `xct.time.check_clock` | inline | Member | device clock differs from server by more than `TIME_SKEW_TOLERANCE_SECONDS` | none
  - SCR-XCT-14 | Date field and picker (typed or picked; large targets) | sheet | Member | any date field | pick or type
- States per surface:
  - SCR-XCT-11 [default]: stored UTC; displayed UTC+3; the zone label is a translated string; month in words on confirmations, receipts and notifications (`19 octobre 2026`, `19 Oktobra 2026`, `19 October 2026`); dense lists may use `19/10/2026`; never month-first; 24-hour clock
  - SCR-XCT-11 [relative words]: "Today", "tomorrow" and weekday names hand-written; build fails if a relative-time key is missing in Malagasy
  - SCR-XCT-11 [other zone]: device zone not UTC+3; Madagascar time only with the zone label on every deadline; no setting; never converts
  - SCR-XCT-11 [export]: ledger and audit entries store UTC and ISO; exports show ISO with `+03:00`
  - SCR-XCT-12 [open]: absolute time and time left (`in 2 hours`, `closes tonight 17:00`); time left updates while the screen is open
  - SCR-XCT-12 [passed]: shows `closed 17:00`, never a negative countdown
  - SCR-XCT-12 [offline]: cached deadlines show absolute time; relative time from the device clock marked `about`; a queued vote shows `Not counted yet. Connect before Fri 17:00` (XCT-05)
  - SCR-XCT-12 [reader]: deadline read as a sentence in the person's language
  - SCR-XCT-13 [shown]: sees `xct.time.check_clock`; the app uses server time for all deadlines
  - SCR-XCT-14 [default]: targets at least 48 dp; can also be typed
  - SCR-XCT-14 [invalid]: invalid date flagged next to the field with the expected form and an example; typed text kept; no blame
- Criteria map:
  - AC 1: SCR-XCT-11 [default]
  - AC 2: SCR-XCT-11 [default]
  - AC 3: SCR-XCT-11 [default], [relative words]
  - AC 4: SCR-XCT-12 [open], [passed]
  - AC 5: SCR-XCT-13 [shown]
  - AC 6: SCR-XCT-12 [offline]
  - AC 7: SCR-XCT-11 [other zone]
  - AC 8: SCR-XCT-14 [invalid]
  - AC 9: SCR-XCT-12 [reader]; SCR-XCT-14 [default]
  - AC 10: SCR-XCT-11 [export]
- Objects and fields: every object with a date (Transaction, Vote, Event, Contribution plan, Audit entry); stored UTC, ISO form.
- Open points:
  1. The strings `in 2 hours`, `closes tonight 17:00`, `closed 17:00` and `about` have no keys named in the story. Not specified.
  2. A diaspora member's zone is a Later item; no UI is specified.
  3. How is a deadline shown to a person whose device clock is wrong and who is offline (server time unknown)? Criterion 5 uses server time; offline there is none. Not specified in the story.
  4. The date format of the Malagasy month names is hand-written; the list is not in the story.

---

### XCT-04 Read my key information with no connection, and see when it was last updated

- Story: XCT-04 Read my key information with no connection, and see when it was last updated
- Surfaces:
  - SCR-XCT-15 | Cache status indicator (header: `Updated 14:05`, `Updating...` or `Not updated since yesterday. Retry`; `Updated {time}` near each cached title) | inline | Member | every cached screen | Retry
  - SCR-XCT-16 | First launch without connection (`xct.offline.first_launch`: what Gereo needs and Retry) | page | Member on an empty cache | app open | Retry
  - SCR-XCT-17 | Cache cleared notice (`xct.offline.cache_cleared`) | inline | Member | browser evicted the cache | restores on connection
  - SCR-XCT-18 | Storage explanation (`xct.storage.what_is_saved`: what is stored and how big; persistent storage request) | sheet | Member | first use or settings | accept
  - SCR-XCT-19 | Cache engine (what is cached, never-cached list, permissions at last sync, unlock gate, erase, trimming order) | system | none | sync, sign-out, lock | none
  - SCR-XCT-20 | "May be outdated" badge (icon and word) | inline | Member | balance older than `STALE_BALANCE_HOURS` | none
  - SCR-XCT-21 | "Updated" mark after background refresh | inline | Member | connection returns | none
- States per surface:
  - SCR-XCT-15 [no connection]: opens Home from cache within the performance budget; header shows one indicator; the word "offline" not used; text is "No connection" with what still works
  - SCR-XCT-15 [refresh failed]: weak connection; cached data kept; shows `Not updated since 14:05. Retry`; a server error shows the same message without the word "error"
  - SCR-XCT-15 [accessibility]: status announced politely, not every second; last-synced time uses XCT-03 date rules
  - SCR-XCT-16 [default]: first launch, empty cache and no connection; sees `xct.offline.first_launch` and Retry, not an empty list
  - SCR-XCT-16 [empty because no data]: a section empty because the person has no data shows the normal empty state, not a connection error
  - SCR-XCT-17 [default]: restored on connection; nothing lost on the server
  - SCR-XCT-18 [default]: tells what is stored and how big; asks for persistent storage
  - SCR-XCT-19 [cached]: own wallets and balances; last `CACHE_RECENT_TRANSACTIONS` per wallet; group ledger for `CACHE_LEDGER_DAYS`; member list; contributions due; open votes and events; decision log; tasks; rule definitions and summaries; permission bundles; approvals inbox, request detail and receipts (last 50 requests for the active wallet, last 10 for others); receipts and reference IDs; freeze state as last synced; receipts shareable offline
  - SCR-XCT-19 [never cached]: audit log (Group: view audit log); identity documents and selfies; other people's full phone numbers beyond the member list; operator back office; by default attachment bodies and photos
  - SCR-XCT-19 [permissions]: stores only what the person may see at the last sync; a removed permission removes the data at next sync; readable only after app unlock; deleted on sign-out or emergency lock
  - SCR-XCT-19 [trimming]: storage full; trimmed in the order of XCT-05 criterion 12; queued items never touched; balances, open votes and what the person owes always kept
  - SCR-XCT-19 [no write]: cache never creates or edits a ledger entry; a cached request never shows Approve to its requester (D1)
  - SCR-XCT-20 [shown]: balance older than `STALE_BALANCE_HOURS`; money-out button explains the balance is checked again at send
  - SCR-XCT-21 [shown]: background refresh without a full-screen loader; scroll position and open item kept
  - SCR-XCT-15 [loading]: the app never shows "No data" before the load completes
- Criteria map:
  - AC 1: SCR-XCT-15 [no connection]
  - AC 2: SCR-XCT-19 [cached], [never cached], [no write]
  - AC 3: SCR-XCT-19 [permissions]
  - AC 4: SCR-XCT-15 [no connection]; SCR-XCT-20 [shown]
  - AC 5: SCR-XCT-16 [default], [empty because no data]; SCR-XCT-15 [loading]
  - AC 6: SCR-XCT-21 [shown]
  - AC 7: SCR-XCT-18 [default]; SCR-XCT-19 [trimming]; SCR-XCT-17 [default]
  - AC 8: SCR-XCT-15 [refresh failed]
  - AC 9: no UI, system rule (no notification; the cache is a copy and cannot create or edit a ledger entry)
  - AC 10: SCR-XCT-15 [accessibility]
- Objects and fields: local cache of Wallet, Ledger entry, Transaction, Contribution, Vote, Event, Wallet rule, Membership; cache metadata (last synced time, size).
- Open points:
  1. Criterion 2 says receipts can be shared "as image, PDF or text while offline", while WAL-14 closes the shared receipt as PDF and plain text, not an image, and CON-04 and SPD-16 say image or text. Which formats are allowed?
  2. Criterion 1 shows the indicator `Updated 14:05` or "No connection"; GRP-06 criterion 5 shows one header line `Updated 14:05` with no mention of connection. Which text shows when the device has no connection?
  3. The criterion 2 never-cached list excludes the audit log, while GRP-10 criterion 5 shows cached access-history entries offline. Which applies to the access history timeline?
  4. The trimming order of XCT-05 criterion 12 starts with "attachment bodies (never cached)"; a never-cached item cannot be trimmed. Not specified.
  5. A cached "approvals" scope is the last 50 requests for the active wallet and the last 10 for each other wallet, while `CACHE_RECENT_TRANSACTIONS` is 50 per wallet; the "active wallet" definition is not specified.

---

### XCT-05 Queue the things that can wait, with a visible state, and reject the rest

- Story: XCT-05 Queue the things that can wait, with a visible state, and reject the rest
- Surfaces:
  - SCR-XCT-22 | Queue indicator (`2 items waiting since Mon`, `Retry now`, `Open Gereo when you have signal`) | inline | Member | any screen with queued items | opens SCR-XCT-23
  - SCR-XCT-23 | Queue list (items by owner story with state chip, Withdrawn action, retry) | page | Member | SCR-XCT-22 | withdraw, retry
  - SCR-XCT-24 | Queue state chips (`xct.queue.waiting`, `xct.queue.sent`, `xct.queue.confirmed`, `xct.queue.not_sent_retry`, `xct.queue.too_late`, `xct.queue.withdrawn`, `xct.queue.expired`, `xct.queue.draft`, `xct.queue.ballot_received`, `xct.queue.ballot_not_counted`, `xct.queue.ballot_deadline_warning`, `xct.queue.open_when_signal`) | inline | Member | every queued item and draft | none
  - SCR-XCT-25 | Ballot deadline warning (`xct.queue.ballot_deadline_warning`: "Your answer has not been sent. It only counts once Gereo receives it before {deadline}." with `Retry now`) | inline | voter with a queued ballot | less than `QUEUE_BALLOT_WARN_MINUTES` before the deadline | Retry now
  - SCR-XCT-26 | Conflict view (`Your change` and `{name}'s change`) | inline | editor of a draft, task or note | two edits of the same field | pick
  - SCR-XCT-27 | Items lost notice (`N items were lost`, listed by owner story) | modal | Member | browser evicted queued items | acknowledge
  - SCR-XCT-28 | Queue engine and registry guard (Table A auto-send, Table B local drafts, Table C never-queued index; idempotency; receipt-order decision; KYC photo rules) | system | none | queueable action completed | none
- States per surface:
  - SCR-XCT-22 [visible]: queue count and age visible; every `Waiting to send` item shows `Open Gereo when you have signal`; the app never drops an item silently
  - SCR-XCT-23 [default]: items survive app kill and restart; each names its owner story; sign-out with items warns first with the count (ACC-12); person can cancel a queued item before it is sent (state Withdrawn)
  - SCR-XCT-24 [flow]: Waiting to send, then Sent, then Confirmed when the connection returns
  - SCR-XCT-24 [terminal]: `Not sent. Retry` after the sixth connected failure; Too late; Withdrawn; Expired (older than `QUEUE_ITEM_MAX_DAYS`, with a visible message saying nothing changed)
  - SCR-XCT-24 [draft]: every local draft uses `Draft, not sent` (`xct.queue.draft`); `Saved on this phone` retired
  - SCR-XCT-24 [ballot]: Confirmed shown as `Received` (`xct.queue.ballot_received`); `Counted` only in vote results for a ballot that counts toward quorum; queued ballot shows `Not counted yet. Connect before {deadline}` (`xct.queue.ballot_not_counted`)
  - SCR-XCT-25 [shown]: warning with Retry now
  - SCR-XCT-25 [queued vote]: a vote may be queued only if its deadline is more than `QUEUE_VOTE_MIN_MINUTES` away; screen says `Not counted yet. Connect before {deadline}` and "Reminders may still arrive until a queued ballot is sent; the server cannot know about queued ballots"
  - SCR-XCT-25 [too late]: deadline passes while queued; server rejects; sees `Too late: voting closed 17:00, your answer arrived 17:04`; no grace window; extension only by a visible logged action of a holder of Vote: edit (VOT-12)
  - SCR-XCT-26 [default]: merge per field; both versions shown; never overwrites without telling; the server returns an item that conflicts with a ledger fact with a reason; at receipt the server revalidates permission and membership
  - SCR-XCT-27 [default]: lists lost items by owner story
  - SCR-XCT-28 [registry]: Table A rows (vote ballot, RSVP, personal date and note, task create and update, decision attachment upload, proof attachment on a sent request, support-ticket message, Report this payment, manual decision entry, decision amendment, notification preference changes and read marks, KYC photo upload, invite accept) all class `none` except `membership-self` for invite accept; manual decision entry and amendment flagged authorisation-restricted and never an authorising vote or counted toward quorum or approver count; badge `Recorded by {name}, not a vote` kept through amendments
  - SCR-XCT-28 [drafts]: Table B local drafts (expense request, announcement, group form, group edit including rules text, vote creation); sending is online only
  - SCR-XCT-28 [default deny]: action absent from Table A is not queueable; disabled when offline with `xct.offline.money_blocked` for money-out or `xct.offline.needs_connection` otherwise
  - SCR-XCT-28 [retries]: only attempts while connected count against `QUEUE_MAX_RETRIES` (6); backoff resets on connectivity regained and on app open or foreground; ballots keep retrying until the deadline
  - SCR-XCT-28 [idempotency]: client-generated ID per item; for ballots the key is (voter, vote); one ballot per (voter, vote) by server receipt order; guest voters cannot queue
  - SCR-XCT-28 [storage]: persistent storage; own budget `QUEUE_MAX_MB` (12) outside `CACHE_MAX_MB`; cache eviction never touches queued items
  - SCR-XCT-28 [kyc]: capture inside the app only; encrypted with a non-extractable key; deleted on server Confirmed, sign-out, remote wipe or emergency lock, and at `QUEUE_KYC_MAX_DAYS`; at most `QUEUE_KYC_MAX_CASES` per device; sign-out warning shows the number of KYC items and says they will be lost
- Criteria map:
  - AC 1: SCR-XCT-24 [flow]
  - AC 2: SCR-XCT-28 [registry], [drafts], [default deny]
  - AC 3: SCR-XCT-25 [queued vote], [shown]; SCR-XCT-24 [ballot]
  - AC 4: SCR-XCT-25 [too late]
  - AC 5: SCR-XCT-22 [visible]; SCR-XCT-28 [retries]; SCR-XCT-24 [terminal]
  - AC 6: SCR-XCT-26 [default]
  - AC 7: SCR-XCT-28 [idempotency]
  - AC 8: SCR-XCT-23 [default]
  - AC 9: SCR-XCT-24 [terminal]; SCR-XCT-23 [default] (rejected or expired item shows the reason and whether anything changed, with a button where a person must act)
  - AC 10: no UI, system rule (no ledger entry when queued; normal audit entries with client timestamp and server receipt time)
  - AC 11: SCR-XCT-24 [draft], [ballot], [terminal]
  - AC 12: SCR-XCT-28 [storage]; SCR-XCT-27 [default]
  - AC 13: SCR-XCT-28 [kyc]
- Objects and fields: Queue item (local: client ID, owner story, endpoint, state, client timestamp, device ID, attempts); Ballot; RSVP; Expense request (draft); Task; Draft (local); Audit entry.
- Open points:
  1. The story has 13 acceptance criteria; conventions section 6 limits a story to 6 to 10 and says to split above that. Which split is planned?
  2. Table C rows "Spend approve, reject, cancel and freeze" give `xct.offline.money_blocked`, while XCT-06 criterion 1 and SPD-06, SPD-12 give `xct.offline.needs_connection` for reject, cancel, edit and freeze. Which key applies to each?
  3. Table C lists "Contribution pay" under CON-01 and CON-04; CON-01 is plan creation, not payment. Is CON-01 a typo?
  4. Which control withdraws a queued item (criterion 8 names the state Withdrawn but no screen)? SCR-XCT-23 is inferred; not specified.
  5. The strings `2 items waiting since Mon` and `Too late: voting closed 17:00, your answer arrived 17:04` have no keys other than the listed `xct.queue.*` keys; the exact keys for these two are not specified.
  6. The queue never reopens a vote and there is no grace window; a voter whose ballot was Too late sees no path other than asking a Vote: edit holder; the screen for that is not specified.
  7. Vote by SMS is Later; no screen.

---

### XCT-06 Block money-out when there is no connection, say why, and never double-send

- Story: XCT-06 Block money-out when there is no connection, say why, and never double-send
- Surfaces:
  - SCR-XCT-29 | Money-out blocked reason (`xct.offline.money_blocked`: "You need a connection to move money. Nothing was taken.", next to the button, not in a pop-up) | inline | Member (permission per action) | any online-only money action without a connection | alternatives (SCR-XCT-30)
  - SCR-XCT-30 | Offline alternatives (`Save as draft` where a draft exists; `Remind me when I am connected`, a local reminder, not an SMS) | inline | Member | SCR-XCT-29 | save draft; set reminder
  - SCR-XCT-31 | Non-queueable reason (`xct.offline.needs_connection`) | inline | Member | rows of the online-only list that move no money out by themselves | none
  - SCR-XCT-32 | Balance recheck on the review screen (refresh before the PIN step; new balance and re-confirm) | inline | Member | balance older than `STALE_BALANCE_HOURS` | confirm again
  - SCR-XCT-33 | Payment unknown (`xct.offline.payment_unknown`: "We are checking. Do not send it again. We will SMS you."; Pending with reference ID) | page | Member | connection lost after the request was sent | reload status
  - SCR-XCT-34 | Money-out attempt guard (unique key per attempt; send button disabled after first tap) | system | none | any money-out attempt | none
  - SCR-XCT-35 | `payout_blocked` status (on the request; linked follow-up decision entry) | inline | requester and members who can view the request | payout stopped by SPD-10 checks after a passed vote | none
- States per surface:
  - SCR-XCT-29 [default]: online-only list (send inside Gereo, withdraw, move money between wallets, pay a contribution, give to a campaign, submit, edit, cancel, approve or reject an expense request, create the linked vote, retry a payout, close a wallet, freeze or unfreeze, change or reset the PIN, remove a member, delete the account, server exports); buttons disabled with the reason beside them; a payout started by a passed vote or approvals is started by the server so no phone state can start or block it
  - SCR-XCT-31 [default]: rows that move no money out by themselves (freeze and unfreeze, PIN change and reset, remove member, delete account, server exports, edit, cancel and reject of a request, creating the linked vote) show `xct.offline.needs_connection`; a freeze points to the OPS-06 support route
  - SCR-XCT-30 [default]: `Save as draft` and `Remind me when I am connected`
  - SCR-XCT-32 [differs]: refreshed balance differs; new balance shown; must confirm again; PIN screen never uses an old amount
  - SCR-XCT-33 [pending]: transaction shown as Pending with the reference ID; never Failed or Success on its own; on reconnect the app asks the server first and never resubmits
  - SCR-XCT-33 [statuses]: only Initiated, Pending, Confirmed, Failed, Cancelled and Needs attention
  - SCR-XCT-33 [attention]: dispatched Pending payout older than `PAYOUT_PENDING_ALERT_MINUTES` becomes Needs attention and appears in the operator queue; a queued payout shows "Waiting for the provider" up to `PAYOUT_PROVIDER_WAIT_MAX` and is not Needs attention
  - SCR-XCT-33 [failed]: says whether money left the wallet ("Not taken from your account" or "Taken, refund in progress, reference X") with a next-action button; a failed payout after a hold is reversed by a reversing entry
  - SCR-XCT-34 [idempotent]: retry or double tap sends the same key; at most one transaction
  - SCR-XCT-35 [blocked]: no transaction, nothing taken; vote close and decision write one atomic step; OPS-14 is the backstop
  - SCR-XCT-33 [notification]: final status of a Pending money-out by push and SMS with the reference (`msg.wal.withdrawal_confirmed.sms`, `msg.wal.withdrawal_failed.sms`, `msg.spd.payout_failed.sms`); an offline person gets the SMS and sees the status at next sync
  - SCR-XCT-29 [accessibility]: reason is text plus icon, announced as a status, read in the person's language; always the key `xct.offline.money_blocked` across money-out buttons
- Criteria map:
  - AC 1: SCR-XCT-29 [default]; SCR-XCT-31 [default]
  - AC 2: SCR-XCT-30 [default]
  - AC 3: SCR-XCT-32 [differs]
  - AC 4: SCR-XCT-34 [idempotent]
  - AC 5: SCR-XCT-33 [pending]
  - AC 6: SCR-XCT-33 [statuses], [attention]; SCR-XCT-35 [blocked]
  - AC 7: SCR-XCT-33 [failed]
  - AC 8: SCR-XCT-33 [notification]
  - AC 9: no UI, system rule (no ledger entry for a blocked or unsent attempt; audit records attempt created, request sent, status changes and who saw a warning, with client and server times)
  - AC 10: SCR-XCT-29 [accessibility]
- Objects and fields: Transaction (status, reference, idempotency key); Ledger entry; Notification; Audit entry; Queue item (local reminders only).
- Open points:
  1. `Remind me when I am connected` schedules a "local reminder on the phone"; the MVP is a PWA that cannot act when closed (D6). Is a local reminder feasible without a native build, and what does the person see if the platform does not support it?
  2. The online-only list uses `xct.offline.money_blocked` for some rows and `xct.offline.needs_connection` for others; XCT-05 Table C assigns different keys to spend reject, cancel and freeze (see XCT-05 open point 2).
  3. Criterion 1 says freeze and unfreeze "point to the support route of OPS-06" when offline; the screen for it is not specified.
  4. `payout_blocked` is "shown on the request"; its label, icon and wording are not specified in the story.
  5. The text `We are checking. Do not send it again. We will SMS you.` promises an SMS; SMS for money-out above `ntf.money_out_sms_min_amount` only (R185) may not send; is the sentence conditional? Not specified.

---

### XCT-07 Use less data with a data saver mode

- Story: XCT-07 Use less data with a data saver mode
- Surfaces:
  - SCR-XCT-36 | Data saver switch (`xct.saver.toggle`, text `On` or `Off`, one-sentence explanation) | inline | Individual or Visitor | Settings | toggles at once
  - SCR-XCT-37 | First-run data saver prompt (`Turn on data saver` and `Not now`, equal weight) | modal | Individual or Visitor with a Save-Data or Android Data Saver signal | first screen after language choice | choose
  - SCR-XCT-38 | Saver effects (placeholder avatars, images on tap, system font, 20 rows per list, no prefetch, no audio download, refresh on tap or open) | system | none | mode on | none
  - SCR-XCT-39 | Large download consent (size shown and asked first, in both modes) | modal | Individual | any single download above `LARGE_DOWNLOAD_CONSENT_MB` (export, language pack, receipt PDF bundle, app update) | accept or cancel
  - SCR-XCT-40 | Saver estimate (`About {n} Ar saved since you turned it on`, labelled as an estimate) | inline | Individual | SCR-XCT-36 | none
  - SCR-XCT-41 | Setting not saved (`err.xct.setting_not_saved`) | inline | Individual | storage of the setting fails | none
- States per surface:
  - SCR-XCT-36 [default]: switch applies at once with no restart; state as text
  - SCR-XCT-36 [offline]: can be switched offline; cached content the same
  - SCR-XCT-37 [shown]: never turned on silently
  - SCR-XCT-38 [on]: effects as listed; amounts, statuses, reference IDs, PIN pad, receipts, votes, approvals and the example group identical in both modes; KYC photos are the one place images are sent and are compressed in both modes (ACC-08)
  - SCR-XCT-39 [default]: shows the size; asks first
  - SCR-XCT-40 [measured]: computed from measured bytes avoided times `DATA_COST_AR_PER_MB`; follows the amount format
  - SCR-XCT-40 [no data]: `Not enough use yet`, not zero
  - SCR-XCT-41 [shown]: mode applies for the session; no money involved
- Criteria map:
  - AC 1: SCR-XCT-36 [default]
  - AC 2: SCR-XCT-37 [shown]
  - AC 3: SCR-XCT-38 [on]
  - AC 4: SCR-XCT-38 [on]
  - AC 5: SCR-XCT-39 [default]
  - AC 6: SCR-XCT-40 [measured], [no data]
  - AC 7: SCR-XCT-36 [offline]
  - AC 8: SCR-XCT-41 [shown]
  - AC 9: no UI, system rule (no notification or ledger entry; not audited, a device preference)
  - AC 10: SCR-XCT-40 [measured] (plain words in the person's language; amount format of XCT-02)
- Objects and fields: Device settings (local: saver on or off); measured transfer counters (local).
- Open points:
  1. The first-run prompt appears "on the first screen after language choice", while ACC-01 criterion 1 and 2 define the language screen opening the welcome screen directly. Where does the prompt sit relative to the welcome screen?
  2. Saver mode lists 20 rows instead of 30 per page, while WAL `HISTORY_PAGE_SIZE` and CON-16 use 20; XCT-11 says 20 to 30. What is the normal page size?
  3. Whether people trust the estimate is open for field interviews (default: ship with "About" and drop if two sessions misread it).
  4. The key of the one-sentence explanation is not specified.

---

### XCT-08 Make every money screen work at 200% text size

- Story: XCT-08 Make every money screen work at 200% text size
- Surfaces:
  - SCR-XCT-42 | Large-text layout rule (reflow at 200% system font and 320 CSS px; wrapping buttons; no clipped amount) | system | Individual (every money screen and critical flow) | every screen | none
  - SCR-XCT-43 | Large-text screenshot test (per money screen in Malagasy at 200%; manual run per release) | system | product team | every build | none
- States per surface:
  - SCR-XCT-42 [reflow]: all content visible without horizontal scrolling in three languages
  - SCR-XCT-42 [amounts]: no amount, balance, fee or total truncated, ellipsised or split; test renders `100 000 000 Ar` with a long sign and status in the narrowest layout
  - SCR-XCT-42 [controls]: buttons and tabs wrap onto two lines; bottom navigation keeps always-visible labels with up to four items and may wrap them
  - SCR-XCT-42 [spacing]: with line height 1.5, paragraph spacing 2, letter spacing 0.12 and word spacing 0.16 nothing is lost or overlaps
  - SCR-XCT-42 [sticky]: a focused field or button never fully hidden by the keyboard, sticky bar or bottom navigation; PIN pad and primary action reachable by scrolling
  - SCR-XCT-42 [banners]: skeletons, banners and dialogs reflow; a banner never covers an amount
  - SCR-XCT-42 [errors]: error messages and inline hints grow with the text and stay next to their field
  - SCR-XCT-42 [units]: sizes in relative units; no text inside an image
  - SCR-XCT-43 [fail]: screenshot test fails on overlap, clipping or horizontal scroll
- Criteria map:
  - AC 1: SCR-XCT-42 [reflow]
  - AC 2: SCR-XCT-42 [amounts]
  - AC 3: SCR-XCT-42 [controls]
  - AC 4: SCR-XCT-42 [spacing]
  - AC 5: SCR-XCT-42 [sticky]
  - AC 6: SCR-XCT-42 [banners]
  - AC 7: SCR-XCT-42 [errors]
  - AC 8: no UI, system rule (no notification, ledger or audit)
  - AC 9: SCR-XCT-43 [fail]
  - AC 10: SCR-XCT-42 [units]
- Objects and fields: none.
- Open points:
  1. The "money screen" definition is a rule and the information architecture flags each page; until the IA exists the set of screens under test is not listed. Not specified in the story.
  2. Does the bottom navigation wrapping at 200% apply to the four fixed items without changing order (09 rule 2)? Stated by the story; no conflict recorded.
  3. The "top five tasks" for the manual run are not named in the story.

---

### XCT-09 Check contrast, target size and status without colour on every screen

- Story: XCT-09 Check contrast, target size and status without colour on every screen
- Surfaces:
  - SCR-XCT-44 | Status chip (icon, word and colour for Initiated, Pending, Confirmed, Failed, Cancelled, Needs attention and for sent and received indicators) | inline | Individual | every status | none
  - SCR-XCT-45 | Contrast and target rules (4.5:1 text, 3:1 large text and interface parts, 7:1 amounts and primary labels, 48 dp targets with 8 dp spacing, 56 dp primary money actions) | system | Individual (both themes) | every build and screen | none
  - SCR-XCT-46 | Accessibility checks in CI (axe or equivalent, Lighthouse score, greyscale and sunlight simulation) | system | product team | every build | none
- States per surface:
  - SCR-XCT-44 [default]: icon, word and colour; each status colour 3:1 against its background and its text 4.5:1; a greyscale screenshot test confirms each status is distinguishable by icon and word
  - SCR-XCT-45 [text]: 4.5:1 for text, 3:1 for large text and meaningful interface boundaries and icons, in light and dark themes
  - SCR-XCT-45 [outdoors]: amount text and primary button labels reach `CONTRAST_TARGET_AMOUNT` (7:1) in both themes and at least 4.5:1 in a simulated sunlight mode; a brand colour that cannot reach 7:1 is not used for a primary button
  - SCR-XCT-45 [targets]: every tappable element at least 48 by 48 dp with at least 8 dp between neighbours; primary money actions 56 dp; whole list rows tappable; fails the build below 24 CSS px
  - SCR-XCT-45 [charts]: values labelled directly; colour-blind-safe pair; red or green paired with a shape, arrow or sign; no information only in a chart
  - SCR-XCT-45 [forms]: errors with text, an icon and the field outline next to the field and in a summary at the top that receives focus
  - SCR-XCT-45 [states]: same checks for disabled, pending, loading, offline, incident and empty states; no-connection and provider-unavailable banners keep 4.5:1
  - SCR-XCT-46 [fail]: failed check fails the build with screen name, element and measured value
- Criteria map:
  - AC 1: SCR-XCT-45 [text]
  - AC 2: SCR-XCT-45 [outdoors]
  - AC 3: SCR-XCT-45 [targets]
  - AC 4: SCR-XCT-44 [default]
  - AC 5: SCR-XCT-45 [charts]
  - AC 6: SCR-XCT-45 [forms]
  - AC 7: SCR-XCT-45 [states]
  - AC 8: SCR-XCT-46 [fail]
  - AC 9: no UI, system rule (not applicable: notifications, ledger, audit)
  - AC 10: SCR-XCT-46 [fail] (axe or equivalent and Lighthouse in CI; manual greyscale and colour-blindness review; one TalkBack run per release)
- Objects and fields: none (design tokens, status vocabulary).
- Open points:
  1. Criterion 4 lists the six transaction statuses; ACC-09 and CON use other status words (Pending, Approved, Rejected; Upcoming, Late, Paid, Exempt). Does the chip rule apply to every object's statuses? The story lists transaction statuses only; not specified for others.
  2. The "simulated sunlight mode" test method is described loosely ("screenshot brightened and flattened"); the exact filter is not specified.
  3. No separate high-contrast setting in the MVP (closed).

---

### XCT-10 Use Gereo with a screen reader, a keyboard and reduced motion

- Story: XCT-10 Use Gereo with a screen reader, a keyboard and reduced motion
- Surfaces:
  - SCR-XCT-47 | Accessibility behaviours (names, roles, focus order, live regions, gestures with tap alternatives, reduced motion) | system | Individual (TalkBack, keyboard, reduced motion) | every screen | none
  - SCR-XCT-48 | Help control (same place on every screen, in-context help and the support route OPS-06) | inline | Individual | every screen | opens help
  - SCR-XCT-49 | Persistent money outcome card (success, error or progress never only in a toast) | inline | Individual | after a money outcome | none
- States per surface:
  - SCR-XCT-47 [names]: each interactive element has a purpose name; meaningful icons also have a visible label; decorative icons hidden
  - SCR-XCT-47 [rows]: each repeated row has a unique name with amount, counterparty and status (`Sent 5 000 Ar to Rado, Confirmed, 14:05`)
  - SCR-XCT-47 [focus]: focus order matches visual order; visible; moves to the error summary on a failed submit and to the new screen title on navigation; a sticky element never hides the focused control
  - SCR-XCT-47 [live regions]: `role="status"` or `role="alert"` without moving focus
  - SCR-XCT-47 [gestures]: no action needs a swipe or a drag; every drag (reordering split rules, a percentage slider) has a tap alternative and a typed input
  - SCR-XCT-47 [motion]: non-essential motion removed with the system reduced-motion setting or on a low-RAM device, including the brief sending animation
  - SCR-XCT-47 [authentication]: OTP fields allow paste and autofill; the PIN screen offers biometric as an alternative where available; `lang` marked on passages in another language
  - SCR-XCT-47 [errors]: every error names the field, says what to do and keeps typed values; reviewing before a money action is possible for every money action
  - SCR-XCT-48 [default]: `Help` in the same place on every screen (WCAG 3.2.6)
  - SCR-XCT-49 [default]: money outcome on a persistent screen or card (ACC-03 PIN result, XCT-06)
- Criteria map:
  - AC 1: SCR-XCT-47 [names]
  - AC 2: SCR-XCT-47 [rows]
  - AC 3: SCR-XCT-47 [focus]
  - AC 4: SCR-XCT-47 [live regions]; SCR-XCT-49 [default]
  - AC 5: SCR-XCT-47 [gestures]
  - AC 6: SCR-XCT-47 [motion]
  - AC 7: SCR-XCT-48 [default]
  - AC 8: SCR-XCT-47 [authentication]
  - AC 9: SCR-XCT-47 [errors]
  - AC 10: no UI, system rule (TalkBack run per release plus automated rules for names, roles and focus in CI; result in the release checklist)
- Objects and fields: none.
- Open points:
  1. Criterion 8 says the PIN screen offers biometric as an alternative "where available", while ACC-03 criterion 5 says biometric unlocks the app only and money-out always needs the PIN, and WAL-10 criterion 2 never lets biometrics replace the PIN. Which applies on money-out PIN screens?
  2. Where is the Help control placed (it must be the same place everywhere), and does it appear on the guest vote page (no bottom bar, ACC-16, 150 KB budget)? Not specified in the story.
  3. The ACC-03 PIN result as a persistent screen is cited; the corresponding screen in the ACC inventory is SCR-ACC-11 [success]; no conflict recorded.
  4. Audio read-out of amounts is Later (closed).

---

### XCT-11 Hold Gereo to performance budgets that fail the build

- Story: XCT-11 Hold Gereo to performance budgets that fail the build
- Surfaces:
  - SCR-XCT-50 | Performance gate (Lighthouse on critical flows with mobile throttling; budgets for LCP, INP, CLS, size, assets, data per screen; real device check; vote link page 150 KB) | system | product team | every build and release candidate | none
  - SCR-XCT-51 | UI feel rules (press state within 100 ms; skeletons only for a first uncached full-page load; spinners only inside one card; progress bars only for uploads; no optimistic success for money) | system | Individual | every screen | none
  - SCR-XCT-52 | Performance report (one page per release) | system | product team | release | none
- States per surface:
  - SCR-XCT-50 [pass]: all budgets met
  - SCR-XCT-50 [fail]: names the route, the metric, the measured value and the limit; build fails
  - SCR-XCT-50 [vitals]: LCP at most 2.5 s, INP at most 200 ms, CLS at most 0.1 (75th percentile in field data once available)
  - SCR-XCT-50 [size]: JavaScript per route under about 100 KB compressed; first-visit transfer at most about 300 KB; time to interactive under 5 s; vote link page at most 150 KB compressed, one language, system font, no avatar
  - SCR-XCT-50 [assets]: no required image on a first view; avatar or illustration lazy and at most about 20 KB; one font subset under about 40 KB with system fallback; one inline icon sprite; no text in images
  - SCR-XCT-50 [data per screen]: list responses at most about 15 KB, paginated at 20 to 30 rows; repeat visit loads the shell from cache with 0 bytes
  - SCR-XCT-50 [native]: only if a native Android build exists: under 40 MB installed, startup under 5 s on a 1 to 2 GB phone; decorative animation off on low-RAM devices
  - SCR-XCT-50 [change]: a budget change needs a recorded decision with a reason; values and history kept
  - SCR-XCT-51 [default]: rules as listed
  - SCR-XCT-52 [default]: measured values for the critical flows and the real device result; part of the release checklist
- Criteria map:
  - AC 1: SCR-XCT-50 [pass], [fail]
  - AC 2: SCR-XCT-50 [vitals]
  - AC 3: SCR-XCT-50 [size]
  - AC 4: SCR-XCT-50 [assets]
  - AC 5: SCR-XCT-50 [data per screen]
  - AC 6: SCR-XCT-50 [native]
  - AC 7: SCR-XCT-51 [default]
  - AC 8: SCR-XCT-50 [change]
  - AC 9: SCR-XCT-50 [fail]
  - AC 10: SCR-XCT-52 [default]
- Objects and fields: none (build and test results).
- Open points:
  1. The exact Android Go test phone model is open (founder purchase decision B14; default any phone with 1 to 2 GB RAM on Android 8.1 Go or later).
  2. The story says list pages are 20 to 30 rows; XCT-07 says 30 normal and 20 in saver mode; WAL `HISTORY_PAGE_SIZE` is 20. Which is the normal size?
  3. The page budget is stated for the vote link page only; the invite link page (ACC-16) is not named. Not specified in the story.
  4. This story has no page ("not applicable"); its surfaces are build gates.

---

### XCT-12 Write SMS templates that stay in one 160-character message

- Story: XCT-12 Write SMS templates that stay in one 160-character message
- Surfaces:
  - SCR-XCT-53 | SMS lint (per language: character set, forbidden characters, worst-case length, content, amounts and dates, same meaning, key grammar and catalogue membership) | system | product team | every template change and every build | none
  - SCR-XCT-54 | Person-supplied name mapping table (`â` to `a`, `ê` to `e`, `î` to `i`, `ô` to `o`, `û` to `u`, lowercase `ç` to `c`, curly apostrophes to straight; unmappable name becomes `a member`) | system | none | name substitution in SMS | none
- States per surface:
  - SCR-XCT-53 [character set]: fails if any character is outside the GSM-7 basic set or extension table (extension characters count two); reports segment count; a non-GSM character switches to UCS-2 at 70 per segment and fails unless an NTF-07 exception marks the template multi-segment
  - SCR-XCT-53 [forbidden]: reports curly apostrophes and quotes, emoji, circumflex letters, lowercase `ç`, non-breaking and narrow no-break spaces, tab and special dash; only a straight apostrophe allowed
  - SCR-XCT-53 [length]: variables at maximum length; at most `SMS_MAX_CHARS` (160) after worst-case substitution (amount `100 000 000 Ar`, 8-character reference, `ntf.sms_group_name_max`, first-name cap, `ntf.sms_title_max`, `ntf.sms_place_max`, date `24/10`, time `17:00`); an OTP template fits one segment including `@{APP_DOMAIN} #{code}`; over 160 the key must carry a fixed short template with the generic name `a member`
  - SCR-XCT-53 [content]: starts with `Gereo:`; leads with the action and the amount; includes a reference or support route where money or access is involved; ends with the reference; OTP has the code, validity in minutes, the never-asks sentence and the last line; no PIN or code request; no marketing
  - SCR-XCT-53 [formats]: amounts per XCT-02 with a normal space; dates `dd/mm` or `dd/mm/yyyy` in Madagascar time; no month-first order
  - SCR-XCT-53 [same meaning]: placeholder sets equal across languages; a template shorter than 60% or longer than 160% of the English version flagged for human review
  - SCR-XCT-53 [fail]: template not deployable; prints key, language, offending character or length and segment count
  - SCR-XCT-53 [keys]: key grammar `^msg\.[a-z]{2,4}\.[a-z0-9_]+(\.(push|sms|inapp))?$`; every base key in the NTF catalogue; `sms.*`, `push.*`, `ntf.*` rejected as message keys; `ntf.*` parameter family exempt
  - SCR-XCT-54 [default]: fixed mapping data tested on sample names in three languages; a character with no mapping dropped; never drops a money reminder; send-time failure belongs to NTF-07 and NTF-13
  - SCR-XCT-53 [review]: five templates per epic reviewed by a native speaker for meaning
- Criteria map:
  - AC 1: SCR-XCT-53 [character set]
  - AC 2: SCR-XCT-53 [forbidden]
  - AC 3: SCR-XCT-53 [length]
  - AC 4: SCR-XCT-53 [content]
  - AC 5: SCR-XCT-53 [formats]
  - AC 6: SCR-XCT-53 [same meaning]
  - AC 7: SCR-XCT-53 [fail]
  - AC 8: SCR-XCT-54 [default]
  - AC 9: SCR-XCT-53 [keys]
  - AC 10: SCR-XCT-53 [review]; no ledger entry; audit of each SMS send is by NTF (no UI)
- Objects and fields: SMS template catalogue (key, language, segments); Notification.
- Open points:
  1. Criterion 3 cuts a name longer than its cap with `...` "by the function of criterion 8", but criterion 8 defines a character mapping, not truncation. Which function truncates?
  2. Criterion 8 says XCT-12 defines no runtime replace-and-send step, while R131 says the runtime sanitises person-supplied names. Where does the mapping run at send time (NTF-07)?
  3. The SMS aggregator's segment counting, sender name and rates are open (default: own count from the lint).
  4. The three-dot `...` is three ASCII characters; whether it counts as one character in the 160 limit is not specified.

---

### XCT-13 Check every screen with a pseudo-language that is longer than any real one

- Story: XCT-13 Check every screen with a pseudo-language that is longer than any real one
- Surfaces:
  - SCR-XCT-55 | Pseudo-locale screenshot test (strings wrapped in `[` `]`, expanded by `PSEUDO_EXPANSION` 1.6 with accents; every screen and state at normal and 200% size) | system | product team | every build, new screen, first 150 strings translated | none
  - SCR-XCT-56 | Expansion report (median and 90th percentile length against English per string group) | system | product team | after the first 150 strings are translated | none
- States per surface:
  - SCR-XCT-55 [render]: pseudo-locale generated; every screen and state rendered at normal font size and at 200% (XCT-08)
  - SCR-XCT-55 [truncation]: fails on text cut by ellipsis, clipped, overlapping or forced to scroll horizontally; buttons and tab labels wrap to two lines; no fixed-width pill
  - SCR-XCT-55 [hard-coded]: visible text not wrapped in the markers is reported as hard-coded text and fails the build
  - SCR-XCT-55 [images]: an image with embedded text flagged (list of known assets plus an OCR spot check on first views)
  - SCR-XCT-55 [plurals]: plural messages rendered with counts 0, 1, 2 and 11; `mg` and `fr` rules `one` and `other`
  - SCR-XCT-55 [exceptions]: a screen with a known exception listed with a reason and reviewed each release; the list cannot grow without a recorded approval
  - SCR-XCT-55 [fail]: failure names screen, key, language and a screenshot diff
  - SCR-XCT-56 [default]: layout targets (2 times for short labels, 1.5 times for long ones) checked against measured values and updated
  - SCR-XCT-56 [release]: report part of the release checklist and attached to the design hand-off of each screen
- Criteria map:
  - AC 1: SCR-XCT-55 [render]
  - AC 2: SCR-XCT-55 [truncation]
  - AC 3: SCR-XCT-55 [hard-coded]
  - AC 4: SCR-XCT-55 [images]
  - AC 5: SCR-XCT-56 [default]
  - AC 6: SCR-XCT-55 [plurals]
  - AC 7: SCR-XCT-55 [exceptions]
  - AC 8: SCR-XCT-55 [fail]
  - AC 9: no UI, system rule (not applicable: notifications, ledger, audit)
  - AC 10: SCR-XCT-56 [release]
- Objects and fields: message catalogue; screenshot baselines.
- Open points:
  1. The real Malagasy and French expansion ratios are unknown until criterion 5 reports (default 1.6 times and 2 times and 1.5 times targets).
  2. The story says Malagasy is likely the longest; the CLDR plural categories for `mg` are cited as `one` and `other`; not verified in the story.
  3. The list of exceptions (for example a table that must scroll) is empty at launch; not specified.

---

### XCT-14 Keep every string a key, with safe fallback, plurals and one glossary

- Story: XCT-14 Keep every string a key, with safe fallback, plurals and one glossary
- Surfaces:
  - SCR-XCT-57 | Message catalogue and key lint (English source, French and Malagasy, context note, status draft or reviewed or back-translated, owner, last change date; fallback; message format) | system | product team | every text change | none
  - SCR-XCT-58 | Glossary (approved Malagasy, French and English forms with an example sentence; banned synonyms; the five lock and hold terms) | system | product owner; native reviewer approves Malagasy | term change | none
  - SCR-XCT-59 | Copy checklist (plain-language voice rules) | system | content reviewers | each screen review | none
- States per surface:
  - SCR-XCT-57 [keys]: all visible text read from the catalogue by key; a lint fails the build on a string literal in a screen component; UI keys `<epic>.<area>.<name>`; notification bodies only `msg.<epic>.<event>`
  - SCR-XCT-57 [catalogue]: each key has the fields listed
  - SCR-XCT-57 [fallback]: missing key falls back Malagasy to French to English; raw key never displayed; build fails if a key exists in code and not in English and French; report lists missing Malagasy keys by screen
  - SCR-XCT-57 [messages]: whole sentences with named placeholders; concatenation forbidden (lint flags `+` between translated parts); plural and gender by message format with `one` and `other` for `mg` and `fr`
  - SCR-XCT-57 [release]: untranslated and changed strings listed; strings frozen for the release candidate
  - SCR-XCT-57 [malformed]: build fails with key and language; at runtime falls back to English text and logs an event
  - SCR-XCT-57 [notifications]: SMS and push keys follow the same catalogue with the SMS checks of XCT-12
  - SCR-XCT-58 [default]: terms changed only through a recorded decision; includes PIN lock-out, App lock, Account lock, Wallet freeze and Operator hold (UI label `Held by Gereo`); bare "lock" and "frozen" banned
  - SCR-XCT-59 [default]: one idea per sentence, verb first for actions, exact amounts and times, no blame words, no exclamation marks or emoji near money, no "soon"
- Criteria map:
  - AC 1: SCR-XCT-57 [keys]
  - AC 2: SCR-XCT-57 [catalogue]
  - AC 3: SCR-XCT-57 [fallback]
  - AC 4: SCR-XCT-57 [messages]
  - AC 5: SCR-XCT-58 [default]
  - AC 6: SCR-XCT-59 [default]
  - AC 7: SCR-XCT-57 [release]
  - AC 8: SCR-XCT-57 [malformed]
  - AC 9: SCR-XCT-57 [notifications]
  - AC 10: no UI, system rule (not applicable: ledger and audit; catalogue history is version control history)
- Objects and fields: message catalogue (key, translations, context note, status, owner, date); glossary (term, forms, example).
- Open points:
  1. The glossary has 20 to 30 terms tested with users (06 process 4.3); the term list is not in the story.
  2. Criterion 3 says the build fails if a key is missing in English and French while XCT-01 says a missing Malagasy key is a release blocker for P0 screens only; the status of a missing Malagasy key on a non-P0 screen is "report only". Confirmed by the story; not an ambiguity but recorded.
  3. No i18n library is installed yet; the choice must support ICU plurals, lazy loading and a missing-key hook (open question closed on the format, library not chosen).
  4. The native reviewer approving the Malagasy column is a launch dependency (open, B12).

---

## Epic summary

- Stories: 14.
- Distinct surfaces: 59. By kind:
  - page: 3
  - sheet: 2
  - modal: 3
  - inline: 27
  - notification: 0
  - system: 24
- State lines: 152.
- Open points: 59. Full list:
  - XCT-01.1: Criterion 3 says the language decides messages "sent push, SMS and emails", but there is no email channel (conventions 11.1). Is "emails" a defect to remove?
  - XCT-01.2: Criterion 7 downloads the other two languages only when first chosen, while ACC-01 criterion 5 says the language screen, welcome and example group work with no connection and one tap sets the language. What happens when a visitor with no connection taps a language that is not bundled?
  - XCT-01.3: The control is reachable "in Settings", but no story defines a Settings screen; ACC-06 profile holds language. Is Settings the profile?
  - XCT-01.4: The string `Needs a connection, about {size} MB` has no key in the story. Not specified.
  - XCT-01.5: The named native reviewer, register and glossary are open (launch dependency).
  - XCT-02.1: Which receipts and statements count as "where the currency must be unambiguous" (show `MGA`) versus `Ar`? WAL-14 examples show `Ar` on the receipt; WAL conventions say receipts and exports use `MGA`. Not specified.
  - XCT-02.2: A pasted `1,250` is read as 1 250 (thousands); in French locale `1,250` means 1.25; the story fixes the rule but does not state a warning on paste. Not specified.
  - XCT-02.3: The spelled-out words for Malagasy depend on the native reviewer (XCT-01).
  - XCT-02.4: No key is named for the review line that spells the amount. Not specified in the story.
  - XCT-03.1: The strings `in 2 hours`, `closes tonight 17:00`, `closed 17:00` and `about` have no keys named in the story. Not specified.
  - XCT-03.2: A diaspora member's zone is a Later item; no UI is specified.
  - XCT-03.3: How is a deadline shown to a person whose device clock is wrong and who is offline (server time unknown)? Criterion 5 uses server time; offline there is none. Not specified in the story.
  - XCT-03.4: The date format of the Malagasy month names is hand-written; the list is not in the story.
  - XCT-04.1: Criterion 2 says receipts can be shared "as image, PDF or text while offline", while WAL-14 closes the shared receipt as PDF and plain text, not an image, and CON-04 and SPD-16 say image or text. Which formats are allowed?
  - XCT-04.2: Criterion 1 shows the indicator `Updated 14:05` or "No connection"; GRP-06 criterion 5 shows one header line `Updated 14:05` with no mention of connection. Which text shows when the device has no connection?
  - XCT-04.3: The criterion 2 never-cached list excludes the audit log, while GRP-10 criterion 5 shows cached access-history entries offline. Which applies to the access history timeline?
  - XCT-04.4: The trimming order of XCT-05 criterion 12 starts with "attachment bodies (never cached)"; a never-cached item cannot be trimmed. Not specified.
  - XCT-04.5: A cached "approvals" scope is the last 50 requests for the active wallet and the last 10 for each other wallet, while `CACHE_RECENT_TRANSACTIONS` is 50 per wallet; the "active wallet" definition is not specified.
  - XCT-05.1: The story has 13 acceptance criteria; conventions section 6 limits a story to 6 to 10 and says to split above that. Which split is planned?
  - XCT-05.2: Table C rows "Spend approve, reject, cancel and freeze" give `xct.offline.money_blocked`, while XCT-06 criterion 1 and SPD-06, SPD-12 give `xct.offline.needs_connection` for reject, cancel, edit and freeze. Which key applies to each?
  - XCT-05.3: Table C lists "Contribution pay" under CON-01 and CON-04; CON-01 is plan creation, not payment. Is CON-01 a typo?
  - XCT-05.4: Which control withdraws a queued item (criterion 8 names the state Withdrawn but no screen)? SCR-XCT-23 is inferred; not specified.
  - XCT-05.5: The strings `2 items waiting since Mon` and `Too late: voting closed 17:00, your answer arrived 17:04` have no keys other than the listed `xct.queue.*` keys; the exact keys for these two are not specified.
  - XCT-05.6: The queue never reopens a vote and there is no grace window; a voter whose ballot was Too late sees no path other than asking a Vote: edit holder; the screen for that is not specified.
  - XCT-05.7: Vote by SMS is Later; no screen.
  - XCT-06.1: `Remind me when I am connected` schedules a "local reminder on the phone"; the MVP is a PWA that cannot act when closed (D6). Is a local reminder feasible without a native build, and what does the person see if the platform does not support it?
  - XCT-06.2: The online-only list uses `xct.offline.money_blocked` for some rows and `xct.offline.needs_connection` for others; XCT-05 Table C assigns different keys to spend reject, cancel and freeze (see XCT-05 open point 2).
  - XCT-06.3: Criterion 1 says freeze and unfreeze "point to the support route of OPS-06" when offline; the screen for it is not specified.
  - XCT-06.4: `payout_blocked` is "shown on the request"; its label, icon and wording are not specified in the story.
  - XCT-06.5: The text `We are checking. Do not send it again. We will SMS you.` promises an SMS; SMS for money-out above `ntf.money_out_sms_min_amount` only (R185) may not send; is the sentence conditional? Not specified.
  - XCT-07.1: The first-run prompt appears "on the first screen after language choice", while ACC-01 criterion 1 and 2 define the language screen opening the welcome screen directly. Where does the prompt sit relative to the welcome screen?
  - XCT-07.2: Saver mode lists 20 rows instead of 30 per page, while WAL `HISTORY_PAGE_SIZE` and CON-16 use 20; XCT-11 says 20 to 30. What is the normal page size?
  - XCT-07.3: Whether people trust the estimate is open for field interviews (default: ship with "About" and drop if two sessions misread it).
  - XCT-07.4: The key of the one-sentence explanation is not specified.
  - XCT-08.1: The "money screen" definition is a rule and the information architecture flags each page; until the IA exists the set of screens under test is not listed. Not specified in the story.
  - XCT-08.2: Does the bottom navigation wrapping at 200% apply to the four fixed items without changing order (09 rule 2)? Stated by the story; no conflict recorded.
  - XCT-08.3: The "top five tasks" for the manual run are not named in the story.
  - XCT-09.1: Criterion 4 lists the six transaction statuses; ACC-09 and CON use other status words (Pending, Approved, Rejected; Upcoming, Late, Paid, Exempt). Does the chip rule apply to every object's statuses? The story lists transaction statuses only; not specified for others.
  - XCT-09.2: The "simulated sunlight mode" test method is described loosely ("screenshot brightened and flattened"); the exact filter is not specified.
  - XCT-09.3: No separate high-contrast setting in the MVP (closed).
  - XCT-10.1: Criterion 8 says the PIN screen offers biometric as an alternative "where available", while ACC-03 criterion 5 says biometric unlocks the app only and money-out always needs the PIN, and WAL-10 criterion 2 never lets biometrics replace the PIN. Which applies on money-out PIN screens?
  - XCT-10.2: Where is the Help control placed (it must be the same place everywhere), and does it appear on the guest vote page (no bottom bar, ACC-16, 150 KB budget)? Not specified in the story.
  - XCT-10.3: The ACC-03 PIN result as a persistent screen is cited; the corresponding screen in the ACC inventory is SCR-ACC-11 [success]; no conflict recorded.
  - XCT-10.4: Audio read-out of amounts is Later (closed).
  - XCT-11.1: The exact Android Go test phone model is open (founder purchase decision B14; default any phone with 1 to 2 GB RAM on Android 8.1 Go or later).
  - XCT-11.2: The story says list pages are 20 to 30 rows; XCT-07 says 30 normal and 20 in saver mode; WAL `HISTORY_PAGE_SIZE` is 20. Which is the normal size?
  - XCT-11.3: The page budget is stated for the vote link page only; the invite link page (ACC-16) is not named. Not specified in the story.
  - XCT-11.4: This story has no page ("not applicable"); its surfaces are build gates.
  - XCT-12.1: Criterion 3 cuts a name longer than its cap with `...` "by the function of criterion 8", but criterion 8 defines a character mapping, not truncation. Which function truncates?
  - XCT-12.2: Criterion 8 says XCT-12 defines no runtime replace-and-send step, while R131 says the runtime sanitises person-supplied names. Where does the mapping run at send time (NTF-07)?
  - XCT-12.3: The SMS aggregator's segment counting, sender name and rates are open (default: own count from the lint).
  - XCT-12.4: The three-dot `...` is three ASCII characters; whether it counts as one character in the 160 limit is not specified.
  - XCT-13.1: The real Malagasy and French expansion ratios are unknown until criterion 5 reports (default 1.6 times and 2 times and 1.5 times targets).
  - XCT-13.2: The story says Malagasy is likely the longest; the CLDR plural categories for `mg` are cited as `one` and `other`; not verified in the story.
  - XCT-13.3: The list of exceptions (for example a table that must scroll) is empty at launch; not specified.
  - XCT-14.1: The glossary has 20 to 30 terms tested with users (06 process 4.3); the term list is not in the story.
  - XCT-14.2: Criterion 3 says the build fails if a key is missing in English and French while XCT-01 says a missing Malagasy key is a release blocker for P0 screens only; the status of a missing Malagasy key on a non-P0 screen is "report only". Confirmed by the story; not an ambiguity but recorded.
  - XCT-14.3: No i18n library is installed yet; the choice must support ICU plurals, lazy loading and a missing-key hook (open question closed on the format, library not chosen).
  - XCT-14.4: The native reviewer approving the Malagasy column is a launch dependency (open, B12).
