# Core 22 SDLC diagram pack — platform-developer-portal

ชุด diagram 22 รายการตาม SDLC Diagram Catalog v2 (knowledge-base `knowledge/tech/core-cs/sdlc-diagram-catalog.md`) วาดจาก code / config ของ repo นี้ที่ `origin/main` `0c3d76f` (2026-10-23) อ่านเมื่อ 2026-11-04

repo นี้คือ **Backstage developer portal** (Backstage `1.55.3`, Yarn 4 monorepo: `packages/app` + `packages/backend`) ที่ยังใกล้ upstream scaffold: catalog โหลดเฉพาะ entity ตัวอย่าง, sign-in guest (dev) / GitHub OAuth (production config), permission allow-all, **รันบนเครื่อง owner เท่านั้น ไม่มี hosted deploy** ทุก diagram มี `Sources:` และ "Open questions" ข้อมูล runtime ที่ไม่อยู่ใน repo อ้าง `gh` CLI (read-only, 2026-11-04) และ `platform-ci-workflows` (read-only) ไม่พบ ops record หรือ central architecture doc ที่อ้างถึง repo นี้

| #   | Item                             | Status                                                                | File                                                         | Sources read                                                                                       |
| --- | -------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 01  | Business process (As-Is / To-Be) | done                                                                  | [01-business-process.md](01-business-process.md)             | README.md, PRODUCT.md, UPGRADE-PLAN.md, DOCPACK card, app-config.yaml, features.ts, template.yaml  |
| 02  | Use cases                        | done                                                                  | [02-use-cases.md](02-use-cases.md)                           | features.ts, routeAccess.test.ts, appConfig.test.ts, providers.ts, app-config\*.yaml, org.yaml     |
| 03  | User flows                       | done                                                                  | [03-user-flows.md](03-user-flows.md)                         | App.tsx, Sidebar.tsx, SignInPage.tsx, providers.ts, homeModule.tsx, template.yaml, e2e app.test.ts |
| 04  | Traceability (RTM)               | done (no specs/; backlog gaps marked)                                 | [04-traceability.md](04-traceability.md)                     | PRODUCT.md, UPGRADE-PLAN.md, all test files, ci.yml                                                |
| 05  | C4 Context                       | done                                                                  | [05-c4-context.md](05-c4-context.md)                         | app-config\*.yaml, features.ts, ci.yml, PRODUCT.md                                                 |
| 06  | C4 Container                     | done                                                                  | [06-c4-container.md](06-c4-container.md)                     | packages/_/package.json, Dockerfile, features.ts, app-config_.yaml                                 |
| 07  | C4 Component (backend)           | done                                                                  | [07-c4-component.md](07-c4-component.md)                     | index.ts, features.ts, app-config.yaml, template.yaml, modules/\*\*                                |
| 08  | ADRs (5)                         | done                                                                  | [08-adr/](08-adr/)                                           | backstage.json, App.tsx, features.ts, app-config\*.yaml, PRODUCT.md, ci.yml, scanner configs       |
| 09  | ERD                              | done (catalog entity model; plugin tables are upstream)               | [09-erd.md](09-erd.md)                                       | examples/_.yaml, app-config_.yaml, catalog-info.yaml                                               |
| 10  | Sequences (4)                    | done                                                                  | [10-sequences.md](10-sequences.md)                           | signIn/_, features.ts, app-config_.yaml, template.yaml, examples                                   |
| 11  | State machines                   | done (sign-in selection + template steps; no repo-owned status field) | [11-state-machines.md](11-state-machines.md)                 | providers.ts, SignInPage.tsx, template.yaml, entities.yaml                                         |
| 12  | API and integrations             | done                                                                  | [12-api-integration.md](12-api-integration.md)               | routeAccess.test.ts, features.ts, app-config\*.yaml, README.md                                     |
| 13  | Threat model (DFD + STRIDE)      | done                                                                  | [13-threat-model.md](13-threat-model.md)                     | app-config\*.yaml, features.ts, tests, ci.yml, scanner configs, gh branch protection API           |
| 14  | Backup / DR                      | done (nothing persisted at runtime; RTO/RPO not defined)              | [14-backup-dr.md](14-backup-dr.md)                           | app-config\*.yaml, README.md, PRODUCT.md                                                           |
| 15  | CI/CD pipeline                   | done (CI only, no CD)                                                 | [15-cicd-pipeline.md](15-cicd-pipeline.md)                   | ci.yml, platform-ci-workflows security.yml @87dc5e1, renovate.json, gh run list                    |
| 16  | Deployment                       | done (local only; production config not provisioned)                  | [16-deployment.md](16-deployment.md)                         | PRODUCT.md, Dockerfile, package.json files, app-config\*.yaml                                      |
| 17  | Test coverage matrix             | done                                                                  | [17-test-coverage-matrix.md](17-test-coverage-matrix.md)     | all test files, playwright.config.ts, ci.yml, UPGRADE-PLAN.md                                      |
| 18  | Git / release workflow           | done                                                                  | [18-git-release-workflow.md](18-git-release-workflow.md)     | git log --graph, gh pr list, gh branch protection API, renovate.json                               |
| 19  | Service dependency map           | done                                                                  | [19-service-dependency-map.md](19-service-dependency-map.md) | app-config\*.yaml, features.ts, package.json files, .yarnrc.yml                                    |
| 20  | Observability                    | done (logs + CI only; Sentry waived)                                  | [20-observability.md](20-observability.md)                   | PRODUCT.md, features.ts, ci.yml, renovate.json, gh run list                                        |
| 21  | Incident response                | done (GitHub-only alerting; no hosted runtime)                        | [21-incident-response.md](21-incident-response.md)           | ci.yml, renovate.json, scanner configs, gh run view, git log                                       |
| 22  | DORA                             | done (no deployments: 3 metrics not computable, CI proxies shown)     | [22-dora.md](22-dora.md)                                     | git log, gh run list, gh pr list, PRODUCT.md                                                       |

