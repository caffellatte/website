import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@broker/trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { observable } from '@trpc/server/observable';
import { createContext } from '@broker/trpc/context';
import { TRPCError } from '@trpc/server';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { EventEmitter } from 'events';

@QueueEventsListener('links')
@Injectable()
export class TrpcRouter extends QueueEventsHost {
  ee = new EventEmitter();

  constructor(private readonly trpc: TrpcService) {
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

  appRouter = this.trpc.router({
    update: this.protectedProcedure
      .input(z.object({ type: z.string() }))
      .subscription(({ input, ctx }) => {
        return observable<{
          timestamp: number;
          user_id: number;
          type: 'links' | 'reports' | 'analyze' | 'metadata';
          ctx: {
            user: { id: number } | { id: null };
          };
          data: any;
        }>((emit) => {
          const onUpdate = ({
            type,
            user_id,
            data,
          }: {
            type: 'links' | 'reports' | 'analyze' | 'metadata';
            user_id: number;
            data: any;
          }) => {
            if (input.type === type && ctx.user.id === user_id) {
              emit.next({
                timestamp: Date.now(),
                type: type,
                ctx,
                user_id,
                data,
              });
            }
          };
          this.ee.on('update', onUpdate);
          return () => {
            this.ee.off('update', onUpdate);
          };
        });
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
