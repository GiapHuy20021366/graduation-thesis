import { createContext, useCallback, useEffect, useState } from "react";
import {
  INotificationExposed,
  INotificationGroup,
  toNotificationGroups,
} from "../../../../../data";
import {
  useAuthContext,
  useDirty,
  useLoader,
  useSocketContext,
} from "../../../../../hooks";
import { messageFetcher } from "../../../../../api";

const NotificationEmitKey = {
  READ_NOTIFICATION: "read-notification",
} as const;

const NotificationOnKey = {
  NEW_NOTIFICATION: "new-notification",
  READ_NOTIFICATION: "read-notification",
} as const;

interface INotificationContextProviderProps {
  children?: React.ReactNode;
}

interface INotificationContext {
  notifications: INotificationExposed[];
  groups: INotificationGroup[];
  readNotification: (groupId: string) => void;
  loadNotification: () => void;
  readAll: () => void;

  isError: boolean;
  isEnd: boolean;
  isFetching: boolean;
}

export const NotificationContext = createContext<INotificationContext>({
  notifications: [],
  groups: [],
  readNotification: () => {},
  loadNotification: () => {},
  readAll: () => {},

  isEnd: false,
  isError: false,
  isFetching: false,
});

export default function NotificationContextProvider({
  children,
}: INotificationContextProviderProps) {
  const socketContext = useSocketContext();
  const authContext = useAuthContext();
  const { auth } = authContext;
  const [notifications, setNotifications] = useState<INotificationExposed[]>(
    []
  );
  const [groups, setGroups] = useState<INotificationGroup[]>([]);

  const loader = useLoader();

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    const onNewNotification = (notification: INotificationExposed) => {
      const _notifications = notifications.slice();
      _notifications.push(notification);
      const _groups = toNotificationGroups(_notifications);
      setNotifications(_notifications);
      setGroups(_groups);
    };

    const onReadNotifications = (notificationIds: string[]) => {
      const _notifications = notifications.slice();
      _notifications.forEach((n) => {
        if (notificationIds.includes(n._id)) {
          n.read = true;
        }
      });
      const _groups = toNotificationGroups(_notifications);
      setNotifications(_notifications);
      setGroups(_groups);
    };

    socket.on(NotificationOnKey.NEW_NOTIFICATION, onNewNotification);
    socket.on(NotificationOnKey.READ_NOTIFICATION, onReadNotifications);

    return () => {
      socket.removeListener(
        NotificationOnKey.NEW_NOTIFICATION,
        onNewNotification
      );
      socket.removeListener(
        NotificationOnKey.READ_NOTIFICATION,
        onReadNotifications
      );
    };
  }, [notifications, socketContext.socket]);

  const loadNotification = useCallback(() => {
    if (auth == null) return;
    let minTime: number = Date.now();
    if (groups.length > 0) {
      minTime = Math.min(...groups.map((g) => g.minTime.getTime()));
    }
    loader.setIsEnd(false);
    loader.setIsFetching(true);
    loader.setIsError(false);

    messageFetcher
      .getNotifications(0, minTime, 50, auth)
      .then((res) => {
        const data = res.data;
        if (data) {
          if (data.length < 50) {
            loader.setIsEnd(true);
          }
          const _notifications = notifications.slice();
          _notifications.push(...data);
          const _groups = toNotificationGroups(_notifications);
          setNotifications(_notifications);
          setGroups(_groups);
        }
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  }, [auth, groups, loader, notifications]);

  const readNotification = (groupId: string) => {
    const socket = socketContext.socket;
    if (socket) {
      const groupIndex = groups.findIndex((g) => g._id === groupId);
      if (groupIndex !== -1) {
        const group = groups[groupIndex];
        if (!group.read) {
          socket.emit(
            NotificationEmitKey.READ_NOTIFICATION,
            group.datas.map((d) => d._id)
          );
        }
      }
    }
  };

  const readAll = () => {
    const socket = socketContext.socket;
    if (socket) {
      groups.forEach((group) => {
        if (!group.read) {
          socket.emit(
            NotificationEmitKey.READ_NOTIFICATION,
            group.datas.map((d) => d._id)
          );
        }
      });
    }
  };

  const dirty = useDirty();
  useEffect(() => {
    if (auth != null) {
      dirty.perform(() => {
        loadNotification();
      });
    }
  }, [auth, dirty, loadNotification]);

  return (
    <NotificationContext.Provider
      value={{
        groups,
        isEnd: loader.isEnd,
        isError: loader.isError,
        isFetching: loader.isFetching,
        loadNotification,
        readNotification,
        readAll,
        notifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
