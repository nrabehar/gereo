# ACC: screen and state inventory

Source: `docs/product/stories/ACC.md` (16 stories). Surface IDs are `SCR-ACC-nn`. Kinds: page, sheet, modal, inline, notification, system. Container choice follows 09 section 10.3. Permission names follow conventions section 7; ACC stories need none, so "who sees it" gives the actor. Decisions D1 to D7 and R-rows in `05-decisions.md` apply over any story text.

Line formats used below:

- Surface lines: `SCR-ACC-nn | name | kind | who sees it | entry | exit`.
- State lines: `SCR-ACC-nn [state]: trigger; sees; can do; key`.

---

### ACC-01 Choose my language and look around before I register

- Story: ACC-01 Choose my language and look around before I register
- Surfaces:
  - SCR-ACC-01 | Language screen | page | Visitor (no permission) | first launch, or sign-out on a device with no saved language | tap a language opens SCR-ACC-02
  - SCR-ACC-02 | Welcome screen | page | Visitor | SCR-ACC-01, `acc.welcome.change_language` return path | `acc.welcome.create_account` or `acc.welcome.sign_in` opens SCR-ACC-05; `acc.welcome.look_around` opens SCR-ACC-03; `acc.welcome.change_language` opens SCR-ACC-01
  - SCR-ACC-03 | Example group (read-only: group balance, ledger of 5 to 8 entries, one open vote, one contribution status board) | page | Visitor | `acc.welcome.look_around` | back to SCR-ACC-02; any changing button opens SCR-ACC-04
  - SCR-ACC-04 | Example prompt `acc.demo.needs_account` | modal | Visitor | tap on pay, vote or invite inside SCR-ACC-03 | `Create account` opens SCR-ACC-05; `Not now` closes the prompt
- States per surface:
  - SCR-ACC-01 [default]: first open; three buttons in own language (`Malagasy`, `Francais`, `English`), same size, in this order, each at least 48 by 48 dp; one tap sets language
  - SCR-ACC-01 [device-language match]: device language is mg, fr or en; that button is highlighted but still needs a tap
  - SCR-ACC-01 [large font]: 200% font size; the three buttons stack, every label fully visible
  - SCR-ACC-01 [offline]: no connection; screen works, bundled with the app shell, no network call
  - SCR-ACC-02 [default]: language chosen; sees the three labelled actions `acc.welcome.create_account`, `acc.welcome.sign_in`, `acc.welcome.look_around` and `acc.welcome.change_language`
  - SCR-ACC-02 [offline]: no connection; screen works; no network call until `Create account` or `Sign in` is tapped
  - SCR-ACC-02 [large font]: 200% font size; labels fully visible, no embedded text in images
  - SCR-ACC-03 [default]: sees invented people and amounts, `acc.demo.example_badge` on every screen, read-only
  - SCR-ACC-03 [loading]: not supported; the story forbids a skeleton, spinner or "No data" text (content is local)
  - SCR-ACC-03 [offline]: works with no connection, bundled content
  - SCR-ACC-04 [default]: a changing action was tapped; one-screen prompt with `Create account` and `Not now`; never moves money, never fails silently
- Criteria map:
  - AC 1: SCR-ACC-01 [default] (three equal buttons, order, 48 dp, one tap then SCR-ACC-02)
  - AC 2: SCR-ACC-02 [default] (three labelled actions; look around opens example)
  - AC 3: SCR-ACC-03 [default] (read-only, badge, 5 to 8 ledger entries, one vote, one board, no real data)
  - AC 4: SCR-ACC-04 [default] (prompt `acc.demo.needs_account`)
  - AC 5: SCR-ACC-01 [offline], SCR-ACC-02 [offline], SCR-ACC-03 [offline] (bundled with the app shell, no network call until Create account or Sign in)
  - AC 6: SCR-ACC-03 [loading] (no skeleton, spinner or "No data")
  - AC 7: SCR-ACC-01 [device-language match]; SCR-ACC-02 [default] (`acc.welcome.change_language`); `lang` attribute set on buttons and page (no UI beyond that)
  - AC 8: SCR-ACC-01 [large font], SCR-ACC-02 [large font] (no text in images, XCT-08)
  - AC 9: no UI, system rule (no Audit entry; language stored on device only until ACC-02 completes, then copied to the profile)
  - AC 10: no UI, system rule (no tracking identifier before ACC-02 and consent, ACC-13)
- Objects and fields: Device language setting (local, language code); Example content (static: group balance, 5 to 8 ledger entries, one vote, one status board, invented names and amounts).
- Open points:
  1. ACC-01 precondition says the first screen shows "after sign-out on a device with no saved language", but ACC-12 criterion 1 returns to the welcome screen "with the language kept". Which wins after a normal sign-out (language screen or welcome screen)?
  2. What does `Not now` do on SCR-ACC-04 (stay on the screen that opened it, or go back to the example home)? Not specified in the story.
  3. Are amounts in the example group in a realistic range for Madagascar? The story keeps this open pending field research; no values are specified.
  4. Is the example group reachable again once an account exists (for example from Help)? Not specified in the story.

---

### ACC-02 Sign up with my phone number and a code by SMS

- Story: ACC-02 Sign up with my phone number and a code by SMS
- Surfaces:
  - SCR-ACC-05 | Phone number screen | page | Visitor | `acc.welcome.create_account`, `acc.welcome.sign_in`, SCR-ACC-04 `Create account`, a link from ACC-16 | valid number then `acc.phone.send_code` opens SCR-ACC-06 (first time) or SCR-ACC-07
  - SCR-ACC-06 | Consent summary (max 6 lines, link `acc.consent.read_full`, button `acc.consent.agree`; owned by ACC-13) | page | Visitor | first tap of `acc.phone.send_code` | `acc.consent.agree` sends the code and opens SCR-ACC-07; not agreeing returns to SCR-ACC-01
  - SCR-ACC-07 | Code screen (one input with `autocomplete="one-time-code"`, `OTP_LENGTH` digit segments, resend countdown) | page | Visitor | code sent from SCR-ACC-05 or SCR-ACC-06 | correct code opens SCR-ACC-11; `Change` returns to SCR-ACC-05
  - SCR-ACC-08 | OTP help (`acc.otp.get_help`, a support request that works without an account, OPS-06) | page | Visitor | `acc.otp.get_help` after the third send or after the code-screen lock | sends request to OPS-06, back to SCR-ACC-07
  - SCR-ACC-09 | OTP SMS `msg.acc.otp.sms` | notification (SMS) | Visitor (recipient) | code requested | none
  - SCR-ACC-10 | Pending PIN gate | system | Visitor with account status Pending PIN | next launch while status is Pending PIN | resumes at SCR-ACC-11 only
- States per surface:
  - SCR-ACC-05 [default]: one visible label and one field with numeric keypad; accepts `034 12 345 67`, `0341234567`, `+261 34 12 345 67` and numbers with dashes
  - SCR-ACC-05 [valid]: valid input; sees the normalised number back (`acc.phone.confirm_number`); `acc.phone.send_code` enabled
  - SCR-ACC-05 [invalid number]: not a Madagascar mobile number; sees `err.acc.phone_unrecognised` without blame words; typed value kept
  - SCR-ACC-05 [offline]: no connection; send button disabled with `acc.offline.cannot_send_code`; typed number kept
  - SCR-ACC-05 [over send cap]: over `OTP_MAX_SENDS_PER_HOUR` per number or per device; sees `err.acc.too_many_codes` with the time to try again; no SMS sent
  - SCR-ACC-06 [first send]: first tap of `acc.phone.send_code`; sees the consent summary; nothing is sent until `acc.consent.agree`
  - SCR-ACC-07 [default]: sees `Code sent to 034 12 345 67. Wrong number? Change`; paste accepted, spaces and dashes ignored; submits itself on the last digit; status region announces remaining time and errors without moving focus
  - SCR-ACC-07 [resend countdown]: resend disabled with visible countdown 30, then 60, then 120 seconds
  - SCR-ACC-07 [help offered]: after the third send; `acc.otp.get_help` appears
  - SCR-ACC-07 [wrong code]: sees `err.acc.otp_wrong` (check the latest message); digits cleared, number kept; says nothing about whether an account exists
  - SCR-ACC-07 [attempt lock]: after `OTP_MAX_WRONG_ATTEMPTS` wrong codes; screen locked for `OTP_LOCK_MINUTES` with countdown and `acc.otp.get_help`
  - SCR-ACC-07 [expired]: code older than `OTP_EXPIRY_MINUTES`; sees `err.acc.otp_expired`; primary button `Send a new code`
  - SCR-ACC-07 [not arrived]: under the code field, `acc.otp.not_arrived` (check the signal, codes can take up to a minute)
  - SCR-ACC-07 [offline]: no connection; send disabled with `acc.offline.cannot_send_code`; typed number kept
  - SCR-ACC-07 [success]: correct code; account created in status Pending PIN at Tier 1; opens SCR-ACC-11
  - SCR-ACC-07 [used or superseded code]: a used code, or one invalidated by a newer request; the code is rejected (key for this case not specified in the story)
  - SCR-ACC-08 [default]: sees a support request form usable without an account; submit; key not specified in the story
  - SCR-ACC-09 [sent]: `msg.acc.otp.sms` with the code, the validity in minutes, the sentence that Gereo never asks for the code or PIN, last line `@{APP_DOMAIN} #{code}`; in the language chosen in ACC-01
  - SCR-ACC-10 [gated]: app closed before the PIN is set; only SCR-ACC-11 is reachable
- Criteria map:
  - AC 1: SCR-ACC-05 [default], [valid]; SCR-ACC-06 [first send] (normalisation, confirm number, consent before first send)
  - AC 2: SCR-ACC-07 [default] (segments, autofill, paste, auto-submit)
  - AC 3: SCR-ACC-07 [success]; SCR-ACC-10 [gated] (account Pending PIN at Tier 1; resume at PIN screen)
  - AC 4: SCR-ACC-07 [expired], [used or superseded code] (validity, new code invalidates previous, single use)
  - AC 5: SCR-ACC-07 [resend countdown], [help offered]; SCR-ACC-05 [over send cap] (countdown, `acc.otp.get_help`, cap per number and device)
  - AC 6: SCR-ACC-07 [wrong code], [attempt lock] (`err.acc.otp_wrong`, lock, no account hint)
  - AC 7: SCR-ACC-07 [expired]; SCR-ACC-05 [invalid number] (`err.acc.otp_expired`, `err.acc.phone_unrecognised`)
  - AC 8: SCR-ACC-05 [offline], SCR-ACC-07 [offline], SCR-ACC-07 [not arrived]
  - AC 9: SCR-ACC-09 [sent] (`msg.acc.otp.sms` content and XCT-12 limit)
  - AC 10: no UI, system rule (no ledger entry; Audit entries code requested, verified, failed, OTP lock started with hash of number, device ID, time); status-region announcement shown in SCR-ACC-07 [default]
