import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Authenticate the connection using the token passed in the handshake
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization;
    
    try {
      if (token) {
        // Simple decode to get user id. In prod, verify with secret.
        const decoded = jwt.decode(token.replace('Bearer ', '')) as any;
        
        if (decoded && (decoded.sub || decoded.id)) {
          const userId = decoded.sub || decoded.id;
          // Join a room specific to this user
          client.join(`user_${userId}`);
          this.logger.log(`Client connected: ${client.id} - Joined room: user_${userId}`);
          return;
        }
      }
      this.logger.warn(`Client connected without valid auth token: ${client.id}`);
    } catch (err) {
      this.logger.error(`Error authenticating socket client: ${err.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Method to emit a notification to a specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('new_notification', notification);
    this.logger.log(`Emitted notification to user_${userId}`);
  }
}
