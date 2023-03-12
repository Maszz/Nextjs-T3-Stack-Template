"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const prisma_1 = require("../../../server/prisma");
const auth_1 = require("../../../validation/auth");
const argon2_1 = require("argon2");
const zod_1 = require("zod");
let useMockProvider = process.env.NODE_ENV === 'test';
const { GITHUB_CLIENT_ID, GITHUB_SECRET, NODE_ENV, APP_ENV } = process.env;
if ((NODE_ENV !== 'production' || APP_ENV === 'test') &&
    (!GITHUB_CLIENT_ID || !GITHUB_SECRET)) {
    console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
    useMockProvider = false;
}
const providers = [];
if (useMockProvider) {
    // providers.push(
    //   CredentialsProvider({
    //     id: 'github',
    //     name: 'Mocked GitHub',
    //     async authorize(credentials) {
    //       if (credentials) {
    //         const user = {
    //           id: credentials.name,
    //           name: credentials.name,
    //           email: credentials.name,
    //           username: credentials?.name || 'asd',
    //           credType: 'credential',
    //         };
    //         return user;
    //       }
    //       return null;
    //     },
    //     credentials: {
    //       name: { type: 'test' },
    //       idname: { type: 'test' },
    //     },
    //   }),
    // );
}
else {
    if (!GITHUB_CLIENT_ID || !GITHUB_SECRET) {
        throw new Error('GITHUB_CLIENT_ID and GITHUB_SECRET must be set');
    }
    // providers.push(
    //   GithubProvider({
    //     clientId: GITHUB_CLIENT_ID,
    //     clientSecret: GITHUB_SECRET,
    //     profile(profile, tokens) {
    //       console.log(profile);
    //       return {
    //         id: profile.id,
    //         name: profile.login,
    //         email: profile.email,
    //         image: profile.avatar_url,
    //         credType: 'oauth',
    //         provider: 'github',
    //       } as any;
    //     },
    //   }),
    // );
}
providers.push(
// credentials notwork with adapter
(0, credentials_1.default)({
    // The name to display on the sign in form (e.g. "Sign in with...")
    id: 'Credentials',
    name: 'Credentials',
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
        email: {
            label: 'Email',
            type: 'email',
            placeholder: 'jsmith@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials, req) {
        var _a;
        // Add logic here to look up the user from the credentials supplied
        try {
            const { email, password } = await auth_1.loginSchema.parseAsync(credentials);
            const result = await prisma_1.prisma.user.findFirst({
                where: { email },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    accounts: {
                        where: { provider: 'Credentials' },
                        select: {
                            id: true,
                            provider: true,
                            credentials: true,
                        },
                    },
                },
            });
            if (!result)
                throw new Error('Invalid account');
            if (!result.accounts[0])
                return null;
            const cred = result.accounts[0].credentials || '';
            const isValidPassword = await (0, argon2_1.verify)(cred, password);
            if (!isValidPassword)
                throw new Error('Invalid password');
            return {
                id: result.id,
                email,
                username: result.username || 'asd',
                name: result.username || 'asd',
                credType: 'credential',
                provider: 'Credentials',
            };
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const e = (_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.message;
                throw new Error(e);
            }
            const e = error;
            throw new Error(e.message);
            return null;
        }
    },
}));
providers.push((0, github_1.default)({
    clientId: GITHUB_CLIENT_ID || 'asd',
    clientSecret: GITHUB_SECRET || 'asd',
    profile(profile, tokens) {
        // console.log(profile);
        return {
            id: profile.id,
            name: profile.login,
            email: profile.email,
            image: profile.avatar_url,
            credType: 'oauth',
            provider: 'github',
        };
    },
}));
exports.authOptions = {
    // Configure one or more authentication providers
    callbacks: {
        jwt: async ({ token, user }) => {
            // console.log('jwt', token, user);
            if (!user) {
                return token;
            }
            if (user.credType === 'credential') {
                token.name = user.name;
                token.userId = user.id;
                token.email = user.email;
                token.username = user.username;
                return token;
            }
            const userInDb = await prisma_1.prisma.user.findFirst({
                where: {
                    email: user.email,
                },
            });
            // new user to website
            if (!userInDb) {
                const newUser = await prisma_1.prisma.user.create({
                    data: {
                        email: user.email,
                        username: user.name,
                        accounts: {
                            create: {
                                type: 'oauth',
                                provider: user.provider,
                                providerAccountId: `${user.id}`,
                            },
                        },
                    },
                });
                token.name = user.name;
                token.userId = newUser.id;
                token.email = user.email;
                token.username = user.username;
            }
            if (userInDb && user.credType === 'oauth') {
                // TODO : check is user.id(oauth) is same as oauthAccount.userId(mean id in oauth) if not create once and connect it to user
                const acc = await prisma_1.prisma.account.findFirst({
                    where: {
                        provider: user.provider,
                        providerAccountId: `${user.id}`,
                    },
                });
                // have an account from credential but not oauth connect
                if (!acc) {
                    const newAcc = await prisma_1.prisma.account.create({
                        data: {
                            type: 'oauth',
                            provider: user.provider,
                            providerAccountId: `${user.id}`,
                            user: {
                                connect: {
                                    id: userInDb.id,
                                },
                            },
                        },
                    });
                    token.name = userInDb.username;
                    token.userId = userInDb.id;
                    token.email = user.email;
                    token.username = user.username; // bug here
                }
                else {
                    token.name = userInDb.username;
                    token.userId = userInDb.id;
                    token.email = user.email;
                    token.username = userInDb.username || ''; // bug here
                }
            }
            // MARK: - 25 jan 20223 18:38 : Don't know why i do this and didn't test its
            if (user.credType === 'oauth') {
                token.userId = user.id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        session: async ({ session, token }) => {
            console.log('session', session);
            if (token) {
                session.user.userId = token.userId;
                session.user.email = token.email;
                session.user.username = token.username;
            }
            console.log(session);
            return session;
        },
    },
    // adapter: PrismaAdapter(prisma),
    providers,
    pages: {
        signIn: '/auth/signin',
    },
    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },
};
exports.default = (0, next_auth_1.default)(exports.authOptions);