- Objects and fields: User (phone in international format, status Pending PIN, tier 1, language); Device (device ID); Notification (OTP SMS); Audit entry (number hash, device ID, time, result); Consent record (read, ACC-13).
- Open points:
  1. "After the third send, `acc.otp.get_help` appears" while the parameter table says three resends (30, 60, 120 seconds), which is four sends. Is help shown after the third or the fourth SMS?
  2. What does "Sign in" do with a number that has no account, given the screen must never reveal whether an account exists? Not specified in the story.
  3. What does "Create account" do with a number that already has an account? Not specified in the story.
  4. Which message key is shown when a used or superseded code is entered? Not specified in the story.
  5. Which key and which fields does OTP help use? Not specified in the story (OPS-06 owns the request).
  6. Sender name and whether it is allowed for OTP traffic is open with the SMS aggregator (default `Gereo`, numeric fallback).
  7. Is the "Wrong number? Change" text a key? Not specified in the story.

---

### ACC-03 Set my PIN and choose biometric unlock

- Story: ACC-03 Set my PIN and choose biometric unlock
- Surfaces:
  - SCR-ACC-11 | PIN setup (enter PIN, repeat PIN, large keypad) | page | Individual (new user, or person changing PIN) | SCR-ACC-07 [success], PIN change from the profile, SCR-ACC-10, ACC-04 reset | matching PINs open SCR-ACC-12 if a biometric is enrolled, otherwise the home screen
  - SCR-ACC-12 | Biometric offer (`acc.biometric.enable`, `acc.biometric.skip`) | page | Individual with an enrolled biometric | after SCR-ACC-11 | enable or skip opens the home screen
  - SCR-ACC-13 | App unlock and PIN entry (PIN or fingerprint; `acc.pin.forgot`) | page | Individual | app open, app return, any PIN prompt | correct PIN opens the app; `acc.pin.forgot` starts the ACC-04 flow
  - SCR-ACC-14 | PIN changed notice `msg.acc.pin_changed` (`.push` to other devices, `.sms` to the number) | notification | Individual (recipient) | PIN change or reset completed | none
  - SCR-ACC-15 | PIN verifier and hashing | system | none (server and device) | PIN creation and every PIN check | none
- States per surface:
  - SCR-ACC-11 [default]: sees a large keypad, field for `PIN_LENGTH` digits (4 to 6, 4 accepted), then a repeat step, and `Gereo never asks for your PIN or code` in the person's language; keypad targets at least 56 dp; screen reader announces digit count only; paste supported
  - SCR-ACC-11 [too easy]: all same digit, ascending or descending run, or matches the last digits of the phone number; sees `err.acc.pin_too_easy`; configurable list
  - SCR-ACC-11 [mismatch]: repeat differs; sees `err.acc.pin_mismatch`; both fields cleared, stays on the screen
  - SCR-ACC-11 [resumed]: app killed mid-setup; restarts at the first PIN entry
  - SCR-ACC-11 [offline]: setup of a new account without a connection; blocked with `acc.offline.cannot_set_pin` (server holds the hash)
  - SCR-ACC-11 [success]: matching PINs; setup finishes; opens the next screen
  - SCR-ACC-12 [default]: biometric enrolled; two equal-weight choices `acc.biometric.enable` and `acc.biometric.skip`
  - SCR-ACC-12 [hidden]: no biometric available on the device; the screen is not shown
  - SCR-ACC-13 [default]: PIN or fingerprint prompt; biometric failure falls back to the PIN with no extra friction
  - SCR-ACC-13 [PIN lock-out]: `PIN_MAX_WRONG_ATTEMPTS` wrong entries; entry locked for `PIN_LOCK_MINUTES`; sees time left and `Forgot my PIN`; not an account lock
  - SCR-ACC-13 [offline]: registered device offline; unlock works against the local verifier; wrong attempts counted on the device and reported at next contact
  - SCR-ACC-14 [push]: PIN changed; `msg.acc.pin_changed.push` to all other devices
  - SCR-ACC-14 [sms]: PIN changed; `msg.acc.pin_changed.sms` to the number
- Criteria map:
  - AC 1: SCR-ACC-11 [default], [success] (enter then repeat, then home)
  - AC 2: SCR-ACC-11 [too easy] (`err.acc.pin_too_easy`)
  - AC 3: SCR-ACC-15 (salted slow hash, never in SMS, push, log or Audit; device verifier deleted on sign-out; money-out and PIN change checked by the server; one PIN for unlock and money-out): no UI, system rule
  - AC 4: SCR-ACC-12 [default], [hidden] (biometric offer, equal weight, offered again in the profile)
  - AC 5: SCR-ACC-13 [default] (biometric opens reading screens only; money-out and PIN change still ask the PIN on a screen repeating amount and recipient, owned by WAL-10)
  - AC 6: SCR-ACC-11 [mismatch]; SCR-ACC-13 [PIN lock-out] (`err.acc.pin_mismatch`, lock-out, `Forgot my PIN`)
  - AC 7: SCR-ACC-11 [resumed], [offline]; SCR-ACC-13 [offline] (`acc.offline.cannot_set_pin`, local verifier)
  - AC 8: SCR-ACC-14 [push], [sms] (`msg.acc.pin_changed.push`, `.sms`; none at setup)
  - AC 9: no UI, system rule (no ledger entry; Audit entries PIN created, changed, biometric enabled or disabled, lock started, never the PIN)
  - AC 10: SCR-ACC-11 [default] (56 dp keypad, digit count announced, paste, never-asks sentence in three languages, XCT-09)
- Objects and fields: User (PIN hash server side, biometric preference); Device (local verifier, wrong-attempt counter, biometric flag); Audit entry (event, device, time).
- Open points:
  1. The trigger says "PIN change from the profile (ACC-06)" and criterion 4 says the biometric offer "can be made again in the profile", but ACC-06 criterion 1 lists no Change PIN control and no biometric toggle. Where do these two controls live?
  2. Does a PIN change from the profile ask for the current PIN first? Not specified in the story.
  3. The weak-PIN list is configuration with a starting list of three patterns; is the phone-number match checked against the last 4 digits or more? Not specified in the story ("last digits").
  4. During `NEW_DEVICE_COOLING_HOURS` a PIN change is blocked (ACC-05); which message does SCR-ACC-11 show then? Not specified in the story.

---

### ACC-04 Reset my PIN myself, without an agent

- Story: ACC-04 Reset my PIN myself, without an agent
- Surfaces:
  - SCR-ACC-16 | Forgot-PIN flow steps (number, code, new PIN, repeat PIN) | page | Individual | `acc.pin.forgot` on SCR-ACC-13 (including lock-out) | completes at SCR-ACC-17; reuses SCR-ACC-05 and SCR-ACC-07 for number and code and SCR-ACC-11 for the new PIN
  - SCR-ACC-17 | Reset confirmation (end time of the cooling limits) | page | Individual | reset completed | home screen
  - SCR-ACC-18 | Live selfie capture step (rules from ACC-08) | page | Individual at Tier 2 and above | after the code in ACC-04, ACC-05 and unlock in ACC-11 | submit sends the case; on pass or review opens SCR-ACC-19
  - SCR-ACC-19 | Reset in review `acc.reset.in_review` (reference ID, expected time from `KYC_REVIEW_TARGET_HOURS`) | page | Individual at Tier 2 and above | selfie submitted | back to sign-in
  - SCR-ACC-20 | Contact support `acc.reset.contact_support` (pre-filled support request) | page | Individual | after `KYC_MAX_ATTEMPTS` failed selfies | submits ticket to OPS-06
  - SCR-ACC-21 | Reset side effects (sign out other devices, cancel Initiated money-out waiting for a PIN, start cooling limits) | system | none | reset completed | none
- States per surface:
  - SCR-ACC-16 [default, Tier 1]: confirm number, receive code (ACC-02 rules), enter it, set new PIN (ACC-03 rules), repeat; four screens in total; signed in on this device
  - SCR-ACC-16 [wrong code, expired, rate limited]: same as SCR-ACC-07 states
  - SCR-ACC-16 [offline]: no connection; sees `acc.offline.cannot_reset`; no data lost; cached reading only for sessions already unlocked
  - SCR-ACC-17 [default]: sees the cooling end time from `NEW_DEVICE_COOLING_HOURS` (0 means none)
  - SCR-ACC-18 [default]: live selfie capture as in ACC-08; operator will compare with the stored reference selfie
  - SCR-ACC-18 [selfie failed]: sees the specific reason (`err.acc.selfie_too_dark` and similar) and the retake tip
  - SCR-ACC-19 [pending review]: Tier 2 and above; sees reference ID (copyable) and expected time; case enters the KYC queue as type PIN reset
  - SCR-ACC-19 [auto match passes]: only when `KYC_AUTO_MATCH_ENABLED` is on later; flow continues as the Tier 1 path
  - SCR-ACC-19 [auto match cannot decide]: goes to the queue as above
  - SCR-ACC-20 [default]: after `KYC_MAX_ATTEMPTS` failed selfies; sees `acc.reset.contact_support` with a pre-filled request
  - SCR-ACC-21 [applied]: other devices signed out, Initiated money-out requests waiting for a PIN cancelled, money-out and a second PIN change limited for the cooling period
- Criteria map:
  - AC 1: SCR-ACC-16 [default, Tier 1]
  - AC 2: SCR-ACC-18 [default]; SCR-ACC-19 [pending review], [auto match passes], [auto match cannot decide]
  - AC 3: SCR-ACC-21 [applied]; SCR-ACC-17 [default] (sign out other devices, cancel Initiated requests waiting for PIN, cooling limits, end time told)
  - AC 4: no UI, system rule (tier, wallets and ledger unchanged; Pending transactions keep settling; approvals and ballots stay)
  - AC 5: SCR-ACC-16 [wrong code, expired, rate limited]; SCR-ACC-18 [selfie failed]; SCR-ACC-20 [default]
  - AC 6: SCR-ACC-16 [offline]
  - AC 7: SCR-ACC-14 [push], [sms] (defined under ACC-03; adds: push to every other device before sign-out; SMS carries the time and "If this was not you, contact support with reference {ref}")
  - AC 8: no UI, system rule (no ledger entry; Audit entries reset requested, code verified, selfie result, completed or abandoned, sessions revoked)
  - AC 9: SCR-ACC-13 [PIN lock-out] and SCR-ACC-16 (plain-words recovery text, never-asks sentence); SCR-ACC-19 [pending review] (copyable reference ID)
- Objects and fields: User; Device (sessions revoked); Identity check (type PIN reset, reference ID, attempts); Support ticket (when escalated); Audit entry; Transaction (Initiated requests cancelled).
- Open points:
  1. For Tier 2 and above, is the person signed in on this device while the case is in review, or locked out until the operator decides? Not specified in the story.
  2. If the operator rejects a PIN-reset selfie, where does the person see the reasons? ACC-09 covers ID verification only; `err.acc.selfie_too_dark` is described as an immediate device check. Not specified in the story.
  3. May a locked account (ACC-11) use Forgot PIN? ACC-11 says no PIN change while Locked; the story does not say what the reset flow shows then.
  4. Which key is used for the reset confirmation screen and for the "Forgot my PIN" label on the lock-out screen (`acc.pin.forgot` is named only as the trigger)? Not specified in the story.
  5. Does the retake request counted as an attempt (statuses table) count toward `KYC_MAX_ATTEMPTS` for a PIN reset case? The statuses table says a retake is a Rejected result and counts; not stated for reset cases.

---

### ACC-05 Sign in on a new phone, or after changing my SIM, and keep my account safe

