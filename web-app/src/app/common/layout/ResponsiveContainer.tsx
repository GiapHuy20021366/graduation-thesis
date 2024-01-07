import { Box, SxProps, Theme } from "@mui/material";

interface IResponsiveContainerProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const defaultSx: SxProps<Theme> = {
  mt: 3,
  width: ["100%", "80%", "60%", "50%"],
};

export default function ResponsiveContainer({
  children,
  sx,
}: IResponsiveContainerProps) {
  return (
    <Box
      sx={{
        ...defaultSx,
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}
