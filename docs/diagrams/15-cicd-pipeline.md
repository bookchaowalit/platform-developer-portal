# 15 — CI/CD pipeline

workflow เดียว: `.github/workflows/ci.yml` (name `CI`) ไม่มี CD / deploy workflow

```mermaid
flowchart TD
  T1["push to main"] --> CI
  T2["pull_request (any branch)"] --> CI
  T3["workflow_dispatch"] --> CI
  CI["CI (concurrency ci-ref, cancel-in-progress; permissions contents read)"] --> V
  CI --> S
  subgraph V["job verify (ubuntu-24.04, timeout 30 min, CI=true, NODE_OPTIONS 4096 MB)"]
    V1["checkout (persist-credentials false)"] --> V2["setup-node 22"] --> V3["corepack enable"] --> V4["yarn install --immutable"] --> V5["yarn tsc"] --> V6["yarn lint:all"] --> V7["yarn prettier:check"] --> V8["yarn test"] --> V9["yarn build:backend"]
  end
  subgraph S["job security: platform-ci-workflows security.yml at 87dc5e1 (v1.1.1)"]
    S1["gitleaks"]
    S2["semgrep (p/default)"]
    S3["osv-scanner (osv-scanner.toml)"]
    S4["trivy-fs (HIGH,CRITICAL; vuln,misconfig; .trivyignore.yaml)"]
  end
  V9 --> END["no deploy step"]
```

`verify` และ `security` ไม่มี `needs` ต่อกัน (รันขนาน) Renovate (`renovate.json`) เปิด PR dependency ทุกวันจันทร์ก่อน 9 โมง (Asia/Bangkok) และ lock file maintenance วันแรกของเดือน

ผล CI ล่าสุดบน `main`: `0c3d76f` success (2026-10-23); `12193c0` failure ที่ `security / osv-scanner` และ `security / trivy-fs`

Sources: `.github/workflows/ci.yml`, `platform-ci-workflows/.github/workflows/security.yml` (read-only, commit `87dc5e1`), `renovate.json`, `package.json`, `gh run list -R bookchaowalit/platform-developer-portal` (2026-11-04)
