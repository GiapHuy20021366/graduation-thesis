import { Box } from "@mui/material";

interface IContentBody {
  children?: React.ReactNode;
}

export default function ContentBody({ children }: IContentBody) {
  return <Box flex={1}>{children}</Box>;
}
