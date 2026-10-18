## Overview

Hear Here turns a sentence ("rain on a tent, far-off thunder, a crackling
fire") into an ASMR mix. The backend asks GPT to split the prompt into music
and sound descriptors, generates an instrumental track through the Suno API,
pulls matching ambient clips from an S3 sound library, titles the result, and
lets signed-in users save and re-tune their mixes.

The team had already been selected for Ewha's ORDA incubation program when I
joined mid-way, remotely from Sweden during my exchange semester. I owned the
backend alone next to one frontend developer: 64 commits and 15 pull requests
over about 3 months. It is a student-sized backend and I was not at my best
that semester, which is exactly why the lessons below stuck.

## What I Built, Briefly

- OAuth2 login (Google, Kakao, Naver), JWT access/refresh tokens, logout via a
  Redis token blacklist.
- The generation pipeline: GPT prompt to JSON, async Suno music generation
  with a callback, tag-based sound search on S3, a second GPT call for the
  title.
- A user library (save, list, update sounds and title) and an hourly job that
  deletes unsaved mixes older than 24 hours.

## Firsts

Calling an LLM from a server and parsing its output. An async third-party job
with a callback endpoint. OAuth2 with three providers. Redis. A scheduled job.
Working with a teammate 8 hours away.

## What I Would Do Differently, and What I Did About It

### Waiting on a callback in memory
Suno is asynchronous, so the generate request posted a job and blocked on a
`CompletableFuture` stored in a `ConcurrentHashMap` until the callback arrived.
It worked on one EC2 box. A restart lost every in-flight request, and a second
instance would never have seen the callback.
- **Since then**: knewit's card-sync worker keeps job stage and progress in
  database columns, exposes a status endpoint, and pushes a notification on
  completion, so clients poll state instead of holding a connection open, and a
  restart resumes rather than forgets.

### Trusting the LLM to return JSON
The system prompt said "respond in English JSON". Sometimes it did not, and
PR #13 is me tightening the prompt after parsing failures in production.
- **Since then**: Glit's tagging pipeline moved the parts that do not need an
  LLM (the per-role weight table) into code, expanded the backtick-stripping
  regex after measuring that it caused 6 of 10 retries, and put an evaluation
  harness in front of every prompt change so "it seems better" became recall
  and cost numbers.

### Redirect logic debugged in production
Post-login redirects were chosen by `env` and `action` query parameters
carried through the session. Five commits across November and December are
local/prod mix-ups found by the frontend after deploy.
- **Since then**: Glit maps branch to environment deterministically in CI
  (`dev` to staging, `master` to prod) and keeps environment-specific values
  in SSM rather than request parameters, so there is one place for the
  difference to live and it is not the browser.

### Auth that was correct but not safe
JWT and refresh tokens worked. Refresh tokens sat in MySQL in plaintext, with
no rotation and no reuse detection.
- **Since then**: Glit hashes refresh tokens with SHA-256 before storage,
  rotates them with a Lua-script atomic compare-and-swap in Redis, and deletes
  the stored token on a failed rotation so a stolen token cannot be replayed.

### One placeholder test
Same lesson as the festival booth a few months earlier, not yet learned. The
pipeline had five external calls and no way to run it without them.
- **Since then**: coverage gates in CI on every team project after this one,
  and for the LLM parts specifically, fixtures and scoring instead of manual
  checks.

### Remote work made me write PR descriptions
With an 8-hour time difference, every integration question waited a day unless
the PR already answered it. This is where I started writing PRs with the what,
the why, and how to test, which is the habit I am most glad I kept.
- **Since then**: Glit's and knewit's contributing guides and PR templates
  formalize the same structure for the whole team.
