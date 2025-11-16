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

export type SendOTPRequest = {
  email: string;
};

export type SendOTPResponse = {
  message: string;
  expiresIn?: number;
};

export type VerifyOTPRequest = {
  email: string;
  otp: string;
};

export type VerifyOTPResponse = {
  message: string;
  token?: string;
  user?: unknown;
};

export type LogoutResponse = {
  message: string;
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

async function getJson<TRes>(path: string, token?: string, signal?: AbortSignal): Promise<TRes> {
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
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    res = await timeoutPromise(
      fetch(primaryUrl, {
        method: 'GET',
        headers,
        signal,
      })
    ) as Response;
  } catch (e: unknown) {
    lastError = e;
    const isAbort =
      (typeof DOMException !== 'undefined' && e instanceof DOMException && e.name === 'AbortError') ||
      (typeof e === 'object' && e !== null && 'name' in e && (e as { name?: unknown }).name === 'AbortError');
    if (isAbort) {
      throw e as unknown as Error;
    }
    if (canTryDevFallback) {
      const fallbackUrl = `http://localhost:5500${path}`;
      try {
        res = await timeoutPromise(
          fetch(fallbackUrl, {
            method: 'GET',
            headers,
            signal,
          })
        ) as Response;
      } catch (e2: unknown) {
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
    let message: string = text || `Request failed with status ${res.status}`;
    try {
      const json = JSON.parse(text || '{}');
      // Try multiple ways to extract error message
      if (json && typeof json === 'object') {
        message = json.message || json.error || json.msg || json.errorMessage;
        if (!message && Object.keys(json).length > 0) {
          // If no message field, stringify the whole object for debugging
          const jsonStr = JSON.stringify(json);
          message = jsonStr.length > 200 ? jsonStr.substring(0, 200) + '...' : jsonStr;
        }
      }
      if (!message || message === '{}') message = text || `Request failed with status ${res.status}`;
    } catch {
      // If JSON parsing fails, use the raw text
      message = text || `Request failed with status ${res.status}`;
    }

    const looksLikeHtml = typeof message === 'string' && /<\/?[a-z][\s\S]*>/i.test(message);
    if (looksLikeHtml) {
      // eslint-disable-next-line no-console
      console.error('Server returned HTML for API request:', text);
      message = `Request failed with status ${res.status} ${res.statusText || ''}`.trim();
    }

    // Ensure message is always a string
    const errorMessage = typeof message === 'string' ? message : `Request failed with status ${res.status}`;
    // eslint-disable-next-line no-console
    console.error('API Error (getJson):', { path, status: res.status, statusText: res.statusText, message: errorMessage });
    throw new Error(errorMessage);
  }

  let data: TRes;
  try {
    data = await res!.json();
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Failed to parse JSON response';
    // eslint-disable-next-line no-console
    console.error('Failed to parse JSON response from', path, ':', errorMsg, 'Status:', res.status);
    throw new Error(`Invalid JSON response: ${errorMsg}`);
  }
  return data;
}

async function postJson<TReq extends object, TRes>(path: string, body: TReq, token?: string): Promise<TRes> {
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
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    res = await timeoutPromise(
      fetch(primaryUrl, {
        method: 'POST',
        headers,
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
            headers,
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

export async function sendOTP(req: SendOTPRequest): Promise<SendOTPResponse> {
  return postJson<SendOTPRequest, SendOTPResponse>('/api/auth/resend-otp', req);
}

export async function verifyOTP(req: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  return postJson<VerifyOTPRequest, VerifyOTPResponse>('/api/auth/verify-email', req);
}

export async function logout(token: string): Promise<LogoutResponse> {
  return postJson<Record<string, never>, LogoutResponse>('/api/auth/logout', {}, token);
}

export async function getPlans(token?: string, signal?: AbortSignal): Promise<unknown> {
  return getJson<unknown>('/api/plans', token, signal);
}

export type CreateInvestmentRequest = {
  planId?: string;
  plan?: string;
  amount: number;
  currency?: string;
};

export type CreateInvestmentResponse = unknown;

export async function createInvestment(req: CreateInvestmentRequest, token?: string): Promise<CreateInvestmentResponse> {
  return postJson<CreateInvestmentRequest, CreateInvestmentResponse>('/api/investments', req, token);
}

// Investments - Listing/Details/Mutations/Summary/Export
export type ListInvestmentsParams = {
  status?: 'all' | 'active' | 'completed' | 'pending' | 'cancelled';
  sortBy?: 'startDate' | 'amount' | 'planName' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export type InvestmentItem = {
  id: string;
  planName: string;
  planTier?: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  dailyReturn?: number;
  totalEarnings?: number;
  expectedReturn?: number;
  planPercentage?: number;
  daysRemaining?: number;
  nextPayout?: string;
  [key: string]: unknown;
};

export type ListInvestmentsResponse = {
  data: InvestmentItem[];
  page: number;
  pageSize: number;
  total: number;
};

export async function listInvestments(params: ListInvestmentsParams = {}, token?: string, signal?: AbortSignal): Promise<ListInvestmentsResponse> {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);
  if (typeof params.page === 'number') query.set('page', String(params.page));
  if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));
  const qs = query.toString();
  const path = `/api/investments${qs ? `?${qs}` : ''}`;
  return getJson<ListInvestmentsResponse>(path, token, signal);
}

export async function getInvestmentById(investmentId: string, token?: string, signal?: AbortSignal): Promise<InvestmentItem> {
  return getJson<InvestmentItem>(`/api/investments/${encodeURIComponent(investmentId)}`, token, signal);
}

export type PatchInvestmentRequest = {
  action: 'pause' | 'resume';
};

export type PatchInvestmentResponse = {
  message?: string;
  investment?: InvestmentItem;
  [key: string]: unknown;
};

export async function patchInvestment(investmentId: string, body: PatchInvestmentRequest, token?: string): Promise<PatchInvestmentResponse> {
  return postJson<PatchInvestmentRequest, PatchInvestmentResponse>(`/api/investments/${encodeURIComponent(investmentId)}`, body, token);
}

export type InvestmentsSummary = {
  totalInvested?: number;
  totalEarnings?: number;
  monthlyEarnings?: number;
  activeCount?: number;
  totalCount?: number;
  [key: string]: unknown;
};

export async function getInvestmentsSummary(token?: string, signal?: AbortSignal): Promise<InvestmentsSummary> {
  return getJson<InvestmentsSummary>('/api/investments/summary', token, signal);
}

export type EarningsSummary = {
  totalEarnings?: number;
  withdrawnAmount?: number;
  availableAmount?: number;
  investmentEarnings?: number;
  referralBonuses?: number;
  withdrawableAmount?: number;
  currency?: string;
  pendingAmount?: number;
  [key: string]: unknown;
};

function isEarningsEnvelope(raw: unknown): raw is { success?: boolean; data?: Record<string, unknown> } {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  return 'success' in r && 'data' in r && typeof r.data === 'object';
}

export async function getEarningsSummary(token?: string, signal?: AbortSignal): Promise<EarningsSummary> {
  const raw = await getJson<unknown>('/api/earnings/summary', token, signal);
  const dbg = (typeof window !== 'undefined' && (localStorage.getItem('dkp_debug_earnings') === '1')) || process.env.NEXT_PUBLIC_DEBUG_EARNINGS === '1';
  if (dbg) {
    // eslint-disable-next-line no-console
    console.debug('EarningsSummary raw:', raw);
  }
  
  // Handle different response formats
  let src: Record<string, unknown>;
  if (isEarningsEnvelope(raw)) {
    src = (raw.data as Record<string, unknown>) || {};
  } else if (raw && typeof raw === 'object') {
    src = raw as Record<string, unknown>;
  } else {
    src = {};
  }
  
  const pickNum = (o: Record<string, unknown>, keys: string[]): number | undefined => {
    for (const k of keys) {
      const v = o[k];
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = Number(v.replace?.(/,/g, '') ?? v);
        if (!Number.isNaN(n)) return n;
      }
    }
    return undefined;
  };
  const normalized: EarningsSummary = {
    totalEarnings: pickNum(src, ['totalEarnings', 'total_earnings', 'total', 'sum', 'overall']),
    withdrawnAmount: pickNum(src, ['totalWithdrawn', 'withdrawnAmount', 'withdrawn', 'withdrawn_sum']),
    availableAmount: pickNum(src, ['totalAvailable', 'availableAmount', 'available', 'available_sum', 'balance', 'remaining']),
    investmentEarnings: pickNum(src, ['investmentEarnings', 'investmentEarning', 'investment', 'investment_earning']),
    referralBonuses: pickNum(src, ['referralBonuses', 'referralBonusesTotal', 'referral_bonus', 'referral', 'bonus']),
    withdrawableAmount: pickNum(src, ['withdrawableAmount', 'withdrawable', 'withdrawable_amount']),
    pendingAmount: pickNum(src, ['pendingAmount', 'pending', 'pending_amount']),
    currency: typeof src.currency === 'string' ? (src.currency as string) : undefined,
  };
  if (dbg) {
    // eslint-disable-next-line no-console
    console.debug('EarningsSummary normalized:', normalized);
    // eslint-disable-next-line no-console
    console.debug('EarningsSummary source keys:', Object.keys(src));
  }
  return normalized;
}

export type EarningsType = 'investment_earning' | 'referral_bonus' | 'all';
export type ListEarningsParams = {
  type?: EarningsType;
  isWithdrawn?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'date' | 'amount' | 'withdrawableDate';
  sortOrder?: 'asc' | 'desc';
};

export type EarningsItem = {
  id: string;
  type: 'investment_earning' | 'referral_bonus' | string;
  amount: number;
  currency: string;
  isWithdrawn?: boolean;
  date: string;
  withdrawableDate?: string;
  description?: string;
  _id?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export type ListEarningsResponse = {
  data: EarningsItem[];
  total?: number;
  page?: number;
  pageSize?: number;
};

function isEarningsListEnvelope(raw: unknown): raw is { data?: unknown[] | { earnings?: unknown[]; meta?: Record<string, unknown> }; total?: number; page?: number; pageSize?: number; success?: boolean } | { earnings?: unknown[] } {
  if (Array.isArray(raw)) return true; // Direct array response
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.data)) return true;
  if (Array.isArray(r.earnings)) return true;
  // Handle { success: true, data: { earnings: [...], meta: {...} } }
  if (r.success === true && r.data && typeof r.data === 'object') {
    const data = r.data as Record<string, unknown>;
    if (Array.isArray(data.earnings)) return true;
  }
  return false;
}

export async function listEarnings(params: ListEarningsParams = {}, token?: string, signal?: AbortSignal): Promise<{ items: EarningsItem[]; total?: number; page?: number; pageSize?: number; }> {
  const query = new URLSearchParams();
  // Only include type if it's not 'all' (API accepts 'all' but we'll include it for now based on Postman example)
  if (params.type && params.type !== 'all') {
    query.set('type', params.type);
  } else if (params.type === 'all') {
    // Include 'all' as per Postman example
    query.set('type', 'all');
  }
  if (typeof params.isWithdrawn === 'boolean') {
    query.set('isWithdrawn', String(params.isWithdrawn));
  }
  if (typeof params.page === 'number') query.set('page', String(params.page));
  if (typeof params.pageSize === 'number') query.set('pageSize', String(params.pageSize));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);
  const queryString = query.toString();
  const url = `/api/earnings${queryString ? `?${queryString}` : ''}`;
  // Always log the URL for debugging 400 errors
  // eslint-disable-next-line no-console
  console.log('ListEarnings requesting URL:', url, 'with params:', params);
  const dbg = (typeof window !== 'undefined' && (localStorage.getItem('dkp_debug_earnings') === '1')) || process.env.NEXT_PUBLIC_DEBUG_EARNINGS === '1';
  if (dbg) {
    // eslint-disable-next-line no-console
    console.debug('ListEarnings requesting:', url);
  }
  let raw: unknown;
  try {
    raw = await getJson<unknown>(url, token, signal);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('ListEarnings API error:', {
      url,
      params: { type: params.type, isWithdrawn: params.isWithdrawn, page: params.page, pageSize: params.pageSize, sortBy: params.sortBy, sortOrder: params.sortOrder },
      error: e instanceof Error ? e.message : String(e),
      errorObject: e
    });
    throw e;
  }
  if (dbg) {
    // eslint-disable-next-line no-console
    console.debug('ListEarnings raw:', raw);
  }
  
  // Handle direct array response
  if (Array.isArray(raw)) {
    const items = raw.map((it) => {
      const o = it as Record<string, unknown>;
      const id = String(o._id ?? o.id ?? '');
      const type = String(o.type ?? 'investment_earning');
      const amount = (() => {
        const v = o.amount;
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const n = Number(v.replace?.(/,/g, '') ?? v);
          return Number.isNaN(n) ? 0 : n;
        }
        return 0;
      })();
      const currency = typeof o.currency === 'string' ? (o.currency as string) : 'USDT';
      const isWithdrawn = typeof o.isWithdrawn === 'boolean' ? (o.isWithdrawn as boolean) : undefined;
      const date = String(o.createdAt ?? o.date ?? new Date().toISOString());
      const withdrawableDate = typeof o.withdrawableDate === 'string' ? (o.withdrawableDate as string) : undefined;
      // Build description from available fields
      let description: string | undefined = typeof o.description === 'string' ? o.description : undefined;
      if (!description) {
        if (type === 'referral_bonus' && o.referredUser && typeof o.referredUser === 'object') {
          const user = o.referredUser as { fullName?: string; email?: string };
          description = `Referral bonus from ${user.fullName || user.email || 'user'}`;
        } else if (type === 'investment_earning' && o.investment && typeof o.investment === 'object') {
          const inv = o.investment as { plan?: string; amount?: number };
          description = `Investment earning from ${inv.plan || 'plan'} plan`;
        }
      }
      return { id, type, amount, currency, isWithdrawn, date, withdrawableDate, description, _id: o._id as string | undefined, createdAt: o.createdAt as string | undefined } as EarningsItem;
    });
    if (dbg) {
      // eslint-disable-next-line no-console
      console.debug('ListEarnings normalized count (direct array):', items.length);
    }
    return { items };
  }
  
  // Handle envelope response
  if (isEarningsListEnvelope(raw)) {
    const r = raw as Record<string, unknown>;
    let arr: unknown[] = [];
    let meta: { total?: number; page?: number; pageSize?: number } | undefined;
    
    // Handle { success: true, data: { earnings: [...], meta: {...} } }
    if (r.success === true && r.data && typeof r.data === 'object') {
      const data = r.data as Record<string, unknown>;
      if (Array.isArray(data.earnings)) {
        arr = data.earnings as unknown[];
      }
      if (data.meta && typeof data.meta === 'object') {
        meta = data.meta as { total?: number; page?: number; pageSize?: number };
      }
    } else if (Array.isArray(r.data)) {
      // Handle { data: [...] }
      arr = r.data as unknown[];
    } else if (Array.isArray(r.earnings)) {
      // Handle { earnings: [...] }
      arr = r.earnings as unknown[];
    }
    
    const items = arr.map((it) => {
      const o = it as Record<string, unknown>;
      const id = String(o._id ?? o.id ?? '');
      const type = String(o.type ?? 'investment_earning');
      const amount = (() => {
        const v = o.amount;
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const n = Number(v.replace?.(/,/g, '') ?? v);
          return Number.isNaN(n) ? 0 : n;
        }
        return 0;
      })();
      const currency = typeof o.currency === 'string' ? (o.currency as string) : 'USDT';
      const isWithdrawn = typeof o.isWithdrawn === 'boolean' ? (o.isWithdrawn as boolean) : undefined;
      const date = String(o.createdAt ?? o.date ?? new Date().toISOString());
      const withdrawableDate = typeof o.withdrawableDate === 'string' ? (o.withdrawableDate as string) : undefined;
      // Build description from available fields
      let description: string | undefined = typeof o.description === 'string' ? o.description : undefined;
      if (!description) {
        if (type === 'referral_bonus' && o.referredUser && typeof o.referredUser === 'object') {
          const user = o.referredUser as { fullName?: string; email?: string };
          description = `Referral bonus from ${user.fullName || user.email || 'user'}`;
        } else if (type === 'investment_earning' && o.investment && typeof o.investment === 'object') {
          const inv = o.investment as { plan?: string; amount?: number };
          description = `Investment earning from ${inv.plan || 'plan'} plan`;
        }
      }
      return { id, type, amount, currency, isWithdrawn, date, withdrawableDate, description, _id: o._id as string | undefined, createdAt: o.createdAt as string | undefined } as EarningsItem;
    });
    if (dbg) {
      // eslint-disable-next-line no-console
      console.debug('ListEarnings normalized count:', items.length);
    }
    return {
      items,
      total: meta?.total ?? (r.total as number | undefined),
      page: meta?.page ?? (r.page as number | undefined),
      pageSize: meta?.pageSize ?? (r.pageSize as number | undefined)
    };
  }
  
  // If response doesn't match expected format, log and return empty
  if (dbg) {
    // eslint-disable-next-line no-console
    console.warn('ListEarnings: Unexpected response format:', raw);
  }
  return { items: [] };
}