- Story: ACC-05 Sign in on a new phone, or after changing my SIM, and keep my account safe
- Surfaces:
  - SCR-ACC-22 | New-device sign-in flow (code, then PIN or ACC-04, then selfie at Tier 2 and above) | page | Individual | registered phone number entered on an unknown device | device registered opens home; reuses SCR-ACC-05, SCR-ACC-07, SCR-ACC-13, SCR-ACC-18
  - SCR-ACC-23 | New-device warning `acc.newdevice.warning` ("Did someone ask you to do this? Gereo never asks for your PIN or code.", Cancel visually primary) | modal | Individual | first sign-in on a new device | Cancel or continue
  - SCR-ACC-24 | Cooling-period notice (what is blocked, exact unlock time) | inline | Individual on a device marked `new` | money-out, PIN change screens (pause screen of WAL-10) | none
  - SCR-ACC-25 | New-device alert `msg.acc.new_device` (`.push` with device name, time and button `This was not me`; `.sms` with reference ID and support route) | notification | Individual (other devices and the number) | device registered | `This was not me` opens SCR-ACC-55 (emergency lock)
  - SCR-ACC-26 | Contact support `acc.newdevice.contact_support` | page | Individual | `NEW_DEVICE_FLAG_COUNT` failures within `NEW_DEVICE_FLAG_WINDOW_HOURS` | submits ticket
  - SCR-ACC-27 | Fraud flag raiser (OPS-10) and device marker `new` | system | none | failures, device registration | none
- States per surface:
  - SCR-ACC-22 [default, Tier 1]: code (ACC-02 rules), then PIN (or ACC-04 if forgotten); device registered; home opens; old phone not needed
  - SCR-ACC-22 [Tier 2 and above]: live selfie also required before the device is registered; operator review as ACC-04 AC2, case type device recovery
  - SCR-ACC-22 [failed code or selfie]: device not registered, account untouched; message never reveals whether the number has an account before the code is verified
  - SCR-ACC-22 [offline]: no connection; sees `acc.offline.cannot_sign_in_new_device`; keypad still usable for known-device PIN unlock
  - SCR-ACC-22 [no old device]: same flow, complete
  - SCR-ACC-23 [default]: first sign-in on the new device; warning text; Cancel primary
  - SCR-ACC-24 [cooling active]: device marked `new` for `NEW_DEVICE_COOLING_HOURS` (0 means none); first money-out to a payee, money-out above the OPS-11 new-device limit, any PIN change, and approving someone else's request are blocked or need extra confirmation; screen says exactly when each unlocks; browsing, voting and money-in not blocked
  - SCR-ACC-24 [cooling ended]: window over; marker cleared; nothing shown
  - SCR-ACC-25 [push]: `msg.acc.new_device.push` to every other registered device
  - SCR-ACC-25 [sms]: `msg.acc.new_device.sms` to the number (XCT-12 limit)
  - SCR-ACC-26 [default]: fraud flag raised; person told to contact support
- Criteria map:
  - AC 1: SCR-ACC-22 [default, Tier 1]
  - AC 2: SCR-ACC-22 [Tier 2 and above]
  - AC 3: SCR-ACC-24 [cooling active]; (a ballot from a new device is accepted, no UI)
  - AC 4: SCR-ACC-23 [default]
  - AC 5: SCR-ACC-25 [push], [sms]
  - AC 6: SCR-ACC-22 [failed code or selfie]; SCR-ACC-26 [default]; SCR-ACC-27 (flag, OPS-10)
  - AC 7: SCR-ACC-22 [no old device]; pointer to ACC-11 from the person's other phone (no extra UI)
  - AC 8: no UI, system rule (no ledger entry; Audit entries device registered, selfie result, cooling started and ended, `This was not me` pressed)
  - AC 9: SCR-ACC-25 [push], [sms] (device name is plain model text; SMS in profile language); SCR-ACC-23 [default] (text plus icon)
  - AC 10: SCR-ACC-22 [offline]
- Objects and fields: User; Device (model name, registered time, marker `new`, cooling end); Identity check (case type device recovery); Notification; Audit entry.
- Open points:
  1. Criterion 3 says first-time payee, large amount and PIN change are "blocked or require extra confirmation". Which is it for each, and what is the confirmation? Not specified in the story (pause screen belongs to WAL-10).
  2. At Tier 2 and above the selfie is reviewed by an operator before the device is registered. What does the person see and can they use the account elsewhere while waiting? Not specified in the story.
  3. What is the new-device money-out limit amount? TBD, owned by OPS-11.
  4. Is there an SIM-swap signal from the mobile operators? Open with the operators; default is none.
  5. If the account has no other device, `msg.acc.new_device.push` has no recipient; is the SMS the only alert? The story implies it but does not say.
  6. Does `This was not me` need any authentication before it opens the emergency lock? Not specified here; ACC-11 criterion 3 covers the lock itself.

---

### ACC-06 Keep my profile up to date: name, language and preferred currency

- Story: ACC-06 Keep my profile up to date: name, language and preferred currency
- Surfaces:
  - SCR-ACC-28 | Profile (display name, masked phone, language, preferred currency, tier and verification status) | page | Individual (Tier 1 or above) | profile entry in the account area | links to SCR-ACC-33 (ladder), SCR-ACC-46 (verification status), SCR-ACC-54 (devices), SCR-ACC-70 (my choices)
  - SCR-ACC-29 | Display name edit | inline | Individual | tap on display name in SCR-ACC-28 | one-tap save
  - SCR-ACC-30 | PIN confirmation prompt (reveal phone, also used by device list, export download) | sheet | Individual | tap to reveal masked phone | enter PIN or cancel
  - SCR-ACC-31 | Number-change help `acc.profile.change_number_help` | inline | Individual | SCR-ACC-28 | opens a support request of case type `number change` (OPS-02, OPS-06)
  - SCR-ACC-32 | Phone changed alert `msg.acc.phone_changed` (EV-ACC-04) | notification | Individual (old and new number) | support-approved number change | none
- States per surface:
  - SCR-ACC-28 [default]: sees display name, phone masked by default, language, currency, tier, verification status; verified legal name read-only under the display name with `acc.profile.verified_name` once ID is approved
  - SCR-ACC-28 [offline]: reads from cache with last-synced time; edits blocked with `xct.offline.needs_connection`
  - SCR-ACC-28 [currency]: preferred currency offers only `MGA`; control disabled with `acc.profile.more_currencies_later`
  - SCR-ACC-28 [language changed]: applies at once to the app, push and SMS sent afterwards; group default language unchanged
  - SCR-ACC-29 [default]: edit 2 to 40 characters (configurable); letters, digits, spaces, apostrophe, hyphen
  - SCR-ACC-29 [reserved name]: name imitates staff or reserved words; sees `err.acc.name_reserved`
  - SCR-ACC-29 [save failed]: save error; sees `err.acc.save_failed` with what was kept; typed values kept
  - SCR-ACC-29 [saved]: one tap; name appears in groups within one sync
  - SCR-ACC-30 [default]: PIN prompt; correct PIN shows the number
  - SCR-ACC-31 [default]: text telling the person to open a support request for a number change
  - SCR-ACC-32 [push]/[sms]: both numbers receive `msg.acc.phone_changed`
- Criteria map:
  - AC 1: SCR-ACC-28 [default]; SCR-ACC-29 [saved]; SCR-ACC-30 [default]
  - AC 2: SCR-ACC-29 [default], [reserved name]
  - AC 3: SCR-ACC-28 [default] (`acc.profile.verified_name`, legal name changes via support)
  - AC 4: SCR-ACC-28 [language changed]
  - AC 5: SCR-ACC-28 [currency]
  - AC 6: SCR-ACC-31 [default]
  - AC 7: SCR-ACC-28 [offline]
  - AC 8: SCR-ACC-29 [save failed]
  - AC 9: no UI, system rule (no notification; Audit per changed field with old and new value, phone digits stored masked)
  - AC 10: no UI beyond SCR-ACC-28 and SCR-ACC-29 [default] (visible labels above fields, controls at least 48 dp)
- Objects and fields: User (display name, masked phone, language, preferred currency, tier, legal name from ID check); Audit entry (field, old, new); Support ticket (case type number change).
- Open points:
  1. Reserved names: criterion 2 lists `Gereo` and `Support`; the open question lists `Gereo`, `Support` and `Admin`. Which is the starting list?
  2. Where do Change PIN, biometric on or off, devices, privacy choices and sign out live relative to the profile? Criterion 1 lists none of them (other stories use `acc.devices.list`, `acc.privacy.my_choices`, `acc.session.sign_out`).
  3. Does language change work offline? Criterion 7 blocks profile edits offline, while ACC-01 stores language on the device. Not specified in the story.
  4. After a number change all devices are signed out and cooling starts; which screen does the person see on the old number's device? Not specified in the story.
  5. ACC-01 criterion 7 keeps the language list on the welcome screen only; is a language choice also in the profile for signed-in users (criterion 4 implies yes)? Confirmed by the story only for the profile.

---

### ACC-07 See what I can do now and what unlocks next (tier ladder)

- Story: ACC-07 See what I can do now and what unlocks next (tier ladder)
- Surfaces:
  - SCR-ACC-33 | Level ladder `acc.tiers.ladder` | page | Individual | profile, limit prompt | `acc.tiers.verify_now` opens ACC-08 flow
  - SCR-ACC-34 | Limit prompt `acc.tiers.limit_hit` (specific benefit, `Verify now`, `Not now`) | modal | Individual in a deposit, contribution or money-out flow (shown through ACC-07 by WAL, CON, SPD) | amount above the current tier limit, before PIN entry | `Verify now` opens ACC-08 flow; `Not now` returns with form values kept
  - SCR-ACC-35 | Review pending banner `acc.tiers.review_pending` | inline | Individual with a pending Identity check | SCR-ACC-33 | none
  - SCR-ACC-36 | Tier requirements engine ("Tier requirements by action" table) | system | none | any deposit, contribution, money-out, rule save, approval | none
  - SCR-ACC-37 | Group-specific limit line (group name) | inline | Individual who is a member of a group wallet with OPS-11 limits | SCR-ACC-33 | none
- States per surface:
  - SCR-ACC-33 [default]: one step per OPS-11 level (Level 1 and 2 at launch, Level 3 once configured); current step marked by icon plus `acc.tiers.current`; plain verbs and limits in `12 500 Ar` format
  - SCR-ACC-33 [next step]: under current step `acc.tiers.unlocks_next` and button `acc.tiers.verify_now`
  - SCR-ACC-33 [offline]: readable from cache with last-synced time and limits start date; `Verify now` disabled with a reason except capturing photos (ACC-08)
  - SCR-ACC-33 [config unavailable]: configuration cannot be loaded; shows last cached limits with `Updated {time}`, never an empty or zero limit
  - SCR-ACC-33 [verification pending]: current and next steps unchanged
  - SCR-ACC-34 [default]: sees e.g. "To send more than {limit}, verify your ID. It takes about {minutes} minutes"; no money moved; amount and form values kept
  - SCR-ACC-35 [pending]: banner shows the reference ID and what still works
  - SCR-ACC-36 [applied]: approval path: requester Tier 1, every approver at the money-out tier; vote path: requester at the money-out tier, voters and guests phone and OTP only; rules leaving the group need the money-out tier for the maximum per firing; over-limit firings held in the source wallet with a visible reason
  - SCR-ACC-36 [inactive approver]: Wallet: approve spend granted below the required tier; stays inactive; group sees "cannot approve yet" with no reason, only the holder sees why (GRP-08)
  - SCR-ACC-37 [default]: group limits as their own line with the group name
