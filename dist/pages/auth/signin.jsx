"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const react_1 = require("next-auth/react");
const Signin_module_css_1 = __importDefault(require("../../styles/Signin.module.css"));
const header_1 = __importDefault(require("../../components/header"));
const image_1 = __importDefault(require("next/image"));
const react_2 = require("react");
const router_1 = require("next/router");
const trpc_1 = require("../../utils/trpc");
function SignIn({ providers, csrfToken, }) {
    const [userInput, setUserInput] = (0, react_2.useState)({ email: '', password: '' });
    const { data: session, status } = (0, react_1.useSession)();
    const register = trpc_1.trpc.register.register.useMutation();
    const r = (0, router_1.useRouter)();
    // if (status === 'authenticated') {
    //   Router.push('/');
    // }
    (0, react_2.useEffect)(() => {
        // use this on loggin instancely redirect to home
        // use case in register page need to redirect to coundown page then reirect to home
        console.log('session', session);
        // if (session) {
        //   r.replace('/api/redirect/');
        // }
    }, [session]);
    return (<div style={{ overflow: 'hidden', position: 'relative' }}>
      <header_1.default />
      <div className={Signin_module_css_1.default.wrapper}/>
      <div className={Signin_module_css_1.default.content}>
        <div className={Signin_module_css_1.default.cardWrapper}>
          <image_1.default src="/katalog_full.svg" width={196} height={64} alt="App Logo" style={{ height: '85px', marginBottom: '20px' }}/>
          <div className={Signin_module_css_1.default.cardContent}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
            <input placeholder="Email (Not Setup - Please Use Github)" size={30} value={userInput.email} onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}/>
            <input placeholder="password (Not Setup - Please Use Github)" size={30} value={userInput.password} onChange={(e) => setUserInput({ ...userInput, password: e.target.value })}/>
            <button className={Signin_module_css_1.default.primaryBtn} onClick={async () => {
            try {
                console.log('invoke button');
                const res = await (0, react_1.signIn)('Credentials', {
                    email: userInput.email,
                    password: userInput.password,
                    callbackUrl: '/',
                    redirect: false,
                });
                if (res === null || res === void 0 ? void 0 : res.error) {
                    console.log('error', res.error);
                }
            }
            catch (e) {
                console.log('error', e);
            }
        }}>
              Submit
            </button>
            <button className={Signin_module_css_1.default.primaryBtn} onClick={async () => {
            console.log('invoke button');
            try {
                const res = await register.mutateAsync({
                    email: 'mawin38408@gmail.com',
                    password: '01277022',
                    username: 'mawin',
                });
                console.log('res', res);
            }
            catch (e) {
                console.log('error', e);
            }
        }}>
              Register
            </button>
            <hr />
            {providers &&
            Object.values(providers).map((provider) => {
                if (provider.type === 'credentials' &&
                    provider.name === 'Credentials') {
                    return null;
                }
                return (<div key={provider.name} style={{ marginBottom: 0 }}>
                    <button onClick={() => (0, react_1.signIn)(provider.id, { callbackUrl: '/' })}>
                      Sign in with {provider.name}
                    </button>
                  </div>);
            })}
          </div>
        </div>
      </div>
      <image_1.default src="/login_pattern.svg" alt="Pattern Background" fill className={Signin_module_css_1.default.styledPattern}/>
    </div>);
}
exports.default = SignIn;
const getServerSideProps = async (context) => {
    const providers = await (0, react_1.getProviders)();
    const csrfToken = await (0, react_1.getCsrfToken)(context);
    console.log('Providers', providers);
    return {
        props: { providers, csrfToken },
    };
};
exports.getServerSideProps = getServerSideProps;
