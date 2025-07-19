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

@WebSocketGateway()
export class AiHelperGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log( `Client connected: ${client.id}`);
  };

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  };

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client: any, @MessageBody() payload: any) {
    this.server.emit('message', payload); // Broadcast original message
    try {
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

      this.server.emit('message', {
        userId: 'Amaka',
        message: content,
      });
    } catch (error) {
      console.error('AI Error:', error.response?.data || error.message);
      this.server.emit('message', {
        userId: 'Amaka',
        message: 'Sorry, something went wrong with AI.',
      });
    };
  };
};
