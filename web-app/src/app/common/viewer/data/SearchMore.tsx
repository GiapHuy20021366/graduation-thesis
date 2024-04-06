import { Button, Stack, StackProps, Typography } from "@mui/material";
import React from "react";
import { useComponentLanguage } from "../../../../hooks";

type SearchMoreProps = StackProps & {
  onSearchMore?: () => void;
  active: boolean;
};

const SearchMore = React.forwardRef<HTMLDivElement, SearchMoreProps>(
  (props, ref) => {
    const { onSearchMore, active, ...rest } = props;
    const lang = useComponentLanguage("ViewerData");
    return (
      <Stack
        ref={ref}
        width={"100%"}
        boxSizing={"border-box"}
        textAlign={"center"}
        mt={2}
        {...rest}
        display={active ? "flex" : "none"}
      >
        <Typography>{lang("you-found-all")}</Typography>
        <Button onClick={() => onSearchMore && onSearchMore()}>
          {lang("search-more")}
        </Button>
      </Stack>
    );
  }
);

export default SearchMore;
