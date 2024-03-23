import { Badge, BadgeProps, IconButtonProps } from "@mui/material";
import NotificationButtonAction from "./NotificationButtonAction";

interface INotificationProviderProps {
  IconProps?: IconButtonProps;
  BadgeProps?: BadgeProps;
}

export default function NotificationProvider({
  IconProps,
  BadgeProps,
}: INotificationProviderProps) {
  return (
    <Badge badgeContent={"4"} color="secondary" {...BadgeProps}>
      <NotificationButtonAction {...IconProps} />
    </Badge>
  );
}
