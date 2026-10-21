# LawnStarter PoC: plan

## Order

1. Took screenshots and videos of both Lawnstarter apps and put them in `screenshots/` (separated by app)
2. Discussed with an agent that I wanted to build a turbo monorepo with 2 apps to clone the 2 apps in the `screenshots/` folder. Also sent the links to the store apps and website of LawnStarter so the agent could understand what the company does
3. Explained the architecture (libraries, system design, e2e with Maestro, integration tests with Jest, using react-native-web to generate a web build to be able to host at vercel) I wanted to use and asked the agent to create a [PRD](../PRD.md) to recreate the features on the screenshots using this stack
4. Reviewed the generated [PRD](../PRD.md) (app names, stack, scope), made the necessary changes to it (updated things the agent didn't get right, decided some more libraries we could use, reviewed the architecture of the project)
5. Created a new repo for the clone, with the [PRD](../PRD.md) and screenshots inside `poc/`
6. Added the superpowers skill set to the repo and init `CLAUDE.md` with information about using it
7. Worked inside the repo with superpowers to break [`PRD.md`](../PRD.md) into tickets and implementation plans, which generated [GitHub issues](https://github.com/sagits/Mowly/issues)
8. Used superpowers to implement the issues and build the project, with e2e and integration tests

## Screenshot shot list

Two apps on the App Store, one folder each:

- **LawnStarter** (customer) → `screenshots/clients-app/`, referenced in the PRD as `C01`, `C02`...
- **LawnStarter for Providers** (pro) → `screenshots/providers-app/`, referenced as `P01`, `P02`...
