import { Route, Routes } from "react-router-dom";
import React from "react";

export default function FakeRoutes({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Routes>
      <Route path="*" element={children} />
    </Routes>
  );
}
