import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { FollowType, IFollowerExposed, toTimeInfo } from "../../../../data";
import { useNavigate } from "react-router";
import { useComponentLanguage } from "../../../../hooks";

type SubciberExposedProps = StackProps & {
  data: IFollowerExposed;
  onBeforeNavigate?: () => void;
};

const toSubcriberId = (data: IFollowerExposed): string => {
  const subcriber = data.subcriber;
  return typeof subcriber === "string" ? subcriber : subcriber._id;
};

const toSubcriberNameAndavatar = (
  data: IFollowerExposed
): { name: string; avatar?: string } => {
  const subcriber = data.subcriber;
  if (typeof subcriber === "string") {
    return {
      name: "SYSTEM_USER",
    };
  } else {
    return {
      name: subcriber.firstName + " " + subcriber.lastName,
      avatar: subcriber.avatar,
    };
  }
};

const SubcriberExposed = React.forwardRef<HTMLDivElement, SubciberExposedProps>(
  (props, ref) => {
    const { data, onBeforeNavigate, ...rest } = props;
    const navigate = useNavigate();
    const lang = useComponentLanguage("ViewerData");
    const times = toTimeInfo(data.updatedAt);

    const handleNavigateClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      props.onClick && props.onClick(event);
      onBeforeNavigate && onBeforeNavigate();
      const subcriberId = toSubcriberId(data);
      navigate("/user/" + subcriberId);
    };

    const nameAndavatar = toSubcriberNameAndavatar(data);

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
        <Avatar src={nameAndavatar.avatar}>{nameAndavatar.name[0]}</Avatar>
        <Stack>
          <Typography sx={{ fontWeight: 450 }}>{nameAndavatar.name}</Typography>
          <Typography>
            {[data.type].map((followType) => {
              switch (followType) {
                case FollowType.ADMIN:
                  return `${lang("admin-create-from")}  ${times.day}/${
                    times.month
                  }/${times.year}`;
                case FollowType.SUBCRIBER:
                  return `${lang("subcriber-from")}  ${times.day}/${
                    times.month
                  }/${times.year}`;
                case FollowType.SUB_ADMIN:
                  return `${lang("become-admin-from")}  ${times.day}/${
                    times.month
                  }/${times.year}`;
                case FollowType.MEMBER: {
                  return `${lang("become-member-from")}  ${times.day}/${
                    times.month
                  }/${times.year}`;
                }
              }
            })}
          </Typography>
        </Stack>
      </Stack>
    );
  }
);

export default SubcriberExposed;
