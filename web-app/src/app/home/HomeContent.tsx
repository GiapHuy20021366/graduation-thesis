import React from "react";
import { Stack, StackProps } from "@mui/material";
import {
  useAppContentContext,
  useComponentLanguage,
  useHomeViewerContext,
} from "../../hooks";
import ListEnd from "../common/viewer/data/ListEnd";

type HomeContentProps = StackProps;

const HomeContent = React.forwardRef<HTMLDivElement, HomeContentProps>(
  (props, ref) => {
    const lang = useComponentLanguage();
    const homeContext = useHomeViewerContext();
    const appContentContext = useAppContentContext();
    const { displayedFoods } = homeContext;

    return (
      <Stack
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          gap: 1,
          position: "relative",
          ...(props.sx ?? {}),
        }}
      >
        <ListEnd
          active={true}
          onRetry={() => {}}
          position={"sticky"}
          mt={3}
          bottom={5}
        />
      </Stack>
    );
  }
);

export default HomeContent;
