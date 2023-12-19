import { Stack } from "@mui/material";

interface IContentBody {
  children?: React.ReactNode;
}

export default function ContentBody({ children }: IContentBody) {
  return <Stack flex={1} display="flex" alignItems="center">{children}</Stack>;
}
