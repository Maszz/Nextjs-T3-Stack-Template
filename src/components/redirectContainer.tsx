import { signOut, useSession } from 'next-auth/react';
import styles from './header.module.css';
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { useCountdown } from '../hooks/useCountdown';
// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const countDown = useCountdown(5, () => {
    Router.replace('/api/redirect/');
  });
  return (
    <div>
      <p>Redirect to Home in {countDown} ... </p>
    </div>
  );
}
