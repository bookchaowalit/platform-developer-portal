# 10 — Sequences

## 1. Development guest sign-in

```mermaid
sequenceDiagram
  actor O as Owner
  participant A as app (:3000)
  participant B as backend auth (127.0.0.1:7007)
  O->>A: open /
  A->>A: SoloSignInPage reads auth.environment (unset = development)
  A-->>O: providers Guest + GitHub
  O->>A: Enter (Guest)
  A->>B: /api/auth/guest/* sign-in
  B->>B: guest provider allowed only when NODE_ENV is development
  B-->>A: Backstage identity token for the guest user
  A-->>O: catalog page at /
```

## 2. Production GitHub sign-in (config only)

```mermaid
sequenceDiagram
  actor O as Owner
  participant A as app (served by app-backend)
  participant B as backend auth
  participant G as GitHub OAuth
  participant C as catalog
  O->>A: open backend.baseUrl
  A-->>O: GitHub provider only
  O->>B: start GitHub sign-in
  B->>G: OAuth with AUTH_GITHUB_CLIENT_ID
  G-->>B: callback /api/auth/github/handler/frame
  B->>C: usernameMatchingUserEntityName (User named after GitHub login)
  alt User entity found
    C-->>B: user entity
    B-->>A: identity token
  else not found (today: only User guest exists)
    C-->>B: not found
    B-->>A: sign-in rejected
  end
```

## 3. Scaffolder template run

```mermaid
sequenceDiagram
  actor O as Owner
  participant A as app
  participant S as scaffolder-backend
  participant G as GitHub API
  participant C as catalog-backend
  participant N as notifications + signals
  O->>A: fill Name + Repository Location
  A->>S: POST /api/scaffolder/v2/tasks
  S->>S: fetch:template ./content (name)
  S->>G: publish:github repoUrl, defaultBranch main (GITHUB_TOKEN)
  G-->>S: remoteUrl, repoContentsUrl
  S->>C: catalog:register /catalog-info.yaml
  C-->>S: entityRef
  S->>N: notification:send to user:default/guest
  N-->>A: signal push
  A-->>O: links Repository, Open in catalog
```

## 4. Catalog ingestion at startup

```mermaid
sequenceDiagram
  participant B as backend start
  participant C as catalog-backend
  participant F as examples files
  participant D as database
  participant L as catalog logs module
  B->>C: init (features.ts order)
  C->>F: read file locations (dev ../../examples/*, image ./examples/*)
  F-->>C: System, Component, API, User, Group, Template
  C->>C: apply rules (kinds allowed per location)
  C->>D: store entities
  C-->>L: processing errors to backend logger
```

Sources: `packages/app/src/modules/signIn/*`, `packages/backend/src/features.ts`, `app-config.yaml`, `app-config.production.yaml`, `README.md`, `examples/template/template.yaml`, `examples/*.yaml`, `packages/backend/src/routeAccess.test.ts`

## Open questions

- sign-in path ของ guest (`/api/auth/guest/...`) เป็น path ของ upstream; repo ไม่ได้ probe ใน route test นอกจาก `/.well-known/openid-configuration`
