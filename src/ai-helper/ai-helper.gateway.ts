import { 
  SubscribeMessage, 
  WebSocketGateway,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import axios from 'axios';
// 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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AiHelperGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log( `Client connected: ${client.id}`);
  };

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  };
  
  @SubscribeMessage('typing')
  handleTyping(@MessageBody() data: { userId: string }) {
    this.server.emit('typing', { userId: data.userId });
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: any, @MessageBody() payload: any) {
    this.server.emit('message', payload); // Broadcast original message
    try {
      this.server.emit('typing', {
        userId: 'Amaka',
        typing: true,
      });

      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'google/gemma-3n-e2b-it:free',
          messages: [
            {
              role: 'user',
              content: payload.message,
            },
          ],
        },
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
        },
      );

      const content = aiResponse.data.choices[0].message.content;

      this.server.emit('typing', {
        userId: 'Amaka',
        typing: false,
      });

      this.server.emit('message', {
        userId: 'Amaka',
        message: content,
      });
    } catch (error) {
      console.error('AI Error:', error.response?.data || error.message);
      this.server.emit('typing', {
        userId: 'Amaka',
        typing: false,
      });
      this.server.emit('message', {
        userId: 'Amaka',
        message: 'Sorry, something went wrong with AI.',
      });
    };
  };
};
