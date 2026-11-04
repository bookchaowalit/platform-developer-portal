# 19 — Service dependency map

```mermaid
flowchart LR
  APP["app (frontend)"] --> BE["backend"]
  BE --> DB[("SQLite memory (dev) / PostgreSQL (prod config)")]
  BE --> GH["GitHub REST API (GITHUB_TOKEN)"]
  BE --> GHO["GitHub OAuth (prod config)"]
  BE --> DK["Docker daemon (TechDocs generator)"]
  BE --> FS["Local files: examples/, TechDocs publisher dir"]
  BE -.-> K8S["Kubernetes (plugin installed, no clusters)"]
  BE -.-> PX["Proxy targets (none configured)"]
  APP -.-> EXT["Home toolkit links: backstage.io, github.com/backstage"]
  subgraph BuildTime["Build / CI time"]
    NPM["npm registry via Yarn 4.13.0"]
    GHA["GitHub Actions runners ubuntu-24.04"]
    SHR["platform-ci-workflows security.yml"]
  end
```

ไม่มี dependency runtime ต่อ service อื่นของ Solo Empire (identity, gateway, Sentry, PostHog, uptime) dashed = ติดตั้ง/ประกาศไว้แต่ไม่มีเป้าหมายใน config

Sources: `app-config.yaml`, `app-config.production.yaml`, `packages/backend/src/features.ts`, `packages/backend/package.json`, `package.json`, `.yarnrc.yml`, `.github/workflows/ci.yml`
