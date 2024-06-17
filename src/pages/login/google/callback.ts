import {
  google,
  initializeLucia,
  type DatabaseUserAttributes,
} from "../../../auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { parseJWT } from "oslo/jwt";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const runtime = context.locals.runtime;
  const db = runtime.env.ADMITS_WEBSITE_D1;

  const lucia = initializeLucia(db);
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");

  const storedState = context.cookies.get("state")?.value ?? null;
  const storedCodeVerifier =
    context.cookies.get("code_verifier")?.value ?? null;
  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const parseResult = parseJWT(tokens.idToken);
    if (!parseResult || !parseResult.payload) {
      return new Response(null, {
        status: 400,
      });
    }
    const user: object = parseResult.payload;
    if (!("email" in user) || typeof user.email !== "string") {
      return new Response(null, {
        status: 400,
      });
    }
    if (!("name" in user) || typeof user.name !== "string") {
      return new Response(null, {
        status: 400,
      });
    }
    const query = db
      .prepare("SELECT * FROM user WHERE email = ?")
      .bind(user.email);
    const existingUser = (await query.first()) as
      | DatabaseUserAttributes
      | undefined
      | null;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return context.redirect("/");
    }
    console.log("User not found.");

    const userId = generateId(15);
    const userCreateQuery = db
      .prepare("INSERT INTO user (id, email, name) VALUES (?, ?, ?)")
      .bind(userId, user.email, user.name);
    await userCreateQuery.run();
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return context.redirect("/");
  } catch (e) {
    console.error(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
