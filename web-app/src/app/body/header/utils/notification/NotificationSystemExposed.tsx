import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import {
  useComponentLanguage,
  useNotificationContext,
} from "../../../../../hooks";
import NotificationItemExposed from "./NotificationItemExposed";
import ListEnd from "../../../../common/viewer/data/ListEnd";
import ErrorRetry from "../../../../common/viewer/data/ErrorRetry";
import { useRef, useState } from "react";

interface INotifocationSystemExposedProps {
  onItemClick?: () => void;
}

export default function NotifocationSystemExposed({
  onItemClick,
}: INotifocationSystemExposedProps) {
  const notificationContext = useNotificationContext();
  const {
    groups,
    readNotification,
    isError,
    isFetching,
    loadNotification,
    readAll,
  } = notificationContext;
  const [isAll, setIsAll] = useState<boolean>(true);
  const lang = useComponentLanguage("NotifocationSystemExposed");
  const kepts = useRef<Set<string>>(new Set());

  const handleSetAll = (val: boolean) => {
    if (val == isAll) return;
    setIsAll(val);
    kepts.current.clear();
  };

  const handleReadAll = () => {
    groups.forEach((g) => !g.read && kepts.current.add(g._id));
    readAll();
  };

  const unreadCount = notificationContext.groups.reduce((cur, group) => {
    if (!group.read) cur += 1;
    return cur;
  }, 0);

  return (
    <Stack
      width={["90vw", "60vw", "40vw"]}
      height={["80vh", "60vh", "50vh"]}
      boxSizing={"border-box"}
    >
      <Box
        position={"sticky"}
        top={0}
        zIndex={100}
        fontSize={"1.5em"}
        p={0}
        m={1}
      >
        <Stack direction={"row"} justifyItems={"center"}>
          <Typography sx={{ fontSize: "1.3em" }}>
            {lang("notification")}
          </Typography>
          <Button
            variant="text"
            disabled={unreadCount === 0}
            sx={{
              marginLeft: "auto",
              textTransform: "none",
              fontSize: "0.8em",
            }}
            onClick={() => handleReadAll()}
          >
            {lang("read-all")}
          </Button>
        </Stack>
        <Stack direction={"row"} gap={1} mt={0.5}>
          <Chip
            label={lang("all-label")}
            color={isAll ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSetAll(true)}
          />
          <Chip
            label={lang("not-read-label")}
            color={!isAll ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
            onClick={() => handleSetAll(false)}
          />
        </Stack>
      </Box>
      <Divider />
      <Stack
        sx={{ overflowY: "auto", flex: 1 }}
        width={"100%"}
        p={1}
        boxSizing={"border-box"}
        gap={1}
      >
        {groups.map((group) => {
          if (group.read && !isAll && !kepts.current.has(group._id)) {
            return <></>;
          }
          return (
            <NotificationItemExposed
              group={group}
              key={group._id}
              onClick={() => {
                readNotification(group._id);
                kepts.current.add(group._id);
                onItemClick && onItemClick();
              }}
              sx={{
                minHeight: "5rem",
              }}
            />
          );
        })}

        <Divider />
        <ListEnd
          active={!isError && !isFetching}
          onRetry={() => loadNotification()}
        />
        <ErrorRetry
          active={isError && !isFetching}
          onRetry={() => loadNotification()}
        />
      </Stack>
    </Stack>
  );
}
