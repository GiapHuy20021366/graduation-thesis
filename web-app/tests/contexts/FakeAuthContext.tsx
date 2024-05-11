import { AuthenticationContext } from "../../src/app/AuthContext";
import React from "react";
import { vi } from "vitest";

export default function FakeAuthContext({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <AuthenticationContext.Provider
      value={{
        logout: vi.fn(),
        setAccount: vi.fn(),
        setToken: vi.fn(),
        updateLocation: vi.fn(),
        account: {
          _id: "fake",
          token: "fake",
          active: true,
          email: "fake",
          location: {
            name: "fake",
            coordinates: {
              lat: 0,
              lng: 0,
            },
          },
        },
        auth: {
          token: "123",
          updatedAt: Date.now(),
        },
        token: "123",
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
