# 11 — State machines

ไม่มี entity ที่ repo กำหนด status field เอง (ไม่มี schema ของตัวเอง) lifecycle ที่ปรากฏใน code:

## 1. Sign-in provider selection (repo code)

```mermaid
stateDiagram-v2
  [*] --> ReadEnv: SoloSignInPage reads auth.environment
  ReadEnv --> Development: unset or development
  ReadEnv --> NonDevelopment: any other value (production config)
  Development --> GuestOrGitHub: providers guest + github-auth-provider
  NonDevelopment --> GitHubOnly: providers github-auth-provider
  GuestOrGitHub --> SignedIn: guest accepted (NODE_ENV development)
  GuestOrGitHub --> SignedIn: GitHub + matching User entity
  GitHubOnly --> SignedIn: GitHub + matching User entity
  GitHubOnly --> Rejected: no User entity named after login
  SignedIn --> [*]
  Rejected --> [*]
```

## 2. Example template steps (from template.yaml)

```mermaid
stateDiagram-v2
  [*] --> Parameters: Name, Repository Location
  Parameters --> FetchBase: action fetch template
  FetchBase --> Publish: action publish github
  Publish --> Register: action catalog register
  Register --> Notify: action notification send
  Notify --> Output: links Repository, Open in catalog
  Output --> [*]
```

ชื่อ action จริงใน template: `fetch:template`, `publish:github`, `catalog:register`, `notification:send` (ตัด `:` ออกใน label เพื่อให้ Mermaid parse)

## 3. Entity lifecycle field

entity ตัวอย่างและ `catalog-info.yaml` ใช้ `spec.lifecycle: experimental` ค่าเดียว ไม่มี code ที่เปลี่ยนค่า จึงไม่มี transition ให้วาด สถานะ task ของ scaffolder (เช่น processing / completed / failed / cancelled) เป็นของ upstream `scaffolder-backend` ไม่ได้กำหนดใน repo — route `POST /api/scaffolder/v2/tasks/x/cancel` ปรากฏใน `routeAccess.test.ts` เท่านั้น

Sources: `packages/app/src/modules/signIn/providers.ts`, `SignInPage.tsx`, `app-config.production.yaml`, `examples/template/template.yaml`, `examples/entities.yaml`, `catalog-info.yaml`, `packages/backend/src/routeAccess.test.ts`
