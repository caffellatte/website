import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CollectionsService } from '../collections/collections.service';
import { LinksService } from '../links/links.service';
import { TrpcService } from '../trpc/trpc.service';
import { UsersService } from '../users/users.service';
import { TRPCError } from '@trpc/server';
import { EventEmitter } from 'events';
import { z } from 'zod';

@Injectable()
export class TrpcRouter {
  ee = new EventEmitter();

  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthService,
    private readonly links: LinksService,
    private readonly users: UsersService,
    private readonly collections: CollectionsService,
  ) {}

  /**
   * Protected Procedure
   */
  protectedProcedure = this.trpc.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  });

  /**
   * Auth Router
   */
  authRouter = this.trpc.router({
    register: this.trpc.procedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const payload = await this.auth.register(
          input.username,
          input.password,
        );
        return payload;
      }),
    login: this.trpc.procedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const { username, password } = input;
        const payload = await this.auth.login(username, password);
        return payload;
      }),
    refresh: this.trpc.procedure
      .input(z.object({ refresh_token: z.string() }))
      .query(async ({ input }) => {
        const { refresh_token } = input;
        const payload = await this.auth.refresh(refresh_token);
        return payload;
      }),
  });

  /**
   * Users Router
   */
  usersRouter = this.trpc.router({
    me: this.protectedProcedure
      .input(z.object({}).nullish())
      .query(async ({ ctx }) => {
        console.log(ctx.user.sub);
        if (ctx.user.sub) {
          const user = await this.users.findOneById(Number(ctx.user.sub));
          if (user) {
            return { id: user.id, username: user.username };
          }
        }
      }),
  });

  /**
   * Links Router
   */
  hyperlinksRouter = this.trpc.router({
    metadata: this.protectedProcedure
      .input(z.object({ url: z.string(), type: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.sub) {
          const { url, type } = input;
          return await this.links.metadata(Number(ctx.user.sub), url, type);
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      }),
    analyze: this.protectedProcedure
      .input(z.object({ id: z.number(), type: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.sub) {
          const { id, type } = input;
          return await this.links.analyze(Number(ctx.user.sub), id, type);
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      }),
    create: this.protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          url: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.sub) {
          const { title, description, url } = input;
          console.log('trpc.router.ts:', title, description, url);
          const link = await this.links.create(
            Number(ctx.user.sub),
            title,
            description,
            url,
          );
          this.ee.emit('update', { type: 'links' });
          return link;
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      }),
    findAll: this.trpc.procedure
      .input(z.object({}).optional())
      .query(async () => {
        const links = await this.links.findAll();
        return {
          links: links,
        };
      }),
    get: this.protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(20).nullish(),
          cursor: z.number().nullish(),
        }),
      )
      .query(async ({ input, ctx }) => {
        if (ctx.user.sub) {
          const cursor = input.cursor ?? 0;
          const limit = input.limit ?? 10;
          const { data, total } = await this.links.get(
            Number(ctx.user.sub),
            cursor,
            limit,
          );
          const nextCursor = cursor + limit;
          return {
            links: data,
            total: total,
            nextCursor,
          };
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      }),
    findById: this.trpc.procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { id } = input;
        const link = await this.links.findOne(id);
        return {
          link: link,
        };
      }),
  });

  /**
   * Collections Router
   */
  collectionsRouter = this.trpc.router({
    create: this.protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          path: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.sub) {
          const { title, description, path } = input;
          console.log('trpc.router.ts:', title, description, path);
          const collection = await this.collections.create(
            Number(ctx.user.sub),
            title,
            description,
            path,
          );
          // this.ee.emit('update', { type: 'collections' });
          return collection;
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      }),
    findTrees: this.protectedProcedure.input(z.object({}).nullish()).query(
      async ({
        // input,
        ctx,
      }) => {
        if (ctx.user.sub) {
          // const { title, description, path } = input;

          const collections = await this.collections.findTrees(
            Number(ctx.user.sub),
            // title,
            // description,
            // path,
          );
          // this.ee.emit('update', { type: 'collections' });
          return collections;
        } else {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
      },
    ),
  });

  /**
   * App Router
   */
  appRouter = this.trpc.router({
    auth: this.authRouter,
    hyperlinks: this.hyperlinksRouter,
    collections: this.collectionsRouter,
    users: this.usersRouter,
  });
}

export type AppRouter = TrpcRouter[`appRouter`];
