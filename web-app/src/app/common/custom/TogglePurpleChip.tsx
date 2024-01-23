import { Chip, ChipProps, alpha} from "@mui/material";
import React from "react";

type ITogglePurpleChipProps = ChipProps & {
  groupValues?: any;
  value?: any;
  onClickValue?: (value: any) => void;
};

const isSelected = (value: any, groupValues: any): boolean => {
  if (Array.isArray(groupValues)) {
    return groupValues.includes(value);
  }
  return false;
};

const TogglePurpleChip = React.forwardRef<
  HTMLDivElement,
  ITogglePurpleChipProps
>((props, ref) => {
  const { value, groupValues, onClickValue, ...rest } = props;
  const active = isSelected(value, groupValues);

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    props.onClick && props.onClick(event);
    onClickValue && value !== undefined && onClickValue(value);
  };

  const defaultSx = {
    backgroundColor: active ? "purple" : "white",
    width: "fit-content",
    fontWeight: 600,
    fontSize: "1.3rem",
    color: active ? "white" : "black",
    cursor: "pointer",
    ":hover": {
      backgroundColor: active ? "purple" : alpha("#A020F0", 0.5),
      color: "white",
    },
  };

  return (
    <Chip
      onClick={handleClick}
      ref={ref}
      {...rest}
      sx={{
        ...defaultSx,
        ...props.sx,
      }}
    />
  );
});

export default TogglePurpleChip;
