## Overview

Boldmove is an all-in-one test-management service built for LG Electronics'
accessibility UX team, who run usability tests of appliances (dryers, water
purifiers) with testers with disabilities. Before, every test lived in Excel:
sheets were copied by hand, scores were tallied by hand, and comparing products or
tester groups meant more spreadsheets.

With Boldmove an admin uploads the Excel test sheet they already use, the system
turns it into an editable in-app test, testers evaluate on a tablet, and the
results roll up into per-task statistics (radar, by-classification, self vs.
competitor, pain points, word cloud) and back out to Excel for the business.

Built in 7 weeks as a 6-person KUSITMS corporate-project team (2 PM, 1 designer,
2 FE, 2 BE). I was Dev Lead and Backend Lead: around 400 commits and 58 merged
pull requests out of the backend's 614 commits and 111 PRs, plus 27 of the 28
test classes.

## Key Contributions

### 1. Project Bootstrap & Conventions
- Set up the issue/PR templates, a unified `ApiResponse` envelope, the
  `ErrorCode` enum + `GlobalExceptionHandler` pair (and a Thymeleaf page that lists
  every error code for the FE), JPA auditing, a `@CurrentUser` argument resolver,
  Swagger domain grouping with the JWT scheme, and a Discord webhook notifier.
- Maintained the seed data and Excel fixtures (`example.xlsx`, `example_error.xlsx`)
  the whole team developed against.

### 2. Excel Test-Sheet Import
- `POST /api/admin/test-templates/import`: metadata parser, guide-sheet extractor,
  body parser into draft models, entity builder with defaults, and header
  validation for targets and comments.
- Validation errors are accumulated and returned as one structured failure report
  (`IMPORTER_00x` codes with row/column detail) instead of failing on the first
  bad cell, so an admin fixes the sheet in one pass.
- Template versioning keyed on `(product_category, disability_type, version)` with
  an active flag, a template-selection API grouped by product, and test creation
  from a template with automatic subject numbering.

### 3. Admin Test Management
- Admin home (calendar, daily schedules, recent activity, progress), test detail,
  basic-info PATCH, attachments/links with URL validation, and the tester list.
- Full-tree structure bulk save (`PATCH /{testId}/structure`) that replaces the
  section/task/subtask/element tree in one request with nullable ids for new
  nodes; fixed several FK and lazy-loading bugs that surfaced on edit.

### 4. Tester-Side Lists, Schedules, Reports
- Tester home, schedule calendar, recent views, and the shared test list with
  role-based effective status (READY / COMPLETED / REPORT_DONE derived from report
  existence) and N+1-safe queries.
- Per-test report APIs: summary, score-average line and by-classification charts,
  top pain points, comment highlights, and remark CRUD; creating a report flips
  the test status.

### 5. Statistics Domain
- Built the common query layer first (filter resolver for product category,
  disability type, competitor inclusion, paging; projection-based repositories;
  a `StatisticsQueryFacade`), then the product and disability-type dashboards on
  top: radar, by-classification-code, self vs. competitor, by-package, pain-points
  top, word cloud + contents, highlight comments.
- Round-robin interleaving across disability types so comment and word-cloud
  views stay diverse instead of being dominated by the largest group.

### 6. Excel Export
- Statistics raw download: shared Apache POI workbook infra, 7 `/download/raw`
  endpoints with in-Excel auto-filters, chart sheets with safe axis scaling, and
  RFC-compatible `Content-Disposition` filenames.
- Admin result export, two iterations: v1 filled the original uploaded template
  using JSONB-stored cell anchors captured at import; v2 generates a 3-sheet
  workbook (basic info / results / attachment links) from a dedicated read model
  and zips S3 attachments alongside it. v1 was then removed.

### 7. Performance Testing & Hardening
- Wrote the k6 scripts and `PERFORMANCE_TEST.md`, measured 5 APIs on staging with
  Hibernate statistics.
- Export API: bulk-loaded element collections (142 queries to 16, -89%) and
  parallelized S3 downloads with `CompletableFuture` (p95 4.66s to 1.37s).
- Hotfixes for broken-client exceptions, zip error responses, and Redis container
  networking in the deploy.

### 8. Keyword Extraction Prototype (AI server)
- Prototyped a Korean comment keyword pipeline for the word cloud: Kiwi POS
  tagging with compound-noun chunking, noun 2-gram candidates, a SQLite keyword
  registry issuing stable group keys, rapidfuzz near-duplicate merging, and a
  FastAPI batch endpoint with a Spring callback. Evaluated against tester-comment
  fixtures; the shipped word cloud ended up computed on the backend instead.
