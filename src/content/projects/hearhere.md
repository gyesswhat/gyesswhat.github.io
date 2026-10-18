## Overview

Hear Here is a web service that turns a sentence ("rain on a tent, far-off
thunder, a crackling fire") into an ASMR mix. The backend asks GPT to break the
prompt into music and sound descriptors, generates an instrumental track through
the Suno API, pulls matching ambient clips from an S3 sound library, titles the
result, and lets signed-in users save and re-tune their mixes.

This was an Ewha startup team that had already been selected for the ORDA
incubation program. I joined mid-way, remotely from Sweden during my exchange
semester, and owned the backend alone next to one frontend developer:
64 commits and 15 pull requests over about 3 months. It is a small, student-sized
backend, and some of it I would build differently today.

## What I Built

### Auth
- OAuth2 login with Google, Kakao, and Naver; first-login user creation keyed
  by provider id.
- JWT access/refresh tokens with refresh tokens persisted in MySQL and a
  reissue endpoint; stateless sessions behind a `JwtAuthenticationFilter`.
- Logout via a Redis-backed access-token blacklist.
- A post-login redirect map keyed by environment and action (local/prod,
  basic/save) carried through the session, which took several rounds of fixes
  to get right across the Vercel and local frontends.

### Generation Pipeline
- `POST /asmr/generate`: GPT system prompt that forces English JSON with
  `music` and `sound` arrays, optional Suno music generation, sound search, a
  second GPT call for the title, and a provisional row saved before the user
  decides to keep it.
- Suno is asynchronous: the job is posted with a callback URL, and a
  `CompletableFuture` held in an in-memory map lets the original request wait
  for the "complete" callback. Single-instance only, which was fine for the
  team's one EC2 box.
- Prompt tuning when GPT output broke JSON parsing, and random example prompts
  for the empty state.

### Sound Library and User Library
- Native query matching a category plus up to 3 tags, de-duplicated and mapped
  to S3 URLs with durations computed from WAV/MP3 headers.
- Save, list, and update endpoints for a user's mixes (sound set, volumes,
  positions, title), and an hourly scheduler that deletes unsaved mixes older
  than 24 hours.

### Hygiene
- Unified `ApiResponse` with success/error status codes and a global exception
  handler, a health-check endpoint for the load balancer, and the README and
  PR template.

## Looking Back

Working across an 8-hour time difference meant most integration happened
asynchronously over PR descriptions, which is where I started writing them
properly. Things I would change now: tests (there is one placeholder), a
durable job store instead of the in-memory callback map, and config-validated
secrets instead of properties files.
