import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useNotificationContext } from "../../../../../hooks";
import NotificationItemExposed from "./NotificationItemExposed";
import ListEnd from "../../../../common/viewer/data/ListEnd";
import ErrorRetry from "../../../../common/viewer/data/ErrorRetry";
import { useState } from "react";

export default function NotifocationSystemExposed() {
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
          <Typography sx={{ fontSize: "1.3em" }}>Thông báo</Typography>
          <Button
            variant="text"
            disabled={unreadCount === 0}
            sx={{
              marginLeft: "auto",
              textTransform: "none",
              fontSize: "0.8em",
            }}
            onClick={() => readAll()}
          >
            Đọc hết
          </Button>
        </Stack>
        <Stack direction={"row"} gap={1} mt={0.5}>
          <Chip
            label="Tất cả"
            color={isAll ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
            onClick={() => setIsAll(true)}
          />
          <Chip
            label="Chưa đọc"
            color={!isAll ? "secondary" : "default"}
            sx={{ cursor: "pointer" }}
            onClick={() => setIsAll(false)}
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
          if (group.read && !isAll) {
            return <></>;
          }
          return (
            <NotificationItemExposed
              group={group}
              key={group._id}
              onClick={() => readNotification(group._id)}
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
          onRetry={() => loadNotification}
        />
      </Stack>
    </Stack>
  );
}
