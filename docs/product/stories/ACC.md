# ACC: Account, identity and account safety

Epic code ACC, release MVP. Follows [00-conventions.md](../00-conventions.md) (story format, actors, permission names, statuses). Journey steps covered: 1 Discover and join, 2 Verify, 8 Report and support (safety).

## Sources used in the Conversation sections

| Short name | File |
| --- | --- |
| 03 mobile money | [03-madagascar-mobile-money.md](../../research/raw/03-madagascar-mobile-money.md) |
| 06 process | [06-design-process.md](../../research/raw/06-design-process.md) |
| 07 UI/UX | [07-ui-ux-best-practices.md](../../research/raw/07-ui-ux-best-practices.md) |
| 08 competitor UX | [08-competitor-ux-comparison.md](../../research/raw/08-competitor-ux-comparison.md) |
| competitive analysis | [competitive-analysis.md](../../research/competitive-analysis.md) |
| design foundations | [design-foundations.md](../../research/design-foundations.md) |

Evidence labels in the raw reports: [V] verified, [S] secondary, [U] unverified or a working assumption. A rule marked [U] below is a hypothesis to test in the field, not a fact.

## Conventions used in this file

- Message keys: UI `acc.<screen>.<element>`, errors `err.acc.<code>`. Notifications follow the NTF convention `msg.acc.<event>` with one variant per channel: `.push`, `.sms`, `.inapp` (for example `msg.acc.otp.sms`). All text exists in Malagasy, French and English. Stories never hard-code wording; the wording in quotes is an intent, not final copy.
- Permission names are written "Object: name" as in the conventions and GRP, for example "Group: invite member", "Wallet: export history". Operators use a separate catalogue owned by OPS-01, never member permissions. Decision D2 (see [05-decisions.md](../05-decisions.md)) added Wallet: freeze, Wallet: create, Group: view audit log, Group: set spending policy and Group: set notification settings; this epic uses none of them directly.
- Founder decisions D1 to D5 apply. In this epic they matter in four places: the requester never approves their own request (D1), so deleting an account or locking it must not leave a group with fewer than two holders of Wallet: approve spend (ACC-11, ACC-15, GRP-14); a passed vote authorises a payout and money in any wallet is income, including money from a rule (D3, D4: ACC-14 export, ACC-15 rules, ACC-16 guest ballots); and the rounding amount credited to Gereo is disclosed in the terms (D5, ACC-13).
- Words for protection, kept apart everywhere: PIN lock-out (too many wrong PINs, ACC-03), app lock (idle timeout on one device, ACC-12), account lock (emergency, all devices, ACC-11) and wallet freeze (a group stops outgoing money, SPD-15). "Lock" alone is never used in a message key without one of these four.
- The word "tier" is a working term for the team. The person sees "Level 1, 2, 3" in English and "Niveau 1, 2, 3" in French; the Malagasy word is chosen with translators (open question 9).
- Configurable parameters are written in capitals, for example `OTP_EXPIRY_MINUTES`. Starting values come from the research and are marked as such. Values marked TBD are not decided and must not be guessed in code. No limit, fee or legal duration is fixed by this epic.
- Tier names: Tier 0 browse (no account), Tier 1 phone, OTP and PIN, Tier 2 ID plus selfie, Tier 3 extra proof for the highest limits. The tier model is a working hypothesis (07 UI/UX section 5.3, R-K1). The limits per tier are configured in OPS-11 and are TBD.
- "Phone number" always means a Madagascar mobile number stored in international format and shown in the grouped national format.
- Every account-safety event listed in the acceptance criteria writes an Audit entry (who, what, when, device, result). Audit entries are immutable.
- Nothing in this epic writes a ledger entry unless stated. ACC-15 is the one story that touches the ledger rules.

## Configurable parameters

| Parameter | Starting value | Source or status |
| --- | --- | --- |
| `OTP_LENGTH` | 6 digits | 07 UI/UX 5.1, NIST minimum [V] |
| `OTP_EXPIRY_MINUTES` | 5 (hard maximum 10) | 07 UI/UX 5.1: NIST 10 max, MDN 5 preferred [V] |
| `OTP_RESEND_COUNTDOWN_SECONDS` | 30, then 60, then 120 | 07 UI/UX 5.1 R-OTP2 [S]; test against real SMS latency |
| `OTP_MAX_SENDS_PER_HOUR` | 5, per number and per device | decided: three resends at 30, 60, 120 seconds fit inside it; tune after the pilot |
| `OTP_MAX_WRONG_ATTEMPTS`, `OTP_LOCK_MINUTES` | 5 attempts, 15 minutes | decided: a six-digit code with 5 tries is a 1 in 200 000 guess; NIST allows far more tries, so this is strict enough |
| `PIN_LENGTH` | 4 to 6 digits, chosen by the person; 4 is accepted | 07 UI/UX 2.7 R-A2 [U]; the mobile money apps compared use a 4-digit PIN [V] (08 competitor UX); the lock-out, weak-PIN list, cooling period and tier limits carry the protection |
| `PIN_MAX_WRONG_ATTEMPTS`, `PIN_LOCK_MINUTES` | 5 attempts, 15 minutes | decided, same reasoning; used by WAL-10 for money-out |
| `SESSION_IDLE_LOCK_MINUTES` | 5 | decided: shared phones are a named threat (06 process 4.1); the PIN or fingerprint brings the person back in two taps |
| `SESSION_MAX_DAYS` | 30 | decided: a monthly code and PIN sign-in on a known device |
| `NEW_DEVICE_COOLING_HOURS` | 24 (0 means no cooling period) | decided as the default: limits on money-out after a new device or PIN reset (03 mobile money 7.1 point 8 says re-verify on a new device or SIM); to be tuned with fraud data |
| `NEW_DEVICE_MONEY_OUT_LIMIT` | TBD, per tier | owned by OPS-11; the largest money-out allowed to a payee already used, while a device is marked `new` |
| `NEW_DEVICE_FLAG_COUNT`, `NEW_DEVICE_FLAG_WINDOW_HOURS` | 3 failed new-device attempts in 24 hours | decided: raises a fraud flag (OPS-10) |
| `KYC_MAX_ATTEMPTS` | 3 | decided: after this the case goes to a human (OPS-03) |
| `KYC_AUTO_MATCH_ENABLED` | off | decided: in the MVP an operator compares every selfie (ACC-04, ACC-05); automatic matching waits for a tested vendor |
| `KYC_MIN_AGE` | 18 [U] | working assumption, to be confirmed with counsel (open question 2) |
| `ASSIST_MAX_SESSIONS_PER_DAY` | 3 per facilitator | decided: stops bulk account creation (ACC-10) |
| `ASSIST_ABANDON_MINUTES` | 30 | decided: an unfinished assisted session closes (ACC-10) |
| `DELETE_GRACE_DAYS` | 30 | decided: long enough to change one's mind, short enough to honour a deletion request; legal retention is separate (open question 1) |
| `EXPORT_COOLDOWN_HOURS` | 24 | decided |
| `EXPORT_READY_DAYS` | 7 | decided: how long a prepared export stays downloadable (ACC-14) |
| `grp.invite_link_ttl` | 7 days | owned by GRP-03, displayed in ACC-16; vote links stay valid until the vote closes (VOT-06) |
| `RECORD_RETENTION_YEARS` | 5 for identity and transaction records | Law 2016-056 Art. 53 as read in 03 mobile money 5.1; whether it binds Gereo depends on the operating model (open question 1) |

## Statuses used in this file

Transaction statuses are the shared ones: Initiated, Pending, Confirmed, Failed, Cancelled, plus Needs attention in the interface (00-conventions section 2). The statuses below belong to this epic and are the only ones its stories use.

| Object | Statuses |
| --- | --- |
| Account | Pending PIN (code verified, PIN not set), Active, Locked (ACC-11), Deleting (grace period, ACC-15), Deleted |
| Identity check | Pending, Approved, Rejected. A request to retake some photos is a Rejected result with the failed items marked (OPS-03 "Ask for retake"); it counts as an attempt |
| Device | Registered, Marked `new` (inside the cooling period), Signed out |
| Export | Preparing, Ready, Expired, Failed |
| Assisted session | Open, Done, Cancelled |

---

## Stories

### ACC-01 Choose my language and look around before I register

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor
**Permission needed:** none
**Tags:** offline

**Story:** As a visitor, I want to pick Malagasy, French or English and see what Gereo does with an example group before I give my phone number, so that I can decide whether to trust it.

**Conversation:** CGAP principle 1 says to let people explore before registering (07 UI/UX section 5.3; 08 competitor UX section 6.1). Money Fellows loses people by gating early. No competitor ships a Malagasy interface (08 competitor UX section 6.14), so the language choice is the first screen and not a setting. The example group is fixed content with invented names and amounts, never real data. We did not decide whether a short audio hint is in the MVP (design foundations section 6, question 5). Text-only screens fail first-time low-literacy users (design foundations section 1, point 2), so every example screen uses icons with visible labels.

**Preconditions:** The app or the web page is opened for the first time, or after sign-out on a device with no saved language.
**Trigger:** Visitor opens Gereo with no account and no invite link. (Invite and vote links are ACC-16.)

**Acceptance criteria:**
1. Happy path. The first screen shows three language buttons written in their own language (`Malagasy`, `Francais`, `English`), same size, in this order, each at least 48 by 48 dp. One tap sets the language and opens the welcome screen. No other screen comes first.
2. Happy path. The welcome screen has two actions with visible labels, `acc.welcome.create_account` and `acc.welcome.sign_in`, and a third, `acc.welcome.look_around`. Look around opens the example group.
3. Business rule. The example group is read-only and clearly labelled `acc.demo.example_badge` on every screen. It shows a group balance, a ledger with 5 to 8 entries, one open vote and one contribution status board, all with invented people. No real user data is ever mixed in.
4. Business rule. Any button in the example that would change something (pay, vote, invite) opens a one-screen prompt `acc.demo.needs_account` with `Create account` and `Not now`. It never moves money and never fails silently.
5. State, offline. The language screen, welcome screen and example group are bundled with the app shell and work with no connection. No network call is made until the person taps `Create account` or `Sign in`.
6. State, loading. No skeleton, spinner or "No data" text is shown for the example group (the content is local).
7. Accessibility and language. If the device language is Malagasy, French or English, that button is highlighted but still needs a tap. The `lang` attribute is set on each button and on the page after the choice. The language list is reachable again from the welcome screen (`acc.welcome.change_language`).
8. Accessibility and language. No text is embedded in images. At 200% font size the three buttons stack and every label stays fully visible (XCT-08).
9. Notifications. None. Audit. No account exists, so nothing is written to the Audit log. The chosen language is stored only on the device until ACC-02 completes, then copied to the profile.
10. Privacy. No tracking identifier tied to a person is created before the person starts ACC-02 and gives consent (ACC-13).

