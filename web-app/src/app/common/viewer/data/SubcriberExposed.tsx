import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { FollowType, IFollowerExposed, toTimeInfo } from "../../../../data";
import { useNavigate } from "react-router";

type SubciberExposedProps = StackProps & {
  data: IFollowerExposed;
  onBeforeNavigate?: () => void;
};

const toSubcriberId = (data: IFollowerExposed): string => {
  const subcriber = data.subcriber;
  return typeof subcriber === "string" ? subcriber : subcriber._id;
};

const toSubcriberNameAndAvartar = (
  data: IFollowerExposed
): { name: string; avartar?: string } => {
  const subcriber = data.subcriber;
  if (typeof subcriber === "string") {
    return {
      name: "SYSTEM_USER",
    };
  } else {
    return {
      name: subcriber.firstName + " " + subcriber.lastName,
      avartar: subcriber.avartar,
    };
  }
};

const SubcriberExposed = React.forwardRef<
  HTMLDivElement,
  SubciberExposedProps
>((props, ref) => {
  const { data, onBeforeNavigate, ...rest } = props;
  const navigate = useNavigate();
  const times = toTimeInfo(data.updatedAt);

  const handleNavigateClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    props.onClick && props.onClick(event);
    onBeforeNavigate && onBeforeNavigate();
    const subcriberId = toSubcriberId(data);
    navigate("/user/" + subcriberId);
  };

  const nameAndAvartar = toSubcriberNameAndAvartar(data);

  return (
    <Stack
      ref={ref}
      direction={"row"}
      gap={1}
      {...rest}
      sx={{
        width: "100%",
        cursor: "pointer",
        ...(props.sx ?? {}),
      }}
      onClick={handleNavigateClick}
    >
      <Avatar src={nameAndAvartar.avartar}>{nameAndAvartar.name[0]}</Avatar>
      <Stack>
        <Typography sx={{ fontWeight: 450 }}>{nameAndAvartar.name}</Typography>
        <Typography>
          {[data.type].map((followType) => {
            switch (followType) {
              case FollowType.ADMIN:
                return `Quản trị viên tạo trang từ  ${times.day}/${times.month}/${times.year}`;
              case FollowType.SUBCRIBER:
                return `Theo dõi trang từ  ${times.day}/${times.month}/${times.year}`;
              case FollowType.SUB_ADMIN:
                return `Trở thành quản trị viên từ  ${times.day}/${times.month}/${times.year}`;
              case FollowType.MEMBER: {
                return `Trở thành thành viên từ  ${times.day}/${times.month}/${times.year}`;
              }
            }
          })}
        </Typography>
      </Stack>
    </Stack>
  );
});

export default SubcriberExposed;
