import React from "react";
import { Box, BoxProps, SpeedDial, Stack } from "@mui/material";
import PlaceSkeleton from "./PlaceSkeleton";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";

type MyPlaceProps = BoxProps;

const MyPlace = React.forwardRef<HTMLDivElement, MyPlaceProps>((props, ref) => {
  const navigate = useNavigate();

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <Stack gap={2}>
        <PlaceSkeleton />
        <PlaceSkeleton />
        <PlaceSkeleton />
        <PlaceSkeleton />
        <PlaceSkeleton />
      </Stack>
      <SpeedDial
        icon={<AddOutlined />}
        sx={{ position: "absolute", bottom: 96, right: 26 }}
        ariaLabel={"Create"}
        onClick={() => navigate("/place/update")}
      />
    </Box>
  );
});

export default MyPlace;
