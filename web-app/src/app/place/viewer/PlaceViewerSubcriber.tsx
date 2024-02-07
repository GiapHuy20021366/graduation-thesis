import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { FollowType, IPlaceFollowerExposed, toTimeInfo } from "../../../data";
import { useNavigate } from "react-router";

type PlaceViewerSubciberProps = StackProps & {
  data: IPlaceFollowerExposed;
};

const PlaceViewerSubciber = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSubciberProps
>((props, ref) => {
  const { data, ...rest } = props;
  const navigate = useNavigate();
  const times = toTimeInfo(data.time);

  const handleNavigateClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    props.onClick && props.onClick(event);
    navigate("/user/" + data.subcriber._id);
  };
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
      <Avatar>{data.subcriber.firstName[0]}</Avatar>
      <Stack>
        <Typography sx={{ fontWeight: 450 }}>
          {data.subcriber.firstName} {data.subcriber.lastName}
        </Typography>
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

export default PlaceViewerSubciber;
