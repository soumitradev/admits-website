import { google } from "../../../auth";
import { generateCodeVerifier, generateState } from "arctic";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // store state verifier as cookie
  context.cookies.set("state", state, {
    secure: import.meta.env.PROD,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  // store code verifier as cookie
  context.cookies.set("code_verifier", codeVerifier, {
    secure: import.meta.env.PROD,
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return context.redirect(url.toString());
}