**Data:** Device language setting (local). Example content (static).
**Depends on:** none. Reused by XCT-01.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no audio hint in the MVP (design foundations section 6, question 5); icons with visible labels carry the screens, and audio is revisited after the first field interviews. Still open, needs field research: does the example group show amounts in a realistic range for Madagascar? Default used: round ariary amounts of the size of a monthly contribution of a small savings group, always labelled as an example, replaced after interviews with the founding group.

---

### ACC-02 Sign up with my phone number and a code by SMS

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor
**Permission needed:** none
**Tags:** sms, audit

**Story:** As a visitor, I want to enter my phone number and type, paste or auto-fill a code I receive by SMS, so that I can create an account without a password or an agent.

**Conversation:** Phone, OTP and PIN with no password is the decided sign-up (competitive analysis section 7; 07 UI/UX 5.2 R-FM5). The OTP rules come straight from 07 UI/UX section 5.1 (R-OTP1 to R-OTP5): one input, autofill, paste allowed (WCAG 3.3.8 forbids blocking paste), six digits, short expiry, resend countdown 30, 60, 120 seconds, a server-side cap on sends. Phone numbers are typed in many ways, so we normalise (R-E1). We did not choose a voice-call fallback; it is an open question. Orange Money reviewers complain that OTP never arrives with no alternative (08 competitor UX section 6.1), so every failure path ends in a next action.

**Preconditions:** Language chosen (ACC-01) or arriving from a link (ACC-16). Device has a connection.
**Trigger:** Visitor taps `acc.welcome.create_account` or `acc.welcome.sign_in`.

**Acceptance criteria:**
1. Happy path. The phone screen has one visible label and one field with a numeric keypad. It accepts `034 12 345 67`, `0341234567`, `+261 34 12 345 67` and numbers with dashes, and shows the normalised number back (`acc.phone.confirm_number`) before sending. Valid input enables `acc.phone.send_code`. The first time, tapping it opens the consent summary of ACC-13 and sends nothing until `acc.consent.agree`.
2. Happy path. After sending, the code screen shows `Code sent to 034 12 345 67. Wrong number? Change`. One numeric input with `autocomplete="one-time-code"`, `OTP_LENGTH` digits shown as segments, not separate fields. Paste is accepted and spaces or dashes in the pasted text are ignored. The form submits itself on the last digit.
3. Happy path. A correct code creates the account in status Pending PIN at Tier 1 and opens ACC-03. If the app is closed before the PIN is set, the next launch resumes at the PIN screen and nothing else is reachable.
4. Business rule. A code is valid for `OTP_EXPIRY_MINUTES`. Requesting a new code invalidates the previous one. A used code cannot be used again.
5. Business rule, rate limit. The resend button is disabled with a visible countdown (30, then 60, then 120 seconds). After the third send, `acc.otp.get_help` appears (opens a support request that works without an account, OPS-06). Sends are capped per number and per device at `OTP_MAX_SENDS_PER_HOUR`; over the cap the person sees `err.acc.too_many_codes` with the time when they can try again, and no SMS is sent.
6. Errors, wrong code. `err.acc.otp_wrong` says the code does not match and to check the latest message; the typed digits are cleared, the phone number stays. After `OTP_MAX_WRONG_ATTEMPTS` the code screen locks for `OTP_LOCK_MINUTES` with a countdown and `acc.otp.get_help`. No money is involved and the message says nothing about whether an account exists.
7. Errors, expired and wrong number. `err.acc.otp_expired` offers `Send a new code` as the primary button. `err.acc.phone_unrecognised` appears for a number that is not a Madagascar mobile number, without blame words, keeping what was typed.
8. State, offline and missing SMS. With no connection the send button is disabled with `acc.offline.cannot_send_code`, and the typed number is kept. Under the code field, `acc.otp.not_arrived` says to check the signal and that codes can take up to a minute.
9. Notifications, SMS. `msg.acc.otp.sms` is GSM-7 safe, at most 160 characters, contains the code, its validity in minutes and the sentence that Gereo never asks for the code or PIN, and ends with the line `@{APP_DOMAIN} #{code}` so autofill works (XCT-12). It is sent in the language chosen in ACC-01.
10. Ledger and audit. No ledger entry. Audit entries for code requested, code verified, code failed and OTP lock started, each with a hash of the number, device ID and time. Accessibility: the code field announces remaining time and errors through a status region without moving focus.

**Data:** User, Device, Notification, Audit entry, Consent record (read, ACC-13).
**Depends on:** ACC-01 (or ACC-16), ACC-13, NTF-07 (SMS fit in one message), NTF-11 (people without the app), XCT-12, OPS-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no voice-call fallback in the MVP. Reason: no research file shows a working voice-OTP route in Madagascar and it adds a second provider and cost; the fallback is the support request after the third send (criterion 5) and the Orange Money complaint (08 competitor UX 6.1) is answered by the countdown, the help route and the "up to a minute" note. Revisit if the pilot shows SMS delivery below the target in OPS-12. Closed: a recycled SIM number is treated as the same person, because the number is the identity. The new holder still needs the PIN, and a PIN reset by that holder starts the cooling period (ACC-04) and, at Tier 2 and above, needs the selfie; a real change of hands goes through the support route of ACC-06. Residual risk accepted for Tier 1 accounts with a small balance. Still open, needs the SMS aggregator: which sender name is used and whether it is allowed for OTP traffic. Default used: alphanumeric sender `Gereo`, falling back to a numeric sender if the operators refuse it (NTF owns the choice).

---

### ACC-03 Set my PIN and choose biometric unlock

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** audit

**Story:** As a new user, I want to set a PIN I can remember and optionally unlock the app with my fingerprint, so that nobody who picks up my phone can open it or spend my money.

**Conversation:** The PIN is required on every money-out and the biometric is an option, never a requirement, because many low-end phones have no sensor or no enrolled finger (07 UI/UX 2.7 R-A1, R-A2). A PIN the user must remember is a cognitive test under WCAG 3.3.8, so the optional biometric also serves accessibility. In a study of low-literate users, 32.5% shared their PIN (07 UI/UX 2.7, [S], small sample), so the screen says not to share it. "Gereo never asks for your PIN or code" goes on every PIN screen (R-S1). We decided no password exists at all.

**Preconditions:** Phone verified in ACC-02, PIN not yet set.
**Trigger:** Code accepted in ACC-02, or PIN change from the profile (ACC-06).

**Acceptance criteria:**
1. Happy path. The person enters a PIN of `PIN_LENGTH` digits on a large keypad, then repeats it. Matching PINs finish setup and open the home screen.
2. Business rule. The PIN is rejected with `err.acc.pin_too_easy` if it is all the same digit, an ascending or descending run, or matches the last digits of the phone number. The list of rejected patterns is configurable.
3. Business rule. The server keeps the PIN only as a salted slow hash; the PIN is never in the SMS, push, log or Audit entry. The device keeps a separate local verifier, used only to unlock the app offline (criterion 7), which is deleted on sign-out. Money-out and every PIN change are always checked by the server. The PIN is the same value for app unlock and for money-out authorisation.
4. Happy path, biometric. If the device has an enrolled biometric, a second screen offers `acc.biometric.enable` and `acc.biometric.skip`, equal weight. Skip leads to the home screen and the offer can be made again in the profile. If no biometric is available, the screen is not shown.
5. Business rule. Biometric unlocks the app and reading screens only. Every money-out, and every PIN change, still asks for the PIN on a screen that repeats the amount and recipient (see SPD and WAL for that screen). A biometric failure falls back to the PIN with no extra friction.
6. Errors. Mismatch: `err.acc.pin_mismatch` clears both fields and keeps the person on the screen. After `PIN_MAX_WRONG_ATTEMPTS` wrong entries at unlock the PIN entry locks for `PIN_LOCK_MINUTES` (a PIN lock-out, not an account lock) and the screen shows the time left and `Forgot my PIN` (ACC-04); never a dead end (07 UI/UX 2.7 R-A5).
7. State. Setup survives the app being killed: a half-finished setup restarts at the first PIN entry. Offline, PIN setup of a new account is blocked because the server holds the hash (`acc.offline.cannot_set_pin`); the app unlock PIN on an already registered device works offline against the local verifier, and wrong attempts are counted on the device and reported to the server at next contact.
8. Notifications. None at setup. A PIN change sends `msg.acc.pin_changed.push` to all other devices and `msg.acc.pin_changed.sms` to the number (GSM-7, under 160 characters).
9. Ledger and audit. No ledger entry. Audit entries for PIN created, PIN changed, biometric enabled or disabled, lock started, each with device and time (never the PIN).
10. Accessibility and language. The keypad has targets of at least 56 dp, announces digit count not digits to screen readers, supports paste for password managers, and shows `Gereo never asks for your PIN or code` in all three languages (XCT-09).

**Data:** User, Device, Audit entry.
**Depends on:** ACC-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a PIN of 4 digits is accepted and 6 is allowed (parameter table), because the compared mobile money apps use 4 digits [V] and the protection comes from the lock-out, the weak-PIN list, the cooling period and the tier limits. The security review may raise the minimum by changing `PIN_LENGTH`. Closed: the weak-PIN list is product configuration owned by the security reviewer; the starting list is the three patterns of criterion 2.

---

### ACC-04 Reset my PIN myself, without an agent

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** sms, audit

**Story:** When I forget my PIN or I think someone saw it, I want to reset it with my phone number and a code, so I can get back in without handing my PIN to an agent or waiting for support.

