import { useRef } from 'react';

export const useController = () => {
  const controller = useRef<AbortController>(new AbortController());

  if (controller.current.signal.aborted) {
    controller.current = new AbortController();
  }

  return controller.current;
};