- Criteria map:
  - AC 1: SCR-ACC-33 [default]
  - AC 2: SCR-ACC-33 [next step]
  - AC 3: SCR-ACC-36 [applied] (one sentence per action; only table that names the tier)
  - AC 4: SCR-ACC-34 [default]
  - AC 5: SCR-ACC-36 [applied], [inactive approver]; SCR-ACC-37 [default]
  - AC 6: SCR-ACC-35 [pending]; SCR-ACC-33 [verification pending]
  - AC 7: SCR-ACC-33 [offline]
  - AC 8: SCR-ACC-33 [config unavailable]
  - AC 9: no UI, system rule (screen writes no ledger entry or Audit; tier changes written by ACC-09 and OPS-11)
  - AC 10: SCR-ACC-33 [default] (spaced non-wrapping amounts, list in reading order, "Level" and "Niveau", never "tier")
- Objects and fields: User (tier); Identity check (status, reference ID); Tier configuration (levels, single-deposit limit, single money-out limit, receive limit, start date).
- Open points:
  1. What is `{minutes}` in `acc.tiers.limit_hit`? Not specified in the story.
  2. Criterion 7: `Verify now` is "disabled offline with a reason except for capturing photos". Does that mean the button works offline for capture only, or is disabled while capture is reachable elsewhere? Not specified.
  3. The Malagasy word for Level is open with translators (ACC open question 9).
  4. When a group wallet has its own OPS-11 limits, how many lines appear and in which order on the ladder? Not specified in the story.
  5. "Money-out limit may be zero; value TBD" at Tier 1: what does the ladder show for a zero limit? Not specified.

---

### ACC-08 Photograph my ID and take a selfie

- Story: ACC-08 Photograph my ID and take a selfie
- Surfaces:
  - SCR-ACC-38 | Verification step 1: why we ask | page | Individual (any tier) | `acc.tiers.verify_now`, ACC-04 and ACC-05 routing | next step
  - SCR-ACC-39 | Verification step 2: document type and number | page | Individual | step 1 | next step
  - SCR-ACC-40 | Verification step 3: document photo (front, and back if the type needs it; guide frame, one illustration, preview with `Retake` and `Use this photo`) | page | Individual | step 2 | next step
  - SCR-ACC-41 | Verification step 4: selfie (uses SCR-ACC-18) | page | Individual | step 3 | next step
  - SCR-ACC-42 | Verification step 5: review and send | page | Individual | step 4 | submit creates an Identity check Pending
  - SCR-ACC-43 | Upload and queue status (`Waiting to send`, `Sent`, `Confirmed`, progress bar, interrupt) | inline | Individual | after photos are taken | none
  - SCR-ACC-44 | Camera permission denied screen | page | Individual | camera permission refused or no usable camera | assisted onboarding (ACC-10), support route (OPS-06)
  - SCR-ACC-45 | Submitted notice `msg.acc.kyc_submitted` (`.push`, `.sms`) | notification | Individual | case submitted | none
- States per surface:
  - SCR-ACC-38 [default]: step titled "Step 1 of 5"; one sentence per item asked; `Gereo never asks for your PIN or code`
  - SCR-ACC-39 [default]: configurable document list (CIN, passport); number typed once and not asked again in the process
  - SCR-ACC-39 [underage]: below `KYC_MIN_AGE`; sees `err.acc.kyc_underage` in plain words; cannot continue
  - SCR-ACC-40 [default]: guide frame, one illustration; device checks blur, glare and darkness
  - SCR-ACC-40 [photo failed check]: sees the specific tip (`err.acc.photo_too_dark` "Move near a window") before submit
  - SCR-ACC-40 [preview]: preview with `Retake` and `Use this photo` always shown
  - SCR-ACC-40 [camera only]: gallery picking not offered
  - SCR-ACC-41 [default]: selfie capture in app camera; preview with `Retake`, `Use this photo`
  - SCR-ACC-42 [default]: review all items then send; repeated send reuses the same attempt ID
  - SCR-ACC-42 [pending case exists]: a person with a pending case cannot start another; sees ACC-09 status instead
  - SCR-ACC-43 [waiting to send]: offline or dropped connection; photos saved on phone, `Waiting to send` (`xct.queue.waiting`); "Open Gereo when you have signal"
  - SCR-ACC-43 [sending short]: upload under 10 seconds; spinner in the button only
  - SCR-ACC-43 [sending long]: upload over 10 seconds; percentage and an interrupt button
  - SCR-ACC-43 [sent]: `Sent` (`xct.queue.sent`)
  - SCR-ACC-43 [confirmed]: `Confirmed` (`xct.queue.confirmed`); server confirmed; photos deleted from device
  - SCR-ACC-43 [upload failed]: failed after retries with exponential backoff; sees `err.acc.upload_failed` (photos kept, nothing lost) and `Try again`
  - SCR-ACC-43 [expired]: `QUEUE_KYC_MAX_DAYS` reached; photos self-expire (message per XCT-05)
  - SCR-ACC-43 [resumed]: app killed or connection dropped; resumes at the last step with photos kept
  - SCR-ACC-44 [camera denied]: sees `err.acc.camera_denied` with three plain steps to allow it and an offer of assisted onboarding (ACC-10)
  - SCR-ACC-44 [no camera]: phone has no usable camera; same screen with the support route (OPS-06)
  - SCR-ACC-45 [push]/[sms]: `msg.acc.kyc_submitted.push`, `msg.acc.kyc_submitted.sms` with reference ID and expected time
- Criteria map:
  - AC 1: SCR-ACC-38, SCR-ACC-39, SCR-ACC-40, SCR-ACC-41, SCR-ACC-42 [default] (five steps, "Step n of N", N is 5)
  - AC 2: SCR-ACC-39 [default], [underage]
  - AC 3: SCR-ACC-40 [default], [photo failed check], [preview]
  - AC 4: SCR-ACC-40 [camera only] (app camera only, compression bounded, XCT-07)
  - AC 5: SCR-ACC-43 [waiting to send], [sent], [confirmed], [resumed], [expired]
  - AC 6: SCR-ACC-43 [sending short], [sending long]
  - AC 7: SCR-ACC-42 [default], [pending case exists]
  - AC 8: SCR-ACC-44 [camera denied], [no camera]; SCR-ACC-43 [upload failed]
  - AC 9: SCR-ACC-45 [push], [sms]; no UI otherwise (Identity check Pending; Audit entries; encrypted images visible only to operators with the review permission)
  - AC 10: SCR-ACC-38 to SCR-ACC-41 (illustration plus short sentence, 56 dp capture buttons, tips announced by screen reader, no audio)
- Objects and fields: Identity check (attempt ID, document type, number, photos, selfie, status Pending, assisted_by); User; Device; Notification; Audit entry.
- Open points:
  1. ACC-13 criterion 3 says the identity-document consent (b) is asked at ACC-08, and the precondition says it is recorded, but none of the five steps is a consent step. Where is it asked?
  2. How is minimum age determined (date of birth typed, read from the document, or the operator)? `err.acc.kyc_underage` is named but no input for age is specified.
  3. Blur, glare and darkness thresholds and the compression size are "configurable"; no values specified.
  4. Does "Step n of 5" apply to a selfie-only flow in ACC-04, ACC-05 and ACC-11? Not specified in the story.
  5. Which text shows when queued photos self-expire after `QUEUE_KYC_MAX_DAYS` (3)? Owned by XCT-05; not specified here.
  6. Selfie reviewed by an operator with no automatic match (`KYC_AUTO_MATCH_ENABLED` off): does the person see any liveness check beyond live capture? The story says live capture is the liveness; no further UI.

---

### ACC-09 Follow my verification: pending, approved, or rejected with a reason and a retry

- Story: ACC-09 Follow my verification: pending, approved, or rejected with a reason and a retry
- Surfaces:
  - SCR-ACC-46 | Verification status `acc.kyc.status` | page | Individual | profile, banner (SCR-ACC-35), notification SCR-ACC-47 | `Try again` opens ACC-08 flow; `acc.kyc.verify_more`; `acc.kyc.contact_support` opens a support request (OPS-06)
  - SCR-ACC-47 | Decision notices `msg.acc.kyc_approved` and `msg.acc.kyc_action_needed` (`.push`, `.sms`) | notification | Individual | operator decision | opens SCR-ACC-46
- States per surface:
  - SCR-ACC-46 [pending]: status word `acc.kyc.pending` with icon, date and time sent, copyable reference ID, expected time from `KYC_REVIEW_TARGET_HOURS`; lists what still works (browse, join, vote, money within the current tier) and what waits
  - SCR-ACC-46 [approved]: `acc.kyc.approved`, new tier and new limits (OPS-11); applies from approval to the next action
  - SCR-ACC-46 [approved lower tier]: operator approved a lower tier than requested; sees a fixed reason from the list and `acc.kyc.verify_more`
  - SCR-ACC-46 [rejected]: `acc.kyc.rejected` with one or more reasons from the fixed list, each with text and tip; never free text from operators; `Try again` reopens ACC-08 with failed items marked and passed items kept
  - SCR-ACC-46 [attempts exhausted]: after `KYC_MAX_ATTEMPTS` rejections; retry replaced by `acc.kyc.contact_support` with the case reference; no account closed automatically
  - SCR-ACC-46 [loading]: shows last known status from cache with `Updated {time}`; never empty
  - SCR-ACC-46 [offline]: last known status and reference ID readable; `Try again` works for capture only
  - SCR-ACC-47 [push]: `msg.acc.kyc_approved.push` or `msg.acc.kyc_action_needed.push`
  - SCR-ACC-47 [sms]: `msg.acc.kyc_approved.sms` or `msg.acc.kyc_action_needed.sms` with reference ID and a short reason code; sent if the app was not opened after the NTF delay
  - SCR-ACC-47 [delivery failed]: notification fails; screen still correct on next open
- Criteria map:
  - AC 1: SCR-ACC-46 [pending]
  - AC 2: SCR-ACC-46 [approved], [approved lower tier]
  - AC 3: SCR-ACC-46 [rejected]
  - AC 4: SCR-ACC-46 [attempts exhausted]
  - AC 5: no UI beyond SCR-ACC-46 [rejected] note, system rule (a rejection never lowers the tier or blocks withdrawals within the existing tier; a later approval by correction changes tier at once)
  - AC 6: SCR-ACC-46 [loading], [offline]
  - AC 7: SCR-ACC-47 [push], [sms]
  - AC 8: no UI, system rule (no ledger entry; Audit of status changes written by OPS-03)
  - AC 9: SCR-ACC-46 [pending], [approved], [rejected] (icon, word and colour; one-sentence reasons; no blame words)
  - AC 10: SCR-ACC-47 [delivery failed]; SCR-ACC-46 (never learn of a decision only by SMS)