**Conversation:** The most common reason people call a mobile money call centre is PIN reset, and CGAP recommends self-service reset (07 UI/UX 2.7, R-A4). Telling an agent the PIN is the failure to avoid. For identity-verified users, reset should also check the selfie (R-A4: "OTP + selfie if tier requires"). How the selfie is checked (automatic face match or human review) is not decided; the story therefore routes to the operator queue (OPS-03) when the automatic check cannot decide. SIM-swap is the main attack on this flow (03 mobile money 7.1 point 8), so a reset starts the same cooling rules as a new device (ACC-05).

**Preconditions:** An account exists. The person can receive SMS on the registered number.
**Trigger:** Person taps `acc.pin.forgot` on the PIN screen or on the PIN lock-out screen.

**Acceptance criteria:**
1. Happy path, Tier 1. The person confirms the number, receives a code (same rules as ACC-02), enters it, sets a new PIN (ACC-03 rules) and is signed in on this device. Total screens: number, code, new PIN, repeat PIN.
2. Happy path, Tier 2 and above. After the code, the person takes a live selfie (capture rules from ACC-08). In the MVP every selfie goes to an operator who compares it with the stored reference selfie (OPS-03), so the person sees `acc.reset.in_review` with a reference ID and the expected time from `KYC_REVIEW_TARGET_HOURS` (OPS-02), and the case enters the KYC queue as type PIN reset. If an automatic face match is switched on later (configuration `KYC_AUTO_MATCH_ENABLED`, off in the MVP) and passes, the flow continues as in criterion 1; if it cannot decide it goes to the queue as above.
3. Business rule. Resetting a PIN signs out all other devices, cancels money-out requests in the Initiated state that were waiting for a PIN, and applies `NEW_DEVICE_COOLING_HOURS` limits on money-out and on a second PIN change (0 means none). The person is told the end time on the confirmation screen.
4. Business rule. A reset never changes the tier, the wallets or any ledger entry. Transactions already in Pending keep settling. Approvals and ballots already given stay as they are.
5. Errors. A wrong code, expiry and rate limits behave as in ACC-02. A failed selfie shows the specific reason (`err.acc.selfie_too_dark` and similar) and the retake tip. After `KYC_MAX_ATTEMPTS` the person sees `acc.reset.contact_support` with a pre-filled support request.
6. State, offline. Offline, the reset starts with `acc.offline.cannot_reset`; no data is lost; reading cached data stays available only for already unlocked sessions.
7. Notifications. `msg.acc.pin_changed.push` to every other device before they are signed out. `msg.acc.pin_changed.sms` to the number with the time and "If this was not you, contact support with reference {ref}". Both GSM-7 safe and under 160 characters.
8. Ledger and audit. No ledger entry. Audit entries for reset requested, code verified, selfie result, reset completed or abandoned, sessions revoked, each with device ID and time.
9. Accessibility and language. The lock-out and reset screens explain how long and how to recover in plain words; they carry `Gereo never asks for your PIN or code`. The reference ID is copyable.

**Data:** User, Device, Identity check, Audit entry, Support ticket (when escalated).
**Depends on:** ACC-02, ACC-03, ACC-08, ACC-05, OPS-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a Tier 1 reset needs no extra check beyond the code, because there is no identity to compare against; the protection is the cooling period, the sign-out of other devices, the SMS to the number and the small Tier 1 money-out limits (OPS-11). Closed for the MVP: the selfie check is by an operator, not by software. Still open, needs a vendor and field testing: the automatic face-match provider and its accuracy in Madagascar conditions (lighting, phone cameras). Default used: manual review for every Tier 2 reset, `KYC_AUTO_MATCH_ENABLED` off.

---

### ACC-05 Sign in on a new phone, or after changing my SIM, and keep my account safe

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** sms, audit, legal-gate

**Story:** When I sign in from a phone Gereo does not know, or my old phone is lost, I want to prove it is me with a code and, if my account is verified, a selfie, so I can recover my account without an agent while a thief cannot do the same.

**Conversation:** Device recovery without an agent is a launch rule (design foundations section 4; 07 UI/UX section 10, item 18). SIM-swap and social engineering around OTP are the dominant fraud pattern across mobile money markets, and operator terms put the loss on the customer (03 mobile money 6.7 point 4; 03 section 7.3). The research says to re-verify on a new device or SIM (03 section 7.1 point 8). We have no operator SIM-swap signal; the only signal is "this device is new". Whether a cooling period applies is a business and legal decision (open question). Tag legal-gate because the cooling limits restrict money-out.

**Preconditions:** An account exists. The signing-in device has no valid registration.
**Trigger:** The person enters a registered phone number on a device that is not in their connected devices list.

**Acceptance criteria:**
1. Happy path. The person receives a code (ACC-02 rules), enters it, then enters the PIN (or does ACC-04 if forgotten). The device is registered and the home screen opens. The old phone is not needed.
2. Business rule. For Tier 2 and above, a live selfie is also required before the device is registered (same operator review as ACC-04, criterion 2; case type device recovery in OPS-02). Tier 1 needs code and PIN.
3. Business rule. A newly registered device is marked `new` for `NEW_DEVICE_COOLING_HOURS` (0 means none). While marked `new`, the first money-out to a payee, any money-out above `NEW_DEVICE_MONEY_OUT_LIMIT`, and any PIN change are blocked or require extra confirmation (the pause screen of WAL-10), and the screen says exactly when each unlocks. Approving someone else's expense request counts as a money-out for this rule (SPD-05). Browsing, voting and money-in are not blocked.
4. Business rule. The first sign-in on a new device shows `acc.newdevice.warning`: "Did someone ask you to do this? Gereo never asks for your PIN or code." Cancel is the visually primary button.
5. Notifications. Every other registered device receives `msg.acc.new_device.push` with the device name and time and a button `This was not me` that opens the emergency lock (ACC-11). The number receives `msg.acc.new_device.sms` (GSM-7, under 160 characters, with a reference ID and the support route).
6. Errors. If the selfie or the code fails, the device is not registered and the account is untouched. `NEW_DEVICE_FLAG_COUNT` failures from new devices on one account within `NEW_DEVICE_FLAG_WINDOW_HOURS` raise a fraud flag (OPS-10) and show the person `acc.newdevice.contact_support`. The message never reveals whether the number has an account before the code is verified.
7. State. If the person has no old device, the flow is the same and complete. If the SIM is stolen, the thief still needs the PIN, and for Tier 2 the face; ACC-11 explains how the real owner locks the account from another phone.
8. Ledger and audit. No ledger entry. Audit entries for device registered, selfie result, cooling period started and ended, `This was not me` pressed, with device model, time and result.
9. Accessibility and language. The device name shown in notifications is plain text (model name), never a code. All warnings are text plus icon; the SMS is in the user's profile language.
10. Offline. This flow needs a connection; offline shows `acc.offline.cannot_sign_in_new_device` and the keypad stays usable for known-device PIN unlock.

**Data:** User, Device, Identity check, Notification, Audit entry.
**Depends on:** ACC-02, ACC-03, ACC-04, ACC-08, ACC-11, OPS-03, OPS-10, OPS-11, WAL-10, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: cooling hours apply, default 24 (parameter table), to be tuned with fraud data; the limit amounts come from OPS-11. Closed: no secondary contact (second number or email) in the MVP, because it is a second recovery path and so a second way to take over an account; a person who lost both phone and number uses the support route of ACC-06. Still open, needs the mobile operators and the aggregator: is there an API to detect a recent SIM swap? Default used: no signal, "this device is new" is the only signal. Still open, needs counsel (legal-gate): whether holding back a customer's own money-out for 24 hours after a new device is allowed. Default used: 24 hours limit as written, limited to first-time payees and amounts above `NEW_DEVICE_MONEY_OUT_LIMIT`, never a block on money-in.

---

### ACC-06 Keep my profile up to date: name, language and preferred currency

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none

**Story:** As a user, I want to set my display name, my language and my preferred currency, so that the app and the messages I receive match how I speak and what I use.

**Conversation:** The User object carries identity, phone, language and preferred currency (info.md, object model). Members of one group can prefer different languages, so language is personal and never forced by a group (07 UI/UX 6.4 R-L13). Currency starts with the ariary only; the architecture is multi-currency but the MVP offers one value (info.md non-functional requirements). The legal name comes from the ID check and is not editable here; the display name is what other members see. We decided members see the display name and a masked phone number (07 UI/UX 2.8 R-S4).

**Preconditions:** Signed in at Tier 1 or above.
**Trigger:** Person opens the profile.

**Acceptance criteria:**
1. Happy path. The profile shows display name, phone number (masked by default, shown after PIN), language, preferred currency, tier and verification status. Display name edit saves with one tap and appears in groups within one sync.
2. Business rule. Display name is 2 to 40 characters (configurable), letters, digits, spaces, apostrophe and hyphen. Names that imitate Gereo staff or reserved words (`Gereo`, `Support`) are rejected with `err.acc.name_reserved`.
3. Business rule. Once the ID check is approved (ACC-09), the verified legal name is shown read-only under the display name with `acc.profile.verified_name`. A change of legal name goes through a support request, not an edit.
4. Business rule. Language options are Malagasy, French, English. Changing it applies immediately to the app, to push and to SMS messages sent afterwards (XCT-01). It does not change a group's default language.
5. Business rule. Preferred currency offers only `MGA` (ariary) in the MVP; the control is shown disabled with `acc.profile.more_currencies_later` so the object model is ready. Amount formatting does not change with currency (XCT-02).
6. Business rule. Changing the phone number is not in this story. The profile tells the person to open a support request for a number change (`acc.profile.change_number_help`), which creates a ticket (OPS-06). The rule for that ticket is in the open question below.
7. State. Offline: the profile can be read from cache with a last-synced time; edits are blocked with a reason, because a profile edit is not queued (see XCT-05).
8. Errors. A save that fails shows what was kept (`err.acc.save_failed`) and keeps the typed values. No money is involved.
9. Notifications. None. Audit: entries for each changed field with old and new value, except phone number digits which are stored masked.
10. Accessibility and language. Visible labels above every field; no placeholder-only text; every control at least 48 dp.

