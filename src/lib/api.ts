/* Lightweight API helper for client-side requests */

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user?: unknown;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  role?: 'investor' | 'admin';
};

const DEFAULT_TIMEOUT = 10000; // ms

async function timeoutPromise<T>(promise: Promise<T>, ms = DEFAULT_TIMEOUT) {
  let id: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    id = setTimeout(() => reject(new Error('Request timed out')),
      ms);
  });
  return Promise.race([promise, timeout]).then((res) => {
    clearTimeout(id!);
    return res as T;
  });
}

function getBaseUrl() {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env && env.trim().length > 0) {
    return env.replace(/\/$/, '');
  }
  // Default to same-origin so Next.js rewrites proxy /api/* to backend
  return '';
}

async function postJson<TReq extends object, TRes>(path: string, body: TReq): Promise<TRes> {
  // Use absolute base when provided; otherwise fallback to same-origin (rewrite)
  const isBrowser = typeof window !== 'undefined';
  const base = getBaseUrl();
  const primaryUrl = base ? `${base}${path}` : (isBrowser ? path : `${base}${path}`);
  const canTryDevFallback =
    (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.trim().length === 0)
    && typeof window !== 'undefined'
    && process.env.NODE_ENV === 'development'
    && path.startsWith('/api/');

  let res: Response | undefined;
  let lastError: unknown;
  // Try primary URL first (same-origin or env base)
  try {
    res = await timeoutPromise(
      fetch(primaryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    ) as Response;
  } catch (e) {
    lastError = e;
    // Optionally try localhost:5500 as a dev fallback
    if (canTryDevFallback) {
      const fallbackUrl = `http://localhost:5500${path}`;
      try {
        res = await timeoutPromise(
          fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        ) as Response;
      } catch (e2) {
        const m1 = lastError instanceof Error ? lastError.message : 'Unknown network error';
        const m2 = e2 instanceof Error ? e2.message : 'Unknown network error';
        throw new Error(
          `Network error. Tried '${primaryUrl}' (${m1}) and fallback 'http://localhost:5500${path}' (${m2}). Ensure backend is running and CORS allows this origin.`
        );
      }
    } else {
      const message = e instanceof Error ? e.message : 'Unknown network error';
      throw new Error(
        `Network error. Ensure API '${primaryUrl}' is reachable and CORS allows this origin. (${message})`
      );
    }
  }

  if (!res!.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text || '{}');
      message = (json && (json.message || json.error)) || JSON.stringify(json) || text;
    } catch {
      // ignore parse errors
    }

    const looksLikeHtml = typeof message === 'string' && /<\/?[a-z][\s\S]*>/i.test(message);
    if (looksLikeHtml) {
      // eslint-disable-next-line no-console
      console.error('Server returned HTML for API request:', text);
      message = `Request failed with status ${res.status} ${res.statusText || ''}`.trim();
    }

    throw new Error(message || 'Request failed');
  }

  const data = await res!.json();
  return data as TRes;
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginRequest, LoginResponse>('/api/auth/login', req);
}

export async function register(req: RegisterRequest): Promise<LoginResponse> {
  return postJson<RegisterRequest, LoginResponse>('/api/auth/register', req);
}

const api = { login, register };

export default api;

