import Elysia, { Static, t } from 'elysia'
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
// import { env } from '@/env'
import UnauthorizedError from '../utils/exceptions/unauthorized-error'
import NotAManagerError from '../utils/exceptions/not-a-manager-error'
import { sessions } from './sessions'
import { User } from '../models/user'
import {prisma } from '../utils/libs/prisma'


const jwtPayloadSchema = t.Object({
  sub: t.String(),
  userId: t.Optional(t.String()),
})

export const loginController = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401
        return { Status: code, Message: error.message }
      case 'NOT_A_MANAGER':
        set.status = 401
        return { Status: code, Message: error.message }
      case 'VALIDATION':
        set.status = 'Bad Request'
        return { Status: code, Message: "Falha na validação. Certifique-se de fornecer dados válidos." }
      default:
        set.status = 500
        return { Status: code, Message: "Ocorreu um problema no servidor. Tente novamente mais tarde." }
    }
  })
  .use(
    jwt({
      name: 'jwt',
      //   secret: env.JWT_SECRET_KEY,
      secret: 'env.JWT_SECRET_KEY',
      schema: jwtPayloadSchema,
    }),
  )
  .use(cookie())
  .post('/auth/signin', async ({ jwt, cookie, setCookie, body, set }) => {
    const { Email, Password } = body as User;

    // verify email/username
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            Email: Email,
          },
          {
            Password: Password,
          },
        ],
      },
      select: {
        Id: true,
        Name: true,
      },
    });

    if (!user)
      throw new UnauthorizedError();

    // generate access 

    const accessToken = await jwt.sign({
      userId: '1',
      sub: '565454'
    });

    setCookie("access_token", accessToken, {
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });


    return {
      success: true,
      data: null,
      message: "Account login successfully",
    };

  }, {
    body: t.Object({
      Email: t.String({ description: 'paulosmdo@gmail.com' }),
      Password: t.String()
    }),
    detail: {
      tags: ['Auth']
    }
  })
  .derive(async ({ cookie, jwt, set }) => {
    if (!cookie!.access_token)
      throw new UnauthorizedError();

    const userId = await jwt.verify(cookie!.access_token);
    if (!userId)
      throw new UnauthorizedError();

    const user = {
      nome: 'paulo',
      token: 'aaaaaaa'
    };

    if (!user)
      throw new UnauthorizedError();

    return {
      user,
    };
  })
  .use(sessions);
