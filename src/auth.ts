import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import type { D1Database } from "@cloudflare/workers-types";
import { Google } from "arctic";

export const google = new Google(
  import.meta.env.CLIENT_ID,
  import.meta.env.CLIENT_SECRET,
  `${import.meta.env.FRONTEND_URL}/login/google/callback`
);

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        // set to `true` when using HTTPS
        secure: import.meta.env.PROD,
      },
    },
    getUserAttributes: (attrs) => {
      return {
        id: attrs.id,
        name: attrs.name,
        email: attrs.email,
      };
    },
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
export interface DatabaseUserAttributes {
  id: string;
  name: string;
  email: string;
}
