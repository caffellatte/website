import { NestFactory } from '@nestjs/core';
import { AppModule } from '@server/app.module';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { Server } from 'ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { AppRouter } from '@server/trpc/trpc.router';

async function bootstrap() {
  const PORT = 4000;
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer();
  const wss = new Server({ server });
  app.enableCors();
  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);
  const wsHandler = applyWSSHandler<AppRouter>({
    wss,
    router: trpc.appRouter,
    // createContext:
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
}
bootstrap();
