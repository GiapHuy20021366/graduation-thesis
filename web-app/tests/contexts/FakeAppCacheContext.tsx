import React from "react";
import { vi } from "vitest";
import { AppCacheContext } from "../../src/app/AppCacheContext";

export default function FakeAppCacheContext({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <AppCacheContext.Provider
      value={{
        clear: vi.fn(),
        get: () => undefined,
        getOrCreate: () => ({} as any),
        querySelector: () => undefined,
        querySelectorAll: () => ({} as any),
        remove: () => undefined,
        removeIf: () => undefined,
        save: () => undefined,
      }}
    >
      {children}
    </AppCacheContext.Provider>
  );
}
