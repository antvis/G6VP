import { Message } from '../components/Assistant/utils/message';

export function query(
  messages: Message[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<{
  status: 'success' | 'cancel' | 'failed';
  message: any;
}> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
    .then(res => res.json())
    .then(res => {
      return {
        status: 'success' as const,
        message: res.choices[0].message,
      };
    })
    .catch(error => {
      if (error.name === 'AbortError')
        return {
          status: 'cancel',
          message: null,
        };
      return {
        status: 'failed',
        message: error.message,
      };
    });
}