- Objects and fields: Identity check (status Pending, Approved, Rejected; reference ID; reason codes; tier before and after; sent time; attempt count); User (tier); Notification; Audit entry.
- Open points:
  1. Where is the outcome of a PIN-reset or device-recovery case (ACC-04, ACC-05) shown? This screen is triggered from the profile for an ID check; the story does not say it covers those case types.
  2. The Malagasy wording of the 11 reasons is open with translators (ACC open question 9).
  3. Are retakes (Rejected with failed items marked) shown to the person as "rejected"? Statuses table says yes; criterion 3 shows `acc.kyc.rejected`; not specified whether a distinct retake wording exists.
  4. Delay before the SMS fallback is owned by NTF; not specified in the story.

---

### ACC-10 Be registered by a facilitator who helps me in person

- Story: ACC-10 Be registered by a facilitator who helps me in person
- Surfaces:
  - SCR-ACC-48 | Assisted start `acc.assist.start` ("Help someone sign up") | page | Member holding Group: invite member in at least one group | facilitator's account area | starts assisted session
  - SCR-ACC-49 | Assisted mode banner `acc.assist.mode` ("You are helping {name}") | inline | Facilitator and the person (every screen of the session) | assisted session open | none
  - SCR-ACC-50 | Assisted consent `acc.assist.consent` (person in the frame and agrees) | page | the person being registered | before the facilitator holds the camera | agree continues; refuse cancels
  - SCR-ACC-51 | Facilitator progress view ("Step 3 of 5, waiting for PIN", reference ID) | page | Facilitator (Group: invite member) | assisted session open | session close
  - SCR-ACC-52 | Assisted session outcomes (`err.acc.assist_limit`, `acc.assist.cancelled`) | page | Facilitator | limit reached, refusal or abandonment | support route
  - SCR-ACC-53 | Assist done notice `msg.acc.assist_done.push` (first name only) | notification | Facilitator | session completed | none
- States per surface:
  - SCR-ACC-48 [default]: facilitator signed in with Group: invite member; shows start button
  - SCR-ACC-48 [permission missing]: hidden for a member without Group: invite member in any group
  - SCR-ACC-48 [limit reached]: `ASSIST_MAX_SESSIONS_PER_DAY` reached; sees `err.acc.assist_limit` and the support route
  - SCR-ACC-49 [default]: banner on every screen of the session; facilitator can switch the screen language for the person without changing their own profile language
  - SCR-ACC-50 [default]: consent for the facilitator to hold the camera while the person is in frame
  - SCR-ACC-50 [refused]: person refuses consent; session closes Cancelled; facilitator sees `acc.assist.cancelled`
  - SCR-ACC-51 [default]: only progress and the reference ID; never OTP, PIN, selfie or ID images after upload
  - SCR-ACC-51 [offline]: capture and PIN steps start offline and resume; OTP step blocked with a reason; facilitator sees the number of pending cases; queued KYC photos follow XCT-05 cap and self-expiry
  - SCR-ACC-52 [abandoned]: no activity for `ASSIST_ABANDON_MINUTES`; session Cancelled; nothing created beyond an unverified phone number
  - SCR-ACC-52 [done]: session Done; account belongs to the person alone
  - SCR-ACC-53 [push]: `msg.acc.assist_done.push` with the first name only
- Criteria map:
  - AC 1: SCR-ACC-49 [default]; person's own steps reuse SCR-ACC-01, SCR-ACC-05, SCR-ACC-07, SCR-ACC-11 (PIN keypad handed over, digits never displayed; the person types the OTP received on their own phone)
  - AC 2: SCR-ACC-51 [default]; SCR-ACC-50 [default]
  - AC 3: no UI, system rule (account belongs to the person alone; facilitator gains no permission; `assisted_by` recorded on Consent record and Identity check)
  - AC 4: SCR-ACC-48 [limit reached]
  - AC 5: SCR-ACC-51 [offline]
  - AC 6: SCR-ACC-50 [refused]; SCR-ACC-52 [abandoned]
  - AC 7: SCR-ACC-53 [push]; the person receives the normal `msg.acc.otp.sms` and `msg.acc.kyc_submitted.sms` (SCR-ACC-09, SCR-ACC-45)
  - AC 8: no UI, system rule (no ledger entry; Audit on facilitator and person; operators can filter by `assisted_by` in OPS-02)
  - AC 9: SCR-ACC-49 [default] (language switch without changing own profile language); `Gereo never asks for your PIN or code` on SCR-ACC-11 in the person's language
- Objects and fields: User (facilitator and new person); Identity check (`assisted_by`); Consent record (facilitator); Audit entry (session events with device IDs and times); Assisted session (Open, Done, Cancelled).
- Open points:
  1. Whose phone runs the flow? The story text says "on their phone or mine" and the facilitator is signed in and taps `acc.assist.start`, while the closed open question says the flow "runs on the person's own phone with the facilitator beside them and the facilitator's account is not involved". Which is the rule?
  2. Criterion 1 says the person "types or says their number"; is voice input a feature? Not specified in the story.
  3. Is the facilitator's banner and progress view visible on the facilitator's phone if the flow runs on the person's phone? Depends on open point 1.
  4. Whether a facilitator may submit documents for someone present is not decided.
  5. Does the facilitator need Tier 1 only or any tier? Not specified in the story.

---

### ACC-11 See my connected devices and lock my account in an emergency

- Story: ACC-11 See my connected devices and lock my account in an emergency
- Surfaces:
  - SCR-ACC-54 | Connected devices `acc.devices.list` | page | Individual | profile, notification `This was not me`, sign-in screen lock link | `Sign out` per row; `acc.lock.lock_now` opens SCR-ACC-55
  - SCR-ACC-55 | Lock account `acc.lock.lock_now` (single action, text plus icon) | page | Individual | SCR-ACC-54 | PIN (or code from an unknown device), then SCR-ACC-56
  - SCR-ACC-56 | Lock confirmation (reference ID, how to unlock, persistent screen) | page | Individual | lock set | none
  - SCR-ACC-57 | Lock from sign-in `acc.lock.from_sign_in` (code only, lock only) | page | Individual who cannot sign in | link on sign-in screen | SCR-ACC-56
  - SCR-ACC-58 | Lock and unlock notices `msg.acc.locked` and `msg.acc.unlocked` (`.push`, `.sms`, Critical, direct SMS) | notification | Individual (remaining devices and the number) | lock or unlock set | none
  - SCR-ACC-59 | Unlock flow (code, PIN, selfie at Tier 2 and above, cooling) | page | Individual with a Locked account | sign-in attempt on a Locked account | account Active again
  - SCR-ACC-60 | Locked account effects and group marker (neutral "unavailable" marker, no reason) | system | other group members see the marker | account Locked | none
- States per surface:
  - SCR-ACC-54 [default]: per device: model name, first and last seen date and time, approximate place if known, `This device` marker, `Sign out`; reached after PIN entry
  - SCR-ACC-54 [offline]: readable from cache with last-synced time; lock needs a connection; sees `acc.offline.cannot_lock` and the support contact
  - SCR-ACC-54 [signed out]: after `Sign out`, that device's session ends on next contact; cache cleared next open (remote wipe); queued KYC photos deleted
  - SCR-ACC-55 [default]: single labelled action; asks the PIN (known device) or a code (unknown device)
  - SCR-ACC-56 [default]: persistent screen, not a toast; shows reference ID and how to unlock
  - SCR-ACC-57 [default]: code to the registered number only; can only lock, never unlock; reveals no account data
  - SCR-ACC-58 [push]: `msg.acc.locked.push` to remaining devices before cut off; `msg.acc.unlocked.push` on unlock
  - SCR-ACC-58 [sms]: `msg.acc.locked.sms` or `msg.acc.unlocked.sms` with reference and support route
  - SCR-ACC-59 [default]: needs code to registered number, PIN, selfie at Tier 2 and above, then the same `NEW_DEVICE_COOLING_HOURS` limits
  - SCR-ACC-59 [operator unlock]: support request (OPS-06) after identity checks; recorded with operator ID
  - SCR-ACC-60 [locked]: no sign-in, money-out, approval, spend initiation, ballot or PIN change; incoming money still posts, including rule-made money; contributions due recorded but not collected; group permissions unchanged; nothing already started is cancelled; locked holder counts as holder but not reachable holder
- Criteria map:
  - AC 1: SCR-ACC-54 [default]
  - AC 2: SCR-ACC-54 [signed out]
  - AC 3: SCR-ACC-55 [default]; SCR-ACC-56 [default] (all sessions end, queued items on any device dropped on contact, including KYC photos)
  - AC 4: SCR-ACC-60 [locked]
  - AC 5: SCR-ACC-59 [default], [operator unlock]
  - AC 6: SCR-ACC-57 [default]
  - AC 7: SCR-ACC-54 [offline]
  - AC 8: SCR-ACC-58 [push], [sms]
  - AC 9: no UI, system rule (no ledger entry on lock or unlock; Audit entries device signed out, lock set, unlock requested, unlock done, operator involvement)
  - AC 10: SCR-ACC-55 [default], SCR-ACC-56 [default] (button is the only action; confirmation is persistent)
- Objects and fields: User (account status Active, Locked); Device (model, first and last seen, place, `This device`, status Registered, Marked `new`, Signed out); Notification; Audit entry; Support ticket (operator unlock).
- Open points:
  1. Is the code-only lock of SCR-ACC-57 rate limited like OTP (ACC-02 caps)? A thief with the SIM can lock the owner repeatedly; the story accepts a short lockout but states no throttle.
  2. Is there a screen the owner sees on a Locked account that explains the status and starts unlock? Criterion 5 describes the rules but names no surface or key.
  3. A locked holder shows a neutral "unavailable" marker to the group; GRP-14 owns the group view. Is the marker the same word as for Inactive and Deactivated? The conventions say yes (no reason); the story does not name a key.
  4. Criterion 3 asks "a code to the phone" from an unknown device; is a PIN also needed there? The story says PIN or code, not both.
  5. Cache wipe on remote `Sign out` may be removed by the privacy review (open question in ACC-12); no fallback UI specified.

---

### ACC-12 Sign out, and be signed out safely when I stop using the app

- Story: ACC-12 Sign out, and be signed out safely when I stop using the app
- Surfaces:
  - SCR-ACC-61 | Sign-out confirmation `acc.session.confirm_sign_out` (one question) | modal | Individual | `acc.session.sign_out` | confirm returns to SCR-ACC-02 with language kept
  - SCR-ACC-62 | Unsent items warning `acc.session.unsent_items` (queued items, queued KYC photos, `Send first`, `Sign out and keep items`, `Sign out anyway`) | modal | Individual with unsent XCT-05 items | `acc.session.sign_out` when items are queued | chosen option
  - SCR-ACC-63 | Idle warning (at least 20 seconds notice, extend button) and app lock (PIN or biometric screen, SCR-ACC-13) | modal | Individual | `SESSION_IDLE_LOCK_MINUTES` of no use, or return from background after that time | extend, or unlock with SCR-ACC-13
  - SCR-ACC-64 | Signed out here `acc.session.signed_out_here` | inline | Individual | sign out without a connection to the server | none
  - SCR-ACC-65 | Hide previews setting `acc.session.hide_previews` (default on) | inline | Individual | account settings | toggle
  - SCR-ACC-66 | Session expiry | system | none | `SESSION_MAX_DAYS` elapsed | sign-in with code and PIN
