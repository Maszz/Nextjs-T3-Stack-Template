import { z } from 'zod';

import { router, publicProcedure, authedProcedure } from '../trpc';
import { hash } from 'argon2';
export const registerRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, password, username } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { email },
      });
      console.log(user);
      if (!user) {
        const hashCred = await hash(password);
        // in real production, username must be user input not is user email
        const newUser = await ctx.prisma.user.create({
          data: {
            email,
            username: username,
            accounts: {
              create: {
                type: 'Credentials',
                provider: 'Credentials',
                providerAccountId: email,
                credentials: hashCred,
              },
            },
          },
        });

        return newUser;
      }
      console.log('endof func');

      const acc = await ctx.prisma.account.findFirst({
        where: { provider: 'Credentials', providerAccountId: email },
      });
      console.log('acc', acc);
      if (acc) {
        throw new Error('Email already in use');
      }
      const hashCred = await hash(password);
      //   const newAcc = await ctx.prisma.user.create({
      //     data: {
      //       accounts: {
      //         create: {
      //           type: 'Credentials',
      //           provider: 'Credentials',
      //           providerAccountId: email,
      //           credentials: hashCred,
      //         },
      //       },
      //     },
      //   });
      const newAcc = await ctx.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          accounts: {
            create: {
              type: 'Credentials',
              provider: 'Credentials',
              providerAccountId: email,
              credentials: hashCred,
            },
          },
        },
      });
      console.log('newAcc', newAcc);
      //   const newAcc = await ctx.prisma.account.create({
      //     data: {
      //       type: 'Credentials',
      //       provider: 'Credentials',
      //       providerAccountId: email,
      //       credentials: hashCred,
      //       user: {
      //         connect: {
      //           id: user.id,
      //         },
      //       },
      //     },
      //   });

      return newAcc;
    }),
});
