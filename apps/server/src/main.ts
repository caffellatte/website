import fastify from 'fastify';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import { createContext } from '@server/trpc/context';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { type AppRouter } from '@server/trpc/trpc.router';
import { AppModule } from '@server/app.module';

async function bootstrap(): Promise<void> {
  const application = fastify({
    maxParamLength: 5000,
  });

  const app = new FastifyAdapter(application);

  const server = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    app,
  );

  const trpc = server.get(TrpcRouter);

  server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: trpc.appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });
  app.enableCors({
    credentials: true,
    origin: '*',
  });

  await server.listen(4000);
}

bootstrap();
