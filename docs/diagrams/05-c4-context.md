# 05 — C4 Context

```mermaid
C4Context
  title System context: platform-developer-portal (local only)
  Person(owner, "Owner", "Only user; guest in dev, GitHub in production config")
  System(portal, "Developer portal", "Backstage 1.55.3 app + backend on the owner machine")
  System_Ext(github, "GitHub", "OAuth sign-in (production config), API integration with GITHUB_TOKEN, publish:github target")
  System_Ext(docker, "Docker", "TechDocs generator runIn docker")
  System_Ext(mcpc, "MCP client", "Calls /api/mcp-actions/v1")
  System_Ext(gha, "GitHub Actions", "CI verify + shared security workflow")
  SystemDb_Ext(pg, "PostgreSQL", "Production config only, not provisioned")
  Rel(owner, portal, "Uses", "HTTP :3000 / :7007")
  Rel(portal, github, "OAuth, REST API, create repo")
  Rel(portal, docker, "Generates TechDocs")
  Rel(mcpc, portal, "MCP actions")
  Rel(portal, pg, "Planned production database")
  Rel(gha, portal, "Builds and tests the repo")
```

ไม่มี system อื่นใน Solo Empire (gateway, uptime, MCP hub, Sentry) ที่เชื่อมกับ portal นี้ใน code หรือ ops record ที่อ่าน

Sources: `app-config.yaml`, `app-config.production.yaml`, `packages/backend/src/features.ts`, `.github/workflows/ci.yml`, `PRODUCT.md`, `README.md`

## Open questions

- MCP client ใดจะใช้ MCP actions จริง (ไม่มี config ฝั่ง client ใน repo)
