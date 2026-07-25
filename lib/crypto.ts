import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";
import { env } from "@/lib/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT = "meta_instagram_connect_salt";

// Derive 32-byte key from ENCRYPTION_KEY using scrypt
const derivedKey = scryptSync(env.ENCRYPTION_KEY, SALT, 32);

/**
 * Encrypts sensitive text (e.g. Meta access token) using AES-256-GCM.
 * Output format: iv:authTag:encryptedHex
 */
export function encryptToken(text: string): string {
  if (!text) return "";
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted token.
 */
export function decryptToken(encryptedString: string): string {
  if (!encryptedString) return "";
  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
