# 06 — C4 Container

```mermaid
C4Container
  title Containers (development run, yarn start)
  Person(owner, "Owner")
  System_Boundary(p, "platform-developer-portal") {
    Container(app, "app (frontend)", "React 18, Backstage new frontend system", "packages/app; dev server on :3000")
    Container(backend, "backend", "Node 22/24, @backstage/backend-defaults", "packages/backend; 127.0.0.1:7007; 13 plugins from features.ts")
    ContainerDb(db, "Database", "better-sqlite3 :memory: (dev) / pg from env (production config)", "Plugin tables owned by upstream Backstage packages")
    Container(files, "Catalog files", "YAML", "examples/entities.yaml, org.yaml, template/")
    Container(tdocs, "TechDocs local publisher", "filesystem", "techdocs.publisher.type local")
  }
  System_Ext(github, "GitHub")
  System_Ext(docker, "Docker")
  Rel(owner, app, "Browser")
  Rel(app, backend, "REST /api/*, WebSocket /api/signals")
  Rel(backend, db, "Knex")
  Rel(backend, files, "Reads file locations")
  Rel(backend, tdocs, "Stores generated docs")
  Rel(backend, docker, "TechDocs generator")
  Rel(backend, github, "Integration token, OAuth, publish:github")
```

ใน production config `app.baseUrl` = `backend.baseUrl` = `http://localhost:7007` และ backend depend on `"app": "link:../app"` (`plugin-app-backend` เสิร์ฟ bundle ของ app) — container เดียวจาก `packages/backend/Dockerfile` (`node:24-trixie-slim`) แต่ไม่เคย build หรือ push image (PRODUCT.md)

Sources: `packages/app/package.json`, `packages/backend/package.json`, `packages/backend/Dockerfile`, `packages/backend/src/features.ts`, `app-config.yaml`, `app-config.production.yaml`, `package.json`, `PRODUCT.md`

## Open questions
- Postgres instance สำหรับ production (ยังไม่ provision)
