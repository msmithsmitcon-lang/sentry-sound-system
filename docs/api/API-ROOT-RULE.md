# API Root Rule

This repo currently has two route trees:

- app/api = ACTIVE Next.js API route system
- src/app/api = inactive or legacy route tree

## Rule
All new Sentry Sound API routes must be created under:

app/api/*

Do not create new routes under:

src/app/api/*

## Reason
Next.js is currently serving from the root-level app directory.
