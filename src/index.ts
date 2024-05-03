import { Hono } from "hono";
import { cors } from "hono/cors";
import { onError } from "./onError";
import { authRoute } from "./routes/auth.route";
import { majorRoute } from "./routes/major.route";
import { userRoute } from "./routes/user.route";

declare module "bun" {
  interface Env {
    PORT: number;

    JWT_SECRET: string;
    JWT_ISSUER: string;

    MAIL_SERVICE: string;
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASS: string;
  }
}

const app = new Hono();
app
  .onError(onError)
  .use("/*", cors())
  .notFound(function (c) {
    return c.json(
      {
        data: null,
        error: "Not found",
      },
      404
    );
  })
  .route("/", userRoute)
  .route("/", authRoute)
  .route("/", majorRoute);

const server = Bun.serve({
  port: Bun.env.PORT,
  fetch: app.fetch,
});
console.log(`Server is running on ${server.url}`);
