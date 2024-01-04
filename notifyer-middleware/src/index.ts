import { Elysia, t } from "elysia";
import { loginController } from "./controllers/loginController";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";
import UnauthorizedError from "./utils/exceptions/unauthorized-error";
import NotAManagerError from "./utils/exceptions/not-a-manager-error";

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

// const app = new Elysia()
// .group("/api", (app) =>
//     app.use(loginController)
//   )

const app = new Elysia()
.group("/api", (app) =>
  app.use(loginController)
) 
.get("/", () => "Runner Notifyer Server 🚀").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
