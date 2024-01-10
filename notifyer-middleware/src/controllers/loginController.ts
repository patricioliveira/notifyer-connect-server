import Elysia, { Static, t } from 'elysia'
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
// import { env } from '@/env'
import UnauthorizedError from '../utils/exceptions/unauthorized-error'
import NotAManagerError from '../utils/exceptions/not-a-manager-error'
import { sessions } from './sessions'
import { User } from '../models/user'
import { prisma } from '../utils/libs/prisma'
import { HttpRespose } from '../models/httpResponse'
import { comparePassword, hashPassword, md5hash } from '../utils/libs/bcrypt'


const jwtPayloadSchema = t.Object({
  userId: t.Optional(t.String()),
  name: t.Optional(t.String()),
  token: t.Optional(t.String())
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
        return new HttpRespose(code, error.message, '')
      case 'NOT_A_MANAGER':
        set.status = 401
        return new HttpRespose(code, error.message, '')
      case 'VALIDATION':
        set.status = 'Bad Request'
        return new HttpRespose(code, 'Falha na validação. Certifique-se de fornecer dados válidos.', '')
      default:
        set.status = 500
        return new HttpRespose(code, 'Ocorreu um problema no servidor. Tente novamente mais tarde.', error.message)
    }
  })
  .use(
    jwt({
      name: 'jwt',
      //   secret: env.JWT_SECRET_KEY,
      secret: Bun.env.JWT_SECRETKEY as string,
      schema: jwtPayloadSchema,
    }),
  )
  .use(cookie()).group('/auth', {
    detail: {
      tags: ['Auth']
    }
  },
    (app) =>
      app.post('signin', async ({ jwt, cookie, setCookie, body, set }) => {
        const { Email, Password } = body as User;

        // verify email/username
        const user = await prisma.user.findFirst({
          where: {
            AND: [
              {
                Email: Email,
              },
              {
                Email,
              },
            ],
          },
          select: {
            Id: true,
            Name: true,
            Password: true,
            Salt:true
          },
        });


        if (!user)
          throw new UnauthorizedError();
        
        // verify password
        const match = await comparePassword(Password, user.Salt, user.Password);
        if (!match) 
          throw new UnauthorizedError();
          

        // generate access 
        const accessToken = await jwt.sign({
          userId: user.Id,
          name: user.Name,
          sub: md5hash((new Date()).toISOString())
        });

        //await prisma.token.delete({where:{UserId: user.Id}, re});
        await prisma.token.create({
          data:{
            UserId: user.Id,
            AccessToken: accessToken,
            SessionKey: ''
          }
        })

        setCookie("access_token", accessToken, {
          maxAge: 15 * 60, // 15 minutes
          path: "/",
        });


        return new HttpRespose('', '', 'Account login successfully');

      }, {
        body: t.Object({
          Email: t.String({ description: 'seuemail@gmail.com' }),
          Password: t.String()
        })
      })
      .post('signup', async ({ jwt, cookie, setCookie, body, set }) => {

        const { Email, Name, Password } = body;
          // validate duplicate email address
          const emailExists = await prisma.user.findUnique({
            where: {
              Email,
            },
            select: {
              Id: true,
            },
          });
          if (emailExists) {
            set.status = 400;
            return new HttpRespose('400', 'Email address already in use.', '');
          }          

          // handle password
          const { hash, salt } = await hashPassword(Password);
          const emailHash = md5hash(Email);

          const newUser = await prisma.user.create({
            data: {
              Email:Email,
              Name:Name,
              Password:hash,
              Salt:salt
            },
          });

        return new HttpRespose('', 'Account created successfully', newUser);
      }, {
        body: t.Object({
          Name: t.String(),
          Email: t.String({ description: 'paulosmdo@gmail.com' }),
          Password: t.String()
        })
      })

  )
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
