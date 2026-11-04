# ADR-0001 — Backstage 1.55.3 with the new frontend and backend system

Status: accepted (retro-documented, 2026-11-04)

## Context
owner ต้องการ catalog / scaffolder / TechDocs / search เดียวสำหรับ repo ของ Solo Empire (`PRODUCT.md`, `DOCPACK/00-product-card.md`)

## Decision
- ใช้ Backstage `1.55.3` (`backstage.json`) Yarn `4.13.0` workspaces (`packages/*`, `plugins/*`), Node `22 || 24`
- Frontend: new frontend system — `createApp` จาก `@backstage/frontend-defaults`, `app.packages: all`, custom modules ผ่าน blueprint (`SignInPageBlueprint`, `NavContentBlueprint`, `HomePageWidgetBlueprint`)
- Backend: new backend system — `createBackend()` จาก `@backstage/backend-defaults`; รายการ plugin อยู่ที่ `features.ts` ไฟล์เดียว ใช้ร่วมกับ `routeAccess.test.ts`
- ไม่มี custom plugin; ใช้ plugin upstream ทั้งหมด

## Consequences
- ทุก upgrade ต้องตาม release ของ Backstage (Renovate, `osv-scanner.toml` อ้าง advisory ที่รอ upstream)
- เพิ่ม plugin ใหม่ใน `features.ts` จะทำให้ route test fail จนกว่าจะจัดระดับใน `EXPECTED`

## Evidence
`backstage.json`, `package.json`, `packages/app/src/App.tsx`, `packages/app/src/modules/*/`, `packages/backend/src/index.ts`, `packages/backend/src/features.ts`, `packages/backend/src/routeAccess.test.ts`, `osv-scanner.toml`
