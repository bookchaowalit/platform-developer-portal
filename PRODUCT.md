# Product: platform-developer-portal

## What it is

A Backstage developer portal (app + backend) meant to become the software
catalog, scaffolder, TechDocs and search for the Solo Empire repositories.
Today it is still close to the upstream Backstage scaffold.

## Who it is for

The owner only (a one-person team). There are no other users.

## What works today

- The Backstage app and backend start locally with `yarn start` (app on :3000,
  backend on :7007, SQLite in memory).
- The catalog loads only the example entities in `examples/` (example
  components, org and one example scaffolder template). No real Solo Empire
  entities are registered yet.
- Sign-in: guest in development; GitHub OAuth only in the production config.
  The production resolver needs a catalog `User` entity named after the
  GitHub login, which does not exist yet.
- Tests: backend config and route-access tests, frontend sign-in and app
  tests (Jest via `backstage-cli`), and a Playwright smoke test that is not
  run in CI.
- CI (`.github/workflows/ci.yml`): immutable Yarn install, `yarn tsc` (strict),
  lint, Prettier, unit tests, backend bundle build, plus the shared
  `security.yml` workflow.

## How it runs and deploys

It runs only on the owner's machine. `packages/backend/Dockerfile` is the
upstream Backstage image recipe; no image is built or pushed, and there is no
Railway, Vercel or other hosted deployment, no live URL, and no deploy
workflow. `app-config.production.yaml` describes a future hosted setup
(Postgres and GitHub OAuth from environment variables) that has not been
provisioned.

Sentry waiver: not deployed anywhere; it runs only locally on loopback, so there is no hosted runtime to report errors from. Add @sentry/node to the backend before any hosted deploy.

## Limits

- Example catalog data and a placeholder owner (`john@example.com`) in
  `catalog-info.yaml`.
- Allow-all permission policy (fine only while there are no non-guest users).
- No custom plugins.

## Status

Prototype / scaffold. Backlog in `docs/UPGRADE-PLAN.md`.
