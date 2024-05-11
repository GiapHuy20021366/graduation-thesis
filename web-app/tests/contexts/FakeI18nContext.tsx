import React from "react";
import { I18nContext } from "../../src/app/I18nContext";
import { vi } from "vitest";

export default function FakeI18nContext({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <I18nContext.Provider
      value={{
        language: { code: "vi", value: {} },
        of: () => (key: string) => key,
        switchLanguage: vi.fn(),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}
