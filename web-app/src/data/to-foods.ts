import { INotificationGroup } from "./notification-exposed";

export const toFoods = (data: INotificationGroup) => {
  const result: Set<string> = new Set();
  data.datas.forEach((data) => {
    data.typedFoods?.forEach((f) => result.add(f));
  });
  return [...result];
};
