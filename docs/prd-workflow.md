# LawnStarter PoC: plan

## Order

1. Renato takes the screenshots (shot list below) and puts them in `screenshots/`
2. Run the skill in this directory to generate `PRD.md` from the screenshots
3. Renato reviews the PRD (app name, stack, scope)
4. New repo for the clone, with the PRD and screenshots inside `poc/`, and the agent builds it
5. Polish, with each request written down word for word in `FEATURES.md`
6. Web deploy on Vercel, a short Loom video, and a README with the no-affiliation notice
7. Publish the skill (public repo and a post) and apply on Workable with both links
8. Find an EM or engineer at LawnStarter on LinkedIn and send them the link directly

## Screenshot shot list

App: **LawnStarter** on the App Store (the customer app, not "LawnStarter for Providers").

**Rules**
- Name files in flow order, with two digits: `01-onboarding-welcome.png`, `02-address-entry.png`...
- One screen per file. If the screen scrolls, take one shot per fold (`14-quote-1.png`, `14-quote-2.png`)
- Capture the empty state *and* the filled state when both exist
- Capture the loading states too if there's time (skeleton, spinner). They go into the clone
- If you can, record a screen video of the whole flow (`flow.mov`), because animations and transitions don't show in a screenshot
- **Don't pay for anything and don't book a real service.** Stop at checkout. Creating the account and signing in is up to you
- The price comes from a US address (they measure the lot by satellite). Any public residential address works just to see the quote

**Screens, in order**

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

Whatever can't be seen without a booked service (assigned pro, photos, rating) can come from screenshots of the App Store page or the website. In that case, save them in `screenshots/appstore/` with the same numbering scheme.