**Data:** User, Audit entry.
**Depends on:** ACC-02, XCT-01, XCT-14, OPS-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a number change is possible only through a support ticket (OPS-06) and only for a person at Tier 2 or above, whose new selfie is compared by an operator with the reference selfie (ACC-04 rules). A Tier 1 person has no identity to prove, so the way forward is a new account, and if the old one still holds money the person first verifies to Tier 2 so it can be withdrawn. The change starts the cooling period of ACC-05, signs out all devices, and both the old and the new number receive `msg.acc.phone_changed` (NTF event EV-ACC-04). Reserved display names are a configurable list that starts with `Gereo`, `Support` and `Admin`.

---

### ACC-07 See what I can do now and what unlocks next (tier ladder)

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** legal-gate

**Story:** As a user, I want to see a clear ladder of what I can do at my current level and what verifying my identity would unlock, in ariary, so that I know why Gereo asks for my ID and I am asked only when it matters.

**Conversation:** Verification friction is the top complaint class at Money Fellows, and Gereo's answer is tiered KYC asked at the moment a limit is hit, not at sign-up (competitive analysis sections 4 and 7; 07 UI/UX 5.3 R-K1, R-K2; 08 competitor UX 6.1). Browsing, joining and voting need only phone and OTP; money-in and money-out need a verified identity at the right tier (00-conventions section 2). The limits themselves are not known: the CSBF instructions on KYC tiers and caps were not found (03 mobile money 5.1), the 100 000 000 Ar ceiling from the brief is unexplained (competitive analysis section 9) and an individual operator wallet caps at 20 000 000 Ar (competitive analysis section 2). So every number on this screen comes from OPS-11. Tag legal-gate.

**Preconditions:** Signed in.
**Trigger:** Person opens `acc.tiers.ladder` from the profile or from a limit prompt.

**Acceptance criteria:**
1. Happy path. The ladder shows one step per level that exists in the OPS-11 configuration (Level 1 and Level 2 at launch, Level 3 once configured). The current step is marked with icon plus word `acc.tiers.current` (not colour alone). Each step lists in plain verbs what the person can do and the limits in `12 500 Ar` format, read from the active configuration (OPS-11). No limit is hard-coded.
2. Happy path. Under the current step, `acc.tiers.unlocks_next` lists what the next step adds and a button `acc.tiers.verify_now` opens ACC-08.
3. Business rule. A person at Tier 1 can browse, join groups and vote but cannot deposit or withdraw above the Tier 1 limits (the limits may be zero for money-out; value TBD). The screen states this in one sentence per action.
4. Business rule, just in time. When a person starts a deposit, contribution or money-out that exceeds the current tier's limit, the flow stops before PIN entry and shows `acc.tiers.limit_hit` with the specific benefit ("To send more than {limit}, verify your ID. It takes about {minutes} minutes") and `Verify now` and `Not now`. No money has moved. The amount and the form values are kept for after verification.
5. Business rule. Group-specific checks (extra verification for people who hold Wallet: approve spend, from competitive analysis section 6 point 8) appear as their own line on the ladder when a group requires it, with the group name. Decision: a person needs the tier that allows money-out to approve a spend request, because the approval authorises a payout (SPD-05); voting needs only Tier 1 (00-conventions section 2). SPD owns the check and shows the message `acc.tiers.limit_hit` through this story.
6. State. If verification is pending (ACC-09), the current and next steps stay as they are, and a banner `acc.tiers.review_pending` shows the reference ID and what still works.
7. State, offline. The ladder is readable offline from cache with the last-synced time; `Verify now` is disabled offline with a reason except for capturing photos (ACC-08).
8. Errors. If the configuration cannot be loaded, the ladder shows the last cached limits with `Updated {time}` and never an empty or zero limit.
9. Ledger and audit. No ledger entry. Audit: tier changes (up or down) are written by ACC-09 and OPS-11; this screen writes nothing.
10. Accessibility and language. Limits are numbers with `Ar`, spaced and non-wrapping (XCT-02). The ladder is a list in reading order, not an image. The screen says "Level" (English) and "Niveau" (French), never "tier"; the Malagasy word comes from the glossary (XCT-14).

**Data:** User, Identity check, Tier configuration.
**Depends on:** ACC-02, OPS-11. Used by WAL-06, WAL-09 and WAL-13 (deposit, withdrawal and transfer limits), CON-04 (contribution limits) and SPD-05 (approval checks).
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the UI word is "Level" and "Niveau"; the Malagasy word is proposed by translators and tested (open question 9). Still open, needs the regulator (CSBF), Vanilla Pay and counsel: the tier limits, what Tier 3 requires (address, proof of income, other), and whether the 100 000 000 Ar ceiling is per transaction, per day or per account. Default used: the ladder shows only the levels that exist in the OPS-11 configuration; at launch that is Level 1 and Level 2, Level 3 stays hidden until its requirements are confirmed, and every limit is read from OPS-11, never from this file.

---

### ACC-08 Photograph my ID and take a selfie

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** legal-gate, offline, audit

**Story:** As a user who reached a limit, I want to take a photo of my identity document and a selfie with clear guidance on my phone, so that I can finish verification in one sitting, even with a weak connection.

**Conversation:** ID and selfie capture is where most drop-off happens, though the figures are vendor claims and not Madagascar data (07 UI/UX 5.3). The design rules are R-K3 and R-K4: a guide frame, a blur and glare check on the device, a preview with Retake, one illustration per step, resumable background upload, steps shown as "Step 2 of 4" (R-K7). Orange Money lets people self-onboard with an ID photo and selfie (03 mobile money 5.2). Accepted documents (national ID card CIN, passport, others) depend on the regulator and are an open question; the story names them as configurable. This is the only place photos are taken, and the only reason to ask for camera permission. Tag legal-gate because identity records and their retention come from Law 2016-056 Art. 53.

**Preconditions:** Signed in; the person tapped `Verify now` or was routed here from ACC-04 or ACC-05. Consent for identity processing is recorded (ACC-13).
**Trigger:** Person opens the verification flow.

**Acceptance criteria:**
1. Happy path. The flow has these steps with titles and "Step n of N": 1 why we ask (one sentence per item, with `Gereo never asks for your PIN or code`), 2 type and number of the document, 3 photo of the document front (and back if the type needs it), 4 selfie, 5 review and send. N is 5.
2. Business rule. Document types come from a configurable list (starting with the national ID card CIN and the passport; others per regulator). The number is typed once and not asked again in the same process (WCAG 3.3.7). Anyone under the legal age is told in plain words that they cannot continue (`err.acc.kyc_underage`); the minimum age is `KYC_MIN_AGE`.
3. Happy path. The camera screen shows a guide frame and one illustration. The device checks blur, glare and darkness; if the picture fails, it shows the specific tip (`err.acc.photo_too_dark` "Move near a window") before the person can submit. A preview with `Retake` and `Use this photo` always appears.
4. Business rule. Photos are taken in the app camera, never picked from the gallery, so that a screenshot or an edited photo cannot be sent. Each photo is compressed to a configurable size so a capture costs a bounded amount of data (XCT-07).
5. State, offline and resume. Photos are saved on the phone as soon as they are taken and uploaded in the background with a progress bar and `Saved on this phone` / `Waiting to send` / `Sent` states (XCT-05). If the app is killed or the connection drops, the flow resumes at the last step with the photos kept. Offline, the person can still capture; sending waits.
6. State, loading. An upload longer than 10 seconds shows a percentage and an interrupt button; below that, a spinner in the button only. The person is never left on a blank screen.
7. Business rule. The flow cannot be submitted twice for the same attempt: a repeated send reuses the same attempt ID. A person with a pending case cannot start another (they see ACC-09).
8. Errors. Permission to use the camera denied: `err.acc.camera_denied` explains why it is needed and how to allow it in three plain steps, and offers assisted onboarding (ACC-10). A phone with no usable camera ends at the same screen with the support route (OPS-06). Upload fails after retries with exponential backoff: `err.acc.upload_failed` says the photos are kept and nothing is lost, with `Try again`.
9. Notifications, ledger and audit. On send, `msg.acc.kyc_submitted.push` and `msg.acc.kyc_submitted.sms` carry the reference ID and expected time. No ledger entry. An Identity check is created with status Pending. Audit entries for capture started, each photo sent, case submitted, with device and time. Images are stored encrypted and are visible only to operators with the review permission (OPS-01, OPS-03).
10. Accessibility and language. Instructions use an illustration plus a short sentence in the user's language; no audio hint in the MVP (closed, see ACC-01). Capture buttons are at least 56 dp. The glare and framing tips are text announced by the screen reader; live spoken framing guidance is not in the MVP, and a person who cannot frame the photos is offered assisted onboarding (ACC-10).

**Data:** Identity check, User, Device, Notification, Audit entry.
**Depends on:** ACC-07, ACC-13, XCT-05, XCT-07, OPS-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: gallery uploads are not allowed (criterion 4). Closed: no live voice guidance in the MVP (criterion 10). Closed for the MVP: an operator compares the selfie with the document photo (OPS-03); liveness is the live capture in the app camera, with software liveness and automatic matching waiting for a tested vendor (ACC-04). Still open, needs the regulator and counsel: which documents are accepted and which are mandatory. Default used: CIN and passport. Still open, needs counsel and the hosting choice: how long images are kept and where they are stored (Art. 53 asks five years for identity records, applicability unconfirmed). Default used: images are encrypted, kept `RECORD_RETENTION_YEARS` after the account closes, and never shown outside OPS-03.

---

### ACC-09 Follow my verification: pending, approved, or rejected with a reason and a retry

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** legal-gate, sms, audit

**Story:** As a user who sent my ID, I want to see where my verification stands and, if it is rejected, exactly why and what to do, so that I can fix it without calling anyone.

**Conversation:** Money Fellows reviewers complain of an ID photo that "keeps being rejected" with no reason, and of requests that stay "still open" with no wait time (08 competitor UX 6.1). The rule is: pending review is a real screen with an expected wait and what still works; rejection reasons are specific, actionable and never accusing (07 UI/UX 5.3 R-K4, R-K5). The review itself is in OPS-02 and OPS-03. The expected-time sentence must match what operators can deliver (`KYC_REVIEW_TARGET_HOURS` in OPS-02), so it is configuration and not copy. Tag legal-gate: the status controls whether money can move.

**Preconditions:** An Identity check exists (ACC-08).
**Trigger:** Person opens `acc.kyc.status` from the profile, a banner or a notification.

