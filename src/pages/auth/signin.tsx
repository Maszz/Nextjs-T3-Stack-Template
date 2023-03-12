import {
  getProviders,
  signIn,
  LiteralUnion,
  ClientSafeProvider,
  getCsrfToken,
  useSession,
} from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import { GetServerSideProps } from 'next';
import styles from '../../styles/Signin.module.css';
import Header from '../../components/header';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from 'next-auth/providers';

export default function SignIn({
  providers,
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [userInput, setUserInput] = useState({ email: '', password: '' });
  const { data: session, status } = useSession();
  const register = trpc.register.register.useMutation();
  const r = useRouter();
  // if (status === 'authenticated') {
  //   Router.push('/');
  // }

  useEffect(() => {
    // use this on loggin instancely redirect to home
    // use case in register page need to redirect to coundown page then reirect to home
    console.log('session', session);
    // if (session) {
    //   r.replace('/api/redirect/');
    // }
  }, [session]);

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <Header />
      <div className={styles.wrapper} />
      <div className={styles.content}>
        <div className={styles.cardWrapper}>
          <Image
            src="/katalog_full.svg"
            width={196}
            height={64}
            alt="App Logo"
            style={{ height: '85px', marginBottom: '20px' }}
          />
          <div className={styles.cardContent}>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              placeholder="Email (Not Setup - Please Use Github)"
              size={30}
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
            <input
              placeholder="password (Not Setup - Please Use Github)"
              size={30}
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
            <button
              className={styles.primaryBtn}
              onClick={async () => {
                try {
                  console.log('invoke button');
                  const res = await signIn('Credentials', {
                    email: userInput.email,
                    password: userInput.password,
                    callbackUrl: '/',
                    redirect: false,
                  });

                  if (res?.error) {
                    console.log('error', res.error);
                  }
                } catch (e) {
                  console.log('error', e);
                }
              }}
            >
              Submit
            </button>
            <button
              className={styles.primaryBtn}
              onClick={async () => {
                console.log('invoke button');
                try {
                  const res = await register.mutateAsync({
                    email: '',
                    password: '',
                    username: '',
                  });
                  console.log('res', res);
                } catch (e) {
                  console.log('error', e);
                }
              }}
            >
              Register
            </button>
            <hr />
            {providers &&
              Object.values(providers).map((provider) => {
                if (
                  provider.type === 'credentials' &&
                  provider.name === 'Credentials'
                ) {
                  return null;
                }
                return (
                  <div key={provider.name} style={{ marginBottom: 0 }}>
                    <button
                      onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    >
                      Sign in with {provider.name}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Image
        src="/login_pattern.svg"
        alt="Pattern Background"
        fill
        className={styles.styledPattern}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
  csrfToken: string | undefined;
}> = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  console.log('Providers', providers);

  return {
    props: { providers, csrfToken },
  };
};
