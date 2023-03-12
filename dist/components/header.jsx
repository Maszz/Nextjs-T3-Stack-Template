"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("next-auth/react");
const header_module_css_1 = __importDefault(require("./header.module.css"));
const router_1 = require("next/router");
const redirectContainer_1 = __importDefault(require("./redirectContainer"));
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
function Header() {
    const { data: session, status } = (0, react_1.useSession)();
    const r = (0, router_1.useRouter)();
    const loading = status === 'loading';
    return (<header className={header_module_css_1.default.header}>
      <div className={header_module_css_1.default.signedInStatus}>
        <p className={`nojs-show ${!session && loading ? header_module_css_1.default.loading : header_module_css_1.default.loaded}`}>
          {(session === null || session === void 0 ? void 0 : session.user) && (<>
              {session.user.image && (<span style={{ backgroundImage: `url('${session.user.image}')` }} className={header_module_css_1.default.avatar}/>)}
              <span className={header_module_css_1.default.signedInText}>
                {/* <small>Signed in as</small> */}
                <br />
                {/* <strong>{session.user.email ?? session.user.name}</strong> */}
                {session && <redirectContainer_1.default />}
              </span>
              <a href={`/api/auth/signout`} className={header_module_css_1.default.button} onClick={(e) => {
                e.preventDefault();
                (0, react_1.signOut)();
            }}>
                Sign out
              </a>
            </>)}
        </p>
      </div>
    </header>);
}
exports.default = Header;
