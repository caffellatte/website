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

export async function createContext({ req }: CreateFastifyContextOptions) {
  const { authorization } = req.headers;
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