## ADRs (retro-documented)

- [ADR-0001](08-adr/ADR-0001-backstage-new-frontend-and-backend-system.md) Backstage 1.55.3, new frontend + backend system, plugin list ใน `features.ts`
- [ADR-0002](08-adr/ADR-0002-sqlite-dev-postgres-production.md) SQLite in memory (dev) / Postgres จาก env (production)
- [ADR-0003](08-adr/ADR-0003-guest-dev-github-oauth-production.md) Guest dev, GitHub OAuth production, allow-all policy, dev loopback
- [ADR-0004](08-adr/ADR-0004-local-only-no-hosted-deploy.md) Local only, ไม่มี hosted deploy, Sentry waiver
- [ADR-0005](08-adr/ADR-0005-local-ci-job-plus-shared-security.md) CI `verify` ใน repo (Yarn Berry) + shared `security.yml` v1.1.1

## Related docs (reused, not copied)

- [`README.md`](../../README.md), [`PRODUCT.md`](../../PRODUCT.md), [`docs/UPGRADE-PLAN.md`](../UPGRADE-PLAN.md)
- [`DOCPACK/00-product-card.md`](../../DOCPACK/00-product-card.md)

## Open questions for the owner (summary)

1. ใช้ Backstage ต่อ หรือคง `repository-catalog` เป็น catalog หลัก (product card verdict `template`, ข้อ 8.2) และเส้นตาย archive
2. ถ้า host: target, domain, Postgres, secret store, Sentry/uptime/backup และ RTO/RPO
3. `User` entity ของ owner (GitHub login) + GitHub OAuth app — ไม่มีแล้ว production sign-in ปฏิเสธทุกคน
4. scope ของ `GITHUB_TOKEN` ที่ใช้ local; `backend.auth.keys` และ permission policy จริง
5. Branch protection / required check บน `main` (ตอนนี้ไม่มี)
6. Playwright smoke เข้า CI หรือไม่ (UPGRADE-PLAN P2)
7. ลิงก์ `/catalog` ใน Getting Started widget หลัง catalog ย้ายไป `/`; search engine จริงใน dev (pg module บน SQLite)
8. สาเหตุ CI run `38219648436` fail โดยไม่มีข้อมูล step
