import { initializeLucia } from "../../auth";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }
  const lucia = initializeLucia(context.locals.runtime.env.ADMITS_WEBSITE_D1);

  await lucia.invalidateSession(context.locals.session.id);
  context.cookies.set("state", "", {
    secure: import.meta.env.PROD,
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  // store code verifier as cookie
  context.cookies.set("code_verifier", "", {
    secure: import.meta.env.PROD,
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  const sessionCookie = lucia.createBlankSessionCookie();
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return new Response();
}
