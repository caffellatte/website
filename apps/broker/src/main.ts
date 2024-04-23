import { NestFactory } from '@nestjs/core';
import { AppModule } from '@broker/app.module';
import { TrpcRouter, AppRouter } from '@broker/trpc/trpc.router';
import { Server } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createContext } from '@broker/trpc/context';

async function bootstrap() {
  const PORT = 4001;
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer();
  const wss = new Server({ server });
  app.enableCors();
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);
  const wsHandler = applyWSSHandler<AppRouter>({
    wss,
    router: trpc.appRouter,
    createContext: (opts) => {
      // <- here opts.res is instance of WebSocket
      return createContext?.(opts);
    },
  });
  wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });
  console.log(`✅ WebSocket Server listening on ws://localhost:${PORT}`);
  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    wsHandler.broadcastReconnectNotification();
    // wss.close(); uncomment in prod
  });
  await app.listen(PORT);

  // process.on('SIGINT', () => {
  //   console.log('SIGINT');
  //   wsHandler.broadcastReconnectNotification();
  // });
}
bootstrap();
