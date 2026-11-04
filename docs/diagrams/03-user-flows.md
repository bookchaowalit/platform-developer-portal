# 03 — User flows

frontend ใช้ Backstage new frontend system (`createApp` จาก `@backstage/frontend-defaults`) features ที่ใส่เองใน `App.tsx` = `catalogPlugin`, `navModule`, `homeModule`, `signInModule`; plugin อื่นใน `packages/app/package.json` ถูก enable อัตโนมัติจาก `app.packages: all` path ที่ config กำหนดเอง: `page:catalog` → `/` ที่เหลือใช้ path default ของแต่ละ plugin

## Flow A — Development sign-in และใช้งาน catalog

```mermaid
flowchart TD
  S["Open http://localhost:3000"] --> SI["SoloSignInPage title Solo Empire"]
  SI --> C{"auth.environment"}
  C -- "development (default)" --> P1["Providers: Guest, GitHub"]
  C -- "other" --> P2["Providers: GitHub only"]
  P1 --> G["Click Enter on Guest card"]
  G --> CAT["Catalog page at /"]
  CAT --> ENT["Entity page (example-website, example-grpc-api, examples system)"]
  ENT --> API["API definition (grpc) via api-docs plugin"]
  ENT --> GRAPH["Catalog graph"]
  CAT --> NAV["Sidebar: Search modal, Home, Catalog, Scaffolder, other pages sorted by title, Notifications, Settings"]
  NAV --> SET["Settings group: app-visualizer, user-settings"]
```

## Flow B — Create from template (scaffolder)

```mermaid
flowchart TD
  N["Sidebar: Scaffolder page"] --> T["Example Node.js Template"]
  T --> F1["Step 1: Name (EntityNamePicker)"]
  F1 --> F2["Step 2: Repository Location (RepoUrlPicker, allowedHosts github.com)"]
  F2 --> RUN["Run task"]
  RUN --> S1["fetch-base: fetch:template from ./content"]
  S1 --> S2["publish: publish:github, defaultBranch main"]
  S2 --> S3["register: catalog:register /catalog-info.yaml"]
  S3 --> S4["notify: notification:send to user:default/guest"]
  S4 --> OUT["Output links: Repository, Open in catalog"]
```

## Flow C — Production sign-in (config only, not deployed)

```mermaid
flowchart TD
  O["Open backend.baseUrl (http://localhost:7007 in production config)"] --> GH["Only GitHub provider offered"]
  GH --> OA["GitHub OAuth, callback /api/auth/github/handler/frame"]
  OA --> R{"User entity named after GitHub login exists?"}
  R -- yes --> IN["Signed in"]
  R -- no --> REJ["Sign-in rejected (today: always, only User guest exists)"]
```

Sources: `packages/app/src/App.tsx`, `packages/app/src/modules/nav/Sidebar.tsx`, `packages/app/src/modules/signIn/SignInPage.tsx`, `packages/app/src/modules/signIn/providers.ts`, `packages/app/src/modules/home/homeModule.tsx`, `packages/app/package.json`, `app-config.yaml`, `app-config.production.yaml`, `examples/entities.yaml`, `examples/template/template.yaml`, `packages/app/e2e-tests/app.test.ts`, `README.md`

## Open questions
- widget Getting Started ใน `homeModule.tsx` ลิงก์ไป `/catalog` แต่ catalog ถูกย้ายไป `/` — ลิงก์นี้ยังใช้ได้หรือไม่ (ยังไม่ได้ตรวจใน browser)
- path ของ home page ไม่ได้ override ใน config (ใช้ default ของ `plugin-home`); ยังไม่ได้ยืนยันใน app ที่รันจริง
