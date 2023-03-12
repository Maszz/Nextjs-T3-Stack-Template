"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const argon2_1 = require("argon2");
exports.registerRouter = (0, trpc_1.router)({
    register: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string(),
        password: zod_1.z.string(),
        username: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { email, password, username } = input;
        const user = await ctx.prisma.user.findUnique({
            where: { email },
        });
        console.log(user);
        if (!user) {
            const hashCred = await (0, argon2_1.hash)(password);
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
        const hashCred = await (0, argon2_1.hash)(password);
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
