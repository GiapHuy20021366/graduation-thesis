// A component for providing all utils notification when it called

import { Badge } from "@mui/material";
import NotificationButtonAction from "./NotificationButtonAction";

// Display as a button to open notification center
export default function NotificationProvider() {
  return (
    <Badge badgeContent={"4"} color="secondary">
      <NotificationButtonAction />
    </Badge>
  );
}
