import 'dotenv/config';
import { TRPCError } from '@trpc/server';
import jwt = require('jsonwebtoken');
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export async function createContext({ req }: CreateFastifyContextOptions) {
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
  if (req.headers.authorization) {
    const user = await verifyJwtPromise(
      req.headers.authorization,
      process.env.JWT_SECRET ?? '',
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
