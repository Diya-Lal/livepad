let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
  if (!res.ok) return null;
  const json = (await res.json()) as { data: { accessToken: string } };
  setAccessToken(json.data.accessToken);
  return json.data.accessToken;
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options;

  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (!skipAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let res = await fetch(url, { ...init, headers, credentials: 'include' });

  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...init, headers, credentials: 'include' });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(error.message ?? 'Request failed'), {
      statusCode: res.status,
      ...error,
    });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
