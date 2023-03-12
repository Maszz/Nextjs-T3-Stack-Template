# Nextjs FullStack Template

> ℹ️ Public Template for Next.js FullStack Template ℹ️
> This is my version of T 3 Stack . For Starting project
> ℹ️ This repo use Trpc subscription feature this make this stack not support serverless api anymore (Vercel and other with api serverless)

- Learn more about this stack https://create.t3.gg/

  
  

## Features

- 🧙‍♂️ E2E type safety with [tRPC](https://trpc.io)

- ⚡ Full-stack React with Next.js

- ⚡ WebSockets / Subscription support

- ⚡ Database with Prisma

- 🔐 Authorization using [next-auth](https://next-auth.js.org/)

- ⚙️ VSCode extensions

- 🎨 ESLint + Prettier

- 💚 CI setup using GitHub Actions:

- ✅ E2E testing with [Playwright](https://playwright.dev/)

- ✅ Linting

- ⚡ Zustand for State management

  

## Deployment

  
### Using [Render](https://render.com/)

  

The project contains a [`render.yaml`](./render.yaml) [*"Blueprint"*](https://render.com/docs/blueprint-spec) which makes the project easily deployable on [Render](https://render.com/).

  

Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints) and connect to this Blueprint and see how the app and database automatically gets deployed.


## Commands

  

```bash

yarn build # runs `prisma generate` + `prisma migrate` + `next build`

yarn db-nuke # resets local db

yarn dev # starts next.js + WebSocket server

yarn dx # starts postgres db + runs migrations + seeds + starts next.js

yarn test-dev # runs e2e tests on dev

yarn test-start # runs e2e tests on `next start` - build required before

yarn test:unit # runs normal jest unit tests

yarn test:e2e # runs e2e tests

```

---

  

