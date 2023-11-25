import { Box } from "@mui/material";

interface ISideBarItemTextProps {
  text: string;
}

export default function SideBarItemText({ text }: ISideBarItemTextProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        marginLeft: "1rem",
      }}
    >
      <span>{text}</span>
    </Box>
  );
}
