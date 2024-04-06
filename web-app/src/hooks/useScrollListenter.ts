import { useEffect, useState } from "react";

type Listener = () => void;

export interface IUseScrollListenrStates {
  setListeners: (...listeners: Listener[]) => void;
  addListeners: (...listeners: Listener[]) => void;
}

export const useScrollListener = (
  container?: React.RefObject<HTMLDivElement>
): IUseScrollListenrStates => {
  const [watchers, setWhatchers] = useState<Listener[]>([]);

  const setListeners = (...listeners: Listener[]) => {
    setWhatchers(listeners);
  };

  const addListeners = (...listeners: Listener[]) => {
    setWhatchers([...watchers, ...listeners]);
  };

  useEffect(() => {
    const current = container?.current;
    let listener = null;
    if (current) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollTop + element.clientHeight === element.scrollHeight;

        if (isAtBottom) {
          watchers.forEach((l) => l());
        }
      };
      current.addEventListener("scroll", listener);
    }

    return () => {
      current && listener && current.removeEventListener("scroll", listener);
    };
  }, [container, watchers]);

  return {
    addListeners,
    setListeners,
  };
};
