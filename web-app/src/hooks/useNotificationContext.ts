import { useContext } from "react";
import { NotificationContext } from "../app/body/header/utils/notification/NotificationContext";

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationContextProvider"
    );
  }
  return context;
}
