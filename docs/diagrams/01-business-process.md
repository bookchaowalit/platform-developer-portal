# 01 — Business process (As-Is / To-Be)

repo นี้คือ Backstage developer portal (Backstage `1.56.5` ตาม `backstage.json`) ที่ยังใกล้ upstream scaffold ใช้โดย owner คนเดียว รันบนเครื่อง owner เท่านั้น (ไม่มี hosted deploy, ไม่มี live URL ตาม `PRODUCT.md`) catalog โหลดเฉพาะ entity ตัวอย่างใน `examples/`

Last reviewed: 2026-11-27 · commit `27333ba`

## As-Is (จาก code วันนี้)

```mermaid
flowchart TD
  A["Owner runs yarn start"] --> B["backstage-cli repo start: app on :3000, backend on 127.0.0.1:7007"]
  B --> C["Backend boots plugins from features.ts"]
  C --> D["Catalog reads file locations: examples/entities.yaml, examples/org.yaml, examples/template/template.yaml"]
  D --> E["SQLite in memory holds catalog, scaffolder, settings data until the process stops"]
  B --> F["Sign-in page: Guest or GitHub (development)"]
  F --> G["Owner browses catalog at / , searches, opens API docs"]
  G --> H{"Create from template?"}
  H -- yes --> I["Scaffolder: fetch:template, publish:github, catalog:register, notification:send"]
  I --> J["New GitHub repo + entity registered in the in-memory catalog"]
  H -- no --> K["Session ends; in-memory data is lost on stop"]
  J --> K
```

ข้อสังเกต: scaffolder step `publish:github` ใช้ `integrations.github[].token: ${GITHUB_TOKEN}` ถ้าไม่ตั้ง `GITHUB_TOKEN` ขั้นนี้จะทำงานไม่ได้ (ไม่มี test ครอบ flow นี้) entity ที่ register ระหว่างใช้งานหายเมื่อ backend หยุด เพราะ DB เป็น `':memory:'`

Sources: `README.md`, `PRODUCT.md`, `package.json`, `app-config.yaml`, `packages/backend/src/index.ts`, `packages/backend/src/features.ts`, `examples/template/template.yaml`, `packages/app/src/modules/signIn/providers.ts`

## To-Be (จาก `docs/UPGRADE-PLAN.md` และ `DOCPACK/00-product-card.md` เท่านั้น)

```mermaid
flowchart TD
  P0["P0: add catalog User entity named after the owner GitHub login + register GitHub OAuth app"] --> HD["Hosted deploy (production config: Postgres + GitHub OAuth from env)"]
  P1a["P1: replace example catalog with Solo Empire entities (Location per repo or GitHub discovery) + real org.yaml"] --> HD
  P1b["P1: replace allow-all permission policy once non-guest users exist"] --> HD
  P1c["P1: frontend tests for modules/nav"]
  P2a["P2: run Playwright smoke in CI; trim placeholder home widgets"]
  P2b["P2: TechDocs generator.runIn local for hosts without Docker"]
  CARD["Product card verdict: template; showcase when catalog-info is generated from repository-catalog/registries, otherwise archive within 3 months"]
```

ยังไม่มี hosting target ที่ตัดสินใจแล้วใน repo (`PRODUCT.md`: "describes a future hosted setup ... that has not been provisioned")

Sources: `docs/UPGRADE-PLAN.md`, `DOCPACK/00-product-card.md`, `PRODUCT.md`

## Gap

| ID | As-Is → To-Be | Status | Owner | Evidence |
|---|---|---|---|---|
| G1 | รันบนเครื่อง owner เท่านั้น (SQLite in memory) → hosted deploy บน production config (Postgres + GitHub OAuth) | decide | owner | `docs/UPGRADE-PLAN.md` P0; `PRODUCT.md` (ยังไม่มี hosting target) |
| G2 | ไม่มี catalog `User` entity ของ owner / ยังไม่ลงทะเบียน GitHub OAuth app → มีทั้งสอง | todo | owner | `docs/UPGRADE-PLAN.md` P0 |
| G3 | catalog เป็น entity ตัวอย่างใน `examples/` → entity จริงของ Solo Empire + `org.yaml` จริง | todo | claude | `docs/UPGRADE-PLAN.md` P1; `DOCPACK/00-product-card.md` §7 |
| G4 | permission policy allow-all → policy ขั้นต่ำเมื่อมี non-guest user | todo | claude | `docs/UPGRADE-PLAN.md` P1; `packages/backend/src/features.ts` |
| G5 | ไม่มี frontend test ของ `modules/nav`; Playwright smoke ยังไม่รันใน CI → มีทั้งสอง | todo | claude | `docs/UPGRADE-PLAN.md` P1/P2 |
| G6 | verdict `template` → `showcase` (generate catalog-info จาก registries) หรือ archive ภายใน 3 เดือน | decide | owner | `DOCPACK/00-product-card.md` §7, §8 |

## Open questions

- จะใช้ Backstage ต่อ หรือคง `repository-catalog` เป็น catalog หลัก (product card ข้อ 8.2 ยังรอพิจารณา)
- ถ้า host: ที่ไหน (Railway / container อื่น), Postgres ที่ไหน, domain อะไร
- เส้นตาย "archive ภายใน 3 เดือน" นับจาก 2026-10-08 (วันที่ product card) ใช่หรือไม่
