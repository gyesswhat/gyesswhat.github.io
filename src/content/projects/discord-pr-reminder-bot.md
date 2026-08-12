## Overview

ReviewPlz is a Discord bot that watches GitHub PR events and keeps review
turnaround from stalling: it posts an embed with a teammate mention when a PR
opens, escalates with staged reminders if it sits unreviewed, and goes quiet
the moment an `approved` review lands. Built as a fork-and-deploy template —
any team can stand up their own instance with just Discord bot credentials
and a webhook secret.

## Key Contributions

### 1. GitHub → Discord Webhook Pipeline
- Built an Express webhook receiver that verifies GitHub's HMAC signature
  against `GITHUB_SECRET` before processing anything, rejecting unsigned or
  mismatched requests with a 401.
- Handled `pull_request` (opened) and `pull_request_review` (approved)
  events end-to-end, resolving GitHub usernames to Discord user IDs through
  a configurable `USER_MAP` — env-var JSON in production, a gitignored local
  JSON file in dev — so mentions work correctly in either environment.

### 2. Reminder Scheduling
- Implemented a `node-cron`-based scheduler that tracks each open PR's age
  and fires staged nags at 6h / 11h / >12h unreviewed, stopping automatically
  the moment an `approved` review comes in.
- Kept PR state in a simple in-memory `Map` (`store.js`), accepting
  restart-resets state as a reasonable tradeoff for a short review-cycle
  tool rather than reaching for a database.

### 3. Deployability & Docs
- Exposed a `/health` endpoint wired into Railway's health-check path so a
  broken deploy gets caught before traffic is routed to it.
- Wrote the full setup path as documentation, not tribal knowledge: Discord
  bot/OAuth2 scope creation, channel/user ID lookup, webhook secret
  generation, and Railway env-var deployment — so a teammate can fork and
  run their own instance without asking me anything.