import React from "react";
import { Box, BoxProps } from "@mui/material";

type UserInfoContentProps = BoxProps;

const UserInfoContent = React.forwardRef<HTMLDivElement, UserInfoContentProps>(
  (props, ref) => {
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
  }
);

export default UserInfoContent;