**Acceptance criteria:**
1. Happy path, pending. The screen shows the status word `acc.kyc.pending` with an icon, the date and time sent, the reference ID (copyable) and the expected time built from the operator target. It lists what still works (browse, join, vote, and money within the current tier) and what waits.
2. Happy path, approved. The screen shows `acc.kyc.approved`, the new tier and the new limits (read from OPS-11). The tier changes only when the operator approves; the limits apply from that moment to the next action. If the operator approved a lower tier than requested (OPS-03), the screen says so with a fixed reason from the list and the button `acc.kyc.verify_more` to continue toward the requested level.
3. Happy path, rejected. The screen shows `acc.kyc.rejected` with one or more reasons from a fixed list, each with user-facing text and a tip in the user's language (for example photo too dark, document expired, name does not match, face not clear). Free-text from operators is never shown. A `Try again` button reopens ACC-08 with the failed items marked and the passed items kept (no re-asking, WCAG 3.3.7).
4. Business rule. After `KYC_MAX_ATTEMPTS` rejections the retry button is replaced by `acc.kyc.contact_support`, which opens a support request with the case reference (OPS-06). No account is closed automatically.
5. Business rule. A rejection never reduces the current tier and never locks money already in the wallet; withdrawals within the existing tier keep working. A later approval by correction changes the tier immediately.
6. State. Loading shows the last known status from cache with `Updated {time}`; the status is never shown as empty. Offline: the last known status and reference ID are readable; `Try again` works for capture only.
7. Notifications. Push `msg.acc.kyc_approved.push`, `msg.acc.kyc_action_needed.push`; SMS `msg.acc.kyc_approved.sms` and `msg.acc.kyc_action_needed.sms` with the reference ID and a short reason code, GSM-7 safe and under 160 characters. If the person has not opened the app after a configurable delay, the SMS is sent (NTF owns the delay).
8. Ledger and audit. No ledger entry. Audit entries for status changes (who, when, reason codes, tier before and after), written by the operator action in OPS-03.
9. Accessibility and language. Status chip uses icon, word and colour; reasons are one sentence each, tested in Malagasy and French; tips are not blame words (`Your document is invalid` is forbidden copy).
10. Errors. If a notification fails to send, the screen is still correct on the next open; the person never learns of a decision only by SMS.

**Data:** Identity check, User, Notification, Audit entry.
**Depends on:** ACC-08, OPS-02, OPS-03, OPS-11, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: an operator may approve a lower tier than requested, with a reason from the fixed list (criterion 2). Closed: the starting list of reasons is photo too dark, photo blurry, glare on the document, document expired, document type not accepted, document unreadable, name does not match, number does not match, face not clear, face does not match the document, under the minimum age; OPS-03 owns the list and each reason has a user-facing text and a tip in the three languages. Still open, needs translators and field testing: the wording of the reasons in Malagasy (open question 9). Default used: translators draft the three languages together and the Malagasy wording is tested with readers before launch; no language ships with unreviewed reasons.

---

### ACC-10 Be registered by a facilitator who helps me in person

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none for the person; the facilitator is a Member holding Group: invite member in at least one group (GRP-03)
**Tags:** legal-gate, audit

**Story:** As someone with no smartphone experience, I want a trusted person from my group to sit with me and help with sign-up and verification on their phone or mine, so that I can join without being stuck or giving my PIN to anyone.

**Conversation:** Human mediation is repeatedly shown to be critical for low-literate users (Medhi 2009: "integrate human mediators"; SARAL G12), and assisted KYC is recommended in 07 UI/UX 5.3 (R-K6). StokFella's "on behalf" capture and Wave's QR cards are comparators (08 competitor UX 6.1). The legal feasibility of registering someone on a facilitator's device is out of this research's scope (08 competitor UX 6.1), so the story is deliberately narrow: the facilitator helps; the person owns the phone number, the OTP and the PIN. The facilitator never sees the PIN and never receives the OTP. We did not decide whether a facilitator may submit documents for someone present.

**Preconditions:** Facilitator is signed in and holds Group: invite member in at least one group. The person to be registered is present, has a phone able to receive SMS and agrees.
**Trigger:** Facilitator taps `acc.assist.start` ("Help someone sign up").

**Acceptance criteria:**
1. Happy path. The assisted flow shows a banner `acc.assist.mode` ("You are helping {name}") on every screen. The person chooses language (ACC-01), types or says their number, receives the OTP on their own phone and types it themselves, then sets their PIN on a screen that hides the facilitator's own account (the keypad is handed over; digits are never displayed).
2. Business rule. The facilitator can see only progress ("Step 3 of 5, waiting for PIN") and the reference ID, never the OTP, PIN, selfie or ID images after upload. The facilitator may hold the camera while the person takes photos only if the person is in the frame and agrees (consent screen `acc.assist.consent`).
3. Business rule. The new account belongs to the person alone; the facilitator gains no permission on it. The facilitator's identity is recorded on the Consent record and on the Identity check (`assisted_by`).
4. Business rule. A facilitator can start at most `ASSIST_MAX_SESSIONS_PER_DAY` assisted sessions per day, so the feature is not used to create accounts in bulk. Over the limit the facilitator sees `err.acc.assist_limit` and the support route.
5. State, offline. Capture and PIN steps can start offline and resume; sending waits until a connection exists, with the states from XCT-05. Offline, the OTP step is blocked with a reason.
6. Errors. If the person refuses consent, or the session is abandoned for `ASSIST_ABANDON_MINUTES`, the session closes (status Cancelled), nothing is created beyond a phone number lacking verification, and the facilitator sees `acc.assist.cancelled`.
7. Notifications. The person receives the normal `msg.acc.otp.sms` and `msg.acc.kyc_submitted.sms`. The facilitator receives a push `msg.acc.assist_done.push` with the first name only.
8. Ledger and audit. No ledger entry. Audit entries on both the facilitator and the new person for session started, consent given, steps done, session closed, with device IDs and times. Operators can filter reviews by `assisted_by` (OPS-02).
9. Accessibility and language. The facilitator can switch the screen language for the person without changing their own profile language. `Gereo never asks for your PIN or code` is shown before PIN entry in the person's language.

**Data:** User, Identity check, Consent record, Audit entry.
**Depends on:** ACC-01, ACC-02, ACC-03, ACC-08, ACC-13, GRP-03 (Group: invite member), OPS-02.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: in the MVP the facilitator is a group member who holds Group: invite member; no trained-agent programme exists yet, and the limit of `ASSIST_MAX_SESSIONS_PER_DAY` bounds abuse. Closed: facilitators receive no fee or commission, because any payment to them is a business-model and legal decision that the MVP does not need. Still open, needs counsel and the regulator (legal-gate): whether assisted registration on the facilitator's device is allowed by the KYC rules. Default used: the person types their own code and PIN and the facilitator sees only progress (criteria 1 and 2); if counsel refuses a facilitator's device, the flow runs on the person's own phone with the facilitator beside them and the facilitator's account is not involved.

---

### ACC-11 See my connected devices and lock my account in an emergency

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** sms, audit

**Story:** When my phone is lost, stolen or I see something I do not recognise, I want to sign out other devices and lock my account immediately from any phone, so I can stop anyone spending my money before I sort it out.

**Conversation:** Connected-device lists with an emergency lock exist at Kuda and MVola (08 competitor UX 6.1). Mobile money fraud is mostly social engineering and SIM swap, and users blame the app when it happens (03 mobile money 7.3). A lock is a protective action; it does not seize or move funds. Because the person may have no second phone, the lock must be reachable from a freshly registered device with only a code, and ideally by SMS (open question). Whether Gereo can refuse money coming in while locked is a legal question; the story assumes incoming provider settlements still post to the ledger because Gereo cannot block a provider callback.

**Preconditions:** An account exists.
**Trigger:** Person opens `acc.devices.list` from the profile, taps `This was not me` in a notification (ACC-05), or follows the lock link on the sign-in screen.

**Acceptance criteria:**
1. Happy path, list. The list shows each device with model name, first and last seen date and time, approximate place if known, and a `This device` marker. Each row has `Sign out`. The list is available after PIN entry.
2. Happy path, sign out. `Sign out` ends that device's session on its next contact with the server and clears its cache the next time it opens (a remote wipe of cached data, kept in the MVP, see open questions).
3. Happy path, account lock. `acc.lock.lock_now` asks for the PIN (or, from an unknown device, a code to the phone) and then sets the account status to Locked. All sessions end, all queued items on any device are dropped on contact, and the confirmation shows the reference ID and how to unlock.
4. Business rule. While Locked: no sign-in, no money-out, no approval, no initiating of a spend, no ballot, no PIN change. Money-in already in progress continues to settle and posts to the wallet, including money that arrives from a rule or another wallet (decision D3); contributions due continue to be recorded as due but are not collected. Group permissions of the person stay as they are and nothing the person already started in a group is cancelled or voided by the lock (an expense request waits or expires under the SPD rules; an approval already given stays). The group is not told that the account is locked. A locked holder of Wallet: approve spend is still counted by GRP-14 as a holder; if that leaves the group unable to pay, the group uses the recovery path of GRP-14.
5. Business rule. Unlock needs the code to the registered number, the PIN, and for Tier 2 and above the selfie (ACC-05 rules), plus the same `NEW_DEVICE_COOLING_HOURS` limits as a new device. An operator can unlock after identity checks through a support request (OPS-06), recorded with operator ID.
6. Errors. If the person cannot sign in at all, `acc.lock.from_sign_in` offers a lock path that needs only the code to the registered number (not the PIN). This path can only lock; it can never unlock, and it reveals no data of the account. Unlocking always follows criterion 5, so a thief who holds the SIM can lock the owner out for a short time but never gain access.
7. State, offline. The device list is readable from cache with a last-synced time; lock needs a connection. Offline shows `acc.offline.cannot_lock` and the support contact.
8. Notifications. Push `msg.acc.locked.push` to remaining devices before they are cut off and `msg.acc.locked.sms` to the number (GSM-7, under 160 characters, with reference and support route). Unlock sends the same pair with the `unlocked` key.
9. Ledger and audit. No ledger entry on lock; none on unlock. Audit entries for device signed out, lock set, unlock requested, unlock done, operator involvement, each with actor, device, time and reason.
10. Accessibility and language. The lock button is the only action on its screen, labelled with text and icon; confirmation is a persistent screen, not a toast.

