import React from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import { IUserExposedWithFollower } from "../../../data";
import UserViewerDescription from "./UserViewerDescription";
import UserViewerLocation from "./UserViewerLocation";
import UserViewerCategories from "./UserViewerCategories";

type UserViewerIntroductionProps = StackProps & {
  data: IUserExposedWithFollower;
  active: boolean;
};

const UserViewerIntroduction = React.forwardRef<
  HTMLDivElement,
  UserViewerIntroductionProps
>((props, ref) => {
  const { data, active, ...rest } = props;
  return (
    <Stack
      ref={ref}
      gap={1}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
      display={active ? "flex" : "none"}
    >
      <UserViewerDescription data={data} />
      <Divider />
      <UserViewerLocation data={data} />
      <Divider />
      <UserViewerCategories categories={data.categories} />
    </Stack>
  );
});

export default UserViewerIntroduction;
