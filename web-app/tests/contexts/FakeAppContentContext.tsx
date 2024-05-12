import React from "react";
import { vi } from "vitest";
import { AppContentContext } from "../../src/app/AppContentContext";

export default function FakeAppContentContext({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <AppContentContext.Provider
      value={{
        mainContent: {
          visibleLeft: false,
          visibleRight: false,
        },
        menuSide: {
          active: false,
        },
        setMainLeftVisible: vi.fn(),
        setMainRightVisible: vi.fn(),
        setMenuSideActive: vi.fn(),
        currentLocation: {
          lat: 123,
          lng: 123,
        },
      }}
    >
      {children}
    </AppContentContext.Provider>
  );
}
