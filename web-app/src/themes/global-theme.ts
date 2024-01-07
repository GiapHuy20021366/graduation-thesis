import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: false;
        sm: false;
        md: false;
        lg: false;
        xl: false;
        mobile: true,
        tablet: true;
        laptop: true;
        desktop: true;
    }
}

export const breakPoints = {
    mobile: 0,
    tablet: 640,
    laptop: 1024,
    desktop: 1280
} as const;

export type BreakPoint = typeof breakPoints[keyof typeof breakPoints];

export const globalTheme = createTheme({
    breakpoints: {
        values: {
            mobile: breakPoints.mobile,
            tablet: breakPoints.tablet,
            laptop: breakPoints.laptop,
            desktop: breakPoints.desktop,
        }
    }
})