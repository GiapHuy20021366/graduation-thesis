import { Stack, SxProps, Theme } from "@mui/material";

interface IContentBody {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function ContentBody({ children, sx }: IContentBody) {
  return (
    <Stack
      sx={{
        flex: 1,
        alignItems: "center",
        overflowY: "auto",
        margin: "0 -8px",
        px: "8px",
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}