export type WithdrawEarningsRequest = { amount: number; currency: string; walletAddress: string };
export type WithdrawEarningsResponse = { message?: string; data?: { reference?: string; transactionId?: string } };

export async function withdrawEarnings(body: WithdrawEarningsRequest, token?: string): Promise<WithdrawEarningsResponse> {
  return postJson<WithdrawEarningsRequest, WithdrawEarningsResponse>('/api/earnings/withdraw', body, token);
}

export type EarningsToday = { investment_earning?: number; referral_bonus?: number; total?: number; currency?: string; date?: string };
export async function getEarningsToday(token?: string, signal?: AbortSignal): Promise<EarningsToday> {
  const raw = await getJson<unknown>('/api/earnings/today', token, signal);
  const dbg = (typeof window !== 'undefined' && (localStorage.getItem('dkp_debug_earnings') === '1')) || process.env.NEXT_PUBLIC_DEBUG_EARNINGS === '1';
  if (dbg) {
    // eslint-disable-next-line no-console
    console.debug('EarningsToday raw:', raw);
  }
  
  // Handle response structure: { success: true, data: { investment, referral, total, date } }
  let src: Record<string, unknown> = {};
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    if (r.success === true && r.data && typeof r.data === 'object') {
      src = r.data as Record<string, unknown>;
    } else {
      src = r as Record<string, unknown>;
    }
  }
  
  const coerce = (v: unknown) => typeof v === 'number' ? v : (typeof v === 'string' ? (Number(v)) : undefined);
  return {
    investment_earning: coerce(src.investment ?? src.investment_earning),
    referral_bonus: coerce(src.referral ?? src.referral_bonus),
    total: coerce(src.total),
    date: typeof src.date === 'string' ? (src.date as string) : undefined,
    currency: typeof src.currency === 'string' ? (src.currency as string) : undefined,
  };
}

