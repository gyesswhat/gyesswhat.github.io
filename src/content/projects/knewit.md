## Overview

knewit is a card-payment-based place service for people who save hundreds of
places but visit fewer than a third of them, and who no longer trust ad-polluted
reviews. Link a card once and every approval becomes a visit (or revisit) record
with zero manual logging. From that history the app recommends places worth
going back to (**KNEW IT**) and new places that match your taste (**NEW IT**).

Built as a 3-person Ewha capstone / startup team (PM+FE, two BE). I own the
backend repo and all infrastructure end to end: around 130 commits and 35 merged
pull requests on the API server so far, plus four feasibility PoCs that decided
what the product could promise.

## Key Contributions

### 1. Feasibility PoCs (before writing product code)
- **Map import** — proved that saved-place lists from Naver Map and Kakao Map
  can be pulled server-side without login (525 + 998 real items collected), which
  unblocked the cold-start onboarding story.
- **POI matching** — measured how often a card merchant string can be matched to
  the public commercial-district registry (the core assumption of the product);
  built normalization, matching, and a Kakao Local API place-ID resolution A/B.
- **Place category** — defined a cafe/restaurant taxonomy for Seoul and a way to
  auto-label places where the public registry's industry codes were too coarse.
- **Taste profile** — iterated 10 rounds on deriving a 4-axis taste profile from
  card approvals and ranking places against it.

### 2. Backend (Kotlin · Spring Boot 4 · Virtual Threads)
- Bootstrapped the repo: Spring MVC on virtual threads (blocking JPA + 20-second
  CODEF waits), Flyway with timestamp versioning, JDK 21, lockfile-pinned deps,
  ktlint/detekt/Kover 70% coverage gate, lefthook + gitleaks commit hooks.
- **Auth** — Kakao and Apple sign-in in both authorization-code and native-SDK
  flows, Apple `client_secret` generation and encrypted refresh-token storage,
  self-issued JWT access/refresh tokens, one-time login codes for the mobile
  handoff, logout, and account deletion that also revokes CODEF/Apple/Kakao links
  and rejects tokens of deleted users.
- **Card sync pipeline** — CODEF client with token caching and error
  classification, card-company account linking with login-failure tracking,
  consent, an initial-sync worker with job stage/progress columns, incremental
  sync that skips expired card logins, sync-job status API, and APNs push on
  completion.
- **Payment → visit resolver** — rules that filter non-place payments, merchant
  name similarity scoring, candidate matching against the commercial registry
  ledger, cancellation handling, and a scheduled purge of expired raw payments.
  Fixed a race where concurrent conversion of one user's payments split a single
  visit in two.
- **POI ledger** — client for the public commercial-district API, name/address
  normalization, a release-check scheduler with an S3-backed load job, and a
  partial index covering only open businesses for candidate lookup.
- Swagger/OpenAPI as the FE contract (Orval codegen), including auto-generated
  error-code examples and Kotlin non-null → required mapping.

### 3. Infrastructure (Terraform · AWS · Docker)
- Terraform from scratch: VPC/subnet/IGW, security groups, EC2 t4g.small with
  Elastic IP, instance IAM role, S3 buckets for backups and POI data, daily EBS
  snapshots, SNS + CPU-credit alarms, S3 remote state.
- GitHub Actions OIDC deploy role trusted only from `main`, scoped to SSM
  `SendCommand` on the app instance; CD builds an arm64 image with Jib → GHCR and
  refreshes `compose.yaml` and `.env` (rendered from SSM Parameter Store) on the
  server.
- 4-container compose stack: app, arm64 PostGIS, Caddy with readiness checks and
  auto-TLS, Grafana Alloy shipping JSON logs and disk metrics to Grafana Cloud.
  Replaced Sentry with ERROR-log → Discord embeds plus worker/job-state metrics
  and boot notifications; the app refuses to start if required prod config is
  missing.
- Kept the dependency tree clean under Trivy: patched Tomcat and several Jackson
  CVEs the same day they were flagged, Dependabot grouping tuned so Kotlin
  plugin bumps land as one PR.

### 4. Team / Org
- Set up the `knewit-app` GitHub org: shared community health files, issue/PR
  templates, and the contributing guide every repo inherits.
