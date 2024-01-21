import { Box, Typography } from "@mui/material";
import PurpleChip from "./custom/PurpleChip";

interface IOutSearchResultProps {
  textLabel?: string;
  chipLabel?: string;
  onTryClick?: () => void;
}

export default function OutSearchResult({
  textLabel,
  chipLabel,
  onTryClick,
}: IOutSearchResultProps) {
  return (
    <Box width={"100%"} textAlign={"center"}>
      <Typography>{textLabel}</Typography>
      <PurpleChip
        label={chipLabel}
        onClick={() => onTryClick && onTryClick()}
      />
    </Box>
  );
}
