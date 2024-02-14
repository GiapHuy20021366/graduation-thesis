import React from "react";
import { SpeedDial, Stack, StackProps } from "@mui/material";
import { PlaceOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";

type NearFoodProps = StackProps & {
  active?: boolean;
};

const NearFood = React.forwardRef<HTMLDivElement, NearFoodProps>(
  (props, ref) => {
    const navigate = useNavigate();
    const { active, ...rest } = props;
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
        {/* Around food */}
        <SpeedDial
          icon={<PlaceOutlined />}
          ariaLabel={"search"}
          sx={{ position: "absolute", bottom: 136, right: 26 }}
          onClick={() => navigate("/around/food")}
        />
      </Stack>
    );
  }
);

export default NearFood;
