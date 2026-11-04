# ADR-0005 — Repo-local CI verify job (Yarn Berry) plus the shared security workflow

Status: accepted (retro-documented, 2026-11-04)

## Context
`ci.yml` comment: shared `ci-node.yml` รองรับแค่ npm และ pnpm แต่ repo นี้ใช้ Yarn Berry (Corepack, `yarn.lock`) และเป็น public repo

## Decision
- job `verify` ใน repo: `ubuntu-24.04`, Node 22, `corepack enable`, `yarn install --immutable`, `yarn tsc`, `yarn lint:all`, `yarn prettier:check`, `yarn test`, `yarn build:backend`
- job `security` เรียก `bookchaowalit/platform-ci-workflows/.github/workflows/security.yml` pin SHA `87dc5e1c…` (v1.1.1): gitleaks, semgrep, osv-scanner, trivy-fs บน GitHub-hosted runner (default `"ubuntu-24.04"`)
- ข้อยกเว้นของ scanner อยู่ใน `osv-scanner.toml`, `.trivyignore.yaml`, `.gitleaksignore` พร้อมเหตุผลและวันหมดอายุ 2027-01-17
- Renovate: `helpers:pinGitHubActionDigests`, จับกลุ่ม `platform-ci-workflows`

## Consequences
- ไม่ได้รับการปรับปรุงของ `ci-node.yml` อัตโนมัติ; ต้องดูแล job `verify` เอง
- Playwright e2e ยังไม่อยู่ใน CI

## Evidence
`.github/workflows/ci.yml`, `osv-scanner.toml`, `.trivyignore.yaml`, `.gitleaksignore`, `renovate.json`; `ci.yml` comment "Public repository: GitHub-hosted runners.", `gh repo view` visibility PUBLIC (2026-11-04)