**Data:** User, Device, Notification, Audit entry, Support ticket (operator unlock).
**Depends on:** ACC-03, ACC-05, GRP-14, OPS-06, NTF-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: no lock by SMS keyword in the MVP, because a sender number can be spoofed, two-way SMS is unconfirmed (NTF aggregator question) and the code-only lock of criterion 6 already works without the PIN. Closed: groups are not told that a member is locked, because it exposes a lost phone and helps an attacker; the group sees only the effect through GRP-14. Still open, needs counsel (legal-gate): what the law requires of Gereo for incoming funds on a locked account. Default used: incoming settlements post to the wallet (criterion 4) because Gereo cannot block a provider callback.

---

### ACC-12 Sign out, and be signed out safely when I stop using the app

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** offline, audit

**Story:** As a user who shares a phone or leaves it around, I want to sign out when I choose and have the app lock itself after a while, so that other people cannot see my balances or spend my money.

**Conversation:** Shared phones and shoulder surfing are named threats (06 process 4.1; 07 UI/UX 2.2 R-M10 on hiding balances). Cached data helps offline reading but is the main privacy risk on a lost phone (07 UI/UX section 4, R-O6). Two levels exist: a lock (the PIN or biometric brings the person back, the cache stays) and a sign out (session ends and the cache is removed). The timings are configuration and not decided.

**Preconditions:** Signed in.
**Trigger:** Person taps `acc.session.sign_out`, or the app stays idle or in the background beyond a limit.

**Acceptance criteria:**
1. Happy path. `Sign out` asks one question (`acc.session.confirm_sign_out`), then ends the session, removes cached balances, ledger, tokens and photos from the device, and returns to the welcome screen with the language kept.
2. Business rule, lock. After `SESSION_IDLE_LOCK_MINUTES` without use, or when the app returns from the background after that time, the app shows the PIN or biometric screen (an app lock, not an account lock). Reading screens and money-out both need unlock. Data in the cache stays on the device.
3. Business rule, session end. After `SESSION_MAX_DAYS` the session expires and the person signs in again with the code and PIN (ACC-05 known-device path). Money-out always needs the PIN regardless of lock state (ACC-03).
4. Business rule. If items are queued and unsent (XCT-05), sign out warns `acc.session.unsent_items` with the count and offers `Send first` and `Sign out anyway`. Sign out anyway deletes them.
5. State, offline. Sign out works offline: it clears the device and marks the session to end on the server at next contact. The sign out button never fails.
6. Business rule, shared phones. Hiding balances with one tap is WAL-19 and is not repeated here. Notification previews respect a device setting `acc.session.hide_previews` (default on) so amounts are not shown on the phone's lock screen; NTF-04 shows the same setting and this story owns it.
7. Errors. If the server cannot end the session (no connection), the device is still cleared locally and the person sees `acc.session.signed_out_here` with a note that other devices are managed in the device list (ACC-11).
8. Notifications. None. Audit: sign out and session expiry events with device and time. App locks from idling are not audited, to avoid noise.
9. Ledger. None.
10. Accessibility and language. The idle warning gives at least 20 seconds notice for people who need more time (WCAG 2.2.1) with a button to extend; the lock screen announces itself to screen readers.

**Data:** User, Device, Audit entry.
**Depends on:** ACC-03, ACC-11, WAL-19, NTF-04, XCT-04, XCT-05.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: idle lock 5 minutes and session 30 days (parameter table). Closed: the remote cache wipe stays in the MVP (ACC-11 criterion 2), because a lost phone is the main privacy risk of cached data (07 UI/UX section 4, R-O6); the privacy review may remove it but cannot make it a blocker.

---

### ACC-13 Read and agree to the terms and privacy notice in my language

**Type:** User story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor
**Permission needed:** none
**Tags:** legal-gate, audit

**Story:** As someone creating an account, I want a short plain-language notice in my language that tells me what Gereo keeps about me and why, and to be able to change my choices later, so that I give consent knowing what I agree to.

**Conversation:** Madagascar's personal data law is Law 2014-038; sources describe an opt-in consent model with an authority (CMIL) whose operation was delayed (06 process 2.4 and 4.4, [S], not verified from the official text). Terms and consent screens must be in the user's language, in plain words (06 process 4.4). Consent to process ID photos is a separate consent (ACC-08). Every consent is recorded with the notice version. The actual text is written by the legal owner; this story defines behaviour only. Member data is never sold or used for third-party offers inside group views (07 UI/UX 2.8 R-S6). Tag legal-gate.

**Preconditions:** The person has entered a phone number and is about to receive a code (ACC-02).
**Trigger:** Person taps `acc.phone.send_code` the first time.

**Acceptance criteria:**
1. Happy path. Before the first code is sent, a screen shows a summary of at most 6 short lines (what we keep, why, who sees it in a group, how long, how to leave, who to contact), a link `acc.consent.read_full` to the full terms and privacy notice, and one explicit button `acc.consent.agree`. Not agreeing returns to the language screen and sends nothing.
2. Business rule. The summary and the full text are available in Malagasy, French and English, in the language chosen in ACC-01. A language without a reviewed legal translation is not offered for the full text; the screen then shows the reviewed language with `acc.consent.language_note` (open question 7). The full terms must state every income line of the platform: the fees (OPS-11) and the rounding amount, which is the part of an ariary left over when a split cannot divide exactly, always under 1 ariary per destination, credited to Gereo and shown as its own line on the receipt (decision D5, CON-14). The consent record carries the notice version, so a change to these lines is a version that "needs consent again" (criterion 5).
3. Business rule. Consents are separate items: (a) terms and privacy notice, required; (b) identity document processing, asked at ACC-08, required for verification only; (c) non-essential notifications and SMS, optional and off by default, asked by NTF-03 and NTF-04 and stored here as Consent records. Security messages (code, new device, PIN change, lock) are part of (a) and are not optional. A required consent is never pre-ticked and an optional one is never bundled with a required one.
4. Business rule. A Consent record stores user, notice version, language shown, item, decision, time, device and, if assisted, the facilitator (ACC-10). It is immutable; a change adds a new record.
5. Business rule, versions. When the notice version changes in a way marked "needs consent again", the next sign-in shows the summary of what changed and asks again; until agreed, the person can read data and export it (ACC-14) but cannot move money.
6. Happy path, withdraw. In `acc.privacy.my_choices` the person sees each consent with date and version and can withdraw an optional one in one tap. Withdrawing a required one explains the consequences and opens account deletion (ACC-15); it does not silently delete.
7. State, offline. The full text is cached after first view and readable offline. First consent needs a connection because it creates the account.
8. Errors. If the consent record cannot be saved, no code is sent and the person sees `err.acc.consent_not_saved` with `Try again`; no partial account is created.
9. Notifications, ledger and audit. No SMS or push. No ledger entry. Audit entries for consent given, withdrawn, re-asked and refused (refusals before an account exists are counted without identity).
10. Accessibility and language. The summary is short sentences, reviewed by a literate-but-not-expert reader (06 process 5.5); there is an audio read-aloud hint only if the MVP adds audio (open question). Buttons are at least 48 dp and the full text reflows at 200% font size.

**Data:** Consent record, User, Audit entry.
**Depends on:** ACC-01, ACC-02, NTF-04, CON-14, OPS-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a guest voter (ACC-16) sees the same short summary and `acc.consent.agree` before the code is sent, because the phone number is processed; the full text is one tap away. Closed: the audio read-aloud hint is not in the MVP (ACC-01). Still open, needs counsel (legal-gate): exact duties under Law 2014-038 (consent form, registration with CMIL, cross-border storage). Default used: the explicit opt-in of this story. Still open, needs counsel and a certified translator: who writes and reviews the legal text in Malagasy, French and English. Default used: the product owner supplies a plain-language draft, counsel owns the final text, and no language is offered without its review. Still open, needs counsel: where personal data is stored. Default used: no decision is coded; storage location is a configuration of the hosting setup.

---

### ACC-14 Export a copy of my data

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none for personal data. Exporting a group wallet's history needs Wallet: export history on that wallet and is handled in WAL-16 and CON-18.
**Tags:** audit

**Story:** As a user, I want to download a copy of the data Gereo holds about me, so that I can keep my own records and leave whenever I want.

**Conversation:** The research asks to ship data export on day one and to publish a shutdown and retention commitment, because Kippa, Open Collective Foundation and Tally all closed and users lost records (competitive analysis sections 1 and 7; 06 process 4.4 on personal data law). This story is about personal data (profile, consents, devices, my activity). The ledger export of a wallet for meetings and accounting is WAL-16 and CON-18. Delivery by file download in the app only; personal data is never sent over SMS.

**Preconditions:** Signed in with a connection.
**Trigger:** Person taps `acc.export.request` in `acc.privacy.my_choices`.

**Acceptance criteria:**
1. Happy path. The screen lists what the export contains: profile, consent history, device list, tier and verification history (status and dates, not photos), my personal wallets and their ledger entries, my contributions and payments in groups, my votes, my expense requests, support tickets, and Audit entries about my account. It offers format choices (a spreadsheet file and a readable PDF).
2. Business rule. The export is generated by the server and the app shows `acc.export.preparing` with the request time and reference ID; when ready (status Ready) the person gets a push and the file appears under `acc.export.ready` for `EXPORT_READY_DAYS`, then becomes Expired. Download needs the PIN.
3. Business rule. Other people's personal data is excluded or masked: phone numbers of other members appear masked (`034 ** *** 12`), their names appear as shown in the group, and nothing from their KYC is included. Votes cast by me are included; the content of secret votes of others is not.
4. Business rule. Amounts are integers in ariary with the code `MGA`, dates are ISO with Madagascar time offset, and each row carries the ledger reference ID, status and, for entries made by a rule, the name of that rule; when money passed through a chain of rules (decision D3, RUL-06) the row carries the name of the rule that made that entry and the reference of the entry that triggered it. An entry that deposited money into one of the person's wallets is labelled income whatever its source, and a rounding line credited to Gereo (D5) appears as its own row. The same file can be re-imported to a spreadsheet without loss.
5. Business rule. One export per `EXPORT_COOLDOWN_HOURS`. During the cooldown the screen shows when the next one is possible and the last file stays downloadable.
6. State, empty and large. A new account gets a short file with only profile and consent history, with a note that there is nothing else yet. A large file shows size in MB before download and asks for consent on mobile data (XCT-07).
7. Errors. Generation failure: `err.acc.export_failed` says nothing was lost and offers `Try again`; no partial file is delivered. Offline: the request cannot be made (`acc.offline.cannot_export`) and a ready file that was already downloaded stays readable.
8. Notifications. `msg.acc.export_ready.push`; if the person has not opened the app, no SMS (the file is never mentioned with a link in an SMS).
9. Ledger and audit. No ledger entry. Audit entries for export requested, generated, downloaded, expired, with device and time.
10. Accessibility and language. The PDF is real text (not images) and in the profile language; the spreadsheet column headers are in the profile language with stable technical names in a second header row.

