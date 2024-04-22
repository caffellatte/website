import 'dotenv/config';
import { TRPCError } from '@trpc/server';
import jwt = require('jsonwebtoken');
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

const verifyJwtPromise = (
  token: string,
  secret: string,
): Promise<jwt.JwtPayload | undefined | string> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

function getCookie(cookies: string, cookiename: string) {
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(cookiename + '=[^;]+').exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '',
  );
}

//Sample usage
// var cookieValue = getCook('MYBIGCOOKIE');

export async function createContext({ req }: CreateFastifyContextOptions) {
  let authorization = '';
  let access_token = '';
  if (req.headers.cookie) {
    access_token = getCookie(req.headers.cookie, 'access_token');
  }
  authorization = req.headers.authorization ?? access_token;
  if (authorization !== 'undefined' && authorization) {
    const user = await verifyJwtPromise(
      authorization,
      process.env.JWT_ACCESS_SECRET ?? '',
    ).catch((err) => {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: err.message,
      });
    });
    return { user };
  } else {
    return {};
  }
}
export type Context = Awaited<ReturnType<typeof createContext>>;
