/// <reference types="astro/client" />
interface Env {
  ADMITS_WEBSITE_D1: D1Database;
}
type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
