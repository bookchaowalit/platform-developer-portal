# ADR-0003 — Guest sign-in for development, GitHub OAuth for production, allow-all policy

Status: accepted (retro-documented, 2026-11-04)

## Context

owner คนเดียว; dev ต้อง zero-setup แต่ production ต้องไม่ให้ใครเข้าแบบ guest

## Decision

- backend ลง `auth-backend-module-guest-provider` และ `auth-backend-module-github-provider`
- dev: `auth.providers.guest: {}`; sign-in page แสดง Guest + GitHub
- production: `auth.environment: production`, GitHub `clientId`/`clientSecret` จาก `${AUTH_GITHUB_CLIENT_ID}` / `${AUTH_GITHUB_CLIENT_SECRET}`, resolver `usernameMatchingUserEntityName`; sign-in page แสดง GitHub อย่างเดียว
- dev backend listen `127.0.0.1` เพราะ guest + allow-all; production listen `':7007'`
- permission: `permission-backend-module-allow-all-policy` (`permission.enabled: true`)

## Consequences

- production sign-in จะปฏิเสธทุกคนจนกว่าจะมี `User` entity ชื่อเท่ากับ GitHub login ของ owner (P0)
- allow-all = ผู้ที่ sign in ได้ทำทุกอย่าง; ต้องเปลี่ยนก่อนมีผู้ใช้อื่น (P1)

## Evidence

`packages/backend/src/features.ts`, `app-config.yaml`, `app-config.production.yaml`, `packages/app/src/modules/signIn/providers.ts`, `SignInPage.tsx`, `providers.test.ts`, `SignInPage.test.tsx`, `packages/backend/src/appConfig.test.ts`, `docs/UPGRADE-PLAN.md`
