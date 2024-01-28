import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { EventEmitter } from 'events';
import type { Context } from '@server/trpc/context';

@Injectable()
export class TrpcService {
  trpc = initTRPC.context<Context>().create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  middleware = this.trpc.middleware;
  createCallerFactory = this.trpc.createCallerFactory;
  ee = new EventEmitter();
}
