import { z } from 'zod';

import { router, publicProcedure, authedProcedure } from '../trpc';

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: authedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),
});
