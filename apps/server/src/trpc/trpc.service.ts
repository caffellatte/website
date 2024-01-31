import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { EventEmitter } from 'events';

@Injectable()
export class TrpcService {
  trpc = initTRPC.create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  createCallerFactory = this.trpc.createCallerFactory;
  ee = new EventEmitter();
}
