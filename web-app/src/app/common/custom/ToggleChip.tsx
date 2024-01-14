import { Chip, ChipProps, SxProps, Theme, alpha } from "@mui/material";
import React from "react";

type IToggleChipProps = ChipProps & {
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

const ToggleChip = React.forwardRef<HTMLDivElement, IToggleChipProps>(
  (props, ref) => {
    const { value, groupValues, onClickValue, ...rest } = props;
    const active = isSelected(value, groupValues);

    const handleClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ): void => {
      props.onClick && props.onClick(event);
      onClickValue && value !== undefined && onClickValue(value);
    };

    const sx: SxProps<Theme> | undefined = !active
      ? {
          ...props.sx,
          ":hover": {
            backgroundColor: alpha("#A020F0", 0.8) + "!important",
            color: "white !important",
          },
        }
      : {
          ...props.sx,
          backgroundColor: "#A020F0",
          color: "white",
          ":hover": {
            backgroundColor: alpha("#A020F0", 1) + "!important",
          },
        };

    return <Chip onClick={handleClick} ref={ref} {...rest} sx={sx} />;
  }
);

export default ToggleChip;
