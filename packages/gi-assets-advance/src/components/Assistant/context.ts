import { createContext } from 'react';
import { Message } from './utils/message';

export const ComponentContext = createContext<{
  abortQuery?: () => void;
  clearMessages?: () => void;
  loading?: boolean;
  messages: Message[];
  onInput?: (value: string) => Promise<boolean>;
  onSendMessage?: (message: Message) => Promise<boolean>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  messages: [],
});
