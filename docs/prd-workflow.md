# LawnStarter PoC: plan

## Order

1. Renato takes the screenshots of both apps and puts them in `screenshots/` (folders below)
2. Run the skill in this directory to generate `PRD.md` from the screenshots
3. Renato reviews the PRD (app names, stack, scope)
4. New repo for the clone, with the PRD and screenshots inside `poc/`
5. Add the superpowers skill set to the repo and init `CLAUDE.md` with information about using it
6. Renato works inside the repo with superpowers to break `PRD.md` into tickets and implementation plans, which generate GitHub issues
7. Renato uses superpowers to implement the tickets and build the project, with e2e and integration tests

## Screenshot shot list

Two apps on the App Store, one folder each:

- **LawnStarter** (customer) → `screenshots/clients-app/`, referenced in the PRD as `C01`, `C02`...
- **LawnStarter for Providers** (pro) → `screenshots/providers-app/`, referenced as `P01`, `P02`...