export type EarningsDailyItem = { date: string; investment_earning?: number; referral_bonus?: number; total?: number };
export async function getEarningsDaily(params: { start?: string; end?: string } = {}, token?: string, signal?: AbortSignal): Promise<EarningsDailyItem[]> {
  const q = new URLSearchParams();
  if (params.start) q.set('start', params.start);
  if (params.end) q.set('end', params.end);
  const path = `/api/earnings/daily${q.toString() ? `?${q.toString()}` : ''}`;
  const raw = await getJson<unknown>(path, token, signal);
  if (Array.isArray(raw)) return raw as EarningsDailyItem[];
  const r = raw as { data?: unknown } | undefined;
  if (r && Array.isArray(r.data)) return r.data as EarningsDailyItem[];
  return [];
}

export type ExportFormat = 'csv' | 'xlsx';

export async function exportInvestments(format: ExportFormat = 'csv', filters: Omit<ListInvestmentsParams, 'page' | 'pageSize'> = {}, token?: string): Promise<Blob> {
  const isBrowser = typeof window !== 'undefined';
  const base = getBaseUrl();
  const query = new URLSearchParams();
  query.set('format', format);
  if (filters.status) query.set('status', filters.status);
  if (filters.sortBy) query.set('sortBy', filters.sortBy);
  if (filters.sortOrder) query.set('sortOrder', filters.sortOrder);
  const qs = query.toString();
  const path = `/api/investments/export${qs ? `?${qs}` : ''}`;
  const url = base ? `${base}${path}` : (isBrowser ? path : `${base}${path}`);
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to export investments (${res.status})`);
  }
  return await res.blob();
}

const api = {
  login,
  register,
  sendOTP,
  verifyOTP,
  logout,
  getPlans,
  createInvestment,
  listInvestments,
  getInvestmentById,
  patchInvestment,
  getInvestmentsSummary,
  getEarningsSummary,
  exportInvestments
};

export default api;

// --- Optional: Activities feed (if backend provides it) ---
export type ActivityItem = {
  id: string;
  type: string;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type ListActivitiesResponse = {
  data: ActivityItem[];
  total?: number;
};

export async function getRecentActivities(limit = 5, token?: string, signal?: AbortSignal): Promise<ActivityItem[]> {
  try {
    const query = new URLSearchParams();
    query.set('limit', String(limit));
    const res = await getJson<ListActivitiesResponse>(`/api/activities?${query.toString()}`, token, signal);
    return res?.data ?? [];
  } catch {
    // If the endpoint isn't available, return empty list to avoid breaking UI
    return [];
  }
}

// --- Transactions ---
export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'referral' | string;
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'processing' | string;

export type TransactionItem = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description?: string;
  date: string; // ISO
  reference?: string;
  // Optional backend variants
  _id?: string;
  createdAt?: string;
  displayType?: string;
  [key: string]: unknown;
};

export type ListTransactionsResponse = {
  data: TransactionItem[];
  total?: number;
};

export type ListTransactionsParams = {
  limit?: number;
  page?: number;
  category?: string; // e.g., 'wallet'
};

export type ListTransactionsResult = {
  items: TransactionItem[];
  total?: number;
  page?: number;
  limit?: number;
  title?: string;
  category?: string;
};

function isTransactionsEnvelope(raw: unknown): raw is {
  success?: boolean;
  data?: {
    transactions?: TransactionItem[];
    total?: number;
    page?: number;
    limit?: number;
    title?: string;
    category?: string;
  };
  transactions?: TransactionItem[];
  dataArray?: TransactionItem[];
} {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  if (Array.isArray(r.data)) return true;
  const data = r.data as Record<string, unknown> | undefined;
  if (data && Array.isArray((data as Record<string, unknown>).transactions)) return true;
  if (Array.isArray(r.transactions)) return true;
  return false;
}

export async function listTransactions(params: ListTransactionsParams = {}, token?: string, signal?: AbortSignal): Promise<ListTransactionsResult> {
  const query = new URLSearchParams();
  if (typeof params.limit === 'number') query.set('limit', String(params.limit));
  if (typeof params.page === 'number') query.set('page', String(params.page));
  if (params.category) query.set('category', params.category);

  const raw = await getJson<unknown>(`/api/transactions?${query.toString()}`, token, signal);

  // Support multiple backend response shapes:
  // 1) { data: TransactionItem[] }
  // 2) { success: true, data: { transactions: TransactionItem[], total, page, limit, title?, category? } }
  // 3) { transactions: TransactionItem[] }
  if (isTransactionsEnvelope(raw)) {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.data)) {
      return { items: r.data as TransactionItem[] };
    }
    const data = r.data as Record<string, unknown> | undefined;
    if (data && Array.isArray((data as Record<string, unknown>).transactions)) {
      const d = data as {
        transactions: TransactionItem[];
        total?: number;
        page?: number;
        limit?: number;
        title?: string;
        category?: string;
      };
      return {
        items: d.transactions,
        total: d.total,
        page: d.page,
        limit: d.limit,
        title: d.title,
        category: d.category
      };
    }
    if (Array.isArray(r.transactions)) {
      return { items: r.transactions as TransactionItem[] };
    }
  }
  return { items: [] };
}

export async function getTransactionById(transactionId: string, token?: string, signal?: AbortSignal): Promise<TransactionItem> {
  return getJson<TransactionItem>(`/api/transactions/${encodeURIComponent(transactionId)}`, token, signal);
}

export async function exportTransactionsCsv(token?: string): Promise<Blob> {
  const isBrowser = typeof window !== 'undefined';
  const base = getBaseUrl();
  const path = '/api/transactions/export';
  const url = base ? `${base}${path}` : (isBrowser ? path : `${base}${path}`);
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to export transactions (${res.status})`);
  }
  return await res.blob();
}

// --- Wallet ---
export type WalletResponse = {
  totalBalance?: number;
  availableBalance?: number;
  currency?: string;
  balances?: Record<string, number>;
  [key: string]: unknown;
};

function isWalletEnvelope(raw: unknown): raw is { success?: boolean; data?: WalletResponse } {
  if (!raw || typeof raw !== 'object') return false;
  const r = raw as Record<string, unknown>;
  if ('success' in r && typeof r.success === 'boolean' && 'data' in r && typeof r.data === 'object') return true;
  return false;
}

export async function getWallet(token?: string, signal?: AbortSignal): Promise<WalletResponse> {
  const raw = await getJson<unknown>('/api/wallet', token, signal);
  // Support shapes like:
  // { totalBalance, availableBalance, currency, balances }
  // { success, data: { totalBalance, availableBalance, currency, balances } }
  if (isWalletEnvelope(raw)) {
    return (raw as { data?: WalletResponse }).data || {};
  }
  return raw as WalletResponse;
}

