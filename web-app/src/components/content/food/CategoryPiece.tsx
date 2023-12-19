import { ClearOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";

interface ICategoryPiece {
  text: string;
  onRemove?: () => void;
}

export default function CategoryPiece({ text, onRemove }: ICategoryPiece) {
  return (
    <Box
      sx={{
        display: "inline-block",
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        boxSizing: "border-box",
        margin: "4px",
        position: "relative",
      }}
    >
      <Box component="div" minWidth={30} padding={"0 0.5em"}>{text}</Box>
      <ClearOutlined
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          cursor: "pointer",
          width: "1rem",
          height: "1rem"
        }}
        onClick={() => onRemove && onRemove()}
      />
    </Box>
  );
}
