/**
 * Structured Logger for Instagram Connect Platform
 * STRICT SECURITY RULE: Never log OAuth access tokens, authorization codes, client secrets, passwords, or session tokens.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

export type EventType =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_REGISTER"
  | "OAUTH_START"
  | "OAUTH_CALLBACK"
  | "OAUTH_SUCCESS"
  | "OAUTH_FAILURE"
  | "WEBHOOK_VERIFY"
  | "WEBHOOK_EVENT"
  | "ACCOUNT_UNLINK";

interface LogPayload {
  event: EventType;
  userId?: string;
  instagramUserId?: string;
  facebookPageId?: string;
  details?: Record<string, unknown>;
  error?: string;
}

function sanitizeData(data?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const sanitized = { ...data };
  const sensitiveKeys = [
    "password",
    "token",
    "accessToken",
    "access_token",
    "code",
    "secret",
    "app_secret",
    "sessionSecret",
    "encryptionKey",
    "authorization",
  ];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    }
  }
  return sanitized;
}

export function logEvent(level: LogLevel, payload: LogPayload) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    event: payload.event,
    userId: payload.userId,
    instagramUserId: payload.instagramUserId,
    facebookPageId: payload.facebookPageId,
    details: sanitizeData(payload.details),
    error: payload.error,
  };

  const output = JSON.stringify(logEntry);
  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}