**Data:** User, Consent record, Device, Identity check (status only), Ledger entry (own), Contribution, Ballot, Support ticket, Audit entry, Notification.
**Depends on:** ACC-03, ACC-13, WAL-16, WAL-15, CON-18, XCT-02, XCT-03.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a prepared file stays downloadable for `EXPORT_READY_DAYS` (7), then it is deleted and the person asks again. Still open, needs counsel: whether the personal data law makes a copy a legal right in a fixed format and delay. Default used: the file of criterion 1 within the time it takes to generate, no fee, no SMS.

---

### ACC-15 Delete my account, and be told what stops me

**Type:** User story
**Priority:** P1
**Release:** MVP
**Actor:** Individual
**Permission needed:** none
**Tags:** legal-gate, ledger, audit

**Story:** As a user, I want to delete my account and see clearly what must be settled first, so that I can leave without leaving money or obligations behind.

**Conversation:** Account closure touches money, group obligations and legal record keeping. Identity and transaction records must be kept at least five years under Law 2016-056 Art. 53 (03 mobile money 5.1), and the ledger is immutable by design (00-conventions section 2), so deleting an account cannot erase ledger entries. The research does not say what the data protection law requires on deletion (06 process 4.4), so the story separates what is anonymised from what is kept, as configuration for the legal owner to set. One-person-holds-the-keys is the main failure mode of group money (competitive analysis section 4, point 2), so a group founder cannot delete while sole holder of the key permissions. Tag legal-gate and ledger.

**Preconditions:** Signed in; PIN known.
**Trigger:** Person taps `acc.delete.start` in `acc.privacy.my_choices`.

**Acceptance criteria:**
1. Happy path. The screen starts with a checklist `acc.delete.checklist` built live from the person's state. Each blocker has icon plus word (`Blocking` or `Done`), a plain sentence and a button to the place that fixes it. When no blocker remains, `acc.delete.confirm` is enabled.
2. Business rule, blockers. Deletion is blocked while any of these is true: a wallet balance above 0 Ar in any personal wallet (the person must withdraw or transfer it; withdrawing needs the right tier, so the checklist links to ACC-07); a transaction in Initiated, Pending or Needs attention; a contribution that is due or overdue in a group, or an amount owed that a group recorded when the person left (GRP-16); an expense request they created that is still open (SPD-12 cancels it); leaving a group below the holders it must keep, that is, the person is the last holder of Group: grant permission, Group: revoke permission, Group: remove member or Group: delete group, or one of fewer than two holders of Wallet: approve spend while a group wallet holds money or has money in flight (GRP-14; the requester can never approve their own request, decision D1, so two holders are the minimum that can pay); money owed to them from a group, such as a split share or a refund not yet paid (CON-14, CON-15). Each blocker names the group or wallet and links to the story that fixes it.
3. Business rule, non-blockers. Being a member of a group, past votes and past contributions do not block deletion. Approvals the person has given on requests still pending are voided and the remaining approvers are told, as when a person leaves a group (GRP-16 criterion 5, SPD-07); a ballot already cast stays counted. The person is warned `acc.delete.approvals_note`.
4. Business rule, what happens. After confirming with code and PIN, the account enters a grace period of `DELETE_GRACE_DAYS`, status Deleting. Sign-in during the period is possible and cancels the deletion. After the period: the profile, display name, phone number, device list and photos are deleted or anonymised according to the retention configuration; Ledger entries, Transactions and Audit entries remain with a pseudonymous reference and no name, for `RECORD_RETENTION_YEARS` (the legal basis is an open question); the person's past votes and contributions show as `acc.deleted.member` in groups.
5. Business rule, ledger and rules. Deletion writes no ledger entry and never edits one. A balance of 0 Ar is required, so no correcting entry is ever needed. At confirmation every rule the person owns is paused (resumed if the deletion is cancelled), and a rule owned by someone else that would pay into one of the person's wallets is paused and its owner told (RUL), because every deposit is income for the wallet that receives it (decision D3) and would break the zero balance. At the end of the grace period the blockers are checked again; if a balance appeared, deletion stops with `err.acc.delete_blocked_now` and the person is told. Otherwise the personal wallets are closed with the WAL-05 action and the person's rules are ended. A deposit that still arrives for a closed wallet follows WAL-05 and is never lost.
6. State. If the checklist cannot be built (no connection), `acc.offline.cannot_delete` is shown; the checklist is never shown from cache as "all done".
7. Errors. If a blocker appears between the checklist and the confirm (for example a payment arrives), the confirm fails with `err.acc.delete_blocked_now`, nothing is deleted and the checklist refreshes.
8. Notifications. Push and SMS at start (`msg.acc.delete_started.push`, `msg.acc.delete_started.sms` with cancel instructions and the date), and at completion (`msg.acc.delete_done.sms`). Holders of Group: remove member and Wallet: approve spend are notified that a member left (`msg.grp.member_left.push`, owned by GRP-16) without the reason.
9. Audit. Audit entries for deletion requested, blockers at that time, cancelled, completed, data anonymised (counts only), with the actor and time. These entries are kept.
10. Accessibility and language. The checklist is a plain list with one action per row; the final confirm repeats what will be deleted and what is kept in plain words, in the user's language.

**Data:** User, Wallet, Wallet rule, Transaction, Contribution, Membership, Expense request, Audit entry, Consent record.
**Depends on:** ACC-07, ACC-13, ACC-14, WAL-05, WAL-03, GRP-14, GRP-16, CON-03, CON-15, SPD-07, SPD-12, RUL-06.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: the grace period is `DELETE_GRACE_DAYS` = 30. Still open, needs counsel (legal-gate): what the data protection law and the e-money law require on deletion and on retention, and whether anonymised ledger entries are acceptable. Default used: personal data deleted or anonymised at the end of the grace period, ledger, transaction and audit entries kept under a pseudonymous reference for `RECORD_RETENTION_YEARS`. Still open, needs counsel and Vanilla Pay: what happens to the balance of a person who cannot be reached (dormant accounts). Default used: deletion stays blocked while any balance is above 0 Ar; Gereo does not sweep or confiscate dormant balances.

---

### ACC-16 Open an invite or vote link without an account

**Type:** Job story
**Priority:** P0
**Release:** MVP
**Actor:** Visitor
**Permission needed:** none (the link carries the right to join or vote; see GRP and VOT)
**Tags:** sms, offline

**Story:** When someone sends me a link to join a group or to vote, I want to see what it is and act on it in my language with the fewest steps, so I can take part even if I have no account and a basic phone.

**Conversation:** The incumbent is WhatsApp or Telegram: installed, no account (competitive analysis section 3.4). Loomio's turnout dropped when people had to register ("another platform to register for", 17%). Gereo's design rule is to make Gereo the record that the chat links into (competitive analysis section 7). Browsing, joining and voting need only phone and OTP (00-conventions section 2). The Guest voter often has a basic phone (00-conventions section 3), so the page must be light and work with minimal steps. A vote or invite link is also a phishing risk (06 process 4.1), so the page shows who sent it and what it is, and never asks for a PIN.

**Preconditions:** The person received a link (SMS, WhatsApp share card or other).
**Trigger:** Person opens the link in a browser or the app.

**Acceptance criteria:**
1. Happy path, invite. The page shows in the language of the link (or the device language, with the switch of ACC-01 visible): group name, the inviter's display name, number of members, and `acc.link.join_group`. Nothing about balances or ledger is shown before joining.
2. Happy path, vote. Before verification the page shows only the group name, who asked and the closing time in absolute and relative time with the zone (XCT-03); the question and options appear only after the number is verified as eligible, so a forwarded link never leaks what the group is deciding (VOT-06 criterion 2). `acc.link.vote_now` leads to the verification; the person verifies only their phone with a code (ACC-02 rules, without PIN). The ballot is tied to the verified number, so each eligible person counts once, which is what the two-distinct-voters rule of a money vote (decision D4) relies on. The vote screen and result rules belong to VOT-04 and VOT-06.
3. Business rule. A guest session created from a vote link is limited to that vote: it cannot see wallets or other groups. After voting, the page offers `acc.link.create_full_account` (PIN and profile via ACC-03) and keeps `Not now` equal in weight. A guest can later become a full account without redoing the code.
4. Business rule. The link is tied to an eligible person or list (GRP-03, VOT-06). If the number entered is not eligible, the person sees `err.acc.link_not_for_you` ("This link is not for this number. Ask the sender.") and no information about the group beyond its name.
5. States. Expired, cancelled or closed links show `err.acc.link_expired`, `err.acc.link_cancelled` or `acc.link.vote_closed` with the result summary shown to eligible people after close (VOT-06 criterion 5), and a contact route to the sender. An invalid link shows a generic, friendly error and no stack trace or identifier.
6. State, loading and offline. The page is lightweight (target within the first-visit budget, XCT-11), shows text first and no required images, and works on a basic browser. Offline, it shows what was loaded and `acc.link.needs_connection` for the step that needs one; it never shows a blank page.
7. Business rule, safety. The page shows the sender's name and `Gereo never asks for your PIN or code`. The link carries no personal data in the URL beyond an opaque token, and tokens are single-purpose and revocable.
8. Notifications. The SMS that carries the link (`msg.acc.invite_link.sms`, `msg.acc.vote_link.sms`) is GSM-7 safe, at most 160 characters, with the sender name, the object name (truncated to a configurable length), the deadline for votes, and a short link (XCT-12). The WhatsApp share card text is separate content owned by VOT-06 and GRP-03.
9. Ledger and audit. No ledger entry. Audit entries for link opened (counted), phone verified, joined or voted, with the token ID, device and time.
10. Accessibility and language. A voter with 200% text sees the question without truncation; the options are buttons of at least 56 dp; screen readers get the deadline as a sentence.

