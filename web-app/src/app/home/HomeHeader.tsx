import React from "react";
import { Box, BoxProps, Divider } from "@mui/material";
import ToggleChipGroup from "../common/custom/ToggleChipGroup";
import { useComponentLanguage, useHomeViewerContext } from "../../hooks";
import { homeTabs } from "./home-tabs";
import ToggleChip from "../common/custom/ToggleChip";

type HomeHeaderProps = BoxProps;

const HomeHeader = React.forwardRef<HTMLDivElement, HomeHeaderProps>(
  (props, ref) => {
    const homeContext = useHomeViewerContext();
    const { tab, setTab } = homeContext;

    const lang = useComponentLanguage();

    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <ToggleChipGroup
          value={tab}
          exclusive
          onValueChange={(value) => setTab(value)}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            overflowY: "auto",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ToggleChip
            variant="outlined"
            label={lang("l-all")}
            value={homeTabs.ALL}
          />
          <ToggleChip
            variant="outlined"
            label={lang("l-registed")}
            value={homeTabs.REGISTED}
          />
          <ToggleChip
            variant="outlined"
            label={lang("l-around")}
            value={homeTabs.AROUND}
          />
          <ToggleChip
            variant="outlined"
            label={lang("l-suggested")}
            value={homeTabs.SUGGESTED}
          />
        </ToggleChipGroup>
        <Divider sx={{ mt: 2, width: "80%", borderColor: "primary.main" }} />
      </Box>
    );
  }
);

export default HomeHeader;
