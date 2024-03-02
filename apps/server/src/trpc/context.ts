import 'dotenv/config';
import { TRPCError } from '@trpc/server';
import jwt = require('jsonwebtoken');
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export async function createContext({ req }: CreateFastifyContextOptions) {
  if (req.headers.authorization) {
    const secretKey = process.env.JWT_SECRET || '';
    jwt.verify(req.headers.authorization, secretKey, (err, decoded) => {
      if (err) {
        console.log();
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: err.message,
        });
      }
      return { user: decoded };
    });
  }
  return {};
}
export type Context = Awaited<ReturnType<typeof createContext>>;
