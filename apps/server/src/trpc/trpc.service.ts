import { initTRPC } from '@trpc/server';
import { Injectable } from '@nestjs/common';
import { Context } from '@server/trpc/context';

@Injectable()
export class TrpcService {
  trpc = initTRPC.context<Context>().create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  createCallerFactory = this.trpc.createCallerFactory;
}
