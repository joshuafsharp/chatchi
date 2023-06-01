import { CharacterId } from '../common/config';

export interface Message {
  sender: CharacterId;
  content: string;
  timestamp: number;
}

export class Conversation {
  private static instance: Conversation;

  private messages: Message[] = [];

  constructor() {
    if (!Conversation.instance) {
      Conversation.instance = this;
    }
  }

  public addMessage(sender: CharacterId, content: string): void {
    const timestamp = Date.now();

    this.messages.push({ sender, content, timestamp });

    console.log(this.messages);
  }

  public getMessages(): Message[] {
    return this.messages;
  }
}

export const conversation = new Conversation();
