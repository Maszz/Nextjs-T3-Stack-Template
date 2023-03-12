import React from 'react';

export function useCountdown(seconds: number, onEnd: () => any) {
  const [remaining, setRemaining] = React.useState(seconds);
  const [t, setT] = React.useState(false);
  React.useEffect(() => {
    function tick() {
      setRemaining((prev) => {
        if (prev <= 0) {
          return prev;
        }
        return prev - 1;
      });
    }

    const countdown = setInterval(tick, 1000);

    if (remaining <= 0) {
      clearInterval(countdown);
      onEnd();
    }

    return () => clearInterval(countdown);
  }, [remaining]);

  return remaining;
}
