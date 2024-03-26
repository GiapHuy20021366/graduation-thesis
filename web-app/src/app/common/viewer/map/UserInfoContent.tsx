import React from "react";
import { Box, BoxProps } from "@mui/material";
import { useComponentLanguage } from "../../../../hooks";

type UserInfoContentProps = BoxProps;

const UserInfoContent = React.forwardRef<HTMLDivElement, UserInfoContentProps>(
  (props, ref) => {
    const lang = useComponentLanguage("ViewerData");
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        {lang("user-location")}
      </Box>
    );
  }
);

export default UserInfoContent;
