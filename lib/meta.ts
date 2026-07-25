import { env } from "@/lib/env";

/**
 * Centrally defined minimum required Meta OAuth scopes for Instagram Professional connection.
 * Scopes can be expanded here for future features without modifying business logic.
 */
export const META_OAUTH_SCOPES = [
  "instagram_basic",
  "pages_show_list",
  "business_management",
];

const META_GRAPH_BASE = "https://graph.facebook.com";
const META_DIALOG_BASE = "https://www.facebook.com";

/**
 * Constructs the official Meta OAuth Authorization URL.
 */
export function buildMetaOAuthUrl(stateToken: string): string {
  const params = new URLSearchParams({
    client_id: env.META_APP_ID,
    redirect_uri: env.META_REDIRECT_URI,
    state: stateToken,
    scope: META_OAUTH_SCOPES.join(","),
    response_type: "code",
  });

  return `${META_DIALOG_BASE}/${env.META_GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
}

export interface TokenExchangeResult {
  accessToken: string;
  expiresIn: number; // Seconds
  tokenType?: string;
}

export interface FacebookUserData {
  id: string;
  name?: string;
}

export interface FacebookPageData {
  id: string;
  name: string;
  access_token?: string;
  instagram_business_account?: {
    id: string;
  };
}

export interface InstagramAccountData {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
}

/**
 * Exchange OAuth authorization code for short-lived access token.
 */
export async function exchangeCodeForShortLivedToken(code: string): Promise<TokenExchangeResult> {
  const url = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/oauth/access_token?` + new URLSearchParams({
    client_id: env.META_APP_ID,
    client_secret: env.META_APP_SECRET,
    redirect_uri: env.META_REDIRECT_URI,
    code,
  }).toString();

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Failed to exchange authorization code with Meta");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 3600,
    tokenType: data.token_type || "Bearer",
  };
}

/**
 * Exchange short-lived token for long-lived access token (~60 days).
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<TokenExchangeResult> {
  const url = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/oauth/access_token?` + new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: env.META_APP_ID,
    client_secret: env.META_APP_SECRET,
    fb_exchange_token: shortLivedToken,
  }).toString();

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Failed to exchange for long-lived access token");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 5184000, // Default 60 days in seconds
    tokenType: data.token_type || "Bearer",
  };
}

/**
 * Fetches Facebook User profile.
 */
export async function fetchFacebookUser(accessToken: string): Promise<FacebookUserData> {
  const url = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/me?` + new URLSearchParams({
    access_token: accessToken,
  }).toString();

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Failed to fetch Facebook User profile");
  }

  return {
    id: data.id,
    name: data.name,
  };
}

/**
 * Fetches user's connected Facebook Pages and linked Instagram Business Accounts.
 */
export async function fetchFacebookPagesAndInstagramAccount(accessToken: string): Promise<{
  facebookPage: FacebookPageData;
  instagramAccount: InstagramAccountData;
}> {
  const pagesUrl = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/me/accounts?` + new URLSearchParams({
    access_token: accessToken,
    fields: "id,name,access_token,instagram_business_account",
  }).toString();

  const res = await fetch(pagesUrl);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Failed to fetch Facebook Pages from Meta Graph API");
  }

  const pages: FacebookPageData[] = data.data || [];
  if (pages.length === 0) {
    throw new Error("No Facebook Pages found for this Meta account. Please ensure your Facebook Page is created and connected to Instagram.");
  }

  // Find page connected to an Instagram Business / Professional account
  let targetPage: FacebookPageData | null = null;
  let instagramUserId: string | null = null;

  for (const page of pages) {
    if (page.instagram_business_account?.id) {
      targetPage = page;
      instagramUserId = page.instagram_business_account.id;
      break;
    }

    // Query page directly if not returned in list
    const pageDetailsUrl = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/${page.id}?` + new URLSearchParams({
      fields: "instagram_business_account",
      access_token: accessToken,
    }).toString();

    const pageRes = await fetch(pageDetailsUrl);
    const pageData = await pageRes.json();
    if (pageData.instagram_business_account?.id) {
      targetPage = page;
      instagramUserId = pageData.instagram_business_account.id;
      break;
    }
  }

  if (!targetPage || !instagramUserId) {
    throw new Error("No connected Instagram Professional account found. Please link your Instagram account to a Facebook Page.");
  }

  // Fetch Instagram details
  const igUrl = `${META_GRAPH_BASE}/${env.META_GRAPH_API_VERSION}/${instagramUserId}?` + new URLSearchParams({
    fields: "id,username,name,profile_picture_url",
    access_token: accessToken,
  }).toString();

  const igRes = await fetch(igUrl);
  const igData = await igRes.json();

  if (!igRes.ok || igData.error) {
    throw new Error(igData.error?.message || "Failed to fetch Instagram account information");
  }

  return {
    facebookPage: {
      id: targetPage.id,
      name: targetPage.name,
    },
    instagramAccount: {
      id: igData.id,
      username: igData.username,
      name: igData.name,
      profile_picture_url: igData.profile_picture_url,
    },
  };
}
