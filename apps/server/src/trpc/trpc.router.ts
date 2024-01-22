import { INestApplication, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@server/trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
import { LinksService } from '@server/links/links.service';
import { observable } from '@trpc/server/observable';

@Injectable()
export class TrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly links: LinksService,
  ) {}

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        }),
      )
      .query(({ input }) => {
        const { name } = input;
        return {
          greeting: `Hello ${name ? name : `Bilbo`}`,
        };
      }),
    randomNumber: this.trpc.procedure
      .input(z.object({ odd: z.boolean() }))
      .subscription(({ input }) => {
        return observable<{ randomNumber: number }>((emit) => {
          const timer = setInterval(() => {
            // emits a number every second
            let randomNumber = Math.round(Math.random() * 10000);
            if (
              (input.odd && randomNumber % 2 === 1) ||
              (!input.odd && randomNumber % 2 === 0)
            )
              randomNumber++;
            emit.next({ randomNumber });
          }, 1000);

          return () => {
            clearInterval(timer);
          };
        });
      }),
    linksAnalyze: this.trpc.procedure
      .input(z.object({ type: z.string() }))
      .mutation(async ({ input }) => {
        const { type } = input;
        return await this.links.analyze(type);
      }),
    linkCreate: this.trpc.procedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          url: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const { title, description, url } = input;
        console.log('trpc.router.ts:', title, description, url);
        return await this.links.create(title, description, url);
      }),
    linksFindAll: this.trpc.procedure
      .input(z.object({}).optional())
      .query(async () => {
        const links = await this.links.findAll();
        return {
          links: links,
        };
      }),
    linkFindById: this.trpc.procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { id } = input;
        const link = await this.links.findOne(id);
        return {
          link: link,
        };
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({
        router: this.appRouter,
        // createContext,
      }),
    );
  }
}

export type AppRouter = TrpcRouter[`appRouter`];