- States per surface:
  - SCR-ACC-61 [default]: one question; confirm ends session, clears device cache per XCT-04 (balances, ledger, tokens, photos)
  - SCR-ACC-61 [offline]: works offline; clears the device and marks the session to end on next server contact; button never fails
  - SCR-ACC-62 [default]: sees the number of queued items and, separately, queued KYC photos; says KYC photos are deleted whatever the choice; three choices
  - SCR-ACC-63 [idle warning]: before lock; at least 20 seconds notice with a button to extend
  - SCR-ACC-63 [locked]: after the idle limit or return from background; PIN or biometric screen; announced to screen readers; reading screens and money-out both need unlock; cache stays on the device
  - SCR-ACC-64 [default]: server could not end the session; device cleared locally; note that other devices are managed in the device list (ACC-11)
  - SCR-ACC-65 [default]: previews hidden on the phone's lock screen by default
  - SCR-ACC-66 [expired]: after 30 days; sign in again with code and PIN (ACC-05 known-device path); money-out always needs the PIN
- Criteria map:
  - AC 1: SCR-ACC-61 [default]
  - AC 2: SCR-ACC-63 [locked]
  - AC 3: SCR-ACC-66 [expired]
  - AC 4: SCR-ACC-62 [default]
  - AC 5: SCR-ACC-61 [offline]
  - AC 6: SCR-ACC-65 [default] (balance hiding is WAL-19, not repeated)
  - AC 7: SCR-ACC-64 [default]
  - AC 8: no UI, system rule (Audit for sign out and session expiry; idle locks not audited)
  - AC 9: no UI, system rule (no ledger entry)
  - AC 10: SCR-ACC-63 [idle warning], [locked] (20 seconds notice, extend button, screen-reader announcement)
- Objects and fields: User; Device (session, cache, queue counts); Audit entry (sign out, session expiry); Notification preference `hide_previews`.
- Open points:
  1. Where does `acc.session.hide_previews` live in the interface (profile or notification settings)? The story says NTF-04 shows the same setting and this story owns it; no placement given.
  2. Does the idle warning appear when the app is in the foreground only? When the app returns from the background after the limit the lock shows at once with no warning; the story does not say so.
  3. Item counts in `acc.session.unsent_items` are separated for KYC photos; drafts in the local-drafts registry (XCT-05 Table B) are not queue items. Does sign out warn about unsent drafts? Not specified in the story.
  4. The remote cache wipe may be removed by the privacy review (open question); no alternative is specified.

---

### ACC-13 Read and agree to the terms and privacy notice in my language

- Story: ACC-13 Read and agree to the terms and privacy notice in my language
- Surfaces:
  - Reuses SCR-ACC-06 (consent summary, defined under ACC-02; also shown to a guest voter before the code is sent; the states below are added by this story)
  - SCR-ACC-67 | Full terms and privacy notice (`acc.consent.read_full`) | page | Visitor | link on SCR-ACC-06 | back
  - SCR-ACC-68 | Consent again screen (what changed) | page | Individual | next sign-in after a version is marked "needs consent again" | agree continues; until then read and export only
  - SCR-ACC-69 | Language note `acc.consent.language_note` | inline | Visitor | language without a reviewed legal translation | none
  - SCR-ACC-70 | My choices `acc.privacy.my_choices` (each consent with date and version; withdraw; entry to export and deletion) | page | Individual | profile | `acc.export.request` opens SCR-ACC-71; `acc.delete.start` opens SCR-ACC-75
- States per surface:
  - SCR-ACC-06 [default]: summary of at most 6 short lines (what we keep, why, who sees it in a group, how long, how to leave, who to contact), link to full text, one `acc.consent.agree` button; required item never pre-ticked
  - SCR-ACC-06 [declined]: not agreeing returns to the language screen; nothing sent
  - SCR-ACC-06 [save failed]: consent record cannot be saved; sees `err.acc.consent_not_saved` with `Try again`; no code sent, no partial account
  - SCR-ACC-06 [offline]: first consent needs a connection because it creates the account
  - SCR-ACC-06 [guest]: guest voter sees the same short summary and `acc.consent.agree` before the code is sent
  - SCR-ACC-06 [large font]: reflows at 200% font size; buttons at least 48 dp
  - SCR-ACC-67 [default]: full text in Malagasy, French or English as chosen; discloses Gereo income lines (Fee Gereo part, Rounding, Platform: SMS allowance), Tax as collected for the state, Rounding as the leftover under 1 ariary per destination credited to Gereo; names the freeze SMS and states Critical SMS ignore opt-out
  - SCR-ACC-67 [offline]: cached after first view, readable offline
  - SCR-ACC-68 [default]: marked only when a line type is added or the Rounding formula changes; shows what changed and asks again; read and export allowed, no money movement until agreed
  - SCR-ACC-69 [default]: reviewed language shown with `acc.consent.language_note`
  - SCR-ACC-70 [default]: lists each consent, including Consent records written by NTF-03, NTF-04, NTF-10, with date and version; optional ones withdrawn in one tap
  - SCR-ACC-70 [withdraw required]: explains the consequences and opens account deletion (ACC-15); never silently deletes
- Criteria map:
  - AC 1: SCR-ACC-06 [default], [declined]
  - AC 2: SCR-ACC-67 [default]; SCR-ACC-69 [default]
  - AC 3: SCR-ACC-06 [default]; SCR-ACC-70 [default] (separate items; required never pre-ticked; optional never bundled; security messages in item a)
  - AC 4: no UI, system rule (immutable Consent record: user, notice version, language, item, decision, time, device, facilitator)
  - AC 5: SCR-ACC-68 [default]
  - AC 6: SCR-ACC-70 [default], [withdraw required]
  - AC 7: SCR-ACC-67 [offline]; SCR-ACC-06 [offline]
  - AC 8: SCR-ACC-06 [save failed]
  - AC 9: no UI, system rule (no SMS, push or ledger entry; Audit entries consent given, withdrawn, re-asked, refused)
  - AC 10: SCR-ACC-06 [large font] (short sentences, 48 dp buttons, full text reflows at 200%)
- Objects and fields: Consent record (user, notice version, language, item, decision, time, device, facilitator); User; Audit entry.
- Open points:
  1. Criterion 3 says optional consent for non-essential notifications and SMS is "off by default", yet it also says the sign-up notice lists "SMS for important items" and "push opened-tracking" (R105 says SMS for important items is on at sign-up with a one-switch opt-out). Is the SMS-for-important-items consent on or off at sign-up, and is it an item the person actively ticks?
  2. Which reviewer and when approve each legal text language? The story defers to the product owner and a review; no timeline specified.
  3. Where is item (b), identity document processing, shown? See ACC-08 open point 1.
  4. A summary of "at most 6 short lines" must also carry the SMS and opened-tracking items (criterion 3); does that fit in 6 lines? Not specified in the story.
  5. Audio read-aloud hint is not in the MVP (closed); no UI.

---

### ACC-14 Export a copy of my data

- Story: ACC-14 Export a copy of my data
- Surfaces:
  - SCR-ACC-71 | Export request `acc.export.request` (content list, format choice: spreadsheet file or readable PDF) | page | Individual | button in SCR-ACC-70 | request opens SCR-ACC-72
  - SCR-ACC-72 | Export status (`acc.export.preparing` with request time and reference ID; `acc.export.ready` list; size in MB; mobile-data consent) | page | Individual | after request, push `msg.acc.export_ready` | download (PIN)
  - SCR-ACC-73 | Export ready notice `msg.acc.export_ready.push` | notification | Individual | export Ready | opens SCR-ACC-72
  - SCR-ACC-74 | Export file generator | system | none | request | none
- States per surface:
  - SCR-ACC-71 [default]: lists what the export contains (profile, consent history, device list, tier and verification history without photos, personal wallets and ledger entries, contributions and payments in groups, votes, expense requests, support tickets, Audit entries about my account); two format choices
  - SCR-ACC-71 [cooldown]: within `EXPORT_COOLDOWN_HOURS` of the last export; sees when the next is possible; last file stays downloadable
  - SCR-ACC-71 [offline]: sees `acc.offline.cannot_export`; request not possible; an already downloaded file stays readable
  - SCR-ACC-72 [preparing]: status Preparing; `acc.export.preparing` with request time and reference ID
  - SCR-ACC-72 [ready]: status Ready; file under `acc.export.ready` for `EXPORT_READY_DAYS`; download needs the PIN
  - SCR-ACC-72 [expired]: after `EXPORT_READY_DAYS`; file deleted; person asks again
  - SCR-ACC-72 [failed]: status Failed; `err.acc.export_failed` says nothing was lost; `Try again`; no partial file
  - SCR-ACC-72 [large file]: size in MB shown before download; asks for consent on mobile data (XCT-07)
  - SCR-ACC-72 [new account]: short file with only profile and consent history and a note that there is nothing else yet
  - SCR-ACC-73 [push]: `msg.acc.export_ready.push`; no SMS and no link in SMS
