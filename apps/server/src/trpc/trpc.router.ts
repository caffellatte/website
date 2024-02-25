import { z } from 'zod';
import { Queue } from 'bull';
import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';
import { observable } from '@trpc/server/observable';
import { TrpcService } from '@server/trpc/trpc.service';
import { LinksService } from '@server/links/links.service';
import { UsersService } from '@server/users/users.service';
import { OnGlobalQueueCompleted, InjectQueue, Processor } from '@nestjs/bull';

@Processor('links')
@Injectable()
export class TrpcRouter {
  ee = new EventEmitter();

  constructor(
    private readonly trpc: TrpcService,
    private readonly links: LinksService,
    private readonly users: UsersService,
    @InjectQueue('links') private readonly linksQueue: Queue,
  ) {}

  @OnGlobalQueueCompleted()
  async onGlobalCompleted(jobId: number, result: any) {
    const job = await this.linksQueue.getJob(jobId);
    if (job?.queue.name === 'links' && 'analyze' === job?.name) {
      this.ee.emit('update', JSON.parse(result));
    }
  }

  appRouter = this.trpc.router({
    register: this.trpc.procedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const { username, password } = input;
        const user = await this.users.create(username, password);
        return user;
      }),
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
        const links = await this.links.create(title, description, url);
        this.ee.emit('update', { type: 'links' });
        return links;
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
}

export type AppRouter = TrpcRouter[`appRouter`];
