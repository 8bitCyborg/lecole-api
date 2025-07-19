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
import { ConfigService } from '@nestjs/config';
import { getOpenRouterConfig } from 'src/config/configuration';
// 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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AiHelperGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private configService: ConfigService){};

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
    let messages: any = [];
    messages.push(payload);

    console.log('mes', messages);

    this.server.emit('message', payload); // Broadcast original message
    try {
      this.server.emit('typing', {
        userId: 'Amaka',
        typing: true,
      });

      const aiResponse = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
          messages: [
            {
              role: 'user',
              content: payload.message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('OPEN_ROUTER_SECRET')}`,
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
        message: 'Sorry, there has been an error. Amaka has disappointed',
      });
    };
  };
};
