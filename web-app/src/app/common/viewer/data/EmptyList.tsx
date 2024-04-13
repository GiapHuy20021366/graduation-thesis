import {
  Chip,
  ImageListItem,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import React from "react";
import { useComponentLanguage } from "../../../../hooks";

type EmptyListProps = StackProps & {
  active: boolean;
  onRetry?: () => void;
};

const EmptyList = React.forwardRef<HTMLDivElement, EmptyListProps>(
  (props, ref) => {
    const { active, onRetry, ...rest } = props;
    const lang = useComponentLanguage("ViewerData");
    return (
      <Stack
        ref={ref}
        width={"100%"}
        boxSizing={"border-box"}
        gap={2}
        p={2}
        minHeight={"50svh"}
        alignContent={"center"}
        alignItems={"center"}
        justifyContent={"center"}
        {...rest}
        display={active ? "flex" : "none"}
      >
        <ImageListItem sx={{ maxWidth: ["80%", "70%", "60%"] }}>
          <img src={"/imgs/empty.jpg"} alt={"not-found"} loading="lazy" />
        </ImageListItem>
        <Typography>
          {lang("Có vẻ như không có kết quả nào phù hợp")}
        </Typography>
        <Chip
          label={lang("retry")}
          color="secondary"
          onClick={onRetry}
          sx={{ width: "150px" }}
        />
      </Stack>
    );
  }
);

export default EmptyList;
