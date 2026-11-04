# 07 — C4 Component (backend)

backend = `createBackend()` แล้ว `backend.add()` ทุก feature ใน `backendFeatures` ตามลำดับ (`index.ts`) ไม่มี custom plugin (`plugins/` มีแค่ README)

```mermaid
C4Component
  title Backend components (packages/backend/src/features.ts)
  Container_Boundary(b, "backend") {
    Component(appb, "app-backend", "plugin", "Serves frontend bundle + config")
    Component(proxy, "proxy-backend", "plugin", "No endpoints configured")
    Component(scaf, "scaffolder-backend", "plugin + github + notifications modules", "Runs templates")
    Component(td, "techdocs-backend", "plugin", "builder local, generator docker, publisher local")
    Component(auth, "auth-backend", "plugin + guest + github provider modules", "Sign-in and tokens")
    Component(cat, "catalog-backend", "plugin + scaffolder-entity-model + logs modules", "Entities from file locations")
    Component(perm, "permission-backend", "plugin + allow-all policy", "Authorizes every request")
    Component(search, "search-backend", "plugin + pg engine + catalog/techdocs collators", "Search index")
    Component(k8s, "kubernetes-backend", "plugin", "No clusters configured")
    Component(us, "user-settings-backend", "plugin", "Per-user settings")
    Component(notif, "notifications-backend", "plugin", "Notifications")
    Component(sig, "signals-backend", "plugin", "WebSocket push")
    Component(mcp, "mcp-actions-backend", "plugin", "Exposes actions of auth, catalog, scaffolder")
  }
  ContainerDb(db, "Database", "SQLite memory / Postgres")
  System_Ext(github, "GitHub")
  Rel(scaf, cat, "catalog:register")
  Rel(scaf, notif, "notification:send")
  Rel(scaf, github, "publish:github")
  Rel(notif, sig, "Push to browser")
  Rel(search, cat, "Collates entities")
  Rel(search, td, "Collates docs")
  Rel(mcp, cat, "Catalog actions")
  Rel(mcp, scaf, "Scaffolder actions")
  Rel(auth, cat, "Resolves User entity")
  Rel(cat, db, "Entities")
```

Frontend custom modules (ส่วนที่ repo เขียนเอง): `modules/signIn` (`SoloSignInPage` + `signInProviders`), `modules/nav` (`SidebarContent`), `modules/home` (widget Getting Started)

Sources: `packages/backend/src/index.ts`, `packages/backend/src/features.ts`, `app-config.yaml`, `examples/template/template.yaml`, `packages/app/src/App.tsx`, `packages/app/src/modules/**`, `plugins/README.md`

## Open questions
- `search-backend-module-pg` ต้องใช้ Postgres; ใน dev (SQLite) engine ที่ใช้จริงคืออะไร — พฤติกรรม fallback เป็นของ upstream Backstage ยังไม่ได้ยืนยันใน repo
