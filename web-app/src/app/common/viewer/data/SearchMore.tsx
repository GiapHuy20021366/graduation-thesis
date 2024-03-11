import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";

type SearchMoreProps = StackProps & {
  onSearchMore?: () => void;
  active: boolean;
};

const SearchMore = React.forwardRef<HTMLDivElement, SearchMoreProps>(
  (props, ref) => {
    const { onSearchMore, active, ...rest } = props;
    return (
      <Stack
        ref={ref}
        width={"100%"}
        boxSizing={"border-box"}
        textAlign={"center"}
        {...rest}
        display={active ? "flex" : "none"}
      >
        <Typography>Bạn đã tìm kiếm hết</Typography>
        <Button onClick={() => onSearchMore && onSearchMore()}>
          Tìm kiếm thêm
        </Button>
      </Stack>
    );
  }
);

export default SearchMore;
