# 18 — Git / release workflow

default branch `main` (public) ไม่มี branch protection (`gh api .../branches/main/protection` → 404 "Branch not protected", 2026-11-04) ส่วนใหญ่ push ตรงเข้า `main`; มี PR เดียว (#1, merged 2026-10-17) และ merge commit หนึ่งจาก branch `claude/untitled-session-bhlj06` ไม่มี tag / release / deploy — "production" ไม่มี ทางเดียวที่ change ไปถึงคือ owner `git pull` + `yarn start` บนเครื่อง

```mermaid
gitGraph
  commit id: "aec2c2a init"
  commit id: "4f8acb4"
  branch claude/untitled-session-bhlj06
  checkout claude/untitled-session-bhlj06
  commit id: "f3523ec fix lint"
  commit id: "30e7f52 ci"
  commit id: "f74e7bb auth"
  commit id: "472c223 route test"
  checkout main
  merge claude/untitled-session-bhlj06 id: "e1f3ecd"
  commit id: "f5b9845 docpack"
  commit id: "199bda6"
  commit id: "c598963 license"
  commit id: "30d4dcb rename"
  commit id: "282878d revert"
  commit id: "dc6a810 rename"
  commit id: "a3a469d PR 1 CI"
  commit id: "12193c0 docs"
  commit id: "0c3d76f deps"
```

```mermaid
flowchart LR
  DEV["Change on owner machine"] --> PUSH{"push to main or PR"}
  PUSH -->|"PR"| CIPR["CI on pull_request"] --> MERGE["merge to main"]
  PUSH -->|"direct push"| MAIN["main"]
  MERGE --> MAIN
  MAIN --> CIM["CI on push: verify + security (not a required check)"]
  CIM --> LOCAL["Owner pulls and runs yarn start"]
  RN["Renovate PRs (Monday, label dependencies / security)"] --> PUSH
```

Sources: `git log origin/main` (16 commits, 2026-09-06 → 2026-10-23), `gh pr list --state all`, `gh api repos/bookchaowalit/platform-developer-portal/branches/main/protection`, `.github/workflows/ci.yml`, `renovate.json`

## Open questions
- จะตั้ง branch protection / required check `verify` บน `main` หรือไม่
