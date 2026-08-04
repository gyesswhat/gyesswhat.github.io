## Overview

GLIT is a career-journaling service for people who want to turn scattered daily
work into a structured career record without manually organizing it themselves.

A user logs a 5-minute daily scrum, expands notable entries into a STAR-format deep
record, and the system infers competency tags from that record via an LLM, rolling
everything up into a career report (strengths, narrative, interview prep) over time.

I owned the Spring Boot backend end to end and independently drove performance
verification and the AI server's tagging evaluation pipeline, across roughly 313
commits and 62 merged pull requests.

## Key Contributions

### 1. Project Bootstrap & Infrastructure
- Wrote the initial `CONTRIBUTING.md` (branch strategy, commit convention, Swagger/
  Flyway/JaCoCo authoring guides) and set up the GitHub issue/PR templates the team
  used from day one.
- Built the deploy pipeline: keyless OIDC AssumeRole to AWS (no long-lived keys),
  Gitleaks + Trivy scanning, a JaCoCo coverage gate (60% line, CI-required) plus
  spotless formatting, deterministic branch→environment mapping (`dev`→staging,
  `master`→prod), and agentless SSM-based EC2 deployment with a manual rollback
  workflow.
- Automated issue→branch naming (english-slug suffix on issue titles becomes the
  branch slug) and wired up Jira issue-creation and dev/master auto-sync workflows.
- Rebuilt the deploy image as a multi-stage, layered Dockerfile after the original
  938MB image failed to deploy on the team's resource-constrained 1GB staging
  instance.

### 2. Backend (Spring Boot) — Auth & Security
- Designed the stateless auth flow: OAuth2 social login (Kakao/Google/Naver) issuing
  first-party JWTs (access/refresh split), removing per-request DB lookups.
- Rebuilt refresh-token storage around Redis: tokens are hashed with SHA-256 before
  storage (no plaintext exposure on Redis compromise), rotated via a **Lua-script
  atomic CAS** to close a race condition between concurrent refresh requests, with
  reuse detection that deletes the stored token on a failed rotation (RTR defense).
- Hashed stored social-account emails with HMAC-SHA-256 and migrated existing data.
- Enforced fail-fast config validation (compact constructors) for JWT secrets and DB
  credentials so misconfiguration fails at boot, not at request time, in prod.
- All secrets injected at deploy time via SSM SecureString (KMS) — never baked into
  images or the repo.

### 3. Performance Testing & Verification
- Independently designed and built a k6-based load-testing harness (separate from
  the app repo) to put numbers behind performance work rather than estimates: k6 +
  Prometheus/Grafana + Spring Actuator metrics against staging, self-minting JWTs
  from the same secret the server verifies (via SSM) so runs don't depend on social
  login, at ramp-up(20s)→hold(40s)→ramp-down(10s) / ~50 VUs / ~20K requests per run.
- Measured the team's Redis caching rollout end-to-end: overall p95 **213ms → 118ms
  (-45%)** at constant throughput and 0% failure rate, with per-endpoint gains from
  -36% to -62%.
- Root-caused and fixed a bug this testing surfaced: a cache-hit path returned 500s
  due to missing per-cache type information during deserialization.
- Independently verified N+1 safety across all 7 read endpoints by instrumenting
  Hibernate's prepared-statement counter and confirming query counts stayed constant
  as row counts scaled — turning an architectural claim into a measured guarantee.

### 4. AI Server — Tagging Evaluation & Prompt Iteration (FastAPI / Claude)
- Owned the tagging feature end to end on the AI side: prompt design, the
  evaluation harness, and iteration based on measured results (LLM: Claude Haiku).
- Built a from-scratch eval pipeline (fixtures, scoring, auto-generated metrics
  reports) to replace guesswork with quantitative comparison across prompt versions.
- **v1 → v2 iteration**, backed by a 10-case pilot then a 48-case extended set:
  moved the per-role competency-weight table out of the prompt into a code-side
  post-scoring step (-1,500 input tokens, decoupling weight tuning from LLM
  non-determinism), and expanded the backtick-stripping regex after finding it
  caused 6 of 10 retries on single-backtick-wrapped responses.
- **Results:** required-tag recall 53.3% → 65.6%, cost per call 8.0원 → 3.4원
  (-57%), input tokens 5,431 → 2,175 (-60%), parse/LLM-call failures 0.
- Documented per-role and per-category variance, identified single-answer scoring
  as understating true output quality, and proposed rubric-based LLM-as-judge
  evaluation plus multi-run averaging to separate real gains from ~±5–7%p LLM
  non-determinism noise.