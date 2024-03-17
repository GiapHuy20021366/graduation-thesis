import React from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import UserViewerDescription from "./UserViewerDescription";
import UserViewerLocation from "./UserViewerLocation";
import UserViewerCategories from "./UserViewerCategories";
import { useUserViewerContext } from "../../../hooks";

type UserViewerIntroductionProps = StackProps & {
  active: boolean;
};

const UserViewerIntroduction = React.forwardRef<
  HTMLDivElement,
  UserViewerIntroductionProps
>((props, ref) => {
  const { active, ...rest } = props;
  const viewerContext = useUserViewerContext();
  const { categories } = viewerContext;
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
      <UserViewerDescription />
      <Divider />
      <UserViewerLocation />
      <Divider />
      <UserViewerCategories categories={categories} />
    </Stack>
  );
});

export default UserViewerIntroduction;
