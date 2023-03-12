"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
/**
 * This file contains the root router of your tRPC-backend
 */
const trpc_1 = require("../trpc");
// import { postRouter } from './post';
const observable_1 = require("@trpc/server/observable");
const timers_1 = require("timers");
const example_1 = require("./example");
const register_1 = require("./register");
exports.appRouter = (0, trpc_1.router)({
    healthcheck: trpc_1.publicProcedure.query(() => 'yay!'),
    example: example_1.exampleRouter,
    // post: postRouter,
    register: register_1.registerRouter,
    randomNumber: trpc_1.publicProcedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            const int = setInterval(() => {
                emit.next(Math.random());
            }, 500);
            return () => {
                (0, timers_1.clearInterval)(int);
            };
        });
    }),
});
