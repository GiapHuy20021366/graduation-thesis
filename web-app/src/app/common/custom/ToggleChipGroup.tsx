import { Box, BoxProps } from "@mui/material";
import React from "react";

type IToggleChipGroupProps = BoxProps & {
  value: any;
  exclusive?: boolean;
  onValueChange?: (value: any) => void;
};

const ToggleChipGroup = React.forwardRef<HTMLDivElement, IToggleChipGroupProps>(
  (props, ref) => {
    const {
      value: propValue,
      exclusive: exclusiveProp,
      onValueChange,
      ...rest
    } = props;
    const onClickValue = (value: any): void => {
      const exclusive = exclusiveProp ?? false;
      const values = exclusive ? [propValue] : propValue;
      const index = values.indexOf(value);
      let newValues = values.slice();
      if (index > -1) {
        newValues.splice(index, 1);
      } else {
        if (exclusive) {
          newValues = [value];
        } else {
          newValues.push(value);
        }
      }
      if (onValueChange != null) {
        onValueChange(exclusive ? value : newValues);
      }
    };

    const renderChildren = () => {
      return React.Children.map(props.children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              onClickValue: onClickValue,
              groupValues: props.exclusive ? [props.value] : props.value,
            })
          : child
      );
    };

    return (
      <Box ref={ref} {...rest}>
        {renderChildren()}
      </Box>
    );
  }
);

export default ToggleChipGroup;
