import React from "react";
import { SpeedDial, Stack, StackProps } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";

type MyFoodProps = StackProps & {
  active?: boolean;
};

const MyFood = React.forwardRef<HTMLDivElement, MyFoodProps>((props, ref) => {
  const { active, ...rest } = props;

  const navigate = useNavigate();
  return (
    <Stack
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
      display={active ? "flex" : "none"}
    >
      Near Place
      {/* Sharing food */}
      <SpeedDial
        icon={<AddOutlined />}
        ariaLabel={"search"}
        sx={{ position: "absolute", bottom: 136, right: 26 }}
        onClick={() => navigate("/food/sharing")}
      />
    </Stack>
  );
});

export default MyFood;
