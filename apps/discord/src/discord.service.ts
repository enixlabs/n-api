import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordService {
  getHello(): string {
    return 'Hello World!';
  }
}
