import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@server/auth/auth.service';
import { LinksService } from '@server/links/links.service';
import { TrpcService } from '@server/trpc/trpc.service';
import { UsersService } from '@server/users/users.service';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';
import { z } from 'zod';

@QueueEventsListener('links')
@Injectable()
export class TrpcRouter extends QueueEventsHost {
  ee = new EventEmitter();

  constructor(
    private readonly trpc: TrpcService,
    private readonly auth: AuthService,
    private readonly links: LinksService,
    private readonly users: UsersService,
  ) {
    super();
  }

  @OnQueueEvent('completed')
  onCompleted({
    jobId,
    returnvalue,
  }: {
    jobId: string;
    returnvalue: string;
    prev?: string;
  }) {
    console.log('jobId: ', jobId);
    this.ee.emit('update', returnvalue);
  }

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
    metadata: this.trpc.procedure
      .input(z.object({ url: z.string() }))
      .mutation(async ({ input }) => {
        const { url } = input;
        return await this.links.metadata(url);
      }),
    analyze: this.trpc.procedure
      .input(z.object({ id: z.number(), type: z.string() }))
      .mutation(async ({ input }) => {
        const { id, type } = input;
        return await this.links.analyze(id, type);
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
          throw new TRPCError({ code: 'NOT_FOUND' });
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
          throw new TRPCError({ code: 'NOT_FOUND' });
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
   * App Router
   */
  // TODO: ctx
  appRouter = this.trpc.router({
    auth: this.authRouter,
    hyperlinks: this.hyperlinksRouter,
    users: this.usersRouter,
    update: this.trpc.procedure
      .input(z.object({ type: z.string() }))
      .subscription(({ input }) => {
        return observable<{ timestamp: number; type: 'links' | 'reports' }>(
          (emit) => {
            const onUpdate = ({ type }: { type: 'links' | 'reports' }) => {
              if (input.type === type) {
                emit.next({ timestamp: Date.now(), type: type });
              }
            };
            this.ee.on('update', onUpdate);
            return () => {
              this.ee.off('update', onUpdate);
            };
          },
        );
      }),
  });
}

export type AppRouter = TrpcRouter[`appRouter`];
