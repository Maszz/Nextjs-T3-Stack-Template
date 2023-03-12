"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("next/router"));
const useCountdown_1 = require("../hooks/useCountdown");
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
function Header() {
    const countDown = (0, useCountdown_1.useCountdown)(5, () => {
        router_1.default.replace('/api/redirect/');
    });
    return (<div>
      <p>Redirect to Home in {countDown} ... </p>
    </div>);
}
exports.default = Header;
