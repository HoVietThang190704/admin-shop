import { TokenType } from "./token";

async function getToken(tokenType: TokenType): Promise<string | null> {
  if (typeof document === "undefined") return null;

  const name = tokenType + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

// Client-side set/remove is often not needed if handled by server actions,
// but included for completeness.
async function setToken(tokenType: TokenType, token: string): Promise<void> {
  if (typeof document === "undefined") return;
  document.cookie = `${tokenType}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict; Secure`;
}

async function removeToken(tokenType: TokenType): Promise<void> {
  if (typeof document === "undefined") return;
  document.cookie = `${tokenType}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict; Secure`;
}

export const TokenManager = {
  getToken,
  setToken,
  removeToken,
};
