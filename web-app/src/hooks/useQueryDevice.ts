import { useMediaQuery } from "@mui/material";
import { breakPoints } from "../themes";

export const deviceTypes = {
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  LAPTOP: "LAPTOP",
  DESKTOP: "DESKTOP",
} as const;

export type DeviceType = (typeof deviceTypes)[keyof typeof deviceTypes];

export const useQueryDevice = (): DeviceType => {
  const isMobile = useMediaQuery(`(max-width:${breakPoints.tablet - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width:${breakPoints.tablet}px) and (max-width:${
      breakPoints.laptop - 1
    }px)`
  );
  const isLaptop = useMediaQuery(
    `(min-width:${breakPoints.laptop}px) and (max-width:${
      breakPoints.desktop - 1
    }px)`
  );

  if (isMobile) return deviceTypes.MOBILE;
  else if (isTablet) return deviceTypes.TABLET;
  else if (isLaptop) return deviceTypes.LAPTOP;
  else return deviceTypes.DESKTOP;
};
