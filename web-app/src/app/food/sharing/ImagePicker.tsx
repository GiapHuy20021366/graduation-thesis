import { AddBox } from "@mui/icons-material";
import { Box, IconButton, SxProps, Theme } from "@mui/material";
import { useRef } from "react";

interface IImagePickerProps {
  sx?: SxProps<Theme>;
  onPicked?: (file: File) => void;
}

export default function ImagePicker({ sx, onPicked }: IImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files == null || files.length === 0) return;
    const file = files[0];
    onPicked && onPicked(file);
  };

  return (
    <Box
      sx={{
        ...sx,
        position: "relative",
        ":hover": {
          backgroundColor: "#F3F6F9",
        },
      }}
    >
      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={handleChange}
      />
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          width: "100%",
          height: "100%",
          borderBox: "box-sizing",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <IconButton color="primary">
          <AddBox />
        </IconButton>
      </Box>
    </Box>
  );
}
