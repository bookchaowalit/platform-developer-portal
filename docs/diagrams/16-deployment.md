# 16 — Deployment

ไม่มี hosted deployment (`PRODUCT.md`) ที่รันจริงมีแค่เครื่อง owner ส่วน production เป็น config + Dockerfile ที่ยังไม่เคยใช้

```mermaid
flowchart TB
  subgraph LOCAL["Owner machine (actual)"]
    YS["yarn start (backstage-cli repo start)"]
    APPD["app dev server http://localhost:3000"]
    BED["backend http://localhost:7007 listen 127.0.0.1"]
    SQL[("better-sqlite3 :memory:")]
    EX["examples/ via ../../examples/*"]
    YS --> APPD
    YS --> BED
    BED --> SQL
    BED --> EX
  end
  subgraph FUTURE["Production config (not provisioned)"]
    IMG["Docker image node:24-trixie-slim, USER node, WORKDIR /app"]
    CMD["node packages/backend --config app-config.yaml --config app-config.production.yaml"]
    BEP["backend + bundled app, listen :7007, baseUrl http://localhost:7007"]
    PGF[("PostgreSQL POSTGRES_HOST/PORT/USER/PASSWORD")]
    ENV["env: AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, GITHUB_TOKEN"]
    IMG --> CMD --> BEP
    BEP --> PGF
    ENV --> BEP
  end
  BUILD["yarn tsc + yarn build:backend + yarn build-image (docker build tag backstage)"] -.->|"never run for a release"| IMG
```

- domain: none; `baseUrl` ทั้ง app และ backend ใน production config ยังเป็น `http://localhost:7007`
- image registry: none
- environments: development (local) เท่านั้น

Sources: `PRODUCT.md`, `README.md`, `package.json`, `packages/backend/package.json` (`build-image`), `packages/backend/Dockerfile`, `app-config.yaml`, `app-config.production.yaml`

## Open questions

- hosting target, domain และ secret store สำหรับ production (ยังไม่ตัดสินใจ)
