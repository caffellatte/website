import * as trpcNext from '@trpc/server/adapters/next';

const decodeAndVerifyJwtToken = (token: string): number | null => {
  if (token === 'ok') {
    return 1;
  }
  return null;
};

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers
  // This is just an example of something you might want to do in your ctx fn
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.split(' ')[1],
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    user,
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
