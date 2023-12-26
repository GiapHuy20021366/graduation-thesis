import { Stack } from "@mui/material";

interface IContentBody {
  children?: React.ReactNode;
}

export default function ContentBody({ children }: IContentBody) {
  return <Stack sx={{
    flex: 1,
    alignItems: "center",
    overflowY: "auto",
    margin: 0
  }}>{children}</Stack>;
}
