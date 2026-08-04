## Overview

A backend service for a lucky-draw event run during Ewha Womans University's
2025 spring festival: participants submit entries, winners are drawn and
persisted, and a server-rendered admin console lets organizers review entries
and manage prizes in real time. 

I designed, built, and operated this service
entirely on my own — across roughly 130 commits in about a month — including
every round of production firefighting during the live event window.

## Key Contributions

### 1. Solo End-to-End Ownership
Owned the full stack of this service alone: feature design, implementation,
CI/CD, cloud infrastructure, and live incident response during the festival,
with no PR review process given the compressed, time-boxed timeline.

### 2. Lucky Draw Core Logic
- Implemented entry submission and winner-determination logic, then migrated
  winning entries from a hardcoded list to a DB-backed source of truth.
- Added data validation and fixed a referential-integrity issue by removing an
  incorrect foreign-key mapping.
- Added dummy-data support for pre-event demos, with admin-side filtering so
  dummy entries never leaked into real results.

### 3. Admin Console
- Built a session-authenticated, server-rendered admin page to review
  submissions, filter out dummy data, and sort/manage entries by college.
- Added prize-name tracking on the user record and iterated on review-content
  constraints (text length) and page styling based on organizer feedback.

### 4. Auth & Security Hardening
- Debugged and rebuilt the Spring Security filter chain under real deployment
  conditions: fixed exception handling that was swallowing login errors,
  corrected filter ordering, enforced admin access with explicit `hasRole`
  checks, fixed BCrypt password-encoding mismatches, and stopped a new session
  cookie from being minted on every request.
- Resolved an HTTPS redirect loop caused by `X-Forwarded-*` headers not being
  honored behind the reverse proxy, eventually simplifying a brittle custom
  exception-handling setup down to plain `formLogin` for reliability.

### 5. Infrastructure & Deployment
- Built the initial Docker + GitHub Actions pipeline deploying to EC2 via ECR,
  then migrated configuration/secrets delivery from an ad hoc `deploy.sh`
  script to SSM parameters and GitHub Secrets for reliability.
- Diagnosed and fixed a long tail of environment-specific production issues
  under time pressure: AWS region auto-detection failures, health-check
  path/config mismatches, CORS failures (including a www vs. non-www origin
  mismatch), a server timezone bug, JAR path resolution inside the Docker
  build, and stale Docker images not being replaced on redeploy.
- Put Nginx in front of the Spring Boot app for TLS termination, with explicit
  HTTPS enforcement at the application layer.

### 6. Supporting APIs
- Built an S3-backed banner-image API with a configurable base URL.
- Added an operational health-check / server-status endpoint used to verify
  the service was live during the event.