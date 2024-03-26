import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";
import { useComponentLanguage } from "../../../../hooks";

type ListEndProps = StackProps & {
  active: boolean;
  onRetry?: () => void;
};

const ListEnd = React.forwardRef<HTMLDivElement, ListEndProps>((props, ref) => {
  const { active, onRetry, ...rest } = props;
  const lang = useComponentLanguage("ViewerData");
  return (
    <Stack
      ref={ref}
      width={"100%"}
      boxSizing={"border-box"}
      textAlign={"center"}
      {...rest}
      display={active ? "flex" : "none"}
    >
      <Typography>{lang("end")}</Typography>
      {onRetry && <Button onClick={() => onRetry()}>{lang("retry")}</Button>}
    </Stack>
  );
});

export default ListEnd;
