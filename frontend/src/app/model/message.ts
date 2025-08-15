
export class Message {
  id?:  number;
  sender: string | undefined;
  receiver: string | undefined;
  content: string | undefined;
  groupId?: number| undefined;
  timestamp: Date;
  read: boolean;

  constructor(sender: string, receiver: string, content: string, timestamp: Date, read: boolean) {
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.timestamp = timestamp;
    this.read = read
  }
}
