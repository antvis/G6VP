interface Base {
  status?: 'pending' | 'success' | 'cancel';
  role?: 'system' | 'assistant' | 'user';
  content?: string;
  timestamp?: number;
  reserved?: boolean;
}

export class Message implements Base {
  status: 'pending' | 'success' | 'cancel';

  role: 'system' | 'assistant' | 'user';

  content: string;

  timestamp: number;

  reserved: boolean;

  constructor(props: Partial<Base>) {
    this.status = props.status || 'pending';
    this.role = props.role || 'user';
    this.content = props.content || '';
    this.timestamp = props.timestamp || Date.now();
    this.reserved = props.reserved || false;
  }
}
