import { useRef } from "react";

interface IUseDirtyStates {
  perform: (fn: () => void, force?: boolean) => void;
  set: (dirty: boolean) => void;
  value: boolean;
}

export const useDirty = (init?: boolean): IUseDirtyStates => {
  const dirtyRef = useRef<boolean>(init ?? true);

  const perform = (fn: () => void, force?: boolean) => {
    if (dirtyRef.current) {
      dirtyRef.current = false;
      fn();
    } else {
      if (force) {
        fn();
      }
    }
  };

  const set = (dirty: boolean) => {
    dirtyRef.current = dirty;
  };

  return {
    perform,
    set,
    value: dirtyRef.current,
  };
};
