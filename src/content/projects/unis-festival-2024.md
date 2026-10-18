## Overview

A small site for the booth UNIS ran at Ewha's 2024 spring festival (May 8 to
10). Visitors pre-ordered from a 5-item menu into one of 12 pickup slots
(3 days x 4 times, 10 orders per slot), booth staff pulled the order list from
an admin page, and visitors left reviews with photos afterwards.

I was the only backend developer, with two frontend teammates. Built in 6 days
right before the booth opened: 51 commits, 9 pull requests. This was my first
Spring Boot service deployed end to end, so most of what is here was a first.

## What I Built

- **Reservations**: slot availability computed from a cutoff time and a
  per-slot count query (open only if before cutoff and under 10 orders), and a
  create endpoint that validates fields, slot range, and capacity.
- **Reviews**: title, body, 0 to 5 rating, nickname, 4-digit password, and
  optional photos uploaded to S3 with UUID filenames; newest-first list and a
  "latest 5" brief variant for the landing page.
- **Admin list**: every order with readable time labels for the staff at the
  booth.
- **Deploy glue**: RDS datasource config, an EC2 health-check endpoint for the
  target group, and CORS for the Vercel frontend.

## Firsts

- Deploying a Spring Boot app to EC2 with RDS, S3, and Route 53.
- A JPA relationship (`ReviewImage` to `Review`) and native queries with
  `@SqlResultSetMapping` DTO projection, using `GROUP_CONCAT` to fold images
  into one row per review.
- Multipart file upload and the S3 SDK (content type and length metadata, the
  "content length not set" warning included).
- CORS debugging against a separately deployed frontend, and the fix cycle on
  launch eve: null checks on requests, rating and password validation, a
  changed pickup time.
- Working in feature branches with a PR template and conventional commit types.

What I would do differently now: tests (they were disabled in Gradle), real
auth on the admin endpoint, and secrets out of `application.properties`.
