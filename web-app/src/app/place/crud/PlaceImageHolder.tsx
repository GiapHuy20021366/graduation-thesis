import React, { useRef } from "react";
import { Box, BoxProps, SpeedDial } from "@mui/material";
import {
  DeleteOutlined,
  ModeEditOutlineOutlined,
} from "@mui/icons-material";

type PlaceImageHolderProps = BoxProps & {
  imgSrc?: string | null;
  onImageUpdate?: (newFile: File) => void;
  onImageRemove?: () => void;
};

const PlaceImageHolder = React.forwardRef<
  HTMLDivElement,
  PlaceImageHolderProps
>((props, ref) => {
  const { imgSrc, onImageUpdate, onImageRemove, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickUpdate = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files == null || files.length === 0) return;
    const file = files[0];
    onImageUpdate && onImageUpdate(file);
  };

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      {imgSrc && <img src={imgSrc} loading="lazy" width={"100%"} />}
      <SpeedDial
        icon={<DeleteOutlined />}
        sx={{ position: "absolute", bottom: -13, right: 76, zIndex: 1000 }}
        ariaLabel={"Remove"}
        onClick={onImageRemove}
      />
      <SpeedDial
        icon={<ModeEditOutlineOutlined />}
        sx={{ position: "absolute", bottom: -13, right: 136, zIndex: 1000 }}
        ariaLabel={"Edit"}
        onClick={handleClickUpdate}
      />
      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={handleChange}
      />
    </Box>
  );
});

export default PlaceImageHolder;
