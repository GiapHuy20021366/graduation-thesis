import { Chip } from "@mui/material";

interface ICategoryPiece {
  text: string;
  onRemove?: () => void;
}

export default function CategoryPiece({ text, onRemove }: ICategoryPiece) {
  return (
    <Chip
      label={text}
      variant="outlined"
      onDelete={onRemove}
      sx={{
        mr: 1,
      }}
    />
  );
}
