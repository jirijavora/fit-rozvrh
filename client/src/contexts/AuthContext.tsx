import * as oauth from 'oauth4webapi';
import { createContext, ReactNode, useEffect, useState } from 'react';

type TokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_timestamp: number;
  refresh_token?: string;
  scope?: string;
};

// TODO: Convert this into env variables
const issuer = 'https://discord.com/';
const authorization_endpoint = 'https://discord.com/oauth2/authorize';
const token_endpoint = 'https://discord.com/api/oauth2/token';
const revocation_endpoint = 'https://discord.com/api/oauth2/token/revoke';

const client_id = '1284931237852483626';
const scopes = 'identify';

const CODE_CHALLANGE_METHOD = 'S256'; // Allows for PKCE - Support from discord is unofficial

const DISCORD_TOKEN_KEY = 'discord_token';
const DISCORD_CODE_VERIFIER_KEY = 'discord_code_verifier';

const authorizationServer: oauth.AuthorizationServer = {
  issuer,
  authorization_endpoint,
  token_endpoint,
  revocation_endpoint,
};

const client: oauth.Client = {
  client_id,
  token_endpoint_auth_method: 'none',
};

const getTokenFromRedirect = async (): Promise<TokenResponse | null> => {
  const currentUrl = new URL(window.location.href);

  if (currentUrl.searchParams.size === 0) return null;

  const params = oauth.validateAuthResponse(
    authorizationServer,
    client,
    currentUrl,
  );

  if (oauth.isOAuth2Error(params)) {
    console.error('Error Response', params);
    throw new Error(); // FIXME: Handle OAuth 2.0 redirect error
  }

  const code_verifier = localStorage.getItem(DISCORD_CODE_VERIFIER_KEY);

  if (code_verifier === null) throw new Error(); // FIXME: Handle missing code verifier error

  const response = await oauth.authorizationCodeGrantRequest(
    authorizationServer,
    client,
    params,
    window.location.origin,
    code_verifier,
  );

  const result = await oauth.processAuthorizationCodeOAuth2Response(
    authorizationServer,
    client,
    response,
  );
  if (oauth.isOAuth2Error(result)) {
    console.error('Error Response', result);
    throw new Error(); // FIXME: Handle OAuth 2.0 response body error
  }

  // Replace URL with origin so the user does not see the code for getting the token
  window.history.replaceState(null, '', window.location.origin);

  return {
    access_token: result.access_token,
    token_type: 'Bearer',
    expires_timestamp: Date.now() + (result.expires_in ?? 0) * 1000 - 60000, // subtract 60s here to underestimate the expiration (rather than overestimate)
    refresh_token: result.refresh_token,
    scope: result.scope,
  };
};

const getTokenFromStorage = (): TokenResponse | null => {
  const storedToken = localStorage.getItem(DISCORD_TOKEN_KEY);
  const parsedToken = storedToken
    ? (JSON.parse(storedToken) as TokenResponse)
    : null;
  if (parsedToken && parsedToken?.expires_timestamp > Date.now())
    return parsedToken;

  return null;
};

const acquireToken = async () => {
  const tokenFromRedirect = await getTokenFromRedirect();

  if (tokenFromRedirect) {
    localStorage.setItem(DISCORD_TOKEN_KEY, JSON.stringify(tokenFromRedirect));
    return tokenFromRedirect;
  }

  return getTokenFromStorage();
};

const authRedirect = async () => {
  const code_verifier = oauth.generateRandomCodeVerifier();
  localStorage.setItem(DISCORD_CODE_VERIFIER_KEY, code_verifier);
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);

  const authorizationUrl = new URL(authorization_endpoint);
  authorizationUrl.searchParams.set('client_id', client.client_id);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('redirect_uri', window.location.origin);
  authorizationUrl.searchParams.set('scope', scopes);
  authorizationUrl.searchParams.set('prompt', 'none');
  authorizationUrl.searchParams.set('code_challenge', code_challenge);
  authorizationUrl.searchParams.set(
    'code_challenge_method',
    CODE_CHALLANGE_METHOD,
  );

  window.location.replace(authorizationUrl.href);
};

export const AuthContext = createContext<TokenResponse | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<null | TokenResponse>(null);

  useEffect(() => {
    acquireToken().then((token) => {
      if (token) setToken(token);
      else {
        authRedirect();
      }
    });
  }, []);

  return <AuthContext.Provider value={token}>{children}</AuthContext.Provider>;
};
