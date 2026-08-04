## Overview

Logue is a natural-language analytics service for practitioners who don't want to
translate business questions into SQL or BI filters by hand. 

A user uploads a CSV,
asks a question in plain language, and the system structures that question into an
explicit, editable analysis spec (metric, date range, group-by, filters), flags
ambiguity or data-quality conflicts before computing anything, and returns results
alongside the reasoning behind them. 

I owned the backend service layer and the AI
server's LLM analysis pipeline end to end, across roughly 320 commits and 90+ merged
pull requests.

## Key Contributions

### 1. Project Bootstrap & Infrastructure
- Initialized the monorepo (merged the separately-developed fe/be/ai repos via
  git subtree-style imports) and set up the shared CI/CD, CODEOWNERS, and issue/PR
  templates used by the whole team.
- Built the initial Docker-based deploy pipeline to AWS (EC2/ECR/SSM) and fixed a
  GitHub Actions OIDC audience misconfiguration that was breaking AWS auth in CI.
- Added a Discord webhook integration for build/error notifications and issue
  labeling automation.
- Designed and iterated the database ERD (v2 → v3) with the team during early
  domain modeling.
- Built a weekly, LLM-driven "refactor scan" GitHub Action: it collects a scoped
  code context per part (fe/be/ai), runs it through an LLM to surface refactor
  candidates, and auto-files issues — including hardening around `ARG_MAX` limits,
  workflow permissions, and prompt scope carve-outs.

### 2. Backend (Spring Boot) — Domain & API Layer
- Implemented the **DataSource** module end to end: S3-backed CSV storage, a CSV
  preview extractor, owner-scoped list/sort/pagination, and CRUD endpoints —
  migrating auth from a header-based `X-User-Id` scheme to JWT.
- Built the **analysis criteria** and **analysis result** APIs: create/read/update/
  cancel/status-poll for criteria, async result derivation with an in-memory CSV
  aggregation service, and FastAPI client integration for delegating LLM calls.
- Implemented OAuth2 login/logout with a custom resolver for `prompt=select_account`
  and Google-only prompt handling, plus first-time-user onboarding redirects.
- Hardened error handling across the API: mapped previously-500 failures (missing
  query params, type mismatches, constraint violations, deleting a data source still
  referenced by an analysis) down to correct 400/404/409 responses with dedicated
  error codes.
- Fixed concurrency/data-integrity bugs in the async result pipeline: duplicate
  column inserts, a transaction race on result writes, and a
  `LazyInitializationException` from cross-thread entity access.
- Performance pass on the summary endpoint: eliminated an N+1 column query, added a
  missing index for data-warning lookups, and deduplicated repeated `validateAccess`
  queries in the analysis flow.

### 3. AI Server (FastAPI) — LLM Analysis Pipeline
- Designed and implemented the three core LLM-backed endpoints: **file analysis**
  (CSV column role inference), **question analysis** (natural language → structured
  analysis criteria), and **result summary** (structured results → narrative
  explanation) — each with Pydantic request/response contracts, input validation,
  and OpenAPI error specs.
- Built the shared **LLMClient** abstraction (Structured Outputs + single retry) and
  refactored prompt handling into a dedicated `prompts/` module with a prompt loader,
  replacing ad hoc inline prompts.
- Built a **business validation rules** layer (`rules/`) as a facade over metric,
  column, and warning rules, enforcing catalog consistency between what the LLM
  proposes and what the dataset actually supports.
- Built an **observability** layer (`LLMEventBuilder`) emitting structured events for
  every LLM call — token usage, estimated cost in USD, hashing/redaction of
  sensitive fields, and de-duplication guards against double-emission.
- Built an **eval harness** (`eval/`: loader, runner, scoring, CLI) and authored 60+
  golden test cases across file analysis, question analysis, and result summary,
  including dual-track scoring for cases with more than one acceptable LLM output.
- Iteratively hardened the question-analysis prompt against real failure modes
  surfaced by the eval harness: deterministic warning inference for null-heavy
  columns, conflicting date fields, and mismatched question/data signals; reduced
  false positives (e.g. numeric-column overlap incorrectly flagged as
  `QUESTION_DATA_MISMATCH`) and false negatives (ambiguous group-by, mixed intent,
  unsupported metric/period combinations) across several review-driven prompt
  revisions.

### 4. Documentation
- Wrote AI-developer handoff guides for each new endpoint (file analysis, criteria
  resolution, result summary) so backend/AI ownership could hand off cleanly.
- Wrote the CONTRIBUTING guide (branch strategy, commit convention, local run
  instructions) and iterated on the top-level README structure.