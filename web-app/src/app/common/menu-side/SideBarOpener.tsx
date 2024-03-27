import { MenuOutlined, MenuOpen } from "@mui/icons-material";
import { useAppContentContext, useComponentLanguage } from "../../../hooks";
import {
  IconButton,
  IconButtonProps,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";

import React from "react";

type SideBarOpenerProps = IconButtonProps & {
  IconPropsSx?: SxProps<Theme>;
};

const SideBarOpener = React.forwardRef<HTMLButtonElement, SideBarOpenerProps>(
  (props, ref) => {
    const { IconPropsSx, ...rest } = props;
    const appContentContext = useAppContentContext();
    const isActive = appContentContext.menuSide.active;
    const lang = useComponentLanguage("SideBarOpener");
    return (
      <Tooltip
        arrow
        title={`${isActive ? lang("close-title") : lang("open-title")}`}
      >
        <IconButton
          ref={ref}
          {...rest}
          onClick={() => appContentContext.setMenuSideActive(!isActive)}
        >
          {isActive ? (
            <MenuOpen sx={{ ...IconPropsSx }} />
          ) : (
            <MenuOutlined sx={{ ...IconPropsSx }} />
          )}
        </IconButton>
      </Tooltip>
    );
  }
);

export default SideBarOpener;
