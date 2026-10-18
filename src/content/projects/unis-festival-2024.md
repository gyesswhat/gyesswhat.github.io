## Overview

A small site for the booth UNIS ran at Ewha's 2024 spring festival (May 8 to
10). Visitors pre-ordered from a 5-item menu into one of 12 pickup slots
(3 days x 4 times, 10 orders per slot), booth staff pulled the order list from
an admin page, and visitors left photo reviews afterwards.

I was the only backend developer next to two frontend teammates, and this was
my first Spring Boot service deployed end to end: 6 days, 51 commits, 9 pull
requests. The code is simple. It is here because it was the first of two solo
backends that year (Hear Here followed that autumn), and looking back at both,
I can see where the habits I work by now came from.

## What I Built, Briefly

- Reservations with slot capacity and cutoff-time checks, and an admin order
  list with readable time labels.
- Reviews with a rating, a 4-digit password, and photos uploaded to S3.
- Deploy glue: RDS, an EC2 health-check endpoint, CORS for the Vercel frontend.

## Firsts

Deploying to EC2 with RDS, S3, and Route 53. A JPA relationship. Native queries
with DTO projection and `GROUP_CONCAT`. Multipart upload and the S3 SDK. CORS
against a separately deployed frontend. Feature branches with a PR template.

## What I Would Do Differently, and What I Did About It

### Validation arrived on launch eve, one bug at a time
Seven of the last-day commits are `fix:` for things like null requests, a
missing phone field, and an out-of-range rating. Each one was found by the
frontend, reported, and patched in isolation.
- **Since then**: Boldmove's Excel importer accumulates every validation error
  into one structured report instead of failing on the first bad cell, and
  Glit's config classes fail fast at boot with compact-constructor checks, so
  misconfiguration cannot wait for a request to surface.

### No tests, deliberately
Gradle had `tasks.withType(Test) { enabled = false }`. It saved minutes that
week and cost me every later change, because I had no way to know what I broke.
- **Since then**: Glit ships behind a JaCoCo line-coverage gate in CI, knewit
  behind a Kover gate plus ktlint and detekt, and Boldmove's 28 test classes
  are 27 of mine.

### Secrets in `application.properties`
RDS credentials and AWS key placeholders were committed. Nothing happened, but
only because nobody looked.
- **Since then**: knewit injects config from SSM Parameter Store and refuses to
  boot without it, Glit pulls secrets as SSM SecureString at deploy time, and
  both run gitleaks (knewit as a commit hook, Glit in CI) so a leak fails before
  it merges.

### An admin page with no auth
`GET /auth` was just a different URL. Fine for a three-day booth; not a pattern.
- **Since then**: Glit and Hear Here use JWT behind a filter chain, and Glit
  hashes refresh tokens and rotates them atomically in Redis.

### CORS and content-type fixes driven by the frontend
Four commits are CORS or header fixes discovered only after the frontend
deployed. I had no contract to check against, only error messages.
- **Since then**: Swagger/OpenAPI is the FE contract from day one (Boldmove,
  knewit with Orval codegen), and error codes are enumerated and listed on a
  page the frontend can read.

### Hard-coded dates and slots
The 12 slots were a `LocalDateTime[][]` literal. Changing the evening slot from
2:00 to 2:30 took a code deploy on launch eve.
- **Since then**: anything an operator might change lives in data. The 2025
  festival lucky-draw service managed prizes and events from an admin API
  instead of constants.

### The one thing I kept
Self-authored PR template and conventional commit types, on a one-person
backend, before anyone asked. Every team project since has started with the
same `.github` folder, and the Glit and knewit contributing guides grew out of
it.
