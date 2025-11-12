"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clearToken, getToken } from '@/lib/auth';
import { logout } from '@/lib/api';

const IDLE_TIMEOUT = 10 * 60 * 1000;
const LAST_ACTIVITY_KEY = 'dkp_last_activity';
const BROADCAST_CHANNEL_NAME = 'dkp_activity_channel';

function now() {
  return Date.now();
}

function getLastActivity(): number | null {
  try {
    const v = localStorage.getItem(LAST_ACTIVITY_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}

function setLastActivity(ts: number) {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(ts));
  } catch {
  }
}

export default function InactivityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);
  const throttledRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const performLogout = async () => {
    try {
      bcRef.current?.postMessage({ type: 'logout' });
    } catch {}

    try {
      const token = getToken();
      if (token) {
        await logout(token);
      }
    } catch (e) {
    } finally {
      clearToken();
      router.replace('/login');
    }
  };

  const resetTimerFromStorage = () => {
    clearTimer();
    const last = getLastActivity() ?? now();
    const remaining = Math.max(0, IDLE_TIMEOUT - (now() - last));
    timerRef.current = window.setTimeout(performLogout, remaining);
  };

  const markActivity = () => {
    const t = now();
    if (t - throttledRef.current < 1000) return;
    throttledRef.current = t;
    setLastActivity(t);
    resetTimerFromStorage();
    try {
      bcRef.current?.postMessage({ type: 'activity', ts: t });
    } catch {}
  };

  useEffect(() => {
    try {
      bcRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bcRef.current.onmessage = (ev: MessageEvent) => {
        const data = ev.data as { type: string; ts?: number } | undefined;
        if (!data) return;
        if (data.type === 'logout') {
          clearToken();
          router.replace('/login');
          return;
        }
        if (data.type === 'activity') {
          resetTimerFromStorage();
          return;
        }
      };
    } catch {
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY) {
        resetTimerFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'] as const;
    events.forEach((name) => window.addEventListener(name, markActivity, { passive: true }));

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        markActivity();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const token = getToken();
    if (token) {
      if (!getLastActivity()) setLastActivity(now());
      resetTimerFromStorage();
    }

    return () => {
      clearTimer();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
      events.forEach((name) => window.removeEventListener(name, markActivity as EventListener));
      try { bcRef.current?.close(); } catch {}
    };
  }, []);

  return <>{children}</>;
}
