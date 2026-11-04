# ADR-0004 — Local only: no hosted deployment, Sentry waived

Status: accepted (retro-documented, 2026-11-04)

## Context

portal ยังเป็น scaffold ที่มีข้อมูลตัวอย่าง (product card verdict `template`)

## Decision

- รันบนเครื่อง owner เท่านั้น ไม่มี Railway/Vercel/อื่น ๆ, ไม่มี live URL, ไม่มี deploy workflow
- `packages/backend/Dockerfile` เป็นสูตร upstream; ไม่ build/push image
- Sentry waiver: ไม่ deploy จึงไม่มี runtime ให้ส่ง error; ต้องเพิ่ม `@sentry/node` ก่อน hosted deploy

## Consequences

- item runtime (backup, observability, incident, DORA deploy metrics) ส่วนใหญ่ไม่มีข้อมูลจริง
- ไม่ได้อยู่ในมาตรฐาน production baseline (uptime / backup) ของ platform

## Evidence

`PRODUCT.md` ("How it runs and deploys", "Sentry waiver"), `packages/backend/Dockerfile`, `.github/workflows/` (มีแค่ `ci.yml`), `DOCPACK/00-product-card.md`
