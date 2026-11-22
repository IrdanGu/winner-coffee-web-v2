const SESSION_COOKIE_NAME = 'winner_admin_session';
const SESSION_DURATION_DAYS = 7;

function getExpectedPin(): string {
  return process.env.ADMIN_PIN || '123456';
}

function generateSessionToken(pin: string): string {
  const salt = 'winner-coffee-secret-salt-2026';
  const data = `${pin}:${salt}:${new Date().getFullYear()}`;
  return Buffer.from(data).toString('base64');
}

export async function verifyAdminPin(enteredPin: string): Promise<boolean> {
  const expected = getExpectedPin().trim();
  return enteredPin.trim() === expected;
}

export async function setAdminSession(pin: string): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = generateSessionToken(pin);
  const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }

  const expectedToken = generateSessionToken(getExpectedPin());
  return sessionCookie.value === expectedToken;
}

export async function clearAdminSession(): Promise<void> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
