// Edge-safe session token helpers (no Node-only APIs). Used by middleware and server code.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ah_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const SESSION_ISSUER = "abuhasan-portfolio";
export const SESSION_AUDIENCE = "admin";

/** Minimum length for AUTH_SECRET. 32+ chars ≈ 192 bits of base64 entropy. */
export const AUTH_SECRET_MIN_LENGTH = 32;

export type SessionPayload = {
  sub: string; // admin id
  email: string;
  name: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < AUTH_SECRET_MIN_LENGTH) {
    throw new Error(`AUTH_SECRET is missing or shorter than ${AUTH_SECRET_MIN_LENGTH} characters. See .env.example.`);
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    };
  } catch {
    return null;
  }
}
