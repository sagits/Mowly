# LawnStarter PoC: plan

## Order

1. Renato takes the screenshots of both apps (shot lists below) and puts them in `screenshots/`
2. Run the skill in this directory to generate `PRD.md` from the screenshots
3. Renato reviews the PRD (app names, stack, scope)
4. New repo for the clone, with the PRD and screenshots inside `poc/`
5. Add the superpowers skill set to the repo and init `CLAUDE.md` with information about using it
6. Renato works inside the repo with superpowers to break `PRD.md` into tickets and implementation plans, which generate GitHub issues
7. Renato uses superpowers to implement the tickets and build the project, with e2e and integration tests
8. Polish, with each request written down word for word in `FEATURES.md`
9. Web deploy on Vercel, a short Loom video, and a README with the no-affiliation notice
10. Publish the skill (public repo and a post) and apply on Workable with both links
11. Find an EM or engineer at LawnStarter on LinkedIn and send them the link directly

## Screenshot shot list

Two apps on the App Store, one folder each:

- **LawnStarter** (customer) → `screenshots/clients-app/`, referenced in the PRD as `C01`, `C02`...
- **LawnStarter for Providers** (pro) → `screenshots/providers-app/`, referenced as `P01`, `P02`...

**Rules**
- Name files in flow order, with two digits: `01-onboarding-welcome.png`, `02-address-entry.png`...
- One screen per file. If the screen scrolls, take one shot per fold (`14-quote-1.png`, `14-quote-2.png`)
- Capture the empty state *and* the filled state when both exist
- Capture the loading states too if there's time (skeleton, spinner). They go into the clone
- If you can, record a screen video of the whole flow (`flow.mov`), because animations and transitions don't show in a screenshot. Frames pulled from a recording are fine as screenshots
- **Don't pay for anything and don't book a real service.** Stop at checkout. Creating the account and signing in is up to you
- The price comes from a US address (they measure the lot by satellite). Any public residential address works just to see the quote
- **Don't enter real tax or bank data in the provider app.** Capture those screens empty or as far as they go without it. Skip any frame that shows personal data

**Customer app screens, in order**

| # | Flow | What to capture |
|---|---|---|
| 01–03 | Opening | Splash, welcome/onboarding, sign in/sign up screen (the screen only, no data) |
| 04–05 | Address | Address field, autocomplete open, map/satellite confirmation |
| 06–08 | Services | Service list/catalog (mowing, leaf removal, bush trimming...), one service's detail |
| 09–12 | Quote | Instant price, frequency choice (weekly, every two weeks, one-time), add-ons, lawn size |
| 13–15 | Scheduling | Calendar/date of the first service, notes for the pro (gate, dog), summary |
| 16 | Checkout | Payment screen **left empty**. Layout only |
| 17–20 | Signed-in home | Dashboard: upcoming services, empty state, banners/promos |
| 21–23 | Scheduled service | Service detail, assigned pro (profile, rating, reviews), status |
| 24–25 | After the service | History, photos of the finished job, rate the pro, tip (skip whatever needs a completed service) |
| 26–27 | Messages | Conversation list and chat with the pro |
| 28–30 | Account | Profile, properties/addresses, payment methods (list, no data), refer a friend, settings |
| 31+ | Extra | Any screen that doesn't fit above: notifications, help, cross-sell of other services |

**Provider app screens, in order**

| # | Flow | What to capture |
|---|---|---|
| 01–02 | Auth | Welcome carousel (each slide), sign in screen (empty) |
| 03–05 | Sign up | Sign up form empty, category picker open, category picked with its core skills |
| 06–07 | Dashboard | Onboarding checklist (which items are done, which are locked), drawer menu open |
| 08–09 | Profile | "Build a winning profile" intro and its form |
| 10–13 | Jobs | Available jobs (map + job list, day filter), calendar with job counts, recommend a service, today's route map |
| 14 | Support | Support screen |
| 15–16 | Settings | Settings list, business profile form |
| 17–19 | Get paid | Damage fee, tax info form (empty), connect bank account (not linked) |
| 20 | Billing | Account balance and activity (empty is fine) |
| 21–22 | Work area | Work area / starting point, turn on GPS |
| 23–25 | Account | Notification preferences, account management, sign out confirmation |
| 26+ | Extra | Any drawer section not above: skills and services, crews, inbox, customer search, performance |

Whatever can't be seen without a booked service or a claimed job (assigned pro, photos, rating, the jobs map with real jobs) can come from screenshots of the App Store page or the website. In that case, save them in the app's folder with the same numbering scheme and note that they are store shots.
