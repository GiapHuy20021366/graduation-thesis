import { durations } from ".";
import { INotification, NotificationType } from "./notification";
import { Ided, Timed } from "./schemad";

export interface INotificationExposed
  extends Omit<INotification, "users" | "reads">,
    Ided,
    Timed,
    Ided {
  user: string;
  read: boolean;
}

export interface INotificationGroup extends Ided {
  type: NotificationType;
  datas: INotificationExposed[];
  read: boolean;
  minTime: Date;
  maxTime: Date;
  count: number;
}

export interface INotificationGroupAbstract<T>
  extends Omit<INotificationGroup, "datas"> {
  datas: T[];
}

export const toNotificationTypeGroups = (
  type: NotificationType,
  notifications: INotificationExposed[]
): INotificationGroup[] => {
  return notifications.map(
    (n): INotificationGroup => ({
      _id: n._id,
      count: 1,
      datas: [n],
      maxTime: new Date(n.createdAt),
      minTime: new Date(n.createdAt),
      read: n.read,
      type: type,
    })
  );
};

export const groupNotificationsByDuration = (
  datas: INotificationExposed[],
  duration: number
): INotificationExposed[][] => {
  const result: INotificationExposed[][] = [];
  const dataWithDate = datas.map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt),
    updatedAt: new Date(d.updatedAt),
  }));
  dataWithDate.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  let group: INotificationExposed[] | null = null;
  let index = 0;
  while (index < dataWithDate.length) {
    const notification = dataWithDate[index];
    if (group == null) {
      group = [notification];
    } else {
      const latestTime = group[0].createdAt.getTime();
      const currentTime = notification.createdAt.getTime();
      if (latestTime - currentTime > duration) {
        result.push(group);
        group = [notification];
      } else {
        group.push(notification);
      }
    }
    ++index;
  }
  if (group != null) {
    result.push(group);
  }

  return result;
};

export const toNotificationAnyGroups = (
  notifications: INotificationExposed[],
  duration: number
): INotificationGroup[] => {
  const groups = groupNotificationsByDuration(notifications, duration);
  return groups.map(
    (group): INotificationGroup => ({
      _id: group[0]._id,
      count: group.length,
      datas: group,
      maxTime: group[0].createdAt,
      minTime: group[group.length - 1].createdAt,
      read: group.every((n) => n.read),
      type: group[0].type,
    })
  );
};

export const toNotificationGroups = (
  notifications: INotificationExposed[]
): INotificationGroup[] => {
  const result: INotificationGroup[] = [];

  const typeToNotifications: Record<string, INotificationExposed[]> = {};
  notifications.forEach((n) => {
    const type = n.type;
    const collect = typeToNotifications[type] ?? [];
    collect.push(n);
    typeToNotifications[type] = collect;
  });

  Object.entries(typeToNotifications).forEach(([_type, datas]) => {
    const type = +_type as NotificationType;
    switch (type) {
      case NotificationType.FOOD_NEAR_EXPIRED:
      case NotificationType.FOOD_EXPIRED:
      case NotificationType.FOOD_LIKED:
      case NotificationType.FOOD_SUGGESTED_AROUND:
      case NotificationType.FOOD_SUBCRIBED_PLACE:
      case NotificationType.FOOD_SUBCRIBED_USER: {
        const groups = toNotificationAnyGroups(datas, durations.TWO_HOURS);
        result.push(...groups);
        break;
      }
      case NotificationType.PLACE_INACTIVE:
      case NotificationType.PLACE_RATING:
      case NotificationType.PLACE_REPORT:
      case NotificationType.USER_WELLCOME:
      default: {
        const groups = toNotificationTypeGroups(type, datas);
        result.push(...groups);
        break;
      }
    }
  });

  return result.sort((a, b) => b.maxTime.getTime() - a.maxTime.getTime());
};
