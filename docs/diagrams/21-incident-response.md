# 21 — Incident response

ไม่มี hosted runtime จึงไม่มี production incident ในความหมายปกติ alert channel ที่พบจริงมีสองทาง: ผล CI บน GitHub และ Renovate vulnerability alerts (label `security`) ทั้งสองไปถึง owner ผ่าน GitHub เท่านั้น — ไม่มี Telegram / pager ใน repo

```mermaid
flowchart TD
  A1["CI failure on main (verify or security)"] --> T["Owner triage from GitHub run logs"]
  A2["Renovate PR with label security"] --> T
  A3["Local error in yarn start terminal"] --> T
  T --> C{"Type"}
  C -- "lint / prettier / tsc / test" --> F1["Fix and push to main (10-12 to 10-13 Prettier failures; next green a3a469d)"]
  C -- "new advisory, no upstream fix" --> F2["Add reviewed entry with reason + expiry to osv-scanner.toml and .trivyignore.yaml"]
  C -- "advisory with fix" --> F3["Bump dependency (e.g. 0c3d76f fix deps)"]
  F1 --> V["CI green on main"]
  F2 --> V
  F3 --> V
  V --> PM["Postmortem: none defined; notes go to docs/UPGRADE-PLAN.md"]
```

ตัวอย่างจริงใน 90 วัน: 2026-10-12 → 10-13 CI บน `main` fail 5 ครั้งติด (4 ครั้งที่ขั้น Prettier, 1 ครั้งไม่มีข้อมูล step) แล้วกลับมาเขียวที่ `a3a469d` (2026-10-17); `12193c0` (2026-10-23 15:04 UTC) fail ที่ osv-scanner + trivy-fs แล้วแก้ด้วย `0c3d76f` 8 นาทีต่อมา

Sources: `.github/workflows/ci.yml`, `renovate.json`, `osv-scanner.toml`, `.trivyignore.yaml`, `docs/UPGRADE-PLAN.md`, `gh run list` / `gh run view` (2026-11-04), `git log origin/main`

## Open questions
- เมื่อ host แล้ว: alert จะเข้า Telegram เหมือน service อื่นหรือไม่ และ postmortem เก็บที่ไหน
- run `38219648436` (2026-10-12) fail โดยไม่มีข้อมูล step — สาเหตุ (runner / setup) ไม่ทราบ
