import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

function getCookie(cookie: string | undefined, cookiename: string) {
  if (!cookie) {
    return cookie;
  }
  // Get name followed by anything except a semicolon
  const cookiestring = RegExp(cookiename + '=[^;]+').exec(cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '',
  );
}

export async function createContext(
  opts: CreateExpressContextOptions | CreateWSSContextFnOptions,
) {
  const user_id = getCookie(opts.req.headers.cookie, 'user_id');
  if (user_id) {
    return {
      user: {
        id: Number(user_id),
      },
    };
  }
  return {
    user: {
      id: null,
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
