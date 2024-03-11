import React from "react";
import { Box, BoxProps } from "@mui/material";

type UserViewerMapExposedContentProps = BoxProps;

const UserViewerMapExposedContent = React.forwardRef<
  HTMLDivElement,
  UserViewerMapExposedContentProps
>((props, ref) => {
  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      Vị trí của người dùng
    </Box>
  );
});

export default UserViewerMapExposedContent;
