import { Chip, ChipProps } from "@mui/material";
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

    return (
      <Chip
        onClick={handleClick}
        ref={ref}
        color={active ? "secondary" : "default"}
        {...rest}
        variant="filled"
      />
    );
  }
);

export default ToggleChip;
