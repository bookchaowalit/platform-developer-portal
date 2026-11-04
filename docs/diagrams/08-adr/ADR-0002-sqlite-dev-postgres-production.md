# ADR-0002 — SQLite in memory for development, Postgres from env for production

Status: accepted (retro-documented, 2026-11-04)

## Context
local dev ต้องเริ่มได้โดยไม่มี DB ภายนอก; production ต้องการ DB ที่คงอยู่

## Decision
- `app-config.yaml`: `backend.database.client: better-sqlite3`, `connection: ':memory:'`
- `app-config.production.yaml`: `client: pg`, connection host/port/user/password จาก `${POSTGRES_HOST}`, `${POSTGRES_PORT}`, `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`
- search engine module = `search-backend-module-pg`
- repo ไม่มี schema/migration ของตัวเอง; ตารางเป็นของ plugin upstream

## Consequences
- dev data (entity ที่ register, scaffolder task, user settings) หายเมื่อ backend หยุด
- production DB ยังไม่ provision (`PRODUCT.md`) — ไม่มี backup/DR ที่ต้องดูแลตอนนี้

## Evidence
`app-config.yaml`, `app-config.production.yaml`, `packages/backend/package.json` (`better-sqlite3`, `pg`), `packages/backend/src/features.ts`, `packages/backend/src/appConfig.test.ts`, `packages/backend/Dockerfile` (`libsqlite3-dev`)