**Data:** Invitation (link token), User (guest), Vote, Ballot, Membership, Notification, Audit entry.
**Depends on:** ACC-01, ACC-02, ACC-13, GRP-03, GRP-04, VOT-04, VOT-06, XCT-03, XCT-11, XCT-12, NTF-11.
**Pages:** to be filled from the information architecture.
**Open questions:** Closed: a guest voter accepts the short summary of ACC-13 (criterion 1 there), with the full text one tap away. Closed: an invite link lives `grp.invite_link_ttl` (7 days, GRP-03) and a vote link works until the vote closes (VOT-06). Closed: the guest sees the result and outcome after the vote closes, not before (VOT-06 criterion 5).

---

## Epic summary

| ID | Title | Priority | Depends on |
| --- | --- | --- | --- |
| ACC-01 | Choose my language and look around before I register | P0 | none |
| ACC-02 | Sign up with my phone number and a code by SMS | P0 | ACC-01, ACC-13, NTF-07, NTF-11, XCT-12, OPS-06 |
| ACC-03 | Set my PIN and choose biometric unlock | P0 | ACC-02 |
| ACC-04 | Reset my PIN myself, without an agent | P0 | ACC-02, ACC-03, ACC-05, ACC-08, OPS-03 |
| ACC-05 | Sign in on a new phone, or after changing my SIM, and keep my account safe | P0 | ACC-02, ACC-03, ACC-04, ACC-08, ACC-11, OPS-03, OPS-10, OPS-11, WAL-10, NTF-05 |
| ACC-06 | Keep my profile up to date: name, language and preferred currency | P1 | ACC-02, XCT-01, XCT-14, OPS-06 |
| ACC-07 | See what I can do now and what unlocks next (tier ladder) | P0 | ACC-02, OPS-11 |
| ACC-08 | Photograph my ID and take a selfie | P0 | ACC-07, ACC-13, XCT-05, XCT-07, OPS-03 |
| ACC-09 | Follow my verification: pending, approved, or rejected with a reason and a retry | P0 | ACC-08, OPS-02, OPS-03, OPS-11, NTF-05 |
| ACC-10 | Be registered by a facilitator who helps me in person | P1 | ACC-01, ACC-02, ACC-03, ACC-08, ACC-13, GRP-03, OPS-02 |
| ACC-11 | See my connected devices and lock my account in an emergency | P0 | ACC-03, ACC-05, GRP-14, OPS-06, NTF-05 |
| ACC-12 | Sign out, and be signed out safely when I stop using the app | P1 | ACC-03, ACC-11, WAL-19, NTF-04, XCT-04, XCT-05 |
| ACC-13 | Read and agree to the terms and privacy notice in my language | P0 | ACC-01, ACC-02, NTF-04, CON-14, OPS-11 |
| ACC-14 | Export a copy of my data | P1 | ACC-03, ACC-13, WAL-15, WAL-16, CON-18, XCT-02, XCT-03 |
| ACC-15 | Delete my account, and be told what stops me | P1 | ACC-07, ACC-13, ACC-14, WAL-03, WAL-05, GRP-14, GRP-16, CON-03, CON-15, SPD-07, SPD-12, RUL-06 |
| ACC-16 | Open an invite or vote link without an account | P0 | ACC-01, ACC-02, ACC-13, GRP-03, GRP-04, VOT-04, VOT-06, XCT-03, XCT-11, XCT-12, NTF-11 |

Count: 16 stories. P0: 11 (ACC-01, 02, 03, 04, 05, 07, 08, 09, 11, 13, 16). P1: 5 (ACC-06, 10, 12, 14, 15). P2: 0.

Note on size: these stories each hold more than one capability and are the candidates to split if a sprint cannot hold them. They keep their IDs here; a split adds a letter suffix.
- ACC-02: OTP request and sign-up (criteria 1 to 4) against OTP failure and limits (criteria 5 to 8): ACC-02a and ACC-02b.
- ACC-05: signing in on a new device against the cooling period and fraud flag (criteria 3 and 6).
- ACC-11: the device list and remote sign-out (criteria 1 and 2) against the emergency lock and unlock (criteria 3 to 6).
- ACC-12: sign-out against the idle app lock and notification previews.
- ACC-13: consent at sign-up (criteria 1 to 5) against managing choices later (criterion 6).
- ACC-16: invite link against vote link; one page, but the two paths test separately.

## Cross-epic dependencies

Story IDs below were looked up in the other epic files. A capability with no story ID is stated as such.

- **XCT-01** language switching (ACC-01, ACC-06); **XCT-02** amount format (ACC-07, ACC-14); **XCT-03** date and time format (ACC-14, ACC-16); **XCT-04** offline read and last synced (ACC-12); **XCT-05** offline queue states (ACC-08, ACC-12); **XCT-07** data saver and photo compression (ACC-08); **XCT-08** and **XCT-09** font scaling and target size (ACC-01, ACC-03); **XCT-11** performance budget for the first-visit page (ACC-16); **XCT-12** SMS template rules for every `msg.acc.*.sms` key; **XCT-14** glossary and string keys (ACC-06, ACC-07).
- **OPS-02, OPS-03** KYC review queue and decision (ACC-04, ACC-05, ACC-08, ACC-09, ACC-10); **OPS-06** ticket handling for number change, operator unlock, contact support and OTP help (ACC-02, ACC-06, ACC-11); **OPS-10** fraud flags for repeated new-device attempts (ACC-05); **OPS-11** tier limits and fees configuration (ACC-05, ACC-07, ACC-09, ACC-13).
- **NTF** owns delivery rules and the catalogue of `msg.acc.*` keys: NTF-05 (push then SMS), NTF-07 (one-message SMS), NTF-04 (choices and previews), NTF-11 (people without the app); security messages are exempt from quiet hours (NTF-09; 07 UI/UX 8.8 R-NT5).
- **WAL** WAL-03 balance, WAL-05 close wallet, WAL-10 PIN screen and new-recipient pause (ACC-03, ACC-05), WAL-06, WAL-09 and WAL-13 limit checks that show the ACC-07 message, WAL-15 and WAL-16 history and export (ACC-14), WAL-19 balance hiding (ACC-12).
- **GRP** GRP-03 invite and Group: invite member (ACC-10, ACC-16), GRP-04 join (ACC-16), GRP-14 continuity rules (ACC-11, ACC-15), GRP-16 leaving and member-left notification (ACC-15).
- **VOT** VOT-04 ballot and VOT-06 guest vote link (ACC-16).
- **CON** CON-03 amounts due, CON-14 split and rounding, CON-15 failed split, CON-18 ledger export (ACC-13, ACC-14, ACC-15). **SPD** SPD-05 approval and its PIN, SPD-07 voided approvals, SPD-12 cancel a request (ACC-05, ACC-07, ACC-15). **RUL** RUL-06 cycle and chain rules (ACC-14, ACC-15). **PRJ, EVT, ANN** none directly.

## Open questions

Each line says Closed with the decision, or Open with the default used and who must answer. Story-level questions are closed or kept in the story itself.

1. **Operating model and records.** Open, needs counsel and Vanilla Pay. Whether Law 2016-056 Art. 53 (five-year retention of identity and transaction records) binds Gereo depends on the operating model (mandated agent, partner or own licence). It decides what ACC-15 can delete. Default used: `RECORD_RETENTION_YEARS` = 5 for identity images and for ledger, transaction and audit entries, kept under a pseudonymous reference after deletion. (competitive analysis section 10.)
2. **KYC tier limits and documents.** Open, needs the regulator (CSBF), Vanilla Pay and counsel. CSBF instructions on tiers and caps were not found; accepted documents, the minimum age and the meaning of the 100 000 000 Ar ceiling are open. Default used: all numbers come from OPS-11; documents are CIN and passport; `KYC_MIN_AGE` = 18 [U]; Level 3 hidden until configured.
3. **Identity verification.** Closed for the MVP: Gereo verifies identity (Vanilla Pay provides none) and an operator compares every selfie with the document photo and the stored reference (OPS-03); automatic matching stays off (`KYC_AUTO_MATCH_ENABLED`). Open, needs a vendor and field tests: the face-match provider and its accuracy in local conditions.
4. **SIM-swap and recovery.** Closed: cooling period on, 24 hours by default; no secondary contact in the MVP; no lock by SMS keyword. Open, needs mobile operators and the aggregator: a SIM-swap signal. Default used: none. Open, needs counsel: whether the money-out limit after a new device is allowed; default as written in ACC-05.
5. **OTP delivery.** Closed: no voice-call fallback in the MVP. Open, needs the SMS aggregator: sender name rules, real SMS latency on local operators, the quote (competitive analysis section 10). Default used: alphanumeric sender `Gereo`, numeric fallback.
6. **Assisted onboarding.** Closed: the facilitator is a group member who holds Group: invite member; no fee or commission; at most 3 sessions a day. Open, needs counsel and the regulator: whether a facilitator's own device may be used; default in ACC-10.
7. **Personal data law.** Open, needs counsel and a certified translator: duties under Law 2014-038 (consent, CMIL registration, storage place, deletion, export right) and the reviewed legal text in three languages. Default used: explicit opt-in (ACC-13), no language offered without its review.
8. **Number change.** Closed: support ticket only, Tier 2 and above, selfie compared by an operator, cooling period applies, both numbers are told (ACC-06).
9. **Words.** Open, needs translators and field testing: everyday Malagasy terms for level, verification, PIN and lock. Default used: the UI says "Level" and "Niveau"; the four kinds of lock keep separate words (conventions above). Closed: no audio hints in the MVP.
10. **Parameters.** Closed: starting values are decided in the parameter table, each with its reason, and are tuned after the pilot. Only `NEW_DEVICE_MONEY_OUT_LIMIT` and the tier limits stay TBD, owned by OPS-11.