- Criteria map:
  - AC 1: SCR-ACC-71 [default]
  - AC 2: SCR-ACC-72 [preparing], [ready]
  - AC 3: no UI, system rule (other members' numbers masked `034 ** *** 12`, no KYC of others, votes cast by me included, content of secret votes of others excluded)
  - AC 4: no UI, system rule (integer ariary with code `MGA`, ISO dates with Madagascar offset, rule_name, rule_version, hop, caused_by_entry_id, Income label, Rounding and Fee rows separate)
  - AC 5: SCR-ACC-71 [cooldown]
  - AC 6: SCR-ACC-72 [new account], [large file]
  - AC 7: SCR-ACC-72 [failed]; SCR-ACC-71 [offline]
  - AC 8: SCR-ACC-73 [push]
  - AC 9: no UI, system rule (no ledger entry; Audit entries export requested, generated, downloaded, expired)
  - AC 10: no UI beyond SCR-ACC-72 [ready] (PDF real text in profile language; spreadsheet headers in profile language with technical names in a second row)
- Objects and fields: Export (Preparing, Ready, Expired, Failed; reference ID; request time; format; size); User; Consent record; Device; Identity check (status only); Ledger entry (own); Contribution; Ballot; Support ticket; Audit entry.
- Open points:
  1. The export includes "my votes", but anonymous plain votes remove the answer-to-person link at close (R40). Does the export contain only the fact of participation for those votes, or the answer? Not specified in the story.
  2. Where does `acc.export.request` appear if the Individual has no wallets (new account)? The story covers the file content only.
  3. Criterion 6 mentions the file note for a new account; the key for that note is not specified.
  4. Does a locked account (ACC-11) or a person who has not re-consented (ACC-13 criterion 5 allows export) have the same access? ACC-13 allows export; ACC-11 forbids sign-in on a Locked account.

---

### ACC-15 Delete my account, and be told what stops me

- Story: ACC-15 Delete my account, and be told what stops me
- Surfaces:
  - SCR-ACC-75 | Deletion checklist `acc.delete.checklist` (rows with `Blocking` or `Done`, plain sentence, button to the fixing place; `acc.delete.approvals_note`) | page | Individual (PIN known) | `acc.delete.start` in SCR-ACC-70 | `acc.delete.confirm` opens SCR-ACC-76
  - SCR-ACC-76 | Deletion confirm (repeats what is deleted and what is kept; code and PIN) | page | Individual | `acc.delete.confirm` | status Deleting; opens SCR-ACC-78
  - SCR-ACC-77 | Deleting state (account in grace period; sign-in cancels) | inline | Individual with status Deleting | sign-in during the grace period | cancel deletion by signing in
  - SCR-ACC-78 | Deletion notices `msg.acc.delete_started` (`.push`, `.sms`, Critical, hostile-deletion alarm), `msg.acc.delete_done.sms`, and `msg.grp.member_left.push` (owned by GRP-16) | notification | Individual; holders of Group: remove member and Wallet: approve spend | deletion started, completed | none
  - SCR-ACC-79 | Deletion engine (grace period, recheck, close personal wallets, end rules, anonymise) | system | none | `DELETE_GRACE_DAYS` elapsed | none
  - SCR-ACC-80 | Deleted member label `acc.deleted.member` | inline | other group members | after deletion completes | none
- States per surface:
  - SCR-ACC-75 [default]: checklist built live; each blocker has icon plus word and a button to the fix; `acc.delete.confirm` enabled when none remain
  - SCR-ACC-75 [blocked]: any of: personal wallet balance above 0 Ar; transaction in Initiated, Pending or Needs attention; due or overdue contribution or amount owed recorded at leave (GRP-16); open expense request created by the person; leaving a group below the GRP-14 holder minima for a group wallet that holds money or has money in flight; money owed to them from a group (split share, unpaid refund); each blocker names the group or wallet and links to the fixing story
  - SCR-ACC-75 [non-blockers]: member of a group, past votes and contributions; sees `acc.delete.approvals_note` (pending approvals voided, remaining approvers told; cast ballots stay counted)
  - SCR-ACC-75 [offline]: no connection; sees `acc.offline.cannot_delete`; never shown from cache as "all done"
  - SCR-ACC-75 [refreshed]: blocker appears between checklist and confirm; checklist refreshes
  - SCR-ACC-76 [default]: confirm with code and PIN; plain-words summary of deleted and kept
  - SCR-ACC-76 [blocked now]: blocker appeared; confirm fails with `err.acc.delete_blocked_now`; nothing deleted
  - SCR-ACC-77 [grace]: status Deleting for `DELETE_GRACE_DAYS` (30); the person's rules paused (and rules of others targeting their wallets); signing in cancels deletion and resumes rules
  - SCR-ACC-78 [started]: push and SMS with cancel instructions and the date
  - SCR-ACC-78 [done]: `msg.acc.delete_done.sms`
  - SCR-ACC-78 [member left]: `msg.grp.member_left.push` to holders without the reason
  - SCR-ACC-79 [recheck failed]: at the end of grace, a balance appeared; deletion stops; sees `err.acc.delete_blocked_now`
  - SCR-ACC-79 [completed]: profile, name, phone, devices and photos deleted or anonymised; ledger and transactions kept pseudonymised for `RECORD_RETENTION_YEARS`; Audit for `AUDIT_RETENTION_YEARS`; personal wallets closed with the WAL-05 action; rules ended
  - SCR-ACC-80 [default]: past votes and contributions show `acc.deleted.member`
- Criteria map:
  - AC 1: SCR-ACC-75 [default]
  - AC 2: SCR-ACC-75 [blocked]
  - AC 3: SCR-ACC-75 [non-blockers]
  - AC 4: SCR-ACC-76 [default]; SCR-ACC-77 [grace]; SCR-ACC-79 [completed]; SCR-ACC-80 [default]
  - AC 5: SCR-ACC-77 [grace]; SCR-ACC-79 [recheck failed], [completed] (no ledger entry written or edited; rules paused and ended)
  - AC 6: SCR-ACC-75 [offline]
  - AC 7: SCR-ACC-75 [refreshed]; SCR-ACC-76 [blocked now]
  - AC 8: SCR-ACC-78 [started], [done], [member left]
  - AC 9: no UI, system rule (Audit entries requested, blockers at that time, cancelled, completed, anonymised counts only; kept)
  - AC 10: SCR-ACC-75 [default], SCR-ACC-76 [default] (plain list, one action per row, confirm repeats deleted and kept)
- Objects and fields: User (status Deleting, Deleted); Wallet (balance, closed); Wallet rule (paused, ended); Transaction (status); Contribution; Membership; Expense request; Audit entry; Consent record.
- Open points:
  1. Deleting state: can a person with status Deleting use the app fully until the grace ends, or only cancel? "Sign-in during the period is possible and cancels the deletion" implies full sign-in; money-out while Deleting is not addressed.
  2. Which `msg.*` key tells owners of rules that target the person's wallets that their rule was paused (RUL-06)? Not specified in the story.
  3. The blockers list quotes holder minima from GRP-14 for four permissions; what the person sees when a permission minimum is satisfied by a locked or Inactive holder is not specified.
  4. Retention after deletion depends on `RECORD_RETENTION_YEARS` and ACC open question 1; the legal binding on Gereo is not decided by the story.
  5. After deletion completes, may the same phone number sign up again? Not specified in the story.

---

### ACC-16 Open an invite or vote link without an account

- Story: ACC-16 Open an invite or vote link without an account
- Surfaces:
  - SCR-ACC-81 | Invite link page (group name, inviter's display name, member count, `acc.link.join_group`, language switch of ACC-01) | page | Visitor (link holder) | invite link in SMS or share card | join starts the join flow (GRP-04)
  - SCR-ACC-82 | Vote link page (group name, who asked, closing time absolute and relative with zone, `acc.link.vote_now`) | page | Guest voter | vote link in SMS or share card | `acc.link.vote_now` opens phone verification (SCR-ACC-05 and SCR-ACC-07 without PIN) then the VOT-04 ballot screen
  - SCR-ACC-83 | Link problem pages (`err.acc.link_not_for_you`, `err.acc.link_expired`, `err.acc.link_cancelled`, `acc.link.vote_closed`, generic invalid) | page | Visitor, guest voter | link not usable | contact route to the sender
  - SCR-ACC-84 | Create full account offer `acc.link.create_full_account` with `Not now` | inline | Guest voter after voting | after ballot cast | `acc.link.create_full_account` opens SCR-ACC-11
  - SCR-ACC-85 | Link SMS `msg.acc.invite_link.sms`, `msg.acc.vote_link.sms` | notification (SMS) | Visitor, guest voter (recipient) | invite or vote sent | opens link
  - SCR-ACC-86 | Guest session limiter | system | none | verified guest | none
- States per surface:
  - SCR-ACC-81 [default]: language of the link or device language; no balances or ledger before joining
  - SCR-ACC-81 [offline]: shows what was loaded; `acc.link.needs_connection` for the step that needs one; never blank
  - SCR-ACC-81 [large font]: 200% text; unaltered question and options
  - SCR-ACC-82 [default]: before verification only group name, who asked and closing time; question and options appear after the number is verified as eligible
  - SCR-ACC-82 [verified]: verified number, eligible; guest session limited to that vote; ballot screen belongs to VOT-04 and VOT-06
  - SCR-ACC-82 [not eligible]: number not on the list; `err.acc.link_not_for_you` ("This link is not for this number. Ask the sender.") with only the group name
  - SCR-ACC-82 [offline]: shows what loaded; `acc.link.needs_connection`
  - SCR-ACC-82 [large font]: options are buttons of at least 56 dp; deadline as a sentence for screen readers
  - SCR-ACC-83 [expired]: `err.acc.link_expired`
  - SCR-ACC-83 [cancelled]: `err.acc.link_cancelled`
  - SCR-ACC-83 [vote closed]: `acc.link.vote_closed` with result summary for eligible people (VOT-06 criterion 5)
  - SCR-ACC-83 [invalid]: generic friendly error, no stack trace or identifier
  - SCR-ACC-84 [default]: after voting, `acc.link.create_full_account` and `Not now` of equal weight; a guest can become a full account without redoing the code
  - SCR-ACC-85 [sms]: sender name, object name (truncated to a configurable length), deadline for votes, short link (XCT-12)
  - SCR-ACC-86 [limited]: guest session cannot see wallets or other groups
- Criteria map:
  - AC 1: SCR-ACC-81 [default]
  - AC 2: SCR-ACC-82 [default], [verified]
  - AC 3: SCR-ACC-84 [default]; SCR-ACC-86 [limited]
  - AC 4: SCR-ACC-82 [not eligible]
  - AC 5: SCR-ACC-83 [expired], [cancelled], [vote closed], [invalid]
  - AC 6: SCR-ACC-81 [offline], SCR-ACC-82 [offline] (lightweight, text first; a tier ladder shown from this page is cached with last-synced time and limits start date)
  - AC 7: SCR-ACC-81 [default], SCR-ACC-82 [default] (sender name, `Gereo never asks for your PIN or code`, opaque token, revocable, single-purpose)
  - AC 8: SCR-ACC-85 [sms]
  - AC 9: no UI, system rule (no ledger entry; Audit entries link opened (counted), phone verified, joined or voted, with token ID, device, time)
  - AC 10: SCR-ACC-82 [large font]
- Objects and fields: Invitation (link token); User (guest); Vote; Ballot; Membership; Notification; Audit entry; Consent record (summary shown, ACC-13).
- Open points:
  1. Joining needs "only phone and OTP" in conventions section 2, but ACC-02 criterion 3 creates an account in Pending PIN where nothing else is reachable until PIN is set. Does joining from an invite link require setting a PIN before the person is a member?
  2. Does the invite page show the consent summary before the code (guest only gets it for votes per ACC-13 open question)? Not specified for invite joins.
  3. Does the vote link page ever show the group's member count or contribution plan (09 section 5.3 suggests an invite preview with rules)? ACC-16 limits it to name, inviter, count; GRP-04 owns the rest.
  4. Event links are not covered (guest RSVP is Later); the empty or invalid state for an event link is not specified.
  5. Which keys name the guest result view and the result summary (VOT-06)? Not specified here.

---

## Epic summary

- Stories: 16.
- Distinct surfaces: 86. By kind:
  - page: 45
  - sheet: 1
  - modal: 6
  - inline: 13
  - notification: 11
  - system: 10
- State lines: 198.
- Open points: 79. Full list:
  - ACC-01.1: ACC-01 precondition says the first screen shows "after sign-out on a device with no saved language", but ACC-12 criterion 1 returns to the welcome screen "with the language kept". Which wins after a normal sign-out (language screen or welcome screen)?
  - ACC-01.2: What does `Not now` do on SCR-ACC-04 (stay on the screen that opened it, or go back to the example home)? Not specified in the story.
  - ACC-01.3: Are amounts in the example group in a realistic range for Madagascar? The story keeps this open pending field research; no values are specified.
  - ACC-01.4: Is the example group reachable again once an account exists (for example from Help)? Not specified in the story.
  - ACC-02.1: "After the third send, `acc.otp.get_help` appears" while the parameter table says three resends (30, 60, 120 seconds), which is four sends. Is help shown after the third or the fourth SMS?
  - ACC-02.2: What does "Sign in" do with a number that has no account, given the screen must never reveal whether an account exists? Not specified in the story.
  - ACC-02.3: What does "Create account" do with a number that already has an account? Not specified in the story.
  - ACC-02.4: Which message key is shown when a used or superseded code is entered? Not specified in the story.
  - ACC-02.5: Which key and which fields does OTP help use? Not specified in the story (OPS-06 owns the request).
  - ACC-02.6: Sender name and whether it is allowed for OTP traffic is open with the SMS aggregator (default `Gereo`, numeric fallback).
  - ACC-02.7: Is the "Wrong number? Change" text a key? Not specified in the story.
  - ACC-03.1: The trigger says "PIN change from the profile (ACC-06)" and criterion 4 says the biometric offer "can be made again in the profile", but ACC-06 criterion 1 lists no Change PIN control and no biometric toggle. Where do these two controls live?
  - ACC-03.2: Does a PIN change from the profile ask for the current PIN first? Not specified in the story.
  - ACC-03.3: The weak-PIN list is configuration with a starting list of three patterns; is the phone-number match checked against the last 4 digits or more? Not specified in the story ("last digits").
  - ACC-03.4: During `NEW_DEVICE_COOLING_HOURS` a PIN change is blocked (ACC-05); which message does SCR-ACC-11 show then? Not specified in the story.
  - ACC-04.1: For Tier 2 and above, is the person signed in on this device while the case is in review, or locked out until the operator decides? Not specified in the story.
  - ACC-04.2: If the operator rejects a PIN-reset selfie, where does the person see the reasons? ACC-09 covers ID verification only; `err.acc.selfie_too_dark` is described as an immediate device check. Not specified in the story.
  - ACC-04.3: May a locked account (ACC-11) use Forgot PIN? ACC-11 says no PIN change while Locked; the story does not say what the reset flow shows then.
  - ACC-04.4: Which key is used for the reset confirmation screen and for the "Forgot my PIN" label on the lock-out screen (`acc.pin.forgot` is named only as the trigger)? Not specified in the story.
  - ACC-04.5: Does the retake request counted as an attempt (statuses table) count toward `KYC_MAX_ATTEMPTS` for a PIN reset case? The statuses table says a retake is a Rejected result and counts; not stated for reset cases.
  - ACC-05.1: Criterion 3 says first-time payee, large amount and PIN change are "blocked or require extra confirmation". Which is it for each, and what is the confirmation? Not specified in the story (pause screen belongs to WAL-10).
  - ACC-05.2: At Tier 2 and above the selfie is reviewed by an operator before the device is registered. What does the person see and can they use the account elsewhere while waiting? Not specified in the story.
  - ACC-05.3: What is the new-device money-out limit amount? TBD, owned by OPS-11.
  - ACC-05.4: Is there an SIM-swap signal from the mobile operators? Open with the operators; default is none.
  - ACC-05.5: If the account has no other device, `msg.acc.new_device.push` has no recipient; is the SMS the only alert? The story implies it but does not say.
  - ACC-05.6: Does `This was not me` need any authentication before it opens the emergency lock? Not specified here; ACC-11 criterion 3 covers the lock itself.
  - ACC-06.1: Reserved names: criterion 2 lists `Gereo` and `Support`; the open question lists `Gereo`, `Support` and `Admin`. Which is the starting list?
  - ACC-06.2: Where do Change PIN, biometric on or off, devices, privacy choices and sign out live relative to the profile? Criterion 1 lists none of them (other stories use `acc.devices.list`, `acc.privacy.my_choices`, `acc.session.sign_out`).
  - ACC-06.3: Does language change work offline? Criterion 7 blocks profile edits offline, while ACC-01 stores language on the device. Not specified in the story.
  - ACC-06.4: After a number change all devices are signed out and cooling starts; which screen does the person see on the old number's device? Not specified in the story.
  - ACC-06.5: ACC-01 criterion 7 keeps the language list on the welcome screen only; is a language choice also in the profile for signed-in users (criterion 4 implies yes)? Confirmed by the story only for the profile.
  - ACC-07.1: What is `{minutes}` in `acc.tiers.limit_hit`? Not specified in the story.
  - ACC-07.2: Criterion 7: `Verify now` is "disabled offline with a reason except for capturing photos". Does that mean the button works offline for capture only, or is disabled while capture is reachable elsewhere? Not specified.
  - ACC-07.3: The Malagasy word for Level is open with translators (ACC open question 9).
  - ACC-07.4: When a group wallet has its own OPS-11 limits, how many lines appear and in which order on the ladder? Not specified in the story.
  - ACC-07.5: "Money-out limit may be zero; value TBD" at Tier 1: what does the ladder show for a zero limit? Not specified.
  - ACC-08.1: ACC-13 criterion 3 says the identity-document consent (b) is asked at ACC-08, and the precondition says it is recorded, but none of the five steps is a consent step. Where is it asked?
  - ACC-08.2: How is minimum age determined (date of birth typed, read from the document, or the operator)? `err.acc.kyc_underage` is named but no input for age is specified.
  - ACC-08.3: Blur, glare and darkness thresholds and the compression size are "configurable"; no values specified.
  - ACC-08.4: Does "Step n of 5" apply to a selfie-only flow in ACC-04, ACC-05 and ACC-11? Not specified in the story.
  - ACC-08.5: Which text shows when queued photos self-expire after `QUEUE_KYC_MAX_DAYS` (3)? Owned by XCT-05; not specified here.
  - ACC-08.6: Selfie reviewed by an operator with no automatic match (`KYC_AUTO_MATCH_ENABLED` off): does the person see any liveness check beyond live capture? The story says live capture is the liveness; no further UI.
  - ACC-09.1: Where is the outcome of a PIN-reset or device-recovery case (ACC-04, ACC-05) shown? This screen is triggered from the profile for an ID check; the story does not say it covers those case types.
  - ACC-09.2: The Malagasy wording of the 11 reasons is open with translators (ACC open question 9).
  - ACC-09.3: Are retakes (Rejected with failed items marked) shown to the person as "rejected"? Statuses table says yes; criterion 3 shows `acc.kyc.rejected`; not specified whether a distinct retake wording exists.
  - ACC-09.4: Delay before the SMS fallback is owned by NTF; not specified in the story.
  - ACC-10.1: Whose phone runs the flow? The story text says "on their phone or mine" and the facilitator is signed in and taps `acc.assist.start`, while the closed open question says the flow "runs on the person's own phone with the facilitator beside them and the facilitator's account is not involved". Which is the rule?
  - ACC-10.2: Criterion 1 says the person "types or says their number"; is voice input a feature? Not specified in the story.
  - ACC-10.3: Is the facilitator's banner and progress view visible on the facilitator's phone if the flow runs on the person's phone? Depends on open point 1.
  - ACC-10.4: Whether a facilitator may submit documents for someone present is not decided.
  - ACC-10.5: Does the facilitator need Tier 1 only or any tier? Not specified in the story.
  - ACC-11.1: Is the code-only lock of SCR-ACC-57 rate limited like OTP (ACC-02 caps)? A thief with the SIM can lock the owner repeatedly; the story accepts a short lockout but states no throttle.
  - ACC-11.2: Is there a screen the owner sees on a Locked account that explains the status and starts unlock? Criterion 5 describes the rules but names no surface or key.
  - ACC-11.3: A locked holder shows a neutral "unavailable" marker to the group; GRP-14 owns the group view. Is the marker the same word as for Inactive and Deactivated? The conventions say yes (no reason); the story does not name a key.
  - ACC-11.4: Criterion 3 asks "a code to the phone" from an unknown device; is a PIN also needed there? The story says PIN or code, not both.
  - ACC-11.5: Cache wipe on remote `Sign out` may be removed by the privacy review (open question in ACC-12); no fallback UI specified.
  - ACC-12.1: Where does `acc.session.hide_previews` live in the interface (profile or notification settings)? The story says NTF-04 shows the same setting and this story owns it; no placement given.
  - ACC-12.2: Does the idle warning appear when the app is in the foreground only? When the app returns from the background after the limit the lock shows at once with no warning; the story does not say so.
  - ACC-12.3: Item counts in `acc.session.unsent_items` are separated for KYC photos; drafts in the local-drafts registry (XCT-05 Table B) are not queue items. Does sign out warn about unsent drafts? Not specified in the story.
  - ACC-12.4: The remote cache wipe may be removed by the privacy review (open question); no alternative is specified.
  - ACC-13.1: Criterion 3 says optional consent for non-essential notifications and SMS is "off by default", yet it also says the sign-up notice lists "SMS for important items" and "push opened-tracking" (R105 says SMS for important items is on at sign-up with a one-switch opt-out). Is the SMS-for-important-items consent on or off at sign-up, and is it an item the person actively ticks?
  - ACC-13.2: Which reviewer and when approve each legal text language? The story defers to the product owner and a review; no timeline specified.
  - ACC-13.3: Where is item (b), identity document processing, shown? See ACC-08 open point 1.
  - ACC-13.4: A summary of "at most 6 short lines" must also carry the SMS and opened-tracking items (criterion 3); does that fit in 6 lines? Not specified in the story.
  - ACC-13.5: Audio read-aloud hint is not in the MVP (closed); no UI.
  - ACC-14.1: The export includes "my votes", but anonymous plain votes remove the answer-to-person link at close (R40). Does the export contain only the fact of participation for those votes, or the answer? Not specified in the story.
  - ACC-14.2: Where does `acc.export.request` appear if the Individual has no wallets (new account)? The story covers the file content only.
  - ACC-14.3: Criterion 6 mentions the file note for a new account; the key for that note is not specified.
  - ACC-14.4: Does a locked account (ACC-11) or a person who has not re-consented (ACC-13 criterion 5 allows export) have the same access? ACC-13 allows export; ACC-11 forbids sign-in on a Locked account.
  - ACC-15.1: Deleting state: can a person with status Deleting use the app fully until the grace ends, or only cancel? "Sign-in during the period is possible and cancels the deletion" implies full sign-in; money-out while Deleting is not addressed.
  - ACC-15.2: Which `msg.*` key tells owners of rules that target the person's wallets that their rule was paused (RUL-06)? Not specified in the story.
  - ACC-15.3: The blockers list quotes holder minima from GRP-14 for four permissions; what the person sees when a permission minimum is satisfied by a locked or Inactive holder is not specified.
  - ACC-15.4: Retention after deletion depends on `RECORD_RETENTION_YEARS` and ACC open question 1; the legal binding on Gereo is not decided by the story.
  - ACC-15.5: After deletion completes, may the same phone number sign up again? Not specified in the story.
  - ACC-16.1: Joining needs "only phone and OTP" in conventions section 2, but ACC-02 criterion 3 creates an account in Pending PIN where nothing else is reachable until PIN is set. Does joining from an invite link require setting a PIN before the person is a member?
  - ACC-16.2: Does the invite page show the consent summary before the code (guest only gets it for votes per ACC-13 open question)? Not specified for invite joins.
  - ACC-16.3: Does the vote link page ever show the group's member count or contribution plan (09 section 5.3 suggests an invite preview with rules)? ACC-16 limits it to name, inviter, count; GRP-04 owns the rest.
  - ACC-16.4: Event links are not covered (guest RSVP is Later); the empty or invalid state for an event link is not specified.
  - ACC-16.5: Which keys name the guest result view and the result summary (VOT-06)? Not specified here.
