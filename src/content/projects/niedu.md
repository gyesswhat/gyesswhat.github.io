## Overview

NIEdu turns everyday news consumption into a learning habit: it structures news
content into literacy and current-affairs exercises, personalizes them per user,
and layers in gamification (streaks, favorites, progress tracking) and
AI-generated feedback. 

I was the primary backend developer, responsible for
roughly three-quarters of the repository's commit history — from initial project
scaffolding through the core learning domain, authentication, and production
stabilization around a live demo.

## Key Contributions

### 1. Project Bootstrap & Infrastructure
- Set up the initial Spring Boot project structure, GitHub Actions CI/CD pipeline,
  and Docker-based deploy workflow to AWS.
- Configured global Security and Swagger setup, split local/production
  `application.properties`, and built a common API response wrapper and global
  exception handling.
- Iterated the JPA entity model from scratch through two rounds of ERD revision
  as the domain (courses/sessions/steps/content) firmed up with the team.

### 2. Authentication & User Management
- Implemented Kakao OAuth2 login end-to-end: cookie-based user context
  extraction, `/api/user/me`, and preferred-topic capture during onboarding.
- Debugged and hardened OAuth in production over several iterations: fixed lost
  `client` values mid-authorization via a custom `AuthorizationRequestRepository`,
  resolved redirect-URI and forwarded-header handling behind the deploy proxy,
  fixed a login loop by correcting the session-creation policy, and normalized
  cookie-domain handling across environments.

### 3. Core Learning Domain (Course → Session → Step)
- Designed and built the polymorphic content/answer model: a `Strategy` +
  `Mapper` pattern (`ContentMapperStrategy`/`ContentMapper`,
  `UserAnswerMapperStrategy`/`AnswerMapper`) so different step types (quiz,
  summary-reading, sentence-completion, etc.) share one pipeline instead of
  type-specific branches scattered through the service layer.
- Implemented the course/session/step read APIs and the answer-submission flow,
  including StudiedSession/StudiedStep tracking, progress and attendance-streak
  updates, and NPE/edge-case fixes surfaced during real usage
  (missing steps at session start, double-counted progress, sort-order bugs).
- Built the AI-content ingestion pipeline: a scheduler
  (`AIDataScheduler`) that periodically requests and loads AI-generated
  exercises and feedback, plus a dedicated feedback-request API for
  sentence-completion questions.
- Implemented the Favorites module (saved courses/terms) and iteratively
  refactored the surrounding repository layer (`List` → `Page`, ID-based
  parameters replaced with entity references) to align with JPA conventions
  and remove duplicated query logic between `CourseRepository` and
  `SavedCourseRepository`.

### 4. Home, Search & My Page
- Implemented the home-feed, search/search-history, and my-page APIs, and later
  reworked the home "latest news" logic and search criteria after issues
  surfaced in the deployed version.

### 5. Production Stabilization
- Resolved a string of live-demo and post-launch issues: CORS/preflight
  failures, a scheduler time-zone bug, Sentry build/version integration,
  DB DDL/dialect misconfiguration, and JSON field-name mismatches between the
  AI service and the persistence layer.

### 6. API Documentation
- Polished the Swagger/OpenAPI surface: added descriptions and tags per
  endpoint, marked authenticated routes, hid health-check/test-only endpoints
  from the public docs, and added request/response examples and schemas.