export type AdminUser = {
  id: string;
  name: string;
  email: string;
};

type ApiEnvelope<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error?: {
        message?: string;
        details?: Record<string, unknown>;
      };
    };

type LoginInput = {
  email: string;
  password: string;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787";

async function requestApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const envelope = await readJson<ApiEnvelope<T>>(response);

  if (!response.ok || !envelope?.ok) {
    const message =
      envelope && !envelope.ok
        ? envelope.error?.message
        : "The admin API request failed";
    throw new Error(message || "The admin API request failed");
  }

  return envelope.data;
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loginAdmin(input: LoginInput) {
  return requestApi<{ admin: AdminUser }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function getCurrentAdmin() {
  return requestApi<{ admin: AdminUser }>("/admin/auth/me");
}

export async function logoutAdmin() {
  return requestApi<{ loggedOut: boolean }>("/admin/auth/logout", {
    method: "POST"
  });
}

export async function changeAdminPassword(input: ChangePasswordInput) {
  return requestApi<{ passwordChanged: boolean; requiresLogin: boolean }>(
    "/admin/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}
