import Elysia, { Static, t } from 'elysia'
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'
// import { env } from '@/env'
import UnauthorizedError from '../utils/exceptions/unauthorized-error'
import NotAManagerError from '../utils/exceptions/not-a-manager-error'
import { sessions } from './sessions'


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
        return { code, message: error.message }
      case 'NOT_A_MANAGER':
        set.status = 401
        return { code, message: error.message }
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
    const {email, senha} = body;

    if(!(email == 'paulosmdo@gmail.com' && senha == '123'))
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
  }).use(sessions);
//   .derive(({ jwt, cookie, setCookie, removeCookie }) => {
//     return {
//       getCurrentUser: async () => {
//         const payload = await jwt.verify(cookie.auth)

//         if (!payload) {
//           throw new UnauthorizedError()
//         }

//         return payload
//       },
//       signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
//         setCookie('auth', await jwt.sign(payload), {
//           httpOnly: true,
//           maxAge: 7 * 86400,
//           path: '/',
//         })
//       },
//       signOut: () => {
//         removeCookie('auth')
//       },
//     }
//   })
//   .derive(({ getCurrentUser }) => {
//     return {
//       getManagedRestaurantId: async () => {
//         const { restaurantId } = await getCurrentUser()

//         if (!restaurantId) {
//           throw new NotAManagerError()
//         }

//         return restaurantId
//       },
//     }
//   })