import Elysia from "elysia";

export const sessions = (app: Elysia) =>
  app.group("/session", {
    detail: {
      tags: ['Sessions']
    }
  }, (app) =>
    app
      .post('generate-token', async ({ body, set }) => {
        return "xablau";
      })
      .get('showAllSessions', () => {
        return "xablau2"
      }),
  )
