import { Elysia, t } from "elysia";
import { loginController } from "./controllers/loginController";
import { swagger } from '@elysiajs/swagger';

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

// const app = new Elysia()
// .group("/api", (app) =>
//     app.use(loginController)
//   )

const app = new Elysia().use(swagger(
  {
    documentation: {
      info: {
        title: 'Notifyer Documentation',
        version: '1.0.0'
      },
      tags: [
        { name: 'App', description: 'General endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Sessions', description: 'Sessions endpoints' }
      ]
    }
  }
))
  .group("/api", (app) =>
    app.use(loginController)
  )
  .get("/", () => "Runner Notifyer Server 🚀", {
    detail: {
      tags: ['App']
    }
  }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
