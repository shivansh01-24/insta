import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { encryptToken } from "@/lib/crypto";
import { logEvent } from "@/lib/logger";
import {
  buildMetaOAuthUrl,
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  fetchFacebookUser,
  fetchFacebookPagesAndInstagramAccount,
} from "@/lib/meta";

export async function initiateOAuthConnect(userId: string): Promise<string> {
  // Clean up any expired OAuth sessions for this user
  await db.oAuthSession.deleteMany({
    where: {
      OR: [
        { userId },
        { expiresAt: { lt: new Date() } },
      ],
    },
  });

  const stateToken = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await db.oAuthSession.create({
    data: {
      userId,
      stateToken,
      expiresAt,
    },
  });

  logEvent("info", {
    event: "OAUTH_START",
    userId,
  });

  return buildMetaOAuthUrl(stateToken);
}

export async function handleOAuthCallback(userId: string, code: string, stateToken: string) {
  // 1. Verify state token against DB
  const oauthSession = await db.oAuthSession.findUnique({
    where: { stateToken },
  });

  if (!oauthSession || oauthSession.userId !== userId) {
    logEvent("error", {
      event: "OAUTH_FAILURE",
      userId,
      error: "Invalid or mismatched OAuth state parameter",
    });
    throw new Error("Invalid or expired OAuth authorization state. Please try connecting again.");
  }

  if (oauthSession.expiresAt < new Date()) {
    // Delete expired session
    await db.oAuthSession.delete({ where: { id: oauthSession.id } }).catch(() => {});
    logEvent("error", {
      event: "OAUTH_FAILURE",
      userId,
      error: "OAuth session expired",
    });
    throw new Error("OAuth session expired. Please start the connection process again.");
  }

  // Delete session immediately to ensure state tokens are single-use
  await db.oAuthSession.delete({ where: { id: oauthSession.id } }).catch(() => {});

  try {
    // 2. Exchange code for short-lived access token
    const shortLivedResult = await exchangeCodeForShortLivedToken(code);

    // 3. Exchange for long-lived access token (60 days)
    const longLivedResult = await exchangeForLongLivedToken(shortLivedResult.accessToken);

    // 4. Fetch Facebook User ID
    let facebookUserId: string | undefined;
    try {
      const fbUser = await fetchFacebookUser(longLivedResult.accessToken);
      facebookUserId = fbUser.id;
    } catch (e) {
      console.warn("Could not fetch Facebook User ID:", e);
    }

    // 5. Fetch Facebook Pages & connected Instagram Account
    const { facebookPage, instagramAccount } = await fetchFacebookPagesAndInstagramAccount(
      longLivedResult.accessToken
    );

    // 6. Encrypt access token
    const encryptedAccessToken = encryptToken(longLivedResult.accessToken);
    const tokenExpiry = new Date(Date.now() + longLivedResult.expiresIn * 1000);

    // 7. Store / Upsert in Database (Single Source of Truth)
    const connectedAccount = await db.connectedInstagramAccount.upsert({
      where: { userId },
      create: {
        userId,
        instagramUserId: instagramAccount.id,
        username: instagramAccount.username,
        name: instagramAccount.name || null,
        profilePictureUrl: instagramAccount.profile_picture_url || null,
        facebookUserId: facebookUserId || null,
        facebookPageId: facebookPage.id,
        facebookPageName: facebookPage.name,
        encryptedAccessToken,
        tokenType: longLivedResult.tokenType || "Bearer",
        tokenExpiry,
      },
      update: {
        instagramUserId: instagramAccount.id,
        username: instagramAccount.username,
        name: instagramAccount.name || null,
        profilePictureUrl: instagramAccount.profile_picture_url || null,
        facebookUserId: facebookUserId || null,
        facebookPageId: facebookPage.id,
        facebookPageName: facebookPage.name,
        encryptedAccessToken,
        tokenType: longLivedResult.tokenType || "Bearer",
        tokenExpiry,
        updatedAt: new Date(),
      },
    });

    logEvent("info", {
      event: "OAUTH_SUCCESS",
      userId,
      instagramUserId: instagramAccount.id,
      facebookPageId: facebookPage.id,
      details: { username: instagramAccount.username },
    });

    return connectedAccount;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Meta OAuth connection failed";
    logEvent("error", {
      event: "OAUTH_FAILURE",
      userId,
      error: errorMsg,
    });
    throw new Error(errorMsg);
  }
}

export async function unlinkInstagramAccount(userId: string) {
  const existing = await db.connectedInstagramAccount.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new Error("No connected Instagram account found to unlink.");
  }

  await db.connectedInstagramAccount.delete({
    where: { userId },
  });

  logEvent("info", {
    event: "ACCOUNT_UNLINK",
    userId,
    instagramUserId: existing.instagramUserId,
    details: { username: existing.username },
  });

  return { success: true };
}

export async function getConnectedInstagramAccount(userId: string) {
  const account = await db.connectedInstagramAccount.findUnique({
    where: { userId },
    select: {
      id: true,
      instagramUserId: true,
      username: true,
      name: true,
      profilePictureUrl: true,
      facebookPageId: true,
      facebookPageName: true,
      connectedAt: true,
      updatedAt: true,
    },
  });

  return account;
}
